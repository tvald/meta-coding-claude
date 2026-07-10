---
name: check
description: Consistency audit of the knowledge base and framework — docs vs code, docs vs docs, budgets, freshness, retro patterns, dead rules. Use proactively when the dated entries in readme/log/retros.md show the last maintenance run is over ~2 weeks or ~10 task closes old, when docs smell stale, or when idle.
argument-hint: [optional scope, e.g. "commands only" or a doc path]
context: fork
agent: curator
---

Run the **maintenance loop** (`readme/process/loops.md#maintenance-loop`) — read it now
and execute every step, scoped by `$ARGUMENTS` if given:

1. The consistency checks in `readme/knowledge/management.md#consistency-checks`:
   symbol check, anchor check, contradiction check, command check (actually execute the
   Commands table in the repo-root `AGENTS.md`; verify long-running commands start
   cleanly, then terminate them), assumption sweep.
2. Budget enforcement per `readme/knowledge/management.md` — including *Next steps*
   overflow to the backlog and dead-end graduation to `derived.md` *Gotchas*.
3. Read `readme/log/retros.md` since the last maintenance entry: recurring gaps,
   repeated `[correction]` tags, recurring review-finding classes in task files → apply
   `readme/process/refinement.md` for each.
4. Framework pruning per `readme/process/refinement.md#pruning`.
5. Doc hygiene: broken links, dead references, retired specs/tasks to archive.

Apply trivial repairs immediately (one small commit each); queue the rest in `state.md`
*Next steps*; update `last-verified` on every doc actually verified. Close by adding a
dated maintenance retro entry to `readme/log/retros.md` (this entry is the scheduler for
the next run).

Return: checks run, repairs applied (with commits), items queued, docs re-verified, and
any *systemic* finding stated as a refinement signal.
