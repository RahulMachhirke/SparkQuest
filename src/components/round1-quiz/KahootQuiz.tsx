import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Timer, 
  Award, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { ROUND1_QUESTIONS } from '../../data/round1Questions';
import { useAuth } from '../../context/AuthContext';
import { useCompetition } from '../../context/CompetitionContext';
import { sound } from '../../utils/soundEffects';

interface KahootQuizProps {
  onFinish?: () => void;
}

export const KahootQuiz: React.FC<KahootQuizProps> = ({ onFinish }) => {
  const { currentTeam } = useAuth();
  const { updateScore } = useCompetition();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answersRecord, setAnswersRecord] = useState<{ isCorrect: boolean; pointsEarned: number }[]>([]);

  const currentQuestion = ROUND1_QUESTIONS[currentIndex];

  // Kahoot button color schemes matching our palette
  const optionThemes = [
    { bg: 'bg-[#FB8500]', hover: 'hover:bg-[#e07500]', border: 'border-[#FB8500]', symbol: '▲', label: 'Option A' },
    { bg: 'bg-[#219EBC]', hover: 'hover:bg-[#1a859f]', border: 'border-[#219EBC]', symbol: '◆', label: 'Option B' },
    { bg: 'bg-[#FFB703]', hover: 'hover:bg-[#e6a500]', border: 'border-[#FFB703]', symbol: '●', label: 'Option C', text: 'text-[#023047]' },
    { bg: 'bg-[#8ECAE6]', hover: 'hover:bg-[#72b7d4]', border: 'border-[#8ECAE6]', symbol: '■', label: 'Option D', text: 'text-[#023047]' },
  ];

  // Reset timer on new question
  useEffect(() => {
    if (!isCompleted && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimitSec);
      setHasAnswered(false);
      setSelectedOption(null);
    }
  }, [currentIndex, isCompleted, currentQuestion]);

  // Countdown timer
  useEffect(() => {
    if (isCompleted || hasAnswered) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 4 && prev > 0) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted, hasAnswered]);

  const handleTimeout = () => {
    setHasAnswered(true);
    setSelectedOption(-1);
    setStreak(0);
    sound.playIncorrect();
    setAnswersRecord((prev) => [...prev, { isCorrect: false, pointsEarned: 0 }]);
  };

  const handleAnswerSelect = (index: number) => {
    if (hasAnswered) return;

    setHasAnswered(true);
    setSelectedOption(index);

    const isCorrect = index === currentQuestion.correctIndex;

    if (isCorrect) {
      // Calculate Kahoot speed-based points
      // Max 1000 base points for instant answer + streak bonus
      const timeRatio = timeLeft / currentQuestion.timeLimitSec;
      const speedPoints = Math.round(500 + 500 * timeRatio);
      const streakBonus = streak * 50;
      const totalEarned = speedPoints + streakBonus;

      setScore((s) => s + totalEarned);
      setStreak((st) => st + 1);
      sound.playCorrect();

      setAnswersRecord((prev) => [...prev, { isCorrect: true, pointsEarned: totalEarned }]);
    } else {
      setStreak(0);
      sound.playIncorrect();
      setAnswersRecord((prev) => [...prev, { isCorrect: false, pointsEarned: 0 }]);
    }
  };

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < ROUND1_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Quiz Finished!
      setIsCompleted(true);
      sound.playFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8ECAE6', '#219EBC', '#FFB703', '#FB8500'],
      });

      // Automatically update the team's score in the Live Leaderboard!
      if (currentTeam) {
        updateScore(currentTeam.id, 'round1Score', score, 'auto');
      }
    }
  }, [currentIndex, currentTeam, score, updateScore]);

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setAnswersRecord([]);
    setIsCompleted(false);
    setHasAnswered(false);
  };

  if (isCompleted) {
    const totalQuestions = ROUND1_QUESTIONS.length;
    const correctCount = answersRecord.filter((a) => a.isCorrect).length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-8 animate-fade-in">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#032537] to-[#023047] border-2 border-[#FFB703] shadow-2xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#FFB703] to-[#FB8500] flex items-center justify-center text-4xl shadow-xl">
            🏆
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#FFB703]">
              Round 1: Rapid Fire Concluded
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">Quiz Completed!</h2>
            <p className="text-sm text-slate-300 mt-2">
              Outstanding effort, <span className="font-bold text-[#8ECAE6]">{currentTeam?.name || 'Participant Team'}</span>!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#011826]/80 border border-[#219EBC]/40 max-w-md mx-auto">
            <p className="text-xs text-[#8ECAE6] uppercase font-bold tracking-wider">Final Rapid-Fire Score</p>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFB703] to-[#FB8500] my-2">
              {score.toLocaleString()} <span className="text-xl font-bold text-slate-300">pts</span>
            </p>
            <div className="flex justify-around items-center pt-3 border-t border-[#219EBC]/20 text-xs">
              <div>
                <p className="text-slate-400">Correct</p>
                <p className="text-base font-bold text-emerald-400">{correctCount} / {totalQuestions}</p>
              </div>
              <div className="h-6 w-px bg-slate-700" />
              <div>
                <p className="text-slate-400">Accuracy</p>
                <p className="text-base font-bold text-[#8ECAE6]">{accuracy}%</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#023047] border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Score has been automatically synced to the Live Leaderboard!</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#032537] hover:bg-[#043b57] text-slate-200 border border-[#219EBC]/30 text-xs font-bold transition"
            >
              <RotateCcw className="w-4 h-4 text-[#8ECAE6]" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => onFinish?.()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#219EBC] to-[#8ECAE6] hover:from-[#8ECAE6] hover:to-[#219EBC] text-[#023047] text-xs font-black uppercase tracking-wider transition shadow-lg"
            >
              <Trophy className="w-4 h-4" />
              <span>View Leaderboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isTimerCritical = timeLeft <= 5;
  const timerPercent = (timeLeft / currentQuestion.timeLimitSec) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#023047]/90 border border-[#219EBC]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#032537] border border-[#8ECAE6]/30 flex items-center justify-center font-bold text-xs text-[#8ECAE6]">
            {currentIndex + 1}
          </span>
          <div>
            <span className="text-xs text-slate-400">Question {currentIndex + 1} of {ROUND1_QUESTIONS.length}</span>
            <p className="text-xs font-bold text-[#8ECAE6]">{currentQuestion.category}</p>
          </div>
        </div>

        {/* Streak Counter */}
        {streak > 1 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB8500]/20 border border-[#FB8500]/50 text-[#FB8500] font-black text-xs animate-bounce">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{streak} STREAK COMBO!</span>
          </div>
        )}

        {/* Current Score */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FFB703]" />
          <span className="font-mono font-black text-lg text-white">{score.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 uppercase">pts</span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="relative w-full h-3 bg-[#011826] rounded-full overflow-hidden border border-[#219EBC]/30">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            isTimerCritical ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-[#219EBC] to-[#FFB703]'
          }`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="relative rounded-3xl bg-[#032537] border-2 border-[#219EBC]/40 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        {/* Floating Timer Circle */}
        <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#023047] border border-[#219EBC]/50 font-mono text-sm font-bold text-white shadow-md">
          <Timer className={`w-4 h-4 ${isTimerCritical ? 'text-red-400 animate-spin' : 'text-[#FFB703]'}`} />
          <span className={isTimerCritical ? 'text-red-400 font-extrabold text-base' : ''}>{timeLeft}s remaining</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug max-w-2xl mx-auto">
          {currentQuestion.question}
        </h3>

        {/* Optional Code Snippet */}
        {currentQuestion.codeSnippet && (
          <div className="text-left max-w-xl mx-auto p-4 rounded-xl bg-[#011826] border border-[#219EBC]/40 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto shadow-inner">
            <pre className="whitespace-pre">{currentQuestion.codeSnippet}</pre>
          </div>
        )}
      </div>

      {/* Answer Options Grid (Kahoot 4-Grid Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, idx) => {
          const theme = optionThemes[idx];
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQuestion.correctIndex;

          let cardStyle = `${theme.bg} ${theme.hover} ${theme.text || 'text-white'}`;
          let borderOverlay = '';

          if (hasAnswered) {
            if (isCorrect) {
              cardStyle = 'bg-emerald-600 text-white';
              borderOverlay = 'ring-4 ring-emerald-300';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'bg-red-600 text-white';
              borderOverlay = 'ring-4 ring-red-300';
            } else {
              cardStyle = 'bg-[#032537]/50 text-slate-500 border-slate-700 opacity-40';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              disabled={hasAnswered}
              className={`relative min-h-[90px] p-5 rounded-2xl font-bold text-left text-base sm:text-lg flex items-center gap-4 transition-all transform shadow-xl active:scale-95 ${cardStyle} ${borderOverlay} ${
                !hasAnswered ? 'hover:scale-[1.02]' : ''
              }`}
            >
              {/* Geometric Kahoot Icon */}
              <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center font-black text-xl flex-shrink-0">
                {theme.symbol}
              </div>

              <div className="flex-1 leading-snug">
                <span>{option}</span>
              </div>

              {/* Status indicator badge after answering */}
              {hasAnswered && isCorrect && (
                <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
              )}
              {hasAnswered && isSelected && !isCorrect && (
                <XCircle className="w-6 h-6 text-white flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next Button Drawer */}
      {hasAnswered && (
        <div className="p-5 rounded-2xl bg-[#023047] border border-[#219EBC]/40 shadow-xl space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {selectedOption === currentQuestion.correctIndex ? (
                <div className="flex items-center gap-2 text-emerald-400 font-black text-lg">
                  <CheckCircle className="w-6 h-6" />
                  <span>Correct Answer!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400 font-black text-lg">
                  <XCircle className="w-6 h-6" />
                  <span>{selectedOption === -1 ? 'Time Expired!' : 'Incorrect Choice'}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFB703] to-[#FB8500] hover:from-[#FB8500] hover:to-[#FFB703] text-[#023047] font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 transition"
            >
              <span>{currentIndex + 1 < ROUND1_QUESTIONS.length ? 'Next Question' : 'View Final Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {currentQuestion.explanation && (
            <div className="p-3.5 rounded-xl bg-[#011826]/70 border border-[#8ECAE6]/20 text-xs text-slate-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#8ECAE6] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#8ECAE6]">Explanation: </strong>{currentQuestion.explanation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
