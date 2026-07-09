# Knowledge management

<!-- PROCESS doc: how the knowledge base works. Read this before writing to any knowledge file. -->

The knowledge base (KB) is everything under `readme/knowledge/` plus the standards in
`readme/standards/`. It exists so that any agent, in any session, can act with the
product owner's context without asking for it again.

## Doc taxonomy

Every markdown file in this framework is one of two kinds:

| Kind | Owned by | Changes when | Examples |
|------|----------|--------------|----------|
| **PROCESS** | the framework | the process itself is improved (via [refinement](../process/refinement.md)) | this file, `orchestration.md`, templates |
| **LIVING** | the project | the product/code/decisions change | `product.md`, `state.md`, `standards/derived.md`, decision log |

Each file declares its kind in an HTML comment at the top. PROCESS docs change rarely and
deliberately; LIVING docs change constantly and cheaply.

## The knowledge files

| File | Holds | Budget |
|------|-------|--------|
| [product.md](product.md) | Why the project exists: vision, users, scope, constraints | ~200 lines |
| [state.md](state.md) | The now: current focus, recent changes, next steps, known-failed approaches | **60 lines hard cap** |
| [glossary.md](glossary.md) | Domain terms with precise meanings | one line per term |
| [decisions/](decisions/README.md) | Immutable decision history (ADRs) | one page per decision |
| [../standards/derived.md](../standards/derived.md) | Stack- and repo-specific conventions | ~150 lines |

Budgets are enforced by **archival, not deletion**: when a living doc exceeds its budget,
move the oldest/least-relevant content to `readme/log/archive/<filename>-YYYY-MM.md` and
leave a one-line pointer. Never let a budget stop you from recording something — record
first, archive to make room.

## Rules of the knowledge base

1. **One home per fact.** Every fact lives in exactly one file; everything else links to
   it. If you find the same fact stated in two places, that is a defect — fix it by
   picking the canonical home and replacing the other with a link.
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

Every LIVING doc starts with a metadata block:

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
   verify each still exists in the repo (`grep`/glob). Missing → doc is stale.
2. **Anchor check** — for each LIVING doc, compare `last-verified` against the git
   modification dates of its `anchors`. Anchor newer than verification → re-verify.
3. **Contradiction check** — read the KB end to end (it is small by design) and flag
   claims that conflict with each other or with observed code behavior.
4. **Command check** — run every command the docs claim works (build, test, lint).
   Failure → fix doc or fix repo.
5. **Assumption sweep** — list all `[ASSUMPTION]` markers; queue the oldest for the next
   PO interview.

Findings become repair actions executed immediately when trivial, or queued in
`state.md` under *Next steps* when not. After a full audit, update `last-verified` on
every checked doc.

## What does NOT go in the KB

- Task-scoped notes (keep in the task doc; distill before closing).
- Anything the code or git history already states.
- Speculation about future features (goes in `product.md` scope section only if the PO
  has actually said it).
- Secrets, credentials, personal data. Never.
