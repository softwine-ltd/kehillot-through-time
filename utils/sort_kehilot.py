# -*- coding: utf-8 -*-
"""sort_kehilot.py -- keep kehilot.csv sorted so that every town is one continuous block, in chronological order.

Sort key (stable, so rows that tie keep their current order):
  country, accent-stripped lower-case city name, city name, longitude, latitude, year_start, year_end.
A town is identified by (country, city, long, lat), as everywhere else in the pipeline; two towns that share a name in
one country but have different coordinates stay in separate blocks (the nearer spellings of one place are listed by
jew_hist/qa_2026-10-18/dupscan.py).  The site does not depend on the row order (helpers.js filters by year and groups by
country+name); popups list a town's facts in file order, so a sorted file shows them chronologically.

Run it at the end of every run that changes kehilot.csv (carry_forward_estimates.py does this automatically after
'apply'; merge scripts append new rows at the end, so run this after them as well).
Usage:
  sort_kehilot.py            check only: reports whether the file is sorted
  sort_kehilot.py apply      sort in place (the row set is verified unchanged; only the order changes)
"""
import csv
import os
import sys
import unicodedata
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
KEH = os.path.join(os.path.dirname(HERE), "kehilot.csv")
C, CITY, LON, LAT, YE, YS, YEND = range(7)
BIG = 10 ** 9


def _num(s, default):
    try:
        return float(str(s).strip())
    except ValueError:
        return default


def _norm(s):
    s = unicodedata.normalize("NFKD", s.casefold())
    return "".join(ch for ch in s if not unicodedata.combining(ch))


def sort_key(r):
    return (r[C], _norm(r[CITY]), r[CITY], _num(r[LON], 0.0), _num(r[LAT], 0.0), _num(r[YS], BIG), _num(r[YEND], BIG))


def read(path=KEH):
    with open(path, encoding="utf-8-sig", newline="") as f:
        rd = csv.reader(f)
        header = next(rd)
        return header, list(rd)


def is_sorted(rows):
    keys = [sort_key(r) for r in rows]
    return all(keys[i] <= keys[i + 1] for i in range(len(keys) - 1))


def sort_file(path=KEH, apply=True):
    """Sort kehilot.csv in place; returns (rows, was_sorted)."""
    header, rows = read(path)
    was = is_sorted(rows)
    if apply and not was:
        before = Counter(tuple(r) for r in rows)
        out = sorted(rows, key=sort_key)  # stable
        assert Counter(tuple(r) for r in out) == before, "sort changed the row set: aborting"
        with open(path, "w", encoding="utf-8", newline="") as f:
            w = csv.writer(f)
            w.writerow(header)
            w.writerows(out)
        rows = out
    return rows, was


def main():
    apply = len(sys.argv) > 1 and sys.argv[1] == "apply"
    rows, was = sort_file(apply=apply)
    towns = len({(r[C], r[CITY], r[LON], r[LAT]) for r in rows})
    if apply:
        print(f"sort_kehilot: {len(rows)} rows, {towns} towns; {'already sorted' if was else 'sorted now'}")
    else:
        print(f"sort_kehilot: {len(rows)} rows, {towns} towns; file is {'sorted' if was else 'NOT sorted (run with apply)'}")
    return 0 if (was or apply) else 1


if __name__ == "__main__":
    sys.exit(main())
