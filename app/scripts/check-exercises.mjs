// Runs every exercise's solution + check (with its module setup and the
// solutions of earlier exercises replayed, exactly as the portal does) in the
// local venv Python. Usage: node scripts/check-exercises.mjs [moduleIdPrefix]
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const { build } = await import("vite");
await build({ configFile: false, logLevel: "silent", build: { lib: { entry: "src/data/modules.ts", formats: ["es"], fileName: () => "modules-bundle.mjs" }, outDir: "node_modules/.cache", emptyOutDir: false, minify: false } });
const { ALL_MODULES } = await import(pathToFileURL("node_modules/.cache/modules-bundle.mjs").href);
const prefix = process.argv[2] ?? "";
const py = join(process.env.HOME, "PhD/.venv/bin/python");
const dir = mkdtempSync(join(tmpdir(), "exq-"));
let pass = 0, fail = 0;
for (const m of ALL_MODULES.filter((m) => m.id.startsWith(prefix))) {
  const prior = [];
  for (const ex of m.exercises) {
    const program = [
      "import matplotlib; matplotlib.use('Agg')",
      "import matplotlib.pyplot as _plt; _plt.show = lambda *a, **k: None",
      m.setup ?? "", ...prior,

      ex.solution, ex.check,
    ].join("\n");
    // exercises whose starter declares the answer inline (dict/tour) need the solution to win:
    const file = join(dir, `${m.id}-${ex.id}.py`);
    writeFileSync(file, program);
    try {
      execFileSync(py, [file], { cwd: "public", stdio: ["ignore", "ignore", "pipe"], timeout: 120000 });
      pass++;
    } catch (e) {
      fail++;
      console.log(`FAIL ${m.id} / ${ex.id}\n${String(e.stderr).trim() || e.message}`);
    }
    prior.push(ex.solution);
  }
}
console.log(`${pass} passed, ${fail} failed`);
