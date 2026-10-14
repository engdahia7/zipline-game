import { PathTheme, BoardTheme, TokenTheme } from '../types/game';

export interface ThemeStyles {
  boardBgClass: string;
  boardBorderClass: string;
  cellUnvisitedClass: string;
  cellVisitedClass: string;
  pathGradientStart: string;
  pathGradientEnd: string;
  pathGlowColor: string;
  tokenClass: string;
  tokenVisitedClass: string;
  tokenTargetClass: string;
  tokenStartClass: string;
}

export function getThemeStyles(
  pathTheme: PathTheme = 'amber',
  boardTheme: BoardTheme = 'graphite',
  tokenTheme: TokenTheme = 'classic'
): ThemeStyles {
  // Ultra-vibrant, electric high-contrast Path Ribbon colors
  let pathGradientStart = '#fbbf24'; // Vivid electric amber gold
  let pathGradientEnd = '#f59e0b';
  let pathGlowColor = '#f59e0b';
  let visitedCellTint = 'bg-amber-500/20 border-2 border-amber-400/80 shadow-md';

  if (pathTheme === 'emerald') {
    pathGradientStart = '#34d399'; // Vivid electric emerald mint
    pathGradientEnd = '#10b981';
    pathGlowColor = '#10b981';
    visitedCellTint = 'bg-emerald-500/20 border-2 border-emerald-400/80 shadow-md';
  } else if (pathTheme === 'ruby') {
    pathGradientStart = '#fb7185'; // Vivid neon ruby crimson
    pathGradientEnd = '#f43f5e';
    pathGlowColor = '#f43f5e';
    visitedCellTint = 'bg-rose-500/20 border-2 border-rose-400/80 shadow-md';
  } else if (pathTheme === 'sapphire') {
    pathGradientStart = '#38bdf8'; // Vivid electric sapphire cyan
    pathGradientEnd = '#0ea5e9';
    pathGlowColor = '#0ea5e9';
    visitedCellTint = 'bg-sky-500/20 border-2 border-sky-400/80 shadow-md';
  } else if (pathTheme === 'bronze') {
    pathGradientStart = '#fde047'; // Vivid radiant brass gold
    pathGradientEnd = '#d97706';
    pathGlowColor = '#d97706';
    visitedCellTint = 'bg-amber-500/25 border-2 border-amber-300 shadow-md';
  } else if (pathTheme === 'violet') {
    pathGradientStart = '#c084fc'; // Vivid electric neon purple
    pathGradientEnd = '#9333ea';
    pathGlowColor = '#a855f7';
    visitedCellTint = 'bg-purple-500/20 border-2 border-purple-400/80 shadow-md';
  } else if (pathTheme === 'cyan') {
    pathGradientStart = '#67e8f9'; // Electric Ice Cyan
    pathGradientEnd = '#06b6d4';
    pathGlowColor = '#06b6d4';
    visitedCellTint = 'bg-cyan-500/20 border-2 border-cyan-400/80 shadow-md';
  } else if (pathTheme === 'sunset') {
    pathGradientStart = '#fb923c'; // Blazing solar sunset orange
    pathGradientEnd = '#ea580c';
    pathGlowColor = '#ea580c';
    visitedCellTint = 'bg-orange-500/20 border-2 border-orange-400/80 shadow-md';
  } else if (pathTheme === 'aurora') {
    pathGradientStart = '#a3e635'; // Neon lime to cyan aurora
    pathGradientEnd = '#06b6d4';
    pathGlowColor = '#22c55e';
    visitedCellTint = 'bg-lime-500/20 border-2 border-emerald-400/80 shadow-md';
  } else if (pathTheme === 'plasma') {
    pathGradientStart = '#f472b6'; // Vibrant galactic plasma pink to purple
    pathGradientEnd = '#c084fc';
    pathGlowColor = '#ec4899';
    visitedCellTint = 'bg-pink-500/20 border-2 border-fuchsia-400/80 shadow-md';
  } else if (pathTheme === 'gold') {
    pathGradientStart = '#fef08a'; // 24K pure radiant gold
    pathGradientEnd = '#ca8a04';
    pathGlowColor = '#eab308';
    visitedCellTint = 'bg-amber-400/25 border-2 border-yellow-300 shadow-md';
  } else if (pathTheme === 'matrix') {
    pathGradientStart = '#4ade80'; // Phosphor matrix green
    pathGradientEnd = '#15803d';
    pathGlowColor = '#22c55e';
    visitedCellTint = 'bg-emerald-600/25 border-2 border-green-400/80 shadow-md';
  } else if (pathTheme === 'crimson') {
    pathGradientStart = '#fb7185'; // Volcanic glowing magma crimson
    pathGradientEnd = '#b91c1c';
    pathGlowColor = '#ef4444';
    visitedCellTint = 'bg-red-500/25 border-2 border-red-400/80 shadow-md';
  } else if (pathTheme === 'prism') {
    pathGradientStart = '#f43f5e'; // Rainbow prism spectrum
    pathGradientEnd = '#06b6d4';
    pathGlowColor = '#3b82f6';
    visitedCellTint = 'bg-sky-500/25 border-2 border-indigo-400/80 shadow-md';
  } else if (pathTheme === 'volcanic') {
    pathGradientStart = '#ff5722'; // Molten volcanic magma
    pathGradientEnd = '#7f1d1d';
    pathGlowColor = '#ea580c';
    visitedCellTint = 'bg-orange-600/30 border-2 border-amber-500/90 shadow-md';
  }

  // Board themes with rich, distinct, high-contrast identities
  // 1. Graphite: Sleek deep navy slate with crisp tile borders
  let boardBgClass = 'bg-[#0b1220]';
  let boardBorderClass = 'border-[#223554]';
  let cellUnvisitedClass = 'bg-[#131d33] border-2 border-[#263a5e] shadow-xs hover:bg-[#1a2744]';
  let cellVisitedClass = visitedCellTint;

  if (boardTheme === 'walnut') {
    // 2. Walnut: Warm deep mahogany timber with warm amber highlights
    boardBgClass = 'bg-[#19100a]';
    boardBorderClass = 'border-[#432918]';
    cellUnvisitedClass = 'bg-[#26170e] border-2 border-[#4d2f1b] shadow-xs hover:bg-[#332014]';
    cellVisitedClass = 'bg-amber-500/20 border-2 border-amber-500/80 shadow-md';
  } else if (boardTheme === 'obsidian') {
    // 3. Obsidian: Ultra-contrast OLED midnight black with crisp borders
    boardBgClass = 'bg-[#03060c]';
    boardBorderClass = 'border-[#1b263b]';
    cellUnvisitedClass = 'bg-[#0d1424] border-2 border-[#202f4a] shadow-xs hover:bg-[#131d33]';
    cellVisitedClass = visitedCellTint;
  } else if (boardTheme === 'sandstone') {
    // 4. Porcelain Sandstone: Crisp, clean high-contrast light board
    boardBgClass = 'bg-[#ffffff]';
    boardBorderClass = 'border-slate-300';
    cellUnvisitedClass = 'bg-[#f1f5f9] border-2 border-[#cbd5e1] shadow-xs hover:bg-[#e2e8f0]';
    cellVisitedClass = 'bg-amber-100 border-2 border-amber-500 shadow-xs';
  } else if (boardTheme === 'marble') {
    // 5. Royal Slate Marble
    boardBgClass = 'bg-[#0f172a]';
    boardBorderClass = 'border-[#334155]';
    cellUnvisitedClass = 'bg-[#1e293b] border-2 border-[#475569] shadow-xs hover:bg-[#334155]';
    cellVisitedClass = visitedCellTint;
  } else if (boardTheme === 'cyber') {
    // 6. Cyber Grid Neon
    boardBgClass = 'bg-[#030712]';
    boardBorderClass = 'border-[#0284c7]';
    cellUnvisitedClass = 'bg-[#082f49]/80 border-2 border-[#0369a1] shadow-xs hover:bg-[#0c4a6e]';
    cellVisitedClass = 'bg-cyan-500/25 border-2 border-cyan-400 shadow-md';
  } else if (boardTheme === 'emerald_board') {
    // 7. Imperial Jade Green
    boardBgClass = 'bg-[#052014]';
    boardBorderClass = 'border-[#065f46]';
    cellUnvisitedClass = 'bg-[#064e3b]/80 border-2 border-[#059669] shadow-xs hover:bg-[#047857]';
    cellVisitedClass = 'bg-emerald-500/25 border-2 border-emerald-400 shadow-md';
  } else if (boardTheme === 'midnight') {
    // 8. Royal Indigo Midnight
    boardBgClass = 'bg-[#090d1a]';
    boardBorderClass = 'border-[#1e2e4e]';
    cellUnvisitedClass = 'bg-[#0f172a] border-2 border-[#24365d] shadow-xs hover:bg-[#16223d]';
    cellVisitedClass = visitedCellTint;
  } else if (boardTheme === 'carbon') {
    // 9. Carbon Fiber Slate
    boardBgClass = 'bg-[#111827]';
    boardBorderClass = 'border-[#374151]';
    cellUnvisitedClass = 'bg-[#1f2937] border-2 border-[#4b5563] shadow-xs hover:bg-[#283548]';
    cellVisitedClass = visitedCellTint;
  } else if (boardTheme === 'parchment') {
    // 10. Antique Papyrus Parchment (Warm cream)
    boardBgClass = 'bg-[#fefce8]';
    boardBorderClass = 'border-[#d4a373]';
    cellUnvisitedClass = 'bg-[#fef08a]/40 border-2 border-[#d4a373]/80 shadow-xs hover:bg-[#fef08a]/60';
    cellVisitedClass = 'bg-amber-200 border-2 border-amber-600 shadow-xs';
  } else if (boardTheme === 'cherry') {
    // 11. Imperial Cherry Mahogany
    boardBgClass = 'bg-[#200b0e]';
    boardBorderClass = 'border-[#581c22]';
    cellUnvisitedClass = 'bg-[#331116] border-2 border-[#6d232a] shadow-xs hover:bg-[#43161c]';
    cellVisitedClass = 'bg-rose-500/20 border-2 border-rose-500 shadow-md';
  } else if (boardTheme === 'nebula') {
    // 12. Cosmic Stellar Nebula
    boardBgClass = 'bg-[#0f0c29]';
    boardBorderClass = 'border-[#3b1c6e]';
    cellUnvisitedClass = 'bg-[#1c1444] border-2 border-[#4d2590] shadow-xs hover:bg-[#281d60]';
    cellVisitedClass = 'bg-purple-500/25 border-2 border-purple-400 shadow-md';
  } else if (boardTheme === 'bamboo') {
    // 13. Zen Forest Bamboo
    boardBgClass = 'bg-[#181f11]';
    boardBorderClass = 'border-[#3f4f2c]';
    cellUnvisitedClass = 'bg-[#232c19] border-2 border-[#4b5e34] shadow-xs hover:bg-[#2e3a21]';
    cellVisitedClass = 'bg-lime-500/25 border-2 border-lime-400 shadow-md';
  } else if (boardTheme === 'royal_velvet') {
    // 14. Royal Velvet Imperial Purple
    boardBgClass = 'bg-[#1e0e2e]';
    boardBorderClass = 'border-[#582582]';
    cellUnvisitedClass = 'bg-[#2d1445] border-2 border-[#6c339c] shadow-xs hover:bg-[#3b1c5c]';
    cellVisitedClass = 'bg-fuchsia-500/25 border-2 border-fuchsia-400 shadow-md';
  }

  // Checkpoint Token Styles - High contrast bold typography and badges
  let tokenClass = 'bg-white text-slate-900 border-2 border-slate-300 shadow-md font-black';
  let tokenVisitedClass = 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/40 ring-2 ring-white/90';
  let tokenTargetClass = 'bg-amber-400 text-slate-950 font-black ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-xl shadow-amber-400/60 scale-105 animate-pulse';
  let tokenStartClass = 'bg-emerald-500 text-white font-black ring-2 ring-emerald-300 shadow-lg shadow-emerald-500/50';

  if (boardTheme === 'sandstone') {
    tokenClass = 'bg-slate-900 text-white border-2 border-slate-800 shadow-md font-black';
    tokenTargetClass = 'bg-amber-400 text-slate-950 font-black ring-4 ring-amber-500 ring-offset-2 ring-offset-white shadow-xl shadow-amber-400/60 scale-105 animate-pulse';
  }

  if (tokenTheme === 'brass') {
    tokenClass = 'bg-[#fef3c7] text-[#78350f] border-2 border-[#d97706] shadow-md font-black';
    tokenVisitedClass = 'bg-gradient-to-tr from-[#d97706] to-[#f59e0b] text-[#1c1917] font-black shadow-lg shadow-amber-500/40 ring-2 ring-amber-100';
    tokenTargetClass = 'bg-[#fef08a] text-[#78350f] font-black ring-4 ring-[#f59e0b] shadow-xl shadow-amber-400/60 scale-105 animate-pulse';
    tokenStartClass = 'bg-emerald-500 text-white font-black ring-2 ring-emerald-200 shadow-lg shadow-emerald-500/50';
  } else if (tokenTheme === 'gem') {
    tokenClass = 'bg-[#ecfdf5] text-[#064e3b] border-2 border-[#10b981] shadow-md font-black';
    tokenVisitedClass = 'bg-gradient-to-tr from-[#059669] to-[#10b981] text-white font-black shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-100';
    tokenTargetClass = 'bg-[#6ee7b7] text-[#022c22] font-black ring-4 ring-[#10b981] shadow-xl shadow-emerald-400/60 scale-105 animate-pulse';
    tokenStartClass = 'bg-sky-500 text-white font-black ring-2 ring-sky-200 shadow-lg shadow-sky-500/50';
  } else if (tokenTheme === 'neon') {
    tokenClass = 'bg-[#0f172a] text-[#38bdf8] border-2 border-[#0284c7] shadow-md font-black';
    tokenVisitedClass = 'bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-slate-950 font-black shadow-lg shadow-sky-500/50 ring-2 ring-white';
    tokenTargetClass = 'bg-[#38bdf8] text-slate-950 font-black ring-4 ring-[#0284c7] shadow-xl shadow-cyan-400/60 scale-105 animate-pulse';
    tokenStartClass = 'bg-[#10b981] text-white font-black ring-2 ring-emerald-300 shadow-lg';
  } else if (tokenTheme === 'crown') {
    tokenClass = 'bg-[#fefce8] text-[#854d0e] border-2 border-[#eab308] shadow-md font-black';
    tokenVisitedClass = 'bg-gradient-to-tr from-[#eab308] to-[#facc15] text-slate-950 font-black shadow-lg shadow-yellow-500/50 ring-2 ring-yellow-200';
    tokenTargetClass = 'bg-[#facc15] text-slate-950 font-black ring-4 ring-[#ca8a04] shadow-xl shadow-yellow-400/60 scale-105 animate-pulse';
    tokenStartClass = 'bg-emerald-500 text-white font-black ring-2 ring-emerald-300 shadow-lg';
  } else if (tokenTheme === 'diamond') {
    tokenClass = 'bg-[#f0fdfa] text-[#0f766e] border-2 border-[#14b8a6] shadow-md font-black';
    tokenVisitedClass = 'bg-gradient-to-tr from-[#14b8a6] to-[#5eead4] text-slate-950 font-black shadow-lg ring-2 ring-white';
    tokenTargetClass = 'bg-[#2dd4bf] text-slate-950 font-black ring-4 ring-[#14b8a6] shadow-xl shadow-teal-400/60 scale-105 animate-pulse';
    tokenStartClass = 'bg-emerald-500 text-white font-black ring-2 ring-teal-200 shadow-lg';
  } else if (tokenTheme === 'star') {
    tokenClass = 'bg-[#fff1f2] text-[#be123c] border-2 border-[#f43f5e] shadow-md font-black';
    tokenVisitedClass = 'bg-gradient-to-tr from-[#e11d48] to-[#fb7185] text-white font-black shadow-lg ring-2 ring-rose-200';
    tokenTargetClass = 'bg-[#fb7185] text-white font-black ring-4 ring-[#e11d48] shadow-xl shadow-rose-400/60 scale-105 animate-pulse';
    tokenStartClass = 'bg-emerald-500 text-white font-black ring-2 ring-rose-200 shadow-lg';
  } else if (tokenTheme === 'cyber_hex') {
    tokenClass = 'bg-[#020617] text-[#a855f7] border-2 border-[#9333ea] shadow-md font-black';
    tokenVisitedClass = 'bg-gradient-to-tr from-[#9333ea] to-[#c084fc] text-slate-950 font-black shadow-lg ring-2 ring-fuchsia-300';
    tokenTargetClass = 'bg-[#c084fc] text-slate-950 font-black ring-4 ring-[#9333ea] shadow-xl shadow-purple-500/60 scale-105 animate-pulse';
    tokenStartClass = 'bg-cyan-500 text-slate-950 font-black ring-2 ring-purple-300 shadow-lg';
  } else if (tokenTheme === 'retro') {
    tokenClass = 'bg-[#fef9c3] text-[#854d0e] border-2 border-[#ca8a04] shadow-md font-mono font-black';
    tokenVisitedClass = 'bg-[#ca8a04] text-white font-mono font-black shadow-md ring-2 ring-amber-300';
    tokenTargetClass = 'bg-[#eab308] text-slate-950 font-mono font-black ring-4 ring-[#ca8a04] shadow-xl scale-105 animate-pulse';
    tokenStartClass = 'bg-emerald-600 text-white font-mono font-black ring-2 ring-emerald-300 shadow-md';
  } else if (tokenTheme === 'wooden') {
    tokenClass = 'bg-[#fef3c7] text-[#78350f] border-2 border-[#b45309] shadow-md font-serif font-black';
    tokenVisitedClass = 'bg-[#b45309] text-[#fef3c7] font-serif font-black shadow-lg ring-2 ring-amber-300';
    tokenTargetClass = 'bg-[#d97706] text-white font-serif font-black ring-4 ring-[#b45309] shadow-xl scale-105 animate-pulse';
    tokenStartClass = 'bg-emerald-700 text-white font-serif font-black ring-2 ring-amber-200 shadow-md';
  } else if (tokenTheme === 'platinum') {
    tokenClass = 'bg-[#f8fafc] text-[#0f172a] border-2 border-[#94a3b8] shadow-md font-black';
    tokenVisitedClass = 'bg-gradient-to-tr from-[#94a3b8] to-[#e2e8f0] text-slate-950 font-black shadow-lg ring-2 ring-white';
    tokenTargetClass = 'bg-white text-slate-950 font-black ring-4 ring-[#64748b] shadow-xl scale-105 animate-pulse';
    tokenStartClass = 'bg-emerald-500 text-white font-black ring-2 ring-slate-200 shadow-md';
  }

  return {
    boardBgClass,
    boardBorderClass,
    cellUnvisitedClass,
    cellVisitedClass,
    pathGradientStart,
    pathGradientEnd,
    pathGlowColor,
    tokenClass,
    tokenVisitedClass,
    tokenTargetClass,
    tokenStartClass,
  };
}
