# -*- coding: utf-8 -*-
"""Second pass over the Israeli localities: extend the CBS series back in time.

  * annual CBS locality files 2003-2024 (2003-2017: total population x the locality's 2018+ "Jews and others" share)
  * census years 1948, 1955, 1961, 1972, 1983, 1995, 2008 from Statistical Abstract of Israel 2018 table 2.24
    (localities with 5,000+ residents; total population, but the Jews-only row for the mixed cities)
  * Jerusalem additionally keeps the genuine 1931 Mandate census figure, so 1931 -> 1948 is bridged
  * localities evacuated in 2005 (Gush Katif etc.) are revived from their 2003-2005 CBS rows

Usage: rebuild_cbs_israel.py [apply]
"""
import csv
import json
import os
import re
import shutil
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import import_cbs_israel as ic  # noqa: E402

KEH = ic.KEH
SRC_URL = ic.SRC_URL
TABLE_URL = "https://www.cbs.gov.il/he/publications/doclib/2018/2.%20shnatonpopulation/st02_24.xls"
CENSUS_YEARS = (1948, 1955, 1961, 1972, 1983, 1995, 2008)
NOTE_ANNUAL = "Israel CBS locality files, 'Jews and others' (2003-2017 = total x the locality's 2018 Jewish share)."
NOTE_CENSUS = "Israel CBS census-year table 2.24 (total; Jews only for mixed cities), joined to the annual locality files."
NOTE_FOUND = ic.NOTE_FOUND
MIXED_JEWS_ONLY = True


def hnorm(s):
    s = re.sub(r"\(\d+\)", "", s or "")
    return re.sub(r"[\"'׳״`\-–—_.,\s]", "", s)


def annual_points(d):
    ser = d["series"]
    ratio = None
    for y in ("2018", "2019", "2020", "2021"):
        tot, jo = (ser.get(y) or [None, None])[:2]
        if tot and jo is not None:
            ratio = jo / tot
            break
    pts = {}
    for y in range(2003, 2025):
        tot, jo = (ser.get(str(y)) or [None, None])[:2]
        v = None
        if y >= 2018:
            if jo is not None:
                v = jo
            elif tot is not None and ratio is not None and ratio >= 0.5:
                v = tot * ratio
        elif tot is not None:
            v = tot * (ratio if ratio is not None else 1.0)
        if v is not None:
            pts[y] = int(round(v))
    return pts


def build_rows(base, d, city, lo, la, census, extra_points=None):
    pts = {}
    if census:
        src = census["jews"] if (MIXED_JEWS_ONLY and census["jews"]) else census["total"]
        for y in CENSUS_YEARS:
            if y in src:
                pts[y] = src[y]
    pts.update(extra_points or {})
    pts.update(annual_points(d))  # annual files override the 2008 census point
    founded = d.get("founded")
    out = []

    def row(ys, ye, ps, pe, comment, source):
        r = list(base)
        r[0], r[1] = "Israel", city
        r[2], r[3] = f"{lo:.5f}", f"{la:.5f}"
        r[4] = str(founded) if founded else base[4]
        r[5], r[6], r[7], r[8] = str(ys), str(ye), str(ps), str(pe)
        r[9], r[10], r[11] = "high", "1", "1"
        r[12], r[13] = city, d["he"]
        r[17], r[18] = source, comment
        return r

    first = min(pts) if pts else None
    if founded and founded < 2012 and (first is None or founded < first):
        out.append(row(founded, founded, 20, 20, NOTE_FOUND % founded, SRC_URL))
    for ys, ye, ps, pe in ic.compress(pts):
        if ys < 2003:
            out.append(row(ys, ye, ps, pe, NOTE_CENSUS, TABLE_URL))
        else:
            out.append(row(ys, ye, ps, pe, NOTE_ANNUAL, SRC_URL))
    return out


def main():
    apply = len(sys.argv) > 1 and sys.argv[1] == "apply"
    cbs = json.load(open(os.path.join(HERE, "cbs_localities.json"), encoding="utf-8"))
    census = json.load(open(os.path.join(HERE, "census_table_224.json"), encoding="utf-8"))
    for d in census.values():  # JSON turns the integer years into strings
        d["total"] = {int(k): v for k, v in d["total"].items()}
        d["jews"] = {int(k): v for k, v in d["jews"].items()}
    by_he = {}
    for d in cbs.values():
        by_he.setdefault(d["he"], []).append(d)
    by_en = {}
    for d in cbs.values():
        by_en.setdefault(ic.nen(d["en"]), []).append(d)

    with open(KEH, encoding="utf-8-sig") as f:
        rd = csv.reader(f)
        header = next(rd)
        data = list(rd)

    groups = {}
    for i, r in enumerate(data):
        if r[0].strip() == "Israel" and r[17] == SRC_URL and (ic.NOTE_SERIES in r[18] or r[18].startswith("Founded ")):
            groups.setdefault(r[1].strip(), []).append(i)
    print("Israeli towns with CBS-import rows:", len(groups))

    delete, new_rows, no_map, with_census = set(), [], [], 0
    for city, idxs in groups.items():
        base = data[idxs[0]]
        cands = by_he.get(base[13].strip(), [])
        if len(cands) != 1:
            no_map.append((city, base[13], len(cands)))
            continue
        d = cands[0]
        lo, la = float(base[2]), float(base[3])
        c = census.get(hnorm(d["he"])) or census.get(hnorm(re.sub(r"\(.*?\)", "", d["he"])))
        extra = {1931: 51222} if city == "Jerusalem" else None
        rows = build_rows(base, d, city, lo, la, c, extra)
        if c:
            with_census += 1
        delete.update(idxs)
        new_rows.extend(rows)
    print("rebuilt:", len(groups) - len(no_map), "| with census points:", with_census, "| no unique CBS match:", no_map[:10])

    # Jerusalem: drop the flagged straight-line skeleton after 1931 (replaced by the census series)
    j_drop = 0
    for i, r in enumerate(data):
        if r[0].strip() == "Israel" and r[1].strip() == "Jerusalem" and r[9] == "low":
            try:
                if float(r[5]) >= 1931:
                    delete.add(i)
                    j_drop += 1
            except ValueError:
                pass
    print("Jerusalem flagged skeleton rows dropped:", j_drop)

    # revive the evacuated settlements from their 2003-2005 rows
    revived, still = [], []
    for line in open(os.path.join(HERE, "israel_unmatched.txt"), encoding="utf-8").read().split("\nDUPLICATES")[0].splitlines()[1:]:
        name = line.split("\t")[0].strip()
        if not name:
            continue
        m = [d for d in by_en.get(ic.nen(name), []) if d["series"]]
        if not m and name in ic.MANUAL:
            m = [d for d in by_en.get(ic.nen(ic.MANUAL[name]), []) if d["series"]]
        if len(m) != 1:
            still.append(name)
            continue
        d = m[0]
        ll = ic.lonlat(d)
        if not ll:
            still.append(name + " (no coordinates)")
            continue
        base = [""] * 19
        rows = build_rows(base, d, name, ll[0], ll[1], None)
        new_rows.extend(rows)
        revived.append((name, d["en"], len(rows)))
    print("revived unmatched settlements:", len(revived), "| still without data:", len(still))
    print("  revived:", revived[:12])
    print("  still:", still)

    if not apply:
        return
    kept = [r for i, r in enumerate(data) if i not in delete]
    shutil.copy(KEH, KEH.replace("kehilot.csv", f"kehilot_backup_{datetime.now():%Y%m%d_%H%M%S}_pre_cbs_rebuild.csv"))
    with open(KEH, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(kept + new_rows)
    print(f"deleted {len(delete)} rows, added {len(new_rows)}; kehilot.csv now {len(kept) + len(new_rows)} rows")


if __name__ == "__main__":
    main()
