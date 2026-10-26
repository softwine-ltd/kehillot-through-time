# 11 — 1897 figures that disagree between the Brockhaus-Efron tables and other pages

## Source of the task
`DATA_COLLECTION_PIPELINE.md`, line 1305–1306 (status update 2026-10-17/18, "Not done / open"):

> the 1897 figures of some towns disagree between the ЕЭБЕ table and the pages the agents found (Orynin 2412 vs 2112, Dzyarechyn 1887 vs 1573, Vidzy 1657 vs 3480).

## Current data (`kehilot.csv`)
```
L150850: Ukraine | Orynin     | 1897–1924 | 2112 → 1630 | high | yahadmap.org | "1897 census: 2112 Jews (42%); the Brockhaus-Efron table gives 2412"
L4403:   Belarus | Dzyarechyn | 1897–1899 | 1573 → 1887 | high | jewishencyclopedia.com/articles/5100-derechin | "1897 Russian census: 2289 inhabitants of whom 1573 Jews (~69%); the Brockhaus-Efron table lists 1887"
L4404:   Belarus | Dzyarechyn | 1900–1920 | 1887 → 1346 | high | cdp.jewishgen.org | "1900 Jewish population: 1,887"
L6346:   Belarus | Vidzy      | 1894–1896 | 4348 → 3480 | high | jewishgen.org Vidzy yizkor | "Census of 1894 breakdown of Widze: Jews 4,348"
L6347:   Belarus | Vidzy      | 1897–1930 | 3480 → 1150 | high | en.vilna.co.il | "1897 census: 3480 Jews out of 5103 total population (the Brockhaus-Efron table lists 1657 ...; unresolved)"
```

## Recommendation
1. **Look these three up once in the primary source.** That is the 1897 census volumes for Podolia (Orynin), Grodno (Dzyarechyn) and Vilna (Vidzy). Then enter the census figure as the `high` row, and keep the other value as a separate `low` row with its source, per the project's rule for conflicting estimates.
2. If the census volumes cannot be reached, **use the ЕЭБЕ figure as the 1897 row (`high`), and set the other figure to `low`**:
   - ЕЭБЕ (Еврейская энциклопедия Брокгауза и Ефрона, 1908–13) printed tables taken directly from the census. The other pages (Yahad, a memorial site, JE 1906) are later secondary retellings.
   - For Dzyarechyn, the CDP's "1900: 1,887" is the same number as the ЕЭБЕ 1897 figure. That suggests the CDP misdated the census figure. If so, L4404 should become 1897, and the ramp 1573 → 1887 within 1897–1899 disappears.
3. **Vidzy needs care.** The two figures differ by a factor of two (1,657 against 3,480), more than a typo. A likely reason is that one counts the town (mestechko) and the other the whole rural district (volost). Until checked, keep both as separate rows. Do not chain 4,348 (1894) → 3,480 → 1,150 into one line.

## Why
- These are not big towns, but they are the test case for the ~700 unresolved gazetteer rows and the long tail. A rule that is decided now ("census table first, secondary pages low") settles similar conflicts later without another human call.
- *That ЕЭБЕ's gubernia tables reproduce the 1897 census, and that mestechko and volost figures are often confused, is my internal knowledge. I did not check it against the census volumes for these three places.*

## Sources
- ЕЭБЕ gubernia articles on ru.wikisource (the project parsed them as `eeb_towns.csv`, see `DATA_COLLECTION_PIPELINE.md` line 1294) — https://ru.wikisource.org/wiki/Еврейская_энциклопедия_Брокгауза_и_Ефрона
- Yahad – In Unum, Orynyn — https://www.yahadmap.org/en/orynyn-khmelnytskyi-ukraine/village-218
- Jewish Encyclopedia (1906), Derechin — https://jewishencyclopedia.com/articles/5100-derechin
- en.vilna.co.il, Vidzy page (link in L6347).
