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
| `X ~ Bin(n, p)` | "X is binomial" | Number of successes in n independent trials with success probability p. `E(X) = np`, `Var(X) = np(1−p)`. |
| `X ~ Pois(λ)` | "X is Poisson" | Count of events in a fixed interval when they occur at average rate λ. `E(X) = Var(X) = λ`. |
| `X ~ N(µ, σ²)` | "X is normal" | The bell curve with mean µ and variance σ². `z = (x − µ)/σ` puts any normal on the standard one. |
| `X ~ Exp(θ)` | "X is exponential" | Waiting time between Poisson events; mean θ, memoryless. |
| `p(x)` vs `f(x)` | "p of x / f of x" | Probability *mass* (discrete: a probability at each value) vs probability *density* (continuous: area under the curve is the probability; a single point has probability 0). |
| continuity correction | — | Using the normal to approximate the binomial: `P(X ≤ 7)` becomes `P(Y ≤ 7.5)`. |

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
| `SSE` | "S-S-E" | Sum of squared errors, `Σ(y − ŷ)²` — what least squares minimises. |
| `s` | "s" (standard error of the estimate) | `√(SSE/(n−2))` — the typical size of a residual, in y's units. About 95% of points lie within 2s of the line. |
| `r` | "r" | Coefficient of correlation, −1 to 1: strength and direction of a *linear* relationship. |
| `r²` | "r-squared" | Coefficient of determination — the share of variation in y explained by the line. `r = 0.7` → only 49% explained. |
| `R²_adj` | "adjusted R-squared" | R² penalised for the number of predictors; the one to compare models with, because plain R² never falls when a variable is added. |
| `k` | "k" | Number of predictors in a multiple regression; the model has `k + 1` parameters. |
| `F` | "F" | The global test that *all* slopes are zero. Do it before reading any individual t-test. |
| `x₁x₂` | "x-one x-two" (interaction) | Lets the slope of x₁ depend on x₂: slope of x₁ = `β₁ + β₃x₂`. |
| `x²` | "x squared" (quadratic term) | Curvature. `β₂ < 0` bends downward, `β₂ > 0` upward. |
| dummy variable | — | A 0/1 column standing for one level of a category. A category with c levels needs `c − 1` dummies; the omitted level is the **base**. |
| `VIF` | "variance inflation factor" | How much a predictor is explained by the *other* predictors. Above 10 = multicollinearity; the coefficient is unstable. |
| CI for E(y) vs PI | — | Confidence interval for the **mean** y at x (narrow) vs prediction interval for **one new** y at x (much wider). |
| Cook's D | "Cook's distance" | How much one observation pulls the fitted line. Large → investigate before deciding anything. |

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

## Categorical data and nonparametric tests

| Symbol | Read aloud | Meaning |
|---|---|---|
| `χ²` | "chi-square" | The statistic `Σ(observed − expected)²/expected` — the squared gap between the counts you saw and the counts H₀ predicted, scaled by what you expected. Big χ² → reject. Upper tail only. |
| `Eᵢ` | "expected count" | In a one-way table, `n·pᵢ₀`. Every `Eᵢ` must be ≥ 5 for the χ² approximation to hold. |
| `Êᵢⱼ` | "expected count in cell i, j" | In a two-way table, `(row total × column total)/n` — what independence would produce. |
| `(r − 1)(c − 1)` | — | Degrees of freedom for a test of independence in an r × c table. One-way table: `k − 1`. |
| multinomial | — | n independent trials, k possible outcomes each — the binomial with more than two categories. |
| `η` | "eta" | A population **median**. The sign test's hypothesis is about η, not µ. |
| `S` | "S" (sign test) | Number of observations above the hypothesised median. Under H₀, `S ~ Binomial(n, ½)`. |
| `T₁` | "T-one" (rank sum) | Sum of the ranks of sample 1 after pooling and ranking both samples. Wilcoxon rank-sum = Mann–Whitney U. |
| `T₊`, `T₋` | "T-plus, T-minus" | In the signed-rank test: sums of the ranks of positive and negative paired differences. |
| `H` | "H" (Kruskal–Wallis) | `12/(n(n+1)) · Σ Rⱼ²/nⱼ − 3(n+1)` — rank-based one-way ANOVA. `~ χ²(k−1)` when every nⱼ ≥ 5. |
| `F_r` | "F-r" (Friedman) | Rank-based randomised-block ANOVA: rank within each block, then `12/(bk(k+1)) · Σ Rⱼ² − 3b(k+1)`. |
| `r_s` | "r-sub-s" (Spearman) | Rank correlation: Pearson's r on the ranks. No ties: `1 − 6Σd²/(n(n²−1))`. Measures *monotonic* association; robust to outliers. |
| `Rⱼ` | "R-j" | Rank sum for group (or treatment) j. |
| nonparametric | "distribution-free" | A test that works on ranks or signs and assumes no particular population shape. Less power than the t-test when data really are normal; much safer when they are not. |

**How to choose.** Counts in categories → χ². One median → sign test. Two independent samples → rank-sum.
Paired → signed-rank. k independent groups → Kruskal–Wallis. k treatments within blocks → Friedman.
Two rankings → Spearman. Each is the rank-based twin of a parametric test you already know.

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
