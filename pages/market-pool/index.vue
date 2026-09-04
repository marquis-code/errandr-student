<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white px-4 py-3 shadow-sm sticky top-0 z-50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/')" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-900 leading-tight">Market Pool</h1>
          <p class="text-[10px] text-green-600 font-medium flex items-center gap-1 uppercase tracking-wide">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Pool is Open
          </p>
        </div>
      </div>
      <button @click="$router.push('/market-pool/checkout')" class="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span v-if="cartStore.itemCount > 0" class="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
          {{ cartStore.itemCount }}
        </span>
      </button>
    </header>

    <!-- Banner -->
    <div class="bg-gradient-to-r from-primary to-green-600 p-5 text-white">
      <h2 class="text-xl font-extrabold mb-1">Buy Bulk, Pay Less</h2>
      <p class="text-xs text-white/90 mb-4 leading-relaxed">
        Join this week's pool to get food items at wholesale prices. We buy in bulk and repackage for you.
      </p>
      <div class="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium">Pool Closes In:</span>
          <span class="text-sm font-bold font-mono tracking-widest bg-white text-primary px-2 py-1 rounded">
            2D : 14H : 30M
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6 flex flex-col items-center justify-center space-y-4">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 font-medium">Loading Market Pool...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!campaign" class="p-8 flex flex-col items-center justify-center text-center space-y-3">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 class="font-bold text-gray-900 text-lg">Pool is Closed</h3>
      <p class="text-sm text-gray-500">The market pool is currently closed. We usually open the pool on Mondays at 8 AM. Check back then!</p>
    </div>

    <!-- Products List -->
    <div v-else class="p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-800">Available Items</h3>
        <span class="text-xs text-gray-500">{{ items.length }} items</span>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div v-for="item in items" :key="item._id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
          <div class="aspect-square bg-gray-100 relative overflow-hidden">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <!-- Standard Quantity Badge -->
            <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md">
              {{ item.studentQuantity }}
            </div>
          </div>
          
          <div class="p-3 flex-1 flex flex-col">
            <h4 class="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-1">{{ item.name }}</h4>
            <p class="text-[10px] text-gray-500 line-clamp-2 mb-2 flex-1">{{ item.description }}</p>
            
            <div class="flex items-end justify-between mt-auto pt-2 border-t border-gray-50">
              <div>
                <p class="text-[9px] text-gray-400 line-through">₦{{ (item.appPrice * 1.3).toLocaleString() }}</p>
                <p class="text-sm font-extrabold text-primary">₦{{ item.appPrice.toLocaleString() }}</p>
              </div>
              <button 
                @click="addToCart(item)"
                class="bg-primary/10 hover:bg-primary/20 text-primary p-1.5 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Custom Request CTA -->
      <div class="mt-8 p-5 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
        <h3 class="font-bold text-gray-900 mb-1">Don't see what you want?</h3>
        <p class="text-xs text-gray-600 mb-4">Request a custom item and we'll try to add it to the pool or source it for you.</p>
        <button @click="showRequestModal = true" class="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto">
          Request Custom Item
        </button>
      </div>
    </div>

    <!-- Request Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" @click="showRequestModal = false">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" @click.stop>
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Request Custom Item</h3>
          <button @click="showRequestModal = false" class="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Item Name</label>
            <input v-model="requestForm.itemName" type="text" placeholder="e.g. Sweet Potatoes" class="w-full bg-gray-50 text-gray-900 rounded-xl focus:ring-primary px-3 py-2.5 border border-gray-200 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Target Quantity/Measurement</label>
            <input v-model="requestForm.desiredQuantity" type="text" placeholder="e.g. 1 Paint Bucket" class="w-full bg-gray-50 text-gray-900 rounded-xl focus:ring-primary px-3 py-2.5 border border-gray-200 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Additional Details</label>
            <textarea v-model="requestForm.description" placeholder="Any specific brand or preference?" class="w-full bg-gray-50 text-gray-900 rounded-xl focus:ring-primary px-3 py-2.5 border border-gray-200 outline-none resize-none h-20"></textarea>
          </div>
        </div>
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button @click="showRequestModal = false" class="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
          <button @click="submitRequest" :disabled="submittingRequest" class="flex-1 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm disabled:opacity-50">
            {{ submittingRequest ? 'Sending...' : 'Submit Request' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMarketPoolStore } from '~/stores/marketPool'

const marketStore = useMarketPoolStore()
const loading = ref(true)
const campaign = ref(null)
const items = ref([])

onMounted(async () => {
  try {
    loading.value = true
    const data = await marketStore.fetchActiveCampaign()
    if (data) {
      campaign.value = data.campaign
      items.value = data.items
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

// Quick inline cart simulation for the component, wait I should use a real store.
const cartStore = ref({ itemCount: 0 }) 
const addToCart = (item) => {
  marketStore.addToCart(item)
  cartStore.value.itemCount = marketStore.cart.length
  alert(`Added ${item.name} to cart.`)
}

import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const showRequestModal = ref(false)
const submittingRequest = ref(false)
const requestForm = ref({ itemName: '', desiredQuantity: '', description: '' })

const submitRequest = async () => {
  if (!requestForm.value.itemName || !requestForm.value.desiredQuantity) {
    alert('Please provide the item name and desired quantity.')
    return
  }
  
  try {
    submittingRequest.value = true
    await api.post(`/market-pool/campaigns/${campaign.value._id}/custom-requests`, requestForm.value)
    alert('Request submitted successfully! We will review it shortly.')
    showRequestModal.value = false
    requestForm.value = { itemName: '', desiredQuantity: '', description: '' }
  } catch (error) {
    console.error('Failed to submit request', error)
    alert('Failed to submit request. Please try again.')
  } finally {
    submittingRequest.value = false
  }
}
</script>
