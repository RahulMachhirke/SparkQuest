import React from 'react';
import { Sparkles, Terminal, Code2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#219EBC]/20 bg-[#023047] py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFB703] to-[#FB8500] text-[#023047] font-black flex items-center justify-center">
              ⚡
            </div>
            <div>
              <p className="font-black text-sm text-white">SPARK QUEST | BYTE LOGIC</p>
              <p className="text-[11px] text-[#8ECAE6]">
                Technospark Club • Department of Information Technology, PCCOER Ravet
              </p>
            </div>
          </div>

          {/* Official Color Swatch from the Provided Image */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-medium">Brand Theme:</span>
            <div className="flex rounded-md overflow-hidden border border-[#219EBC]/40 h-5 w-28">
              <div className="flex-1 bg-[#8ECAE6]" title="#8ECAE6 - Sky Blue" />
              <div className="flex-1 bg-[#219EBC]" title="#219EBC - Teal Blue" />
              <div className="flex-1 bg-[#023047]" title="#023047 - Navy" />
              <div className="flex-1 bg-[#FFB703]" title="#FFB703 - Honey Yellow" />
              <div className="flex-1 bg-[#FB8500]" title="#FB8500 - Deep Orange" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#219EBC]/15 gap-2 text-[11px]">
          <p>© 2026 Technospark Club PCCOER. Built for inter-collegiate tech supremacy.</p>
          <p className="text-slate-400">
            Modular multi-developer architecture • Ready for team collaboration
          </p>
        </div>
      </div>
    </footer>
  );
};
