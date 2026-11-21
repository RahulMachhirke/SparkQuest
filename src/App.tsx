import React, { useState, useEffect } from 'react';
import { useCompetitionStore } from './lib/store';
import { TeamLogin } from './Auth/TeamLogin';
import { WaitingArena } from './Lobby/WaitingArena';
import { QuizEngine } from './Round1/QuizEngine';
import { Round2Teaser } from './Round2/Round2Teaser';
import { LiveLeaderboard } from './Leaderboard/LiveLeaderboard';
import { AdminLogin } from './Admin/AdminLogin';
import { AdminDashboard } from './Admin/AdminDashboard';
import { 
  Trophy, 
  Radio, 
  Bug, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';

export const App: React.FC = () => {
  const {
    teams,
    questions,
    compState,
    currentTeam,
    currentTeamId,
    loginTeam,
    logoutTeam,
    launchRound1,
    resetRound1,
    endRound1,
    recordTeamScore,
    adjustTeamScore,
    resetTeamScore,
    resetAllScores,
    addQuestion,
    editQuestion,
    deleteQuestion,
    resetQuestionsToDefault,
    updateTeams
  } = useCompetitionStore();

  // Route state: 'participant' vs 'admin'
  const [route, setRoute] = useState<'participant' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        return 'admin';
      }
    }
    return 'participant';
  });

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('sparkquest_admin_auth') === 'true';
    }
    return false;
  });

  // Participant view state: 'arena' | 'leaderboard' | 'round2'
  const [participantView, setParticipantView] = useState<'arena' | 'leaderboard' | 'round2'>('arena');

  // Handle URL hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        setRoute('admin');
      } else {
        setRoute('participant');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#/admin';
    setRoute('admin');
  };

  const navigateToParticipant = () => {
    window.location.hash = '#/';
    setRoute('participant');
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('sparkquest_admin_auth');
    setIsAdminAuthenticated(false);
  };

  // -----------------------------------------------------------------
  // ADMIN DASHBOARD ROUTE (/admin or #/admin)
  // -----------------------------------------------------------------
  if (route === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#011826] text-white flex flex-col justify-between selection:bg-[#FB8500] selection:text-[#011826]">
          <AdminLogin
            onSuccess={() => setIsAdminAuthenticated(true)}
            onExitToSite={navigateToParticipant}
          />
          <footer className="py-4 text-center text-[11px] font-mono text-slate-500 border-t border-white/5">
            Technospark 2026 Admin Gate • Restricted Access
          </footer>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#011826] text-white flex flex-col justify-between selection:bg-[#FB8500] selection:text-[#011826]">
        <main className="flex-1 py-6">
          <AdminDashboard
            teams={teams}
            questions={questions}
            compState={compState}
            onLaunchRound1={launchRound1}
            onResetRound1={resetRound1}
            onEndRound1={endRound1}
            onResetAllScores={resetAllScores}
            onAdjustScore={adjustTeamScore}
            onResetTeamScore={resetTeamScore}
            onUpdateTeams={updateTeams}
            onAddQuestion={addQuestion}
            onEditQuestion={editQuestion}
            onDeleteQuestion={deleteQuestion}
            onResetQuestionsToDefault={resetQuestionsToDefault}
            onExitToSite={navigateToParticipant}
            onLogoutAdmin={handleAdminLogout}
          />
        </main>
        <footer className="py-4 text-center text-[11px] font-mono text-slate-500 border-t border-white/5">
          Technospark 2026 Organizer Desk • Department of Information Technology, PCCOER Ravet
        </footer>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // PARTICIPANT ROUTE (/)
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#011826] text-white flex flex-col justify-between selection:bg-[#FB8500] selection:text-[#011826]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#011826]/90 backdrop-blur-md border-b border-[#219EBC]/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFB703] to-[#FB8500] flex items-center justify-center font-black text-[#011826] text-base shadow-md">
              SQ
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>SPARK QUEST</span>
                <span className="text-[#8ECAE6]">|</span>
                <span className="text-[#FB8500]">BYTE LOGIC</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Technospark 2026 • PCCOER Ravet
              </div>
            </div>
          </div>

          {/* Nav Links for logged in team */}
          {currentTeam && (
            <div className="flex items-center gap-2 sm:gap-3">
              <nav className="flex items-center gap-1 bg-[#023047] p-1 rounded-xl border border-[#219EBC]/30">
                <button
                  onClick={() => setParticipantView('arena')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    participantView === 'arena'
                      ? 'bg-[#219EBC] text-[#011826]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Arena</span>
                </button>

                <button
                  onClick={() => setParticipantView('leaderboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    participantView === 'leaderboard'
                      ? 'bg-[#219EBC] text-[#011826]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Leaderboard</span>
                </button>

                <button
                  onClick={() => setParticipantView('round2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    participantView === 'round2'
                      ? 'bg-[#219EBC] text-[#011826]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Round 2</span>
                </button>
              </nav>

              <button
                onClick={logoutTeam}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                title="Sign out of team"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col justify-center py-6">
        {!currentTeam ? (
          // 1. Participant Login
          <TeamLogin teams={teams} onLogin={loginTeam} />
        ) : (
          // 2. Participant Logged In Views
          <>
            {participantView === 'leaderboard' && (
              <LiveLeaderboard teams={teams} currentTeamId={currentTeam.id} />
            )}

            {participantView === 'round2' && (
              <Round2Teaser onBack={() => setParticipantView('arena')} />
            )}

            {participantView === 'arena' && (
              <>
                {/* When Admin has NOT launched the round yet -> WAITING ARENA */}
                {compState.round1Status === 'waiting' && (
                  <WaitingArena
                    currentTeam={currentTeam}
                    allTeams={teams}
                    onLogout={logoutTeam}
                  />
                )}

                {/* When Admin clicks Launch Round 1 -> QUIZ ENGINE */}
                {compState.round1Status === 'live' && (
                  <QuizEngine
                    questions={questions}
                    currentTeam={currentTeam}
                    onRecordScore={recordTeamScore}
                    onViewLeaderboard={() => setParticipantView('leaderboard')}
                    onViewRound2={() => setParticipantView('round2')}
                    onLogout={logoutTeam}
                  />
                )}

                {/* When Admin concludes Round 1 -> Show Leaderboard / Finished */}
                {compState.round1Status === 'ended' && (
                  <div className="w-full max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#023047] border border-[#FFB703]/50 flex items-center justify-center text-[#FFB703] mx-auto shadow-xl">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-extrabold text-white">
                        Round 1 Concluded by Organizers
                      </h3>
                      <p className="text-sm text-slate-300">
                        Thank you for competing! Organizers are verifying final standings and score adjustments.
                      </p>
                    </div>
                    <button
                      onClick={() => setParticipantView('leaderboard')}
                      className="px-6 py-3.5 rounded-xl font-bold font-mono text-xs uppercase bg-[#219EBC] hover:bg-[#8ECAE6] text-[#011826] transition-all cursor-pointer shadow-lg"
                    >
                      View Live Standings
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-white/5 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full gap-2">
        <div>
          Technospark 2026 • Dept of Information Technology, PCCOER Ravet
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>Single Session Real-time Engine</span>
        </div>
      </footer>
    </div>
  );
};
