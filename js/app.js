/**
 * Main Application Controller & Router
 */
const App = {
  currentTab: 'overview',

  init() {
    initFirebase();
    Auth.init();
    Quiz.init();
    Leaderboard.init();
    this.bindEvents();
    this.switchTab('overview');
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.tab === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    document.querySelectorAll('.tab-view').forEach(view => {
      view.style.display = 'none';
    });

    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
      targetView.style.display = 'block';
    }

    if (tabId === 'leaderboard') {
      Leaderboard.render();
    }
  },

  bindEvents() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    const searchInput = document.getElementById('leaderboard-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => Leaderboard.render());
    }

    const filterSelect = document.getElementById('leaderboard-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', () => Leaderboard.render());
    }

    window.addEventListener('click', (e) => {
      const loginModal = document.getElementById('login-modal');
      const manualModal = document.getElementById('manual-score-modal');
      if (e.target === loginModal) this.closeLoginModal();
      if (e.target === manualModal) Leaderboard.closeManualModal();
    });
  },

  openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.style.display = 'flex';
      this.populateQuickTeamSelect();
    }
  },

  closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
  },

  populateQuickTeamSelect() {
    const select = document.getElementById('quick-team-select');
    if (!select) return;
    const teams = Leaderboard.getTeams();
    select.innerHTML = '<option value="">-- Choose Team to Test --</option>' +
      teams.map(t => `<option value="${t.id}">${t.avatar || '⚡'} ${t.name} (${t.college})</option>`).join('');
  },

  handleQuickTeamLogin(teamId) {
    if (!teamId) return;
    const teams = Leaderboard.getTeams();
    const match = teams.find(t => t.id === teamId);
    if (match) {
      Auth.currentRole = 'team';
      Auth.currentTeam = match;
      Auth.saveSession();
      Auth.applyRoleVisibility();
      Auth.renderHeaderUser();
      this.closeLoginModal();
      Leaderboard.render();
      sounds.correct();
    }
  },

  handleTeamLoginSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('login-team-id').value;
    const pass = document.getElementById('login-team-pass').value;
    const res = Auth.loginTeam(id, pass);
    const msgEl = document.getElementById('login-status-msg');

    if (res.success) {
      sounds.correct();
      msgEl.className = 'status-msg success';
      msgEl.textContent = res.message;
      setTimeout(() => {
        msgEl.textContent = '';
        this.closeLoginModal();
        Leaderboard.render();
      }, 700);
    } else {
      sounds.wrong();
      msgEl.className = 'status-msg error';
      msgEl.textContent = res.message;
    }
  },

  handleAdminLoginSubmit(e) {
    e.preventDefault();
    const key = document.getElementById('login-admin-key').value;
    const res = Auth.loginAdmin(key);
    const msgEl = document.getElementById('login-status-msg');

    if (res.success) {
      sounds.correct();
      msgEl.className = 'status-msg success';
      msgEl.textContent = res.message;
      setTimeout(() => {
        msgEl.textContent = '';
        this.closeLoginModal();
        Leaderboard.render();
      }, 700);
    } else {
      sounds.wrong();
      msgEl.className = 'status-msg error';
      msgEl.textContent = res.message;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
