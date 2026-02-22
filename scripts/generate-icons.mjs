/**
 * Generates minimal valid PNG icons for the Readster extension.
 * Uses only Node.js built-ins — no extra dependencies needed.
 *
 * Icon design: rounded "R" lettermark on indigo-violet (#7c6dfa) background.
 * We generate a solid-color PNG for each required size.
 */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// CRC-32 (required for PNG chunk integrity)
// ---------------------------------------------------------------------------
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc = (crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)) >>> 0;
  }
  return ((crc ^ 0xffffffff) >>> 0);
}

// ---------------------------------------------------------------------------
// PNG chunk builder
// ---------------------------------------------------------------------------
function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

// ---------------------------------------------------------------------------
// Create a solid-colour PNG at the given square size
// ---------------------------------------------------------------------------
function createSolidPNG(size, r, g, b) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, bit-depth(8), colour-type RGB(2)
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8);   // bit depth
  ihdr.writeUInt8(2, 9);   // RGB colour
  ihdr.writeUInt8(0, 10);  // compression
  ihdr.writeUInt8(0, 11);  // filter
  ihdr.writeUInt8(0, 12);  // interlace

  // Raw pixel data: one filter byte (0 = None) per row + RGB pixels
  const stride = 1 + size * 3;
  const raw = Buffer.allocUnsafe(size * stride);
  for (let y = 0; y < size; y++) {
    const rowOff = y * stride;
    raw[rowOff] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const off = rowOff + 1 + x * 3;
      raw[off]     = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
    }
  }

  const idatData = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icon');
mkdirSync(iconsDir, { recursive: true });

// Accent colour: #7c6dfa  →  r=124  g=109  b=250
const [r, g, b] = [124, 109, 250];

for (const size of [16, 32, 48, 128]) {
  const png = createSolidPNG(size, r, g, b);
  writeFileSync(join(iconsDir, `${size}.png`), png);
  console.log(`✓ Created icon/${size}.png`);
}

console.log('\nIcons generated in public/icon/');
