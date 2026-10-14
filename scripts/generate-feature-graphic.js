import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgGraphic = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060b18" />
      <stop offset="35%" stop-color="#0c172e" />
      <stop offset="70%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#030712" />
    </linearGradient>

    <radialGradient id="glowCyan" cx="28%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#06b6d4" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="glowPurple" cx="80%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.25" />
      <stop offset="70%" stop-color="#8b5cf6" stop-opacity="0" />
    </radialGradient>

    <!-- Path Line Gradient -->
    <linearGradient id="neonLine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="30%" stop-color="#818cf8" />
      <stop offset="70%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <!-- Filters -->
    <filter id="intenseGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur1" />
      <feGaussianBlur stdDeviation="6" result="blur2" />
      <feMerge>
        <feMergeNode in="blur1" />
        <feMergeNode in="blur2" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1024" height="500" fill="url(#bg)" />

  <!-- Ambient Glows -->
  <rect width="1024" height="500" fill="url(#glowCyan)" />
  <rect width="1024" height="500" fill="url(#glowPurple)" />

  <!-- Geometric Grid Pattern (Subtle) -->
  <g opacity="0.08" stroke="#38bdf8" stroke-width="1.5">
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" />
      <circle cx="0" cy="0" r="1.5" fill="#38bdf8" />
    </pattern>
    <rect width="1024" height="500" fill="url(#gridPattern)" />
  </g>

  <!-- Left Side: Interactive Puzzle Board Visual (Card) -->
  <g transform="translate(60, 50)" filter="url(#cardShadow)">
    <!-- Board Base Card -->
    <rect width="400" height="400" rx="28" fill="#111c38" stroke="#1e293b" stroke-width="3" />
    <rect width="396" height="396" x="2" y="2" rx="26" fill="none" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.5" />

    <!-- Grid Dots / Empty slots -->
    <g opacity="0.25">
      <!-- 4x4 Grid of slots -->
      <rect x="35" y="35" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="125" y="35" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="215" y="35" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="305" y="35" width="65" height="65" rx="14" fill="#1e293b" />

      <rect x="35" y="125" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="125" y="125" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="215" y="125" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="305" y="125" width="65" height="65" rx="14" fill="#1e293b" />

      <rect x="35" y="215" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="125" y="215" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="215" y="215" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="305" y="215" width="65" height="65" rx="14" fill="#1e293b" />

      <rect x="35" y="305" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="125" y="305" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="215" y="305" width="65" height="65" rx="14" fill="#1e293b" />
      <rect x="305" y="305" width="65" height="65" rx="14" fill="#1e293b" />
    </g>

    <!-- Glowing Connecting Path -->
    <path d="M 67 67 L 337 67 L 337 157 L 157 157 L 157 247 L 337 247 L 337 337 L 67 337" 
          fill="none" 
          stroke="url(#neonLine)" 
          stroke-width="16" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          filter="url(#intenseGlow)" />

    <!-- Node 1 (Start) -->
    <circle cx="67" cy="67" r="26" fill="#38bdf8" stroke="#ffffff" stroke-width="4" />
    <text x="67" y="76" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#041226" text-anchor="middle">1</text>

    <!-- Node 2 -->
    <circle cx="337" cy="67" r="24" fill="#818cf8" stroke="#ffffff" stroke-width="4" />
    <text x="337" y="75" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#041226" text-anchor="middle">2</text>

    <!-- Node 3 -->
    <circle cx="157" cy="157" r="24" fill="#a855f7" stroke="#ffffff" stroke-width="4" />
    <text x="157" y="165" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>

    <!-- Node 4 -->
    <circle cx="337" cy="247" r="24" fill="#ec4899" stroke="#ffffff" stroke-width="4" />
    <text x="337" y="255" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">4</text>

    <!-- Node 5 (Finish) -->
    <circle cx="67" cy="337" r="28" fill="#f59e0b" stroke="#ffffff" stroke-width="5" />
    <text x="67" y="347" font-family="system-ui, sans-serif" font-size="25" font-weight="900" fill="#041226" text-anchor="middle">5</text>
  </g>

  <!-- Right Side: Branding & Typography -->
  <g transform="translate(520, 95)">
    <!-- Category Pill Badge -->
    <rect width="180" height="34" rx="17" fill="rgba(56, 189, 248, 0.16)" stroke="#38bdf8" stroke-width="1.5" />
    <text x="90" y="22" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="1.5">BRAIN PUZZLE</text>

    <!-- App Title: ZipLine -->
    <text x="0" y="105" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="900" fill="#ffffff" letter-spacing="-1">
      Zip<tspan fill="#38bdf8">Line</tspan>
    </text>

    <!-- Arabic Title & Subtitle -->
    <text x="0" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="700" fill="#e2e8f0">
      لعبة مسار الأرقام والتحدي الذكي
    </text>

    <text x="0" y="185" font-family="system-ui, sans-serif" font-size="17" font-weight="500" fill="#94a3b8">
      Connect the dots • Master the path • Train your brain
    </text>

    <!-- Highlights Features Badges -->
    <g transform="translate(0, 225)">
      <!-- Badge 1: 100% Offline -->
      <g transform="translate(0, 0)">
        <rect width="135" height="42" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="67" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#f8fafc" text-anchor="middle">⚡ بدون إنترنت</text>
      </g>

      <!-- Badge 2: 100+ Levels -->
      <g transform="translate(148, 0)">
        <rect width="135" height="42" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="67" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#f8fafc" text-anchor="middle">🧩 100+ مرحلة</text>
      </g>

      <!-- Badge 3: Daily Challenge -->
      <g transform="translate(296, 0)">
        <rect width="145" height="42" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="72" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#f8fafc" text-anchor="middle">🏆 تحديات يومية</text>
      </g>
    </g>
  </g>

  <!-- Bottom Accent Line -->
  <rect x="0" y="494" width="1024" height="6" fill="url(#neonLine)" />
</svg>
`;

async function run() {
  const outputPath = path.resolve('public', 'google-play-feature-graphic-1024x500.png');
  const buffer = Buffer.from(svgGraphic);
  await sharp(buffer)
    .resize(1024, 500)
    .png({ quality: 100 })
    .toFile(outputPath);
  
  console.log('Feature graphic created successfully at:', outputPath);

  // Also verify file size
  const stats = fs.statSync(outputPath);
  console.log('File size in bytes:', stats.size);
}

run().catch(console.error);
