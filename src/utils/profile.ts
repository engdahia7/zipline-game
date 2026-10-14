import { PlayerProfile, Achievement, ShopItem, PathTheme, BoardTheme, TokenTheme } from '../types/game';

const PROFILE_KEY = 'zipline_player_profile';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_win',
    titleAr: 'الخطوة الأولى',
    titleEn: 'First Path',
    descAr: 'حل أول لغز بنجاح في اللعبة',
    icon: '🎯',
    rewardCoins: 50,
  },
  {
    id: 'streak_3',
    titleAr: 'سلسلة المداومة',
    titleEn: '3-Day Streak',
    descAr: 'المواظبة على اللعب لمدة 3 أيام متتالية',
    icon: '🔥',
    rewardCoins: 100,
  },
  {
    id: 'expert_solver',
    titleAr: 'سيد الشبكات',
    titleEn: 'Grid Master',
    descAr: 'حل لغز بمقاس 8×8 بنجاح',
    icon: '👑',
    rewardCoins: 150,
  },
  {
    id: 'speed_demon',
    titleAr: 'سرعة البرق',
    titleEn: 'Speedy Path',
    descAr: 'حل لغز كامل في أقل من دقيقة واحدة',
    icon: '⚡',
    rewardCoins: 75,
  },
  {
    id: 'collector',
    titleAr: 'هاوي المقتنيات',
    titleEn: 'Collector',
    descAr: 'شراء وتجهيز سمة جديدة من المتجر',
    icon: '💎',
    rewardCoins: 60,
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  // 1. Path Ribbon Themes
  {
    id: 'path_amber',
    category: 'path',
    name: 'Classic Amber',
    nameAr: 'العنبر الدافئ',
    descAr: 'مسار كلاسيكي هادئ بتدرجات ذهبية مريحة للعين',
    price: 0,
    preview: '#f59e0b',
    themeValue: 'amber',
  },
  {
    id: 'path_emerald',
    category: 'path',
    name: 'Forest Emerald',
    nameAr: 'الزمرد الملكي',
    descAr: 'شريط مسار نقي باللون الأخضر الزمردي الطبيعي',
    price: 120,
    preview: '#10b981',
    themeValue: 'emerald',
  },
  {
    id: 'path_ruby',
    category: 'path',
    name: 'Crimson Ruby',
    nameAr: 'الياقوت القرمزي',
    descAr: 'لون ياقوتي فاخر مستوحى من ألعاب الطاولة النبيلة',
    price: 150,
    preview: '#e11d48',
    themeValue: 'ruby',
  },
  {
    id: 'path_sapphire',
    category: 'path',
    name: 'Deep Sapphire',
    nameAr: 'الياقوت الأزرق',
    descAr: 'أزرق هادئ عميق يمنح التركيز والصفاء الذهني',
    price: 180,
    preview: '#2563eb',
    themeValue: 'sapphire',
  },
  {
    id: 'path_bronze',
    category: 'path',
    name: 'Antique Bronze',
    nameAr: 'البرونز العتيق',
    descAr: 'تدرج معدني كلاسيكي من البرونز المصقول',
    price: 220,
    preview: '#d97706',
    themeValue: 'bronze',
  },
  {
    id: 'path_violet',
    category: 'path',
    name: 'Neon Amethyst',
    nameAr: 'الأرجوان النيوني المضيء',
    descAr: 'شريط مسار أرجواني متوهج يضفي سحراً فريداً عالي التباين',
    price: 240,
    preview: '#c084fc',
    themeValue: 'violet',
  },
  {
    id: 'path_cyan',
    category: 'path',
    name: 'Electric Ice',
    nameAr: 'الجليد الكهربائي الفاتح',
    descAr: 'لون سماوي مشرق متوهج مريح وفائق الوضوح داخل الرقعة',
    price: 260,
    preview: '#67e8f9',
    themeValue: 'cyan',
  },
  {
    id: 'path_sunset',
    category: 'path',
    name: 'Solar Flare',
    nameAr: 'الشفق البرتقالي الناري',
    descAr: 'تدرج غروب ناري ملتهب يشع حماسة وطاقة أثناء الرسم',
    price: 280,
    preview: '#fb923c',
    themeValue: 'sunset',
  },
  {
    id: 'path_aurora',
    category: 'path',
    name: 'Polar Aurora',
    nameAr: 'أورورا الشفق القطبي',
    descAr: 'تدرج ليموني سيان نيون ساحر مستوحى من الأضواء القطبية',
    price: 300,
    preview: '#a3e635',
    themeValue: 'aurora',
    isPopular: true,
  },
  {
    id: 'path_plasma',
    category: 'path',
    name: 'Galactic Plasma',
    nameAr: 'بلازما المجرة الوردية',
    descAr: 'تدرج فوشيا أرجواني نابض بالحياة عالي الوضوح والجاذبية',
    price: 320,
    preview: '#f472b6',
    themeValue: 'plasma',
  },
  {
    id: 'path_gold',
    category: 'path',
    name: 'Pure 24K Gold',
    nameAr: 'الذهب الخالص عيار 24',
    descAr: 'شريط مسار ذهبي ملكي براق يليق بكبار أبطال الألغاز',
    price: 350,
    preview: '#fef08a',
    themeValue: 'gold',
    isPopular: true,
  },
  {
    id: 'path_matrix',
    category: 'path',
    name: 'Emerald Matrix',
    nameAr: 'مصفوفة الزمرد الفسفورية',
    descAr: 'شريط فسفوري متوهج يمنحك تركيزاً هندسياً فائقاً في رسم المسارات',
    price: 290,
    preview: '#4ade80',
    themeValue: 'matrix',
  },
  {
    id: 'path_crimson',
    category: 'path',
    name: 'Volcanic Magma',
    nameAr: 'الحمم البركانية المتوهجة',
    descAr: 'لهيب بركاني قرمزي ساطع يملأ المربعات بطاقة مشتعلة',
    price: 310,
    preview: '#b91c1c',
    themeValue: 'crimson',
  },
  {
    id: 'path_prism',
    category: 'path',
    name: 'Rainbow Prism',
    nameAr: 'منشور الألوان الطيفي',
    descAr: 'طيف لوني ساحر يجمع ألوان قوس قزح بتألق نقي ومبهج',
    price: 330,
    preview: '#06b6d4',
    themeValue: 'prism',
    isPopular: true,
  },
  {
    id: 'path_volcanic',
    category: 'path',
    name: 'Molten Volcano',
    nameAr: 'البركان الملتهب',
    descAr: 'طاقة بركانية جارفة بتدرجات الصهارة النارية الساطعة والواضحة',
    price: 350,
    preview: '#ff5722',
    themeValue: 'volcanic',
  },

  // 2. Board Skins
  {
    id: 'board_graphite',
    category: 'board',
    name: 'Slate Graphite',
    nameAr: 'الجرافيت الداكن',
    descAr: 'سطح جرافيتي مات غير لامع مريح ومضاد للإجهاد',
    price: 0,
    preview: '#1e293b',
    themeValue: 'graphite',
  },
  {
    id: 'board_walnut',
    category: 'board',
    name: 'Warm Walnut',
    nameAr: 'خشب الجوز الدافئ',
    descAr: 'ملمس خشبي راقٍ كأفخم رقعات الشطرنج الخشبية',
    price: 200,
    preview: '#271b16',
    themeValue: 'walnut',
  },
  {
    id: 'board_obsidian',
    category: 'board',
    name: 'Midnight Obsidian',
    nameAr: 'حجر السج الأسود',
    descAr: 'أسود فحمي شديد العمق مع حواف بارزة',
    price: 250,
    preview: '#090a0f',
    themeValue: 'obsidian',
  },
  {
    id: 'board_sandstone',
    category: 'board',
    name: 'Desert Sandstone',
    nameAr: 'الحجر الرملي الصحراوي',
    descAr: 'سطح ترابي طبيعي هادئ مستوحى من الأحجار الطبيعية',
    price: 260,
    preview: '#2c251e',
    themeValue: 'sandstone',
  },
  {
    id: 'board_marble',
    category: 'board',
    name: 'Royal Marble',
    nameAr: 'الرخام الملكي الكحلي',
    descAr: 'رقعة داكنة فخمة من حجر الرخام الكحلي الأنيق',
    price: 290,
    preview: '#0f172a',
    themeValue: 'marble',
  },
  {
    id: 'board_cyber',
    category: 'board',
    name: 'Cyber Grid',
    nameAr: 'السايبر المستقبلي (نيون)',
    descAr: 'شبكة تكنولوجية داكنة مع إطارات نيون سيان مضيئة وساحرة',
    price: 330,
    preview: '#030712',
    themeValue: 'cyber',
  },
  {
    id: 'board_emerald',
    category: 'board',
    name: 'Imperial Jade',
    nameAr: 'حجر اليشم الأخضر الملكي',
    descAr: 'أرضية خضراء داكنة عميقة مريحة للأعصاب وتساعد على التركيز',
    price: 310,
    preview: '#052014',
    themeValue: 'emerald_board',
  },
  {
    id: 'board_midnight',
    category: 'board',
    name: 'Royal Midnight',
    nameAr: 'الأزرق النيلي الملكي',
    descAr: 'أعماق الليل الملكية بتدرجات نيلية داكنة راقية وفائقة الفخامة',
    price: 320,
    preview: '#090d1a',
    themeValue: 'midnight',
    isPopular: true,
  },
  {
    id: 'board_carbon',
    category: 'board',
    name: 'Carbon Fiber',
    nameAr: 'ألياف الكربون الرياضية',
    descAr: 'ملمس تقني عصري من ألياف الكربون الرمادية عالية الصلابة والتباين',
    price: 340,
    preview: '#111827',
    themeValue: 'carbon',
  },
  {
    id: 'board_parchment',
    category: 'board',
    name: 'Ancient Papyrus',
    nameAr: 'ورق البردي الأثري (فاتح)',
    descAr: 'رقعة كلاسيكية فاتحة دافئة كالمخطوطات الأثرية القديمة',
    price: 330,
    preview: '#fefce8',
    themeValue: 'parchment',
  },
  {
    id: 'board_cherry',
    category: 'board',
    name: 'Imperial Cherry',
    nameAr: 'خشب الكرز الملكي الداكن',
    descAr: 'خشب محفور بلون عنابي قرمزي داكن يمنح فخامة استثنائية لألغازك',
    price: 350,
    preview: '#200b0e',
    themeValue: 'cherry',
  },
  {
    id: 'board_nebula',
    category: 'board',
    name: 'Stellar Nebula',
    nameAr: 'السديم الكوني النجمي',
    descAr: 'سحر الفضاء الخارجي مع إشعاع بنفسجي عميق وغموض ساحر',
    price: 360,
    preview: '#0f0c29',
    themeValue: 'nebula',
    isPopular: true,
  },
  {
    id: 'board_bamboo',
    category: 'board',
    name: 'Zen Bamboo',
    nameAr: 'خيزران الزن الطبيعي',
    descAr: 'أرضية خضراء زيتونية طبيعية تضفي هدوءاً وتأملاً صافياً أثناء التفكير',
    price: 270,
    preview: '#181f11',
    themeValue: 'bamboo',
  },
  {
    id: 'board_royal_velvet',
    category: 'board',
    name: 'Royal Velvet',
    nameAr: 'المخمل الملكي الأرجواني',
    descAr: 'خامة مخملية إمبراطورية أرجوانية شديدة الفخامة والتباين البصري',
    price: 340,
    preview: '#1e0e2e',
    themeValue: 'royal_velvet',
    isPopular: true,
  },

  // 3. Token Styles
  {
    id: 'token_classic',
    category: 'token',
    name: 'Classic Discs',
    nameAr: 'أقراص كلاسيكية',
    descAr: 'أرقام واضحة ومقروءة بأقراص ناعمة',
    price: 0,
    preview: '#475569',
    themeValue: 'classic',
  },
  {
    id: 'token_brass',
    category: 'token',
    name: 'Brass Medals',
    nameAr: 'ميداليات النحاس الأصفر',
    descAr: 'أقراص نحاسية مذهبة ذات إطار مميز',
    price: 140,
    preview: '#b45309',
    themeValue: 'brass',
  },
  {
    id: 'token_gem',
    category: 'token',
    name: 'Jeweled Seals',
    nameAr: 'أختام الجواهر',
    descAr: 'أختام هندسية بارزة تلفت الانتباه للأرقام',
    price: 210,
    preview: '#047857',
    themeValue: 'gem',
  },
  {
    id: 'token_neon',
    category: 'token',
    name: 'Cyber Neon',
    nameAr: 'أرقام النيون المستقبلية',
    descAr: 'أرقام مضيئة بحدود تقنية متوهجة فائقة الوضوح والتباين',
    price: 220,
    preview: '#38bdf8',
    themeValue: 'neon',
  },
  {
    id: 'token_crown',
    category: 'token',
    name: 'Royal Gold',
    nameAr: 'التيجان الذهبية الملكية',
    descAr: 'أختام مطلية بالذهب عيار 24 قيراط بتصميم ملكي فاخر',
    price: 250,
    preview: '#facc15',
    themeValue: 'crown',
  },
  {
    id: 'token_diamond',
    category: 'token',
    name: 'Crystal Diamond',
    nameAr: 'أختام الألماس البراق',
    descAr: 'أقراص بلورية سماوية نقية تشع نقاءً وبريقاً يخطف الأنظار',
    price: 270,
    preview: '#14b8a6',
    themeValue: 'diamond',
    isPopular: true,
  },
  {
    id: 'token_star',
    category: 'token',
    name: 'Imperial Ruby Star',
    nameAr: 'نجوم الياقوت الإمبراطورية',
    descAr: 'تصميم نجمي بارز باللون القرمزي والوردي الفاخر',
    price: 280,
    preview: '#f43f5e',
    themeValue: 'star',
  },
  {
    id: 'token_cyber_hex',
    category: 'token',
    name: 'Cyber Hexagon',
    nameAr: 'الأختام السداسية التقنية',
    descAr: 'هندسة سداسية بحدود أرجوانية تكنولوجية مستقبلية',
    price: 290,
    preview: '#9333ea',
    themeValue: 'cyber_hex',
  },
  {
    id: 'token_retro',
    category: 'token',
    name: '8-Bit Retro',
    nameAr: 'أقراص الريترو الكلاسيكية',
    descAr: 'أرقام كلاسيكية عتيقة مستوحاة من ألعاب الأركيد الذهبية',
    price: 260,
    preview: '#ca8a04',
    themeValue: 'retro',
  },
  {
    id: 'token_wooden',
    category: 'token',
    name: 'Carved Wood',
    nameAr: 'الأقراص الخشبية المحفورة',
    descAr: 'أختام خشبية كلاسيكية محفورة بدقة عالية وملمس دافئ',
    price: 210,
    preview: '#b45309',
    themeValue: 'wooden',
  },
  {
    id: 'token_platinum',
    category: 'token',
    name: 'Polished Platinum',
    nameAr: 'البلاتين الفضي المصقول',
    descAr: 'أقراص بلاتينية براقة ذات بريق نقي وإطار فضي مصقول',
    price: 290,
    preview: '#94a3b8',
    themeValue: 'platinum',
    isPopular: true,
  },

  // 4. Hints Packs (حزم المساعدات والتلميحات)
  {
    id: 'hint_pack_1',
    category: 'hints',
    name: 'Single Quick Hint',
    nameAr: 'تلميح سريع فردي',
    descAr: 'مساعدة واحدة سريعة لإنقاذك عند الوقوع في خطوة حرجة',
    price: 20,
    preview: '#f59e0b',
    hintAmount: 1,
  },
  {
    id: 'hint_pack_3',
    category: 'hints',
    name: '3 Hints Pack',
    nameAr: 'حزمة 3 تلميحات فورية',
    descAr: 'ثلاث مساعدات فورية لحل أصعب خطوات الألغاز المعقدة',
    price: 50,
    preview: '#f59e0b',
    hintAmount: 3,
  },
  {
    id: 'hint_pack_10',
    category: 'hints',
    name: '10 Hints Pack',
    nameAr: 'حزمة 10 تلميحات (الأفضل قيمة)',
    descAr: 'عشر مساعدات لكافة الألغاز مع توفير كبير في العملات الذهبية',
    price: 130,
    preview: '#eab308',
    hintAmount: 10,
    isPopular: true,
  },
  {
    id: 'hint_daily_pass',
    category: 'hints',
    name: '15 Hints Pro Pass',
    nameAr: 'حزمة المحترفين: 15 تلميحاً',
    descAr: 'خمسة عشر تلميحاً فورياً لتخطي كافة العقبات المعقدة بسهولة',
    price: 190,
    preview: '#fbbf24',
    hintAmount: 15,
  },
  {
    id: 'hint_pack_25',
    category: 'hints',
    name: '25 Mega Hints Pack',
    nameAr: 'الحزمة الضخمة: 25 تلميحاً',
    descAr: 'ترسانة كاملة من المساعدات لكافة المستويات والتحديات الصعبة',
    price: 280,
    preview: '#fbbf24',
    hintAmount: 25,
  },
  {
    id: 'hint_pack_50',
    category: 'hints',
    name: '50 Master Hints Stash',
    nameAr: 'حزمة الأساطير: 50 تلميحاً (توفير 50%)',
    descAr: 'أضخم مخزون مساعدات يمنحك راحة تامة طوال جميع الفصول والتحديات',
    price: 490,
    preview: '#f59e0b',
    hintAmount: 50,
    isPopular: true,
  },

  // 5. Exclusive Avatars (الصور الرمزية الحصرية)
  {
    id: 'avatar_lion',
    category: 'avatar',
    name: 'Golden Lion',
    nameAr: 'الأسد الذهبي الشجاع',
    descAr: 'صورة رمزية حصرية للملف الشخصي تعبر عن الهيبة والفطنة',
    price: 80,
    preview: '#f59e0b',
    avatarChar: '🦁',
  },
  {
    id: 'avatar_crown',
    category: 'avatar',
    name: 'Royal Crown',
    nameAr: 'التاج الملكي الفاخر',
    descAr: 'صورة رمزية لأبطال الألغاز المتربعين على الصدارة',
    price: 100,
    preview: '#fbbf24',
    avatarChar: '👑',
  },
  {
    id: 'avatar_dragon',
    category: 'avatar',
    name: 'Mystic Dragon',
    nameAr: 'التنين الأسطوري',
    descAr: 'رمز القوة والسرعة والتحديات الأسطورية',
    price: 120,
    preview: '#ef4444',
    avatarChar: '🐉',
  },
  {
    id: 'avatar_rocket',
    category: 'avatar',
    name: 'Cosmic Rocket',
    nameAr: 'صاروخ السرعة الفضائي',
    descAr: 'لعشاق السرعة وتحطيم الأرقام القياسية في الحل',
    price: 90,
    preview: '#38bdf8',
    avatarChar: '🚀',
  },
  {
    id: 'avatar_crystal',
    category: 'avatar',
    name: 'Magic Crystal',
    nameAr: 'البلورة السحرية المتوهجة',
    descAr: 'رمز الرؤية الثاقبة والتركيز التحليلي المتقد',
    price: 110,
    preview: '#a855f7',
    avatarChar: '🔮',
  },
  {
    id: 'avatar_wizard',
    category: 'avatar',
    name: 'Grand Wizard',
    nameAr: 'الساحر العبقري الحكيم',
    descAr: 'رمز سحر المنطق والتفكير المعقد وتفكيك أعقد الطلاسم',
    price: 130,
    preview: '#8b5cf6',
    avatarChar: '🧙‍♂️',
    isPopular: true,
  },
  {
    id: 'avatar_ninja',
    category: 'avatar',
    name: 'Stealth Ninja',
    nameAr: 'نينجا المسارات الخفي',
    descAr: 'حركات رشيقة ودقة حاسمة لا تخطئ أي خطوة على الرقعة',
    price: 140,
    preview: '#0f172a',
    avatarChar: '🥷',
  },
  {
    id: 'avatar_knight',
    category: 'avatar',
    name: 'Golden Knight',
    nameAr: 'الفارس الشجاع',
    descAr: 'رمز البسالة والتخطيط الاستراتيجي المحكم في كل خطوة',
    price: 120,
    preview: '#eab308',
    avatarChar: '🛡️',
  },
  {
    id: 'avatar_falcon',
    category: 'avatar',
    name: 'Royal Falcon',
    nameAr: 'الصقر الجارح',
    descAr: 'رؤية ثاقبة تلتقط أدق المسارات والحلول من أعلى سماء التحديات',
    price: 135,
    preview: '#0284c7',
    avatarChar: '🦅',
    isPopular: true,
  },
  {
    id: 'avatar_wolf',
    category: 'avatar',
    name: 'Lone Wolf',
    nameAr: 'الذئب النبيل',
    descAr: 'تركيز حاد وصبر استراتيجي لا يعرف الاستسلام أمام الصعاب',
    price: 110,
    preview: '#64748b',
    avatarChar: '🐺',
  },
  {
    id: 'avatar_pegasus',
    category: 'avatar',
    name: 'Mythic Steed',
    nameAr: 'الفرس الأصيل',
    descAr: 'رمز الرشاقة والسرعة الفائقة في قطع مسافات الرقعة بدقة متناهية',
    price: 125,
    preview: '#ec4899',
    avatarChar: '🐎',
  },
  {
    id: 'avatar_fire',
    category: 'avatar',
    name: 'Blazing Flame',
    nameAr: 'شعلة الحماس المتوقدة',
    descAr: 'رمز العزيمة الصلبة والشغف المشتعل لحل كل لغز',
    price: 95,
    preview: '#f97316',
    avatarChar: '🔥',
    isPopular: true,
  },
  {
    id: 'avatar_diamond',
    category: 'avatar',
    name: 'Sparkling Diamond',
    nameAr: 'الماسة النادرة البراقة',
    descAr: 'بريق خالص يعكس صفاء الفكر وأناقة العقل المفكر',
    price: 150,
    preview: '#14b8a6',
    avatarChar: '💎',
  },
  {
    id: 'avatar_owl',
    category: 'avatar',
    name: 'Wise Owl',
    nameAr: 'بومة الحكمة والمعرفة',
    descAr: 'رؤية ثاقبة في ظلمات الألغاز وتأمل عميق وهدوء حكيم',
    price: 85,
    preview: '#78350f',
    avatarChar: '🦉',
  },
  {
    id: 'avatar_tiger',
    category: 'avatar',
    name: 'Fierce Tiger',
    nameAr: 'النمر الباسل الشجاع',
    descAr: 'هيبة وقوة وشجاعة لا تهاب أصعب التحديات والمستويات',
    price: 115,
    preview: '#ea580c',
    avatarChar: '🐯',
  },
  {
    id: 'avatar_astronaut',
    category: 'avatar',
    name: 'Cosmic Explorer',
    nameAr: 'رائد الفضاء المستكشف',
    descAr: 'استكشاف آفاق جديدة في عوالم الألغاز والمنطق الفضائي',
    price: 125,
    preview: '#3b82f6',
    avatarChar: '👨‍🚀',
  },
];

export const AVATAR_OPTIONS = [
  '🧭', '🦊', '🦉', '♟️', '🦁', '🌿', '⚡', '🌟', '🎲', '☕',
  '👑', '🐉', '🚀', '🔮', '🧙‍♂️', '🥷', '🛡️', '🔥', '💎', '🐯', '👨‍🚀',
  '🦅', '🐺', '🐎'
];

export function getPlayerProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean legacy fake/default seed numbers if user had them from fresh template
      const isLegacyDefaultSeed =
        (parsed.coins === 100 && parsed.hints === 3 && (!parsed.achievementsUnlocked || parsed.achievementsUnlocked.length === 0)) ||
        (parsed.coins === 490 && (!parsed.achievementsUnlocked || parsed.achievementsUnlocked.length === 0));
      const cleanCoins = isLegacyDefaultSeed ? 0 : (typeof parsed.coins === 'number' ? parsed.coins : 0);
      const cleanHints = isLegacyDefaultSeed ? 0 : (typeof parsed.hints === 'number' ? parsed.hints : 0);
      const cleanAvatar = parsed.avatar === '🤖' ? '🛡️' : (parsed.avatar || '🧭');

      return {
        name: parsed.name || 'لاعب المسارات',
        avatar: cleanAvatar,
        coins: cleanCoins,
        hints: cleanHints,
        equippedPath: parsed.equippedPath || 'amber',
        equippedBoard: parsed.equippedBoard || 'graphite',
        equippedToken: parsed.equippedToken || 'classic',
        unlockedItems: parsed.unlockedItems || ['path_amber', 'board_graphite', 'token_classic'],
        achievementsUnlocked: parsed.achievementsUnlocked || [],
        unlockedAvatars: parsed.unlockedAvatars || AVATAR_OPTIONS,
        lastDailyClaimDate: parsed.lastDailyClaimDate,
        hintLimitPerPuzzle: typeof parsed.hintLimitPerPuzzle !== 'undefined' ? parsed.hintLimitPerPuzzle : 3,
        adsWatchedCount: typeof parsed.adsWatchedCount === 'number' ? parsed.adsWatchedCount : 0,
      };
    }
  } catch {
    // fallback
  }

  return {
    name: 'لاعب المسارات',
    avatar: '🧭',
    coins: 0,
    hints: 0,
    equippedPath: 'amber',
    equippedBoard: 'graphite',
    equippedToken: 'classic',
    unlockedItems: ['path_amber', 'board_graphite', 'token_classic'],
    achievementsUnlocked: [],
    unlockedAvatars: AVATAR_OPTIONS,
    hintLimitPerPuzzle: 3,
    adsWatchedCount: 0,
  };
}

export function resetPlayerProfile(): PlayerProfile {
  const clean: PlayerProfile = {
    name: 'لاعب المسارات',
    avatar: '🧭',
    coins: 0,
    hints: 0,
    equippedPath: 'amber',
    equippedBoard: 'graphite',
    equippedToken: 'classic',
    unlockedItems: ['path_amber', 'board_graphite', 'token_classic'],
    achievementsUnlocked: [],
    unlockedAvatars: AVATAR_OPTIONS,
    hintLimitPerPuzzle: 3,
    adsWatchedCount: 0,
  };
  savePlayerProfile(clean);
  return clean;
}

export function savePlayerProfile(profile: PlayerProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function addCoinsToProfile(amount: number): PlayerProfile {
  const p = getPlayerProfile();
  p.coins += amount;
  savePlayerProfile(p);
  return p;
}

export function addHintsToProfile(amount: number): PlayerProfile {
  const p = getPlayerProfile();
  p.hints = (p.hints || 0) + amount;
  savePlayerProfile(p);
  return p;
}

export function useHintFromProfile(): { success: boolean; remainingHints: number; profile: PlayerProfile } {
  const p = getPlayerProfile();
  if ((p.hints || 0) > 0) {
    p.hints = (p.hints || 0) - 1;
    savePlayerProfile(p);
    return { success: true, remainingHints: p.hints, profile: p };
  }
  return { success: false, remainingHints: 0, profile: p };
}

export function buyItem(itemId: string): { success: boolean; profile: PlayerProfile; message: string } {
  const p = getPlayerProfile();
  const item = SHOP_ITEMS.find(i => i.id === itemId);

  if (!item) {
    return { success: false, profile: p, message: 'العنصر غير موجود' };
  }

  // Hint packs can be purchased multiple times!
  if (item.category === 'hints') {
    if (p.coins < item.price) {
      return { success: false, profile: p, message: 'رصيد العملات غير كافٍ لاقتناء حزمة التلميحات' };
    }
    p.coins -= item.price;
    const added = item.hintAmount || 1;
    p.hints = (p.hints || 0) + added;
    savePlayerProfile(p);
    return {
      success: true,
      profile: p,
      message: `تمت إضافة +${added} تلميحات بنجاح! رصيدك الحالي: ${p.hints} تلميح.`,
    };
  }

  // Avatar purchase
  if (item.category === 'avatar') {
    if (p.unlockedItems.includes(itemId)) {
      p.avatar = item.avatarChar || p.avatar;
      savePlayerProfile(p);
      return { success: true, profile: p, message: `تم تجهيز الصورة الرمزية ${item.avatarChar}!` };
    }
    if (p.coins < item.price) {
      return { success: false, profile: p, message: 'رصيد العملات غير كافٍ' };
    }
    p.coins -= item.price;
    p.unlockedItems.push(itemId);
    if (item.avatarChar) {
      p.avatar = item.avatarChar;
      if (!p.unlockedAvatars?.includes(item.avatarChar)) {
        p.unlockedAvatars = [...(p.unlockedAvatars || []), item.avatarChar];
      }
    }
    savePlayerProfile(p);
    return { success: true, profile: p, message: `تم اقتناء وتجهيز الصورة الرمزية ${item.avatarChar} بنجاح!` };
  }

  // Themes (path, board, token)
  if (p.unlockedItems.includes(itemId)) {
    return { success: true, profile: p, message: 'العنصر ممتلك بالفعل' };
  }

  if (p.coins < item.price) {
    return { success: false, profile: p, message: 'رصيد العملات غير كافٍ' };
  }

  p.coins -= item.price;
  p.unlockedItems.push(itemId);

  // Auto equip on purchase
  if (item.category === 'path' && item.themeValue) p.equippedPath = item.themeValue as PathTheme;
  if (item.category === 'board' && item.themeValue) p.equippedBoard = item.themeValue as BoardTheme;
  if (item.category === 'token' && item.themeValue) p.equippedToken = item.themeValue as TokenTheme;

  savePlayerProfile(p);
  return { success: true, profile: p, message: 'تم الشراء والتجهيز بنجاح!' };
}

export function equipItem(itemId: string): PlayerProfile {
  const p = getPlayerProfile();
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return p;

  if (item.category === 'avatar' && item.avatarChar) {
    p.avatar = item.avatarChar;
    savePlayerProfile(p);
    return p;
  }

  if (!p.unlockedItems.includes(itemId)) return p;

  if (item.category === 'path' && item.themeValue) p.equippedPath = item.themeValue as PathTheme;
  if (item.category === 'board' && item.themeValue) p.equippedBoard = item.themeValue as BoardTheme;
  if (item.category === 'token' && item.themeValue) p.equippedToken = item.themeValue as TokenTheme;

  savePlayerProfile(p);
  return p;
}

export function canClaimDailyReward(profile: PlayerProfile, todayStr: string): boolean {
  return profile.lastDailyClaimDate !== todayStr;
}

export function claimDailyReward(todayStr: string, rewardAmount = 50): { success: boolean; profile: PlayerProfile; reward: number } {
  const p = getPlayerProfile();
  if (p.lastDailyClaimDate === todayStr) {
    return { success: false, profile: p, reward: 0 };
  }
  p.coins += rewardAmount;
  p.lastDailyClaimDate = todayStr;
  savePlayerProfile(p);
  return { success: true, profile: p, reward: rewardAmount };
}

export function setHintLimitPreference(limit: number | 'unlimited'): PlayerProfile {
  const p = getPlayerProfile();
  p.hintLimitPerPuzzle = limit;
  savePlayerProfile(p);
  return p;
}

export function recordWatchedAd(hintsGranted = 2, coinsGranted = 0): { profile: PlayerProfile; hintsGranted: number; coinsGranted: number } {
  const p = getPlayerProfile();
  p.hints = (p.hints || 0) + hintsGranted;
  if (coinsGranted > 0) {
    p.coins = (p.coins || 0) + coinsGranted;
  }
  p.adsWatchedCount = (p.adsWatchedCount || 0) + 1;
  savePlayerProfile(p);
  return { profile: p, hintsGranted, coinsGranted };
}
