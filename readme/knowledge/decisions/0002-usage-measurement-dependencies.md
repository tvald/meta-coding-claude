# 0002. Measure usage via the undocumented first-party endpoint, ccusage as fallback

- **Status:** accepted
- **Date:** 2026-07-13
- **Decided by:** PO (directive: limits must be auto-detected) + agent (mechanism choice)

## Context

The usage-limit guard (orchestration.md §Usage limits) needs consumption measured
against the account's 5-hour and weekly limits. No documented, machine-readable API
exposes subscription limits; the guard initially shipped with manually configured
estimates measured against `ccusage` token counts, leaving the 95% gate dormant until
calibrated. The PO rejected manual configuration; a live probe showed the endpoint
behind the `/usage` UI (`api.anthropic.com/api/oauth/usage`, local OAuth token) returns
exact utilization and reset instants.

## Decision

The guard's measurement chain is: (1) the undocumented first-party usage endpoint —
primary; (2) `ccusage` (pinned `20.0.17`, via `npx`) token estimates vs optional
configured limits — per-window fallback; (3) fail-open with the latch as authoritative
backstop. Both external dependencies live only in the `.claude/` adapter and are soft:
any failure degrades protection, never blocks work.

## Alternatives considered

- **Documented API only** — none exists for subscription limits; would mean no
  pre-emptive protection at all.
- **Manual config only (do nothing)** — accurate never, dormant until first limit hit;
  explicitly rejected by the PO.
- **Vendoring ccusage or reimplementing transcript parsing** — more code to own for a
  fallback path; `npx` with a pinned version is sufficient and bumpable deliberately.

## Consequences

- Easier: zero-config, exact detection wherever Claude Code credentials exist.
- Harder: two undocumented contracts can drift silently (endpoint schema/auth header;
  credentials-file location/shape). Mitigations: 8s timeout + silent per-window
  fallback; drift is self-announcing — a real limit error while the official source
  read <95% is the documented investigate-before-retrusting signal.
- Any change to this chain (endpoint removed, ccusage swapped) supersedes this ADR.
