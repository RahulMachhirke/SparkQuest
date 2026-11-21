import React from 'react';
import { Lock, Code2, Bug, Terminal, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

interface Round2TeaserProps {
  onBack: () => void;
}

export const Round2Teaser: React.FC<Round2TeaserProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#8ECAE6] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Arena Hub</span>
      </button>

      {/* Round 2 Card */}
      <div className="bg-[#023047]/95 border-2 border-[#219EBC]/40 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#219EBC]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Stage 2 Preview
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>LOCKED • PENDING EVALUATION</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#011826] border border-[#219EBC]/40 flex items-center justify-center text-[#FB8500] shadow-inner">
            <Bug className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ROUND 2: <span className="text-[#8ECAE6]">BYTE LOGIC</span> BUG HUNT
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            In Round 2, qualifying teams will face broken codebases with obfuscated logic errors, memory leaks, and edge-case failures. Your objective will be to identify the flaw, patch the source, and pass the hidden test suite in the shortest time possible.
          </p>
        </div>

        {/* Feature Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-2xl bg-[#011826]/80 border border-[#219EBC]/30 space-y-2">
            <div className="flex items-center gap-2 text-[#8ECAE6]">
              <Terminal className="w-5 h-5 text-[#219EBC]" />
              <h4 className="font-bold text-white text-sm">Interactive Web Code Sandbox</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live syntax highlighting, compilation outputs, and unit test pass/fail metrics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#011826]/80 border border-[#219EBC]/30 space-y-2">
            <div className="flex items-center gap-2 text-[#FFB703]">
              <ShieldCheck className="w-5 h-5 text-[#FB8500]" />
              <h4 className="font-bold text-white text-sm">Automated Test Bench</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execution against private edge cases: zero division, bounds checking, and pointer validation.
            </p>
          </div>
        </div>

        {/* Round 2 Action Button (Placeholder disabled or notify) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            disabled
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700/60 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Round 2 Arena Locked</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">
            Unlocks automatically after organizers verify Round 1 scores.
          </span>
        </div>
      </div>
    </div>
  );
};
