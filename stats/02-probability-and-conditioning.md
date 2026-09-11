# 02 · Probability and Conditioning

**Read before Sessions 4–6 · 12 minutes**

## Probability, defined so you can compute it

**The probability of an event is the fraction of times it happens if you repeat the setup
indefinitely.**

You cannot repeat anything indefinitely — but you can simulate 100,000 repetitions instantly, which
is why every probability claim in these notebooks is demonstrated rather than asserted. If you can
simulate it, you can check it, and you never have to take a formula on faith.

## The law of large numbers, and what it does not say

Repeat something enough and the observed proportion settles toward the true probability.

**What it does not say:** that anything corrects itself. A coin ten heads ahead after 100 flips stays
roughly ten ahead — the *proportion* converges because later flips dilute the early imbalance, not
because the coin compensates. Believing otherwise is the gambler's fallacy, and it is the same error
as expecting a loan book to "even out" after a bad quarter.

## Conditioning is filtering

`P(A | B)` reads *"the probability of A **given** B."* Operationally:

> **Restrict attention to the cases where B is true, then ask how often A happens there.**

In pandas that is `df[df.B]['A'].mean()`. A filter. That is the entire mechanic, and if you hold onto
that one sentence the pipe notation never confuses you again.

## The distinction that costs real money

`P(A | B)` and `P(B | A)` are **different numbers**, and swapping them is the most expensive error in
applied statistics.

| Expression | Question | Name |
|---|---|---|
| `P(alert \| fraud)` | Of real fraud, how much do we catch? | **recall** |
| `P(fraud \| alert)` | Of our alerts, how many are real? | **precision** |

In `notebooks/05_bayes_by_simulation.ipynb` you will find a model with **96.8% recall and 9.1%
precision**. Same model, same data, tenfold difference. The gap is created entirely by how rare fraud
is — the **base rate**.

## Bayes' theorem

$$P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}$$

Read it as a sentence: *take how often B occurs when A is true, weight it by how common A is, and
divide by how often B occurs at all.*

**The term intuition drops is `P(A)` — the base rate.** That single omission is the base-rate fallacy,
and it explains why rare-event detection is so much harder than its accuracy figures suggest.

## Why this section matters beyond 730

The base-rate argument is load-bearing in PhDAI 832:

- A "95% accurate" system can produce a caseload that is overwhelmingly false accusations.
- If base rates differ between groups, **identical model performance produces different precision per
  group, automatically.**
- That fact is the engine of the fairness impossibility result.

Learn it once, here, and you can use it in both courses.

## What to carry into the notebooks

- Probability = long-run frequency. Simulate to check.
- Convergence is dilution, not correction.
- **Conditioning is filtering.**
- `P(A|B) ≠ P(B|A)`. Precision ≠ recall.
- Bayes is bookkeeping; the base rate is the term people forget.
