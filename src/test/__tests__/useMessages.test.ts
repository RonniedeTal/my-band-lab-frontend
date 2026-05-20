import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMessages } from '../../hooks/useMessages';
import { messageApi } from '../../services/messageApi';

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

describe('useMessages Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial load', () => {
    it('debe cargar mensajes correctamente', async () => {
      const mockMessages = [
        {
          id: 1,
          senderId: 1,
          senderName: 'Sender',
          senderEmail: 'sender@test.com',
          receiverId: 2,
          receiverName: 'Receiver',
          receiverEmail: 'receiver@test.com',
          content: 'Hello!',
          isRead: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          senderId: 2,
          senderName: 'Receiver',
          senderEmail: 'receiver@test.com',
          receiverId: 1,
          receiverName: 'Sender',
          receiverEmail: 'sender@test.com',
          content: 'Hi!',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ];

      const mockPageResponse = {
        content: mockMessages,
        totalElements: 2,
        totalPages: 1,
        currentPage: 0,
        size: 50,
        hasNext: false,
        hasPrevious: false,
      };

      vi.mocked(messageApi.getConversation).mockResolvedValueOnce(mockPageResponse);

      const { result } = renderHook(() => useMessages({ partnerId: 2 }));

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.loading).toBe(false);
        expect(result.current.hasMore).toBe(false);
      });
    });

    it('debe manejar errores al cargar mensajes', async () => {
      vi.mocked(messageApi.getConversation).mockRejectedValueOnce(new Error('Failed to load'));

      const { result } = renderHook(() => useMessages({ partnerId: 2 }));

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load');
        expect(result.current.messages).toEqual([]);
      });
    });

    it('debe cargar segunda página de mensajes', async () => {
      const mockPage1 = {
        content: [{ id: 1, senderId: 1, senderName: 'S', senderEmail: 's@test.com', receiverId: 2, receiverName: 'R', receiverEmail: 'r@test.com', content: 'Msg 1', isRead: true, createdAt: '' }],
        totalElements: 3,
        totalPages: 1,
        currentPage: 0,
        size: 1,
        hasNext: true,
        hasPrevious: false,
      };

      const mockPage2 = {
        content: [{ id: 2, senderId: 1, senderName: 'S', senderEmail: 's@test.com', receiverId: 2, receiverName: 'R', receiverEmail: 'r@test.com', content: 'Msg 2', isRead: true, createdAt: '' }],
        totalElements: 3,
        totalPages: 2,
        currentPage: 1,
        size: 1,
        hasNext: false,
        hasPrevious: true,
      };

      vi.mocked(messageApi.getConversation)
        .mockResolvedValueOnce(mockPage1)
        .mockResolvedValueOnce(mockPage2);

      const { result } = renderHook(() => useMessages({ partnerId: 2 }));

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.hasMore).toBe(true);
      });

      await result.current.loadMore();

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.hasMore).toBe(false);
        expect(result.current.page).toBe(1);
      });
    });
  });

  describe('markAsRead', () => {
    it('debe marcar mensajes como leídos', async () => {
      const mockPageResponse = {
        content: [{ id: 1, senderId: 1, senderName: 'S', senderEmail: 's@test.com', receiverId: 2, receiverName: 'R', receiverEmail: 'r@test.com', content: 'Test', isRead: false, createdAt: '' }],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
        size: 50,
        hasNext: false,
        hasPrevious: false,
      };

      vi.mocked(messageApi.getConversation).mockResolvedValueOnce(mockPageResponse);
      vi.mocked(messageApi.markAsRead).mockResolvedValueOnce(1);

      const { result } = renderHook(() => useMessages({ partnerId: 2 }));

      await waitFor(() => {
        expect(result.current.messages[0].isRead).toBe(false);
      });

      await result.current.markAsRead();

      await waitFor(() => {
        expect(messageApi.markAsRead).toHaveBeenCalledWith(2);
        expect(result.current.messages[0].isRead).toBe(true);
      });
    });
  });

  describe('refetch', () => {
    it('debe recargar mensajes', async () => {
      vi.mocked(messageApi.getConversation).mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        size: 50,
        hasNext: false,
        hasPrevious: false,
      });

      const { result } = renderHook(() => useMessages({ partnerId: 2 }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newMessages = [{ id: 99, senderId: 1, senderName: 'S', senderEmail: 's@test.com', receiverId: 2, receiverName: 'R', receiverEmail: 'r@test.com', content: 'New', isRead: true, createdAt: '' }];

      vi.mocked(messageApi.getConversation)
        .mockResolvedValueOnce({
          content: newMessages,
          totalElements: 1,
          totalPages: 1,
          currentPage: 0,
          size: 50,
          hasNext: false,
          hasPrevious: false,
        });

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.page).toBe(0);
      });
    });
  });
});