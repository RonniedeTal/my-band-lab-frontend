import React from 'react';
import { cn } from '../../utils/cn';
import type { MessageResponse } from '../../types/message.types';
import { formatDistanceToNow } from '../../utils/date';

interface MessageBubbleProps {
  message: MessageResponse;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showAvatar = true,
}) => {
  const timeAgo = message.createdAt
    ? formatDistanceToNow(new Date(message.createdAt))
    : '';

  return (
    <div className={cn('flex gap-2 mb-3', isOwnMessage && 'flex-row-reverse')}>
      {showAvatar && !isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
          {message.senderImageUrl ? (
            <img
              src={message.senderImageUrl}
              alt={message.senderName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-white">
              {message.senderName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'max-w-[75%] rounded-xl px-4 py-2 relative group',
          isOwnMessage
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
            : 'bg-gray-800/80 border border-gray-700 text-gray-200 rounded-bl-sm'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

        <div
          className={cn(
            'flex items-center gap-1 mt-1',
            isOwnMessage ? 'justify-end' : 'justify-start'
          )}
        >
          {!message.isRead && isOwnMessage && (
            <span className="text-[10px] text-purple-200">Enviado</span>
          )}
          {message.isRead && isOwnMessage && (
            <span className="text-[10px] text-purple-200">✓✓ Leído</span>
          )}
          <span
            className={cn(
              'text-[10px]',
              isOwnMessage ? 'text-purple-200' : 'text-gray-500'
            )}
          >
            {timeAgo}
          </span>
        </div>

        <div
          className={cn(
            'absolute top-0 w-3 h-3',
            isOwnMessage
              ? '-right-1.5 border-r-8 border-l-0 border-t-8 border-b-8 border-t-purple-600 border-r-transparent border-b-transparent'
              : '-left-1.5 border-l-8 border-r-0 border-t-8 border-b-8 border-t-gray-800 border-l-transparent border-b-transparent'
          )}
        />
      </div>

      {showAvatar && isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
          {message.senderImageUrl ? (
            <img
              src={message.senderImageUrl}
              alt={message.senderName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-white">
              {message.senderName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}
    </div>
  );
};