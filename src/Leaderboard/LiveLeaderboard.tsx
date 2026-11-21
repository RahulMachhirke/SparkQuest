import React, { useState, useMemo } from 'react';
import { Team } from '../types';
import { 
  Trophy, 
  Search, 
  Download, 
  Clock, 
  Building2, 
  Sparkles, 
  Award,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';

interface LiveLeaderboardProps {
  teams: Team[];
  currentTeamId?: string | null;
  onRefresh?: () => void;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  teams,
  currentTeamId,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('ALL');

  // Sorted teams: Primary totalScore DESC, Secondary timeTakenSec ASC
  const rankedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      // Tie breaker: less time is better (if > 0)
      const timeA = a.timeTakenSec || 999999;
      const timeB = b.timeTakenSec || 999999;
      return timeA - timeB;
    });
  }, [teams]);

  // Unique colleges for filter dropdown
  const colleges = useMemo(() => {
    const list = Array.from(new Set(teams.map((t) => t.college)));
    return ['ALL', ...list];
  }, [teams]);

  // Filtered teams
  const filteredTeams = useMemo(() => {
    return rankedTeams.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCollege =
        selectedCollege === 'ALL' || t.college === selectedCollege;
      return matchesSearch && matchesCollege;
    });
  }, [rankedTeams, searchQuery, selectedCollege]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Rank', 'Team ID', 'Team Name', 'College', 'Round 1 Score', 'Adjustment', 'Total Score', 'Time Taken (s)', 'Status'];
    const rows = rankedTeams.map((t, idx) => [
      idx + 1,
      t.id,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.college.replace(/"/g, '""')}"`,
      t.round1Score,
      t.manualAdjustment,
      t.totalScore,
      t.timeTakenSec.toFixed(1),
      t.completedAt ? 'Completed' : 'Pending'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sparkquest_leaderboard_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FFB703] to-[#FB8500] flex items-center justify-center text-[#011826] shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              Live Competition Standings
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                REALTIME
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Rankings updated dynamically via Supabase Realtime • Tie-breaker: Elapsed Time (s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl bg-[#011826] hover:bg-[#219EBC]/20 text-[#8ECAE6] border border-[#219EBC]/40 transition-all cursor-pointer"
              title="Refresh standings"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#011826] hover:bg-[#023047] text-white border border-[#219EBC]/40 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#FFB703]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team name, college, or ID..."
            className="w-full bg-[#023047]/80 border border-[#219EBC]/30 rounded-xl px-4 py-3 pl-10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FFB703]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
          className="bg-[#023047]/80 border border-[#219EBC]/30 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FFB703] cursor-pointer"
        >
          {colleges.map((c) => (
            <option key={c} value={c}>
              {c === 'ALL' ? 'All Colleges & Universities' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Standings Table */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#011826] border-b border-[#219EBC]/30 text-[#8ECAE6] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4 hidden md:table-cell">College</th>
                <th className="py-3.5 px-4 text-center">Round 1</th>
                <th className="py-3.5 px-4 text-center hidden sm:table-cell">Adjust.</th>
                <th className="py-3.5 px-4 text-right">Total Score</th>
                <th className="py-3.5 px-4 text-right hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTeams.map((team, idx) => {
                const rank = rankedTeams.findIndex((t) => t.id === team.id) + 1;
                const isMyTeam = team.id === currentTeamId;

                // Rank badges
                let rankBadge = (
                  <span className="font-mono font-bold text-slate-400">#{rank}</span>
                );
                if (rank === 1) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FFB703] text-[#011826] font-black shadow-md text-xs">
                      🥇 1
                    </span>
                  );
                } else if (rank === 2) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#8ECAE6] text-[#011826] font-black shadow-md text-xs">
                      🥈 2
                    </span>
                  );
                } else if (rank === 3) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FB8500] text-white font-black shadow-md text-xs">
                      🥉 3
                    </span>
                  );
                }

                return (
                  <tr
                    key={team.id}
                    className={`transition-colors ${
                      isMyTeam
                        ? 'bg-[#219EBC]/15 font-semibold text-white'
                        : 'hover:bg-white/[0.03] text-slate-200'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center">{rankBadge}</td>

                    {/* Team Name & Members */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl flex-shrink-0">{team.avatar}</span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{team.name}</span>
                            {isMyTeam && (
                              <span className="text-[10px] font-mono text-[#FFB703] px-1.5 py-0.5 rounded bg-[#FFB703]/20 border border-[#FFB703]/30">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                            {team.members}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* College */}
                    <td className="py-4 px-4 hidden md:table-cell text-slate-300">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Building2 className="w-3.5 h-3.5 text-[#8ECAE6]" />
                        <span>{team.college}</span>
                      </div>
                    </td>

                    {/* Round 1 Score */}
                    <td className="py-4 px-4 text-center font-mono font-bold text-[#8ECAE6]">
                      {team.round1Score ? team.round1Score.toLocaleString() : '—'}
                    </td>

                    {/* Manual Adjustment */}
                    <td className="py-4 px-4 text-center hidden sm:table-cell font-mono text-xs">
                      {team.manualAdjustment > 0 ? (
                        <span className="text-emerald-400">+{team.manualAdjustment}</span>
                      ) : team.manualAdjustment < 0 ? (
                        <span className="text-red-400">{team.manualAdjustment}</span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>

                    {/* Total Score */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-mono font-black text-base text-[#FFB703]">
                        {team.totalScore.toLocaleString()}
                      </div>
                    </td>

                    {/* Time Taken */}
                    <td className="py-4 px-4 text-right hidden sm:table-cell text-slate-400 font-mono text-xs">
                      {team.timeTakenSec > 0 ? (
                        <div className="flex items-center justify-end gap-1 text-slate-300">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{team.timeTakenSec.toFixed(1)}s</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
