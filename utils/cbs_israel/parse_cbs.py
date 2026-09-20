# -*- coding: utf-8 -*-
"""Parse the CBS locality files (2012-2024) into one JSON: per locality code, the Hebrew and English names,
founding year, coordinates (where the file has them) and a {year: [total, jews_and_others]} series."""
import glob
import json
import os
import re
import sys

import openpyxl
import xlrd

sys.stdout.reconfigure(encoding="utf-8")
DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cbs")


def load(p):
    if p.endswith("xlsx"):
        ws = openpyxl.load_workbook(p, read_only=True, data_only=True).worksheets[0]
        return [list(r) for r in ws.iter_rows(values_only=True)]
    sh = xlrd.open_workbook(p).sheet_by_index(0)
    return [sh.row_values(i) for i in range(sh.nrows)]


def num(v):
    if v is None or v == "" or str(v).strip() in ("None", "-", ".."):
        return None
    try:
        return float(str(v).replace(",", ""))
    except ValueError:
        return None


def find_col(header, *patterns, exclude=()):
    for i, h in enumerate(header):
        s = str(h)
        if any(re.search(p, s) for p in patterns) and not any(re.search(e, s) for e in exclude):
            return i
    return None


def main():
    out = {}
    for y in range(2003, 2025):
        p = glob.glob(os.path.join(DIR, f"cbs_{y}.*"))[0]
        rows = load(p)
        hi = next(i for i, r in enumerate(rows[:4]) if any("סמל יישוב" in str(c) or str(c).strip() == "סמל" for c in r))
        h = rows[hi]
        rows = rows[hi:]
        c_name = find_col(h, r"^שם יישוב$", r"^שם יישוב מלא$")
        if c_name is None:
            c_name = 0
        c_code = find_col(h, r"^סמל$", r"^סמל יישוב$")
        c_en = find_col(h, r"תעתיק", r"אנגלית")
        c_tot = find_col(h, r"סך הכל\s+אוכלוסייה", r"סה\"כ\s+אוכלוסייה")
        c_jo = find_col(h, r"^יהודים ואחרים", r"^מזה: יהודים ואחר")
        c_found = find_col(h, r"שנת ייסוד", r"שנת יסוד")
        c_type = find_col(h, r"צורת יישוב")
        c_coord = find_col(h, r"קואורדינטות", r"נקודת ציון")
        for r in rows[1:]:
            code = num(r[c_code])
            if code is None:
                continue
            code = int(code)
            d = out.setdefault(code, {"code": code, "he": None, "en": None, "founded": None, "type": None, "coord": None, "series": {}})
            d["he"] = str(r[c_name]).strip()
            if c_en is not None and r[c_en]:
                d["en"] = str(r[c_en]).strip()
            f = num(r[c_found]) if c_found is not None else None
            if f:
                d["founded"] = int(f)
            t = num(r[c_type]) if c_type is not None else None
            if t:
                d["type"] = int(t)
            if c_coord is not None and r[c_coord] not in (None, "", "None"):
                d["coord"] = str(r[c_coord])
            tot = num(r[c_tot]) if c_tot is not None else None
            jo = num(r[c_jo]) if c_jo is not None else None
            if tot is not None or jo is not None:
                d["series"][str(y)] = [tot, jo]
        print(y, "cols:", dict(name=c_name, code=c_code, tot=c_tot, jo=c_jo, found=c_found, coord=c_coord), "localities", len(rows) - 1)
    json.dump(out, open(os.path.join(os.path.dirname(DIR), "cbs_localities.json"), "w", encoding="utf-8"), ensure_ascii=False)
    print("localities:", len(out), "with any series:", sum(1 for d in out.values() if d["series"]),
          "with founding year:", sum(1 for d in out.values() if d["founded"]), "with coord:", sum(1 for d in out.values() if d["coord"]))


if __name__ == "__main__":
    main()
