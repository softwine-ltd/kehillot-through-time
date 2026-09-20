# CBS Israel locality import (2026-09-20)

Record of the one-off scripts that rebuilt Israeli localities from Israel Central Bureau of Statistics data.
See `DATA_COLLECTION_PIPELINE.md` (status update 2026-09-20) for the why. Run order:

1. `parse_cbs.py` — reads `cbs/cbs_<YEAR>.xls[x]` (2003-2024) into `cbs_localities.json`. Download:
   `https://www.cbs.gov.il/he/publications/doclib/2019/ishuvim/bycode<YEAR>.xls` (2003-2017, note lowercase
   `doclib`), `.xlsx` for 2018-2024 (`bycode2023Sofi.xlsx` for 2023). Needs `openpyxl`, `xlrd`.
2. `import_cbs_israel.py` — matches the old placeholder rows to CBS localities, converts ITM coordinates
   (`pyproj`, EPSG:2039) and writes the first rebuilt rows. **Session-specific**: it reads a batch-2 manifest and a
   named backup that only existed in that session's scratch directory, so treat it as documentation of the method.
3. `parse_census_table.py` — Statistical Abstract of Israel 2018 table 2.24 (`…/doclib/2018/2.%20shnatonpopulation/st02_24.xls`):
   census-year populations 1948, 1955, 1961, 1972, 1983, 1995, 2008 for localities with 5,000+ residents.
4. `rebuild_cbs_israel.py` — joins the census points to the annual series (2003-2024) and rewrites the rows.
5. `revive_evacuated.py` — adds settlements that exist only in the 2003-2007 files (evacuated in 2005) and could be geocoded.

The downloaded files are not committed (public, re-downloadable). CBS throttles bursts of requests: pace downloads a few seconds apart.
