/**
 * Generates Readster extension icons using sharp (libvips + rsvg).
 *
 * Design: two stacked bookmark shapes on an indigo-violet rounded square.
 * Reads cleanly at all sizes (16 → 128px).
 */

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// SVG icon — 100×100 viewBox
// Two overlapping bookmark silhouettes on a rounded indigo-violet square.
// ---------------------------------------------------------------------------
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Background -->
  <rect width="100" height="100" rx="22" fill="#7c6dfa"/>

  <!-- Back bookmark (offset up-right, ghosted) -->
  <polygon
    points="36,12 80,12 80,76 58,62 36,76"
    fill="white"
    opacity="0.35"
  />

  <!-- Front bookmark (offset down-left, solid white) -->
  <polygon
    points="20,24 64,24 64,88 42,74 20,88"
    fill="white"
  />
</svg>
`.trim();

// ---------------------------------------------------------------------------
// Render at each required size
// ---------------------------------------------------------------------------
const iconsDir = join(__dirname, '..', 'public', 'icon');
mkdirSync(iconsDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  await sharp(Buffer.from(svgIcon))
    .resize(size, size)
    .png()
    .toFile(join(iconsDir, `${size}.png`));
  console.log(`✓ icon/${size}.png`);
}

console.log('\nDone. Rebuild the extension to pick up the new icons.');
