import { onMounted, onBeforeUnmount } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'

const LISTENERS_KEY = 'realtime_notification_listeners'

const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.wav')
    audio.play().catch(e => console.warn('Audio playback failed', e))
  } catch (error) {
    // ignore
  }
}

export const useRealtimeNotifications = () => {
  const { showToast } = useCustomToast()
  const { socket, connectSocket } = useRealtimeSocket()
  const { addNotification } = useNotifications()
  const listenersAttached = useState<boolean>(LISTENERS_KEY, () => false)

  const handleNotification = (payload: any) => {
    if (!payload) return

    playNotificationSound()
    addNotification({
      id: payload.id || `notif_${Date.now()}`,
      ...payload
    })

    showToast({
      title: payload.title || 'Notification',
      message: payload.message || payload.type || 'You have a new update',
      toastType: payload.priority === 'high' ? 'warning' : 'info',
      duration: 5000,
    })
  }

  const handleAudit = (payload: any) => {
    if (!payload) return

    playNotificationSound()

    showToast({
      title: payload.action ? `Audit: ${payload.action}` : 'Audit Update',
      message: payload.description || 'A new audit log was recorded',
      toastType: 'info',
      duration: 5000,
    })
  }

  const handleOrderAccepted = (payload: any) => {
    if (!payload) return

    playNotificationSound()
    addNotification({
      id: payload.id || `accepted_${Date.now()}`,
      title: 'Order Accepted',
      body: `Your order #${payload.orderNumber} has been accepted`,
      ...payload
    })

    showToast({
      title: '✅ Order Accepted!',
      message: `${payload.errander?.firstName || 'A rider'} has accepted your order #${payload.orderNumber}!`,
      toastType: 'success',
      duration: 6000,
    })
  }

  const handleOrderStatusUpdate = (payload: any) => {
    if (!payload) return

    playNotificationSound()
    addNotification({
      id: payload.id || `status_${Date.now()}`,
      title: 'Order Update',
      body: `Order #${payload.orderNumber} status changed`,
      ...payload
    })

    showToast({
      title: '📦 Order Update',
      message: `Your order #${payload.orderNumber} is now ${payload.status?.replace(/_/g, ' ').toLowerCase()}`,
      toastType: 'info',
      duration: 6000,
    })
  }

  onMounted(() => {
    connectSocket()

    if (listenersAttached.value || !socket.value) return
    listenersAttached.value = true

    socket.value.on('notification:new', handleNotification)
    socket.value.on('audit:log', handleAudit)
    socket.value.on('notification:order-accepted', handleOrderAccepted)
    socket.value.on('notification:order-status-update', handleOrderStatusUpdate)
  })

  onBeforeUnmount(() => {
    if (!socket.value || !listenersAttached.value) return

    socket.value.off('notification:new', handleNotification)
    socket.value.off('audit:log', handleAudit)
    socket.value.off('notification:order-accepted', handleOrderAccepted)
    socket.value.off('notification:order-status-update', handleOrderStatusUpdate)
    listenersAttached.value = false
  })
}
