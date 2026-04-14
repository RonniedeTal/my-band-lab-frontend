import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { BottomNavigation } from './BottomNavigation';
import { GlobalSearch } from './GlobalSearch';
import { Menu, X, LogOut, User as UserIcon, Music, Users, Shield, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  // No mostrar header en páginas de auth
  const hideHeader = ['/login', '/register'].includes(location.pathname);

  if (hideHeader) {
    return <main className="min-h-screen bg-dark-bg">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header Desktop */}
      {!isMobile && (
        <nav className="bg-dark-surface/80 backdrop-blur-md border-b border-dark-border sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16 gap-4">
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap"
              >
                MyBandLab
              </Link>

              {/* Búsqueda global */}
              <div className="flex-1 max-w-md">
                <GlobalSearch />
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/artists"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Users className="w-4 h-4" />
                  Artistas
                </Link>
                <Link
                  to="/groups"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Music className="w-4 h-4" />
                  Grupos
                </Link>

                {isAuthenticated() ? (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/favorites"
                      className="text-gray-300 hover:text-pink-400 transition-colors flex items-center gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      Favoritos
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Shield className="w-4 h-4" />
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover border border-purple-500"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {user?.name?.charAt(0)}
                            {user?.surname?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span>{user?.name}</span>
                    </Link>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      <LogOut className="w-4 h-4 mr-1" />
                      Salir
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" size="sm">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Header Mobile */}
      {isMobile && (
        <nav className="bg-dark-surface/80 backdrop-blur-md border-b border-dark-border sticky top-0 z-50">
          <div className="flex justify-between items-center px-4 h-14">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            >
              MyBandLab
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menú móvil desplegable */}
          {isMobileMenuOpen && (
            <div className="absolute top-14 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 py-4 z-50">
              <div className="px-4 mb-4">
                <GlobalSearch />
              </div>
              <div className="flex flex-col gap-2 px-4">
                {!isAuthenticated() ? (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 border-b border-gray-700 flex items-center gap-3">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover border border-purple-500"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-md font-bold text-white">
                            {user?.name?.charAt(0)}
                            {user?.surname?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">
                          {user?.name} {user?.surname}
                        </p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                      </div>
                    </div>
                    <Link to="/artists" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Users className="w-4 h-4" />
                        Artistas
                      </Button>
                    </Link>
                    <Link to="/groups" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Music className="w-4 h-4" />
                        Grupos
                      </Button>
                    </Link>
                    <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Heart className="w-4 h-4" />
                        Favoritos
                      </Button>
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Shield className="w-4 h-4" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <UserIcon className="w-4 h-4" />
                        Mi Perfil
                      </Button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Contenido principal */}
      <main className={isMobile ? 'pb-16' : ''}>{children}</main>

      {/* Navegación inferior (solo en móvil) */}
      {isMobile && <BottomNavigation />}
    </div>
  );
};
