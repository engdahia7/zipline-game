import React, { useState } from 'react';
import { Undo2, RotateCcw, Lightbulb, Play, Pause, Tv, SlidersHorizontal, Pencil, Ghost, AlertTriangle, Zap, Skull } from 'lucide-react';
import { translations, Language } from '../i18n/translations';
import { GameMode } from '../types/game';

interface ControlsProps {
  lang: Language;
  onUndo: () => void;
  onClear: () => void;
  onHint: () => void;
  hintsCount: number;
  onOpenAdModal?: () => void;
  canUndo: boolean;
  canClear: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  elapsedTime: number;
  cellsFilled: number;
  totalCells: number;
  backtracks: number;
  nextCheckpoint: number | null;
  isDarkMode?: boolean;
  hintLimitPerPuzzle?: number | 'unlimited';
  hintsUsedInCurrentPuzzle?: number;
  onChangeHintLimit?: (limit: number | 'unlimited') => void;
  gameMode?: GameMode;
  timeRushStage?: number;
  timeRushTimeLeft?: number;
  deadEndDetected?: boolean;
  isPencilMode?: boolean;
  onTogglePencilMode?: () => void;
  onGhostStep?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  lang,
  onUndo,
  onClear,
  onHint,
  hintsCount,
  onOpenAdModal,
  canUndo,
  canClear,
  isPaused,
  onTogglePause,
  elapsedTime,
  cellsFilled,
  totalCells,
  backtracks,
  nextCheckpoint,
  isDarkMode = true,
  hintLimitPerPuzzle = 3,
  hintsUsedInCurrentPuzzle = 0,
  onChangeHintLimit,
  gameMode,
  timeRushStage = 1,
  timeRushTimeLeft = 60,
  deadEndDetected = false,
  isPencilMode = false,
  onTogglePencilMode,
  onGhostStep,
}) => {
  const [showLimitSelector, setShowLimitSelector] = useState(false);
  const t = translations[lang];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percentage = Math.round((cellsFilled / totalCells) * 100);

  const isLimitReached =
    hintLimitPerPuzzle !== 'unlimited' && hintsUsedInCurrentPuzzle >= hintLimitPerPuzzle;

  return (
    <div className="w-full max-w-[min(92vw,440px)] sm:max-w-[460px] mx-auto mt-2 sm:mt-2.5 space-y-2 select-none">
      {/* Special Game Mode Banner */}
      {gameMode === 'timerush' && (
        <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black shadow-xs">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{t.timeRushTitle} · {t.timeRushStage} {timeRushStage}/3</span>
          </div>
          <span className={`font-mono text-xs px-2 py-0.5 rounded-lg border ${timeRushTimeLeft <= 15 ? 'bg-rose-500 text-white border-rose-300 animate-pulse' : 'bg-stone-900 text-amber-300 border-amber-400/40'}`}>
            ⏱️ {timeRushTimeLeft}s
          </span>
        </div>
      )}

      {gameMode === 'suddendeath' && (
        <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-black shadow-xs">
          <div className="flex items-center gap-1.5">
            <Skull className="w-4 h-4 text-rose-400" />
            <span>{t.suddenDeathTitle}</span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-500/40">
            0 Backtracks
          </span>
        </div>
      )}

      {/* Dead-End Trapped Cell Alert */}
      {deadEndDetected && (
        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-[11px] font-black animate-pulse shadow-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{t.deadEndAlert}</span>
        </div>
      )}

      {/* 1. Unified Sleek HUD Bar */}
      <div
        className={`flex items-center justify-between p-2 px-3 rounded-2xl border text-xs transition-colors ${
          isDarkMode ? 'bg-[#0f172a]/90 border-[#1e2942]' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {/* Timer with Pause Toggle */}
        <button
          onClick={onTogglePause}
          title={isPaused ? t.resume : t.pause}
          className={`flex items-center gap-1.5 py-1 px-2 rounded-lg cursor-pointer transition-colors ${
            isDarkMode
              ? 'hover:bg-slate-800 text-slate-200'
              : 'hover:bg-slate-100 text-slate-800'
          }`}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
          <span className="tabular-nums font-mono font-bold text-xs">
            {gameMode === 'timerush' ? `${timeRushTimeLeft}s` : formatTime(elapsedTime)}
          </span>
        </button>

        {/* Center: Next Target Checkpoint & Progress */}
        <div className="flex items-center gap-2">
          {nextCheckpoint !== null ? (
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{t.nextTarget}:</span>
              <span className="font-mono font-black text-amber-400 px-1.5 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30">
                {nextCheckpoint}
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-black text-emerald-400">
              {lang === 'ar' ? 'أكمل المسار!' : 'Finish path!'}
            </span>
          )}
          <span aria-hidden="true" className="opacity-30">·</span>
          <span className={`text-[11px] font-semibold tabular-nums ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {cellsFilled}/{totalCells} ({percentage}%)
          </span>
        </div>

        {/* Backtracks count */}
        <div className={`text-[11px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>{t.backtracks}:</span>
          <span className={`font-mono font-bold tabular-nums ${gameMode === 'suddendeath' && backtracks > 0 ? 'text-rose-400 font-black' : isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {backtracks}
          </span>
        </div>
      </div>

      {/* 2. Slim Integrated Progress Bar */}
      <div
        className={`w-full h-1.5 rounded-full overflow-hidden transition-colors ${
          isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
        }`}
      >
        <div
          className="bg-amber-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 3. Primary Action Buttons (Undo, Clear, Hint) */}
      <div className="grid grid-cols-3 gap-2 pt-0.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
            canUndo
              ? isDarkMode
                ? 'bg-[#0f172a] hover:bg-[#16233d] text-white border-[#1e2942] active:scale-95'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-2xs active:scale-95'
              : isDarkMode
              ? 'bg-[#0a0f1d] text-slate-600 border-transparent cursor-not-allowed opacity-40'
              : 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-50'
          }`}
        >
          <Undo2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.undo}</span>
        </button>

        <button
          onClick={onClear}
          disabled={!canClear}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
            canClear
              ? isDarkMode
                ? 'bg-[#0f172a] hover:bg-[#16233d] text-white border-[#1e2942] active:scale-95'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-2xs active:scale-95'
              : isDarkMode
              ? 'bg-[#0a0f1d] text-slate-600 border-transparent cursor-not-allowed opacity-40'
              : 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-50'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.clear}</span>
        </button>

        <button
          onClick={onHint}
          className={`relative flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer active:scale-95 ${
            isLimitReached
              ? 'bg-slate-800 border-slate-700 text-slate-400'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300 shadow-sm'
          }`}
        >
          <Lightbulb className={`w-3.5 h-3.5 ${isLimitReached ? 'fill-slate-500 text-slate-500' : 'fill-slate-950'}`} />
          <span>{t.hint}</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black tabular-nums border shadow-2xs ${
              isLimitReached
                ? 'bg-rose-950 text-rose-300 border-rose-700'
                : hintsCount > 0
                ? 'bg-slate-950 text-amber-300 border-amber-300/60'
                : 'bg-rose-600 text-white border-rose-400'
            }`}
          >
            {isLimitReached ? '0' : hintsCount > 0 ? hintsCount : '+'}
          </span>
        </button>
      </div>

      {/* 4. Strategic In-Game Helpers: Pencil Draft Mode & Ghost Step */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        {onTogglePencilMode && (
          <button
            onClick={onTogglePencilMode}
            title={lang === 'ar' ? 'وضع قلم المسودة لتجربة الأرقام' : 'Pencil draft mode'}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isPencilMode
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm ring-2 ring-amber-400/50'
                : isDarkMode
                ? 'bg-[#0f172a] hover:bg-[#16233d] text-slate-300 border-[#1e2942]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Pencil className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>{t.pencilMode}</span>
            <span className="text-[10px] opacity-75 font-mono">{isPencilMode ? 'ON' : 'OFF'}</span>
          </button>
        )}

        {onGhostStep && (
          <button
            onClick={onGhostStep}
            title={t.ghostStepTip}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-cyan-950/40 hover:bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border-cyan-200'
            }`}
          >
            <Ghost className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.ghostStep}</span>
          </button>
        )}
      </div>

      {/* 4. Quiet Secondary Utilities (Watch Ad & Hint Limit) */}
      <div className="flex items-center justify-between text-[11px] px-1 pt-0.5 text-slate-400">
        {onOpenAdModal ? (
          <button
            onClick={onOpenAdModal}
            className={`flex items-center gap-1 font-semibold cursor-pointer transition-colors ${
              hintsCount === 0
                ? 'text-amber-400 animate-pulse font-bold'
                : isDarkMode
                ? 'hover:text-amber-300 text-slate-400'
                : 'hover:text-amber-600 text-slate-500'
            }`}
          >
            <Tv className="w-3 h-3 text-amber-400" />
            <span>{lang === 'ar' ? 'إعلان لتلميحات مجانية (+2)' : 'Free hints ad (+2)'}</span>
          </button>
        ) : (
          <div />
        )}

        {onChangeHintLimit && (
          <button
            onClick={() => setShowLimitSelector(prev => !prev)}
            className={`flex items-center gap-1 font-semibold cursor-pointer transition-colors ${
              isDarkMode ? 'hover:text-slate-200 text-slate-400' : 'hover:text-slate-700 text-slate-500'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 text-amber-400" />
            <span>
              {lang === 'ar' ? 'السقف:' : 'Limit:'}{' '}
              <strong className="text-amber-400 font-mono">
                {hintLimitPerPuzzle === 'unlimited'
                  ? lang === 'ar'
                    ? 'حر'
                    : 'Open'
                  : `${hintsUsedInCurrentPuzzle}/${hintLimitPerPuzzle}`}
              </strong>
            </span>
          </button>
        )}
      </div>

      {/* Hint Limit Selector Dropdown Menu */}
      {showLimitSelector && onChangeHintLimit && (
        <div
          className={`p-3 rounded-2xl border-2 space-y-2 animate-fade-in shadow-xl ${
            isDarkMode ? 'bg-[#0f172a] border-amber-400/50 text-white' : 'bg-white border-amber-300 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'تحديد سقف المساعدات لكل لغز' : 'Puzzle Hint Limit'}</span>
            </span>
            <button
              onClick={() => setShowLimitSelector(false)}
              className="text-[10px] text-slate-400 hover:text-white cursor-pointer px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
            {lang === 'ar'
              ? 'اختر الحد الأقصى للتلميحات المسموح بها في اللغز الواحد لزيادة التحدي أو المساعدة:'
              : 'Choose maximum hints allowed per single puzzle for custom difficulty:'}
          </p>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { val: 3 as const, labelAr: '3 مساعدات', labelEn: '3 Hints', desc: 'قياسي' },
              { val: 1 as const, labelAr: 'مساعدة 1', labelEn: '1 Hint', desc: 'تحدي' },
              { val: 0 as const, labelAr: 'بدون (0)', labelEn: 'None (0)', desc: 'احترافي' },
              { val: 'unlimited' as const, labelAr: 'مفتوح ∞', labelEn: 'Unlimited', desc: 'حر' },
            ].map(opt => {
              const isSelected = hintLimitPerPuzzle === opt.val;
              return (
                <button
                  key={opt.val.toString()}
                  onClick={() => {
                    onChangeHintLimit(opt.val);
                    setShowLimitSelector(false);
                  }}
                  className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                      : isDarkMode
                      ? 'bg-[#16233d] border-[#223554] text-slate-300 hover:border-amber-400/50'
                      : 'bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="text-[11px] font-black">{lang === 'ar' ? opt.labelAr : opt.labelEn}</div>
                  <div className="text-[9px] opacity-75">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Keyboard Hints Bar */}
      <div
        className={`hidden md:flex items-center justify-center gap-2 pt-0.5 text-[11px] font-bold ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        <span
          className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
            isDarkMode ? 'bg-[#1a2744] text-amber-300 border border-[#223554]' : 'bg-slate-200 text-slate-800'
          }`}
        >
          W A S D
        </span>
        <span>{lang === 'ar' ? 'أو السحب للرسم' : 'or drag to draw'}</span>
        <span>·</span>
        <span
          className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
            isDarkMode ? 'bg-[#1a2744] text-amber-300 border border-[#223554]' : 'bg-slate-200 text-slate-800'
          }`}
        >
          Z
        </span>
        <span>{t.undo}</span>
        <span>·</span>
        <span
          className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
            isDarkMode ? 'bg-[#1a2744] text-amber-300 border border-[#223554]' : 'bg-slate-200 text-slate-800'
          }`}
        >
          H
        </span>
        <span>{t.hint}</span>
      </div>
    </div>
  );
};
