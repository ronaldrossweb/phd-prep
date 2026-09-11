# 03 · Sampling and the Central Limit Theorem

**Read before Sessions 7–9 · 12 minutes**
**This is the most important file in this folder.**

## The problem

You have one sample. You want the population. You will never see the population.

So: **how wrong is my sample likely to be?** Answer that, and every estimate you report can carry an
honest margin of error. Fail to answer it, and every number you publish is naked.

## The idea that solves it

A sample mean is not a fixed fact. **It is a random quantity**, because a different sample would have
given a different value. So it has its own distribution — called the **sampling distribution** — and
that distribution turns out to be extraordinarily well-behaved.

## The Central Limit Theorem

> For a large enough sample, the distribution of the **sample mean** is approximately normal,
> **regardless of the shape of the population it came from.**

Read that second clause again, because it is what makes the theorem useful. You almost never know
your population's shape. The CLT says **you do not need to.** Whatever it looks like — skewed,
bimodal, spiky — your sample mean behaves normally, and normal distributions are computable.

You will watch this happen in `notebooks/07_clt_and_standard_error.ipynb`, starting from a violently
skewed population. It genuinely looks like a magic trick.

**Where it stops:** the CLT is about sums and averages. It does **not** apply to maxima, minima or
extreme quantiles — those have their own theory. Knowing where a theorem stops is as useful as
knowing that it holds, and it is why tail-risk work cannot borrow ordinary confidence intervals.

## The standard error

The spread of the sampling distribution:

$$SE = \frac{\sigma}{\sqrt{n}}$$

### σ vs SE — read this twice

| | Describes | Does more data shrink it? |
|---|---|---|
| **σ** | how much **individuals** differ | **No. Never.** |
| **SE** | how much your **estimate** would differ | **Yes**, like `1/√n` |

More data does not make customers more alike — the world is exactly as variable as it was. More data
makes your **estimate more reliable**.

Confusing these two is the most common error in applied statistics. It shows up as reports claiming a
population became more homogeneous when in fact only the estimate got sharper.

### `√n` is a harsh master

To **halve** your standard error you must **quadruple** your sample. 64× the data buys an 8×
improvement.

This is why "just collect more data" stops being good advice early, and why study *design* matters
more than raw volume. It is also, run in reverse, the most practical calculation in the course: solve
`σ/√n = (target precision)` to find the sample size you need **before** you collect anything.

## Where "95%" comes from

Sample means are normal, so the 68/95/99.7 rule applies to them: about 95% land within `1.96 × SE` of
the truth. Turn that around and you have the confidence interval:

$$\bar{x} \pm 1.96 \times SE$$

**What "95% confident" actually means:** the *procedure* captures the true value in 95% of
repetitions. It is a property of the method across many samples — **not** a probability statement
about the one interval in front of you. That interval either contains `µ` or it does not.

## What to carry into the notebooks

- A sample mean is itself random, and has a distribution.
- **CLT:** sample means go normal whatever the population looks like — but not maxima.
- `SE = σ/√n`. Halving it costs 4× the data.
- **σ = spread of individuals. SE = reliability of an estimate.**
- "95% confidence" describes the procedure, not your interval.
