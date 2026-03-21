import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/utils';
import Settings from './Settings';

// Mock the API module
vi.mock('@/lib/api', () => ({
  updateUser: vi.fn(),
  fetchUsers: vi.fn(),
}));

const { updateUser, fetchUsers } = await import('@/lib/api');

const mockColocation = {
  id: 'c1',
  name: 'Coloc Test',
  invitationCode: 'COLOC-XYZ-123',
  members: [
    { id: 'u1', name: 'Jopad', role: 'admin' },
    { id: 'u2', name: 'Yohan', role: 'member' },
  ],
};

describe('Settings Page (Epic 8)', () => {
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetchUsers.mockResolvedValue(mockColocation.members);
  });

  describe('Story 8.1 - Profile Settings', () => {
    it('@P0 GIVEN a user on /settings WHEN the page loads THEN the profile form is displayed with name and email fields', () => {
      const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };
      render(<Settings />, {
        authValue: { user: mockUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      expect(screen.getByRole('heading', { name: 'Réglages' })).toBeInTheDocument();
      expect(screen.getByText('Profil')).toBeInTheDocument();
      expect(screen.getByLabelText(/nom complet/i)).toHaveValue('Jopad');
      expect(screen.getByLabelText(/adresse e-mail/i)).toHaveValue('jopad@test.com');
    });

    it('@P0 GIVEN a user on /settings WHEN they update their name and submit THEN the updateUser API is called', async () => {
      const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };
      const updatedUser = { ...mockUser, name: 'Jopad Updated' };
      updateUser.mockResolvedValueOnce(updatedUser);

      render(<Settings />, {
        authValue: { user: mockUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      const nameInput = screen.getByLabelText(/nom complet/i);
      fireEvent.change(nameInput, { target: { value: 'Jopad Updated' } });
      fireEvent.click(screen.getByRole('button', { name: /mettre à jour/i }));

      await waitFor(() => {
        expect(updateUser).toHaveBeenCalledWith('u1', { name: 'Jopad Updated', email: 'jopad@test.com' });
      });

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(updatedUser);
      });
    });

    it('@P0 GIVEN a user on /settings WHEN they submit an empty name THEN an error message is displayed', async () => {
      const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };

      render(<Settings />, {
        authValue: { user: mockUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      const nameInput = screen.getByLabelText(/nom complet/i);
      fireEvent.change(nameInput, { target: { value: '  ' } });
      fireEvent.click(screen.getByRole('button', { name: /mettre à jour/i }));

      await waitFor(() => {
        expect(screen.getByText('Le nom ne peut pas être vide.')).toBeInTheDocument();
      });

      expect(updateUser).not.toHaveBeenCalled();
    });
  });

  describe('Story 8.2 - Colocation Management (Admin)', () => {
    it('@P0 GIVEN an admin user WHEN the settings page loads THEN the "Ma Colocation" section is displayed', () => {
      const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };

      render(<Settings />, {
        authValue: { user: mockUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      expect(screen.getByText('Ma Colocation')).toBeInTheDocument();
    });

    it('@P0 GIVEN an admin user WHEN the settings page loads THEN the invitation code is displayed', () => {
      const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };

      render(<Settings />, {
        authValue: { user: mockUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      expect(screen.getByText("Code d'invitation")).toBeInTheDocument();
      expect(screen.getByText('COLOC-XYZ-123')).toBeInTheDocument();
    });

    it('@P0 GIVEN an admin user WHEN the settings page loads THEN members are listed with their roles', async () => {
      const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };

      render(<Settings />, {
        authValue: { user: mockUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      await waitFor(() => {
        expect(screen.getByText('Membres')).toBeInTheDocument();
      });
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Membre')).toBeInTheDocument();
    });

    it('@P0 GIVEN a non-admin user WHEN the settings page loads THEN the "Ma Colocation" section is NOT displayed', () => {
      const memberUser = { id: 'u2', name: 'Yohan', email: 'yohan@test.com', role: 'member' };

      render(<Settings />, {
        authValue: { user: memberUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      expect(screen.queryByText('Ma Colocation')).not.toBeInTheDocument();
    });
  });

  describe('Story 8.3 - Notifications Settings', () => {
    it('@P0 GIVEN a user on /settings WHEN the page loads THEN notification toggles are visible', () => {
      const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };

      render(<Settings />, {
        authValue: { user: mockUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Notifications par e-mail')).toBeInTheDocument();
      expect(screen.getByText('Notifications Push')).toBeInTheDocument();
    });

    it('@P1 GIVEN a user on /settings WHEN the "Supprimer le compte" link is visible THEN it is accessible', () => {
      const mockUser = { id: 'u1', name: 'Jopad', email: 'jopad@test.com', role: 'admin' };

      render(<Settings />, {
        authValue: { user: mockUser, setUser: mockSetUser, login: vi.fn(), logout: vi.fn(), loading: false, colocation: mockColocation },
      });

      expect(screen.getByText('Supprimer le compte')).toBeInTheDocument();
    });
  });
});
