# The Framework Map

**PhDAI 832 · read in Session 2, deepened in Session 3**

Five bodies of work get cited constantly in responsible-AI writing. Most students learn them as a
blur of acronyms. Learn instead **what each one is for**, because that is what lets you pick the
right one in an argument.

## The one-paragraph version

> **NIST AI RMF** tells you *how to organise the work*. The **EU AI Act** tells you *what the law
> requires*. **OECD Principles** tell you *what values are agreed internationally*. **IEEE 7000**
> tells you *how to build values in during design*. **Fairness and Machine Learning** tells you *what
> is mathematically possible*. And **SR 11-7** — which your cohort will not cite — tells you *how a
> regulated industry has actually been governing models for fifteen years.*

## Side by side

| | NIST AI RMF 1.0 | EU AI Act | OECD Principles | IEEE 7000 | Fairness & ML |
|---|---|---|---|---|---|
| **Type** | Voluntary framework | Binding law | Intergovernmental principles | Process standard | Academic text |
| **Origin** | NIST (US), 2023 | EU, 2024 | OECD, 2019 (rev. 2024) | IEEE, 2021 | Barocas/Hardt/Narayanan |
| **Answers** | How do we manage AI risk? | What must we legally do? | What do we collectively value? | How do we design for values? | What is achievable? |
| **Structure** | 4 functions | 4 risk tiers | 5 principles | Design lifecycle | Formal results |
| **Enforcement** | None | Fines to 7% of global turnover | None | Certification | n/a |
| **Best used for** | Structuring a governance argument | Compliance and jurisdiction claims | Framing values language | Design-stage recommendations | Proving a tradeoff is unavoidable |

## 1 · NIST AI RMF 1.0 — the spine

Four functions. **Memorise these; they are the most useful organising device you have for a paper.**

| Function | Question | In practice |
|---|---|---|
| **GOVERN** | Who is accountable, and under what policy? | Roles, escalation, documented risk appetite, culture |
| **MAP** | What is the context and what could go wrong? | Intended use, affected people, assumptions, impact assessment |
| **MEASURE** | How do we know? | Metrics, disaggregated testing, validation, red-teaming |
| **MANAGE** | What do we do about it? | Prioritise, mitigate, monitor, decommission |

**Why it is so quotable:** it is *cyclical, not linear*. Govern is not a gate you clear once — it runs
continuously alongside the other three. A very common weak argument in student papers treats ethics
as a pre-launch checklist; naming the cycle immediately signals you understand the framework.

NIST also lists the characteristics of trustworthy AI: valid and reliable, safe, secure and resilient,
accountable and transparent, explainable and interpretable, privacy-enhanced, and **fair with harmful
bias managed**. Note the phrasing — *managed*, not *eliminated*. NIST is quietly conceding the
impossibility result.

## 2 · EU AI Act — the risk tiers

| Tier | Meaning | Examples |
|---|---|---|
| **Unacceptable** | Banned outright | Social scoring by governments, manipulative subliminal techniques, most real-time biometric ID in public |
| **High-risk** | Heavy obligations | **Creditworthiness assessment**, employment screening, education access, critical infrastructure |
| **Limited-risk** | Transparency duties | Chatbots, deepfakes — must disclose |
| **Minimal** | Unregulated | Spam filters, recommendation of films |

**The line to remember: credit scoring is explicitly high-risk (Annex III).** That obliges risk
management, data governance, technical documentation, logging, human oversight, accuracy and
robustness, and a conformity assessment.

This matters for you directly. If your institution has EU customers or operations, an AI
underwriting tool is not a discretionary governance question — it is a regulated product. It is also
the strongest possible counter to "this is all voluntary."

## 3 · OECD AI Principles — the values vocabulary

Five, adopted by 40+ countries and the basis for much later regulation:

1. Inclusive growth, sustainable development and well-being
2. Human-centred values and fairness
3. **Transparency and explainability**
4. **Robustness, security and safety**
5. **Accountability**

Thin on implementation, which is the point — use them when you need the *language* of shared
international values, not when you need a procedure.

## 4 · IEEE 7000 — values at design time

A process standard for eliciting stakeholder values and translating them into concrete system
requirements *before* building. Its contribution is the insistence that ethics is a **design-stage
activity**, not an audit performed on a finished system.

Cite it whenever you argue that a harm should have been prevented by design rather than detected
afterwards — which, in most of the cases in `case-bank.md`, is the correct argument.

## 5 · Fairness and Machine Learning — what is possible

The technical canon (free at fairmlbook.org). It supplies the results that constrain everything above:

- Formal definitions: **demographic parity**, **equalized odds**, **equal opportunity**, **calibration**.
- **The impossibility theorem** — calibration, equal false-positive rates and equal false-negative
  rates cannot all hold unless base rates are equal across groups or the classifier is perfect.
- Why "just remove the protected attribute" fails: **proxies**.

You computed all three of these in `notebooks/11_model_evaluation.ipynb`. That is unusual for a
student in an ethics course, and it is worth saying so explicitly in a discussion post — "when I
implemented this, the two fairness criteria required different thresholds" is a far stronger claim
than "the literature suggests a tension exists."

## 6 · SR 11-7 — your unfair advantage

Federal Reserve / OCC **Supervisory Guidance on Model Risk Management** (2011). Not an AI document at
all. It requires, for every model a bank relies on:

- **Development** with documented assumptions, data lineage, and testing
- **Independent validation** by people who did not build it — the "effective challenge" function
- **Ongoing monitoring** with defined performance thresholds and escalation
- **Governance**: an inventory, defined ownership, board-level reporting, and documented risk appetite

### The mapping — build this table in your own words, and use it all term

| SR 11-7 requirement | NIST AI RMF function |
|---|---|
| Model inventory, ownership, board reporting | GOVERN |
| Documented purpose, assumptions, limitations | MAP |
| Independent validation / effective challenge | MEASURE |
| Ongoing monitoring, thresholds, escalation | MANAGE |
| Documented risk appetite | GOVERN |

**The argument this unlocks, which is genuinely yours to make:** banking has operated a mature,
examined, independently-validated model governance regime for over a decade. The AI governance
conversation frequently proceeds as though accountability for algorithmic decisions were a novel
problem. It is not new — it is newly *general*. What AI adds is scale, opacity, and non-stationary
data; what it does not add is the basic need for an inventory, an owner, and an independent
challenger.

That reframing — *AI governance as an extension of model risk management rather than a greenfield
discipline* — is a defensible, original thesis, and it is available to you because of your day job.
Consider it as a candidate for your term paper.

## How to choose in an argument

| If you need to... | Reach for |
|---|---|
| Structure an analysis or recommendation | NIST AI RMF's four functions |
| Establish that something is legally required | EU AI Act tiers |
| Invoke shared values | OECD Principles |
| Argue a harm was foreseeable at design | IEEE 7000 |
| Prove a tradeoff cannot be engineered away | Fairness & ML impossibility |
| Show a governance mechanism already exists and works | SR 11-7 |
