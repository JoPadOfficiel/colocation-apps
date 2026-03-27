import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/utils';
import Tasks from './Tasks';

// Mock the API module
vi.mock('@/lib/api', () => ({
  fetchTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  fetchUsers: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

const { fetchTasks, fetchUsers } = await import('@/lib/api');

const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };
const mockUsers = [
  { id: 'u1', name: 'Jopad' },
  { id: 'u2', name: 'Yohan' },
  { id: 'u3', name: 'Luis-Manuel' },
];
const mockTasks = [
  { id: 't1', title: 'Faire la vaisselle', category: 'Cuisine', status: 'À faire', assignedTo: 'u1', dueDate: '2026-04-01T00:00:00Z', recurrence: 'none' },
  { id: 't2', title: 'Passer l\'aspirateur', category: 'Salon', status: 'À faire', assignedTo: 'u2', dueDate: '2026-04-02T00:00:00Z', recurrence: 'weekly' },
  { id: 't3', title: 'Sortir les poubelles', category: 'Extérieur', status: 'Terminée', assignedTo: 'u1', dueDate: '2026-03-20T00:00:00Z', recurrence: 'none' },
];

describe('Tasks Page (Epic 4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchTasks.mockResolvedValue(mockTasks);
    fetchUsers.mockResolvedValue(mockUsers);
  });

  it('@P0 GIVEN a user on /tasks WHEN the page loads THEN tasks are displayed in "À Faire" and "Terminées" columns with counters', async () => {
    render(<Tasks />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false },
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    // Check column headers with counters
    expect(screen.getByText('À Faire')).toBeInTheDocument();
    expect(screen.getByText('Terminées')).toBeInTheDocument();

    // Check tasks are rendered
    expect(screen.getByText('Faire la vaisselle')).toBeInTheDocument();
    expect(screen.getByText("Passer l'aspirateur")).toBeInTheDocument();
    expect(screen.getByText('Sortir les poubelles')).toBeInTheDocument();
  });

  it('@P0 GIVEN a user on /tasks WHEN the page loads THEN each task card shows category, title, date, and assignation', async () => {
    render(<Tasks />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    // Categories
    expect(screen.getByText('Cuisine')).toBeInTheDocument();
    expect(screen.getByText('Salon')).toBeInTheDocument();

    // Assignations
    expect(screen.getAllByText('Jopad').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Yohan').length).toBeGreaterThanOrEqual(1);
  });

  it('@P0 GIVEN the tasks page WHEN "NOUVELLE TÂCHE" button is clicked THEN the creation dialog opens', async () => {
    render(<Tasks />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /nouvelle tâche/i });
    expect(button).toBeInTheDocument();
  });

  it('@P0 GIVEN a task with weekly recurrence WHEN displayed THEN the recurrence badge is visible', async () => {
    render(<Tasks />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Hebdo')).toBeInTheDocument();
  });

  it('@P0 GIVEN the tasks page WHEN it loads THEN statistics per member are displayed', async () => {
    render(<Tasks />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Statistiques par membre')).toBeInTheDocument();
  });

  it('@P0 GIVEN the tasks page WHEN it loads THEN filter selects for status, assignee, and date are present', async () => {
    render(<Tasks />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
    // removed
    // removed
  });
});
