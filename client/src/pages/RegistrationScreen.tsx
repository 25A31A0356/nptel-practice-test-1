import { useState } from "react";
import { useLocation } from "wouter";
import {
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Info,
  LogIn,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { PragatiLogo } from "@/components/PragatiLogo";
import { playClickSound } from "@/lib/sound";

export function RegistrationScreen() {
  const [, setLocation] = useLocation();
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = rollNumber.trim().toUpperCase();
    if (!cleanRoll) {
      setError("Please enter your candidate Roll Number.");
      return;
    }
    setError("");
    playClickSound();
    setLocation(`/contest?roll=${encodeURIComponent(cleanRoll)}`);
  };

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <PragatiLogo variant="stacked" size="lg" subtitleText="PATHUB & PRAGATI UNIVERSITY" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            NPTEL PRACTICE TEST 1 · CANDIDATE ACCESS
          </div>
        </div>

        {/* Notice Card */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3 text-blue-300 text-xs sm:text-sm">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">No Separate Registration Required</p>
              <p className="text-xs text-slate-300 mt-1">
                Candidate Roll Numbers are pre-assigned by Pragati University for NPTEL Practice Test 1. Simply enter your official Roll Number below to start your examination.
              </p>
            </div>
          </div>

          <form onSubmit={handleStartExam} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                University Roll Number
              </label>
              <input
                type="text"
                autoFocus
                value={rollNumber}
                onChange={(e) => {
                  setRollNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                  setError("");
                }}
                placeholder="e.g. 23A91A0501"
                maxLength={15}
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3.5 text-center text-xl font-mono font-bold tracking-widest text-blue-300 placeholder:text-slate-600 focus:outline-none uppercase transition"
              />
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-blue-600/30 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Enter Examination</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <button
              onClick={() => {
                playClickSound();
                setLocation("/");
              }}
              className="text-xs text-slate-400 hover:text-white transition font-medium"
            >
              ← Back to Examination Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
