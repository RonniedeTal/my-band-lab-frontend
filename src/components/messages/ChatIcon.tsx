import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useConversations } from '../../hooks/useConversations';
import { useAuth } from '../../hooks/useAuth';

export const ChatIcon: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useConversations();

  if (!user) return null;

  return (
    <Link
      to="/messages"
      className={cn(
        'relative p-2 rounded-lg transition-colors',
        'hover:bg-gray-800/50'
      )}
    >
      <MessageSquare className="w-5 h-5 text-gray-400" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? (
            <span className="absolute inset-0 flex items-center justify-center bg-red-500 rounded-full">
              <span className="text-[9px] font-bold text-white">9+</span>
            </span>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center bg-red-500 rounded-full">
              <span className="text-[10px] font-bold text-white">{unreadCount}</span>
            </span>
          )}
        </span>
      )}
    </Link>
  );
};