import { readFileSync } from "node:fs";

const slug = (t) =>
  t.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Gruppiert die Glossar-Begriffe alphabetisch (Ä/Ö/Ü zählen zu A/O/U)
export default function () {
  const { terms } = JSON.parse(readFileSync(new URL("./glossar.json", import.meta.url), "utf8"));
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term, "de"));
  const bySlug = new Map(sorted.map((t) => [t.term, slug(t.term)]));
  const groups = new Map();
  for (const t of sorted) {
    const letter = t.term[0].normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push({
      ...t,
      slug: slug(t.term),
      relatedLinks: (t.related || []).filter((r) => bySlug.has(r)).map((r) => ({ term: r, slug: bySlug.get(r) })),
    });
  }
  return { letters: [...groups.keys()], groups: [...groups].map(([letter, list]) => ({ letter, terms: list })), all: sorted.map((t) => ({ ...t, slug: slug(t.term) })) };
}
