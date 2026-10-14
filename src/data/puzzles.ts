import { Puzzle } from '../types/game';
import { generatePuzzle } from '../utils/generator';

// Curated campaign with deterministic seeds ensuring 100% mathematical validity
export const CURATED_PUZZLES: Puzzle[] = [
  // Tier 1: 5x5 Warm-Up Puzzles
  generatePuzzle(5, 5, 'warmup', 'w1', { en: 'Warm-Up 1: First Steps', ar: 'الإحماء ١: الخطوات الأولى' }, 101),
  generatePuzzle(5, 5, 'warmup', 'w2', { en: 'Warm-Up 2: The Gateway', ar: 'الإحماء ٢: البوابة' }, 102),
  generatePuzzle(5, 5, 'warmup', 'w3', { en: 'Warm-Up 3: Corner Run', ar: 'الإحماء ٣: ركض الزوايا' }, 103),
  generatePuzzle(5, 5, 'warmup', 'w4', { en: 'Warm-Up 4: Center Loop', ar: 'الإحماء ٤: حلقة المركز' }, 104),
  generatePuzzle(5, 5, 'warmup', 'w5', { en: 'Warm-Up 5: The Snake', ar: 'الإحماء ٥: المسار المتعرج' }, 105),
  generatePuzzle(5, 5, 'warmup', 'w6', { en: 'Warm-Up 6: The Spiral', ar: 'الإحماء ٦: الحلزون' }, 106),

  // Tier 2: 6x6 Medium Puzzles
  generatePuzzle(6, 6, 'medium', 'm1', { en: 'Medium 1: Double Bypass', ar: 'المتوسط ١: التحويلة المزدوجة' }, 201),
  generatePuzzle(6, 6, 'medium', 'm2', { en: 'Medium 2: The Labyrinth', ar: 'المتوسط ٢: المتاهة' }, 202),
  generatePuzzle(6, 6, 'medium', 'm3', { en: 'Medium 3: Zigzag Cascade', ar: 'المتوسط ٣: شلال الزجزاج' }, 203),
  generatePuzzle(6, 6, 'medium', 'm4', { en: 'Medium 4: Perimeter Guard', ar: 'المتوسط ٤: حارس المحيط' }, 204),
  generatePuzzle(6, 6, 'medium', 'm5', { en: 'Medium 5: Four Quadrants', ar: 'المتوسط ٥: الأرباع الأربعة' }, 205),
  generatePuzzle(6, 6, 'medium', 'm6', { en: 'Medium 6: Crossroads', ar: 'المتوسط ٦: مفترق الطرق' }, 206),

  // Tier 3: 7x7 Hard Puzzles
  generatePuzzle(7, 7, 'hard', 'h1', { en: 'Hard 1: Great Serpent', ar: 'الصعب ١: الأفعى الكبرى' }, 301),
  generatePuzzle(7, 7, 'hard', 'h2', { en: 'Hard 2: Concentric Ring', ar: 'الصعب ٢: الحلقات متحدة المركز' }, 302),
  generatePuzzle(7, 7, 'hard', 'h3', { en: 'Hard 3: The Weaver', ar: 'الصعب ٣: النسّاج' }, 303),
  generatePuzzle(7, 7, 'hard', 'h4', { en: 'Hard 4: The Citadel', ar: 'الصعب ٤: القلعة' }, 304),
  generatePuzzle(7, 7, 'hard', 'h5', { en: 'Hard 5: Desert Oasis', ar: 'الصعب ٥: واحة الصحراء' }, 305),
  generatePuzzle(7, 7, 'hard', 'h6', { en: 'Hard 6: Ancient Fortress', ar: 'الصعب ٦: الحصن القديم' }, 306),

  // Tier 4: 8x8 Expert Puzzles
  generatePuzzle(8, 8, 'expert', 'e1', { en: 'Expert 1: Infinite Loop', ar: 'الخبير ١: الحلقة اللانهائية' }, 401),
  generatePuzzle(8, 8, 'expert', 'e2', { en: 'Expert 2: The Grand Matrix', ar: 'الخبير ٢: المصفوفة الكبرى' }, 402),
  generatePuzzle(8, 8, 'expert', 'e3', { en: 'Expert 3: Crown Jewel', ar: 'الخبير ٣: جوهرة التاج' }, 403),
  generatePuzzle(8, 8, 'expert', 'e4', { en: 'Expert 4: The Minotaur', ar: 'الخبير ٤: المينوتور' }, 404),
  generatePuzzle(8, 8, 'expert', 'e5', { en: 'Expert 5: Starburst', ar: 'الخبير ٥: النجم المشع' }, 405),
  generatePuzzle(8, 8, 'expert', 'e6', { en: 'Expert 6: The Master Key', ar: 'الخبير ٦: المفتاح الأعظم' }, 406),
];

// Deterministic Daily Puzzle Generator
export function getDailyPuzzle(dateStr: string): Puzzle {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }

  // Parse date components safely (YYYY-MM-DD)
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const monthNamesEn = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const mAr = monthNamesAr[month] || '';
  const mEn = monthNamesEn[month] || '';

  const p = generatePuzzle(
    6,
    6,
    'medium',
    `daily_${dateStr}`,
    {
      en: `Daily Challenge (${mEn} ${day})`,
      ar: `التحدي اليومي (${day} ${mAr})`,
    },
    hash || 9999
  );
  p.dailyDate = dateStr;
  return p;
}
