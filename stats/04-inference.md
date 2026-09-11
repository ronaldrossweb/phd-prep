# 04 · Inference

**Read before Sessions 10–12 · 12 minutes**

## The whole method, in one question

> **"If nothing were really going on, how often would I see data this striking?"**

If the answer is "almost never," conclude something is going on. That is hypothesis testing. The
vocabulary is just precise naming for the parts of that sentence.

## The parts

| Term | Symbol | Meaning |
|---|---|---|
| Null hypothesis | `H₀` | Nothing is happening; the effect is zero |
| Alternative | `H₁` | The claim you care about |
| Test statistic | — | The number summarising your data (e.g. a difference in means) |
| Null distribution | — | What that number looks like when `H₀` is true |
| **p-value** | `p` | How often the null distribution produces something this extreme |
| Significance level | `α` | Your cutoff, **chosen in advance**, usually 0.05 |

`α` must be fixed **before** you look at the data. Choosing it afterwards is where p-hacking starts.

## The clearest way to see it: shuffle the labels

If a treatment does nothing, the labels "treatment" and "control" are meaningless stickers. So
shuffle them at random a few thousand times, and see how large a difference chance alone produces.
The fraction of shuffles that beat your real difference **is** the p-value.

You will build one this way in `notebooks/08_hypothesis_testing.ipynb`. No formulas, no tables — just
a simulated frequency. Every named test is a faster route to that same number.

## What a p-value is not

`p = 0.006` does **not** mean:

- ❌ "There is a 0.6% chance `H₀` is true." A p-value *assumes* `H₀`; it cannot also assign it a probability.
- ❌ "There is a 99.4% chance the effect is real."
- ❌ "The effect is large or important."

It means exactly: **if `H₀` were true, data this extreme would arise 0.6% of the time.**

## Significance ≠ importance

With enough data, **any** non-zero difference becomes statistically significant — including one far
too small to act on. At `n = 100,000` a difference nobody could perceive is "highly significant."

**Therefore: always report the effect size alongside the p-value.** "Significant" means *detectable*,
not *important*. This is the single most common misreading in applied work and it is examinable.

## Two ways to be wrong

| | `H₀` true | `H₀` false |
|---|---|---|
| **Reject `H₀`** | **Type I** (false positive), rate `α` | correct |
| **Keep `H₀`** | correct | **Type II** (false negative), rate `β` |

**Power** = `1 − β`: the chance of detecting a real effect. 80% is the usual minimum.

Underpowered studies are the quiet epidemic of applied research. They fail to find real effects and
then get reported as "no effect found" — which is a completely different claim from "we could not have
detected one."

## Multiple comparisons

Test 20 independent things at `α = 0.05` and you expect **one false positive**. The probability of at
least one is `1 − 0.95²⁰ ≈ 64%`.

This is p-hacking's engine, and it matters directly for AI fairness auditing: **test a model across 20
demographic subgroups and you will find a "significant" disparity by chance alone.** Corrections
(Bonferroni: use `α/m`) and pre-registration exist for this reason. Knowing it protects you from both
committing the error and being fooled by someone else's.

## The bootstrap — your most practical tool

Resample your own data with replacement, recompute the statistic each time, and read the confidence
interval off the percentiles. Ten lines, no formulas, and it works for **any** statistic — medians,
percentiles, IQRs, correlations, fairness gaps — including the many with no textbook formula.

Limits: it needs a reasonable `n` (30–50+), independent observations, and a statistic that is not
about the extreme tails. It can never resample a value it has not seen, so never bootstrap a maximum.

## What to carry into the notebooks

- Inference asks: how surprising is this data if nothing is happening?
- A p-value is a simulated frequency — you can build one by shuffling.
- It is **not** the probability the hypothesis is true.
- **Significance ≠ importance.** Always report effect size.
- Power matters; underpowered "no effect" findings are not evidence of no effect.
- 20 tests ⇒ expect a false positive. Relevant to every subgroup audit.
- The bootstrap gives a CI for anything.
