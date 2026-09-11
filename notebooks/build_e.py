from nbhelp import md, code, sol, build, PRELUDE

# =============================================================== 09
build("09_bootstrap.ipynb", "The Bootstrap", [
md("""
# 09 · The Bootstrap

**Session 12 · Sat Oct 10 · 1.5 hours (stats half)**

The bootstrap is the highest ratio of *usefulness* to *difficulty* in all of statistics. It is ten
lines of code, requires no formulas, and gives you a confidence interval for **any** statistic —
including ones where the textbook formula does not exist.

### The idea

In notebook 07 you needed many samples from the population to see how much your estimate wobbles.
You only ever have one sample.

The bootstrap's move is audacious: **treat your sample as if it were the population, and resample
from it with replacement.** The variation you see across those resamples approximates the variation
you would have seen across real samples.

It sounds like cheating. It works, and it won its inventor considerable fame.
"""),
code(PRELUDE),
code("""
lending = pd.read_csv(DATA / "lending.csv")
sample = lending.sample(200, random_state=7)      # pretend this is all the data you have
print(f"our sample: n = {len(sample)}")
print(f"sample mean income: ${sample.annual_income.mean():,.0f}")
"""),
md("""
## 1 · The entire method

The `replace=True` is the whole trick. Drawing *with* replacement means each resample differs from
the original — some rows appear twice, others not at all — which is what generates the variation.
"""),
code("""
def bootstrap(data, statistic, reps=10_000):
    \"\"\"Resample `data` with replacement `reps` times; apply `statistic` to each.\"\"\"
    n = len(data)
    return np.array([statistic(rng.choice(data, size=n, replace=True))
                     for _ in range(reps)])

income = sample.annual_income.values
boot_means = bootstrap(income, np.mean)

fig, ax = plt.subplots(figsize=(9, 4))
sns.histplot(boot_means, bins=60, ax=ax, color="#3b6ea5", stat="density")
ax.axvline(income.mean(), color="k", ls="--", lw=2, label=f"our estimate ${income.mean():,.0f}")
lo, hi = np.percentile(boot_means, [2.5, 97.5])
ax.axvspan(lo, hi, alpha=.15, color="#3b6ea5", label="95% CI")
ax.set_title("10,000 bootstrap resamples of the mean")
ax.legend(); plt.show()

print(f"estimate:  ${income.mean():>10,.0f}")
print(f"95% CI:    ${lo:>10,.0f}  to  ${hi:>10,.0f}")
print(f"bootstrap SE: ${boot_means.std():>7,.0f}")
"""),
md("""
## 2 · Does it agree with the formula?

For the mean we *do* have a formula (`σ/√n` from notebook 07), so we can check the bootstrap against
a known answer before trusting it on harder problems.
"""),
code("""
formula_se = income.std(ddof=1) / np.sqrt(len(income))
print(f"bootstrap SE:  ${boot_means.std():>9,.1f}")
print(f"σ/√n formula:  ${formula_se:>9,.1f}")
print()
print(f"bootstrap CI:  ${lo:>9,.0f} to ${hi:,.0f}")
print(f"formula CI:    ${income.mean()-1.96*formula_se:>9,.0f} "
      f"to ${income.mean()+1.96*formula_se:,.0f}")
print("\\nAgreement. Now we can trust it where no formula exists.")
"""),
md("""
## 3 · Where the bootstrap earns its keep

The median has no simple standard-error formula. The bootstrap does not care — it never needed to
know what statistic you were computing.
"""),
code("""
for name, stat in [("mean", np.mean), ("median", np.median),
                   ("90th percentile", lambda x: np.percentile(x, 90)),
                   ("std deviation", np.std),
                   ("IQR", lambda x: np.percentile(x,75) - np.percentile(x,25))]:
    b = bootstrap(income, stat, reps=4000)
    lo_, hi_ = np.percentile(b, [2.5, 97.5])
    print(f"{name:>16}: {stat(income):>10,.0f}   95% CI [{lo_:>9,.0f}, {hi_:>9,.0f}]")
"""),
md("""
**Read that table again.** You just produced confidence intervals for the median, the 90th percentile
and the IQR — none of which you were taught a formula for, using the same three lines of code.

That generality is the point. Any statistic you can compute, you can bootstrap.
"""),
md("""
## 4 · Bootstrapping something genuinely useful

A fairness metric. What is the confidence interval on the *gap* in default rates between two groups?
This is exactly the kind of quantity an AI audit has to report — and exactly the kind that has no
neat textbook formula.
"""),
code("""
a = lending.loc[lending.applicant_group=="A", "defaulted"].values
b = lending.loc[lending.applicant_group=="B", "defaulted"].values

def boot_gap(reps=10_000):
    out = np.empty(reps)
    for i in range(reps):
        out[i] = (rng.choice(b, len(b), replace=True).mean()
                  - rng.choice(a, len(a), replace=True).mean())
    return out

gaps = boot_gap()
lo_g, hi_g = np.percentile(gaps, [2.5, 97.5])

fig, ax = plt.subplots(figsize=(9, 3.8))
sns.histplot(gaps, bins=60, ax=ax, color="#a5533b", stat="density")
ax.axvline(0, color="k", ls="--", lw=2, label="no gap")
ax.axvspan(lo_g, hi_g, alpha=.15, color="#a5533b", label="95% CI")
ax.set_title("Group B default rate minus Group A default rate")
ax.legend(); plt.show()

print(f"observed gap: {b.mean()-a.mean():+.4f}  ({(b.mean()-a.mean())*100:+.2f} percentage points)")
print(f"95% CI:       [{lo_g:+.4f}, {hi_g:+.4f}]")
print(f"\\nCI excludes zero: {not (lo_g <= 0 <= hi_g)}  -> the disparity is not sampling noise")
"""),
md("""
This is a defensible audit finding rather than a raw number: *"Group B's default rate is 4.7
percentage points higher (95% CI 2.5 to 7.0), so the disparity is not attributable to sampling
variation."*

Note what it still does **not** tell you: whether the disparity is caused by group membership,
whether the model is unfair, or what to do about it. It establishes that the gap is real. The
interpretation is the ethics question, and that boundary — between what the statistic establishes and
what you conclude — is worth being scrupulous about in your 832 papers.
"""),
md("""
## 5 · Where the bootstrap fails

An honest tool comes with its failure modes.
"""),
code("""
# Failure 1: extremes. The bootstrap can never resample a value it has not seen.
pop = rng.lognormal(8.2, .9, 200_000)
s   = rng.choice(pop, 150, replace=False)
b_max = bootstrap(s, np.max, reps=4000)

print(f"true population max:   {pop.max():>12,.0f}")
print(f"our sample's max:      {s.max():>12,.0f}")
print(f"bootstrap CI for max:  [{np.percentile(b_max,2.5):,.0f}, {np.percentile(b_max,97.5):,.0f}]")
print("\\nThe interval cannot exceed the sample max -- it is structurally incapable of")
print("reaching the truth. Never bootstrap a maximum, minimum, or extreme quantile.")
"""),
code("""
# Failure 2: tiny samples. There is not enough information to resample.
for n in (5, 15, 50, 200):
    s = rng.choice(pop, n, replace=False)
    b = bootstrap(s, np.mean, reps=3000)
    lo_, hi_ = np.percentile(b, [2.5, 97.5])
    covers = lo_ <= pop.mean() <= hi_
    print(f"n={n:>4}  CI [{lo_:>9,.0f}, {hi_:>9,.0f}]  width {hi_-lo_:>9,.0f}  "
          f"contains µ: {covers}")
print("\\nAt n=5 the interval is unreliable -- the sample simply does not contain")
print("enough information about the population's shape. Rule of thumb: n >= 30-50.")
"""),
md("""
**Summary of limits:** the bootstrap needs (a) a reasonable sample size, (b) independent
observations, and (c) a statistic that is not about the extreme tails. Within those bounds it is the
most broadly useful tool you will learn this term.
"""),
md("""
## Your turn

**Exercise 1.** Bootstrap a 95% CI for the **median** `loan_amount` in the full lending dataset.
"""),
code("""
# your code here
"""),
sol("""
la = lending.loan_amount.values
b = bootstrap(la, np.median, reps=8000)
print(f"median loan amount: ${np.median(la):,.0f}")
print(f"95% CI: [${np.percentile(b,2.5):,.0f}, ${np.percentile(b,97.5):,.0f}]")
"""),
md("""
**Exercise 2.** Bootstrap a CI for the **correlation** between `dti_ratio` and `defaulted`. (Resample
*row indices* so the pairs stay together — this is the key subtlety when bootstrapping a relationship.)
"""),
code("""
# your code here
"""),
sol("""
x = lending.dti_ratio.values
y = lending.defaulted.values
n = len(x)

cors = np.empty(5000)
for i in range(5000):
    idx = rng.integers(0, n, n)       # resample INDICES, not each column separately
    cors[i] = np.corrcoef(x[idx], y[idx])[0, 1]

print(f"observed correlation: {np.corrcoef(x, y)[0,1]:.4f}")
print(f"95% CI: [{np.percentile(cors,2.5):.4f}, {np.percentile(cors,97.5):.4f}]")

# Resampling the columns independently would destroy the pairing and force the
# correlation toward zero. Whenever a statistic involves a RELATIONSHIP, bootstrap rows.
"""),
md("""
**Exercise 3.** Demonstrate that 95% bootstrap intervals really do cover the truth ~95% of the time:
draw 300 fresh samples of 60 from `pop`, bootstrap each, and count how often the interval contains
the true mean.
"""),
code("""
# your code here
"""),
sol("""
covered = 0
for _ in range(300):
    s = rng.choice(pop, 60, replace=False)
    b = bootstrap(s, np.mean, reps=800)
    lo_, hi_ = np.percentile(b, [2.5, 97.5])
    covered += (lo_ <= pop.mean() <= hi_)

print(f"coverage: {covered/300:.1%}  (target 95%)")
# Typically low-90s rather than exactly 95 -- the percentile bootstrap is slightly
# optimistic on skewed data. Knowing a method's bias is part of using it honestly.
"""),
md("""
## What you did today

- Learned the bootstrap: **resample your own data with replacement** to measure uncertainty.
- Checked it against `σ/√n` before trusting it elsewhere.
- Got CIs for the median, percentiles and IQR — statistics with no convenient formula.
- Produced a **defensible fairness finding** with a confidence interval, and were careful about what it does not prove.
- Learned the three failure modes: extremes, tiny samples, dependent data.

**Next:** `10_regression.ipynb`.
"""),
])

# =============================================================== 10
build("10_regression.ipynb", "Regression", [
md("""
# 10 · Regression

**Session 13 · Tue Oct 13 · 2 hours**

Regression is the workhorse of applied statistics and the foundation under most of machine learning.
Stripped of notation it is one sentence:

> **Draw the line that comes closest to the points, then read information off the line.**

$$\\hat{y} = \\beta_0 + \\beta_1 x + \\varepsilon$$

| Symbol | Meaning |
|---|---|
| `ŷ` | the prediction ("y-hat") |
| `β₀` | intercept — predicted y when x = 0 |
| `β₁` | slope — how much y moves per 1-unit rise in x |
| `ε` | the residual — what the line missed |
"""),
code(PRELUDE),
code("""
import statsmodels.api as sm
lending = pd.read_csv(DATA / "lending.csv")
lending.head(3)
"""),
md("""
## 1 · One predictor

Does income predict loan size?
"""),
code("""
X = sm.add_constant(lending[["annual_income"]])   # add_constant creates the β₀ column
y = lending["loan_amount"]

fit = sm.OLS(y, X).fit()
print(fit.summary().tables[1])
"""),
md("""
### Reading that table

| Column | Meaning |
|---|---|
| `coef` | the estimated `β` |
| `std err` | standard error of that estimate — same idea as notebook 07 |
| `t` | coef / std err |
| `P>\\|t\\|` | the p-value for "this coefficient is really zero" |
| `[0.025 0.975]` | 95% confidence interval for the coefficient |

**Say the slope out loud as a sentence.** That habit is what turns a table into a finding:
"""),
code("""
b0, b1 = fit.params["const"], fit.params["annual_income"]
print(f"β₀ (intercept) = {b0:>12,.2f}")
print(f"β₁ (slope)     = {b1:>12,.4f}")
print()
print(f"In words: every additional $1 of annual income is associated with")
print(f"          ${b1:.4f} more borrowed -- about ${b1*10_000:,.0f} per $10k of income.")
print(f"R² = {fit.rsquared:.4f}  ->  income explains {fit.rsquared:.1%} of the variation in loan size")
"""),
code("""
fig, ax = plt.subplots(figsize=(9, 4.5))
samp = lending.sample(600, random_state=1)
ax.scatter(samp.annual_income, samp.loan_amount, s=8, alpha=.35, color="#3b6ea5")
xs = np.linspace(lending.annual_income.min(), lending.annual_income.max(), 100)
ax.plot(xs, b0 + b1*xs, color="#a5533b", lw=2.5, label=f"ŷ = {b0:,.0f} + {b1:.3f}·x")
ax.set_xlabel("annual income ($)"); ax.set_ylabel("loan amount ($)")
ax.set_title("The line that minimises the sum of squared vertical misses")
ax.legend(); plt.show()
"""),
md("""
## 2 · What "best fit" means

The line is chosen to minimise `Σ(y − ŷ)²` — the sum of squared residuals. Nothing more mysterious
than that. Let's prove no other slope does better.
"""),
code("""
candidates = np.linspace(b1 - 0.08, b1 + 0.08, 200)
sse = [((y - (b0 + c*lending.annual_income))**2).sum() for c in candidates]

fig, ax = plt.subplots(figsize=(8, 3.5))
ax.plot(candidates, sse, color="#3b6ea5")
ax.axvline(b1, color="#a5533b", ls="--", label=f"OLS β₁ = {b1:.4f}")
ax.set_xlabel("candidate slope"); ax.set_ylabel("sum of squared errors")
ax.set_title("OLS sits exactly at the bottom of the bowl")
ax.legend(); plt.show()

print("That bowl shape is why squaring matters: it is smooth with one minimum, so")
print("calculus can find the bottom. It is also the shape gradient descent walks down")
print("in machine learning -- same idea, bigger problems.")
"""),
md("""
## 3 · Multiple regression, and what "holding constant" means
"""),
code("""
preds = ["annual_income", "credit_score", "employment_years", "dti_ratio"]
fit2 = sm.OLS(lending["loan_amount"], sm.add_constant(lending[preds])).fit()
print(fit2.summary().tables[1])
print(f"\\nR² improved from {fit.rsquared:.4f} to {fit2.rsquared:.4f}")
"""),
md("""
**The critical shift in interpretation.** In a multiple regression, `β₁` means:

> the change in `y` per 1-unit change in `x₁`, **holding every other predictor fixed**.

That phrase is doing enormous work. It is what lets you separate tangled influences — the effect of
income *at a given credit score and DTI*. It is also the source of most misreadings of regression
output, because "holding constant" is a statement about the arithmetic of the model, not about the
world. If income and credit score always move together in reality, the model's estimate of one
"holding the other fixed" describes a situation that never occurs.
"""),
md("""
## 4 · Residual plots — how you find out your model is wrong

`R²` can look respectable while the model is badly misspecified. Residual plots catch what `R²` hides.
The rule: **residuals should look like structureless noise.** Any pattern is the model failing.
"""),
code("""
fig, axes = plt.subplots(1, 3, figsize=(14, 3.6))

axes[0].scatter(fit2.fittedvalues, fit2.resid, s=6, alpha=.3, color="#3b6ea5")
axes[0].axhline(0, color="#a5533b", lw=1.5)
axes[0].set_xlabel("fitted ŷ"); axes[0].set_ylabel("residual")
axes[0].set_title("Residuals vs fitted\\n(want: flat, even band)")

sm.qqplot(fit2.resid, line="s", ax=axes[1])
axes[1].set_title("Q-Q plot\\n(want: points on the line)")

sns.histplot(fit2.resid, bins=50, ax=axes[2], color="#3b6ea5")
axes[2].set_title("Residual distribution\\n(want: centred, symmetric)")
plt.tight_layout(); plt.show()
"""),
code("""
# What a BROKEN model looks like -- fit a straight line to a curve.
x_c = np.linspace(1, 30, 400)
y_c = 5 + 0.4*x_c**2 + rng.normal(0, 12, 400)
bad = sm.OLS(y_c, sm.add_constant(x_c)).fit()

fig, axes = plt.subplots(1, 2, figsize=(11, 3.6))
axes[0].scatter(x_c, y_c, s=10, alpha=.5); axes[0].plot(x_c, bad.fittedvalues, color="#a5533b", lw=2)
axes[0].set_title(f"Straight line on curved data — R² = {bad.rsquared:.3f} (looks fine!)")
axes[1].scatter(bad.fittedvalues, bad.resid, s=10, alpha=.5, color="#a5533b")
axes[1].axhline(0, color="k")
axes[1].set_title("Residuals: an obvious U — THE MODEL IS WRONG")
plt.tight_layout(); plt.show()

print(f"R² = {bad.rsquared:.3f} would pass most reviews. The residual plot exposes it instantly.")
print("Always plot residuals. R² alone cannot tell you the SHAPE is wrong.")
"""),
md("""
## 5 · Correlation is not causation — and regression does not fix it

Regression finds associations. It says nothing about cause, no matter how many controls you add or
how small the p-value gets.
"""),
code("""
# Two variables with no causal link, both driven by a third.
n = 500
branch_size = rng.normal(100, 25, n)             # the hidden common cause
tellers     = 0.08*branch_size + rng.normal(0, 1.2, n)
complaints  = 0.30*branch_size + rng.normal(0, 6, n)

f = sm.OLS(complaints, sm.add_constant(tellers)).fit()
print(f"'effect' of tellers on complaints: {f.params[1]:+.3f}  (p = {f.pvalues[1]:.2e})")
print("Highly significant -- so hire fewer tellers to reduce complaints?\\n")

f2 = sm.OLS(complaints, sm.add_constant(np.column_stack([tellers, branch_size]))).fit()
print(f"once branch_size is included: {f2.params[1]:+.3f}  (p = {f2.pvalues[1]:.3f})")
print("\\nThe effect vanishes. Big branches have more tellers AND more complaints.")
print("This is CONFOUNDING, and no p-value can warn you about it -- only knowing the")
print("domain can. It is why 'we controlled for observables' is a weak defence, and it")
print("is central to the fairness debate: a model can be statistically impeccable and")
print("still encode a confounded historical process.")
"""),
md("""
## Your turn

**Exercise 1.** Regress `dti_ratio` on `credit_score` and `annual_income`. Report `R²` and write the
`credit_score` coefficient as an English sentence.
"""),
code("""
# your code here
"""),
sol("""
m = sm.OLS(lending.dti_ratio,
           sm.add_constant(lending[["credit_score", "annual_income"]])).fit()
print(m.summary().tables[1])
print(f"\\nR² = {m.rsquared:.4f}")
print(f"\\nA 1-point rise in credit score is associated with a change of "
      f"{m.params['credit_score']:+.6f} in DTI, holding income fixed "
      f"(≈ {m.params['credit_score']*100:+.4f} per 100 points).")
"""),
md("""
**Exercise 2.** Add `applicant_group` to the loan-amount model as a dummy variable (hint:
`pd.get_dummies(..., drop_first=True)` and cast to `float`). Interpret its coefficient carefully —
and note what you would need to know before calling it evidence of anything.
"""),
code("""
# your code here
"""),
sol("""
d = pd.get_dummies(lending[["annual_income","credit_score","applicant_group"]],
                   drop_first=True).astype(float)
m = sm.OLS(lending.loan_amount, sm.add_constant(d)).fit()
print(m.summary().tables[1])

print("\\nThe applicant_group_B coefficient is the average difference in loan amount")
print("between group B and group A AT THE SAME income and credit score.")
print()
print("What it is NOT: evidence of discrimination. Loan amount is largely applicant-")
print("DEMANDED, not lender-assigned, and the model omits wealth, family size, purpose,")
print("and local prices. A coefficient is a starting question, not a finding. That")
print("distinction -- between a statistical association and a normative claim -- is")
print("exactly what a PhDAI 832 paper has to get right.")
"""),
md("""
## What you did today

- Regression as a line fitted by minimising `Σ(y − ŷ)²`, and saw the bowl it sits at the bottom of.
- Read a `statsmodels` table and said coefficients aloud as sentences.
- Learned what "holding constant" really claims — and its limits.
- **Residual plots**, and saw an `R²` of 0.9 hiding a badly wrong model.
- Confounding: a strong, significant, entirely spurious effect, killed by one control.

**Next:** `11_model_evaluation.ipynb` — the final notebook, where both courses meet.
"""),
])
