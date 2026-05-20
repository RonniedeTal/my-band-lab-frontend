import { useState, useEffect, useCallback } from 'react';
import { messageApi } from '@/services/messageApi';
import { webSocketService } from '@/services/websocket';
import { ConversationResponse } from '@/types/message.types';

interface UseConversationsReturn {
  conversations: ConversationResponse[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  refetch: () => Promise<void>;
  refreshConversations: () => void;
}

export const useConversations = (): UseConversationsReturn => {
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageApi.getConversations();
      setConversations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await messageApi.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  const refreshConversations = useCallback(() => {
    fetchConversations();
    fetchUnreadCount();
  }, [fetchConversations, fetchUnreadCount]);

  const refetch = async () => {
    await fetchConversations();
    await fetchUnreadCount();
  };

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();

    if (webSocketService.isConnected()) {
      webSocketService.subscribeQueue<ConversationResponse[]>(
        '/queue/conversations',
        (data) => {
          if (Array.isArray(data)) {
            setConversations(data);
          }
        }
      );

      webSocketService.subscribeQueue<{ unreadCount: number }>(
        '/queue/unread',
        (data) => {
          if (typeof data.unreadCount === 'number') {
            setUnreadCount(data.unreadCount);
          }
        }
      );
    }
  }, [fetchConversations, fetchUnreadCount]);

  return {
    conversations,
    loading,
    error,
    unreadCount,
    refetch,
    refreshConversations,
  };
};