import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Send, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Lightbulb, 
  Code, 
  FileCode, 
  Clock, 
  Award,
  ChevronRight,
  Terminal as TerminalIcon,
  HelpCircle
} from 'lucide-react';
import { ROUND2_PROBLEMS } from '../../data/round2Problems';
import { useAuth } from '../../context/AuthContext';
import { useCompetition } from '../../context/CompetitionContext';
import { executeCodeSandbox, RunSummary } from '../../utils/codeRunner';
import { sound } from '../../utils/soundEffects';

interface CodePlaygroundProps {
  onLeaderboardClick?: () => void;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({ onLeaderboardClick }) => {
  const { currentTeam } = useAuth();
  const { updateScore } = useCompetition();

  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [showHints, setShowHints] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState<Record<string, boolean>>({});

  const currentProblem = ROUND2_PROBLEMS[activeProblemIndex];

  // Code state per problem and per language
  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    ROUND2_PROBLEMS.forEach((p) => {
      initial[`${p.id}_javascript`] = p.buggyCode.javascript;
      initial[`${p.id}_python`] = p.buggyCode.python;
    });
    return initial;
  });

  const [runResult, setRunResult] = useState<RunSummary | null>(null);

  const currentCode = codeMap[`${currentProblem.id}_${language}`] || '';

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode === undefined) return;
    setCodeMap((prev) => ({
      ...prev,
      [`${currentProblem.id}_${language}`]: newCode,
    }));
  };

  const handleResetCode = () => {
    const defaultBuggy = currentProblem.buggyCode[language];
    setCodeMap((prev) => ({
      ...prev,
      [`${currentProblem.id}_${language}`]: defaultBuggy,
    }));
    setRunResult(null);
  };

  // Run sample tests only (public test cases)
  const handleRunSampleTests = async () => {
    setIsRunning(true);
    setRunResult(null);

    const publicTests = currentProblem.testCases.filter((tc) => !tc.isHidden);
    const summary = await executeCodeSandbox(language, currentCode, publicTests);

    setIsRunning(false);
    setRunResult(summary);
    setActiveTestTab(0);

    if (summary.verdict === 'Accepted') {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
  };

  // Submit against ALL test cases (public + hidden)
  const handleSubmitSolution = async () => {
    setIsRunning(true);
    setRunResult(null);

    const summary = await executeCodeSandbox(language, currentCode, currentProblem.testCases);
    setIsRunning(false);
    setRunResult(summary);
    setActiveTestTab(0);

    if (summary.verdict === 'Accepted') {
      sound.playFanfare();
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#219EBC', '#8ECAE6', '#FFB703', '#FB8500'],
      });

      const updatedSolved = { ...solvedProblems, [currentProblem.id]: true };
      setSolvedProblems(updatedSolved);

      // Award 100 points per problem solved (up to 300 pts)
      const totalProblemsSolved = Object.values(updatedSolved).filter(Boolean).length;
      const newRound2Score = totalProblemsSolved * 100;

      if (currentTeam) {
        updateScore(currentTeam.id, 'round2Score', newRound2Score, 'auto');
      }
    } else {
      sound.playIncorrect();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Problem Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#023047] border border-[#219EBC]/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#219EBC]/20 border border-[#219EBC]/50 flex items-center justify-center text-[#219EBC]">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Round 2: Bug Hunt</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#219EBC]/20 text-[#8ECAE6] border border-[#219EBC]/40">
                LeetCode / HackerRank Environment
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Debug intentional errors across problems. All test cases must pass for acceptance.
            </p>
          </div>
        </div>

        {/* Problem Select Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {ROUND2_PROBLEMS.map((prob, idx) => {
            const isSelected = activeProblemIndex === idx;
            const isSolved = solvedProblems[prob.id];
            return (
              <button
                key={prob.id}
                onClick={() => {
                  setActiveProblemIndex(idx);
                  setRunResult(null);
                  setActiveTestTab(0);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#219EBC] text-white shadow-md'
                    : 'bg-[#032537] text-slate-300 hover:text-white border border-[#219EBC]/30'
                }`}
              >
                {isSolved ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#FFB703]"></span>
                )}
                <span>Bug {idx + 1}</span>
                {isSolved && <span className="text-[10px] text-emerald-300 font-normal">Passed</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Pane (Problem Description on Left, IDE on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Pane: Problem Description (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#032537] border border-[#219EBC]/30 shadow-xl overflow-hidden">
          {/* Problem Header */}
          <div className="p-5 border-b border-[#219EBC]/20 bg-[#023047] space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                currentProblem.difficulty === 'Easy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : currentProblem.difficulty === 'Medium'
                  ? 'bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/40'
                  : 'bg-[#FB8500]/20 text-[#FB8500] border border-[#FB8500]/40'
              }`}>
                {currentProblem.difficulty}
              </span>
              <span className="text-xs font-mono font-bold text-[#FFB703] flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {currentProblem.maxPoints} pts
              </span>
            </div>
            <h3 className="text-xl font-black text-white">{currentProblem.title}</h3>
            <div className="flex items-center gap-2 text-[11px] text-[#8ECAE6]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FB8500]" />
              <span>Bug Category: <strong>{currentProblem.bugType}</strong></span>
            </div>
          </div>

          {/* Problem Body */}
          <div className="p-5 space-y-5 overflow-y-auto max-h-[500px] text-slate-200 text-xs sm:text-sm leading-relaxed">
            <div className="whitespace-pre-line prose-invert">{currentProblem.description}</div>

            {/* Collapsible Hints */}
            <div className="pt-2">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 text-xs font-bold text-[#FFB703] hover:text-[#fb8500] transition"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHints ? 'Hide Debug Hints' : 'View Debug Clues & Hints'}</span>
              </button>

              {showHints && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#011826] border border-[#FFB703]/30 space-y-2 animate-fade-in text-xs text-slate-300">
                  {currentProblem.hints.map((hint, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2">
                      <span className="text-[#FFB703] font-bold">•</span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sample Test Case Previews */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8ECAE6]">Sample Test Cases</h4>
              {currentProblem.testCases.filter((tc) => !tc.isHidden).map((tc, tcIdx) => (
                <div key={tc.id} className="p-3 rounded-xl bg-[#011826] border border-[#219EBC]/20 font-mono text-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-bold">Case {tcIdx + 1}:</div>
                  <div>
                    <span className="text-slate-400">Input: </span>
                    <span className="text-white bg-[#023047] px-1.5 py-0.5 rounded">{tc.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Expected Output: </span>
                    <span className="text-emerald-400 font-bold">{tc.expectedOutput}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor + Runner (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#011826] border border-[#219EBC]/30 shadow-xl overflow-hidden">
          {/* Editor Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#023047] border-b border-[#219EBC]/30">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Language:</span>
              <div className="flex items-center rounded-lg bg-[#011826] p-1 border border-[#219EBC]/30 text-xs">
                <button
                  onClick={() => setLanguage('javascript')}
                  className={`px-3 py-1 rounded font-bold transition ${
                    language === 'javascript' ? 'bg-[#219EBC] text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setLanguage('python')}
                  className={`px-3 py-1 rounded font-bold transition ${
                    language === 'python' ? 'bg-[#219EBC] text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Python
                </button>
              </div>
            </div>

            {/* Editor Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                title="Reset to default buggy snippet"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#032537] hover:bg-[#043b57] text-slate-300 text-xs border border-slate-700 hover:border-slate-500 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Bug</span>
              </button>

              <button
                onClick={handleRunSampleTests}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#023047] hover:bg-[#032537] text-[#8ECAE6] hover:text-white border border-[#219EBC] text-xs font-bold transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
              </button>

              <button
                onClick={handleSubmitSolution}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#219EBC] to-[#8ECAE6] hover:from-[#8ECAE6] hover:to-[#219EBC] text-[#023047] text-xs font-black uppercase tracking-wider transition shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[380px] bg-[#011826]">
            <Editor
              height="380px"
              language={language}
              theme="vs-dark"
              value={currentCode}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'Fira Code, monospace',
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                tabSize: 4,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Bottom Execution Console Drawer */}
          <div className="border-t border-[#219EBC]/30 bg-[#023047]/95 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <TerminalIcon className="w-4 h-4 text-[#8ECAE6]" />
                <span>Test Console Results</span>
              </div>

              {runResult && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      runResult.verdict === 'Accepted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : runResult.verdict === 'Wrong Answer'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : 'bg-[#FB8500]/20 text-[#FB8500] border border-[#FB8500]/50'
                    }`}
                  >
                    {runResult.verdict}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    ({runResult.totalPassed} / {runResult.totalTests} Passed)
                  </span>
                </div>
              )}
            </div>

            {/* Console Content */}
            {runResult ? (
              <div className="space-y-3">
                {/* Test case tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {runResult.results.map((r, idx) => (
                    <button
                      key={r.testCaseId}
                      onClick={() => setActiveTestTab(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
                        activeTestTab === idx
                          ? 'bg-[#219EBC] text-white font-bold'
                          : 'bg-[#011826] text-slate-300 hover:text-white border border-[#219EBC]/20'
                      }`}
                    >
                      {r.passed ? (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-400" />
                      )}
                      <span>Case {idx + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Active Test Case Detail */}
                {runResult.results[activeTestTab] && (
                  <div className="p-3.5 rounded-xl bg-[#011826] border border-[#219EBC]/30 font-mono text-xs space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] text-slate-400">Input:</p>
                        <p className="p-1.5 mt-0.5 rounded bg-[#023047] text-slate-200 whitespace-pre">
                          {runResult.results[activeTestTab].input}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">Expected Output:</p>
                        <p className="p-1.5 mt-0.5 rounded bg-[#023047] text-emerald-400 whitespace-pre font-bold">
                          {runResult.results[activeTestTab].expectedOutput}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Actual Output / Stderr:</p>
                      <p
                        className={`p-1.5 mt-0.5 rounded whitespace-pre ${
                          runResult.results[activeTestTab].passed
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950/40 text-red-300 border border-red-800'
                        }`}
                      >
                        {runResult.results[activeTestTab].actualOutput}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#011826]/70 border border-[#219EBC]/20 text-center text-xs text-slate-400">
                Hit <strong className="text-[#8ECAE6]">Run Tests</strong> to verify against sample inputs, or{' '}
                <strong className="text-[#FFB703]">Submit Solution</strong> to evaluate all test cases and claim points.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
