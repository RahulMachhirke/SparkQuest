import React, { useState } from 'react';
import { CompetitionState, Team, Question } from '../types';
import { RoomController } from './RoomController';
import { QuestionBank } from './QuestionBank';
import { ScoreAdjuster } from './ScoreAdjuster';
import { TeamManager } from './TeamManager';
import { LiveLeaderboard } from '../Leaderboard/LiveLeaderboard';
import { 
  ShieldCheck, 
  Radio, 
  BookOpen, 
  Sliders, 
  Trophy, 
  Database, 
  LogOut, 
  ExternalLink,
  Copy,
  Check,
  Users
} from 'lucide-react';
import { SUPABASE_URL } from '../lib/supabase';

interface AdminDashboardProps {
  teams: Team[];
  questions: Question[];
  compState: CompetitionState;
  onLaunchRound1: () => void;
  onResetRound1: () => void;
  onEndRound1: () => void;
  onResetAllScores: () => void;
  onAdjustScore: (teamId: string, delta: number) => void;
  onResetTeamScore: (teamId: string) => void;
  onUpdateTeams: (newTeams: Team[]) => void;
  onAddTeam: (teamData: Omit<Team, 'round1Score' | 'manualAdjustment' | 'totalScore' | 'timeTakenSec' | 'completedAt'>) => void;
  onEditTeam: (id: string, updated: Partial<Team>) => void;
  onDeleteTeam: (id: string) => void;
  onResetTeamsToDefault: () => void;
  onAddQuestion: (q: Omit<Question, 'id'>) => void;
  onEditQuestion: (id: string, updated: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onResetQuestionsToDefault: () => void;
  onExitToSite: () => void;
  onLogoutAdmin: () => void;
}

type TabType = 'room' | 'teams' | 'questions' | 'scores' | 'standings' | 'supabase';

const SUPABASE_SCHEMA_SQL = `-- Technospark Spark Quest Database Schema for Supabase
-- Run this in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS competition_state (
  id INT PRIMARY KEY DEFAULT 1,
  current_round INT DEFAULT 1,
  round1_status TEXT DEFAULT 'waiting',
  active_question_index INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO competition_state (id, current_round, round1_status)
VALUES (1, 1, 'waiting')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  passcode TEXT NOT NULL,
  college TEXT NOT NULL,
  members TEXT NOT NULL,
  avatar TEXT DEFAULT '⚡',
  round1_score INT DEFAULT 0,
  manual_adjustment INT DEFAULT 0,
  total_score INT DEFAULT 0,
  time_taken_sec NUMERIC DEFAULT 0,
  completed_at TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  code TEXT,
  options JSONB NOT NULL,
  correct JSONB NOT NULL,
  explanation TEXT,
  time_limit_sec INT DEFAULT 20,
  points INT DEFAULT 1000
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE competition_state;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE questions;
`;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  teams,
  questions,
  compState,
  onLaunchRound1,
  onResetRound1,
  onEndRound1,
  onResetAllScores,
  onAdjustScore,
  onResetTeamScore,
  onUpdateTeams,
  onAddTeam,
  onEditTeam,
  onDeleteTeam,
  onResetTeamsToDefault,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onResetQuestionsToDefault,
  onExitToSite,
  onLogoutAdmin
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('room');
  const [copiedSql, setCopiedSql] = useState(false);

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const isSupabaseActive = !SUPABASE_URL.includes('your-project');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Admin Navigation Header */}
      <div className="bg-[#023047]/95 border-2 border-[#FB8500]/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#011826] border border-[#FB8500]/50 flex items-center justify-center text-[#FB8500] shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Organizer Control Center</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FB8500]/20 text-[#FB8500] border border-[#FB8500]/40">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-300">
              SPARK QUEST 2026 • Full Administrative Authority
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onExitToSite}
            className="px-3 py-2 rounded-xl bg-[#011826] hover:bg-white/5 border border-white/10 text-xs font-mono text-[#8ECAE6] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Participant View</span>
          </button>

          <button
            onClick={onLogoutAdmin}
            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-xs font-mono text-red-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Admin</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('room')}
          className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'room'
              ? 'bg-[#219EBC] text-[#011826] shadow-lg'
              : 'bg-[#023047]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Room Controller</span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'teams'
              ? 'bg-[#219EBC] text-[#011826] shadow-lg'
              : 'bg-[#023047]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Participants ({teams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-[#219EBC] text-[#011826] shadow-lg'
              : 'bg-[#023047]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Question Bank ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scores')}
          className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'scores'
              ? 'bg-[#219EBC] text-[#011826] shadow-lg'
              : 'bg-[#023047]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Score Adjuster</span>
        </button>

        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'standings'
              ? 'bg-[#219EBC] text-[#011826] shadow-lg'
              : 'bg-[#023047]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Live Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-[#219EBC] text-[#011826] shadow-lg'
              : 'bg-[#023047]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase Sync</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'room' && (
          <RoomController
            compState={compState}
            teams={teams}
            onLaunchRound1={onLaunchRound1}
            onResetRound1={onResetRound1}
            onEndRound1={onEndRound1}
            onResetAllScores={onResetAllScores}
          />
        )}

        {activeTab === 'teams' && (
          <TeamManager
            teams={teams}
            onAddTeam={onAddTeam}
            onEditTeam={onEditTeam}
            onDeleteTeam={onDeleteTeam}
            onResetToDefault={onResetTeamsToDefault}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBank
            questions={questions}
            onAddQuestion={onAddQuestion}
            onEditQuestion={onEditQuestion}
            onDeleteQuestion={onDeleteQuestion}
            onResetToDefault={onResetQuestionsToDefault}
          />
        )}

        {activeTab === 'scores' && (
          <ScoreAdjuster
            teams={teams}
            onAdjustScore={onAdjustScore}
            onResetTeamScore={onResetTeamScore}
            onUpdateTeams={onUpdateTeams}
          />
        )}

        {activeTab === 'standings' && (
          <LiveLeaderboard teams={teams} />
        )}

        {activeTab === 'supabase' && (
          <div className="bg-[#023047]/90 border border-[#219EBC]/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-[#219EBC]" />
                <div>
                  <h3 className="text-lg font-bold text-white">Supabase Cloud Database & Realtime</h3>
                  <p className="text-xs text-slate-300">
                    Production PostgreSQL persistence and live WebSocket broadcast status
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {isSupabaseActive ? 'CONNECTED TO SUPABASE' : 'CROSS-TAB REALTIME (LOCAL / MULTI-TAB ACTIVE)'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#011826] border border-[#219EBC]/30 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-[#FFB703] font-mono">Real-Time Sync Architecture:</div>
              <p>
                The application features an ultra-resilient dual-layer sync engine. In local / testing mode, it uses the high-speed browser <code>BroadcastChannel</code> API so opening the website and the admin panel in side-by-side tabs automatically synchronizes all questions, round starts, and score updates in <strong>zero milliseconds without needing credentials</strong>.
              </p>
              <p>
                To connect to your own Supabase cloud database, paste your credentials in <code>src/lib/supabase.ts</code> and execute the schema script below in your Supabase SQL Editor.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#8ECAE6] uppercase">
                  1-Click PostgreSQL Setup Script:
                </span>
                <button
                  onClick={copySql}
                  className="px-3 py-1.5 rounded-lg bg-[#219EBC] hover:bg-[#8ECAE6] text-[#011826] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#011826] border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto max-h-64 scrollbar-thin">
                <pre>{SUPABASE_SCHEMA_SQL}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
