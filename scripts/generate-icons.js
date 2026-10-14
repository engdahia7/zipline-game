import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const iconSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'));
const maskableSvg = fs.readFileSync(path.join(publicDir, 'icon-maskable.svg'));

async function generate() {
  // 1. 192x192 standard icon
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 2. 512x512 standard icon
  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 3. 512x512 maskable icon
  await sharp(maskableSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 4. Apple Touch Icon (180x180)
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 5. Favicon PNG (64x64) and ICO
  await sharp(iconSvg)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  await sharp(iconSvg)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all PWA & Android icons!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
