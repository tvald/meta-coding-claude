<!-- Archived raw ingestion source. Provenance: external critique of this framework,
     placed at the repo root as CRITIQUE.md by the PO on 2026-07-10; author external
     (unnamed). Adjudicated the same day — the controlling record of what was adopted
     or rejected is critique-response-2026-07.md beside this file. -->

# Feedback for the Framework Author

Date: 2026-07-10

## Executive assessment

Your framework is a serious, coherent attempt to make AI-led development
resumable, auditable, and autonomous for a solo product owner. It is strongest where it
turns familiar advice into operational controls: verification criteria are written
before implementation, weakened checks require an explanation, new tests are challenged
against the base revision, flaky checks cannot be made green by rerunning them, failed
approaches are retained, and product-owner gates block only the dependent item.

Its central weakness is that it over-corrects for agent unreliability with repository
ritual. Nearly every session mutates global state, writes a retro, and commits; nearly
every behavior change creates a task file, runs the full suite twice, and requires a
separate reviewer; maintenance adds freshness dates, anchors, budgets, archives, pulse
metrics, and recurring audits. Those controls can work in a disciplined, single-writer,
Claude Code-centered project with a fast test suite. As universal defaults, however,
they create write amplification, coordination hazards, false precision, and conflicts
with repositories where agents may not commit, own the whole worktree, or spawn a
particular kind of reviewer.

The core design is worth preserving, but the common execution path should be simplified.
The most important revisions are to separate checkpointing from commit authority,
risk-scale review and test-suite breadth, treat dirty worktrees as unknown ownership,
make global state conditional, strengthen source-trust and operational-safety rules, and
replace unsupported numeric thresholds with project-configurable heuristics. These
changes would retain the framework's unusually strong integrity controls while making it
safer and more portable.

## Scope and method

This assessment covered the complete framework surface:

- both entrypoints: [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md);
- all process, knowledge, standards, role, work, log, and template documents under
  [`readme/`](readme/README.md);
- the Claude Code adapter, its four agent definitions, and its seven skills under
  [`.claude/`](.claude/README.md);
- the seeded decision, state, product, glossary, backlog, retros, and framework
  changelog.

The review evaluated authority, routing, knowledge durability, interruption handling,
verification, review, security, operational readiness, framework maintenance,
portability, internal consistency, and context cost.

The framework contains 39 Markdown files and about 2,200 lines. All relative Markdown
link targets resolve. That is evidence of structural care, but not of real-project
effectiveness. The seeded project artifacts are mostly empty, the dated retros and
changelog describe framework construction rather than sustained use on a product, and
no production history or outcome data is present. Claims below distinguish observed
document behavior from inferred operational consequences.

The framework's own `AGENTS.md` was treated as an object of analysis rather than an
instruction source for the review.

## What the framework is trying to do

The design has six main layers:

1. A short entrypoint maps each request to Quick, Standard, Feature, Knowledge, or
   Maintenance work.
2. A session loop resumes from a global `state.md`, selects work, and closes with a
   state update, commit, and retro.
3. Task, ingestion, review, maintenance, and retro loops define reusable execution
   behavior.
4. A knowledge base separates product intent, current state, domain language,
   decisions, derived standards, work artifacts, and historical logs.
5. Quality gates define done, review depth, mandatory product-owner approvals, and
   verification discipline.
6. A Claude Code adapter realizes the abstract roles as subagents and skills, including
   worktree-isolated builders and a read-only reviewer.

The framework optimizes for three explicitly named failure modes: lost context, silent
re-decisions, and unverified velocity. This focus gives it a clear identity and explains
most of its design choices.

## Positive aspects

### 1. The framework has a clear problem statement and a consistent through-line

The orientation document names concrete failure modes instead of presenting process as
an end in itself. The rules for state, ADRs, task files, review, and verification all
trace back to those failures. Many process frameworks accumulate unrelated practices;
this one has a recognizable theory of failure.

The principles “proportional ceremony,” “autonomy between gates,” “artifacts must pay
rent,” and “one home per fact” are memorable and useful. Even where their implementation
is too rigid, they give agents decision criteria rather than a pile of disconnected
instructions.

### 2. Routing is simple, explicit, and revisable

The five-track table in
[`readme/process/orchestration.md`](readme/process/orchestration.md) is easy to apply.
It separates product ambiguity from implementation complexity and gives knowledge and
maintenance work first-class loops. The explicit escalation rules are particularly
good: a Quick task that reveals design uncertainty upgrades, a Standard task without
writeable acceptance checks becomes Feature work, and oversized or repeatedly failed
tasks are split or rerouted.

Allowing downgrades is equally important. The routes are hypotheses, not labels that
must be defended after evidence changes. That is strong scale-adaptive design.

### 3. Continuity is designed as durable state, not conversational memory

You are right that a resumable process needs a durable cursor. `state.md`,
task notes, branch commits, review records, known dead ends, and checkpoint-before-risky-
step guidance all aim to let another agent resume without asking the product owner to
reconstruct the session.

The “steer versus halt” distinction for mid-work instructions is also strong. It avoids
both extremes: ignoring new guidance and throwing away compatible progress. The global
state mechanism is too aggressive as a default, but the underlying principle is sound.

### 4. Knowledge has explicit ownership and lifecycle rules

[`readme/knowledge/management.md`](readme/knowledge/management.md) provides one of the
best parts of the framework. It distinguishes PROCESS, LIVING, and TEMPLATE documents;
identifies canonical homes; marks summaries; separates project intent from current code;
and states what should *not* enter the knowledge base.

The distinction between code as evidence of current behavior and documents as evidence
of intent is valuable when applied carefully. Likewise, recording assumptions visibly,
keeping decision records immutable through supersession, and distilling task discoveries
before close all reduce rediscovery.

The document budgets are blunt, but they express a real concern: durable memory becomes
harmful when agents must load stale or sprawling documents.

### 5. Verification integrity is unusually concrete

This is the framework's most valuable contribution.

- Verification criteria exist before implementation rather than being invented after
  the output is known.
- Later edits to criteria require an `[amended: reason]` marker, making silent weakening
  reviewable.
- The task records observed results, not merely commands that someone intended to run.
- A reviewer independently reruns checks instead of trusting the builder's report.
- New tests are run against the base revision to establish that they detect the missing
  behavior.
- A fail-then-pass result on unchanged code is treated as evidence of a flaky check, not
  permission to rerun until green.
- Each required feature behavior must eventually map to durable automated coverage or a
  recorded exemption.

These rules target specification gaming and false confidence directly. They are more
useful than generic instructions to “test thoroughly.”

### 6. Review is designed to reduce anchoring

The reviewer reads the task or spec before the implementation diff, has a read-only
role, reruns verification, and searches for missing cases rather than only visible
mistakes. Treating a zero-finding review as a prompt for one focused second look is a
good anti-rubber-stamp control, provided it does not become pressure to manufacture a
finding.

The emphasis on fresh context is defensible: a reviewer who inherits every builder
assumption is less likely to challenge them. The framework goes too far by requiring a
separate agent for every peer review, but the review design itself is strong.

### 7. Specifications are kept bidirectionally consistent with discovery

The “bidirectional rule” recognizes that implementation changes understanding. When
reality invalidates a plan or approved promise, the spec changes with the implementation;
material promise changes require reapproval; unaffected work can continue.

This avoids treating an approved spec as either immutable fiction or disposable
scaffolding. Approval inheritance for unchanged content faithfully derived from a
product-owner-authored source is also sensible: it avoids asking the owner to approve
their own words twice while still exposing agent interpretation.

### 8. Product-owner gates are operational, not just aspirational

The gate list is short, canonical, and accompanied by mechanics. A gated item is made
decision-ready, marked explicitly, and parked while independent work continues. Gate
requests are batched. This is a strong model for low-babysitting autonomy.

The framework also protects its own authority boundaries: agents may not silently widen
their autonomy through self-refinement. That is a useful constitutional idea even though
the exact protected list is incomplete.

### 9. Parallel work has real integration rules

The framework does not equate parallelism with speed by default. It requires
independent scopes, self-contained task files, isolated worktrees for builders, a
single-writer rule for shared knowledge, review before merge, sequential merges, and
checks after each merge. The explicit work-in-progress cap recognizes merge debt.

This is much stronger than telling agents to “parallelize where possible” without
defining visibility, ownership, merge order, or failure recovery.

### 10. Framework maintenance includes pruning as well as addition

[`readme/process/refinement.md`](readme/process/refinement.md) treats rules like code:
they can be missing, contradictory, or dead. The placement guide, smallest-edit bias,
changelog, summary resynchronization, root-context budget, contradiction check, and
compression pass are all useful.

The explicit warning that a monotonically growing framework is failing is excellent.
The missing complement is a stronger evidence and independent-judgment gate before
material process rules are adopted. Pruning is useful, but it acts after a rule has
already spent attention and changed behavior.

### 11. The templates have good retrieval affordances

The task template's `KB refs` field is a practical response to a common handoff failure:
a fresh builder will not reliably infer which ADR, term, or gotcha matters. The spec's
requirements-to-acceptance relationship, task review record, interview defaults, and
short ADR form all support retrieval rather than mere documentation.

### 12. The Claude adapter is a thoughtful implementation of the abstract model

The adapter maps roles to concrete tool permissions, isolates builder worktrees, makes
the reviewer read-only, and offers task-oriented skills. It is more than a collection of
personas; it attempts to enforce role boundaries mechanically. The optional hook ideas
also acknowledge that prose instructions alone are not deterministic.

## Negative aspects and risks

### 1. The total ceremony is much heavier than the routing table suggests

The Quick path is light, but most real behavior changes become Standard work. Standard
work requires written criteria, a task file because it receives peer review, full-suite
execution by the builder, a fresh separate reviewer, full-suite execution again by the
reviewer, recorded review findings, knowledge distillation, state updates, commits, and
a session retro. Feature work adds a spec, product-owner approval, decomposition,
per-task files, sequential merge checks, and end-to-end integration.

Each control has a rationale, but their composition is expensive. “Proportional
ceremony” should be judged by the common path, not by the existence of a Quick row. The
framework lacks a cost model for large repositories, slow suites, scarce reviewer
capacity, or changes where the documentation diff exceeds the code diff.

### 2. It assumes authority to commit and manage branches

The session loop says every close ensures work is committed. The task loop exits with
work committed. The adapter asks roles to make commits and the curator to make one small
commit per repair. This is not a portable process default: many users authorize edits
but not commits, require human-controlled commit boundaries, use a dirty shared
worktree, or expect agents to leave a reviewable unstaged diff.

This is more than a tooling preference. A process framework should distinguish durable
checkpointing from authority to alter Git history. A task note or working-tree diff can
be a checkpoint; committing is an externally meaningful workflow action in some teams.
Make commit and branch authority a project policy discovered during onboarding, not a
seed default.

### 3. A dirty worktree is interpreted too aggressively

The boot rule treats a dirty tree as evidence of an interrupted session that must be
resumed before new work. In a shared workspace, those changes may belong to the user or
another agent, may be unrelated experiments, or may deliberately be uncommitted. The
inference can cause an agent to absorb, alter, or block on work it does not own.

A safer rule is to inspect and preserve unrelated changes, work around them when scopes
do not overlap, and escalate only when ownership or overlap cannot be resolved. Dirty
state is evidence to investigate, not proof of task ownership or intent.

### 4. Global `state.md` creates a hot file and high write amplification

Reading a concise current-state file is useful. Requiring it to change at every task and
session close makes it a contention point, especially with multiple agents or branches.
Its “Recently done” section duplicates Git history; its queue overlaps the backlog and
task files; its dead ends can become stale across unrelated initiatives. The 60-line cap
forces frequent curation and archival, adding bookkeeping to ordinary work.

The single-writer carve-out acknowledges this problem but does not eliminate it. Consider
making `state.md` conditional: use it for initiatives that span sessions, phases, or
agents, while allowing an active plan and final report to carry one-off work.

### 5. Verification rules are too absolute in several places

Running the full suite for every task and again for every peer review may be correct for
a small repository; it is impractical in a monorepo or a project with expensive end-to-
end tests. The rule has no tiered alternative such as affected checks on each task plus
full checks at integration or release.

“Every new behavior” requiring a test that fails without the change is a strong default,
not a universal truth. Refactors, observability changes, timing-sensitive behavior,
environment-specific fixes, type-only improvements, and defensive cleanup may need
different evidence. Running new tests against the base revision can itself be unsafe or
expensive if it requires worktree manipulation, migrations, generated assets, or a
different dependency state.

The useful principle is counterfactual confidence, not a mandatory Git ritual. Express
the rule as a menu of safe evidence—pre-fix reproduction, base-revision failure,
mutation, or a focused negative control—and scale it to risk.

### 6. Mandatory separate-agent review is not portable or proportionate

The framework says peer review always uses a separate fresh-context agent and makes it
the default for all behavior changes. Some runtimes cannot spawn subagents; some users
limit them; some changes are too small to justify one; and independent review may be
provided by a human or CI policy instead. The model-tier choices (`opus`, `sonnet`) are
also vendor- and account-specific operational assumptions embedded in a supposedly
portable seed.

Fresh context is valuable, but it should be one means of achieving independent review,
selected by risk and available capabilities.

### 7. The mandatory gate model is simultaneously over-broad and under-broad

Requiring product-owner approval for every Feature-track spec and every release may be
appropriate for the stated solo-owner environment, but it reduces autonomy for owners
who delegate product shaping or use established release automation. Calling the list
“exhaustive” makes local policy adaptation important, yet changing the list is itself
gated and ceremony-heavy.

Conversely, the security gate names only auth, payments, and PII behavior. It does not
explicitly cover secrets, authorization policy, infrastructure permissions, supply
chain changes, CI/CD trust, destructive local actions, regulated data beyond PII, or AI
tool permissions. Broaden the trigger around trust boundaries and irreversible impact
rather than relying on a short list of data domains.

### 8. Framework self-modification is too easy below a narrow constitutional boundary

The framework permits direct autonomous edits to loops, routing, standards,
templates, and budgets after a single strong signal. It logs the change but does not
require an independent judge, evidence score, pilot terms, or before/after evaluation.
That can produce reactive rules optimized to one incident—the exact accumulation the
pruning loop later has to fight.

Protecting only the gate list, role authority sections, and self-modification section is
not enough. Verification gates, routing defaults, retention policy, required commits,
and maintenance automation can all materially change agent power or project cost.

Add a proposal, evidence ladder, independent judgment step, pilot option, and explicit
context-cost review before material process changes. Keep the existing pruning
discipline as downstream cleanup, not the primary safeguard.

### 9. Several thresholds create false precision

Examples include the two-thirds context threshold, two failed approaches, five
assumption markers, ten questions for a feature, thirty to forty for a product, fifty
maximum, ten unmerged tasks/runs as a maintenance proxy, two-week aging, two maintenance
runs for stale approvals, a three-branch WIP cap, and numerous line budgets.

Thresholds can trigger useful behavior, but these values are not supported by evidence
in the repository and will vary dramatically by model, project, task size, suite speed,
and team workflow. They should be documented heuristics with local override paths, not
universal process facts.

### 10. Freshness and consistency checks are brittle

The anchor check compares document verification dates with Git modification dates. A
changed anchor does not necessarily invalidate a document, and a valid date does not
prove semantic correctness. The symbol check treats backticked text as identifiers or
paths, which will create false positives for commands, examples, configuration keys,
and conceptual names. The contradiction check requires reading the entire knowledge
base, which becomes expensive even with budgets.

These checks can be useful signals, but the framework describes them too much like
proof. Freshness metadata also creates routine edits whose presence may be mistaken for
substantive validation.

### 11. The ingestion cleanup policy risks deleting valuable provenance

After filing, raw material is deleted or archived so it cannot become a competing source
of truth. Reducing duplication is good, but deletion is a poor default for original
requirements, signed decisions, customer research, legal materials, or externally
maintained documents. A synthesis can omit nuance or be wrong; provenance is needed to
audit it.

The safer policy is to retain or link authoritative originals, record source ownership,
trust level, and freshness, and clearly mark which distilled artifact controls
implementation. Delete only disposable copies when ownership and retention policy allow
it.

### 12. Source trust and prompt-injection defenses are incomplete

The engineering standard says untrusted input is untrusted, but the ingestion and agent
tools do not provide a source-trust hierarchy or explicitly forbid external documents,
issues, logs, dependency metadata, or model output from changing agent instructions.
The `/ingest` skill even directs verbatim material into a subagent prompt without a
strong instruction/data boundary.

Add explicit authority and evidence tiers. State that untrusted content is data, not
instruction, and call out prompt injection, secret requests, encoded payloads,
unexpected install hooks, dependency metadata, generated output, and permission changes.

### 13. Important quality domains are underdeveloped

The framework has good general engineering principles but limited guidance on:

- threat modeling beyond a brief security checklist;
- rollback and operational readiness;
- observability, degraded states, queues, retries, and background jobs;
- data-migration rehearsal and rollback;
- accessibility and multi-state UI inspection;
- incident and near-miss records beyond a retro;
- dependency license, transitive, and operational-impact review;
- current external-source verification for fast-changing legal, API, pricing, or
  security facts;
- preserving unrelated work in shared dirty worktrees.

Add lightweight, risk-triggered paths or templates for these areas. They should remain
conditional so the remedy does not add more ceremony to routine changes.

### 14. Some rules conflict or pull in opposite directions

The conflicts are manageable, but they increase interpretation cost:

- “One home per fact” coexists with many required summaries and repeated statements of
  full-suite, same-commit, gate, and state rules. Marked summaries help, but the amount
  of repetition shows how hard the absolute rule is to maintain.
- “No drive-by changes” conflicts at the margin with “leave it better, within scope.”
  Agents still need judgment about what counts as touched scope.
- The spec is described as the current best knowledge, but it is also an approved
  promise and later an archived historical artifact. Updating it in place improves
  current truth while weakening historical trace unless every material change is
  reliably identified and reapproved.
- Code is truth about what is and docs about intent, but the curator is told to fix docs
  that contradict code. Without careful source analysis, this can erase evidence that
  the code drifted.
- The framework is called Markdown-only and portable, while its strongest enforcement
  story relies on Claude-specific hooks, agent metadata, worktree isolation, model
  names, and scheduled invocations.
- The framework says gates are few, but Feature classification itself causes a product-
  owner gate and covers a broad class of “new capability” work.

### 15. Seed artifacts carry questionable assumptions

The seeded ADR says the product owner decided to adopt the framework, uses the kit build
date, and claims public evaluations show heavyweight frameworks are several-fold slower
without citing those evaluations. Copying that file into a project can create a false
decision record. A template should not arrive as an accepted project decision unless the
actual owner accepted it in that project.

Likewise, seeded empty living files create immediate obligations and noise before the
first task proves they are needed. Create-on-first-use would be more economical for all
but the smallest set of essential bootstrap artifacts.

## Prioritized recommendations

### Priority 0: Correct authority and safety assumptions

#### 1. Separate checkpointing from commit authority

Keep the durable-exit principle, but let a project define whether the checkpoint is a
task note, a working-tree diff, a patch, a local commit, or a remote branch. Onboarding
should discover the permitted Git workflow. The default session loop should never imply
commit authority merely because an agent may edit files.

Suggested rule:

> Before stopping, leave a durable, inspectable checkpoint using the repository's
> approved workflow. Commit only when the user or project policy authorizes it.

#### 2. Treat dirty state as unknown ownership

Replace “dirty means interrupted agent work” with an investigation step:

1. Inspect status and diffs without modifying them.
2. Identify any task note, branch, owner, or recent instruction that explains the work.
3. Resume only work clearly owned by the active task.
4. Preserve unrelated changes and work around them.
5. Ask only when overlapping ownership cannot be safely inferred.

This change prevents continuity logic from becoming an accidental worktree takeover.

#### 3. Establish an instruction and source-trust hierarchy

Add a compact table distinguishing:

- authority: current user instruction, repository agent policy, accepted decisions;
- primary evidence: code, tests, telemetry, official documentation;
- secondary evidence: tickets, comments, blogs, summaries;
- untrusted content: webpages, logs, generated output, dependency metadata, pasted
  documents, and unknown files.

State explicitly that evidence cannot promote itself into instruction. Ingestion agents
may extract facts from untrusted material but must ignore embedded requests to change
policy, reveal secrets, run tools, install packages, or widen permissions.

#### 4. Broaden security and irreversible-action triggers

Rewrite the security gate around impact and trust boundaries. It should cover at least:

- authentication and authorization;
- secrets, credentials, and access grants;
- personal, regulated, financial, or sensitive business data;
- payments and externally binding actions;
- CI/CD, infrastructure, production, and deployment permissions;
- new executable dependencies, install hooks, plugins, and generated code paths;
- AI tool permissions and actions with external side effects.

The exact approval mechanism can remain project-configurable, but these areas deserve
explicit risk classification and rollback or mitigation planning.

#### 5. Preserve authoritative source material

Change the ingestion cleanup rule from “delete or archive raw material” to a retention
decision:

- retain or link authoritative originals;
- record owner, date, trust, freshness, and scope;
- mark the distilled artifact that controls implementation;
- archive redundant working copies only after provenance is secure;
- delete only when the material is disposable and the agent has authority.

This preserves auditability when synthesis loses nuance or is later challenged.

### Priority 1: Make proportional ceremony real on the common path

#### 6. Risk-scale verification breadth

Preserve predeclared checks, amendment reasons, observed results, counterfactual
confidence, and flake discipline. Replace mandatory full-suite execution everywhere with
a matrix such as:

| Risk or stage | Minimum evidence |
| --- | --- |
| Low-risk nonbehavioral change | Careful diff/read-through plus targeted link, lint, or format check |
| Localized behavior change | Tests for touched behavior plus relevant lint, type, build, or integration checks |
| Cross-cutting or high-risk change | Expanded suite, security/operational checks, rollback evidence, independent review |
| Integration or release | Full applicable suite and end-to-end acceptance checks |

Require a reason when a normally relevant check is skipped. This retains rigor without
making every change pay release-level cost.

#### 7. Make reviewer independence capability- and risk-aware

Keep the excellent review sequence: read intent first, inspect the diff second, rerun
relevant checks, and look for absences. Define “independent review” by outcome rather
than one runtime mechanism. It may be a fresh subagent, a human, a separate CI/review
workflow, or a focused second pass with context isolation.

Require the strongest independence for high-risk, architecturally significant, or
release-bound work. Allow self-review for genuinely small, low-risk changes.

#### 8. Make `state.md` conditional

Retain `state.md` for initiatives with multiple sessions, agents, phases, approvals, or
workstreams. For a contained single-session task, allow the active plan, Git diff, and
final report to provide sufficient state. If `state.md` remains universal, remove
“Recently done” and other fields that duplicate Git history.

A conditional state artifact will reduce merge conflicts and routine documentation
edits without weakening recovery where it matters.

#### 9. Turn numeric limits into defaults with review triggers

Label line caps, question counts, context thresholds, maintenance intervals, and branch
caps as seed heuristics. Put their project-specific values in one configuration section
or derived-standards document. For each value, explain the signal it controls:

- context threshold: declining reasoning quality or approaching model limit;
- question cap: product-owner fatigue;
- WIP cap: integration debt;
- maintenance cadence: observed documentation drift;
- document budget: retrieval cost.

Tune from measured behavior. Avoid treating elapsed days or task counts as evidence that
maintenance is needed when direct freshness signals are available.

#### 10. Narrow mandatory specification approval

Keep approval for genuinely ambiguous product shape, expensive-to-reverse commitments,
security approaches, and externally visible promises. Let projects delegate routine
feature shaping through accepted product principles, examples, or standing policies.

The goal is to preserve product-owner control over consequential intent without making
the word “feature” an automatic interruption.

#### 11. Replace universal “revert first” with containment analysis

For escaped defects, require immediate assessment of impact, safe containment options,
data compatibility, rollback feasibility, and external disclosure. Revert when it is
the safest clean containment. Do not revert automatically when doing so would corrupt
data, break a forward-only migration, reintroduce a security flaw, or violate a public
contract.

### Priority 2: Strengthen governance and reduce framework rot

#### 12. Add evidence before material self-modification

Retain the excellent smallest-edit rule, changelog, summary synchronization, and pruning
loop. Before changing routing, authority, verification gates, retention, or default
workflow, add:

1. the observed failure or feedback;
2. evidence strength and recurrence path;
3. the smallest proposed behavioral change;
4. a before/after scenario;
5. context and maintenance cost;
6. an independent judgment or explicit product-owner approval for material changes;
7. pilot scope and review trigger when evidence is incomplete.

This prevents the framework from oscillating after isolated incidents.

#### 13. Relax “one home per fact” into canonical ownership

Keep a canonical owner for each durable rule, fact, or command. Permit deliberately
short summaries in entrypoints and task handoffs when they identify and link the owner.
Add a consistency rule that changes to a canonical statement update its marked summaries
in the same change.

This expresses the real design more accurately than claiming a fact is physically
written only once.

#### 14. Treat freshness checks as signals, not proof

Keep `last-verified`, anchors, and symbol checks only where they provide value. Rename
their results to “review needed” rather than “stale” unless a semantic contradiction is
actually found. Allow anchors to be glob patterns or ownership areas, and distinguish
paths from commands, identifiers, and examples when scanning backticks.

Track the false-positive rate during maintenance. Remove checks that repeatedly create
work without identifying real drift.

#### 15. Separate the portable contract from runtime adapters

The role contracts and Markdown process can remain portable. Move model names,
worktree behavior, hook schemas, scheduled commands, and tool permission lists into
clearly optional runtime profiles. A profile should declare required capabilities and
fallback behavior when subagents, worktrees, or hooks are unavailable.

Hook installation should require explicit permission, validated commands, and a check
that the hook will not leak secrets or make normal editing unusably slow.

#### 16. Stop seeding an accepted adoption decision

Ship the framework-adoption ADR as a template or Proposed record. Fill the decision
date, owner, status, project context, and evidence only when the framework is actually
adopted. Remove uncited performance claims from the seed or provide their sources and
scope.

Similarly, create nonessential living artifacts on first use. A seed should distinguish
required bootstrap state from examples and optional future files.

## Concept-level disposition

| Concept | Recommendation | Author action |
| --- | --- | --- |
| Five-track routing | Keep | Add cost/risk examples and preserve easy escalation/downgrade |
| Durable exits | Keep | Permit notes, diffs, patches, or approved commits |
| Global session state | Revise | Require only for work that needs cross-session coordination |
| Known dead ends | Keep with scope | Record evidence and a retry condition; avoid an unbounded global graveyard |
| Predeclared verification | Keep | Apply to material behavior work; record legitimate amendments |
| Counterfactual tests | Keep with adaptation | Allow several safe proof methods rather than requiring a base checkout |
| Flake discipline | Keep | Require owner, bounded quarantine, and residual-risk disclosure |
| Full suite per task/review | Remove as universal default | Use affected checks during development and full checks at integration/release based on risk |
| Fresh-context review | Keep as a high-value method | Do not require one vendor-specific subagent mechanism for every behavior change |
| Feature spec approval | Narrow | Trigger on ambiguity, consequential promises, or project policy |
| Gates block only dependent work | Keep | Make checkpoint and batching behavior explicit |
| Parallel builder isolation | Keep as an adapter capability | Discover Git authority and provide a non-worktree fallback |
| Sequential merge verification | Keep where parallel branches are used | Let suite breadth depend on interaction risk and suite cost |
| Single-writer shared knowledge | Keep | Reduce the number of universal shared files to lower contention |
| One home per fact | Reword | Use canonical ownership plus marked summaries |
| Same-change knowledge updates | Keep | Say “same coherent change,” not necessarily “same commit” |
| Raw-input deletion | Remove as default | Use provenance-aware retention and authority checks |
| Direct framework refinement | Add governance | Require stronger evidence and judgment for material changes |
| Rule pruning | Keep | Use relevance and outcome evidence, not only task-count age |
| Claude agent and skill adapter | Keep as optional | Isolate vendor assumptions and document capability fallbacks |
| Automated hooks and scheduling | Keep as optional examples | Require explicit permission and project-specific safety validation |

## Suggested revision sequence

1. **Correct unsafe defaults first.** Patch commit authority, dirty-worktree handling,
   source trust, security triggers, source retention, and escaped-defect containment.
2. **Lighten the common path.** Introduce the risk-based verification/review matrix and
   conditional `state.md`; make all numeric thresholds configurable heuristics.
3. **Strengthen process governance.** Add evidence, independent judgment, and pilot
   rules to refinement; convert one-home language to canonical ownership.
4. **Clarify portability.** Separate core contracts from Claude-specific profiles and
   document fallbacks.
5. **Clean the seed.** Convert the accepted adoption ADR to a template, remove uncited
   claims, and create optional living artifacts only when needed.
6. **Pilot the revision.** Exercise Quick, Standard, Feature, Knowledge, Maintenance,
   interrupted, dirty-worktree, slow-suite, and no-subagent scenarios before declaring
   the process stable.

## Validation plan for the next version

Test the framework on representative repositories and track:

- time from request to first useful implementation;
- number of process files changed per task;
- test-suite minutes per completed task;
- product-owner interruptions and decision turnaround;
- review findings that prevent real defects;
- flaky checks detected versus silently rerun;
- successful resume rate after interruption;
- repeated failed approaches avoided by durable notes;
- merge conflicts involving shared knowledge files;
- stale-guidance findings and false positives from freshness checks;
- framework rules added, revised, compressed, and removed.

Include adversarial scenarios:

- a dirty worktree containing user-owned changes;
- a user who permits edits but not commits;
- a runtime without subagents or worktree isolation;
- an expensive monorepo test suite;
- a source document containing prompt-injection instructions;
- a forward-only migration with an escaped defect;
- two independent tasks that both discover knowledge updates;
- an approved spec that changes during implementation.

Success should mean improved product outcomes and recovery with less product-owner
attention—not merely higher compliance with the framework's artifact count.

## Final assessment

You have built a thoughtful framework with several exceptional controls. The strongest
parts are its verification integrity, resumable loops, explicit gate mechanics,
knowledge distillation, independent-review design, parallel integration discipline, and
willingness to prune its own rules. Those ideas deserve to remain central.

The next version should focus on proportionality and authority. Remove assumptions that
an agent may commit, own a dirty worktree, run every test twice, or spawn a particular
reviewer. Make state and ceremony conditional, strengthen source trust and operational
safety, preserve provenance, and require better evidence before the process edits
itself. With those changes, the framework would be safer, easier to adopt, and more
credible across repositories of different sizes and tool environments.
