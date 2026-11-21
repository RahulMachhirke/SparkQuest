import React, { useState } from 'react';
import { Team } from '../types';
import { soundEngine } from '../lib/sound';
import { 
  Radio, 
  Volume2, 
  Users, 
  Clock, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface WaitingArenaProps {
  currentTeam: Team;
  allTeams: Team[];
  onLogout: () => void;
}

export const WaitingArena: React.FC<WaitingArenaProps> = ({ currentTeam, allTeams, onLogout }) => {
  const [soundTested, setSoundTested] = useState(false);

  const testAudio = () => {
    soundEngine.correct();
    setSoundTested(true);
  };

  const onlineTeamsCount = allTeams.filter(t => t.isOnline || t.completedAt).length || 1;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Welcome & Team Status Header */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#219EBC]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#011826] border-2 border-[#FFB703] flex items-center justify-center text-3xl shadow-inner">
              {currentTeam.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#219EBC]/20 text-[#8ECAE6] border border-[#219EBC]/30">
                  {currentTeam.id}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  CONNECTED
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">{currentTeam.name}</h2>
              <p className="text-xs text-slate-300">{currentTeam.college} • {currentTeam.members}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="text-xs font-mono px-3.5 py-2 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-950/40 hover:border-red-400 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Realtime Waiting Pulse Banner (NO launch button - participant waits for admin) */}
        <div className="bg-[#011826]/90 border-2 border-[#FFB703]/50 rounded-2xl p-6 text-center space-y-4 shadow-xl relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFB703]/10 border border-[#FFB703]/40 text-[#FFB703] mx-auto animate-pulse">
            <Radio className="w-8 h-8 text-[#FFB703]" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FFB703]/20 text-[#FFB703]">
              <span className="w-2 h-2 rounded-full bg-[#FFB703] animate-ping"></span>
              Waiting Room Active
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Waiting for Organizer to Start Round 1...
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Please keep this screen open. The moment the admin launches the round from the control desk, your screen will automatically switch into the live competition arena.
            </p>
          </div>

          {/* Sound check button */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={testAudio}
              className="px-4 py-2 rounded-xl bg-[#023047] hover:bg-[#219EBC]/20 border border-[#219EBC]/40 text-xs font-mono text-[#8ECAE6] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#FFB703]" />
              {soundTested ? '✓ Audio Tested & Ready' : 'Test Audio Chimes'}
            </button>
          </div>
        </div>
      </div>

      {/* Rules & Kahoot Mechanics Brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#023047]/80 border border-[#219EBC]/20 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#FFB703]">
            <Clock className="w-5 h-5 text-[#FB8500]" />
            <h4 className="font-bold text-white text-sm">Speed Scoring</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Each question has a countdown timer (15–30s). The faster your team submits the correct answer, the closer you get to the full 1,000 points.
          </p>
        </div>

        <div className="bg-[#023047]/80 border border-[#219EBC]/20 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#8ECAE6]">
            <Zap className="w-5 h-5 text-[#219EBC]" />
            <h4 className="font-bold text-white text-sm">MCQ & MSQ Format</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Look out for Question Type badges! Standard questions are single-choice (MCQ). MSQs require selecting <strong>all correct choices</strong> to earn points.
          </p>
        </div>

        <div className="bg-[#023047]/80 border border-[#219EBC]/20 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#FB8500]">
            <Award className="w-5 h-5 text-[#FFB703]" />
            <h4 className="font-bold text-white text-sm">Streak Multipliers</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Answering consecutive questions correctly builds a flame streak, unlocking bonus accuracy points and shooting you up the live leaderboard.
          </p>
        </div>
      </div>

      {/* Participant Presence & Arena Roster */}
      <div className="bg-[#023047]/80 border border-[#219EBC]/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#8ECAE6]" />
            <h3 className="font-bold text-white text-base">Arena Roster</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#219EBC]/20 text-[#8ECAE6]">
              {allTeams.length} Registered Teams
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Synchronized via Supabase Realtime
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {allTeams.map((team) => {
            const isMe = team.id === currentTeam.id;
            return (
              <div
                key={team.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isMe
                    ? 'bg-[#011826] border-[#FFB703] shadow-md ring-1 ring-[#FFB703]/50'
                    : 'bg-[#011826]/60 border-[#219EBC]/20'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-lg">{team.avatar}</span>
                  <div className="truncate">
                    <div className="font-bold text-white truncate flex items-center gap-1">
                      {team.name}
                      {isMe && <span className="text-[10px] text-[#FFB703] font-mono">(You)</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{team.college}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-mono text-emerald-400">READY</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fair Play Notice */}
      <div className="p-4 rounded-xl bg-[#011826]/80 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200/90 font-mono">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Integrity Protocol:</strong> Tab switching, dev tools inspection, and session duplication are logged automatically. Please maintain fair play throughout the round.
        </div>
      </div>
    </div>
  );
};
