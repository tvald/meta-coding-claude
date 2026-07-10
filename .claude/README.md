# Claude Code adapter

<!-- PROCESS docs: everything under .claude/ belongs to the framework and changes via
     refinement (readme/process/refinement.md), logged in the framework changelog. -->

Native wiring for the process framework in `readme/`. The framework is portable —
everything here is convenience, not requirement; the contracts live in
[readme/agents/roles.md](../readme/agents/roles.md) and
[readme/process/loops.md](../readme/process/loops.md).

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

The main session is the **orchestrator**; it is not a subagent.

## Optional: deterministic enforcement (hooks)

Markdown instructions are advisory; hooks in `.claude/settings.json` are guaranteed. The
seed kit is markdown-only, so hooks aren't preinstalled — the onboarding interview asks
the PO whether to install this recommended baseline (any agent can write the file on a
yes):

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
        "hooks": [{ "type": "prompt", "prompt": "Block (deny) if this command deploys, publishes, migrates real data, deletes data, or sends external communications without the transcript showing explicit PO approval for that action (mandatory gate 2). Otherwise allow." }]
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
([refinement signals](../readme/process/refinement.md#signals)), not speculation.

## Optional: scheduled autonomy

Time-based triggers (maintenance cadence, idle-time backlog work) only fire when a
session runs. For a PO who wants zero babysitting, schedule a recurring `/work` session
(e.g., Claude Code scheduled agents/routines, or any cron invoking `claude
"/work"`) — the session loop makes an empty run cheap: it audits, parks `⏳PO` items
decision-ready, and exits.
