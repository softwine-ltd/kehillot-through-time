"""Event titles and colors for events.csv (ellipses) and events_polygon.csv (polygons).

Both files end with three columns: valence (bad / good / neutral), title_eng, title_heb.
The popup shows "<type name> - <title>" in Hebrew and English; the shape color comes from valence:
  bad      red       (pogroms, persecution, expulsions, anti-Jewish legislation, ghettos, destruction)
  good     blue      (community growth, states and kingdoms, rights granted, return, rescue)
  good     green     (Jewish thought and migration events, i.e. types 11 and 4: academies, scholarship)
  neutral  gray      (mixed or ambiguous: revolts with a mixed outcome, earliest mentions, ...)
Rows with an empty valence keep the color they already have.

Usage (from the repo root):
  python utils/event_titles_colors.py colors                  recolor every row from its valence column
  python utils/event_titles_colors.py apply TITLES.csv ...    first copy valence/title_eng/title_heb from one or more files
                                                              with the columns id,valence,title_eng,title_heb
                                                              (id = E0001.. for the n-th row of events.csv, P001.. for events_polygon.csv),
                                                              then recolor
Add `dry` as the last argument to only print what would change.
"""
import csv
import io
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = (("events.csv", "E%04d", 5, 13), ("events_polygon.csv", "P%03d", 1, 9))  # file, id format, color column, type column
NEW_COLS = ["valence", "title_eng", "title_heb"]

# (border color, fill color, fill opacity)
PALETTE = {
    "bad": ("#c0392b", "#e74c3c", "0.15"),
    "good_blue": ("#2980b9", "#3498db", "0.20"),
    "good_green": ("#27ae60", "#2ecc71", "0.22"),
    "neutral": ("#7f8c8d", "#95a5a6", "0.18"),
}
GREEN_TYPES = {"4", "11"}


def palette_for(valence, type_):
    if valence == "bad":
        return PALETTE["bad"]
    if valence == "good":
        return PALETTE["good_green"] if type_ in GREEN_TYPES else PALETTE["good_blue"]
    if valence == "neutral":
        return PALETTE["neutral"]
    return None


def read_titles(paths):
    titles = {}
    for p in paths:
        for r in csv.DictReader(open(p, encoding="utf-8-sig", newline="")):
            v = r["valence"].strip().lower()
            if v not in ("bad", "good", "neutral"):
                sys.exit("bad valence %r for %s in %s" % (r["valence"], r["id"], p))
            if r["id"] in titles:
                sys.exit("duplicate id %s" % r["id"])
            titles[r["id"]] = (v, r["title_eng"].strip(), r["title_heb"].strip())
    return titles


def main():
    args = sys.argv[1:]
    dry = bool(args) and args[-1] == "dry"
    if dry:
        args = args[:-1]
    if not args or args[0] not in ("colors", "apply"):
        sys.exit(__doc__)
    titles = read_titles(args[1:]) if args[0] == "apply" else {}
    used = set()
    for fn, idfmt, ci, ti in FILES:
        path = os.path.join(ROOT, fn)
        text = open(path, encoding="utf-8", newline="").read()
        eol = "\r\n" if "\r\n" in text else "\n"
        rows = list(csv.reader(io.StringIO(text, newline="")))
        header, data = rows[0], rows[1:]
        base = len(header) if header[-3:] != NEW_COLS else len(header) - 3
        if header[-3:] != NEW_COLS:
            header = header + NEW_COLS
        changed = recolored = 0
        counts = {}
        for n, r in enumerate(data, 1):
            r += [""] * (base + 3 - len(r))
            rid = idfmt % n
            if rid in titles:
                used.add(rid)
                new = list(titles[rid])
                if r[base:base + 3] != new:
                    r[base:base + 3] = new
                    changed += 1
            pal = palette_for(r[base], r[ti])
            if pal and r[ci:ci + 3] != list(pal):
                r[ci:ci + 3] = list(pal)
                recolored += 1
            counts[r[base]] = counts.get(r[base], 0) + 1
        print("%s: rows %d, title/valence cells set on %d, recolored %d, by valence %s" % (fn, len(data), changed, recolored, counts))
        if not dry:
            with open(path, "w", encoding="utf-8", newline="") as f:
                csv.writer(f, lineterminator=eol).writerows([header] + data)
    missing = set(titles) - used
    if missing:
        sys.exit("ids not found in the event files: %s" % sorted(missing)[:10])


main()
