#!/usr/bin/env bash
mkdir -p public

# 1. Generate full icon SVG (512x512)
cat << 'EOF' > public/icon.svg
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

  <!-- Background rounded squircle -->
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)" stroke="#1e293b" stroke-width="4"/>

  <!-- Subtle grid pattern -->
  <g opacity="0.15" stroke="#94a3b8" stroke-width="2">
    <line x1="128" y1="80" x2="128" y2="432" stroke-dasharray="6,6" />
    <line x1="256" y1="80" x2="256" y2="432" stroke-dasharray="6,6" />
    <line x1="384" y1="80" x2="384" y2="432" stroke-dasharray="6,6" />
    <line x1="80" y1="128" x2="432" y2="128" stroke-dasharray="6,6" />
    <line x1="80" y1="256" x2="432" y2="256" stroke-dasharray="6,6" />
    <line x1="80" y1="384" x2="432" y2="384" stroke-dasharray="6,6" />
  </g>

  <!-- Connecting ZipLine path -->
  <path d="M 140 140 L 372 140 L 140 372 L 372 372" fill="none" stroke="url(#lineGrad)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>

  <!-- Checkpoint Node 1 -->
  <circle cx="140" cy="140" r="38" fill="#f59e0b" stroke="#ffffff" stroke-width="6"/>
  <text x="140" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#000000" text-anchor="middle">1</text>

  <!-- Checkpoint Node 2 -->
  <circle cx="372" cy="140" r="32" fill="#ec4899" stroke="#ffffff" stroke-width="5"/>
  <text x="372" y="151" font-family="system-ui, -apple-system, sans-serif" font-size="30" font-weight="900" fill="#ffffff" text-anchor="middle">2</text>

  <!-- Checkpoint Node 3 -->
  <circle cx="140" cy="372" r="32" fill="#8b5cf6" stroke="#ffffff" stroke-width="5"/>
  <text x="140" y="383" font-family="system-ui, -apple-system, sans-serif" font-size="30" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>

  <!-- Checkpoint Node 4 (Finish) -->
  <circle cx="372" cy="372" r="38" fill="#10b981" stroke="#ffffff" stroke-width="6"/>
  <text x="372" y="384" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">4</text>
</svg>
EOF

# 2. Generate maskable icon SVG with 20% safe-zone margin
cat << 'EOF' > public/icon-maskable.svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120" />
      <stop offset="50%" stop-color="#111c35" />
      <stop offset="100%" stop-color="#070b14" />
    </linearGradient>
    <linearGradient id="lineGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
  </defs>

  <!-- Full bleed background for maskable safe zone -->
  <rect width="512" height="512" fill="url(#bgGradM)"/>

  <!-- Scaled content inside safe zone (padding ~15%) -->
  <g transform="translate(51, 51) scale(0.8)">
    <path d="M 140 140 L 372 140 L 140 372 L 372 372" fill="none" stroke="url(#lineGradM)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="140" cy="140" r="38" fill="#f59e0b" stroke="#ffffff" stroke-width="6"/>
    <text x="140" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#000000" text-anchor="middle">1</text>
    <circle cx="372" cy="140" r="32" fill="#ec4899" stroke="#ffffff" stroke-width="5"/>
    <text x="372" y="151" font-family="system-ui, -apple-system, sans-serif" font-size="30" font-weight="900" fill="#ffffff" text-anchor="middle">2</text>
    <circle cx="140" cy="372" r="32" fill="#8b5cf6" stroke="#ffffff" stroke-width="5"/>
    <text x="140" y="383" font-family="system-ui, -apple-system, sans-serif" font-size="30" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>
    <circle cx="372" cy="372" r="38" fill="#10b981" stroke="#ffffff" stroke-width="6"/>
    <text x="372" y="384" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">4</text>
  </g>
</svg>
EOF

# Convert SVGs to PNG files at required sizes
convert -background none -resize 192x192 public/icon.svg public/pwa-192x192.png
convert -background none -resize 512x512 public/icon.svg public/pwa-512x512.png
convert -background none -resize 512x512 public/icon-maskable.svg public/pwa-maskable-512x512.png
convert -background none -resize 180x180 public/icon.svg public/apple-touch-icon.png
convert -background none -resize 48x48 public/icon.svg public/favicon.ico
echo "Icons generated successfully in public/"
