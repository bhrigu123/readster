/**
 * Generates Readster extension icons from the same Lucide "Layers" SVG
 * used in the popup and dashboard header.
 *
 * The Layers icon uses stroked paths, so stroke-width must be calibrated
 * per output size — a stroke that reads well at 128px becomes invisible
 * at 16px after rasterisation. We compute the correct stroke-width for
 * each target size so the visual weight is consistently ~2px.
 */

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Layout constants (all in SVG viewBox units, viewBox = "0 0 100 100")
// ---------------------------------------------------------------------------
const LUCIDE_SCALE = 2.583; // scales Lucide's 24×24 grid to ~62 viewBox units
const LUCIDE_OFFSET = 19;   // translate(19,19) → icon centered in 100×100 canvas

/**
 * Build the icon SVG with stroke-width tuned for the given output pixel size.
 *
 * Visual stroke (px) = strokeWidth × LUCIDE_SCALE × (outputSize / 100)
 * Solving for 2px visual: strokeWidth = 200 / (LUCIDE_SCALE × outputSize)
 */
function makeSvg(outputSize) {
  const strokeWidth = (200 / (LUCIDE_SCALE * outputSize)).toFixed(3);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Rounded indigo-violet background -->
  <rect width="100" height="100" rx="22" fill="#7c6dfa"/>

  <!--
    Lucide "Layers" paths — identical to the <Layers> component used in
    the popup/dashboard, just scaled and centred in the 100×100 canvas.
    Source: https://lucide.dev/icons/layers
  -->
  <g
    transform="translate(${LUCIDE_OFFSET}, ${LUCIDE_OFFSET}) scale(${LUCIDE_SCALE})"
    stroke="white"
    stroke-width="${strokeWidth}"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Render each size
// density = outputSize × 72 / 100  →  rsvg renders the 100-unit viewBox
// at exactly outputSize × outputSize pixels with correct anti-aliasing.
// ---------------------------------------------------------------------------
const iconsDir = join(__dirname, '..', 'public', 'icon');
mkdirSync(iconsDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const density = Math.ceil(size * 72 / 100);

  await sharp(Buffer.from(makeSvg(size)), { density })
    .png()
    .toFile(join(iconsDir, `${size}.png`));

  console.log(`✓ icon/${size}.png  (stroke-width: ${(200 / (LUCIDE_SCALE * size)).toFixed(2)} lucide-units → 2px visual)`);
}

console.log('\nDone. Run "pnpm build" to pick up the new icons.');
