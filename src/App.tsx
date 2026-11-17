import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompetitionProvider, useCompetition } from './context/CompetitionContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginModal } from './components/common/LoginModal';
import { Overview } from './components/home/Overview';
import { KahootQuiz } from './components/round1-quiz/KahootQuiz';
import { CodePlayground } from './components/round2-bughunt/CodePlayground';
import { RelayCoding } from './components/round5-relay/RelayCoding';
import { LiveLeaderboard } from './components/leaderboard/LiveLeaderboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { AlertCircle, Lock } from 'lucide-react';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { roundStatus } = useCompetition();
  const { currentTeam, role, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#011826] text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openLoginModal={() => setIsLoginOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Render Tab Contents */}
        {activeTab === 'overview' && (
          <Overview
            setActiveTab={setActiveTab}
            openLoginModal={() => setIsLoginOpen(true)}
          />
        )}

        {activeTab === 'round1' && (
          <div>
            {!roundStatus.round1Active && !isAdmin ? (
              <div className="p-8 text-center rounded-2xl bg-[#032537] border border-red-500/30 max-w-md mx-auto space-y-3">
                <Lock className="w-8 h-8 text-red-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Round 1 is Currently Locked</h3>
                <p className="text-xs text-slate-300">
                  The organizers have not opened Round 1 yet. Check the Live Leaderboard or await briefing.
                </p>
              </div>
            ) : (
              <KahootQuiz onFinish={() => setActiveTab('leaderboard')} />
            )}
          </div>
        )}

        {activeTab === 'round2' && (
          <div>
            {!roundStatus.round2Active && !isAdmin ? (
              <div className="p-8 text-center rounded-2xl bg-[#032537] border border-red-500/30 max-w-md mx-auto space-y-3">
                <Lock className="w-8 h-8 text-red-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Round 2 is Currently Locked</h3>
                <p className="text-xs text-slate-300">
                  Round 2: Bug Hunt will unlock once Round 1 evaluation concludes.
                </p>
              </div>
            ) : (
              <CodePlayground onLeaderboardClick={() => setActiveTab('leaderboard')} />
            )}
          </div>
        )}

        {activeTab === 'round5' && (
          <div>
            {!roundStatus.round5Active && !isAdmin ? (
              <div className="p-8 text-center rounded-2xl bg-[#032537] border border-red-500/30 max-w-md mx-auto space-y-3">
                <Lock className="w-8 h-8 text-red-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Round 5 is Currently Locked</h3>
                <p className="text-xs text-slate-300">
                  Round 5: Relay Coding will be unlocked for qualified finalists.
                </p>
              </div>
            ) : (
              <RelayCoding />
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <LiveLeaderboard />
        )}

        {activeTab === 'admin' && (
          <AdminPanel />
        )}
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CompetitionProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </CompetitionProvider>
  );
}
