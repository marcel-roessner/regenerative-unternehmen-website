// „Atempause“ – sechs Atemzüge, jeder lässt einen Jahresring wachsen. Läuft nur im Browser.
(function () {
  var svg = document.querySelector("[data-atem]");
  if (!svg) return;
  var NS = "http://www.w3.org/2000/svg";
  var CX = 280, CY = 280;
  var EIN = 4000, AUS = 6000, ZYKLUS = EIN + AUS, ZUEGE = 6;
  var R_MIN = 60, R_MAX = 200;
  var kreis = svg.querySelector(".at-kreis"), ringe = svg.querySelector(".at-ringe");
  var wort = svg.querySelector(".at-wort"), zahl = svg.querySelector(".at-zahl");
  var btn = document.querySelector(".atem-start"), bilanz = document.querySelector(".atem-bilanz");
  var KEY = "ru-atempause-ringe";
  var on = false, t0 = 0, raf = 0, gedrueckt = false, last = 0, imTakt = 0, gesamt = 0, zug = 0, ringR = 14;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function el(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function ease(x) { return 0.5 - 0.5 * Math.cos(Math.PI * x); }

  // leicht unregelmäßiger Ring wie in echtem Holz
  function ringPfad(r, seed) {
    var d = "", n = 72;
    for (var i = 0; i <= n; i++) {
      var a = i / n * Math.PI * 2;
      var w = r + Math.sin(a * 3 + seed) * r * 0.018 + Math.sin(a * 5 + seed * 2) * r * 0.012;
      d += (i ? "L" : "M") + (CX + w * Math.cos(a)).toFixed(1) + " " + (CY + w * Math.sin(a)).toFixed(1);
    }
    return d + "Z";
  }
  function ringDazu(qualitaet) {
    var breite = 12 + qualitaet * 14; // gut im Takt = breiterer Ring, aber jeder Atemzug zählt
    ringR += breite;
    var p = el("path", { "class": "at-ring", d: ringPfad(ringR, Math.random() * 6), "stroke-width": (0.8 + qualitaet * 1.6).toFixed(2) });
    ringe.appendChild(p);
  }

  function phase(t) {
    var x = t % ZYKLUS;
    return x < EIN ? { ein: true, p: x / EIN } : { ein: false, p: (x - EIN) / AUS };
  }
  function tick(now) {
    if (!on) return;
    var t = now - t0, dt = now - last; last = now;
    var ph = phase(t), z = Math.floor(t / ZYKLUS);
    var r = ph.ein ? R_MIN + (R_MAX - R_MIN) * ease(ph.p) : R_MAX - (R_MAX - R_MIN) * ease(ph.p);
    kreis.setAttribute("r", still ? (ph.ein ? R_MAX : R_MIN) : r.toFixed(1));
    wort.textContent = ph.ein ? "Einatmen" : "Ausatmen";
    if (gedrueckt === ph.ein) imTakt += dt;
    gesamt += dt;
    if (z > zug) {
      ringDazu(gesamt ? Math.min(1, imTakt / gesamt) : 0);
      zug = z; imTakt = 0; gesamt = 0;
      if (zug >= ZUEGE) return ende();
    }
    zahl.textContent = "Atemzug " + (zug + 1) + " von " + ZUEGE;
    raf = requestAnimationFrame(tick);
  }
  function ende() {
    on = false; cancelAnimationFrame(raf);
    svg.classList.remove("laeuft");
    kreis.setAttribute("r", R_MIN);
    wort.textContent = "Danke für Ihre Pause.";
    zahl.textContent = "";
    var summe = (parseInt(ls(KEY), 10) || 0) + ZUEGE;
    ls(KEY, String(summe));
    bilanz.hidden = false;
    bilanz.textContent = summe > ZUEGE
      ? "Ihre Baumscheibe ist bei Ihren Atempausen hier bisher um " + summe + " Ringe gewachsen."
      : "Sechs neue Ringe. Kommen Sie gern wieder, wenn Sie eine Pause brauchen.";
    btn.textContent = "Noch eine Minute"; btn.disabled = false;
  }
  function start() {
    if (on) return;
    ringe.textContent = ""; ringR = 14; zug = 0; imTakt = 0; gesamt = 0;
    on = true; svg.classList.add("laeuft");
    btn.disabled = true; btn.textContent = "Atmen …";
    var r = svg.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) svg.scrollIntoView({ block: "center", behavior: "smooth" });
    t0 = last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function an(e) { if (!on) return; if (e && e.cancelable) e.preventDefault(); gedrueckt = true; svg.classList.add("halten"); }
  function aus() { gedrueckt = false; svg.classList.remove("halten"); }
  btn.addEventListener("click", start);
  svg.addEventListener("pointerdown", an);
  window.addEventListener("pointerup", aus);
  window.addEventListener("pointercancel", aus);
  document.addEventListener("keydown", function (e) { if (on && e.code === "Space" && !e.repeat) { e.preventDefault(); an(); } });
  document.addEventListener("keyup", function (e) { if (e.code === "Space") aus(); });

  // Ausgangsbild: ein paar ruhige Ringe
  for (var i = 0; i < 3; i++) ringDazu(0.6);
  wort.textContent = "";
})();
