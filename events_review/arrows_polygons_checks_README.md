# Review of historical_arrows.csv rows 76-150 and events_polygon.csv (all 16 rows)

Files: `arrows_checks_76_150.csv`, `polygons_checks.csv`. No source CSV was edited. `row_number` is the data row (header excluded).

## Counts

Arrows (75 rows): confirmed 6, confirmed_with_corrections 41, not_confirmed 18, contradicted 7, duplicate 3.
Polygons (16 rows): confirmed 1, confirmed_with_corrections 13, not_confirmed 1, contradicted 1.

## Systemic findings

- **Almost every arrow URL is broken.** 70 of 75 URLs in rows 76-150 return 404 on Wikipedia (invented titles such as `Expulsion_from_Mainz`, `Third_Partition_Expulsions`). Only rows 91-94 (he.wikipedia, Great Expulsion of 1306) and row 131 (Khmelnytsky Uprising) resolve (five rows). `verification_url` gives a real page for each row; the original URL is not worth keeping.
- **Generic end point.** 47 arrows end at (52.0N, 20.0E), a placeholder for "Poland", not a documented destination. Where the destination is known (Maarssen, Lower Bavaria, Altona, Moisling, Livorno, Heidingsfeld, Provence/Aragon/Navarre) the CSV gives it; elsewhere the end point is flagged as unsupported.
- **Rows that are not expulsions.** Strasbourg 1349 (massacre), Khmelnytsky 1648 (massacre), 1881 and 1919 (pogroms/violence), Kraków 1494 (relocation to Kazimierz), Moravia 1745 (threat only, rescinded). There is no colour category for massacres, so `expulsion_color` is wrong or debatable for these; I did not choose a new colour.
- **Third and Fourth Crusade rows (76-87).** Rows 76-78 are Barbarossa's overland march of 1190 (the descriptions and Hebrew titles say a naval route from Crete to Acre). Rows 79-87 do not match the Fourth Crusade route (Venice, Zara, Corfu, Constantinople); the Durres/Kythira/Split/Dubrovnik stages could not be found in any source.
- **Duplicates.** 119 (Naples 1533, degenerate arrow) vs 120; 139 (Bohemia and Moravia) vs 138/140/141; 140 vs 138.
- **Polygons.** Many outlines extend into the sea (Levant realms start at lon 34.1-34.4, the coast is at about 34.5-34.8). Biggest outline errors: row 11 (Babylonian academies: Pumbedita/Nehardea near Fallujah, about 43.8E, are outside the polygon, which starts at 44.2E), row 12 (early Gaul drawn only in the north), row 15 (France 1000-1300 omits Languedoc). Date errors: row 7 (Hasmonean starts -332, should be about -141), row 16 (England 1000-1500, should be 1066-1290), row 4 (ends -516, Babylonian rule ended -538).

## Weakest items (least reliable even after review)

Rows 79-87 (Fourth Crusade), 105, 109, 122, 127, 133, 142, 143, 146 (nothing found for the claimed event), 95, 112, 114, 137, 141, 148, 149 (contradicted), polygon 7 (contradicted dates), polygon 10 and 11.

## What I could not check

- The method for "fetched page": I read Wikipedia through its API (plain-text article extracts) and fetched Jewish Encyclopedia (jewishencyclopedia.com), Jewish Virtual Library and encyclopedia.com (Encyclopaedia Judaica) pages with WebFetch. Quotes are from those fetches; a few quotes in the CSV are trimmed or ellipsized and are shorter than 25 words.
- Several details appear only in web-search result summaries, not on a fetched page, and are labelled as such in `issue`: the Erfurt dates 1453-1454, the Würzburg dates 1560 and 1567, the readmission of Mainz in 1445, the Heidingsfeld refuge, and the Navarre/Aragon and Hungary readmission dates.
- Not verified: the Hebrew titles beyond obvious translation errors (I flagged only titles whose meaning is wrong, e.g. rows 76-87 and 95; no corrected Hebrew titles are supplied, and `corrected_description_heb` in the polygon file is empty); the claim that Philadelphia (Alasehir) was on Barbarossa's route (row 77); the Hungary return in 1364 (row 97); the role of Maximilian I in the 1498/1499 Nuremberg expulsion; the 1501 and 1503 return dates for Kraków/Lithuania; the 1545 return for Bohemia; the Alexander II assassination link in row 148; the 1798 readmission in Cologne; whether the ~1,000 figure in the Judah he-Hasid Hebrew title is right (row 136).
- Midpoints (midLat/midLon) and arrow curvature were not checked.
- Polygon vertex checks were made by reading the vertex lists against known city coordinates and descriptions of the territory, not by plotting them on a map.
- The branch `events-review-v4` was created from the working copy's current HEAD (`events-review-v2`), so it also carries earlier review commits from that branch.
