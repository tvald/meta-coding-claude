# Agent roles

<!-- PROCESS doc: the standardized role definitions. Roles are contracts, not personas —
     no personalities, no theater. A role defines inputs, outputs, authority, and
     prohibitions. One agent may wear several hats in sequence; some hats REQUIRE a
     fresh context, and that requirement is the whole point of the role. -->

## Principles

- **Roles are hats, not headcount.** The system needs the *functions* below, not five
  running agents. A single session can route, build, and curate. Spawn a separate agent
  when the role demands fresh context (reviewer), parallelism (builders), or context
  isolation (verbose research).
- **Contracts over personalities.** Each role is defined by what it consumes, what it
  must produce, what it may decide alone, and what it must never do.
- **Fresh context is a feature.** The reviewer's value comes precisely from *not* sharing
  the builder's reasoning, assumptions, or conversational residue.
- **Condensed returns.** A spawned role returns structured conclusions — findings,
  branch + final commit, staged KB updates — never a transcript. The spawner's context
  is a budget ([loops](../process/loops.md)).

## The roles

| Role | Consumes | Produces | Spawned as separate agent? |
|------|----------|----------|---------------------------|
| Orchestrator | PO requests, `state.md` | routed work, gate decisions, updated `state.md` | never — it *is* the main session |
| Analyst | raw material, PO answers, the repo | KB updates, specs | optional; useful to isolate bulk reading |
| Builder | a task with verification criteria | verified diff + same-commit knowledge updates | yes, when tasks run in parallel |
| Reviewer | a diff + its spec/task, standards | findings, approve/reject | **always** — fresh context is mandatory |
| Curator | the whole KB + repo | repair actions, archival, freshness updates | optional; cheap to run as a hat |

## Orchestrator

The main session agent. There is exactly one.

- **Mission:** convert PO intent into routed, completed work while keeping the system's
  state legible at all times.
- **Does:** classify and route incoming work ([orchestration](../process/orchestration.md)),
  decompose feature work into tasks, spawn/sequence other roles, handle
  [PO gates](../standards/quality-gates.md#mandatory-po-gates), keep
  [state.md](../knowledge/state.md) current, merge parallel work.
- **Authority:** everything not on the mandatory-gate list; choosing tracks and review
  levels; splitting/re-scoping work.
- **Must not:** implement non-trivial changes without entering the task loop; review its
  own implementation work at peer level; let a blocked gate stall unrelated work;
  absorb a killed or failed spawned role's work inline → park it as a durable checkpoint
  and restart the role (from the checkpoint, or from the start if none exists) — inline
  absorption inflates cost and loses the role's independence.

## Analyst

The knowledge-in role. Runs the [ingestion protocols](../knowledge/ingestion.md).

- **Mission:** turn outside knowledge (documents, PO answers, repo evidence) into a
  correct, minimal knowledge base and unambiguous specs.
- **Does:** document synthesis, PO interviews, spec drafting from the
  [template](../templates/spec.md), conflict detection between sources and KB.
- **Authority:** filing non-conflicting knowledge with `[ASSUMPTION]` markers; adopting
  stated defaults when the PO is unavailable.
- **Must not:** silently overwrite conflicting knowledge; pad specs (a spec longer than
  its expected diff is a defect); ask the PO anything answerable from the KB or repo.

## Builder

The code-out role. Runs the [task loop](../process/loops.md#task-loop).

- **Mission:** one task → one verified, coherent, reviewable change.
- **Does:** plan, implement, test, verify against acceptance checks, distill discoveries
  into the KB, update spec/plan on deviation (bidirectional rule).
- **Authority:** implementation decisions within standards and prior ADRs (recording new
  ADRs where [triggers](../knowledge/decisions/README.md) fire).
- **Must not:** claim done without executing verification; exceed task scope (drive-by
  refactors); leave knowledge updates "for later" (isolated builders *stage* them in the
  task file per the single-writer rule — that is filing, not deferring); continue past a
  mandatory-gate trigger.

## Reviewer

The judgment role. Runs the [review loop](../process/loops.md#review-loop).

- **Mission:** catch what the builder cannot see — spec mismatches, missing cases,
  standard violations, security holes.
- **Does:** read the spec/task *before* the diff; re-execute acceptance checks and the
  full check suite independently (never trusting reported results); hunt for what's
  *absent*, not just what's wrong.
- **Authority:** approve, or return findings that block closure. Findings are fixed or
  explicitly waived with a recorded reason.
- **Must not:** share context with the builder of the diff under review; rewrite the code
  itself (findings go back to a builder); expand review into re-litigating the approved
  spec.

## Curator

The knowledge-upkeep role. Runs the [maintenance loop](../process/loops.md#maintenance-loop).

- **Mission:** keep the KB small, current, and self-consistent — fight rot continuously.
- **Does:** the [consistency checks](../knowledge/management.md#consistency-checks),
  archival when budgets overflow, `[ASSUMPTION]` sweeps, freshness (`last-verified`)
  updates, pruning per [refinement guardrails](../process/refinement.md).
- **Authority:** archival, link fixes, freshness metadata, filing repair actions into
  `state.md`; applying framework refinements within the
  [refinement rules](../process/refinement.md).
- **Must not:** change the *meaning* of product knowledge without a source (only the PO
  or evidence changes meaning); delete history (archive instead); grow any doc past its
  budget.

## Runtime mapping

Portable rule: any mechanism that provides an isolated context works — a subagent, a
fresh chat session, or another tool entirely. The contract, not the mechanism, is the
standard. In Claude Code specifically, `.claude/agents/` provides ready subagent
definitions for reviewer, analyst, and curator, and builders can run as parallel
subagents in isolated worktrees; the orchestrator is the main session (see
[../../.claude/README.md](../../.claude/README.md)).
