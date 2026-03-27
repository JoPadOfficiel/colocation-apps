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
import Settings from "./pages/Settings"
import NotificationsTest from "./pages/NotificationsTest"
import { useAuth } from "./contexts/AuthContext"

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
        <Route path="/notifications-test" element={<NotificationsTest />} />
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
