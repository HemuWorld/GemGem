# TEST_STRATEGY.md

This strategy reflects a release-owner approach: prioritize business-critical risk, keep execution deterministic, and ensure findings are traceable to evidence.

## Scope
- UI Journey 1: homepage search, catalog sorting, PDP validation.
- UI Journey 2: add-to-cart, checkout progression, Stripe token flow.
- API coverage: negative behavior, response contract, and UI-to-API correlation.

## Assumptions
- Staging search is available and used for deterministic product discovery.
- Testing is non-destructive.
- Only test card/tokenized payment flow is used.
- No sensitive data is stored in artifacts.

## API Authentication Approach
- API tests target publicly accessible storefront endpoints discovered from DevTools during UI flows.
- Session/programmatic auth was not required for these endpoints in this environment.
- Fallback applied: unauthenticated negative test + contract test + UI-to-API correlation test on accessible endpoints.

## Top Risks and Mitigations
1. Catalog volatility can break deterministic selection.
Mitigation: search fallback sequence with minimum result threshold before product selection.
2. UI selector changes can break test stability.
Mitigation: Page Object Model centralizes selectors and interaction logic.
3. Checkout timing/session behavior can be flaky in staging.
Mitigation: clear-cookie start, explicit waits/assertions, trace and video artifacts.

## Determinism Controls
- Search sequence: `rings` -> `necklace` -> `bracelet` (env-overridable).
- Threshold gate: `MIN_RESULTS` (default `3`).
- Selection rule: proceed only when threshold is met.
- Assertion focus: sort order, PLP-to-PDP consistency, checkout confirmation states.
- Cart hygiene: clear-cookie session reset is applied before checkout flow to avoid stale client cart state.
- Limitation: backend cart persistence can still vary by account/server state in staging.

## Execution Layers
- Smoke: API contract and one catalog sort path for fast environment confidence.
- Regression: full UI journey (catalog + PDP + checkout) plus full API suite.

## Entry and Exit Criteria
- Entry: staging reachable, APIs responding, required env values configured.
- Exit: critical paths executed, defects documented in `submission/BUGS.md`, and proof linked in `submission/EVIDENCE.md`.
