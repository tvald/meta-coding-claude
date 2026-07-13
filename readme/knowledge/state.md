<!-- LIVING doc — the NOW. Owned by the project, seeded empty.
     Budget: 60 lines HARD CAP — archive, don't grow. This file is read at the start of
     every session and updated at the end of every session and every completed task.
     It is the single highest-leverage file for continuity: keep it ruthlessly current.
     Entries older than ~2 weeks that are no longer "now" get deleted or archived to
     readme/log/archive/. -->

# State

## Current focus

<!-- The active work: what and why now. 1–3 bullets, each linking to its spec/task. -->

- Nothing in progress. Fresh seed — run onboarding (see AGENTS.md).

## Recently done

<!-- Last few completed items, newest first. One line each. Prune aggressively —
     git history is the full record. -->

- 2026-07-13: Usage-limit enforcement now COOPERATIVE (ADR 0004, PO-approved): hook +
  script deleted, `.claude/` markdown-only again; documented poll one-liner + `⏳limit`
  state.md latch + harness error signals. Also ADR 0003: only auto-detected limits are
  monitored — estimate config and ccusage removed. Peer-reviewed: approve. Tasks:
  `usage-guard-cooperative.md` (+ superseded: `usage-limit-guard.md`,
  `usage-guard-autodetect.md` — their hook/script mechanism replaced by ADR 0004;
  §Usage limits core rule unchanged throughout).
- 2026-07-13: Added standing external-review practice (`refinement.md` §External review) —
  the twice-flagged "silent gaps need outside eyes" retro pattern, now a rule.
- 2026-07-10: Adopted the adapter contract (`readme/meta/README.md#adapters`, PO-directed):
  adapters bind, never own, process semantics; maintenance loop now audits it (step 6).
- 2026-07-10: Added Codex adapter `.agents/` (Agent Skills mirror of the seven skills;
  conventions verified against official Codex docs same day). Peer-reviewed: approved.
- 2026-07-10: Restructured into self-contained add-on (PO-approved plan): framework core
  → `readme/meta/` (+ seed tree, deploy/bootstrap/reset procedure); LIVING paths
  unchanged; all links verified + bootstrap simulated end-to-end.
- 2026-07-10: Adjudicated PO-placed `CRITIQUE.md` — 9 recommendations adopted (dirty-tree
  ownership, commit-authority policy, gate-4 breadth, retention, suite scaling, +4 more),
  4 rejected with reasons; disposition: `readme/log/archive/critique-response-2026-07.md`.
  Source archived (PO-approved) as `readme/log/archive/critique-2026-07.md`.
- 2026-07-10: Wrote repo-root `README.md` — human/PO-facing overview of the framework
  (PO request; Quick track, self-reviewed).
- 2026-07-10: PO-directed critique of an alternative meta-framework (written to
  `tmp/CRITIQUE.md`, deliberately uncommitted); imported source-trust tiers +
  decaying-facts rule (ingestion.md), untrusted-evidence rule (engineering.md §9), and
  gate-presentation content (quality-gates.md) — see framework changelog; conditional
  imports parked in backlog.

## Next steps

<!-- The immediate queue only, priority order, ≤10 items: follow-ups, repair actions,
     items awaiting a PO gate (mark those ⏳PO). Everything beyond the immediate queue
     lives in readme/work/backlog.md — overflow flows there, never to the archive. -->

- Run onboarding: fill `readme/knowledge/product.md`, derive `readme/standards/derived.md`.

## Known dead ends

<!-- Approaches tried and abandoned, one line each with why. This section prevents agents
     from re-trying known failures. Only remove an entry when the reason no longer holds. -->
