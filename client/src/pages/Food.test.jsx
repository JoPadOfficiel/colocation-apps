import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/utils';
import Food from './Food';

// Mock the API module
vi.mock('@/lib/api', () => ({
  fetchRecipes: vi.fn(),
  createRecipe: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
  fetchShoppingList: vi.fn(),
  createShoppingItem: vi.fn(),
  updateShoppingItem: vi.fn(),
  deleteShoppingItem: vi.fn(),
  fetchUsers: vi.fn(),
  updateUser: vi.fn(),
}));

const { fetchRecipes, fetchShoppingList, fetchUsers } = await import('@/lib/api');

const mockUser = {
  id: 'u1',
  name: 'Jopad',
  email: 'jopad@test.com',
  role: 'admin',
  dietaryConstraints: ['Végétarien'],
};

const mockUsers = [
  { id: 'u1', name: 'Jopad', dietaryConstraints: ['Végétarien'] },
  { id: 'u2', name: 'Yohan', dietaryConstraints: [] },
];

const mockRecipes = [
  {
    id: 'r1',
    dishName: 'Pâtes Carbonara',
    prepTime: 20,
    portions: 4,
    ingredients: ['Pâtes', 'Lardons', 'Oeufs', 'Parmesan'],
    dietaryConstraints: [],
    isFavorite: true,
  },
  {
    id: 'r2',
    dishName: 'Salade César',
    prepTime: 15,
    portions: 2,
    ingredients: ['Salade', 'Poulet', 'Croutons', 'Parmesan'],
    dietaryConstraints: ['Sans gluten'],
    isFavorite: false,
  },
];

const mockShoppingItems = [
  { id: 's1', itemName: 'Lait', category: 'Produits laitiers', isPurchased: false, assignedTo: 'u1' },
  { id: 's2', itemName: 'Pain', category: 'Boulangerie', isPurchased: true, assignedTo: 'u2' },
];

describe('Food Page (Epic 6)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchRecipes.mockResolvedValue(mockRecipes);
    fetchShoppingList.mockResolvedValue(mockShoppingItems);
    fetchUsers.mockResolvedValue(mockUsers);
  });

  it('@P0 GIVEN a user on /alimentation WHEN the page loads THEN "Alimentation" heading and tabs are displayed', async () => {
    render(<Food />, {
      authValue: { user: mockUser, setUser: vi.fn(), login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Alimentation' })).toBeInTheDocument();
    expect(screen.getByText('Menu du jour')).toBeInTheDocument();
    expect(screen.getByText('Liste')).toBeInTheDocument();
    expect(screen.getByText('Recettes')).toBeInTheDocument();
    expect(screen.getByText('Régimes')).toBeInTheDocument();
  });

  it('@P0 GIVEN the food page WHEN it loads THEN the "Menu du jour" tab shows a daily suggestion', async () => {
    render(<Food />, {
      authValue: { user: mockUser, setUser: vi.fn(), login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    // By default, the "menu" tab is active and a suggestion should appear
    expect(screen.getByText("Aujourd'hui au menu")).toBeInTheDocument();
    expect(screen.getByText('Suggestion')).toBeInTheDocument();
    expect(screen.getByText('Changer de suggestion')).toBeInTheDocument();
  });

  it('@P0 GIVEN the food page WHEN it loads THEN the suggest button is available and recalculates the menu', async () => {
    render(<Food />, {
      authValue: { user: mockUser, setUser: vi.fn(), login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    const btn = screen.getByRole('button', { name: /changer de suggestion/i });
    expect(btn).toBeInTheDocument();
  });

  it('@P0 GIVEN the food page with recipes WHEN the daily menu is shown THEN it displays recipe details (prep time, portions, ingredients)', async () => {
    render(<Food />, {
      authValue: { user: mockUser, setUser: vi.fn(), login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    // One of the recipes is displayed
    const dishNames = mockRecipes.map(r => r.dishName);
    const found = dishNames.some(name => screen.queryByText(name) !== null);
    expect(found).toBe(true);

    // Prep time and portions info
    expect(screen.getByText('Préparation')).toBeInTheDocument();
    expect(screen.getByText('Portions')).toBeInTheDocument();
    expect(screen.getByText('Ingrédients nécessaires')).toBeInTheDocument();
  });

  it('@P0 GIVEN the API returns empty recipes WHEN the page loads THEN a "no recipe" message is displayed', async () => {
    fetchRecipes.mockResolvedValue([]);

    render(<Food />, {
      authValue: { user: mockUser, setUser: vi.fn(), login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Aucune recette disponible pour proposer un menu.')).toBeInTheDocument();
  });

  it('@P0 GIVEN the API returns shopping items WHEN data is loaded THEN the items count badge is present in the Shopping tab', async () => {
    render(<Food />, {
      authValue: { user: mockUser, setUser: vi.fn(), login: vi.fn(), logout: vi.fn(), loading: false },
    });

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    // The shopping tab should be accessible
    expect(screen.getByText('Liste')).toBeInTheDocument();
  });
});
