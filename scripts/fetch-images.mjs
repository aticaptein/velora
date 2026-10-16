// VELORA image pipeline
// Searches Wikimedia Commons for freely licensed (CC0 / PD / CC BY / CC BY-SA) landscape photos,
// downloads one ~2000px source per slot, converts to responsive WebP (480/960/1600) and writes
// src/data/credits.json for on-site attribution. Run once: `npm run images`.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/img");
const CREDITS = path.resolve("src/data/credits.json");
const UA = "VeloraDemo/1.0 (local portfolio demo; contact: none)";
const WIDTHS = [480, 960, 1600];
const ALLOWED = /^(cc0|public domain|pd|cc by(-sa)? ?\d(\.\d)?)/i;

// slot -> search terms (first that yields a valid result wins). `pick` skips n results.
const SLOTS = JSON.parse(await fs.readFile(path.resolve("scripts/image-slots.json"), "utf8"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (html = "") => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function search(term) {
  const params = new URLSearchParams({
    action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrlimit: "30",
    gsrsearch: `${term} filetype:bitmap`, prop: "imageinfo",
    iiprop: "url|size|extmetadata|mime", iiurlwidth: "2000", origin: "*",
  });
  let res;
  for (let attempt = 0; attempt < 5; attempt++) {
    res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { "User-Agent": UA } });
    if (res.status !== 429) break;
    await sleep(4000 * 2 ** attempt);
  }
  if (!res.ok) throw new Error(`search ${res.status}`);
  const json = await res.json();
  const pages = Object.values(json.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  return pages
    .map((p) => ({ title: p.title, ...p.imageinfo?.[0] }))
    .filter((i) => i.mime === "image/jpeg" && i.width >= 2000 && i.width / i.height >= 1.25 && i.width / i.height <= 2.1)
    .filter((i) => ALLOWED.test(i.extmetadata?.LicenseShortName?.value ?? ""));
}

const used = new Set();
const credits = {};
try { Object.assign(credits, JSON.parse(await fs.readFile(CREDITS, "utf8"))); } catch {}
await fs.mkdir(OUT, { recursive: true });

for (const [slot, cfg] of Object.entries(SLOTS)) {
  if (credits[slot] && !process.argv.includes(`--redo=${slot}`) && !process.argv.includes("--all")) {
    used.add(credits[slot].title);
    continue;
  }
  let chosen = null;
  for (const term of cfg.q) {
    try {
      const results = (await search(term)).filter((r) => !used.has(r.title));
      chosen = results[cfg.pick ?? 0] ?? results[0];
    } catch (e) { console.warn(slot, term, e.message); }
    if (chosen) break;
    await sleep(400);
  }
  if (!chosen) { console.warn(`!! no image for ${slot}`); continue; }
  used.add(chosen.title);
  let img;
  for (let attempt = 0; attempt < 5; attempt++) {
    img = await fetch(chosen.thumburl, { headers: { "User-Agent": UA } });
    if (img.status !== 429) break;
    await sleep(4000 * 2 ** attempt);
  }
  if (!img.ok) { console.warn(`!! download failed ${slot} ${img.status}`); continue; }
  const buf = Buffer.from(await img.arrayBuffer());
  for (const w of WIDTHS) {
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 1000 ? 72 : 70 })
      .toFile(path.join(OUT, `${slot}-${w}.webp`));
  }
  const meta = await sharp(path.join(OUT, `${slot}-1600.webp`)).metadata();
  const m = chosen.extmetadata;
  credits[slot] = {
    title: chosen.title,
    author: strip(m.Artist?.value) || "Unknown",
    license: m.LicenseShortName?.value,
    licenseUrl: m.LicenseUrl?.value ?? "",
    source: chosen.descriptionurl,
    ratio: +(meta.width / meta.height).toFixed(3),
  };
  console.log(`ok ${slot.padEnd(18)} ${credits[slot].license.padEnd(14)} ${chosen.title}`);
  await sleep(1500);
}

await fs.writeFile(CREDITS, JSON.stringify(credits, null, 2));
console.log(`\n${Object.keys(credits).length} images credited`);
