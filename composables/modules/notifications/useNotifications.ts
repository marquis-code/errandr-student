import { ref, computed } from 'vue'
import { notifications_api } from '@/api_factory/modules/notifications'

const notifications = ref<any[]>([])
const loading = ref(false)

export const useNotifications = () => {
  const unreadCount = computed(() =>
    notifications.value.filter((n: any) => !n.read).length
  )

  const fetchNotifications = async () => {
    loading.value = true
    try {
      const res = await notifications_api.getAll()
      if (res && (res as any).type !== 'ERROR' && res.data?.data) {
        notifications.value = res.data.data
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e)
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await notifications_api.markAsRead(notificationId)
      const idx = notifications.value.findIndex((n: any) => n.id === notificationId)
      if (idx !== -1) {
        notifications.value[idx].read = true
      }
    } catch (e) {
      console.error('Failed to mark as read:', e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notifications_api.markAllAsRead()
      notifications.value.forEach((n: any) => { n.read = true })
    } catch (e) {
      console.error('Failed to mark all as read:', e)
    }
  }

  const addNotification = (notification: any) => {
    if (notifications.value.some((n: any) => n.id === notification.id)) return
    notifications.value.unshift(notification)
  }

  // Web Push Subscription Logic
  const subscribeToPushNotifications = async (): Promise<any | null> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      const vapidPublicKey = 'BKlGd11ZrLqQkfprTOj1Gj6YWCriFD5GsMOUw2sq3mfNNiwI5OXUmovI8WdeJmzekCA3f8niAAgtT0krQPpk30I';
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      return subscription;
    } catch (e) {
      console.error('Failed to subscribe to push notifications:', e);
      return null;
    }
  }

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    subscribeToPushNotifications,
  }
}
