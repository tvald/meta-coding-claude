# Standard loops

<!-- PROCESS doc: the repeatable procedures every agent runs. Each loop has a trigger,
     steps, an exit criterion, and failure handling. Loops keep their state in files,
     never in conversational memory — any loop must be resumable by a different agent
     in a different session. -->

Cross-cutting rules for every loop:

- **Durable exits.** A loop ends by writing its outcome somewhere that outlives the
  session (`state.md`, a task doc, the KB, a commit). If it isn't written, it didn't
  happen.
- **Overrun rule.** A loop that has consumed ~2x its expected size without converging
  stops and re-routes: split the work, record the dead end, or escalate the track
  ([orchestration](orchestration.md)). Grinding is not persistence.
- **Learn on exit.** Every loop's last step is the cheap retro question: *did anything
  here reveal a gap worth fixing?* (see [Retro loop](#retro-loop)).

## Session loop

The outermost loop — wraps everything a working session does.

- **Trigger:** a session starts.
- **Boot:** read [state.md](../knowledge/state.md) (the now), then route the session's
  goal via the [orchestration table](orchestration.md#routing). If the PO gave no goal,
  take the top of *Next steps* in `state.md`; if that's empty, run the
  [Maintenance loop](#maintenance-loop).
- **Work:** run the routed loops below.
- **Close (never skip, even on failure):** update `state.md` (current focus, recently
  done, next steps, dead ends) → ensure work is committed → 3-bullet retro.
- **Exit:** `state.md` accurately describes the world for the next session.

## Task loop

The inner build loop — one task to one verified change. Run by a [builder](../agents/roles.md#builder).

- **Trigger:** a routed task with a stated goal and verification criteria
  ([template](../templates/task.md) if it spans sessions or agents).
- **Steps:**
  1. **Orient** — read the task, its spec (if any), `state.md` *Known dead ends*, and
     the relevant [standards](../standards/derived.md). Skim the
     [decision index](../knowledge/decisions/README.md) if touching architecture.
  2. **Plan** — decide approach and files to touch; write it into the task. Size-check:
     if it's an L, stop and split ([orchestration](orchestration.md#escalation)).
     ADR triggers fire *now*, before code.
  3. **Build** — implement in small verified increments; tests alongside code, not after
     the fact. On any deviation from the plan or spec, update the plan/spec in the same
     commit (**bidirectional rule**).
  4. **Verify** — execute the task's acceptance checks and the full check suite; watch
     them pass ([quality gates](../standards/quality-gates.md)).
  5. **Distill** — sweep discoveries into the KB per the
     [discovery table](../knowledge/ingestion.md#protocol-c-discovery-during-work).
  6. **Close** — self-check the [definition of done](../standards/quality-gates.md#definition-of-done);
     hand to review at the routed level; update `state.md`.
- **Exit:** review passed at the routed level; work committed.
- **Failure handling:** *blocked* → record blocker in `state.md`, move on. *Approach
  failed* → record in *Known dead ends*, try the next approach (counts toward the
  overrun rule). *Verification can't pass* → the task stays open; report the failure
  honestly, never downgrade the checks to match the code.

## Ingestion loop

Knowledge-in. Run by an [analyst](../agents/roles.md#analyst).

- **Trigger:** the PO provides material; a spec has open questions; `[ASSUMPTION]`
  markers accumulate (≥5 or any blocking one); onboarding.
- **Steps:** run the matching [protocol](../knowledge/ingestion.md) (A: documents,
  B: interview, C is embedded in the task loop) → file → confirm per protocol.
- **Exit:** KB updated; raw inputs deleted/archived; conflicts resolved or explicitly
  queued with `⏳PO`.
- **Failure handling:** PO unavailable → adopt defaults with `[ASSUMPTION]`, never block
  on non-conflicting facts.

## Review loop

Judgment on a finished change. Run by a [reviewer](../agents/roles.md#reviewer) with
fresh context — in Claude Code, always a separate subagent.

- **Trigger:** a task exits its build phase at review level *peer* or *gated*.
- **Steps:**
  1. Read the spec/task first — know what the change *should* do before seeing the code.
  2. Read the full diff against the [definition of done](../standards/quality-gates.md#definition-of-done)
     and standards.
  3. Independently re-run acceptance checks and the check suite. Reported results are
     claims, not evidence.
  4. Hunt for absences: unhandled edge cases, missing tests, security exposure
     (injection, secrets, authz), scope creep.
  5. Return findings: each is *blocking* or *advisory*, with file:line and a concrete
     fix direction.
- **Exit:** approve; or findings go back to a builder, and re-review covers the deltas
  plus anything the fixes could have disturbed.
- **Failure handling:** two rounds of re-review without convergence → escalate to the
  orchestrator (the task is probably mis-scoped or the spec ambiguous — that's a routing
  failure, not a review failure).

## Maintenance loop

Upkeep. Run by a [curator](../agents/roles.md#curator).

- **Trigger:** idle capacity; every ~10 closed tasks or ~2 weeks, whichever first
  (track via *Recently done* in `state.md`); or anything smells stale.
- **Steps:**
  1. Run the [consistency checks](../knowledge/management.md#consistency-checks)
     (symbols, anchors, contradictions, commands, assumptions).
  2. Enforce budgets — archive overflow per [management.md](../knowledge/management.md).
  3. Framework prune — per [refinement.md](refinement.md#pruning): rules that never
     fired, sections nobody reads, sunset checks.
  4. Repo hygiene sweep within standards: broken links in docs, dead references.
- **Exit:** trivial repairs applied immediately (each its own small commit); the rest
  queued in `state.md` *Next steps*; `last-verified` updated on all checked docs.
- **Failure handling:** systemic findings (the same class of rot recurring) are a
  refinement signal — fix the process, not just the instances.

## Retro loop

Learning. Usually a hat worn at another loop's exit, not a separate agent.

- **Trigger (cheap form):** end of every task and session — three bullets on the
  [template](../templates/retro.md): what happened / gap / change made. Under two
  minutes; appended to [../log/retros.md](../log/retros.md). "Gap: none" is a fine
  outcome and most common.
- **Trigger (deep form):** a gate was missed; the PO corrected the same thing twice;
  verification passed but the result was wrong; a loop hit the overrun rule; a review
  found a class of problem (not an instance).
- **Steps (deep):** reconstruct what the system believed vs what was true → locate the
  doc/loop that should have prevented it → apply the fix via
  [refinement.md](refinement.md) → log it.
- **Exit:** every non-empty gap produced a concrete change or an explicit
  "accepted: not worth fixing because …". Awareness is not a change.
