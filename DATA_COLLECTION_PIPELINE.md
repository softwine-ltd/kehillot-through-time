# Jewish Community Population Data — Collection Pipeline Research

Research date: 2026-09-10 (updated same day after locating a 4th, more complete location). This
document maps out every script found across four locations that was used to build `kehilot.csv`,
the population-over-time dataset behind the "Kehillot Through Time" map. It is a *forensic
reconstruction* from file contents, README/CLAUDE.md notes, git history, and log files — none of
this was documented in one place before.

## The four locations

| Location | Role |
|---|---|
| `kehillot-through-time/` (root) | The web site itself, plus `kehilot.csv` (the live dataset) and raw research dumps in `data_temp/` |
| `kehillot-through-time/utils/` | The manual/semi-manual toolkit — the GUI that turns research output into `kehilot.csv` rows, plus one-off enrichment scripts |
| `iijg/` | A one-off, abandoned attempt to mine population figures from the IIJG historical map website |
| **`AnacondaProjects/python_310/`** (esp. `jew_hist/`) | **The real, large-scale, currently-most-advanced pipeline** — a multi-agent AI research system that has already processed ~4,900 towns across 4 countries. This is where `try_old_lenovo/HistorianDataExtractor.py` actually lives and runs; the copy in `try_old_lenovo` is a stray duplicate missing two dependency files. |

`AnacondaProjects/python_310/` already has its own `CLAUDE.md` (written earlier, independently of
this research) describing it as "a personal, long-running Python experimentation workspace" with
hundreds of unrelated scripts — the Jewish-history work is its one real sub-project, isolated in
`jew_hist/`.

## The big picture: three generations of the pipeline, one shared master town list

Almost every script across all four locations — old and new — ultimately reads from the same
source: **`C:\Users\oferm\OneDrive\Ofer\europe_jews\european_cities_full_names_20250829_174341.xlsx`**
(a ~2,700-row+ master list of towns with country, name, longitude, latitude, and a CSV twin of the
same name). This one file is the backbone that ties the `kehillot-through-time/utils/` enrichment
scripts, the early `try_grok_api.py`/`try_gemini_api.py` experiments, and the full `jew_hist/`
pipeline together — they're all working off the same town roster, just at different points in
time and with different tooling. The `europe_jews/` folder itself is a large personal reference
library (population-history PDFs like DellaPergola's *World Jewish Population* AJYB report,
scanned map images, older spreadsheet drafts) — not code, but worth knowing about if you need
source material.

### Generation 1 (Sep 2025): hand-curated seed data — abandoned
`kehillot-through-time/utils/web_data_collector.py`, `collect_real_data.py`, and
`data_collection_template.py` (2025-09-21) hardcode population figures for ~8 major European
cities directly in Python and append them to `kehilot.csv`. Proof-of-concept only, not part of the
ongoing workflow. Two small audit scripts from the same day: `find_single_line_towns.py` (lists
towns with only one data row — thin data) and `sort_event_csv_by_year.py`.

### Generation 2 (Sep–Dec 2025): manual LLM research + GUI conversion — your recollection, confirmed
This is the two-step process you remembered, entirely inside `kehillot-through-time/`:

**Step 1 — research prompt, run by hand.** `utils/prompt1.txt` asks an LLM (per the
`data_temp/*_grok.txt` filenames, this was Grok's chat interface) to research one town's Jewish
history and return a 9-column CSV-ish block (country, town, long, lat, first-Jewish-year,
population-by-year table, sources), separated by a literal `********`. Every file in
`kehillot-through-time/data_temp/` (`Baghdad_from_grok.txt`, `Rome_from_grok.txt`, `poland_grok.txt`,
`Azerbaijan_grok.txt`, `lviv_grok.txt`, etc.) is a saved reply from manually pasting this prompt,
one region/town at a time — there is no code that ran these automatically.

**Step 2 — filtering/reformatting via the GUI.** `utils/csv_converter_gui.py` (Tkinter, ~1,300
lines) is **the GUI program you remembered**. It auto-detects 9-column "raw" input vs. 19-column
"already `kehilot.csv` format," converts raw rows (computing `year_end`/`pop_end` from the next
row, converting DMS coordinates, skipping towns with no real population data), enriches city names
in Hebrew/Yiddish/German via Wikipedia interlanguage links (cached in `utils/city_names_cache.json`),
lets you review/edit in a table, and saves/merges to CSV — including merging *multiple* files at
once into `kehilot_combined_<timestamp>.csv`. Documented in `utils/README_CSV_Converter.md`.

Later additions in `utils/` (Dec 2025) did further enrichment: `collect_alternative_citu_names.py`
(OpenStreetMap Nominatim reverse-geocoding for alt names → `city_alternatives.json`),
`convert_alternative_names_to_languages.py` (language-detects those names →
`city_alternatives_with_languages.json`), `add_urls_to_historical_arrows.py` (backfills Wikipedia
URLs into `historical_arrows.csv`, the separate migration-arrows dataset).

### `iijg/` — abandoned scraping attempt (unrelated timeline, likely also ~Sep 2025)
Meant to mine IIJG's interactive historical maps (1750/1800-50/1900-30/1950). The scripts here only
ever automated the *place-name* extraction from the map's raw HTML image-map data
(`data_iijg*.txt` → `decode_html_entities*.py` → decoded place names) — the actual population
numbers live behind a separate `show_popup(id)` JS call that was never captured. `iijg_data_collector.py`
is just an interactive terminal helper for typing in manually-read popup data. **No evidence any
bulk data from here made it into `kehilot.csv`.**

### Generation 3 (Dec 2025 – Feb 2026): the AI agent pipeline — real, large-scale, and still the most advanced

This is what `try_old_lenovo/HistorianDataExtractor.py` is a fragment of. The **complete, working**
version lives in `AnacondaProjects/python_310/jew_hist/`, and it is by far the largest effort of
the four locations:

**Architecture — 4 cooperating scripts:**
1. **`ScoutAgentURLSearcher.py`** (`ScoutAgent`) — runs 3 targeted Google-search queries per town
   via Gemini 2.0 Flash's built-in Google Search tool (quoted town name + country, plus
   `site:sztetl.org.pl OR site:jewishgen.org` and Yizkor/Pinkas-book-specific queries), extracts
   and de-duplicates URLs from the grounding metadata, and resolves Google's redirect URLs to
   final destinations.
2. **`LibrarianAgentContentFetcher.py`** (`LibrarianAgent`) — fetches each URL, detects login
   walls/CAPTCHAs (special-cased for JewishGen, which returns HTTP 200 with a login prompt),
   extracts clean text from HTML (BeautifulSoup) or PDF (PyMuPDF/`fitz`), auto-follows "download
   PDF" links found on the page, saves everything to `jew_hist/downloaded_sources/<Town>_<Country>/`
   (3,909 town folders currently on disk), and validates the town name actually appears in the
   fetched text before using it.
3. **`HistorianDataExtractor.py`** (`HistorianOrchestrator`) — feeds all the combined source text
   to **Gemini 3 Pro Preview** with a detailed extraction prompt (PhD-historian persona; strict
   rules distinguishing *Jewish* population from general town population; family-count→individuals
   ×5 conversion with `~` prefix; one-row-per-fact with exact source citation; a mandatory "no
   evidence found" row when nothing turns up). Output: `jew_hist/csv_files/city_data_<Town>_<Country>.csv`
   (everything) plus `city_data_population_only_<Town>_<Country>.csv` (rows with an actual number).
4. **`DataVerificationAgent.py`** (`DataVerifier`) — a separate QA pass: re-fetches each cited URL
   and asks Gemini to confirm the specific claim (year/population/note) is actually supported by
   that source text, logging PASS/FAIL/mismatch per row to a `verification_report_*.log`.

**Orchestrated per-country** by `historical_data_extraction_poland.py` (the filename is stale —
it's a generic loop; as last saved it was configured for `target_country = 'Italy'`), which reads
the master Excel town list, filters to one country, and calls the pipeline per town with retry/
backoff on rate limits. Progress is logged to `jew_hist/log_files/extraction_log_*.log` — the
largest log file is 2.9MB, consistent with a run spanning thousands of towns.

**Scale actually achieved** (counting files in `jew_hist/csv_files/` as of this research):

| Country | Town files (`city_data_*`) | Towns with actual population data found |
|---|---:|---:|
| France | 1,714 | 842 |
| Italy | 1,314 | 650 |
| Germany | 1,086 | 521 |
| Poland | 741 | 356 |

**⚠️ Actionable finding — a lot of already-collected data was never merged into the live site.**
Comparing the table above to how many rows each country currently has in `kehillot-through-time/kehilot.csv`:
Poland has 2,200 rows (consistent with all 356 population-bearing towns being merged, at several
rows/periods each), but **France has only 177 rows despite 842 researched towns with real data,
and Italy only 89 rows despite 650** — Germany's 567 rows look roughly complete relative to its
521. In other words: **France and Italy have hundreds of already-researched, already-verified-ish
towns sitting in `jew_hist/csv_files/city_data_population_only_*_France.csv` /
`*_Italy.csv` that never got run through `csv_converter_gui.py` and merged into `kehilot.csv`.**
This is very likely the fastest way to grow the site's dataset right now — no new AI calls needed,
just the merge step.

**Confirmed link back to the site:** two files sitting directly in `jew_hist/csv_files/` —
`kehilot_combined_20251226_144218.csv` (19 rows) and `kehilot_combined_20251227_233616.csv` (321
rows, e.g. a full multi-period Brzesko, Poland entry sourced from JewishGen Yizkor books) — are
exactly the merged-output filename pattern `csv_converter_gui.py` produces when you convert
multiple files at once. This proves the Generation-2 GUI tool was pointed at Generation-3's output
at least twice, which is how the bulk of Poland's 2,200 rows likely got into `kehilot.csv`.

**Two smaller, earlier/parallel experiments** (root of `AnacondaProjects/python_310/`, mostly Aug–Nov
2025, predating the full 4-agent pipeline): `try_grok_api.py` and `try_gemini_api.py` are simpler
single-call-per-town scripts (no separate Scout/Librarian split — they rely on the model's own
web-search grounding) using a heavily-iterated "anti-hallucination" version of the same 9-column
prompt (see `prompt_in_grok_api.txt` / `prompt_in_grokcom.txt` — a much more detailed descendant of
`kehillot-through-time/utils/prompt1.txt`, adding an explicit "no evidence found" protocol and a
requirement to check specific named sources: Jewish Virtual Library, YIVO Encyclopedia, Virtual
Shtetl, JewishGen, Wikipedia EN/HE/local-language, Jewish Encyclopedia). These produced the
`city_data_<Country>_<model>_<description>.csv` / `city_data_with_text_...txt` file pairs sitting
at the `AnacondaProjects/python_310/` root (Spain, Germany, multiple Poland variants tagged
`grok-4`, `gemini-3-pro-preview`, `gemini-2.5-flash`, each with a "revised_prompt_optimized"
timestamp — evidence of repeated prompt-tuning passes on the same handful of test towns, e.g.
Toledo/Lublin, before scaling up). `filter_not_found_communities.py` prunes an Excel town list of
rows already marked "not found"/"no evidence" — a helper for managing what's left to research.

⚠️ **Security note — a real Gemini API key is hardcoded in plaintext across at least 6 files in
two separate project folders**: `AnacondaProjects/python_310/jew_hist/ScoutAgentURLSearcher.py`,
`HistorianDataExtractor.py`, `DataVerificationAgent.py` (as a fallback), `try_gemini_api.py`, and
both copies of `HistorianDataExtractor.py` (here and in `try_old_lenovo/`) — all using the literal
key `AIzaSyD1OABi79dPEEe7KqZ01p0HHpGL85GIzfA`. The `AnacondaProjects` `CLAUDE.md` already flags
this as a known issue and recommends reading secrets via `os.getenv(...)` with no hardcoded
fallback (a `.env` file with `GEMINI_API_KEY` already exists there, but several scripts fall back
to the literal key instead of requiring it). Given how widely this key is copy-pasted, **treat it
as burned — rotate/revoke it in Google AI Studio and update `.env`**, then remove the hardcoded
fallbacks.

## Chronology

| Date | Event |
|---|---|
| 2025-08-21 → 2025-08-29 | Master town list built: `europe_jews/european_cities_full_names_20250829_174341.xlsx` |
| 2025-09-01 → 2025-09-04 | Early single-call Grok/Gemini experiments at `AnacondaProjects` root (Poland, Austria, Germany, Belarus test batches) |
| 2025-09-21 | `kehillot-through-time/utils/` created; Gen-1 hardcoded scripts + `prompt1.txt` (Gen-2 prompt) added |
| 2025-09-28 | `csv_converter_gui.py` added — Gen-2's real pipeline begins |
| ~2025-09 (undated) | `iijg/` scraping attempt — abandoned after place-name extraction only |
| 2025-10-01 → 2025-12-27 | GUI iterated; bulk of the manual grok-research `data_temp/*_grok.txt` + `*_kehilot.csv` conversions happen |
| 2025-10-10 | More single-call experiments (`try_grok_api.py` "anti-hallucination" prompt tuning, Spain/Germany) |
| 2025-12-21 → 2025-12-23 | `jew_hist/` 4-agent pipeline built (Scout, Librarian, Historian, Verifier) |
| 2025-12-22 → 2025-12-29 | First large `jew_hist/` extraction runs (log files up to 1.2MB); `kehilot_combined_*.csv` merges produced — Poland-heavy |
| 2025-12-26 → 2025-12-29 | `kehillot-through-time/utils/` alt-name enrichment scripts added |
| 2026-01-16 → 2026-02-10 | Large `jew_hist/` runs continue for France, Italy, Germany (multi-MB logs, thousands of towns) — **this output does not appear fully merged into `kehilot.csv` yet** |

## If you want to resume this work

1. **Fastest win: merge what's already collected.** Point `utils/csv_converter_gui.py` at
   `jew_hist/csv_files/city_data_population_only_*_France.csv` and `*_Italy.csv` (842 and 650
   town files respectively) to pull in data that's already been researched and filtered but never
   made it into `kehilot.csv`.
2. **To collect more towns the AI way**: re-run `jew_hist/historical_data_extraction_poland.py`
   with `target_country` set to whatever's left uncovered in the master Excel list, after rotating
   the exposed API key and fixing the `.env` fallback pattern.
3. **To run the verification pass**: `jew_hist/DataVerificationAgent.py` can fact-check any
   `city_data_*.csv` against its cited sources before you trust it enough to merge — worth running
   on France/Italy before the bulk merge in step 1, given the AI extraction's known hallucination
   risk (the prompts themselves are full of anti-hallucination rules precisely because this was a
   real problem during development).
4. **To add more towns the old manual way**: `utils/prompt1.txt` (or the more refined
   `AnacondaProjects/python_310/prompt_in_grok_api.txt`) against an LLM chat, then
   `csv_converter_gui.py` as before.
5. **`iijg/` is not worth continuing as-is** — it never solved the population-extraction problem,
   only place names.
