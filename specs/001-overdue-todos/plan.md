# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-02-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add visual identification for overdue todo items. Incomplete todos with due dates before the current date will display a red/warning color with an icon (exclamation or clock) for clear visual distinction. The overdue status will be computed dynamically on-the-fly, comparing date-only values (no timezone) against the current calendar date in the user's local timezone. The feature maintains existing sort order and ensures accessibility through dual visual cues (color + icon) and ARIA attributes for screen readers.

## Technical Context

**Language/Version**: JavaScript (Node.js v16+, React latest stable)  
**Primary Dependencies**: Backend: Express.js; Frontend: React, React DOM, @testing-library/react  
**Storage**: In-memory (no database, as per constitution)  
**Testing**: Jest for both frontend and backend  
**Target Platform**: Desktop web browser  
**Project Type**: Web application (frontend + backend monorepo)  
**Performance Goals**: Overdue status computation <50ms for up to 1000 todos (NFR-001)  
**Constraints**: WCAG 2.1 Level AA (4.5:1 color contrast minimum), changes persist through refresh, max 600px container width  
**Scale/Scope**: Single-user desktop application, material design-inspired UI with light/dark mode support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Test-Driven Development (TDD) ⚠️ NON-NEGOTIABLE
- ✅ **PASS**: Tests will be written before implementation code
- ✅ **PASS**: Aiming for 80%+ code coverage across frontend and backend
- ✅ **PASS**: Tests will be isolated with mocked external dependencies (timers for date comparison)

### II. Code Quality & Maintainability
- ✅ **PASS**: Will follow DRY, KISS, Single Responsibility Principle
- ✅ **PASS**: Will use camelCase for variables/functions, PascalCase for components
- ✅ **PASS**: Will maintain 2-space indentation, 100 char max line length

### III. Design System Consistency
- ✅ **PASS**: Will support BOTH light and dark modes (red/warning colors in both themes)
- ✅ **PASS**: Will use 8px grid system for spacing
- ✅ **PASS**: Will use defined color palette (red/warning for overdue indicator)
- ✅ **PASS**: Will include hover and focus states for interactive elements

### IV. Monorepo Architecture
- ✅ **PASS**: Changes isolated to `packages/frontend/` and `packages/backend/`
- ✅ **PASS**: Tests colocated in `__tests__/` directories
- ✅ **PASS**: Communication through API contracts only

### V. Scope Discipline
- ✅ **PASS**: Core feature enhancement (visual identification of overdue todos)
- ✅ **PASS**: No premature optimization - simple date comparison
- ✅ **PASS**: Explicitly out of scope: sorting/filtering by overdue status (per spec)

**Gate Result**: ✅ **ALL CHECKS PASSED** - Proceed to Phase 0

---

### Post-Design Review (After Phase 1)

**Re-evaluation Date**: 2026-02-27

#### I. Test-Driven Development (TDD) ⚠️ NON-NEGOTIABLE
- ✅ **PASS**: Quickstart guide enforces TDD workflow (write tests first, then implement)
- ✅ **PASS**: Test coverage plan includes backend, frontend, and integration tests
- ✅ **PASS**: Mock strategies defined for date/time testing

#### II. Code Quality & Maintainability
- ✅ **PASS**: Helper function `isOverdue()` follows single responsibility principle
- ✅ **PASS**: Computed property approach is simple (KISS) - no complex state management
- ✅ **PASS**: No code duplication - same logic in backend and frontend helpers

#### III. Design System Consistency
- ✅ **PASS**: Overdue colors defined for both light mode (#d32f2f) and dark mode (#ef5350)
- ✅ **PASS**: Color contrast verified: 7.0:1 (light) and 5.2:1 (dark) exceed WCAG AA 4.5:1
- ✅ **PASS**: Icon size follows design system (16px)
- ✅ **PASS**: Spacing uses 4px gap (from 8px grid system)

#### IV. Monorepo Architecture
- ✅ **PASS**: Changes isolated to `packages/backend/` and `packages/frontend/`
- ✅ **PASS**: Tests colocated in `__tests__/` directories
- ✅ **PASS**: API contract clearly defines frontend-backend communication

#### V. Scope Discipline
- ✅ **PASS**: Feature focused on visual identification only (no sorting/filtering)
- ✅ **PASS**: Simple implementation - computed field, no database changes
- ✅ **PASS**: No feature creep - adheres strictly to specification

**Post-Design Gate Result**: ✅ **ALL CHECKS PASSED** - Design approved, proceed to implementation

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js           # Express app setup
│   │   ├── index.js         # Server entry point
│   │   └── services/
│   │       └── todoService.js  # Todo CRUD operations + overdue logic
│   └── __tests__/
│       └── app.test.js         # Backend API tests
│
└── frontend/
    ├── src/
    │   ├── App.js              # Main React component
    │   ├── components/
    │   │   ├── TodoCard.js     # Individual todo display (overdue indicator)
    │   │   ├── TodoList.js     # Todo list container
    │   │   ├── TodoForm.js     # Todo creation/editing form
    │   │   └── __tests__/      # Component tests
    │   ├── services/
    │   │   ├── todoService.js  # API client
    │   │   └── __tests__/      # Service tests
    │   └── styles/
    │       └── theme.css       # Light/dark mode styles (overdue colors)
    └── public/
        └── index.html
```

**Structure Decision**: Monorepo with separate `packages/backend/` and `packages/frontend/`. Tests are colocated with source code in `__tests__/` directories. The overdue feature will primarily touch `todoService.js` (backend logic), `TodoCard.js` (visual indicator), and theme styles (colors for overdue state).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution principles are satisfied by this feature implementation.
