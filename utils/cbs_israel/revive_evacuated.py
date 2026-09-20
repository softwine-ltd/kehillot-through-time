# -*- coding: utf-8 -*-
"""Add the evacuated / merged Israeli settlements that exist in the 2003-2007 CBS files and could be geocoded."""
import csv, json, os, sys
sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import rebuild_cbs_israel as rb
import import_cbs_israel as ic

cbs = json.load(open(os.path.join(HERE, "cbs_localities.json"), encoding="utf-8"))
coords = json.load(open(os.path.join(HERE, "evac_coords.json"), encoding="utf-8"))
# old-model name -> (CBS English name, key in evac_coords)
TARGETS = {"Nezarim": ("NEZARIM", "Nezarim"), "Ele Sinay": ("ELE SINAY", "Ele Sinay"), "Dugit": ("DUGIT", "Dugit"),
           "Ramat Pinkas": ("RAMAT PINKAS", "Ramat Pinkas"), "Ramat Ef'al": ("RAMAT EF'AL", "Ramat Ef'al"), "Kefar Azar": ("KEFAR AZAR", "Kefar Azar")}
rows = list(csv.reader(open(rb.KEH, encoding="utf-8-sig")))
header, data = rows[0], rows[1:]
have = {(r[0].strip(), r[1].strip()) for r in data}
new = []
for name, (cen, ck) in TARGETS.items():
    if ("Israel", name) in have:
        continue
    d = next((x for x in cbs.values() if ic.nen(x["en"]) == ic.nen(cen) and x["series"]), None)
    c = coords.get(ck)
    if not d or not c:
        print("skip", name); continue
    new.extend(rb.build_rows([""] * 19, d, name, c[0], c[1], None))
    print("added", name, d["he"], sorted(d["series"])[0], "-", sorted(d["series"])[-1])
if "--apply" in sys.argv:
    with open(rb.KEH, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(data + new)
    print("rows added:", len(new))
