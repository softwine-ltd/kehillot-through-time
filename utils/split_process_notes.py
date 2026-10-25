# -*- coding: utf-8 -*-
"""split_process_notes.py -- keep the data-gathering / data-processing remarks out of the public Notes.

kehilot.csv has 19 public columns (the site reads exactly those) and one more, `process_notes`, that the site never
reads.  The `comment` column ("Notes" in the popups) is for visitors: what the source says about the community, how
to read the figure, caveats about the figure.  Remarks about OUR workflow -- how a number was read off a page image,
OCR, "no online source found", confidence tags, merge/review/correction logs, map-marker matching, where the
coordinates came from, "Year Established = ...", extra source links -- are moved, verbatim, to `process_notes`.

The script is idempotent and is run (a) once to migrate the existing file and (b) after every merge (chain.sh), where it
also pads new 19-cell rows to 20 cells.  Nothing is deleted: every removed fragment is appended to `process_notes`
(joined by " || ").  A handful of internal phrasings are rewritten into plain visitor wording; the original wording
goes to `process_notes` as well.

Usage:
  split_process_notes.py              dry run: counts, rule hit counts, before/after samples (nothing written)
  split_process_notes.py apply        backup kehilot.csv next to it, write the 20-column file
Options: --sample N (rows shown per run, default 40)  --report DIR (write moved/kept census files there)
"""
import csv
import os
import re
import shutil
import sys
from collections import Counter
from datetime import datetime

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
KEH = os.path.join(os.path.dirname(HERE), "kehilot.csv")
PROC_COL = "process_notes"
JOIN = " || "
NCOL = 20
CITY_OTHER, COMMENT, PROC = 16, 18, 19

# ----------------------------------------------------------------------------------------------------------------
# 1. bracketed annotations  [ ... ]
# ----------------------------------------------------------------------------------------------------------------
INTERNAL_TERMS = re.compile(
    r"pop_start|pop_end|year_end|year_start|moved to Notes|placeholder|legacy|hand-typed|unsourced guess|replaced by the sourced|"
    r"cleared to blank|cut to the start year|re-research|pipeline|Population \d[\d,]* moved|row\b|marker|merged|dedup|duplicate", re.I)
# (name, regex on the bracket's inner text, what to do)  'move' = whole bracket to process_notes;
# 'unlabel' = keep the text after the label as a plain sentence unless INTERNAL_TERMS says it is internal
BRACKET_RULES = [
    ("tag carry-forward", re.compile(r"^carry-forward-estimate$"), "move"),
    ("source detail", re.compile(r"^Source detail:", re.I), "move"),
    ("also reported by", re.compile(r"^Also reported by:", re.I), "move"),
    ("review fix", re.compile(r"^Review fix:", re.I), "unlabel"),
    ("second pass", re.compile(r"^Second-pass revision", re.I), "move"),
    ("merge note", re.compile(r"^Merge note:", re.I), "unlabel"),
    ("corrected", re.compile(r"^Corrected:", re.I), "move"),
    ("unverified approximation", re.compile(r"^Unverified approximation from an early hand-typed batch", re.I), "move"),
    ("UNVERIFIED url", re.compile(r"^UNVERIFIED\b", re.I), "move"),
    ("confidence tag", re.compile(r"^confidence:", re.I), "move"),
    ("no online source", re.compile(r"^no online source found", re.I), "move"),
    ("outside requested range", re.compile(r"^outside the requested", re.I), "move"),
    ("flagged automatically", re.compile(r"^Flagged low confidence automatically: ", re.I), "rewrite"),
    ("uncertain identification", re.compile(r"^UNCERTAIN identification", re.I), "rewrite"),
    ("century-only date", re.compile(r"^Century-only date \('([^']+)'\): Year of Data set to a round year \((-?\d+)\)\.?$"), "rewrite"),
    ("re-dated", re.compile(r"^Re-dated:", re.I), "move"),
    ("nominal population", re.compile(r"^Population estimate: source indicates (a small Jewish presence|an organized community/synagogue) but gives no specific count -- placeholder value used\.?$", re.I), "rewrite"),
]


def bracket_action(inner):
    """-> (action, replacement_text_or_None, rule_name)"""
    t = inner.strip()
    for name, rx, act in BRACKET_RULES:
        m = rx.search(t)
        if not m:
            continue
        if act == "move":
            return "move", None, name
        if act == "unlabel":
            rest = t[m.end():].strip()
            if not rest or INTERNAL_TERMS.search(rest):
                return "move", None, name
            return "rewrite", rest[0].upper() + rest[1:], name
        if name == "flagged automatically":
            rest = t[m.end():].strip()
            return "rewrite", rest[0].upper() + rest[1:], name
        if name == "uncertain identification":
            return "rewrite", "The identification of this place is uncertain.", name
        if name == "century-only date":
            return "rewrite", "Dated only to the %s in the source; %s is a round year used for the map." % (m.group(1), m.group(2)), name
        if name == "nominal population":
            return "rewrite", "The source indicates %s but gives no specific count; the population shown is only a nominal value." % m.group(1), name
    if len(t) > 25 and INTERNAL_TERMS.search(t):
        return "move", None, "internal bracket"
    return "keep", None, None


# ----------------------------------------------------------------------------------------------------------------
# 2. sentence / clause segments (top level '. ' and '; ')
# ----------------------------------------------------------------------------------------------------------------
ABBR = {"p", "pp", "nr", "no", "nos", "ca", "vol", "vols", "dr", "st", "c", "cf", "ed", "eds", "fol", "bd", "tab", "tav", "fig", "abb", "s", "ff",
        "mr", "prof", "jr", "sr", "v", "vs", "approx", "al", "ms", "mt", "kr", "ps", "r", "b", "d", "op", "cit", "ibid", "resp", "hrsg", "bzw", "etc",
        "incl", "ch", "chap", "sec", "sect", "col", "cols", "art", "ill", "trans", "rev", "repr", "ann", "esp", "ex", "inc", "co", "ltd", "gen", "lt",
        "capt", "bk", "mss", "fn", "n", "nn", "pl", "pt", "tom", "t", "cz", "ger", "heb", "lat", "gr", "pol", "rus", "yid", "e.g", "i.e", "u.a", "z.b", "d.h"}


LOWER_OPENERS = re.compile(r"(?:no online source|coordinates|population blank|year established|year of data|new town|new place|confidence|place identified)\b", re.I)
# remarks of ours that may follow a closing quote without a full stop in between
PROCESS_OPENERS = re.compile(r"(?:place identified|coordinates?\b|year established|year of data|new (?:place|town)|no online|confidence\b|read from|"
                             r"PDF text layer|(?:figures?|numbers?|digits?|text) read\b|OCR\b|matched to the existing)", re.I)


def split_segments(text):
    """[(segment, sep)] split at '. ' / '; ' outside (), [], {} and double quotes; sep is '.', ';' or '' (last)."""
    out, depth, inq, start, i, n = [], 0, False, 0, 0, len(text)
    opened = qopened = 0
    unbalanced = text.count("(") > text.count(")")     # a cut-off citation left a "(" open: then a remark of ours may start inside it
    while i < n:
        ch = text[i]
        if depth and i - opened > 400:      # a parenthesis that was never closed (cut-off citation): stop waiting for it
            depth = 0
        if inq and i - qopened > 400:       # same for a stray quote mark
            inq = False
        if ch == "(":
            if depth == 0:
                opened = i
            depth += 1
        elif ch == ")":
            depth = max(0, depth - 1)
        elif ch in '"”“' and (ch != '"' or inq) and (ch != "“"):
            # a closing quote; a quoted sentence that ends in '."' followed by a capital starts a new segment
            inq = False
            j = i + 1
            while text[j:j + 1] == " ":
                j += 1
            if depth == 0 and i > start and j > i + 1 and (
                    (text[i - 1] in ".!?" and text[j:j + 1].isupper()) or PROCESS_OPENERS.match(text[j:j + 40])):
                out.append((text[start:i + 1].strip(), ""))
                start = j
                i = j - 1
        elif ch in '"“':
            inq = True
            qopened = i
        elif ch in ".;" and not inq and i + 1 < n and text[i + 1] == " " and (depth == 0 or (unbalanced and PROCESS_OPENERS.match(text[i + 2:i + 42].lstrip()))):
            j = i + 1
            while text[j:j + 1] == " ":
                j += 1
            opener = bool(PROCESS_OPENERS.match(text[j:j + 40]))
            ok = True
            if ch == ".":
                head = text[start:i]
                m = re.search(r"(?<![A-Za-z0-9À-ɏ])([A-Za-zÀ-ɏ.]+)$", head)    # not the "s" of "1950s"
                tok = m.group(1).lower() if m else ""
                if tok in ABBR or (len(tok) == 1 and head[-1:].isupper()):
                    ok = opener          # "19th c. Year Established = ..." is still a new remark of ours
                nxt = text[j:j + 1]
                if ok and nxt and not (nxt.isupper() or nxt.isdigit() or nxt in "[(\"'“‘"):
                    # lower-case start: still a new segment when it opens one of our own remarks
                    ok = bool(LOWER_OPENERS.match(text[j:j + 40]))
            if ok:
                out.append((text[start:i].strip(), ch))
                start = j
                i = j - 1
                depth = 0
        i += 1
    tail = text[start:].strip()
    if tail:
        out.append((tail, ""))
    return [(s, sep) for s, sep in out if s]


# whole-segment moves: (name, regex searched from the segment start unless it begins with .*)
I = re.I
SEG_RULES = [
    # how a figure / text was read
    ("read from image/scan", re.compile(r"^(?:the |all )?(?:figures?|numbers?|digits?|values?|text|counts?|cells?|rows?|entries|counts|data)?\s*(?:was |were )?read\b", I)),
    ("page also viewed", re.compile(r"^(?:printed )?page also viewed as an image", I)),
    ("OCR/text layer", re.compile(r"^(?:OCR\b|PDF text layer|text layer|checked against (?:the )?PDF|two independent tesseract|figure agreed|entry has no footnote marker and its figure agreed)", I)),
    ("figure read", re.compile(r"^(?:Figures?|Numbers?|Digits?|Values?) (?:read|transcribed)\b", I)),
    ("digits by OCR", re.compile(r"^Digits read\b", I)),
    ("pdf file name", re.compile(r"^(?:PDF )?file [\w.\-]+\.pdf$", I)),
    ("pdf part page file", re.compile(r"^PDF part \d+, page \d+ \(printed p\. ?\d+\)\.?$", I)),
    # place / marker matching, coordinates
    ("new place", re.compile(r"^New (?:place\b|town(?=\s*[:;(,]|\s*$)|community not in\b|marker\b)", I)),
    ("marker position basis", re.compile(r"^(?:Marker position =|Identified by hand with the map marker)", I)),
    ("this row", re.compile(r"^This row\b", I)),
    ("entered by decision", re.compile(r"^Entered as a\b[^.;]*\bproject's decision", I)),
    ("matched marker", re.compile(r"^(?:Matched to the existing map marker|Matched to existing marker|Added to existing marker|Town already in dataset|existing marker)\b", I)),
    ("marker carries name", re.compile(r"^the marker carries the name\b", I)),
    ("town name and coordinates taken", re.compile(r"^Town Name and coordinates are taken\b", I)),
    ("coordinates", re.compile(r"^(?:Coordinates?|page coordinates|the page's own coordinates|coordinates =)\b", I)),
    ("place identified", re.compile(r"^Place identified (?:as|by)\b", I)),
    ("block total not a marker", re.compile(r"^the block total is NOT added as a marker", I)),
    # searches, confidence, bookkeeping of fields
    ("no online source", re.compile(r"^(?:No online (?:source|page)\b|No fetched (?:source|page)\b|The tallage figure itself: no online source found)", I)),
    ("no ... fetched", re.compile(r"^No\b[^.;]{0,120}\bfetched\b", I)),
    ("confidence", re.compile(r"^Confidence\b", I)),
    ("image viewing", re.compile(r"^(?:Scanned (?:book|journal), page image viewed|Printed page image viewed|page image checked|Page checked against the page image|re-read with RapidOCR|Figures? taken from the OCR)", I)),
    ("OCR engines", re.compile(r"^(?=[^.;]{0,120}$).*\bOCR engines?\b", I)),
    ("image remarks", re.compile(r"^(?:checked on the page images?|page images? checked|The OCR text prints\b|the page image shows\b|Footnote marker on the figure not legible in OCR|The thesis text layer reads\b|The OCR of the book is garbled)", I)),
    ("year established note", re.compile(r"^Year Established\b", I)),
    ("year of data note", re.compile(r"^Year of Data\b", I)),
    ("delete row", re.compile(r"^Delete this row when\b", I)),
    ("population blank", re.compile(r"^Population (?:left )?blank\.?$", I)),
    ("no population estimate found", re.compile(r"^No population estimate(?: found)?\.?$", I)),
    ("further sources", re.compile(r"^Further sources?(?: fetched)?:", I)),
    ("also reported by", re.compile(r"^Also reported by:", I)),
    ("source fetched", re.compile(r"^source is the scholarly edition read in the open-access PDF fetched\b", I)),
    ("dataset/meta", re.compile(r"kehilot\.csv|_rows\.csv|another agent|\bdataset town\b|\b(?:exists|not|already|is) in the dataset|Row added because|no name or <=4 km coordinate match", I)),
    ("verification", re.compile(r"^(?:Digits checked|The column adds up|not checked in\b|checked against\b)", I)),
    ("confidence word", re.compile(r"^(?:Low|High|Medium)(?:[- ](?:low|medium|high))?[- ]?confidence\.?$", I)),
    ("no academic estimate", re.compile(r"^(?:No academic population estimate found|Population (?:left )?blank: no academic (?:population )?estimate found)", I)),
    ("map has no row of ours", re.compile(r"^The map(?:'s \d{3,4} row| snapshot)? (?:has no (?-i:[A-Z])[\w' -]+ rows?\b|has (?-i:[A-Z])[\w' -]+ rows? for\b|has the same count\b|already (?:has|holds)\b|holds (?:this|only)\b)|^The map snapshot\b", I)),
    ("revision description", re.compile(r"^(?-i:(?:adds|corrects|replaces|revises|restores|removes|extends|shortens)\b)", I)),
    ("leaf of block", re.compile(r"^this leaf is one of its disjoint parts", I)),
]

# phrases inside segments that stay: (name, regex, replacement)  -- removed/rewritten text is logged in process_notes
INLINE_RULES = [
    ("file name in parentheses", re.compile(r"\s*\((?:PDF )?file [\w.\-]+\.pdf\)", I), ""),
    ("pdf page of file", re.compile(r"\(PDF page (\d+) of [\w.\-]+\.pdf\)", I), r"(PDF page \1)"),
    ("page coordinates check", re.compile(r"\s*\|\s*page coordinates verified vs Wikidata Q\d+ \([\d.]+ km\)", I), ""),
    ("also reported by inline", re.compile(r"(?:\s*Also reported by:\s*\"?https?://[^\s\"\]]+\"?)+", I), ""),
    ("further sources inline", re.compile(r"\s*Further sources?(?: fetched)?:\s*(?:https?://\S+\s*)+", I), ""),
    ("confidence inline", re.compile(r"\s*\((?:(?:low|medium|high) confidence|confidence (?:low|medium|high))\)", I), ""),
    ("checked on image inline", re.compile(r",\s*(?:checked|read|viewed) on the page images?(?=\))", I), ""),
    ("read on image tail", re.compile(r",?\s*read on the page images?(?=[.;]|$)", I), ""),
    ("no online source parenthetical", re.compile(r"\s*\([^()]*\bno online (?:source|page)\b[^()]*\)", I), ""),
    ("trailing no online source", re.compile(r"(?<=[.)])\s+No online source found(?: for [^.]*)?\.?$", I), ""),
    ("delete row inline", re.compile(r"\s*Delete this row when a newer count is added\.?", I), ""),
    ("agent parenthetical", re.compile(r"\s*\((?:Year Established[^()]*|[^()]*\bthis agent's rows\b[^()]*)\)", I), ""),
    ("read/ocr parenthetical", re.compile(r"\s*\([^()]*\b(?:OCR|tesseract|ABBYY|text layers?|glyph|page images?|page scans?|scanned table|fetched)\b[^()]*\)", I), ""),
]

# short rewrites of internal wording inside kept segments: (regex, replacement)
REWRITES = [
    (re.compile(r"^The column-sum check did not close for this row, so the figure is less certain", I), "The figure is less certain: the printed column does not add up"),
    (re.compile(r"\bin the fetched pages?\b", I), "in the sources consulted"),
    (re.compile(r"\bin fetched sources\b", I), "in the sources consulted"),
    (re.compile(r"\bthe fetched (PDF|page|text|article|source)\b", I), r"the \1"),
    (re.compile(r"\bfetched (?=(?:Wikipedia |excavation |online )?(?:pages?|sources?|text|articles?|PDF)\b)", I), "consulted "),
    (re.compile(r"so Year of Data (-?\d+) is the conventional midpoint", I), r"so \1 is the conventional midpoint"),
    (re.compile(r"^Replaces\b[^:]{0,200}\bfirst-pass\b[^:]{0,200}:\s*(\w)", I), lambda m: m.group(1).upper()),
    (re.compile(r"^New row:\s*(\w)", I), lambda m: m.group(1).upper()),
    (re.compile(r"\bYear of Data\b", I), "the year shown"),
    (re.compile(r"^Population (?:left )?blank: (\w)", I), lambda m: m.group(1).upper()),
    (re.compile(r"\bPopulation (?:is )?(?:left )?blank\b", I), lambda m: "No population figure is shown" if m.start() == 0 else "no population figure is shown"),
]


def rebuild(kept):
    """kept: [(text, sep, original_index, prev_sep)] -> string"""
    out = ""
    for k, (text, sep, idx, prev_sep) in enumerate(kept):
        if text and text[0].islower() and (k == 0 or out.endswith(". ")) and (prev_sep == ";" or k == 0 and idx > 0):
            text = text[0].upper() + text[1:]
        out += text
        if k + 1 < len(kept):
            nxt_idx = kept[k + 1][2]
            joiner = "; " if (sep == ";" and nxt_idx == idx + 1) else ". "
            if joiner == ". " and (out.endswith(".") or sep == ""):   # sep "" = split after a quoted sentence that already ends in '.'
                joiner = " "
            out += joiner
        else:
            if sep in (".", ";") and not out.endswith("."):
                out += "."
    return out


def split_comment(comment):
    """-> (public_text, [moved fragments], Counter of rule hits)"""
    moved, hits = [], Counter()
    text = comment

    # "[Second-pass revision] adds named-scholar attributions. <period heading>: ..." -- the tag and the sentence that describes the revision
    m0 = re.match(r"\s*\[Second-pass revision\]\s*(?=[a-z])(.*?\.)\s+(?=[A-Z0-9])", text)
    if m0:
        hits["bracket: second pass + description"] += 1
        moved.append(m0.group(0).strip())
        text = text[m0.end():]

    # brackets
    def br(m):
        act, rep, name = bracket_action(m.group(2))
        if act == "keep":
            return m.group(0)
        hits["bracket: " + name] += 1
        moved.append(m.group(0).strip())
        return "" if act == "move" else m.group(1) + rep
    text = re.sub(r"(\s*)\[((?:[^\[\]]|\[[^\[\]]*\])*)\]", br, text).strip()   # one level of nested [ ] allowed

    segs = split_segments(text)
    kept = []
    prev_sep = ""
    for idx, (seg, sep) in enumerate(segs):
        hit = None
        for name, rx in SEG_RULES:
            if rx.search(seg):
                hit = name
                break
        if hit:
            hits["segment: " + hit] += 1
            moved.append(seg + (sep if sep == ";" else ""))
        else:
            orig = seg
            for name, rx, rep in INLINE_RULES:
                new = rx.sub(rep, seg)
                if new != seg:
                    hits["inline: " + name] += 1
                    moved.append(rx.search(seg).group(0).strip())
                    seg = new
            for rx, rep in REWRITES:
                new = rx.sub(rep, seg)
                if new != seg:
                    hits["rewrite: " + rx.pattern[:30]] += 1
                    moved.append("(reworded) " + seg)
                    seg = new
            seg = seg.strip()
            if seg:
                kept.append((seg, sep, idx, prev_sep))
        prev_sep = sep
    public = rebuild(kept) if kept else ""
    public = re.sub(r"^[\s.;,]+", "", public).strip()
    if moved:
        public = re.sub(r"[,;:]+\.$", ".", public)       # a list that an earlier agent had cut off ("Derby,;") ends cleanly
    return public, moved, hits


# ----------------------------------------------------------------------------------------------------------------
# 3. name cells: remarks about how the name was found
# ----------------------------------------------------------------------------------------------------------------
NAME_PAREN = re.compile(r"\s*\((?:[^()]*\b(?:fetched|disambiguation|per English Wikipedia|per encyclopedia|Hebrew Wikipedia title|given site|not stated|identification|site's own)\b[^()]*)\)", I)


def clean_name_cell(v):
    moved = [m.group(0).strip() for m in NAME_PAREN.finditer(v)]
    return (NAME_PAREN.sub("", v).strip(), moved) if moved else (v, [])


# ----------------------------------------------------------------------------------------------------------------
def migrate(rows):
    """rows: data rows (no header), changed in place.  -> (stats dict, hits Counter, changed examples)"""
    hits, st, ex = Counter(), Counter(), []
    for r in rows:
        if len(r) < NCOL:
            r.extend([""] * (NCOL - len(r)))
            st["padded"] += 1
        before = r[COMMENT]
        pub, moved, h = split_comment(before)
        for _ in range(3):      # a cut can expose another remark (e.g. after a rewrite): repeat until nothing more moves
            pub2, moved2, h2 = split_comment(pub)
            if not moved2:
                break
            pub, moved, h = pub2, moved + moved2, h + h2
        nm, nmoved = clean_name_cell(r[CITY_OTHER])
        if nmoved:
            r[CITY_OTHER] = nm
            moved += ["[name] " + x for x in nmoved]
            hits["name cell parenthetical"] += len(nmoved)
        if moved:
            hits.update(h)
            r[COMMENT] = pub
            r[PROC] = (r[PROC] + JOIN if r[PROC] else "") + JOIN.join(moved)
            st["rows changed"] += 1
            if not pub:
                st["comment now empty"] += 1
            if len(ex) < 4000:
                ex.append((r, before))
    return st, hits, ex


def main():
    sample = 40
    report = None
    args = sys.argv[1:]
    if "--sample" in args:
        sample = int(args[args.index("--sample") + 1])
    if "--report" in args:
        report = args[args.index("--report") + 1]
    with open(KEH, encoding="utf-8-sig", newline="") as f:
        rd = csv.reader(f)
        header = next(rd)
        data = list(rd)
    if len(header) < NCOL:
        header = header[:19] + [PROC_COL]
    st, hits, ex = migrate(data)
    print("rows %d | padded to %d columns: %d | rows with moved text: %d | comment emptied: %d" % (len(data), NCOL, st["padded"], st["rows changed"], st["comment now empty"]))
    for k, v in hits.most_common():
        print("%7d  %s" % (v, k))
    pub_b = sum(len(r[COMMENT].encode()) for r in data)
    proc_b = sum(len(r[PROC].encode()) for r in data)
    print("bytes: public notes %d, process_notes %d" % (pub_b, proc_b))
    if report:
        os.makedirs(report, exist_ok=True)
        with open(os.path.join(report, "samples.txt"), "w", encoding="utf-8") as f:
            for r, before in ex:
                f.write("%s | %s | %s\n  BEFORE: %s\n  AFTER : %s\n  MOVED : %s\n\n" % (r[0], r[1], r[5], before[:1500], r[COMMENT][:1500], r[PROC][:1500]))
    if "apply" in args and not (st["rows changed"] or st["padded"]):
        print("Nothing to move or pad: kehilot.csv left untouched.")
    elif "apply" in args:
        backup = KEH.replace("kehilot.csv", "kehilot_backup_%s_pre_process_notes.csv" % datetime.now().strftime("%Y%m%d_%H%M%S"))
        shutil.copy(KEH, backup)
        with open(KEH, "w", encoding="utf-8", newline="") as f:
            w = csv.writer(f)
            w.writerow(header)
            w.writerows(data)
        print("Backup:", backup)
        print("kehilot.csv written with", len(header), "columns")
    else:
        print("Dry run only -- pass 'apply' to write.")


if __name__ == "__main__":
    main()
