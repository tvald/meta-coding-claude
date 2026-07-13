# Task: Auto-detect usage limits (official source primary; config demoted to fallback)

- **Spec:** direct (PO correction 2026-07-13: "the framework should automatically detect
  usage limits" — supersedes the config-estimates-first design shipped hours earlier).
  Security-sensitive approach (reads local OAuth credentials): PO directive is the gate-4
  approval; mechanism disclosed in-session — first-party read-only usage endpoint, token
  never logged or sent elsewhere.
- **Status:** done
- **Size guess:** S
- **KB refs:** `readme/work/tasks/usage-limit-guard.md` (prior review, advisory A —
  dormant 95% gate — is exactly what this removes); AGENTS.md routing (credential-
  handling behavior → gated, peer minimum); orchestration.md#usage-limits (core rule
  unchanged — adapters bind measurement)

## Goal

The guard's primary source is the official utilization endpoint (`/api/oauth/usage`,
verified live: exact percentages + reset instants for both windows, zero configuration).
Fallback chain when unavailable: configured estimates via ccusage → latch-only.
Advisory A from the prior review (protection dormant until manual calibration) is
eliminated wherever credentials exist.

## Plan

Rewrite `usage-guard.ts` measure path: `official()` (credentials from
`$CLAUDE_CONFIG_DIR|~/.claude/.credentials.json`, 8s timeout, fail-null) → per-window
merge with ccusage estimates; `source` field in status; gate/latch semantics unchanged.
Async main (CJS type-stripping forbids top-level await). Update `.claude/README.md`
(auto-detection primary, config optional) and `usage-limits.json` comment-equivalent.
Verify by execution; peer review; merge.

## Verification

- [x] `status` shows `source: "official"` with pct/resets matching the live endpoint
      (observed 0.31 / 0.26, reset instants to the second).
- [x] `gate` exit 0 at 31% utilization; exit 2 with threshold temporarily at 0.25
      ("Usage 31% of five-hour limit (official)"); config restored to zero diff.
- [x] Fallback: `CLAUDE_CONFIG_DIR` pointed at an empty dir → sources degrade to `none`,
      `measured: false`, gate fails open, output token-leak-checked clean. (Note: the
      override hid ccusage's data too, so this exercised official→estimate→none; the
      estimate path itself is unchanged code, verified in the prior review round.)
- [x] Latch deny (exit 2) / self-clear (exit 0) re-verified.
- [x] Peer review approved; findings recorded below. Post-fix re-verification: status
      official 0.34/0.27, gate 0, latch 2, self-clear 0.

## Notes / discoveries

- Endpoint is undocumented (the `/usage` UI's backing call) — treated as unstable:
  short timeout, silent fallback, latch remains the authoritative backstop. Response
  also carries `extra_usage` credits and per-model windows; ignored for now.

## Review

**Verdict: approve** (reviewer subagent, fresh context, commit 3adf7a6; gated level).
Security cleared explicitly: token header-only to a hard-pinned host, no URL
interpolation, all failure paths silently swallowed (no token in any error text), no
writes to the 600-mode credential file, no token in any output; `utilization/100`
semantics verified live; zero-utilization, timeout, expiry-401, clock-skew, and
exit-code paths all checked as non-issues. Advisories, all applied:

- **1:** orchestration.md latch guidance still said "correct the configured estimate" —
  reconciled to cover authoritative-source failure vs estimate correction.
- **2:** plan promised per-window merge; code was official-wins-wholesale — implemented
  the per-window fallback (a missing official window now falls to estimates).
- **3:** `redirect: "error"` pinned on the fetch (defense-in-depth; undici already
  strips Authorization cross-origin).
