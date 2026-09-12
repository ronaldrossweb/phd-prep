import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getTheme, setTheme, type Theme } from "../lib/theme";
import { IconBars, IconLogout, IconMonitor, IconMoon, IconSun } from "./Icons";

const THEMES: { t: Theme; label: string; icon: React.ReactNode }[] = [
  { t: "system", label: "Auto", icon: <IconMonitor /> },
  { t: "light", label: "Light", icon: <IconSun /> },
  { t: "dark", label: "Dark", icon: <IconMoon /> },
];

export function AccountMenu({ session, sync }: { session: Session | null; sync: string }) {
  const [open, setOpen] = useState(false);
  const [theme, setThemeState] = useState<Theme>(getTheme);
  const ref = useRef<HTMLDivElement>(null);

  const email = session?.user.email ?? "";
  const name = (session?.user.user_metadata?.display_name as string | undefined) || email.split("@")[0] || "you";
  const initials = name.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function choose(t: Theme) { setTheme(t); setThemeState(t); }

  return (
    <div className="acct" ref={ref}>
      <button className="avatar" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu">
        {initials}
      </button>

      {open && (
        <div className="popover" role="menu">
          <div className="pop-head">
            <span className="avatar lg" aria-hidden="true">{initials}</span>
            <div style={{ minWidth: 0 }}>
              <div className="pop-name">{name}</div>
              <div className="pop-email">{email}</div>
              <div className="sync" style={{ marginTop: ".25rem" }}>
                <span className={`dot ${sync}`} />{sync === "ok" ? "saved to cloud" : sync === "off" ? "local" : sync}
              </div>
            </div>
          </div>

          <div className="pop-section">
            <div className="pop-label">Appearance</div>
            <div className="segmented full" role="group" aria-label="Theme">
              {THEMES.map((o) => (
                <button key={o.t} className={`segbtn${theme === o.t ? " on" : ""}`} onClick={() => choose(o.t)} aria-pressed={theme === o.t}>
                  {o.icon}<span>{o.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pop-section">
            <Link className="pop-item" to="/progress" onClick={() => setOpen(false)} role="menuitem"><IconBars /> Dashboard</Link>
            <button className="pop-item danger" role="menuitem" onClick={() => { setOpen(false); void supabase.auth.signOut(); }}>
              <IconLogout /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
