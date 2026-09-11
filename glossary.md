# Glossary

Plain-English definitions for both courses. Statistics terms first, then ethics.

## Statistics and machine learning

**Accuracy** — fraction of predictions correct. Misleading whenever classes are imbalanced; see
*base rate*.

**AUC** — area under the ROC curve. The probability the model scores a random positive case above a
random negative one. Threshold-free.

**Base rate** — how common the thing you are predicting actually is. Determines *precision* as much
as model quality does. Ignoring it is the *base-rate fallacy*.

**Bayes' theorem** — the rule for updating a probability given new evidence. Bookkeeping for counting
outcomes in the subgroup where the evidence holds.

**Bias (statistical)** — systematic error; an estimate that is wrong in a consistent direction. Not
the same as *bias (social)*.

**Bias–variance tradeoff** — simple models miss real structure (bias); complex models chase noise
(variance). Generalisation requires balancing the two.

**Bootstrap** — resample your own data with replacement to measure uncertainty in any statistic,
without needing a formula.

**Central Limit Theorem (CLT)** — the distribution of a sample *mean* is approximately normal
regardless of the population's shape, given a large enough sample. The reason inference works.

**Confidence interval** — a range produced by a procedure that captures the true value in (say) 95%
of repetitions. A property of the method, not a probability about your one interval.

**Confounding** — a third variable driving both the predictor and the outcome, creating a real,
significant, but spurious association. No p-value warns you about it.

**Confusion matrix** — the 2×2 table of true/false positives/negatives. Every classification metric
is computed from it.

**Correlation** — strength of linear association, −1 to +1. Not causation.

**Degrees of freedom (df)** — roughly, how many independent pieces of information a statistic has.

**Expected value `E[X]`** — the long-run weighted average. Describes a portfolio, never an individual.

**Histogram** — counts of observations per bin. The first plot you should draw, always.

**Hypothesis test** — asks "if nothing were going on, how often would I see data this extreme?"

**Logistic regression** — regression for a yes/no outcome, squashed into a 0–1 probability.

**Log-normal** — right-skewed distribution arising from multiplicative growth. What money looks like.

**Mean / median / mode** — three centres. Median for skewed data; mean when you need totals; mode for
categories.

**Normal distribution** — the bell curve, `N(µ, σ²)`. 68/95/99.7% of values within 1/2/3 σ.

**Null hypothesis `H₀`** — the assumption that nothing is happening; what a test tries to refute.

**Overfitting** — the model memorises the training data, including its noise, and fails on new data.

**p-value** — probability of data this extreme *if `H₀` were true*. Not the probability `H₀` is true.

**p-hacking** — testing many things and reporting only the significant ones. Test 20 things at α=0.05
and you expect one false positive.

**Power** — probability of detecting a real effect. `1 − β`. Below 80% is usually inadequate.

**Precision** — of the cases you flagged, the fraction that were real. `P(real | flagged)`.

**R²** — share of variance in the outcome explained by the model. Can be high while the model is
badly misspecified — always plot residuals.

**Recall (sensitivity)** — of the real cases, the fraction you caught. `P(flagged | real)`.

**Regression** — fitting a line (or plane) by minimising squared errors, then reading information off
it.

**Residual** — actual minus predicted. Residual plots should look like structureless noise.

**Sampling distribution** — the distribution of a statistic across many hypothetical samples. The
central idea behind all inference.

**Standard deviation `σ`** — typical distance of an individual observation from the mean. **More data
does not shrink it.**

**Standard error `SE`** — how much your *estimate* would vary across samples. `σ/√n`. **More data does
shrink it**, like `1/√n`.

**Stratified split** — splitting data so each part preserves the class proportions.

**Train/test split** — fit on one portion, evaluate on data the model has never seen.

**Type I error** — false positive; rejecting a true `H₀`. Rate `α`.

**Type II error** — false negative; missing a real effect. Rate `β`.

**Variance `σ²`** — squared standard deviation. Mathematically convenient, uninterpretable units.

---

## Ethics and responsible AI

**Accountability** — identifiable, answerable ownership of an AI system's outcomes. Diffuse
accountability ("the model decided") is the failure mode.

**AI RMF (NIST)** — the US risk-management framework. Four functions: **Govern, Map, Measure,
Manage**. Voluntary, and the de facto reference in US practice.

**Algorithmic bias** — systematically different outcomes across groups. Distinguish the *source*:
historical, representation, measurement, aggregation, or deployment.

**Calibration** — a predicted probability means the same thing in every group: among cases scored
0.3, about 30% are positive, for each group.

**Demographic parity** — equal *selection rates* across groups, regardless of outcomes. Also called
statistical parity.

**Differential privacy** — a mathematical guarantee that an analysis reveals little about any single
individual, by adding calibrated noise.

**Disparate impact** — a neutral-looking rule producing substantially worse outcomes for a protected
group. A legal standard in US lending (ECOA) and employment law.

**Disparate treatment** — differing treatment *because of* protected status. Explicit discrimination.

**Equalized odds** — equal true-positive *and* false-positive rates across groups.

**Equal opportunity** — the weaker version: equal true-positive rates (recall) only.

**EU AI Act** — the EU's risk-tiered regulation: unacceptable (banned), high-risk (heavy obligations),
limited-risk (transparency), minimal. Credit scoring is **high-risk**.

**Explainability** — the ability to say why a model produced a specific output. See *SHAP*, *LIME*.

**Fairness impossibility** — calibration, equal false-positive rates and equal false-negative rates
cannot generally hold simultaneously unless base rates are equal or the classifier is perfect.
(Kleinberg, Mullainathan & Raghavan 2016; Chouldechova 2017.) The core technical result of the field.

**Historical bias** — the world the data recorded was already unequal, so a perfectly accurate model
faithfully reproduces that inequality. **Removing the protected attribute does not fix it**, because
proxies carry the signal.

**Human-in-the-loop** — a person with genuine authority to override. Rubber-stamping is not
human-in-the-loop.

**IEEE 7000** — standard for embedding ethical values into system design from the outset.

**LIME** — local explanation method: approximates the model near one prediction with a simple one.

**Model card** — a short standardised document: intended use, performance **disaggregated by group**,
limitations. (Mitchell et al. 2019.)

**Datasheet for datasets** — the dataset equivalent: how it was collected, who is in it, known gaps.
(Gebru et al. 2021.)

**Model risk management** — the banking discipline (US: **SR 11-7**) of validating, documenting,
independently challenging and monitoring models. Maps closely onto AI RMF *Govern* and *Manage*, and
substantially predates AI governance.

**Proxy variable** — a feature that correlates with a protected attribute (ZIP code for race, name
for gender), transmitting disparity even when the protected attribute is excluded.

**SHAP** — Shapley-value-based attribution of a prediction across input features. Widely used, and
frequently over-interpreted as causal when it is not.

**Transparency** — disclosure that a system exists, what it does, and on what basis. Distinct from
explainability, which is about a specific output.

**Trustworthy AI** — the umbrella term: valid, reliable, safe, secure, accountable, transparent,
explainable, privacy-enhanced and fair (NIST's characteristics).
