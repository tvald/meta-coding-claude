---
name: onboard
description: First-run onboarding — survey the repo, derive standards, fill product.md through an interview, seed state. Use when the framework was just seeded into a project, or when readme/knowledge/product.md is unfilled.
---

Run the **onboarding procedure** in `readme/process/orchestration.md#onboarding` — read
it now, then execute its six steps in order (step 6, the greenfield bootstrap, is what
makes the exit criterion reachable in an empty repo). Operating notes:

- The repo survey and standards derivation (existing repos) can be delegated to the
  `analyst` subagent; verify every command by execution before writing it to the
  Commands table in the repo-root `AGENTS.md`.
- Conduct the interview yourself per
  `readme/knowledge/ingestion.md#protocol-b-po-interview`: 1–3 questions per message,
  best-guess defaults offered with every question, evidence-based drafts presented for
  confirmation rather than open-ended questions asked.
- Do not skip the onboarding-specific questions (what "release" means; gate-list
  additions; PO check-in cadence; whether to install the recommended enforcement hooks
  from `.claude/README.md`, *Optional: deterministic enforcement*).
- Exit criteria are in the procedure. Close by committing everything and telling the PO:
  what was derived, what was assumed (`[ASSUMPTION]` count and where), and the first
  *Next steps* now queued in `state.md`.
