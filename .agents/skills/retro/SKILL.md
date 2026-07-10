---
name: retro
description: Run a retro — cheap 3-bullet form at task/session end, deep form after failures. Use proactively when closing a session, when the PO corrects the process, when verification passed but the result was wrong, or when a loop badly overran.
---

Run the **retro loop** (`readme/meta/process/loops.md#retro-loop`) for the trigger/scope
given at invocation (default: the current session).

- **Cheap form** (the default): three short fields — what happened / gap / change
  made — dated, inserted at the top of `readme/log/retros.md` per
  `readme/meta/templates/retro.md`. Fires once per session at close, plus at any loop
  exit that actually found a gap. "Gap: none" is an honest outcome; don't inflate.
  **PO corrections always get an entry tagged `[correction]`** — grep `retros.md` (and
  its archive) for a prior entry on the same topic first; a repeat escalates to the
  deep form with a mandatory rule change.
- **Deep form** (on its triggers — check the loop doc): reconstruct believed-vs-true,
  locate the doc or loop that should have prevented it, then apply the fix through the
  **refinement procedure** in `readme/meta/process/refinement.md` — smallest edit,
  effective form (prohibition+alternative / decision table / example), changelog entry
  in `readme/log/framework-changelog.md`, same commit. Respect the self-modification
  limits: gate-list and authority changes are `⏳PO`.

Exit rule: every non-empty gap produced a concrete change or an explicit
"accepted: not worth fixing because …". Awareness is not a change.
