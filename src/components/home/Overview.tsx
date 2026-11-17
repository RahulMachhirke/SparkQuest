import React from 'react';
import { 
  Flame, 
  Terminal, 
  Code2, 
  Trophy, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Shuffle, 
  Sparkles,
  Layers
} from 'lucide-react';
import { COMPETITION_DETAILS } from '../../data/competitionConfig';
import { useCompetition } from '../../context/CompetitionContext';
import { useAuth } from '../../context/AuthContext';

interface OverviewProps {
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
}

export const Overview: React.FC<OverviewProps> = ({ setActiveTab, openLoginModal }) => {
  const { roundStatus, teams } = useCompetition();
  const { currentTeam, role } = useAuth();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#023047] via-[#032537] to-[#011826] border border-[#219EBC]/40 shadow-2xl p-6 sm:p-10 lg:p-14">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FB8500]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#219EBC]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Department badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#023047]/90 border border-[#8ECAE6]/30 text-xs sm:text-sm font-medium text-[#8ECAE6] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FFB703] animate-pulse"></span>
            <span>Technospark Club • Department of Information Technology</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8ECAE6] to-[#219EBC]">
              Spark Quest
            </span>
            <span className="text-[#FFB703]"> | </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB703] to-[#FB8500]">
              Byte Logic
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Pimpri Chinchwad College of Engineering and Research (PCCOER), Ravet.
            The flagship five-round technical battlefield evaluating programming fundamentals, debugging prowess, adaptability, and team relay algorithmic mastery.
          </p>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-[#023047]/70 border border-[#219EBC]/30 text-center">
              <p className="text-xs text-[#8ECAE6] font-medium">Competition Format</p>
              <p className="text-base sm:text-lg font-bold text-white mt-0.5">5 Main Rounds</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#023047]/70 border border-[#219EBC]/30 text-center">
              <p className="text-xs text-[#8ECAE6] font-medium">Team Size</p>
              <p className="text-base sm:text-lg font-bold text-white mt-0.5">2–4 Participants</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#023047]/70 border border-[#FFB703]/30 text-center">
              <p className="text-xs text-[#FFB703] font-medium">Participating Teams</p>
              <p className="text-base sm:text-lg font-bold text-white mt-0.5">{teams.length} Teams</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#023047]/70 border border-[#FB8500]/30 text-center">
              <p className="text-xs text-[#FB8500] font-medium">Total Prize Pool</p>
              <p className="text-base sm:text-lg font-bold text-white mt-0.5">₹15,000</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('round1')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FB8500] to-[#FFB703] hover:from-[#FFB703] hover:to-[#FB8500] text-[#023047] font-extrabold text-sm sm:text-base shadow-xl shadow-[#FB8500]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Flame className="w-5 h-5 fill-current" />
              <span>Enter Round 1: Rapid Fire</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#023047] hover:bg-[#032537] text-white font-bold text-sm sm:text-base border border-[#219EBC] hover:border-[#8ECAE6] shadow-md transition"
            >
              <Trophy className="w-5 h-5 text-[#FFB703]" />
              <span>Live Leaderboard</span>
            </button>

            {role !== 'team' && (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#032537]/80 hover:bg-[#032537] text-[#8ECAE6] hover:text-white font-semibold text-sm border border-[#8ECAE6]/20 transition"
              >
                <Users className="w-4 h-4" />
                <span>Team Login</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Rounds Overview Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB703]">
              <Layers className="w-4 h-4" />
              <span>The Battle Stages</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">5-Round Competition Structure</h2>
            <p className="text-sm text-slate-300">Rounds 1, 2, and 5 take place live on this digital portal.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Round 1 Card */}
          <div className="relative group rounded-2xl bg-gradient-to-b from-[#032537] to-[#023047] border-2 border-[#8ECAE6]/40 hover:border-[#8ECAE6] p-6 shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#8ECAE6]/20 text-[#8ECAE6] border border-[#8ECAE6]/40">
                  Round 1 • Online Portal
                </span>
                <span className="text-xs font-semibold text-[#FFB703]">25–30 Questions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#8ECAE6]/20 border border-[#8ECAE6]/50 flex items-center justify-center text-[#8ECAE6]">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Rapid Fire</h3>
                  <p className="text-xs text-[#8ECAE6]">Kahoot-Style Online Quiz</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fast-paced multiple-choice and multi-select technical questions. Points awarded based on speed, accuracy, and streak multipliers.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-300 border-t border-[#219EBC]/20">
                <span>⏱️ 20 Mins</span>
                <span>🏆 Up to 3,000 pts</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('round1')}
              disabled={!roundStatus.round1Active}
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[#8ECAE6] hover:bg-white text-[#023047] transition shadow-md"
            >
              <span>{roundStatus.round1Active ? 'Launch Quiz Arena' : 'Round Locked'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Round 2 Card */}
          <div className="relative group rounded-2xl bg-gradient-to-b from-[#032537] to-[#023047] border-2 border-[#219EBC]/50 hover:border-[#219EBC] p-6 shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#219EBC]/20 text-[#219EBC] border border-[#219EBC]/40">
                  Round 2 • Online Portal
                </span>
                <span className="text-xs font-semibold text-[#FFB703]">2–3 Buggy Codes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#219EBC]/20 border border-[#219EBC]/50 flex items-center justify-center text-[#219EBC]">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Bug Hunt</h3>
                  <p className="text-xs text-[#219EBC]">LeetCode / HackerRank IDE</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Code snippets containing intentional syntax, runtime, and algorithmic bugs. Test cases, runtime compiler, and auto-score evaluation.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-300 border-t border-[#219EBC]/20">
                <span>⏱️ 30 Mins</span>
                <span>🏆 300 pts</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('round2')}
              disabled={!roundStatus.round2Active}
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[#219EBC] hover:bg-[#8ECAE6] text-white hover:text-[#023047] transition shadow-md"
            >
              <span>{roundStatus.round2Active ? 'Open Code IDE' : 'Round Locked'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Round 3 Card (Offline) */}
          <div className="relative group rounded-2xl bg-gradient-to-b from-[#032537]/70 to-[#023047]/70 border border-[#FFB703]/30 p-6 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/40">
                  Round 3 • Offline Chit Draw
                </span>
                <span className="text-xs text-slate-400">1 Member Solo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFB703]/20 border border-[#FFB703]/50 flex items-center justify-center text-[#FFB703]">
                  <Shuffle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Blind Coding</h3>
                  <p className="text-xs text-[#FFB703]">Language + Task Chit</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Draw 1 language (Java, C, C++, Python) and 1 programming task from two containers. Judged manually; scores updated on leaderboard.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-300 border-t border-[#219EBC]/20">
                <span>⏱️ 25 Mins</span>
                <span>🏆 100 pts (Manual)</span>
              </div>
            </div>

            <div className="mt-6 p-2.5 rounded-xl bg-[#023047] border border-[#FFB703]/20 text-center text-[11px] text-[#FFB703] font-medium">
              Conducted in College Lab • Evaluated by Judges
            </div>
          </div>

          {/* Round 4 Card (Offline) */}
          <div className="relative group rounded-2xl bg-gradient-to-b from-[#032537]/70 to-[#023047]/70 border border-[#FB8500]/30 p-6 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FB8500]/20 text-[#FB8500] border border-[#FB8500]/40">
                  Round 4 • Pen & Paper
                </span>
                <span className="text-xs text-slate-400">Team Analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FB8500]/20 border border-[#FB8500]/50 flex items-center justify-center text-[#FB8500]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Reverse Logic</h3>
                  <p className="text-xs text-[#FB8500]">Code to Algorithm</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Participants receive complete code snippets and must write detailed step-by-step algorithms evaluated on sequence, completeness, and logic.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-300 border-t border-[#219EBC]/20">
                <span>⏱️ 15–20 Mins</span>
                <span>🏆 100 pts (Manual)</span>
              </div>
            </div>

            <div className="mt-6 p-2.5 rounded-xl bg-[#023047] border border-[#FB8500]/20 text-center text-[11px] text-[#FB8500] font-medium">
              Pen-and-paper round • Evaluated by Faculty
            </div>
          </div>

          {/* Round 5 Card */}
          <div className="relative group md:col-span-2 lg:col-span-2 rounded-2xl bg-gradient-to-r from-[#032537] via-[#023047] to-[#011826] border-2 border-[#FB8500]/60 hover:border-[#FB8500] p-6 sm:p-8 shadow-2xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FB8500]/20 text-[#FB8500] border border-[#FB8500]/50">
                  Round 5 • Online Portal Flagship
                </span>
                <span className="text-xs font-bold text-[#FFB703]">40 Mins Total Duration</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FB8500] to-[#FFB703] text-[#023047] flex items-center justify-center font-black shadow-lg">
                  <Code2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Relay Coding</h3>
                  <p className="text-xs sm:text-sm text-[#FFB703]">
                    10m Brainstorming + 20m Sequential Member Hand-offs + 10m Collaborative Finish
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Coding responsibilities rotate sequentially among teammates. Outgoing coders pass handover notes before the next coder takes over. During the final 10 minutes, the entire team synchronizes to debug and submit!
              </p>
              <div className="flex flex-wrap gap-3 pt-2 text-xs text-slate-200">
                <span className="px-3 py-1 rounded-lg bg-[#023047] border border-[#219EBC]/30">Phase 1: 10m Team Plan</span>
                <span className="px-3 py-1 rounded-lg bg-[#023047] border border-[#219EBC]/30">Phase 2: 4x5m Member Relay</span>
                <span className="px-3 py-1 rounded-lg bg-[#023047] border border-[#219EBC]/30">Phase 3: 10m Team Debug</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('round5')}
              disabled={!roundStatus.round5Active}
              className="mt-6 w-full sm:w-auto self-start py-3 px-8 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 bg-gradient-to-r from-[#FB8500] to-[#FFB703] hover:from-[#FFB703] hover:to-[#FB8500] text-[#023047] transition shadow-xl"
            >
              <span>{roundStatus.round5Active ? 'Enter Relay Arena' : 'Round Locked'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Prize Pool Section */}
      <section className="rounded-3xl bg-gradient-to-b from-[#023047] to-[#011826] border border-[#FFB703]/30 p-6 sm:p-10 shadow-xl">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFB703]">
            <Trophy className="w-4 h-4" />
            <span>Grand Honors</span>
          </div>
          <h2 className="text-3xl font-black text-white">Prize Pool & Accolades</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Cash rewards, prestigious Technospark trophies, and merit certificates for winning teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {COMPETITION_DETAILS.prizes.map((prize) => {
            const isWinner = prize.rank === 1;
            return (
              <div
                key={prize.title}
                className={`relative rounded-2xl p-6 text-center space-y-3 transition-all ${
                  isWinner
                    ? 'bg-gradient-to-b from-[#032537] to-[#023047] border-2 border-[#FFB703] shadow-2xl scale-105 order-first md:order-none'
                    : 'bg-[#032537]/80 border border-[#219EBC]/30 shadow-lg'
                }`}
              >
                {isWinner && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFB703] text-[#023047] shadow-md">
                    Champion
                  </span>
                )}
                <div
                  className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl font-black"
                  style={{ backgroundColor: `${prize.color}25`, border: `1px solid ${prize.color}60` }}
                >
                  {prize.rank === 1 ? '🥇' : prize.rank === 2 ? '🥈' : '🥉'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{prize.title}</h3>
                  <p className="text-3xl font-black mt-1" style={{ color: prize.color }}>
                    {prize.amount}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{prize.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
