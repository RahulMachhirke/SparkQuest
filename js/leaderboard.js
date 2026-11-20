/**
 * Live Leaderboard Engine: Supports Real-Time Firebase Sync & Local Fallback
 * Admin insertion features are strictly protected and visible ONLY to admins.
 */
const Leaderboard = {
  teamsCache: [],
  firestoreUnsubscribe: null,

  init() {
    this.teamsCache = this.getLocalTeams();
    this.setupFirestoreListener();
    this.render();
  },

  getLocalTeams() {
    const raw = localStorage.getItem('spark_leaderboard_teams');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return DEFAULT_TEAMS;
      }
    }
    this.saveLocalTeams(DEFAULT_TEAMS);
    return DEFAULT_TEAMS;
  },

  saveLocalTeams(teams) {
    this.teamsCache = teams;
    localStorage.setItem('spark_leaderboard_teams', JSON.stringify(teams));
  },

  getTeams() {
    return this.teamsCache;
  },

  setupFirestoreListener() {
    if (typeof db !== 'undefined' && db) {
      try {
        if (this.firestoreUnsubscribe) this.firestoreUnsubscribe();
        
        this.firestoreUnsubscribe = db.collection('teams').onSnapshot((snapshot) => {
          if (!snapshot.empty) {
            const remoteTeams = [];
            snapshot.forEach(doc => {
              remoteTeams.push({ id: doc.id, ...doc.data() });
            });
            this.saveLocalTeams(remoteTeams);
            this.render();
          } else {
            // Seed Firestore with default teams on first run
            DEFAULT_TEAMS.forEach(team => {
              db.collection('teams').doc(team.id).set(team);
            });
          }
        }, (err) => {
          console.warn("Firestore listener fallback to local mode:", err);
        });
      } catch (e) {
        console.warn("Firestore error, running locally:", e);
      }
    }
  },

  /**
   * AUTOMATIC INSERTION:
   * Called when a team finishes the Round 1 quiz on their phone or laptop.
   */
  async recordQuizScore(teamId, quizPoints, timeTakenSec) {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Update in Firestore if connected (syncs to everyone!)
    if (typeof db !== 'undefined' && db && isFirebaseReady) {
      try {
        const teamRef = db.collection('teams').doc(teamId);
        const doc = await teamRef.get();
        const currentData = doc.exists ? doc.data() : {};
        const manual = currentData.manualAdjustment || 0;
        const total = quizPoints + manual;

        await teamRef.set({
          ...currentData,
          round1Score: quizPoints,
          totalScore: total,
          timeTakenSec: timeTakenSec,
          completedAt: nowTime
        }, { merge: true });
      } catch (e) {
        console.warn("Error saving to Firestore:", e);
      }
    }

    // 2. Local fallback update
    const teams = this.getTeams();
    const updated = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          round1Score: quizPoints,
          totalScore: quizPoints + (t.manualAdjustment || 0),
          timeTakenSec: timeTakenSec,
          completedAt: nowTime
        };
      }
      return t;
    });

    this.saveLocalTeams(updated);
    this.render();
  },

  /**
   * MANUAL INSERTION (Admin-Only):
   * Organizers adjust scores or add bonuses/penalties with an audit note.
   */
  async manualAdjustScore(teamId, adjustmentPoints, note = '') {
    if (Auth.currentRole !== 'admin') {
      alert("Unauthorized: Only organizers can adjust scores.");
      return;
    }

    const manual = Number(adjustmentPoints) || 0;

    // 1. Update in Firestore if connected
    if (typeof db !== 'undefined' && db && isFirebaseReady) {
      try {
        const teamRef = db.collection('teams').doc(teamId);
        const doc = await teamRef.get();
        const currentData = doc.exists ? doc.data() : {};
        const r1 = currentData.round1Score || 0;
        const total = r1 + manual;

        await teamRef.set({
          ...currentData,
          manualAdjustment: manual,
          totalScore: total,
          adjustmentNote: note || 'Judge Manual Entry',
          lastUpdated: new Date().toLocaleTimeString()
        }, { merge: true });
      } catch (e) {
        console.warn("Error saving to Firestore:", e);
      }
    }

    // 2. Local fallback update
    const teams = this.getTeams();
    const updated = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          manualAdjustment: manual,
          totalScore: (t.round1Score || 0) + manual,
          adjustmentNote: note,
          lastUpdated: new Date().toLocaleTimeString()
        };
      }
      return t;
    });

    this.saveLocalTeams(updated);
    this.render();
  },

  render() {
    const tbody = document.getElementById('leaderboard-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('leaderboard-search')?.value || '').toLowerCase();
    const filterCollege = document.getElementById('leaderboard-filter')?.value || 'all';

    let teams = [...this.getTeams()];

    // Tie-Breaking Ranking Sort:
    // 1. Highest totalScore
    // 2. If equal totalScore, lowest timeTakenSec (fastest completion)
    teams.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
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
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No matching teams found.</td></tr>`;
      return;
    }

    const isAdmin = Auth.currentRole === 'admin';

    tbody.innerHTML = filtered.map((t, idx) => {
      const rank = idx + 1;
      let rankBadge = `<span class="rank-num">#${rank}</span>`;
      if (rank === 1) rankBadge = `<span class="medal gold" title="1st Place Champion">🥇 1</span>`;
      else if (rank === 2) rankBadge = `<span class="medal silver" title="2nd Place">🥈 2</span>`;
      else if (rank === 3) rankBadge = `<span class="medal bronze" title="3rd Place">🥉 3</span>`;

      const tieBreakInfo = t.timeTakenSec ? `${t.timeTakenSec}s` : '—';

      return `
        <tr class="${rank <= 3 ? 'top-rank-row rank-' + rank : ''}">
          <td style="text-align: center; width: 65px;">${rankBadge}</td>
          <td>
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
          <td class="numeric-col">
            <span class="score-r1">${(t.round1Score || 0).toLocaleString()}</span>
            <span class="score-subtext">Quiz (Auto)</span>
          </td>
          <td class="numeric-col">
            <span class="score-manual ${t.manualAdjustment > 0 ? 'pos' : t.manualAdjustment < 0 ? 'neg' : ''}">
              ${t.manualAdjustment > 0 ? '+' : ''}${t.manualAdjustment || 0}
            </span>
            <span class="score-subtext">Judge Adjustment</span>
          </td>
          <td class="numeric-col">
            <span class="tiebreak-time">${tieBreakInfo}</span>
            <span class="score-subtext">${t.completedAt || 'Pending'}</span>
          </td>
          <td class="numeric-col">
            <strong class="score-total">${(t.totalScore || 0).toLocaleString()}</strong>
            <span class="score-subtext">points</span>
          </td>
          <!-- Strictly Admin-Only Action Cell -->
          <td class="admin-only" style="text-align: center;">
            <button class="btn btn-sm btn-outline-teal" onclick="Leaderboard.openManualModal('${t.id}')">
              ✏️ Adjust
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  openManualModal(teamId) {
    if (Auth.currentRole !== 'admin') {
      alert("Restricted: Admin access required.");
      return;
    }
    const teams = this.getTeams();
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    document.getElementById('manual-modal-team-id').value = team.id;
    document.getElementById('manual-modal-team-name').textContent = team.name;
    document.getElementById('manual-modal-college').textContent = team.college;
    document.getElementById('manual-modal-r1-score').textContent = `${team.round1Score || 0} pts (Quiz)`;
    document.getElementById('manual-modal-points').value = team.manualAdjustment || 0;
    document.getElementById('manual-modal-reason').value = team.adjustmentNote || '';

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
    const teams = [...this.getTeams()];
    teams.sort((a, b) => b.totalScore - a.totalScore);

    const headers = ['Rank', 'Team ID', 'Team Name', 'College', 'Round 1 Quiz', 'Manual Adjustment', 'Tie-Breaker Time (s)', 'Total Score'];
    const rows = teams.map((t, i) => [
      i + 1,
      t.id,
      `"${t.name}"`,
      `"${t.college}"`,
      t.round1Score || 0,
      t.manualAdjustment || 0,
      t.timeTakenSec || 0,
      t.totalScore || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SparkQuest_Leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
