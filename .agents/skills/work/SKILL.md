---
name: work
description: Run the session loop autonomously — pick up the current state and work through next steps without babysitting. Use when the PO says "continue", "keep going", "work on the backlog", or gives no specific goal.
---

Run the **session loop** (`readme/meta/process/loops.md#session-loop`) as the
orchestrator:

1. **Boot**: read `readme/knowledge/state.md` — if it doesn't exist, bootstrap the
   state tree from `readme/meta/seed/` first
   (`readme/meta/README.md#deploy-bootstrap-reset`); reconcile it from `git log` if a
   crashed session left it stale. If `readme/knowledge/product.md` is missing or
   unfilled, run the `onboard` skill instead (a small concrete Quick/Standard request
   given at invocation may be served first).
2. **Select**: the goal given at invocation, if any; otherwise the top unblocked item
   in *Next steps*, then the top of `readme/work/backlog.md` (skip `⏳PO` items —
   batch those for the end). Nothing queued → run the `check` skill.
3. **Route and execute** via the routing table in `AGENTS.md`, binding roles per
   `.agents/README.md` (peer review → a fresh-context delegate that did not build the
   diff, always).
4. **Repeat** step 2 while unblocked work remains within the given bound (default: one
   coherent batch — stop at a natural boundary rather than mid-task).
5. **Close** (never skip): update `state.md`, ensure commits, dated retro entry per
   `readme/meta/process/loops.md#retro-loop`, then report: done / parked `⏳PO`
   (decision-ready summaries, batched) / next.

Autonomy rules are the repo-root `AGENTS.md` hard rules — proceed without asking except
at mandatory PO gates.
