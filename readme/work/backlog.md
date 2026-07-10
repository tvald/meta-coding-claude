<!-- LIVING doc — known-but-not-now work, priority-ordered (top = next).
     Budget: ~150 lines; prune or archive what stops mattering.
     Format: one line per item — "- <imperative summary> — <why/source>", optionally
     linking a stub spec in specs/ when ingestion captured rich detail.
     Grouped headers (## v2, ## someday) are fine when the PO thinks in phases. -->

# Backlog

- Revisit conditional imports from the 2026-07 alternative-framework review once
  onboarding fills `product.md`: AI-feature safety standards (model output untrusted,
  minimal tool permissions, injection guardrails) if the product ships AI features;
  UI/UX verification checklist (states, viewports, keyboard/screen-reader basics) if it
  has a UI; blameless incident-note form with a recurrence check if it operates
  production services — source: PO-directed review of an external framework (details
  were in tmp/CRITIQUE.md, uncommitted; this entry is self-contained)
- Conditional imports from the 2026-07 critique adjudication (same trigger — once
  onboarding fills `product.md`): data-migration rehearsal + rollback guidance if the
  product has real stored data; observability/degraded-state guidance (queues, retries,
  background jobs) if it operates services — source:
  `readme/log/archive/critique-2026-07.md` §13, adopted as risk-triggered additions,
  not universal ceremony
