import React, { useEffect } from 'react';
import { Team } from '../types';
import { Trophy, Clock, Flame, ArrowRight, BarChart2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizResultsProps {
  team: Team;
  totalQuestions: number;
  correctCount: number;
  timeTakenSec: number;
  streakPeak: number;
  onViewLeaderboard: () => void;
  onViewRound2: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  team,
  totalQuestions,
  correctCount,
  timeTakenSec,
  streakPeak,
  onViewLeaderboard,
  onViewRound2
}) => {
  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FB8500', '#FFB703', '#219EBC', '#8ECAE6']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const accuracyPct = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-[#023047]/95 border-2 border-[#FFB703]/50 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FFB703]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#FFB703] to-[#FB8500] p-1 shadow-2xl flex items-center justify-center text-4xl">
          <Trophy className="w-10 h-10 text-[#011826]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FFB703]/20 text-[#FFB703]">
            <Sparkles className="w-3.5 h-3.5" />
            Round 1 Complete!
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Sensational Run, {team.name}!
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Your scores and completion timestamps have been successfully broadcasted to the competition live server.
          </p>
        </div>

        {/* Big Score Display */}
        <div className="p-6 rounded-2xl bg-[#011826]/90 border border-[#219EBC]/40 max-w-md mx-auto space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-[#8ECAE6]">
            Total Points Earned
          </div>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFB703] via-[#FB8500] to-[#8ECAE6]">
            {team.round1Score.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-emerald-400">
            Speed-weighted accuracy score
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div className="p-3.5 rounded-xl bg-[#011826]/70 border border-white/10 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Accuracy
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {correctCount}/{totalQuestions}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">{accuracyPct}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#011826]/70 border border-white/10 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8ECAE6]" />
              Time
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {timeTakenSec.toFixed(1)}s
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Tie-breaker</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#011826]/70 border border-white/10 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#FB8500]" />
              Best Streak
            </div>
            <div className="text-lg font-bold text-[#FFB703] mt-1">
              {streakPeak}x
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Flame bonus</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onViewLeaderboard}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-[#219EBC] hover:bg-[#8ECAE6] text-[#011826] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Check Live Leaderboard</span>
          </button>

          <button
            onClick={onViewRound2}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-[#011826] hover:bg-[#023047] text-white border border-[#FFB703]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Round 2 Teaser</span>
            <ArrowRight className="w-4 h-4 text-[#FFB703]" />
          </button>
        </div>
      </div>
    </div>
  );
};
