<!-- Historical record — adjudication of the external critique the PO placed at
     /CRITIQUE.md on 2026-07-10. One entry per recommendation: adopted (with the edit)
     or rejected (with the reason). Rejections here are decisions — do not re-adopt a
     rejected item without new evidence or PO direction. -->

# Disposition: external framework critique (2026-07)

Adopted items were applied 2026-07-10 and logged in the
[framework changelog](../framework-changelog.md). Line references are to CRITIQUE.md's
"Prioritized recommendations".

## Priority 0

1. **Separate checkpointing from commit authority — ADOPTED (scoped).** Commit stays the
   *default* (the framework's primary context is agent-driven repos), but Git authority
   is now an onboarding-discovered *Delivery* policy with a defined degradation:
   clean diff + staged task-file notes, "same commit" → "same coherent change", parallel
   builders require branch authority (orchestration.md#integration-mechanics; loops.md
   session close; AGENTS.md boot 4).
2. **Dirty worktree = unknown ownership — ADOPTED.** Boot rule rewritten: inspect
   without modifying; resume only work traceable to a task file/branch/`state.md`;
   preserve and work around unexplained changes; ask only on overlap (AGENTS.md boot 1,
   loops.md session boot).
3. **Source-trust hierarchy — ALREADY PRESENT** (imported 2026-07-10 from the prior
   external-framework review: ingestion.md#source-trust, engineering.md §9). Remaining
   delta adopted: `/ingest` skill now frames delegated material as data-not-instructions
   explicitly.
4. **Broaden security gate — ADOPTED.** Gate 4 now covers auth/authorization, secrets &
   credential handling, payments, personal/regulated data, and agent/CI/infrastructure
   permissions; routing signals + AGENTS.md summary + engineering §9 re-synced.
   Install-time-executing dependencies get code-level scrutiny (engineering §9).
   NOT adopted: making every new dependency a PO gate — gates must stay few; §7
   (dependencies are liabilities) + the ADR trigger already cover adoption decisions.
5. **Preserve authoritative sources — ADOPTED.** Ingestion cleanup is now a retention
   decision: authoritative originals archived (never deleted) with a provenance line;
   only disposable copies deleted (ingestion.md Protocol A step 6).

## Priority 1

6. **Risk-scale verification breadth — ADOPTED (as a two-tier rule, not the 4-row
   matrix).** Full suite stays the default; onboarding measures suite cost and may
   define a recorded task-level subset (affected tests + fast checks) with the full
   suite at integration/merge/release; skipping a relevant check needs a stated reason
   (quality-gates DoD 2; derived.md derivation step 1). The critique's low-risk
   "diff read-through only" row was NOT adopted — the Quick track already is that tier,
   and unverified "low-risk" behavior changes are exactly the failure mode the framework
   exists to prevent. Base-revision counterfactual runs: alternatives allowed when a
   base checkout is impractical (revert-in-place, mutation), method recorded
   (loops.md review step 3).
7. **Capability-aware reviewer independence — MOSTLY ALREADY PRESENT / REST REJECTED.**
   roles.md#runtime-mapping already defines independence by contract, not mechanism
   ("a subagent, a fresh chat session, or another tool entirely"); model names live only
   in the optional `.claude/` adapter. REJECTED: self-review for "genuinely small"
   behavior changes — the Quick/Standard boundary already implements that judgment, and
   softening peer review re-opens the builder-grades-own-work hole for exactly the
   changes where "small" is misjudged.
8. **Conditional `state.md` — REJECTED.** The crash-reconciliation boot check (state vs
   `git log`), the PO catch-up digest, and next-session work selection all read it; a
   "was this initiative cross-session?" predicate is more interpretation cost than the
   ~3 lines a small session writes (close is already explicitly scaled). *Recently done*
   is a curated signal, not git duplication — git log has no notion of "notable".
   Single-writer rule already handles multi-agent contention. Re-open only on observed
   evidence: recurring merge conflicts in `state.md` or curation eating real session time.
9. **Thresholds as heuristics — ADOPTED.** One canonical statement
   (refinement.md#thresholds-are-heuristics): every PROCESS number is a seed default
   tied to a named signal, tuned by refinement, project values in derived.md. Individual
   numbers were NOT reworded in place — the blanket rule owns the fact.
10. **Narrow spec approval — REJECTED as a seed default.** Gate 1 is the framework's
    core PO-control point for a solo owner; the gate list is already PO-extensible/
    shrinkable per project via a documented ADR path, which is where delegation belongs.
    Routing already keeps unambiguous behavior changes on the Standard track — "feature"
    is not a word-trigger.
11. **Containment analysis over universal revert — ADOPTED (sharpening).** "Clean
    revert" now defined by exclusion: no data corruption, no forward-only-migration
    rollback, no reintroduced vulnerability, no broken published contract — otherwise
    contain forward with the reason stated (quality-gates.md#escaped-defects).

## Priority 2

12. **Evidence gate before self-modification — PARTIALLY ADOPTED.** Changelog entries
    for changes to verification requirements, routing defaults, or retention behavior
    must now state expected before/after behavior, giving the sunset check something to
    judge (refinement.md step 4). REJECTED: proposal queues, evidence scores, pilot
    terms, independent judges for ordinary refinements — the framework's deliberate bet
    is cheap incident-driven self-repair audited asynchronously via the changelog, with
    PO revert as the veto; a proposal pipeline recreates the PO-bottleneck the framework
    exists to remove. The signals table already forbids no-incident tinkering, and the
    leash-widening boundary stays ⏳PO-gated.
13. **"One home per fact" → canonical ownership — ADOPTED.** Rule 1 reworded to match
    the already-practiced summaries mechanism (management.md).
14. **Freshness checks as signals — ADOPTED (sharpening).** Symbol-check misses read
    "needs review", not "stale"; a check that repeatedly flags non-problems is itself a
    refinement signal to narrow or prune (management.md#consistency-checks). NOT
    adopted: glob/ownership-area anchors — speculative machinery with no incident behind
    it; revisit if anchor false positives actually recur.
15. **Separate portable contract from runtime profiles — ALREADY PRESENT.** That split
    is the existing design: contracts in roles.md/loops.md, all vendor specifics
    (models, worktrees, hooks, scheduling) in `.claude/` marked "convenience, not
    requirement", fallbacks in roles.md#runtime-mapping; hooks are opt-in via the
    onboarding interview. No edit.
16. **Stop seeding an accepted adoption ADR — ADOPTED.** ADR 0001 ships `proposed`;
    onboarding step 5 flips it to `accepted` dated to the real adoption; the uncited
    "public evaluations" claim replaced with the plain rationale. REJECTED:
    create-on-first-use for the seeded living files — each seeded file is load-bearing
    in a loop (boot reads `state.md`, routing reads the backlog, onboarding fills
    `product.md`/`derived.md`), and empty-file cost is a few comment lines, cheaper than
    per-file existence logic in every loop.

## Negative aspects without a numbered recommendation

- **§13 underdeveloped quality domains — PARTIALLY ADOPTED**: migration-rehearsal and
  observability guidance queued as risk-conditional backlog imports (joining the
  AI-safety/UI/incident items already queued); rollback-at-gates and license checks
  already exist (gate 2/3 presentation content; engineering §7). Accessibility, threat
  modeling beyond gate 4's questions: remain conditional backlog territory, not
  universal ceremony.
- **§14 rule conflicts — REJECTED with pointers**: drive-by vs leave-it-better is
  scoped by "within scope / blast radius" (engineering §6 + hard rule 6); the spec's
  current-truth-vs-promise tension is resolved by `needs-reapproval` + archival;
  docs-vs-code already distinguishes drifted code (flag as defect) from stale doc (fix);
  portability-vs-hooks is the adapter split (see 15). The one-home wording conflict was
  real → fixed via 13.
