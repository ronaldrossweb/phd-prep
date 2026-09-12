import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";

import { CARDS } from "./data/cards";
import { SESSIONS, TERM_START } from "./data/sessions";
import { isDue, type Grade, grade as gradeCard } from "./lib/srs";
import {
  cardState, daysUntil, load, MAX_REVIEWS, save,
  type Progress, type ReviewEvent, todayISO,
} from "./lib/store";
import { type CloudStatus, pullCloud, pushCloudDebounced } from "./lib/cloud";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import SignIn from "./routes/SignIn";
import { getTutorKey } from "./lib/tutorClient";

import { Brand } from "./components/Logo";
import {
  IconBars, IconBook, IconLayers, IconRows, IconSigma, IconSpark, IconSunrise,
} from "./components/Icons";

import Dashboard from "./routes/Dashboard";
import SessionView from "./routes/Session";
import Cards from "./routes/Cards";
import Notation from "./routes/Notation";
import Tutor from "./routes/Tutor";
import ProgressView from "./routes/Progress";
import Learn from "./routes/Learn";

type Ctx = {
  progress: Progress;
  dueCount: number;
  sync: CloudStatus;
  tutorReady: boolean;
  session: Session | null;
  refreshTutor: () => void;
  gradeOne: (cardId: string, g: Grade) => void;
  toggleBlock: (key: string) => void;
  toggleSession: (n: number) => void;
  reload: () => void;
};

const StudyCtx = createContext<Ctx | null>(null);

export function useStudy(): Ctx {
  const c = useContext(StudyCtx);
  if (!c) throw new Error("useStudy outside provider");
  return c;
}

/** The session whose date is today, else the next upcoming, else the last. */
export function currentSession() {
  const today = todayISO();
  return (
    SESSIONS.find((s) => s.date === today) ??
    SESSIONS.find((s) => s.date > today) ??
    SESSIONS[SESSIONS.length - 1]
  );
}

/** Cards unlocked by the session we have reached. */
export function unlockedCards(progress: Progress) {
  const reached = Math.max(
    currentSession().n,
    ...Object.keys(progress.sessionsDone).map(Number).concat(0),
  );
  return CARDS.filter((c) => c.session <= reached);
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => load());
  const [sync, setSync] = useState<CloudStatus>("off");
  const [tutorReady, setTutorReady] = useState(() => Boolean(getTutorKey()));
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Auth session: resolve once, then follow changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // On sign-in, pull the cloud copy and merge it with whatever is local.
  useEffect(() => {
    if (!session) { setSync("off"); return; }
    let cancelled = false;
    setSync("syncing");
    pullCloud(session, load())
      .then((m) => { if (cancelled) return; save(m); setProgress(m); setSync("ok"); })
      .catch(() => { if (!cancelled) setSync("error"); });
    return () => { cancelled = true; };
  }, [session?.user.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  const sessionRef = useRef<Session | null>(null);
  sessionRef.current = session;
  const push = (next: Progress) => pushCloudDebounced(sessionRef.current, next, setSync);

  const gradeOne = useCallback((cardId: string, g: Grade) => {
    setProgress((p) => {
      const next: Progress = {
        ...p,
        cards: { ...p.cards, [cardId]: gradeCard(cardState(p, cardId), g) },
        // Append to the review log so accuracy can be measured over time.
        reviews: [...(p.reviews ?? []), [cardId, g, Date.now()] as ReviewEvent]
          .slice(-MAX_REVIEWS),
      };
      next.updatedAt = new Date().toISOString();
      save(next);
      push(next);
      return next;
    });
  }, []);

  const toggleBlock = useCallback((key: string) => {
    setProgress((p) => {
      const blocksDone = { ...p.blocksDone };
      if (blocksDone[key]) delete blocksDone[key];
      else blocksDone[key] = true;
      const next = { ...p, blocksDone };
      next.updatedAt = new Date().toISOString();
      save(next);
      push(next);
      return next;
    });
  }, []);

  const toggleSession = useCallback((n: number) => {
    setProgress((p) => {
      const sessionsDone = { ...p.sessionsDone };
      const s = SESSIONS.find((x) => x.n === n);
      let minutesLogged = p.minutesLogged;
      if (sessionsDone[n]) {
        delete sessionsDone[n];
        minutesLogged = Math.max(0, minutesLogged - (s ? s.hours * 60 : 0));
      } else {
        sessionsDone[n] = new Date().toISOString();
        minutesLogged += s ? s.hours * 60 : 0;
      }
      const next = { ...p, sessionsDone, minutesLogged };
      next.updatedAt = new Date().toISOString();
      save(next);
      push(next);
      return next;
    });
  }, []);

  const dueCount = useMemo(
    () => unlockedCards(progress).filter((c) => isDue(progress.cards[c.id])).length,
    [progress],
  );

  const ctx: Ctx = {
    progress, dueCount, sync, tutorReady, session,
    refreshTutor: () => setTutorReady(Boolean(getTutorKey())),
    gradeOne, toggleBlock, toggleSession,
    reload: () => setProgress(load()),
  };

  const days = daysUntil(TERM_START);
  const location = useLocation();

  if (!authReady) return <div className="boot"><span className="dot syncing" /></div>;
  // Local development only: `?dev=1` skips the sign-in gate so the lesson
  // engine can be exercised without an account. Vite drops this from builds.
  const devBypass = import.meta.env.DEV && (() => {
    try {
      if (new URLSearchParams(location.search).has("dev")) sessionStorage.setItem("phd-dev", "1");
      return sessionStorage.getItem("phd-dev") === "1";
    } catch { return false; }
  })();
  if (!session && !devBypass) return <SignIn />;

  return (
    <StudyCtx.Provider value={ctx}>
      <div className="app">
        <header className="topbar">
          <div className="topbar-inner">
            <Brand />
            <div className="topmeta">
              <div className="days">
                {days > 0 ? <><b>{days}</b> days to Oct 19</> : "Term underway"}
              </div>
              <span className="sync">
                <span className={`dot ${sync}`} />
                {sync === "ok" ? "saved to cloud" : sync === "off" ? "local" : sync}
              </span>
            </div>
          </div>
        </header>

        <nav className="tabs">
          <Tab to="/" icon={<IconSunrise />} label="Today" />
          <Tab to="/learn" icon={<IconBook />} label="Learn" />
          <Tab to="/sessions" icon={<IconRows />} label="Plan" />
          <Tab to="/cards" icon={<IconLayers />} label="Cards" badge={dueCount} />
          <Tab to="/notation" icon={<IconSigma />} label="Notation" />
          {tutorReady && <Tab to="/tutor" icon={<IconSpark />} label="Tutor" />}
          <Tab to="/progress" icon={<IconBars />} label="Dashboard" />
        </nav>

        <main className="main">
          <div className="page" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:id" element={<Learn />} />
            <Route path="/sessions" element={<SessionView />} />
            <Route path="/sessions/:n" element={<SessionView />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/notation" element={<Notation />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/progress" element={<ProgressView />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
          </div>
        </main>
      </div>
    </StudyCtx.Provider>
  );
}

function Tab({ to, icon, label, badge }: {
  to: string; icon: ReactNode; label: string; badge?: number;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) => `tab${isActive ? " active" : ""}`}
    >
      {icon}
      <span>{label}</span>
      {badge ? <span className="badge">{badge > 99 ? "99+" : badge}</span> : null}
    </NavLink>
  );
}
