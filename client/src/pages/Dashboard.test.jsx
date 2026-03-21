import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils'
import Dashboard from './Dashboard'
import * as api from '@/lib/api'

// Mock API calls
vi.mock('@/lib/api', () => ({
  fetchTasks: vi.fn(),
  fetchFinances: vi.fn(),
  fetchShoppingList: vi.fn(),
  fetchSubscriptions: vi.fn(),
  fetchUsers: vi.fn()
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Dashboard Page', () => {
  const mockData = {
    tasks: [{ id: '1', title: 'Task 1', status: 'À faire', dueDate: new Date().toISOString() }],
    finances: [{ id: '1', title: 'Rent', amount: 500, type: 'rent', date: new Date().toISOString(), paidBy: 'u1' }],
    shopping: [{ id: '1', title: 'Milk', isPurchased: false }],
    subscriptions: [{ id: '1', title: 'Netflix' }],
    users: [{ id: 'u1', name: 'John Doe' }]
  }

  const authValue = {
    user: { name: 'John Doe' },
    colocation: { totalFund: 1000 },
    loading: false
  }

  beforeEach(() => {
    vi.clearAllMocks()

    api.fetchTasks.mockResolvedValue(mockData.tasks)
    api.fetchFinances.mockResolvedValue(mockData.finances)
    api.fetchShoppingList.mockResolvedValue(mockData.shopping)
    api.fetchSubscriptions.mockResolvedValue(mockData.subscriptions)
    api.fetchUsers.mockResolvedValue(mockData.users)
  })

  it('@P0 GIVEN the dashboard WHEN loading THEN it should show a loading message', async () => {
    render(<Dashboard />, { authValue })
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument()
    // Wait for initialization to avoid act() warning
    await waitFor(() => expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument())
  })

  it('@P0 GIVEN the dashboard WHEN data is loaded THEN it should show widgets and charts', async () => {
    render(<Dashboard />, { authValue })

    await waitFor(() => {
      expect(screen.getByText(/1000.00 €/i)).toBeInTheDocument() // Wallet widget
      expect(screen.getByText(/1 urgente/i)).toBeInTheDocument() // Task widget
      expect(screen.getByText(/1 article/i)).toBeInTheDocument() // Food widget
      expect(screen.getByText(/1 actif/i)).toBeInTheDocument() // Subscriptions widget
      expect(screen.getByText(/Dépenses par catégorie/i)).toBeInTheDocument()
      expect(screen.getByText(/Activités récentes/i)).toBeInTheDocument()
    })
  })

  it('@P0 GIVEN the dashboard WHEN clicking a widget THEN it should navigate to the correct page', async () => {
    render(<Dashboard />, { authValue })

    await waitFor(() => {
      const financesWidget = screen.getByText(/Finances/i)
      expect(financesWidget).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText(/Finances/i))
    expect(mockNavigate).toHaveBeenCalledWith('/finances')

    fireEvent.click(screen.getByText(/Tâches/i))
    expect(mockNavigate).toHaveBeenCalledWith('/tasks')
  })
})
