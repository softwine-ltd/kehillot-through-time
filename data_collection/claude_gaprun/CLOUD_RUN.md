# Cloud run of the coverage-gap collection

This folder lets a Claude Code cloud session continue the town-by-town collection that started locally on
2026-09-23. Nothing here is read by the website. Results are reviewed and merged into `kehilot.csv` by hand,
later, on `main`.

## Prompt for the cloud session

Start a cloud session on this repository, branch `claude-gaprun`, and paste:

> Work in `data_collection/claude_gaprun/`. Process every row of `queue.csv` whose status is `pending`, in
> batches of 6 towns in parallel. For each town, launch one subagent with this message:
> "Read and follow data_collection/claude_gaprun/BRIEF.md exactly. Town: <town>, <country> (<alt_name>).
> Coordinates: lon <lon>, lat <lat>. Output file name: city_data_<Town>_<Country>.csv (spaces -> _)."
> After each batch: check that each new CSV parses with exactly 9 columns per row, set those towns' status to
> `done` in `queue.csv` (or `failed` with a short reason), then commit the new files with a message like
> "Gap run: <towns>" and push to `claude-gaprun`. Do not modify any file outside this folder, and do not
> read `kehilot.csv`. When the queue is empty, write `CLOUD_SUMMARY.md` with one line per town: rows, rows
> with a number, year span, and anything a reviewer should check before merging.

## Files
- `BRIEF.md`: the per-town instructions each subagent follows.
- `historian_rules.txt`: the extraction rules, copied from the Historian prompt of the Gemini pipeline.
- `queue.csv`: towns 1-58 were done locally (`done-locally`); 59-91 are `pending`.
