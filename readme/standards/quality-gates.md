# Quality gates

<!-- PROCESS doc: what "done" means, and where the PO must be in the loop.
     Referenced by every loop in readme/process/loops.md. -->

## Definition of done

A task is done only when **all** of these hold. This list is the exit criterion of the
task loop — an agent claiming completion asserts each item, and the verification steps
must have actually been executed, not reasoned about.

1. **Acceptance checks pass** — the task's Verification section was executed and passed.
2. **The full check suite passes** — build, tests, lint, type check (the Commands table
   in [derived.md](derived.md)); clean, with no unrelated breakage.
3. **New behavior is tested** — a test exists that fails without this change (or the task
   explicitly documents why automated testing is impossible and what manual verification
   was performed instead).
4. **Knowledge rode along** — decisions → ADRs, terms → glossary, conventions/gotchas →
   derived.md, deviations → spec/plan updated, `state.md` current. All in the task's
   commits, not promised for later.
5. **The diff is coherent** — reviewable as one change, summarizable in a sentence, no
   drive-by edits outside the task's scope.
6. **No debris** — no leftover debugging output, commented-out code, TODO-without-owner,
   or scratch files.

## Review levels

Review effort scales with risk, chosen at routing time
([../process/orchestration.md](../process/orchestration.md)) and recorded on the task:

| Level | What happens | Use for |
|-------|-------------|---------|
| **self** | implementer re-reads the full diff against this checklist before closing | trivial changes: typos, doc edits, config tweaks with no behavior change |
| **peer** | a *separate agent with fresh context* reviews the diff (reviewer role — [../agents/roles.md](../agents/roles.md)) | the default for all behavior-changing work |
| **gated** | peer review + PO approval before merge/release | the mandatory-gate list below |

A reviewer at any level checks: correctness against the spec, the definition-of-done
list, standards compliance ([engineering.md](engineering.md), [derived.md](derived.md)),
and — most importantly — *what's missing*: unhandled edge cases, absent tests, security
holes. Review findings are fixed or explicitly waived with a reason; silence is not a
waiver.

## Mandatory PO gates

Agents proceed autonomously **except** at these points. This list is exhaustive by
design — anything not on it does not need the PO. (The PO can extend or shrink it; that
change is an ADR.)

1. **Spec approval** for feature-track work (see orchestration routing) — the one
   review the PO cannot delegate, because it defines *what* gets built.
2. **Irreversible or externally visible actions** — deleting data, schema migrations on
   real data, publishing packages, deploying to production, sending communications,
   spending money, granting access.
3. **Release** — whatever "release" means for this project (defined during onboarding).
4. **Security-sensitive changes** — auth, payments, PII handling: PO sign-off on the
   approach (the spec or ADR), regardless of change size.

**Gate mechanics:** when work hits a gate, the agent (a) prepares everything reviewable
(the spec, the diff, the ADR), (b) records the pending gate in `state.md` under *Next
steps* marked `⏳PO`, (c) presents the PO a decision-ready summary — what's proposed, the
default recommendation, and what happens on approval — and (d) moves on to other work if
any is available. Gates block *the gated item*, never the whole system.

## Verification discipline

- **Watch it pass.** Run the checks; read the output. "The tests should pass" is not
  verification. If an environment limitation genuinely prevents running something, say so
  explicitly in the task and downgrade the claim from "done" to "needs verification".
- **Failure is a result to report, not to hide.** A task that ends with failing checks
  stays open, with the failure and what was tried recorded (dead ends → `state.md`).
- **Verify the right thing.** Acceptance checks trace to spec requirements. Passing
  unrelated tests proves nothing about the task.
