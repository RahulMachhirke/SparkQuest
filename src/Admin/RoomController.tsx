import React from 'react';
import { CompetitionState, Team } from '../types';
import { 
  Play, 
  RotateCcw, 
  Square, 
  Users, 
  Radio, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../lib/sound';

interface RoomControllerProps {
  compState: CompetitionState;
  teams: Team[];
  onLaunchRound1: () => void;
  onResetRound1: () => void;
  onEndRound1: () => void;
  onResetAllScores: () => void;
}

export const RoomController: React.FC<RoomControllerProps> = ({
  compState,
  teams,
  onLaunchRound1,
  onResetRound1,
  onEndRound1,
  onResetAllScores
}) => {
  const isLive = compState.round1Status === 'live';
  const isWaiting = compState.round1Status === 'waiting';
  const isEnded = compState.round1Status === 'ended';

  const completedCount = teams.filter((t) => !!t.completedAt).length;

  const handleLaunch = () => {
    soundEngine.roundStart();
    onLaunchRound1();
  };

  const handleReset = () => {
    if (window.confirm('Reset Round 1 back to Waiting Arena for all connected participants?')) {
      onResetRound1();
    }
  };

  const handleResetScores = () => {
    if (window.confirm('Clear all teams scores and completion times back to 0?')) {
      onResetAllScores();
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Arena Status Banner */}
      <div className="bg-[#023047]/90 border-2 border-[#219EBC]/40 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8ECAE6] font-bold">
                Master Arena Controller
              </span>
              <span
                className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full uppercase flex items-center gap-1.5 ${
                  isLive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                    : isWaiting
                    ? 'bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400' : isWaiting ? 'bg-[#FFB703]' : 'bg-rose-400'}`}></span>
                STATUS: {compState.round1Status.toUpperCase()}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white">
              {isWaiting && 'Participants are in the Waiting Arena'}
              {isLive && '⚡ Round 1 is actively running on all screens!'}
              {isEnded && 'Round 1 has been concluded by Admin'}
            </h3>

            <p className="text-xs text-slate-300 max-w-xl">
              {isWaiting &&
                'Teams logged in on the main website are currently viewing the waiting radar. Click "Launch Round 1" to broadcast the live questions to all connected teams simultaneously.'}
              {isLive &&
                'Questions are loaded dynamically from the Question Bank. As participants answer, submissions and speed timings sync back in realtime.'}
              {isEnded &&
                'Round 1 is closed. You can review final rankings or reset the arena for another session.'}
            </p>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-3">
            {isWaiting && (
              <button
                onClick={handleLaunch}
                className="px-6 py-4 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-[#FFB703] to-[#FB8500] hover:scale-105 text-[#011826] shadow-xl flex items-center gap-2.5 cursor-pointer transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Launch Round 1 to All Teams</span>
              </button>
            )}

            {isLive && (
              <button
                onClick={onEndRound1}
                className="px-6 py-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white shadow-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Conclude Round 1</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-4 py-3.5 rounded-xl font-mono text-xs text-slate-300 hover:text-white bg-[#011826] hover:bg-[#011826]/80 border border-white/10 flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4 text-[#8ECAE6]" />
              <span>Reset Arena to Waiting</span>
            </button>
          </div>
        </div>
      </div>

      {/* Realtime Live Participant Monitor */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/30 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#8ECAE6]" />
            <h4 className="font-bold text-white text-base">Live Participant Progress Monitor</h4>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#219EBC]/20 text-[#8ECAE6]">
              {completedCount}/{teams.length} Completed
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetScores}
              className="text-xs font-mono text-rose-300 hover:text-rose-200 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-950/40 transition-all cursor-pointer"
            >
              Reset All Scores to 0
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {teams.map((team) => {
            const hasFinished = !!team.completedAt;
            return (
              <div
                key={team.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  hasFinished
                    ? 'bg-[#011826] border-emerald-500/40'
                    : 'bg-[#011826]/60 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{team.avatar}</span>
                    <div>
                      <div className="font-bold text-white text-sm leading-tight">{team.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{team.id} • {team.college}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      hasFinished
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isLive
                        ? 'bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/40'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {hasFinished ? 'COMPLETED' : isLive ? 'IN PROGRESS' : 'WAITING'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 font-mono">
                  <span className="text-slate-400">Score:</span>
                  <span className="font-bold text-[#FFB703] text-sm">
                    {team.totalScore.toLocaleString()} pts
                  </span>
                </div>

                {hasFinished && team.timeTakenSec > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> Time:
                    </span>
                    <span className="text-[#8ECAE6]">{team.timeTakenSec.toFixed(1)}s</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
