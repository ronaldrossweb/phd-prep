/**
 * PhDAI 730 — Statistics for AI. Transcribed from the official syllabus
 * (University of the Cumberlands, School of Computer and Information Sciences,
 * "Fall 2026 First Bi-Term" document, CRN 2026-FALL-1BT-PhDAI-730-A01).
 *
 * The syllabus prints due dates for a First Bi-Term (Aug 30 – Oct 14) and notes
 * "Specific dates should be set by faculty." Ronald's term runs Oct 19 – Dec 11,
 * i.e. the Second Bi-Term, so due dates below are computed from TERM_START by
 * week offset. Until confirmed, the UI labels them as projected.
 */

export const COURSE = {
  code: "PhDAI 730",
  section: "A01",
  title: "Statistics for AI",
  format: "Online",
  instructor: { name: "Najam Hassan", email: "najam.hassan@ucumberlands.edu", officeHours: "Wednesday 5–7 pm (Eastern), remote" },
  portal: "https://ucumberlands.blackboard.com/",
  timezoneNote: "All deadlines are Eastern Time. Late assignments are not accepted.",
  texts: [
    {
      title: "Statistics, 13th Edition", authors: "McClave & Sincich", publisher: "Pearson", isbn: "9780136881285",
      note: "Chapters 3, 4, 5, 11, 12, 13, 14 are assigned. Chapters 6–10 (sampling, CIs, hypothesis tests, ANOVA) are not — but the objectives assume you can use them.",
    },
    {
      title: "Introduction to Python Programming", authors: "Udayan Das et al.", publisher: "OpenStax (free)", isbn: "9781961584457",
      url: "https://openstax.org/details/books/introduction-python-programming",
      note: "Free online. Language fundamentals — functions, lists, dictionaries, strings, classes, files — plus a data-science chapter.",
    },
  ],
  objectives: [
    "Explain and apply core statistical concepts — probability, descriptive statistics, data distribution — in AI model development.",
    "Use statistical tools to analyze datasets, identify trends, and interpret results for AI/ML projects.",
    "Use hypothesis testing, confidence intervals, and goodness-of-fit tests to validate AI models and assess performance.",
    "Analyze relationships between variables with regression and correlation, and incorporate them into ML workflows.",
    "Critically evaluate AI models' statistical assumptions and limitations and propose improvements.",
  ],
  grading: [
    { item: "Introduction Discussion", qty: 1, each: 15 },
    { item: "Assignments", qty: 5, each: 40 },
    { item: "Discussions", qty: 3, each: 20 },
    { item: "Quizzes", qty: 5, each: 10 },
    { item: "Literature Reviews", qty: 2, each: 50 },
    { item: "Projects", qty: 3, each: 75 },
    { item: "Case Study (two parts)", qty: 2, each: 150 },
    { item: "Practical Connection Assignment", qty: 1, each: 50 },
  ],
  scale: [["A", "900–1000"], ["B", "800–890"], ["C", "700–790"], ["F", "below 690"]],
};

export const MCCLAVE: Record<number, string> = {
  3: "Probability",
  4: "Discrete Random Variables",
  5: "Continuous Random Variables",
  11: "Simple Linear Regression",
  12: "Multiple Regression and Model Building",
  13: "Categorical Data Analysis",
  14: "Nonparametric Statistics",
};

export const DAS: Record<number, string> = {
  1: "Introduction to Python", 2: "Expressions", 6: "Functions", 7: "Modules", 8: "Strings",
  9: "Lists", 10: "Dictionaries", 11: "Classes", 12: "Recursion", 13: "Inheritance",
  14: "Files and Exceptions", 15: "Data Science (NumPy, pandas, EDA, visualization)",
};

export type Deliverable = { name: string; points: number };

export type CourseWeek = {
  week: number;
  mcclave: number[];
  das: number[];
  deliverables: Deliverable[];
  /** days after TERM_START that the week's work is due (Sunday of that week) */
  dueOffset: number;
  short?: boolean;
  /** which prep modules in the portal cover this week */
  prep: string[];
};

/* Week 1 due 8/30 with a First-Bi-Term start of Mon 8/24 → Sunday +6; weeks thereafter +7.
   Week 8 is a short week: due Wednesday (+52). */
export const WEEKS: CourseWeek[] = [
  { week: 1, mcclave: [3, 4, 5],     das: [1, 2, 6, 9, 10], deliverables: [{ name: "Assignment 1", points: 40 }, { name: "Assignment 2", points: 40 }], dueOffset: 6,  prep: ["w1-probability", "w1-discrete-rv", "w1-continuous-rv", "py-basics", "py-functions", "py-lists-dicts"] },
  { week: 2, mcclave: [4, 11],       das: [11, 12, 15],     deliverables: [{ name: "Assignment 3", points: 40 }, { name: "Assignment 4", points: 40 }, { name: "Quiz 1", points: 10 }], dueOffset: 13, prep: ["w2-simple-regression", "py-classes", "py-recursion", "py-data-science"] },
  { week: 3, mcclave: [11, 12],      das: [12, 13],         deliverables: [{ name: "Discussion 1", points: 20 }, { name: "Quiz 2", points: 10 }], dueOffset: 20, prep: ["w3-regression-inference", "w3-multiple-regression", "py-inheritance"] },
  { week: 4, mcclave: [11, 12, 13],  das: [8],              deliverables: [{ name: "Assignment 5", points: 40 }, { name: "Literature Review 1", points: 50 }, { name: "Project 1", points: 75 }], dueOffset: 27, prep: ["w4-model-building", "w4-chi-square-gof", "py-strings"] },
  { week: 5, mcclave: [12, 13],      das: [13, 14, 15],     deliverables: [{ name: "Discussion 2", points: 20 }, { name: "Project 2", points: 75 }, { name: "Quiz 3", points: 10 }], dueOffset: 34, prep: ["w5-contingency-tables", "w5-residuals-diagnostics", "py-files-exceptions"] },
  { week: 6, mcclave: [13, 14],      das: [9],              deliverables: [{ name: "Literature Review 2", points: 50 }, { name: "Project 3", points: 75 }, { name: "Quiz 4", points: 10 }], dueOffset: 41, prep: ["w6-nonparametric-one-two", "w6-nonparametric-many"] },
  { week: 7, mcclave: [12, 13, 14],  das: [7],              deliverables: [{ name: "Discussion 3", points: 20 }, { name: "Case Study Part 1", points: 150 }, { name: "Quiz 5", points: 10 }], dueOffset: 48, prep: ["w7-spearman-and-choosing", "w7-case-study-workflow"] },
  { week: 8, mcclave: [4, 5, 13, 14], das: [13],            deliverables: [{ name: "Case Study Part 2", points: 150 }, { name: "Practical Connection Assignment", points: 50 }], dueOffset: 52, short: true, prep: ["w8-review-and-practical-connection"] },
];

export const TOTAL_POINTS = COURSE.grading.reduce((a, g) => a + g.qty * g.each, 0);

/** ISO date for a course week's due date, from a term start (ISO). */
export function dueDate(termStart: string, w: CourseWeek): string {
  const d = new Date(termStart + "T12:00:00");
  d.setDate(d.getDate() + w.dueOffset);
  return d.toLocaleDateString("en-CA");
}
