export interface Coordinate {
  r: number;
  c: number;
}

export interface Checkpoint {
  r: number;
  c: number;
  val: number;
}

export interface Wall {
  r1: number;
  c1: number;
  c2: number;
  r2: number;
}

export type Difficulty = 'warmup' | 'medium' | 'hard' | 'expert';

export interface Puzzle {
  id: string;
  title: string;
  titleAr: string;
  width: number;
  height: number;
  difficulty: Difficulty;
  checkpoints: Checkpoint[];
  walls: Wall[];
  solutionPath: Coordinate[];
  dailyDate?: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  bestTime: number | null;
  completedPuzzles: string[];
  puzzleStars?: Record<string, number>;
}

export type PageTab = 'home' | 'play' | 'levels' | 'shop' | 'profile';
export type GameMode = 'daily' | 'levels' | 'custom' | 'timerush' | 'suddendeath' | 'mega_weekly';

export type PathTheme =
  | 'amber'
  | 'emerald'
  | 'ruby'
  | 'sapphire'
  | 'bronze'
  | 'violet'
  | 'cyan'
  | 'sunset'
  | 'aurora'
  | 'plasma'
  | 'gold'
  | 'matrix'
  | 'crimson'
  | 'prism'
  | 'volcanic';

export type BoardTheme =
  | 'graphite'
  | 'walnut'
  | 'obsidian'
  | 'sandstone'
  | 'marble'
  | 'cyber'
  | 'emerald_board'
  | 'midnight'
  | 'carbon'
  | 'parchment'
  | 'cherry'
  | 'nebula'
  | 'bamboo'
  | 'royal_velvet';

export type TokenTheme =
  | 'classic'
  | 'brass'
  | 'gem'
  | 'neon'
  | 'crown'
  | 'diamond'
  | 'star'
  | 'cyber_hex'
  | 'retro'
  | 'wooden'
  | 'platinum';

export type ShopCategory = 'path' | 'board' | 'token' | 'hints' | 'avatar';

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string;
  nameAr: string;
  descAr: string;
  price: number;
  preview: string;
  themeValue?: string;
  hintAmount?: number;
  avatarChar?: string;
  isPopular?: boolean;
}

export interface Achievement {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  icon: string;
  rewardCoins: number;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  coins: number;
  hints: number;
  equippedPath: PathTheme;
  equippedBoard: BoardTheme;
  equippedToken: TokenTheme;
  unlockedItems: string[];
  achievementsUnlocked: string[];
  unlockedAvatars?: string[];
  lastDailyClaimDate?: string;
  hintLimitPerPuzzle?: number | 'unlimited'; // Max hints allowed per puzzle (0, 1, 3, or 'unlimited')
  adsWatchedCount?: number; // Total rewarded ads watched
}
