# Cloud gap run: summary

Towns 59–91 of `queue.csv`, collected on 2026-09-27 by one subagent per town following `BRIEF.md`, in batches
of 6. All 33 are `done`; none failed. Every `city_data_*.csv` parses with the exact header and 9 columns on
every row, and every row has a numeric Year of Data. Each town also has a `sources_*.txt` fetch log.

Before the run, Providence's coordinates in `queue.csv` were corrected from -73.7329, 43.0006 (upstate New
York) to -71.4222, 41.8236 (Providence, Rhode Island).

"Numbers" = rows with a Population value (including 0). "Years" = span of Year of Data. Figures below are after
the review fixes.

## Review fixes applied
Every edited row carries a `[Review fix: ...]` note at the end of its Notes, so `grep "Review fix"` lists them.
Numbers moved out of Population are kept in Notes.

Conventions applied across all files:
- **Year Established = earliest documented presence**, and no row is dated before it. Rows that recorded only
  a legal permission, visiting traders, an island-wide mention or an unsupported claim were deleted; where the
  earlier row was genuine presence, Year Established was moved back to it.
- **Counts of one group only** (Mountain Jews only) go to Notes, as in Nalchik.
- **Upper bounds** ("at most", "not exceeding") go to Notes. Lower bounds ("more than N") stay in Population.
- **Census counts by nationality** go to Notes; Population uses counts by religion.
- **Community estimates that clash with a census** of the same period go to Notes. The exception is Nalchik:
  its late-Soviet estimates (10,000–17,500) stay, because many Mountain Jews were recorded as Tats in Soviet
  censuses, so the census undercounts them.
- **Magyar Zsidó Lexikon congregation counts** (which may include villages) go to Notes, as in Cegléd,
  Kecskemét and Szolnok.
- **Population 0** only where a source positively documents absence.

Rows deleted (12): Astrakhan 1791 ×2 (right of residence only); Kursk 1780 ×2 (merchant registration rights
only); Kecskemét 1650, 1715 (Ottoman-era traders, fair visitors); Kraśnik 1377 (unsupported JewishGen claim);
Palma 1114, 1135 (island-wide mentions); Rimavská Sobota 1848 (settlement ban lifted, no presence); Lucena 1154
(descriptive epithet) and 1550 (converts, not Jews).

Year Established moved back to the earliest documented presence: Bradford 1838→1825, Krasnoyarsk 1822→1805,
Lucena 853→850, Rimavská Sobota 1851→1849, Ufa 1855→1850, Valparaíso 1851→1850.

Population moved to Notes (24 rows): Tula 1890 4,000 (calculated from "grew 8 times", not stated); Chelyabinsk
2005 10,000; Perm 2005 7,000; Ufa 2007 10,000; Krasnoyarsk 2002 5,000 ×2; Oryol 1941 7,000; Vladivostok 2008
~6,000; Makhachkala 1880 93 ×2 and 1912 453 (Mountain Jews only); Bradford 2001 356 (whole district); Palma
1435 4,000; Urmia 1902 350 (350 families misread); Shumen 1945 1,000 (includes Sofia expellees); Curitiba
1980 2,500 (upper bound); Providence 1905 ~17,500; Oakland 1905 227 (repeat of 1880); Rimavská Sobota 1921,
2001, 2011 (by nationality); Trebišov 2021 2 (by nationality); Szolnok ~350 (source dates it 1818; the
re-dating to 1848 was a guess); Baja 1929 2,400 (lexicon).

Population 0 removed (2): Tabriz c.1485 (Jews "only came to trade" is not documented absence); Kraśnik 1945
(conflicts with a 1944 registration of up to 300).

Population changed (1): Taganrog 1805 ~5 → 2 (one named couple; the families ×5 rule overstated it).

Checked and kept: Tula c.1900 3,500. The source reads "К началу 2-го века", which follows the 19th-century
narrative and precedes the revolutionary period, so it means the 20th century.

## Still open (judgement calls left as they are)
- Conflicting figures kept as separate rows, as the brief asks: Kursk 1970, Chelyabinsk 1926, Perm 1897,
  Makhachkala Soviet censuses (Russian Wikipedia vs RJE), Astrakhan 1899/2002, Taganrog 1845/1859, Lučenec 1880
  and c.1939, Baja 1925, Trebišov 1922, Shumen 1952, Hódmezővásárhely 1880, Balassagyarmat 1920, Urmia 1980s
  zeros vs 2 in 2006, Tabriz 2008 5 vs 2026 0.
- Kept deliberately: Hódmezővásárhely 1848 ~635 (127 households ×5, households ≈ families); Balassagyarmat
  1944 ~2,000 (the source says *local* Jews in the ghetto); Kraśnik 1940–41 6,300 (residents, including
  refugees living in the town); Makhachkala 2024 ~1,000 (200 families ×5); Segovia 1493 0 and Lucena 1146 0
  (communities ended by expulsion or forced conversion).
- Thin towns that may need manual research: Lucena (1 number), Valparaíso (1, and it may cover Viña del Mar
  too), Tabriz (3), Rimavská Sobota (4), Segovia (5).

## Per town
| Town | Rows | Numbers | Years | Notes for the reviewer |
|---|---|---|---|---|
| Nalchik, Russia | 40 | 22 | 1818–2023 | Late-Soviet community estimates kept (see above); Year Established 1818 is approximate. |
| Kursk, Russia | 44 | 20 | 1790–2024 | 1970 EJ ~9,000 vs RJE 4,370; Year Established 1790 approximates "end of the 18th c." |
| Tula, Russia | 31 | 7 | 1835–2016 | No Soviet census figures for the city. |
| Chelyabinsk, Russia | 31 | 12 | 1845–2005 | 1926 ">1,500" vs 1,779; no 1939/1959 figures. |
| Perm, Russia | 54 | 18 | 1823–2021 | 1897 942 vs 817; 1918 5,535 is the community's own estimate, including refugees. |
| Ufa, Russia | 38 | 10 | 1850–2021 | 2002→2010 census jump (781→1,605); no city figure 1926–1989. |
| Krasnoyarsk, Russia | 59 | 23 | 1805–2020 | Nothing at city level after 1989. |
| Astrakhan, Russia | 64 | 28 | 1805–2019 | 2002 3,000 is an estimate vs 1989 census 2,137. |
| Taganrog, Russia | 34 | 12 | 1805–2012 | No postwar figures (the census PDF could not be fetched). |
| Vladivostok, Russia | 34 | 13 | 1878–2015 | No city figures 1959–2010. |
| Makhachkala, Russia | 41 | 27 | 1862–2025 | Russian Wikipedia's Soviet figures run far above RJE's; both kept. |
| Oryol, Russia | 36 | 14 | 1845–2016 | Post-1939 figures rest on Cyclowiki alone. |
| Bradford, United Kingdom | 43 | 16 | 1825–2021 | The 1835 row says services "are said to have been held". |
| Kecskemét, Hungary | 46 | 26 | 1746–2025 | The 1939 figure's year is approximate. |
| Hódmezővásárhely, Hungary | 50 | 28 | 1748–2026 | ~40 dated 2015 from the page's update date; 1770 = 0 after the expulsion. |
| Szolnok, Hungary | 41 | 17 | 1830–1994 | 1944 counts sit beside the 1941 census 2,590; data ends 1994. |
| Baja, Hungary | 31 | 15 | 1725–2023 | 1925 2,400 (JewishGen) vs 1930 census 1,648. |
| Cegléd, Hungary | 32 | 14 | 1840–1965 | Clean census series; no data after 1965. |
| Balassagyarmat, Hungary | 30 | 9 | 1690–2022 | No numbers between 1784 and 1900. |
| Lučenec, Slovakia | 34 | 23 | 1725–2021 | Good series (Masaryk University thesis). |
| Trebišov, Slovakia | 21 | 10 | 1736–2021 | 1922 ~800 vs 1921 census 534. |
| Rimavská Sobota, Slovakia | 22 | 4 | 1849–2021 | Thin; no figure before 1938. |
| Lucena, Spain | 18 | 1 | 850–1492 | No head counts at all. |
| Palma de Mallorca, Spain | 33 | 8 | 1229–2023 | 1329–1350 are the source's own hearth ×4.5 estimates. |
| Segovia, Spain | 27 | 5 | 1215–1493 | All figures are family-based or rounded estimates. |
| Shumen, Bulgaria | 35 | 18 | 1750–2022 | 2021 census 11 vs 2022 community 40. |
| Kraśnik, Poland | 47 | 23 | 1531–1945 | Nothing after 1945. |
| Urmia, Iran | 22 | 10 | 1025–2006 | Year Established 1025 rests on "about a thousand years ago". |
| Tabriz, Iran | 21 | 3 | 1150–2026 | Thin; no 19th–20th c. figures. |
| Curitiba, Brazil | 31 | 10 | 1889–2019 | 1913 ~77 mixes families ×5 with single men; nothing at city level after 1970. |
| Valparaíso, Chile | 22 | 1 | 1850–2021 | The only number (1954) may cover Viña del Mar too. |
| Providence, USA | 46 | 19 | 1838–2005 | Nothing at city level after 1963. |
| Oakland, USA | 35 | 7 | 1852–2015 | No city figure after 1942. |
