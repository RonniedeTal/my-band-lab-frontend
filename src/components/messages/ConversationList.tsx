import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import type { ConversationResponse } from '../../types/message.types';
import { formatConversationTime } from '../../utils/date';
import { MessageSquare } from 'lucide-react';

interface ConversationItemProps {
  conversation: ConversationResponse;
  isActive?: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive = false,
}) => {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Link
      to={`/messages/${conversation.partnerId}`}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
        'hover:bg-gray-800/50',
        isActive && 'bg-purple-600/20 border border-purple-500/30',
        !isActive && 'border border-transparent'
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          {conversation.partnerImageUrl ? (
            <img
              src={conversation.partnerImageUrl}
              alt={conversation.partnerName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-white">
              {conversation.partnerName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4
            className={cn(
              'text-sm font-medium truncate',
              hasUnread ? 'text-white' : 'text-gray-300'
            )}
          >
            {conversation.partnerName}
          </h4>
          {conversation.lastMessageTime && (
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatConversationTime(conversation.lastMessageTime)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <p
            className={cn(
              'text-xs truncate flex-1',
              hasUnread ? 'text-gray-300' : 'text-gray-500'
            )}
          >
            {conversation.lastMessageContent || 'Sin mensajes'}
          </p>
          {conversation.totalMessages > 0 && (
            <span className="text-xs text-gray-600 flex-shrink-0">
              {conversation.totalMessages}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface ConversationListProps {
  conversations: ConversationResponse[];
  activeConversationId?: number;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="w-12 h-12 text-gray-600 mb-3" />
        <h3 className="text-gray-400 font-medium mb-1">No hay conversaciones</h3>
        <p className="text-gray-500 text-sm">
          Contacta a un artista para iniciar una conversación
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.partnerId}
          conversation={conversation}
          isActive={activeConversationId === conversation.partnerId}
        />
      ))}
    </div>
  );
};