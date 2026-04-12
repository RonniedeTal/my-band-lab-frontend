import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { Notification, NotificationType } from '../context/NotificationContext';

interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-400" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-400" />;
  }
};

const getStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-500/10 border-green-500/20';
    case 'error':
      return 'bg-red-500/10 border-red-500/20';
    case 'warning':
      return 'bg-yellow-500/10 border-yellow-500/20';
    case 'info':
      return 'bg-blue-500/10 border-blue-500/20';
  }
};

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <div
      className={`${getStyles(notification.type)} backdrop-blur-sm border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md animate-slide-in`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon(notification.type)}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{notification.title}</h4>
          {notification.message && (
            <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
