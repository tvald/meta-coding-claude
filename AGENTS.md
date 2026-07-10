# AGENTS.md

This project is developed by AI agents directed by a product owner (PO), following the
process framework in `readme/`. This file is the always-loaded entrypoint: boot steps,
commands, routing, and hard rules. Everything else is read on demand via
[the map](#the-map). Sections here marked *(summary)* condense a canonical doc — on any
conflict, the canonical doc wins and the summary must be re-synced in the same commit.
Keep this file under ~150 lines (see `readme/meta/process/refinement.md`).

## Boot

1. Read `readme/knowledge/state.md`. If it doesn't exist, this is a fresh deploy —
   bootstrap the state tree from `readme/meta/seed/` first
   ([procedure](readme/meta/README.md#deploy-bootstrap-reset)). If it disagrees with
   recent `git log` (a crashed session didn't close), reconcile it from git before
   anything else. A dirty working
   tree is evidence to investigate, not proof of ownership: inspect the diff; resume it
   only if a task file, branch, or `state.md` identifies it as interrupted agent work;
   otherwise preserve it untouched and work around it (ask only on overlap).
2. If `readme/knowledge/product.md` is missing or unfilled → run
   [onboarding](readme/meta/process/orchestration.md#onboarding) first. Exception: a small
   concrete PO request (Quick/Standard track) may be served before onboarding; Feature
   work may not.
3. Route the work using the table below; run the matching loop from
   `readme/meta/process/loops.md`.
4. Before ending a session: update `state.md`, commit (or the checkpoint the project's
   Git policy allows — `readme/meta/process/orchestration.md#integration-mechanics`), retro
   (`readme/meta/process/loops.md#retro-loop`).

## Commands

Exact invocations for this repo, verified by execution. Filled during onboarding by the
[derivation procedure](readme/meta/standards/derivation.md). This table is
the **only home for commands** — other docs link here.

*Unfilled — run onboarding.*

| Action | Command |
|--------|---------|
| install | — |
| build | — |
| test (all) | — |
| test (single) | — |
| lint + format | — |
| type check | — |
| run locally | — |
| audit (deps/vulns) | — |

## Routing *(summary — canonical: [orchestration](readme/meta/process/orchestration.md#routing))*

When torn between tracks, take the lighter — unless a mandatory PO gate 2–4 trigger is
present (gate 1 only applies once work is Feature-tracked).

| Work looks like | Track | Ceremony |
|-----------------|-------|----------|
| typo, doc fix, config tweak, obvious one-line fix | Quick | task loop, self-review |
| behavior change, requirements already clear | Standard | task loop + written checks + peer review |
| new capability, ambiguity, PO would care about shape | Feature | spec → ⏳PO gate → tasks |
| documents/answers/knowledge to process | Knowledge | ingestion loop |
| upkeep, refactors, consistency repairs | Maintenance | maintenance loop |

Changes that **alter behavior** of auth/authorization, secrets or credential handling,
payments, personal or regulated data, stored-data formats, external contracts, or the
permissions of agents/CI/infrastructure → always Feature track. Non-behavioral edits in
those areas route normally but get peer review minimum.

## Hard rules

1. **Done means verified.** Execute the checks and watch them pass before claiming
   completion — never report "should work". Full definition:
   [quality gates](readme/meta/standards/quality-gates.md#definition-of-done).
2. **PO gates are exhaustive and few** *(summary — canonical:
   [quality-gates](readme/meta/standards/quality-gates.md#mandatory-po-gates))*. Proceed
   autonomously except: feature spec approval; irreversible or externally visible
   actions (deploys, migrations on real data, deleting data, publishing, spending,
   communications, granting access); release; security-sensitive approach. Park gated
   items as `⏳PO` in `state.md` and keep working on other things.
3. **Knowledge rides the same commit.** Decisions → ADR, terms → glossary, conventions
   and gotchas → `readme/standards/derived.md`, deviations → the spec/plan itself,
   `state.md` kept current. Never "update docs later". (Isolated builders stage instead —
   see [quality gates](readme/meta/standards/quality-gates.md#definition-of-done), item 4.)
4. **Don't re-decide silently.** Before architectural choices or new dependencies, skim
   the [decision index](readme/knowledge/decisions/README.md); to change a recorded
   decision, write a superseding ADR.
5. **Code is truth about *what is*; docs are truth about *intent*.** On contradiction,
   reconcile immediately — fix the doc, or flag drifted code in `state.md`.
6. **No drive-by changes** → out-of-scope improvements become backlog/`state.md`
   entries, not edits in the current diff.
7. **No unrecorded failure** → abandoned approaches go to `state.md` *Known dead ends*
   so no agent retries them.

## The map

| Read | When |
|------|------|
| `readme/knowledge/state.md` | every session start (and update at close) |
| `readme/meta/work/README.md` | creating/finding specs, tasks, backlog items |
| `readme/meta/process/orchestration.md` | routing, decomposition, parallel work, onboarding |
| `readme/meta/process/loops.md` | running any loop: session, task, review, ingestion, maintenance, retro |
| `readme/meta/standards/quality-gates.md` | what "done" means; review levels; PO gates |
| `readme/meta/standards/engineering.md` + `derived.md` | before writing code |
| `readme/knowledge/glossary.md` | before using domain terms in specs or code |
| `readme/meta/knowledge/management.md` | first time you write to a knowledge file |
| `readme/meta/knowledge/ingestion.md` | processing PO material or interviewing |
| `readme/meta/agents/roles.md` | spawning or acting as analyst/builder/reviewer/curator |
| `readme/meta/process/refinement.md` | improving this process; changing any rule |
| `readme/meta/README.md` | orientation to the whole framework; deploy/bootstrap/reset |

## Self-maintenance

This framework maintains itself: PO feedback and observed gaps become direct edits to
these docs, logged in `readme/log/framework-changelog.md`
([procedure](readme/meta/process/refinement.md)). Every PO correction gets a `[correction]`
retro entry; a repeat of a recorded correction makes a rule change mandatory.
