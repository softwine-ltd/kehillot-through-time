# Jewish Community Population Data — Collection Pipeline Research

Research date: 2026-09-10 (updated same day after locating a 4th, more complete location). This
document maps out every script found across four locations that was used to build `kehilot.csv`,
the population-over-time dataset behind the "Kehillot Through Time" map. It is a *forensic
reconstruction* from file contents, README/CLAUDE.md notes, git history, and log files — none of
this was documented in one place before.

## ⚠️ Status update (2026-09-14) — read this before the rest of the doc

The research below (written 2026-09-10) describes the pipeline **as it was found**, including
several problems that have since been fixed through follow-up engineering work. Where a claim
below is now out of date, it's marked inline, but in short:

- The hardcoded Gemini API key described in the "Security note" was **revoked and replaced**
  (2026-09-10/13). No key is hardcoded anywhere anymore.
- Both Gemini models the pipeline used (`gemini-3-pro-preview`, `gemini-2.0-flash`) had actually
  been **shut down by Google** (2026-03-09 and 2026-06-01 respectively) — discovered and fixed
  2026-09-13. The pipeline could not have run at all until this fix.
- The pipeline is now **concurrent** (5 towns at once instead of 1), **skips already-processed
  towns** automatically, uses **country-aware search queries** instead of hardcoding a
  Poland-specific site for every country, **writes failed towns to their own file**, and the
  verification agent can now be **run at country scale** from the command line.
- France and Italy's already-collected data (see "Actionable finding" below) **has since been
  merged** — Poland, France, and Italy are now all substantially represented in `kehilot.csv`;
  Germany is the one still-unmerged country from the four already processed.

Full details, dates, and reasoning for every change: `AnacondaProjects/python_310/jew_hist/CHANGELOG.md`
(outside this repo, at `C:\Users\oferm\OneDrive\Ofer\AnacondaProjects\python_310\jew_hist\CHANGELOG.md`
— that's where the actual pipeline code lives). This
document remains useful as the record of how the pipeline came to exist and how the four
locations relate to each other — that part hasn't changed.

## ⚠️ Status update (2026-09-17) — read this too

Three days of intensive, mostly-Claude-Code-driven work happened between the 2026-09-14 update
above and now — far more than fits in a paragraph. This section summarizes it by theme; `git log`
in this repo has the full commit-by-commit detail (each commit message is written to stand alone,
with root causes and row counts). The single biggest takeaway: **`kehilot.csv` grew from roughly
19,200 rows to 21,276 rows across 131 countries (4,682 distinct town/country pairs)**, while also
going through the most thorough data-quality pass this dataset has ever had.

### Pipeline code fixes (`utils/batch_convert_to_kehilot.py`)

- **The year_end lookahead bug** (fixed 2026-09-16, commit `84cbf95`): the converter computed a
  row's `year_end` from *the very next row in the raw research file*, without checking whether
  that next row shared the same year — extremely common, since the Historian often logs several
  facts under one year. This silently produced `year_start > year_end` on **2,760 rows across 799
  towns** (found by scanning all 5,069 raw research files: 30% had same-year sibling rows). Fixed
  by scanning forward past same-year/out-of-order siblings, and by replacing a hardcoded
  `year_end = "2024"` fallback with `datetime.now().year`. All 719 towns with a matching raw file
  were re-converted and repaired; 75 towns (182 rows) with no matching raw file were left
  untouched rather than guessed at.
- **A second, related bug — "no evidence found" rows fabricating growth trends** (2026-09-16,
  `3d94bc0`, plus the original discovery in `f1471a9`): the same lookahead mechanism could chain a
  row whose own source explicitly found *no* evidence of Jewish presence to a much later,
  unrelated real value, producing a fake smooth-growth interpolation across the entire gap (e.g.
  Nowy Sącz showing a fabricated population of ~57 at 147 CE, chained from a real 1763 figure).
  Audited the whole dataset for this exact pattern and capped 15 more instances at pop_end=0
  across 6 towns (Aix-en-Provence, Antakya, Forbach, Ignalina, Sherbrooke, Prudnik).
- **`sanitize_year()` extended** (2026-09-16, `d2c5d80`) with biblical/ancient-era phrasing (`"time
  of Solomon"`, `"Babylonian period"`, `"Bar Kokhba revolt"`, etc.) and a `YEAR_BARE_CE_RE` pattern
  for small bare years with an explicit "CE" marker (`"68 CE"`) — needed to unlock ancient-Israel
  research (see below); previously these dates were silently dropped or mis-parsed.

### Security & performance (frontend, `helpers.js`)

- **Stored/reflected XSS fixed** (2026-09-16, `785e246`): every popup/tooltip builder interpolated
  data-derived text (from `kehilot.csv`, an automated scrape with no per-field sanitization, and
  from crowdsourced Nominatim geocoding) straight into `innerHTML`/Leaflet popups with no escaping
  anywhere in the codebase. Added a single `escapeHtml()` helper applied at every interpolation
  site, plus `rel="noopener noreferrer"` on every data-built external link.
- **Timeline dragging performance** (2026-09-15, `0e479d3`): `loadData()` was re-parsing the full
  CSV on every timeline slider tick. Now parsed once and cached, with markers bulk-inserted via a
  single `addLayers()` call — cut per-year-change cost from ~220ms to 15-60ms.
- **Marker opacity toggle** (2026-09-17, `0ffd466`): a "Fade Markers" button in the toolbar toggles
  all community markers between full opacity and 33%, via a CSS custom property
  (`--marker-opacity`) so it survives marker re-creation on timeline scrubbing, clustering changes,
  and language switches without touching marker-creation code. Lets the base map's own town-name
  labels show through when markers would otherwise cover them.

### Massive data growth: ~1,900 new towns merged across every populated continent

Five large batch-merge commits (2026-09-15/16) added towns that had long existed in the
master town list but were never run through the pipeline or never merged: ~767 across Poland,
Germany, France, Spain, Portugal, UK, Hungary; ~724 across Czech Republic, Slovakia, Romania,
Moldova, Bulgaria, Russia, Ukraine, Belarus, Lithuania, Latvia; ~131 across the Balkans (Albania,
Bosnia, Croatia, Kosovo, Montenegro, North Macedonia, Serbia, Slovenia); ~126 across 19 South/
Central American countries; ~151 across USA, Canada, and Mexico.

### Systematic data-quality campaigns

A long sequence of targeted fixes, mostly 2026-09-16: CSV comma-splitting corruption (551 rows
across 403 towns), all malformed rows (8 missing a comment field, 251 over-length), name-spelling
collisions merged (Würzburg/Speyer/Hrubieszów, Volodymyr/Volodymyr-Volynskyi, and others),
chronology inversions (Niederbreisig, Jasionówka, Oghuz's fabricated 1750 BCE settlement date, 8
Azerbaijan errors, Brody), the "zigzag" pattern (an incidental/subset number mistaken for total
population, causing implausible dips — fixed in ~20 towns including Łódź's 1918-1938 trajectory
and Nowy Sącz), duplicate/overlapping markers merged into single popups showing every fact, and
fresh research merged for dozens of major and mid-sized population centers that were missing,
stubbed, or had only thin single-row placeholders (Warsaw, Łódź, Kyiv, Bucharest, Munich, Hannover,
Leipzig, Cologne, Wrocław/Breslau, Königsberg, Rostov-on-Don, Poltava, Gomel, Kremenchuk, Łowicz,
Sanok, Chernivtsi, Galați, Iași, and more).

### New historical depth: ancient Israel, Ephesus region, and Roman Dacia

- **Ancient Israel** (pre-5th-century-BCE settlements): 29 fabricated placeholder rows removed,
  then 222 *real* rows recovered from raw research files that the pipeline's own bugs had lost
  (the `sanitize_year()` gap above, plus a `should_skip_file()` edge case wrongly treating a
  meaningful "population=0" claim the same as a genuine no-evidence placeholder) — see
  `c83ba34`/`8f8fcfc`.
- **Asia Minor**: added missing Sardis/Pergamon/Smyrna rows and corrected Ephesus's understated
  population, all citing the same 4th-century-BCE Turkish-Jewish-settlements source.
- **Roman Dacia** (106-271 CE) and Plovdiv: 8 rows added from a user-supplied Hebrew map/text
  citing archaeological finds (Bar Kokhba-era coins, a Star-of-David object, a Tetragrammaton
  curse tablet) at Sarmizegetusa, Apulum, Porolissum, Tibiscum, Dierna, Ilișua, Poiana, and
  Plovdiv's ancient synagogue — all using the dataset's "presence attested" convention
  (population=1) since these are epigraphic/archaeological finds, not censuses.

### The Poland / former-Pale-of-Settlement long tail (ongoing initiative)

Prompted by comparing the dataset's pre-WW2 Europe total (~6.17M in 1939, computed from the data)
against the accepted historical figure (~9.5M) — the ~3.3M gap concentrates in Poland and the
former Pale of Settlement (much of which now falls under Ukraine/Belarus/Lithuania borders). Two
batches so far, both cross-referencing Wikipedia's shtetl lists against existing town coverage:
a 32-town pilot (27 yielded data, +68K to the estimate) and a 301-town follow-up (in progress as
of this writing). A third, smaller batch targeted CRARG's (Częstochowa-Radomsko Area Research
Group) named "core towns" specifically, since that site states with certainty a community existed
in each one — 36 of 38 core towns were already covered; the 2 gaps plus 15 gaps from CRARG's wider
"towns in the area" list are queued.

### Americas coverage audit

A user-prompted spot-check of major North/South American Jewish population centers found 4
outright gaps (Mexico City, Fort Lauderdale, West Palm Beach, Berkeley) and 10 towns with only a
single placeholder row spanning 80-180+ years (Chicago, Philadelphia, Boston, San Francisco,
Oakland, and 5 South American cities) — the same fabricated-smooth-interpolation risk pattern
described above, just never caught because these are outside Europe. Ran all 15 through the
pipeline: 9 yielded clean real data (merged), Philadelphia's raw extraction was 46 near-duplicate
rows breaking one 1970 census down by neighborhood rather than a timeline (filtered to its 2
genuine city/metro figures before merging), and 5 (Chicago, Oakland, Berkeley, Rio de Janeiro,
Santiago) found 30+ sources apiece but zero extractable population numbers — a real pipeline
limitation, not a settings issue. When a user supplies specific working links for a town the
pipeline can't crack (as happened for Chęciny, Poland — see Hebrew Wikipedia + Yad Vashem's ghetto
encyclopedia), manually curating a sourced timeline from those pages works well as a fallback.

### Current scale (measured 2026-09-17)

| Metric | Value |
|---|---:|
| Total data rows | 21,276 |
| Distinct countries | 131 |
| Distinct (country, city) pairs | 4,682 |
| Poland rows / distinct towns | 4,814 / 560 |
| Europe pre-WW2 (1939) population estimate | ~6.24M (accepted historical figure: ~9.5M) |

### If you want to resume *this* work specifically

1. Merge the 301-town and CRARG batches once their background runs finish (candidates/scripts for
   CRARG are prepared in the session's scratchpad as of this writing, if it hasn't run yet).
2. The long tail is far from closed — one Wikipedia list page isn't exhaustive. A proper push
   needs a more comprehensive gazetteer (JewishGen's Communities Database would be the gold
   standard) and/or revisiting existing towns whose population estimate rests on interpolation
   rather than a real census-year data point.
3. Chicago, Oakland, Berkeley, Rio de Janeiro, and Santiago need either better search queries or
   user-supplied source links (per the Chęciny pattern above) — the automated pipeline has now
   failed on all of them twice.
4. See the original "If you want to resume this work" section below for the still-relevant
   Germany-merge and Spain-collection pointers from the 2026-09-14 update.

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

**Architecture — 4 cooperating scripts** (model IDs and query logic below reflect the
2026-09-13/14 fixes — see the status update at the top of this doc; originally this ran
`gemini-2.0-flash`/`gemini-3-pro-preview`, both since discovered to have been shut down by
Google, and Scout's third query used to hardcode Poland's site for every country):
1. **`ScoutAgentURLSearcher.py`** (`ScoutAgent`) — runs 3 targeted Google-search queries per town
   via Gemini 3.8 Flash's built-in Google Search tool (quoted town name + country, plus a
   Yizkor/Pinkas-book query and a third query that now uses a per-country specialty archive —
   `sztetl.org.pl` for Poland, `alemannia-judaica.de` for Germany, `cdec.it` for Italy,
   `judaisme-alsalor.fr` for France, falling back to JewishGen+YIVO for any other country),
   extracts and de-duplicates URLs from the grounding metadata, and resolves Google's redirect
   URLs to final destinations.
2. **`LibrarianAgentContentFetcher.py`** (`LibrarianAgent`) — fetches each URL, detects login
   walls/CAPTCHAs (special-cased for JewishGen, which returns HTTP 200 with a login prompt),
   extracts clean text from HTML (BeautifulSoup) or PDF (PyMuPDF/`fitz`), auto-follows "download
   PDF" links found on the page, saves everything to `jew_hist/downloaded_sources/<Town>_<Country>/`
   (3,909 town folders currently on disk), and validates the town name actually appears in the
   fetched text before using it.
3. **`HistorianDataExtractor.py`** (`HistorianOrchestrator`) — feeds all the combined source text
   to **Gemini 3.1 Pro Preview** with a detailed extraction prompt (PhD-historian persona; strict
   rules distinguishing *Jewish* population from general town population; family-count→individuals
   ×5 conversion with `~` prefix; one-row-per-fact with exact source citation; a mandatory "no
   evidence found" row when nothing turns up). Output: `jew_hist/csv_files/city_data_<Town>_<Country>.csv`
   (everything) plus `city_data_population_only_<Town>_<Country>.csv` (rows with an actual number).
4. **`DataVerificationAgent.py`** (`DataVerifier`) — a QA pass, now runnable at country scale
   (`python DataVerificationAgent.py --country Italy`): re-fetches each cited URL and asks Gemini
   to confirm the specific claim (year/population/note) is actually supported by that source
   text, logging PASS/FAIL/mismatch per row to `verification_report_*.log` and printing a final
   verified/mismatch/name-mismatch/inaccessible summary.

**Orchestrated per-country** by `historical_data_extraction_poland.py` (the filename is stale —
it's a generic loop; as last saved it was configured for `target_country = 'Italy'`), which reads
the master Excel town list, filters to one country, skips towns already processed, and runs the
rest concurrently (5 towns at once) with retry/backoff on rate limits. Any town that still fails
after 3 retries is written to `log_files/failed_towns_<country>_<timestamp>.csv` for easy retry.
Progress is logged to `jew_hist/log_files/extraction_log_*.log` — the largest log file is 2.9MB,
consistent with a run spanning thousands of towns.

**Scale actually achieved** (counting files in `jew_hist/csv_files/` as of this research):

| Country | Town files (`city_data_*`) | Towns with actual population data found |
|---|---:|---:|
| France | 1,714 | 842 |
| Italy | 1,314 | 650 |
| Germany | 1,086 | 521 |
| Poland | 741 | 356 |

**⚠️ Actionable finding (as of 2026-09-10; RESOLVED for France/Italy by 2026-09-14) — a lot of
already-collected data was never merged into the live site.**
At the time of this research, Poland had 2,200 rows in `kehilot.csv` (consistent with all 356
population-bearing towns being merged), but France had only 177 rows despite 842 researched
towns with real data, and Italy only 89 despite 650 — Germany's 567 looked roughly complete
relative to its 521. **France and Italy have since been run through
`utils/batch_convert_to_kehilot.py`** (the headless replacement for `csv_converter_gui.py`, see
the engineering changelog) and merged. **Germany remains the one country from this batch that
still hasn't been merged** — same command, pointed at
`city_data_population_only_*_Germany.csv`, is the next fastest win.

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

✅ **Security note — RESOLVED 2026-09-10/13** (originally: a real Gemini API key was hardcoded in
plaintext across 10 files in two project folders — `ScoutAgentURLSearcher.py`,
`HistorianDataExtractor.py` (both copies), `DataVerificationAgent.py`, `historical_data_extraction_poland.py`,
`try_gemini_api.py`, `check_gemini_model.py`, `check_models.py`, plus `research_ideas_config.json`/
`research_ideas_vor_config.json` for an unrelated tool). The key was revoked in Google AI Studio,
every hardcoded fallback was removed in favor of `os.getenv("GEMINI_API_KEY")` with no literal
fallback, and a new key was set in `.env` on 2026-09-13. No key is hardcoded anywhere anymore —
see `jew_hist/CHANGELOG.md` for the full file list and dates.

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
| 2026-01-16 → 2026-02-10 | Large `jew_hist/` runs continue for France, Italy, Germany (multi-MB logs, thousands of towns) |
| 2026-09-10 → 2026-09-14 | Engineering pass: hardcoded API key removed (10 files), both deprecated Gemini models replaced, temperature corrected for Gemini 3.x, pipeline made concurrent with skip-logic/country-aware queries/failure tracking, verification agent made batchable, France and Italy merged into `kehilot.csv` — full details in `jew_hist/CHANGELOG.md` |

## Site bugs found and fixed (2026-09-11)

Unrelated to the data pipeline, but discovered in the same investigation: the site appeared to
show raw translation keys (`ui.speed`, `mspLabels.local`, etc.) instead of translated text, and
the map was completely empty. Root cause was how the page was being opened, not a code
regression: opening `index.html` directly (`file://...`) has every `fetch()` call (translations
*and* map data) blocked by the browser's CORS policy for local files, and `http://0.0.0.0:8000`
(the URL the README told you to use) isn't something a browser can actually navigate to —
`0.0.0.0` is a server bind address, not a client address. Fixed `README.md` to say
`http://localhost:8000` and to warn against opening `index.html` directly. Also fixed one real,
separate bug found while investigating: `i18n.js`'s `document.body.classList` call had no null
guard and could throw if the page's DOM wasn't fully parsed yet when it ran (a timing-dependent
race, not what caused the symptoms above, but worth closing) — `i18n.js`'s `init()` now waits for
`DOMContentLoaded` before touching the DOM. **Both fixes are currently uncommitted** in this repo
(`git status` shows `i18n.js` and `README.md` as modified) — say the word if you want them
committed and pushed.

## If you want to resume this work

1. **Fastest remaining win: merge Germany.** Point `utils/batch_convert_to_kehilot.py` (the
   headless replacement for `csv_converter_gui.py` — no GUI needed, and it merges straight into
   `kehilot.csv` with an automatic backup and duplicate-row skipping) at
   `jew_hist/csv_files/city_data_population_only_*_Germany.csv`. France and Italy's equivalent
   files have already been merged this way.
2. **To collect more towns the AI way**: re-run `jew_hist/historical_data_extraction_poland.py`
   with `target_country` set to whatever's left uncovered in the master Excel list (Spain is the
   largest untouched country: 7,143 towns). It's now concurrent and skips already-done towns
   automatically, so re-running a partially-done country is safe and won't re-bill finished work.
   Watch the log for repeated `429`/rate-limit retries and lower `MAX_WORKERS` if you see a lot of
   them — 5 is an untested guess at a safe concurrency level.
3. **To run the verification pass**: `python jew_hist/DataVerificationAgent.py --country <Name>`
   now fact-checks every collected town for a country in one command and prints a pass/fail
   summary — worth running on Germany before merging it, given the AI extraction's known
   hallucination risk (the prompts themselves are full of anti-hallucination rules precisely
   because this was a real problem during development).
4. **To add more towns the old manual way**: `utils/prompt1.txt` (or the more refined
   `AnacondaProjects/python_310/prompt_in_grok_api.txt`) against an LLM chat, then
   `utils/batch_convert_to_kehilot.py` as before.
5. **`iijg/` is not worth continuing as-is** — it never solved the population-extraction problem,
   only place names.
6. **Before any of the above**: `AnacondaProjects/python_310/venv/` is broken (its `pyvenv.cfg`
   points at a Python 3.11 install that no longer exists on this machine) — recreate it, or use a
   small dedicated venv with just `google-genai pandas openpyxl requests beautifulsoup4
   python-dotenv pymupdf` installed, before running any `jew_hist/` script.
