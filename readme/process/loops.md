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
- **Learn on exit.** Every loop's last step is the cheap retro *question*: *did anything
  here reveal a gap worth fixing?* A written entry is required only when the answer is
  yes, and once per session at close (see [Retro loop](#retro-loop)) — asking is
  mandatory, writing "none" repeatedly is not.

## Session loop

The outermost loop — wraps everything a working session does.

- **Trigger:** a session starts.
- **Boot:** read [state.md](../knowledge/state.md) (the now). If it disagrees with
  recent `git log` — commits it doesn't reflect — the previous session crashed before
  closing: reconcile *Recently done* / *Current focus* from git first. Then route the
  session's goal via the [orchestration table](orchestration.md#routing). If the PO gave
  no goal, take the top unblocked item of *Next steps* in `state.md`, then the top of
  the [backlog](../work/backlog.md); if both are empty, run the
  [Maintenance loop](#maintenance-loop).
- **Work:** run the routed loops below.
- **Close (never skip, even on failure):** update `state.md` (current focus, recently
  done, next steps, dead ends) → ensure work is committed → retro
  ([cheap form](#retro-loop)). Scale it to the session: a one-quick-task session closes
  with a one-line *Recently done* entry and the retro question.
- **Exit:** `state.md` accurately describes the world for the next session. A session
  whose only output is a decision-ready `⏳PO` item (e.g., PO absent at a gate) is a
  *successful* session — park it and end cleanly.

## Task loop

The inner build loop — one task to one verified change. Run by a [builder](../agents/roles.md#builder).

- **Trigger:** a routed task with a stated goal and verification criteria
  ([template](../templates/task.md) if it spans sessions or agents).
- **Steps:**
  1. **Orient** — read the task, its spec (if any), `state.md` *Known dead ends*, the
     relevant [standards](../standards/derived.md), and the
     [glossary](../knowledge/glossary.md) for any domain terms involved. Skim the
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

  **Isolated/parallel builders** (single-writer rule —
  [orchestration](orchestration.md#parallelization)): wherever these steps say to write
  to `state.md` or any shared KB file, stage the entry in your task file instead; the
  orchestrator applies it at merge, and runs your retro question then too.
- **Exit:** review passed at the routed level; work committed.
- **Failure handling:** *blocked* → record blocker in `state.md`, move on. *Approach
  failed* → record in *Known dead ends*, try the next approach (counts toward the
  overrun rule). *Verification can't pass* → the task stays open; report the failure
  honestly, never downgrade the checks to match the code.

## Ingestion loop

Knowledge-in. Run by an [analyst](../agents/roles.md#analyst).

- **Trigger:** the PO provides material; a spec has open questions; `[ASSUMPTION]`
  markers accumulate (≥5 by grep, or any *blocking* one — an assumption a current task
  depends on); onboarding.
- **Steps:** run the matching [protocol](../knowledge/ingestion.md) (A: documents,
  B: interview, C is embedded in the task loop) → file → confirm per protocol.
- **Exit:** KB updated; **implied work queued** — features the material commits to
  become [backlog](../work/backlog.md) entries (or stub specs when detail is rich);
  raw inputs deleted/archived; conflicts resolved or explicitly queued with `⏳PO`.
  Ingested material that produces no queued work and no KB change was noise — say so.
- **Failure handling:** PO unavailable → adopt defaults with `[ASSUMPTION]`, never block
  on non-conflicting facts. There is no waiting period — file immediately; `[ASSUMPTION]`
  markers make late PO objections cheap to apply.

## Review loop

Judgment on a finished change. Run by a [reviewer](../agents/roles.md#reviewer) with
fresh context — in Claude Code, always a separate subagent.

- **Trigger:** a task exits its build phase at review level *peer* or *gated*. The
  orchestrator hands the reviewer the task file and the branch/commit range.
- **Steps:**
  1. Read the spec/task first — know what the change *should* do before seeing the code.
  2. Read the full diff against the [definition of done](../standards/quality-gates.md#definition-of-done)
     and standards.
  3. Independently re-run acceptance checks and the check suite on a checkout of the
     change. Reported results are claims, not evidence. Checks the reviewer genuinely
     cannot execute (manual/UI steps) are judged from the builder's recorded evidence
     and marked *accepted on evidence*, never silently counted as verified.
  4. Hunt for absences: unhandled edge cases, missing tests, security exposure
     (injection, secrets, authz), scope creep.
  5. Return findings: each is *blocking* or *advisory*, with file:line and a concrete
     fix direction.
- **Exit:** approve; or findings go back to a builder, and re-review covers the deltas
  plus anything the fixes could have disturbed. Either way, the verdict, findings, and
  any waivers are recorded in the task file's *Review* section (by the orchestrator or
  fixing builder — the reviewer itself doesn't write).
- **Failure handling:** two rounds of re-review without convergence → escalate to the
  orchestrator (the task is probably mis-scoped or the spec ambiguous — that's a routing
  failure, not a review failure).

## Maintenance loop

Upkeep. Run by a [curator](../agents/roles.md#curator).

- **Trigger:** idle capacity; anything smells stale; or the dated entries in
  [retros.md](../log/retros.md) show the last maintenance run is ≥2 weeks or ≥~10 task
  closes ago (every maintenance run leaves a dated retro entry, so the log itself is
  the schedule).
- **Steps:**
  1. Run the [consistency checks](../knowledge/management.md#consistency-checks)
     (symbols, anchors, contradictions, commands, assumptions).
  2. Enforce budgets — archive overflow per [management.md](../knowledge/management.md).
     Long-lived *Known dead ends* whose reasons still hold graduate to `derived.md`
     *Gotchas* rather than aging out into the archive.
  3. **Read the retros** since the last maintenance run: recurring gaps, repeated
     `[correction]` tags, or the same review-finding class → these are
     [refinement signals](refinement.md#signals); apply the refinement procedure.
  4. Framework prune — per [refinement.md](refinement.md#pruning): sunset checks on
     refinement-added rules, contradiction resolution, compression.
  5. Repo hygiene sweep within standards: broken links in docs, dead references.
- **Exit:** trivial repairs applied immediately (each its own small commit); the rest
  queued in `state.md` *Next steps*; `last-verified` updated on all checked docs.
- **Failure handling:** systemic findings (the same class of rot recurring) are a
  refinement signal — fix the process, not just the instances.

## Retro loop

Learning. Usually a hat worn at another loop's exit, not a separate agent.

- **Trigger (cheap form):** at minimum once per session at close, and at any loop exit
  where the retro question finds something — three short fields on the
  [template](../templates/retro.md): what happened / gap / change made, dated. Under two
  minutes; inserted at the top of [../log/retros.md](../log/retros.md). "Gap: none" is a
  fine outcome. **Every PO correction gets an entry tagged `[correction]`** — and before
  treating any correction as first-time, grep `retros.md` (and its archive) for a prior
  entry on the same topic: a repeat makes a rule change mandatory
  ([refinement](refinement.md#signals)).
- **Trigger (deep form):** a gate was missed; the PO corrected the same thing twice;
  verification passed but the result was wrong; a loop hit the overrun rule; a review
  found a class of problem (not an instance).
- **Steps (deep):** reconstruct what the system believed vs what was true → locate the
  doc/loop that should have prevented it → apply the fix via
  [refinement.md](refinement.md) → log it.
- **Exit:** every non-empty gap produced a concrete change or an explicit
  "accepted: not worth fixing because …". Awareness is not a change.
