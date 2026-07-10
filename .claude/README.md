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

## Optional: scheduled autonomy

Time-based triggers (maintenance cadence, idle-time backlog work) only fire when a
session runs. For a PO who wants zero babysitting, schedule a recurring `/work` session
(e.g., Claude Code scheduled agents/routines, or any cron invoking `claude
"/work"`) — the session loop makes an empty run cheap: it audits, parks `⏳PO` items
decision-ready, and exits.
