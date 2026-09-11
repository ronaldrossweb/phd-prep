import type { ReactNode } from "react";

/**
 * Minimal inline formatter for our own content: **bold**, `code`, and
 * ```fenced blocks```. Deliberately tiny — the content is authored by us, so
 * there is no untrusted input to sanitise and no need for a markdown library.
 *
 * `math: true` renders inline `code` spans in the serif math face instead of
 * the monospace one. A sigma set in Georgia reads as mathematics; the same
 * sigma set in JetBrains Mono reads as a string literal.
 */
export function fmt(text: string, keyPrefix = "f", opts: { math?: boolean } = {}): ReactNode[] {
  const out: ReactNode[] = [];
  const fence = text.split(/```(?:bash|python|ts)?\n?/);

  fence.forEach((chunk, fi) => {
    // Odd indices are fenced code blocks — always monospace.
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
        const inner = p.slice(1, -1);
        out.push(
          opts.math
            ? <span className="math" key={k}>{inner}</span>
            : <code key={k}>{inner}</code>,
        );
      } else if (p) {
        out.push(<span key={k}>{p}</span>);
      }
    });
  });

  return out;
}
