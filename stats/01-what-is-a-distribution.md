# 01 · What Is a Distribution?

**Read before Session 1–3 · 10 minutes**

## The one-sentence answer

A distribution is the answer to: **"which values occur, and how often?"**

That is all. Every named distribution — normal, log-normal, binomial, Poisson — is a *particular*
answer to that question, arising from a particular generating process.

## Why this is the foundational concept

Almost everything else in PhDAI 730 is an operation on distributions:

- A **summary statistic** compresses a distribution to one number.
- **Sampling** draws from a distribution.
- **Inference** reasons about a distribution you cannot see, using one you can.
- A **model** predicts the distribution of an outcome given inputs.
- **Fairness metrics** compare distributions across groups.

If "distribution" stays vague, all of that stays vague. If it becomes concrete, the rest follows.

## The three questions

Any distribution is described by three things, and this is the template for describing any variable
in any dataset:

1. **Shape** — symmetric, right-skewed, left-skewed, bimodal, flat?
2. **Center** — mean, median, mode. Where is the middle?
3. **Spread** — standard deviation, IQR, range. How much variation?

> "Account balances are strongly right-skewed, with a median of $3,900 and a long upper tail."

Shape, center, spread. That sentence is a complete description, and you can write it for anything.

## The habit that matters most

**Plot it before you summarise it.**

A number can hide a shape. A mean of 52 can describe a distribution where almost nothing is near 52 —
because the data has two humps at 35 and 70. `describe()` will not warn you. A histogram shows it
instantly.

This is the single most valuable working habit in the course, and it costs one line of code.

## Population vs sample — the distinction the whole field rests on

| | Notation | What it is |
|---|---|---|
| **Population** | `µ`, `σ` | Every unit you care about. Usually unobservable. |
| **Sample** | `x̄`, `s` | The rows you actually have. |

You always have the sample. You always want the population. **Statistics is the discipline of
reasoning across that gap** — and once you see that, the purpose of standard errors, confidence
intervals and hypothesis tests becomes obvious rather than arbitrary. They are all tools for
quantifying how far your `x̄` might be from the true `µ`.

## What to carry into the notebooks

- A distribution is "which values, how often."
- Describe anything with shape, center, spread.
- Plot first. Always.
- You have `x̄`; you want `µ`; the gap is the whole subject.
