# 03 — Hamburg: ZWST 2013/2023 against the map's 3,500 and 2,445 rows

## Source of the task
`DELLAPERGOLA_REFERENCE.md`, section 9, "Numbers not added because they differ from existing rows (for the owner to decide)":

> Hamburg 2013 (2,609) and 2023 (2,301) vs the map's 3,500 "official Jewish population" (2008-2014) and 2,445 members of the Orthodox congregation alone (2015-): a single congregation cannot exceed the sum of all communities, so one of them is wrong.

## Current data (`kehilot.csv`)
```
L36290: Germany | Hamburg | 2003–2003 | 4865 → 4865 | medium | DellaPergola AJYB 2023 Table 15
L36291: Germany | Hamburg | 2004–2007 | 5000 → 3500 | high | keydocuments.net | "The congregation already counted 5,000 members; a Liberal congregation founded in 2004 has roughly 500 members."
L36292: Germany | Hamburg | 2008–2014 | 3500 → 2445 | high | hadassahmagazine.org (2008 travel article) | "The official Jewish population is 3,500; true figure could be double."
L36293: Germany | Hamburg | 2010–2010 | 2779 → 2779 | high | ZWST 2010
L36294: Germany | Hamburg | 2015–2026 | 2445 → (blank) | high | keydocuments.net | "Hamburg's Orthodox Jewish congregation counted 2,445 members."
L36295: Germany | Hamburg | 2020–2020 | 2312 → 2312 | high | ZWST 2020
L36296: Germany | Hamburg | 2023–2023 | 2308 → 2308 | high | ZWST 2023
L36297: Germany | Hamburg | 2025–2025 | 2238 → 2238 | high | ZWST 2025
```
On the map, L36292 draws a ramp from 3,500 to 2,445 that sits over the ZWST 2010 count (the map shows ~2,900 in 2010 against 2,779). L36294 holds 2,445 to 2026, over the ZWST counts for 2020, 2023 and 2025.

## Recommendation
1. **Make L36292 a point fact for 2008** (3,500), and set `probability = low`. It comes from a travel-magazine article, and the same sentence says the true figure "could be double", so it is not a count.
2. **Make L36294 a point fact** and keep it `high`. Use the year the keydocuments page gives for the 2,445 figure if it gives one; otherwise keep 2015 and say in the Note that the date is approximate. Reword the Note to say "members of the Jüdische Gemeinde in Hamburg".
3. **Add 2013 = 2,609** (ZWST via DellaPergola, Table 15, as for 2003). Do not add DellaPergola's 2023 figure of 2,301: the map already has the ZWST 2023 figure (2,308) from the primary report.
4. Shorten L36291 (2004–2007) to a 2004 point as well. "Already counted 5,000 members" describes one moment, not a four-year trend.

## Why
- **The conflict DellaPergola's file points to is probably not real.** In Hamburg, the "Orthodox congregation" is the city's main community, the Jüdische Gemeinde in Hamburg. ZWST counts the same body, so 2,445 sits naturally between ZWST 2010 (2,779) and 2020 (2,312). The Liberal congregation founded in 2004 (~500 members, row L36291) is a separate body. *That the Jüdische Gemeinde in Hamburg is a unified community with an Orthodox rabbinate is my internal knowledge; check it against the keydocuments page before relying on it.*
- The 3,500 "official" figure (2008) is the outlier. It is higher than every ZWST count from 2007 on, and its source hedges it.
- As with Berlin (task 02), the main harm is the display: long rows with blank or chained end values hide the yearly ZWST series. Point facts fix that without deleting anything.

## Sources
- DellaPergola, AJYB 2023, Table 15 — https://link.springer.com/book/10.1007/978-3-031-67478-5
- keydocuments.net, "Demographics and social structure" — https://keydocuments.net/topic/demographics-and-social-structure
- Hadassah Magazine, Jewish Traveler: Hamburg (2008) — https://www.hadassahmagazine.org/2008/11/29/jewish-traveler-hamburg/
- ZWST Mitgliederstatistik reports (links in the rows above).
