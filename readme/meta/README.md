# The framework

<!-- PROCESS doc: orientation. The entrypoint agents actually load is /AGENTS.md;
     this file is the human- and deep-dive-map of everything under readme/. -->

A markdown-only process framework for projects built by AI agents under a solo product
owner. It exists to solve the three failure modes of agentic development: **lost context**
(every session starts ignorant), **silent re-decisions** (choices get remade differently),
and **unverified velocity** (fast wrong code). It is portable — any agent that can read
files can follow it — with native harness [adapters](#adapters).

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

`readme/meta/` is the **framework core** — a project treats it as immutable; it changes
only via [refinement](process/refinement.md). Everything else under `readme/` is
**project state**, created from [`meta/seed/`](#deploy-bootstrap-reset) on first run and
deletable to reset.

```
AGENTS.md                     entrypoint: boot, routing, hard rules + LIVING Commands table
CLAUDE.md                     Claude Code shim (imports AGENTS.md)
readme/
  meta/                       THE FRAMEWORK (immutable to the project)
    process/                    HOW work flows
      orchestration.md            routing tracks, feature flow, parallelization, onboarding
      loops.md                    session/task/ingestion/review/maintenance/retro loops
      refinement.md               how the framework improves itself; self-modification limits
    knowledge/                  HOW knowledge is handled
      management.md               KB rules, budgets, freshness, consistency checks
      ingestion.md                document synthesis + PO interview protocols
      decisions.md                ADR triggers, who-decides, mechanics
    standards/                  HOW code is written
      engineering.md              durable ranked principles (stack-agnostic)
      quality-gates.md            definition of done, review levels, mandatory PO gates
      derivation.md               how derived.md and the Commands table get filled
    agents/roles.md             role contracts: orchestrator, analyst, builder, reviewer, curator
    work/README.md              conventions for specs, tasks, backlog, interviews
    templates/                  copy-to-use: spec, adr, task, retro, interview
    seed/                       pristine project-state tree — bootstrap/reset source
  knowledge/                  PROJECT STATE: what we know
    product.md                  vision, users, scope, constraints
    state.md                    the now: focus, next steps, dead ends (60-line cap)
    glossary.md                 domain terms
    decisions/                  ADR log: immutable decision history + index
  standards/derived.md        PROJECT STATE: this repo's stack, conventions, gotchas
  work/                       PROJECT STATE: what's in flight
    backlog.md                  known-but-not-now work, priority-ordered
    specs/ tasks/               feature specs; task files (created on demand)
    interviews/                 scratch worksheets, deleted after filing
  log/                        PROJECT STATE: trails
    framework-changelog.md      audit of framework self-modification
    retros.md                   retro entries, newest first (dated — schedules maintenance)
    archive/                    budget overflow + archived raw sources
.claude/                      Claude Code adapter: subagents + skills (see its README)
.agents/                      Codex adapter: Agent Skills (see its README)
```

Everything under `meta/` is PROCESS (or a TEMPLATE); everything else under `readme/` is
LIVING. Full taxonomy (including living sections inside PROCESS docs and AGENTS.md
summaries): [management.md](knowledge/management.md#doc-taxonomy).

## Adapters

A harness adapter is native wiring — subagents, skills, prompts, declarative config —
that binds one agent runtime to the framework's contracts. Current instances:
[`.claude/`](../../.claude/README.md) (Claude Code) and
[`.agents/`](../../.agents/README.md) (Codex / any Agent Skills-compatible harness).
Every adapter, present or future, is bound by this contract:

1. **Adapters never own process semantics.** Loops, gates, role contracts, and
   definitions of done live in `readme/meta/`. Adapter files may condense them for
   inline use (spawned agents don't inherit context), but every restatement is a
   summary in the [management.md](knowledge/management.md#doc-taxonomy) sense: the
   canonical doc wins on conflict and the summary is re-synced in the same commit.
   What adapters *do* own: harness bindings — tool lists, model choices, isolation
   modes, invocation shapes.
2. **Markdown and declarative config only, as shipped.** No executable code, no
   dependencies. Anything executable (hooks, scripts) is opt-in, installed only on
   explicit PO approval (typically at onboarding), and never a precondition for the
   framework to function.
3. **No permission expansion.** Adapter tool grants may only restrict, never widen,
   what the harness gives the main session; hooks that deny are fine. Widening an
   agent's permissions is a gate-4 change and routes Feature track (`AGENTS.md`).
4. **Optional binding of mandatory contracts.** The framework must run without any
   adapter — another harness satisfies the same contracts differently
   ([runtime mapping](agents/roles.md#runtime-mapping)). Within its harness, an
   adapter's binding of a mandatory contract is the required way to satisfy it (e.g.
   the reviewer subagent for fresh-context review in Claude Code): "optional" is about
   portability, never a license to skip the contract.
5. **Removable without loss.** Deleting an adapter directory must leave `AGENTS.md` +
   `readme/` complete and self-consistent — core docs may point to adapters as
   conveniences, never as the only home of a rule. This is the audit test for 1 and 4;
   the [maintenance loop](process/loops.md#maintenance-loop) checks it.

Adapter files are PROCESS docs: they change via [refinement](process/refinement.md) and
are logged in the framework changelog.

## Deploy, bootstrap, reset

The framework is a self-contained add-on to any repository.

- **Deploy:** copy `AGENTS.md` and `readme/meta/` into the target repo. For Claude Code,
  also copy `.claude/` and a `CLAUDE.md` containing the single line `@AGENTS.md` (skip
  or merge if the repo already has one). For Codex (or any Agent Skills-compatible
  harness), also copy `.agents/` — no shim file; Codex reads `AGENTS.md` natively.
  Nothing else is required — state bootstraps itself.
- **Bootstrap (first run, automatic):** boot step 1 detects that
  `readme/knowledge/state.md` does not exist. Copy the contents of `readme/meta/seed/`
  into `readme/` (producing `readme/knowledge/`, `readme/standards/derived.md`,
  `readme/work/`, `readme/log/`), verify the repo-root `AGENTS.md` has its Commands
  table (unfilled), commit per the project's Git policy, then proceed — boot step 2
  finds `product.md` unfilled and triggers
  [onboarding](process/orchestration.md#onboarding).
- **Reset (start a new project on the same seed):** delete `readme/knowledge/`,
  `readme/standards/derived.md`, `readme/work/`, and `readme/log/`; blank the Commands
  table rows in `AGENTS.md` (and any project additions to its living sections). The next
  session bootstraps fresh. Deleting project state is irreversible outside git — gate 2
  applies: a reset is PO-ordered, never agent-initiated.

## Reading order

- **An agent starting a session** reads the repo-root `AGENTS.md` →
  `readme/knowledge/state.md`, then only what its routed work requires. That's the
  point — don't read everything.
- **A human evaluating the framework**: this file →
  [orchestration](process/orchestration.md) → [loops](process/loops.md) →
  [quality-gates](standards/quality-gates.md) → [management](knowledge/management.md) →
  [refinement](process/refinement.md).
