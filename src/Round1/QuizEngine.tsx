import React, { useState, useEffect, useRef } from 'react';
import { Question, Team } from '../types';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';
import { soundEngine } from '../lib/sound';
import { Clock, Flame, Zap, Trophy, LogOut } from 'lucide-react';

interface QuizEngineProps {
  questions: Question[];
  currentTeam: Team;
  onRecordScore: (teamId: string, score: number, timeTakenSec: number) => void;
  onViewLeaderboard: () => void;
  onViewRound2: () => void;
  onLogout: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  currentTeam,
  onRecordScore,
  onViewLeaderboard,
  onViewRound2,
  onLogout
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(questions[0]?.timeLimitSec || 20);
  const [isFinished, setIsFinished] = useState(false);

  // Scoring & Stats
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  const timerRef = useRef<any>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  // Initialize or reset timer on question index change
  useEffect(() => {
    if (!currentQ || isFinished) return;

    setTimeLeft(currentQ.timeLimitSec);
    setSelectedIndices([]);
    setHasSubmitted(false);
    questionStartTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpire();
          return 0;
        }
        if (prev <= 5) {
          soundEngine.tick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isFinished, questions]);

  // Handle single option toggle vs multi-option toggle
  const handleToggleOption = (optionIndex: number) => {
    if (hasSubmitted || timeLeft <= 0) return;

    if (currentQ.type === 'single') {
      // In single choice (Kahoot style), clicking immediately locks & evaluates
      setSelectedIndices([optionIndex]);
      evaluateSubmission([optionIndex]);
    } else {
      // MSQ toggle
      setSelectedIndices((prev) =>
        prev.includes(optionIndex)
          ? prev.filter((i) => i !== optionIndex)
          : [...prev, optionIndex].sort()
      );
    }
  };

  // MSQ Manual submit
  const handleManualSubmit = () => {
    if (hasSubmitted || selectedIndices.length === 0) return;
    evaluateSubmission(selectedIndices);
  };

  // When timer runs out
  const handleTimeExpire = () => {
    if (hasSubmitted) return;
    evaluateSubmission(selectedIndices, true);
  };

  // Submission evaluator
  const evaluateSubmission = (chosen: number[], timedOut: boolean = false) => {
    if (hasSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setHasSubmitted(true);
    const duration = (Date.now() - questionStartTimeRef.current) / 1000;
    setTotalTimeTaken((prev) => prev + duration);

    // Check correctness
    const correctArr = [...currentQ.correct].sort();
    const chosenArr = [...chosen].sort();
    const isCorrect =
      !timedOut &&
      chosenArr.length === correctArr.length &&
      chosenArr.every((val, idx) => val === correctArr[idx]);

    if (isCorrect) {
      soundEngine.correct();
      const timeLimit = currentQ.timeLimitSec;
      const speedRatio = Math.max(0.1, timeLeft / timeLimit);
      // Speed formula: minimum 500 base + 500 * speedRatio
      const pointsEarned = Math.round(currentQ.points * (0.5 + 0.5 * speedRatio));
      
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      setMaxStreak((prev) => Math.max(prev, nextStreak));
      const streakBonus = nextStreak > 1 ? (nextStreak - 1) * 50 : 0;
      
      const newTotal = accumulatedScore + pointsEarned + streakBonus;
      setAccumulatedScore(newTotal);
      setCorrectCount((prev) => prev + 1);
    } else {
      soundEngine.wrong();
      setCurrentStreak(0);
    }

    // Auto-advance after 2.8 seconds so participant sees explanation & correct answers
    setTimeout(() => {
      advanceNextQuestion();
    }, 2800);
  };

  const advanceNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished all questions!
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    soundEngine.roundEnd();
    onRecordScore(currentTeam.id, accumulatedScore, totalTimeTaken);
  };

  if (!currentQ && !isFinished) {
    return (
      <div className="text-center py-20 text-white">
        <p className="text-lg">No questions available in Question Bank.</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <QuizResults
        team={{
          ...currentTeam,
          round1Score: accumulatedScore,
          totalScore: accumulatedScore + (currentTeam.manualAdjustment || 0)
        }}
        totalQuestions={totalQuestions}
        correctCount={correctCount}
        timeTakenSec={totalTimeTaken}
        streakPeak={maxStreak}
        onViewLeaderboard={onViewLeaderboard}
        onViewRound2={onViewRound2}
      />
    );
  }

  // Timer Bar calculation
  const timerPct = (timeLeft / (currentQ.timeLimitSec || 20)) * 100;
  const timerColor =
    timerPct > 50
      ? 'bg-[#219EBC]'
      : timerPct > 25
      ? 'bg-[#FFB703]'
      : 'bg-[#FB8500] animate-pulse';

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Quiz Header / Status HUD */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/40 rounded-2xl p-4 backdrop-blur-md shadow-lg flex items-center justify-between gap-4">
        {/* Team Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#011826] border border-[#219EBC]/40 flex items-center justify-center text-xl">
            {currentTeam.avatar}
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <span>{currentTeam.name}</span>
              <span className="text-slate-400 font-normal">({currentTeam.id})</span>
            </div>
            <div className="text-[11px] font-mono text-[#8ECAE6]">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
          </div>
        </div>

        {/* Live Score & Streak */}
        <div className="flex items-center gap-4">
          {currentStreak > 1 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FB8500]/20 border border-[#FB8500]/50 text-[#FB8500] text-xs font-mono font-bold animate-bounce">
              <Flame className="w-4 h-4 fill-[#FB8500]" />
              <span>{currentStreak}x STREAK</span>
            </div>
          )}

          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Points
            </div>
            <div className="text-xl font-black text-[#FFB703] font-mono leading-none">
              {accumulatedScore.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Speed Timer Countdown Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FFB703]" />
            Time Remaining
          </span>
          <span className={`text-sm ${timeLeft <= 5 ? 'text-[#FB8500] font-black animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full h-3 bg-[#011826] rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${timerColor}`}
            style={{ width: `${timerPct}%` }}
          ></div>
        </div>
      </div>

      {/* Interactive Question Card */}
      <QuestionCard
        question={currentQ}
        selectedIndices={selectedIndices}
        onToggleOption={handleToggleOption}
        onSubmitAnswer={handleManualSubmit}
        hasSubmitted={hasSubmitted}
        timeLeft={timeLeft}
      />
    </div>
  );
};
