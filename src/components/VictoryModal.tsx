import React, { useState } from 'react';
import { Trophy, Clock, RotateCcw, Share2, Check, Coins, Star, Play } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface VictoryModalProps {
  isOpen: boolean;
  timeSeconds: number;
  backtracks: number;
  isDaily: boolean;
  earnedCoins?: number;
  stars?: number;
  modeName?: string;
  onNext: () => void;
  onReplay: () => void;
  lang: Language;
  isDarkMode?: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  timeSeconds,
  backtracks,
  isDaily,
  earnedCoins = 35,
  stars = 3,
  modeName,
  onNext,
  onReplay,
  lang,
  isDarkMode = true,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  const t = translations[lang];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    const starStr = '⭐'.repeat(stars);
    const emojiGrid = '🟩🟩🟩🟩\n🟩🟩🟩🟩\n🟩🟩🟩🟩';
    const text = `🧩 ZipLine ${isDaily ? t.daily : ''} ${starStr}\n⏱️ ${formatTime(timeSeconds)} | ↩️ ${backtracks} ${t.backtracks}\n${emojiGrid}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-2 text-center ${
          isDarkMode
            ? 'bg-[#121a2f] border-[#1e2942] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Animated Stars Rating */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          {[1, 2, 3].map(s => {
            const isEarned = s <= stars;
            return (
              <div
                key={s}
                className={`transition-all duration-300 transform ${
                  isEarned
                    ? 'text-amber-400 scale-110 drop-shadow-md animate-bounce'
                    : isDarkMode
                    ? 'text-slate-700 scale-90'
                    : 'text-slate-200 scale-90'
                }`}
                style={{ animationDelay: `${s * 150}ms`, animationIterationCount: 2 }}
              >
                <Star
                  className={`w-7 h-7 sm:w-9 sm:h-9 ${
                    isEarned
                      ? 'fill-amber-400 stroke-amber-500'
                      : isDarkMode
                      ? 'fill-slate-800 stroke-slate-700'
                      : 'fill-slate-200 stroke-slate-300'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <h3 className={`text-lg sm:text-2xl font-serif font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {t.victory}
        </h3>
        <p className={`text-[11px] sm:text-xs mb-2.5 sm:mb-3 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
          {t.victorySubtitle}
        </p>

        {/* Coins Reward Callout */}
        <div
          className={`mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 font-black text-xs sm:text-sm shadow-xs ${
            isDarkMode
              ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
              : 'bg-amber-100 border-amber-300 text-slate-950'
          }`}
        >
          <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
          <span>+{earnedCoins} {lang === 'ar' ? 'عملة ذهبية للمتجر!' : 'Gold Coins for the Shop!'}</span>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div
            className={`p-3 rounded-2xl border flex flex-col items-center ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className={`text-xs font-black mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.time}</span>
            <span className={`text-lg font-black font-mono tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              {formatTime(timeSeconds)}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border flex flex-col items-center ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className={`text-xs font-black mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.backtracks}</span>
            <span className={`text-lg font-black font-mono tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              {backtracks}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/25 border border-amber-300 active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {modeName
                ? lang === 'ar'
                  ? `${t.nextPuzzle} (${modeName})`
                  : `Next: ${modeName}`
                : t.nextPuzzle}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 font-extrabold text-xs rounded-xl border-2 transition-colors cursor-pointer shadow-2xs active:scale-95 ${
                isDarkMode
                  ? 'bg-[#16233d] hover:bg-[#1e2d4d] text-white border-[#1e2942]'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.share}</span>
            </button>

            <button
              onClick={onReplay}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 font-extrabold text-xs rounded-xl border-2 transition-colors cursor-pointer shadow-2xs active:scale-95 ${
                isDarkMode
                  ? 'bg-[#16233d] hover:bg-[#1e2d4d] text-white border-[#1e2942]'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.restart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
