import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useConversations } from '../../hooks/useConversations';
import { messageApi } from '../../services/messageApi';

const mockLocalStorage = (() => {
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
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

vi.mock('../../services/messageApi', () => ({
  messageApi: {
    sendMessage: vi.fn(),
    getConversations: vi.fn(),
    getConversation: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    getMessageById: vi.fn(),
  },
}));

vi.mock('../../services/websocket', () => ({
  webSocketService: {
    isConnected: () => false,
    subscribe: vi.fn(),
    subscribeUser: vi.fn(),
    subscribeQueue: vi.fn(),
    unsubscribe: vi.fn(),
  },
}));

describe('useConversations Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('initial state', () => {
    it('debe tener estado inicial correcto', async () => {
      vi.mocked(messageApi.getConversations).mockResolvedValueOnce([]);
      vi.mocked(messageApi.getUnreadCount).mockResolvedValueOnce(0);

      const { result } = renderHook(() => useConversations());

      expect(result.current.conversations).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetch conversations', () => {
    it('debe cargar conversaciones correctamente', async () => {
      const mockConversations = [
        {
          partnerId: 2,
          partnerName: 'Artist User',
          partnerEmail: 'artist@test.com',
          lastMessageContent: 'Hello!',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 1,
          totalMessages: 5,
        },
        {
          partnerId: 3,
          partnerName: 'Another User',
          partnerEmail: 'another@test.com',
          lastMessageContent: 'Bye!',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          totalMessages: 10,
        },
      ];

      vi.mocked(messageApi.getConversations).mockResolvedValueOnce(mockConversations);
      vi.mocked(messageApi.getUnreadCount).mockResolvedValueOnce(1);

      const { result } = renderHook(() => useConversations());

      await waitFor(() => {
        expect(result.current.conversations).toHaveLength(2);
        expect(result.current.unreadCount).toBe(1);
        expect(result.current.loading).toBe(false);
      });

      expect(messageApi.getConversations).toHaveBeenCalledTimes(1);
      expect(messageApi.getUnreadCount).toHaveBeenCalledTimes(1);
    });

    it('debe manejar errores al cargar conversaciones', async () => {
      vi.mocked(messageApi.getConversations).mockRejectedValueOnce(new Error('Network error'));
      vi.mocked(messageApi.getUnreadCount).mockResolvedValueOnce(0);

      const { result } = renderHook(() => useConversations());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('refetch', () => {
    it('debe actualizar conversaciones al hacer refetch', async () => {
      vi.mocked(messageApi.getConversations).mockResolvedValue([]);
      vi.mocked(messageApi.getUnreadCount).mockResolvedValue(0);

      const { result } = renderHook(() => useConversations());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newConversations = [
        {
          partnerId: 4,
          partnerName: 'New User',
          partnerEmail: 'new@test.com',
          unreadCount: 0,
          totalMessages: 1,
        },
      ];

      vi.mocked(messageApi.getConversations).mockResolvedValueOnce(newConversations);
      vi.mocked(messageApi.getUnreadCount).mockResolvedValueOnce(2);

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.conversations).toHaveLength(1);
        expect(result.current.unreadCount).toBe(2);
      });
    });
  });

  describe('refreshConversations', () => {
    it('debe actualizar conversaciones y unread count', async () => {
      vi.mocked(messageApi.getConversations).mockResolvedValue([]);
      vi.mocked(messageApi.getUnreadCount).mockResolvedValue(0);

      const { result } = renderHook(() => useConversations());

      vi.mocked(messageApi.getConversations).mockResolvedValueOnce([
        { partnerId: 5, partnerName: 'Updated', partnerEmail: 'u@test.com', unreadCount: 3, totalMessages: 3 },
      ]);
      vi.mocked(messageApi.getUnreadCount).mockResolvedValueOnce(3);

      result.current.refreshConversations();

      await waitFor(() => {
        expect(result.current.conversations).toHaveLength(1);
        expect(result.current.unreadCount).toBe(3);
      });
    });
  });
});