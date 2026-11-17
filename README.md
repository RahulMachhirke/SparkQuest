# SPARK QUEST | BYTE LOGIC ⚡
### Department of Information Technology — PCCOER Ravet
**Organised by Technospark Club**

A streamlined, pure **HTML + CSS + JavaScript** technical competition platform focused on:
1. **Authentication (Team & Admin)**
2. **Live Leaderboard with Automatic & Manual Insertion**
3. **Round 1: Rapid Fire (Kahoot-style Quiz Engine)**

---

## 🎨 Official Color Palette
The website strictly uses the provided **"Refreshing Summer"** palette:
- **Light Sky Blue**: `#8ECAE6`
- **Ocean Teal Blue**: `#219EBC`
- **Prussian Navy**: `#023047`
- **Honey Amber / Yellow**: `#FFB703`
- **High-Energy Orange**: `#FB8500`
- **Deep Midnight Background**: `#011826`

---

## 🚀 How to Run the Website

There are **zero build steps, zero Node.js installations, and zero Tailwind compilation dependencies**!

### Option 1: Direct in Browser
Simply double-click `index.html` or open it directly in Google Chrome, Edge, or Firefox.

### Option 2: Using Python (Recommended for local hosting / LAN)
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` or `http://<your-ip>:8000` on the lab network.

---

## 📝 How Developers Insert Questions

Open: [`js/questions.js`](file:///c:/Users/rahul/OneDrive/Desktop/Technospark-Anvaya/js/questions.js)

The file contains clean templates for both **Single-Correct MCQs** and **Multiple-Select Questions**:

### 1. Single-Correct MCQ Example
```javascript
{
  id: "q-04",
  type: "single",
  category: "Data Structures",
  question: "What is the worst-case time complexity of QuickSort?",
  options: [
    "O(N log N)",
    "O(N)",
    "O(N²)",
    "O(log N)"
  ],
  correct: [2], // 0-based index: 0=A, 1=B, 2=C, 3=D
  explanation: "When partitions are repeatedly unbalanced, QuickSort degrades to O(N²).",
  timeLimitSec: 20
}
```

### 2. Multiple-Select Question Example ("Select all that apply")
```javascript
{
  id: "q-05",
  type: "multiple",
  category: "Operating Systems",
  question: "Which of the following are valid process scheduling algorithms? (Select ALL that apply)",
  options: [
    "Round Robin (RR)",
    "First-Come, First-Served (FCFS)",
    "Shortest Job First (SJF)",
    "Dijkstra Shortest Path"
  ],
  correct: [0, 1, 2], // Options A, B, and C are correct
  explanation: "RR, FCFS, and SJF are CPU schedulers; Dijkstra is a graph shortest path algorithm.",
  timeLimitSec: 25
}
```

---

## 📊 Live Leaderboard Functionality

### 1. Automatic Insertion:
- When a team completes the Round 1 quiz, their score is calculated based on accuracy and speed.
- Their score, completion timestamp, and overall time taken (in seconds) are automatically saved to the leaderboard.
- **Tie-Breaking Rule**: If two teams tie on total score, the team with the lower total completion time ranks higher.

### 2. Manual Insertion / Adjustment:
- Faculty and judges can click the **✏️ Adjust** button on any team row.
- A modal opens allowing you to input positive points (`+100` bonus/judge marks) or negative points (`-25` penalty).
- The total score updates dynamically in real-time.

---

## 🔑 Login Credentials

| Role | Username / ID | Passcode |
| :--- | :--- | :--- |
| **Admin / Organizer** | N/A | `sparkadmin2026` (or `admin`) |
| **Sample Team 1** | `team-01` | `team01` |
| **Sample Team 2** | `team-02` | `team02` |
| **Quick Dev Switcher** | Dropdown in login modal | 1-Click test switch |

---

## 📁 File Structure
```
Technospark-Anvaya/
├── index.html          <-- Semantic HTML structure
├── css/
│   └── style.css       <-- Pure CSS with CSS Custom Properties & Palette
├── js/
│   ├── config.js       <-- Competition metadata & scoring defaults
│   ├── sound.js        <-- Offline Web Audio API sound synthesizer
│   ├── questions.js    <-- Questions repository (Developers insert questions here)
│   ├── teams.js        <-- Enrolled teams list
│   ├── auth.js         <-- Team & Admin authentication
│   ├── leaderboard.js  <-- Live leaderboard (auto & manual score handling)
│   ├── quiz.js         <-- Kahoot quiz engine (single & multi-select, timer)
│   └── app.js          <-- Main router and event binder
└── README.md           <-- Documentation
```
