// Konvertiert Bilder aus einem Quellordner in Web-optimierte WebP-Dateien.
// Nutzung: node scripts/optimize-images.mjs <quellordner> [zielordner]
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const [src = "raw-images", out = "src/assets/img"] = process.argv.slice(2);
await mkdir(out, { recursive: true });
for (const f of await readdir(src)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const name = f.replace(/~mv2/, "").replace(/\.(jpe?g|png|webp)$/i, "");
  const img = sharp(path.join(src, f)).rotate();
  await img.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(out, `${name}.webp`));
  await img.clone().resize({ width: 720, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(out, `${name}-720.webp`));
  console.log("✓", name);
}
