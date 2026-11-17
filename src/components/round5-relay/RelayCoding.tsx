import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Clock, 
  RotateCw, 
  Send, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  ShieldAlert, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { ROUND5_PROBLEMS } from '../../data/round5Problems';
import { useAuth } from '../../context/AuthContext';
import { useCompetition } from '../../context/CompetitionContext';
import { executeCodeSandbox, RunSummary } from '../../utils/codeRunner';
import { sound } from '../../utils/soundEffects';

export const RelayCoding: React.FC = () => {
  const { currentTeam } = useAuth();
  const { updateScore } = useCompetition();

  const problem = ROUND5_PROBLEMS[0];

  // 6 relay phases:
  // Phase 0: 10m Brainstorming
  // Phase 1: 5m Member 1
  // Phase 2: 5m Member 2
  // Phase 3: 5m Member 3
  // Phase 4: 5m Member 4
  // Phase 5: 10m All-Hands Collab
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(problem.phases[0].durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [handoverNotes, setHandoverNotes] = useState([
    {
      author: 'Aarav (Member 1)',
      time: 'Phase 1',
      text: 'Parsed inputs from lines 1-8. Return tuple of windows and max latency.'
    }
  ]);
  const [newNote, setNewNote] = useState('');
  const [runResult, setRunResult] = useState<RunSummary | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentPhase = problem.phases[currentPhaseIndex];

  // Map phase to active team member
  const members = currentTeam?.members || [
    { id: '1', name: 'Member 1' },
    { id: '2', name: 'Member 2' },
    { id: '3', name: 'Member 3' },
    { id: '4', name: 'Member 4' },
  ];

  const getActiveMemberName = () => {
    if (currentPhaseIndex === 0) return 'All Team Members (Brainstorming)';
    if (currentPhaseIndex >= 1 && currentPhaseIndex <= 4) {
      const memberIdx = (currentPhaseIndex - 1) % members.length;
      return members[memberIdx]?.name || `Member ${currentPhaseIndex}`;
    }
    return 'All Members (Collaborative Integration)';
  };

  // Phase Countdown Timer
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          handlePhaseTransition();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, currentPhaseIndex]);

  const handlePhaseTransition = () => {
    sound.playHandoff();
    if (currentPhaseIndex + 1 < problem.phases.length) {
      const nextIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIndex);
      setPhaseSecondsLeft(problem.phases[nextIndex].durationMinutes * 60);
    } else {
      setIsTimerRunning(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setHandoverNotes((prev) => [
      ...prev,
      {
        author: getActiveMemberName(),
        time: currentPhase.name,
        text: newNote.trim(),
      },
    ]);
    setNewNote('');
  };

  const handleRunTest = async () => {
    const publicTests = problem.testCases.filter((tc) => !tc.isHidden);
    const summary = await executeCodeSandbox(language, code, publicTests);
    setRunResult(summary);
    if (summary.verdict === 'Accepted') sound.playCorrect();
    else sound.playIncorrect();
  };

  const handleSubmit = async () => {
    const summary = await executeCodeSandbox(language, code, problem.testCases);
    setRunResult(summary);
    if (summary.verdict === 'Accepted') {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 70, colors: ['#FB8500', '#FFB703', '#219EBC'] });
      setIsSubmitted(true);
      if (currentTeam) {
        updateScore(currentTeam.id, 'round5Score', 300, 'auto');
      }
    } else {
      sound.playIncorrect();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Relay Ribbon Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#032537] via-[#023047] to-[#011826] border-2 border-[#FB8500]/50 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB8500] to-[#FFB703] flex items-center justify-center font-black text-[#023047] text-2xl shadow-lg">
              🏃
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Round 5: Relay Coding Arena</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FB8500]/20 text-[#FB8500] border border-[#FB8500]/40">
                  40 Mins Total
                </span>
              </div>
              <p className="text-xs text-[#8ECAE6]">
                Sequential teammate hand-offs + collaborative team completion
              </p>
            </div>
          </div>

          {/* Phase Countdown Card */}
          <div className="flex items-center gap-4 bg-[#011826] p-3 rounded-2xl border border-[#219EBC]/40 shadow-inner">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Current Phase Timer</p>
              <p className="text-2xl sm:text-3xl font-mono font-black text-[#FFB703]">
                {formatTimer(phaseSecondsLeft)}
              </p>
            </div>
            <button
              onClick={() => handlePhaseTransition()}
              className="p-2.5 rounded-xl bg-[#032537] hover:bg-[#219EBC] text-[#8ECAE6] hover:text-white border border-[#219EBC]/30 text-xs font-bold transition flex items-center gap-1.5"
              title="Next Phase Hand-off"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline">Hand Off</span>
            </button>
          </div>
        </div>

        {/* Phase Timeline Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {problem.phases.map((ph, idx) => {
            const isCurrent = currentPhaseIndex === idx;
            const isPast = currentPhaseIndex > idx;
            return (
              <div
                key={ph.name}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-[#219EBC] text-white border-white shadow-lg scale-105'
                    : isPast
                    ? 'bg-[#023047] text-slate-400 border-emerald-500/30'
                    : 'bg-[#011826]/60 text-slate-500 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Leg {idx + 1}</span>
                  <span>{ph.durationMinutes}m</span>
                </div>
                <p className="text-[11px] font-semibold truncate mt-0.5">{ph.name}</p>
              </div>
            );
          })}
        </div>

        {/* Active Coder Status Alert */}
        <div className="p-3.5 rounded-2xl bg-[#011826]/80 border border-[#FB8500]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300">Active Coder at Keyboard:</span>
            <span className="font-bold text-[#FFB703] text-sm">{getActiveMemberName()}</span>
          </div>
          <div className="text-[11px] text-[#8ECAE6] italic">
            "{currentPhase.description}"
          </div>
        </div>
      </div>

      {/* Main Workspace (Problem + Handover notes + Monaco Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Column: Problem Brief & Handover Scratchpad (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Problem Brief */}
          <div className="p-5 rounded-2xl bg-[#032537] border border-[#219EBC]/30 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-white">{problem.title}</h3>
            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
              {problem.description}
            </div>
            <div className="p-3 rounded-xl bg-[#011826] border border-[#219EBC]/20 font-mono text-xs space-y-1">
              <p className="text-[#8ECAE6] font-bold">Input Format:</p>
              <p className="text-slate-300">{problem.inputFormat}</p>
              <p className="text-[#8ECAE6] font-bold mt-2">Output Format:</p>
              <p className="text-emerald-400">{problem.outputFormat}</p>
            </div>
          </div>

          {/* Handover Notes Drawer */}
          <div className="p-5 rounded-2xl bg-[#032537] border border-[#219EBC]/30 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-[#FFB703]" />
              <span>Relay Handover Scratchpad</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Leave instructions, variable hints, or bugs for the next incoming teammate.
            </p>

            <div className="space-y-2 max-h-44 overflow-y-auto">
              {handoverNotes.map((note, nIdx) => (
                <div key={nIdx} className="p-2.5 rounded-xl bg-[#011826] border border-[#219EBC]/20 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-[#8ECAE6]">
                    <span className="font-bold text-[#FFB703]">{note.author}</span>
                    <span>{note.time}</span>
                  </div>
                  <p className="text-slate-200 mt-1">{note.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Write handover note for next teammate..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-[#011826] border border-[#219EBC]/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB703]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#219EBC] hover:bg-[#8ECAE6] text-white hover:text-[#023047] text-xs font-bold rounded-xl transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Code Editor & Execution (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#011826] border border-[#219EBC]/30 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-[#023047] border-b border-[#219EBC]/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Language:</span>
              <button
                onClick={() => {
                  setLanguage('javascript');
                  setCode(problem.starterCode.javascript);
                }}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  language === 'javascript' ? 'bg-[#219EBC] text-white' : 'text-slate-300'
                }`}
              >
                JavaScript
              </button>
              <button
                onClick={() => {
                  setLanguage('python');
                  setCode(problem.starterCode.python);
                }}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  language === 'python' ? 'bg-[#219EBC] text-white' : 'text-slate-300'
                }`}
              >
                Python
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunTest}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#032537] hover:bg-[#043b57] text-[#8ECAE6] border border-[#219EBC]/40 text-xs font-bold transition"
              >
                <Play className="w-3 h-3 text-emerald-400 fill-current" />
                <span>Run Tests</span>
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FB8500] to-[#FFB703] text-[#023047] text-xs font-black uppercase tracking-wider transition shadow-md hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Relay Solution</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[380px] bg-[#011826]">
            <Editor
              height="380px"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'Fira Code, monospace',
                lineNumbers: 'on',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Relay Console */}
          <div className="p-4 bg-[#023047] border-t border-[#219EBC]/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Relay Test Results</span>
              {runResult && (
                <span
                  className={`px-2 py-0.5 rounded font-black uppercase ${
                    runResult.verdict === 'Accepted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                      : 'bg-red-500/20 text-red-300 border border-red-500'
                  }`}
                >
                  {runResult.verdict} ({runResult.totalPassed} / {runResult.totalTests} Passed)
                </span>
              )}
            </div>

            {runResult ? (
              <div className="space-y-2 font-mono text-xs">
                {runResult.results.map((r, idx) => (
                  <div key={r.testCaseId} className="p-2 rounded bg-[#011826] border border-[#219EBC]/20 flex items-center justify-between">
                    <span className="text-slate-400">Test {idx + 1}: Input "{r.input.replace(/\n/g, ' ')}"</span>
                    <span className={r.passed ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {r.passed ? 'PASSED' : `FAILED (Got "${r.actualOutput}")`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Run tests to check whether the relay solution meets all criteria.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
