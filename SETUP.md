# Setup

Everything is already installed and verified. This file is here so you can repair it if something
breaks, not so you can follow it now.

## Start a study session

```bash
cd ~/PhD && ./.venv/bin/jupyter lab
```

That opens JupyterLab in your browser. Click into `notebooks/` and open the notebook for today's
session (the roadmap says which). Press **Shift+Enter** to run a cell.

To stop it: `Ctrl+C` twice in the terminal.

## What is installed

A dedicated virtual environment at `~/PhD/.venv`, running **Python 3.13.0**:

| Package | Version | For |
|---|---|---|
| numpy | 2.5.3 | arrays, random numbers |
| pandas | 3.0.5 | dataframes |
| matplotlib | 3.11.1 | plotting |
| seaborn | 0.13.2 | nicer plots |
| scipy | 1.18.1 | statistical tests |
| statsmodels | 0.15.0 | regression with proper output tables |
| scikit-learn | 1.9.1 | machine learning |
| jupyterlab | 4.6.3 | the notebook interface |

### Why a virtual environment

Your Mac has **four** different `python3` installations (Homebrew, python.org, Xcode command-line
tools, and `/usr/local`). Installing packages globally means never being sure which Python is being
used, and it is the most common reason a notebook mysteriously stops importing something.

`~/PhD/.venv` is one isolated Python that only this coursework uses. Always invoke it by its full
path — `./.venv/bin/python`, `./.venv/bin/jupyter` — never a bare `python3`.

## Verify everything still works

```bash
cd ~/PhD && ./.venv/bin/python -c "import numpy,pandas,matplotlib,scipy,statsmodels,sklearn,seaborn; print('all good')"
```

## Regenerate the datasets

The CSVs in `notebooks/data/` are synthetic and generated locally, so no notebook needs an internet
connection. If you ever delete or corrupt them:

```bash
cd ~/PhD && ./.venv/bin/python notebooks/make_data.py
```

The generator is seeded, so you get byte-identical data back and every number in the notebooks still
matches.

## If a notebook misbehaves

1. **Restart the kernel and run from the top.** Menu: *Kernel → Restart Kernel and Run All Cells*.
   Cells share memory in order, so running them out of sequence is the usual culprit.
2. **Check you are in `~/PhD`** when you launch, or `DATA` will not resolve.
3. Solutions are hidden, not absent — click the three dots or the collapsed bar under an exercise.

## Reinstall from scratch

```bash
rm -rf ~/PhD/.venv
/Library/Frameworks/Python.framework/Versions/3.13/bin/python3 -m venv ~/PhD/.venv
~/PhD/.venv/bin/python -m pip install --upgrade pip
~/PhD/.venv/bin/python -m pip install jupyterlab matplotlib scipy statsmodels scikit-learn seaborn pandas numpy
```

## A note for when the term starts

Your courses may require specific package versions or a different environment (some instructors
standardise on Anaconda or Google Colab). If so, **use theirs for coursework** and keep this
environment for your own practice. Do not try to make one environment serve both — version conflicts
mid-term are exactly the kind of friction this whole setup exists to avoid.
