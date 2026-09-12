import type { Module } from "../modules";

const NP = `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
rng = np.random.default_rng(42)`;

export const WEEK4: Module[] = [
  /* ===================================================== Session 10 */
  {
    id: "s10-hypothesis-testing",
    session: 10, track: "stats", minutes: 55, setup: NP, packages: ["scipy"],
    title: "Build a p-value from scratch",
    summary: "Shuffle the labels a few thousand times and see how big a difference chance alone produces. That fraction is a p-value. Then watch the t-test reproduce it instantly.",
    video: {
      youtubeId: "0oc49DyA3hU", title: "Hypothesis Testing and The Null Hypothesis", channel: "StatQuest", minutes: 15,
      watchFor: [
        "The null hypothesis is 'nothing is going on' — and you never need preliminary data to state it.",
        "Rejecting the null is not the same as proving the alternative.",
        "Then: 'p-values: What they are and how to interpret them' (StatQuest) if you have another 11 minutes.",
      ],
    },
    reading: {
      keyIdea: "Hypothesis testing is one question asked carefully: if nothing were really going on, how often would I see data this striking? A p-value is that frequency — and you can build one by shuffling labels.",
      body: [
        "Two groups in an A/B test differ by 0.22 points. Real, or the kind of gap random assignment produces anyway? If the treatment does nothing, the labels are meaningless stickers: shuffle them 20,000 times and record the difference each time. The share of shuffles that beat the real gap **is** the p-value. No distributions, no tables.",
        "## The vocabulary, attached to what you did",
        "`H₀` (null): the labels are meaningless. `H₁`: the treatment changes satisfaction. **Test statistic**: the difference in means. **Null distribution**: the histogram of shuffled differences. **p-value**: the share beyond your observed line. **α**: the cutoff, chosen in advance — choosing it afterwards is where p-hacking starts.",
        "## The t-test is the same answer, faster",
        "It assumes the null distribution's shape (which the CLT guarantees) and skips the simulation. `t = difference / SE(difference)` — the gap measured in standard errors; from the 68/95/99.7 rule you already know a t of 2.75 is unusual.",
        "## What a p-value is NOT",
        "Not the probability `H₀` is true — a p-value *assumes* `H₀`. Not the probability your result was chance. **Not a measure of effect size**: with enough data, any non-zero difference becomes 'significant', including one far too small to act on. Always report the effect size alongside the p-value. 'Significant' means detectable, not important.",
      ],
    },
    exercises: [
      {
        id: "permutation", title: "The permutation test",
        prompt: "Load `data/ab_test.csv`. Compute the observed difference in mean `satisfaction` (treatment − control) as `observed`. Then shuffle `satisfaction` 5,000 times, recompute the difference each time into `null_diffs`, and compute `p_perm` = share of |null_diffs| ≥ |observed|.",
        starter: `ab = pd.read_csv("data/ab_test.csv")
t = ab.loc[ab.variant == "treatment", "satisfaction"]
c = ab.loc[ab.variant == "control", "satisfaction"]
observed = t.mean() - c.mean()

vals = ab["satisfaction"].to_numpy()
n_t = len(t)
null_diffs = np.empty(5000)
for i in range(5000):
    sh = rng.permutation(vals)
    null_diffs[i] = sh[:n_t].mean() - sh[n_t:].mean()

p_perm = ...
print(f"observed {observed:+.3f}   p = {p_perm:.4f}")
plt.hist(null_diffs, bins=60); plt.axvline(observed, color="r"); plt.show()
`,
        check: `assert abs(observed - 0.219) < 0.02
assert 0.001 < p_perm < 0.03, f"p should be small (about 0.006), got {p_perm}"`,
        solution: `ab = pd.read_csv("data/ab_test.csv")
t = ab.loc[ab.variant == "treatment", "satisfaction"]
c = ab.loc[ab.variant == "control", "satisfaction"]
observed = t.mean() - c.mean()

vals = ab["satisfaction"].to_numpy()
n_t = len(t)
null_diffs = np.empty(5000)
for i in range(5000):
    sh = rng.permutation(vals)
    null_diffs[i] = sh[:n_t].mean() - sh[n_t:].mean()

p_perm = (np.abs(null_diffs) >= abs(observed)).mean()
print(f"observed {observed:+.3f}   p = {p_perm:.4f}")
plt.hist(null_diffs, bins=60); plt.axvline(observed, color="r"); plt.show()
`,
        hint: "Compare absolute values: `np.abs(null_diffs) >= abs(observed)`, then `.mean()`.",
      },
      {
        id: "ttest", title: "The t-test agrees",
        prompt: "Run `scipy.stats.ttest_ind(t, c)` and store the p-value in `p_t`. It should be close to your permutation p-value. Also compute `t_stat` by hand: `observed / sqrt(t.var(ddof=1)/len(t) + c.var(ddof=1)/len(c))`.",
        starter: `from scipy import stats
res = stats.ttest_ind(t, c)
p_t = res.pvalue
t_stat = ...
print(f"t = {t_stat:.3f} (scipy {res.statistic:.3f})   p = {p_t:.4f}   permutation p = {p_perm:.4f}")
`,
        check: `assert abs(t_stat - res.statistic) < 1e-6, "t by hand should match scipy: difference / SE of the difference"
assert abs(p_t - p_perm) < 0.02, "The t-test and the permutation test should agree closely"`,
        solution: `from scipy import stats
res = stats.ttest_ind(t, c)
p_t = res.pvalue
t_stat = observed / np.sqrt(t.var(ddof=1)/len(t) + c.var(ddof=1)/len(c))
print(f"t = {t_stat:.3f} (scipy {res.statistic:.3f})   p = {p_t:.4f}   permutation p = {p_perm:.4f}")
`,
      },
      {
        id: "size", title: "Significance is not importance",
        prompt: "A true effect of 0.02 points (nobody could perceive it). For n = 100, 1,000, 10,000, 100,000, draw two groups (`rng.normal(4.50, 1, n)` and `rng.normal(4.52, 1, n)`) and record the t-test p-value in `p_by_n[n]`. Watch it become 'significant' as n grows.",
        starter: `p_by_n = {}
for n in (100, 1_000, 10_000, 100_000):
    a = rng.normal(4.50, 1.0, n)
    b = rng.normal(4.52, 1.0, n)
    p_by_n[n] = stats.ttest_ind(b, a).pvalue
    print(f"n={n:>7,}  p={p_by_n[n]:.4f}  {'SIGNIFICANT' if p_by_n[n] < .05 else ''}")
`,
        check: `assert p_by_n[100] > 0.05, "At n=100 a 0.02 effect should not be significant"
assert p_by_n[100_000] < 0.05, "At n=100,000 even a trivial effect becomes significant"`,
        solution: `p_by_n = {}
for n in (100, 1_000, 10_000, 100_000):
    a = rng.normal(4.50, 1.0, n)
    b = rng.normal(4.52, 1.0, n)
    p_by_n[n] = stats.ttest_ind(b, a).pvalue
    print(f"n={n:>7,}  p={p_by_n[n]:.4f}  {'SIGNIFICANT' if p_by_n[n] < .05 else ''}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "A p-value of 0.006 means…", choices: ["There is a 0.6% chance the null is true", "There is a 99.4% chance the treatment works", "If nothing were going on, data this extreme would arise 0.6% of the time", "The effect is large"], answer: 2, why: "A p-value assumes the null and reports how surprising the data would be. It says nothing about effect size." },
      { id: "q2", q: "In the permutation test, what does shuffling the labels represent?", choices: ["Random sampling", "The world in which the treatment does nothing", "Measurement error", "Bootstrapping"], answer: 1, why: "If the labels are meaningless, any assignment is equally valid. The shuffles build the null distribution." },
      { id: "q3", q: "A t-statistic of 2.75 means…", choices: ["The effect is 2.75 units", "The difference is 2.75 standard errors from zero", "p = 0.0275", "The sample is 2.75× too small"], answer: 1, why: "t = difference / SE. From the 68/95/99.7 rule, 2.75 SEs is unusual under the null." },
      { id: "q4", q: "With n = 100,000 a 0.02-point difference is 'highly significant'. The right conclusion is…", choices: ["A large effect exists", "A detectable but negligible effect exists; report the effect size", "The test is broken", "The groups differ substantially"], answer: 1, why: "Significant means detectable, not important. Always report effect size." },
      { id: "q5", q: "When must α be chosen?", choices: ["After seeing the p-value", "Before looking at the data", "It does not matter", "Only for large samples"], answer: 1, why: "Choosing it afterwards is p-hacking's first step." },
    ],
  },

  /* ===================================================== Session 11 */
  {
    id: "s11-errors-power",
    session: 11, track: "stats", minutes: 45, setup: NP, packages: ["scipy"],
    title: "Two ways to be wrong, and power",
    summary: "Type I and Type II error, why underpowered studies produce false reassurance, and the multiple-comparisons trap that matters directly for fairness audits.",
    video: {
      youtubeId: "vemZtEM63GY", title: "p-values: What they are and how to interpret them", channel: "StatQuest", minutes: 11,
      watchFor: [
        "The false-positive rate is set by α — and 5% of true nulls will still be 'significant'.",
        "A small p-value does not mean a large effect.",
        "Note where he distinguishes one-sided and two-sided tests.",
      ],
    },
    reading: {
      keyIdea: "Type I error: rejecting a true null (rate α). Type II error: missing a real effect (rate β). Power = 1 − β. Test 20 things at α = 0.05 and you expect one false positive — which is why a subgroup audit will 'find' a disparity by chance.",
      body: [
        "```\n                 H₀ true                       H₀ false\n  Reject H₀      TYPE I  (false positive, α)    correct\n  Keep   H₀      correct                       TYPE II (false negative, β)\n```",
        "**Power** is `1 − β`, the chance of detecting a real effect that is there. 80% is the usual minimum. Underpowered studies are the quiet epidemic of applied research: they fail to find real effects and get reported as 'no effect found' — which is a different claim entirely from 'we could not have detected one'.",
        "## Multiple comparisons",
        "Run 20 independent tests at α = 0.05 on data where nothing is real, and you expect one to come out 'significant'. `P(at least one) = 1 − 0.95²⁰ ≈ 64%`. This is p-hacking's engine, and it is why pre-registration and corrections (Bonferroni: use α/m) exist.",
        "## Why this matters for AI fairness",
        "Test a model across 20 demographic subgroups and you **will** find a 'significant' disparity by chance alone. An audit that reports the one significant subgroup without the other nineteen is not evidence of bias; it is the multiple-comparisons problem wearing a badge. Knowing this protects you from committing the error and from being fooled by someone else's.",
      ],
    },
    exercises: [
      {
        id: "power", title: "Power by simulation",
        prompt: "A real 0.22-point effect (σ = 1). For per-group sizes 30, 100, 300, run 800 simulated experiments each and record the share with p < 0.05 in `power[n]`.",
        starter: `from scipy import stats
power = {}
for n in (30, 100, 300):
    hits = 0
    for _ in range(800):
        a = rng.normal(4.50, 1.0, n); b = rng.normal(4.72, 1.0, n)
        hits += stats.ttest_ind(b, a).pvalue < 0.05
    power[n] = hits / 800
    print(f"n={n:>4} per group   power = {power[n]:.1%}")
`,
        check: `assert power[30] < 0.35, "At n=30 this effect is usually missed"
assert power[300] > 0.7, "At n=300 the study is adequately powered"`,
        solution: `from scipy import stats
power = {}
for n in (30, 100, 300):
    hits = 0
    for _ in range(800):
        a = rng.normal(4.50, 1.0, n); b = rng.normal(4.72, 1.0, n)
        hits += stats.ttest_ind(b, a).pvalue < 0.05
    power[n] = hits / 800
    print(f"n={n:>4} per group   power = {power[n]:.1%}")
`,
      },
      {
        id: "multiple", title: "Twenty tests, nothing real",
        prompt: "Run 200 t-tests between two groups drawn from the same distribution (`rng.normal(0,1,80)` each). Count how many have p < 0.05 into `false_positives`. Then compute `p_any20 = 1 - 0.95**20`.",
        starter: `false_positives = sum(
    stats.ttest_ind(rng.normal(0,1,80), rng.normal(0,1,80)).pvalue < 0.05
    for _ in range(200)
)
p_any20 = ...
print(f"{false_positives} of 200 'significant' with nothing real  ({false_positives/200:.1%})")
print(f"P(at least one false positive in 20 tests) = {p_any20:.1%}")
`,
        check: `assert 3 <= false_positives <= 20, "Around 5% (≈10 of 200) should be false positives"
assert abs(p_any20 - (1 - 0.95**20)) < 1e-9`,
        solution: `false_positives = sum(
    stats.ttest_ind(rng.normal(0,1,80), rng.normal(0,1,80)).pvalue < 0.05
    for _ in range(200)
)
p_any20 = 1 - 0.95**20
print(f"{false_positives} of 200 'significant' with nothing real  ({false_positives/200:.1%})")
print(f"P(at least one false positive in 20 tests) = {p_any20:.1%}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "A study with 30 per group finds 'no significant effect'. The most defensible reading is…", choices: ["There is no effect", "The study may have been too underpowered to detect one", "The effect is negative", "The data are wrong"], answer: 1, why: "'No effect found' is not 'no effect'. Check the power before believing a null result." },
      { id: "q2", q: "You test 20 subgroups at α = 0.05 and one shows a significant disparity. This is…", choices: ["Proof of bias in that subgroup", "About what chance alone would produce; adjust for multiple comparisons before concluding", "Impossible", "Evidence of a data error"], answer: 1, why: "P(at least one false positive in 20) ≈ 64%. Report all twenty and correct α." },
      { id: "q3", q: "Type II error is…", choices: ["A false positive", "Missing a real effect", "Choosing the wrong α", "A coding error"], answer: 1, why: "β. Power is 1 − β." },
      { id: "q4", q: "The Bonferroni correction for 10 tests at α = 0.05 uses…", choices: ["α = 0.5", "α = 0.05", "α = 0.005", "α = 0.10"], answer: 2, why: "α/m = 0.05/10." },
    ],
  },
  {
    id: "s11-privacy-impact",
    session: 11, track: "ethics", minutes: 45,
    title: "Privacy, differential privacy, and societal impact",
    summary: "Why 'we removed the names' is not anonymisation, what differential privacy guarantees, and the broader impacts — labour, environment, concentration — that a governance paper must at least name.",
    video: {
      youtubeId: "gI0wk1CXlsQ", title: "Differential Privacy — Simply Explained", channel: "Simply Explained", minutes: 7,
      watchFor: [
        "Why removing names fails: linkage attacks combine datasets to re-identify people.",
        "The coin-flip trick: noise that protects each individual but leaves the aggregate accurate.",
        "The privacy budget — every query spends some.",
      ],
    },
    reading: {
      keyIdea: "Differential privacy is a mathematical guarantee that an analysis reveals almost nothing about any single individual, achieved by adding calibrated noise. 'We removed the names' is not a privacy guarantee at all.",
      body: [
        "Datasets with names stripped are routinely re-identified by joining them with public data — ZIP code, birth date and sex identify most Americans uniquely. Differential privacy inverts the problem: instead of hoping nobody can link, it bounds mathematically how much any one person's presence changes the output. Apple and Google use it for telemetry; the US Census used it in 2020. The cost is accuracy, spent through a 'privacy budget'.",
        "## For a bank",
        "Aggregate analytics over customer data — exactly what a natural-language analytics platform produces — is a place differential privacy genuinely fits, and a place where 'anonymised' claims deserve scrutiny in a Map-stage impact assessment.",
        "## Societal impact — the part papers skip",
        "Beyond fairness and privacy, the syllabus will expect you to engage with **labour** (which tasks and roles are displaced, and who bears the transition), **environment** (training and inference energy; Crawford's *Atlas of AI* is the standard reference), and **concentration** (who owns the models and the data, and what that does to competition and to the balance of power between institutions and individuals). You do not need to resolve these; you need to show you can locate a system within them.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "A dataset has names removed. It is…", choices: ["Anonymous", "Potentially re-identifiable through linkage with other data", "Compliant with all privacy law", "Useless"], answer: 1, why: "ZIP + birth date + sex re-identifies most people. Removing names is not a guarantee." },
      { id: "q2", q: "Differential privacy guarantees…", choices: ["Perfect accuracy", "That no individual's presence changes the output by more than a bounded amount", "That data cannot be stolen", "Encryption"], answer: 1, why: "A bound on individual influence, achieved by calibrated noise, at a cost in accuracy." },
      { id: "q3", q: "What does a 'privacy budget' mean?", choices: ["Money spent on compliance", "Every query spends some allowable privacy loss; it is finite", "The size of the dataset", "Storage cost"], answer: 1, why: "Repeated queries accumulate privacy loss; the budget caps the total." },
      { id: "q4", q: "Which of these is a *societal-impact* question rather than a fairness one?", choices: ["Does the model flag group B more often?", "Which roles does this system displace, and who bears the transition?", "Is the model calibrated?", "Is the protected attribute used?"], answer: 1, why: "Labour, environment and concentration are impact questions beyond individual fairness." },
    ],
  },

  /* ===================================================== Session 12 */
  {
    id: "s12-bootstrap",
    session: 12, track: "stats", minutes: 60, setup: NP,
    title: "The bootstrap — a confidence interval for anything",
    summary: "Resample your own data with replacement, ten lines of code, no formulas, works on any statistic. Then bootstrap a fairness gap into a defensible audit finding.",
    video: {
      youtubeId: "Xz0x-8-cgaQ", title: "Bootstrapping Main Ideas", channel: "StatQuest", minutes: 9,
      watchFor: [
        "Sampling *with replacement* is the whole trick — some values appear twice, others not at all.",
        "It gives a standard error for any statistic, even when there is no formula.",
        "Then 'Confidence Intervals, Clearly Explained' (StatQuest, 6 min) if you want the CI framing reinforced.",
      ],
    },
    reading: {
      keyIdea: "Treat your sample as if it were the population and resample from it with replacement. The variation across resamples approximates the variation you would have seen across real samples. It works for any statistic you can compute.",
      body: [
        "In Session 9 you needed many samples from the population to see how much an estimate wobbles, and you only ever have one. The bootstrap's move is audacious: resample the sample. It sounds like cheating; it works, and its inventor became famous for it.",
        "The entire method: `rng.choice(data, size=len(data), replace=True)`, compute the statistic, repeat 10,000 times, read the 2.5th and 97.5th percentiles. For the mean you can check it against `σ/√n` before trusting it elsewhere. Then it earns its keep on the median, the 90th percentile, the IQR, a correlation — none of which has a convenient formula.",
        "## A defensible fairness finding",
        "What is the confidence interval on the *gap* in default rates between two applicant groups? Bootstrap each group, take the difference, repeat. 'Group B's rate is 4.7 points higher (95% CI 2.5 to 7.0), so the disparity is not attributable to sampling variation' is an audit finding. Note what it does **not** say: whether the disparity is caused by group membership or whether the model is unfair. It establishes that the gap is real; the interpretation is the ethics question, and being scrupulous about that boundary is what your 832 papers must get right.",
        "## Where it fails",
        "It can never resample a value it has not seen, so **never bootstrap a maximum, minimum or extreme quantile**. It needs a reasonable sample (n ≳ 30–50) and independent observations. When bootstrapping a *relationship* (a correlation), resample **row indices** so pairs stay together — resampling columns separately destroys the pairing.",
      ],
    },
    exercises: [
      {
        id: "boot-mean", title: "Bootstrap versus the formula",
        prompt: "Take `sample = lending['annual_income'].sample(200, random_state=7).to_numpy()`. Bootstrap the mean 5,000 times into `boot`. Compute the bootstrap SE as `se_boot = boot.std()` and the formula SE as `se_formula = sample.std(ddof=1)/√200`. They should agree.",
        starter: `lending = pd.read_csv("data/lending.csv")
sample = lending["annual_income"].sample(200, random_state=7).to_numpy()

boot = np.array([rng.choice(sample, size=len(sample), replace=True).mean() for _ in range(5000)])
se_boot = boot.std()
se_formula = ...
lo, hi = np.percentile(boot, [2.5, 97.5])
print(f"bootstrap SE {se_boot:,.0f}   formula SE {se_formula:,.0f}   95% CI [{lo:,.0f}, {hi:,.0f}]")
`,
        check: `assert abs(se_boot - se_formula)/se_formula < 0.12, "Bootstrap SE and σ/√n should agree within about 10%"`,
        solution: `lending = pd.read_csv("data/lending.csv")
sample = lending["annual_income"].sample(200, random_state=7).to_numpy()

boot = np.array([rng.choice(sample, size=len(sample), replace=True).mean() for _ in range(5000)])
se_boot = boot.std()
se_formula = sample.std(ddof=1) / np.sqrt(200)
lo, hi = np.percentile(boot, [2.5, 97.5])
print(f"bootstrap SE {se_boot:,.0f}   formula SE {se_formula:,.0f}   95% CI [{lo:,.0f}, {hi:,.0f}]")
`,
      },
      {
        id: "boot-gap", title: "A fairness gap with a confidence interval",
        prompt: "Let `a` and `b` be the `defaulted` columns for groups A and B. Bootstrap the difference `b.mean() − a.mean()` 5,000 times into `gaps` and compute the 95% interval `lo_g, hi_g`. Does it exclude zero? Store the boolean in `excludes_zero`.",
        starter: `a = lending.loc[lending.applicant_group == "A", "defaulted"].to_numpy()
b = lending.loc[lending.applicant_group == "B", "defaulted"].to_numpy()

gaps = np.array([
    rng.choice(b, len(b), replace=True).mean() - rng.choice(a, len(a), replace=True).mean()
    for _ in range(5000)
])
lo_g, hi_g = np.percentile(gaps, [2.5, 97.5])
excludes_zero = ...
print(f"gap {b.mean()-a.mean():+.4f}   95% CI [{lo_g:+.4f}, {hi_g:+.4f}]   excludes zero: {excludes_zero}")
`,
        check: `assert lo_g > 0, "The lower bound should be above zero — the gap is real"
assert excludes_zero == True, "excludes_zero should be True: the interval does not contain 0"`,
        solution: `a = lending.loc[lending.applicant_group == "A", "defaulted"].to_numpy()
b = lending.loc[lending.applicant_group == "B", "defaulted"].to_numpy()

gaps = np.array([
    rng.choice(b, len(b), replace=True).mean() - rng.choice(a, len(a), replace=True).mean()
    for _ in range(5000)
])
lo_g, hi_g = np.percentile(gaps, [2.5, 97.5])
excludes_zero = not (lo_g <= 0 <= hi_g)
print(f"gap {b.mean()-a.mean():+.4f}   95% CI [{lo_g:+.4f}, {hi_g:+.4f}]   excludes zero: {excludes_zero}")
`,
      },
      {
        id: "boot-fail", title: "Where the bootstrap breaks",
        prompt: "Bootstrap the *maximum* of `sample` 2,000 times into `boot_max`. Compare its 97.5th percentile with `lending['annual_income'].max()` (the true population max). Store the percentile in `p975`.",
        starter: `boot_max = np.array([rng.choice(sample, len(sample), replace=True).max() for _ in range(2000)])
p975 = ...
print(f"bootstrap 97.5th pct of max: {p975:,.0f}    true population max: {lending['annual_income'].max():,.0f}")
print("The interval cannot exceed the sample's own max -- it is structurally unable to reach the truth.")
`,
        check: `assert abs(p975 - np.percentile(boot_max, 97.5)) < 1e-6
assert p975 <= sample.max() + 1e-6, "A bootstrap of the max can never exceed the sample max"`,
        solution: `boot_max = np.array([rng.choice(sample, len(sample), replace=True).max() for _ in range(2000)])
p975 = np.percentile(boot_max, 97.5)
print(f"bootstrap 97.5th pct of max: {p975:,.0f}    true population max: {lending['annual_income'].max():,.0f}")
print("The interval cannot exceed the sample's own max -- it is structurally unable to reach the truth.")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "The essential ingredient of the bootstrap is…", choices: ["A large population", "Sampling with replacement from your own sample", "A normal distribution", "A formula for the standard error"], answer: 1, why: "`replace=True` is the whole trick. Without it every resample would be identical." },
      { id: "q2", q: "Which statistic should you never bootstrap?", choices: ["The median", "The IQR", "The maximum", "A correlation"], answer: 2, why: "The bootstrap cannot produce a value it has not seen, so extremes are structurally biased." },
      { id: "q3", q: "Bootstrapping a correlation, you should resample…", choices: ["Each column separately", "Row indices, keeping pairs together", "Only the x column", "With replacement turned off"], answer: 1, why: "Resampling columns independently destroys the pairing and forces the correlation toward zero." },
      { id: "q4", q: "A bootstrap CI for the default-rate gap excludes zero. This establishes that…", choices: ["The model is unfair", "Group membership causes default", "The gap is not sampling noise; the cause is a separate question", "The groups are identical"], answer: 2, why: "A real gap, not why. Keeping that boundary is what makes an audit finding defensible." },
    ],
  },
  {
    id: "s12-apa-brief",
    session: 12, track: "ethics", minutes: 80,
    title: "Write case brief #1 in full APA 7",
    summary: "The rehearsal for real coursework. Take a banking case from the case bank and write it up — the format counts as much as the argument.",
    reading: {
      keyIdea: "Doctoral coursework is graded partly on format. Losing marks on mechanics you could have templated is avoidable — so template it now, and write one full brief before the term starts.",
      body: [
        "## The structure that works",
        "1. **Introduction** — the case, why it matters, your thesis in one sentence. 2. **Background** — what happened, factually, cited; the grader knows the case, keep it tight. 3. **Ethical analysis** — the principle at stake, named from a framework. *Where the marks are.* 4. **Framework application** — walk it through the four AI RMF functions and say which failed first. 5. **The technical constraint** — what was mathematically achievable; cite the impossibility result where relevant. *This is the section most students cannot write, and you can.* 6. **Counterfactual design** — not 'more oversight' but *which* control, at *which* lifecycle stage, owned by *whom*. 7. **Conclusion** — restate, note limitations, name what is unresolved.",
        "## Mechanics that cost marks",
        "`et al.` from the first citation for three or more authors (APA 7, not 6). Title not bold on a student title page. DOIs as full `https://doi.org/…` URLs, no 'Retrieved from'. No running head in student papers; page numbers yes. Every reference cited in text and every citation in the reference list — graders check. One space after a period. Quotes over 40 words become block quotes.",
        "## Your assignment this session",
        "Pick one of the four banking cases (the analytics copilot, alternative-data underwriting, transaction monitoring, generative adverse-action notices). Write ~1,200 words in the seven-part structure, in APA 7, using at least four of the references in `ethics/apa7-template.md`. Write it generically — no employer, no client, no confidential specifics. Then answer the quiz below, which checks the mechanics.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "First in-text citation of a paper by Mitchell, Wu, Zaldivar and six others, in APA 7:", choices: ["(Mitchell, Wu, Zaldivar, et al., 2019)", "(Mitchell et al., 2019)", "(Mitchell and colleagues, 2019)", "(Mitchell, 2019)"], answer: 1, why: "APA 7 uses et al. from the very first citation for three or more authors. Old templates get this wrong." },
      { id: "q2", q: "A quotation of 55 words should be…", choices: ["In quotation marks inline", "A block quote, indented, no quotation marks, citation after the final period", "Paraphrased instead", "Omitted"], answer: 1, why: "Over 40 words: block quote." },
      { id: "q3", q: "Which section of a case paper is most students unable to write, and you can?", choices: ["Background", "Ethical analysis", "The technical constraint — what was mathematically achievable", "Conclusion"], answer: 2, why: "You have computed the impossibility result yourself. Say so." },
      { id: "q4", q: "The counterfactual design section should specify…", choices: ["'More oversight'", "Which control, at which lifecycle stage, owned by whom", "A better algorithm", "A regulator"], answer: 1, why: "Specificity is the difference between a recommendation and a gesture." },
      { id: "q5", q: "Which of these is NOT an APA 7 student-paper requirement?", choices: ["Page numbers", "A running head", "A reference list with hanging indents", "A title page"], answer: 1, why: "Running heads were dropped for student papers in APA 7." },
    ],
  },
];
