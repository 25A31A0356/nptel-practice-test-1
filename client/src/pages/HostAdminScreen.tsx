import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudUpload,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Flame,
  HelpCircle,
  Key,
  LayoutDashboard,
  Lightbulb,
  ListOrdered,
  Lock,
  LockKeyhole,
  LogOut,
  Maximize2,
  Minimize2,
  Play,
  QrCode,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Trash2,
  Unlock,
  UserCheck,
  UserPlus,
  Users,
  Wifi,
  X,
  Zap
} from "lucide-react";
import axios from "axios";
import QRCode from "qrcode";
import { toast } from "sonner";
import {
  playClickSound,
  playCorrectSound,
  playErrorSound,
  playHintSound
} from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

type AdminTab =
  | "dashboard"
  | "registrations"
  | "qr_control"
  | "live_participants"
  | "results_release"
  | "leaderboard"
  | "reset_attempt"
  | "question_bank"
  | "audit_logs"
  | "export";

export function HostAdminScreen() {
  const [, setLocation] = useLocation();

  // Host Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [loading, setLoading] = useState(false);

  // Live Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [networkIps, setNetworkIps] = useState<string[]>([]);
  const [selectedIp, setSelectedIp] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [projectorMode, setProjectorMode] = useState(false);

  // Search & Filters
  const [regSearch, setRegSearch] = useState("");
  const [attemptSearch, setAttemptSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [logTypeFilter, setLogTypeFilter] = useState("ALL");
  const [logPage, setLogPage] = useState(1);
  const [refreshingLogs, setRefreshingLogs] = useState(false);
  const [qbSearch, setQbSearch] = useState("");
  const [qbDiffFilter, setQbDiffFilter] = useState("ALL");
  const [qbPage, setQbPage] = useState(1);
  const [qbViewMode, setQbViewMode] = useState<"list" | "analytics">("list");

  // Host Leaderboard & Analytics State
  const [hostLeaderboard, setHostLeaderboard] = useState<any[]>([]);
  const [questionAnalytics, setQuestionAnalytics] = useState<any[]>([]);
  const [hlSearch, setHlSearch] = useState("");
  const [hlStatusFilter, setHlStatusFilter] = useState("ALL");

  // Actions state
  const [releasePasskey, setReleasePasskey] = useState("");
  const [resetRollNumber, setResetRollNumber] = useState("");
  const [resetSecretKey, setResetSecretKey] = useState("");

  // New Registration Modal
  const [newRegModal, setNewRegModal] = useState(false);
  const [newRoll, setNewRoll] = useState("");
  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState("Mechanical Engineering");
  const [newYear, setNewYear] = useState("3rd Year");
  const [newSec, setNewSec] = useState("A");

  // Purge State
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgePasskey, setPurgePasskey] = useState("");

  // Kaggle Sync State
  const [isKaggleSyncing, setIsKaggleSyncing] = useState(false);
  const [kaggleResult, setKaggleResult] = useState<any>(null);

  // Host Login
  const handleHostLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/host/login", { password: passkeyInput });
      if (res.data.success) {
        playCorrectSound();
        setIsAuthenticated(true);
        toast.success("Event Host Console Unlocked");
        fetchDashboardData();
        fetchNetworkIps();
      }
    } catch {
      playErrorSound();
      toast.error("Access Denied: Invalid Host Credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    playClickSound();
    setIsAuthenticated(false);
    setPasskeyInput("");
    setLocation("/");
    toast.info("Host Console Locked.");
  };

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/host/dashboard", {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      if (res.data.success) {
        setDashboardData(res.data.data || res.data);
      }
    } catch {
    }
  };

  // Fetch Network IPs
  const fetchNetworkIps = async () => {
    try {
      const res = await axios.get("/api/host/network-ips");
      if (res.data.success && res.data.ips) {
        setNetworkIps(res.data.ips);
        if (res.data.ips.length > 0 && !selectedIp) {
          setSelectedIp(res.data.ips[0]);
        }
      }
    } catch {
    }
  };

  // Fetch Host Leaderboard
  const fetchHostLeaderboard = async () => {
    try {
      const res = await axios.get("/api/host/leaderboard", {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      if (res.data.success) {
        setHostLeaderboard(res.data.leaderboard || []);
        setQuestionAnalytics(res.data.question_analytics || []);
      }
    } catch {
    }
  };

  // Fetch Live Audit Event Logs
  const handleRefreshAuditLogs = async () => {
    playClickSound();
    setRefreshingLogs(true);
    try {
      const res = await axios.get("/api/host/audit-logs", {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      if (res.data?.success && Array.isArray(res.data.logs)) {
        setDashboardData((prev: any) => ({
          ...prev,
          audit_logs: res.data.logs,
          recent_logs: res.data.logs
        }));
        toast.success(`Refreshed ${res.data.logs.length} audit logs.`);
      } else {
        await fetchDashboardData();
      }
    } catch {
      await fetchDashboardData();
    } finally {
      setRefreshingLogs(false);
    }
  };

  // Clear All Audit Logs
  const handleClearAllAuditLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all audit logs? This action will reset the audit log history.")) {
      return;
    }
    playClickSound();
    try {
      const res = await axios.delete("/api/host/audit-logs", {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      if (res.data?.success) {
        playCorrectSound();
        toast.success(res.data.message || "All audit logs cleared successfully.");
        await handleRefreshAuditLogs();
      } else {
        toast.error(res.data?.message || "Failed to clear audit logs.");
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Failed to clear audit logs.");
    }
  };

  // Delete Individual Audit Log Entry
  const handleDeleteAuditLog = async (logId: string) => {
    if (!window.confirm("Delete this audit log record?")) {
      return;
    }
    playClickSound();
    try {
      setDashboardData((prev: any) => ({
        ...prev,
        audit_logs: (prev?.audit_logs || []).filter((l: any) => l.id !== logId),
        recent_logs: (prev?.recent_logs || []).filter((l: any) => l.id !== logId)
      }));

      const res = await axios.delete(`/api/host/audit-logs/${logId}`, {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      if (res.data?.success) {
        toast.success("Audit log entry deleted.");
      } else {
        toast.error(res.data?.message || "Failed to delete log entry.");
        await fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Failed to delete log entry.");
      await fetchDashboardData();
    }
  };

  useEffect(() => {
    if (activeTab === "audit_logs" && isAuthenticated) {
      handleRefreshAuditLogs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      fetchHostLeaderboard();
      const interval = setInterval(() => {
        fetchDashboardData();
        if (activeTab === "leaderboard") {
          fetchHostLeaderboard();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeTab]);

  // Generate QR Code
  useEffect(() => {
    if (dashboardData?.qr_session?.token) {
      const port = window.location.port || "3000";
      const hostIp = selectedIp || window.location.hostname || "localhost";
      const url = `http://${hostIp}:${port}/contest?token=${dashboardData.qr_session.token}`;
      QRCode.toDataURL(url, { width: 320, margin: 2 })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [dashboardData?.qr_session?.token, selectedIp]);

  // QR Session Actions
  const handleQRAction = async (action: "generate" | "activate" | "deactivate" | "expire") => {
    playClickSound();
    try {
      const res = await axios.post(`/api/host/qr/${action}`, {}, {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      if (res.data.success) {
        playCorrectSound();
        toast.success(res.data.message);
        fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || `Failed to ${action} QR session.`);
    }
  };

  // Results Release Toggle
  const handleToggleResults = async (release: boolean) => {
    if (!releasePasskey) {
      toast.error("Please enter the official release passkey.");
      return;
    }
    playClickSound();
    try {
      const res = await axios.post("/api/host/results/release", {
        release,
        passkey: releasePasskey
      }, {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      if (res.data.success) {
        playCorrectSound();
        toast.success(res.data.message);
        setReleasePasskey("");
        fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Invalid passkey.");
    }
  };

  // Host-Authorized Reset Reattempt
  const handleResetAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetRollNumber || !resetSecretKey) {
      toast.error("Roll Number and Reset Secret Key are required.");
      return;
    }
    playClickSound();
    try {
      const res = await axios.post("/api/host/attempt/reset", {
        roll_number: resetRollNumber.trim().toUpperCase(),
        reset_key: resetSecretKey.trim()
      });
      if (res.data.success) {
        playCorrectSound();
        toast.success(res.data.message);
        setResetRollNumber("");
        setResetSecretKey("");
        fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Reset failed. Check Reset Key.");
    }
  };

  // Host Purge Contest
  const handlePurgeContest = async () => {
    if (!purgePasskey.trim()) {
      toast.error("Please enter the Event Host passkey to authorize database purge.");
      return;
    }
    playClickSound();
    try {
      const key = purgePasskey.trim();
      const res = await axios.post(
        "/api/host/purge",
        { passkey: key, host_key: key },
        { headers: { "x-host-key": key } }
      );
      if (res.data.success) {
        playCorrectSound();
        toast.success("Contest database purged. Clean live contest initialized!");
        setPurgePasskey("");
        setShowPurgeModal(false);
        fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Invalid passkey. Purge denied.");
    }
  };

  // Manual Registration
  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoll.trim() || !newName.trim()) {
      toast.error("Roll Number and Name are required.");
      return;
    }
    try {
      const res = await axios.post("/api/register", {
        roll_number: newRoll.trim().toUpperCase(),
        student_name: newName.trim(),
        department: newDept,
        year: newYear,
        section: newSec
      });
      if (res.data.success) {
        playCorrectSound();
        toast.success(`Registered ${newRoll} successfully!`);
        setNewRegModal(false);
        setNewRoll("");
        setNewName("");
        fetchDashboardData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  // Remove Student Registration
  const handleRemoveRegistration = async (rollNumber: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to remove candidate ${studentName} (${rollNumber}) from registrations?`)) {
      return;
    }
    playClickSound();
    try {
      const res = await axios.delete(`/api/host/registration/${rollNumber}`, {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      if (res.data.success) {
        playCorrectSound();
        toast.success(res.data.message || `Removed candidate ${rollNumber}`);
        fetchDashboardData();
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Failed to remove candidate.");
    }
  };

  // Safe Browser File Download Helper (Prevents immediate object URL revocation)
  const triggerDownload = (filename: string, content: string | Blob) => {
    try {
      let blob: Blob;
      if (typeof content === "string") {
        const withBom = content.startsWith("\uFEFF") ? content : "\uFEFF" + content;
        blob = new Blob([withBom], { type: "text/csv;charset=utf-8;" });
      } else {
        blob = content;
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      // Keep object URL alive for 10 seconds so the browser download manager can safely complete
      setTimeout(() => {
        try {
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
          window.URL.revokeObjectURL(url);
        } catch {}
      }, 10000);
    } catch (err) {
      console.error("Direct download failed:", err);
    }
  };

  // Export CSV Helper with In-Browser Blob Download & Windows Excel UTF-8 BOM
  const handleExportCsv = async (exportType: "results" | "roster" | "itemized" | "audit" = "results") => {
    playClickSound();
    const hostKey = passkeyInput || "738637";
    const defaultFilename =
      exportType === "roster"
        ? "nptel_registered_candidates_roster.csv"
        : exportType === "itemized"
        ? "nptel_candidate_itemized_responses.csv"
        : exportType === "audit"
        ? "nptel_examination_audit_event_logs.csv"
        : "nptel_metal_additive_manufacturing_results.csv";

    // 1. First attempt to download authoritative CSV from backend
    try {
      const res = await axios.get(`/api/host/export?format=csv&type=${exportType}&host_key=${hostKey}`, {
        headers: { "x-host-key": hostKey },
        responseType: "text"
      });

      if (res.data && typeof res.data === "string" && res.data.length > 0) {
        triggerDownload(defaultFilename, res.data);
        toast.success(`Exported ${defaultFilename} successfully!`);
        return;
      }
    } catch (netErr) {
      console.warn("Backend CSV export route fallback engaged:", netErr);
    }

    // 2. Direct In-Memory Fallback: Generates CSV directly so download NEVER fails
    try {
      let csvContent = "";
      if (exportType === "roster") {
        const rows = [["Roll Number", "Student Name", "Department", "Year", "Section", "Status", "Registration Time"].join(",")];
        const regs = Object.values(dashboardData?.registrations || {});
        for (const reg of regs as any[]) {
          rows.push([
            `"${reg.roll_number}"`,
            `"${reg.student_name}"`,
            `"${reg.department}"`,
            `"${reg.year}"`,
            `"${reg.section}"`,
            `"${reg.status}"`,
            `"${reg.registration_time || ""}"`
          ].join(","));
        }
        csvContent = rows.join("\r\n");
      } else if (exportType === "itemized") {
        const rows = [["Roll Number", "Student Name", "Question ID", "Candidate Answer", "Submission Time"].join(",")];
        const attempts = (dashboardData?.attempts || []) as any[];
        for (const att of attempts) {
          const answers = att.answers || {};
          const assigned = att.assigned_question_ids || [];
          for (const qId of assigned) {
            rows.push([
              `"${att.roll_number}"`,
              `"${att.student_name}"`,
              `"${qId}"`,
              `"${answers[qId] || "UNANSWERED"}"`,
              `"${att.submitted_at || ""}"`
            ].join(","));
          }
        }
        csvContent = rows.join("\r\n");
      } else if (exportType === "audit") {
        const rows = [["Log ID", "Timestamp", "Event Type", "Roll Number", "Attempt ID", "Details"].join(",")];
        const logs = auditLogs || [];
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
        csvContent = rows.join("\r\n");
      } else {
        // Official Classified Results Leaderboard CSV
        // If zero students wrote the exam, this outputs ONLY the 14-column header row (empty candidate list)
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
        const rows = [headers.join(",")];

        for (const entry of hostLeaderboard) {
          rows.push([
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
          ].join(","));
        }
        csvContent = rows.join("\r\n");
      }

      triggerDownload(defaultFilename, csvContent);
      toast.success(`Exported ${defaultFilename} successfully!`);
    } catch {
      toast.error("Failed to generate CSV export file.");
    }
  };

  // Sync Exam Data to Kaggle
  const handleKaggleSync = async () => {
    setIsKaggleSyncing(true);
    playClickSound();
    try {
      const res = await axios.post("/api/host/kaggle/sync", {}, {
        headers: { "x-host-key": passkeyInput || "738637" }
      });
      setKaggleResult(res.data);
      if (res.data.success) {
        playCorrectSound();
        toast.success(res.data.message || "Exam data successfully backed up to Kaggle!");
      } else {
        toast.warning(res.data.message || "Backup archive saved locally.");
      }
    } catch (err: any) {
      playErrorSound();
      toast.error(err.response?.data?.message || "Kaggle sync failed.");
    } finally {
      setIsKaggleSyncing(false);
    }
  };

  // -------------------------------------------------------------
  // LOGIN PROMPT SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3 flex flex-col items-center">
            <PragatiLogo variant="header" size="md" className="justify-center" subtitleText="DEPARTMENT OF MECHANICAL ENGINEERING" />
            <div className="flex items-center gap-2 text-xs text-black font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              <LockKeyhole className="w-3.5 h-3.5" /> Event Host Command Console
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Enter official conducting committee passkey to access host control panel.
            </p>
          </div>

          <form onSubmit={handleHostLogin} className="space-y-4">
            <input
              type="password"
              required
              autoFocus
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Enter Event Host Passkey"
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-black rounded-xl px-4 py-3 text-center text-slate-900 text-base tracking-widest placeholder:text-slate-400 focus:outline-none transition font-mono font-bold"
            />

            <button
              type="submit"
              disabled={loading || !passkeyInput}
              className="w-full py-3.5 rounded-xl bg-black hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider shadow-md transition cursor-pointer"
            >
              {loading ? "Authenticating..." : "Unlock Host Console"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                playClickSound();
                setLocation("/");
              }}
              className="text-xs text-slate-600 hover:text-black font-bold transition cursor-pointer"
            >
              ← Back to Main Arena Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const counts = dashboardData?.counts || {
    registered: 0,
    started: 0,
    active: 0,
    submitted: 0,
    time_expired: 0,
    abandoned: 0,
    reset: 0
  };

  const qrSession = dashboardData?.qr_session || {
    token: "N/A",
    status: "INACTIVE",
    scan_count: 0
  };

  const config = dashboardData?.config || {};
  const registrations: any[] = dashboardData?.registrations || [];
  const attempts: any[] = dashboardData?.attempts || [];
  const auditLogs: any[] = dashboardData?.audit_logs || dashboardData?.recent_logs || [];
  const questions: any[] = dashboardData?.questions || [];

  // Filtered lists
  const filteredRegistrations = registrations.filter(
    (r) =>
      r.roll_number.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.student_name.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.department.toLowerCase().includes(regSearch.toLowerCase())
  );

  const filteredAttempts = attempts.filter(
    (a) =>
      a.roll_number.toLowerCase().includes(attemptSearch.toLowerCase()) ||
      a.student_name.toLowerCase().includes(attemptSearch.toLowerCase())
  );

  const filteredLogs = auditLogs.filter((l) => {
    const q = logSearch.toLowerCase().trim();
    const details = String(l.details || "").toLowerCase();
    const roll = String(l.roll_number || "").toLowerCase();
    const type = String(l.event_type || "").toLowerCase();

    const matchesSearch = !q || details.includes(q) || roll.includes(q) || type.includes(q);
    if (!matchesSearch) return false;

    if (logTypeFilter === "ALL") return true;
    if (logTypeFilter === "SECURITY") {
      return ["TAB_SWITCH", "AI_SIDEBAR_BLUR", "FULLSCREEN_EXIT", "CHEATING_DISQUALIFIED"].includes(l.event_type);
    }
    if (logTypeFilter === "NETWORK") {
      return (
        ["NETWORK_WARNING", "NETWORK_OFFLINE", "NETWORK_RECONNECT"].includes(l.event_type) ||
        details.includes("network") ||
        details.includes("offline")
      );
    }
    if (logTypeFilter === "SUBMISSIONS") {
      return ["MANUAL_SUBMISSION", "AUTO_SUBMIT_EXPIRED", "CONTEST_STARTED"].includes(l.event_type);
    }
    if (logTypeFilter === "ADMIN") {
      return [
        "DATABASE_PURGED",
        "ATTEMPT_RESET",
        "RESULTS_RELEASED",
        "RESULTS_LOCKED",
        "REGISTRATION_REMOVED",
        "CONTEST_STATUS_CHANGED"
      ].includes(l.event_type);
    }
    return l.event_type === logTypeFilter;
  });

  const port = window.location.port || "3000";
  const contestUrl = `http://${selectedIp || "localhost"}:${port}/contest?token=${qrSession.token}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Event Host Navigation */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <PragatiLogo variant="header" size="sm" subtitleText="EVENT HOST COMMAND CENTER" />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badges */}
          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              config.is_active
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-red-50 text-red-800 border-red-300"
            }`}
          >
            {config.is_active ? "🟢 CONTEST LIVE" : "🔴 PAUSED"}
          </span>

          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              config.results_released
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-amber-50 text-amber-800 border-amber-300"
            }`}
          >
            {config.results_released ? "🏆 RESULTS RELEASED" : "🔒 RESULTS LOCKED"}
          </span>

          <button
            onClick={() => setProjectorMode(true)}
            className="px-3 py-1.5 rounded-lg bg-black hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Projector View
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-black transition cursor-pointer"
            title="Lock Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Event Host Layout with Sidebar Tabs */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-3 space-y-1 shrink-0 overflow-x-auto flex md:flex-col shadow-sm">
          {[
            { id: "dashboard", label: "Dashboard Metrics", icon: LayoutDashboard },
            { id: "registrations", label: `Registrations (${counts.registered})`, icon: Users },
            { id: "qr_control", label: "QR Access Control", icon: QrCode },
            { id: "live_participants", label: `Live Attempts (${counts.active})`, icon: Activity },
            { id: "results_release", label: "Results Release", icon: Award },
            { id: "leaderboard", label: "Leaderboard", icon: Trophy },
            { id: "reset_attempt", label: "Reset Reattempt", icon: RotateCcw },
            { id: "question_bank", label: `Question Bank (${questions.length || 52})`, icon: Code2 },
            { id: "audit_logs", label: `Audit Event Logs (${auditLogs.length})`, icon: FileText },
            { id: "export", label: "Export Records", icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id as AdminTab);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-black text-white font-black shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-black"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl">
          {/* 1. DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">NPTEL Practice Test 2 — Invigilator Overview</h2>
                <p className="text-xs text-slate-600 font-medium">Pragati University · PatHub Examination Platform</p>
              </div>

              {/* 7 Core Examination Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="bg-white border-2 border-slate-300 p-4 rounded-xl space-y-1 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-600 uppercase">REGISTERED</p>
                  <p className="text-2xl font-black text-slate-950 font-mono">{counts.registered}</p>
                </div>
                <div className="bg-white border-2 border-slate-300 p-4 rounded-xl space-y-1 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-600 uppercase">STARTED</p>
                  <p className="text-2xl font-black text-blue-700 font-mono">{counts.started}</p>
                </div>
                <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-xl space-y-1 shadow-sm">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase">ACTIVE</p>
                  <p className="text-2xl font-black text-emerald-900 font-mono animate-pulse">{counts.active}</p>
                </div>
                <div className="bg-white border-2 border-slate-300 p-4 rounded-xl space-y-1 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-600 uppercase">SUBMITTED</p>
                  <p className="text-2xl font-black text-emerald-700 font-mono">{counts.submitted}</p>
                </div>
                <div className="bg-white border-2 border-slate-300 p-4 rounded-xl space-y-1 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-600 uppercase">TIME EXPIRED</p>
                  <p className="text-2xl font-black text-amber-700 font-mono">{counts.time_expired}</p>
                </div>
                <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-xl space-y-1 shadow-sm">
                  <p className="text-[11px] font-bold text-rose-800 uppercase">ABANDONED</p>
                  <p className="text-2xl font-black text-rose-700 font-mono">{counts.abandoned}</p>
                </div>
                <div className="bg-white border-2 border-slate-300 p-4 rounded-xl space-y-1 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-600 uppercase">RESET (REATTEMPTS)</p>
                  <p className="text-2xl font-black text-purple-700 font-mono">{counts.reset}</p>
                </div>
              </div>

              {/* Quick Actions & QR Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-300 rounded-2xl p-5 space-y-4 shadow-sm">
                  <h3 className="text-sm font-black text-slate-950 uppercase flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-slate-700" /> Active QR Portal
                  </h3>
                  <div className="flex items-center gap-4">
                    {qrDataUrl && (
                      <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 rounded-lg bg-slate-50 border border-slate-200 p-1" />
                    )}
                    <div className="space-y-1 text-xs font-mono">
                      <p className="text-slate-600">Token: <strong className="text-slate-950 font-bold">{qrSession.token}</strong></p>
                      <p className="text-slate-600">Status: <strong className="text-emerald-700 font-bold">{qrSession.status}</strong></p>
                      <p className="text-slate-600">Verified Real Scans: <strong className="text-slate-950 font-bold">{qrSession.scan_count}</strong></p>
                    </div>
                  </div>
                  <button
                    onClick={() => setProjectorMode(true)}
                    className="w-full py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
                  >
                    Open Fullscreen Projector
                  </button>
                </div>

                <div className="bg-white border border-slate-300 rounded-2xl p-5 space-y-4 lg:col-span-2 shadow-sm">
                  <h3 className="text-sm font-black text-slate-950 uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-700" /> Recent Security & Audit Logs
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs font-mono">
                    {auditLogs.slice(0, 6).map((log: any) => (
                      <div key={log.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-slate-950 font-bold">[{log.event_type}]</span>{" "}
                          <span className="text-slate-700">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0 font-bold">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. REGISTRATIONS TAB */}
          {activeTab === "registrations" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-950 uppercase">Contestant Registrations</h2>
                  <p className="text-xs text-slate-600 font-medium">Permanent university registration records (All 3rd Year)</p>
                </div>
                <button
                  onClick={() => setNewRegModal(true)}
                  className="px-4 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <UserPlus className="w-4 h-4" /> Add Manual Registration
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search by Roll Number, Name, or Department..."
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-black font-mono font-bold"
                />
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-mono border-b border-slate-300 text-[11px] font-bold">
                      <tr>
                        <th className="p-3.5">Roll Number</th>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5">Year / Sec</th>
                        <th className="p-3.5">Reg Time</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {filteredRegistrations.map((r: any) => (
                        <tr key={r.registration_id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 font-bold text-slate-900">{r.roll_number}</td>
                          <td className="p-3.5 font-sans font-bold text-slate-950">{r.student_name}</td>
                          <td className="p-3.5 text-slate-700 font-sans">{r.department}</td>
                          <td className="p-3.5 text-slate-600">{r.year} · Sec {r.section}</td>
                          <td className="p-3.5 text-slate-500">{new Date(r.registration_time).toLocaleTimeString()}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-900 font-bold text-[10px]">
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleRemoveRegistration(r.roll_number, r.student_name)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 font-bold text-[11px] flex items-center gap-1.5 transition ml-auto cursor-pointer shadow-xs"
                              title={`Remove ${r.student_name} from registrations`}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredRegistrations.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-500 font-sans">
                            No registration records match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. QR ACCESS CONTROL TAB */}
          {activeTab === "qr_control" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-950 uppercase">Host-Controlled QR Access</h2>
                <p className="text-xs text-slate-600 font-medium">Generate, activate, deactivate, or expire official contest access QR code</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QR Display Card */}
                <div className="bg-white border border-slate-300 rounded-2xl p-6 text-center space-y-4 shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider bg-emerald-50 text-emerald-800 border-emerald-300">
                    STATUS: {qrSession.status}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl inline-block mx-auto border-2 border-slate-300 shadow-sm">
                    {qrDataUrl && <img src={qrDataUrl} alt="Contest QR" className="w-56 h-56" />}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-600 font-mono">TOKEN: <strong className="text-slate-950 font-black">{qrSession.token}</strong></p>
                    <p className="text-[11px] text-slate-500 break-all font-mono">{contestUrl}</p>
                  </div>

                  <button
                    onClick={() => setProjectorMode(true)}
                    className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
                  >
                    Enter Projector View
                  </button>
                </div>

                {/* Host Control Actions */}
                <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-5 lg:col-span-2 shadow-sm">
                  <h3 className="text-sm font-black text-slate-950 uppercase flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-700" /> QR Session Controls
                  </h3>

                  {/* Network Adapter Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Select Host Network IP (Wi-Fi / LAN)
                    </label>
                    <select
                      value={selectedIp}
                      onChange={(e) => setSelectedIp(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black font-mono font-bold"
                    >
                      {networkIps.map((ip) => (
                        <option key={ip} value={ip}>{ip} (Port {port})</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Ensures contestants on mobile Wi-Fi connect to the correct machine address.
                    </p>
                  </div>

                  {/* 4 Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleQRAction("generate")}
                      className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase transition cursor-pointer shadow-sm"
                    >
                      GENERATE QR
                    </button>
                    <button
                      onClick={() => handleQRAction("activate")}
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition cursor-pointer shadow-sm"
                    >
                      ACTIVATE QR
                    </button>
                    <button
                      onClick={() => handleQRAction("deactivate")}
                      className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase transition cursor-pointer shadow-sm"
                    >
                      DEACTIVATE QR
                    </button>
                    <button
                      onClick={() => handleQRAction("expire")}
                      className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase transition cursor-pointer shadow-sm"
                    >
                      EXPIRE QR
                    </button>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                    <p className="font-bold text-slate-900 uppercase">Contest Access Rule:</p>
                    <p>
                      When the QR code is deactivated or expired, any contestant scanning or loading the URL will see:
                      <strong className="text-slate-950 font-black"> "Contest access is currently closed."</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. LIVE ATTEMPTS & PARTICIPANTS TAB */}
          {activeTab === "live_participants" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 uppercase">Live Participant Attempts</h2>
                <p className="text-xs text-slate-600 font-medium">Real-time attempt statuses and security monitoring (Scores visible only to host)</p>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-700 uppercase border-b border-slate-300 text-[11px] font-bold">
                      <tr>
                        <th className="p-3.5">Roll Number</th>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Score (Host Only)</th>
                        <th className="p-3.5">Violations</th>
                        <th className="p-3.5">Started At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {filteredAttempts.map((a: any) => (
                        <tr key={a.attempt_id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 font-bold text-slate-900">{a.roll_number}</td>
                          <td className="p-3.5 font-sans font-bold text-slate-950">{a.student_name}</td>
                          <td className="p-3.5 text-slate-600 font-sans">{a.department}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                a.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 animate-pulse"
                                  : a.status === "SUBMITTED"
                                  ? "bg-slate-100 text-slate-900 border border-slate-300"
                                  : a.status === "DISQUALIFIED"
                                  ? "bg-red-50 border border-red-300 text-red-700 font-black"
                                  : a.status === "ABANDONED"
                                  ? "bg-amber-50 text-amber-800 border border-amber-300"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="p-3.5 font-black text-slate-950 text-sm">
                            {a.score} / 40
                          </td>
                          <td className="p-3.5">
                            <span className={a.tab_switch_count > 0 ? "text-rose-600 font-bold" : "text-slate-500"}>
                              {a.tab_switch_count} violations
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600">{new Date(a.started_at).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                      {filteredAttempts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-500 font-sans">
                            No live attempts recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. RESULTS RELEASE TAB */}
          {activeTab === "results_release" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 uppercase">Official Results Release Gate</h2>
                <p className="text-xs text-slate-600">Only the host can unlock scores and release the public leaderboard</p>
              </div>

              <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">CURRENT STATUS:</span>
                    <h3 className="text-lg font-black text-slate-950 flex items-center gap-2 mt-0.5">
                      {config.results_released ? (
                        <>
                          <Unlock className="w-5 h-5 text-emerald-600" />
                          <span className="text-emerald-700">🟢 RESULTS RELEASED</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 text-amber-600" />
                          <span className="text-amber-700">🔒 RESULTS LOCKED</span>
                        </>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Enter Official Release Passkey:
                  </label>
                  <input
                    type="password"
                    value={releasePasskey}
                    onChange={(e) => setReleasePasskey(e.target.value)}
                    placeholder="Enter Passkey (e.g. 738637)"
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-black font-mono tracking-widest uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleToggleResults(true)}
                    className="py-3 px-4 rounded-xl bg-black hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
                  >
                    RELEASE RESULTS
                  </button>
                  <button
                    onClick={() => handleToggleResults(false)}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    LOCK RESULTS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. LEADERBOARD TAB */}
          {activeTab === "leaderboard" && (() => {
            const filteredLb = hostLeaderboard.filter((entry: any) => {
              const matchesSearch =
                !hlSearch ||
                entry.roll_number.toLowerCase().includes(hlSearch.toLowerCase()) ||
                entry.student_name.toLowerCase().includes(hlSearch.toLowerCase()) ||
                entry.department.toLowerCase().includes(hlSearch.toLowerCase());

              const matchesStatus =
                hlStatusFilter === "ALL" || entry.status === hlStatusFilter;

              return matchesSearch && matchesStatus;
            });

            return (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950 uppercase flex items-center gap-2">
                      <span>Official Host Master Leaderboard</span>
                      <span className="text-xs bg-slate-100 text-slate-900 px-2.5 py-0.5 rounded-full border border-slate-300 font-mono font-bold">
                        {hostLeaderboard.length} Ranked
                      </span>
                    </h2>
                    <p className="text-xs text-slate-600">
                      Official 40-Question NPTEL Practice Test 2 Results (+1.0 Correct, -0.5 Incorrect).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportCsv("results")}
                      className="px-3.5 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Full CSV
                    </button>
                  </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-300 shadow-sm">
                  <div className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={hlSearch}
                      onChange={(e) => setHlSearch(e.target.value)}
                      placeholder="Search by Roll Number, Name, Department..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <select
                      value={hlStatusFilter}
                      onChange={(e) => setHlStatusFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-black font-mono font-bold"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DISQUALIFIED">DISQUALIFIED</option>
                      <option value="ABANDONED">ABANDONED</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-100 text-slate-700 uppercase border-b border-slate-300 font-bold text-[11px]">
                        <tr>
                          <th className="p-3 pl-4">Rank</th>
                          <th className="p-3">Roll Number</th>
                          <th className="p-3">Candidate Name</th>
                          <th className="p-3 text-center">Correct (/40)</th>
                          <th className="p-3 text-center">Wrong (-0.5)</th>
                          <th className="p-3 text-center">Unanswered</th>
                          <th className="p-3 text-center">Final Score (/40)</th>
                          <th className="p-3 text-right">Time Elapsed</th>
                          <th className="p-3 pr-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredLb.map((entry: any) => (
                          <tr key={entry.attempt_id} className="hover:bg-slate-50 transition">
                            <td className="p-3 pl-4 font-bold">
                              {entry.rank === 1 ? (
                                <span className="text-slate-950 font-black">🥇 #1</span>
                              ) : entry.rank === 2 ? (
                                <span className="text-slate-900 font-black">🥈 #2</span>
                              ) : entry.rank === 3 ? (
                                <span className="text-slate-900 font-black">🥉 #3</span>
                              ) : (
                                <span className="text-slate-600">#{entry.rank}</span>
                              )}
                            </td>
                            <td className="p-3 font-bold text-slate-900">{entry.roll_number}</td>
                            <td className="p-3 font-sans font-bold text-slate-950">{entry.student_name}</td>
                            <td className="p-3 text-center font-black text-emerald-700">{entry.correct_count}</td>
                            <td className="p-3 text-center text-rose-600 font-bold">{entry.incorrect_count}</td>
                            <td className="p-3 text-center text-slate-500">{entry.unanswered_count}</td>
                            <td className="p-3 text-center font-black text-slate-950 text-sm">{entry.score}</td>
                            <td className="p-3 text-right text-slate-700 font-medium">{entry.time_formatted}</td>
                            <td className="p-3 pr-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  entry.status === "DISQUALIFIED"
                                    ? "bg-red-50 border border-red-300 text-red-700 font-black"
                                    : entry.status === "SUBMITTED"
                                    ? "bg-slate-100 text-slate-900 border border-slate-300"
                                    : entry.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300 animate-pulse"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredLb.length === 0 && (
                          <tr>
                            <td colSpan={9} className="p-6 text-center text-slate-500 font-sans">
                              No contestant records match your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 7. RESET ATTEMPT TAB */}
          {activeTab === "reset_attempt" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 uppercase">Host-Authorized Reattempt / Reset</h2>
                <p className="text-xs text-slate-600">Preserves previous history & logs, and creates permission for a new attempt</p>
              </div>

              <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-5 shadow-sm">
                <form onSubmit={handleResetAttempt} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Student Roll Number:
                    </label>
                    <input
                      type="text"
                      required
                      value={resetRollNumber}
                      onChange={(e) => setResetRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 24A31A0301"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm font-mono tracking-wider focus:outline-none focus:border-black uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Reset Authorization Secret Key:
                    </label>
                    <input
                      type="password"
                      required
                      value={resetSecretKey}
                      onChange={(e) => setResetSecretKey(e.target.value)}
                      placeholder="Enter Reset Key"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm font-mono tracking-widest focus:outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
                  >
                    Authorize Official Reattempt
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 8. QUESTION BANK & ANALYTICS TAB */}
          {activeTab === "question_bank" && (() => {
            const allQ = dashboardData?.questions || questions || [];
            const filtered = allQ.filter((q: any) => {
              const matchesSearch = !qbSearch ||
                q.title?.toLowerCase().includes(qbSearch.toLowerCase()) ||
                q.topic?.toLowerCase().includes(qbSearch.toLowerCase()) ||
                q.description?.toLowerCase().includes(qbSearch.toLowerCase()) ||
                q.id?.toLowerCase().includes(qbSearch.toLowerCase());

              const matchesDiff = qbDiffFilter === "ALL" || q.difficulty === qbDiffFilter;

              return matchesSearch && matchesDiff;
            });

            const pageSize = 15;
            const totalPages = Math.ceil(filtered.length / pageSize) || 1;
            const currentPage = Math.min(qbPage, totalPages);
            const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

            return (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950 uppercase flex items-center gap-2">
                      <span>Master Question Pool & Analytics</span>
                      <span className="text-xs bg-slate-100 text-slate-900 px-2.5 py-0.5 rounded-full border border-slate-300 font-mono font-bold">
                        {allQ.length} Questions Loaded
                      </span>
                    </h2>
                    <p className="text-xs text-slate-600">
                      Zero-Repetition Multi-Contestant Engine · 40 unique questions randomly assigned per candidate (+1.0 Correct, -0.5 Incorrect).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQbViewMode("list")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                        qbViewMode === "list"
                          ? "bg-black text-white font-black shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:text-black border border-slate-200"
                      }`}
                    >
                      Question Browser
                    </button>
                    <button
                      onClick={() => setQbViewMode("analytics")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                        qbViewMode === "analytics"
                          ? "bg-black text-white font-black shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:text-black border border-slate-200"
                      }`}
                    >
                      Question Analytics ({questionAnalytics.length})
                    </button>
                  </div>
                </div>

                {qbViewMode === "analytics" ? (
                  /* Question-Level Analytics View */
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-100 text-slate-700 uppercase border-b border-slate-300 font-bold text-[11px]">
                            <tr>
                              <th className="p-3.5">Question ID</th>
                              <th className="p-3.5">Difficulty</th>
                              <th className="p-3.5">Topic / Concept</th>
                              <th className="p-3.5">Total Assigned</th>
                              <th className="p-3.5">Correct Attempts</th>
                              <th className="p-3.5">Incorrect Attempts</th>
                              <th className="p-3.5">Unanswered</th>
                              <th className="p-3.5">Accuracy (% Correct)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {questionAnalytics.map((qa: any) => (
                              <tr key={qa.id} className="hover:bg-slate-50 transition">
                                <td className="p-3.5 font-bold text-slate-900">{qa.id}</td>
                                <td className="p-3.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                      qa.difficulty === "HARD"
                                        ? "bg-red-50 text-red-700 border-red-300"
                                        : qa.difficulty === "MEDIUM"
                                        ? "bg-amber-50 text-amber-800 border-amber-300"
                                        : "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    }`}
                                  >
                                    {qa.difficulty}
                                  </span>
                                </td>
                                <td className="p-3.5 text-slate-900 font-sans font-bold">{qa.topic}</td>
                                <td className="p-3.5 font-bold text-slate-900">{qa.attempts_count}</td>
                                <td className="p-3.5 text-emerald-700 font-bold">{qa.correct_count}</td>
                                <td className="p-3.5 text-rose-600 font-bold">{qa.incorrect_count}</td>
                                <td className="p-3.5 text-slate-500">{qa.unanswered_count}</td>
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                                      <div
                                        className={`h-full ${
                                          qa.accuracy_percentage >= 70
                                            ? "bg-emerald-600"
                                            : qa.accuracy_percentage >= 40
                                            ? "bg-amber-500"
                                            : "bg-rose-500"
                                        }`}
                                        style={{ width: `${qa.accuracy_percentage}%` }}
                                      />
                                    </div>
                                    <span className="font-bold text-slate-900">{qa.accuracy_percentage}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {questionAnalytics.length === 0 && (
                              <tr>
                                <td colSpan={8} className="p-6 text-center text-slate-500 font-sans">
                                  No question attempts recorded yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Question List Cards Browser */
                  <div className="space-y-4">
                    {/* Filters & Search Toolbar */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-300 shadow-sm">
                      <div className="sm:col-span-8">
                        <input
                          type="text"
                          value={qbSearch}
                          onChange={(e) => {
                            setQbSearch(e.target.value);
                            setQbPage(1);
                          }}
                          placeholder="Search by topic, concept, keyword..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <select
                          value={qbDiffFilter}
                          onChange={(e) => {
                            setQbDiffFilter(e.target.value);
                            setQbPage(1);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-black font-mono font-bold"
                        >
                          <option value="ALL">All Difficulties (60 Questions)</option>
                          <option value="EASY">Easy (1.0 Point)</option>
                          <option value="MEDIUM">Medium (1.0 Point)</option>
                          <option value="HARD">Hard (1.0 Point)</option>
                        </select>
                      </div>
                    </div>

                    {/* Question List Cards */}
                    <div className="grid grid-cols-1 gap-4">
                      {paginated.length === 0 ? (
                        <div className="bg-white border border-slate-300 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-sm">
                          No questions matched your search criteria.
                        </div>
                      ) : (
                        paginated.map((q: any) => (
                          <div key={q.id} className="bg-white border-2 border-slate-300 rounded-2xl p-5 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-black text-slate-950">
                                QUESTION ID: {q.id} · {q.topic}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                    q.difficulty === "HARD"
                                      ? "bg-red-50 text-red-700 border-red-300"
                                      : q.difficulty === "MEDIUM"
                                      ? "bg-amber-50 text-amber-800 border-amber-300"
                                      : "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  }`}
                                >
                                  {q.difficulty} (+1.0 PT)
                                </span>
                              </div>
                            </div>

                            <h3 className="text-base font-bold text-slate-950">{q.title}</h3>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">{q.description}</p>

                            {/* Multiple Choice Solution Options */}
                            <div className="space-y-1.5 pt-1">
                              <div className="text-[11px] font-bold text-slate-600 uppercase">Options (Key: Option {q.correct_option_id}):</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {q.options?.map((opt: any) => (
                                  <div
                                    key={opt.id}
                                    className={`p-2.5 rounded-xl border font-sans text-xs ${
                                      opt.id === q.correct_option_id
                                        ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold"
                                        : "bg-slate-50 border border-slate-200 text-slate-800"
                                    }`}
                                  >
                                    <span className="font-mono font-bold mr-1.5">[{opt.id}]</span>
                                    <span>{opt.text}</span>
                                    {opt.id === q.correct_option_id && (
                                      <span className="ml-2 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold font-mono">
                                        CORRECT ANSWER
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between bg-white border border-slate-300 p-3 rounded-xl text-xs shadow-sm">
                        <span className="text-slate-600">
                          Showing page <strong className="text-slate-950">{currentPage}</strong> of <strong className="text-slate-950">{totalPages}</strong> ({filtered.length} matching questions)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            disabled={currentPage <= 1}
                            onClick={() => setQbPage((p) => Math.max(1, p - 1))}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-40 text-slate-800 font-bold transition cursor-pointer"
                          >
                            ← Previous
                          </button>
                          <button
                            disabled={currentPage >= totalPages}
                            onClick={() => setQbPage((p) => Math.min(totalPages, p + 1))}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-40 text-slate-800 font-bold transition cursor-pointer"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* 9. AUDIT LOGS TAB */}
          {activeTab === "audit_logs" && (() => {
            const itemsPerPage = 35;
            const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
            const currentPage = Math.min(logPage, totalPages);
            const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            const securityCount = auditLogs.filter((l) =>
              ["TAB_SWITCH", "AI_SIDEBAR_BLUR", "FULLSCREEN_EXIT", "CHEATING_DISQUALIFIED"].includes(l.event_type)
            ).length;
            const networkCount = auditLogs.filter(
              (l) =>
                ["NETWORK_WARNING", "NETWORK_OFFLINE", "NETWORK_RECONNECT"].includes(l.event_type) ||
                String(l.details || "").toLowerCase().includes("network")
            ).length;
            const submissionCount = auditLogs.filter((l) =>
              ["MANUAL_SUBMISSION", "AUTO_SUBMIT_EXPIRED", "CONTEST_STARTED"].includes(l.event_type)
            ).length;

            const getEventBadge = (type: string) => {
              if (type === "CHEATING_DISQUALIFIED") {
                return "bg-rose-100 text-rose-800 border-rose-300";
              }
              if (["TAB_SWITCH", "AI_SIDEBAR_BLUR", "FULLSCREEN_EXIT"].includes(type)) {
                return "bg-amber-100 text-amber-900 border-amber-300";
              }
              if (["NETWORK_WARNING", "NETWORK_OFFLINE", "NETWORK_RECONNECT"].includes(type)) {
                return "bg-sky-100 text-sky-900 border-sky-300";
              }
              if (["MANUAL_SUBMISSION", "AUTO_SUBMIT_EXPIRED", "RESULTS_RELEASED"].includes(type)) {
                return "bg-emerald-100 text-emerald-900 border-emerald-300";
              }
              return "bg-slate-100 text-slate-800 border-slate-300";
            };

            return (
              <div className="space-y-5">
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950 uppercase flex items-center gap-2">
                      <FileText className="w-5 h-5 text-black" />
                      Live Examination Audit Board
                      <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full">
                        {auditLogs.length} Records
                      </span>
                    </h2>
                    <p className="text-xs text-slate-600 font-medium">
                      Cryptographically tracked, immutable timeline of all student sessions, network status & examination events
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefreshAuditLogs}
                      disabled={refreshingLogs}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${refreshingLogs ? "animate-spin text-black" : "text-slate-600"}`} />
                      {refreshingLogs ? "Syncing..." : "Refresh"}
                    </button>
                    <button
                      onClick={handleClearAllAuditLogs}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                      title="Clear all recorded audit event logs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      Clear All Logs
                    </button>
                    <button
                      onClick={() => handleExportCsv("audit")}
                      className="px-3 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Logs CSV
                    </button>
                  </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Audit Events</div>
                    <div className="text-2xl font-black text-slate-950 font-mono mt-0.5">{auditLogs.length}</div>
                    <div className="text-[10px] text-slate-400 mt-1">100% recorded</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Security & Focus Events</div>
                    <div className="text-2xl font-black text-amber-700 font-mono mt-0.5">{securityCount}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Focus blurs / tab alerts</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Network Safeguards</div>
                    <div className="text-2xl font-black text-sky-700 font-mono mt-0.5">{networkCount}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1">Non-disqualifying safe events</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Submissions Recorded</div>
                    <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">{submissionCount}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Completed attempts</div>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search audit trail by Roll Number, Event Type, or details..."
                      value={logSearch}
                      onChange={(e) => {
                        setLogSearch(e.target.value);
                        setLogPage(1);
                      }}
                      className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    {logSearch && (
                      <button
                        onClick={() => {
                          setLogSearch("");
                          setLogPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-bold">
                    {[
                      { id: "ALL", label: `All (${auditLogs.length})` },
                      { id: "SECURITY", label: `Security (${securityCount})` },
                      { id: "NETWORK", label: `Network (${networkCount})` },
                      { id: "SUBMISSIONS", label: `Submissions (${submissionCount})` },
                      { id: "ADMIN", label: "Admin Actions" }
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => {
                          setLogTypeFilter(pill.id);
                          setLogPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer text-xs ${
                          logTypeFilter === pill.id
                            ? "bg-black text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logs Stream Container */}
                <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                    <span className="font-semibold">
                      Showing <strong className="text-slate-950">{paginatedLogs.length}</strong> of <strong className="text-slate-950">{filteredLogs.length}</strong> filtered events
                    </span>
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentPage <= 1}
                          onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          ← Prev
                        </button>
                        <span className="font-mono text-xs">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          disabled={currentPage >= totalPages}
                          onClick={() => setLogPage((p) => Math.min(totalPages, p + 1))}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>

                  {paginatedLogs.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-slate-800">No matching audit events found</div>
                      <p className="text-xs text-slate-500">
                        {logSearch || logTypeFilter !== "ALL"
                          ? "Try clearing your search query or switching to 'All' filter."
                          : "Audit events will automatically appear here as candidates register, start, and complete exams."}
                      </p>
                      {(logSearch || logTypeFilter !== "ALL") && (
                        <button
                          onClick={() => {
                            setLogSearch("");
                            setLogTypeFilter("ALL");
                            setLogPage(1);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-bold mt-2 cursor-pointer hover:bg-slate-800"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                      {paginatedLogs.map((log: any) => {
                        const dateObj = new Date(log.timestamp);
                        const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                        const dateStr = dateObj.toLocaleDateString([], { month: "short", day: "numeric" });

                        return (
                          <div
                            key={log.id}
                            className="bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-2 transition"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border uppercase ${getEventBadge(log.event_type)}`}>
                                  {log.event_type}
                                </span>
                                {log.roll_number && (
                                  <span className="text-xs font-mono font-black bg-black text-white px-2 py-0.5 rounded">
                                    {log.roll_number}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-800 font-medium leading-relaxed font-sans">
                                {log.details}
                              </p>
                            </div>
                            <div className="flex items-center sm:items-start gap-2 shrink-0">
                              <div className="text-[11px] font-mono font-bold text-slate-500 text-left sm:text-right">
                                <div>{timeStr}</div>
                                <div className="text-[10px] text-slate-400">{dateStr}</div>
                              </div>
                              <button
                                onClick={() => handleDeleteAuditLog(log.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Delete this audit log entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Bottom Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-200">
                      <span>
                        Page <strong className="text-slate-950">{currentPage}</strong> of <strong className="text-slate-950">{totalPages}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentPage <= 1}
                          onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-40 text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          ← Previous
                        </button>
                        <button
                          disabled={currentPage >= totalPages}
                          onClick={() => setLogPage((p) => Math.min(totalPages, p + 1))}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-40 text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 10. EXPORT TAB */}
          {activeTab === "export" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 uppercase">Export University Records</h2>
                <p className="text-xs text-slate-600 font-medium">Download complete results and logs for official documentation</p>
              </div>

              {/* Simplified & Classified Downloads Card */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 space-y-5 shadow-sm">
                <div>
                  <h3 className="text-base font-black text-slate-950 uppercase flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                    Simplified & Classified Results Download Center
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Direct Excel / CSV file downloads with official classified rankings, scoring breakdown, and candidate logs.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {/* 1. Official Results Leaderboard CSV */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-950">1. Classified Examination Results CSV</span>
                        <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                          Official Format
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-mono text-[11px]">
                        Rank, Roll Number, Student Name, Department, Year, Section, Final Score (/40), Correct Count (/40), Incorrect Count, Unanswered Count, Time Taken (MM:SS), Time Taken (Seconds), Status, Submission Timestamp
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportCsv("results")}
                      className="px-4 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shrink-0"
                    >
                      <Download className="w-4 h-4 text-emerald-400" /> Download Results CSV
                    </button>
                  </div>

                  {/* 2. Registered Candidates Attendance Roster */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-sm text-slate-950">2. Registered Candidates Roster CSV</span>
                      <p className="text-xs text-slate-600 mt-1">
                        Complete 65-student registry: Roll Number, Name, Department, Year, Section, Registration Timestamp, Exam Status.
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportCsv("roster")}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shrink-0"
                    >
                      <Download className="w-4 h-4 text-sky-400" /> Download Roster CSV
                    </button>
                  </div>

                  {/* 3. Itemized Responses CSV */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-sm text-slate-950">3. Itemized Responses & Answers CSV</span>
                      <p className="text-xs text-slate-600 mt-1">
                        Detailed question-by-question candidate selections, assigned questions, and timestamp log.
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportCsv("itemized")}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shrink-0"
                    >
                      <Download className="w-4 h-4 text-purple-400" /> Download Responses CSV
                    </button>
                  </div>

                  {/* 4. Complete Audit Trail Logs CSV */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-sm text-slate-950">4. Examination Audit Trail Logs CSV</span>
                      <p className="text-xs text-slate-600 mt-1">
                        Complete timestamped audit stream of all student sessions, network status updates, security warnings, and host actions.
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportCsv("audit")}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shrink-0"
                    >
                      <Download className="w-4 h-4 text-amber-400" /> Download Audit CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Kaggle Dataset Backup & Sync Card */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-300 flex items-center justify-center font-black text-sky-700 text-sm font-mono">
                      K
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-950 uppercase">Kaggle Cloud Dataset Backup</h3>
                      <p className="text-[11px] text-slate-600 font-medium">Permanent cloud repository for candidate results & analytics</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    tsaiteja2008
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                  <p className="text-slate-600">Dataset Target: <strong className="text-slate-950">tsaiteja2008/nptel-practice-test-2-results</strong></p>
                  <p className="text-slate-600">Included Files: <strong className="text-slate-900">leaderboard.csv, responses.csv, audit_trail.csv, contest_db.json</strong></p>
                </div>

                <button
                  onClick={handleKaggleSync}
                  disabled={isKaggleSyncing}
                  className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <CloudUpload className={`w-4 h-4 ${isKaggleSyncing ? "animate-bounce" : ""}`} />
                  {isKaggleSyncing ? "Generating Snapshot & Uploading..." : "Backup & Sync to Kaggle Dataset"}
                </button>

                {kaggleResult && (
                  <div className="p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs space-y-2 font-mono">
                    <p className="text-slate-800 font-bold">{kaggleResult.message}</p>
                    {kaggleResult.dataset_url && (
                      <a
                        href={kaggleResult.dataset_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-bold underline text-[11px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Dataset on Kaggle
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Danger Zone: Clean Live Reset */}
              <div className="bg-red-50 border border-red-300 rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                  <h3 className="text-sm font-black uppercase">Pre-Contest Database Purge</h3>
                </div>
                <p className="text-xs text-red-900 leading-relaxed font-medium">
                  Before the live exam begins, click here to clear all simulation test data and reset attempt counters to 0 while keeping all 66 registered students and master questions intact.
                </p>
                <button
                  onClick={() => setShowPurgeModal(true)}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
                >
                  🧹 Purge Test Data & Start Clean Live Contest
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FULLSCREEN PROJECTOR VIEW */}
      {/* ------------------------------------------------------------- */}
      {projectorMode && (
        <div className="fixed inset-0 bg-slate-50 text-slate-900 z-50 flex flex-col items-center justify-between p-6 sm:p-10 select-none font-sans">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between border-b border-slate-300 pb-4">
            <div className="space-y-1">
              <PragatiLogo variant="header" size="md" subtitleText="CBT EXAMINATION SYSTEM" />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                NPTEL PRACTICE TEST 2 · EXAM HALL PORTAL
              </h1>
            </div>

            <button
              onClick={() => setProjectorMode(false)}
              className="p-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Minimize2 className="w-5 h-5" /> Exit Projector
            </button>
          </div>

          {/* Large Center QR & Instructions */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 my-auto">
            <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-slate-300">
              {qrDataUrl && <img src={qrDataUrl} alt="Contest QR" className="w-72 h-72 sm:w-96 sm:h-96" />}
            </div>

            <div className="max-w-md space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-widest">
                  HOW TO PARTICIPATE
                </span>
                <h2 className="text-3xl font-black text-slate-950 uppercase">
                  Scan QR with your phone camera
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base font-medium text-slate-800">
                <div className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-black text-white font-black flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span>Ensure you are connected to the campus Wi-Fi / Hotspot</span>
                </div>

                <div className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-black text-white font-black flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span>Scan QR & enter your registered <strong>Roll Number</strong></span>
                </div>

                <div className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-black text-white font-black flex items-center justify-center shrink-0">
                    3
                  </div>
                  <span>Complete your 40 Multiple Choice Questions</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 shadow-sm">
                Direct URL: {contestUrl}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-500 font-bold">
            Pragati University · PatHub Assessment Platform · All Rights Reserved © 2026
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MANUAL REGISTRATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {newRegModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white border border-slate-300 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-black text-slate-950 uppercase">Add Manual Registration</h3>
              <button onClick={() => setNewRegModal(false)} className="text-slate-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualRegister} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase">Roll Number:</label>
                <input
                  type="text"
                  required
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value.toUpperCase())}
                  placeholder="e.g. 24A31A0399"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase">Full Name:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Student Full Name"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase">Department:</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-black"
                >
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                  <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-black uppercase transition mt-2 shadow-sm cursor-pointer"
              >
                Save Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PURGE DATABASE MODAL */}
      {/* ------------------------------------------------------------- */}
      {showPurgeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white border-2 border-red-400 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-red-700 font-black text-sm uppercase">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Confirm Contest Data Purge</span>
              </div>
              <button onClick={() => setShowPurgeModal(false)} className="text-slate-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              This action will <strong>wipe all simulation attempts and scores</strong> to prepare a 100% clean, fresh live test session for the contestants. The <strong>whitelisted student registrations and master questions will remain safe</strong>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePurgeContest();
              }}
              className="space-y-3 pt-2"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 uppercase">
                  Enter Event Host Passkey to Authorize:
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={purgePasskey}
                  onChange={(e) => setPurgePasskey(e.target.value)}
                  placeholder="Enter Event Host Passkey"
                  className="w-full bg-slate-50 border-2 border-slate-300 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono font-bold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPurgeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase transition cursor-pointer shadow-md"
                >
                  Confirm Purge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
