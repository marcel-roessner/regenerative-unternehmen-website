// ==========================================================================
// Regenerative Unternehmen – die Seite wächst beim Scrollen.
//  1. Papierfarbe wandert von Sand zu Moos
//  2. Jahresringe wachsen (Hero + kleines Emblem unten rechts = Lesefortschritt)
//  3. Überschriften gewinnen an Gewicht, sobald sie ins Bild kommen
//  4. Kapitelnummern füllen sich, Linien wachsen, Listen keimen nacheinander
// ==========================================================================

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

const root = document.documentElement;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// ---------- 1. Farbverlauf der Seite (Sand → Moos) ----------
const stops = {
  paper:  [hex("#f1ede3"), hex("#eeeddf"), hex("#e6ebdc")],
  paper2: [hex("#e8e2d4"), hex("#e3e3d2"), hex("#d9e1cd")],
};
const mix = (arr, t) => {
  const seg = t < 0.5 ? 0 : 1;
  const k = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
  const [a, b] = [arr[seg], arr[seg + 1]];
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(" ")})`;
};

// ---------- 2. Jahresringe ----------
const heroSvg = document.querySelector(".hero-art .rings");
let emblem = null;
if (heroSvg || document.body) {
  // Emblem aus dem Hero klonen bzw. auf Unterseiten frisch erzeugen
  const tpl = document.getElementById("rings-template");
  const src = heroSvg || (tpl && tpl.content.querySelector(".rings"));
  if (src) {
    emblem = document.createElement("button");
    emblem.className = "emblem";
    emblem.type = "button";
    emblem.setAttribute("aria-label", "Nach oben");
    const clone = src.cloneNode(true);
    clone.classList.add("rings--emblem");
    emblem.appendChild(clone);
    const pct = document.createElement("span");
    pct.className = "emblem-pct";
    emblem.appendChild(pct);
    document.body.appendChild(emblem);
    emblem.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
}
const ringSets = [...document.querySelectorAll(".rings")].map((svg) =>
  [...svg.querySelectorAll(".ring")]
);
const growRings = (rings, t) => {
  const n = rings.length;
  rings.forEach((r, i) => {
    // innere Ringe zuerst; jeder Ring zeichnet sich nacheinander
    const local = clamp(t * (n + 2) - i);
    r.style.strokeDashoffset = String(1 - local);
    r.style.opacity = local > 0 ? "" : "0";
  });
};

// ---------- 3./4. Elemente, die mit ihrer Position wachsen ----------
const heads = [...document.querySelectorAll(".h2, .page-head .display, .article-head .display")];
const nums = [...document.querySelectorAll(".split > .side .num")];
const lines = [...document.querySelectorAll(".offer, .postlist, .principles, .specs, .pager")];
const seeds = [...document.querySelectorAll(".principles li, .offer article, .postlist li, .person, .card")];

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let ticking = false;

function frame() {
  ticking = false;
  const vh = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const p = clamp(window.scrollY / max);

  root.style.setProperty("--paper", mix(stops.paper, p));
  root.style.setProperty("--paper-2", mix(stops.paper2, p));
  root.style.setProperty("--grow", p.toFixed(4));

  // Hero-Ringe: starten mit dem Kern, wachsen über die erste Hälfte der Seite voll aus
  if (ringSets[0] && heroSvg) growRings(ringSets[0], 0.25 + p * 1.5);
  // Emblem: zeigt den Fortschritt über die ganze Seite
  if (emblem) {
    growRings(ringSets[ringSets.length - 1], p);
    emblem.classList.toggle("is-visible", window.scrollY > vh * 0.6);
    emblem.classList.toggle("is-complete", p > 0.985);
    emblem.querySelector(".emblem-pct").textContent = Math.round(p * 100) + "%";
  }

  for (const el of heads) {
    const r = el.getBoundingClientRect();
    const t = clamp((vh - r.top) / (vh * 0.55));
    el.style.fontWeight = String(Math.round(lerp(200, 380, t)));
  }
  for (const el of nums) {
    const r = el.getBoundingClientRect();
    el.classList.toggle("is-full", r.top < vh * 0.55);
  }
  for (const el of lines) {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--line", clamp((vh - r.top) / (vh * 0.5)).toFixed(3));
  }
  for (const el of seeds) {
    if (el.classList.contains("is-in")) continue;
    if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("is-in");
  }
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
root.classList.add("evolve");
if (reduce) root.classList.add("calm");
frame();

// gestaffeltes Keimen innerhalb einer Gruppe
document.querySelectorAll(".principles, .offer, .postlist, .team, .cards").forEach((g) =>
  [...g.children].forEach((c, i) => c.style.setProperty("--i", i))
);
