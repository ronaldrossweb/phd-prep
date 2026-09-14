import type { SVGProps } from "react";

/* Stroke icons: 24x24, currentColor, 1.7 weight, round joins. */
const S = (p: SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

/** Today — a sunrise. These are 4am sessions. */
export const IconSunrise = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <path d="M3 18h18" />
    <path d="M7.5 18a4.5 4.5 0 0 1 9 0" />
    <path d="M12 4.5v2.2M5.6 7.6l1.5 1.5M18.4 7.6l-1.5 1.5" />
    <path d="M2.5 21.5h19" opacity=".45" />
  </svg>
);

/** Plan — a schedule of rows. */
export const IconRows = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <path d="M4 6.5h2M9.5 6.5H20M4 12h2M9.5 12H20M4 17.5h2M9.5 17.5H20" />
  </svg>
);

/** Cards — a stack. */
export const IconLayers = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <rect x="3.2" y="7.2" width="17.6" height="11.6" rx="2.4" />
    <path d="M6 4.8h12" opacity=".55" />
  </svg>
);

/** Notation — a sigma. */
export const IconSigma = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <path d="M17.5 4.5H6.8l6 7.5-6 7.5h10.7" />
  </svg>
);

/** Tutor — a spark. */
export const IconSpark = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <path d="M12 3.2 13.7 9 19.5 10.7 13.7 12.4 12 18.2 10.3 12.4 4.5 10.7 10.3 9Z" />
    <path d="M18.6 17.2l.7 2.2 2.2.7-2.2.7-.7 2.2-.7-2.2-2.2-.7 2.2-.7Z" opacity=".5" />
  </svg>
);

/** Stats — rising bars. */
export const IconBars = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <path d="M4 20V13.5M9.3 20V8.5M14.7 20v-9M20 20V5" />
  </svg>
);

export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S({ strokeWidth: 2.6, ...p })}>
    <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
  </svg>
);

export const IconChevronRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}><path d="M9 5l7 7-7 7" /></svg>
);

export const IconChevronLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}><path d="M15 5l-7 7 7 7" /></svg>
);

export const IconSearch = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="M15.5 15.5 20.5 20.5" />
  </svg>
);

export const IconCheckCircle = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.3l2.8 2.8L16.3 9.6" />
  </svg>
);

export const IconEmptySet = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M5.6 18.4 18.4 5.6" />
  </svg>
);

export const IconSend = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}><path d="M4.5 12 20 4.5 15.5 20 11.8 14.2 4.5 12Z" /></svg>
);

/** Learn — an open book. */
export const IconBook = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <path d="M12 6.5c-1.6-1.4-4-1.9-7.5-1.6v13.2c3.5-.3 5.9.2 7.5 1.6 1.6-1.4 4-1.9 7.5-1.6V4.9c-3.5-.3-5.9.2-7.5 1.6Z" />
    <path d="M12 6.5v13.2" opacity=".5" />
  </svg>
);

export const IconSun = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
  </svg>
);
export const IconMoon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}><path d="M19.5 14.2A8 8 0 0 1 9.8 4.5a8 8 0 1 0 9.7 9.7Z" /></svg>
);
export const IconMonitor = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <rect x="3" y="4.5" width="18" height="12" rx="2.2" />
    <path d="M9 20h6M12 16.5V20" />
  </svg>
);
export const IconLogout = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <path d="M10 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H10" />
    <path d="M15 8l4 4-4 4M19 12H9.5" />
  </svg>
);

/** Course — a mortarboard. */
export const IconGrad = (p: SVGProps<SVGSVGElement>) => (
  <svg {...S(p)}>
    <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" />
    <path d="M6.5 11.5v4.2c0 1.3 2.5 2.8 5.5 2.8s5.5-1.5 5.5-2.8v-4.2" />
    <path d="M21.5 9.5v5" opacity=".6" />
  </svg>
);
