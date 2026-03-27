import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Utensils, CreditCard, Settings, LogOut, User, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { label: 'Accueil', path: '/dashboard', icon: Home },
  { label: 'Tâches', path: '/tasks', icon: CheckSquare },
  { label: 'Alimentation', path: '/food', icon: Utensils },
  { label: 'Finances', path: '/finances', icon: CreditCard },
  { label: 'Abonnements', path: '/subscriptions', icon: RefreshCcw },
  { label: 'Réglages', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">LaBonneColoc</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-gray-50 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name ?? ''}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email ?? ''}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
