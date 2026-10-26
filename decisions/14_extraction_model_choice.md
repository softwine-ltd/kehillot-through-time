# 14 — Which model the Gemini pipeline's Historian should use

## Source of the task
`DATA_COLLECTION_PIPELINE.md`, status update 2026-09-20 (late) and its 2026-09-21 validation, lines 715–807. Question asked: "what would cost less than Gemini 3.1 Pro ... without losing accuracy?" The section ends with a bottom line, but leaves the switch to the owner (`HISTORIAN_MODEL` in `.env`):

> *Do not switch the production default.* ... 3.8 Flash at default thinking is close — −63% cost, 0.93 precision, ≈ Pro-level rule violations — and is a reasonable opt-in for **ordinary small-town bulk runs** with the notes/context gate and Pro re-runs of flagged towns; keep **large cities and camp/massacre sites on Pro**.

The doc also notes a deadline: 3.8 Flash is on promotional pricing until **2026-12-31**. From 2027-01-01 the default-thinking cost roughly doubles, to about $0.16 per town, only about 27% below Pro.

## Recommendation
**Keep Pro as the default. Use Flash only if a large Gemini batch of small towns is planned before 31 December 2026. Otherwise, close the question.**
- Since 2026-09-23, most new data has come from Claude sub-agents and structured tables (sections 1–2 of the 2026-10-15 update, and the 2026-10-17/18 run), not from the Gemini pipeline. The Gemini backlog left is small: the 94 towns without numbers, for which the doc says "different sources would be needed", not a cheaper model.
- If such a batch does run before the end of the year, follow the doc's own recipe: `HISTORIAN_MODEL=gemini-3.8-flash`, default thinking, the notes/context gate, Pro re-runs of flagged towns. Keep cities and camp sites on Pro.
- After 1 January 2027 the saving shrinks to about 27%. That is not worth a known ~12% recall loss on large towns.

## Why
- The benchmark is sound (30 + 101 towns, adjudicated against source text) and its conclusion holds. The only thing that changed since is that the pipeline is now rarely used, which makes the cost saving small in absolute terms.
- A lower-recall extractor is a poor trade for this project, where the main quality problem is wrong numbers (`DATA_ERRORS_REPORT.md`), not cost.

## Basis
The project's documents only. I did not check current Gemini prices or model availability. Prices and promotion dates are as the doc states them.
