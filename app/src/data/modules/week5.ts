import type { Module } from "../modules";

const NP = `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
rng = np.random.default_rng(42)
lending = pd.read_csv("data/lending.csv")`;

export const WEEK5: Module[] = [
  /* ===================================================== Session 13 */
  {
    id: "s13-regression",
    session: 13, track: "stats", minutes: 55, setup: NP, packages: ["statsmodels"],
    title: "Regression: the line, the coefficient, the residuals",
    summary: "Fit the line that minimises squared misses, say a coefficient aloud as a sentence, and see an R² of 0.9 hiding a plainly wrong model.",
    video: {
      youtubeId: "7ArmBVF2dCs", title: "Linear Regression, Clearly Explained", channel: "StatQuest", minutes: 27,
      watchFor: [
        "Least squares: the line is the one that minimises the sum of squared vertical distances.",
        "R² is the share of variation the line explains — and adding variables never lowers it.",
        "Watch to ~15:00 for the core; the F-distribution part is optional.",
      ],
    },
    reading: {
      keyIdea: "Regression: draw the line closest to the points, then read information off the line. 'Closest' means minimising Σ(y − ŷ)². Always plot the residuals — R² cannot tell you the shape is wrong.",
      body: [
        "`ŷ = β₀ + β₁x + ε`. `ŷ` (y-hat) is the prediction; `β₀` the intercept; `β₁` the slope — how much `y` moves per unit of `x`; `ε` what the line missed. Fitting means choosing `β₀, β₁` to minimise the sum of squared residuals. Squaring makes the error surface a smooth bowl with one minimum, which calculus can find — and it is the same bowl gradient descent walks down in machine learning.",
        "## Say the coefficient out loud",
        "'Every additional $1 of annual income is associated with $0.32 more borrowed.' That habit turns a table into a finding. In a **multiple** regression, add the clause *holding the other predictors fixed* — which is what lets you separate tangled influences, and also where most misreadings begin: it describes the model's arithmetic, not the world. If two predictors always move together in reality, the estimate of one holding the other fixed describes a situation that never occurs.",
        "## Residual plots",
        "Residuals should look like structureless noise. A U-shape means the relationship is curved; fanning means the error grows with the prediction; clusters mean a missing categorical. You will fit a straight line to curved data, get an `R²` of about 0.9 that would pass most reviews, and watch the residual plot expose it instantly.",
        "## Correlation is not causation, and controls do not fix it",
        "Big branches have more tellers *and* more complaints; the tellers cause nothing. That is **confounding**: a real, significant, entirely spurious association. No p-value warns you — only domain knowledge does — which is why 'we controlled for observables' is a weak defence, and why a statistically impeccable model can still encode a confounded historical process.",
      ],
    },
    exercises: [
      {
        id: "ols", title: "Fit and read a regression",
        prompt: "Regress `loan_amount` on `annual_income` with statsmodels. Store the slope in `slope` and R² in `r2`. Print the sentence: 'each $10,000 of income is associated with $___ more borrowed'.",
        starter: `import statsmodels.api as sm
X = sm.add_constant(lending[["annual_income"]])
fit = sm.OLS(lending["loan_amount"], X).fit()
slope = fit.params["annual_income"]
r2 = ...
print(f"each $10,000 of income -> \${slope*10_000:,.0f} more borrowed;  R² = {r2:.3f}")
`,
        check: `assert 0.25 < slope < 0.40, "The slope should be about 0.32 dollars per dollar"
assert abs(r2 - fit.rsquared) < 1e-9, "r2 should be fit.rsquared"`,
        solution: `import statsmodels.api as sm
X = sm.add_constant(lending[["annual_income"]])
fit = sm.OLS(lending["loan_amount"], X).fit()
slope = fit.params["annual_income"]
r2 = fit.rsquared
print(f"each $10,000 of income -> \${slope*10_000:,.0f} more borrowed;  R² = {r2:.3f}")
`,
      },
      {
        id: "residuals", title: "R² hides a wrong shape",
        prompt: "Fit a straight line to curved data: `x = np.linspace(1, 30, 400)`, `y = 5 + 0.4*x**2 + rng.normal(0, 12, 400)`. Store R² in `r2_bad`. Then plot residuals against fitted values and look for the U.",
        starter: `x = np.linspace(1, 30, 400)
y = 5 + 0.4 * x**2 + rng.normal(0, 12, 400)
bad = sm.OLS(y, sm.add_constant(x)).fit()
r2_bad = ...
print(f"R² = {r2_bad:.3f} — looks fine. Now the residuals:")
plt.scatter(bad.fittedvalues, bad.resid, s=8); plt.axhline(0, color="k")
plt.xlabel("fitted"); plt.ylabel("residual"); plt.title("A U means the model is wrong")
plt.show()
`,
        check: `assert r2_bad > 0.85, "R² should be high — that is the trap"
assert abs(r2_bad - bad.rsquared) < 1e-9`,
        solution: `x = np.linspace(1, 30, 400)
y = 5 + 0.4 * x**2 + rng.normal(0, 12, 400)
bad = sm.OLS(y, sm.add_constant(x)).fit()
r2_bad = bad.rsquared
print(f"R² = {r2_bad:.3f} — looks fine. Now the residuals:")
plt.scatter(bad.fittedvalues, bad.resid, s=8); plt.axhline(0, color="k")
plt.xlabel("fitted"); plt.ylabel("residual"); plt.title("A U means the model is wrong")
plt.show()
`,
      },
      {
        id: "confound", title: "Kill a spurious effect with one control",
        prompt: "Simulate `branch_size = rng.normal(100, 25, 500)`, `tellers = 0.08*branch_size + noise`, `complaints = 0.30*branch_size + noise`. Regress complaints on tellers alone (`coef_naive`), then on tellers *and* branch_size (`coef_controlled`). Watch the tellers effect vanish.",
        starter: `n = 500
branch_size = rng.normal(100, 25, n)
tellers = 0.08*branch_size + rng.normal(0, 1.2, n)
complaints = 0.30*branch_size + rng.normal(0, 6, n)

f1 = sm.OLS(complaints, sm.add_constant(tellers)).fit()
coef_naive = f1.params[1]
f2 = sm.OLS(complaints, sm.add_constant(np.column_stack([tellers, branch_size]))).fit()
coef_controlled = ...
print(f"tellers -> complaints, naive: {coef_naive:+.2f} (p={f1.pvalues[1]:.1e})")
print(f"tellers -> complaints, controlling for branch size: {coef_controlled:+.2f} (p={f2.pvalues[1]:.2f})")
`,
        check: `assert coef_naive > 1.5, "Naively, tellers appear to drive complaints strongly"
assert abs(coef_controlled) < abs(coef_naive) / 3, "With branch size controlled, the tellers effect should collapse"`,
        solution: `n = 500
branch_size = rng.normal(100, 25, n)
tellers = 0.08*branch_size + rng.normal(0, 1.2, n)
complaints = 0.30*branch_size + rng.normal(0, 6, n)

f1 = sm.OLS(complaints, sm.add_constant(tellers)).fit()
coef_naive = f1.params[1]
f2 = sm.OLS(complaints, sm.add_constant(np.column_stack([tellers, branch_size]))).fit()
coef_controlled = f2.params[1]
print(f"tellers -> complaints, naive: {coef_naive:+.2f} (p={f1.pvalues[1]:.1e})")
print(f"tellers -> complaints, controlling for branch size: {coef_controlled:+.2f} (p={f2.pvalues[1]:.2f})")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "OLS chooses the line that minimises…", choices: ["The sum of residuals", "The sum of squared residuals", "The largest residual", "R²"], answer: 1, why: "Squared vertical misses — a smooth bowl with one minimum." },
      { id: "q2", q: "In a multiple regression, β₁ = 0.32 means…", choices: ["x₁ causes y to rise by 0.32", "y rises 0.32 per unit of x₁, holding the other predictors fixed", "32% of y is explained", "The correlation is 0.32"], answer: 1, why: "Holding constant describes the model's arithmetic. Causation is a separate claim." },
      { id: "q3", q: "R² = 0.91 but the residual plot is U-shaped. The model is…", choices: ["Excellent", "Misspecified — the relationship is curved", "Overfit", "Underpowered"], answer: 1, why: "R² cannot see shape. Residual plots can." },
      { id: "q4", q: "A significant effect of tellers on complaints vanishes when branch size is added. This is…", choices: ["Multicollinearity", "Confounding", "Overfitting", "Heteroscedasticity"], answer: 1, why: "A third variable drove both. No p-value warns you; domain knowledge does." },
    ],
  },

  /* ===================================================== Session 14 */
  {
    id: "s14-classification",
    session: 14, track: "stats", minutes: 50, setup: NP, packages: ["scikit-learn"],
    title: "Logistic regression and the accuracy trap",
    summary: "Predict a yes/no outcome, then discover a 91%-accurate model that catches zero defaults. Train/test split, overfitting, and why the threshold is a policy decision.",
    video: {
      youtubeId: "yIYKR4sgzI8", title: "StatQuest: Logistic Regression", channel: "StatQuest", minutes: 9,
      watchFor: [
        "The S-shaped curve squashes any number into a probability between 0 and 1.",
        "Classification happens when you pick a threshold — that choice is yours, not the model's.",
        "Then 'Machine Learning Fundamentals: The Confusion Matrix' (7 min) before the practice.",
      ],
    },
    reading: {
      keyIdea: "On imbalanced data, accuracy measures how common the majority class is, not how good your model is. 'Nobody defaults' scores 91%. The correct reply to 'our model is 95% accurate' is: on what base rate, and what is the recall?",
      body: [
        "Linear regression predicts a number. For a yes/no outcome you need a probability, so logistic regression passes the linear part through a squashing function into (0, 1). You then threshold it — 0.5 is a library default, not a considered decision, and on imbalanced data it is almost always wrong.",
        "## Train/test split",
        "A model can memorise the data it was fitted on. The only honest test is data it has never seen. `stratify=y` keeps the class proportions identical in both halves; without it an imbalanced test set can be wildly unrepresentative. **Overfitting** is memorising noise; the **bias–variance** tradeoff is that simple models miss real structure while complex ones chase noise.",
        "## The confusion matrix",
        "Every metric comes from four counts: true positives, false positives, false negatives, true negatives. **Precision** = of the flagged, the share that are real. **Recall** = of the real, the share caught. **ROC/AUC** judges the *ranking* at every threshold — the probability a random positive scores above a random negative.",
        "## The threshold is a policy lever",
        "Lower it: catch more defaults, raise more false alarms. There is no technically correct row in that table. The right choice depends on what a miss costs *you* versus what a false positive costs *the applicant* — and that second cost is not in your data. No metric supplies it; someone has to decide, and the decision should be documented.",
      ],
    },
    exercises: [
      {
        id: "trap", title: "The accuracy trap",
        prompt: "Split the lending data (30% test, `stratify=y`, `random_state=42`), fit a logistic regression on `annual_income, credit_score, employment_years, dti_ratio, loan_amount`, and compute `acc` (accuracy at 0.5) and `rec` (recall at 0.5). Then compute `acc_zero`: accuracy of predicting 'no default' for everyone.",
        starter: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, recall_score

F = ["annual_income", "credit_score", "employment_years", "dti_ratio", "loan_amount"]
X_tr, X_te, y_tr, y_te = train_test_split(lending[F], lending["defaulted"], test_size=.3, random_state=42, stratify=lending["defaulted"])
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_tr, y_tr)
probs = model.predict_proba(X_te)[:, 1]
pred = (probs >= 0.5).astype(int)

acc = accuracy_score(y_te, pred)
rec = ...
acc_zero = accuracy_score(y_te, np.zeros(len(y_te)))
print(f"accuracy {acc:.1%}   recall {rec:.1%}   'nobody defaults' accuracy {acc_zero:.1%}")
`,
        check: `assert abs(acc - acc_zero) < 0.02, "At 0.5 the model should be about as accurate as predicting no default for everyone"
assert rec < 0.1, "…because it catches almost none of the defaults"`,
        solution: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, recall_score

F = ["annual_income", "credit_score", "employment_years", "dti_ratio", "loan_amount"]
X_tr, X_te, y_tr, y_te = train_test_split(lending[F], lending["defaulted"], test_size=.3, random_state=42, stratify=lending["defaulted"])
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_tr, y_tr)
probs = model.predict_proba(X_te)[:, 1]
pred = (probs >= 0.5).astype(int)

acc = accuracy_score(y_te, pred)
rec = recall_score(y_te, pred)
acc_zero = accuracy_score(y_te, np.zeros(len(y_te)))
print(f"accuracy {acc:.1%}   recall {rec:.1%}   'nobody defaults' accuracy {acc_zero:.1%}")
`,
      },
      {
        id: "threshold", title: "The threshold as policy",
        prompt: "For thresholds 0.05, 0.10, 0.15, 0.25, compute precision and recall into dicts `prec[th]` and `recl[th]`. Then compute `auc` with `roc_auc_score(y_te, probs)`.",
        starter: `from sklearn.metrics import precision_score, roc_auc_score
prec, recl = {}, {}
for th in (0.05, 0.10, 0.15, 0.25):
    p = (probs >= th).astype(int)
    prec[th] = precision_score(y_te, p, zero_division=0)
    recl[th] = recall_score(y_te, p)
    print(f"threshold {th:.2f}  precision {prec[th]:.1%}  recall {recl[th]:.1%}")
auc = ...
print(f"AUC = {auc:.3f}")
`,
        check: `assert recl[0.05] > recl[0.25], "Lower threshold -> higher recall"
assert prec[0.25] > prec[0.05], "Higher threshold -> higher precision"
assert 0.7 < auc < 0.85, "AUC should be about 0.78"`,
        solution: `from sklearn.metrics import precision_score, roc_auc_score
prec, recl = {}, {}
for th in (0.05, 0.10, 0.15, 0.25):
    p = (probs >= th).astype(int)
    prec[th] = precision_score(y_te, p, zero_division=0)
    recl[th] = recall_score(y_te, p)
    print(f"threshold {th:.2f}  precision {prec[th]:.1%}  recall {recl[th]:.1%}")
auc = roc_auc_score(y_te, probs)
print(f"AUC = {auc:.3f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "9% of loans default. A model predicting 'no default' for everyone has accuracy…", choices: ["9%", "50%", "91%", "0%"], answer: 2, why: "Accuracy measures the majority class share on imbalanced data. It is worthless here." },
      { id: "q2", q: "Recall answers…", choices: ["When I flag, am I right?", "Of the real cases, how many did I catch?", "How good is the ranking?", "How balanced are the classes?"], answer: 1, why: "P(flagged | real). Precision is the other direction." },
      { id: "q3", q: "Why `stratify=y` in a train/test split?", choices: ["Speed", "To keep the class proportions identical in both halves", "To remove outliers", "To shuffle"], answer: 1, why: "An imbalanced test set drawn at random can misrepresent the minority class badly." },
      { id: "q4", q: "Who should set the classification threshold for a credit model?", choices: ["The library default (0.5)", "The data scientist alone", "A documented decision weighing the cost of a miss against the cost of a false positive to the applicant", "The regulator"], answer: 2, why: "The second cost is not in the data. That makes the threshold a policy decision, and it belongs in governance." },
    ],
  },
  {
    id: "s14-banking-cases",
    session: 14, track: "ethics", minutes: 55,
    title: "Your four banking cases, and the discussion-board voice",
    summary: "The eight public cases are in everyone's reading list; these four are yours. Outline the remaining three, then practise the 300-word post that earns full credit.",
    reading: {
      keyIdea: "Where a public case shows you did the reading, a banking case shows you have made the decision. Written generically — no employer, no client, no confidential specifics — they are your original contribution.",
      body: [
        "**The natural-language analytics copilot.** A generated query is a model output and belongs in the model inventory; a language model translating questions into queries against customer data is performing exactly the function SR 11-7 says must be validated — and is typically governed as software. Errors are not self-announcing: a wrong query returns a plausible number.",
        "**Alternative data in underwriting.** A model can expand access overall while redistributing it in a way that fails a disparate-impact test. Every proxy-laden variable trades lift against impact, and there is no option without an identifiable loser. The less-discriminatory-alternative search is a legal obligation, not a gesture — and the procedural knowledge of how the choice is actually made and minuted is scarce in academia and abundant in your job.",
        "**Transaction monitoring and precision.** Regulatory penalties make recall the optimised quantity; the cost of a false positive — a frozen account, a failed rent payment — falls on the customer and appears in no risk model. The fairness question is not the model but the *consequence design*: separate alert from action; monitor precision by segment; make time-to-resolution a customer-harm metric.",
        "**Generative adverse-action notices.** A fluent but wrong reason is worse than none: it misdirects the customer's only route to contesting the decision. Generate from structured reason codes, not free text; measure reviewer override rates as a leading indicator of rubber-stamping.",
        "## The discussion-board form",
        "Most doctoral courses require an initial post by mid-week and two substantive replies by the weekend, and that cadence — not the papers — is what sinks people. A post that earns full credit has four parts: a **claim**, a **citation**, a **concrete example from practice**, and a **question that invites reply**. Post early; early posts get more replies, which makes your own replies easier. Use your bank experience deliberately — most of your cohort is arguing from reading; you are arguing from practice.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "Why does a natural-language analytics copilot belong in the model inventory?", choices: ["It uses a GPU", "It performs a model function — translating questions into queries that inform decisions — and SR 11-7 requires such models to be validated", "Because regulators say so explicitly", "It does not belong there"], answer: 1, why: "Governing it as 'software' skips the validation the function demands." },
      { id: "q2", q: "The fairness problem in AML alerting is best located in…", choices: ["The model's accuracy", "The consequence design: what an alert triggers", "The training data", "The regulator"], answer: 1, why: "Identical models produce radically different harm depending on whether an alert freezes funds or opens a case." },
      { id: "q3", q: "A leading indicator that human review of generated notices has become rubber-stamping is…", choices: ["High reviewer satisfaction", "A reviewer override rate approaching zero", "Faster throughput", "Fewer complaints"], answer: 1, why: "If reviewers never change anything, they are not reviewing." },
      { id: "q4", q: "A full-credit discussion post contains…", choices: ["A summary of the reading", "A claim, a citation, a concrete example from practice, and a question that invites reply", "At least 1,000 words", "Three citations"], answer: 1, why: "Four parts. The example from practice is what your cohort mostly cannot supply." },
    ],
  },

  /* ===================================================== Session 15 */
  {
    id: "s15-model-evaluation",
    session: 15, track: "both", minutes: 90, setup: NP, packages: ["scikit-learn"],
    title: "Where both courses meet: compute the impossibility",
    summary: "Evaluate the same model by applicant group, discover that removing the protected attribute removed nothing, and watch two fairness definitions demand different thresholds.",
    video: {
      youtubeId: "4jRBRDbJemM", title: "ROC and AUC, Clearly Explained", channel: "StatQuest", minutes: 16,
      watchFor: [
        "Each point on the ROC curve is one threshold's (false-positive rate, true-positive rate).",
        "AUC summarises the ranking across all thresholds — that is why it is threshold-free.",
        "Keep in mind: a single AUC hides how different groups fare at any *particular* threshold.",
      ],
    },
    reading: {
      keyIdea: "Group membership was never an input, and the outcomes still differ — proxies carry it. Then equalising recall across groups and equalising flag rates require different thresholds. Both are defensible; they are not simultaneously achievable. You must choose, and the choice decides who bears the cost of the model being wrong.",
      body: [
        "The lending data was generated so that true default risk depends only on DTI, credit score and employment — never on `applicant_group`. But group B's recorded income and scores are systematically lower, because the *historical* process was unequal. A model trained without the group column still produces a higher flag rate and a different recall for group B. That is historical bias made concrete, and it is why 'we don't use the protected attribute' is barely relevant.",
        "## Then the arithmetic binds",
        "Fix group A's threshold at 0.15. Find the threshold for group B that matches A's **flag rate** — B's recall drops below A's. Find instead the threshold that matches A's **recall** — B is flagged at about 1.45× A's rate, so more of B's good applicants are wrongly caught. The two thresholds differ, and no third threshold satisfies both, because the groups' base rates differ (roughly 7% vs 14%).",
        "## What that means for you",
        "'Make the model fair' is not a well-posed engineering request. Somebody decides which definition governs; the decision is normative, has identifiable losers, and belongs in governance with an auditable record — exactly the machinery SR 11-7 already demands. In a discussion post, 'when I implemented this, the two criteria required different thresholds' is a far stronger sentence than 'the literature suggests a tension exists'.",
        "## Launch readiness",
        "You are three days from the term. Before Monday: install Zotero with the browser and Word plugins; build an APA 7 title-page template you will reuse; and, the day you get syllabus access, put every due date for both courses on one calendar. An eight-week term has no slack — a deadline discovered late is a deadline missed.",
      ],
    },
    exercises: [
      {
        id: "by-group", title: "Disparity without the attribute",
        prompt: "Refit the same logistic model (features exclude `applicant_group`). On the test set, compute the flag rate at threshold 0.15 for each group into `flag_A`, `flag_B`, and recall at 0.15 into `rec_A`, `rec_B`.",
        starter: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import recall_score

F = ["annual_income", "credit_score", "employment_years", "dti_ratio", "loan_amount"]
X_tr, X_te, y_tr, y_te = train_test_split(lending[F], lending["defaulted"], test_size=.3, random_state=42, stratify=lending["defaulted"])
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_tr, y_tr)
test = lending.loc[X_te.index].copy()
test["prob"] = model.predict_proba(X_te)[:, 1]

A = test[test.applicant_group == "A"]; B = test[test.applicant_group == "B"]
flag_A = (A.prob >= 0.15).mean(); flag_B = ...
rec_A = recall_score(A.defaulted, (A.prob >= 0.15).astype(int)); rec_B = ...
print(f"flag rate  A {flag_A:.1%}  B {flag_B:.1%}")
print(f"recall     A {rec_A:.1%}  B {rec_B:.1%}")
print("applicant_group was never a feature:", "applicant_group" not in F)
`,
        check: `assert flag_B > flag_A * 1.3, "Group B should be flagged noticeably more often, without the attribute being used"
assert abs(rec_B - recall_score(B.defaulted, (B.prob >= 0.15).astype(int))) < 1e-9`,
        solution: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import recall_score

F = ["annual_income", "credit_score", "employment_years", "dti_ratio", "loan_amount"]
X_tr, X_te, y_tr, y_te = train_test_split(lending[F], lending["defaulted"], test_size=.3, random_state=42, stratify=lending["defaulted"])
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_tr, y_tr)
test = lending.loc[X_te.index].copy()
test["prob"] = model.predict_proba(X_te)[:, 1]

A = test[test.applicant_group == "A"]; B = test[test.applicant_group == "B"]
print(f"flag rate  A {flag_A:.1%}  B {flag_B:.1%}")
print(f"recall     A {rec_A:.1%}  B {rec_B:.1%}")
print("applicant_group was never a feature:", "applicant_group" not in F)

flag_B = (B.prob >= 0.15).mean()
rec_B = recall_score(B.defaulted, (B.prob >= 0.15).astype(int))
`,
      },
      {
        id: "impossibility", title: "Two fairness criteria, two thresholds",
        prompt: "Search thresholds 0.02–0.60 for group B. Find `th_parity` that best matches A's flag rate, and `th_equalop` that best matches A's recall. Then report B's recall at `th_parity` and B's flag rate at `th_equalop`.",
        starter: `grid = np.linspace(0.02, 0.60, 300)
def flag(d, t): return (d.prob >= t).mean()
def rec(d, t):  return recall_score(d.defaulted, (d.prob >= t).astype(int), zero_division=0)

th_parity  = grid[np.argmin([abs(flag(B, t) - flag_A) for t in grid])]
th_equalop = ...
print(f"match A's flag rate -> B threshold {th_parity:.3f}, B recall {rec(B, th_parity):.1%} vs A {rec_A:.1%}")
print(f"match A's recall    -> B threshold {th_equalop:.3f}, B flag rate {flag(B, th_equalop):.1%} vs A {flag_A:.1%}")
print("They differ. You must choose which fairness definition governs.")
`,
        check: `assert abs(th_parity - th_equalop) > 0.005, "The two thresholds should differ — that is the impossibility"
assert flag(B, th_equalop) > flag_A * 1.2, "Equalising recall flags group B at a higher rate"`,
        solution: `grid = np.linspace(0.02, 0.60, 300)
def flag(d, t): return (d.prob >= t).mean()
def rec(d, t):  return recall_score(d.defaulted, (d.prob >= t).astype(int), zero_division=0)

th_parity  = grid[np.argmin([abs(flag(B, t) - flag_A) for t in grid])]
th_equalop = grid[np.argmin([abs(rec(B, t) - rec_A) for t in grid])]
print(f"match A's flag rate -> B threshold {th_parity:.3f}, B recall {rec(B, th_parity):.1%} vs A {rec_A:.1%}")
print(f"match A's recall    -> B threshold {th_equalop:.3f}, B flag rate {flag(B, th_equalop):.1%} vs A {flag_A:.1%}")
print("They differ. You must choose which fairness definition governs.")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "The model never saw `applicant_group`, yet flags group B more often. Why?", choices: ["A bug", "The other features carry the group signal — proxies", "Random chance", "The test set is unbalanced"], answer: 1, why: "Income and credit score correlate with group because the historical process was unequal. Removing the attribute removes nothing." },
      { id: "q2", q: "Matching group B's recall to group A's makes B's flag rate…", choices: ["Equal to A's", "Higher than A's — more of B's good applicants are wrongly caught", "Lower than A's", "Zero"], answer: 1, why: "Different base rates mean equalising one criterion unbalances the other. That is the impossibility." },
      { id: "q3", q: "Who bears the cost when you equalise flag rates instead?", choices: ["Group A's good applicants", "The bank, which catches fewer of group B's genuine defaulters", "Nobody", "The regulator"], answer: 1, why: "Every choice has a loser. Naming them is the analysis." },
      { id: "q4", q: "The single most important thing to do the day you get syllabus access is…", choices: ["Read the textbook", "Put every due date for both courses on one calendar", "Introduce yourself on the forum", "Install Python"], answer: 1, why: "An eight-week term has no slack. A deadline discovered late is a deadline missed." },
      { id: "q5", q: "The strongest sentence you can write about fairness in a discussion post is…", choices: ["'The literature suggests a tension exists'", "'Fairness is subjective'", "'When I implemented this, the two criteria required different thresholds'", "'The model should not use race'"], answer: 2, why: "You computed it. Say so." },
    ],
  },
];
