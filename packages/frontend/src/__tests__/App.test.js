import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: dark)' ? false : true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock server to intercept API requests
const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: 'Learn React', dueDate: '2025-12-15', completed: 0, createdAt: '2025-11-01T00:00:00Z' },
        { id: 2, title: 'Build TODO app', dueDate: null, completed: 0, createdAt: '2025-11-02T00:00:00Z' }
      ])
    );
  }),

  rest.post('/api/todos', (req, res, ctx) => {
    const { title, dueDate } = req.body;
    
    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Todo title is required' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        dueDate: dueDate || null,
        completed: 0,
        createdAt: new Date().toISOString()
      })
    );
  }),

  rest.put('/api/todos/:id', (req, res, ctx) => {
    const { title, dueDate } = req.body;
    
    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Todo title is required' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(req.params.id),
        title,
        dueDate: dueDate || null,
        completed: 0,
        createdAt: '2025-11-01T00:00:00Z'
      })
    );
  }),

  rest.patch('/api/todos/:id/toggle', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(req.params.id),
        title: 'Test Todo',
        dueDate: null,
        completed: 1,
        createdAt: '2025-11-01T00:00:00Z'
      })
    );
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Todo deleted successfully', id: parseInt(req.params.id) })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorageMock.clear();
});
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the app header with title', async () => {
    render(<App />);
    expect(screen.getByText('My Todos')).toBeInTheDocument();
    expect(screen.getByText('🎃')).toBeInTheDocument();
  });

  test('loads and displays todos', async () => {
    render(<App />);

    expect(screen.getByText('Loading your todos...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Build TODO app')).toBeInTheDocument();
    });
  });

  test('creates a new todo', async () => {
    render(<App />);

    // Wait for the initial loading to complete and todos to load
    await waitFor(() => {
      expect(screen.queryByText('Loading your todos...')).not.toBeInTheDocument();
    });

    // Wait for the input to be enabled (no longer disabled during initial load)
    const titleInput = await screen.findByPlaceholderText('Add a new todo...');
    
    // Verify the button shows "Add Todo" (not "Adding...")
    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /Add Todo/ });
      expect(addButton).not.toBeDisabled();
    });

    // Now fill in and submit the form
    fireEvent.change(titleInput, { target: { value: 'New Todo' } });

    const addButton = screen.getByRole('button', { name: /Add Todo/ });
    fireEvent.click(addButton);

    // Wait for the new todo to appear in the list
    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });
  });

  test('toggles todo completion status', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  test('handles API error when fetching todos', async () => {
    server.use(
      rest.get('/api/todos', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load todos/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no todos', async () => {
    server.use(
      rest.get('/api/todos', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
    });
  });

  test('toggles theme between light and dark', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    });

    const themeToggle = screen.getByRole('button', { name: /Switch to dark mode/ });
    fireEvent.click(themeToggle);

    expect(localStorage.getItem('todoAppTheme')).toBe('dark');

    const themToggleAfter = screen.getByRole('button', { name: /Switch to light mode/ });
    fireEvent.click(themToggleAfter);
    expect(localStorage.getItem('todoAppTheme')).toBe('light');
  });

  // Integration tests for consistent overdue display (User Story 2)
  describe('Overdue Indicator Consistency', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27')); // Mock current date
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('renders overdue indicators consistently across the app', async () => {
      server.use(
        rest.get('/api/todos', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              {
                id: 1,
                title: 'Overdue Task 1',
                dueDate: '2026-02-20',
                completed: 0,
                createdAt: '2026-02-15T00:00:00Z',
                isOverdue: true
              },
              {
                id: 2,
                title: 'Not Overdue Task',
                dueDate: '2026-03-01',
                completed: 0,
                createdAt: '2026-02-26T00:00:00Z',
                isOverdue: false
              }
            ])
          );
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Overdue Task 1')).toBeInTheDocument();
      });

      // Should have exactly 1 overdue indicator
      const overdueIndicators = screen.getAllByRole('status');
      expect(overdueIndicators).toHaveLength(1);
    });

    test('overdue indicators remain consistent when todos are filtered or sorted', async () => {
      server.use(
        rest.get('/api/todos', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              {
                id: 1,
                title: 'Overdue A',
                dueDate: '2026-02-20',
                completed: 0,
                createdAt: '2026-02-15T00:00:00Z',
                isOverdue: true
              },
              {
                id: 2,
                title: 'Overdue B',
                dueDate: '2026-02-25',
                completed: 0,
                createdAt: '2026-02-20T00:00:00Z',
                isOverdue: true
              },
              {
                id: 3,
                title: 'Not Overdue',
                dueDate: '2026-03-01',
                completed: 0,
                createdAt: '2026-02-26T00:00:00Z',
                isOverdue: false
              }
            ])
          );
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Overdue A')).toBeInTheDocument();
      });

      // Should have exactly 2 overdue indicators
      const overdueIndicators = screen.getAllByRole('status');
      expect(overdueIndicators).toHaveLength(2);
    });
  });

  // Integration tests for real-time updates (User Story 3)
  describe('Real-time Overdue Status Updates', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-27')); // Mock current date
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('overdue indicator updates immediately when todo is completed', async () => {
      server.use(
        rest.get('/api/todos', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              {
                id: 1,
                title: 'Overdue Task',
                dueDate: '2026-02-20',
                completed: 0,
                createdAt: '2026-02-15T00:00:00Z',
                isOverdue: true
              }
            ])
          );
        }),
        rest.patch('/api/todos/1/toggle', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: 1,
              title: 'Overdue Task',
              dueDate: '2026-02-20',
              completed: 1,
              createdAt: '2026-02-15T00:00:00Z',
              isOverdue: false
            })
          );
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Overdue Task')).toBeInTheDocument();
      });

      // Initially has overdue indicator
      expect(screen.getByRole('status')).toBeInTheDocument();

      // Complete the todo
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      // Overdue indicator should disappear immediately after completion
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });

    test('overdue indicator appears immediately when due date changes to past', async () => {
      server.use(
        rest.get('/api/todos', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              {
                id: 1,
                title: 'Future Task',
                dueDate: '2026-03-01',
                completed: 0,
                createdAt: '2026-02-26T00:00:00Z',
                isOverdue: false
              }
            ])
          );
        }),
        rest.put('/api/todos/1', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: 1,
              title: 'Now Overdue Task',
              dueDate: '2026-02-20',
              completed: 0,
              createdAt: '2026-02-26T00:00:00Z',
              isOverdue: true
            })
          );
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Future Task')).toBeInTheDocument();
      });

      // Initially no overdue indicator
      expect(screen.queryByRole('status')).not.toBeInTheDocument();

      // Edit the todo to change due date (simulate the edit flow)
      const editButton = screen.getByLabelText(/Edit "Future Task"/);
      fireEvent.click(editButton);

      // Fill in edit form with past due date
      const titleInput = screen.getByDisplayValue('Future Task');
      fireEvent.change(titleInput, { target: { value: 'Now Overdue Task' } });
      
      const dateInput = screen.getByLabelText(/Edit due date/);
      fireEvent.change(dateInput, { target: { value: '2026-02-20' } });

      // Save
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Overdue indicator should appear immediately after update
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });
  });
});
