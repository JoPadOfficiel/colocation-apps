import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/utils';
import Finances from './Finances';

// Mock the API module
vi.mock('@/lib/api', () => ({
  fetchFinances: vi.fn(),
  createFinance: vi.fn(),
  updateFinance: vi.fn(),
  deleteFinance: vi.fn(),
}));

// Mock recharts to avoid canvas rendering issues
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => children,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  CartesianGrid: () => <div />,
  Legend: () => <div />,
}));

const { fetchFinances } = await import('@/lib/api');

const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };
const mockColocation = {
  id: 'c1',
  name: 'Test Coloc',
  members: [
    { id: 'u1', name: 'Jopad' },
    { id: 'u2', name: 'Yohan' },
    { id: 'u3', name: 'Luis-Manuel' },
  ],
};

const mockFinances = [
  { id: 'f1', description: 'Courses Carrefour', amount: 45.50, paidBy: 'u1', date: '2026-03-15T00:00:00Z', category: 'Courses' },
  { id: 'f2', description: 'Facture Internet', amount: 39.99, paidBy: 'u2', date: '2026-03-10T00:00:00Z', category: 'Factures' },
  { id: 'f3', description: 'Produits ménagers', amount: 12.00, paidBy: 'u1', date: '2026-03-20T00:00:00Z', category: 'Courses' },
];

describe('Finances Page (Epic 5)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchFinances.mockResolvedValue(mockFinances);
  });

  it('@P0 GIVEN a user on /finances WHEN the page loads THEN the page title "Finances" is displayed', async () => {
    render(<Finances />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Finances' })).toBeInTheDocument();
  });

  it('@P0 GIVEN the finances page WHEN it loads THEN total and balance metric cards are displayed', async () => {
    render(<Finances />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Total Dépenses')).toBeInTheDocument();
    expect(screen.getByText('Mon Solde')).toBeInTheDocument();
    expect(screen.getByText('Part Moyenne')).toBeInTheDocument();
  });

  it('@P0 GIVEN the finances page WHEN it loads THEN the expense list is displayed', async () => {
    render(<Finances />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Courses Carrefour')).toBeInTheDocument();
    expect(screen.getByText('Facture Internet')).toBeInTheDocument();
    expect(screen.getByText('Produits ménagers')).toBeInTheDocument();
  });

  it('@P0 GIVEN the finances page WHEN it loads THEN a "NOUVELLE DÉPENSE" button is visible', async () => {
    render(<Finances />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /nouvelle dépense/i })).toBeInTheDocument();
  });

  it('@P0 GIVEN the finances page WHEN it loads THEN the balance section shows debts between members', async () => {
    render(<Finances />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Équilibrage des Comptes')).toBeInTheDocument();
  });

  it('@P0 GIVEN the finances page WHEN it loads THEN the monthly chart container is displayed', async () => {
    render(<Finances />, {
      authValue: { user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Dépenses Mensuelles')).toBeInTheDocument();
  });
});
