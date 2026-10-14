import React, { useState } from 'react';
import { Puzzle, Difficulty } from '../types/game';
import { translations, Language } from '../i18n/translations';
import { CheckCircle2, Star, Layers } from 'lucide-react';

interface LevelSelectorProps {
  puzzles: Puzzle[];
  currentPuzzleId: string;
  completedPuzzleIds: string[];
  puzzleStars?: Record<string, number>;
  onSelectPuzzle: (puzzle: Puzzle) => void;
  lang: Language;
  isDarkMode?: boolean;
  initialTier?: Difficulty;
  onSelectTier?: (tier: Difficulty) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  puzzles,
  currentPuzzleId,
  completedPuzzleIds,
  puzzleStars = {},
  onSelectPuzzle,
  lang,
  isDarkMode = true,
  initialTier = 'warmup',
  onSelectTier,
}) => {
  const [activeTier, setActiveTier] = useState<Difficulty>(initialTier);
  const t = translations[lang];

  const tiers: Array<{ id: Difficulty; label: string; size: string; tierAr: string }> = [
    { id: 'warmup', label: t.warmup, size: '5×5', tierAr: 'المبتدئ' },
    { id: 'medium', label: t.medium, size: '6×6', tierAr: 'المتوسط' },
    { id: 'hard', label: t.hard, size: '7×7', tierAr: 'المتقدم' },
    { id: 'expert', label: t.expert, size: '8×8', tierAr: 'الخبير' },
  ];

  const filteredPuzzles = puzzles.filter(p => p.difficulty === activeTier);

  // Total stars in this tier
  const tierCompleted = filteredPuzzles.filter(p => completedPuzzleIds.includes(p.id)).length;

  return (
    <div className="w-full max-w-[480px] mx-auto space-y-4">
      {/* Tier Switcher */}
      <div
        className={`grid grid-cols-4 gap-1 p-1 rounded-2xl border ${
          isDarkMode ? 'bg-[#131d33] border-[#223554]' : 'bg-slate-200 border-slate-300'
        }`}
      >
        {tiers.map(tier => (
          <button
            key={tier.id}
            onClick={() => {
              setActiveTier(tier.id);
              onSelectTier?.(tier.id);
            }}
            className={`py-2 px-1 text-xs font-black rounded-xl transition-all text-center cursor-pointer ${
              activeTier === tier.id
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 text-white shadow-xs'
                : isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <div className="tabular-nums font-mono font-black">{tier.size}</div>
            <div className="text-[10px] font-bold truncate mt-0.5">
              {lang === 'ar' ? tier.tierAr : tier.id}
            </div>
          </button>
        ))}
      </div>

      {/* Tier Progress bar */}
      <div className={`flex items-center justify-between text-xs px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        <span>
          {lang === 'ar' ? `المكتمل في هذا القسم:` : `Section progress:`}{' '}
          <strong className={isDarkMode ? 'text-white' : 'text-slate-950'}>{tierCompleted} / {filteredPuzzles.length}</strong>
        </span>
      </div>

      {/* Level List / Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredPuzzles.map((puzzle, index) => {
          const isSelected = puzzle.id === currentPuzzleId;
          const isCompleted = completedPuzzleIds.includes(puzzle.id);
          const starsEarned = puzzleStars[puzzle.id] || (isCompleted ? 3 : 0);

          return (
            <button
              key={puzzle.id}
              onClick={() => onSelectPuzzle(puzzle)}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-start transition-all cursor-pointer border-2 ${
                isSelected
                  ? isDarkMode
                    ? 'bg-amber-400/20 border-amber-400 ring-2 ring-amber-400/50 shadow-sm'
                    : 'bg-amber-100/90 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                  : isDarkMode
                  ? 'bg-[#121a2f] border-[#1e2942] hover:border-amber-400/60 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <span className={`text-[11px] sm:text-xs font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {lang === 'ar' ? `المستوى ${index + 1}` : `Level ${index + 1}`}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 fill-emerald-500/20" />
                ) : (
                  <span
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border ${
                      isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-300 border-slate-400'
                    }`}
                  />
                )}
              </div>

              <div className={`font-serif font-black text-xs sm:text-sm truncate mb-1.5 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                {lang === 'ar' ? puzzle.titleAr : puzzle.title}
              </div>

              {/* Star Rating & Cells Count */}
              <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-[#1e2942]' : 'border-slate-200'}`}>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map(s => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= starsEarned
                          ? 'text-amber-400 fill-amber-400'
                          : isDarkMode
                          ? 'text-slate-700 fill-slate-800'
                          : 'text-slate-300 fill-slate-100'
                      }`}
                    />
                  ))}
                </div>

                <span
                  className={`text-[11px] font-mono font-black px-1.5 py-0.5 rounded border tabular-nums ${
                    isDarkMode
                      ? 'bg-[#1a2642] text-amber-300 border-[#27375a]'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {puzzle.width}×{puzzle.height}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
