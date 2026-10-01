// Babel tower renderer (WebGL2). Same recipe as the essay: parallel rays walk
// the room grid one square at a time and test only a floor, four walls and four
// pillars per square; ink comes from comparing neighbouring hits; shade comes
// from a second ray toward a sun that sits over the viewer's shoulder.
//
// Pass A writes a hit buffer (t, normal, material) at supersampled resolution.
// Pass B finds ink edges, traces shadows and paints hatching, letters and paper.
// Pass C box-filters down to the canvas.

const VS = `#version 300 es
void main() {
  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const COMMON = `#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;

uniform usampler2D uCells;
uniform int uF0, uNF, uFLo, uFHi;
uniform float uFH, uSlab, uWT;
uniform vec3 uCamD, uCamR, uCamU, uCamC;
uniform float uPix;
uniform vec2 uSize;

#define MAT_NONE 0
#define MAT_SLAB 1
#define MAT_WALL 2
#define MAT_PILLAR 3

uvec4 cellAt(int i, int j, int f) {
  if (i < -1 || i > 8 || j < -1 || j > 8 || f < uF0 || f >= uF0 + uNF) return uvec4(0u);
  return texelFetch(uCells, ivec2(i + 1, (f - uF0) * 10 + j + 1), 0);
}

vec3 rayOrigin(vec2 fc) {
  vec2 q = fc - 0.5 * uSize;
  return uCamC + uCamR * (q.x * uPix) + uCamU * (q.y * uPix) - uCamD * 60.0;
}

float gT;
int gNC;
int gMat;

void box(vec3 bmin, vec3 bmax, vec3 ro, vec3 inv, int mat) {
  vec3 t1 = (bmin - ro) * inv;
  vec3 t2 = (bmax - ro) * inv;
  vec3 tn = min(t1, t2);
  vec3 tf = max(t1, t2);
  float tN = max(max(tn.x, tn.y), tn.z);
  float tF = min(min(tf.x, tf.y), tf.z);
  if (tN <= tF && tN > 0.0 && tN < gT) {
    gT = tN;
    gMat = mat;
    if (tN == tn.x) gNC = inv.x > 0.0 ? 1 : 0;
    else if (tN == tn.y) gNC = inv.y > 0.0 ? 3 : 2;
    else gNC = inv.z > 0.0 ? 5 : 4;
  }
}

void testCell(ivec3 c, vec3 ro, vec3 inv) {
  int i = c.x, j = c.y, f = c.z;
  uvec4 c00 = cellAt(i, j, f);
  uvec4 c10 = cellAt(i + 1, j, f);
  uvec4 c01 = cellAt(i, j + 1, f);
  uvec4 c11 = cellAt(i + 1, j + 1, f);
  uint any = (c00.r & 0xFFFFu) | (c00.g & 255u) | (c00.b & 255u) | (c10.r & 0xFF00u) |
             (c10.g & 255u) | (c01.r & 0xFF00u) | (c01.b & 255u) | (c11.r & 0xFF00u);
  if (any == 0u) return;
  float z0 = float(f) * uFH;
  float zs = z0 + uSlab;
  float wh = uFH - uSlab;
  float hw = 0.5 * uWT;
  float fi = float(i), fj = float(j);
  uint s = c00.r & 255u;
  if (s > 0u) {
    float hs = 0.5 * float(s) / 255.0;
    box(vec3(fi + 0.5 - hs, fj + 0.5 - hs, z0), vec3(fi + 0.5 + hs, fj + 0.5 + hs, zs), ro, inv, MAT_SLAB);
  }
  uint w;
  w = c00.g & 255u;
  if (w > 0u) box(vec3(fi - hw, fj, zs), vec3(fi + hw, fj + 1.0, zs + wh * float(w) / 255.0), ro, inv, MAT_WALL);
  w = c10.g & 255u;
  if (w > 0u) box(vec3(fi + 1.0 - hw, fj, zs), vec3(fi + 1.0 + hw, fj + 1.0, zs + wh * float(w) / 255.0), ro, inv, MAT_WALL);
  w = c00.b & 255u;
  if (w > 0u) box(vec3(fi, fj - hw, zs), vec3(fi + 1.0, fj + hw, zs + wh * float(w) / 255.0), ro, inv, MAT_WALL);
  w = c01.b & 255u;
  if (w > 0u) box(vec3(fi, fj + 1.0 - hw, zs), vec3(fi + 1.0, fj + 1.0 + hw, zs + wh * float(w) / 255.0), ro, inv, MAT_WALL);
  uint p;
  p = (c00.r >> 8) & 255u;
  if (p > 0u) box(vec3(fi - hw, fj - hw, zs), vec3(fi + hw, fj + hw, zs + wh * float(p) / 255.0), ro, inv, MAT_PILLAR);
  p = (c10.r >> 8) & 255u;
  if (p > 0u) box(vec3(fi + 1.0 - hw, fj - hw, zs), vec3(fi + 1.0 + hw, fj + hw, zs + wh * float(p) / 255.0), ro, inv, MAT_PILLAR);
  p = (c01.r >> 8) & 255u;
  if (p > 0u) box(vec3(fi - hw, fj + 1.0 - hw, zs), vec3(fi + hw, fj + 1.0 + hw, zs + wh * float(p) / 255.0), ro, inv, MAT_PILLAR);
  p = (c11.r >> 8) & 255u;
  if (p > 0u) box(vec3(fi + 1.0 - hw, fj + 1.0 - hw, zs), vec3(fi + 1.0 + hw, fj + 1.0 + hw, zs + wh * float(p) / 255.0), ro, inv, MAT_PILLAR);
}

// Walk the grid. Returns the material hit (0 = nothing); details in gT/gNC/gMat.
int trace(vec3 ro, vec3 rd, bool anyHit, int maxSteps) {
  gT = 1e9; gNC = -1; gMat = MAT_NONE;
  vec3 inv = 1.0 / rd;
  vec3 bmin = vec3(-0.06, -0.06, float(uFLo) * uFH);
  vec3 bmax = vec3(8.06, 8.06, float(uFHi + 1) * uFH);
  vec3 t1 = (bmin - ro) * inv, t2 = (bmax - ro) * inv;
  vec3 tn = min(t1, t2), tf = max(t1, t2);
  float tA = max(max(max(tn.x, tn.y), tn.z), 0.0);
  float tB = min(min(tf.x, tf.y), tf.z);
  if (tA > tB) return 0;
  vec3 cs = vec3(1.0, 1.0, uFH);
  vec3 p = ro + rd * (tA + 1e-4);
  ivec3 c = ivec3(floor(p / cs));
  c = clamp(c, ivec3(-1, -1, uFLo), ivec3(8, 8, uFHi));
  ivec3 st = ivec3(rd.x > 0.0 ? 1 : -1, rd.y > 0.0 ? 1 : -1, rd.z > 0.0 ? 1 : -1);
  vec3 tD = abs(cs * inv);
  vec3 nb = (vec3(c) + vec3(greaterThan(rd, vec3(0.0)))) * cs;
  vec3 tM = (nb - ro) * inv;
  for (int k = 0; k < 96; k++) {
    if (k >= maxSteps) break;
    testCell(c, ro, inv);
    if (anyHit && gMat != MAT_NONE) return gMat;
    float tExit = min(min(tM.x, tM.y), tM.z);
    if (gT <= tExit || tExit > tB) return gMat;
    if (tM.x < tM.y) {
      if (tM.x < tM.z) { c.x += st.x; tM.x += tD.x; } else { c.z += st.z; tM.z += tD.z; }
    } else {
      if (tM.y < tM.z) { c.y += st.y; tM.y += tD.y; } else { c.z += st.z; tM.z += tD.z; }
    }
    if (c.x < -1 || c.x > 8 || c.y < -1 || c.y > 8 || c.z < uFLo || c.z > uFHi) return gMat;
  }
  return gMat;
}

vec3 normalOf(int nc) {
  float s = (nc & 1) == 1 ? -1.0 : 1.0;
  int a = nc >> 1;
  return a == 0 ? vec3(s, 0.0, 0.0) : (a == 1 ? vec3(0.0, s, 0.0) : vec3(0.0, 0.0, s));
}
`;

const FS_GBUF = COMMON + `
out vec4 outG;
void main() {
  vec3 ro = rayOrigin(gl_FragCoord.xy);
  int m = trace(ro, uCamD, false, 96);
  if (m == MAT_NONE) outG = vec4(1e9, -1.0, 0.0, 0.0);
  else outG = vec4(gT, float(gNC), float(m), 0.0);
}`;

// 5x7 letters A..Z, then the three-slot window used for spaces
const FONT = [
  [14,17,17,31,17,17,17],[30,17,17,30,17,17,30],[14,17,16,16,16,17,14],[30,17,17,17,17,17,30],
  [31,16,16,30,16,16,31],[31,16,16,30,16,16,16],[14,17,16,23,17,17,15],[17,17,17,31,17,17,17],
  [14,4,4,4,4,4,14],[7,2,2,2,2,18,12],[17,18,20,24,20,18,17],[16,16,16,16,16,16,31],
  [17,27,21,21,17,17,17],[17,17,25,21,19,17,17],[14,17,17,17,17,17,14],[30,17,17,30,16,16,16],
  [14,17,17,17,21,18,13],[30,17,17,30,20,18,17],[15,16,16,14,1,1,30],[31,4,4,4,4,4,4],
  [17,17,17,17,17,17,14],[17,17,17,17,17,10,4],[17,17,17,21,21,21,10],[17,17,10,4,10,17,17],
  [17,17,10,4,4,4,4],[31,1,2,4,8,16,31],[21,21,21,21,21,21,21],
];

const FS_SHADE = COMMON + `
uniform sampler2D uG;
uniform vec3 uSun;
uniform vec3 uPaper, uPaperEdge, uMid, uDark, uInk;
uniform float uZTop, uFadeA, uFadeB;
uniform vec4 uRects[4];
uniform int uNRects;
uniform float uLineZ, uPlanZ, uSiteZ;
uniform float uSiteR;
uniform float uStripe;   // stripes per room width
uniform float uInkAmt;

const uint FONT[${FONT.length * 7}] = uint[${FONT.length * 7}](${FONT.flat().map((v) => v + "u").join(",")});

out vec4 outC;

float fadeAt(float z) { return smoothstep(uFadeA, uFadeB, uZTop - z); }

vec3 paperAt(vec2 uv) {
  vec2 d = (uv - vec2(0.5, 0.46)) * vec2(1.0, 0.92);
  float v = smoothstep(0.15, 0.85, length(d) * 1.35);
  return mix(uPaper, uPaperEdge, v);
}

vec3 ramp(float t, vec3 white) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5 ? mix(white, uMid, t * 2.0) : mix(uMid, uDark, (t - 0.5) * 2.0);
}

// anti-aliased stripe: 1 inside a band of width 'duty' (fraction of period)
float stripe(float x, float duty) {
  float w = fwidth(x);
  float f = fract(x);
  float a = smoothstep(0.0, w, f) - smoothstep(duty, duty + w, f);
  // fade patterns that would alias
  return a * (1.0 - smoothstep(0.25, 0.5, w));
}

float lineMask(float d, float gradLen) {
  float px = abs(d) / max(gradLen, 1e-6);
  return 1.0 - smoothstep(0.6, 1.6, px);
}

float rectDist(vec2 p, vec4 r) {
  vec2 q = max(max(r.xy - p, p - r.zw), 0.0);
  return length(q);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  ivec2 px = ivec2(fc);
  ivec2 lim = ivec2(uSize) - 1;
  vec4 g = texelFetch(uG, px, 0);
  bool hit = g.z > 0.5;
  vec2 uv = fc / uSize;
  vec3 paper = paperAt(uv);
  vec3 ro = rayOrigin(fc);
  vec3 P = ro + uCamD * g.x;
  vec3 N = normalOf(int(g.y + 0.5));

  // ---- ink: compare with the eight neighbours ----
  float edge = 0.0;
  float eFade = 1.0;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      ivec2 qp = clamp(px + ivec2(dx, dy), ivec2(0), lim);
      vec4 q = texelFetch(uG, qp, 0);
      bool hq = q.z > 0.5;
      if (!hit && !hq) continue;
      float e = 0.0;
      vec3 Q = rayOrigin(fc + vec2(dx, dy)) + uCamD * q.x;
      if (hit != hq) e = 1.0;
      else if (abs(q.y - g.y) > 0.5) e = 1.0;
      else if (abs(dot(Q - P, N)) > 0.012) e = 1.0;
      if (e > 0.0) {
        float w = (dx == 0 || dy == 0) ? 1.0 : 0.55;
        edge = max(edge, w);
        float zz = hit && hq ? max(P.z, Q.z) : (hit ? P.z : Q.z);
        eFade = min(eFade, fadeAt(zz));
      }
    }
  }

  vec3 col = paper;

  if (hit) {
    int mat = int(g.z + 0.5);
    float fade = fadeAt(P.z);
    if (fade < 0.995) {
      float ndl = dot(N, uSun);
      float sh = 0.0;
      if (ndl <= 0.02) sh = 1.0;
      else if (trace(P + N * 0.004, uSun, true, 48) != MAT_NONE) sh = 1.0;

      int f = int(floor(P.z / uFH + 1e-4));
      float z0 = float(f) * uFH;
      float zs = z0 + uSlab;
      float wh = uFH - uSlab;
      float tone;
      float dots = 0.0;

      if (N.z > 0.5) {
        // tops: wall tops and pillar tops stay white; floors get pen strokes
        if (mat == MAT_SLAB) {
          vec2 c = fract(P.xy);
          float dEdge = min(min(c.x, 1.0 - c.x), min(c.y, 1.0 - c.y));
          float ao = 1.0 - smoothstep(0.0, 0.22, dEdge);
          float h1 = stripe((P.x - P.y) * 9.0, 0.16);
          tone = 0.07 + 0.16 * h1 + 0.16 * ao;
          if (sh > 0.5) {
            float h2 = stripe((P.x + P.y) * 9.0, 0.2);
            tone = 0.36 + 0.16 * h1 + 0.16 * h2 + 0.12 * ao;
          }
        } else {
          tone = sh > 0.5 ? 0.22 : 0.0;
        }
      } else {
        // walls, pillars, slab edges
        bool alongX = abs(N.x) > 0.5;
        float u = alongX ? P.y : P.x;
        float lam = clamp(ndl, 0.0, 1.0);
        float base = mix(0.62, 0.06, smoothstep(0.08, 0.7, lam));
        if (sh > 0.5) base = max(base, 0.5) + 0.08;
        float duty = mix(0.1, 0.48, smoothstep(0.05, 0.62, base));
        float st = stripe(u * uStripe, duty);
        float lo = base * 0.62;
        float hi = min(1.0, base * 1.22 + 0.12);
        tone = mix(lo, hi, st);
        if (sh > 0.5) tone += 0.14 * stripe((u + (P.z - z0) * 0.58) * 22.0, 0.22);
        else tone += 0.07 * stripe((u - (P.z - z0) * 0.58) * 16.0, 0.12);
        float hz = P.z - zs;
        tone += 0.16 * (1.0 - smoothstep(0.0, 0.2, hz)) * step(0.0, hz);
        if (mat == MAT_SLAB) tone = max(tone, 0.55);

        // letter windows on the outside face of outer walls
        if (mat == MAT_WALL) {
          int ex, ey;
          uint wv;
          if (alongX) { ex = int(floor(P.x + 0.5)); ey = int(floor(P.y)); wv = cellAt(ex, ey, f).g; }
          else { ex = int(floor(P.x)); ey = int(floor(P.y + 0.5)); wv = cellAt(ex, ey, f).b; }
          bool ext = ((wv >> 10) & 1u) == 1u;
          bool outNeg = ((wv >> 11) & 1u) == 1u;
          float nsign = alongX ? N.x : N.y;
          uint gl = (wv >> 16) & 31u;
          if (ext && gl > 0u && ((outNeg && nsign < 0.0) || (!outNeg && nsign > 0.0))) {
            float uu;
            if (alongX) uu = N.x < 0.0 ? float(ey + 1) - P.y : P.y - float(ey);
            else uu = N.y < 0.0 ? P.x - float(ex) : float(ex + 1) - P.x;
            float vz = P.z - (zs + 0.5 * wh);
            float pitchU = 0.092, pitchV = 0.106;
            float cu = uu - 0.5;
            float col5 = floor(cu / pitchU + 2.5);
            float row7 = floor(-vz / pitchV + 3.5);
            if (col5 >= 0.0 && col5 < 5.0 && row7 >= 0.0 && row7 < 7.0) {
              uint bits = FONT[(int(gl) - 1) * 7 + int(row7)];
              if (((bits >> (4u - uint(col5))) & 1u) == 1u) {
                float du = cu - (col5 - 2.0) * pitchU;
                float dv = -vz - (row7 - 3.0) * pitchV;
                float aw = fwidth(cu), av = fwidth(vz);
                float mu = 1.0 - smoothstep(0.026 - aw, 0.026 + aw, abs(du));
                float mv = 1.0 - smoothstep(0.032 - av, 0.032 + av, abs(dv));
                dots = mu * mv;
              }
            }
          }
        }
      }

      vec3 white = mix(paper, vec3(1.0), 0.62);
      vec3 c = ramp(tone, white);
      c = mix(c, uDark * 0.85, dots * 0.8);
      col = mix(c, paper, fade);
    }
  } else {
    // ---- paper: construction lines of the plan, and the site square ----
    float tl = (uLineZ - ro.z) / uCamD.z;
    vec3 Lp = ro + uCamD * tl;
    vec3 da = uPix * (uCamR - uCamD * (uCamR.z / uCamD.z));
    vec3 db = uPix * (uCamU - uCamD * (uCamU.z / uCamD.z));
    float gx = length(vec2(da.x, db.x));
    float gy = length(vec2(da.y, db.y));
    float lines = 0.0;
    float dmin = 1e9;
    for (int k = 0; k < 4; k++) {
      if (k >= uNRects) break;
      dmin = min(dmin, rectDist(Lp.xy, uRects[k]));
    }
    float far = exp(-dmin / 5.0);
    for (int k = 0; k < 4; k++) {
      if (k >= uNRects) break;
      vec4 r = uRects[k];
      lines = max(lines, lineMask(Lp.x - r.x, gx));
      lines = max(lines, lineMask(Lp.x - r.z, gx));
      lines = max(lines, lineMask(Lp.y - r.y, gy));
      lines = max(lines, lineMask(Lp.y - r.w, gy));
    }
    lines *= far * 0.2;
    // site square, a few floors lower down
    float ts = (uSiteZ - ro.z) / uCamD.z;
    vec3 Sp = ro + uCamD * ts;
    vec2 sc = Sp.xy - vec2(4.0);
    float site = 0.0;
    vec2 a = abs(sc);
    float onX = lineMask(a.x - uSiteR, gx) * step(a.y, uSiteR + 0.02);
    float onY = lineMask(a.y - uSiteR, gy) * step(a.x, uSiteR + 0.02);
    site = max(onX, onY) * 0.13;
    col = mix(col, uInk, max(lines, site));
  }

  // ---- dashed plan of the floor being built (built walls hide it, so it marks rooms to come) ----
  {
    float tp = (uPlanZ - ro.z) / uCamD.z;
    if (!hit || tp < g.x) {
      vec3 Pp = ro + uCamD * tp;
      vec3 da = uPix * (uCamR - uCamD * (uCamR.z / uCamD.z));
      vec3 db = uPix * (uCamU - uCamD * (uCamU.z / uCamD.z));
      float gx = length(vec2(da.x, db.x));
      float gy = length(vec2(da.y, db.y));
      float m = 0.0;
      for (int k = 0; k < 4; k++) {
        if (k >= uNRects) break;
        vec4 r = uRects[k];
        // edges of this rect that are on the outline (not inside another rect)
        for (int e = 0; e < 4; e++) {
          bool vert = e < 2;
          float c = e == 0 ? r.x : (e == 1 ? r.z : (e == 2 ? r.y : r.w));
          float dist = vert ? Pp.x - c : Pp.y - c;
          float along = vert ? Pp.y : Pp.x;
          float lo = vert ? r.y : r.x, hi2 = vert ? r.w : r.z;
          if (along < lo || along > hi2) continue;
          vec2 probe = vert ? vec2(c + (e == 0 ? -0.5 : 0.5), along) : vec2(along, c + (e == 2 ? -0.5 : 0.5));
          bool inside = false;
          for (int k2 = 0; k2 < 4; k2++) {
            if (k2 >= uNRects) break;
            vec4 r2 = uRects[k2];
            if (probe.x > r2.x && probe.x < r2.z && probe.y > r2.y && probe.y < r2.w) inside = true;
          }
          if (inside) continue;
          float dash = step(0.45, fract(along * 4.0));
          m = max(m, lineMask(dist, vert ? gx : gy) * dash);
        }
      }
      col = mix(col, uInk, m * 0.55);
    }
  }

  col = mix(col, uInk, edge * (1.0 - eFade) * uInkAmt);
  outC = vec4(col, 1.0);
}`;

const FS_DOWN = `#version 300 es
precision highp float;
uniform sampler2D uC;
uniform int uSS;
uniform float uGrain;
out vec4 outC;
float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  ivec2 base = ivec2(gl_FragCoord.xy) * uSS;
  vec3 s = vec3(0.0);
  for (int y = 0; y < 4; y++) {
    if (y >= uSS) break;
    for (int x = 0; x < 4; x++) {
      if (x >= uSS) break;
      s += texelFetch(uC, base + ivec2(x, y), 0).rgb;
    }
  }
  s /= float(uSS * uSS);
  s += (h(gl_FragCoord.xy) - 0.5) * uGrain;
  outC = vec4(s, 1.0);
}`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    const lines = src.split("\n").map((l, i) => `${i + 1}: ${l}`).join("\n");
    throw new Error("shader compile failed: " + log + "\n" + lines.slice(0, 200));
  }
  return sh;
}

function program(gl, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("link failed: " + gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    const name = info.name.replace(/\[0\]$/, "");
    u[name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

export function createTower(canvas, scene, opts = {}) {
  const SS = opts.ss || 2;
  const gl = canvas.getContext("webgl2", { antialias: false, preserveDrawingBuffer: true, alpha: false });
  if (!gl) throw new Error("no webgl2");
  gl.getExtension("EXT_color_buffer_float");
  const W = canvas.width, H = canvas.height;
  const SW = W * SS, SH = H * SS;

  const pG = program(gl, FS_GBUF);
  const pS = program(gl, FS_SHADE);
  const pD = program(gl, FS_DOWN);

  const cells = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, cells);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32UI, scene.W, scene.H, 0, gl.RGBA_INTEGER, gl.UNSIGNED_INT, scene.data);

  function target(internal, format, type) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, SW, SH, 0, format, type, null);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (ok !== gl.FRAMEBUFFER_COMPLETE) throw new Error("fb incomplete " + ok);
    return { t, fb };
  }
  const gbuf = target(gl.RGBA32F, gl.RGBA, gl.FLOAT);
  const cbuf = target(gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
  const vao = gl.createVertexArray();

  function setCommon(prog, cam) {
    const u = prog.u;
    gl.uniform1i(u.uCells, 0);
    gl.uniform1i(u.uF0, scene.f0);
    gl.uniform1i(u.uNF, scene.NF);
    gl.uniform1i(u.uFLo, cam.fLo);
    gl.uniform1i(u.uFHi, scene.f1);
    gl.uniform1f(u.uFH, cam.FH);
    gl.uniform1f(u.uSlab, cam.SLAB);
    gl.uniform1f(u.uWT, cam.WT);
    gl.uniform3fv(u.uCamD, cam.D);
    gl.uniform3fv(u.uCamR, cam.R);
    gl.uniform3fv(u.uCamU, cam.U);
    gl.uniform3fv(u.uCamC, cam.C);
    gl.uniform1f(u.uPix, cam.pix / SS);
    gl.uniform2f(u.uSize, SW, SH);
  }

  // Draw in strips so no single draw call runs too long on the software rasterizer.
  function stripes(n) {
    const h = Math.ceil(SH / n);
    gl.enable(gl.SCISSOR_TEST);
    for (let k = 0; k < n; k++) {
      gl.scissor(0, k * h, SW, h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.SCISSOR_TEST);
  }

  function render(s) {
    // s: { cam, sun, palette, ... }
    const cam = s.cam;
    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cells);

    // Pass A
    gl.bindFramebuffer(gl.FRAMEBUFFER, gbuf.fb);
    gl.viewport(0, 0, SW, SH);
    gl.useProgram(pG.p);
    setCommon(pG, cam);
    stripes(s.strips || 8);

    // Pass B
    gl.bindFramebuffer(gl.FRAMEBUFFER, cbuf.fb);
    gl.useProgram(pS.p);
    setCommon(pS, cam);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, gbuf.t);
    const u = pS.u;
    gl.uniform1i(u.uG, 1);
    gl.uniform3fv(u.uSun, s.sun);
    const pal = s.palette;
    gl.uniform3fv(u.uPaper, pal.paper);
    gl.uniform3fv(u.uPaperEdge, pal.paperEdge);
    gl.uniform3fv(u.uMid, pal.mid);
    gl.uniform3fv(u.uDark, pal.dark);
    gl.uniform3fv(u.uInk, pal.ink);
    gl.uniform1f(u.uZTop, s.zTop);
    gl.uniform1f(u.uFadeA, s.fadeA);
    gl.uniform1f(u.uFadeB, s.fadeB);
    const rects = new Float32Array(16);
    scene.topRects.slice(0, 4).forEach((r, k) => rects.set(r, k * 4));
    gl.uniform4fv(u.uRects, rects);
    gl.uniform1i(u.uNRects, Math.min(4, scene.topRects.length));
    gl.uniform1f(u.uLineZ, s.lineZ);
    gl.uniform1f(u.uPlanZ, s.planZ);
    gl.uniform1f(u.uSiteZ, s.siteZ);
    gl.uniform1f(u.uSiteR, s.siteR);
    gl.uniform1f(u.uStripe, s.stripe || 7);
    gl.uniform1f(u.uInkAmt, s.inkAmt ?? 0.92);
    stripes(s.strips || 8);

    // Pass C
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.useProgram(pD.p);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, cbuf.t);
    gl.uniform1i(pD.u.uC, 2);
    gl.uniform1i(pD.u.uSS, SS);
    gl.uniform1f(pD.u.uGrain, s.grain ?? 0.01);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const px = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    return px;
  }

  return { render, gl };
}

// Orthographic camera looking down at 'elev' from azimuth 'az' (radians).
export function camera({ az, elev, target, pix, FH, SLAB, WT, fLo }) {
  const ce = Math.cos(elev), se = Math.sin(elev);
  const D = [-ce * Math.cos(az), -ce * Math.sin(az), -se];
  const R = [-Math.sin(az), Math.cos(az), 0];
  const U = [-se * Math.cos(az), -se * Math.sin(az), ce];
  return { D, R, U, C: target, pix, FH, SLAB, WT, fLo };
}

// Sun over the viewer's shoulder: behind the camera, swung toward its right.
export function sunDir(az, swing, elev) {
  const a = az + swing;
  const ce = Math.cos(elev);
  return [ce * Math.cos(a), ce * Math.sin(a), Math.sin(elev)];
}
