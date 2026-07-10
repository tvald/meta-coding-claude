# Decision log

<!-- PROCESS doc: how decisions are recorded. The ADR files beside this one are LIVING
     project history — append-only, never rewritten. -->

This directory is the project's immutable decision history. Each file is one Architecture
Decision Record (ADR) using [the template](../../templates/adr.md) — MADR-lite: Context,
Decision, Alternatives, Consequences. One page max.

ADRs are **history**, not current rules. Current rules live in `AGENTS.md` and
`readme/standards/`, distilled *from* decisions. When a decision changes, the old ADR is
never edited — a new ADR supersedes it, and the distilled rules are updated in the same
commit.

## When to record a decision (triggers)

Record an ADR when any of these happens — in the same session as the decision, while the
context is real rather than reconstructed:

- A **dependency, service, or tool** is adopted or rejected
- A **data model, schema, or persisted format** is chosen or changed
- An **external contract** is defined (API shape, file format, protocol, event schema)
- **Auth, security, or privacy** approach is chosen
- Anything **expensive to reverse** (a week+ to undo, or affecting stored data/users)
- The PO **overrules** a default or standard — the exception and its reason must outlive
  the conversation

(Deviating from an approved spec is *not* by itself a trigger — the bidirectional rule
records it in the spec ([orchestration](../../process/orchestration.md#the-feature-track));
write an ADR only when the deviation also hits one of the triggers above.)

Do **not** record: choices with no lasting consequence, style preferences already covered
by standards, or restatements of what the code shows. When unsure, apply the test:
*"Would a future agent, seeing the current state, plausibly redo this differently?"*
Yes → record.

One exception to "in the same session": [ingestion](../ingestion.md) may record
decisions a source document already made — date them to the source's decision and cite
it. That is transcription of history, not the after-the-fact reconstruction this rule
forbids.

## Who decides

- **PO decides** at gates (spec approval, irreversible actions) and whenever consulted.
- **Agents decide** everything else, within standards and prior decisions, and record
  ADRs marked `Decided by: agent`. The PO reviews these asynchronously via git — an ADR
  the PO disagrees with becomes a superseding ADR, not an edit.
- A PO request that contradicts a recorded ADR or standard gets **one challenge**:
  surface the conflict, with the reference, before executing. If the PO confirms,
  comply and record the superseding ADR (`Decided by: PO`) — never argue twice, and
  never comply silently.

## Mechanics

1. Next number = highest existing + 1, zero-padded to 4 digits: `NNNN-short-slug.md`.
2. Fill the template. Under one page. Write it *before or during* implementing the
   decision, never after the fact.
3. Update the index below in the same commit.
4. If it supersedes an ADR: mark the old one `Status: superseded by NNNN` (the only
   permitted edit to an existing ADR) and update any rules distilled from it.

## Reading the log

Agents should consult this index before proposing architectural changes, adding
dependencies, or redesigning anything — the alternative you're about to suggest may have
been rejected for reasons that still hold. The index is small; skim it whenever a task
touches architecture.

## Index

| # | Decision | Status | Date |
|---|----------|--------|------|
| [0001](0001-adopt-agentic-framework.md) | Adopt this agentic development framework | accepted | 2026-07-10 |
<!-- Append new rows at the bottom. Keep this table in sync in the same commit as the ADR. -->
