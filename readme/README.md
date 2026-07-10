# The framework

<!-- PROCESS doc: orientation. The entrypoint agents actually load is /AGENTS.md;
     this file is the human- and deep-dive-map of everything under readme/. -->

A markdown-only process framework for projects built by AI agents under a solo product
owner. It exists to solve the three failure modes of agentic development: **lost context**
(every session starts ignorant), **silent re-decisions** (choices get remade differently),
and **unverified velocity** (fast wrong code). It is portable — any agent that can read
files can follow it — with a native [Claude Code adapter](../.claude/README.md).

## Design principles

1. **The entrypoint is a map, not the territory.** `AGENTS.md` stays under ~150 lines;
   detail docs load on demand.
2. **Proportional ceremony.** A typo fix and a new subsystem get different processes
   (routing tracks). Ceremony that doesn't reduce risk for *this* work is skipped.
3. **One home per fact; links elsewhere.** Duplication is how docs learn to contradict
   each other.
4. **Knowledge updates ride the commit that made them true.** Separate doc chores never
   happen; this is the only drift prevention that survives contact with reality.
5. **Autonomy between gates.** Agents decide everything not on the short mandatory-gate
   list; the PO audits asynchronously through git, ADRs, and the changelog.
6. **Artifacts must pay rent.** Every document either carries state across sessions or
   gets deleted. Stale is worse than absent.
7. **The framework edits itself** — with an audit trail, and without authority to widen
   its own autonomy.

## Structure

```
AGENTS.md                     entrypoint: boot, commands, routing, hard rules (always loaded)
CLAUDE.md                     Claude Code shim (imports AGENTS.md)
readme/
  process/                    HOW work flows
    orchestration.md            routing tracks, feature flow, parallelization, onboarding
    loops.md                    session/task/ingestion/review/maintenance/retro loops
    refinement.md               how the framework improves itself; self-modification limits
  knowledge/                  WHAT we know (the knowledge base)
    management.md               KB rules, budgets, freshness, consistency checks
    ingestion.md                document synthesis + PO interview protocols
    product.md        LIVING    vision, users, scope, constraints
    state.md          LIVING    the now: focus, next steps, dead ends (60-line cap)
    glossary.md       LIVING    domain terms
    decisions/        LIVING    ADR log: immutable decision history + index
  standards/                  HOW code is written
    engineering.md              durable ranked principles (stack-agnostic)
    derived.md        LIVING    this repo's stack, conventions, gotchas (+ derivation procedure)
    quality-gates.md            definition of done, review levels, mandatory PO gates
  agents/
    roles.md                    role contracts: orchestrator, analyst, builder, reviewer, curator
  work/                       WHAT'S IN FLIGHT (conventions in its README)
    backlog.md        LIVING    known-but-not-now work, priority-ordered
    specs/            LIVING    feature specs (Feature track)
    tasks/            LIVING    task files: verification criteria + review records
    interviews/       scratch   worksheets, deleted after filing
  templates/                  copy-to-use: spec, adr, task, retro, interview
  log/                        LIVING trails
    framework-changelog.md      audit of framework self-modification
    retros.md                   retro entries, newest first (dated — schedules maintenance)
    archive/                    budget overflow + archived raw sources
.claude/                      Claude Code adapter: subagents + skills (see its README)
```

**PROCESS docs** (unmarked above) belong to the framework and change only via
[refinement](process/refinement.md). **LIVING docs** belong to the project and change
constantly under [management rules](knowledge/management.md). **Templates** are
PROCESS-owned copy-sources. Full taxonomy (including living sections inside PROCESS docs
and AGENTS.md summaries): [management.md](knowledge/management.md#doc-taxonomy).

## Reading order

- **An agent starting a session** reads the repo-root `AGENTS.md` → `knowledge/state.md`, then only
  what its routed work requires. That's the point — don't read everything.
- **A human evaluating the framework**: this file →
  [orchestration](process/orchestration.md) → [loops](process/loops.md) →
  [quality-gates](standards/quality-gates.md) → [management](knowledge/management.md) →
  [refinement](process/refinement.md).
- **Seeding a new project**: copy `AGENTS.md`, `CLAUDE.md`, `readme/`, and `.claude/`
  into the repo, then start any agent session — boot step 2 triggers
  [onboarding](process/orchestration.md#onboarding) automatically.
