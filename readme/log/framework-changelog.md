<!-- LIVING doc — the audit trail of framework self-modification.
     Appended by the refinement procedure (readme/process/refinement.md), newest first.
     Budget: ~100 entries; archive older to readme/log/archive/.
     The PO reviews this asynchronously — entries must make the change and its reason
     legible in one line each. -->

# Framework changelog

| Date | Doc | Change | Trigger |
|------|-----|--------|---------|
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
