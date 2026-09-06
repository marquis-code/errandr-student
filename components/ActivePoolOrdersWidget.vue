<template>
  <div v-if="activeOrders.length > 0" class="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 border-b border-emerald-700 shadow-sm relative z-50">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
      <div class="flex items-center gap-3 text-white">
        <div class="bg-white/20 p-2 rounded-full flex-shrink-0 animate-pulse">
          <Package class="w-5 h-5" />
        </div>
        <div class="text-center sm:text-left">
          <p class="font-bold text-sm tracking-wide">You have {{ activeOrders.length }} active Market Pool {{ activeOrders.length === 1 ? 'order' : 'orders' }}!</p>
          <p class="text-[11px] font-medium text-emerald-100 mt-0.5">Track your items before delivery</p>
        </div>
      </div>
      
      <button 
        @click="$router.push('/market-pool/orders')"
        class="bg-white text-emerald-700 font-bold px-5 py-2 text-sm rounded-xl hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
      >
        Track Orders <ArrowRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Package, ArrowRight } from 'lucide-vue-next'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const activeOrders = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/market-pool/orders')
    if (res.data && Array.isArray(res.data)) {
      activeOrders.value = res.data.filter(order => order.status !== 'delivered' && order.status !== 'cancelled')
    }
  } catch (err) {
    console.error('Failed to fetch pool orders', err)
  }
})
</script>
