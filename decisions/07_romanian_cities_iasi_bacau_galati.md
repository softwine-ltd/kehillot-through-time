# 07 — Iași, Bacău, Galați: the "human call" on Romanian wartime rows

## Source of the task
`DATA_COLLECTION_PIPELINE.md`, three places:
- Lines 295–303, "Flagged but deliberately not touched — needs a human call, not a heuristic": Romanian Old Kingdom Jews were deported to Transnistria, not killed on the spot, and many returned. So a multi-decade row *might* be closer to history there than in a Polish shtetl. Bacău and Galați were shortened, but "Iași's 1899-2006 single-row span was left as-is pending a closer read of that city's specific history."
- Line 334, item 3: "Make a human call on Iași/Bacău/Galați (and similarly-shaped Romanian cities)."
- Line 709, item 5: "Human calls left open: Iași/Bacău/Galați ..."

## Current data (`kehilot.csv`), Iași
```
L104311: Romania | Iași | 1803–1819 | 2420 → 4396  | high | kehilalinks.jewishgen.org/iasi/iasi.html | "Jewish population"
L104312: Romania | Iași | 1820–1830 | 4396 → 17570 | high | (same) | "Jewish population"
L104315: Romania | Iași | 1859–1898 | 31015 → 39441 | high | (same)
L104316: Romania | Iași | 1899–2006 | 39441 → 492  | high | (same) | "Jewish population"
L104317: Romania | Iași | 1930–1930 | 285 → 285 | high | rusynsociety.com/.../recensamantul_1930.pdf | "285 Evrei (Jews) of 1075 inhabitants of the stable population (26.5%) ..."
L104319: Romania | Iași | 1992 | 616 · L104320: 2002 | 402 · L104322: 2011 | 249 · L104323: 2021 | 134   (census, Mosaic religion)
L104321: Romania | Iași | 2007–2026 | 492 → (blank) | high | jewishfed.ro | "Total members of the Jewish Community in Iași"
```
What the map shows from this:
- **1930:** about 28,200. The 1930 census gave 34,662 (35,465 in Pinkas HaKehillot).
- **1947:** about 22,000. Pinkas HaKehillot gives 38,000.
- **1992:** about 7,000. The census row in the same file says 616.
- **2021:** 492, held from 2007. The census says 134.

## Recommendation
**Iași: replace the 1899–2006 row with the sourced points. Do not keep it as a slow decline.** In detail:
1. Set L104316 to a 1899 point (39,441).
2. Add the Pinkas HaKehillot Romania table as point or chained rows: 1910 35,000; 1921 43,500; 1930 35,465 (and/or the census figure 34,662); 1941 33,135; 1942 32,369; 1947 38,000.
3. Fix the units of L104311 and L104312. Pinkas says 1803 = "2,420 (Heads of Households)" and 1820 = "4,396 families". These are not persons. Either use households × 5 with `probability = low` (the project's rule) or blank the population and keep the figure in the Notes.
4. **Delete L104317 or move it to its own marker.** 285 Jews out of 1,075 inhabitants is not the city of Iași, which had about 100,000 inhabitants. It is a village of the same name in the census volume the source PDF is from.
5. Make L104321 (community members, 2007) a point fact, so the 2011 and 2021 census points show.
6. After 1947, add sourced counts for the emigration years (1948–1952 and 1958–1965) if any can be found, for example from the Federation of Jewish Communities in Romania (FEDROM). If none can be found, leave the gap rather than bridging it with a straight line.

**Bacău and Galați: no further action.** Their rows are now chains of sourced counts. Bacău goes 1930 9,424 → 1945 18,000. Galați goes 1930 19,912 → 1941 13,511 → 1947 13,000 → 1950 9,000. Those patterns fit the history. The general rule worth writing into the docs: for Old Kingdom (Regat) cities, wartime and post-war rows may show continuity when a source says so. For Bukovina, Bessarabia and Northern Transylvania they may not, because those Jews were deported and killed.

## Why
- The doc's caution was right about the history, but a straight line is still wrong for Iași. Most of Iași's Jews survived the war: 32,369 in 1942 and 38,000 in 1947, per Pinkas HaKehillot. The 1899–2006 row therefore *understates* the war years (22,000 in 1947 instead of 38,000) and *overstates* the communist decades (7,000 in 1992 instead of 616). The real shape is a high plateau to about 1950, then a steep fall through emigration. Only the sourced points can show that.
- *Background, from my internal knowledge:* in the Iași pogrom of 28–30 June 1941, the Romanian Wiesel Commission report counts more than 13,000 victims. Bacău's population rose during the war because Jews from the countryside were forced into the towns. Both facts are consistent with the counts above.

## Sources
- Pinkas HaKehillot Romania, vol. 1, "Iasi" (population table 1803–1947) — https://www.jewishgen.org/yizkor/pinkas_romania/rom1_00141.html
- JewishGen KehilaLinks Iași (1930: 35,465; 34.4% of 102,872) — https://kehilalinks.jewishgen.org/Iasi/families.html
- JewishGen Cemetery Discovery Project (1930 census: 34,662) — https://cdp.jewishgen.org/kkuc
- Wikipedia, Iași pogrom — https://en.wikipedia.org/wiki/Ia%C8%99i_pogrom
