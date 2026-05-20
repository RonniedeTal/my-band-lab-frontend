import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMessages } from '../../hooks/useMessages';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { MessageBubble } from './MessageBubble';
import { webSocketService } from '../../services/websocket';
import { formatMessageTime } from '../../utils/date';

export const ConversationPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const partnerId = parseInt(userId || '0', 10);

  const { messages, loading, error, hasMore, loadMore, markAsRead } = useMessages({
    partnerId,
    autoConnect: false,
  });
  const { sendMessage, loading: sending, error: sendError } = useSendMessage();
  const { connect, isConnected } = useWebSocket({ autoConnect: false });

  const [messageText, setMessageText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user && !isConnected) {
      connect();
    }
  }, [user, isConnected, connect]);

  useEffect(() => {
    if (isConnected && partnerId) {
      webSocketService.subscribeUser(partnerId, () => {
        markAsRead();
      });
    }
  }, [isConnected, partnerId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (partnerId && messages.length > 0) {
      const hasUnreadMessages = messages.some(m => !m.isRead && m.senderId === partnerId);
      if (hasUnreadMessages) {
        markAsRead();
      }
    }
  }, [partnerId, messages, markAsRead]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!messageText.trim() || !user) return;

    const result = await sendMessage(partnerId, messageText.trim());

    if (result.success) {
      setMessageText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
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

  const partnerName = messages.length > 0
    ? messages.find(m => m.senderId === partnerId)?.senderName || messages[0].receiverName
    : 'Chat';

  const partnerImage = messages.length > 0
    ? messages.find(m => m.senderId === partnerId)?.senderImageUrl || messages[0].receiverImageUrl
    : undefined;

  return (
    <div className="flex flex-col h-full bg-gray-900/50">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/messages')}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>

          <Link to={`/artists/${partnerId}`} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center overflow-hidden">
              {partnerImage ? (
                <img src={partnerImage} alt={partnerName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-white">
                  {partnerName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-white font-semibold">{partnerName}</h2>
              <p className="text-xs text-gray-500">Ver perfil</p>
            </div>
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-2 min-w-[160px] z-20">
                <Link
                  to={`/artists/${partnerId}`}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50"
                  onClick={() => setShowMenu(false)}
                >
                  Ver perfil
                </Link>
                <button
                  onClick={() => {
                    markAsRead();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50"
                >
                  Marcar como leídos
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-red-400 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-purple-400 hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500">No hay mensajes aún</p>
            <p className="text-gray-600 text-sm">Envía un mensaje para comenzar la conversación</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === user.id;
              const showAvatar =
                index === 0 ||
                messages[index - 1].senderId !== message.senderId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  showAvatar={showAvatar}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}

        {hasMore && !loading && (
          <button
            onClick={loadMore}
            className="mx-auto block px-4 py-2 text-sm text-purple-400 hover:text-purple-300"
          >
            Cargar más mensajes
          </button>
        )}
      </div>

      <footer className="p-4 border-t border-gray-800 bg-gray-900/80">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            disabled={sending}
            className={cn(
              'flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white',
              'placeholder-gray-500 focus:outline-none focus:border-purple-500',
              'resize-none min-h-[48px] max-h-[120px]',
              sendError && 'border-red-500'
            )}
          />
          <button
            type="submit"
            disabled={!messageText.trim() || sending}
            className={cn(
              'p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white',
              'transition-all hover:opacity-90 hover:scale-105',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {sendError && (
          <p className="mt-2 text-xs text-red-400">{sendError}</p>
        )}
      </footer>
    </div>
  );
};