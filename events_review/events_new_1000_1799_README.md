# Proposed new events.csv rows, 1000-1799 CE (branch events-review-v6)

`events_new_1000_1799.csv` holds **76 proposed rows**: the same 14 columns as `events.csv`, plus `verbatim_quote` and `confidence` (high 61, medium 15). It is sorted by year. No existing file was edited. The rows are ready for review but not merged.

## How the rows were sourced

- Every row has a `source` page that was fetched, and the quote in `verbatim_quote` was checked by script as an exact substring of that page's text. Whitespace, quote marks and dashes were normalised before the comparison. Every quote is 24 words or fewer.
- Sources are English Wikipedia, read through its text-extract API, and Jewish Virtual Library pages that carry Encyclopaedia Judaica text. Some JVL pages contain stray `@ -->` markup, which was removed from the quotes.
- Casualty numbers appear in a description only where the fetched source gives them: Blois 33, Trent 15, Passau 10, La Guardia 6+2, Ancona 23, Regensburg 800, and the "about 40 converted" at Passau.
- `confidence = medium` means one of three things:
  - the page gives the event but the quote carries no year (Second Crusade 1146, Hasidism, Haskalah, Vilna Gaon, Isserles);
  - the source is a list-level statement (Navarre 1498, Naples 1510, Milan 1597);
  - the source's dates or details are fuzzy (Deggendorf, Augsburg, Ancona, Maimonides, the Salonika 1492 row, the Lateran badge decree, Mehmed II 1453).
- `description_heb` was written by me as a translation of the English text. A Hebrew reader should proofread it.
- The `source` column holds a single page. Where the description adds a detail, it comes from the same fetched page, not from other sources.

## Colours and ellipses

- Types 2, 3, 5 and 9 reuse the red pair `#c0392b` / `#e74c3c` at 0.15, the majority pair in the file.
- Type 4 uses the teal pair, and type 6 uses the green Kalisz pair `#27ae60` / `#2ecc71` at 0.25.
- Types 7 and 11 had no precedent in `events.csv`, so I picked new pairs: slate `#2c3e50` / `#34495e` at 0.14 for ghettos, and purple `#8e44ad` / `#9b59b6` at 0.18 for Jewish thought. Change them if you prefer.
- Centres are the town or region centre, radii are 15-40 km for a city and 100-450 km for a region, and tilt is mostly 0. These are cartographic choices, not sourced facts.

## What was added (by theme)

- **Expulsions and exclusions (type 3):**
  - Mainz 1012, Paris royal domain 1182, England 1290, France 1306 and 1394.
  - Hungary 1349 and 1360, Cologne 1424, Augsburg 1438-40, Navarre 1498, Provence 1498-1501, Nuremberg 1498-99.
  - Sicily 1492, Naples 1510, Regensburg 1519, Bratislava 1526, Prague 1541 and 1745-48.
  - Papal States 1569, Milan 1597, Vienna 1669-70.
- **Massacres and riots (types 9 and 2):**
  - Jerusalem 1099, Rhineland 1146-47, Blois 1171, Armleder 1336-39, Deggendorf 1336-37.
  - Seville 1391, Kraków 1407, Lisbon 1506, Frankfurt Fettmilch 1614, Nemyriv 1648.
- **Persecution, blood libels and the Inquisition (type 5):**
  - Norwich 1144, Lateran IV 1215, Paris Talmud trial 1240, Barcelona disputation 1263, Tortosa 1413-14.
  - Trent 1475, Passau 1478, Seville Inquisition 1481, La Guardia 1490-91, Portugal forced conversion 1496-97.
  - Talmud burning in Rome 1553, Ancona 1555, Lviv siege 1648, Isfahan 1656.
- **Ghettos (type 7):** Frankfurt Judengasse 1462, Kraków to Kazimierz 1495, Venice 1516, Rome 1555, Padua 1601.
- **State, charters and legal events (type 6):**
  - Casimir III 1334, Constantinople under Mehmed II 1453, Bayezid II 1492, Tiberias lease 1558.
  - Council of Four Lands 1580-1764, Livornina 1591-93, Whitehall Conference 1655-56, Jewish Naturalisation Act 1753.
  - Joseph II's Toleration Patent and Edict 1781-82, Pale of Settlement 1791.
- **Migration (type 4):** Nachmanides to Jerusalem 1267, Salonika 1492, refugees to Fez 1492-96, Marranos to Amsterdam 1593.
- **Jewish thought (type 11):** Maimonides in Fustat, Safed Kabbalah, the Shulchan Aruch (1563), Isserles, the Maharal, Safed printing (1577), Sabbatai Zevi (Smyrna 1665 and Edirne 1666), Hasidism and the Baal Shem Tov, the Vilna Gaon, the Lwow Frankist disputation (1759), the Haskalah in Berlin.

## Looked for but not added

- **Würzburg 1147:** no matching Wikipedia article was found under the title I tried.
- **Sternberg 1492:** that Wikipedia page returned nothing.
- **Pius V's *Hebraeorum gens sola* 1569:** this has its own row only through the Ancona-page statement about the banishment.
- **Florence ghetto 1571:** no fetched page.
- **Vytautas' Brest privilege of 1388:** the Wikipedia page was empty, so no usable statement.
- **Tulchyn and Polonne 1648:** the fetched pages give no year or detail beyond "during the Khmelnytsky Uprising". Nemyriv, which has a date, was added.
- **Breslau 1453:** the John of Capistrano page says 40 Jews were burned and the rest expelled, but states no year for it.
- **Styria and Wiener Neustadt 1496:** this appears only as list lines in "Expulsions and exoduses of Jews" and are not independently confirmed. Navarre, Naples and Milan are accepted at medium confidence on that basis.
- **Isaac Luria's Safed dates:** Wikipedia gives 1569 in one passage and "early 1570" in another, so he appears only inside the Safed Kabbalah row.
- **Zohar and Moses de León:** the fetched pages give no clear year.
- **Amsterdam's Portuguese Synagogue 1675 and the 1638 unification:** the fetched Amsterdam page has captions only, not text.
- **Not tried, or no fetched source:** Black Death cities beyond those already in `events.csv`, the Lviv pogroms of 1664, Poznań 1399, Mantua and Ferrara ghettos, Hamburg, the 1470 Bavarian expulsions, the Ottoman Jews of Egypt and Syria after 1517, and Maghreb events between 1500 and 1799 beyond the Fez row.

## Notes on the existing `events.csv` (not changed)

- The five rows dated 1301 (Cairo, Marrakesh, Baghdad, Damascus, Khorasan) have templated wording and country-level sources. "Marrakesh massacre during Mamluk period" looks wrong, since Marrakesh was never Mamluk. All five look unverified.
- The 1220 row for Baghdad ("blamed for Mongol invasion") is dated 1220. The Mongol capture of Baghdad is generally dated 1258, and the Iran page I fetched says the Mongols captured Baghdad in 1257.
- The 1577 row "Passover Massacre, Ottoman empire" has coordinates near Cherkasy, Ukraine, and a source URL titled `Passover_massacre` that I did not fetch. The label and coordinates disagree, and I could not confirm the event.
- The 1288 Naples row is type 9 (pogrom), but its text says expulsion, which is type 3.
- The 1146-48 Almohad row is type 5 and the 1148-60 Almohad row is type 9, at the same centre. They look like duplicates.
- The 1385 Khorasan row is generic ("Khorasan Massacres, Iran") with a country-level source.
- The 1613-29 Isfahan row has the same centre as my new 1656 Isfahan row. They are different events.
- The Spanish expulsion footprint (1492-1600) is centred on Madrid with a 200 km radius, which covers only a fraction of the kingdoms involved.
- Between 1500 and 1790 `events.csv` has almost nothing for Western and Central Europe (the only rows are Khmelnytsky 1648-57 and Uman 1768), so this period was thin before this proposal.
