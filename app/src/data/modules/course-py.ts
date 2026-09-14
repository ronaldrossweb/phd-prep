import type { Module } from "../modules";

/* ============================================================================
   PYTHON — Udayan Das, Introduction to Python Programming (OpenStax, free).
   Chapters as assigned by the syllabus. Language fundamentals, checked live.
   ========================================================================= */
const PY = `import math`;

export const COURSE_PY: Module[] = [
  {
    id: "py-basics",
    session: 1, track: "stats", minutes: 35, setup: PY,
    title: "Python basics and expressions (Das ch 1–2)",
    summary: "Variables, types, arithmetic, integer division, floating-point surprises, the math module, and f-strings — the ground floor every assignment stands on.",
    reading: {
      keyIdea: "Python evaluates expressions left to right with the usual precedence; `/` always gives a float, `//` floors, `%` gives the remainder, and floating-point arithmetic is approximate — so compare floats with a tolerance, never with `==`.",
      body: [
        "**Variables and types.** `x = 7` binds a name to an `int`; `y = 7.0` is a `float`; `s = \"7\"` is a `str`. `type(x)` tells you which. Convert with `int(\"7\")`, `float(\"7.5\")`, `str(7)` — converting `\"7.5\"` with `int()` raises `ValueError`.",
        "**Arithmetic.** `7 / 2` is `3.5`; `7 // 2` is `3`; `7 % 2` is `1`; `2 ** 10` is `1024`. Mixed `int` and `float` produce `float`. `0.1 + 0.2 == 0.3` is **False** — use `math.isclose(a, b)`.",
        "**The math module.** `import math` then `math.sqrt`, `math.log`, `math.exp`, `math.comb`, `math.pi`. `round(x, 2)` rounds to 2 decimals; note that `round(2.5)` is `2` (banker's rounding).",
        "**f-strings.** `f\"{value:.2f}\"` formats to two decimals; `f\"{n:,}\"` inserts thousands separators; `f\"{p:.1%}\"` formats a proportion as a percentage. You will use these in every printed answer.",
        "**Style the course expects.** Descriptive names in `snake_case`, four-space indentation, one statement per line, a comment where the *why* is not obvious. Assignments are graded partly on presentation.",
      ],
    },
    exercises: [
      {
        id: "types", title: "Types and conversions",
        prompt: "Given the strings `a = \"12\"` and `b = \"3.5\"`, compute `total = int(a) + float(b)`, `quotient = int(a) // 4`, and `remainder = int(a) % 5`. Store `kind = type(total).__name__`.",
        starter: `a = "12"
b = "3.5"
total = ...
quotient = ...
remainder = ...
kind = type(total).__name__
print(total, quotient, remainder, kind)
`,
        check: `assert total == 15.5 and kind == "float", "int + float gives a float"
assert quotient == 3 and remainder == 2`,
        solution: `a = "12"
b = "3.5"
total = int(a) + float(b)
quotient = int(a) // 4
remainder = int(a) % 5
kind = type(total).__name__
print(total, quotient, remainder, kind)
`,
      },
      {
        id: "floats", title: "Floating point is approximate",
        prompt: "Set `naive = (0.1 + 0.2 == 0.3)` and `careful = math.isclose(0.1 + 0.2, 0.3)`. Then compute the monthly payment on a $250,000 loan at 6% APR over 30 years with the amortisation formula, stored in `payment`, and format it as currency in `label`.",
        starter: `naive = (0.1 + 0.2 == 0.3)
careful = math.isclose(0.1 + 0.2, 0.3)
P, r, n = 250_000, 0.06 / 12, 30 * 12
payment = P * r * (1 + r)**n / ((1 + r)**n - 1)
label = ...
print(naive, careful, label)
`,
        check: `assert naive is False and careful is True
assert abs(payment - 1498.88) < 0.05
assert label == f"\${payment:,.2f}", "Format with f'\${payment:,.2f}'"`,
        solution: `naive = (0.1 + 0.2 == 0.3)
careful = math.isclose(0.1 + 0.2, 0.3)
P, r, n = 250_000, 0.06 / 12, 30 * 12
payment = P * r * (1 + r)**n / ((1 + r)**n - 1)
label = f"\${payment:,.2f}"
print(naive, careful, label)
`,
      },
    ],
    quiz: [
      { id: "q1", q: "`7 // 2` evaluates to…", choices: ["3.5", "3", "4", "1"], answer: 1, why: "Floor division. `/` would give 3.5." },
      { id: "q2", q: "`0.1 + 0.2 == 0.3` is…", choices: ["True", "False", "An error", "Undefined"], answer: 1, why: "Binary floating point cannot represent 0.1 exactly. Compare with `math.isclose`." },
      { id: "q3", q: "`f\"{0.0725:.1%}\"` produces…", choices: ["0.0725%", "7.3%", "7.25", "0.1%"], answer: 1, why: "`%` multiplies by 100 and appends the sign; `.1` keeps one decimal." },
      { id: "q4", q: "`int(\"7.5\")` …", choices: ["Returns 7", "Returns 8", "Raises ValueError", "Returns 7.5"], answer: 2, why: "`int()` parses integer strings only; use `int(float(\"7.5\"))` to truncate." },
    ],
  },

  {
    id: "py-functions",
    session: 2, track: "stats", minutes: 40, setup: PY,
    title: "Functions (Das ch 6)",
    summary: "Define, call, return, and parameterise. Scope, default and keyword arguments, and the habit of writing a function for anything you will do twice.",
    video: {
      youtubeId: "9Os0o3wzS_I", title: "Python Tutorial for Beginners 8: Functions", channel: "Corey Schafer", minutes: 21,
      watchFor: [
        "`def` creates the function; nothing runs until you *call* it.",
        "`return` hands a value back; a function without `return` gives `None`.",
        "Positional vs keyword arguments, and default values.",
      ],
    },
    reading: {
      keyIdea: "A function packages a computation behind a name: inputs in, one result out. Variables created inside are local and vanish when it returns. Anything you would otherwise copy-paste belongs in a function.",
      body: [
        "```python\ndef monthly_payment(principal, annual_rate, years=30):\n    r = annual_rate / 12\n    n = years * 12\n    return principal * r * (1 + r)**n / ((1 + r)**n - 1)\n\nmonthly_payment(250_000, 0.06)            # positional, default years\nmonthly_payment(250_000, 0.06, years=15)  # keyword argument\n```",
        "**Scope.** `r` and `n` above exist only inside the function. A function can *read* a global variable but assigning to a name creates a new local one — a classic source of confusion.",
        "**Return values.** One `return` ends the function. Return a tuple to hand back several values: `return mean, sd` — then `m, s = summarise(data)`.",
        "**Docstrings.** A triple-quoted string as the first line documents the function; `help(monthly_payment)` shows it. Assignments in this course expect them.",
      ],
    },
    exercises: [
      {
        id: "define", title: "Write a function with a default",
        prompt: "Define `z_score(x, mean, sd)` returning `(x − mean)/sd`, and `is_outlier(x, mean, sd, threshold=3)` returning `True` when `|z| > threshold`. Test on the given values.",
        starter: `def z_score(x, mean, sd):
    return (x - mean) / sd

def is_outlier(x, mean, sd, threshold=3):
    ...

print(z_score(820, 700, 60), is_outlier(820, 700, 60), is_outlier(820, 700, 60, threshold=1.5))
`,
        check: `assert abs(z_score(820, 700, 60) - 2.0) < 1e-9
assert is_outlier(820, 700, 60) is False and is_outlier(820, 700, 60, threshold=1.5) is True`,
        solution: `def z_score(x, mean, sd):
    return (x - mean) / sd

def is_outlier(x, mean, sd, threshold=3):
    return abs(z_score(x, mean, sd)) > threshold

print(z_score(820, 700, 60), is_outlier(820, 700, 60), is_outlier(820, 700, 60, threshold=1.5))
`,
      },
      {
        id: "multi", title: "Return several values",
        prompt: "Write `summarise(values)` that returns the mean, the sample standard deviation (divide by n−1), and the count, as a tuple — using only plain Python (no numpy). Unpack it into `m, s, n`.",
        starter: `def summarise(values):
    n = len(values)
    mean = sum(values) / n
    sd = ...
    return mean, sd, n

m, s, n = summarise([4, 8, 15, 16, 23, 42])
print(round(m, 3), round(s, 3), n)
`,
        check: `assert n == 6 and abs(m - 18) < 1e-9
assert abs(s - 13.4907) < 1e-3, "Sample sd: sqrt(Σ(x−mean)² / (n−1))"`,
        solution: `def summarise(values):
    n = len(values)
    mean = sum(values) / n
    sd = math.sqrt(sum((v - mean)**2 for v in values) / (n - 1))
    return mean, sd, n

m, s, n = summarise([4, 8, 15, 16, 23, 42])
print(round(m, 3), round(s, 3), n)
`,
        hint: "`sum((v - mean)**2 for v in values)` then divide by `n - 1` and take `math.sqrt`.",
      },
    ],
    quiz: [
      { id: "q1", q: "A function with no `return` statement returns…", choices: ["0", "An empty string", "`None`", "An error"], answer: 2, why: "Every function returns something; without `return` it is `None`." },
      { id: "q2", q: "In `def f(a, b=2)`, `b` is…", choices: ["Required", "A default (keyword) parameter", "A global", "A return value"], answer: 1, why: "Callers may omit it; it takes the value 2." },
      { id: "q3", q: "Assigning `total = 0` inside a function…", choices: ["Changes the global `total`", "Creates a local `total`", "Is an error", "Deletes `total`"], answer: 1, why: "Assignment creates a local name unless declared `global`." },
      { id: "q4", q: "`return mean, sd` returns…", choices: ["Only `mean`", "A tuple of two values", "An error", "A list"], answer: 1, why: "Comma-separated values form a tuple; unpack with `m, s = f()`." },
    ],
  },

  {
    id: "py-lists-dicts",
    session: 3, track: "stats", minutes: 45, setup: PY,
    title: "Lists and dictionaries (Das ch 9–10)",
    summary: "The two containers you will use in every assignment: ordered lists (slicing, sorting, comprehensions) and key–value dictionaries (counting, grouping, nesting).",
    video: {
      youtubeId: "W8KRzm-HUcc", title: "Python Tutorial for Beginners 4: Lists, Tuples, and Sets", channel: "Corey Schafer", minutes: 29,
      watchFor: [
        "Indexing starts at 0 and negative indices count from the end.",
        "Slicing `a[1:4]` stops *before* index 4.",
        "`sorted(a)` returns a new list; `a.sort()` changes `a` in place and returns `None`.",
      ],
    },
    reading: {
      keyIdea: "A list is an ordered, mutable sequence; a dictionary maps keys to values. Comprehensions build either in one readable line. Counting and grouping by key is the single most common assignment pattern.",
      body: [
        "**Lists.** `scores = [640, 720, 585, 810]`; `scores[0]` → 640; `scores[-1]` → 810; `scores[1:3]` → `[720, 585]`. `append`, `extend`, `insert`, `remove`, `pop`. `len`, `sum`, `min`, `max`, `sorted`. **Comprehension:** `[s for s in scores if s >= 700]`.",
        "**Dictionaries.** `by_branch = {\"Provo\": 12, \"Ogden\": 9}`; `by_branch[\"Provo\"]` → 12; `by_branch.get(\"Lehi\", 0)` → 0 with a default; `.keys()`, `.values()`, `.items()`. Iterate with `for k, v in d.items():`. **Counting pattern:** `counts[key] = counts.get(key, 0) + 1`.",
        "**Nested structures.** A list of dicts (`[{\"id\": 1, \"score\": 640}, …]`) is how records arrive; a dict of lists groups them. `sorted(records, key=lambda r: r[\"score\"])` sorts by a field.",
        "**Mutability trap.** `b = a` does not copy a list — both names point to the same object. Use `a.copy()` or `a[:]` when you need an independent copy.",
      ],
    },
    exercises: [
      {
        id: "listops", title: "Slice, filter, sort",
        prompt: "From `scores`, build `top3` (the three highest, descending), `passing` (a comprehension of scores ≥ 660), and `mean_score` using plain Python.",
        starter: `scores = [640, 720, 585, 810, 655, 698, 770, 612]
top3 = sorted(scores, reverse=True)[:3]
passing = ...
mean_score = ...
print(top3, passing, round(mean_score, 1))
`,
        check: `assert top3 == [810, 770, 720]
assert passing == [720, 810, 698, 770], "Keep the original order; include exactly the scores >= 660"
assert abs(mean_score - sum(scores)/len(scores)) < 1e-9`,
        solution: `scores = [640, 720, 585, 810, 655, 698, 770, 612]
top3 = sorted(scores, reverse=True)[:3]
passing = [s for s in scores if s >= 660]
mean_score = sum(scores) / len(scores)
print(top3, passing, round(mean_score, 1))
`,
      },
      {
        id: "counting", title: "Count and group with a dictionary",
        prompt: "Given `loans` (a list of dicts), build `count_by_region` (region → number of loans) and `defaults_by_region` (region → number that defaulted), then `rate_by_region` (region → default rate rounded to 3 dp).",
        starter: `loans = [
    {"region": "North", "defaulted": 0}, {"region": "South", "defaulted": 1},
    {"region": "North", "defaulted": 1}, {"region": "Central", "defaulted": 0},
    {"region": "South", "defaulted": 1}, {"region": "North", "defaulted": 0},
    {"region": "Central", "defaulted": 0}, {"region": "South", "defaulted": 0},
]
count_by_region = {}
defaults_by_region = {}
for loan in loans:
    r = loan["region"]
    count_by_region[r] = count_by_region.get(r, 0) + 1
    defaults_by_region[r] = ...
rate_by_region = {r: round(defaults_by_region[r] / count_by_region[r], 3) for r in count_by_region}
print(count_by_region, defaults_by_region, rate_by_region)
`,
        check: `assert count_by_region == {"North": 3, "South": 3, "Central": 2}
assert defaults_by_region == {"North": 1, "South": 2, "Central": 0}
assert rate_by_region["South"] == 0.667`,
        solution: `loans = [
    {"region": "North", "defaulted": 0}, {"region": "South", "defaulted": 1},
    {"region": "North", "defaulted": 1}, {"region": "Central", "defaulted": 0},
    {"region": "South", "defaulted": 1}, {"region": "North", "defaulted": 0},
    {"region": "Central", "defaulted": 0}, {"region": "South", "defaulted": 0},
]
count_by_region = {}
defaults_by_region = {}
for loan in loans:
    r = loan["region"]
    count_by_region[r] = count_by_region.get(r, 0) + 1
    defaults_by_region[r] = defaults_by_region.get(r, 0) + loan["defaulted"]
rate_by_region = {r: round(defaults_by_region[r] / count_by_region[r], 3) for r in count_by_region}
print(count_by_region, defaults_by_region, rate_by_region)
`,
        hint: "Same `.get(r, 0) + …` pattern as the count, adding `loan[\"defaulted\"]` instead of 1.",
      },
    ],
    quiz: [
      { id: "q1", q: "`[1, 2, 3, 4, 5][1:3]` is…", choices: ["[1, 2, 3]", "[2, 3]", "[2, 3, 4]", "[1, 2]"], answer: 1, why: "Start inclusive, stop exclusive." },
      { id: "q2", q: "`a.sort()` returns…", choices: ["The sorted list", "`None` — it sorts in place", "A copy", "An error"], answer: 1, why: "`sorted(a)` returns a new list; `a.sort()` mutates and returns None. A classic bug is `a = a.sort()`." },
      { id: "q3", q: "`d.get(\"Lehi\", 0)` …", choices: ["Raises KeyError if missing", "Returns 0 if the key is missing", "Deletes the key", "Adds the key with value 0"], answer: 1, why: "`get` with a default never raises; it does not insert the key." },
      { id: "q4", q: "After `b = a` for a list `a`, appending to `b`…", choices: ["Leaves `a` unchanged", "Also changes `a` — they are the same object", "Raises an error", "Copies `a` first"], answer: 1, why: "Assignment binds another name to the same list. Use `a.copy()` for an independent copy." },
    ],
  },

  {
    id: "py-classes",
    session: 6, track: "stats", minutes: 40, setup: PY,
    title: "Classes and objects (Das ch 11)",
    summary: "Bundle data and behaviour: `__init__`, instance attributes and methods, `__str__`, and operator overloading — enough to read and write the object-oriented code assignments will ask for.",
    video: {
      youtubeId: "ZDa-Z5JzLYM", title: "Python OOP Tutorial 1: Classes and Instances", channel: "Corey Schafer", minutes: 16,
      watchFor: [
        "A class is a blueprint; an instance is one object built from it.",
        "`self` is the instance the method is acting on — Python passes it automatically.",
        "`__init__` runs once per new instance to set up its attributes.",
      ],
    },
    reading: {
      keyIdea: "A class groups the data an object holds (attributes, set in `__init__`) with the operations on it (methods, which take `self` first). `__str__` controls how it prints; `__lt__`, `__add__` and friends let your objects use operators.",
      body: [
        "```python\nclass Loan:\n    def __init__(self, principal, annual_rate, years):\n        self.principal = principal\n        self.annual_rate = annual_rate\n        self.years = years\n\n    def monthly_payment(self):\n        r = self.annual_rate / 12\n        n = self.years * 12\n        return self.principal * r * (1 + r)**n / ((1 + r)**n - 1)\n\n    def __str__(self):\n        return f\"Loan(\${self.principal:,.0f} at {self.annual_rate:.1%} for {self.years}y)\"\n\nloan = Loan(250_000, 0.06, 30)\nprint(loan, round(loan.monthly_payment(), 2))\n```",
        "**Attributes vs methods.** `loan.principal` is data; `loan.monthly_payment()` is behaviour (note the parentheses). Methods can call other methods via `self`.",
        "**Operator overloading.** Define `__lt__(self, other)` and `sorted(loans)` works; define `__eq__` for `==`; `__repr__` for the debugging representation.",
        "**Class attributes** are shared by all instances (`Loan.count = 0`); instance attributes belong to one object. Assignments in ch 11 usually ask for a small class with two or three methods and a `__str__`.",
      ],
    },
    exercises: [
      {
        id: "class", title: "Build a small class",
        prompt: "Complete `Account` with a `deposit(amount)` method, a `withdraw(amount)` method that refuses to overdraw (returns `False` and leaves the balance unchanged), and `__str__` returning `\"Account <owner>: $<balance:,.2f>\"`.",
        starter: `class Account:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return True

    def withdraw(self, amount):
        ...

    def __str__(self):
        ...

acct = Account("Ronald", 100)
acct.deposit(50)
ok = acct.withdraw(500)
print(acct, ok, acct.withdraw(30), acct.balance)
`,
        check: `a = Account("Test", 100); a.deposit(50)
assert a.withdraw(500) is False and a.balance == 150, "Refuse to overdraw; balance unchanged"
assert a.withdraw(30) is True and a.balance == 120
assert str(a) == "Account Test: $120.00", f"__str__ gave {str(a)!r}"`,
        solution: `class Account:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return True

    def withdraw(self, amount):
        if amount > self.balance:
            return False
        self.balance -= amount
        return True

    def __str__(self):
        return f"Account {self.owner}: \${self.balance:,.2f}"

acct = Account("Ronald", 100)
acct.deposit(50)
ok = acct.withdraw(500)
`,
      },
      {
        id: "sortable", title: "Make objects sortable",
        prompt: "Add `__lt__` to `Applicant` so that `sorted(applicants)` orders by `score` ascending, and store the highest-scoring applicant's name in `best`.",
        starter: `class Applicant:
    def __init__(self, name, score):
        self.name = name
        self.score = score
    def __lt__(self, other):
        ...

applicants = [Applicant("Ana", 712), Applicant("Ben", 655), Applicant("Cy", 790)]
best = sorted(applicants)[-1].name
print(best)
`,
        check: `assert best == "Cy"
assert [a.name for a in sorted(applicants)] == ["Ben", "Ana", "Cy"]`,
        solution: `class Applicant:
    def __init__(self, name, score):
        self.name = name
        self.score = score
    def __lt__(self, other):
        return self.score < other.score

applicants = [Applicant("Ana", 712), Applicant("Ben", 655), Applicant("Cy", 790)]
best = sorted(applicants)[-1].name
print(best)
`,
      },
    ],
    quiz: [
      { id: "q1", q: "`self` in a method is…", choices: ["The class", "The instance the method is called on", "A keyword", "Optional"], answer: 1, why: "Python passes the instance automatically as the first argument." },
      { id: "q2", q: "`__init__` …", choices: ["Returns the object", "Runs once when an instance is created, to set attributes", "Is optional and rarely used", "Prints the object"], answer: 1, why: "The initialiser. `return` is not used in it." },
      { id: "q3", q: "To make `print(obj)` readable, define…", choices: ["`__print__`", "`__str__`", "`__init__`", "`show`"], answer: 1, why: "`__str__` returns the display string." },
      { id: "q4", q: "`sorted(objects)` works when the class defines…", choices: ["`__len__`", "`__lt__`", "`__init__`", "`sort`"], answer: 1, why: "Sorting compares with `<`, which `__lt__` implements." },
    ],
  },

  {
    id: "py-recursion",
    session: 0, track: "stats", minutes: 35, setup: PY,
    title: "Recursion (Das ch 12)",
    summary: "A function that calls itself: base case, recursive case, and why factorials, sums, and binary search are the textbook examples.",
    reading: {
      keyIdea: "Every recursive function has a base case that returns without recursing and a recursive case that makes the problem smaller. Forget the base case and it never stops; forget to shrink the problem and it never finishes.",
      body: [
        "```python\ndef factorial(n):\n    if n <= 1:          # base case\n        return 1\n    return n * factorial(n - 1)   # recursive case: smaller n\n```",
        "**Trace it.** `factorial(4)` → `4 * factorial(3)` → `4 * 3 * factorial(2)` → `4 * 3 * 2 * factorial(1)` → `4 * 3 * 2 * 1`. Each call waits on the next; the stack unwinds from the base case.",
        "**Recursion on lists and strings.** Sum of a list: `0` if empty, else `first + sum_of(rest)`. Reverse a string: `\"\"` if empty, else `reverse(s[1:]) + s[0]`. Binary search: compare to the middle, recurse into one half.",
        "**When to use it.** Recursion is the natural fit for tree- and divide-and-conquer problems; for plain loops over a list, a `for` loop is clearer and does not risk the recursion limit (~1,000 deep by default).",
      ],
    },
    exercises: [
      {
        id: "sumlist", title: "Recursive sum and a base case",
        prompt: "Write `sum_of(values)` recursively: return 0 for an empty list, else the first value plus the sum of the rest. Then `count_digits(n)` recursively for a non-negative integer.",
        starter: `def sum_of(values):
    if not values:
        return 0
    return ...

def count_digits(n):
    if n < 10:
        return 1
    return ...

print(sum_of([3, 1, 4, 1, 5, 9, 2, 6]), count_digits(2026), count_digits(7))
`,
        check: `assert sum_of([3, 1, 4, 1, 5, 9, 2, 6]) == 31 and sum_of([]) == 0
assert count_digits(2026) == 4 and count_digits(7) == 1 and count_digits(100000) == 6`,
        solution: `def sum_of(values):
    if not values:
        return 0
    return values[0] + sum_of(values[1:])

def count_digits(n):
    if n < 10:
        return 1
    return 1 + count_digits(n // 10)`,
      },
      {
        id: "binsearch", title: "Binary search",
        prompt: "Complete `find(sorted_list, target, lo, hi)` returning the index of `target` or `-1`, recursing into the correct half.",
        starter: `def find(a, target, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if a[mid] == target:
        return mid
    if a[mid] < target:
        return ...
    return ...

data = [585, 612, 640, 655, 698, 720, 770, 810]
print(find(data, 698), find(data, 700), find(data, 585))
`,
        check: `assert find(data, 698) == 4 and find(data, 700) == -1 and find(data, 585) == 0 and find(data, 810) == 7`,
        solution: `def find(a, target, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if a[mid] == target:
        return mid
    if a[mid] < target:
        return find(a, target, mid + 1, hi)
    return find(a, target, lo, mid - 1)

data = [585, 612, 640, 655, 698, 720, 770, 810]
`,
      },
    ],
    quiz: [
      { id: "q1", q: "A recursive function without a base case…", choices: ["Returns None", "Recurses until Python raises RecursionError", "Returns 0", "Runs once"], answer: 1, why: "Nothing stops it; Python's default limit (~1000 frames) triggers an error." },
      { id: "q2", q: "`factorial(4)` makes how many calls in total (including the first)?", choices: ["3", "4", "5", "24"], answer: 1, why: "factorial(4), (3), (2), (1) — four calls; the base case at 1 stops it." },
      { id: "q3", q: "Binary search on a sorted list of 1,000 items needs at most about…", choices: ["1,000 comparisons", "500", "10", "2"], answer: 2, why: "Each step halves the range: log₂(1000) ≈ 10." },
      { id: "q4", q: "The recursive case must…", choices: ["Return None", "Call the function on a smaller problem", "Use a loop", "Print the result"], answer: 1, why: "Progress toward the base case is what guarantees termination." },
    ],
  },

  {
    id: "py-data-science",
    session: 9, track: "stats", minutes: 40, setup: `import numpy as np, pandas as pd
import matplotlib.pyplot as plt`,
    title: "The data-science chapter (Das ch 15)",
    summary: "NumPy arrays, pandas DataFrames, exploratory data analysis and plotting — the chapter that connects the language to the statistics course.",
    video: {
      youtubeId: "vmEHCJofslg", title: "Complete Python Pandas Data Science Tutorial", channel: "Keith Galli", minutes: 20,
      watchFor: [
        "The first 20 minutes: reading a CSV, selecting columns, filtering rows, groupby.",
        "A DataFrame is a table of columns, each a Series; most operations are column-wise.",
        "`describe()` is your first look at any dataset.",
      ],
    },
    reading: {
      keyIdea: "NumPy gives fast arrays and vectorised math; pandas gives labelled tables with `read_csv`, filtering, `groupby` and `describe`; matplotlib draws the picture. Exploratory data analysis is: load, look, summarise, plot — then ask the question.",
      body: [
        "**NumPy.** `np.array([...])`, `arr.mean()`, `arr.std()`, `np.percentile(arr, 75)`; arithmetic is element-wise; boolean masks select (`arr[arr > 700]`).",
        "**pandas.** `df = pd.read_csv(...)`; `df.head()`, `df.shape`, `df.describe()`, `df[\"col\"]`, `df[df.col > x]`, `df.groupby(\"g\")[\"col\"].mean()`, `df.sort_values(\"col\")`, `df.corr(numeric_only=True)`.",
        "**Plots.** `plt.hist`, `plt.scatter`, `plt.boxplot`; always label axes and title the figure — presentation is graded.",
        "**EDA checklist for an assignment:** shape and types → missing values (`df.isna().sum()`) → `describe()` → distributions (histograms) → relationships (scatter, correlation) → a one-paragraph interpretation. That paragraph is where the marks are.",
      ],
    },
    exercises: [
      {
        id: "eda", title: "An EDA pass on the lending data",
        prompt: "Load `data/lending.csv`. Store `n_rows`, the number of missing values across the frame `n_missing`, the mean `credit_score` by `region` as `score_by_region`, and the correlation between `dti_ratio` and `defaulted` as `corr_dti_default`. Draw a scatter of `credit_score` vs `dti_ratio`.",
        starter: `df = pd.read_csv("data/lending.csv")
n_rows = len(df)
n_missing = int(df.isna().sum().sum())
score_by_region = df.groupby("region")["credit_score"].mean()
corr_dti_default = ...
plt.scatter(df.credit_score, df.dti_ratio, s=5, alpha=.3); plt.xlabel("credit score"); plt.ylabel("DTI"); plt.title("Score vs DTI"); plt.show()
print(n_rows, n_missing, score_by_region.round(1).to_dict(), round(corr_dti_default, 3))
`,
        check: `assert n_rows == 4000 and n_missing == 0
assert abs(corr_dti_default - df["dti_ratio"].corr(df["defaulted"])) < 1e-9`,
        solution: `df = pd.read_csv("data/lending.csv")
n_rows = len(df)
n_missing = int(df.isna().sum().sum())
score_by_region = df.groupby("region")["credit_score"].mean()
corr_dti_default = df["dti_ratio"].corr(df["defaulted"])
plt.scatter(df.credit_score, df.dti_ratio, s=5, alpha=.3); plt.xlabel("credit score"); plt.ylabel("DTI"); plt.title("Score vs DTI"); plt.show()
print(n_rows, n_missing, score_by_region.round(1).to_dict(), round(corr_dti_default, 3))
`,
      },
    ],
    quiz: [
      { id: "q1", q: "`df[df.credit_score > 700]` returns…", choices: ["A boolean", "The rows where the condition holds", "A single column", "An error"], answer: 1, why: "Boolean indexing filters rows." },
      { id: "q2", q: "The first thing to run on a new dataset is…", choices: ["A regression", "`describe()` and a histogram", "A t-test", "`sort_values`"], answer: 1, why: "Load, look, summarise, plot — before any modelling." },
      { id: "q3", q: "`df.groupby(\"region\")[\"credit_score\"].mean()` gives…", choices: ["One overall mean", "The mean score for each region", "The count per region", "A sorted frame"], answer: 1, why: "Split-apply-combine." },
    ],
  },

  {
    id: "py-inheritance",
    session: 0, track: "stats", minutes: 35, setup: PY,
    title: "Inheritance (Das ch 13)",
    summary: "A subclass extends a base class: inherit attributes and methods, override what differs, call `super().__init__`. The chapter appears in three course weeks, so it matters.",
    reading: {
      keyIdea: "`class Child(Parent)` inherits everything from Parent. Override a method by redefining it; call the parent's version with `super()`. `isinstance(obj, Parent)` is True for children too.",
      body: [
        "```python\nclass Loan:\n    def __init__(self, principal, rate):\n        self.principal, self.rate = principal, rate\n    def annual_interest(self):\n        return self.principal * self.rate\n\nclass Mortgage(Loan):\n    def __init__(self, principal, rate, property_value):\n        super().__init__(principal, rate)\n        self.property_value = property_value\n    def ltv(self):\n        return self.principal / self.property_value\n```",
        "**Overriding.** If `Mortgage` defines its own `annual_interest`, that version is used for mortgages; `super().annual_interest()` still reaches the parent's.",
        "**Hierarchies and mixins.** Grandchild classes inherit through the chain; multiple inheritance (`class A(B, C)`) resolves methods left to right — the *method resolution order*. Mixins are small classes that add one capability.",
        "**When to inherit.** Use inheritance for an *is-a* relationship (a mortgage is a loan); use composition (an attribute holding another object) for *has-a*.",
      ],
    },
    exercises: [
      {
        id: "subclass", title: "Extend a base class",
        prompt: "Define `CreditCard(Loan)` whose `__init__` takes `principal, rate, limit`, calls the parent initialiser, and stores `limit`. Override `annual_interest` to add a flat $95 fee. Store `interest` for a card with principal 2,000 at 22% and `is_loan = isinstance(card, Loan)`.",
        starter: `class Loan:
    def __init__(self, principal, rate):
        self.principal, self.rate = principal, rate
    def annual_interest(self):
        return self.principal * self.rate

class CreditCard(Loan):
    def __init__(self, principal, rate, limit):
        ...
    def annual_interest(self):
        ...

card = CreditCard(2000, 0.22, 5000)
interest = card.annual_interest()
is_loan = isinstance(card, Loan)
print(interest, is_loan, card.limit)
`,
        check: `assert abs(interest - (2000*0.22 + 95)) < 1e-9, "Parent interest plus the $95 fee"
assert is_loan is True and card.limit == 5000`,
        solution: `class Loan:
    def __init__(self, principal, rate):
        self.principal, self.rate = principal, rate
    def annual_interest(self):
        return self.principal * self.rate

class CreditCard(Loan):
    def __init__(self, principal, rate, limit):
        super().__init__(principal, rate)
        self.limit = limit
    def annual_interest(self):
        return super().annual_interest() + 95

card = CreditCard(2000, 0.22, 5000)
interest = card.annual_interest()
is_loan = isinstance(card, Loan)
`,
      },
    ],
    quiz: [
      { id: "q1", q: "`super().__init__(...)` …", choices: ["Creates a new parent", "Runs the parent class's initialiser on this instance", "Is optional always", "Returns the parent"], answer: 1, why: "It sets up the inherited attributes before the child adds its own." },
      { id: "q2", q: "A child defines a method with the parent's name. This is…", choices: ["An error", "Overriding", "Overloading", "Composition"], answer: 1, why: "The child's version is used for child instances." },
      { id: "q3", q: "`isinstance(mortgage, Loan)` where Mortgage inherits from Loan is…", choices: ["False", "True", "An error", "None"], answer: 1, why: "Instances of a subclass are instances of the parent too." },
      { id: "q4", q: "Use inheritance when the relationship is…", choices: ["has-a", "is-a", "uses-a", "any"], answer: 1, why: "A mortgage *is a* loan. A loan *has an* owner — that is composition." },
    ],
  },

  {
    id: "py-strings",
    session: 0, track: "stats", minutes: 35, setup: PY,
    title: "Strings (Das ch 8)",
    summary: "Slicing, searching, formatting, splitting and joining — the operations behind cleaning any text column before you can analyse it.",
    reading: {
      keyIdea: "Strings are immutable sequences: slice them like lists, search with `in`/`find`, normalise with `strip`/`lower`/`replace`, break them apart with `split` and rebuild with `join`. Every data-cleaning task is a combination of these.",
      body: [
        "**Operations.** `s.upper()`, `s.lower()`, `s.strip()`, `s.replace(\"$\", \"\")`, `s.startswith(\"AC\")`, `\"Provo\" in s`, `s.find(\"@\")` (−1 if absent), `s.count(\"a\")`, `len(s)`.",
        "**Slicing.** `s[0]`, `s[-1]`, `s[2:5]`, `s[::-1]` (reversed). Strings cannot be changed in place — every method returns a new string.",
        "**Split and join.** `\"a,b,c\".split(\",\")` → `[\"a\", \"b\", \"c\"]`; `\", \".join([\"a\", \"b\"])` → `\"a, b\"`. `line.split()` with no argument splits on any whitespace.",
        "**Formatting.** f-strings with width and alignment: `f\"{name:<10}{amount:>10,.2f}\"` — left-align the name in 10 characters, right-align the amount. Tables in assignment output are built this way.",
      ],
    },
    exercises: [
      {
        id: "clean", title: "Clean a messy amount column",
        prompt: "Write `to_number(s)` that turns strings like `\" $1,250.50 \"`, `\"(300)\"` (negative) and `\"—\"` (missing → `None`) into floats. Apply it to `raw` to build `clean`.",
        starter: `def to_number(s):
    s = s.strip()
    if s in ("", "—", "-", "n/a"):
        return None
    negative = s.startswith("(") and s.endswith(")")
    s = s.strip("()").replace("$", "").replace(",", "")
    value = float(s)
    return ...

raw = [" $1,250.50 ", "(300)", "—", "$42", " 7,000.00"]
clean = [to_number(s) for s in raw]
print(clean)
`,
        check: `assert clean == [1250.5, -300.0, None, 42.0, 7000.0], f"got {clean}"`,
        solution: `def to_number(s):
    s = s.strip()
    if s in ("", "—", "-", "n/a"):
        return None
    negative = s.startswith("(") and s.endswith(")")
    s = s.strip("()").replace("$", "").replace(",", "")
    value = float(s)
    return -value if negative else value

raw = [" $1,250.50 ", "(300)", "—", "$42", " 7,000.00"]
clean = [to_number(s) for s in raw]
print(clean)
`,
      },
      {
        id: "table", title: "Format a report table",
        prompt: "Build `lines`, a list of strings, one per (branch, balance) pair, each formatted as the branch left-aligned in 12 characters followed by the balance right-aligned in 12 characters with thousands separators and 2 decimals.",
        starter: `rows = [("Ogden", 24072.3), ("Provo", 3888.0), ("St George", 118250.75)]
lines = ...
print("\\n".join(lines))
`,
        check: `assert lines[0] == "Ogden          24,072.30" and len(lines[2]) == 24`,
        solution: `rows = [("Ogden", 24072.3), ("Provo", 3888.0), ("St George", 118250.75)]
lines = [f"{b:<12}{v:>12,.2f}" for b, v in rows]
`,
      },
    ],
    quiz: [
      { id: "q1", q: "Strings in Python are…", choices: ["Mutable", "Immutable — methods return new strings", "Lists of characters", "Numbers"], answer: 1, why: "`s.upper()` returns a new string; `s` is unchanged." },
      { id: "q2", q: "`\"a,b,,c\".split(\",\")` gives…", choices: ["['a','b','c']", "['a','b','','c']", "'abc'", "An error"], answer: 1, why: "Empty fields are kept as empty strings." },
      { id: "q3", q: "`s.find(\"@\")` when `@` is absent returns…", choices: ["None", "0", "-1", "An error"], answer: 2, why: "`find` returns −1; `index` would raise." },
      { id: "q4", q: "`f\"{x:>10,.2f}\"` right-aligns…", choices: ["In 2 characters", "In 10 characters with thousands separators and 2 decimals", "Left", "Without separators"], answer: 1, why: "Width 10, `,` for separators, `.2f` for two decimals." },
    ],
  },

  {
    id: "py-files-exceptions",
    session: 0, track: "stats", minutes: 35, setup: PY,
    title: "Files and exceptions (Das ch 14)",
    summary: "Read and write text and CSV files with `with open(...)`, and handle errors with try/except so a bad row does not crash an analysis.",
    reading: {
      keyIdea: "`with open(path) as f:` opens a file and guarantees it closes. Read lines, split on commas (or use the csv module), and wrap conversions in try/except so one malformed value is reported rather than fatal.",
      body: [
        "```python\nwith open(\"data/branch_deposits.csv\") as f:\n    header = f.readline().strip().split(\",\")\n    rows = [line.strip().split(\",\") for line in f]\n```",
        "**Writing.** `with open(\"out.txt\", \"w\") as f: f.write(\"line\\n\")`. Mode `\"a\"` appends. The `csv` module handles quoted fields: `csv.reader(f)`, `csv.DictReader(f)` (rows as dicts keyed by header).",
        "**Exceptions.** `try: value = float(s) except ValueError: ...` catches only that error; `except Exception as e:` catches anything (use sparingly). `finally:` runs regardless. `raise ValueError(\"message\")` signals a problem to the caller.",
        "**The assignment pattern.** Read a file → parse each row inside try/except → count the rows you skipped → report both the analysis and the number skipped. Silent failures cost marks; reported ones do not.",
      ],
    },
    exercises: [
      {
        id: "readcsv", title: "Read a CSV robustly",
        prompt: "Read `data/branch_deposits.csv` with `csv.DictReader`, summing `balance` per `branch` into `totals` and counting rows that fail to parse into `skipped`. (The file is clean, so `skipped` should be 0 — but the code must handle a bad value.)",
        starter: `import csv
totals, skipped = {}, 0
with open("data/branch_deposits.csv") as f:
    for row in csv.DictReader(f):
        try:
            bal = float(row["balance"])
        except ValueError:
            ...
            continue
        totals[row["branch"]] = totals.get(row["branch"], 0.0) + bal
print({k: round(v) for k, v in totals.items()}, "skipped:", skipped)
`,
        check: `assert skipped == 0 and set(totals) == {"Ogden", "Provo", "Logan", "St. George"}
assert abs(sum(totals.values()) - 28_886_000) < 200_000, "Totals should sum to the file's total balance"`,
        solution: `import csv
totals, skipped = {}, 0
with open("data/branch_deposits.csv") as f:
    for row in csv.DictReader(f):
        try:
            bal = float(row["balance"])
        except ValueError:
            skipped += 1
            continue
        totals[row["branch"]] = totals.get(row["branch"], 0.0) + bal
print({k: round(v) for k, v in totals.items()}, "skipped:", skipped)
`,
      },
      {
        id: "raise", title: "Validate with an exception",
        prompt: "Write `parse_rate(s)` that returns a float in [0, 1] from strings like `\"6%\"` or `\"0.06\"`, raising `ValueError` with a clear message for anything outside that range. Collect the results and error messages for `inputs`.",
        starter: `def parse_rate(s):
    s = s.strip()
    value = float(s.rstrip("%")) / 100 if s.endswith("%") else float(s)
    if not 0 <= value <= 1:
        ...
    return value

inputs = ["6%", "0.06", "150%", "-0.1"]
results = []
for s in inputs:
    try:
        results.append(parse_rate(s))
    except ValueError as e:
        results.append(f"error: {e}")
print(results)
`,
        check: `assert results[0] == 0.06 and results[1] == 0.06
assert str(results[2]).startswith("error") and str(results[3]).startswith("error")`,
        solution: `def parse_rate(s):
    s = s.strip()
    value = float(s.rstrip("%")) / 100 if s.endswith("%") else float(s)
    if not 0 <= value <= 1:
        raise ValueError(f"rate {value} is outside 0–1")
    return value

inputs = ["6%", "0.06", "150%", "-0.1"]
results = []
for s in inputs:
    try:
        results.append(parse_rate(s))
    except ValueError as e:
        results.append(f"error: {e}")
print(results)
`,
      },
    ],
    quiz: [
      { id: "q1", q: "`with open(path) as f:` guarantees…", choices: ["The file exists", "The file is closed when the block ends", "Faster reads", "UTF-8"], answer: 1, why: "The context manager closes it even if an exception occurs." },
      { id: "q2", q: "`except ValueError:` catches…", choices: ["Every error", "Only ValueError (and its subclasses)", "Only file errors", "Nothing"], answer: 1, why: "Catch the specific error you expect; broad `except` hides bugs." },
      { id: "q3", q: "`csv.DictReader` yields each row as…", choices: ["A list", "A dict keyed by the header", "A string", "A tuple"], answer: 1, why: "Header names become keys, which makes code readable." },
      { id: "q4", q: "A malformed row in an analysis file should be…", choices: ["Ignored silently", "Skipped and counted, with the count reported", "Fatal", "Replaced with zero"], answer: 1, why: "Report what you skipped. Silent failures cost marks and credibility." },
    ],
  },

  {
    id: "py-modules",
    session: 0, track: "stats", minutes: 25, setup: PY,
    title: "Modules (Das ch 7)",
    summary: "Import what you need, know where names come from, and keep your own reusable code in a module.",
    reading: {
      keyIdea: "`import math` brings in a module; `from math import sqrt` brings in one name; `import numpy as np` renames. Your own `.py` file is a module too — top-level code runs on import, so guard it with `if __name__ == \"__main__\":`.",
      body: [
        "**Forms.** `import statistics` → `statistics.mean(x)`. `from statistics import mean, median` → `mean(x)`. `import pandas as pd` → the conventional alias. Avoid `from x import *`: it hides where names came from.",
        "**`help()` and `dir()`.** `help(math.comb)` prints the docstring; `dir(math)` lists the names a module offers. Both work in the practice environment.",
        "**Your own module.** Put functions in `stats_tools.py`; `import stats_tools` from another file. Code at the top level of a module runs the first time it is imported — put tests and demos under `if __name__ == \"__main__\":` so they run only when the file is executed directly.",
      ],
    },
    exercises: [
      {
        id: "imports", title: "Use the standard library's statistics module",
        prompt: "Using `from statistics import mean, median, stdev`, compute `m`, `med`, and `sd` for `values`, and confirm with `math.isclose` that `sd` matches your own sample-sd calculation.",
        starter: `from statistics import mean, median, stdev
values = [4, 8, 15, 16, 23, 42]
m, med, sd = ...
own_sd = math.sqrt(sum((v - m)**2 for v in values) / (len(values) - 1))
print(m, med, round(sd, 3), math.isclose(sd, own_sd))
`,
        check: `assert m == 18 and med == 15.5 and math.isclose(sd, 13.490737563232042)`,
        solution: `from statistics import mean, median, stdev
values = [4, 8, 15, 16, 23, 42]
m, med, sd = mean(values), median(values), stdev(values)
own_sd = math.sqrt(sum((v - m)**2 for v in values) / (len(values) - 1))
print(m, med, round(sd, 3), math.isclose(sd, own_sd))
`,
      },
    ],
    quiz: [
      { id: "q1", q: "`from math import sqrt` lets you write…", choices: ["`math.sqrt(x)` only", "`sqrt(x)`", "`import.sqrt(x)`", "Nothing new"], answer: 1, why: "The name is bound directly; `math.sqrt` would then be undefined unless `math` is also imported." },
      { id: "q2", q: "`if __name__ == \"__main__\":` guards code that should run…", choices: ["On import", "Only when the file is executed directly", "Never", "Twice"], answer: 1, why: "Importing sets `__name__` to the module's name, not `\"__main__\"`." },
      { id: "q3", q: "`from x import *` is discouraged because…", choices: ["It is slow", "It hides where names came from and can overwrite yours", "It is a syntax error", "It only works for math"], answer: 1, why: "Explicit imports keep code readable." },
    ],
  },
];
