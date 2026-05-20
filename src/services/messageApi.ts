import { getAuthToken } from '@/services/apollo';
import { ConversationResponse, MessageResponse, PageResponse } from '@/types/message.types';

const API_BASE_URL = 'http://localhost:9000/api';

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const messageApi = {
  async sendMessage(receiverId: number, content: string): Promise<MessageResponse> {
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ receiverId, content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  },

  async getConversations(): Promise<ConversationResponse[]> {
    const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }

    return response.json();
  },

  async getConversation(
    partnerId: number,
    page = 0,
    size = 50
  ): Promise<PageResponse<MessageResponse>> {
    const response = await fetch(
      `${API_BASE_URL}/messages/conversation/${partnerId}?page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }

    return response.json();
  },

  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/messages/unread/count`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    const data = await response.json();
    return data.unreadCount as number;
  },

  async getUnreadFromUser(senderId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/messages/unread/from/${senderId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count from user');
    }

    const data = await response.json();
    return data.unreadCount as number;
  },

  async markAsRead(senderId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/messages/mark-read/${senderId}`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to mark messages as read');
    }

    const data = await response.json();
    return data.markedCount as number;
  },

  async markAllAsRead(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/messages/mark-all-read`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to mark all messages as read');
    }

    const data = await response.json();
    return data.markedCount as number;
  },

  async getMessageById(messageId: number): Promise<MessageResponse> {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch message');
    }

    return response.json();
  },
};