# 01 — Should the moved source links be shown to visitors?

## Source of the task
`DATA_COLLECTION_PIPELINE.md`, section "Public Notes vs `process_notes` (2026-10-26)", line 1403:

> Open owner decision: the `[Source detail ...]`, `[Also reported by ...]` and `Further sources` links were moved with the other remarks. If they should be shown to visitors they need their own display (they are not Notes text).

## What the task is
`utils/split_process_notes.py` moved workflow remarks out of the public `comment` column into `process_notes`. The site never reads that column. Three kinds of moved text are not about the workflow. They are about the evidence:

| Tag in `process_notes` | Rows (today's `kehilot.csv`) | Example |
|---|---:|---|
| `[Source detail: ...]` | 2,449 | `[Source detail: (Encyclopaedia Iranica, 'Bukhara vii. Bukharan Jews' (Michael Zand), IV/5, pp. 530-545, fetched)]` |
| `[Also reported by: ...]` | 1,522 | `[Also reported by: https://www.yadvashem.org/articles/general/jews-in-albania.html]` |
| `Further sources: ...` | 395 | `Further sources: https://jewishvirtuallibrary.org/alexandria;` |

Visitors can no longer see any of this. The decision is whether to show it again, and how.

## Recommendation
**Show them, but in their own popup line, not in the Notes text.**
1. Add a "More sources" line to the town popup and history drawer, under the main source link. It would list the `Also reported by` and `Further sources` URLs as links.
2. Add the `Source detail` text (book, article, page) after the main source link as a short citation in smaller type.
3. Keep them stored where they are now. The loader can take a 21st column, or parse the three tags out of `process_notes` with a fixed regular expression. A separate column, for example `extra_sources`, is cleaner. `split_process_notes.py` would write it, and `validate_kehilot.py` would check it.

## Why
- These are evidence, not workflow. A second source that confirms a number is the strongest support a row can have. For a row whose main link is dead or blocked (Yad Vashem, Virtual Shtetl, Encyclopaedia Iranica often refuse automated access, per the 2026-09-28 section), the extra link is often the only one a visitor can open.
- `Source detail` holds the page and table reference for book sources. Without it, a visitor cannot check a figure taken from a printed book.
- The project already treats verifiability as a goal: there were fabricated-citation clean-ups in 2026-09-17, and every merged URL was fetched. Hiding confirming sources works against that.
- Putting them back into the Notes text would undo the clean split between visitor text and workflow text. That is why a separate display is better.

## Basis
The project's own documents and a count over `kehilot.csv`. The recommendation is my own judgement, not taken from a source.
