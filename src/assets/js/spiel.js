// Spiel „Planetare Grenzen halten“ – läuft komplett im Browser, Bestenliste nur in localStorage.
(function () {
  var svg = document.querySelector("[data-spiel]");
  if (!svg) return;
  var NS = "http://www.w3.org/2000/svg";
  var CX = 280, CY = 280, R_IN = 60, R_SAFE = 150, R_KIPP = 250;
  var NAMEN = ["Klimawandel", "Biosphäre", "Landnutzung", "Süßwasser", "Stickstoff & Phosphor", "Ozeanversauerung", "Aerosole", "Ozonschicht", "Neue Substanzen"];
  var KURZ = ["Klima", "Biosphäre", "Land", "Süßwasser", "N & P", "Ozean", "Aerosole", "Ozon", "Neue Stoffe"];
  var btn = document.querySelector(".spiel-start");
  var box = document.querySelector(".spiel-liste");
  var liste = box.querySelector(".hs-liste");
  var hudL = svg.querySelector(".pg-hud-l"), hudR = svg.querySelector(".pg-hud-r"), st = svg.querySelector(".pg-status");
  var KEY = "ru-grenzen-top5";
  var segs = [], on = false, pts = 0, acc = 0, level = 1, t0 = 0, last = 0, raf = 0, nextShock = 0, ov = null, eingriffe = 0;

  function el(n, a, t) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (t != null) e.textContent = t; return e; }
  function pol(r, a) { return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; }
  function arc(r0, r1, a0, a1) {
    var p0 = pol(r1, a0), p1 = pol(r1, a1), p2 = pol(r0, a1), p3 = pol(r0, a0), big = a1 - a0 > Math.PI ? 1 : 0;
    return "M" + p0 + " A" + r1 + " " + r1 + " 0 " + big + " 1 " + p1 + " L" + p2 + " A" + r0 + " " + r0 + " 0 " + big + " 0 " + p3 + " Z";
  }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function top() { try { var a = JSON.parse(ls(KEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function pad(n) { return ("00000" + n).slice(-5); }

  // Segmente aufbauen
  var g = svg.querySelector(".pg-segs"), step = Math.PI * 2 / 9, gap = 0.035;
  NAMEN.forEach(function (name, i) {
    var a0 = -Math.PI / 2 + i * step + gap, a1 = a0 + step - 2 * gap, am = (a0 + a1) / 2;
    var grp = el("g", { "class": "pg-seg", tabindex: "-1", "data-i": i });
    grp.appendChild(el("path", { "class": "pg-hit", d: arc(R_IN, R_KIPP, a0, a1) }));
    var bar = el("path", { "class": "pg-bar", d: arc(R_IN, R_IN + 1, a0, a1) });
    grp.appendChild(bar);
    var lp = pol(R_KIPP - 14, am);
    grp.appendChild(el("text", { "class": "pg-name", x: lp[0], y: lp[1] + 4, "text-anchor": "middle" }, KURZ[i]));
    var np = pol(R_IN + 14, am);
    grp.appendChild(el("text", { "class": "pg-nr", x: np[0], y: np[1] + 4, "text-anchor": "middle" }, String(i + 1)));
    grp.appendChild(el("title", {}, name));
    g.appendChild(grp);
    var s = { i: i, a0: a0, a1: a1, r: 100, v: 0, grp: grp, bar: bar };
    segs.push(s);
    grp.addEventListener("pointerdown", function (e) { e.preventDefault(); eingriff(s); });
  });

  function zeichnen() {
    segs.forEach(function (s) {
      s.bar.setAttribute("d", arc(R_IN, Math.max(R_IN + 1, s.r), s.a0, s.a1));
      var z = s.r <= R_SAFE ? "ok" : s.r < R_SAFE + (R_KIPP - R_SAFE) * 0.6 ? "warn" : "krit";
      s.grp.setAttribute("data-z", z);
    });
  }
  function hud() {
    var best = top()[0], b = Math.max(best ? best.score : 0, pts);
    hudL.textContent = on || pts ? "PUNKTE " + pad(pts) + "   LEVEL " + level : "";
    hudR.textContent = b ? "REKORD " + pad(b) : "";
  }
  function plus(s, t) {
    var am = (s.a0 + s.a1) / 2, p = pol(s.r + 12, am);
    var x = el("text", { "class": "pg-plus", x: p[0], y: p[1], "text-anchor": "middle" }, t);
    svg.appendChild(x); setTimeout(function () { x.remove(); }, 800);
  }
  function eingriff(s) {
    if (!on) return;
    var n = (s.r > R_SAFE ? 15 : 3) * level;
    pts += n; eingriffe++;
    s.r = R_IN + 30 + Math.random() * 20;
    s.v = s.v * 0.6;
    s.grp.classList.add("hit"); setTimeout(function () { s.grp.classList.remove("hit"); }, 250);
    plus(s, "+" + n);
    zeichnen(); hud();
  }
  function meldung(t) { st.textContent = t; }

  function tick(now) {
    if (!on) return;
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    var dauer = Math.max(0, now - t0) / 1000, neuLevel = 1 + Math.floor(dauer / 15);
    if (neuLevel !== level) { level = neuLevel; meldung("Level " + level + ": Der Druck steigt."); }
    var tempo = 1 + (level - 1) * 0.35;
    segs.forEach(function (s) { s.r += (s.v * tempo) * dt; });
    if (now > nextShock) {
      var s = segs[Math.floor(Math.random() * 9)];
      s.r += 25 + Math.random() * 20 * tempo;
      s.v = 10 + Math.random() * 14;
      nextShock = now + Math.max(500, 2600 / tempo) * (0.5 + Math.random());
    }
    var sicher = segs.filter(function (s) { return s.r <= R_SAFE; }).length;
    acc += sicher * dt * level; // Punkte für jede Sekunde, in der Grenzen eingehalten werden
    if (acc >= 1) { var a = Math.floor(acc); pts += a; acc -= a; }
    zeichnen(); hud();
    var kipp = segs.filter(function (s) { return s.r >= R_KIPP; })[0];
    if (kipp) return ende(kipp);
    raf = requestAnimationFrame(tick);
  }

  function ende(s) {
    on = false; cancelAnimationFrame(raf);
    svg.classList.remove("laeuft");
    s.grp.classList.add("gekippt");
    var alt = top(), rekord = pts > 0 && (!alt.length || pts > alt[0].score);
    var neu = alt.concat([{ score: pts, level: level, at: Date.now() }]).sort(function (a, b) { return b.score - a.score || a.at - b.at; }).slice(0, 5);
    ls(KEY, JSON.stringify(neu));
    ov = el("g", { "class": "pg-over" });
    ov.appendChild(el("rect", { x: 0, y: 0, width: 560, height: 560, rx: 0 }));
    ov.appendChild(el("text", { "class": "go1", x: 280, y: 236, "text-anchor": "middle" }, "Kipppunkt erreicht"));
    ov.appendChild(el("text", { "class": "go2", x: 280, y: 272, "text-anchor": "middle" }, NAMEN[s.i] + " ist gekippt."));
    ov.appendChild(el("text", { "class": "go3", x: 280, y: 318, "text-anchor": "middle" }, "PUNKTE " + pad(pts)));
    if (rekord) ov.appendChild(el("text", { "class": "go2 rekord", x: 280, y: 352, "text-anchor": "middle" }, "Neuer Rekord!"));
    svg.appendChild(ov);
    meldung("");
    btn.textContent = "Nochmal spielen"; btn.disabled = false;
    render(neu, pts);
    hud();
  }
  function render(a, aktuell) {
    liste.textContent = "";
    box.hidden = false;
    a.forEach(function (x) {
      var li = document.createElement("li");
      var d = new Date(x.at);
      li.innerHTML = "<span>" + d.toLocaleDateString("de-DE") + " · Level " + x.level + "</span><strong>" + pad(x.score) + "</strong>";
      if (x.score === aktuell) li.className = "neu";
      liste.appendChild(li);
    });
  }
  function start() {
    if (on) return;
    if (ov) { ov.remove(); ov = null; }
    segs.forEach(function (s) { s.r = R_IN + 25 + Math.random() * 45; s.v = 4 + Math.random() * 8; s.grp.classList.remove("gekippt"); });
    on = true; pts = 0; level = 1; acc = 0; eingriffe = 0;
    t0 = last = performance.now(); nextShock = t0 + 1200;
    svg.classList.add("laeuft");
    btn.disabled = true; btn.textContent = "Läuft …";
    meldung("Level 1: Halten Sie alle Segmente im grünen Bereich.");
    var r = svg.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) svg.scrollIntoView({ block: "center", behavior: "smooth" });
    raf = requestAnimationFrame(tick);
  }
  btn.addEventListener("click", start);
  document.addEventListener("keydown", function (e) {
    if (!on || e.target.closest("input,textarea")) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) { e.preventDefault(); eingriff(segs[n - 1]); }
  });
  segs.forEach(function (s, i) { s.r = R_IN + 40 + ((i * 37) % 70); });
  zeichnen(); hud();
  var alt = top(); if (alt.length) render(alt, -1);
})();
