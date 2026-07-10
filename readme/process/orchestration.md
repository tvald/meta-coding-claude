# Orchestration

<!-- PROCESS doc: the root process. How incoming work is classified, routed, decomposed,
     parallelized, and gated. Run by the orchestrator (the main session agent). -->

The orchestrator's job is a balance: **maximum velocity the quality gates allow**.
Ceremony must pay rent — a process step that doesn't reduce risk or rework for *this*
piece of work gets skipped, by routing, not by improvisation.

## Routing

This table is the **canonical** routing rule (the repo-root `AGENTS.md` carries a summary). Classify
every incoming piece of work — a PO request, a `state.md` next-step, a backlog item, a
discovered defect — into a track. When torn between two tracks, take the lighter one
unless a [mandatory gate](../standards/quality-gates.md#mandatory-po-gates) **2–4**
trigger is present (gate 1, spec approval, applies only after work is Feature-tracked and
cannot force the track); mid-flight upgrade is cheap (see [Escalation](#escalation)).

| Track | When | Process | Review level |
|-------|------|---------|--------------|
| **Quick** | no behavior change, or a trivial fix an expert would make without discussion (typo, doc fix, config tweak, obvious one-line bug) | [task loop](loops.md#task-loop), plan step may be mental | self |
| **Standard** | behavior changes, but requirements are unambiguous enough to write acceptance checks directly into the task | task loop with written verification criteria | peer |
| **Feature** | new capability, ambiguity about *what*, or the PO would care how it's shaped | spec → **⏳PO gate** → decompose into tasks → task loops | peer; gated where mandatory |
| **Knowledge** | material to ingest, questions to resolve, KB gaps | [ingestion loop](loops.md#ingestion-loop) | confirmation per protocol |
| **Maintenance** | upkeep with no product-visible change: consistency repairs, refactors, dependency updates | [maintenance loop](loops.md#maintenance-loop) or task loop | self (peer if behavior could change) |

Signals that force the **feature** track regardless of apparent size: altering the
*behavior* of auth, payments, PII handling, stored-data formats, or external contracts
(non-behavioral edits in those areas route normally, peer review minimum); any gate 2–4
trigger; genuine uncertainty about what the PO wants.

## The feature track

1. **Spec** — the analyst drafts `readme/work/specs/<slug>.md` from the
   [template](../templates/spec.md), running an
   [interview](../knowledge/ingestion.md#protocol-b-po-interview) only if the KB can't
   answer the open questions. Target: spec shorter than the diff it will produce. Zero
   open questions at approval.
2. **PO gate** — the one unskippable human review. Present decision-ready: the spec, the
   recommendation, notable alternatives. Approval is any explicit PO yes (chat or
   async); record it in the spec header (date + quote/reference) and flip
   `Status: approved`. Specs faithfully derived from a PO-authored document inherit
   approval for their unchanged content — gate review then covers only added
   interpretation ([ingestion](../knowledge/ingestion.md#protocol-a-document-synthesis)).
3. **Decompose** — split into S/M tasks (sizes defined in the
   [task template](../templates/task.md)) as `readme/work/tasks/<slug>.md` files where
   [warranted](../work/README.md), with per-task verification derived from the spec's
   acceptance checks. Order by dependency; identify what can run in parallel.
4. **Build** — task loops, parallel where independent (below).
5. **Integrate** — after all tasks close: run the full suite on the combined result,
   execute the spec's acceptance checks end-to-end, mark the spec `implemented`. If the
   combined suite fails after a merge, the task whose merge broke it reopens — that's
   why merges run one at a time.

**Bidirectional rule (applies on every track):** the moment reality diverges from a spec
or plan — an approach fails, a requirement turns out wrong, a better option appears —
update the doc in the same commit as the divergence. The spec always reflects current
best knowledge; a stale spec is never the record of anything. If the divergence changes
what an approved spec *promises* the PO (scope, behavior, cost — when unsure, assume it
does), additionally: flip the spec's `Status` to `needs-reapproval` noting inline which
requirements changed, park a `⏳PO` re-approval item, pause work that depends on the
changed promise, and continue work that doesn't. Record an ADR only if the deviation itself meets an
[ADR trigger](../knowledge/decisions/README.md).

## Escalation

Tracks are provisional. Upgrade the moment you're surprised:

- A quick fix reveals a real design question → standard/feature.
- A standard task's acceptance checks can't be written unambiguously → feature (the
  ambiguity *is* the missing spec).
- Any task that turns out L-sized → stop, split into S/M tasks, re-route each.
- Two failed approaches on one task → stop, reconsider the routing and the spec (this is
  the [overrun rule](loops.md) applied to attempts instead of time).

Downgrades are allowed too: a feared-complex change that turns out mechanical proceeds
as standard. Note track changes in the task; no ceremony.

## Parallelization

Run work in parallel when it is *actually independent*: disjoint files/subsystems, no
shared unresolved spec questions, no ordering dependency.

- **Builders** run as isolated agents (in Claude Code: subagents, worktree isolation for
  file mutations). Each gets a self-contained task file — assume the builder knows
  *nothing* beyond the repo, the KB, and the task. **Commit the task files (and any KB
  updates they depend on) to the default branch before spawning** — isolated worktrees
  branch from it, so anything uncommitted or on a side branch is invisible to the builder.
- **Single-writer KB:** isolated builders never edit shared KB files (`state.md`,
  glossary, derived.md, …) — they stage updates in their task file's *Notes* section; the
  orchestrator folds them into the KB in the merge commit
  ([DoD carve-out](../standards/quality-gates.md#definition-of-done)).
- **Builders report their branch** (name + final commit) when done; without it, nothing
  can be merged or reviewed.
- **Review before merge:** peer review runs against the builder's branch; the reviewer
  re-runs checks on a checkout of that branch. Findings go to a builder; the branch
  merges only after approval.
- **Merge sequentially,** re-running the check suite after each merge, not once at the
  end. A failure reopens the task just merged.
- **Analysis parallelizes freely** — read-only research/exploration agents can always
  fan out.
- Don't parallelize to feel fast: two dependent tasks run in parallel produce rework,
  which is slower than the queue.

## Integration mechanics

For the default solo-PO setup with no remote workflow: work happens on short-lived task
branches off the default branch; whoever orchestrates merges locally once the routed
review level passes, then deletes the branch. Sequential Quick-track work may commit
directly to the default branch. If the project adopts PRs/CI (a *Delivery* fact in
[product.md](../knowledge/product.md)), the merge point moves there — the review-before-
merge rule is what matters, not the mechanism. Pushing/publishing beyond the local repo
follows gate 2.

## Gates in practice

Mechanics in [quality-gates.md](../standards/quality-gates.md#mandatory-po-gates). The
orchestration rules: a gated item is *parked, not blocking* — record it `⏳PO` in
`state.md`, present it decision-ready, continue with other work. Batch gate requests
when several are pending; one decision-ready message beats four interruptions.

## Onboarding

The first run in a project — triggered when `product.md` is unfilled. (A small concrete
PO request may be served first on the Quick/Standard track; Feature work waits for
onboarding.)

1. **Inventory** — is there code? existing docs (README, wikis, old CLAUDE.md)? CI?
2. **Existing repo:** survey the codebase (structure, stack, entry points, test state) →
   run the [derivation procedure](../standards/derived.md#derivation-procedure)
   (fills the Commands table in the repo-root `AGENTS.md`) → ingest existing docs via
   [Protocol A](../knowledge/ingestion.md#protocol-a-document-synthesis)
   (existing docs are *sources*, not truth — reconcile against code) → draft
   `product.md` from evidence, everything `[ASSUMPTION]`-marked.
3. **Greenfield:** skip step 2 — there is nothing to derive yet. The stack gets chosen
   in the interview and the repo gets built by the bootstrap item (step 6).
4. **Interview** ([Protocol B](../knowledge/ingestion.md#protocol-b-po-interview)) —
   existing repo: confirm the drafted `product.md` and resolve step-2 conflicts;
   greenfield: fill `product.md` section by section. Always ask the onboarding-specific
   questions, whose answers land in `product.md` → *Delivery*: what does "release" mean
   here (defines gate 3)? any additions to the mandatory-gate list (→ ADR +
   quality-gates edit)? preferred PO check-in cadence? whether to install the
   recommended enforcement hooks (`.claude/README.md`, *Optional: deterministic
   enforcement*). **Greenfield
   additionally:** propose a stack with rationale and get the PO's pick — stack choice
   is expensive to reverse, and this interview approval *is* its gate (gate 1: the stack
   ADRs form part of the bootstrap item's spec); record the ADRs.
5. **Seed state** — populate `state.md` *Next steps* and `readme/work/backlog.md` with
   whatever the interview surfaced; commit everything.
6. **Greenfield bootstrap** — scaffold the repo as a normal **Feature-track item**
   whose spec is `product.md` plus the stack ADRs (gate 1 already satisfied by the
   interview): initialize the project, set up build/test/lint, verify each command and
   fill the Commands table in the repo-root `AGENTS.md`. This is ordinary routed work — task loop,
   verification, review — not a special onboarding mode.

Onboarding ends when `product.md` has no unfilled sections and the Commands table in
the repo-root `AGENTS.md` is verified (for greenfield, that means the bootstrap item is done). Defer
everything else to normal loops. If the PO is absent — from the start or mid-interview —
prepare what's preparable (repo survey, drafts, the interview worksheet), park the
questions `⏳PO` decision-ready, and end the session cleanly — a parked onboarding is
the correct outcome, not a failure.
