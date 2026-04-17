import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { notificationService } from '../services/notification.service';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const { user, token } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, refresh } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    pushEnabled: true,
    emailEnabled: false,
    notifyOnFollow: true,
    notifyOnComment: true,
    notifyOnLike: true,
    notifyOnSongUpload: true,
  });

  useEffect(() => {
    if (user && token) {
      checkSubscription();
      loadPreferences();
    }
  }, [user, token]);

  const checkSubscription = async () => {
    const registration = await navigator.serviceWorker?.ready;
    const subscription = await registration?.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  };

  const loadPreferences = async () => {
    try {
      const prefs = await notificationService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSubscribe = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      await notificationService.subscribe();
      setIsSubscribed(true);
    }
  };

  const handleUnsubscribe = async () => {
    await notificationService.unsubscribe();
    setIsSubscribed(false);
  };

  const handleUpdatePreference = async (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    await notificationService.updatePreferences(newPreferences);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-20">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white font-semibold">Notificaciones</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Marcar todas como leídas
                  </button>
                )}
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  ⚙️
                </button>
              </div>
            </div>

            {showPreferences ? (
              <div className="p-3 max-h-96 overflow-y-auto">
                <h4 className="text-white text-sm font-semibold mb-3">Preferencias</h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Notificaciones push</span>
                    <button
                      onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        isSubscribed ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'
                      }`}
                    >
                      {isSubscribed ? 'Activadas' : 'Activar'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Cuando me siguen</span>
                    <button
                      onClick={() =>
                        handleUpdatePreference('notifyOnFollow', !preferences.notifyOnFollow)
                      }
                      className={`px-3 py-1 rounded-lg text-sm ${
                        preferences.notifyOnFollow
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {preferences.notifyOnFollow ? 'Activado' : 'Desactivado'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Cuando comentan</span>
                    <button
                      onClick={() =>
                        handleUpdatePreference('notifyOnComment', !preferences.notifyOnComment)
                      }
                      className={`px-3 py-1 rounded-lg text-sm ${
                        preferences.notifyOnComment
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {preferences.notifyOnComment ? 'Activado' : 'Desactivado'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Cuando dan like</span>
                    <button
                      onClick={() =>
                        handleUpdatePreference('notifyOnLike', !preferences.notifyOnLike)
                      }
                      className={`px-3 py-1 rounded-lg text-sm ${
                        preferences.notifyOnLike
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {preferences.notifyOnLike ? 'Activado' : 'Desactivado'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Nuevas canciones</span>
                    <button
                      onClick={() =>
                        handleUpdatePreference(
                          'notifyOnSongUpload',
                          !preferences.notifyOnSongUpload
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm ${
                        preferences.notifyOnSongUpload
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {preferences.notifyOnSongUpload ? 'Activado' : 'Desactivado'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">No hay notificaciones</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (!notif.isRead) markAsRead(notif.id);
                        // setIsOpen(false);
                      }}
                      className={`p-3 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer ${
                        !notif.isRead ? 'bg-purple-900/20' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{notif.title}</p>
                          <p className="text-gray-400 text-xs mt-1">{notif.body}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
