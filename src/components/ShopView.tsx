import React, { useState } from 'react';
import { PlayerProfile, ShopItem, PathTheme, BoardTheme, TokenTheme, ShopCategory } from '../types/game';
import { SHOP_ITEMS, buyItem, equipItem } from '../utils/profile';
import { translations, Language } from '../i18n/translations';
import { Coins, Check, ShoppingBag, Eye, Lightbulb, Tv, Flame } from 'lucide-react';
import { sound } from '../utils/audio';
import { getThemeStyles } from '../utils/theme';

interface ShopViewProps {
  profile: PlayerProfile;
  onUpdateProfile: (newProfile: PlayerProfile) => void;
  onOpenAdModal?: () => void;
  lang: Language;
  isDarkMode?: boolean;
}

export const ShopView: React.FC<ShopViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenAdModal,
  lang,
  isDarkMode = true,
}) => {
  const [activeTab, setActiveTab] = useState<ShopCategory>('path');
  const [previewItem, setPreviewItem] = useState<ShopItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const t = translations[lang];

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeTab);

  // Compute preview theme
  const previewPath: PathTheme = previewItem?.category === 'path' ? (previewItem.themeValue as PathTheme) : profile.equippedPath;
  const previewBoard: BoardTheme = previewItem?.category === 'board' ? (previewItem.themeValue as BoardTheme) : profile.equippedBoard;
  const previewToken: TokenTheme = previewItem?.category === 'token' ? (previewItem.themeValue as TokenTheme) : profile.equippedToken;
  const previewStyles = getThemeStyles(previewPath, previewBoard, previewToken);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuy = (item: ShopItem) => {
    const res = buyItem(item.id);
    if (res.success) {
      onUpdateProfile(res.profile);
      sound.playCheckpoint(3);
      showToast(lang === 'ar' ? res.message : `Acquired ${item.name}!`);
    } else {
      sound.playInvalid();
      showToast(lang === 'ar' ? res.message : 'Not enough coins!');
    }
  };

  const handleEquip = (item: ShopItem) => {
    const updated = equipItem(item.id);
    onUpdateProfile(updated);
    sound.playStep(2);
    showToast(lang === 'ar' ? `تم تجهيز ${item.nameAr}` : `Equipped ${item.name}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 animate-fade-in py-2">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 z-50 bg-stone-900 text-amber-300 text-xs font-bold py-2.5 px-5 rounded-2xl shadow-xl border border-stone-800 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header and Compact Wallet Balance */}
      <div
        className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-colors gap-2 ${
          isDarkMode ? 'bg-[#0f172a]/90 border-[#1e2942]' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="min-w-0">
          <h2 className={`text-sm sm:text-base font-serif font-black flex items-center gap-2 truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <ShoppingBag className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t.shopTitle}</span>
          </h2>
          <p className={`text-[11px] mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.shopSubtitle}</p>
        </div>

        {/* Badges: Coins & Hints Inventory */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Hints Inventory & Quick Free Ad */}
          <button
            onClick={onOpenAdModal}
            title={lang === 'ar' ? 'تلميحاتك (شاهد إعلاناً للحصول على +2)' : 'Hints (Watch ad for +2)'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-colors ${
              isDarkMode
                ? 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-950'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="tabular-nums">{profile.hints || 0}</span>
            <span className="text-[10px] text-amber-400 font-bold opacity-80">+2📺</span>
          </button>

          {/* Coins Wallet */}
          <div
            title="Coins Balance"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
              isDarkMode
                ? 'bg-[#131d33] border-[#223554] text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="tabular-nums">{profile.coins}</span>
          </div>
        </div>
      </div>

      {/* Live Mini Board Preview Box (Visible for Board, Path, and Token tabs) */}
      {(activeTab === 'path' || activeTab === 'board' || activeTab === 'token') && (
        <div
          className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 ${
            isDarkMode ? 'bg-[#121a2f] border-[#1e2942]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-start w-full sm:w-auto">
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'معاينة فورية للرقعة' : 'Live Board Preview'}</span>
            </span>
            <h4 className={`font-serif font-black text-xs sm:text-sm mt-0.5 truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {previewItem ? (lang === 'ar' ? `معاينة: ${previewItem.nameAr}` : `Preview: ${previewItem.name}`) : (lang === 'ar' ? 'المظهر المجهز حالياً' : 'Currently Equipped Look')}
            </h4>
            <p className={`text-[10px] sm:text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'ar' ? 'هكذا سيبدو شريطك ورقعتك وأرقامك داخل اللعبة' : 'How your board, ribbon, & tokens appear in-game'}
            </p>
          </div>

          {/* Mini 3x3 Showcase */}
          <div
            dir="ltr"
            className={`w-32 h-32 sm:w-36 sm:h-36 ${previewStyles.boardBgClass} rounded-2xl p-2 border ${previewStyles.boardBorderClass} relative shadow-md shrink-0`}
          >
            <div className="grid grid-cols-3 gap-1 w-full h-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(cell => {
                const isPath = [1, 2, 5, 8, 9].includes(cell);
                const isCp1 = cell === 1;
                const isCp2 = cell === 9;

                return (
                  <div
                    key={cell}
                    className={`rounded-lg flex items-center justify-center text-[10px] font-extrabold transition-colors ${
                      isPath ? previewStyles.cellVisitedClass : previewStyles.cellUnvisitedClass
                    }`}
                  >
                    {isCp1 ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        1
                      </span>
                    ) : isCp2 ? (
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${previewStyles.tokenTargetClass}`}>
                        2
                      </span>
                    ) : (
                      isPath && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: previewStyles.pathGradientStart }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mini SVG path line */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] pointer-events-none"
            >
              <path
                d="M 16.6 16.6 L 50 16.6 L 50 50 L 50 83.3 L 83.3 83.3"
                fill="none"
                stroke={previewStyles.pathGradientStart}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Category Segmented Control (5 Tabs) */}
      <div
        className={`grid grid-cols-5 gap-1 p-1 rounded-2xl border ${
          isDarkMode ? 'bg-[#131d33] border-[#223554]' : 'bg-slate-200 border-slate-300'
        }`}
      >
        <button
          onClick={() => {
            setActiveTab('path');
            setPreviewItem(null);
          }}
          className={`py-1.5 sm:py-2 px-1 text-[10px] sm:text-xs font-black rounded-xl transition-all cursor-pointer truncate ${
            activeTab === 'path'
              ? isDarkMode
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-950 text-white shadow-xs'
              : isDarkMode
              ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          {t.tabPaths}
        </button>

        <button
          onClick={() => {
            setActiveTab('board');
            setPreviewItem(null);
          }}
          className={`py-1.5 sm:py-2 px-1 text-[10px] sm:text-xs font-black rounded-xl transition-all cursor-pointer truncate ${
            activeTab === 'board'
              ? isDarkMode
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-950 text-white shadow-xs'
              : isDarkMode
              ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          {t.tabBoards}
        </button>

        <button
          onClick={() => {
            setActiveTab('token');
            setPreviewItem(null);
          }}
          className={`py-1.5 sm:py-2 px-1 text-[10px] sm:text-xs font-black rounded-xl transition-all cursor-pointer truncate ${
            activeTab === 'token'
              ? isDarkMode
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-950 text-white shadow-xs'
              : isDarkMode
              ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          {t.tabTokens}
        </button>

        <button
          onClick={() => {
            setActiveTab('hints');
            setPreviewItem(null);
          }}
          className={`py-1.5 sm:py-2 px-1 text-[10px] sm:text-xs font-black rounded-xl transition-all cursor-pointer truncate ${
            activeTab === 'hints'
              ? isDarkMode
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-950 text-white shadow-xs'
              : isDarkMode
              ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          {t.tabHints}
        </button>

        <button
          onClick={() => {
            setActiveTab('avatar');
            setPreviewItem(null);
          }}
          className={`py-1.5 sm:py-2 px-1 text-[10px] sm:text-xs font-black rounded-xl transition-all cursor-pointer truncate ${
            activeTab === 'avatar'
              ? isDarkMode
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-950 text-white shadow-xs'
              : isDarkMode
              ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          {t.tabAvatars}
        </button>
      </div>

      {/* Free Hints Header Banner for Hints Tab */}
      {activeTab === 'hints' && (
        <div
          className={`p-3 sm:p-4 rounded-2xl border-2 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDarkMode
              ? 'bg-gradient-to-r from-amber-500/15 via-[#1a2642] to-[#121a2f] border-amber-400/40 text-white'
              : 'bg-amber-50 border-amber-300 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Lightbulb className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black flex items-center gap-2">
                <span>{lang === 'ar' ? 'مخزون المساعدات الحالي:' : 'Your Hint Inventory:'}</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-xs">
                  {profile.hints || 0} {lang === 'ar' ? 'تلميحات' : 'Hints'}
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] font-bold mt-0.5 ${isDarkMode ? 'text-amber-200' : 'text-amber-900'}`}>
                {lang === 'ar'
                  ? 'استخدم العملات للشراء، أو شاهد إعلاناً قصيراً لربح +2 تلميحات مجاناً!'
                  : 'Buy with coins or watch a quick rewarded ad to get +2 free hints!'}
              </p>
            </div>
          </div>

          {onOpenAdModal && (
            <button
              onClick={onOpenAdModal}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm rounded-xl border border-amber-300 shadow-md cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-all"
            >
              <Tv className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إعلان مجاني (+2)' : 'Free Ad (+2)'}</span>
            </button>
          )}
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
        {filteredItems.map(item => {
          const isUnlocked = profile.unlockedItems.includes(item.id);
          const isEquipped =
            (item.category === 'path' && profile.equippedPath === item.themeValue) ||
            (item.category === 'board' && profile.equippedBoard === item.themeValue) ||
            (item.category === 'token' && profile.equippedToken === item.themeValue) ||
            (item.category === 'avatar' && profile.avatar === item.avatarChar);

          const isCurrentlyPreviewed = previewItem?.id === item.id;
          const canAfford = profile.coins >= item.price;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.category === 'path' || item.category === 'board' || item.category === 'token') {
                  setPreviewItem(item);
                }
              }}
              className={`relative p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 text-start transition-all flex flex-col justify-between cursor-pointer ${
                isCurrentlyPreviewed
                  ? isDarkMode
                    ? 'ring-2 ring-amber-400 bg-amber-400/20 border-amber-400 shadow-xs'
                    : 'ring-2 ring-amber-500 bg-amber-50/60 border-amber-400 shadow-xs'
                  : isEquipped
                  ? isDarkMode
                    ? 'bg-[#16233d] border-amber-400/70 shadow-2xs'
                    : 'bg-amber-50/40 border-amber-300 shadow-2xs'
                  : isDarkMode
                  ? 'bg-[#121a2f] border-[#1e2942] hover:border-amber-400/50 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Popular Badge */}
              {item.isPopular && (
                <span className="absolute -top-2.5 end-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] shadow-sm border border-amber-300 flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 fill-slate-950" />
                  <span>{lang === 'ar' ? 'مميز' : 'Popular'}</span>
                </span>
              )}

              <div className="space-y-2 sm:space-y-2.5">
                {/* Visual Swatch / Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    {item.category === 'hints' ? (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        <Lightbulb className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </div>
                    ) : item.category === 'avatar' ? (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-xl shrink-0 shadow-xs">
                        {item.avatarChar}
                      </div>
                    ) : (
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-xs border border-white/20 flex items-center justify-center font-bold text-white text-xs shrink-0"
                        style={{ backgroundColor: item.preview }}
                      >
                        {item.category === 'token' ? '1' : ''}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className={`font-serif font-black text-xs sm:text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {lang === 'ar' ? item.nameAr : item.name}
                      </h4>
                      <p className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 line-clamp-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.descAr}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button & Price */}
              <div className={`pt-3 flex items-center justify-between border-t mt-3 ${isDarkMode ? 'border-[#1e2942]' : 'border-slate-200'}`}>
                <div
                  className={`flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg border ${
                    isDarkMode
                      ? 'text-amber-300 bg-amber-400/20 border-amber-400/40'
                      : 'text-amber-950 bg-amber-50 border-amber-300'
                  }`}
                >
                  {item.price === 0 ? (
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{lang === 'ar' ? 'مجاني' : 'Free'}</span>
                  ) : (
                    <>
                      <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="tabular-nums font-black">{item.price}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  {item.category === 'hints' ? (
                    /* Hint pack purchase button */
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`py-1.5 px-3.5 text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 border border-amber-300'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'ar' ? `اقتناء (+${item.hintAmount})` : `Buy (+${item.hintAmount})`}</span>
                    </button>
                  ) : isEquipped ? (
                    <span className="flex items-center gap-1 py-1.5 px-3 text-xs font-black text-slate-950 bg-amber-400 rounded-xl border border-amber-300 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>{t.equipped}</span>
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleEquip(item)}
                      className={`py-1.5 px-3.5 text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isDarkMode
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-300'
                          : 'bg-slate-950 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {t.equip}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`py-1.5 px-3.5 text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 border border-amber-300'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                      }`}
                    >
                      {t.buy}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
