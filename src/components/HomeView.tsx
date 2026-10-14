import React, { useState } from 'react';
import { PlayerProfile, PlayerStats, Puzzle, GameMode, Difficulty } from '../types/game';
import { translations, Language } from '../i18n/translations';
import { claimDailyReward, canClaimDailyReward } from '../utils/profile';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  Play,
  Flame,
  Layers,
  Dices,
  Gift,
  Check,
  Zap,
  Skull,
  Crown,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface HomeViewProps {
  dailyPuzzle: Puzzle;
  playerProfile: PlayerProfile;
  playerStats: PlayerStats;
  selectedMode: GameMode;
  selectedTier: Difficulty;
  onSelectMode: (mode: GameMode, tier?: Difficulty) => void;
  onLaunchSelectedMode: () => void;
  onPlayDaily: () => void;
  onPlayLevels: (tier?: Difficulty) => void;
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
  selectedMode,
  selectedTier,
  onSelectMode,
  onLaunchSelectedMode,
  onPlayDaily,
  onOpenProfile,
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

  // Helper metadata for active mode
  const getModeInfo = (mode: GameMode) => {
    switch (mode) {
      case 'levels':
        return {
          title: t.modeLevelsTitle,
          subtitle: lang === 'ar' ? '24 مرحلة تدريجية + مراحل متتالية لا نهائية' : '24 progressive stages + infinite levels',
          icon: Layers,
          badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
        };
      case 'timerush':
        return {
          title: t.modeTimeRushTitle,
          subtitle: lang === 'ar' ? 'مراحل متتالية سريعة ضد عداد 60 ثانية' : 'Fast continuous stages against 60s timer',
          icon: Zap,
          badgeColor: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
        };
      case 'suddendeath':
        return {
          title: t.modeSuddenDeathTitle,
          subtitle: lang === 'ar' ? 'بدون أي تراجع مسموح في جميع المراحل' : '0 backtracks allowed in all stages',
          icon: Skull,
          badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        };
      case 'daily':
        return {
          title: t.modeDailyTitle,
          subtitle: lang === 'ar' ? 'لغز التقويم اليومي المتجدد' : 'Daily calendar puzzle progression',
          icon: Calendar,
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'mega_weekly':
        return {
          title: t.modeMegaTitle,
          subtitle: lang === 'ar' ? 'مراحل عملاقة 9×9 فائقة التحدي (+120 عملة)' : 'Colossal 9×9 master challenge (+120 coins)',
          icon: Crown,
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        };
      case 'custom':
      default:
        return {
          title: t.modeCustomTitle,
          subtitle: lang === 'ar' ? 'توليد مراحل حرة بالمقاس المختار' : 'Endless puzzles with your custom settings',
          icon: Dices,
          badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        };
    }
  };

  const activeModeDetails = getModeInfo(selectedMode);
  const ActiveIcon = activeModeDetails.icon;

  const tiersList: Array<{ id: Difficulty; label: string; size: string }> = [
    { id: 'warmup', label: t.tierWarmup, size: '5×5' },
    { id: 'medium', label: t.tierMedium, size: '6×6' },
    { id: 'hard', label: t.tierHard, size: '7×7' },
    { id: 'expert', label: t.tierExpert, size: '8×8' },
  ];

  // Compact mode list configuration
  const modeCards: Array<{
    id: GameMode;
    title: string;
    tag: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [
    {
      id: 'levels',
      title: t.modeLevelsTitle,
      tag: lang === 'ar' ? '24 مرحلة + مستمر' : '24 Levels + Endless',
      icon: Layers,
      accentColor: 'text-amber-400 bg-amber-400/15',
    },
    {
      id: 'timerush',
      title: t.modeTimeRushTitle,
      tag: lang === 'ar' ? 'عداد 60 ثانية' : '60s Blitz',
      icon: Zap,
      accentColor: 'text-orange-400 bg-orange-400/15',
    },
    {
      id: 'suddendeath',
      title: t.modeSuddenDeathTitle,
      tag: lang === 'ar' ? 'بدون أي تراجع' : '0 Backtracks',
      icon: Skull,
      accentColor: 'text-rose-400 bg-rose-500/15',
    },
    {
      id: 'daily',
      title: t.modeDailyTitle,
      tag: isDailyDone
        ? (lang === 'ar' ? 'مكتمل اليوم ✓' : 'Solved today ✓')
        : (lang === 'ar' ? 'لغز اليوم جاهز' : 'Available now'),
      icon: Calendar,
      accentColor: 'text-emerald-400 bg-emerald-500/15',
    },
    {
      id: 'mega_weekly',
      title: t.modeMegaTitle,
      tag: lang === 'ar' ? 'رقعة 9×9 عملاقة' : 'Colossal 9×9',
      icon: Crown,
      accentColor: 'text-purple-400 bg-purple-500/15',
    },
    {
      id: 'custom',
      title: t.modeCustomTitle,
      tag: lang === 'ar' ? 'لعب حر ومقاسات' : 'Custom Sandbox',
      icon: Dices,
      accentColor: 'text-sky-400 bg-sky-500/15',
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto space-y-3 animate-fade-in py-1">
      {/* Toast Alert */}
      {claimToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-amber-300 text-xs font-bold py-2 px-4 rounded-xl shadow-xl border border-amber-400/80 backdrop-blur-sm animate-fade-in whitespace-nowrap">
          {claimToast}
        </div>
      )}

      {/* 1. Header: Profile avatar, Streak & Daily Claim */}
      <div
        className={`flex items-center justify-between p-2.5 px-3.5 rounded-2xl border transition-all ${
          isDarkMode
            ? 'bg-[#0f172a]/80 border-[#1e2942]'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 min-w-0 text-start cursor-pointer group"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform ${
              isDarkMode
                ? 'bg-amber-400/15 border border-amber-400/30'
                : 'bg-amber-100 border border-amber-300'
            }`}
          >
            {playerProfile.avatar}
          </div>
          <div className="min-w-0">
            <div className="font-serif font-black text-xs sm:text-sm leading-tight truncate group-hover:text-amber-400 transition-colors">
              {playerProfile.name}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 mt-0.5">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500 shrink-0" />
              <span>{playerStats.currentStreak} {lang === 'ar' ? 'أيام متتالية' : 'day streak'}</span>
            </div>
          </div>
        </button>

        {/* Daily Reward Claim */}
        <div>
          {canClaim ? (
            <button
              onClick={handleClaimReward}
              title={lang === 'ar' ? 'استلم مكافأة اليوم (+50 عملة)' : 'Claim Daily +50'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all animate-pulse"
            >
              <Gift className="w-4 h-4" />
              <span>+50 🪙</span>
            </button>
          ) : (
            <span
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-xl ${
                isDarkMode
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{lang === 'ar' ? 'المكافأة مستلمة' : 'Claimed'}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Hero Play Area (Uncluttered, Focused on Playing) */}
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border-2 transition-all ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#121c33] via-[#0f172a] to-[#0a101d] border-amber-400/50 shadow-md shadow-amber-500/5'
            : 'bg-gradient-to-br from-amber-50/70 via-white to-amber-100/30 border-amber-400/70 shadow-xs'
        }`}
      >
        <div className="space-y-3">
          {/* Active Mode Tag & Continuity Notice */}
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${activeModeDetails.badgeColor}`}>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{t.activeModeBadge}</span>
            </span>

            <span className={`text-[10.5px] font-semibold flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{lang === 'ar' ? 'المراحل مستمرة تلقائياً' : 'Continuous mode'}</span>
            </span>
          </div>

          {/* Active Mode Title & Icon */}
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                isDarkMode ? 'bg-amber-400/20 border-amber-400/40 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-800'
              }`}
            >
              <ActiveIcon className="w-6 h-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-serif font-black leading-tight truncate">
                {activeModeDetails.title}
              </h2>
              <p className={`text-xs mt-0.5 truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {activeModeDetails.subtitle}
              </p>
            </div>
          </div>

          {/* If Levels Mode is active: Compact 4-pill tier selector */}
          {selectedMode === 'levels' && (
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {tiersList.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => {
                    sound.playPop();
                    onSelectMode('levels', tier.id);
                  }}
                  className={`py-1.5 px-1 rounded-xl text-center text-xs font-black border transition-all cursor-pointer ${
                    selectedTier === tier.id
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : isDarkMode
                      ? 'bg-[#18233c] text-slate-300 border-[#2b3c5e] hover:bg-[#202e4d]'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-mono text-[11px] leading-tight">{tier.size}</div>
                  <div className="text-[9.5px] truncate mt-0.5">{tier.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onLaunchSelectedMode}
            className="w-full py-3 px-4 font-black text-sm sm:text-base rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 text-slate-950 shadow-sm border border-amber-300 active:scale-98 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span className="truncate">
              {lang === 'ar' ? 'بدء / متابعة اللعب' : 'Play Selected Mode'}
            </span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
          </button>
        </div>
      </div>

      {/* 3. Compact Mode Selector (Clean 2-Column Grid, No Bloat) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-serif font-black flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.selectGameMode}</span>
          </span>
          <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'ar' ? 'المراحل القادمة ستتبع اختيارك' : 'All next stages follow chosen mode'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {modeCards.map(mode => {
            const isSelected = selectedMode === mode.id;
            const Icon = mode.icon;

            return (
              <button
                key={mode.id}
                onClick={() => {
                  sound.playPop();
                  onSelectMode(mode.id, mode.id === 'levels' ? selectedTier : undefined);
                }}
                className={`p-2.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-center gap-2.5 relative group ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-amber-400/15 border-amber-400 shadow-xs'
                      : 'bg-amber-50 border-amber-400 shadow-xs'
                    : isDarkMode
                    ? 'bg-[#0f172a]/80 border-[#1e2942] hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-amber-400 text-slate-950 font-black' : mode.accentColor
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-serif font-black text-xs truncate">
                      {mode.title}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </div>
                  <span
                    className={`block text-[10px] truncate mt-0.5 ${
                      isSelected
                        ? 'text-amber-400 font-bold'
                        : isDarkMode
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {mode.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Daily Challenge Bar (Slim, only when not active mode) */}
      {selectedMode !== 'daily' && (
        <div
          onClick={onPlayDaily}
          className={`p-2.5 px-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            isDarkMode
              ? 'bg-[#0f172a]/70 border-[#1e2942] hover:border-emerald-500/40'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="font-serif font-black text-xs truncate">
                {lang === 'ar' ? 'لغز اليوم (تحدي التقويم)' : 'Daily Calendar Challenge'}
              </div>
              <div className={`text-[10px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isDailyDone
                  ? (lang === 'ar' ? 'أُنجز اليوم بنجاح ✓' : 'Completed today ✓')
                  : (lang === 'ar' ? `${dailyPuzzle.width}×${dailyPuzzle.height} · اضغط للحل السريع` : `${dailyPuzzle.width}×${dailyPuzzle.height} · Tap to solve`)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 shrink-0">
            <span>{isDailyDone ? (lang === 'ar' ? 'محلول' : 'Solved') : (lang === 'ar' ? 'العب' : 'Play')}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </div>
        </div>
      )}
    </div>
  );
};
