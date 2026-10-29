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

  let ticking = false;
  const update = () => {
    ticking = false;
    const r = track.getBoundingClientRect();
    const run = r.height - window.innerHeight;
    const raw = clamp(-r.top / run) * (n - 1);       // 0 … 4
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
  window.addEventListener("resize", onScroll);
  update();
}
