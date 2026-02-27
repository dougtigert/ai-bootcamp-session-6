# API Contracts: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: 2026-02-27

## Overview

This document defines the API contract changes for the overdue todo items feature. All existing endpoints will include the computed `isOverdue` field in todo responses. No new endpoints are required.

## Base URL

```
http://localhost:3001/api
```

## Changes Summary

### Modified Responses

All endpoints that return todo objects will now include an additional computed field:
- **`isOverdue`** (boolean): Indicates whether the todo is overdue

This is an **additive change** and maintains backward compatibility. Clients that don't use the `isOverdue` field can safely ignore it.

---

## Endpoints

### 1. Get All Todos

**Endpoint**: `GET /api/todos`

**Description**: Retrieves all todos ordered by creation date (newest first). Each todo includes computed `isOverdue` field.

#### Request

**Method**: `GET`  
**URL**: `/api/todos`  
**Headers**: None required  
**Query Parameters**: None  
**Body**: None

#### Response

**Status Code**: `200 OK`

**Body**: Array of todo objects

```json
[
  {
    "id": 1,
    "title": "Submit report",
    "dueDate": "2026-02-25",
    "completed": false,
    "createdAt": "2026-02-20T10:30:00.000Z",
    "isOverdue": true
  },
  {
    "id": 2,
    "title": "Attend meeting",
    "dueDate": "2026-02-28",
    "completed": false,
    "createdAt": "2026-02-26T14:00:00.000Z",
    "isOverdue": false
  },
  {
    "id": 3,
    "title": "Review documentation",
    "dueDate": null,
    "completed": false,
    "createdAt": "2026-02-27T11:00:00.000Z",
    "isOverdue": false
  }
]
```

#### Error Responses

**Status Code**: `500 Internal Server Error`

```json
{
  "error": "Failed to fetch todos"
}
```

---

### 2. Get Todo by ID

**Endpoint**: `GET /api/todos/:id`

**Description**: Retrieves a single todo by ID. Response includes computed `isOverdue` field.

#### Request

**Method**: `GET`  
**URL**: `/api/todos/:id`  
**Headers**: None required  
**Path Parameters**:
- `id` (number): Todo ID

**Body**: None

#### Response

**Status Code**: `200 OK`

**Body**: Single todo object

```json
{
  "id": 1,
  "title": "Submit report",
  "dueDate": "2026-02-25",
  "completed": false,
  "createdAt": "2026-02-20T10:30:00.000Z",
  "isOverdue": true
}
```

#### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "error": "Valid todo ID is required"
}
```

**Status Code**: `404 Not Found`
```json
{
  "error": "Todo not found"
}
```

**Status Code**: `500 Internal Server Error`
```json
{
  "error": "Failed to fetch todo"
}
```

---

### 3. Create Todo

**Endpoint**: `POST /api/todos`

**Description**: Creates a new todo. Response includes computed `isOverdue` field.

#### Request

**Method**: `POST`  
**URL**: `/api/todos`  
**Headers**:
- `Content-Type: application/json`

**Body**:
```json
{
  "title": "Submit report",
  "dueDate": "2026-02-25"
}
```

**Body Fields**:
- `title` (string, required): Todo title (max 255 characters)
- `dueDate` (string, optional): Due date in ISO format YYYY-MM-DD

#### Response

**Status Code**: `201 Created`

**Body**: Created todo object

```json
{
  "id": 4,
  "title": "Submit report",
  "dueDate": "2026-02-25",
  "completed": false,
  "createdAt": "2026-02-27T15:30:00.000Z",
  "isOverdue": true
}
```

#### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "error": "Todo title is required"
}
```
or
```json
{
  "error": "Todo title must not exceed 255 characters"
}
```

**Status Code**: `500 Internal Server Error`
```json
{
  "error": "Failed to create todo"
}
```

---

### 4. Update Todo

**Endpoint**: `PUT /api/todos/:id`

**Description**: Updates a todo's title and/or due date. Response includes computed `isOverdue` field.

#### Request

**Method**: `PUT`  
**URL**: `/api/todos/:id`  
**Headers**:
- `Content-Type: application/json`

**Path Parameters**:
- `id` (number): Todo ID

**Body**:
```json
{
  "title": "Submit updated report",
  "dueDate": "2026-03-01"
}
```

**Body Fields** (both optional, at least one required):
- `title` (string, optional): New todo title (max 255 characters)
- `dueDate` (string, optional): New due date in ISO format YYYY-MM-DD (or null to clear)

#### Response

**Status Code**: `200 OK`

**Body**: Updated todo object

```json
{
  "id": 1,
  "title": "Submit updated report",
  "dueDate": "2026-03-01",
  "completed": false,
  "createdAt": "2026-02-20T10:30:00.000Z",
  "isOverdue": false
}
```

**Note**: The `isOverdue` field will be recomputed based on the new due date.

#### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "error": "Valid todo ID is required"
}
```
or
```json
{
  "error": "Todo title must be a non-empty string"
}
```
or
```json
{
  "error": "Todo title must not exceed 255 characters"
}
```

**Status Code**: `404 Not Found`
```json
{
  "error": "Todo not found"
}
```

**Status Code**: `500 Internal Server Error`
```json
{
  "error": "Failed to update todo"
}
```

---

### 5. Toggle Todo Completion

**Endpoint**: `PATCH /api/todos/:id/toggle`

**Description**: Toggles a todo's completion status (completed ↔ incomplete). Response includes computed `isOverdue` field.

#### Request

**Method**: `PATCH`  
**URL**: `/api/todos/:id/toggle`  
**Headers**: None required  
**Path Parameters**:
- `id` (number): Todo ID

**Body**: None

#### Response

**Status Code**: `200 OK`

**Body**: Updated todo object

```json
{
  "id": 1,
  "title": "Submit report",
  "dueDate": "2026-02-25",
  "completed": true,
  "createdAt": "2026-02-20T10:30:00.000Z",
  "isOverdue": false
}
```

**Note**: When a todo is marked as completed, `isOverdue` will always be `false` (completed todos are never overdue).

#### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "error": "Valid todo ID is required"
}
```

**Status Code**: `404 Not Found`
```json
{
  "error": "Todo not found"
}
```

**Status Code**: `500 Internal Server Error`
```json
{
  "error": "Failed to toggle todo status"
}
```

---

### 6. Delete Todo

**Endpoint**: `DELETE /api/todos/:id`

**Description**: Deletes a todo by ID. No change to existing behavior.

#### Request

**Method**: `DELETE`  
**URL**: `/api/todos/:id`  
**Headers**: None required  
**Path Parameters**:
- `id` (number): Todo ID

**Body**: None

#### Response

**Status Code**: `200 OK`

**Body**: Confirmation message

```json
{
  "message": "Todo deleted successfully",
  "id": 1
}
```

#### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "error": "Valid todo ID is required"
}
```

**Status Code**: `404 Not Found`
```json
{
  "error": "Todo not found"
}
```

**Status Code**: `500 Internal Server Error`
```json
{
  "error": "Failed to delete todo"
}
```

---

## Data Types

### Todo Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier |
| `title` | string | Todo title (max 255 chars) |
| `dueDate` | string \| null | ISO date string (YYYY-MM-DD) or null |
| `completed` | boolean | True if completed, false otherwise |
| `createdAt` | string | ISO timestamp of creation |
| **`isOverdue`** | **boolean** | **Computed: true if dueDate < today AND completed = false** |

### `isOverdue` Field Specification

**Type**: Boolean (computed, not stored or accepted as input)

**Computation**:
```javascript
isOverdue = (dueDate !== null) && 
            (dueDate < currentDate) && 
            (completed === false)
```

**Behavior**:
- Returns `false` if `dueDate` is `null`
- Returns `false` if `completed` is `true`
- Returns `false` if `dueDate` is today or in the future
- Returns `true` if `dueDate` is before today AND `completed` is `false`

**Not Writable**: The `isOverdue` field is read-only and cannot be set via API requests. It is always computed based on current date, due date, and completion status.

---

## Implementation Changes

### Backend Changes Required

1. **Add Helper Function** (`src/services/todoService.js` or inline in `app.js`):
   ```javascript
   function isOverdue(todo) {
     if (!todo.dueDate || todo.completed) return false;
     
     const today = new Date().toISOString().split('T')[0];
     return todo.dueDate < today;
   }
   ```

2. **Enrich Response Objects**:
   - Modify all endpoints that return todo objects to include `isOverdue`
   - Apply to: GET /api/todos, GET /api/todos/:id, POST /api/todos, PUT /api/todos/:id, PATCH /api/todos/:id/toggle

3. **Example Pattern**:
   ```javascript
   function enrichTodo(todo) {
     return {
       ...todo,
       isOverdue: isOverdue(todo)
     };
   }
   
   app.get('/api/todos', (req, res) => {
     const todos = db.prepare('SELECT * FROM todos ORDER BY createdAt DESC').all();
     res.json(todos.map(enrichTodo));
   });
   ```

### Frontend Changes Required

1. **Update API Client** (optional - field is automatically included):
   - No changes required to request logic
   - TypeScript types should be updated if used (add `isOverdue: boolean`)

2. **Use `isOverdue` in Components**:
   ```javascript
   function TodoCard({ todo }) {
     return (
       <div className={`todo-card ${todo.isOverdue ? 'overdue' : ''}`}>
         {todo.isOverdue && (
           <span className="overdue-indicator" aria-label="Overdue">
             <WarningIcon />
           </span>
         )}
         {/* ...rest of card */}
       </div>
     );
   }
   ```

---

## Testing Contract Compliance

### Test Cases

1. **GET /api/todos - Returns todos with isOverdue field**
   - Verify response includes `isOverdue` for each todo
   - Verify `isOverdue = true` for past due date + incomplete
   - Verify `isOverdue = false` for today/future date or completed

2. **POST /api/todos - Created todo includes isOverdue**
   - Create todo with past due date → verify `isOverdue = true`
   - Create todo with future due date → verify `isOverdue = false`

3. **PUT /api/todos/:id - Updated todo reflects new isOverdue status**
   - Change due date from future to past → verify `isOverdue` changes to `true`
   - Change due date from past to future → verify `isOverdue` changes to `false`

4. **PATCH /api/todos/:id/toggle - Completion affects isOverdue**
   - Complete overdue todo → verify `isOverdue` changes to `false`
   - Uncomplete past-due todo → verify `isOverdue` changes to `true`

### Mock Current Date in Tests

Use Jest's timer mocks to control "current date":
```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-27'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

---

## Backward Compatibility

**Additive Change**: The `isOverdue` field is added to existing responses without removing or modifying any existing fields.

**Clients Not Using Feature**: Clients that don't consume the `isOverdue` field can safely ignore it. All existing functionality remains unchanged.

**No Breaking Changes**: Existing API clients will continue to work without modification.

---

## Summary

All todo endpoints (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) now include a computed `isOverdue` boolean field in responses. This field:
- Is computed dynamically based on current date vs due date
- Is never stored or accepted as input
- Is always included in todo response objects
- Maintains backward compatibility (additive change)

**Next Steps**: Create quickstart guide for developers implementing this feature.
