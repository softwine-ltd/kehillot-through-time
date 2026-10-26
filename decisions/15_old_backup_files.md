# 15 — The ~40 GB of `kehilot_backup_*.csv` files

## Source of the task
`DATA_COLLECTION_PIPELINE.md`:
- Line 1405: "By 2026-10-26 there were 956 such files (about 40 GB). Every committed state is in git (`git show <commit>:kehilot.csv`), so only the backups newer than the last commit are needed; the rest can be deleted."
- Line 1385: the backups "are git-ignored now; only the newest five stay in the repo folder, older ones were moved to `AnacondaProjects/python_310/jew_hist/kehilot_backups_archive/`."

The files are on the owner's computer (OneDrive folder), not in this repository. Deleting them is the owner's decision.

## Recommendation
**Delete every backup older than the latest commit of `kehilot.csv`, after one check. Then stop OneDrive from syncing the backup folder.**
1. Check: `git log -1 --format=%ci -- kehilot.csv` gives the time of the last committed change. Every backup older than that is a state that git can reproduce. A backup is taken *before* a step, so the state it holds is the one already committed or the one about to be overwritten in the same session.
2. Keep the backups newer than that commit (uncommitted work in progress), plus the newest five as a convenience.
3. Exclude `kehilot_backups_archive/` and the backup pattern from OneDrive sync, or move the folder outside OneDrive. 40 GB of sync is the real cost here.
4. Optional: make the merge scripts delete their own backup after a successful commit, or keep only the last N. That stops the folder from growing back.

## Why
- The only state not in git is work done after the last commit. That is exactly what the newest backups cover.
- Each backup is a full copy of `kehilot.csv`, which is now about 65 MB. They add no history that `git` does not already hold, compressed.
- One caution: if any backup was made from a state that was never committed (a session that was abandoned), it is the only copy of that state. If in doubt, compress the archive folder once (`zip` reduces CSV text to about a tenth), keep it for a month, then delete it.

## Basis
The project's documents. The sync advice is general knowledge, not from a source.
