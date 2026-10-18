# historical_arrows.csv - data rows 1-75 check

Verdict counts (75 rows): confirmed_with_corrections 51, not_confirmed 21, duplicate 2, contradicted 1, confirmed 0.
No row is "confirmed" outright: every row has at least one defect (nearly all have a dead URL).

Movements covered: Assyrian captivity (1-3), Babylonian exile (4), Rome 139 BCE (5), Rome 19 CE (6), Kalonymus migration (7), First Crusade (8-30), Second Crusade (31-43), Third Crusade (44-75).

## Systematic problems
1. **URLs**: every crusade segment URL (e.g. `First_Crusade_-_Tripoli_to_Jerusalem`, `Third_Crusade_-_Crete_to_Acre`) and the Kalonymus URL are not real Wikipedia pages (404 on most; a few returned HTTP 429 when probed but their siblings are 404, so they are treated as non-existent). Only First_Crusade, Assyrian_Captivity, Babylonian_Exile, Expulsions_and_exoduses_of_Jews and Claudius'_expulsion... exist. Suggested replacements are in `verification_url`.
2. **Hebrew titles and descriptions are shifted/copy-pasted**: First Crusade rows 11-21 are off by one; rows 20-30 all say "Tripoli to Jerusalem"; Second Crusade rows 34, 39 say "Antioch to Damascus"; rows 40-43 are titled Second Crusade but carry the Third Crusade "Dartmouth to Messina" Hebrew/description; rows 66-75 (Paris-Lyon-Marseille, Metz, Regensburg, Balkans) all say "Crete via Cyprus to Acre". No Hebrew column is corrected in the check file (only English corrected_description); a Hebrew pass is needed after the segments are fixed.
3. **yearEnd 1100 for the First Crusade** (rows 8-30) should be 1099.
4. **Geometry copied between crusades**: rows 40-43 reuse First Crusade rows 19-21 geometry for the Second Crusade (the Louis VII leg is plausible); rows 68-69 (Paris-Metz-Regensburg) reuse Second/First Crusade legs and are not Barbarossa's Third Crusade route (he mustered at Regensburg).
5. **Bad midpoints**: row 27 (Venice-Split, mid over Austria), row 36 (Constantinople-Anatolia, mid ~400 km east), rows 1 and 4 (mid in eastern Anatolia), row 2 (mid in Arabian desert), row 21/42 (mid offshore Ashkelon), row 48 (mid on Corsica). Corrected midpoints are only suggested in the issue text (no corrected mid columns).
6. **Not Jewish movements**: rows 8-75 draw crusader army/fleet routes, not Jewish migrations. Colour crusades_color fits "campaigns", but readers may take them for Jewish routes; the Jewish-relevant events (Rhineland massacres 1096, 1146-47 violence, England 1189-90) are only touched by rows 17-18.

## Weakest items
- Row 7 (Kalonymus): year 920 contradicted by Encyclopaedia Judaica and Jewish Virtual Library (9th century, Charles the Bald); dead URL.
- Rows 3, 68, 69: segments not supported by any source (Syrian desert start / not Media; Paris-Metz and Metz-Regensburg on the Third Crusade).
- Rows 5, 6: arrow destination is arbitrary (42.0N,13.6E); 19 CE sources say Sardinia; 139 BCE names no destination.
- Rows 50, 51: duplicate / degenerate (row 51 is a 1 km arrow inside Acre).
- Rows 44-47, 53-55, 62-65: route legs not stated in any page I fetched (open-sea Marseille-Messina, Lisbon-Gibraltar-Marseille, Limassol-Famagusta-Acre).

## What could not be checked
- Encyclopaedia Judaica / Jewish Encyclopedia articles for the Roman expulsions and the Crusades were not fetched; I relied mostly on Wikipedia (flagged), Philip Harland's translation of Valerius Maximus, encyclopedia.com (EJ Kalonymus), Jewish Virtual Library, Fordham's William of Tyre, and warhistory.org. Several waypoints (Lyon, Genoa, Venice, Nis, Edirne, Tripoli, Acre en route, Famagusta, Crete landing) are not stated in the pages fetched and are marked accordingly; they may be true but are unverified here.
- The Wikipedia pages are long and the fetch tool read only portions (e.g. First Crusade chars 0-120000, Third Crusade 0-150000), so a statement "absent" means absent from the read portion.
- For some rows (53-58, 61) the cited source (warhistory) gave a summary only; `verbatim_quote` is left blank rather than invented.
- The search snippets about Meshullam (900-926) and the Dartmouth/Marseille timing were not fetched pages and are not used as verification.
- Hebrew titles were checked only for consistency with the English segment, not for translation quality. Coordinates were checked against my own knowledge of city locations, not a geocoder.
