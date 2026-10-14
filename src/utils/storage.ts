import { PlayerStats } from '../types/game';

const STATS_KEY = 'zipline_player_stats';
const SAVED_PROGRESS_KEY = 'zipline_saved_game_state';

export function calculateStars(timeSeconds: number, backtracks: number): number {
  if (backtracks <= 1 && timeSeconds <= 75) return 3;
  if (backtracks <= 4 && timeSeconds <= 180) return 2;
  return 1;
}

export function getPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean legacy fake / mock template seed data (12 streak, 32 solved, 35 stars)
      if (
        parsed.currentStreak === 12 ||
        parsed.gamesWon === 32 ||
        (parsed.gamesWon > 0 && (!parsed.completedPuzzles || parsed.completedPuzzles.length === 0))
      ) {
        const clean: PlayerStats = {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          maxStreak: 0,
          lastPlayedDate: null,
          bestTime: null,
          completedPuzzles: [],
          puzzleStars: {},
        };
        localStorage.setItem(STATS_KEY, JSON.stringify(clean));
        return clean;
      }
      if (!parsed.puzzleStars) parsed.puzzleStars = {};
      return parsed;
    }
  } catch {
    // ignore
  }
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: null,
    bestTime: null,
    completedPuzzles: [],
    puzzleStars: {},
  };
}

export function resetPlayerStats(): PlayerStats {
  const clean: PlayerStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: null,
    bestTime: null,
    completedPuzzles: [],
    puzzleStars: {},
  };
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(clean));
  } catch {
    // ignore
  }
  return clean;
}

export function savePlayerVictory(
  puzzleId: string,
  timeSeconds: number,
  isDaily: boolean,
  dailyDate?: string,
  backtracks: number = 0
): { stats: PlayerStats; stars: number } {
  const stats = getPlayerStats();
  stats.gamesPlayed += 1;
  stats.gamesWon += 1;

  if (!stats.completedPuzzles.includes(puzzleId)) {
    stats.completedPuzzles.push(puzzleId);
  }

  // Calculate stars earned
  const earnedStars = calculateStars(timeSeconds, backtracks);
  if (!stats.puzzleStars) stats.puzzleStars = {};
  const currentBestStars = stats.puzzleStars[puzzleId] || 0;
  if (earnedStars > currentBestStars) {
    stats.puzzleStars[puzzleId] = earnedStars;
  }

  if (stats.bestTime === null || timeSeconds < stats.bestTime) {
    stats.bestTime = timeSeconds;
  }

  if (isDaily && dailyDate) {
    const today = dailyDate;
    if (stats.lastPlayedDate) {
      const lastDate = new Date(stats.lastPlayedDate);
      const currDate = new Date(today);
      const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        stats.currentStreak += 1;
      } else if (diffDays > 1) {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }
    stats.lastPlayedDate = today;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
  }

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }

  return { stats, stars: earnedStars };
}

export function saveGameState(state: {
  puzzleId: string;
  path: Array<{ r: number; c: number }>;
  elapsedTime: number;
  backtracks: number;
}) {
  try {
    localStorage.setItem(SAVED_PROGRESS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function loadSavedGameState(): {
  puzzleId: string;
  path: Array<{ r: number; c: number }>;
  elapsedTime: number;
  backtracks: number;
} | null {
  try {
    const raw = localStorage.getItem(SAVED_PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function clearSavedGameState() {
  try {
    localStorage.removeItem(SAVED_PROGRESS_KEY);
  } catch {
    // ignore
  }
}
