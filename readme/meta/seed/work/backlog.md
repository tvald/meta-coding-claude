<!-- LIVING doc — known-but-not-now work, priority-ordered (top = next).
     Budget: ~150 lines; prune or archive what stops mattering.
     Format: one line per item — "- <imperative summary> — <why/source>", optionally
     linking a stub spec in specs/ when ingestion captured rich detail.
     Grouped headers (## v2, ## someday) are fine when the PO thinks in phases. -->

# Backlog

- Conditional standards imports — revisit once onboarding fills `product.md`, adopting
  only what the product's risk profile triggers: AI-feature safety standards (model
  output untrusted, minimal tool permissions, injection guardrails) if it ships AI
  features; UI/UX verification checklist (states, viewports, keyboard/screen-reader
  basics) if it has a UI; blameless incident-note form with a recurrence check if it
  operates production services; data-migration rehearsal + rollback guidance if it has
  real stored data; observability/degraded-state guidance (queues, retries, background
  jobs) if it runs services — source: framework-kit external reviews (2026-07); this
  entry is self-contained.
