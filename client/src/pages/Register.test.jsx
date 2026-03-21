import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils'
import Register from './Register'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Register Page', () => {
  const mockRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const authValue = {
    register: mockRegister,
    user: null,
    loading: false
  }

  it('@P0 GIVEN the register page WHEN rendered THEN it should show all fields', () => {
    render(<Register />, { authValue })

    expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Adresse email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /S'INSCRIRE/i })).toBeInTheDocument()
  })

  it('@P0 GIVEN invalid inputs WHEN clicking register THEN it should show validation errors', async () => {
    render(<Register />, { authValue })

    fireEvent.click(screen.getByRole('button', { name: /S'INSCRIRE/i }))

    expect(screen.getByText(/Nom requis/i)).toBeInTheDocument()
    expect(screen.getByText(/Email invalide/i)).toBeInTheDocument()
    expect(screen.getByText(/Au moins 8 caractères/i)).toBeInTheDocument()
  })

  it('@P0 GIVEN valid inputs WHEN registering succeeds THEN it should navigate to dashboard', async () => {
    mockRegister.mockResolvedValue({ success: true })

    render(<Register />, { authValue })

    fireEvent.change(screen.getByLabelText(/Nom complet/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Adresse email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } })

    fireEvent.click(screen.getByRole('button', { name: /S'INSCRIRE/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })

  it('@P0 GIVEN valid inputs WHEN registering fails THEN it should show error message', async () => {
    mockRegister.mockResolvedValue({ success: false, error: 'Email already exists' })

    render(<Register />, { authValue })

    fireEvent.change(screen.getByLabelText(/Nom complet/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Adresse email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } })

    fireEvent.click(screen.getByRole('button', { name: /S'INSCRIRE/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Email already exists/i)
    })
  })
})
