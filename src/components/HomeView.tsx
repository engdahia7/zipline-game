import React, { useState } from 'react';
import { PlayerProfile, PlayerStats, Puzzle } from '../types/game';
import { translations, Language } from '../i18n/translations';
import { claimDailyReward, canClaimDailyReward } from '../utils/profile';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  Play,
  Flame,
  Trophy,
  Coins,
  Layers,
  Dices,
  ShoppingBag,
  ShieldCheck,
  Gift,
  Check,
  Lightbulb,
  Tv,
  Zap,
  Skull,
  Crown,
} from 'lucide-react';

interface HomeViewProps {
  dailyPuzzle: Puzzle;
  playerProfile: PlayerProfile;
  playerStats: PlayerStats;
  onPlayDaily: () => void;
  onPlayLevels: () => void;
  onPlayCustom: () => void;
  onPlayTimeRush?: () => void;
  onPlaySuddenDeath?: () => void;
  onPlayMegaWeekly?: () => void;
  onOpenShop: () => void;
  onOpenProfile: () => void;
  onOpenAdModal?: () => void;
  onUpdateProfile: (newProfile: PlayerProfile) => void;
  lang: Language;
  isDarkMode?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  dailyPuzzle,
  playerProfile,
  playerStats,
  onPlayDaily,
  onPlayLevels,
  onPlayCustom,
  onPlayTimeRush,
  onPlaySuddenDeath,
  onPlayMegaWeekly,
  onOpenShop,
  onOpenProfile,
  onOpenAdModal,
  onUpdateProfile,
  lang,
  isDarkMode = true,
}) => {
  const t = translations[lang];
  const isDailyDone = playerStats.completedPuzzles.includes(dailyPuzzle.id);
  const todayStr = new Date().toISOString().split('T')[0];
  const canClaim = canClaimDailyReward(playerProfile, todayStr);
  const [claimToast, setClaimToast] = useState<string | null>(null);

  const handleClaimReward = () => {
    if (!canClaim) return;
    const res = claimDailyReward(todayStr, 50);
    if (res.success) {
      sound.playWin();
      triggerConfetti();
      onUpdateProfile(res.profile);
      setClaimToast(lang === 'ar' ? 'تهانينا! حصلت على +50 عملة ذهبية!' : 'Claimed +50 Gold Coins!');
      setTimeout(() => setClaimToast(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-2.5 animate-fade-in py-0.5">
      {/* Toast Alert */}
      {claimToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-amber-300 text-xs font-bold py-2 px-4 rounded-xl shadow-xl border border-amber-400/80 backdrop-blur-sm animate-fade-in whitespace-nowrap">
          {claimToast}
        </div>
      )}

      {/* 1. Slim Profile Header Strip (No redundant coins, clean & compact) */}
      <div
        className={`flex items-center justify-between p-2 px-3 rounded-2xl border transition-colors ${
          isDarkMode
            ? 'bg-[#0f172a]/80 border-[#1e2942]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {/* User Info (Click opens Profile) */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 min-w-0 text-start cursor-pointer group"
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform ${
              isDarkMode
                ? 'bg-amber-400/15 border border-amber-400/40'
                : 'bg-amber-100 border border-amber-300'
            }`}
          >
            {playerProfile.avatar}
          </div>
          <div className="min-w-0">
            <div className="font-serif font-black text-xs leading-tight truncate group-hover:text-amber-400 transition-colors">
              {playerProfile.name}
            </div>
            <div className={`flex items-center gap-2 text-[10px] font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                <Flame className="w-3 h-3 fill-current text-amber-500" />
                <span>{playerStats.currentStreak} {lang === 'ar' ? 'أيام متتالية' : 'day streak'}</span>
              </span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="flex items-center gap-0.5">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>{playerStats.gamesWon} {lang === 'ar' ? 'فوز' : 'wins'}</span>
              </span>
            </div>
          </div>
        </button>

        {/* Daily Gift Claim Button */}
        <div className="shrink-0">
          {canClaim ? (
            <button
              onClick={handleClaimReward}
              title={lang === 'ar' ? 'استلم مكافأة اليوم (+50 عملة)' : 'Claim Daily +50'}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-[11px] rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all animate-pulse"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>+50 🪙</span>
            </button>
          ) : (
            <span
              title={lang === 'ar' ? 'تم استلام مكافأة اليوم' : 'Daily reward claimed'}
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                isDarkMode ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-700 bg-emerald-50'
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
              <span>{lang === 'ar' ? 'المكافأة مستلمة' : 'Claimed'}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Featured Daily Challenge Hero Card (Compact, stylish & uncluttered) */}
      <div
        className={`relative overflow-hidden rounded-2xl p-3 sm:p-3.5 border transition-all ${
          isDarkMode
            ? 'bg-[#0f172a] text-white border-[#1e2942]'
            : 'bg-[#0f172a] text-white border-slate-800 shadow-sm'
        }`}
      >
        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase block">
                  {lang === 'ar' ? 'تحدي اليوم' : "Today's Puzzle"}
                </span>
                <h2 className="text-sm sm:text-base font-serif font-black text-white leading-tight truncate">
                  {lang === 'ar' ? dailyPuzzle.titleAr : dailyPuzzle.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-[#18202f] border border-[#2e3b52] text-amber-300 tabular-nums">
                {dailyPuzzle.width}×{dailyPuzzle.height}
              </span>
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5 bg-amber-400/15 px-1.5 py-0.5 rounded">
                <Coins className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>+35</span>
              </span>
            </div>
          </div>

          <button
            onClick={onPlayDaily}
            className={`w-full py-2 px-3 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isDailyDone
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 text-slate-950 shadow-amber-500/20 active:scale-98'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {isDailyDone
                ? lang === 'ar'
                  ? 'اللعب مجدداً (مكتمل ✓)'
                  : 'Play Again (Solved ✓)'
                : lang === 'ar'
                ? 'بدء تحدي اليوم'
                : 'Play Today Challenge'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Level Collections Hero Banner (Direct progression access) */}
      <button
        onClick={onPlayLevels}
        className={`w-full p-2.5 sm:p-3 rounded-2xl border text-start transition-all cursor-pointer group shadow-2xs hover:shadow-xs flex items-center justify-between gap-2.5 ${
          isDarkMode
            ? 'bg-[#0f172a]/90 border-[#1e2942] hover:border-amber-400/60 text-white'
            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-950'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 ${
              isDarkMode ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-950 text-amber-400'
            }`}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif font-black text-xs sm:text-sm leading-tight truncate">
              {lang === 'ar' ? 'المراحل ومجموعات الألغاز' : 'Level Collections'}
            </h4>
            <p className={`text-[10px] font-medium mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'ar' ? '24 لغزاً متدرجة من 5×5 إلى 8×8' : '24 curated puzzles (5×5 to 8×8)'}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border shrink-0 ${
          isDarkMode
            ? 'bg-[#18202f] border-[#2e3b52] text-amber-400'
            : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          {lang === 'ar' ? 'استعراض' : 'Browse'} →
        </span>
      </button>

      {/* 4. Special Modes Hub: Clean, balanced 2x2 Grid (No cramped 3-col truncation) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>{lang === 'ar' ? 'أنماط التحدي السريع' : 'Quick Challenges'}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Time Rush Blitz */}
          <button
            onClick={onPlayTimeRush}
            className={`p-2.5 rounded-2xl border text-start transition-all cursor-pointer group shadow-2xs hover:shadow-xs flex items-center gap-2.5 ${
              isDarkMode
                ? 'bg-[#0f172a]/90 border-[#1e2942] hover:border-amber-400/60 text-white'
                : 'bg-white border-slate-200 hover:border-amber-400 text-slate-950'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h5 className="font-serif font-black text-xs truncate">
                  {lang === 'ar' ? 'سباق الوقت' : 'Time Rush'}
                </h5>
                <span className="text-[9px] font-mono font-black text-amber-400 px-1 py-0.2 rounded bg-amber-400/10 shrink-0">
                  60s
                </span>
              </div>
              <p className={`text-[10px] mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'ar' ? '3 مراحل متتالية' : '3 Blitz stages'}
              </p>
            </div>
          </button>

          {/* Sudden Death */}
          <button
            onClick={onPlaySuddenDeath}
            className={`p-2.5 rounded-2xl border text-start transition-all cursor-pointer group shadow-2xs hover:shadow-xs flex items-center gap-2.5 ${
              isDarkMode
                ? 'bg-[#0f172a]/90 border-[#1e2942] hover:border-rose-400/60 text-white'
                : 'bg-white border-slate-200 hover:border-rose-400 text-slate-950'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Skull className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h5 className="font-serif font-black text-xs truncate">
                  {lang === 'ar' ? 'الخطوة الواحدة' : 'Sudden Death'}
                </h5>
                <span className="text-[9px] font-mono font-black text-rose-400 px-1 py-0.2 rounded bg-rose-500/10 shrink-0">
                  0 Undo
                </span>
              </div>
              <p className={`text-[10px] mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'ar' ? 'بدون أي تراجع' : 'Zero backtracks'}
              </p>
            </div>
          </button>

          {/* Mega Weekly */}
          <button
            onClick={onPlayMegaWeekly}
            className={`p-2.5 rounded-2xl border text-start transition-all cursor-pointer group shadow-2xs hover:shadow-xs flex items-center gap-2.5 ${
              isDarkMode
                ? 'bg-[#0f172a]/90 border-[#1e2942] hover:border-purple-400/60 text-white'
                : 'bg-white border-slate-200 hover:border-purple-400 text-slate-950'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Crown className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h5 className="font-serif font-black text-xs truncate">
                  {lang === 'ar' ? 'العملاق 9×9' : 'Mega 9×9'}
                </h5>
                <span className="text-[9px] font-mono font-black text-amber-400 px-1 py-0.2 rounded bg-amber-400/10 shrink-0">
                  +120🪙
                </span>
              </div>
              <p className={`text-[10px] mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'ar' ? 'تحدي الأسبوع' : 'Weekly puzzle'}
              </p>
            </div>
          </button>

          {/* Custom / Free Play */}
          <button
            onClick={onPlayCustom}
            className={`p-2.5 rounded-2xl border text-start transition-all cursor-pointer group shadow-2xs hover:shadow-xs flex items-center gap-2.5 ${
              isDarkMode
                ? 'bg-[#0f172a]/90 border-[#1e2942] hover:border-amber-400/60 text-white'
                : 'bg-white border-slate-200 hover:border-slate-400 text-slate-950'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Dices className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h5 className="font-serif font-black text-xs truncate">
                  {lang === 'ar' ? 'لعب مخصص' : 'Custom Grid'}
                </h5>
                <span className="text-[9px] font-bold text-amber-400 px-1 py-0.2 rounded bg-amber-400/10 shrink-0">
                  {lang === 'ar' ? 'حر' : 'Free'}
                </span>
              </div>
              <p className={`text-[10px] mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'ar' ? 'أبعاد وصعوبة حرة' : 'Choose dimensions'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Compact Utility Strip (Free hints via ad & shop shortcut) */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        {/* Free Hints via Ad */}
        {onOpenAdModal && (
          <button
            onClick={onOpenAdModal}
            className={`p-2 rounded-xl border flex items-center gap-2 text-start cursor-pointer transition-all ${
              isDarkMode
                ? 'bg-[#0f172a]/80 border-[#1e2942] hover:border-amber-400/50'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-6.5 h-6.5 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Lightbulb className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="font-serif font-black text-xs truncate flex items-center gap-1">
                <span>{lang === 'ar' ? 'مساعدات مجانية' : 'Free Hints'}</span>
                <span className="text-[9px] text-amber-400 font-bold">+2</span>
              </div>
              <div className={`text-[9.5px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'ar' ? 'إعلان قصير' : 'Brief ad'}
              </div>
            </div>
          </button>
        )}

        {/* Shop Shortcut */}
        <button
          onClick={onOpenShop}
          className={`p-2 rounded-xl border flex items-center gap-2 text-start cursor-pointer transition-all ${
            isDarkMode
              ? 'bg-[#0f172a]/80 border-[#1e2942] hover:border-amber-400/50'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="w-6.5 h-6.5 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="font-serif font-black text-xs truncate">
              {t.navShop}
            </div>
            <div className={`text-[9.5px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'ar' ? 'سمات وأشكال' : 'Themes & skins'}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
