# Collection brief: Second Temple period (one settlement per agent)

You are collecting data on Jewish presence and Jewish population for ONE settlement during the Second Temple
period, from academic sources on the web. Your task message gives the settlement, modern country, coordinates
and alternative names.

Run folder (repo-relative): `data_collection/claude_second_temple/`

## Period and years
- Period: 586 BCE (destruction of the First Temple) to 70 CE (destruction of the Second Temple). Rows for the
  end of the Great Revolt up to 74 CE (fall of Masada) are allowed. Do not write rows outside -586..74.
- Years are integers; BCE years are NEGATIVE (e.g. 167 BCE = -167). There is no year 0; never write 0 as a
  year.
- If a source dates something only to a century, phase or reign, use the midpoint and say so in Notes
  (1st c. BCE = -50; 1st c. CE = 50; late 2nd c. BCE = -125; Herodian period 37-4 BCE = -20; Hasmonean
  period 140-37 BCE = -90; Persian period 539-332 BCE = -435; early Roman 63 BCE-70 CE = 4). If a date is
  approximate, say "c." in Notes.

## Rules (mandatory)
- Read `historian_rules.txt` in the run folder first and follow it exactly: substitute {town_name}, {country},
  {lon}, {lat}. In short:
  - The Population column holds only Jews (Judeans) living in this settlement. Regional figures (all Jews of
    Egypt, Galilee, Judea, the Diaspora), death tolls, casualty and prisoner counts, garrison or army sizes,
    pilgrim crowds, delegations and subsets (members of one sect, one synagogue, donors on an inscription) go
    in Notes, with Population blank.
  - Families x5 are written as "~N".
  - Presence without a count means Population BLANK. Presence must be documented; "Jews must have lived
    there", tradition or legend is not documented presence.
  - Population 0 ONLY for a positively documented absence (e.g. "the Jews were expelled", "the town was
    destroyed and abandoned", Josephus or a scholar stating no Jews remained).
  - Every row needs a numeric Year of Data in the period. Drop a figure you cannot date at all.
  - One source per row. Never fabricated URLs.
- Blind: do NOT read `kehilot.csv`, `kehilot*.csv`, `data_temp/`, or any other file in this repository except
  the files in the run folder and your own output. Work only from the web.
- Every Source URL you write must be a page you actually fetched with WebFetch, and it must contain that
  fact. A search-result snippet does not count. If WebFetch cannot parse a PDF, you may download it with curl
  and extract the text locally (`pip install pymupdf` if needed) and cite that URL.
- Several ancient places share names (Antioch, Apamea, Laodicea, Seleucia, Caesarea, Emmaus, Bethsaida,
  Salamis, Berenice). Make sure each source is about THIS place (check region and coordinates).

## What counts as evidence in this period
Population figures are almost never counts. Use them this way:
- **Modern scholarly estimates** of the Jewish residents of the settlement (archaeological area x density
  coefficient, household counts, demographic models) go in Population. Give the scholar, the method and the
  estimate in Notes. Where a scholar gives a range, put the midpoint in Population and the range in Notes.
  Where scholars disagree, one row per estimate.
- **Total-population estimates** of a settlement go in Population only if the SAME source says the settlement
  was Jewish or overwhelmingly Jewish at that time (e.g. a Galilean Jewish village, Jerusalem). Say so in
  Notes ("total population of a predominantly Jewish town per the source"). For mixed or gentile cities
  (Caesarea, Scythopolis, Alexandria, Antioch, Rome) only figures for the Jews go in Population.
- **Ancient figures** (Josephus, Philo, Hecataeus, Tacitus, Strabo, Cassius Dio) that modern scholars treat
  as exaggerated or that count casualties, captives, defenders or pilgrims go in Notes with Population blank,
  together with the scholarly assessment if you found one. An ancient figure for the resident Jews that the
  source you cite accepts may go in Population, flagged in Notes as an ancient figure.
- **Presence rows** (Population blank): datable archaeological evidence of Jewish residents (ritual baths /
  miqvaot, chalk stone vessels, ossuaries, Hasmonean or Jewish revolt coins in domestic contexts, synagogue
  buildings, Jewish inscriptions), papyri and ostraca naming Jews, and literary attestations (Ezra-Nehemiah,
  Maccabees, Josephus, Philo, New Testament, Qumran texts, Mishnah when it speaks of pre-70 conditions,
  Greek and Latin authors). One row per distinct, datable piece of evidence; say in Notes what it is and
  what scale of community it suggests. Do not repeat the same evidence in many rows.
- **Events** that affect the community (founding or re-founding, Hasmonean conquest and Judaization,
  expulsions, riots, massacres, destruction, abandonment) are rows too: Population blank (or 0 if the source
  says no Jews remained), event in Notes.
- **Year Established** = the earliest documented Jewish (Judahite/Judean/Israelite) presence at the site. For
  Judahite towns this may be earlier than 586 BCE; give the basis in the Notes of the first row. Use the same
  value on every row.

## Method (deep academic research)
1. Run at least 8 WebSearch queries, adapted to the settlement, aiming at ACADEMIC sources:
   - "<site> Second Temple period Jewish population estimate", "<site> Hellenistic Roman Jewish community",
     "<site> excavations miqveh stone vessels", "<site> population density archaeological estimate";
   - "<site> Josephus", "<site> Jews Hasmonean", "<site> synagogue first century", "<site> Jewish
     inscription" / "papyri Jews <site>", as relevant;
   - names of scholars and works known for the topic (e.g. Broshi, Reich, Geva, Levine, Avi-Yonah,
     Safrai, Schürer (revised), Leibner, Aviam, Chancey, Reed, Barclay, Gruen, Modrzejewski, Kasher, Tcherikover,
     Porten, Trebilco, Leon, Rutgers, Neusner, Oppenheimer, Ilan) combined with the site;
   - Hebrew-language searches for sites in the Land of Israel (e.g. "<Hebrew name> ימי הבית השני אוכלוסייה");
   - local-language searches where useful (Arabic, Greek, Italian, Turkish, German, French).
2. Prefer, in this order: peer-reviewed articles and excavation reports (open-access journals, Brill/Cambridge/
   De Gruyter open access, academia.edu and ResearchGate pages that show text, university repositories,
   Hadashot Arkheologiyot / Israel Antiquities Authority reports at hadashot-esi.org.il, Tel Aviv University,
   Hebrew University, Bible Interpretation, Biblical Archaeology Society library pages, ASOR, Bryn Mawr
   Classical Review); scholarly reference works (Encyclopaedia Judaica on encyclopedia.com or Jewish Virtual
   Library, the 1906 Jewish Encyclopedia, Livius.org, Oxford Classical Dictionary pages that load, Pleiades,
   Inscriptiones Judaicae Orientis summaries, papyri.info for papyri); primary texts online (Josephus and Philo
   on Perseus, penelope.uchicago.edu, earlyjewishwritings.com, sacred-texts.com, Project Gutenberg, Sefaria,
   biblical texts on Sefaria / biblegateway); Wikipedia only as a last resort or as a pointer to sources.
   Cite a primary text by its fetched URL and give the passage reference (e.g. Josephus, War 2.18.5) in Notes.
3. WebFetch the ~12-25 most promising pages. Ask each fetch for VERBATIM sentences with population estimates
   and how they were derived, dates, Jewish presence evidence, and events, with enough context to tell what
   area or group a number covers.
4. Extract rows per the rules. Be exhaustive across the whole period. Where sources disagree, keep separate
   rows.

Known blockers: JSTOR full text, Brill/Springer/T&F/Cambridge paywalled articles, Google Books, academia.edu
and ResearchGate downloads (their landing pages sometimes show text), Encyclopaedia Iranica, some
encyclopedia.com pages. Do not retry a blocked site more than twice.

## Sources you could not access (important)
Whenever you find a relevant academic source (article, book chapter, excavation report, monograph, thesis)
that you could not read - paywalled, 403/blocked, not online, only a citation or abstract - record it in
`unavailable_<Town>_<Country>.md` (spaces -> `_`). One bullet per source:
`- Author(s), Year. "Title." Journal/Book, volume, pages. URL or DOI if known. — Why relevant (what figure or
evidence it likely holds). — Why not accessed (paywall / 403 / not online / abstract only).`
Include sources cited by pages you did read (e.g. the estimate a Wikipedia or encyclopedia page attributes to
a book) when you could not check the original. Write `- None` if there were none.

## Output (in the run folder)
- `city_data_<Town>_<Country>.csv`, with spaces in names replaced by `_`.
  - Header exactly: `Country,Town Name,Longitude,Latitude,Year Established,Year of Data,Population,Notes,Source`
  - Use the settlement name and coordinates given. Quote any field containing a comma. UTF-8. Population as
    plain digits (or ~N).
  - If nothing at all is found for the period: one row with Population blank, Year of Data = the midpoint of
    the period you searched, and Notes "No evidence of Jewish presence in the Second Temple period found in
    available sources".
- `sources_<Town>_<Country>.txt`: every URL you fetched, one per line, prefixed with OK or FAILED.
- `unavailable_<Town>_<Country>.md` as above.
- Final reply, at most 6 lines:
  - rows / rows with a number / year span / searches / pages fetched (OK/failed) / unavailable sources listed;
  - the main figures;
  - what you deliberately left out of Population, and why.

If you hit a usage or credit limit, stop and report what is done instead of retrying.
