import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Utensils, CreditCard, Menu } from 'lucide-react';

const BOTTOM_NAV_ITEMS = [
  { label: 'Accueil', path: '/dashboard', icon: Home },
  { label: 'Tâches', path: '/tasks', icon: CheckSquare },
  { label: 'Food', path: '/food', icon: Utensils },
  { label: 'Finances', path: '/finances', icon: CreditCard },
  { label: 'Plus', path: '/settings', icon: Menu },
];

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <nav className="flex justify-around items-center h-16">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
