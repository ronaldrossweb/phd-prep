# Case Bank

**12 cases: 8 public, 4 banking-sector.**

## How to use this

Each case follows the same six-part structure, because that structure *is* the shape of a good ethics
paper (see `apa7-template.md` § "A structure that works"):

1. **What happened** — the facts, briefly
2. **The principle at stake** — named, not gestured at
3. **Framework mapping** — which NIST AI RMF function failed, and the regulatory position
4. **The technical reality** — what was and was not mathematically achievable
5. **Counterfactual design** — the specific control that would have prevented it
6. **Your angle** — the argument available to *you* that most of your cohort cannot make

A warning on accuracy: the figures below are as reported in the cited sources, and several remain
contested by the organisations involved. **Verify any number before putting it in a paper**, and
attribute claims to whoever made them rather than stating them flatly. Getting caught overstating a
contested figure costs more credibility than the figure was worth.

### Confidentiality rule for the banking cases (9–12)

Cases 9–12 are written **generically** — no employer, no client, no confidential specifics. They
describe categories of decision common across the industry. Keep them that way. When you use them in
coursework, speak in terms of "an institution of this type" rather than anything identifiable. There
is no academic benefit to specificity here and considerable professional risk.

---

# PART I — PUBLIC CASES

---

## Case 1 · COMPAS — the case that defines the field

**What happened.** COMPAS, a proprietary recidivism risk tool by Northpointe (now Equivant), was used
in US pretrial and sentencing contexts. ProPublica (Angwin et al., 2016) analysed Broward County data
and reported that among defendants who did *not* reoffend, Black defendants were roughly twice as
likely to have been labelled high-risk; among those who *did* reoffend, white defendants were more
likely to have been labelled low-risk. Northpointe responded that the tool was **calibrated** — a
given score meant the same recidivism probability regardless of race.

**The principle at stake.** Both parties were right, and that is the whole point. This is not a
dispute about data quality or model competence. It is a dispute about **which definition of fairness
governs**, and it cannot be settled empirically.

**Framework mapping.**
- **MAP** failed first: the intended use (informing a liberty decision) was never squared with the
  tool's error profile. The consequences of a false positive — detention — were not analysed.
- **MEASURE** failed: performance was reported in aggregate, never disaggregated by race before deployment.
- **GOVERN** failed structurally: a proprietary model with no external validation was making
  liberty-affecting recommendations, with no effective-challenge function anywhere in the process.
- **EU AI Act:** administration of justice is **high-risk** (Annex III). Under the Act this system
  would require conformity assessment, logging, and documented human oversight.

**The technical reality.** Kleinberg, Mullainathan & Raghavan (2016) and Chouldechova (2017) proved
formally what this case demonstrated: when base rates differ between groups, calibration and equal
false-positive/false-negative rates **cannot all hold** unless the classifier is perfect. Northpointe
achieved calibration. ProPublica demanded equal error rates. **No model could have delivered both.**

**Counterfactual design.** Not "a better model" — that was never available. Instead: (a) a documented,
publicly-defensible *choice* of fairness criterion made before deployment, with the reasoning and the
identified losers recorded; (b) mandatory disaggregated error reporting; (c) independent validation as
a condition of procurement; (d) an explicit judicial instruction on what the score does and does not
mean.

**Your angle.** The procurement failure is the part that is under-argued in the literature and squarely
in your professional wheelhouse. A bank cannot deploy a vendor model into a credit decision without
validating it under SR 11-7 — an independent challenge function must be able to examine it. A
proprietary, unvalidatable model informing a *liberty* decision would be unthinkable under a
model-risk regime far less consequential than criminal justice. **The correct critique of COMPAS is
not that the math was wrong; it is that the governance was weaker than the standard already applied to
mortgage pricing.** That argument is a term paper.

---

## Case 2 · Apple Card — transparency as the real failure

**What happened.** In November 2019 a software entrepreneur publicly reported that he had received a
credit limit roughly twenty times his wife's, despite her higher credit score and their joint filing.
Others reported similar experiences. The New York Department of Financial Services investigated the
issuer, Goldman Sachs, and in its 2021 report **did not find unlawful discrimination** under fair
lending law — but was critical of the customer-facing transparency and the inability of service staff
to explain decisions.

**The principle at stake.** **Explainability and accountability**, more than fairness. The bank could
not explain its own decisions to the people affected by them, and its front line could only say "the
algorithm decided."

**Framework mapping.**
- **GOVERN** failed: no one in the customer-facing chain had the authority or information to explain
  or review an outcome. That is diffuse accountability — the exact failure mode the term names.
- **MANAGE** failed: there was no effective escalation route for a contested decision.
- **Regulatory:** US **ECOA / Regulation B** requires *specific* reasons in an adverse action notice —
  "algorithmic decision" does not satisfy it. Under the **EU AI Act**, creditworthiness assessment is
  **high-risk**, carrying explicit human-oversight obligations.

**The technical reality.** Note carefully: the model may have been *entirely lawful and statistically
sound*. Individual-level explanation of a complex model is genuinely hard — SHAP and LIME give local
approximations, not the actual decision logic, and are routinely over-read as causal. This case is a
useful corrective to the assumption that every AI ethics problem is a bias problem.

**Counterfactual design.** Reason codes generated *at decision time* and stored with the decision, not
reconstructed afterwards; a human review path with real authority to override; service staff equipped
with the reason codes; pre-launch disparate-impact testing on the household-level scenarios that
actually generated the complaints.

**Your angle.** Adverse action notice requirements have been law since 1974. Every consumer lender
already knows how to produce a specific, defensible reason for a denial — the operational machinery
exists and is examined. The interesting question is why a new entrant to consumer credit shipped
without it. **This is a case about an established compliance discipline not being carried across into
a new product line, not about a novel ethical dilemma** — and you can make that argument from
experience.

---

## Case 3 · Amazon's hiring tool — historical bias, cleanly demonstrated

**What happened.** Reuters reported in 2018 that Amazon had developed and then abandoned an
experimental résumé-screening model. Trained on roughly a decade of applications to a
male-dominated technical workforce, it reportedly learned to penalise the token "women's" (as in
"women's chess club captain") and to downgrade graduates of two women's colleges. Amazon stated the
tool was never the sole basis for hiring decisions and was discontinued.

**The principle at stake.** **Historical bias.** The model was not broken. It was an accurate
description of past hiring, and past hiring was skewed. A faithful model of an unjust process
reproduces the injustice with perfect fidelity — and with the appearance of objectivity.

**Framework mapping.**
- **MAP** failed at the root: the target variable was "resembles people we hired," not "will succeed
  in the role." Those are different things, and the gap between them is where the harm lived.
- **MEASURE** eventually worked — this is one of the few cases where testing *caught* the problem
  before deployment, which is worth crediting.
- **EU AI Act:** employment screening is **high-risk** (Annex III).

**The technical reality.** Removing the gendered tokens did not fix it, and this is the crucial detail.
**Proxies** remained — sport, phrasing, institution, verb choice. This is the empirical demonstration
of what you proved computationally in `notebooks/11_model_evaluation.ipynb`: excluding the protected
attribute does not remove the disparity, because the other features carry it. "We don't use gender"
is not a fairness argument.

**Counterfactual design.** Interrogate the target variable first — predict validated job performance,
not historical selection. Audit features for proxy structure before training. Hold out a
disaggregated evaluation set from the start. And, most importantly, ask at the **MAP** stage whether
supervised learning on historical decisions is an appropriate method *at all* when those decisions are
the thing under suspicion.

**Your angle.** This is the cleanest teaching case for the proxy problem, and you can strengthen it
with the direct lending parallel: **ZIP code is to race what "women's chess club" is to gender.** US
fair lending law has decades of doctrine on facially-neutral variables producing disparate impact, and
that doctrine is more developed than anything in the AI fairness literature. Bringing it to bear is an
original move.

---

## Case 4 · Dutch childcare benefits — the highest-consequence case in the set

**What happened.** The Dutch tax authority used a risk-classification system to flag childcare benefit
applications for fraud investigation. Roughly 26,000 families were wrongly accused, required to repay
large sums, and driven in many cases into severe financial distress; some children were placed in
foster care. Dual nationality and other proxy indicators featured in the risk scoring. A parliamentary
inquiry was scathing, and the **Dutch government resigned in January 2021**. Separately, in February
2020 a Hague court ruled the related **SyRI** welfare-fraud system unlawful under the ECHR for
insufficient transparency and proportionality.

**The principle at stake.** **Proportionality, due process, and human dignity.** Not merely a
statistical error — an automated accusation that reversed the burden of proof against people with no
realistic route of appeal.

**Framework mapping.**
- **GOVERN** failed catastrophically: no meaningful accountability until the government fell.
- **MANAGE** failed: no functioning appeal, no monitoring of harm, no circuit-breaker as complaints mounted.
- **MAP** failed: the affected population was among the most financially vulnerable, and the
  consequence of a false positive was ruinous. This is precisely what impact assessment is for.
- **EU AI Act:** an instructive case for the **unacceptable-risk** tier — government social scoring is
  now prohibited, and this case is part of why.

**The technical reality.** The base-rate arithmetic from `notebooks/05_bayes_by_simulation.ipynb`
applies directly and is damning. Benefit fraud is rare. A detector with a modest false-positive rate
operating on a large, overwhelmingly honest population generates a caseload that is mostly innocent
people — **regardless of how good the model is.** Deploying rare-event detection with severe automatic
consequences and no human adjudication is arithmetically guaranteed to produce mass wrongful harm.

**Counterfactual design.** Treat a flag as a *prompt to investigate*, never as a finding — the single
most important distinction in the whole case. Require human adjudication before any financial
consequence. Cap automated recovery. Build the appeal route before launch. Monitor the precision of
alerts continuously and halt on degradation. Prohibit nationality and its proxies in the feature set.

**Your angle.** This is the case for arguing that **precision, not accuracy, is the governing metric
whenever a false positive triggers an adverse action against a person.** You can quantify it, from
your own notebook, and then generalise: an AML alerting regime that freezes accounts on a low-precision
signal is the same structure with the same arithmetic. That comparison is not in the standard reading,
and it is the strongest version of this case.

---

## Case 5 · Optum / healthcare risk — the best case on target-variable choice

**What happened.** Obermeyer et al. (*Science*, 2019) examined a widely-deployed commercial algorithm
used to identify patients for extra care management, affecting an estimated 200 million people
annually in the US. The algorithm predicted **healthcare costs** as a stand-in for health *need*.
Because less was historically spent on Black patients at equivalent levels of illness, Black patients
had to be **sicker** than white patients to receive the same risk score. The authors calculated that
correcting the target variable would raise the share of Black patients identified for additional care
from roughly 17.7% to 46.5%.

**The principle at stake.** **Measurement bias** — specifically, the choice of proxy for the thing you
actually care about. The most consequential decision in the whole pipeline, and typically the least
examined.

**Framework mapping.**
- **MAP** failed entirely, and this is the textbook instance: "cost" was substituted for "need"
  without interrogating whether historical spending was an equitable measure of illness.
- **MEASURE** failed: no disaggregated validation against a clinical ground truth.
- Note that **GOVERN** was arguably *working* — this was a mainstream, commercially-audited product.
  Governance process is not sufficient when the framing is wrong.

**The technical reality.** The model was accurate at what it was asked to do. It predicted costs well.
The defect was upstream of all modelling, in the operationalisation of the objective. **No amount of
model-side fairness intervention — reweighting, threshold adjustment, adversarial debiasing — fixes a
wrong target variable.** It is the clearest available demonstration that fairness is not primarily a
modelling problem.

**Counterfactual design.** Interrogate every proxy explicitly: write down what you *mean* to measure,
what you *are* measuring, and the mechanism by which they could diverge across groups. Validate
against a clinical outcome rather than a financial one. Require disaggregated performance before
procurement.

**Your angle.** Proxy-target substitution is endemic in banking and you can name real examples
generically: using historical approval as a label for creditworthiness, using account tenure as a
proxy for stability, using transaction volume as a proxy for business health. **Every one has the
Optum structure**, and any one of them is a paper. This is the case I would build a term paper around
if you want the strongest combination of academic credibility and personal authority.

---

## Case 6 · Facial recognition — Gender Shades and Robert Williams

**What happened.** Buolamwini & Gebru's *Gender Shades* (2018) audited commercial gender-classification
systems and found error rates ranging from under 1% for lighter-skinned men to as high as ~34.7% for
darker-skinned women. In January 2020, Robert Williams was wrongfully arrested in Detroit after a
facial recognition match — reported as the first documented US wrongful arrest attributable to the
technology. Several further cases have since been reported.

**The principle at stake.** **Representation bias** in training data, compounded by **over-reliance**
on a probabilistic output as though it were an identification.

**Framework mapping.**
- **MEASURE** failed twice: aggregate accuracy masked catastrophic subgroup performance, and the
  vendors' reported metrics were not disaggregated. *Gender Shades* is essentially an argument for
  mandatory disaggregated evaluation.
- **MANAGE** failed in deployment: a probabilistic lead was treated as probable cause.
- **EU AI Act:** most real-time remote biometric identification in public spaces falls in the
  **unacceptable-risk** tier.

**The technical reality.** Aggregate accuracy is a weighted average dominated by the largest subgroup.
A system can report 95% overall and be near-useless for a minority subgroup — the same structural point
as the accuracy trap in `notebooks/11_model_evaluation.ipynb`, where 90.8% accuracy concealed **zero**
recall. **Any single headline performance number is a fairness risk in itself.**

**Counterfactual design.** Mandate disaggregated reporting as a procurement condition. Require
corroborating evidence before arrest — a policy control, not a technical one. Set subgroup performance
floors below which deployment is prohibited. Publish model cards (Mitchell et al., 2019).

**Your angle.** The governance parallel is *concentration risk*. Banks are required to report exposures
disaggregated by segment precisely because an aggregate figure conceals concentrations that can kill
you. The regulatory logic for disaggregated AI performance reporting is identical and already
well-established in another domain — an argument for why mandatory subgroup reporting is neither
novel nor burdensome.

---

## Case 7 · Ofqual A-levels — when the unit of analysis is wrong

**What happened.** With UK exams cancelled in 2020, Ofqual applied an algorithm to standardise
teacher-predicted grades using each school's historical performance. Roughly 39% of teacher assessments
were downgraded. Because the method leaned on institutional history and handled small cohorts
differently, high-achieving students at historically lower-performing (disproportionately poorer)
schools were downgraded, while small classes — more common in private schools — were relatively
favoured. After widespread protest the results were withdrawn within days.

**The principle at stake.** **Individual versus group justice.** The algorithm was arguably defensible
as a population-level standardisation and indefensible as a judgement about any individual student.

**Framework mapping.**
- **MAP** failed: the affected parties — individual students with university places at stake — were not
  the unit the model reasoned about.
- **GOVERN** failed: no meaningful appeal existed at launch, for a decision with irreversible
  life consequences.
- **EU AI Act:** education access is **high-risk** (Annex III).

**The technical reality.** The model may well have produced a better *aggregate* grade distribution
than uncorrected teacher predictions. **Statistical optimality at the population level does not confer
legitimacy at the individual level** when the decision is individual. A prediction based substantially
on your school's history is, from the student's perspective, being judged for something they did not do.

**Counterfactual design.** Ask at the design stage who the decision subject is, and require that the
model's evidence be *about that subject*. Provide an appeal route before launch. Run the distributional
impact analysis by school type — it would have surfaced the problem immediately. Prefer the less
statistically efficient but individually defensible option when the stakes are irreversible.

**Your angle.** This is the strongest case for the limits of actuarial reasoning about individuals —
and it has a direct lending analogue you can name. Pricing an individual on their postcode's default
history is statistically informative and, in most jurisdictions, unlawful, *specifically because*
group-based inference about individuals is treated as illegitimate in consumer credit regardless of
its predictive power. **Fair lending law already resolved the question Ofqual got wrong.** That is a
genuinely original framing and a strong discussion post.

---

## Case 8 · Michigan MiDAS — automation without adjudication

**What happened.** Michigan's Integrated Data Automated System (MiDAS), deployed around 2013, was used
to detect unemployment-insurance fraud with minimal human review. Tens of thousands of accusations were
issued, carrying substantial automatic penalties. A subsequent state review of a subset of cases found
a very high error rate — figures around 93% have been widely reported, and the state acknowledged
extensive wrongful determinations. Litigation and settlements followed, alongside documented severe
financial harm including bankruptcies.

**The principle at stake.** **Due process**, and the removal of human judgement from a punitive
decision. As in Case 4, the system effectively reversed the burden of proof.

**Framework mapping.**
- **GOVERN**: accountability was eliminated by design — removing human reviewers was the stated efficiency gain.
- **MANAGE**: no monitoring of determination accuracy, and no halt mechanism as errors accumulated.
- **MEASURE**: apparently no validation of precision against adjudicated outcomes at all.

**The technical reality.** Identical arithmetic to Case 4, and worth stating as a general law: **rare
event + imperfect detector + automatic severe penalty + no adjudication = mass wrongful harm, with
mathematical certainty.** The model's quality is close to irrelevant; the system design guarantees the
outcome. If you internalise one structural pattern from this case bank, make it this one.

**Counterfactual design.** Human adjudication mandatory before any penalty. Continuous precision
monitoring against adjudicated outcomes, with an automatic halt on degradation. Penalties proportionate
and reversible. Appeal built before launch, not retrofitted.

**Your angle.** Compare directly to AML/fraud operations in banking, where alert-to-case-to-SAR
pipelines exist *precisely* to insert human adjudication between a statistical signal and a
consequential action — and where regulators examine alert precision and tuning. **A mature operational
answer to this exact problem already exists in financial services.** MiDAS is not evidence that
automated detection is illegitimate; it is evidence that it was deployed without the adjudication layer
that comparable regimes require. Few in your cohort can make that argument with operational detail.

---

# PART II — BANKING-SECTOR CASES

**Written generically. No employer, no client, no confidential specifics.** These describe categories
of decision common across regulated financial institutions. Use them in that register.

These four exist because they are **yours**. The eight public cases are in every student's reading
list; these are not. Where a public case lets you demonstrate that you did the reading, these let you
demonstrate that you have made the decision.

---

## Case 9 · The natural-language analytics copilot

**The situation.** A bank deploys a governed analytics platform where business users ask questions in
plain English. A language model translates the question into a query against governed data and returns
an answer with a short narrative summary. It is fast, popular, and materially expands who can get
answers without a data analyst.

Then someone asks a question whose translation is subtly wrong — a join that silently drops a segment,
a date filter off by one period, an ambiguous "active customers" resolved differently than the asker
assumed. The number looks entirely plausible. It goes into a pack. It informs a decision about pricing
or credit policy.

**The principle at stake.** **Accountability under epistemic opacity.** Nobody lied and nobody was
negligent. The failure is that the system produces *confident, well-formatted, unverifiable* output,
and the reader has no signal distinguishing a correct answer from a wrong one.

**Framework mapping.**
- **GOVERN**: who owns the correctness of a generated answer — the platform team, the data owner, or
  the business user who asked? If that is not written down, it is nobody, which is the failure.
- **MAP**: was the intended use "exploratory analysis" or "input to governed decisions"? Systems drift
  from the first to the second silently, and the controls appropriate to each differ completely.
- **MEASURE**: what is the query-translation accuracy rate? Most deployments cannot answer this.
- **EU AI Act**: if outputs feed creditworthiness assessment, the **high-risk** obligations may reach
  the analytics layer — an under-appreciated scoping question.

**The technical reality.** Two distinct problems, often conflated. Ambiguity in natural language is
irreducible — "active customers" genuinely has several defensible meanings, and no model can resolve
what the asker did not specify. That is not a model defect. Separately, translation error rates are
non-zero and, critically, **errors are not self-announcing**: a wrong query usually returns a
plausible number, not an error message. Fluency and correctness are uncorrelated in generated output,
and human reviewers systematically over-trust fluent text.

**Counterfactual design.** Show the generated query alongside the answer, always — make the reasoning
inspectable rather than explaining it after the fact. Bind answers to certified metric definitions
rather than free-form generation, so "active customers" has one governed meaning. Tier the controls by
use: exploratory answers watermarked as such, decision-grade answers requiring analyst sign-off.
Maintain a benchmark suite of known question/answer pairs and monitor translation accuracy as a
production metric. Log every question, generated query and answer for audit.

**Your angle.** This is the governance frontier nobody has solved, and you can write about it from
inside the problem. The strongest argument: **a generated query is a model output and should sit in the
model inventory.** Under SR 11-7 an institution cannot use an unvalidated model in a decision process;
a language model translating questions into queries against customer data is performing exactly that
function, and is typically governed as *software* rather than as a *model*. Naming that gap — and the
"semantic layer as a model risk control" response to it — is publishable, not just submittable.

---

## Case 10 · Alternative data in underwriting

**The situation.** To extend credit to applicants with thin files — a genuine financial-inclusion goal,
and a real commercial opportunity — a lender considers alternative data: cash-flow patterns from
account aggregation, rent and utility payment history, telecom and device signals, educational
background. Validation shows a real lift in predictive power, and the model approves people the
traditional scorecard would have declined.

Then disparate-impact testing shows the approved population differs materially by protected class from
what the traditional model produced. Some new variables are doing work that correlates with
neighbourhood, and neighbourhood correlates with race.

**The principle at stake.** **The inclusion/disparate-impact tension**, in its sharpest form. The
model may *expand* access overall while *redistributing* it in a way that fails a fair lending test.
More access and less equitable access are not contradictory outcomes.

**Framework mapping.**
- **MAP**: which population is the beneficiary, and measured against which baseline? Against
  "declined by the old model," almost everyone gains. Against "approved under an alternative design,"
  some groups lose.
- **MEASURE**: disparate impact must be tested per variable and per model version, not once at launch.
- **MANAGE**: the **less discriminatory alternative** search is a legal obligation in US fair lending,
  not an optional fairness gesture.
- **EU AI Act**: creditworthiness is **high-risk**; **ECOA/Reg B** governs in the US.

**The technical reality.** This is `notebooks/11_model_evaluation.ipynb` as a live business decision.
Every proxy-laden variable trades predictive lift against disparate impact, and there is no threshold
that eliminates the tradeoff — only choices about where to sit on it. Dropping a variable costs
measurable accuracy, which costs approvals for *everyone* including the protected group. **There is no
option without an identifiable loser**, and any analysis claiming otherwise has not been done properly.

**Counterfactual design.** Test each variable for proxy structure *before* it enters the candidate set,
not after the model is built and politically expensive to change. Conduct a documented
less-discriminatory-alternative search, recording the accuracy/impact frontier explicitly. Make the
selection at a governance forum with the tradeoff written down and the losers named. Monitor
post-deployment impact continuously, because drift changes proxy relationships.

**Your angle.** You can write the paper that most of the fairness literature avoids: **how the choice
is actually made, by whom, and on what record.** The academic literature is strong on defining metrics
and weak on institutional decision procedure — who convenes, what evidence is tabled, what gets
minuted, how the decision is defended to an examiner two years later. That procedural knowledge is
scarce in an academic setting and abundant in yours.

---

## Case 11 · Transaction monitoring and the precision problem

**The situation.** An institution runs automated monitoring for fraud and money laundering. Alerts
trigger review, and in defined circumstances an automatic hold on an account. The model has good
recall — it catches most of what it should. Precision is low, as it is in every such system, because
the underlying behaviour is rare.

Each false positive is a customer whose funds are frozen: a failed rent payment, a declined card at a
pharmacy, hours on the phone. The harm is real, immediate, and distributed unevenly — customers with
thin liquidity buffers are hurt far more by a three-day hold than affluent ones.

**The principle at stake.** **Proportionality, and the distribution of error costs.** The institution
optimises recall because regulatory penalties for missed laundering are severe and quantifiable. The
cost of a false positive falls on the customer and appears in no risk model.

**Framework mapping.**
- **MAP**: who bears the cost of each error type? Asymmetric and, crucially, *externalised* — the
  costs the institution optimises against are not the costs customers bear.
- **MEASURE**: is precision monitored and reported at all, and disaggregated by customer segment?
- **MANAGE**: how fast is remediation, and is *that* a monitored service level?
- Note the genuine regulatory bind: AML obligations effectively mandate high recall. This is not a
  case of institutional carelessness but of conflicting duties.

**The technical reality.** Straight from `notebooks/05_bayes_by_simulation.ipynb`: with a base rate in
the fractions of a percent, even excellent specificity yields a caseload dominated by false positives.
The 96%-recall/9%-precision model in that notebook is not pessimistic — it is typical. **Precision at
low base rates is bounded by arithmetic, not by effort**, and no model improvement escapes it. Only
changing the *consequence* of an alert does.

**Counterfactual design.** Separate "alert" from "action" absolutely — the Case 4 and Case 8 lesson, in
a domain where the institution has the operational maturity to apply it. Reserve automatic holds for a
narrow, high-precision band and route the rest to human review. Monitor and report precision by segment.
Treat time-to-resolution as a customer-harm metric with a service level, not a back-office statistic.
Give front-line staff authority to release a hold.

**Your angle.** You can make the argument the literature rarely reaches: **the fairness question in AML
is not about the model, it is about the consequence design.** Two institutions running the identical
model produce radically different distributions of harm depending on whether an alert freezes funds or
opens a case. That reframing — from model fairness to *consequence* fairness — generalises to Cases 4,
7 and 8, and is a strong candidate for an original contribution.

---

## Case 12 · Generative AI in customer communication

**The situation.** A bank uses a language model to draft customer communications: service responses,
explanations of fees and decisions, and — the difficult category — assistance in drafting **adverse
action notices** explaining why an application was declined.

The drafts are fluent, consistent, and much faster to produce than manual ones. They are also
occasionally, confidently wrong: an inapplicable reason, a plausible-sounding product term that does
not exist, a subtly misleading characterisation of why a decision went the way it did.

**The principle at stake.** **Transparency and the right to an accurate explanation.** An adverse
action notice is not a courtesy — it is a legally mandated, specific statement of reasons, and it is
the customer's only route to understanding and contesting a decision. A fluent but wrong reason is
worse than no reason, because it misdirects the appeal.

**Framework mapping.**
- **GOVERN**: who signs off? If a generated notice reaches a customer unreviewed, the accountable
  party is undefined.
- **MEASURE**: what is the factual-accuracy rate of generated notices, measured against the actual
  decision reasons? This is testable and frequently untested.
- **MANAGE**: what is the detection and remediation path for a wrong notice already sent?
- **Regulatory**: **ECOA/Reg B** requires *specific* principal reasons. **EU AI Act** transparency
  duties attach to AI-generated customer interaction.

**The technical reality.** Language models optimise plausibility, not truth — and for this use case
that is precisely the wrong objective. The failure mode is not an error message but a *confident,
well-formed, incorrect sentence*, which is the hardest kind of error for a human reviewer to catch.
Worse, review quality degrades exactly as volume and draft quality rise: reviewers of consistently
good drafts stop reading carefully. **Human-in-the-loop is not a control unless the human is
resourced, incentivised and able to say no** — and at scale, with fluent drafts, they usually are not.

**Counterfactual design.** Generate *from* the structured reason codes rather than from free text, so
the model is constrained to the actual decision basis — templated generation over open generation for
any regulated communication. Validate every notice against the decision record programmatically before
sending. Keep the human review where the model is weakest, not uniformly. Measure reviewer override
rates as a leading indicator: a rate approaching zero means review has become rubber-stamping. Log
every draft, edit and send.

**Your angle.** The strongest and most transferable argument here: **automation bias is a control
failure, not a human failing.** The more fluent the output, the less reliably humans review it, so
"human oversight" — the control that both the EU AI Act and NIST lean on most heavily — degrades
precisely as the technology improves. That is a genuine, under-examined weakness in the frameworks
themselves, and critiquing a framework rather than applying it is exactly the move that distinguishes
doctoral work from coursework.

---

# Cross-cutting patterns

Worth memorising. These recur constantly and give you a fast, credible read on any new case.

| Pattern | Cases | The rule |
|---|---|---|
| **Alert treated as finding** | 4, 8, 11, 12 | Rare event + imperfect detector + automatic severe consequence + no adjudication = mass wrongful harm, guaranteed |
| **Wrong target variable** | 3, 5 | No model-side fairness technique repairs a bad proxy for the objective |
| **Proxies survive attribute removal** | 3, 7, 10 | "We don't use the protected attribute" is not a fairness argument |
| **Aggregate metric hides subgroup failure** | 1, 6, 11 | Any single headline performance figure is itself a fairness risk |
| **Fairness definitions conflict** | 1, 10 | Unequal base rates make the tradeoff mathematical, so the choice is normative and must be documented |
| **Accountability diffused** | 2, 8, 9, 12 | "The algorithm decided" means no one is answerable — the defining governance failure |
| **Group inference about individuals** | 1, 7 | Population-level optimality does not legitimise an individual decision |
| **Human oversight decays** | 9, 12 | Automation bias worsens as output quality improves; oversight must be measured, not assumed |

## The four arguments that are distinctively yours

Return to these when you need a paper topic or a discussion post with teeth:

1. **AI governance is an extension of model risk management, not a new discipline.** SR 11-7 maps onto
   the NIST AI RMF almost function for function. Banking has run examined, independently-validated
   model governance for over a decade. What AI adds is scale, opacity and non-stationarity — not the
   basic need for an inventory, an owner and an effective challenger.
2. **Consequence design matters more than model fairness.** Identical models produce wholly different
   distributions of harm depending on what an output triggers. Cases 4, 7, 8 and 11 are all really
   about this, and the literature under-weights it relative to metric definitions.
3. **Precision, not accuracy, governs any system that acts adversely on people.** You can prove this
   from your own notebooks, and then apply it across four of the public cases.
4. **Human oversight is a control that degrades as the technology improves.** Both major frameworks
   depend on it heavily. Automation bias means it weakens precisely when it is most relied upon —
   a critique *of* the frameworks rather than an application of them.
