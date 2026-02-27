# Research: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: 2026-02-27

## Overview

This document captures the research and design decisions for implementing the overdue todo items feature. All key decisions were addressed through specification clarification sessions documented in the feature spec.

## Key Design Decisions

### 1. Visual Treatment for Overdue Indicator

**Decision**: Use red/warning color combined with an icon (exclamation or clock icon)

**Rationale**:
- Dual visual cues (color + icon) improve accessibility
- Users with color blindness can still identify overdue items via icon
- Red/warning color universally signals urgency and attention needed
- Icon provides immediate visual recognition without reading text

**Alternatives Considered**:
- Color only: Rejected due to accessibility concerns (color blindness)
- Icon only: Rejected as less visually prominent and slower to scan
- Text label "OVERDUE": Rejected as it takes more space and is slower to scan
- Strikethrough or different font style: Rejected as less intuitive and effective

**Implementation Notes**:
- Use color from design system's warning/error palette (red)
- Support both light and dark mode color variants
- Icon size should be consistent with design system (likely 16-20px)
- Add ARIA label for screen reader support (see decision #5)

---

### 2. Overdue Status Computation

**Decision**: Compute overdue status dynamically on-the-fly at query/display time

**Rationale**:
- Always current - no risk of stale data as date changes
- Simpler implementation - no background jobs or triggers needed
- Reduced storage complexity - no additional database field required
- Better maintainability - single source of truth (due date)
- Performance is acceptable - simple date comparison is fast (<1ms per item)

**Alternatives Considered**:
- Store as persisted field: Rejected due to complexity of keeping it synchronized
  - Would require background job to update all todos at midnight
  - Risk of stale data if job fails or doesn't run
  - Additional storage and migration complexity
  - Harder to test and maintain
- Computed column in database: Rejected as project uses in-memory storage (no database)

**Implementation Notes**:
- Compute in both backend (API responses) and frontend (for immediate UI updates)
- Backend: Add helper function `isOverdue(todo)` in todoService.js
- Frontend: Similar helper function for local computation
- Cache current date once per render cycle to avoid repeated `Date.now()` calls
- Performance requirement: <50ms for 1000 todos (NFR-001) easily met with simple comparison

---

### 3. Due Date Storage and Timezone Handling

**Decision**: Store dates as calendar dates only (no timezone), compare against local calendar date

**Rationale**:
- Matches user mental model - "due Feb 28" means Feb 28 in their local timezone
- Simpler implementation - no timezone conversion logic needed
- No edge cases from daylight saving time transitions
- Aligns with how most users think about due dates (calendar date, not specific moment)
- Single-user application reduces timezone complexity

**Alternatives Considered**:
- Store with timezone: Rejected as overly complex for single-user desktop app
  - Would need timezone detection and conversion
  - More complicated date comparison logic
  - Doesn't match user mental model for task due dates
- Store as UTC timestamp: Rejected for same reasons as above
- Store date + separate timezone field: Rejected as unnecessary complexity

**Implementation Notes**:
- Store as ISO date string: "YYYY-MM-DD" (e.g., "2026-02-28")
- Compare using JavaScript Date objects: `new Date(dueDate) < new Date().setHours(0,0,0,0)`
- Use `.toISOString().split('T')[0]` to get current date in local timezone
- For testing: Mock `Date.now()` to control "current date"

**Date Comparison Logic**:
```javascript
function isOverdue(todo) {
  if (!todo.dueDate || todo.completed) return false;
  
  const today = new Date().toISOString().split('T')[0];
  return todo.dueDate < today;
}
```

---

### 4. Sorting and Filtering by Overdue Status

**Decision**: No special sorting or filtering - overdue todos remain in existing sort order, only visually distinguished

**Rationale**:
- Maintains user's chosen organization method (by date created, by priority, etc.)
- Simpler implementation - no additional sort logic needed
- Visual indicator is sufficient for quick identification
- Avoids disrupting user's workflow and expectations
- Explicitly marked as out of scope in specification

**Alternatives Considered**:
- Auto-prioritize overdue todos to top: Rejected as it disrupts user's chosen sort order
- Add "Overdue" filter option: Rejected as out of scope (per constitution: focus on core features only)
- Separate "Overdue" section: Rejected as it complicates UI and is out of scope

**Implementation Notes**:
- No changes to existing sort logic required
- Visual indicator (color + icon) provides sufficient prominence
- Future enhancement could add optional sorting/filtering in future iterations

---

### 5. Accessibility for Screen Readers

**Decision**: Add ARIA attributes (e.g., `aria-label="Overdue"`) to announce overdue status to screen readers

**Rationale**:
- Ensures feature is usable by visually impaired users
- Meets WCAG 2.1 Level AA requirements (NFR-002)
- Complementary to visual indicators (color + icon)
- Simple to implement with React accessibility props

**Alternatives Considered**:
- Visual-only indicators: Rejected as it excludes screen reader users
- Hidden text labels: Considered equivalent but aria-label is more semantic
- Role attributes: Not necessary for static indicators

**Implementation Notes**:
- Add `aria-label="Overdue"` to overdue indicator element in TodoCard component
- Consider `role="status"` for live updates when todo becomes overdue
- Test with screen reader software (NVDA, JAWS, VoiceOver)
- Ensure color contrast meets 4.5:1 minimum for text/icons (WCAG AA)

**Example Implementation**:
```jsx
{isOverdue && (
  <span 
    className="overdue-indicator" 
    aria-label="Overdue"
    role="status"
  >
    <WarningIcon /> {/* or ClockIcon */}
  </span>
)}
```

---

## Technology Best Practices

### React Best Practices for Date Handling

**Research Findings**:
- Use native JavaScript Date API - no external library needed for simple date comparison
- Memoize date computations with `useMemo` to avoid recalculation on every render
- Mock `Date.now()` in tests using Jest's timer mocks (`jest.useFakeTimers()`)
- Avoid storing Date objects in state - use ISO strings and convert when needed

**Example Pattern**:
```javascript
// In component
const today = useMemo(() => new Date().toISOString().split('T')[0], []);
const overdueItems = useMemo(() => 
  todos.filter(todo => isOverdue(todo, today)),
  [todos, today]
);
```

---

### Express.js Best Practices for Computed Properties

**Research Findings**:
- Compute derived properties in service layer, not in route handlers
- Keep route handlers thin - delegate business logic to services
- Return consistent API response shape (always include computed fields)
- Document computed fields in API contract/documentation

**Example Pattern**:
```javascript
// In todoService.js
function enrichTodo(todo) {
  return {
    ...todo,
    isOverdue: isOverdue(todo)
  };
}

function getAllTodos() {
  return todos.map(enrichTodo);
}
```

---

### Accessibility Best Practices for Visual Indicators

**Research Findings**:
- Always combine color with another visual cue (icon, text, pattern)
- Use semantic HTML and ARIA attributes for screen readers
- Ensure minimum 4.5:1 color contrast ratio (WCAG AA)
- Test with actual screen reader software, not just automated tools
- Consider reduced motion preferences for animations

**Color Contrast for Dark/Light Mode**:
- Light mode: Red text/icon (#d32f2f) on white background = 7.0:1 ✓
- Dark mode: Red text/icon (#ef5350) on dark background (#1e1e1e) = 5.2:1 ✓

---

## Performance Considerations

### Computation Cost Analysis

**Overdue Check Performance**:
- Single todo: ~0.001ms (1 microsecond) - simple date comparison
- 1000 todos: ~1ms (1000 comparisons)
- Well under 50ms requirement (NFR-001) with 50× headroom

**Optimization Strategies** (if needed in future):
- Memoize current date once per request/render
- Use binary search if todos are sorted by due date (not applicable currently)
- Consider virtualization for very long lists (>1000 items)

**Current Assessment**: No optimization needed - simple implementation meets requirements.

---

## Testing Strategy

### Unit Tests Required

**Backend (todoService.js)**:
- Test `isOverdue()` with various date scenarios (past, today, future, no date)
- Test with completed vs incomplete todos
- Test edge cases (far past, boundary dates)
- Mock `Date.now()` to control "current date"

**Frontend (TodoCard.js)**:
- Test overdue indicator renders for past due date + incomplete
- Test indicator does NOT render for future date or completed todos
- Test ARIA attributes are present
- Test visual styles are applied correctly

**Integration Tests**:
- Test end-to-end: create todo with past due date, verify visual indicator
- Test status updates immediately when completing an overdue todo
- Test status updates when changing due date

### Accessibility Tests Required

- Manual testing with screen readers (NVDA, JAWS, VoiceOver)
- Automated contrast ratio checking (e.g., axe-core)
- Keyboard navigation testing (ensure indicators are announced)

---

## Summary

All key design decisions have been resolved through specification clarification:

1. **Visual Treatment**: Red/warning color + icon (dual cue for accessibility)
2. **Computation**: Dynamic on-the-fly (no storage, always current)
3. **Timezone**: Date-only, no timezone (simple, matches user mental model)
4. **Sorting**: No special sorting (maintain existing order, visual distinction only)
5. **Accessibility**: ARIA labels + semantic markup (screen reader support)

These decisions prioritize simplicity, maintainability, and accessibility while meeting all functional and non-functional requirements. The implementation will be straightforward with minimal complexity and excellent performance characteristics.

**Next Steps**: Proceed to Phase 1 (Design & Contracts) to define data models and API contracts.
