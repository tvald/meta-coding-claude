# AGENTS.md

This project is developed by AI agents directed by a product owner (PO), following the
process framework in `readme/`. This file is the always-loaded entrypoint: boot steps,
routing, and hard rules. Everything else is read on demand via [the map](#the-map) —
keep this file under ~150 lines (see `readme/process/refinement.md`).

## Boot

1. Read `readme/knowledge/state.md` — current focus, next steps, known dead ends.
2. If `readme/knowledge/product.md` is unfilled → run
   [onboarding](readme/process/orchestration.md#onboarding) first.
3. Route the work using the table below; run the matching loop from
   `readme/process/loops.md`.
4. Before ending a session: update `state.md`, commit, 3-bullet retro
   (`readme/log/retros.md`).

## Commands

<!-- Filled during onboarding by the derivation procedure
     (readme/standards/derived.md#derivation-procedure). Exact invocations, verified by
     execution. This is the ONLY home for commands — other docs link here. -->

*Unfilled — run onboarding.*

| Action | Command |
|--------|---------|
| install | — |
| build | — |
| test (all) | — |
| test (single) | — |
| lint + format | — |
| run locally | — |

## Routing

Full definitions: [orchestration](readme/process/orchestration.md). When torn between
tracks, take the lighter — unless a mandatory PO gate trigger is present.

| Work looks like | Track | Ceremony |
|-----------------|-------|----------|
| typo, doc fix, trivial obvious fix | Quick | task loop, self-review |
| behavior change, requirements already clear | Standard | task loop + written checks + peer review |
| new capability, ambiguity, PO would care about shape | Feature | spec → ⏳PO gate → tasks |
| documents/answers/knowledge to process | Knowledge | ingestion loop |
| upkeep, refactors, consistency repairs | Maintenance | maintenance loop |

Auth, payments, PII, stored-data formats, external contracts → always Feature track.

## Hard rules

1. **Done means verified.** Execute the checks and watch them pass before claiming
   completion — never report "should work". Full definition:
   [quality gates](readme/standards/quality-gates.md#definition-of-done).
2. **PO gates are exhaustive and few.** Proceed autonomously except: feature spec
   approval; irreversible or externally visible actions (deploys, migrations on real
   data, publishing, spending, communications); release; security-sensitive approach.
   Park gated items as `⏳PO` in `state.md` and keep working on other things.
3. **Knowledge rides the same commit.** Decisions → ADR, terms → glossary, conventions
   and gotchas → `readme/standards/derived.md`, deviations → the spec/plan itself,
   `state.md` kept current. Never "update docs later".
4. **Don't re-decide silently.** Before architectural choices or new dependencies, skim
   the [decision index](readme/knowledge/decisions/README.md); to change a recorded
   decision, write a superseding ADR.
5. **Code is truth about *what is*; docs are truth about *intent*.** On contradiction,
   reconcile immediately — fix the doc, or flag drifted code in `state.md`.
6. **No drive-by changes** → out-of-scope improvements become entries in `state.md`
   *Next steps*, not edits in the current diff.
7. **No unrecorded failure** → abandoned approaches go to `state.md` *Known dead ends*
   so no agent retries them.

## The map

| Read | When |
|------|------|
| `readme/knowledge/state.md` | every session start (and update at close) |
| `readme/process/orchestration.md` | routing, decomposition, parallel work, onboarding |
| `readme/process/loops.md` | running any loop: task, review, ingestion, maintenance, retro |
| `readme/standards/quality-gates.md` | what "done" means; review levels; PO gates |
| `readme/standards/engineering.md` + `derived.md` | before writing code |
| `readme/knowledge/management.md` | before writing to any knowledge file |
| `readme/knowledge/ingestion.md` | processing PO material or interviewing |
| `readme/agents/roles.md` | spawning or acting as analyst/builder/reviewer/curator |
| `readme/process/refinement.md` | improving this process; changing any rule |
| `readme/README.md` | orientation to the whole framework |

## Self-maintenance

This framework maintains itself: PO feedback and observed gaps become direct edits to
these docs, logged in `readme/log/framework-changelog.md`
([procedure](readme/process/refinement.md)). PO corrections are mandatory refinement
signals — the second correction of the same thing means a rule must change.
