# Possible errors and inaccuracies in `kehilot.csv`

Prepared 2026-10-26 from the file as committed on branch `claude/compassionate-ritchie-a34peb` (base commit `f93048d`): **159,089 rows, 21,939 town/country markers**. Line numbers `L12345` are the line numbers in `kehilot.csv` (the header is line 1). Every row quoted below is printed exactly as it stands in the file, so the "current data" in each item is the real current data.

## 1. What was done, and what this report is not

* **Automated scan of all rows.** Fourteen detectors ran over every row of the file (list in section 3). They flagged **2,656 rows**; each flagged row is listed, with a generated explanation and the numbers the map would show, in the companion file [`DATA_ERRORS_FLAGGED_ROWS.csv`](DATA_ERRORS_FLAGGED_ROWS.csv).
* **Hand review, town by town.** The largest and most-cited towns, and a random sample of mid-size and small towns, were read row by row (section 4): **38 towns by the author of this report** and **240 more towns by six regional reviewers, 154 of them with findings (324 findings)** (each reviewed 40 towns: the 28 largest by peak count plus 12 random towns with 8+ numeric rows of their region). Every row number a reviewer cited was re-checked against the file; findings that cited a row of another town were dropped.
* **What it is not.** The file has 21,939 markers, so a full row-by-row reading of every one was not possible; the hand-reviewed towns are a sample (roughly 192 towns, the ones with the most rows and the highest populations, which is where a wrong number does most damage). The detectors find *patterns*; the hand review shows that the patterns are real in the large majority of sampled cases, but some flagged rows will be correct (the explanation says what was assumed). Nothing here was checked against outside sources except where the item says "well-known history"; most findings are internal inconsistencies, visible from the file itself.
* **How the map reads a row (needed to understand the items).** A row with numbers draws a population interpolated linearly from `pop_start` at `year_start` to `pop_end` at `year_end` (blank end = `pop_start` held for the whole span). When several rows of one town cover the same year the map shows the **highest** value. `pop_end` was filled by the converter from the *next* row's `pop_start`, so it is often not a fact of the row's own source.

## 2. Summary

| Class | What is wrong | Severity | Rows flagged | Towns |
|---|---|---|---:|---:|
| `WARTIME_RAMP` | Pre-war / wartime count ramped across 1945 and beyond | high | 289 | 253 |
| `WARTIME_VICTIM_OR_DEPORTEE_COUNT` | Victim, deportee or liquidation count recorded as population | high | 300 | 239 |
| `RAMP_BIG_TO_SMALL` | Ramp between a large and a tiny value (likely chained from a subset, victim or unrelated count) | high | 568 | 434 |
| `RAMP_OVER_SOURCED_POINT` | Long straight-line row lies over sourced counts | high | 394 | 334 |
| `EXPULSION_RAMP` | Abrupt expulsion/massacre smoothed into a decades-long decline | high | 42 | 38 |
| `CONFLICTING_OVERLAP` | Overlapping rows of one town differ by 5x or more | medium | 326 | 175 |
| `TEMPLATE_PLACEHOLDER` | Early hand-typed / generic placeholder rows | medium | 517 | 279 |
| `DERIVED_FROM_AREA` | Population computed from site area x density | medium | 183 | 142 |
| `HOMONYM_MERGED_PIN` | Two places with the same name share one marker | high | 26 | 12 |
| `CBS_SERIES_CLIFF` | Israeli CBS series falls by >50% inside one year | medium | 35 | 28 |
| `YEAR_AS_POPULATION` | Year written into the population column | high | 6 | 4 |
| `YEAR_END_IN_FUTURE` | year_end beyond 2026 | low | 2 | 1 |
| `REGION_AS_TOWN_MARKER` | County / district / metro aggregate plotted as a town marker | low | 207 | 207 |
| `DUPLICATE_ROWS` | Duplicate rows | low | 21 | 21 |
| Gaps (towns that vanish from the map) | section 5 | high | see §5 | see §5 |
| Country totals far above DellaPergola's core figures | section 6 | high | see §6 | see §6 |
| Names | section 7 | low | see §7 | see §7 |

**The most important systemic findings**

1. **Pre-war and wartime figures are ramped across the Holocaust.** Hundreds of rows start from a pre-war (or ghetto/deportation) number and end decades later at a small number; the map interpolates a gradual decline (e.g. Thessaloniki shows ~43,500 Jews in 1950 where the same town's sources say 1,783 in 1951; Nowy Sącz ~16,700 in 1950).
2. **Counts of a different kind are chained into the series.** Because `pop_end` is copied from the next row, a row that follows a subset count (workers, tailors, refugees, victims' families, one congregation, a plan target) draws a false collapse or boom (Kolomyia, Siedlce, Bobruisk, Beersheba, Istanbul, Birobidzhan ...).
3. **Long ramps override sourced points** (Łódź, Paris, Prague, Mława ...) because the map takes the maximum of overlapping rows.
4. **Large cities vanish for years** (Berlin 1991-2002, Paris 1946-49, 15 Israeli cities after 2008).
5. **Modern figures use enlarged definitions** and exceed the national core Jewish population (Czech Republic 9x, Ukraine 6x, Azerbaijan 5.6x ...).
6. **Early hand-typed placeholder rows remain** (generic comments, round numbers) and several overlap real data.
7. **Mixed definitions in one series** (metro vs city, community members vs all persons, religion vs ethnicity, one congregation vs the town), joined by ramps.

## 3. Systemic error classes (with worked examples)

Each class lists how it was detected, why it is an error, and examples with the current data. The complete list of flagged rows is in `DATA_ERRORS_FLAGGED_ROWS.csv`.

### 3.1 `WARTIME_RAMP` — Pre-war / wartime count ramped across 1945 and beyond

*Severity: high. Rows flagged: 289 in 253 towns.* A pre-war (or wartime) count is the start of a row that runs on past 1945 to a much lower number, so the map shows a slow decline over decades where the community was destroyed in 1941-44 (or left in sharp emigration waves). The 1950 and 1970 values the map shows are computed in the explanation.

**Greece / Thessaloniki** — Row runs 50000 (1943) -> 1000 (1996) across the Holocaust years, so the map interpolates ~43528 Jews in 1950 and ~25038 in 1970; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L51655: Greece | Thessaloniki | est -332 | 1943–1996 | pop 50000 → 1000 | high | https://www.bbc.com/travel/article/20250404-in-search-of-greeces-once-great-jewish-city | “Nazi forces deported 50,000 Jews to concentration camps.”
```

**Romania / Iași** — Row runs 39441 (1899) -> 492 (2006) across the Holocaust years, so the map interpolates ~20877 Jews in 1950 and ~13596 in 1970; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L104316: Romania | Iași | est 1450 | 1899–2006 | pop 39441 → 492 | high | https://kehilalinks.jewishgen.org/iasi/iasi.html | “Jewish population”
```

**Ukraine / Zaporizhzhia** — Row runs 35000 (1941) -> 15700 (1958) across the Holocaust years, so the map interpolates ~24782 Jews in 1950; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L154505: Ukraine | Zaporizhzhia | est 1770 | 1941–1958 | pop 35000 → 15700 | high | https://he.wikipedia.org/wiki/%D7%96%D7%A4%D7%95%D7%A8%D7%95%D7%96'%D7%99%D7%94 | “Community numbered about 35,000 on the eve of WWII; destroyed by Germans after October 1941 occupation”
```

**Ukraine / Zhytomyr** — Row runs 30000 (1941) -> 14800 (1958) across the Holocaust years, so the map interpolates ~21953 Jews in 1950; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L154793: Ukraine | Zhytomyr | est 1700 | 1941–1958 | pop 30000 → 14800 | high | https://www.hamichlol.org.il/%D7%96%D7%99%D7%98%D7%95%D7%9E%D7%99%D7%A8 | “Eve of German invasion: "about 30,000 Jews ... about a third of residents" (Hebrew Wikipedia). Many fled before occupation on 9 July 1941. City.”
```

**Lithuania / Kaunas** — Row runs 29760 (1941) -> 4792 (1958) across the Holocaust years, so the map interpolates ~16542 Jews in 1950; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L81294: Lithuania | Kaunas | est 1397 | 1941–1958 | pop 29760 → 4792 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00512.html | “Jews were imprisoned in the ghetto on August 15, 1941.”
```

**Ukraine / Kamianets-Podilskyi** — Row runs 24000 (1941) -> 1800 (1978) across the Holocaust years, so the map interpolates ~18600 Jews in 1950 and ~6600 in 1970; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L147700: Ukraine | Kamianets-Podilskyi | est 1447 | 1941–1978 | pop 24000 → 1800 | high | https://ukrainianjewishencounter.org/en/nash-holos-kamianets-podilsk/ | “On August 27th and 28th 1941, at a munitions depot on the outskirts of the city, Nazis machine gunned nearly 24000 Jews.”
```

**Poland / Nowy Sącz** — Row runs 20000 (1942) -> 10 (1991) across the Holocaust years, so the map interpolates ~16736 Jews in 1950 and ~8577 in 1970; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L95613: Poland | Nowy Sącz | est 0 | 1942–1991 | pop 20000 → 10 | high | https://cdp.jewishgen.org/eastern-europe/poland/nowy-sacz | “Ghetto holding 20,000 people was liquidated to Belzec over three days in August. Gestapo murdered last tzaddik, 400 people thrown into pits, and executed 300-500 people for sheltering Jews”
```

**Poland / Włocławek** — Row runs 13600 (1939) -> 0 (1968) across the Holocaust years, so the map interpolates ~8441 Jews in 1950; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L101170: Poland | Włocławek | est 1800 | 1939–1968 | pop 13600 → 0 | high | https://uncoveringjewishheritage.com/category/poland/wloclawek/page/2/ | “Jews comprised nearly 20% of the city's 68,000 residents prior to World War II.”
```

**Ukraine / Uman** — Row runs 13233 (1939) -> 2200 (1958) across the Holocaust years, so the map interpolates ~6845 Jews in 1950; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L153484: Ukraine | Uman | est 1500 | 1939–1958 | pop 13233 → 2200 | high | https://cdp.jewishgen.org/eastern-europe/ukraine/uman | “1939 Jewish population (census) in was 22,179. Living here was Rabbi Borukh from Central Synagogue.”
```

**Netherlands / Rotterdam** — Row runs 11000 (1941) -> 780 (1951) across the Holocaust years, so the map interpolates ~1802 Jews in 1950; in reality the pre-war community was destroyed in 1941-44 (or, in Romania/Bulgaria/Czechoslovakia, emigrated in sharp waves 1948-51), not in a straight line. The start value is a pre-war/wartime figure and the end value belongs to a much later date.

```text
L86396: Netherlands | Rotterdam | est 1605 | 1941–1951 | pop 11000 → 780 | high | https://nl.wikipedia.org/wiki/Loods_24 | “In 1941 still 11,000 Jews lived in Rotterdam”
```

### 3.2 `WARTIME_VICTIM_OR_DEPORTEE_COUNT` — Victim, deportee or liquidation count recorded as population

*Severity: high. Rows flagged: 300 in 239 towns.* The number sits on a sentence about people killed, shot, deported or liquidated. The project's own convention (README, pipeline notes) says victim and deportee counts are never a town's population. Some of these rows also describe the Jews who were present before the action, so each should be read; the sentence wording is quoted.

**Ukraine / Chernivtsi** — The number 50000 is attached to a sentence about people killed/deported/liquidated ('deported to'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L146259: Ukraine | Chernivtsi | est 1400 | 1940–1940 | pop 50000 → 60000 | medium | https://www.buzzsprout.com/2373198/episodes/18123953-34-jewish-cernau-i-czernowitz-in-german-chernivtsi-in-ukr… | “Cernăuți once had a Jewish community of over 50,000; approximately 3,000 of the elite were deported to Siberia in June.”
```

**Poland / Nisko** — The number 45000 is attached to a sentence about people killed/deported/liquidated ('deported to'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L95339: Poland | Nisko | est 1842 | 1939–1939 | pop 45000 → 45000 | high | https://kehilalinks.jewishgen.org/lublin/Nisko_Plan.html | “Reports in the Luxemburger Wort and The Times stated that 45,000 Jews had been deported to the reservation by late 1939.”
```

**Belarus / Minsk** — The number 45000 is attached to a sentence about people killed/deported/liquidated ('murdered'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L5347: Belarus | Minsk | est 1489 | 1941–1941 | pop 45000 → 9000 | high | https://en.wikipedia.org/wiki/Minsk_Ghetto | “End of November 1941: about 25000 Jews murdered with 45000 remaining in the ghetto”
```

**Poland / Częstochowa** — The number 45000 is attached to a sentence about people killed/deported/liquidated ('murdered'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L89691: Poland | Częstochowa | est 1000 | 1945–1945 | pop 45000 → 2200 | medium | https://cdp.jewishgen.org/eastern-europe/poland/czestochowa | “Approximately 45,000 of Częstochowa's Jews were murdered by the Germans during WWII.”
```

**Poland / Łódź** — The number 40000 is attached to a sentence about people killed/deported/liquidated ('deported to'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L102023: Poland | Łódź | est 1790 | 1941–1941 | pop 40000 → 70000 | high | https://www.theholocaustexplained.org/the-camps/case-study-lodz-ghetto/ | “40,000 Jews were deported to Łódź from Germany, Austria, Bohemia, Moravia and Luxembourg.”
```

**Poland / Tarnów** — The number 40000 is attached to a sentence about people killed/deported/liquidated ('shot'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L99691: Poland | Tarnów | est 1445 | 1940–1946 | pop 40000 → 3000 | high | https://www.it.tarnow.pl/wp-content/uploads/2019/03/Tarnow-miniguide-IYP-Rus.pdf | “40000 Jews were enclosed in the city ghetto; more than 10000 were shot and the rest deported to Belzec death camp”
```

**Romania / Oradea** — The number 25000 is attached to a sentence about people killed/deported/liquidated ('deported to'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L104751: Romania | Oradea | est 1407 | 1944–1944 | pop 25000 → 2000 | high | https://cdp.jewishgen.org/eastern-europe/romania/oradea-bihor-county-transylvania | “25,000 Oradean Jews deported to concentration camps”
```

**Ukraine / Lutsk** — The number 17000 is attached to a sentence about people killed/deported/liquidated ('massacred'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L149439: Ukraine | Lutsk | est 950 | 1942–1943 | pop 17000 → 150 | high | http://www.bjbark.com/lutsk,.htm | “About 17,000 Jews were led to the Polanka Hill, on the outskirts of the city, and massacred between August 19-23, 1942.”
```

**Ukraine / Kharkiv** — The number 16000 is attached to a sentence about people killed/deported/liquidated ('shot'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L147877: Ukraine | Kharkiv | est 1890 | 1941–1941 | pop 16000 → 64 | high | https://sites.tufts.edu/ukraine/jewish-heritage-of-ukraine/ | “16,000 Jews were shot or forced into mass graves in Drobytsky Yar, a ravine outside Kharkiv.”
```

**Belarus / Vitebsk** — The number 16000 is attached to a sentence about people killed/deported/liquidated ('liquidated'), i.e. a toll or deportation count, not the town's resident Jewish population; the project convention excludes victim and deportee counts.

```text
L6398: Belarus | Vitebsk | est 1441 | 1941–1943 | pop 16000 → 0 | high | https://kehilalinks.jewishgen.org/vitsyebsk/holocaust.html | “About 16000 Jews held in the Vitebsk ghetto (Jews who remained after evacuation); liquidated from 8 October 1941; estimate 6500-8000 Jews murdered in the city per same source (other sources give more)”
```

### 3.3 `RAMP_BIG_TO_SMALL` — Ramp between a large and a tiny value (likely chained from a subset, victim or unrelated count)

*Severity: high. Rows flagged: 568 in 434 towns.* The row's two ends differ by a factor of 10 or more. In the cases read by hand one end is a different kind of number: workers, tailors, families of victims, refugees, a school roll, a settlement-plan target, or a count from another date or another town. The map then draws a collapse or a boom that no source describes.

**USA / New York** — Row ramps 80000 -> 1600000 over 39 years (a factor of 20); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~840000 in 1899.

```text
L135815: USA | New York | est 1654 | 1880–1919 | pop 80000 → 1600000 | high | https://libguides.nypl.org/jewishNYC/immigration | “The city's Jewish population reached 80,000.”
```

**United Kingdom / London** — Row ramps 10000 -> 200000 over 20 years (a factor of 20); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~105000 in 1910.

```text
L156877: United Kingdom | London | est 1066 | 1900–1920 | pop 10000 → 200000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Pre-war period - massive community”
```

**Ukraine / Kharkiv** — Row ramps 11000 -> 130000 over 38 years (a factor of 12); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~70500 in 1919.

```text
L147872: Ukraine | Kharkiv | est 1890 | 1900–1938 | pop 11000 → 130000 | high | https://www.yadvashem.org/righteous/stories/kharkov.html | “In the early twentieth century, there were 11,000 Jews living in Kharkov, a city situated outside the Pale of Settlement.”
```

**USA / Boston** — Row ramps 5000 -> 85000 over 5 years (a factor of 17); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~45000 in 1912.

```text
L123883: USA | Boston | est 1649 | 1910–1915 | pop 5000 → 85000 | high | https://globalboston.bc.edu/index.php/home/immigrant-places/east-boston/jews-in-east-boston/ | “East Boston peak of around five thousand in the 1910s (year 1910 assumed); neighborhood subset; left blank”
```

**USA / West Palm Beach** — Row ramps 2300 -> 73441 over 70 years (a factor of 32); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~37870 in 1989.

```text
L143862: USA | West Palm Beach | est 1892 | 1954–2024 | pop 2300 → 73441 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=2178&ownerType=0&ownerId=2775 | “AJYB vol 56 (1955) Table 1 Communities with Jewish populations of 100 or more (estimated), Jewish Population of the United States 1954; state heading Florida; PDF page 7.”
```

**USA / Newark** — Row ramps 65000 -> 500 over 17 years (a factor of 130); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~32750 in 1968.

```text
L135863: USA | Newark | est 1844 | 1960–1977 | pop 65000 → 500 | high | https://www.wbgo.org/show/wbgo-journal/2017-07-10/newarks-jewish-community-pre-and-post-1967-rebellion | “Over 65,000 people once made up Newark's Jewish community in the 1950s and 1960s, prior to outmigration and the 1967 Newark Rebellion.”
```

**USA / Seattle** — Row ramps 63400 -> 70 over 16 years (a factor of 906); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~31735 in 1883.

```text
L140655: USA | Seattle | est 1875 | 1875–1891 | pop 63400 → 70 | high | https://wwrn.org/articles/43896/ | “A newly released study pegs the Jewish population of the region at 63,400.”
```

**France / Paris** — Row ramps 2733 -> 60000 over 94 years (a factor of 22); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~31366 in 1856.

```text
L23435: France | Paris | est -50 | 1809–1903 | pop 2733 → 60000 | high | https://cdp.jewishgen.org/western-europe/france/paris | “The Consistory of Paris was appointed and installed, consisting of 2,733 Jewish members”
```

**Latvia / Daugavpils** — Row ramps 1540 -> 55686 over 128 years (a factor of 36); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~28613 in 1848.

```text
L79574: Latvia | Daugavpils | est 1772 | 1784–1912 | pop 1540 → 55686 | high | https://www.jsc.lu.lv/en/ebreji-latvijas-vesture/raksti-un-petijumi/kulturas-un-sociala-dzive/some-reports-abo… | “Jews in the Daugavpils region according to a general census.”
```

**Ukraine / Bratslav** — Row ramps 4000 -> 52000 over 78 years (a factor of 13); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~28000 in 1608.

```text
L145800: Ukraine | Bratslav | est 1479 | 1569–1647 | pop 4000 → 52000 | high | https://ukrainianjewishencounter.org/media/UJE_book_readerspreads_08_2019_Eng.pdf | “Number of Jews in the provinces of Volhynia, Podolia, Kyiv, and Bratslav combined, across 115 localities.”
```

**Uzbekistan / Tashkent** — Row ramps 3000 -> 50445 over 44 years (a factor of 17); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~26722 in 1936.

```text
L158688: Uzbekistan | Tashkent | est 1865 | 1914–1958 | pop 3000 → 50445 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/tashkent | “Encyclopaedia Judaica 'Tashkent': 'On the eve of World War I about 3,000 Jews lived there'”
```

**Uzbekistan / Samarkand** — Row ramps 50000 -> 3792 over 716 years (a factor of 13); one end is probably a different kind of number taken from the neighbouring row (subset, victim or family count, plan target) or a distant date. The map shows ~26896 in 1528.

```text
L158633: Uzbekistan | Samarkand | est 1150 | 1170–1886 | pop 50000 → 3792 | low | https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/bukharan-jews | “Jewish traveler Benjamin of Tudela visited Central Asia and documented a populous Jewish community of 50,000 Jews living in the city. This figure is far larger than neighbouring rows for the same town, or is a medieval traveller's estimate.”
```

### 3.4 `RAMP_OVER_SOURCED_POINT` — Long straight-line row lies over sourced counts

*Severity: high. Rows flagged: 394 in 334 towns.* A row interpolates linearly from one number to a distant one (often 50-300 years apart) and the map shows the highest value among overlapping rows, so the ramp overrides lower sourced counts inside its span. The end value is usually the next row's start (chained), not a fact about the row's own date.

**Ukraine / Bratslav** — Interpolated value ~26859 in 1776 is 323.6x the sourced count 83 for that year (row 145804: 1776: 83 Jews in Virtual Shtetl's demography table for Bratslav (colum); the map shows the higher value.

```text
L145801: Ukraine | Bratslav | est 1479 | 1648–1896 | pop 52000 → 3290 | high | https://ukrainianjewishencounter.org/media/UJE_book_readerspreads_08_2019_Eng.pdf | “Number of Jews in the provinces of Volhynia, Podolia, Kyiv, and Bratslav combined, across 115 localities.”
```

**Uzbekistan / Samarkand** — Interpolated value ~8051 in 1820 is 161.0x the sourced count ~50 for that year (row 158637: Russian Wikipedia (Бухарские евреи) citing Meyendorff's 1820 travel ac); the map shows the higher value.

```text
L158633: Uzbekistan | Samarkand | est 1150 | 1170–1886 | pop 50000 → 3792 | low | https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/bukharan-jews | “Jewish traveler Benjamin of Tudela visited Central Asia and documented a populous Jewish community of 50,000 Jews living in the city. This figure is far larger than neighbouring rows for the same town, or is a medieval traveller's estimate.”
```

**Romania / Iași** — Interpolated value ~28157 in 1930 is 98.8x the sourced count 285 for that year (row 104317: 1930 Romanian census (29 Dec 1930), by ethnicity ('neam'): 285 Evrei (); the map shows the higher value.

```text
L104316: Romania | Iași | est 1450 | 1899–2006 | pop 39441 → 492 | high | https://kehilalinks.jewishgen.org/iasi/iasi.html | “Jewish population”
```

**Lithuania / Klaipėda** — Interpolated value ~4897 in 1828 is 94.2x the sourced count 52 for that year (row 81380: Jews by religion, from the de.wikipedia population table of Klaipėda: ); the map shows the higher value.

```text
L81379: Lithuania | Klaipėda | est 1400 | 1815–1853 | pop 35 → 14248 | high | https://www.jewishgen.org/yizkor/lithuania4/lit4_091.html | “In 1815 there were 35 Jews in Memel.”
```

**USA / Camden, SC** — Interpolated value ~5175 in 1937 is 77.2x the sourced count 67 for that year (row 124755: Population estimate of 67 Jews for Camden in 1937, as quoted in the En); the map shows the higher value.

```text
L124754: USA | Camden, SC | est 1878 | 1917–1952 | pop 75 → 9000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=1736&ownerType=0&ownerId=2333 | “AJYB vol 20 (1918-19) Oppenheim, The Jewish Population of the United States (1917 inquiry), Table H towns of 1,000-20,000 general population; state heading South Carolina; PDF page 33.”
```

**Iran / Kermanshah** — Interpolated value ~3811 in 1973 is 76.2x the sourced count 50 for that year (row 62459: Netzer's table 'The Jewish population of Kermanshah, 1827-2000' (print); the map shows the higher value.

```text
L62457: Iran | Kermanshah | est 950 | 1948–1978 | pop 2864 → 4000 | high | https://www.jewishvirtuallibrary.org/kermanshah | “Jews of Kermanshah numbered 2864 persons including a few families from Iraq among 80000 Muslims; five synagogues one bath-house one Alliance school”
```

**Belarus / Grodno** — Interpolated value ~17809 in 1766 is 69.8x the sourced count 255 for that year (row 4509: Jews in Grodno in 1766 per REE (Russian Jewish Encyclopedia): «в 1766 ); the map shows the higher value.

```text
L4504: Belarus | Grodno | est 1350 | 1560–1886 | pop 1000 → 27601 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/grodno | “Encyclopaedia Judaica: one estimate puts the Jewish population at 1000 in 1560.”
```

**Poland / Mława** — Interpolated value ~5629 in 1808 is 41.1x the sourced count 137 for that year (row 95173: 1808: 137 Jews among 893 inhabitants (15.3 per cent) in the town; B. W); the map shows the higher value.

```text
L95170: Poland | Mława | est 1507 | 1584–1884 | pop 115 → 7500 | high | http://www.zchor.org/mlawa/pinkas.htm | “Estimate based on families. 23 Jewish families lived in Mława, owning five homes.”
```

**Iraq / Baghdad** — Interpolated value ~38250 in 1180 is 38.3x the sourced count 1000 for that year (row 62950: Petahiah of Regensburg, Sibbub ha-Olam, c.1180: traveller names the pl); the map shows the higher value.

```text
L62949: Iraq | Baghdad | est 762 | 1150–1793 | pop 40000 → 2500 | low | https://www.worldjewishcongress.org/en/legacy-of-jews-in-MENA/country/iraq | “Estimated population for the second half of the 12th century by Benjamin of Tudela; historians consider this figure an exaggeration. He noted 28 synagogues and 10 yeshivot. This figure is far larger than neighbouring rows for the same town, or is a medieval traveller's estimate.”
```

**Czech Republic / Plzeň** — Interpolated value ~1871 in 1849 is 37.4x the sourced count ~50 for that year (row 17355: Lexikon table 'Juden in Pilsen' (credit on the page: Rudolf M. Wlasche); the map shows the higher value.

```text
L17349: Czech Republic | Plzeň | est 1250 | 1250–1892 | pop 70 → 2000 | high | https://www.private-prague-guide.com/article/the-great-synagogue-in-pilsen/ | “Currently, there are only about 70 Jews in Pilsen.”
```

**Spain / Madrid** — Interpolated value ~2134 in 1955 is 35.6x the sourced count 60 for that year (row 116808: Members of the Jewish community of Madrid according to A. Cebrian Abel); the map shows the higher value.

```text
L116804: Spain | Madrid | est 100 | 1905–1964 | pop 100 → 2500 | medium | https://www.jewishencyclopedia.com/articles/10251 | “About twenty families x5 (JE Madrid article, c.1905: since 1869 about twenty families, no congregation); year approximate.”
```

**Georgia / Oni** — Interpolated value ~1636 in 1995 is 32.7x the sourced count ~50 for that year (row 25635: About 50 Jews in Oni (Russian Jewish Encyclopedia (REE): 'ок. 50 еврее); the map shows the higher value.

```text
L25632: Georgia | Oni | est 1700 | 1972–2015 | pop 3500 → 16 | high | https://he.wikipedia.org/wiki/%D7%99%D7%94%D7%93%D7%95%D7%AA_%D7%90%D7%95%D7%A0%D7%99 | “In 1972 the community numbered about 3,500 people”
```

### 3.5 `EXPULSION_RAMP` — Abrupt expulsion/massacre smoothed into a decades-long decline

*Severity: high. Rows flagged: 42 in 38 towns.* The comment records a dated event (expulsion, massacre, forced conversion) that ended or destroyed the community, but the row declines in a straight line over decades or centuries.

**Czech Republic / Brno** — The comment records an abrupt event (no Jews) but the row declines gradually 1000 -> 52 over 357 years; the map shows ~526 in 1526, long after the community is documented as gone.

```text
L15491: Czech Republic | Brno | est 1091 | 1348–1705 | pop 1000 → 52 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/brno | “About 1000 Jews in Brno (city); Brno Jews paid more tax than Olomouc or Znojmo; largest Moravian Jewish community”
```

**Czech Republic / Cheb** — The comment records an abrupt event (massacre) but the row declines gradually 3000 -> 10 over 86 years; the map shows ~1505 in 1393, long after the community is documented as gone.

```text
L15693: Czech Republic | Cheb | est 1250 | 1350–1436 | pop 3000 → 10 | high | https://cdp.jewishgen.org/eastern-europe/czech-republic/cheb | “Almost all of the 3000 Jews were massacred in a bloody pogrom in 1350, and the Jewish street was renamed Mordgaesschen (Murder Lane).”
```

**France / Béziers** — The comment records an abrupt event (massacre) but the row declines gradually 200 -> 50 over 96 years; the map shows ~125 in 1257, long after the community is documented as gone.

```text
L20053: France | Béziers | est 732 | 1209–1305 | pop 200 → 50 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/beziers | “"Jewish victims of the massacre of Albigenses; most Jewish population had previously fled."”
```

**France / Blois** — The comment records an abrupt event (burn) but the row declines gradually 40 -> 3 over 767 years; the map shows ~22 in 1554, long after the community is documented as gone.

```text
L20166: France | Blois | est 996 | 1171–1938 | pop 40 → 3 | medium | https://jwa.org/encyclopedia/article/pulcellina-of-blois | “Total Jewish population was approximately 40. In May 1171, Pulcellina, her two daughters, and as many as thirty additional Jews (including 17 or 18 women, religious leaders, and scholars) were burned at the stake following a false ritual murder accusation.”
```

**Germany / Heilbronn** — The comment records an abrupt event (Pogrom) but the row declines gradually 143 -> 0 over 168 years; the map shows ~72 in 1382, long after the community is documented as gone.

```text
L36884: Germany | Heilbronn | est 1050 | 1298–1466 | pop 143 → 0 | high | https://cdp.jewishgen.org/germany/baden-wuerttemberg-baden-wuerttemberg/heilbronn | “143 Jews were killed during the Rintfleisch-Pogrom.”
```

**Germany / Lindau** — The comment records an abrupt event (Burn) but the row declines gradually 15 -> 3 over 511 years; the map shows ~9 in 1685, long after the community is documented as gone.

```text
L40293: Germany | Lindau | est 1241 | 1430–1941 | pop 15 → 3 | high | https://rijo.hier-im-netz.de/pdf/EN_BY_JU_bye.pdf | “Burning at the stake of about 15 Jews and expulsion of the Jewish community after an accusation of ritual murder.”
```

**Germany / Regensburg** — The comment records an abrupt event (expel) but the row declines gradually 800 -> 110 over 280 years; the map shows ~455 in 1659, long after the community is documented as gone.

```text
L45072: Germany | Regensburg | est 550 | 1519–1799 | pop 800 → 110 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Regensburg | “Event: When Maximilian died, the opportunity was taken to expel the Jews from the city, 800 in all, in 1519. [Population: the article gives 800 Jews expelled in all]”
```

**Germany / Rotenburg** — The comment records an abrupt event (pogrom) but the row declines gradually 450 -> 17 over 639 years; the map shows ~234 in 1617, long after the community is documented as gone.

```text
L45668: Germany | Rotenburg | est 1180 | 1298–1937 | pop 450 → 17 | high | https://www.jewishtraveler.co.il/jewish-heritage-in-rothenburg/ | “Rindfleisch pogrom occurred; 450 Jews sought shelter in the royal castle and were killed, including 178 children”
```

**Germany / Rothenburg ob der Tauber** — The comment records an abrupt event (massacre) but the row declines gradually 450 -> 165 over 84 years; the map shows ~308 in 1340, long after the community is documented as gone.

```text
L45700: Germany | Rothenburg ob der Tauber | est 1119 | 1298–1382 | pop 450 → 165 | high | https://www.alemannia-judaica.de/rothenburg_synagoge.htm | “Entire community of over 450 Jews was slaughtered during the Rindfleisch massacres”
```

**Germany / Weinheim** — The comment records an abrupt event (massacre) but the row declines gradually 79 -> 25 over 350 years; the map shows ~52 in 1473, long after the community is documented as gone.

```text
L49564: Germany | Weinheim | est 1298 | 1298–1648 | pop 79 → 25 | high | http://juden-in-weinheim.de/en/index.html | “An impoverished Franconian knight named Rintfleisch attacked the community and massacred 79 members”
```

### 3.6 `CONFLICTING_OVERLAP` — Overlapping rows of one town differ by 5x or more

*Severity: medium. Rows flagged: 326 in 175 towns.* Two rows cover the same year with numbers at least five times apart; the map draws the larger. Often one is a subset, a ghetto/deportee count or an enlarged-population estimate.

**Poland / Radom** — Around 1941 this row gives ~32000 while row 97492 (1941-1941: 100>40; 'July 1941 a group of 100 refugees from Radom arrived in Lago') gives ~100 (320x lower). The map shows the higher value; at least one of the two is a different kind of number.

```text
L97489: Poland | Radom | est 1568 | 1939–1941 | pop 25000 → 32000 | medium | https://www.jewishgen.org/databases/holocaust/0189_Radom_prison.html | “Jewish population approximately 25,000 before World War II”
```

**Ukraine / Bratslav** — Around 1765 this row gives ~29020 while row 145802 (1765-1765: 101>101; 'Jews in Bratslav in 1765 per REE (Russian Jewish Encyclopedi') gives ~101 (287x lower). The map shows the higher value; at least one of the two is a different kind of number.

```text
L145801: Ukraine | Bratslav | est 1479 | 1648–1896 | pop 52000 → 3290 | high | https://ukrainianjewishencounter.org/media/UJE_book_readerspreads_08_2019_Eng.pdf | “Number of Jews in the provinces of Volhynia, Podolia, Kyiv, and Bratslav combined, across 115 localities.”
```

**Poland / Będzin** — Around 1939 this row gives ~22174 while row 88037 (1939-1939: 100>83; 'arson of the synagogue on the night of September 8th to 9th.') gives ~100 (222x lower). The map shows the higher value; at least one of the two is a different kind of number.

```text
L88035: Poland | Będzin | est 1226 | 1939–1939 | pop 22174 → 83 | high | https://kehilalinks.jewishgen.org/zaglembie/Zag001.html | “Census of Jews in Bedzin (circa November 1939) (22,174 names with birthdates, addresses and occupations)”
```

**Poland / Sosnowiec** — Around 1939 this row gives ~28000 while row 98788 (1939-1939: 250>30; 'In Sosnowiec three synagogues were burnt and 250 people arre') gives ~250 (112x lower). The map shows the higher value; at least one of the two is a different kind of number.

```text
L98786: Poland | Sosnowiec | est 1801 | 1939–1939 | pop 28000 → 30 | medium | https://collections.ushmm.org/search/catalog/pa1084323#download-licensing | “On the eve of World War II, Sosnowiec supported a Jewish community of approximately 28,000.”
```

**Ukraine / Buchach** — Around 1942 this row gives ~15000 while row 146032 (1942-1942: 150>3600; 'Shortly before Passover 1942: 150 artisans put on railroad c') gives ~150 (100x lower). The map shows the higher value; at least one of the two is a different kind of number.

```text
L146033: Ukraine | Buchach | est 1500 | 1942–1942 | pop 15000 → 3600 | high | https://www.jewishgen.org/yizkor/buchach/buc272.html | “August 1942: Number of Jews increased to 15,000 due to influx from other towns.”
```

**Romania / Iași** — Around 1930 this row gives ~28157 while row 104317 (1930-1930: 285>285; '1930 Romanian census (29 Dec 1930), by ethnicity ('neam'): 2') gives ~285 (99x lower). The map shows the higher value; at least one of the two is a different kind of number.

```text
L104316: Romania | Iași | est 1450 | 1899–2006 | pop 39441 → 492 | high | https://kehilalinks.jewishgen.org/iasi/iasi.html | “Jewish population”
```

**Belarus / Grodno** — Around 1766 this row gives ~17809 while row 4509 (1766-1766: 255>255; 'Jews in Grodno in 1766 per REE (Russian Jewish Encyclopedia)') gives ~255 (70x lower). The map shows the higher value; at least one of the two is a different kind of number.

```text
L4504: Belarus | Grodno | est 1350 | 1560–1886 | pop 1000 → 27601 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/grodno | “Encyclopaedia Judaica: one estimate puts the Jewish population at 1000 in 1560.”
```

**United Kingdom / Glasgow** — Around 1964 this row gives ~13400 while row 156312 (1961-1976: 200>254; 'Number of seatholders at Glasgow Reform Synagogue') gives ~211 (64x lower). The map shows the higher value; at least one of the two is a different kind of number.

```text
L156313: United Kingdom | Glasgow | est 1914 | 1964–1964 | pop 13400 → 13400 | high | https://archive.jpr.org.uk/download?id=2367 | “P. Vincent, 'Glasgow Jewish Schoolchildren', Jewish Journal of Sociology 6(2), Dec 1964, p. 220: 'The Jewish population of the greater Glasgow area has been estimated to be 13,400, making it the fourth largest Jewish community in the United Kingdom (London 280,000: Manchester and Salford 28,000: Leeds 25,000)'; on p. 230 he says the figure is 'as stated in T…”
```

### 3.7 `TEMPLATE_PLACEHOLDER` — Early hand-typed / generic placeholder rows

*Severity: medium. Rows flagged: 517 in 279 towns.* Rows from the early hand-typed batch (generic comments such as 'Early settlement - ...', 'Jewish community established in 1700s', 'Peak population - over 3,000 Jews before Holocaust', crarg.org template phrases), blank probability, round numbers and wide spans. They are not observations; the project notes call them 'unverified approximation'.

**USA / New York** — Early hand-typed/generic placeholder row (generic comment, blank or low probability, round numbers, wide span); not a sourced observation. Its ramp is drawn on the map and can override sourced points.

```text
L135825: USA | New York | est 1654 | 1950–1959 | pop 2000000 → 1860000 | prob — | https://en.wikipedia.org/wiki/History_of_the_Jews_in_New_York_City | “Post-WWII suburban migration begins”
```

**United Kingdom / London** — Early hand-typed/generic placeholder row (generic comment, blank or low probability, round numbers, wide span); not a sourced observation. Its ramp is drawn on the map and can override sourced points.

```text
L156900: United Kingdom | London | est 1066 | 1945–1970 | pop 200000 → 180000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Post-war period - stable community”
```

**Poland / Częstochowa** — Early hand-typed/generic placeholder row (generic comment, blank or low probability, round numbers, wide span); not a sourced observation. Its ramp is drawn on the map and can override sourced points.

```text
L89678: Poland | Częstochowa | est 1620 | 1939–1942 | pop 30000 → 5000 | prob — | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “German occupation - ghetto established, mass deportations”
```

**South Africa / Johannesburg** — Early hand-typed/generic placeholder row (generic comment, blank or low probability, round numbers, wide span); not a sourced observation. Its ramp is drawn on the map and can override sourced points.

```text
L114996: South Africa | Johannesburg | est 1880 | 2000–2015 | pop 30000 → 23420 | prob — | https://en.wikipedia.org/wiki/History_of_the_Jews_in_South_Africa | “Modern period - largest Jewish community in South Africa”
```

**Azerbaijan / Qırmızı Qəsəbə** — Early hand-typed/generic placeholder row (generic comment, blank or low probability, round numbers, wide span); not a sourced observation. Its ramp is drawn on the map and can override sourced points.

```text
L3600: Azerbaijan | Qırmızı Qəsəbə | est 1150 | 1991–1997 | pop 18000 → 5600 | high | https://newlinesmag.com/essays/how-the-mountain-jews-of-azerbaijan-endure/ | “Peak population”
```

**Argentina / Buenos Aires** — Early hand-typed/generic placeholder row (generic comment, blank or low probability, round numbers, wide span); not a sourced observation. Its ramp is drawn on the map and can override sourced points.

```text
L496: Argentina | Buenos Aires | est 1860 | 1940–1960 | pop 15000 → 50000 | low | https://www.jewishvirtuallibrary.org/buenos-aires-argentina-jewish-history-tour | “Post-war period - Holocaust survivors arrive”
```

**Iran / Tehran** — Early hand-typed/generic placeholder row (generic comment, blank or low probability, round numbers, wide span); not a sourced observation. Its ramp is drawn on the map and can override sourced points.

```text
L62699: Iran | Tehran | est 1000 | 1000–1827 | pop 15000 → 500 | low | https://www.jewishvirtuallibrary.org/tehran-iran | “Jewish community established in 1000s”
```

**Poland / Radomsko** — Early hand-typed/generic placeholder row (generic comment, blank or low probability, round numbers, wide span); not a sourced observation. Its ramp is drawn on the map and can override sourced points.

```text
L97520: Poland | Radomsko | est 1500 | 1939–1941 | pop 12000 → 2000 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “German occupation - ghetto established, mass deportations”
```

### 3.8 `DERIVED_FROM_AREA` — Population computed from site area x density

*Severity: medium. Rows flagged: 183 in 142 towns.* The project rule is 'never compute a population from area x density'; these rows state they were derived from hectares (Broshi/Finkelstein style coefficients) and are plotted as populations.

**Israel / Samaria** — Population is derived from site area x a density coefficient (the comment says so); the project's own rule is never to compute a population from area.

```text
L73665: Israel | Samaria | est -900 | -750–-723 | pop 15000 → — | high | https://www.jstor.org/stable/1357138 | “Iron Age IIB, mid-8th century BCE, capital of the Israelite kingdom: built-up area 60 hectares, population 15,000 (Broshi and Finkelstein 1992, BASOR 287: 47-60, Table 1 and p. 51; the authors' density coefficient is 250 inhabitants per hectare; the area follows the maximalist view of Avigad).”
```

**United Kingdom / Salford** — Population is derived from site area x a density coefficient (the comment says so); the project's own rule is never to compute a population from area.

```text
L157729: United Kingdom | Salford | est 1794 | 2011–2011 | pop 7593 → 7593 | high | https://www.nomisweb.co.uk/api/v01/dataset/NM_529_1.data.csv?date=latest&rural_urban=0&c_relpuk11=0,4&measures… | “2011 Census (table QS208EW Religion, Nomis): 7593 of 103886 usual residents of the "Salford" built-up area sub-division (ONS 2011 built-up area) described their religion as Jewish. The religion question was voluntary, so this is self-described religion, not community membership.”
```

**Israel / Jerusalem** — Population is derived from site area x a density coefficient (the comment says so); the project's own rule is never to compute a population from area.

```text
L68664: Israel | Jerusalem | est -2000 | -750–-723 | pop 7500 → 25000 | high | https://www.jstor.org/stable/1357138 | “Iron Age IIB, mid-8th century BCE, capital of Judah: population 7,500 on a built-up area of 30 hectares (Broshi and Finkelstein 1992, BASOR 287: 47-60, Table 1 and p. 51-52; a middle approach between the City of David alone and the large post-722 expansion; 250 inhabitants per hectare).”
```

**United Kingdom / Borehamwood** — Population is derived from site area x a density coefficient (the comment says so); the project's own rule is never to compute a population from area.

```text
L155312: United Kingdom | Borehamwood | est 1955 | 2011–2011 | pop 5436 → 5436 | high | https://www.nomisweb.co.uk/api/v01/dataset/NM_529_1.data.csv?date=latest&rural_urban=0&c_relpuk11=0,4&measures… | “2011 Census (table QS208EW Religion, Nomis): 5436 of 35489 usual residents of the "Borehamwood" built-up area sub-division (ONS 2011 built-up area) described their religion as Jewish. The religion question was voluntary, so this is self-described religion, not community membership.”
```

**Israel / Dan** — Population is derived from site area x a density coefficient (the comment says so); the project's own rule is never to compute a population from area.

```text
L65950: Israel | Dan | est -2000 | -750–1938 | pop 5000 → 20 | low | https://www.jstor.org/stable/1357138 | “Iron Age IIB, mid-8th century BCE. DERIVED figure, not published for this site: Broshi and Finkelstein 1992 (BASOR 287: 47-60) give a built-up area of 20 hectares and use a density of 250 inhabitants per hectare, which implies about 5,000; the site was destroyed in 733/732 BCE. The explicit estimate for the period (Dever) is on the Iron Age IIB row.”
```

### 3.9 `HOMONYM_MERGED_PIN` — Two places with the same name share one marker

*Severity: high. Rows flagged: 26 in 12 towns.* Rows of different villages/towns of the same name were merged under one pin (different coordinates or an explicit note in the comment), mixing their Jewish populations.

**Germany / Mülheim** — Rows of this town have coordinates 7.00417,50.96222, other rows of the same pin are at 7.49528,50.38694: two different places of the same name share one marker, so the map mixes their Jewish populations.

```text
L42110: Germany | Mülheim | est 1250 | 1250–1250 | pop — → — | low | Barzen, Rainer Josef: 'Ländliche jüdische Siedlungen und Niederlassungen in Aschkenas. Vom Hochmittelalter bis… | “Jewish settlement in Mülheim in the 13th century: Barzen (2013, n. 10) names Mülheim am Rhein (today Mülheim) among the non-urban (village or small-town) Jewish settlements of the area north and west of Cologne and Koblenz that are attested for this period; the place list comes from the 'further places' of the Haverkamp map atlas (Ortskatalog, p. 241). The s…”
```

**Moldova / Taraclia** — Rows of this town have coordinates 28.66816,45.90273, other rows of the same pin are at 29.11796,46.56780: two different places of the same name share one marker, so the map mixes their Jewish populations.

```text
L84132: Moldova | Taraclia | est 1924 | 1924–1924 | pop — → — | high | https://www.jewishgen.org/bessarabia/files/misc/GeographicalDictionary_JewishPopulationinBessarabia082013.pdf | “Jewish presence confirmed by 5 Jewish businesses listed in the 1924 Bessarabia Business Directory”
```

**Poland / Maszewo** — Rows of this town have coordinates 14.90553,52.06896, other rows of the same pin are at 15.06139,53.49639: two different places of the same name share one marker, so the map mixes their Jewish populations.

```text
L94615: Poland | Maszewo | est 1782 | 1782–1782 | pop 31 → 31 | high | https://de.wikipedia.org/wiki/Maszewo | “Jews by religion, from the de.wikipedia population table of Maszewo: 1782: 1,002 inhabitants, "davon 31 Juden". The article cites: Gustav Kratz: Die Städte der Provinz Pommern – Abriss ihrer Geschichte, zumeist nach Urkunden. Berlin 1865, S ....”
```

**Ukraine / Babyn** — Rows of this town have coordinates 25.62714,48.64472, other rows of the same pin are at 26.85670,48.52460: two different places of the same name share one marker, so the map mixes their Jewish populations.

```text
L144968: Ukraine | Babyn | est 1900 | 1900–1900 | pop 88 → 88 | high | http://czernowitz.ehpes.com/census/censusbuk1900.pdf | “Austrian census of 31 Dec 1900 (Gemeindelexikon der im Reichsrate vertretenen Koenigreiche und Laender XIII Bukowina, Vienna 1907, PDF page 51): 88 Jews (israelitisch) of 1448 inhabitants in municipality Babin (also Babyn, Babin). Jews by confession; manor districts (Gutsgebiete) not included.”
```

**Ukraine / Bilopillia** — Rows of this town have coordinates 28.86969,49.8448, other rows of the same pin are at 34.302537,51.147398: two different places of the same name share one marker, so the map mixes their Jewish populations.

```text
L145543: Ukraine | Bilopillia | est 1847 | 1847–1847 | pop 1237 → 1237 | high | https://ru.wikisource.org/wiki/ЕЭБЕ/Белополье | “EEBE (Brockhaus-Efron Jewish Encyclopedia, ru.wikisource): 1847 revision-list count of the town's Jewish society (kahal), 1237 souls: «По ревизии 1847 г. «белопольское евр. общество» составляли 1237 душ». Persons of both sexes per the 1847 revision; the society may include nearby hamlets.”
```

**Ukraine / Hlynky** — Rows of this town have coordinates 24.76497,48.66012, other rows of the same pin are at 26.41228,50.57981: two different places of the same name share one marker, so the map mixes their Jewish populations.

```text
L147115: Ukraine | Hlynky | est 1921 | 1921–1921 | pop 30 → 30 | high | https://polona.pl/item/skorowidz-miejscowosci-rzeczypospolitej-polskiej-opracowany-na-podstawie-wynikow,NjcwOT… | “1921 Polish census (30 Sept 1921, present population excl. military), by religion: 30 Mosaic (mojzeszowego) of 971 inhabitants (3.1%); nationality 'Jewish' (zydowska) 17. Skorowidz miejscowosci RP vol. 14 (Stanislawow voivodeship), powiat Nadwórna, entry 'Glinki' (wieś), Polona page 28. Interwar Polish name 'Glinki'.”
```

**Ukraine / Ivankivtsi** — Rows of this town have coordinates 25.67275,48.45332, other rows of the same pin are at 26.13432,49.80693: two different places of the same name share one marker, so the map mixes their Jewish populations.

```text
L147499: Ukraine | Ivankivtsi | est 1900 | 1900–1900 | pop 167 → 167 | high | http://czernowitz.ehpes.com/census/censusbuk1900.pdf | “Austrian census of 31 Dec 1900 (Gemeindelexikon der im Reichsrate vertretenen Koenigreiche und Laender XIII Bukowina, Vienna 1907, PDF page 45): 167 Jews (israelitisch) of 1986 inhabitants in municipality Iwankoutz (also Iwankiwci, Ivancauti). Jews by confession; manor districts (Gutsgebiete) not included.”
```

**Hungary / Békés** — The row's own comment says the source refers to a different place of the same name; the figure is attached to this marker anyway.

```text
L52736: Hungary | Békés | est 1660 | 1836–1868 | pop 542 → 537 | high | https://alchetron.com/History-of-the-Jews-in-B%C3%A9k%C3%A9s-%28Hungary%29 | “Jewish population (source refers to Békés County)”
```

**Poland / Jabłonka** — The row's own comment says the source refers to a different place of the same name; the figure is attached to this marker anyway.

```text
L91474: Poland | Jabłonka | est 1650 | 1700–1763 | pop 1739 → 97 | high | https://cdp.jewishgen.org/eastern-europe/poland/jablonka-koscielna-podlaski | “Jewish population was 1,739 with the privilege of markets and two fairs (Source refers to Jabłonka Kościelna).”
```

**Poland / Olsztyn (Warmia-Masuria)** — The row's own comment says the source refers to a different place of the same name; the figure is attached to this marker anyway.

```text
L95903: Poland | Olsztyn (Warmia-Masuria) | est 1808 | 1870–1894 | pop 56 → 588 | high | https://cdp.jewishgen.org/eastern-europe/poland/olsztyn-warmisko-mazurskie | “Note: Source refers to Olsztyn in Warmińsko-Mazurskie (Allenstein).”
```

### 3.10 `CBS_SERIES_CLIFF` — Israeli CBS series falls by >50% inside one year

*Severity: medium. Rows flagged: 35 in 28 towns.* The locality series built from CBS files shows an implausible one-year fall for a stable locality, the signature of a column/definition change or parsing error in one yearly file.

**Israel / Beersheba** — CBS-derived series falls from 178307 to 10000 within 2 year(s) (2003->2005); a drop of >50% in a stable locality suggests a column/definition change in the source file (e.g. 'Jews and others' vs 'Jews') or a parsing error.

```text
L64871: Israel | Beersheba | est -1200 | 2003–2005 | pop 178307 → 10000 | high | https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx | “Israel CBS locality files, 'Jews and others' (2003-2017 = total x the locality's 2018 Jewish share).”
```

**Israel / Yokneam** — CBS-derived series falls from 23778 to 1382 within 2 year(s) (2019->2021); a drop of >50% in a stable locality suggests a column/definition change in the source file (e.g. 'Jews and others' vs 'Jews') or a parsing error.

```text
L75610: Israel | Yokneam | est -2000 | 2019–2021 | pop 23778 → 1382 | high | https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx | “Israel CBS locality files, 'Jews and others' (2003-2017 = total x the locality's 2018 Jewish share).”
```

**Israel / Kokhav Ya'aqov** — CBS-derived series falls from 9794 to 4043 within 1 year(s) (2022->2023); a drop of >50% in a stable locality suggests a column/definition change in the source file (e.g. 'Jews and others' vs 'Jews') or a parsing error.

```text
L70125: Israel | Kokhav Ya'aqov | est 1985 | 2022–2023 | pop 9794 → 4043 | high | https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx | “Israel CBS locality files, 'Jews and others' (2003-2017 = total x the locality's 2018 Jewish share).”
```

**Israel / Nizzan** — CBS-derived series falls from 2695 to 621 within 1 year(s) (2006->2007); a drop of >50% in a stable locality suggests a column/definition change in the source file (e.g. 'Jews and others' vs 'Jews') or a parsing error.

```text
L72261: Israel | Nizzan | est 1949 | 2006–2007 | pop 2695 → 621 | high | https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx | “Israel CBS locality files, 'Jews and others' (2003-2017 = total x the locality's 2018 Jewish share).”
```

**Israel / Mattityahu** — CBS-derived series falls from 1371 to 445 within 1 year(s) (2007->2008); a drop of >50% in a stable locality suggests a column/definition change in the source file (e.g. 'Jews and others' vs 'Jews') or a parsing error.

```text
L70791: Israel | Mattityahu | est 1981 | 2007–2008 | pop 1371 → 445 | high | https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx | “Israel CBS locality files, 'Jews and others' (2003-2017 = total x the locality's 2018 Jewish share).”
```

**Israel / Sha'ar Menashe** — CBS-derived series falls from 1020 to 389 within 1 year(s) (2007->2008); a drop of >50% in a stable locality suggests a column/definition change in the source file (e.g. 'Jews and others' vs 'Jews') or a parsing error.

```text
L74047: Israel | Sha'ar Menashe | est 1949 | 2007–2008 | pop 1020 → 389 | high | https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx | “Israel CBS locality files, 'Jews and others' (2003-2017 = total x the locality's 2018 Jewish share).”
```

### 3.11 `YEAR_AS_POPULATION` — Year written into the population column

*Severity: high. Rows flagged: 6 in 4 towns.* The population equals the row's own year (or the next row's year); in the Rymanów case three consecutive rows show it.

**Poland / Rymanów** — pop_start 1746 equals the row's own year and pop_end 1751 equals the next row's year; the three consecutive Rymanów rows (1746, 1751, 1759) look like years written into the population columns.

```text
L97978: Poland | Rymanów | est 1542 | 1746–1750 | pop 1746 → 1751 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol3_00356.html | “Jewish population of Rymanow in 1746 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation.”
```

**Poland / Rymanów** — pop_start 1751 equals year_start and pop_end 1759 equals the next row's year_start: year written as population.

```text
L97979: Poland | Rymanów | est 1542 | 1751–1758 | pop 1751 → 1759 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol3_00356.html | “Jewish population of Rymanow in 1751 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation.”
```

**Poland / Rymanów** — pop_start 1759 equals year_start: year written as population (then 245).

```text
L97980: Poland | Rymanów | est 1542 | 1759–1763 | pop 1759 → 245 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol3_00356.html | “Jewish population of Rymanow in 1759 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation.”
```

**Poland / Jedwabne** — pop_start 1900 equals year_start 1900 and the comment is only 'approx.'; the number looks like the year.

```text
L91856: Poland | Jedwabne | est 1660 | 1900–1938 | pop 1900 → 280 | medium | https://he.wikipedia.org/wiki/%D7%99%D7%93%D7%95%D7%95%D7%91%D7%A0%D7%94 | “approx.”
```

**Poland / Bodzentyn** — pop_start 1918 equals the year (comment 'Early 1917 data').

```text
L88521: Poland | Bodzentyn | est 1820 | 1917–1920 | pop 1918 → 1800 | high | https://www.bodzentyn.net/history/introduction | “"Early 1917 data; nearly 50 per cent of the total population."”
```

**Ukraine / Henichesk** — pop_start 1926 equals year_start 1926; the comment '1926 Jews (Ukrainian Wikipedia text: 1926 - 1926 Jews)' shows the extractor read the year as the count.

```text
L147031: Ukraine | Henichesk | est 1850 | 1926–1938 | pop 1926 → 947 | high | https://uk.wikipedia.org/wiki/Генічеськ | “1926 Jews (Ukrainian Wikipedia text: 1926 - 1926 Jews)”
```

### 3.12 `YEAR_END_IN_FUTURE` — year_end beyond 2026

*Severity: low. Rows flagged: 2 in 1 towns.* A typo; the row is drawn to the end of the timeline.

**Poland / Kraśnik** — year_end 2049 lies in the future (typo for 1849 or 1949?); the row is drawn to the end of the timeline.

```text
L93257: Poland | Kraśnik | est 1530 | 1750–2049 | pop — → — | high | https://cja.huji.ac.il/browser.php?mode=set&id=13519 | “The synagogue edifice was rebuilt and a two-storey women's gallery was added.”
```

**Poland / Kraśnik** — year_end 2049 lies in the future (typo for 1849 or 1949?); the row is drawn to the end of the timeline.

```text
L93271: Poland | Kraśnik | est 1530 | 1850–2049 | pop — → — | high | https://www.jewishgen.org/yizkor/krasnik/krasnik.html | “Historical documentation covers the history of Jewish life in the town spanning from the 16th to the 19th centuries.”
```

### 3.13 `REGION_AS_TOWN_MARKER` — County / district / metro aggregate plotted as a town marker

*Severity: low. Rows flagged: 207 in 207 towns.* The marker stands for an area that contains other markers, so country and regional sums double count.

**Australia / Greater Dandenong** — A county/district/metro aggregate is plotted as a point marker; its population covers many towns and overlaps markers for the towns inside it (double counting in country sums).

```text
L1168: Australia | Greater Dandenong | est 2011 | 2011–2015 | pop 151 → 174 | high | https://www.abs.gov.au/census/find-census-data/datapacks/download/2011_BCP_LGA_for_AUST_short-header.zip | “ABS 2011 Census BCP table B14 Religious affiliation, Judaism persons, Local Government Area 'Greater Dandenong (C)' (the municipality itself, not the metropolitan area; ABS randomly adjusts small counts).”
```

**Belarus / Kamionka (Bialystok Region)** — A county/district/metro aggregate is plotted as a point marker; its population covers many towns and overlaps markers for the towns inside it (double counting in country sums).

```text
L4676: Belarus | Kamionka (Bialystok Region) | est 1882 | 1882–1920 | pop 245 → 326 | high | https://kehilalinks.jewishgen.org/kamenka/history.htm | “Population was 245 Jews out of 411 total people (59.6%).”
```

**Canada / Greater Napanee** — A county/district/metro aggregate is plotted as a point marker; its population covers many towns and overlaps markers for the towns inside it (double counting in country sums).

```text
L11041: Canada | Greater Napanee | est 1871 | 1871–1890 | pop — → — | high | https://www.jewishdatabank.org/content/upload/bjdb/Cities,_Towns_&_Villages,_Canada_1851-1951_Canadian_Jewish_… | “Jewish population by religion (census), Rosenberg Gazetteer Table 1, census of 1871; municipality itself, not metropolitan area”
```

**Canada / Greater Sudbury** — A county/district/metro aggregate is plotted as a point marker; its population covers many towns and overlaps markers for the towns inside it (double counting in country sums).

```text
L11049: Canada | Greater Sudbury | est 1891 | 1891–1900 | pop 11 → 73 | high | https://www.jewishdatabank.org/content/upload/bjdb/Cities,_Towns_&_Villages,_Canada_1851-1951_Canadian_Jewish_… | “Jewish population by religion (census), Rosenberg Gazetteer Table 1, census of 1891; municipality itself, not metropolitan area”
```

### 3.14 `DUPLICATE_ROWS` — Duplicate rows

*Severity: low. Rows flagged: 21 in 21 towns.* Same town, years, populations and comment appear twice.

**Belarus / Davyd-Haradok** — 2 rows with identical town, years, populations and comment (only the source or coordinates differ).

```text
L4183: Belarus | Davyd-Haradok | est 1648 | 1944–2026 | pop 0 → — | high | https://www.abebooks.com/Memorial-Book-David-Horodok-Davyd-Haradok-Belarus-Idan/32202371015/bd | “No Jews were left alive in the town by the time Soviet forces reentered.”
```

**Canada / Sherbrooke** — 5 rows with identical town, years, populations and comment (only the source or coordinates differ).

```text
L13142: Canada | Sherbrooke | est 1860 | 1860–1881 | pop 0 → 20 | high | https://worldpopulationreview.com/cities/canada/sherbrooke | “No evidence of Jewish presence found in available sources”
```

**France / Aix-en-Provence** — 2 rows with identical town, years, populations and comment (only the source or coordinates differ).

```text
L19554: France | Aix-en-Provence | est 100 | 2025–2026 | pop 0 → — | high | https://www.citypopulation.de/en/france/admin/bouches_du_rh%C3%B4ne/131__aix_en_provence/ | “"No evidence of Jewish presence found in available sources."”
```

## 4. Town-by-town review log

Findings from reading towns row by row. For every item the rows are quoted as they are in the file.

### 4.1 Reviewed by the report's author

#### Austria/Vienna

**[RAMP SMOOTHS AN ABRUPT EVENT]** 1275-1511 ramps 1,000 -> 35 over 236 years. The community was destroyed in the 1421 Wiener Gesera (burning and expulsion), so the line shows ~ 560 Jews in 1420 (before) and ~ 300 in 1450 (after the destruction) instead of ~ 800-1,000 before and ~ 0 after 1421.

```text
L2908: Austria | Vienna | est 550 | 1275–1511 | pop 1000 → 35 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/vienna | “In the second half of the 13th century there were in the community 1,000 Jews, living in 70 houses. (century-only date, round year 1275 used) [Population: 1,000 Jews as stated by EJ (living in 70 houses); century-only date.]”
```

**[CONFLICT]** 1860-1869: 'The Jewish community numbered 6,200' (WJC) while a sourced point of 15,600 exists for 1857 and the 1869 census gives 40,277; the 1757-1859 ramp 454 -> 6,200 therefore contradicts the 1857 point.

```text
L3060: Austria | Vienna | est 550 | 1860–1869 | pop 6200 → 40200 | high | https://www.worldjewishcongress.org/en/about/communities/AT | “The Jewish community numbered 6,200.”
L3047: Austria | Vienna | est 550 | 1757–1859 | pop 454 → 6200 | high | https://www.worldjewishcongress.org/en/about/communities/AT | “About 454 Jews, all members of 12 prominent families, lived in Vienna.”
```

**[CHAIN-INVENTED RAMP / DEFINITION]** 2019-2022 ramps 8,600 -> 12,000 because the end value was chained to the next row; 2023-24 then ramps 12,000 -> 8,000. The two comments are different measures: '8,600' is 86% of Austria's 10,000 core Jews, '12,000' the IKG 'Jews living in Vienna' (membership vs. all persons). The map therefore shows a rise to 12,000 and a fall to 8,000 that no source states.

```text
L3151: Austria | Vienna | est 550 | 2019–2022 | pop 8600 → 12000 | medium | https://www.jpr.org.uk/sites/default/files/attachments/JPR_2020.Jews_in_Austria_-_A_demographic_and_social_por… | “About 86% of the 10,000 core Jewish population of Austria (approximately 8,600 Jews) reside in Vienna.”
L3152: Austria | Vienna | est 550 | 2023–2024 | pop 12000 → 8000 | medium | https://www.worldjewishcongress.org/en/about/communities/AT | “The Israelite Religious Community (IKG) of Vienna recorded approximately 12,000 Jews living in Vienna as of 2023.”
```

#### Azerbaijan/Qırmızı Qəsəbə

**[CONFLICT / CHAIN]** Rows claim 18,000-18,500 Jews for 1917-1949 and 18,000 in 1950-1988 and 1990, yet the 1939 Soviet census gives 5,331 and the 1989 count is 4,524; 1989 (single year) ramps 4,524 -> 18,000 because the end was chained to the next row; 1990 has both 18,000 and 3,500. The 18,000 is a popular 'peak' claim, repeated across five rows, 3-4 times the census values; the map shows the higher value every year.

```text
L3573: Azerbaijan | Qırmızı Qəsəbə | est 1150 | 1917–1932 | pop 18000 → 18500 | high | https://cdp.jewishgen.org/middle-east/azerbaijan-1/kuba | “Community had grown to 18,000 people and had 13 synagogues; renamed Krasnaya sloboda”
L3579: Azerbaijan | Qırmızı Qəsəbə | est 1150 | 1933–1949 | pop 18500 → 18000 | high | https://www.jewishvirtuallibrary.org/jsource/vjw/Azerbaijan.html | “Jewish population peaked at 18,500 under the Communists”
L3585: Azerbaijan | Qırmızı Qəsəbə | est 1150 | 1939–1939 | pop 5331 → 5331 | high | http://pop-stat.mashke.org/ussr-ethnic1939-districts.htm | “Soviet census of 17 January 1939, nationality 'Jews' (the table has a single 'Jews' column; Georgian, Mountain and Central Asian Jews are not shown separately): 5,331 in the urban-type settlement (table row 'пгт Красная Слобода', total population 5,635; Азербайджанская ССР). Digitised official table of the Population Statistics project, not an original scan.”
L3589: Azerbaijan | Qırmızı Qəsəbə | est 1150 | 1950–1988 | pop 18000 → 4524 | medium | https://cdp.jewishgen.org/middle-east/azerbaijan-1/krkasnaya-sloboda-quba-dagestan | “Estimated peak Jewish population as the largest all-Jewish settlement outside Israel”
L3593: Azerbaijan | Qırmızı Qəsəbə | est 1150 | 1989–1989 | pop 4524 → 18000 | high | https://masimovasif.net/how-mountain-jews-live-in-azerbaijan-krasnaya-sloboda/ | “Population of 4,524, mostly Mountain Jews”
L3595: Azerbaijan | Qırmızı Qəsəbə | est 1150 | 1990–1990 | pop 18000 → 18000 | high | https://bakuheritage.com/en/inspiration/red-village-azerbaijan-jewish-town | “Population peaked at around 18,000 residents in the early 1990s”
L3596: Azerbaijan | Qırmızı Qəsəbə | est 1150 | 1990–1990 | pop 3500 → 18000 | high | https://cdp.jewishgen.org/middle-east/azerbaijan-1/kuba | “1990 Jewish population: 3,500”
```

#### Belarus/Bobruisk

**[CHAIN_SUBSET]** 1905-1919 ramps 23,500 -> 1,500; the 1,500 is '300 Jewish refugee families concentrated in the town in spring 1920'. The map shows ~ 7,800 in 1915 for a city with 20,000+ Jews, then a jump back to 19,619 by 1922.

```text
L3893: Belarus | Bobruisk | est 1511 | 1905–1919 | pop 23500 → 1500 | high | https://www.jewishgen.org/yizkor/bobruisk/byb204.html | “In 1905 there were 23,500 Jews.”
L3894: Belarus | Bobruisk | est 1511 | 1920–1922 | pop 1500 → 19619 | high | https://www.jewishgen.org/yizkor/bobruisk/byb204.html | “Estimate based on families; in the spring of 1920, about 300 Jewish refugee families were concentrated in the city.”
```

#### Belarus/Minsk

**[CONFLICT / INFLATED]** 1997-2024: 28,000 ('28,000 of 60,000 Belarus Jews were in Minsk', a World Jewish Congress claim) is held flat for 27 years, while the same town has censuses of 10,141 (1999) and 5,187 (2009). The map shows the larger value (28,000) for all years; DellaPergola puts all of Belarus at 6,000 core Jews (2023), so a single city at 28,000 is impossible on a core definition.

```text
L5360: Belarus | Minsk | est 1489 | 1997–2024 | pop 28000 → — | high | https://www.belarusmemorials.com/?p=1295 | “Institute of the World Jewish Congress: 28000 of 60000 Belarus Jews were in Minsk”
L5361: Belarus | Minsk | est 1489 | 1999–1999 | pop 10141 → 10141 | high | https://be.wikipedia.org/wiki/%D0%9C%D1%96%D0%BD%D1%81%D0%BA | “Jews in 1999: 10,141 (census of Belarus 1999, Jews by nationality); from the table of Jews by census of the Belarusian Wikipedia article «Мінск» (row 'Яўрэі'; header 1926, 1939, 1959, 1970, 1979, 1989, 1999, 2009). Also given by: the same count (https://eleven.co.il/diaspora/communities/12776/).”
L5362: Belarus | Minsk | est 1489 | 2009–2009 | pop 5187 → 5187 | high | https://be.wikipedia.org/wiki/%D0%9C%D1%96%D0%BD%D1%81%D0%BA | “Jews in 2009: 5,187 (census of Belarus 2009, Jews by nationality); from the table of Jews by census of the Belarusian Wikipedia article «Мінск» (row 'Яўрэі'; header 1926, 1939, 1959, 1970, 1979, 1989, 1999, 2009).”
```

**[WARTIME COUNT]** Three overlapping rows for 1941 give 90,000 (June 1941 population), 80,000 (ghetto population) and 45,000 (remaining after the November massacre) — ghetto totals include deportees from the Reich and refugees and the three rows overlap the same year.

```text
L5345: Belarus | Minsk | est 1489 | 1941–1941 | pop 90000 → 9000 | high | https://www.belarusmemorials.com/?p=1295 | “About 90000 (about 37%) at the start of the German-Soviet war, June 1941 (Belarus Holocaust Memorials Project)”
L5346: Belarus | Minsk | est 1489 | 1941–1941 | pop 80000 → 9000 | high | https://en.wikipedia.org/wiki/Minsk_Ghetto | “Ghetto established July 1941: total ghetto population about 80000 (over 100000 per some sources) of whom about 50000 were pre-war residents; included refugees. Separate Sonderghetto for Jews deported from Germany received 23904 people (not Minsk residents)”
L5347: Belarus | Minsk | est 1489 | 1941–1941 | pop 45000 → 9000 | high | https://en.wikipedia.org/wiki/Minsk_Ghetto | “End of November 1941: about 25000 Jews murdered with 45000 remaining in the ghetto”
```

**[RAMP]** 1959-1996 ramps 38,842 -> 28,000 over 37 years although the same town has censuses 47,057 (1970), 46,205 (1979), 39,135 (1989); the ramp end (28,000) is the WJC claim later used again for 1997-2024.

```text
L5355: Belarus | Minsk | est 1489 | 1959–1996 | pop 38842 → 28000 | high | https://www.jewishgen.org/belarus/newsletters/misc/DemographicProfile/index.html | “38,842 Jews lived in Minsk city out of a total population of 509,489, comprising 7.62 percent of the population.”
```

#### Canada/Regina

**[CHAIN / COMMENT CONTRADICTS]** 1891-1910 ramps 400 ('estimate based on 80 families', a figure for an early settlement) -> 130, while the next row says the community 'increased to 130' in 1911; the ramp draws a decline where the narrative describes growth. 2021 uses 'Jewish ethnic origin (single+multiple responses; NOT religion)' after earlier rows by religion.

```text
L12739: Canada | Regina | est 1891 | 1891–1910 | pop 400 → 130 | high | https://www.nivmag.com/articles/preserving-and-maintaining-reginas-jewish-community | “Estimate based on 80 families”
L12741: Canada | Regina | est 1891 | 1911–1920 | pop 130 → 860 | high | https://www.nivmag.com/articles/preserving-and-maintaining-reginas-jewish-community | “Number of Jewish residents increased to 130”
```

#### Czech Republic/Prague

**[RAMP overrides sourced points]** 1541-1879 ramps 1,200 -> 20,508 over 338 years (comment: 'about 1,200 Jews in Prague'). The map shows ~ 13,100 for 1750 although sourced points are 10,507 (1729) and ~ 6,100 (1750), and ~ 17,400 for 1820 vs ~ 7,800 sourced.

```text
L17515: Czech Republic | Prague | est 906 | 1541–1879 | pop 1200 → 20508 | high | https://jewish-guide.pl/sites/praha | “There were about 1,200 Jews in Prague”
```

**[INFLATED / RAMP]** 1990-2001 ramps 1,000 ('registered members') -> 31,000, and then 2001-2012 holds 31,000 flat (probability low). The source text quoted is a CZSO sentence 'In 2001 there were more than 31 000 Jews in Prague, by 1930 ...' which refers to the pre-war 31,751 (1921) / 35,425 (1930) community, not 2001. The 2021 census row (946) and DellaPergola's core estimate for the whole Czech Republic (about 3,900) show the number is wrong by an order of magnitude; the ramp also invents steady growth from 1990 to 2001.

```text
L17600: Czech Republic | Prague | est 906 | 1990–2001 | pop 1000 → 31000 | high | https://www.encyclopedia.com/history/modern-europe/czech-and-slovak-history/czechoslovakia | “Registered members following the Velvet Revolution”
L17605: Czech Republic | Prague | est 906 | 2001–2012 | pop 31000 → — | low | https://csu.gov.cz/docs/107516/66021e1f-6902-19af-448d-3637d491a697/nesladkova.pdf | “Source explicitly states 'In 2001 there were more than 31 000 Jews in Prague, by 1930 the number had increased to 35 425'. This is highly likely a typographical error for 1921. This figure is far larger than neighbouring rows for the same town, or is a medieval traveller's estimate.”
```

#### France/Paris

**[RAMP overrides sourced points]** 1809-1903 ramps 2,733 (Consistory of Paris, 1809) -> 60,000 over 94 years. The map shows ~ 28,900 for 1852 and ~ 34,400 for 1861, 1.4 and 1.3 times the sourced 20,000 and 26,000.

```text
L23435: France | Paris | est -50 | 1809–1903 | pop 2733 → 60000 | high | https://cdp.jewishgen.org/western-europe/france/paris | “The Consistory of Paris was appointed and installed, consisting of 2,733 Jewish members”
```

**[HELD FLAT]** 1904-1941 holds the Jewish Encyclopedia's 1904 estimate (60,000) flat for 37 years (blank pop_end) although the community roughly tripled in the 1920s-30s with the immigration from Eastern Europe; the 1941 end year has no source. The comment itself discusses a conflicting 375,000 figure.

```text
L23439: France | Paris | est -50 | 1904–1941 | pop 60000 → — | high | https://www.jewishencyclopedia.com/articles/11912-paris | “The Jewish population of Paris was estimated at about 60,000 in 1904, the total population of the city being 2,536,834 (Jewish Encyclopedia). [The JewishGen Cemetery Project page for Paris gives 'about 375,000, or 8 percent of the total Paris population' for 1904; that figure does not fit 1904 (8 percent of 2.5 million would be about 200,000) and is of the o…”
```

**[GAP]** No row covers Paris between 1941 and 1944 (no wartime or liberation count) and 1946-1949 (the 1945 row is a single-year point, the next one is 1950), so Paris disappears from the map in those years (it is missing from the France 1946 total).

```text
L23442: France | Paris | est 582 | 1945–1945 | pop 125000 → 125000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/paris | “Encyclopaedia Judaica (2nd ed.), entry 'Paris' as reproduced at encyclopedia.com: "Between 1945 and 1950 the Jewish population of the area grew from 125,000 to 150,000" 'The area' = Paris and its suburbs (the preceding sentence). Figure for the Paris urban area, not the city proper.”
L23443: France | Paris | est 582 | 1950–1950 | pop 150000 → 150000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/paris | “Encyclopaedia Judaica (2nd ed.), entry 'Paris' as reproduced at encyclopedia.com: "Between 1945 and 1950 the Jewish population of the area grew from 125,000 to 150,000" 'The area' = Paris and its suburbs (the preceding sentence). Figure for the Paris urban area, not the city proper.”
```

**[CONFLICT / DEFINITION]** 1980-2024: 267,500 ('about one half of 535,000 Jews in France' — a 1980 estimate held flat for 44 years) overlaps 350,000 (2012) and 300,000 (2026) from other sources; the 1980 estimate is assigned an end year of 2024.

```text
L23448: France | Paris | est -50 | 1980–2024 | pop 267500 → — | medium | https://www.jewishdatabank.org/api/download/?studyId=922&mediaId=bjdb%5C1980_World_Jewish_Population_(Schmelz%… | “An estimated 535,000 Jews lived in France, with about one half (267,500) thereof in Greater Paris”
L23449: France | Paris | est 582 | 2012–2012 | pop 350000 → 350000 | high | https://www.jta.org/2012/10/17/global/in-france-marseille-jews-look-to-paris-and-worry-that-their-calm-may-be-… | “JTA, Cnaan Liphshiz, 17 Oct 2012 ('In France, Marseille Jews look to Paris and worry that their calm may be fleeting'): 'the 350,000 Jews in and around Paris -- more than any other city in Europe'. Greater Paris (Paris and suburbs); journalistic figure, no method given.”
L23450: France | Paris | est 582 | 2026–2026 | pop 300000 → 300000 | low | https://jguideeurope.org/en/region/france/paris-and-surrounding-areas/western-paris/ | “J-Guide Europe page 'Western Paris' (last modified 2026-03-17): 'Nowadays, the 17th arrondissement counts 40 000 Jews among the 300 000 living in Paris and its suburbs'. Present-tense statement with no reference year: the year shown = year of the page's last modification. Greater Paris (the map's Paris marker already means Paris and suburbs). No method given…”
```

#### Germany/Berlin

**[GAP]** No row covers 1991-2002: the 1990 row (200 'members of the East Berlin community') ends in 1990 and the next row is 2003 (11,278). Berlin vanishes from the map for twelve years in which its community grew from ~ 6,400 (West Berlin 1989) to ~ 11,000 through immigration, and the 200 is only East Berlin (scope differs from the 6,411 West Berlin row of 1989).

```text
L28996: Germany | Berlin | est 1295 | 1990–1990 | pop 200 → 200 | high | https://kehilalinks.jewishgen.org/berlin/Ryker.html | “By 1990 the community in East Berlin counted a mere 200 members”
L29001: Germany | Berlin | est 1295 | 2003–2003 | pop 11278 → 11278 | medium | https://link.springer.com/book/10.1007/978-3-031-67478-5 | “DellaPergola, S., 'World Jewish Population, 2023', American Jewish Year Book 2023 (Springer, 2024), ch. 8, p. 53, Table 15: registered Jewish community members according to ZWST (Zentralwohlfahrtsstelle der Juden in Deutschland); the table is labelled 2003/2013/2023 and cites the ZWST reports of 2002/2012/2022, so the counts are probably those of the end of …”
```

**[CONFLICT]** 2014-2024: 12,000 ('12,000 Jews of whom about 8,200 community members') is held for 2015-2024 beside the ZWST member counts 8,702 (2020) and 8,258 (2023); the map shows the larger 12,000. (The dataset's own DellaPergola reference file notes the same disagreement.)

```text
L29004: Germany | Berlin | est 1295 | 2014–2014 | pop 12000 → 12000 | high | https://kehilalinks.jewishgen.org/berlin/Ryker.html | “Berlin has the largest Jewish community in Germany, with 12,000 registered members and eight synagogues”
L29005: Germany | Berlin | est 1295 | 2015–2024 | pop 12000 → — | high | https://www.hamichlol.org.il/יהדות_ברלין | “Hebrew Wikipedia: 12000 Jews in 2015 of whom about 8200 community members; separately about 25000 Israelis in 2023 (Kranz study)”
L29006: Germany | Berlin | est 1295 | 2020–2020 | pop 8702 → 8702 | high | https://zwst.org/sites/default/files/2024-04/ZWST-Mitgliederstatistik-2020-Langversion-RZ.pdf | “Community members (Mitglieder) of the Jewish community of Berlin: 'Berlin' of the Jüdische Gemeinde zu Berlin: 8702, per the ZWST Mitgliederstatistik 2020 (full version), table 'Wachstum der Gemeinden - Vergleich 1989/2020', PDF p. 17. Registered community members as of 31 Dec of the year, not a census of all Jews of the town.”
L29007: Germany | Berlin | est 1295 | 2023–2023 | pop 8258 → 8258 | high | https://zwst.org/sites/default/files/2024-06/ZWST-Mitgliederstatistik-2023-RZ-web.pdf | “Community members (Mitglieder) of the Jewish community of Berlin: 'Berlin' of the Jüdische Gemeinde zu Berlin: 8258, per the ZWST Mitgliederstatistik 2023 (full version), table 'Wachstum der Gemeinden - Vergleich 1989/2023', PDF p. 17. Registered community members as of 31 Dec of the year, not a census of all Jews of the town.”
```

**[LOWER BOUND AS VALUE]** 1886-1889 ramps 50,000 -> 108,044 where 50,000 is the Hebrew Wikipedia statement 'more than 50,000' (a lower bound) and 108,044 a 1890 figure which the dataset itself says is inconsistent with the 94,391 of 1895 (rows 28915/28916): the series goes 108,044 (1890) -> 94,391 (1895), i.e. a decline during the years of fastest growth.

```text
L28914: Germany | Berlin | est 1295 | 1886–1889 | pop 50000 → 108044 | high | https://www.hamichlol.org.il/יהדות_ברלין | “Hebrew Wikipedia: "more than 50000" Jews in the city in 1886 (lower bound used)”
```

#### Greece/Thessaloniki

**[VICTIM/DEPORTATION COUNT RAMPED ACROSS 1945]** 1943-1996 ramps 50,000 ('Nazi forces deported 50,000 Jews' — a deportation count) -> 1,000 over 53 years. The map therefore shows ~ 47,200 Jews in 1946, ~ 43,500 in 1950, ~ 34,300 in 1960 and ~ 25,000 in 1970; the same town's own sourced counts are 20 (Dec 1944), 1,800 (1946), 1,620 (1948), 1,783 (1951), 1,000 (1967). Over-stated by a factor of 20-30 for decades.

```text
L51655: Greece | Thessaloniki | est -332 | 1943–1996 | pop 50000 → 1000 | high | https://www.bbc.com/travel/article/20250404-in-search-of-greeces-once-great-jewish-city | “Nazi forces deported 50,000 Jews to concentration camps.”
```

#### Hungary/Budapest

**[INFLATED / DEFINITION]** 2004-2026 holds 80,000 ('Jewish population of Budapest', an estimate that counts persons of Jewish origin) flat for 22 years, preceded by a 1967-2003 ramp 50,000 -> 80,000, while the 2022 census row has 4,839 (religion) and DellaPergola's core estimate for all of Hungary is 46,000 (2023). The definition (origin vs. core) is not labelled in the Notes.

```text
L53261: Hungary | Budapest | est 132 | 2004–2026 | pop 80000 → — | high | https://www.encyclopedia.com/places/germany-scandinavia-and-central-europe/hungarian-political-geography/budap… | “Jewish population of Budapest”
L53260: Hungary | Budapest | est 132 | 1967–2003 | pop 50000 → 80000 | high | https://www.encyclopedia.com/places/germany-scandinavia-and-central-europe/hungarian-political-geography/budap… | “Jewish population of Budapest”
```

**[WARTIME COUNTS / CONFLICT]** Nine overlapping rows for 1939-1945 give 200,000 / 185,000 / 184,000 / 184,453 / 231,453 / 100,000 / 70,000 (the ghetto count) / 144,000 for the same few years, mixing the 1941 census of 'Jewish by religion', 'racially defined Jews', the ghetto population and survivor counts; the 1941-1943 rows all end at 200,000 (chained to 1944).

```text
L53250: Hungary | Budapest | est 132 | 1939–1940 | pop 200000 → 185000 | high | https://www.yadvashem.org/articles/general/prewar-jewish-life-in-budapest.html | “On the eve of World War II, there were about 200,000 Jews in Budapest.”
L53251: Hungary | Budapest | est 132 | 1941–1943 | pop 185000 → 200000 | medium | https://portal.ehri-project.eu/units/il-002798-7538131 | “According to the 1941 census, approximately 185,000 Jews lived in Budapest.”
L53252: Hungary | Budapest | est 132 | 1941–1943 | pop 184000 → 200000 | high | https://www.worldjewishcongress.org/en/about/communities/HU | “According to a 1941 census, 184,000 people classified as Jewish according to their religious affiliation lived in Budapest.”
L53253: Hungary | Budapest | est 132 | 1941–1943 | pop 184453 → 200000 | high | https://www.encyclopedia.com/places/germany-scandinavia-and-central-europe/hungarian-political-geography/budap… | “Jewish population of Budapest according to census; additionally, some 62,000 converts/Christians were identified as Jews”
L53254: Hungary | Budapest | est 132 | 1944–1944 | pop 200000 → 100000 | high | https://encyclopedia.ushmm.org/content/en/article/the-holocaust-in-hungary | “In July 1944, the large Jewish community of Budapest numbered some 200,000 people.”
L53255: Hungary | Budapest | est 132 | 1944–1944 | pop 231453 → 100000 | high | https://www.encyclopedia.com/places/germany-scandinavia-and-central-europe/hungarian-political-geography/budap… | “At the time of the German occupation in March, 231,453 racially defined Jews lived in Budapest”
L53256: Hungary | Budapest | est 132 | 1945–1945 | pop 100000 → 96000 | high | https://encyclopedia.ushmm.org/content/en/article/budapest | “Soviet forces liberated Budapest on February 13, 1945, and more than 100,000 Jews remained in the city at liberation.”
L53257: Hungary | Budapest | est 132 | 1945–1945 | pop 70000 → 96000 | high | https://cdp.jewishgen.org/eastern-europe/hungary/budapest | “70,000 Jews were in the ghetto in January 1945; they were liberated by the Russian Red Army on January 18. 55,000 survived the war.”
L53258: Hungary | Budapest | est 132 | 1945–1945 | pop 144000 → 96000 | medium | https://www.encyclopedia.com/places/germany-scandinavia-and-central-europe/hungarian-political-geography/budap… | “At the end of 1945, Budapest had a Jewish population of approximately 144,000”
```

#### Israel/Bat Yam

**[GAP]** Last numeric row is the single year 2008 (130,300, no end). Bat Yam, Beersheba, Modi'in-Maccabim-Re'ut, Karmiel, Kiryat Yam, El'ad and Acre (15 Israeli towns with a peak above 5,000 in total) have no population row after 2008, so the largest Israeli cities disappear from the map for 2009-2024 while ~ 1,000 small localities continue to 2024.

```text
L64758: Israel | Bat Yam | est 1926 | 2008–2008 | pop 130300 → — | medium | https://www.citypopulation.de/en/israel/admin/tel_aviv/6200__bat_yam/ | “Total census population of the locality; this table does not separate Jews, so the figure is total residents of a locality that is almost entirely Jewish (CBS type: city/local council; Arab share in 2021 0.8%, so total may slightly overstate Jews; 2021 breakdown: Jews 97853, Arabs 1012, other 27425). Figure is for the municipality/council as a whole.”
```

#### Israel/Beersheba

**[CHAIN_SUBSET / GAP]** 2003-2005 ramps 178,307 -> 10,000 because the next row is 'an estimated 10,000 Ethiopian Israelis living in Beersheba' (a subset used as population); that row then ramps 10,000 -> 193,400 over 2006-2007. Beersheba, a city of ~ 190,000, therefore dips to 10,000 in 2005 on the map. Its last numeric row is 2008 (citypopulation total); there is no row for 2009-2024.

```text
L64871: Israel | Beersheba | est -1200 | 2003–2005 | pop 178307 → 10000 | high | https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx | “Israel CBS locality files, 'Jews and others' (2003-2017 = total x the locality's 2018 Jewish share).”
L64872: Israel | Beersheba | est  | 2006–2007 | pop 10000 → 193400 | medium | https://www.newworldencyclopedia.org/entry/Beersheba | “An estimated 10,000 Ethiopian Israelis were living in Beersheba.”
L64873: Israel | Beersheba | est -1200 | 2008–2008 | pop 193400 → — | medium | https://www.citypopulation.de/en/israel/admin/hadarom/9000__beer_sheva/ | “Total census population of the locality; this table does not separate Jews, so the figure is total residents of a locality that is almost entirely Jewish (CBS type: city/local council; Arab share in 2021 2.9%, so total may slightly overstate Jews; 2021 breakdown: Jews 181356, Arabs 6186, other 23708). Figure is for the municipality/council as a whole.”
```

#### Israel/Jerusalem

**[TEMPLATE ROWS]** 1800-1931: five JVL-sourced rows with generic comments ('Jewish population growth under Ottoman rule', 'Continued growth - Jews become largest religious group', 'Significant Jewish immigration and neighborhood expansion', 'British Mandate period - continued growth', 'Pre-World War II growth'). Row 68780 is labelled 'British Mandate period' but starts in 1896 (the mandate began in 1920) and ends 1921 at 33,971 (the 1922 census figure), and its ramp gives ~ 31,000 for 1914, below the sourced 45,000 of 1910/1914 in the same town.

```text
L68752: Israel | Jerusalem | est -2000 | 1800–1843 | pop 2000 → 7120 | low | https://www.jewishvirtuallibrary.org/population-of-jerusalem-1844-2009 | “Jewish population growth under Ottoman rule”
L68756: Israel | Jerusalem | est -2000 | 1844–1875 | pop 7120 → 12000 | low | https://www.jewishvirtuallibrary.org/population-of-jerusalem-1844-2009 | “Continued growth - Jews become largest religious group”
L68768: Israel | Jerusalem | est -2000 | 1876–1895 | pop 12000 → 28112 | low | https://www.jewishvirtuallibrary.org/population-of-jerusalem-1844-2009 | “Significant Jewish immigration and neighborhood expansion”
L68780: Israel | Jerusalem | est -2000 | 1896–1921 | pop 28112 → 33971 | low | https://www.jewishvirtuallibrary.org/population-of-jerusalem-1844-2009 | “British Mandate period - continued growth”
L68797: Israel | Jerusalem | est -2000 | 1922–1931 | pop 33971 → 51222 | low | https://www.jewishvirtuallibrary.org/population-of-jerusalem-1844-2009 | “Pre-World War II growth”
```

#### Latvia/Riga

**[UNDER-STATED + END VALUE FROM A LATER DATE]** 1944-1990 ramps 150 (October 1944 survivors) -> 8,550 (a post-1991 estimate: '95% of the estimated 9,000 Jews in Latvia reside in Riga') over 46 years. The map shows ~ 1,250 for 1950 and ~ 4,500 for 1967, while the Soviet censuses count 30,267 (1959) and 30,581 (1970); 1945-1958 is therefore under-stated by a factor of ~ 20, and the end value belongs to 1991+, not 1990.

```text
L79949: Latvia | Riga | est 1301 | 1944–1990 | pop 150 → 8550 | high | https://www.yadvashem.org/holocaust/this-month/january/1939.html | “13 October 1944: The Red Army liberated Riga; some 150 Jews, including children, emerged from their hiding places.”
```

**[UNSUPPORTED NUMBER]** 1991-2009 ramps 8,550 -> 300 and 2010-2026 holds 300 flat with the comment 'The community is served by two Jewish kindergartens and schools in Riga' — 300 is not a population count anywhere in the comment. The 2000 census row is 8,235 and 2011 is 4,810 / 2021 is 3,153, so the map shows 300 for 2012-2020 and 2022-2026 (an order of magnitude too low) and a smooth decline that skips the census values.

```text
L79954: Latvia | Riga | est 1301 | 1991–2009 | pop 8550 → 300 | medium | https://latvia.jewishgen.org/history-and-geography/history-of-latvia-and-courland | “95% of the estimated 9,000 Jews living in Latvia reside in Riga (estimate based on post-1991 data).”
L79957: Latvia | Riga | est 1301 | 2010–2026 | pop 300 → — | high | https://eurojewcong.org/_communities/latvia/ | “The community is served by two Jewish kindergartens and schools in Riga: municipal Sh. Dubnov school with 230 students and Chabad-Lubavitch school with 70 pupils.”
```

#### Lithuania/Vilnius

**[IMPLAUSIBLE]** 1599-1644 ramps 10,000 -> 1,225: 'Vassilievsky claims that at the end of the sixteenth century (year approximate) the Jewish community ...' — an unverifiable 16th-century claim of 10,000 (the Jewish Encyclopedia source itself marks it doubtful) which is 8 times the 1645 poll-tax figure of 1,225, producing an invented collapse during 1599-1644.

```text
L82993: Lithuania | Vilnius | est 1300 | 1599–1644 | pop 10000 → 1225 | low | https://www.jewishencyclopedia.com/articles/14934-wilna | “Vassilievsky claims that at the end of the sixteenth century (year approximate) the Jewish community of Wilna numbered 10,000 to 15,000 (lower bound entered; JE notes Bershadski dates a large community only from the middle of the sixteenth century).”
```

#### Poland/Jędrzejów

**[COMMENT_MISMATCH]** 1925-1930 ramps 0 -> 4,440 with the comment '"Jewish Cooperative Bank established"' — the comment has nothing to do with the population; start 0 is an invented value and the end is chained from the next row.

```text
L91835: Poland | Jędrzejów | est 1861 | 1925–1930 | pop 0 → 4440 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00259.html | “"Jewish Cooperative Bank established"”
```

#### Poland/Koło

**[CHAIN]** 1921-1930 ramps 5,159 -> 250 ('Census recorded 5159 Jews (45% of population)'); the 250 is the next row's start (a small unrelated fact). The map shows ~ 3,000 in 1925.

```text
L93047: Poland | Koło | est 1429 | 1921–1930 | pop 5159 → 250 | high | https://www.jewishgen.org/yizkor/kolo/kol008.html | “Census recorded 5159 Jews (45% of population)”
```

#### Poland/Kraków

**[INDIVIDUAL EVENT AS POPULATION]** 1617-1817: population 2 for 200 years from the comment 'Mordechaj Margaliot died; September 8: Miriam (sister of Remuh rabbi) died' — gravestone entries for two people, recorded as a 2-person community spanning two centuries (the town had ~ 2,000-3,500 Jews in that period).

```text
L93157: Poland | Kraków | est 950 | 1617–1817 | pop 2 → 2 | high | https://cdp.jewishgen.org/eastern-europe/poland/krakow | “Mordechaj Margaliot died; September 8: Miriam (sister of Remuh rabbi) died”
```

**[COMMENT DOES NOT MATCH THE NUMBER]** 1818-1899 ramps 7,250 -> 26,000 (81 years) but the comment is 'Menashe Aleksandrowicz and Samuel Aron were born' (two births). The numbers have no support in the comment, and the ramp lies over sourced points (1833 10,800; 1843 ~13,000; 1857 ~13,000).

```text
L93180: Poland | Kraków | est 950 | 1818–1899 | pop 7250 → 26000 | high | https://kehilalinks.jewishgen.org/krakow/kra_essay_3.htm | “Menashe Aleksandrowicz and Samuel Aron were born”
```

**[CONFLICT]** 1930: 70,000 (a travel-site sentence 'once reached nearly 70 thousand') and 60,000 beside the 1931 census row 55,515; the map shows 70,000, i.e. 26% above the census, from a tourism web page.

```text
L93191: Poland | Kraków | est 950 | 1930–1930 | pop 70000 → 55515 | high | https://www.contexttravel.com/cities/krakow/tours/jewish-krakow-history-tour | “The local Jewish population once reached nearly 70 thousand only to be wiped out entirely”
L93192: Poland | Kraków | est 950 | 1930–1930 | pop 60000 → 55515 | high | https://kehilalinks.jewishgen.org/krakow/kra_essay_3.htm | “Kraków was a city of 250,000 inhabitants, of which 60,000 were Jewish”
```

**[WARTIME/RETURNEE COUNT RAMPED OVER 50 YEARS]** 1946-1996 ramps 10,000 ('early 1946 returning Polish Jews swelled the population to ~ 10,000') -> 189 over 50 years. The map shows ~ 9,200 for 1950 and ~ 5,400 for 1970 although the 1946 return wave was followed by emigration within two to three years (Kraków 1950 ~ a few thousand).

```text
L93203: Poland | Kraków | est 950 | 1946–1996 | pop 10000 → 189 | medium | https://encyclopedia.ushmm.org/content/en/article/krakow-cracow | “Early 1946: Returning Polish Jews swelled the Jewish population to approximately 10,000. Pogroms continued throughout 1946”
```

#### Poland/Mstów

**[TEMPLATE_PLACEHOLDER]** Eight rows from crarg.org with generic comments ('Early Jewish settlement - community begins to form', 'Community growth - regional development', 'Industrial growth - population expands', 'Pre-war growth - thriving community', 'Peak population - over 3,000 Jews before Holocaust'), blank probability and round numbers. Internal contradictions: 'population expands' row 1800-1807 falls 400 -> 23; the 'peak' row 1920 runs 2,000 -> 740; the next row 1921-38 ramps 740 -> 3,000 with the comment 'a population decline was noted due to emigration'; the 1808-1899 ramp 23 -> 1,000 gives 227 in 1827 against a sourced 110.

```text
L95067: Poland | Mstów | est 1553 | 1600–1699 | pop 50 → 150 | prob — | https://www.crarg.org/jewish-genealogy/mstow-poland.php | “Early Jewish settlement - community begins to form”
L95068: Poland | Mstów | est 1553 | 1700–1799 | pop 150 → 400 | prob — | https://www.crarg.org/jewish-genealogy/mstow-poland.php | “Community growth - regional development”
L95069: Poland | Mstów | est 1553 | 1800–1807 | pop 400 → 23 | prob — | https://www.crarg.org/jewish-genealogy/mstow-poland.php | “Industrial growth - population expands”
L95070: Poland | Mstów | est 1553 | 1808–1899 | pop 23 → 1000 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_073.html | “Jews constituted 3.57% of the total population”
L95073: Poland | Mstów | est 1553 | 1900–1919 | pop 1000 → 2000 | prob — | https://www.crarg.org/jewish-genealogy/mstow-poland.php | “Pre-war growth - thriving community”
L95074: Poland | Mstów | est 1553 | 1920–1920 | pop 2000 → 740 | prob — | https://www.crarg.org/jewish-genealogy/mstow-poland.php | “Peak population - over 3,000 Jews before Holocaust”
L95075: Poland | Mstów | est 1553 | 1921–1938 | pop 740 → 3000 | high | https://cdp.jewishgen.org/eastern-europe/poland/mstow | “Jews constituted 37.6% of the population; a population decline was noted due to emigration in the 19th and early 20th centuries”
L95076: Poland | Mstów | est 1553 | 1939–1941 | pop 3000 → 500 | prob — | https://www.crarg.org/jewish-genealogy/mstow-poland.php | “German occupation - ghetto established, mass deportations”
```

#### Poland/Siedlce

**[CHAIN_SUBSET]** 1897-1920 ramps 11,440 -> 60 and 1921-23 starts again at 60: the 60 is 'five Jewish knitwear workshops employing sixty workers'. 1926-29 ramps 20,000 -> 600 and 1930 starts at 600 = 'the number of Jewish tailors reached 600'. Counts of workers/tailors are used as the town's Jewish population, producing two false collapses (to 60 and to 600) in a community of 15,000-19,000.

```text
L98307: Poland | Siedlce | est 1550 | 1897–1920 | pop 11440 → 60 | high | https://www.jewishgen.org/yizkor/ybip/YBIP_Siedlce2.html | “Jewish population was 11,440.”
L98309: Poland | Siedlce | est 1550 | 1921–1923 | pop 60 → 17500 | high | https://www.jewishgen.org/yizkor/Siedlce1/sie201.html | “Soon after 1921, there were five Jewish knitwear workshops employing sixty workers.”
L98313: Poland | Siedlce | est 1550 | 1926–1929 | pop 20000 → 600 | high | https://www.jewishgen.org/yizkor/Siedlce1/sie404.html | “Estimate based on families. There were 4,000 Jewish families in Siedlce paying or eligible for community taxes.”
L98314: Poland | Siedlce | est 1550 | 1930–1930 | pop 600 → 14793 | high | https://www.jewishgen.org/yizkor/Siedlce1/sie201.html | “The number of Jewish tailors reached 600.”
```

#### Poland/Warsaw

**[RAMP (derived series)]** One row draws a straight line from 100,000 (1878) to 375,000 (1938) with a vague comment ('Warsaw numbered one hundred thousand Jewish souls; Tlomacke Street synagogue pictured'). 375,000 is the 1939 estimate, not a 1938 count, and the line is not a source: it gives ~ 178,000 for 1897 (sourced 210,500) and ~ 267,000 for 1910 (sourced 306,000), so it is only noise under the sourced points, and it is the only row for 1883-1896 and 1898-1909 outside the points.

```text
L100308: Poland | Warsaw | est 1250 | 1878–1938 | pop 100000 → 375000 | high | https://www.jewishgen.org/yizkor/warsaw1/war005.html | “Warsaw numbered one hundred thousand Jewish souls; Tlomacke Street synagogue pictured”
```

**[HELD_FLAT / DEFINITION]** 3,000 is held flat for 55 years (1968-2023) with a comment about the 1967-68 emigration (not a count), while the same town has censuses of 356 (2002), 2,180 (2011) and 3,829 (2021). Because the map draws the highest of overlapping rows, the flat 3,000 hides the 2002 census value of 356 and the series looks stable when the sources show a trough and a rise. Mixed definitions (ethnic self-declaration vs. community estimate) are not labelled.

```text
L100330: Poland | Warsaw | est 1250 | 1968–2023 | pop 3000 → 3000 | medium | https://www.timesofisrael.com/13000-jews-were-driven-out-of-poland-in-1968-now-some-are-returning-to-tell-thei… | “The Communist party's 1967-68 antisemitic campaign triggered a mass emigration wave -- about 13,000 Jews left Poland nationally -- sharply reducing Warsaw's Jewish community (Warsaw-specific figure estimated)”
L100332: Poland | Warsaw | est 1250 | 2002–2002 | pop 356 → 356 | high | http://pop-stat.mashke.org/poland-ethnic-comm2002.htm | “Polish National Census 2002 (NSP 2002, 21 May 2002): persons declaring Jewish national-ethnic identification (one declaration), city powiat (= the city); only the two largest city values (Warsaw, Wroclaw) are published, the others are suppressed (national total 1,133 in the table). Transcribed by pop-stat.mashke.org from the GUS tables.”
L100333: Poland | Warsaw | est 1250 | 2011–2011 | pop 2180 → 2180 | high | http://pop-stat.mashke.org/poland-ethnic2011.htm | “Polish National Census 2011 (NSP 2011, 31 Mar 2011): persons with national-ethnic identification 'zydowska' (Jewish), first or second declaration, city powiat (= the city); only the four largest city values (Warsaw, Wroclaw, Krakow, Lodz) are published, the others are suppressed. Self-declared identification, not community membership.”
L100334: Poland | Warsaw | est 1250 | 2021–2021 | pop 3829 → 3829 | high | https://stat.gov.pl/download/gfx/portalinformacyjny/pl/defaultaktualnosci/6536/10/1/1/przynaleznosc_narodowo-e… | “Polish National Census 2021 (NSP 2021, reference date 31 Mar 2021): persons with national-ethnic identification 'zydowska' (Jewish) as first or second declaration, urban gmina (= the city). Values below 10 are not published. Self-declared identification, not community membership. Unit: persons. Source table: GUS NSP 2021, sheet "TABL. 5", gmina "gm. m. Warsz…”
```

**[WARTIME COUNT]** The 1941-1943 row starts at 450,000 'people trapped within the ghetto's walls' (a ghetto headcount that includes Jews deported in from other towns) and ends at 2,000 (the number after the Uprising); the 1940 row ends at 450,000 (the next row's value). These are ghetto/deportee counts, not the town's resident Jewish population; the chain also draws a smooth decline 1941-1943 although the community was deported in a few weeks in summer 1942.

```text
L100321: Poland | Warsaw | est 1250 | 1941–1943 | pop 450000 → 2000 | high | https://www.nationalww2museum.org/war/articles/warsaw-ghetto-uprising | “At its peak between 1940 and 1942, there were 450,000 people trapped within the ghetto's walls”
L100319: Poland | Warsaw | est 1250 | 1940–1940 | pop 400000 → 450000 | high | https://www.yadvashem.org/holocaust/about/ghettos/warsaw.html | “November 16, 1940: the Warsaw Ghetto was sealed, enclosing an estimated 380,000-400,000+ Jews”
```

#### Poland/Zamość

**[CHAIN_SUBSET]** 1846-1855 ramps 70 -> 2,490: 70 = '14 Jewish families established an agricultural colony in Zdanów near Zamość' (a colony of one village), 2,490 the town's count from the next row.

```text
L101419: Poland | Zamość | est 1550 | 1846–1855 | pop 70 → 2490 | high | https://www.jewishgen.org/Yizkor/zamosc1/zam163.html | “Estimate based on families. 14 Jewish families established an agricultural colony in Zdanów near Zamość.”
```

#### Poland/Łódź

**[RAMP overrides sourced points]** 1827-1869 ramps 397 -> 10,000 over 42 years, while the same town has sourced points 512 (1833), 1,411 (1844), 2,886 (1856), 5,633 (1863). At 1856 the ramp gives ~7,000, i.e. 2.4 times the sourced 2,886; at 1844 ~4,300 vs 1,411 (3 times).

```text
L101992: Poland | Łódź | est 1790 | 1827–1869 | pop 397 → 10000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol1_00001.html | “Jewish population of Lodz in 1827 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation (total population of the town: 2,837).”
```

**[RAMP overrides sourced points]** 1870-1897 ramps 10,000 -> 98,000 (comment is only 'approx.', source a Hebrew Wikipedia page) while sourced points exist: 8,442 (1872), 9,447 (1878), 12,506 (1881). The ramp gives ~ 45,900 for 1881, 3.7 times the sourced 12,506. The start value 10,000 for 1870 is also above the 8,442 of 1872.

```text
L101999: Poland | Łódź | est 1790 | 1870–1897 | pop 10000 → 98000 | medium | https://he.wikipedia.org/wiki/%D7%A7%D7%94%D7%99%D7%9C%D7%AA_%D7%99%D7%94%D7%95%D7%93%D7%99_%D7%9C%D7%95%D7%93… | “approx.”
L102000: Poland | Łódź | est 1793 | 1872–1872 | pop 8442 → 8442 | low | Botticini, Eckstein, Vaturi, The Chosen Many (Sapir Center DP 4-16, 2016), Lodz table (Section 4.8), PDF p. 70… | “Jewish population of Lodz 8,442 in 1872, 22.5% of the population (the paper's Lodz table, citing Guesnet 1998 p. 35 table 3). Caution: Pinkas Hakehillot has 8,463 Jews in 1864 and about 10,000 in 1870, so Guesnet's 1869 (7,652) and 1872 values look low or use another basis.”
L102001: Poland | Łódź | est 1793 | 1878–1878 | pop 9447 → 9447 | low | Botticini, Eckstein, Vaturi, The Chosen Many (Sapir Center DP 4-16, 2016), Lodz table (Section 4.8), PDF p. 70… | “Jewish population of Lodz 9,447 in 1878, 22.5% of the population (the paper's Lodz table, citing Guesnet 1998 p. 35 table 3). See the caution on the 1872 row.”
L102002: Poland | Łódź | est 1793 | 1881–1881 | pop 12506 → 12506 | medium | Botticini, Eckstein, Vaturi, The Chosen Many (Sapir Center DP 4-16, 2016), Lodz table (Section 4.8), PDF p. 70… | “Jewish population of Lodz 12,506 in 1881, 24.4% of the population (the paper's Lodz table, citing Guesnet 1998 p. 35 table 3).”
```

**[WARTIME COUNT / CHAIN]** 1940 row runs 160,000 -> 40,000 inside the single year 1940 because the end value was chained to the next row (which is 'a count of 40,000 Jews deported to Łódź from the Reich': an inflow, in fact about 20,000). 1942-44 starts from '70,000 deported from Łódź by September' (a deportation count) and ramps to 870 survivors.

```text
L102022: Poland | Łódź | est 1790 | 1940–1940 | pop 160000 → 40000 | high | https://www.theholocaustexplained.org/the-camps/case-study-lodz-ghetto/ | “160,000 Jews were forced into the Łódź or Litzmannstadt ghetto.”
L102023: Poland | Łódź | est 1790 | 1941–1941 | pop 40000 → 70000 | high | https://www.theholocaustexplained.org/the-camps/case-study-lodz-ghetto/ | “40,000 Jews were deported to Łódź from Germany, Austria, Bohemia, Moravia and Luxembourg.”
L102025: Poland | Łódź | est 1790 | 1942–1944 | pop 70000 → 870 | high | https://www.theholocaustexplained.org/the-camps/case-study-lodz-ghetto/ | “By September, 70,000 Jews had been deported from Łódź.”
```

**[RAMP overrides sourced points]** 1968-2023 ramps 3,000 -> 300 over 55 years from a comment about the 1967-68 emigration wave; the map therefore shows ~ 1,400 in 2000 while the census values are 305 (2011) and 538 (2021).

```text
L102029: Poland | Łódź | est 1790 | 1968–2023 | pop 3000 → 300 | medium | https://www.timesofisrael.com/13000-jews-were-driven-out-of-poland-in-1968-now-some-are-returning-to-tell-thei… | “The Communist party's 1967-68 antisemitic campaign triggered a mass emigration wave -- about 13,000 Jews left Poland nationally -- sharply reducing Łódź's Jewish community from its postwar peak (Łódź-specific figure estimated)”
```

#### Romania/Bucharest

**[CONFLICT / IMPLAUSIBLE]** 1800-1819 ramps 4,500 ('between 4,000 and 5,000 at the beginning of the 19th century; midpoint used') -> 635 (the next row: 127 families x 5 in 1820) — a collapse of 86% in 20 years that no source states; the two sources disagree by a factor of seven.

```text
L103325: Romania | Bucharest | est 1550 | 1800–1819 | pop 4500 → 635 | high | https://www.jewishencyclopedia.com/articles/3783 | “Source: between 4000 and 5000 at beginning of 19th century; midpoint used”
L103327: Romania | Bucharest | est 1550 | 1820–1830 | pop 635 → 2970 | high | https://jewishvirtuallibrary.org/bucharest | “127 families registered; estimate based on families”
```

**[CONFLICT]** 2004-2026: 5,313 -> 3,500 and 3,500 (a travel guide: 'once 70,000-strong ... reduced to around 3,500') are higher than the census religion counts 2,564 (2002) and 1,459 (2011) in the same town; the map shows the larger.

```text
L103344: Romania | Bucharest | est 1550 | 2004–2016 | pop 5313 → 3500 | high | https://jewishvirtuallibrary.org/bucharest | “Jews lived in Bucharest in 2004”
L103346: Romania | Bucharest | est 1550 | 2017–2026 | pop 3500 → — | high | https://www.inyourpocket.com/romania/bucharest/articles/jewish-bucharest | “The once 70,000-strong Jewish population of Bucharest has been reduced to around 3,500.”
L103341: Romania | Bucharest | est 1550 | 1956–2003 | pop 44202 → 5313 | high | https://jewishvirtuallibrary.org/bucharest | “Registered in 1956 census; 3.6% of total population”
```

#### Russia/Birobidzhan

**[PLAN TARGET / SUBSET]** 1928-1939 ramps 50,000 -> 12,000: 50,000 = 10,000 Jewish families x 5 from the *settlement plan* ('the initial plan was to settle 10,000 Jewish families over five years'), not a population; it gives ~ 36,000 for 1932 against the sourced 5,125 (1932) and 7,200 (1934). 1940-2009 ramps 12,000 -> 1,700 where 12,000 is 'the number of local Jews who enlisted to fight the Nazis' (a subset) and 1,700 an unrelated 2010 estimate; the pipeline notes list the plan-target row as unresolved.

```text
L106450: Russia | Birobidzhan | est 1928 | 1928–1939 | pop 50000 → 12000 | high | https://www.jpost.com/diaspora/article-755164 | “The initial plan for the area was to settle 10,000 Jewish families over five years (Estimate based on families).”
L106455: Russia | Birobidzhan | est 1928 | 1940–2009 | pop 12000 → 1700 | high | https://www.jpost.com/diaspora/article-755164 | “Figure represents the number of local Jews who enlisted to fight the Nazis; there were 18 collective Jewish farms in the town.”
```

#### Slovakia/Prešov

**[CHAIN_SUBSET]** 1912-1929 ramps 130 -> 4,858: 130 = '26 Hassidic families in the Orthodox community organized the third congregation' (one congregation) chained to the town total.

```text
L113042: Slovakia | Prešov | est 1780 | 1912–1929 | pop 130 → 4858 | high | https://jewish-guide.pl/11-slovakia | “Estimate based on families. 26 Hassidic families in the Orthodox community organized the third congregation.”
```

#### Spain/Seville

**[EXPULSION_RAMP]** 1400-1967 ramps 2,500 -> 50 with the comment 'Jewish community expelled in 1492': the map shows ~ 1,200 Jews in Seville in 1700 and ~ 550 in 1850; the community was destroyed in 1391 and expelled in 1492, and the only later datum is '50 in 1968'.

```text
L117585: Spain | Seville | est 450 | 1400–1967 | pop 2500 → 50 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Spain | “Jewish community expelled in 1492”
L117597: Spain | Seville | est 450 | 1968–1968 | pop 50 → — | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/spain | “EJ Spain: unofficial estimate 1968, 50 in Seville.”
```

#### Turkey/Istanbul

**[CHAIN_SUBSET / SUBSET AS TOTAL]** 1854-1900 ramps 2,000 -> 48,000 where 2,000 is '400 Italian Jewish families from Crimea' (one congregation); 1900-1914 ramps 48,000 -> 10,000 where 10,000 is the start of the Ashkenazi-only row 1915-1959 (10,000 -> 1,500, 'Ashkenazi population of Istanbul according to Trietsch'). Ashkenazi and Italian sub-communities are plotted as if they were the city's Jewish population, with ramps that contradict the Ottoman censuses in the same town (47,779 in 1907, 53,606 in 1912, 47,173 in 1935).

```text
L120709: Turkey | Istanbul | est 330 | 1854–1900 | pop 2000 → 48000 | high | https://cdp.jewishgen.org/western-europe/turkey/sisli | “Italian Jewish Cemetery founded to serve about 400 Jewish families who had emigrated from the Crimea to Istanbul in 1854-55 (Estimate based on families).”
L120724: Turkey | Istanbul | est 330 | 1900–1914 | pop 48000 → 10000 | low | https://cdp.jewishgen.org/western-europe/turkey/istanbul | “Jewish population of Istanbul (Constantinople). This figure is far larger than neighbouring rows for the same town, or is a medieval traveller's estimate.”
L120732: Turkey | Istanbul | est 330 | 1915–1959 | pop 10000 → 1500 | high | https://archive.jpr.org.uk/download?id=3244 | “Ashkenazi population of Istanbul according to Trietsch.”
```

#### USA/New York

**[DUPLICATE / CONFLICT]** 1920-1926: two rows with different starts (1,600,000 and 1,643,000) and the same end value (1,765,000) from two different sources; the first has no probability and a generic comment ('Pre-WWII peak - largest Jewish community in world').

```text
L135822: USA | New York | est 1654 | 1920–1926 | pop 1600000 → 1765000 | prob — | https://en.wikipedia.org/wiki/History_of_the_Jews_in_New_York_City | “Pre-WWII peak - largest Jewish community in world”
L135823: USA | New York | est 1654 | 1920–1926 | pop 1643000 → 1765000 | high | https://libguides.nypl.org/jewishNYC/immigration | “The city's Jewish population reached a high point of 1,643,000, constituting 29% of the entire city population.”
```

**[TEMPLATE ROWS]** Rows 1950-2012 (2,000,000 -> 1,860,000, 1,100,000 -> 1,027,000, 1,027,000 -> 972,000, 972,000 -> 1,100,000, 1,100,000 -> 1,086,400) carry generic Wikipedia-style comments ('Post-WWII suburban migration begins', 'Stabilization and slight growth', 'Modern period - still largest Jewish community in world') with blank probability: the early hand-typed template. They overlap the sourced AJYB rows and their ranges invent a trend (e.g. the 1927-1949 AJYB row ramps 1,765,000 -> 2,000,000 although the source is a point count for 1927).

```text
L135824: USA | New York | est 1654 | 1927–1949 | pop 1765000 → 2000000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=1828&ownerType=0&ownerId=2425 | “AJYB vol 30 (1928) General Table F List of places reporting Jews and number reported (Linfield), Jewish Population of the United States 1927; state heading New York; PDF page 105.”
L135825: USA | New York | est 1654 | 1950–1959 | pop 2000000 → 1860000 | prob — | https://en.wikipedia.org/wiki/History_of_the_Jews_in_New_York_City | “Post-WWII suburban migration begins”
L135831: USA | New York | est 1654 | 1981–1990 | pop 1100000 → 1027000 | prob — | https://en.wikipedia.org/wiki/History_of_the_Jews_in_New_York_City | “Continued suburban migration and urban decline”
L135832: USA | New York | est 1654 | 1991–2001 | pop 1027000 → 972000 | prob — | https://en.wikipedia.org/wiki/History_of_the_Jews_in_New_York_City | “Stabilization and slight growth”
L135833: USA | New York | est 1654 | 2002–2011 | pop 972000 → 1100000 | prob — | https://en.wikipedia.org/wiki/History_of_the_Jews_in_New_York_City | “Modern period - still largest Jewish community in world”
L135834: USA | New York | est 1654 | 2012–2012 | pop 1100000 → 1086400 | prob — | https://en.wikipedia.org/wiki/History_of_the_Jews_in_New_York_City | “Modern period - still largest Jewish community in world”
```

**[HELD FLAT]** 1962-1975: 1,836,000 -> 1,228,000 for 'Estimated Jewish population for New York City; the report notes this figure remained unchanged from an earlier 1960 estimate' — the end value is the 1976 estimate, so the row ramps a decline that the source describes as unchanged.

```text
L135828: USA | New York | est 1654 | 1962–1975 | pop 1836000 → 1228000 | medium | https://www.jewishdatabank.org/content/upload/bjdb/1962_Jewish_Population_in_the_United_States_(AJYB-1963).pdf | “Estimated Jewish population for New York City; the report notes this figure remained unchanged from an earlier 1960 estimate.”
```

#### Ukraine/Horokhiv

**[CHAIN]** 1900-1938 ramps 3,194 -> 62 ('Jewish population was 3,194' in 1900); the 62 is a later/other fact chained from the next row, so the map shows ~ 1,500 in 1920 for a town that had ~ 3,000 Jews until 1939.

```text
L147275: Ukraine | Horokhiv | est 1600 | 1900–1938 | pop 3194 → 62 | high | https://cdp.jewishgen.org/eastern-europe/ukraine/gorodok-volinskaya-oblast | “Jewish population was 3194.”
```

#### Ukraine/Kolomyia

**[CHAIN_SUBSET]** 1900-1938 ramps 16,868 -> 400 because the end value was chained from the next row, whose 400 is '80 families list the names of family members who perished in the Holocaust' (80 x 5, a count of victims' families). The map shows ~ 6,000 Jews in 1925 and 400 in 1938, while the town's own 1939 row says 19,350 Jews before the war.

```text
L148275: Ukraine | Kolomyia | est 1241 | 1900–1938 | pop 16868 → 400 | high | https://myshtetl.org/lvovskaja/kolomyya_en.html | “At the turn of the century, 34,188 people lived in Kolomyya, and 16,868 of them were Jews”
L148276: Ukraine | Kolomyia | est 1241 | 1939–1941 | pop 400 → 18000 | high | https://jewishgen.org/yizkor/kolomyya/kolomyya.html | “Estimate based on families. Only about 80 families list the names of family members who perished in the holocaust between 1939-1945 (thousands more killed)”
```

#### Ukraine/Kosiv

**[CHAIN]** 1921-1938 ramps 2,166 -> 81 (comment 'The Jewish community numbered more than 2166 people out of a total of 4234'); 81 comes from the next row, so the pre-war community appears to shrink to 81 before the war.

```text
L148544: Ukraine | Kosiv | est 1550 | 1921–1938 | pop 2166 → 81 | high | http://www.kosivart.com/eng/index.cfm/do/kosiv.jews-of-kosiv/ | “The Jewish community numbered more than 2166 people out of a total of 4234.”
```

#### Ukraine/Kyiv

**[WARTIME COUNT / CHAIN]** 1939-1940 row ramps 140,256 (the 1926 census) down to 33,771 (the Babi Yar victim count) — the end value is a death toll, and it is placed in 1940, before the massacre happened (Sept 1941).

```text
L149083: Ukraine | Kyiv | est 885 | 1939–1940 | pop 140256 → 33771 | high | https://cdp.jewishgen.org/eastern-europe/ukraine/kiyev | “Jewish population”
```

**[VICTIM COUNT AS POPULATION + RAMP]** Three rows start from the number of people shot at Babi Yar (33,771 / 33,000 / 34,000) and ramp up to 100,000 over 1941-2002. A massacre toll is not a resident population, and the 61-year ramp invents growth from a death toll to a modern estimate (e.g. ~ 53,000 for 1959 where the 1959 census gives 153,466).

```text
L149084: Ukraine | Kyiv | est 885 | 1941–2002 | pop 33771 → 100000 | high | https://www.worldjewishcongress.org/en/about/communities/UA | “Jews were killed at the Babi Yar ravine in a single operation from September 29-30”
L149085: Ukraine | Kyiv | est 885 | 1941–2002 | pop 33000 → 100000 | high | https://2021-2025.state.gov/reports/just-act-report-to-congress/ukraine/ | “SS and Nazi police and their auxiliaries murdered 33,000 Jews at Babyn Yar”
L149086: Ukraine | Kyiv | est 885 | 1941–2002 | pop 34000 → 100000 | high | https://blog.ehri-project.eu/2024/12/12/saving-kyivs-jews-during-the-holocaust/ | “Around 34,000 Jews were shot by the Nazis in Babyn Yar ravine on September 29-30”
```

**[INFLATED / DEFINITION]** 100,000 from 2003 and carried to 2026 ('estimated Jewish population out of a total city population of 3 million'): this is the enlarged (Law-of-Return type) estimate. The 2001 Ukrainian census counted about 17,900 Jews by nationality in Kyiv and DellaPergola's core estimate for the whole of Ukraine is 33,000 (2023); the map's Kyiv alone is three times Ukraine's core total. No row between the 1989 census (100,584) and 2003 shows the collapse (1989 -> 2001).

```text
L149091: Ukraine | Kyiv | est 885 | 2003–2026 | pop 100000 → — | medium | https://cdp.jewishgen.org/eastern-europe/ukraine/kiyev | “Estimated Jewish population out of a total city population of 3 million”
```

#### Ukraine/Mukachevo

**[RAMP]** 1746-1824 ramps 25 -> 2,131 from 'five Jewish families with 25 members; not yet enough for a minyan', so 2,131 (a later census value) is drawn as if the community had 2,131 in 1824; the map shows ~ 1,080 in 1785.

```text
L150084: Ukraine | Mukachevo | est 1741 | 1746–1824 | pop 25 → 2131 | high | https://kehilalinks.jewishgen.org/chynadiyovo/jewishlife.html | “Five resident Jewish families with 25 members; not yet enough men for a minyan; Jews of Mukachevo met in Chynadiyovo for holidays.”
```

#### Ukraine/Mykolaiv

**[HOMONYM]** The rows 1910-14, 1931-34, 1935-40 (295 -> 25,000), 1941 (600) and 1942 (614) carry the note 'Source refers to Mykolaiv in Lviv region' but sit on the pin of Mykolaiv (Nikolayev) in the south (31.99 E, 46.98 N), whose own rows are 17,974 (1897) and 21,786 (1926). The merged series jumps 17,974 -> 632 -> 700 -> 559 -> 295 -> 25,000 and mixes a city of 20,000+ Jews with a small Galician town.

```text
L150144: Ukraine | Mykolaiv | est 1595 | 1910–1914 | pop 632 → 700 | high | https://myshtetl.org/lvovskaja/mykolayiv_lv.html | “Constituted about 18% of all inhabitants. Note: Source refers to Mykolaiv in Lviv region.”
L150147: Ukraine | Mykolaiv | est 1595 | 1931–1934 | pop 559 → 295 | high | https://myshtetl.org/lvovskaja/mykolayiv_lv.html | “Note: Source refers to Mykolaiv in Lviv region.”
L150148: Ukraine | Mykolaiv | est 1595 | 1935–1940 | pop 295 → 25000 | high | https://cdp.jewishgen.org/eastern-europe/ukraine/mykolaiv | “Note: Source refers to Mykolaiv in Lviv region.”
L150150: Ukraine | Mykolaiv | est 1595 | 1941–1941 | pop 600 → 614 | medium | https://myshtetl.org/lvovskaja/mykolayiv_lv.html | “In mid-1941 their number was estimated at over 600. Note: Source refers to Mykolaiv in Lviv region.”
L150151: Ukraine | Mykolaiv | est 1595 | 1942–1942 | pop 614 → 614 | high | https://myshtetl.org/lvovskaja/mykolayiv_lv.html | “On 10 June 1942, 614 Jews were registered in the town. Note: Source refers to Mykolaiv in Lviv region.”
```

#### Ukraine/Odesa

**[GAP / RAMP]** 1944-2000 ramps 2,640 (a June-1944 registration) -> 12,000 (the 2001 census) over 56 years, and is the only series between 1944 and the 1959 census (108,900). The map shows ~ 3,600 in 1950 and ~ 12,000 in 1999-2000 while sources show ~ 100,000 in 1959-1979 and ~ 12,000 only after the mass emigration. For 1944-1958 the true curve (recovery to ~ 100k) is missing, and the row hides the true decline.

```text
L150663: Ukraine | Odesa | est 1789 | 1944–2000 | pop 2640 → 12000 | high | https://encyclopedia.ushmm.org/content/en/article/odessa | “In June 1944, Soviet authorities conducted a registration revealing the Jewish community was decimated to 2640”
L150659: Ukraine | Odesa | est 1789 | 1939–1940 | pop 200000 → 70000 | high | https://encyclopedia.ushmm.org/content/en/article/odessa | “According to the 1939 Soviet census, about one third of Odesans were Jews”
L150664: Ukraine | Odesa | est 1789 | 1959–1959 | pop ~108900 → ~108900 | low | https://www.jewsencyclopedia.com/index.php/%D0%9E%D0%94%D0%95%D0%A1%D0%A1%D0%90 | “Jews (nationality 'Jew') in Odesa in 1959: 108900. Russian Jewish Encyclopedia (REE), entry "ОДЕССА" on jewsencyclopedia.com; source wording: "в 1959 – ок. 108 900 (ок. 16,3%)". REE gives the series without naming the census; 1959 is the date of the all-Union census of 15 January 1959, so the figure is read as that census count of persons of Jewish nationali…”
```

**[INFLATED / RAMP]** 2001-2021 ramps 12,000 (2001 census) -> 50,000 over 20 years; 50,000 is a 2022 community-leader claim ('closer to 50,000 before the war'), so the series invents a fourfold growth. Odesa shows 48,100 in 2020; DellaPergola's core for all Ukraine is 33,000.

```text
L150667: Ukraine | Odesa | est 1789 | 2001–2021 | pop 12000 → 50000 | high | https://www.jpost.com/diaspora/article-726782 | “Ukraine's last census conducted in 2001 claimed there were only 12000 Jews left in Odesa, though local leaders disputed this”
L150668: Ukraine | Odesa | est 1789 | 2022–2026 | pop 50000 → — | high | https://www.jpost.com/diaspora/article-726782 | “Local Jewish leaders claimed the Jewish community numbered closer to 50000 prior to the Russian invasion, representing 5% of the total population”
```

#### Ukraine/Pryluky

**[COMMENT_MISMATCH]** 1948-1958 ramps 0 -> 2,000 with the comment 'All the bodies were buried in a common grave in the depression' — a massacre-site sentence, not a population.

```text
L151506: Ukraine | Pryluky | est 1550 | 1948–1958 | pop 0 → 2000 | high | https://www.memorialmuseums.org/memorialmuseum/memorial-to-the-murdered-jews-of-pryluky?locale=en | “All the bodies were buried in a common grave in the depression”
```

#### United Kingdom/London

**[FALSE GRADUAL DECLINE]** 1290-1656 ramps 2,000 -> 0 over 366 years ('Expulsion period - Jews expelled in 1290'): the expulsion was in 1290 and there were no Jews (officially) until 1656, but the line shows ~ 1,000 Jews in 1473 and ~ 500 in 1564. Early hand-typed template row (process_notes: 'Unverified approximation from an early hand-typed batch').

```text
L156853: United Kingdom | London | est 1066 | 1290–1656 | pop 2000 → 0 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Expulsion period - Jews expelled in 1290”
```

**[TEMPLATE ROWS]** Eleven rows from the early hand-typed batch (generic comments such as 'Early settlement - Jews arrive with Norman conquest', 'Late 19th century - mass immigration from Eastern Europe', 'Pre-war period - massive community', 'Interwar period - peak population', 'Late 20th century - community grows') with round numbers and wide ramps, all marked 'Unverified approximation' in process_notes. Examples: 1850-1900 ramps 2,000 -> 10,000 (the community was already ~ 20,000 in 1850 and about 135,000 in 1900 in the London area); 1900-1920 ramps 10,000 -> 200,000, which for 1905 gives ~ 60,000 while the sourced estimate in the same town is 144,000 (row 156880); 1970-2000 ramps 180,000 -> 200,000 while the 2001 census row is 149,789.

```text
L156819: United Kingdom | London | est 1066 | 1066–1200 | pop 100 → 500 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Early settlement - Jews arrive with Norman conquest”
L156829: United Kingdom | London | est 1066 | 1200–1290 | pop 500 → 2000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Medieval period - thriving community”
L156859: United Kingdom | London | est 1066 | 1656–1699 | pop 0 → 100 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Readmission - Jews return to England”
L156862: United Kingdom | London | est 1066 | 1700–1800 | pop 100 → 500 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “18th century - community re-establishes”
L156863: United Kingdom | London | est 1066 | 1800–1850 | pop 500 → 2000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Early 19th century - population grows”
L156865: United Kingdom | London | est 1066 | 1850–1900 | pop 2000 → 10000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Late 19th century - mass immigration from Eastern Europe”
L156877: United Kingdom | London | est 1066 | 1900–1920 | pop 10000 → 200000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Pre-war period - massive community”
L156893: United Kingdom | London | est 1066 | 1920–1940 | pop 200000 → 250000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Interwar period - peak population”
L156898: United Kingdom | London | est 1066 | 1940–1945 | pop 250000 → 200000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “World War II - some emigration”
L156900: United Kingdom | London | est 1066 | 1945–1970 | pop 200000 → 180000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Post-war period - stable community”
L156910: United Kingdom | London | est 1066 | 1970–2000 | pop 180000 → 200000 | low | https://www.jewishvirtuallibrary.org/london-england-jewish-history-tour | “Late 20th century - community grows”
```

### 4.2 Reviewed by the six regional reviewers

Same procedure, towns taken from each region's largest by peak count plus a random sample. Findings are the reviewers' wording, kept only where every cited row exists and belongs to the town.

#### Poland — 87 findings in 36 towns

##### Poland/Białystok

**[RAMP_OVERRIDES_SOURCED]** Row 1807-1894 ramps 4000 to 47783 (47783 is borrowed from the 1895 row 'about 73% of residents'); comment is just 'Out of 6,000 total inhabitants'. Interpolated value is 24,129 in 1847 vs the sourced 6,714 (3.6x) and about 33,200 in 1865, so the map shows a Jewish population several times too high for 87 years.

```text
L88238: Poland | Białystok | est 1658 | 1807–1894 | pop 4000 → 47783 | high | (citation lost - legacy data entry error) | “"Out of 6, 000 total inhabitants"”
```

**[CHAIN_SUBSET]** 1939-1940 row ramps 60000 to 2000 (map: 2,000 in 1940) and the 1941 row holds 2000, a count of Jews 'burned alive inside the Great Synagogue'. That is a victim count; the Jewish population in 1940-41 was 40,000+ (the 1941 ghetto narrative row itself says 43,000). The map shows ~2,000 for 1940-1943 for the third-largest Jewish centre in Poland.

```text
L88248: Poland | Białystok | est 1658 | 1939–1940 | pop 60000 → 2000 | high | (citation lost - legacy data entry error) | “"Out of 100, 000 total inhabitants"”
L88249: Poland | Białystok | est 1658 | 1941–1941 | pop 2000 → — | high | https://www.jewishgen.org/yizkor/Bialystok1/bia002.html | “"Jews burned alive inside the Great Synagogue"”
```

**[COMMENT_MISMATCH]** 88242 (1897-1899) starts at 26,880 = 64% of '42,000 total inhabitants', but the next row (88243, 1900) says 64% of 65,000 total, so 42,000 cannot be the town total (it is roughly the Jewish count of the 1897 census). 88241 ramps 47,783 -> 26,880 over 1895-96, a false 45% drop in one year, then 26,880 -> 41,600 by 1899.

```text
L88241: Poland | Białystok | est 1658 | 1895–1896 | pop 47783 → 26880 | high | https://he.wikipedia.org/wiki/%D7%91%D7%99%D7%90%D7%9C%D7%99%D7%A1%D7%98%D7%95%D7%A7 | “about 73% of residents”
L88242: Poland | Białystok | est 1658 | 1897–1899 | pop 26880 → 41600 | high | (citation lost - legacy data entry error) | “"Calculated as 64% of 42, 000 total inhabitants"”
```

**[RAMP_OVERRIDES_SOURCED]** 1921-1938 row ramps 39,602 to 60,000 (60,000 is the 1913 / 1939 round figure) over the 1931 census value of 39,200 (88247); value is 51,600 in 1931 (1.3x) and 56,400 in 1935 (1.44x), reaching 60,000 in 1938 (1.53x the last census). 88245 (1913-1920) likewise starts from the round 60,000.

```text
L88246: Poland | Białystok | est 1658 | 1921–1938 | pop 39602 → 60000 | high | https://he.wikipedia.org/wiki/%D7%91%D7%99%D7%90%D7%9C%D7%99%D7%A1%D7%98%D7%95%D7%A7 | “of 76,792 inhabitants”
L88245: Poland | Białystok | est 1658 | 1913–1920 | pop 60000 → 39602 | high | (citation lost - legacy data entry error) | “"Out of 91, 000 total inhabitants"”
```

**[GAP]** Only 1944 (1,500) is covered between the war and the 2021 census (134). The narrative rows document an organised community with 1,567 Jews registered in 1946 and Jewish institutions through 1949, but no numeric row covers 1945-2020, so the town vanishes from the map for 76 years.

```text
L88254: Poland | Białystok | est 1663 | 1944–1944 | pop 1500 → 1500 | medium | Pyzewska, "Losy ludnosci zydowskiej w wojewodztwie bialostockim w latach 1944-1949 - wybrane problemy", in: Z … | “The first postwar count of registered Jews, taken in October 1944 by the Department for Aid to the Civilian Population (Referat ds. Pomocy Ludnosci Cywilnej), gives 8 thousand registered Jews in the liberated area, of whom 3 thousand in Lublin and 1.5 thousand in Białystok (J. Adelson, 1993, p. 387, as cited); civilians only (soldiers excluded), 75% men aged…”
```

##### Poland/Bochnia

**[WARTIME_COUNT]** 88493/88494 (1939-1940) ramp 3,500/2,000 -> 15,000 and 88496 (1941-1943) holds 15,000 'Total Jewish population in ghetto (locals and refugees)': map shows 15,000 in 1940-41 (4.3x the 1939 figure of 3,500) and 7,500 in 1942.

```text
L88493: Poland | Bochnia | est 1445 | 1939–1940 | pop 3500 → 15000 | medium | https://kehilalinks.jewishgen.org/krakow/bochnia/Boch_social_cultural.htm | “"Jewish population (approx. 20% of total town population)"”
L88494: Poland | Bochnia | est 1445 | 1939–1940 | pop 2000 → 15000 | medium | https://www.jgaliciabukovina.net/print/111151 | “Table lists approximately 2,000 Jews (20%) for 1939; conflicts with 3,500 estimate and with the 20% share, probably an error in this table.”
L88496: Poland | Bochnia | est 1445 | 1941–1943 | pop 15000 → 0 | high | https://kehilalinks.jewishgen.org/krakow/bochnia/Boch_social_cultural.htm | “"Total Jewish population in ghetto (locals and refugees) during the ghetto period"”
```

**[EXPULSION_RAMP]** The comment says that after the 1605 expulsion about 50 Jews lived at the edge of the town until resettlement in 1862, yet 88484 holds 50 for 128 years and 88485 (1733-1868) ramps 50 -> 1,000: map shows 521 in 1800 and 873 in 1850.

```text
L88484: Poland | Bochnia | est 1445 | 1605–1732 | pop 50 → 50 | high | https://kehilalinks.jewishgen.org/krakow/bochnia/Boch_social_cultural.htm | “"Jewish population residing at the ends of Bochnia following expulsion (maintained commercial relations until 1862)"”
L88485: Poland | Bochnia | est 1445 | 1733–1868 | pop 50 → 1000 | medium | https://kehilalinks.jewishgen.org/Krakow/bochnia/Boch_social_cultural.htm | “After the 1605 expulsion about 50 Jews lived at the edges of Bochnia until resettlement was allowed in 1862; source gives no single year so the midpoint of 1605-1862 is used; approximate.”
```

**[OTHER]** city_german is 'Bezirk Bochnia' (the district), not the town name.

```text
L88480: Poland | Bochnia | est 1445 | 1445–1445 | pop — → — | high | https://kehilalinks.jewishgen.org/krakow/bochnia/Boch_social_cultural.htm | “Event: documents record a condemnation of Bochnia Jews in 1445 over the salt trade, which did not stop them staying; the same source says Jews settled very close to the discovery of the salt mines (undated).”
L88481: Poland | Bochnia | est 1445 | 1445–1454 | pop — → — | high | https://kehilalinks.jewishgen.org/Krakow/bochnia/Boch_social_cultural.htm | “Earliest dated record: a 1445 condemnation of Bochnia Jews tied to salt commerce; Jews said to have settled close to the discovery of the salt mines.”
```

##### Poland/Będzin

**[CHAIN_SUBSET]** 88025 (1909-1912) ramps 22,674 -> 1,062 (1,062 = men eligible to vote for rabbi in 1913, 88026) which then ramps 1,062 -> 6 (6 = first Third-Aliyah pioneers) and 88028 starts at 6. The map shows 8,266 in 1911, 1,062 in 1912, 640 in 1915 and 6 in 1918-19 for a community of 20,000+.

```text
L88025: Poland | Będzin | est 1226 | 1909–1912 | pop 22674 → 1062 | high | https://www.jewishgen.org/databases/holocaust/0128_Bedzin_census.html | “"Jewish population"”
L88026: Poland | Będzin | est 1226 | 1913–1918 | pop 1062 → 6 | high | https://www.jewishgen.org/yizkor/Zaglembia/zag493.html | “On the 30th of December 1913... Of the 1062 men eligible to vote for rabbi, 707 voted”
L88028: Poland | Będzin | est 1226 | 1919–1920 | pop 6 → 13646 | high | https://www.jewishgen.org/yizkor/Bedzin/Bedzin.html | “"The first six pioneers of the Third Aliyah"”
```

**[RAMP_OVERRIDES_SOURCED]** 88003 (1765-1814) ramps 446 -> 2,440 and gives 2,196 in 1808 vs the sourced 453 (Wasiutynski, 4.8x). 88011 (1815-1830) starts at 2,440 (vs 527 in 1827) and ends at 100 = 'more than a hundred Jews died in two weeks' (88014 1831-1853 100>1870, 1870 = 374 dues payers x5), so the map shows 100 in 1831 and ~820 in 1840.

```text
L88003: Poland | Będzin | est 1226 | 1765–1814 | pop 446 → 2440 | high | https://www.jewishgen.org/databases/holocaust/0128_Bedzin_census.html | “"Jewish population"”
L88011: Poland | Będzin | est 1226 | 1815–1830 | pop 2440 → 100 | high | https://www.jewishgen.org/yizkor/Zaglembia/zag493.html | “In Będzin there were 2,440 Jews and 1780 Christians following the Vienna Congress of 1815”
L88014: Poland | Będzin | est 1226 | 1831–1853 | pop 100 → 1870 | high | https://www.jewishgen.org/yizkor/Zaglembia/zag493.html | “In 1831, more than a hundred Jews died within two weeks from a plague or by falling in the Polish uprising”
```

**[CHAIN_SUBSET]** 88038 (1940) is a single-year row with pop_start 83 = children in the orphanage, so 1940 shows 83 Jews (the 1939 value is 22,167 and 1941 25,171); 88039 then ramps 25,171 -> 150 over 1941-1945 (12,700 in 1943, 6,400 in 1944) although the ghetto was liquidated in Aug 1943.

```text
L88038: Poland | Będzin | est 1226 | 1940–1940 | pop 83 → 25171 | high | https://www.jewishgen.org/yizkor/zaglembia/zag060E.html | “In Bedzin there existed an orphanage for 83 children”
L88034: Poland | Będzin | est 1226 | 1939–1939 | pop 22167 → 83 | high | https://www.ushmm.org/online/hsv/source_view.php?SourceId=20586; https://www.jewishgen.org/databases/holocaust… | “Population estimated at 22,167-30,000 in 1939 (confirmed by two independent sources), rising to 25,171 by 1940”
```

**[COMMENT_MISMATCH]** The comments say 'Jewish population of Sosnowiec in 1921 / 1937 per the Pinkas HaKehillot' (13,646 and 22,167/26,904) but the rows sit under Będzin; either the numbers belong to Sosnowiec (HOMONYM-type mix of two towns) or the comments are wrong. Sosnowiec's own series gives 20,605 (1931) and 27,000 (1937).

```text
L88029: Poland | Będzin | est 1226 | 1921–1929 | pop 13646 → 24000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00327.html | “Jewish population of Sosnowiec in 1921 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation.”
L88033: Poland | Będzin | est 1226 | 1937–1938 | pop 26904 → 22167 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00327.html | “Jewish population of Sosnowiec in 1937 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation.”
```

**[CHAIN_SUBSET]** 88043 (1946-2017) ramps 150 -> 2, where 2 = 'two survivors from Będzin' in a World Jewish Congress delegation (88044). Map shows 58 in 1990 and 2 for 2018-2020.

```text
L88043: Poland | Będzin | est 1226 | 1946–2017 | pop 150 → 2 | medium | https://www.jewishgen.org/databases/holocaust/0128_Bedzin_census.html | “"Survivors returned (approximate)"”
L88044: Poland | Będzin | est 1226 | 2018–2026 | pop 2 → — | high | https://www.worldjewishcongress.org/en/news/my-journey-to-the-past-a-reflection-by-wjc-general-counsel-menache… | “The group included two survivors from Będzin, Esther Peterseil and Dasha Rittenberg”
```

##### Poland/Chełm

**[WARTIME_COUNT]** 1939-1944 ramps 14,995/18,000 -> 200 (post-war survivors): map shows 6,100-7,300 in 1942 and 3,200-3,800 in 1943 although the Chełm Jews were deported to Sobibór in 1942 and destroyed by 1943.

```text
L89154: Poland | Chełm | est 1205 | 1939–1944 | pop 14995 → 200 | high | https://www.jewishgen.org/Yizkor/ybip/YBIP_Chelm.html | “Jewish population was 44.6% of the total 33,622 inhabitants; community owned two synagogues, 45 cheders, 2 bathhouses, and 2 mikvot.”
L89155: Poland | Chełm | est 1442 | 1939–1944 | pop 18000 → 200 | medium | https://en.wikipedia.org/wiki/Che%C5%82m | “At outbreak of WWII approx. 18000 Jews (60% of inhabitants per Wikipedia; Wikipedia also cites 42.1% in 1921 census)”
```

**[CONFLICT]** 89134 (1550-1699) 371 > 400 held flat for 150 years while 89139 gives 800 Jews in 1629 (2.2x); after the single 1629 point the map returns to ~385.

```text
L89134: Poland | Chełm | est 1442 | 1550–1699 | pop 371 → 400 | high | https://www.jewishgen.org/yizkor/chelm/che013.html | “First official census of Jewish population: 371 Jewish souls in 40 houses”
L89139: Poland | Chełm | est 1442 | 1629–1629 | pop 800 → 800 | high | https://sztetl.org.pl/en/node/20531 | “1629: 800 Jews in Virtual Shtetl's demography table for Chełm (columns year / inhabitants / Jews) - the row's total population is 2,600. Virtual Shtetl compiles its tables from published studies; the table's own source line is not on the page.”
```

##### Poland/Częstochowa

**[WARTIME_COUNT]** 89691 (1945-1945, 45000>2200) uses 'approximately 45,000 Jews were murdered' (a victim count) as pop_start, so the map shows 45,000 Jews in 1945. 89686 (1942-1945, 48000>0) uses the ghetto count that includes 20,000+ Jews relocated from other towns and ramps it to 0 by 1945: map shows 32,000 in 1943 and 16,000 in 1944, although the ghetto was liquidated in 1942-43 and ~5,000 workers remained in the HASAG camps (the 5,200 liberated Jews in 89693).

```text
L89691: Poland | Częstochowa | est 1000 | 1945–1945 | pop 45000 → 2200 | medium | https://cdp.jewishgen.org/eastern-europe/poland/czestochowa | “Approximately 45,000 of Częstochowa's Jews were murdered by the Germans during WWII.”
L89686: Poland | Częstochowa | est 1000 | 1942–1945 | pop 48000 → 0 | high | http://www.aapjstudies.org/index.php?id=73 | “About 48,000 people were crowded into the ghetto, including over 20,000 Jews forcibly relocated from other towns.”
L89685: Poland | Częstochowa | est 1620 | 1942–1945 | pop 5000 → 0 | prob — | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “Holocaust devastation - community destroyed”
L89690: Poland | Częstochowa | est 1620 | 1945–1945 | pop 0 → 2200 | prob — | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “Post-war period - no Jewish population remains”
```

**[CHAIN_SUBSET]** pop_end/pop_start chained from school rolls: 89670 (1915-16) ends at 833 = attendance at 15 Jewish elementary schools (89671), 89671 ramps 833 -> 410 (410 = 300+110 high-school pupils, 89672); 89676 (1931-32) ends at 120 = pupils of the agricultural boarding school (89677), which then ramps 120 -> 30000 over 1933-1938. Map shows 833 in 1916, 410 in 1918-19 and 120 in 1932-33 (about 12,000 in 1935) for a community of 20,000-28,000.

```text
L89670: Poland | Częstochowa | est 1000 | 1915–1916 | pop 23766 → 833 | high | http://www.aapjstudies.org/index.php?id=70 | “According to a census for food supplies, there were 23,766 Jews (about 28%) out of 84,847.”
L89671: Poland | Częstochowa | est 1000 | 1917–1918 | pop 833 → 410 | high | http://www.aapjstudies.org/index.php?id=70 | “There were 15 Jewish elementary schools with an attendance of 833.”
L89672: Poland | Częstochowa | est 1000 | 1919–1919 | pop 410 → 15000 | high | http://www.aapjstudies.org/index.php?id=70 | “Two high schools operated: a Boys' High School with 300 students and a Girls' High School with 110 students.”
L89676: Poland | Częstochowa | est 1000 | 1931–1932 | pop 25588 → 120 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_073.html | “The census recorded 25,588 Jews.”
L89677: Poland | Częstochowa | est 1000 | 1933–1938 | pop 120 → 30000 | high | http://www.aapjstudies.org/index.php?id=70 | “The gardening-agricultural boarding school was attended by 120 Jewish students.”
```

**[RAMP_OVERRIDES_SOURCED]** 89649 (1790-1799) ramps 50 -> 1000 (the 1000 is the template number of 89650 'Industrial development'); value is 578 in 1795 vs the sourced 50 (1790) and 36, i.e. >10x. 89650 (1800-1804, 1000>96) is a template row whose end 96 is the count of 12 craftsmen + 84 merchants (89651) carried as population; the 1806 sourced figure is 495.

```text
L89649: Poland | Częstochowa | est 1620 | 1790–1799 | pop 50 → 1000 | high | https://jewishstory.czestochowa.pl/?p=2053 | “In 1790 there were only about 50 Jewish residents (still part of the Janow kahal).”
L89650: Poland | Częstochowa | est 1620 | 1800–1804 | pop 1000 → 96 | prob — | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “Industrial development - Jewish population grows”
L89651: Poland | Częstochowa | est 1000 | 1805–1805 | pop 96 → 495 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_073.html | “Figures on the total number of craftsmen and merchants show 12 Jewish craftsmen and 84 Jewish merchants in Częstochowa.”
```

**[TEMPLATE]** Template rows ('Early Jewish settlement', 'Pre-war growth', 'Peak population - over 30,000 Jews', 'German occupation') feed numbers into sourced rows: 89641 (1700-1762) has 500>100 vs the sourced 60>100 (89642), 8x at 1700, and 89640 ramps 0 -> 500 over 1655-1699 even though its own comment says Jews did not yet live there. 89663 and 89664 (1897-1899, 11,704/11,764) end at 5,000 from template 89665, drawing a false halving to 5,000 in 1899 (8,352 in 1898); 89673 (1920, 15000) and 89678 (30000>5000) are 15,000/30,000 round numbers vs 22,663 (1921) and 28,480.

```text
L89640: Poland | Częstochowa | est 1000 | 1655–1699 | pop 0 → 500 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_073.html | “Historian Balinski writes that Jews did not yet live in Częstochowa, possibly meaning Nowa Częstochowa.”
L89641: Poland | Częstochowa | est 1620 | 1700–1762 | pop 500 → 100 | prob — | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “Early Jewish settlement - community begins to form”
L89663: Poland | Częstochowa | est 1000 | 1897–1899 | pop 11704 → 5000 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_073.html | “According to the census, there were 11,704 Jews in Częstochowa itself (out of 43,863 in the powiat).”
L89664: Poland | Częstochowa | est 1620 | 1897–1899 | pop 11764 → 5000 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_033.html | “43,863 residents including 11,764 Jews (29.5%) per source; the figure appears to mix city and district totals.”
L89665: Poland | Częstochowa | est 1620 | 1900–1911 | pop 5000 → 23790 | prob — | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “Pre-war growth - major Jewish center”
L89673: Poland | Częstochowa | est 1620 | 1920–1920 | pop 15000 → 22663 | prob — | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “Peak population - over 30,000 Jews before Holocaust”
L89678: Poland | Częstochowa | est 1620 | 1939–1942 | pop 30000 → 5000 | prob — | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “German occupation - ghetto established, mass deportations”
```

**[COMMENT_MISMATCH]** District figures used for the town: 89654 (1810-1815) is '2,062 Jews in the area with a general population of 39,616' and 89658 (1831-1839) is 'In the entire Częstochowa powiat 2,360 Jews'. 89657 (1827-1830) ramps 1,141 -> 2,360 (the powiat figure), and 89653 ramps 495 -> 2,062. The map shows 2,062 in 1810 vs 495 in 1806-07 and 1,141 in 1827, and ~2,360 in 1830-31 vs 1,141 in 1827 and 2,299 in 1840.

```text
L89653: Poland | Częstochowa | est 1620 | 1808–1809 | pop 495 → 2062 | high | https://www.crarg.org/jewish-genealogy/czestochowa-poland.php | “"Jewish population count"”
L89654: Poland | Częstochowa | est 1000 | 1810–1815 | pop 2062 → 1400 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_073.html | “In the area with a general population of 39,616, there were 2,062 Jews.”
L89658: Poland | Częstochowa | est 1000 | 1831–1839 | pop 2360 → 2299 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_073.html | “In the entire Częstochowa powiat, there were 2,360 Jews.”
L89657: Poland | Częstochowa | est 1000 | 1827–1830 | pop 1141 → 2360 | high | https://www.jewishgen.org/yizkor/Czestochowa6/cze1_073.html | “There were 1,141 Jews in Częstochowa.”
```

##### Poland/Dzierżoniów

**[DERIVED]** 90207 (1946-1947) starts at 20,000 = 'close to half of Dzierżoniów's 40,000 total population' (halving a total) and ramps to 6,224 (1948, when the total was 24,000): map shows 20,000 in 1946 (a derived figure) falling to 6,224 in 1947, while 1948 gives 6,224 of 24,000 total.

```text
L90207: Poland | Dzierżoniów | est 1250 | 1946–1947 | pop 20000 → 6224 | high | https://sydneyjewishmuseum.com.au/wp-content/uploads/2022/08/Nash_RETURN-TO-POLAND.pdf | “At its peak, close to half of Dzierzoniow's 40,000 total population were Jews -- the highest percentage of Jews relative to the whole population of any town in Poland.”
L90205: Poland | Dzierżoniów | est 1250 | 1945–1945 | pop 85 → 20000 | high | https://cdp.jewishgen.org/eastern-europe/poland/dzierzoniow | “Estimate based on families. At the end of the war in the city ocalało only 17 Jewish families lived there.”
```

##### Poland/Frysztak

**[CHAIN_SUBSET]** 90335 (1921-1934) ramps 1,010 -> 16 and 90338 (1934-1941) starts at 16 = students at a Beitar farm, ramping to 1,000: map shows 322 in 1930, 16 in 1934 and 438 in 1937 for a community of ~1,000.

```text
L90335: Poland | Frysztak | est 1650 | 1921–1934 | pop 1010 → 16 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol3_00295.html | “"Jewish population"”
L90338: Poland | Frysztak | est 1650 | 1934–1941 | pop 16 → 1000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol3_00295.html | “"Students in Beitar agricultural training farm"”
L90339: Poland | Frysztak | est 1650 | 1942–1942 | pop 1000 → 20 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol3_00295.html | “"Estimate based on families (200 families) receiving assistance from J.S.S."”
```

**[HELD_FLAT]** 1943-2016 starts at 20 ('Jews remaining in the area') and ramps to 0: map shows 20 Jews in 1943 and 10 in 1980 although the community was destroyed in Aug 1942.

```text
L90340: Poland | Frysztak | est 1650 | 1943–2016 | pop 20 → 0 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol3_00295.html | “"Jews from Frysztak remaining in the area"”
```

**[CONFLICT]** 1765-1879: 90331 starts at 485 ('97 families who lived in Fristik and surrounding area') vs 157 in the Pinkas table (90330), a 3.1x gap; the map shows the higher regional number.

```text
L90330: Poland | Frysztak | est 1650 | 1765–1879 | pop 157 → 820 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol3_00295.html | “"Jewish population cited in table"”
L90331: Poland | Frysztak | est 1650 | 1765–1879 | pop 485 → 820 | high | https://kehilalinks.jewishgen.org/frysztak/frysztak.htm | “"Estimate based on families (97 families) who lived in Fristik and surrounding area"”
```

##### Poland/Gidle

**[TEMPLATE]** The whole series other than two rows is template ('Early Jewish settlement', 'Peak population - over 3,000 Jews before Holocaust', 'Holocaust devastation' ...) with round numbers 50/150/400/1000/2000/3000/500, for a village. No sourced point exists for 1700-1944.

```text
L90427: Poland | Gidle | est 1600 | 1600–1699 | pop 50 → 150 | prob — | https://www.crarg.org/jewish-genealogy/gidle-poland.php | “Early Jewish settlement - community begins to form”
L90430: Poland | Gidle | est 1600 | 1700–1799 | pop 150 → 400 | prob — | https://www.crarg.org/jewish-genealogy/gidle-poland.php | “Community growth - regional development”
L90431: Poland | Gidle | est 1600 | 1800–1899 | pop 400 → 1000 | prob — | https://www.crarg.org/jewish-genealogy/gidle-poland.php | “Industrial growth - population expands”
L90432: Poland | Gidle | est 1600 | 1900–1919 | pop 1000 → 2000 | prob — | https://www.crarg.org/jewish-genealogy/gidle-poland.php | “Pre-war growth - thriving community”
L90433: Poland | Gidle | est 1600 | 1920–1938 | pop 2000 → 3000 | prob — | https://www.crarg.org/jewish-genealogy/gidle-poland.php | “Peak population - over 3,000 Jews before Holocaust”
L90434: Poland | Gidle | est 1600 | 1939–1941 | pop 3000 → 500 | prob — | https://www.crarg.org/jewish-genealogy/gidle-poland.php | “German occupation - ghetto established, mass deportations”
L90435: Poland | Gidle | est 1600 | 1942–1944 | pop 500 → 0 | prob — | https://www.crarg.org/jewish-genealogy/gidle-poland.php | “Holocaust devastation - community destroyed”
L90436: Poland | Gidle | est 1600 | 1945–2023 | pop 0 → 0 | prob — | https://www.crarg.org/jewish-genealogy/gidle-poland.php | “Post-war period - no Jewish population remains”
```

**[COMMENT_MISMATCH]** 90429 is dated 1600-1699 but its text is about 19th-century growth ('General population of 513 in 1827 grew to 1,132, including 40 Jewish families'); 90428 (192 Jews per Pinkas) is also placed in the 17th century. Both look misdated.

```text
L90429: Poland | Gidle | est 1600 | 1600–1699 | pop 200 → 150 | high | https://www.jewishgen.org/yizkor/radomsko/rad485.html | “General population of 513 in 1827 grew in number to 1,132, including 40 Jewish families. Estimate based on families.”
L90428: Poland | Gidle | est 1600 | 1600–1699 | pop 192 → 150 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol0_00001.html | “Pinkas Poland lists the number of Jews as 192.”
```

##### Poland/Izbica

**[WARTIME_COUNT]** Transit/deportee numbers are used as the town population: 91397 (1942) 10,000 'Jews from Bohemia', 91398 (1942) 24,000 who 'passed through Izbica by November', 91399 (1943-1944) ramp 0 -> 26,000 (transports to Sobibór; 'end of Jewish Izbica April 28 1943'). Map shows 24,000 in 1942 and 26,000 in 1944 when no Jews lived there; 1943 shows 0. For 1940 the only rows have pop_start 0 (91392, 91393), so 1940 shows 0 although ~4,000-5,000 Jews lived there.

```text
L91397: Poland | Izbica | est 1750 | 1942–1942 | pop 10000 → 0 | high | Slovakia | “"Jews from Bohemia”
L91398: Poland | Izbica | est 1750 | 1942–1942 | pop 24000 → 0 | high | https://shtetlroutes.eu/en/izbica-przewodnik/ | “"Polish and other Jews passed through Izbica (by November)"”
L91399: Poland | Izbica | est 1750 | 1943–1944 | pop 0 → 26000 | high | https://shtetlroutes.eu/en/izbica-przewodnik/ | “"Transport to Sobibór extermination camp; end of Jewish Izbica (April 28)"”
L91392: Poland | Izbica | est 1750 | 1940–1940 | pop 0 → 1000 | high | Austria | “"Jews from Germany”
L91393: Poland | Izbica | est 1750 | 1940–1940 | pop 0 → 1000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00072.html | “"Judenrat set up; Szymon Szwarc in charge (Beginning of year)"”
```

**[CHAIN_SUBSET]** Placeholder/event rows break the series: 91363/91364 (1827-1834) ramp 407/422 -> 20, then 91365-91367 hold a 'nominal value' 20 for 1835-1854, then 91368/91369 are single-year rows with pop_start 0 in 1855 and 91371 (1857-1862) ramps 1,600 -> 3. Map shows 20 Jews in 1835-1853, 0 in 1855 and 3 in 1862, vs 1,594-1,600 in 1856-57 and 2,077 in 1879.

```text
L91363: Poland | Izbica | est 1750 | 1827–1834 | pop 407 → 20 | high | https://shtetlroutes.eu/en/izbica-przewodnik/ | “"Population; inhabited almost exclusively by Jews"”
L91364: Poland | Izbica | est 1750 | 1827–1834 | pop 422 → 20 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00072.html | “"Population: Jews (Total 433)"”
L91365: Poland | Izbica | est 1750 | 1835–1839 | pop 20 → 20 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00072.html | “"Rabbi Eliezer died" The source indicates an organized community/synagogue but gives no specific count; the population shown is only a nominal value.”
L91366: Poland | Izbica | est 1750 | 1840–1853 | pop 20 → 20 | high | https://shtetlroutes.eu/en/izbica-przewodnik/ | “"Tsaddik Mordekhai Yosef Leiner ran Hasidic court (1840s)" The source indicates an organized community/synagogue but gives no specific count; the population shown is only a nominal value.”
L91367: Poland | Izbica | est 1750 | 1854–1854 | pop 20 → 0 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00072.html | “"Rabbi Mordecai Joseph Leiner died" The source indicates an organized community/synagogue but gives no specific count; the population shown is only a nominal value.”
L91371: Poland | Izbica | est 1750 | 1857–1862 | pop 1600 → 3 | high | https://shtetlroutes.eu/en/izbica-przewodnik/ | “"Population; inhabited almost exclusively by Jews"”
```

**[CHAIN_SUBSET]** 1897-1924 sawtooth: 91375 (1897-1908) ramps 3,019 -> 0, 91376 starts at 0 and ramps to 4,451, 91377 (1914) goes 4,451 -> 20, 91378 20 -> 3, and the three 1921 census rows (2,869/2,865/2,862) ramp to 0 by 1924. Ends are 0/3/20 (rabbi/library/rabbi events) or 334 (workers). Map shows 0 in 1908-09, 20 in 1915-16 and 0 in 1924, for a town with 3,000-4,500 Jews.

```text
L91375: Poland | Izbica | est 1750 | 1897–1908 | pop 3019 → 0 | high | 172)" | “"Population: Jews (Total 3”
L91376: Poland | Izbica | est 1750 | 1909–1913 | pop 0 → 4451 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00072.html | “"Rabbi Moshe Baruch Ha-Kohen headed the court"”
L91377: Poland | Izbica | est 1750 | 1914–1914 | pop 4451 → 20 | high | https://shtetlroutes.eu/en/izbica-przewodnik/ | “"Population; almost all of them Jews"”
L91378: Poland | Izbica | est 1750 | 1915–1916 | pop 20 → 3 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00072.html | “"Public library opened" The source indicates an organized community/synagogue but gives no specific count; the population shown is only a nominal value.”
L91381: Poland | Izbica | est 1750 | 1921–1924 | pop 2869 → 0 | high | https://www.jhi.pl/en/articles/izbica-ghetto-jan-karski-story | “"93% of the 3085 inhabitants were Jews"”
L91382: Poland | Izbica | est 1750 | 1921–1924 | pop 2865 → 0 | high | https://shtetlroutes.eu/en/izbica-przewodnik/ | “"Jews (Census)"”
L91383: Poland | Izbica | est 1750 | 1921–1924 | pop 2862 → 0 | high | 085)" | “"Population: Jews (Total 3”
```

**[CHAIN_SUBSET]** 1925-1938: 91385 starts at 0, 91386 at 250 (members of a provident fund) and ramps to 150; 91387 (1929-1938) starts at 150 (pupils in a girls' school) and ramps to 5,000. Map shows 0-250 in 1925-28 and 150 in 1929 (vs 2,865 in 1921), 3,400 in 1935.

```text
L91385: Poland | Izbica | est 1750 | 1925–1926 | pop 0 → 250 | high | https://shtetlroutes.eu/en/izbica-przewodnik/ | “"Rabbi Pinkhas Elijah Herbst began to publish 'Ohel Moed'"”
L91386: Poland | Izbica | est 1750 | 1927–1928 | pop 250 → 150 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00072.html | “"Members of Kupat Gmelut Chassidim (Provident Fund) on establishment"”
L91387: Poland | Izbica | est 1750 | 1929–1938 | pop 150 → 5000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00072.html | “"Pupils studied at Agudat Yisrael girls' school"”
```

**[COMMENT_MISMATCH]** 91356 (1776-1780) comment says 'Jewish population of Tarnogora in 1776' (another town); 91355 ends at 13 from it, so the map shows Izbica falling 150 -> 13 -> 0 in 1772-1780 from Tarnogóra's number.

```text
L91355: Poland | Izbica | est 1750 | 1772–1775 | pop 150 → 13 | high | https://jasonfrancisco.net/karskis-belzec | “Population on the eve of the Polish partitions (1772-1795). Town was monoethnically Jewish”
L91356: Poland | Izbica | est 1750 | 1776–1780 | pop 13 → 0 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00249.html | “Jewish population of Tarnogora in 1776 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation (total population of the town: 700).”
```

##### Poland/Kalisz

**[WARTIME_COUNT]** 92135 (1942-1945) ramps 150 -> 300 (the 1946 returnee count) so the map shows 200 in 1943 and 250 in 1944, although the Kalisz ghetto was liquidated in 1942 and no Jews remained.

```text
L92135: Poland | Kalisz | est 1139 | 1942–1945 | pop 150 → 300 | high | https://www.actahumanitatis.com/index.php/journal/article/download/33/32 | “Only about 150 remained by early 1942”
L92133: Poland | Kalisz | est 1139 | 1941–1941 | pop 439 → 150 | high | https://www.actahumanitatis.com/index.php/journal/article/download/33/32 | “439 Jews were registered in January 1941”
```

**[CONFLICT]** 1931 census gives 15,300 Jews (92122, 'almost 30%') vs 19,248 for 1931 (92123), and both rows ramp to 26,070 in 1936 (92126). The ramp gives 20,700-22,700 in 1933 and 26,070 in 1935, up to 1.7x the 15,300 of the census, after a decade (1921: 15,556) with no growth.

```text
L92122: Poland | Kalisz | est 1139 | 1931–1935 | pop 15300 → 26070 | high | https://www.actahumanitatis.com/index.php/journal/article/download/33/32 | “According to the 1931 Polish census, Kalisz had 15,300 Jewish inhabitants, almost 30 per cent of the city population”
L92123: Poland | Kalisz | est 1139 | 1931–1935 | pop 19248 → 26070 | high | https://www.jewishvirtuallibrary.org/jsource/judaica/ejud_0002_0011_0_10638.html | “The Jewish population numbered 19,248 in 1931”
L92126: Poland | Kalisz | est 1139 | 1936–1938 | pop 26070 → 20000 | high | https://sztetl.org.pl/en/node/20932 | “Demography table: 26,070 Jews (34,1%) of 76,350 inhabitants.”
```

##### Poland/Kielce

**[WARTIME_COUNT]** 1939-1944 ramps 20,942 -> 201 (the February 1945 value): map shows 8,500 in 1942 and 4,350 in 1943 although the Kielce ghetto was liquidated in Aug 1942 (about 20,000 deported to Treblinka).

```text
L92456: Poland | Kielce | est 1535 | 1939–1944 | pop 20942 → 201 | high | https://www.jewishgen.org/yizkor/kielce1/kie007.html | “Population in September”
```

**[OTHER]** city_german for all Kielce rows is 'Philipp Ther' (the name of a historian), not a name for the town (Kielce).

```text
L92447: Poland | Kielce | est 1535 | 1535–1535 | pop — → — | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/kielce | “Jews were excluded from Kielce by a royal "privilege" granted to the city in 1535.”
L92448: Poland | Kielce | est 1535 | 1852–1869 | pop 101 → 992 | high | https://www.jewishgen.org/yizkor/kielce/kie001.html | “Jews lived in Kielce (contractors of the Russian army and soldiers); no organized community yet”
```

##### Poland/Lublin

**[CHAIN_SUBSET]** 16th-17th c. chain of unrelated small numbers: 94252 (1550-1597) ramps 840 -> 3 (3 = three Jews accused in the 1598 blood libel), 94265 3 -> 24 (24 tailors admitted to a guild), 94266 24 -> 1200, 94267 (1602-1645) 1200 -> 8 and 94272 8 -> 10000 (8 = Jews killed by students). Map shows 484 in 1570, 3 in 1597, 24 in 1600, ~700 in 1620 and 8 in 1645-46 for a community of several thousand; the comments 'Jewish population recorded in demographic table' do not describe the numbers.

```text
L94252: Poland | Lublin | est 1316 | 1550–1597 | pop 840 → 3 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Jewish population recorded in demographic table; Jewish quarter grew from 24 houses”
L94265: Poland | Lublin | est 1316 | 1598–1599 | pop 3 → 24 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Blood libel; three Jews of Lublin accused of murdering a Christian child and slaughtered by mob”
L94266: Poland | Lublin | est 1316 | 1600–1601 | pop 24 → 1200 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Group of Christian tailors seceded and accepted 24 Jewish tailors into their new guild”
L94267: Poland | Lublin | est 1316 | 1602–1645 | pop 1200 → 8 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Jewish population recorded in demographic table”
L94272: Poland | Lublin | est 1316 | 1646–1654 | pop 8 → 10000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Pupils of ecclesiastical colleges attacked Jewish quarter; eight Jews killed, many injured, 20 houses emptied”
```

**[CHAIN_SUBSET]** 94273 (1655-1688) ramps 10,000 (massacre count of 1655) -> 16; 94281 (1689-1764) starts at 16 (= 3 weavers + 13 brokers permitted by a guild agreement) and ramps to 1725; 94284 (1765-1780) ends at 42 (42 tailors) and 94285 starts at 42. The map shows 5,462 in 1670 (vs 1,020/506 poll-tax payers in 1674/76), 267 in 1700 and 603 in 1775, then 42 in 1781 while the 1790 census has 1,578 and 1795 has 4,500.

```text
L94273: Poland | Lublin | est 1316 | 1655–1688 | pop 10000 → 16 | high | https://www.jewishgen.org/databases/holocaust/0130_lublin.html | “Jews massacred when the city was captured by the Cossacks.”
L94281: Poland | Lublin | est 1316 | 1689–1764 | pop 16 → 1725 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Agreement with weavers' guild: 3 Jewish weavers permitted to work, 13 Jewish brokers allowed”
L94284: Poland | Lublin | est 1316 | 1765–1780 | pop 1725 → 42 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Jewish population recorded in demographic table”
L94285: Poland | Lublin | est 1316 | 1781–1786 | pop 42 → 4231 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Agreement signed increasing permitted Jewish tailors to 42”
```

**[WARTIME_COUNT]** 94323 (1942-1945) ramps 4,587 (ghetto list of April 1942, after the Belzec deportations) to 230 (230 = the first forced labourers sent to Belzec in 1940, narrative row 94315): map shows 3,135 in 1943 and 1,682 in 1944, although the last Lublin Jews were shot on 3 Nov 1943 (Erntefest) and 94327 documents ~300 in Aug 1944. 94329 then shows 230 in 1945, and 94329/94330 cite only 'Lublin Jews survived within German-occupied territory' / 'Jews were in the city' for 6,662.

```text
L94323: Poland | Lublin | est 1316 | 1942–1945 | pop 4587 → 230 | high | https://www.jewishgen.org/databases/holocaust/0130_lublin.html | “Jews in the ghetto of Lublin in April 1942, based on a list prepared by the Lublin Judenrat.”
L94329: Poland | Lublin | est 1316 | 1945–1945 | pop 230 → 6662 | high | https://www.jewishgen.org/databases/holocaust/0130_lublin.html | “Lublin Jews survived within German-occupied territory after the War.”
L94330: Poland | Lublin | est 1316 | 1946–1946 | pop 6662 → — | high | https://www.jewishgen.org/databases/holocaust/0130_lublin.html | “Jews were in the city.”
```

**[CHAIN_SUBSET]** The 1939-1941 rows all end at 10,000, the count of Jews deported in March 1941 (94316); map shows 25,000-29,000 in 1940 instead of the 40,000+ in the town, then 94316 re-uses 10,000 deportees as a population for 1941 (the 40,000 ghetto row 94317 is the only sourced one that year).

```text
L94310: Poland | Lublin | est 1316 | 1939–1941 | pop 40000 → 10000 | high | https://www.yadvashem.org/holocaust/this-month/march/1941.html | “On the eve of World War II, some 40,000 Jews lived in Lublin, constituting about one third of the city's population”
L94311: Poland | Lublin | est 1316 | 1939–1941 | pop 48000 → 10000 | medium | https://jewishgen.org/yizkor/lublin/lub129.html | “Before the Second World War, the Jewish community was approximately 40 percent of the general number of residents (which was 120,000 souls)”
L94312: Poland | Lublin | est 1316 | 1939–1941 | pop 42830 → 10000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00013.html | “Jewish population recorded in demographic table”
L94313: Poland | Lublin | est 1316 | 1939–1941 | pop 43000 → 10000 | medium | https://jewishgen.org/yizkor/lublin/lub163.html | “The Jewish settlement in Lublin, which numbered approximately 43,000 Jews, also included those living in the suburbs (Czechow and Wola)”
L94316: Poland | Lublin | est 1316 | 1941–1941 | pop 10000 → 4587 | medium | https://www.yadvashem.org/holocaust/this-month/march/1941.html | “From 10 March to the end of the month, approximately 10,000 Jews were deported to Rejowiec, Siedlce, Sosnowiec, and other towns”
```

**[GAP]** After the 6,662 of 1946 (held a single year) nothing covers 1947-2020, although Lublin was the seat of the Central Committee of Polish Jews and kept a community for decades; the series jumps to the 2021 census (264).

```text
L94330: Poland | Lublin | est 1316 | 1946–1946 | pop 6662 → — | high | https://www.jewishgen.org/databases/holocaust/0130_lublin.html | “Jews were in the city.”
L94333: Poland | Lublin | est 1316 | 2021–2021 | pop 264 → 264 | high | https://stat.gov.pl/download/gfx/portalinformacyjny/pl/defaultaktualnosci/6536/10/1/1/przynaleznosc_narodowo-e… | “Polish National Census 2021 (NSP 2021, reference date 31 Mar 2021): persons with national-ethnic identification 'zydowska' (Jewish) as first or second declaration, urban gmina (= the city). Values below 10 are not published. Self-declared identification, not community membership. Unit: persons. Source table: GUS NSP 2021, sheet "TABL. 5", gmina "gm. m. Lubli…”
```

##### Poland/Miechów

**[COMMENT_MISMATCH]** 94700 (1931-1938) 7,271 'out of 154,574 people' is the county figure (94699 notes the county had 8,318 Jews in 1921, the town 2,383 of 5,699), and 94698/94699 (1921-1930) ramp up to it: map shows 4,736 in 1925 and 7,271 in 1931, 2-3x the town's real population, then drops to 1,800.

```text
L94698: Poland | Miechów | est 1819 | 1921–1930 | pop 2707 → 7271 | high | https://cdp.jewishgen.org/eastern-europe/poland/miechow | “1921 Jewish population was 2707 (40.6%)”
L94699: Poland | Miechów | est 1819 | 1921–1930 | pop 2383 → 7271 | high | https://www.jewishgen.org/Yizkor/Miechow/mie035.html | “December 1921 census: 2,383 Jews in a total of 5,699 (41.8%); county had 8,318 Jews.”
L94700: Poland | Miechów | est 1819 | 1931–1938 | pop 7271 → 1800 | high | https://cdp.jewishgen.org/eastern-europe/poland/miechow | “1931 Census: 154574 people including 7271 Jews”
```

##### Poland/Międzyrzec Podlaski

**[CHAIN_SUBSET]** 1940-1943 uses counts of events as population: 94788 2,000 (slave-labour camps), pop_end 2 (two who survived in a hideout, 94789), 3 (graves of three tzadikim, 94790), 40 hostages murdered (94791) and 200 shot at cemeteries (94792). Map shows 2,000 in 1940, 2 in 1941, 40 in 1942 and 200 in 1943 for a ghetto town of ~12,000 Jews until the Aug 1942 deportations.

```text
L94788: Poland | Międzyrzec Podlaski | est 1512 | 1940–1941 | pop 2000 → 2 | high | https://people.math.carleton.ca/~rhfischl/GENEALOGY/TRIPLE_LOVE_DVD/LEIPZIG_GROUP/EASTERN_EUROPE/MIEDZYRZEC/1D… | “Six separate slave-labor camps set up by the Nazis for some 2,000 local Jews”
L94789: Poland | Międzyrzec Podlaski | est 1512 | 1942–1942 | pop 2 → 200 | high | https://iajgscemetery.org/eastern-europe/poland/miedzyrzec-podlaski | “Two survived in a hideout by the Rynek with no help”
L94790: Poland | Międzyrzec Podlaski | est 1512 | 1942–1942 | pop 3 → 200 | high | https://iajgscemetery.org/eastern-europe/poland/miedzyrzec-podlaski | “April 18: Mass grave of 3 Tzadakkim (Pejsach Raczko, Ber Roskin, Dawid Flinkier) buried”
L94791: Poland | Międzyrzec Podlaski | est 1512 | 1942–1942 | pop 40 → 200 | high | https://people.math.carleton.ca/~rhfischl/GENEALOGY/TRIPLE_LOVE_DVD/LEIPZIG_GROUP/EASTERN_EUROPE/MIEDZYRZEC/1D… | “April 19: Jews ordered to turn over 50 kg of gold; some 40 hostages murdered”
L94792: Poland | Międzyrzec Podlaski | est 1512 | 1943–1943 | pop 200 → 24 | high | https://iajgscemetery.org/eastern-europe/poland/miedzyrzec-podlaski | “May: 200 Jews who tried to escape transport to a camp were shot at the cemeteries”
```

##### Poland/Narol

**[WARTIME_COUNT]** 1648 rows use the Chmielnicki massacre / refugee numbers as population and ramp them over 231 years: 95246 10,000 -> 779 ('more than 10000 local Jews and refugees' when the town was stormed) and 95247 40,000 -> 779 ('40000 refugees from neighboring settlements'). Map shows ~39,000 Jews in 1650, 31,000 in 1700 and 14,000 in 1800 in a small town that had 200-300 Jews in 1629-1647 and 779 in 1880.

```text
L95246: Poland | Narol | est 1613 | 1648–1879 | pop 10000 → 779 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol2_00333.html | “During the Chmielnicki massacres, more than 10000 local Jews and refugees were in the city when it was stormed and massacred”
L95247: Poland | Narol | est 1613 | 1648–1879 | pop 40000 → 779 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/narol | “About 40000 refugees from neighboring settlements fled to Narol in fear of the Cossacks”
L95245: Poland | Narol | est 1613 | 1644–1647 | pop 300 → 10000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol2_00333.html | “The number of Jewish houses rose to sixty within fifteen years. ~300 Estimate based on families”
```

**[CHAIN_SUBSET]** Rows end/start at counts of events: 95249 (1900-1907) 1030 -> 3 and 95250 3 -> 734 (3 = a husband, wife and daughter murdered in a nearby village), 95252 (1924-1932) 734 -> 100 and 95254 100 -> 500 (100 = people left homeless by a fire; 500 = men demanded from Opoczno for the forced labour camp in 1940, 95258). Map shows 3 Jews in 1907-1908 and ~100 in 1932 (vs 734 in 1921-23), and 500 held in 1940.

```text
L95249: Poland | Narol | est 1613 | 1900–1907 | pop 1030 → 3 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol2_00333.html | “Jewish population”
L95250: Poland | Narol | est 1613 | 1908–1920 | pop 3 → 734 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol2_00333.html | “Jews who were residents of a village near Narol (a husband, wife, and their daughter) were murdered”
L95252: Poland | Narol | est 1613 | 1924–1932 | pop 734 → 100 | high | https://cdp.jewishgen.org/eastern-europe/poland/narol | “Jews accounted for 40% of all residents”
L95254: Poland | Narol | est 1613 | 1933–1940 | pop 100 → 500 | medium | https://www.jewishgen.org/yizkor/pinkas_poland/pol2_00333.html | “An elderly Jewish woman started a fire which destroyed 20 Jewish houses; 23 families (approximately 100 individuals) were left homeless”
L95258: Poland | Narol | est 1613 | 1940–1940 | pop 500 → — | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol1_00047.html | “August 1940: Authorities demanded 500 Jewish men from Opoczno to be sent to the Narol forced-labor camp”
```

##### Poland/Nisko

**[WARTIME_COUNT]** Nisko's Jewish population (409 in 1921, 439 in 1900) is overwritten by Nisko-Plan deportation figures. 95337 (1921-1938) ramps 409 -> 45000 (45,000 = Jews 'deported to the reservation' reported by newspapers), so the map shows 24,000 in 1930 and 45,000 in 1938; 95339 holds 45,000 for 1939, and 95340/95341 are transports of 4,000 and 1,600 Jews (from Mährisch-Ostrau, Vienna) sent to the camp. The town never had more than ~1,000 Jews.

```text
L95337: Poland | Nisko | est 1880 | 1921–1938 | pop 409 → 45000 | high | https://cdp.jewishgen.org/k9cr | “1921 census figure given in the page header (409); the same page's cemetery section says 499 - internal discrepancy, 499 not used”
L95339: Poland | Nisko | est 1842 | 1939–1939 | pop 45000 → 45000 | high | https://kehilalinks.jewishgen.org/lublin/Nisko_Plan.html | “Reports in the Luxemburger Wort and The Times stated that 45,000 Jews had been deported to the reservation by late 1939.”
L95340: Poland | Nisko | est 1842 | 1939–1939 | pop 4000 → 4000 | high | https://www.holocausthistoricalsociety.org.uk/contents/insidethereich/nisko.html | “The first transport of Jews left Mahrisch-Ostrau for a settlement near Nisko on October 12; thousands arrived and the vast majority of the original 4,000 deportees crossed into Soviet territory.”
L95341: Poland | Nisko | est 1842 | 1939–1939 | pop 1600 → 1600 | high | https://www.ehri-project.eu/new-online-edition-vienna-nowhere-nisko-deportations-1939/ | “1,600 Jewish men were deported from Vienna to Nisko between autumn 1939 and March 1940.”
```

##### Poland/Ostrowiec Świętokrzyski

**[WARTIME_COUNT]** 1941-1944 ramps 16,000 -> 200 (May 1945): map shows 5,467 in 1943 and 200 only in 1944, although the ghetto was liquidated in October 1942.

```text
L96237: Poland | Ostrowiec Świętokrzyski | est 1550 | 1941–1944 | pop 16000 → 200 | high | https://www.jewishgen.org/Yizkor/ostrowiec/oste046.html | “Refugees from Warsaw, Lodz and other large centers arrived in 1940-41, raising the number of Jewish inhabitants of Ostrowiec to 16,000 (includes refugees).”
```

**[RAMP_OVERRIDES_SOURCED]** 96228 (1765-1826) ramps 717 -> 1,064 and gives 859 in 1790 vs the 1790 census value of 427 (2.0x).

```text
L96228: Poland | Ostrowiec Świętokrzyski | est 1550 | 1765–1826 | pop 717 → 1064 | high | https://www.mounthebroncemetery.com/legacy/stories/view/?id=115 | “904 Jews in the wider area by 1765, of whom 717 lived within the town itself (this row uses the town figure).”
L96229: Poland | Ostrowiec Świętokrzyski | est 1550 | 1790–1790 | pop 427 → 427 | high | https://ojs.academicon.pl/np/article/download/7126/7842 | “1790 census of the Jews (Sandomierz voivodeship): 427 Jews in the town itself (osrodek), the kahal incl. villages had 611. Guldon, Table 3 (print p. 215), after Guldon and Stepkowski, Spis ludnosci 1790.”
```

##### Poland/Otwock

**[CHAIN_SUBSET]** 96317 (1940-41) starts at 1,500 = recent arrivals expelled when the ghetto was ordered, ends at 400 = youths demanded for Treblinka (96318); map drops from 13,500 (1939) to 1,500 in 1940 and 400 in 1941. 96319 (1942-44) ramps 8,000 (Aug 1942 deportation) -> 400, giving 4,200 in 1943 after the community was destroyed.

```text
L96317: Poland | Otwock | est 1920 | 1940–1941 | pop 1500 → 400 | medium | https://www.holocausthistoricalsociety.org.uk/contents/ghettosj-r/otwock.html | “On 26 September 1940, orders to establish a ghetto were received, and approximately 1,500 Jews who had resided in the town for less than six months were ordered to leave.”
L96318: Poland | Otwock | est 1920 | 1942–1944 | pop 400 → 400 | high | https://www.holocausthistoricalsociety.org.uk/contents/ghettosj-r/otwock.html | “In April 1942, the Germans demanded 400 youths from Otwock to help with the construction of the Treblinka death camp.”
L96319: Poland | Otwock | est 1920 | 1942–1944 | pop 8000 → 400 | high | https://zydziotwoccy.pl/2022/07/17/not-only-the-sand-2008/ | “On August 19, 1942, German occupation forces loaded some eight thousand Otwock Jews on a train to the Treblinka death camp.”
L96316: Poland | Otwock | est 1920 | 1939–1939 | pop 13500 → 1500 | high | https://www.holocausthistoricalsociety.org.uk/contents/ghettosj-r/otwock.html | “When Otwock was occupied by the Germans on 29 September 1939, there were 13,500 Jews in the townlet.”
```

##### Poland/Pajęczno

**[TEMPLATE]** Template series with generic comments ('Early Jewish settlement', 'Industrial growth', 'Peak population - over 3,000 Jews') overrides sourced points: 96406 (1800-1899, 400>1000) gives 448 in 1808 vs sourced 91 (4.9x) and 564 in 1827 vs 173 (3.3x); 96413 ramps 618 -> 3,000 (from template 96414) so the 1935 value is 2,580 while the Sept 1939 sourced count is 'more than 1,000'; 96414 shows 3,000 in 1939 (3x).

```text
L96404: Poland | Pajęczno | est 1600 | 1600–1699 | pop 50 → 150 | prob — | https://www.crarg.org/jewish-genealogy/pajeczno-poland.php | “Early Jewish settlement - community begins to form”
L96405: Poland | Pajęczno | est 1600 | 1700–1799 | pop 150 → 400 | prob — | https://www.crarg.org/jewish-genealogy/pajeczno-poland.php | “Community growth - regional development”
L96406: Poland | Pajęczno | est 1600 | 1800–1899 | pop 400 → 1000 | prob — | https://www.crarg.org/jewish-genealogy/pajeczno-poland.php | “Industrial growth - population expands”
L96410: Poland | Pajęczno | est 1600 | 1900–1919 | pop 1000 → 2000 | prob — | https://www.crarg.org/jewish-genealogy/pajeczno-poland.php | “Pre-war growth - thriving community”
L96412: Poland | Pajęczno | est 1600 | 1920–1920 | pop 2000 → 618 | prob — | https://www.crarg.org/jewish-genealogy/pajeczno-poland.php | “Peak population - over 3,000 Jews before Holocaust”
L96413: Poland | Pajęczno | est 1600 | 1921–1938 | pop 618 → 3000 | high | https://cdp.jewishgen.org/eastern-europe/poland/pajeczno | “Jewish population recorded.”
L96414: Poland | Pajęczno | est 1600 | 1939–1940 | pop 3000 → 2000 | prob — | https://www.crarg.org/jewish-genealogy/pajeczno-poland.php | “German occupation - ghetto established, mass deportations”
L96417: Poland | Pajęczno | est 1600 | 1942–1942 | pop 500 → 2000 | prob — | https://www.crarg.org/jewish-genealogy/pajeczno-poland.php | “Holocaust devastation - community destroyed”
```

**[WARTIME_COUNT]** 96419 (1943-1944) holds 2,000 (people locked in the church before deportation, Aug 1942), so the map shows 2,000 in 1943; 96421 holds '6 or 7 survivors' (7) from 1945 to 2026 (81 years).

```text
L96419: Poland | Pajęczno | est 1600 | 1943–1944 | pop 2000 → 0 | high | http://dialog.org.pl/szkola-dialogu/en/szkola/pajeczno-2/ | “More than 2,000 people rounded up and locked in the church for three days before transport to a death camp.”
L96421: Poland | Pajęczno | est 1600 | 1945–2026 | pop 7 → — | high | https://cdp.jewishgen.org/eastern-europe/poland/pajeczno | “6 or 7 Jews survived the camps and the war.”
L96420: Poland | Pajęczno | est 1600 | 1945–2023 | pop 0 → 0 | prob — | https://www.crarg.org/jewish-genealogy/pajeczno-poland.php | “Post-war period - no Jewish population remains”
```

##### Poland/Piotrków Trybunalski

**[WARTIME_COUNT]** 96715 (1942) is the April 1942 ghetto count of 16,469 'of whom 8,141 had come from other localities', and 96712 (1939-1942) ramps 10,000 -> 16,469; the map shows 14,300 in 1941 and 16,469 in 1942, higher than any pre-war figure (11,400).

```text
L96715: Poland | Piotrków Trybunalski | est 1501 | 1942–1942 | pop 16469 → 51 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/piotrkow | “Jewish population in the ghetto in April 1942; of whom 8,141 had come from other localities”
L96712: Poland | Piotrków Trybunalski | est 1501 | 1939–1942 | pop 10000 → 16469 | high | https://www.yadvashem.org/communities/piotrkow-trybunalski.html | “Jewish population on the eve of WWII and during the September 1939 occupation; a ghetto was established in October”
```

##### Poland/Praszka

**[TEMPLATE]** 1900-1944 is entirely template rows ('Pre-war growth', 'Peak population - over 3,000 Jews before Holocaust', 'German occupation', 'Holocaust devastation') with round numbers 1000/2000/3000/500, probability low, and 97012 (1897-1899) ramps the sourced 1,878 down to the template 1,000 (map: 1,000 in 1900 vs 1,878 in 1897).

```text
L97013: Poland | Praszka | est 1600 | 1900–1919 | pop 1000 → 2000 | low | https://www.crarg.org/jewish-genealogy/praszka-poland.php | “Pre-war growth - thriving community”
L97014: Poland | Praszka | est 1600 | 1920–1938 | pop 2000 → 3000 | low | https://www.crarg.org/jewish-genealogy/praszka-poland.php | “Peak population - over 3,000 Jews before Holocaust”
L97015: Poland | Praszka | est 1600 | 1939–1941 | pop 3000 → 500 | low | https://www.crarg.org/jewish-genealogy/praszka-poland.php | “German occupation - ghetto established, mass deportations”
L97016: Poland | Praszka | est 1600 | 1942–1944 | pop 500 → 0 | low | https://www.crarg.org/jewish-genealogy/praszka-poland.php | “Holocaust devastation - community destroyed”
```

**[TEMPLATE]** 97003 (1800-1807) is a template row starting at 400 ('Industrial growth') while the 1808 census gives 137 Jews; it shows 400 in 1800 and ~175 in 1806.

```text
L97003: Poland | Praszka | est 1600 | 1800–1807 | pop 400 → 137 | low | https://www.crarg.org/jewish-genealogy/praszka-poland.php | “Industrial growth - population expands”
```

##### Poland/Przemyśl

**[CONFLICT]** 97123 gives 18 'Jewish population' in 1571 but the Pinkas has 169 head-tax payers in 1563 and 206 in 1578 (97122, 97125); 18 is the number of families in 1542 (97118, ~90). Map shows 18 in 1571.

```text
L97123: Poland | Przemyśl | est 1085 | 1571–1571 | pop 18 → 18 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol2_00424.html | “Jewish population of Przemyśl in 1571 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation.”
L97122: Poland | Przemyśl | est 1085 | 1563–1563 | pop 169 → 169 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol2_00424.html | “1563: 169 Jewish head-tax payers ('taxpayer records of the head tax: 169 people in 1563 and 206 in 1578'); Pinkas HaKehillot Polin vol. II, chapter Przemysl (JewishGen translation).”
L97125: Poland | Przemyśl | est 1085 | 1578–1578 | pop 206 → 206 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol2_00424.html | “1578: 206 Jewish head-tax payers (same sentence of the Pinkas chapter as the 1563 figure of 169).”
```

**[RAMP_OVERRIDES_SOURCED]** 1785-1856 ramp 1,750 -> 4,180 gives 2,195 in 1798 vs the sourced 1,426 (1.54x), and 3,290 in 1830 vs 2,298 (1.43x).

```text
L97136: Poland | Przemyśl | est 1085 | 1785–1856 | pop 1750 → 4180 | high | https://sztetl.org.pl/en/node/21611 | “Demography table: 1,750 Jews.”
```

##### Poland/Radom

**[CHAIN_SUBSET]** 97472 (1827-1829, 1000>120) ends at 120 and 97473 (1830-1837) starts at 120 = '24 Jewish families in nearby Dzierzkow' x5, a different village. Map drops Radom from 1,000 (1826) to 120 in 1829-30 (566 in 1833) while 1838 is 1,161 and 1857 is 1,618.

```text
L97472: Poland | Radom | est 1568 | 1827–1829 | pop 1000 → 120 | high | https://www.jewishgen.org/Yizkor/radom/rad017.html | “Jews in Radom (23% of total population)”
L97473: Poland | Radom | est 1568 | 1830–1837 | pop 120 → 1161 | high | https://www.jewishgen.org/Yizkor/radom/rad017.html | “Estimate based on families. 24 Jewish families in nearby Dzierzkow”
```

**[CHAIN_SUBSET]** 97461/97462 (1765-1779) end at 5 and 97463 starts at 5 = the family of five of the first Jew admitted in 1780, so the map falls from 65 to 5 in 1779.

```text
L97461: Poland | Radom | est 1568 | 1765–1779 | pop 65 → 5 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00530.html | “Jews in Radom”
L97462: Poland | Radom | est 1568 | 1765–1779 | pop 67 → 5 | high | https://www.jewishgen.org/Yizkor/radom/rad017.html | “Jews lived in the peripheral and surrounding villages”
L97463: Poland | Radom | est 1568 | 1780–1786 | pop 5 → 91 | high | https://www.jewishgen.org/Yizkor/radom/rad017.html | “First Jew (Zelig Szmulowicz) received permission to settle in the city with his family of five”
```

**[CONFLICT]** 1812-1814: 97466 has 34 (Pinkas) and 97467 has 340 (sztetl), a 10x difference (34 looks like a dropped digit); 97464 (1787-1811) ramps 91 -> 34 toward it, which contradicts the 1790 census (125).

```text
L97464: Poland | Radom | est 1568 | 1787–1811 | pop 91 → 34 | high | https://sztetl.org.pl/en/node/21646 | “Demography table: 91 Jews.”
L97466: Poland | Radom | est 1568 | 1812–1814 | pop 34 → 413 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00530.html | “Jews in Radom”
L97467: Poland | Radom | est 1568 | 1812–1814 | pop 340 → 413 | high | https://sztetl.org.pl/en/node/21646 | “Demography table: 340 Jews.”
```

**[CHAIN_SUBSET]** 97494 (1942-1943) starts at 40 (a leftover pop_end of the 1941 row) and ends at 2,124 (a count of arrestees); the map shows 40 Jews in 1942 when the ghetto still held ~30,000 until the August 1942 liquidation.

```text
L97491: Poland | Radom | est 1568 | 1941–1941 | pop 32000 → 40 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00530.html | “Spring about 32,000 Jews in Radom (including hundreds of deportees from Przytyk)”
L97494: Poland | Radom | est 1568 | 1942–1943 | pop 40 → 2124 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00530.html | “February first aktion in ghetto resulting in arrests sent to Auschwitz”
```

##### Poland/Radomsko

**[TEMPLATE]** Hand-typed template rows with generic comments ('Early Jewish settlement', 'Community growth', 'Industrial development', 'Peak population - over 12,000 Jews') carry round numbers: 97501 (1600-1799) ramps 500 -> 1500 (1,500 in 1799) although the 1808 census row says 0 Jews in the city proper and 1827 has 369; 97515 says 'over 12,000' with 8,000; 97526 ramps 0 -> 100 over 1945-1966 under 'no Jewish population remains'.

```text
L97500: Poland | Radomsko | est 1500 | 1500–1599 | pop 200 → 500 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “Early Jewish settlement - community begins to form”
L97501: Poland | Radomsko | est 1500 | 1600–1799 | pop 500 → 1500 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “Community growth - regional center”
L97502: Poland | Radomsko | est 1500 | 1800–1807 | pop 1500 → 0 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “Industrial development - population expands”
L97512: Poland | Radomsko | est 1500 | 1900–1909 | pop 4000 → 6243 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “Pre-war growth - major Jewish center”
L97515: Poland | Radomsko | est 1500 | 1920–1920 | pop 8000 → 7774 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “Peak population - over 12,000 Jews before Holocaust”
L97520: Poland | Radomsko | est 1500 | 1939–1941 | pop 12000 → 2000 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “German occupation - ghetto established, mass deportations”
L97524: Poland | Radomsko | est 1500 | 1942–1944 | pop 2000 → 0 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “Holocaust devastation - community destroyed”
L97526: Poland | Radomsko | est 1500 | 1945–1966 | pop 0 → 100 | prob — | https://www.crarg.org/jewish-genealogy/radomsko-poland.php | “Post-war period - no Jewish population remains”
```

**[COMMENT_MISMATCH]** 97513 (1900-1909) 'Jewish population recorded as 11,767' is the total population of Radomsko (97510 gives 5,054 Jews = 43% of 11,761; 97511 'Jews of 11,767 inhabitants'). Map shows 11,767 Jews in 1900 (2.3x the 1897 count) declining to 6,243. 97511 (1897-1899) gives 1,162 Jews, which is the 1857 figure.

```text
L97513: Poland | Radomsko | est 1500 | 1900–1909 | pop 11767 → 6243 | high | https://cdp.jewishgen.org/eastern-europe/poland/radomsko | “Jewish population recorded as 11,767.”
L97511: Poland | Radomsko | est 1500 | 1897–1899 | pop 1162 → 4000 | high | https://sztetl.org.pl/en/node/21649 | “Demography table: 1,162 Jews of 11,767 inhabitants.”
```

**[COMMENT_MISMATCH]** 97529 (1967) is '100 Radomskowers who passed away in Israel' in a memorial book, not residents; 97527/97528 (1945-1966) ramp 300/200 -> 100 toward it, so the map shows ~100-300 Jews through 1967.

```text
L97529: Poland | Radomsko | est 1500 | 1967–1967 | pop 100 → — | high | https://www.jewishgen.org/yizkor/working/static-lists.html | “Memorial book lists 100 Radomskowers who passed away in Israel.”
L97527: Poland | Radomsko | est 1500 | 1945–1966 | pop 300 → 100 | high | https://1943.pl/en/aktualnosci/przedwojenne-zycie-zydow-w-skali-calego-miasta/ | “A maximum of 300 Jews survived the Holocaust.”
L97528: Poland | Radomsko | est 1500 | 1945–1966 | pop 200 → 100 | high | https://lareviewofbooks.org/article/a-day-in-radomsko | “Only a couple of hundred Jews survived WWII.”
```

##### Poland/Sosnowiec

**[CHAIN_SUBSET]** 1940-1941 rows start at 30 (30 men in the Jewish militia) and 61 (34 boys + 27 girls in a group), so the map shows 30-61 Jews in 1940 after 28,000 in 1939; the 6,500 end is unsourced.

```text
L98789: Poland | Sosnowiec | est 1800 | 1940–1941 | pop 30 → 6500 | high | https://www.jewishgen.org/yizkor/zaglembia/zag060E.html | “The militia in Sosnowiec had been organized in June 1940, and in August of the same year it numbered 30 men”
L98790: Poland | Sosnowiec | est 1899 | 1940–1941 | pop 61 → 6500 | high | https://www.jewishgen.org/yizkor/zaglembia/zag060E.html | “A group of 34 Jewish boys and 27 Jewish girls settled there”
L98786: Poland | Sosnowiec | est 1801 | 1939–1939 | pop 28000 → 30 | medium | https://collections.ushmm.org/search/catalog/pa1084323#download-licensing | “On the eve of World War II, Sosnowiec supported a Jewish community of approximately 28,000.”
```

**[WARTIME_COUNT]** 98793 (1943-1951) ramps 1,000 (Jews held in the labour camp after the ghetto liquidation) -> 3 (3 pall-bearers at a funeral, 98794): map shows 751 in 1945 and 377 in 1948, then 98794 holds 3 for 1952-2026 (2021 census gives 64). Pall-bearers are not a population count and the 1943 camp was liquidated in 1944.

```text
L98793: Poland | Sosnowiec | est 1801 | 1943–1951 | pop 1000 → 3 | high | https://collections.ushmm.org/search/catalog/pa1084323#download-licensing | “Some one thousand Jews remained after the ghetto liquidation and were settled in the Sosnowiec labor camp.”
L98794: Poland | Sosnowiec | est 1800 | 1952–2026 | pop 3 → — | high | https://www.jewishgen.org/yizkor/zaglembia/ZagPh533.html | “Pall bearers : Josef Tzvi Heller, Majer Lancman and David Zicher from the survivors of Sosnowiec”
```

##### Poland/Suwałki

**[CHAIN_SUBSET]** The 1862-1896 series is chained through soldier/worker counts: 99155 ends at 14 (14 Jewish soldiers), 99156 14>54 (54 workers), 99157 54>47, 99158 47>130 (47/130 soldiers), 99159 130 -> 7,483, 99161 (1894) starts at 100 (soldiers). Map shows 14 Jews in 1865-66, ~50 through 1883, 47-130 in 1884-89 and 100 in 1894 for a community of 6,400-7,500 (sourced 7,483 in 1893).

```text
L99155: Poland | Suwałki | est 1808 | 1862–1865 | pop 7165 → 14 | high | https://digitalarchive-assets.ushmm.org/pdf/bib276692_001_001.pdf | “The Jewish population was recorded at 7165.”
L99156: Poland | Suwałki | est 1808 | 1866–1866 | pop 14 → 54 | high | https://www.jewishgen.org/yizkor/suwalki1/suw097.html | “14 Jewish soldiers were freed from the draft board by local communal workers who raised 5000 rubbles.”
L99157: Poland | Suwałki | est 1808 | 1867–1883 | pop 54 → 47 | high | https://digitalarchive-assets.ushmm.org/pdf/bib276692_001_001.pdf | “There were 12 Jewish-owned factories in the Suwalk area, employing 54 Jewish workers.”
L99158: Poland | Suwałki | est 1808 | 1884–1888 | pop 47 → 130 | high | https://www.jewishgen.org/yizkor/suwalki1/suw097.html | “There were 47 Jewish soldiers stationed in Suwalk.”
L99159: Poland | Suwałki | est 1808 | 1889–1892 | pop 130 → 7483 | high | https://www.jewishgen.org/yizkor/suwalki1/suw097.html | “There were 130 Jewish soldiers stationed in Suwalk.”
L99161: Poland | Suwałki | est 1808 | 1894–1896 | pop 100 → 7458 | high | https://www.jewishgen.org/yizkor/suwalki1/suw097.html | “100 Jewish soldiers were stationed in Suwalk; Yehoshua Dov Burak donated a building for a Moshav Zekenim.”
```

**[CHAIN_SUBSET]** 99165 (1931-1938) ramps 5,811 -> 31 (31 Jewish refugees in no man's land, 99166), so the map shows 2,508 in 1935 and 31 in 1938-39, then 31 -> 13 through 1954 (13 = Jews in 1955).

```text
L99165: Poland | Suwałki | est 1808 | 1931–1938 | pop 5811 → 31 | high | https://digitalarchive-assets.ushmm.org/pdf/bib276692_001_001.pdf | “The Jewish population was 5811.”
L99166: Poland | Suwałki | est 1808 | 1939–1954 | pop 31 → 13 | high | https://en.we-refugees-archive.org/chapters/the-suwalki-no-mans-land/ | “On November 5, a group of 31 Jewish refugees caught in no man's land at the border close to Suwalki was inspected.”
```

**[CONFLICT]** 99163 (1908-1930) ramps 13,002 -> 5,811 and gives 8,750 in 1921 vs the 1921 census value of 5,747 (1.5x); 13,002 is not consistent with 7,458 (1897) and 5,747 (1921).

```text
L99163: Poland | Suwałki | est 1808 | 1908–1930 | pop 13002 → 5811 | high | https://digitalarchive-assets.ushmm.org/pdf/bib276692_001_001.pdf | “The Jewish population was counted at 13002.”
L99164: Poland | Suwałki | est 1808 | 1921–1921 | pop 5747 → 5747 | high | https://polona.pl/item/skorowidz-miejscowosci-rzeczypospolitej-polskiej-opracowany-na-podstawie-wynikow,NjcwOT… | “1921 Polish census (30 Sept 1921, present population excl. military), by religion: 5747 Mosaic (mojzeszowego) of 16780 inhabitants (34.2%); nationality 'Jewish' (zydowska) 4804. Skorowidz miejscowosci RP vol. 5 (Bialystok voivodeship), powiat Suwałki, gmina Zalesie, entry 'Suwałki' (m-to), Polona page 100.”
```

##### Poland/Szczecin

**[CHAIN_SUBSET]** 99354 (1942-1945) ramps 79 -> 30,951 (the 1946 figure of the next row), so the map shows 10,400 Jews in 1943 and 20,700 in 1944 in German Stettin where only 79 Jews remained. 99353 (1940-41) begins at 1,300 which is the number deported on 12-13 Feb 1940 (the remaining community was a fraction of that).

```text
L99354: Poland | Szczecin | est 1261 | 1942–1945 | pop 79 → 30951 | high | https://sztetl.org.pl/en/node/21948 | “Demography table: 79 Jews.”
L99353: Poland | Szczecin | est 1261 | 1940–1941 | pop 1300 → 79 | medium | https://www.jewishgen.org/databases/holocaust/0188_lublin_Stettin.html | “During the night of February 12 to 13, approximately 1,300 Stettin Jews (including intermarried families and converts) were deported by the Nazis and transported by train to the Lublin area.”
```

**[WARTIME_COUNT]** 30,951 'Jews (42%)' in 1946 (more than 6x the 1960 value of 3,800 = 1.4% of 273,000) looks like a peak/transit count of Jewish repatriates and Bricha emigrants rather than residents; it is ramped to 3,800 over 1946-1959: map shows 22,600 in 1950.

```text
L99355: Poland | Szczecin | est 1261 | 1946–1959 | pop 30951 → 3800 | high | https://sztetl.org.pl/en/node/21948 | “Demography table: 30,951 Jews (42,0%).”
```

##### Poland/Szydłowiec

**[WARTIME_COUNT]** Ghetto counts that include deportees/refugees are the population: 99533 (1941) 16,300 'raised by others sent here', 99536 (1942) 15,000 herded in before the deportation, 99532 (1940) 12,000; pre-war Jews were 7,000-7,200. The map shows 12,000-16,300 for 1940-1942.

```text
L99533: Poland | Szydłowiec | est 1580 | 1941–1941 | pop 16300 → 5000 | high | https://cdp.jewishgen.org/eastern-europe/poland/szydlowiec | “The Nazis created a ghetto in the city with local Jews and others sent here, raising the number to 16,300 Jews.”
L99536: Poland | Szydłowiec | est 1580 | 1942–1942 | pop 15000 → 0 | high | https://www.jewishgen.org/yizkor/Szydlowiec/szy019.html | “By mid-1942, over 15,000 Jews were herded together and driven into Szydlowiec before the deportation.”
L99532: Poland | Szydłowiec | est 1580 | 1940–1940 | pop 12000 → 16300 | medium | https://www.jewishgen.org/yizkor/Szydlowiec/szy019.html | “In 1940-1941, Jewish refugees poured into Szydlowiec, bringing the number to approximately 12,000.”
```

**[RAMP_OVERRIDES_SOURCED]** 99515 (1765-1826) ramps 902 -> 2,049 giving 1,372 in 1790 vs the 1790 census value of 172 in the town (8x).

```text
L99515: Poland | Szydłowiec | est 1580 | 1765–1826 | pop 902 → 2049 | high | https://cdp.jewishgen.org/eastern-europe/poland/szydlowiec | “Jewish population was 902.”
L99516: Poland | Szydłowiec | est 1580 | 1790–1790 | pop 172 → 172 | high | https://ojs.academicon.pl/np/article/download/7126/7842 | “1790 census of the Jews (Sandomierz voivodeship): 172 Jews in the town itself (osrodek), the kahal incl. villages had 540. Guldon, Table 3 (print p. 216), after Guldon and Stepkowski, Spis ludnosci 1790.”
```

**[HELD_FLAT]** 'Estimated Jewish population in July 1945' (200) is ramped to 0 until 1982 (the 1983 row says no Jews remained): map shows 119 Jews in 1960 and 65 in 1970 for a community that left within a few years.

```text
L99538: Poland | Szydłowiec | est 1580 | 1945–1982 | pop 200 → 0 | medium | https://hmh.mwmdigital.com/community/23/ | “Estimated Jewish Population in July 1945.”
```

##### Poland/Tarnów

**[WARTIME_COUNT]** 99691 (1940-1946) holds the ghetto figure of 40,000 (which includes deportees from the region; 99690 gives 25,000 Jews in 1939) and ramps it to 3,000 (1947 returnees) by 1946: map shows 40,000 in 1940, 21,500 in 1943 and 9,200 in 1945, although the ghetto was destroyed in Sept 1943 and the Jewish community did not exist in 1944-45.

```text
L99691: Poland | Tarnów | est 1445 | 1940–1946 | pop 40000 → 3000 | high | https://www.it.tarnow.pl/wp-content/uploads/2019/03/Tarnow-miniguide-IYP-Rus.pdf | “40000 Jews were enclosed in the city ghetto; more than 10000 were shot and the rest deported to Belzec death camp”
L99690: Poland | Tarnów | est 1445 | 1939–1939 | pop 25000 → 40000 | high | https://www.it.tarnow.pl/wp-content/uploads/2019/03/Tarnow-miniguide-IYP-Rus.pdf | “Jewish population reached 25000, almost half of the total population”
```

**[COMMENT_MISMATCH]** The 1947 value 3,000 is 'Jews from Tarnów and neighboring towns' - a regional count used as the town population; no numeric row covers 1948-2020.

```text
L99692: Poland | Tarnów | est 1445 | 1947–1947 | pop 3000 → — | high | https://www.jewishgen.org/yizkor/tarnow/tar1_168.html | “Around 3000 Jews from Tarnów and neighboring towns had returned by 1947”
```

##### Poland/Tomaszów Mazowiecki

**[GAP]** No row covers 1858-1920: the series jumps from 1,879 (1857, a single year) to 10,070 (1921), so the town disappears for 63 years during its fastest growth.

```text
L99791: Poland | Tomaszów Mazowiecki | est 1857 | 1857–1857 | pop 1879 → 1879 | high | https://pbio.akademia.mil.pl/wp-content/scans/2024/Partia19/03_PDF/52102_2.pdf#page=30 | “1857: 1,879 Jews among 5,136 inhabitants (36.6 per cent) in the town; B. Wasiutynski's table of towns, 1857 column, print p. 28 (pdf p. 30). In the book the 1808 column is taken from H. Grossman (Kwartalnik Statystyczny 1925), the 1827 column from A. Rodecki, 'Obraz jeograficzno-statystyczny Krolestwa Polskiego' (Warsaw 1830), the 1857 column from the calend…”
L99792: Poland | Tomaszów Mazowiecki | est 1815 | 1921–1930 | pop 10070 → 11310 | high | https://cdp.jewishgen.org/eastern-europe/poland/tomaszow-mazowiecki | “Jewish population recorded at 35.6 percent of the town's total”
```

**[WARTIME_COUNT]** 1940-1944 ramps 16,000 (ghetto count) -> 250: map shows 4,190 in 1943 and 250 in 1944 although the ghetto was liquidated in Oct 1942.

```text
L99796: Poland | Tomaszów Mazowiecki | est 1815 | 1940–1944 | pop 16000 → 250 | high | https://cdp.jewishgen.org/eastern-europe/poland/tomaszow-mazowiecki | “A ghetto was created in December, eventually housing 16000 Jews”
```

##### Poland/Turobin

**[COMMENT_MISMATCH]** 100001 (1420-1563) puts 'the pre-war community of 3,000 Jewish souls' (a 1939 figure) at the 15th c. and ramps it to 300: the map shows 3,000 Jews in 1420 and about 1,490 in 1500. 100012 (1939) is derived as 40-45% of 5,000; 100011 (1921-1938) ramps 965 -> 2,000 toward it.

```text
L100001: Poland | Turobin | est 1420 | 1420–1563 | pop 3000 → 300 | high | https://www.jewishgen.org/Yizkor/turobin/tur317.html | “Refers to the pre-war community of 3,000 Jewish souls”
L100012: Poland | Turobin | est 1420 | 1939–1939 | pop 2000 → — | medium | https://www.jewishgen.org/Yizkor/turobin/tur317.html | “Estimated Jewish population based on 40-45% of the 5,000 general population”
L100011: Poland | Turobin | est 1420 | 1921–1938 | pop 965 → 2000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00241.html | “Jewish population of Turobin in 1921 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation (total population of the town: 1,592).”
```

##### Poland/Wrocław

**[EXPULSION_RAMP]** 1455-1746 ramps 0 -> 532 although the comment says the 1455 privilege excluded Jews from the city (valid until 1744) 'no resident Jews'. Map shows 82 Jews in 1500, 265 in 1600 and 448 in 1700 for a period of documented exclusion; the only real points are 215 (1707), 656-775 (1722-25).

```text
L100928: Poland | Wrocław | est 1100 | 1455–1746 | pop 0 → 532 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/breslau | “1455 imperial privilege excluded Jews from the city except fair visitors (valid de jure until 1744): no resident Jews”
```

**[WARTIME_COUNT]** 100961 (1939-1945) ramps 20,000 -> 0 (20,000 is the 1933 membership figure; the same year's other row says 10,309): map shows 16,700 in 1940 and 10,000 in 1942, i.e. 1.9x the 1939 value, and decays gradually to 1945 instead of after the 1941-42 deportations.

```text
L100961: Poland | Wrocław | est 1100 | 1939–1945 | pop 20000 → 0 | high | https://chidusz.com/katarzyna-andersz-wroclaw-jewish-community-poland-jewish-life-white-stork-synagogue-bresla… | “The German Jewish Community, counting over 20,000 members, ceased to exist with the beginning of World War II.”
L100960: Poland | Wrocław | est 1100 | 1939–1945 | pop 10309 → 0 | high | https://jewishvirtuallibrary.org/breslau | “Jewish population of Breslau (Wrocław) fell to 10,309 in 1939.”
```

**[CONFLICT]** 100973 (1974-1989) ramps 3,000 -> 70 (map: 1,828 in 1980) although its own comment says the figure 'conflicts with the few hundred after 1968' (100971 comment: only a few hundred remained after 1968). 100971 ramps 4,500 -> 3,000 over 1961-1973.

```text
L100971: Poland | Wrocław | est 1100 | 1961–1973 | pop 4500 → 3000 | high | https://opus4.kobv.de/opus4-euv/files/967/Kretschmann-2015-Juden_in_Breslau.pdf | “1961 still 4500 Jews in Breslau; after the 1968 campaign only a few hundred remained (review of Friedla 2015)”
L100973: Poland | Wrocław | est 1100 | 1974–1989 | pop 3000 → 70 | high | https://jguideeurope.org/en/region/poland/wroclaw/ | “In 1974 there were 3000 Jews in Wroclaw (source figure; conflicts with the few hundred after 1968 in the Kretschmann review)”
```

##### Poland/Włocławek

**[WARTIME_COUNT]** 1939-1968 ramps 13,600/13,500 -> 0: map shows 8,440 in 1950 and 3,750 in 1960 for a community destroyed in 1939-42. Note 13,600 is derived (nearly 20% of 68,000, 101170).

```text
L101170: Poland | Włocławek | est 1800 | 1939–1968 | pop 13600 → 0 | high | https://uncoveringjewishheritage.com/category/poland/wloclawek/page/2/ | “Jews comprised nearly 20% of the city's 68,000 residents prior to World War II.”
L101171: Poland | Włocławek | est 1803 | 1939–1968 | pop 13500 → 0 | medium | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/wloclawek | “Approx. 13500 out of general population of 60000 at outbreak of WWII; community swelled by refugees from neighbouring communities”
```

**[CONFLICT]** 101155 (1803-1819) 208 vs 101156 (1808) 4 Jews (Wasiutynski), 50x; the map shows the higher 208 for the early 1800s while the 1827 value is 343.

```text
L101155: Poland | Włocławek | est 1803 | 1803–1819 | pop 208 → 218 | high | https://www.jewishvirtuallibrary.org/wloclawek | “Jewish population; source says Jews began to settle at the beginning of the 19th century”
L101156: Poland | Włocławek | est 1803 | 1808–1808 | pop 4 → 4 | high | https://pbio.akademia.mil.pl/wp-content/scans/2024/Partia19/03_PDF/52102_2.pdf#page=23 | “1808: 4 Jews among 2,326 inhabitants (0.2 per cent) in the town; B. Wasiutynski's table of towns, 1808 column, print p. 21 (pdf p. 23). In the book the 1808 column is taken from H. Grossman (Kwartalnik Statystyczny 1925), the 1827 column from A. Rodecki, 'Obraz jeograficzno-statystyczny Krolestwa Polskiego' (Warsaw 1830), the 1857 column from the calendar of…”
```

##### Poland/Włoszczowa

**[TEMPLATE]** Template rows ('Community growth', 'Peak population - over 6,000 Jews before Holocaust'): 101208 (1700-1799) 300>800 gives 755 in 1790 vs the sourced 144 (5.2x). 101223 (1939) 6,000 vs 2,700 sourced (2.2x), and 101222 ends at 6,000 (2,910 in 1921, the ramp 2,910 -> 6,000 gives 5,800 in 1937); 101227 holds 1,000 in 1942 vs the labour camp of 180.

```text
L101208: Poland | Włoszczowa | est 1600 | 1700–1799 | pop 300 → 800 | prob — | https://www.crarg.org/jewish-genealogy/wloszczowa-poland.php | “Community growth - regional development”
L101222: Poland | Włoszczowa | est 1600 | 1921–1938 | pop 2910 → 6000 | high | https://cdp.jewishgen.org/eastern-europe/poland/wloszczowa | “Jewish population was 2910 (53.1% of the total population).”
L101223: Poland | Włoszczowa | est 1600 | 1939–1941 | pop 6000 → 1000 | prob — | https://www.crarg.org/jewish-genealogy/wloszczowa-poland.php | “German occupation - ghetto established, mass deportations”
L101221: Poland | Włoszczowa | est 1600 | 1920–1920 | pop 4000 → 2910 | prob — | https://www.crarg.org/jewish-genealogy/wloszczowa-poland.php | “Peak population - over 6,000 Jews before Holocaust”
L101227: Poland | Włoszczowa | est 1600 | 1942–1944 | pop 1000 → 0 | prob — | https://www.crarg.org/jewish-genealogy/wloszczowa-poland.php | “Holocaust devastation - community destroyed”
```

##### Poland/Zabrze

**[CHAIN_SUBSET]** 101280 (1860-1871) ramps 300 ('in Zabrze and vicinity') -> 70 and 101282 (1872-1930) starts at 70 = members of the burial society, ramping to 1,200: map shows 70 in 1871-72 and 615 in 1900 (vs 216 in 1861).

```text
L101280: Poland | Zabrze | est 1771 | 1860–1871 | pop 300 → 70 | high | https://jewishgen.org/yizkor/Zabrze/zab001.html | “By 1860, there were about 300 Jews in Zabrze and vicinity”
L101282: Poland | Zabrze | est 1771 | 1872–1930 | pop 70 → 1200 | high | https://jewishgen.org/yizkor/Zabrze/zab001.html | “The Chevra Kadisha or Jewish burial society had about 70 members”
```

**[CHAIN_SUBSET]** 101283 (1931-1937) ramps 1,200 -> 350 and 101284 (1938) starts at 350 = Jews arrested by the Gestapo, so 1938 shows 350 (vs 554 in May 1939).

```text
L101283: Poland | Zabrze | est 1771 | 1931–1937 | pop 1200 → 350 | high | https://jewishgen.org/yizkor/Zabrze/zab001.html | “The Jewish population reached 1200 people”
L101284: Poland | Zabrze | est 1771 | 1938–1938 | pop 350 → 554 | high | https://jewishgen.org/yizkor/Zabrze/zab001.html | “The Gestapo arrested 350 Jews and kept them in detention, sending 95 to Buchenwald the next day”
```

##### Poland/Zamość

**[CHAIN_SUBSET]** 101417 (1827-1845) ramps 2,874 -> 70 and 101419 starts at 70 = 14 families of an agricultural colony in Zdanów (a different place). Map shows 1,472 in 1836, 70 in 1845-46, 1,146 in 1850 vs 2,490 (1856) and 2,874 (1827).

```text
L101417: Poland | Zamość | est 1550 | 1827–1845 | pop 2874 → 70 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol7_00203.html | “Jewish population of Zamosc in 1827 per the Pinkas HaKehillot (Yad Vashem) chapter, JewishGen translation (total population of the town: 5,414).”
L101419: Poland | Zamość | est 1550 | 1846–1855 | pop 70 → 2490 | high | https://www.jewishgen.org/Yizkor/zamosc1/zam163.html | “Estimate based on families. 14 Jewish families established an agricultural colony in Zdanów near Zamość.”
```

**[GAP]** No row covers 1940-2020 (the 14,000 of 1939 is a single-year row), so the community vanishes from 1940 on, including the 1940-42 ghetto period.

```text
L101447: Poland | Zamość | est 1550 | 1939–1939 | pop 14000 → 14000 | medium | https://www.jewishgen.org/yizkor/zamosc1/zam009.html | “Estimated between 13,000 and 15,000 Jews lived in Zamość before the outbreak of the Second World War.”
```

#### Ukraine, Belarus, Russia, Baltics, Caucasus and Central Asia — 69 findings in 35 towns

##### Azerbaijan/Baku

**[INFLATED_DEFINITION]** From 2010 the town carries the 'National Jewish population' of Azerbaijan (6400 -> 17400 -> 30000, '95% in Baku'). This is a country total of persons with Jewish ancestry, ramped and held to 2026, while the censuses show 6,056 (2009) and 2,277 (2019, row 3415). The map shows 30,000 in 2020, 13x the 2019 census.

```text
L3410: Azerbaijan | Baku | est 586 | 2010–2011 | pop 6400 → 17400 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Azerbaijan | “National Jewish population”
L3412: Azerbaijan | Baku | est 586 | 2012–2015 | pop 17400 → 30000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Azerbaijan | “National Jewish population, 95% in Baku”
L3413: Azerbaijan | Baku | est 586 | 2016–2020 | pop 30000 → 30000 | high | https://www.hidabroot.org/article/1182402 | “National Jewish population”
L3417: Azerbaijan | Baku | est 586 | 2020–2021 | pop 30000 → — | high | https://themedialine.org/by-region/we-feel-safer-here-than-in-europe-unique-jewish-muslim-ties-in-shiite-major… | “National Jewish population”
L3419: Azerbaijan | Baku | est 586 | 2023–2025 | pop 30000 → 30000 | high | https://www.jns.org/jns/azerbaijan/23/6/7/293388/ | “National Jewish population”
L3421: Azerbaijan | Baku | est 586 | 2026–2026 | pop 30000 → 30000 | estimate | Estimate: carried forward from 2023, not a source | “Estimate, not a measurement: the last sourced count for this town is 30,000 in 2023 (https://www.jns.org/jns/azerbaijan/23/6/7/293388/); no newer count was found, so the same number is carried forward to 2026.”
```

##### Belarus/Brest

**[CONFLICT]** Row 1921-1922 ramps 15630 (1921 census) -> 36000 (from '60% of a population of 60,000' in the next row). The map shows 36,000 in 1922-23 against 15,630 in 1921 and 21,796 in 1929 (Pinkas/city council). 36000 is 2.3x the 1921 and 1.65x the 1929 figures.

```text
L4001: Belarus | Brest | est 1341 | 1921–1922 | pop 15630 → 36000 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol5_00226.html | “Recorded in 1921 Census”
L4002: Belarus | Brest | est 1341 | 1923–1928 | pop 36000 → 21796 | high | https://www.jewishgen.org/yizkor/ybip/YBIP_brest.html | “Jews made up 60% of Brest's population of 60,000”
```

##### Belarus/Gomel

**[CONFLICT]** Rows 1765-1846: 658 (EJ souls) vs 3425 (685 families x5, comment itself suspects a digit transposition 658/685). 5.2x difference at 1765; the map shows the higher 3425 declining to 2373 by 1847.

```text
L4420: Belarus | Gomel | est 1537 | 1765–1846 | pop 658 → 2373 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/gomel | “Jews in the city (EJ: 'By 1765 there were 658 Jews living in the city'); ЕЭБЕ also gives 658 souls in the kahal district. KehilaLinks gives 685 families instead”
L4421: Belarus | Gomel | est 1537 | 1765–1846 | pop 3425 → 2373 | high | https://kehilalinks.jewishgen.org/homyel/gomel_history.html | “Estimate based on families: 685 families x5 (KehilaLinks 'By 1765 there were 685 jewish families living in the city'); conflicts with the 658-persons figure of EJ and ЕЭБЕ - possibly a transposition”
```

**[WARTIME_COUNT]** Row 1941-1958 ramps the summer-1941 count 44000 to 25000 (1959 census). The map shows 40,600 in 1944 and 33,900 in 1950 although the ghettos were destroyed in the 1941-43 occupation (row 4435).

```text
L4436: Belarus | Gomel | est 1537 | 1941–1958 | pop 44000 → 25000 | high | https://www.jewishgen.org/belarus/newsletters/gomel/GomelGhettos/index.html | “Jewish population had reached at least 44,000 by summer 1941”
```

**[INFLATED_DEFINITION]** 8000 is held 1999-2026 while the 1999 census gives 4,029 (row 4443). 8000 exceeds DellaPergola's national core for all of Belarus (6,000, 2023) and the map shows it in 2020.

```text
L4444: Belarus | Gomel | est 1537 | 1999–2026 | pop 8000 → — | high | https://www.jewishgen.org/belarus/newsletters/minsk/RisaTrip/index.html | “8,000 Jews in Gomel, community headed by 70-year-old Leonard Diamondstein”
```

##### Belarus/Grodno

**[RAMP_OVERRIDES_SOURCED]** Rows 1560-1886 ramp 1000 -> 27601 (the 1887 value) over 326 years. Interpolated: 1766 = 17,810 vs sourced 255 (70x), 1794 = 20,095 vs 2,780 (7x), 1816 = 21,889 vs 8,422 (2.6x), 1859 = 25,398 vs 10,300 (2.5x). The map shows the ramp and hides all sourced points.

```text
L4503: Belarus | Grodno | est 1350 | 1560–1886 | pop ~300 → 27601 | low | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Grodno | “Wikipedia: 60 Jewish families in 1560; households x5 (estimate based on families). Jewish street with synagogue and hospital.”
L4504: Belarus | Grodno | est 1350 | 1560–1886 | pop 1000 → 27601 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/grodno | “Encyclopaedia Judaica: one estimate puts the Jewish population at 1000 in 1560.”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1913-1938 ramps 63000 -> 25000. At 1921 it gives 63000-38000*8/25 = 50,840 vs the sourced 1921 census 18,697 (2.7x). The 63000 peak is also higher than the total population implied by row 4516 (34,461 = ~60% of the town, i.e. ~57,000 inhabitants).

```text
L4516: Belarus | Grodno | est 1350 | 1912–1912 | pop 34461 → 63000 | high | https://www.jewishgen.org/yizkor/grodno/gro120.html | “According to the statistical office of the province, Grodno counted 34,461 Jews (about 60% of the population).”
L4517: Belarus | Grodno | est 1350 | 1913–1938 | pop 63000 → 25000 | medium | https://www.jewishgen.org/yizkor/grodno/gro120.html | “The number of Jews in Grodno reached a peak in 1913-1914, estimated to number over 63,000.”
```

##### Belarus/Mogilev

**[CHAIN_SUBSET]** Row 1939-1940 ramps 16200 (1939 census) -> 10000, the number found by the Germans in July 1941 (row 5392). The map shows 10,000 in 1940.

```text
L5391: Belarus | Mogilev | est 1522 | 1939–1940 | pop 16200 → 10000 | high | https://www.yadvashem.org/odot_pdf/Microsoft Word - 1661.pdf | “Jewish population on the eve of WWII according to the 1939 census”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1847-1864 ramps 7897 -> 22345. At 1860 it gives 18,946 vs the sourced 11,437 (1.7x).

```text
L5384: Belarus | Mogilev | est 1522 | 1847–1864 | pop 7897 → 22345 | high | https://www.jewishgen.org/Belarus/misc/mogilev/InfoMogilevGub/index.html | “Jewish population in the town of Mogilev”
```

##### Belarus/Nesvizh

**[CHAIN_SUBSET]** Row 1853-1875 ramps 4 -> 172, where 4 = 'four synagogue officials' and 172 = 'draft evaders from Nesvizh'; row 1876-1919 ramps 172 -> 5000. Against 3,449 Jews in 1847 (row 5469) the map shows 58 at 1860 and ~170 in 1876.

```text
L5470: Belarus | Nesvizh | est 1500 | 1853–1875 | pop 4 → 172 | high | https://kehilalinks.jewishgen.org/nesvizh/nbofn.html | “Names of four synagogue officials were listed for 1853-1854.”
L5471: Belarus | Nesvizh | est 1500 | 1876–1919 | pop 172 → 5000 | high | https://kehilalinks.jewishgen.org/nesvizh/nesvizh_home.html | “A list of 337 Jewish draft evaders contained 172 individuals specifically from Nesvizh.”
```

**[HELD_FLAT]** 30 skilled workers spared in July 1942 (and killed soon after) is held 1942-2026 (blank pop_end) while REE gives 10 for 2000.

```text
L5476: Belarus | Nesvizh | est 1500 | 1942–2026 | pop 30 → — | high | http://jewishpartisans.blogspot.com/2011/07/this-month-in-jewish-partisan-history.html | “On July 20, 1942, a German commander ordered the liquidation of the ghetto with the exception of 30 essential Jewish skilled workers.”
```

##### Belarus/Vawkavysk

**[COMMENT_MISMATCH]** 27,254 is taken from a source text that reads '27.254' (a misprint) and is stated as 43.2% of the population; row 6310 says 6,901 = 40.1% of the town in 1939 (total ~17,200), so 27,254 exceeds the whole town. Rows 1921-1927 ramp 5130 -> 27254 and 1928-1930 ramp 27254 -> 7347: the map shows ~19,900 in 1925 and 27,254 in 1928 vs 5,130 (1921) and 7,347 (1931).

```text
L6307: Belarus | Vawkavysk | est 1577 | 1921–1927 | pop 5130 → 27254 | high | https://www.jewishgen.org/yizkor/pinkas_poland/pol8_00298.html | “Jewish population recorded as 5,130.”
L6308: Belarus | Vawkavysk | est 1577 | 1928–1930 | pop 27254 → 7347 | high | https://kehilalinks.jewishgen.org/vawkavysk/ | “Jewish population was 27,254 or 43.2% of total population (Text explicitly states 27.254).”
```

**[WARTIME_COUNT]** Row 1939-1947 ramps 6901 -> 25. The ghetto was liquidated in Nov 1942 - Jan 1943 (rows 6311-6312) but the map shows 4,300 in 1942 and 1,800 in 1945.

```text
L6310: Belarus | Vawkavysk | est 1577 | 1939–1947 | pop 6901 → 25 | high | https://kehilalinks.jewishgen.org/vawkavysk/ | “Jewish population decreased to 6901 or 40.1% of total population.”
```

##### Belarus/Vitebsk

**[CHAIN_SUBSET]** Row 1999-2004 ramps 2883 -> 29 and row 2005-2008 ramps 29 -> 1310, where 29 is the number of Vitebsk Jews named in a Holocaust victims database. The map shows ~30 Jews in 2004-2005 and ~460 in 2006 for a community of 1,000-2,900.

```text
L6406: Belarus | Vitebsk | est 1441 | 1999–2004 | pop 2883 → 29 | high | https://rep.polessu.by/bitstream/123456789/17382/1/Rozenblat_E.S._Elenskaia_I.E._Dinamika_chislennosti%20i%20r… | “Vitebsk city, Belarus census 1999”
L6407: Belarus | Vitebsk | est 1441 | 2005–2008 | pop 29 → 1310 | high | https://www.ushmm.org/online/hsv/source_view.php?SourceId=20719 | “Electronic data recorded the names of 29 Jews from Vitebsk who died in the Holocaust (index date before July 2005).”
```

**[CHAIN_SUBSET]** Row 1939-1940 ramps 37095 -> 16000, the 1941 ghetto count. The map shows 16,000 in 1940; row 6398 then declines slowly to 0 in 1944 although the ghetto was liquidated in Oct 1941.

```text
L6397: Belarus | Vitebsk | est 1441 | 1939–1940 | pop 37095 → 16000 | high | https://www.yahadmap.org/en/vitebsk-vitebsk-belarus/village-483 | “Vitebsk city, 22.2% of the population (last pre-war census)”
L6398: Belarus | Vitebsk | est 1441 | 1941–1943 | pop 16000 → 0 | high | https://kehilalinks.jewishgen.org/vitsyebsk/holocaust.html | “About 16000 Jews held in the Vitebsk ghetto (Jews who remained after evacuation); liquidated from 8 October 1941; estimate 6500-8000 Jews murdered in the city per same source (other sources give more)”
```

##### Kazakhstan/Almaty

**[TEMPLATE]** Placeholder 'Jewish community established in 1000s', probability blank, 1000 -> 0 across 1000-2023: the map shows ~800 Jews in 1200 and 130 in 1885 for a town founded in 1854 (Verny; sources: 99 Jews in 1897). WRONG_FACT as well: no Jewish community of 1000 in year 1000.

```text
L79289: Kazakhstan | Almaty | est 1000 | 1000–2023 | pop 1000 → 0 | prob — | https://www.jewishvirtuallibrary.org/almaty-kazakhstan | “Jewish community established in 1000s”
```

##### Kazakhstan/Petropavl

**[TEMPLATE]** Placeholder 'Jewish community established in 1800s', probability blank, 60 -> 0 across 1800-2023: the map shows a fictional 60-tapering-to-0 population (e.g. 34 at 1897) and a ramp to 0 in 2023 though 400 Jews are given for 2005.

```text
L79384: Kazakhstan | Petropavl | est 1800 | 1800–2023 | pop 60 → 0 | prob — | https://www.jewishvirtuallibrary.org/petropavl-kazakhstan | “Jewish community established in 1800s”
```

##### Latvia/Daugavpils

**[RAMP_OVERRIDES_SOURCED]** Row 1784-1912 ramps 1540 -> 55686 and is described as 'Jews in the Daugavpils region' (a regional figure). 1800 = 8,308 vs sourced 748 (11x); 1815 = 14,653 vs 1,559 (9.4x); 1847 = 28,189 vs 2,918 (9.7x); 1857 = 32,410 vs 7,583 (4.3x).

```text
L79574: Latvia | Daugavpils | est 1772 | 1784–1912 | pop 1540 → 55686 | high | https://www.jsc.lu.lv/en/ebreji-latvijas-vesture/raksti-un-petijumi/kulturas-un-sociala-dzive/some-reports-abo… | “Jews in the Daugavpils region according to a general census.”
```

**[CHAIN_SUBSET]** Rows 1935-1940 ramp 11106/11060 (1935 census) -> 16000, where 16000 is the July 1941 ghetto count of the next row. The map shows ~15,000 in 1939 against ~11,000 of the census/Pinkas table.

```text
L79587: Latvia | Daugavpils | est 1772 | 1935–1940 | pop 11106 → 16000 | high | https://www.jewishgen.org/databases/holocaust/0143_Daugavpils_ghetto.html | “Jews recorded in the All Latvia census (25% of the population).”
L79588: Latvia | Daugavpils | est 1772 | 1935–1940 | pop 11060 → 16000 | high | https://www.jewishgen.org/yizkor/Pinkas_latvia/lat_00001.html | “Table 5 (Jewish population of the 16 major communities of independent Latvia), Pinkas HaKehillot Latvia & Estonia general chapter”
```

**[WARTIME_COUNT]** Ghetto counts for 1941: 16000 and 23048 (the latter explicitly includes Lithuanian refugees and Jews from surrounding areas). The map shows 23,048 for the town in 1941 against ~11-16,000 local Jews.

```text
L79589: Latvia | Daugavpils | est 1772 | 1941–1941 | pop 16000 → 500 | high | https://shorstein.ufl.edu/jewish-daugavpils-latvia/ | “Jews held in the Daugavpils Ghetto by the end of July.”
L79590: Latvia | Daugavpils | est 1772 | 1941–1941 | pop 23048 → 500 | high | https://www.jewishgen.org/databases/holocaust/0143_Daugavpils_ghetto.html | “Jews living in the newly set up Daugavpils Ghetto by the end of July, which included local Jews, Lithuanian refugees, and those from surrounding areas.”
```

**[CHAIN_SUBSET]** Row 1947-1969 ramps 5000 -> 350 where 350 = '70 families x5 who moved to Israel' (row 79597, a subset estimate), and that 350 is held for 1970-1999. Census rows show 2,235 in 1959 and 1,373 in 1989 (3.9x-6x higher); the map shows ~1,200 in 1965 and 350-380 for 1969-1988.

```text
L79595: Latvia | Daugavpils | est 1772 | 1947–1969 | pop 5000 → 350 | high | https://www.jewishgen.org/yizkor/Daugavpils/dau39.html | “Jews gathered in Dvinsk, most of whom were not natives but from central Russia.”
L79597: Latvia | Daugavpils | est 1772 | 1970–1999 | pop 350 → 400 | high | https://www.jewishgen.org/yizkor/Daugavpils/dau39.html | “Estimate based on families. About 70 families from Dvinsk moved to Israel.”
```

##### Lithuania/Kaunas

**[WARTIME_COUNT]** Row 1941-1958 ramps the 1940 count 29760 down to 4792 (1959). Ghetto imprisoned the Jews in Aug 1941 and was ended in July 1944 (row 81295); the map shows 25,600 in 1944 and 17,200 in 1950.

```text
L81294: Lithuania | Kaunas | est 1397 | 1941–1958 | pop 29760 → 4792 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00512.html | “Jews were imprisoned in the ghetto on August 15, 1941.”
```

**[COMMENT_MISMATCH]** Numbers 25018, 25026, 25035 (1919-22), 26222, 27400 (1924-25) and 34527, 31053 (1935-36) are exactly linear interpolations between neighbouring census points but are attached to comments about Folksbank members, council elections, gymnasium pupils and Jewish deaths. The 1934-1937 interpolation (38000 -> 27580 -> 37000 by 1939) invents a dip with no source.

```text
L81276: Lithuania | Kaunas | est 1397 | 1918–1919 | pop 25000 → 25018 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00530.html | “Between 1918 and 1923, 542 Jews served in the Lithuanian army in the Kaunas branch of the Lithuanian Marksmen association.”
L81277: Lithuania | Kaunas | est 1397 | 1920–1920 | pop 25018 → 25026 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00530.html | “The local Jewish national bank (Folksbank) was established with 388 members.”
L81278: Lithuania | Kaunas | est 1397 | 1921–1921 | pop 25026 → 25035 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00530.html | “In elections to the municipal council, 12 Jews were elected.”
L81279: Lithuania | Kaunas | est 1397 | 1922–1922 | pop 25035 → 25044 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00530.html | “Number of students in the Kaunas Hebrew Gymnasia during the 1921/1922 academic year.”
L81282: Lithuania | Kaunas | est 1397 | 1925–1925 | pop 27400 → 28577 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00530.html | “Number of students in the Kaunas Hebrew Gymnasia during the 1924/1925 academic year.”
L81288: Lithuania | Kaunas | est 1397 | 1935–1935 | pop 34527 → 31053 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00530.html | “The number of Jewish deaths this year was 224.”
L81289: Lithuania | Kaunas | est 1397 | 1936–1936 | pop 31053 → 27580 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00530.html | “The number of Jewish deaths this year was 498.”
```

##### Lithuania/Kelmė

**[CHAIN_SUBSET]** Almost every row of 1839-1940 uses a subset: donors (8, 70, 16), members of a bank (82, 197), artisans (63), telephone owners (28), shop owners (113, 124), 15 committee members, as pop_start/pop_end of its neighbours. Example: 1897-1908 ramps 2710 -> 70 (map 790 in 1905); 1923-1926 ramps 1599 -> 197; 1939-1940 starts at 28. The map shows ~100 Jews in the 1910s-30s for a town with ~1,600-2,700 Jews.

```text
L81352: Lithuania | Kelmė | est 1623 | 1897–1908 | pop 2710 → 70 | high | https://www.jewishgen.org/yizkor/lithuania5/lit5_050.html | “There were 3,914 residents in Kelm, 2,710 (69%) of them being Jews”
L81353: Lithuania | Kelmė | est 1623 | 1909–1912 | pop 70 → 16 | high | https://www.jewishgen.org/yizkor/lithuania5/lit5_050.html | “70 Kelm Jews donated for settlement of Eretz-Yisrael”
L81357: Lithuania | Kelmė | est 1623 | 1923–1926 | pop 1599 → 197 | high | https://www.jewishgen.org/yizkor/lithuania5/lit5_050.html | “Kelm had 2,890 residents with a majority of 1,599 Jews (55%)”
L81358: Lithuania | Kelmė | est 1623 | 1927–1936 | pop 197 → 63 | high | https://www.jewishgen.org/yizkor/lithuania5/lit5_050.html | “Jewish Folksbank membership rose to 197”
L81359: Lithuania | Kelmė | est 1623 | 1937–1938 | pop 63 → 28 | high | https://www.jewishgen.org/yizkor/lithuania5/lit5_050.html | “There were 63 Jewish artisans”
L81360: Lithuania | Kelmė | est 1623 | 1939–1940 | pop 28 → 2000 | high | https://www.jewishgen.org/yizkor/lithuania5/lit5_050.html | “28 Jews owned telephones”
L81355: Lithuania | Kelmė | est 1623 | 1920–1920 | pop 82 → 15 | high | https://www.jewishgen.org/yizkor/lithuania5/lit5_050.html | “The Jewish Folksbank comprised 82 members”
L81356: Lithuania | Kelmė | est 1623 | 1921–1922 | pop 15 → 1599 | high | https://www.jewishgen.org/yizkor/lithuania5/lit5_050.html | “15 members elected to the Jewish community committee”
```

**[HELD_FLAT]** 'Eleven Jews registered to see a doctor and were shot' (July 1941) is stored as 11 and held for 1941-2026 (blank pop_end); a victim count shown as population for 85 years, after the census rows (21 in 1959, 9 in 1979).

```text
L81364: Lithuania | Kelmė | est 1623 | 1941–2026 | pop 11 → — | high | https://www.jewishgen.org/yizkor/kelme/kel074.html | “July (beginning): Eleven Jews registered to see a doctor and were shot”
```

##### Lithuania/Vaškai

**[CHAIN_SUBSET]** 1923-1926 267 -> 72 (72 = members of the Folksbank branch), 1927-1936 72 -> 11 (11 = Jewish artisans), 1937-1940 11 -> 340. The map shows 25-45 Jews at 1931-34 and ~120 at 1938 for a town of 267 (1923) and 340 (1940) Jews.

```text
L82872: Lithuania | Vaškai | est 1650 | 1923–1926 | pop 267 → 72 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00276b.html | “Jews represented 31% of the general population”
L82873: Lithuania | Vaškai | est 1650 | 1927–1936 | pop 72 → 11 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00276b.html | “Members in the branch of the Jewish popular bank (Folksbank)”
L82877: Lithuania | Vaškai | est 1650 | 1937–1940 | pop 11 → 340 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00276b.html | “Jewish artisans in the town”
```

**[WARTIME_COUNT]** 27 murdered in July and 300 (90 families) murdered by rioters are victim counts used as population: row 1941-1944 ramps 27 -> 300 (map ~209 in 1943) and row 82881 puts 300 at 1945, after the community had been destroyed.

```text
L82880: Lithuania | Vaškai | est 1650 | 1941–1944 | pop 27 → 300 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00276b.html | “27 Jews were murdered during the month of July and buried in the Jewish cemetery”
L82881: Lithuania | Vaškai | est 1650 | 1945–1945 | pop 300 → 300 | high | https://www.jewishgen.org/yizkor/pinkas_lita/lit_00276b.html | “On May 17, a Soviet document stated 90 Jewish families (300 people) were murdered by Lithuanian rioters”
```

##### Moldova/Chișinău

**[CHAIN_SUBSET]** Row 1939-1940 ramps 45000 -> 11525 over one year; 11525 is the December 1941 ghetto count of the next row. The map shows 11,525 in 1940 (community was 45-50,000 until mid-1941).

```text
L83767: Moldova | Chișinău | est 1600 | 1939–1940 | pop 45000 → 11525 | high | https://kehilalinks.jewishgen.org/Chisinau/PEO_STO_TOF.asp | “Total population was about 100,000, of which 45-50% were Jews”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1991-2013 ramps 35000 -> 10000; 1999 = 25,900 vs REE ~10,000 (2.6x), 2004 = 20,200 vs the 2004 census 2,603 (7.8x). Row 83777 then holds 10000 for 2014-2026, 3.8x the 2004 census; the map overstates the post-emigration community.

```text
L83774: Moldova | Chișinău | est 1600 | 1991–2013 | pop 35000 → 10000 | medium | https://audiowalks.centropa.org/chisinau/ | “When Moldova declared its independence, approximately 35,000 Jews lived in the capital”
L83777: Moldova | Chișinău | est 1600 | 2014–2026 | pop 10000 → — | high | https://kehilalinks.jewishgen.org/chisinau/LIF_Today_MJTBRAE.asp | “The city's Jewish community numbered around 10,000”
```

##### Russia/Moscow

**[RAMP_OVERRIDES_SOURCED]** Row 1890-1934 ramps 40000 -> 250000 (250000 is the mid-1930s figure of the next row). At 1926 it gives 40000+210000*36/44 = 211,818 against the sourced 1926 census 131,369 (1.6x); at 1930 about 230,900. The map shows the higher ramp, hiding the census point.

```text
L107868: Russia | Moscow | est 1470 | 1890–1934 | pop 40000 → 250000 | high | https://kehilalinks.jewishgen.org/Moskva/MoskvaHistory.htm | “Jewish population reached about 40,000”
```

**[HELD_FLAT]** Row 1970-2009 ramps 250000 -> 100000 (2002 value 126,923 vs DellaPergola 2002 census 80,400 = 1.6x). Row 107886 then holds 100000 for 2010-2026 although the 2010 census (row 107887, 53,145) and DellaPergola 2021 (28,100) are 1.9x and 3.6x lower; the map shows 100,000 Jews in Moscow in 2020.

```text
L107879: Russia | Moscow | est 1470 | 1970–2009 | pop 250000 → 100000 | high | https://kehilalinks.jewishgen.org/Moskva/MoskvaHistory.htm | “By 1970, there were again around 250,000 Jews living in Moscow”
L107886: Russia | Moscow | est 1470 | 2010–2026 | pop 100000 → — | high | https://eurojewcong.org/_communities/russian-federation/ | “The latest official census from 2010 showed a figure officially near 100,000 Jews in Moscow”
L107887: Russia | Moscow | est 1470 | 2010–2026 | pop 53145 → — | high | https://kehilalinks.jewishgen.org/Moskva/MoskvaHistory.htm | “53,145 citizens identified themselves as Jewish on the 2010 census”
```

##### Russia/Saint Petersburg

**[TEMPLATE]** Three placeholder rows with 'nominal value' 3, 20, 20 and 20->3 cover 1700-1899 (comments about a cantor, a cemetery; row 108830 cites a Lviv yizkor page). The map shows 3-20 Jews for two centuries, ramping DOWN to 3 by 1899, whereas the file itself has about 700 Jews in 1860 (row 108832, only for the year 1860) and tens of thousands by 1926 (84,505). Rows 108834-108835 (1900-1925) are blank, so 1900-1925 is empty.

```text
L108830: Russia | Saint Petersburg | est 1700 | 1700–1874 | pop 3 → 20 | high | https://www.jewishgen.org/yizkor/lviv/lvi491.html | “Jewish cantor Jacob Bachman traveled to Saint Petersburg to study at the conservatoire. The source indicates a small Jewish presence but gives no specific count; the population shown is only a nominal value.”
L108831: Russia | Saint Petersburg | est 1700 | 1700–1874 | pop 20 → 20 | high | https://cdp.jewishgen.org/eastern-europe/russia/sankt-peterburg-leningrad-petrograd-saint-petersburg-piter | “The Jewish Cemetery became the resting place of notable Jewish figures including sculptor Mark Antokolsky, entrepreneur Samuel Polyakov, Baron David Gunzburg, Moses Altman, Moses Lesman, Mark Khidekel, Abram Sternberg, and several chief rabbis. The source indicates an organized community/synagogue but gives no specific count; the population shown is only a n…”
L108833: Russia | Saint Petersburg | est 1700 | 1875–1899 | pop 20 → 3 | high | https://cdp.jewishgen.org/eastern-europe/russia/sankt-peterburg-leningrad-petrograd-saint-petersburg-piter | “The Jewish cemetery was founded. The source indicates an organized community/synagogue but gives no specific count; the population shown is only a nominal value.”
```

**[HELD_FLAT]** 16649 (a figure of unclear date, 'based on April 2014 source access metadata') is held 2014-2026, while DellaPergola 2021 in the same town gives 9,200 (1.8x lower); the map shows 16,649 in 2021 and 2026.

```text
L108846: Russia | Saint Petersburg | est 1700 | 2014–2026 | pop 16649 → — | high | https://cdp.jewishgen.org/eastern-europe/russia/sankt-peterburg-leningrad-petrograd-saint-petersburg-piter | “Jewish population listed for the city (date based on April 2014 source access metadata).”
```

##### Ukraine/Berdychiv

**[WARTIME_COUNT]** Row 1939-1945 ramps the 1939 count 23266 down to 6000 (1946). The community was shot in Sept 1941 (row 145207: ~12000 shot at the airfield), but the map shows 14,600 in 1942, 11,800 in 1943 and 8,900 in 1944.

```text
L145206: Ukraine | Berdychiv | est 1550 | 1939–1945 | pop 23266 → 6000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/berdichev | “Berdichev town; 37.5% of the population (Soviet census 1939)”
```

**[CONFLICT]** Row 1958-1969 ramps 6500 -> 15000, where 15000 is the Encyclopaedia Judaica 1970 estimate (still quoted in the comment of row 145210, whose own number was corrected to the census 5700). The map shows 11,900 at 1965 and 15,000 at 1969, 2x-2.6x the sourced 6,500 and 5,700.

```text
L145209: Ukraine | Berdychiv | est 1550 | 1958–1969 | pop 6500 → 15000 | medium | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/berdichev | “'About 6,500 Jews lived in Berdichev in the late 1950s' (EJ) - year set to 1958 as an approximation; Encyclopedia of Ukraine and Russian Wikipedia give 11.5-11.8% in 1959”
L145210: Ukraine | Berdychiv | est 1550 | 1970–1990 | pop 5700 → 3512 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/berdichev | “Estimate of 15000 Jews in 1970 (Encyclopaedia Judaica)”
```

**[CONFLICT]** Row 145210 ends at 3512 in 1990 but row 145212 starts 14000 in 1991 ('estimated at independence'), a 4x jump; the 1979 census count is 4,637. The map shows ~9,200 in 1995 and ~3,200 in 2000 for a town whose Jews were ~800 by 2003.

```text
L145210: Ukraine | Berdychiv | est 1550 | 1970–1990 | pop 5700 → 3512 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/berdichev | “Estimate of 15000 Jews in 1970 (Encyclopaedia Judaica)”
L145212: Ukraine | Berdychiv | est 1550 | 1991–2002 | pop 14000 → 800 | medium | https://www.globalsecurity.org/military/world/ukraine/jews.htm | “Jewish population was estimated at 14,000 at the time of Ukrainian independence”
```

##### Ukraine/Bratslav

**[RAMP_OVERRIDES_SOURCED]** Rows 1569-1896 ramp 4000 -> 52000 -> 3290 and the comment says 'Jews in the provinces of Volhynia, Podolia, Kyiv and Bratslav combined, across 115 localities': a regional total used as a town. 1765 = ~29,000 vs sourced 101 (290x); 1856 = ~11,100 vs 1,954 (5.7x).

```text
L145800: Ukraine | Bratslav | est 1479 | 1569–1647 | pop 4000 → 52000 | high | https://ukrainianjewishencounter.org/media/UJE_book_readerspreads_08_2019_Eng.pdf | “Number of Jews in the provinces of Volhynia, Podolia, Kyiv, and Bratslav combined, across 115 localities.”
L145801: Ukraine | Bratslav | est 1479 | 1648–1896 | pop 52000 → 3290 | high | https://ukrainianjewishencounter.org/media/UJE_book_readerspreads_08_2019_Eng.pdf | “Number of Jews in the provinces of Volhynia, Podolia, Kyiv, and Bratslav combined, across 115 localities.”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1921-2010 ramps 6000 -> 84 over 89 years. 1939 = 4,800 vs sourced 1,010 (4.8x); 1989 = 1,480 vs 137 (10.8x). The 6000 ('until 1919-1921') is also higher than 3,290 in 1897 for a town that lost population.

```text
L145811: Ukraine | Bratslav | est 1479 | 1921–2010 | pop 6000 → 84 | high | https://ukrainianjewishencounter.org/en/leader-of-the-bratslav-jewish-community-there-is-more-to-jewish-histor… | “Until 1919-1921, there were 6000 Jews in Bratslav.”
```

##### Ukraine/Chernivtsi

**[CHAIN_SUBSET]** Row 1930-1939 ramps 42592 (1930 census) -> 3000, where 3000 is the Soviet deportation of the 'bourgeois elite' in June 1940 (next row). The map shows 20,600 in 1935 and 7,400 in 1938 for a community of ~50,000; row 146258 additionally plots 3000 as the 1940 population.

```text
L146257: Ukraine | Chernivtsi | est 1400 | 1930–1939 | pop 42592 → 3000 | high | http://hauster.de/data/CensusCernauti1930.pdf | “Census of the city of Cernăuți records 42,592 Jews by nativity (race) out of a total population of 112,427; 42,932 were recorded as Mozaic by religion, and 32,731 declared Yiddish as their mother tongue.”
L146258: Ukraine | Chernivtsi | est 1400 | 1940–1940 | pop 3000 → 60000 | medium | https://jbat.lbi.org/locality/chernivtsi | “In June, the bourgeois elite of the Jewish community (approximately 3,000 people) was deported to Siberia by Soviet forces.”
```

##### Ukraine/Dnipro

**[RAMP_OVERRIDES_SOURCED]** Row 1847-1896 ramps 1699 -> 41240 (the 1897 value). At 1857 it gives 1699+39541*10/49 = 9,769 against the sourced 1,125 (row 146522), 8.7x higher; the map shows the ramp.

```text
L146521: Ukraine | Dnipro | est 1778 | 1847–1896 | pop 1699 → 41240 | high | https://www.jewishgen.org/yizkor/ybip/YBIP_Dnipropetrovsk.html | “The Jewish community numbered 1699.”
```

**[HELD_FLAT]** The 1989 census figure 37869 is held for 1989-2024 (35 years of mass emigration). It also exceeds DellaPergola's whole Ukraine core Jewish population (33,000, 2023), so the map shows an impossible number for Dnipro in 2020.

```text
L146532: Ukraine | Dnipro | est 1778 | 1989–2024 | pop 37869 → 37869 | high | https://www.jewishgen.org/yizkor/ybip/YBIP_Dnipropetrovsk.html | “Census figures put the Jewish population at 17869.”
```

##### Ukraine/Donetsk

**[CONFLICT]** Row 146608 starts at 15000 in 1900 (a modern press statement 'historically home to 15,000 Russian-speaking Jews') while row 146609 gives 3168 for 1900 (1897 census 3,168). Row 146607 ramps 3168 -> 15000 in two years. 1903: 14,600 vs 4,100 (3.6x); the map shows 15,000.

```text
L146607: Ukraine | Donetsk | est 1883 | 1897–1899 | pop 3168 → 15000 | high | https://www.jewishvirtuallibrary.org/donetsk | “11.5% of total population; census”
L146608: Ukraine | Donetsk | est 1883 | 1900–1926 | pop 15000 → 11300 | high | https://www.thejc.com/news/world/the-only-ones-left-shabbat-with-the-jews-of-donetsk-sp826gub | “The city was historically home to 15,000 Russian-speaking Jews.”
```

##### Ukraine/Kharkiv

**[WARTIME_COUNT]** Row 1939-1940 130000 -> 16000: pop_end 16000 is the number shot at Drobytsky Yar (next row), so the map shows 16,000 in 1940 instead of ~130,000. Row 147877 (16000 shot) and row 147880 (64 captured and murdered in 1942) put victim counts in as population.

```text
L147876: Ukraine | Kharkiv | est 1890 | 1939–1940 | pop 130000 → 16000 | high | https://www.yadvashem.org/righteous/stories/kharkov.html | “The Jewish population reached some 130,000 by the late 1930s.”
L147877: Ukraine | Kharkiv | est 1890 | 1941–1941 | pop 16000 → 64 | high | https://sites.tufts.edu/ukraine/jewish-heritage-of-ukraine/ | “16,000 Jews were shot or forced into mass graves in Drobytsky Yar, a ravine outside Kharkiv.”
L147880: Ukraine | Kharkiv | est 1890 | 1942–1942 | pop 64 → 64 | high | https://www.yadvashem.org/righteous/stories/kharkov.html | “By the end of 1942, another 64 Jews had been captured and murdered in Kharkov.”
```

**[GAP]** Series stops at 1970 (62,800). Nothing for 1971-2026 although the community existed (1979/1989 censuses and later); the pin disappears from the map for 55 years.

```text
L147883: Ukraine | Kharkiv | est 1900 | 1970–1970 | pop 62800 → 62800 | high | https://www.jewishvirtuallibrary.org/kharkov | “Jews in Kharkiv in 1970: 62800. Encyclopaedia Judaica (2nd ed., 2007), entry "Kharkov", as published by Jewish Virtual Library; source wording: "Jewish settlement was renewed in Kharkiv, and the Jewish population numbered 81,500 (9% of the total) in 1959, dropping to 62,800 in 1970". EJ gives the number without naming its source.”
```

##### Ukraine/Kherson

**[CHAIN_SUBSET]** Rows 1801-1849 (218 -> 3800) and 1850-1912 (3800 -> 42000): 3800 is 'Jews within the borders of the province' and 42000 is the Jews of 38 rural communities of Kherson and Katerynoslav provinces (per the correction note on row 147906). Regional numbers ramped as the town: 1897 about 32,800, and 1912 42,000 against 14,837 in 1926.

```text
L147904: Ukraine | Kherson | est 1778 | 1801–1849 | pop 218 → 3800 | high | https://kehilalinks.jewishgen.org/Kherson/HIS_intro.asp | “Within about two decades of 1781, there were 180 Jewish townsmen and 38 Jewish merchants.”
L147905: Ukraine | Kherson | est 1778 | 1850–1912 | pop 3800 → 42000 | high | https://kehilalinks.jewishgen.org/Kherson/HIS_intro.asp | “By mid-century, there were more than 3,800 Jews living within the borders of the province.”
```

**[WARTIME_COUNT]** 8000 murdered on 24 Sept 1941 and 400 children murdered in Feb 1942 (victim counts) are used as population; row 147909 then ramps 400 -> 9500 over 1942-1958, a gradual rise of the postwar community from a victim count (1950 = 4,950).

```text
L147908: Ukraine | Kherson | est 1778 | 1941–1941 | pop 8000 → 400 | high | https://kehilalinks.jewishgen.org/Kherson/HIS_intro.asp | “On 24 September 1941, Einsatzkommando 11a murdered 8,000 Jews.”
L147909: Ukraine | Kherson | est 1778 | 1942–1958 | pop 400 → 9500 | high | https://kehilalinks.jewishgen.org/Kherson/HIS_intro.asp | “In February 1942, 400 children of mixed marriages were deemed too tainted by 'Jewish blood' and murdered.”
```

**[GAP]** Only isolated points: 1913-1925 and 1927-1940 are empty (the 1939 census count of 16,145 was removed) and nothing after 1959. A community of 15,000 vanishes from the map for most of the century.

```text
L147907: Ukraine | Kherson | est 1801 | 1926–1926 | pop 14837 → 14837 | high | http://www.demoscope.ru/weekly/ssp/sng_nac_26.php?reg=2155 | “Jews (Евреи, nationality) in Kherson in the census of 17 December 1926: 14837 of 58691 inhabitants (город Херсон). Source: Demoscope Weekly table 'Всесоюзная перепись населения 1926 года. Национальный состав населения по регионам республик СССР', page 'Украинская ССР / Херсонский округ / городские поселения', column 'город Херсон', row 'Евреи', both sexes. S…”
L147910: Ukraine | Kherson | est 1778 | 1959–1959 | pop 9500 → 9500 | high | https://kehilalinks.jewishgen.org/Kherson/HIS_intro.asp | “Jews made up six percent of the city's population (9,500 souls).”
```

##### Ukraine/Kremenchuk

**[CHAIN_SUBSET]** Rows 1939-1940 (30000 and 19880) ramp to 8000, the ~8,000 who 'remained and were murdered' (1941, row 148717). The map shows 8,000 in 1940 instead of ~20-30,000; 30000 (60% of 50,000) also conflicts with 19,880 (1939). Row 148717 then ramps that murdered 8000 down to 5200 across 1941-58 (7,340 in 1945).

```text
L148715: Ukraine | Kremenchuk | est 1795 | 1939–1940 | pop 30000 → 8000 | medium | https://www.jewishgen.org/Ukraine/files/travel_reports/Kremenchuk_report.pdf | “Estimated pre-WWII Jewish population was up to 60 percent of the 50,000 total town population.”
L148716: Ukraine | Kremenchuk | est 1795 | 1939–1940 | pop 19880 → 8000 | high | https://sites.google.com/jewishgen.org/kremenchuk/history | “Jews represented 22 percent of the total population.”
L148717: Ukraine | Kremenchuk | est 1795 | 1941–1958 | pop 8000 → 5200 | medium | https://sites.google.com/jewishgen.org/kremenchuk/history | “Most of the Jewish population fled before the German occupation; the approximately 8,000 who remained were murdered.”
```

**[CONFLICT]** Row 148719 starts 1000 in 1970 (ramp 1000 -> 5000 by 2015) between 5200 in 1959 (row 148718, 6%) and 4600 in 1979 (row 148720). 1000 is 4.6x below the neighbouring censuses: the map shows a false trough in 1969-1970 and a rising trend during the 1990s emigration.

```text
L148718: Ukraine | Kremenchuk | est 1795 | 1959–1969 | pop 5200 → 1000 | high | https://sites.google.com/jewishgen.org/kremenchuk/history | “Jewish population represented 6 percent of the total; only one synagogue remained open.”
L148719: Ukraine | Kremenchuk | est 1795 | 1970–2014 | pop 1000 → 5000 | medium | https://sites.google.com/jewishgen.org/kremenchuk/history | “Approximate Jewish population.”
```

##### Ukraine/Lviv

**[CONFLICT]** Row 1869-1879 ramps 26694 (1869 census) down to 12000, taken from the next row's YIVO 'estimate' of 12000 for the 1880s. Row 149515 gives 30961 for the same 1880s and the 1880 census was ~30,000. Map shows ~17,900 at 1875 and 12,000 at 1879-1880 (2.6x below 30961, whereas the Jewish population was actually growing).

```text
L149513: Ukraine | Lviv | est 1256 | 1869–1879 | pop 26694 → 12000 | high | https://www.jewishencyclopedia.com/articles/9741-lemberg | “Austrian census: 26694 Jews of 87109 inhabitants (Jewish Encyclopedia)”
L149514: Ukraine | Lviv | est 1256 | 1880–1889 | pop 12000 → 26500 | high | https://yivoencyclopedia.org/article.aspx/Lviv | “Jewish population estimate”
```

**[COMMENT_MISMATCH]** Comment says 'About 30000 Jews (1.6% of the population)'. 30000 is 1.6% of ~1.9 million, impossible for Lviv (about 550,000 in 1970; 5% would be ~28,000). Either the percentage or the year belongs to another figure; this row sets the 1970 end of the 1970-1978 ramp.

```text
L149557: Ukraine | Lviv | est 1256 | 1970–1978 | pop 30000 → 17952 | high | https://www.hamichlol.org.il/לבוב | “About 30000 Jews (1.6% of the population) per Hebrew Wikipedia”
```

**[CONFLICT]** Row 1550-1570 ramps 911 (sum of houses inside and outside the walls) to 120, the YIVO 'estimate' that starts the 1571 row. A 7.6x fall in 20 years from two incompatible kinds of number; the map shows a false decline 911 -> 120.

```text
L149471: Ukraine | Lviv | est 1256 | 1550–1570 | pop 911 → 120 | high | https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/lvov | “352 Jews lived inside the city walls in 29 houses and 559 in 52 houses outside the walls (sum of both; outside group may include suburbs)”
L149476: Ukraine | Lviv | est 1256 | 1571–1577 | pop 120 → 1500 | high | https://yivoencyclopedia.org/article.aspx/Lviv | “Jewish population estimate”
```

##### Ukraine/Rivne

**[DERIVED]** Row 151731's 18393 is derived from '7,357 total families, half of them Jews (~3,678 families)' x5; it is higher than the 1897 census 13,780 that follows (row 151731 ends at 13780). Row 151729 ramps 3788 -> 18393 and gives 7,735 at 1857 vs sourced 3,344 (2.3x).

```text
L151729: Ukraine | Rivne | est 1566 | 1847–1884 | pop 3788 → 18393 | high | https://www.jewishgen.org/yizkor/rovno/rov021.html | “3788 Jewish citizens in Rovno”
L151731: Ukraine | Rivne | est 1566 | 1885–1896 | pop 18393 → 13780 | high | https://www.jewishgen.org/yizkor/rovno/rov021.html | “Estimate based on families. 7,357 total families in the city, half of them Jews (~3,678 Jewish families)”
```

**[GAP]** Series ends in 1989 (1,230); nothing for 1990-2026 although a community exists.

```text
L151743: Ukraine | Rivne | est 1566 | 1989–1989 | pop 1230 → 1230 | high | https://www.jewsencyclopedia.com/index.php/%D0%A0%D0%9E%D0%92%D0%9D%D0%9E | “Jews (nationality 'Jew') in Rivne in 1989: 1230. Russian Jewish Encyclopedia (REE), entry "РОВНО" on jewsencyclopedia.com; source wording: "в 1989 – 1230". REE gives the series without naming the census; 1989 is the date of the all-Union census of 12 January 1989, so the figure is read as that census count of persons of Jewish nationality (not religion).”
```

##### Ukraine/Shepetivka

**[WARTIME_COUNT]** Row 1941-1967 ramps the 3200 present at the start of the German occupation (5 July 1941) to 2500 (late 1960s). Yahad rows 152301-152304 show the Jews were shot in 1941-42 (2,500 on 25 June 1942, 500 specialists in Sept 1942) yet the map shows ~3,100 in 1945 and ~2,900 in 1950.

```text
L152302: Ukraine | Shepetivka | est 1662 | 1941–1967 | pop 3200 → 2500 | high | https://www.yahadmap.org/en/shepetivka-shepetovka-khmelnytskyi-ukraine/village-720 | “Yahad-In Unum: about 1,500 Jews evacuated, leaving about 3,200 at the start of the occupation on 5 July 1941 (Martin Dean)”
```

##### Ukraine/Skvyra

**[CHAIN_SUBSET]** 1897-1899 8910 (census) -> 2184, 1900-1922 2184 -> 50, 1923-1925 50 -> 4681. 2184 is a mid-19th-century figure (also the 1847 value of row 152494) used for 1900; 50 = '10 refugee families from Borshchagovka'. The map shows 2,184 in 1899 and 1,200 in 1910 and ~250 in 1920 against 8,910 (1897) and 4,681 (1926).

```text
L152496: Ukraine | Skvyra | est 1736 | 1897–1899 | pop 8910 → 2184 | high | https://ru.wikisource.org/wiki/ЕЭБЕ/Сквира | “8910 Jews of 17958 residents (49.5%)”
L152498: Ukraine | Skvyra | est 1700 | 1900–1922 | pop 2184 → 50 | high | https://cdp.jewishgen.org/eastern-europe/ukraine/skvira | “Jewish population recorded as 2184”
L152501: Ukraine | Skvyra | est 1700 | 1923–1925 | pop 50 → 4681 | high | https://kehilalinks.jewishgen.org/Borshchagovka/index.html | “Estimate based on families. 10 Borshchagovka refugee families fled to Skvira, according to an American Joint Distribution Committee Report dated May 25, 1923”
```

**[HELD_FLAT]** About 500 (a late-1960s estimate) is held 1968-2003 (35 years); the 1989 census (row 152508) gives 212 (2.4x lower), so the map shows 500 in 1989-2003.

```text
L152507: Ukraine | Skvyra | est 1736 | 1968–2003 | pop 500 → — | medium | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/skvira | “Jewish population estimated at about 500 in the late 1960s (midpoint year)”
L152508: Ukraine | Skvyra | est 1736 | 1989–1989 | pop 212 → 212 | high | https://www.jewsencyclopedia.com/index.php/%D0%A1%D0%9A%D0%92%D0%98%D0%A0%D0%90 | “Jews (nationality 'Jew') in Skvyra in 1989: 212. Russian Jewish Encyclopedia (REE), entry "СКВИРА" on jewsencyclopedia.com; source wording: "в 1989 - 212". REE gives the series without naming the census; 1989 is the date of the all-Union census of 12 January 1989, so the figure is read as that census count of persons of Jewish nationality (not religion).”
```

##### Ukraine/Uman

**[WARTIME_COUNT]** Row 1939-1958 ramps the 1939 census 13233 -> 2200 (1959). The Jews of Uman were murdered in 1941, but the map shows 12,100 in 1941, 9,700 in 1945 and 7,100 in 1950.

```text
L153484: Ukraine | Uman | est 1500 | 1939–1958 | pop 13233 → 2200 | high | https://cdp.jewishgen.org/eastern-europe/ukraine/uman | “1939 Jewish population (census) in was 22,179. Living here was Rabbi Borukh from Central Synagogue.”
```

**[CHAIN_SUBSET]** Row 1960-1987 ramps 1000 -> 250, where 250 is the number of foreign pilgrims permitted to spend Rosh Hashanah in 1988 (row 153487 starts from this 250 and ramps to 500). Pilgrims are not residents; nothing covers 1990-2022.

```text
L153486: Ukraine | Uman | est 1500 | 1960–1987 | pop 1000 → 250 | high | https://thinktorah.org/wp-content/uploads/2023/09/aish.com-Uman-What-You-Need-to-Know-about-the-City-of-Souls3… | “By the late 1960's, the Jewish population was down to 1,000.”
L153487: Ukraine | Uman | est 1500 | 1988–1989 | pop 250 → 500 | high | https://thinktorah.org/wp-content/uploads/2023/09/aish.com-Uman-What-You-Need-to-Know-about-the-City-of-Souls3… | “In 1988, bending to international pressure, the Soviet government permitted 250 foreign citizens to spend Rosh Hashanah in Uman.”
```

##### Ukraine/Vinnytsia

**[CHAIN_SUBSET]** Row 1939-1940 ramps 33150 -> 15000 where 15000 is the 1941 estimate of Jews at the occupation (next row). The map shows 15,000 in 1940 instead of ~33,000.

```text
L153869: Ukraine | Vinnytsia | est 1532 | 1939–1940 | pop 33150 → 15000 | high | https://www.esjf-cemeteries.org/fenced/vinnytsya-jewish-cemetery-2 | “The Jewish population of Vinnytsya numbered 33,150.”
```

**[WARTIME_COUNT]** Row 1942-1958 starts at 5000 'held for labor' who were shot on 16 April 1942 (only 150 left, killed on 25 Aug 1942) and ramps to 19500 in 1959: the map shows 5,000 in 1942 and 7,700 in 1945 for a destroyed community.

```text
L153872: Ukraine | Vinnytsia | est 1532 | 1942–1958 | pop 5000 → 19500 | high | https://myshtetl.org/vinnitskaja/vinnica_en.html | “In early 1942, five thousand Jews were held for vital labor. On April 16, almost all were shot, leaving only 150 professionals. The last 150 Jews were killed on August 25.”
```

##### Ukraine/Zaporizhzhia

**[CHAIN_SUBSET]** Rows 1939-1940 22631 (1939 census) -> 4000, where 4000 is the number of Jews who stayed in the city at the Oct 1941 occupation (row 154504). The map shows 4,000 in 1940 instead of ~22,000.

```text
L154497: Ukraine | Zaporizhzhia | est 1770 | 1939–1940 | pop 22631 → 4000 | high | https://jewsencyclopedia.com/index.php/%D0%97%D0%90%D0%9F%D0%9E%D0%A0%D0%9E%D0%96%D0%AC%D0%95 | “Jews living in Aleksandrovsk/Zaporozhye; 7.8% of total population (1939 census)”
L154498: Ukraine | Zaporizhzhia | est 1770 | 1939–1940 | pop 11319 → 4000 | high | https://cdp.jewishgen.org/eastern-europe/ukraine/zaporozhye | “CDP labels 11,319 as 1939 census; this matches the 1926 census figure elsewhere, likely mislabeled”
```

**[WARTIME_COUNT]** Rows 1941-1958 ramp 4000 / 35000 to 15700; the 35000 'eve of WWII' figure (1.5x the 1939 census 22,631) is ramped for 18 years although the comment says the community was destroyed after Oct 1941: the map shows 30,500 in 1945 and 24,800 in 1950.

```text
L154504: Ukraine | Zaporizhzhia | est 1770 | 1941–1958 | pop 4000 → 15700 | high | https://www.esjf-cemeteries.org/survey/zaporizhya-new-jewish-cemetery/ | “About 4,000 Jews remained in the city when occupied by the Germans in October 1941”
L154505: Ukraine | Zaporizhzhia | est 1770 | 1941–1958 | pop 35000 → 15700 | high | https://he.wikipedia.org/wiki/%D7%96%D7%A4%D7%95%D7%A8%D7%95%D7%96'%D7%99%D7%94 | “Community numbered about 35,000 on the eve of WWII; destroyed by Germans after October 1941 occupation”
```

**[HELD_FLAT]** Rows 1989-1998 hold 11931 -> 12000 for the whole 1990s emigration, then 12000 (1999) falls to 3444 (2001 census, 3.5x lower). The map shows ~12,000 until 1999. The series ends in 2001 (nothing for 2002-2026).

```text
L154518: Ukraine | Zaporizhzhia | est 1770 | 1989–1998 | pop 11931 → 12000 | high | https://jewsencyclopedia.com/index.php/%D0%97%D0%90%D0%9F%D0%9E%D0%A0%D0%9E%D0%96%D0%AC%D0%95 | “Jews living in Aleksandrovsk/Zaporozhye; 1.4% of total population (1989 census)”
L154522: Ukraine | Zaporizhzhia | est 1770 | 1999–2000 | pop 12000 → 3444 | medium | https://jewsencyclopedia.com/index.php/%D0%97%D0%90%D0%9F%D0%9E%D0%A0%D0%9E%D0%96%D0%AC%D0%95 | “Jews living in Aleksandrovsk/Zaporozhye; Approximately 12,000 Jews lived in the city”
L154524: Ukraine | Zaporizhzhia | est 1770 | 2001–2001 | pop 3444 → — | high | https://www.esjf-cemeteries.org/survey/zaporizhya-new-jewish-cemetery/ | “2001 Ukrainian census”
```

##### Ukraine/Zhytomyr

**[WARTIME_COUNT]** Row 1941-1958 ramps the pre-war 30000 down to 14800 (1959). The 1941 ghetto held 4,820 (row 154794) and most Jews were shot in Sept 1941, but the map shows 27,300 in 1944 and 22,400 in 1950.

```text
L154793: Ukraine | Zhytomyr | est 1700 | 1941–1958 | pop 30000 → 14800 | high | https://www.hamichlol.org.il/%D7%96%D7%99%D7%98%D7%95%D7%9E%D7%99%D7%A8 | “Eve of German invasion: "about 30,000 Jews ... about a third of residents" (Hebrew Wikipedia). Many fled before occupation on 9 July 1941. City.”
```

##### Uzbekistan/Samarkand

**[RAMP_OVERRIDES_SOURCED]** Row 1170-1886 ramps Benjamin of Tudela's 50000 (c.1170) to 3792 (1887) over 716 years. 1820 = 8,050 vs sourced ~50 (Meyendorff); 1873 = 4,630 vs sourced 840 (5.5x). The map shows thousands of Jews where the sources show tens/hundreds.

```text
L158633: Uzbekistan | Samarkand | est 1150 | 1170–1886 | pop 50000 → 3792 | low | https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/bukharan-jews | “Jewish traveler Benjamin of Tudela visited Central Asia and documented a populous Jewish community of 50,000 Jews living in the city. This figure is far larger than neighbouring rows for the same town, or is a medieval traveller's estimate.”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1935-1942 ramps 9832 -> 40000 (the undated 'mahalla was home to nearly 40,000' of row 158660). 1939 = 27,070 vs the 1939 census 7,953 / 7,600 (3.4-3.6x); the map shows the ramp.

```text
L158655: Uzbekistan | Samarkand | est 1150 | 1935–1942 | pop 9832 → 40000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/samarkand | “Encyclopaedia Judaica 'Samarkand': '9,832 in 1935 (8% of the total population)' (Bukharan community)”
L158656: Uzbekistan | Samarkand | est 1150 | 1939–1939 | pop 7953 → 7953 | high | https://jewsencyclopedia.com/index.php/САМАРКАНД | “Russian Jewish Encyclopedia (REE, jewsencyclopedia.com), article «САМАРКАНД»: «в 1939 – 7953 еврея» (census, Jews).”
L158657: Uzbekistan | Samarkand | est 1150 | 1939–1939 | pop 7600 → 7600 | high | https://eleven.co.il/jews-of-russia/history-in-ussr/15423/ | “KEE (ORT), article 'Soviet Union. Ethnic demography of Soviet Jewry', Table 10 'Jewish population in USSR cities by census data (thousands)': Samarkand 1939 = 7.6 thousand (rounded to hundreds); Soviet census 1939. The REE gives 7,953 for 1939; both kept.”
```

##### Uzbekistan/Tashkent

**[RAMP_OVERRIDES_SOURCED]** Row 1914-1958 ramps 3000 -> 50445 (1959 census). 1920: 3000+47445*6/44 = 9,469 vs sourced 5,600 (1.7x); 1926: 15,940 vs 10,600 (1.5x).

```text
L158688: Uzbekistan | Tashkent | est 1865 | 1914–1958 | pop 3000 → 50445 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/tashkent | “Encyclopaedia Judaica 'Tashkent': 'On the eve of World War I about 3,000 Jews lived there'”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1959-2017 ramps 50445 -> 8000 gradually. 1995: 50445-42445*36/58 = 24,100 vs the sourced mid-1995 figure of 6,000 (4.0x); 2000 about 20,400. The post-1989 mass emigration is shown as a slow slide; map shows ~24,000 in 1995.

```text
L158702: Uzbekistan | Tashkent | est 1865 | 1959–2017 | pop 50445 → 8000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/tashkent | “Encyclopaedia Judaica 'Tashkent': 'In the 1959 census 50,445 Jews were registered in Tashkent (5.5% of the total population)'”
```

#### Germany, Austria, Czech lands, Slovakia, Hungary, Balkans, Greece, Turkey — 68 findings in 29 towns

##### Bosnia and Herzegovina/Sarajevo

**[RAMP_OVERRIDES_SOURCED]** Row 1565-1894 ramps 75 -> 4060 over 330 years. It gives 547 in 1604, 669 in 1614, 1,371 in 1672 and 1,710 in 1700, versus the sourced about 15 (1604), about 150 (1614), about 500 (1672) and 425 (1700): 2.7x to 36x too high.

```text
L7131: Bosnia and Herzegovina | Sarajevo | est 550 | 1565–1894 | pop 75 → 4060 | high | https://he.wikipedia.org/wiki/%D7%99%D7%94%D7%93%D7%95%D7%AA_%D7%A1%D7%A8%D7%99%D7%99%D7%91%D7%95 | “Hebrew Wikipedia article "יהדות סרייבו" (based on Pinkas HaKehillot / Jewish community histories): ב-1565 התגוררו בסרייבו 15 משפחות יהודיות במגורי קבע באחד מרובעי המוסלמים.; 15 families (x5); estimate based on families”
```

**[COMMENT_MISMATCH]** Row 1948-2005 starts at 1600 'Jewish Holocaust survivors who LEFT Sarajevo and headed to Israel', i.e. emigrants, and then ramps to 500 over 57 years (982 in 1980, 751 in 1992). The emigration of 1948-49 is shown as a slow decline.

```text
L7149: Bosnia and Herzegovina | Sarajevo | est 550 | 1948–2005 | pop 1600 → 500 | medium | https://www.jewishgen.org/databases/holocaust/0142_Sarajevo_survivors.html | “Approximately 1,600 Jewish Holocaust survivors left Sarajevo and headed to Israel after the war”
```

##### Croatia/Zagreb

**[DERIVED]** 2001-2015 value 1275 is 'calculated based on three quarters of the estimated 1,700 Jews in Croatia'; a total times a share, not a count. The 2011 census gives 317 Jews in the city (4x lower).

```text
L15077: Croatia | Zagreb | est 1250 | 2001–2015 | pop 1275 → 1200 | medium | https://www.worldjewishcongress.org/en/about/communities/HR | “Calculated based on three quarters of the estimated 1,700 Jews in Croatia who live in the capital of Zagreb.”
```

**[INFLATED_DEFINITION]** Rows 2016-2021 ramp up to 2500 ('about 2,500 Jews living in Zagreb, organised in three communities', a tourist-site number) although the same file gives about 1,700 for all of Croatia (row 15077), 1,400 for Zagreb in 2022 and 317 in the 2011 census. The map shows a rise 1,200 -> 2,500 in 2016-2019 and then a fall to 1,400.

```text
L15085: Croatia | Zagreb | est 1250 | 2016–2019 | pop 1200 → 2500 | high | https://he.wikipedia.org/wiki/%D7%99%D7%94%D7%93%D7%95%D7%AA_%D7%96%D7%90%D7%92%D7%A8%D7%91 | “Hebrew Wikipedia article "יהדות זאגרב" (based on Pinkas HaKehillot / Jewish community histories): ב-2016 התגוררו בזאגרב 1,200 יהודים ו”
L15087: Croatia | Zagreb | est 1250 | 2019–2021 | pop 2500 → 1400 | high | https://www.jewishtraveler.co.il/jewish-heritage-in-zagreb/ | “Today there are about 2,500 Jews living in Zagreb, organized into three Jewish communities.”
```

**[CONFLICT]** 1808-1812: 52 Jews (Gradec census) ramp to 260 (52 families x5) although the same source row says the community had 70 individually named members; the map shows 156 in 1810 and 260 in 1812 against 52-70 documented persons (3.7-5x).

```text
L15029: Croatia | Zagreb | est 1250 | 1808–1812 | pop 52 → 260 | high | https://eu-central-1.graphassets.com/AP8v63MU8RVuXGEwz27MNz/0dPwT1LLRh6eTlxQSDJP | “The Gradec census recorded 60 total persons, of which 52 were Jews.”
L15032: Croatia | Zagreb | est 1250 | 1812–1834 | pop 260 → 234 | high | https://eu-central-1.graphassets.com/AP8v63MU8RVuXGEwz27MNz/0dPwT1LLRh6eTlxQSDJP | “Estimate based on families. The Jewish municipality of Zagreb contained 52 families, with 70 individually named members explicitly listed in the bishopric census.”
```

**[OTHER]** city_other is 'Hotel Dubrovnik', a hotel name, not a name of the city.

```text
L15028: Croatia | Zagreb | est 1250 | 1806–1807 | pop 75 → 52 | high | https://he.wikipedia.org/wiki/%D7%99%D7%94%D7%93%D7%95%D7%AA_%D7%96%D7%90%D7%92%D7%A8%D7%91 | “Hebrew Wikipedia article "יהדות זאגרב" (based on Pinkas HaKehillot / Jewish community histories): ב-1806 נוסדה רשמית הקהילה היהודית בזאגרב עת התגוררו בה 75 יהודים.”
```

##### Czech Republic/Brno

**[EXPULSION_RAMP]** Row 1348-1705 ramps 1000 -> 52 over 357 years although the file's own narrative rows (15496, 15497) say the Jews were expelled in 1454 (JE: 1451) and excluded afterwards. The map shows 719 in 1454 and 331 in 1600, i.e. a large community in the 16th-17th centuries.

```text
L15491: Czech Republic | Brno | est 1091 | 1348–1705 | pop 1000 → 52 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/brno | “About 1000 Jews in Brno (city); Brno Jews paid more tax than Olomouc or Znojmo; largest Moravian Jewish community”
```

**[RAMP_OVERRIDES_SOURCED]** Rows 1834-1858 ramp 134/135 -> 2230 (2230 is the 1859 EJ figure). The ramp gives 1,357 in 1848, while row 15505 gives 445 for 1848 (3x).

```text
L15502: Czech Republic | Brno | est 1091 | 1834–1858 | pop 134 → 2230 | high | https://www.jewishvirtuallibrary.org/brno | “Encyclopaedia Judaica figure for Brno”
L15503: Czech Republic | Brno | est 1091 | 1834–1858 | pop 135 → 2230 | high | https://cs.wikipedia.org/wiki/Židé_v_Brně | “135 Jews in city and suburbs together out of 17262 inhabitants; cs Wikipedia”
```

**[WARTIME_COUNT]** Rows 1930-1947 ramp the pre-war 10202/11103 linearly to 1033 (the 1948 survivors count). The map shows 4,808 for 1940 and 2,112 for 1945, i.e. a smooth 17-year decline instead of a stable community until the 1941-42 deportations and a near-zero 1945.

```text
L15520: Czech Republic | Brno | est 1091 | 1930–1947 | pop 10202 → 1033 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/brno | “Czechoslovak census 1930 by religion; 6.9% of total population; only 3295 declared Jewish nationality”
L15521: Czech Republic | Brno | est 1091 | 1930–1947 | pop 11103 → 1033 | high | https://en.wikipedia.org/wiki/The_Holocaust_in_Bohemia_and_Moravia | “Wikipedia gives Brno 11103 Jews (4.2 per cent) citing Gruner 2015 for 1930 census; conflicts with 10202 and percentage; Czech-lands paragraph”
```

**[CONFLICT]** 2020-2024: 'about 300 Jews remain' versus 100 in the 2021 census (religion); the map shows the higher figure (3x).

```text
L15543: Czech Republic | Brno | est 1091 | 2020–2024 | pop 300 → — | high | https://www.prospectmagazine.co.uk/world/40387/return-to-brno-an-overdue-memorial-to-the-citys-disappeared-jew… | “About 300 Jews remain in the city.”
L15544: Czech Republic | Brno | est 1091 | 2021–2021 | pop 100 → 100 | high | https://csu.gov.cz/docs/107508/4250766c-69e6-3845-0eb4-580f7a692558/sldb2021_vira.csv?version=2.0 | “Czech census 2021 (26 Mar 2021): religion = Judaism; Federation of Jewish Communities 29 + Judaism 71. Municipality (obec) = the town. The religion question was voluntary (about 30% gave no answer), so this is a minimum. Unit: persons. Nationality "Jewish" (Zidovska) in the same census: 53 (http://pop-stat.mashke.org/czechia-ethnic-loc2021.htm).”
```

##### Czech Republic/Hranice

**[WARTIME_COUNT]** Row 1939 is '197 residents of the Jewish religion were killed in the Holocaust between 1939 and 1945', a victim count, used as the population (197 in 1939 vs 143 in 1938 and 192 in 1930).

```text
L16081: Czech Republic | Hranice | est 1475 | 1939–1939 | pop 197 → 197 | high | https://cja.huji.ac.il/hmm/browser.php?mode=set&id=46441 | “197 residents of the Jewish religion were killed in the Holocaust between 1939 and 1945.”
```

##### Czech Republic/Třešť

**[GAP]** 621 (1845-1879, pop_end blank) is followed by no row until the 1900 census (169); the community of roughly 400-600 Jews vanishes from the map for 1880-1899, and again after 1900 until 1930 (64 at 1930-1938, with nothing after 1938).

```text
L18157: Czech Republic | Třešť | est 1250 | 1845–1879 | pop 621 → — | high | https://cdp.jewishgen.org/eastern-europe/czech-republic/trest | “The Jewish population in Třešť was 621 people.”
L18163: Czech Republic | Třešť | est 1250 | 1900–1900 | pop 169 → 169 | high | https://kramerius5.nkp.cz/view/uuid:0e3d4b60-c4ee-11ea-b7a2-005056827e51?page=uuid:de13a706-c487-4c89-973d-d51… | “Austrian census of 31 Dec 1900 (Lexikon obcí pro kralovstvi a zeme na risske rade zastoupene, X. Morava, Vienna 1906, printed page 98): 169 Jews (israelitisch) of 4773 inhabitants in municipality Třešť (Triesch). Jews by confession.”
```

##### Germany/Cologne

**[EXPULSION_RAMP]** Row 1340-1423 ramps 800 -> 0. The Cologne community was destroyed in 1349 and re-founded 1372 (about 80 persons, row 31131; 'never more than 3...' row 31133 in 1398) and expelled in 1424. The ramp shows 607 in 1360 (nobody there) and 492 in 1372 (sourced about 80, 6x).

```text
L31124: Germany | Cologne | est 321 | 1340–1423 | pop 800 → 0 | high | https://www.stadt-koeln.de/artikel/71044/index.html | “About 800 people lived in the Jewish quarter around 1340 at its greatest extent (city total 40000)”
```

**[EXPULSION_RAMP]** Row 1424-1800 ramps 0 -> 85, i.e. a growing presence (40 in 1600) although the comment says Jews were expelled in 1424 and 'rigorously excluded' until the late 18th century (some lived in Deutz). 0 should be a documented absence, not a 376-year growth ramp.

```text
L31135: Germany | Cologne | est 321 | 1424–1800 | pop 0 → 85 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/cologne | “Jews expelled in 1424 when the residence privilege was not renewed and banned from the city for all eternity; rigorously excluded until the late 18th century (some lived in Deutz across the Rhine)”
```

**[WARTIME_COUNT]** Row 1942-1944 starts at 3500, taken from 'further deportations brought more than 3500 people to Theresienstadt' (a deportee count), and ramps to 35; row 31154 (1941) has pop_end 3500 from the same figure. The map shows 3,500 persons in 1942 and about 1,800 in 1943 as residents.

```text
L31154: Germany | Cologne | est 321 | 1941–1941 | pop 3000 → 3500 | high | https://nsdok.de/Memorial-book-for-the-Jewish-victims-of-National-Socialism | “Jewish men, women, and children were deported to the Litzmannstadt and Riga ghettos”
L31155: Germany | Cologne | est 321 | 1942–1944 | pop 3500 → 35 | high | https://nsdok.de/Memorial-book-for-the-Jewish-victims-of-National-Socialism | “Starting in summer, further deportations brought more than 3500 people from Cologne to the Theresienstadt ghetto as well as directly to the NS extermination camps”
```

##### Germany/Frankfurt am Main

**[RAMP_OVERRIDES_SOURCED]** Row 1610-1932 ramps 3000 -> 26000 over 322 years (3000 is the 1610 ghetto figure, 26000 is a 1933 prewar total). It gives 9,429 in 1700, 13,000 in 1750, 17,786 in 1817, 20,286 in 1852 and 21,643 in 1871, versus the sourced 2,000 (1700), 3,000 (1750), 3,298 (1817), 5,300 (1852) and 10,009 (1871): 2x to 5x too high for three centuries. The row hides the whole sourced 18th and 19th-century series.

```text
L33726: Germany | Frankfurt am Main | est 900 | 1610–1932 | pop 3000 → 26000 | high | https://war-documentary.info/frankfurt-holocaust-memorial-at-borneplatz/ | “"Jewish population cramped into around two hundred houses"”
```

**[WARTIME_COUNT]** Row 1945-2010 starts at 12000, taken from a comment about Frankfurt victims of Nazi mass murder commemorated on the cemetery wall (a victim count), and ramps to 7200. The map shows 11,631 in 1950 and 8,751 in 1989 against the sourced 1,485 (1950), 2,837-4,122 (1964) and 4,842 (1989); in the postwar decades it hides every real count by a factor 2.5-8.

```text
L33758: Germany | Frankfurt am Main | est 900 | 1945–2010 | pop 12000 → 7200 | high | https://www.juedischesmuseum.de/en/visit/old-jewish-cemetery-frankfurt/ | “"Frankfurt victims of Nazi mass murder commemorated on cemetery wall"”
```

**[RAMP_OVERRIDES_SOURCED]** Rows 1933-1944 ramp 26000/26158 -> 12000, where 12000 is the victim count from the next row. They give 18,435 in 1939 (sourced 13,751), 15,860 in 1941 (10,592) and 13,287 in 1943 versus 572 recorded on 31 March 1943 (row 33757), 23x too high.

```text
L33750: Germany | Frankfurt am Main | est 900 | 1933–1944 | pop 26000 → 12000 | medium | https://encyclopedia.ushmm.org/content/en/article/jewish-communities-of-prewar-germany | “"Approximate Jewish population (Prewar)"”
L33751: Germany | Frankfurt am Main | est 900 | 1933–1944 | pop 26158 → 12000 | high | http://en.juedisches-frankfurt.de/ | “"Jewish population (largest share among Germany's major cities)"”
```

**[CONFLICT]** 1947: 400 (Gemeinde members, AJYB) versus 1462 (after-the-shoah.org, includes DPs/non-members): 3.7x. Different definitions, the map shows the higher number without a note.

```text
L33762: Germany | Frankfurt am Main | est 1074 | 1947–1947 | pop 400 → 400 | high | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=2035&ownerType=0&ownerId=2632 | “AJYB vol. 49 (1947-48), p. 364 (PDF page 46): Gemeinde members (table "Jewish Population by City", column "Number of Jews in 1947"; cities with 100 or more Gemeinde members); as of first quarter of 1947: 400.”
L33763: Germany | Frankfurt am Main | est 1074 | 1947–1947 | pop 1462 → 1462 | high | https://www.after-the-shoah.org/frankfurt-juedische-dp-gemeinde-jewish-dp-community/ | “after-the-shoah.org (Nuremberg Institute for Holocaust Studies lexicon "Juedische DP Lager und Gemeinden in Westdeutschland"), entry "Frankfurt – Jüdische DP-Gemeinde": Jewish DP community (displaced persons and Jews living in the town, members of the committee/community); population: 1,462 May 1947 (population field of the page); other counts in 1947: 1,285…”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1412-1461 ramps 135 -> 110; its own comment says households fell from about 27 to about 4 between 1412 and 1416 (about 20 persons), and row 33699 gives about 60 for 1425. The ramp gives 128 in 1425 (2.1x the sourced 60) and 133 in 1416 after the collapse.

```text
L33694: Germany | Frankfurt am Main | est 900 | 1412–1461 | pop ~135 → 110 | low | https://en.wikipedia.org/wiki/Frankfurter_Judengasse | “Between 1412 and 1416, the number of Jewish households dropped from about 27 to about 4. [Population: households x5, source gives about 27 households in 1412]”
```

**[OTHER]** city_german is 'U60311' (a postal code / station code) instead of a German name; clear garbage in the name column.

```text
L33680: Germany | Frankfurt am Main | est 1074 | 1340–1340 | pop 200 → 200 | low | https://xn--jdische-gemeinden-22b.de/index.php/gemeinden/e-g/637-frankfurt-main-hessen | “Lexikon table 'Juden in Frankfurt/M.': um 1340 = 'ca. 200 Juden' (approximate, c. 1340), i.e. the community before the Black Death massacre of 1349. Secondary compilation (Alicke Lexikon).”
```

##### Germany/Hamburg

**[OTHER]** city_german column is 'Reichsfestung Belgrad' (a fortress at Belgrade), unrelated to Hamburg; a wrong name copied into the Hamburg rows.

```text
L36242: Germany | Hamburg | est 1577 | 1595–1608 | pop 35 → 98 | high | https://keydocuments.net/topic/demographics-and-social-structure | “Estimate based on families. Most likely seven Portuguese Jewish families living in Hamburg.”
```

##### Germany/Hannover

**[RAMP_OVERRIDES_SOURCED]** Row 1540-1799 ramps 40 -> 500 (500 is the 'beginning of the 19th century' figure). It gives 498 for 1798, while the Lexikon row 36465 gives 42 households (about 210) in 1798: 2.4x.

```text
L36450: Germany | Hannover | est 1292 | 1540–1799 | pop 40 → 500 | low | https://www.jewishvirtuallibrary.org/hanover | “Households x 5: in 1540 three Jewish families lived in the old city and five in the new city = 8 families (Encyclopaedia Judaica text on JVL). Outside the c. 800-1500 range, entered as the only count the sources give.”
```

**[CONFLICT]** Row 1900-1932 starts at 5000 and ramps to 13000 (taken from a 1933 USHMM-table value), then row 36469 falls 13000 -> 4800 by 1935 and the next row says 4,800 in 1936-37 and 1938. A drop of 8,200 (63%) in three years is far beyond emigration then (and 5,000 in 1900 -> 13,000 in 1933 has no support); the 13,000 looks like a wrong or non-city figure. The map shows 9,848 in 1920.

```text
L36468: Germany | Hannover | est 1292 | 1900–1932 | pop 5000 → 13000 | high | https://everything.explained.today/History_of_the_Jews_in_Hannover/ | “At the beginning of the 20th century, about 5000 Jews lived in Hanover.”
L36469: Germany | Hannover | est 1292 | 1933–1935 | pop 13000 → 4800 | high | https://encyclopedia.ushmm.org/content/en/article/germany-jewish-population-in-1933 | “The Jewish population in Hannover was about 13,000.”
L36470: Germany | Hannover | est 1292 | 1936–1937 | pop 4800 → 4800 | high | https://everything.explained.today/History_of_the_Jews_in_Hannover/ | “Due to persecutions, the number of Hanoverian Jews dropped to about 4800 people.”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1989-2008 ramps 379 -> 6200; it gives 2,217 in 1995, while the Lexikon row 36486 gives 763 for 1995 (2.9x).

```text
L36485: Germany | Hannover | est 1292 | 1989–2008 | pop 379 → 6200 | high | https://zwst.org/sites/default/files/2024-06/ZWST-Mitgliederstatistik-2023-RZ-web.pdf | “Members of the Jüdische Gemeinde Hannover.”
L36486: Germany | Hannover | est 1292 | 1995–1995 | pop 763 → 763 | medium | https://xn--jdische-gemeinden-22b.de/index.php/gemeinden/h-j/839-hannover-niedersachsen | “K.-D. Alicke, Lexikon der jüdischen Gemeinden (online edition juedische-gemeinden.de), page 'Hannover (Niedersachsen)', list 'Juden in ...': line '--- 1995 .. 763'. Count of the Jews of the town (the ditto marks of the list stand for 'Juden'); the source of the figure is not stated per line, exact figure as printed.”
```

**[CHAIN_SUBSET]** Rows 2023-2026 ramp 3783/3800 (one congregation) -> 700, and 700 is 'the Liberal Jewish Community Hannover' (another congregation); 2025-26 shows only 700, while the summed counts of the 3 communities are 5,161 in 2020 and 5,413 in 2010. The map shows a fall from about 5,000 to 700 within 2 years.

```text
L36494: Germany | Hannover | est 1292 | 2023–2024 | pop 3783 → 700 | high | https://zwst.org/sites/default/files/2024-06/ZWST-Mitgliederstatistik-2023-RZ-web.pdf | “Members in the Jüdische Gemeinde Hannover.”
L36495: Germany | Hannover | est 1292 | 2023–2024 | pop 3800 → 700 | high | https://everything.explained.today/History_of_the_Jews_in_Hannover/ | “The Jüdische Gemeinde Hannover K.d.ö.R. (Central Jewish Community) comprised around 3,800 members.”
L36496: Germany | Hannover | est 1292 | 2025–2026 | pop 700 → — | high | https://everything.explained.today/History_of_the_Jews_in_Hannover/ | “The Liberal Jewish Community Hannover has about 700 members.”
```

##### Germany/Leipzig

**[EXPULSION_RAMP]** Row 1349-1765 ramps 0 -> 40 over 416 years; its comment says the whole Jewish population was burned in 1349. The ramp shows a gradual growing presence (about 14 at 1500) instead of absence followed by a late-18th-century settlement.

```text
L40029: Germany | Leipzig | est 1190 | 1349–1765 | pop 0 → 40 | high | https://de.wikipedia.org/wiki/Geschichte_der_Juden_in_Leipzig | “Margrave Frederick burned the entire Jewish population of Leipzig in February 1349 (source: entire Jewish population destroyed)”
```

##### Hungary/Miskolc

**[CHAIN_SUBSET]** Row 1843-1912 ramps 6 -> 200: 6 is the number of Jews named in documents on tuition/licences, 200 is the number of Jewish pupils at the Catholic grammar school (row 57348). The map shows 110 in 1880 and 166 in 1900 for the years in which the file has 5,117 Jews (1880, row 57341) and 11,300 (1920); the 1881-1912 period has no real count at all.

```text
L57338: Hungary | Miskolc | est 1727 | 1843–1912 | pop 6 → 200 | high | http://www.iijg.org/wp-content/uploads/2014/02/MiscolcTable.pdf | “6 Jewish individuals recorded concerning tuition payments, licensing, and settlement permits.”
```

**[CHAIN_SUBSET]** Rows 1913-1919 use school rolls and unrelated facts as population: 200 Jewish pupils of one grammar school, 2,187/2,571 pupils of all schools (pe 2571), 'Ede Grunwald graduated from the Catholic Gymnasium' (a person), and 'ultra-Orthodox Sephardim numbered 150'. The map shows about 200 to 2,571 Jews in 1913-1919 while the 1920 count is 11,300.

```text
L57348: Hungary | Miskolc | est 1727 | 1913–1914 | pop 200 → 2571 | high | https://journals.pan.pl/Content/96410/mainfile.pdf?handler=pdf | “200 Jews studied at the Royal Catholic Grammar School in Miskolc.”
L57349: Hungary | Miskolc | est 1727 | 1915–1916 | pop 2571 → 200 | high | https://journals.pan.pl/Content/96410/mainfile.pdf?handler=pdf | “2,187 Jewish students attended schools in Miskolc (1,109 at Jewish schools, 1,078 at other schools).”
L57350: Hungary | Miskolc | est 1727 | 1917–1918 | pop 200 → 200 | high | https://kehilalinks.jewishgen.org/miskolc/grunwald.html | “Ede Grunwald graduated from the Catholic Gymnasium in Miskolc.”
L57351: Hungary | Miskolc | est 1727 | 1919–1919 | pop 200 → 2571 | high | https://journals.pan.pl/Content/96410/mainfile.pdf?handler=pdf | “The ultra-Orthodox minority (Sephardim) numbered 150 individuals.”
```

**[CHAIN_SUBSET]** Row 57361 (1941-1943) ramps 10428 -> 25, where 25 is 'seniors at the Teacher Training Institute'; row 57360 uses 500 people deported to Poland (a deportee count) -> 25, and rows 57364/57365 use 25 seniors and 3 members of the Grunwald family. The map shows 5,226 in 1942 and 25 in 1943, although the deportation of 14,000 took place in 1944.

```text
L57360: Hungary | Miskolc | est 1727 | 1941–1943 | pop 500 → 25 | high | https://kehilalinks.jewishgen.org/miskolc/holocaust.html | “Some 500 people were deported from the city to the German-occupied part of Poland.”
L57361: Hungary | Miskolc | est 1727 | 1941–1943 | pop 10428 → 25 | high | https://journals.pan.pl/Content/96410/mainfile.pdf?handler=pdf | “Jewish population in Miskolc (13.5% of the total population).”
L57364: Hungary | Miskolc | est 1727 | 1943–1943 | pop 25 → 14000 | high | https://journals.pan.pl/Content/96410/mainfile.pdf?handler=pdf | “Seniors at the Teacher Training Institute numbered 25, the last class completing exams.”
L57365: Hungary | Miskolc | est 1727 | 1943–1943 | pop 3 → 14000 | high | https://kehilalinks.jewishgen.org/miskolc/grunwald.html | “Roza Grunwald lived in Miskolc and was joined by her daughter-in-law Franciska and grandson Henrik.”
```

**[WARTIME_COUNT]** 1939-1945 chain uses 14000 (a 'prior to deportations' and 'carried off to Nazi...' figure, i.e. the ghetto/deportee count) as the population: row 57357 ramps 10428 -> 14000, row 57358 starts at 14000, and row 57366 (1944-45) starts at 14000. The 1941 census gives 10,428 (13.5%), so the map overstates the pre-deportation community by 34%.

```text
L57357: Hungary | Miskolc | est 1727 | 1939–1939 | pop 10428 → 14000 | high | https://kehilalinks.jewishgen.org/miskolc/holocaust.html | “At the beginning of World War II, there were 10,428 Jews in Miskolc.”
L57358: Hungary | Miskolc | est 1727 | 1940–1940 | pop 14000 → 500 | high | https://data.jewishgen.org/IMAGEDATA/JOWBR/HUNG-04104/Miskolc.html | “In the 1940s prior to the deportations, it was reported to have a Jewish population of about 14,000.”
L57366: Hungary | Miskolc | est 1727 | 1944–1945 | pop 14000 → 2353 | high | https://kehilalinks.jewishgen.org/miskolc/holocaust.html | “During the summer of 1944, 14,000 Jewish-classified Hungarian city-residents were carried off to Nazi death camps from the Miskolc ghetto.”
```

**[COMMENT_MISMATCH]** Rows 1812-1842 use the number of Jews named in archival documents (e.g. '2 Jewish individuals (Altman, Onod) recorded for debt repayment', '25 Jewish individuals conscripted') as the town's Jewish population: values 2-28, versus 861 Jews in 1847 (row 57339).

```text
L57320: Hungary | Miskolc | est 1727 | 1812–1819 | pop 10 → 2 | high | http://www.iijg.org/wp-content/uploads/2014/02/MiscolcTable.pdf | “10 Jewish individuals (Braun, Tolcsva, Stern, Lusztog, Brody, Katz, Czukermandl, Berger, Grunfeld, Bik) are recorded serving in Kehilla and Hevra Kadisha roles.”
L57325: Hungary | Miskolc | est 1727 | 1830–1833 | pop 2 → 28 | high | http://www.iijg.org/wp-content/uploads/2014/02/MiscolcTable.pdf | “2 Jewish individuals (Fleischer, Beresh) recorded in Miskolc.”
L57328: Hungary | Miskolc | est 1727 | 1833–1833 | pop 28 → 6 | high | http://www.iijg.org/wp-content/uploads/2014/02/MiscolcTable.pdf | “28 Jewish individuals recorded purchasing seats, making donations, or engaged in disputes.”
L57335: Hungary | Miskolc | est 1727 | 1840–1840 | pop 10 → 25 | high | http://www.iijg.org/wp-content/uploads/2014/02/MiscolcTable.pdf | “10 Jewish individuals recorded as participants in delegations or elected to county kehilla roles.”
L57336: Hungary | Miskolc | est 1727 | 1841–1841 | pop 25 → 5 | high | http://www.iijg.org/wp-content/uploads/2014/02/MiscolcTable.pdf | “25 Jewish individuals from Miskolc were conscripted.”
```

##### Hungary/Mátészalka

**[WARTIME_COUNT]** Row 1941-1943 ramps 1555 -> 16000 and row 57021 (1944) starts at 16000: 16,000 is the number of people crowded in the Mátészalka ghetto, which gathered Jews from the whole district. The map shows 8,778 in 1942 and 16,000 in 1944 for a town whose 1941 count is 1,555 (15% of the population).

```text
L57020: Hungary | Mátészalka | est 1753 | 1941–1943 | pop 1555 → 16000 | high | https://www.memorialmuseums.org/memorialmuseum/memorial-to-the-mateszalka-ghetto?locale=en | “1,555 Jews lived in Mátészalka, equating to 15 per cent of the total population.”
L57021: Hungary | Mátészalka | est 1753 | 1944–1944 | pop 16000 → 150 | high | https://www.memorialmuseums.org/memorialmuseum/memorial-to-the-mateszalka-ghetto?locale=en | “More than 16,000 Jewish children, women and men lived in a very confined space in the Mátészalka ghetto.”
```

##### Romania/Arad

**[CHAIN_SUBSET]** Rows 1942-1943 ramp 9402 (1941 count) -> 120, where 120 is the starting number of row 102903 (a refugee count); Arad's Jews were not deported. The map shows 120 in 1943 and then ramps 120 -> 13200 over 1944-1946 (6,660 in 1945), so the community of about 9,400 collapses for two years.

```text
L102901: Romania | Arad | est 1717 | 1942–1943 | pop 9402 → 120 | high | https://www.jewishgen.org/databases/holocaust/0146_Arad_Census.html | “Jewish population recorded (increase due to concentration from surrounding areas).”
L102902: Romania | Arad | est 1717 | 1942–1943 | pop 9472 → 120 | high | https://jbat.lbi.org/locality/arad | “Jewish population recorded.”
L102903: Romania | Arad | est 1717 | 1944–1946 | pop 120 → 13200 | high | https://www.wilsoncenter.org/publication/236-between-hungary-and-romania-the-case-the-southern-transylvanias-j… | “Jewish refugees from Hungary recorded in Arad during August.”
```

**[HELD_FLAT]** 'About 380 members' is held 2000-2026, while the file has census counts 169 (2002), 98 (2011) and 74 (2021); the map shows up to 5x the census value for 26 years.

```text
L102908: Romania | Arad | est 1717 | 2000–2026 | pop 380 → — | high | https://jbat.lbi.org/locality/arad | “Jewish community had about 380 members.”
L102909: Romania | Arad | est 1717 | 2002–2002 | pop 169 → 169 | high | http://pop-stat.mashke.org/romania-religion-comm2002.htm | “Romanian census 2002 (18 Mar 2002): persons of Mozaica (Mosaic/Jewish) religion in the municipality/town. Unit: persons.”
L102911: Romania | Arad | est 1717 | 2021–2021 | pop 74 → 74 | high | http://pop-stat.mashke.org/romania-religion-comm2021.htm | “Romanian census 2021 (reference 1 Dec 2021): persons of Mozaica (Mosaic/Jewish) religion in the municipality/town. Many residents gave no religion, so a minimum. Unit: persons.”
```

##### Romania/Bacău

**[GAP]** Last count is 18000 in 1945 (single year); the next row is the 1992 census (244). The community of thousands (about 10,000 in 1930) vanishes from the map for 1946-1991.

```text
L102974: Romania | Bacău | est 1367 | 1945–1945 | pop 18000 → 18000 | high | https://www.jewishgen.org/Yizkor/Bacau1/bac009.html | “In 1945, after the end of the war, the number of Jews increased and reached 18,000.”
L102975: Romania | Bacău | est 1772 | 1992–1992 | pop 244 → 244 | high | http://pop-stat.mashke.org/romania-religion-comm1992.htm | “Romanian census 1992 (7 Jan 1992): persons of Mozaica (Mosaic/Jewish) religion in the municipality/town. Unit: persons.”
```

##### Romania/Botoșani

**[RAMP_OVERRIDES_SOURCED]** Row 1956-1999 ramps 10000 -> 200 with no comment. The map shows 6,809 in 1970 and 1,795 in 1992 versus the 1992 census 145 (12x); 2000-2002 row says 200 -> 92 and the 2002 census 71.

```text
L103246: Romania | Botoșani | est 1500 | 1956–1999 | pop 10000 → 200 | high | https://roholocaust.com/event/51~jews-in-boto%C8%99ani-during-Holocaust | “”
```

**[OTHER]** Series zigzags with no explanation: 8,885 (1839, '1777 family heads' x5) ramps to 3,340 in 1845 (row 103236 has an empty comment) and then to 13,000 in 1858. A fall of 62% in six years and a rise of 290% in thirteen is not supported by a comment; the 3,340 figure has no stated basis.

```text
L103235: Romania | Botoșani | est 1500 | 1839–1844 | pop 8885 → 3340 | high | http://www.inshr-ew.ro/wp-content/uploads/2018/01/Botosani.pdf | “Estimate based on families (1777 Jewish family heads)”
L103236: Romania | Botoșani | est 1500 | 1845–1858 | pop 3340 → 13000 | high | http://www.inshr-ew.ro/wp-content/uploads/2018/01/Botosani.pdf | “”
```

##### Romania/Bălți

**[HOMONYM]** All seven rows describe Bălți in Bessarabia (10,348 Jews in the 1897 census, 14,229 in the 1930 census, escape before the 1941 Axis occupation), but the pin is at 26.349 E, 46.957 N, a point in Neamț/Bacău region of Moldavia in Romania, about 150 km from the real Bălți (about 27.93 E, 47.76 N, now Moldova). Coordinates (and probably country) belong to another place.

```text
L103006: Romania | Bălți | est 1782 | 1817–1863 | pop 1220 → 3124 | high | https://www.jewishgen.org/yizkor/balti/bal024.html | “Estimate based on families. Census recorded 244 male heads of families (39.4% of the population)”
L103007: Romania | Bălți | est 1782 | 1864–1896 | pop 3124 → 10348 | high | https://www.jewishgen.org/yizkor/balti/bal024.html | “Jewish population accounted for 38.7% of the total population”
L103008: Romania | Bălți | est 1782 | 1897–1925 | pop 10348 → 21000 | high | https://www.jewishgen.org/yizkor/balti/bal024.html | “General census recorded 10,348 Jews, making up 57% of the population”
L103009: Romania | Bălți | est 1782 | 1926–1929 | pop 21000 → 14000 | high | https://www.jewishgen.org/yizkor/balti/bal024.html | “Jewish population recorded out of a total population of 35,000”
L103010: Romania | Bălți | est 1782 | 1930–1940 | pop 14000 → 15000 | high | https://www.memorialmuseums.org/memorialmuseum/holocaust-memorial-b%C4%83l%C5%A3i?locale=en | “About 14,000 Jews living in Bălți, just under half of the total population”
L103011: Romania | Bălți | est 1782 | 1930–1940 | pop 14229 → 15000 | high | https://kids.kiddle.co/History_of_B%C4%83l%C8%9Bi | “Romanian census recorded 14,229 Jews by ethnicity”
L103012: Romania | Bălți | est 1782 | 1941–1941 | pop 15000 → 15000 | high | https://kids.kiddle.co/History_of_B%C4%83l%C8%9Bi | “Most of the 15,000 Jewish people in the city managed to escape in the weeks prior to Axis occupation”
```

##### Romania/Cluj-Napoca

**[CHAIN_SUBSET]** Row 1941-1943 ramps 16763 -> 750, where 750 is 'about 150 families arrested on 28 March 1944' x5 (row 103625), a subset of the community. The map shows 8,757 in 1942 and 750 in 1943, a year before the deportations; row 103625 then ramps from 750 (arrested families) to 6500.

```text
L103624: Romania | Cluj-Napoca | est 1481 | 1941–1943 | pop 16763 → 750 | high | http://www.inshr-ew.ro/wp-content/uploads/2018/01/Cluj.pdf | “Census recorded 16,763 Jews (15.1% of the total population).”
L103625: Romania | Cluj-Napoca | est 1481 | 1944–1946 | pop 750 → 6500 | high | https://jewishgen.org/yizkor/Cluj-Napoca/clu286.html | “Estimate based on families. On the night of March 28, members of the presidium of the Jewish congregations were arrested, in addition to about 150 families.”
```

**[WARTIME_COUNT]** Row 1944-1946 starts at 18000, the number of internees in the ghetto (which held people from the surrounding area), and ramps to 6500; the other 1944 rows give 750 and 150 (arrested people). The map shows 18,000 as the 1944 Jewish population, above the 1941 census 16,763 and the 1930 count.

```text
L103627: Romania | Cluj-Napoca | est 1481 | 1944–1946 | pop 18000 → 6500 | high | https://roholocaust.com/event/54~jews-in-Cluj-Napoca-during-the-Holocaust | “The number of internees in the ghetto soon reached 18,000.”
L103626: Romania | Cluj-Napoca | est 1481 | 1944–1946 | pop 150 → 6500 | high | http://www.inshr-ew.ro/wp-content/uploads/2018/01/Cluj.pdf | “Around 150 Jewish intellectuals and wealthy individuals were arrested on March 27.”
```

**[HELD_FLAT]** '1,100 Jews (340 families)' is held 1970-2026 although the file has census counts 340 (1992), 227 (2002), 141 (2011), 99 (2021); the map shows 11x the 2021 census for decades.

```text
L103629: Romania | Cluj-Napoca | est 1481 | 1970–2026 | pop 1100 → — | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/cluj | “1,100 Jews (340 families) remained registered with the community.”
L103630: Romania | Cluj-Napoca | est 1481 | 1992–1992 | pop 340 → 340 | high | http://pop-stat.mashke.org/romania-religion-comm1992.htm | “Romanian census 1992 (7 Jan 1992): persons of Mozaica (Mosaic/Jewish) religion in the municipality/town. Unit: persons.”
L103633: Romania | Cluj-Napoca | est 1481 | 2021–2021 | pop 99 → 99 | high | http://pop-stat.mashke.org/romania-religion-comm2021.htm | “Romanian census 2021 (reference 1 Dec 2021): persons of Mozaica (Mosaic/Jewish) religion in the municipality/town. Many residents gave no religion, so a minimum. Unit: persons.”
```

##### Romania/Galați

**[RAMP_OVERRIDES_SOURCED]** Row 1969-2004 ramps 2250 (450 families x5) -> 252. The map shows 937 in 1992 and 366 in 2002, against the census counts of 220 (1992, 4.3x) and 123 (2002, 3x).

```text
L104088: Romania | Galați | est 1590 | 1969–2004 | pop 2250 → 252 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/galati | “450 families (x5 = ~2250); estimate based on families; two synagogues”
```

##### Romania/Iași

**[RAMP_OVERRIDES_SOURCED]** Row 1899-2006 ramps 39441 -> 492 over 107 years (39441 is a late-19th-century count, 492 is a 2007 member list). The map shows about 28,200 in 1930, 22,700 in 1945 and 5,588 in 1992, versus the 1992 census 616 (9x) and 2002 census 402 (ramp 1,948, 4.8x). The 1941 pogrom and mass emigration after 1945 are smoothed into a century-long slope.

```text
L104316: Romania | Iași | est 1450 | 1899–2006 | pop 39441 → 492 | high | https://kehilalinks.jewishgen.org/iasi/iasi.html | “Jewish population”
```

**[HOMONYM]** Comment says the 1930 census entry is 'Copou' (a quarter/commune, 285 Jews of 1075 inhabitants, 'stable population'), not the city of Iași, which had tens of thousands of Jews. A locality row has been attached to the Iași pin as if it were the city count.

```text
L104317: Romania | Iași | est 1450 | 1930–1930 | pop 285 → 285 | high | https://rusynsociety.com/wp-content/uploads/2022/05/recensamantul_1930.pdf#page=252 | “1930 Romanian census (29 Dec 1930), by ethnicity ('neam'): 285 Evrei (Jews) of 1075 inhabitants of the stable population (26.5%); mother tongue Yiddish (Idis) 166. Recensamantul general al populatiei Romaniei 1930, vol. II (neam, limba materna), table 'Populatia statornica in 1930 dupa neam si limba materna', entry 'Copou', PDF page 252 (archive.org item rec…”
```

**[HELD_FLAT]** A 2007 member count of 492 is held to 2026 although the file has census counts of 249 (2011) and 134 (2021); the map shows the higher 492 (3.7x the 2021 census) for 19 years.

```text
L104321: Romania | Iași | est 1450 | 2007–2026 | pop 492 → — | high | http://www.jewishfed.ro/downloads/carti/memoriacimitirelorevreiesti2007.pdf | “Total members of the Jewish Community in Iași”
```

##### Romania/Oradea

**[RAMP_OVERRIDES_SOURCED]** Row 1722-1730 ramps 20 -> 400, where 400 is a 1731 figure from the next row. It gives about 258 in 1727, while the 1727 conscription (row 104728) gives about 35 (7x); the next row then drops from 400 to 90 by 1736 (18 families).

```text
L104727: Romania | Oradea | est 1407 | 1722–1730 | pop 20 → 400 | high | https://cdp.jewishgen.org/eastern-europe/romania/oradea-bihor-county-transylvania | “First mention of Jewish population in Oradea is four families. Estimate based on families”
```

**[RAMP_OVERRIDES_SOURCED]** Row 1946-2000 ramps 6500 -> 1000 (pop_end taken from a later 'under 1,000' estimate). The map shows 4,056 in 1970 and 1,815 in 1992, versus the 1992 census 294 (6x).

```text
L104753: Romania | Oradea | est 1407 | 1946–2000 | pop 6500 → 1000 | high | https://roholocaust.com/event/72~jews-in-Oradea-during-the-Holocaust | “There were 6,500 Jews in the city, of whom 3,000 were from Beius, Chernivtsi, and Budapest”
L104756: Romania | Oradea | est 1407 | 2021–2021 | pop 134 → 134 | high | http://pop-stat.mashke.org/romania-religion-comm2021.htm | “Romanian census 2021 (reference 1 Dec 2021): persons of Mozaica (Mosaic/Jewish) religion in the municipality/town. Many residents gave no religion, so a minimum. Unit: persons.”
L104754: Romania | Oradea | est 1407 | 1992–1992 | pop 294 → 294 | high | http://pop-stat.mashke.org/romania-religion-comm1992.htm | “Romanian census 1992 (7 Jan 1992): persons of Mozaica (Mosaic/Jewish) religion in the municipality/town. Unit: persons.”
```

**[HELD_FLAT]** 'Less than 1,000' (a bound, not a count) is held as 1000 from 2001 to 2026 while the 2021 census shows 134 Jews; the map displays about 7.5x the census value for 26 years.

```text
L104755: Romania | Oradea | est 1407 | 2001–2026 | pop 1000 → — | medium | https://cdp.jewishgen.org/eastern-europe/romania/oradea-bihor-county-transylvania | “Jewish population estimated at less than 1,000”
L104756: Romania | Oradea | est 1407 | 2021–2021 | pop 134 → 134 | high | http://pop-stat.mashke.org/romania-religion-comm2021.htm | “Romanian census 2021 (reference 1 Dec 2021): persons of Mozaica (Mosaic/Jewish) religion in the municipality/town. Many residents gave no religion, so a minimum. Unit: persons.”
```

##### Romania/Satu Mare

**[CHAIN_SUBSET]** Row 1910-1925 ramps 7194 -> 70 and row 1926-1929 starts at 70: 70 is the membership of Zionist youth groups (45 + 25 members). The map shows 2,445 Jews in 1920 and 70 in 1925-26 in a community of 7,000-10,000 (10,693 in 1930).

```text
L105317: Romania | Satu Mare | est 1696 | 1910–1925 | pop 7194 → 70 | high | https://www.jewishgen.org/yizkor/Satu_Mare/sathu204.html | “20% of the total population.”
L105318: Romania | Satu Mare | est 1696 | 1926–1929 | pop 70 → 10693 | high | https://www.jewishgen.org/yizkor/Satu_Mare/sat145.html | “Zionist youth organizations included 45 members in two Barisiya groups and 25 members in the Aviva group.”
```

**[HELD_FLAT]** Row 1984-2026 holds 230 ('government estimates, but noted in reality to be no more than a few dozen'); the file has census counts 58 (1992), 38 (2002), 30 (2011), 68 (2021). The map shows up to 7.7x the censuses for 42 years.

```text
L105325: Romania | Satu Mare | est 1696 | 1984–2026 | pop 230 → — | high | https://www.jewishgen.org/yizkor/Satu_Mare/sat042.html | “According to government estimates, but noted in reality to be no more than a few dozen (source published 1984).”
```

##### Romania/Sighetu Marmației

**[WARTIME_COUNT]** Row 1941-1943 ramps 10144 (1941 census) -> 13000, where 13000 is the 1944 ghetto count (10,000 + 3,000 in two ghettos, which took in Jews from the surrounding villages). The map shows 11,572 in 1942 and 13,000 in 1943-44 for a town whose census is 10,144.

```text
L105424: Romania | Sighetu Marmației | est 1740 | 1941–1943 | pop 10144 → 13000 | high | https://encyclopedia.ushmm.org/content/en/article/sighet | “According to the Hungarian census, 10,144 Jews lived in Sighet, making up almost 40 percent of the town's population.”
L105425: Romania | Sighetu Marmației | est 1740 | 1944–1945 | pop 13000 → 2000 | high | https://encyclopedia.ushmm.org/content/en/article/sighet | “On April 20, 1944, Hungarian authorities established two ghettos in Sighet, imprisoning about 10,000 Jews in the large ghetto and 3,000 in the small ghetto.”
```

**[GAP]** Last row of the series is 1946 (2,000 Jews); the next is the 1992 census (31). The community that numbered about 2,000 vanishes for 1947-1991.

```text
L105426: Romania | Sighetu Marmației | est 1740 | 1946–1946 | pop 2000 → 2000 | high | https://jbat.lbi.org/locality/sighet-marmatiei | “In the years immediately after the war, the city once again briefly boasted about 2,000 Jews, but these were not born locally.”
```

##### Romania/Timișoara

**[RAMP_OVERRIDES_SOURCED]** Row 1971-2021 ramps 3000 -> 600 over 50 years. It gives 1,992 in 1992, 1,512 in 2002 and 1,080 in 2011, versus the censuses 556, 350 and 180 (3.6x, 4.3x and 6x).

```text
L105821: Romania | Timișoara | est 1515 | 1971–2021 | pop 3000 → 600 | high | https://jbat.lbi.org/locality/timisoara | “Population fallen to 3,000”
```

##### Serbia/Belgrade

**[CONFLICT]** 2000 (a community-membership figure for all Serbia 'residing in Belgrade'/tourist estimate) is mixed with census counts 415 (2002), 295 (2011), 365 (2022): the series zigzags 415 -> 2000 (2008) -> 295 (2011) -> 365 (2022) -> 2000 (2024-26). The map shows 2,000 in 2024-2026, 5.5x the 2022 census, and 2,000 in 2008-09 vs 295 two years later.

```text
L109968: Serbia | Belgrade | est 1250 | 2002–2008 | pop 415 → 2000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Serbia | “415 ethnic Jews in Belgrade in the 2002 census (table; ethnicity, not religion)”
L109970: Serbia | Belgrade | est 1000 | 2009–2010 | pop 2000 → 295 | high | https://cdp.jewishgen.org/eastern-europe/serbia/belgrade | “Today's Jewish population is about 2,000, including about 200 refugees from Sarajevo.”
L109973: Serbia | Belgrade | est 1250 | 2022–2024 | pop 365 → 2000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Serbia | “365 people listed Judaism as their religion in Belgrade in the 2022 census (city table)”
L109975: Serbia | Belgrade | est 1250 | 2024–2024 | pop 2000 → — | high | https://eurojewcong.org/_communities/serbia/ | “Today, the Jewish Community in Serbia has around 2,000 members residing in Belgrade.”
L109976: Serbia | Belgrade | est 1250 | 2025–2026 | pop 2000 → 2000 | estimate | Estimate: carried forward from 2024, not a source | “Estimate, not a measurement: the last sourced count for this town is 2,000 in 2024 (https://eurojewcong.org/_communities/serbia/); no newer count was found, so the same number is carried forward to 2026.”
```

##### Slovakia/Bratislava

**[HELD_FLAT]** An 'end of the 14th century' estimate (800) is ramped 800 -> 1000 over 1395-1706, i.e. 311 years, across the 1526 expulsion and the long period when the file's own rows show no community (the 1707 row restarts at about 200 families). The map draws 800-1000 Jews through the 16th-17th centuries.

```text
L110796: Slovakia | Bratislava | est 1241 | 1395–1706 | pop 800 → 1000 | medium | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Bratislava | “Approximately 800 Jews at the end of the 14th century (the year shown approximates the end of the century; total city population 5000 in 1435)”
```

**[CONFLICT]** 1707: 1000 (200 families x5, row 110815) versus 189 persons from 1709 (row 110816); the same community differs 5x within two years.

```text
L110815: Slovakia | Bratislava | est 1241 | 1707–1708 | pop 1000 → 189 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Bratislava | “Estimate based on families: about 200 Jewish families (mostly refugees under noble protection) in Schlossgrund, the district outside the walled city, x5; covers only that district”
L110816: Slovakia | Bratislava | est 1241 | 1709–1735 | pop 189 → 772 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/bratislava | “189 Jews living in Bratislava according to Encyclopaedia Judaica”
```

**[WARTIME_COUNT]** Row 1944-1948 holds 2000, the comment says 'about 2000 remaining Jews were sent to Auschwitz' in 1944 (a deportee count), and holds it through 1948 although those people were deported; the map shows 2,000 residents in 1944-1948.

```text
L110863: Slovakia | Bratislava | est 1241 | 1944–1948 | pop 2000 → 2000 | high | https://45aid.org/?p=9644 | “After the German occupation in September 1944 about 2000 remaining Jews of the city were sent to Auschwitz”
```

**[EXPULSION_RAMP]** Row 1350-1359 ramps 800 -> 0 (the 0 comes from the 1360 expulsion row), showing a slow decline over ten years for a community that the next row says was expelled c.1360 (about 440 in 1355).

```text
L110785: Slovakia | Bratislava | est 1241 | 1350–1359 | pop 800 → 0 | high | https://www.jewishgen.org/yizkor/pinkas_slovakia/Slo0XI.html | “The Pressburg community numbered close to 800 people and seems to have been the largest in the kingdom.”
```

##### Slovakia/Košice

**[COMMENT_MISMATCH]** Row 1492-1523 holds 800 with the comment 'Approximately 800 Jews live in Košice today' (a modern tourism-guide number) placed in the 15th-16th centuries, where the other row (111842) gives a minyan (about 11) as the earliest Jewish presence. The map shows 800 Jews in 1492-1523, 70x the documented presence.

```text
L111840: Slovakia | Košice | est 1450 | 1492–1523 | pop 800 → — | medium | https://jewish-guide.pl/11-slovakia | “Approximately 800 Jews live in Košice today.”
```

**[GAP]** After the 1944 count (12,000, single year; the 1941 count is 10,079) there is no numeric row until the 2001 census (406); the postwar community of thousands is missing for 1945-2000 (only narrative rows about a doctor, Šimko).

```text
L111886: Slovakia | Košice | est 1450 | 1944–1944 | pop 12000 → — | high | https://www.jewishgen.org/yizkor/Kosice/kos275.html | “The number of Jews in Kassa was 12,000.”
L111884: Slovakia | Košice | est 1450 | 1941–1941 | pop 10079 → 10079 | high | https://static-cdn.hungaricana.hu/pdf1/KSH_Nepszamlalasi_Digitalis_Adattar/NEDA_nemzetisegi_Zsido_1840-1941/pa… | “KSH 'A zsidó népesség száma településenként 1840-1941' (1993), Summary table 1.2 (towns with county rank, territory re-annexed 1938-41), scan page 33 (printed 32), entry 'Kassa tjv.' (town with county rank): 10079 Jews (izraelita, by religion) at the census of 31 Jan 1941. Locality in its 1941 boundaries (merged communes counted with the parent).”
```

##### Turkey/Antakya

**[HELD_FLAT]** Low-probability row: a single undated 'peak' estimate of about 60,000 Jews (Kraeling, date not stated) is ramped linearly to 10 over -63..1164. The map shows about 32,500 at 500 CE and about 8,000 at 1000 CE, in centuries for which the file has no count; the only sourced point at the end is Benjamin of Tudela's ten Jews (row 120196, 1165). A one-off peak estimate is drawn as a 1,200-year slow decline.

```text
L120181: Turkey | Antakya | est -332 | -63–1164 | pop 60000 → 10 | low | http://libaniusredux.blogspot.com/2009/03/jewish-quarters.html | “Early Roman / Herodian (-63 to 70): capital of Roman Syria; Jewish Virtual Library: Jewish population grew with proselytes and Titus refused the Antiochenes' demand after 70 CE to expel the Jews and destroy their tablets. Estimate: Carl Kraeling (as reported by the Antiochepedia blog) put the Jewish population at about 60000 at its peak (10-15 percent of the…”
```

**[CHAIN_SUBSET]** Both rows span -300..-64 and have pop_end 60000 taken from the next row's undated peak estimate. Row 120176's own comment says 'No evidence of Jewish presence in Antakya found in this source' (ps 0), yet the row ramps 0 -> 60000 (about 50,800 at -100); row 120177 starts at 500 (a modern informant's number, 'when Olga Cemal moved') and ramps to 60000. The map shows tens of thousands of Jews in Hellenistic times from sources that give none.

```text
L120176: Turkey | Antakya | est -332 | -300–-64 | pop 0 → 60000 | high | https://dergipark.org.tr/tr/download/article-file/328450 | “No evidence of Jewish presence in Antakya found in this source”
L120177: Turkey | Antakya | est -332 | -300–-64 | pop 500 → 60000 | high | https://www.jpost.com/diaspora/article-730843 | “At least 500 people lived there when Olga Cemal moved to Antakya from Damascus”
```

**[RAMP_OVERRIDES_SOURCED]** Row 120210 (1939-1964) ramps 1000 -> 100 (1000 is a pre-WWII 'around a thousand' statement). It gives 784 in 1945, while the 1945 census (row 120211, 'the town itself') counts 202, a factor 3.9. The ramp hides the census point.

```text
L120210: Turkey | Antakya | est -332 | 1939–1964 | pop 1000 → 100 | high | http://www.aajs.org.au/wp-content/uploads/2022/01/Magemizoglu_AJJS_XXXIV_2021_24-43_Final.pdf | “Around a thousand Jews were living in the city shortly before the Second World War”
L120211: Turkey | Antakya | est -332 | 1945–1945 | pop 202 → 202 | high | https://kutuphane.tuik.gov.tr/pdf/0014844.pdf | “Census of 21 Oct 1945, city section (sehri) table 'Nufusun dinler itibariyle ayrilisi' (population by religion): Museviler (Israelites) = Jews by religion, 102 men + 100 women; the town itself, not the district or province.”
```

##### Turkey/Edirne

**[RAMP_OVERRIDES_SOURCED]** Row 1650-1872 ramps 5000 -> 12000 (5000 = 'second half of 17th century', 12000 = 1873 figure). It gives 6,135 in 1686, 6,262 in 1690 and 6,671 in 1703, while the tax registers give about 2,080 (1686), 2,530 (1690) and 2,840 (1703): 2.3-2.9x too high; it also hides the 19th-century growth detail.

```text
L120443: Turkey | Edirne | est 134 | 1650–1872 | pop 5000 → 12000 | high | http://archive.diarna.org/site/detail/public/1116/ | “By the second half of the seventeenth century, five thousand Jews lived in Edirne.”
```

##### Turkey/Izmir

**[HELD_FLAT]** One undated 'contemporary estimate' of 2,400 is held over 90-1529, i.e. 1,439 years, with blank pop_end (also a template-like placeholder). Next numbers are 7,000 in 1631, so the map draws a flat 2,400 for fourteen centuries.

```text
L120772: Turkey | Izmir | est 90 | 90–1529 | pop 2400 → — | high | https://esefarad.com/the-jewish-community-of-izmir/ | “Contemporary estimate of Jewish population (undated source)”
```

**[COMMENT_MISMATCH]** pop_start is 1960 on a row dated 1962 (the same number as the year; neighbouring rows give 4,885 in the 1960 census and 4,500 in 1963, and row 120896 says fewer than 2,000 in 1960). The ramp 1960 -> 4500 looks like a year taken as a population.

```text
L120899: Turkey | Izmir | est 90 | 1962–1962 | pop 1960 → 4500 | high | https://archive.jpr.org.uk/download?id=3244 | “Population stated by Izmir in reply to statistical data request from the Chief Rabbinate”
```

**[GAP]** Numeric series ends with 'about 3,000 in the 1970s' held 1970-1997; there is no count for 1998-2026 although the community still exists (narrative row 120903 in 1998 mentions 150 children in the Talmud Torah). The map stops drawing Izmir after 1997.

```text
L120902: Turkey | Izmir | est 90 | 1970–1997 | pop 3000 → — | high | https://esefarad.com/the-jewish-community-of-izmir/ | “Population grew to about 3,000 in the 1970s”
L120903: Turkey | Izmir | est 90 | 1998–1998 | pop — → — | high | https://esefarad.com/the-jewish-community-of-izmir/ | “The veteran Talmud Torah school closed and the remaining 150 children were transferred”
```

#### France, Italy, Iberia, UK, Benelux, Switzerland, Scandinavia — 44 findings in 24 towns

##### Belgium/Brussels

**[WARTIME_COUNT]** The four 1939 pre-war counts (35000, 21000, 25000, 30000) are ramped across 1939-1947 to 27000, so the map shows ~30,000-33,000 Brussels Jews in 1944 with no Holocaust dip, although the file's own 6749 says 37% of registered Brussels Jews were deported and 6748 records 17,000 registered over-15s. 27,000 is the post-war refugee-swollen figure chained back as pop_end. Antwerp in the same file correctly drops to 800 in 1944.

```text
L6742: Belgium | Brussels | est 1250 | 1939–1947 | pop 35000 → 27000 | high | https://www.worldjewishcongress.org/en/about/communities/be | “Jewish population in Brussels at the beginning of World War II.”
L6743: Belgium | Brussels | est 1250 | 1939–1947 | pop 21000 → 27000 | high | https://www.yadvashem.org/articles/academic/why-did-so-many-of-the-jews-in-antwerp-perish-in-the-holocaust.htm… | “Jewish population in Brussels on the eve of the Holocaust, representing 38.5 percent of the total Belgian Jewish population.”
L6744: Belgium | Brussels | est 1250 | 1939–1947 | pop 25000 → 27000 | medium | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Belgium | “Approximately 25000 of Belgium's roughly 70000 Jews resided in Brussels on eve of WWII”
L6745: Belgium | Brussels | est 1250 | 1939–1947 | pop 30000 → 27000 | medium | https://www.jewishvirtuallibrary.org/brussels | “Pre-World War II Brussels Jewish population approximately 30000 (approximate; sources vary 25000-30000)”
L6751: Belgium | Brussels | est 1250 | 1948–1969 | pop 27000 → 18000 | high | https://www.jewishvirtuallibrary.org/brussels | “From 1945 until about 1950 Jewish population as large as prewar about 27000 owing to refugees; year is midpoint of 1945-1950”
```

**[GAP]** 6755 (1970, 18000) has blank pop_end so covers only 1970; next numeric row is 6761 (2002), so a community of 15,000-18,000 vanishes from the map for 1971-2001. Also 6726 (1370-1756, 40>66) ramps over 386 years from the 1370 massacre/banishment: map shows ~49 Jews in 1500 although Jews were banished from 1370 until the 18th century.

```text
L6755: Belgium | Brussels | est 1250 | 1970–1970 | pop 18000 → — | high | https://www.jewishvirtuallibrary.org/brussels | “Reduced by emigration to around 18000 by 1970”
L6761: Belgium | Brussels | est 1250 | 2002–2002 | pop 15000 → 15000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/brussels | “Encyclopaedia Judaica (2nd ed., 'Brussels' entry): the community 'reached a population of around 15,000 in 2002, representing about half the Jewish population of Belgium'. Estimate of the community's size.”
L6726: Belgium | Brussels | est 1250 | 1370–1756 | pop 40 → 66 | high | https://en.wikipedia.org/wiki/Brussels_massacre | “Estimate based on families: 8 Jewish households in Brussels per treasury records; six or about twenty Jews killed and rest banished May 1370”
```

##### Belgium/Charleroi

**[WARTIME_COUNT]** 6798 (1942-1974, 3000>500) ramps the wartime count '3,000 Jews live in Charleroi' (1942) down over 32 years: map shows ~2,375 in 1950 and ~1,600 in 1960, but 6801/6802 say 'a few hundred' remained after the war, and 6807 gives 500 in the 1970s.

```text
L6798: Belgium | Charleroi | est 1846 | 1942–1974 | pop 3000 → 500 | high | https://www.telesambre.be/info/charleroi-une-rafle-de-juifs-ete-evitee-de-peu-il-y-80-ans/52419 | “'More or less 3,000 Jews live in Charleroi' in 1942; yellow star imposed June 1942”
L6801: Belgium | Charleroi | est 1846 | 1945–1962 | pop — → — | high | https://www.rtbf.be/article/a-charleroi-une-communaute-juive-vieillissante-qui-craint-de-disparaitre-11746237 | “After the war 'a few hundred people' remained (oral estimate); many younger members later left for Brussels and elsewhere”
L6802: Belgium | Charleroi | est 1846 | 1945–1962 | pop — → — | high | http://www.jewishcom.be/wordpress/en/2009/03/01/la-communaute-israelite-de-charleroi-de-israelitische-gemeensc… | “Hundreds of members deported and murdered; at liberation the community was 'a shadow of its former self' and was reorganised with fewer members”
L6807: Belgium | Charleroi | est 1846 | 1975–1975 | pop 500 → — | high | https://www.jpr.org.uk/sites/default/files/attachments/JPRJ9447-Jews-in-Belgium-211022-FINAL-web.pdf | “Encyclopaedia Judaica (Gottschalk & Bok) quoted by JPR: in the 1970s Charleroi had 500 Jews”
```

**[CONFLICT]** 6785 (1939) is an oral estimate of 8,000 vs 3,000 in 6783/6784/6787 (2.7x); the map shows the higher 8,000 for 1939 (comment itself calls it far above historians' figures). Also no numeric row after 1975 although the community still exists ('few dozen members' in 2026).

```text
L6785: Belgium | Charleroi | est 1846 | 1939–1939 | pop 8000 → 3000 | high | https://www.rtbf.be/article/a-charleroi-une-communaute-juive-vieillissante-qui-craint-de-disparaitre-11746237 | “Community member interviewed by RTBF (2026) says 'about 8000 Jews in Charleroi' before the war; oral estimate far above historians' ~3000 and may cover the wider Pays de Charleroi”
L6784: Belgium | Charleroi | est 1846 | 1939–1939 | pop 3000 → 3000 | high | http://www.jewishcom.be/wordpress/en/2009/03/01/la-communaute-israelite-de-charleroi-de-israelitische-gemeensc… | “Estimate based on families: community 'surged to stand at 600 families on the eve of World War II' (x5)”
L6787: Belgium | Charleroi | est 1846 | 1940–1942 | pop 3000 → 3000 | high | https://www.belgiumwwii.be/belgique-en-guerre/articles/rafle-avortee-de-charleroi-un-exploit-unique-en-belgiqu… | “'The community numbered about three thousand persons in 1940'”
```

##### France/Aix-en-Provence

**[WARTIME_COUNT]** 19542 (1942-2006, 2000>0) takes '2,000 Jews sent on to Auschwitz from Camp des Milles' (a deportee/victim count of a camp, not Aix residents; citation lost) as the town's population and ramps it to 0 over 64 years. The map shows ~1,750 in 1950 and ~1,220 in 1967 (EJ gives ~1,000 for 1967). The same 2000 is chained into pop_end of 19529 (1341-1941, 1205>2000), so the 1341-1941 row ends at a deportee number.

```text
L19542: France | Aix-en-Provence | est 100 | 1942–2006 | pop 2000 → 0 | high | (citation lost - legacy data entry error) | “"More than 2, 000 Jews were sent on to Auschwitz from Camp des Milles (located in Aix-en-Provence)."”
L19529: France | Aix-en-Provence | est 100 | 1341–1941 | pop 1205 → 2000 | high | https://dalme.org/collections/jewish-households/ | “Based on a census, representing about 10% of the city's total population at the time.”
```

**[EXPULSION_RAMP]** 19529 ramps 1205>2000 over 1341-1941 (600 years, comment: a census of c.1300 = 10% of the town). Provence Jews were expelled in 1500-01 and Aix had no community for centuries (cf. Marseille rows), yet the map shows ~1,550 Jews in 1600 and ~1,750 in 1800. The 1205 is a medieval figure, the 2000 end value comes from a Camp des Milles deportee count.

```text
L19529: France | Aix-en-Provence | est 100 | 1341–1941 | pop 1205 → 2000 | high | https://dalme.org/collections/jewish-households/ | “Based on a census, representing about 10% of the city's total population at the time.”
```

**[COMMENT_MISMATCH]** Seven rows 2007-2026 carry the comment 'No evidence of Jewish presence found in available sources' yet have numbers 0, 2 and 2000 (19548 0>2; 19552 2022-23 0>2000 ramp; 19553 2024 2000>0) and 19554/19555 assert 0 (documented absence) for 2025-26. 'No evidence found' is not a count and the 0 means documented absence, while 19553 (Hadassah 2024) says a 'vibrant Jewish community of a few thousand'. The map draws a fake 0->2000->0 saw-tooth (e.g. 2023 = 1,000) and absence in 2025-26.

```text
L19548: France | Aix-en-Provence | est 100 | 2007–2018 | pop 0 → 2 | high | https://www.map-france.com/Aix-en-Provence-13100/population-Aix-en-Provence.html | “"No evidence of Jewish presence found in available sources."”
L19549: France | Aix-en-Provence | est 100 | 2019–2021 | pop 2 → 0 | high | https://theroyaltourblog.com/2019/02/07/a-jewish-day-in-aix-en-provence/ | “"Mention of Israeli owners of the restaurant Tita living in Aix."”
L19550: France | Aix-en-Provence | est 100 | 2019–2021 | pop 0 → 0 | high | https://ugeo.urbistat.com/AdminStat/en/fr/demografia/dati-sintesi/aix-en-provence/20048305/4 | “"No evidence of Jewish presence found in available sources."”
L19552: France | Aix-en-Provence | est 100 | 2022–2023 | pop 0 → 2000 | high | https://www.insee.fr/fr/statistiques/1405599?geo=COM-13001 | “"No evidence of Jewish presence found in available sources."”
L19553: France | Aix-en-Provence | est 100 | 2024–2024 | pop 2000 → 0 | high | https://www.hadassahmagazine.org/2024/05/20/a-sojourn-in-jewish-provence/ | “"Source describes a 'vibrant Jewish community of a few thousand' in the university town."”
L19554: France | Aix-en-Provence | est 100 | 2025–2026 | pop 0 → — | high | https://www.citypopulation.de/en/france/admin/bouches_du_rh%C3%B4ne/131__aix_en_provence/ | “"No evidence of Jewish presence found in available sources."”
L19555: France | Aix-en-Provence | est 100 | 2025–2026 | pop 0 → — | high | https://www.insee.fr/en/statistiques/6457611?geo=ARR-131 | “"No evidence of Jewish presence found in available sources."”
```

##### France/Lyon

**[WARTIME_COUNT]** 22289 takes the 1943 wartime refugee surge (40,000 'la cite compte 40 000 Juifs', ten times the pre-war number) and ramps it to 20,000 across 1943-1965. The map shows ~38,200 in 1945, ~33,600 in 1950 and ~24,500 in 1960, against 7,000 (1945, 22291) and 13,000 (1960, Levitte, 22293) sourced. The same 40,000 is chained as pop_end of 22284/22285/22286 (1939-1942 ramps 5000>40000, 4000>40000, 2750>40000), so the map shows ~28,000 in 1941.

```text
L22289: France | Lyon | est 39 | 1943–1965 | pop 40000 → 20000 | high | https://academie-sbla-lyon.fr/media/Conferences/CR/20230425_Sylvie_Altar_Etre_juif_a_Lyon_CR.pdf | “In 1943 'la cite compte 40 000 Juifs', ten times more than three years earlier: wartime refugee surge (Lyon was the refuge city of the southern zone); boundary reported as the city”
L22284: France | Lyon | est 39 | 1939–1942 | pop 5000 → 40000 | high | https://cdp.jewishgen.org/western-europe/france/lyon-rhones-alpes-centre | “On the eve of World War II, 5,000 Jews lived in Lyons.”
L22285: France | Lyon | est 39 | 1939–1942 | pop 4000 → 40000 | high | https://academie-sbla-lyon.fr/media/Conferences/CR/20230425_Sylvie_Altar_Etre_juif_a_Lyon_CR.pdf | “Before the war about 4,000 Jews in Lyon itself (about 7,000 in the whole agglomeration); source is a 2023 academy lecture summary on Sylvie Altar”
L22286: France | Lyon | est 39 | 1939–1942 | pop 2750 → 40000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/lyons | “Encyclopaedia Judaica gives 500-600 Jewish families on the eve of WWII; ~2750 = midpoint 550 x 5. Estimate based on families”
L22291: France | Lyon | est 39 | 1945–1945 | pop 7000 → 7000 | low | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/lyons | “Encyclopaedia Judaica (2nd ed.), entry 'Lyons' as reproduced at encyclopedia.com: "After the war many Jewish refugees settled permanently in Lyons. Nevertheless, the community of approximately 7,000 was hardly any larger than in 1939." The entry gives no exact year for the 7,000; entered as 1945 (immediately after the war), a conventional year.”
L22293: France | Lyon | est 39 | 1960–1960 | pop 13000 → 13000 | high | https://archive.jpr.org.uk/download?id=2359 | “Georges Levitte, 'Impressions of French Jewry Today', Jewish Journal of Sociology 2(2), November 1960, p. 172: 'We may mention Lyons and its suburbs (13,000), Marseilles (8,000), Toulouse, Bordeaux, Nice (5,000), and Lille (2,000)'. The author says that no French census asks about religion and that his figures are 'working hypotheses and rough approximations…”
```

**[EXPULSION_RAMP]** 22269 (1420-1808, 0>200): Jews left Lyon definitively c.1420 (comment: French Wikipedia says no Jews), yet the row ramps from 0 up to 200 over 388 years, showing ~93 Jews in 1600 and ~144 in 1700 when no community existed.

```text
L22269: France | Lyon | est 39 | 1420–1808 | pop 0 → 200 | high | https://www.jewishencyclopedia.com/articles/10212-lyons | “Definitive departure of the Jews from Lyons c.1420 (gold- and silver-thread industry moved to Trevoux); French Wikipedia: no Jewish community recorded for the following three centuries”
```

##### France/Marseille

**[EXPULSION_RAMP]** 22448 (1165-1781, 300>65): Benjamin of Tudela's 300 (1165) ramps down to 65 across 616 years although the community was banished in 1500 and 'the Jewish area was destroyed' (22481/22482), with no Jews until 1760s. Map shows ~134 in 1600 and ~96 in 1700 for a town with no legal Jews.

```text
L22448: France | Marseille | est 450 | 1165–1781 | pop 300 → 65 | high | https://cdp.jewishgen.org/western-europe/france/marseille-bouches-du-rhone-departement | “Benjamin of Tudela noted the Jewish community numbered 300 members, who worshiped in two synagogues.”
```

**[WARTIME_COUNT]** 22504 (1939-43, 39000>5000) is a 1939 figure (BBC; likely including refugees) ramped down over the occupation, and its 39,000 is chained as pop_end of 22501 (1896-1938, 5000>39000). Map shows ~24,400 in 1920, ~30,500 in 1940 and ~22,000 in 1941, whereas the same file says 5,000 'about' in 1896 and 'about 10,000' (22509) at the end of WW2. 22509 (1945-2004, 10000>80000) then draws ~27,800 in 1960 vs 8,000 sourced (22512, 3.5x).

```text
L22501: France | Marseille | est 450 | 1896–1938 | pop 5000 → 39000 | high | https://cdp.jewishgen.org/western-europe/france/marseille-bouches-du-rhone-departement | “The seaport of southern France had about 5,000 Jews.”
L22504: France | Marseille | est 450 | 1939–1943 | pop 39000 → 5000 | high | https://www.bbc.com/news/world-europe-35445025 | “The city's Jewish population in 1939 was 39,000.”
L22509: France | Marseille | est 450 | 1945–2004 | pop 10000 → 80000 | high | https://www.bbc.com/news/world-europe-35445025 | “By the end of WW2 the city's Jewish population had fallen to about 10,000.”
```

##### France/Nice

**[RAMP_OVERRIDES_SOURCED]** 23094 (1909-1965, 500>20000) is a 56-year ramp from a 1909 number to the 1966 figure. It shows ~7,800 in 1930, ~11,300 in 1940 and ~18,300 in 1960 vs 5,000 sourced for 1960 (Levitte, 23103; 3.7x). It also smooths over the Holocaust and ignores the pre-1956 data.

```text
L23094: France | Nice | est 200 | 1909–1965 | pop 500 → 20000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/nice | “500 Jews out of a total population of 95,000 in 1909”
L23103: France | Nice | est 200 | 1960–1960 | pop 5000 → 5000 | high | https://archive.jpr.org.uk/download?id=2359 | “Georges Levitte, 'Impressions of French Jewry Today', Jewish Journal of Sociology 2(2), November 1960, p. 172: 'We may mention Lyons and its suburbs (13,000), Marseilles (8,000), Toulouse, Bordeaux, Nice (5,000), and Lille (2,000)'. The author says that no French census asks about religion and that his figures are 'working hypotheses and rough approximations…”
```

##### France/Saint-Denis (Seine-Saint-Denis)

**[INFLATED_DEFINITION]** 23985/23986 give 17,500 (2015) and 15,000 (2016) from JTA ('Saint-Denis and its surroundings', both comments say 'probably covers the surroundings') against 2,000 in 1971 (23982) and 325 in 1941 for the commune. A metro/area figure drawn on the town marker; 15,000 'halved after the 1980s' would imply ~30,000 in the 1980s vs 2,000 in 1971.

```text
L23985: France | Saint-Denis (Seine-Saint-Denis) | est 1111 | 2015–2015 | pop 17500 → 17500 | low | https://www.jta.org/2015/11/18/global/saint-denis-rabbi-terrorists-will-not-affect-jewish-life-here | “JTA, 18 Nov 2015 ('Saint-Denis rabbi: Terrorists will not affect Jewish life here'): 'No members of the St. Denis Jewish community of 15,000 to 20,000 are known to have been injured in the raid' (written as the midpoint of 15,000-20,000). Journalistic figure quoting the community; probably covers Saint-Denis and its surroundings: low confidence.”
L23986: France | Saint-Denis (Seine-Saint-Denis) | est 1111 | 2016–2016 | pop 15000 → 15000 | low | https://www.jta.org/2016/04/05/global/north-of-paris-a-beleaguered-jewish-community-dares-to-seder | “JTA, Cnaan Liphshiz, 5 April 2016 ('North of Paris, a beleaguered Jewish community dares to seder'): 'Saint-Denis' 15,000 Jews are all that remains of a community that was halved after the 1980s'. The figure is probably for Saint-Denis and its surroundings (the article is about the Chabad House of Saint-Denis); journalistic, no method given: low confidence.”
```

##### France/Strasbourg

**[EXPULSION_RAMP]** 24529 (1387-1783, 100>68) ramps over 396 years although rows 24530/24531/24534/24536 in the same file say the whole community was expelled 'forever' in 1388 and Jews were barred from settling in Strasbourg until 1792. Map shows ~83 Jews in 1600 and ~77 in 1700. 24535 (1784-1805, 68>1234) also starts at 68 before readmission in 1792 and shows ~512 in 1792.

```text
L24529: France | Strasbourg | est 800 | 1387–1783 | pop 100 → 68 | high | https://cdp.jewishgen.org/western-europe/france/strasbourg-bas-rhin-departement-alsace-region-region | “The community numbered about twenty families (Estimate based on families). A decree forbade Christians from acting as domestic servants for Jews, and a Jewish man was beaten and expelled from the cathedral.”
L24535: France | Strasbourg | est 800 | 1784–1805 | pop 68 → 1234 | high | https://cdp.jewishgen.org/western-europe/france/strasbourg-bas-rhin-departement-alsace-region-region | “Jewish population according to the census.”
```

**[CONFLICT]** 1842-1850 ramps 1892>8000 (24540) and 1851-1860 ramps 8000>2820 (24541): the map shows ~8,000 at 1850-51 and ~5,400 in 1855, while neighbouring rows give 1,892 (1841) and 2,820 (1861), i.e. 2.8-4.2x lower. The 8,000 spike (wrongly placed value) is stretched over 18 years.

```text
L24540: France | Strasbourg | est 800 | 1842–1850 | pop 1892 → 8000 | high | https://www.alemannia-judaica.de/strasbourg_synagogue.htm | “Alemannia Judaica: jüdische Einwohner”
L24541: France | Strasbourg | est 800 | 1851–1860 | pop 8000 → 2820 | high | https://cdp.jewishgen.org/western-europe/france/strasbourg-bas-rhin-departement-alsace-region-region | “Jewish population according to the census, having grown significantly as surrounding villages emptied in favor of Strasbourg.”
L24539: France | Strasbourg | est 800 | 1834–1841 | pop 1500 → 1892 | high | https://www.alemannia-judaica.de/strasbourg_synagogue.htm | “Alemannia Judaica: jüdische Einwohner”
L24542: France | Strasbourg | est 800 | 1861–1888 | pop 2820 → 4000 | high | https://www.alemannia-judaica.de/strasbourg_synagogue.htm | “Alemannia Judaica: jüdische Einwohner”
```

##### France/Toulon

**[DERIVED]** 24704 (1971-1999, 2000>10000) ramps from the stated 2000 to 10,000, a number from the next row 24706 that is 'increased to 2000 families' x5, though the same source says the community numbered 2000 and 24708 gives ~2,000 for the whole western Var region incl. suburbs. Map shows ~7,400 in 1990 and 10,000 in 2000.

```text
L24704: France | Toulon | est 1285 | 1971–1999 | pop 2000 → 10000 | high | https://jguideeurope.org/en/type-de-lieu/city/page/7/ | “The Jewish community numbered 2000.”
L24706: France | Toulon | est 1285 | 2000–2000 | pop 10000 → — | high | https://jguideeurope.org/en/type-de-lieu/city/page/7/ | “Estimate based on families. The community increased to 2000 families.”
L24708: France | Toulon | est 1285 | 2008–2008 | pop — → — | high | https://cdp.jewishgen.org/western-europe/france/la-seyne-sur-mer-et-ouest-varois-var-departement-provence | “Source mentions ~2000 (Estimate based on 400 families) Jews living in the western cities of Varois (including suburbs of Toulon) and friends of the région toulonnaise; this is a regional aggregate, not the population of Toulon itself.”
```

##### France/Toulouse

**[EXPULSION_RAMP]** 24716 (650-1322, 12500>0) is '2,500 families' x5 (worldpopulationreview) ramped over 672 years to zero at the 1322 expulsion; map shows ~6,000 in 1000 and ~2,270 in 1200, and ~990 in 1269 vs ~650 sourced for 1269 (24733). The 12,500 is far above any sourced medieval count.

```text
L24716: France | Toulouse | est 450 | 650–1322 | pop 12500 → 0 | medium | https://worldpopulationreview.com/cities/france/toulouse | “Estimate based on families. There have been estimated to be about 2,500 Jewish families residing in Toulouse.”
L24733: France | Toulouse | est 450 | 1269–1269 | pop ~650 → ~650 | low | G. Nahon, 'Les Juifs dans les domaines d'Alfonse de Poitiers, 1241-1271', Revue des études juives 125 (1966), … | “Estimate by Nahon: the property of the Jews of Toulouse was valued at 1,300 livres toulousaines (2,600 l.t., 8 January 1269); at an average of 20 l.t. per head (or household) this gives 130 persons, to be multiplied by 5 or 7 to include families and dependants (households x5; x7 would give about 910). Jews living in the city and its surroundings are mentione…”
```

**[EXPULSION_RAMP]** 24748 (1322-1358, 0>75) ramps from 0 up to 75 over a period the comment says the community 'ceased existing after 1322' (map shows ~38 Jews in 1340). 24749 then holds 75-80 for 1359-1788 (430 years) although the Jews were expelled from the kingdom of France in 1394 and only Marranos appear until 1790.

```text
L24748: France | Toulouse | est 450 | 1322–1358 | pop 0 → 75 | high | https://cdp.jewishgen.org/western-europe/france/toulouse-haute-garonne-departement-midi-pyrenees | “The Jewish community ceased existing after 1322.”
L24749: France | Toulouse | est 450 | 1359–1788 | pop 75 → 80 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/toulouse | “Jews readmitted in 1359; only about 15 families settled initially. Estimate based on families (15 x 5)”
```

##### Italy/Genoa

**[RAMP_OVERRIDES_SOURCED]** 77129 (1935-2016, 2500>300) ramps a pre-war number across the Holocaust and the post-war decades: ~2,230 in 1945, ~1,980 in 1954, ~1,690 in 1965 vs 1,108, 1,000 and 1,036 sourced (77136, 77137, 77138): 1.6-2.0x.

```text
L77129: Italy | Genoa | est 493 | 1935–2016 | pop 2500 → 300 | high | https://shalommorris.com/2017/05/10/genoa-italy-columbus-cinque-terre-and-sephardim/ | “Genoa's Jewish community built an impressive synagogue just outside the historic city centre.”
L77136: Italy | Genoa | est 493 | 1945–1945 | pop 1108 → 1108 | low | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/genoa | “Encyclopaedia Judaica (Genoa, 'Contemporary Period'): 'At the end of World War II, 1,108 Jews were left in Genoa.' Year approximated as 1945.”
L77137: Italy | Genoa | est 493 | 1954–1954 | pop 1000 → 1000 | high | https://archive.org/download/B-001-002-056/B-001-002-056.pdf | “American Jewish Year Book vol. 56 (1955), 'Italy' report for July 1953-June 1954, pp. 348-349 (PDF page 364): 'The total Jewish population of Italy was between 30,000 and 33,000; of this number 12,000 lived in Rome, 6,000 in Milan, 3,000 in Turin, 1,500 each in Florence and Trieste, while Genoa, Venice and Leghorn had Jewish populations of about 1,000 each.'…”
L77138: Italy | Genoa | est 493 | 1965–1965 | pop 1036 → 1036 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/genoa | “Encyclopaedia Judaica (Genoa): the Jewish population 'maintained its size ... and in 1965 it numbered 1,036 persons out of a total of 840,000 inhabitants'.”
```

**[RAMP_OVERRIDES_SOURCED]** 77123 (1850-1934, 1000>2500) ramp hides the ISTAT counts: ~1,550 in 1881 vs 553 sourced (2.8x) and ~2,090 in 1911 vs 970 (2.2x). The 1,000 'mid-19th century' and the 2,500 pre-war figures are stretched across 85 years.

```text
L77123: Italy | Genoa | est 493 | 1850–1934 | pop 1000 → 2500 | medium | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/genoa | “EJ: about 1,000 in the middle of the 19th century (year approximated)”
L77125: Italy | Genoa | est 493 | 1881–1881 | pop 553 → 553 | high | https://ebiblio.istat.it/digibib/Annali/TO00003841_Serie03Vol09Ed1884.pdf, | “Israelites in the comune on 31 Dec 1881, from the special 1882 inquiry of the Direzione generale della statistica among Community presidents and rabbis (the 1881 census had no religion question).”
L77126: Italy | Genoa | est 493 | 1911–1911 | pop 970 → 970 | high | http://ebiblio.istat.it/digibib/Censimenti%20popolazione/censpop1911/IST7961cp11vol6.pdf, | “Census of 10 June 1911, Vol. VI, Tav. VIII.A (comuni that are provincial capitals or have over 30,000 inhabitants): present population (de facto) declaring the Israelite religion, both sexes, all ages (males 650, females 320; the age groups sum to the printed totals). The census tabulates 'nessuna' and 'non dichiarata' religion separately, so this is a count…”
```

**[EXPULSION_RAMP]** 77101 (1165-1659, 2>200) ramps from Benjamin of Tudela's two Jews over 495 years although Jews were expelled from Genoa repeatedly (1550, 1567, 1598 banishment); map shows ~100 Jews in 1400.

```text
L77101: Italy | Genoa | est 493 | 1165–1659 | pop 2 → 200 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/genoa | “Benjamin of Tudela found only two Jews (brothers, dyers) c.1165”
```

##### Italy/Rome

**[CONFLICT]** Rome: 4,127 (1656, plague count of the ghetto) and 4,500 (1668, 850 families) vs the EJ-table rows 78260 (1159-1681 ramp ending at 1,750) and 78304 (1682-1839, starts at 1,750): the 1,750 in 1682 is ~2.5x below 4,500 in 1668 and 4,127 in 1656. The map shows ~1,650 for 1657-1667 between the single-year spikes, and 78304 gives ~2,480 in 1734 vs 5,000 sourced (78306).

```text
L78302: Italy | Rome | est -167 | 1656–1656 | pop 4127 → 4127 | high | https://archive.org/details/bub_gb_-mILAAAAIAAJ | https://archive.org/details/in.ernet.dli.2015.88362 | “Total of the Jewish ghetto at the 1656-57 plague ('a total of 4,127', of whom 2,624 were poor and about 800 died). Two independent books give the same figure; Vogelstein-Rieger p. 213 'Gesamtzahl von 4127 Seelen'.”
L78303: Italy | Rome | est -167 | 1668–1668 | pop 4500 → 4500 | high | https://archive.org/details/lesaintsigeetl00rodo | https://archive.org/details/2.-italia-judaica.-atti-del-i-c… | “Rodocanachi: 'En 1668, le chiffre des familles qui y sejournaient est officiellement fixe a huit cent cinquante, celui des habitants, a quatre mille cinq cents' (850 families, 4,500 inhabitants of the ghetto; source Vat. Cod. 7711). Vogelstein-Rieger quote 4,500 (850 families) for a 1682 pamphlet.”
L78304: Italy | Rome | est -167 | 1682–1839 | pop 1750 → 3965 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/rome | “EJ table”
L78260: Italy | Rome | est -167 | 1159–1681 | pop 200 → 1750 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/rome | “Benjamin of Tudela, c.1159”
```

##### Netherlands/Amsterdam

**[TEMPLATE]** Hand-typed placeholder rows with generic comments ('Early settlement - Sephardic Jews arrive', '17th century - thriving community', '18th century - population grows', 'Late 19th century - ...', 'Interwar period - peak population'), round numbers, probability low, source jewishvirtuallibrary page; more of the same: 85247, 85259, 85260, 85264. They drive most of the Amsterdam curve between the few sourced years.

```text
L85168: Netherlands | Amsterdam | est 1492 | 1600–1650 | pop 100 → 500 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Early settlement - Sephardic Jews arrive”
L85187: Netherlands | Amsterdam | est 1492 | 1650–1700 | pop 500 → 2000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “17th century - thriving community”
L85209: Netherlands | Amsterdam | est 1492 | 1700–1800 | pop 2000 → 5000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “18th century - population grows”
L85241: Netherlands | Amsterdam | est 1492 | 1800–1850 | pop 5000 → 10000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Early 19th century - community expands”
L85242: Netherlands | Amsterdam | est 1492 | 1850–1900 | pop 10000 → 20000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Late 19th century - immigration from Eastern Europe”
L85243: Netherlands | Amsterdam | est 1492 | 1900–1920 | pop 20000 → 50000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Pre-war period - thriving community”
L85245: Netherlands | Amsterdam | est 1492 | 1920–1940 | pop 50000 → 80000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Interwar period - peak population”
L85254: Netherlands | Amsterdam | est 1492 | 1945–1970 | pop 5000 → 15000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Post-war recovery - community rebuilds”
```

**[CONFLICT]** Sourced points are single-year rows, template ramps fill all other years. 1674 = 7,500 (85197) but 85187 gives only ~1,220 for 1674 and 85209 ~2,000-5,000 through 1700-1800; 1795 = 20,335 (85236) while 85209 gives ~4,850 in 1795 and 85241 5,000 in 1800. The map therefore spikes to 7,500 (1674) and 20,335 (1795) for one year each and falls back by 4-6x the next year.

```text
L85209: Netherlands | Amsterdam | est 1492 | 1700–1800 | pop 2000 → 5000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “18th century - population grows”
L85236: Netherlands | Amsterdam | est 1492 | 1795–1795 | pop 20335 → 20335 | high | https://de.wikipedia.org/wiki/Geschichte_der_Juden_in_Amsterdam | “Population figures table, de.wikipedia, Geschichte der Juden in Amsterdam: 1795 = 20,335.”
L85241: Netherlands | Amsterdam | est 1492 | 1800–1850 | pop 5000 → 10000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Early 19th century - community expands”
L85187: Netherlands | Amsterdam | est 1492 | 1650–1700 | pop 500 → 2000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “17th century - thriving community”
L85197: Netherlands | Amsterdam | est 1492 | 1674–1674 | pop 7500 → 7500 | high | https://de.wikipedia.org/wiki/Geschichte_der_Juden_in_Amsterdam | “Population figures table, de.wikipedia: 1674 = 7,500 (5,000 Ashkenazi and 2,500 Sephardi); en.wikipedia 'History of the Jews in Amsterdam' gives the same split.”
```

**[HELD_FLAT]** 85244 holds 51,000 (a turn-of-the-century figure) flat for 1900-1940 with pop_end blank; it overlaps 85243 (1900-1920, 20000>50000, 20,000 in 1900 vs 51,000 = 2.55x) and the 85245 ramp 50000>80000. The sourced 1900 figure is stretched 40 years.

```text
L85244: Netherlands | Amsterdam | est 1492 | 1900–1940 | pop 51000 → — | high | https://esefarad.com/the-netherlands-rich-in-jewish-culture/ | “By the turn of the century, there were 51,000 Jews in Amsterdam, representing 2% of the population.”
L85243: Netherlands | Amsterdam | est 1492 | 1900–1920 | pop 20000 → 50000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Pre-war period - thriving community”
L85245: Netherlands | Amsterdam | est 1492 | 1920–1940 | pop 50000 → 80000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “Interwar period - peak population”
```

**[INFLATED_DEFINITION]** 85261 gives 'close to 35,000' for Amsterdam, held 2003-2019 (17 years). The file's own 85262 (JPR) says 35,000 is the estimate for ALL Dutch Jews nationally (2020), about half in North Holland, and 85260/85264 give 20,435 (2002) and 24,348 (2020). Being the higher value, 35,000 wins on the map for 2003-2019 and equals the national total.

```text
L85261: Netherlands | Amsterdam | est 1492 | 2003–2019 | pop 35000 → — | high | https://esefarad.com/the-netherlands-rich-in-jewish-culture/ | “The source states the current Jewish population in Amsterdam is close to 35,000.”
L85262: Netherlands | Amsterdam | est 1492 | 2020–2020 | pop — → — | medium | https://www.jpr.org.uk/sites/default/files/attachments/Jews%20in%20the%20Netherlands%20-%20Final%20version.pdf | “Close to 50% of all Dutch Jews (out of an estimated 35,000 nationwide) reside in North Holland, mostly in Greater Amsterdam.”
L85260: Netherlands | Amsterdam | est 1492 | 2000–2002 | pop 20000 → 20435 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “21st century - thriving community”
L85264: Netherlands | Amsterdam | est 1492 | 2020–2023 | pop 24348 → 25000 | low | https://www.jewishvirtuallibrary.org/amsterdam-netherlands-jewish-history-tour | “21st century - thriving community”
```

##### Netherlands/Rotterdam

**[WARTIME_COUNT]** 86396 (1941-1951, 11000>780) ramps the 1941 pre-deportation count down over ten years: map shows ~6,900 in 1945, ~4,900 in 1947 vs 852 sourced for 1947 (86403, 5.7x), and ~1,800 in 1950; the community was destroyed by 1943.

```text
L86396: Netherlands | Rotterdam | est 1605 | 1941–1951 | pop 11000 → 780 | high | https://nl.wikipedia.org/wiki/Loods_24 | “In 1941 still 11,000 Jews lived in Rotterdam”
L86403: Netherlands | Rotterdam | est 1605 | 1947–1947 | pop 852 → 852 | high | https://archive.jpr.org.uk/download?id=2361 | “'Dutch Jewry: A Demographic Analysis, Part One' (report of the Committee for the Demography of Jews in the Netherlands, chairman A. Vedder; Jewish Journal of Sociology 3(2), December 1961), Table 11 on p. 221, distribution of the Jewish population by province and the three largest cities on 31 May 1947 (N.C.B.S. census: persons who stated membership in one o…”
```

##### Spain/Barcelona

**[EXPULSION_RAMP]** 115646 (1400-1899, 3000>100, comment 'Jewish community expelled in 1492') starts at 3,000 in 1400 although 115643 (1392-1399) records 'no longer any Jews or synagogues at Barcelona' after 1391 and a 1424 ban on resettlement. Map shows ~2,420 Jews in 1500, ~1,260 in 1700 and ~385 in 1850 for a town with no community until the 20th century.

```text
L115646: Spain | Barcelona | est 100 | 1400–1899 | pop 3000 → 100 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Spain | “Jewish community expelled in 1492”
L115643: Spain | Barcelona | est 100 | 1392–1399 | pop 0 → 0 | high | https://www.jewishencyclopedia.com/articles/2512-barcelona | “'In 1392 there were no longer any Jews or synagogues at Barcelona'; 1424 royal decree later barred resettlement”
```

**[TEMPLATE]** Generic placeholder rows ('Jewish community established in Roman period' 200>500 for 100-499, 'during Visigothic period' 500>800, 'Muslim period' 800>350, 'Christian period - peak population' 1500>4000, 'Modern Jewish community re-established'), all sourced to the Spain overview page, round numbers, no town-specific evidence.

```text
L115589: Spain | Barcelona | est 100 | 100–499 | pop 200 → 500 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Spain | “Jewish community established in Roman period”
L115591: Spain | Barcelona | est 100 | 500–799 | pop 500 → 800 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Spain | “Jewish community during Visigothic period”
L115592: Spain | Barcelona | est 100 | 800–1078 | pop 800 → 350 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Spain | “Jewish community during Muslim period”
L115604: Spain | Barcelona | est 100 | 1200–1349 | pop 1500 → 4000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Spain | “Jewish community during Christian period - peak population”
L115653: Spain | Barcelona | est 100 | 1900–1917 | pop 100 → 100 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Spain | “Modern Jewish community re-established in 20th century”
```

**[INFLATED_DEFINITION]** 115665 (2017-2019, 15000>3500) and 115664 (2016, 3500>15000) use a JTA 'approximately 15,000 members (broad definition)', 4.3x the 3,500 of the other rows (comment itself says EJ gives ~3,500). 15,000 exceeds the entire core Jewish population of Spain; the ramp shows ~9,250 in 2018.

```text
L115665: Spain | Barcelona | est 100 | 2017–2019 | pop 15000 → 3500 | medium | https://www.jta.org/2017/10/31/global/4-jewish-things-you-need-to-know-about-catalonia | “JTA 31 Oct 2017: 'approximately 15,000 members' (broad definition; EJ gives ~3,500 for 2000).”
L115664: Spain | Barcelona | est 100 | 2016–2016 | pop 3500 → 15000 | high | https://worldpopulationreview.com/cities/spain/barcelona | “Barcelona is home to Spain's largest Jewish community”
```

##### Spain/Madrid

**[INFLATED_DEFINITION]** 116819 (2014-2025, 12000>15000, 'broad definition') and 116821 (2026, 15000 'out of 45,000 in Spain', a Law-of-Return/ancestry total) exceed the core Jewish population of the whole of Spain; 116818 (2001-2013, 3000>12000) ramps from EJ's narrow 3,000 to this broad 12,000 so the map shows ~7,900 in 2008 and 3,000-3,500 per EJ/Toledano elsewhere (116814, 116816).

```text
L116819: Spain | Madrid | est 100 | 2014–2025 | pop 12000 → 15000 | high | https://www.jta.org/2014/12/09/global/sephardic-vogue-argentine-immigrants-fueling-jewish-revival-in-spain | “JTA 9 Dec 2014: Madrid 'some 12,000 members' (broad definition).”
L116821: Spain | Madrid | est 100 | 2026–2026 | pop 15000 → — | high | https://www.jta.org/2026/01/23/food/her-ancestors-were-expelled-from-spain-now-shes-bringing-bagels-to-madrid | “JTA 23 Jan 2026: roughly 15,000 Jews in Madrid out of 45,000 in Spain.”
L116818: Spain | Madrid | est 100 | 2001–2013 | pop 3000 → 12000 | medium | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/spain | “Year approximate: EJ says about 3,000 Jews in the early 21st century (narrow community definition).”
```

**[OTHER]** city_other is 'bartolillos' (a pastry) on 6 Madrid rows (e.g. 116796, 116799, 116803), not a name for Madrid.

```text
L116796: Spain | Madrid | est  | 1492–1853 | pop — → — | high | https://europeanjewishtravel.org/discovering-jewish-heritage-in-madrid/ | “The expulsion of Jews from Spain in 1492 forced Jews to convert to Christianity or leave, profoundly diminishing the Jewish population in Madrid.”
L116799: Spain | Madrid | est  | 1854–1967 | pop — → — | high | https://europeanjewishtravel.org/discovering-jewish-heritage-in-madrid/ | “The British Cemetery of Madrid was established, serving as a resting place for British nationals and Jews who found refuge in the city, including the prominent Bauer family.”
L116803: Spain | Madrid | est 100 | 1900–1938 | pop — → — | high | https://www.worldjewishcongress.org/en/about/communities/es | “Jews opened a synagogue in Madrid in the first decades of the 20th century.”
```

##### Sweden/Stockholm

**[OTHER]** city_other is 'Stockholms Kulturfestival' on all Stockholm rows (e.g. 118329-118331), the name of a cultural festival, not an alternative name of the city.

```text
L118329: Sweden | Stockholm | est 1680 | 1680–1733 | pop — → — | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Sweden | “In 1680 the Jews of Stockholm petitioned the king to reside there without abandoning their creed; denied. Presence verified also in 17th-century Stockholm Cathedral baptism records (Jewish converts)”
L118330: Sweden | Stockholm | est 1680 | 1685–1685 | pop — → — | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Sweden | “Event: after 28 members of the Mandel and Jacob families had been baptised in the Stockholm German Church in the presence of Charles XI in 1681, and a 1680 petition to live there as Jews had been refused, on 3 Dec 1685 the king ordered that no Jews be allowed to settle in Stockholm or anywhere in Sweden and that any found be told to leave within fourteen day…”
L118331: Sweden | Stockholm | est 1680 | 1702–1733 | pop — → — | high | https://www.jewishvirtuallibrary.org/jsource/vjw/Sweden.html | “Samson Efraim and his son visited Stockholm and Goteborg on business”
```

##### Switzerland/Zurich

**[WARTIME_COUNT]** 119221 (1945-2015, 10500>6800) takes the 1945 figure that 'includes wartime refugees' and ramps it for 70 years. Map shows ~9,180 in 1970, ~8,650 in 1980, ~8,120 in 1990, ~7,590 in 2000, vs federal census 5,477, 4,505, 4,823 and 4,903 (1.55-1.9x). 119220 (1941-44, 6175>10500) chains the same refugee number.

```text
L119221: Switzerland | Zurich | est 1200 | 1945–2015 | pop 10500 → 6800 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Z%C3%BCrich | “About 10500 Jewish population; includes wartime refugees”
L119226: Switzerland | Zurich | est 1200 | 1970–1970 | pop 5477 → 5477 | high | https://www.bfs.admin.ch/asset/en/240960 | “Federal census of 1 Dec 1970: resident population (wirtschaftlicher Wohnsitz) of 'Jüdische Glaubensgemeinschaft' (Jewish faith community) in the municipality Zürich (BFS municipality no. 0261, municipality boundaries as of the census), BFS PC-Axis table px-x-4001000000_122 'Wohnbevölkerung am wirtschaftlichen Wohnsitz nach institutionellen Gliederungen und R…”
L119227: Switzerland | Zurich | est 1200 | 1980–1980 | pop 4505 → 4505 | high | https://www.bfs.admin.ch/asset/en/240960 | “Federal census of 2 Dec 1980: resident population (wirtschaftlicher Wohnsitz) of 'Jüdische Glaubensgemeinschaft' (Jewish faith community) in the municipality Zürich (BFS municipality no. 0261, municipality boundaries as of the census), BFS PC-Axis table px-x-4001000000_122 'Wohnbevölkerung am wirtschaftlichen Wohnsitz nach institutionellen Gliederungen und R…”
L119228: Switzerland | Zurich | est 1200 | 1990–1990 | pop 4823 → 4823 | high | https://www.bfs.admin.ch/asset/en/240960 | “Federal census of 4 Dec 1990: resident population (wirtschaftlicher Wohnsitz) of 'Jüdische Glaubensgemeinschaft' (Jewish faith community) in the municipality Zürich (BFS municipality no. 0261, municipality boundaries as of the census), BFS PC-Axis table px-x-4001000000_122 'Wohnbevölkerung am wirtschaftlichen Wohnsitz nach institutionellen Gliederungen und R…”
L119229: Switzerland | Zurich | est 1200 | 2000–2000 | pop 4903 → 4903 | high | https://www.bfs.admin.ch/asset/en/240960 | “Federal census of 5 Dec 2000: resident population (wirtschaftlicher Wohnsitz) of 'Jüdische Glaubensgemeinschaft' (Jewish faith community) in the municipality Zürich (BFS municipality no. 0261, municipality boundaries as of the census), BFS PC-Axis table px-x-4001000000_122 'Wohnbevölkerung am wirtschaftlichen Wohnsitz nach institutionellen Gliederungen und R…”
L119220: Switzerland | Zurich | est 1200 | 1941–1944 | pop 6175 → 10500 | high | https://www.xn--jdische-gemeinden-22b.de/index.php/gemeinden/u-z/2165-zuerich-schweiz | “Jews in city of Zurich per census table”
```

**[EXPULSION_RAMP]** 119182 (1349-1389, 400>100) ramps down over 40 years from the community killed in the Feb 1349 massacre (comment: 'population = size before massacre'); 119190 (1390-1633, 100>0) spreads the end-14th-century community of ~100 over 243 years, showing ~50 in 1510, though Zurich expelled its Jews in the 15th century (c.1436).

```text
L119182: Switzerland | Zurich | est 1200 | 1349–1389 | pop 400 → 100 | high | https://en.wikipedia.org/wiki/Zurich_massacre | “Community numbered around 400 and most were killed in the Feb 1349 massacre (Population = community size before massacre)”
L119190: Switzerland | Zurich | est 1200 | 1390–1633 | pop 100 → 0 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Z%C3%BCrich | “Second community about 100 people (about 2% of city) towards end of 14th century; year is estimate for 'end of century'”
```

**[OTHER]** city_german is 'Platzspitz' on all 67 Zurich rows (e.g. lines 119170-119172); Platzspitz is a park in Zurich, not the German name of the city (Zürich).

```text
L119170: Switzerland | Zurich | est 1200 | 1200–1200 | pop — → — | high | https://www.peek.com/zrich-zurich-switzerland/r0qgxgp/jewish-zurich-explore-old-towns-heritage/a0awgegx | “Jewish settlers were present during the 13th century in Zurich's Jewish Quarter, historically known as Judengasse.”
L119171: Switzerland | Zurich | est 1200 | 1200–1435 | pop — → — | high | https://www.worldjewishcongress.org/en/about/communities/ch | “The city has four synagogues and employs rabbis.”
L119172: Switzerland | Zurich | est 1200 | 1200–1435 | pop — → — | high | https://swissjews.ch/en/jewishlife/history/ | “At the beginning of the 13th century, Jews were resident in the city; a Jewish family owned a house at Brunngasse 8 containing preserved wall paintings.”
```

##### United Kingdom/Brighton

**[CHAIN_SUBSET]** Between the sourced 1974 (10,000) and 2016+, the continuous rows are Reform synagogue memberships: 155432/155433 (1956-1989, 400>300>305; 80 families), 155438/155440 (305>215>467), 155442-155445 (467-546 adult members, 2016-2026), and congregation 'membership households' x5 (155439 3060>215, 155441 3800>467). The map shows 300 Jews in 1980, ~1,340 in 2010 and ~500 in 2020 for Brighton & Hove, with 155439/155441 ramping a household count into a one-congregation number.

```text
L155432: United Kingdom | Brighton | est 1766 | 1956–1961 | pop 400 → 300 | high | https://www.jewishgen.org/jcr-uk/Community/br4/index.htm | “Estimate based on families. 80 families reported for Brighton & Hove Reform Synagogue”
L155433: United Kingdom | Brighton | est 1766 | 1962–1989 | pop 300 → 305 | high | https://www.jewishgen.org/jcr-uk/Community/br4/index.htm | “300 members reported”
L155438: United Kingdom | Brighton | est 1766 | 1990–1995 | pop 305 → 215 | high | https://www.jewishgen.org/jcr-uk/Community/br2/index.htm | “305 members (comprising 143 households, 76 individual male and 86 individual female members)”
L155440: United Kingdom | Brighton | est 1766 | 1996–2015 | pop 215 → 467 | high | https://www.jewishgen.org/jcr-uk/Community/br2/index.htm | “215 members (comprising 115 households, 40 individual male and 60 individual female members)”
L155442: United Kingdom | Brighton | est 1766 | 2016–2016 | pop 467 → 546 | high | https://www.jewishgen.org/jcr-uk/Community/br4/annual%20teports/BHRS_2016_(to%2031_Mar).PDF | “Adult membership of Brighton and Hove Reform Synagogue was 467”
L155445: United Kingdom | Brighton | est 1766 | 2019–2026 | pop 522 → — | high | https://www.jewishgen.org/jcr-uk/Community/br4/annual%20teports/BHRS_2019_(to%2031_Mar).pdf | “Adult membership was 440 and child membership was 82”
L155439: United Kingdom | Brighton | est 1766 | 1990–1995 | pop 3060 → 215 | high | https://www.jewishgen.org/jcr-uk/Community/br4/index.htm | “Estimate based on families. 612 members (households) reported”
L155441: United Kingdom | Brighton | est 1766 | 1996–2015 | pop 3800 → 467 | high | https://www.jewishgen.org/jcr-uk/Community/br4/index.htm | “Estimate based on families. 760 members (households) reported”
```

##### United Kingdom/Buxton

**[WARTIME_COUNT]** 155551 (1930-1944, 30>1500) ramps from '30 refugee German boys' (a school subset) to 1,500 = '300 families x5' of wartime evacuees; 155552 ramps 1500>0 over 1945-1948. The map shows ~870 in 1938 and ~1,010 in 1940 for a place with a handful of Jews, and 155549 (1901-1929, 2>30) uses the same 30-boys figure as pop_end.

```text
L155551: United Kingdom | Buxton | est 1820 | 1930–1944 | pop 30 → 1500 | high | https://www.jewishgen.org/jcr-uk/community/buxton/The_Jewish_Community_of_Buxton.htm | “During the 1930s, the principal of Buxton College accepted about 30 refugee German boys of Jewish extraction as boarders.”
L155552: United Kingdom | Buxton | est 1820 | 1945–1948 | pop 1500 → 0 | high | https://www.jewishgen.org/jcr-uk/community/buxton/The_Jewish_Community_of_Buxton.htm | “Estimate based on families. By the end of the war, up to 300 Jewish families lived in Buxton and the surrounding area; a Women's Zionist Society was formed.”
L155549: United Kingdom | Buxton | est 1820 | 1901–1929 | pop 2 → 30 | high | https://www.jewishgen.org/jcr-uk/community/buxton/The_Jewish_Community_of_Buxton.htm | “Census shows Jacob Banes and his wife Esther living at Kenneth House; his partnership 'The Buxton Wholesale Supply Company' was dissolved.”
```

##### United Kingdom/Glasgow

**[CHAIN_SUBSET]** 156305 (1914-1937, 10000>90) ends in 90 = seatholders of the Glasgow Reform Synagogue (156306), so the map falls from 10,000 to ~3,100 in 1930 and 90 in 1937. 156306 (1938-44, 90>100) is Reform seatholders; 156307 ramps 100>15000 (1945-49; ~6,060 in 1947) and 156308 ramps 15000>135 (1950-54; ~7,570 in 1952), a saw-tooth between a 1950s total and a single congregation.

```text
L156305: United Kingdom | Glasgow | est 1800 | 1914–1937 | pop 10000 → 90 | high | https://archive.jpr.org.uk/download?id=2576 | “By 1914 there were about ten thousand Jews in Glasgow”
L156306: United Kingdom | Glasgow | est 1800 | 1938–1944 | pop 90 → 100 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “Number of seatholders at Glasgow Reform Synagogue”
L156307: United Kingdom | Glasgow | est 1800 | 1945–1949 | pop 100 → 15000 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “Number of seatholders at Glasgow Reform Synagogue”
L156308: United Kingdom | Glasgow | est 1800 | 1950–1954 | pop 15000 → 135 | medium | https://www.jewishpressgulfcoast.com/articles/tracing-time-and-tradition-through-jewish-glasgow/ | “Approximately 15,000 Jews in Glasgow in the 1950s”
```

**[CHAIN_SUBSET]** For 1955-1976 and 1977-2000 the only continuous rows are the numbers of seatholders/members of the Glasgow Reform Synagogue (135, 170, 200, 254, 263, 172, 234 ... ramp to 1,119) used as the town's Jewish population, while 13,400 (1964-1971) is sourced for single years only. Map shows 254 Jews in 1970s-80s and ~170-234 in the 1990s when the community numbered thousands.

```text
L156309: United Kingdom | Glasgow | est 1800 | 1955–1956 | pop 135 → 140 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “Number of seatholders at Glasgow Reform Synagogue”
L156310: United Kingdom | Glasgow | est 1800 | 1957–1957 | pop 140 → 170 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “Number of seatholders at Glasgow Reform Synagogue”
L156311: United Kingdom | Glasgow | est 1800 | 1958–1960 | pop 170 → 200 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “Number of seatholders at Glasgow Reform Synagogue”
L156312: United Kingdom | Glasgow | est 1800 | 1961–1976 | pop 200 → 254 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “Number of seatholders at Glasgow Reform Synagogue”
L156317: United Kingdom | Glasgow | est 1800 | 1977–1982 | pop 254 → 263 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “137 male (or household) members and 117 female members at Glasgow Reform Synagogue”
L156318: United Kingdom | Glasgow | est 1800 | 1983–1989 | pop 263 → 172 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “143 male (or household) members and 120 female members at Glasgow Reform Synagogue”
L156319: United Kingdom | Glasgow | est 1800 | 1990–1995 | pop 172 → 234 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “172 members (comprising 91 households, 38 individual male and 43 individual female members) at Glasgow Reform Synagogue”
L156320: United Kingdom | Glasgow | est 1800 | 1996–2000 | pop 234 → 1119 | high | https://www.jewishgen.org/JCR-uk/community/glasgow01-reform/ | “234 members (comprising 176 households, 29 individual male and 29 individual female members) at Glasgow Reform Synagogue”
```

##### United Kingdom/Leeds

**[CHAIN_SUBSET]** 156679 (2001 census, 8,267) is ramped 2001-2006 to 250, a number from the Masorti synagogue (30 members / under 50 households, 156680, 156681). 156682 is described as the 2011 census but carries 250. So the map shows ~4,260 in 2003, 250 for 2006-2015, then 156683 ramps 250>6,627 in 2016. The census figures (about 8,000 and 6,000+) are replaced by a congregation size for 2006-2015.

```text
L156679: United Kingdom | Leeds | est 1735 | 2001–2006 | pop 8267 → 250 | high | https://www.jpr.org.uk/sites/default/files/attachments/Jews%20in%20Britain%20in%202021.First%20results%20from%… | “Jewish population in the local authority of Leeds according to the 2001 Census.”
L156680: United Kingdom | Leeds | est 1735 | 2007–2009 | pop 250 → 250 | high | https://www.jewishgen.org/jcr-uk/Community/le20-masorti/index.htm | “Masorti Judaism's Annual Reports listed 30 members for the Leeds Masorti Synagogue from 1 January 2007 through 2016.”
L156681: United Kingdom | Leeds | est 1735 | 2010–2010 | pop 250 → 250 | high | https://www.jewishgen.org/jcr-uk/Community/le20-masorti/index.htm | “Estimate based on families. A survey reported the Leeds Masorti Synagogue as having under 50 members (by household).”
L156682: United Kingdom | Leeds | est 1735 | 2011–2015 | pop 250 → 250 | high | https://www.jpr.org.uk/sites/default/files/attachments/Jews%20in%20Britain%20in%202021.First%20results%20from%… | “Jewish population in the local authority of Leeds according to the 2011 Census.”
L156683: United Kingdom | Leeds | est 1735 | 2016–2016 | pop 250 → 6627 | high | https://www.jewishgen.org/jcr-uk/Community/le20-masorti/index.htm | “Estimate based on families. A survey reported the Leeds Masorti Synagogue as having under 50 members (by household).”
```

**[GAP]** Leeds (18,000 in 1970) has no row between 1971 and 2000; a community of ~10,000+ vanishes from the map for 30 years.

```text
L156678: United Kingdom | Leeds | est 1735 | 1970–1970 | pop 18000 → 18000 | low | https://www.jewishvirtuallibrary.org/leeds | “Encyclopaedia Judaica entry text as reproduced by the Jewish Virtual Library: 'In 1970 the Jewish community was estimated at 18,000 out of a population of approximately 508,000.' Estimate for the year named in the entry (EJ 1971-72 text, with later updates in the 2007 edition).”
L156679: United Kingdom | Leeds | est 1735 | 2001–2006 | pop 8267 → 250 | high | https://www.jpr.org.uk/sites/default/files/attachments/Jews%20in%20Britain%20in%202021.First%20results%20from%… | “Jewish population in the local authority of Leeds according to the 2001 Census.”
```

##### United Kingdom/Manchester

**[CHAIN_SUBSET]** 157064 (2006-2009, 30000>250) takes pop_end from the next row, the Manchester Liberal Jewish Community (under 50 households, 250). Map falls from 30,000 (2006) to ~10,200 in 2008 and 250 in 2009. 157066/157069/157073 then hold 250 (one small congregation) for 2010-2026, although 157070 says Manchester has ~30,000 (Salford, Prestwich, Bury). The town is drawn as 250 Jews for 17 years.

```text
L157064: United Kingdom | Manchester | est 1770 | 2006–2009 | pop 30000 → 250 | high | https://www.jewishgen.org/JCR-UK/Manchester.htm | “Jewish population, JCR-UK table; stated as 30,000; source cited: The Jewish Year Book 2007; Manchester & District incl. Salford (as titled by JCR-UK)”
L157066: United Kingdom | Manchester | est 1740 | 2010–2015 | pop 250 → 250 | high | https://www.jewishgen.org/jcr-uk/Community/m50_lib/index.htm | “Estimate based on under 50 member households for the Manchester Liberal Jewish Community; Rabbi Mark L. Solomon began serving”
L157069: United Kingdom | Manchester | est 1740 | 2016–2024 | pop 250 → — | high | https://www.jewishgen.org/jcr-uk/Community/m50_lib/index.htm | “Estimate based on under 50 member households for the Manchester Liberal Jewish Community”
L157073: United Kingdom | Manchester | est 1740 | 2025–2026 | pop 250 → 250 | estimate | Estimate: carried forward from 2016, not a source | “Estimate, not a measurement: the last sourced count for this town is 250 in 2016 (https://www.jewishgen.org/jcr-uk/Community/m50_lib/index.htm); no newer count was found, so the same number is carried forward to 2026.”
```

##### United Kingdom/Stamford Hill

**[CONFLICT]** Mixed definitions in one series: 158008 (2020) = 38,779 directory estimate of the Charedi population of all Stamford Hill including 7,077 in Haringey, while 158009 (2021 census, 3 Hackney wards) = 13,267 (2.9x lower); 158004 census (2001, 3 wards) = 5,891 vs 158005 directory x5 (2003) = 13,670 (2.3x). Households x5, midpoints of ranges and ward census religion are alternated, so the map jumps 5,891 -> 13,670 -> 9,651 -> 38,779 -> 13,267.

```text
L158008: United Kingdom | Stamford Hill | est 1763 | 2020–2020 | pop 38779 → 38779 | low | https://new.haringey.gov.uk/sites/default/files/2024-04/jsna-jewish_needs.pdf | “Haringey Council, South Tottenham Jewish Population Needs Analysis (January 2024): the Shomer Shabbos directory estimated the Charedi population of Stamford Hill in 2020 at approximately 38,779, of whom 7,077 (18%) lived in Haringey (the Institute for Jewish Policy Research put the Haringey share at 20 to 25%). Strictly Orthodox residents only; the directory…”
L158009: United Kingdom | Stamford Hill | est 1763 | 2021–2021 | pop 13267 → 13267 | high | https://www.nomisweb.co.uk/api/v01/dataset/NM_2049_1.data.csv?date=latest&geography=E05009383,E05009368,E05009… | “2021 Census (table TS030 Religion, Nomis), Springfield (5,461), Cazenove (3,668) and Stamford Hill West (4,138) wards, Hackney, summed: 13,267 of 40,997 usual residents (32.4%) described their religion as Jewish. Adjoining wards add South Tottenham (Haringey) 3,624, Woodberry Down 1,027, Seven Sisters (Haringey) 640, Stoke Newington 434 and Lea Bridge 351. H…”
L158004: United Kingdom | Stamford Hill | est 1763 | 2001–2001 | pop 5891 → 5891 | high | https://www.nomisweb.co.uk/api/v01/dataset/NM_1607_1.data.csv?date=latest&c_relpuk11=0,4&measures=20100&geogra… | “2001 Census (table KS007 Religion, Nomis), 2003 Springfield, Lordship and Cazenove wards, Hackney (summed): 5891 of 32658 usual residents described their religion as Jewish. Electoral-ward figure only; ward boundaries were revised between 2001 and 2011; ward values summed. These are three of the six wards that the Board of Deputies of British Jews uses for S…”
L158006: United Kingdom | Stamford Hill | est 1763 | 2007–2007 | pop 14760 → 14760 | low | https://archive.jpr.org.uk/download?id=2640 | “Board of Deputies study (Vulkan and Graham, 2008), table 4: 3,174 households in the Shomer Shabbos Telephone Directory (2007); estimated strictly Orthodox population 10,792 (3.4 persons per household) to 18,727 (5.9 per household); the figure is the midpoint of that range. Strictly Orthodox households only, not all Jews of the area; the report defines Stamfo…”
```

#### USA and Canada — 36 findings in 21 towns

##### Canada/Montreal

**[CHAIN_SUBSET]** 12043 starts from the 101,000 Metropolitan Montreal figure (1991) but its pop_end 26,680 is the 2021 census-subdivision (city proper, ethnic origin) count of 12045, so the map shows a decline from 101,000 to 26,680 over 1991-2020 (65,100 in 2005) although the metro community was roughly stable at 90,000-100,000. 12045 then ramps 26,680 -> 90,000 (2025 article, whole community) giving 47,800 in 2022. Definitions (metro vs city, religion vs ethnic origin) are mixed within one ramp.

```text
L12043: Canada | Montreal | est 1760 | 1991–2020 | pop 101000 → 26680 | high | https://www.ebsco.com/research-starters/religion-and-philosophy/jewish-canadians | “Jewish population of Montreal according to the federal census.”
L12045: Canada | Montreal | est 1760 | 2021–2024 | pop 26680 → 90000 | high | https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810035801 | “Jewish ethnic origin (single+multiple responses; NOT religion), 2021 Census CSD, StatCan table 98-10-0358-01, randomly rounded to multiple of 5; census subdivision type V”
```

##### Canada/Toronto

**[OTHER]** 13618 is a single ramp 1951-2020 from the 1951 census religion count for the municipality (44,950) to the 2021 ethnic-origin count for the municipality (74,080): 70 years with no intermediate point, mixing religion and ethnic origin; it shows 53,393 in 1971 and 66,060 in 2001 while the file's own metro figures are 66,773 (1951) and 186,010-188,710 (2011). Probably understates the community on the Toronto marker and mixes definitions.

```text
L13618: Canada | Toronto | est 1817 | 1951–2020 | pop 44950 → 74080 | high | https://www.jewishdatabank.org/content/upload/bjdb/Cities,_Towns_&_Villages,_Canada_1851-1951_Canadian_Jewish_… | “Jewish population by religion (census), Rosenberg Gazetteer Table 2, census of 1951; municipality itself, not metropolitan area”
L13645: Canada | Toronto | est 1817 | 2021–2021 | pop 74080 → — | high | https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810035801 | “Jewish ethnic origin (single+multiple responses; NOT religion), 2021 Census CSD, StatCan table 98-10-0358-01, randomly rounded to multiple of 5; census subdivision type C”
```

##### USA/Boston

**[CHAIN_SUBSET]** 123883's own comment says 'East Boston peak of around five thousand in the 1910s; neighborhood subset; left blank', yet it carries pop_start 5,000. 123878 (60,000 in 1907) takes this as pop_end, so the map falls 60,000 -> 5,000 by 1910 (41,667 in 1908, 23,333 in 1909) and then climbs 5,000 -> 85,000 over 1910-1915 (37,000 in 1912). Other rows in the file give about 60,000 (1907-09) and 85,000 (1915).

```text
L123878: USA | Boston | est 1649 | 1907–1910 | pop 60000 → 5000 | high | https://www.bostonglobe.com/metro/regionals/south/2012/04/14/jewish-history-greater-boston-timeline/pIC3qhki4V… | “Timeline entry 'Boston's Jewish population triples, to 60,000'; boundary unclear”
L123883: USA | Boston | est 1649 | 1910–1915 | pop 5000 → 85000 | high | https://globalboston.bc.edu/index.php/home/immigrant-places/east-boston/jews-in-east-boston/ | “East Boston peak of around five thousand in the 1910s (year 1910 assumed); neighborhood subset; left blank”
```

**[INFLATED_DEFINITION]** 123956 (1985) is the Greater Boston metro (170,000; row 123957 says 'metro, not city') but its pop_end 21,000 is the AJYB city figure, so the map ramps 170,000 -> 21,000 over 1985-1997 (95,500 in 1991), holds 21,000 through 2001 (123959, 123961) and then jumps to 227,300 (metro) in 2002. The Boston series mixes city and metro definitions with a spurious 8x fall and rise.

```text
L123956: USA | Boston | est 1649 | 1985–1997 | pop 170000 → 21000 | medium | User-supplied historical Jewish population compilation (Google Sheets, no public source cited per figure) | “User-supplied historical population figure.”
L123959: USA | Boston | est 1649 | 1998–2001 | pop 21000 → 21000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3540 | “AJYB vol. 99 (1998) table 'Communities with Jewish populations of 100 or more (estimated)', MA, PDF p.11; year = the table's stated estimate year. City figure as printed (rounded estimate)”
L123961: USA | Boston | est 1649 | 2001–2001 | pop 21000 → 227300 | medium | https://www.bjpa.org/content/upload/bjpa/jewi/JewishPopulationInTheUnitedStates2002[1].pdf | “Estimated Jewish population of Boston city.”
```

##### USA/Chicago

**[INFLATED_DEFINITION]** The series switches between metro and city-limits definitions through ramps. 125462 (1980-1994) ramps from the metro 250,000 down to 85,000, the 'within city limits' figure of 125463 (about 132,000 in 1990, while the same comment says the metro was about 248,000 in 1995); 125463 then ramps 85,000 -> 261,000 (metro, AJYB 2002), showing 173,000 in 1998; 125466 (Chicago 6-county metro 291,800 in 2012) ramps down to 120,000 (2020, 'city proper' - the same comment gives 319,600 for the metro) so the map shows 218,000 in 2015 and holds 120,000 from 2019 to 2026 though the sourced community is about 300,000.

```text
L125462: USA | Chicago | est 1832 | 1980–1994 | pop 250000 → 85000 | medium | User-supplied historical Jewish population compilation (Google Sheets, no public source cited per figure) | “User-supplied historical population figure.”
L125463: USA | Chicago | est 1832 | 1995–2001 | pop 85000 → 261000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Chicago | “Roughly 85000 Jews within city limits; ~248000 in Chicago area (metro) in 1995”
L125466: USA | Chicago | est 1832 | 2012–2019 | pop 291800 → 120000 | medium | https://www.jewishdatabank.org/content/upload/bjdb/611/Jewish_Population_in_the_United_States_2012.pdf | “Sheskin & Dashefsky, 'Jewish Population in the United States, 2012', Appendix A (communities with 100+ Jews), Illinois section, printed entry 'Chicago (Cook, DuPage, Kane, Lake, McHenry, & Will Counties) Total (2010)'; Number of Jews = Jewish persons (excludes non-Jewish household members); scope: Chicago metro: Cook, DuPage, Kane, Lake, McHenry and Will Cou…”
L125467: USA | Chicago | est 1832 | 2020–2020 | pop 120000 → — | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Chicago | “2020 estimate: ~120000 in city proper; ~319600 metropolitan”
```

##### USA/Cleveland

**[CONFLICT]** 1885-1890 sources disagree 3.5x and are ramped into each other: 5,000 (1885) -> 17,500 (1888; midpoint of '15,000-20,000') -> 5,000 (1890; EJ 'over 5000', whose comment itself says it conflicts with 15,000-20,000 for 1888). The map shows 9,167 in 1886, 17,500 in 1888, 11,250 in 1889, 5,000 in 1890 and 12,500 in 1895; the 1888 spike or the 1890 trough is wrong.

```text
L125792: USA | Cleveland | est 1835 | 1885–1888 | pop 5000 → 17500 | high | https://clevelandjewishhistory.net/places/woodland/index.htm | “5000 Jews (Cleveland Jewish population timeline)”
L125797: USA | Cleveland | est 1835 | 1888–1890 | pop 17500 → 5000 | high | https://clevelandjewishhistory.net/places/woodland/index.htm | “15000-20000 Jews (timeline); midpoint of range used”
L125801: USA | Cleveland | est 1835 | 1890–1900 | pop 5000 → 20000 | high | https://clevelandjewishhistory.net/res/cleveland-jewish-ej2006.htm | “"In 1890 the Jewish population was over 5000" (Encyclopaedia Judaica 2006); lower bound; conflicts with 15000-20000 for 1888 in another source”
```

##### USA/Denver

**[CHAIN_SUBSET]** Greater Denver-Boulder 95,000 (2012-13, seven-county area; 83,900 in 2007) ramps down to 25,200, a 2020 AJPP state/county table figure ('Denver, including 14,600 Jewish adults'), i.e. a single county. The map shows 67,080 in 2016 and 25,200 in 2019, held flat to 2026, a fall of 74% that is a change of geography.

```text
L127085: USA | Denver | est 1907 | 2014–2019 | pop 95000 → 25200 | medium | https://www.jewishdatabank.org/content/upload/bjdb/775/AJYB%202014%20Appendix%20A.xlsx | “Sheskin & Dashefsky, 'Jewish Population in the United States, 2014', Appendix A (communities with 100+ Jews), Colorado section, printed entry 'Greater Denver (Adams, Arapahoe, Boulder, Broomfield, Denver, Douglas, & Jefferson Counties) Total (2007)'; Number of Jews = Jewish persons (excludes non-Jewish household members); scope: Greater Denver-Boulder (Adams…”
L127086: USA | Denver | est 1907 | 2020–2020 | pop 25200 → — | medium | https://www.jewishdatabank.org/api/download/?studyId=1166&mediaId=bjdb%5C2020_American_Jewish_Population_Estim… | “Estimated total Jewish population for Denver (including 14,600 Jewish adults).”
L127087: USA | Denver | est 1907 | 2021–2026 | pop 25200 → 25200 | estimate | Estimate: carried forward from 2020, not a source | “Estimate, not a measurement: the last sourced count for this town is 25,200 in 2020 (https://www.jewishdatabank.org/api/download/?studyId=1166&mediaId=bjdb%5C2020_American_Jewish_Population_Estimates_State_and_County_DB.pdf); no newer count was found, so the same number is carried forward to 2026.”
```

##### USA/Fort Lauderdale

**[HELD_FLAT]** 128519 is a single row for 1983-2024: AJYB 1984 figure 80,000 ramped to 73,441 over 41 years (about 76,700 throughout). 73,441 is the Miami-Fort Lauderdale-West Palm Beach metro figure from appliedgeographic (128520 says it was removed as 'not this city'), so the end value is the wrong geography and no sourced city count covers 1985-2024.

```text
L128519: USA | Fort Lauderdale | est 1950 | 1983–2024 | pop 80000 → 73441 | low | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3295 | “AJYB vol. 84 (1984) table 'Communities with Jewish populations of 100 or more (estimated)', FL, PDF p.7; year = the table's stated estimate year; city's own figure, rounded estimate as printed This figure is far larger than neighbouring rows for the same town, or is a medieval traveller's estimate.”
L128520: USA | Fort Lauderdale | est 1931 | 2025–2026 | pop — → — | medium | https://appliedgeographic.com/2025/12/11/mapping-jewish-population-clusters-across-north-america/ | “Estimated Jewish population for the broader Miami-Fort Lauderdale-West Palm Beach metropolitan area”
```

##### USA/Las Vegas

**[CONFLICT]** 1965: 132388 'perhaps 10,000 in a city of around 150,000' (rough estimate, own comment says it conflicts with AJYB) versus AJYB 2,000 (132387, 132386, 132390 for 1964-66). The map shows the higher 10,000 for 1965, a 5x spike between 2,000 in 1964 and 2,000 in 1966.

```text
L132388: USA | Las Vegas | est 1905 | 1965–1965 | pop 10000 → 2000 | high | https://www.lasvegasadvisor.com/question/jewish-presence/ | “'Perhaps 10000 in a city of around 150000' (rough estimate; conflicts with AJYB 2000 for the same period); city of Las Vegas”
L132387: USA | Las Vegas | est 1905 | 1965–1965 | pop 2000 → 2000 | medium | https://www.jewishdatabank.org/content/upload/bjdb/1965_Jewish_Population_in_the_United_States_(AJYB-1966).pdf | “AJYB 'Jewish Population in the United States' table of communities: Las Vegas 2000 (Nevada state total given separately; community listed, boundary not stated as city limits).”
```

##### USA/Los Angeles

**[CHAIN_SUBSET]** Row 133172 has 565,000 (2021 Federation study) as pop_start but pop_end 94,737, copied from the 2025 appliedgeographic row 133173, which is described as the whole Los Angeles-Long Beach-Anaheim metro area yet carries 94,737. The map shows a collapse 565,000 (2021) -> 408,246 (2022) -> 251,491 (2023) -> 94,737 (2024) and holds 94,737 through 2026, about one sixth of the 565,000 sourced in the same row and of the 519,000-530,000 of earlier rows; the 94,737 cannot be the metro or city Jewish population.

```text
L133172: USA | Los Angeles | est 1841 | 2021–2024 | pop 565000 → 94737 | high | https://ejewishphilanthropy.com/new-study-of-finds-that-l-a-s-jewish-community-is-growing-and-increasingly-div… | “Jewish Federation of Greater Los Angeles 'Study of Jewish LA' (fieldwork June-Sept 2021, released 2022): about 565,000 Jews in about 294,000 Jewish households (press: 'more than 560,000'); scope: Los Angeles area per Federation service area; the study referred to as 2019 in the request is the 2021 study. Used as the single primary community line for this cit…”
L133173: USA | Los Angeles | est 1841 | 2025–2026 | pop 94737 → — | high | https://appliedgeographic.com/2025/12/11/mapping-jewish-population-clusters-across-north-america/ | “Population of Jewish residents in the Los Angeles-Long Beach-Anaheim metropolitan area.”
```

**[CHAIN_SUBSET]** Neighbourhood household counts x5 are used as the city population: 133131 (about 310 households in the Wilshire area = 1,550), 133133/133134 (1,800/1,842 households in Boyle Heights = 9,000/9,210), 133137 (2,410 Wilshire households = 12,050), 133140/133144 (Boyle Heights 10,000 and 14,000 households = 50,000 and 70,000). Because pop_end is chained from these, 133130 (5,795 in 1910) ramps down to 1,550 in 1913 (about 3,000 in 1912), 133131 ramps 1,550 -> 10,000, 133133 ramps 9,000 -> 65,000 (about 37,000 in 1922), and 1926 shows 12,050 between 65,000 (1925) and 65,000 (1927). Real city totals around those years are 10,000 (1917-19) and 65,000 (mid-1920s), so the series falsely dips to neighbourhood size.

```text
L133130: USA | Los Angeles | est 1841 | 1910–1913 | pop 5795 → 1550 | high | https://kids.kiddle.co/History_of_the_Jews_in_Los_Angeles | “Jewish population grew to 5,795”
L133131: USA | Los Angeles | est 1841 | 1914–1916 | pop 1550 → 10000 | high | https://www.policyarchive.org/download/10221 | “Estimate based on families. There were about 310 Jewish households in the Wilshire area.”
L133133: USA | Los Angeles | est 1841 | 1920–1924 | pop 9000 → 65000 | high | https://www.policyarchive.org/download/10221 | “Estimate based on families. There were 1,800 Jewish households in Boyle Heights.”
L133134: USA | Los Angeles | est 1841 | 1920–1924 | pop 9210 → 65000 | high | https://kids.kiddle.co/History_of_the_Jews_in_Los_Angeles | “Estimate based on families. There were 1,842 Jewish families in the Boyle Heights neighborhood”
L133137: USA | Los Angeles | est 1841 | 1926–1926 | pop 12050 → 65000 | high | https://www.policyarchive.org/download/10221 | “Estimate based on families. There were about 2,410 Jewish households in the Wilshire area.”
L133140: USA | Los Angeles | est 1841 | 1930–1937 | pop 50000 → 70000 | high | https://www.policyarchive.org/download/10221 | “Estimate based on families. Boyle Heights was home to 10,000 Jewish families (or households).”
L133144: USA | Los Angeles | est 1841 | 1938–1941 | pop 70000 → 130000 | high | https://www.policyarchive.org/download/10221 | “Estimate based on families. The Boyle Heights neighborhood had more than 14,000 Jewish households.”
```

##### USA/Miami

**[COMMENT_MISMATCH]** pop_end 473,100 on a 2015-2018 row whose own comment is the Sheskin Miami-Dade County total (119,000). The next row (134145) is 119,000 again, so 473,100 is not chained from it and is about 4x the county total. The map ramps 119,000 (2015) -> 237,033 (2016) -> 355,067 (2017) -> 473,100 (2018) and then drops to 119,000 in 2019.

```text
L134144: USA | Miami | est 1896 | 2015–2018 | pop 119000 → 473100 | medium | https://www.jewishdatabank.org/content/upload/bjdb/802/Jewish_Population_in_the_United_States_(Sheskin,_Dashef… | “Sheskin & Dashefsky, 'Jewish Population in the United States, 2015', Appendix A (communities with 100+ Jews), Florida section, printed entry 'Miami-Dade County Total (2014)'; Number of Jews = Jewish persons (excludes non-Jewish household members); scope: Miami-Dade County (all sub-areas combined); primary community line only (sub-areas not listed separately)…”
```

**[CHAIN_SUBSET]** Cemetery burial counts are used as the Jewish population. 134136 (1982) has 1,000 = 'over 1,000 burials' at Shalom Memorial Gardens and 134139 (1999-2001) has 27,000 = burials at Lakeside Memorial Park. Because pop_end is chained, 134138 (AJYB 1984, 253,340) ramps down to 27,000 over 1984-1998: about 156,000 in 1990 and 75,500 in 1995; 134135 ends in 1,000; 134139 starts at 27,000 in 1999 and ramps to 118,000 (72,500 in 2000). The 1982 point shows 1,000 and 1999 shows 27,000 for a community of 250,000 / over 100,000.

```text
L134138: USA | Miami | est 1925 | 1984–1998 | pop 253340 → 27000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3311 | “AJYB vol. 85 (1984) table 'Communities with Jewish populations of 100 or more (estimated)', FL, PDF p.31; year = the table's stated estimate year. City figure as printed (rounded estimate)”
L134139: USA | Miami | est 1896 | 1999–2001 | pop 27000 → 118000 | high | https://cdp.jewishgen.org/usa/florida-fl/miami-dade-county | “Over 27,000 burials recorded at Lakeside Memorial Park as of this year”
L134135: USA | Miami | est 1925 | 1981–1981 | pop 225000 → 1000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3261 | “AJYB vol. 82 (1982) table 'Communities with Jewish populations of 100 or more (estimated)', FL, PDF p.7; year = the table's stated estimate year; city's own figure, rounded estimate as printed”
L134136: USA | Miami | est 1896 | 1982–1982 | pop 1000 → 253340 | high | https://cdp.jewishgen.org/usa/florida-fl/miami-dade-county | “Shalom Memorial Gardens in use, with over 1,000 burials”
```

**[CHAIN_SUBSET]** Burial counts used as population: 134108 (1937) 500 = 'cumulative burials' in the Jewish section of Graceland Memorial Park, 134109 (1940-47) 20,000 = 'perhaps 20,000 burials' at Mt. Nebo. 134107 (AJYB 2,650 in 1927) is ramped down to the 500 burials (about 1,700 in 1931, 500 in 1936) and 134108 ramps 500 -> 20,000 over 1937-39. Neither number is a count of living Jews; the early decline 2,650 -> 500 is an artefact.

```text
L134107: USA | Miami | est 1925 | 1927–1936 | pop 2650 → 500 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=1828&ownerType=0&ownerId=2425 | “AJYB vol 30 (1928) General Table F List of places reporting Jews and number reported (Linfield), Jewish Population of the United States 1927; state heading Florida; PDF page 97.”
L134108: USA | Miami | est 1896 | 1937–1939 | pop 500 → 20000 | medium | https://cdp.jewishgen.org/usa/florida-fl/miami-dade-county | “Graceland Memorial Park has a Jewish section dating back to approximately this year, with 500 cumulative burials recorded”
L134109: USA | Miami | est 1896 | 1940–1947 | pop 20000 → 40000 | high | https://cdp.jewishgen.org/usa/florida-fl/miami-dade-county | “Mt. Nebo Kendall Memorial Gardens (5505 NW 3rd Street) in use, with perhaps 20,000 burials recorded”
```

**[COMMENT_MISMATCH]** Comment lists North Dade (68,600), South Dade (40,300) and The Beaches (20,900), which sum to 129,800, but the row carries 123,200 -> 119,000 (neither matches the stated parts). Also the 2012-13 row ends at 123,200 so this row mostly restates it; low severity.

```text
L134143: USA | Miami | est 1896 | 2014–2014 | pop 123200 → 119000 | high | https://studycorgi.com/miami-jewish-population-health-assessment/ | “The Miami Jewish community is the 11th biggest in the USA; comprised of North Dade (68,600), South Dade (40,300), and The Beaches (20,900)”
```

##### USA/Minneapolis

**[CHAIN_SUBSET]** 134518 pop_start 630 = 126 poor Jewish families x5 whose homes were razed 1936-38; 134517 (AJYB 22,000 in 1927) takes it as pop_end, so the map falls 22,000 -> 630 over 1927-1935 (11,315 in 1931) and shows 630 in 1936 before ramping to 20,700. AJYB 1937 gives 20,700.

```text
L134517: USA | Minneapolis | est 1867 | 1927–1935 | pop 22000 → 630 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=1828&ownerType=0&ownerId=2425 | “AJYB vol 30 (1928) General Table F List of places reporting Jews and number reported (Linfield), Jewish Population of the United States 1927; state heading Minnesota; PDF page 102.”
L134518: USA | Minneapolis | est 1865 | 1936–1936 | pop 630 → 20700 | high | https://www.mnhs.org/mnopedia/search/index/exclusion-integration-story-jews-minnesota | “Estimate based on families. Homes of 126 poor Jewish families were razed between 1936 and 1938 to create the Sumner Field housing development.”
```

**[CHAIN_SUBSET]** 134522 pop_start 800 = 269 families of Holocaust survivors (about 800 individuals) who had settled by 1952; 134521 (23,000 in 1949) takes it as pop_end, so the map ramps 23,000 -> 800 (11,900 in 1950, 800 in 1951-52) and then back to 21,000 in 1953.

```text
L134521: USA | Minneapolis | est 1865 | 1949–1951 | pop 23000 → 800 | high | https://www.mnhs.org/mnopedia/search/index/exclusion-integration-story-jews-minnesota | “As late as 1949, 60 percent of Minneapolis's roughly twenty-three thousand Jews lived on the North Side.”
L134522: USA | Minneapolis | est 1865 | 1952–1952 | pop 800 → 21000 | high | https://www.mnhs.org/mnopedia/search/index/exclusion-integration-story-jews-minnesota | “By 1952, 269 families, consisting of about eight hundred individuals (Holocaust survivors/displaced persons), had settled in Minneapolis.”
```

**[CHAIN_SUBSET]** 134554 (Twin Cities total 40,200, AJYB 2007) takes pop_end 29,300 from 134555, which is the Hennepin County subtotal only (Minneapolis + inner/outer ring). The map shows 34,750 in 2009 and 29,300 in 2011-12 and then ramps 29,300 -> 64,800 (47,050 in 2015) mixing county, Twin Cities (40,200) and the 2019 study; the 2004 Twin Cities study put it at 40,000-45,500.

```text
L134554: USA | Minneapolis | est 1865 | 2007–2011 | pop 40200 → 29300 | medium | https://www.jewishdatabank.org/api/download/?studyId=701&mediaId=AJY-2007.pdf | “AJYB vol. 107 (2007) Table 3 'Communities with Jewish population of 100 or more' for 2007, Minnesota section, PDF p.47; printed row 'Twin Cities Total (2004)' is the table's own group-total line for this community (its sub-areas are listed separately and not used here); date of confirmation or latest study printed in the table: 2004.”
L134555: USA | Minneapolis | est 1865 | 2012–2018 | pop 29300 → 64800 | medium | https://www.jewishdatabank.org/content/upload/bjdb/611/Jewish_Population_in_the_United_States_2012.pdf | “Sheskin & Dashefsky, 'Jewish Population in the United States, 2012', Appendix A (communities with 100+ Jews), Minnesota section, printed entry 'Minneapolis (Hennepin County) Subtotal (2004)'; Number of Jews = Jewish persons (excludes non-Jewish household members); scope: Hennepin County (Minneapolis + Inner/Outer Ring); primary community line only (sub-areas…”
```

##### USA/Newark

**[CONFLICT]** 135862 ramps AJYB 1957 (40,860) up to 65,000 by 1959 (52,930 in 1958) although AJYB 1955 gave 56,800 -> 40,860 (the community was shrinking). The 65,000 comes from an undated WBGO sentence 'over 65,000 once ... in the 1950s and 1960s', placed at 1960 and ramped 65,000 -> 500 (1977), giving 27,059 in 1970, while the 1967 riots/suburbanisation emptied the city much faster. Both the false rise 1957-59 and the slow decline are artefacts of the placement.

```text
L135862: USA | Newark | est 1844 | 1957–1959 | pop 40860 → 65000 | medium | https://www.jewishdatabank.org/content/upload/bjdb/1957_Jewish_Population_in_the_United_States_(AJYB-1958).pdf… | “American Jewish Year Book 1957 estimate of the Jewish population of Newark (as listed in the Year Book's community table; may cover the town's immediate area).”
L135863: USA | Newark | est 1844 | 1960–1977 | pop 65000 → 500 | high | https://www.wbgo.org/show/wbgo-journal/2017-07-10/newarks-jewish-community-pre-and-post-1967-rebellion | “Over 65,000 people once made up Newark's Jewish community in the 1950s and 1960s, prior to outmigration and the 1967 Newark Rebellion.”
```

##### USA/Oakland

**[RAMP_OVERRIDES_SOURCED]** 136523 ramps from 12,000 (1956) to 100,750 (2013, 'Jewish Federation of the East Bay', Alameda + Contra Costa Counties) over 56 years: 34,188 in 1970 and 43,696 in 1976 against the file's own 18,000 for 1969-84 (136527, metro) and 22,000 for 1976 (136531, Alameda + Contra Costa regional aggregate), i.e. 1.9-2.0x; 58,000 in 1985. The 100,750 county-pair federation figure is also held as the Oakland city population to 2026 (136537, 136538).

```text
L136523: USA | Oakland | est 1852 | 1956–2012 | pop 12000 → 100750 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=2216&ownerType=0&ownerId=2813 | “AJYB vol 58 (1957) Table 1 Communities with Jewish populations of 100 or more (estimated), Jewish Population in the United States 1956; state heading California; PDF page 13.”
L136537: USA | Oakland | est 1852 | 2013–2013 | pop 100750 → — | medium | https://www.jewishdatabank.org/content/upload/bjdb/736/Jewish%20Population%20in%20the%20US%20%202013.pdf | “Sheskin & Dashefsky, 'Jewish Population in the United States, 2013', Appendix A (communities with 100+ Jews), California section, printed entry 'Jewish Federation of The East Bay Total (2011)'; Number of Jews = Jewish persons (excludes non-Jewish household members); scope: Jewish Federation of the East Bay (Alameda + Contra Costa Counties); primary community…”
L136538: USA | Oakland | est 1852 | 2014–2026 | pop 100750 → 100750 | estimate | Estimate: carried forward from 2013, not a source | “Estimate, not a measurement: the last sourced count for this town is 100,750 in 2013 (https://www.jewishdatabank.org/content/upload/bjdb/736/Jewish%20Population%20in%20the%20US%20%202013.pdf); no newer count was found, so the same number is carried forward to 2026.”
```

##### USA/Palm Springs

**[INFLATED_DEFINITION]** From 2002 the Palm Springs marker carries the Coachella Valley (printed 'Palm Springs (Coachella Valley) Total'; 17,000 -> 12,000 -> 11,000), while 1984 is the city figure (4,950). 137158 ramps 4,950 -> 17,000 over 1983-2001 (10,975 in 1992), mixing city and valley definitions.

```text
L137158: USA | Palm Springs | est 1948 | 1983–2001 | pop 4950 → 17000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3295 | “AJYB vol. 84 (1984) table 'Communities with Jewish populations of 100 or more (estimated)', CA, PDF p.6; year = the table's stated estimate year; city's own figure, rounded estimate as printed”
L137159: USA | Palm Springs | est 1948 | 2002–2006 | pop 17000 → 12000 | medium | https://www.jewishdatabank.org/api/download/?studyId=697&mediaId=bjdb%5c2002_Jewish_Population_in_the_United_S… | “AJYB vol. 103 (2003) appendix Table ('Communities with Jewish populations of 100 or more, 2001' header as printed; the report is titled 'Jewish Population in the United States, 2002'), California section, PDF p.10; printed row 'Palm SpringsN'; footnote mark: N (table legend: * = estimate includes the entire county, ** = includes all of two counties, *** = fi…”
L137161: USA | Palm Springs | est 1948 | 2012–2014 | pop 12000 → 11000 | medium | https://www.jewishdatabank.org/content/upload/bjdb/611/Jewish_Population_in_the_United_States_2012.pdf | “Sheskin & Dashefsky, 'Jewish Population in the United States, 2012', Appendix A (communities with 100+ Jews), California section, printed entry 'Palm Springs (Coachella Valley) Total (1998)'; Number of Jews = Jewish persons (excludes non-Jewish household members); scope: Coachella Valley; primary community line only (sub-areas not listed separately); underly…”
```

##### USA/Philadelphia

**[CHAIN_SUBSET]** 137642 (1970) is the Philadelphia SMSA (350,000) and its pop_end 86,600 comes from the 1999 AJYB city figure; the map therefore shows a linear decline 350,000 -> 86,600 over 1970-1998 (about 209,000 in 1985), mixing metro and city definitions. The city figure 86,600 (1999-2001) then jumps to 206,000 in 2002 (row 137648, 'Philadelphia area'). The 1984 study in the file (137643) says only 53 percent of area Jews lived in the city.

```text
L137642: USA | Philadelphia | est 1701 | 1970–1998 | pop 350000 → 86600 | medium | https://www.policyarchive.org/download/15332 | “Estimated Jewish population of all ages in the Philadelphia Standard Metropolitan Statistical Area (SMSA) at a point close to the 1970 census.”
L137645: USA | Philadelphia | est 1703 | 1999–1999 | pop 86600 → 86600 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3546 | “AJYB vol. 100 (1999) table 'Communities with Jewish populations of 100 or more (estimated)', PA, PDF p.16; year = the table's stated estimate year. City figure as printed (rounded estimate)”
L137646: USA | Philadelphia | est 1703 | 2000–2000 | pop 86600 → 86600 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3562 | “AJYB vol. 101 (2000) table 'Communities with Jewish populations of 100 or more (estimated)', PA, PDF p.18; year = the table's stated estimate year. City figure as printed (rounded estimate)”
L137647: USA | Philadelphia | est 1703 | 2001–2001 | pop 86600 → 206000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3578 | “AJYB vol. 102 (2001) table 'Communities with Jewish populations of 100 or more (estimated)', PA, PDF p.21; year = the table's stated estimate year. City figure as printed (rounded estimate)”
```

**[CONFLICT]** Same town, same years, definitions flip: 137648 area 206,100 (2002-05) -> 137649 ramps to 66,800 by 2008 (136,450 in 2007) -> 137650 (2009) 66,800 -> 137651 (2010-11) 214,600. The 2009 point 66,800 is county/city while neighbours are 206,000-214,600 (3.2x), and 137650's comment attributes 214,600 to the 2019 study.

```text
L137649: USA | Philadelphia | est 1703 | 2006–2008 | pop 206100 → 66800 | medium | https://www.jewishdatabank.org/api/download/?studyId=700&mediaId=AJY-2006.pdf | “AJYB vol. 106 (2006) Table 3 'Communities with Jewish population of 100 or more' for 2006, Pennsylvania section, PDF p.50; printed row 'Philadelphia Total (1997)' is the table's own group-total line for this community (its sub-areas are listed separately and not used here); date of confirmation or latest study printed in the table: 2006; footnote mark(s) as …”
L137650: USA | Philadelphia | est 1703 | 2009–2009 | pop 66800 → 214600 | high | https://jewishphilly.org/wp-content/uploads/2023/07/Final-Report-030220-1.pdf | “Jewish persons in Philadelphia County (coterminous with the City of Philadelphia) per the 2019 study comparison table; 2009 method undercounted central cities; 2009 households 44500”
L137651: USA | Philadelphia | est 1703 | 2010–2011 | pop 214600 → 214600 | medium | https://www.jewishdatabank.org/api/download/?studyId=613&mediaId=Jewish_Population_in_the_United_States_2010.p… | “Sheskin-Dashefsky "Jewish Population in the United States, 2010" (North American Jewish Data Bank; the AJYB no longer carried the series) Table 3 'Communities with Jewish population of 100 or more' for 2010, Pennsylvania section, PDF p.65; printed row 'Philadelphia Total (2009)' is the table's own group-total line for this community (its sub-areas are listed…”
```

**[COMMENT_MISMATCH]** 137653 comment gives the 2019 study: five-county region 351,200 Jews, county 'inclusive definition', yet the row runs 162,100 -> 64,092 and 137654 (2025-26) holds 64,092 described as the whole Philadelphia-Camden-Wilmington metro. 64,092 cannot be the metro (351,200 in the same comment); the map shows 122,900 in 2021 and 64,092 in 2024-2026.

```text
L137653: USA | Philadelphia | est 1703 | 2019–2024 | pop 162100 → 64092 | medium | https://jewishphilly.org/wp-content/uploads/2023/07/Final-Report-030220-1.pdf | “Estimated Jewish persons in Philadelphia County (coterminous with the City) in the 2019 study (inclusive definition; 97600 Jewish households; 201800 people in Jewish households); five-county region 351200 Jews; increase partly due to broader definition and method”
L137654: USA | Philadelphia | est 1701 | 2025–2026 | pop 64092 → — | medium | https://appliedgeographic.com/2025/12/11/mapping-jewish-population-clusters-across-north-america/ | “Estimated total Jewish population for the Philadelphia-Camden-Wilmington PA-NJ-DE-MD Metro Area.”
```

**[TEMPLATE]** 1740-1764 row 200 -> 100 with blank probability and only the comment 'Fourth oldest Jewish community in USA'; no source for 200 Jews in 1740 (the other rows say several families in 1740, about 100 persons in 1765). The ramp 200 -> 100 shows a decline that is not documented.

```text
L137617: USA | Philadelphia | est 1703 | 1740–1764 | pop 200 → 100 | prob — | https://www.jewishvirtuallibrary.org/philadelphia-pennsylvania | “Fourth oldest Jewish community in USA”
```

##### USA/San Diego

**[CHAIN_SUBSET]** 139988's pop_start 375 is '75 Holocaust-survivor families x5' (a refugee subset resettled 1948-53) and it is chained into 139987 as pop_end. The map ramps 3,000 (1937) down to 375 in 1947 (1,688 in 1942) and starts 1948 at 375 (3,188 in 1950) instead of the 3,000-6,000 of the city.

```text
L139987: USA | San Diego | est 1850 | 1937–1947 | pop 3000 → 375 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=2065&ownerType=0&ownerId=2662 | “AJYB vol 50 (1949) Table 2 Communities of over 100 Jewish population, "1937 Estimate" column; PDF page 36.”
L139988: USA | San Diego | est 1850 | 1948–1952 | pop 375 → 6000 | high | http://sandiegohistory.org/wp-content/uploads/2018/05/WebVersion-Vol63-Summer2017-No2-77-87.pdf | “Estimate based on families. Between 1948 and 1953, some 75 Jewish families, all Holocaust survivors, resettled in San Diego”
```

##### USA/San Francisco

**[CHAIN_SUBSET]** 140019's pop_end is 12, the 'home for aged and infirm Israelites opened to 12 residents' of row 140020 (1891), not a city count. The map ramps 16,000 (1877) down to 12 by 1890 (about 8,620 in 1883) and then ramps 12 -> 17,000 over 1891-1904 (7,853 in 1897), although the JE says 16,000 (1877) and 17,000 (1905).

```text
L140019: USA | San Francisco | est 1849 | 1877–1890 | pop 16000 → 12 | high | https://www.jewishencyclopedia.com/articles/14589-united-states | “JE "United States" table "1877.1905.", state California: "San Francisco (1849)16,00017,000" -- The two columns (1877, 1905) are printed run together in the source; split at the only valid number boundary. 1877 = Hackenburg estimate; 1905 = JE estimate; year in parentheses is the date of first Jewish settlement as far as ascertained (JE).”
L140020: USA | San Francisco | est 1835 | 1891–1904 | pop 12 → 17000 | high | http://sfcjl.org/about-history.htm | “The Home for aged and infirm Israelites opened to 12 residents”
```

**[CONFLICT]** AJYB 1984 city figure 80,000 (1983) is ramped to 196,000 in 1985 (138,000 in 1984), 1986 shows 196,000 (user-supplied, a Bay Area-type figure) and 1987 drops to 45,500. A 4x swing in four years from mixing city (80,000/45,500) and region (196,000) figures.

```text
L140051: USA | San Francisco | est 1877 | 1983–1985 | pop 80000 → 196000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3295 | “AJYB vol. 84 (1984) table 'Communities with Jewish populations of 100 or more (estimated)', CA, PDF p.6; year = the table's stated estimate year; city's own figure, rounded estimate as printed”
L140052: USA | San Francisco | est 1877 | 1986–1986 | pop 196000 → 45500 | medium | User-supplied historical Jewish population compilation (Google Sheets, no public source cited per figure) | “User-supplied historical population figure.”
```

**[INFLATED_DEFINITION]** From 2001 the series switches from the city (49,500 in 2000) to the 'San Francisco Bay Area' 210,000-228,000 (140064: printed row 'San Francisco Bay Area'; 140067: Federation area incl. Marin and the Peninsula), then ramps down to the 2017 city count of 61,000 (144,400 in 2014). City marker shows 4x more Jews in 2002-2011 than the city figures before and after.

```text
L140063: USA | San Francisco | est 1877 | 2001–2001 | pop 49500 → 210000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/RecordView/Index/3578 | “AJYB vol. 102 (2001) table 'Communities with Jewish populations of 100 or more (estimated)', CA, PDF p.14; year = the table's stated estimate year. City figure as printed (rounded estimate)”
L140064: USA | San Francisco | est 1835 | 2002–2003 | pop 210000 → 228000 | medium | https://www.jewishdatabank.org/api/download/?studyId=697&mediaId=bjdb%5c2002_Jewish_Population_in_the_United_S… | “AJYB vol. 103 (2003) appendix Table ('Communities with Jewish populations of 100 or more, 2001' header as printed; the report is titled 'Jewish Population in the United States, 2002'), California section, PDF p.11; printed row 'San Francisco Bay AreaN'; area/metro-region estimate (city plus suburbs as named by the table); footnote mark: N (table legend: * = …”
L140066: USA | San Francisco | est 1835 | 2006–2011 | pop 227800 → 227800 | medium | https://www.jewishdatabank.org/api/download/?studyId=700&mediaId=AJY-2006.pdf | “AJYB vol. 106 (2006) Table 3 'Communities with Jewish population of 100 or more' for 2006, California section, PDF p.31; printed row 'San Francisco Total (2004)' is the table's own group-total line for this community (its sub-areas are listed separately and not used here); date of confirmation or latest study printed in the table: 2004.”
L140067: USA | San Francisco | est 1835 | 2012–2016 | pop 227800 → 61000 | medium | https://www.jewishdatabank.org/content/upload/bjdb/611/Jewish_Population_in_the_United_States_2012.pdf | “Sheskin & Dashefsky, 'Jewish Population in the United States, 2012', Appendix A (communities with 100+ Jews), California section, printed entry 'San Francisco Subtotal (2004)'; Number of Jews = Jewish persons (excludes non-Jewish household members); scope: San Francisco Federation area: San Francisco, Marin, North and South Peninsula; primary community line …”
```

**[COMMENT_MISMATCH]** 140068 comment: City and County of San Francisco = 17% of 350,000 Bay Area Jews (about 59,500; ps 61,000), but pop_end is 170,400, so the map rises to 170,400 in 2018 before dropping to 61,000 in 2019. 170,400 is not supported by the comment.

```text
L140068: USA | San Francisco | est 1835 | 2017–2018 | pop 61000 → 170400 | high | https://jewishfed.org/wp-content/uploads/An_Integrative_Report_from_the_Bay_Area_Jewish_Community_Study.pdf | “Jewish population in the City and County of San Francisco (17% of the total 350,000 Bay Area Jewish population)”
L140069: USA | San Francisco | est 1835 | 2019–2026 | pop 61000 → 61000 | estimate | Estimate: carried forward from 2017, not a source | “Estimate, not a measurement: the last sourced count for this town is 61,000 in 2017 (https://jewishfed.org/wp-content/uploads/An_Integrative_Report_from_the_Bay_Area_Jewish_Community_Study.pdf); no newer count was found, so the same number is carried forward to 2026.”
```

##### USA/Seattle

**[CHAIN_SUBSET]** 140655 starts at 63,400 (the 2014 study of the whole region) in 1875 and ramps to 70 (a group of 70 Jewish women founding a benevolent society, 140656); 140656 ramps 70 -> 3 (1900 census 'recorded 3 Jews' among Turkey-born Sephardic settlers, 140657), and 140657 ramps 3 -> 4,000. The map shows about 43,600 Jews in 1880, 70 in 1891, 3 in 1899-1900 and 2,000 in 1903, none of which is the city's Jewish population (AJYB 4,000 in 1907).

```text
L140655: USA | Seattle | est 1875 | 1875–1891 | pop 63400 → 70 | high | https://wwrn.org/articles/43896/ | “A newly released study pegs the Jewish population of the region at 63,400.”
L140656: USA | Seattle | est 1875 | 1892–1899 | pop 70 → 3 | high | https://www.jfsseattle.org/who-we-are/our-history/ | “70 local Jewish women, headed by Esther Levy and Lizzie Cooper, laid the groundwork for today's Jewish Family Service (originally Ladies' Hebrew Benevolent Society).”
L140657: USA | Seattle | est 1875 | 1900–1906 | pop 3 → 4000 | high | https://jewishstudies.washington.edu/sephardic-studies/seattles-first-settlers-from-ottoman-empire/ | “The 1900 census recorded 3 Jews in the first wave of Turkey-born settlers in Seattle.”
```

##### USA/Tampa

**[CHAIN_SUBSET]** 142379 pop_start 4,400 is the membership of the Bryan Glazer Family JCC ('more than 4,400 members'), and 142378 takes it as pop_end: the map falls 23,000 (2012) -> 13,700 (2014) -> 4,400 (2017) and then ramps to 67,700 in 2018, although the community study counts were 20,000-23,000 and the AJPP 67,700.

```text
L142378: USA | Tampa | est 1844 | 2012–2016 | pop 23000 → 4400 | medium | https://www.jewishdatabank.org/content/upload/bjdb/611/Jewish_Population_in_the_United_States_2012.pdf | “Sheskin & Dashefsky, 'Jewish Population in the United States, 2012', Appendix A (communities with 100+ Jews), Florida section, printed entry 'Tampa (Hillsborough County) (2010) *'; Number of Jews = Jewish persons (excludes non-Jewish household members); scope: as printed in the entry name (area or county named in parentheses is the scope; city plus any named…”
L142379: USA | Tampa | est 1844 | 2017–2018 | pop 4400 → 67700 | high | https://lakerlutznews.com/exploring-tampas-jewish-history/ | “The Bryan Glazer Family JCC had more than 4,400 members.”
```

**[CHAIN_SUBSET]** 142350 pop_start 325 = 65 families of one congregation (Shaarai Zedek) x5; 142349 (AJYB 1937 1,730) takes it as pop_end, so the map falls to 325 in 1938-39 and then ramps to 1,800 by 1947 (1,062 in 1943), against AJYB 1,730 (1937) and 1,800-2,200 (1948).

```text
L142349: USA | Tampa | est 1844 | 1937–1938 | pop 1730 → 325 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=2065&ownerType=0&ownerId=2662 | “AJYB vol 50 (1949) Table 2 Communities of over 100 Jewish population, "1937 Estimate" column; PDF page 38.”
L142350: USA | Tampa | est 1844 | 1939–1947 | pop 325 → 1800 | high | https://lakerlutznews.com/exploring-tampas-jewish-history/ | “Estimate based on families. Congregation Shaarai Zedek had 65 families, 39 of which had someone serving in World War II.”
```

**[COMMENT_MISMATCH]** Row 142347's comment (ISJL) says the Jewish population grew from 720 in 1886 to 1,600 in 1900, but the 1886-1889 rows show 2 -> 100 (142344: two Jewish public officials; 142345: founding of Maas Brothers store) and 142346 starts 1890 at 100 (20 families x5). The map shows 2 Jews in 1886 against the cited 720.

```text
L142344: USA | Tampa | est 1844 | 1871–1885 | pop 2 → 2 | high | https://lakerlutznews.com/exploring-tampas-jewish-history/ | “Jews entered public service in Hillsborough County, beginning with Charles Slager (appointed postmaster) and Isidore Blumenthal.”
L142345: USA | Tampa | est 1844 | 1886–1889 | pop 2 → 100 | high | https://lakerlutznews.com/exploring-tampas-jewish-history/ | “Abe and Isaac Maas founded the Maas Brothers department store.”
L142346: USA | Tampa | est 1844 | 1890–1899 | pop 100 → 1600 | high | https://lakerlutznews.com/exploring-tampas-jewish-history/ | “Estimate based on families. There were more than 20 Jewish families living in Tampa.”
L142347: USA | Tampa | est 1844 | 1900–1926 | pop 1600 → 2000 | high | https://www.isjl.org/florida-tampa-encyclopedia.html | “"Between 1886 and 1900, the Jewish population grew over twofold, from 720 to 1,600."”
```

##### USA/Washington

**[CHAIN_SUBSET]** DC-proper and metro-region numbers are chained through ramps. 143411 ramps 35,000 (DC, 1947) -> 81,000 (the 'greater D.C. area' per the comment of 143412); 143413 (1956-1975) ramps 81,000 (metro) -> 32,500 (DC proper), showing 45,263 in 1970 while 143419 says 110,000 in the greater area; 143420 ramps 32,500 -> 215,000 (metro) over 1976-2002 (130,800 in 1990); 143432 (Greater Washington 295,500 in 2017) ramps to 50,500 (DC proper, 143434), showing 173,000 in 2018. The map thus shows a false decline 1956-1975 and a false 5x growth 1976-2002 for what is two different geographies.

```text
L143411: USA | Washington | est 1795 | 1953–1955 | pop 35000 → 81000 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=2157&ownerType=0&ownerId=2754 | “AJYB vol 55 (1954) Table 1 Communities with Jewish populations of 100 or more (estimated); estimates for 1953 except footnoted entries (skipped); state heading District Of Columbia; PDF page 7.”
L143413: USA | Washington | est 1795 | 1956–1975 | pop 81000 → 32500 | medium | User-supplied historical Jewish population compilation (Google Sheets, no public source cited per figure) | “User-supplied historical population figure.”
L143420: USA | Washington | est 1795 | 1976–2002 | pop 32500 → 215000 | medium | https://www.policyarchive.org/download/10307 | “Estimated Jewish population of the District of Columbia.”
L143432: USA | Washington | est 1795 | 2017–2019 | pop 295500 → 50500 | high | https://www.brandeis.edu/ssri/communitystudies/dc.html | “2017 Greater Washington Jewish Community Demographic Study (Brandeis CMJS/SSRI): 295,500 Jews (244,500 adults, 51,000 children) in 155,200 Jewish households; scope: Washington metro (DC, suburban Maryland, Northern Virginia); Jewish persons, not persons in Jewish households; total taken from the executive-summary table as quoted in a search summary (page not…”
L143434: USA | Washington | est 1795 | 2020–2021 | pop 50500 → — | medium | https://www.jewishdatabank.org/api/download/?studyId=1166&mediaId=bjdb%5C2020_American_Jewish_Population_Estim… | “Estimated total Jewish population in Washington, DC proper.”
```

##### USA/West Palm Beach

**[INFLATED_DEFINITION]** 143862 ramps AJYB 1955 (2,300) to 73,441 over 1954-2024 (70 years): 28,700 in 1980 and 49,050 in 2000. 73,441 is the appliedgeographic figure for the whole Miami-Fort Lauderdale-West Palm Beach metro (143868), not the city, and the ramp invents a population with no sourced city point after 1955 (the rows 143863-143867 give Federation-area counts only).

```text
L143862: USA | West Palm Beach | est 1892 | 1954–2024 | pop 2300 → 73441 | medium | https://ajcarchives.org/Portal/Yearbooks/en-US/DownloadImageFile.ashx?objectId=2178&ownerType=0&ownerId=2775 | “AJYB vol 56 (1955) Table 1 Communities with Jewish populations of 100 or more (estimated), Jewish Population of the United States 1954; state heading Florida; PDF page 7.”
L143868: USA | West Palm Beach | est 1892 | 2025–2026 | pop — → — | high | https://appliedgeographic.com/2025/12/11/mapping-jewish-population-clusters-across-north-america/ | “The Miami-Fort Lauderdale-West Palm Beach area is home to 73,441 Jewish residents, accounting for 1.13% of the region's population.”
```

#### Israel, Middle East and North Africa, Asia, Africa, Latin America, Oceania — 20 findings in 9 towns

##### Algeria/Algiers

**[EXPULSION_RAMP]** Row 157 ramps 30,000 (1955) -> 2,500 (1962, pop_end borrowed from the next row) linearly over 1955-1962, showing ~18,200 in 1958 and ~10,400 in 1960. The Jews of Algiers (and Algeria) left almost entirely in the 1961-62 exodus around independence, so the map shows a decline that began years earlier and ~10,000 in 1960 when the community was still near its peak of ~30,000.

```text
L157: Algeria | Algiers | est 1200 | 1955–1962 | pop 30000 → 2500 | high | https://www.jewishvirtuallibrary.org/jsource/judaica/ejud_0002_0001_0_00793.html | “EJ Algeria table 'Jewish population by town' (printed names: Algiers)”
L159: Algeria | Algiers | est 1200 | 1963–1967 | pop 2500 → 400 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/algiers | “Encyclopaedia Judaica (via encyclopedia.com) Algiers entry: only 2,500 Jews remained in Algiers by 1963”
```

##### Argentina/Buenos Aires

**[TEMPLATE]** Hand-typed placeholder rows ('Interwar period - community grows', 'Post-war period - Holocaust survivors arrive', '1960s-70s - peak population', round numbers, low probability) contradict the sourced rows: 485 gives 5,000-15,000 for 1920-40 (7,500 in 1925, 13,000 in 1936) versus sourced 65,000 (1917) and 120,000 (1936); 496 gives 15,000-50,000 for 1940-60 (32,500 in 1950) while the sourced rows are 120,000 (1936) and 250,000 (1960); 513 gives 50,000-100,000 for 1960-80 vs 250,000->~194,000 in row 514; 524 gives 80,000-100,000 for 2000-23 vs 165,000. Because the sourced 1917 and 1936 rows are single-year, the map shows 65,000 (1917) collapsing to ~5,000-8,000 in the 1920s and only 15,000-50,000 for 1937-1959: a false collapse and a 1937-59 gap that hides the real ~120,000-250,000.

```text
L485: Argentina | Buenos Aires | est 1860 | 1920–1940 | pop 5000 → 15000 | low | https://www.jewishvirtuallibrary.org/buenos-aires-argentina-jewish-history-tour | “Interwar period - community grows”
L496: Argentina | Buenos Aires | est 1860 | 1940–1960 | pop 15000 → 50000 | low | https://www.jewishvirtuallibrary.org/buenos-aires-argentina-jewish-history-tour | “Post-war period - Holocaust survivors arrive”
L513: Argentina | Buenos Aires | est 1860 | 1960–1980 | pop 50000 → 100000 | low | https://www.jewishvirtuallibrary.org/buenos-aires-argentina-jewish-history-tour | “1960s-70s - peak population”
L521: Argentina | Buenos Aires | est 1860 | 1980–2000 | pop 100000 → 80000 | low | https://www.jewishvirtuallibrary.org/buenos-aires-argentina-jewish-history-tour | “Late 20th century - economic crisis, some emigration”
L524: Argentina | Buenos Aires | est 1860 | 2000–2023 | pop 80000 → 100000 | low | https://www.jewishvirtuallibrary.org/buenos-aires-argentina-jewish-history-tour | “21st century - largest Jewish community in Latin America”
L471: Argentina | Buenos Aires | est 1860 | 1860–1900 | pop 100 → 1000 | low | https://www.jewishvirtuallibrary.org/buenos-aires-argentina-jewish-history-tour | “Early settlement - Jews arrive in mid-19th century”
L477: Argentina | Buenos Aires | est 1860 | 1900–1920 | pop 1000 → 5000 | low | https://www.jewishvirtuallibrary.org/buenos-aires-argentina-jewish-history-tour | “Early 20th century - immigration from Eastern Europe”
```

**[INFLATED_DEFINITION]** Unreferenced 'user-supplied' series (no source per figure) for the whole Buenos Aires area: 250,000 in 1960 falling to 165,000 in 2006, then 527 ramps 165,000 -> 220,000 over 2006-2019 and 529 drops back to 165,000 for 2020-26 (carry-forward from 2006). The 220,000 figure for 2019 exceeds Argentina's whole core Jewish population (~170,000-180,000 per DellaPergola), so it must be a broad/Law-of-Return or metropolitan figure; the map shows a rise to ~220,000 and an abrupt 25% fall in 2020 that never happened. Same series also conflicts 2x+ with template rows (80,000-100,000 for 2000-23).

```text
L514: Argentina | Buenos Aires | est 1860 | 1960–2006 | pop 250000 → 165000 | medium | User-supplied historical Jewish population compilation (Google Sheets, no public source cited per figure) | “User-supplied historical population figure.”
L527: Argentina | Buenos Aires | est 1860 | 2006–2019 | pop 165000 → 220000 | medium | User-supplied historical Jewish population compilation (Google Sheets, no public source cited per figure) | “User-supplied historical population figure.”
L529: Argentina | Buenos Aires | est 1860 | 2020–2026 | pop 165000 → 165000 | estimate | Estimate: carried forward from 2006, not a source | “Estimate, not a measurement: the last sourced count for this town is 165,000 in 2006 (User-supplied historical Jewish population compilation (Google Sheets, no public source cited per figure)); no newer count was found, so the same number is carried forward to 2026.”
```

**[COMMENT_MISMATCH]** Row 474 gives 289 'Jewish immigrants (210 men and 79 women)' reported by the municipal census as the population for 1887-1894 (held 8 years). This is a count of immigrants (a subset), not of the city's Jews; it is currently hidden only because the template ramp 471 (100->1000, ~770 in 1890) is higher.

```text
L474: Argentina | Buenos Aires | est 1860 | 1887–1894 | pop 289 → — | high | https://www.policyarchive.org/download/15850 | “The municipal census of the City of Buenos Aires reported 289 Jewish immigrants (210 men and 79 women).”
```

##### Brazil/Recife

**[EXPULSION_RAMP]** Row 8554 takes the Dutch-period Jewish population (1,500 in 1645, community destroyed when Portugal reconquered Recife in 1654 and the Jews fled) and ramps it linearly to 50 in 1929. The map shows ~1,220 in 1700, ~710 in 1800 and ~200 in 1900 for a community that had disappeared after 1654 (the file's own rows: 'Jews fled Recife', Zur Israel reopened 2002). The 1,500 -> 50 interpolation should be a short span ending 1654-55.

```text
L8554: Brazil | Recife | est 1500 | 1645–1929 | pop 1500 → 50 | high | https://esefarad.com/recife-the-first-jewish-community-in-the-new-world/ | “"The Dutch Jewish population of Recife was about 1,500, roughly half of its European population"”
L8553: Brazil | Recife | est 1500 | 1645–1645 | pop — → — | high | https://www.worldjewishcongress.org/en/about/communities/BR | “"There were about 1,500 Jews in the region, with a well-organized community"”
```

**[HELD_FLAT]** Row 8544 takes '1,400 Jews at the height of the Dutch period (1630-1654)' and applies 1400->1500 to 1500-1644. Rows 8543/8546 in the same file say Jews arrived only 'some time after 1500' and 'prior to 1630 many if not all were New Christians'; the Dutch conquest was in 1630. The map shows ~1,400 Jews from 1500 (e.g. 1,440 in 1560) instead of near zero before 1630.

```text
L8544: Brazil | Recife | est 1500 | 1500–1644 | pop 1400 → 1500 | high | https://www.nytimes.com/library/world/americas/051900brazil-synagogue.html?eafs_enabled=false | “"Calculations indicate about 1,400 Jews at the height of the Dutch period (1630-1654)"”
```

**[CHAIN_SUBSET]** Blank-probability template row 8569 (1930-1990 50->759) borrows its pop_end from the 1991 census; it shows only 286 in 1950 and ~510 in 1969 while the neighbouring sourced rows give 1,358 (1950 census) and 1,600 (1969); the map therefore draws growth 1930-90 then 'recovery' and hides the real 1950-1969 level. Note 8574 (1,600 for 1969) is an exhibit estimate, and the census series mixes religion counts (1940/50/91/2000/2010) with an estimate.

```text
L8569: Brazil | Recife | est 1500 | 1930–1990 | pop 50 → 759 | prob — | https://www.jewishvirtuallibrary.org/recife-brazil | “Jewish community established in 1930s”
L8571: Brazil | Recife | est 1500 | 1950–1950 | pop 1358 → 1358 | high | https://biblioteca.ibge.gov.br/visualizacao/periodicos/67/cd_1950_v1_br.pdf | “Brazilian census of 1 Jul 1950: population present declaring the Israelita (Jewish) religion, municipality of Recife: 727 men + 631 women = 1358 (count by religion, not ethnicity). IBGE, Censo Demografico 1950, Estados Unidos do Brasil volume, table 60 'Municipio de Recife' (religion block, Israelitas, totals), PDF p. 252.”
L8574: Brazil | Recife | est 1500 | 1969–1969 | pop 1600 → 1600 | high | https://museujudaicosp.org.br/wp-content/uploads/2022/12/MUJ_Conteudo_Judeus-no-Brasil.pdf | “Estimate for 1969 in the Museu Judaico de Sao Paulo exhibition text (PDF p. 13): Brazil's Jewish population was estimated at 140 thousand persons, of whom Recife (1.6 thousand) (the estimator is not named; medium confidence). Outside the 1940-1950 window; written because the map has no row within 2 years of 1969 for this city.”
L8576: Brazil | Recife | est 1500 | 1991–2009 | pop 759 → 1286 | medium | https://servicodados.ibge.gov.br/api/v3/agregados/137/periodos/1991/variaveis/93?localidades=N6[all]&classific… | “IBGE demographic census 1991, residents declaring Jewish religion ('Judaica ou Israelita'), table 137; municipality itself (Recife - PE); sample-based religion question.”
```

##### Egypt/Alexandria

**[WRONG_FACT]** Row 18745 puts the modern 'Today (undated) about 100 Jews reside in Alexandria' (World Jewish Congress) into -250..-101 as a ramp 100 -> 15,000. A present-day figure is applied to the Ptolemaic period, drawing 100 Jews in 250 BCE (hidden only by the higher 80,000 ramp 18744).

```text
L18745: Egypt | Alexandria | est -332 | -250–-101 | pop 100 → 15000 | high | https://www.worldjewishcongress.org/en/about/communities/EG | “'Today' (undated source context), about 100 Jews reside in Alexandria.”
```

**[EXPULSION_RAMP]** The largest diaspora community (200,000 at -63 per 18749/18750) is declined linearly to 25,000 by 99 CE (about 90,900 at 38 CE and ~56,300 at 70 CE) and then held 25,000-30,000 for 100-499 CE. History: the Diaspora Revolt of 115-117 CE destroyed the Alexandrian community almost entirely; the map shows a smooth century-long decline and a 25,000-30,000 community surviving after it.

```text
L18750: Egypt | Alexandria | est -332 | -63–99 | pop 200000 → 25000 | low | https://en.wikipedia.org/wiki/Historical_Jewish_population | “Early Roman / Herodian (-63 to 70): Greek and Roman city with the largest Jewish community of the diaspora; two of five quarters, esp. the fourth (Delta), Jewish (JVL; Josephus via Jewish Encyclopedia); council of 71 elders under Augustus; synagogues in every part; Philo leads delegation to Caligula 40 CE; 38 CE pogrom (synagogues defiled). Estimate: Theodor…”
L18749: Egypt | Alexandria | est -332 | -100–-64 | pop 15000 → 200000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during Roman period - about 35% of city population”
L18760: Egypt | Alexandria | est -332 | 100–299 | pop 25000 → 30000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during late Roman period”
```

**[RAMP_OVERRIDES_SOURCED]** Template row 18767 ('Jewish community during Ayyubid period', 12,000 -> 10,000 over 1100-1299) lies over Benjamin of Tudela's sourced 3,000 for c.1165: the ramp gives ~11,350 at 1165 (3.8x). 18772 ('Mamluk period', 1300-1480, 10,000 -> 300) then starts at 10,000 (3.3x the 1165 figure) and gives ~4,600 in 1400; 1488 (Obadiah) says ~125 and Meshullam 300.

```text
L18767: Egypt | Alexandria | est -332 | 1100–1299 | pop 12000 → 10000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during Ayyubid period”
L18768: Egypt | Alexandria | est -332 | 1165–1165 | pop 3000 → 3000 | low | https://www.gutenberg.org/cache/epub/14981/pg14981.txt | “Benjamin of Tudela, Sefer ha-Massa'ot (Itinerary), c.1165: traveller names the place "Alexandria"; Adler translation, text marker [p.107]. Traveller's words: 'There are about 3,000 Jews in Alexandria'. Identification: Alexandria. Year 1165 = c.1165 (Benjamin travelled c.1165-1173).”
L18772: Egypt | Alexandria | est -332 | 1300–1480 | pop 10000 → 300 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during Mamluk period”
```

**[TEMPLATE]** Round-number placeholder rows from a generic Wikipedia history page ('Jewish community during late Roman / Byzantine / early Islamic / Islamic / Fatimid period', 'early 20th century', 'interwar period') with no individual source. They disagree with sourced censuses: 18785 (1900-1919, 8,000 -> 12,000) is below the 1897 census (9,831-12,433) and, because the sourced 1917 row (24,858) is single-year, the map shows 24,858 in 1917 but only ~11,800 in 1918-19 (a false halving); 18788 gives 33,800 for 1927 vs census 24,829 (1.36x).

```text
L18760: Egypt | Alexandria | est -332 | 100–299 | pop 25000 → 30000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during late Roman period”
L18762: Egypt | Alexandria | est -332 | 300–499 | pop 30000 → 25000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during Byzantine period”
L18764: Egypt | Alexandria | est -332 | 500–699 | pop 25000 → 20000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during early Islamic period”
L18765: Egypt | Alexandria | est -332 | 700–899 | pop 20000 → 15000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during Islamic period”
L18766: Egypt | Alexandria | est -332 | 900–1099 | pop 15000 → 12000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during Fatimid period”
L18785: Egypt | Alexandria | est -332 | 1900–1919 | pop 8000 → 12000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during early 20th century”
L18788: Egypt | Alexandria | est -332 | 1920–1929 | pop 12000 → 40000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during interwar period”
```

**[EXPULSION_RAMP]** Template ramp 18798 (1960-1979, 5,000 -> 1,000) shows ~3,000 Jews in Alexandria in 1970 and 18800 (1980-99) ~550 in 1990, whereas after the 1956 and 1967 expulsions the whole of Egypt had only a few hundred Jews by 1970 and the file's own 2006 row counts 23. The gradual decline hides that the community was reduced to a few hundred within about a decade.

```text
L18798: Egypt | Alexandria | est -332 | 1960–1979 | pop 5000 → 1000 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during Nasser period”
L18800: Egypt | Alexandria | est -332 | 1980–1999 | pop 1000 → 100 | high | https://en.wikipedia.org/wiki/History_of_the_Jews_in_Alexandria | “Jewish community during late 20th century”
L18794: Egypt | Alexandria | est -332 | 1947–1959 | pop 21128 → 5000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/alexandria | “EJ Alexandria: 21,128 Jews in 1947 (incl. 243 Karaites)”
```

##### Iraq/Baghdad

**[RAMP_OVERRIDES_SOURCED]** Row 62949 ramps 40,000 (Benjamin of Tudela, c.1170, flagged by the file itself as an exaggeration) to 2,500 linearly over 1150-1793. At 1180 the map shows ~38,250 vs Petahiah's sourced 1,000 (row 62950, 38x); at 1604 it shows ~13,500 vs Teixeira's sourced ~1,250 (row 62951, 10.8x); at 1400 ~25,400 with no support. The medieval peak is held for 640 years instead of being a single-point claim.

```text
L62949: Iraq | Baghdad | est 762 | 1150–1793 | pop 40000 → 2500 | low | https://www.worldjewishcongress.org/en/legacy-of-jews-in-MENA/country/iraq | “Estimated population for the second half of the 12th century by Benjamin of Tudela; historians consider this figure an exaggeration. He noted 28 synagogues and 10 yeshivot. This figure is far larger than neighbouring rows for the same town, or is a medieval traveller's estimate.”
L62950: Iraq | Baghdad | est 762 | 1180–1180 | pop 1000 → 1000 | low | https://archive.org/download/in.ernet.dli.2015.529760/2015.529760.jewish-travellers_djvu.txt | “Petahiah of Regensburg, Sibbub ha-Olam, c.1180: traveller names the place "Baghdad"; Adler, Jewish Travellers (1930), p.68. Traveller's words: In the city of Baghdad there are a thousand Jews. Identification: Baghdad. Contrast Benjamin (c.1165) who gives about 40,000. Year 1180 = c.1180 (Petahiah travelled c.1175-1185).”
L62951: Iraq | Baghdad | est 762 | 1604–1604 | pop ~1250 → ~1250 | low | https://archive.org/download/travelsofpedrote09teix/travelsofpedrote09teix_djvu.txt | “Pedro Teixeira (Hakluyt Society ed. 1902, printed p. 65), who entered Baghdad on 4 October 1604 and stayed until 12 December: the city 'may contain over twenty thousand houses' and 'there may be two or three hundred houses of Jews, whereof ten or twelve profess to be remnants of the first captivity'; most Jews are very poor, live in their own ward and have a…”
```

**[GAP]** The Baghdad numeric series stops with the 1947 census row (77,416, a single-year row, 62997; it is the qada total incl. villages). Nothing covers 1948-2026 although the narrative rows document the 1950-51 exodus, 'Meir Tweig closed' (2003-08) and 'one of five remaining Jews' (2024). The largest Jewish city of the Middle East therefore vanishes from the map after 1947 instead of showing a collapse to a few thousand (1960s) and a handful (2000s+). Also 62989 (1940, 77,000, blank pop_end) is a 1940s estimate covering only the year 1940.

```text
L62997: Iraq | Baghdad | est 762 | 1947–1947 | pop 77416 → 77416 | medium | https://yvg.ybz.org.il/wp-content/uploads/2023/11/%D7%A2%D7%99%D7%A8%D7%90%D7%A7-%D7%93%D7%9E%D7%95%D7%92%D7%A… | “1947 Iraqi census, Jews by liwa and qada, table in Haim Saadon, 'Demography' (Yad Ben-Zvi, Jewish Communities in the East in the 19th and 20th Centuries: Iraq), printed p. 36-37. Figure is the qada (sub-district) total: the town plus the villages of its qada. Baghdad qada (Baghdad liwa): 77,416 Jews (39712 males + 37704 females). Baghdad qada = the city and …”
L62989: Iraq | Baghdad | est 762 | 1940–1940 | pop 77000 → — | medium | https://www.worldjewishcongress.org/en/legacy-of-jews-in-MENA/country/iraq | “Estimated Jewish population in the 1940s. Battawiyyin and Alwiyya emerged as new mixed suburbs.”
```

**[CHAIN_SUBSET]** 62956 (1824-27) is 7,500 (1,500 families x5) but ramps to 30,000, which is the next row's 'x5 families' figure (6,000 families x5). 62957 (1828-29) then holds 30,000 and ramps down to 6,000, which is the pop_end borrowed from 62958 (1830-44, 'between 6,000 and 10,000 persons'). So 30,000 (families x5) vs 6,000-10,000 persons for 1828-1830 is a 3-5x conflict, and the map draws a rise 7,500->30,000 in 3 years followed by a fall to 6,000 in 2 years.

```text
L62956: Iraq | Baghdad | est 762 | 1824–1827 | pop 7500 → 30000 | high | https://jewishvirtuallibrary.org/jsource/vjw/Iraq.html | “About 1,500 Jewish families x5. Estimate based on families”
L62957: Iraq | Baghdad | est 762 | 1828–1829 | pop 30000 → 6000 | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/baghdad | “Encyclopaedia Judaica (via encyclopedia.com) Baghdad entry: d'Beth Hillel found 6,000 Jewish families (x5)”
L62958: Iraq | Baghdad | est 762 | 1830–1844 | pop 6000 → 16000 | medium | https://www.worldjewishcongress.org/en/legacy-of-jews-in-MENA/country/iraq | “Estimated Jewish population was between 6,000 and 10,000.”
```

**[CONFLICT]** 62966 gives ~25,000 for 1889 (JVL) but the next row 62967 (1890-1903) starts at 52,500 (Cuinet, taken from a vilayet total of 53,800), more than 2x the previous year, and above AIU 1904 (40,000) and the British consul 35,000-50,000 in the 1910s. The 1890 jump (25,000 -> 52,500) followed by a decline to 40,000 by 1903 is not a real trend; one of the figures uses a wider area.

```text
L62966: Iraq | Baghdad | est 762 | 1889–1889 | pop 25000 → 52500 | medium | https://jewishvirtuallibrary.org/jsource/vjw/Iraq.html | “Estimated at about 25,000 among a population of 100,000 Muslims”
L62967: Iraq | Baghdad | est 762 | 1890–1903 | pop 52500 → 40000 | high | https://www.jewishencyclopedia.com/articles/2348-bagdad | “Cuinet: 53,800 Jews in the Baghdad vilayet, of whom 52,500 in Baghdad itself”
```

##### Iraq/Firuz Shabur

**[HELD_FLAT]** Row 63123 holds the chroniclers' legendary '90,000 Jews said to have dwelt in the city during its capture by Ali' (656) and ramps it to 3,000 (Benjamin's figure, 1165) over 508 years. The map shows ~48,000 in 900 and ~25,000 in 1050 against 3,000 in the only real count, i.e. a 16x overstatement. Row 63120 itself says the city was destroyed/burned in 363, so a 90,000 legend is not a population at 656.

```text
L63123: Iraq | Firuz Shabur | est 363 | 656–1164 | pop 90000 → 3000 | high | https://en-academic.com/dic.nsf/enwiki/1074530 | “Jewish chroniclers mention that 90,000 Jews are said to have dwelt in the city during its capture by Ali.”
L63124: Iraq | Firuz Shabur | est 363 | 1165–1165 | pop 3000 → 3000 | low | https://www.gutenberg.org/cache/epub/14981/pg14981.txt | “Benjamin of Tudela, Sefer ha-Massa'ot (Itinerary), c.1165: traveller names the place "El-Anbar"; Adler translation, text marker [p.53]. Traveller's words: 'Here reside 3,000 Jews' (repeated at p.69 'About 3,000 Jews dwell there'). Identification: Anbar (Pumbedita, near Fallujah) The identification of this place is uncertain. Year 1165 = c.1165 (Benjamin trav…”
L63120: Iraq | Firuz Shabur | est 363 | 363–363 | pop — → — | high | https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/babylonia | https://en.wikip… | “Event: Piruz Shapur (near Pumbedita/Anbar) 'with its large Jewish population' was destroyed in Julian's invasion of 363 CE (Encyclopaedia Judaica). Wikipedia's Anbar article says the town was burned in 363 and had sizeable Arab and Jewish populations.”
```

##### Israel/Modi'in-Makkabbim-Re'ut

**[OTHER]** A separate marker (35.0076,31.9077) holds a single row 2008: 69,300 for the municipality 'Modi'in-Makkabbim-Re'ut', i.e. the same city as the 'Israel|Modi'in' pin (35.0094,31.8961, 67,102-85,403 for 2007-2013, city_hebrew already 'מודיעין-מכבים-רעות'). The city is duplicated by two pins ~1.3 km apart.

```text
L71571: Israel | Modi'in-Makkabbim-Re'ut | est  | 2008–2008 | pop 69300 → — | medium | https://www.citypopulation.de/en/israel/admin/hamerkaz/1200__modiin_makkabbim_reut/ | “Total census population of the locality; this table does not separate Jews, so the figure is total residents of a locality that is almost entirely Jewish (CBS type: city/local council; Arab share in 2021 0.0%, so total may slightly overstate Jews; 2021 breakdown: Jews 94927, Arabs 38, other 2132). Figure is for the municipality/council as a whole.”
```

##### Israel/Tel Aviv

**[RAMP_OVERRIDES_SOURCED]** Row 74641 is a founding 'presence marker, 20 by convention' for 1909 but its pop_end is borrowed from the 1922 census (15,065) so it ramps 20 -> 15,065 linearly over 1909-1922. At 1915 it shows ~6,970 versus the sourced 1915 census of 2,679 (row 74643, 2.6x); at 1914 ~5,800 vs the 3,600 residents quoted in the file for 1914, and it hides the WWI expulsion (1917-1918) altogether.

```text
L74641: Israel | Tel Aviv | est 1902 | 1909–1922 | pop 20 → 15065 | high | https://www.cbs.gov.il/he/publications/DocLib/2019/ishuvim/bycode2024.xlsx | “Founded 1909 (Israel CBS); presence marker, population 20 by convention.”
L74643: Israel | Tel Aviv | est 1902 | 1915–1915 | pop 2679 → 2679 | medium | https://en.wikipedia.org/wiki/Tel_Aviv | Shpak-Lissak, R., מתי ואיך חוסל הרוב היהודי בארץ ישראל (Carmel), e-re… | “A census of Tel Aviv conducted in 1915 recorded a population of 2,679 (Wikipedia, Tel Aviv; growth halted during WWI and the residents were expelled by the Ottomans in 1917). The book gives 1,687 residents per a census of 1916; online figure used, disagreement listed in the conflicts file. The founding (1909) is already in the map.”
```

##### Morocco/Casablanca

**[RAMP_OVERRIDES_SOURCED]** Row 84362 ramps 19,490 (1926 census) to 38,806 (1936 census) over 1926-1935; at 1931 it shows ~30,200 versus the Residency's sourced 19,960 for 1931 (row 84365), i.e. 1.5x, so the sourced 1931 point is hidden and the map shows a smooth ramp instead of a stall followed by a jump.

```text
L84362: Morocco | Casablanca | est 1873 | 1926–1935 | pop 19490 → 38806 | high | https://www.jta.org/archive/algeria-has-100000-jews-paix-et-droit-organ-of-alliance-israelite-reports | “JTA, 8 May 1927 (from Paix et Droit, AIU organ): French Zone census of March 1926, native Jews. Town figure in the list of principal Jewish centres.”
L84365: Morocco | Casablanca | est 1873 | 1931–1931 | pop 19960 → 19960 | high | https://www.hesperis-tamuda.com/Downloads/2020-2029/2023/Fascicule-1/11.pdf | “Residency 'Bulletin de renseignements sur la colonie juive du Maroc et sur le mouvement sioniste', 31 Jan 1948 (ed. L. M. Nacik, Hespéris-Tamuda 58(1), 2023), p. 281-282, table 'Population juive des principales villes marocaines', column 1931: 19,960 Jews in Casablanca. The bulletin does not say whether French/foreign Jews are included (its national table co…”
```

### 4.3 Further patterns the reviewers reported (not covered by the detectors)

These recurred across several regions in the hand review. They are observations from sampled towns, so their total extent is unknown.

1. **Root cause of most chain errors.** The converter takes `pop_end` from the next row's `pop_start`. Wherever the next row is a victim, ghetto, deportee, school-roll, bank-member, congregation-membership or family-derived number, the previous row ramps toward it (Poland, Ukraine, Romania, UK and US series alike).
2. **Single-congregation or household counts in UK series** (JCR-UK listings): synagogue membership, often multiplied by 5, sits in the same series as censuses and Year Book estimates (Manchester 250 from 2009, Leeds 250 for 2006-2015, Glasgow 100-260 for 1938-2000, Brighton 300 in 1980).
3. **Metro versus city mixing** in US/Canadian towns: metro or county figures alternate with city-proper figures and are joined by ramps (Chicago, Philadelphia, Washington, Boston, San Francisco, Montreal, Denver, Minneapolis), giving false falls or rises of 3-8x. From 2019 the series switches to the AJPP 2019 top-40 metro model, which runs lower than local studies (Atlanta 119,800 to 75,300 over 2012-2018; San Diego 100,000 to 60,600).
4. **Suspect 2025 appliedgeographic figures** (LA 94,737, Philadelphia 64,092, Miami-Fort Lauderdale-West Palm Beach 73,441) leak into earlier rows as `pop_end`; other towns citing the same source (e.g. Wilmington, L144346) may be affected.
5. **Single-year rows** show only in their own year, so beside a wide ramp they make the map spike for one year and fall back 4-6x (Amsterdam 1674 and 1795, Rome 1656 and 1668); a single-year row with `pop_start` 0 or a tiny number draws a false zero (Izbica 1940 and 1943, Będzin 1940).
6. **Founding-marker ramps in Israel.** Each "Founded YYYY, population 20 by convention" row takes its `pop_end` from the first real count, so it ramps from 20 over decades (Tel Adashim 1923-1994 20 to 500; Adanim 1950-2002 20 to 409; Tel Aviv 1909-22 gives ~6,970 at 1915 against a sourced 2,679). Several kibbutzim and moshavim have a founding row and nothing until 2003.
7. **"No evidence" rows carrying numbers.** Rows whose comment says "No evidence of Jewish presence found" carry 0, 2 or 2000 instead of a blank (Aix-en-Provence 2007-2026).
8. **Held-flat modern estimates** across mass emigration (Dnipro 37,869, Moscow 100,000, Gomel 8,000, Skvyra 500 for 25-35 years; Cluj, Arad, Satu Mare 380 for decades) and Soviet-era series that stop at the last census (Kharkiv 1970, Kherson 1959, Rivne 1989).
9. **Regional totals as town values** (Bratslav: a four-province total; Kherson: province figures; Daugavpils: a regional census; Miechów, Częstochowa, Tarnów: county totals).
10. **Date errors.** Today's figures placed in the Middle Ages (Košice 800 at 1492-1523; Alexandria "about 100 Jews today" at -250..-101), century-only text turned into a hundred-year span (Gidle L90429 is a 19th-century description dated 1600-1699), and a misprint "27.254" read as 27,254 (Vawkavysk).
11. **Rows misfiled under another town** (Będzin L88029 and L88033 carry Sosnowiec comments) and **wrong coordinates** (Bălți ~150 km from the real Bălți).
12. **Garbled name columns.** Kielce `city_german` = "Philipp Ther" (a historian) and Bochnia = "Bezirk Bochnia"; Zurich = "Platzspitz"; Hamburg = "Reichsfestung Belgrad"; Frankfurt = "U60311"; Zagreb `city_other` = "Hotel Dubrovnik"; Stockholm `city_other` = "Stockholms Kulturfestival"; Madrid `city_other` = "bartolillos" (6 rows).

## 5. Towns that vanish from the map (no row covers the years)

The map draws a town only where a row with a positive number covers the year. Two kinds of gap were found.

### 5.1 Israeli cities whose series stops in 2008

| Town | last year with a number | peak count in the file |
|---|---:|---:|
| Israel / Beersheba | 2008 | 193,400 |
| Israel / Bat Yam | 2008 | 138,500 |
| Israel / Modi'in-Makkabbim-Re'ut | 2008 | 69,300 |
| Israel / Karmiel | 2008 | 44,200 |
| Israel / Kiryat Yam | 2008 | 39,200 |
| Israel / El'ad | 2008 | 33,900 |
| Israel / Acre | 2008 | 33,600 |
| Israel / Joppa | 1946 | 30,820 |
| Israel / Safed | 2008 | 29,600 |
| Israel / Yehud-Monosson | 2008 | 26,200 |
| Israel / Yoqne'am Illit | 2008 | 19,000 |
| Israel / Samaria | -723 | 15,000 |
| Israel / Jabesh Gilead | -1001 | 7,000 |
| Israel / Kefar Weradim | 2008 | 5,539 |
| Israel / Bat Hefer | 2008 | 5,200 |

Examples of the last numeric row of the series:

```text
L64873: Israel | Beersheba | est -1200 | 2008–2008 | pop 193400 → — | medium | https://www.citypopulation.de/en/israel/admin/hadarom/9000__beer_sheva/ | “Total census population of the locality; this table does not separate Jews, so the figure is total residents of a locality that is almost entirely Jewish (CBS type: city/local council; Arab share in 2…”
L64758: Israel | Bat Yam | est 1926 | 2008–2008 | pop 130300 → — | medium | https://www.citypopulation.de/en/israel/admin/tel_aviv/6200__bat_yam/ | “Total census population of the locality; this table does not separate Jews, so the figure is total residents of a locality that is almost entirely Jewish (CBS type: city/local council; Arab share in 2…”
L71571: Israel | Modi'in-Makkabbim-Re'ut | est  | 2008–2008 | pop 69300 → — | medium | https://www.citypopulation.de/en/israel/admin/hamerkaz/1200__modiin_makkabbim_reut/ | “Total census population of the locality; this table does not separate Jews, so the figure is total residents of a locality that is almost entirely Jewish (CBS type: city/local council; Arab share in 2…”
L69077: Israel | Karmiel | est 1950 | 2008–2008 | pop 44200 → — | medium | https://www.citypopulation.de/en/israel/admin/hazafon/1139__karmiel/ | “Total census population of the locality; this table does not separate Jews, so the figure is total residents of a locality that is almost entirely Jewish (CBS type: city/local council; Arab share in 2…”
```

### 5.2 Gaps inside a series (value drops to nothing between two years with 1,000+ Jews)

Checked at 5-year steps from 1800 to 2025. Years listed are the checkpoints with no row; *before/after* are the values at the neighbouring checkpoints.

| Town | missing checkpoint years | value before | value after |
|---|---|---:|---:|
| France / Paris | 1955 | 150,000 | 150,000 |
| USA / South-Central Westchester, NY | 2020 | 46,200 | 34,000 |
| USA / Boca Raton | 2000 | 43,353 | 59,700 |
| USA / Delray Beach | 2000 | 39,822 | 47,800 |
| USA / Camden County, NJ | 2020 | 34,600 | 30,000 |
| USA / North-Central and Northwestern Westchester, NY | 2020 | 25,300 | 31,000 |
| USA / Five Towns, NY | 2020 | 25,000 | 39,000 |
| United Kingdom / Leeds | 1950, 1960 | 25,000 | 20,000 |
| Ukraine / Uman | 1935 | 22,179 | 12,652 |
| USA / Lake Worth, FL | 2010 | 21,600 | 21,600 |
| USA / Sound Shore Communities, NY | 2020 | 18,900 | 17,000 |
| Mexico / Huixquilucan | 2015 | 18,877 | 16,479 |
| Poland / Wrocław | 1945 | 16,666 | 12,200 |
| Turkey / Izmir | 1940 | 16,000 | 14,567 |
| USA / Burlington County, NJ | 2020 | 15,900 | 17,000 |
| USA / North Palm Beach-Palm Beach Gardens-Jupiter, FL | 2010 | 13,950 | 13,950 |
| France / Strasbourg | 2020 | 12,000 | 20,000 |
| Hungary / Miskolc | 1925 | 11,300 | 10,862 |
| Iran / Isfahan | 1955 | 10,000 | 4,500 |
| USA / Dutchess County, NY | 2020 | 10,000 | 16,000 |
| USA / Wellington-Royal Palm Beach, FL | 2010 | 9,900 | 9,900 |
| Mexico / Mexico City | 1945, 1955, 1965, 1975, 1985, 1995, 2005, 2015 | 9,737 | 40,000 |
| USA / Naples, FL | 2015 | 8,000 | 8,800 |
| USA / New Square, NY | 2020 | 7,500 | 9,800 |
| USA / Sullivan County, NY | 2020 | 7,425 | 9,000 |
| Latvia / Rēzekne | 1915 | 6,478 | 4,148 |
| USA / Northern Gloucester County, NJ | 2020 | 6,200 | 3,700 |
| USA / Hunterdon County, NJ | 2020 | 6,000 | 5,500 |
| Ireland / Dublin | 1960, 1970 | 5,200 | 2,800 |
| USA / Ulster County, NY | 2020 | 5,000 | 12,000 |
| Ukraine / Mohyliv-Podilskyi | 1945 | 5,000 | 5,000 |
| USA / Kaser Village, NY | 2020 | 5,000 | 5,700 |
| United Kingdom / Cardiff | 1970 | 5,000 | 2,500 |
| Poland / Sokołów Podlaski | 1925 | 4,430 | 5,027 |
| Brazil / Porto Alegre | 1945 | 4,331 | 5,557 |
| Ukraine / Ananiv | 1905 | 3,527 | 4,810 |
| Ukraine / Zalishchyky | 1915 | 3,382 | 2,485 |
| Poland / Pułtusk | 1930 | 3,260 | 7,028 |
| Hungary / Pestszenterzsébet | 1915, 1925 | 2,953 | 4,522 |
| Hungary / Eger | 1915, 1925 | 2,674 | 2,128 |
| Moldova / Zguriţa | 1925 | 2,505 | 2,541 |
| Netherlands / The Hague | 1835, 1845, 1865 | 2,268 | 3,651 |
| Latvia / Bauska | 1855 | 2,266 | 2,693 |
| Ukraine / Zhuravno | 1885, 1895, 1905 | 2,197 | 1,338 |
| United Kingdom / Sheffield | 1950, 1960, 1970 | 2,175 | 1,198 |

(72 towns in all; the full list can be regenerated with the method in section 8.)

## 6. National totals far above the demographic estimates

Comparison of the latest count per town (2000-2024) summed by country, from `utils/data/dp_coverage_report.csv` (produced by the repository's own `utils/dp_coverage_report.py`), against DellaPergola's 2024 *core* Jewish population. A ratio far above 1 means that some towns carry enlarged-definition (origin / Law-of-Return) figures, stale figures, or figures of another kind. The largest contributors in this file's own series for 2020 are listed (a map sum over rows active in 2020).

| Country | map sum (latest counts) | DellaPergola core 2024 | ratio | largest contributors on the map in 2020 |
|---|---:|---:|---:|---|
| Ethiopia | 4,000 | 100 | 40.0 | Addis Ababa 1,130, Gondar 1,130 |
| Czech Republic | 31,569 | 3,500 | 9.0 | Teplice 500, Brno 300, Olomouc 154 |
| Moldova | 10,443 | 1,500 | 7.0 | Chișinău 10,000, Soroca 157, Orhei 100 |
| Ukraine | 200,048 | 32,000 | 6.2 | Kyiv 100,000, Odesa 48,100, Dnipro 37,869 |
| Azerbaijan | 37,580 | 6,700 | 5.6 | Baku 30,000, Quba 8,000, Qırmızı Qəsəbə 3,500 |
| Tunisia | 3,836 | 1,000 | 3.8 | Djerba 1,175, Zarzis 110, Ben Gardane 85 |
| Cuba | 1,500 | 500 | 3.0 | Havana 1,500 |
| Singapore | 2,500 | 900 | 2.8 | Singapore 2,500 |
| Colombia | 5,200 | 1,900 | 2.7 | Cali 3,000, Cartagena 110 |
| Uzbekistan | 6,700 | 2,500 | 2.7 | Tashkent 8,000, Bukhara 3,000, Kokand 4 |
| Iran | 23,667 | 9,000 | 2.6 | Qom 105, Kermanshah 100, Zanjan 52 |
| North Macedonia | 255 | 100 | 2.5 | Štip 5 |
| El Salvador | 250 | 100 | 2.5 | San Salvador 250 |
| Zimbabwe | 490 | 200 | 2.5 | Bulawayo 110 |
| Georgia | 2,512 | 1,100 | 2.3 | Kutaisi 200, Sukhumi 150, Oni 14 |
| Egypt | 223 | 100 | 2.2 | Cairo 200, Port Said 41, Alexandria 23 |
| Indonesia | 200 | 100 | 2.0 | Jakarta 200 |
| Greece | 7,880 | 4,000 | 2.0 | Athens 5,608, Thessaloniki 1,072, Larissa 350 |
| Hungary | 83,004 | 45,000 | 1.8 | Budapest 80,000, Szarvas 1,600, Debrecen 1,000 |
| Latvia | 6,823 | 4,100 | 1.7 | Riga 300, Daugavpils 114, Dobele 49 |
| Serbia | 2,416 | 1,500 | 1.6 | Belgrade 452, Subotica 220, Zemun 140 |
| Venezuela | 6,000 | 4,000 | 1.5 |  |

Examples traced to rows: Prague 31,000 (2001, `L17605`) and 28,272 on the map in 2000 against a Czech national core of ~3,500; Kyiv 100,000 held 2003-2026; Minsk 28,000 held 1997-2024 against a Belarus core of 6,000; Odesa ramped to 50,000 by 2021; Budapest 80,000 held 2004-2026 against a Hungary core of 46,000. See section 4.1 for the quoted rows.

## 7. Names and small points

* **`city_yid` filled with a Latin-script name** in 22 markers (all Italy/Spain): Ancona, Apulia, Bari, Naples, Oria, Otranto, Syracuse, Taranto, Ávila, Barcelona, Calahorra, Córdoba … The Yiddish name column is meant to hold Hebrew-script Yiddish.
* **`city_hebrew` identical to `city_yid`** in 142 markers (e.g. Baghlan, Jalalabad, Kabul, Kandahar, Kunduz): the Yiddish field looks copied from the Hebrew one rather than researched.
* **`city_other` holds one arbitrary transliteration** (found by language-link lookups) for 177 markers of Western/Central-European countries, e.g. Ústí nad Labem → Усти-над-Лабем; Bagnères-de-Bigorre → بآينير-دو-بيجور; Chartres → ሻርትረ; Lisieux → ሊዜ; Adorf → آدورف; Ainring → أينرينغ; Alsfeld → آلسفلد; Alsheim → Альсхайм. These are Arabic, Cyrillic or Amharic spellings of German or French towns; they are not wrong as such but not meaningful as 'other name', and the pipeline notes record that this lookup has produced unrelated articles before (Ganja, Tbilisi, Tokyo).
* **Probability and type**: 432 rows have a blank `probability` (most of them the placeholder rows of class `TEMPLATE_PLACEHOLDER`) and 684 rows have blank `type`/`symbol`.
* **Numeric rows with a blank comment**: 891 rows (jewishgen.org, alemannia-judaica.de, cdp.jewishgen.org mostly) carry a number but no explanation; and 218 carry a one-word comment such as 'approx.' or 'Population', which makes the figure impossible to check from the file.

## 8. Method details

* **Interpolation.** The map's value for a row at year *y* is `ps + (pe − ps) × (y − year_start) / max(year_end − year_start, 1)`; the town's value is the maximum over rows covering *y*. All "the map shows ~N" figures in this report use that formula.
* **Detectors** (all rows): year_start > year_end; non-numeric and negative populations; coordinates out of range or (0,0); `year_estab` later than the first row; population equal to the row year; year_end beyond 2026; wartime ramps (start ≤ 1941, end ≥ 1950, value drops by half or more); victim/deportee wording with a count ≥ 300 in 1939-46; ramps with a factor ≥ 10 between ends; ramps over sourced points (value ≥ 1.8× a sourced single-year count inside the span); expulsion/massacre wording with a long decline; overlapping rows ≥ 5× apart; template phrases / blank probability; area-derived wording; CBS cliffs; same-name markers with coordinates > 0.5° apart; checkpoint gaps; country sums against `dp_coverage_report.csv`; script checks on name columns; k-nearest-neighbour coordinate isolation (no errors found: all isolated points are genuinely remote places).
* **Coordinates.** No wrongly placed town was found by the isolation test; the only coordinate problems found are the same-name merges in class `HOMONYM_MERGED_PIN`. The dataset's `validate_kehilot.py` rules (numeric years, year_end ≥ year_start, valid coordinates, no markup) all pass.
* **Reproducibility.** The detectors are plain pandas scripts over `kehilot.csv`; the explanations in `DATA_ERRORS_FLAGGED_ROWS.csv` contain the computed numbers so each item can be checked by hand against the quoted line.
