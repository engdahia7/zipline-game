import React, { useState } from 'react';
import { translations, Language } from '../i18n/translations';
import { Difficulty, Puzzle } from '../types/game';
import { generatePuzzle } from '../utils/generator';
import { Dices, Grid3X3 } from 'lucide-react';

interface GeneratorViewProps {
  onGenerate: (newPuzzle: Puzzle) => void;
  lang: Language;
  isDarkMode?: boolean;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ onGenerate, lang, isDarkMode = true }) => {
  const [size, setSize] = useState<number>(6);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const t = translations[lang];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const p = generatePuzzle(size, size, difficulty, undefined, {
        en: `Custom ${size}×${size}`,
        ar: `مخصص ${size}×${size}`,
      });
      onGenerate(p);
      setIsGenerating(false);
    }, 150);
  };

  return (
    <div
      className={`w-full max-w-[480px] mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 shadow-xs space-y-4 sm:space-y-5 ${
        isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isDarkMode ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          <Dices className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className={`font-serif font-black text-sm sm:text-base leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'مختبر الألغاز المخصصة' : 'Custom Puzzle Lab'}
          </h3>
          <p className={`text-[10px] sm:text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'ar' ? 'حدد مقاس الشبكة ومستوى التعقيد وابدأ التحدي' : 'Select grid dimensions and difficulty to play'}
          </p>
        </div>
      </div>

      {/* Grid Size Selector */}
      <div className="space-y-1.5 sm:space-y-2">
        <label className={`text-[11px] sm:text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t.gridSize}</label>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {[5, 6, 7, 8].map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer border ${
                size === s
                  ? isDarkMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                    : 'bg-slate-950 text-white border-slate-900 shadow-xs'
                  : isDarkMode
                  ? 'bg-[#1a2642] text-slate-300 border-[#27375a] hover:bg-[#223554]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="space-y-1.5 sm:space-y-2">
        <label className={`text-[11px] sm:text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {lang === 'ar' ? 'مستوى الصعوبة' : 'Difficulty'}
        </label>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {(['warmup', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-xl font-bold text-[11px] sm:text-xs transition-all cursor-pointer border truncate ${
                difficulty === d
                  ? isDarkMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                    : 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-xs'
                  : isDarkMode
                  ? 'bg-[#1a2642] text-slate-300 border-[#27375a] hover:bg-[#223554]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {d === 'warmup' ? (lang === 'ar' ? 'إحماء' : 'Warm-up') : d === 'medium' ? (lang === 'ar' ? 'متوسط' : 'Medium') : (lang === 'ar' ? 'صعب' : 'Hard')}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 text-slate-950 font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md border border-amber-300 transition-all active:scale-98 cursor-pointer"
      >
        <Grid3X3 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? (lang === 'ar' ? 'جارِ التحضير...' : 'Preparing...') : t.generateButton}</span>
      </button>
    </div>
  );
};
