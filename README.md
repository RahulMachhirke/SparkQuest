# SPARK QUEST | BYTE LOGIC ⚡
### Department of Information Technology
**Organised by Technospark Club**

A modern, responsive, zero-build **HTML + CSS + JavaScript** technical competition platform featuring:
1. **Role-Based Authentication** (Admin features strictly isolated and hidden from participants)
2. **Round 1: Rapid Fire (Kahoot-Style Quiz)** with single-choice & multi-select questions
3. **Live Dynamic Leaderboard** with real-time automatic sync + judge manual adjustments
4. **Official Theme Palette**: `#8ECAE6`, `#219EBC`, `#023047`, `#FFB703`, `#FB8500`

---

## 🚀 How to Run Locally

Because this is a pure, zero-build web app:
- **Option 1**: Simply double-click `index.html` to open in any web browser.
- **Option 2 (Recommended for local lab network)**:
  ```bash
  python -m http.server 8000
  ```
  Visit `http://localhost:8000` (or `http://<your-ip>:8000` on your campus LAN).

---

## ☁️ How to Connect Firebase (Optional for Multi-Device Real-Time Sync)

The website works immediately out-of-the-box in local mode! When you want scores to sync in real time across 15 different participant laptops to the main projector:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) (free).
2. Create a project and add a **Web App** (`</>`).
3. Under **Firestore Database**, click **Create database** (start in Test Mode).
4. Copy your `firebaseConfig` keys into `js/firebase-config.js`:
   ```javascript
   const FIREBASE_CONFIG = {
     apiKey: "AIzaSy...",
     authDomain: "spark-quest.firebaseapp.com",
     projectId: "spark-quest",
     ...
   };
   ```
5. Done! Scores and manual adjustments will instantly sync across all screens in real time.

---

## 📝 How Developers Add Questions

Open: [`js/questions.js`](file:///c:/Users/rahul/OneDrive/Desktop/Technospark-Anvaya/js/questions.js)

The file contains clean templates for both **Single-Correct MCQs** and **Multiple-Select Questions**:

```javascript
// Single-Choice Question
{
  id: "q-04",
  type: "single",
  category: "Programming Fundamentals",
  question: "What is the worst-case time complexity of QuickSort?",
  options: ["O(N log N)", "O(N)", "O(N²)", "O(log N)"],
  correct: [2], // 0-based index: 0=A, 1=B, 2=C, 3=D
  timeLimitSec: 20
}

// Multiple-Select Question ("Select all that apply")
{
  id: "q-05",
  type: "multiple",
  category: "Data Structures",
  question: "Which of the following are linear data structures? (Select all that apply)",
  options: ["Array", "Graph", "Stack", "Tree"],
  correct: [0, 2], // Options A (0) and C (2)
  timeLimitSec: 25
}
```

---

## 🔑 Login Credentials

| Role | Username / ID | Passcode |
| :--- | :--- | :--- |
| **Admin / Organizer** | N/A | `sparkadmin2026` (or `admin`) |
| **Sample Team 1** | `team-01` | `team01` |
| **Sample Team 2** | `team-02` | `team02` |
| **Quick Dev Switcher** | Dropdown in login modal | 1-Click test switch |

---

## 🚢 Deploying to Vercel

Because there are **no package.json or conflicting build files**, Vercel will deploy this statically in 5 seconds with zero build errors:

```bash
git add .
git commit -m "Clean competition frontend with live leaderboard and Kahoot quiz"
git push origin main
```
Import the repository on [vercel.com/new](https://vercel.com/new) and hit **Deploy**!
