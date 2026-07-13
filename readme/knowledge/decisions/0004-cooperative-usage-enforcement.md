# 0004. Cooperative usage-limit enforcement — no hook, no script

- **Status:** accepted
- **Date:** 2026-07-13
- **Decided by:** PO (approved the presented cooperative proposal)

## Context

The usage-limit guard shipped as a PreToolUse hook plus a TypeScript script — the
adapter's only non-markdown files. The hook bought determinism at the spawn instant, at
the cost of a network call on every spawn, an executable dependency on two undocumented
internals, and silent no-op behavior on incompatible Node versions. The framework's own
hooks doctrine says deterministic enforcement should follow real incidents; no
compliance incident had occurred (the advisory rule and the hook shipped together).
Monitoring policy (auto-detected limits only) was separately fixed by ADR 0003 and is
not changed here.

## Decision

Enforcement is cooperative: the orchestrator polls a documented one-liner (same
endpoint, both paths execution-verified) before spawn waves per its contract; a
`⏳limit <reset>` entry in `state.md` is the durable latch (read at every session
boot); harness limit errors are the reactive signal; resume is timer + verification
poll. The hook and script are deleted; `.claude/` is markdown-only again.

## Alternatives considered

- **Keep hook + script (do nothing)** — deterministic, but speculative under the
  framework's own doctrine, taxes every spawn, and its Node-mismatch failure mode
  (silent no-op) looks enforced while enforcing nothing.
- **Hook without script** (inline prompt-type hook) — still JSON config shipped in the
  kit; determinism without the network tax isn't achievable for this check anyway.

## Consequences

- Easier: fully markdown adapter (kit-wide non-markdown files: zero); no per-spawn
  latency; smaller undocumented-internals surface (one documented command vs a shipped
  executable).
- Harder: nothing *prevents* a non-compliant orchestrator from spawning past 95% — the
  risk is bounded (checkpoint discipline makes limit hits recoverable) and accepted.
- **Reinstatement trigger:** one real incident of an orchestrator spawning past a
  suspended limit → restore the hook variant from git history (commit `bc574be`;
  provenance and review record in `readme/work/tasks/usage-guard-autodetect.md` and
  `usage-limit-guard.md` if the SHA ever dangles) via a superseding ADR. That incident
  is a refinement signal, not an argument.
