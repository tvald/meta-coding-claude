# Task: Cooperative usage-limit enforcement — remove hook and script

- **Spec:** direct (PO approval 2026-07-13 of the presented cooperative proposal:
  "Yes, implement the cooperative proposal"). Supersedes the mechanism (not the policy)
  of the hook-based guard.
- **Status:** done
- **Size guess:** S
- **KB refs:** ADR 0003 (auto-only monitoring policy — unchanged); orchestration.md
  §Usage limits (canonical rule — unchanged); .claude/README hooks doctrine ("hooks
  follow real incidents"); roles.md orchestrator Must (poll before spawn waves) and
  Must-not (spawn past suspension) — both unchanged and now the enforcement mechanism

## Goal

`.claude/` returns to markdown-only: delete `settings.json` (PreToolUse hook) and
`scripts/usage-guard.ts`; the adapter documents a verified poll one-liner instead.
Suspension state moves to its natural home — a `⏳limit <reset>` entry in `state.md`
(read at every session boot = durable cross-session latch). Reinstating the hook
requires a real compliance incident (refinement signal), recorded in the ADR.

## Plan

1. Delete `.claude/settings.json`, `.claude/scripts/usage-guard.ts`; drop the
   latch line from `.gitignore` (latch file no longer exists as a mechanism).
2. Rewrite `.claude/README.md` §Usage-limit guard (heading kept — anchor stability):
   cooperative protocol + tested one-liner in a fenced block.
3. ADR 0004 (cooperative mechanism; hook variant in git history + reinstatement
   trigger); changelog row; state/retro at close.
4. Verify: one-liner success + failure paths by execution; `.claude/` contains zero
   non-markdown files; link check. Peer review; merge.

## Verification

- [x] Poll one-liner: success path printed both windows (observed 50%/28% with reset
      instants); failure path printed the not-monitored message with no stack trace and
      no token (first draft DID crash there — hardened before documenting).
- [x] `git ls-files | grep -v '\.md$'` shows no `.claude/` entries (count 0).
- [x] Link check: exactly the 12 pre-existing by-design hits (frozen archive +
      deploy-relative seed links); nothing new.
- [x] Peer review approved; findings recorded below.

## Notes / discoveries

- First draft of the one-liner crashed on the failure path (sync readFileSync throw
  escaped the promise .catch) — caught by pre-documentation execution; hardened to an
  async IIFE with a full try/catch.

## Review

**Verdict: approve** (reviewer subagent, fresh context, commit 620c932, peer level).
Independently re-ran the documented one-liner verbatim — success path 52%/28% with
resets, failure path clean message/no trace/no token; confirmed `.claude/` markdown-only
via `git ls-files`; confirmed `bc574be` contains the hook+script byte-identical to the
deleted versions (restore pointer exact); all anchors resolve; stale-latch clearing
confirmed *stronger* than the old script's timer-based self-clear (verification-poll
gated). Advisories, both applied at close:

- **1:** state.md *Recently done* still described the hook as live — superseded marker
  appended + ADR 0004 entry added at merge (single-writer: orchestrator).
- **2:** bare-SHA restore pointer durability — ADR 0004 now also names this task file
  alongside `bc574be`.
