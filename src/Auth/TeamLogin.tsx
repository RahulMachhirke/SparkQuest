import React, { useState } from 'react';
import { Team } from '../types';
import { soundEngine } from '../lib/sound';
import { LogIn, Users, ShieldCheck, Sparkles, Building2, AlertCircle, Hash } from 'lucide-react';

interface TeamLoginProps {
  teams: Team[];
  onLogin: (teamId: string) => void;
}

export const TeamLogin: React.FC<TeamLoginProps> = ({ teams, onLogin }) => {
  const [teamInput, setTeamInput] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Helper to normalize strings for forgiving matching (e.g. "team07" -> "team07", "team-07" -> "team07")
  const normalize = (str: string) => str.trim().toLowerCase().replace(/[-_\s]/g, '');

  const handleSelectTeam = (id: string) => {
    setSelectedTeamId(id);
    const found = teams.find((t) => t.id === id);
    if (found) {
      setTeamInput(found.id);
      setPasscode(found.passcode);
    }
    setError('');
  };

  const handleTeamInputChange = (val: string) => {
    setTeamInput(val);
    setError('');
    const norm = normalize(val);
    if (!norm) {
      setSelectedTeamId('');
      return;
    }

    // Try to auto-resolve team from input
    const matched = teams.find(
      (t) =>
        normalize(t.id) === norm ||
        normalize(t.name) === norm ||
        t.id.toLowerCase() === val.trim().toLowerCase()
    );
    if (matched) {
      setSelectedTeamId(matched.id);
      if (!passcode) {
        setPasscode(matched.passcode);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let targetTeam: Team | undefined;

    // 1. Try selected ID first
    if (selectedTeamId) {
      targetTeam = teams.find((t) => t.id === selectedTeamId);
    }

    // 2. If not selected, try matching what user typed in teamInput
    if (!targetTeam && teamInput.trim()) {
      const normInput = normalize(teamInput);
      targetTeam = teams.find(
        (t) =>
          normalize(t.id) === normInput ||
          normalize(t.name) === normInput ||
          normalize(t.id).includes(normInput)
      );
    }

    // 3. If still not found but passcode is provided, try resolving team by passcode!
    if (!targetTeam && passcode.trim()) {
      const normPass = normalize(passcode);
      targetTeam = teams.find((t) => normalize(t.passcode) === normPass);
    }

    if (!targetTeam) {
      setError(
        `Team "${teamInput || passcode}" not found in registered competition roster. Please pick from the list below or check with coordinators.`
      );
      soundEngine.wrong();
      return;
    }

    // Validate passcode
    const enteredPass = normalize(passcode);
    const expectedPass = normalize(targetTeam.passcode);

    if (enteredPass !== expectedPass) {
      setError(
        `Invalid passcode for ${targetTeam.name} (${targetTeam.id}). Please check with your team members.`
      );
      soundEngine.wrong();
      return;
    }

    // Success!
    soundEngine.correct();
    onLogin(targetTeam.id);
  };

  const activeTeamObj = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      {/* Contest Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase mb-3 bg-[#023047] text-[#8ECAE6] border border-[#219EBC]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
          Technospark 2026 • PCCOER Ravet
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          SPARK QUEST <span className="text-[#8ECAE6]">|</span> <span className="text-[#FB8500]">BYTE LOGIC</span>
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
          Department of Information Technology. Sign in with your registered Team ID and passcode to enter the waiting arena.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#023047]/90 backdrop-blur-md rounded-2xl border border-[#219EBC]/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#219EBC] via-[#FFB703] to-[#FB8500]"></div>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#219EBC]/20 border border-[#219EBC]/50 flex items-center justify-center text-[#8ECAE6]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Participant Team Sign-In</h2>
            <p className="text-xs text-slate-400">Restricted to registered teams</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-red-200 text-sm animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Direct Team ID or Name Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-2">
              Team ID or Team Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={teamInput}
                onChange={(e) => handleTeamInputChange(e.target.value)}
                placeholder="Type e.g. team07, team-07, or Logic Loopers"
                className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-4 py-3 font-mono text-white text-sm focus:outline-none focus:border-[#FFB703] focus:ring-1 focus:ring-[#FFB703] transition-all"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Hash className="w-4 h-4 text-[#8ECAE6]" />
              </div>
            </div>
          </div>

          {/* Or Pick from Registered Roster Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Or Select From List:
              </label>
              <span className="text-[10px] font-mono text-[#8ECAE6]">
                {teams.length} teams registered
              </span>
            </div>
            <select
              value={selectedTeamId}
              onChange={(e) => handleSelectTeam(e.target.value)}
              className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#FFB703] transition-all cursor-pointer"
            >
              <option value="">-- Choose team from roster --</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.avatar} {t.name} ({t.id} • {t.college})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Select Badges */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 mb-2">Quick Pick Roster:</div>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1 scrollbar-thin">
              {teams.map((t) => {
                const isSelected = selectedTeamId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTeam(t.id)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-medium ${
                      isSelected
                        ? 'bg-[#219EBC] text-[#011826] border-[#8ECAE6] font-bold shadow-md'
                        : 'bg-[#011826]/70 text-slate-300 border-[#219EBC]/20 hover:border-[#219EBC]/60 hover:text-white'
                    }`}
                  >
                    <span>{t.avatar}</span>
                    <span>{t.name}</span>
                    <span className="text-[10px] font-mono opacity-70">({t.id})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Preview if matched/selected */}
          {activeTeamObj && (
            <div className="p-3.5 rounded-xl bg-[#011826]/80 border border-[#219EBC]/40 text-xs text-slate-300 space-y-1 animate-fadeIn">
              <div className="flex items-center justify-between text-white font-medium">
                <span className="flex items-center gap-1.5 text-[#8ECAE6]">
                  <Building2 className="w-3.5 h-3.5" />
                  {activeTeamObj.college}
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  Team ID: {activeTeamObj.id}
                </span>
              </div>
              <div className="text-slate-400">
                <strong className="text-slate-300">Members:</strong> {activeTeamObj.members}
              </div>
            </div>
          )}

          {/* Passcode Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-2">
              Team Passcode / Security PIN
            </label>
            <div className="relative">
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. team07)"
                className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-4 py-3 font-mono text-white text-sm focus:outline-none focus:border-[#FFB703] focus:ring-1 focus:ring-[#FFB703] transition-all"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-[#011826] bg-gradient-to-r from-[#FFB703] to-[#FB8500] hover:from-[#FB8500] hover:to-[#FFB703] transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            <span>Enter Competition Arena</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>🔒 Round 1: Byte Logic Quiz Arena</span>
          <span className="text-[#8ECAE6]">Strict Single-Session Rules</span>
        </div>
      </div>
    </div>
  );
};
