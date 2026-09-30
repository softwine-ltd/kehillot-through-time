# Collection brief (one town per agent)

You are collecting historical Jewish-community data for ONE town from the web, to fill a gap the automated
pipeline could not fill well. Your task message gives the town, country, coordinates and any alternative name.

Run folder (repo-relative): `data_collection/claude_gaprun5/`

## Rules (mandatory)
- Read `historian_rules.txt` in the run folder first and follow it exactly: substitute {town_name}, {country},
  {lon}, {lat}. In short:
  - The Population column holds only Jews living in this town. Regional, metro-area or state aggregates,
    death tolls, ghetto counts that include deportees from elsewhere, transit or deportation counts, event
    counts and subsets (members of one congregation, pupils, donors) go in Notes, with Population blank.
  - Families x5 are written as "~N".
  - Presence without a count means Population BLANK. Presence must be documented; "Jews must have lived
    there" or a legend is not documented presence.
  - Population 0 ONLY for a positively documented absence ("no Jews lived there", after an expulsion, "the
    last Jew left", "no Jewish population remains").
  - Every row needs a numeric Year of Data. If a source gives only a century or "today", use the midpoint or
    the source's publication year and say so in Notes. Drop a figure you cannot date at all.
  - One source per row. Never fabricated URLs.
- Blind: do NOT read `kehilot.csv`, `kehilot*.csv`, `data_temp/`, or any other file in this repository except
  the files in the run folder and your own output. Work only from the web.
- Every Source URL you write must be a page you actually fetched with WebFetch, and it must contain that
  fact. A search-result snippet does not count. If WebFetch cannot parse a PDF, you may download it and
  extract the text locally (`pip install pymupdf` if needed) and cite that URL.
- Several towns share names (e.g. two Tripolis, two Newports). Make sure each source is about THIS town
  (check region and coordinates).

## Method
1. Run 6-10 WebSearch queries, adapted to the town:
   - "Jewish population history <town>" and "<town> Jewish community census";
   - "Jews in <town> <local-language terms>", in the local language(s) (German, Russian, Ukrainian, Hungarian,
     Slovak, Spanish, Portuguese, Persian, Hebrew, ...);
   - YIVO / Encyclopaedia Judaica / Jewish Virtual Library / JewishGen KehilaLinks / Yad Vashem / Pinkas
     HaKehillot / Russian Jewish Encyclopedia (eleven.co.il) / local Wikipedia;
   - census terms, e.g. "1897 census Jews <town>" or "1939 census", as relevant.
   Prefer censuses, scholarly encyclopedias, community and memorial sites. Wikipedia is acceptable.
   Known blockers: sztetl.org.pl, Encyclopaedia Iranica and Diarna often refuse WebFetch; look for other
   sources rather than retrying them many times.
2. WebFetch the ~10-20 most promising pages. Ask each fetch for VERBATIM sentences with Jewish population
   numbers, years, first documented presence, synagogues, expulsions, pogroms, deportations and postwar
   community, with enough context to tell what area or group a number covers.
3. Extract rows per the rules. Be exhaustive across all eras. Where sources disagree, keep separate rows.

## Output (in the run folder)
- `city_data_<Town>_<Country>.csv`, with spaces in names replaced by `_`.
  - Header exactly: `Country,Town Name,Longitude,Latitude,Year Established,Year of Data,Population,Notes,Source`
  - Use the coordinates given. Quote any field containing a comma. UTF-8.
  - Year Established = earliest documented (not legendary) Jewish presence.
  - If nothing at all is found: one row with Population blank and Notes "No evidence of Jewish presence found
    in available sources".
- `sources_<Town>_<Country>.txt`: every URL you fetched, one per line, prefixed with OK or FAILED.
- Final reply, at most 6 lines:
  - rows / rows with a number / year span / searches / pages fetched (OK/failed);
  - the main figures;
  - what you deliberately left out of Population, and why.

## General notes for this run (towns in many countries)
- Search under every known name of the town (the queue's alt_name column lists some) and in the local languages
  (Romanian, Bulgarian, Russian, Arabic, Persian, Turkish, French, German, Hungarian, Slovak, Czech, Lithuanian,
  Latvian, Greek, Portuguese, Spanish, Dutch, Hebrew).
- Sources that usually work: Encyclopaedia Judaica (encyclopedia.com), the 1906 Jewish Encyclopedia, Jewish Virtual
  Library, Wikipedia in several languages, JewishGen (KehilaLinks, Yizkor books, Pinkas HaKehillot translations),
  Yad Vashem, YIVO, national censuses and their statistical tables, Alemannia Judaica and juedische-gemeinden.de
  (Germany), the Russian Jewish Encyclopedia (eleven.co.il, rujen.ru) and demoscope.ru (Russia and the USSR),
  Federation CJA / UJA and jewishdatabank.org census reports (Canada, per municipality), Czech and Slovak community
  sites, Lithuanian Jewish community pages, and the American Jewish Year Book population tables.
- Often blocked to WebFetch: sztetl.org.pl, Encyclopaedia Iranica, Diarna, Yad Vashem, some encyclopedia.com and
  jewishencyclopedia.com pages. Do not retry a blocked site more than twice; use another source.
- Many towns share names: check the country, region and coordinates before using a source (e.g. Tripoli in Libya vs
  Lebanon, Sale in Morocco, Vaughan or Markham in Ontario).
- Jews of the TOWN only. Country, province, district, metropolitan-area, "Greater X" and community-membership totals
  go to Notes with Population blank. For a big city, use the city itself, not the metropolitan area.
- Do not stop at one source: aim for a series across eras, each figure from its own fetched page, and do at least six
  searches. Where a source only gives a range, put the midpoint in Population and say so in Notes.
- Ancient or legendary origins are not Year Established; use the earliest documented presence.
- If you hit a usage or credit limit, stop and report what is done instead of retrying.
