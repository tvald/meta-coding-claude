# Knowledge management

<!-- PROCESS doc: how the knowledge base works. Read this before writing to any knowledge file. -->

The knowledge base (KB) is everything under `readme/knowledge/` plus the standards in
`readme/standards/`. It exists so that any agent, in any session, can act with the
product owner's context without asking for it again.

## Doc taxonomy

Every markdown file in this framework is one of three kinds:

| Kind | Owned by | Changes when | Examples |
|------|----------|--------------|----------|
| **PROCESS** | the framework | the process itself is improved (via [refinement](../process/refinement.md)) | this file, `orchestration.md`, everything under `.claude/` |
| **LIVING** | the project | the product/code/decisions change | `product.md`, `state.md`, `standards/derived.md`, decision log, work artifacts |
| **TEMPLATE** | the framework | via refinement, like PROCESS | everything under `templates/` |

Each file declares its kind in an HTML comment at the top (`AGENTS.md` and `CLAUDE.md`
are PROCESS; their declaration lives in this sentence because memory injection strips
their comments). A PROCESS doc may embed a clearly marked **living section** — the
Commands table in `AGENTS.md`, the index table in `decisions/README.md`, the fill-in
sections of `derived.md` — which follows LIVING rules: routine updates to it are project
work, not refinement. PROCESS docs change rarely and deliberately; LIVING docs change
constantly and cheaply.

**Summaries:** `AGENTS.md` may condense a canonical rule for always-loaded convenience,
marked *(summary)* with a link. The canonical doc wins on conflict, and any edit to a
canonical fact updates its summaries in the same commit (grep for the anchor).

## The knowledge files

This table is the canonical budget list for all living docs.

| File | Holds | Budget |
|------|-------|--------|
| [product.md](product.md) | Why the project exists: vision, users, scope, constraints, delivery | ~200 lines |
| [state.md](state.md) | The now: current focus, recent changes, next steps, known-failed approaches | **60 lines hard cap**; *Next steps* ≤10 items |
| [glossary.md](glossary.md) | Domain terms with precise meanings | 1–2 lines per term |
| [decisions/](decisions/README.md) | Immutable decision history (ADRs) | one page per decision |
| [../standards/derived.md](../standards/derived.md) | Stack- and repo-specific conventions | ~150 lines |
| [../work/backlog.md](../work/backlog.md) | Known-but-not-now work, priority-ordered | ~150 lines |
| [../work/](../work/README.md) specs & tasks | In-flight work artifacts | per their templates; archived per [work/README](../work/README.md) |
| [../log/retros.md](../log/retros.md) | Retro entries | ~200 lines |
| [../log/framework-changelog.md](../log/framework-changelog.md) | Framework self-modification audit | ~100 entries |

Budgets are enforced by **archival, not deletion**: when a living doc exceeds its budget,
move the oldest/least-relevant content to `readme/log/archive/` (named
`sourcefile-YYYY-MM.md`) and leave a one-line pointer. Two exceptions: `state.md`
*Next steps* overflow goes to the [backlog](../work/backlog.md), never the archive
(archived work is lost work); *Known dead ends* whose reasons still hold graduate to
`derived.md` *Gotchas*. Never let a budget stop you from recording something — record
first, archive to make room.

## Rules of the knowledge base

1. **One canonical home per fact.** Every fact has exactly one owning file; everything
   else links to it, or condenses it as a marked *(summary)* that identifies the owner
   (see above) and is re-synced in the same commit as any change to the canonical
   statement. The same fact *stated* independently in two places is a defect — fix it by
   picking the canonical home and replacing the other with a link or marked summary.
2. **Update in the same commit.** Knowledge updates ride along with the change that made
   them true. A separate "update the docs" chore will never happen. If a code change
   renames a concept, the same commit updates the glossary, specs, and any doc that
   references it.
3. **Stale is worse than absent.** A wrong doc misleads with confidence. If you discover
   a doc contradicting the code, the code is the truth about *what is*; docs are the truth
   about *what is intended* and *why*. Reconcile immediately: fix the doc, or if the code
   drifted from an approved intention, flag it as a defect in `state.md`.
4. **Record decisions when they happen.** See [decisions/README.md](decisions/README.md)
   for triggers. A decision recorded a week later is fiction.
5. **Don't restate the code.** No file-by-file codebase tours, no API references, no
   architecture diagrams that a reader could get by reading the code. The KB records what
   the code *cannot say*: intent, rejected alternatives, product context, tribal setup
   knowledge.
6. **Mark assumptions.** Anything believed but not confirmed by the PO carries an
   `[ASSUMPTION]` marker. Consistency checks and interviews target these first.

## Freshness metadata

Every *stateful* LIVING doc — `product.md`, `glossary.md`, `derived.md`, active specs —
starts with a metadata block. Exempt: append-only logs (retros, changelog), the backlog
(continuously re-prioritized), immutable ADRs, and `state.md` (rewritten every session;
its freshness is its git mtime):

```markdown
<!-- LIVING doc
     last-verified: 2026-07-09
     anchors: src/core/engine.ts, package.json  (files whose change likely invalidates this doc)
-->
```

- `last-verified` is updated whenever an agent confirms the doc still matches reality
  (not merely when the doc is edited).
- `anchors` lists code paths this doc's claims depend on. The consistency check compares
  anchor modification times against `last-verified`.

## Consistency checks

The maintenance loop (see [../process/loops.md](../process/loops.md)) runs these audits.
Any agent may also run them ad hoc when something feels off.

1. **Symbol check** — extract backticked identifiers and file paths from every KB doc;
   verify each still exists in the repo (`grep`/glob). Missing → the doc *needs review*
   (usually drift, sometimes a command or conceptual name the check can't resolve —
   confirm before "fixing"). Skip identifiers inside HTML comments and explicitly
   marked examples — they illustrate, not claim.
2. **Anchor check** — for each LIVING doc, compare `last-verified` against the git
   modification dates of its `anchors`. Anchor newer than verification → re-verify.
3. **Contradiction check** — read the KB end to end (it is small by design) and flag
   claims that conflict with each other or with observed code behavior.
4. **Command check** — run every command the docs claim works (build, test, lint).
   Long-running commands (`run locally`) are verified to *start cleanly*, then
   terminated. Failure → fix doc or fix repo.
5. **Assumption sweep** — list all `[ASSUMPTION]` markers; queue the oldest for the next
   PO interview.

Findings become repair actions executed immediately when trivial, or queued in
`state.md` under *Next steps* when not. After a full audit, update `last-verified` on
every checked doc. These checks are signals, not proof: a check that repeatedly flags
non-problems is itself a [refinement signal](../process/refinement.md#signals) — narrow
it or prune it.

## What does NOT go in the KB

- Task-scoped notes (keep in the task doc; distill before closing).
- Anything the code or git history already states.
- Speculation about future features (goes in `product.md` scope section only if the PO
  has actually said it).
- Secrets, credentials, personal data. Never.
