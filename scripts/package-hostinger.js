const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distZip = path.join(root, 'hostinger-deploy.zip');
const bundleDir = path.join(root, '.hostinger-bundle');

console.log('[Hostinger Package] Preparing bundle directory...');

if (fs.existsSync(bundleDir)) {
  fs.rmSync(bundleDir, { recursive: true, force: true });
}
if (fs.existsSync(distZip)) {
  fs.rmSync(distZip, { force: true });
}

fs.mkdirSync(bundleDir, { recursive: true });

// 1. Copy standalone server and runtime
const standaloneDir = path.join(root, '.next', 'standalone');
if (fs.existsSync(standaloneDir)) {
  fs.cpSync(standaloneDir, bundleDir, { recursive: true });
  console.log('[Hostinger Package] ✓ Copied standalone server & runtime');
} else {
  console.error('[Hostinger Package] Error: .next/standalone not found. Run npm run build first.');
  process.exit(1);
}

// 2. Copy prisma directory
const prismaDir = path.join(root, 'prisma');
if (fs.existsSync(prismaDir)) {
  fs.cpSync(prismaDir, path.join(bundleDir, 'prisma'), { recursive: true });
  console.log('[Hostinger Package] ✓ Included prisma schema & seed');
}

// 3. Copy package.json, .env.example, README.md, and Guides
fs.copyFileSync(path.join(root, 'package.json'), path.join(bundleDir, 'package.json'));
if (fs.existsSync(path.join(root, '.env.example'))) {
  fs.copyFileSync(path.join(root, '.env.example'), path.join(bundleDir, '.env.example'));
}
if (fs.existsSync(path.join(root, 'README.md'))) {
  fs.copyFileSync(path.join(root, 'README.md'), path.join(bundleDir, 'README.md'));
}
if (fs.existsSync(path.join(root, 'HOSTINGER_DEPLOYMENT_INSTRUCTIONS.md'))) {
  fs.copyFileSync(path.join(root, 'HOSTINGER_DEPLOYMENT_INSTRUCTIONS.md'), path.join(bundleDir, 'HOSTINGER_DEPLOYMENT_INSTRUCTIONS.md'));
}
if (fs.existsSync(path.join(root, '50_BLOGS_PER_DAY_AUTOMATION_GUIDE.md'))) {
  fs.copyFileSync(path.join(root, '50_BLOGS_PER_DAY_AUTOMATION_GUIDE.md'), path.join(bundleDir, '50_BLOGS_PER_DAY_AUTOMATION_GUIDE.md'));
}

console.log('[Hostinger Package] Creating hostinger-deploy.zip archive...');
try {
  try {
    execSync(`tar -a -c -f "${distZip}" -C "${bundleDir}" .`, {
      stdio: 'inherit',
      cwd: root,
    });
    console.log(`[Hostinger Package] ✓ Successfully created with tar: ${distZip}`);
  } catch (tarErr) {
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${bundleDir}\\*' -DestinationPath '${distZip}' -Force"`, {
      stdio: 'inherit',
      cwd: root,
    });
    console.log(`[Hostinger Package] ✓ Successfully created with Compress-Archive: ${distZip}`);
  }
} catch (err) {
  console.warn('[Hostinger Package] Zip compression notice:', err.message);
}
