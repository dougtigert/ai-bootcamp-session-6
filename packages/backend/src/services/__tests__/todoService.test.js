/**
 * Tests for Todo Service
 */

const { isOverdue } = require('../todoService');

describe('isOverdue helper function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27')); // Mock current date
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns true for incomplete todo with past due date', () => {
    const todo = { dueDate: '2026-02-25', completed: false };
    expect(isOverdue(todo)).toBe(true);
  });

  test('returns false for todo due today', () => {
    const todo = { dueDate: '2026-02-27', completed: false };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for todo due in future', () => {
    const todo = { dueDate: '2026-02-28', completed: false };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for completed todo with past due date', () => {
    const todo = { dueDate: '2026-02-25', completed: true };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for todo with no due date', () => {
    const todo = { dueDate: null, completed: false };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns true for todo far in the past', () => {
    const todo = { dueDate: '2025-01-01', completed: false };
    expect(isOverdue(todo)).toBe(true);
  });

  test('handles completed field as number (0 = false, 1 = true)', () => {
    const incompleteTodo = { dueDate: '2026-02-25', completed: 0 };
    const completedTodo = { dueDate: '2026-02-25', completed: 1 };
    
    expect(isOverdue(incompleteTodo)).toBe(true);
    expect(isOverdue(completedTodo)).toBe(false);
  });
});
