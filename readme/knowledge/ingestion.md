# Knowledge ingestion

<!-- PROCESS doc: how outside knowledge enters the knowledge base.
     Two protocols: document synthesis (PO gives you material) and interview (knowledge
     is in the PO's head). Both end the same way: synthesis → confirmation → filing. -->

Knowledge enters the project three ways: the PO hands over material (PRDs, notes, links,
transcripts), the PO answers questions, or agents discover facts while working. All three
converge on the same pipeline:

```
raw input → extract → reconcile with existing KB → synthesize → confirm → file → delete raw
```

The KB files and their purposes are defined in [management.md](management.md).

## Protocol A: Document synthesis

Use when the PO provides documents, meeting transcripts, chat logs, or external links.

1. **Read everything first.** Don't file as you go; conflicts between sources are the
   most valuable finding.
2. **Extract into four buckets:**
   - *Decisions* — anything chosen or ruled out → decision log
   - *Product facts* — users, goals, scope, constraints → `product.md`
   - *Terms* — domain vocabulary, especially where the source defines or implies a
     precise meaning → `glossary.md`
   - *Directives* — how the PO wants work done → `standards/` or `AGENTS.md`
3. **Reconcile before writing.** For each extracted item, check whether the KB already
   covers it. Three outcomes: *new* (file it), *duplicate* (skip, or improve the existing
   entry), *conflict* (the new source disagrees with the KB — never silently overwrite;
   list conflicts for the confirmation step).
4. **Synthesize a digest** for the PO: what was learned (grouped by bucket), conflicts
   found, and open questions the material raised. Keep it skimmable — the PO confirms
   the digest, not the filing.
5. **Confirm.** Present the digest. Conflicts and surprising interpretations need
   explicit answers; the rest proceeds immediately — file with `[ASSUMPTION]` markers on
   interpretations rather than waiting (markers make late PO objections cheap to apply).
   A document the PO *authored* is already PO intent: specs derived faithfully from it
   inherit approval for their unchanged content, and gate review covers only added
   interpretation — don't make the PO approve their own words twice.
6. **File, queue, and clean up.** Write to the KB (one home per fact); record decisions
   as ADRs (dated to when the source decided them — see the
   [retroactive exception](decisions/README.md)); **queue the implied work**: committed
   features become [backlog](../work/backlog.md) entries, with stub draft specs in
   `readme/work/specs/` where the material carries requirement detail too rich for a
   backlog line. Only after everything actionable is captured, delete or archive the raw
   material (`readme/log/archive/` accepts raw ingestion sources) — raw inputs left
   around become a second, contradicting source of truth. Material pasted in
   conversation has nothing to delete; material the PO committed to the repo is theirs —
   propose the cleanup, don't just do it.

## Protocol B: PO interview

Use when knowledge must come out of the PO's head: a new project, a vague request, open
questions blocking a spec, or accumulated `[ASSUMPTION]` markers. Worksheet:
[../templates/interview.md](../templates/interview.md).

**Rules of engagement**

- **Never ask what you can look up.** Check the KB, the code, and provided documents
  first. Asking the PO an already-answered question erodes trust in the whole system.
- **Lead with your best guess.** Every question offers a proposed default so the PO can
  answer "yes" instead of writing a paragraph. *"Should exports be CSV? I'd default to
  CSV-only for v1, adding JSON later if asked."*
- **Batch small, in interactive settings 1–3 questions per message.** Walls of questions
  cause fatigue and rushed answers. For async settings (the PO will respond later), up to
  ~10 in one well-organized worksheet is fine.
- **Scale the total to the stakes.** A small feature deserves ≤10 questions; a new
  product 30–40; never more than ~50 in any ingestion effort. If you still lack clarity
  after that, the gap is a discovery task (prototype, research), not more questions.
- **"I don't know" is an answer.** File it as an open question with your default adopted
  as `[ASSUMPTION]`, and move on.
- **Implementation starts from the written artifact, not the conversation.** Synthesize
  and file first; build from what was filed. For substantial interviews (onboarding, a
  new feature area), prefer a fresh session for the build — conversational residue
  (half-retracted statements, abandoned directions) contaminates specs. A one-or-two
  question clarification mid-task is not an interview and doesn't trigger this rule.

**Question priority order** — spend the PO's patience on:

1. Conflicts (KB vs new information, or PO statements vs each other)
2. Decisions that are expensive to reverse (data models, external contracts, auth)
3. Scope boundaries (what is explicitly *out*)
4. Oldest `[ASSUMPTION]` markers
5. Everything else — prefer adopting defaults over asking

**Closing an interview:** synthesize what you heard back to the PO in KB-ready form
("Here's what I'm recording: …"). Confirmation of the synthesis — not each raw answer —
is the sign-off. Then file per the pipeline and delete the worksheet.

## Protocol C: Discovery during work

Agents constantly learn things mid-task: a quirk of the build, a real constraint, a de
facto convention. The rule is the **distill-before-close** step of the task loop
(see [../process/loops.md](../process/loops.md)): before a task is closed, sweep its
notes and file anything with a life beyond the task:

| Discovery | Destination |
|-----------|-------------|
| A choice with lasting consequences was made | decision log (ADR) |
| A term acquired a precise meaning | `glossary.md` |
| A convention or gotcha future work must know | `standards/derived.md` |
| A product-level fact emerged | `product.md` (with `[ASSUMPTION]` if PO hasn't confirmed) |
| A fact about an external system (API behavior, third-party constraint) | the spec that depends on it; `product.md` *Constraints* if product-wide |
| An approach was tried and failed | `state.md` → *Known dead ends* |
| Everything else | nowhere — most notes should die with the task |

Discovery filing needs no PO confirmation (it's marked `[ASSUMPTION]` where
interpretive), but it does ride in the same commit as the work that produced it.

## Bootstrapping a new or existing project

The first ingestion is special — see the onboarding procedure in
[../process/orchestration.md](../process/orchestration.md#onboarding), which combines
Protocol A (over anything the PO provides), repo analysis (for existing code), and a
Protocol B interview to fill `product.md` and seed the standards.
