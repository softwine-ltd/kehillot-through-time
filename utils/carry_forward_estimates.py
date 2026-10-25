# -*- coding: utf-8 -*-
"""carry_forward_estimates.py -- regenerate the "carry-forward estimate" rows of kehilot.csv.

Rule: if a town has a sourced Jewish-population count from the last MAX_AGE years and no newer count,
the same number is carried forward to the current year, as a row whose probability column is `estimate`.
Estimate rows are NOT data: they say nothing the last real count did not say. The script is idempotent --
every run first deletes all existing estimate rows and then regenerates them from the current real data,
so a town that has received a newer count loses its estimate automatically (run it after every merge).

An estimate row
  * has probability = 'estimate' (the site draws it in its own colour; see helpers.js getConfidenceColor),
  * has source  = "Estimate: carried forward from <year>, not a source",
  * has comment = "Estimate, not a measurement: ..." (shown on the site) with the original count, year and source, and
    process_notes = "Delete this row when a newer count is added. [carry-forward-estimate]" (never shown; the tag is what
    validate_kehilot.py and this script's own cleanup look for),
  * covers (last real row's end + 1) .. END_YEAR with pop_start = pop_end = the last real count.

Which towns qualify (real row = any row whose probability is not 'estimate'):
  * the latest row with a numeric pop_start > 1 (probability high or medium; 'low' never qualifies),
  * its year_start is within MAX_AGE years of END_YEAR, and no real row covers END_YEAR with a number,
  * no later real row says pop = 0 (documented absence),
  * the country is not in EXCLUDE_COUNTRIES (fast-changing populations, or places where newer official
    counts are published regularly and should be fetched instead of guessed).

Usage:
  carry_forward_estimates.py              dry run: counts per country, written to nothing
  carry_forward_estimates.py apply        backup kehilot.csv, regenerate estimate rows
  carry_forward_estimates.py clear        backup, delete all estimate rows
Options: --max-age N (default 20)  --end-year Y (default: current year)  --exclude "A,B"  --include "A,B"
"""
import argparse
import csv
import os
import shutil
import sys
from collections import Counter, defaultdict
from datetime import datetime

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
KEH = os.path.join(os.path.dirname(HERE), "kehilot.csv")
C, CITY, LON, LAT, YE, YS, YEND, PS, PE, PROB, TYPE, SYM = range(12)
SRC, COMMENT, PROC = 17, 18, 19      # PROC = process_notes, the 20th column: maintenance remarks the site never reads
NCOL = 20
TAG = "[carry-forward-estimate]"
ESTIMATE = "estimate"

# Fast-changing populations or regions with regularly published official counts: do not guess.
EXCLUDE_COUNTRIES = {
    "Ukraine", "Russia", "Belarus", "Moldova",                      # war / mass emigration
    "Iran", "Iraq", "Syria", "Yemen", "Lebanon", "Libya", "Afghanistan", "Venezuela",   # emigration / crisis
    "Israel", "Palestine",                                            # annual CBS counts exist; growth makes a flat line wrong
}


def first_source(src):
    """The first source of a Source cell (cut at the first comma outside parentheses, so a citation is never left half open)."""
    depth = 0
    for i, ch in enumerate(src):
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth = max(0, depth - 1)
        elif ch == "," and depth == 0:
            return src[:i].strip()
    return src.strip()


def num(s):
    try:
        v = float(str(s).strip())
        return v
    except ValueError:
        return None


def year(s):
    try:
        return int(str(s).strip())
    except ValueError:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", nargs="?", default="dry", choices=["dry", "apply", "clear"])
    ap.add_argument("--max-age", type=int, default=20)
    ap.add_argument("--end-year", type=int, default=datetime.now().year)
    ap.add_argument("--exclude", default="")
    ap.add_argument("--include", default="", help="countries to remove from the default exclude list")
    a = ap.parse_args()
    exclude = set(EXCLUDE_COUNTRIES) | {x.strip() for x in a.exclude.split(",") if x.strip()}
    exclude -= {x.strip() for x in a.include.split(",") if x.strip()}

    with open(KEH, encoding="utf-8-sig", newline="") as f:
        rd = csv.reader(f)
        header = next(rd)
        data = list(rd)
    if len(header) < NCOL:
        header = header[:19] + ["process_notes"]
    for r in data:
        r.extend([""] * (NCOL - len(r)))
    real = [r for r in data if r[PROB] != ESTIMATE]
    removed = len(data) - len(real)

    towns = defaultdict(list)
    for r in real:
        towns[(r[C], r[CITY], r[LON], r[LAT])].append(r)

    new, why = [], Counter()
    per_country = defaultdict(lambda: [0, 0.0])
    for key, rows in towns.items():
        country = key[0]
        if country in exclude:
            why["excluded country"] += 1
            continue
        counted = [r for r in rows if num(r[PS]) is not None and num(r[PS]) > 1 and year(r[YS]) is not None]
        if not counted:
            why["no numeric count"] += 1
            continue
        last = max(counted, key=lambda r: (year(r[YS]), 1 if r[PROB] == "high" else 0))
        ly = year(last[YS])
        if last[PROB] not in ("high", "medium"):
            why["last count is low/unknown confidence"] += 1
            continue
        if ly < a.end_year - a.max_age:
            why["last count older than max age"] += 1
            continue
        ends = [year(r[YEND]) for r in rows if year(r[YEND]) is not None]
        covered = any(year(r[YS]) is not None and year(r[YEND]) is not None and year(r[YS]) <= a.end_year <= year(r[YEND])
                      and num(r[PS]) is not None and num(r[PS]) > 1 for r in rows)
        if covered:
            why["already covers end year"] += 1
            continue
        if any(year(r[YS]) is not None and year(r[YS]) > ly and num(r[PS]) == 0 for r in rows):
            why["later zero count"] += 1
            continue
        ye_last = year(last[YEND])
        start = (ye_last if (ye_last is not None and ye_last > ly) else ly) + 1
        if start > a.end_year:
            why["last count already reaches end year"] += 1
            continue
        pop = int(num(last[PS])) if num(last[PS]) == int(num(last[PS])) else num(last[PS])
        row = list(last)
        row.extend([""] * (NCOL - len(row)))
        row[YS], row[YEND] = str(start), str(a.end_year)
        row[PS], row[PE] = str(pop), str(pop)
        row[PROB] = ESTIMATE
        row[SRC] = f"Estimate: carried forward from {ly}, not a source"
        orig = first_source(last[SRC])
        row[COMMENT] = (f"Estimate, not a measurement: the last sourced count for this town is {pop:,} in {ly}"
                        f"{' (' + orig + ')' if orig else ''}; no newer count was found, so the same number is carried "
                        f"forward to {a.end_year}.")
        row[PROC] = f"Delete this row when a newer count is added. {TAG}"   # maintenance note: not shown on the site
        new.append(row)
        per_country[country][0] += 1
        per_country[country][1] += pop

    print(f"existing estimate rows removed: {removed}")
    print(f"estimate rows generated: {len(new)} (max age {a.max_age}, end year {a.end_year})")
    print("skipped towns:", dict(why))
    print("excluded countries:", sorted(exclude))
    print(f"{'country':28s} {'towns':>6s} {'population carried':>20s}")
    for c, (n, p) in sorted(per_country.items(), key=lambda kv: -kv[1][1])[:25]:
        print(f"{c:28s} {n:6d} {int(p):20,d}")
    print(f"total population carried: {int(sum(p for _, p in per_country.values())):,}")

    if a.mode == "dry":
        print("Dry run only -- pass 'apply' to write, 'clear' to delete all estimate rows.")
        return
    backup = KEH.replace("kehilot.csv", f"kehilot_backup_{datetime.now():%Y%m%d_%H%M%S}_pre_estimates.csv")
    shutil.copy(KEH, backup)
    out = real if a.mode == "clear" else real + new
    with open(KEH, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(out)
    print("Backup:", backup)
    print(f"kehilot.csv: {len(data)} -> {len(out)} rows")
    # last step of every run: keep each town one continuous, chronological block (estimate rows were appended at the end)
    sys.path.insert(0, HERE)
    import fill_marker_names
    fill_marker_names.fill_file(KEH, apply=True)
    import sort_kehilot
    _, was_sorted = sort_kehilot.sort_file(KEH, apply=True)
    print("sort_kehilot:", "already sorted" if was_sorted else "sorted")


if __name__ == "__main__":
    main()
