import { useState, useEffect, useCallback, useRef } from 'react';
import { webSocketService } from '@/services/websocket';
import { getAuthToken } from '@/services/apollo';
import { IMessage } from '@stomp/stompjs';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: (destination: string, callback: (message: IMessage) => void) => void;
  unsubscribe: (destination: string) => void;
  send: (destination: string, body: unknown) => void;
  error: Error | null;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionsRef = useRef<Map<string, (message: IMessage) => void>>(new Map());

  const connect = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      const err = new Error('No authentication token');
      setError(err);
      onError?.(err);
      return;
    }

    setIsConnecting(true);
    setError(null);

    webSocketService.connect(
      () => {
        setIsConnected(true);
        setIsConnecting(false);
        onConnect?.();

        subscriptionsRef.current.forEach((callback, destination) => {
          webSocketService.subscribe(destination, callback);
        });
      },
      (err) => {
        setIsConnected(false);
        setIsConnecting(false);
        setError(err);
        onError?.(err);
      }
    );
  }, [onConnect, onError]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
    onDisconnect?.();
  }, [onDisconnect]);

  const subscribe = useCallback((destination: string, callback: (message: IMessage) => void) => {
    subscriptionsRef.current.set(destination, callback);

    if (webSocketService.isConnected()) {
      webSocketService.subscribe(destination, callback);
    }
  }, []);

  const unsubscribe = useCallback((destination: string) => {
    subscriptionsRef.current.delete(destination);
    webSocketService.unsubscribe(destination);
  }, []);

  const send = useCallback((destination: string, body: unknown) => {
    webSocketService.send(destination, body);
  }, []);

  useEffect(() => {
    if (autoConnect && getAuthToken()) {
      connect();
    }

    return () => {
      if (isConnected) {
        webSocketService.disconnect();
      }
    };
  }, [autoConnect]);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
    error,
  };
};