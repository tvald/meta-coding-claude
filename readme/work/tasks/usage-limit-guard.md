# Task: Suspend subagent spawning at 95% of usage limits; resume at reset

- **Spec:** direct (PO instruction 2026-07-13: "monitor usage and suspend sub-agents once
  95% of the 5-hour or weekly limits are consumed; set a timer, or poll if more reliable,
  and resume once the applicable limit resets")
- **Status:** done
- **Size guess:** M
- **KB refs:** roles.md orchestrator contract (authority change → PO-gated; this PO
  instruction is the approval); meta/README.md#adapters (executables opt-in,
  PO-approved — this instruction is that approval); [correction] retro 2026-07-10
  "no inline fallback" (suspension must checkpoint spawned work, never absorb it);
  [correction] retro "model tiering" (limits are a managed resource — same theme)

## Goal

At ≥95% of any harness usage limit (5-hour window, weekly, or spend), the orchestrator
stops spawning subagents, checkpoints in-flight spawned work, parks the paused work with
its reset time, and resumes automatically when the limit resets — portable rule in the
core, working enforcement in the Claude adapter.

## Plan

1. Core (portable, mechanism-agnostic): `meta/process/orchestration.md` new
   `## Usage limits` section — monitor before spawn waves; ≥95% → suspend spawning,
   checkpoint, park `⏳limit` with reset time; timer to a known reset + verification
   poll, poll when reset unknown; harness limit error = 100%, latch immediately.
2. `meta/agents/roles.md` orchestrator *Does*/*Must not* lines (PO-gated authority edit —
   approved by this instruction).
3. Claude adapter: `.claude/scripts/usage-guard.ts` (no deps; Node-native TS) reading
   `.claude/usage-limits.json` + latch file, measuring via `ccusage blocks --json`
   (local transcript estimation) — `gate` mode for the PreToolUse hook (exit 2 = deny),
   `status` mode for polling/resume timers; `.claude/settings.json` PreToolUse hook on
   Task|Agent; README section documenting measurement honesty (estimates + authoritative
   latch on real limit errors) and the resume-timer pattern.
4. Verify, changelog ×2, retro, state, peer review (reviewer subagent), merge.

## Verification

- [x] `node .claude/scripts/usage-guard.ts status` runs and prints JSON with block usage
      and reset times against the real local transcripts (observed: 9,579,813 tokens in
      the active block, `resetsAt 2026-07-13T06:00:00Z`).
- [x] `gate` mode: exits 0 with no limits configured (fail-open + warning); exits 2 when
      a latch file with a future reset exists; exits 0 again when the latch reset is past
      (self-clearing, file removed) — each observed by execution. Bonus: threshold trip
      verified with a temporary 10M-token config (denied at ~105%, exit 2), restored.
- [x] `.claude/settings.json` parses as valid JSON (node JSON.parse).
- [x] Link checker passes — only the 12 pre-existing by-design hits (frozen archive
      links + deploy-relative seed links), none introduced by this change.
- [x] Peer review approved; findings recorded below.

## Notes / discoveries

- Node ≥26 executes `.ts` directly (type stripping) — guard needs no npx/tsx at runtime.
- `ccusage` measures token estimates from local transcripts; plan limits are dynamic and
  unpublished, so configured thresholds are estimates. The authoritative signal is a real
  limit error from the harness → latch (records reset time) until reset passes.

## Review

**Verdict: approve** (reviewer subagent, fresh context, commit 74e2931; all executable
checks independently re-run — status JSON valid at 17.4M tokens/active block, fail-open,
latch deny/self-clear, threshold trip, weekly whole-week arithmetic, JSON validity,
anchors, gitignore, ~0.6s hot-path latency; contract/consistency checks clean, no
security exposure). No blocking findings. Advisories and dispositions:

- **A (advisory):** 95% gate ships dormant (null config) — latch-only until limits are
  recorded. *Fixed:* README states it plainly; `latch` now prints the two
  follow-through steps (park `⏳limit`; record observed tokens so 95% becomes operative).
- **B (advisory):** `npx ccusage@latest` on the hot path → registry hit / cold-cache
  stall risk. *Fixed:* pinned to `ccusage@20.0.17`, bump deliberately.
- **C (advisory):** "Node ≥22" imprecise; older 22.x fails silently open. *Fixed:*
  corrected to ≥22.18/≥23.6 in script + README, with verify-once-per-environment note.
- **D (advisory):** weekly estimate undercounts blocks straddling the reset boundary.
  *Waived* — estimate-level tool by design; bias documented in the code.
- **E (advisory):** crash window between limit error and latch/park (two manual steps).
  *Partially addressed* by the latch reminder output; residual risk accepted —
  self-correcting on next limit hit.
