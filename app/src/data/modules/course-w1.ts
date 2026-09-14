import type { Module } from "../modules";

const NP = `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
rng = np.random.default_rng(42)`;

/* ============================================================================
   COURSE WEEK 1 — McClave ch 3 (Probability), 4 (Discrete RVs), 5 (Continuous RVs)
   Due with Assignments 1 & 2. These lessons follow the textbook's own
   vocabulary so that homework reads as familiar.
   ========================================================================= */
export const COURSE_W1: Module[] = [
  {
    id: "w1-probability",
    session: 1, track: "stats", minutes: 55, setup: NP,
    title: "Probability, the McClave way (ch 3)",
    summary: "Sample spaces, events, the additive and multiplicative rules, conditional probability, independence — the exact vocabulary Assignment 1 will use, each rule verified by simulation.",
    video: {
      youtubeId: "_IgyaD7vOOA", title: "Conditional Probabilities, Clearly Explained", channel: "StatQuest", minutes: 8,
      watchFor: [
        "'Given' restricts the sample space before you count — that is the whole idea of `P(A|B)`.",
        "The multiplicative rule `P(A∩B) = P(A|B)·P(B)` is just that restriction written as a formula.",
        "Independence: `P(A|B) = P(A)`. Knowing B changes nothing.",
      ],
    },
    reading: {
      keyIdea: "Chapter 3 builds everything from a sample space of equally likely outcomes. Every rule — additive, complementary, multiplicative, conditional — is bookkeeping over counts, which is why simulation checks all of them.",
      body: [
        "**Sample space and events.** An *experiment* has outcomes; the *sample space* `S` is all of them; an *event* is a subset. When outcomes are equally likely, `P(A) = (number of outcomes in A) / (number in S)`. McClave writes sample points as `S: {1, 2, 3, 4, 5, 6}` for a die.",
        "**The rules you will be tested on.** *Complementary*: `P(Aᶜ) = 1 − P(A)`. *Additive*: `P(A ∪ B) = P(A) + P(B) − P(A ∩ B)`; for mutually exclusive events the last term is zero. *Multiplicative*: `P(A ∩ B) = P(A|B)·P(B) = P(B|A)·P(A)`. *Conditional*: `P(A|B) = P(A ∩ B) / P(B)`. *Independence*: `P(A|B) = P(A)`, equivalently `P(A ∩ B) = P(A)·P(B)`.",
        "**Mutually exclusive is not independent.** Two events that cannot both happen (mutually exclusive) are as *dependent* as events get — if one occurs, the other's probability drops to zero. Exam questions love this distinction.",
        "**Bayes' rule** (McClave §3.8) is the multiplicative rule turned around: `P(B|A) = P(A|B)·P(B) / P(A)`, with `P(A)` expanded over the ways A can happen. The base-rate lesson from the fraud module is exactly this rule in action.",
        "**Counting.** The multiplicative counting rule (`n₁ × n₂ × …`), permutations, and combinations `C(n, k) = n! / (k!(n−k)!)` appear in ch 3 exercises; Python's `math.comb(n, k)` computes the last one.",
      ],
    },
    exercises: [
      {
        id: "rules", title: "Verify the additive and multiplicative rules",
        prompt: "Roll one die 200,000 times. Let `A` = 'even' and `B` = '≥ 5'. Compute `p_union` two ways — directly, and via the additive rule — and `p_inter` two ways — directly, and via `P(A|B)·P(B)`. All four must agree.",
        starter: `rolls = rng.integers(1, 7, 200_000)
A = rolls % 2 == 0
B = rolls >= 5
p_union_direct = (A | B).mean()
p_union_rule = A.mean() + B.mean() - (A & B).mean()
p_inter_direct = (A & B).mean()
p_inter_rule = ...          # P(A|B) * P(B), with P(A|B) = A[B].mean()
print(round(p_union_direct,4), round(p_union_rule,4), round(p_inter_direct,4), round(p_inter_rule,4))
`,
        check: `assert abs(p_union_direct - p_union_rule) < 1e-9
assert abs(p_inter_direct - p_inter_rule) < 1e-9, "P(A∩B) must equal P(A|B)·P(B)"
assert abs(p_inter_direct - 1/6) < 0.01`,
        solution: `rolls = rng.integers(1, 7, 200_000)
A = rolls % 2 == 0
B = rolls >= 5
p_union_direct = (A | B).mean()
p_union_rule = A.mean() + B.mean() - (A & B).mean()
p_inter_direct = (A & B).mean()
p_inter_rule = A[B].mean() * B.mean()
print(round(p_union_direct,4), round(p_union_rule,4), round(p_inter_direct,4), round(p_inter_rule,4))
`,
        hint: "`A[B].mean()` is P(A|B). Multiply by `B.mean()`.",
      },
      {
        id: "combos", title: "Combinations, by formula and by enumeration",
        prompt: "How many ways can a bank pick 3 branches to audit out of 8? Compute `by_formula` with `math.comb(8, 3)` and `by_enumeration` with `itertools.combinations`. Then compute the probability that a random audit set of 3 includes the Provo branch, `p_provo`, by enumeration.",
        starter: `import math, itertools
branches = ["Ogden", "Provo", "Logan", "St George", "Sandy", "Orem", "Lehi", "Draper"]
by_formula = math.comb(8, 3)
sets = list(itertools.combinations(branches, 3))
by_enumeration = len(sets)
p_provo = ...
print(by_formula, by_enumeration, round(p_provo, 4))
`,
        check: `assert by_formula == 56 and by_enumeration == 56
assert abs(p_provo - 3/8) < 1e-9, "P(Provo in set) = C(7,2)/C(8,3) = 21/56 = 3/8"`,
        solution: `import math, itertools
branches = ["Ogden", "Provo", "Logan", "St George", "Sandy", "Orem", "Lehi", "Draper"]
by_formula = math.comb(8, 3)
sets = list(itertools.combinations(branches, 3))
by_enumeration = len(sets)
p_provo = sum("Provo" in s for s in sets) / len(sets)
print(by_formula, by_enumeration, round(p_provo, 4))
`,
      },
      {
        id: "bayes-rule", title: "Bayes' rule on a loan screen",
        prompt: "10% of applicants will default. A screening model flags 85% of future defaulters and 12% of non-defaulters. Compute `p_flag` = P(flagged) via the law of total probability, then `p_default_given_flag` via Bayes' rule.",
        starter: `p_d = 0.10
p_flag_given_d = 0.85
p_flag_given_nd = 0.12
p_flag = ...
p_default_given_flag = ...
print(f"P(flag) = {p_flag:.4f}   P(default | flag) = {p_default_given_flag:.4f}")
`,
        check: `assert abs(p_flag - (0.85*0.10 + 0.12*0.90)) < 1e-9
assert abs(p_default_given_flag - (0.85*0.10)/(0.85*0.10 + 0.12*0.90)) < 1e-9`,
        solution: `p_d = 0.10
p_flag_given_d = 0.85
p_flag_given_nd = 0.12
p_flag = p_flag_given_d * p_d + p_flag_given_nd * (1 - p_d)
p_default_given_flag = p_flag_given_d * p_d / p_flag
print(f"P(flag) = {p_flag:.4f}   P(default | flag) = {p_default_given_flag:.4f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "Events A and B are mutually exclusive. They are…", choices: ["Independent", "Dependent — if one occurs the other cannot", "Complementary", "Equally likely"], answer: 1, why: "Mutually exclusive events are maximally dependent: P(A|B) = 0 ≠ P(A)." },
      { id: "q2", q: "`P(A ∩ B)` equals…", choices: ["`P(A) + P(B)`", "`P(A|B) · P(B)`", "`P(A) − P(B)`", "`P(A ∪ B) − 1`"], answer: 1, why: "The multiplicative rule. It is the definition of conditional probability rearranged." },
      { id: "q3", q: "`C(8, 3)` is…", choices: ["24", "56", "336", "8"], answer: 1, why: "8!/(3!·5!) = 56. `math.comb(8, 3)` in Python." },
      { id: "q4", q: "A and B are independent with P(A) = 0.4 and P(B) = 0.5. P(A ∪ B) is…", choices: ["0.9", "0.7", "0.2", "0.45"], answer: 1, why: "P(A∩B) = 0.4·0.5 = 0.2; P(A∪B) = 0.4 + 0.5 − 0.2 = 0.7." },
      { id: "q5", q: "Bayes' rule is best described as…", choices: ["A new axiom of probability", "The multiplicative rule turned around, with P(A) expanded over the ways A can occur", "A rule for independent events only", "An approximation"], answer: 1, why: "Nothing new is assumed; it is the same bookkeeping read in the other direction." },
    ],
  },

  {
    id: "w1-discrete-rv",
    session: 3, track: "stats", minutes: 55, setup: NP, packages: ["scipy"],
    title: "Discrete random variables (ch 4)",
    summary: "Probability distributions as tables, expected value and variance from first principles, and the binomial and Poisson distributions with scipy — the way homework will ask for them.",
    video: {
      youtubeId: "sVBOSwT5K8I", title: "The Binomial and Poisson Distributions", channel: "Luis Serrano Academy", minutes: 14,
      watchFor: [
        "A binomial counts successes in a fixed number of independent trials with the same p.",
        "A Poisson counts events in an interval when the rate λ is steady — and it is the binomial's limit for many trials with a tiny p.",
        "The mean and variance of each: binomial `np` and `np(1−p)`; Poisson `λ` and `λ`.",
      ],
    },
    reading: {
      keyIdea: "A discrete random variable is a rule that assigns a number to each outcome; its probability distribution lists every value with its probability (summing to 1). `µ = Σ x·p(x)` and `σ² = Σ (x−µ)²·p(x)` — the rest of the chapter is two named distributions that arise constantly.",
      body: [
        "**Distribution tables.** McClave gives `p(x)` as a table and asks for `µ`, `σ²`, `σ`, and probabilities like `P(X ≥ 2)`. Two requirements: `0 ≤ p(x) ≤ 1` and `Σ p(x) = 1`. Expected value is a weighted average — a portfolio number, never an individual outcome.",
        "**Binomial** (§4.3): `n` identical trials, each success/failure with the same `p`, independent; `X` = number of successes. `P(X = k) = C(n,k) pᵏ (1−p)ⁿ⁻ᵏ`, `µ = np`, `σ² = np(1−p)`. In Python: `scipy.stats.binom.pmf(k, n, p)`, and `binom.cdf(k, n, p)` for `P(X ≤ k)`. Watch the inequality: `P(X ≥ k) = 1 − cdf(k−1)`.",
        "**Poisson** (§4.4): events in a fixed unit of time or space, mean `λ`, `P(X = k) = λᵏ e^(−λ) / k!`, and `σ² = λ`. Fraud alerts per hour, defects per batch, arrivals at a branch. `scipy.stats.poisson.pmf(k, λ)` / `.cdf`.",
        "**Hypergeometric** (§4.5) appears when sampling *without* replacement from a small population — the binomial assumption of constant `p` breaks. Know it exists; homework may include one.",
        "**Reading a question.** 'At least 3' is `P(X ≥ 3)`; 'more than 3' is `P(X ≥ 4)`; 'at most 3' is `P(X ≤ 3)`; 'fewer than 3' is `P(X ≤ 2)`. Most lost marks in this chapter are the off-by-one on the inequality.",
      ],
    },
    exercises: [
      {
        id: "table", title: "Mean and variance from a distribution table",
        prompt: "A loan officer's daily approvals X have distribution x = 0,1,2,3,4 with p = .10,.25,.35,.20,.10. Compute `mu`, `var`, and `sd` from the definitions (not from simulation).",
        starter: `x = np.array([0, 1, 2, 3, 4])
p = np.array([.10, .25, .35, .20, .10])
assert abs(p.sum() - 1) < 1e-9
mu = (x * p).sum()
var = ...
sd = ...
print(f"µ = {mu:.3f}   σ² = {var:.3f}   σ = {sd:.3f}")
`,
        check: `assert abs(mu - 1.95) < 1e-9
assert abs(var - ((x - 1.95)**2 * p).sum()) < 1e-9, "σ² = Σ (x−µ)² p(x)"
assert abs(sd - np.sqrt(var)) < 1e-9`,
        solution: `x = np.array([0, 1, 2, 3, 4])
p = np.array([.10, .25, .35, .20, .10])
assert abs(p.sum() - 1) < 1e-9
mu = (x * p).sum()
var = ((x - mu)**2 * p).sum()
sd = np.sqrt(var)
print(f"µ = {mu:.3f}   σ² = {var:.3f}   σ = {sd:.3f}")
`,
      },
      {
        id: "binom", title: "Binomial probabilities with scipy",
        prompt: "A 20-loan book, each defaulting independently with p = 0.08. Compute `p_exactly_2`, `p_at_most_2`, and `p_at_least_3` with `scipy.stats.binom`. Then the mean `mu_b` and standard deviation `sd_b`.",
        starter: `from scipy import stats
n, p = 20, 0.08
p_exactly_2 = stats.binom.pmf(2, n, p)
p_at_most_2 = stats.binom.cdf(2, n, p)
p_at_least_3 = ...
mu_b = n * p
sd_b = ...
print(f"P(X=2)={p_exactly_2:.4f}  P(X≤2)={p_at_most_2:.4f}  P(X≥3)={p_at_least_3:.4f}  µ={mu_b:.2f} σ={sd_b:.3f}")
`,
        check: `assert abs(p_at_least_3 - (1 - stats.binom.cdf(2, 20, 0.08))) < 1e-9, "P(X ≥ 3) = 1 − P(X ≤ 2)"
assert abs(sd_b - np.sqrt(20*0.08*0.92)) < 1e-9, "σ = sqrt(np(1−p))"`,
        solution: `from scipy import stats
n, p = 20, 0.08
p_exactly_2 = stats.binom.pmf(2, n, p)
p_at_most_2 = stats.binom.cdf(2, n, p)
p_at_least_3 = 1 - stats.binom.cdf(2, n, p)
mu_b = n * p
sd_b = np.sqrt(n * p * (1 - p))
print(f"P(X=2)={p_exactly_2:.4f}  P(X≤2)={p_at_most_2:.4f}  P(X≥3)={p_at_least_3:.4f}  µ={mu_b:.2f} σ={sd_b:.3f}")
`,
        hint: "'At least 3' means 1 minus the probability of 2 or fewer.",
      },
      {
        id: "poisson", title: "Poisson: alerts per hour",
        prompt: "Fraud alerts arrive at λ = 4.5 per hour. Compute `p_zero` (none in an hour), `p_more_than_7`, and confirm by simulating 200,000 hours with `rng.poisson` that the variance ≈ λ (store it in `sim_var`).",
        starter: `lam = 4.5
p_zero = stats.poisson.pmf(0, lam)
p_more_than_7 = ...
sim = rng.poisson(lam, 200_000)
sim_var = sim.var()
print(f"P(0)={p_zero:.4f}  P(X>7)={p_more_than_7:.4f}  simulated variance {sim_var:.3f} (λ={lam})")
`,
        check: `assert abs(p_more_than_7 - (1 - stats.poisson.cdf(7, 4.5))) < 1e-9, "P(X > 7) = 1 − P(X ≤ 7)"
assert abs(sim_var - 4.5) < 0.1`,
        solution: `lam = 4.5
p_zero = stats.poisson.pmf(0, lam)
p_more_than_7 = 1 - stats.poisson.cdf(7, lam)
sim = rng.poisson(lam, 200_000)
sim_var = sim.var()
print(f"P(0)={p_zero:.4f}  P(X>7)={p_more_than_7:.4f}  simulated variance {sim_var:.3f} (λ={lam})")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "Which is NOT a requirement of a binomial experiment?", choices: ["A fixed number of trials", "The same p on every trial", "Independent trials", "Sampling without replacement from a small population"], answer: 3, why: "Sampling without replacement changes p between draws; that is the hypergeometric setting." },
      { id: "q2", q: "'More than 3 defaults' translates to…", choices: ["P(X ≥ 3)", "P(X > 3) = P(X ≥ 4)", "P(X ≤ 3)", "P(X = 3)"], answer: 1, why: "'More than' excludes 3 itself. The most common lost mark in the chapter." },
      { id: "q3", q: "For a Poisson distribution, the variance equals…", choices: ["λ²", "λ", "√λ", "1/λ"], answer: 1, why: "Mean and variance are both λ — a fact exam questions test directly." },
      { id: "q4", q: "`µ = Σ x·p(x)` describes…", choices: ["The most likely value", "The long-run average of X", "The median", "The mode"], answer: 1, why: "Expected value is a weighted average; it need not be an attainable value." },
      { id: "q5", q: "In scipy, `binom.cdf(2, 20, .08)` gives…", choices: ["P(X = 2)", "P(X ≤ 2)", "P(X ≥ 2)", "P(X > 2)"], answer: 1, why: "cdf is cumulative: up to and including k." },
    ],
  },

  {
    id: "w1-continuous-rv",
    session: 4, track: "stats", minutes: 50, setup: NP, packages: ["scipy"],
    title: "Continuous random variables (ch 5)",
    summary: "Density curves where area is probability; the uniform, normal (z-scores and the table), and exponential distributions; and the normal approximation to the binomial.",
    video: {
      youtubeId: "rzFX5NWojp0", title: "The Normal Distribution, Clearly Explained", channel: "StatQuest", minutes: 5,
      watchFor: [
        "For a continuous variable, P(X = exact value) is zero; probability is *area* under the curve.",
        "µ and σ fully determine a normal curve; standardising with z lets one table serve every normal.",
        "The 68/95/99.7 rule, which you will use as a sanity check on every z-answer.",
      ],
    },
    reading: {
      keyIdea: "For a continuous variable, probability is area under a density curve: `P(a < X < b)` is the area between a and b, and `P(X = a)` is zero. Standardise with `z = (x − µ)/σ` and every normal problem becomes one table lookup — `scipy.stats.norm.cdf(z)`.",
      body: [
        "**Uniform** (§5.2): flat between `c` and `d`; `P(a < X < b) = (b − a)/(d − c)`; `µ = (c+d)/2`, `σ = (d−c)/√12`.",
        "**Normal** (§5.3–5.4): `X ~ N(µ, σ²)`. To find `P(X < x)`: compute `z = (x − µ)/σ`, then read `P(Z < z)` — in McClave's table (which gives areas between 0 and z) or directly with `norm.cdf(z)`. To find a value from a probability (a percentile), invert: `norm.ppf(p)` gives the z, then `x = µ + zσ`. 'Top 5%' means `ppf(0.95)`.",
        "**Descriptive methods for assessing normality** (§5.5): histogram shape, the empirical rule (≈68/95/99.7% within 1/2/3σ), the IQR/σ ratio ≈ 1.3, and a normal probability (Q–Q) plot. Homework often asks you to apply all four to a dataset.",
        "**Normal approximation to the binomial** (§5.6): for large `n` with `np ≥ 15` and `n(1−p) ≥ 15`, `X ≈ N(np, np(1−p))` — with the *continuity correction*: `P(X ≤ k) ≈ P(Y < k + 0.5)`.",
        "**Exponential** (§5.7): waiting time between Poisson events; `P(X > a) = e^(−a/θ)` with mean `θ` (McClave parameterises by the mean, scipy by `scale=θ`). Memoryless: the wait so far tells you nothing about the wait remaining.",
      ],
    },
    exercises: [
      {
        id: "z", title: "Normal probabilities and percentiles",
        prompt: "Credit scores ~ N(700, 60²). Compute `p_below_620`, `p_between_650_750`, and the score `x_top5` that marks the top 5%.",
        starter: `from scipy import stats
mu, sigma = 700, 60
p_below_620 = stats.norm.cdf((620 - mu) / sigma)
p_between_650_750 = ...
x_top5 = ...
print(f"P(X<620)={p_below_620:.4f}  P(650<X<750)={p_between_650_750:.4f}  top-5% cutoff={x_top5:.1f}")
`,
        check: `assert abs(p_between_650_750 - (stats.norm.cdf(750, 700, 60) - stats.norm.cdf(650, 700, 60))) < 1e-9
assert abs(x_top5 - (700 + stats.norm.ppf(0.95) * 60)) < 1e-6, "Top 5% means the 95th percentile: µ + z(0.95)·σ"`,
        solution: `from scipy import stats
mu, sigma = 700, 60
p_below_620 = stats.norm.cdf((620 - mu) / sigma)
p_between_650_750 = stats.norm.cdf(750, mu, sigma) - stats.norm.cdf(650, mu, sigma)
x_top5 = mu + stats.norm.ppf(0.95) * sigma
print(f"P(X<620)={p_below_620:.4f}  P(650<X<750)={p_between_650_750:.4f}  top-5% cutoff={x_top5:.1f}")
`,
      },
      {
        id: "normality", title: "Assess normality four ways",
        prompt: "For `annual_income` in the lending data, compute the share within 1σ and 2σ of the mean (`within1`, `within2`), the ratio `iqr_over_sd`, and draw a Q–Q plot with `scipy.stats.probplot`. Then decide: is income approximately normal?",
        starter: `lending = pd.read_csv("data/lending.csv")
x = lending["annual_income"]
z = (x - x.mean()) / x.std()
within1 = (z.abs() < 1).mean()
within2 = ...
iqr_over_sd = (x.quantile(.75) - x.quantile(.25)) / x.std()
stats.probplot(x, plot=plt); plt.title("Q–Q plot: annual income"); plt.show()
print(f"within 1σ {within1:.3f} (normal ≈ .683)   within 2σ {within2:.3f} (≈ .954)   IQR/σ {iqr_over_sd:.2f} (≈ 1.3)")
`,
        check: `assert abs(within2 - (z.abs() < 2).mean()) < 1e-9
assert 0.6 < within1 < 0.75`,
        solution: `lending = pd.read_csv("data/lending.csv")
x = lending["annual_income"]
z = (x - x.mean()) / x.std()
within1 = (z.abs() < 1).mean()
within2 = (z.abs() < 2).mean()
iqr_over_sd = (x.quantile(.75) - x.quantile(.25)) / x.std()
stats.probplot(x, plot=plt); plt.title("Q–Q plot: annual income"); plt.show()
print(f"within 1σ {within1:.3f} (normal ≈ .683)   within 2σ {within2:.3f} (≈ .954)   IQR/σ {iqr_over_sd:.2f} (≈ 1.3)")
`,
      },
      {
        id: "approx", title: "Normal approximation with continuity correction",
        prompt: "A 400-loan book with p = 0.08. Compute the exact `P(X ≤ 25)` with `binom.cdf` as `exact`, and the normal approximation with continuity correction (`P(Y < 25.5)` where Y ~ N(np, np(1−p))) as `approx`.",
        starter: `n, p = 400, 0.08
exact = stats.binom.cdf(25, n, p)
mu_b, sd_b = n*p, np.sqrt(n*p*(1-p))
approx = ...
print(f"exact {exact:.4f}   normal approx {approx:.4f}")
`,
        check: `assert abs(approx - stats.norm.cdf(25.5, n*p, np.sqrt(n*p*(1-p)))) < 1e-9, "Use 25.5, not 25 — the continuity correction"
assert abs(approx - exact) < 0.02`,
        solution: `n, p = 400, 0.08
exact = stats.binom.cdf(25, n, p)
mu_b, sd_b = n*p, np.sqrt(n*p*(1-p))
approx = stats.norm.cdf(25.5, mu_b, sd_b)
print(f"exact {exact:.4f}   normal approx {approx:.4f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "For a continuous random variable, P(X = 700) is…", choices: ["The height of the curve at 700", "Zero", "The area to the left of 700", "1/σ"], answer: 1, why: "Probability is area; a single point has no width." },
      { id: "q2", q: "The 90th percentile of N(700, 60²) is found with…", choices: ["`norm.cdf(0.90)`", "`700 + norm.ppf(0.90)·60`", "`norm.pdf(0.90)`", "`700 + 0.90·60`"], answer: 1, why: "ppf inverts the cdf: probability in, z out; then un-standardise." },
      { id: "q3", q: "When is the normal approximation to the binomial acceptable?", choices: ["Always", "When np ≥ 15 and n(1−p) ≥ 15", "When p = 0.5 only", "When n < 30"], answer: 1, why: "McClave's rule of thumb; and use the continuity correction." },
      { id: "q4", q: "The exponential distribution models…", choices: ["Counts per interval", "Waiting time between Poisson events", "Successes in n trials", "Sums of normals"], answer: 1, why: "Poisson counts, exponential waits. Memoryless." },
      { id: "q5", q: "A dataset has IQR/σ ≈ 1.3 and ~68% of values within 1σ. It is…", choices: ["Uniform", "Approximately normal", "Exponential", "Binomial"], answer: 1, why: "Both are the normal signatures from §5.5." },
    ],
  },
];
