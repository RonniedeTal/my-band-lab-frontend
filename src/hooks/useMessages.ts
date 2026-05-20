import { useState, useEffect, useCallback } from 'react';
import { messageApi } from '@/services/messageApi';
import { webSocketService } from '@/services/websocket';
import { MessageResponse } from '@/types/message.types';

interface UseMessagesOptions {
  partnerId: number;
  autoConnect?: boolean;
}

interface UseMessagesReturn {
  messages: MessageResponse[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  markAsRead: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useMessages = ({ partnerId, autoConnect = true }: UseMessagesOptions): UseMessagesReturn => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 50;

  const fetchMessages = useCallback(async (pageNum: number = 0, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await messageApi.getConversation(partnerId, pageNum, PAGE_SIZE);

      if (append) {
        setMessages((prev) => [...prev, ...response.content]);
      } else {
        setMessages(response.content);
      }

      setPage(response.currentPage);
      setHasMore(response.hasNext);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    await fetchMessages(nextPage, true);
  };

  const refetch = async () => {
    setPage(0);
    setHasMore(true);
    await fetchMessages(0, false);
  };

  const markAsRead = async () => {
    try {
      await messageApi.markAsRead(partnerId);
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await messageApi.markAllAsRead();
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  useEffect(() => {
    fetchMessages(0, false);

    if (autoConnect && webSocketService.isConnected()) {
      webSocketService.subscribeUser<MessageResponse>(partnerId, (message) => {
        if (message.senderId === partnerId || message.receiverId === partnerId) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === message.id);
            if (!exists) {
              return [...prev, message];
            }
            return prev.map((m) => (m.id === message.id ? message : m));
          });
        }
      });
    }
  }, [partnerId, autoConnect, fetchMessages]);

  return {
    messages,
    loading,
    error,
    hasMore,
    page,
    loadMore,
    refetch,
    markAsRead,
    markAllAsRead,
  };
};