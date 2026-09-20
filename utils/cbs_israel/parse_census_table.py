# -*- coding: utf-8 -*-
"""Parse Statistical Abstract of Israel 2018 table 2.24 (population of localities with 5,000+ residents on
31.12.2017; census years 1948, 1961, 1972, 1983, 1995, 2008 plus 1955 and 2016-2017) into census_table_224.json:
{ hebrew_name: {"en": ..., "total": {year: population}, "jews": {year: population} } }."""
import json
import os
import re
import sys

import xlrd

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
COLS = {2: 2017, 3: 2016, 4: 2008, 5: 1995, 6: 1983, 7: 1972, 8: 1961, 9: 1955, 10: 1948}


def hnorm(s):
    s = re.sub(r"\(\d+\)", "", s or "")
    s = re.sub(r"[\"'׳״`\-–—_.,\s]", "", s)
    return s


def val(v):
    if isinstance(v, (int, float)):
        return round(float(v) * 1000)
    return None


def main():
    wb = xlrd.open_workbook(os.path.join(HERE, "cbs_hist", "st02_24.xls"))
    out = {}
    last = None
    for sh in wb.sheets():
        for i in range(sh.nrows):
            r = sh.row_values(i)
            en, he = str(r[0]).strip(), str(r[11]).strip()
            nums = [val(r[c]) for c in COLS]
            if not any(n is not None for n in nums):
                continue
            series = {COLS[c]: val(r[c]) for c in COLS if val(r[c]) is not None}
            if he.startswith("יהודים") and last:  # "Thereof: Jews" row belongs to the previous locality
                out[last]["jews"] = series
                continue
            key = hnorm(he)
            if not key:
                continue
            out[key] = {"he": he, "en": en, "total": series, "jews": {}}
            last = key
    json.dump(out, open(os.path.join(HERE, "census_table_224.json"), "w", encoding="utf-8"), ensure_ascii=False)
    print("localities:", len(out), "| with a 1948 value:", sum(1 for d in out.values() if 1948 in d["total"]),
          "| with jews rows:", [d["he"] for d in out.values() if d["jews"]])
    for k in ("ראשוןלציון", "תלאביביפו", "חיפה", "ירושלים", "נתניה"):
        if k in out:
            print(out[k]["he"], out[k]["en"], out[k]["total"], out[k]["jews"])


if __name__ == "__main__":
    main()
