---
description: "Task list for overdue todo items feature"
---

# Tasks: Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: TDD is MANDATORY per project constitution. All tests must be written BEFORE implementation code.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `packages/backend/src/`, `packages/backend/__tests__/`
- **Frontend**: `packages/frontend/src/`, `packages/frontend/src/__tests__/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

No additional setup tasks required - project structure already exists per plan.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend logic that ALL user stories depend on - the isOverdue computation must be implemented before any UI can display overdue status

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T001 [P] Write tests for isOverdue helper function in packages/backend/src/services/__tests__/todoService.test.js
- [X] T002 Implement isOverdue helper function in packages/backend/src/services/todoService.js
- [X] T003 Verify isOverdue tests pass with npm test in packages/backend

**Checkpoint**: Foundation ready - isOverdue computation works and is tested. User story implementation can now begin.

---

## Phase 3: User Story 1 - Visual Identification of Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Display clear visual indicators (red color + icon) for incomplete todos with past due dates so users can quickly identify overdue items at a glance.

**Independent Test**: Create todos with various due dates (past, today, future) and completion states. Verify that only incomplete todos with past due dates display the red color and warning icon. Screen reader should announce "Overdue" status.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST using TDD approach - ensure they FAIL before implementation**

- [X] T004 [P] [US1] Write backend API tests for isOverdue field in GET /api/todos response in packages/backend/__tests__/app.test.js
- [X] T005 [P] [US1] Write backend API tests for isOverdue field in POST /api/todos response in packages/backend/__tests__/app.test.js
- [X] T006 [P] [US1] Write backend API tests for isOverdue field updates in PATCH /api/todos/:id/toggle in packages/backend/__tests__/app.test.js
- [X] T007 [P] [US1] Write frontend helper tests for isOverdue function in packages/frontend/src/services/__tests__/todoService.test.js
- [X] T008 [P] [US1] Write TodoCard component tests for overdue indicator display in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 1

- [X] T009 [US1] Update todoService to enrich todos with isOverdue in packages/backend/src/services/todoService.js
- [X] T010 [US1] Update Express API endpoints to include isOverdue in responses in packages/backend/src/app.js
- [X] T011 [US1] Verify backend API tests pass with npm test in packages/backend
- [X] T012 [P] [US1] Implement isOverdue helper function in packages/frontend/src/services/todoService.js
- [X] T013 [P] [US1] Add overdue color variables for light mode in packages/frontend/src/styles/theme.css
- [X] T014 [P] [US1] Add overdue color variables for dark mode in packages/frontend/src/styles/theme.css
- [X] T015 [US1] Update TodoCard component to display overdue indicator with icon and aria-label in packages/frontend/src/components/TodoCard.js
- [X] T016 [US1] Add overdue indicator styles to TodoCard component in packages/frontend/src/components/TodoCard.js or CSS
- [X] T017 [US1] Verify frontend component tests pass with npm test in packages/frontend
- [X] T018 [US1] Manual testing: Create todos with past due dates and verify visual indicators appear correctly in both light and dark modes

**Checkpoint**: User Story 1 complete and independently testable. Users can now visually identify overdue todos with red color and icon. MVP feature is functional.

---

## Phase 4: User Story 2 - Consistent Overdue Indication Across Views (Priority: P2)

**Goal**: Ensure overdue indicators display consistently in TodoList view and any other locations where todos are shown.

**Independent Test**: View todos through TodoList component and verify overdue indicators match those shown in individual TodoCard components. Test with filtered views if applicable.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST using TDD approach - ensure they FAIL before implementation**

- [X] T019 [P] [US2] Write TodoList component tests for overdue todo rendering in packages/frontend/src/components/__tests__/TodoList.test.js
- [X] T020 [P] [US2] Write integration tests verifying consistent overdue display across components in packages/frontend/src/__tests__/App.test.js

### Implementation for User Story 2

- [X] T021 [US2] Review and ensure TodoList component properly passes isOverdue to child components in packages/frontend/src/components/TodoList.js
- [X] T022 [US2] Verify consistency of overdue styling across all todo display components
- [X] T023 [US2] Verify TodoList tests pass with npm test in packages/frontend
- [X] T024 [US2] Manual testing: View filtered/sorted todo lists and verify overdue indicators remain visible and consistent

**Checkpoint**: User Story 2 complete and independently testable. Overdue indicators display consistently across all views without any discrepancies.

---

## Phase 5: User Story 3 - Real-time Overdue Status Updates (Priority: P3)

**Goal**: When a user marks an overdue todo as complete or changes its due date, the overdue indicator should immediately update without requiring a page refresh.

**Independent Test**: Create an overdue todo, toggle its completion status, and verify the overdue indicator disappears immediately. Change a non-overdue todo's due date to yesterday and verify the indicator appears immediately.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST using TDD approach - ensure they FAIL before implementation**

- [X] T025 [P] [US3] Write tests for immediate UI update when todo completion status changes in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T026 [P] [US3] Write tests for immediate UI update when todo due date changes in packages/frontend/src/components/__tests__/TodoForm.test.js
- [X] T027 [P] [US3] Write integration tests for real-time overdue status updates in packages/frontend/src/__tests__/App.test.js

### Implementation for User Story 3

- [X] T028 [US3] Ensure TodoCard recomputes isOverdue on prop changes in packages/frontend/src/components/TodoCard.js
- [X] T029 [US3] Ensure TodoForm triggers immediate re-render after due date changes in packages/frontend/src/components/TodoForm.js
- [X] T030 [US3] Verify real-time update tests pass with npm test in packages/frontend
- [X] T031 [US3] Manual testing: Toggle completion and modify due dates, verify immediate visual updates without page refresh

**Checkpoint**: All user stories complete and independently functional. Overdue feature is fully implemented with visual identification, consistency, and real-time updates.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation across all user stories

- [X] T032 [P] Verify all backend tests pass with full coverage in packages/backend
- [X] T033 [P] Verify all frontend tests pass with full coverage in packages/frontend
- [X] T034 Accessibility testing: Verify WCAG 2.1 Level AA compliance (4.5:1 color contrast minimum)
- [X] T035 Accessibility testing: Test with screen reader (verify aria-label announces "Overdue")
- [X] T036 Performance testing: Verify overdue computation <50ms for lists up to 1000 todos (NFR-001)
- [X] T037 Cross-browser testing: Verify in multiple desktop browsers
- [X] T038 Run complete quickstart.md validation scenarios
- [X] T039 [P] Code cleanup and refactoring across backend and frontend
- [X] T040 [P] Update documentation if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - already complete
- **Foundational (Phase 2)**: No dependencies on other phases - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2) completion
  - User stories can proceed in parallel if team capacity allows
  - Or sequentially in priority order: US1 (P1) → US2 (P2) → US3 (P3)
- **Polish (Phase 6)**: Depends on completion of desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational phase only - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (needs TodoCard with overdue indicator) - Builds on US1
- **User Story 3 (P3)**: Depends on User Story 1 (needs basic overdue display to update) - Builds on US1

### Within Each User Story

1. Tests for story MUST be written FIRST and FAIL
2. Backend implementation before frontend (API must return isOverdue)
3. Frontend services before components
4. Styles can be written in parallel with component logic
5. Manual testing after automated tests pass
6. Story checkpoint validation before proceeding to next story

### Parallel Opportunities

**Within Phase 2 (Foundational):**
- T001 (write tests) can be done in parallel with environment setup if needed

**Within User Story 1:**
- Tests T004, T005, T006, T007, T008 can all be written in parallel
- Frontend helpers T012, T013, T014 can be implemented in parallel (different files)

**Within User Story 2:**
- Tests T019, T020 can be written in parallel

**Within User Story 3:**
- Tests T025, T026, T027 can be written in parallel

**Across User Stories:**
- Once Foundational is complete, if team capacity allows:
  - Developer A can work on US1
  - Developer B can work on US2 tests while A implements US1
  - Developer C can work on US3 tests while A/B work
- However, note that US2 and US3 have dependencies on US1 completion

**Within Polish Phase:**
- T032, T033, T039, T040 can run in parallel

---

## Parallel Example: User Story 1 Testing Phase

All test files for US1 can be written simultaneously by different developers or AI agents:

```bash
# Launch all US1 tests together:
Task T004: "Write backend API tests for GET /api/todos"
Task T005: "Write backend API tests for POST /api/todos"
Task T006: "Write backend API tests for PATCH /api/todos/:id/toggle"
Task T007: "Write frontend helper tests for isOverdue"
Task T008: "Write TodoCard component tests for overdue indicator"
```

After tests are written and failing:

```bash
# Launch parallel frontend implementations:
Task T012: "Implement frontend isOverdue helper"
Task T013: "Add light mode overdue colors"
Task T014: "Add dark mode overdue colors"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - RECOMMENDED

**Fastest path to demonstrable value:**

1. Complete Phase 2: Foundational (T001-T003) → Backend logic ready
2. Complete Phase 3: User Story 1 (T004-T018) → Core feature functional
3. **STOP and VALIDATE**: Test independently, get user feedback
4. Deploy/demo if ready
5. **Decision point**: Proceed to US2/US3 based on feedback

**Benefits:**
- Delivers core value fastest (visual identification of overdue todos)
- Reduces risk by validating approach early
- Enables early user testing and feedback
- Can ship MVP after just 2 phases

### Incremental Delivery (All User Stories)

**Full feature rollout:**

1. Complete Foundational (Phase 2) → Backend ready
2. Complete User Story 1 (Phase 3) → Test independently → Deploy (MVP!)
3. Complete User Story 2 (Phase 4) → Test independently → Deploy (consistent views)
4. Complete User Story 3 (Phase 5) → Test independently → Deploy (real-time updates)
5. Complete Polish (Phase 6) → Final validation and cleanup

**Benefits:**
- Each story adds value independently
- Can deploy after each story completion
- Reduced integration risk
- Clear checkpoints for validation

### Parallel Team Strategy

**With multiple developers:**

1. Team completes Foundational together (Phase 2)
2. Once Foundational complete:
   - Developer A: User Story 1 (must complete first)
   - Developer B: Write tests for User Story 2 while A works
   - Developer C: Write tests for User Story 3 while A works
3. After US1 complete:
   - Developer B: Implement User Story 2
   - Developer C: Implement User Story 3 (can start in parallel)
4. Integrate and validate all stories together

---

## Success Metrics

**Task Completion:**
- Total tasks: 40
- Phase 2 (Foundational): 3 tasks - CRITICAL PATH
- Phase 3 (US1 - MVP): 15 tasks - HIGH VALUE
- Phase 4 (US2): 6 tasks - MEDIUM VALUE
- Phase 5 (US3): 7 tasks - MEDIUM VALUE
- Phase 6 (Polish): 9 tasks - FINAL VALIDATION

**Parallel Opportunities:**
- 13 tasks marked [P] can run in parallel within their phase
- 3 user stories can have test-writing parallelized
- Frontend styling tasks (T013, T014) are parallelizable

**Independent Test Criteria:**
- User Story 1: Create overdue todo, verify red color + icon displays
- User Story 2: View todo list, verify consistent overdue indicators
- User Story 3: Toggle completion, verify immediate indicator update

**Suggested MVP Scope:**
- **Minimum**: Phase 2 + Phase 3 (User Story 1) = 18 tasks
- **Delivers**: Full visual identification of overdue todos
- **Testing**: Independently verifiable with clear success criteria

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD is mandatory: Write tests first, ensure they fail, then implement
- Commit after each task or logical group
- Stop at checkpoints to validate story independently
- Manual testing complements automated tests
- WCAG 2.1 Level AA compliance required (color contrast, ARIA labels)
