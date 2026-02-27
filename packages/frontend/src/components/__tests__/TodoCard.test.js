import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  // Overdue indicator tests (Feature: Overdue Todo Items)
  describe('Overdue Indicator', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27')); // Mock current date
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should display overdue indicator for incomplete todo with past due date', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-02-25', completed: 0 };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const overdueIndicator = screen.getByLabelText(/Overdue/i);
      expect(overdueIndicator).toBeInTheDocument();
    });

    it('should NOT display overdue indicator for todo due today', () => {
      const todayTodo = { ...mockTodo, dueDate: '2026-02-27', completed: 0 };
      render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText(/Overdue/i)).not.toBeInTheDocument();
    });

    it('should NOT display overdue indicator for todo due in future', () => {
      const futureTodo = { ...mockTodo, dueDate: '2026-03-01', completed: 0 };
      render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText(/Overdue/i)).not.toBeInTheDocument();
    });

    it('should NOT display overdue indicator for completed todo with past due date', () => {
      const completedOverdueTodo = { ...mockTodo, dueDate: '2026-02-25', completed: 1 };
      render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText(/Overdue/i)).not.toBeInTheDocument();
    });

    it('should NOT display overdue indicator when no due date is set', () => {
      const noDueDateTodo = { ...mockTodo, dueDate: null, completed: 0 };
      render(<TodoCard todo={noDueDateTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText(/Overdue/i)).not.toBeInTheDocument();
    });

    it('should apply overdue class to todo card when overdue', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-02-25', completed: 0 };
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
    });

    it('should have accessible aria-label for screen readers', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-02-25', completed: 0 };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const overdueIndicator = screen.getByLabelText(/Overdue/i);
      expect(overdueIndicator).toHaveAttribute('aria-label', expect.stringMatching(/overdue/i));
    });
  });

  // Real-time update tests (Feature: Overdue Todo Items - User Story 3)
  describe('Real-time Overdue Status Updates', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27')); // Mock current date
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update overdue indicator when todo completion status changes', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-02-25', completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      // Initially overdue
      expect(screen.getByRole('status')).toBeInTheDocument();
      
      // Complete the todo
      const completedTodo = { ...overdueTodo, completed: 1 };
      rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
      
      // Overdue indicator should disappear immediately
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('should add overdue indicator when uncompleting an overdue todo', () => {
      const completedOverdueTodo = { ...mockTodo, dueDate: '2026-02-25', completed: 1 };
      const { rerender } = render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      // Initially no overdue indicator (completed)
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      
      // Uncomplete the todo
      const uncompletedTodo = { ...completedOverdueTodo, completed: 0 };
      rerender(<TodoCard todo={uncompletedTodo} {...mockHandlers} isLoading={false} />);
      
      // Overdue indicator should appear immediately
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should update overdue indicator when due date changes from future to past', () => {
      const futureTodo = { ...mockTodo, dueDate: '2026-03-01', completed: 0 };
      const { rerender } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      
      // Initially not overdue
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      
      // Change due date to past
      const pastTodo = { ...futureTodo, dueDate: '2026-02-20' };
      rerender(<TodoCard todo={pastTodo} {...mockHandlers} isLoading={false} />);
      
      // Overdue indicator should appear immediately
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should remove overdue indicator when due date changes from past to future', () => {
      const pastTodo = { ...mockTodo, dueDate: '2026-02-20', completed: 0 };
      const { rerender } = render(<TodoCard todo={pastTodo} {...mockHandlers} isLoading={false} />);
      
      // Initially overdue
      expect(screen.getByRole('status')).toBeInTheDocument();
      
      // Change due date to future
      const futureTodo = { ...pastTodo, dueDate: '2026-03-01' };
      rerender(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      
      // Overdue indicator should disappear immediately
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});
