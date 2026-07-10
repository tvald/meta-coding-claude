---
name: decide
description: Record an architecture/dependency/design decision as an ADR in the decision log. Use proactively the moment a decision trigger fires — new dependency, schema or contract change, auth approach, anything expensive to reverse, a PO overrule, or a spec deviation.
---

Record a decision per `readme/meta/knowledge/decisions.md` — check its trigger list
first; if no trigger actually fires, say so and stop (over-recording is how logs die).

1. Skim the index (`readme/knowledge/decisions/README.md`) for prior/conflicting
   decisions. Superseding one? Follow the supersession mechanics.
2. Write `NNNN-slug.md` from `readme/meta/templates/adr.md`: Context, Decision (from
   the statement given at invocation and the current conversation), Alternatives
   (include "do nothing"), Consequences. Under a page. Mark `Decided by:` honestly —
   agent decisions within standing approval are normal and expected.
3. Update the index table, and any standards/AGENTS.md rules distilled from a
   superseded decision, in the same commit as the ADR.
4. If the decision touches a mandatory PO gate (security approach, irreversible
   action), the ADR documents the *proposal* — park it `⏳PO` in `state.md` rather
   than acting on it.
