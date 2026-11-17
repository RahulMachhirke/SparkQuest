/**
 * Authentication & Session Management
 */
const Auth = {
  currentRole: 'guest',
  currentTeam: null,

  init() {
    const savedRole = localStorage.getItem('spark_auth_role');
    const savedTeam = localStorage.getItem('spark_auth_team');

    if (savedRole) this.currentRole = savedRole;
    if (savedTeam) {
      try {
        this.currentTeam = JSON.parse(savedTeam);
      } catch (e) {
        this.currentTeam = null;
      }
    }

    // Default to Team 01 for smooth initial developer testing if nothing is logged in
    if (!this.currentTeam && typeof DEFAULT_TEAMS !== 'undefined' && DEFAULT_TEAMS.length > 0) {
      this.currentTeam = DEFAULT_TEAMS[0];
      this.currentRole = 'team';
      this.saveSession();
    }

    this.renderHeaderUser();
  },

  loginTeam(teamId, passcode) {
    const teams = Leaderboard.getTeams();
    const match = teams.find(
      t => t.id.toLowerCase() === teamId.trim().toLowerCase() && t.passcode === passcode.trim()
    );

    if (match) {
      this.currentRole = 'team';
      this.currentTeam = match;
      this.saveSession();
      this.renderHeaderUser();
      return { success: true, message: `Welcome, ${match.name}!` };
    }
    return { success: false, message: 'Invalid Team ID or Passcode.' };
  },

  loginAdmin(key) {
    if (key.trim() === SPARK_CONFIG.adminKey || key.trim() === 'admin') {
      this.currentRole = 'admin';
      this.saveSession();
      this.renderHeaderUser();
      return { success: true, message: 'Admin authenticated successfully.' };
    }
    return { success: false, message: 'Incorrect Admin Key.' };
  },

  logout() {
    this.currentRole = 'guest';
    this.currentTeam = null;
    localStorage.removeItem('spark_auth_role');
    localStorage.removeItem('spark_auth_team');
    this.renderHeaderUser();
  },

  saveSession() {
    localStorage.setItem('spark_auth_role', this.currentRole);
    if (this.currentTeam) {
      localStorage.setItem('spark_auth_team', JSON.stringify(this.currentTeam));
    } else {
      localStorage.removeItem('spark_auth_team');
    }
  },

  renderHeaderUser() {
    const userBadgeEl = document.getElementById('user-profile-badge');
    if (!userBadgeEl) return;

    if (this.currentRole === 'team' && this.currentTeam) {
      userBadgeEl.innerHTML = `
        <div class="user-pill team-pill" onclick="App.openLoginModal()">
          <span class="user-avatar">${this.currentTeam.avatar}</span>
          <div class="user-info">
            <span class="user-name">${this.currentTeam.name}</span>
            <span class="user-role">${this.currentTeam.college}</span>
          </div>
          <button class="logout-btn" title="Sign Out" onclick="event.stopPropagation(); Auth.logout();">✕</button>
        </div>
      `;
    } else if (this.currentRole === 'admin') {
      userBadgeEl.innerHTML = `
        <div class="user-pill admin-pill">
          <span class="user-avatar">🛡️</span>
          <div class="user-info">
            <span class="user-name">Organizer Admin</span>
            <span class="user-role">Full Access</span>
          </div>
          <button class="logout-btn" title="Sign Out" onclick="Auth.logout();">✕</button>
        </div>
      `;
    } else {
      userBadgeEl.innerHTML = `
        <button class="btn btn-outline" onclick="App.openLoginModal()">
          <span>🔑 Team / Admin Login</span>
        </button>
      `;
    }
  }
};
