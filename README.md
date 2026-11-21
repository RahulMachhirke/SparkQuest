<div align="center">

# ⚡ SPARK QUEST | BYTE LOGIC

### Technical Competition Platform — Technospark 2026

**Department of Information Technology · PCCOER Ravet**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sparkquest1.vercel.app-FB8500?style=for-the-badge&logo=vercel&logoColor=white)](https://sparkquest1.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📌 Overview

**SPARK QUEST | BYTE LOGIC** is a full-stack, real-time technical quiz competition platform built for the Technospark Club at PCCOER Ravet. It features a live Kahoot-style quiz engine, a dynamic leaderboard, a hidden admin dashboard for organizers, and real-time synchronization across all participant devices — all without requiring a backend server.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Role-Based Access** | Admin portal is completely hidden from participants — accessible only via `/admin` URL |
| ⚡ **Kahoot-Style Quiz Engine** | Timed MCQ & MSQ rounds with auto-submit, speed scoring, and answer reveal |
| 📊 **Live Leaderboard** | Real-time standings with medals, search/filter, tie-breaker by time, and CSV export |
| 🛠️ **Admin Dashboard** | Full control over questions, teams, scores, and round lifecycle |
| 👥 **Team Manager** | Add, edit, and remove participant teams live — changes sync instantly to sign-in page |
| ❓ **Question Bank** | Create MCQ/MSQ questions with code snippets, custom timers, and point values |
| 🎯 **Score Adjuster** | Manual ±50 quick adjust or custom delta per team for judge overrides |
| 📡 **Real-Time Sync** | BroadcastChannel API for multi-tab sync; optional Supabase for multi-device sync |
| 🎊 **Confetti & Sound** | Web Audio API sound engine + canvas-confetti on completion |
| 📱 **Fully Responsive** | Mobile-first design, works on phones, tablets, and projector screens |

---

## 🛠️ Tech Stack

```
React 18 + TypeScript 5     →  UI framework & type safety
Vite 6                      →  Build tool & dev server
Tailwind CSS v3             →  Utility-first styling
Lucide React                →  Icon library
canvas-confetti             →  Celebration animations
BroadcastChannel API        →  Real-time multi-tab sync (no server needed)
Supabase (optional)         →  Cloud database for multi-device real-time sync
```

---

## 🎨 Design System

The app uses a strict 5-color **"Refreshing Summer"** palette with Swiss typography:

| Token | Hex | Usage |
|---|---|---|
| `spark-sky` | `#8ECAE6` | Accents, borders, secondary text |
| `spark-teal` | `#219EBC` | Primary interactive elements |
| `spark-navy` | `#023047` | Cards, containers |
| `spark-amber` | `#FFB703` | Highlights, warnings, gold medal |
| `spark-orange` | `#FB8500` | CTA buttons, streaks, branding |
| `spark-dark` | `#011826` | Page background |

**Fonts:** `Inter` (UI copy) · `Fira Code` (monospace labels, IDs, timers)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/RahulMachhirke/SparkQuest.git
cd SparkQuest

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output is generated in `dist/` — ready to deploy to any static host.

---

## 🗂️ Project Structure

```
src/
├── Admin/
│   ├── AdminDashboard.tsx    # Main admin panel with tabs
│   ├── AdminLogin.tsx        # PIN-protected admin gate
│   ├── QuestionBank.tsx      # Add/Edit/Delete quiz questions
│   ├── RoomController.tsx    # Launch/End/Reset rounds
│   ├── ScoreAdjuster.tsx     # Manual score overrides
│   └── TeamManager.tsx       # Add/Edit/Delete participant teams
├── Auth/
│   └── TeamLogin.tsx         # Participant team sign-in
├── Leaderboard/
│   └── LiveLeaderboard.tsx   # Real-time standings + CSV export
├── Lobby/
│   └── WaitingArena.tsx      # Pre-round holding room
├── Round1/
│   ├── QuestionCard.tsx      # MCQ/MSQ answer card
│   ├── QuizEngine.tsx        # Timer, scoring, submission logic
│   └── QuizResults.tsx       # Per-round score summary
├── Round2/
│   └── Round2Teaser.tsx      # Locked placeholder (coming soon)
├── lib/
│   ├── sound.ts              # Web Audio API sound engine
│   ├── store.ts              # Reactive state + BroadcastChannel sync
│   └── supabase.ts           # Supabase client + seed data
├── types/
│   └── index.ts              # Shared TypeScript interfaces
├── App.tsx                   # Root component + hash router
├── index.css                 # Tailwind directives + CSS variables
└── main.tsx                  # React entry point
```

---

## 🔐 Access & Credentials

### Participant Portal
```
URL:  https://sparkquest1.vercel.app/
```

| Team ID | Passcode |
|---|---|
| `team-01` through `team-10` | `team01` through `team10` |

### Admin Portal
> ⚠️ **This link is for organizers only. Do not share publicly.**

```
URL:  https://sparkquest1.vercel.app/admin
PIN:  sparkadmin2026
```

The admin portal is **completely hidden** from the participant site. There are no visible buttons or links pointing to it — it can only be reached by directly typing `/admin` in the browser address bar.

---

## ☁️ Deployment

The project is deployed on **Vercel** with automatic CI/CD from the `main` branch.

```bash
# Push to deploy automatically
git add .
git commit -m "your message"
git push origin main
```

Vercel is configured with an SPA rewrite rule (`vercel.json`) so all routes — including `/admin` — correctly serve the React app:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🔄 Real-Time Sync

The app supports two sync modes, automatically selected based on configuration:

| Mode | How | Use Case |
|---|---|---|
| **Local (default)** | `BroadcastChannel` API | Multiple browser tabs on the same device / same organizer machine |
| **Cloud** | Supabase Realtime | Multiple devices across the room (participants + admin + projector) |

### Setting up Supabase (Optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema from **Admin Dashboard → Supabase Sync → Copy SQL Script**
3. Add your credentials to `src/lib/supabase.ts`:
   ```ts
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

---

## 🗺️ Roadmap

- [x] Round 1 — Rapid Fire Quiz (MCQ + MSQ)
- [x] Admin Dashboard (Question Bank, Team Manager, Score Adjuster)
- [x] Live Leaderboard with CSV Export
- [x] Real-Time Multi-Tab Sync
- [ ] Round 2 — Bug Hunt *(coming soon)*
- [ ] Supabase Cloud Sync Setup
- [ ] Participant Result History
- [ ] Mobile PWA Support

---

## 👨‍💻 Built By

**Technospark Club** — Department of Information Technology  
Pimpri Chinchwad College of Engineering and Research (PCCOER), Ravet

---

<div align="center">

Made with ❤️ for Technospark 2026

</div>
