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
- Historical event overlays
- Population statistics and trends
- Sources and methodological notes
- Educational resources for teachers and researchers
- A "Fade Markers" toggle for viewing the base map's own town labels underneath dense clusters
- A per-town history drawer (a side panel, or a bottom sheet on phones): click "Full history" in a marker's popup, or right-click a marker, to see that town's own population points and events in year order, with a population-over-time chart; it follows the timeline slider and any entry can jump the map to its year

Our mission is to preserve and present the geographical history of the Jewish people, making complex demographic data accessible and meaningful for researchers, educators, students, and anyone interested in Jewish history and culture.

## Project status

As of 2026-09-22, `kehilot.csv` holds **46,481 rows across ~125 countries** (~5,060 distinct
town/country entries). The dataset is under active,
ongoing expansion and correction — see [`DATA_COLLECTION_PIPELINE.md`](DATA_COLLECTION_PIPELINE.md)
for the full collection pipeline, its provenance, current known gaps, and in-progress work (most
notably closing the gap between this dataset's pre-WW2 Europe estimate and the accepted historical
figure of ~9.5M — concentrated in Poland and the former Pale of Settlement).

Also under active repair: a recurring data-quality bug where a large number describing something
*other* than a town's own resident population (a regional death toll, a deportation-in-transit
count, a multi-town massacre site, even a tourist/pilgrimage headcount) got recorded as if it were
that town's population, often left open-ended so it silently "holds flat" for decades — including
past the Holocaust, in towns whose Jewish community is well documented to have been destroyed. See
`DATA_COLLECTION_PIPELINE.md`'s "Post-Holocaust population integrity" section for what's been
found and fixed so far, and what's still open.

## Meta Keywords
Jewish demographics, Jewish history, population maps, Jewish communities, kehillot, Jewish diaspora, historical maps, Jewish migration, interactive timeline, Jewish geography, demographic changes, Jewish population data
