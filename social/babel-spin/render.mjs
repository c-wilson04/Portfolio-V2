// Drives post.html in headless Chromium (SwiftShader WebGL2) and saves frames.
//   node render.mjs preview <k> <n> <out.png> [overridesJSON]
//   node render.mjs seq <n> <outDir> [from] [to]
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const root = path.dirname(new URL(import.meta.url).pathname);
const types = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  fs.readFile(p, (err, buf) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": types[path.extname(p)] || "application/octet-stream" });
    res.end(buf);
  });
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--disable-gpu-watchdog", "--disable-lcd-text"],
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("console", (m) => console.log("[page]", m.text()));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
const hash = process.env.CFG ? "#" + encodeURIComponent(process.env.CFG) : "";
await page.goto(`http://localhost:${port}/post.html${hash}`);
await page.waitForFunction(() => window.renderFrame && window.ready);
await page.evaluate(() => window.ready);

const post = await page.$("#post");
const mode = process.argv[2];

async function frame(k, n, out, overrides) {
  const r = await page.evaluate(([k, n, o]) => window.renderFrame(k, n, o), [k, n, overrides || {}]);
  await post.screenshot({ path: out, type: "png" });
  return r;
}

if (mode === "preview") {
  const [k, n, out, ov] = process.argv.slice(3);
  const t0 = Date.now();
  const r = await frame(+k, +n, out, ov ? JSON.parse(ov) : {});
  console.log(`frame ${k}/${n} az=${r.az.toFixed(1)} gl=${r.ms.toFixed(0)}ms total=${Date.now() - t0}ms`);
} else if (mode === "turn") {
  // node render.mjs turn <count> <outPrefix>
  const cnt = +process.argv[3], pre = process.argv[4];
  for (let k = 0; k < cnt; k++) {
    const r = await frame(k, cnt, `${pre}${k}.png`, { palettePhase: 0 });
    console.log(`turn ${k} az=${r.az.toFixed(1)} gl=${r.ms.toFixed(0)}ms`);
  }
} else if (mode === "pal") {
  // node render.mjs pal <k> <n> <outPrefix> : same view, each palette
  const [k, n, pre] = process.argv.slice(3);
  for (let i = 0; i < 4; i++) {
    const r = await frame(+k, +n, `${pre}${i}.png`, { palettePhase: i / 4 });
    console.log(`pal ${i} gl=${r.ms.toFixed(0)}ms`);
  }
} else if (mode === "seq") {
  const n = +process.argv[3];
  const dir = process.argv[4];
  const from = +(process.argv[5] || 0), to = +(process.argv[6] || n);
  fs.mkdirSync(dir, { recursive: true });
  const t0 = Date.now();
  for (let k = from; k < to; k++) {
    const out = path.join(dir, `f${String(k).padStart(4, "0")}.png`);
    if (fs.existsSync(out)) continue;
    const r = await frame(k, n, out + ".tmp.png");
    fs.renameSync(out + ".tmp.png", out);
    if (k % 10 === 0) console.log(`frame ${k}/${n} az=${r.az.toFixed(1)} gl=${r.ms.toFixed(0)}ms elapsed=${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  console.log("done", ((Date.now() - t0) / 1000).toFixed(0) + "s");
}

await browser.close();
server.close();
