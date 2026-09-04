// usage: node scripts/gen-halftone.mjs <source.svg> <out.ts> <exportName>
// Samples a potrace-traced halftone SVG back onto its own dot lattice and emits
// the per-cell coverage as a TS module.
//
// The source is 8786 traced blobs. Rasterising them all in one headless pass
// silently drops geometry (the amount depends on the output size), so the image
// is rendered in horizontal strips — few enough paths in view per strip that
// Chrome paints them all — and the strips are stitched back together.

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { inflateSync } from "node:zlib";
import path from "node:path";
import os from "node:os";

const [, , SRC, OUT, NAME] = process.argv;
if (!SRC || !OUT || !NAME) {
  console.error("usage: node scripts/gen-halftone.mjs <source.svg> <out.ts> <exportName>");
  process.exit(1);
}

const COLS = 226;
const SAMPLES = 5;
const STRIPS = 10;
const RAMP = " .:-=+*#%@";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function readPngGray(file) {
  const buf = readFileSync(file);
  let pos = 8, w = 0, h = 0, depth = 0, colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      depth = data[8];
      colorType = data[9];
      if (data[12] !== 0) throw new Error("interlaced PNG not supported");
    } else if (type === "IDAT") idat.push(Buffer.from(data));
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  if (depth !== 8) throw new Error(`unsupported bit depth ${depth}`);
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  if (!ch) throw new Error(`unsupported colour type ${colorType}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * ch;
  const out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? out[y * stride + x - ch] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + x] = v & 255;
    }
  }
  return { w, h, ch, data: out };
}

const svg = readFileSync(SRC, "utf8");

const vb = svg.match(/viewBox="([\d.\s-]+)"/);
if (!vb) throw new Error("no viewBox on source svg");
const vbW = Number(vb[1].trim().split(/\s+/)[2]);

const tf = svg.match(/transform="translate\(([\d.-]+),([\d.-]+)\) scale\(([\d.-]+),([\d.-]+)\)"/);
if (!tf) throw new Error("unexpected potrace transform");
const [, , ty, , syf] = tf.map(Number);

// Content runs past the declared viewBox height; recover its true extent from
// the raw path coordinates so the darkest rows are not clipped.
const ys = [...svg.matchAll(/ d="M-?[\d.]+ (-?[\d.]+)/g)].map((m) => Number(m[1]));
const pitch = vbW / COLS;
const contentH = Math.round((Math.min(...ys) * syf + ty) / pitch) * pitch;
const ROWS = Math.round(contentH / pitch);

const dir = mkdtempSync(path.join(os.tmpdir(), "halftone-"));
const cover = new Float64Array(COLS * ROWS);

for (let s = 0; s < STRIPS; s++) {
  const r0 = Math.floor((s * ROWS) / STRIPS);
  const r1 = Math.floor(((s + 1) * ROWS) / STRIPS);
  const rows = r1 - r0;
  const W = COLS * SAMPLES;
  const H = rows * SAMPLES;

  const page = path.join(dir, `s${s}.svg`);
  const html = path.join(dir, `s${s}.html`);
  const shot = path.join(dir, `s${s}.png`);

  writeFileSync(
    page,
    svg
      .replace(/viewBox="[^"]+"/, `viewBox="0 ${r0 * pitch} ${vbW} ${rows * pitch}"`)
      .replace(/width="[^"]+"/, `width="${W}"`)
      .replace(/height="[^"]+"/, `height="${H}"`),
  );
  writeFileSync(
    html,
    `<body style="margin:0;background:#fff"><img src="s${s}.svg" width="${W}" height="${H}" style="display:block"></body>`,
  );

  execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${W},${H}`,
    "--virtual-time-budget=20000",
    "--run-all-compositor-stages-before-draw",
    `--screenshot=${shot}`,
    `file://${html}`,
  ], { stdio: "ignore" });

  const { w, h, ch, data } = readPngGray(shot);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      let ink = 0, n = 0;
      for (let sy = 0; sy < SAMPLES; sy++) {
        const y = r * SAMPLES + sy;
        if (y >= h) continue;
        for (let sx = 0; sx < SAMPLES; sx++) {
          const x = c * SAMPLES + sx;
          if (x >= w) continue;
          ink += 1 - data[(y * w + x) * ch] / 255;
          n += 1;
        }
      }
      cover[(r0 + r) * COLS + c] = n ? ink / n : 0;
    }
  }
}

rmSync(dir, { recursive: true, force: true });

const rows = [];
for (let r = 0; r < ROWS; r++) {
  let line = "";
  for (let c = 0; c < COLS; c++) {
    line += RAMP[Math.round(Math.min(1, cover[r * COLS + c]) * (RAMP.length - 1))];
  }
  rows.push(line);
}
while (rows.length && rows[rows.length - 1].trim() === "") rows.pop();

writeFileSync(
  OUT,
  `// GENERATED by scripts/gen-halftone.mjs from ${path.basename(SRC)} — do not edit.\n` +
    `export const ${NAME}_COLS = ${COLS};\n` +
    `export const ${NAME}_ROWS = ${rows.length};\n` +
    `export const ${NAME}_RAMP = ${JSON.stringify(RAMP)};\n` +
    `export const ${NAME} = ${JSON.stringify(rows.join("\n"))};\n`,
);

console.log(`${OUT}: ${COLS}x${rows.length} cells, pitch ${pitch}, content ${vbW}x${contentH}`);
