# events_new_antiquity.csv - proposed new rows, -1300 to 1000 CE

Branch `events-review-v5`. Nothing in events.csv, events_polygon.csv, historical_arrows.csv or kehilot.csv was touched. The file has the 14 events.csv columns plus `verbatim_quote` and `confidence`. 84 rows.

## What was added
- Iron Age and Exile: Merneptah Stele (-1208), United Monarchy, First Temple, Kingdom of Judah, Shoshenq's campaign, fall of Samaria (-722), Sennacherib at Jerusalem (-701), deportations of 597, 587/586 and 582 BCE, Cyrus decree 538, Second Temple 516, Nehemiah 445, Elephantine temple 410.
- Hellenistic and Hasmonean: Septuagint, Battle of Panium, Antiochus IV decrees, Modi'in revolt, rededication 164, Hasmonean dynasty and kingship, Idumea/Samaria conquest, Gerizim temple destroyed, Pompey 63, Herod (accession, Temple rebuild).
- Roman: Judea province 6 CE, expulsions from Rome (19, 49), Caligula statue crisis, Great Revolt (Caesarea, Damascus, Jerusalem 66-70, Temple destroyed 70, Masada), Fiscus Judaicus, triumph of 71, Yavne, Leontopolis closed, Usha, Cyrene and Cyprus legs of the Diaspora Revolt, Bar Kokhba revolt, Hadrian's measures.
- Rabbinic thought (type 11): Mishnah, Tiberias Sanhedrin, Rav and Sura, Nehardea destroyed 259, Pumbedita founded, Jerusalem Talmud, Babylonian Talmud, Geonic period 589, Saadia 928, Sherira 968-998, Pumbedita to Baghdad ~988.
- Late antiquity: Elvira, Cologne 321, Gallus 351, Julian 363, Himyar conversion, Cyril 415, Minorca 418, Sanhedrin disbanded 425, Theodosian Code 438, Yazdegerd II, Mar Zutra II 495-502, Najran 523, Aksumite conquest 525-530, Samaritan-Jewish revolt 556, Toledo III 589, Sisebut 612-616, Persian Jerusalem 614-617, Heraclius 629-630.
- Early Islamic: Constitution of Medina, Khaybar 628 and 642, conquest of Jerusalem 637-38, Geniza chronicle of Jewish resettlement, Pact of Umar, Bostanai, 711 Iberia, Khazar conversion, Anan ben David, Hasdai ibn Shaprut.

## Method and caveats about quotes
Every source URL was fetched with WebFetch (en.wikipedia.org pages, plus one Princeton Geniza record). WebFetch answers through a summarising model, so some "quotes" may differ slightly from the page text. Rows where the tool returned only a paraphrase are marked `[paraphrase]` in `verbatim_quote`. Please spot-check the quotes against the pages before merging. I did not reach Encyclopaedia Judaica / Jewish Encyclopedia / JVL pages in this pass; all sources are Wikipedia (plus Princeton Geniza), which a reviewer may want upgraded for the high-stakes rows.

Casualty figures appear only where the fetched page states them, and are attributed (Josephus, Cassius Dio, inscriptions) in the description. Where the page marks them as probably exaggerated this is said.

## Conventions chosen (please review)
- Colour pairs follow the nearest existing type: 1 orange, 2/3/5/9 red (#c0392b/#e74c3c/0.15), 4 teal, 6 blue (#2980b9/#3498db/0.20). Types 8, 10 and 11 do not exist in events.csv, so I chose: 8 purple #8e44ad/#9b59b6/0.15, 10 same blue as 6, 11 gold #d4ac0d/#f1c40f/0.18.
- Coordinates and radii are my own approximations; Sura, Pumbedita, Nehardea and Mahoza locations are approximate (Iraq, sources give no coordinates). Himyar rows use Zafar. Region-wide rows (Spain, Syria) use large radii.
- Years: BCE as negative; ranges where the source gives a span. Mishnah (190-220) and Himyar conversion (375-400) ranges are my reading of "late 2nd/early 3rd century" and "reigned c. 375-400".
- The Diaspora Revolt's existing row (115-117, Alexandria, type 9) was kept as is; I added Cyrene and Cyprus as type 8 because they are different places.

## Looked for, could not source (not included)
- Claudius 49 expulsion has a Wikipedia source but dates are disputed (41 vs 49), so confidence medium.
- Julian's Temple: page text on the project's own section was cut off; relied on the Third Temple page.
- Ptolemy I's capture of Jerusalem (~320 BCE): the Wars of the Diadochi page does not mention it.
- Hellenistic reform crisis (Jason, 175 BCE): page not found (404).
- Patriarchate abolition (Theodosius II, ~425): the Patriarch page was not found; only the Sanhedrin page's "disbanded in 425" is used.
- Justinian's Novella 146 (553) and Corpus Juris provisions: not on the Justinian page; not included.
- Cairo Genizah start (~882): page gives no date.
- Karaite Jerusalem community and Radhanites: no dated, localised event suitable for one ellipse.
- Kitos War Egypt/Alexandria already in file. 529-531 Samaritan revolt, Heraclius forced baptism decree (no year in source), Muslim-era Umar-Jews agreement in Jerusalem (only an undated Geniza chronicle) were left out or marked low.
- Sasanian-era Shapur I/Samuel friendship and the Khosrow-era Jewish revolt: no year/place in fetched pages.

## Things in the existing events.csv that look wrong (notes only)
- Banu Qurayza appears twice for 627 in Medina (lat 24.4686 and 24.4672), both type 9; one is a duplicate.
- Banu Qurayza Hebrew text omits the "Deaths: 600-900 (al-Tabari)" clause and transliterates the name two different ways (קורייט'ה vs קוריצה); the Muhammad/Qaynuqa-Nadir Hebrew is fine.
- Ostia synagogue (year 100) is type 1 (Exile) with a green colour not used by other type 1 rows; it fits a different type, and 100 CE for the oldest synagogue in western Europe is a loose date.
- The Alexandria 38 row's source URL carries an anchor (#Jewish_history) and no figures; Kitos row uses fillOpacity 0.18 whereas other type 9 rows use 0.15 (one other 0.18 row exists, so this is probably intentional).
- The "Babylonian administrative zone" row (-586 to -516) is type 1, not a discrete event, and its end year coincides with the Second Temple dedication, not with the 538 return.
- No rows exist for types 8, 10 or 11 at all, so the legend/colour for those types needs a decision.
- The Al-Mutawakkil row (850) is centred on 34.20 N, 43.87 E (near Samarra) which is correct for the caliph's seat but the edict applied empire-wide.
