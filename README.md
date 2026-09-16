# Kehillot Through Time
### Interactive visualization of Jewish communities across history, mapping demographic changes, migrations, and cultural developments from ancient times to the present.

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

Our mission is to preserve and present the geographical history of the Jewish people, making complex demographic data accessible and meaningful for researchers, educators, students, and anyone interested in Jewish history and culture.

## Project status

As of 2026-09-17, `kehilot.csv` holds **21,276 rows across 131 countries** (4,682 distinct
town/country entries). The dataset is under active, ongoing expansion and correction — see
[`DATA_COLLECTION_PIPELINE.md`](DATA_COLLECTION_PIPELINE.md) for the full collection pipeline,
its provenance, current known gaps, and in-progress work (most notably closing the gap between
this dataset's pre-WW2 Europe estimate and the accepted historical figure, concentrated in Poland
and the former Pale of Settlement).

## Meta Keywords
Jewish demographics, Jewish history, population maps, Jewish communities, kehillot, Jewish diaspora, historical maps, Jewish migration, interactive timeline, Jewish geography, demographic changes, Jewish population data