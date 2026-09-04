<template>
  <div v-if="campaign" class="bg-gradient-to-r from-[#FF5C1A] to-[#E54D12] text-white shadow-md border-b border-[#D8450F] relative overflow-hidden z-50">
    <div class="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center gap-4">
      
      <!-- CTA Section -->
      <div class="flex-shrink-0 flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
        <div class="bg-white/20 p-2 rounded-full animate-pulse">
          <ShoppingCart class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="font-black text-lg sm:text-xl tracking-tight leading-none uppercase italic text-[#FFE066] drop-shadow-sm">
            Campus Wholesale Pool
          </h3>
          <p class="text-[11px] sm:text-xs font-bold text-white/90 mt-1 uppercase tracking-widest">
            Don't buy retail. Buy Bulk & Save 40%
          </p>
        </div>
      </div>

      <!-- Carousel Section -->
      <div class="flex-1 overflow-hidden w-full relative group hidden sm:block h-[60px]">
        <!-- Mask for smooth fade edges -->
        <div class="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#FF5C1A] to-transparent z-10"></div>
        <div class="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#E54D12] to-transparent z-10"></div>
        
        <div class="flex items-center gap-3 animate-carousel hover:[animation-play-state:paused] min-w-max absolute top-1/2 -translate-y-1/2">
          <!-- Render items twice for seamless loop -->
          <div v-for="item in [...campaign.items, ...campaign.items]" :key="Math.random().toString()" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 flex items-center gap-3 hover:bg-white/20 transition-all cursor-pointer">
            <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-xl shadow-inner shrink-0">
              {{ getEmoji(item.name) }}
            </div>
            <div class="flex flex-col pr-2">
              <span class="text-sm font-bold truncate max-w-[120px]">{{ item.name }}</span>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black text-[#FFE066]">₦{{ item.appPrice.toLocaleString() }}</span>
                <span class="text-[10px] text-white/60 line-through">₦{{ (item.appPrice * 1.3).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <NuxtLink to="/market-pool" class="flex-shrink-0 w-full md:w-auto bg-white text-[#FF5C1A] font-extrabold px-6 py-3 md:py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
        Join the Pool <ArrowRight class="w-4 h-4" />
      </NuxtLink>

    </div>
  </div>
</template>

<script setup>
import { ShoppingCart, ArrowRight } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const campaign = ref(null)

const getEmoji = (name) => {
  const n = name.toLowerCase()
  if (n.includes('rice')) return '🍚'
  if (n.includes('bean')) return '🫘'
  if (n.includes('egg')) return '🥚'
  if (n.includes('garri')) return '🥣'
  if (n.includes('indomie') || n.includes('noodle')) return '🍜'
  return '📦'
}

onMounted(async () => {
  try {
    const res = await api.get('/market-pool/active')
    if (res.data?.campaign) {
      campaign.value = {
        ...res.data.campaign,
        items: res.data.items || []
      }
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
@keyframes carousel {
  0% { transform: translate(0, -50%); }
  100% { transform: translate(-50%, -50%); }
}
.animate-carousel {
  animation: carousel 25s linear infinite;
}
</style>
