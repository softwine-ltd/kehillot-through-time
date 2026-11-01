# Second Temple run: summary

This run collected Jewish presence and Jewish population data for 70 settlements in the Second Temple period
(586 BCE – 70 CE, with rows up to 74 CE for the end of the revolt). It ran on 2026-11-01, one subagent per
settlement, following `BRIEF.md` (adapted from the gap-run brief for ancient sources) and `historian_rules.txt`.
All 70 settlements are `done`; none failed. Unreadable sources are compiled in `SOURCES_TO_DOWNLOAD.md` (848
entries; read its "Read these first" list first).

**Totals:** 851 rows. 54 rows have a population figure, plus 17 rows with a documented 0. Only 13 settlements have
a figure; the other 57 have presence and event rows only (some with a 0). Each settlement has `city_data_*.csv`, `sources_*.txt` (every URL fetched,
OK/FAILED) and `unavailable_*.md`.

## What to expect from this data
- **Numbers are scarce, and that is real.** For this period nobody counted Jews town by town. The figures that do
  exist are modern scholarly estimates (built-up area × density, household counts) for Jerusalem, a few Galilean
  towns, Qumran, Rome and Antioch, plus Ezra-Nehemiah's returnee list for Jericho. Most Diaspora settlements are
  documented by inscriptions, papyri, Josephus, Philo or Acts, with no number. Those rows give presence and a date.
- **Ancient numbers are in Notes, not Population.** Josephus's and Philo's figures are death tolls, captive counts,
  armies, pilgrims, or round numbers scholars call exaggerated. Examples: 13,000 killed at Scythopolis, 20,000 at
  Caesarea, 50,000 at Seleucia, 1.1 million in Jerusalem, Philo's million Jews of Egypt. Every one is kept in the
  Notes of its row.
- **Sites in the Land of Israel have modern country names:** Israel for sites inside Israel, Palestine for the West
  Bank. Crimea (Kerch) is listed under Ukraine.

## Conventions applied
- **Years:** BCE years are negative; there is no year 0. A date given only as a century, phase or reign is entered
  as its midpoint, and the row's Notes say so. The midpoints used: 1st c. BCE = -50, 1st c. CE = 50, Hasmonean
  period = -90, Herodian = -20, Persian = -435, Early Roman = 4.
- **Population = Jews living in the settlement:**
  - A scholar's range is entered as its midpoint, with the range in Notes.
  - A total-population estimate is used only when the same source calls the place Jewish or predominantly Jewish
    (Sepphoris, Capernaum, Nazareth, Gamla, Yodfat, Bethlehem, Lod, Jerusalem).
  - For mixed cities (Tiberias, Caesarea, Alexandria, Antioch, Rome, Scythopolis), city totals stay in Notes.
- **Superseded, derived, outlier and undated figures go to Notes:**
  - an estimate its own author later revised (Strange 1981 for Nazareth, Jeremias's first Jerusalem figure);
  - a figure the agent computed itself (Alexandria, Magdala, Arbel);
  - a figure far outside every other estimate (Edersheim's 250,000 for Jerusalem, Laperrousaz's 1,428 for Qumran);
  - a figure with no date (the 1906 Jewish Encyclopedia's "at least 40,000" for Rome "during the empire").
- **Population 0** only where a source states that no Jews remained, for example after destruction and
  abandonment (Gamla 67, Masada 74, Jerusalem 70) or after a massacre the source calls total (Caesarea and Jaffa
  in 66, Seleucia c. 40).
- **Year Established = earliest documented Jewish (Judahite/Israelite/Judean) presence:**
  - For towns of biblical Judah and Israel it may be earlier than 586 BCE (Iron Age remains, lmlk jar handles,
    biblical town lists), and the first row gives the basis.
  - It is not:
    - political annexation alone (Hasmonean conquest of Dor or Caesarea);
    - a scholar's inference ("almost certain", "must have");
    - an ancient claim that scholars doubt (Josephus on Seleucid grants of citizenship);
    - a regional statement (exiles settled "near" Nippur);
    - a Samaritan inscription.
- **No row is dated before Year Established.** Battles, foreign garrisons and coin finds at a site before Jews are
  documented living there are mentioned in Notes, not given rows.
- **Samaritans are not counted as Jews.**
- **One source per row.** Primary texts are cited by the URL of the edition fetched (Perseus, Lexundria, Gutenberg,
  Wikisource, Sefaria), and the passage reference is given in Notes.

## Checks run
- Every CSV has the exact header and 9 columns on every row.
- Every Year of Data is a whole number in -586..74, and none is 0.
- No row predates Year Established, which is the same on every row of a file.
- Population is digits or ~N.
- Names and coordinates match `queue.csv`.
- Every population row's Source URL appears as OK in its sources log. (Some agents downloaded PDFs with curl and
  extracted them locally; the brief allows this.)
- I re-checked a sample of figures against their cited pages, and each was found:
  - Jericho's 345 (Encyclopaedia Judaica);
  - Antioch's 20,000–40,000 (Keener);
  - Bethlehem's 2,000–3,000 (AP report);
  - Capernaum's 1,500 (Grey);
  - Damascus's 10,000 (Jewish Encyclopedia);
  - Gamla's 3,000–4,000 (Wikipedia);
  - Rome's 40,000 and 60,000 (Livius, Schaff);
  - Sepphoris's 8,000–12,000 (Chancey);
  - Jerusalem's 30,000 (Reich abstract).

## Review fixes
Every edited row ends with a `[Review fix: ...]` note, so `grep "Review fix"` lists them. Numbers taken out of
Population stay in Notes.

**Population moved to Notes (10):**
- figures the agent computed itself: Alexandria 50 CE 150,000; Magdala 50 CE 2,340; Arbel -50 1,313 and 25 CE 1,898;
- estimates their authors later revised: Nazareth 15 CE 1,800 (Strange 1981); Jerusalem 30 CE 55,000 (Jeremias);
- outliers: Jerusalem 30 CE 250,000 (Edersheim, 19th century, non-academic page); Qumran -16 1,428 (Laperrousaz);
- undated: Rome "at least 40,000" (Jewish Encyclopedia, "during the empire").

**Population 0 removed (1):** Hebron -586. The source says the mound was abandoned, but Nehemiah 11:25 puts
Judahites at Kiriath-arba around 440 BCE.

**Year Established corrected (8), with the first remaining row tagged:**

| Site | Was | Now | Why |
|---|---|---|---|
| Antioch | -300 | -170 | The earlier date rested on Josephus's doubted claim of Jews from the city's foundation; -170 is 2 Macc 4. |
| Ephesus | -253 | -49 | The Antiochus II grant is doubted; -49 is the Lentulus decree. |
| Apamea | -205 | -62 | Settlement under Antiochus III is an inference; -62 is Cicero, Pro Flacco. |
| Tarsus | -171 | 5 | Ramsay's inference about Antiochus IV; the first direct evidence is Paul's birth. |
| Delos | -213 | -139 | -213 was a Samaritan inscription; -139 is 1 Macc 15:23. |
| Dor | -100 | 41 | -100 was the Hasmonean annexation; 41 is the synagogue incident. |
| Caesarea | -100 | -90 | -100 was the annexation; -90 is the first statement of a Jewish village. |
| Nippur | -597 | -503 | The 597 exiles were settled in the region; -503 is the first Judean in the city. |

Also: one Chorazin row re-dated from 4 to 50, because the Early Roman midpoint predated the town; Gezer's Year
Established basis note re-added to its first row.

**Rows deleted, because they record no Jewish residents of the place (31):**

| Site | Rows | Reason |
|---|---|---|
| Rome | -161 | Maccabean embassy (visitors). |
| Emmaus | -165, -160 ×2 | Seleucid army and garrison. |
| Leontopolis | -166 | A founding date that the cited scholar rejects. |
| Herodium | -40 | Herod's battle at the spot. |
| Bethsaida | -109, -100, -90 | Founding inference, conquest, coins. |
| Gush Halav | 4 ×2 | Pagan-population pottery; Jerome's late tradition. |
| Gezer | -435 | Yehud jar handles, an administrative tie. |
| Arbel | -160 | Seleucid camp at a disputed "Arbela". |
| Benghazi | 73 | Cyrenaica-wide; Berenice not named. |
| Miletus | -14 | Ionia in general. |
| Athens | 40 | Philo names Attica, not the city. |
| Antioch, Ephesus, Apamea | one each | The doubted or inferred founding claims above. |
| Tarsus | 4 | Ramsay's Seleucid-citizenship inference and the rows that repeat it. |
| Delos | 2 | Samaritan "Israelites" inscriptions. |
| Dor | 4 | Annexation, Pompey, Gabinius, temple dismantling. |
| Caesarea | 2 | Hasmonean annexation and capture. |

I also added a line to the brief after batch 1, so later agents knew not to write such rows.

## Still open (judgement calls left as they are)
**Weak sources behind numbers:**
- Bethlehem 2,500 (Pfann / Murphy-O'Connor via a 1994 AP report).
- Lod ~2,500 (an unsigned institute web page, no method).
- Capernaum 1,050 (Reed, via a devotional PDF).
- Damascus 10,000 (Jewish Encyclopedia 1906; probably derived from Josephus's massacre count).
- Several Jerusalem and Qumran estimates and Gamla's 3,500 rest on Wikipedia.

**Disputed zeros, each kept beside its counter-view:**
- Qumran -15: the gap after the 31 BCE earthquake; continuous occupation is argued too.
- Beth Zur: three zeros (-162, -100, 68); the sources disagree on when the town was abandoned.
- Ein Gedi -350: the source is a popular guide site.
- Jericho 68: Josephus says the Romans "found the city desolate".
- Caesarea 66: Josephus says "emptied"; Holum & Raban say "most" were killed.

**Year Established before 586 BCE from biblical or Iron Age evidence:** Jerusalem (-1000), Beit Shean (-950,
Solomon's district list), Gezer (-950, mostly Canaanite per Encyclopaedia Judaica), Maresha (-925) and Beth Zur
(-920) (Rehoboam's forts), Jericho (-860), Qumran, Hebron and Bethlehem (-700), Ein Gedi (-650). Sardis (-500)
rests on Sepharad in Obadiah, which scholars widely but not universally identify as Sardis.

**Disputed identifications:**
- Leontopolis = Tell el-Yahudiyeh.
- Bethsaida = et-Tell or el-Araj (rows say which).
- The Gospel Cana = Khirbet Qana.
- Emmaus Nicopolis = the Mishnah's Emmaus.
- Delos building GD 80 as a synagogue.
- The Gorgippia (Anapa) prayer-house inscription: Jewish or pagan.
- Anapa's 59/60 row, where "Judeans" is only a restoration.
- Susa's Esther-based rows.

**Thin sites (1–3 rows):** Dor 1, Salamis 1, Acre 2, Ostia 2, Oxyrhynchus 2, Benghazi 3, Miletus 3, Pergamon 3
(one piece of evidence), Athens 3.

**Not found anywhere reachable:** any estimate for Alexandria's Jews (only shares of the city, 20–40%). Also any
estimate for Tiberias that a source ties to a mostly Jewish city, and any count for the Diaspora cities.
`SOURCES_TO_DOWNLOAD.md` lists the works most likely to fill these gaps.

## Per settlement
"Numbers" counts rows with a Population value, including 0 (zeros in brackets). "Unavail." is the number of
unreadable sources listed for the site.

| Settlement | Rows | Numbers (0s) | Years | Year Est. | Unavail. | Population figures / notes for the reviewer |
|---|---|---|---|---|---|---|
| Jerusalem, Israel | 56 | 28 (2) | -586..70 | -1000 | 22 | Persian 200–13,500 (Lipschits' survey of estimates); Hasmonean 8,000–32,500; pre-70 20,000–110,000; 0 in 586 BCE and 70 CE. Several estimates via Wikipedia. |
| Alexandria, Egypt | 26 | 0 | -332..73 | -332 | 14 | Only shares (20–40%); Philo's million in Notes. |
| Sepphoris, Israel | 26 | 1 | -125..68 | -125 | 19 | 10,000 (Chancey 8,000–12,000). Schumer 2017 (2,000–4,300) unread. |
| Tiberias, Israel | 21 | 0 | 20..67 | 20 | 16 | City totals 4,500–40,000 in Notes (mixed city). |
| Rome, Italy | 25 | 5 | -139..71 | -139 | 13 | 25,000–60,000 (Hausrath, Livius, Eyland, Schaff); older/secondary sources. |
| Jericho, Palestine | 25 | 2 (1) | -586..69 | -860 | 18 | 345 returnees (-538); 0 in 68. Arensburg & Smith 1983 unread. |
| Magdala, Israel | 25 | 0 | -100..72 | -100 | 12 | Derived 2,340 moved to Notes. |
| Capernaum, Israel | 12 | 2 | -150..67 | -150 | 13 | 1,050 (Reed), 1,250 (Grey). |
| Gamla, Israel | 19 | 2 (1) | -112..67 | -112 | 16 | 3,500 (Weiss via Wikipedia); 0 in 67. |
| Masada, Israel | 22 | 1 (1) | -90..74 | -90 | 14 | 0 in 74; 967 defenders in Notes. |
| Qumran, Palestine | 29 | 11 (2) | -183..69 | -700 | 19 | 13–200 (de Vaux, Milik, Broshi, Patrich, Humbert, Magen & Peleg, Hirschfeld). |
| Caesarea, Israel | 18 | 1 (1) | -90..74 | -90 | 11 | 0 in 66 beside "most killed". |
| Antioch, Turkey | 18 | 2 | -170..71 | -170 | 13 | 45,000 (Kraeling via Eng), 30,000 (Keener). |
| Damascus, Syria | 7 | 1 | 33..66 | 33 | 8 | 10,000 (Jewish Encyclopedia 1906). |
| Elephantine, Egypt | 13 | 0 | -525..-350 | -525 | 12 | 123 donors in Notes; Porten 1968 unread. |
| Babylon, Iraq | 16 | 0 | -586..40 | -597 | 12 | Deportation counts are regional (Notes). |
| Nazareth, Israel | 14 | 3 | -125..67 | -125 | 14 | 300, 300, 480. |
| Yodfat, Israel | 14 | 1 | -100..68 | -100 | 10 | 1,750 (Aviam). |
| Hebron, Palestine | 13 | 0 | -586..69 | -700 | 11 | Some rows from an advocacy site and a news story. |
| Bethlehem, Palestine | 13 | 1 | -538..70 | -700 | 12 | 2,500 (via AP report). |
| Lod, Israel | 22 | 1 | -538..70 | -538 | 11 | ~2,500 (weak source). |
| Jaffa, Israel | 17 | 1 (1) | -163..67 | -163 | 12 | 0 in 66. |
| Yavne, Israel | 17 | 0 | -163..70 | -163 | 14 | Philo: "most populous… mostly Jews". |
| Emmaus, Israel | 12 | 1 (1) | -50..68 | -50 | 9 | 0 in -4 (burnt by Varus after its inhabitants fled). |
| Leontopolis, Egypt | 12 | 0 | -160..74 | -160 | 18 | Site identification disputed. |
| Cyrene, Libya | 11 | 0 | -293..73 | -293 | 8 | |
| Sardis, Turkey | 8 | 0 | -500..-35 | -500 | 13 | Year Established from Obadiah's Sepharad. |
| Delos, Greece | 10 | 0 | -139..50 | -139 | 17 | Samaritan rows removed. |
| Ein Gedi, Israel | 22 | 2 (2) | -582..68 | -650 | 15 | Zeros -350 and 68. |
| Herodium, Palestine | 18 | 0 | -28..72 | -28 | 13 | |
| Bethsaida, Israel | 15 | 0 | -50..67 | -50 | 14 | et-Tell / el-Araj. |
| Chorazin, Israel | 5 | 0 | 30..50 | 30 | 10 | |
| Gush Halav, Israel | 9 | 0 | 66..67 | 66 | 12 | |
| Cana, Israel | 10 | 0 | -90..70 | -90 | 14 | |
| Arbel, Israel | 8 | 0 | -125..67 | -125 | 12 | Derived figures moved to Notes. |
| Beit Shean, Israel | 14 | 0 | -163..66 | -950 | 11 | 13,000 killed in 66 in Notes. |
| Modiin, Israel | 19 | 0 | -200..68 | -200 | 17 | |
| Gezer, Israel | 15 | 0 | -142..4 | -950 | 11 | |
| Maresha, Israel | 12 | 1 (1) | -586..50 | -925 | 13 | 0 c. -75 (abandoned after Hyrcanus). |
| Beth Zur, Palestine | 20 | 3 (3) | -586..68 | -920 | 13 | Three conflicting zeros. |
| Gophna, Palestine | 10 | 0 | -90..70 | -90 | 10 | |
| Ashkelon, Israel | 5 | 0 | -250..66 | -250 | 6 | 2,500 killed in 66 in Notes. |
| Dor, Israel | 1 | 0 | 41..41 | 41 | 8 | Only the 41 CE synagogue incident. |
| Acre, Israel | 2 | 0 | 66..66 | 66 | 7 | 2,000 killed in 66 in Notes. |
| Machaerus, Jordan | 14 | 0 | -90..72 | -90 | 10 | |
| Herakleopolis, Egypt | 9 | 0 | -144..-133 | -144 | 11 | Politeuma papyri. |
| Edfu, Egypt | 6 | 0 | -50..72 | -50 | 10 | |
| Oxyrhynchus, Egypt | 2 | 0 | 50..50 | 50 | 13 | Bible papyri only. |
| Faiyum (Arsinoe), Egypt | 4 | 0 | -234..73 | -234 | 15 | CPJ II 421 count unread. |
| Memphis, Egypt | 8 | 0 | -580..-47 | -580 | 14 | |
| Benghazi (Berenice), Libya | 3 | 0 | -7..56 | -7 | 8 | |
| Nippur, Iraq | 11 | 0 | -503..-374 | -503 | 17 | Judeans mostly in villages around the city. |
| Nehardea, Iraq | 6 | 0 | 17..65 | 17 | 10 | |
| Nisibis, Turkey | 5 | 0 | 20..60 | 20 | 7 | |
| Seleucia on the Tigris, Iraq | 5 | 1 (1) | 35..41 | 35 | 7 | 0 c. 40 after the massacre. |
| Susa, Iran | 5 | 0 | -494..-445 | -494 | 7 | Esther rows. |
| Ephesus, Turkey | 11 | 0 | -49..54 | -49 | 12 | |
| Apamea, Turkey | 5 | 0 | -62..1 | -62 | 12 | Flaccus gold is a district-wide tax (Notes). |
| Laodicea, Turkey | 5 | 0 | -62..62 | -62 | 9 | Reinach's 7,500 men (district) in Notes. |
| Miletus, Turkey | 3 | 0 | -45..50 | -45 | 7 | |
| Tarsus, Turkey | 5 | 0 | 5..57 | 5 | 11 | |
| Pergamon, Turkey | 3 | 0 | -62..-62 | -62 | 11 | One piece of evidence (Cicero). |
| Corinth, Greece | 9 | 0 | 40..67 | 40 | 9 | |
| Thessaloniki, Greece | 5 | 0 | 50..57 | 50 | 15 | |
| Athens, Greece | 3 | 0 | -150..50 | -150 | 8 | -150 row via Wikipedia citing Barrett. |
| Pozzuoli, Italy | 6 | 0 | 4..64 | 4 | 12 | |
| Ostia, Italy | 2 | 0 | 25..50 | 25 | 10 | Synagogue dating disputed. |
| Salamis, Cyprus | 1 | 0 | 46..46 | 46 | 11 | |
| Kerch (Panticapaeum), Ukraine | 4 | 0 | 50..57 | 50 | 14 | Manumission inscriptions. |
| Anapa (Gorgippia), Russia | 5 | 0 | 41..68 | 41 | 11 | |
