# Notation Cheat-Sheet

Every symbol you will meet in PhDAI 730, in plain English.

**How to use this:** when a lecture or paper stops you, the problem is almost never the concept — it is
that you hit a symbol and your reading broke. Look it up here, say the sentence in the "Read aloud"
column out loud, and keep going. Notation is a *language*, and you are learning to read, not to prove.

---

## The two that cause the most confusion

Learn these two distinctions first. They account for most of the confusion in an intro course.

| Symbol | Read aloud | What it means |
|---|---|---|
| `x̄` | "x-bar" | The mean **of your sample** — the data you actually have. A number you can compute. |
| `µ` | "mew" | The mean **of the whole population** — the truth you are trying to guess. Usually unknowable. |

> The entire discipline of statistics exists because of the gap between `x̄` and `µ`. You have `x̄`.
> You want `µ`. Everything else — standard error, confidence intervals, hypothesis tests — is
> machinery for reasoning about how far apart they might be.

| Symbol | Read aloud | What it means |
|---|---|---|
| `σ` | "sigma" (lowercase) | **Standard deviation** — how spread out the individual data points are. |
| `SE` | "standard error" | How spread out the **sample means** would be if you repeated the study. |

> `SE = σ / √n`. More data does **not** reduce `σ` — the world is as variable as it is. More data
> reduces `SE`, because your *estimate* gets more reliable. Confusing these two is the single most
> common error in applied statistics.

---

## Greek letters

| Symbol | Read aloud | Meaning |
|---|---|---|
| `µ` | mew | Population mean (the true average) |
| `σ` | sigma | Population standard deviation (spread) |
| `σ²` | sigma squared | Variance — the standard deviation squared. Same information, different units. |
| `Σ` | SUM (capital sigma) | "Add all of these up." Not related to lowercase `σ`, confusingly. |
| `α` | alpha | Your threshold for "surprising enough" — usually 0.05. Also the Type I error rate. |
| `β` | beta | Type II error rate. **Also** a regression coefficient — context tells you which. |
| `θ` | theta | A generic stand-in for "the parameter I am trying to estimate." |
| `θ̂` | "theta-hat" | The **estimate** of θ from data. **A hat always means "estimated from data."** |
| `ε` | epsilon | The error term — the part of the outcome your model does not explain. |
| `λ` | lambda | A rate (Poisson), or a regularization strength (machine learning). |
| `ρ` | rho | Population correlation. |
| `χ²` | chi-squared | A test for categorical data. |
| `Π` | product (capital pi) | "Multiply all of these together." |

**The hat rule is worth memorizing on its own:** `θ` is truth, `θ̂` is your guess. `y` is the real
value, `ŷ` is your prediction. Any hat means "computed from data, therefore uncertain."

---

## Probability

| Symbol | Read aloud | Meaning |
|---|---|---|
| `P(A)` | "P of A" | The probability that A happens. |
| `P(A\|B)` | "P of A **given** B" | Probability of A **in the world where B already happened.** |
| `P(A ∩ B)` | "A **and** B" | Both happen. |
| `P(A ∪ B)` | "A **or** B" | At least one happens. |
| `P(Aᶜ)` or `P(A')` | "not A" | A does not happen. Equals `1 − P(A)`. |
| `A ⊥ B` | "A independent of B" | Knowing B tells you nothing about A. |
| `X ~ N(µ, σ²)` | "X is distributed normal with mean µ and variance σ²" | `~` means "is drawn from." |
| `E[X]` | "expected value of X" | The long-run average of X. A weighted average, not a prediction. |
| `Var(X)` | "variance of X" | How much X bounces around its expected value. |

**The pipe `|` is the one to slow down on.** `P(fraud \| alert)` and `P(alert \| fraud)` are wildly
different numbers, and swapping them is the base-rate fallacy — the thing you will simulate in Session 5.
A fraud model can be 99% accurate and still have most of its alerts be false alarms, purely because
fraud is rare. That single idea shows up in your ethics course too, as the technical reason a
"high-accuracy" model can still be unfair.

---

## Inference

| Symbol | Read aloud | Meaning |
|---|---|---|
| `H₀` | "H-naught" / "H-zero" | The **null** hypothesis: nothing is happening, the effect is zero. |
| `H₁` or `Hₐ` | "H-one" / "H-alternative" | The claim you are actually interested in. |
| `p` | "p-value" | **If `H₀` were true**, how often would I see data this extreme or worse? |
| `α` | alpha | The cutoff you chose in advance. Reject `H₀` when `p < α`. |
| `CI` | confidence interval | A range of plausible values for the parameter. |
| `n` | "n" | Sample size — how many observations. |
| `df` | degrees of freedom | Roughly, how many independent pieces of information you have. |

**What a p-value is not** — this gets tested, and it gets argued about in ethics papers:

- ❌ Not the probability that `H₀` is true.
- ❌ Not the probability your result happened by chance.
- ❌ Not a measure of effect size. A tiny, useless effect gets a small p-value with enough data.
- ✅ It is: "assuming nothing is going on, data this weird would show up this often."

---

## Regression and models

| Symbol | Read aloud | Meaning |
|---|---|---|
| `y` | "y" | The outcome you are predicting. |
| `ŷ` | "y-hat" | Your model's **prediction** of y. |
| `X` | "X" (capital) | Your predictors — the whole table of them. |
| `β₀` | "beta-naught" | The intercept: predicted y when every predictor is zero. |
| `β₁` | "beta-one" | The slope: how much y changes when `x₁` goes up by 1, **holding the rest fixed**. |
| `ε` | epsilon | The residual — what your model missed. |
| `R²` | "R-squared" | Share of the variation in y your model accounts for. 0 to 1. |
| `ŷ = β₀ + β₁x + ε` | — | The whole of linear regression, in one line. |

`Σ(y − ŷ)²` — "add up the squared misses." Minimizing that quantity *is* what fitting a regression
means. Everything else is bookkeeping.

---

## Machine learning evaluation

| Term | Meaning | The question it answers |
|---|---|---|
| Accuracy | Fraction correct | "How often am I right?" — **misleading on imbalanced data.** |
| Precision | Of predicted-positive, fraction truly positive | "When I raise an alarm, is it real?" |
| Recall / Sensitivity | Of actual positives, fraction caught | "Of the real cases, how many did I catch?" |
| Specificity | Of actual negatives, fraction correctly cleared | "Do I leave innocent cases alone?" |
| F1 | Harmonic mean of precision and recall | "One number balancing the two." |
| ROC / AUC | Performance across every threshold | "How good is the ranking, regardless of cutoff?" |
| Confusion matrix | The 2×2 table of TP/FP/FN/TN | Everything above is computed from this. |

**Why accuracy lies.** If 1% of loans default, a model that predicts "never defaults" for everyone is
**99% accurate** and completely worthless. This is why your statistics course teaches precision and
recall, and it is the same arithmetic that makes fairness hard in PhDAI 832: precision and recall can
be equalized across groups, or the overall error rate can be minimized, but generally not both.

---

## Reading a formula you have never seen

A procedure that works. Take `x̄ = (1/n) Σxᵢ`:

1. **Find the equals sign.** Left is what is being defined: `x̄`, the sample mean.
2. **Find the `Σ`.** Something is being added up. What? `xᵢ` — each individual data point.
3. **Read the rest as instructions.** Multiply by `1/n`, i.e. divide by how many there are.
4. **Say it as a sentence.** "The sample mean is the sum of the values divided by how many there are."

That is just *the average* — which you have computed a thousand times in a spreadsheet. Most formulas
in an intro course are things you already understand, written in a compressed alphabet. The notation is
an encoding, not a new idea. Decode first, then judge whether it is hard.
