import csv
import re
from pathlib import Path


def build_wikipedia_url(title_en: str) -> str:
    if not title_en:
        return ""
    # Remove parenthetical parts and normalize whitespace
    cleaned = re.sub(r"\s*\([^)]*\)\s*", " ", title_en)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return f"https://en.wikipedia.org/wiki/{cleaned.replace(' ', '_')}"


def main():
    csv_path = Path("historical_arrows.csv")
    if not csv_path.exists():
        raise SystemExit("historical_arrows.csv not found in project root")

    with csv_path.open("r", newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = [r for r in reader if any(cell.strip() for cell in r)]

    if not rows:
        raise SystemExit("historical_arrows.csv is empty")

    header = rows[0]
    if "url" not in header:
        header.append("url")

    url_index = header.index("url")

    out_rows = [header]
    for r in rows[1:]:
        # Pad row to header length
        if len(r) < len(header):
            r = r + [""] * (len(header) - len(r))

        title_en = r[8].strip() if len(r) > 8 else ""
        cur_url = r[url_index].strip() if len(r) > url_index else ""

        if not cur_url:
            r[url_index] = build_wikipedia_url(title_en)

        out_rows.append(r)

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(out_rows)

    print("historical_arrows.csv updated with URL column and values")


if __name__ == "__main__":
    main()



