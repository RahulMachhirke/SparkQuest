import React, { useState } from 'react';
import { Question, QuestionType } from '../types';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  RotateCcw, 
  Check, 
  CheckSquare, 
  Square as SquareIcon, 
  Code, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { soundEngine } from '../lib/sound';

interface QuestionBankProps {
  questions: Question[];
  onAddQuestion: (q: Omit<Question, 'id'>) => void;
  onEditQuestion: (id: string, updated: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onResetToDefault: () => void;
}

const OPTION_SYMBOLS = ['▲', '◆', '●', '■'];
const OPTION_COLORS = ['#FB8500', '#219EBC', '#FFB703', '#8ECAE6'];

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onResetToDefault
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [questionText, setQuestionText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [category, setCategory] = useState('Data Structures & Algorithms');
  const [qType, setQType] = useState<QuestionType>('single');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctIndices, setCorrectIndices] = useState<number[]>([0]);
  const [timeLimitSec, setTimeLimitSec] = useState<number>(20);
  const [points, setPoints] = useState<number>(1000);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');

  const openAddForm = () => {
    setEditingId(null);
    setQuestionText('');
    setCodeText('');
    setCategory('Data Structures & Algorithms');
    setQType('single');
    setOptions(['', '', '', '']);
    setCorrectIndices([0]);
    setTimeLimitSec(20);
    setPoints(1000);
    setExplanation('');
    setError('');
    setIsFormOpen(true);
  };

  const openEditForm = (q: Question) => {
    setEditingId(q.id);
    setQuestionText(q.question);
    setCodeText(q.code || '');
    setCategory(q.category || 'Data Structures & Algorithms');
    setQType(q.type);
    setOptions([...q.options]);
    setCorrectIndices([...q.correct]);
    setTimeLimitSec(q.timeLimitSec);
    setPoints(q.points);
    setExplanation(q.explanation || '');
    setError('');
    setIsFormOpen(true);
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleToggleCorrect = (idx: number) => {
    if (qType === 'single') {
      setCorrectIndices([idx]);
    } else {
      setCorrectIndices((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx].sort()
      );
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setError('Please provide question text.');
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      setError('Please fill in all 4 options.');
      return;
    }
    if (correctIndices.length === 0) {
      setError('Please mark at least one option as correct.');
      return;
    }

    const payload = {
      type: qType,
      category: category.trim(),
      question: questionText.trim(),
      code: codeText.trim() ? codeText : undefined,
      options: options.map((o) => o.trim()),
      correct: correctIndices,
      timeLimitSec: Number(timeLimitSec) || 20,
      points: Number(points) || 1000,
      explanation: explanation.trim() ? explanation.trim() : undefined
    };

    if (editingId) {
      onEditQuestion(editingId, payload);
    } else {
      onAddQuestion(payload);
    }

    soundEngine.correct();
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this question from Question Bank?')) {
      onDeleteQuestion(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-[#023047]/90 border border-[#219EBC]/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>Dynamic Question Bank</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/40">
              {questions.length} Questions
            </span>
          </h3>
          <p className="text-xs text-slate-300">
            Create, edit, and organize MCQ and MSQ questions. Any updates are immediately reflected live in the participant arena.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddForm}
            className="px-4 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-[#011826] hover:scale-105 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Question</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset Question Bank to default competition questions?')) {
                onResetToDefault();
              }
            }}
            className="px-3.5 py-2.5 rounded-xl font-mono text-xs text-slate-300 hover:text-white bg-[#011826] border border-white/10 flex items-center gap-1.5 cursor-pointer"
            title="Reset to default seed questions"
          >
            <RotateCcw className="w-4 h-4 text-[#8ECAE6]" />
            <span>Default Seeds</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Question Modal Form */}
      {isFormOpen && (
        <div className="bg-[#023047] border-2 border-[#FFB703] rounded-2xl p-6 shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FFB703]" />
              {editingId ? 'Edit Existing Question' : 'Create New Competition Question'}
            </h4>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Question Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1.5">
                  Question Format / Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQType('single');
                      if (correctIndices.length > 1) setCorrectIndices([correctIndices[0]]);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl border font-bold font-mono text-xs transition-all cursor-pointer ${
                      qType === 'single'
                        ? 'bg-[#219EBC] text-[#011826] border-[#8ECAE6]'
                        : 'bg-[#011826] text-slate-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    MCQ (Single Choice)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQType('multiple')}
                    className={`flex-1 py-2.5 px-3 rounded-xl border font-bold font-mono text-xs transition-all cursor-pointer ${
                      qType === 'multiple'
                        ? 'bg-[#FFB703] text-[#011826] border-[#FFB703]'
                        : 'bg-[#011826] text-slate-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    MSQ (Multiple Choice)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1.5">
                  Category / Subject Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. C Memory / DSA / Web Protocols"
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFB703]"
                />
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1.5">
                Question Statement
              </label>
              <textarea
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type the full problem statement here..."
                className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#FFB703]"
              />
            </div>

            {/* Optional Code Snippet */}
            <div>
              <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1.5 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#FFB703]" />
                Code Snippet (Optional)
              </label>
              <textarea
                rows={3}
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                placeholder="int a = 10; printf(&quot;%d&quot;, a);"
                className="w-full bg-[#011826] font-mono border border-[#219EBC]/40 rounded-xl p-3 text-[#8ECAE6] text-xs focus:outline-none focus:border-[#FFB703]"
              />
            </div>

            {/* 4 Options and Correct Answer Marking */}
            <div>
              <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-2">
                4 Answer Options (Click icon to mark correct answer{qType === 'multiple' ? 's' : ''})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((opt, idx) => {
                  const isCorrect = correctIndices.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                        isCorrect
                          ? 'bg-emerald-950/60 border-emerald-400'
                          : 'bg-[#011826] border-white/10'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleCorrect(idx)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base flex-shrink-0 cursor-pointer shadow-md transition-transform active:scale-90 ${
                          isCorrect
                            ? 'bg-emerald-400 text-[#011826]'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                        title="Click to toggle as correct answer"
                      >
                        {OPTION_SYMBOLS[idx]}
                      </button>

                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-transparent text-white text-xs focus:outline-none px-2 py-1"
                      />

                      <button
                        type="button"
                        onClick={() => handleToggleCorrect(idx)}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-slate-600"></div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time & Points & Explanation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1">
                  Time Limit (Seconds)
                </label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={timeLimitSec}
                  onChange={(e) => setTimeLimitSec(Number(e.target.value))}
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1">
                  Base Points
                </label>
                <input
                  type="number"
                  min={100}
                  max={5000}
                  step={100}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-[#8ECAE6] font-semibold mb-1">
                  Explanation Note
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Brief reason for correct choice"
                  className="w-full bg-[#011826] border border-[#219EBC]/40 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            {/* Submit & Cancel */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl font-mono text-slate-300 hover:text-white bg-[#011826] border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-[#011826] hover:scale-105 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Question to Bank</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions Listing */}
      <div className="space-y-4">
        {questions.map((q, qIndex) => (
          <div
            key={q.id}
            className="bg-[#023047]/80 border border-[#219EBC]/30 rounded-2xl p-5 hover:border-[#219EBC]/60 transition-all space-y-4 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#011826] border border-[#219EBC]/40 flex items-center justify-center font-mono font-bold text-xs text-[#FFB703]">
                  #{qIndex + 1}
                </span>
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {q.category}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    q.type === 'multiple'
                      ? 'bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/40'
                      : 'bg-[#219EBC]/20 text-[#8ECAE6] border border-[#219EBC]/40'
                  }`}
                >
                  {q.type === 'multiple' ? 'MSQ' : 'MCQ'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">
                  ⏱️ {q.timeLimitSec}s • {q.points} pts
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(q)}
                    className="p-1.5 rounded-lg text-[#8ECAE6] hover:bg-[#219EBC]/20 transition-all cursor-pointer"
                    title="Edit question"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm font-semibold text-white leading-relaxed">
              {q.question}
            </div>

            {q.code && (
              <div className="p-3 rounded-xl bg-[#011826] border border-white/10 text-xs font-mono text-[#8ECAE6] overflow-x-auto">
                <pre>{q.code}</pre>
              </div>
            )}

            {/* Options display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {q.options.map((opt, optIdx) => {
                const isCorrect = q.correct.includes(optIdx);
                return (
                  <div
                    key={optIdx}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                      isCorrect
                        ? 'bg-emerald-950/60 border-emerald-400 text-white font-medium'
                        : 'bg-[#011826]/70 border-white/10 text-slate-300'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                        isCorrect ? 'bg-emerald-400 text-[#011826]' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {OPTION_SYMBOLS[optIdx]}
                    </span>
                    <span className="flex-1 truncate">{opt}</span>
                    {isCorrect && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
