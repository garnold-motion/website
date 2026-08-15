/**
 * Copies the Rive WASM runtime out of node_modules and into public/.
 *
 * By default the Rive canvas runtime fetches its WASM from a jsdelivr CDN at
 * page load. That's a third-party request on the critical path for anyone
 * opening an interactive piece, and it breaks entirely behind a firewall or if
 * the CDN has a bad day.
 *
 * Copying it here (rather than committing the 2MB binary) means the WASM
 * version can never drift out of sync with the installed package — it is
 * re-copied on every dev start and every build.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

try {
  const pkgPath = require.resolve('@rive-app/canvas/package.json');
  const src = join(dirname(pkgPath), 'rive.wasm');
  const dest = join(process.cwd(), 'public', 'rive.wasm');

  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);

  console.log('✓ rive.wasm copied to public/');
} catch (err) {
  console.error('✗ Could not copy rive.wasm:', err.message);
  console.error('  Interactive pieces will fall back to the jsdelivr CDN.');
  // Not fatal — the CDN fallback still works when online.
}
