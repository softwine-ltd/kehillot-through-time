# -*- coding: utf-8 -*-
"""validate_kehilot.py -- sanity checks for kehilot.csv; run before every commit. Exit code 1 if a hard error is found.
Hard errors: wrong column count, non-numeric/out-of-range coordinates or years, year_end < year_start, pop_end without
pop_start, unknown probability value, estimate rows without the carry-forward tag, exact duplicate rows, Year Established
later than the town's first row. Warnings (printed, exit code unaffected): population 1 (legacy placeholder),
same-year rows with different counts for one town, ending year beyond 2026.
Usage: validate_kehilot.py [--verbose]"""
import csv, os, sys
from collections import Counter, defaultdict
sys.stdout.reconfigure(encoding="utf-8")
KEH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "kehilot.csv")
PROBS = {"high", "medium", "low", "estimate"}
verbose = "--verbose" in sys.argv


def fnum(s):
    try: return float(s)
    except ValueError: return None


rows = list(csv.reader(open(KEH, encoding="utf-8-sig")))
header, data = rows[0], rows[1:]
err, warn = defaultdict(list), defaultdict(list)
seen = Counter(tuple(r) for r in data)
town = defaultdict(list)
for i, r in enumerate(data, start=2):
    if len(r) != 19: err["column count != 19"].append(i); continue
    lon, lat = fnum(r[2]), fnum(r[3])
    if lon is None or lat is None or not (-180 <= lon <= 180 and -90 <= lat <= 90): err["bad coordinates"].append(i)
    ys, ye, yest = fnum(r[5]), fnum(r[6]), fnum(r[4])
    if ys is None: err["year_start not numeric"].append(i)
    if r[6] and ye is None: err["year_end not numeric"].append(i)
    if ys is not None and ye is not None and ye < ys: err["year_end < year_start"].append(i)
    if r[6] and ye is not None and ye > 2026: warn["year_end > 2026"].append(i)
    if r[8] and not r[7]: err["pop_end without pop_start"].append(i)
    if r[7] and fnum(r[7].lstrip("~")) is None: err["pop_start not numeric"].append(i)
    if r[7] == "-1": warn["population -1 (legacy marker)"].append(i)
    if r[7] and fnum(r[7].lstrip("~")) == 1: warn["population 1 (legacy placeholder)"].append(i)
    if r[9] == "": warn["empty probability (legacy rows)"].append(i)
    elif r[9] not in PROBS: err[f"unknown probability {r[9]!r}"].append(i)
    if r[9] == "estimate" and "[carry-forward-estimate]" not in r[18]: err["estimate row without tag"].append(i)
    town[(r[0], r[1], r[2], r[3])].append((i, r, yest, ys))
for t, items in town.items():
    starts = [y for _, r, _, y in items if y is not None and r[9] != "estimate"]
    if starts:
        for i, r, yest, _ in items:
            if yest is not None and yest > min(starts): err["Year Established later than first row"].append(i)
    by = defaultdict(set)
    for i, r, _, y in items:
        if r[7] and fnum(r[7].lstrip("~")) and r[9] != "estimate": by[y].add(fnum(r[7].lstrip("~")))
    if any(len(v) > 1 for v in by.values()): warn["same-year rows with different counts"].append(t[1])
dups = [k for k, v in seen.items() if v > 1]
if dups: err["exact duplicate rows"] = [sum(seen[k] - 1 for k in dups)]
print(f"{len(data)} rows, {len(town)} markers, {len({r[0] for r in data})} countries")
for name, d in (("ERROR", err), ("warning", warn)):
    for k, v in sorted(d.items()):
        print(f"{name}: {k}: {len(v)}" + (f"  e.g. {v[:5]}" if verbose or name == "ERROR" else ""))
sys.exit(1 if err else 0)
