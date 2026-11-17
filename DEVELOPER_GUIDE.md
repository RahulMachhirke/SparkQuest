# Developer & Teammate Guide: Spark Quest | Byte Logic

Welcome to the **Spark Quest | Byte Logic** codebase! This project is architected with a **clean, modular, and declarative design** so that **any developer on your team** can easily make adjustments, add new questions, add coding challenges, tune scoring, or connect external databases without breaking other modules.

---

## 🎨 Official Color Palette (From Competition Design Spec)
The platform uses the **Refreshing Summer** theme palette configured directly in `tailwind.config.js`:

| Color Name | Hex Code | Tailwind Token | UI Role |
| :--- | :--- | :--- | :--- |
| **Light Sky Blue** | `#8ECAE6` | `bg-brand-sky` / `#8ECAE6` | Round 1 Badges, Subheadings, Accents |
| **Ocean Teal Blue** | `#219EBC` | `bg-brand-teal` / `#219EBC` | Primary buttons, active tabs, Round 2 IDE accents |
| **Prussian Navy** | `#023047` | `bg-brand-navy` / `#023047` | Cards, navigation bars, modal backgrounds |
| **Honey Amber Yellow** | `#FFB703` | `bg-brand-yellow` / `#FFB703` | 1st place champion ribbons, scores, active timers |
| **High-Energy Orange** | `#FB8500` | `bg-brand-orange` / `#FB8500` | Round 5 Relay, CTAs, flame animations |
| **Deep Midnight** | `#011826` | `bg-brand-dark` / `#011826` | High-contrast main background & IDE editor canvas |

---

## 📁 Project Architecture & File Map

```
Technospark-Anvaya/
├── src/
│   ├── types/
│   │   └── index.ts                 <-- All TypeScript interfaces (Team, Question, Problem, TestCase)
│   ├── data/
│   │   ├── defaultTeams.ts          <-- 15 enrolled college teams, member rosters, seed scores
│   │   ├── round1Questions.ts       <-- 25+ Kahoot quiz questions (C, C++, Java, Python, Algo)
│   │   ├── round2Problems.ts        <-- Bug Hunt problems with deliberate errors & test cases
│   │   ├── round5Problems.ts        <-- Relay Coding problem statements & phase durations
│   │   └── competitionConfig.ts     <-- College details, round metadata, prize pool
│   ├── context/
│   │   ├── AuthContext.tsx          <-- Team authentication, Admin login, demo switcher
│   │   └── CompetitionContext.tsx   <-- Real-time leaderboard, auto & manual score engine, storage
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx           <-- Header with live round pill, sound toggle, team switcher
│   │   │   ├── Footer.tsx           <-- PCCOER IT credits & theme swatch
│   │   │   └── LoginModal.tsx       <-- Team login, admin login, quick dev switcher
│   │   ├── home/
│   │   │   └── Overview.tsx         <-- Hero section, 5 rounds summary, prize breakdown
│   │   ├── round1-quiz/
│   │   │   └── KahootQuiz.tsx       <-- Kahoot-style quiz arena (speed timer, sounds, streak combo)
│   │   ├── round2-bughunt/
│   │   │   └── CodePlayground.tsx   <-- LeetCode/HackerRank split IDE with Monaco editor & runner
│   │   ├── round5-relay/
│   │   │   └── RelayCoding.tsx      <-- 40m relay timer, coder rotation, handover notes, submission
│   │   ├── leaderboard/
│   │   │   └── LiveLeaderboard.tsx  <-- Real-time standings with instant in-place manual editing
│   │   └── admin/
│   │       └── AdminPanel.tsx       <-- Gate lock/unlock, register teams, backup export/import
│   ├── utils/
│   │   ├── codeRunner.ts            <-- Sandboxed JS/Python runner with timeout guards
│   │   └── soundEffects.ts          <-- 100% offline Web Audio API synthesizer (no missing mp3s!)
│   ├── App.tsx                      <-- Top-level tab routing & state layout
│   └── main.tsx
├── tailwind.config.js
└── package.json
```

---

## 🛠️ How Any Teammate Can Make Everyday Changes

### 1. Adding or Editing Round 1 (Quiz) Questions
Open: `src/data/round1Questions.ts`
Simply append a new object to the `ROUND1_QUESTIONS` array:
```ts
{
  id: 'q26',
  category: 'Python',
  question: 'What is the output of print(3 * [1, 2])?',
  options: [
    '[1, 2, 1, 2, 1, 2]',
    '[3, 6]',
    '[[1, 2], [1, 2], [1, 2]]',
    'TypeError'
  ],
  correctIndex: 0, // 0 = first option, 1 = second, etc.
  explanation: 'List multiplication concatenates the list N times.',
  timeLimitSec: 15,
}
```

### 2. Adding or Editing Round 2 (Bug Hunt) Problems
Open: `src/data/round2Problems.ts`
Each problem contains:
- `buggyCode`: Code with intentional syntax/runtime/logic bugs for participants to debug.
- `solutionCode`: Reference solution.
- `testCases`: Array of inputs, expected outputs, and `isHidden` flags.

```ts
{
  id: 'bug-04',
  title: 'Bug 4: Anagram Grouper',
  difficulty: 'Medium',
  bugType: 'Logical Off-by-one',
  description: '...',
  hints: ['Check how strings are sorted as dictionary keys.'],
  maxPoints: 100,
  timeLimitMin: 20,
  buggyCode: {
    javascript: `...`,
    python: `...`
  },
  testCases: [
    { id: 'tc-401', input: 'cat dog tac', expectedOutput: 'cat,tac dog', isHidden: false },
    { id: 'tc-402', input: 'a b c', expectedOutput: 'a b c', isHidden: true }
  ]
}
```

### 3. Adding or Updating Participating Teams
Open: `src/data/defaultTeams.ts`
You can adjust names, colleges, passcodes, and initial scores:
```ts
{
  id: 'team-16',
  name: 'Cyber Samurai',
  passcode: 'team16',
  college: 'PCCOER Ravet',
  members: [
    { id: 'm1', name: 'Tanmay Kulkarni', role: 'Captain' },
    { id: 'm2', name: 'Rutuja Gore', role: 'Coder' },
  ],
  avatar: '⚔️',
  round1Score: 0,
  round2Score: 0,
  round3Score: 0,
  round4Score: 0,
  round5Score: 0,
  bonusPoints: 0,
  totalScore: 0,
}
```
*Note: You can also register teams dynamically during the event without touching code via the **Admin Hub**!*

### 4. How the Leaderboard Scoring Works
The leaderboard tracks 5 rounds:
- **Round 1 (Rapid Fire)**: Auto-awarded based on quiz accuracy and answer speed (up to 3,000 pts).
- **Round 2 (Bug Hunt)**: Auto-awarded 100 pts per solved problem upon passing all test cases.
- **Round 3 (Blind Coding)**: Offline round (chit draw). Faculty/judges insert scores via the **Adjust** button or Admin Hub.
- **Round 4 (Reverse Logic)**: Offline round (pen & paper). Faculty insert scores via the **Adjust** button or Admin Hub.
- **Round 5 (Relay Coding)**: Auto-awarded 300 pts upon relay completion and verification.
- **Bonus/Penalties**: Can be added (+/-) at any time.

Total score is computed dynamically:
$$\text{Total Score} = R_1 + R_2 + R_3 + R_4 + R_5 + \text{Bonus}$$

### 5. Switching to a Live Backend (Firebase / Supabase)
Currently, all state is backed by reactive React Context + `localStorage`, which allows running 100% locally or on a local LAN server.

If your team wants to hook this up to Firebase or Supabase for multi-device live sync:
1. In `src/context/CompetitionContext.tsx`, replace `localStorage` `setItem`/`getItem` with `onSnapshot()` (Firebase Firestore) or `supabase.channel('teams')`.
2. All components already call `updateScore()` and `bulkAdjustScores()`, so no UI code needs to be modified!

---

## 🔑 Default Credentials & Keys

| Role | Username / ID | Password / Key |
| :--- | :--- | :--- |
| **Admin / Organizer** | N/A | `sparkadmin2026` or `admin` |
| **Sample Team 1** | `team-01` | `team01` |
| **Sample Team 2** | `team-02` | `team02` |
| **Quick Dev Login** | Any team in dropdown | 1-Click via **Quick Dev** tab in Login Modal |
