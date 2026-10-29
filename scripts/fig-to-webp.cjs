// Rendert SVG-Abbildungen als WebP (für Titelbilder/Vorschaukarten), Papier-Hintergrund.
// Nutzung: node scripts/fig-to-webp.cjs name1 name2 …  (schreibt src/assets/img/<name>.webp und -720.webp)
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const base = path.join(__dirname, "..");
const T = { ".css": "text/css", ".woff2": "font/woff2" };
const srv = http.createServer((q, r) => {
  const name = q.url.slice(1);
  if (name.startsWith("render/")) {
    const svg = fs.readFileSync(path.join(base, "src/_includes/fig", name.slice(7) + ".svg"), "utf8");
    r.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return r.end(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/css/main.css">
<style>body::before{display:none} body{margin:0;background:var(--paper)} .stage{width:1600px;height:1000px;display:flex;align-items:center;justify-content:center;background:var(--paper)} .fig{width:1200px;max-width:none;margin:0}</style></head>
<body><div class="stage"><figure class="fig">${svg}</figure></div></body></html>`);
  }
  const f = path.join(base, "_site", decodeURIComponent(q.url));
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "content-type": T[path.extname(f)] || "" }); r.end(fs.readFileSync(f));
}).listen(0, async () => {
  const sharp = require(path.join(base, "node_modules/sharp"));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  for (const name of process.argv.slice(2)) {
    await p.goto(`http://localhost:${srv.address().port}/render/${name}`, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const png = await p.locator(".stage").screenshot();
    await sharp(png).webp({ quality: 85 }).toFile(path.join(base, "src/assets/img", name + ".webp"));
    await sharp(png).resize({ width: 720 }).webp({ quality: 80 }).toFile(path.join(base, "src/assets/img", name + "-720.webp"));
    console.log("✓", name);
  }
  await b.close(); srv.close();
});
