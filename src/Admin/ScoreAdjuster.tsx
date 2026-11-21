import React, { useState } from 'react';
import { Team } from '../types';
import { Plus, Minus, RotateCcw, UserPlus, Award, ShieldAlert, Check } from 'lucide-react';
import { soundEngine } from '../lib/sound';

interface ScoreAdjusterProps {
  teams: Team[];
  onAdjustScore: (teamId: string, delta: number) => void;
  onResetTeamScore: (teamId: string) => void;
  onUpdateTeams: (newTeams: Team[]) => void;
}

export const ScoreAdjuster: React.FC<ScoreAdjusterProps> = ({
  teams,
  onAdjustScore,
  onResetTeamScore,
  onUpdateTeams
}) => {
  const [customDelta, setCustomDelta] = useState<number>(50);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // New team form states
  const [newId, setNewId] = useState(`team-0${teams.length + 1}`);
  const [newName, setNewName] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [newCollege, setNewCollege] = useState('PCCOER Ravet');
  const [newMembers, setNewMembers] = useState('');
  const [newAvatar, setNewAvatar] = useState('🚀');

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim() || !newPasscode.trim()) {
      alert('Please fill Team ID, Team Name, and Passcode.');
      return;
    }

    const newTeam: Team = {
      id: newId.trim(),
      name: newName.trim(),
      passcode: newPasscode.trim(),
      college: newCollege.trim(),
      members: newMembers.trim() || 'Lead & Members',
      avatar: newAvatar.trim() || '🔥',
      round1Score: 0,
      manualAdjustment: 0,
      totalScore: 0,
      timeTakenSec: 0,
      completedAt: null
    };

    onUpdateTeams([...teams, newTeam]);
    soundEngine.correct();
    setShowAddTeamModal(false);
    setNewName('');
    setNewPasscode('');
    setNewMembers('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FFB703]" />
            <span>Score & Ranking Adjuster</span>
          </h3>
          <p className="text-xs text-slate-300">
            Jury and coordinator panel to award presentation points, penalties, or handle disputes.
          </p>
        </div>

        <button
          onClick={() => setShowAddTeamModal(true)}
          className="px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-[#219EBC] hover:bg-[#8ECAE6] text-[#011826] transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Team</span>
        </button>
      </div>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div className="bg-[#023047] border-2 border-[#219EBC] rounded-2xl p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="font-bold text-white text-sm">Add Team to Official Roster</h4>
            <button
              onClick={() => setShowAddTeamModal(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateTeam} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-mono text-[#8ECAE6] mb-1">Team ID</label>
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                className="w-full bg-[#011826] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8ECAE6] mb-1">Team Passcode</label>
              <input
                type="text"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="e.g. team06"
                className="w-full bg-[#011826] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8ECAE6] mb-1">Team Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Cyber Ninjas"
                className="w-full bg-[#011826] border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8ECAE6] mb-1">College</label>
              <input
                type="text"
                value={newCollege}
                onChange={(e) => setNewCollege(e.target.value)}
                className="w-full bg-[#011826] border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-mono text-[#8ECAE6] mb-1">Members (comma separated)</label>
              <input
                type="text"
                value={newMembers}
                onChange={(e) => setNewMembers(e.target.value)}
                placeholder="e.g. Rahul Patil, Priya Shah"
                className="w-full bg-[#011826] border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold font-mono text-xs uppercase bg-[#FFB703] text-[#011826] hover:bg-[#FB8500] cursor-pointer"
              >
                Save & Add Team
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teams Adjustment Table */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#011826] border-b border-[#219EBC]/30 text-[#8ECAE6] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4 text-center">Round 1</th>
                <th className="py-3 px-4 text-center">Jury Adjust.</th>
                <th className="py-3 px-4 text-right">Total Score</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
                <th className="py-3 px-4 text-center">Reset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{team.avatar}</span>
                      <div>
                        <div className="font-bold text-white text-xs sm:text-sm">{team.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {team.id} • {team.college} • Pass: {team.passcode}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-[#8ECAE6] font-bold">
                    {team.round1Score.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    {team.manualAdjustment > 0 ? (
                      <span className="text-emerald-400">+{team.manualAdjustment}</span>
                    ) : team.manualAdjustment < 0 ? (
                      <span className="text-red-400">{team.manualAdjustment}</span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-black text-base text-[#FFB703]">
                    {team.totalScore.toLocaleString()}
                  </td>

                  {/* Quick Adjust Buttons */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          onAdjustScore(team.id, 50);
                          soundEngine.correct();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                        title="Add +50 bonus"
                      >
                        <Plus className="w-3 h-3" /> 50
                      </button>

                      <button
                        onClick={() => {
                          onAdjustScore(team.id, -50);
                          soundEngine.wrong();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-800/80 border border-red-500/50 text-red-300 font-mono font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                        title="Apply -50 penalty"
                      >
                        <Minus className="w-3 h-3" /> 50
                      </button>
                    </div>
                  </td>

                  {/* Reset single score */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm(`Reset score for ${team.name} back to 0?`)) {
                          onResetTeamScore(team.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                      title="Reset this team's score"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
