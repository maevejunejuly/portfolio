// usage: node scripts/asciify.mjs <source-image> <out.ts> <exportName> [cols]
// Renders an image to a coloured ASCII grid and emits it as a TS module.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { inflateSync } from "node:zlib";
import path from "node:path";
import os from "node:os";

const [, , SRC, OUT, NAME, COLS_ARG] = process.argv;
if (!SRC || !OUT || !NAME) {
  console.error("usage: node scripts/asciify.mjs <source> <out.ts> <exportName> [cols]");
  process.exit(1);
}

const COLS = Number(COLS_ARG ?? 120);
const CHAR_ASPECT = 0.6; // monospace advance / line-height

const RAMP = " .'`^\",:;!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@";

function readPngRGBA(file) {
  const buf = readFileSync(file);
  let pos = 8;
  let w = 0;
  let h = 0;
  let depth = 0;
  let colorType = 0;
  let palette = null;
  let trns = null;
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
    } else if (type === "PLTE") palette = Buffer.from(data);
    else if (type === "tRNS") trns = Buffer.from(data);
    else if (type === "IDAT") idat.push(Buffer.from(data));
    else if (type === "IEND") break;
    pos += 12 + len;
  }

  if (depth !== 8) throw new Error(`unsupported bit depth ${depth}`);
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`unsupported colour type ${colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * channels;
  const out = Buffer.alloc(h * stride);

  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= channels ? prev[i - channels] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[i] = v & 0xff;
    }
  }

  const rgb = new Uint8Array(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    if (colorType === 3) {
      const p = out[i] * 3;
      rgb[i * 3] = palette[p];
      rgb[i * 3 + 1] = palette[p + 1];
      rgb[i * 3 + 2] = palette[p + 2];
    } else if (colorType === 0 || colorType === 4) {
      const v = out[i * channels];
      rgb[i * 3] = rgb[i * 3 + 1] = rgb[i * 3 + 2] = v;
    } else {
      rgb[i * 3] = out[i * channels];
      rgb[i * 3 + 1] = out[i * channels + 1];
      rgb[i * 3 + 2] = out[i * channels + 2];
    }
  }
  void trns;
  return { w, h, rgb };
}

const probe = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", SRC], {
  encoding: "utf8",
});
const srcW = Number(probe.match(/pixelWidth:\s*(\d+)/)[1]);
const srcH = Number(probe.match(/pixelHeight:\s*(\d+)/)[1]);
const ROWS = Math.max(1, Math.round(COLS * CHAR_ASPECT * (srcH / srcW)));

const tmp = path.join(os.tmpdir(), `asciify-${process.pid}.png`);
execFileSync("sips", [
  "-s", "format", "png",
  "--resampleHeightWidthMax", String(Math.max(COLS, ROWS) * 4),
  SRC, "--out", tmp,
]);
execFileSync("sips", ["-z", String(ROWS), String(COLS), tmp, "--out", tmp]);

const img = readPngRGBA(tmp);
rmSync(tmp, { force: true });

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
const paletteMap = new Map();
const palette = [];

function quantise(r, g, b) {
  const boost = (v) => Math.min(255, Math.round(46 + v * 1.75));
  const q = (v) => Math.round(boost(v) / 51) * 51; // 6 levels per channel
  const key = `${q(r)},${q(g)},${q(b)}`;
  if (!paletteMap.has(key)) {
    if (palette.length >= 36) {
      let best = 0;
      let bestD = Infinity;
      palette.forEach((p, i) => {
        const d = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    }
    paletteMap.set(key, palette.length);
    palette.push(key.split(",").map(Number));
  }
  return paletteMap.get(key);
}

const rows = [];
for (let y = 0; y < img.h; y++) {
  const runs = [];
  let cur = null;
  for (let x = 0; x < img.w; x++) {
    const i = (y * img.w + x) * 3;
    const r = img.rgb[i];
    const g = img.rgb[i + 1];
    const b = img.rgb[i + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const ch = RAMP[Math.min(RAMP.length - 1, Math.round(lum ** 0.55 * (RAMP.length - 1)))];
    const ci = quantise(r, g, b);
    if (cur && cur[0] === ci) cur[1] += ch;
    else {
      cur = [ci, ch];
      runs.push(cur);
    }
  }
  rows.push(runs);
}

const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
const runCount = rows.reduce((n, r) => n + r.length, 0);

const body = rows
  .map((runs) => `  [${runs.map(([c, s]) => `["${DIGITS[c]}",${JSON.stringify(s)}]`).join(",")}],`)
  .join("\n");

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  `// GENERATED by scripts/asciify.mjs from ${path.basename(SRC)}. Do not edit by hand.

export type AsciiRun = [string, string];

export const ${NAME} = {
  cols: ${COLS},
  rows: ${ROWS},
  palette: {
${palette.map((c, i) => `    ${DIGITS[i]}: "${hex(c)}",`).join("\n")}
  } as Record<string, string>,
  lines: [
${body}
  ] as AsciiRun[][],
};
`,
);

console.log(
  `wrote ${OUT} — ${COLS}x${ROWS} cells, ${palette.length} colours, ${runCount} runs (${(runCount / rows.length).toFixed(1)}/row)`,
);
