# Claude Code adapter

<!-- PROCESS docs: everything under .claude/ belongs to the framework and changes via
     refinement (readme/meta/process/refinement.md), logged in the framework changelog. -->

Native wiring for the process framework in `readme/`, bound by the
[adapter contract](../readme/meta/README.md#adapters): this directory owns only harness
bindings (tool lists, models, isolation, invocation); the process semantics it restates
are summaries of [readme/meta/agents/roles.md](../readme/meta/agents/roles.md) and
[readme/meta/process/loops.md](../readme/meta/process/loops.md) — on conflict the
canonical doc wins, and edits re-sync here in the same commit.

The framework runs without this directory (delete it and `readme/` + `AGENTS.md` remain
complete) — but while working *in Claude Code*, its bindings of mandatory contracts are
the required way to satisfy them: peer review goes through the `reviewer` subagent,
always.

## What's here

| Piece | Maps to |
|-------|---------|
| `agents/reviewer.md` | reviewer role — fresh-context review is native here; **always use it for peer review** |
| `agents/analyst.md` | analyst role — isolates bulk reading from the main context |
| `agents/curator.md` | curator role — maintenance loop runs (via `/check`) |
| `agents/builder.md` | builder role — parallel task execution (worktree isolation; commit task files to the default branch first) |
| `skills/work` | `/work` — run the session loop autonomously from `state.md` + backlog |
| `skills/onboard` | `/onboard` — first-run onboarding |
| `skills/spec` | `/spec` — feature track: draft spec → PO gate → decompose |
| `skills/ingest` | `/ingest` — feed documents or start an interview |
| `skills/decide` | `/decide` — record an ADR |
| `skills/retro` | `/retro` — run a retro |
| `skills/check` | `/check` — maintenance audit (forks into the curator) |

The main session is the **orchestrator**; it is not a subagent. When unsure which
command applies: `/work` — it routes.

**Model tiering:** subagents run on cheaper models than the orchestrator — `reviewer`
on Opus (judgment-heavy), `analyst`/`builder`/`curator` on Sonnet — so parallel fan-out
doesn't burn usage limits. Escalate a single agent's `model:` only when its work
demonstrably needs it; the orchestrator keeps the strongest model because routing and
gate decisions compound.

## Optional: deterministic enforcement (hooks)

Markdown instructions are advisory; hooks in `.claude/settings.json` are guaranteed.
Hooks are the adapter contract's executable carve-out: the shipped kit is markdown-only,
and anything executable is opt-in on explicit PO approval — the onboarding interview
asks the PO whether to install this recommended baseline (any agent can write the file
on a yes). Hooks may only tighten enforcement (deny/verify), never grant what the
session couldn't already do:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "<lint/format command from the AGENTS.md Commands table> || exit 2" }]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "prompt", "prompt": "Block (deny) if this command deploys, publishes, migrates real data, deletes data, sends external communications, spends money, or grants access without the transcript showing explicit PO approval for that action (mandatory gate 2). Otherwise allow." }]
      }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "<test command from the AGENTS.md Commands table> || exit 2" }] }
    ]
  }
}
```

- **Stop** hook: blocks ending a turn with failing checks — hard-enforces "done means
  verified". Skip it in repos where the suite is slow; keep it where it's cheap.
- **PreToolUse** prompt hook: hard-enforces gate 2 for irreversible commands.
- **PostToolUse**: auto-lint on every edit.

Replace the `<placeholders>` with real commands during onboarding (after the Commands
table is verified). Further hooks should follow real incidents
([refinement signals](../readme/meta/process/refinement.md#signals)), not speculation.

## Usage-limit guard

Binds the canonical rule in
[orchestration.md#usage-limits](../readme/meta/process/orchestration.md#usage-limits):
suspend subagent spawns at ≥95%
of the 5-hour or weekly limit, resume at verified reset. PO-approved executable
(2026-07-13) under the adapter contract's opt-in carve-out.

| Piece | Role |
|-------|------|
| `scripts/usage-guard.ts` | measurement + decision (no deps; Node ≥22.18 or ≥23.6 runs it directly — verify once per environment, since a Node that can't run it fails open) |
| `usage-limits.json` | configured estimates: `threshold` (0.95), `five_hour_tokens`, `weekly_tokens`, `weekly_reset` (any past ISO anchor of the account's weekly reset instant) |
| `settings.json` PreToolUse `Task\|Agent` hook | deterministic gate: every subagent spawn runs `usage-guard.ts gate`; exit 2 denies the spawn with the reset time |
| `usage-limit-latch.json` | runtime latch (gitignored) — created by `latch`, self-clears past its reset |

**How it measures, honestly:** `ccusage` estimates tokens from local transcripts; plan
limits are dynamic and unpublished, so `usage-limits.json` holds *estimates* refined by
observation. **Until the config is populated, only the latch path enforces** — the 95%
gate needs limits to compare against, so the pre-emptive protection starts as latch-only
and becomes operative the first time an observed limit (or a plan-documented one) is
recorded. The authoritative signal is a real limit error from the harness — on seeing
one, the orchestrator runs `node .claude/scripts/usage-guard.ts latch <reset-ISO>
"<which limit>"` (the error names the reset; the command prints the two follow-through
steps: park `⏳limit` in `state.md`, record the observed tokens into
`usage-limits.json` so 95% fires earlier next time).

**Orchestrator protocol** (summary — canonical in orchestration.md#usage-limits):

- Poll `node .claude/scripts/usage-guard.ts status` before each spawn wave and ~15-min
  during long fan-outs (the hook is the backstop; polling avoids losing a wave's setup).
- On suspension: checkpoint spawned work (branch + progress → task files), park
  `⏳limit <reset>` in `state.md`, continue low-burn solo work or close cleanly.
- **Resume timer:** `sleep` until the reset in a background shell (5-hour reset =
  `fiveHour.resetsAt` from `status`; weekly = `weekly.resetsAt`), then one verification
  poll of `status` — the poll, not the timer, authorizes resuming; if still over, sleep
  to the next reset. Reset time unknown → poll hourly instead. Across sessions, the
  `⏳limit` entry in `state.md` carries the reset time; a scheduled `/work` session at
  that time (see below) resumes unattended.

## Optional: scheduled autonomy

Time-based triggers (maintenance cadence, idle-time backlog work) only fire when a
session runs. For a PO who wants zero babysitting, schedule a recurring `/work` session
(e.g., Claude Code scheduled agents/routines, or any cron invoking `claude
"/work"`) — the session loop makes an empty run cheap: it audits, parks `⏳PO` items
decision-ready, and exits.
