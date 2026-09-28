# Cloud gap run 2: summary

30 Ukrainian and Belarusian towns from `queue.csv`, collected on 2026-09-28 by one subagent per town following
`BRIEF.md`, in 5 batches of 6. All 30 are `done`; none failed and no usage or credit limit was hit. Every
`city_data_*.csv` parses with the exact header and 9 columns on every row, every row has a numeric Year of Data,
no row is dated before Year Established, and every Source URL is listed as fetched OK in the town's
`sources_*.txt`. The review pass below was done by me after the queue was empty.

"Numbers" = rows with a Population value (including 0). "Years" = span of Year of Data. Figures are after the
review fixes.

## Main caveat: thin searching
The brief asks for 6–10 searches per town. Only Chashniki (6), Luninets (6), Uzda (6), Telekhany (6), Lokachi
(6) and Novoukrainka (7) reached it; the rest ran 3–5, and several reported not fetching eleven.co.il, Yad
Vashem or the 1906 Jewish Encyclopedia. Series are therefore shorter than in the first run. Towns with only 2–5
numbers (Novoukrainka, Luninets, Uzda, Telekhany, Lokachi, Torchyn, Bobrynets, Lepel, Donetsk, Zhovkva) would
benefit from a second, deeper pass before their data is relied on.

## Review fixes applied (13 rows tagged `[Review fix: ...]`, 5 rows deleted, 1 Year Established changed)
Numbers moved out of Population are kept in Notes. `grep "Review fix"` lists every edit.

Conventions applied:
- **Population = Jews of the town only.** Kahal-level figures (which cover the community district), ghetto
  counts that may include outsiders and counts that include surrounding villages go to Notes.
- **Counts of another kind** go to Notes: Yiddish speakers (a language count), community membership, poll-tax
  payers where the source itself says they are not all persons. Poll-tax figures that the source presents as
  the town's Jewish population (Polatsk and Slavuta 1765) were kept.
- **Figures that contradict their own source or a same-period census** go to Notes: probable typos (Savran 1900,
  Shpola 1847) and figures far above the census that are likely wider than the town (Novogrudok 1897 JE).
- **Repeated figures:** where a secondary source repeats a dated census figure under another year, the repeat
  is deleted and the dated row kept.
- **Population 0 only where absence is positively documented.** "Not reconstituted" is not enough.
- **Year Established = earliest documented residence;** visits and unreliable first mentions are not.
- Where sources disagree, both rows are kept (as the brief asks).

Rows changed:
- Moved to Notes: Chudniv 1765 ×2 (1,283, kahal); Uzda 1847 (1,618, kahal); Dubrovytsia 1942 (4,327, ghetto);
  Novogrudok 1897 (4,992 Yiddish speakers), 1897 (8,137) and 1765 (893, includes villages); Lyady 1766 (207
  poll-tax payers); Bershad 1989 (1,000 members); Slavuta 1999 (985); Savran 1900 (1,198, typo); Shpola 1847
  (1,156, typo).
- Population 0 removed: Torchyn 1945.
- Deleted: Korosten 965 (unreliable first mention, before Year Established 1618); Sumy 1835 (fair visit, not
  residence); Lokachi 1900, Uzda 1900 and Luhansk 1900 (repeat a dated figure).
- Year Established: Sumy 1835 → 1866 (first residents; 56 Jews).

## Still open (left as is)
- Conflicting figures kept as separate rows: Volodarka 1775; Korosten 1897; Chashniki 1897 (census 3,480 vs
  ~4,000); Chudniv 1898 vs 1897; Luhansk 1897 (1,505 vs 2,109); Bershad 1900 vs 1897/1910.
- Zeros kept: Ivanava 1945 (source says no Jews lived there after the war, yet a 1959 row has 22); Lyady 1942
  (a 1944 JTA report that all Jews were shot); Pyriatyn 1648 (community destroyed, revived late 18th c.).
- Dubrovytsia 1766, 1921, 1931 and 1937 come from a j-roots forum page that only says "as cited": unverified
  against a primary source.
- Approximated years (decade or century midpoints, publication years) are explained in each row's Notes.

## Per town
| Town | Rows | Numbers | Years | Check before merging |
|---|---|---|---|---|
| Kamianets-Podilskyi, Ukraine | 20 | 12 | 1447–2013 | 3 searches; no 1959/1970/1989 or 2001 figures; 1941 tolls in Notes. |
| Volodarka, Ukraine | 18 | 11 | 1650–1989 | 3 searches; Year Established 1650 is the midpoint of "17th century"; the 1989 raion figure is in Notes. |
| Donetsk, Ukraine | 17 | 5 | 1883–2001 | 3 searches; half the fetches failed; 2001 5,087 is "city municipality" and may be wider than the city; no 1989 or pre-1897 figures. |
| Kryvyi Rih, Ukraine | 17 | 10 | 1860–2001 | Year Established 1860 inferred from "settled after 1860"; 1926 share differs between sources (6.2% vs 18.3%). |
| Polatsk, Belarus | 26 | 19 | 1490–2009 | 1891 10,797 is a Russian Wikipedia religion count; 1946, 1970 and 2000 are approximate. |
| Luhansk, Ukraine | 13 | 9 | 1796–2002 | 1897 1,505 vs 2,109; no 1970–2001 census figures; 1923 is a lower bound. |
| Bershad, Ukraine | 21 | 12 | 1648–2017 | 1900 4,500 dips below the 1897 census (6,603); 2017 year is approximate. |
| Korosten, Ukraine | 16 | 9 | 1618–2001 | 1897 1,266 vs 1,299. |
| Pereiaslav, Ukraine | 21 | 11 | 1620–2017 | No 1959–1989 figures; "at least 3,000 prewar" is in Notes. |
| Pyriatyn, Ukraine | 18 | 9 | 1602–2015 | Year Established 1602 approximates "start of the 17th c." (encyclopedia.com gives 1630); 1648 = 0 is a judgement. |
| Shpola, Ukraine | 20 | 10 | 1720–2017 | Not fetched: eleven.co.il, Yad Vashem, 1906 JE; the 1790 figure is a midpoint. |
| Chudniv, Ukraine | 19 | 9 | 1648–2021 | 2021 shows 1 resident, a blog says none; 1965 is a decade midpoint. |
| Voznesensk, Ukraine | 17 | 10 | 1863–2018 | Year Established 1863 = first synagogue; jewua's 1939 5,116 ignored (looks like 1926). |
| Slavuta, Ukraine | 22 | 11 | 1731–2000 | 2000 113 (RJE) conflicts with the moved 1999 985. |
| Novogrudok, Belarus | 24 | 11 | 1484–2009 | 1817 726 vs 706 kept as two rows; Year Established 1484 (Troki Jews leased the customs). |
| Zhovkva, Ukraine | 13 | 5 | 1593–1944 | No figures between 1921 and 1939 or after 1941. |
| Dubrovytsia, Ukraine | 15 | 6 | 1500–1942 | Forum-sourced series (see above); Year Established 1500 from a burial register "kept since 1500". |
| Chashniki, Belarus | 11 | 7 | 1766–1942 | Nothing after 1942; the mid-17th c. settlement only appeared in a snippet. |
| Lyady, Belarus | 12 | 7 | 1731–1942 | 1942 = 0 rests on a 1944 JTA report. |
| Lokachi, Ukraine | 12 | 4 | 1569–1942 | 1897 share 75% vs 43% of 4,037 between sources. |
| Torchyn, Ukraine | 11 | 5 | 1648–1945 | Year Established 1648 from the Cossack massacre; 1939 year approximate. |
| Savran, Ukraine | 15 | 10 | 1795–2018 | Year Established 1795 from an "88 Jews, late 18th c." midpoint. |
| Lepel, Belarus | 11 | 5 | 1802–1959 | Year Established 1802 is the earliest count (1812 gravestones); nothing after 1959. |
| Sumy, Ukraine | 18 | 8 | 1866–2022 | 1897 759 is the town figure (district 1,012). |
| Novoukrainka, Ukraine | 4 | 2 | 1828–1897 | Thinnest file: no 1926/1939/postwar data; needs manual research. |
| Bobrynets, Ukraine | 9 | 4 | 1847–1941 | 1847 "Jewish society" figure may be district-wide; 1939 2,265 seen only in a snippet, not used. |
| Uzda, Belarus | 7 | 2 | 1765–1941 | ru.wikipedia's 1939 "214" conflicts with 1,143. |
| Luninets, Belarus | 10 | 2 | 1886–1944 | 1939 4,153 comes from a Russian Wikipedia ghetto article; 1931 2,232 left out as ambiguous. |
| Telekhany, Belarus | 8 | 4 | 1897–1941 | Year Established 1897 is the earliest count, not first presence; 1941 ~2,000 includes Polish refugees. |
| Ivanava, Belarus | 10 | 6 | 1620–1959 | 1945 = 0 vs 22 in 1959; gap 1859–1900 and after 1959. |
