# -*- coding: utf-8 -*-
"""validate_kehilot.py -- sanity checks for kehilot.csv; run before every commit. Exit code 1 if a hard error is found.
Hard errors: wrong column count, non-numeric/out-of-range coordinates or years, year_end < year_start, pop_end without
pop_start, unknown probability value, estimate rows without the carry-forward tag, exact duplicate rows, Year Established
later than the town's first row. Warnings (printed, exit code unaffected): population 1 (legacy placeholder),
same-year rows with different counts for one town, ending year beyond 2026.
Usage: validate_kehilot.py [--verbose]"""
import csv, os, re, sys
from collections import Counter, defaultdict
sys.stdout.reconfigure(encoding="utf-8")
KEH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "kehilot.csv")
PROBS = {"high", "medium", "low", "estimate"}
verbose = "--verbose" in sys.argv
# Security patterns (see the review of 2026-10-24): markup or script in a data cell, link schemes that run code or read local files,
# the maintainers' own file paths leaking into public data, and cells that Excel/Sheets would evaluate as formulas.
UNSAFE = re.compile(r"<\/?[A-Za-z!]|javascript\s*:|vbscript\s*:|data\s*:\s*text/html|\bon(?:error|load|click|mouse\w+|focus)\s*=", re.I)
BAD_SCHEME = re.compile(r"^\s*(?:javascript|data|vbscript|file|ftp)\s*:", re.I)
LOCAL_PATH = re.compile(r"(?<![A-Za-z0-9])[A-Za-z]:[\\/]|\\Users\\", re.I)  # a Windows drive path (URLs have "://" after 2+ letters)
FORMULA = re.compile(r"^[=@]|^[+\-][A-Za-z(]|^[\t\r]")
# Remarks about OUR data gathering/processing belong in process_notes (the public Notes are for visitors); see utils/split_process_notes.py
PROCESS_WORDS = re.compile(r"\[(?:Source detail|Also reported by|Review fix|Second-pass|Merge note|Corrected|UNVERIFIED|Unverified approximation|carry-forward)|"
                           r"\bread from the page image\b|\bNew place \(no map marker|\bMatched to the existing map marker|\bNo online source found\b|"
                           r"\bDelete this row when\b|\bhand-typed batch\b|\bre-research\b|\bYear Established =|\bTown Name and coordinates are taken|"
                           r"\bglyph classifiers\b|\btesseract\b", re.I)


def fnum(s):
    try: return float(s)
    except ValueError: return None


rows = list(csv.reader(open(KEH, encoding="utf-8-sig")))
header, data = rows[0], rows[1:]
err, warn = defaultdict(list), defaultdict(list)
seen = Counter(tuple(r) for r in data)
town = defaultdict(list)
for i, r in enumerate(data, start=2):
    if len(r) != 20: err["column count != 20 (19 public columns + process_notes)"].append(i); continue
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
    if re.search("[A-Za-z]", r[13]): err["Latin text in city_hebrew (placeholder?)"].append(i)
    if r[9] == "": warn["empty probability (legacy rows)"].append(i)
    elif r[9] not in PROBS: err[f"unknown probability {r[9]!r}"].append(i)
    if r[9] == "estimate" and "[carry-forward-estimate]" not in r[19]: err["estimate row without tag (in process_notes)"].append(i)
    if r[9] != "estimate" and "[carry-forward-estimate]" in r[19]: err["carry-forward tag on a non-estimate row"].append(i)
    # Content safety: the site writes these cells into popups (HTML-escaped) and links, and the owner opens the file in Excel.
    for c in (r[0], r[1], *r[12:20]):
        if UNSAFE.search(c): err["HTML/script-like text in a cell"].append(i); break
    if BAD_SCHEME.search(r[17]): err["source with a javascript:/data:/file: scheme"].append(i)
    if LOCAL_PATH.search(r[17]) or LOCAL_PATH.search(r[18]) or LOCAL_PATH.search(r[19]): err["local file path in source/comment/process_notes (privacy)"].append(i)
    for c in (r[0], r[1], *r[12:20]):
        if FORMULA.search(c): warn["cell starting with = @ + - (spreadsheet formula)"].append(i); break
    if PROCESS_WORDS.search(r[18]): warn["process wording left in the public Notes (run utils/split_process_notes.py)"].append(i)
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
    if len({r[13] for _, r, _, _ in items if r[13]}) > 1: warn["marker with several different city_hebrew names"].append(t[1])
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sort_kehilot  # noqa: E402
if not sort_kehilot.is_sorted(data):
    warn["file not sorted by town (run utils/sort_kehilot.py apply)"] = [0]
dups = [k for k, v in seen.items() if v > 1]
if dups: err["exact duplicate rows"] = [sum(seen[k] - 1 for k in dups)]
# The other data files that feed popups and links
for fname in ("events.csv", "events_polygon.csv", "historical_arrows.csv"):
    path = os.path.join(os.path.dirname(KEH), fname)
    if not os.path.exists(path): continue
    for i, r in enumerate(list(csv.reader(open(path, encoding="utf-8-sig")))[1:], start=2):
        for c in r:
            if UNSAFE.search(c): err[f"{fname}: HTML/script-like text"].append(i); break
        for c in r:
            if BAD_SCHEME.search(c): err[f"{fname}: javascript:/data:/file: link"].append(i); break
        for c in r:
            if LOCAL_PATH.search(c): err[f"{fname}: local file path"].append(i); break
print(f"{len(data)} rows, {len(town)} markers, {len({r[0] for r in data})} countries")
for name, d in (("ERROR", err), ("warning", warn)):
    for k, v in sorted(d.items()):
        print(f"{name}: {k}: {len(v)}" + (f"  e.g. {v[:5]}" if verbose or name == "ERROR" else ""))
sys.exit(1 if err else 0)
