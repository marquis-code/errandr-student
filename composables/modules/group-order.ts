import { ref, computed, watch, onUnmounted } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCart } from '@/composables/modules/cart'
import { useUser } from '@/composables/modules/auth/user'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useToast } from '@/composables/useToast'

const groupOrder = ref<any>(null)
const activeCode = ref<string | null>(null)
const isLoading = ref(false)

export const useGroupOrder = () => {
  const cart = useCart()
  const { user } = useUser()
  const { socket, isConnected } = useRealtimeSocket()
  const { showToast } = useToast()


  const isHost = computed(() => groupOrder.value?.host?._id === user.value?._id || groupOrder.value?.host === user.value?._id)
  
  const createGroupOrder = async (vendorId: string, name?: string) => {
    isLoading.value = true
    try {
      const { data } = await api.post('/group-orders', { vendorId, name })
      groupOrder.value = data
      activeCode.value = data.inviteCode
      if (socket.value) {
        socket.value.emit('join-room', data.inviteCode)
      }
      return data
    } finally {
      isLoading.value = false
    }
  }

  const joinGroupOrder = async (code: string) => {
    isLoading.value = true
    try {
      const { data } = await api.post(`/group-orders/join/${code}`)
      groupOrder.value = data
      activeCode.value = code
      if (socket.value) {
        socket.value.emit('join-room', code)
      }
      return data
    } finally {
      isLoading.value = false
    }
  }

  const fetchGroupOrder = async (code: string) => {
    try {
      const { data } = await api.get(`/group-orders/${code}`)
      groupOrder.value = data
      activeCode.value = code
      if (socket.value) {
        socket.value.emit('join-room', code)
      }
      return data
    } catch (e) {
      activeCode.value = null
      groupOrder.value = null
      throw e
    }
  }

  const updateItems = async (items: any[]) => {
    if (!activeCode.value) return
    try {
      const { data } = await api.patch(`/group-orders/${activeCode.value}/items`, { items })
      groupOrder.value = data
    } catch (e) {
      console.error('Failed to update group items', e)
    }
  }

  const toggleReady = async (isReady: boolean) => {
    if (!activeCode.value) return
    try {
      const { data } = await api.patch(`/group-orders/${activeCode.value}/toggle-ready`, { isReady })
      groupOrder.value = data
    } catch (e) {
      console.error('Failed to toggle ready state', e)
    }
  }

  const checkout = async (paymentReference?: string) => {
    if (!activeCode.value) return
    isLoading.value = true
    try {
      const { data } = await api.post(`/group-orders/${activeCode.value}/checkout`, { paymentReference })
      groupOrder.value = data
      return data
    } finally {
      isLoading.value = false
    }
  }

  const leaveGroupOrder = () => {
    if (activeCode.value && socket.value) {
      socket.value.emit('leave-room', activeCode.value)
    }
    groupOrder.value = null
    activeCode.value = null
  }

  const syncWithCart = (vendorId: string) => {
    const packsByVendor = cart.getPacksByVendor(vendorId)
    // In Nuxt/Vue 3, getPacksByVendor might return a ref or a simple array
    const packs = packsByVendor.value || packsByVendor
    
    if (packs && packs.length > 0) {
      // Find the pack that belongs to the current user (if multiple)
      // For now, use the first pack since most users only have one active checkout
      const myItems = packs[0].items.map(item => ({
        productId: item.productId || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations || [],
        image: item.image || ''
      }))
      updateItems(myItems)
    }
  }

  // Socket event listeners
  const setupEventListeners = () => {
    if (!socket.value) return

    socket.value.on('group-order-updated', (data: any) => {
      groupOrder.value = data
    })

    socket.value.on('member-joined', (user: any) => {
      if (user && user._id !== user.value?._id) {
        showToast(`New Participant: ${user.firstName} joined the group order!`, 'info')
      }
    })

    socket.value.on('items-updated', (data: { userId: string, items: any[], total: number }) => {
      if (groupOrder.value) {
        const participant = groupOrder.value.participants.find((p: any) => p.user._id === data.userId || p.user === data.userId)
        if (participant) {
          participant.items = data.items
          participant.total = data.total
        }
      }
    })

    socket.value.on('status-changed', (status: string) => {
      if (groupOrder.value) {
        groupOrder.value.status = status
        let message = ''
        if (status === 'locked') message = 'The host has locked the order. No more changes allowed.'
        if (status === 'completed') message = 'Success! The group order has been placed.'
        if (status === 'cancelled') message = 'The group order was cancelled by the host.'

        if (message) {
          showToast(`Group Order Status: ${message}`, status === 'completed' ? 'success' : 'warning')
        }
      }
    })
  }

  const cleanupEventListeners = () => {
    if (!socket.value) return
    socket.value.off('group-order-updated')
    socket.value.off('member-joined')
    socket.value.off('items-updated')
    socket.value.off('status-changed')
  }

  // Auto-connect socket if code is available
  watch([socket, activeCode], ([newSocket, newCode]) => {
    if (newSocket && newCode) {
      newSocket.emit('join-room', newCode)
      setupEventListeners()
    }
  }, { immediate: true })

  return {
    groupOrder,
    activeCode,
    isLoading,
    isHost,
    createGroupOrder,
    joinGroupOrder,
    fetchGroupOrder,
    updateItems,
    toggleReady,
    checkout,
    leaveGroupOrder,
    syncWithCart,
    cleanupEventListeners
  }
}
