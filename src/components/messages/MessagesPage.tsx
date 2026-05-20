import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useConversations } from '../../hooks/useConversations';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { ConversationList } from './ConversationList';
import { webSocketService } from '../../services/websocket';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { conversations, loading, error, unreadCount, refreshConversations } = useConversations();
  const { isConnected, connect } = useWebSocket({ autoConnect: false });

  const isMainView = location.pathname === '/messages';

  useEffect(() => {
    if (user && !isConnected) {
      connect();
    }
  }, [user, isConnected, connect]);

  useEffect(() => {
    if (isConnected) {
      refreshConversations();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected && user) {
      webSocketService.subscribeQueue('queue/unread', () => {
        refreshConversations();
      });
    }
  }, [isConnected, user, refreshConversations]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageSquare className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Inicia sesión</h2>
        <p className="text-gray-400 mb-4">Para ver tus mensajes, necesitas iniciar sesión</p>
        <Link
          to="/login"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (isMainView) {
    return (
      <div className="flex flex-col h-full">
        <header className="px-4 py-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Mensajes</h1>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                {unreadCount} no leídos
              </span>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={refreshConversations}
                className="text-purple-400 hover:underline"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              activeConversationId={undefined}
            />
          )}
        </div>
      </div>
    );
  }

  return <Outlet />;
};