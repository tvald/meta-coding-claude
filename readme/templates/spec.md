# Spec: <feature name>

<!-- TEMPLATE — copy to readme/work/specs/<slug>.md for each Feature-track item
     (conventions: readme/work/README.md). Delete guidance comments when filling in.
     A spec answers WHAT and WHY. It never contains HOW (that's the plan) or code.
     Right-size it: a spec should be as short as the feature allows — and shorter than
     the diff it produces. One paragraph is a valid spec. -->

- **Status:** draft | approved | needs-reapproval | implemented | superseded
- **Approval:** <!-- unfilled while draft. On approval: date + the PO's yes (quote or
     reference), or "inherited from <PO-authored source>" for faithfully derived content.
     Every Feature-track spec requires PO approval — there is no self-exemption. -->
- **Date:** YYYY-MM-DD
- **Related:** <!-- links to decisions (ADR numbers), prior specs, external docs -->

<!-- LIVING doc — freshness (readme/knowledge/management.md#freshness-metadata):
     last-verified: YYYY-MM-DD
     anchors: (code paths whose change likely invalidates this spec; fill once known) -->

## Problem

<!-- What user/business problem does this solve? 1–3 sentences. If you can't state it, stop and run the interview protocol (readme/knowledge/ingestion.md). -->

## Outcome

<!-- Observable result when done. Phrase as behavior, not implementation:
     "A user can X", "The system does Y when Z". -->

## Requirements

<!-- Numbered, testable statements. Each becomes at least one verification.
     Use MUST / SHOULD / MAY. Mark uncertain items with [ASSUMPTION] — these need PO confirmation before build. -->

1. MUST ...
2. SHOULD ...

## Out of scope

<!-- Explicitly excluded. Prevents scope creep and re-litigating. -->

## Acceptance checks

<!-- How we will know each requirement is met. Concrete: commands to run, behavior to observe.
     The verifier executes these; write them so a stranger could. -->

- [ ] ...

## Open questions

<!-- Anything blocking approval. Each gets asked via the interview protocol; answers get folded
     into Requirements and the question is deleted. An approved spec has zero open questions. -->
