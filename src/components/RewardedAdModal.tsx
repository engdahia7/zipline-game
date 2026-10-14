import React, { useState, useEffect } from 'react';
import { X, Tv, Coins, Check, ShoppingBag, Lightbulb } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { Language } from '../i18n/translations';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted: (hintsToAdd: number) => void;
  onRewardCoinsGranted?: (coinsToAdd: number) => void;
  coins: number;
  onBuyQuickHints?: () => void;
  onBuySingleHint?: () => void;
  onOpenShop?: () => void;
  lang: Language;
  isDarkMode?: boolean;
}

type RewardType = 'hints' | 'coins';

interface AdCampaign {
  id: string;
  badge: string;
  title: string;
  titleEn: string;
  tagline: string;
  taglineEn: string;
  color: string;
  iconChar: string;
}

const AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'zipline_pro',
    badge: 'تطبيق موصى به',
    title: 'ZipLine — طريق العباقرة',
    titleEn: 'ZipLine — Master Logic',
    tagline: 'صل الأرقام بالترتيب واملأ كافة المربعات لتنشيط الذاكرة والتركيز!',
    taglineEn: 'Connect numbers in sequence and fill every cell to sharpen cognition!',
    color: 'from-indigo-950 via-slate-900 to-amber-950',
    iconChar: '⚡',
  },
  {
    id: 'brain_gym',
    badge: 'تدريب يومي',
    title: 'نادي تدريب الدماغ والتركيز',
    titleEn: 'Brain Fitness Academy',
    tagline: '٥ دقائق يومياً من التفكير الاستراتيجي تقيك من التشتت وتزيد الإنتاجية.',
    taglineEn: '5 minutes of daily strategic logic enhances concentration and memory.',
    color: 'from-emerald-950 via-slate-900 to-teal-950',
    iconChar: '🧠',
  },
  {
    id: 'championship',
    badge: 'بطولة كبرى',
    title: 'بطولة المسار الذهبي الكبرى',
    titleEn: 'Grand Puzzle Championship',
    tagline: 'نافس في حل أصعب شبكات ٨×٨ واكسب الكؤوس الذهبية الرفيعة!',
    taglineEn: 'Compete in solving expert 8x8 grids and claim prestigious trophies!',
    color: 'from-amber-950 via-stone-900 to-purple-950',
    iconChar: '🏆',
  },
];

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardGranted,
  onRewardCoinsGranted,
  coins,
  onBuyQuickHints,
  onBuySingleHint,
  onOpenShop,
  lang,
  isDarkMode = true,
}) => {
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adSecondsLeft, setAdSecondsLeft] = useState(5);
  const [adCompleted, setAdCompleted] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardType>('hints');
  const [currentCampaign, setCurrentCampaign] = useState<AdCampaign>(AD_CAMPAIGNS[0]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlayingAd(false);
      setAdSecondsLeft(5);
      setAdCompleted(false);
      return;
    }
    // Randomize campaign on open
    const randIdx = Math.floor(Math.random() * AD_CAMPAIGNS.length);
    setCurrentCampaign(AD_CAMPAIGNS[randIdx]);
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAd && adSecondsLeft > 0) {
      timer = setInterval(() => {
        setAdSecondsLeft(prev => {
          if (prev <= 1) {
            setAdCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingAd, adSecondsLeft]);

  if (!isOpen) return null;

  const handleStartAd = (reward: RewardType) => {
    setSelectedReward(reward);
    setIsPlayingAd(true);
    setAdSecondsLeft(5);
    setAdCompleted(false);
    sound.playStep(1);
  };

  const handleClaimReward = () => {
    sound.playWin();
    triggerConfetti();

    if (selectedReward === 'hints') {
      onRewardGranted(2);
    } else {
      if (onRewardCoinsGranted) {
        onRewardCoinsGranted(35);
      } else {
        onRewardGranted(2);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div
        className={`relative w-full max-w-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-2 transition-all ${
          isDarkMode
            ? 'bg-[#121a2f] border-[#1e2942] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        {!isPlayingAd && (
          <button
            onClick={onClose}
            aria-label="Close"
            className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-[#1a2642]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {!isPlayingAd ? (
          /* Choice Screen */
          <div className="space-y-3.5 text-center pt-1">
            {/* Header Icon */}
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 fill-amber-400 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base sm:text-xl font-serif font-black">
                {lang === 'ar' ? 'المساعدات والتلميحات المجانية' : 'Free Hints & Rewards'}
              </h3>
              <p className={`text-[11px] sm:text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {lang === 'ar'
                  ? 'اختر مشاهدة إعلان قصير لمدة 5 ثوانٍ، أو اقتنِ حزمة تلميحات فورية باستخدام عملاتك.'
                  : 'Watch a 5-sec rewarded ad or buy an instant hint pack with your gold coins.'}
              </p>
            </div>

            {/* Rewarded Ad Option 1: Hints */}
            <button
              onClick={() => handleStartAd('hints')}
              className="w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 active:scale-98 transition-all cursor-pointer text-slate-950 font-black shadow-lg shadow-amber-500/25 flex items-center justify-between border border-amber-300 gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-start min-w-0">
                  <div className="text-xs sm:text-sm font-black truncate">
                    {lang === 'ar' ? 'شاهد إعلاناً واحصل على تلميحات' : 'Watch Ad for Free Hints'}
                  </div>
                  <div className="text-[10px] text-slate-900 font-bold opacity-80">
                    {lang === 'ar' ? 'مدة الإعلان 5 ثوانٍ فقط' : 'Only 5 seconds'}
                  </div>
                </div>
              </div>

              <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 text-xs font-black shrink-0 border border-amber-400/60 shadow-xs whitespace-nowrap">
                +2 {lang === 'ar' ? 'تلميحات' : 'Hints'}
              </span>
            </button>

            {/* Rewarded Ad Option 2: Coins */}
            {onRewardCoinsGranted && (
              <button
                onClick={() => handleStartAd('coins')}
                className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex items-center justify-between text-start cursor-pointer active:scale-98 gap-2 ${
                  isDarkMode
                    ? 'bg-[#16233d] hover:bg-[#1c2c4d] border-amber-400/40 text-white'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
                    <Coins className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black truncate">
                      {lang === 'ar' ? 'شاهد إعلاناً للحصول على عملات' : 'Watch Ad for Gold Coins'}
                    </div>
                    <div className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {lang === 'ar' ? 'مكافأة مميزة لدعم رصيدك' : 'Free coins reward'}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-black shrink-0 whitespace-nowrap">
                  +35 🪙
                </span>
              </button>
            )}

            {/* Quick Buy Options with Coins */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold px-1 text-slate-400">
                <span>{lang === 'ar' ? 'أو الشراء المباشر بالعملات:' : 'Or buy with coins:'}</span>
                <span className="text-amber-400">{coins} 🪙</span>
              </div>

              {/* Single hint quick buy */}
              {onBuySingleHint && (
                <button
                  onClick={onBuySingleHint}
                  disabled={coins < 20}
                  className={`w-full p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-between text-start cursor-pointer active:scale-98 ${
                    coins >= 20
                      ? isDarkMode
                        ? 'bg-[#131d33] hover:bg-[#1a2744] border-[#223554] text-white'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900'
                      : 'opacity-50 cursor-not-allowed bg-slate-800/40 border-slate-700 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black">{lang === 'ar' ? 'تلميح فردي سريع' : '1 Quick Hint'}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-400">20 🪙</span>
                </button>
              )}

              {/* 3 Hints Pack */}
              {onBuyQuickHints && (
                <button
                  onClick={onBuyQuickHints}
                  disabled={coins < 50}
                  className={`w-full p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-between text-start cursor-pointer active:scale-98 ${
                    coins >= 50
                      ? isDarkMode
                        ? 'bg-[#131d33] hover:bg-[#1a2744] border-amber-400/40 text-white'
                        : 'bg-white hover:bg-amber-50 border-amber-300 text-slate-900'
                      : 'opacity-50 cursor-not-allowed bg-slate-800/40 border-slate-700 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black">{lang === 'ar' ? 'حزمة 3 تلميحات' : '3 Hints Pack'}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-400">50 🪙</span>
                </button>
              )}
            </div>

            {/* Option 3: Go to Shop */}
            {onOpenShop && (
              <button
                onClick={() => {
                  onClose();
                  onOpenShop();
                }}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  isDarkMode
                    ? 'border-[#223554] text-slate-300 hover:text-white hover:bg-[#1a2642]'
                    : 'border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'زيارة المتجر لتصفح كافة الحزم' : 'Browse All Packs in Shop'}</span>
              </button>
            )}
          </div>
        ) : (
          /* Playing Ad View */
          <div className="space-y-4 text-center py-2">
            {/* Top countdown badge */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Tv className="w-3.5 h-3.5" />
                <span>{currentCampaign.badge}</span>
              </span>

              <span className="text-xs font-mono font-black px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-amber-300 tabular-nums">
                {adCompleted ? (
                  lang === 'ar' ? 'اكتمل ✓' : 'Done ✓'
                ) : (
                  lang === 'ar' ? `${adSecondsLeft} ثوانٍ` : `${adSecondsLeft}s`
                )}
              </span>
            </div>

            {/* Simulated Video Ad Screen Container */}
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentCampaign.color} p-5 sm:p-6 border-2 border-amber-400/40 shadow-inner min-h-[180px] flex flex-col justify-between`}>
              <div className="relative z-10 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-serif font-black text-2xl shadow-lg shadow-amber-400/30 animate-pulse">
                  {currentCampaign.iconChar}
                </div>
                <h4 className="font-serif font-black text-sm text-white">
                  {lang === 'ar' ? currentCampaign.title : currentCampaign.titleEn}
                </h4>
                <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                  {lang === 'ar' ? currentCampaign.tagline : currentCampaign.taglineEn}
                </p>
              </div>

              {/* Progress Bar of the ad */}
              <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden mt-4 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-300 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - adSecondsLeft) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Claim button once finished */}
            {adCompleted ? (
              <button
                onClick={handleClaimReward}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 hover:brightness-105 active:scale-98 transition-all cursor-pointer text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 border border-emerald-300 animate-bounce"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>
                  {selectedReward === 'hints'
                    ? lang === 'ar'
                      ? 'استلام المكافأة: +2 تلميحات مجاناً!'
                      : 'Claim Reward: +2 Free Hints!'
                    : lang === 'ar'
                    ? 'استلام المكافأة: +35 عملة مجاناً!'
                    : 'Claim Reward: +35 Free Coins!'}
                </span>
              </button>
            ) : (
              <div className="py-2.5 text-xs font-bold text-amber-300 animate-pulse">
                ⏳ {lang === 'ar' ? 'جارِ عرض الإعلان... انتظر لاكتمال العداد' : 'Ad in progress... Please wait'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
