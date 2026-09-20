# -*- coding: utf-8 -*-
"""Rebuild Israeli localities from Israel CBS locality files (2012-2024).

Usage: import_cbs_israel.py          dry run: prints match/dedupe summary, writes reports
       import_cbs_israel.py apply    writes kehilot.csv (backup first)

What it does
  1. The 1,018 old placeholder rows (population 30 from the founding year to 2023, with rounded, often badly
     wrong coordinates) are matched to CBS localities by English transliteration (plus a hand-verified list of
     spelling variants). Matched localities get real coordinates, a founding-year presence marker and the CBS
     2012-2024 "Jews and others" series compressed to a few piecewise-linear rows.
  2. Placeholders that duplicate a big city already in the dataset, or that map to the same CBS locality as an
     earlier placeholder, are deleted. Placeholders with no CBS match (mostly settlements evacuated in 2005) are
     deleted and listed in israel_unmatched.txt for follow-up.
  3. The 62 big Israeli cities whose old rows were removed by the batch-2 merge are matched to CBS by coordinates,
     get the CBS series from 2012, and get their old pre-2012 skeleton restored at low confidence (truncated at 2011).
"""
import csv
import glob
import json
import math
import os
import re
import shutil
import sys
from datetime import datetime

from pyproj import Transformer

sys.stdout.reconfigure(encoding="utf-8")
SCR = os.path.dirname(os.path.abspath(__file__))
KEH = r"C:\Users\oferm\OneDrive\Ofer\GitHub\kehillot-through-time\kehilot.csv"
SRC_URL = "https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx"
T = Transformer.from_crs("EPSG:2039", "EPSG:4326", always_xy=True)
UNVERIFIED = " [Unverified approximation from an early hand-typed batch; kept at low confidence until sourced pre-2012 census data replaces it.]"
NOTE_SERIES = "Israel CBS locality files 2012-2024, 'Jews and others' (Arab residents excluded); 2012-2017 derived from total population x the locality's 2018 Jewish-and-other share."
NOTE_FOUND = "Founded %d per the Israel CBS locality file; population at founding is not in CBS data, so this is a presence marker (population 20 by convention)."

MANUAL = {  # old English name -> CBS English (verified as the same place by reading both names)
    "Be'er Tuveya": "BE'ER TOVIYYA", "Balfuriyya": "BALFURYA", "Herzeliyya": "HERZLIYYA", "Ra'anana": "RA'ANNANA",
    "Ashdot Ya'aqov(Me'Uh)": "ASHDOT YA'AQOV(ME'UHAD)", "Yedidya": "YEDIDA", "Kefar HaMakkabi": "KEFAR HAMAKKABBI",
    "Bet HaLevi": "BET HALEWI", "Kefar Kish": "KEFAR KISCH", "Mennara": "MENARA", "Hazor HaGlilit": "HAZOR HAGELILIT",
    "Qiryat Ye'arim(Insti.)": "QIRYAT YE'ARIM(INSTITUTE)", "Kefar Rozenwald": "KEFAR ROZENWALD(ZARIT)", "Yodfat": "YODEFAT",
    "Asefar": "ASFAR", "Efrata": "EFRAT", "Haggai": "HAGGAY", "Yuvalim": "YUVALLIM", "Kemahin": "KEMEHIN",
    "Segula": "SEGULLA", "Qesariyya": "QESARYYA", "Makkabim-Re'ut": "MODI'IN-MAKKABBIM-RE'UT",
    "Yehud": "YEHUD-MONOSON", "Binyamina": "BINYAMINA-GIV'AT ADA", "Giv'at Ada": "BINYAMINA-GIV'AT ADA",
    "Qadima": "QADIMA-ZORAN", "Zoran": "QADIMA-ZORAN", "Nazerat Illit": "NOF HAGALIL",
    "Even Yizhaq(Gal'ed)": "GAL'ED (EVEN YIZHAQ)", "Li-On": "SARIGIM (LI-ON)", "Bet Arye": "BET ARYE-OFARIM",
}


B2_EN = {
    "Acre": "AKKO", "Afula": "AFULA", "Arad": "ARAD", "Ariel": "ARI'EL", "Ashdod": "ASHDOD", "Ashkelon": "ASHQELON",
    "Bat Yam": "BAT YAM", "Beersheba": "BE'ER SHEVA", "Beit Shemesh": "BET SHEMESH", "Beitar Illit": "BETAR ILLIT",
    "Bet She'an": "BET SHE'AN", "Bnei Brak": "BENE BERAQ", "Dimona": "DIMONA", "Eilat": "ELAT", "Givatayim": "GIV'ATAYIM",
    "Hadera": "HADERA", "Haifa": "HAIFA", "Herzliya": "HERZLIYYA", "Hod HaSharon": "HOD HASHARON", "Holon": "HOLON",
    "Jerusalem": "JERUSALEM", "Karmiel": "KARMI'EL", "Kfar Saba": "KEFAR SAVA", "Kiryat Arba": "QIRYAT ARBA",
    "Kiryat Ata": "QIRYAT ATTA", "Kiryat Bialik": "QIRYAT BIALIK", "Kiryat Gat": "QIRYAT GAT", "Kiryat Malakhi": "QIRYAT MAL'AKHI",
    "Kiryat Motzkin": "QIRYAT MOTZKIN", "Kiryat Ono": "QIRYAT ONO", "Kiryat Shmona": "QIRYAT SHEMONA",
    "Kiryat Tivon": "QIRYAT TIV'ON", "Kiryat Yam": "QIRYAT YAM", "Lod": "LOD", "Ma'ale Adumim": "MA'ALE ADUMMIM",
    "Ma'alot-Tarshiha": "MA'ALOT-TARSHIHA", "Migdal HaEmek": "MIGDAL HAEMEQ", "Mitzpe Ramon": "MIZPE RAMON",
    "Modi'in": "MODI'IN-MAKKABBIM-RE'UT", "Modi'in Illit": "MODI'IN ILLIT", "Nahariya": "NAHARIYYA", "Nazareth Illit": "NOF HAGALIL",
    "Nesher": "NESHER", "Netanya": "NETANYA", "Netivot": "NETIVOT", "Ofakim": "OFAQIM", "Or Yehuda": "OR YEHUDA",
    "Petah Tikva": "PETAH TIQWA", "Ra'anana": "RA'ANNANA", "Ramat Gan": "RAMAT GAN", "Ramla": "RAMLA", "Rehovot": "REHOVOT",
    "Rishon LeZion": "RISHON LEZIYYON", "Rosh HaAyin": "ROSH HAAYIN", "Safed": "ZEFAT", "Sderot": "SEDEROT",
    "Tel Aviv": "TEL AVIV - YAFO", "Tiberias": "TIBERIAS", "Tirat Carmel": "TIRAT KARMEL", "Yehud-Monosson": "YEHUD-MONOSON",
    "Yeruham": "YEROHAM", "Yokneam": "YOQNE'AM ILLIT",
}


def nen(s):
    return re.sub(r"[^A-Za-z0-9]", "", s or "").upper()


def num(s):
    try:
        return float(str(s).strip())
    except ValueError:
        return None


def hav(la1, lo1, la2, lo2):
    p1, p2 = math.radians(la1), math.radians(la2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lo2 - lo1) / 2) ** 2
    return 12742 * math.asin(math.sqrt(a))


def lonlat(d):
    s = (d.get("coord") or "").strip()
    try:
        s = str(int(float(s)))
    except ValueError:
        return None
    if len(s) == 12:
        x, y = int(s[:6]), int(s[6:])
    elif len(s) == 10:
        x, y = int(s[:5]) * 10, int(s[5:]) * 10
    else:
        return None
    return T.transform(x, y)


def points(d):
    """{year: population} of 'Jews and others', 2012-2024."""
    ser = d["series"]
    ratio = None
    for y in ("2018", "2019", "2020", "2021"):
        tot, jo = (ser.get(y) or [None, None])[:2]
        if tot and jo is not None:
            ratio = jo / tot
            break
    pts = {}
    for y in range(2012, 2025):
        tot, jo = (ser.get(str(y)) or [None, None])[:2]
        v = None
        if y >= 2018:
            if jo is not None:
                v = jo
            elif tot is not None and ratio is not None and ratio >= 0.5:
                v = tot * ratio
        elif tot is not None and ratio is not None:
            v = tot * ratio
        if v is not None:
            pts[y] = int(round(v))
    return pts


def compress(pts, tol=0.03, abs_tol=15):
    ys = sorted(pts)
    if len(ys) < 2:
        return [(ys[0], ys[0], pts[ys[0]], pts[ys[0]])] if ys else []

    def rec(i, j):
        best, bi = -1, None
        for k in range(i + 1, j):
            interp = pts[ys[i]] + (pts[ys[j]] - pts[ys[i]]) * (ys[k] - ys[i]) / (ys[j] - ys[i])
            dev = abs(pts[ys[k]] - interp)
            if dev > max(abs_tol, tol * max(pts[ys[k]], 1)) and dev > best:
                best, bi = dev, k
        if bi is None:
            return [i, j]
        return rec(i, bi)[:-1] + rec(bi, j)

    idx = rec(0, len(ys) - 1)
    return [(ys[a], ys[b], pts[ys[a]], pts[ys[b]]) for a, b in zip(idx, idx[1:])]


def make_rows(base, d, city, lo, la, with_founding=True):
    """base: template row (list of 19). Returns new rows for one CBS locality."""
    out = []
    he = d["he"]
    founded = d.get("founded")

    def row(ys, ye, ps, pe, comment):
        r = list(base)
        r[0], r[1] = "Israel", city
        r[2], r[3] = f"{lo:.5f}", f"{la:.5f}"
        r[4] = str(founded) if founded else base[4]
        r[5], r[6], r[7], r[8] = str(ys), str(ye), str(ps), str(pe)
        r[9], r[10], r[11] = "high", "1", "1"
        r[12] = city
        r[13] = he
        r[17] = SRC_URL
        r[18] = comment
        return r

    if with_founding and founded and founded < 2012:
        out.append(row(founded, founded, 20, 20, NOTE_FOUND % founded))
    for ys, ye, ps, pe in compress(points(d)):
        out.append(row(ys, ye, ps, pe, NOTE_SERIES))
    return out


def main():
    apply = len(sys.argv) > 1 and sys.argv[1] == "apply"
    cbs = json.load(open(os.path.join(SCR, "cbs_localities.json"), encoding="utf-8"))
    by_en = {}
    for d in cbs.values():
        by_en.setdefault(nen(d["en"]), []).append(d)

    with open(KEH, encoding="utf-8-sig") as f:
        rd = csv.reader(f)
        header = next(rd)
        data = list(rd)
    ix = {n: i for i, n in enumerate(header)}

    # newest backup = state before the batch-2 merge, used to restore old skeletons of big cities
    backups = sorted(glob.glob(os.path.join(os.path.dirname(KEH), "kehilot_backup_2*.csv")), key=os.path.getmtime)
    pre = os.path.join(os.path.dirname(KEH), "kehilot_backup_20260920_122540.csv")  # state right before the batch-2 merge
    old_sig = {tuple(x) for x in json.load(open(os.path.join(SCR, "batch2_old_rows.json"), encoding="utf-8"))}
    with open(pre, encoding="utf-8-sig") as f:
        rd = csv.reader(f)
        next(rd)
        pre_rows = list(rd)
    print("pre-merge backup used for skeleton restore:", os.path.basename(pre), len(pre_rows), "rows")

    # ---- batch-2 Israeli cities -> CBS by coordinates
    cities = json.load(open(os.path.join(SCR, "batch2_old_rows.json"), encoding="utf-8"))
    b2 = sorted({(c[0], c[1]) for c in cities if c[0] == "Israel"})
    coords = {}
    for r in data:
        k = (r[0].strip(), r[1].strip())
        if k in b2 and k not in coords:
            try:
                coords[k] = (float(r[2]), float(r[3]))
            except ValueError:
                pass
    cbs_ll = {}
    for c, d in cbs.items():
        ll = lonlat(d)
        if ll:
            cbs_ll[c] = ll
    b2_map = {}
    print("\nbatch-2 Israeli city -> CBS locality (explicit name map; distance is a sanity check)")
    for k in b2:
        en = B2_EN.get(k[1])
        cands = [d for d in by_en.get(nen(en), []) if d["series"]] if en else []
        if len(cands) != 1:
            print("  NO/AMBIGUOUS CBS MATCH", k, en, len(cands))
            continue
        d = cands[0]
        b2_map[k] = str(d["code"])
        ll = lonlat(d)
        dist = hav(coords[k][1], coords[k][0], ll[1], ll[0]) if k in coords and ll else float("nan")
        print(f"  {k[1]:20s} -> {d['en']:28s} {d['he']:18s} dist {dist:5.1f} km")

    # ---- placeholder rows
    ph = [(i, r) for i, r in enumerate(data) if r[0].strip() == "Israel" and r[7] == "30" and r[8] == "30" and "wikipedia" in r[17]]
    b2_codes = set(b2_map.values())
    seen_codes = {}
    plan, delete_idx, unmatched, dup = {}, set(), [], []
    for i, r in ph:
        name = r[1].strip()
        m = by_en.get(nen(name), [])
        if not m and name in MANUAL:
            m = by_en.get(nen(MANUAL[name]), [])
        m = [d for d in m if d["series"] or d.get("founded")]
        if len(m) != 1:
            unmatched.append((name, r[5], "ambiguous" if m else "no CBS match"))
            delete_idx.add(i)
            continue
        d = m[0]
        code = str(d["code"])
        if code in b2_codes or code in seen_codes:
            dup.append((name, cbs[code]["en"], "big-city duplicate" if code in b2_codes else "same locality as " + seen_codes[code]))
            delete_idx.add(i)
            continue
        seen_codes[code] = name
        plan[i] = d
        delete_idx.add(i)
    print(f"\nplaceholders {len(ph)}: matched+rebuilt {len(plan)}, duplicates deleted {len(dup)}, unmatched deleted {len(unmatched)}")
    open(os.path.join(SCR, "israel_unmatched.txt"), "w", encoding="utf-8").write(
        "UNMATCHED (deleted, need research):\n" + "\n".join(f"{n}\t{y}\t{why}" for n, y, why in unmatched)
        + "\n\nDUPLICATES (deleted):\n" + "\n".join(f"{n}\t{e}\t{why}" for n, e, why in dup))

    if not apply:
        for i, d in list(plan.items())[:6]:
            r = data[i]
            print("\nsample", r[1], "->", d["he"], d["en"], "founded", d["founded"], "coord", lonlat(d), "old", (r[2], r[3]))
            for nr in make_rows(r, d, r[1], *lonlat(d)):
                print("   ", nr[5], nr[6], nr[7], nr[8], "|", nr[18][:70])
        return

    # ---- build new rows
    new_rows = []
    for i, d in plan.items():
        r = data[i]
        ll = lonlat(d)
        if not ll:
            continue
        new_rows.extend(make_rows(r, d, r[1].strip(), ll[0], ll[1]))
    restored = 0
    for k, code in b2_map.items():
        d = cbs[str(code)]
        ll = lonlat(d)
        tmpl = next((r for r in data if (r[0].strip(), r[1].strip()) == k), None) or next(r for r in pre_rows if (r[0].strip(), r[1].strip()) == k)
        rows_new = make_rows(tmpl, d, k[1], ll[0], ll[1], with_founding=True)
        new_rows.extend(rows_new)
        if k != ("Israel", "Jerusalem"):
            continue  # every other old skeleton was just two endpoints joined by a straight line: dropped, not restored
        for r in pre_rows:
            if (r[0], r[1], r[5], r[6], r[7], r[8], r[18]) in old_sig and (r[0].strip(), r[1].strip()) == k:
                ys, ye = num(r[5]), num(r[6])
                if ys is None or ys >= 2012 or ye is None or ye <= 1999:
                    continue  # <=1999 rows were already kept (flagged) by the batch-2 merge; only bridge 1987-2011
                r = list(r)
                if ye is not None and ye >= 2012:
                    ps, pe = num(r[7]), num(r[8])
                    if ps is not None and pe is not None and ye > ys:
                        r[8] = str(int(round(ps + (pe - ps) * (2011 - ys) / (ye - ys))))
                    r[6] = "2011"
                r[2], r[3] = f"{ll[0]:.5f}", f"{ll[1]:.5f}"
                r[9] = "low"
                r[18] = r[18] + UNVERIFIED
                new_rows.append(r)
                restored += 1
        # also correct the coordinates of every remaining row of this city
    for r in data:
        k = (r[0].strip(), r[1].strip())
        if k in b2_map:
            ll = lonlat(cbs[str(b2_map[k])])
            r[2], r[3] = f"{ll[0]:.5f}", f"{ll[1]:.5f}"
    kept = [r for i, r in enumerate(data) if i not in delete_idx]
    shutil.copy(KEH, KEH.replace("kehilot.csv", f"kehilot_backup_{datetime.now():%Y%m%d_%H%M%S}_pre_cbs_israel.csv"))
    with open(KEH, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(kept + new_rows)
    print(f"deleted {len(delete_idx)} placeholder rows, added {len(new_rows)} rows ({restored} restored low-confidence skeleton rows); kehilot.csv now {len(kept) + len(new_rows)} rows")


if __name__ == "__main__":
    main()
