// Babel tower data, worked out on the CPU and handed to the shader as a texture.
// Follows the essay: 8x8 rooms per floor, bands of six floors that share an
// outline (main block + optional wing + optional bar, maybe a shaft), interior
// edges that are full walls, low walls or openings (a quarter change per floor),
// rooms that rise in rings from the centre, and letter windows on outer walls.

export const GRID = 8;
export const BAND = 6;

// Integer hash -> [0, 1)
export function hash(...xs) {
  let h = 0x9e3779b9 | 0;
  for (const x of xs) {
    h = Math.imul(h ^ (x | 0), 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
  }
  return (h >>> 0) / 4294967296;
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Wall kinds
export const NONE = 0, FULL = 1, LOW = 2, OPEN = 3;
const LOW_FRAC = 0.42; // low wall height as a fraction of a full wall

function pickKind(r) {
  if (r < 0.5) return FULL;
  if (r < 0.7) return LOW;
  return OPEN;
}

// Glyph ids: 1..26 = A..Z, 27 = the "|||" slot window used for spaces
function glyphOf(ch) {
  const c = ch.charCodeAt(0);
  if (c >= 65 && c <= 90) return c - 64;
  return 27;
}

export function buildScene(cfg) {
  const { bands, fTop, topWords, nextPlates = [], seed = 7, nVis = 14, text } = cfg;
  const f0 = Math.max(0, fTop - nVis);
  const f1 = fTop + 1;
  const NF = f1 - f0 + 1;

  const bandOf = (f) => bands[Math.min(bands.length - 1, Math.floor(f / BAND))];

  // Outline cell sets per band
  const outlineCache = new Map();
  function outline(b) {
    if (outlineCache.has(b)) return outlineCache.get(b);
    const occ = new Uint8Array(GRID * GRID);
    for (const [x0, y0, x1, y1] of b.rects) {
      for (let x = x0; x <= x1; x++)
        for (let y = y0; y <= y1; y++)
          if (x >= 0 && x < GRID && y >= 0 && y < GRID) occ[y * GRID + x] = 1;
    }
    for (const [x, y] of b.shafts || []) occ[y * GRID + x] = 0;
    outlineCache.set(b, occ);
    return occ;
  }
  const inOutline = (f, x, y) => {
    if (x < 0 || y < 0 || x >= GRID || y >= GRID || f < 0) return false;
    return outline(bandOf(f))[y * GRID + x] === 1;
  };

  // Build progress per room
  const topOrder = new Map();
  let topWordsEff = topWords;
  {
    const rooms = [];
    for (let y = 0; y < GRID; y++)
      for (let x = 0; x < GRID; x++)
        if (inOutline(fTop, x, y)) {
          const ring = Math.floor(Math.max(Math.abs(x + 0.5 - 4), Math.abs(y + 0.5 - 4)));
          rooms.push({ x, y, key: ring + hash(seed, x, y, 5) * 0.99 });
        }
    rooms.sort((a, b) => a.key - b.key);
    if (cfg.topFrac != null) topWordsEff = cfg.topFrac * rooms.length;
    rooms.forEach((r, k) => topOrder.set(r.y * GRID + r.x, k));
  }
  const plateMap = new Map(nextPlates.map(([x, y, p]) => [y * GRID + x, p]));
  function progress(f, x, y) {
    if (!inOutline(f, x, y)) return 0;
    if (f < fTop) return 1;
    if (f === fTop) {
      const k = topOrder.get(y * GRID + x);
      return Math.min(1, Math.max(0, (topWordsEff - k) / (cfg.riseSpan || 1.5)));
    }
    if (f === fTop + 1) return plateMap.get(y * GRID + x) || 0;
    return 0;
  }

  // Interior edge kinds: per band, with a quarter re-rolled on each floor
  function interiorKind(f, axis, ex, ey) {
    const band = Math.floor(f / BAND);
    const id = axis * 4096 + ey * 64 + ex;
    let k = pickKind(hash(seed, band, id, 11));
    if (hash(seed, f, id, 23) < 0.25) k = pickKind(hash(seed, f, id, 31));
    return k;
  }

  // Letters: walk the outer walls of each floor counter-clockwise, spelling the text
  const chars = text.toUpperCase().replace(/[^A-Z]+/g, " ");
  let cursor = 0;
  const glyphs = new Map(); // key f|axis|ex|ey -> glyph

  for (let f = f0; f <= f1; f++) {
    const panels = [];
    for (let ey = 0; ey <= GRID; ey++)
      for (let ex = 0; ex <= GRID; ex++) {
        // west edge of cell (ex, ey): x = ex, between (ex-1,ey) and (ex,ey)
        if (ey < GRID) {
          const a = inOutline(f, ex - 1, ey), b = inOutline(f, ex, ey);
          if (a !== b) panels.push({ axis: 0, ex, ey, mx: ex, my: ey + 0.5 });
        }
        // south edge of cell (ex, ey): y = ey, between (ex,ey-1) and (ex,ey)
        if (ex < GRID) {
          const a = inOutline(f, ex, ey - 1), b = inOutline(f, ex, ey);
          if (a !== b) panels.push({ axis: 1, ex, ey, mx: ex + 0.5, my: ey });
        }
      }
    panels.sort((p, q) => Math.atan2(p.my - 4, p.mx - 4) - Math.atan2(q.my - 4, q.mx - 4));
    for (const p of panels) {
      glyphs.set(`${f}|${p.axis}|${p.ex}|${p.ey}`, glyphOf(chars[cursor % chars.length]));
      cursor++;
    }
  }

  // Pack: 10 x 10 texels per floor (cells -1..8), RGBA32UI
  const W = 10, H = 10 * NF;
  const data = new Uint32Array(W * H * 4);
  const byte = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));

  for (let f = f0; f <= f1; f++) {
    const ff = f - f0;
    for (let j = -1; j <= GRID; j++)
      for (let i = -1; i <= GRID; i++) {
        const o = ((ff * 10 + (j + 1)) * W + (i + 1)) * 4;
        const p = progress(f, i, j);
        // slab spreads from the middle of the room at full thickness
        const slab = p > 0 ? Math.max(0.12, smooth(0.0, 0.5, p)) : 0;
        // pillar at vertex (i, j)
        let pil = 0;
        for (const [dx, dy] of [[-1, -1], [0, -1], [-1, 0], [0, 0]]) {
          pil = Math.max(pil, smooth(0.45, 0.75, progress(f, i + dx, j + dy)));
        }
        const wall = (axis) => {
          // axis 0: west edge (x = i) between (i-1, j) and (i, j)
          // axis 1: south edge (y = j) between (i, j-1) and (i, j)
          const ax = axis === 0 ? i - 1 : i, ay = axis === 0 ? j : j - 1;
          const inA = inOutline(f, ax, ay), inB = inOutline(f, i, j);
          if (!inA && !inB) return 0;
          const pA = progress(f, ax, ay), pB = progress(f, i, j);
          const rise = smooth(0.55, 1.0, Math.max(pA, pB));
          let kind, ext = 0, outsideNeg = 0, glyph = 0;
          if (inA !== inB) {
            kind = FULL; ext = 1; outsideNeg = inA ? 0 : 1;
            glyph = glyphs.get(`${f}|${axis}|${i}|${j}`) || 0;
          } else {
            kind = interiorKind(f, axis, i, j);
          }
          const hFrac = kind === FULL ? 1 : kind === LOW ? LOW_FRAC : 0;
          const h = byte(hFrac * rise);
          return (h | (kind << 8) | (ext << 10) | (outsideNeg << 11) | (glyph << 16)) >>> 0;
        };
        data[o + 0] = (byte(slab) | (byte(pil) << 8)) >>> 0;
        data[o + 1] = wall(0);
        data[o + 2] = wall(1);
        data[o + 3] = (byte(p) | ((inOutline(f, i, j) ? 1 : 0) << 8)) >>> 0;
      }
  }

  // Outline lines of the floor being built, for construction lines and the dashed plan
  const topRects = bandOf(fTop).rects.map(([x0, y0, x1, y1]) => [x0, y0, x1 + 1, y1 + 1]);

  return { data, W, H, f0, f1, NF, fTop, topRects };
}
