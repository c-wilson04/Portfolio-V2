// Loop settings: one full turn of the tower and one full trip through the
// ink palettes per loop, so the last frame runs straight into the first.
import { camera, sunDir } from "./tower.js";

const FH = 1.12, SLAB = 0.07, WT = 0.07;
const DEG = Math.PI / 180;

export const CONFIG = {
  ss: 2,
  scene: {
    seed: 11,
    fTop: 21,
    topWords: 15.5,
    topFrac: 0.55,
    riseSpan: 3.5,
    nVis: 13,
    nextPlates: [[3, 3, 0.42], [4, 4, 0.3]],
    text: "A TOWER MADE OF WORDS IT RISES AS YOU WRITE DELETE A SENTENCE AND IT COMES DOWN THE LETTERS NEVER LEAVE THE PAGE BABEL ",
    bands: [
      { rects: [[2, 2, 5, 5]] },
      { rects: [[2, 1, 6, 5], [0, 4, 2, 6]] },
      { rects: [[2, 2, 5, 6], [5, 0, 7, 3]] },
      { rects: [[1, 1, 5, 5], [0, 6, 7, 6], [5, 3, 7, 5]] },
    ],
  },
  elev: 34 * DEG,
  az0: 222 * DEG,
  pix: 0.0152,
  zCenter: 20.6,
  sunSwing: 52 * DEG,
  sunElev: 47 * DEG,
};

// Ink palettes the tower drifts through: graphite (the essay's original grey),
// red ink (the essay's hero), Q.Wrld amber, and blueprint blue.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
export const PALETTES = [
  { name: "graphite", paper: "#dfdfde", paperEdge: "#d0d0cf", mid: "#a9a9a8", dark: "#454544", ink: "#141414" },
  { name: "red ink", paper: "#e3dcda", paperEdge: "#d6ccc9", mid: "#ee4b3d", dark: "#9d140d", ink: "#1b0d0b" },
  { name: "amber", paper: "#e5ded4", paperEdge: "#d8cdbf", mid: "#ff9f3d", dark: "#a4500a", ink: "#1e1409" },
  { name: "blueprint", paper: "#d9dde4", paperEdge: "#c9cfda", mid: "#5d85ef", dark: "#173190", ink: "#0a1230" },
  { name: "black ink", paper: "#dfdfde", paperEdge: "#d0d0cf", mid: "#8f8f8e", dark: "#1e1e1d", ink: "#0b0b0b" },
];
const byName = (n) => PALETTES.find((p) => p.name === n);
// The default loop drifts through the first four; CONFIG.palettes can name others.
const DEFAULT_CYCLE = ["graphite", "red ink", "amber", "blueprint"];

// sRGB <-> OKLab so the blends stay clean instead of going muddy
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
function oklab([r, g, b]) {
  r = toLin(r); g = toLin(g); b = toLin(b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function fromOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return rgb.map((c) => Math.min(1, Math.max(0, toSrgb(c))));
}
function mixPal(a, b, t) {
  const out = {};
  for (const key of ["paper", "paperEdge", "mid", "dark", "ink"]) {
    const A = oklab(hex(a[key])), B = oklab(hex(b[key]));
    out[key] = fromOklab(A.map((v, i) => v + (B[i] - v) * t));
  }
  return out;
}
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function paletteAt(phase, names = DEFAULT_CYCLE) {
  const cycle = names.map(byName);
  const n = cycle.length;
  const s = (((phase % 1) + 1) % 1) * n;
  const i = Math.floor(s);
  const e = smooth(0.12, 0.88, s - i);
  return mixPal(cycle[i], cycle[(i + 1) % n], e);
}

export function frameState(k, n, scene, o = {}) {
  const C = { ...CONFIG, ...o };
  const phase = k / n;
  let az = C.az0 - 2 * Math.PI * phase;
  // keep ray directions away from exact axis alignment
  if (Math.abs(Math.sin(az)) < 1e-4 || Math.abs(Math.cos(az)) < 1e-4) az += 2e-4;
  const cam = camera({
    az, elev: C.elev, target: [4, 4, C.zCenter], pix: C.pix, FH, SLAB, WT,
    fLo: scene.f0,
  });
  const sun = sunDir(az, C.sunSwing, C.sunElev);
  const palette = paletteAt(o.palettePhase ?? phase, C.palettes);
  const zTop = scene.fTop * FH;
  return {
    cam, sun, palette,
    zTop,
    fadeA: 2.6 * FH,
    fadeB: 9.6 * FH,
    lineZ: zTop,
    planZ: scene.fTop * FH + SLAB,
    siteZ: zTop - 7 * FH,
    siteR: 8.5,
    stripe: 7,
    strips: C.strips || 8,
    grain: 0.008,
    azDeg: ((az / DEG) % 360 + 360) % 360,
  };
}
