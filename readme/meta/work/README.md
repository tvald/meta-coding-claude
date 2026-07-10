# Work artifacts

<!-- PROCESS doc: the single home for where work artifacts live and how they move.
     Other docs link here — do not restate these conventions elsewhere. -->

Work artifacts are the documents that carry in-flight work across sessions and agents.
They live here, beside the knowledge base, and follow LIVING-doc rules
([management.md](../knowledge/management.md)).

| Artifact | Location | Template |
|----------|----------|----------|
| Backlog | [backlog.md](../../work/backlog.md) | none — format defined in the file |
| Specs | `specs/<slug>.md` | [templates/spec.md](../templates/spec.md) |
| Tasks | `tasks/<slug>.md` | [templates/task.md](../templates/task.md) |
| Interview worksheets | `interviews/<slug>.md` (scratch — deleted after filing) | [templates/interview.md](../templates/interview.md) |

Slugs are short-kebab-case (`csv-export`, `csv-export-parser`). Related tasks prefix
their spec's slug.

## When a file exists at all

- **Spec file**: every Feature-track item — with one named exception: the greenfield
  bootstrap's spec is `product.md` plus the stack ADRs
  ([orchestration](../process/orchestration.md#onboarding), step 6); don't create a
  redundant spec file for it. Quick/Standard tracks never have one.
- **Task file**: when work spans sessions, is handed to another agent (always, for
  spawned builders), **or receives peer/gated review** — the task file is where review
  findings and waivers are durably recorded. Quick-track work reviewed at self level
  needs no file. The requirement is durability, not length: a minimal task file — goal,
  verification, review record — is a handful of lines.
- **Backlog entry**: any known-but-not-now work. `state.md` *Next steps* holds only the
  immediate queue (≤10 items); everything else lives in the backlog. Overflow flows
  `state.md → backlog.md`, never to the archive.

## Lifecycle

- **Specs**: `draft → approved → implemented` (or `superseded`, or `needs-reapproval`
  when reality invalidates an approved promise — see
  [orchestration](../process/orchestration.md#the-feature-track)). The spec header
  records who approved and when (a quoted PO "yes" with date is enough). Implemented and
  superseded specs are moved to `readme/log/archive/` during maintenance once they've
  been stable for a few weeks — the decisions they embody should by then live in ADRs
  and standards.
- **Tasks**: `pending → in-progress → done` (or `blocked`). A done task file is archived
  (not deleted) during maintenance after its *Notes / discoveries* and *Review* sections
  have been distilled. Task files are working documents — their long-term value is the
  review record and the distillation trail, nothing else.
- **Backlog**: items leave by becoming specs/tasks, or by being pruned (with the PO's
  standing scope decisions in `product.md` as the pruning guide). The backlog is
  priority-ordered; the session loop pulls from `state.md` first, then from the top of
  the backlog.
