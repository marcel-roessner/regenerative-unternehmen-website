// ---------- Mobile-Navigation ----------
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("span").textContent = open ? "Schließen" : "Menü";
  });
}

// ---------- Scrollytelling: Das Modell baut sich auf ----------
const story = document.querySelector(".story");
if (story) {
  const track = story.querySelector(".story-track");
  const steps = [...story.querySelectorAll(".story-step")];
  const stations = [...story.querySelectorAll(".sv-station")];
  const bars = [...story.querySelectorAll(".story-progress span")];
  const xs = stations.map((g) => +g.querySelector("line").getAttribute("x1"));
  const n = steps.length;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  // Weiche Kurve, damit jede Stufe einen Moment „einrastet“
  const ease = (t) => { const i = Math.floor(t), f = t - i; const s = f < .25 ? 0 : f > .75 ? 1 : (f - .25) / .5; return i + s * s * (3 - 2 * s); };

  story.classList.add("is-live");
  story.style.setProperty("--steps", n);
  const stage = story.querySelector(".story-stage");
  // Bühne so hoch wie ihr Inhalt, mittig im Fenster fixiert – kein Leerraum davor/danach
  const layout = () => {
    const h = stage.offsetHeight;
    const per = Math.max(260, window.innerHeight * 0.55);   // Scrollweg pro Stufe
    stage.style.top = Math.max(0, (window.innerHeight - h) / 2) + "px";
    track.style.height = (h + per * (n - 1)) + "px";
  };
  layout();
  window.addEventListener("load", () => { layout(); update(); });

  let ticking = false;
  const update = () => {
    ticking = false;
    const r = track.getBoundingClientRect();
    const top = parseFloat(stage.style.top) || 0;
    const run = r.height - stage.offsetHeight;
    const raw = clamp((top - r.top) / run) * (n - 1);  // 0 … 4
    const pos = ease(raw);                             // eingerastet
    const active = Math.round(raw);
    const p = pos / (n - 1);                           // 0 … 1

    steps.forEach((s, i) => {
      s.classList.toggle("is-active", i === active);
      s.classList.toggle("is-past", i < active);
    });
    stations.forEach((g, i) => { g.classList.toggle("is-reached", i <= active); g.classList.toggle("is-current", i === active); });
    bars.forEach((b, i) => b.style.setProperty("--f", clamp(raw - i + 1)));

    // Marker wandert entlang der Achse
    const i0 = Math.floor(pos), i1 = Math.min(n - 1, i0 + 1), f = pos - i0;
    const x = xs[i0] + (xs[i1] - xs[i0]) * f;
    story.style.setProperty("--mx", (x - xs[0]) + "px");
    // Degeneration schrumpft bis „nachhaltig“, Regeneration wächst danach
    story.style.setProperty("--degen", clamp(pos / 2).toFixed(3));
    story.style.setProperty("--regen", clamp((pos - 2) / 2).toFixed(3));
    story.style.setProperty("--p", p.toFixed(3));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { layout(); onScroll(); });
  update();
}

// ---------- Neue Seiten beginnen immer oben ----------
// (verhindert, dass der Browser beim Öffnen eines Beitrags eine alte Scrollposition übernimmt)
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (!location.hash) {
  window.scrollTo(0, 0);
  window.addEventListener("pageshow", () => window.scrollTo(0, 0));
}

// ---------- Abbildungen vergrößern (Antippen / Klick) ----------
document.querySelectorAll("main .fig").forEach((fig) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fig-zoom-btn";
  btn.innerHTML = '<span aria-hidden="true">+</span> Vergrößern';
  fig.appendChild(btn);
  const open = () => {
    const layer = document.createElement("div");
    layer.className = "zoom-layer";
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");
    layer.setAttribute("aria-label", "Abbildung vergrößert");
    const clone = fig.cloneNode(true);
    layer.innerHTML = '<span class="zoom-hint">Wischen zum Verschieben</span><button type="button" class="zoom-close">Schließen ✕</button>';
    layer.appendChild(clone);
    document.body.appendChild(layer);
    document.documentElement.classList.add("zoom-open");
    const close = () => { layer.remove(); document.documentElement.classList.remove("zoom-open"); btn.focus(); document.removeEventListener("keydown", esc); };
    const esc = (e) => { if (e.key === "Escape") close(); };
    layer.querySelector(".zoom-close").addEventListener("click", close);
    document.addEventListener("keydown", esc);
    layer.querySelector(".zoom-close").focus();
    // mittig starten, wenn breiter als der Bildschirm
    layer.scrollLeft = (layer.scrollWidth - layer.clientWidth) / 2;
  };
  btn.addEventListener("click", (e) => { e.stopPropagation(); open(); });
  fig.addEventListener("click", (e) => { if (!e.target.closest("a, button")) open(); });
});

// ---------- Newsletter: ohne Anbieter wird eine vorausgefüllte E-Mail geöffnet ----------
document.querySelectorAll(".nl-form[data-mailto]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const mail = form.querySelector('input[type="email"]').value;
    const to = form.dataset.mailto;
    location.href = `mailto:${to}?subject=${encodeURIComponent("Newsletter-Anmeldung")}&body=${encodeURIComponent("Bitte nehmen Sie diese Adresse in den Newsletter auf: " + mail)}`;
    let done = form.querySelector(".nl-done");
    if (!done) { done = document.createElement("p"); done.className = "nl-done"; form.appendChild(done); }
    done.textContent = "Ihr E-Mail-Programm öffnet sich – bitte die vorbereitete Nachricht absenden.";
  });
});

// ---------- Blog: Themenfilter direkt auf der Seite ----------
const cardsWrap = document.querySelector("[data-filter-target]");
if (cardsWrap) {
  const chips = [...document.querySelectorAll(".topic-filter [data-filter]")];
  const cards = [...cardsWrap.querySelectorAll(".card")];
  const empty = document.querySelector(".filter-empty");
  const labelOf = (chip) => chip.firstChild.textContent.trim();
  const apply = (slug) => {
    let shown = 0;
    cards.forEach((c, i) => {
      const hit = !slug || c.dataset.tags.includes(` ${slug} `);
      c.hidden = !hit; if (hit) shown++;
      // Großes Titelbild nur in der ungefilterten Ansicht
      c.classList.toggle("card--feature", !slug && i === 0);
    });
    if (empty) empty.hidden = shown > 0;
    chips.forEach((ch) => {
      const on = ch.dataset.filter === slug;
      if (on) ch.setAttribute("aria-current", "page"); else ch.removeAttribute("aria-current");
      const x = ch.querySelector(".x"); if (x) x.remove();
      if (on && slug) ch.insertAdjacentHTML("beforeend", ' <span class="x" aria-hidden="true">✕</span>');
    });
    history.replaceState(null, "", slug ? `#${slug}` : location.pathname);
  };
  chips.forEach((ch) => ch.addEventListener("click", (e) => {
    e.preventDefault();
    const slug = ch.dataset.filter;
    const current = (location.hash || "").slice(1);
    apply(slug && slug === current ? "" : slug);   // aktiven Filter erneut antippen = alle zeigen
  }));
  if (location.hash) apply(location.hash.slice(1));
}
