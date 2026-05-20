import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../services/websocket', () => ({
  webSocketService: { sendChatMessage: vi.fn() },
}));

const mockUser = { id: 1, name: 'Test', surname: 'User', email: 'test@test.com', role: 'USER' as const };

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: mockUser,
    token: 'fake-token',
    isAuthenticated: () => true,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    loading: false,
    error: null,
  })),
}));

describe('useSendMessage Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validation', () => {
    it('debe validar que no se envía mensaje a sí mismo', async () => {
      const { result } = renderHook(() => useSendMessage());
      const response = await result.current.sendMessage(1, 'Hello!');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Cannot send message to yourself');
    });

    it('debe validar mensaje vacío', async () => {
      const { result } = renderHook(() => useSendMessage());
      const response = await result.current.sendMessage(2, '');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Message cannot be empty');
    });

    it('debe validar mensaje con solo espacios', async () => {
      const { result } = renderHook(() => useSendMessage());
      const response = await result.current.sendMessage(2, '   ');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Message cannot be empty');
    });
  });

  describe('WebSocket', () => {
    it('debe funcionar sendMessageViaWebSocket', () => {
      const { result } = renderHook(() => useSendMessage());
      expect(() => result.current.sendMessageViaWebSocket(2, 'Hello!')).not.toThrow();
    });
  });

  describe('initial state', () => {
    it('debe tener loading inicial en false', () => {
      const { result } = renderHook(() => useSendMessage());
      expect(result.current.loading).toBe(false);
    });

    it('debe tener error inicial null', () => {
      const { result } = renderHook(() => useSendMessage());
      expect(result.current.error).toBeNull();
    });
  });
});