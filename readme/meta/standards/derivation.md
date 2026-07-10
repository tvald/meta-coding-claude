# Derivation procedure

<!-- PROCESS doc: how readme/standards/derived.md and the AGENTS.md Commands table are
     filled and maintained. The derived standards themselves are LIVING project state. -->

Fills [derived.md](../../standards/derived.md) and the Commands table in the repo-root
`AGENTS.md`. Run at onboarding, and re-run any section when its anchors change.

1. **Commands** — read manifests (`package.json`, `Makefile`, `pyproject.toml`, CI
   config…), then *execute* each candidate command to confirm it works before recording
   it in the Commands table of the repo-root `AGENTS.md` (its one home — always loaded).
   A documented command that fails is worse than none. Note the full suite's rough
   duration; if it is slow enough to change per-task behavior, define a task-level
   subset row (affected tests + fast static checks) — see the suite-breadth rule in
   [quality-gates.md](quality-gates.md#definition-of-done), item 2.
2. **Stack** — inventory direct dependencies and versions from lockfiles/manifests. For
   each major framework choice with no recorded rationale, add it to `derived.md` and
   note `[ASSUMPTION] inherited`.
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

**Maintenance:** `derived.md` follows same-commit updates (see
[management.md](../knowledge/management.md)) — the task that changes a command, adds a
dependency, or establishes a convention updates it in the same commit. The consistency
check's command audit re-verifies the Commands table.
