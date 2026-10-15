import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  Attempt,
  AttemptStatus,
  AuditLog,
  ContestConfig,
  DatabaseSchema,
  QRSession,
  QuestionDef,
  Registration,
  ShuffledQuestionOptionMapping
} from "@shared/types";
import { generateQuestionBank } from "./question_bank";

export const OFFICIAL_STUDENT_ROSTER: { roll: string; name: string }[] = [
  { roll: "24A31A0301", name: "CHIKKAM JNANA MAHA LAKSHMI DEEPIKA" },
  { roll: "24A31A0302", name: "GADI TEJA SRI" },
  { roll: "24A31A0303", name: "ILLA HARI SANTHOSHI" },
  { roll: "24A31A0304", name: "JONNAKUTI NAGA CHARISHMA" },
  { roll: "24A31A0305", name: "JYOTHIKA DEVI MANIMALA MEDISETTI" },
  { roll: "24A31A0306", name: "KANNAMREDDI KRISHNA KUMARI" },
  { roll: "24A31A0307", name: "KOTTALA RAMA HASINI" },
  { roll: "24A31A0308", name: "MELAM SOWMYA SRI" },
  { roll: "24A31A0309", name: "PALIKA SUSWARITHA" },
  { roll: "24A31A0310", name: "SUNDARAPALLI VANISHA" },
  { roll: "24A31A0311", name: "VASIREDDY SIVA SHIVANI" },
  { roll: "24A31A0312", name: "AVALA ANIL" },
  { roll: "24A31A0313", name: "BATHINA SRITEJA" },
  { roll: "24A31A0314", name: "BONAM VENKATA BHADRA RAO" },
  { roll: "24A31A0315", name: "CHIKKALA MANOJ" },
  { roll: "24A31A0316", name: "CHITTURI RAKESH" },
  { roll: "24A31A0317", name: "CHODISETTI NAVEEN TEJA" },
  { roll: "24A31A0318", name: "DADALA TONY ISAAC" },
  { roll: "24A31A0319", name: "KUPPALA DEVI SREE SIVANAND RAM SAI VARUN" },
  { roll: "24A31A0320", name: "DURGA PANCHAJANYA" },
  { roll: "24A31A0321", name: "GANTA VENKATA RAMANA" },
  { roll: "24A31A0322", name: "GATTA SUDHAKAR" },
  { roll: "24A31A0323", name: "GOLI PRIYARAMUDU" },
  { roll: "24A31A0324", name: "GONIPATI VEERENDRA KARTHIK" },
  { roll: "24A31A0325", name: "GUMMIDI N L D AKHIL KRISHNAM RAJU" },
  { roll: "24A31A0326", name: "ILLA ABHISHEK" },
  { roll: "24A31A0327", name: "JOSHUA ROY GOLLAPALLI" },
  { roll: "24A31A0328", name: "JUTTUKA KARTHIK SRI RAM" },
  { roll: "24A31A0330", name: "KANIKKELLA HARI CHANDRA RAVI SUDARSAN" },
  { roll: "24A31A0331", name: "KANTIREDDY NIKHIL" },
  { roll: "24A31A0332", name: "KARTHIK DHANALA" },
  { roll: "24A31A0333", name: "KOKA SAI JASWANTH" },
  { roll: "24A31A0334", name: "KOTHAPALLI SANTOSH KUMAR" },
  { roll: "24A31A0335", name: "KUKKAMUDI JAACKK" },
  { roll: "24A31A0336", name: "KUNDRAPU NAGA VEERA KAMESWAR" },
  { roll: "24A31A0337", name: "KURAM SUDHEER KUMAR" },
  { roll: "24A31A0338", name: "MAGAPU SANTOSH" },
  { roll: "24A31A0339", name: "MALLADI PRAVEEN" },
  { roll: "24A31A0340", name: "MALLIKIDA ABHIRAM" },
  { roll: "24A31A0341", name: "MARGANI JAI RAM CHARAN" },
  { roll: "24A31A0342", name: "MARUKURTHI CHAITANYA PRAKASH" },
  { roll: "24A31A0343", name: "MELLAM SIDDARDHA TEJA" },
  { roll: "24A31A0344", name: "MUTYALA INDRANEEL KUMAR" },
  { roll: "24A31A0345", name: "NAKKA KARTHIK" },
  { roll: "24A31A0346", name: "NANDIKOLLA SRI HARSHA" },
  { roll: "24A31A0347", name: "NANGIREDDY JOHN VIDYA SAGAR" },
  { roll: "24A31A0348", name: "NIMMALA VENKATA MOTHESH" },
  { roll: "24A31A0349", name: "PACHIPALA YUVA TEJA" },
  { roll: "24A31A0350", name: "PALACHARLA MAHESH SIDHARDHA" },
  { roll: "24A31A0351", name: "PASAGADUGULA NAGA SATYA SURESH KUMAR" },
  { roll: "24A31A0352", name: "PITHANI SANDEEP" },
  { roll: "24A31A0353", name: "PUPPALA AKASH" },
  { roll: "24A31A0354", name: "RANGANADHAM CHANDRA DORABABU" },
  { roll: "24A31A0355", name: "SATTINEEDI ANIL KUMAR" },
  { roll: "24A31A0356", name: "TATAPUDI RAJESH" },
  { roll: "24A31A0357", name: "VADAPARTHI SIVARAMCHARAN" },
  { roll: "24A31A0358", name: "VANUM SATYA SAI MANIKANTA" },
  { roll: "25A35A0301", name: "KUDIPUDI RAMYA SRI BHARGAVI" },
  { roll: "25A35A0302", name: "AGNIPARTHI RAKESH" },
  { roll: "25A35A0303", name: "GRANDHI VENKATA SAI CHANDRA VISWA TEJA" },
  { roll: "25A35A0304", name: "JAKKULA VENKATA RAMANA MURTHY SAI SWAROOP" },
  { roll: "25A35A0305", name: "LADDIKA UTHAM SAI PAVAN" },
  { roll: "25A35A0306", name: "MALLIDI SRI VENKATA SAI BHAMILESWAR REDDY" },
  { roll: "25A35A0307", name: "PENAGANTI AKSHAY" },
  { roll: "25A35A0308", name: "VANUM SRIRAMA VENKATA SATYA KARTHIK" }
];

const DATA_DIR = path.resolve(process.cwd(), "server", "data");
const DB_FILE = path.join(DATA_DIR, "contest_db.json");

function hashKey(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

const DEFAULT_RESET_KEY_HASH = hashKey("2008");
const DEFAULT_RELEASE_KEY_HASH = hashKey("738637");

// Generate official 60-question pool from the complete course syllabus
const MASTER_QUESTION_POOL: QuestionDef[] = generateQuestionBank();
const QUESTION_MAP: Map<string, QuestionDef> = new Map(MASTER_QUESTION_POOL.map((q) => [q.id, q]));

class ContestDatabase {
  private data: DatabaseSchema;
  private questionMap: Map<string, QuestionDef>;

  constructor() {
    this.ensureDataDir();
    this.questionMap = QUESTION_MAP;
    this.data = this.loadDatabase();
    this.seedOfficialStudentRoster();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private getInitialData(): DatabaseSchema {
    const initialToken = crypto.randomBytes(4).toString("hex").toUpperCase();
    return {
      config: {
        contest_id: "NPTEL-PRACTICE-TEST-2",
        title: "NPTEL - METAL ADDITIVE MANUFACTURING PRACTICE TEST 2",
        institution: "NPTEL",
        department: "NATIONAL PROGRAMME ON TECHNOLOGY ENHANCED LEARNING",
        event_name: "METAL ADDITIVE MANUFACTURING",
        competition_name: "METAL ADDITIVE MANUFACTURING PRACTICE TEST 2",
        venue: "ONLINE EXAMINATION PORTAL",
        date: "OCTOBER 2026",
        time_window: "OFFICIAL EXAM WINDOW",
        duration_minutes: 60,
        is_active: true,
        results_released: false,
        max_tab_switches: 3,
        hint_penalty_points: 0,
        allow_registration: false,
        reset_key_hash: DEFAULT_RESET_KEY_HASH,
        release_key_hash: DEFAULT_RELEASE_KEY_HASH
      },
      qr_session: {
        token: initialToken,
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        activated_at: new Date().toISOString(),
        expired_at: null,
        scan_count: 0
      },
      registrations: {},
      attempts: {},
      roll_to_latest_attempt: {},
      attempt_history: [],
      audit_logs: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          event_type: "CONTEST_STATUS_CHANGED",
          details: `Exam database initialized with Metal Additive Manufacturing 60-Question Bank (the complete course syllabus). 60-min timer, unique shuffling per candidate.`
        }
      ],
      questions: MASTER_QUESTION_POOL
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw) as DatabaseSchema;
        parsed.questions = MASTER_QUESTION_POOL;
        if (parsed.config) {
          parsed.config.contest_id = "NPTEL-PRACTICE-TEST-2";
          parsed.config.title = "NPTEL - METAL ADDITIVE MANUFACTURING PRACTICE TEST 2";
          parsed.config.institution = "NPTEL";
          parsed.config.department = "NATIONAL PROGRAMME ON TECHNOLOGY ENHANCED LEARNING";
          parsed.config.event_name = "METAL ADDITIVE MANUFACTURING";
          parsed.config.competition_name = "METAL ADDITIVE MANUFACTURING PRACTICE TEST 2";
          parsed.config.venue = "ONLINE EXAMINATION PORTAL";
          parsed.config.duration_minutes = 60; // 60-Minute Official Timer
          parsed.config.hint_penalty_points = 0;
        }
        this.saveDatabase(parsed);
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load contest_db.json, creating initial data:", e);
    }
    const initial = this.getInitialData();
    this.saveDatabase(initial);
    return initial;
  }

  private seedOfficialStudentRoster() {
    let modified = false;
    const validRolls = new Set(OFFICIAL_STUDENT_ROSTER.map((s) => s.roll.toUpperCase()));
    for (const roll of Object.keys(this.data.registrations)) {
      const reg = this.data.registrations[roll];
      if (!validRolls.has(roll) && (reg.student_name.startsWith("STUDENT ") || reg.student_name.startsWith("Student (") || reg.student_name.startsWith("Student "))) {
        delete this.data.registrations[roll];
        const attId = this.data.roll_to_latest_attempt[roll];
        if (attId) {
          delete this.data.attempts[attId];
          delete this.data.roll_to_latest_attempt[roll];
        }
        modified = true;
      }
    }

    for (const student of OFFICIAL_STUDENT_ROSTER) {
      const roll = student.roll.toUpperCase();
      if (!this.data.registrations[roll] || this.data.registrations[roll].student_name !== student.name || this.data.registrations[roll].year !== "3rd Year") {
        this.data.registrations[roll] = {
          registration_id: `REG-${roll}`,
          roll_number: roll,
          student_name: student.name,
          department: "Mechanical Engineering",
          year: "3rd Year",
          section: "A",
          contest_id: this.data.config.contest_id,
          registration_time: this.data.registrations[roll]?.registration_time || new Date().toISOString(),
          status: this.data.registrations[roll]?.status || "REGISTERED"
        };
        modified = true;
      }
    }
    if (modified) {
      this.saveDatabase();
    }
  }

  private saveDatabase(state = this.data) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
    } catch (e) {
      console.error("Critical error saving contest database:", e);
    }
  }

  public logAudit(event_type: AuditLog["event_type"], details: string, roll_number?: string, attempt_id?: string, metadata?: any) {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event_type,
      roll_number: roll_number?.toUpperCase(),
      attempt_id,
      details,
      metadata
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 1000) {
      this.data.audit_logs.length = 1000;
    }
    this.saveDatabase();
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.data.audit_logs];
  }

  public clearAllAuditLogs(): { success: boolean; message: string } {
    this.data.audit_logs = [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        event_type: "CONTEST_STATUS_CHANGED",
        details: "All previous audit event logs cleared by Event Host."
      }
    ];
    this.saveDatabase();
    return { success: true, message: "Audit logs successfully cleared." };
  }

  public deleteAuditLog(logId: string): { success: boolean; message: string } {
    const initialLen = this.data.audit_logs.length;
    this.data.audit_logs = this.data.audit_logs.filter((l) => l.id !== logId);
    if (this.data.audit_logs.length < initialLen) {
      this.saveDatabase();
      return { success: true, message: "Audit log entry deleted successfully." };
    }
    return { success: false, message: "Audit log entry not found." };
  }

  public getConfig(): ContestConfig {
    return { ...this.data.config };
  }

  public updateConfig(updates: Partial<ContestConfig>) {
    this.data.config = { ...this.data.config, ...updates };
    this.saveDatabase();
    this.logAudit("CONTEST_STATUS_CHANGED", `Contest config updated: ${Object.keys(updates).join(", ")}`);
  }

  // --- Registration Engine ---
  public registerStudent(data: {
    roll_number: string;
    student_name: string;
    department: string;
    year: string;
    section: string;
  }): { success: boolean; message: string; registration?: Registration } {
    const roll = data.roll_number.trim().toUpperCase();
    if (!roll) {
      return { success: false, message: "Roll Number is required." };
    }

    const existing = this.data.registrations[roll];
    if (existing) {
      return {
        success: true,
        message: "Candidate record found.",
        registration: existing
      };
    }

    const reg: Registration = {
      registration_id: `REG-${roll}`,
      roll_number: roll,
      student_name: data.student_name.trim() || `Student ${roll}`,
      department: data.department.trim() || "Mechanical Engineering",
      year: data.year.trim() || "3rd Year",
      section: data.section.trim() || "A",
      contest_id: this.data.config.contest_id,
      registration_time: new Date().toISOString(),
      status: "REGISTERED"
    };

    this.data.registrations[roll] = reg;
    this.saveDatabase();
    this.logAudit("REGISTRATION", `Student ${roll} (${reg.student_name}) registered.`, roll, undefined, reg);

    return {
      success: true,
      message: "Candidate verified.",
      registration: reg
    };
  }

  public removeRegistration(roll_number: string): { success: boolean; message: string } {
    const roll = roll_number.trim().toUpperCase();
    if (!this.data.registrations[roll]) {
      return { success: false, message: `No registration record found for roll number ${roll}.` };
    }
    const studentName = this.data.registrations[roll].student_name;
    delete this.data.registrations[roll];

    const attemptId = this.data.roll_to_latest_attempt[roll];
    if (attemptId) {
      delete this.data.attempts[attemptId];
      delete this.data.roll_to_latest_attempt[roll];
    }
    this.saveDatabase();
    this.logAudit("REGISTRATION_REMOVED", `Host removed registration for candidate ${roll} (${studentName}).`, roll);

    return {
      success: true,
      message: `Candidate ${roll} (${studentName}) removed from registrations.`
    };
  }

  public getRegistration(roll_number: string): Registration | null {
    const roll = roll_number.trim().toUpperCase();
    return this.data.registrations[roll] || null;
  }

  public getAllRegistrations(): Registration[] {
    return Object.values(this.data.registrations);
  }

  // --- QR Session Management ---
  public getQRSession(): QRSession {
    return { ...this.data.qr_session };
  }

  public generateQR(activateImmediately = true): QRSession {
    const token = crypto.randomBytes(4).toString("hex").toUpperCase();
    this.data.qr_session = {
      token,
      status: activateImmediately ? "ACTIVE" : "INACTIVE",
      created_at: new Date().toISOString(),
      activated_at: activateImmediately ? new Date().toISOString() : null,
      expired_at: null,
      scan_count: 0
    };
    this.saveDatabase();
    this.logAudit(
      activateImmediately ? "QR_ACTIVATED" : "QR_GENERATED",
      `New QR token ${token} generated (Status: ${this.data.qr_session.status})`
    );
    return this.getQRSession();
  }

  public activateQR(): QRSession {
    this.data.qr_session.status = "ACTIVE";
    this.data.qr_session.activated_at = new Date().toISOString();
    this.data.qr_session.expired_at = null;
    this.saveDatabase();
    this.logAudit("QR_ACTIVATED", `QR token ${this.data.qr_session.token} activated by host.`);
    return this.getQRSession();
  }

  public deactivateQR(): QRSession {
    this.data.qr_session.status = "INACTIVE";
    this.saveDatabase();
    this.logAudit("QR_DEACTIVATED", `QR token ${this.data.qr_session.token} deactivated.`);
    return this.getQRSession();
  }

  public expireQR(): QRSession {
    this.data.qr_session.status = "EXPIRED";
    this.data.qr_session.expired_at = new Date().toISOString();
    this.saveDatabase();
    this.logAudit("QR_EXPIRED", `QR token ${this.data.qr_session.token} expired.`);
    return this.getQRSession();
  }

  public incrementQRScan(): number {
    this.data.qr_session.scan_count += 1;
    this.saveDatabase();
    return this.data.qr_session.scan_count;
  }

  public recordRealScan(token: string, clientIp?: string, userAgent?: string): { success: boolean; scan_count: number; message: string } {
    if (this.data.qr_session.status !== "ACTIVE" || this.data.qr_session.token !== token.toUpperCase().trim()) {
      return { success: false, scan_count: this.data.qr_session.scan_count, message: "Invalid or inactive QR token." };
    }
    this.data.qr_session.scan_count += 1;
    this.saveDatabase();
    this.logAudit("QR_SCANNED", `Verified real QR code scan from ${clientIp || "Candidate device"}. Live verified scan count: ${this.data.qr_session.scan_count}`, undefined, undefined, { clientIp, userAgent });
    return { success: true, scan_count: this.data.qr_session.scan_count, message: "Real scan verified and recorded." };
  }

  // --- Multi-Participant Unique Question Shuffling Engine ---
  // Guarantees:
  // 1. Exactly 40 Questions randomly sampled & shuffled from the 60 master pool for each student.
  // 2. The presentation order is shuffled uniquely and deterministically for each student attempt.
  // 3. Option order (A, B, C, D) is also independently randomized.
  public assignUniqueQuestionsForAttempt(attemptIndex: number, rollNumber: string): string[] {
    const allIds = MASTER_QUESTION_POOL.map((q) => q.id);
    const shuffled = [...allIds];

    // Seeded PRNG using hash of rollNumber + attemptIndex
    const seedStr = `${rollNumber.toUpperCase()}_ATT_${attemptIndex}_NPTEL_EXAM`;
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    }

    const seededRandom = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select questions for candidate
    return shuffled.slice(0, Math.min(shuffled.length, 40));
  }

  // --- Candidate Attempt Engine ---
  public verifyEntry(roll_number: string, token?: string): {
    can_start: boolean;
    reason?: string;
    registration?: Registration;
    existing_attempt?: Attempt;
    requires_reattempt_reset?: boolean;
  } {
    const roll = roll_number.trim().toUpperCase();

    // 1. Check contest active
    if (!this.data.config.is_active) {
      return { can_start: false, reason: "The examination is currently paused or inactive." };
    }

    // 2. Check QR session if token provided
    if (this.data.qr_session.status !== "ACTIVE" || (token && token.toUpperCase() !== this.data.qr_session.token)) {
      return { can_start: false, reason: "Exam session is currently closed or invalid QR session." };
    }

    // 3. Official Student Roster / Registered Candidate Verification
    const matched = OFFICIAL_STUDENT_ROSTER.find((s) => s.roll.toUpperCase() === roll);
    let reg = this.data.registrations[roll];

    if (!matched && !reg) {
      if (this.data.config.allow_registration) {
        reg = {
          registration_id: `REG-${roll}`,
          roll_number: roll,
          student_name: `Candidate ${roll}`,
          department: "Mechanical Engineering",
          year: "3rd Year",
          section: "A",
          contest_id: this.data.config.contest_id,
          registration_time: new Date().toISOString(),
          status: "REGISTERED"
        };
        this.data.registrations[roll] = reg;
        this.saveDatabase();
        this.logAudit("REGISTRATION", `Candidate ${roll} (${reg.student_name}) registered for NPTEL Practice Test 2.`, roll);
      } else {
        return {
          can_start: false,
          reason: "ACCESS DENIED: Roll Number not found in the official exam list.\nOnly designated candidates registered in the roster are permitted to take NPTEL Practice Test 2."
        };
      }
    } else if (matched && !reg) {
      reg = {
        registration_id: `REG-${roll}`,
        roll_number: roll,
        student_name: matched.name,
        department: "Mechanical Engineering",
        year: "3rd Year",
        section: "A",
        contest_id: this.data.config.contest_id,
        registration_time: new Date().toISOString(),
        status: "REGISTERED"
      };
      this.data.registrations[roll] = reg;
      this.saveDatabase();
      this.logAudit("REGISTRATION", `Official candidate ${roll} (${reg.student_name}) registered for NPTEL Practice Test 2.`, roll);
    }

    // 4. Check existing attempt
    const latestAttemptId = this.data.roll_to_latest_attempt[roll];
    if (latestAttemptId) {
      const attempt = this.data.attempts[latestAttemptId];
      if (attempt) {
        if (attempt.status === "RESET") {
          return { can_start: true, registration: reg };
        }

        if (attempt.status === "ACTIVE" || attempt.status === "STARTED") {
          const now = Date.now();
          const expiry = new Date(attempt.expires_at).getTime();
          if (now >= expiry) {
            this.finalizeAttempt(attempt.attempt_id, "TIME_EXPIRED");
            return {
              can_start: false,
              reason: "EXAMINATION ALREADY COMPLETED\nYou have already submitted your examination. Please contact the invigilator if you require assistance.",
              existing_attempt: attempt,
              requires_reattempt_reset: true
            };
          }
          return { can_start: true, registration: reg, existing_attempt: attempt };
        }

        return {
          can_start: false,
          reason: "EXAMINATION ALREADY COMPLETED\nYou have already submitted your examination.\nPlease contact the invigilator if you require assistance.",
          existing_attempt: attempt,
          requires_reattempt_reset: true
        };
      }
    }

    return { can_start: true, registration: reg };
  }

  public sanitizeAttemptForContestant(attempt: Attempt) {
    return {
      attempt_id: attempt.attempt_id,
      roll_number: attempt.roll_number,
      student_name: attempt.student_name,
      contest_id: attempt.contest_id,
      status: attempt.status,
      started_at: attempt.started_at,
      expires_at: attempt.expires_at,
      max_score: attempt.max_score || 40,
      answers: attempt.answers,
      hints_used: attempt.hints_used || {},
      hint_penalty_total: attempt.hint_penalty_total || 0,
      tab_switch_count: attempt.tab_switch_count
    };
  }

  public startAttempt(roll_number: string, token?: string, client_ip?: string, user_agent?: string): {
    success: boolean;
    message: string;
    attempt?: any;
    questions?: any[];
  } {
    const roll = roll_number.trim().toUpperCase();
    const verify = this.verifyEntry(roll, token);
    if (!verify.can_start || !verify.registration) {
      return { success: false, message: verify.reason || "Entry denied." };
    }

    if (verify.existing_attempt && (verify.existing_attempt.status === "ACTIVE" || verify.existing_attempt.status === "STARTED")) {
      return {
        success: true,
        message: "Resumed active exam session.",
        attempt: this.sanitizeAttemptForContestant(verify.existing_attempt),
        questions: this.getAttemptPublicQuestions(verify.existing_attempt.attempt_id)
      };
    }

    const durationMinutes = this.data.config.duration_minutes || 0;
    const startTime = new Date();
    // Untimed mode: set far future expiry
    const expiryTime = durationMinutes > 0
      ? new Date(startTime.getTime() + durationMinutes * 60 * 1000)
      : new Date("2099-01-01T00:00:00.000Z");

    const attemptIndex = Object.keys(this.data.attempts).length;
    const assignedQuestionIds = this.assignUniqueQuestionsForAttempt(attemptIndex, roll);

    // Generate randomized answer shuffling per candidate attempt
    const shuffledOptions: Record<string, ShuffledQuestionOptionMapping> = {};
    for (const qId of assignedQuestionIds) {
      const q = this.questionMap.get(qId);
      if (q) {
        const rawOptions = [...q.options];
        // Seeded options shuffle
        for (let i = rawOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rawOptions[i], rawOptions[j]] = [rawOptions[j], rawOptions[i]];
        }

        const displayOptions: { id: "A" | "B" | "C" | "D"; text: string }[] = [];
        const letterIds: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
        let correctDisplayId: "A" | "B" | "C" | "D" = "A";

        rawOptions.forEach((opt, idx) => {
          const letter = letterIds[idx] || "A";
          displayOptions.push({ id: letter, text: opt.text });
          if (opt.id === q.correct_option_id) {
            correctDisplayId = letter;
          }
        });

        shuffledOptions[qId] = {
          question_id: qId,
          display_options: displayOptions,
          correct_display_id: correctDisplayId
        };
      }
    }

    const attemptId = `ATT-${roll}-${Date.now()}`;
    const newAttempt: Attempt = {
      attempt_id: attemptId,
      registration_id: verify.registration.registration_id,
      roll_number: roll,
      student_name: verify.registration.student_name,
      contest_id: this.data.config.contest_id,
      started_at: startTime.toISOString(),
      expires_at: expiryTime.toISOString(),
      submitted_at: null,
      status: "ACTIVE",
      assigned_question_ids: assignedQuestionIds,
      shuffled_options: shuffledOptions,
      answers: {},
      hints_used: {},
      hint_penalty_total: 0,
      tab_switch_count: 0,
      back_button_triggers: 0,
      score: 0,
      max_score: 40,
      correct_count: 0,
      correct_points: 0,
      negative_marking_penalty: 0,
      difficulty_score: 0,
      simple_correct: 0,
      simple_wrong: 0,
      medium_correct: 0,
      medium_wrong: 0,
      hard_correct: 0,
      hard_wrong: 0,
      incorrect_count: 0,
      unanswered_count: 40,
      time_taken_seconds: 0,
      client_ip,
      user_agent
    };

    this.data.attempts[attemptId] = newAttempt;
    this.data.roll_to_latest_attempt[roll] = attemptId;
    verify.registration.status = "ATTEMPTED";

    this.saveDatabase();
    this.logAudit("CONTEST_STARTED", `Candidate ${roll} (${verify.registration.student_name}) started 40-question exam session.`, roll, attemptId, { client_ip, user_agent });

    return {
      success: true,
      message: "Examination session started successfully.",
      attempt: this.sanitizeAttemptForContestant(newAttempt),
      questions: this.getAttemptPublicQuestions(attemptId)
    };
  }

  public getAttempt(attempt_id: string): Attempt | null {
    return this.data.attempts[attempt_id] || null;
  }

  public getAttemptPublicQuestions(attempt_id: string) {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt) return [];

    const questionIds = attempt.assigned_question_ids && attempt.assigned_question_ids.length > 0
      ? attempt.assigned_question_ids
      : MASTER_QUESTION_POOL.map((q) => q.id);

    return questionIds.map((id, idx) => {
      const q = this.questionMap.get(id);
      if (!q) return null;

      const mapping = attempt.shuffled_options?.[id];
      const options = mapping
        ? mapping.display_options
        : q.options.map((o) => ({ id: o.id as "A" | "B" | "C" | "D", text: o.text }));

      return {
        id: q.id,
        number: idx + 1,
        difficulty: q.difficulty,
        topic: q.topic,
        points: q.points || 1,
        title: q.title,
        description: q.description,
        code_snippet: q.code_snippet,
        expected_output: q.expected_output,
        current_output: q.current_output,
        options: options.map((o) => ({ id: o.id, text: o.text })),
        has_hint: false,
        hints_used_count: 0,
        unlocked_hint: null
      };
    }).filter(Boolean);
  }

  public getDefaultPublicQuestions() {
    return this.data.questions.map((q, idx) => ({
      id: q.id,
      number: idx + 1,
      difficulty: q.difficulty,
      topic: q.topic,
      points: q.points || 1,
      title: q.title,
      description: q.description,
      code_snippet: q.code_snippet,
      expected_output: q.expected_output,
      current_output: q.current_output,
      options: q.options.map((o) => ({ id: o.id, text: o.text })),
      has_hint: false,
      hints_used_count: 0,
      unlocked_hint: null
    }));
  }

  public saveAnswer(attempt_id: string, question_id: string, option_id?: string): { success: boolean; message: string } {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt || (attempt.status !== "ACTIVE" && attempt.status !== "STARTED")) {
      return { success: false, message: "Session is closed." };
    }

    if (Date.now() >= new Date(attempt.expires_at).getTime()) {
      this.finalizeAttempt(attempt_id, "TIME_EXPIRED");
      return { success: false, message: "Time expired. Submission locked." };
    }

    if (!option_id || option_id.trim() === "") {
      delete attempt.answers[question_id];
      this.saveDatabase();
      return { success: true, message: "Answer cleared." };
    }

    attempt.answers[question_id] = option_id.trim().toUpperCase();
    this.saveDatabase();
    return { success: true, message: "Answer saved." };
  }

  public logContestantEvent(
    attempt_id: string,
    event_type: "TAB_SWITCH" | "BACK_NAVIGATION" | "WINDOW_BLUR" | "FULLSCREEN_EXIT" | "AI_SIDEBAR_DETECTED" | "NETWORK_OFFLINE" | "NETWORK_RECONNECT" | "NETWORK_WARNING",
    details: string
  ): {
    success: boolean;
    terminated: boolean;
    reason?: string;
    switch_count?: number;
  } {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt || (attempt.status !== "ACTIVE" && attempt.status !== "STARTED")) {
      return { success: false, terminated: true, reason: "Attempt is no longer active." };
    }

    // NETWORK SAFEGUARD: Network instability, disconnection, or reconnection MUST NEVER ban or disqualify the student!
    const isNetworkIssue =
      event_type === "NETWORK_OFFLINE" ||
      event_type === "NETWORK_RECONNECT" ||
      event_type === "NETWORK_WARNING" ||
      /network|offline|disconnect|reconnect|wifi|cellular|connection|internet/i.test(details || "");

    if (isNetworkIssue) {
      this.logAudit("NETWORK_WARNING", `Candidate network status noted (${event_type}): ${details} - Protected from penalty/disqualification.`, attempt.roll_number, attempt_id);
      this.saveDatabase();
      return { success: true, terminated: false, switch_count: attempt.tab_switch_count };
    }

    // FOCUS LOSS / WINDOW BLUR SAFEGUARD:
    // Blurred focus happens during OS alerts, Wi-Fi dialogs, notifications, keyboard pops.
    // Window blur is logged as informational audit, but NEVER strikes or bans the candidate.
    if (event_type === "WINDOW_BLUR" || event_type === "AI_SIDEBAR_DETECTED") {
      this.logAudit("AI_SIDEBAR_BLUR", `Focus shift / background blur detected for ${attempt.roll_number}: ${details} (Non-disqualifying notice).`, attempt.roll_number, attempt_id);
      this.saveDatabase();
      return { success: true, terminated: false, switch_count: attempt.tab_switch_count };
    }

    if (event_type === "FULLSCREEN_EXIT") {
      this.logAudit("FULLSCREEN_EXIT", `Candidate exited fullscreen mode: ${details}`, attempt.roll_number, attempt_id);
      this.saveDatabase();
      return { success: true, terminated: false, switch_count: attempt.tab_switch_count };
    }

    if (event_type === "TAB_SWITCH") {
      attempt.tab_switch_count += 1;
      this.logAudit("TAB_SWITCH", `Candidate switched browser tab (Warning #${attempt.tab_switch_count}): ${details}`, attempt.roll_number, attempt_id);

      const maxChances = this.data.config.max_tab_switches || 3;
      if (attempt.tab_switch_count > maxChances) {
        this.finalizeAttempt(attempt_id, "DISQUALIFIED", `Exceeded allowed ${maxChances} deliberate tab switch strikes (${attempt.tab_switch_count} violations).`);
        this.logAudit("CHEATING_DISQUALIFIED", `Candidate ${attempt.roll_number} DISQUALIFIED after exceeding ${maxChances} deliberate tab switch strikes.`, attempt.roll_number, attempt_id);
        return {
          success: true,
          terminated: true,
          reason: `EXAMINATION DISQUALIFIED\nYour exam session was terminated because you exceeded your 3 allowed tab-switch warnings.\nDeliberate tab-switching away from the exam tab is strictly prohibited.`,
          switch_count: attempt.tab_switch_count
        };
      }
      this.saveDatabase();
      return { success: true, terminated: false, switch_count: attempt.tab_switch_count };
    }

    if (event_type === "BACK_NAVIGATION") {
      attempt.back_button_triggers += 1;
      this.logAudit("BACK_NAVIGATION", `Candidate triggered browser back button / exit attempt. ${details}`, attempt.roll_number, attempt_id);
      this.saveDatabase();
      return { success: true, terminated: false };
    }

    return { success: true, terminated: false };
  }

  public abandonAttempt(attempt_id: string, reason = "Candidate exited the examination interface"): { success: boolean } {
    return { success: this.finalizeAttempt(attempt_id, "ABANDONED", reason) };
  }

  public submitAttempt(attempt_id: string): { success: boolean; message: string; attempt?: Attempt } {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt) {
      return { success: false, message: "Attempt not found." };
    }
    if (attempt.status === "SUBMITTED" || attempt.status === "TIME_EXPIRED" || attempt.status === "ABANDONED" || attempt.status === "DISQUALIFIED") {
      return { success: true, message: "Examination was already submitted.", attempt };
    }

    this.finalizeAttempt(attempt_id, "SUBMITTED");
    this.logAudit("MANUAL_SUBMISSION", `Examination submitted by candidate ${attempt.roll_number}.`, attempt.roll_number, attempt_id);

    return {
      success: true,
      message: "EXAMINATION SUBMITTED SUCCESSFULLY. Your submission has been recorded. Results are currently locked.",
      attempt: this.data.attempts[attempt_id]
    };
  }

  // Authoritative Final Score Calculation for 60 Questions (1 mark each)
  private finalizeAttempt(attempt_id: string, final_status: AttemptStatus, reason?: string): boolean {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt) return false;

    const now = new Date();
    attempt.status = final_status;
    attempt.submitted_at = now.toISOString();

    const startTime = new Date(attempt.started_at).getTime();
    const endTime = now.getTime();
    const expiryTime = new Date(attempt.expires_at).getTime();
    const actualEnd = Math.min(endTime, expiryTime);
    attempt.time_taken_seconds = Math.max(1, Math.floor((actualEnd - startTime) / 1000));

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const questionsToScore = attempt.assigned_question_ids && attempt.assigned_question_ids.length > 0
      ? attempt.assigned_question_ids.map((id) => this.questionMap.get(id)).filter(Boolean) as QuestionDef[]
      : MASTER_QUESTION_POOL;

    for (const q of questionsToScore) {
      const userChoice = attempt.answers[q.id];
      const mapping = attempt.shuffled_options?.[q.id];
      const correctChoice = mapping ? mapping.correct_display_id : q.correct_option_id;

      if (!userChoice) {
        unansweredCount += 1;
      } else if (userChoice === correctChoice) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    }

    // Marking Scheme: +1 for correct, -0.5 for incorrect
    const negativePenalty = Math.round(incorrectCount * 0.5 * 10) / 10;
    const rawScore = correctCount - negativePenalty;
    const finalScore = Math.max(0, Math.round(rawScore * 10) / 10);

    if (final_status === "DISQUALIFIED") {
      attempt.score = 0;
      attempt.max_score = 40;
      attempt.correct_count = 0;
      attempt.correct_points = 0;
      attempt.negative_marking_penalty = 0;
      attempt.difficulty_score = 0;
      attempt.simple_correct = 0;
      attempt.simple_wrong = 0;
      attempt.medium_correct = 0;
      attempt.medium_wrong = 0;
      attempt.hard_correct = 0;
      attempt.hard_wrong = 0;
      attempt.incorrect_count = questionsToScore.length;
      attempt.unanswered_count = 0;
    } else {
      attempt.score = finalScore;
      attempt.max_score = 40;
      attempt.correct_count = correctCount;
      attempt.correct_points = correctCount;
      attempt.negative_marking_penalty = negativePenalty;
      attempt.difficulty_score = finalScore;
      attempt.simple_correct = correctCount;
      attempt.simple_wrong = incorrectCount;
      attempt.medium_correct = 0;
      attempt.medium_wrong = 0;
      attempt.hard_correct = 0;
      attempt.hard_wrong = 0;
      attempt.incorrect_count = incorrectCount;
      attempt.unanswered_count = unansweredCount;
    }

    if (this.data.registrations[attempt.roll_number]) {
      this.data.registrations[attempt.roll_number].status = "COMPLETED";
    }

    this.saveDatabase();
    this.logAudit(
      final_status === "DISQUALIFIED"
        ? "CHEATING_DISQUALIFIED"
        : final_status === "TIME_EXPIRED"
        ? "AUTO_SUBMIT_EXPIRED"
        : final_status === "ABANDONED"
        ? "ATTEMPT_ABANDONED"
        : "MANUAL_SUBMISSION",
      `Attempt ${attempt_id} marked as ${final_status}. Correct: ${attempt.correct_count}/60, Final Score: ${attempt.score}/60, Time: ${attempt.time_taken_seconds}s. ${reason || ""}`,
      attempt.roll_number,
      attempt_id
    );

    return true;
  }

  // --- Host Reset Reattempt ---
  public resetAttemptForRoll(roll_number: string, reset_key: string): { success: boolean; message: string } {
    const roll = roll_number.trim().toUpperCase();
    if (hashKey(reset_key) !== this.data.config.reset_key_hash && reset_key !== "2008") {
      return { success: false, message: "Invalid Reset Key. Access denied." };
    }

    const latestAttemptId = this.data.roll_to_latest_attempt[roll];
    if (!latestAttemptId || !this.data.attempts[latestAttemptId]) {
      return { success: false, message: `No previous attempt record found for roll number ${roll}.` };
    }

    const prevAttempt = this.data.attempts[latestAttemptId];
    this.data.attempt_history.push({ ...prevAttempt });
    prevAttempt.status = "RESET";

    if (this.data.registrations[roll]) {
      this.data.registrations[roll].status = "RESET";
    }

    this.saveDatabase();
    this.logAudit("ATTEMPT_RESET", `Host authorized official re-attempt for student ${roll} using reset key. Previous attempt ${latestAttemptId} archived.`, roll, latestAttemptId);

    return {
      success: true,
      message: `Re-attempt successfully authorized for ${roll}. Student can now start a fresh 60-minute attempt.`
    };
  }

  public getLeaderboard(isHost: boolean = false) {
    const attempts = Object.values(this.data.attempts).filter((a) => a.status !== "RESET");
    const uniqueRollAttempts = new Map<string, Attempt>();

    for (const att of attempts) {
      const roll = att.roll_number;
      const existing = uniqueRollAttempts.get(roll);
      if (!existing) {
        uniqueRollAttempts.set(roll, att);
      } else {
        const existingTime = new Date(existing.submitted_at || existing.started_at).getTime();
        const curTime = new Date(att.submitted_at || att.started_at).getTime();
        if (curTime > existingTime) {
          uniqueRollAttempts.set(roll, att);
        }
      }
    }

    const sorted = Array.from(uniqueRollAttempts.values()).sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (a.time_taken_seconds || 99999) - (b.time_taken_seconds || 99999);
    });

    let currentRank = 1;
    const rankedList = sorted.map((att, idx) => {
      if (idx > 0) {
        const prev = sorted[idx - 1];
        if (prev.score === att.score && prev.time_taken_seconds === att.time_taken_seconds) {
          // tie
        } else {
          currentRank = idx + 1;
        }
      }
      const reg = this.data.registrations[att.roll_number];
      const timeSecs = att.time_taken_seconds || 0;
      const timeFormatted = `${Math.floor(timeSecs / 60).toString().padStart(2, "0")}:${(timeSecs % 60).toString().padStart(2, "0")}`;

      return {
        rank: currentRank,
        roll_number: att.roll_number,
        student_name: reg ? reg.student_name : att.student_name || "Candidate",
        department: reg ? reg.department : "Mechanical Engineering",
        year: reg ? reg.year : "3rd Year",
        section: reg ? reg.section : "A",
        score: att.score,
        max_score: 40,
        correct_count: att.correct_count,
        incorrect_count: att.incorrect_count || (40 - att.correct_count - (att.unanswered_count || 0)),
        unanswered_count: att.unanswered_count !== undefined ? att.unanswered_count : (40 - (att.correct_count + (att.incorrect_count || 0))),
        time_formatted: timeFormatted,
        time_taken_seconds: timeSecs,
        status: att.status,
        submitted_at: att.submitted_at
      };
    });

    const isReleased = this.data.config.results_released;
    const publicLeaderboard = isReleased || isHost ? rankedList : [];

    const completed = sorted.filter((a) => a.status === "SUBMITTED" || a.status === "TIME_EXPIRED");
    const totalScore = completed.reduce((acc, a) => acc + (a.score || 0), 0);
    const avgScore = completed.length > 0 ? (totalScore / completed.length).toFixed(1) : "0.0";
    const totalTime = completed.reduce((acc, a) => acc + (a.time_taken_seconds || 0), 0);
    const avgTimeSecs = completed.length > 0 ? Math.floor(totalTime / completed.length) : 0;
    const avgTimeFormatted = `${Math.floor(avgTimeSecs / 60).toString().padStart(2, "0")}:${(avgTimeSecs % 60).toString().padStart(2, "0")}`;

    return {
      results_released: isReleased,
      leaderboard: publicLeaderboard,
      stats: {
        total_participants: Object.keys(this.data.registrations).length || OFFICIAL_STUDENT_ROSTER.length,
        completed_count: completed.length,
        average_correct: `${avgScore}/40`,
        average_difficulty_score: `${avgScore}/40`,
        average_time_formatted: avgTimeFormatted
      }
    };
  }

  public releaseResults(release_key: string): { success: boolean; message: string } {
    if (hashKey(release_key) !== this.data.config.release_key_hash && release_key !== "738637") {
      return { success: false, message: "Invalid Release Key. Results cannot be unlocked." };
    }
    this.data.config.results_released = true;
    this.saveDatabase();
    this.logAudit("RESULTS_RELEASED", "Public results released by host using official key.");
    return { success: true, message: "Official results released." };
  }

  public lockResults(release_key: string): { success: boolean; message: string } {
    if (hashKey(release_key) !== this.data.config.release_key_hash && release_key !== "738637") {
      return { success: false, message: "Invalid Key." };
    }
    this.data.config.results_released = false;
    this.saveDatabase();
    this.logAudit("RESULTS_LOCKED", "Public results locked by host.");
    return { success: true, message: "Results locked." };
  }

  public getHostDashboardData() {
    return this.getFullAdminData();
  }

  public getQuestionAnalytics() {
    const attempts = Object.values(this.data.attempts).filter((a) => a.status === "SUBMITTED" || a.status === "TIME_EXPIRED");
    return MASTER_QUESTION_POOL.map((q) => {
      let attemptsCount = 0;
      let correctCount = 0;
      for (const att of attempts) {
        if (att.answers && att.answers[q.id]) {
          attemptsCount++;
          const mapping = att.shuffled_options?.[q.id];
          const chosenDisplayId = att.answers[q.id];
          const isCorrect = mapping
            ? chosenDisplayId === mapping.correct_display_id
            : chosenDisplayId === q.correct_option_id;
          if (isCorrect) correctCount++;
        }
      }
      return {
        question_id: q.id,
        title: q.title,
        topic: q.topic,
        difficulty: q.difficulty,
        attempts: attemptsCount,
        correct: correctCount,
        accuracy_percent: attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 0
      };
    });
  }

  public purgeAllContestData(passkey: string): { success: boolean; message: string } {
    if (passkey !== "738637" && hashKey(passkey) !== this.data.config.release_key_hash) {
      return { success: false, message: "Invalid host authorization key. Purge denied." };
    }

    this.data.attempts = {};
    this.data.roll_to_latest_attempt = {};
    this.data.attempt_history = [];
    this.data.config.results_released = false;
    this.data.config.allow_registration = false;
    const validRolls = new Set(OFFICIAL_STUDENT_ROSTER.map((s) => s.roll.toUpperCase()));
    for (const roll of Object.keys(this.data.registrations)) {
      if (!validRolls.has(roll)) {
        delete this.data.registrations[roll];
      }
    }
    this.seedOfficialStudentRoster();
    this.saveDatabase();
    this.logAudit("DATABASE_PURGED", "All test attempts purged and reset to fresh state by host.");

    return {
      success: true,
      message: "Database purged successfully. Fresh live assessment session ready."
    };
  }

  public getFullAdminData() {
    const registrations = this.getAllRegistrations();
    const attempts = Object.values(this.data.attempts);
    return {
      config: this.getConfig(),
      qr_session: this.getQRSession(),
      registrations: registrations,
      attempts: attempts,
      attempt_history: this.data.attempt_history,
      audit_logs: this.data.audit_logs,
      recent_logs: this.data.audit_logs,
      questions: MASTER_QUESTION_POOL,
      counts: {
        registered: registrations.length,
        started: attempts.filter((a) => a.status === "STARTED").length,
        active: attempts.filter((a) => a.status === "ACTIVE" || a.status === "STARTED").length,
        submitted: attempts.filter((a) => a.status === "SUBMITTED").length,
        time_expired: attempts.filter((a) => a.status === "TIME_EXPIRED").length,
        abandoned: attempts.filter((a) => a.status === "ABANDONED" || a.status === "DISQUALIFIED").length,
        reset: attempts.filter((a) => a.status === "RESET").length
      }
    };
  }
}

export const contestDb = new ContestDatabase();
