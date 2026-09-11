import { useMemo, useState } from "react";
import { NOTATION } from "../data/notation";
import { fmt } from "../lib/fmt";

export default function Notation() {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const hits = needle
      ? NOTATION.filter(
          (e) =>
            e.symbol.toLowerCase().includes(needle) ||
            e.readAloud.toLowerCase().includes(needle) ||
            e.meaning.toLowerCase().includes(needle),
        )
      : NOTATION;

    const m = new Map<string, typeof NOTATION>();
    for (const e of hits) {
      if (!m.has(e.section)) m.set(e.section, []);
      m.get(e.section)!.push(e);
    }
    return [...m.entries()];
  }, [q]);

  return (
    <>
      <h2>Notation decoder</h2>
      <p className="small muted">
        When a lecture stops you, the problem is usually a symbol, not the concept. Look it up, say the
        reading aloud, and carry on. Keep this open during your 730 lectures.
      </p>

      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a symbol or a word…"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        style={{ marginBottom: "1rem" }}
      />

      {groups.length === 0 && (
        <div className="empty">
          <span className="glyph">∅</span>
          <p className="small">Nothing matches “{q}”.</p>
        </div>
      )}

      {groups.map(([section, entries]) => (
        <div key={section}>
          <h3 style={{ marginTop: "1.3rem", color: "var(--muted)" }}>{section}</h3>
          <div className="card card-tight">
            {entries.map((e) => (
              <div key={e.symbol} className="notation-item">
                <div>
                  <div className="notation-sym">{e.symbol}</div>
                  {e.readAloud && <div className="notation-read">{e.readAloud}</div>}
                </div>
                <div className="small">{fmt(e.meaning, e.symbol)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="tiny faint center" style={{ marginTop: "1.5rem" }}>
        {NOTATION.length} entries · generated from ~/PhD/00-notation-cheatsheet.md
      </p>
    </>
  );
}
