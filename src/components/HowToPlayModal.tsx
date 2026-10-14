import React from 'react';
import { X, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isDarkMode?: boolean;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose, lang, isDarkMode = true }) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border-2 max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? 'bg-[#121a2f] border-[#1e2942] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${isDarkMode ? 'border-[#1e2942]' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2 font-serif font-black text-lg">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{t.howToPlay}</span>
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

        {/* Rules Body */}
        <div className="space-y-3.5 py-4 text-sm">
          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-base shadow-2xs">
              1
            </div>
            <div>
              <h4 className={`font-serif font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.rule1Title}</h4>
              <p className={`text-xs mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{t.rule1Desc}</p>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-amber-400 text-amber-400 font-black flex items-center justify-center shrink-0 text-base shadow-2xs">
              2
            </div>
            <div>
              <h4 className={`font-serif font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.rule2Title}</h4>
              <p className={`text-xs mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{t.rule2Desc}</p>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
              isDarkMode ? 'bg-[#16233d] border-[#1e2942]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center shrink-0 text-base shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-serif font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.rule3Title}</h4>
              <p className={`text-xs mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{t.rule3Desc}</p>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
              isDarkMode ? 'bg-rose-950/30 border-rose-500/40' : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center shrink-0 text-base shadow-2xs">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-serif font-black ${isDarkMode ? 'text-rose-200' : 'text-rose-950'}`}>{t.rule4Title}</h4>
              <p className={`text-xs mt-0.5 leading-relaxed ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>{t.rule4Desc}</p>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-2xl text-xs leading-relaxed font-bold border ${
              isDarkMode
                ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            🧭 {lang === 'ar' ? 'اضغط واسحب لتمرير الخط بسلاسة على الرقعة.' : 'Click and drag across the board to draw your path smoothly.'}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer border border-amber-300"
          >
            {lang === 'ar' ? 'فهمت، لنبدأ اللعب!' : "Got it, let's play!"}
          </button>
        </div>
      </div>
    </div>
  );
};
