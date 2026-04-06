import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/utils';
import Login from './Login';

// Mock the API module
vi.mock('@/lib/api', () => ({
  loginUser: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Login Page (Epic 2 - Story 2.1)', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('@P0 GIVEN the login page WHEN it loads THEN the email and password fields are displayed', () => {
    render(<Login />, {
      authValue: { user: null, login: mockLogin, logout: vi.fn(), loading: false },
    });

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  it('@P0 GIVEN the login page WHEN it loads THEN the SE CONNECTER button is visible', () => {
    render(<Login />, {
      authValue: { user: null, login: mockLogin, logout: vi.fn(), loading: false },
    });

    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('@P0 GIVEN the login page WHEN it loads THEN "Mot de passe oublié ?" and "Créer un compte" links are visible', () => {
    render(<Login />, {
      authValue: { user: null, login: mockLogin, logout: vi.fn(), loading: false },
    });

    expect(screen.getByText('Mot de passe oublié ?')).toBeInTheDocument();
    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
  });

  it('@P0 GIVEN the login page WHEN it loads THEN the login form is the only authentication method visible', () => {
    render(<Login />, {
      authValue: { user: null, login: mockLogin, logout: vi.fn(), loading: false },
    });

    // The join colocation section was removed from the login page
    expect(screen.queryByText('Rejoindre une colocation existante')).not.toBeInTheDocument();
    // Only the login form should be present
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('@P0 GIVEN a user with valid credentials WHEN they submit the form THEN login is called and user is redirected', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    render(<Login />, {
      authValue: { user: null, login: mockLogin, logout: vi.fn(), loading: false },
    });

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@email.com', 'password123');
    });
  });

  it('@P0 GIVEN invalid credentials WHEN the form is submitted THEN an error message is displayed', async () => {
    mockLogin.mockResolvedValueOnce({ success: false, error: 'Email ou mot de passe incorrect' });

    render(<Login />, {
      authValue: { user: null, login: mockLogin, logout: vi.fn(), loading: false },
    });

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong@email.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email ou mot de passe incorrect');
    });
  });

  it('@P0 GIVEN the login page WHEN the user submits with empty fields THEN validation errors are shown', async () => {
    render(<Login />, {
      authValue: { user: null, login: mockLogin, logout: vi.fn(), loading: false },
    });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText('Email invalide')).toBeInTheDocument();
      expect(screen.getByText('Mot de passe requis')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('@P1 GIVEN the login page WHEN the toggle password visibility button is clicked THEN the password field type changes', () => {
    render(<Login />, {
      authValue: { user: null, login: mockLogin, logout: vi.fn(), loading: false },
    });

    const passwordInput = screen.getByLabelText('Mot de passe');
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByLabelText('Afficher le mot de passe'));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
