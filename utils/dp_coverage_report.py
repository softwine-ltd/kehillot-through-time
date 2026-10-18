# -*- coding: utf-8 -*-
"""dp_coverage_report.py -- compare kehilot.csv with DellaPergola's 2024 core Jewish population by country
(Table 8.17, AJYB 2024; utils/data/dp2024_core.csv). Per town the latest count with year_start in
[MIN_YEAR, 2024] is used (real rows, then real+estimate rows). Output: utils/data/dp_coverage_report.csv
and a console table sorted by the gap. Read-only; metro/regional markers can inflate a country's total.
Usage: dp_coverage_report.py [--min-year 2000]"""
import argparse, csv, os, re, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
KEH = os.path.join(os.path.dirname(HERE), "kehilot.csv")
ALIAS = {"Israeli": "Israel", "State of Israeli": "Israel", "Turkeyl": "Turkey", "United Kingdomm": "United Kingdom",
         "Russial": "Russia", "Chinar": "China", "Czechia": "Czech Republic", "Bosnia-Herzegovina": "Bosnia and Herzegovina",
         "Congo D.R.": "Democratic Republic of the Congo", "United States": "United States"}
SKIP = re.compile(r"total|rest of|world|states\]|caribbean|^america|^asia|^africa|^oceania|^europe|\]|Syria and Lebanon|Palestinian", re.I)
US_NAMES = {"USA", "United States"}


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--min-year", type=int, default=2000); a = ap.parse_args()
    dp = {}
    for r in csv.DictReader(open(os.path.join(HERE, "data", "dp2024_core.csv"), encoding="utf-8")):
        n = r["country_dp"]
        if SKIP.search(n) and n not in ALIAS: continue
        dp[ALIAS.get(n, n)] = int(r["core_jews_2024"])
    best = {}
    for r in csv.reader(open(KEH, encoding="utf-8-sig")):
        if r[0] == "country": continue
        try: y = int(r[5]); p = float(r[7])
        except ValueError: continue
        if p <= 1 or not (a.min_year <= y <= 2024): continue
        c = "United States" if r[0] in US_NAMES else r[0]
        k = (c, r[1], r[2], r[3]); real = r[9] != "estimate"
        for tag in (["real", "all"] if real else ["all"]):
            if tag not in best.setdefault(k, {}) or y >= best[k][tag][0]:
                best[k][tag] = (y, p)
    tot = defaultdict(lambda: [0, 0, 0]); 
    for (c, *_), d in best.items():
        if "real" in d: tot[c][0] += d["real"][1]; tot[c][2] += 1
        tot[c][1] += d["all"][1]
    rows = []
    for c, v in dp.items():
        t = tot.get(c, [0, 0, 0]); rows.append((c, v, int(t[0]), int(t[1]), t[2]))
    rows.sort(key=lambda r: -(r[1] - r[3]))
    out = os.path.join(HERE, "data", "dp_coverage_report.csv")
    with open(out, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f); w.writerow(["country", "dp_core_2024", "dataset_real", "dataset_with_estimates", "towns_with_recent_count", "ratio_all"])
        for c, d, re_, al, n in rows: w.writerow([c, d, re_, al, n, round(al / d, 2) if d else ""])
    print(f"{'country':26s} {'DP 2024':>10s} {'dataset':>10s} {'+estim.':>10s} {'towns':>6s} {'ratio':>6s}")
    for c, d, re_, al, n in rows: print(f"{c:26s} {d:10,d} {re_:10,d} {al:10,d} {n:6d} {al/d:6.2f}")
main()
