<template>
  <div class="bg-gray-50 min-h-screen pb-24">
    <!-- Header -->
    <div class="bg-primary px-4 pt-12 pb-6 rounded-b-3xl shadow-sm text-white sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" class="p-2 hover:bg-white/20 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold">My Pool Orders</h1>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 font-medium">Loading your orders...</p>
    </div>

    <!-- Orders List -->
    <div v-else-if="orders.length > 0" class="p-4 space-y-4 mt-2">
      <div v-for="order in orders" :key="order._id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <p class="text-xs text-gray-500 mb-0.5">Order ID</p>
            <p class="font-bold text-gray-900 text-sm uppercase">#{{ order._id.slice(-6) }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500 mb-0.5">Total</p>
            <p class="font-bold text-primary">₦{{ (order.totalItemCost + order.deliveryFee).toLocaleString() }}</p>
          </div>
        </div>

        <!-- Milestone Tracker -->
        <div class="px-5 py-6">
          <div class="relative flex justify-between">
            <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full"></div>
            <div class="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" :style="`width: ${getMilestoneProgress(order.status)}%`"></div>
            
            <div v-for="(milestone, idx) in milestones" :key="milestone.value" class="relative z-10 flex flex-col items-center gap-2">
              <div class="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                   :class="hasReachedMilestone(order.status, milestone.value) ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-200 text-gray-400 border-2 border-white'">
                <svg v-if="hasReachedMilestone(order.status, milestone.value)" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span v-else class="text-[10px] font-bold">{{ idx + 1 }}</span>
              </div>
              <span class="text-[9px] font-bold text-center uppercase tracking-wider w-16" 
                    :class="hasReachedMilestone(order.status, milestone.value) ? 'text-primary' : 'text-gray-400'">
                {{ milestone.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-50 space-y-3">
          <div v-for="item in order.items" :key="item.itemId" class="flex gap-3 items-center">
            <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
              <img v-if="item.itemDetails?.imageUrl" :src="item.itemDetails?.imageUrl" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-900 leading-tight">{{ item.itemDetails?.name || 'Unknown Item' }}</h4>
              <p class="text-xs text-gray-500">{{ item.quantity }} x {{ item.itemDetails?.studentQuantity || 'Qty' }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">₦{{ (item.priceAtPurchase * item.quantity).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Delivery Details -->
        <div class="p-4 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-600 flex justify-between items-end">
          <div>
            <p><span class="font-medium">Delivery Slot:</span> {{ order.deliverySlot === 'morning' ? 'Morning (8am-12pm)' : 'Afternoon (1pm-5pm)' }}</p>
            <p v-if="order.proxyName"><span class="font-medium">Receiver:</span> {{ order.proxyName }} ({{ order.proxyPhone }})</p>
            <p v-else><span class="font-medium">Receiver:</span> You</p>
          </div>
          <span class="text-[10px] text-gray-400">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-8 flex flex-col items-center justify-center text-center space-y-3 mt-10">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 class="font-bold text-gray-900 text-lg">No Orders Yet</h3>
      <p class="text-sm text-gray-500 mb-4">You haven't participated in any market pool campaigns yet.</p>
      <button @click="$router.push('/market-pool')" class="bg-primary/10 text-primary font-bold px-6 py-2 rounded-lg">
        Explore Market Pool
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const orders = ref([])
const loading = ref(true)

const milestones = [
  { value: 'paid', label: 'Paid' },
  { value: 'procuring', label: 'Procuring' },
  { value: 'repackaging', label: 'Packing' },
  { value: 'out_for_delivery', label: 'On Way' },
  { value: 'delivered', label: 'Delivered' }
]

const hasReachedMilestone = (currentStatus, targetMilestone) => {
  const currentIndex = milestones.findIndex(m => m.value === currentStatus)
  const targetIndex = milestones.findIndex(m => m.value === targetMilestone)
  return currentIndex >= targetIndex
}

const getMilestoneProgress = (currentStatus) => {
  const currentIndex = milestones.findIndex(m => m.value === currentStatus)
  if (currentIndex === -1) return 0
  return (currentIndex / (milestones.length - 1)) * 100
}

const fetchOrders = async () => {
  try {
    loading.value = true
    const res = await api.get('/market-pool/orders')
    orders.value = res.data
  } catch (error) {
    console.error('Failed to fetch orders', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
