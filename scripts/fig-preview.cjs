// Rendert eine SVG-Abbildung aus src/_includes/fig/ im Seiten-CSS zur Kontrolle.
// Nutzung: node scripts/fig-preview.cjs <name> <ausgabe.png> [breite]
// (vorher einmal `npx @11ty/eleventy` laufen lassen, damit _site/assets existiert)
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "_site");
const [name, out, w = "1100"] = process.argv.slice(2);
const svg = fs.readFileSync(path.join(__dirname, "..", "src/_includes/fig", name + ".svg"), "utf8");
const page = `<!doctype html><html lang="de"><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/css/main.css"></head>
<body style="padding:40px 0"><div class="article wrap"><p>Fließtext davor zur Orientierung der Größenverhältnisse im Artikel.</p><figure class="fig">${svg}</figure><p class="caption">Abbildung – Bildunterschrift</p></div></body></html>`;
const T = { ".css": "text/css", ".woff2": "font/woff2" };
const srv = http.createServer((q, r) => {
  if (q.url === "/") { r.writeHead(200, { "content-type": "text/html; charset=utf-8" }); return r.end(page); }
  const f = path.join(root, decodeURIComponent(q.url));
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "content-type": T[path.extname(f)] || "" }); r.end(fs.readFileSync(f));
}).listen(0, async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: 800 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(`http://localhost:${srv.address().port}/`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out, fullPage: true });
  // Text, der über den Rand der viewBox hinausragt, melden
  const over = await p.evaluate(() => {
    const s = document.querySelector(".fig svg"); const vb = s.viewBox.baseVal; const res = [];
    s.querySelectorAll("text").forEach((t) => { const bb = t.getBBox(); if (bb.x < vb.x - 1 || bb.y < vb.y - 1 || bb.x + bb.width > vb.x + vb.width + 1 || bb.y + bb.height > vb.y + vb.height + 1) res.push(t.textContent.trim().slice(0, 40)); });
    return res;
  });
  console.log(JSON.stringify({ errors: errs, textOutsideViewBox: over }));
  await b.close(); srv.close();
});
