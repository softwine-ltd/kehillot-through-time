# -*- coding: utf-8 -*-
"""dp_historical_coverage.py -- compare the Jewish population in kehilot.csv with Sergio DellaPergola's world Jewish population by major
region, 1170-1948 (Table 1 of 'Demografia ve-amiyut yehudit' [Demography and Jewish peoplehood], chapter 1 of the Hebrew volume on Jewish
people studies, p. 74; utils/data/dp_world_regions_1170_1948.csv, thousands). For each table year every town's population is taken from the row
that covers that year (pop_start..pop_end interpolated linearly inside a multi-year row; a single-year row counts for +-5 years); towns without
a covering row contribute nothing. Regions follow DellaPergola: Eretz Israel, Asia, Africa, West Europe (incl. southern Europe), East Europe
(Russian empire successor states, Poland, Romania, Hungary, Czechoslovakia, Balkans), America and Oceania (incl. South Africa as DellaPergola
counts it: 'America and Oceania' here = Americas, Australia, NZ, South Africa and Zimbabwe, as the text defines).
Output: console table (dataset / DP) and utils/data/dp_historical_coverage.csv. Usage: dp_historical_coverage.py [--estimates]
(--estimates also uses the carry-forward estimate rows)."""
import argparse, csv, os, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
KEH = os.path.join(os.path.dirname(HERE), "kehilot.csv")
EI = {"Israel", "Palestine"}
ASIA = {"Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "China", "Cyprus", "Georgia", "Hong Kong", "India", "Indonesia", "Iran", "Iraq", "Japan", "Jordan",
        "Kazakhstan", "Kuwait", "Kyrgyzstan", "Lebanon", "Malaysia", "Mongolia", "Myanmar", "Pakistan", "Philippines", "Saudi Arabia", "Singapore", "Sri Lanka",
        "Syria", "Tajikistan", "Thailand", "Turkey", "Turkmenistan", "Uzbekistan", "Vietnam", "Yemen", "Papua New Guinea",
        "Bangladesh", "Cambodia", "Macau", "Nepal", "South Korea", "Taiwan"}
AFRICA = {"Algeria", "Egypt", "Ethiopia", "Kenya", "Libya", "Morocco", "Tunisia", "Uganda", "Cape Verde", "Zambia",
          "Angola", "Botswana", "Democratic Republic of the Congo", "Eritrea", "Madagascar", "Mauritius", "Mozambique", "Sudan", "Tanzania"}
AMOC = {"Argentina", "Aruba", "Australia", "Bahamas", "Barbados", "Belize", "Bermuda", "Bolivia", "Brazil", "Canada", "Cayman Islands", "Chile", "Colombia",
        "Costa Rica", "Cuba", "Curaçao", "Dominican Republic", "Ecuador", "El Salvador", "Fiji", "French Polynesia", "Guadeloupe", "Guam", "Guatemala", "Guyana",
        "Haiti", "Honduras", "Jamaica", "Martinique", "Mexico", "Namibia", "New Caledonia", "New Zealand", "Nicaragua", "Panama", "Paraguay", "Peru", "Puerto Rico",
        "Samoa", "St. Kitts and Nevis", "Suriname", "Trinidad and Tobago", "U.S. Virgin Islands", "USA", "United States", "Uruguay", "Vanuatu", "Venezuela",
        "South Africa", "Zimbabwe"}
EEUR = {"Albania", "Belarus", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", "Estonia", "Hungary", "Kosovo", "Latvia", "Lithuania", "Moldova",
        "Montenegro", "North Macedonia", "Poland", "Romania", "Russia", "Россия", "Serbia", "Slovakia", "Slovenia", "Ukraine"}
WEUR = {"Austria", "Belgium", "Denmark", "Finland", "France", "Germany", "Greece", "Iceland", "Ireland", "Italy", "Liechtenstein", "Luxembourg", "Malta",
        "Netherlands", "Norway", "Portugal", "San Marino", "Spain", "Sweden", "Switzerland", "United Kingdom"}
REG = {}
for names, tag in ((EI, "eretz_israel"), (ASIA, "asia"), (AFRICA, "africa"), (AMOC, "america_oceania"), (EEUR, "east_europe"), (WEUR, "west_europe")):
    for n in names: REG[n] = tag
ORDER = ["eretz_israel", "asia", "africa", "west_europe", "east_europe", "america_oceania"]


def num(s):
    try: return float(s)
    except ValueError: return None


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--estimates", action="store_true"); a = ap.parse_args()
    dp = {int(r["year"]): r for r in csv.DictReader(open(os.path.join(HERE, "data", "dp_world_regions_1170_1948.csv"), encoding="utf-8"))}
    towns = defaultdict(list); unmapped = defaultdict(int)
    for r in csv.reader(open(KEH, encoding="utf-8-sig")):
        if r[0] == "country": continue
        if r[9] == "estimate" and not a.estimates: continue
        ys, ye, p0, p1 = num(r[5]), num(r[6]), num(r[7].lstrip("~")), num(r[8])
        if ys is None or p0 is None or p0 <= 1: continue
        reg = REG.get(r[0])
        if reg is None: unmapped[r[0]] += 1; continue
        towns[(reg, r[0], r[1], r[2], r[3])].append((ys, ye if ye is not None else ys, p0, p1 if p1 is not None else p0))
    res = defaultdict(lambda: defaultdict(float)); bycountry = defaultdict(lambda: defaultdict(float)); ntowns = defaultdict(lambda: defaultdict(int))
    for (reg, c, *_), rows in towns.items():
        for Y in dp:
            best = None
            for ys, ye, p0, p1 in rows:
                if ys <= Y <= ye and ye > ys: v = p0 + (p1 - p0) * (Y - ys) / (ye - ys)
                elif ye == ys and abs(Y - ys) <= 5: v = p0
                else: continue
                best = v if best is None else max(best, v)
            if best is not None:
                res[Y][reg] += best; bycountry[Y][(reg, c)] += best; ntowns[Y][reg] += 1
    out = os.path.join(HERE, "data", "dp_historical_coverage.csv")
    with open(out, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f); w.writerow(["year", "region", "dellapergola_thousands", "dataset_thousands", "ratio", "towns_with_count"])
        for Y in sorted(dp):
            for g in ORDER:
                d = float(dp[Y][g]) if dp[Y][g] != "" else 0
                s = res[Y][g] / 1000
                w.writerow([Y, g, d, round(s, 1), round(s / d, 3) if d else "", ntowns[Y][g]])
    print("dataset thousands / DellaPergola thousands (ratio), towns with a count" + (" [with estimate rows]" if a.estimates else ""))
    print(f"{'year':>5s} " + " ".join(f"{g:>26s}" for g in ORDER))
    for Y in sorted(dp):
        cells = []
        for g in ORDER:
            d = float(dp[Y][g]); s = res[Y][g] / 1000
            cells.append(f"{s:8.1f}/{d:8.1f} ({s / d if d else 0:4.2f}) n={ntowns[Y][g]:4d}")
        print(f"{Y:5d} " + " ".join(f"{c:>26s}" for c in cells))
    if unmapped: print("unmapped countries:", dict(unmapped))
    print("\nlargest country totals per region for selected years (thousands):")
    for Y in (1880, 1900, 1939):
        for g in ORDER:
            top = sorted(((v / 1000, c) for (rg, c), v in bycountry[Y].items() if rg == g), reverse=True)[:6]
            print(Y, g, [(c, round(v, 1)) for v, c in top])


main()


# ---------------------------------------------------------------------------------------------------------------------------
# Second comparison: DellaPergola's Table 2 (world Jewish population by major regions 1948, 1970, 2008; utils/data/dp_world_regions_1948_2008.csv)
# Region definitions (approximate): west_europe = Europe west/south of the former Eastern bloc (+ in 2008 the East European EU members: Poland, Czech
# Republic, Slovakia, Hungary, Romania, Bulgaria, Slovenia, Baltic states, as DellaPergola's footnote says); east_europe_balkans = Poland, Hungary,
# Czech Republic, Slovakia, Romania, Bulgaria, Albania, former Yugoslavia (1948, 1970 only); fsu_europe = Russia, Ukraine, Belarus, Moldova, Baltic
# states; fsu_asia = Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, Turkmenistan, Georgia, Armenia, Azerbaijan; rest_of_asia = other Asia incl. Turkey,
# Iran, Iraq, Yemen, India, China; north_africa_incl_ethiopia; south_africa = Southern/East Africa; north_america = USA, Canada; latin_america = rest of the
# Americas and the Caribbean (incl. Mexico); oceania.
def table2():
    FSU_E = {"Russia", "Россия", "Ukraine", "Belarus", "Moldova", "Estonia", "Latvia", "Lithuania"}
    FSU_A = {"Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan", "Georgia", "Armenia", "Azerbaijan"}
    EB = {"Poland", "Hungary", "Czech Republic", "Slovakia", "Romania", "Bulgaria", "Albania", "Bosnia and Herzegovina", "Croatia", "Kosovo", "Montenegro",
          "North Macedonia", "Serbia", "Slovenia"}
    EU_E = {"Poland", "Hungary", "Czech Republic", "Slovakia", "Romania", "Bulgaria", "Slovenia", "Estonia", "Latvia", "Lithuania"}
    NAFR = {"Algeria", "Egypt", "Ethiopia", "Libya", "Morocco", "Tunisia", "Eritrea", "Sudan"}
    SAFR = {"South Africa", "Zimbabwe", "Namibia", "Zambia", "Kenya", "Uganda", "Cape Verde", "Angola", "Botswana", "Democratic Republic of the Congo", "Madagascar", "Mauritius", "Mozambique", "Tanzania"}
    NAM = {"USA", "United States", "Canada"}
    OCE = {"Australia", "New Zealand", "Fiji", "French Polynesia", "Guam", "New Caledonia", "Papua New Guinea", "Samoa", "Vanuatu"}

    def region(c, Y):
        if c in EI: return "israel"
        if c in FSU_E: return "west_europe" if (Y == 2008 and c in EU_E) else "fsu_europe"
        if c in FSU_A: return "fsu_asia"
        if c in EB: return "west_europe" if Y == 2008 and c in EU_E else "east_europe_balkans"
        if c in WEUR: return "west_europe"
        if c in NAFR: return "north_africa_incl_ethiopia"
        if c in SAFR: return "south_africa"
        if c in NAM: return "north_america"
        if c in OCE: return "oceania"
        if c in AMOC: return "latin_america"
        if c in ASIA: return "rest_of_asia"
        return None
    dp = {r["region"]: r for r in csv.DictReader(open(os.path.join(HERE, "data", "dp_world_regions_1948_2008.csv"), encoding="utf-8"))}
    best = defaultdict(dict)  # (region, town key) -> {year: value}
    towns = defaultdict(list)
    for r in csv.reader(open(KEH, encoding="utf-8-sig")):
        if r[0] == "country" or r[9] == "estimate": continue
        ys, ye, p0, p1 = num(r[5]), num(r[6]), num(r[7].lstrip("~")), num(r[8])
        if ys is None or p0 is None or p0 <= 1: continue
        towns[(r[0], r[1], r[2], r[3])].append((ys, ye if ye is not None else ys, p0, p1 if p1 is not None else p0))
    tot = defaultdict(lambda: defaultdict(float)); cnt = defaultdict(lambda: defaultdict(int))
    for (c, *_), rows in towns.items():
        for Y in (1948, 1970, 2008):
            v = None
            for ys, ye, p0, p1 in rows:
                if ys <= Y <= ye and ye > ys: x = p0 + (p1 - p0) * (Y - ys) / (ye - ys)
                elif abs(Y - ys) <= 5 and ye == ys: x = p0
                else: continue
                v = x if v is None else max(v, x)
            if v is not None:
                rg = region(c, Y)
                if rg: tot[Y][rg] += v; cnt[Y][rg] += 1
    print("\nTable 2 comparison (dataset thousands / DellaPergola thousands, ratio, towns): 1948 | 1970 | 2008")
    for rg, d in dp.items():
        if rg in ("world", "diaspora_total"): continue
        cells = []
        for Y in (1948, 1970, 2008):
            dv = float(d[f"thousands_{Y}"]); s = tot[Y][rg] / 1000
            cells.append(f"{s:8.1f}/{dv:8.1f} ({s / dv if dv else 0:5.2f}) n={cnt[Y][rg]:4d}")
        print(f"{rg:28s} " + " | ".join(cells))


table2()
