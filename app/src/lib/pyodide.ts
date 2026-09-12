/**
 * In-browser Python via Pyodide (WebAssembly). Loaded once, lazily, on the
 * first lesson that needs it; then instant. The scientific stack is fetched
 * from jsDelivr and cached by the service worker.
 *
 * Datasets from the notebooks are written into the virtual filesystem under
 * /data so lessons can `pd.read_csv("data/lending.csv")` exactly as the
 * notebooks do.
 */
const PYODIDE_VERSION = "314.0.6";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// Minimal typing for what we use of the Pyodide API.
type PyodideAPI = {
  runPythonAsync(code: string): Promise<unknown>;
  loadPackage(names: string | string[]): Promise<void>;
  setStdout(o: { batched: (s: string) => void }): void;
  setStderr(o: { batched: (s: string) => void }): void;
  FS: { mkdirTree(p: string): void; writeFile(p: string, d: Uint8Array | string): void; analyzePath(p: string): { exists: boolean } };
  globals: { get(name: string): unknown; set(name: string, v: unknown): void };
};

declare global {
  interface Window { loadPyodide?: (o: { indexURL: string }) => Promise<PyodideAPI>; }
}

export type RunResult = {
  stdout: string;
  stderr: string;
  error: string | null;
  figures: string[];      // data: URLs of matplotlib figures
  ms: number;
};

export type LoadPhase = "idle" | "script" | "runtime" | "packages" | "data" | "ready" | "failed";

let instance: PyodideAPI | null = null;
let loading: Promise<PyodideAPI> | null = null;
const listeners = new Set<(p: LoadPhase, detail?: string) => void>();

export function onLoadPhase(fn: (p: LoadPhase, detail?: string) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
function phase(p: LoadPhase, detail?: string) { for (const fn of listeners) fn(p, detail); }

const DATA_FILES = ["branch_deposits.csv", "lending.csv", "fraud_alerts.csv", "ab_test.csv"];

const PRELUDE = `
import sys, io, base64, warnings
warnings.filterwarnings("ignore")
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("AGG")
import matplotlib.pyplot as plt
plt.rcParams.update({"figure.figsize": (7, 3.6), "figure.dpi": 110, "axes.grid": True,
                     "grid.alpha": .25, "axes.spines.top": False, "axes.spines.right": False})
rng = np.random.default_rng(42)

def _phd_collect_figures():
    out = []
    for num in plt.get_fignums():
        fig = plt.figure(num)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", bbox_inches="tight", facecolor="white")
        out.append("data:image/png;base64," + base64.b64encode(buf.getvalue()).decode())
    plt.close("all")
    return out
`;

function injectScript(): Promise<void> {
  if (window.loadPyodide) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CDN + "pyodide.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load the Python runtime script"));
    document.head.appendChild(s);
  });
}

export function getPyodide(): Promise<PyodideAPI> {
  if (instance) return Promise.resolve(instance);
  if (loading) return loading;
  loading = (async () => {
    phase("script");
    await injectScript();
    phase("runtime");
    const py = await window.loadPyodide!({ indexURL: CDN });
    phase("packages", "numpy · pandas · matplotlib");
    await py.loadPackage(["numpy", "pandas", "matplotlib"]);
    phase("data");
    py.FS.mkdirTree("/home/pyodide/data");
    const base = import.meta.env.BASE_URL;
    await Promise.all(DATA_FILES.map(async (f) => {
      const r = await fetch(`${base}data/${f}`);
      const buf = new Uint8Array(await r.arrayBuffer());
      py.FS.writeFile(`/home/pyodide/data/${f}`, buf);
    }));
    await py.runPythonAsync(PRELUDE);
    instance = py;
    phase("ready");
    return py;
  })().catch((e) => { loading = null; phase("failed", String(e)); throw e; });
  return loading;
}

/** Lazily add heavier packages when a lesson needs them. */
export async function ensurePackages(names: string[]) {
  const py = await getPyodide();
  await py.loadPackage(names);
}

/**
 * `lineOffset` is the number of hidden setup lines prepended to the learner's
 * code, so reported line numbers match what they see in the editor.
 */
export async function runPython(code: string, lineOffset = 0): Promise<RunResult> {
  const py = await getPyodide();
  let stdout = "", stderr = "";
  py.setStdout({ batched: (s) => { stdout += s + "\n"; } });
  py.setStderr({ batched: (s) => { stderr += s + "\n"; } });
  const t0 = performance.now();
  let error: string | null = null;
  try {
    await py.runPythonAsync(code);
  } catch (e) {
    error = tidyTraceback(String((e as Error).message ?? e), lineOffset);
  }
  let figures: string[] = [];
  try {
    const figs = await py.runPythonAsync("_phd_collect_figures()");
    figures = (figs as { toJs?: () => string[] })?.toJs?.() ?? (Array.isArray(figs) ? figs : []);
  } catch { /* no figures */ }
  return { stdout: stdout.trimEnd(), stderr: stderr.trimEnd(), error, figures, ms: Math.round(performance.now() - t0) };
}

/** Run a checker expression that must evaluate truthy; returns a message. */
export async function checkPython(check: string): Promise<{ ok: boolean; message: string }> {
  const py = await getPyodide();
  try {
    const res = await py.runPythonAsync(`
_phd_ok, _phd_msg = True, ""
try:
${check.split("\n").map((l) => "    " + l).join("\n")}
except AssertionError as _e:
    _phd_ok, _phd_msg = False, (str(_e) or "An assertion failed.")
except Exception as _e:
    _phd_ok, _phd_msg = False, f"{type(_e).__name__}: {_e}"
(_phd_ok, _phd_msg)
`);
    const pair = (res as { toJs?: () => [boolean, string] })?.toJs?.() ?? (res as [boolean, string]);
    return { ok: Boolean(pair[0]), message: String(pair[1] ?? "") };
  } catch (e) {
    return { ok: false, message: tidyTraceback(String((e as Error).message ?? e)) };
  }
}

/** Trim Pyodide's traceback down to the part a learner can act on. */
function tidyTraceback(s: string, lineOffset = 0): string {
  const lines = s.trim().split("\n");
  let last = lines[lines.length - 1] ?? s;
  // A `...` placeholder left in the starter code produces an Ellipsis error;
  // say so in plain words instead of quoting the dunder method.
  if (/ellipsis/i.test(last)) last = "There is still a `...` placeholder to fill in.";
  const where = [...lines].reverse().find((l) => /File "<exec>", line \d+/.test(l));
  const m = where?.match(/line (\d+)/);
  if (!m) return last;
  const n = Number(m[1]) - lineOffset;
  return n >= 1 ? `Line ${n}: ${last}` : last;
}
