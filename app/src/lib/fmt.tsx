import type { ReactNode } from "react";

/**
 * Minimal inline formatter for card text: **bold**, `code`, and ```fenced blocks```.
 * Deliberately tiny -- the content is ours, so there is no untrusted input to sanitise
 * and no need for a markdown dependency.
 */
export function fmt(text: string, keyPrefix = "f"): ReactNode[] {
  const out: ReactNode[] = [];
  const fence = text.split(/```(?:bash|python|ts)?\n?/);

  fence.forEach((chunk, fi) => {
    if (fi % 2 === 1) {
      out.push(
        <pre key={`${keyPrefix}-pre-${fi}`}>
          <code>{chunk.replace(/\n$/, "")}</code>
        </pre>,
      );
      return;
    }
    const parts = chunk.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    parts.forEach((p, i) => {
      const k = `${keyPrefix}-${fi}-${i}`;
      if (p.startsWith("**") && p.endsWith("**")) {
        out.push(<strong key={k}>{p.slice(2, -2)}</strong>);
      } else if (p.startsWith("`") && p.endsWith("`") && p.length > 2) {
        out.push(<code key={k}>{p.slice(1, -1)}</code>);
      } else if (p) {
        out.push(<span key={k}>{p}</span>);
      }
    });
  });

  return out;
}
