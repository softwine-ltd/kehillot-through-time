# Proposed new events 1800-2024 (branch events-review-v7)

File: `events_new_1800_2024.csv` - 85 rows, the 14 columns of `events.csv` plus `verbatim_quote` and `confidence`.
No existing file was edited. Review before merging.

## Method and caveats
- Every row's `source` is a Wikipedia page that was fetched during this work and that states the event with year and place. Search snippets were not used.
- `verbatim_quote` is the line the fetch step returned from that page (under 25 words). The fetch tool summarises pages, so a few quotes may differ slightly from the live text, and a few come from a page's reference list or are an ellipsis-joined sentence. Those rows are marked `medium`. A reviewer should spot-check `medium` rows before merging.
- Casualty numbers appear only where the fetched page states them; the wording says "reported"/"estimated" where the page does.
- Colours: type 5/9/2 reuse the red pair of the existing rows; type 3 uses the existing 0.12-opacity red; Nazi-era camps, ghettos and laws reuse the dark pair used by the existing "Nazi-era restrictions" row (`#2c3e50/#34495e`); migrations reuse the teal pair of type 4; state events reuse the blue pair of the "Early Israeli state events" row; Jewish-thought/organisation rows (type 11) use the green pair of the Statute of Kalisz row; the Warsaw uprising (type 8) uses the orange pair.
- Coordinates and radii are my own placement (city 15-40 km, region 100-400 km, country-scale 300-700 km). Several multi-country movements (Kindertransport, Bricha, Soviet emigration) are rough ellipses.
- `description_heb` is my own translation of the English text and was not independently checked by a Hebrew speaker.

## What was added (grouped)
- Emancipation and law: Hamburg Temple 1817, Cantonist statute 1827, Jews Relief Act 1858, German emancipation 1869-71, Crémieux Decree 1870, May Laws 1882, Nuremberg Laws 1935, 1939 White Paper.
- Persecution and trials: Mortara 1858, Tiszaeszlár 1882-83, Dreyfus 1894-1906, 1905-06 pogrom wave, Beilis 1911-13, Leo Frank 1915, Constantine 1934, Przytyk 1936, Slánský 1952, Doctors' Plot 1951-53, Poland 1967-72, Baghdad hangings 1969, Libya 1967.
- Zionism and Israel: First Zionist Congress, Bund 1897, Aliyot 1-5 (1881-1939), Tel Aviv 1909, Balfour 1917, Hebrew University, Birobidzhan 1934, Arab revolt 1936-39, UN Partition 1947, Declaration 1948, 1948 war, Six-Day and Yom Kippur wars, Entebbe 1976.
- Holocaust: Anschluss, Evian, Kindertransport, Warsaw ghetto and uprising, Auschwitz, Treblinka, Sobibor, Belzec, Chelmno, Lodz, Vilna, Kaunas, Riga, Theresienstadt, Babi Yar, Lviv and Bucharest pogroms 1941, Transnistria, Vel d'Hiv, Wannsee, Salonica, Denmark rescue, Shanghai, Hungary 1944, Bricha.
- Post-war and later: Kielce exodus, Tripoli 1945, Aden 1947, Exodus 1947, Magic Carpet, Ezra and Nehemiah, Egypt 1956, Yachin, Algeria 1961-62, Soviet Jewry movement and exodus, Iran 1979, Operations Moses and Solomon, FSU aliyah 1990s, AMIA 1994, Paris 2015, Pittsburgh 2018, Halle 2019, 7 October 2023.

## Looked for but not added
- Not sourced (page not found or event not confirmed by a fetched page): Napoleon's Sanhedrin 1806-07 (fetched page did not state Paris/1807); Seesen Jacobson school 1810 (page returned 404); Ukrainian civil-war pogroms 1918-21 (both guessed pages returned 404); Tragic Week Buenos Aires 1919 (page did not describe the anti-Jewish violence); French emancipation 1791 is before the period; Britain 1858 is covered by the Jews Relief Act row.
- Not attempted for lack of time: Hebron/Jerusalem 1948 events, Kristallnacht (already present), Majdanek/Jasenovac/Maly Trostenets, Jewish Brigade, Altalena, Munich 1972, Toulouse 2012, Poway 2019, post-1948 Syria and Lebanon, Ethiopian aliyah after 1991, 2020s events other than 7 October.
- Egypt 1956 and the FSU 1990s rows are sourced to general history pages and are only medium confidence; a dedicated source (Jewish Virtual Library or Encyclopaedia Judaica) would be better. The Bricha quote is about 1944-45 contacts, not the whole movement.
- Kristallnacht, Farhud, Kielce, Iasi, Jedwabne, Struma, Hep-Hep, Kishinev, Odessa, Bialystok, 1881-84 pogroms, Damascus 1840 and the 1920/21/29/36 Palestine riots were found already present and not duplicated. The new 1936-39 revolt row covers the whole revolt; the existing 1936 row covers only the Jaffa riots of April 1936. The new Declaration-of-Independence row (Tel Aviv Museum, 14 May 1948) overlaps spatially with the existing 1948-1967 "Early Israeli state events" region row.

## Notes on the existing events.csv (not edited)
- The row "Irbid Massacres: British mandate Palestine" (1920) has coordinates 32.059, 49.444 which fall in central Ukraine, not Jordan/Palestine; looks like a coordinate error.
- The 1870 row about Abram Sasson, "an elderly Aleppo Jew", is placed at Alexandria's coordinates (29.9187, 31.2001); check whether the incident was in Alexandria or Aleppo.
- "Kristallnacht violence (centered near Munich)" and other "(centered near X)" rows place a country-wide event at one arbitrary point.
- Duplicated or near-duplicated pairs: Banu Qurayza 627 (two rows), Damascus 1840 (two rows), Almohad persecutions at Marrakesh 1146-1160 (two rows with overlapping years).
- "Migration-era socio-economic zone in Central Europe (Budapest area)" 1880-1920, "Nazi-era restrictions and events in Berlin area" 1933-45 and "Early Israeli state events around Tel Aviv region" 1948-67 have no source and vague descriptions.
- The file is not strictly sorted by year (e.g. 1864 rows appear after 1875).
