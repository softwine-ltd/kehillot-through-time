# -*- coding: utf-8 -*-
"""update_data_info.py -- write data_info.json, the numbers shown in the About dialog of the site
("Last data update: <date>. The map currently covers <towns> towns and <rows> data rows.", in English, Hebrew and French).

rows  = data rows of kehilot.csv (header excluded)
towns = distinct towns, counted exactly as utils/validate_kehilot.py counts markers: (country, city, long, lat)
lastUpdate = today's date, or the date given with --date (use it when the file is regenerated for an earlier data update)

Run it after every change of kehilot.csv, before committing (chain.sh in the data workspace runs it after the validator).
Usage:
  update_data_info.py                      dry run: prints what would be written
  update_data_info.py apply                write data_info.json next to kehilot.csv
  update_data_info.py apply --date 2026-11-01
"""
import csv
import json
import os
import re
import sys
from datetime import date

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
KEH = os.path.join(ROOT, "kehilot.csv")
OUT = os.path.join(ROOT, "data_info.json")


def main():
    args = sys.argv[1:]
    stamp = date.today().isoformat()
    if "--date" in args:
        stamp = args[args.index("--date") + 1]
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", stamp):
            sys.exit("--date must look like 2026-11-01")
    with open(KEH, encoding="utf-8-sig", newline="") as f:
        rd = csv.reader(f)
        next(rd)
        rows = towns = 0
        seen = set()
        for r in rd:
            if len(r) < 4:
                continue
            rows += 1
            seen.add((r[0], r[1], r[2], r[3]))
    towns = len(seen)
    info = {"lastUpdate": stamp, "towns": towns, "rows": rows}
    print(json.dumps(info))
    if "apply" in args:
        with open(OUT, "w", encoding="utf-8", newline="\n") as f:
            json.dump(info, f)
            f.write("\n")
        print("written:", OUT)
    else:
        print("Dry run only.")


if __name__ == "__main__":
    main()
