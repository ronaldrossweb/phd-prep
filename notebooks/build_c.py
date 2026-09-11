from nbhelp import md, code, sol, build, PRELUDE

# =============================================================== 05
build("05_bayes_by_simulation.ipynb", "Bayes by Simulation", [
md("""
# 05 · Bayes by Simulation

**Session 6 · Sat Sep 26 · 1.5 hours (stats half)**

> **This is the most important notebook in the set.** Not the hardest — the most *consequential*.
> The idea in it is the one that most reliably breaks trained professionals' intuition, it underpins
> every discussion of model accuracy you will have in your career, and it is the technical reason a
> "95% accurate" AI system can still be unfit to deploy.

We will not start from the formula. We will start from 50,000 transactions and just **count**.
"""),
code(PRELUDE),
md("""
## 1 · The setup

You own a fraud detection model. Here are its specs, and they are genuinely good:

- **Recall (sensitivity): 96%** — it catches 96% of actual fraud.
- **Specificity: 97%** — it correctly clears 97% of legitimate transactions.
- **Base rate: 0.3%** — 3 transactions in 1,000 are actually fraudulent.

The model fires an alert on a transaction. **Before computing anything, write down your gut estimate:
what is the probability this transaction is really fraud?**

Most people say something in the 80–95% range. Let's count.
"""),
code("""
fraud = pd.read_csv(DATA / "fraud_alerts.csv")
print(f"transactions: {len(fraud):,}")
fraud.head()
"""),
code("""
# The 2x2 table. Everything in evaluation comes from these four numbers.
ct = pd.crosstab(fraud.is_fraud, fraud.model_alert,
                 rownames=["actually fraud"], colnames=["model alerted"])
print(ct)

TN, FP = ct.loc[0, 0], ct.loc[0, 1]
FN, TP = ct.loc[1, 0], ct.loc[1, 1]
print(f"\\nTrue  Positives (caught fraud):        {TP:>6,}")
print(f"False Positives (false alarms):        {FP:>6,}")
print(f"False Negatives (missed fraud):        {FN:>6,}")
print(f"True  Negatives (correctly cleared):   {TN:>6,}")
"""),
md("""
## 2 · The answer

`P(fraud | alert)` is, by the definition you learned in notebook 04, a **filter**: among all the rows
where the model alerted, what fraction were actually fraud?
"""),
code("""
alerted = fraud[fraud.model_alert == 1]
precision = (alerted.is_fraud == 1).mean()

print(f"the model alerted on {len(alerted):,} transactions")
print(f"of those, {(alerted.is_fraud==1).sum():,} were really fraud")
print()
print(f"P(fraud | alert) = {precision:.1%}")
print()
print(f"...and for contrast, recall  P(alert | fraud) = {TP/(TP+FN):.1%}")
"""),
md("""
## 3 · Sit with that for a minute

**9% — not 96%.**

The model is exactly as good as advertised. It catches 96.8% of fraud. And yet **more than nine out
of ten of its alerts are false alarms.**

Nothing is broken. The explanation is arithmetic, and it is entirely about how rare fraud is:

- Fraud is 0.3% of 50,000 transactions ≈ **155 fraudulent** transactions. The model catches ~150.
- Legitimate transactions are the other ~49,845. The model wrongly flags 3% of them — and 3% of
  49,845 is about **1,500 false alarms.**

150 real against 1,500 false. The false positives come from a pool 300 times larger, so even a small
error rate on that huge pool swamps the true positives entirely.

### The two probabilities you must never swap

| Expression | Reads as | Value here |
|---|---|---|
| `P(alert \\| fraud)` | "of real fraud, how much do we catch?" | **96.8%** — recall |
| `P(fraud \\| alert)` | "of our alerts, how many are real?" | **9.1%** — precision |

Same model. Same data. The two numbers differ by a factor of ten, and the only difference is which
side of the pipe each event sits on. Confusing them is called the **base-rate fallacy**, and it is
the most expensive statistical error in commercial practice.
"""),
md("""
## 4 · The formula, now that you already know the answer

Bayes' theorem is just the bookkeeping for what you counted above:

$$P(A \\mid B) = \\frac{P(B \\mid A)\;P(A)}{P(B)}$$

In our terms:

$$P(\\text{fraud} \\mid \\text{alert}) = \\frac{P(\\text{alert} \\mid \\text{fraud}) \\times P(\\text{fraud})}{P(\\text{alert})}$$

Read it as a sentence: *take how often fraud triggers an alert, weight it by how common fraud is, and
divide by how often alerts happen at all.* The `P(A)` in the numerator is the base rate — the term
people's intuition silently drops, which is exactly where the error comes from.
"""),
code("""
p_fraud       = fraud.is_fraud.mean()
p_alert_fraud = TP / (TP + FN)
p_alert       = fraud.model_alert.mean()

bayes = (p_alert_fraud * p_fraud) / p_alert

print(f"P(alert | fraud) = {p_alert_fraud:.4f}")
print(f"P(fraud)         = {p_fraud:.4f}      <- the base rate; the term intuition forgets")
print(f"P(alert)         = {p_alert:.4f}")
print()
print(f"Bayes says:  {bayes:.4f}  ({bayes:.1%})")
print(f"Counting said: {precision:.4f}  ({precision:.1%})")
print()
print("Identical. The formula is a shortcut for the counting -- not a separate idea.")
"""),
md("""
## 5 · Base rate is destiny

Hold the model completely fixed and vary only how common fraud is.
"""),
code("""
sens, spec = 0.96, 0.97
rates = np.array([0.0001, 0.001, 0.003, 0.01, 0.05, 0.20, 0.50])

rows = []
for r in rates:
    ppv = (sens * r) / (sens * r + (1 - spec) * (1 - r))
    rows.append({"base rate": f"{r:.2%}", "P(fraud | alert)": f"{ppv:.1%}"})
print(pd.DataFrame(rows).to_string(index=False))

fig, ax = plt.subplots(figsize=(8, 4))
grid = np.linspace(0.0001, 0.5, 500)
ax.plot(grid, (sens*grid)/(sens*grid + (1-spec)*(1-grid)), lw=2, color="#a5533b")
ax.axvline(0.003, ls="--", color="k")
ax.annotate("our case:\\n0.3% base rate\\n-> 9% precision", xy=(0.003, .09),
            xytext=(0.10, .30), arrowprops=dict(arrowstyle="->"))
ax.set_xlabel("base rate — how common fraud actually is")
ax.set_ylabel("P(fraud | alert)")
ax.set_title("Same model throughout. Only the base rate changes.")
plt.show()
"""),
md("""
**The model never changed.** Its precision ranges from 0.3% to 97% depending purely on how common the
thing it looks for is.

This is why "our model is 96% accurate" is close to meaningless as a claim, and why you should always
ask "on what base rate?" It is also why rare-event detection — fraud, disease screening, insider
threat, money laundering — is fundamentally harder than it looks, no matter how good the classifier.
"""),
md("""
## 6 · Why this matters in PhDAI 832

Keep this notebook. You will reuse it in the ethics course, because the base-rate problem is where
statistics and fairness meet:

1. **"High accuracy" is not a defence.** A model can be accurate and still produce a caseload that is
   overwhelmingly false accusations. If an alert triggers an account freeze or an investigation, then
   a 9% precision model is inflicting harm on 10 innocent people for every guilty one it finds.
2. **Base rates differ across groups.** If the flagged behaviour is more common in one group than
   another, then *identical* model performance yields *different* precision for each group
   automatically. Equal treatment by the algorithm produces unequal experience of it.
3. **This is the engine of the impossibility result.** You will meet the formal statement — that
   demographic parity, equalized odds and calibration cannot generally all hold at once — in your
   ethics reading. The reason is the arithmetic in this notebook. When base rates differ between
   groups, equalizing one fairness measure necessarily unbalances another.

The COMPAS recidivism debate, the most-cited case in AI ethics, is *precisely* this argument:
ProPublica measured one thing (error rates by race), Northpointe measured another (calibration by
race), both were correct, and both could not be equalized simultaneously because base rates differed.
"""),
md("""
## Your turn

**Exercise 1.** A medical screening test has 99% sensitivity and 99% specificity — better than our
fraud model on both counts. The disease affects 1 in 10,000 people. A patient tests positive. What is
the probability they have the disease? Compute it two ways: by simulating 1,000,000 people, and with
Bayes' formula.
"""),
code("""
# your code here
"""),
sol("""
n = 1_000_000
has = rng.binomial(1, 1/10_000, n)
pos = np.where(has == 1, rng.binomial(1, 0.99, n), rng.binomial(1, 0.01, n))

print(f"simulated P(disease | positive) = {has[pos==1].mean():.2%}")

p_d, sens, spec = 1/10_000, 0.99, 0.99
print(f"Bayes     P(disease | positive) = "
      f"{(sens*p_d)/(sens*p_d + (1-spec)*(1-p_d)):.2%}")

# About 1%. A 99%/99% test, and a positive result STILL means you almost certainly
# do not have the disease -- because 100 healthy false positives swamp the 1 true case.
# This is why screening programs confirm with a second, different test.
"""),
md("""
**Exercise 2.** For the fraud model, how high would specificity need to go to reach 50% precision at
the same 0.3% base rate? (Try values, or solve it.)
"""),
code("""
# your code here
"""),
sol("""
r, sens = 0.003, 0.96
for spec in [0.97, 0.99, 0.995, 0.999, 0.9971]:
    ppv = (sens*r)/(sens*r + (1-spec)*(1-r))
    print(f"specificity {spec:.4f} -> precision {ppv:.1%}")

# Solving: precision 0.5 needs (1-spec)(1-r) = sens*r, so
fp_rate = sens*r/(1-r)
print(f"\\nneed specificity = {1-fp_rate:.4%}")
# ~99.71%. To halve your false alarms you must cut the false positive rate from 3%
# to 0.29% -- a tenfold improvement -- just to get to a coin flip. THAT is how punishing
# a low base rate is.
"""),
md("""
## What you did today

- Discovered that a 96%-recall model can have **9% precision**, by counting rather than being told.
- Learned that `P(A|B)` and `P(B|A)` are different numbers, and that swapping them is the base-rate fallacy.
- Derived Bayes' theorem as bookkeeping for something you had already computed.
- Saw that **precision is a property of the base rate as much as of the model.**
- Got the technical foundation for the fairness impossibility result in PhDAI 832.

**Next:** `06_expectation_variance.ipynb`.
"""),
])

# =============================================================== 06
build("06_expectation_variance.ipynb", "Expectation and Variance", [
md("""
# 06 · Expectation and Variance

**Session 7 · Tue Sep 29 · 2 hours**

Two ideas, and the notation that goes with them: `E[X]` and `Var(X)`. You already know both
intuitively; this notebook attaches the symbols to the intuitions so formulas stop being opaque.
"""),
code(PRELUDE),
md("""
## 1 · Expectation `E[X]` is a weighted average

`E[X]` — "the expected value of X" — is the long-run average of X. The name is unfortunate: it is
often a value you should never *expect* to see.

A fair die has `E[X] = 3.5`. You will never roll 3.5.
"""),
code("""
die = rng.integers(1, 7, 500_000)
print(f"simulated mean: {die.mean():.4f}")
print(f"E[X] by hand:   {sum(v * (1/6) for v in range(1, 7)):.4f}")
print()
print("E[X] = Σ (value × probability of that value)")
print("     = 1(1/6) + 2(1/6) + 3(1/6) + 4(1/6) + 5(1/6) + 6(1/6) = 3.5")
"""),
md("""
### Where this becomes a business tool

Expectation is how you price risk. Consider a $200,000 loan with a 9% default probability, where
default loses you 60% of principal and repayment earns 5% interest.
"""),
code("""
principal, p_default, lgd, rate = 200_000, 0.09, 0.60, 0.05

outcome_default = -principal * lgd          # you lose 60% of principal
outcome_repaid  =  principal * rate         # you earn interest

ev = p_default * outcome_default + (1 - p_default) * outcome_repaid

print(f"if it defaults  ({p_default:.0%} chance): ${outcome_default:>12,.0f}")
print(f"if it repays    ({1-p_default:.0%} chance): ${outcome_repaid:>12,.0f}")
print(f"\\nE[profit] = ${ev:,.0f}")
print("\\nNeither outcome IS the expected value. It is what you'd average over many such loans.")
"""),
md("""
That last line is the whole concept. `E[X]` describes a *portfolio*, never an individual case. Which
is precisely why a single loan going bad tells you nothing about whether the pricing was right — and
why you need many observations before you can judge.
"""),
md("""
## 2 · Variance `Var(X)` — how much it bounces

Expectation tells you the center. Variance tells you how far from it you typically land. Two
portfolios can have identical expected returns and completely different risk.
"""),
code("""
safe  = rng.normal(50_000, 5_000,  100_000)     # same mean...
risky = rng.normal(50_000, 45_000, 100_000)     # ...very different spread

fig, ax = plt.subplots(figsize=(9, 4))
sns.kdeplot(safe,  fill=True, alpha=.4, label=f"safe:  E={safe.mean():,.0f}, σ={safe.std():,.0f}", ax=ax)
sns.kdeplot(risky, fill=True, alpha=.4, label=f"risky: E={risky.mean():,.0f}, σ={risky.std():,.0f}", ax=ax)
ax.axvline(0, color="k", ls="--", lw=1)
ax.set_title("Identical expected value. Utterly different risk.")
ax.legend(); plt.show()

print(f"P(losing money), safe:  {np.mean(safe  < 0):.3%}")
print(f"P(losing money), risky: {np.mean(risky < 0):.3%}")
"""),
md("""
**`E[X]` alone is never a sufficient description.** Any report quoting an expected return without a
spread is hiding the thing you actually need to make a decision.
"""),
md("""
## 3 · The rules you will see in lectures

Four identities, each demonstrated rather than asserted. `a` and `b` are constants.
"""),
code("""
X = rng.normal(10, 3, 200_000)
a, b = 4, 7

checks = [
    ("E[aX + b] = a·E[X] + b",      (a*X + b).mean(),  a*X.mean() + b),
    ("Var(aX + b) = a²·Var(X)",     (a*X + b).var(),   a**2 * X.var()),
    ("Var(X) = E[X²] − (E[X])²",    X.var(),           (X**2).mean() - X.mean()**2),
]
for name, simulated, formula in checks:
    print(f"{name:32s} simulated {simulated:>14,.3f}   formula {formula:>14,.3f}")

Y = rng.normal(-4, 5, 200_000)   # independent of X
print(f"\\n{'Var(X + Y) = Var(X) + Var(Y)':32s} simulated {(X+Y).var():>14,.3f}"
      f"   formula {X.var() + Y.var():>14,.3f}   (independence required!)")
"""),
md("""
### Two things worth noticing

**Adding a constant does not change variance.** `Var(aX + b) = a²Var(X)` — the `b` vanishes. Shifting
every value by $7 moves the center but changes no spread. Obvious once stated, easy to miss in a formula.

**Variances add, standard deviations do not.** `Var(X+Y) = Var(X)+Var(Y)` for independent variables,
so `σ` of the sum is `√(σ₁² + σ₂²)`, not `σ₁ + σ₂`. This is why diversification works: combine
independent risks and the total standard deviation grows like `√n` rather than `n`.
"""),
code("""
# Diversification, demonstrated.
sd_one = 45_000
for n in (1, 4, 25, 100):
    loans = rng.normal(50_000, sd_one, (60_000, n))
    port  = loans.mean(axis=1)                 # average return per loan in the portfolio
    print(f"n={n:>4}  σ of portfolio average = {port.std():>9,.0f}   "
          f"(theory {sd_one/np.sqrt(n):>9,.0f})")
print("\\nRisk per loan falls as σ/√n. Quadruple the loans, halve the volatility.")
"""),
md("""
That `σ/√n` is about to become the single most important formula in the course. In the next notebook
it gets a name — the **standard error** — and it is the reason statistical inference is possible at all.
"""),
md("""
## Your turn

**Exercise 1.** An insurance policy: premium $1,200/yr. A claim occurs with probability 4% and costs
$22,000 on average. What is the expected profit per policy? How many policies before the *average*
profit per policy is within $100 of that expectation (use simulation)?
"""),
code("""
# your code here
"""),
sol("""
prem, p_claim, claim = 1_200, 0.04, 22_000
ev = prem - p_claim * claim
print(f"E[profit per policy] = ${ev:,.0f}")

sd = np.sqrt(p_claim*(1-p_claim)) * claim     # σ of the claim cost
print(f"σ per policy ≈ ${sd:,.0f}  -- enormous relative to the ${ev:,.0f} margin")

for n in (100, 1_000, 10_000, 50_000):
    sims = np.array([(prem - rng.binomial(1, p_claim, n)*claim).mean() for _ in range(400)])
    print(f"n={n:>6,}  P(|avg - EV| < $100) = {np.mean(np.abs(sims-ev) < 100):.1%}")

# Around 10,000-50,000 policies. That is the actual reason insurers must be large:
# the per-policy variance dwarfs the per-policy margin, so only volume makes the
# expected value a reliable description of what you'll actually collect.
"""),
md("""
**Exercise 2.** Confirm that `Var(X − Y) = Var(X) + Var(Y)` for independent X and Y — note the **plus**
on the right despite the minus on the left. Why does subtracting not reduce the variance?
"""),
code("""
# your code here
"""),
sol("""
X = rng.normal(10, 3, 300_000)
Y = rng.normal(20, 4, 300_000)
print(f"Var(X - Y) simulated = {(X-Y).var():,.3f}")
print(f"Var(X) + Var(Y)      = {X.var() + Y.var():,.3f}")

# Variance measures SPREAD, and spread has no direction. Subtracting a noisy quantity
# injects its noise just as surely as adding it does -- two sources of uncertainty
# always compound. This is why a difference between two measured groups is noisier
# than either group alone, which matters directly for hypothesis testing.
"""),
md("""
## What you did today

- `E[X]` as a weighted average that describes a portfolio, never an individual.
- `Var(X)` as the missing half of any honest summary.
- The four algebra rules, verified by simulation.
- **`σ/√n`** — diversification, and a preview of the standard error.

**Next:** `07_clt_and_standard_error.ipynb` — the centerpiece of the whole five weeks.
"""),
])
