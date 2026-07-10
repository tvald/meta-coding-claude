<!-- LIVING doc — retro log, newest first, appended per readme/templates/retro.md.
     Cheap entries (3 bullets) are the norm. Budget: ~200 lines; archive older entries
     to readme/log/archive/ during maintenance. -->

# Retros

# Retro: 2026-07-10 [correction] PO feedback — no inline fallback

- **Trigger:** [correction] PO feedback
- **Scope:** orchestrator behavior on spawned-agent failure

## What happened

When the spend limit killed round-2 ideation agents, the orchestrator absorbed their
work inline. PO corrected: checkpoint and restart the agents instead — inline absorption
inflates cost and loses work.

## Gap

No rule governed spawned-role failure; the orchestrator improvised the most expensive
recovery. (Not a repeat: prior [correction] covered model tiering, a distinct topic.)

## Change made

Orchestrator *Must not* extended in `readme/agents/roles.md` (PO-approved authority
change); changelog row added; the interrupted round-2 work was restarted with proper
agents from its checkpoint (the saved ideas/verdicts in the session scratchpad).

# Retro: 2026-07-10 [correction] PO feedback

- **Trigger:** [correction] PO feedback
- **Scope:** improvement-loop agent usage

## What happened

Round-2 ideation agents hit the monthly subagent spend limit mid-loop; the PO directed
that subagents use simpler models (Opus, Sonnet) rather than the orchestrator's model.

## Gap

Subagent definitions defaulted to `model: inherit`, so every fan-out ran at
top-tier cost; nothing in the framework considered usage limits a resource to manage.

## Change made

Model tiering applied: `reviewer`→Opus, `analyst`/`builder`/`curator`→Sonnet, rationale
recorded in `.claude/README.md`; logged in the framework changelog. (First occurrence of
this correction topic — no prior entry found.)
