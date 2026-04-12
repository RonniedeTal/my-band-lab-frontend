import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';

const mockFetch = vi.fn();
(window as typeof globalThis).fetch = mockFetch;

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAuth Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
  });

  describe('login', () => {
    it('debe iniciar sesión correctamente con credenciales válidas', async () => {
      const mockResponse = {
        token: 'fake-token-123',
        type: 'Bearer',
        id: 1,
        name: 'Juan',
        surname: 'Perez',
        email: 'juan@example.com',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.login('juan@example.com', '123456');
        expect(response.success).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });

    it('debe fallar con credenciales inválidas', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.login('juan@example.com', 'wrong');
        expect(response.success).toBe(false);
      });
    });
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario', async () => {
      const mockRegisterResponse = {
        id: 1,
        name: 'Juan',
        surname: 'Perez',
        email: 'juan@example.com',
        role: 'USER',
      };

      const mockLoginResponse = {
        token: 'fake-token-123',
        type: 'Bearer',
        id: 1,
        name: 'Juan',
        surname: 'Perez',
        email: 'juan@example.com',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRegisterResponse,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLoginResponse,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.register(
          'Juan',
          'Perez',
          'juan@example.com',
          '123456'
        );
        expect(response.success).toBe(true);
      });
    });
  });

  describe('logout', () => {
    it('debe cerrar sesión y limpiar el token', async () => {
      localStorage.setItem('auth_token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Juan' }));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        result.current.logout();
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});
