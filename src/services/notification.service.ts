// src/services/notification.service.ts

export interface NotificationSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  isRead: boolean;
  notificationType: string;
  referenceId?: number;
  createdAt: string;
}

class NotificationService {
  private isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notificaciones no soportadas en este navegador');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Versión simplificada - sin VAPID por ahora
  async subscribe(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notificaciones no soportadas');
      return false;
    }

    console.log('Notificaciones: Suscripción pendiente de configuración VAPID');
    // TODO: Implementar cuando se generen las VAPID keys en backend
    return true;
  }

  async unsubscribe(): Promise<boolean> {
    console.log('Notificaciones: Desuscripción pendiente');
    return true;
  }

  async getNotifications(
    page: number = 0,
    size: number = 20
  ): Promise<{ notifications: Notification[]; totalPages: number }> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(
      `http://localhost:9000/api/notifications?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    return {
      notifications: data.content || [],
      totalPages: data.totalPages || 0,
    };
  }

  async getUnreadCount(): Promise<number> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('http://localhost:9000/api/notifications/unread/count', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.count || 0;
  }

  async markAsRead(notificationId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    await fetch(`http://localhost:9000/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async markAllAsRead(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    await fetch('http://localhost:9000/api/notifications/read-all', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteNotification(notificationId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    await fetch(`http://localhost:9000/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getPreferences(): Promise<any> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('http://localhost:9000/api/notifications/preferences', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }

  async updatePreferences(preferences: any): Promise<void> {
    const token = localStorage.getItem('auth_token');
    await fetch('http://localhost:9000/api/notifications/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });
  }
}

export const notificationService = new NotificationService();
