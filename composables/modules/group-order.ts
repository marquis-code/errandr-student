import { ref, computed } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCart } from './cart'
import { useUser } from './auth/user'

const groupOrder = ref<any>(null)
const activeCode = ref<string | null>(null)
const isLoading = ref(false)

export const useGroupOrder = () => {
  const cart = useCart()
  const { user } = useUser()

  const isHost = computed(() => groupOrder.value?.host?._id === user.value?._id || groupOrder.value?.host === user.value?._id)
  
  const createGroupOrder = async (vendorId: string, name?: string) => {
    isLoading.value = true
    try {
      const { data } = await api.post('/group-orders', { vendorId, name })
      groupOrder.value = data
      activeCode.value = data.inviteCode
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

  const leaveGroupOrder = () => {
    groupOrder.value = null
    activeCode.value = null
  }

  const syncWithCart = (vendorId: string) => {
    // This function will be called when the local cart changes
    // to push updates to the group order
    const packs = cart.getPacksByVendor(vendorId).value
    if (packs.length > 0) {
      const myItems = packs[0].items // For now, sync the first pack
      updateItems(myItems)
    }
  }

  return {
    groupOrder,
    activeCode,
    isLoading,
    isHost,
    createGroupOrder,
    joinGroupOrder,
    fetchGroupOrder,
    updateItems,
    leaveGroupOrder,
    syncWithCart
  }
}
