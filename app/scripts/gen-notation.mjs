/**
 * Generate src/data/notation.ts from ~/PhD/00-notation-cheatsheet.md
 *
 * The markdown cheat-sheet is the single source of truth for the notation decoder.
 * Run after editing it:   node scripts/gen-notation.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const SRC = join(homedir(), "PhD", "00-notation-cheatsheet.md");
const OUT = join(import.meta.dirname, "..", "src", "data", "notation.ts");

const md = readFileSync(SRC, "utf8");

const strip = (s) =>
  s.trim()
    .replace(/^`|`$/g, "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\\\|/g, "|")
    .replace(/\\_/g, "_")
    .trim();

let section = "";
const entries = [];
const seen = new Set();

for (const raw of md.split("\n")) {
  const line = raw.trim();

  if (line.startsWith("## ")) {
    section = line.replace(/^##\s*/, "").replace(/\s*—.*$/, "").trim();
    continue;
  }
  if (!line.startsWith("|")) continue;
  if (/^\|[\s:|-]+\|$/.test(line)) continue;           // separator row

  const cells = line.split("|").slice(1, -1).map((c) => c.trim());
  if (cells.length < 2) continue;

  const first = strip(cells[0]);
  if (!first || /^(symbol|term|row|column|expression|if you need|use|metric|pattern|\s*)$/i.test(first)) continue;

  // 3-column form: symbol | read aloud | meaning
  // 2-column form: term | meaning
  const hasReadAloud = cells.length >= 3 && !/^—$/.test(strip(cells[1]));
  const readAloud = hasReadAloud ? strip(cells[1]) : "";
  const meaning = strip(cells[cells.length - 1]);

  if (!meaning || meaning === "—") continue;

  const key = first.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);

  entries.push({ symbol: first, readAloud, meaning, section });
}

const banner = `// AUTO-GENERATED from ~/PhD/00-notation-cheatsheet.md -- do not edit by hand.
// Regenerate:  node scripts/gen-notation.mjs
`;

writeFileSync(
  OUT,
  banner +
    `
export type NotationEntry = {
  symbol: string;
  readAloud: string;
  meaning: string;
  section: string;
};

export const NOTATION: NotationEntry[] = ${JSON.stringify(entries, null, 2)};
`,
);

console.log(`wrote ${entries.length} notation entries -> src/data/notation.ts`);
const bySection = entries.reduce((a, e) => ((a[e.section] = (a[e.section] || 0) + 1), a), {});
for (const [s, n] of Object.entries(bySection)) console.log(`  ${n.toString().padStart(3)}  ${s}`);
