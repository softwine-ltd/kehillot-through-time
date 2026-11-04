# Kehillot Through Time
### Interactive visualization of Jewish communities across history, mapping demographic changes, migrations, and cultural developments from ancient times to the present.

Site: https://kehilot.softwine.net/

## How-To Run Using Python
``` Python
python3 -m http.server 8000
```
Then surf to http://localhost:8000

**Do not open `index.html` directly (double-click / "Open with browser")** — the map data and
translations are loaded via `fetch()`, which browsers block for local `file://` pages. You must
serve the folder over HTTP as above. Also avoid `http://0.0.0.0:8000`: that address means "listen
on every interface" for the *server*, but most browsers refuse to navigate to it as a *client*
address — use `localhost` or `127.0.0.1` instead.



## What's in it for me
Kehillot Through Time is an interactive journey through Jewish history, visualizing the ebb and flow of Jewish communities across the globe. Our maps and timelines trace the demographic changes, migrations, and cultural developments that have shaped the Jewish diaspora throughout the centuries.

Kehillot Through Time offers a comprehensive visual exploration of Jewish demographic history, bringing data to life through interactive maps and detailed timelines. Our platform illuminates the rich tapestry of Jewish communal life across continents and centuries.


### What We Offer:
- Interactive maps showing Jewish population changes across different historical periods
- Detailed demographic data visualizations
- Historical context for major migrations and community developments
- Insights into the growth, decline, and movement of Jewish communities worldwide
- Educational resources for understanding Jewish demographic history
- Documentation of both major population centers and smaller kehillot

### Features:
- Time-lapse visualizations of population changes
- Detailed community profiles
- Historical event overlays (`events.csv` ellipses, `events_polygon.csv` polygons, `historical_arrows.csv` arrows): an area that is not well defined is an ellipse, an area that can be drawn accurately is a polygon, never both for the same event; smaller shapes are drawn on top of larger ones, so clicking an inner area opens its own popup
- Population statistics and trends
- Sources and methodological notes
- Educational resources for teachers and researchers
- A "Fade Markers" toggle for viewing the base map's own town labels underneath dense clusters
- A per-town history drawer (a side panel, or a bottom sheet on phones): click "Full history" in a marker's popup, or right-click a marker, to see that town's own population points and events in year order, with a population-over-time chart; it follows the timeline slider and any entry can jump the map to its year

Our mission is to preserve and present the geographical history of the Jewish people, making complex demographic data accessible and meaningful for researchers, educators, students, and anyone interested in Jewish history and culture.

## Project status

As of 2026-11-04, `kehilot.csv` holds **181,213 rows across 200 countries** (22,318 distinct
town/country entries). The dataset is under active,
ongoing expansion and correction — see [`DATA_COLLECTION_PIPELINE.md`](DATA_COLLECTION_PIPELINE.md)
for the full collection pipeline, its provenance, current known gaps, and in-progress work (most
notably closing the gap between this dataset's pre-WW2 Europe estimate and the accepted historical
figure of ~9.5M — concentrated in Poland and the former Pale of Settlement).

**The About dialog's data-update line.** The site's About dialog (English, Hebrew, French) states the date of the last data update, the number of towns and the number of data rows ("Last data update: ... The map currently covers N towns and N data rows."). The three numbers come from `data_info.json`, which `utils/update_data_info.py apply` writes from `kehilot.csv` (towns counted as `utils/validate_kehilot.py` counts markers; the date is the day it is run, or `--date`). Run it after every change of `kehilot.csv`, before committing; the data workspace's `chain.sh` does so after the validator. The wording is under `about.dataUpdate` in `translations/en.json`, `he.json` and `fr.json`.

**Columns and the public Notes.** `kehilot.csv` has 19 public columns (the ones the site reads) and a 20th, `process_notes`, that the site never reads. The public Notes column is for visitors: what the source says, how to read the figure, caveats about the figure. Remarks about how the data was gathered and processed (page-image reading, OCR, search results, confidence tags, marker matching, coordinate provenance, review/merge logs, extra source links) are kept, verbatim, in `process_notes` for the maintainers; `utils/split_process_notes.py` moves them and runs after every merge (see `DATA_COLLECTION_PIPELINE.md`, "Public Notes vs `process_notes`").

**What the data covers.** Besides the modern (16th–21st century) population series built by the AI
pipeline, the map now has historical layers researched by source-checked sub-agents:
biblical places (Middle Bronze Age to the Persian period), the Second Temple period (539 BCE–70 CE, with
doubtful settlements documented in `jew_hist/biblical_2026-10-04/DOUBTFUL_SETTLEMENTS.md`), the
late medieval period (9th–15th century: Germany, France, England, the Low Countries, Austria,
Bohemia/Moravia, Hungary, Slovakia, Poland, Italy, Switzerland, Spain and Portugal — about 2,300 rows), and the American Jewish
Year Book's US community estimates for 1955–1980. Conventions: a count of `0` means a documented absence; a
**blank** count means documented presence without a number (drawn as a hollow ring); a population is only the
place's own Jewish population, never a regional total or a victim count; conflicting estimates are kept as
separate rows, and the weaker ones are marked low confidence.

Also under active repair: a recurring data-quality bug where a large number describing something
*other* than a town's own resident population (a regional death toll, a deportation-in-transit
count, a multi-town massacre site, even a tourist/pilgrimage headcount) got recorded as if it were
that town's population, often left open-ended so it silently "holds flat" for decades — including
past the Holocaust, in towns whose Jewish community is well documented to have been destroyed. See
`DATA_COLLECTION_PIPELINE.md`'s "Post-Holocaust population integrity" section for what's been
found and fixed so far, and what's still open.

## Event shapes and border sources

Historical events are drawn as ellipses (`events.csv`) or polygons (`events_polygon.csv`). On 2026-11-01 every
event was reviewed: an event about an area whose borders can be drawn from a relevant map (a kingdom, an empire, a
duchy, a county, a province, an island, a country; 161 events) became a polygon, and a point-like event (one town,
one camp, one battle) or a loosely defined area (a migration, a cultural region, a campaign) stayed an ellipse.
Eight older polygons whose outline was too crude for the area they stand for (the Babylonian zone, the
Mesopotamian exile, the Persian rule, the Alexandria riots of 38 CE, the Galilee centres, the Babylonian academies,
Al-Andalus, the Rhineland) were turned into ellipses. Polygons are single rings (the map draws one ring per
event), with at most 150 points. The border source of every polygon, its confidence and the licence of the border
data are listed in `EVENT_POLYGON_BORDER_SOURCES.csv`. The sources are Natural Earth (public domain),
OpenHistoricalMap (CC0) and a few outlines traced from Wikimedia Commons maps (CC BY-SA: the Kingdom of Israel 1020
map, the Hasmonean Kingdom map, the Herodian Tetrarchy map, "General Government for the occupied Polish territories
(1941)" and the Serbia map by XrysD, a Transnistria Governorate map from the US Holocaust Memorial Museum, and the
Pale of Settlement map `Ansiedlungsrayon.svg` by Furfur), and one outline traced by us from the printed map of Herod's
kingdom in the Herodium final report (see the source file). Medieval and early modern borders from modern
administrative units are approximations and are marked in the source file; the outline of the medieval Kingdom of
France and of the Habsburg monarchy of 1781 are our own composites of such units.

### Event titles and colors

Every event row ends with three columns: `valence` (`bad`, `good` or `neutral`), `title_eng` and `title_heb`. The popup
title is the event type followed by what happened, in Hebrew and English (for example "Jewish Thought - Babylonian Jewish
academies" and the same in Hebrew), so the type name alone no longer stands for the event. The shape color follows the
valence, judged from the text of the row and not from its type (a State Events row can be anti-Jewish legislation or a
grant of rights): red for bad events (pogroms, persecution, expulsions, anti-Jewish legislation, ghettos, destruction),
blue for good events (community growth, states, rights granted, return, rescue), green for good Jewish-thought and
migration events, gray for mixed or unclear events (a revolt with a mixed outcome, the earliest mention of a people).
`utils/event_titles_colors.py colors` recolors every row from its `valence`, so changing a rating means editing the
column and running that command; a new event needs a valence and the two titles.

## Meta Keywords
Jewish demographics, Jewish history, population maps, Jewish communities, kehillot, Jewish diaspora, historical maps, Jewish migration, interactive timeline, Jewish geography, demographic changes, Jewish population data
