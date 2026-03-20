import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Onboarding from "./pages/Onboarding"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Subscriptions from "./pages/Subscriptions"
import Finances from "./pages/Finances"
import Food from "./pages/Food"
import { useAuth } from "./contexts/AuthContext"

// Temporary mock pages
const Settings = () => <div className="p-4 animate-in fade-in duration-500"><h1 className="text-3xl font-bold text-gray-900 mb-4">Paramètres</h1><p className="text-gray-600">Configuration de la colocation.</p></div>;

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="food" element={<Food />} />
          <Route path="finances" element={<Finances />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
