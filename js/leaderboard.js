/**
 * Live Leaderboard Engine: Supports Automatic & Manual Insertion
 */
const Leaderboard = {
  getTeams() {
    const raw = localStorage.getItem('spark_leaderboard_teams');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return DEFAULT_TEAMS;
      }
    }
    // Initialize with default teams if fresh
    this.saveTeams(DEFAULT_TEAMS);
    return DEFAULT_TEAMS;
  },

  saveTeams(teams) {
    localStorage.setItem('spark_leaderboard_teams', JSON.stringify(teams));
  },

  /**
   * AUTOMATIC INSERTION:
   * Called immediately upon completion of the Round 1 Rapid Fire quiz.
   */
  recordQuizScore(teamId, quizPoints, timeTakenSec) {
    const teams = this.getTeams();
    const updated = teams.map(t => {
      if (t.id === teamId) {
        const round1 = quizPoints;
        const total = round1 + (t.manualAdjustment || 0);
        return {
          ...t,
          round1Score: round1,
          totalScore: total,
          timeTakenSec: timeTakenSec,
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
      }
      return t;
    });

    this.saveTeams(updated);
    this.render();
    this.logActivity(`${Auth.currentTeam?.name || teamId} completed Round 1 with ${quizPoints} pts (Auto)`);
  },

  /**
   * MANUAL INSERTION / ADJUSTMENT:
   * Called when an organizer/judge manually enters or adjusts scores for a team.
   */
  manualAdjustScore(teamId, newManualPoints, note = '') {
    const teams = this.getTeams();
    let teamName = '';

    const updated = teams.map(t => {
      if (t.id === teamId) {
        teamName = t.name;
        const manual = Number(newManualPoints) || 0;
        const total = (t.round1Score || 0) + manual;
        return {
          ...t,
          manualAdjustment: manual,
          totalScore: total,
          lastUpdated: new Date().toLocaleTimeString()
        };
      }
      return t;
    });

    this.saveTeams(updated);
    this.render();
    this.logActivity(`Manual score adjusted for ${teamName}: ${newManualPoints >= 0 ? '+' : ''}${newManualPoints} pts (${note || 'Manual Entry'})`);
  },

  logActivity(message) {
    const feed = JSON.parse(localStorage.getItem('spark_activity_log') || '[]');
    feed.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: message
    });
    localStorage.setItem('spark_activity_log', JSON.stringify(feed.slice(0, 10)));
    this.renderActivityLog();
  },

  renderActivityLog() {
    const container = document.getElementById('activity-ticker-content');
    if (!container) return;
    const feed = JSON.parse(localStorage.getItem('spark_activity_log') || '[]');
    if (feed.length === 0) {
      container.innerHTML = `<span class="activity-empty">Awaiting Round 1 quiz submissions...</span>`;
      return;
    }
    container.innerHTML = feed.slice(0, 5).map(f => `
      <span class="activity-item">
        <span class="activity-time">[${f.time}]</span> ${f.text}
      </span>
    `).join(' • ');
  },

  render() {
    const tbody = document.getElementById('leaderboard-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('leaderboard-search')?.value || '').toLowerCase();
    const filterCollege = document.getElementById('leaderboard-filter')?.value || 'all';

    let teams = this.getTeams();

    // Tie-breaking sorting logic:
    // 1. Highest totalScore
    // 2. If tied, lowest timeTakenSec (fastest completion)
    teams.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      // Tie-breaker: if both have finished, lower time wins
      const timeA = a.timeTakenSec || 999999;
      const timeB = b.timeTakenSec || 999999;
      return timeA - timeB;
    });

    // Apply Search & College Filter
    const filtered = teams.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchTerm) ||
                          t.college.toLowerCase().includes(searchTerm) ||
                          (t.members && t.members.toLowerCase().includes(searchTerm));
      const matchCollege = filterCollege === 'all' ? true :
                           filterCollege === 'pccoer' ? t.college.toLowerCase().includes('pccoer') :
                           !t.college.toLowerCase().includes('pccoer');
      return matchSearch && matchCollege;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No matching teams found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((t, idx) => {
      const rank = idx + 1;
      let rankBadge = `<span class="rank-num">#${rank}</span>`;
      if (rank === 1) rankBadge = `<span class="medal gold" title="1st Place">🥇 1</span>`;
      else if (rank === 2) rankBadge = `<span class="medal silver" title="2nd Place">🥈 2</span>`;
      else if (rank === 3) rankBadge = `<span class="medal bronze" title="3rd Place">🥉 3</span>`;

      const tieBreakInfo = t.timeTakenSec ? `${t.timeTakenSec}s` : '—';

      return `
        <tr class="${rank <= 3 ? 'top-rank-row rank-' + rank : ''}">
          <td class="col-rank">${rankBadge}</td>
          <td class="col-team">
            <div class="team-meta">
              <span class="team-avatar">${t.avatar || '⚡'}</span>
              <div>
                <div class="team-title-row">
                  <strong class="team-name">${t.name}</strong>
                  <span class="college-badge">${t.college}</span>
                </div>
                <div class="team-members">${t.members || 'Team Roster'}</div>
              </div>
            </div>
          </td>
          <td class="col-r1 numeric-col">
            <span class="score-r1">${t.round1Score.toLocaleString()}</span>
            <span class="score-subtext">Auto</span>
          </td>
          <td class="col-manual numeric-col">
            <span class="score-manual ${t.manualAdjustment > 0 ? 'pos' : t.manualAdjustment < 0 ? 'neg' : ''}">
              ${t.manualAdjustment > 0 ? '+' : ''}${t.manualAdjustment}
            </span>
            <span class="score-subtext">Judge Entry</span>
          </td>
          <td class="col-tie numeric-col">
            <span class="tiebreak-time">${tieBreakInfo}</span>
            <span class="score-subtext">${t.completedAt || 'Pending'}</span>
          </td>
          <td class="col-total numeric-col">
            <strong class="score-total">${t.totalScore.toLocaleString()}</strong>
            <span class="score-subtext">pts</span>
          </td>
          <td class="col-actions">
            <button class="btn btn-sm btn-outline-teal" onclick="Leaderboard.openManualModal('${t.id}')">
              ✏️ Adjust
            </button>
          </td>
        </tr>
      `;
    }).join('');

    this.renderActivityLog();
  },

  openManualModal(teamId) {
    const teams = this.getTeams();
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    document.getElementById('manual-modal-team-id').value = team.id;
    document.getElementById('manual-modal-team-name').textContent = team.name;
    document.getElementById('manual-modal-college').textContent = team.college;
    document.getElementById('manual-modal-r1-score').textContent = `${team.round1Score} pts (Quiz)`;
    document.getElementById('manual-modal-points').value = team.manualAdjustment || 0;
    document.getElementById('manual-modal-reason').value = '';

    document.getElementById('manual-score-modal').style.display = 'flex';
  },

  closeManualModal() {
    document.getElementById('manual-score-modal').style.display = 'none';
  },

  submitManualModal(e) {
    e.preventDefault();
    const teamId = document.getElementById('manual-modal-team-id').value;
    const points = Number(document.getElementById('manual-modal-points').value) || 0;
    const reason = document.getElementById('manual-modal-reason').value;

    this.manualAdjustScore(teamId, points, reason);
    this.closeManualModal();
    sounds.correct();
  },

  exportCSV() {
    const teams = this.getTeams();
    teams.sort((a, b) => b.totalScore - a.totalScore);

    const headers = ['Rank', 'Team ID', 'Team Name', 'College', 'Round 1 Quiz (Auto)', 'Manual Adjustment', 'Tie-Breaker Time (s)', 'Total Score'];
    const rows = teams.map((t, i) => [
      i + 1,
      t.id,
      `"${t.name}"`,
      `"${t.college}"`,
      t.round1Score,
      t.manualAdjustment,
      t.timeTakenSec || 0,
      t.totalScore
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SparkQuest_Round1_Leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
