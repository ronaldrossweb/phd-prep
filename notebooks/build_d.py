from nbhelp import md, code, sol, build, PRELUDE

# =============================================================== 07
build("07_clt_and_standard_error.ipynb", "CLT and Standard Error", [
md("""
# 07 · The Central Limit Theorem and the Standard Error

**Session 9 · Sat Oct 3 · 1.5 hours (stats half)**

> **The centerpiece of the whole five weeks.** Everything in Sessions 10–12 — p-values, confidence
> intervals, t-tests, the bootstrap — is a consequence of what you are about to watch happen.

### The problem statistics exists to solve

You have one sample. You want to know about the population. You will never see the population.

So: **how wrong is my sample likely to be?** If you can answer that, you can attach an honest margin
of error to any estimate. If you cannot, every number you report is naked.

The answer comes from an idea that sounds absurd until you see it: *the average of a sample is itself
a random quantity with its own, highly predictable, distribution.*
"""),
code(PRELUDE),
md("""
## 1 · Build a population that is nothing like a bell curve

To show that this works in general, we deliberately start with a horrible distribution: heavily
right-skewed, like account balances.
"""),
code("""
population = rng.lognormal(mean=8.2, sigma=0.9, size=500_000)
TRUE_MEAN = population.mean()

fig, ax = plt.subplots(figsize=(9, 3.5))
sns.histplot(population, bins=120, ax=ax, color="#a5533b")
ax.axvline(TRUE_MEAN, color="k", ls="--", label=f"true mean µ = {TRUE_MEAN:,.0f}")
ax.set_xlim(0, 40_000)
ax.set_title("The POPULATION — violently skewed, not remotely normal")
ax.legend(); plt.show()

print(f"population mean   µ = {TRUE_MEAN:>12,.2f}")
print(f"population std    σ = {population.std():>12,.2f}")
print(f"population skew     = {pd.Series(population).skew():>12,.2f}   <- very far from symmetric")
"""),
md("""
## 2 · Take one sample, like a real analyst

In real life you get **one** sample of maybe 100 accounts, and you must report something.
"""),
code("""
one_sample = rng.choice(population, size=100, replace=False)
print(f"your sample mean x̄ = {one_sample.mean():>12,.2f}")
print(f"the true mean    µ = {TRUE_MEAN:>12,.2f}")
print(f"you were off by    {one_sample.mean() - TRUE_MEAN:>+12,.2f}"
      f"  ({(one_sample.mean()/TRUE_MEAN - 1):+.2%})")
"""),
md("""
You were off. Of course you were. **The question is not "was I wrong" — you always are. The question
is "by how much, typically?"**

Nobody can answer that from one sample by looking at it. But we have the population here, so we can
cheat and find out what *would* happen across many samples. That is the trick of this notebook: do
the impossible experiment once, learn the rule, then use the rule when you cannot cheat.
"""),
md("""
## 3 · The impossible experiment: 5,000 analysts

Imagine 5,000 analysts each independently drawing their own sample of 100 accounts and each computing
their own mean. What does the collection of their answers look like?
"""),
code("""
def sampling_distribution(pop, n, reps=5000):
    \"\"\"Draw `reps` samples of size n; return their means.\"\"\"
    return np.array([rng.choice(pop, size=n, replace=False).mean() for _ in range(reps)])

means_100 = sampling_distribution(population, 100)

fig, ax = plt.subplots(figsize=(9, 4))
sns.histplot(means_100, bins=60, ax=ax, color="#3b6ea5", stat="density")
ax.axvline(TRUE_MEAN, color="k", ls="--", lw=2, label=f"true µ = {TRUE_MEAN:,.0f}")
ax.set_title("5,000 analysts' sample means — from that hideous skewed population")
ax.set_xlabel("sample mean (n = 100)")
ax.legend(); plt.show()

print(f"mean of the 5,000 means: {means_100.mean():>12,.2f}   (true µ = {TRUE_MEAN:,.2f})")
print(f"skew of the 5,000 means: {pd.Series(means_100).skew():>12,.2f}   (population skew was 3+)")
"""),
md("""
## 4 · That is the Central Limit Theorem

Look at what just happened:

- The population was **wildly skewed.**
- The distribution of sample *means* is **almost perfectly symmetric and bell-shaped.**
- It is **centered on the true mean.**

**The Central Limit Theorem:** for a large enough sample, the distribution of the sample mean is
approximately normal — *regardless of the shape of the population it came from.*

This is the most useful theorem in applied statistics, and the reason is practical: you almost never
know the shape of your population, and the CLT says **you do not need to.** Whatever it looks like,
your sample mean behaves normally, and normal distributions are something we can compute with.
"""),
code("""
# Watch normality arrive as n grows.
fig, axes = plt.subplots(1, 4, figsize=(15, 3.2))
for axis, n in zip(axes, [2, 5, 30, 200]):
    m = sampling_distribution(population, n, reps=3000)
    sns.histplot(m, bins=45, ax=axis, color="#3b6ea5", stat="density")
    axis.axvline(TRUE_MEAN, color="k", ls="--")
    axis.set_title(f"n = {n}\\nskew {pd.Series(m).skew():.2f}", fontsize=10)
    axis.set_ylabel(""); axis.set_xlabel("sample mean")
plt.tight_layout(); plt.show()
print("n=2 still inherits the population's skew. By n=30 it is nearly gone. This is where")
print("the folk rule 'n ≥ 30' comes from -- though heavier skew needs more.")
"""),
md("""
## 5 · The standard error — and the distinction that trips everyone

The spread of that bell is the **standard error**. It measures how much sample means vary.

$$SE = \\frac{\\sigma}{\\sqrt{n}}$$
"""),
code("""
sigma = population.std()
for n in (10, 30, 100, 400, 1600):
    m = sampling_distribution(population, n, reps=2500)
    print(f"n={n:>5}   observed spread of means = {m.std():>9,.1f}   "
          f"σ/√n = {sigma/np.sqrt(n):>9,.1f}")
"""),
md("""
### σ versus SE — read this twice

| | What it describes | Does more data shrink it? |
|---|---|---|
| **σ** (standard deviation) | how much **individual accounts** differ | **No.** Never. |
| **SE** (standard error) | how much **your estimate of the mean** would differ | **Yes**, like `1/√n`. |

Collecting more data does not make customers more alike. The world is exactly as variable as it was.
What more data buys you is a **more reliable estimate** — the bell in section 3 gets narrower.

Confusing these two is the most common error in applied statistics, and it shows up as reports
claiming the *population* got more homogeneous when in fact only the *estimate* got sharper.

### Diminishing returns

`√n` is a harsh master. To halve your standard error you must **quadruple** your sample.
"""),
code("""
base = sigma / np.sqrt(100)
print(f"n =   100  ->  SE = {base:>9,.1f}")
for n in (400, 1600, 6400):
    print(f"n = {n:>5}  ->  SE = {sigma/np.sqrt(n):>9,.1f}   "
          f"({base/(sigma/np.sqrt(n)):.0f}x better, {n//100}x the data)")
print("\\n64x the data for an 8x improvement. This is why 'just collect more data'")
print("stops being good advice quite early, and why study DESIGN matters more than volume.")
"""),
md("""
## 6 · Where the "95%" in everything comes from

Since sample means are normal, the 68/95/99.7 rule applies **to them**. About 95% of sample means
land within 2 standard errors of the truth (1.96, precisely).

Turn that around and you get the confidence interval: `x̄ ± 1.96 × SE`.
"""),
code("""
n = 100
within = np.mean(np.abs(means_100 - TRUE_MEAN) < 1.96 * sigma/np.sqrt(n))
print(f"share of the 5,000 sample means within 1.96·SE of µ: {within:.1%}")
print()

# Now build an interval the honest way -- from ONE sample, not knowing sigma.
covered = 0
trials = 2000
for _ in range(trials):
    s = rng.choice(population, size=n, replace=False)
    se = s.std(ddof=1) / np.sqrt(n)              # estimate SE from the sample itself
    lo, hi = s.mean() - 1.96*se, s.mean() + 1.96*se
    covered += (lo <= TRUE_MEAN <= hi)

print(f"of {trials} intervals built from single samples, {covered/trials:.1%} contained the true µ")
print("\\nTHAT is what '95% confidence' means: the PROCEDURE captures the truth 95% of")
print("the time. It is a property of the method across repetitions -- not a probability")
print("statement about any one interval you happen to have computed.")
"""),
md("""
## Your turn

**Exercise 1.** Using the `lending` data as a population, draw 2,000 samples of 50 loans and plot the
distribution of their mean `annual_income`. Compare the observed spread to `σ/√n`.
"""),
code("""
# your code here
"""),
sol("""
lending = pd.read_csv(DATA / "lending.csv")
inc = lending.annual_income.values

means = np.array([rng.choice(inc, 50, replace=False).mean() for _ in range(2000)])

fig, ax = plt.subplots(figsize=(8, 3.5))
sns.histplot(means, bins=45, ax=ax)
ax.axvline(inc.mean(), color="k", ls="--", label=f"true mean {inc.mean():,.0f}")
ax.legend(); plt.show()

print(f"observed spread of means: {means.std():>10,.1f}")
print(f"σ/√n predicted:           {inc.std()/np.sqrt(50):>10,.1f}")
"""),
md("""
**Exercise 2.** You need a standard error of $500 for mean income. Roughly what sample size does that
require? (Use `σ` from the full lending data and solve `σ/√n = 500`.)
"""),
code("""
# your code here
"""),
sol("""
sigma_inc = lending.annual_income.std()
n_needed = (sigma_inc / 500) ** 2
print(f"σ = {sigma_inc:,.0f}")
print(f"n = (σ/500)² = {n_needed:,.0f}")

s = rng.choice(lending.annual_income.values, int(n_needed), replace=False)
print(f"check: SE at that n = {s.std(ddof=1)/np.sqrt(len(s)):,.1f}")
# Note this is a DESIGN calculation -- done before collecting data, to decide how much
# to collect. It is the single most practical use of the SE formula.
"""),
md("""
**Exercise 3.** The CLT is about the *mean*. Does the same thing happen to the sample **maximum**?
Draw 3,000 samples of 100 and plot the distribution of their maxima.
"""),
code("""
# your code here
"""),
sol("""
maxima = np.array([rng.choice(population, 100, replace=False).max() for _ in range(3000)])

fig, ax = plt.subplots(figsize=(8, 3.5))
sns.histplot(maxima, bins=60, ax=ax, color="#a5533b")
ax.set_title("Distribution of sample MAXIMA — still strongly skewed")
plt.show()
print(f"skew of sample maxima: {pd.Series(maxima).skew():.2f}   (means had skew ≈ 0)")

# NOT normal. The CLT applies to sums and averages, not to extremes. Maxima follow
# their own theory (extreme value theory), which is why tail-risk and stress-testing
# work cannot borrow ordinary confidence intervals. Worth knowing where a theorem stops.
"""),
md("""
## What you did today

- Watched the **Central Limit Theorem** happen: sample means go normal even from a violently skewed population.
- Learned `SE = σ/√n`, and that halving it costs 4× the data.
- Nailed the **σ vs SE** distinction — spread of individuals vs reliability of an estimate.
- Saw that "95% confidence" is a property of the **procedure across repetitions**, not of your one interval.
- Found where the CLT *stops* applying (extremes), which is as useful as knowing where it does.

**Next:** `08_hypothesis_testing.ipynb` — all of which is just this notebook with different vocabulary.
"""),
])

# =============================================================== 08
build("08_hypothesis_testing.ipynb", "Hypothesis Testing", [
md("""
# 08 · Hypothesis Testing

**Session 10 · Tue Oct 6 · 2 hours**

Hypothesis testing has a reputation for being confusing. It is not, once you see that it is a single
question asked carefully:

> **"If nothing were really going on, how often would I see data this striking?"**

If the answer is "almost never," you conclude something is going on. That is the whole method. The
vocabulary — null hypothesis, p-value, alpha, significance — is just precise naming for the parts.
"""),
code(PRELUDE),
code("""
ab = pd.read_csv(DATA / "ab_test.csv")
print(ab.groupby("variant")["satisfaction"].agg(["count", "mean", "std"]).round(3))

observed_diff = (ab.loc[ab.variant=="treatment", "satisfaction"].mean()
                 - ab.loc[ab.variant=="control",  "satisfaction"].mean())
print(f"\\nobserved difference: {observed_diff:+.4f}")
"""),
md("""
The treatment group scored higher. **But is that real, or is it the kind of gap you would get from
random assignment alone?** You saw in notebook 03 that random variation produces apparent patterns
constantly. This is how you tell the difference.
"""),
md("""
## 1 · The permutation test — hypothesis testing with no formulas

Before any named test, here is the idea in its purest form.

If the treatment does nothing, then the labels "control" and "treatment" are meaningless stickers. We
could shuffle them randomly and get an equally valid dataset. So: **shuffle the labels thousands of
times and see how big a difference chance alone produces.**
"""),
code("""
values = ab.satisfaction.values
n_treat = (ab.variant == "treatment").sum()

null_diffs = np.empty(20_000)
for i in range(20_000):
    shuffled = rng.permutation(values)
    null_diffs[i] = shuffled[:n_treat].mean() - shuffled[n_treat:].mean()

fig, ax = plt.subplots(figsize=(9, 4))
sns.histplot(null_diffs, bins=70, ax=ax, color="#94a3b8", stat="density")
ax.axvline(observed_diff, color="#a5533b", lw=2.5, label=f"observed {observed_diff:+.3f}")
ax.axvline(-observed_diff, color="#a5533b", lw=1, ls=":")
ax.set_title("Differences produced by pure chance (labels shuffled 20,000 times)")
ax.set_xlabel("difference in group means"); ax.legend(); plt.show()

p_perm = np.mean(np.abs(null_diffs) >= abs(observed_diff))
print(f"chance alone produced a gap this big or bigger in {p_perm:.2%} of 20,000 shuffles")
print(f"\\nThat proportion IS the p-value: p = {p_perm:.4f}")
"""),
md("""
**That is a p-value, and you just built one from scratch.** No distributions, no formulas, no tables.
It is a simulated frequency: *how often does chance alone do what I saw?*

Everything below is faster ways to compute this same number.
"""),
md("""
## 2 · The vocabulary, attached to what you just did

| Term | Symbol | What it was in your simulation |
|---|---|---|
| Null hypothesis | `H₀` | "the labels are meaningless" — the shuffling assumption |
| Alternative | `H₁` | "the treatment genuinely changes satisfaction" |
| Test statistic | — | the difference in means |
| Null distribution | — | the grey histogram |
| **p-value** | `p` | the share of the grey histogram beyond your red line |
| Significance level | `α` | the cutoff you picked *in advance*, usually 0.05 |

The `α` must be chosen **before** you look. Choosing it afterwards is how p-hacking starts.
"""),
md("""
## 3 · The t-test — the same answer, instantly

The t-test assumes the null distribution is a known shape (which the CLT from notebook 07
guarantees), so it can skip the simulation.
"""),
code("""
from scipy import stats

t = ab.loc[ab.variant=="treatment", "satisfaction"]
c = ab.loc[ab.variant=="control",  "satisfaction"]
res = stats.ttest_ind(t, c)

print(f"t-statistic: {res.statistic:.4f}")
print(f"p-value:     {res.pvalue:.5f}")
print()
print(f"permutation test said: {p_perm:.5f}")
print(f"t-test said:           {res.pvalue:.5f}")
print("\\nSame answer. The t-test is an efficient shortcut, not a different idea.")
"""),
md("""
The **t-statistic** is just the difference measured in standard errors:
`t = (difference) / (standard error of the difference)`. A `t` of 2.75 means the gap is 2.75 standard
errors from zero — and from the 68/95/99.7 rule you already know that is unusual.
"""),
code("""
se_diff = np.sqrt(t.var(ddof=1)/len(t) + c.var(ddof=1)/len(c))
print(f"difference:            {observed_diff:+.4f}")
print(f"SE of the difference:   {se_diff:.4f}")
print(f"t = difference / SE  =  {observed_diff/se_diff:.4f}")
print(f"scipy's t           =  {res.statistic:.4f}")
"""),
md("""
## 4 · What a p-value is NOT

This gets examined, and it gets argued in ethics papers. `p = 0.006` does **not** mean:

- ❌ "There is a 0.6% chance the null hypothesis is true." A p-value assumes `H₀` and cannot
  simultaneously assign it a probability.
- ❌ "There is a 99.4% chance the treatment works."
- ❌ "The effect is large or important."

It means, precisely: **if the treatment did nothing, data this extreme would arise 0.6% of the time.**

### The size problem

With enough data, *any* non-zero difference becomes statistically significant — including one far too
small to care about.
"""),
code("""
# A trivially small true effect: 0.02 points on a 5-point scale.
for n in (100, 1_000, 10_000, 100_000):
    a = rng.normal(4.50, 1.0, n)
    b = rng.normal(4.52, 1.0, n)
    p = stats.ttest_ind(b, a).pvalue
    flag = "SIGNIFICANT" if p < .05 else ""
    print(f"n={n:>7,}  diff≈0.02  p={p:.4f}  {flag}")

print("\\nThe effect is identical every time. Only n changed. At n=100,000 a difference")
print("nobody could perceive is 'highly significant'. Hence: ALWAYS report the effect")
print("size alongside the p-value. 'Significant' means detectable, not important.")
"""),
md("""
## 5 · Two ways to be wrong

| | `H₀` is actually true | `H₀` is actually false |
|---|---|---|
| **You reject `H₀`** | **Type I error** (false positive), rate `α` | correct ✓ |
| **You keep `H₀`** | correct ✓ | **Type II error** (false negative), rate `β` |

**Power** is `1 − β`: the chance of detecting a real effect that is there. Underpowered studies are
the quiet epidemic of applied research — they fail to find real effects and get reported as "no
effect found," which is a different claim entirely.
"""),
code("""
true_effect, sd = 0.22, 1.0
print("power to detect a real 0.22-point effect:\\n")
for n in (30, 100, 300, 1000):
    hits = sum(stats.ttest_ind(rng.normal(4.5+true_effect, sd, n),
                               rng.normal(4.5, sd, n)).pvalue < .05
               for _ in range(1500))
    print(f"n={n:>5} per group   power = {hits/1500:>6.1%}"
          f"   {'(under-powered)' if hits/1500 < .8 else '(adequate)'}")
print("\\n80% power is the usual minimum. At n=30 you would MISS this real effect")
print("four times out of five -- and might then report that it does not exist.")
"""),
md("""
## Your turn

**Exercise 1.** In the `lending` data, is mean `credit_score` different between `applicant_group` A
and B? Run a t-test, report the p-value *and* the effect size in points, and write one sentence you
would be willing to put in a paper.
"""),
code("""
# your code here
"""),
sol("""
lending = pd.read_csv(DATA / "lending.csv")
a = lending.loc[lending.applicant_group=="A", "credit_score"]
b = lending.loc[lending.applicant_group=="B", "credit_score"]
res = stats.ttest_ind(a, b)

print(f"group A mean: {a.mean():.1f}   group B mean: {b.mean():.1f}")
print(f"difference:   {a.mean()-b.mean():.1f} points")
print(f"t = {res.statistic:.2f},  p = {res.pvalue:.2e}")
print(f"Cohen's d = {(a.mean()-b.mean())/np.sqrt((a.var()+b.var())/2):.3f}")

# "Group A applicants have a mean credit score 48.9 points higher than group B
#  (t = 21.4, p < 0.001, d = 0.75), a large and highly significant difference."
#
# Note carefully what this does NOT establish: WHY. The statistic is silent on whether
# this reflects creditworthiness or an unequal historical data-generating process --
# and that question, not the p-value, is what PhDAI 832 is about.
"""),
md("""
**Exercise 2.** Demonstrate the multiple-comparisons problem: run 200 t-tests between two groups
drawn from the *same* distribution (so `H₀` is true every time). How many come out "significant"?
"""),
code("""
# your code here
"""),
sol("""
false_positives = sum(stats.ttest_ind(rng.normal(0,1,80), rng.normal(0,1,80)).pvalue < .05
                      for _ in range(200))
print(f"significant results from 200 tests where H₀ is TRUE: {false_positives}")
print(f"that is {false_positives/200:.1%} -- which is exactly α = 5%, as designed")
print()
print("P(at least one false positive in 20 tests) =",
      f"{1 - 0.95**20:.1%}")

# This is p-hacking's engine. Test 20 things and you will probably find "something
# significant" even when nothing is real. It is why pre-registration exists, and why
# corrections (Bonferroni: use α/m) exist. In an AI audit context it matters enormously:
# test a model across 20 demographic subgroups and you WILL find a disparity by chance.
"""),
md("""
## What you did today

- Built a **p-value from scratch** by shuffling labels — no formula needed.
- Saw the t-test reproduce that number instantly, and understood `t` as "differences per standard error."
- Learned what a p-value is **not**, and that significance ≠ importance.
- Type I vs Type II error and **power** — and that underpowered studies produce false reassurance.
- The multiple-comparisons trap, which matters directly for fairness auditing.

**Next:** `09_bootstrap.ipynb` — confidence intervals for anything, in ten lines.
"""),
])
