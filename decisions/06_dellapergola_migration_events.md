# 06 — The three migration events proposed from DellaPergola (2007/2009)

## Source of the task
`DELLAPERGOLA_REFERENCE.md`, section M.10, "What was added to the map from this paper (2026-10-25)":

> Three type-4 (Migration) events were proposed in `DPM_events.csv` for the owner's review: the emigration from the Russian and Habsburg empires to the West 1881-1914 (peak 1905-06), the mass immigration to Israel 1948-1951 (peak 1949-51), and the FSU exodus from 1989 (peak 1990-91 ...). `events.csv` has one type-4 row only ...

## What is in the repository now
That section was committed on 2026-10-25 at 17:00 (`5222b2b`). About 90 minutes later, commit `e2beaaa` ("Add 756 reviewed events to events.csv") added 59 type-4 events to `events.csv`. Three of them cover the same three waves:

| `events.csv` | Source |
|---|---|
| 1880–1914, "Mass emigration of Jews from the Russian Empire and other parts of Eastern Europe to the West ..." | en.wikipedia.org/wiki/Jewish_immigration_to_the_United_States |
| 1948–1951, "Mass immigration of Jews to the new State of Israel, 1948-1951: more than 680,000 immigrants arrived ..." | en.wikipedia.org/wiki/Aliyah |
| 1989–1999, "Great exodus of Jews from the former Soviet Union, from late 1989 and peaking in 1990-91 ..." | en.wikipedia.org/wiki/History_of_the_Jews_in_Russia |

So the sentence "`events.csv` has one type-4 row only" is out of date.

## Recommendation
**Do not add the three proposed events. Close the item.**
1. Update the M.10 sentence to say that the three waves are covered by existing events from `e2beaaa`.
2. Optionally, add DellaPergola as a second source on those three events. His migration figures (for example, about 1.2M of the ~1.9M who left the FSU in 1989–2021 went to Israel) are more authoritative than the Wikipedia pages.

## Why
- Adding the proposed rows would create duplicate events. The 2026-09-28 clean-up of `events.csv` had to merge 19 such duplicates.
- The existing events match the proposals in years and scope. The only difference is that the FSU event ends in 1999 instead of 2002. DellaPergola's 2002 is the end of his data, not of the wave, so 1999 is no worse.

## Basis
`git log` of the repository and the content of `events.csv`. No outside source.
