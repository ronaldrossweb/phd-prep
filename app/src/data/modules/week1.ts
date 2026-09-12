import type { Module } from "../modules";

export const WEEK1: Module[] = [
  /* ===================================================== Session 1 */
  {
    id: "s1-first-contact",
    session: 1, track: "stats", minutes: 40,
    setup: `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
deposits = pd.read_csv("data/branch_deposits.csv")
lending = pd.read_csv("data/lending.csv")
x = deposits["balance"]`,

    title: "First contact: load, look, describe, plot",
    summary: "The four moves you will make in every data assignment for the next eight weeks — done for real, in your browser, on bank-shaped data.",
    video: {
      youtubeId: "vmEHCJofslg", title: "Complete Python Pandas Data Science Tutorial", channel: "Keith Galli", minutes: 15,
      watchFor: [
        "Watch only the first ~15 minutes: reading a CSV, `.head()`, `.describe()`, selecting columns, filtering rows.",
        "Notice that a DataFrame is a table: rows are **observations**, columns are **variables**.",
        "You do not need to remember syntax — you will practise it in a moment with hints available.",
      ],
    },
    reading: {
      keyIdea: "Rows are observations, columns are variables, and `n` is how many rows. Load, look, describe, plot — everything later is a variation on these four moves.",
      body: [
        "Every dataset in this course is a table. Each **row** is one observation (an account, a loan, a transaction); each **column** is one variable (balance, income, whether it defaulted). When a lecture says 'observation' and 'variable', it means row and column. When it writes `n`, it means the row count.",
        "`pd.read_csv` reads a file into a **DataFrame**. `.head()` shows the first rows, `.shape` gives `(rows, columns)`, `.describe()` summarises every numeric column: count, mean, standard deviation, min, quartiles, max. The `50%` row is the **median**.",
        "## The one thing to notice today",
        "In the deposits data the mean balance is about **six times** the median. Both are called 'the average' in everyday speech, and they disagree by a factor of six. A handful of very large balances drag the mean up; the median just asks what the middle account looks like. This is why 'average balance' is a nearly useless phrase in a bank unless you say which average — and why you should plot before you conclude.",
        "## Two operations do most of the work",
        "Filtering rows: `df[df[\"product\"] == \"CD\"]`. Grouping: `df.groupby(\"branch\")[\"balance\"].mean()` — split into groups, compute something for each. That pattern is called split-apply-combine and you will use it constantly.",
      ],
    },
    exercises: [
      {
        id: "load", title: "Load the deposits and look at them",
        prompt: "Read `data/branch_deposits.csv` into a variable called `deposits`, then print its shape and show the first five rows.",
        starter: `import pandas as pd

deposits = pd.read_csv("data/branch_deposits.csv")
print(deposits.shape)
print(deposits.head())
`,
        check: `assert "deposits" in globals(), "Create a variable called deposits"
assert deposits.shape == (1200, 5), f"Expected 1200 rows and 5 columns, got {deposits.shape}"`,
        solution: `import pandas as pd

deposits = pd.read_csv("data/branch_deposits.csv")
print(deposits.shape)
print(deposits.head())
`,
      },
      {
        id: "mean-median", title: "Mean versus median",
        prompt: "Compute the mean and the median of `balance` and store them in `mean_bal` and `median_bal`. Print the ratio. Then say to yourself why they differ.",
        starter: `mean_bal = deposits["balance"].mean()
median_bal = ...
print(f"mean {mean_bal:,.0f}   median {median_bal:,.0f}   ratio {mean_bal/median_bal:.1f}x")
`,
        check: `assert abs(mean_bal - deposits["balance"].mean()) < 1, "mean_bal is not the mean of balance"
assert abs(median_bal - deposits["balance"].median()) < 1, "median_bal is not the median of balance"
assert mean_bal / median_bal > 4, "Check: the mean should be several times the median here"`,
        solution: `mean_bal = deposits["balance"].mean()
median_bal = deposits["balance"].median()
print(f"mean {mean_bal:,.0f}   median {median_bal:,.0f}   ratio {mean_bal/median_bal:.1f}x")
`,
        hint: "The method is `.median()`, exactly parallel to `.mean()`.",
      },
      {
        id: "hist", title: "Your first histogram",
        prompt: "Draw a histogram of `balance` with 60 bins. Look at the shape: a tall pile on the left and a long tail to the right is called right-skewed.",
        starter: `import matplotlib.pyplot as plt

plt.hist(deposits["balance"], bins=60)
plt.title("Account balances")
plt.xlabel("balance ($)")
plt.show()
`,
        check: `assert True`,
        solution: `import matplotlib.pyplot as plt

plt.hist(deposits["balance"], bins=60)
plt.title("Account balances")
plt.xlabel("balance ($)")
plt.show()
`,
      },
      {
        id: "groupby", title: "Split, apply, combine",
        prompt: "For each `branch`, compute the median balance. Store the result in `by_branch` and print it.",
        starter: `by_branch = deposits.groupby("branch")["balance"].median()
print(by_branch)
`,
        check: `import pandas as pd
assert isinstance(by_branch, pd.Series), "by_branch should be the result of a groupby"
assert set(by_branch.index) == {"Ogden","Provo","Logan","St. George"}, "Group by branch"
assert abs(by_branch["Provo"] - deposits[deposits.branch=="Provo"].balance.median()) < 1, "Use the median, not the mean"`,
        solution: `by_branch = deposits.groupby("branch")["balance"].median()
print(by_branch)
`,
      },
    ],
    quiz: [
      { id: "q1", q: "In a DataFrame of loans, what is a single row?", choices: ["A variable", "An observation — one loan", "A summary statistic", "A column header"], answer: 1, why: "Rows are observations; columns are variables. Lectures use those words constantly and mean exactly this." },
      { id: "q2", q: "`deposits.shape` returns `(1200, 5)`. What is `n`?", choices: ["5", "1200", "6000", "It depends on the column"], answer: 1, why: "`n` is the number of observations — the row count — and it appears in almost every formula in the course." },
      { id: "q3", q: "The mean balance is $24,000 and the median is $3,900. What does that tell you?", choices: ["The data has an error", "A few very large values pull the mean up; the data is right-skewed", "Most customers hold about $24,000", "The median was computed wrongly"], answer: 1, why: "A few large values drag the mean but barely move the median. That gap is the signature of a right-skewed distribution — the normal state of money data." },
      { id: "q4", q: "Which line gives the mean balance per product?", choices: ["`deposits.mean(\"product\")`", "`deposits[\"product\"].mean()`", "`deposits.groupby(\"product\")[\"balance\"].mean()`", "`deposits.balance.groupby()`"], answer: 2, why: "Split by product, take balance, compute the mean for each group. Split–apply–combine." },
      { id: "q5", q: "What should you do before computing any summary statistic?", choices: ["Sort the data", "Plot it", "Remove the outliers", "Standardise it"], answer: 1, why: "A number can hide a shape; a shape cannot hide from a plot. One line of code, and it prevents most bad conclusions." },
    ],
  },

  /* ===================================================== Session 2 */
  {
    id: "s2-shape-center-spread",
    session: 2, track: "stats", minutes: 45,
    setup: `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
deposits = pd.read_csv("data/branch_deposits.csv")
lending = pd.read_csv("data/lending.csv")
x = deposits["balance"]`,

    title: "Shape, center, spread",
    summary: "Any distribution is three questions. Learn the three centers and when each is honest, why variance is squared, and the four shapes to recognise on sight.",
    video: {
      youtubeId: "qBigTkBLU6g", title: "Histograms, Clearly Explained", channel: "StatQuest", minutes: 4,
      watchFor: [
        "A histogram is bins of measurements: bar height is *how many* observations landed in that range.",
        "Notice how bin width changes what you see — too few bins hides shape, too many shows noise.",
        "The curve drawn over a histogram is the idea of a *distribution* — which values happen, and how often.",
      ],
    },
    reading: {
      keyIdea: "Describe any variable with three questions — shape, center, spread. Median for skewed data; mean when you need totals; standard deviation for spread, reported in the original units.",
      body: [
        "**Center.** Three measures answer different questions. The **median** (sort, take the middle) is unmoved by extreme values — use it for money and anything skewed. The **mean** has the one property the median lacks: `mean × n` recovers the **total**, so a bank cannot avoid it. The **mode** is for categories. A careful analyst reports both mean and median and says which is which.",
        "**Spread.** The range is hostage to one outlier. The interquartile range (middle 50%) is robust. The **variance** `σ²` is the average squared distance from the mean; the **standard deviation** `σ` is its square root.",
        "## Why variance is squared",
        "Distances from the mean cancel to exactly zero by definition — that is what 'mean' means. Squaring fixes the sign, and squares are smooth and differentiable, which matters enormously once you reach gradient descent. Then you take the square root to return to dollars. So: variance is the mathematically convenient one; standard deviation is the interpretable one. They carry identical information. Report `σ`.",
        "## Four shapes by sight",
        "**Symmetric / bell** — mean ≈ median (heights, test scores). **Right-skewed** — mean > median (money, almost always). **Left-skewed** — mean < median (age at death, exams with a ceiling). **Bimodal** — two humps, which almost always means two mixed populations. When you see two humps, do not compute a statistic; ask *what variable am I missing?*, split on it, and describe each group.",
      ],
    },
    exercises: [
      {
        id: "spread", title: "Measure the spread three ways",
        prompt: "For `balance`, compute the interquartile range as `iqr`, the standard deviation as `sd`, and the variance as `var`. Print all three. Notice the units of variance.",
        starter: `import pandas as pd
deposits = pd.read_csv("data/branch_deposits.csv")
x = deposits["balance"]

iqr = x.quantile(.75) - x.quantile(.25)
sd = ...
var = ...
print(f"IQR \${iqr:,.0f}   sd \${sd:,.0f}   variance {var:,.0f} (dollars squared!)")
`,
        check: `assert abs(sd - x.std()) < 1, "sd should be x.std()"
assert abs(var - x.var()) < 1, "var should be x.var()"
assert abs(sd*sd - var) < 1, "variance must equal sd squared"`,
        solution: `import pandas as pd
deposits = pd.read_csv("data/branch_deposits.csv")
x = deposits["balance"]

iqr = x.quantile(.75) - x.quantile(.25)
sd = x.std()
var = x.var()
print(f"IQR \${iqr:,.0f}   sd \${sd:,.0f}   variance {var:,.0f} (dollars squared!)")

print(f"IQR \${iqr:,.0f}   sd \${sd:,.0f}   variance {var:,.0f}")
`,
        hint: "`.std()` and `.var()`. Check that `sd**2` equals `var`.",
      },
      {
        id: "deviations", title: "Prove deviations cancel",
        prompt: "Compute the deviations `x - x.mean()`, then their plain sum and their squared sum. Store them as `raw_sum` and `sq_sum`. The first should be (floating-point) zero.",
        starter: `dev = x - x.mean()
raw_sum = dev.sum()
sq_sum = ...
print(f"sum of deviations: {raw_sum:.6f}")
print(f"sum of squared deviations: {sq_sum:,.0f}")
`,
        check: `assert abs(raw_sum) < 1e-3, "Raw deviations should sum to (nearly) zero"
assert sq_sum > 1e6, "Squared deviations should be large and positive"`,
        solution: `dev = x - x.mean()
raw_sum = dev.sum()
sq_sum = (dev**2).sum()
print(f"sum of deviations: {raw_sum:.6f}")
print(f"sum of squared deviations: {sq_sum:,.0f}")

print(raw_sum, sq_sum)
`,
      },
      {
        id: "skew-groups", title: "Skew, and a disparity",
        prompt: "Load `data/lending.csv` as `lending`. Compute the skew of `annual_income` as `inc_skew`, then the mean `credit_score` for each `applicant_group` as `score_by_group`. Print both. Then plot credit score histograms for the two groups on one chart.",
        starter: `lending = pd.read_csv("data/lending.csv")
inc_skew = lending["annual_income"].skew()
score_by_group = lending.groupby("applicant_group")["credit_score"].mean()
print("income skew:", round(inc_skew, 2))
print(score_by_group)

import matplotlib.pyplot as plt
for g, d in lending.groupby("applicant_group"):
    plt.hist(d["credit_score"], bins=40, alpha=.55, label=f"group {g}")
plt.legend(); plt.title("Credit score by applicant group"); plt.show()
`,
        check: `assert abs(inc_skew - lending["annual_income"].skew()) < 1e-6
assert set(score_by_group.index) == {"A","B"}
assert score_by_group["A"] > score_by_group["B"], "Look again: which group has the higher mean score?"`,
        solution: `lending = pd.read_csv("data/lending.csv")
inc_skew = lending["annual_income"].skew()
score_by_group = lending.groupby("applicant_group")["credit_score"].mean()
print("income skew:", round(inc_skew, 2))
print(score_by_group)

import matplotlib.pyplot as plt
for g, d in lending.groupby("applicant_group"):
    plt.hist(d["credit_score"], bins=40, alpha=.55, label=f"group {g}")
plt.legend(); plt.title("Credit score by applicant group"); plt.show()
`,
      },
    ],
    quiz: [
      { id: "q1", q: "Which measure of center would you put in a report about typical account balances?", choices: ["Mean", "Median", "Mode", "Range"], answer: 1, why: "Balances are right-skewed; the median is unmoved by the few huge accounts. Report the mean too if a total matters." },
      { id: "q2", q: "Why do we square deviations when computing variance?", choices: ["To make the numbers bigger", "Because raw deviations cancel to zero, and squares are smooth to work with", "Because dollars must be squared", "Tradition"], answer: 1, why: "Deviations from the mean sum to zero by definition. Squaring fixes the sign; smoothness matters later for optimisation." },
      { id: "q3", q: "Variance is 4,000,000 dollars². What is the standard deviation?", choices: ["$4,000,000", "$2,000", "$400", "$20,000"], answer: 1, why: "`σ = √σ²` = √4,000,000 = 2,000, back in dollars." },
      { id: "q4", q: "A histogram of transaction times has two clear humps. The right move is to…", choices: ["Report the mean", "Report the median", "Find the variable that splits the two groups", "Add more bins"], answer: 2, why: "Two humps means two mixed populations. A single mean would describe nobody; split on the missing variable first." },
      { id: "q5", q: "Group B's credit scores sit visibly to the left of group A's. What does that establish?", choices: ["Group B is less creditworthy", "The scoring model is biased", "A difference exists; the cause — creditworthiness vs. an unequal historical process — is a separate question", "Nothing; the difference is random"], answer: 2, why: "The statistic shows a gap. Whether the gap reflects risk or history is exactly what PhDAI 832 is about, and no histogram can settle it." },
    ],
  },
  {
    id: "s2-framework-map",
    session: 2, track: "ethics", minutes: 45,
    title: "The five frameworks, and what each is for",
    summary: "NIST AI RMF, the EU AI Act, OECD Principles, IEEE 7000, and the fairness-ML canon. Learn them by their job, not as a blur of acronyms.",
    video: {
      youtubeId: "_2u_eHHzRto", title: "The era of blind faith in big data must end", channel: "TED · Cathy O'Neil", minutes: 13,
      watchFor: [
        "Her definition of a 'weapon of math destruction': secret, important, and harmful.",
        "The claim that algorithms are *opinions embedded in code* — and who gets to embed them.",
        "The four-step algorithmic audit near the end. Map each step to a framework function as you read.",
      ],
    },
    reading: {
      keyIdea: "NIST AI RMF tells you how to organise the work; the EU AI Act what the law requires; OECD what values are agreed; IEEE 7000 how to design values in; Fairness & ML what is mathematically possible. SR 11-7 — which your cohort will not cite — how a regulated industry has governed models for fifteen years.",
      body: [
        "## NIST AI RMF 1.0 — the spine",
        "Four functions, worth memorising: **GOVERN** (who is accountable, under what policy), **MAP** (what is the context, what could go wrong), **MEASURE** (how do we know), **MANAGE** (what do we do about it). The framework is *cyclical, not linear* — Govern runs continuously alongside the other three. A common weak paper treats ethics as a pre-launch checklist; naming the cycle signals you understand it. NIST also lists the characteristics of trustworthy AI, ending with *fair, with harmful bias managed* — managed, not eliminated. That word is NIST quietly conceding the impossibility result you will meet in week 2.",
        "## EU AI Act — the risk tiers",
        "**Unacceptable** (banned: social scoring, most real-time public biometric ID), **High-risk** (heavy obligations), **Limited** (transparency duties), **Minimal**. The line to remember: **creditworthiness assessment is explicitly high-risk** (Annex III). If your institution touches EU customers, an AI underwriting tool is a regulated product, not a governance nicety — and that is the strongest counter to 'this is all voluntary'.",
        "## OECD Principles, IEEE 7000, and the technical canon",
        "OECD's five principles (inclusive growth; human-centred values and fairness; transparency and explainability; robustness and safety; accountability) are the shared *vocabulary*, thin on procedure. IEEE 7000 insists ethics is a **design-stage** activity — cite it when a harm should have been prevented rather than detected. *Fairness and Machine Learning* (Barocas, Hardt, Narayanan; free at fairmlbook.org) supplies the formal definitions and the impossibility theorem that constrain everything above.",
        "## SR 11-7 — your unfair advantage",
        "Federal Reserve model-risk guidance (2011): documented development, **independent validation** ('effective challenge'), ongoing monitoring, and governance with an inventory and named ownership. Map it: inventory and board reporting → GOVERN; documented purpose and limitations → MAP; independent validation → MEASURE; monitoring and escalation → MANAGE. The thesis this unlocks — *AI governance is an extension of model risk management, not a new discipline* — is defensible, original, and available to you because of your day job.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "Which NIST AI RMF function covers independent validation and disaggregated testing?", choices: ["Govern", "Map", "Measure", "Manage"], answer: 2, why: "Measure is 'how do we know' — metrics, validation, red-teaming. Independent validation under SR 11-7 maps straight onto it." },
      { id: "q2", q: "Under the EU AI Act, credit scoring is…", choices: ["Unacceptable risk", "High-risk", "Limited risk", "Minimal risk"], answer: 1, why: "Annex III lists creditworthiness assessment as high-risk: risk management, documentation, logging, human oversight and conformity assessment are all required." },
      { id: "q3", q: "NIST describes trustworthy AI as 'fair with harmful bias *managed*'. Why not 'eliminated'?", choices: ["Political compromise", "Because competing fairness definitions cannot all be satisfied at once", "Because bias is impossible to measure", "A drafting error"], answer: 1, why: "It is the impossibility result in one word. When base rates differ across groups, some fairness criteria are mathematically incompatible, so bias can only be managed." },
      { id: "q4", q: "You want to argue that a harm should have been prevented at design time rather than caught by audit. Which framework do you cite?", choices: ["OECD Principles", "IEEE 7000", "EU AI Act", "SR 11-7"], answer: 1, why: "IEEE 7000 is the design-stage values standard. That is precisely its contribution." },
      { id: "q5", q: "What is the strongest form of the SR 11-7 argument?", choices: ["Banks are more ethical than tech companies", "AI governance is new and needs new institutions", "AI governance extends an existing, examined model-risk regime; AI adds scale and opacity, not the basic need for an owner and a challenger", "SR 11-7 already covers AI so nothing more is needed"], answer: 2, why: "Not 'nothing new' and not 'everything new': the need for inventory, ownership and effective challenge is old; scale, opacity and non-stationarity are what AI adds." },
    ],
  },

  /* ===================================================== Session 3 */
  {
    id: "s3-distribution-zoo",
    session: 3, track: "stats", minutes: 60,
    setup: `import numpy as np, pandas as pd
import matplotlib.pyplot as plt`,
    title: "The distribution zoo",
    summary: "Generate six distributions from their rules until you recognise each on sight. The 68/95/99.7 rule, and why money is log-normal.",
    video: {
      youtubeId: "rzFX5NWojp0", title: "The Normal Distribution, Clearly Explained", channel: "StatQuest", minutes: 5,
      watchFor: [
        "Two numbers describe every normal curve: the mean (where it sits) and the standard deviation (how wide).",
        "Most values are near the mean; the curve never quite reaches zero.",
        "Keep the 68/95/99.7 rule in mind — it turns `σ` into a ruler.",
      ],
    },
    reading: {
      keyIdea: "A distribution is the answer to 'which values, how often'. Normal comes from many small additive nudges; log-normal from multiplicative ones — which is why money is skewed and why analysts take logs.",
      body: [
        "`X ~ N(µ, σ²)` reads aloud as *X is distributed normal with mean µ and variance σ²*; the tilde means *is drawn from*. `µ` slides the curve, `σ` stretches it. For any normal: ~68% of values lie within 1σ of the mean, ~95% within 2σ, ~99.7% within 3σ — the origin of 'a three-sigma event'.",
        "## Why money is log-normal",
        "Incomes and balances grow by **percentages**, not by fixed amounts: a 3% raise is more dollars on a large salary. Multiplicative processes produce log-normal distributions the same way additive ones produce normal. Take the log of a log-normal variable and it becomes normal — which is why analysts log-transform money before modelling it. Not cosmetic: it converts a multiplicative process into the additive one every standard technique assumes.",
        "## Counting distributions",
        "**Binomial**: successes in `n` yes/no trials with probability `p` each (defaults in a loan book; mean `n·p`). **Poisson**: events in a window when arrivals are independent (fraud alerts per hour; one parameter `λ`, both mean and variance). The practical lesson of both: expected values come with real variation around them. A 200-loan book at 9% expects 18 defaults, yet roughly one book in twenty shows 25 or more by chance alone. A single quarter's uptick is not evidence of deterioration.",
      ],
    },
    exercises: [
      {
        id: "sixty-eight", title: "Verify 68 / 95 / 99.7",
        prompt: "Draw 200,000 standard-normal values with `rng.normal(0, 1, 200_000)` into `z`. Compute the share within 1, 2 and 3 standard deviations as `within1`, `within2`, `within3`.",
        starter: `z = rng.normal(0, 1, 200_000)
within1 = (abs(z) < 1).mean()
within2 = ...
within3 = ...
print(f"{within1:.3f} {within2:.3f} {within3:.3f}")
`,
        check: `assert abs(within1 - 0.683) < 0.01, f"within 1σ should be ~0.683, got {within1:.3f}"
assert abs(within2 - 0.954) < 0.01, f"within 2σ should be ~0.954, got {within2:.3f}"
assert abs(within3 - 0.997) < 0.005, f"within 3σ should be ~0.997, got {within3:.3f}"`,
        solution: `z = rng.normal(0, 1, 200_000)
within1 = (abs(z) < 1).mean()
print(f"{within1:.3f} {within2:.3f} {within3:.3f}")

within1 = (abs(z) < 1).mean(); within2 = (abs(z) < 2).mean(); within3 = (abs(z) < 3).mean()
print(within1, within2, within3)
`,
        hint: "A boolean array's `.mean()` is the proportion that is True.",
      },
      {
        id: "lognormal", title: "Log-normal becomes normal",
        prompt: "Generate 5,000 log-normal values with `rng.lognormal(3, 0.9, 5000)` as `ln`. Compute the skew of `ln` and of `np.log(ln)` (use `pd.Series(...).skew()`), stored as `skew_raw` and `skew_log`. Plot both histograms.",
        starter: `import numpy as np, pandas as pd, matplotlib.pyplot as plt
ln = rng.lognormal(3, 0.9, 5000)
skew_raw = pd.Series(ln).skew()
skew_log = ...
print(f"skew raw {skew_raw:.2f}   skew after log {skew_log:.2f}")

fig, ax = plt.subplots(1, 2, figsize=(10, 3.4))
ax[0].hist(ln, bins=60); ax[0].set_title("log-normal")
ax[1].hist(np.log(ln), bins=60); ax[1].set_title("after np.log: normal")
plt.show()
`,
        check: `assert skew_raw > 1.5, "The raw log-normal should be strongly right-skewed"
assert abs(skew_log) < 0.25, "After taking logs the skew should be near zero"`,
        solution: `import numpy as np, pandas as pd, matplotlib.pyplot as plt
ln = rng.lognormal(3, 0.9, 5000)
skew_raw = pd.Series(ln).skew()
skew_log = pd.Series(np.log(ln)).skew()
print(f"skew raw {skew_raw:.2f}   skew after log {skew_log:.2f}")

fig, ax = plt.subplots(1, 2, figsize=(10, 3.4))
ax[0].hist(ln, bins=60); ax[0].set_title("log-normal")
ax[1].hist(np.log(ln), bins=60); ax[1].set_title("after np.log: normal")
plt.show()
`,
      },
      {
        id: "binomial", title: "Risk limits and luck",
        prompt: "Simulate 10,000 loan books of 500 loans at a 6% default rate with `rng.binomial(500, 0.06, 10000)` as `books`. Store the expected count in `expected` and the 99th percentile in `p99`. How often would a limit set at 35 be breached by luck alone? Store that share in `breach`.",
        starter: `import numpy as np
books = rng.binomial(500, 0.06, 10000)
expected = 500 * 0.06
p99 = np.percentile(books, 99)
breach = (books > 35).mean()
print(f"expected {expected:.0f}   99th pct {p99:.0f}   P(breach 35) {breach:.1%}")
`,
        check: `assert expected == 30
assert 40 <= p99 <= 46, f"99th percentile should be ~43, got {p99}"
assert 0.10 < breach < 0.20, "A limit at 35 is breached in roughly one book in eight"`,
        solution: `import numpy as np
books = rng.binomial(500, 0.06, 10000)
expected = 500 * 0.06
p99 = np.percentile(books, 99)
breach = (books > 35).mean()
print(f"expected {expected:.0f}   99th pct {p99:.0f}   P(breach 35) {breach:.1%}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "`X ~ N(700, 60²)`. Roughly what share of values fall below 640?", choices: ["About 2.5%", "About 16%", "About 34%", "About 50%"], answer: 1, why: "640 is one σ below the mean. 68% lie within ±1σ, leaving 32% outside, half of it — 16% — below." },
      { id: "q2", q: "Why are incomes log-normal rather than normal?", choices: ["Because they are always positive", "Because they grow by percentages — a multiplicative process", "Because of tax brackets", "They are actually normal"], answer: 1, why: "Multiplicative growth produces log-normal distributions the way additive noise produces normal ones. Taking logs turns one into the other." },
      { id: "q3", q: "A 200-loan book has a 9% default rate. Expected defaults are 18. Seeing 25 in one quarter is…", choices: ["Proof credit quality deteriorated", "Impossible", "Within the range chance alone produces about one quarter in twenty", "Evidence the rate is really 12.5%"], answer: 2, why: "Binomial variation around the expectation is real and large. Distinguishing signal from this noise is what hypothesis testing is for." },
      { id: "q4", q: "Which distribution counts fraud alerts per hour?", choices: ["Normal", "Binomial", "Poisson", "Uniform"], answer: 2, why: "Independent arrivals in a fixed window — Poisson, with one parameter λ that is both the mean and the variance." },
    ],
  },
  {
    id: "s3-nist-rmf",
    session: 3, track: "ethics", minutes: 60,
    title: "NIST AI RMF in depth",
    summary: "Govern, Map, Measure, Manage — learned cold, because they are your organising device for every paper you will write.",
    video: {
      youtubeId: "rbFt34UmngY", title: "The NIST AI Risk Management Framework", channel: "Safeshield Training", minutes: 12,
      watchFor: [
        "The four functions and what activities sit under each.",
        "That the framework is voluntary — and why that does not make it optional in practice.",
        "The characteristics of trustworthy AI, and the word 'managed' next to bias.",
      ],
    },
    reading: {
      keyIdea: "Govern is not a gate you clear once. It runs continuously alongside Map, Measure and Manage — and every case you will study failed at a nameable function.",
      body: [
        "**GOVERN** — Who is accountable, and under what policy? Roles, escalation routes, a documented risk appetite, and a culture in which raising a concern is safe. In every case in the case bank where 'the algorithm decided' and nobody was answerable, the failure is here.",
        "**MAP** — What is the context, and what could go wrong? Intended use, who is affected, what a false positive costs *them*, which assumptions the target variable rests on. The healthcare-cost case (predicting cost as a proxy for need) failed entirely at Map: the model was accurate at the wrong objective.",
        "**MEASURE** — How do we know? Metrics, validation, and above all **disaggregated** testing: performance by subgroup, never a single headline accuracy. Gender Shades is an argument for this function in a single paper.",
        "**MANAGE** — What do we do about it? Prioritise, mitigate, monitor, and be willing to decommission. Continuous precision monitoring with a halt on degradation would have stopped both the Dutch benefits and Michigan MiDAS harms early.",
        "## Using it in a paper",
        "Walk a case through the four functions in order and say which one failed first. That single move — locating the failure at a function rather than declaring 'the AI was biased' — is what separates a doctoral analysis from an opinion. Then add the SR 11-7 mapping from Session 2, and you have an argument nobody else in the room can make.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "A bank cannot say who owns the correctness of an AI-generated analytics answer. Which function has failed?", choices: ["Govern", "Map", "Measure", "Manage"], answer: 0, why: "Undefined accountability is a Govern failure by definition." },
      { id: "q2", q: "A model predicts healthcare *cost* as a stand-in for health *need*, and cost was historically unequal. Where is the root failure?", choices: ["Govern", "Map", "Measure", "Manage"], answer: 1, why: "Map is where the objective and its proxies are interrogated. No model-side fix repairs a wrong target variable." },
      { id: "q3", q: "Reporting one overall accuracy figure while a subgroup fails badly is a failure of…", choices: ["Govern", "Map", "Measure", "Manage"], answer: 2, why: "Measure demands disaggregated testing. An aggregate metric is a weighted average dominated by the largest group." },
      { id: "q4", q: "The best description of the AI RMF's shape is…", choices: ["A four-step checklist completed before launch", "A cycle in which Govern runs continuously alongside the other three", "A legal compliance regime", "A model validation standard"], answer: 1, why: "Cyclical, not linear. Treating it as a pre-launch gate is the most common misreading." },
    ],
  },
];
