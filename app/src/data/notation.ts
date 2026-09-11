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
  }
];
