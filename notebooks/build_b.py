from nbhelp import md, code, sol, build, PRELUDE

# =============================================================== 03
build("03_distribution_zoo.ipynb", "Distribution Zoo", [
md("""
# 03 · The Distribution Zoo

**Session 3 · Sat Sep 19 · 1.5 hours (stats half)**

### The idea behind this notebook

A *distribution* is just the answer to "which values happen, and how often?"

Rather than read definitions, you are going to **generate** each one. When you build a distribution
from a rule and then look at it, the shape stops being a definition to memorise and becomes something
you recognise, the way you recognise a face. That is the whole point of this session.

Each section follows the same pattern: the rule that generates it, what it looks like, and where you
have already met it at work.
"""),
code(PRELUDE),
md("""
## 1 · Uniform — "every value equally likely"

The simplest possible rule. A fair die, a random ID, a lottery number.
"""),
code("""
u = rng.uniform(0, 1, 5000)

fig, ax = plt.subplots(figsize=(8, 3.5))
sns.histplot(u, bins=50, ax=ax, color="#3b6ea5")
ax.set_title("Uniform(0, 1) — flat. No value is special.")
plt.show()

print(f"mean {u.mean():.3f}  (theory: 0.5)   std {u.std():.3f}  (theory: {1/np.sqrt(12):.3f})")
"""),
md("""
## 2 · Normal — "many small independent nudges"

The bell curve. Notation: `X ~ N(µ, σ²)`, read aloud as *"X is distributed normal with mean µ and
variance σ²."* The `~` means "is drawn from."

`µ` moves the curve left and right. `σ` makes it wide or narrow. That is the entire parameterisation.
"""),
code("""
fig, ax = plt.subplots(figsize=(9, 4))
for mu, sd, c in [(100, 15, "#3b6ea5"), (100, 6, "#a5533b"), (130, 15, "#3b8f5a")]:
    sns.kdeplot(rng.normal(mu, sd, 20000), ax=ax, label=f"N(µ={mu}, σ={sd})",
                fill=True, alpha=.25, color=c)
ax.set_title("Changing µ slides it; changing σ stretches it")
ax.legend(); plt.show()
"""),
md("""
### The 68 / 95 / 99.7 rule

For any normal distribution, regardless of `µ` and `σ`:

- ~68% of values fall within **1σ** of the mean
- ~95% within **2σ**
- ~99.7% within **3σ**

This is worth memorising — it turns `σ` from an abstraction into a ruler, and it is where the phrase
"a three-sigma event" comes from.
"""),
code("""
z = rng.normal(0, 1, 200_000)
for k in (1, 2, 3):
    print(f"within {k}σ: {np.mean(np.abs(z) < k):6.2%}")
"""),
md("""
## 3 · Log-normal — "many small *multiplicative* nudges"

If you take a normal distribution and exponentiate it, you get log-normal. It is right-skewed and it
is what money looks like.

**Why money is log-normal rather than normal:** incomes and balances grow by *percentages*, not by
fixed amounts. A 3% raise on a large salary is more dollars than 3% on a small one. Multiplicative
processes produce log-normal distributions the same way additive processes produce normal ones.

That single sentence explains the mean/median gap you found in notebook 01.
"""),
code("""
ln = rng.lognormal(mean=3, sigma=0.9, size=5000)

fig, axes = plt.subplots(1, 2, figsize=(11, 3.8))
sns.histplot(ln, bins=60, ax=axes[0], color="#a5533b")
axes[0].set_title("Log-normal — right-skewed")
axes[0].axvline(ln.mean(), color="k", ls="--", label=f"mean {ln.mean():.1f}")
axes[0].axvline(np.median(ln), color="g", ls="-", label=f"median {np.median(ln):.1f}")
axes[0].legend()

sns.histplot(np.log(ln), bins=60, ax=axes[1], color="#3b6ea5")
axes[1].set_title("...and it is NORMAL once you take logs")
plt.tight_layout(); plt.show()
"""),
md("""
The right-hand plot is why analysts log-transform money before modelling it. It is not a trick to
make numbers look nicer — it converts a multiplicative process into an additive one, which is the
form every standard technique assumes.
"""),
md("""
## 4 · Binomial — "how many successes in n tries?"

Counting outcomes of repeated yes/no trials. `n` trials, probability `p` each. Loan defaults in a
portfolio, click-throughs, fraud flags in a batch.
"""),
code("""
defaults = rng.binomial(n=200, p=0.09, size=10000)   # 200 loans, 9% default rate each

fig, ax = plt.subplots(figsize=(8, 3.5))
sns.histplot(defaults, bins=range(0, 45), ax=ax, color="#6b4ea5", discrete=True)
ax.set_title("Defaults in a 200-loan book, 9% rate — 10,000 simulated portfolios")
ax.axvline(200*0.09, color="k", ls="--", label="expected = n·p = 18")
ax.legend(); plt.show()

print(f"mean {defaults.mean():.2f}  (theory n·p = {200*0.09:.1f})")
print(f"in 5% of portfolios you'd see {np.percentile(defaults, 95):.0f}+ defaults, "
      f"purely by chance")
"""),
md("""
### The point of that last line

Expected defaults are 18. But roughly one book in twenty shows 25 or more **with no change whatever
in underlying credit quality** — just luck of the draw.

This is what "random variation" means in practice, and it is why a single quarter's uptick is not
evidence of deterioration. Distinguishing real signal from this kind of noise is precisely what
hypothesis testing (Session 10) is for.
"""),
md("""
## 5 · Poisson — "how many events in a window?"

Counts of things arriving over time when arrivals are independent: calls per hour, fraud attempts per
day, defects per batch. One parameter, `λ` (lambda), which is both the mean and the variance.
"""),
code("""
calls = rng.poisson(lam=4.5, size=10000)

fig, ax = plt.subplots(figsize=(8, 3.5))
sns.histplot(calls, discrete=True, ax=ax, color="#3b8f5a")
ax.set_title("Poisson(λ=4.5) — e.g. fraud alerts per hour")
plt.show()

print(f"mean {calls.mean():.2f}   variance {calls.var():.2f}   (both ≈ λ = 4.5)")
print(f"P(zero events) = {np.mean(calls == 0):.3f}")
"""),
md("""
## 6 · The comparison you should keep

"""),
code("""
fig, axes = plt.subplots(1, 4, figsize=(14, 3.2))
specs = [
    ("Uniform",    rng.uniform(0, 1, 4000),              "flat — no value special"),
    ("Normal",     rng.normal(0, 1, 4000),               "additive noise"),
    ("Log-normal", rng.lognormal(0, .8, 4000),           "multiplicative — money"),
    ("Binomial",   rng.binomial(50, .3, 4000),           "counting successes"),
]
for axis, (name, data, note) in zip(axes, specs):
    sns.histplot(data, bins=35, ax=axis, color="#4a5568")
    axis.set_title(f"{name}\\n{note}", fontsize=10)
    axis.set_ylabel("")
plt.tight_layout(); plt.show()
"""),
md("""
## Your turn

**Exercise 1.** Generate 5,000 draws from a normal with mean 700 and standard deviation 60 (roughly a
credit-score distribution). What fraction fall below 620 — a common approval cutoff?
"""),
code("""
# your code here
"""),
sol("""
scores = rng.normal(700, 60, 5000)
below = np.mean(scores < 620)
print(f"{below:.2%} fall below 620")
print(f"that is {(620-700)/60:.2f} standard deviations below the mean")
# ~9%. Note this is the 68/95/99.7 rule in action: 620 is about 1.33σ below the mean.
"""),
md("""
**Exercise 2.** A 500-loan book with a 6% default rate. Simulate 10,000 such books. What is the
*worst* default count you would expect to see in the top 1% of outcomes?
"""),
code("""
# your code here
"""),
sol("""
books = rng.binomial(500, 0.06, 10000)
print(f"expected defaults: {500*0.06:.0f}")
print(f"99th percentile:   {np.percentile(books, 99):.0f}")
print(f"worst simulated:   {books.max()}")
# Expected 30, but 1 book in 100 sees ~43+. If you wrote a risk limit at 35 you would
# breach it roughly once every eight books through luck alone.
"""),
md("""
**Exercise 3.** Take the log-normal sample `ln` from section 3. Confirm by computation that `np.log(ln)`
is roughly symmetric while `ln` is not, using `pd.Series(...).skew()`.
"""),
code("""
# your code here
"""),
sol("""
print(f"skew of raw log-normal: {pd.Series(ln).skew():.2f}   (strongly right-skewed)")
print(f"skew after log:         {pd.Series(np.log(ln)).skew():.2f}   (≈ 0, symmetric)")
"""),
md("""
## What you did today

- Generated six distributions from their rules and learned them by sight, not by definition.
- The 68/95/99.7 rule, which makes `σ` a usable ruler.
- **Why money is log-normal** — multiplicative growth — and why logs are the standard fix.
- Saw that expected values come with real variation around them, which is the setup for inference.

**Next:** `04_randomness.ipynb`.
"""),
])

# =============================================================== 04
build("04_randomness.ipynb", "Randomness", [
md("""
# 04 · Randomness and Probability

**Session 4 · Tue Sep 22 · 2 hours**

Probability has two definitions worth holding at once. The one that makes it *computable* is the
long-run frequency view: **the probability of an event is the fraction of times it happens if you
repeat the setup forever.**

You cannot repeat anything forever, but you can simulate 100,000 repetitions in a fraction of a
second — which is why every idea in this notebook gets demonstrated rather than asserted.
"""),
code(PRELUDE),
md("""
## 1 · Probability as a long-run frequency
"""),
code("""
flips = rng.integers(0, 2, 20000)            # 0 = tails, 1 = heads
running = np.cumsum(flips) / np.arange(1, len(flips) + 1)

fig, ax = plt.subplots(figsize=(9, 3.8))
ax.plot(running, lw=.8, color="#3b6ea5")
ax.axhline(0.5, color="k", ls="--")
ax.set_xscale("log")
ax.set_ylim(0, 1)
ax.set_title("Running proportion of heads (log x-axis)")
ax.set_xlabel("number of flips"); ax.set_ylabel("proportion heads")
plt.show()

for n in (10, 100, 1000, 20000):
    print(f"after {n:>6,} flips: {running[n-1]:.4f}")
"""),
md("""
### What that plot is actually saying

Early on the proportion swings wildly. By 20,000 flips it is pinned near 0.5.

**The crucial subtlety:** the coin has no memory and nothing "corrects" an imbalance. The proportion
settles because later flips *dilute* early deviations, not because the coin compensates for them. If
you are 10 heads ahead after 100 flips, you stay roughly 10 ahead — it just matters less and less as
a fraction.

Believing otherwise is the gambler's fallacy, and it is the same error as expecting a loan book to
"even out" after a bad quarter.

## 2 · numpy: vectorized thinking

The habit to build now: **describe the operation on the whole array**, do not loop over elements.
Loops in Python are slow and, more importantly, they read worse.
"""),
code("""
import time

n = 2_000_000
a = rng.normal(0, 1, n)

t0 = time.perf_counter()
loop_result = 0.0
for v in a[:200_000]:              # only 10% of the data, or it takes all morning
    loop_result += v * v
t_loop = (time.perf_counter() - t0) * 10       # scale up to compare fairly

t0 = time.perf_counter()
vec_result = np.sum(a * a)
t_vec = time.perf_counter() - t0

print(f"python loop (extrapolated): {t_loop:8.3f} s")
print(f"numpy vectorized:           {t_vec:8.3f} s")
print(f"speedup: roughly {t_loop/t_vec:,.0f}x")
"""),
md("""
Same arithmetic, hundreds of times faster, and one line instead of three. `a * a` means "square every
element"; `np.sum` adds them. This is the idiom you will use constantly.
"""),
md("""
## 3 · The rules of probability, by simulation

Rather than trust the formulas, let's verify them. Two events on a single die roll:
`A` = roll is even, `B` = roll is 5 or more.
"""),
code("""
rolls = rng.integers(1, 7, 200_000)
A = (rolls % 2 == 0)          # 2, 4, 6
B = (rolls >= 5)              # 5, 6

print(f"P(A)         = {A.mean():.4f}   (theory 3/6 = 0.5000)")
print(f"P(B)         = {B.mean():.4f}   (theory 2/6 = 0.3333)")
print(f"P(A and B)   = {(A & B).mean():.4f}   (theory 1/6 = 0.1667)  <- only a 6")
print(f"P(A or B)    = {(A | B).mean():.4f}   (theory 4/6 = 0.6667)  <- 2,4,5,6")
print(f"P(not A)     = {(~A).mean():.4f}")
print()
print("addition rule:  P(A or B) = P(A) + P(B) - P(A and B)")
print(f"                {(A|B).mean():.4f} = {A.mean():.4f} + {B.mean():.4f} - {(A&B).mean():.4f}"
      f" = {A.mean()+B.mean()-(A&B).mean():.4f}")
"""),
md("""
**Why you subtract the overlap:** adding `P(A)` and `P(B)` counts the outcome "6" twice, since a 6 is
both even and ≥5. Subtracting `P(A and B)` removes the double count. The formula is bookkeeping, not
insight — and now you have seen it be true rather than been told it.
"""),
md("""
## 4 · Conditional probability — the pipe `|`

`P(A | B)` is read *"the probability of A **given** B"*: restrict attention to the world where B
happened, then ask how often A happens there.

In code, "given B" is just **filtering**.
"""),
code("""
print(f"P(A)      = {A.mean():.4f}          <- all rolls")
print(f"P(A | B)  = {A[B].mean():.4f}          <- only rolls where B is true")
print()
print("A[B] means 'the values of A at the positions where B is true'. That is what")
print("conditioning IS: a filter. The pipe symbol means 'restrict the population to'.")
"""),
md("""
### Independence

`A` and `B` are **independent** if knowing one tells you nothing about the other — that is,
`P(A | B) = P(A)`.

Here `P(A) = 0.50` but `P(A | B) = 0.50` as well... which makes them independent, and is genuinely a
coincidence of how this die splits. Let's construct a clearly dependent pair to see the contrast.
"""),
code("""
C = (rolls >= 3)
print(f"P(A)      = {A.mean():.4f}")
print(f"P(A | C)  = {A[C].mean():.4f}   <- knowing C changes the answer => DEPENDENT")
print()
high = (rolls == 6)
print(f"P(high)          = {high.mean():.4f}")
print(f"P(high | B)      = {high[B].mean():.4f}   <- B doubles it => strongly dependent")
"""),
md("""
## Your turn

**Exercise 1.** Simulate 100,000 rolls of **two** dice. What is the probability the total is 7? And
given that the first die shows a 4, what is it then?
"""),
code("""
# your code here
"""),
sol("""
d1 = rng.integers(1, 7, 100_000)
d2 = rng.integers(1, 7, 100_000)
total = d1 + d2

print(f"P(total = 7)            = {np.mean(total == 7):.4f}   (theory 6/36 = 0.1667)")
print(f"P(total = 7 | d1 = 4)   = {np.mean(total[d1 == 4] == 7):.4f}   (theory 1/6 = 0.1667)")
# Equal -- because whatever the first die shows, exactly one value of the second die
# completes a 7. A nice case where conditioning changes nothing.
"""),
md("""
**Exercise 2.** Using the same two dice: `P(total >= 10)`, and `P(total >= 10 | d1 >= 5)`. Are those
events independent?
"""),
code("""
# your code here
"""),
sol("""
print(f"P(total >= 10)             = {np.mean(total >= 10):.4f}")
print(f"P(total >= 10 | d1 >= 5)   = {np.mean(total[d1 >= 5] >= 10):.4f}")
# Far higher when the first die is large -> clearly DEPENDENT. You cannot reach 10
# without a big first die, so learning d1 >= 5 is very informative.
"""),
md("""
## What you did today

- Probability as long-run frequency — and why the "law of averages" does not mean the coin corrects itself.
- Vectorized numpy instead of loops.
- Verified the addition rule by simulation rather than accepting it.
- **Conditioning is filtering.** `P(A | B)` = "compute A only among the rows where B is true."

**Next:** `05_bayes_by_simulation.ipynb` — where conditioning becomes genuinely counterintuitive and
where most people's intuition breaks. This is the single most important notebook in the set.
"""),
])
