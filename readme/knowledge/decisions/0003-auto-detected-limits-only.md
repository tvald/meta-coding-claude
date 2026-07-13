# 0003. Monitor only auto-detected usage limits; no manual estimates

- **Status:** accepted (supersedes [0002](0002-usage-measurement-dependencies.md))
- **Date:** 2026-07-13
- **Decided by:** PO

## Context

ADR 0002 established a three-tier measurement chain: official endpoint → `ccusage`
token estimates vs a manually configured `usage-limits.json` → fail-open + latch. The
estimate tier required the PO to guess unpublished, dynamic plan limits, and kept a
config file and an external tool (`ccusage`) in the dependency surface for a tier that
only mattered where the official source was unavailable.

## Decision

Remove the estimate tier entirely (PO directive: "if the limit cannot be automatically
obtained, don't monitor the limit"). The chain is now: official endpoint → fail-open,
with the latch (set on real limit errors) as the sole backstop where detection is
unavailable. `usage-limits.json` is deleted; the 95% threshold is a constant in the
guard; `ccusage` is no longer used by the framework.

## Alternatives considered

- **Keep estimates as fallback (do nothing)** — rejected: guessed denominators produce
  false confidence and a config nobody calibrates; unmeasured-but-latched is more honest
  than estimated.
- **Keep ccusage for consumption-trend display only** — rejected: information without a
  decision attached doesn't pay rent.

## Consequences

- Easier: zero configuration everywhere; one less non-markdown file; `ccusage` and its
  npx/network path drop out of the dependency surface (0002's main liability halved).
- Harder: environments without readable credentials get no pre-emptive protection at
  all — first limit hit is the signal there (accepted: such environments also can't
  calibrate estimates honestly).
- The remaining hook + script are under separate PO evaluation (cooperative-vs-hook);
  a decision to go cooperative would supersede the *mechanism*, not this policy.
