import type { Module } from "../modules";

const NP = `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
rng = np.random.default_rng(42)
lending = pd.read_csv("data/lending.csv")`;

/* ============================================================================
   COURSE WEEKS 2–5 — McClave ch 11 (Simple Linear Regression) and ch 12
   (Multiple Regression and Model Building), plus ch 13 (Categorical Data).
   ========================================================================= */
export const COURSE_REG: Module[] = [
  {
    id: "w2-simple-regression",
    session: 7, track: "stats", minutes: 55, setup: NP, packages: ["statsmodels", "scipy"],
    title: "Simple linear regression (ch 11)",
    summary: "The probabilistic model, least squares, the estimated slope and intercept, the coefficient of correlation and of determination — with statsmodels output read line by line.",
    video: {
      youtubeId: "7ArmBVF2dCs", title: "Linear Regression, Clearly Explained", channel: "StatQuest", minutes: 27,
      watchFor: [
        "Least squares: the line that minimises the sum of squared residuals (McClave's SSE).",
        "R² is the share of variation in y the line explains: (SSyy − SSE)/SSyy.",
        "Watch to ~15:00; the F-distribution part is optional.",
      ],
    },
    reading: {
      keyIdea: "McClave's model is `y = β₀ + β₁x + ε` with ε ~ N(0, σ²), and the fitted line `ŷ = β̂₀ + β̂₁x` minimises SSE = Σ(y − ŷ)². `β̂₁ = SSxy / SSxx`, `β̂₀ = ȳ − β̂₁x̄`, `r = SSxy/√(SSxx·SSyy)`, `r² = (SSyy − SSE)/SSyy`.",
      body: [
        "**The five-step method (§11.1).** 1 Hypothesise the deterministic part `E(y) = β₀ + β₁x`. 2 Collect data and estimate `β̂₀, β̂₁`. 3 Specify the error distribution and estimate `σ²` with `s² = SSE/(n−2)`. 4 Assess usefulness: test `β₁`, compute `r` and `r²`. 5 Use it for estimation (mean of y at x) and prediction (a new y at x).",
        "**The four assumptions on ε** (§11.3): mean zero; constant variance for every x; normal; independent. Chapter 12 shows how to check them with residuals.",
        "**Reading `r` and `r²`.** `r` is between −1 and 1 and carries the sign of the slope; `r²` is the proportion of sample variation in y explained by x. `r = 0.7` means `r² = 0.49` — half the variation explained, half not.",
        "**Standard error of the estimate.** `s = √(SSE/(n−2))` is the typical size of a residual in y's units; McClave's 'about 95% of observations lie within 2s of the line' is the practical reading.",
        "**Output mapping.** In statsmodels' `summary()`: `coef` = β̂, `std err` = SE(β̂), `t` and `P>|t|` are the slope test from ch 11 §11.5, `R-squared` = r², and `Residual std error`/`s` appears via `np.sqrt(fit.mse_resid)`.",
      ],
    },
    exercises: [
      {
        id: "ss", title: "Least squares by the SS formulas",
        prompt: "Regress `loan_amount` (y) on `annual_income` (x) *by hand*: compute `SSxx`, `SSxy`, `SSyy`, then `b1 = SSxy/SSxx`, `b0 = ȳ − b1·x̄`, `r`, and `r2`. Confirm against statsmodels.",
        starter: `import statsmodels.api as sm
x = lending["annual_income"].to_numpy(); y = lending["loan_amount"].to_numpy()
SSxx = ((x - x.mean())**2).sum()
SSyy = ((y - y.mean())**2).sum()
SSxy = ((x - x.mean()) * (y - y.mean())).sum()
b1 = SSxy / SSxx
b0 = ...
r = SSxy / np.sqrt(SSxx * SSyy)
fit = sm.OLS(y, sm.add_constant(x)).fit()
SSE = ((y - (b0 + b1*x))**2).sum()
r2 = ...
print(f"b1={b1:.4f} b0={b0:,.1f} r={r:.4f} r²={r2:.4f}   statsmodels: {fit.params[1]:.4f}, {fit.params[0]:,.1f}, R²={fit.rsquared:.4f}")
`,
        check: `assert abs(b0 - (y.mean() - b1*x.mean())) < 1e-6, "b0 = ȳ − b1·x̄"
assert abs(r2 - (SSyy - SSE)/SSyy) < 1e-9, "r² = (SSyy − SSE)/SSyy"
assert abs(r2 - fit.rsquared) < 1e-6 and abs(r**2 - r2) < 1e-6`,
        solution: `import statsmodels.api as sm
x = lending["annual_income"].to_numpy(); y = lending["loan_amount"].to_numpy()
SSxx = ((x - x.mean())**2).sum()
SSyy = ((y - y.mean())**2).sum()
SSxy = ((x - x.mean()) * (y - y.mean())).sum()
b1 = SSxy / SSxx
b0 = y.mean() - b1 * x.mean()
r = SSxy / np.sqrt(SSxx * SSyy)
fit = sm.OLS(y, sm.add_constant(x)).fit()
SSE = ((y - (b0 + b1*x))**2).sum()
r2 = (SSyy - SSE) / SSyy
print(f"b1={b1:.4f} b0={b0:,.1f} r={r:.4f} r²={r2:.4f}   statsmodels: {fit.params[1]:.4f}, {fit.params[0]:,.1f}, R²={fit.rsquared:.4f}")
`,
      },
      {
        id: "s", title: "The standard error of the estimate",
        prompt: "Compute `s = √(SSE/(n−2))` and store the share of observations whose residual lies within 2s as `within_2s` (McClave's rule of thumb says about 95%).",
        starter: `n = len(y)
s = ...
resid = y - (b0 + b1*x)
within_2s = (np.abs(resid) < 2*s).mean()
print(f"s = {s:,.1f}   within 2s: {within_2s:.1%}")
`,
        check: `assert abs(s - np.sqrt(SSE/(n-2))) < 1e-6
assert 0.9 < within_2s < 0.99`,
        solution: `n = len(y)
s = np.sqrt(SSE / (n - 2))
resid = y - (b0 + b1*x)
within_2s = (np.abs(resid) < 2*s).mean()
print(f"s = {s:,.1f}   within 2s: {within_2s:.1%}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "In `y = β₀ + β₁x + ε`, the random error ε is assumed to have…", choices: ["Mean β₀", "Mean 0 and constant variance σ²", "Variance that grows with x", "A uniform distribution"], answer: 1, why: "Mean zero, constant variance, normal, independent — the four assumptions of §11.3." },
      { id: "q2", q: "`β̂₁ = SSxy / SSxx`. `SSxy` is…", choices: ["Σ(x−x̄)²", "Σ(x−x̄)(y−ȳ)", "Σ(y−ȳ)²", "SSE"], answer: 1, why: "The cross-product sum of squares; its sign is the slope's sign." },
      { id: "q3", q: "r = −0.8 means r² is…", choices: ["−0.64", "0.64", "0.8", "0.16"], answer: 1, why: "r² = 0.64 — 64% of variation explained; the negative sign belongs to r, not r²." },
      { id: "q4", q: "The estimate of σ² in simple regression is…", choices: ["SSE/n", "SSE/(n−2)", "SSyy/(n−1)", "SSxx/(n−2)"], answer: 1, why: "Two parameters were estimated, so n−2 degrees of freedom." },
      { id: "q5", q: "'About 95% of y-values lie within ___ of the fitted line.'", choices: ["s", "2s", "r", "2r²"], answer: 1, why: "McClave's practical interpretation of the standard error of the estimate." },
    ],
  },

  {
    id: "w3-regression-inference",
    session: 8, track: "stats", minutes: 50, setup: NP, packages: ["statsmodels", "scipy"],
    title: "Inference in regression: slope tests, CIs, prediction (ch 11 §11.5–11.7)",
    summary: "Testing whether x contributes information (H₀: β₁ = 0), a confidence interval for the slope, and the difference between a confidence interval for E(y) and a prediction interval for a new y.",
    reading: {
      keyIdea: "`t = β̂₁ / SE(β̂₁)` with n−2 df tests H₀: β₁ = 0. A CI for `E(y)` at x is narrow (you are estimating a mean); a prediction interval for one new y at x is wider (it also carries the error of a single observation). Both widen as x moves away from x̄.",
      body: [
        "**Test of model usefulness.** `H₀: β₁ = 0` (x contributes no information) vs `Hₐ: β₁ ≠ 0`. `t = β̂₁ / s_β̂₁`, where `s_β̂₁ = s/√SSxx`; reject when `|t| > t_{α/2, n−2}`. The `P>|t|` column is this test.",
        "**Confidence interval for β₁:** `β̂₁ ± t_{α/2} · s_β̂₁`. Interpret it in units: 'each additional $1 of income is associated with between $0.29 and $0.35 more borrowed, with 95% confidence'.",
        "**Estimation vs prediction (§11.7).** CI for the mean `E(y)` at `x_p`: `ŷ ± t_{α/2}·s·√(1/n + (x_p−x̄)²/SSxx)`. Prediction interval for a *new* y: `ŷ ± t_{α/2}·s·√(1 + 1/n + (x_p−x̄)²/SSxx)` — the extra `1` is the single-observation error, and it dominates. Exams ask which interval a question wants: 'the average loan for applicants earning $80k' is a CI; 'the loan for *this* applicant earning $80k' is a PI.",
        "**Extrapolation.** Neither interval is valid outside the range of x in the data.",
      ],
    },
    exercises: [
      {
        id: "slope-test", title: "Test and interval for the slope",
        prompt: "From the `loan_amount ~ annual_income` fit, read `t_slope`, `p_slope`, and the 95% CI `(lo, hi)` for the slope from statsmodels, and confirm `t_slope` equals `coef / std err`.",
        starter: `import statsmodels.api as sm
X = sm.add_constant(lending[["annual_income"]])
fit = sm.OLS(lending["loan_amount"], X).fit()
t_slope = fit.tvalues["annual_income"]
p_slope = fit.pvalues["annual_income"]
lo, hi = fit.conf_int().loc["annual_income"]
by_hand = ...
print(f"t={t_slope:.2f}  p={p_slope:.2e}  95% CI [{lo:.4f}, {hi:.4f}]  by hand t={by_hand:.2f}")
`,
        check: `assert abs(by_hand - t_slope) < 1e-6, "t = coef / std err"
assert p_slope < 0.001 and lo > 0`,
        solution: `import statsmodels.api as sm
X = sm.add_constant(lending[["annual_income"]])
fit = sm.OLS(lending["loan_amount"], X).fit()
t_slope = fit.tvalues["annual_income"]
p_slope = fit.pvalues["annual_income"]
lo, hi = fit.conf_int().loc["annual_income"]
by_hand = fit.params["annual_income"] / fit.bse["annual_income"]
print(f"t={t_slope:.2f}  p={p_slope:.2e}  95% CI [{lo:.4f}, {hi:.4f}]  by hand t={by_hand:.2f}")
`,
      },
      {
        id: "ci-vs-pi", title: "Confidence interval vs prediction interval",
        prompt: "At an income of $80,000, get the 95% CI for the mean loan (`ci_lo, ci_hi`) and the 95% prediction interval for one new loan (`pi_lo, pi_hi`) using `fit.get_prediction(...).summary_frame()`. Confirm the PI is wider.",
        starter: `pred = fit.get_prediction(sm.add_constant(pd.DataFrame({"annual_income": [80_000]}), has_constant="add")).summary_frame(alpha=0.05)
ci_lo, ci_hi = pred["mean_ci_lower"][0], pred["mean_ci_upper"][0]
pi_lo, pi_hi = ...
print(f"mean loan at $80k: CI [{ci_lo:,.0f}, {ci_hi:,.0f}]   one new loan: PI [{pi_lo:,.0f}, {pi_hi:,.0f}]")
`,
        check: `assert (pi_hi - pi_lo) > 3 * (ci_hi - ci_lo), "The prediction interval should be far wider than the CI for the mean"`,
        solution: `pred = fit.get_prediction(sm.add_constant(pd.DataFrame({"annual_income": [80_000]}), has_constant="add")).summary_frame(alpha=0.05)
ci_lo, ci_hi = pred["mean_ci_lower"][0], pred["mean_ci_upper"][0]
pi_lo, pi_hi = pred["obs_ci_lower"][0], pred["obs_ci_upper"][0]
print(f"mean loan at $80k: CI [{ci_lo:,.0f}, {ci_hi:,.0f}]   one new loan: PI [{pi_lo:,.0f}, {pi_hi:,.0f}]")
`,
        hint: "The summary frame has `obs_ci_lower` / `obs_ci_upper` for the prediction interval.",
      },
    ],
    quiz: [
      { id: "q1", q: "The test of model usefulness in simple regression is…", choices: ["H₀: β₀ = 0", "H₀: β₁ = 0", "H₀: r = 1", "H₀: σ = 0"], answer: 1, why: "If the slope is zero, x contributes no information about y." },
      { id: "q2", q: "'Estimate the average loan amount for applicants earning $80,000' calls for…", choices: ["A prediction interval", "A confidence interval for E(y)", "A CI for β₁", "R²"], answer: 1, why: "A mean → confidence interval. One specific new observation → prediction interval." },
      { id: "q3", q: "Why is a prediction interval wider than a CI for the mean at the same x?", choices: ["More data", "It also includes the error of a single observation (the extra '1' under the root)", "Different α", "It is not"], answer: 1, why: "Predicting one value carries σ² of that value on top of the uncertainty in the line." },
      { id: "q4", q: "Both intervals are narrowest at…", choices: ["x = 0", "x = x̄", "The largest x", "The smallest x"], answer: 1, why: "The (x_p − x̄)² term vanishes at the mean of x." },
    ],
  },

  {
    id: "w3-multiple-regression",
    session: 9, track: "stats", minutes: 55, setup: NP, packages: ["statsmodels", "scipy"],
    title: "Multiple regression (ch 12 §12.1–12.4)",
    summary: "Several predictors at once: the first-order model, the global F-test, individual t-tests, R² versus adjusted R², and reading 'holding the others fixed' correctly.",
    video: {
      youtubeId: "EkAQAi3a4js", title: "Multiple Regression, Clearly Explained", channel: "StatQuest", minutes: 6,
      watchFor: [
        "The same least-squares idea, now fitting a plane (or hyperplane).",
        "Why adding a variable never lowers R² — and why adjusted R² exists.",
        "The F-test asks whether the whole set of predictors is useful; t-tests ask about each one.",
      ],
    },
    reading: {
      keyIdea: "`E(y) = β₀ + β₁x₁ + … + βₖxₖ`. The global F-test (H₀: all βᵢ = 0) asks whether the model is useful at all; individual t-tests ask whether each xᵢ contributes given the others; adjusted R² penalises variables that add nothing.",
      body: [
        "**Fitting.** Same least squares, `s² = SSE/(n − (k+1))` with k predictors. statsmodels handles the linear algebra; your job is interpretation.",
        "**Global F-test (§12.3).** `H₀: β₁ = β₂ = … = βₖ = 0`. `F = (R²/k) / ((1−R²)/(n−k−1))`; reject when F is large (`Prob (F-statistic)` in the summary). Do this *first*; individual t-tests are only meaningful if the model as a whole is useful.",
        "**Interpreting βᵢ.** The change in E(y) per unit change in xᵢ, *holding the other x's fixed*. This is a statement about the model's arithmetic, not the world: if two predictors always move together, 'holding one fixed' describes a situation that never occurs.",
        "**R² vs adjusted R²** (§12.3). R² never decreases when a variable is added — even noise. `R²_adj = 1 − (n−1)/(n−(k+1)) · (1−R²)` can decrease, which is why it is the one to compare models with.",
        "**Multicollinearity** (§12.10). When predictors are highly correlated with each other, individual coefficients become unstable and their signs can flip, while the overall fit is fine. Diagnose with the correlation matrix or variance inflation factors (VIF > 10 is trouble).",
      ],
    },
    exercises: [
      {
        id: "first-order", title: "Fit a first-order model and read the tests",
        prompt: "Regress `loan_amount` on `annual_income, credit_score, employment_years, dti_ratio`. Store the global F p-value `p_F`, R² and adjusted R² (`r2`, `r2_adj`), and the p-value of `employment_years` (`p_emp`).",
        starter: `import statsmodels.api as sm
X = sm.add_constant(lending[["annual_income", "credit_score", "employment_years", "dti_ratio"]])
fit = sm.OLS(lending["loan_amount"], X).fit()
p_F = fit.f_pvalue
r2, r2_adj = fit.rsquared, ...
p_emp = fit.pvalues["employment_years"]
print(fit.summary().tables[1])
print(f"global F p={p_F:.2e}   R²={r2:.4f}   adj R²={r2_adj:.4f}   employment_years p={p_emp:.3f}")
`,
        check: `assert abs(r2_adj - fit.rsquared_adj) < 1e-12
assert p_F < 1e-6 and r2_adj < r2`,
        solution: `import statsmodels.api as sm
X = sm.add_constant(lending[["annual_income", "credit_score", "employment_years", "dti_ratio"]])
fit = sm.OLS(lending["loan_amount"], X).fit()
p_F = fit.f_pvalue
r2, r2_adj = fit.rsquared, fit.rsquared_adj
p_emp = fit.pvalues["employment_years"]
print(fit.summary().tables[1])
print(f"global F p={p_F:.2e}   R²={r2:.4f}   adj R²={r2_adj:.4f}   employment_years p={p_emp:.3f}")
`,
      },
      {
        id: "adjr2", title: "Adjusted R² penalises noise",
        prompt: "Add a pure-noise column `noise = rng.normal(size=len(lending))` to the predictors and refit. Store `r2_more` and `r2_adj_more`. R² must not fall; adjusted R² should not rise meaningfully.",
        starter: `X2 = X.copy()
X2["noise"] = rng.normal(size=len(lending))
fit2 = sm.OLS(lending["loan_amount"], X2).fit()
r2_more, r2_adj_more = ...
print(f"R²  {r2:.5f} -> {r2_more:.5f}     adj R²  {r2_adj:.5f} -> {r2_adj_more:.5f}")
`,
        check: `assert r2_more >= r2 - 1e-12, "R² never decreases when a variable is added"
assert r2_adj_more <= r2_adj + 1e-4, "Adjusted R² should not reward noise"`,
        solution: `X2 = X.copy()
X2["noise"] = rng.normal(size=len(lending))
fit2 = sm.OLS(lending["loan_amount"], X2).fit()
r2_more, r2_adj_more = fit2.rsquared, fit2.rsquared_adj
print(f"R²  {r2:.5f} -> {r2_more:.5f}     adj R²  {r2_adj:.5f} -> {r2_adj_more:.5f}")
`,
      },
      {
        id: "vif", title: "Variance inflation factors",
        prompt: "Compute the VIF for each predictor (excluding the constant) into a dict `vif`, using `statsmodels.stats.outliers_influence.variance_inflation_factor`. Then create a near-duplicate predictor `income_k = annual_income/1000 + tiny noise` and show its VIF explodes (`vif_dup`).",
        starter: `from statsmodels.stats.outliers_influence import variance_inflation_factor as VIF
cols = ["annual_income", "credit_score", "employment_years", "dti_ratio"]
Xm = sm.add_constant(lending[cols])
vif = {c: VIF(Xm.values, i) for i, c in enumerate(Xm.columns) if c != "const"}
Xd = Xm.copy(); Xd["income_k"] = lending["annual_income"]/1000 + rng.normal(0, 0.01, len(lending))
vif_dup = ...
print({k: round(v, 2) for k, v in vif.items()}, "  duplicate income VIF:", round(vif_dup, 1))
`,
        check: `assert all(v < 5 for v in vif.values()), "The original predictors should have modest VIFs"
assert vif_dup > 100, "A near-duplicate predictor should have a huge VIF"`,
        solution: `from statsmodels.stats.outliers_influence import variance_inflation_factor as VIF
cols = ["annual_income", "credit_score", "employment_years", "dti_ratio"]
Xm = sm.add_constant(lending[cols])
vif = {c: VIF(Xm.values, i) for i, c in enumerate(Xm.columns) if c != "const"}
Xd = Xm.copy(); Xd["income_k"] = lending["annual_income"]/1000 + rng.normal(0, 0.01, len(lending))
vif_dup = VIF(Xd.values, list(Xd.columns).index("income_k"))
print({k: round(v, 2) for k, v in vif.items()}, "  duplicate income VIF:", round(vif_dup, 1))
`,
      },
    ],
    quiz: [
      { id: "q1", q: "The global F-test's null hypothesis is…", choices: ["β₀ = 0", "All slope parameters are zero", "R² = 0.5", "The residuals are normal"], answer: 1, why: "It asks whether the set of predictors is useful at all — run it before individual t-tests." },
      { id: "q2", q: "Adding a random-noise predictor to a model…", choices: ["Lowers R²", "Never lowers R², but tends to lower adjusted R²", "Raises adjusted R²", "Changes nothing"], answer: 1, why: "R² can only stay or rise; adjusted R² penalises the extra parameter." },
      { id: "q3", q: "β₂ = 40 in a multiple regression means…", choices: ["y rises 40 whenever x₂ rises 1", "E(y) rises 40 per unit of x₂, holding the other predictors fixed", "x₂ causes y", "40% of y is explained by x₂"], answer: 1, why: "Holding the others fixed — a statement about the model, not necessarily achievable in the world." },
      { id: "q4", q: "A VIF of 45 for a predictor indicates…", choices: ["A strong effect", "Severe multicollinearity — its coefficient is unstable", "A useless model", "A perfect fit"], answer: 1, why: "VIF above 10 flags predictors that are largely explained by the other predictors." },
    ],
  },

  {
    id: "w4-model-building",
    session: 10, track: "stats", minutes: 60, setup: NP, packages: ["statsmodels", "scipy"],
    title: "Model building: interactions, quadratics, dummy variables, nested F-tests (ch 12 §12.5–12.9)",
    summary: "Beyond the first-order model — how to let one predictor's effect depend on another, how to fit curvature, how to include categories, and how to test whether a set of extra terms earns its place.",
    reading: {
      keyIdea: "Interaction `x₁x₂` lets the slope of x₁ depend on x₂; a quadratic `x²` fits curvature; a qualitative variable with c levels needs c−1 dummy (0/1) variables against a base level; a nested (partial) F-test compares a complete model with a reduced one to decide whether the extra terms matter.",
      body: [
        "**Interaction** (§12.5): `E(y) = β₀ + β₁x₁ + β₂x₂ + β₃x₁x₂`. The slope of y against x₁ is `β₁ + β₃x₂` — it changes with x₂. Test `H₀: β₃ = 0` to decide whether the interaction is needed.",
        "**Quadratic** (§12.6): `E(y) = β₀ + β₁x + β₂x²`. `β₂ > 0` is upward curvature (convex), `β₂ < 0` downward. Test `H₀: β₂ = 0`. Always plot the data first — curvature is visible before it is significant.",
        "**Dummy variables** (§12.7): a category with levels A, B, C becomes two 0/1 columns (`B`, `C`) with A as the *base level*; each coefficient is that level's mean difference from the base, holding other x's fixed. With `k` levels use `k−1` dummies — all `k` would make the columns collinear with the intercept (the *dummy variable trap*). `pd.get_dummies(..., drop_first=True)`.",
        "**Nested model F-test** (§12.9): complete model with all terms vs reduced model without the g extra terms: `F = ((SSE_R − SSE_C)/g) / (SSE_C/(n−k−1))`. Reject H₀ (extra terms all zero) when F is large. statsmodels: `fit_c.compare_f_test(fit_r)`.",
        "**Stepwise selection** (§12.8) is a screening tool, not a proof — variables chosen by stepwise need a theoretical reason before they go in a paper.",
      ],
    },
    exercises: [
      {
        id: "dummies", title: "Dummy variables and a base level",
        prompt: "Regress `loan_amount` on `annual_income` plus dummies for `region` (base level North). Store the coefficients for `region_South` and `region_Central` as `b_south`, `b_central`, and interpret them in the print.",
        starter: `import statsmodels.api as sm
d = pd.get_dummies(lending[["annual_income", "region"]], columns=["region"], drop_first=False).astype(float)
d = d.drop(columns=["region_North"])            # North is the base level
fit = sm.OLS(lending["loan_amount"], sm.add_constant(d)).fit()
b_south = fit.params["region_South"]
b_central = ...
print(f"vs North, holding income fixed: South {b_south:+,.0f}   Central {b_central:+,.0f}   (p = {fit.pvalues['region_South']:.3f}, {fit.pvalues['region_Central']:.3f})")
`,
        check: `assert abs(b_central - fit.params["region_Central"]) < 1e-9
assert "region_North" not in fit.params.index, "North must be the base level (dropped)"`,
        solution: `import statsmodels.api as sm
d = pd.get_dummies(lending[["annual_income", "region"]], columns=["region"], drop_first=False).astype(float)
d = d.drop(columns=["region_North"])            # North is the base level
fit = sm.OLS(lending["loan_amount"], sm.add_constant(d)).fit()
b_south = fit.params["region_South"]
b_central = fit.params["region_Central"]
print(f"vs North, holding income fixed: South {b_south:+,.0f}   Central {b_central:+,.0f}   (p = {fit.pvalues['region_South']:.3f}, {fit.pvalues['region_Central']:.3f})")
`,
      },
      {
        id: "interaction", title: "Does DTI's effect depend on credit score?",
        prompt: "Model `defaulted` (as a 0/1 number, linear probability model for practice) on `dti_ratio`, `credit_score`, and their interaction. Store the interaction's p-value `p_int`. Then compute the slope of DTI at credit score 620 and at 760 (`slope_620`, `slope_760`).",
        starter: `df = lending.copy()
df["dti_x_score"] = df["dti_ratio"] * df["credit_score"]
X = sm.add_constant(df[["dti_ratio", "credit_score", "dti_x_score"]])
fit = sm.OLS(df["defaulted"], X).fit()
p_int = fit.pvalues["dti_x_score"]
b1, b3 = fit.params["dti_ratio"], fit.params["dti_x_score"]
slope_620 = b1 + b3 * 620
slope_760 = ...
print(f"interaction p={p_int:.4f}   slope of DTI at 620: {slope_620:.3f}   at 760: {slope_760:.3f}")
`,
        check: `assert abs(slope_760 - (b1 + b3*760)) < 1e-12, "slope at x2 = β1 + β3·x2"`,
        solution: `df = lending.copy()
df["dti_x_score"] = df["dti_ratio"] * df["credit_score"]
X = sm.add_constant(df[["dti_ratio", "credit_score", "dti_x_score"]])
fit = sm.OLS(df["defaulted"], X).fit()
p_int = fit.pvalues["dti_x_score"]
b1, b3 = fit.params["dti_ratio"], fit.params["dti_x_score"]
slope_620 = b1 + b3 * 620
slope_760 = b1 + b3 * 760
print(f"interaction p={p_int:.4f}   slope of DTI at 620: {slope_620:.3f}   at 760: {slope_760:.3f}")
`,
      },
      {
        id: "nested", title: "Nested F-test: do the extra terms earn their place?",
        prompt: "Reduced model: `loan_amount ~ annual_income`. Complete model: add `credit_score`, `employment_years`, `dti_ratio`. Compute the nested F-test with `compare_f_test` and store `F_nested`, `p_nested`. Then recompute F by hand from the two SSEs.",
        starter: `Xr = sm.add_constant(lending[["annual_income"]])
Xc = sm.add_constant(lending[["annual_income", "credit_score", "employment_years", "dti_ratio"]])
fit_r = sm.OLS(lending["loan_amount"], Xr).fit()
fit_c = sm.OLS(lending["loan_amount"], Xc).fit()
F_nested, p_nested, g = fit_c.compare_f_test(fit_r)
n, k = len(lending), 4
F_hand = ...
print(f"F={F_nested:.3f} (by hand {F_hand:.3f})   p={p_nested:.3e}   extra terms g={int(g)}")
`,
        check: `assert abs(F_hand - F_nested) < 1e-6, "F = ((SSE_R − SSE_C)/g) / (SSE_C/(n−k−1))"`,
        solution: `Xr = sm.add_constant(lending[["annual_income"]])
Xc = sm.add_constant(lending[["annual_income", "credit_score", "employment_years", "dti_ratio"]])
fit_r = sm.OLS(lending["loan_amount"], Xr).fit()
fit_c = sm.OLS(lending["loan_amount"], Xc).fit()
F_nested, p_nested, g = fit_c.compare_f_test(fit_r)
n, k = len(lending), 4
F_hand = ((fit_r.ssr - fit_c.ssr) / g) / (fit_c.ssr / (n - k - 1))
print(f"F={F_nested:.3f} (by hand {F_hand:.3f})   p={p_nested:.3e}   extra terms g={int(g)}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "A qualitative variable with 4 levels needs how many dummy variables?", choices: ["4", "3", "1", "2"], answer: 1, why: "k − 1; the omitted level is the base. Using all 4 is the dummy variable trap." },
      { id: "q2", q: "In `E(y) = β₀ + β₁x₁ + β₂x₂ + β₃x₁x₂`, the slope of y against x₁ is…", choices: ["β₁", "β₁ + β₃x₂", "β₃", "β₁ + β₂"], answer: 1, why: "The interaction makes x₁'s effect depend on x₂'s value." },
      { id: "q3", q: "A negative β₂ on an x² term means…", choices: ["No curvature", "Downward (concave) curvature", "Upward curvature", "A negative slope"], answer: 1, why: "The sign of the quadratic coefficient gives the direction of curvature." },
      { id: "q4", q: "The nested F-test compares…", choices: ["Two unrelated models", "A complete model with a reduced model missing some of its terms", "R² across datasets", "Two samples"], answer: 1, why: "It tests whether the extra terms, as a group, reduce SSE more than chance would." },
      { id: "q5", q: "The dummy coefficient for 'South' (base North) is −1,200. It means…", choices: ["South loans are $1,200 lower on average than North, holding the other x's fixed", "South causes lower loans", "1,200 South loans", "North is 1,200 higher than all others"], answer: 0, why: "Each dummy is a mean difference from the base level, other predictors held fixed." },
    ],
  },

  {
    id: "w5-residuals-diagnostics",
    session: 12, track: "stats", minutes: 45, setup: NP, packages: ["statsmodels", "scipy"],
    title: "Residual analysis: checking the assumptions (ch 12 §12.12)",
    summary: "Residual plots for a wrong functional form, non-constant variance, outliers and influential points, and non-normality — the section the case study will lean on hardest.",
    reading: {
      keyIdea: "Residuals should look like structureless noise. A curved pattern means the model's form is wrong; a funnel means non-constant variance; a few far-out points may be outliers or influential; a bent Q–Q plot means non-normal errors. Each pattern has a named fix.",
      body: [
        "**Wrong form.** A U or arch in residuals-vs-fitted → add a quadratic term or transform x.",
        "**Heteroscedasticity.** A funnel (spread grows with fitted value) → transform y (log or square root), or use weighted least squares. Money data almost always needs `log(y)`.",
        "**Outliers and influence.** Standardised residuals beyond ±3 are outliers; *influential* points also pull the line — check leverage and Cook's distance (`fit.get_influence()`). Investigate before deleting; a data error is removed, a genuine extreme case is reported.",
        "**Non-normality.** Q–Q plot (`scipy.stats.probplot`) or a histogram of residuals. Mild departures matter little with large n (the CLT rescues inference on β̂); heavy tails with small n do matter.",
        "**Independence.** Residuals plotted in time order should show no drift or cycles (Durbin–Watson ≈ 2 is fine). Time-series data usually violates this and needs ch 12's time-series methods or a different model.",
      ],
    },
    exercises: [
      {
        id: "funnel", title: "Diagnose and fix heteroscedasticity",
        prompt: "Fit `loan_amount ~ annual_income`, plot residuals vs fitted, and compute the correlation between `|residual|` and fitted value (`corr_abs`). Then refit with `log(loan_amount)` and recompute (`corr_abs_log`). The funnel should shrink.",
        starter: `import statsmodels.api as sm
X = sm.add_constant(lending[["annual_income"]])
fit = sm.OLS(lending["loan_amount"], X).fit()
corr_abs = np.corrcoef(np.abs(fit.resid), fit.fittedvalues)[0, 1]
fit_log = sm.OLS(np.log(lending["loan_amount"]), X).fit()
corr_abs_log = ...
fig, ax = plt.subplots(1, 2, figsize=(10, 3.4))
ax[0].scatter(fit.fittedvalues, fit.resid, s=5, alpha=.3); ax[0].axhline(0, color="k"); ax[0].set_title("raw y: a funnel?")
ax[1].scatter(fit_log.fittedvalues, fit_log.resid, s=5, alpha=.3); ax[1].axhline(0, color="k"); ax[1].set_title("log y")
plt.show()
print(f"corr(|resid|, fitted): raw {corr_abs:.3f}   log {corr_abs_log:.3f}")
`,
        check: `assert abs(corr_abs_log - np.corrcoef(np.abs(fit_log.resid), fit_log.fittedvalues)[0,1]) < 1e-9
assert corr_abs_log < corr_abs, "The log transform should reduce the spread-vs-level relationship"`,
        solution: `import statsmodels.api as sm
X = sm.add_constant(lending[["annual_income"]])
fit = sm.OLS(lending["loan_amount"], X).fit()
corr_abs = np.corrcoef(np.abs(fit.resid), fit.fittedvalues)[0, 1]
fit_log = sm.OLS(np.log(lending["loan_amount"]), X).fit()
corr_abs_log = np.corrcoef(np.abs(fit_log.resid), fit_log.fittedvalues)[0, 1]
fig, ax = plt.subplots(1, 2, figsize=(10, 3.4))
ax[0].scatter(fit.fittedvalues, fit.resid, s=5, alpha=.3); ax[0].axhline(0, color="k"); ax[0].set_title("raw y: a funnel?")
ax[1].scatter(fit_log.fittedvalues, fit_log.resid, s=5, alpha=.3); ax[1].axhline(0, color="k"); ax[1].set_title("log y")
plt.show()
print(f"corr(|resid|, fitted): raw {corr_abs:.3f}   log {corr_abs_log:.3f}")
`,
      },
      {
        id: "influence", title: "Find outliers and influential points",
        prompt: "From the raw fit, get standardised residuals and Cook's distance via `fit.get_influence()`. Store the count of standardised residuals beyond ±3 as `n_outliers` and the index of the single most influential observation as `most_influential`.",
        starter: `infl = fit.get_influence()
std_resid = infl.resid_studentized_internal
cooks = infl.cooks_distance[0]
n_outliers = int((np.abs(std_resid) > 3).sum())
most_influential = ...
print(f"outliers beyond ±3: {n_outliers}   most influential row: {most_influential}  (Cook's D = {cooks[most_influential]:.4f})")
`,
        check: `assert most_influential == int(np.argmax(cooks))`,
        solution: `infl = fit.get_influence()
std_resid = infl.resid_studentized_internal
cooks = infl.cooks_distance[0]
n_outliers = int((np.abs(std_resid) > 3).sum())
most_influential = int(np.argmax(cooks))
print(f"outliers beyond ±3: {n_outliers}   most influential row: {most_influential}  (Cook's D = {cooks[most_influential]:.4f})")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "A funnel-shaped residual plot indicates…", choices: ["Non-normality", "Non-constant variance", "Wrong functional form", "Independence"], answer: 1, why: "Spread growing with the fitted value — heteroscedasticity. A log transform of y is the usual first remedy." },
      { id: "q2", q: "A U-shaped residual plot indicates…", choices: ["Outliers", "The model's form is wrong — add curvature", "Constant variance", "Autocorrelation"], answer: 1, why: "A straight line was fitted to a curve." },
      { id: "q3", q: "An observation with a large Cook's distance…", choices: ["Should always be deleted", "Pulls the fitted line — investigate before deciding", "Is definitely a typo", "Has no residual"], answer: 1, why: "Influence is a reason to look, not an automatic reason to delete." },
      { id: "q4", q: "With n = 4,000, mild non-normality of residuals…", choices: ["Invalidates all inference", "Matters little — the CLT protects inference on the coefficients", "Requires a nonparametric test", "Means R² is wrong"], answer: 1, why: "Large samples make the coefficient estimates approximately normal regardless." },
    ],
  },
];
