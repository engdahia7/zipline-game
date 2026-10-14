import React, { useState } from 'react';
import { PlayerProfile, PlayerStats } from '../types/game';
import { ACHIEVEMENTS_LIST, AVATAR_OPTIONS, savePlayerProfile, addCoinsToProfile, setHintLimitPreference } from '../utils/profile';
import { translations, Language } from '../i18n/translations';
import { User, Trophy, Flame, Target, Clock, Coins, Check, Edit3, Award, Lightbulb, SlidersHorizontal, Tv } from 'lucide-react';
import { sound } from '../utils/audio';

interface ProfileViewProps {
  profile: PlayerProfile;
  stats: PlayerStats;
  onUpdateProfile: (newProfile: PlayerProfile) => void;
  onResetAllData?: () => void;
  lang: Language;
  isDarkMode?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  stats,
  onUpdateProfile,
  onResetAllData,
  lang,
  isDarkMode = true,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [isPickingAvatar, setIsPickingAvatar] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const t = translations[lang];
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const formatTime = (secs: number | null) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      const updated = { ...profile, name: nameInput.trim() };
      savePlayerProfile(updated);
      onUpdateProfile(updated);
      setIsEditingName(false);
      sound.playStep(1);
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    const updated = { ...profile, avatar };
    savePlayerProfile(updated);
    onUpdateProfile(updated);
    setIsPickingAvatar(false);
    sound.playCheckpoint(1);
  };

  const handleClaimAchievement = (achId: string, reward: number) => {
    if (profile.achievementsUnlocked.includes(achId)) return;
    const updated = {
      ...profile,
      coins: profile.coins + reward,
      achievementsUnlocked: [...profile.achievementsUnlocked, achId],
    };
    savePlayerProfile(updated);
    onUpdateProfile(updated);
    sound.playCheckpoint(4);
    setToast(lang === 'ar' ? `تهانينا! حصلت على +${reward} عملة!` : `Achievement unlocked! +${reward} coins!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-fade-in py-2">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 z-50 bg-stone-900 text-amber-300 text-xs font-bold py-2.5 px-5 rounded-2xl shadow-xl border border-stone-800 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Profile Card Header */}
      <div
        className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 ${
          isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Avatar button */}
          <button
            onClick={() => setIsPickingAvatar(!isPickingAvatar)}
            title={t.changeAvatar}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl border flex items-center justify-center text-2xl sm:text-3xl shadow-xs hover:scale-105 transition-transform cursor-pointer relative group shrink-0 ${
              isDarkMode
                ? 'bg-amber-400/20 border-amber-400/50'
                : 'bg-amber-100 border-amber-300'
            }`}
          >
            <span>{profile.avatar}</span>
            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-400 rounded-full text-slate-950 text-[10px] shadow-xs">
              <Edit3 className="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
          </button>

          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  maxLength={20}
                  className={`px-3 py-1.5 rounded-xl border font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-full max-w-[180px] ${
                    isDarkMode
                      ? 'bg-[#1a2642] border-[#27375a] text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 sm:p-2 rounded-xl bg-amber-400 text-slate-950 font-black cursor-pointer hover:bg-amber-300 shrink-0"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className={`text-base sm:text-xl font-serif font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  {profile.name}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-[#1a2642]'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className={`text-[11px] sm:text-xs font-medium mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'ar' ? 'رتبة: أستاذ الألغاز المتقدم' : 'Rank: Puzzle Maestro'}
            </p>
          </div>
        </div>

        {/* Wallet Badges: Coins & Hints */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Hints Inventory */}
          <div
            title="Hints Inventory"
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border font-black text-xs sm:text-sm shadow-2xs ${
              isDarkMode
                ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="tabular-nums font-mono">{profile.hints || 0}</span>
          </div>

          {/* Coins Wallet */}
          <div
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border font-black text-xs sm:text-sm shadow-2xs ${
              isDarkMode
                ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                : 'bg-amber-100 border-amber-300 text-amber-950'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="tabular-nums font-mono">{profile.coins}</span>
          </div>
        </div>
      </div>


      {/* Avatar Picker Drawer */}
      {isPickingAvatar && (
        <div
          className={`p-4 rounded-3xl border space-y-2 animate-fade-in ${
            isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <h4 className={`text-xs font-bold px-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t.changeAvatar}</h4>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {AVATAR_OPTIONS.map(av => (
              <button
                key={av}
                onClick={() => handleSelectAvatar(av)}
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer ${
                  profile.avatar === av
                    ? 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-400/20'
                    : isDarkMode
                    ? 'bg-[#1a2642] border-[#27375a]'
                    : 'bg-white border-slate-200'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Player Career Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center text-center shadow-xs ${
            isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
          }`}
        >
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500 mb-0.5" />
          <span className={`text-[10px] sm:text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.streak}</span>
          <span className={`text-base sm:text-lg font-black tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{stats.currentStreak}</span>
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center text-center shadow-xs ${
            isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
          }`}
        >
          <Target className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} />
          <span className={`text-[10px] sm:text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.played}</span>
          <span className={`text-base sm:text-lg font-black tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{stats.gamesPlayed}</span>
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center text-center shadow-xs ${
            isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-0.5" />
          <span className={`text-[10px] sm:text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.winRate}</span>
          <span className={`text-base sm:text-lg font-black tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{winRate}%</span>
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center text-center shadow-xs ${
            isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-base sm:text-lg mb-0.5">⭐</span>
          <span className={`text-[10px] sm:text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{lang === 'ar' ? 'النجوم' : 'Stars'}</span>
          <span className="text-base sm:text-lg font-black text-amber-400 tabular-nums">
            {Object.values(stats.puzzleStars || {}).reduce((a, b) => a + b, 0)}
          </span>
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center text-center col-span-2 sm:col-span-1 shadow-xs ${
            isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
          }`}
        >
          <Clock className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} />
          <span className={`text-[10px] sm:text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.bestTime}</span>
          <span className={`text-sm sm:text-base font-black font-mono tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            {formatTime(stats.bestTime)}
          </span>
        </div>
      </div>

      {/* Hint Limit Settings Card */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border space-y-2.5 shadow-xs ${
          isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className={`font-serif font-black text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'ar' ? 'تحديد سقف المساعدات في الألغاز' : 'Puzzle Hint Limit Preference'}
            </h3>
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30">
            {profile.hintLimitPerPuzzle === 'unlimited'
              ? lang === 'ar'
                ? 'مفتوح ∞'
                : 'Unlimited'
              : `${profile.hintLimitPerPuzzle ?? 3} ${lang === 'ar' ? 'مساعدات' : 'hints'}`}
          </span>
        </div>

        <p className={`text-[11px] sm:text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {lang === 'ar'
            ? 'حدد الحد الأقصى للمساعدات المسموح باستخدامها في اللغز الواحد لاختبار مهاراتك الذهنية:'
            : 'Configure how many hints can be used in a single puzzle to calibrate your challenge:'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { val: 3 as const, labelAr: '3 مساعدات (قياسي)', labelEn: '3 Hints (Normal)' },
            { val: 1 as const, labelAr: 'مساعدة 1 (تحدي)', labelEn: '1 Hint (Hard)' },
            { val: 0 as const, labelAr: 'بدون مساعدات (خبير)', labelEn: '0 Hints (Pro)' },
            { val: 'unlimited' as const, labelAr: 'مفتوح (حر)', labelEn: 'Unlimited (Free)' },
          ].map(opt => {
            const isSelected = (profile.hintLimitPerPuzzle ?? 3) === opt.val;
            return (
              <button
                key={opt.val.toString()}
                onClick={() => {
                  const updated = setHintLimitPreference(opt.val);
                  onUpdateProfile(updated);
                  sound.playStep(2);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                    : isDarkMode
                    ? 'bg-[#16233d] border-[#1e2942] text-slate-300 hover:border-amber-400/50'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {lang === 'ar' ? opt.labelAr : opt.labelEn}
              </button>
            );
          })}
        </div>

        {/* Rewarded Ads summary stats */}
        <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${isDarkMode ? 'border-[#1e2942] text-slate-400' : 'border-slate-100 text-slate-500'}`}>
          <span className="flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'إجمالي إعلانات المساعدات المشاهدة:' : 'Total Rewarded Ads Watched:'}</span>
          </span>
          <span className="font-mono font-black text-amber-400">{profile.adsWatchedCount || 0}</span>
        </div>
      </div>

      {/* Achievements and Badges */}
      <div
        className={`p-5 rounded-3xl border space-y-3 ${
          isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
        }`}
      >
        <h3 className={`font-serif font-black text-base flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <Award className="w-5 h-5 text-amber-500" />
          <span>{t.achievements}</span>
        </h3>

        <div className="space-y-2">
          {ACHIEVEMENTS_LIST.map(ach => {
            const isClaimed = profile.achievementsUnlocked.includes(ach.id);
            let isEligible = false;
            if (ach.id === 'first_win' && stats.gamesWon >= 1) isEligible = true;
            if (ach.id === 'streak_3' && stats.currentStreak >= 3) isEligible = true;
            if (ach.id === 'expert_solver' && stats.completedPuzzles.some(id => id.includes('8x8') || id.startsWith('e'))) isEligible = true;
            if (ach.id === 'speed_demon' && stats.bestTime !== null && stats.bestTime < 60) isEligible = true;
            if (ach.id === 'collector' && profile.unlockedItems.length > 3) isEligible = true;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDarkMode
                    ? 'bg-[#16233d] border-[#1e2942]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-xl shadow-2xs ${
                      isDarkMode
                        ? 'bg-[#121a2f] border-[#27375a]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    {ach.icon}
                  </div>
                  <div>
                    <h5 className={`font-serif font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'ar' ? ach.titleAr : ach.titleEn}
                    </h5>
                    <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{ach.descAr}</p>
                  </div>
                </div>

                <div>
                  {isClaimed ? (
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border ${
                        isDarkMode
                          ? 'bg-[#121a2f] text-slate-400 border-slate-700'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'مكتمل' : 'Claimed'}</span>
                    </span>
                  ) : isEligible ? (
                    <button
                      onClick={() => handleClaimAchievement(ach.id, ach.rewardCoins)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-xs active:scale-95 flex items-center gap-1 border border-amber-300"
                    >
                      <Coins className="w-3.5 h-3.5 fill-current" />
                      <span>+{ach.rewardCoins}</span>
                    </button>
                  ) : (
                    <span className={`text-xs font-bold px-2 py-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      +{ach.rewardCoins} {lang === 'ar' ? 'عملة' : 'coins'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Data & Start Fresh Card */}
      {onResetAllData && (
        <div
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 space-y-3 ${
            isDarkMode ? 'bg-[#121a2f] border-rose-900/40' : 'bg-rose-50/50 border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`text-xs sm:text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'تصفير السجل والبدء من الصفر' : 'Reset All Stats & Start Fresh'}
              </h4>
              <p className={`text-[10px] sm:text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'ar'
                  ? 'تصفير الأيام المتتالية والعملات والألغاز المحلولة لبدء مسيرة حقيقية 100%'
                  : 'Clear all streaks, coins, and solved records to start from scratch'}
              </p>
            </div>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 rounded-xl border border-rose-400/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-black text-xs cursor-pointer transition-all shrink-0"
              >
                {lang === 'ar' ? 'تصفير السجل' : 'Reset Data'}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    onResetAllData();
                    setShowResetConfirm(false);
                    sound.playUndo();
                    setToast(lang === 'ar' ? 'تم تصفير السجل بنجاح!' : 'All stats reset to 0!');
                    setTimeout(() => setToast(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-xs active:scale-95"
                >
                  {lang === 'ar' ? 'تأكيد التصفير' : 'Confirm Reset'}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
