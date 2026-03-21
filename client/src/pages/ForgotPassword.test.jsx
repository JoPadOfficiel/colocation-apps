import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils'
import ForgotPassword from './ForgotPassword'

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('@P0 GIVEN the forgot password page WHEN rendered THEN it should show the email input', () => {
    render(<ForgotPassword />)

    expect(screen.getByLabelText(/Adresse email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ENVOYER LE LIEN/i })).toBeInTheDocument()
  })

  it('@P0 GIVEN an invalid email WHEN submitting THEN it should show a validation error', async () => {
    render(<ForgotPassword />)

    const input = screen.getByLabelText(/Adresse email/i)
    fireEvent.change(input, { target: { value: 'invalid-email' } })
    
    const form = screen.getByRole('button', { name: /ENVOYER LE LIEN/i }).closest('form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/Email invalide/i)).toBeInTheDocument()
    })
  })

  it('@P0 GIVEN a valid email WHEN submitting THEN it should show a success message', async () => {
    fetch.mockResolvedValueOnce({ ok: true })

    render(<ForgotPassword />)

    fireEvent.change(screen.getByLabelText(/Adresse email/i), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /ENVOYER LE LIEN/i }))

    await waitFor(() => {
      expect(screen.getByText(/Un email de réinitialisation a été envoyé/i)).toBeInTheDocument()
    })
  })

  it('@P0 GIVEN the success state WHEN clicking retry THEN it should go back to the form', async () => {
    fetch.mockResolvedValueOnce({ ok: true })

    render(<ForgotPassword />)

    fireEvent.change(screen.getByLabelText(/Adresse email/i), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /ENVOYER LE LIEN/i }))

    await waitFor(() => screen.getByText(/Réessayer/i))
    
    fireEvent.click(screen.getByText(/Réessayer/i))
    
    expect(screen.getByLabelText(/Adresse email/i)).toBeInTheDocument()
  })
})
