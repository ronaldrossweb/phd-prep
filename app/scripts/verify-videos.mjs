/**
 * Verify YouTube ids against the oEmbed endpoint. Prints title/author for each,
 * exits non-zero if any id fails. Run before deploying lesson content.
 *   node scripts/verify-videos.mjs                # ids from src/data/modules/*.ts
 *   node scripts/verify-videos.mjs ID1 ID2 ...    # explicit ids
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

let ids = process.argv.slice(2);
if (!ids.length) {
  const dir = join(import.meta.dirname, "..", "src", "data", "modules");
  const src = readdirSync(dir).filter((f) => f.endsWith(".ts")).map((f) => readFileSync(join(dir, f), "utf8")).join("\n");
  ids = [...new Set([...src.matchAll(/youtubeId:\s*"([A-Za-z0-9_-]{11})"/g)].map((m) => m[1]))];
}

let bad = 0;
for (const id of ids) {
  const u = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const r = await fetch(u);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    console.log(`  ok   ${id}  ${j.title}  — ${j.author_name}`);
  } catch (e) {
    bad++; console.log(`  FAIL ${id}  ${e.message}`);
  }
}
console.log(bad ? `\n${bad} failed` : `\nall ${ids.length} verified`);
process.exit(bad ? 1 : 0);
