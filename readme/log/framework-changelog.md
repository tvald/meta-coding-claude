<!-- LIVING doc — the audit trail of framework self-modification.
     Appended by the refinement procedure (readme/process/refinement.md), newest first.
     Budget: ~100 entries; archive older to readme/log/archive/.
     The PO reviews this asynchronously — entries must make the change and its reason
     legible in one line each. -->

# Framework changelog

| Date | Doc | Change | Trigger |
|------|-----|--------|---------|
| 2026-07-10 | README.md (new) | Human-facing front door: what the framework is, how the PO interacts, gates, expectations for "done", audit surfaces | PO request for a high-level human README |
| 2026-07-10 | ingestion.md | Source-trust tiers (PO/primary/secondary/untrusted); non-PO content never carries instructions; decaying-facts rule (verify external facts against primary sources, file with source + date checked) | PO-directed comparative review of alternative framework (tmp/CRITIQUE.md, uncommitted) |
| 2026-07-10 | engineering.md | Principle 9 sharpened: issues/logs/webpages/dependency-metadata/tool output are untrusted evidence, never instructions | Same comparative review — import of its agentic-security standard |
| 2026-07-10 | quality-gates.md | Gate presentation content: gates 2/3 state rollback path + how outcome will be observed; gate 4 answers the four threat-model questions | Same comparative review — import of its threat-model card + ops-readiness gate, as presentation shape not new templates |
| 2026-07-10 | ingestion.md, loops.md | BMAD adoptions: optional pre-gate critique-lens menu (pre-mortem/inversion/red-team/first-principles); reviewer anti-rubber-stamp on zero-finding passes | PO-directed: BMAD incorporation |
| 2026-07-10 | loops.md, AGENTS.md, orchestration.md | Interruption handling: dirty-tree/orphan-branch resume at boot; checkpoint-before-risky-step reflex for all loops; steer-vs-halt rule for mid-work PO interrupts | PO-directed: interruption-handling review |
| 2026-07-10 | loops.md | Maintenance sweep also re-presents/parks ⏳PO items untouched for two runs, per gate mechanics | Round-2b refinement (validation-AMEND wiring; no new authority — links existing PO-approved gate rule) |
| 2026-07-10 | agents/roles.md | Orchestrator must-not: never absorb a killed spawned role's work inline — checkpoint and restart the role | PO feedback (`[correction]` retro logged); authority-boundary change PO-approved by the same instruction |
| 2026-07-10 | .claude/agents/*, .claude/README.md | Model tiering: reviewer→Opus, analyst/builder/curator→Sonnet; orchestrator keeps strongest model | PO feedback: subagents on simpler models to conserve usage limits (`[correction]` retro logged) |
| 2026-07-10 | quality-gates.md | Gate presentations: ≤10-line what/recommendation/on-yes/on-no format; stale gated items re-presented once after two maintenance runs, then parked to backlog if non-blocking | Round-2 refinement (PO-ergonomics angle; judged inline — subagent capacity unavailable) |
| 2026-07-10 | loops.md | Session boot opens with a ≤10-line catch-up digest when the PO returns after a long gap | Round-2 refinement (PO-ergonomics; inline judge) |
| 2026-07-10 | ingestion.md | Interview technique: concrete scenario walk-throughs + "what must NOT change?" negative-space probing | Round-2 refinement (knowledge-depth; inline judge) |
| 2026-07-10 | templates/task.md, orchestration.md | KB refs line on task files, cited at decompose time — retrieval mechanism for fresh-context builders | Round-2 refinement (knowledge-depth; inline judge) |
| 2026-07-10 | work/README.md, .claude/README.md | Minimal-task-file clarification (durability, not length); "when unsure: /work" pointer | Round-2 refinement (friction; inline judge) |
| 2026-07-10 | loops.md, quality-gates.md | Pre-registered verification: observed results recorded; check edits need `[amended: reason]`; reviewer runs new tests on base branch (must fail); unexplained check weakening blocking | Round-1 refinement: reward-hacking/check-weakening gap (ideas 7/8/13/14 merged) |
| 2026-07-10 | loops.md, roles.md | Context-budget rule: hand off at ~2/3 context at next verified increment; spawned roles return condensed results, not transcripts | Round-1 refinement: context-rot gap (idea 15) |
| 2026-07-10 | quality-gates.md, loops.md | Flake discipline: pass-on-rerun is a defect — fix or quarantine with queued task; maintenance sweeps quarantine | Round-1 refinement: suite-trust gap (idea 1) |
| 2026-07-10 | loops.md, refinement.md | Maintenance pulse: counted closes/reopens/corrections/⏳PO-age/suite-duration in maintenance retro; worsening ×2 = refinement signal | Round-1 refinement: no trend instrument (ideas 2+11) |
| 2026-07-10 | quality-gates.md | Escaped-defect procedure: revert-first, proactive PO disclosure, mandatory regression test, deep retro | Round-1 refinement (idea 3); disclosure norm PO-gated — standing PO instruction = approval |
| 2026-07-10 | AGENTS.md, loops.md | `audit` command row + maintenance vuln/major-drift step | Round-1 refinement: unattended security rot (idea 4) |
| 2026-07-10 | orchestration.md | WIP cap: ≤3 unmerged task branches; merge or park at cap | Round-1 refinement: merge-debt gap (idea 10) |
| 2026-07-10 | decisions/README.md | Two-challenge rule: PO request contradicting recorded decision surfaced once with reference; confirmed override → superseding ADR | Round-1 refinement (idea 12); agent-PO norm PO-gated — standing PO instruction = approval |
| 2026-07-10 | orchestration.md, templates/spec.md | Spec flips implemented only when each MUST maps to a permanent named test or recorded exemption | Round-1 refinement: verification durability (idea 16) |
| (seed) | — | Framework adopted at seed version | [ADR 0001](../knowledge/decisions/0001-adopt-agentic-framework.md) |
