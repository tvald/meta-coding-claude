---
name: spec
description: Run the Feature track for a piece of work — draft the spec, get the PO gate, decompose into tasks. Use proactively when routed work lands on the Feature track, or when the PO describes a new capability.
argument-hint: [the feature, briefly — or a backlog/spec reference]
---

Run the **feature track** (`readme/process/orchestration.md#the-feature-track`) for
`$ARGUMENTS` — read it now, then execute its five steps. Operating notes:

- **Spec** — delegate drafting to the `analyst` subagent (target:
  `readme/work/specs/<slug>.md`, from `readme/templates/spec.md`). Pass everything the
  PO has said about this feature verbatim. If open questions remain that the KB can't
  answer, interview the PO per `readme/knowledge/ingestion.md#protocol-b-po-interview`
  before gating — the gate wants zero open questions.
- **Gate** — present the spec decision-ready (recommendation + notable alternatives).
  Record approval in the spec header. PO unavailable → park `⏳PO` in `state.md`,
  move to other work. Specs derived from a PO-authored document inherit approval for
  unchanged content — gate only the added interpretation.
- **Decompose** — task files in `readme/work/tasks/` with per-task verification derived
  from the spec's acceptance checks. **Commit them to the default branch before spawning
  any `builder` subagent** (isolated worktrees only see committed default-branch state).
- **Build and integrate** per orchestration: parallel only when actually independent;
  review before merge (`reviewer` subagent); merge sequentially re-running the suite;
  fold staged KB updates at merge; mark the spec `implemented` when its acceptance
  checks pass end-to-end.
