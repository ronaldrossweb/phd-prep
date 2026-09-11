# PhD Prep Roadmap — 15 Sessions, 35 Hours

**Program:** University of the Cumberlands, Executive PhD in Artificial Intelligence
**Courses:** PhDAI 730 Statistics for AI (3 cr) · PhDAI 832 Ethics in Responsible AI (3 cr)
**Term:** Monday Oct 19 – Friday Dec 11, 2026 (8 weeks)
**Prep window:** Tue Sep 15 – Sat Oct 17, 2026

## Cadence

| Day | Time | Hours | Split |
|---|---|---|---|
| Tuesday | 4:00–6:00am | 2.0 | Stats + Python |
| Thursday | 4:00–6:00am | 2.0 | 1h Stats + Python · 1h Ethics |
| Saturday | 5:00–8:00am | 3.0 | 1.5h Stats project · 1.5h Ethics |

**7.0 hrs/week × 5 weeks = 35 hrs.** Track A (Statistics + Python) 22.5 hrs · Track B (Ethics) 12.5 hrs.

To keep this sleep-neutral, bedtime needs to be ~9:30pm on Mon/Wed/Fri. Studying at 4am on 5 hours of
sleep is how the plan quietly stops working in week 3.

## What success looks like on Oct 19

This is 35 hours. It will not make you a statistician, and any plan that claims otherwise is lying to
you. Here is what it *will* do — each of these is testable:

1. **Python runs on one command** and you can load a CSV, describe it, and plot it without help.
2. **You read notation without stopping** — `Σ`, `θ̂`, `P(A|B)`, `x̄` vs `µ`, `H₀`, `~ N(µ,σ²)`.
3. **You hold the five core intuitions:** what a distribution is · sampling variability · conditional
   probability · the logic of inference · regression as a line plus error.
4. **You can argue ethics in the field's vocabulary** — name the five frameworks, explain why the three
   fairness definitions cannot all hold at once, and draw on 12 case briefs you already wrote.

The goal is not to pre-learn the syllabus. You would forget it by November. The goal is to remove the
two things that actually sink people in a graded 8-week term: **notation illiteracy** and **toolchain
friction**.

---

## The 15 sessions

### Week 1 — Ground zero

**S1 · Tue Sep 15 · 4:00–6:00am · 2h — Stats + Python**
- Launch JupyterLab, run `notebooks/01_first_contact.ipynb`.
- What a dataset *is*: rows are observations, columns are variables, `n` is how many rows.
- Load a CSV, `.head()`, `.describe()`, your first histogram.
- Notation: `n`, `x̄` (sample mean) vs `µ` (population mean), `Σ` (add these up).
- Cards: first 15 seeded. Read `stats/01-what-is-a-distribution.md`.

**S2 · Thu Sep 17 · 4:00–6:00am · 2h — 1h Stats + 1h Ethics**
- Stats: shape, center, spread. Mean vs median and when the mean lies. `notebooks/02_shape_center_spread.ipynb`.
- Ethics: read `ethics/00-framework-map.md`. Learn the five frameworks by name and what each is *for*.
  Write nothing yet — just build the map.

**S3 · Sat Sep 19 · 5:00–8:00am · 3h — 1.5h Stats project + 1.5h Ethics**
- Stats: `notebooks/03_distribution_zoo.ipynb` — generate normal, skewed, bimodal, and uniform data and
  learn to recognize each on sight. This is the week's payoff.
- Ethics: NIST AI RMF 1.0 in depth — the four functions (Govern, Map, Measure, Manage). Start the
  one-page framework comparison table in your own words.
- Review all cards due.

### Week 2 — Randomness and probability

**S4 · Tue Sep 22 · 2h — Stats + Python**
- Probability as long-run frequency. Simulate 10,000 coin flips and watch the proportion settle.
- `notebooks/04_randomness.ipynb`. numpy arrays, `np.random.default_rng()`, vectorization vs loops.
- Notation: `P(·)`, independence.

**S5 · Thu Sep 24 · 2h — 1h Stats + 1h Ethics**
- Stats: conditional probability and Bayes, via a fraud-detection base-rate problem. **The single most
  counterintuitive idea in the course** — a 99%-accurate fraud test on rare fraud is mostly wrong.
- Ethics: bias taxonomy — historical, representation, measurement, aggregation, deployment. Read cases
  1–2 in `ethics/case-bank.md` (COMPAS, Apple Card).

**S6 · Sat Sep 26 · 3h — 1.5h Stats + 1.5h Ethics**
- Stats: `notebooks/05_bayes_by_simulation.ipynb` — get Bayes by simulating 100,000 customers rather
  than by manipulating the formula.
- Ethics: the three fairness definitions — demographic parity, equalized odds, calibration — and the
  **impossibility result**. If you learn one thing in this course before it starts, make it this.
- Cases 3–4 (Amazon hiring, Dutch childcare benefits).

### Week 3 — Distributions, expectation, sampling

**S7 · Tue Sep 29 · 2h — Stats + Python**
- Expectation `E[X]` and variance `Var(X)` as intuitions, not formulas. Standard deviation as
  "typical distance from the middle."
- `notebooks/06_expectation_variance.ipynb`. Notation: `µ`, `σ`, `σ²`, `E[X]`, `Var(X)`.

**S8 · Thu Oct 1 · 2h — 1h Stats + 1h Ethics**
- Stats: the normal distribution and why it is everywhere. `~ N(µ,σ²)` read aloud.
- Ethics: transparency and explainability — model cards, datasheets for datasets, SHAP/LIME at concept
  level (what they claim, what they cannot tell you). Cases 5–6.

**S9 · Sat Oct 3 · 3h — 1.5h Stats + 1.5h Ethics**
- Stats: **`notebooks/07_clt_and_standard_error.ipynb` — the centerpiece of the whole five weeks.**
  Draw 1,000 samples, plot their means, watch the Central Limit Theorem appear out of nothing. Then
  separate standard deviation from standard error, which is the error almost everyone makes.
- Ethics: accountability — human-in-the-loop, and **SR 11-7 model risk management mapped onto the NIST
  AI RMF**. This mapping is your edge; most of your cohort cannot make it. Cases 7–8.

### Week 4 — Inference

**S10 · Tue Oct 6 · 2h — Stats + Python**
- The logic of hypothesis testing: assume nothing is happening, ask how surprised you are.
- `H₀`, `H₁`, `α`, `p`. **What a p-value is not** — it is not the probability the hypothesis is true.
- `notebooks/08_hypothesis_testing.ipynb`, `scipy.stats` t-test.

**S11 · Thu Oct 8 · 2h — 1h Stats + 1h Ethics**
- Stats: Type I vs Type II error, power. Confidence intervals — what the 95% actually refers to.
- Ethics: privacy and differential privacy at concept level; societal impact (labor, environment,
  concentration of power).

**S12 · Sat Oct 10 · 3h — 1.5h Stats + 1.5h Ethics**
- Stats: `notebooks/09_bootstrap.ipynb` — the bootstrap in ten lines. Resample your own data to get a
  confidence interval without a single formula. Then multiple comparisons and p-hacking.
- Ethics: **write case brief #1 in full APA 7** (~1,200 words) on a banking case. This is the rehearsal
  for real coursework — the format matters as much as the argument.

### Week 5 — Regression, evaluation, launch

**S13 · Tue Oct 13 · 2h — Stats + Python**
- Regression as a line plus error. Interpreting a coefficient in a sentence. `R²` and its limits.
- `notebooks/10_regression.ipynb`, `statsmodels` OLS. Residual plots — what a bad fit looks like.

**S14 · Thu Oct 15 · 2h — 1h Stats + 1h Ethics**
- Stats: logistic regression for default prediction. Overfitting, train/test split, bias–variance.
- Ethics: finalize banking cases 2–4. Practice the discussion-board form: a 300-word post that earns
  full credit, plus two substantive replies.

**S15 · Sat Oct 17 · 3h — Launch readiness**
- Stats: `notebooks/11_model_evaluation.ipynb` — confusion matrix, precision, recall, ROC/AUC, and
  **why accuracy lies on imbalanced data**. This is the technical root of the fairness material in 832,
  so the two courses close the loop here.
- Ethics: final review of all 12 briefs.
- Both: full card review. Set up your APA 7 template and Zotero. Read `resources.md` § "First week of
  class" and write your week-1 attack plan.

---

## Before Oct 19 — open items

1. **Confirm your residency weekend date.** It is mandatory, three days, and only one make-up is
   permitted across the entire program.
2. **Confirm whether a third course (applied learning practicum) is on your fall schedule.** The
   Executive program's standard load is three per term — two content plus a practicum. You named two.
3. **Watch for the real syllabi.** A released syllabus or textbook list beats this reconstruction, and
   this plan should be updated the moment one appears.
