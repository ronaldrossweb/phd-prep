"""Generate every dataset the notebooks use, locally and deterministically.

No network required. Run once:  ~/PhD/.venv/bin/python ~/PhD/notebooks/make_data.py
"""
import numpy as np
import pandas as pd
from pathlib import Path

OUT = Path(__file__).parent / "data"
OUT.mkdir(exist_ok=True)
rng = np.random.default_rng(20261019)  # term start date as seed

# ---------------------------------------------------------------- branch deposits
# Deliberately right-skewed: the mean and median disagree, which is the lesson.
n = 1200
balance = np.concatenate([
    rng.lognormal(mean=8.2, sigma=0.9, size=n - 40),
    rng.uniform(250_000, 900_000, size=40),          # a few private-banking clients
])
rng.shuffle(balance)
deposits = pd.DataFrame({
    "account_id": [f"AC{i:05d}" for i in range(n)],
    "branch": rng.choice(["Ogden", "Provo", "Logan", "St. George"], n, p=[.35, .30, .20, .15]),
    "product": rng.choice(["Checking", "Savings", "CD"], n, p=[.5, .35, .15]),
    "balance": balance.round(2),
    "tenure_years": rng.gamma(2.0, 3.0, n).round(1),
})
deposits.to_csv(OUT / "branch_deposits.csv", index=False)

# ---------------------------------------------------------------- lending / default
# Imbalanced (~8% default) so "accuracy" is visibly useless, and carries a protected
# attribute with HISTORICAL bias baked in, so the fairness lesson is demonstrable.
m = 4000
group = rng.choice(["A", "B"], m, p=[0.72, 0.28])
# Group B has systematically lower recorded income & credit score -- not because of
# creditworthiness, but because the historical data generating process was unequal.
income = np.where(group == "A", rng.normal(86_000, 24_000, m), rng.normal(61_000, 19_000, m))
income = np.clip(income, 22_000, None)
credit = np.where(group == "A", rng.normal(716, 62, m), rng.normal(668, 68, m))
credit = np.clip(credit, 480, 850)
loan = np.clip(rng.normal(0.32, 0.12, m) * income, 4_000, None)
dti = np.clip(loan / income + rng.normal(0, 0.04, m), 0.03, 1.4)
emp = np.clip(rng.gamma(2.2, 3.1, m), 0, 40)

# True default risk depends on DTI, credit, employment -- NOT directly on group.
logit = -3.05 + 3.4 * dti - 0.011 * (credit - 680) - 0.055 * emp
p_default = 1 / (1 + np.exp(-logit))
default = rng.binomial(1, p_default)

lending = pd.DataFrame({
    "loan_id": [f"LN{i:06d}" for i in range(m)],
    "applicant_group": group,
    "annual_income": income.round(0),
    "loan_amount": loan.round(0),
    "dti_ratio": dti.round(4),
    "credit_score": credit.round(0).astype(int),
    "employment_years": emp.round(1),
    "region": rng.choice(["North", "Central", "South"], m, p=[.4, .38, .22]),
    "defaulted": default,
})
lending.to_csv(OUT / "lending.csv", index=False)

# ---------------------------------------------------------------- fraud alerts
# For the base-rate / Bayes session: rare event, good-but-not-perfect detector.
k = 50_000
is_fraud = rng.binomial(1, 0.003, k)                      # 0.3% base rate
sens, spec = 0.96, 0.97                                   # 96% recall, 97% specificity
alert = np.where(is_fraud == 1,
                 rng.binomial(1, sens, k),
                 rng.binomial(1, 1 - spec, k))
pd.DataFrame({
    "txn_id": [f"TX{i:07d}" for i in range(k)],
    "amount": (rng.lognormal(4.0, 1.1, k)).round(2),
    "is_fraud": is_fraud,
    "model_alert": alert,
}).to_csv(OUT / "fraud_alerts.csv", index=False)

# ---------------------------------------------------------------- A/B test
# For hypothesis testing: a real but small effect.
a = rng.normal(0.0, 1.0, 300) + 4.40
b = rng.normal(0.0, 1.0, 300) + 4.62
pd.DataFrame({
    "variant": np.repeat(["control", "treatment"], 300),
    "satisfaction": np.concatenate([a, b]).round(3),
}).to_csv(OUT / "ab_test.csv", index=False)

for f in sorted(OUT.glob("*.csv")):
    print(f"{f.name:24s} {len(pd.read_csv(f)):>6,} rows")
