<template>
  <section class="py-16 lg:py-24 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="mb-12 text-center lg:text-left">
        <h2 class="text-2xl lg:text-4xl font-black text-gray-900 tracking-tighter mb-3">
          Campus delivery, <span class="text-parentPrimary italic">redefined.</span>
        </h2>
        <p class="text-gray-500 font-bold text-sm lg:text-base max-w-xl">
          From your favorite vendors straight to your hostel. No stress, just good vibes and great food.
        </p>
      </div>

      <!-- Accordion Cards -->
      <div class="flex gap-3 lg:gap-4 h-[400px] lg:h-[500px]">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group"
          :class="[
            activeCard === index ? 'flex-[4]' : 'flex-[0.8] lg:flex-[1]'
          ]"
          @mouseenter="activeCard = index"
          @click="activeCard = index"
        >
          <!-- Background Image -->
          <img 
            :src="card.image" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            alt="" 
          />
          
          <!-- Overlay Gradient -->
          <div 
            class="absolute inset-0 transition-all duration-700"
            :class="activeCard === index 
              ? 'bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent' 
              : 'bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-gray-900/30'"
          ></div>

          <!-- Collapsed State: Vertical Label -->
          <div 
            class="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
            :class="activeCard === index ? 'opacity-0 pointer-events-none' : 'opacity-100'"
          >
            <div class="flex flex-col items-center gap-4">
              <div class="w-10 h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <span class="text-xl lg:text-2xl">{{ card.icon }}</span>
              </div>
              <span 
                class="text-white font-black text-sm lg:text-base tracking-widest uppercase"
                style="writing-mode: vertical-lr; text-orientation: mixed;"
              >
                {{ card.label }}
              </span>
            </div>
          </div>

          <!-- Expanded State: Full Content -->
          <div 
            class="absolute inset-0 flex flex-col justify-end p-6 lg:p-10 transition-all duration-700"
            :class="activeCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'"
          >
            <div class="w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-4">
              <span class="text-2xl lg:text-3xl">{{ card.icon }}</span>
            </div>
            <h3 class="text-2xl lg:text-3xl font-black text-white tracking-tight mb-2">{{ card.label }}</h3>
            <p class="text-white/70 text-xs lg:text-sm font-bold leading-relaxed max-w-sm">{{ card.description }}</p>
            <div class="mt-4 flex items-center gap-3">
              <div class="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white text-[10px] font-black tracking-widest uppercase hover:bg-white/20 transition-colors">
                Explore →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const activeCard = ref(2) // Start with middle card expanded

const cards = [
  {
    label: 'Restaurants',
    icon: '🍽️',
    description: 'Order from the best campus restaurants and eateries. Rice, beans, swallow — everything you love.',
    get image() { return props.images[0] || '' }
  },
  {
    label: 'Fast Food',
    icon: '🍔',
    description: 'Burgers, shawarma, pizza and more. Fast, hot, and delivered to your door.',
    get image() { return props.images[1] || '' }
  },
  {
    label: 'Local Markets',
    icon: '🥬',
    description: 'Fresh produce, grains, proteins, fruits, and other groceries from local markets closest to you.',
    get image() { return props.images[2] || '' }
  },
  {
    label: 'Snacks & Drinks',
    icon: '🧃',
    description: 'Chinchin, puff-puff, zobo, chapman — all the campus favorites in one place.',
    get image() { return props.images[3] || '' }
  }
]
</script>

<style scoped>
</style>
