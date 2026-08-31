<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white px-4 py-3 shadow-sm sticky top-0 z-50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-bold text-gray-900 leading-tight">Checkout</h1>
      </div>
    </header>

    <div class="p-4" v-if="marketStore.cart.length > 0">
      <!-- Order Summary -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div class="p-4 border-b border-gray-100">
          <h2 class="font-bold text-gray-900">Your Pool Order</h2>
        </div>
        <div class="p-4 space-y-4">
          <div v-for="item in marketStore.cart" :key="item._id" class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="font-medium text-sm text-gray-900">{{ item.name }}</p>
                <p class="text-xs text-gray-500">{{ item.studentQuantity }} x {{ item.quantity }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-sm text-gray-900">₦{{ (item.appPrice * item.quantity).toLocaleString() }}</p>
              <div class="flex items-center gap-2 mt-1">
                <button @click="marketStore.updateQuantity(item._id, item.quantity - 1)" class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-gray-600">-</button>
                <span class="text-xs font-medium w-3 text-center">{{ item.quantity }}</span>
                <button @click="marketStore.updateQuantity(item._id, item.quantity + 1)" class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-gray-600">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Breakdown -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="p-4 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Items Total</span>
            <span class="font-medium text-gray-900">₦{{ marketStore.cartTotal.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Delivery Fee (Flat Rate)</span>
            <span class="font-medium text-gray-900">₦500</span>
          </div>
          <div class="pt-3 border-t border-gray-100 flex justify-between">
            <span class="font-bold text-gray-900">Total to Pay</span>
            <span class="font-bold text-primary text-lg">₦{{ (marketStore.cartTotal + 500).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Action -->
      <button 
        @click="processCheckout" 
        :disabled="loading"
        class="w-full bg-primary text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-70"
      >
        <div v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span v-else>Pay from Wallet & Join Pool</span>
      </button>
      <p class="text-center text-[10px] text-gray-400 mt-3 px-4">
        By joining the pool, you agree to our Market Pool terms. Delivery will be made on Saturday.
      </p>
    </div>

    <!-- Empty Cart -->
    <div v-else class="p-8 flex flex-col items-center justify-center text-center space-y-3 mt-10">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="font-bold text-gray-900 text-lg">Your Pool Cart is Empty</h3>
      <p class="text-sm text-gray-500 mb-4">Add some items from the market pool to proceed with checkout.</p>
      <button @click="$router.push('/market-pool')" class="bg-primary/10 text-primary font-bold px-6 py-2 rounded-lg">
        Browse Pool
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketPoolStore } from '~/stores/marketPool'

const router = useRouter()
const marketStore = useMarketPoolStore()
const loading = ref(false)

const processCheckout = async () => {
  try {
    loading.value = true
    await marketStore.checkout()
    alert('Successfully joined the Market Pool! Your order will be delivered on Saturday.')
    router.push('/market-pool')
  } catch (error) {
    alert(error.response?.data?.message || 'Checkout failed. Please ensure you have sufficient wallet balance.')
  } finally {
    loading.value = false
  }
}
</script>
