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

### Current scale (measured 2026-09-17, morning)

| Metric | Value |
|---|---:|
| Total data rows | 21,276 |
| Distinct countries | 131 |
| Distinct (country, city) pairs | 4,682 |
| Poland rows / distinct towns | 4,814 / 560 |
| Europe pre-WW2 (1939) population estimate | ~6.24M (accepted historical figure: ~9.5M) |

### If you want to resume *this* work specifically

1. ✅ **Done** — the 301-town Poland/Pale batch and the CRARG follow-up batch (19 towns) both
   completed and merged the same day.
2. The long tail is far from closed — one Wikipedia list page isn't exhaustive. A proper push
   needs a more comprehensive gazetteer (JewishGen's Communities Database would be the gold
   standard) and/or revisiting existing towns whose population estimate rests on interpolation
   rather than a real census-year data point.
3. Chicago, Oakland, Berkeley, Rio de Janeiro, and Santiago need either better search queries or
   user-supplied source links (per the Chęciny pattern above) — the automated pipeline has now
   failed on all of them twice. (Update: 9 of the original 15 Americas gaps *did* yield clean data
   the same day — see the next status update below — these 5 are the ones that still haven't.)
4. See the original "If you want to resume this work" section below for the still-relevant
   Germany-merge and Spain-collection pointers from the 2026-09-14 update.

## ⚠️ Status update (2026-09-17, continued) — a second full day of work, and a new bug class

Everything below happened *after* the update immediately above, same day. Two things dominated:
closing out the Europe long-tail work that was "in progress" above, and discovering a data-quality
bug class much bigger than anything found before — population figures that were never a town's own
resident count at all, several of them silently implying large, thriving Jewish communities in
towns whose community is a matter of settled historical record to have been destroyed.

### More batches completed: Americas gap-fill, underrepresented Europe, Belgium/Romania, and the Germany/Poland/Pale long tail

- **Americas**: the 15-town gap list above ran; 9 yielded clean data (merged), Portland OR needed
  a manual fix for a blank-year bug that chained a real 2024 "57,000+ Jews" figure backward into a
  fabricated 1850-1868 decline, and Chicago/Oakland/Berkeley/Rio de Janeiro/Santiago remain a
  genuine pipeline limitation (30+ sources found, zero extractable numbers) — still open.
- **User-supplied Americas data**: a large table of North/South American cities' historical Jewish
  populations, supplied directly by the user from their own spreadsheet, replaced ~20-28 rows that
  had been silently fabricated in an earlier session (a contiguous block using an "established in
  the 19xxs" placeholder template with no real source).
- **200 towns across underrepresented European countries** (target: Hungary, Russia, Romania,
  Belgium, Netherlands): 183 of 185 candidates succeeded and merged. A single-town Belgium re-run
  (Seraing) confirmed "no evidence found" — Belgium appears to be at its practical research
  ceiling with this pipeline and these sources.
- **Germany + Poland/Pale-of-Settlement long tail, ≥400-town target**: delivered 384 (205 Germany
  Black-Death-placeholder towns re-researched, 146 Poland/Pale/Ukraine/Belarus/Lithuania towns with
  only a single thin citation enriched, 33 genuinely new towns added — 8 Galicia, 25 Latvia). A
  first pass silently skipped 148 towns because of stale pre-existing raw research files (the
  collection script's own "skip if output exists" logic, tripped by thin files left over from an
  earlier partial run) — caught via log-diffing, stale files deleted, and all 148 successfully
  retried. **Still 16 short of the literal "at least 400" target — not revisited, flagged here for
  whoever picks this up next.**
- **Romania round 2**: 51 of 53 candidates merged (13 of an original 69 excluded as
  Bessarabia/Bukovina towns that fall in modern Moldova/Ukraine, not Romania). Recovered
  **Bucharest**, which was found to have zero rows under any spelling despite three earlier-session
  commits specifically about it — root cause not fully identified (likely lost in a later unrelated
  consolidation edit), just re-added via fresh research.

### The "Black Death" legacy fabrication (Germany)

A batch import of JewishEncyclopedia.com's list of towns hit by the 1349 Black Death pogroms had
been converted, at some point in this dataset's history, into fake flat-population-of-30 rows
spanning 1349-1942 — as if "this town appears on a medieval pogrom list" meant "and its population
was a constant 30 people for the next 600 years." Found via `'BLACK DEATH' in comment.upper()`:
219 rows total, 205 of them the *only* row for that (country, city) in Germany specifically (the
rest scattered across France, Switzerland, Austria, Netherlands, Belgium, Czech Republic, Poland).
All 205 Germany rows deleted and re-researched: **88 came back with real population data, 117 came
back with sources confirming a medieval community but no extractable population figure** — still
an improvement, since the false "30 people, 600 years" claim is gone either way.

### Kaunas: a dedicated pass on a scrambled trajectory

17 of Kaunas's 39 rows were civic/organizational subset counts — Folksbank membership, Hebrew
Gymnasia enrollment, municipal election results, a Marksmen-association membership figure, annual
death counts, a newly-annexed suburb's own count — that had been extracted and chained in as if
each one were the town's *total* Jewish population, producing swings like 3,526 → 6 → 38,000 → 224
→ 27,580 across 1929-1937. Before fixing it, checked the frontend's actual rendering logic
(`helpers.js`): each row interpolates independently over its own year span, and
`mergeSameYearFacts` takes the **max** across every row simultaneously active for a town — so the
"leave it at 0" convention used elsewhere in this dataset for narrative-only citations would have
produced fake population-*crash* years wherever nothing else happened to cover that exact span,
trading one wrong chart for another. Fix: built a trend curve from only the 22 genuinely-sourced
rows (keyed on each row's own `pop_start`, deliberately ignoring `pop_end` — several of those had
themselves been corrupted by the same bug), interpolated the 17 bad rows along that curve instead
of using their own headcount, and rebuilt every row's `pop_end` to chain correctly. Vilnius was
checked as a comparison and found clean — this looks Kaunas-specific, not systemic to Lithuania.

### New major bug class: population figures that were never the town's own residents

Discovered via a user report that **Bełżec** — the extermination camp, built at/near a real but
tiny Polish village — showed a Jewish population of 500,000 continuing indefinitely after the
Holocaust. Root cause: the camp's total *victim count* (drawn from all over Poland) had been
recorded as if it were the village's own resident population. This turned out to be one instance
of a pattern found in dozens of places once specifically searched for:

- **Regional/multi-town aggregates mislabeled as one town's population**: whole-*region* statistics
  (Upper Silesia, Wołyń Province, Cetatea Albă "entire county/district" — the source's own words)
  plotted as if they were a single town's count; a Nazi resettlement-plan deportee total (the
  **Nisko Plan**) attributed to the tiny village of Nisko itself; a combined 3-city estimate
  (Vladivostok + Khabarovsk + Birobidzhan) attributed to just one of the three; regional
  Transnistria transit-camp/deportee totals (Mohyliv-Podilskyi, Bershad, Yarmolyntsi, Sarny)
  attributed to whichever town happened to host the camp.
- **Camp-wide or massacre-wide death tolls used as a town's population**: **Brzezinka** (the
  village Auschwitz-Birkenau was built at/named after) showing the camp's full 1,000,000-victim
  toll; **Bogdanovka** showing the ~54,000-victim regional massacre toll; several Poland/Ukraine
  ghetto-liquidation and deportation-to-death-camp counts (Lublin ×3, Kozienice, Kovel's own
  memorial *victim* count) recorded as living population, not a body count.
- **A grave/cemetery count used as a population figure**: **Panevėžys** — "the Jewish cemetery
  contained 17,000 graves [as of 1945]" (a count accumulated over centuries) was chained in as the
  town's post-Holocaust population, the exact same *shape* of bug as Bełżec's 500,000.
  
- **Tourist/pilgrimage attendance used as resident population — the most surprising find**:
  **Uman**'s annual Rosh Hashanah pilgrimage (Breslov Hasidim gathering at Rabbi Nachman's grave
  for a few days a year, drawing from *outside* Ukraine) had its attendance figures — 2,000 (1990)
  climbing to a fabricated-looking 50,000 (2019) — recorded as the town's growing year-round
  resident population, even though the same dataset separately and correctly states "more than 100
  Hasidic families live in Uman year-round" (~500 people) for the present day. Six rows deleted.
- **A pre-Holocaust snapshot silently held flat for 60-100+ years, right through the community's
  well-documented destruction** — the largest category by row count. A real, well-sourced figure
  (a census, a ghetto count, "before the Nazis arrived") was left open-ended (blank `pop_end`), so
  it silently continues at that value indefinitely with no later citation acknowledging what
  actually happened. Affected towns include Pinsk, Rivne, Minsk, Vilnius, Brest, Bobruisk, Zamość,
  Ternopil, Włocławek, Częstochowa, Rzeszów, Chernihiv, Opole, Bryansk, Mogilev, Bălți, Galați,
  Bacău, Kozienice, Płońsk, Stryi, Polatsk, Nyíregyháza, and Volodymyr-Volynskyi. Two further cases
  (Vitebsk, Berdychiv) were a related-but-distinct variant: a *single row* spanning 60-100+ years
  linearly smoothed a real pre-war figure into a real post-war figure, implying a gradual decline
  where the actual history was an abrupt 1941-42 collapse.

**Fix methodology**: built a scanner mirroring the frontend's own interpolation logic
(`helpers.js loadData`) that computes, for every Eastern-European (country, city), the population
the map would actually display at a set of post-Holocaust checkpoint years (1946, 1950, ... 2020).
Flagged 73 candidates at ≥10,000; every one was individually checked against its full row history
and cited source before acting, rather than pattern-matched and bulk-deleted. Net effect: **28 rows
deleted** outright (numbers that were never any town's own population, however sourced) and **44
rows shortened** to a single point-in-time citation (a real fact about that town, just no longer
implying it held steady for decades afterward). Several neighboring rows whose `pop_end` had been
chained from a since-deleted row's value were individually re-bridged to the next surviving real
figure (or, where none exists, to their own row's own stated value) so nothing is left pointing at
a number that no longer exists anywhere in the file.

**Left alone after review** — genuinely large, well-evidenced surviving or rebuilt communities:
Moscow, Budapest, Kyiv, Bucharest, Łódź, Warsaw, Kraków, Chișinău, Dnipro, Saint Petersburg, and a
handful of Soviet-era regional-migration cities (Vinnytsia, Kropyvnytskyi, Sokyriany) that already
decline correctly on their own without any intervention.

**Flagged but deliberately not touched — needs a human call, not a heuristic:**
- **Iași, Bacău, Galați** and similar Romanian cities: Romanian Jewish wartime survival patterns
  genuinely differed from Poland/Ukraine's (deportation to Transnistria camps rather than
  on-the-spot extermination for large parts of the "Old Kingdom," with substantial return
  migration), so a multi-decade single-row "smoothing" citation in these specific cities *might* be
  closer to real history than the same pattern in a Polish shtetl — Bacău and Galați were
  eventually shortened anyway (the *held-flat-to-2026* half of the bug is unambiguous regardless of
  wartime survival nuance), but Iași's 1899-2006 single-row span was left as-is pending a closer
  read of that city's specific history.
- **Birobidzhan**: a row's `pop_start` looks like it may be chained from an aspirational
  *settlement-plan target* ("10,000 Jewish families over five years") rather than an achieved
  population, mirroring the Nisko Plan bug — flagged, not fixed, because the source material on
  this one is too thin to be confident either way.
- **Bogdanovka is geocoded to the wrong place** — 42°E/52.9°N, inside Russia, rather than the real
  Holocaust-era massacre site in Ukraine's Mykolaiv Oblast (~31.3°E/47.65°N). Almost certainly
  resolved to a same-named village elsewhere during geocoding; not fixed.
- The general pattern that made Kaunas so scrambled — a small civic/organizational subset count
  (school enrollment, club membership, election results) mistaken for total population — was only
  chased down comprehensively for Kaunas itself. It's reasonable to assume it exists in other towns
  that haven't been individually audited this way.

### Current scale (measured 2026-09-17, end of day)

| Metric | Value |
|---|---:|
| Total data rows | 26,594 |
| Distinct countries | 131 |
| Distinct (country, city) pairs | 5,116 |
| Poland rows / distinct towns | 5,898 / 644 |
| Europe pre-WW2 (1939) population estimate | ~6.84M (accepted historical figure: ~9.5M) |

### If you want to resume *this specific* work

1. **Close the last 16 towns of the "≥400" Germany/Poland/Pale target** (384 delivered).
2. **Extend the post-Holocaust integrity audit beyond Eastern Europe** and beyond the ≥10,000
   threshold used this round — the same bug class (regional aggregate, death toll, or subset
   headcount mistaken for a town's population) is a *methodology* problem in how research gets
   converted to rows, not something specific to the towns already found. A lower threshold, or a
   Western/Southern-Europe pass, would likely surface more.
3. **Make a human call on Iași/Bacău/Galați** (and similarly-shaped Romanian cities) specifically —
   the automated fix criteria used elsewhere may be too aggressive or not aggressive enough for
   Romania's different wartime demographic history.
4. **Minor, low-effort cleanup**: country-label inconsistencies sitting in the data right now —
   `Polamd` (1 row, typo for Poland), `Czech`/`Czech ` vs `Czech Republic` (14 + 2 vs 522 rows),
   `Slovakia ` with a trailing space (1 row vs 312 for the clean spelling), `North Macedonia ` with
   a trailing space (2 rows vs 27). None of these lose data, they just fragment a handful of rows
   away from their country's main bucket in any per-country aggregation.
5. Continue the Poland/Pale long-tail work per the note above (item 2 in the previous update) — a
   proper gazetteer (JewishGen's Communities Database) is still the real fix for "one Wikipedia
   list isn't exhaustive."

## ⚠️ Status update (2026-09-17, evening) — fabricated citations, and item 2 above came true

Item 2 in the previous update ("extend the post-Holocaust integrity audit... a lower threshold...
would likely surface more") turned out to be right the same day, from two separate user reports.

### 41 of 43 sztetl.org.pl citations in the dataset were fabricated, not dead

A user flagged one specific Lublin citation
(`sztetl.org.pl/en/towns/l/1037-lublin/99-history/137447-history-of-community`) as a 404. Checking
it revealed something worse than link rot: **two different towns shared byte-identical "citations"**
(Lublin and Radomsko both resolved to town-ID 1037/page-ID 137447; Sulmierzyce and Wodzisław Śląski
both resolved to 1049/137459) — impossible on a real site, and the page-ID tracked the town-ID by a
near-constant +136410 offset, the signature of a sequentially-incremented guess, not a fetched URL.
Checking all 43 unique sztetl.org.pl URLs in the live dataset directly in a browser (plain
HTTP/curl gets Cloudflare-blocked regardless of URL validity — this needed real browser navigation)
found 41 return the site's own "Page not found" page; only 2 (Warsaw, Szamotuły) are real and
content-verified. Traced to `data_temp/poland_grok.txt`, a raw hand-pasted Grok-chat research dump
from this project's pre-agentic phase (confirmed via a matching fabricated Kalisz URL sitting in
that same file). Checked the other 20 `*_grok.txt` files from the same era and the dataset's other
34 heavily-reused-URL cases for the same collision signature — found nothing else at this severity;
it looks isolated to this one batch. Deleted all 1,008 affected rows (41 dead URLs + a dead
Wikipedia link riding along in the same Lublin block) across 35 towns, then re-ran the real
Scout→Librarian→Historian pipeline against all 35: all 35 succeeded, 238 new genuinely-sourced rows
merged (3 towns — Kamień Pomorski, Kamień Śląski, Nowy Tomyśl — came back "no evidence found," a
legitimate outcome for small villages, not a pipeline failure). Confirmed the fix worked: Scout
found real, *different* sztetl.org.pl town IDs this time (real Żarnowiec is town 433, not the
fabricated 1048; real Wodzisław is 702, not 1049).

### Poland's implied Jewish population was inflated by roughly 400,000 people

Separately, a user pointed out that Poland's post-WW2 Jewish population is well documented at
~250,000, but many individual towns in the dataset still showed population > 100 despite clear
evidence of near-total elimination. Quantified it by computing, per the app's own interpolation
logic, what population the dataset implies for *all* of Poland at a given year: **530,764 in 1946**
(vs. the real ~250,000) and, far more tellingly, **402,028 in 2020** — modern Poland's actual
Jewish population is universally documented in the low thousands. This was the same "held flat"
bug already fixed for the ≥10,000 cohort elsewhere in Eastern Europe, just never extended to
Poland's ~640 towns at a realistic threshold. Systematically re-scanned every Poland row at
threshold ≥100, found 467 rows across ~280 towns that were perfectly flat (`pop_start == pop_end`
— no decline was *ever* modeled, so nothing needed re-bridging) left open-ended or extended to
2024/2026, and shortened every one to a point-in-time citation. Also found and fixed 3 towns with a
related bug — a single row spanning 100-400+ years (Baranów Sandomierski, Chodecz, Gidle) smoothing
a real pre-war figure across the entire modern era, directly overlapping and out-voting (via
`mergeSameYearFacts`'s max-across-simultaneous-rows behavior) an otherwise-correct declining
sequence already sitting in the data for the same town.

While merging the 35 re-researched towns above, the *exact same bug* reappeared in brand-new,
non-fabricated data: Lublin's fresh pipeline output included a real jewishgen.org-sourced row
("6,662 Jews were in the city," 1946) left open-ended, which the merge turned into "6,662 Jews,
1946 through 2026." This confirms the bug isn't purely legacy — it's a live methodology gap (see
`jew_hist/CHANGELOG.md`'s "Known issues" for the pipeline-side writeup and fix recommendation).
Re-scanned Poland once more at threshold ≥20 (excluding two genuinely-modern citations, Bytom 2020
and Bielsko-Biała 2005, that are reasonably held forward a few years rather than defaulting across
an 80-year gap): 130 more rows fixed the same way.

**Result**: Poland's implied total is now 159,533 (1946) / 123,266 (1950) / 39,914 (1970) / 6,123
(2020) — all within a defensible range of the historical record, down from 530,764 / 402,028
before today. The 1946 figure sitting below the real ~250,000 reflects towns with genuinely no
post-war citation at all (an honest gap now, not a fabricated one) rather than remaining inflation.

### Current scale (measured 2026-09-17, evening)

| Metric | Value |
|---|---:|
| Total data rows | 25,819 |
| Distinct countries | 131 |
| Distinct (country, city) pairs | 5,113 |
| Poland rows / distinct towns | 5,123 / 641 |
| Poland implied Jewish population, 2020 | ~6,100 (was ~402,000 this morning) |

### If you want to resume *this* work specifically

1. **Extend the ≥20 threshold post-Holocaust audit to the rest of Eastern Europe** (it was only
   re-run for Poland this round) and consider going even lower, or extending to Western/Southern
   Europe — this bug class keeps surfacing every time the threshold drops, which strongly suggests
   it isn't fully exhausted yet.
2. ✅ **Done (2026-09-17, evening)** — the pipeline-side gap is now fixed, not just the data: see
   `jew_hist/CHANGELOG.md`'s "Fixed both recurring bugs behind today's population-inflation
   findings" entry. `HistorianDataExtractor.py`'s prompt now has an explicit rule against recording
   regional/camp/death-toll/event numbers as town population, and both
   `utils/batch_convert_to_kehilot.py` and `utils/csv_converter_gui.py` now default an unresolved
   row's `year_end` to its own `year_start` (a point-in-time citation) instead of the current year —
   both changes tested in isolation, no real files touched. Not addressed: actively searching for a
   *more recent* data point when the last known one is old (the safer default just stops asserting
   stability that was never evidenced), and the separate Kaunas-style "civic subset count mistaken
   for population" pattern, which has no prompt guard yet.
3. Everything from the previous "If you want to resume" list (items 1-5 above) is still open and
   unaffected by today's work.

## ⚠️ Status update (2026-09-17, night) — the "0 means two different things" bug

A user observed that many towns with a genuinely defunct Jewish community still drew a map
marker (an empty "0" bubble) — the map had no concept of "don't draw this." Fixing that safely
required a companion data fix, since `kehilot.csv` had been using `population = 0` for two
opposite situations: "confirmed no Jews" *and* "a source documents Jewish presence — a birth
record, a synagogue, a named individual — but gives no specific count." Suppressing all
zero-population markers without fixing the second case would have made every thinly-documented
town silently vanish instead of showing at all.

**Code**: `helpers.js`'s `updateMarkers` now skips any row with `actual_pop <= 0`, right alongside
the existing invalid-coordinates skip. Verified live: 490 towns worldwide (Port Moresby,
Bridgetown, Reykjavik, etc.) whose only active rows at 2024 are zero-population are now correctly
absent instead of showing an empty marker.

**Data**: found 1,001 rows worldwide where `pop_start` and `pop_end` both resolved to 0. A first
attempt at a regex keyword classifier (negative phrases → confirmed zero, "community"/"synagogue"
→ presence) had a 30-40% false-positive rate in *both* directions — natural language has too many
ways to say "gone" (vanished, dissolved, extinguished, disbanded, "former", sold to non-Jewish
use...) for a blocklist to catch reliably, and just as many ways to mention a synagogue/community
*in the context of it ending*. Abandoned the regex approach and read all 1,001 rows directly
instead, classifying each by hand into: confirmed zero (560, left at 0), small documented presence
with no count given (307, set to population 3 with an explanatory note), or an organized
community/synagogue with no count given (134, set to population 20 with a note) — this matches the
convention the user asked for. See commit `03e8416` for the full row-by-row reasoning in the
commit message's category breakdown.

**Not done**: this was a one-time pass over the *current* dataset. Nothing prevents a future
collection run from writing a fresh 0/0 row for a "presence documented, no count" source — the
extraction prompt has no rule about this distinction yet (unlike the regional-aggregate and
open-ended-year_end rules added earlier today). Worth a future prompt addition: when a source
documents presence without a number, the Historian should note that explicitly (e.g. "Population:
UNKNOWN — presence documented") rather than defaulting to 0, so a future audit doesn't have to
redo this same 1,001-row manual read.

## ⚠️ Status update (2026-09-18) — hunting down "the old hallucinating model," Eastern Europe pass

User request: continue the long-tail East European push, but specifically go find towns whose
*existing* `kehilot.csv` data traces back to "the old and hallucinating model" — i.e. Generation 1/2
above — and redo them for real. The sztetl.org.pl fabrication (previous section) was one instance
of this; this pass looked for the rest of it.

**Found the signature, worldwide.** 282 towns (300 rows) — Prague, Bratislava, Sofia, Brno, Győr,
and hundreds more, on every continent Gen-1/2 touched — carry an identical fingerprint: a single
row, `population_start == population_end == 30`, spanning from the town's first-mention year all
the way to exactly 1942, frequently sourced to a bare Hebrew Wikipedia URL or literally
`(citation lost - legacy data entry error)`. This is Generation 1/2 writing "there was *a*
community here, some small number, until the Holocaust" for every town regardless of whether it
actually had 30 Jews or (Prague's case) tens of thousands. It never went through Scout/Librarian/
Historian, so nothing ever fetched or validated the number.

**Eastern Europe subset fixed this pass — 48 towns, 3 remediation paths depending on what else the
town already had:**
- **12 towns already had a real, already-fetched raw pipeline file sitting unmerged in
  `jew_hist/csv_files/`** (Brno, Holešov, Kojetín, Kroměříž, Lipník nad Bečvou, Olomouc, Prague,
  Prostějov, Třebíč, Boskovice, Bardejov, Wyszogród) — a prior run had already done the real
  research, it just never got converted+merged into `kehilot.csv`. Merged directly, no new API
  calls: 485 rows added.
- **17 towns had never been researched at all** (Nikopol, Pleven, Silistra, Sofia, Veliko Tarnovo,
  Cheb, Loštice, Mikulov, Třešť, Znojmo, České Budějovice, Győr, Sopron, Székesfehérvár, Bratislava,
  Košice, Nitra) — ran the real Scout→Librarian→Historian pipeline fresh. 17/17 succeeded, 425 rows
  added. Three of these (Cheb, Mikulov, Znojmo) had to be queried under a disambiguating name —
  "Mikulov (Nikolsburg)" etc. — since the town already had other, correctly-named rows in
  `kehilot.csv` and a same-named-but-different place exists elsewhere (there's a real, different
  Eger in Hungary); the merge script renames the city field back to the plain canonical name so the
  fresh rows land in the same timeline instead of fragmenting under a second spelling.
- **14 towns already had other, better rows** alongside the pop=30 placeholder (Baranów
  Sandomierski, Bochnia, Bydgoszcz, Chełm, Chmielnik, Gniezno, Gostynin, Jarosław, Kazimierz Dolny,
  Leszno, Olkusz, Szczekociny, Plovdiv, Buchach) — just deleted the placeholder row, nothing to
  re-research.
- **4 entries were historical regions, not towns** (Poland/Ukraine's "Wołyń"/"Volhynia", Romania's
  "Bukovina", Lithuania's "Samogitia") with no coordinates (or a token point) and no other data —
  deleted outright; each region's constituent towns are already covered individually elsewhere in
  the dataset.

**A second, unrelated corruption pattern found in passing**: 4 Polish towns (Krotoszyn, Leszno,
Szamotuły, Wschowa) had a "Bulgaria modern history" citation chain (`History_of_the_Jews_in_
Bulgaria`, `worldjewishcongress.org/.../BG`, etc.) appended to their 1900–2024 rows — clearly a
batch/template mix-up, not real research about these towns. All population values on the affected
rows were blank, so no visible map corruption, but the sourcing was flatly wrong. Deleted 27 rows.

**Two more one-off bugs caught during verification of the freshly-merged data**: Prague had three
rows chaining a WWII-era count of *Jewish children* (1,216, from a USHMM source explicitly labeled
"Jewish children living in Prague in 1943-44") forward as if it were the town's total population,
open-ended to 2024/2026 — shortened to a single 1943-1944 point-in-time fact. Mikulov had its 1938
pre-Holocaust population (472, correctly cited) held flat all the way to 2026 despite its own
comment noting most of that community didn't survive — shortened to a 1938 point-in-time fact.
Both are the same "held flat past the Holocaust" bug this whole project keeps finding in different
towns; see the fresh-pipeline sanity checks below for why *newly*-collected data doesn't have this
problem anymore.

**Verified the pipeline fixes are holding**: spot-checked the 17 freshly-researched towns' rows
around 1938-1944 — every one of them terminates as a true point-in-time fact (`year_end ==
year_start`, e.g. Bratislava's 1940/18,102 row, Nitra's 1944/1,500 "fit for labour" row, Košice's
1944/12,000 row) rather than chaining forward to the present. That's the `year_end = year_start`
default fix from earlier today doing its job on brand-new data, not just old data being patched.

**Not done / explicitly out of scope this pass**: the pop=30/1942 signature is *not* an Eastern
Europe problem — of the 282 affected towns, roughly 230 are Western/Central Europe (France,
Germany, Switzerland, Austria, Italy, Netherlands, Belgium...), including cities as major as none
in this pass but comparably significant. Same remediation recipe would apply (check for an
existing better row → delete-only; check for an unmerged raw pipeline file → merge; else → fresh
pipeline run). Also not done: 109 rows across 44 Polish/Belarusian towns carry an isolated
`(citation lost - legacy data entry error)` source on *one* row within an otherwise well-sourced
multi-row timeline (e.g. Izbica: 1 lost / 56 total rows) — almost certainly a bridging row from an
earlier chain-repair pass rather than fabrication, much lower priority than a whole-town
placeholder, not investigated further.

### Current scale (measured 2026-09-18)
- **26,667 total rows**, 5,096 distinct (country, city) pairs, 127 countries.

### If you want to resume *this* work specifically
1. **Extend the pop=30/1942 sweep to Western/Central Europe** — the query is simple (`pop_start ==
   pop_end == '30' and year_end == '1942'`) and the same three-way triage (delete-only / merge
   unmerged file / fresh pipeline run) already has working scripts to copy from this pass.
2. **Check for more "duplicate town under inconsistent name normalization" cases** — found by
   accident this pass (Prague, Cheb, Mikulov, Znojmo all had a short canonical-name entry *and* a
   longer descriptive-name entry, e.g. "Prague, Praha" vs "Prague", coexisting and not merging in
   `mergeSameYearFacts` because it groups by exact city-string match). No systematic search for
   this was done — only found where a name collision happened to surface during this pass's own
   merges.
3. **The 109-row "(citation lost)" remnants** above, if worth the time — much lower value per row
   than what this pass targeted.

## ⚠️ Status update (2026-09-20) — the "eight communities near Antarctica", and the rest of that batch

A user noticed eight communities plotted near Antarctica, south of South Africa. Tracing them exposed
the largest single block of old-model data found so far: **rows ~1063-1652 of `kehilot.csv` were one
early hand-typed batch** (sources all point at `jewishvirtuallibrary.org/…virtual-jewish-history-tour`
pages; round numbers; generic comments like "Early settlement - Sephardic Jews arrive"), plus **1,018
Israeli localities** from a second early batch. Everything below is now fixed or explicitly flagged.

**Swapped coordinates.** Ten Caribbean towns (Havana, Willemstad, Port-au-Prince, Oranjestad, George
Town, Charlotte Amalie, Basseterre, Basse-Terre, Port of Spain, Fort-de-France) had longitude and
latitude in each other's columns — Havana was stored at lat -82.4, which is open ocean south of
Africa. Eight German towns and Będzin (Poland) had the same swap, and Wellington had a longitude of
184.78. 203 rows fixed. The scan that found them flags points >1,500 km from their country's median
where swapping the columns lands much closer, so a swap inside a small country would not be caught.

**The Caribbean block was fabricated as a template.** Eight islands shared an identical population
schedule (50→100→200→300→500→800→600→400→300, "Peak population - 800 Jews"). Re-researched through the
real pipeline: Havana, Curaçao, Barbados, Aruba, Bermuda and the Virgin Islands got real series;
Kingston, San Juan, Santo Domingo, Port of Spain, Port-au-Prince, Fort-de-France, Nassau and Hamilton
got narrative-only results (the pipeline correctly refuses country-level aggregates), so they now
carry presence markers by the project convention (3 = a few Jews documented, 20 = an organized
community/synagogue) with a note; Cayman got its one sourced datum (15); Guadeloupe and St. Kitts
produced nothing and their fabricated rows were removed. **Pipeline bug found here**: queries with a
parenthesized disambiguator ("Willemstad (Curaçao)") made the fetch fail and the Historian wrote
"No evidence of Jewish presence found — no source text could be retrieved", which looks like a finding
but is a failure. Rerunning with plain names fixed Curaçao and Charlotte Amalie. Worth stripping
parentheses from Scout/Librarian queries in code.

**Batch 2 (95 towns: world cities, Afghanistan, Central America, NZ, Israeli cities).** Audited old
vs. fresh values at 1900/1939/1950/2000/2020 per town. Findings: identical curves across different
towns (Ofakim = Yehud-Monosson, Kiryat Bialik = Kiryat Motzkin, Migdal HaEmek = Arad, the four
Central American capitals, Christchurch = Dunedin); old values several-fold off where fresh data
exists (Montreal 24K vs a sourced 64K in 1939; Toronto 14.5K vs 49K); but fresh data is *not*
uniformly better — London's fresh rows leave 1900-1950 at ~1,755 (a held-flat artifact) against a
plausible ~200K. So no single threshold works. Policy applied: template towns → old rows deleted;
fresh data adequate and self-consistent (≥2 anchor years, no >15× jumps, within 8× of old) →
replaced (Kabul, Rome, Montreal, Melbourne, Sydney, Casablanca); everything else → old rows kept but
set to `probability = low` (the app already renders that as a lighter marker plus a "lower
confidence" badge) with an "unverified approximation" note, and only the fresh *narrative* rows
added. 18 towns are in that flagged state (London, Amsterdam, Madrid, Toronto, Buenos Aires, São
Paulo, Tokyo, Hong Kong, Auckland, Wellington, San José, Guatemala City, Panama City, Addis Ababa,
Gondar, Marrakech, Mbale, Ghazni). Firoz Koh and the Central American/NZ template towns lost their
markers outright until real data is found.

**The 1,018 Israeli placeholders** (population 30 from founding to 2023, coordinates rounded to
0.1°, sourced to Hebrew Wikipedia URLs that were themselves reverse-transliterated from English and
often garbled — e.g. `ראשון לצייון`). Old coordinates were up to ~110 km off (Bet Hilqiyya, Mekhora).
Replaced using the **Israel Central Bureau of Statistics locality files** — the user pointed at the
CBS site, and the yearly files turned out to be direct downloads:
`https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode<YEAR>.xlsx` (2018-2024; `.xls` for
2012-2017; 2023 is `bycode2023Sofi.xlsx`). Each has ~1,480 localities with Hebrew name, English
transliteration, founding year, locality type, ITM coordinates, total population and "Jews and
others". Matched 907 of the placeholders on the English transliteration (plus a hand-verified list of
spelling variants), converted ITM→WGS84 (`pyproj`, EPSG:2039), and wrote a founding-year presence
marker (20, by convention) plus the 2012-2024 "Jews and others" series compressed to piecewise-linear
rows. 60 placeholders duplicated a big city already in the dataset and were deleted; 51 had no CBS
match (mostly settlements evacuated in 2005 and institutional sites) and were deleted. The 62 big
Israeli cities from batch 2 got the same CBS series and coordinates. Their old pre-2012 skeletons were
mostly just two endpoints joined by a straight line (Tel Aviv: 1,000 in 1909 to 418,730 in 2011), so
they were **dropped, not restored**; only Jerusalem's genuinely multi-point history is kept, flagged
low. CBS quirks: 2012-2017 "Jews and others" is stored in thousands, so those years are derived as
total population × the locality's 2018 Jewish share; the file has no localities pre-2012.

**Consequence to be aware of**: Israeli localities now have real data for 2012-2024 and a founding-year
marker, but **nothing in between** — the map draws 989 Israeli markers in 2020 but only ~31 in 2000.
That gap is honest, not a bug: the previous fake data covered it.

### Current scale (measured 2026-09-20)
- **31,569 total rows**, ~5,000 distinct (country, city) pairs, 123 countries.
- Israel: 985 towns, 5,728 rows.

### If you want to resume *this* work specifically
1. **Israeli pre-2012 population** — needs CBS historical data: locality populations for the census
   years (1948, 1961, 1972, 1983, 1995, 2008) and/or the 2003-2011 yearly locality files, which the
   CBS page lists behind a "show all" control that isn't in its HTML (so the URLs can't be scraped;
   the `bycode<YEAR>` pattern did not resolve for 2003-2011). The 2022 census tables at
   `census.cbs.gov.il/he/tables` are another source. Once available, extend the CBS import to
   interpolate between census points.
2. **The 51 unmatched Israeli placeholders** are in the session scratchpad's `israel_unmatched.txt`
   (mostly Gush Katif/Sinai settlements evacuated 1982/2005 and 1990s outposts) — research or drop.
3. **The 18 flagged-low world towns** — find real series (a targeted census-focused pipeline pass for
   London, Toronto, Buenos Aires, etc. would help; the Historian's general-history sources rarely
   carry a full population time series for a metropolis).
4. **Guadeloupe and St. Kitts/Nevis** — the pipeline found nothing under "Basse-Terre"/"Basseterre";
   Nevis (Charlestown) has a documented 17th-18th-century community worth a targeted query.
5. **Western/Central Europe's pop=30/1942 placeholders** (~230 towns) — still open, see the 2026-09-18
   section; same three-way triage applies.
6. **Pipeline code**: strip parenthesized disambiguators from search queries, and don't write a
   "no evidence found" row when the failure was "no source text could be retrieved".

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
   fetched text before using it. **Not everything saved to disk here reaches the Historian**: a
   page is saved as soon as it's successfully fetched, but is then excluded from what gets sent to
   extraction if the town's name isn't found in its text, it's under 300 characters, the per-town
   150,000-combined-character budget is already spent, or it's past the 25,000-char-per-source
   truncation point. So a `downloaded_sources` folder can legitimately contain more/different
   content than what actually informed that town's `city_data_*.csv` — check the extraction log's
   `SKIPPING:` lines for a given town if a saved file looks like it should have produced data but
   didn't. Manual intervention pages (CAPTCHA/login walls) are never saved at all — that check
   happens before the save step.
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
