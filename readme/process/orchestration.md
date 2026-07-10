# Orchestration

<!-- PROCESS doc: the root process. How incoming work is classified, routed, decomposed,
     parallelized, and gated. Run by the orchestrator (the main session agent). -->

The orchestrator's job is a balance: **maximum velocity the quality gates allow**.
Ceremony must pay rent — a process step that doesn't reduce risk or rework for *this*
piece of work gets skipped, by routing, not by improvisation.

## Routing

Classify every incoming piece of work — a PO request, a `state.md` next-step, a
discovered defect — into a track. When torn between two tracks, take the lighter one
unless a [mandatory-gate trigger](../standards/quality-gates.md#mandatory-po-gates) is
present; mid-flight upgrade is cheap (see [Escalation](#escalation)).

| Track | When | Process | Review level |
|-------|------|---------|--------------|
| **Quick** | no behavior change, or a trivial fix an expert would make without discussion (typo, doc fix, config tweak, obvious one-line bug) | [task loop](loops.md#task-loop), plan step may be mental | self |
| **Standard** | behavior changes, but requirements are unambiguous enough to write acceptance checks directly into the task | task loop with written verification criteria | peer |
| **Feature** | new capability, ambiguity about *what*, or the PO would care how it's shaped | spec → **⏳PO gate** → decompose into tasks → task loops | peer; gated where mandatory |
| **Knowledge** | material to ingest, questions to resolve, KB gaps | [ingestion loop](loops.md#ingestion-loop) | confirmation per protocol |
| **Maintenance** | upkeep with no product-visible change: consistency repairs, refactors, dependency updates | [maintenance loop](loops.md#maintenance-loop) or task loop | self (peer if behavior could change) |

Signals that force the **feature** track regardless of apparent size: touching auth,
payments, PII, stored-data formats, or external contracts; any mandatory-gate trigger;
genuine uncertainty about what the PO wants.

## The feature track

1. **Spec** — the analyst drafts from the [template](../templates/spec.md), running an
   [interview](../knowledge/ingestion.md#protocol-b-po-interview) only if the KB can't
   answer the open questions. Target: spec shorter than the diff it will produce. Zero
   open questions at approval.
2. **PO gate** — the one unskippable human review. Present decision-ready: the spec, the
   recommendation, notable alternatives. This is where the PO's attention buys the most
   quality per minute.
3. **Decompose** — split into S/M tasks with per-task verification derived from the
   spec's acceptance checks. Order by dependency; identify what can run in parallel.
4. **Build** — task loops, parallel where independent (below).
5. **Integrate** — after all tasks close: run the full suite on the combined result,
   execute the spec's acceptance checks end-to-end, mark the spec `implemented`.

**Bidirectional rule (applies on every track):** the moment reality diverges from a spec
or plan — an approach fails, a requirement turns out wrong, a better option appears —
the doc is updated in the same commit as the divergence. If the divergence changes what
an approved spec *promises*, that's a new ⏳PO item, not a silent reinterpretation.

## Escalation

Tracks are provisional. Upgrade the moment you're surprised:

- A quick fix reveals a real design question → standard/feature.
- A standard task's acceptance checks can't be written unambiguously → feature (the
  ambiguity *is* the missing spec).
- Any task that turns out L-sized → stop, split into S/M tasks, re-route each.
- Two failed approaches on one task → stop, reconsider the routing and the spec.

Downgrades are allowed too: a feared-complex change that turns out mechanical proceeds
as standard. Note track changes in the task; no ceremony.

## Parallelization

Run work in parallel when it is *actually independent*: disjoint files/subsystems, no
shared unresolved spec questions, no ordering dependency.

- **Builders** run as isolated agents (in Claude Code: subagents, worktree isolation for
  file mutations). Each gets a self-contained task doc — assume the builder knows
  *nothing* beyond the KB and the task.
- **Single-writer KB:** parallel builders stage knowledge updates in their task docs;
  the orchestrator (or curator) folds them into the KB at merge time. Two agents editing
  `state.md` concurrently is a conflict factory.
- **Merge sequentially,** re-running the check suite after each merge, not once at the end.
- **Analysis parallelizes freely** — read-only research/exploration agents can always
  fan out.
- Don't parallelize to feel fast: two dependent tasks run in parallel produce rework,
  which is slower than the queue.

## Gates in practice

Mechanics in [quality-gates.md](../standards/quality-gates.md#mandatory-po-gates). The
orchestration rules: a gated item is *parked, not blocking* — record it `⏳PO` in
`state.md`, present it decision-ready, continue with other work. Batch gate requests
when several are pending; one decision-ready message beats four interruptions.

## Onboarding

The first run in a project — triggered when `product.md` is unfilled.

1. **Inventory** — is there code? existing docs (README, wikis, old CLAUDE.md)? CI?
2. **Existing repo:** survey the codebase (structure, stack, entry points, test state) →
   run the [derivation procedure](../standards/derived.md#derivation-procedure) →
   ingest existing docs via [Protocol A](../knowledge/ingestion.md#protocol-a-document-synthesis)
   (existing docs are *sources*, not truth — reconcile against code) → draft
   `product.md` from evidence, everything `[ASSUMPTION]`-marked.
3. **Greenfield:** nothing to derive — go straight to interview.
4. **Interview** ([Protocol B](../knowledge/ingestion.md#protocol-b-po-interview)) —
   confirm the drafted `product.md`, resolve conflicts found in step 2, and ask the
   onboarding-specific questions: what does "release" mean here (defines gate 3)? any
   additions to the mandatory-gate list? preferred cadence for PO check-ins?
5. **Seed state** — populate `state.md` with the first *Next steps*; record stack ADRs
   for greenfield choices; commit everything.

Onboarding ends when `product.md` has no unfilled sections and the Commands table in
`/AGENTS.md` is verified. Defer anything else to normal loops.
