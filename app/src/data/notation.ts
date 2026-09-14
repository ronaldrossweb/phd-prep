// AUTO-GENERATED from ~/PhD/00-notation-cheatsheet.md -- do not edit by hand.
// Regenerate:  node scripts/gen-notation.mjs

export type NotationEntry = {
  symbol: string;
  readAloud: string;
  meaning: string;
  section: string;
};

export const NOTATION: NotationEntry[] = [
  {
    "symbol": "x̄",
    "readAloud": "\"x-bar\"",
    "meaning": "The mean of your sample — the data you actually have. A number you can compute.",
    "section": "The two that cause the most confusion"
  },
  {
    "symbol": "µ",
    "readAloud": "\"mew\"",
    "meaning": "The mean of the whole population — the truth you are trying to guess. Usually unknowable.",
    "section": "The two that cause the most confusion"
  },
  {
    "symbol": "σ",
    "readAloud": "\"sigma\" (lowercase)",
    "meaning": "Standard deviation — how spread out the individual data points are.",
    "section": "The two that cause the most confusion"
  },
  {
    "symbol": "SE",
    "readAloud": "\"standard error\"",
    "meaning": "How spread out the sample means would be if you repeated the study.",
    "section": "The two that cause the most confusion"
  },
  {
    "symbol": "σ²",
    "readAloud": "sigma squared",
    "meaning": "Variance — the standard deviation squared. Same information, different units.",
    "section": "Greek letters"
  },
  {
    "symbol": "α",
    "readAloud": "alpha",
    "meaning": "Your threshold for \"surprising enough\" — usually 0.05. Also the Type I error rate.",
    "section": "Greek letters"
  },
  {
    "symbol": "β",
    "readAloud": "beta",
    "meaning": "Type II error rate. Also a regression coefficient — context tells you which.",
    "section": "Greek letters"
  },
  {
    "symbol": "θ",
    "readAloud": "theta",
    "meaning": "A generic stand-in for \"the parameter I am trying to estimate.\"",
    "section": "Greek letters"
  },
  {
    "symbol": "θ̂",
    "readAloud": "\"theta-hat\"",
    "meaning": "The estimate of θ from data. A hat always means \"estimated from data.\"",
    "section": "Greek letters"
  },
  {
    "symbol": "ε",
    "readAloud": "epsilon",
    "meaning": "The error term — the part of the outcome your model does not explain.",
    "section": "Greek letters"
  },
  {
    "symbol": "λ",
    "readAloud": "lambda",
    "meaning": "A rate (Poisson), or a regularization strength (machine learning).",
    "section": "Greek letters"
  },
  {
    "symbol": "ρ",
    "readAloud": "rho",
    "meaning": "Population correlation.",
    "section": "Greek letters"
  },
  {
    "symbol": "χ²",
    "readAloud": "chi-squared",
    "meaning": "A test for categorical data.",
    "section": "Greek letters"
  },
  {
    "symbol": "Π",
    "readAloud": "product (capital pi)",
    "meaning": "\"Multiply all of these together.\"",
    "section": "Greek letters"
  },
  {
    "symbol": "P(A)",
    "readAloud": "\"P of A\"",
    "meaning": "The probability that A happens.",
    "section": "Probability"
  },
  {
    "symbol": "P(A\\",
    "readAloud": "B)",
    "meaning": "Probability of A in the world where B already happened.",
    "section": "Probability"
  },
  {
    "symbol": "P(A ∩ B)",
    "readAloud": "\"A and B\"",
    "meaning": "Both happen.",
    "section": "Probability"
  },
  {
    "symbol": "P(A ∪ B)",
    "readAloud": "\"A or B\"",
    "meaning": "At least one happens.",
    "section": "Probability"
  },
  {
    "symbol": "P(Aᶜ) or P(A')",
    "readAloud": "\"not A\"",
    "meaning": "A does not happen. Equals 1 − P(A).",
    "section": "Probability"
  },
  {
    "symbol": "A ⊥ B",
    "readAloud": "\"A independent of B\"",
    "meaning": "Knowing B tells you nothing about A.",
    "section": "Probability"
  },
  {
    "symbol": "X ~ N(µ, σ²)",
    "readAloud": "\"X is distributed normal with mean µ and variance σ²\"",
    "meaning": "~ means \"is drawn from.\"",
    "section": "Probability"
  },
  {
    "symbol": "E[X]",
    "readAloud": "\"expected value of X\"",
    "meaning": "The long-run average of X. A weighted average, not a prediction.",
    "section": "Probability"
  },
  {
    "symbol": "Var(X)",
    "readAloud": "\"variance of X\"",
    "meaning": "How much X bounces around its expected value.",
    "section": "Probability"
  },
  {
    "symbol": "X ~ Bin(n, p)",
    "readAloud": "\"X is binomial\"",
    "meaning": "Number of successes in n independent trials with success probability p. E(X) = np, Var(X) = np(1−p).",
    "section": "Probability"
  },
  {
    "symbol": "X ~ Pois(λ)",
    "readAloud": "\"X is Poisson\"",
    "meaning": "Count of events in a fixed interval when they occur at average rate λ. E(X) = Var(X) = λ.",
    "section": "Probability"
  },
  {
    "symbol": "X ~ Exp(θ)",
    "readAloud": "\"X is exponential\"",
    "meaning": "Waiting time between Poisson events; mean θ, memoryless.",
    "section": "Probability"
  },
  {
    "symbol": "p(x) vs f(x)",
    "readAloud": "\"p of x / f of x\"",
    "meaning": "Probability *mass* (discrete: a probability at each value) vs probability *density* (continuous: area under the curve is the probability; a single point has probability 0).",
    "section": "Probability"
  },
  {
    "symbol": "continuity correction",
    "readAloud": "",
    "meaning": "Using the normal to approximate the binomial: P(X ≤ 7) becomes P(Y ≤ 7.5).",
    "section": "Probability"
  },
  {
    "symbol": "H₀",
    "readAloud": "\"H-naught\" / \"H-zero\"",
    "meaning": "The null hypothesis: nothing is happening, the effect is zero.",
    "section": "Inference"
  },
  {
    "symbol": "H₁ or Hₐ",
    "readAloud": "\"H-one\" / \"H-alternative\"",
    "meaning": "The claim you are actually interested in.",
    "section": "Inference"
  },
  {
    "symbol": "p",
    "readAloud": "\"p-value\"",
    "meaning": "If H₀ were true, how often would I see data this extreme or worse?",
    "section": "Inference"
  },
  {
    "symbol": "CI",
    "readAloud": "confidence interval",
    "meaning": "A range of plausible values for the parameter.",
    "section": "Inference"
  },
  {
    "symbol": "n",
    "readAloud": "\"n\"",
    "meaning": "Sample size — how many observations.",
    "section": "Inference"
  },
  {
    "symbol": "df",
    "readAloud": "degrees of freedom",
    "meaning": "Roughly, how many independent pieces of information you have.",
    "section": "Inference"
  },
  {
    "symbol": "y",
    "readAloud": "\"y\"",
    "meaning": "The outcome you are predicting.",
    "section": "Regression and models"
  },
  {
    "symbol": "ŷ",
    "readAloud": "\"y-hat\"",
    "meaning": "Your model's prediction of y.",
    "section": "Regression and models"
  },
  {
    "symbol": "X",
    "readAloud": "\"X\" (capital)",
    "meaning": "Your predictors — the whole table of them.",
    "section": "Regression and models"
  },
  {
    "symbol": "β₀",
    "readAloud": "\"beta-naught\"",
    "meaning": "The intercept: predicted y when every predictor is zero.",
    "section": "Regression and models"
  },
  {
    "symbol": "β₁",
    "readAloud": "\"beta-one\"",
    "meaning": "The slope: how much y changes when x₁ goes up by 1, holding the rest fixed.",
    "section": "Regression and models"
  },
  {
    "symbol": "R²",
    "readAloud": "\"R-squared\"",
    "meaning": "Share of the variation in y your model accounts for. 0 to 1.",
    "section": "Regression and models"
  },
  {
    "symbol": "ŷ = β₀ + β₁x + ε",
    "readAloud": "",
    "meaning": "The whole of linear regression, in one line.",
    "section": "Regression and models"
  },
  {
    "symbol": "SSE",
    "readAloud": "\"S-S-E\"",
    "meaning": "Sum of squared errors, Σ(y − ŷ)² — what least squares minimises.",
    "section": "Regression and models"
  },
  {
    "symbol": "s",
    "readAloud": "\"s\" (standard error of the estimate)",
    "meaning": "√(SSE/(n−2)) — the typical size of a residual, in y's units. About 95% of points lie within 2s of the line.",
    "section": "Regression and models"
  },
  {
    "symbol": "r",
    "readAloud": "\"r\"",
    "meaning": "Coefficient of correlation, −1 to 1: strength and direction of a *linear* relationship.",
    "section": "Regression and models"
  },
  {
    "symbol": "R²_adj",
    "readAloud": "\"adjusted R-squared\"",
    "meaning": "R² penalised for the number of predictors; the one to compare models with, because plain R² never falls when a variable is added.",
    "section": "Regression and models"
  },
  {
    "symbol": "k",
    "readAloud": "\"k\"",
    "meaning": "Number of predictors in a multiple regression; the model has k + 1 parameters.",
    "section": "Regression and models"
  },
  {
    "symbol": "F",
    "readAloud": "\"F\"",
    "meaning": "The global test that *all* slopes are zero. Do it before reading any individual t-test.",
    "section": "Regression and models"
  },
  {
    "symbol": "x₁x₂",
    "readAloud": "\"x-one x-two\" (interaction)",
    "meaning": "Lets the slope of x₁ depend on x₂: slope of x₁ = β₁ + β₃x₂.",
    "section": "Regression and models"
  },
  {
    "symbol": "x²",
    "readAloud": "\"x squared\" (quadratic term)",
    "meaning": "Curvature. β₂ < 0 bends downward, β₂ > 0 upward.",
    "section": "Regression and models"
  },
  {
    "symbol": "dummy variable",
    "readAloud": "",
    "meaning": "A 0/1 column standing for one level of a category. A category with c levels needs c − 1 dummies; the omitted level is the base.",
    "section": "Regression and models"
  },
  {
    "symbol": "VIF",
    "readAloud": "\"variance inflation factor\"",
    "meaning": "How much a predictor is explained by the *other* predictors. Above 10 = multicollinearity; the coefficient is unstable.",
    "section": "Regression and models"
  },
  {
    "symbol": "CI for E(y) vs PI",
    "readAloud": "",
    "meaning": "Confidence interval for the mean y at x (narrow) vs prediction interval for one new y at x (much wider).",
    "section": "Regression and models"
  },
  {
    "symbol": "Cook's D",
    "readAloud": "\"Cook's distance\"",
    "meaning": "How much one observation pulls the fitted line. Large → investigate before deciding anything.",
    "section": "Regression and models"
  },
  {
    "symbol": "Accuracy",
    "readAloud": "Fraction correct",
    "meaning": "\"How often am I right?\" — misleading on imbalanced data.",
    "section": "Machine learning evaluation"
  },
  {
    "symbol": "Precision",
    "readAloud": "Of predicted-positive, fraction truly positive",
    "meaning": "\"When I raise an alarm, is it real?\"",
    "section": "Machine learning evaluation"
  },
  {
    "symbol": "Recall / Sensitivity",
    "readAloud": "Of actual positives, fraction caught",
    "meaning": "\"Of the real cases, how many did I catch?\"",
    "section": "Machine learning evaluation"
  },
  {
    "symbol": "Specificity",
    "readAloud": "Of actual negatives, fraction correctly cleared",
    "meaning": "\"Do I leave innocent cases alone?\"",
    "section": "Machine learning evaluation"
  },
  {
    "symbol": "F1",
    "readAloud": "Harmonic mean of precision and recall",
    "meaning": "\"One number balancing the two.\"",
    "section": "Machine learning evaluation"
  },
  {
    "symbol": "ROC / AUC",
    "readAloud": "Performance across every threshold",
    "meaning": "\"How good is the ranking, regardless of cutoff?\"",
    "section": "Machine learning evaluation"
  },
  {
    "symbol": "Confusion matrix",
    "readAloud": "The 2×2 table of TP/FP/FN/TN",
    "meaning": "Everything above is computed from this.",
    "section": "Machine learning evaluation"
  },
  {
    "symbol": "Eᵢ",
    "readAloud": "\"expected count\"",
    "meaning": "In a one-way table, n·pᵢ₀. Every Eᵢ must be ≥ 5 for the χ² approximation to hold.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "Êᵢⱼ",
    "readAloud": "\"expected count in cell i, j\"",
    "meaning": "In a two-way table, (row total × column total)/n — what independence would produce.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "(r − 1)(c − 1)",
    "readAloud": "",
    "meaning": "Degrees of freedom for a test of independence in an r × c table. One-way table: k − 1.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "multinomial",
    "readAloud": "",
    "meaning": "n independent trials, k possible outcomes each — the binomial with more than two categories.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "η",
    "readAloud": "\"eta\"",
    "meaning": "A population median. The sign test's hypothesis is about η, not µ.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "T₁",
    "readAloud": "\"T-one\" (rank sum)",
    "meaning": "Sum of the ranks of sample 1 after pooling and ranking both samples. Wilcoxon rank-sum = Mann–Whitney U.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "T₊, T₋",
    "readAloud": "\"T-plus, T-minus\"",
    "meaning": "In the signed-rank test: sums of the ranks of positive and negative paired differences.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "H",
    "readAloud": "\"H\" (Kruskal–Wallis)",
    "meaning": "12/(n(n+1)) · Σ Rⱼ²/nⱼ − 3(n+1) — rank-based one-way ANOVA. ~ χ²(k−1) when every nⱼ ≥ 5.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "F_r",
    "readAloud": "\"F-r\" (Friedman)",
    "meaning": "Rank-based randomised-block ANOVA: rank within each block, then 12/(bk(k+1)) · Σ Rⱼ² − 3b(k+1).",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "r_s",
    "readAloud": "\"r-sub-s\" (Spearman)",
    "meaning": "Rank correlation: Pearson's r on the ranks. No ties: 1 − 6Σd²/(n(n²−1)). Measures *monotonic* association; robust to outliers.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "Rⱼ",
    "readAloud": "\"R-j\"",
    "meaning": "Rank sum for group (or treatment) j.",
    "section": "Categorical data and nonparametric tests"
  },
  {
    "symbol": "nonparametric",
    "readAloud": "\"distribution-free\"",
    "meaning": "A test that works on ranks or signs and assumes no particular population shape. Less power than the t-test when data really are normal; much safer when they are not.",
    "section": "Categorical data and nonparametric tests"
  }
];
