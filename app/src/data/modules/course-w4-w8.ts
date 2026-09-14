import type { Module } from "../modules";

const NP = `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
rng = np.random.default_rng(42)
lending = pd.read_csv("data/lending.csv")
branches = pd.read_csv("data/branch_deposits.csv")`;

/* ============================================================================
   COURSE WEEKS 4–8 — McClave ch 13 (Categorical Data Analysis), ch 14
   (Nonparametric Statistics), the case-study workflow and the final review.
   ========================================================================= */
export const COURSE_CAT_NP: Module[] = [
  {
    id: "w4-chi-square-gof",
    session: 10, track: "stats", minutes: 45, setup: NP, packages: ["scipy"],
    title: "Categorical data: multinomial experiments and the χ² goodness-of-fit test (ch 13 §13.1–13.2)",
    summary: "Counting outcomes in categories: the multinomial experiment, expected counts under H₀, the chi-square statistic, and when the approximation is safe.",
    video: {
      youtubeId: "nwFA0bprGfc", title: "Chi-square goodness-of-fit test", channel: "CodeLucky", minutes: 11,
      watchFor: [
        "Expected count for each cell = n × the hypothesised proportion.",
        "χ² = Σ (observed − expected)² / expected — the squared gap, scaled by what you expected.",
        "Degrees of freedom = k − 1 categories; large χ² → reject.",
      ],
    },
    reading: {
      keyIdea: "A multinomial experiment is n independent trials with k possible outcomes. Under H₀ the expected count in cell i is `Eᵢ = n·pᵢ₀`; `χ² = Σ (nᵢ − Eᵢ)²/Eᵢ` has approximately a chi-square distribution with k−1 df when every Eᵢ ≥ 5. Reject H₀ for large χ².",
      body: [
        "**Multinomial experiment (§13.1).** Like the binomial but with k categories: n identical trials, k outcomes per trial, constant probabilities `p₁ … pₖ` summing to 1, independent trials, and cell counts `n₁ … nₖ`.",
        "**One-way table test (§13.2).** `H₀: p₁ = p₁₀, …, pₖ = pₖ₀`; `Hₐ`: at least one differs. Compute `Eᵢ = n·pᵢ₀`, then `χ² = Σ (nᵢ − Eᵢ)²/Eᵢ`, rejection region `χ² > χ²_α` with `k−1` df. `scipy.stats.chisquare(observed, expected)`.",
        "**Why it's one-tailed.** Deviations in either direction make χ² larger, so all the evidence against H₀ sits in the upper tail.",
        "**Conditions.** Expected (not observed) counts of at least 5 in every cell; if a cell is small, combine categories. The test is about counts — never feed it percentages.",
        "**Confidence interval for one pᵢ:** `p̂ᵢ ± z_{α/2}√(p̂ᵢ(1−p̂ᵢ)/n)` — the same proportion CI from the earlier chapters, applied to one cell.",
        "**Banking use.** Do loan applications by region match the population share of each region? Do fraud alerts fall on weekdays in the proportions the volume predicts? Both are one-way χ² questions.",
      ],
    },
    exercises: [
      {
        id: "gof", title: "Region mix versus a claimed share",
        prompt: "The bank claims applications split North 40% / Central 40% / South 20%. Using `lending['region']` counts, compute expected counts `expected` (in the order North, Central, South), the statistic `chi2` by hand, and the p-value `p` with 2 df. Confirm against `scipy.stats.chisquare`.",
        starter: `from scipy import stats
obs = lending["region"].value_counts().reindex(["North", "Central", "South"]).to_numpy()
n = obs.sum()
p0 = np.array([0.40, 0.40, 0.20])
expected = ...
chi2 = ((obs - expected)**2 / expected).sum()
p = stats.chi2.sf(chi2, df=len(obs) - 1)
sp = stats.chisquare(obs, expected)
print(f"observed {obs}  expected {expected.round(1)}  χ²={chi2:.2f}  p={p:.4f}   scipy: {sp.statistic:.2f}, {sp.pvalue:.4f}")
`,
        check: `assert np.allclose(expected, n * p0), "E_i = n × p_i0"
assert abs(chi2 - sp.statistic) < 1e-9 and abs(p - sp.pvalue) < 1e-9`,
        solution: `from scipy import stats
obs = lending["region"].value_counts().reindex(["North", "Central", "South"]).to_numpy()
n = obs.sum()
p0 = np.array([0.40, 0.40, 0.20])
expected = n * p0
chi2 = ((obs - expected)**2 / expected).sum()
p = stats.chi2.sf(chi2, df=len(obs) - 1)
sp = stats.chisquare(obs, expected)
print(f"observed {obs}  expected {expected.round(1)}  χ²={chi2:.2f}  p={p:.4f}   scipy: {sp.statistic:.2f}, {sp.pvalue:.4f}")
`,
      },
      {
        id: "sim", title: "Where does the χ² distribution come from?",
        prompt: "Simulate 5,000 multinomial samples of size `n` *under H₀* (`rng.multinomial(n, p0)`), compute χ² for each into `sims`, and store `sim_p` = the share of simulated statistics ≥ your observed `chi2`. It should be close to the theoretical `p`.",
        starter: `sims = np.array([((s - expected)**2 / expected).sum() for s in rng.multinomial(n, p0, size=5000)])
sim_p = ...
plt.hist(sims, bins=60, density=True, alpha=.6, label="simulated under H₀")
xs = np.linspace(0, 20, 200); plt.plot(xs, stats.chi2.pdf(xs, df=2), lw=2, label="χ²(2)")
plt.axvline(chi2, color="k", ls="--", label="observed"); plt.legend(); plt.show()
print(f"simulated p = {sim_p:.4f}   theoretical p = {p:.4f}")
`,
        check: `assert abs(sim_p - (sims >= chi2).mean()) < 1e-12
assert abs(sim_p - p) < 0.03, "The simulated tail share should agree with the chi-square approximation"`,
        solution: `sims = np.array([((s - expected)**2 / expected).sum() for s in rng.multinomial(n, p0, size=5000)])
sim_p = (sims >= chi2).mean()
plt.hist(sims, bins=60, density=True, alpha=.6, label="simulated under H₀")
xs = np.linspace(0, 20, 200); plt.plot(xs, stats.chi2.pdf(xs, df=2), lw=2, label="χ²(2)")
plt.axvline(chi2, color="k", ls="--", label="observed"); plt.legend(); plt.show()
print(f"simulated p = {sim_p:.4f}   theoretical p = {p:.4f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "For a one-way table with 5 categories, the χ² test has how many df?", choices: ["5", "4", "1", "n − 5"], answer: 1, why: "k − 1: the last cell count is fixed once the others and n are known." },
      { id: "q2", q: "The expected count in cell i under H₀ is…", choices: ["nᵢ", "n × pᵢ₀", "pᵢ₀", "n / k"], answer: 1, why: "Sample size times the hypothesised proportion." },
      { id: "q3", q: "The χ² goodness-of-fit test rejects when…", choices: ["χ² is small", "χ² is large (upper tail)", "χ² is negative", "Either tail"], answer: 1, why: "Any discrepancy inflates χ²; the rejection region is the upper tail only." },
      { id: "q4", q: "A cell has expected count 2. You should…", choices: ["Proceed as usual", "Combine it with a neighbouring category so expected counts are ≥ 5", "Switch to a t-test", "Use percentages instead"], answer: 1, why: "The chi-square approximation needs Eᵢ ≥ 5 in every cell." },
    ],
  },

  {
    id: "w5-contingency-tables",
    session: 11, track: "stats", minutes: 50, setup: NP, packages: ["scipy"],
    title: "Two-way (contingency) tables: the χ² test of independence (ch 13 §13.3–13.4)",
    summary: "Are two categorical variables related? Expected counts from row and column totals, (r−1)(c−1) df, and the caution that a significant χ² says 'dependent', not 'why' — the technical root of the fairness material in 832.",
    video: {
      youtubeId: "rpKzq64GA9Y", title: "Chi-square test for association (independence)", channel: "numiqo", minutes: 12,
      watchFor: [
        "Expected cell count = (row total × column total) / n.",
        "H₀ is 'the two classifications are independent'.",
        "df = (rows − 1)(columns − 1).",
      ],
    },
    reading: {
      keyIdea: "In an r × c table, H₀: the row and column variables are independent. `Ê_ij = (rᵢ · cⱼ)/n`, `χ² = Σ (nᵢⱼ − Êᵢⱼ)²/Êᵢⱼ` with `(r−1)(c−1)` df. A significant result means the distribution of one variable differs across levels of the other; it does not say which cells or why.",
      body: [
        "**Setting.** Each unit is classified two ways (region × defaulted; applicant group × approved). Counts go in an r × c table with row totals rᵢ, column totals cⱼ, and grand total n.",
        "**Expected counts under independence:** if the two are independent, `P(row i and col j) = P(row i)·P(col j)`, so `Ê_ij = n · (rᵢ/n)(cⱼ/n) = rᵢcⱼ/n`.",
        "**The test.** `χ² = Σ (nᵢⱼ − Êᵢⱼ)²/Êᵢⱼ`, df = (r−1)(c−1), reject for large χ². `scipy.stats.chi2_contingency(table, correction=False)` returns statistic, p, df and the expected table. (Use `correction=False` to match McClave; Yates' correction only applies to 2×2.)",
        "**Reading a significant result.** Look at *standardised residuals* `(n − Ê)/√Ê` cell by cell: values beyond ±2 show where the departure from independence lives.",
        "**Caution 1 — design.** The same test applies whether one margin was fixed by the design (a *test of homogeneity*) or neither was; interpretation differs slightly but the arithmetic is the same.",
        "**Caution 2 — dependence is not cause.** Region and default being dependent may reflect income differences by region (a confounder). This is exactly the fairness question: a group × outcome table can be 'dependent' because of a legitimate factor, an illegitimate one, or both — the χ² test cannot tell you which. That is what regression with controls (ch 12) and the ethics course are for.",
      ],
    },
    exercises: [
      {
        id: "crosstab", title: "Build the table and test independence",
        prompt: "Cross-tabulate `region` × `defaulted`. Compute the expected table `E` by hand from the margins (`np.outer(rows, cols)/n`), the statistic `chi2`, df `dof`, p-value `p`, and confirm against `chi2_contingency(..., correction=False)`.",
        starter: `from scipy import stats
T = pd.crosstab(lending["region"], lending["defaulted"])
O = T.to_numpy(); n = O.sum()
rows, cols = O.sum(axis=1), O.sum(axis=0)
E = ...
chi2 = ((O - E)**2 / E).sum()
dof = (O.shape[0] - 1) * (O.shape[1] - 1)
p = stats.chi2.sf(chi2, dof)
sp = stats.chi2_contingency(O, correction=False)
print(T); print(f"χ²={chi2:.3f} df={dof} p={p:.4f}   scipy: {sp[0]:.3f}, {sp[1]:.4f}")
`,
        check: `assert np.allclose(E, sp[3]), "E_ij = r_i × c_j / n"
assert abs(chi2 - sp[0]) < 1e-9 and dof == sp[2]`,
        solution: `from scipy import stats
T = pd.crosstab(lending["region"], lending["defaulted"])
O = T.to_numpy(); n = O.sum()
rows, cols = O.sum(axis=1), O.sum(axis=0)
E = np.outer(rows, cols) / n
chi2 = ((O - E)**2 / E).sum()
dof = (O.shape[0] - 1) * (O.shape[1] - 1)
p = stats.chi2.sf(chi2, dof)
sp = stats.chi2_contingency(O, correction=False)
print(T); print(f"χ²={chi2:.3f} df={dof} p={p:.4f}   scipy: {sp[0]:.3f}, {sp[1]:.4f}")
`,
      },
      {
        id: "resid", title: "Where does the dependence live?",
        prompt: "Compute the standardised residuals `Z = (O − E)/√E` as a DataFrame with the same labels as `T`, and store the label of the region with the largest positive residual in the `defaulted = 1` column as `worst_region`.",
        starter: `Z = pd.DataFrame((O - E) / np.sqrt(E), index=T.index, columns=T.columns)
worst_region = ...
print(Z.round(2)); print("largest excess of defaults:", worst_region)
`,
        check: `assert worst_region == Z[1].idxmax()`,
        solution: `Z = pd.DataFrame((O - E) / np.sqrt(E), index=T.index, columns=T.columns)
worst_region = Z[1].idxmax()
print(Z.round(2)); print("largest excess of defaults:", worst_region)
`,
      },
      {
        id: "group", title: "Applicant group × default — and the confounder",
        prompt: "Test `applicant_group` × `defaulted` and store `p_group`. Then, within *each* income tercile (`pd.qcut(annual_income, 3)`), run the same test and collect the p-values in a list `p_within`. If group and default look dependent overall but not within income bands, income is doing the work.",
        starter: `p_group = stats.chi2_contingency(pd.crosstab(lending["applicant_group"], lending["defaulted"]), correction=False)[1]
lending["inc_band"] = pd.qcut(lending["annual_income"], 3, labels=["low", "mid", "high"])
p_within = []
for band, g in lending.groupby("inc_band", observed=True):
    p_within.append(...)
print(f"overall p = {p_group:.4f}   within income bands: {[round(x, 3) for x in p_within]}")
`,
        check: `assert len(p_within) == 3 and all(0 <= x <= 1 for x in p_within)`,
        solution: `p_group = stats.chi2_contingency(pd.crosstab(lending["applicant_group"], lending["defaulted"]), correction=False)[1]
lending["inc_band"] = pd.qcut(lending["annual_income"], 3, labels=["low", "mid", "high"])
p_within = []
for band, g in lending.groupby("inc_band", observed=True):
    p_within.append(stats.chi2_contingency(pd.crosstab(g["applicant_group"], g["defaulted"]), correction=False)[1])
print(f"overall p = {p_group:.4f}   within income bands: {[round(x, 3) for x in p_within]}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "For a 3 × 4 contingency table, df = …", choices: ["12", "6", "11", "2"], answer: 1, why: "(r−1)(c−1) = 2 × 3 = 6." },
      { id: "q2", q: "The expected count in cell (i, j) under independence is…", choices: ["n / (r·c)", "(row total × column total) / n", "row total / c", "observed count"], answer: 1, why: "P(row)·P(column)·n." },
      { id: "q3", q: "A significant χ² test of independence between region and default tells you…", choices: ["Region causes default", "The default rate differs by region — not why", "Which region is unfair", "Nothing"], answer: 1, why: "Dependence, not mechanism. Confounders such as income need regression with controls." },
      { id: "q4", q: "Standardised residuals beyond ±2 in a cell mean…", choices: ["A data error", "That cell departs noticeably from what independence predicts", "The test is invalid", "The cell should be deleted"], answer: 1, why: "They locate where the dependence lives after a significant overall test." },
    ],
  },

  {
    id: "w6-nonparametric-one-two",
    session: 13, track: "stats", minutes: 50, setup: NP, packages: ["scipy"],
    title: "Nonparametric tests I: sign test, Wilcoxon rank-sum and signed-rank (ch 14 §14.1–14.4)",
    summary: "When the normality assumption fails or data are ranks, work with ranks instead of values: the sign test for a median, the rank-sum test for two independent samples, and the signed-rank test for paired data.",
    video: {
      youtubeId: "2AqoK8itEFQ", title: "Wilcoxon signed-rank test", channel: "numiqo", minutes: 10,
      watchFor: [
        "Rank the absolute differences, then attach the signs back.",
        "T₊ and T₋: the sums of ranks of positive and negative differences.",
        "Small n uses a table; large n uses a normal approximation.",
      ],
    },
    reading: {
      keyIdea: "Nonparametric (distribution-free) tests replace values with ranks and make no normality assumption. Sign test: H₀ about a population median η. Wilcoxon rank-sum: two independent samples, H₀ identical distributions. Wilcoxon signed-rank: paired differences. Each has a small-sample exact form and a large-sample z approximation.",
      body: [
        "**When (§14.1).** Small samples from clearly non-normal populations (heavy tails, skew), ordinal data (ratings 1–5), or outliers that would dominate a mean. The price: less power than the t-test *when* the data really are normal.",
        "**Sign test (§14.2)** for a median η: `H₀: η = η₀`. Count S = the number of observations above η₀; under H₀, S ~ Binomial(n, 0.5). Large n: `z = (S − 0.5n)/(0.5√n)`. It uses only signs, so it is robust but weak.",
        "**Wilcoxon rank-sum (§14.3)** — two independent samples (equivalently the Mann–Whitney U). Pool, rank all observations, sum the ranks of sample 1 (T₁). Under H₀ (identical distributions) T₁ has known mean `n₁(n₁+n₂+1)/2` and variance `n₁n₂(n₁+n₂+1)/12`; large samples use `z`. `scipy.stats.mannwhitneyu(a, b)` or `ranksums`.",
        "**Wilcoxon signed-rank (§14.4)** — paired differences. Rank |dᵢ| (drop zeros), sum ranks of positives (T₊) and negatives (T₋). Under H₀ they are exchangeable; `scipy.stats.wilcoxon(a, b)`.",
        "**Reporting.** State the hypotheses in terms of distributions/medians, the statistic, the p-value, and *why* you chose the rank test (e.g. 'balances are right-skewed with n = 18 per branch').",
      ],
    },
    exercises: [
      {
        id: "sign", title: "Sign test for a median balance",
        prompt: "Test whether the median `balance` in `branches` is $3,500 (`H₀: η = 3500`). Store `S` = count above 3500 (ignore ties), the two-sided binomial p-value `p_sign`, and the large-sample z `z_sign`.",
        starter: `from scipy import stats
b = branches["balance"].to_numpy()
b = b[b != 3500]
n = len(b)
S = int((b > 3500).sum())
p_sign = stats.binomtest(S, n, 0.5).pvalue
z_sign = ...
print(f"n={n} S={S}  exact p={p_sign:.4f}   z={z_sign:.2f}")
`,
        check: `assert abs(z_sign - (S - 0.5*n) / (0.5*np.sqrt(n))) < 1e-9, "z = (S − 0.5n)/(0.5√n)"`,
        solution: `from scipy import stats
b = branches["balance"].to_numpy()
b = b[b != 3500]
n = len(b)
S = int((b > 3500).sum())
p_sign = stats.binomtest(S, n, 0.5).pvalue
z_sign = (S - 0.5*n) / (0.5*np.sqrt(n))
print(f"n={n} S={S}  exact p={p_sign:.4f}   z={z_sign:.2f}")
`,
      },
      {
        id: "ranksum", title: "Rank-sum: do two branches' balances differ?",
        prompt: "Take 20 random Ogden and 20 random Logan balances (`rng.choice`, no replacement). Compute the rank-sum `T1` for Ogden by pooling and ranking (`stats.rankdata`), its null mean `mu_T` and sd `sd_T`, and `z_rs`. Compare with `stats.mannwhitneyu(..., alternative='two-sided')`.",
        starter: `og = rng.choice(branches.loc[branches.branch == "Ogden", "balance"].to_numpy(), 20, replace=False)
lg = rng.choice(branches.loc[branches.branch == "Logan", "balance"].to_numpy(), 20, replace=False)
n1, n2 = len(og), len(lg)
ranks = stats.rankdata(np.concatenate([og, lg]))
T1 = ranks[:n1].sum()
mu_T = n1 * (n1 + n2 + 1) / 2
sd_T = ...
z_rs = (T1 - mu_T) / sd_T
mw = stats.mannwhitneyu(og, lg, alternative="two-sided")
print(f"T1={T1:.0f}  E[T1]={mu_T:.0f}  sd={sd_T:.2f}  z={z_rs:.2f}   Mann–Whitney p={mw.pvalue:.3f}")
`,
        check: `assert abs(sd_T - np.sqrt(n1*n2*(n1+n2+1)/12)) < 1e-9, "sd = √(n1·n2·(n1+n2+1)/12)"`,
        solution: `og = rng.choice(branches.loc[branches.branch == "Ogden", "balance"].to_numpy(), 20, replace=False)
lg = rng.choice(branches.loc[branches.branch == "Logan", "balance"].to_numpy(), 20, replace=False)
n1, n2 = len(og), len(lg)
ranks = stats.rankdata(np.concatenate([og, lg]))
T1 = ranks[:n1].sum()
mu_T = n1 * (n1 + n2 + 1) / 2
sd_T = np.sqrt(n1 * n2 * (n1 + n2 + 1) / 12)
z_rs = (T1 - mu_T) / sd_T
mw = stats.mannwhitneyu(og, lg, alternative="two-sided")
print(f"T1={T1:.0f}  E[T1]={mu_T:.0f}  sd={sd_T:.2f}  z={z_rs:.2f}   Mann–Whitney p={mw.pvalue:.3f}")
`,
      },
      {
        id: "signed", title: "Signed-rank for paired data",
        prompt: "Simulate 15 customers' satisfaction *before* and *after* a change: `before = rng.normal(5, 1, 15)`, `after = before + rng.exponential(0.4, 15) − 0.2` (skewed shift). Compute `d = after − before`, `T_plus` (sum of ranks of positive d) and the signed-rank p-value `p_sr` from `stats.wilcoxon`.",
        starter: `before = rng.normal(5, 1, 15)
after = before + rng.exponential(0.4, 15) - 0.2
d = after - before
r = stats.rankdata(np.abs(d))
T_plus = ...
T_minus = r[d < 0].sum()
p_sr = stats.wilcoxon(after, before).pvalue
print(f"T+={T_plus:.0f}  T−={T_minus:.0f}   p={p_sr:.4f}")
`,
        check: `assert abs(T_plus - r[d > 0].sum()) < 1e-9 and abs(T_plus + T_minus - 15*16/2) < 1e-9`,
        solution: `before = rng.normal(5, 1, 15)
after = before + rng.exponential(0.4, 15) - 0.2
d = after - before
r = stats.rankdata(np.abs(d))
T_plus = r[d > 0].sum()
T_minus = r[d < 0].sum()
p_sr = stats.wilcoxon(after, before).pvalue
print(f"T+={T_plus:.0f}  T−={T_minus:.0f}   p={p_sr:.4f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "Nonparametric tests are preferred when…", choices: ["n is huge", "Data are ranks, heavily skewed, or n is small and non-normal", "You want maximum power under normality", "Variances are equal"], answer: 1, why: "They drop the normality assumption at the cost of some power when data are in fact normal." },
      { id: "q2", q: "The sign test statistic S under H₀ follows…", choices: ["Normal(0,1)", "Binomial(n, 0.5)", "t with n−1 df", "χ²"], answer: 1, why: "Each observation is above or below η₀ with probability ½ under H₀." },
      { id: "q3", q: "The Wilcoxon rank-sum test is for…", choices: ["Paired data", "Two independent samples", "One median", "Three or more groups"], answer: 1, why: "Independent samples → rank-sum; paired → signed-rank; k groups → Kruskal–Wallis." },
      { id: "q4", q: "In the signed-rank test, differences of exactly zero are…", choices: ["Ranked first", "Dropped, and n reduced", "Counted as positive", "Counted twice"], answer: 1, why: "A zero difference carries no sign information." },
      { id: "q5", q: "Under H₀ the expected rank sum for sample 1 is…", choices: ["n₁n₂/2", "n₁(n₁+n₂+1)/2", "(n₁+n₂)/2", "n₁²"], answer: 1, why: "Sample 1 should hold an average share of the ranks 1 … n₁+n₂." },
    ],
  },

  {
    id: "w6-nonparametric-many",
    session: 13, track: "stats", minutes: 45, setup: NP, packages: ["scipy"],
    title: "Nonparametric tests II: Kruskal–Wallis and Friedman (ch 14 §14.5–14.6)",
    summary: "Rank-based analysis of variance: Kruskal–Wallis for k independent samples (completely randomised design) and the Friedman test for a randomised block design.",
    video: {
      youtubeId: "l86wEhUzkY4", title: "Kruskal-Wallis test", channel: "numiqo", minutes: 8,
      watchFor: [
        "It is the rank-sum test extended to k groups — pool, rank, compare mean ranks.",
        "H ≈ χ² with k − 1 df when every group has at least 5 observations.",
        "A significant H says 'at least one distribution differs' — follow with pairwise rank-sum tests.",
      ],
    },
    reading: {
      keyIdea: "Kruskal–Wallis: pool all k samples, rank, and compute `H = 12/(n(n+1)) · Σ Rⱼ²/nⱼ − 3(n+1)`; under H₀ (identical distributions) H ~ χ²(k−1) when each nⱼ ≥ 5. Friedman does the same within blocks: rank within each block, `F_r = 12/(bk(k+1)) · Σ Rⱼ² − 3b(k+1)` ~ χ²(k−1).",
      body: [
        "**Kruskal–Wallis H test (§14.5)** — the nonparametric analogue of one-way ANOVA. `H₀`: the k probability distributions are identical; `Hₐ`: at least two differ. Rank all n observations together, sum ranks per group (Rⱼ), plug into H. Reject for `H > χ²_α` with k−1 df. `scipy.stats.kruskal(*groups)`.",
        "**Friedman F_r test (§14.6)** — the analogue of a randomised block ANOVA. With b blocks (e.g. customers) each receiving all k treatments (e.g. three statement designs), rank *within each block*, sum ranks per treatment, compute F_r. `scipy.stats.friedmanchisquare(*treatment_columns)`.",
        "**Conditions.** K–W: independent random samples, each nⱼ ≥ 5 for the χ² approximation. Friedman: b ≥ 5 blocks or k ≥ 5 treatments (either) for the approximation.",
        "**After rejection.** Neither test says *which* groups differ; use pairwise rank-sum (or signed-rank for Friedman) tests with a Bonferroni-adjusted α — the multiple-comparisons discipline from the inference chapters.",
        "**Choosing.** Continuous, roughly normal → ANOVA; skewed/ordinal/small → Kruskal–Wallis; paired-across-treatments → Friedman.",
      ],
    },
    exercises: [
      {
        id: "kw", title: "Kruskal–Wallis by hand on branch balances",
        prompt: "Do balances differ across the four branches? Pool all balances, rank them, compute the per-branch rank sums `R` (dict), `H` by the formula, and the p-value `p_kw` with 3 df. Confirm against `stats.kruskal` (its statistic includes a tie correction, so allow a small gap).",
        starter: `from scipy import stats
branches["rank"] = stats.rankdata(branches["balance"])
n = len(branches)
R = branches.groupby("branch")["rank"].sum().to_dict()
nj = branches["branch"].value_counts().to_dict()
H = ...
p_kw = stats.chi2.sf(H, df=len(R) - 1)
kw = stats.kruskal(*[g["balance"].to_numpy() for _, g in branches.groupby("branch")])
print(f"H={H:.3f} p={p_kw:.4f}   scipy H={kw.statistic:.3f} p={kw.pvalue:.4f}")
`,
        check: `assert abs(H - (12/(n*(n+1)) * sum(R[b]**2/nj[b] for b in R) - 3*(n+1))) < 1e-9, "H = 12/(n(n+1)) Σ R_j²/n_j − 3(n+1)"
assert abs(H - kw.statistic) < 0.05`,
        solution: `from scipy import stats
branches["rank"] = stats.rankdata(branches["balance"])
n = len(branches)
R = branches.groupby("branch")["rank"].sum().to_dict()
nj = branches["branch"].value_counts().to_dict()
H = 12 / (n * (n + 1)) * sum(R[b]**2 / nj[b] for b in R) - 3 * (n + 1)
p_kw = stats.chi2.sf(H, df=len(R) - 1)
kw = stats.kruskal(*[g["balance"].to_numpy() for _, g in branches.groupby("branch")])
print(f"H={H:.3f} p={p_kw:.4f}   scipy H={kw.statistic:.3f} p={kw.pvalue:.4f}")
`,
      },
      {
        id: "friedman", title: "Friedman test on a blocked design",
        prompt: "Ten customers (blocks) each rate three statement layouts (treatments) on a 1–7 ordinal scale (simulated below). Rank *within each row*, compute the treatment rank sums `Rt`, the statistic `Fr` by the formula and its p-value `p_fr`; confirm against `stats.friedmanchisquare`.",
        starter: `b, k = 10, 3
ratings = np.clip(np.round(rng.normal([4, 5, 4.6], 1, size=(b, k))), 1, 7)
within = np.apply_along_axis(stats.rankdata, 1, ratings)
Rt = within.sum(axis=0)
Fr = ...
p_fr = stats.chi2.sf(Fr, df=k - 1)
fr = stats.friedmanchisquare(*ratings.T)
print(f"treatment rank sums {Rt}  F_r={Fr:.3f} p={p_fr:.4f}   scipy {fr.statistic:.3f}, {fr.pvalue:.4f}")
`,
        check: `assert abs(Fr - (12/(b*k*(k+1)) * (Rt**2).sum() - 3*b*(k+1))) < 1e-9, "F_r = 12/(bk(k+1)) Σ R_j² − 3b(k+1)"`,
        solution: `b, k = 10, 3
ratings = np.clip(np.round(rng.normal([4, 5, 4.6], 1, size=(b, k))), 1, 7)
within = np.apply_along_axis(stats.rankdata, 1, ratings)
Rt = within.sum(axis=0)
Fr = 12 / (b * k * (k + 1)) * (Rt**2).sum() - 3 * b * (k + 1)
p_fr = stats.chi2.sf(Fr, df=k - 1)
fr = stats.friedmanchisquare(*ratings.T)
print(f"treatment rank sums {Rt}  F_r={Fr:.3f} p={p_fr:.4f}   scipy {fr.statistic:.3f}, {fr.pvalue:.4f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "Kruskal–Wallis is the nonparametric counterpart of…", choices: ["The paired t-test", "One-way ANOVA", "Simple regression", "The χ² test of independence"], answer: 1, why: "k independent samples, compared through ranks." },
      { id: "q2", q: "With 4 groups, H is compared to a χ² with…", choices: ["4 df", "3 df", "n − 4 df", "1 df"], answer: 1, why: "k − 1." },
      { id: "q3", q: "The Friedman test ranks…", choices: ["All observations together", "Within each block", "Only the treatment means", "Nothing — it uses raw values"], answer: 1, why: "Blocks remove between-subject variation; ranking within a block keeps that benefit." },
      { id: "q4", q: "After a significant Kruskal–Wallis test you should…", choices: ["Stop — the answer is complete", "Run pairwise rank-sum tests with an adjusted α", "Run ANOVA", "Increase n"], answer: 1, why: "H only says at least one distribution differs." },
    ],
  },

  {
    id: "w7-spearman-and-choosing",
    session: 13, track: "stats", minutes: 45, setup: NP, packages: ["scipy"],
    title: "Spearman's rank correlation and choosing the right test (ch 14 §14.7 + synthesis)",
    summary: "The rank version of correlation, then the decision tree the whole course has been building: what type of data, how many groups, paired or not, normal or not — which test.",
    video: {
      youtubeId: "APlQV0b8TjM", title: "Spearman's rank correlation", channel: "ritvikmath", minutes: 9,
      watchFor: [
        "Replace both variables by their ranks, then compute Pearson's r on the ranks.",
        "With no ties: r_s = 1 − 6Σd²/(n(n²−1)).",
        "Spearman measures *monotonic* association — any consistently increasing relation scores near 1.",
      ],
    },
    reading: {
      keyIdea: "`r_s = 1 − 6Σdᵢ²/(n(n²−1))`, where dᵢ is the difference between the ranks of xᵢ and yᵢ. It measures monotonic (not necessarily linear) association and is immune to outliers in the values. Test `H₀: ρ_s = 0` with a table for small n or `z = r_s√(n−1)` for large n.",
      body: [
        "**Spearman's ρ_s (§14.7).** Rank x and y separately; `r_s` is Pearson's r computed on the ranks. The shortcut formula holds only without ties; with ties, compute Pearson on the ranks directly (`scipy.stats.spearmanr` does this).",
        "**Pearson vs Spearman.** Pearson: linear association between values, sensitive to outliers. Spearman: monotonic association between ranks, robust. A curved-but-increasing relation gives Pearson < 1 and Spearman ≈ 1. Report which one and why.",
        "**The test-selection tree** (the most examinable synthesis in the course):",
        "1. *What is y?* Count/category → ch 13 (χ² goodness-of-fit for one variable; χ² independence for two). Numeric → continue.",
        "2. *How many groups and are they paired?* One sample → t-test on a mean (normal or n ≥ 30) / sign test on a median. Two independent → two-sample t / Wilcoxon rank-sum. Two paired → paired t / signed-rank. k independent → ANOVA / Kruskal–Wallis. k in blocks → block ANOVA / Friedman.",
        "3. *Is the relationship between two numeric variables the question?* Linear with normal errors → regression & Pearson r (ch 11–12). Monotonic, ordinal, or outliers → Spearman.",
        "4. *Parametric or nonparametric?* Check normality (Q–Q plot, sample size). Small n + skew/outliers/ordinal data → the rank test in the same row.",
      ],
    },
    exercises: [
      {
        id: "spearman", title: "Spearman by the shortcut formula",
        prompt: "Sample 25 loans (no ties expected in the continuous columns). Compute Spearman's `r_s` between `annual_income` and `loan_amount` with `1 − 6Σd²/(n(n²−1))`, and compare with `scipy.stats.spearmanr` and Pearson `r_p`.",
        starter: `from scipy import stats
s = lending.sample(25, random_state=7)
rx = stats.rankdata(s["annual_income"]); ry = stats.rankdata(s["loan_amount"])
d = rx - ry
n = len(s)
r_s = ...
r_p = stats.pearsonr(s["annual_income"], s["loan_amount"])[0]
print(f"Spearman by formula {r_s:.4f}   scipy {stats.spearmanr(s['annual_income'], s['loan_amount'])[0]:.4f}   Pearson {r_p:.4f}")
`,
        check: `assert abs(r_s - (1 - 6*(d**2).sum()/(n*(n**2-1)))) < 1e-9
assert abs(r_s - stats.spearmanr(s["annual_income"], s["loan_amount"])[0]) < 1e-6`,
        solution: `from scipy import stats
s = lending.sample(25, random_state=7)
rx = stats.rankdata(s["annual_income"]); ry = stats.rankdata(s["loan_amount"])
d = rx - ry
n = len(s)
r_s = 1 - 6 * (d**2).sum() / (n * (n**2 - 1))
r_p = stats.pearsonr(s["annual_income"], s["loan_amount"])[0]
print(f"Spearman by formula {r_s:.4f}   scipy {stats.spearmanr(s['annual_income'], s['loan_amount'])[0]:.4f}   Pearson {r_p:.4f}")
`,
      },
      {
        id: "robust", title: "One outlier, two correlations",
        prompt: "Build `x = np.arange(1, 21)` and `y = x**2` (curved, perfectly monotonic). Store `pear` and `spear`. Then set `y[19] = -500` (one outlier) and store `pear_out`, `spear_out`. Pearson collapses; Spearman loses only what one displaced rank can cost.",
        starter: `x = np.arange(1, 21).astype(float); y = x**2
pear, spear = stats.pearsonr(x, y)[0], stats.spearmanr(x, y)[0]
y_out = y.copy(); y_out[19] = -500
pear_out, spear_out = ...
print(f"clean: Pearson {pear:.3f} Spearman {spear:.3f}   with outlier: Pearson {pear_out:.3f} Spearman {spear_out:.3f}")
`,
        check: `assert abs(spear - 1) < 1e-9, "A perfectly monotonic relation has Spearman 1"
assert pear_out < 0.4 and spear_out > 0.65, "The outlier should damage Pearson far more than Spearman"`,
        solution: `x = np.arange(1, 21).astype(float); y = x**2
pear, spear = stats.pearsonr(x, y)[0], stats.spearmanr(x, y)[0]
y_out = y.copy(); y_out[19] = -500
pear_out, spear_out = stats.pearsonr(x, y_out)[0], stats.spearmanr(x, y_out)[0]
print(f"clean: Pearson {pear:.3f} Spearman {spear:.3f}   with outlier: Pearson {pear_out:.3f} Spearman {spear_out:.3f}")
`,
      },
      {
        id: "choose", title: "Choose the test",
        prompt: "For each scenario, put the right test name in the `answers` dict. Options: `'chi2_gof'`, `'chi2_indep'`, `'two_sample_t'`, `'paired_t'`, `'rank_sum'`, `'signed_rank'`, `'anova'`, `'kruskal'`, `'friedman'`, `'regression'`, `'spearman'`.",
        starter: `answers = {
    # 1. Do default rates differ between applicant groups A and B? (two categorical variables, counts)
    1: ...,
    # 2. Fifteen customers' ordinal 1–5 ratings before and after a redesign
    2: ...,
    # 3. Balances (right-skewed, n≈12 each) across four branches
    3: ...,
    # 4. Does loan amount grow with income? Continuous, roughly linear, n = 4,000
    4: ...,
    # 5. Is the mix of products (Checking/Savings/CD) 50/30/20 as the plan assumed?
    5: ...,
    # 6. Agreement between two analysts' rankings of 30 vendors
    6: ...,
}
print(answers)
`,
        check: `key = {1: "chi2_indep", 2: "signed_rank", 3: "kruskal", 4: "regression", 5: "chi2_gof", 6: "spearman"}
wrong = [k for k in key if answers.get(k) != key[k]]
assert not wrong, f"Reconsider scenarios {wrong}"`,
        solution: `answers = {1: "chi2_indep", 2: "signed_rank", 3: "kruskal", 4: "regression", 5: "chi2_gof", 6: "spearman"}
print(answers)

print(answers)
`,
        hint: "Categorical y → χ². Paired ordinal → signed-rank. k skewed small groups → Kruskal–Wallis. Rankings ↔ rankings → Spearman.",
      },
    ],
    quiz: [
      { id: "q1", q: "Spearman's r_s measures…", choices: ["Linear association between values", "Monotonic association between ranks", "Causation", "Variance"], answer: 1, why: "It is Pearson's r on ranks; any consistently increasing relation scores near 1." },
      { id: "q2", q: "The shortcut 1 − 6Σd²/(n(n²−1)) is valid…", choices: ["Always", "Only with no tied ranks", "Only for n > 30", "Only for normal data"], answer: 1, why: "With ties, compute Pearson on the ranks instead (scipy does)." },
      { id: "q3", q: "Twelve customers rate three app screens; which test compares the screens?", choices: ["Kruskal–Wallis", "Friedman", "Two-sample t", "χ² independence"], answer: 1, why: "Each customer is a block receiving all three treatments; ordinal ratings → Friedman." },
      { id: "q4", q: "Two categorical variables, one table of counts — the test is…", choices: ["Spearman", "χ² test of independence", "Rank-sum", "Regression"], answer: 1, why: "Ch 13's two-way table." },
      { id: "q5", q: "A dataset has y = x³ exactly. Pearson r and Spearman r_s are…", choices: ["Both 1", "Pearson < 1, Spearman = 1", "Both 0", "Pearson = 1, Spearman < 1"], answer: 1, why: "Perfectly monotonic but not linear." },
    ],
  },

  {
    id: "w7-case-study-workflow",
    session: 14, track: "stats", minutes: 60, setup: NP, packages: ["statsmodels", "scipy"],
    title: "The case study: an end-to-end analysis workflow",
    summary: "The 200-point deliverable rehearsed once in full: question → data description → assumption checks → the right test or model → diagnostics → an APA-style write-up with tables and figures. Run on the lending data so the real one is a second pass, not a first.",
    reading: {
      keyIdea: "A case study is graded on the *chain of reasoning*, not the p-value: a clear question, the right method for the data type, checked assumptions, correct interpretation in context, honest limitations. Build the notebook in that order and the paper writes itself.",
      body: [
        "**1 Question.** One sentence with the population, the variables and the parameter: 'Among consumer loans at this bank, is the default rate associated with the debt-to-income ratio after adjusting for credit score and income?'",
        "**2 Data description.** n, variables and types, missingness, `describe()`, one figure per key variable (histogram or bar chart), a correlation matrix for numeric predictors. Note skew and outliers *here* — they decide the method.",
        "**3 Method choice.** Walk the decision tree from the previous lesson and say why: y categorical → χ² or logistic; y numeric with predictors → regression; skewed small groups → rank tests. State H₀/Hₐ and α before looking at results.",
        "**4 Assumptions.** Regression: residual plots, Q–Q, VIF. χ²: expected counts ≥ 5. Rank tests: independence and the sample-size condition for the approximation. Show the check, not just the claim.",
        "**5 Results.** Statistic, df, p, effect size (coefficient with CI, r², odds ratio, difference in medians). Tables in APA style (title above, notes below, no vertical lines); figures with captions. Interpret each number *in units*.",
        "**6 Limitations & conclusion.** Observational data → association not causation; unmeasured confounders; extrapolation; multiple comparisons. Then answer the question in one paragraph a manager could read.",
        "**APA 7 mechanics** — level headings, `Table 1` / `Figure 1` labels, in-text stats formatted like `χ²(2, N = 4000) = 12.4, p = .002` or `b = 0.32, 95% CI [0.29, 0.35], p < .001`. Use the template in `ethics/apa7-template.md`.",
      ],
    },
    exercises: [
      {
        id: "describe", title: "Step 2 — describe before you test",
        prompt: "Produce the description table `desc` (`describe().T` for the numeric columns `annual_income, loan_amount, dti_ratio, credit_score, employment_years`), and store the skewness of `loan_amount` as `skew_loan`. Plot histograms of income and loan amount side by side.",
        starter: `num = ["annual_income", "loan_amount", "dti_ratio", "credit_score", "employment_years"]
desc = lending[num].describe().T
skew_loan = ...
fig, ax = plt.subplots(1, 2, figsize=(10, 3.4))
ax[0].hist(lending["annual_income"], bins=40); ax[0].set_title("annual_income")
ax[1].hist(lending["loan_amount"], bins=40); ax[1].set_title("loan_amount")
plt.show()
print(desc.round(2)); print(f"skewness of loan_amount = {skew_loan:.2f}")
`,
        check: `assert abs(skew_loan - lending["loan_amount"].skew()) < 1e-9
assert skew_loan > 0.5, "Loan amounts are right-skewed — that matters for the method"`,
        solution: `num = ["annual_income", "loan_amount", "dti_ratio", "credit_score", "employment_years"]
desc = lending[num].describe().T
skew_loan = lending["loan_amount"].skew()
fig, ax = plt.subplots(1, 2, figsize=(10, 3.4))
ax[0].hist(lending["annual_income"], bins=40); ax[0].set_title("annual_income")
ax[1].hist(lending["loan_amount"], bins=40); ax[1].set_title("loan_amount")
plt.show()
print(desc.round(2)); print(f"skewness of loan_amount = {skew_loan:.2f}")
`,
      },
      {
        id: "model", title: "Steps 3–5 — the model and an APA sentence",
        prompt: "Fit a logistic regression of `defaulted` on `dti_ratio, credit_score, annual_income` with statsmodels `Logit`. Store the odds ratio for a 0.1 increase in DTI as `or_dti` and its 95% CI `(or_lo, or_hi)`, then build the APA-style sentence `apa` in the form `'b = …, OR (per 0.1 DTI) = …, 95% CI [… , …], p …'`.",
        starter: `import statsmodels.api as sm
X = sm.add_constant(lending[["dti_ratio", "credit_score", "annual_income"]])
fit = sm.Logit(lending["defaulted"], X).fit(disp=0)
b = fit.params["dti_ratio"]; lo, hi = fit.conf_int().loc["dti_ratio"]
or_dti = np.exp(0.1 * b)
or_lo, or_hi = ...
p = fit.pvalues["dti_ratio"]
apa = f"b = {b:.2f}, OR (per 0.1 DTI) = {or_dti:.2f}, 95% CI [{or_lo:.2f}, {or_hi:.2f}], " + ("p < .001" if p < .001 else f"p = {p:.3f}")
print(apa)
`,
        check: `assert abs(or_lo - np.exp(0.1*lo)) < 1e-9 and abs(or_hi - np.exp(0.1*hi)) < 1e-9, "Exponentiate the CI endpoints"
assert apa.startswith("b = ")`,
        solution: `import statsmodels.api as sm
X = sm.add_constant(lending[["dti_ratio", "credit_score", "annual_income"]])
fit = sm.Logit(lending["defaulted"], X).fit(disp=0)
b = fit.params["dti_ratio"]; lo, hi = fit.conf_int().loc["dti_ratio"]
or_dti = np.exp(0.1 * b)
or_lo, or_hi = np.exp(0.1 * lo), np.exp(0.1 * hi)
p = fit.pvalues["dti_ratio"]
apa = f"b = {b:.2f}, OR (per 0.1 DTI) = {or_dti:.2f}, 95% CI [{or_lo:.2f}, {or_hi:.2f}], " + ("p < .001" if p < .001 else f"p = {p:.3f}")
print(apa)
`,
      },
      {
        id: "table", title: "Step 5 — an APA-ready results table",
        prompt: "Build a DataFrame `results` with columns `Predictor, b, SE, OR, CI low, CI high, p` for the three predictors (not the constant), rounded to 3 decimals, and print it with `to_string(index=False)`. Sort by p ascending.",
        starter: `ci = fit.conf_int()
rows = []
for name in ["dti_ratio", "credit_score", "annual_income"]:
    rows.append({"Predictor": name, "b": fit.params[name], "SE": fit.bse[name], "OR": np.exp(fit.params[name]),
                 "CI low": np.exp(ci.loc[name, 0]), "CI high": np.exp(ci.loc[name, 1]), "p": fit.pvalues[name]})
results = ...
print("Table 1\\nLogistic Regression Predicting Default\\n")
print(results.to_string(index=False))
`,
        check: `assert list(results.columns) == ["Predictor", "b", "SE", "OR", "CI low", "CI high", "p"]
assert results["p"].is_monotonic_increasing and len(results) == 3`,
        solution: `ci = fit.conf_int()
rows = []
for name in ["dti_ratio", "credit_score", "annual_income"]:
    rows.append({"Predictor": name, "b": fit.params[name], "SE": fit.bse[name], "OR": np.exp(fit.params[name]),
                 "CI low": np.exp(ci.loc[name, 0]), "CI high": np.exp(ci.loc[name, 1]), "p": fit.pvalues[name]})
results = pd.DataFrame(rows).sort_values("p").round(3)
print("Table 1\\nLogistic Regression Predicting Default\\n")
print(results.to_string(index=False))
`,
      },
    ],
    quiz: [
      { id: "q1", q: "The first thing in a case study, before any test, is…", choices: ["The p-value", "A one-sentence question naming population, variables and parameter", "The conclusion", "The literature review"], answer: 1, why: "Everything else — method, hypotheses, interpretation — follows from the question." },
      { id: "q2", q: "The APA format for a chi-square result is…", choices: ["chi = 12.4", "χ²(2, N = 4000) = 12.4, p = .002", "p < 0.05 (chi-square)", "12.4 (2)"], answer: 1, why: "Statistic, df and N in parentheses, then the p-value with no leading zero." },
      { id: "q3", q: "Why report an effect size (coefficient, OR, r²) and not only p?", choices: ["APA requires it and p says nothing about magnitude", "It is optional", "To make the paper longer", "p already contains it"], answer: 0, why: "With n = 4,000 tiny effects are 'significant'; the size is what a decision depends on." },
      { id: "q4", q: "Observational lending data show DTI is associated with default. The correct claim is…", choices: ["High DTI causes default", "DTI is associated with default after adjusting for the included covariates; causation is not established", "Lowering DTI will stop defaults", "The association is spurious"], answer: 1, why: "Association with controls, plus an explicit limitation about unmeasured confounders." },
    ],
  },

  {
    id: "w8-review-and-practical-connection",
    session: 15, track: "stats", minutes: 50, setup: NP, packages: ["scipy", "statsmodels"],
    title: "Final review: every method in one notebook, and the practical connection to AI",
    summary: "One pass across probability, regression, categorical and nonparametric methods, plus the bridge the syllabus asks for: where each of these lives inside a modern AI pipeline.",
    reading: {
      keyIdea: "Statistics for AI is not a separate subject from AI: probability is what a model's output *is*; regression is the simplest learner; χ² and rank tests are how we audit data and compare models; assumptions checks are model validation. The final asks you to connect them.",
      body: [
        "**Probability (ch 3–5) → model outputs.** A classifier emits P(default | x). Calibration asks whether those probabilities are honest; Bayes' rule is how a fraud score turns into a posterior given the base rate. Binomial and Poisson describe counts of events (alerts per day, defaults per 1,000 loans); the normal underlies every 'z-score' feature and confidence band.",
        "**Regression (ch 11–12) → the first learner.** OLS is a linear model trained by least squares; logistic regression is the baseline every classifier must beat. Interactions and quadratics are hand-made features; dummy variables are one-hot encoding; adjusted R² and nested F-tests are the ancestors of cross-validated model selection; VIF is feature redundancy; residual analysis is error analysis.",
        "**Categorical (ch 13) → data audit and fairness.** χ² goodness-of-fit checks whether a training sample matches the population mix (representation bias); the test of independence between group and outcome is the first fairness diagnostic — necessary, never sufficient.",
        "**Nonparametric (ch 14) → robust comparison.** Wilcoxon and Kruskal–Wallis compare model scores across folds or across cohorts without assuming normality; Spearman measures rank agreement between two models' rankings or between a feature and a target. Mann–Whitney U is literally the AUC.",
        "**Python (Das) → the medium.** Every method above is ten lines of numpy/pandas/scipy/statsmodels; functions, classes and files are how those ten lines become a reusable, testable pipeline.",
        "**Exam strategy.** For each question: name the data type, name the design, name the test, state H₀/Hₐ, compute or read the statistic, decide, interpret in context, note one assumption.",
      ],
    },
    exercises: [
      {
        id: "auc-mw", title: "Mann–Whitney U *is* the AUC",
        prompt: "Fit the logistic model from the case study, get predicted probabilities `prob`, then compute the AUC two ways: `roc_auc_score` from sklearn, and `U / (n₁·n₀)` from `stats.mannwhitneyu(prob[defaulted], prob[not defaulted])`. Store `auc_sk` and `auc_mw`; they must agree.",
        starter: `import statsmodels.api as sm
from scipy import stats
from sklearn.metrics import roc_auc_score
X = sm.add_constant(lending[["dti_ratio", "credit_score", "annual_income"]])
fit = sm.Logit(lending["defaulted"], X).fit(disp=0)
prob = fit.predict(X).to_numpy()
y = lending["defaulted"].to_numpy()
auc_sk = roc_auc_score(y, prob)
U = stats.mannwhitneyu(prob[y == 1], prob[y == 0]).statistic
auc_mw = ...
print(f"AUC (sklearn) = {auc_sk:.4f}   U/(n1·n0) = {auc_mw:.4f}")
`,
        check: `assert abs(auc_sk - auc_mw) < 1e-6, "AUC = U / (n1·n0)"`,
        solution: `import statsmodels.api as sm
from scipy import stats
from sklearn.metrics import roc_auc_score
X = sm.add_constant(lending[["dti_ratio", "credit_score", "annual_income"]])
fit = sm.Logit(lending["defaulted"], X).fit(disp=0)
prob = fit.predict(X).to_numpy()
y = lending["defaulted"].to_numpy()
auc_sk = roc_auc_score(y, prob)
U = stats.mannwhitneyu(prob[y == 1], prob[y == 0]).statistic
auc_mw = U / ((y == 1).sum() * (y == 0).sum())
print(f"AUC (sklearn) = {auc_sk:.4f}   U/(n1·n0) = {auc_mw:.4f}")
`,
      },
      {
        id: "audit", title: "A representation-bias audit with χ²",
        prompt: "Suppose the population is 65% group A / 35% group B. Test whether the lending sample's `applicant_group` mix matches (`p_mix`). Then test whether *approval-proxy* (`loan_amount > median`) is independent of group (`p_ind`). Write one sentence `finding` that states both results without claiming causation.",
        starter: `obs = lending["applicant_group"].value_counts().reindex(["A", "B"]).to_numpy()
p_mix = stats.chisquare(obs, len(lending) * np.array([0.65, 0.35])).pvalue
big = lending["loan_amount"] > lending["loan_amount"].median()
p_ind = ...
finding = f"The sample's group mix {'differs from' if p_mix < .05 else 'is consistent with'} the population (p = {p_mix:.3f}); loan size {'is' if p_ind < .05 else 'is not'} associated with group (p = {p_ind:.3f}), which does not by itself establish unfair treatment."
print(finding)
`,
        check: `assert abs(p_ind - stats.chi2_contingency(pd.crosstab(lending["applicant_group"], big), correction=False)[1]) < 1e-9
assert "does not by itself" in finding`,
        solution: `obs = lending["applicant_group"].value_counts().reindex(["A", "B"]).to_numpy()
p_mix = stats.chisquare(obs, len(lending) * np.array([0.65, 0.35])).pvalue
big = lending["loan_amount"] > lending["loan_amount"].median()
p_ind = stats.chi2_contingency(pd.crosstab(lending["applicant_group"], big), correction=False)[1]
finding = f"The sample's group mix {'differs from' if p_mix < .05 else 'is consistent with'} the population (p = {p_mix:.3f}); loan size {'is' if p_ind < .05 else 'is not'} associated with group (p = {p_ind:.3f}), which does not by itself establish unfair treatment."
print(finding)
`,
      },
      {
        id: "grand", title: "The grand tour",
        prompt: "Fill in the `tour` dict with the *name of the method* you'd use (strings from: `binomial, poisson, normal, simple_regression, multiple_regression, logistic, chi2_gof, chi2_indep, rank_sum, signed_rank, kruskal, friedman, spearman`) for each AI-pipeline question.",
        starter: `tour = {
    # a) Expected number of fraud alerts in an hour, given a known average rate
    "a": ...,
    # b) Predict a customer's default (0/1) from several features
    "b": ...,
    # c) Compare F1 scores of two models across 10 CV folds (paired, non-normal)
    "c": ...,
    # d) Does the training set's region mix match the customer base?
    "d": ...,
    # e) Agreement between two models' rankings of 500 applicants by risk
    "e": ...,
    # f) Predict loan amount from income, score, tenure and region
    "f": ...,
}
print(tour)
`,
        check: `key = {"a": "poisson", "b": "logistic", "c": "signed_rank", "d": "chi2_gof", "e": "spearman", "f": "multiple_regression"}
wrong = [k for k in key if tour.get(k) != key[k]]
assert not wrong, f"Reconsider {wrong}"`,
        solution: `tour = {"a": "poisson", "b": "logistic", "c": "signed_rank", "d": "chi2_gof", "e": "spearman", "f": "multiple_regression"}
print(tour)

print(tour)
`,
      },
    ],
    quiz: [
      { id: "q1", q: "The AUC of a classifier equals…", choices: ["Its accuracy", "The Mann–Whitney U divided by n₁n₀ — the probability a random positive outscores a random negative", "Its precision", "R²"], answer: 1, why: "A rank statistic in disguise: ch 14 inside every ML report." },
      { id: "q2", q: "One-hot encoding a category in ML corresponds to McClave's…", choices: ["Interaction terms", "Dummy variables with a base level", "Quadratic terms", "Residual analysis"], answer: 1, why: "Same construction; drop one level to avoid the dummy-variable trap unless the model has no intercept." },
      { id: "q3", q: "A χ² goodness-of-fit test on a training sample's group mix diagnoses…", choices: ["Overfitting", "Representation bias relative to the population", "Label noise", "Multicollinearity"], answer: 1, why: "It compares the sample's category proportions with the population's." },
      { id: "q4", q: "Comparing two models' scores across the same 10 folds calls for…", choices: ["Two-sample t or rank-sum", "Paired t or Wilcoxon signed-rank", "χ²", "Kruskal–Wallis"], answer: 1, why: "The folds pair the observations." },
      { id: "q5", q: "The single sentence an exam answer must always contain is…", choices: ["The software used", "The hypotheses, the decision, and the interpretation in context", "The formula", "The textbook page"], answer: 1, why: "Name the test, state H₀/Hₐ, decide, interpret — every time." },
    ],
  },
];
