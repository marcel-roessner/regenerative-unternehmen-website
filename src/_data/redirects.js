// Alte Wix-URLs → neue Adressen (GitHub Pages kann keine Server-Redirects,
// daher kleine HTML-Seiten mit Meta-Refresh und Canonical-Link).
import { readdirSync, readFileSync } from "node:fs";

const list = [
  { from: "/kopie-von-impressum/", to: "/datenschutz/" },
  { from: "/shop/", to: "/category/produkte/" },
  { from: "/post/die-neue-sau-im-dorf-warum-regeneratives-wirtschaften-so-wichtig-ist/", to: "/post/die-neue-sau-im-dorf-warum-die-idee-die-von-regeneration-so-wichtig-ist/" },
];

// Beiträge, deren alte Adresse Umlaute enthielt
for (const f of readdirSync("src/posts")) {
  if (!f.endsWith(".md")) continue;
  const src = readFileSync(`src/posts/${f}`, "utf8");
  const legacy = src.match(/^legacy: "(.+)"$/m)?.[1];
  const permalink = src.match(/^permalink: "(.+)"$/m)?.[1];
  if (legacy && permalink) list.push({ from: `/post/${legacy}/`, to: permalink });
}
export default list;
