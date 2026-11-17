import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  Edit3, 
  PlusCircle, 
  Download, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Activity,
  Award
} from 'lucide-react';
import { Team } from '../../types';
import { useCompetition } from '../../context/CompetitionContext';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/soundEffects';

interface LiveLeaderboardProps {
  onSelectTeam?: (team: Team) => void;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ onSelectTeam }) => {
  const { teams, updateScore, bulkAdjustScores, activityFeed, exportDataJSON } = useCompetition();
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCollege, setFilterCollege] = useState<'all' | 'pccoer' | 'external'>('all');
  
  // State for manual score adjustment modal
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editR1, setEditR1] = useState(0);
  const [editR2, setEditR2] = useState(0);
  const [editR3, setEditR3] = useState(0);
  const [editR4, setEditR4] = useState(0);
  const [editR5, setEditR5] = useState(0);
  const [editBonus, setEditBonus] = useState(0);

  // Open edit modal prefilled with team scores
  const openEditModal = (t: Team) => {
    setEditingTeam(t);
    setEditR1(t.round1Score);
    setEditR2(t.round2Score);
    setEditR3(t.round3Score);
    setEditR4(t.round4Score);
    setEditR5(t.round5Score);
    setEditBonus(t.bonusPoints);
  };

  const handleSaveManualScores = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    bulkAdjustScores(editingTeam.id, {
      round1Score: Number(editR1) || 0,
      round2Score: Number(editR2) || 0,
      round3Score: Number(editR3) || 0,
      round4Score: Number(editR4) || 0,
      round5Score: Number(editR5) || 0,
      bonusPoints: Number(editBonus) || 0,
    });

    sound.playCorrect();
    setEditingTeam(null);
  };

  // Sort and filter teams
  const sortedTeams = useMemo(() => {
    let result = [...teams].sort((a, b) => b.totalScore - a.totalScore);

    if (filterCollege === 'pccoer') {
      result = result.filter((t) => t.college.toLowerCase().includes('pccoer'));
    } else if (filterCollege === 'external') {
      result = result.filter((t) => !t.college.toLowerCase().includes('pccoer'));
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.college.toLowerCase().includes(q) ||
          t.members.some((m) => m.name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [teams, filterCollege, searchTerm]);

  const handleExportCSV = () => {
    const headers = ['Rank', 'Team ID', 'Team Name', 'College', 'Round 1 (Rapid Fire)', 'Round 2 (Bug Hunt)', 'Round 3 (Blind Coding)', 'Round 4 (Reverse Logic)', 'Round 5 (Relay Coding)', 'Bonus/Penalty', 'Total Score'];
    const rows = sortedTeams.map((t, idx) => [
      idx + 1,
      t.id,
      `"${t.name}"`,
      `"${t.college}"`,
      t.round1Score,
      t.round2Score,
      t.round3Score,
      t.round4Score,
      t.round5Score,
      t.bonusPoints,
      t.totalScore,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spark_quest_leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#032537] via-[#023047] to-[#011826] border border-[#219EBC]/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFB703] to-[#FB8500] flex items-center justify-center font-black text-2xl text-[#023047] shadow-xl">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Live Competition Standings</h2>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Real-time automatic sync from Round 1, 2, 5 + judge verified entries for Round 3 & 4.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#032537] hover:bg-[#043b57] text-[#8ECAE6] hover:text-white border border-[#219EBC]/30 text-xs font-bold transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Live Activity Ticker */}
      {activityFeed.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#023047]/60 border border-[#219EBC]/20 flex items-center gap-3 text-xs overflow-x-auto shadow-inner">
          <div className="flex items-center gap-1.5 text-[#FFB703] font-bold uppercase tracking-wider flex-shrink-0">
            <Activity className="w-4 h-4" />
            <span>Latest Updates:</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none whitespace-nowrap">
            {activityFeed.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-slate-300">
                <span className="text-[10px] text-slate-400 font-mono">[{item.timestamp}]</span>
                <strong className="text-white">{item.teamName}</strong>
                <span className="text-slate-400">{item.roundName}</span>
                <span className={`font-mono font-bold ${item.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.delta >= 0 ? `+${item.delta}` : item.delta}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#011826] text-slate-400 uppercase">
                  {item.source}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#032537] border border-[#219EBC]/30 shadow-md">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search team, participant, or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#011826] border border-[#219EBC]/30 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#FFB703]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterCollege('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterCollege === 'all'
                ? 'bg-[#219EBC] text-white'
                : 'bg-[#011826] text-slate-400 hover:text-white border border-[#219EBC]/20'
            }`}
          >
            All Teams ({teams.length})
          </button>
          <button
            onClick={() => setFilterCollege('pccoer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterCollege === 'pccoer'
                ? 'bg-[#219EBC] text-white'
                : 'bg-[#011826] text-slate-400 hover:text-white border border-[#219EBC]/20'
            }`}
          >
            PCCOER Teams
          </button>
          <button
            onClick={() => setFilterCollege('external')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterCollege === 'external'
                ? 'bg-[#219EBC] text-white'
                : 'bg-[#011826] text-slate-400 hover:text-white border border-[#219EBC]/20'
            }`}
          >
            Visiting Colleges
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl bg-[#032537] border border-[#219EBC]/30 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#023047] text-slate-300 font-semibold uppercase tracking-wider border-b border-[#219EBC]/30">
              <tr>
                <th className="py-4 px-4 text-center">Rank</th>
                <th className="py-4 px-4">Team & Members</th>
                <th className="py-4 px-3 text-right">
                  <span className="text-[#8ECAE6]">R1: Rapid</span>
                  <span className="block text-[9px] text-slate-400 font-normal">Quiz (Auto)</span>
                </th>
                <th className="py-4 px-3 text-right">
                  <span className="text-[#219EBC]">R2: Bug</span>
                  <span className="block text-[9px] text-slate-400 font-normal">IDE (Auto)</span>
                </th>
                <th className="py-4 px-3 text-right">
                  <span className="text-[#FFB703]">R3: Blind</span>
                  <span className="block text-[9px] text-slate-400 font-normal">Chit (Manual)</span>
                </th>
                <th className="py-4 px-3 text-right">
                  <span className="text-[#FB8500]">R4: Reverse</span>
                  <span className="block text-[9px] text-slate-400 font-normal">Logic (Manual)</span>
                </th>
                <th className="py-4 px-3 text-right">
                  <span className="text-[#219EBC]">R5: Relay</span>
                  <span className="block text-[9px] text-slate-400 font-normal">Arena (Auto)</span>
                </th>
                <th className="py-4 px-3 text-right">
                  <span className="text-slate-400">Bonus</span>
                  <span className="block text-[9px] text-slate-500 font-normal">Adjust</span>
                </th>
                <th className="py-4 px-4 text-right">
                  <span className="text-white font-extrabold text-sm">Total</span>
                  <span className="block text-[9px] text-[#FFB703] font-normal">Points</span>
                </th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#219EBC]/15">
              {sortedTeams.map((team, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;

                return (
                  <tr
                    key={team.id}
                    className={`transition-colors ${
                      isTop3
                        ? rank === 1
                          ? 'bg-gradient-to-r from-[#FFB703]/10 to-transparent'
                          : rank === 2
                          ? 'bg-gradient-to-r from-[#8ECAE6]/10 to-transparent'
                          : 'bg-gradient-to-r from-[#FB8500]/10 to-transparent'
                        : 'hover:bg-[#023047]/60'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center font-black text-sm">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFB703] text-[#023047] shadow-lg text-base">
                          🥇
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#8ECAE6] text-[#023047] shadow-md text-base">
                          🥈
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FB8500] text-[#023047] shadow-md text-base">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">#{rank}</span>
                      )}
                    </td>

                    {/* Team Name, Avatar, College & Members */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{team.avatar}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm">{team.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#011826] text-[#8ECAE6] border border-[#219EBC]/30">
                              {team.college}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {team.members.map((m) => m.name).join(' • ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Round 1 Score */}
                    <td className="py-4 px-3 text-right font-mono text-slate-200">
                      {team.round1Score.toLocaleString()}
                    </td>

                    {/* Round 2 Score */}
                    <td className="py-4 px-3 text-right font-mono text-slate-200">
                      {team.round2Score}
                    </td>

                    {/* Round 3 Score */}
                    <td className="py-4 px-3 text-right font-mono text-slate-200">
                      {team.round3Score}
                    </td>

                    {/* Round 4 Score */}
                    <td className="py-4 px-3 text-right font-mono text-slate-200">
                      {team.round4Score}
                    </td>

                    {/* Round 5 Score */}
                    <td className="py-4 px-3 text-right font-mono text-slate-200">
                      {team.round5Score}
                    </td>

                    {/* Bonus Score */}
                    <td className="py-4 px-3 text-right font-mono text-slate-400">
                      {team.bonusPoints > 0 ? `+${team.bonusPoints}` : team.bonusPoints}
                    </td>

                    {/* Total Score */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-mono font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-[#FFB703] to-[#FB8500]">
                        {team.totalScore.toLocaleString()}
                      </span>
                    </td>

                    {/* Manual Adjust Button */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => openEditModal(team)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#011826] hover:bg-[#219EBC] text-slate-300 hover:text-white border border-[#219EBC]/30 transition text-[11px] font-semibold"
                        title="Manual Insertion / Override Score"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Insertion & Score Override Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#023047] border-2 border-[#FFB703] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#219EBC]/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{editingTeam.avatar}</span>
                <div>
                  <h3 className="text-lg font-black text-white">Manual Score Entry / Adjustment</h3>
                  <p className="text-xs text-[#8ECAE6]">{editingTeam.name} ({editingTeam.college})</p>
                </div>
              </div>
              <button
                onClick={() => setEditingTeam(null)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualScores} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#8ECAE6] block mb-1">
                    Round 1: Rapid Fire (Quiz)
                  </label>
                  <input
                    type="number"
                    value={editR1}
                    onChange={(e) => setEditR1(Number(e.target.value))}
                    className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FFB703]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#219EBC] block mb-1">
                    Round 2: Bug Hunt (IDE)
                  </label>
                  <input
                    type="number"
                    value={editR2}
                    onChange={(e) => setEditR2(Number(e.target.value))}
                    className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FFB703]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#FFB703] block mb-1">
                    Round 3: Blind Coding (Chits)
                  </label>
                  <input
                    type="number"
                    value={editR3}
                    onChange={(e) => setEditR3(Number(e.target.value))}
                    className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FFB703]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#FB8500] block mb-1">
                    Round 4: Reverse Logic (Paper)
                  </label>
                  <input
                    type="number"
                    value={editR4}
                    onChange={(e) => setEditR4(Number(e.target.value))}
                    className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FFB703]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#219EBC] block mb-1">
                    Round 5: Relay Coding
                  </label>
                  <input
                    type="number"
                    value={editR5}
                    onChange={(e) => setEditR5(Number(e.target.value))}
                    className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FFB703]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Bonus / Penalties (+/-)
                  </label>
                  <input
                    type="number"
                    value={editBonus}
                    onChange={(e) => setEditBonus(Number(e.target.value))}
                    className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FFB703]"
                  />
                </div>
              </div>

              {/* Recalculated Preview */}
              <div className="p-3.5 rounded-2xl bg-[#011826] border border-[#219EBC]/30 flex items-center justify-between text-xs">
                <span className="text-slate-400">Calculated New Total:</span>
                <span className="font-mono font-black text-lg text-[#FFB703]">
                  {(Number(editR1) + Number(editR2) + Number(editR3) + Number(editR4) + Number(editR5) + Number(editBonus)).toLocaleString()} pts
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#032537]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FB8500] to-[#FFB703] text-[#023047] text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 transition"
                >
                  Save & Update Leaderboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
