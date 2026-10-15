import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Award,
  Crown,
  Lock,
  Medal,
  RefreshCw,
  Search,
  Sparkles,
  Timer,
  Trophy,
  UserCheck,
  Users,
  ArrowLeft
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { playClickSound, playCorrectSound } from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

export function PublicLeaderboardScreen() {
  const [, setLocation] = useLocation();
  const [resultsReleased, setResultsReleased] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_participants: 0,
    completed_count: 0,
    average_correct: "0.0/40",
    average_difficulty_score: "0.0/40",
    average_time_formatted: "00:00"
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Self position search
  const [searchRoll, setSearchRoll] = useState("");
  const [userPosition, setUserPosition] = useState<any>(null);
  const [searchingUser, setSearchingUser] = useState(false);

  useEffect(() => {
    const savedRoll = localStorage.getItem("registered_roll_number") || localStorage.getItem("contest_roll_number");
    if (savedRoll && !searchRoll) {
      setSearchRoll(savedRoll.toUpperCase());
    }
  }, []);

  const fetchLeaderboard = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const params: any = {};
      if (searchRoll.trim()) {
        params.search_roll = searchRoll.trim().toUpperCase();
      }
      const res = await axios.get("/api/leaderboard", { params });
      if (res.data.success) {
        setResultsReleased(res.data.results_released);
        setLeaderboard(res.data.leaderboard || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
        if (res.data.user_position) {
          setUserPosition(res.data.user_position);
        }
      }
    } catch {
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(() => fetchLeaderboard(false), 8000);
    return () => clearInterval(interval);
  }, [searchRoll]);

  const handleSearchMyRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRoll.trim()) {
      toast.error("Please enter your Roll Number to check your score.");
      return;
    }
    setSearchingUser(true);
    playClickSound();
    try {
      const res = await axios.get("/api/leaderboard", {
        params: { search_roll: searchRoll.trim().toUpperCase() }
      });
      if (res.data.success && res.data.user_position) {
        playCorrectSound();
        setUserPosition(res.data.user_position);
        toast.success(`Score loaded for ${searchRoll.trim().toUpperCase()}`);
      } else {
        setUserPosition(null);
        toast.error(`No exam record found for roll number ${searchRoll.trim().toUpperCase()}`);
      }
    } catch {
      toast.error("Failed to query candidate position.");
    } finally {
      setSearchingUser(false);
    }
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center p-4 sm:p-6 select-none relative overflow-x-hidden font-sans">
      <div className="w-full max-w-5xl z-10 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>

          <button
            onClick={() => fetchLeaderboard(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* University Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <PragatiLogo variant="stacked" size="lg" subtitleText="DEPARTMENT OF MECHANICAL ENGINEERING" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-300 text-slate-900 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> NPTEL PRACTICE TEST 2 · OFFICIAL SCOREBOARD
          </div>
        </div>

        {/* Compact Statistics Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-300 rounded-xl p-3.5 text-center space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center justify-center gap-1 font-mono">
              <Users className="w-3.5 h-3.5 text-slate-700" /> Total Students
            </span>
            <p className="text-2xl font-black text-slate-950 font-mono">{stats.total_participants}</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-3.5 text-center space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center justify-center gap-1 font-mono">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Completed
            </span>
            <p className="text-2xl font-black text-slate-950 font-mono">{stats.completed_count}</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-3.5 text-center space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center justify-center gap-1 font-mono">
              <Trophy className="w-3.5 h-3.5 text-amber-600" /> Avg Score
            </span>
            <p className="text-2xl font-black text-slate-950 font-mono">{stats.average_correct}</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-3.5 text-center space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center justify-center gap-1 font-mono">
              <Timer className="w-3.5 h-3.5 text-slate-700" /> Avg Time
            </span>
            <p className="text-2xl font-black text-slate-950 font-mono">{stats.average_time_formatted}</p>
          </div>
        </div>

        {/* Check My Score Section */}
        <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-700" /> Check Your Official Scorecard
            </h3>
            <span className="text-[11px] text-slate-500 font-mono font-bold">Roll-Based Query</span>
          </div>

          <form onSubmit={handleSearchMyRank} className="flex gap-2">
            <input
              type="text"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value.toUpperCase())}
              placeholder="Enter your University Roll Number (e.g. 24A31A0301)"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-300 text-slate-950 font-mono text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-black uppercase shadow-inner"
            />
            <button
              type="submit"
              disabled={searchingUser}
              className="px-6 py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
            >
              {searchingUser ? "Querying..." : "Search Score"}
            </button>
          </form>

          {userPosition && (
            <div className="mt-3 p-4 sm:p-5 rounded-xl bg-slate-50 border-2 border-slate-300 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CANDIDATE:</span>
                  <p className="text-base font-black text-slate-950 uppercase">
                    {userPosition.student_name} <span className="font-mono text-slate-600 font-normal">({userPosition.roll_number})</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">OFFICIAL SCORE:</span>
                  <p className="text-2xl font-black text-slate-950 font-mono">{userPosition.score} / 40</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-700 font-bold">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">CORRECT</span>
                  <span className="text-emerald-700 font-black">{userPosition.correct_count} / 40</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">TIME TAKEN</span>
                  <span className="text-slate-900 font-black">{userPosition.time_formatted}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">OVERALL RANK</span>
                  <span className="text-slate-900 font-black">#{userPosition.rank}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Released vs Locked Banner */}
        {!resultsReleased ? (
          <div className="bg-white border border-slate-300 rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto text-slate-700">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">
                OFFICIAL RESULTS ARE CURRENTLY LOCKED
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
                The conducting committee has not yet published the public leaderboard rankings. Individual candidate scores can be searched above.
              </p>
            </div>
          </div>
        ) : (
          /* Released Leaderboard Table */
          <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm space-y-0">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600" /> Candidate Merit Rankings (Released)
              </h3>
              <span className="text-xs font-mono font-bold text-slate-600">
                {leaderboard.length} Submissions Graded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-mono text-[11px] border-b border-slate-300">
                  <tr>
                    <th className="p-3.5 pl-5">Rank</th>
                    <th className="p-3.5">Roll Number</th>
                    <th className="p-3.5">Candidate Name</th>
                    <th className="p-3.5 text-center">Correct (/40)</th>
                    <th className="p-3.5 text-center">Score (/40)</th>
                    <th className="p-3.5 text-right pr-5">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {leaderboard.map((entry, idx) => (
                    <tr
                      key={entry.roll_number}
                      className={`hover:bg-slate-50 transition ${
                        idx === 0
                          ? "bg-amber-50/60"
                          : idx === 1
                          ? "bg-slate-100/70"
                          : idx === 2
                          ? "bg-amber-50/30"
                          : ""
                      }`}
                    >
                      <td className="p-3.5 pl-5 font-black text-slate-950">
                        {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${entry.rank}`}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{entry.roll_number}</td>
                      <td className="p-3.5 font-sans font-bold text-slate-950">{entry.student_name}</td>
                      <td className="p-3.5 text-center text-emerald-700 font-black">{entry.correct_count}</td>
                      <td className="p-3.5 text-center font-black text-slate-950 text-sm">{entry.score}</td>
                      <td className="p-3.5 text-right pr-5 text-slate-600 font-medium">{entry.time_formatted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
