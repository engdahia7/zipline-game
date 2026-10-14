import React from 'react';
import { PageTab } from '../types/game';
import { translations, Language } from '../i18n/translations';
import { Volume2, VolumeX, HelpCircle, Coins, Home, Play, Layers, ShoppingBag, User, Sun, Moon, Lightbulb } from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  coins: number;
  hints?: number;
  onOpenAdModal?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenHowToPlay: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  coins,
  hints = 0,
  onOpenAdModal,
  soundEnabled,
  onToggleSound,
  lang,
  onToggleLang,
  onOpenHowToPlay,
  isDarkMode,
  onToggleTheme,
}) => {
  const t = translations[lang];

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-colors shadow-xs backdrop-blur-md border-b-2 ${
        isDarkMode
          ? 'bg-[#0b1120]/95 border-[#1e2a44] text-slate-100'
          : 'bg-white/95 border-slate-200/90 text-slate-900'
      }`}
    >
      <div className="max-w-4xl mx-auto px-2.5 sm:px-4 h-13 sm:h-15 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand Wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-start cursor-pointer group"
        >
          <div
            className={`w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-serif font-black text-base sm:text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0 ${
              isDarkMode
                ? 'bg-amber-400 text-slate-950 border border-amber-300'
                : 'bg-slate-950 text-amber-400 border border-slate-800'
            }`}
          >
            Z
          </div>
          <span
            className={`text-sm sm:text-lg md:text-xl font-serif font-black tracking-tight leading-none ${
              isDarkMode ? 'text-white' : 'text-slate-950'
            }`}
          >
            {t.appName}
          </span>
        </button>

        {/* Center Navigation Links (Desktop only, mobile uses bottom bar) */}
        <nav
          className={`hidden md:flex items-center gap-1 p-1 rounded-xl border ${
            isDarkMode ? 'bg-[#131d33] border-[#223554]' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => onSelectTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'home'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 text-white shadow-xs'
                : isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.navHome}</span>
          </button>

          <button
            onClick={() => onSelectTab('play')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'play'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 text-white shadow-xs'
                : isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{t.navPlay}</span>
          </button>

          <button
            onClick={() => onSelectTab('levels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'levels'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 text-white shadow-xs'
                : isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.navLevels}</span>
          </button>

          <button
            onClick={() => onSelectTab('shop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'shop'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-amber-500 text-stone-950 shadow-xs'
                : isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.navShop}</span>
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'profile'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 text-white shadow-xs'
                : isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-[#1a2744]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.navProfile}</span>
          </button>
        </nav>

        {/* Right Section: Compact Wallet & Clean Utility Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          {/* Unified Resources Capsule (Coins & Hints) */}
          <div
            onClick={() => onSelectTab('shop')}
            className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-mono font-bold cursor-pointer transition-colors shrink-0 ${
              isDarkMode
                ? 'bg-[#131d33] hover:bg-[#1a2744] border-[#223554] text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
            }`}
          >
            {/* Coins */}
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
              <span className="tabular-nums font-bold">{coins}</span>
            </div>
            <span aria-hidden="true" className="opacity-30">|</span>
            {/* Hints */}
            <div
              onClick={(e) => {
                if (onOpenAdModal) {
                  e.stopPropagation();
                  onOpenAdModal();
                }
              }}
              title={lang === 'ar' ? 'المساعدات (انقر للمزيد)' : 'Hints (click for more)'}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
              <span className="tabular-nums font-bold">{hints}</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? t.themeLight : t.themeDark}
            aria-label="Toggle theme"
            className={`w-6.5 h-6.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${
              isDarkMode
                ? 'text-amber-400 hover:bg-[#1a2744]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle sound"
            className={`w-6.5 h-6.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${
              isDarkMode
                ? 'text-slate-300 hover:bg-[#1a2744]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-40" />
            )}
          </button>

          {/* How to Play */}
          <button
            onClick={onOpenHowToPlay}
            aria-label="How to play"
            className={`w-6.5 h-6.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${
              isDarkMode
                ? 'text-slate-300 hover:bg-[#1a2744]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-[11px] font-black rounded-lg transition-colors cursor-pointer shrink-0 border whitespace-nowrap ${
              isDarkMode
                ? 'text-slate-200 bg-[#131d33] hover:bg-[#1a2744] border-[#223554]'
                : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
        </div>
      </div>
    </header>
  );
};
