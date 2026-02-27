# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: February 27, 2026  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items: Users need a clear, visual way to identify which todos have not been completed by their due date."

## Clarifications

### Session 2026-02-27

- Q: What specific visual treatment should be used for the overdue indicator? → A: Red/warning color + icon (e.g., exclamation or clock) - dual cue for accessibility
- Q: Should overdue status be computed dynamically on-the-fly or stored in the database? → A: Computed dynamically on-the-fly (no storage, always current, simpler maintenance)
- Q: How should due dates be stored and compared across different timezones? → A: Date-only, no timezone (treat as calendar date like "Feb 28", simplest, matches user mental model)
- Q: Should users be able to sort or filter by overdue status, or should overdue todos be automatically prioritized in display order? → A: No special sorting - overdue todos stay in existing sort order, only visually distinguished
- Q: How should screen reader users or users with visual impairments identify overdue status? → A: Add ARIA label/attribute (e.g., aria-label="Overdue") to announce status to screen readers

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Todos (Priority: P1)

When a user opens their todo list, any incomplete tasks with due dates in the past should be immediately visually distinguishable from other todos. This allows users to quickly identify which tasks require urgent attention without manually checking dates.

**Why this priority**: This is the core value proposition of the feature - enabling quick visual identification of overdue items. Without this, users must mentally compare each due date against today's date, which is time-consuming and error-prone.

**Independent Test**: Can be fully tested by creating todos with past due dates, viewing the list, and verifying that overdue items are visually distinct. Delivers immediate value by reducing time to identify overdue tasks.

**Acceptance Scenarios**:

1. **Given** a user has a todo with a due date of yesterday and status is incomplete, **When** the user views their todo list, **Then** that todo should be visually marked as overdue
2. **Given** a user has a todo with a due date of today, **When** the user views their todo list, **Then** that todo should NOT be marked as overdue
3. **Given** a user has a todo with a due date of yesterday but status is completed, **When** the user views their todo list, **Then** that todo should NOT be marked as overdue
4. **Given** a user has multiple todos with various due dates, **When** the user views their todo list, **Then** only incomplete todos with due dates before today should be marked as overdue

---

### User Story 2 - Consistent Overdue Indication Across Views (Priority: P2)

Users should see consistent overdue indicators regardless of how they view or filter their todos. Whether viewing all todos, filtered lists, or individual todo cards, the overdue status should be clearly communicated.

**Why this priority**: Consistency reduces cognitive load and prevents users from missing overdue items when using different views or filters. This ensures the feature remains useful across all user workflows.

**Independent Test**: Can be tested by viewing the same overdue todo through different interfaces or filters and verifying consistent visual treatment. Delivers value by ensuring reliability across the entire application.

**Acceptance Scenarios**:

1. **Given** a user has filtered their todo list by category, **When** viewing the filtered results, **Then** overdue todos in that category should still be visually marked as overdue
2. **Given** a user is viewing a single todo card detail, **When** that todo is overdue, **Then** the overdue status should be visible on the card

---

### User Story 3 - Real-time Overdue Status Updates (Priority: P3)

As time progresses and the calendar date changes, todos that become overdue should automatically update their status without requiring a page refresh. Similarly, when a user completes an overdue todo, the overdue indicator should immediately disappear.

**Why this priority**: This enhances user experience by ensuring the data is always current, but it's less critical than the fundamental identification feature. Users can still get value by refreshing the page if needed.

**Independent Test**: Can be tested by observing todos as they transition to overdue status (if testing across midnight) or by completing overdue todos and verifying immediate visual updates. Delivers value through improved data freshness.

**Acceptance Scenarios**:

1. **Given** a user has an overdue todo open in their list, **When** the user marks that todo as complete, **Then** the overdue indicator should immediately disappear without page refresh
2. **Given** a user is viewing their todo list, **When** they change a todo's due date to yesterday, **Then** the todo should immediately show as overdue without page refresh

---

### Edge Cases

- What happens when a todo has no due date? (Should never be marked as overdue)
- How does the system handle todos with due dates far in the past (e.g., 1 year ago)? (Should be treated the same as 1 day overdue)
- What happens when the user's system clock is incorrect? (Use client-side calendar date in user's local timezone for consistency with user's perception and environment)
- How should archived or deleted todos be handled? (Overdue status is not relevant for archived/deleted items)
- What about todos due at a specific time of day? (Compare only the calendar date portion, ignore time; due dates are stored as date-only values)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST identify a todo as overdue when its due date is before the current date AND the todo status is incomplete
- **FR-002**: System MUST NOT mark a todo as overdue if its due date is today or in the future
- **FR-003**: System MUST NOT mark a todo as overdue if the todo is marked as complete, regardless of due date
- **FR-004**: System MUST provide a clear visual indicator for overdue todos using red/warning color combined with an icon (e.g., exclamation or clock icon) to ensure accessibility through dual visual cues, AND MUST include appropriate ARIA attributes (e.g., aria-label="Overdue") to announce overdue status to screen readers
- **FR-005**: System MUST display overdue status consistently across all views where todos are displayed
- **FR-006**: System MUST treat todos without a due date as never being overdue
- **FR-007**: System MUST update the overdue status immediately when a todo's completion status changes
- **FR-008**: System MUST update the overdue status immediately when a todo's due date is modified
- **FR-009**: System MUST use date-only comparison (ignoring time of day) when determining if a todo is overdue
- **FR-010**: System MUST compute overdue status dynamically at query/display time rather than storing it as a persisted field
- **FR-011**: System MUST store due dates as calendar dates without timezone information (e.g., "2026-02-28") and compare against the current calendar date in the user's local timezone
- **FR-012**: System MUST maintain existing sort order for todos regardless of overdue status; overdue todos are not automatically reordered or prioritized

### Out of Scope

- Sorting todos by overdue status
- Filtering to show only overdue todos
- Separate "Overdue" section or grouping in the UI

### Non-Functional Requirements

- **NFR-001**: Overdue status computation MUST complete within 50ms for lists of up to 1000 todos to ensure responsive UI performance
- **NFR-002**: Overdue indicators MUST meet WCAG 2.1 Level AA accessibility standards, including sufficient color contrast (minimum 4.5:1) and semantic markup for assistive technologies

### Key Entities

- **Todo**: A task item that may have a due date (stored as a calendar date without timezone, e.g., "2026-02-28") and completion status. The overdue state is computed dynamically by comparing the due date (if present) against the current calendar date in the user's local timezone when the todo is incomplete. Overdue status is not stored in the database.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos within 3 seconds of viewing their todo list
- **SC-002**: Users correctly identify overdue status with 95% accuracy without needing to read due dates
- **SC-003**: Time spent searching for overdue tasks is reduced by at least 70% compared to manually checking dates
- **SC-004**: User testing shows that 90% of users find the visual distinction clear and helpful
