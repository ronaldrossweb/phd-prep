"""Tiny helper: build .ipynb files from (kind, source) tuples."""
import nbformat as nbf
from pathlib import Path

OUT = Path(__file__).parent

def md(s):   return ("md", s)
def code(s): return ("code", s)
def sol(s):  return ("sol", s)   # code cell, source hidden by default

def build(filename, title, cells):
    nb = nbf.v4.new_notebook()
    out = []
    for kind, src in cells:
        src = src.strip("\n")
        if kind == "md":
            out.append(nbf.v4.new_markdown_cell(src))
        elif kind == "code":
            out.append(nbf.v4.new_code_cell(src))
        elif kind == "sol":
            c = nbf.v4.new_code_cell(src)
            c.metadata = {"jupyter": {"source_hidden": True},
                          "tags": ["solution"]}
            out.append(c)
    nb.cells = out
    nb.metadata = {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.13.0"},
    }
    p = OUT / filename
    nbf.write(nb, p)
    print(f"wrote {filename}  ({len(out)} cells)")
    return p

PRELUDE = """
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

sns.set_theme(style="whitegrid")
DATA = Path.cwd() / "data" if (Path.cwd() / "data").exists() else Path.cwd().parent / "data"
rng = np.random.default_rng(42)   # same seed => same numbers every time you run this
"""
