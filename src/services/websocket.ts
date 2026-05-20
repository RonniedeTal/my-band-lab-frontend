import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAuthToken } from './apollo';

const WS_URL = 'http://localhost:9000/ws';

class WebSocketService {
  private client: Client | null = null;
  private reconnectDelay = 3000;
  private subscriptions: Map<string, (message: IMessage) => void> = new Map();

  getClient(): Client | null {
    return this.client;
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  connect(onSuccess?: () => void, onError?: (error: Error) => void): void {
    if (this.client?.connected) {
      onSuccess?.();
      return;
    }

    const token = getAuthToken();
    if (!token) {
      onError?.(new Error('No authentication token'));
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log('🔌 WebSocket connected');
        this.resubscribeAll();
        onSuccess?.();
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers.message);
        onError?.(new Error(frame.headers.message));
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket error:', event);
        onError?.(new Error('WebSocket connection failed'));
      },
    });

    this.client.activate();
  }

  private resubscribeAll(): void {
    this.subscriptions.forEach((callback, destination) => {
      this.subscribe(destination, callback);
    });
  }

  subscribe(destination: string, callback: (message: IMessage) => void): void {
    if (!this.client?.connected) {
      console.warn('⚠️ Cannot subscribe: WebSocket not connected');
      return;
    }

    this.client.subscribe(destination, callback);
    this.subscriptions.set(destination, callback);
    console.log(`📡 Subscribed to: ${destination}`);
  }

  subscribeUser<T>(userId: number, callback: (data: T) => void): void {
    const destination = `/topic/messages/${userId}`;
    this.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data as T);
      } catch (error) {
        console.error('❌ Error parsing message:', error);
      }
    });
  }

  subscribeQueue<T>(destination: string, callback: (data: T) => void): void {
    this.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data as T);
      } catch (error) {
        console.error('❌ Error parsing message:', error);
      }
    });
  }

  unsubscribe(destination: string): void {
    if (!this.client?.connected) return;

    this.client.unsubscribe(destination);
    this.subscriptions.delete(destination);
    console.log(`📤 Unsubscribed from: ${destination}`);
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.subscriptions.clear();
      console.log('🔌 WebSocket disconnected');
    }
  }

  send(destination: string, body: unknown): void {
    if (!this.client?.connected) {
      console.warn('⚠️ Cannot send: WebSocket not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
    console.log(`📤 Sent to ${destination}:`, body);
  }

  sendChatMessage(receiverId: number, content: string): void {
    this.send('/app/chat.sendMessage', {
      receiverId,
      content,
    });
  }

  markAsRead(senderId: number): void {
    this.send(`/app/chat.markRead/${senderId}`, {});
  }

  getConversations(): void {
    this.send('/app/chat.getConversations', {});
  }

  getUnreadCount(): void {
    this.send('/app/chat.getUnreadCount', {});
  }
}

export const webSocketService = new WebSocketService();