"""Fill blank name columns (city_hebrew, city_yid, city_german, city_other) on a marker's rows when the marker has exactly one
non-empty value for that column elsewhere. New rows merged from agent files often carry blank names while the marker's older rows
have them; the popup title then loses the Hebrew name for those years.
Markers with several different values are left alone (the validator warns about them).
Usage: fill_marker_names.py [apply]   (dry run by default). Also called at the end of carry_forward_estimates.py apply."""
import csv, os, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
KEH = os.path.join(os.path.dirname(HERE), "kehilot.csv")
COLS = (13, 14, 15, 16)  # city_hebrew, city_yid, city_german, city_other


def fill(rows):
    """rows: data rows (no header), modified in place. Returns the number of cells filled."""
    names = defaultdict(lambda: defaultdict(set))
    for r in rows:
        for c in COLS:
            if r[c]:
                names[(r[0], r[1], r[2], r[3])][c].add(r[c])
    n = 0
    for r in rows:
        k = (r[0], r[1], r[2], r[3])
        for c in COLS:
            if not r[c] and len(names[k][c]) == 1:
                r[c] = next(iter(names[k][c]))
                n += 1
    return n


def fill_file(path=KEH, apply=False):
    with open(path, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.reader(f))
    header, data = rows[0], rows[1:]
    n = fill(data)
    print(f"fill_marker_names: {n} blank name cells {'filled' if apply else 'would be filled'}")
    if apply and n:
        with open(path, "w", encoding="utf-8", newline="") as f:
            csv.writer(f).writerows([header] + data)
    return n


def main():
    fill_file(apply="apply" in sys.argv)


if __name__ == "__main__":
    main()
