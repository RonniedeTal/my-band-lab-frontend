import { useState, useEffect, useCallback } from 'react';
import { notificationService, Notification } from '../services/notification.service';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await notificationService.getNotifications(page, 20);
      setNotifications(result.notifications);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, []);

  const markAsRead = async (notificationId: number) => {
    await notificationService.markAsRead(notificationId);
    await loadNotifications();
    await loadUnreadCount();
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    await loadNotifications();
    await loadUnreadCount();
  };

  const deleteNotification = async (notificationId: number) => {
    await notificationService.deleteNotification(notificationId);
    await loadNotifications();
    await loadUnreadCount();
  };

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [loadNotifications, loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    page,
    totalPages,
    setPage,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications,
  };
};
