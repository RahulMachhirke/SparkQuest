import React, { useState } from 'react';
import { Team } from '../types';
import { 
  UserPlus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Search, 
  Building2, 
  KeyRound, 
  Save, 
  X, 
  Users, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../lib/sound';

interface TeamManagerProps {
  teams: Team[];
  onAddTeam: (teamData: Omit<Team, 'round1Score' | 'manualAdjustment' | 'totalScore' | 'timeTakenSec' | 'completedAt'>) => void;
  onEditTeam: (id: string, updated: Partial<Team>) => void;
  onDeleteTeam: (id: string) => void;
  onResetToDefault: () => void;
}

const AVAILABLE_AVATARS = ['⚡', '🐺', '👑', '⚔️', '🦖', '🚀', '🔥', '🛡️', '💎', '🧠', '🎯', '💻', '👾', '🕹️', '🌟', '🦄'];

export const TeamManager: React.FC<TeamManagerProps> = ({
  teams,
  onAddTeam,
  onEditTeam,
  onDeleteTeam,
  onResetToDefault
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [college, setCollege] = useState('PCCOER Ravet');
  const [members, setMembers] = useState('');
  const [avatar, setAvatar] = useState('⚡');
  const [error, setError] = useState('');

  const openAddForm = () => {
    setEditingId(null);
    const nextNum = teams.length + 1;
    const formattedId = `team-${String(nextNum).padStart(2, '0')}`;
    setTeamId(formattedId);
    setTeamName('');
    setPasscode(`team${String(nextNum).padStart(2, '0')}`);
    setCollege('PCCOER Ravet');
    setMembers('');
    setAvatar(AVAILABLE_AVATARS[nextNum % AVAILABLE_AVATARS.length]);
    setError('');
    setIsFormOpen(true);
  };

  const openEditForm = (team: Team) => {
    setEditingId(team.id);
    setTeamId(team.id);
    setTeamName(team.name);
    setPasscode(team.passcode);
    setCollege(team.college);
    setMembers(team.members);
    setAvatar(team.avatar || '⚡');
    setError('');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId.trim()) {
      setError('Please provide a Team ID (e.g. team-08).');
      return;
    }
    if (!teamName.trim()) {
      setError('Please provide a Team Name.');
      return;
    }
    if (!passcode.trim()) {
      setError('Please assign a Passcode for this team.');
      return;
    }

    // Check duplicate ID if adding new
    if (!editingId && teams.some((t) => t.id.toLowerCase() === teamId.trim().toLowerCase())) {
      setError(`A team with ID "${teamId.trim()}" already exists. Please choose a unique ID.`);
      return;
    }

    const payload = {
      id: teamId.trim(),
      name: teamName.trim(),
      passcode: passcode.trim(),
      college: college.trim() || 'PCCOER Ravet',
      members: members.trim() || 'Lead & Members',
      avatar: avatar || '⚡'
    };

    if (editingId) {
      onEditTeam(editingId, payload);
    } else {
      onAddTeam(payload);
    }

    soundEngine.correct();
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" (${id}) from the competition?`)) {
      onDeleteTeam(id);
      soundEngine.wrong();
    }
  };

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.members.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8ECAE6]" />
            <span>Participant Teams Roster</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#219EBC]/20 text-[#8ECAE6] border border-[#219EBC]/40">
              {teams.length} Teams
            </span>
          </h3>
          <p className="text-xs text-slate-300">
            Add new teams, edit credentials, or remove teams. Any changes update live on the participant sign-in page instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddForm}
            className="px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-[#011826] hover:scale-105 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Participant Team</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset team roster back to default competition seed teams?')) {
                onResetToDefault();
              }
            }}
            className="px-3.5 py-2.5 rounded-xl font-mono text-xs text-slate-300 hover:text-white bg-[#011826] border border-white/10 flex items-center gap-1.5 cursor-pointer"
            title="Reset to default seed teams"
          >
            <RotateCcw className="w-4 h-4 text-[#8ECAE6]" />
            <span>Default Seeds</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Team Modal Form */}
      {isFormOpen && (
        <div className="bg-[#023047] border-2 border-[#219EBC] rounded-2xl p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFB703]" />
              {editingId ? 'Edit Team Details' : 'Register New Participant Team'}
            </h4>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Avatar Selector */}
            <div>
              <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1.5">
                Team Mascot / Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all cursor-pointer ${
                      avatar === emoji
                        ? 'bg-[#219EBC] border-[#8ECAE6] scale-110 shadow-lg'
                        : 'bg-[#011826] border-white/10 hover:border-white/40'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team ID */}
              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1">
                  Team ID (e.g. team-08)
                </label>
                <input
                  type="text"
                  value={teamId}
                  disabled={!!editingId}
                  onChange={(e) => setTeamId(e.target.value)}
                  placeholder="team-08"
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#FFB703] disabled:opacity-60"
                />
              </div>

              {/* Passcode */}
              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1">
                  Security Passcode / PIN
                </label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="team08"
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#FFB703]"
                />
              </div>

              {/* Team Name */}
              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Code Crusaders"
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFB703]"
                />
              </div>

              {/* College */}
              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1">
                  College / Institute
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="PCCOER Ravet"
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFB703]"
                />
              </div>

              {/* Members */}
              <div className="sm:col-span-2">
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1">
                  Team Members (comma-separated student names)
                </label>
                <input
                  type="text"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  placeholder="e.g. Rahul Patil, Priya Shah, Rohan Kadam"
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFB703]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl font-mono text-slate-300 hover:text-white bg-[#011826] border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-[#011826] hover:scale-105 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Team</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Filter */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter teams by name, college, ID, or student members..."
          className="w-full bg-[#023047]/80 border border-[#219EBC]/30 rounded-xl px-4 py-3 pl-10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FFB703]"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Teams Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-[#023047]/90 border border-[#219EBC]/30 hover:border-[#219EBC]/60 rounded-2xl p-5 shadow-xl transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#011826] border border-[#219EBC]/40 flex items-center justify-center text-2xl shadow-inner">
                    {team.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">
                      {team.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-[#8ECAE6]">
                      {team.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(team)}
                    className="p-1.5 rounded-lg text-[#8ECAE6] hover:bg-[#219EBC]/20 transition-all cursor-pointer"
                    title="Edit team"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id, team.name)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                    title="Delete team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-[#219EBC]" />
                  <span>{team.college}</span>
                </div>
                <div className="text-slate-400 truncate">
                  <strong className="text-slate-300">Members:</strong> {team.members}
                </div>
              </div>
            </div>

            {/* Passcode & Score Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1 text-[#FFB703]">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Pass: <code className="bg-[#011826] px-1.5 py-0.5 rounded text-white">{team.passcode}</code></span>
              </div>
              <div className="text-slate-400">
                Score: <span className="font-bold text-white">{team.totalScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
