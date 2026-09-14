import type { Module } from "../modules";

const NP = `import numpy as np, pandas as pd
import matplotlib.pyplot as plt
rng = np.random.default_rng(42)`;

export const WEEK2: Module[] = [
  /* ===================================================== Session 4 */
  {
    id: "s4-randomness",
    session: 0, track: "stats", minutes: 40, setup: NP,
    title: "Probability as long-run frequency",
    summary: "Probability defined so you can compute it: the fraction of times something happens if you repeat the setup forever. Simulate it, and see why the coin has no memory.",
    reading: {
      keyIdea: "The probability of an event is the fraction of times it happens over many repetitions. You cannot repeat forever, but you can simulate 100,000 times instantly — so every claim here is checkable.",
      body: [
        "Flip a fair coin 20,000 times and track the running proportion of heads. Early on it swings wildly; by the end it is pinned near 0.5. **The crucial subtlety:** nothing corrects it. If you are ten heads ahead after 100 flips, you stay roughly ten ahead — it just matters less and less as a *fraction* of a growing total. The proportion converges because later flips **dilute** early deviations, not because the coin compensates.",
        "Believing otherwise is the gambler's fallacy, and it is the same error as expecting a loan book to 'even out' after a bad quarter.",
        "## Vectorised thinking",
        "The numpy habit to build now: describe the operation on the **whole array** rather than looping over elements. `np.sum(a * a)` squares every element and adds them up — one line, hundreds of times faster than a Python loop, and it reads better. A boolean array's `.mean()` is the proportion that is `True`, which makes it a probability: `(rolls % 2 == 0).mean()` ≈ 0.5.",
        "## The rules, by simulation",
        "For two events `A` and `B` on a die: `P(A or B) = P(A) + P(B) − P(A and B)`. Why subtract the overlap? Adding `P(A)` and `P(B)` counts an outcome that is in both twice. The formula is bookkeeping, not insight — and you will verify it rather than accept it.",
      ],
    },
    exercises: [
      {
        id: "coin", title: "Watch the proportion settle",
        prompt: "Simulate 20,000 fair coin flips with `rng.integers(0, 2, 20000)` (1 = heads). Compute the running proportion of heads into `running` using `np.cumsum` divided by `np.arange(1, 20001)`. Print the proportion after 10, 100, 1,000 and 20,000 flips, and plot `running` on a log x-axis.",
        starter: `flips = rng.integers(0, 2, 20000)
running = np.cumsum(flips) / np.arange(1, 20001)
for n in (10, 100, 1000, 20000):
    print(n, round(running[n-1], 4))

plt.plot(running, lw=.8); plt.axhline(0.5, color="k", ls="--")
plt.xscale("log"); plt.ylim(0, 1); plt.xlabel("flips"); plt.ylabel("proportion heads")
plt.show()
`,
        check: `assert len(running) == 20000, "running should have one value per flip"
assert abs(running[-1] - 0.5) < 0.02, "After 20,000 flips the proportion should be within 0.02 of 0.5"
assert abs(running[9] - 0.5) > abs(running[-1] - 0.5) - 1e-9 or True`,
        solution: `flips = rng.integers(0, 2, 20000)
running = np.cumsum(flips) / np.arange(1, 20001)
for n in (10, 100, 1000, 20000):
    print(n, round(running[n-1], 4))

plt.plot(running, lw=.8); plt.axhline(0.5, color="k", ls="--")
plt.xscale("log"); plt.ylim(0, 1); plt.xlabel("flips"); plt.ylabel("proportion heads")
plt.show()
`,
      },
      {
        id: "addition-rule", title: "Verify the addition rule",
        prompt: "Roll a die 200,000 times with `rng.integers(1, 7, 200_000)`. Let `A` be 'even' and `B` be '5 or more' (boolean arrays). Compute `p_a`, `p_b`, `p_both` (A and B), and `p_either` (A or B). Confirm `p_either` equals `p_a + p_b - p_both`.",
        starter: `rolls = rng.integers(1, 7, 200_000)
A = (rolls % 2 == 0)
B = (rolls >= 5)
p_a = A.mean()
p_b = B.mean()
p_both = ...
p_either = ...
print(f"P(A)={p_a:.4f}  P(B)={p_b:.4f}  P(A and B)={p_both:.4f}  P(A or B)={p_either:.4f}")
print("addition rule:", round(p_a + p_b - p_both, 4))
`,
        check: `assert abs(p_both - 1/6) < 0.01, "P(A and B) should be about 1/6 — only a 6 is both even and ≥5"
assert abs(p_either - 4/6) < 0.01, "P(A or B) should be about 4/6 — the outcomes 2,4,5,6"
assert abs(p_either - (p_a + p_b - p_both)) < 1e-9, "P(A or B) must equal P(A)+P(B)-P(A and B)"`,
        solution: `rolls = rng.integers(1, 7, 200_000)
A = (rolls % 2 == 0)
B = (rolls >= 5)
p_a = A.mean()
p_b = B.mean()
p_both = (A & B).mean()
p_either = (A | B).mean()
print(f"P(A)={p_a:.4f}  P(B)={p_b:.4f}  P(A and B)={p_both:.4f}  P(A or B)={p_either:.4f}")
print("addition rule:", round(p_a + p_b - p_both, 4))
`,
        hint: "Combine boolean arrays with `&` (and) and `|` (or), then `.mean()`.",
      },
    ],
    quiz: [
      { id: "q1", q: "After 100 flips you are 10 heads ahead. After 10,000 more flips, what is the most likely situation?", choices: ["Tails has caught up so the counts are equal", "You are still roughly 10 heads ahead, but the proportion is near 0.5", "You are 100 heads ahead", "The coin is biased"], answer: 1, why: "The coin has no memory. The proportion converges because later flips dilute the early gap, not because anything corrects it." },
      { id: "q2", q: "What does `(rolls % 2 == 0).mean()` compute?", choices: ["The average roll", "The number of even rolls", "The proportion of rolls that are even — a probability", "An error"], answer: 2, why: "A boolean array's mean is the share of True values. That is exactly the long-run-frequency definition of probability." },
      { id: "q3", q: "Why does `P(A or B)` subtract `P(A and B)`?", choices: ["To keep the result below 1", "Because outcomes in both events were counted twice", "Tradition", "It doesn't; you add it"], answer: 1, why: "A 6 is both even and ≥5. Adding P(A) and P(B) counts it twice; subtracting the overlap removes the double count." },
      { id: "q4", q: "A loan book had a bad quarter. The 'law of averages' says the next quarter will be better. Is that right?", choices: ["Yes — variation evens out", "No — nothing compensates; the long-run rate is approached by dilution, and each quarter's risk is what it is", "Only if the book is large", "Only for small books"], answer: 1, why: "Same as the coin. Expecting compensation is the gambler's fallacy in a suit." },
    ],
  },

  /* ===================================================== Session 5 */
  {
    id: "s5-conditioning",
    session: 0, track: "stats", minutes: 45, setup: NP,
    title: "Conditioning is filtering",
    summary: "P(A | B) is not a mysterious symbol. It is 'compute A only among the rows where B is true'. Once that is solid, Bayes is bookkeeping.",
    video: {
      youtubeId: "_IgyaD7vOOA", title: "Conditional Probabilities, Clearly Explained", channel: "StatQuest", minutes: 8,
      watchFor: [
        "'Given' means restrict the population before you count.",
        "How `P(A|B)` and `P(B|A)` use different denominators — that is why they are different numbers.",
        "Independence: knowing B changes nothing about A.",
      ],
    },
    reading: {
      keyIdea: "`P(A | B)` reads 'the probability of A given B': restrict attention to the world where B happened, then ask how often A happens there. In code, 'given B' is a filter.",
      body: [
        "In numpy, `A[B].mean()` is 'the values of A at the positions where B is true, averaged'. That *is* conditioning. The pipe symbol means *restrict the population to*.",
        "## Independence",
        "`A` and `B` are independent if knowing one tells you nothing about the other: `P(A | B) = P(A)`. It is a numerical property of the setup, not something you can eyeball from descriptions — on a die, 'even' and '≥5' happen to be independent (of {5, 6} exactly one is even, the same one-in-two as the whole die), while 'even' and '≥4' are not (of {4, 5, 6} two are even).",
        "## The pipe is where money is lost",
        "`P(fraud | alert)` and `P(alert | fraud)` are wildly different numbers. The second is how much fraud your model catches; the first is how many of its alerts are real. Swapping them is the base-rate fallacy — the most expensive error in commercial statistics, and the whole of the next module.",
      ],
    },
    exercises: [
      {
        id: "filter", title: "Conditioning as a filter",
        prompt: "Roll two dice 100,000 times (`d1`, `d2`). Let `total = d1 + d2`. Compute `p7` = P(total is 7), and `p7_given4` = P(total is 7 | d1 is 4). Are they equal? Then compute `p10` = P(total ≥ 10) and `p10_given5` = P(total ≥ 10 | d1 ≥ 5).",
        starter: `d1 = rng.integers(1, 7, 100_000)
d2 = rng.integers(1, 7, 100_000)
total = d1 + d2

p7 = (total == 7).mean()
p7_given4 = (total[d1 == 4] == 7).mean()
p10 = ...
p10_given5 = ...
print(f"P(7)={p7:.3f}  P(7|d1=4)={p7_given4:.3f}   P(≥10)={p10:.3f}  P(≥10|d1≥5)={p10_given5:.3f}")
`,
        check: `assert abs(p7 - 1/6) < 0.01 and abs(p7_given4 - 1/6) < 0.02, "P(7) and P(7|d1=4) are both about 1/6 — independent"
assert abs(p10 - 6/36) < 0.01, "P(total>=10) should be about 6/36"
assert p10_given5 > 0.4, "Given d1>=5, reaching 10 is far more likely — dependent"`,
        solution: `d1 = rng.integers(1, 7, 100_000)
d2 = rng.integers(1, 7, 100_000)
total = d1 + d2

p7 = (total == 7).mean()
p7_given4 = (total[d1 == 4] == 7).mean()
p10 = (total >= 10).mean()
p10_given5 = (total[d1 >= 5] >= 10).mean()
print(f"P(7)={p7:.3f}  P(7|d1=4)={p7_given4:.3f}   P(≥10)={p10:.3f}  P(≥10|d1≥5)={p10_given5:.3f}")
`,
        hint: "`total[d1 >= 5]` keeps only the rolls where the first die is 5 or 6.",
      },
      {
        id: "lending-cond", title: "Conditioning on real data",
        prompt: "Load `data/lending.csv`. Compute the overall default rate `p_default`, and the default rate given `dti_ratio > 0.5` as `p_default_highdti`. Print both.",
        starter: `lending = pd.read_csv("data/lending.csv")
p_default = lending["defaulted"].mean()
p_default_highdti = ...
print(f"P(default) = {p_default:.3f}    P(default | DTI > 0.5) = {p_default_highdti:.3f}")
`,
        check: `assert abs(p_default - lending["defaulted"].mean()) < 1e-9
expected = lending.loc[lending["dti_ratio"] > 0.5, "defaulted"].mean()
assert abs(p_default_highdti - expected) < 1e-9, "Filter rows with dti_ratio > 0.5, then take the mean of defaulted"
assert p_default_highdti > p_default * 2, "High-DTI borrowers should default far more often"`,
        solution: `lending = pd.read_csv("data/lending.csv")
p_default = lending["defaulted"].mean()
p_default_highdti = lending.loc[lending["dti_ratio"] > 0.5, "defaulted"].mean()
print(f"P(default) = {p_default:.3f}    P(default | DTI > 0.5) = {p_default_highdti:.3f}")
`,
      },
    ],
    quiz: [
      { id: "q1", q: "In code, what does 'given B' correspond to?", choices: ["Multiplying by P(B)", "Filtering to the rows where B is true, then computing", "Sorting by B", "Dividing by n"], answer: 1, why: "`A[B].mean()`. Conditioning is a filter — that one sentence carries you through every use of the pipe." },
      { id: "q2", q: "Which pair of numbers is a bank most likely to confuse, at great cost?", choices: ["P(A) and P(B)", "P(fraud | alert) and P(alert | fraud)", "Mean and median", "Variance and standard deviation"], answer: 1, why: "Recall versus precision. Same model, different denominators, tenfold different values when the event is rare." },
      { id: "q3", q: "P(A) = 0.5 and P(A | B) = 0.5. The events are…", choices: ["Dependent", "Independent", "Mutually exclusive", "Impossible"], answer: 1, why: "Knowing B changed nothing about A — that is the definition of independence." },
      { id: "q4", q: "P(total ≥ 10 | first die ≥ 5) is much higher than P(total ≥ 10). Why?", choices: ["The dice are loaded", "You cannot reach 10 without a large first die, so learning it is large is informative", "It is a coincidence", "Conditioning always raises probabilities"], answer: 1, why: "Conditioning can raise or lower a probability; here the condition removes most of the ways to fail." },
    ],
  },
  {
    id: "s5-bias-taxonomy",
    session: 5, track: "ethics", minutes: 45,
    title: "Five kinds of bias — name the source",
    summary: "'The AI was biased' is an opinion. 'The training labels encoded a historically unequal process' is an analysis. Learn the five sources and the cases that illustrate each.",
    video: {
      youtubeId: "UG_X_7g63rY", title: "How I'm fighting bias in algorithms", channel: "TED · Joy Buolamwini", minutes: 9,
      watchFor: [
        "The software failing to detect her face until she wore a white mask — which *kind* of bias is that?",
        "'The coded gaze': whose priorities are embedded in the training data.",
        "Her call for accountability, not just better models — map it to the Govern function.",
      ],
    },
    reading: {
      keyIdea: "Naming the source of a bias — historical, representation, measurement, aggregation, or deployment — is what turns a complaint into a doctoral analysis, because each source has a different remedy.",
      body: [
        "**Historical bias.** The world the data recorded was already unequal, so a *perfectly accurate* model reproduces the inequality — with the appearance of objectivity. Amazon's résumé screener learned a decade of male-dominated hiring. **Removing the protected attribute does not fix it**, because proxies carry the signal. Remedy: interrogate the target and the label, not just the features.",
        "**Representation bias.** Some groups are under-represented in the training data, so the model is simply worse for them. Gender Shades: error rates from under 1% for lighter-skinned men to ~35% for darker-skinned women. Remedy: disaggregated evaluation and deliberate data collection.",
        "**Measurement bias.** The proxy you measure is not the thing you care about, and the gap differs by group. The healthcare algorithm predicted *cost* as a stand-in for *need*, and less had historically been spent on Black patients at equal illness. Remedy: no model-side fix exists — change the target.",
        "**Aggregation bias.** One model for populations that behave differently, so it fits neither well. Remedy: check whether the relationship differs by group before pooling.",
        "**Deployment bias.** A system used differently from how it was designed and validated — a probabilistic 'lead' treated as an identification, a risk flag treated as a finding. Remedy: this is a Govern and Manage problem, not a modelling one.",
        "## The banking translation",
        "ZIP code is to race what 'women's chess club' was to gender. Fair lending law has decades of doctrine on facially neutral variables producing **disparate impact** — more developed than anything in the AI-fairness literature. Bringing that doctrine to bear is an original move available to you.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "A hiring model trained on ten years of past hires downgrades résumés mentioning 'women's'. The source of bias is…", choices: ["Representation", "Historical", "Measurement", "Deployment"], answer: 1, why: "The labels — who was hired — encoded an unequal past. The model learned it faithfully." },
      { id: "q2", q: "Removing gender from that model's inputs will…", choices: ["Fix the bias", "Not fix it, because proxies carry the same signal", "Make it illegal", "Improve accuracy"], answer: 1, why: "Sport, phrasing, institution and more all correlate with gender. 'We don't use the attribute' is not a fairness argument." },
      { id: "q3", q: "A health-risk model predicts cost as a proxy for need, and spending was historically lower for one group at equal illness. The source is…", choices: ["Aggregation", "Deployment", "Measurement", "Representation"], answer: 2, why: "The proxy diverges from the objective by group. No reweighting fixes a wrong target variable." },
      { id: "q4", q: "A facial-recognition 'lead' is treated as probable cause for arrest. The source is…", choices: ["Deployment", "Historical", "Aggregation", "Measurement"], answer: 0, why: "The system was used for a decision it was never validated for. That is a governance failure, not a modelling one." },
      { id: "q5", q: "Which legal doctrine most directly addresses proxy variables in lending?", choices: ["Disparate treatment", "Disparate impact", "Differential privacy", "Model risk management"], answer: 1, why: "A facially neutral rule producing substantially worse outcomes for a protected group — decades of ECOA/fair-lending doctrine." },
    ],
  },

  /* ===================================================== Session 6 */
  {
    id: "s6-bayes",
    session: 4, track: "stats", minutes: 60, setup: NP,
    title: "Bayes by counting — the base-rate trap",
    summary: "A 96%-recall fraud model whose alerts are 91% false alarms. Nothing is broken. This is the most consequential idea in the course, and you will get it by counting, not by formula.",
    video: {
      youtubeId: "9wCnvr7Xw4E", title: "Bayes' Theorem, Clearly Explained", channel: "StatQuest", minutes: 16,
      watchFor: [
        "The theorem is derived from counting — nothing is assumed.",
        "Which term is the *prior* (base rate). That is the term intuition drops.",
        "Optional deeper cut afterwards: 3Blue1Brown's 'Bayes theorem, the geometry of changing beliefs'.",
      ],
    },
    reading: {
      keyIdea: "Precision is a property of the base rate as much as of the model. A model can be exactly as good as advertised and still have most of its alerts be wrong — because the false positives come from a pool hundreds of times larger than the true positives.",
      body: [
        "The setup: a fraud model with **96% recall** (catches 96% of fraud) and **97% specificity** (clears 97% of legitimate transactions), on a **0.3% base rate**. It alerts. Before computing anything, most people guess the transaction is 80–95% likely to be fraud.",
        "Count. In 50,000 transactions, ~155 are fraud; the model catches ~150. The other ~49,845 are legitimate; the model wrongly flags 3% of them — about **1,500 false alarms**. 150 real against 1,500 false: **P(fraud | alert) ≈ 9%**.",
        "## The two you must never swap",
        "`P(alert | fraud)` = 96.8% is **recall** — of real fraud, how much we catch. `P(fraud | alert)` = 9.1% is **precision** — of our alerts, how many are real. Same model, same data, a factor of ten apart; the only difference is which side of the pipe each event sits on.",
        "## Bayes, now that you already know the answer",
        "`P(A|B) = P(B|A) · P(A) / P(B)`. Read as a sentence: take how often fraud triggers an alert, weight it by **how common fraud is**, divide by how often alerts happen at all. The `P(A)` in the numerator is the base rate — the term intuition silently drops. The formula is a shortcut for the counting, not a separate idea.",
        "## Why this matters in PhDAI 832",
        "'High accuracy' is not a defence: if an alert freezes an account, a 9%-precision model harms ten innocent people for every guilty one. And base rates differ across groups — so *identical* model performance yields *different* precision per group, automatically. That arithmetic is the engine of the fairness impossibility result you will meet this session. The COMPAS debate is precisely this argument: ProPublica measured error rates by race, Northpointe measured calibration by race, both were right, and both could not be equalised because base rates differed.",
      ],
    },
    exercises: [
      {
        id: "count", title: "Precision by counting",
        prompt: "Load `data/fraud_alerts.csv`. Among rows where `model_alert == 1`, compute the share that are really fraud as `precision`. Also compute `recall` = share of real fraud that was alerted. Print both.",
        starter: `fraud = pd.read_csv("data/fraud_alerts.csv")
alerted = fraud[fraud["model_alert"] == 1]
precision = (alerted["is_fraud"] == 1).mean()
real = fraud[fraud["is_fraud"] == 1]
recall = ...
print(f"precision P(fraud|alert) = {precision:.1%}")
print(f"recall    P(alert|fraud) = {recall:.1%}")
`,
        check: `assert abs(precision - 0.0907) < 0.01, f"precision should be about 9%, got {precision:.3f}"
assert abs(recall - 0.968) < 0.02, f"recall should be about 97%, got {recall:.3f}"`,
        solution: `fraud = pd.read_csv("data/fraud_alerts.csv")
alerted = fraud[fraud["model_alert"] == 1]
precision = (alerted["is_fraud"] == 1).mean()
real = fraud[fraud["is_fraud"] == 1]
recall = (real["model_alert"] == 1).mean()
print(f"precision P(fraud|alert) = {precision:.1%}")
print(f"recall    P(alert|fraud) = {recall:.1%}")
`,
      },
      {
        id: "bayes", title: "Bayes reproduces the count",
        prompt: "Compute `p_fraud` (base rate), `p_alert_given_fraud` (recall) and `p_alert` (overall alert rate) from the data, then `bayes = p_alert_given_fraud * p_fraud / p_alert`. It should equal `precision` from above.",
        starter: `p_fraud = fraud["is_fraud"].mean()
p_alert_given_fraud = recall
p_alert = ...
bayes = ...
print(f"Bayes {bayes:.4f}   counting {precision:.4f}")
`,
        check: `assert abs(p_alert - fraud["model_alert"].mean()) < 1e-9
assert abs(bayes - precision) < 1e-6, "Bayes must reproduce the counted precision exactly"`,
        solution: `p_fraud = fraud["is_fraud"].mean()
p_alert_given_fraud = recall
p_alert = fraud["model_alert"].mean()
bayes = p_alert_given_fraud * p_fraud / p_alert
print(f"Bayes {bayes:.4f}   counting {precision:.4f}")
`,
      },
      {
        id: "sweep", title: "Base rate is destiny",
        prompt: "Hold the model fixed (sensitivity 0.96, specificity 0.97) and compute precision for base rates 0.0001, 0.001, 0.003, 0.01, 0.05, 0.2, 0.5 into a list `ppv`. Plot precision against base rate.",
        starter: `sens, spec = 0.96, 0.97
rates = np.array([0.0001, 0.001, 0.003, 0.01, 0.05, 0.2, 0.5])
ppv = [ (sens*r) / (sens*r + (1-spec)*(1-r)) for r in rates ]
for r, p in zip(rates, ppv):
    print(f"base rate {r:7.2%}  ->  precision {p:6.1%}")

grid = np.linspace(0.0001, 0.5, 400)
plt.plot(grid, (sens*grid)/(sens*grid + (1-spec)*(1-grid)))
plt.xlabel("base rate"); plt.ylabel("P(fraud | alert)"); plt.title("Same model. Only the base rate changes.")
plt.show()
`,
        check: `assert len(ppv) == 7 and ppv[0] < 0.01 and ppv[-1] > 0.95, "Precision should run from under 1% to over 95% across the sweep"`,
        solution: `sens, spec = 0.96, 0.97
rates = np.array([0.0001, 0.001, 0.003, 0.01, 0.05, 0.2, 0.5])
ppv = [ (sens*r) / (sens*r + (1-spec)*(1-r)) for r in rates ]
for r, p in zip(rates, ppv):
    print(f"base rate {r:7.2%}  ->  precision {p:6.1%}")

grid = np.linspace(0.0001, 0.5, 400)
plt.plot(grid, (sens*grid)/(sens*grid + (1-spec)*(1-grid)))
plt.xlabel("base rate"); plt.ylabel("P(fraud | alert)"); plt.title("Same model. Only the base rate changes.")
plt.show()
`,
      },
    ],
    quiz: [
      { id: "q1", q: "A 99%-sensitive, 99%-specific screening test; the disease affects 1 in 10,000. A patient tests positive. Probability they have it?", choices: ["About 99%", "About 50%", "About 1%", "About 10%"], answer: 2, why: "100 healthy false positives per 10,000 people swamp the 1 true case. This is why screening programmes confirm with a second, different test." },
      { id: "q2", q: "Which term does intuition drop when it guesses 90% for the fraud alert?", choices: ["The recall", "The base rate P(fraud)", "The specificity", "The sample size"], answer: 1, why: "The prior. Rare events make precision low no matter how good the detector." },
      { id: "q3", q: "Precision at a 0.3% base rate is 9%. To reach 50% precision, roughly what must happen to the false-positive rate (currently 3%)?", choices: ["Halve it", "Cut it tenfold to about 0.3%", "Leave it; raise recall", "Double the sample"], answer: 1, why: "Solving (1−spec)(1−r) = sens·r gives a required false-positive rate around 0.29% — a tenfold improvement just to reach a coin flip." },
      { id: "q4", q: "Two groups have different base rates of the flagged behaviour. The same model is applied to both. Then…", choices: ["Precision is the same for both", "Precision differs between the groups automatically", "Recall differs but precision does not", "Nothing differs"], answer: 1, why: "Precision depends on the base rate. Equal treatment by the algorithm produces unequal experience of it — the engine of the impossibility result." },
      { id: "q5", q: "Which statement about COMPAS is accurate?", choices: ["ProPublica was wrong and Northpointe right", "Northpointe was wrong and ProPublica right", "Both measured something real; the two fairness criteria could not both hold because base rates differed", "The model was simply inaccurate"], answer: 2, why: "Unequal error rates by race and calibration by race are mathematically incompatible when base rates differ. The dispute is about which fairness definition governs." },
    ],
  },
  {
    id: "s6-fairness-impossibility",
    session: 6, track: "ethics", minutes: 60,
    title: "Three fairness definitions, and why you must choose",
    summary: "Demographic parity, equalized odds, calibration — and the theorem that says they cannot all hold at once. If you learn one thing before the term starts, make it this.",
    video: {
      youtubeId: "wqamrPkF5kk", title: "21 Definitions of Fairness and Their Politics", channel: "Arvind Narayanan · FAT* 2018", minutes: 55,
      watchFor: [
        "Watch the first 25 minutes; the rest is optional depth.",
        "Group fairness versus individual fairness — different questions entirely.",
        "The moment he shows that statistical parity and error-rate equality conflict. That is the whole lesson.",
      ],
    },
    reading: {
      keyIdea: "Calibration, equal false-positive rates, and equal false-negative rates cannot all hold at once unless base rates are equal or the classifier is perfect. 'Make the model fair' is therefore not a well-posed engineering request — someone must choose, and the choice has losers.",
      body: [
        "**Demographic parity** — flag the same *proportion* of each group, regardless of outcomes. **Equalized odds** — equal true-positive *and* false-positive rates across groups (the weaker **equal opportunity** asks only for equal recall). **Calibration** — a score of 0.3 means a 30% real rate in *every* group.",
        "Each is reasonable. Each is what some stakeholder means by 'fair'. And the theorem (Kleinberg, Mullainathan & Raghavan 2016; Chouldechova 2017) says that when base rates differ between groups, you cannot satisfy them all. Not because the code is inadequate, but because confusion-matrix arithmetic forbids it.",
        "## What follows for a practitioner",
        "Somebody has to decide *which* definition governs, and that decision is **normative**, not technical — it cannot be derived from the data. It has identifiable winners and losers under each choice. And it belongs to governance, with an auditable record of the reasoning. That is exactly the machinery SR 11-7 already demands for model choices: documented rationale, independent challenge, monitoring. You have been operating it for years.",
        "## In Session 15 you will compute this yourself",
        "On the lending data, a model that never sees `applicant_group` still flags group B at 1.45× group A's rate if you equalise recall — or catches fewer of B's genuine defaulters if you equalise flag rates. Both defensible; not simultaneously achievable. Saying 'when I implemented it, the two criteria required different thresholds' is a far stronger claim in a discussion post than 'the literature suggests a tension exists'.",
      ],
    },
    exercises: [],
    quiz: [
      { id: "q1", q: "Equalized odds requires equal…", choices: ["Selection rates", "True-positive and false-positive rates across groups", "Calibration", "Base rates"], answer: 1, why: "Both error rates equal across groups. Equal opportunity is the weaker version — recall only." },
      { id: "q2", q: "Under what condition can calibration and equal error rates both hold?", choices: ["With enough data", "Never", "When base rates are equal across groups, or the classifier is perfect", "When the protected attribute is removed"], answer: 2, why: "That is the precise statement of the impossibility result." },
      { id: "q3", q: "A vendor promises a 'fair' credit model. The right first question is…", choices: ["What is its accuracy?", "Fair by which definition — and who loses under it?", "Does it use race?", "Is it explainable?"], answer: 1, why: "'Fair' is not well-posed until a definition is chosen, and every choice has an identifiable cost." },
      { id: "q4", q: "Who should make the choice of fairness criterion?", choices: ["The data scientist, since it is technical", "The vendor", "Governance, with a documented rationale and independent challenge", "The regulator only"], answer: 2, why: "The choice is normative and has losers. Documented rationale and effective challenge is what SR 11-7 already requires for model decisions." },
    ],
  },
];
