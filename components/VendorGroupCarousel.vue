<template>
  <section class="py-12 bg-white overflow-hidden border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="flex items-end justify-between">
        <div>
          <div class="inline-flex items-center gap-2 text-parentPrimary font-bold text-sm mb-2 text-center">
            <component :is="icon" class="w-4 h-4" /> {{ subtitle }}
          </div>
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 -tight">{{ title }}</h2>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/vendors" class="text-sm font-bold text-parentPrimary hover:underline underline-offset-4 hidden sm:block">View All Vendors &rarr;</NuxtLink>
          <div class="flex gap-2">
            <button @click="scrollCarousel('left')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm bg-white z-10">
              <ChevronLeft class="w-5 h-5" />
            </button>
            <button @click="scrollCarousel('right')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm bg-white z-10">
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <NuxtLink to="/vendors" class="text-sm font-bold text-parentPrimary hover:underline underline-offset-4 sm:hidden mt-4 inline-block">View All Vendors &rarr;</NuxtLink>
    </div>

    <div class="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-0">
      <div :id="carouselId" class="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
        
        <!-- Skeleton loaders -->
        <template v-if="loading">
          <div v-for="i in 4" :key="i" class="min-w-[280px] sm:min-w-[320px] h-[280px] bg-gray-50 rounded-3xl animate-pulse shadow-sm border border-gray-100 snap-start shrink-0" />
        </template>

        <!-- NO VENDORS (Only for all vendors block, else hide section?) We just show empty text -->
        <div v-else-if="vendors.length === 0" class="min-w-full px-8 py-10 flex items-center justify-center text-gray-400 font-medium">
          No vendors found for this section.
        </div>

        <template v-else>
          <div
            v-for="vendor in vendors"
            :key="vendor._id"
            @click="$emit('select-vendor', vendor)"
            class="min-w-[280px] sm:min-w-[320px] w-[280px] sm:w-[320px] snap-start shrink-0 group cursor-pointer relative flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div class="relative h-[180px] w-full overflow-hidden">
              <!-- SINGLE VENDOR CLOSED STATE -->
              <template v-if="!vendor.isOpen">
                <img
                  :src="vendor.banner || vendor.image || vendor.logo || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop'"
                  class="w-full h-full object-cover grayscale opacity-50"
                  alt="Vendor Banner"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-gray-900/10"></div>
                <div class="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(135deg,#6366f1_0px,#6366f1_4px,#1e1e2e_4px,#1e1e2e_10px)]"></div>
                <div class="absolute top-4 left-4">
                  <div v-if="vendor.logo" class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10" style="filter: grayscale(0.5) brightness(0.7)">
                    <img :src="vendor.logo" class="w-full h-full object-cover bg-white" alt="Store Logo" />
                  </div>
                  <div v-else :class="`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-medium text-white border-2 border-white/10 ${getVendorColor(vendor.storeName)}`"
                    style="filter: grayscale(0.5) brightness(0.7)">
                    {{ getInitials(vendor.storeName) }}
                  </div>
                </div>
                <div class="absolute bottom-0 inset-x-0 flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-md border-t border-white/10">
                  <div>
                    <p class="text-white text-xs font-medium leading-none mb-0.5">Closed right now</p>
                    <p class="text-white/50 text-[11px] font-medium">Opens {{ vendor.openingTime || '8:00 AM' }}</p>
                  </div>
                  <button
                    @click.stop="$emit('notify', vendor)"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white active:scale-95 text-gray-900 rounded-xl text-[11px] font-medium transition-all shadow-md"
                  >
                    <Bell class="w-3 h-3" /> Notify me
                  </button>
                </div>
              </template>

              <!-- NORMAL OPEN VENDOR -->
              <template v-else>
                <img
                  :src="vendor.banner || vendor.image || vendor.logo || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop'"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt="Vendor Banner"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute top-5 left-5">
                  <div v-if="vendor.logo" class="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white">
                    <img :src="vendor.logo" class="w-full h-full object-cover" alt="Store Logo" />
                  </div>
                  <div v-else :class="`w-14 h-14 rounded-2xl flex items-center justify-center text-md font-medium text-white shadow-2xl border-2 border-white/20 ${getVendorColor(vendor.storeName)}`">
                    {{ getInitials(vendor.storeName) }}
                  </div>
                </div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 overflow-hidden">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span v-if="vendor.businessType === 'service_provider'" class="px-2.5 py-1 bg-purple-600/90 backdrop-blur-xl rounded-lg text-white text-[9px] font-extrabold tracking-wider border border-white/20 shadow-lg shrink-0">
                      SERVICE
                    </span>
                    <span v-else-if="vendor.businessType === 'hybrid'" class="px-2.5 py-1 bg-indigo-600/90 backdrop-blur-xl rounded-lg text-white text-[9px] font-extrabold tracking-wider border border-white/20 shadow-lg shrink-0">
                      HYBRID
                    </span>
                    <span v-else class="px-2.5 py-1 bg-blue-600/90 backdrop-blur-xl rounded-lg text-white text-[9px] font-extrabold tracking-wider border border-white/20 shadow-lg shrink-0">
                      STORE
                    </span>

                    <span v-if="vendor.preOrderOnly" class="px-2 py-1 bg-rose-500/90 backdrop-blur-xl rounded-lg text-white text-[9px] font-bold tracking-wider border border-white/20 shadow-lg shrink-0">
                      PRE-ORDER
                    </span>
                    <span class="px-2.5 py-1 bg-gray-900/40 backdrop-blur-xl rounded-lg text-white text-[9px] font-bold tracking-wider border border-white/20 truncate transition-all duration-500 group-hover:bg-parentPrimary group-hover:border-parentPrimary">
                      {{ vendor.category }}
                    </span>
                  </div>
                  <span v-if="vendor.rating" class="flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-sm font-medium text-gray-900 shadow-xl border border-gray-50 group-hover:scale-105 transition-transform duration-500">
                    <Star class="w-3 h-3 text-parentPrimary fill-current" /> {{ vendor.rating.toFixed(1) }}
                  </span>
                </div>
              </template>
            </div>

            <!-- Card body -->
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-4 mb-3">
                  <h3 class="text-xl font-medium text-gray-900 group-hover:text-parentPrimary transition-colors -tight truncate">{{ vendor.storeName }}</h3>
                  <div v-if="vendor.isOpen" class="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span class="text-sm font-medium">open</span>
                  </div>
                  <div v-else class="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-400 rounded-lg border border-gray-100">
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span class="text-sm font-medium">{{ vendor.statusMessage || 'closed' }}</span>
                  </div>
                </div>
                <p class="text-[13px] text-gray-500 line-clamp-2 mb-6 leading-relaxed font-medium group-hover:text-gray-600 transition-colors">{{ vendor.description }}</p>
              </div>
              <div class="flex items-center justify-between pt-5 border-t border-gray-50/80">
                <div class="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-gray-400 tracking-tight min-w-0">
                  <span class="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors whitespace-nowrap shrink-0">
                    <Clock class="w-3.5 h-3.5 shrink-0" /> {{ vendor.preparationTime || 20 }} min
                  </span>
                  <span v-if="vendor.businessType !== 'service_provider'" class="flex items-center gap-1.5 text-parentPrimary/80 group-hover:text-parentPrimary transition-colors whitespace-nowrap shrink-0">
                    <Bike class="w-3.5 h-3.5 shrink-0" /> From ₦{{ vendor.baseDeliveryFee || 600 }}
                  </span>
                  <span v-else class="flex items-center gap-1.5 text-purple-600/80 group-hover:text-purple-600 transition-colors whitespace-nowrap shrink-0">
                    <Sparkles class="w-3.5 h-3.5 shrink-0" /> Service
                  </span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button @click.stop="$emit('share-vendor', vendor)" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-parentPrimary hover:text-white transition-all duration-300">
                    <Share2 class="w-4 h-4 shrink-0" />
                  </button>
                  <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-parentPrimary group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                    <ArrowUpRight class="w-4 h-4 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, Store, Star, Clock, Bike, ArrowUpRight, Bell, Sparkles, TrendingUp, Flame, Share2 } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  icon: { type: Object, required: true },
  vendors: { type: Array as () => any[], required: true },
  loading: { type: Boolean, default: false },
  carouselId: { type: String, required: true }
})

defineEmits(['select-vendor', 'notify', 'share-vendor'])

const scrollCarousel = (direction: 'left' | 'right') => {
  const container = document.getElementById(props.carouselId)
  if (container) {
    const scrollAmount = direction === 'left' ? -340 : 340
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

const getVendorColor = (name: string) => {
  if (!name) return 'bg-gray-400';
  const colors = ['bg-parentPrimary', 'bg-accent', 'bg-secondary', 'bg-gray-900', 'bg-parentPrimary', 'bg-emerald-500', 'bg-rose-500', 'bg-blue-800', 'bg-indigo-900'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};
</script>
