import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });

  // Overdue indicator consistency tests (Feature: Overdue Todo Items - User Story 2)
  describe('Overdue Indicator Consistency', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27')); // Mock current date
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should render overdue indicators for overdue todos in the list', () => {
      const todosWithOverdue = [
        {
          id: 1,
          title: 'Overdue Task 1',
          dueDate: '2026-02-20',
          completed: 0,
          createdAt: '2026-02-15T00:00:00Z'
        },
        {
          id: 2,
          title: 'Overdue Task 2',
          dueDate: '2026-02-25',
          completed: 0,
          createdAt: '2026-02-20T00:00:00Z'
        },
        {
          id: 3,
          title: 'Not Overdue Task',
          dueDate: '2026-03-01',
          completed: 0,
          createdAt: '2026-02-26T00:00:00Z'
        }
      ];

      render(<TodoList todos={todosWithOverdue} {...mockHandlers} isLoading={false} />);
      
      // Should have exactly 2 overdue indicators (by role="status")
      const overdueIndicators = screen.getAllByRole('status');
      expect(overdueIndicators).toHaveLength(2);
    });

    it('should NOT render overdue indicators for non-overdue todos', () => {
      const nonOverdueTodos = [
        {
          id: 1,
          title: 'Future Task',
          dueDate: '2026-03-01',
          completed: 0,
          createdAt: '2026-02-26T00:00:00Z'
        },
        {
          id: 2,
          title: 'No Due Date',
          dueDate: null,
          completed: 0,
          createdAt: '2026-02-26T00:00:00Z'
        }
      ];

      render(<TodoList todos={nonOverdueTodos} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText(/Overdue/i)).not.toBeInTheDocument();
    });

    it('should apply overdue class to overdue todo cards in the list', () => {
      const todosWithOverdue = [
        {
          id: 1,
          title: 'Overdue Task',
          dueDate: '2026-02-20',
          completed: 0,
          createdAt: '2026-02-15T00:00:00Z'
        }
      ];

      const { container } = render(
        <TodoList todos={todosWithOverdue} {...mockHandlers} isLoading={false} />
      );
      
      const overdueCard = container.querySelector('.todo-card.overdue');
      expect(overdueCard).toBeInTheDocument();
    });
  });
});
