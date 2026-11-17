export const COMPETITION_DETAILS = {
  title: 'SPARK QUEST | BYTE LOGIC',
  subtitle: 'Premier Technical Coding Championship',
  department: 'Department of Information Technology',
  college: 'Pimpri Chinchwad College of Engineering and Research (PCCOER), Ravet',
  club: 'Technospark Club',
  teamSize: '2–4 participants per team',
  expectedTeams: 15,
  registrationFee: '₹50 (PCCOER) / ₹100 (External)',
  date: 'November 2026',
  
  // Color palette matching user uploaded palette:
  // Sky Blue: #8ECAE6, Ocean Blue: #219EBC, Dark Navy: #023047, Amber/Yellow: #FFB703, Orange: #FB8500
  palette: {
    sky: '#8ECAE6',
    teal: '#219EBC',
    navy: '#023047',
    yellow: '#FFB703',
    orange: '#FB8500',
  },

  rounds: [
    {
      roundNumber: 1,
      name: 'Rapid Fire',
      type: 'Online Quiz (Kahoot-Style)',
      isOnline: true,
      description: '25–30 technical fast-fire questions covering programming fundamentals, memory, algorithms, and logic.',
      duration: '20 mins',
      points: 'Up to 3,000 pts',
      badgeColor: '#8ECAE6',
    },
    {
      roundNumber: 2,
      name: 'Bug Hunt',
      type: 'LeetCode / HackerRank Debugging',
      isOnline: true,
      description: 'Find deliberate syntax, runtime, and logical bugs across 2–3 code problems. Run test cases and submit.',
      duration: '30 mins',
      points: '300 pts',
      badgeColor: '#219EBC',
    },
    {
      roundNumber: 3,
      name: 'Blind Coding',
      type: 'Language Draw + Task Chit (Offline)',
      isOnline: false,
      description: 'Chit draw assigns random language (Java, C, C++, Python) and task. Solo participant per team. Scores entered by judges.',
      duration: '25 mins',
      points: '100 pts',
      badgeColor: '#FFB703',
    },
    {
      roundNumber: 4,
      name: 'Reverse Logic',
      type: 'Pen & Paper Algorithm Extraction (Offline)',
      isOnline: false,
      description: 'Analyze complete code snippets and produce formal step-by-step algorithms. Evaluated manually by faculty.',
      duration: '20 mins',
      points: '100 pts',
      badgeColor: '#FB8500',
    },
    {
      roundNumber: 5,
      name: 'Relay Coding',
      type: 'Team-Based Relay Coding Arena',
      isOnline: true,
      description: '40-minute relay: 10m brainstorming + 20m sequential member hand-offs + 10m all-hands collaborative coding.',
      duration: '40 mins',
      points: '300 pts',
      badgeColor: '#219EBC',
    },
  ],

  prizes: [
    { title: 'Winner (1st Place)', amount: '₹7,000', subtitle: 'Trophy + Certificate of Excellence', rank: 1, color: '#FFB703' },
    { title: '1st Runner-Up', amount: '₹5,000', subtitle: 'Silver Trophy + Certificate', rank: 2, color: '#8ECAE6' },
    { title: '2nd Runner-Up', amount: '₹3,000', subtitle: 'Bronze Trophy + Certificate', rank: 3, color: '#FB8500' },
  ]
};
