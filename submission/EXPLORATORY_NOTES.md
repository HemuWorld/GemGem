
# EXPLORATORY_NOTES.md

These notes summarize what I explored beyond scripted tests to uncover behavior under real user interaction patterns.

## Scope
Exploratory testing was performed on catalog browsing and search behavior in the staging environment to identify UI state, validation, and data consistency issues.

## Charter 1 - Filter Interaction Under Rapid User Actions

### Goal
Assess category listing stability when users apply multiple filters in quick succession.

### What I Tried
1. Navigate to **All Categories -> View All -> Ring**.
2. Apply filters such as Gifts Under $3K, Fast Shipped, and IGI-Authenticated Items.
3. Click filters rapidly without waiting for each response.
4. Observe result section behavior during state transitions.

### Observation
- The UI temporarily shows "No result found." during rapid filter changes.
- Previously loaded results are cleared before the next response is rendered.

### Risk Assessment
- Users may interpret temporary empty state as actual zero inventory.
- This can reduce confidence and interrupt product discovery.

### Recommendation
- Preserve previous results until new filter response completes.
- Show a loading state/skeleton instead of clearing results immediately.

---

## Charter 2 - Search Behavior With Empty or Whitespace Input

### Goal
Verify input validation behavior for empty or whitespace-only search submissions.

### What I Tried
1. Open the homepage.
2. Focus the search input.
3. Enter whitespace only.
4. Submit using Enter/Search.
5. Observe navigation and result behavior.

### Observation
- Whitespace-only input is accepted as a valid query.
- User is redirected to the shop results page.

### Risk Assessment
- Triggers non-actionable searches and unnecessary backend requests.
- Can create a confusing experience for users who expected validation feedback.

### Recommendation
- Trim input before validation and block empty queries.
- Display user guidance, for example: "Please enter a search term."

---

## Charter 3 - Sorting Behavior Consistency on Shop Page

### Goal
Confirm that product ordering updates correctly when switching between sort options.

### What I Tried
1. Open homepage and navigate to **Shop Jewelry**.
2. Select Most Discounted from Sort By.
3. Validate product order change.
4. Switch sort option to Most Relevant.
5. Verify product order refresh.
6. Invalid-state check: verify whether selected sort label can diverge from actual returned ordering.

### Observation
- Product order updates correctly for Most Discounted.
- After switching back to Most Relevant, the label changes, but product order still appears discount-based.
- UI selection and returned dataset appear out of sync.

### Risk Assessment
- Users may make decisions based on incorrect ordering.
- Perceived credibility of sorting and search relevance is reduced.

### Recommendation
- Trigger a full data refresh on every sort change.
- Add assertion/monitoring to ensure selected sort key matches API query and rendered order.
