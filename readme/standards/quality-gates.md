# Quality gates

<!-- PROCESS doc: what "done" means, and where the PO must be in the loop.
     Referenced by every loop in readme/process/loops.md. -->

## Definition of done

A task is done only when **all** of these hold. This list is the exit criterion of the
task loop — an agent claiming completion asserts each item, and the verification steps
must have actually been executed, not reasoned about.

1. **Acceptance checks pass** — the task's Verification section was executed and passed.
2. **The full check suite passes** — build, tests, lint, type check (the Commands table
   in the repo-root `AGENTS.md`); clean, with no unrelated breakage.
3. **New behavior is tested** — a test exists that fails without this change. Exemptions:
   non-behavioral changes (typos, comments, formatting, docs) need no test; where
   automated testing is genuinely impractical, the task documents why and what manual
   verification was performed instead. "The test would just restate a string" is a valid
   exemption; "I didn't get to it" is not.
4. **Knowledge rode along** — decisions → ADRs, terms → glossary, conventions/gotchas →
   derived.md, deviations → spec/plan updated, `state.md` current. All in the task's
   commits, not promised for later. **Carve-out for isolated/parallel builders**
   (single-writer rule, [orchestration](../process/orchestration.md#parallelization)):
   they stage KB updates in their task file instead, and "same commit" is satisfied when
   the orchestrator folds the staged updates into the KB in the merge commit. A reviewer
   counts properly staged updates as riding along.
5. **The diff is coherent** — reviewable as one change, summarizable in a sentence, no
   drive-by edits outside the task's scope.
6. **No debris** — no leftover debugging output, commented-out code, TODO-without-owner,
   or scratch files.

## Review levels

Review effort scales with risk, chosen at routing time
([../process/orchestration.md](../process/orchestration.md)) and recorded on the task:

| Level | What happens | Use for |
|-------|-------------|---------|
| **self** | implementer re-reads the full diff against this checklist before closing | Quick-track work — except in auth/payment/PII areas, where peer is the minimum (gate 4) |
| **peer** | a *separate agent with fresh context* reviews the diff (reviewer role — [../agents/roles.md](../agents/roles.md)) | the default for all behavior-changing work |
| **gated** | peer review + PO approval before merge/release | the mandatory-gate list below |

A reviewer at any level checks: correctness against the spec, the definition-of-done
list, standards compliance ([engineering.md](engineering.md), [derived.md](derived.md)),
and — most importantly — *what's missing*: unhandled edge cases, absent tests, security
holes. Review findings are fixed or explicitly waived with a reason; silence is not a
waiver.

**Durability:** peer- and gated-level work always has a [task file](../work/README.md);
findings and waivers are recorded in its *Review* section — that record is what makes
"the same class of finding recurs" ([refinement signal](../process/refinement.md#signals))
detectable. Self-level review needs no record.

## Mandatory PO gates

Agents proceed autonomously **except** at these points. This list is **canonical and
exhaustive** — anything not on it is within *standing approval* (the term other docs use
for "agents decide without asking"). The PO can extend or shrink the list; that change is
an ADR, and the summary in the repo-root `AGENTS.md` must be re-synced in the same commit.

1. **Spec approval** for feature-track work (see orchestration routing) — the one
   review the PO cannot delegate, because it defines *what* gets built.
2. **Irreversible or externally visible actions** — deleting data, schema migrations on
   real data, publishing packages, deploying to production, sending communications,
   spending money, granting access.
3. **Release** — whatever "release" means for this project (defined during onboarding,
   recorded in [product.md](../knowledge/product.md) → *Delivery*).
4. **Security-sensitive changes** — anything altering the *behavior* of auth, payments,
   or PII handling: PO sign-off on the approach (the spec or ADR), regardless of change
   size. Non-behavioral edits in those areas (typos, comments, formatting) are not
   gated — they route normally with peer review minimum.

**Gate mechanics:** when work hits a gate, the agent (a) prepares everything reviewable
(the spec, the diff, the ADR), (b) records the pending gate in `state.md` under *Next
steps* marked `⏳PO`, (c) presents the PO a decision-ready summary in ≤10 lines — what's
proposed / the default recommendation / what happens on yes / what happens on no — and
(d) moves on to other work if any is available. Gates block *the gated item*, never the
whole system. A gated item untouched for two maintenance runs is re-presented once with
refreshed context (things may have changed); if it blocks nothing, it moves to the
[backlog](../work/backlog.md) with its `⏳PO` tag intact, so `state.md` stays the now.

**What specific gates must present:** a gate-2 (irreversible action) or gate-3 (release)
request also states the rollback/mitigation path and how success or failure will be
observed after the action. A gate-4 (security-sensitive) request answers: what's being
built, what can go wrong (for agentic/AI features, include prompt-injection and
tool-permission risk), what will be done about it, and how we'll know the mitigations
hold.

## Verification discipline

- **Watch it pass.** Run the checks; read the output. "The tests should pass" is not
  verification. If an environment limitation genuinely prevents running something, say so
  explicitly in the task and downgrade the claim from "done" to "needs verification".
- **Failure is a result to report, not to hide.** A task that ends with failing checks
  stays open, with the failure and what was tried recorded (dead ends → `state.md`).
- **Verify the right thing.** Acceptance checks trace to spec requirements. Passing
  unrelated tests proves nothing about the task.
- **A pass on rerun is not a pass.** A check that fails, then passes on unchanged code
  is a flake — a defect, not noise. Don't rerun until green → fix it now, or quarantine
  it with a queued task (`state.md` *Next steps*) so the suite stays trustworthy.

## Escaped defects

A defect discovered after its task closed (worst case: after release): **revert first**
when a clean revert exists — restore known-good, then diagnose. **Disclose proactively**
— record it in `state.md`, and if the defect was externally visible, tell the PO in the
next interaction rather than waiting to be asked. The fix **carries a regression test**
that fails on the defect — no exemptions. Then run the deep retro
([loops](../process/loops.md#retro-loop)): verification passed but the outcome was
wrong — name the check that should have caught it.
