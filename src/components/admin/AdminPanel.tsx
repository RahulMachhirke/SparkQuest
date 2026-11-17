import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle, 
  Users, 
  Code2, 
  Layers,
  Database
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/soundEffects';

export const AdminPanel: React.FC = () => {
  const { 
    roundStatus, 
    toggleRound, 
    teams, 
    addTeam, 
    deleteTeam, 
    resetAllData, 
    exportDataJSON, 
    importDataJSON 
  } = useCompetition();

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCollege, setNewTeamCollege] = useState('PCCOER Ravet');
  const [newTeamPasscode, setNewTeamPasscode] = useState('');
  const [membersInput, setMembersInput] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [adminStatusMsg, setAdminStatusMsg] = useState('');

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newId = `team-${Date.now().toString().slice(-4)}`;
    const parsedMembers = membersInput
      .split(',')
      .map((name, idx) => ({ id: `m-${idx}`, name: name.trim() }))
      .filter((m) => m.name.length > 0);

    addTeam({
      id: newId,
      name: newTeamName.trim(),
      college: newTeamCollege.trim(),
      passcode: newTeamPasscode.trim() || 'spark2026',
      avatar: '🚀',
      members: parsedMembers.length > 0 ? parsedMembers : [{ id: 'm1', name: 'Member 1' }],
      round1Score: 0,
      round2Score: 0,
      round3Score: 0,
      round4Score: 0,
      round5Score: 0,
      bonusPoints: 0,
    });

    setNewTeamName('');
    setMembersInput('');
    setNewTeamPasscode('');
    setAdminStatusMsg(`Team ${newTeamName} created successfully!`);
    sound.playCorrect();
    setTimeout(() => setAdminStatusMsg(''), 4000);
  };

  const handleImport = () => {
    const ok = importDataJSON(importJsonText);
    if (ok) {
      setAdminStatusMsg('Data imported successfully!');
      setImportJsonText('');
      sound.playFanfare();
    } else {
      setAdminStatusMsg('Failed to import: Invalid JSON format.');
    }
    setTimeout(() => setAdminStatusMsg(''), 4000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spark_quest_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#032537] via-[#023047] to-[#011826] border-2 border-[#FB8500]/40 shadow-2xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FB8500]/20 border border-[#FB8500]/50 flex items-center justify-center text-[#FB8500]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Competition Control Center</h2>
            <p className="text-xs text-[#8ECAE6]">
              Organizers & Faculty Admin Hub for Technospark Club PCCOER
            </p>
          </div>
        </div>

        {adminStatusMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{adminStatusMsg}</span>
          </div>
        )}
      </div>

      {/* Grid: Round Gates & Team Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Round Gate Controller (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-[#032537] border border-[#219EBC]/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB703]">
              <Layers className="w-4 h-4" />
              <span>Round Gate Controls</span>
            </div>
            <p className="text-xs text-slate-300">
              Lock or unlock access to competition rounds for participants during the event.
            </p>

            <div className="space-y-3">
              {/* Round 1 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#011826] border border-[#219EBC]/20 text-xs">
                <div>
                  <p className="font-bold text-white">Round 1: Rapid Fire (Quiz)</p>
                  <p className="text-[11px] text-[#8ECAE6]">Kahoot Online Engine</p>
                </div>
                <button
                  onClick={() => toggleRound('round1Active')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                    roundStatus.round1Active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                  }`}
                >
                  {roundStatus.round1Active ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{roundStatus.round1Active ? 'Active' : 'Locked'}</span>
                </button>
              </div>

              {/* Round 2 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#011826] border border-[#219EBC]/20 text-xs">
                <div>
                  <p className="font-bold text-white">Round 2: Bug Hunt (IDE)</p>
                  <p className="text-[11px] text-[#219EBC]">LeetCode / HackerRank</p>
                </div>
                <button
                  onClick={() => toggleRound('round2Active')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                    roundStatus.round2Active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                  }`}
                >
                  {roundStatus.round2Active ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{roundStatus.round2Active ? 'Active' : 'Locked'}</span>
                </button>
              </div>

              {/* Round 5 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#011826] border border-[#219EBC]/20 text-xs">
                <div>
                  <p className="font-bold text-white">Round 5: Relay Coding</p>
                  <p className="text-[11px] text-[#FB8500]">40m Relay Arena</p>
                </div>
                <button
                  onClick={() => toggleRound('round5Active')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                    roundStatus.round5Active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                  }`}
                >
                  {roundStatus.round5Active ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{roundStatus.round5Active ? 'Active' : 'Locked'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Backup / Export / Reset Card */}
          <div className="p-5 rounded-2xl bg-[#032537] border border-[#219EBC]/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8ECAE6]">
              <Database className="w-4 h-4" />
              <span>Data & Backup Operations</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownloadBackup}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#023047] hover:bg-[#043b57] text-[#8ECAE6] border border-[#219EBC]/30 text-xs font-bold transition"
              >
                <Download className="w-4 h-4" />
                <span>Export Competition Backup (.JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all scores and teams to initial defaults?')) {
                    resetAllData();
                    sound.playFanfare();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-xs font-bold transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All to Default State</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Add Team & Manage Existing Teams (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Add New Team Form */}
          <div className="p-5 rounded-2xl bg-[#032537] border border-[#219EBC]/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8ECAE6]">
              <Users className="w-4 h-4 text-[#FFB703]" />
              <span>Register New Participating Team</span>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Team Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Code Ninjas"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full bg-[#011826] border border-[#219EBC]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB703]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">College Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. PCCOER Ravet"
                    value={newTeamCollege}
                    onChange={(e) => setNewTeamCollege(e.target.value)}
                    className="w-full bg-[#011826] border border-[#219EBC]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB703]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Passcode (For Login)</label>
                  <input
                    type="text"
                    placeholder="e.g. team99"
                    value={newTeamPasscode}
                    onChange={(e) => setNewTeamPasscode(e.target.value)}
                    className="w-full bg-[#011826] border border-[#219EBC]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB703]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Team Members (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Patil, Priya S, Aman K"
                    value={membersInput}
                    onChange={(e) => setMembersInput(e.target.value)}
                    className="w-full bg-[#011826] border border-[#219EBC]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB703]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#219EBC] hover:bg-[#8ECAE6] text-[#023047] font-black uppercase tracking-wider transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Register Team</span>
              </button>
            </form>
          </div>

          {/* Existing Teams Table */}
          <div className="p-5 rounded-2xl bg-[#032537] border border-[#219EBC]/30 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Enrolled Teams Directory ({teams.length} Teams)
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-[#011826] border border-[#219EBC]/20 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{t.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{t.id}]</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{t.college} • Passcode: <span className="font-mono text-[#FFB703]">{t.passcode}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#FFB703]">{t.totalScore} pts</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete team "${t.name}"?`)) {
                          deleteTeam(t.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded transition"
                      title="Delete Team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
