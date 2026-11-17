import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Terminal, 
  Users, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  LogIn, 
  LogOut, 
  Code2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/soundEffects';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openLoginModal }) => {
  const { currentTeam, role, isAdmin, logout } = useAuth();
  const [soundOn, setSoundOn] = useState(true);
  const [userDropdown, setUserDropdown] = useState(false);

  const toggleSound = () => {
    sound.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'round1', label: 'R1: Rapid Fire', icon: Flame, badge: 'Kahoot' },
    { id: 'round2', label: 'R2: Bug Hunt', icon: Terminal, badge: 'IDE' },
    { id: 'round5', label: 'R5: Relay Coding', icon: Code2, badge: 'Relay' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, pulse: true },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Hub', icon: ShieldCheck, badge: 'Admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#023047]/95 backdrop-blur-md border-b border-[#219EBC]/30 shadow-lg shadow-[#011826]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Department Brand */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB703] to-[#FB8500] flex items-center justify-center font-black text-xl text-[#023047] shadow-md group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">SPARK QUEST</span>
                <span className="text-[#8ECAE6] font-mono text-sm font-semibold">| BYTE LOGIC</span>
              </div>
              <p className="text-[10px] text-[#8ECAE6]/80 tracking-tight hidden sm:block">
                Technospark Club • Dept of IT, PCCOER
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#219EBC] text-white shadow-md shadow-[#219EBC]/30'
                      : 'text-slate-300 hover:text-white hover:bg-[#032537]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8ECAE6]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-[#023047] text-[#FFB703]' : 'bg-[#023047]/80 text-[#8ECAE6] border border-[#219EBC]/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.pulse && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB703] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFB703]"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'Sound FX On' : 'Sound FX Muted'}
              className="p-2 rounded-lg bg-[#032537] text-[#8ECAE6] hover:text-[#FFB703] border border-[#219EBC]/20 hover:border-[#219EBC]/50 transition"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Current User / Team Pill */}
            {role === 'team' && currentTeam ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#032537] border border-[#FFB703]/40 text-left hover:border-[#FFB703] transition"
                >
                  <span className="text-base">{currentTeam.avatar}</span>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-white leading-none">{currentTeam.name}</p>
                    <p className="text-[10px] text-[#FFB703] font-mono leading-tight mt-0.5 font-bold">
                      {currentTeam.totalScore} pts
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-[#023047] border border-[#219EBC]/40 shadow-2xl p-2 z-50 text-sm"
                    onMouseLeave={() => setUserDropdown(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#219EBC]/20">
                      <p className="text-xs text-[#8ECAE6]">Logged in as Team</p>
                      <p className="font-bold text-white">{currentTeam.name}</p>
                      <p className="text-[11px] text-slate-400">{currentTeam.college}</p>
                    </div>
                    <div className="p-1 space-y-1">
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          openLoginModal();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs rounded-md text-slate-200 hover:bg-[#032537] flex items-center gap-2"
                      >
                        <Users className="w-3.5 h-3.5 text-[#8ECAE6]" />
                        Switch Team / View Credentials
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs rounded-md text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : role === 'admin' ? (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FB8500]/20 text-[#FB8500] border border-[#FB8500]/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#032537]"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#219EBC] to-[#023047] hover:from-[#8ECAE6] hover:to-[#219EBC] text-white hover:text-[#023047] font-semibold text-xs border border-[#8ECAE6]/40 transition shadow"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Team / Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-2 border-t border-[#219EBC]/20 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
                  isActive
                    ? 'bg-[#219EBC] text-white'
                    : 'bg-[#032537] text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
