<!--
Sync Impact Report:
- Version: 0.0.0 → 1.0.0 (MINOR: Initial constitution establishment)
- Added Principles:
  1. Test-Driven Development (TDD)
  2. Code Quality & Maintainability
  3. Design System Consistency
  4. Monorepo Architecture
  5. Scope Discipline
- Added Sections: Technical Constraints, Development Workflow
- Templates Status:
  ✅ .specify/templates/plan-template.md - Constitution Check section aligns
  ✅ .specify/templates/spec-template.md - User scenarios and requirements align
  ✅ .specify/templates/tasks-template.md - Test-first approach and organization align
- No deferred placeholders
-->

# AI Bootcamp Session 6 Todo App Constitution

## Core Principles

### I. Test-Driven Development (TDD) ⚠️ NON-NEGOTIABLE

**Rules:**
- Tests MUST be written before implementation code
- All tests MUST fail initially, then pass after implementation (Red-Green-Refactor)
- MINIMUM 80% code coverage across all packages (frontend and backend)
- Tests MUST be isolated, independent, and not rely on other tests
- Mock all external dependencies (API calls, timers, etc.)

**Rationale:** TDD ensures code quality, maintainability, and reliability. Writing tests first
forces clear thinking about requirements and interfaces before implementation. The 80% coverage
target ensures comprehensive testing without becoming a burden.

### II. Code Quality & Maintainability

**Rules:**
- DRY (Don't Repeat Yourself): Extract common code into shared functions/utilities
- KISS (Keep It Simple, Stupid): Prefer simple, straightforward implementations
- Single Responsibility Principle: Each module/component/function has one reason to change
- Descriptive naming: Use camelCase for variables/functions, PascalCase for components/classes,
  UPPER_SNAKE_CASE for constants
- 2-space indentation, max 100 characters per line, LF line endings
- Import order: External libraries → Internal modules → Styles

**Rationale:** Consistent code style and quality principles reduce cognitive load, improve
collaboration, and make the codebase easier to maintain. DRY, KISS, and SOLID principles are
industry standards that prevent technical debt.

### III. Design System Consistency

**Rules:**
- Follow Material Design-inspired UI patterns
- Support BOTH light and dark modes (no single-mode implementations)
- Use 8px grid system for ALL spacing (xs=8px, sm=16px, md=24px, lg=32px, xl=48px)
- Use defined color palette for light and dark modes (orange primary, purple secondary)
- System fonts only: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
- Typography: 28px heading, 18px subheading, 16px body, 12px caption, 14px button
- 8px border radius for cards, 4px for buttons/inputs
- All interactive elements MUST have hover and focus states

**Rationale:** A consistent design system ensures professional appearance, improves user
experience, and reduces design decisions during implementation. Dark mode support is mandatory
for accessibility and user preference.

### IV. Monorepo Architecture

**Rules:**
- Clear separation: Frontend (React) in `packages/frontend/`, Backend (Express.js) in
  `packages/backend/`
- Use npm workspaces for dependency management
- Tests colocated with source in `__tests__/` directories
- Test files named `{filename}.test.js`
- Frontend-backend communication ONLY through defined API contracts
- No shared code between frontend and backend (maintain separation of concerns)

**Rationale:** Monorepo structure with clear boundaries enables independent development and
testing while maintaining the benefits of a unified repository. Colocated tests improve
discoverability and maintainability.

### V. Scope Discipline

**Rules:**
- Focus on core features ONLY (CRUD operations for todos)
- NO premature optimization or complexity
- Out of scope: user auth, multi-user, categories/tags, filtering, search, bulk operations,
  undo/redo, reminders, mobile optimization
- New features require explicit specification update
- YAGNI principle: You Aren't Gonna Need It - implement only what's specified

**Rationale:** Scope discipline prevents feature creep and maintains project focus. Starting
simple and adding complexity only when needed leads to cleaner code and faster delivery. This
is a learning project focused on spec-driven development workflows.

## Technical Constraints

**Language/Framework:**
- Frontend: React (latest stable), no TypeScript required
- Backend: Node.js (v16+), Express.js
- Testing: Jest for both frontend and backend

**Dependencies:**
- Frontend: React, React DOM, @testing-library/react
- Backend: Express.js, no database (in-memory storage acceptable)
- No external UI libraries (build components from scratch)

**Performance:**
- Desktop-focused, no mobile optimization required
- Single-user application (no concurrent user handling)
- No specific performance targets (reasonable response times)

**Constraints:**
- All changes MUST persist through page refresh
- Max 600px container width on large screens
- 255 character limit for todo titles

## Development Workflow

**Implementation Sequence:**
1. Read specification and ensure understanding
2. Write tests that describe expected behavior (tests MUST fail)
3. Implement minimum code to make tests pass
4. Refactor while keeping tests green
5. Run full test suite and achieve 80%+ coverage
6. Verify UI matches design system guidelines
7. Commit with descriptive message

**Quality Gates:**
- All tests passing
- 80%+ code coverage
- No linting errors
- Dark/light mode both functional
- Changes persist through refresh

**Code Review Focus:**
- TDD process followed (tests written first)
- Design system consistency (colors, spacing, typography)
- Proper separation of concerns (frontend/backend)
- Test coverage and quality
- No out-of-scope features

## Governance

**Authority:** This constitution supersedes all other practices and guidelines. When conflicts
arise between this constitution and other documentation, the constitution takes precedence.

**Compliance:** All code changes, pull requests, and reviews MUST verify compliance with these
principles. Non-compliance requires justification and explicit approval.

**Amendments:** Changes to this constitution require:
1. Clear rationale for the change
2. Impact assessment on existing code and templates
3. Update to version number following semantic versioning
4. Update to dependent templates and documentation

**Version Control:**
- MAJOR version: Backward incompatible changes, principle removals
- MINOR version: New principles added, material expansions
- PATCH version: Clarifications, wording fixes, non-semantic changes

**Reference Documentation:** For detailed implementation guidance, see:
- `docs/coding-guidelines.md` - Code style and quality details
- `docs/testing-guidelines.md` - Testing strategy and examples
- `docs/ui-guidelines.md` - Complete design system specification
- `docs/functional-requirements.md` - Feature scope and requirements
- `docs/project-overview.md` - Architecture and technology stack

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-02-27
