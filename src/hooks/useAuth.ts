// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { setAuthToken, removeAuthToken, getAuthToken } from '@/services/apollo';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: 'USER' | 'ARTIST' | 'ADMIN';
  profileImageUrl?: string;
}

interface LoginResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  surname: string;
  email?: string;
  role?: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    // Cargar usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Sincronizar user con localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    console.log('🔐 Intentando login con:', { email });

    try {
      const response = await fetch('http://localhost:9000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Login failed: ${response.status} - ${errorData}`);
      }

      const data: LoginResponse = await response.json();
      console.log('📦 Respuesta:', data);

      if (data.token) {
        setAuthToken(data.token);

        // Determinar el rol correctamente
        let userRole: 'USER' | 'ARTIST' | 'ADMIN' = 'USER';
        if (data.role === 'ADMIN') {
          userRole = 'ADMIN';
        } else if (data.role === 'ARTIST') {
          userRole = 'ARTIST';
        }

        const userData: User = {
          id: data.id,
          name: data.name,
          surname: data.surname,
          email: email,
          role: userRole,
        };

        setUser(userData);
        console.log('✅ Login exitoso, rol:', userRole);

        return { success: true, user: data };
      }

      return { success: false, error: 'No token received' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('❌ Login error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, surname: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:9000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Registration failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Registro exitoso:', data);

      // Auto-login después de registro
      if (data.id) {
        return await login(email, password);
      }

      return { success: true, user: data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('❌ Registration error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    console.log('👋 Sesión cerrada');
  };

  const isAuthenticated = () => {
    const hasToken = !!getAuthToken();
    const hasUser = !!user;
    return hasToken && hasUser;
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    user,
    loading,
    error,
  };
};
