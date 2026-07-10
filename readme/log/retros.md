<!-- LIVING doc — retro log, newest first, appended per readme/templates/retro.md.
     Cheap entries (3 bullets) are the norm. Budget: ~200 lines; archive older entries
     to readme/log/archive/ during maintenance. -->

# Retros

# Retro: 2026-07-10 — human-facing README session

- **What happened:** PO requested a high-level root `README.md` explaining the framework
  to a human; written from the canonical docs, all links verified, changelog + state updated.
- **Gap:** none — routing (Quick track, pre-onboarding exception) and closure were unambiguous.
- **Change made:** none.

# Retro: 2026-07-10 — alternative-framework review session

- **Trigger:** session close (PO-directed comparative review)
- **Scope:** critique of tmp/ framework + import refinements

## What happened

Reviewed an external meta-framework end-to-end, wrote the critique (tmp/, uncommitted
per PO instruction), and imported five concepts as three doc refinements (trust tiers,
decaying facts, untrusted-evidence rule, gate presentation content).

## Gap

The imported security rules covered a real hole (ingested material had no trust
classification), and no internal refinement signal would ever have surfaced it —
signals are incident-driven, and this gap only shows up as an incident *after*
a prompt-injection event. Found only because the PO commissioned an external
comparison. Single occurrence; no rule change — but if a second external comparison
finds another silent gap, consider a periodic benchmarking practice.

## Change made

None beyond the imports themselves (logged in the framework changelog).

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
