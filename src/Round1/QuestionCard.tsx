import React from 'react';
import { Question } from '../types';
import { Check, CheckSquare, Square as SquareIcon, AlertCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedIndices: number[];
  onToggleOption: (index: number) => void;
  onSubmitAnswer: () => void;
  hasSubmitted: boolean;
  timeLeft: number;
}

const OPTION_THEMES = [
  {
    symbol: '▲',
    name: 'Triangle',
    bg: 'bg-[#FB8500]',
    border: 'border-[#FB8500]',
    text: 'text-[#FB8500]',
    hoverBg: 'hover:bg-[#FB8500]/90',
    subtleBg: 'bg-[#FB8500]/15',
    subtleBorder: 'border-[#FB8500]/40'
  },
  {
    symbol: '◆',
    name: 'Diamond',
    bg: 'bg-[#219EBC]',
    border: 'border-[#219EBC]',
    text: 'text-[#219EBC]',
    hoverBg: 'hover:bg-[#219EBC]/90',
    subtleBg: 'bg-[#219EBC]/15',
    subtleBorder: 'border-[#219EBC]/40'
  },
  {
    symbol: '●',
    name: 'Circle',
    bg: 'bg-[#FFB703]',
    border: 'border-[#FFB703]',
    text: 'text-[#FFB703]',
    hoverBg: 'hover:bg-[#FFB703]/90',
    subtleBg: 'bg-[#FFB703]/15',
    subtleBorder: 'border-[#FFB703]/40'
  },
  {
    symbol: '■',
    name: 'Square',
    bg: 'bg-[#8ECAE6]',
    border: 'border-[#8ECAE6]',
    text: 'text-[#8ECAE6]',
    hoverBg: 'hover:bg-[#8ECAE6]/90',
    subtleBg: 'bg-[#8ECAE6]/15',
    subtleBorder: 'border-[#8ECAE6]/40'
  }
];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedIndices,
  onToggleOption,
  onSubmitAnswer,
  hasSubmitted,
  timeLeft
}) => {
  const isMSQ = question.type === 'multiple';

  return (
    <div className="space-y-6">
      {/* Question Prompt Box */}
      <div className="bg-[#023047]/95 border-2 border-[#219EBC]/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8ECAE6] px-3 py-1 rounded-full bg-[#011826] border border-[#219EBC]/30">
            {question.category || 'Logic & Computer Science'}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                isMSQ
                  ? 'bg-[#FFB703]/20 text-[#FFB703] border-[#FFB703]/40'
                  : 'bg-[#219EBC]/20 text-[#8ECAE6] border-[#219EBC]/40'
              }`}
            >
              {isMSQ ? 'MSQ • Multi-Select' : 'MCQ • Single Choice'}
            </span>
            <span className="text-xs font-mono text-slate-300">
              {question.points} pts
            </span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
          {question.question}
        </h3>

        {/* Code snippet if present */}
        {question.code && (
          <div className="mt-4 rounded-xl overflow-hidden border border-[#219EBC]/30 bg-[#011826] p-4 text-xs sm:text-sm font-mono text-[#8ECAE6] leading-relaxed overflow-x-auto shadow-inner">
            <pre className="whitespace-pre">{question.code}</pre>
          </div>
        )}

        {isMSQ && !hasSubmitted && (
          <div className="mt-4 flex items-center gap-2 text-xs text-[#FFB703] font-mono bg-[#FFB703]/10 border border-[#FFB703]/30 px-3 py-1.5 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Select ALL correct options below, then click the orange Submit Answer button.</span>
          </div>
        )}
      </div>

      {/* Tactile Kahoot Answer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((optionText, idx) => {
          const theme = OPTION_THEMES[idx % OPTION_THEMES.length];
          const isSelected = selectedIndices.includes(idx);
          const isCorrect = question.correct.includes(idx);

          // Reveal classes after submission
          let cardStyle = `${theme.subtleBg} ${theme.subtleBorder} hover:border-white/60`;
          let badgeBg = `${theme.bg} text-[#011826]`;

          if (hasSubmitted) {
            if (isCorrect) {
              cardStyle = 'bg-emerald-950/80 border-2 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400/30';
              badgeBg = 'bg-emerald-400 text-[#011826]';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'bg-rose-950/70 border-2 border-rose-500 text-rose-200 line-through opacity-70';
              badgeBg = 'bg-rose-500 text-white';
            } else {
              cardStyle = 'opacity-35 bg-[#011826] border-white/10';
            }
          } else if (isSelected) {
            cardStyle = 'bg-[#023047] border-2 border-[#FFB703] text-white shadow-xl ring-2 ring-[#FFB703]/40';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={hasSubmitted || timeLeft <= 0}
              onClick={() => onToggleOption(idx)}
              className={`p-5 rounded-2xl border transition-all text-left flex items-start gap-4 relative overflow-hidden group active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed ${cardStyle}`}
            >
              {/* Tactile Symbol Badge */}
              <div
                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-xl shadow-md transition-transform group-hover:scale-105 ${badgeBg}`}
              >
                {theme.symbol}
              </div>

              {/* Option Text */}
              <div className="flex-1 pt-1">
                <div className="text-sm sm:text-base font-semibold leading-snug">
                  {optionText}
                </div>
              </div>

              {/* Multi-Select Checkbox Indicator */}
              {isMSQ && !hasSubmitted && (
                <div className="flex-shrink-0 pt-1 text-slate-400 group-hover:text-white">
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-[#FFB703]" />
                  ) : (
                    <SquareIcon className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              )}

              {/* Submitted reveal checkmark */}
              {hasSubmitted && isCorrect && (
                <div className="flex-shrink-0 pt-1 text-emerald-400 font-bold">
                  <Check className="w-6 h-6" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* MSQ Submit Button or Instructions */}
      {isMSQ && !hasSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onSubmitAnswer}
            disabled={selectedIndices.length === 0}
            className={`px-8 py-3.5 rounded-xl font-bold font-mono uppercase tracking-wider text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
              selectedIndices.length > 0
                ? 'bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-[#011826] hover:scale-105'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 cursor-not-allowed'
            }`}
          >
            <span>Submit {selectedIndices.length} Selected Answer{selectedIndices.length > 1 ? 's' : ''}</span>
          </button>
        </div>
      )}

      {/* Explanation when submitted */}
      {hasSubmitted && question.explanation && (
        <div className="p-4 rounded-xl bg-[#023047] border border-[#219EBC]/40 text-xs sm:text-sm text-slate-200 space-y-1 animate-fadeIn">
          <div className="font-bold text-[#FFB703] font-mono text-xs uppercase tracking-wider">
            Logic Explanation:
          </div>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
