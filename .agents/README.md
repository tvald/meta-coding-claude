# Codex adapter

<!-- PROCESS docs: everything under .agents/ belongs to the framework and changes via
     refinement (readme/meta/process/refinement.md), logged in the framework changelog. -->

Native wiring for the process framework in `readme/` for OpenAI Codex (and any harness
that loads [Agent Skills](https://agentskills.io) from `.agents/skills/`), bound by the
[adapter contract](../readme/meta/README.md#adapters): this directory owns only harness
bindings; the process semantics it restates are summaries of
[readme/meta/agents/roles.md](../readme/meta/agents/roles.md) and
[readme/meta/process/loops.md](../readme/meta/process/loops.md) — on conflict the
canonical doc wins, and edits re-sync here in the same commit.

The framework runs without this directory (delete it and `readme/` + `AGENTS.md` remain
complete) — but while working *in Codex*, its bindings of mandatory contracts are the
required way to satisfy them: peer review always runs in a context that did not build
the diff.

Codex reads the repo-root `AGENTS.md` natively — no shim file is needed (unlike
`CLAUDE.md` for Claude Code).

## What's here

Skills in `.agents/skills/`, invocable explicitly (`$work`) or selected implicitly from
their descriptions:

| Skill | Maps to |
|-------|---------|
| `work` | session loop — run autonomously from `state.md` + backlog |
| `onboard` | first-run onboarding |
| `spec` | feature track: draft spec → PO gate → decompose |
| `ingest` | ingestion loop — feed documents or start an interview |
| `decide` | record an ADR |
| `retro` | run a retro |
| `check` | maintenance audit |

The main session is the **orchestrator**; when unsure which skill applies: `work` — it
routes.

## Role bindings

Per the portable rule in [roles.md](../readme/meta/agents/roles.md#runtime-mapping),
any isolated context satisfies a role contract. In Codex:

- **Reviewer** (fresh context is *mandatory*): delegate to a separate agent, or run a
  separate `codex exec` session, given only the diff, its task/spec, and the standards —
  never the session that built the diff.
- **Analyst**: delegate bulk reading/synthesis to a separate agent to keep the main
  context lean; pass source material verbatim (paths/URLs or full text).
- **Builder**: parallel tasks run as separate `codex exec` sessions, each from a clean
  checkout/worktree of the default branch, with task files committed there first.
- **Curator**: a hat in the main session, or a delegate for full audits.
- Where the harness offers model selection for delegated work, run delegates on cheaper
  models and keep the strongest model for the orchestrator — routing and gate decisions
  compound.

## Optional: deterministic enforcement

Markdown instructions are advisory. Codex supports hooks and sandbox/approval config
that can hard-enforce "done means verified" (block ending with failing checks) and
gate-2 protection (deny irreversible commands without PO approval). Per the adapter
contract, none of this ships preinstalled: the onboarding interview asks the PO whether
to install it, using the then-current Codex hooks/config syntax from the official docs
(verify against the docs at install time — do not trust this file's memory of the
syntax). Enforcement may only tighten (deny/verify), never grant what the session
couldn't already do.

<!-- Facts about Codex conventions (AGENTS.md native, .agents/skills location, SKILL.md
     format, custom prompts deprecated, codex exec, hooks) verified against
     developers.openai.com/codex → learn.chatgpt.com docs on 2026-07-10. Decaying facts:
     re-verify on next maintenance touch. -->
