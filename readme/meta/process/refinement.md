# Framework refinement

<!-- PROCESS doc: how the framework improves itself. The framework is code for a team of
     agents; like code, it accrues bugs (rules that misfire), dead code (rules that never
     fire), and missing features (gaps). This doc is the process for fixing it — applied
     automatically, audited via git. -->

## Signals

A refinement is warranted when one of these fires. Everything else is noise — resist
tinkering with the process on aesthetics.

| Signal | Strength |
|--------|----------|
| PO corrects the same thing twice | **mandatory** — a rule must change so the third time can't happen |
| PO gives explicit process feedback ("stop doing X", "always Y") | **mandatory** — apply immediately |
| A quality gate passed but the outcome was wrong | strong — a check is missing or toothless |
| Retro (deep form) identifies a process gap | strong |
| The same class of review finding recurs across tasks | strong — move the rule upstream into standards |
| A loop hits the overrun rule for process reasons (agent didn't know where to look, docs contradicted) | strong |
| An agent couldn't answer "where does this go / what applies here?" from the docs | moderate — a routing or ownership gap |
| A rule was consciously worked around | moderate — the rule may be wrong |
| The maintenance pulse worsens two consecutive runs ([loops](loops.md#maintenance-loop)) | strong — find the loop that degraded, not just the instances |

## The refinement procedure

1. **Locate the owning doc.** Every rule has one home
   ([one home per fact](../knowledge/management.md#rules-of-the-knowledge-base)). Fix the
   home, not a new doc. Placement guide:
   - who may decide / gates → [quality-gates.md](../standards/quality-gates.md)
   - how work is classified/split → [orchestration.md](orchestration.md)
   - how a loop runs → [loops.md](loops.md)
   - how code is written → [standards](../standards/engineering.md) (durable) or
     [derived.md](../../standards/derived.md) (this repo)
   - how knowledge is handled → [management.md](../knowledge/management.md) /
     [ingestion.md](../knowledge/ingestion.md)
   - role contracts → [roles.md](../agents/roles.md)
   - Claude Code wiring (subagents, skills) → `.claude/` (PROCESS files; refinements
     there are logged like any other)
   - always-loaded rules → `AGENTS.md` (last resort — see budget rule)
2. **Design the smallest edit that would have prevented the triggering incident.**
   Prefer, in order: *sharpening an existing line* → *replacing a line* → *adding a
   line* → *adding a section*. New documents require a recurring pattern, never a single
   incident.
3. **Apply it.** Directly — no proposal queue. Write rules in the effective forms:
   prohibition + alternative ("don't X → do Y"), decision table, or one concrete
   example. Never vague admonitions ("be careful with X" changes nothing).
4. **Log it** in [../log/framework-changelog.md](../../log/framework-changelog.md):
   date, doc, change, trigger. Same commit as the edit. The changelog is how the PO
   audits process drift asynchronously — an entry the PO dislikes gets reverted by a
   follow-up refinement, not by rewriting history. For changes that alter verification
   requirements, routing defaults, or retention behavior, the entry also states the
   expected before/after behavior in a phrase — that's what the sunset check
   ([pruning](#pruning)) later judges the rule against.
5. **Re-sync summaries.** If the edited fact is condensed anywhere (the *(summary)*
   sections of `AGENTS.md` — [management.md](../knowledge/management.md#doc-taxonomy)),
   update the summary in the same commit.

## Limits on self-modification

The framework may not use refinement to loosen its own leash. Changes to any of the
following are **⏳PO gated**, always:

- The [mandatory PO gates](../standards/quality-gates.md#mandatory-po-gates) list
  (shrinking *or* growing it)
- Agent authority boundaries (the *Authority* / *Must not* sections of
  [roles.md](../agents/roles.md))
- This section itself

Everything else — loops, routing, standards, templates, budgets — is fair game for
automatic refinement.

## Thresholds are heuristics

Every number in a PROCESS doc — line budgets, question caps, the ~2/3 context rule, WIP
caps, maintenance cadences — is a **seed default**, not a measured fact. Each exists to
control a signal (retrieval cost, PO fatigue, merge debt, doc drift, context rot); when
observed behavior in *this* project says a value is wrong, tune it by refinement (logged
like any rule change) and record the project-specific value in
[derived.md](../../standards/derived.md). Trust a direct signal over an elapsed threshold
whenever both are available.

## Budget rule for AGENTS.md

`AGENTS.md` is always-loaded context; its budget (~150 lines) is a hard ceiling, and
every line dilutes attention on the others. To add a line, ask: *would its absence cause
mistakes in most sessions?* If not, it belongs in a process doc that's read on demand.
When at budget, adding requires removing — demote the weakest line to its owning doc.

## Pruning

Rules rot like code. During each [maintenance loop](loops.md#maintenance-loop):

- **Sunset check:** for rules added by refinement (the changelog knows), ask whether the
  rule has been relevant since it was added. A rule that never fired in ~10 tasks is
  dead weight — delete it (the changelog records the deletion; git preserves the text).
- **Contradiction check:** new rules contradicting older ones is the most common form of
  process rot. The newer rule usually reflects current intent — but *resolve* it: edit
  the older doc, don't let both stand.
- **Compression:** two rules born from two incidents are often one principle. Merge
  them; principles transfer better than incident-specific rules.

## What refinement is not

- **Not versioning theater.** No version numbers, no migration guides. Git is the history.
- **Not a suggestion box.** Signals come from real incidents and PO statements, not
  hypothetical improvements.
- **Not self-expansion.** The framework's success metric is PO outcomes per unit of PO
  attention — every refinement should hold that steady or improve it. A process that
  grows monotonically is failing.
