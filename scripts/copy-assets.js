const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcStatic = path.join(root, '.next', 'static');
const destStatic = path.join(root, '.next', 'standalone', '.next', 'static');

const srcPublic = path.join(root, 'public');
const destPublic = path.join(root, '.next', 'standalone', 'public');

try {
  if (fs.existsSync(srcStatic)) {
    fs.mkdirSync(path.dirname(destStatic), { recursive: true });
    fs.cpSync(srcStatic, destStatic, { recursive: true, force: true });
    console.log('[Build] ✓ Mirrored .next/static to .next/standalone/.next/static');
  }

  if (fs.existsSync(srcPublic)) {
    fs.mkdirSync(destPublic, { recursive: true });
    fs.cpSync(srcPublic, destPublic, { recursive: true, force: true });
    console.log('[Build] ✓ Mirrored public/ to .next/standalone/public');
  }

  const srcData = path.join(root, 'data');
  const destData = path.join(root, '.next', 'standalone', 'data');
  if (fs.existsSync(srcData)) {
    fs.mkdirSync(destData, { recursive: true });
    fs.cpSync(srcData, destData, { recursive: true, force: true });
    console.log('[Build] ✓ Mirrored data/ to .next/standalone/data');
  }
} catch (err) {
  console.warn('[Build] Asset copy notice:', err.message);
}
