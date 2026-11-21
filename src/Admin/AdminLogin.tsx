import React, { useState } from 'react';
import { Shield, KeyRound, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../lib/sound';

interface AdminLoginProps {
  onSuccess: () => void;
  onExitToSite: () => void;
}

const ADMIN_SECRET_PIN = 'sparkadmin2026';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onExitToSite }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_SECRET_PIN) {
      soundEngine.correct();
      sessionStorage.setItem('sparkquest_admin_auth', 'true');
      onSuccess();
    } else {
      soundEngine.wrong();
      setError('Invalid Organizer Security Key. Access denied.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#023047]/95 border-2 border-[#FB8500]/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FB8500]/15 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onExitToSite}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8ECAE6] hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Participant Portal</span>
        </button>

        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#011826] border border-[#FB8500]/40 flex items-center justify-center text-[#FB8500] shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">Organizer Admin Gate</h2>
          <p className="text-xs text-slate-300">
            Dedicated administrative console for competition coordinators, question setters, and jury members.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center gap-2.5 text-red-200 text-xs font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-2">
              Master Admin Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter security key..."
                className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-4 py-3.5 text-white font-mono text-sm focus:outline-none focus:border-[#FB8500] focus:ring-1 focus:ring-[#FB8500]"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1.5">
              Default Organizer Key: <code className="text-[#FFB703]">sparkadmin2026</code>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider text-[#011826] bg-gradient-to-r from-[#FFB703] to-[#FB8500] hover:scale-[1.01] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Authenticate & Unlock Admin Panel</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-[10px] font-mono text-slate-400">
          SPARK QUEST 2026 • PCCOER Ravet • Dept of IT
        </div>
      </div>
    </div>
  );
};
