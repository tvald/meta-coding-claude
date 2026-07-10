# 0001. Adopt this agentic development framework

- **Status:** proposed <!-- flipped to accepted during onboarding, when the PO actually
     adopts the framework in this project (readme/meta/process/orchestration.md#onboarding, step 5) — a seed
     must not arrive as an already-made decision -->
- **Date:** 2026-07-10 <!-- kit build date; update to the seeding date when the kit lands in a project -->
- **Decided by:** PO

## Context

This project is developed primarily by AI agents directed by a solo product owner. Without
a shared process, agent work loses context between sessions, decisions get silently
re-made, and quality depends on the PO reviewing everything — which does not scale.

## Decision

We adopt the process framework in `readme/` (entrypoint: `AGENTS.md`): knowledge is kept
in a curated markdown knowledge base, work is routed through defined loops with
proportional ceremony, agents operate autonomously between explicit PO gates, and the
framework refines itself from feedback and observed gaps.

## Alternatives considered

- **No process (raw prompting)** — fast at first; loses context across sessions, quality
  drifts, PO becomes the bottleneck for all memory.
- **Heavyweight spec-driven frameworks** (full spec/plan/tasks pipeline for every change)
  — the fixed per-change ceremony cost dominates on small changes and produces
  documentation that outweighs the code; rejected in favor of proportional ceremony.

## Consequences

- Easier: session continuity, delegation to parallel agents, async PO review via git.
- Harder: discipline is required to keep knowledge docs updated in the same commit as
  code; the framework docs themselves must be maintained (mitigated by the refinement
  process making that automatic).
- This ADR doubles as the template example: its format is the norm for the log.
