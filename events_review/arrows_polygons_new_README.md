# New arrows and polygons proposal (branch events-review-v8)

Nothing in events.csv, events_polygon.csv, historical_arrows.csv or kehilot.csv was changed. Two new files, for review before any merge:

- `arrows_new.csv`: 62 segments, 52 distinct titles, roughly 38 movements. Columns: the 13 of historical_arrows.csv plus `verbatim_quote` and `confidence`.
- `polygons_new.csv`: 15 polygons. Columns: the 10 of events_polygon.csv plus `verbatim_quote`, `confidence`, `outline_basis`.

## Method and caveats (read first)
- Every row's url/source is a Wikipedia page that was fetched this session (WebFetch). The fetch tool returns a model-condensed answer, not raw page text, so `verbatim_quote` is the wording returned by the tool and should be spot-checked against the page before merging. Where the tool reported that a page did not state a fact, I did not use it (see "Not sourced").
- Only Wikipedia (plus one Jewish Virtual Library page, not used as a row source) was used. Encyclopaedia Judaica / Jewish Encyclopedia were not fetched, so no row cites them.
- Origin points are representative cities (e.g. Valencia for Spanish exiles, Odessa for Russian Empire emigration, Munich for German DP camps); the sources give regions, not these exact cities. Each such row says so in its description.
- Mid points are computed, not hand-tuned: the control point sits a fixed fraction (0.10 to 0.18) of the segment length perpendicular to the straight line, on the northern side (flipped for a few rows to avoid overlapping a sibling arrow). Existing rows vary widely (from nearly straight to very large offsets), so tune in the UI.
- Colors: forced movement = expulsion_color, voluntary = emigration_color. No crusades_color used.

## Arrows added (by movement)
Babylon 597 BCE and return 538 BCE; captives to Rome 63 BCE; Carthage 70-73; Cyrenaica 132-136 (tradition, low); Maimonides Cordoba-Fez-Acre-Fustat 1148-1168; Ashkenazi migration east to Poland (3 origin routes, 1264-1550); Sephardic exile 1492 to Portugal, Ottoman Empire (2), Italy (Naples, Ferrara); Portuguese conversos to Amsterdam and Livorno (Livornina 1591-93); Dutch Recife 1636-54 and flight to New Amsterdam 1654; Lithuanian refugees to Amsterdam 1650s (low); Russian Empire emigration to Britain, Argentina, Canada, South Africa; First and Second Aliyah; Haavara; German-Jewish emigration to the US, Britain, Shanghai, Bolivia, Sosua; Kindertransport (3 segments); deportations Warsaw-Treblinka, Hungary-Auschwitz, Salonika-Auschwitz; Brihah (3), Sh'erit Hapleta to Israel and US; Aliyah Bet (Constanta-Haifa, Cyprus); Exodus 1947 (3 legs); Yemen, Iraq, Morocco, Algeria, Libya (2), Iran; Soviet/post-Soviet aliyah (Israel, US, Germany); Operation Moses and Solomon.

## Polygons added
Himyar, Khazar Khaganate, Pale of Settlement, Crown of Aragon, Crown of Castile, Council of Four Lands area, Byzantine Palestine, Sasanian Babylonia (Asoristan), Mutasarrifate of Jerusalem, Mandate Palestine, UN Partition Plan Jewish state (3 sections), Green Line Israel, Jewish Autonomous Oblast.

**Outline quality is the weak point.** None of the fetched pages gives vertex coordinates, so every outline is a schematic envelope drawn from the named regions plus general geographic knowledge, and every `outline_basis` says so. All are confidence `low` except Mandate Palestine (`medium`, it follows the well-known 1923 line). The three partition polygons are crude and should be replaced by a digitised UN map or dropped. Do not use the Green Line polygon for any border statement. Vertex counts are 8-25 (the partition, Mutasarrifate and Oblast polygons are under 10 because the shapes are simple).

## Not sourced / skipped
- Egypt 1948-57 and Iran after 1979: pages fetched gave counts but no destinations, so no arrows.
- Spanish exiles to Navarre; Portuguese conversos to Curacao/Brazil (named by the Portugal page without dates or routes); conversos to Bordeaux (not mentioned).
- Khmelnytsky 1648 flight: the fetched Wikipedia pages did not describe refugee routes; only the 1650s Lithuania-Amsterdam row (low) exists. The existing 1648 row remains.
- German-Jewish emigration to Palestine/US counts are for all of Europe or all years in places (noted in each row).
- Arrows for Russian Empire emigration to the US skipped as the existing "Eastern European Immigration to America" (1880-1920) covers it. Spread to Rome beyond the 63 BCE row, and the 70 CE flight "around the Mediterranean", have no named destination in the source.
- Holocaust: only three flows with fetched numbers; Amsterdam, Paris/Drancy, Theresienstadt and others were not fetched.
- Polygons not drawn: Warsaw Ghetto and Venetian Ghetto (only centre coordinates and total area available, no outlines), Yishuv (no definable area), Poland-Lithuania as a whole.
- Hebrew texts are my own translation of the English titles; descriptions have no Hebrew column in the arrows file.

## Observations on existing files
- historical_arrows.csv: titles with encoding damage ("Ni?", "Durr?s" - U+FFFD in the Crusade rows for Nis and Durres).
- Row "Expulsion from Portugal (1497)" ends at 40.0,-3.0 (central Spain); row "Expulsion from Kingdom of Naples (1533)" has identical start, end and mid (40,-3), i.e. a zero-length arrow; "Expulsion from Naples (1541)" ends at the same Spain point.
- About 40 expulsion rows share the placeholder destination 52.0,20.0 (central Poland) whatever the real flight, and the same Third Crusade segment "Messina to Acre 3" appears twice with near-identical coordinates.
- Several mid points have the mid equal to the start or end (e.g. Metz-Regensburg 49.0123,12.0988), and some rows have leading spaces in numeric fields (" 3.0824").
- "Babylonian Exile" is one segment for -586 to -516 and the Wikipedia page dates the second deportation to 587 BCE.
- events_polygon.csv: "Babylonian administrative zone" is a 0.1-degree square (about 11 km) used as a region; the Kingdom of Israel (united) and Northern Kingdom outlines overlap Judah's northern part along 32.0.
