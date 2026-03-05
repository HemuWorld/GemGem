# GemGem Assessment — Full Proof Implementation Plan

## Objective
Deliver a complete, runnable submission for the staging jewellery e-commerce site that satisfies all mandatory requirements in `requirement.md`, with strong determinism, evidence, and reporting.

---

## 1) Chosen Tech Stack (fastest + safest)

- **Language:** JavaScript
- **Framework:** Playwright Test (UI + API in same framework)
- **Browser:** Chromium (mandatory)
- **Reports:** Playwright HTML
- **Artifacts on failure:** screenshot + trace + video

### Why this stack
- One tool handles UI and API tests, reducing setup time.
- Easy network correlation using Playwright traces and request inspection.
- Built-in retries, projects, reporters, and storage state for auth reuse.

---

## 2) Target Repository Structure

```text
GemGem/
  automation/
    package.json
    playwright.config.js
    .env.example
    tests/
      ui/
        product-discovery.spec.js
        add-to-cart-checkout.spec.js
        cart-hygiene.spec.js
      api/
        catalog.contract.spec.js
        auth-negative.spec.js
        ui-correlation.spec.js
    fixtures/
      auth.setup.js
      deterministic.js
      test-data.js
    utils/
      selectors.js
      cleanup.js
      evidence.js
  submission/
    TEST_STRATEGY.md
    TEST_CASES.md
    EXPLORATORY_NOTES.md
    BUGS.md
    EVIDENCE.md
    README.md
    RUN_RESULTS.md
  IMPLEMENTATION_PLAN.md
  requirement.md
```

---

## 3) Compliance Checklist (must pass)

1. `submission/` contains all 7 required docs.
2. UI tests >= 3 and cover:
   - Journey 1 Product Discovery
   - Journey 2 Add-to-Cart + Checkout (safe stop allowed)
3. API tests >= 3 and include:
   - 1 negative test
   - 1 contract test with nested field checks
   - 1 UI-correlated endpoint test
4. Deterministic selection strategy documented and implemented.
5. Cart clean start logic present.
6. No secrets in repo.
7. Local run commands documented and verified in `RUN_RESULTS.md`.
8. At least one report generated (Playwright HTML).

---

## 4) Deterministic Strategy (dynamic catalogue safe)

### Search fallback policy
- Primary term: `ring`
- Fallback 1: `necklace`
- Fallback 2: `bracelet`

### Selection rule
- Open PLP/search result page.
- Apply stable sort (prefer **price low to high**).
- Require minimum visible product count **N = 3**.
- Select **first visible in-stock item** after sort/filter.
- If no in-stock items, select first visible and assert out-of-stock UI state.

### Stable assertions (avoid hardcoded names)
- Product tile count >= N
- PDP price is present and valid currency format
- Variant/option UI updates price/image/availability on selection
- Add-to-cart button state reflects availability

### Fallback logging
- Log chosen search term and fallback transitions in test output.

---

## 5) UI Automation Plan (3 tests minimum)

## UI-1: Product Discovery E2E (Journey 1)
**Goal:** Validate search -> filter/sort -> PDP -> key UI behavior

Steps:
1. Open base URL in Chromium.
2. Search with deterministic term policy.
3. Apply one filter (category/material/price-range depending on available UI) and stable sort.
4. Assert result count >= N.
5. Open first deterministic item.
6. On PDP validate one key behavior:
   - image gallery changes on thumbnail click, or
   - variant selection updates price/availability.

Assertions:
- Search results visible
- Sorting/filtering effect is observable
- PDP loaded with non-empty price + actionable UI state

## UI-2: Add to Cart + Checkout Safe Flow (Journey 2)
**Goal:** Validate cart and checkout flow up to Stripe test payment attempt

Steps:
1. Ensure clean cart state.
2. Add deterministic product to cart.
3. Proceed checkout with placeholder-safe customer data.
4. Reach payment section.
5. Attempt Stripe test details if iframe handling and safe completion are possible.
6. If not safely completable, stop at payment and validate payment UI + network.

Assertions:
- Cart line item appears with expected qty/price summary
- Checkout steps accessible
- Payment section rendered
- Payment-related request observed (redacted evidence)

## UI-3: Cart Hygiene / Repeatability Guard
**Goal:** Ensure suite order independence

Steps:
1. At test start, check cart badge/items.
2. If non-empty, remove all items via safe UI actions.
3. Assert cart empty state.

Assertions:
- Empty cart achieved before dependent tests.

---

## 6) API Automation Plan (3 tests minimum)

## API-1: Negative (Unauthorized or Invalid Params)
- Call protected endpoint without auth and expect `401/403`, or
- Send invalid quantity/invalid query and expect `400/422`.

## API-2: Contract Validation (with nested structure)
- Endpoint from catalog/listing or product detail.
- Validate required fields and types, including nested object/array, e.g.:
  - `product.id` string/number
  - `product.price.amount` number
  - `product.images[0].url` string
  - `product.variants` array shape

## API-3: UI-Correlated Test
- Capture endpoint used during UI search/filter/PDP from Network.
- Execute same endpoint via API test.
- Assert response supports same UI behavior (e.g., sorted price order, availability flag, displayed fields).

### Auth strategy
- Prefer Playwright storage state from UI login and reuse cookies for API requests.
- If login API discoverable, add setup request auth.
- If auth blocked, document limitation and still provide 1 unauthorized + 2 meaningful public endpoint tests.

---

## 7) Submission Docs Plan

## A) TEST_STRATEGY.md
- Scope + assumptions
- Top 3 risks and mitigations
- Determinism + cleanup + stable assertions
- Smoke vs regression definitions

## B) TEST_CASES.md (>=10)
Include for each: preconditions, steps, expected, priority, type.

## C) EXPLORATORY_NOTES.md (>=3 charters)
Each includes goal, what tried (slow/empty/invalid/permission-like), findings, follow-ups.

## D) BUGS.md (>=2)
- Real bug or testability/observability gap only
- Include severity/priority, repro, expected vs actual, impact, recommendation

## E) EVIDENCE.md
- Network Fetch/XHR screenshot with status and payload preview (redacted)
- Console screenshot and impact note
- 4–6 bullets mapping UI action to API call
- Payment-related request proof if Journey 2 touches payment

## F) README.md
- Prereqs
- Install/run UI and API commands
- Env vars and `.env.example`
- Determinism/cleanup notes
- Artifacts location

## G) RUN_RESULTS.md
- Exact commands
- At least one full run confirmation
- Flakiness notes
- Artifacts paths
- Data changes + revert notes

---

## 8) 3-Hour Timebox Execution Plan

## 0:00–0:20 — Setup
- Initialize Playwright JS project in `automation/`.
- Configure reporters, artifacts, Chromium project, env loading.
- Add base utilities (selectors, deterministic fallback, cart cleanup).

## 0:20–1:25 — UI Automation
- Build and stabilize UI-1 discovery flow.
- Build UI-2 add-to-cart + checkout safe-stop/payment evidence.
- Add UI-3 cart hygiene guard.
- Capture screenshots/traces on intentional dry run.

## 1:25–2:05 — API Automation
- Discover endpoints in DevTools/Playwright network.
- Implement negative, contract, and UI-correlation tests.
- Validate auth strategy and fallback plan.

## 2:05–2:35 — Documentation
- Write all required `submission/` docs with concise evidence-backed detail.
- Add at least 10 manual cases and 3 exploratory charters.
- Add 2 valid findings (bugs or testability/observability gaps).

## 2:35–2:55 — Validation Run
- Run full suite once end-to-end.
- Re-run flaky area if needed.
- Record exact commands and output locations.

## 2:55–3:00 — Final Gate
- Verify no secrets.
- Verify required file presence.
- Ensure all mandatory points satisfied.

---

## 9) Playwright Configuration Standards

- `retries: 1` for CI-like stability (optional local `0`)
- `use: { trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure' }`
- `reporter: [['html', { open: 'never' }]]`
- `projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]`
- No fixed sleeps; prefer locator or request/event waits.

---

## 10) Quality Gates Before Submission

- [ ] Every required file exists under `submission/`
- [ ] UI tests >= 3, API tests >= 3
- [ ] Negative API + contract + UI-correlated API present
- [ ] Deterministic fallback works and is documented
- [ ] Cart cleanup proven
- [ ] README commands actually run
- [ ] Reports generated and paths documented
- [ ] Evidence has redacted sensitive values
- [ ] RUN_RESULTS includes exact commands and observations

---

## 11) Risk Register (Top 3)

1. **Dynamic catalog causes flaky selection**
   - Mitigation: fallback terms + min result threshold + deterministic first visible rule.

2. **Auth/API endpoint discoverability limitations**
   - Mitigation: storage-state reuse; if blocked, document and execute unauthorized + public endpoint tests.

3. **Checkout/payment instability due to Stripe iframe constraints**
   - Mitigation: safe-stop policy at payment with UI + network proof and redacted request evidence.

---

## 12) If Time Runs Out (safe stop)

Prioritize in this order:
1. Keep automation runnable and deterministic.
2. Complete `README.md` + `RUN_RESULTS.md`.
3. Document what remains: extra tests, CI integration, refactors, coverage expansion.

This guarantees a professional submission even if full coverage is not completed.
