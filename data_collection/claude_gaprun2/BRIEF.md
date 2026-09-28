# Collection brief (one town per agent)

You are collecting historical Jewish-community data for ONE town from the web, to fill a gap the automated
pipeline could not fill well. Your task message gives the town, country, coordinates and any alternative name.

Run folder (repo-relative): `data_collection/claude_gaprun2/`

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

## Notes for Ukrainian and Belarusian towns (this run)
- Sources that worked well for these towns in the earlier run: the Russian Jewish Encyclopedia (eleven.co.il and
  jewishencyclopedia.ru / rujen.ru entries), the 1906 Jewish Encyclopedia, the 1897 Russian census tables,
  JewishGen KehilaLinks and Yizkor pages, Yad Vashem, Wikipedia in Russian, Ukrainian, Belarusian and Polish,
  Cyclopedia-style town pages (cyclowiki, myshtetl.org, jgaliciabukovina.net), and demoscope.ru census tables.
- Search under every known name of the town (the queue's alt_name column lists some): Russian, Ukrainian,
  Belarusian, Polish, Yiddish and older names (e.g. Yuzovka/Stalino for Donetsk, Voroshilovgrad for Luhansk).
- Many towns share names: check the guberniya/oblast/voivodeship and the coordinates before using a source.
- Jews of the TOWN only. Guberniya, uezd, district, oblast and "shtetl plus surrounding villages" totals go to
  Notes with Population blank. The 1897 census gives town and district separately: use the town figure.
- Soviet censuses (1926, 1939, 1959, 1970, 1979, 1989) count Jews by nationality: record them as such Jewish counts
  for the town; keep estimates far above the census, or ones covering a whole oblast, in Notes.
- Holocaust figures: ghetto counts that include deportees from elsewhere, executed-in-the-ravine tolls and
  transit counts go to Notes; a documented prewar or 1941 town population goes to Population.
- Do not stop at one source per fact type: aim for a series across eras (18th century revision lists, 1847,
  1897, 1910s, 1926, 1939, postwar, 1989, 2001 and later), each from its own fetched page.
- If WebFetch is blocked on a site (403, Cloudflare), do not retry more than twice; use another source.
- Stop condition: process only the towns listed in `queue.csv` with status `pending`; if you hit any usage or
  credit limit, stop and report what is done instead of retrying.
