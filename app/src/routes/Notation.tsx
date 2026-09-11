import { useMemo, useState } from "react";
import { NOTATION } from "../data/notation";
import { fmt } from "../lib/fmt";
import { IconEmptySet, IconSearch } from "../components/Icons";

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
      <h2 className="h-section">Notation decoder</h2>
      <p className="small muted" style={{ marginTop: "-.35rem" }}>
        When a lecture stops you, it is usually a symbol rather than the concept. Look it up, say the
        reading aloud, carry on. Keep this open during your 730 lectures.
      </p>

      <div className="searchwrap">
        <IconSearch />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a symbol or a word…"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {groups.length === 0 && (
        <div className="empty">
          <span className="glyph"><IconEmptySet /></span>
          <h3>Nothing matches</h3>
          <p>No entry contains “{q}”.</p>
        </div>
      )}

      {groups.map(([section, entries]) => (
        <div key={section}>
          <div className="eyebrow" style={{ marginTop: "1.6rem" }}>{section}</div>
          <div className="card card-tight">
            {entries.map((e) => (
              <div key={e.symbol} className="notation-item">
                <div>
                  <div className="notation-sym">{e.symbol}</div>
                  {e.readAloud && <div className="notation-read">{e.readAloud}</div>}
                </div>
                <div className="small">{fmt(e.meaning, e.symbol, { math: true })}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="tiny faint center" style={{ marginTop: "1.8rem" }}>
        {NOTATION.length} entries, generated from 00-notation-cheatsheet.md
      </p>
    </>
  );
}
