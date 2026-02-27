# Data Model: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: 2026-02-27

## Overview

This document defines the data model changes and entities involved in the overdue todo items feature. The feature adds computed overdue status to existing todo entities without modifying the underlying storage schema.

## Entity: Todo (Enhanced)

The Todo entity represents a task item with an optional due date. This feature adds a computed `isOverdue` property that is calculated dynamically based on the todo's due date and completion status.

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | number | Yes | Auto-generated | Unique identifier for the todo |
| `title` | string | Yes | - | Task description (max 255 characters) |
| `dueDate` | string (ISO date) | No | null | Due date in YYYY-MM-DD format (date-only, no time/timezone) |
| `completed` | boolean | Yes | false | Whether the todo is marked as complete |
| `createdAt` | string (ISO timestamp) | Yes | Auto-generated | Timestamp when todo was created |
| **`isOverdue`** | **boolean** | **No** | **Computed** | **Computed field: true if dueDate < today AND completed = false** |

### Field Details

#### `isOverdue` (Computed Property) - NEW

**Type**: Boolean (computed, not stored)

**Computation Logic**:
```javascript
isOverdue = (dueDate !== null) && 
            (dueDate < currentDate) && 
            (completed === false)
```

**Rules**:
- **MUST** be `false` if `dueDate` is `null` (no due date set)
- **MUST** be `false` if `completed` is `true` (completed todos are never overdue)
- **MUST** be `false` if `dueDate` is today or in the future
- **MUST** be `true` if `dueDate` is before today AND `completed` is `false`
- **MUST** be computed fresh on each query/render (not cached or stored)

**Date Comparison**:
- Compare date portions only (ignore time of day)
- Use local calendar date for current date (e.g., "2026-02-27")
- Stored `dueDate` is in ISO format: "YYYY-MM-DD" (e.g., "2026-02-28")

#### `dueDate` (Modified Semantics)

**Existing Field** - semantics clarified for this feature:
- Stored as ISO date string: "YYYY-MM-DD" (e.g., "2026-02-28")
- No timezone information (calendar date only)
- Nullable (null means no due date)
- Compared against current local calendar date to determine overdue status

### Validation Rules

Existing validation rules remain unchanged:
- `title`: Required, non-empty string, max 255 characters
- `dueDate`: Optional, must be valid ISO date format if provided (YYYY-MM-DD)
- `completed`: Boolean, defaults to false

No new validation rules for `isOverdue` since it's computed.

### State Transitions

The overdue state changes based on date and completion status:

```
┌──────────────┐
│  No Due Date │ ──────────────────────> Never Overdue
└──────────────┘

┌──────────────┐
│ Due: Future  │ ──────────────────────> Not Overdue
│ Complete: No │
└──────────────┘
       │
       │ (date passes)
       ▼
┌──────────────┐
│ Due: Past    │ ──────────────────────> OVERDUE
│ Complete: No │
└──────────────┘
       │
       │ (user completes)
       ▼
┌──────────────┐
│ Due: Past    │ ──────────────────────> Not Overdue
│ Complete: Yes│                         (completed todos
└──────────────┘                          are never overdue)
```

### Examples

#### Example 1: Overdue Todo
```json
{
  "id": 1,
  "title": "Submit report",
  "dueDate": "2026-02-25",
  "completed": false,
  "createdAt": "2026-02-20T10:30:00Z",
  "isOverdue": true
}
```
**Reason**: dueDate (Feb 25) is before current date (Feb 27) and not completed

---

#### Example 2: Not Overdue (Due Today)
```json
{
  "id": 2,
  "title": "Attend meeting",
  "dueDate": "2026-02-27",
  "completed": false,
  "createdAt": "2026-02-26T14:00:00Z",
  "isOverdue": false
}
```
**Reason**: dueDate is today (not before today)

---

#### Example 3: Not Overdue (Completed)
```json
{
  "id": 3,
  "title": "Fix bug",
  "dueDate": "2026-02-20",
  "completed": true,
  "createdAt": "2026-02-15T09:00:00Z",
  "isOverdue": false
}
```
**Reason**: Todo is completed (completed todos are never overdue)

---

#### Example 4: Not Overdue (No Due Date)
```json
{
  "id": 4,
  "title": "Review documentation",
  "dueDate": null,
  "completed": false,
  "createdAt": "2026-02-27T11:00:00Z",
  "isOverdue": false
}
```
**Reason**: No due date set (todos without due dates are never overdue)

---

## Relationships

No new relationships are introduced by this feature. The Todo entity remains standalone with no foreign key relationships.

## Data Flow

### Backend (API Layer)

1. **Storage**: No schema changes - `isOverdue` is NOT stored in database
2. **Service Layer**: Compute `isOverdue` for each todo when retrieving from storage
3. **API Response**: Include `isOverdue` field in all todo objects returned to frontend

**Example Service Method**:
```javascript
function enrichTodoWithOverdueStatus(todo) {
  return {
    ...todo,
    isOverdue: isOverdue(todo)
  };
}

function getAllTodos() {
  const todos = db.getAllTodos(); // raw todos from storage
  return todos.map(enrichTodoWithOverdueStatus);
}
```

### Frontend (UI Layer)

1. **API Response**: Receive todos with `isOverdue` field from backend
2. **Local Computation**: Also compute `isOverdue` locally for immediate UI updates (when user changes completion status or due date)
3. **Rendering**: Use `isOverdue` to conditionally render visual indicator (color + icon)

**Example Component Logic**:
```javascript
function TodoCard({ todo }) {
  // Use isOverdue from API response for initial render
  // Recompute locally if todo changes before API sync
  const isOverdue = computeIsOverdue(todo);
  
  return (
    <div className={`todo-card ${isOverdue ? 'overdue' : ''}`}>
      {isOverdue && (
        <span className="overdue-indicator" aria-label="Overdue">
          <WarningIcon />
        </span>
      )}
      {/* ...rest of todo card */}
    </div>
  );
}
```

## Performance Considerations

### Computation Cost

- **Per-todo overhead**: ~1 microsecond (simple date comparison)
- **1000 todos**: ~1ms total computation time
- **Well within NFR-001 requirement**: <50ms for 1000 todos

### Optimization Notes

- Compute once per request/render cycle (cache current date)
- No indexing needed (not filtering/sorting by overdue status)
- No storage overhead (not persisted)

## Migration Impact

**No database migration required** - this is a purely computed field with no schema changes.

**Backend Changes**:
- Add `isOverdue()` helper function to `todoService.js`
- Modify `getAllTodos()` and `getTodoById()` to include computed field
- Update API response format (additive change, backward compatible)

**Frontend Changes**:
- Add overdue styling to theme.css (light and dark mode)
- Update TodoCard component to display overdue indicator
- Add local `isOverdue()` helper function for immediate UI updates

## Testing Considerations

### Data Scenarios to Test

1. **Overdue**: `dueDate` = yesterday, `completed` = false
2. **Not Overdue (Today)**: `dueDate` = today, `completed` = false
3. **Not Overdue (Future)**: `dueDate` = tomorrow, `completed` = false
4. **Not Overdue (Completed)**: `dueDate` = yesterday, `completed` = true
5. **Not Overdue (No Date)**: `dueDate` = null, `completed` = false
6. **Edge Case (Far Past)**: `dueDate` = 1 year ago, `completed` = false

### Mock Current Date in Tests

Use Jest's timer mocks to control "current date":
```javascript
// In test setup
jest.useFakeTimers();
jest.setSystemTime(new Date('2026-02-27'));

// In test
expect(isOverdue({ dueDate: '2026-02-25', completed: false })).toBe(true);

// In test teardown
jest.useRealTimers();
```

## Summary

The overdue feature adds a computed `isOverdue` boolean property to the existing Todo entity. This property is:
- **Not stored** in the database (computed on-the-fly)
- **Always current** (based on current date vs due date)
- **Simple to compute** (single date comparison)
- **Performant** (<50ms for 1000 todos)

The implementation maintains backward compatibility (additive API change) and requires no database migration.

**Next Steps**: Define API contracts and quickstart guide for implementation.
