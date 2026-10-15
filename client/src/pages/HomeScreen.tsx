import { useState } from "react";
import { useLocation } from "wouter";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Info,
  LockKeyhole,
  LogIn,
  QrCode,
  ShieldCheck,
  Terminal,
  Trophy,
  Volume2,
  VolumeX,
  Zap
} from "lucide-react";
import { isSoundEnabled, playClickSound, setSoundEnabled } from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

export function HomeScreen() {
  const [, setLocation] = useLocation();
  const [soundOn, setSoundOnState] = useState(isSoundEnabled());
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [candidateRoll, setCandidateRoll] = useState("");
  const [rollError, setRollError] = useState("");
  const [step, setStep] = useState<"LOGIN" | "INSTRUCTIONS">("LOGIN");

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOnState(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  const navTo = (path: string) => {
    playClickSound();
    setLocation(path);
  };

  const handleRollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = candidateRoll.trim().toUpperCase();
    if (!cleanRoll) {
      setRollError("Please enter your official candidate Roll Number.");
      return;
    }
    setRollError("");
    playClickSound();
    setCandidateRoll(cleanRoll);
    setStep("INSTRUCTIONS");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProceedToExam = () => {
    playClickSound();
    const cleanRoll = candidateRoll.trim().toUpperCase();
    setLocation(`/contest?roll=${encodeURIComponent(cleanRoll)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-black selection:text-white relative overflow-x-hidden font-sans">
      {/* Subtle CBT Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px"
        }}
      />

      {/* TOP OFFICIAL STATUS BAR */}
      <header className="bg-white border-b border-slate-200 px-4 py-2.5 z-20 text-xs text-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-black text-slate-900 tracking-wide">
              PRAGATI UNIVERSITY
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-800 font-bold tracking-wide">
              NPTEL PRACTICE TEST 2
            </span>
            <span className="hidden md:inline-block text-slate-300">|</span>
            <span className="hidden md:inline-block text-slate-500 font-medium">
              COMPUTER BASED TEST (CBT) PORTAL
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleSound}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-black transition text-[11px] font-medium cursor-pointer"
              title={soundOn ? "Mute Audio SFX" : "Enable Audio SFX"}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-slate-800" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{soundOn ? "Audio On" : "Audio Muted"}</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setShowRulesModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-[11px] transition cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-slate-700" />
              <span>Exam Guidelines</span>
            </button>

            <button
              onClick={() => navTo("/admin")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 hover:bg-black text-white font-bold text-[11px] transition shadow-sm cursor-pointer"
            >
              <LockKeyhole className="w-3.5 h-3.5 text-slate-300" />
              <span>Invigilator / Host</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 z-10 space-y-8 flex-1">
        
        {/* OFFICIAL HERO BANNER */}
        <section className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm p-6 sm:p-10">
          
          {/* Header Branding Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
            <PragatiLogo
              variant="header"
              size="lg"
              subtitleText="ONLINE EXAMINATION PORTAL"
            />
          </div>

          {/* Academic Exam Title Banner */}
          <div className="text-center space-y-3 my-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-sm">
              <GraduationCap className="w-4 h-4 text-slate-900" />
              NPTEL
            </div>

            <h1 className="text-3xl sm:text-6xl font-black tracking-tight uppercase text-slate-950">
              METAL ADDITIVE MANUFACTURING
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
              Official Diagnostic Examination & Practice Assessment in Metal Additive Manufacturing.
            </p>
          </div>

          {/* STEP 1: CANDIDATE DIRECT LOGIN (INITIAL VIEW) */}
          {step === "LOGIN" && (
            <div className="mt-8 mx-auto max-w-xl bg-slate-50 border-2 border-slate-300 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider mb-2">
                <LogIn className="w-4 h-4" />
                <span>Candidate Direct Examination Login</span>
              </div>

              <p className="text-xs text-slate-600 mb-4 font-medium">
                All candidate roll numbers are pre-assigned. Simply enter your official University Roll Number to start your test.
              </p>

              <form onSubmit={handleRollSubmit} className="space-y-3">
                <div>
                  <label htmlFor="candidate-roll" className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    University Roll Number
                  </label>
                  <div className="relative">
                    <input
                      id="candidate-roll"
                      type="text"
                      value={candidateRoll}
                      onChange={(e) => {
                        setCandidateRoll(e.target.value.toUpperCase());
                        setRollError("");
                      }}
                      placeholder="e.g., 24A31A0301"
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-300 text-slate-950 font-mono text-base font-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 uppercase tracking-wider shadow-inner"
                      maxLength={15}
                      autoComplete="off"
                      autoFocus
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                      ROLL NO
                    </div>
                  </div>
                  {rollError && (
                    <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {rollError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider transition shadow-md active:scale-[0.99] cursor-pointer"
                >
                  <span>Enter & Start Examination</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1 text-slate-900 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Direct Roll Number Entry
                </span>
                <span className="font-mono text-slate-800 font-bold">40 MCQs · 60 Minutes (1 Hour)</span>
              </div>
            </div>
          )}

          {/* STEP 2: CANDIDATE VERIFIED & PROCEED BAR */}
          {step === "INSTRUCTIONS" && (
            <div className="mt-8 mx-auto max-w-2xl bg-slate-50 border-2 border-slate-300 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CANDIDATE AUTHENTICATED:</span>
                  <p className="text-base font-black text-slate-950 font-mono">
                    ROLL NO: <span className="text-black bg-white px-2 py-0.5 rounded border border-slate-300 font-black">{candidateRoll}</span>
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  3rd Year · Mechanical Engineering · Section A
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => setStep("LOGIN")}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  ← Change Roll Number
                </button>
                <button
                  onClick={handleProceedToExam}
                  className="w-full flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider transition shadow-lg active:scale-[0.99] cursor-pointer"
                >
                  <span>Proceed to Start Examination Arena</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* STEP 2 ONLY: EXAMINATION SPECIFICATIONS & STRUCTURE */}
        {step === "INSTRUCTIONS" && (
          <>
            <section className="space-y-4">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-900" /> Examination Structure & Marking Scheme
                </h2>
                <span className="text-xs text-slate-700 font-mono font-bold">40 Questions · 40 Max Marks · 60 Minutes</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Box 1: Correct Marking */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
                      Correct Answer
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      +1.0 Mark
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-950">+1 Mark per Question</div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Every correctly answered question awards 1 full mark. 40 questions sampled and randomized per candidate from the syllabus.
                  </p>
                  <div className="pt-2 text-[11px] font-mono font-bold text-slate-900">
                    Max Attainable Score: 40 Marks
                  </div>
                </div>

                {/* Box 2: Negative Marking */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
                      Negative Marking
                    </span>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      -0.5 Mark
                    </span>
                  </div>
                  <div className="text-2xl font-black text-rose-600">-0.5 Mark Penalty</div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Incorrect answers incur a -0.5 mark deduction. Unanswered questions receive 0 marks (no penalty).
                  </p>
                  <div className="pt-2 text-[11px] font-mono font-bold text-rose-600">
                    Penalty: -0.5 per wrong answer
                  </div>
                </div>

                {/* Box 3: Randomization & Time */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
                      Duration & Timer
                    </span>
                    <span className="text-[11px] font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
                      60 Minutes
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-950">60-Min Live Countdown</div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Official 60-minute examination countdown timer. Questions and options (A, B, C, D) are uniquely shuffled per candidate.
                  </p>
                  <div className="pt-2 text-[11px] font-mono font-bold text-slate-700">
                    40 Questions Assigned · 60 Minutes Total
                  </div>
                </div>

              </div>
            </section>

            {/* QUICK PORTAL ACCESS CARDS */}
            <section className="space-y-4">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-slate-900" /> Examination Portals
                </h2>
                <span className="text-xs text-slate-600 font-medium">Select portal to access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Card 1: Mobile Exam */}
                <div
                  onClick={handleProceedToExam}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-black rounded-2xl p-5 shadow-sm cursor-pointer transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-300 group-hover:scale-105 transition">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                        CANDIDATE PORTAL
                      </span>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-black transition">
                        CBT Exam Interface
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Enter the examination session with Roll Number {candidateRoll} to start the 40-question assessment.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-black">
                    <span>Start Assessment</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* Card 2: Public Leaderboard */}
                <div
                  onClick={() => navTo("/leaderboard")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-black rounded-2xl p-5 shadow-sm cursor-pointer transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-300 group-hover:scale-105 transition">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                        RESULTS & SCORES
                      </span>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-black transition">
                        Official Scoreboard
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      View scores, accuracy metrics, and official candidate merit rankings after host release.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-black">
                    <span>View Scoreboard</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* Card 3: Host Console */}
                <div
                  onClick={() => navTo("/admin")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-black rounded-2xl p-5 shadow-sm cursor-pointer transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-300 group-hover:scale-105 transition">
                      <LockKeyhole className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                        EXAMINATION CELL
                      </span>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-black transition">
                        Invigilator / Host Console
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Live monitoring, re-attempt authorizations, analytics, and official result release controls.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-black">
                    <span>Invigilator Login</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

              </div>
            </section>
          </>
        )}

      </main>

      {/* OFFICIAL FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-4 py-6 z-10 text-center space-y-2 text-xs text-slate-600">
        <div className="max-w-4xl mx-auto space-y-1">
          <p className="font-bold text-slate-800 uppercase tracking-wider">
            NPTEL · METAL ADDITIVE MANUFACTURING
          </p>
          <p className="text-slate-500 text-[11px]">
            National Programme on Technology Enhanced Learning · Examination Assessment Portal
          </p>
          <p className="text-[10px] text-slate-400 pt-1 font-mono">
            Official Examination System · All Rights Reserved © 2026
          </p>
        </div>
      </footer>

      {/* OFFICIAL EXAM GUIDELINES MODAL */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-slate-900" />
                <h3 className="font-black text-slate-900 uppercase text-sm tracking-wide">
                  NPTEL Practice Test 2 — Instructions to Candidates
                </h3>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setShowRulesModal(false);
                }}
                className="text-slate-500 hover:text-black text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
              
              <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 text-slate-800 font-semibold flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-900" />
                <span>
                  Candidates must read all instructions carefully before starting the exam. The assessment contains 40 randomized multiple-choice questions with no time limit.
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="font-bold text-slate-900 uppercase text-xs tracking-wider border-b border-slate-200 pb-1">
                  Examination Regulations:
                </div>
                
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 font-medium">
                  <li><strong>Single Attempt Rule:</strong> Each candidate Roll Number is permitted exactly ONE examination attempt.</li>
                  <li><strong>Pre-Assigned Roll Numbers:</strong> Only designated roll numbers from the official university roster are authorized to enter.</li>
                  <li><strong>No Time Limit:</strong> You may complete the examination at your own pace.</li>
                  <li><strong>Question Composition:</strong> Exactly 40 Multiple Choice Questions (randomly sampled from the syllabus).</li>
                  <li><strong>Marking Scheme:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
                      <li><strong>Correct Answer:</strong> +1.0 Mark per question.</li>
                      <li><strong>Incorrect Answer (Negative Marking):</strong> -0.5 Mark deduction per wrong answer.</li>
                      <li><strong>Unanswered Question:</strong> 0 Marks (No penalty).</li>
                      <li><strong>Maximum Score:</strong> 40 Marks.</li>
                    </ul>
                  </li>
                  <li><strong>Randomization:</strong> Both questions and options (A, B, C, D) are uniquely shuffled for every candidate.</li>
                  <li><strong>No Hints:</strong> Hint assistance is completely disabled. All questions are standard MCQs.</li>
                  <li><strong>Anti-Cheat & Tab Monitoring:</strong> Switching tabs, minimizing the browser, or attempting to open developer tools triggers automated security logging.</li>
                  <li><strong>Auto-Save:</strong> Selected responses are securely synchronized with the central examination database in real time.</li>
                </ol>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  playClickSound();
                  setShowRulesModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
              >
                Close Guidelines
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
