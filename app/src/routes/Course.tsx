import { Link } from "react-router-dom";
import { COURSE, DAS, MCCLAVE, TOTAL_POINTS, WEEKS, dueDate } from "../data/course";
import { TERM_START } from "../data/sessions";
import { moduleById } from "../data/modules";
import { daysUntil, todayISO } from "../lib/store";
import { IconChevronRight } from "../components/Icons";

export default function Course() {
  const today = todayISO();
  const termDays = daysUntil(TERM_START);
  const started = termDays <= 0;

  return (
    <>
      <div className="eyebrow">{COURSE.code} · {COURSE.section} · {COURSE.format}</div>
      <h2 className="h-section" style={{ margin: "0 0 .4rem" }}>{COURSE.title}</h2>
      <p className="small muted" style={{ marginTop: 0 }}>
        Transcribed from the official syllabus. Instructor <strong>{COURSE.instructor.name}</strong> ·{" "}
        <a href={`mailto:${COURSE.instructor.email}`}>{COURSE.instructor.email}</a> · office hours {COURSE.instructor.officeHours}.
      </p>

      <div className="card" style={{ borderColor: "var(--brass-edge)" }}>
        <div className="rowline">
          <strong className="small">Term dates — projected</strong>
          <span className="pill brass">assumption</span>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          The syllabus document is the First-Bi-Term section (due dates Aug 30 – Oct 14) and notes that
          faculty set specific dates. Your term is Oct 19 – Dec 11, so every date below is computed from
          an <strong>Oct 19</strong> start. Confirm in iLearn once the course opens; deadlines are Eastern
          Time and <strong>late work is not accepted</strong>.
        </p>
      </div>

      <h2 className="h-section">The eight weeks</h2>
      {WEEKS.map((w) => {
        const due = dueDate(TERM_START, w);
        const d = daysUntil(due);
        const pts = w.deliverables.reduce((a, x) => a + x.points, 0);
        const isCurrent = started && due >= today && (w.week === 1 || dueDate(TERM_START, WEEKS[w.week - 2]) < today);
        return (
          <div key={w.week} className={`card${isCurrent ? " continue" : ""}`} style={{ display: "block" }}>
            <div className="rowline" style={{ alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ margin: 0 }}>Week {w.week}{w.short ? " · short week" : ""}</div>
                <div style={{ fontFamily: "var(--display)", fontSize: "1.05rem", fontWeight: 600, letterSpacing: "-.012em", marginTop: ".15rem" }}>
                  {w.mcclave.map((c) => MCCLAVE[c]).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="sessdate">due {new Date(due + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                <div className="tiny faint num">{d > 0 ? `in ${d} days` : d === 0 ? "today" : `${-d} days ago`} · {pts} pts</div>
              </div>
            </div>

            <div className="course-cols">
              <div>
                <div className="pop-label" style={{ padding: 0, marginBottom: ".3rem" }}>Read</div>
                <ul className="readlist">
                  {w.mcclave.map((c) => <li key={`m${c}`}><span className="pill stats">McClave ch {c}</span> {MCCLAVE[c]}</li>)}
                  {w.das.map((c) => <li key={`d${c}`}><span className="pill">Das ch {c}</span> {DAS[c]}</li>)}
                </ul>
              </div>
              <div>
                <div className="pop-label" style={{ padding: 0, marginBottom: ".3rem" }}>Submit</div>
                <ul className="readlist">
                  {w.deliverables.map((x) => <li key={x.name}><strong>{x.name}</strong> <span className="faint">· {x.points} pts</span></li>)}
                </ul>
              </div>
            </div>

            {w.prep.length > 0 && (
              <div style={{ marginTop: ".7rem" }}>
                <div className="pop-label" style={{ padding: 0, marginBottom: ".3rem" }}>Prepare in the portal</div>
                <div className="chips" style={{ marginBottom: 0 }}>
                  {w.prep.map((id) => {
                    const m = moduleById(id);
                    return m
                      ? <Link key={id} to={`/learn/${id}`} className="chip">{m.title} <IconChevronRight style={{ width: 13, height: 13 }} /></Link>
                      : <span key={id} className="chip" style={{ opacity: .5 }}>{id}</span>;
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <h2 className="h-section">How the grade is built</h2>
      <div className="chartgrid">
        <figure className="chart">
          <figcaption className="chart-head"><div><h3>{TOTAL_POINTS} points</h3></div></figcaption>
          <div className="hbars">
            {COURSE.grading.map((g) => {
              const total = g.qty * g.each;
              return (
                <div className="hbar" key={g.item}>
                  <span className="hbar-label" style={{ fontSize: ".74rem" }}>{g.item}</span>
                  <span className="hbar-track"><span className="hbar-fill" style={{ width: `${(total / TOTAL_POINTS) * 100}%` }} /></span>
                  <span className="hbar-val num">{total}<span className="faint tiny"> · {g.qty}×{g.each}</span></span>
                </div>
              );
            })}
          </div>
          <p className="tiny faint" style={{ marginBottom: 0, marginTop: ".7rem" }}>
            The two-part case study and three projects are 52% of the grade. Scale: {COURSE.scale.map(([g, r]) => `${g} ${r}`).join(" · ")}.
          </p>
        </figure>

        <figure className="chart">
          <figcaption className="chart-head"><div><h3>Required texts</h3></div></figcaption>
          {COURSE.texts.map((t) => (
            <div key={t.isbn} style={{ marginBottom: ".9rem" }}>
              <div className="small" style={{ fontWeight: 650 }}>{t.url ? <a href={t.url} target="_blank" rel="noreferrer">{t.title}</a> : t.title}</div>
              <div className="tiny faint">{t.authors} · {t.publisher} · ISBN {t.isbn}</div>
              <div className="small muted" style={{ marginTop: ".25rem" }}>{t.note}</div>
            </div>
          ))}
        </figure>
      </div>

      <h2 className="h-section">Course objectives</h2>
      <div className="card">
        <ol className="readlist" style={{ paddingLeft: "1.1rem" }}>
          {COURSE.objectives.map((o, i) => <li key={i} className="small" style={{ marginBottom: ".4rem" }}>{o}</li>)}
        </ol>
        <p className="tiny faint" style={{ marginBottom: 0 }}>{COURSE.timezoneNote}</p>
      </div>
    </>
  );
}
