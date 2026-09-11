# 05 · Regression and Model Evaluation

**Read before Sessions 13–15 · 12 minutes**

## Regression in one sentence

**Draw the line that comes closest to the points, then read information off the line.**

$$\hat{y} = \beta_0 + \beta_1 x + \varepsilon$$

`ŷ` prediction · `β₀` intercept · `β₁` slope · `ε` what the line missed.

"Closest" means minimising `Σ(y − ŷ)²` — the sum of squared vertical misses. Squaring makes the error
surface a smooth bowl with one minimum, which calculus can find. It is also the bowl gradient descent
walks down in machine learning: same idea, bigger problems.

## Say the coefficient out loud

The habit that turns output into a finding:

> "Every additional $1 of income is associated with $0.32 more borrowed."

In a **multiple** regression, add the crucial clause: **"holding the other predictors fixed."** That
phrase is what lets you disentangle influences — and it is also where most misreadings begin, because
"holding fixed" describes the model's arithmetic, not the world. If two predictors always move
together in reality, the estimate of one "holding the other constant" describes a situation that never
occurs.

## R² and its limits

`R²` is the share of variance the model explains, 0 to 1. It is useful and it is not sufficient: **a
model can have a high `R²` and be badly, visibly wrong.**

## Always plot residuals

Residuals (`y − ŷ`) should look like **structureless noise**. Any pattern is the model failing:

| Pattern | Diagnosis |
|---|---|
| U-shape or arc | The relationship is curved; a straight line is the wrong form |
| Fanning out | Heteroscedasticity — error grows with the prediction |
| Clusters | A missing categorical variable |
| Drift over time | Non-stationarity; the relationship is changing |

In `notebooks/10_regression.ipynb` you will see an `R²` of about 0.9 on a model that is unambiguously
wrong, exposed instantly by its residual plot. `R²` cannot tell you the *shape* is wrong.

## Correlation is not causation — and controls do not fix it

**Confounding:** a third variable drives both your predictor and your outcome, producing a real,
highly significant, entirely spurious association. Bigger branches have more tellers *and* more
complaints; the tellers cause nothing.

**No p-value warns you about this.** Only domain knowledge does. Which is why "we controlled for
observables" is a weak defence — you can only control for what you measured and thought of.

## Classification and the accuracy trap

For yes/no outcomes, logistic regression squashes the linear part into a probability between 0 and 1,
which you then threshold.

**The trap:** on imbalanced data, accuracy measures how common the majority class is, not how good
your model is. In `notebooks/11_model_evaluation.ipynb` a model scores **90.8% accuracy while catching
zero of 110 actual defaults** — exactly the accuracy of a rule that ignores every input.

You will hear "our model is 95% accurate" for the rest of your career. The correct reply: **"on what
base rate, and what is the recall?"**

## The metrics that actually mean something

| Metric | Question |
|---|---|
| **Precision** | When we flag, are we right? `P(real \| flagged)` |
| **Recall** | Of real cases, how many do we catch? `P(flagged \| real)` |
| **F1** | One number balancing the two |
| **AUC** | How good is the *ranking*, at any threshold? |
| **Confusion matrix** | The four counts everything is computed from |

## The threshold is a policy choice

0.5 is a library default, not a considered decision — and on imbalanced data it is almost always
wrong. Moving it trades false alarms against missed cases.

**There is no technically correct threshold.** The right choice depends on what a miss costs you
versus what a false positive costs *the person affected* — and that second cost is not in your data.
No metric will supply it. Someone has to decide, and that decision should be documented.

## Where both courses meet

Three results you will compute yourself, each central to PhDAI 832:

1. **Removing the protected attribute does not remove disparity.** Proxies carry it.
2. **Different base rates make fairness criteria incompatible.** You cannot equalise flag rates and
   recall simultaneously. This is arithmetic, not ideology.
3. **Therefore "make the model fair" is not a well-posed engineering request.** Someone must choose
   which definition governs — a normative decision, with identifiable losers, belonging to governance
   with a documented rationale.

That last point is where your SR 11-7 experience becomes an academic asset.

## What to carry into the notebooks

- Regression = the line minimising squared error. Say coefficients as sentences.
- **Always plot residuals.** `R²` hides shape errors.
- Confounding is invisible to statistics and visible to domain knowledge.
- **Accuracy lies on imbalanced data.** Ask for recall and the base rate.
- The threshold is a policy lever, and the cost of a false positive usually falls on someone else.
