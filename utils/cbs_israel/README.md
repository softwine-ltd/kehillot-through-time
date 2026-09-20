# CBS Israel locality import (2026-09-20)

Record of the one-off scripts that rebuilt Israeli localities from the Israel Central Bureau of
Statistics locality files. See `DATA_COLLECTION_PIPELINE.md` (status update 2026-09-20) for the why.

- `parse_cbs.py` — reads `cbs/cbs_<YEAR>.xls[x]` (2012-2024, downloaded from
  `https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode<YEAR>.xlsx`; `.xls` for 2012-2017,
  `bycode2023Sofi.xlsx` for 2023) into `cbs_localities.json`. Needs `openpyxl` and `xlrd`.
- `import_cbs_israel.py` — matches old placeholder rows to CBS localities, converts ITM coordinates
  (needs `pyproj`), and writes the rebuilt rows into `kehilot.csv`. **Session-specific**: it reads
  `batch2_old_rows.json` and a named pre-merge backup that were only present in that session's scratch
  directory, so treat it as documentation of the method, not a ready-to-rerun tool. Reuse the
  matching, ITM conversion and series-compression functions when adding CBS census tables.

The downloaded CBS files are not committed (public, re-downloadable). CBS throttles bursts of
requests; pace downloads a few seconds apart.
