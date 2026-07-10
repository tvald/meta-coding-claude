# An agentic development framework

<!-- PROCESS doc: the human-facing front door. Agents boot from AGENTS.md, not this file.
     Changes via refinement (readme/meta/process/refinement.md). -->

This repository contains a process framework for software projects that are **built by
AI agents and directed by one human** — the *product owner* (PO). That's you. You
describe what you want, make a small number of key decisions, and audit the results;
the agents do everything else: planning, coding, testing, reviewing, documenting, and
maintaining their own process.

It is markdown all the way down. There is no runtime, no server, no install step —
just documents that agents read and follow, designed so that any capable coding agent
can pick up the project cold and act with full context. It ships with native wiring
for [Claude Code](.claude/README.md) and [Codex](.agents/README.md), but the framework
itself is tool-agnostic.

## Why it exists

Agent-built projects fail in three characteristic ways, and every rule in this
framework traces back to one of them:

1. **Lost context.** Every agent session starts ignorant. Without deliberate
   record-keeping, each session re-discovers the project, re-asks you questions, and
   repeats old mistakes. → The framework keeps a small, ruthlessly current **knowledge
   base** that carries context across sessions.
2. **Silent re-decisions.** A choice made in week one gets quietly remade — differently —
   in week three. → Decisions are recorded when they happen (as ADRs), and agents must
   check the decision log before re-deciding.
3. **Unverified velocity.** Agents produce plausible code fast; "it should work" is not
   the same as "it works." → Nothing counts as done until its checks have actually been
   executed and observed to pass, and behavior changes are reviewed by a separate
   fresh-context agent.

## Getting started

**Seed a project:** copy `AGENTS.md` and `readme/meta/` into your repository (new or
existing) — plus `.claude/` and a one-line `CLAUDE.md` (`@AGENTS.md`) if you use Claude
Code, or `.agents/` if you use Codex — then start an agent session. The first session creates the mutable state files
itself from `readme/meta/seed/`; deleting them later resets the framework for a new
project ([procedure](readme/meta/README.md#deploy-bootstrap-reset)).

**First run — onboarding.** The first session interviews you: what the project is, who
it's for, what's in and out of scope, what "release" means for you. For an existing
codebase it first surveys the code and existing docs, then asks you only what it
couldn't infer. For a greenfield project it proposes a stack and gets your pick. This
usually takes one conversation; if you walk away mid-interview, the agent parks its
remaining questions and ends cleanly rather than guessing on the important ones.

After onboarding, you interact in plain language. There is no syntax to learn.

## How you work with it

**Ask for things the way you'd ask a competent team.** "Add CSV export", "the login
page is broken", "here's a PRD, read it", "keep going". The agent classifies each
request by weight and applies proportional ceremony:

- A typo-level fix is just done, immediately.
- A clear behavior change gets written acceptance checks and an independent review.
- A **new capability — or anything ambiguous — gets a short spec first, and that spec
  comes to you for approval before any code is written.** This is deliberate: the one
  thing agents cannot decide for you is *what* to build.
- Documents you share get synthesized into the knowledge base; maintenance and refactors
  run in their own low-ceremony loop.

You never pick the track yourself, and you can be as vague or precise as you like —
ambiguity is one of the routing signals, not an error.

**Say "continue" and walk away.** Given no specific goal, a session picks up the
recorded state, works through the queued next steps and backlog in priority order,
and closes by writing down exactly where things stand. In Claude Code this is the
`/work` command. Sessions are designed to be interrupted: state lives in files, not in
the conversation, so any session can resume another's work — including after a crash.

**Come back whenever.** If you've been away, the session opens with a ≤10-line digest:
what shipped, what's in flight, what's waiting on you. You never have to reconstruct
the story from git.

### Claude Code commands

| Command | What it does |
|---------|-------------|
| `/work` | run autonomously from the current state and backlog — the default; it routes everything |
| `/onboard` | first-run onboarding |
| `/spec` | take a feature through spec → your approval → tasks |
| `/ingest` | feed in documents, or have the agent interview you on a topic |
| `/decide` | record an architecture/dependency decision as an ADR |
| `/check` | consistency audit of docs vs code, budgets, freshness |
| `/retro` | run a retrospective |

When unsure, `/work` — it routes.

## What agents will and won't do without you

Agents proceed autonomously **except** at four gates, and this list is exhaustive —
anything not on it, they decide themselves:

1. **Feature spec approval** — you sign off on *what* gets built.
2. **Irreversible or externally visible actions** — deploying, publishing, migrating or
   deleting real data, sending communications, spending money, granting access.
3. **Release** — whatever "release" means for your project (you define this during
   onboarding).
4. **Security-sensitive changes** — anything altering the behavior of auth or
   authorization, secrets handling, payments, personal or regulated data, or the
   permissions of agents, CI, or infrastructure gets your sign-off on the approach,
   regardless of size.

Gates never stall the system. When work hits one, the agent prepares a decision-ready
summary (≤10 lines: what's proposed, the recommendation, what happens on yes/no), parks
the item marked `⏳PO`, and moves on to other work. Your pending decisions accumulate
in one visible place instead of blocking everything behind them. You can extend or
shrink the gate list; that change is itself recorded as a decision.

The framework also **cannot loosen its own leash**: rules that improve themselves (see
below) explicitly may not touch the gate list or agent authority boundaries without
your approval.

## What "done" means

When an agent tells you something is done, you should expect that:

- Its acceptance checks and the full check suite (build, tests, lint, types) were
  **actually executed and observed to pass** — not reasoned about.
- New behavior has a test that fails without the change.
- An independent agent with fresh context reviewed the diff (for anything
  behavior-changing) and re-ran the checks itself — reported results are treated as
  claims, not evidence.
- The documentation that made the change true rode along **in the same commit** —
  decisions, terms, gotchas, updated specs. "Update the docs later" is banned because
  later never comes.

Failures are reported, not hidden: a task that can't pass its checks stays open with an
honest account, abandoned approaches are logged as dead ends so no future agent retries
them, and a defect that escapes to you is disclosed proactively — with a revert first
when one is clean, and a regression test always.

## Where to look when you check in

Everything is auditable through the repo — asynchronously, on your schedule:

| Look at | To see |
|---------|--------|
| `readme/knowledge/state.md` | the now: current focus, next steps, what's waiting on you (`⏳PO`) |
| `readme/work/backlog.md` | everything known but not started, in priority order |
| `readme/knowledge/decisions/` | every significant decision, with context and alternatives |
| `readme/log/framework-changelog.md` | every change the framework has made to its own rules, and why |
| `git log` | the full record — knowledge rides commits, so commits tell the story |

Anything an agent believed without your confirmation is tagged `[ASSUMPTION]` in the
knowledge base, and interviews target those first — so you can also just ask "what are
you assuming?"

## It maintains itself

Two expectations worth setting explicitly:

- **Your corrections become rules.** Every time you correct the process, it's logged;
  if you have to correct the same thing twice, a rule change is mandatory — the goal is
  that the third time can't happen. Explicit feedback ("stop doing X", "always Y") is
  applied to the framework docs immediately.
- **The docs stay small on purpose.** Every living document has a size budget and is
  archived — never grown — past it. Periodic maintenance audits docs against code, prunes
  rules that never fire, and repairs contradictions. A stale doc is treated as worse
  than no doc, because it misleads with confidence.

Both run through an audited procedure: every self-modification lands in the
[framework changelog](readme/log/framework-changelog.md) with its trigger, so you can
review process drift the same way you review code — and revert anything you dislike by
saying so.

## Going deeper

[`readme/meta/README.md`](readme/meta/README.md) is the map of the whole framework, with
a suggested reading order. The short version: [orchestration](readme/meta/process/orchestration.md)
explains how work is routed, [loops](readme/meta/process/loops.md) defines the repeatable
procedures, [quality-gates](readme/meta/standards/quality-gates.md) defines "done" and your
gates, and [management](readme/meta/knowledge/management.md) governs the knowledge base.
Agents boot from [`AGENTS.md`](AGENTS.md), which is deliberately a map, not the
territory.
