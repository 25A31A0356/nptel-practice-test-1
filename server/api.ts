import express, { type Request, type Response, type Router } from "express";
import os from "node:os";
import path from "node:path";
import { exec } from "node:child_process";
import { contestDb } from "./db";

export function createApiRouter(): Router {
  const router = express.Router();
  router.use(express.json());

  // CORS headers for all API requests
  router.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-host-key");
    if (_req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // 1. Network IP Discovery for Multi-Device QR Code Access
  router.get("/network-ip", (_req, res) => {
    const interfaces = os.networkInterfaces();
    const ips: string[] = [];
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          ips.push(iface.address);
        }
      }
    }
    const port = process.env.PORT || 3000;
    res.json({ success: true, ips, port: Number(port) });
  });

  // 2. Public Contest Info
  router.get("/contest/info", (_req, res) => {
    const config = contestDb.getConfig();
    const qr = contestDb.getQRSession();
    res.json({
      success: true,
      contest: {
        contest_id: config.contest_id,
        title: config.title,
        institution: config.institution,
        department: config.department,
        event_name: config.event_name,
        competition_name: config.competition_name,
        venue: config.venue,
        date: config.date,
        time_window: config.time_window,
        duration_minutes: config.duration_minutes,
        is_active: config.is_active,
        results_released: config.results_released,
        allow_registration: config.allow_registration,
        qr_active: qr.status === "ACTIVE"
      }
    });
  });

  // 3. Registration (Host Privileged Only - Students enter by Roll Number)
  router.post("/register", requireHost, (req, res) => {
    const { roll_number, student_name, department, year, section } = req.body;
    if (!roll_number || !student_name) {
      res.status(400).json({ success: false, message: "Roll Number and Student Name are required." });
      return;
    }

    const result = contestDb.registerStudent({
      roll_number,
      student_name,
      department: department || "Mechanical Engineering",
      year: year || "2nd Year",
      section: section || "A"
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  });

  // 4. Check Registration Status (Host Only to prevent student enumeration)
  router.get("/registration/:rollNumber", requireHost, (req, res) => {
    const reg = contestDb.getRegistration(req.params.rollNumber);
    if (!reg) {
      res.status(404).json({ success: false, message: "Registration record not found." });
      return;
    }
    res.json({ success: true, registration: reg });
  });

  // 4b. Remove Registered Student (Host Only)
  router.delete("/host/registration/:rollNumber", requireHost, (req, res) => {
    const result = contestDb.removeRegistration(req.params.rollNumber);
    if (!result.success) {
      res.status(404).json(result);
      return;
    }
    res.json(result);
  });

  router.post("/host/registration/delete", requireHost, (req, res) => {
    const { roll_number } = req.body;
    if (!roll_number) {
      res.status(400).json({ success: false, message: "Roll number is required." });
      return;
    }
    const result = contestDb.removeRegistration(roll_number);
    if (!result.success) {
      res.status(404).json(result);
      return;
    }
    res.json(result);
  });

  // 5. Verified Real-Time QR Scan Registration
  router.post("/qr/scan", (req, res) => {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, message: "QR Token is required." });
      return;
    }
    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress;
    const ua = req.headers["user-agent"];
    const result = contestDb.recordRealScan(token, ip, ua);
    res.json(result);
  });

  // 6. Contestant QR Entry Verification
  router.post("/contest/verify-entry", (req, res) => {
    const { roll_number, token } = req.body;
    if (!roll_number) {
      res.status(400).json({ success: false, message: "Roll Number is required." });
      return;
    }

    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress;
    const ua = req.headers["user-agent"];
    if (token) {
      contestDb.recordRealScan(token, ip, ua);
    }

    const result = contestDb.verifyEntry(roll_number, token);
    res.json(result);
  });

  // 6. Start Official Contest Attempt
  router.post("/contest/start", (req, res) => {
    const { roll_number, token } = req.body;
    if (!roll_number) {
      res.status(400).json({ success: false, message: "Roll Number is required." });
      return;
    }

    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress;
    const ua = req.headers["user-agent"];

    const result = contestDb.startAttempt(roll_number, token, ip, ua);
    if (!result.success) {
      res.status(403).json(result);
      return;
    }

    res.json(result);
  });

  // 7. Get Contest Session State & Authoritative Remaining Time
  router.get("/contest/session/:attemptId", (req, res) => {
    const dashboard = contestDb.getHostDashboardData();
    const attempt = dashboard.attempts.find((a) => a.attempt_id === req.params.attemptId);
    if (!attempt) {
      res.status(404).json({ success: false, message: "Contest session not found." });
      return;
    }

    const now = Date.now();
    const expiry = new Date(attempt.expires_at).getTime();
    const remainingSeconds = Math.max(0, Math.floor((expiry - now) / 1000));

    if (remainingSeconds <= 0 && (attempt.status === "ACTIVE" || attempt.status === "STARTED")) {
      contestDb.submitAttempt(attempt.attempt_id);
    }

    res.json({
      success: true,
      attempt_id: attempt.attempt_id,
      roll_number: attempt.roll_number,
      student_name: attempt.student_name,
      status: attempt.status,
      started_at: attempt.started_at,
      expires_at: attempt.expires_at,
      remaining_seconds: remainingSeconds,
      answers: attempt.answers,
      hints_used: attempt.hints_used || [],
      hint_penalty_total: attempt.hint_penalty_total || 0,
      tab_switch_count: attempt.tab_switch_count || 0,
      questions: contestDb.getAttemptPublicQuestions(attempt.attempt_id)
    });
  });

  // 8. Progressive Answer Auto-Save (Supports /save-answer and /answer alias)
  const handleSaveAnswer = (req: Request, res: Response) => {
    const { attempt_id, question_id, option_id } = req.body;
    if (!attempt_id || !question_id) {
      res.status(400).json({ success: false, message: "Missing required parameters." });
      return;
    }

    const result = contestDb.saveAnswer(attempt_id, question_id, option_id || "");
    res.json(result);
  };

  router.post("/contest/save-answer", handleSaveAnswer);
  router.post("/contest/answer", handleSaveAnswer);

  // 9. Hint Request (Disabled in NPTEL Exam)
  router.post("/contest/hint", (req, res) => {
    res.status(400).json({ success: false, message: "Hints are disabled for this official NPTEL exam." });
  });

  // 10. Anti-Cheat Event Logger (Tab Switches & Back Button)
  router.post("/contest/log-event", (req, res) => {
    const { attempt_id, event_type, details } = req.body;
    if (!attempt_id || !event_type) {
      res.status(400).json({ success: false, message: "Missing parameters." });
      return;
    }

    const result = contestDb.logContestantEvent(attempt_id, event_type, details || "");
    res.json(result);
  });

  // 11. Abandon Contest Session
  router.post("/contest/abandon", (req, res) => {
    const { attempt_id, reason } = req.body;
    if (!attempt_id) {
      res.status(400).json({ success: false, message: "Attempt ID required." });
      return;
    }

    const result = contestDb.abandonAttempt(attempt_id, reason);
    res.json(result);
  });

  // 12. Final Contest Submission
  router.post("/contest/submit", (req, res) => {
    const { attempt_id } = req.body;
    if (!attempt_id) {
      res.status(400).json({ success: false, message: "Attempt ID required." });
      return;
    }

    const result = contestDb.submitAttempt(attempt_id);
    res.json({
      success: true,
      message: "EXAM SUBMITTED SUCCESSFULLY\nYour answers have been securely recorded.\nOfficial results are locked until released by the host."
    });
  });

  // 13. Public Leaderboard
  router.get("/leaderboard", (req, res) => {
    const data = contestDb.getLeaderboard(false);
    const searchRoll = typeof req.query.search_roll === "string" ? req.query.search_roll.trim().toUpperCase() : undefined;

    let userRankEntry = null;
    if (searchRoll) {
      // Look in full host leaderboard to find student's position safely
      const fullData = contestDb.getLeaderboard(true);
      userRankEntry = fullData.leaderboard.find((e) => e.roll_number === searchRoll) || null;
    }

    res.json({
      success: true,
      results_released: data.results_released,
      stats: data.stats,
      leaderboard: data.leaderboard,
      user_position: userRankEntry
        ? {
            rank: userRankEntry.rank,
            roll_number: userRankEntry.roll_number,
            student_name: userRankEntry.student_name,
            department: userRankEntry.department,
            correct_count: userRankEntry.correct_count,
            score: userRankEntry.score,
            max_score: 40,
            time_formatted: userRankEntry.time_formatted,
            status: userRankEntry.status
          }
        : null
    });
  });

  // =========================================================================
  // HOST ADMIN ENDPOINTS
  // =========================================================================

  // Verify Host Auth Helper
  function requireHost(req: Request, res: Response, next: () => void) {
    const key = req.headers["x-host-key"] || req.body?.host_key || req.query?.host_key;
    if (key !== "738637") {
      res.status(401).json({ success: false, message: "Access Denied: Invalid Host Key." });
      return;
    }
    next();
  }

  // Host Login Verification
  router.post("/host/login", (req, res) => {
    const { password } = req.body;
    if (password === "738637") {
      res.json({ success: true, message: "Host Console Unlocked." });
      return;
    }
    res.status(401).json({ success: false, message: "Invalid passkey. Access denied." });
  });

  // Host Full Dashboard Data
  router.get("/host/dashboard", requireHost, (_req, res) => {
    const data = contestDb.getHostDashboardData();
    res.json({ success: true, data });
  });

  // Host Config Update
  router.post("/host/config", requireHost, (req, res) => {
    contestDb.updateConfig(req.body);
    res.json({ success: true, config: contestDb.getConfig() });
  });

  // Host QR Controls
  router.post("/host/qr/generate", requireHost, (req, res) => {
    const qr = contestDb.generateQR(req.body.activateImmediately ?? true);
    res.json({ success: true, qr_session: qr });
  });

  router.post("/host/qr/activate", requireHost, (_req, res) => {
    const qr = contestDb.activateQR();
    res.json({ success: true, qr_session: qr });
  });

  router.post("/host/qr/deactivate", requireHost, (_req, res) => {
    const qr = contestDb.deactivateQR();
    res.json({ success: true, qr_session: qr });
  });

  router.post("/host/qr/expire", requireHost, (_req, res) => {
    const qr = contestDb.expireQR();
    res.json({ success: true, qr_session: qr });
  });

  // Host Result Release
  router.post("/host/results/release", (req, res) => {
    const { passkey } = req.body;
    const result = contestDb.releaseResults(passkey || "");
    if (!result.success) {
      res.status(403).json(result);
      return;
    }
    res.json(result);
  });

  router.post("/host/results/lock", (req, res) => {
    const { passkey } = req.body;
    const result = contestDb.lockResults(passkey || "");
    if (!result.success) {
      res.status(403).json(result);
      return;
    }
    res.json(result);
  });

  // Host Authorized Reattempt Reset (Requires host key "738637")
  router.post("/host/attempt/reset", (req, res) => {
    const { roll_number, reset_key } = req.body;
    if (!roll_number || !reset_key) {
      res.status(400).json({ success: false, message: "Roll Number and Reset Key are required." });
      return;
    }

    const result = contestDb.resetAttemptForRoll(roll_number, reset_key);
    if (!result.success) {
      res.status(403).json(result);
      return;
    }

    res.json(result);
  });

  // Host Unmasked Leaderboard
  router.get("/host/leaderboard", requireHost, (_req, res) => {
    const data = contestDb.getLeaderboard(true);
    res.json({ success: true, ...data });
  });

  // Host Question-Level Analytics
  router.get("/host/question-analytics", requireHost, (_req, res) => {
    const analytics = contestDb.getQuestionAnalytics();
    res.json({ success: true, analytics });
  });

  // Host Audit Logs
  router.get("/host/audit-logs", requireHost, (_req, res) => {
    res.json({ success: true, logs: contestDb.getAuditLogs() });
  });

  // Host Clear All Audit Logs
  router.delete("/host/audit-logs", requireHost, (_req, res) => {
    const result = contestDb.clearAllAuditLogs();
    res.json(result);
  });

  // Host Delete Single Audit Log Entry
  router.delete("/host/audit-logs/:id", requireHost, (req, res) => {
    const logId = req.params.id;
    const result = contestDb.deleteAuditLog(logId);
    res.json(result);
  });

  // Host Export (CSV/JSON)
  router.get("/host/export", requireHost, (req, res) => {
    const format = req.query.format || "json";
    const data = contestDb.getHostDashboardData();

    if (format === "csv") {
      const exportType = (req.query.type as string) || "results";
      let filename = "nptel_metal_additive_manufacturing_results.csv";
      const rows: string[] = [];

      if (exportType === "roster") {
        filename = "nptel_registered_candidates_roster.csv";
        rows.push(["Roll Number", "Student Name", "Department", "Year", "Section", "Status", "Registration Time"].join(","));
        const regs = contestDb.getAllRegistrations();
        for (const reg of regs) {
          rows.push(
            [
              `"${reg.roll_number}"`,
              `"${reg.student_name}"`,
              `"${reg.department}"`,
              `"${reg.year}"`,
              `"${reg.section}"`,
              `"${reg.status}"`,
              `"${reg.registration_time || ""}"`
            ].join(",")
          );
        }
      } else if (exportType === "itemized") {
        filename = "nptel_candidate_itemized_responses.csv";
        rows.push(["Roll Number", "Student Name", "Question ID", "Candidate Answer", "Submission Time"].join(","));
        const attempts = Object.values(data.attempts || {}) as any[];
        for (const att of attempts) {
          const answers = att.answers || {};
          const assigned = att.assigned_question_ids || [];
          for (const qId of assigned) {
            rows.push(
              [
                `"${att.roll_number}"`,
                `"${att.student_name}"`,
                `"${qId}"`,
                `"${answers[qId] || "UNANSWERED"}"`,
                `"${att.submitted_at || ""}"`
              ].join(",")
            );
          }
        }
      } else if (exportType === "audit" || exportType === "logs") {
        filename = "nptel_examination_audit_event_logs.csv";
        rows.push(["Log ID", "Timestamp", "Event Type", "Roll Number", "Attempt ID", "Details"].join(","));
        const logs = contestDb.getAuditLogs();
        for (const l of logs) {
          rows.push([
            `"${l.id}"`,
            `"${l.timestamp}"`,
            `"${l.event_type}"`,
            `"${l.roll_number || ""}"`,
            `"${l.attempt_id || ""}"`,
            `"${String(l.details || "").replace(/"/g, '""')}"`
          ].join(","));
        }
      } else {
        // Default: Official Results Leaderboard CSV (Exact 14-column classified format matching official results)
        filename = "nptel_metal_additive_manufacturing_results.csv";
        const headers = [
          "Rank",
          "Roll Number",
          "Student Name",
          "Department",
          "Year",
          "Section",
          "Final Score (/40)",
          "Correct Count (/40)",
          "Incorrect Count",
          "Unanswered Count",
          "Time Taken (MM:SS)",
          "Time Taken (Seconds)",
          "Status",
          "Submission Timestamp"
        ];
        rows.push(headers.join(","));

        const leaderboard = contestDb.getLeaderboard(true).leaderboard;
        const seenRolls = new Set<string>();

        for (const entry of leaderboard) {
          seenRolls.add(entry.roll_number.toUpperCase());
          rows.push(
            [
              entry.rank,
              `"${entry.roll_number}"`,
              `"${entry.student_name}"`,
              `"${entry.department}"`,
              `"${entry.year}"`,
              `"${entry.section}"`,
              entry.score,
              entry.correct_count,
              entry.incorrect_count,
              entry.unanswered_count,
              `"${entry.time_formatted}"`,
              entry.time_taken_seconds,
              entry.status,
              `"${entry.submitted_at || ""}"`
            ].join(",")
          );
        }
      }

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      // \uFEFF is the UTF-8 BOM so Microsoft Excel cleanly auto-formats all columns without encoding issues
      res.send("\uFEFF" + rows.join("\r\n"));
      return;
    }

    res.json({ success: true, data });
  });

  // Host Purge Test Data & Reset to Clean State (Requires Event Host key 738637)
  router.post("/host/purge", (req, res) => {
    const passkey = req.body?.passkey || req.body?.host_key || req.headers["x-host-key"] || "";
    const result = contestDb.purgeAllContestData(String(passkey).trim());
    if (!result.success) {
      res.status(403).json(result);
      return;
    }
    res.json(result);
  });

  // Host Sync All Exam Records to Kaggle
  router.post("/host/kaggle/sync", requireHost, (_req, res) => {
    const scriptPath = path.resolve(process.cwd(), "server", "kaggle_sync.py");
    exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
      if (error && !stdout) {
        res.status(500).json({ success: false, message: `Kaggle sync execution failed: ${stderr || error.message}` });
        return;
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        res.json(parsed);
      } catch {
        res.json({
          success: true,
          message: "Kaggle export generated and saved locally.",
          output: stdout
        });
      }
    });
  });

  return router;
}
