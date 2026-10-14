import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Full icon SVG (Square/Rounded with deep navy background, grid, path and nodes)
const fullIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120" />
      <stop offset="50%" stop-color="#111c35" />
      <stop offset="100%" stop-color="#070b14" />
    </linearGradient>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Full Background -->
  <rect width="512" height="512" fill="url(#bgGrad)"/>

  <!-- Subtle grid pattern -->
  <g opacity="0.18" stroke="#94a3b8" stroke-width="2">
    <line x1="128" y1="40" x2="128" y2="472" stroke-dasharray="6,6" />
    <line x1="256" y1="40" x2="256" y2="472" stroke-dasharray="6,6" />
    <line x1="384" y1="40" x2="384" y2="472" stroke-dasharray="6,6" />
    <line x1="40" y1="128" x2="472" y2="128" stroke-dasharray="6,6" />
    <line x1="40" y1="256" x2="472" y2="256" stroke-dasharray="6,6" />
    <line x1="40" y1="384" x2="472" y2="384" stroke-dasharray="6,6" />
  </g>

  <!-- Connecting ZipLine path -->
  <path d="M 140 140 L 372 140 L 140 372 L 372 372" fill="none" stroke="url(#lineGrad)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>

  <!-- Checkpoint Node 1 -->
  <circle cx="140" cy="140" r="40" fill="#f59e0b" stroke="#ffffff" stroke-width="6"/>
  <text x="140" y="153" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="900" fill="#000000" text-anchor="middle">1</text>

  <!-- Checkpoint Node 2 -->
  <circle cx="372" cy="140" r="34" fill="#ec4899" stroke="#ffffff" stroke-width="6"/>
  <text x="372" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">2</text>

  <!-- Checkpoint Node 3 -->
  <circle cx="140" cy="372" r="34" fill="#8b5cf6" stroke="#ffffff" stroke-width="6"/>
  <text x="140" y="384" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>

  <!-- Checkpoint Node 4 (Finish) -->
  <circle cx="372" cy="372" r="40" fill="#10b981" stroke="#ffffff" stroke-width="6"/>
  <text x="372" y="385" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle">4</text>
</svg>
`;

// Circular icon SVG for round icon
const roundIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="250" />
    </clipPath>
  </defs>
  <g clip-path="url(#circleClip)">
    ${fullIconSvg.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">', '').replace('</svg>', '')}
  </g>
  <circle cx="256" cy="256" r="250" fill="none" stroke="#1e293b" stroke-width="4" />
</svg>
`;

// Foreground SVG for Android Adaptive Icons (centered in safe zone 72/108 = ~66%, transparent background)
const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="lineGradFg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <filter id="glowFg" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Subtle centered grid -->
  <g opacity="0.25" stroke="#94a3b8" stroke-width="2.5">
    <line x1="160" y1="100" x2="160" y2="412" stroke-dasharray="6,6" />
    <line x1="256" y1="100" x2="256" y2="412" stroke-dasharray="6,6" />
    <line x1="352" y1="100" x2="352" y2="412" stroke-dasharray="6,6" />
    <line x1="100" y1="160" x2="412" y2="160" stroke-dasharray="6,6" />
    <line x1="100" y1="256" x2="412" y2="256" stroke-dasharray="6,6" />
    <line x1="100" y1="352" x2="412" y2="352" stroke-dasharray="6,6" />
  </g>

  <!-- Connecting ZipLine path -->
  <path d="M 160 160 L 352 160 L 160 352 L 352 352" fill="none" stroke="url(#lineGradFg)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowFg)"/>

  <!-- Checkpoint Node 1 -->
  <circle cx="160" cy="160" r="36" fill="#f59e0b" stroke="#ffffff" stroke-width="6"/>
  <text x="160" y="173" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#000000" text-anchor="middle">1</text>

  <!-- Checkpoint Node 2 -->
  <circle cx="352" cy="160" r="30" fill="#ec4899" stroke="#ffffff" stroke-width="5"/>
  <text x="352" y="171" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">2</text>

  <!-- Checkpoint Node 3 -->
  <circle cx="160" cy="352" r="30" fill="#8b5cf6" stroke="#ffffff" stroke-width="5"/>
  <text x="160" y="363" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>

  <!-- Checkpoint Node 4 (Finish) -->
  <circle cx="352" cy="352" r="36" fill="#10b981" stroke="#ffffff" stroke-width="6"/>
  <text x="352" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">4</text>
</svg>
`;

async function main() {
  const baseRes = path.resolve('android/app/src/main/res');

  const densities = [
    { name: 'mipmap-mdpi', iconSize: 48, fgSize: 108 },
    { name: 'mipmap-hdpi', iconSize: 72, fgSize: 162 },
    { name: 'mipmap-xhdpi', iconSize: 96, fgSize: 216 },
    { name: 'mipmap-xxhdpi', iconSize: 144, fgSize: 324 },
    { name: 'mipmap-xxxhdpi', iconSize: 192, fgSize: 432 },
  ];

  console.log('Generating Android Mipmap icons...');

  for (const d of densities) {
    const dir = path.join(baseRes, d.name);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // 1. ic_launcher.png (legacy standard icon)
    await sharp(Buffer.from(fullIconSvg))
      .resize(d.iconSize, d.iconSize)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // 2. ic_launcher_round.png (round icon)
    await sharp(Buffer.from(roundIconSvg))
      .resize(d.iconSize, d.iconSize)
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // 3. ic_launcher_foreground.png (adaptive foreground)
    await sharp(Buffer.from(foregroundSvg))
      .resize(d.fgSize, d.fgSize)
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`✓ Generated ${d.name} icons`);
  }

  // Update background color in values/ic_launcher_background.xml
  const valuesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0b1120</color>
</resources>
`;
  fs.writeFileSync(path.join(baseRes, 'values/ic_launcher_background.xml'), valuesXml);
  console.log('✓ Updated values/ic_launcher_background.xml');

  // Remove override vector drawables from Capacitor default template if they exist
  const oldBgVector = path.join(baseRes, 'drawable/ic_launcher_background.xml');
  if (fs.existsSync(oldBgVector)) {
    fs.unlinkSync(oldBgVector);
    console.log('✓ Removed old default drawable/ic_launcher_background.xml');
  }

  const oldFgVector = path.join(baseRes, 'drawable-v24/ic_launcher_foreground.xml');
  if (fs.existsSync(oldFgVector)) {
    fs.unlinkSync(oldFgVector);
    console.log('✓ Removed old default drawable-v24/ic_launcher_foreground.xml');
  }

  // Generate Google Play 512x512 app icon in public/ and android/
  await sharp(Buffer.from(fullIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));

  await sharp(Buffer.from(fullIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));

  await sharp(Buffer.from(fullIconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));

  // Also update splash screen in drawable
  const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bgS" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120" />
      <stop offset="50%" stop-color="#111c35" />
      <stop offset="100%" stop-color="#070b14" />
    </linearGradient>
    <linearGradient id="lineGradS" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bgS)"/>
  <g transform="translate(144, 144)">
    ${foregroundSvg.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">', '').replace('</svg>', '')}
  </g>
</svg>
`;
  await sharp(Buffer.from(splashSvg))
    .resize(480, 800)
    .png()
    .toFile(path.join(baseRes, 'drawable/splash.png'));

  console.log('All icons and splash generated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
