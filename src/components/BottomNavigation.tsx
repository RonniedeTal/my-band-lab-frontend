import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Music, User, Compass, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const BottomNavigation: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // No mostrar en páginas de auth
  const hideNavigation = ['/login', '/register'].includes(location.pathname);

  if (hideNavigation) {
    return null;
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/explore', icon: Compass, label: 'Explorar' },
    { path: '/artists', icon: Users, label: 'Artistas' },
    { path: '/groups', icon: Music, label: 'Grupos' },
  ];

  if (isAuthenticated()) {
    navItems.push({ path: '/favorites', icon: Heart, label: 'Favoritos' });
    navItems.push({ path: '/profile', icon: User, label: 'Perfil' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-50">
      <div className="flex justify-around items-center px-4 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse-glow' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
