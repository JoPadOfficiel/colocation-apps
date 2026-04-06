import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils'
import Onboarding from './Onboarding'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Onboarding Page', () => {
  const mockUpdateColocation = vi.fn()
  const authValue = {
    user: { name: 'John Doe' },
    colocation: null,
    updateColocation: mockUpdateColocation
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('@P0 GIVEN the onboarding page WHEN rendered THEN it should show create and join options', () => {
    render(<Onboarding />, { authValue })

    expect(screen.getByText(/Créer une colocation/i)).toBeInTheDocument()
    expect(screen.getByText(/Rejoindre une colocation/i)).toBeInTheDocument()
  })

  it('@P0 GIVEN the create mode WHEN submitting a valid name THEN it should show the invitation code', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { invitationCode: 'COLO-1234-A', id: '1' } })
    })

    render(<Onboarding />, { authValue })

    fireEvent.click(screen.getByText(/Créer une colocation/i))
    fireEvent.change(screen.getByLabelText(/Nom de la colocation/i), { target: { value: 'My Home' } })
    fireEvent.click(screen.getByRole('button', { name: /^Créer$/i }))

    await waitFor(() => {
      expect(screen.getByText(/COLO-1234-A/i)).toBeInTheDocument()
      expect(mockUpdateColocation).toHaveBeenCalledWith({ invitationCode: 'COLO-1234-A', id: '1' })
    })
  })

  it('@P0 GIVEN the join mode WHEN entering a valid code THEN it should show preview and allow joining', async () => {
    // First call: preview returns colocation info
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: '1', name: 'My Home', memberCount: 2, members: [] } })
    })
    // Second call: actual join
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: '1', name: 'My Home' } })
    })

    render(<Onboarding />, { authValue })

    fireEvent.click(screen.getByText(/Rejoindre une colocation/i))
    fireEvent.change(screen.getByLabelText(/Code d'invitation/i), { target: { value: 'COLO-1234-A' } })
    fireEvent.click(screen.getByRole('button', { name: /Vérifier le code/i }))

    // Wait for preview dialog to appear and confirm
    await waitFor(() => {
      expect(screen.getByText(/My Home/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /Confirmer et rejoindre/i }))

    await waitFor(() => {
      expect(mockUpdateColocation).toHaveBeenCalledWith({ id: '1', name: 'My Home' })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })
})
