# Claude Code adapter

Native wiring for the process framework in `readme/`. The framework is portable —
everything here is convenience, not requirement; the contracts live in
[readme/agents/roles.md](../readme/agents/roles.md) and
[readme/process/loops.md](../readme/process/loops.md).

## What's here

| Piece | Maps to |
|-------|---------|
| `agents/reviewer.md` | reviewer role — fresh-context review is native here; **always use it for peer review** |
| `agents/analyst.md` | analyst role — isolates bulk reading from the main context |
| `agents/curator.md` | curator role — maintenance loop runs |
| `agents/builder.md` | builder role — parallel task execution (worktree isolation) |
| `skills/work` | `/work` — run the session loop autonomously from `state.md` |
| `skills/onboard` | `/onboard` — first-run onboarding |
| `skills/ingest` | `/ingest` — feed documents or start an interview |
| `skills/decide` | `/decide` — record an ADR |
| `skills/retro` | `/retro` — run a retro |
| `skills/check` | `/check` — consistency audit (maintenance loop) |

The main session is the **orchestrator**; it is not a subagent.

## Optional hooks (deterministic enforcement)

Markdown instructions are advisory; hooks in `.claude/settings.json` are guaranteed.
If process violations recur despite refinement, consider asking Claude to configure:

- **Stop** hook running the check suite — blocks ending a turn with failing checks
  (hard-enforces "done means verified").
- **PostToolUse** on Edit/Write running the formatter/linter.
- **PreToolUse** on Bash blocking irreversible commands (deploy/publish/migrate) without
  a `⏳PO`-approved marker — hard-enforces gate 2.

These are JSON configuration, not markdown, so the seed kit only documents them; adopt
per-project when a real incident justifies it (see
[refinement signals](../readme/process/refinement.md#signals)).
