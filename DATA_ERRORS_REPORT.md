# Possible errors and inaccuracies in `kehilot.csv`

Prepared 2026-10-26 from the file as committed on branch `claude/compassionate-ritchie-a34peb` (base commit `d13851c`): **159,089 rows, 21,939 town/country markers**. Line numbers `L12345` are the line numbers in `kehilot.csv` (the header is line 1). Every row quoted below is printed exactly as it stands in the file, so the "current data" in each item is the real current data.

## 1. What was done, and what this report is not

* **Automated scan of all rows.** Fourteen detectors ran over every row of the file (list in section 3). They flagged **2,656 rows**; each flagged row is listed, with a generated explanation and the numbers the map would show, in the companion file [`DATA_ERRORS_FLAGGED_ROWS.csv`](DATA_ERRORS_FLAGGED_ROWS.csv).
* **Hand review, town by town.** The largest and most-cited towns, and a random sample of mid-size and small towns, were read row by row (section 4): **38 towns by the author of this report** and **9 more towns with findings from six regional reviewers** (each reviewed 40 towns: the 28 largest by peak count plus 12 random towns with 8+ numeric rows of their region). Every row number a reviewer cited was re-checked against the file; findings that cited a row of another town were dropped.
* **What it is not.** The file has 21,939 markers, so a full row-by-row reading of every one was not possible; the hand-reviewed towns are a sample (roughly 47 towns, the ones with the most rows and the highest populations, which is where a wrong number does most damage). The detectors find *patterns*; the hand review shows that the patterns are real in the large majority of sampled cases, but some flagged rows will be correct (the explanation says what was assumed). Nothing here was checked against outside sources except where the item says "well-known history"; most findings are internal inconsistencies, visible from the file itself.
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

#### Poland — 0 findings in 0 towns

#### Ukraine, Belarus, Russia, Baltics, Caucasus and Central Asia — 0 findings in 0 towns

#### Germany, Austria, Czech lands, Slovakia, Hungary, Balkans, Greece, Turkey — 0 findings in 0 towns

#### France, Italy, Iberia, UK, Benelux, Switzerland, Scandinavia — 0 findings in 0 towns

#### USA and Canada — 0 findings in 0 towns

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
