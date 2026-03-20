import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import { useAuth } from "./contexts/AuthContext"

// Temporary mock pages
const Dashboard = () => <div className="p-4 animate-in fade-in duration-500"><h1 className="text-3xl font-bold text-gray-900 mb-4">Tableau de bord</h1><p className="text-gray-600">Bienvenue sur ColocApp !</p></div>;
const Tasks = () => <div className="p-4 animate-in fade-in duration-500"><h1 className="text-3xl font-bold text-gray-900 mb-4">Tâches</h1><p className="text-gray-600">Gestion des tâches.</p></div>;
const Food = () => <div className="p-4 animate-in fade-in duration-500"><h1 className="text-3xl font-bold text-gray-900 mb-4">Alimentation</h1><p className="text-gray-600">Liste de courses et menus.</p></div>;
const Finances = () => <div className="p-4 animate-in fade-in duration-500"><h1 className="text-3xl font-bold text-gray-900 mb-4">Finances</h1><p className="text-gray-600">Suivi des dépenses communes.</p></div>;
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
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="food" element={<Food />} />
          <Route path="finances" element={<Finances />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
