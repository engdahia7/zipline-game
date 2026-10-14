import React, { useState } from 'react';
import { X, Trophy, Flame, Target, Clock, Share2, Check } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { translations, Language } from '../i18n/translations';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  lang: Language;
  isDarkMode?: boolean;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, lang, isDarkMode = true }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  const t = translations[lang];

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const formatTime = (secs: number | null) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    const text = `🧩 ZipLine\n🔥 Streak: ${stats.currentStreak} days\n🏆 Solved: ${stats.gamesWon}\n⚡ Best: ${formatTime(stats.bestTime)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-2 ${
          isDarkMode
            ? 'bg-[#121a2f] border-[#1e2942] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 sm:pb-4 border-b ${isDarkMode ? 'border-[#1e2942]' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2 font-serif font-black text-base sm:text-lg">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{t.stats}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-[#1a2642]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 py-3.5 sm:py-5">
          <div
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1 text-amber-500 mb-0.5 sm:mb-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className={`text-[10px] sm:text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.streak}</span>
            </div>
            <span className={`text-lg sm:text-2xl font-black tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{stats.currentStreak}</span>
          </div>

          <div
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`flex items-center gap-1 mb-0.5 sm:mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <Target className="w-3.5 h-3.5" />
              <span className={`text-[10px] sm:text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.played}</span>
            </div>
            <span className={`text-lg sm:text-2xl font-black tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{stats.gamesPlayed}</span>
          </div>

          <div
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1 text-amber-500 mb-0.5 sm:mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span className={`text-[10px] sm:text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.winRate}</span>
            </div>
            <span className={`text-lg sm:text-2xl font-black tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{winRate}%</span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`flex items-center gap-1 mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <Clock className="w-4 h-4" />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.bestTime}</span>
            </div>
            <span className={`text-xl font-black font-mono tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{formatTime(stats.bestTime)}</span>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-md cursor-pointer active:scale-98 border border-amber-300"
        >
          {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? t.copied : t.share}</span>
        </button>
      </div>
    </div>
  );
};
