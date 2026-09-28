# Cloud run 2: Ukrainian and Belarusian towns with few or no population counts

Thirty towns in Ukraine and Belarus that had at least 1,000 Jews at their peak but two or fewer counts in
`kehilot.csv`, taken largest first. Nothing here is read by the website. Results are checked and merged into
`kehilot.csv` by hand, later, on `main`.

## Prompt for the cloud session

Start a cloud session on this repository, branch `claude-gaprun2`, and paste:

> Work in `data_collection/claude_gaprun2/`. Process every row of `queue.csv` whose status is `pending`, in batches
> of 6 towns in parallel, and no other towns. For each town, launch one subagent with this message:
> "Read and follow data_collection/claude_gaprun2/BRIEF.md exactly. Town: <town>, <country> (<alt_name>).
> Coordinates: lon <lon>, lat <lat>. Output file name: city_data_<Town>_<Country>.csv (spaces -> _)."
> After each batch: check that each new CSV parses with exactly 9 columns per row and that every row has a numeric
> Year of Data, set those towns' status to `done` in `queue.csv` (or `failed` with a short reason), commit the new
> files with a message like "Gap run 2: <towns>" and push to `claude-gaprun2`. Do not modify any file outside this
> folder, and do not read `kehilot.csv`. If you hit a usage or credit limit, stop and report what is done; do not
> retry. When the queue is empty, review the results yourself against the rules in `BRIEF.md` (regional or
> district figures in Population, counts of one group only, upper bounds, undated rows, a founding year earlier
> than the earliest documented presence, community estimates far above a census of the same period): move
> rule-breaking figures to Notes and tag each edited row `[Review fix: ...]`, delete rows that record no presence.
> Then write `CLOUD_SUMMARY.md` with one line per town (rows, rows with a number, year span, anything a reviewer
> should check before merging) and the conventions you applied.

## Files
- `BRIEF.md`: the per-town instructions each subagent follows (with a section for Ukrainian and Belarusian towns).
- `historian_rules.txt`: the extraction rules, copied from the Historian prompt of the Gemini pipeline.
- `queue.csv`: the 30 towns, all `pending`, with coordinates and alternative names.
