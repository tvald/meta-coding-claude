---
name: retro
description: Run a retro — cheap 3-bullet form at task/session end, deep form after failures. Use proactively when closing a session, when the PO corrects the process, when verification passed but the result was wrong, or when a loop badly overran.
argument-hint: [trigger/scope, e.g. "session" or "the failed migration task"]
---

Run the **retro loop** (`readme/process/loops.md#retro-loop`) for `$ARGUMENTS` (default:
the current session).

- **Cheap form** (the default): three bullets — what happened / gap / change made —
  appended to `readme/log/retros.md` per `readme/templates/retro.md`. "Gap: none" is the
  common, honest outcome. Under two minutes; do not inflate.
- **Deep form** (on its triggers — check the loop doc): reconstruct believed-vs-true,
  locate the doc or loop that should have prevented it, then apply the fix through the
  **refinement procedure** in `readme/process/refinement.md` — smallest edit, effective
  form (prohibition+alternative / decision table / example), changelog entry in
  `readme/log/framework-changelog.md`, same commit. Respect the self-modification
  limits: gate-list and authority changes are `⏳PO`.

Exit rule: every non-empty gap produced a concrete change or an explicit
"accepted: not worth fixing because …". Awareness is not a change.
