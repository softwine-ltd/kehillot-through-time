# 12 — Metro-scale markers that overlap the suburb markers inside them

## Source of the task
`DATA_COLLECTION_PIPELINE.md`, line 1377 (Metro double-counting check, 2026-10-18):

> Remaining known overlaps (a metro-scale marker and the suburbs inside it): Sydney 48k vs 37k in Sydney LGAs, Melbourne 60k vs 44k, Montreal 90k vs 52k (Côte-Saint-Luc, Outremont, Dollard-des-Ormeaux, ...), Toronto 74k with Thornhill 53k and Vaughan 25k (Thornhill overlaps Vaughan), Paris 267k vs 40k, Miami-Dade 119k vs Miami Beach/Hollywood, Fort Lauderdale/West Palm Beach 1983/1954 legacy rows vs Delray/Boca. Summed totals for these areas overstate ...

Also in `DELLAPERGOLA_REFERENCE.md` §5: DellaPergola warns that US metro figures "may double count part-year residents by tens or hundreds of thousands".

## What the task is
Decide what one marker means: the city proper, or the metro area. The project already removed some metro-wide rows in 2026-10-18 (New York, Miami, San Francisco, Bridgeport). The rest of the list was left open.

## Recommendation
**Adopt one rule: a marker holds the municipality's own Jewish population. Metro counts go to the Notes, unless the marker is explicitly a metro marker with no suburb markers inside it.**
1. For each pair in the list, keep city-proper rows on the city marker where a source gives them. Move the metro figure to the Notes of the same year ("Metro area: 90,000 (source)").
2. Where only metro figures exist for a period (for example, the AJYB 1960s–80s "community" estimates, which the doc already says often cover metro areas), keep them, but set `probability = low` and say "metro area" in the Notes.
3. Add a `scope` remark (city / metro / district) to the comment, as already done for JCK "town and surroundings" rows. `utils/dp_coverage_report.py` can then skip metro rows when it sums a country.
4. Thornhill–Vaughan is a different case: two overlapping suburb markers. Keep the one whose source defines it more precisely, and move the other figure to the Notes.

## Why
- The project's core convention is "a town's own Jewish population". A metro count on a city marker breaks that rule in the same way a regional aggregate does, only less severely.
- Country totals (`DATA_ERRORS_REPORT.md` §6, and the DellaPergola comparison in `utils/data/dp_coverage_report.csv`) are inflated by these overlaps. Australia at 1.38 × DellaPergola is attributed to this in the doc itself.
- Moving, not deleting, keeps the information visible to visitors.

## Basis
The project's documents. No outside source. The rule is my recommendation.
