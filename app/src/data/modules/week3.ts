import type { Module } from "../modules";

const NP = `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
rng = np.random.default_rng(42)`;

export const WEEK3: Module[] = [
  /* ===================================================== Session 7 */
  {
    id: "s7-expectation-variance",
    session: 0, track: "stats", minutes: 50, setup: NP,
    title: "Expectation and variance",
    summary: "E[X] describes a portfolio, never an individual. Var(X) is the missing half of any honest summary. The four algebra rules, verified rather than asserted.",
    reading: {
      keyIdea: "`E[X]` is a weighted average — often a value you should never expect to see. A fair die has `E[X] = 3.5`. Expectation prices a portfolio; it says nothing about one loan.",
      body: [
        "`E[X] = Σ value × probability`. For a $200,000 loan with a 9% default probability, a 60% loss-given-default, and 5% interest if repaid: `E[profit] = 0.09 × (−120,000) + 0.91 × 10,000 = −1,700`. Neither outcome *is* the expected value; it is what you would average over many such loans — which is precisely why a single loan going bad tells you nothing about whether the pricing was right.",
        "## Variance is the missing half",
        "Two portfolios can have identical expected returns and completely different risk. `E[X]` alone is never a sufficient description; any report quoting an expected return without a spread is hiding the thing you need to decide.",
        "## Four rules you will see in lectures",
        "`E[aX + b] = a·E[X] + b`. `Var(aX + b) = a²·Var(X)` — the `b` **vanishes**: shifting every value by $7 moves the center but changes no spread. `Var(X) = E[X²] − (E[X])²`. And for *independent* `X`, `Y`: `Var(X + Y) = Var(X) + Var(Y)` — **variances add, standard deviations do not**, so σ of the sum is `√(σ₁² + σ₂²)`. That last rule is why diversification works: combine `n` independent risks and the standard deviation of the average falls like `σ/√n`.",
        "`Var(X − Y)` is *also* `Var(X) + Var(Y)` — plus, despite the minus. Spread has no direction; two sources of uncertainty always compound. This matters directly for hypothesis testing: a difference between two groups is noisier than either group alone.",
      ],
    },
    exercises: [
      {
        id: "ev", title: "Price a loan by expectation",
        prompt: "A $200,000 loan: 9% default probability, loss of 60% of principal on default, 5% interest if repaid. Compute `ev` = expected profit.",
        starter: `principal, p_default, lgd, rate = 200_000, 0.09, 0.60, 0.05
loss = -principal * lgd
gain = principal * rate
ev = ...
print(f"E[profit] = \${ev:,.0f}")
`,
        check: `assert abs(ev - (0.09*(-120_000) + 0.91*10_000)) < 1, "ev = p_default*loss + (1-p_default)*gain"`,
        solution: `principal, p_default, lgd, rate = 200_000, 0.09, 0.60, 0.05
loss = -principal * lgd
gain = principal * rate
ev = p_default * loss + (1 - p_default) * gain
print(f"E[profit] = \${ev:,.0f}")
`,
      },
      {
        id: "rules", title: "Verify the algebra by simulation",
        prompt: "Draw `X = rng.normal(10, 3, 200_000)` and independent `Y = rng.normal(-4, 5, 200_000)`. With `a, b = 4, 7`, confirm numerically that `Var(aX+b) ≈ a²·Var(X)` and `Var(X−Y) ≈ Var(X)+Var(Y)`. Store the simulated values in `var_lin` and `var_diff`.",
        starter: `X = rng.normal(10, 3, 200_000)
Y = rng.normal(-4, 5, 200_000)
a, b = 4, 7
var_lin = (a*X + b).var()
var_diff = ...
print(f"Var(aX+b) sim {var_lin:.2f}  formula {a**2 * X.var():.2f}")
print(f"Var(X-Y)  sim {var_diff:.2f}  formula {X.var() + Y.var():.2f}")
`,
        check: `assert abs(var_lin - 16*X.var()) < 0.5
assert abs(var_diff - (X.var() + Y.var())) < 1.0, "Var(X-Y) should be Var(X)+Var(Y) — variances add, even for a difference"`,
        solution: `X = rng.normal(10, 3, 200_000)
Y = rng.normal(-4, 5, 200_000)
a, b = 4, 7
var_lin = (a*X + b).var()
var_diff = (X - Y).var()
print(f"Var(aX+b) sim {var_lin:.2f}  formula {a**2 * X.var():.2f}")
print(f"Var(X-Y)  sim {var_diff:.2f}  formula {X.var() + Y.var():.2f}")
`,
      },
      {
        id: "diversify", title: "Diversification, demonstrated",
        prompt: "Each loan returns `rng.normal(50_000, 45_000)`. For portfolio sizes 1, 4, 25, 100, simulate 20,000 portfolios and record the standard deviation of the *average* return per loan in a dict `sd_by_n`. Compare with `45_000/√n`.",
        starter: `sd_by_n = {}
for n in (1, 4, 25, 100):
    loans = rng.normal(50_000, 45_000, (20_000, n))
    port = loans.mean(axis=1)
    sd_by_n[n] = port.std()
    print(f"n={n:>4}  σ of average = {sd_by_n[n]:>9,.0f}   theory {45_000/np.sqrt(n):>9,.0f}")
`,
        check: `for n in (1, 4, 25, 100):
    assert abs(sd_by_n[n] - 45_000/np.sqrt(n)) / (45_000/np.sqrt(n)) < 0.05, f"n={n}: should be close to 45000/sqrt(n)"`,
        solution: `sd_by_n = {}
for n in (1, 4, 25, 100):
    loans = rng.normal(50_000, 45_000, (20_000, n))
    port = loans.mean(axis=1)
    sd_by_n[n] = port.std()
    print(f"n={n:>4}  σ of average = {sd_by_n[n]:>9,.0f}   theory {45_000/np.sqrt(n):>9,.0f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "E[X] for a fair die is 3.5. What does that number mean?", choices: ["The most likely roll", "The long-run average of many rolls", "The median roll", "A rounding of 4"], answer: 1, why: "A weighted average. You will never roll it; it describes many rolls, not one." },
      { id: "q2", q: "`Var(X + 7)` compared with `Var(X)` is…", choices: ["Larger by 49", "Larger by 7", "The same", "Smaller"], answer: 2, why: "Adding a constant shifts every value equally; spread is unchanged." },
      { id: "q3", q: "X and Y are independent with σ = 3 and σ = 4. The standard deviation of X + Y is…", choices: ["7", "5", "12", "3.5"], answer: 1, why: "Variances add: 9 + 16 = 25, so σ = 5. Standard deviations do not add." },
      { id: "q4", q: "Why can an insurer with a $320 margin per policy and a $4,300 per-policy standard deviation survive?", choices: ["It cannot", "Volume: the standard deviation of the average falls as σ/√n, so with tens of thousands of policies the expectation becomes reliable", "It raises premiums", "Reinsurance only"], answer: 1, why: "Diversification is the √n rule. Per-policy variance dwarfs per-policy margin; only volume makes the expected value dependable." },
    ],
  },

  /* ===================================================== Session 8 */
  {
    id: "s8-normal",
    session: 0, track: "stats", minutes: 40, setup: NP,
    title: "The normal distribution, read aloud",
    summary: "X ~ N(µ, σ²) until it is automatic, the 68/95/99.7 ruler, and the standard error of the mean previewed by simulation.",
    video: {
      youtubeId: "XNgt7F6FqDU", title: "The standard error, Clearly Explained", channel: "StatQuest", minutes: 12,
      watchFor: [
        "The standard error is the standard deviation of *means* — a spread of estimates, not of individuals.",
        "It can be found by repeating the experiment, or by bootstrapping (which you will do in week 4).",
        "Every estimate has a standard error, not only the mean.",
      ],
    },
    reading: {
      keyIdea: "`X ~ N(µ, σ²)` reads 'X is distributed normal with mean µ and variance σ²'. Two numbers describe every bell curve; the 68/95/99.7 rule turns σ into a ruler.",
      body: [
        "Reading it aloud matters more than it sounds. A lecture that writes `~ N(0, 1)` means *drawn from a standard normal* — mean zero, standard deviation one. `µ` slides the curve; `σ` stretches it. About 68% of values lie within 1σ of the mean, 95% within 2σ (1.96, precisely), 99.7% within 3σ.",
        "## Why it is everywhere",
        "The normal arises whenever many small independent nudges add up — measurement error, heights, and, crucially, **averages**. The next session shows that the *mean of a sample* is normal even when the population it came from is not. That single fact is what makes inference possible.",
        "## Preview: the spread of an estimate",
        "Draw many samples of size `n` from any population and compute each sample's mean. The spread of those means is the **standard error**, `σ/√n` — the same `√n` from diversification. It shrinks with more data; the population's σ does not. Confusing the two is the most common error in applied statistics, and the next session is built around the distinction.",
      ],
    },
    exercises: [
      {
        id: "z", title: "How unusual is a value?",
        prompt: "Credit scores `~ N(700, 60²)`. Compute `z` for a score of 820 (`(x − µ) / σ`), then the share of applicants above 820 by simulating 500,000 scores into `share_above`.",
        starter: `mu, sigma = 700, 60
z = (820 - mu) / sigma
scores = rng.normal(mu, sigma, 500_000)
share_above = ...
print(f"z = {z:.2f}   share above 820 = {share_above:.2%}")
`,
        check: `assert abs(z - 2) < 1e-9, "z should be exactly 2 — two standard deviations above the mean"
assert abs(share_above - 0.0228) < 0.004, "About 2.3% lie above +2σ"`,
        solution: `mu, sigma = 700, 60
z = (820 - mu) / sigma
scores = rng.normal(mu, sigma, 500_000)
share_above = (scores > 820).mean()
print(f"z = {z:.2f}   share above 820 = {share_above:.2%}")
`,
      },
      {
        id: "se-preview", title: "Spread of individuals vs spread of means",
        prompt: "From `scores`, draw 3,000 samples of 25 and store their means in `means`. Compute `sd_individuals = scores.std()` and `sd_means = means.std()`. Check that `sd_means ≈ sd_individuals / √25`.",
        starter: `means = np.array([rng.choice(scores, 25).mean() for _ in range(3000)])
sd_individuals = scores.std()
sd_means = ...
print(f"σ of individuals {sd_individuals:.1f}   σ of sample means {sd_means:.1f}   σ/√25 = {sd_individuals/5:.1f}")
`,
        check: `assert abs(sd_means - sd_individuals/5) / (sd_individuals/5) < 0.08, "sd of means should be close to σ/√n = σ/5"`,
        solution: `means = np.array([rng.choice(scores, 25).mean() for _ in range(3000)])
sd_individuals = scores.std()
sd_means = means.std()
print(f"σ of individuals {sd_individuals:.1f}   σ of sample means {sd_means:.1f}   σ/√25 = {sd_individuals/5:.1f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "How is `X ~ N(3, 4)` read aloud?", choices: ["X equals 3 or 4", "X is normal with mean 3 and variance 4 (σ = 2)", "X is normal with mean 3 and standard deviation 4", "X is between 3 and 4"], answer: 1, why: "The second parameter is the variance. σ is its square root, 2." },
      { id: "q2", q: "A score is 2σ above the mean. Roughly what share of values exceed it?", choices: ["16%", "5%", "2.3%", "0.1%"], answer: 2, why: "95% lie within ±2σ, so 5% outside, half of it — 2.5% — above." },
      { id: "q3", q: "You quadruple the sample size. The standard error…", choices: ["Halves", "Quarters", "Doubles", "Is unchanged"], answer: 0, why: "SE = σ/√n. Four times the data, twice the precision." },
      { id: "q4", q: "You collect much more data. The standard *deviation* of the population…", choices: ["Shrinks", "Grows", "Is unchanged — the world is as variable as it was", "Becomes zero"], answer: 2, why: "More data sharpens your estimate; it does not make individuals more alike." },
    ],
  },
  {
    id: "s8-transparency",
    session: 8, track: "ethics", minutes: 45,
    title: "Transparency, explainability, and their limits",
    summary: "Model cards, datasheets, and what SHAP can and cannot tell you. The Apple Card case: a lawful model nobody could explain.",
    video: {
      youtubeId: "XTiXa2DXfmw", title: "What is SHAP (explainable AI)?", channel: "AASPI", minutes: 6,
      watchFor: [
        "SHAP attributes a *single prediction* across the input features.",
        "It is a local approximation — it describes the model's behaviour, not the world's causes.",
        "Ask yourself: would this explanation satisfy a customer's adverse-action notice?",
      ],
    },
    reading: {
      keyIdea: "Transparency is disclosure that a system exists and what it does. Explainability is why it produced a specific output. Both are required; neither is the same as fairness — and 'the algorithm decided' satisfies neither.",
      body: [
        "**Model cards** (Mitchell et al., 2019): a short standardised document — intended use, performance **disaggregated by group**, limitations. **Datasheets for datasets** (Gebru et al., 2021): the dataset counterpart — how it was collected, who is in it, known gaps. Both are cheap and both are exactly what the Measure function asks for.",
        "## What SHAP and LIME actually give you",
        "Local approximations of a model near one prediction. They tell you which features moved *this* output, not what causes the outcome in the world. They are routinely over-read as causal. Useful for debugging; insufficient alone for a regulated explanation.",
        "## Apple Card",
        "In 2019 a customer received a credit limit roughly twenty times his wife's despite her higher score. New York's regulator investigated and **found no unlawful discrimination** — but was sharply critical that nobody could explain the decisions, and front-line staff could only say the algorithm decided. The lesson is not about bias. It is that a model may be lawful and statistically sound and still fail, because **ECOA / Regulation B** has required specific reasons in an adverse-action notice since 1974, and 'algorithmic decision' does not satisfy it. An established compliance discipline was not carried across into a new product line.",
        "## The banking translation",
        "Reason codes generated *at decision time* and stored with the decision, not reconstructed afterwards; a human review path with real authority; staff equipped with the codes. Every consumer lender already knows how to do this. The interesting question in a paper is why a new entrant shipped without it.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "What did New York's regulator conclude about the Apple Card?", choices: ["Unlawful gender discrimination", "No unlawful discrimination found, but transparency was inadequate", "The model was inaccurate", "Nothing; the case was dropped"], answer: 1, why: "The finding was about explainability and accountability, not bias — a useful corrective to assuming every AI ethics problem is a bias problem." },
      { id: "q2", q: "A SHAP plot shows income was the biggest contributor to a denial. This tells you…", choices: ["Low income caused the denial in the real world", "Which feature moved this particular model output", "The model is fair", "The model is unfair"], answer: 1, why: "A local attribution over the model's behaviour. It is not a causal claim about the world." },
      { id: "q3", q: "A model card should report performance…", choices: ["As one overall accuracy", "Disaggregated by group", "Only on the training set", "Only when required by law"], answer: 1, why: "Aggregate metrics hide subgroup failures. Disaggregation is the point of the document." },
      { id: "q4", q: "Under ECOA/Reg B, an adverse-action notice must give…", choices: ["The model's accuracy", "Specific principal reasons for the decision", "The applicant's score only", "A link to the model card"], answer: 1, why: "Specific reasons, since 1974. 'The algorithm decided' does not comply." },
    ],
  },

  /* ===================================================== Session 9 */
  {
    id: "s9-clt",
    session: 5, track: "stats", minutes: 75, setup: NP,
    title: "The Central Limit Theorem — the centerpiece",
    summary: "Watch sample means turn normal from a violently skewed population, then separate σ from the standard error. Everything in inference is a consequence of what happens here.",
    video: {
      youtubeId: "YAlJCEDH2uY", title: "The Central Limit Theorem, Clearly Explained", channel: "StatQuest", minutes: 8,
      watchFor: [
        "Means of samples from a *uniform* distribution are normal. So are means from an *exponential* one.",
        "The population's shape stops mattering as n grows. That is the whole theorem.",
        "Follow with 'Standard Deviation vs Standard Error' if the distinction is not yet solid.",
      ],
    },
    reading: {
      keyIdea: "For a large enough sample, the distribution of the sample mean is approximately normal — regardless of the shape of the population. You almost never know your population's shape, and the CLT says you do not need to.",
      body: [
        "You have one sample. You want the population. You will never see the population. So: **how wrong is my sample likely to be?** Answer that, and every estimate can carry an honest margin of error.",
        "The trick is to do the impossible experiment once, where we *can* see the population: draw 5,000 samples of 100 from a violently skewed distribution and look at the 5,000 sample means. They form a symmetric bell centred on the true mean — from a population with skew above 3. That is the CLT, and it is the most useful theorem in applied statistics.",
        "## σ versus SE — read twice",
        "**σ** describes how much *individuals* differ. More data never shrinks it; the world is as variable as it is. **SE = σ/√n** describes how much *your estimate of the mean* would differ across samples. More data shrinks it — like `1/√n`, which is a harsh master: to halve your standard error you must quadruple your sample. 64× the data buys an 8× improvement, which is why 'just collect more data' stops being good advice early and design matters more than volume.",
        "## Where '95%' comes from",
        "Because sample means are normal, about 95% of them land within 1.96 SE of the truth. Turn that around: `x̄ ± 1.96 × SE` is a confidence interval. What '95% confident' means: the **procedure** captures the truth in 95% of repetitions. It is a property of the method, not a probability about the one interval you computed.",
        "## Where the CLT stops",
        "It is about sums and averages. It does **not** apply to maxima, minima or extreme quantiles — those have their own theory — which is why tail-risk and stress-testing work cannot borrow ordinary confidence intervals.",
      ],
    },
    exercises: [
      {
        id: "sampling-dist", title: "Build the sampling distribution",
        prompt: "Create a skewed population `pop = rng.lognormal(8.2, 0.9, 500_000)`. Draw 5,000 samples of 100 and store their means in `means`. Print the population skew and the skew of `means` (use `pd.Series(...).skew()`), and plot a histogram of `means` with a vertical line at `pop.mean()`.",
        starter: `pop = rng.lognormal(8.2, 0.9, 500_000)
means = np.array([rng.choice(pop, 100).mean() for _ in range(5000)])
print(f"population skew {pd.Series(pop).skew():.2f}   skew of sample means {pd.Series(means).skew():.2f}")
plt.hist(means, bins=60); plt.axvline(pop.mean(), color="k", ls="--"); plt.title("5,000 sample means (n=100)")
plt.show()
`,
        check: `assert len(means) == 5000
assert abs(pd.Series(means).skew()) < 0.6, "Sample means should be nearly symmetric even though the population is not"
assert abs(means.mean() - pop.mean()) / pop.mean() < 0.02, "The means should be centred on the true mean"`,
        solution: `pop = rng.lognormal(8.2, 0.9, 500_000)
means = np.array([rng.choice(pop, 100).mean() for _ in range(5000)])
print(f"population skew {pd.Series(pop).skew():.2f}   skew of sample means {pd.Series(means).skew():.2f}")
plt.hist(means, bins=60); plt.axvline(pop.mean(), color="k", ls="--"); plt.title("5,000 sample means (n=100)")
plt.show()
`,
      },
      {
        id: "se", title: "σ/√n, checked",
        prompt: "For n in 10, 30, 100, 400, draw 2,000 samples from `pop`, compute the standard deviation of their means, and store it in `se_obs[n]`. Compare with `pop.std()/√n`.",
        starter: `se_obs = {}
for n in (10, 30, 100, 400):
    m = np.array([rng.choice(pop, n).mean() for _ in range(2000)])
    se_obs[n] = m.std()
    print(f"n={n:>4}  observed {se_obs[n]:>9,.1f}   σ/√n {pop.std()/np.sqrt(n):>9,.1f}")
`,
        check: `for n in (10, 30, 100, 400):
    theory = pop.std()/np.sqrt(n)
    assert abs(se_obs[n] - theory)/theory < 0.12, f"n={n}: observed SE should track σ/√n"`,
        solution: `se_obs = {}
for n in (10, 30, 100, 400):
    m = np.array([rng.choice(pop, n).mean() for _ in range(2000)])
    se_obs[n] = m.std()
    print(f"n={n:>4}  observed {se_obs[n]:>9,.1f}   σ/√n {pop.std()/np.sqrt(n):>9,.1f}")
`,
      },
      {
        id: "coverage", title: "What 95% actually means",
        prompt: "Build 1,000 confidence intervals, each from a single sample of 100 using the sample's own standard deviation (`s.std(ddof=1)/√100`) and ±1.96. Count how many contain `pop.mean()` and store the share in `coverage`.",
        starter: `hits = 0
for _ in range(1000):
    s = rng.choice(pop, 100)
    se = s.std(ddof=1) / np.sqrt(100)
    lo, hi = s.mean() - 1.96*se, s.mean() + 1.96*se
    hits += (lo <= pop.mean() <= hi)
coverage = hits / 1000
print(f"coverage: {coverage:.1%}")
`,
        check: `assert 0.90 <= coverage <= 0.98, "About 95% of intervals built this way should contain the true mean"`,
        solution: `hits = 0
for _ in range(1000):
    s = rng.choice(pop, 100)
    se = s.std(ddof=1) / np.sqrt(100)
    lo, hi = s.mean() - 1.96*se, s.mean() + 1.96*se
    hits += (lo <= pop.mean() <= hi)
coverage = hits / 1000
print(f"coverage: {coverage:.1%}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "The population is heavily right-skewed. The distribution of sample means (n = 100) is…", choices: ["Also right-skewed", "Approximately normal", "Uniform", "Impossible to know"], answer: 1, why: "That is the Central Limit Theorem. The population's shape stops mattering for averages." },
      { id: "q2", q: "You want to halve your standard error. You need…", choices: ["Twice the data", "Four times the data", "Half the data", "A different population"], answer: 1, why: "SE = σ/√n. Halving it means quadrupling n." },
      { id: "q3", q: "A report says 'with more data the customers became more homogeneous'. The likely truth is…", choices: ["Correct", "The estimate got sharper (SE fell); the population's σ did not change", "The data was cleaned", "Sampling error"], answer: 1, why: "Confusing σ with SE — the most common error in applied statistics." },
      { id: "q4", q: "'95% confidence interval' means…", choices: ["There is a 95% chance the true mean is in this interval", "The procedure captures the true mean in 95% of repetitions", "95% of the data lies in the interval", "The estimate is 95% accurate"], answer: 1, why: "A property of the method across repetitions. Any one interval either contains µ or it does not." },
      { id: "q5", q: "Which statistic does the CLT *not* cover?", choices: ["The mean", "The sum", "The maximum", "The average of averages"], answer: 2, why: "Extremes follow extreme-value theory. Tail-risk work cannot borrow ordinary confidence intervals." },
    ],
  },
  {
    id: "s9-sr117",
    session: 9, track: "ethics", minutes: 50,
    title: "SR 11-7 mapped onto the AI RMF — your differentiator",
    summary: "Banking has operated examined, independently validated model governance since 2011. Build the mapping table in your own words; it is the foundation of your strongest term-paper thesis.",
    reading: {
      keyIdea: "AI governance is an extension of model risk management, not a new discipline. What AI adds is scale, opacity and non-stationary data — not the basic need for an inventory, an owner, and an independent challenger.",
      body: [
        "**SR 11-7** (Federal Reserve / OCC, 2011) requires, for every model a bank relies on: development with documented assumptions and data lineage; **independent validation** by people who did not build it — the 'effective challenge' function; ongoing monitoring with defined thresholds and escalation; and governance — an inventory, named ownership, board-level reporting, a documented risk appetite.",
        "## The mapping",
        "Model inventory, ownership, board reporting → **GOVERN**. Documented purpose, assumptions, limitations → **MAP**. Independent validation and effective challenge → **MEASURE**. Ongoing monitoring, thresholds, escalation → **MANAGE**. Documented risk appetite → **GOVERN**. Write this table yourself, in your own words, and keep it — you will use it in every paper.",
        "## The argument this unlocks",
        "The AI governance conversation frequently proceeds as though accountability for algorithmic decisions were a novel problem. It is not new; it is newly *general*. COMPAS becomes a procurement failure: a proprietary, unvalidatable model informing a *liberty* decision would be unthinkable under a model-risk regime far less consequential than criminal justice. The Dutch benefits and Michigan cases become 'alert treated as finding' — a structure AML operations solved years ago with an adjudication layer between signal and consequence.",
        "## Where the frameworks are genuinely weak",
        "Both the EU AI Act and NIST lean heavily on **human oversight**. But automation bias means reviewers scrutinise fluent output less carefully as it improves — the control degrades precisely when it is most relied upon. Measuring reviewer override rates as a leading indicator (a rate near zero means rubber-stamping) is a concrete, original contribution. Critiquing a framework rather than merely applying it is the move that distinguishes doctoral work.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "'Effective challenge' under SR 11-7 maps to which AI RMF function?", choices: ["Govern", "Map", "Measure", "Manage"], answer: 2, why: "Independent validation is how you know. That is Measure." },
      { id: "q2", q: "What does AI genuinely add to the model-risk problem?", choices: ["The need for ownership", "The need for validation", "Scale, opacity and non-stationary data", "Nothing at all"], answer: 2, why: "The basic needs are old; what is new is how many models, how hard they are to inspect, and how fast their data drifts." },
      { id: "q3", q: "Reframed through SR 11-7, the core failure in COMPAS was…", choices: ["Inaccurate mathematics", "Procurement and governance: an unvalidatable model in a liberty decision", "Too few features", "The wrong programming language"], answer: 1, why: "No effective challenge, no independent validation, proprietary internals — weaker governance than mortgage pricing receives." },
      { id: "q4", q: "Why is 'human oversight' a weaker control than the frameworks assume?", choices: ["Humans are biased", "Automation bias: reviewers scrutinise fluent output less as it improves", "It is too expensive", "It is illegal in the EU"], answer: 1, why: "The control degrades exactly as the technology improves. Measure override rates, or the oversight is nominal." },
    ],
  },
];
