# Reference data from Sergio DellaPergola's papers

Totals, series and source pointers extracted from three papers by Prof. Sergio DellaPergola, kept here because they are useful context for `kehilot.csv`
(country totals to compare with, long time series, definitions) but are not town-level data. The town-level facts that could be used were added to
`kehilot.csv` (see the last section). Scripts: `utils/dp_coverage_report.py` compares the map with the 2024 country table;
the country tables are in `utils/data/dp2023_core.csv` and `utils/data/dp2024_core.csv`.

| Short name | Paper |
|---|---|
| **AJYB 2024** | DellaPergola, S. "World Jewish Population, 2024", *American Jewish Year Book 2024* (Springer, 2025), ch. 8 (CBS copy: `https://www.cbs.gov.il/he/Documents/World%20DellaPergola%202024%20complete.pdf`) |
| **AJYB 2023** | DellaPergola, S. "World Jewish Population, 2023", *American Jewish Year Book 2023* (ed. Dashefsky & Sheskin, Springer, 2024), ch. 8, pp. 7-68 of the volume (`https://link.springer.com/book/10.1007/978-3-031-67478-5`) |
| **Genealogy 2024** | DellaPergola, S. "Notes toward a Demographic History of the Jews", *Genealogy* 8(1):2 (published 27 Dec 2023), open access, `https://doi.org/10.3390/genealogy8010002` |

Page numbers below are the printed page numbers of the AJYB 2023 volume.

## 1. Definitions (used by all three papers)
* **CJP, core Jewish population**: people who identify as Jews (or are identified so by a household respondent) and do not hold another monotheistic religion; includes converts and people of Jewish parentage with no religion. This is the series used for the world totals and for the country totals below, and the one the coverage report compares with.
* **PJP, population with Jewish parents**: CJP + persons partly Jewish + non-Jews with a Jewish parent.
* **EJP, enlarged Jewish population**: PJP + other non-Jewish household members.
* **LRP, Law of Return population**: Jews, children and grandchildren of Jews and their spouses, regardless of identity.
* World, 1 Jan 2023: CJP 15,691,200; PJP 20,148,100; EJP 22,835,700; LRP 25,554,900 (LRP - CJP = 9,863,700; AJYB 2023 p. 22-23, Table 3).
* The accuracy codes in the country tables: A = census or reliable survey, regularly updated; B = less accurate but recent; C = older or partial; D = essentially speculative. Source types: C census, P population register, S survey, J community register, E estimate.
* Counts are often revised retroactively ("the permanently provisional nature of Jewish population estimates"): the 2023 world estimate was later revised to **15,658,000** and Israel's 2023 figure by **-40,500** after the 2022 census (AJYB 2024, p. 1). The 2024 world estimate is 15,736,800.

## 2. World core Jewish population, 1880-2023 (AJYB 2023, p. 8, Table 1)
Jan 1 of each year (1945 = May 1). "Original" = as first published; "Revised" = after later corrections (1990 onwards the original estimates are also revised).

| Year | Original | Revised | Annual change % | World population (millions) | Jews per 1,000 of world population | % of world Jewry in Israel |
|---|---|---|---|---|---|---|
| 1880 | | 7,800,000 | | 1,400 | 5.57 | 0.31 |
| 1900 | 10,728,500 | 10,600,000 | 1.55 | 1,625 | 6.52 | 0.47 |
| 1922 | 15,393,800 | 14,400,000 | 1.40 | 1,900 | 7.58 | 0.58 |
| 1939 | 16,181,300 | 16,500,000 | 0.80 | 2,300 | 7.17 | 2.72 |
| 1945 | 11,000,000 | 11,000,000 | -6.53 | 2,315 | 4.75 | 4.95 |
| 1950 | 11,303,400 | 11,297,000 | 0.57 | 2,526 | 4.47 | 8.97 |
| 1960 | 12,792,800 | 12,079,000 | 0.67 | 3,026 | 3.99 | 15.39 |
| 1970 | 13,950,900 | 12,735,000 | 0.53 | 3,691 | 3.45 | 19.68 |
| 1980 | 14,527,100 | 13,034,000 | 0.26 | 4,449 | 2.93 | 24.69 |
| 1990 | 12,810,300 | 13,103,000 | 0.05 | 5,321 | 2.46 | 28.37 |
| 2000 | 13,191,500 | 13,575,000 | 0.35 | 6,127 | 2.22 | 35.90 |
| 2005 | 13,034,100 | 14,035,000 | 0.67 | 6,514 | 2.15 | 37.32 |
| 2010 | 13,428,300 | 14,299,000 | 0.37 | 6,916 | 2.07 | 39.88 |
| 2015 | 14,310,500 | 14,830,800 | 0.73 | 7,336 | 2.02 | 41.92 |
| 2020 | 14,787,200 | 15,380,600 | 0.73 | 7,689 | 2.00 | 44.04 |
| 2022 | 15,263,500 | 15,590,400 | 0.68 | 7,837 | 1.99 | 44.79 |
| 2023 | 15,691,200 | | 0.65 | 7,963 | 1.97 | 45.26 |

Milestones (p. 8-9): 15 years after 1945 to add one million (11M to 12M); another 30 years for 12M to 13M; stagnation from the 1970s for nearly 20 years; 14M about 17 years later; 15M around 2017; 16.5M (1939) not yet regained. Israel: about 0.5M in 1945, 630,000 in 1948, 7.1M in 2023. Diaspora: 10.5M in 1945, stable until the early 1970s, about 8.5M around 2000, 8,589,800 in 2023. In 2023 Israel and the US held 85.4% of world Jewry, the 10 largest countries 96.8%, the 25 countries with 10,000+ Jews 99.2%; 104 countries had at least 100 Jews, and the 79 countries with under 10,000 Jews together held under 1%.

## 3. Regions, 2022 revised and 2023 (AJYB 2023, p. 19, Table 2)
| Region | 2022 | 2023 | Change | Jews per 1,000 |
|---|---|---|---|---|
| World | 15,590,400 | 15,691,200 | +100,800 (0.65%) | 1.97 |
| Diaspora | 8,607,800 | 8,589,800 | -18,000 (-0.21%) | 1.08 |
| of which US | 6,300,000 | 6,300,000 | 0 | 18.93 |
| of which other Diaspora | 2,307,800 | 2,289,800 | -18,000 (-0.78%) | 0.31 |
| Israel (incl. East Jerusalem, West Bank, Golan) | 6,982,600 | 7,101,400 | +118,800 (1.70%) | 734.98 |
| America total | 7,060,900 | 7,060,000 | | 6.87 |
| North America | 6,696,200 | 6,698,200 | | 18.02 |
| Central America, Caribbean | 57,500 | 57,500 | | 0.26 |
| South America | 307,200 | 304,300 | -0.94% | 0.70 |
| Europe total (incl. Asian Russia and Turkey) | 1,331,600 | 1,315,600 | -1.20% | 1.59 |
| European Union (27, incl. Baltics) | 791,700 | 791,200 | | 1.78 |
| Former USSR in Europe (Russia, Ukraine, Belarus, Moldova) | 190,600 | 172,500 | -9.50% | 0.87 |
| Other West Europe and Balkans (incl. UK, Turkey) | 349,300 | 351,900 | +0.74% | 1.90 |
| Asia total | 7,017,600 | 7,136,300 | +1.69% | 1.54 |
| FSU in Asia | 14,100 | 13,500 | | 0.14 |
| Other Asia | 20,900 | 21,400 | | |
| Africa total | 55,600 | 54,600 | -1.80% | 0.04 |
| North Africa (incl. Ethiopia, Eritrea) | 3,400 | 3,400 | | |
| Sub-Saharan (incl. South Africa, Zimbabwe) | 52,200 | 51,200 | | |
| Oceania | 124,700 | 124,700 | | 2.83 |

Corrections to the 2022 figures in the 2023 edition: US +300,000, UK +19,000, Germany +6,000, Poland +4,500, Canada +2,000, Israel -400, Australia -1,200, Russia -3,000. FSU total for 2023: 194,300 core Jews in the 15 republics (180,800 in Europe including 8,300 in the Baltics, 13,500 in Asia); the enlarged population is nearly three times the core. Emigration from Europe to Israel (incl. FSU): 119,708 (2000-04), 46,004 (2005-09), 58,004 (2010-14), 111,113 (2015-19), 30,879 (2020-21), 66,221 (2022).

By definition and region, 2023 (Table 3, p. 23): CJP / PJP / EJP / LRP in thousands: Israel 7,101 / 7,362 / 7,623 / 7,623; North America 6,698 / 10,250 / 12,051 / 14,101; Latin America 362 / 482 / 594 / 716; European Union 791 / 1,048 / 1,288 / 1,532; FSU in Europe 172.5 / 348 / 528.5 / 739; Rest of Europe 352 / 397 / 444 / 491; FSU in Asia 13.5 / 24.6 / 35.2 / 45.3; Rest of Asia 21.4 / 26.8 / 32.1 / 37.3; Africa 54.6 / 69.9 / 84.3 / 97.7; Oceania 124.7 / 139.4 / 156.1 / 172.8. 75% of the roughly 10 million "extra" LRP people live in North America. The US had more people with Jewish parents (9,800,000) than Israel (7,362,200).

## 4. Countries
**The 25 countries with 10,000+ core Jews, 1 Jan 2023** (Tables 4 and 5, p. 25-26; rank, country, core Jews, Jews per 1,000 inhabitants):
1 Israel 7,101,400 (735.0); 2 United States 6,300,000 (18.9); 3 France 440,000 (6.7); 4 Canada 398,000 (10.3); 5 United Kingdom 312,000 (4.6); 6 Argentina 171,000 (3.7); 7 Russia 132,000 (0.9); 8 Germany 125,000 (1.5); 9 Australia 117,000 (4.5); 10 Brazil 90,500 (0.4); 11 South Africa 50,000 (0.8); 12 Hungary 46,000 (4.7); 13 Mexico 40,000 (0.3); 14 Ukraine 33,000 (0.8); 15 Netherlands 29,700 (1.7); 16 Belgium 29,000 (2.5); 17 Italy 26,900 (0.5); 18 Switzerland 20,500 (2.3); 19 Uruguay 16,200 (4.5); 20 Chile 15,700 (0.8); 21 Sweden 14,900 (1.4); 22 Turkey 14,200 (0.2); 23 Spain 13,000 (0.3); 24 Austria 10,300 (1.1); 25 Panama 10,000 (2.3). Jewish share above 5 per 1,000 only in Gibraltar (22.9), the US, Monaco (17.5), Canada and France. The full country list (about 130 rows incl. total population) is in `utils/data/dp2023_core.csv`; the 2024 list in `utils/data/dp2024_core.csv`. Between the 2023 and 2024 tables the largest changes: Netherlands 29,700 -> 35,000, Russia 132,000 -> 123,000, Germany unchanged at 125,000, Israel 7,101,400 -> 7,153,000.

**1970 compared with 2023** (Table 6, p. 30; countries with 20,000+ Jews in 1970): United States 5,520,000 -> 6,300,000; Israel 2,581,000 -> 7,101,400; Russia 807,900 -> 132,000; Ukraine 777,100 -> 33,000; France 530,000 -> 440,000; United Kingdom 390,000 -> 312,000; Canada 286,000 -> 398,000; Argentina 282,000 -> 171,000; Belarus 148,000 -> 6,000; South Africa 118,000 -> 50,000; Uzbekistan 102,900 -> 2,600; Moldova 98,100 -> 1,500; Brazil 90,000 -> 90,500; Iran 72,000 -> 9,100; Hungary 70,000 -> 46,000; Romania 70,000 -> 8,700; Australia 65,000 -> 117,000; Georgia 55,400 -> 1,200; Morocco 45,000 -> 2,100; Azerbaijan 41,300 -> 6,800; Turkey 39,000 -> 14,200; Latvia 36,700 -> 4,200; Mexico 35,000 -> 40,000; Belgium 32,500 -> 29,000; Uruguay 32,000 -> 16,200; Italy 32,000 -> 26,900; Germany 30,000 -> 125,000 (+316.7%); Netherlands 30,000 -> 29,700; Chile 30,000 -> 15,700; Kazakhstan 27,700 -> 2,300; Ethiopia 25,000 -> 100; Lithuania 23,600 -> 2,200; Switzerland 20,000 -> 20,500. Only eight countries grew.

**Size classes** (Table 8, p. 32; 1984 -> 2023): countries with 100+ Jews 74 -> 104; world core Jews 12,963,300 -> 15,691,200; countries with 100,000-999,999 Jews 6 -> 7; 5,000,000+ one (US) -> two (US, Israel).

**Israel and the territories, 1 Jan 2023** (Table 9, p. 34): core Jews 7,101,400, of whom 6,368,200 within the pre-1967 borders, 239,100 in East Jerusalem, 25,800 in the Golan Heights, 468,300 in the West Bank; 521,800 "others" (non-Jewish Law of Return household members); Arab population 2,038,800 in Israel (incl. East Jerusalem and the Golan) and 4,850,200 in the Palestinian Territory (West Bank 2,779,700; Gaza 2,070,500); 178,000 foreign workers and refugees. Jews were 48.3% of the total population between the sea and the Jordan (core definition; 51.9% by the Law of Return definition). No Jews in Gaza since 2005. In 2022: 132,753 Jewish births, 43,031 deaths, TFR 3.03; 32,000 Jewish immigrants of 76,400 immigrants; 74,267 olim in 2022 (highest since 1999: 76,766).

**United States** (Table 12, p. 44; revised core Jewish population, previous in brackets): 1945 4,360,000; 1950 4,680,000; 1955 4,950,000; 1960 5,200,000; 1965 5,380,000 (5,280,000); 1970 5,520,000 (5,370,000); 1975 5,585,000 (5,385,000); 1980 5,650,000 (5,435,000); 1985 5,675,000 (5,485,000); 1990 5,750,000 (5,515,000); 1995 5,900,000 (5,675,000); 2000 5,975,000 (5,700,000); 2005 6,050,000 (5,730,000); 2010 6,075,000 (5,825,000); 2015 6,215,000 (5,940,000); 2020 6,277,000 (6,000,000); 2023 6,300,000. Until 1975 based on Rosenwaike (1980). Pew 2020: net Jewish population 7.5M (adults 5.8M, children 1.7M); DellaPergola core 6,277,000 (Jews by religion 5,215,000 + Jews of no religion 1,062,000) and non-core 1,223,000 (Table 11, p. 43). Population of Jewish background (PJB): 435,000 (1970), 2,686,000 (1990), 4,455,000 (2013), 5,400,000 (2020); core 5.5M (1970) to 6.3M (2020). US Jewish population in the Sheskin-Dashefsky report: 7,460,600 in 2023. Under age 30 in 2020 Jewish women had 0.41 children on average (30-49: 1.75; 50-64: 1.79; 65+: 2.14).

**Canada** (p. 47-48): 2021 census 335,295 Jews by religion (329,000 in 2011), 282,000 by ethnicity (309,650 in 2011; 143,665 in 2016, a questionnaire artefact); 80,240 with no religion and a Jewish ethnicity or culture in 2021; core estimates 391,665 (2011 revised definition), 404,015 or 394,015 (2021), 396,000 (2022), 398,000 (2023). Immigration 16,685 (2011-21) and 21,445 (2001-11). 17,295 Canadian Jews were born in Israel (19% of Jewish immigrants).

**United Kingdom** (Table 13, p. 50; census Jews by religion, thousands): 2001 / 2011 / 2021 - UK 266.7 / 269.6 / 277.3 (England and Wales 2021 271,766; Scotland 6.4 / 5.9 / 5.5; Northern Ireland 0.4 / 0.3 / 0.4); London 149.8 / 148.6 / 145.5; East (Hertfordshire) 30.4 / 34.8 / 42.0; North West (Manchester) 28.0 / 30.4 / 33.3; South East 19.0 / 17.8 / 18.7; Yorkshire and Humber 11.6 / 9.9 / 9.4; South West 6.7 / 6.4 / 7.4; West Midlands 5.0 / 4.6 / 4.4; East Midlands 4.1 / 4.3 / 4.3; North East 3.2 / 4.5 / 4.4; Wales 2.3 / 2.1 / 2.0. Greater London's share fell from 58.1% (2001) to 52.5% (2021); Greater Manchester rose from 10.5% to 12.0%. Ethnic Jews in England and Wales 2021: 68,198 (52,167 also Jewish by religion). 43% of the UK gave no or no stated religion in 2021 (23% in 2001). DellaPergola's estimates: 310,000 for 2021, 312,000 for 2023. Jewish births exceed deaths again (Haredi growth); intermarriage 11% (1965-69) to 26% (2010-13).

**France** (p. 46-47): 530,000 (1970s survey), 500,000 + 75,000 non-Jewish household members (2002 survey), 440,000 (2023). Aliyah from France: peak 6,627 (2015), 3,556 (2021), 2,189 (2022); over 60,000 in 2000-2022; 90,000-120,000 left France since 2000 (including other destinations).

**Russia** (Table 14, p. 51; census persons of Jewish ethnicity, thousands): 2002 / 2010 / 2021 - Russian Federation 238.9 / 161.3 / 84.1 (the 2021 census was judged not plausible: 11.3% gave no ethnicity answer; DellaPergola estimates 132,000 for 2023, 145,000 for 2022; Tolts's 2010 estimate 200,600 including undeclared); Moscow city 80.4 / 53.3 / 28.1; Moscow oblast 10.1 / 7.2 / 5.1; St Petersburg city 38.4 / 25.4 / 9.2; Leningrad oblast 1.7 / 1.2 / 0.9; Sverdlovsk 6.9 / 5.5 / 2.4; Samara 6.4 / 4.4 / 2.3; Tatarstan 3.5 / 2.6 / 1.8; Crimea 5.5 / 3.5 / 1.7; Krasnodar 3.3 / 2.3 / 1.7; Chelyabinsk 4.9 / 3.4 / 1.7; Rostov 5.0 / 3.2 / 1.7; Stavropol 3.1 / 2.4 / 1.6; Nizhny Novgorod 5.3 / 3.8 / 1.5; Bashkortostan 2.4 / 1.9 / 1.3; Novosibirsk 3.3 / 2.2 / 1.2; Saratov 3.4 / 2.3 / 1.2; Perm 2.6 / 1.9 / 0.9; Dagestan 2.5 / 1.9 / 0.9; Jewish Autonomous Oblast 2.3 / 1.6 / 0.8; Irkutsk 2.5 / 1.6 / 0.8; Omsk 2.4 / 1.7 / 0.8; Kabardino-Balkaria 1.3 / 1.0 / 0.7; Kaliningrad 1.6 / 1.1 / 0.7. Moscow and St Petersburg: 54.6% of the total in 2002, 51.5% in 2021. Aliyah from Russia 45,428 in 2022 (7,574 in 2021); about 200,000 Jews and family members to Israel in 2000-2022. Ukraine: census 104,300 (2001); estimates 40,000 (2022), 33,000 (2023); 47,000 Jews to Israel in 2000-2022. Belarus: 2019 census 13,705 (judged unreliable), estimate 6,000.

**Germany** (Table 15, p. 53; ZWST registered community members, listed for 2003 / 2013 / 2023): total 98,335 / 102,797 / 90,885 (29,089 in 1990; peak 107,794 at the start of 2007). Baden-Württemberg 7,306 / 8,235 / 7,686; Bayern 17,298 / 18,437 / 17,560; Berlin 11,278 / 10,214 / 8,286; Brandenburg 989 / 1,384 / 1,691; Bremen 1,159 / 995 / 739; Hamburg 4,865 / 2,609 / 2,301; Hessen 11,727 / 11,778 / 10,553; Mecklenburg-Vorpommern 1,304 / 1,585 / 1,111; Niedersachsen 7,899 / 8,238 / 7,463; Nordrhein-Westfalen 26,905 / 27,995 / 25,033; Rheinland-Pfalz 2,617 / 3,311 / 1,979; Saarland 1,070 / 1,019 / 748; Sachsen 1,830 / 2,663 / 2,289; Sachsen-Anhalt 1,546 / 1,504 / 1,175; Schleswig-Holstein - / 1,951 / 1,614; Thüringen 542 / 839 / 657. 2000-2022: 4,476 Jewish births, 29,582 deaths; 52,586 immigrants registered with communities; 10,115 withdrawals vs 1,553 new joiners. 52% of Jewish adults foreign-born (2018); Israeli-born about 9%. DellaPergola's estimate 125,000 (a 6,000 upward correction in 2023 because former members who withdrew had been wrongly dropped). Registered Israeli citizens in Berlin: 5,472 (2021), 3,065 (2012).

**Others** (p. 53-58): Australia census Jews by religion 83,993 (2001), 88,831 (2006), 97,336 (2011), 91,022 (2016, form change), 99,956 (2021); with Jewish ancestry and no religion 108,671; estimate 117,000. Brazil census 107,329 (2010; of which 105,432 urban). South Africa 2001 census 61,675 white Jews (75,555 in all), 2019 survey estimate 53,200, 2023 estimate 50,000. Hungary census 12,781 (2001), 10,965 (2011), 7,635 (2022); 2017 survey range 58,936-110,679; estimate 46,000. Mexico census 59,161 (2010; plus 8,315 "Neo-Israelites"), 58,876 (2020); community lists 44,400; estimate 40,000. Italy community membership 26,706 (1995), 21,982 (2022); estimate 26,900. Poland census 1,055 (2002), 7,353 (2011), 17,156 mentioned a Jewish ethnicity (2021); community members 1,860 (2018); core estimate 4,500 (2011), 9,500 (2023). Portugal census 2,910 Jews age 15+ (2021), estimate 3,800. Switzerland 17,478 Jews age 15+ (2021), estimate 20,500. Austria 10,300, Belgium 29,000. Argentina: 2004 Buenos Aires survey 161,000 totally or partly Jewish (enlarged 244,000); core estimate 171,000.

## 5. Metropolitan areas (Table 16, p. 57; population with Jewish parents or enlarged, 1 Jan 2023, above 100,000)
Tel Aviv 4,009,700 (94.8% of the population); New York-Newark-Jersey City 2,188,100 (11.1%); Jerusalem 1,039,000 (72.3%); Haifa 739,700 (73.0%); Los Angeles-Long Beach-Anaheim 670,200 (5.2%); Miami-Fort Lauderdale 535,500 (8.8%); Philadelphia-Camden-Wilmington 419,150 (6.8%); Paris 335,000 (2.9%, incl. about 55,000 part-year residents); Chicago 322,080 (3.4%); Washington 297,290 (4.7%); Boston 257,460 (5.3%); Be'er Sheva 252,800 (59.1%); San Francisco-Oakland 247,500 (5.4%); London 235,000 (2.4%); Buenos Aires 230,000 (1.4%); Toronto 225,000 (4.5%); Atlanta 132,100 (2.2%); Baltimore 119,300 (4.2%); San Diego 100,700 (3.0%). These are broader definitions than the core and are not comparable with country core totals (US metro figures come from the Sheskin-Dashefsky chapter and may double count part-year residents by tens or hundreds of thousands). 50.9% of the (enlarged) world Jewry lived in the nine largest, 61% in the nineteen listed.

## 6. Migration (AJYB 2023 p. 59-65; Genealogy 2024 section 3)
Israel received 69% of all Jewish migrants in 1948-1968 and about 60% in 1969-2015. About 1.9M people (including non-Jewish relatives) left the FSU in 1989-2021: about 1.2M to Israel, over 350,000 to the US, over 250,000 to Germany. Over 9 million Jews relocated since the 1880s, nearly 4 million before 1948 and over 5 million after. New immigrants to Israel 2021 / 2022: total 24,977 / 74,267; Russia 7,574 / 45,428; Ukraine 3,044 / 14,577; France 3,556 / 2,189; US 3,449 / 2,920; Argentina 826 / 947; Belarus 1,013 / 2,206; UK 636 / 558; Brazil 501 / 345; South Africa 438 / 416; Canada 271 / 396; Germany 148 / 193 (Table 17, p. 61-62). Earlier years: 19,696 (2020), 33,096 (2019), 28,118 (2018), 26,333 (2017), 25,010 (2016). Israelis granted US permanent residence: 3,989 (2020); about 250,000 naturalised since 1948.

## 7. Long-term history (Genealogy 2024)
* **Antiquity**: estimates of 4-6 million Jews around the Mediterranean at the height of the Roman Empire (Beloch, Juster, Baron), about half in the Land of Israel; DellaPergola follows the lower view, 600,000-1 million in the Land of Israel (Avi-Yonah, Albright, Broshi) and similar or slightly higher in the Diaspora.
* **12th-17th centuries**: world Jewry "probably never fell much below one million nor exceeded one and a half million" (1170: about 1.2 million, from Benjamin of Tudela). About 1 million or fewer in the second half of the 17th century, after the wave of violence in Eastern Europe (1648-1660). 1.1M in 1700, 2.5M around 1800, 10.6M in 1900, 16.5M in 1939, 11M in 1945, 15.7M in 2023. Expulsion from Spain and Portugal: 100,000-150,000 Jews out of 250,000-300,000.
* **Eastern Europe** (Table 3, Genealogy p. 11; thousands; incl. Bohemia, Galicia, Hungary, Romania, Ukraine, Russia): 1170 - 7 (growth 0.9-1.0%/yr); 1300 - 25; 1490 - 50; 1650 - 250 (Weinryb: 250,000-350,000); 1765 - 910; 1825 - 2,272; 1880 - 5,727; 1900 - 8,510 (incl. emigrants overseas). Life expectancy at birth of women 25 (1300-1490) to 45 years (1880); total fertility 5.4-6.4. Yearly growth of over 2% in Eastern Europe in the last quarter of the 19th century.
* **Regional shares of world Jewry**: Eastern Europe (incl. Balkans) 52% (1700), 75% (1880), 49% (1939); West and Central Europe 13% (1700), 14% (1880), 8% (1939); North Africa and Asia (incl. the Palestine yishuv) about 35% (1700), 8% (1880), 7% (1939); Americas under 1% (1700), 3% (1880), 33% (1939); Palestine about 3% in 1939.
* **How many Jews ever lived** (Table 1, p. 6; thousands): cumulative about 118.7 million by 2022, of whom about half entered by 1700; 640 by 1100 BCE, 8,249 by 400 BCE, 14,249 by year 0, 26,754 by 500 CE, 56,766 by 1700, 84,786 by 1900, 98,290 by 1940, 117,108 by 2015.
* **Intermarriage** (Table 5, p. 17): the weighted world average of Jews marrying non-Jews was about 5% in the 1930s, 33% in the 1980s and 31% in the 2020s (the growing weight of Israel, where intermarriage is rare, balances the Diaspora increase); the table lists countries in bands from under 1% to over 75%.
* Other points: Ashkenaz formed from the 4th century on the Rhine and in northern France; Eastern Europe settled from the 11th century; Jews of Saudi Arabia are still mentioned by Benjamin of Tudela and later vanish; Jewish marriage was monogamic in Europe since 1012 (Grossman 1981). Exodus numbers (70 Israelites, 600,000) are not documentary; 430 years of growth at 2.15% a year are feasible demographically.

## 8. Sources the papers rely on (useful leads for data collection)
Censuses and registers: ONS (UK, 2001/2011/2021), Statistics Canada, Australian Bureau of Statistics, IBGE (Brazil 2010; 2022 census religion data was still pending), INEGI (Mexico 2020), Rosstat (Russia 2002/2010/2021; Tolts's analyses), Ukraine census 2001, GUS (Poland 2002/2011/2021), KSH (Hungary 2001/2011/2022), Statistics Portugal, Statistik Schweiz, Statistik Austria, Belarus 2019, Israel CBS, PCBS. Community bodies: ZWST (annual Mitgliederstatistik, Germany), UCEI (Italy), Board of Deputies Community Research Unit (UK), AMIA (Argentina burials), Comité Central Israelita de México, CJA/Environics (Canada 2018), Jewish Community Survey GEN17 (Australia, Graham & Markus 2018), South African Jewish Community Survey 2019 (Graham 2020), Pew Research Center 2013 and 2020, NJPS 1970/1990/2000-01. Authors of the national chapters: Brym (Canada), Graham (UK, South Africa, Australia), Tolts (FSU), Staetsky (Europe, Haredim), Sheskin and Dashefsky (US, metro areas), Rebhun, Cohen (France), Kovács (Hungary), Krupnik (Argentina), Rosenwaike 1980 (US 1945-1975), Weinryb 1972 and Stampfer (Eastern Europe), Botticini and Eckstein 2012 (antiquity to the Middle Ages), Baron 1971. DellaPergola's own earlier work: 1983 and 2001 (long-term series), 2014 (definitions), 2020b (migration), DellaPergola and Staetsky 2020/2021 (Europe).

## 9. What was added to kehilot.csv from these papers, and what conflicts were found (2026-10-18)
Added (9 rows, probability `medium`, Source = the AJYB 2023 volume URL, Notes give the table and page): Berlin 2003 (11,278), Hamburg 2003 (4,865), Bremen 2003 (1,159) and 2013 (995) from the ZWST member counts of Table 15 (the table covers whole federal states, and for these three city-states that equals the city); Moscow 2002 (80,400) and 2021 (28,100) and St Petersburg 2002 (38,400), 2010 (25,400) and 2021 (9,200) from the census counts of Table 14 (rounded to hundreds, in the paper's thousands). The 2021 Russian census counts are flagged as an undercount in the Notes. One existing row was corrected: Berlin 1990-2013 chained the East Berlin community count (200) to the 2014 count of 12,000, so the site interpolated 200 -> 12,000 over 23 years; it now covers 1990 only.

**Numbers not added because they differ from existing rows (for the owner to decide)**
* Berlin 2013, 10,214 (ZWST) vs the map's 2014 row of 12,000 "registered members" (kehilalinks) and the row 2015-2024 12,000 (Hebrew Wikipedia: 12,000 Jews of whom about 8,200 community members). DellaPergola's 2023 figure (8,286) agrees with the "about 8,200 community members", so the 12,000 rows are a broader definition; the 2014 "12,000 registered members" is the contradicting one.
* Hamburg 2013 (2,609) and 2023 (2,301) vs the map's 3,500 "official Jewish population" (2008-2014) and 2,445 members of the Orthodox congregation alone (2015-): a single congregation cannot exceed the sum of all communities, so one of them is wrong.
* London 2011: the map has 150,329 (JPR census table), DellaPergola's Table 13 has 148.6 thousand (2001 and 2021 agree: 149,789 / 145,466 vs 149.8 / 145.5).
* Bremen 2023: DellaPergola 739 (ZWST report of 2022) vs the map's 729 (ZWST 31 Dec 2023, parsed earlier): consistent, different year-end.
* The country totals of the map against the 2024 table are in `utils/data/dp_coverage_report.csv` (regenerate with `utils/dp_coverage_report.py`).
