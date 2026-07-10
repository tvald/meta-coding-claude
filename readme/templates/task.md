# Task: <short imperative title>

<!-- TEMPLATE — a task is the unit of the build loop: one branch, one reviewable change.
     Copy to readme/work/tasks/<slug>.md (conventions: readme/work/README.md).
     Quick-track tasks live only in the orchestrator's working memory; write a task FILE
     when work spans sessions, is handed to another agent (always, for spawned builders),
     or gets peer/gated review — the file is where the review record lives. -->

- **Spec:** <!-- link to spec, or "direct" for maintenance/chore work -->
- **Status:** pending | in-progress | blocked | done
- **Size guess:** S (<1h) | M (single session) | L (must be split — do not start an L)

## Goal

<!-- One sentence: the observable change when this task is done. -->

## Plan

<!-- Steps, files to touch, approach. Filled by the planning step of the task loop.
     If the plan reveals a decision with lasting consequences → record an ADR first. -->

## Verification

<!-- Copied/derived from the spec's acceptance checks, narrowed to this task.
     Must be executable: commands, expected output, behavior to observe. -->

## Notes / discoveries

<!-- Anything learned during the work that outlives the task gets moved to the knowledge base
     (decision → ADR, term → glossary, convention → standards/derived.md, product fact → product.md)
     before the task is closed. This section is a staging area, not a destination.
     Isolated/parallel builders: stage ALL shared-KB updates here (single-writer rule);
     the orchestrator folds them in at merge. Also record your branch name + final commit. -->

## Review

<!-- Filled at peer/gated review: verdict, findings (blocking/advisory, file:line),
     fixes applied, and any waivers with reasons. This record is what lets recurring
     finding classes be detected (refinement signal) — don't summarize it away. -->
