<!-- LIVING doc — stack- and repo-specific conventions, derived from this project.
     last-verified: (never — unfilled)
     anchors: (set during onboarding: manifest files, config files, CI definitions)
     Budget: ~150 lines. Seeded empty; filled by the derivation procedure below during
     onboarding, then maintained by the distill-before-close step of every task. -->

# Derived standards

*Unfilled — run the derivation procedure below during onboarding.*

<!-- Structure to fill in (keep only sections that earn their place):

## Commands
The exact invocations for this repo. Command-first — flags included, no prose.
| Action | Command |
|--------|---------|
| install | `...` |
| build   | `...` |
| test (all / single file) | `...` |
| lint + format | `...` |
| run locally | `...` |

## Stack
Languages, frameworks, key libraries WITH VERSIONS, and for each major choice a link to
the ADR that made it (or mark [ASSUMPTION] if inherited without a recorded decision).

## Conventions
Rules derived from the codebase, each stated as prohibition+alternative or a decision
table, with ONE code example where wording is ambiguous. Only conventions that differ
from ecosystem defaults — do not restate what a linter already enforces.

## Layout
Where things go: source, tests, generated code (and whether it may be edited), config.
Only what's non-obvious from looking at the tree.

## Gotchas
Environment quirks, flaky areas, setup traps. Each entry: symptom → cause → what to do.
Delete entries when the underlying cause is fixed.
-->

---

## Derivation procedure

<!-- PROCESS section: framework-owned. How to fill and maintain the sections above. -->

Run at onboarding, and re-run any section when its anchors change.

1. **Commands** — read manifests (`package.json`, `Makefile`, `pyproject.toml`, CI
   config…), then *execute* each candidate command to confirm it works before recording
   it. A documented command that fails is worse than none.
2. **Stack** — inventory direct dependencies and versions from lockfiles/manifests. For
   each major framework choice with no recorded rationale, add it here and note
   `[ASSUMPTION] inherited`.
3. **Conventions** — sample representative source files across the tree (oldest, newest,
   most-edited). Record patterns that are (a) consistent in the repo and (b) not
   ecosystem defaults: naming, error handling, test structure, import style, module
   boundaries. When the repo is inconsistent, pick the majority pattern, record it, and
   note the minority as cleanup candidates — do not record both.
4. **Layout** — describe only the non-obvious: generated directories, places new code of
   each kind should go, anything protected.
5. **Gotchas** — start empty; populated exclusively by real incidents (a failed build, a
   surprising behavior). Never speculate gotchas into existence.

For a **greenfield** repo, steps 1–4 are decided rather than derived: make minimal
choices (record ADRs for the stack), set up the commands, and keep conventions empty
until the code exists to derive them from.

**Maintenance:** this file follows same-commit updates (see
[../knowledge/management.md](../knowledge/management.md)) — the task that changes a
command, adds a dependency, or establishes a convention updates this file in the same
commit. The consistency check's command audit re-verifies the Commands table.
