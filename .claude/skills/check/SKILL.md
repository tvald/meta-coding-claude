---
name: check
description: Consistency audit of the knowledge base and framework — docs vs code, docs vs docs, budgets, freshness, dead rules. Use proactively after ~10 closed tasks, when docs smell stale, or when idle.
argument-hint: [optional scope, e.g. "commands only" or a doc path]
---

Run the **maintenance loop** (`readme/process/loops.md#maintenance-loop`), scoped by
`$ARGUMENTS` if given. Delegate to the `curator` subagent unless the scope is trivial —
the audit's bulk reading doesn't belong in the main context.

Ensure whoever runs it covers, from `readme/knowledge/management.md#consistency-checks`:
symbol check, anchor check, contradiction check, command check (actually execute the
Commands table in `/AGENTS.md`), assumption sweep — plus budget enforcement and the
framework pruning pass (`readme/process/refinement.md#pruning`).

On completion, relay: repairs applied (commits), items queued in `state.md`, docs
re-verified, and any *systemic* finding — the same rot recurring is a refinement signal,
so route it to `/retro` (deep form) rather than just patching instances.
