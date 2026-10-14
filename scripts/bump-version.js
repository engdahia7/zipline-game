import fs from 'fs';
import path from 'path';

const versionPropsPath = path.resolve(process.cwd(), 'android/app/version.properties');
const pkgPath = path.resolve(process.cwd(), 'package.json');

let currentCode = 2;
let currentName = '1.0.1';

if (fs.existsSync(versionPropsPath)) {
  const content = fs.readFileSync(versionPropsPath, 'utf8');
  const codeMatch = content.match(/VERSION_CODE=(\d+)/);
  const nameMatch = content.match(/VERSION_NAME=([^\r\n]+)/);
  if (codeMatch) currentCode = parseInt(codeMatch[1], 10);
  if (nameMatch) currentName = nameMatch[1].trim();
}

const nextCode = currentCode + 1;
const nextName = `1.0.${nextCode}`;

const newPropsContent = `VERSION_CODE=${nextCode}\nVERSION_NAME=${nextName}\n`;
fs.writeFileSync(versionPropsPath, newPropsContent, 'utf8');

if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = nextName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

console.log(`✓ ZipLine Version bumped to Code: ${nextCode}, Name: ${nextName}`);
