export type Track = "stats" | "ethics" | "both";

export type Block = {
  minutes: number;
  track: Track;
  title: string;
  detail: string;
  resource?: string;
};

export type Session = {
  n: number;
  date: string;      // ISO, America/Denver
  day: string;
  start: string;
  hours: number;
  week: number;
  theme: string;
  blocks: Block[];
};

export const TERM_START = "2026-10-19";
export const PREP_START = "2026-09-15";

export const SESSIONS: Session[] = [
  {
    n: 1, date: "2026-09-15", day: "Tue", start: "4:00am", hours: 2, week: 1,
    theme: "Ground zero — make the tools stop being in your way",
    blocks: [
      { minutes: 15, track: "stats", title: "Launch JupyterLab",
        detail: "cd ~/PhD && ./.venv/bin/jupyter lab — then open notebooks/01_first_contact.ipynb. Everything is pre-installed; if it opens, you are done with setup forever.",
        resource: "SETUP.md" },
      { minutes: 20, track: "stats", title: "Read: what a distribution is",
        detail: "stats/01-what-is-a-distribution.md. Ten minutes. The three questions — shape, center, spread — are the template for describing any variable.",
        resource: "stats/01-what-is-a-distribution.md" },
      { minutes: 65, track: "stats", title: "Notebook 01 — First Contact",
        detail: "Load a CSV, .head(), .describe(), first histogram. Find the moment where the mean is 6x the median and make sure you understand why.",
        resource: "notebooks/01_first_contact.ipynb" },
      { minutes: 20, track: "both", title: "Notation: n, x̄ vs µ, Σ",
        detail: "Open the notation decoder. Learn four symbols properly: n, x̄, µ, Σ. Then review your first cards.",
        resource: "00-notation-cheatsheet.md" },
    ],
  },
  {
    n: 2, date: "2026-09-17", day: "Thu", start: "4:00am", hours: 2, week: 1,
    theme: "Shape, center, spread — and the ethics landscape",
    blocks: [
      { minutes: 15, track: "stats", title: "Read: shape, center, spread",
        detail: "stats/02 is not needed yet — instead skim your notes from Session 1 and review due cards.",
        resource: "stats/01-what-is-a-distribution.md" },
      { minutes: 45, track: "stats", title: "Notebook 02 — Shape, Center, Spread",
        detail: "Three averages and when each is honest. Why variance is squared. Four shapes by sight — and why bimodal means stop work and find your missing variable.",
        resource: "notebooks/02_shape_center_spread.ipynb" },
      { minutes: 45, track: "ethics", title: "The framework map",
        detail: "Read ethics/00-framework-map.md in full. Goal today is only to learn the five frameworks by name and what each is FOR. Write nothing yet.",
        resource: "ethics/00-framework-map.md" },
      { minutes: 15, track: "both", title: "Card review", detail: "Clear the review queue." },
    ],
  },
  {
    n: 3, date: "2026-09-19", day: "Sat", start: "5:00am", hours: 3, week: 1,
    theme: "The distribution zoo, and NIST AI RMF in depth",
    blocks: [
      { minutes: 90, track: "stats", title: "Notebook 03 — Distribution Zoo",
        detail: "Generate six distributions from their rules. The payoff: 68/95/99.7, and understanding WHY money is log-normal (multiplicative growth).",
        resource: "notebooks/03_distribution_zoo.ipynb" },
      { minutes: 70, track: "ethics", title: "NIST AI RMF 1.0",
        detail: "Govern, Map, Measure, Manage. Learn them cold — they are your organising device for every paper. Note that the framework is cyclical, not a pre-launch gate.",
        resource: "ethics/00-framework-map.md" },
      { minutes: 20, track: "ethics", title: "Write: framework comparison",
        detail: "One page, in your own words, comparing the five frameworks. Writing it yourself is the point; do not copy the table.",
        resource: "ethics/00-framework-map.md" },
    ],
  },
  {
    n: 4, date: "2026-09-22", day: "Tue", start: "4:00am", hours: 2, week: 2,
    theme: "Randomness — and vectorized thinking",
    blocks: [
      { minutes: 20, track: "stats", title: "Read: probability and conditioning",
        detail: "stats/02-probability-and-conditioning.md. The key sentence to carry: conditioning is filtering.",
        resource: "stats/02-probability-and-conditioning.md" },
      { minutes: 80, track: "stats", title: "Notebook 04 — Randomness",
        detail: "Probability as long-run frequency. Why the 'law of averages' does not mean the coin corrects itself. numpy vectorization vs loops. Verify the addition rule by simulation.",
        resource: "notebooks/04_randomness.ipynb" },
      { minutes: 20, track: "both", title: "Notation: P(·), the pipe, independence",
        detail: "The pipe | is the symbol to slow down on. P(fraud|alert) and P(alert|fraud) are different numbers." },
    ],
  },
  {
    n: 5, date: "2026-09-24", day: "Thu", start: "4:00am", hours: 2, week: 2,
    theme: "Conditional probability — and the bias taxonomy",
    blocks: [
      { minutes: 60, track: "stats", title: "Conditional probability, hands on",
        detail: "Finish notebook 04's conditioning section and both exercises. Make sure 'A[B] is a filter' is completely solid before Session 6 — everything there depends on it.",
        resource: "notebooks/04_randomness.ipynb" },
      { minutes: 45, track: "ethics", title: "The bias taxonomy",
        detail: "Historical, representation, measurement, aggregation, deployment. Naming the SOURCE of a bias is what separates a doctoral answer from a general one.",
        resource: "glossary.md" },
      { minutes: 15, track: "ethics", title: "Cases 1–2: COMPAS, Apple Card",
        detail: "Read both in the case bank. COMPAS is the case that defines the field.",
        resource: "ethics/case-bank.md" },
    ],
  },
  {
    n: 6, date: "2026-09-26", day: "Sat", start: "5:00am", hours: 3, week: 2,
    theme: "Bayes by simulation — and the fairness impossibility",
    blocks: [
      { minutes: 90, track: "stats", title: "Notebook 05 — Bayes by Simulation",
        detail: "THE most consequential notebook. A 96.8%-recall fraud model with 9.1% precision. Do not skip the base-rate sweep — it is the whole lesson.",
        resource: "notebooks/05_bayes_by_simulation.ipynb" },
      { minutes: 60, track: "ethics", title: "The three fairness definitions + impossibility",
        detail: "Demographic parity, equalized odds, calibration — and why they cannot all hold when base rates differ. If you learn ONE thing before the term starts, make it this.",
        resource: "ethics/00-framework-map.md" },
      { minutes: 30, track: "ethics", title: "Cases 3–4: Amazon hiring, Dutch benefits",
        detail: "Case 3 is the cleanest proxy demonstration. Case 4 is the highest-consequence case in the set — note that its arithmetic is exactly notebook 05's.",
        resource: "ethics/case-bank.md" },
    ],
  },
  {
    n: 7, date: "2026-09-29", day: "Tue", start: "4:00am", hours: 2, week: 3,
    theme: "Expectation and variance",
    blocks: [
      { minutes: 20, track: "stats", title: "Read: sampling and the CLT (first half)",
        detail: "stats/03-sampling-and-the-clt.md — read to the end of 'The Central Limit Theorem'. The rest lands better after notebook 06.",
        resource: "stats/03-sampling-and-the-clt.md" },
      { minutes: 80, track: "stats", title: "Notebook 06 — Expectation and Variance",
        detail: "E[X] describes a portfolio, never an individual. Why variance is squared. The four algebra rules, verified. Ends on σ/√n — diversification.",
        resource: "notebooks/06_expectation_variance.ipynb" },
      { minutes: 20, track: "both", title: "Notation: µ, σ, σ², E[X], Var(X)",
        detail: "Also nail the hat rule: θ is truth, θ̂ is your estimate from data. Any hat means uncertain." },
    ],
  },
  {
    n: 8, date: "2026-10-01", day: "Thu", start: "4:00am", hours: 2, week: 3,
    theme: "The normal distribution — and transparency",
    blocks: [
      { minutes: 55, track: "stats", title: "The normal distribution, properly",
        detail: "Finish notebook 06 exercises. Practice reading X ~ N(µ, σ²) aloud until it is automatic. Re-derive 68/95/99.7 by simulation.",
        resource: "notebooks/06_expectation_variance.ipynb" },
      { minutes: 45, track: "ethics", title: "Transparency and explainability",
        detail: "Model cards (Mitchell et al. 2019), datasheets for datasets (Gebru et al. 2021), SHAP/LIME at concept level — what they claim and what they cannot tell you.",
        resource: "resources.md" },
      { minutes: 20, track: "ethics", title: "Cases 5–6: Optum, facial recognition",
        detail: "Case 5 is the best case on target-variable choice, and the strongest candidate for your term paper.",
        resource: "ethics/case-bank.md" },
    ],
  },
  {
    n: 9, date: "2026-10-03", day: "Sat", start: "5:00am", hours: 3, week: 3,
    theme: "THE CENTERPIECE — CLT, standard error, and SR 11-7",
    blocks: [
      { minutes: 100, track: "stats", title: "Notebook 07 — CLT and Standard Error",
        detail: "The centerpiece of all five weeks. Watch the CLT appear from a violently skewed population. Then nail σ vs SE — the most common error in applied statistics.",
        resource: "notebooks/07_clt_and_standard_error.ipynb" },
      { minutes: 25, track: "stats", title: "Read: the rest of the CLT note",
        detail: "Finish stats/03. Pay attention to where the CLT STOPS applying (maxima) — knowing a theorem's limits is as useful as knowing it holds.",
        resource: "stats/03-sampling-and-the-clt.md" },
      { minutes: 55, track: "ethics", title: "SR 11-7 mapped to the NIST AI RMF",
        detail: "Your differentiator. Build the mapping table in your own words. This is the foundation of the strongest term-paper thesis available to you.",
        resource: "ethics/00-framework-map.md" },
    ],
  },
  {
    n: 10, date: "2026-10-06", day: "Tue", start: "4:00am", hours: 2, week: 4,
    theme: "Hypothesis testing",
    blocks: [
      { minutes: 20, track: "stats", title: "Read: inference",
        detail: "stats/04-inference.md. The whole method is one question: if nothing were going on, how often would I see data this striking?",
        resource: "stats/04-inference.md" },
      { minutes: 80, track: "stats", title: "Notebook 08 — Hypothesis Testing",
        detail: "Build a p-value from scratch by shuffling labels. Then watch the t-test reproduce it instantly. Do the 'significance vs importance' cell carefully.",
        resource: "notebooks/08_hypothesis_testing.ipynb" },
      { minutes: 20, track: "both", title: "Notation: H₀, H₁, α, β, p, θ̂",
        detail: "And commit the three things a p-value is NOT to memory. This is examinable." },
    ],
  },
  {
    n: 11, date: "2026-10-08", day: "Thu", start: "4:00am", hours: 2, week: 4,
    theme: "Errors and power — and privacy",
    blocks: [
      { minutes: 55, track: "stats", title: "Type I/II error, power, confidence intervals",
        detail: "Finish notebook 08. The power simulation is the important one: at n=30 you would MISS a real effect four times in five, and might report it does not exist.",
        resource: "notebooks/08_hypothesis_testing.ipynb" },
      { minutes: 40, track: "ethics", title: "Privacy, differential privacy, societal impact",
        detail: "Concept level only. Then the broader impacts: labour, environment, concentration of power (Crawford's Atlas of AI is the reference).",
        resource: "glossary.md" },
      { minutes: 25, track: "ethics", title: "Cases 7–8: Ofqual, Michigan MiDAS",
        detail: "Case 7 is the limits of actuarial reasoning about individuals. Case 8 is the 'alert treated as finding' pattern at its most damaging.",
        resource: "ethics/case-bank.md" },
    ],
  },
  {
    n: 12, date: "2026-10-10", day: "Sat", start: "5:00am", hours: 3, week: 4,
    theme: "The bootstrap — and your first full APA paper",
    blocks: [
      { minutes: 85, track: "stats", title: "Notebook 09 — The Bootstrap",
        detail: "Highest usefulness-to-difficulty ratio in statistics. Ten lines, no formulas, works on any statistic. You will bootstrap a fairness metric and get a defensible audit finding.",
        resource: "notebooks/09_bootstrap.ipynb" },
      { minutes: 15, track: "stats", title: "Multiple comparisons and p-hacking",
        detail: "20 tests at α=0.05 ⇒ expect a false positive. Directly relevant: test a model across 20 subgroups and you WILL find a disparity by chance.",
        resource: "stats/04-inference.md" },
      { minutes: 80, track: "ethics", title: "WRITE: case brief #1 in full APA 7",
        detail: "~1,200 words on a banking case (9–12). Use the 7-part structure in apa7-template.md. This is the rehearsal that matters — format counts as much as argument.",
        resource: "ethics/apa7-template.md" },
    ],
  },
  {
    n: 13, date: "2026-10-13", day: "Tue", start: "4:00am", hours: 2, week: 5,
    theme: "Regression",
    blocks: [
      { minutes: 20, track: "stats", title: "Read: regression and evaluation",
        detail: "stats/05-regression-and-evaluation.md, to the end of 'Always plot residuals'.",
        resource: "stats/05-regression-and-evaluation.md" },
      { minutes: 80, track: "stats", title: "Notebook 10 — Regression",
        detail: "Say every coefficient aloud as a sentence. See an R² of 0.9 on a model that is plainly wrong. End on confounding — a strong, significant, entirely spurious effect.",
        resource: "notebooks/10_regression.ipynb" },
      { minutes: 20, track: "both", title: "Notation: ŷ, β₀, β₁, ε, R²",
        detail: "ŷ = β₀ + β₁x + ε is the whole of linear regression in one line." },
    ],
  },
  {
    n: 14, date: "2026-10-15", day: "Thu", start: "4:00am", hours: 2, week: 5,
    theme: "Classification — and the discussion-board voice",
    blocks: [
      { minutes: 55, track: "stats", title: "Logistic regression, overfitting, train/test",
        detail: "Finish notebook 10's exercises, especially the dummy-variable one. Note carefully what a coefficient does NOT establish.",
        resource: "notebooks/10_regression.ipynb" },
      { minutes: 40, track: "ethics", title: "Finalise banking cases 2–4",
        detail: "Draft the remaining three banking briefs to outline depth. Keep them generic — no employer, no client, no confidential specifics.",
        resource: "ethics/case-bank.md" },
      { minutes: 25, track: "ethics", title: "The discussion-board form",
        detail: "Practise a 300-word post that earns full credit: a claim, a citation, a concrete example from practice, and a question that invites reply. Then two substantive replies.",
        resource: "resources.md" },
    ],
  },
  {
    n: 15, date: "2026-10-17", day: "Sat", start: "5:00am", hours: 3, week: 5,
    theme: "Where both courses meet — and launch readiness",
    blocks: [
      { minutes: 95, track: "both", title: "Notebook 11 — Model Evaluation",
        detail: "The finale. 90.8% accuracy catching ZERO of 110 defaults. Then compute the fairness impossibility yourself: group B flagged at 1.45x group A's rate, or fewer of its defaulters caught. Pick one.",
        resource: "notebooks/11_model_evaluation.ipynb" },
      { minutes: 30, track: "ethics", title: "Review all 12 case briefs",
        detail: "Then read the cross-cutting patterns table. Those eight patterns give you a fast, credible read on any new case you meet.",
        resource: "ethics/case-bank.md" },
      { minutes: 35, track: "both", title: "Launch readiness",
        detail: "Install Zotero + browser + Word plugins. Build your APA title-page template. Read resources.md § 'First week of class' and write your week-1 attack plan.",
        resource: "resources.md" },
      { minutes: 20, track: "both", title: "Final card review",
        detail: "Clear the whole queue. Then re-read 00-notation-cheatsheet.md end to end — and keep it open during your first 730 lecture.",
        resource: "00-notation-cheatsheet.md" },
    ],
  },
];

export const TOTAL_HOURS = SESSIONS.reduce((s, x) => s + x.hours, 0);
