import { useState, useCallback } from 'react';
import { messageApi } from '@/services/messageApi';
import { webSocketService } from '@/services/websocket';
import { SendMessageResult } from '@/types/message.types';
import { useAuth } from './useAuth';

interface UseSendMessageReturn {
  sendMessage: (receiverId: number, content: string) => Promise<SendMessageResult>;
  sendMessageViaWebSocket: (receiverId: number, content: string) => void;
  loading: boolean;
  error: string | null;
}

export const useSendMessage = (): UseSendMessageReturn => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (receiverId: number, content: string): Promise<SendMessageResult> => {
      if (!user) {
        return { success: false, error: 'You must be logged in' };
      }

      if (receiverId === user.id) {
        return { success: false, error: 'Cannot send message to yourself' };
      }

      if (!content.trim()) {
        return { success: false, error: 'Message cannot be empty' };
      }

      setLoading(true);
      setError(null);

      try {
        const message = await messageApi.sendMessage(receiverId, content.trim());
        return { success: true, data: message };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const sendMessageViaWebSocket = useCallback(
    (receiverId: number, content: string) => {
      if (!user) {
        setError('You must be logged in');
        return;
      }

      if (receiverId === user.id) {
        setError('Cannot send message to yourself');
        return;
      }

      if (!content.trim()) {
        setError('Message cannot be empty');
        return;
      }

      webSocketService.sendChatMessage(receiverId, content.trim());
    },
    [user]
  );

  return {
    sendMessage,
    sendMessageViaWebSocket,
    loading,
    error,
  };
};