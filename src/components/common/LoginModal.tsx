import React, { useState } from 'react';
import { LogIn, Shield, Users, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCompetition } from '../../context/CompetitionContext';
import { sound } from '../../utils/soundEffects';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsTeam, loginAsAdmin, quickSwitchTeam } = useAuth();
  const { teams } = useCompetition();

  const [mode, setMode] = useState<'team' | 'admin' | 'quick'>('team');
  const [teamId, setTeamId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAsTeam(teamId, passcode);
    if (res.success) {
      sound.playCorrect();
      setStatusMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1000);
    } else {
      sound.playIncorrect();
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAsAdmin(adminKey);
    if (res.success) {
      sound.playFanfare();
      setStatusMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1000);
    } else {
      sound.playIncorrect();
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#023047] border-2 border-[#219EBC] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#219EBC]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFB703] to-[#FB8500] flex items-center justify-center font-black text-[#023047]">
              ⚡
            </div>
            <div>
              <h3 className="text-base font-black text-white">Spark Quest Authentication</h3>
              <p className="text-[10px] text-[#8ECAE6]">Department of IT • PCCOER Ravet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#011826] rounded-xl border border-[#219EBC]/30 text-xs">
          <button
            onClick={() => { setMode('team'); setStatusMsg(null); }}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'team' ? 'bg-[#219EBC] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team</span>
          </button>
          <button
            onClick={() => { setMode('admin'); setStatusMsg(null); }}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'admin' ? 'bg-[#FB8500] text-[#023047] shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          <button
            onClick={() => { setMode('quick'); setStatusMsg(null); }}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'quick' ? 'bg-[#FFB703] text-[#023047] shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Dev</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-500 text-emerald-300'
              : 'bg-red-950/70 border border-red-500 text-red-300'
          }`}>
            {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Mode: Team Login */}
        {mode === 'team' && (
          <form onSubmit={handleTeamSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Team ID (e.g. team-01)</label>
              <input
                type="text"
                placeholder="team-01"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                required
                className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#FFB703]"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Passcode</label>
              <input
                type="password"
                placeholder="••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#FFB703]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Default demo passcode is `team01`, `team02`, etc.</p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#219EBC] to-[#8ECAE6] text-[#023047] font-black uppercase tracking-wider text-xs shadow-lg hover:scale-[1.02] transition"
            >
              Sign In as Team
            </button>
          </form>
        )}

        {/* Mode: Admin Login */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Organizer Security Key</label>
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
                className="w-full bg-[#011826] border border-[#FB8500]/40 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#FB8500]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Hint: Passcode is <code className="text-[#FFB703] font-bold">sparkadmin2026</code> (or <code className="text-[#FFB703] font-bold">admin</code>)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FB8500] to-[#FFB703] text-[#023047] font-black uppercase tracking-wider text-xs shadow-lg hover:scale-[1.02] transition"
            >
              Verify Organizer Access
            </button>
          </form>
        )}

        {/* Mode: Quick Dev Switcher */}
        {mode === 'quick' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-300">
              Select any enrolled team to immediately log in as them:
            </p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {teams.slice(0, 10).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    quickSwitchTeam(t);
                    sound.playCorrect();
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#011826] hover:bg-[#032537] border border-[#219EBC]/20 hover:border-[#FFB703] flex items-center justify-between text-xs text-left transition"
                >
                  <div className="flex items-center gap-2">
                    <span>{t.avatar}</span>
                    <span className="font-bold text-white">{t.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8ECAE6]">{t.id}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
