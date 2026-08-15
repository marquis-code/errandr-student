<template>
  <div class="w-full py-8 overflow-hidden bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span class="text-2xl">🔥</span> Campus Deals & Combos
        </h2>
        <div class="flex items-center gap-2">
          <button 
            @click="scrollLeft" 
            class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors shadow-sm text-gray-600 disabled:opacity-50"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button 
            @click="scrollRight" 
            class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors shadow-sm text-gray-600 disabled:opacity-50"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref="carouselRef" 
        class="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pt-2 -mx-4 px-4 snap-x"
        style="scroll-behavior: smooth;"
      >
        <div 
          v-for="promo in promos" 
          :key="promo._id"
          @click="goToVendor(promo)"
          class="relative bg-white border border-gray-100 rounded-2xl w-[260px] md:w-[300px] shrink-0 cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 snap-start overflow-hidden flex flex-col"
        >
          <!-- Promo Badge -->
          <div class="absolute top-3 right-3 z-10 px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-md text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 animate-pulse">
            <Tag class="w-3 h-3" />
            Promo
          </div>

          <!-- Image -->
          <div class="h-40 md:h-48 w-full bg-gray-100 relative overflow-hidden">
            <img 
              :src="promo.imageUrl || promo.image || promo.components?.[0]?.itemId?.image || (promo.vendorId || promo.vendor)?.logo || '/placeholder-food.jpg'" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt="Promo Image"
            />
            <!-- Vendor Overlay -->
            <div class="absolute bottom-2 left-2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-sm border border-white/50">
              <div class="w-6 h-6 rounded-md overflow-hidden bg-gray-100 shrink-0">
                <img :src="(promo.vendorId || promo.vendor)?.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
              </div>
              <span class="text-xs font-bold text-gray-900 truncate max-w-[120px]">{{ (promo.vendorId || promo.vendor)?.storeName || 'Vendor' }}</span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 flex flex-col flex-1">
            <h3 class="font-bold text-gray-900 text-base md:text-lg mb-1 line-clamp-1 group-hover:text-parentPrimary transition-colors">{{ promo.name }}</h3>
            <p class="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[32px]">{{ promo.description || 'Special combo deal!' }}</p>
            
            <div class="mt-auto flex items-end justify-between">
              <div class="flex flex-col">
                <span class="text-xs text-gray-400 line-through font-medium mb-0.5" v-if="promo.originalPrice">₦{{ promo.originalPrice.toLocaleString() }}</span>
                <span class="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">₦{{ (promo.price || promo.bundlePrice || promo.discountPrice || 0).toLocaleString() }}</span>
              </div>
              
              <button class="w-10 h-10 rounded-full bg-parentPrimary/10 text-parentPrimary flex items-center justify-center group-hover:bg-parentPrimary group-hover:text-white transition-all shadow-sm">
                <ArrowRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from 'lucide-vue-next';
import { usePromos } from '@/composables/modules/products/usePromos';

const router = useRouter();
const carouselRef = ref<HTMLElement | null>(null);

const { promos, fetchPromos } = usePromos();

const scrollLeft = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: -300, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
};

const goToVendor = (promo: any) => {
  const vendorId = (promo.vendorId || promo.vendor)?._id || (promo.vendorId || promo.vendor);
  if (vendorId) {
    const isPack = !!(promo.components || promo.items || promo.bundlePrice);
    const query = isPack ? { packId: promo._id } : { productId: promo._id };
    router.push({ path: `/vendors/${vendorId}`, query });
  }
};

onMounted(() => {
  fetchPromos();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
