/**
 * Theme preference: "system" follows the OS; "light" / "dark" override it.
 * The choice is stored in localStorage and applied as `data-theme` on <html>.
 * index.html applies it inline before first paint so there is never a flash.
 */
export type Theme = "system" | "light" | "dark";
const KEY = "phd-prep-theme";

export function getTheme(): Theme {
  try { const t = localStorage.getItem(KEY); return t === "light" || t === "dark" ? t : "system"; }
  catch { return "system"; }
}

export function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", t);
  // Keep the browser chrome (address bar) in step.
  const dark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? "#0A0C12" : "#FBFAF7"));
}

export function setTheme(t: Theme) {
  try { t === "system" ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, t); } catch { /* ignore */ }
  applyTheme(t);
}

/** Effective mode right now, for icons. */
export function isDarkNow(): boolean {
  const t = getTheme();
  return t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}
