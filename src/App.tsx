/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Coordinate, Puzzle, GameMode, PlayerStats, PageTab, PlayerProfile } from './types/game';
import { CURATED_PUZZLES, getDailyPuzzle } from './data/puzzles';
import {
  generatePuzzle,
  getWeeklyMegaPuzzle,
  getTimeRushPuzzles,
  getSuddenDeathPuzzle,
  detectDeadEnd,
} from './utils/generator';
import { getPlayerStats, savePlayerVictory, resetPlayerStats } from './utils/storage';
import {
  getPlayerProfile,
  savePlayerProfile,
  resetPlayerProfile,
  addCoinsToProfile,
  addHintsToProfile,
  useHintFromProfile,
  buyItem,
  setHintLimitPreference,
  recordWatchedAd,
} from './utils/profile';
import { sound } from './utils/audio';
import { triggerConfetti } from './utils/confetti';
import { translations, Language } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { LevelSelector } from './components/LevelSelector';
import { GeneratorView } from './components/GeneratorView';
import { ShopView } from './components/ShopView';
import { ProfileView } from './components/ProfileView';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatsModal } from './components/StatsModal';
import { VictoryModal } from './components/VictoryModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import {
  CheckCircle2,
  Home,
  Play,
  Layers,
  ShoppingBag,
  User,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [gameMode, setGameMode] = useState<GameMode>('daily');
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  // Today's date string
  const todayStr = new Date().toISOString().split('T')[0];

  // Theme state (default dark, persisted)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('app_theme');
      if (saved) return saved === 'dark';
    } catch {
      // ignore
    }
    return true;
  });

  const handleToggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('app_theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Player Profile & Stats
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => getPlayerProfile());
  const [stats, setStats] = useState<PlayerStats>(() => getPlayerStats());

  // Active puzzle
  const [puzzle, setPuzzle] = useState<Puzzle>(() => getDailyPuzzle(todayStr));
  const [path, setPath] = useState<Coordinate[]>(() => {
    const p = getDailyPuzzle(todayStr);
    const startCp = p.checkpoints.find(cp => cp.val === 1);
    return startCp ? [{ r: startCp.r, c: startCp.c }] : [];
  });
  const [backtracks, setBacktracks] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hintCoordinate, setHintCoordinate] = useState<Coordinate | null>(null);
  const [errorCoordinate, setErrorCoordinate] = useState<Coordinate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hintsUsedInPuzzle, setHintsUsedInPuzzle] = useState<number>(0);

  // New Modes & Mechanics State
  const [timeRushStage, setTimeRushStage] = useState<number>(1);
  const [timeRushPuzzles, setTimeRushPuzzles] = useState<Puzzle[]>([]);
  const [timeRushTimeLeft, setTimeRushTimeLeft] = useState<number>(60);
  const [isPencilMode, setIsPencilMode] = useState<boolean>(false);
  const [pencilMarks, setPencilMarks] = useState<Record<string, number | string>>({});
  const [ghostCoordinate, setGhostCoordinate] = useState<Coordinate | null>(null);
  const [deadEndCoordinate, setDeadEndCoordinate] = useState<Coordinate | null>(null);

  // Modals
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [earnedCoinsLastWin, setEarnedCoinsLastWin] = useState<number>(35);
  const [lastWonStars, setLastWonStars] = useState<number>(3);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync document RTL/LTR
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Standard Game timer loop
  useEffect(() => {
    if (isCompleted || isPaused || currentTab !== 'play') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCompleted, isPaused, currentTab]);

  // Time Rush Blitz countdown timer loop
  useEffect(() => {
    if (gameMode !== 'timerush' || isCompleted || isPaused || currentTab !== 'play') {
      return;
    }

    const blitzTimer = setInterval(() => {
      setTimeRushTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(blitzTimer);
          sound.playInvalid();
          showToast(lang === 'ar' ? 'انتهى الوقت في سباق الـ 60 ثانية! حاول مجدداً.' : 'Time is up in Blitz! Try again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(blitzTimer);
  }, [gameMode, isCompleted, isPaused, currentTab, lang]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load a new puzzle
  const loadNewPuzzle = (newPuzzle: Puzzle, mode?: GameMode) => {
    setPuzzle(newPuzzle);
    if (mode) setGameMode(mode);
    const startCp = newPuzzle.checkpoints.find(cp => cp.val === 1);
    setPath(startCp ? [{ r: startCp.r, c: startCp.c }] : []);
    setBacktracks(0);
    setElapsedTime(0);
    setIsPaused(false);
    setIsCompleted(false);
    setHintCoordinate(null);
    setErrorCoordinate(null);
    setGhostCoordinate(null);
    setDeadEndCoordinate(null);
    setIsPencilMode(false);
    setPencilMarks({});
    setShowVictory(false);
    setHintsUsedInPuzzle(0);
  };

  // Quick navigation handlers from Home
  const handlePlayDaily = () => {
    const daily = getDailyPuzzle(todayStr);
    loadNewPuzzle(daily, 'daily');
    setCurrentTab('play');
  };

  const handlePlayLevels = () => {
    setCurrentTab('levels');
  };

  const handlePlayCustom = () => {
    const seed = Math.floor(Math.random() * 1000000) + 1;
    const p = generatePuzzle(6, 6, 'medium', `custom_${Date.now()}`, {
      en: 'Custom Challenge 6×6',
      ar: 'تحدي مخصص ٦×٦',
    }, seed);
    loadNewPuzzle(p, 'custom');
    setCurrentTab('play');
  };

  // New Modes Launchers
  const handlePlayTimeRush = () => {
    const blitz = getTimeRushPuzzles();
    setTimeRushPuzzles(blitz);
    setTimeRushStage(1);
    setTimeRushTimeLeft(60);
    loadNewPuzzle(blitz[0], 'timerush');
    setCurrentTab('play');
    showToast(lang === 'ar' ? '⚡ بدأ سباق الـ 60 ثانية! حل 3 ألغاز لكسب مضاعف عملات' : '⚡ 60s Time Rush started! Solve 3 blitz puzzles');
  };

  const handlePlaySuddenDeath = () => {
    const p = getSuddenDeathPuzzle();
    loadNewPuzzle(p, 'suddendeath');
    setCurrentTab('play');
    showToast(lang === 'ar' ? '💀 تحدي الخطوة الواحدة: 0 تراجع مسموح!' : '💀 Sudden Death: 0 Backtracks allowed!');
  };

  const handlePlayMegaWeekly = () => {
    const p = getWeeklyMegaPuzzle();
    loadNewPuzzle(p, 'mega_weekly');
    setCurrentTab('play');
    showToast(lang === 'ar' ? '👑 لغز الأسبوع العملاق (9×9)!' : '👑 Mega Weekly Master Puzzle (9×9)!');
  };

  // Pencil mode and Ghost step handlers
  const handleTogglePencilMode = () => {
    setIsPencilMode(prev => {
      const next = !prev;
      sound.playStep(1);
      showToast(next ? (lang === 'ar' ? '✏️ وضع المسوّدة مفعل: المس أي مربع لكتابة رقم تجريبي' : '✏️ Pencil mode active: draft numbers') : (lang === 'ar' ? '✏️ وضع الرسم المباشر' : '✏️ Normal draw mode'));
      return next;
    });
  };

  const handleTogglePencilMark = (coord: Coordinate) => {
    const key = `${coord.r},${coord.c}`;
    setPencilMarks(prev => {
      const next = { ...prev };
      if (next[key] !== undefined) {
        delete next[key];
      } else {
        const currentVals = Object.values(next).filter(v => typeof v === 'number') as number[];
        const nextVal = currentVals.length > 0 ? Math.max(...currentVals) + 1 : 1;
        next[key] = nextVal <= 9 ? nextVal : '•';
      }
      return next;
    });
  };

  const handleGhostStep = () => {
    if (isCompleted || !puzzle.solutionPath) return;
    const sol = puzzle.solutionPath;
    if (path.length >= sol.length) return;
    const nextStep = sol[path.length];
    setGhostCoordinate(nextStep);
    sound.playCheckpoint(2);
    setTimeout(() => {
      setGhostCoordinate(null);
    }, 1400);
  };

  const handleSelectLevel = (selectedPuzzle: Puzzle) => {
    loadNewPuzzle(selectedPuzzle, 'levels');
    setCurrentTab('play');
  };

  // Verify victory conditions
  const checkVictory = useCallback(
    (currentPath: Coordinate[]) => {
      const totalCells = puzzle.width * puzzle.height;
      if (currentPath.length !== totalCells) return false;

      // Map coordinates to index in path
      const pathIndices = new Map<string, number>();
      currentPath.forEach((c, idx) => {
        pathIndices.set(`${c.r},${c.c}`, idx);
      });

      // Check all checkpoints are visited in ascending sequence
      const sortedCheckpoints = [...puzzle.checkpoints].sort((a, b) => a.val - b.val);
      let lastIndex = -1;
      for (const cp of sortedCheckpoints) {
        const idx = pathIndices.get(`${cp.r},${cp.c}`);
        if (idx === undefined || idx <= lastIndex) {
          return false;
        }
        lastIndex = idx;
      }

      return true;
    },
    [puzzle]
  );

  // Path change handler
  const handlePathChange = useCallback(
    (newPath: Coordinate[], didBacktrack = false) => {
      // Sudden Death Rule: Zero backtracks allowed!
      if (gameMode === 'suddendeath' && didBacktrack) {
        sound.playInvalid();
        const startCp = puzzle.checkpoints.find(cp => cp.val === 1);
        setPath(startCp ? [{ r: startCp.r, c: startCp.c }] : []);
        setBacktracks(0);
        showToast(lang === 'ar' ? '💀 تراجع ممنوع في الخطوة الواحدة! أُعيد اللغز للبداية.' : '💀 Zero backtracks in Sudden Death! Reset to start.');
        return;
      }

      setPath(newPath);
      if (didBacktrack) {
        setBacktracks(prev => prev + 1);
      }

      // Real-time Dead End Trapped Cell Detection
      const trapped = detectDeadEnd(puzzle.width, puzzle.height, newPath, puzzle.walls, puzzle.checkpoints);
      setDeadEndCoordinate(trapped);

      if (checkVictory(newPath)) {
        // Time Rush Blitz stage progression
        if (gameMode === 'timerush' && timeRushStage < 3 && timeRushPuzzles[timeRushStage]) {
          sound.playWin();
          triggerConfetti();
          const nextStage = timeRushStage + 1;
          setTimeRushStage(nextStage);
          setTimeRushTimeLeft(prev => prev + 15);
          showToast(
            lang === 'ar'
              ? `⚡ أحسنت! تقدمت للمرحلة ${nextStage}/3 (+15 ثانية إضافية!)`
              : `⚡ Blitz Stage ${nextStage}/3 (+15s Bonus Time!)`
          );
          loadNewPuzzle(timeRushPuzzles[nextStage - 1], 'timerush');
          return;
        }

        setIsCompleted(true);
        sound.playWin();
        triggerConfetti();

        let rewardCoins = 35;
        if (gameMode === 'daily') rewardCoins = 45;
        else if (gameMode === 'timerush') rewardCoins = 80;
        else if (gameMode === 'suddendeath') rewardCoins = 60;
        else if (gameMode === 'mega_weekly') rewardCoins = 120;

        setEarnedCoinsLastWin(rewardCoins);
        const updatedProf = addCoinsToProfile(rewardCoins);
        setPlayerProfile(updatedProf);

        const { stats: updatedStats, stars } = savePlayerVictory(
          puzzle.id,
          elapsedTime,
          gameMode === 'daily',
          puzzle.dailyDate,
          backtracks
        );
        setStats(updatedStats);
        setLastWonStars(stars);

        setTimeout(() => {
          setShowVictory(true);
        }, 400);
      }
    },
    [checkVictory, puzzle, elapsedTime, gameMode, backtracks, timeRushStage, timeRushPuzzles, lang]
  );

  // Undo button
  const handleUndo = () => {
    if (path.length > 1) {
      sound.playUndo();
      handlePathChange(path.slice(0, path.length - 1), true);
    }
  };

  // Clear button
  const handleClear = () => {
    if (path.length > 1) {
      sound.playUndo();
      const startCp = puzzle.checkpoints.find(cp => cp.val === 1);
      setPath(startCp ? [{ r: startCp.r, c: startCp.c }] : []);
      setBacktracks(prev => prev + 1);
    }
  };

  const handleRewardHintsGranted = (hintsToAdd: number) => {
    const { profile: updated } = recordWatchedAd(hintsToAdd, 0);
    setPlayerProfile(updated);
    sound.playWin();
    triggerConfetti();
    showToast(lang === 'ar' ? `🎉 تم استلام +${hintsToAdd} تلميحات مجاناً!` : `+${hintsToAdd} Free Hints added!`);
  };

  const handleRewardCoinsGranted = (coinsToAdd: number) => {
    const { profile: updated } = recordWatchedAd(0, coinsToAdd);
    setPlayerProfile(updated);
    sound.playWin();
    triggerConfetti();
    showToast(lang === 'ar' ? `🎉 تم استلام +${coinsToAdd} عملة ذهبية!` : `+${coinsToAdd} Free Coins added!`);
  };

  const handleBuySingleHint = () => {
    const res = buyItem('hint_pack_1');
    if (res.success) {
      setPlayerProfile(res.profile);
      sound.playWin();
      triggerConfetti();
      showToast(res.message);
      setShowAdModal(false);
    } else {
      showToast(res.message);
    }
  };

  const handleBuyQuickHints = () => {
    const res = buyItem('hint_pack_3');
    if (res.success) {
      setPlayerProfile(res.profile);
      sound.playWin();
      triggerConfetti();
      showToast(res.message);
      setShowAdModal(false);
    } else {
      showToast(res.message);
    }
  };

  const handleSetHintLimit = (limit: number | 'unlimited') => {
    const updated = setHintLimitPreference(limit);
    setPlayerProfile(updated);
    sound.playStep(2);
    showToast(
      lang === 'ar'
        ? limit === 'unlimited'
          ? 'تم تعيين سقف المساعدات: مفتوح دون قيد'
          : `تم تعيين سقف المساعدات: ${limit} لكل لغز`
        : `Puzzle hint limit set to: ${limit}`
    );
  };

  const handleResetAllData = () => {
    const cleanStats = resetPlayerStats();
    const cleanProfile = resetPlayerProfile();
    setStats(cleanStats);
    setPlayerProfile(cleanProfile);
    sound.playUndo();
    showToast(lang === 'ar' ? 'تم تصفير جميع الإحصائيات والأرقام بنجاح!' : 'All statistics reset to 0 successfully!');
  };

  // Hint button: Preserves correct path, rewinds wrong turn, and immediately reveals & steps into next square
  const handleHint = () => {
    if (isCompleted || !puzzle.solutionPath || puzzle.solutionPath.length === 0) return;

    const t = translations[lang];

    // Check puzzle-specific hint limit
    const limit = playerProfile.hintLimitPerPuzzle ?? 3;
    if (limit !== 'unlimited' && hintsUsedInPuzzle >= limit) {
      sound.playInvalid();
      showToast(
        lang === 'ar'
          ? `وصلت للحد الأقصى المسموح به لهذا اللغز (${limit}). يمكنك تعديله من سقف اللغز.`
          : `Reached maximum hint limit (${limit}) for this puzzle.`
      );
      return;
    }

    // Check inventory hint count limit
    if ((playerProfile.hints || 0) <= 0) {
      sound.playInvalid();
      setShowAdModal(true);
      showToast(t.noHintsLeft);
      return;
    }

    // Deduct 1 hint from inventory
    const hintRes = useHintFromProfile();
    setPlayerProfile(hintRes.profile);
    setHintsUsedInPuzzle(prev => prev + 1);

    const sol = puzzle.solutionPath;

    // Find the first index where the user's current path diverges from the solution
    let divergenceIndex = -1;
    for (let i = 0; i < path.length; i++) {
      if (i >= sol.length || path[i].r !== sol[i].r || path[i].c !== sol[i].c) {
        divergenceIndex = i;
        break;
      }
    }

    if (divergenceIndex !== -1) {
      // User took a wrong turn at divergenceIndex
      // Keep ALL correct steps up to divergenceIndex (never erase the correct path!)
      const correctedPath = path.slice(0, Math.max(1, divergenceIndex));
      const nextCorrectStep = sol[correctedPath.length];
      const newPath = [...correctedPath, nextCorrectStep];

      setPath(newPath);
      setBacktracks(prev => prev + 1);

      // Highlight the erroneous square in red:
      const wrongCell = path[divergenceIndex];
      setErrorCoordinate(wrongCell);

      // Reveal the correct square in gold beacon:
      setHintCoordinate(nextCorrectStep);

      sound.playHint();
      showToast(t.hintMistake);

      if (checkVictory(newPath)) {
        setIsCompleted(true);
        sound.playWin();
        triggerConfetti();
        const rewardCoins = gameMode === 'daily' ? 45 : 35;
        setEarnedCoinsLastWin(rewardCoins);
        const updatedProf = addCoinsToProfile(rewardCoins);
        setPlayerProfile(updatedProf);
        const { stats: updatedStats, stars } = savePlayerVictory(
          puzzle.id,
          elapsedTime,
          gameMode === 'daily',
          puzzle.dailyDate,
          backtracks
        );
        setStats(updatedStats);
        setLastWonStars(stars);
        setTimeout(() => setShowVictory(true), 400);
      }
    } else {
      // Path is 100% on track! Advance into next square:
      if (path.length < sol.length) {
        const nextStep = sol[path.length];
        const newPath = [...path, nextStep];

        setPath(newPath);
        setHintCoordinate(nextStep);

        sound.playHint();
        showToast(t.hintCorrect);

        if (checkVictory(newPath)) {
          setIsCompleted(true);
          sound.playWin();
          triggerConfetti();
          const rewardCoins = gameMode === 'daily' ? 45 : 35;
          setEarnedCoinsLastWin(rewardCoins);
          const updatedProf = addCoinsToProfile(rewardCoins);
          setPlayerProfile(updatedProf);
          const { stats: updatedStats, stars } = savePlayerVictory(
            puzzle.id,
            elapsedTime,
            gameMode === 'daily',
            puzzle.dailyDate,
            backtracks
          );
          setStats(updatedStats);
          setLastWonStars(stars);
          setTimeout(() => setShowVictory(true), 400);
        }
      } else {
        showToast(t.hintComplete);
      }
    }

    setTimeout(() => {
      setHintCoordinate(null);
      setErrorCoordinate(null);
    }, 3500);
  };

  // Keyboard shortcut listener for Hint (H) and Clear (R)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (currentTab !== 'play' || isPaused || isCompleted) return;
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 'h') {
        e.preventDefault();
        handleHint();
      } else if (key === 'r') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [currentTab, isPaused, isCompleted, handleHint, handleClear]);

  // Next puzzle button - Guarantees advancing to a distinct new puzzle every time
  const handleNextPuzzle = () => {
    setShowVictory(false);
    if (gameMode === 'levels') {
      const currIdx = CURATED_PUZZLES.findIndex(p => p.id === puzzle.id);
      if (currIdx !== -1 && currIdx < CURATED_PUZZLES.length - 1) {
        loadNewPuzzle(CURATED_PUZZLES[currIdx + 1], 'levels');
      } else {
        const nextUncompleted = CURATED_PUZZLES.find(p => !stats.completedPuzzles.includes(p.id));
        loadNewPuzzle(nextUncompleted || CURATED_PUZZLES[0], 'levels');
      }
    } else if (gameMode === 'custom') {
      const newSeed = Math.floor(Math.random() * 9999999) + 1;
      const newP = generatePuzzle(
        puzzle.width,
        puzzle.height,
        puzzle.difficulty,
        `custom_${puzzle.width}x${puzzle.height}_${Date.now()}_${newSeed}`,
        {
          en: `Custom ${puzzle.width}×${puzzle.height}`,
          ar: `مخصص ${puzzle.width}×${puzzle.height}`,
        },
        newSeed
      );
      loadNewPuzzle(newP, 'custom');
    } else {
      // In daily mode: Advance to consecutive next day challenge
      const currDate = puzzle.dailyDate ? new Date(puzzle.dailyDate) : new Date(todayStr);
      currDate.setDate(currDate.getDate() + 1);
      const nextDateStr = currDate.toISOString().split('T')[0];
      const nextDaily = getDailyPuzzle(nextDateStr);
      loadNewPuzzle(nextDaily, 'daily');
    }
  };

  // Previous puzzle button
  const handlePrevPuzzle = () => {
    if (gameMode === 'levels') {
      const currIdx = CURATED_PUZZLES.findIndex(p => p.id === puzzle.id);
      if (currIdx > 0) {
        loadNewPuzzle(CURATED_PUZZLES[currIdx - 1], 'levels');
      }
    } else if (gameMode === 'daily') {
      const currDate = puzzle.dailyDate ? new Date(puzzle.dailyDate) : new Date(todayStr);
      currDate.setDate(currDate.getDate() - 1);
      const prevDateStr = currDate.toISOString().split('T')[0];
      const prevDaily = getDailyPuzzle(prevDateStr);
      loadNewPuzzle(prevDaily, 'daily');
    }
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const newState = sound.toggle();
    setSoundEnabled(newState);
  };

  // Toggle Language
  const handleToggleLang = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Find next expected checkpoint number for HUD
  const checkpointMap = new Map<string, number>();
  puzzle.checkpoints.forEach(cp => checkpointMap.set(`${cp.r},${cp.c}`, cp.val));

  let maxCheckpointVisited = 0;
  for (const c of path) {
    const v = checkpointMap.get(`${c.r},${c.c}`);
    if (v !== undefined && v === maxCheckpointVisited + 1) {
      maxCheckpointVisited = v;
    }
  }
  const maxCheckpoint = Math.max(...puzzle.checkpoints.map(cp => cp.val));
  const nextCheckpointNumber = maxCheckpointVisited < maxCheckpoint ? maxCheckpointVisited + 1 : null;

  const t = translations[lang];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors pb-24 md:pb-12 ${
        isDarkMode ? 'bg-[#070b14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Navbar with Page Tabs, Coins, Hints, Audio, Language & Dark/Light Switcher */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        coins={playerProfile.coins}
        hints={playerProfile.hints || 0}
        onOpenAdModal={() => setShowAdModal(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-4 pt-2 sm:pt-3 flex flex-col items-center">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`fixed top-18 sm:top-20 z-50 text-xs font-bold py-2.5 px-5 rounded-2xl shadow-xl border backdrop-blur-md animate-fade-in transition-all ${
              isDarkMode
                ? 'bg-[#121a2f]/95 text-amber-300 border-[#223554]'
                : 'bg-slate-900/95 text-amber-300 border-slate-800'
            }`}
          >
            {toastMessage}
          </div>
        )}

        {/* 1. Home View Tab */}
        {currentTab === 'home' && (
          <HomeView
            dailyPuzzle={getDailyPuzzle(todayStr)}
            playerProfile={playerProfile}
            playerStats={stats}
            onPlayDaily={handlePlayDaily}
            onPlayLevels={handlePlayLevels}
            onPlayCustom={handlePlayCustom}
            onPlayTimeRush={handlePlayTimeRush}
            onPlaySuddenDeath={handlePlaySuddenDeath}
            onPlayMegaWeekly={handlePlayMegaWeekly}
            onOpenShop={() => setCurrentTab('shop')}
            onOpenProfile={() => setCurrentTab('profile')}
            onOpenAdModal={() => setShowAdModal(true)}
            onUpdateProfile={setPlayerProfile}
            lang={lang}
            isDarkMode={isDarkMode}
          />
        )}

        {/* 2. Play Board Tab */}
        {currentTab === 'play' && (
          <div className="w-full flex flex-col items-center">
            {/* Puzzle Metadata & Subheading */}
            <div className="w-full max-w-[min(92vw,440px)] sm:max-w-[460px] mx-auto flex items-center justify-between pb-1.5 sm:pb-3 pt-0.5 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <h2
                  className={`text-xs sm:text-base md:text-lg font-serif font-black tracking-tight truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {lang === 'ar' ? puzzle.titleAr : puzzle.title}
                </h2>
                {stats.completedPuzzles.includes(puzzle.id) && (
                  <span
                    className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs border shrink-0 ${
                      isDarkMode
                        ? 'text-emerald-300 bg-emerald-500/20 border-emerald-400/40'
                        : 'text-emerald-800 bg-emerald-100 border-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{lang === 'ar' ? 'محلول' : 'Solved'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <span
                  className={`text-[10px] sm:text-xs font-mono font-black rounded-lg tabular-nums px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-2xs border ${
                    isDarkMode
                      ? 'text-slate-300 bg-[#131d33] border-[#223554]'
                      : 'text-slate-700 bg-white border-slate-300'
                  }`}
                >
                  {puzzle.width}×{puzzle.height}
                </span>

                {/* Previous Level Button */}
                {(gameMode === 'levels' || gameMode === 'daily') && (
                  <button
                    onClick={handlePrevPuzzle}
                    title={lang === 'ar' ? 'اللغز السابق' : 'Previous puzzle'}
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl border shadow-xs transition-colors cursor-pointer active:scale-95 ${
                      isDarkMode
                        ? 'bg-[#131d33] hover:bg-[#1a2744] text-slate-200 border-[#223554]'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                    }`}
                  >
                    {lang === 'ar' ? 'السابق' : 'Prev'}
                  </button>
                )}

                {/* Next Level Button */}
                <button
                  onClick={handleNextPuzzle}
                  title={t.nextPuzzle}
                  className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 border border-amber-300 shadow-sm shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                >
                  {t.nextPuzzle}
                </button>
              </div>
            </div>

            {/* Game Board Container */}
            <div className="w-full flex flex-col items-center relative">
              {/* Pause Overlay */}
              {isPaused && (
                <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-white space-y-3">
                  <span className="text-lg font-serif font-black text-amber-300">{t.paused}</span>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 font-black text-slate-950 text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-400/25 active:scale-95"
                  >
                    {t.resume}
                  </button>
                </div>
              )}

              <GameBoard
                puzzle={puzzle}
                path={path}
                onPathChange={handlePathChange}
                hintCoordinate={hintCoordinate}
                errorCoordinate={errorCoordinate}
                ghostCoordinate={ghostCoordinate}
                deadEndCoordinate={deadEndCoordinate}
                isPencilMode={isPencilMode}
                pencilMarks={pencilMarks}
                onTogglePencilMark={handleTogglePencilMark}
                pathTheme={playerProfile.equippedPath}
                boardTheme={playerProfile.equippedBoard}
                tokenTheme={playerProfile.equippedToken}
                disabled={isPaused || isCompleted}
              />

              {/* Controls & Progress */}
              <Controls
                lang={lang}
                onUndo={handleUndo}
                onClear={handleClear}
                onHint={handleHint}
                hintsCount={playerProfile.hints || 0}
                onOpenAdModal={() => setShowAdModal(true)}
                canUndo={path.length > 1 && !isCompleted}
                canClear={path.length > 1 && !isCompleted}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused(prev => !prev)}
                elapsedTime={elapsedTime}
                cellsFilled={path.length}
                totalCells={puzzle.width * puzzle.height}
                backtracks={backtracks}
                nextCheckpoint={nextCheckpointNumber}
                isDarkMode={isDarkMode}
                hintLimitPerPuzzle={playerProfile.hintLimitPerPuzzle ?? 3}
                hintsUsedInCurrentPuzzle={hintsUsedInPuzzle}
                onChangeHintLimit={handleSetHintLimit}
                gameMode={gameMode}
                timeRushStage={timeRushStage}
                timeRushTimeLeft={timeRushTimeLeft}
                deadEndDetected={deadEndCoordinate !== null}
                isPencilMode={isPencilMode}
                onTogglePencilMode={handleTogglePencilMode}
                onGhostStep={handleGhostStep}
              />
            </div>
          </div>
        )}

        {/* 3. Levels / Packs Tab */}
        {currentTab === 'levels' && (
          <div className="w-full space-y-5 animate-fade-in">
            <div className="text-start">
              <h2 className={`text-xl font-serif font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.navLevels}
              </h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'ar' ? 'اختر أي مرحلة وافتح ألغازاً جديدة تباعاً' : 'Browse puzzle collections and unlock new challenges'}
              </p>
            </div>

            <LevelSelector
              puzzles={CURATED_PUZZLES}
              currentPuzzleId={puzzle.id}
              completedPuzzleIds={stats.completedPuzzles}
              puzzleStars={stats.puzzleStars}
              onSelectPuzzle={handleSelectLevel}
              lang={lang}
              isDarkMode={isDarkMode}
            />

            <div className={`pt-2 border-t ${isDarkMode ? 'border-[#1e2a44]' : 'border-slate-200'}`}>
              <GeneratorView
                onGenerate={p => {
                  loadNewPuzzle(p, 'custom');
                  setCurrentTab('play');
                }}
                lang={lang}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {/* 4. Shop Tab */}
        {currentTab === 'shop' && (
          <ShopView
            profile={playerProfile}
            onUpdateProfile={setPlayerProfile}
            onOpenAdModal={() => setShowAdModal(true)}
            lang={lang}
            isDarkMode={isDarkMode}
          />
        )}

        {/* 5. Profile Tab */}
        {currentTab === 'profile' && (
          <ProfileView
            profile={playerProfile}
            stats={stats}
            onUpdateProfile={setPlayerProfile}
            onResetAllData={handleResetAllData}
            lang={lang}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (High contrast, clutter-free, responsive on all phones) */}
      <nav
        className={`md:hidden fixed bottom-0 inset-x-0 backdrop-blur-md border-t-2 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] px-1 sm:px-2 flex items-center justify-around z-40 shadow-xl transition-colors ${
          isDarkMode
            ? 'bg-[#0b1120]/95 border-[#1e2a44] text-slate-400'
            : 'bg-white/95 border-slate-200 text-slate-600'
        }`}
      >
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl cursor-pointer transition-all ${
            currentTab === 'home'
              ? isDarkMode
                ? 'text-amber-300 font-black bg-amber-400/15 border border-amber-400/40 shadow-2xs'
                : 'text-slate-950 font-black bg-amber-100 border border-amber-300 shadow-2xs'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9.5px] sm:text-[11px] font-bold whitespace-nowrap leading-none">{t.navHome}</span>
        </button>

        <button
          onClick={() => setCurrentTab('play')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl cursor-pointer transition-all ${
            currentTab === 'play'
              ? isDarkMode
                ? 'text-amber-300 font-black bg-amber-400/15 border border-amber-400/40 shadow-2xs'
                : 'text-slate-950 font-black bg-amber-100 border border-amber-300 shadow-2xs'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          <span className="text-[9.5px] sm:text-[11px] font-bold whitespace-nowrap leading-none">{t.navPlay}</span>
        </button>

        <button
          onClick={() => setCurrentTab('levels')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl cursor-pointer transition-all ${
            currentTab === 'levels'
              ? isDarkMode
                ? 'text-amber-300 font-black bg-amber-400/15 border border-amber-400/40 shadow-2xs'
                : 'text-slate-950 font-black bg-amber-100 border border-amber-300 shadow-2xs'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9.5px] sm:text-[11px] font-bold whitespace-nowrap leading-none">{t.navLevels}</span>
        </button>

        <button
          onClick={() => setCurrentTab('shop')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl cursor-pointer transition-all ${
            currentTab === 'shop'
              ? isDarkMode
                ? 'text-amber-300 font-black bg-amber-400/15 border border-amber-400/40 shadow-2xs'
                : 'text-slate-950 font-black bg-amber-100 border border-amber-300 shadow-2xs'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9.5px] sm:text-[11px] font-bold whitespace-nowrap leading-none">{t.navShop}</span>
        </button>

        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl cursor-pointer transition-all ${
            currentTab === 'profile'
              ? isDarkMode
                ? 'text-amber-300 font-black bg-amber-400/15 border border-amber-400/40 shadow-2xs'
                : 'text-slate-950 font-black bg-amber-100 border border-amber-300 shadow-2xs'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9.5px] sm:text-[11px] font-bold whitespace-nowrap leading-none">{t.navProfile}</span>
        </button>
      </nav>

      {/* Modals */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        lang={lang}
        isDarkMode={isDarkMode}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        lang={lang}
        isDarkMode={isDarkMode}
      />

      <VictoryModal
        isOpen={showVictory}
        timeSeconds={elapsedTime}
        backtracks={backtracks}
        isDaily={gameMode === 'daily'}
        earnedCoins={earnedCoinsLastWin}
        stars={lastWonStars}
        onNext={handleNextPuzzle}
        onReplay={() => loadNewPuzzle(puzzle)}
        lang={lang}
        isDarkMode={isDarkMode}
      />

      <RewardedAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onRewardGranted={handleRewardHintsGranted}
        onRewardCoinsGranted={handleRewardCoinsGranted}
        coins={playerProfile.coins}
        onBuyQuickHints={handleBuyQuickHints}
        onBuySingleHint={handleBuySingleHint}
        onOpenShop={() => {
          setShowAdModal(false);
          setCurrentTab('shop');
        }}
        lang={lang}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
