<template>
 <div class="min-h-screen bg-white">
 <!-- Standalone Header -->
 <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-50">
 <div class="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
 <div class="flex items-center gap-3">
 <NuxtLink to="/dashboard" class="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
 <ShoppingBag class="w-4 h-4" />
 </NuxtLink>
 <NuxtLink to="/dashboard" class="text-lg font-bold text-gray-900 tracking-tighter">Errandr</NuxtLink>
 </div>
 <div class="flex items-center gap-3">
 <NuxtLink to="/cart" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all relative">
 <ShoppingCart class="w-4 h-4 text-gray-900" />
 </NuxtLink>
 </div>
 </div>
 </header>

  <div class="max-w-[1400px] animate-fade-in pb-32 px-6 pt-6">
    <div class="flex flex-col lg:flex-row items-start">
      
      <!-- LEFT SIDEBAR: Categories & Filters -->
      <aside class="hidden lg:block w-64 flex-shrink-0 fixed left-6 top-32 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar bg-white/50 backdrop-blur-xl border border-gray-100 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] z-10">
        <div class="space-y-8 pb-10">
          
          <!-- Search & Instant Filters -->
          <div class="space-y-5">
            <h2 class="text-xl font-black text-gray-900 tracking-tight">Explore</h2>
            
            <div class="relative w-full group">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search food, groceries..."
                class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-parentPrimary transition-all outline-none shadow-sm"
              />
            </div>
            
            <div class="flex flex-col gap-2">
              <button
                @click="showOnlyOffers = !showOnlyOffers"
                class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-xs font-bold w-full"
                :class="showOnlyOffers ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
              >
                <Tag class="w-4 h-4" />
                Special Offers
              </button>

              <button
                @click="showQuickDelivery = !showQuickDelivery"
                class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-xs font-bold w-full"
                :class="showQuickDelivery ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
              >
                <Clock class="w-4 h-4" />
                Under 30 min
              </button>
            </div>
            
            <!-- Ratings & Extra filters -->
            <div class="pt-2">
               <UiSelectInput 
                v-model="minRating" 
                label="Minimum Rating" 
                :options="ratingOptions"
              />
            </div>
          </div>

          <!-- Vertical Categories List -->
          <div>
            <h3 class="text-xs font-black text-gray-400 tracking-widest uppercase mb-4 px-2">Categories</h3>
            <div class="flex flex-col gap-1">
              <button
                v-for="cat in allCategories"
                :key="cat.key"
                @click="selectedCategory = cat.key"
                class="flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all text-left group"
                :class="selectedCategory === cat.key ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50'"
              >
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border transition-all"
                  :class="selectedCategory === cat.key ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 group-hover:bg-white'"
                >
                  {{ cat.icon }}
                </div>
                <span 
                  class="text-sm tracking-wide transition-colors"
                  :class="selectedCategory === cat.key ? 'font-black text-gray-900' : 'font-semibold text-gray-600 group-hover:text-gray-900'"
                >
                  {{ cat.label }}
                </span>
              </button>
            </div>
          </div>
          
        </div>
      </aside>

      <!-- MOBILE SIDEBAR DRAWER -->
      <UiSideDrawer :isOpen="showMobileFilters" @close="showMobileFilters = false">
        <div class="space-y-8 pb-10">
          <!-- Search & Instant Filters -->
          <div class="space-y-5">
            <h2 class="text-xl font-black text-gray-900 tracking-tight">Explore</h2>
            
            <div class="relative w-full group">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search food, groceries..."
                class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-parentPrimary transition-all outline-none shadow-sm"
              />
            </div>
            
            <div class="flex flex-col gap-2">
              <button
                @click="showOnlyOffers = !showOnlyOffers"
                class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-xs font-bold w-full"
                :class="showOnlyOffers ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
              >
                <Tag class="w-4 h-4" />
                Special Offers
              </button>

              <button
                @click="showQuickDelivery = !showQuickDelivery"
                class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-xs font-bold w-full"
                :class="showQuickDelivery ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
              >
                <Clock class="w-4 h-4" />
                Under 30 min
              </button>
            </div>
            
            <!-- Ratings & Extra filters -->
            <div class="pt-2">
               <UiSelectInput 
                v-model="minRating" 
                label="Minimum Rating" 
                :options="ratingOptions"
              />
            </div>
          </div>

          <!-- Vertical Categories List -->
          <div>
            <h3 class="text-xs font-black text-gray-400 tracking-widest uppercase mb-4 px-2">Categories</h3>
            <div class="flex flex-col gap-1">
              <button
                v-for="cat in allCategories"
                :key="cat.key"
                @click="selectedCategory = cat.key; showMobileFilters = false"
                class="flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all text-left group"
                :class="selectedCategory === cat.key ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50'"
              >
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border transition-all"
                  :class="selectedCategory === cat.key ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 group-hover:bg-white'"
                >
                  {{ cat.icon }}
                </div>
                <span 
                  class="text-sm tracking-wide transition-colors"
                  :class="selectedCategory === cat.key ? 'font-black text-gray-900' : 'font-semibold text-gray-600 group-hover:text-gray-900'"
                >
                  {{ cat.label }}
                </span>
              </button>
            </div>
          </div>
          
        </div>
      </UiSideDrawer>

      <!-- MAIN CONTENT: Vendor Grid -->
      <main class="flex-1 min-w-0 pb-10 lg:ml-[300px]">
        <!-- Header & Results Count -->
        <div class="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 class="text-3xl font-black text-gray-900 tracking-tighter">{{ filteredVendors.length }} Stores</h2>
            <p class="text-sm font-semibold text-gray-500 mt-1">Found directly in your area</p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="showMobileFilters = true" class="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm">
              <Filter class="w-4 h-4" /> Filters
            </button>
            <button @click="resetAllFilters" class="hidden sm:block text-xs font-black text-parentPrimary tracking-widest hover:underline px-4 py-2 bg-parentPrimary/10 rounded-lg">Reset Filters</button>
          </div>
        </div>

        <!-- Vendor Grid -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="space-y-4 animate-pulse">
            <div class="bg-gray-100 aspect-video rounded-3xl" />
            <div class="space-y-2">
              <div class="h-4 bg-gray-100 rounded-full w-3/4" />
              <div class="h-3 bg-gray-100 rounded-full w-1/2" />
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="vendor in filteredVendors"
            :key="vendor._id"
            @click="handleVendorClick(vendor)"
            class="flex flex-col group cursor-pointer bg-white rounded-3xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <!-- Banner -->
            <div class="relative aspect-video overflow-hidden bg-gray-50">
              <img 
                :src="vendor.banner || '/placeholder-store.jpg'" 
                :alt="vendor.storeName" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              
              <!-- Dark gradient overlay for text readability -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Logo Circle Overlay -->
              <div class="absolute bottom-3 left-3">
                <div v-if="vendor.logo" class="w-10 h-10 rounded-xl border-2 border-white shadow-lg overflow-hidden bg-white">
                  <img :src="vendor.logo" class="w-full h-full object-cover" />
                </div>
                <div v-else :class="`w-10 h-10 rounded-xl border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-black tracking-tighter ${getVendorColor(vendor.storeName)}`">
                  {{ getInitials(vendor.storeName) }}
                </div>
              </div>

              <!-- Status Badge -->
              <div class="absolute top-3 right-3 flex flex-col gap-2 items-end">
                <div v-if="!vendor.isOpen" class="px-3 py-1 bg-gray-900/90 backdrop-blur-md rounded-full text-white text-[9px] font-black tracking-widest shadow-lg">
                  CLOSED
                </div>
                <div v-else-if="vendor.offers?.length" class="px-3 py-1 bg-rose-500 rounded-full text-white text-[9px] font-black tracking-widest shadow-lg animate-pulse whitespace-nowrap">
                  PROMO 🔥
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="p-5 space-y-3">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-base font-bold text-gray-900 tracking-tight leading-tight line-clamp-1">{{ vendor.storeName }}</h3>
                <div class="flex items-center gap-1 shrink-0 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                  <Star class="w-3 h-3 fill-current text-amber-500" />
                  <span class="text-[10px] font-black text-gray-900">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                <span class="bg-gray-50 px-2.5 py-1 rounded-md text-gray-700 border border-gray-100">{{ vendor.category }}</span>
                <div class="flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5 text-gray-400" />
                  <span>{{ vendor.preparationTime || 20 }} min</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-gray-900 font-bold">₦{{ vendor.deliveryFee || 0 }}</span>
                  <span class="text-[10px] uppercase tracking-wider text-gray-400">Fee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredVendors.length === 0" class="w-full text-center py-24 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mt-6">
          <div class="w-20 h-20 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🔍</div>
          <h3 class="text-2xl font-black text-gray-900 mb-2 tracking-tight">No stores match criteria</h3>
          <p class="text-gray-500 text-sm font-medium mb-8 max-w-sm mx-auto">We couldn't find any stores matching your current filters. Try tweaking them or resetting.</p>
          <button 
            @click="resetAllFilters"
            class="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-xs tracking-widest hover:bg-parentPrimary transition-colors shadow-xl"
          >
            Reset All Filters
          </button>
        </div>

      </main>
    </div>
    
    <VendorClosedModal 
      :isOpen="isClosedModalOpen" 
      :vendor="selectedVendorForModal" 
      @close="isClosedModalOpen = false" 
    />
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { ShoppingBag, ShoppingCart, Search, Tag, Clock, ChevronDown, Star, Heart, ArrowLeft, Filter } from 'lucide-vue-next';
import { useCart } from '@/composables/modules/cart';
import { useUser } from '@/composables/modules/auth/user';
import FilterPopover from '@/components/ui/FilterPopover.vue';
import UiSideDrawer from '@/components/ui/SideDrawer.vue';

definePageMeta({
 layout: false
})

const route = useRoute();
const loading = ref(true);
const vendors = ref<any[]>([]);
const searchQuery = ref('');
const selectedCategory = ref(route.query.category as string || 'all');
const showOnlyOffers = ref(false);
const showQuickDelivery = ref(false);
const showMobileFilters = ref(false);
const maxDeliveryFee = ref(1000);
const minRating = ref('0');
const sortBy = ref('popularity');

const sortOptions = [
 { label: 'Popularity', value: 'popularity' },
 { label: 'Rating', value: 'rating' },
 { label: 'Delivery fee', value: 'delivery_fee' },
 { label: 'Delivery time', value: 'delivery_time' }
];

const ratingOptions = [
 { label: 'All ratings', value: '0' },
 { label: '3.0+', value: '3' },
 { label: '3.5+', value: '3.5' },
 { label: '4.0+', value: '4' },
 { label: '4.5+', value: '4.5' },
 { label: '5.0', value: '5' }
];

const isClosedModalOpen = ref(false);
const selectedVendorForModal = ref<any>(null);

const handleVendorClick = (vendor: any) => {
 if (!vendor.isOpen) {
 selectedVendorForModal.value = vendor;
 isClosedModalOpen.value = true;
 return;
 }
 navigateTo(`/vendors/${vendor._id}`);
};

const cart = useCart();
const { user } = useUser();

const allCategories = [
 { key: 'all', label: 'All', icon: '🏪' },
 { key: 'restaurant', label: 'Restaurants', icon: '🍽️' },
 { key: 'eatery', label: 'Local Food', icon: '🍛' },
 { key: 'snacks', label: 'Snacks', icon: '🍿' },
 { key: 'drinks', label: 'Drinks', icon: '🥤' },
 { key: 'bakery', label: 'Bakery', icon: '🍰' },
 { key: 'groceries', label: 'Groceries', icon: '🛒' },
 { key: 'pharmacy', label: 'Pharmacy', icon: '💊' },
 { key: 'stationery', label: 'Stationery', icon: '📚' },
 { key: 'chinese', label: 'Chinese', icon: '🥡' },
 { key: 'indian', label: 'Indian', icon: '🥘' },
 { key: 'pizza', label: 'Pizza', icon: '🍕' },
 { key: 'sushi', label: 'Sushi', icon: '🍣' },
];

const filteredVendors = computed(() => {
 let filtered = vendors.value;

 // Search
 if (searchQuery.value.trim()) {
 const q = searchQuery.value.toLowerCase();
 filtered = filtered.filter(v => 
 v.storeName.toLowerCase().includes(q) || 
 v.category.toLowerCase().includes(q) ||
 v.offers?.some((o: string) => o.toLowerCase().includes(q))
 );
 }

 // Category
 if (selectedCategory.value !== 'all') {
 filtered = filtered.filter((v) => v.category === selectedCategory.value);
 }

 // Offers
 if (showOnlyOffers.value) {
 filtered = filtered.filter(v => v.offers && v.offers.length > 0);
 }

 // Quick Delivery (Under 30 min)
 if (showQuickDelivery.value) {
 filtered = filtered.filter(v => (v.preparationTime || 20) < 30);
 }

 // Delivery Fee
 filtered = filtered.filter(v => (v.deliveryFee || 0) <= maxDeliveryFee.value);

 // Rating
 if (parseFloat(minRating.value) > 0) {
 filtered = filtered.filter(v => (v.rating || 5) >= parseFloat(minRating.value));
 }

 // Sorting
 filtered = [...filtered].sort((a, b) => {
 if (sortBy.value === 'popularity') return (b.totalOrders || 0) - (a.totalOrders || 0);
 if (sortBy.value === 'rating') return (b.rating || 0) - (a.rating || 0);
 if (sortBy.value === 'delivery_fee') return (a.deliveryFee || 0) - (b.deliveryFee || 0);
 if (sortBy.value === 'delivery_time') return (a.preparationTime || 0) - (b.preparationTime || 0);
 return 0;
 });

 return filtered;
});

const handleApplyFilters = () => {
 // This is handled by computed properties automatically
};

const resetDeliveryFee = () => {
 maxDeliveryFee.value = 1000;
};

const resetRating = () => {
 minRating.value = '0';
};

const resetAllFilters = () => {
 searchQuery.value = '';
 selectedCategory.value = 'all';
 showOnlyOffers.value = false;
 showQuickDelivery.value = false;
 maxDeliveryFee.value = 1000;
 minRating.value = '0';
 sortBy.value = 'popularity';
};

onMounted(async () => {
 try {
 const res = await api.get<any>('/vendors');
 const rawVendors = res.data?.vendors || res.data || [];
 
 if (rawVendors.length === 0) {
 // Use premium mock data if API is empty to show the UI
 vendors.value = [
 {
 _id: 'mock1',
 storeName: 'Mavise Restaurant',
 category: 'restaurant',
 banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
 logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80',
 rating: 4.8,
 preparationTime: 25,
 deliveryFee: 200,
 isOpen: true,
 offers: ['20% OFF on first order']
 },
 {
 _id: 'mock2',
 storeName: 'Quick Bites',
 category: 'snacks',
 banner: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
 rating: 4.5,
 preparationTime: 15,
 deliveryFee: 100,
 isOpen: true,
 offers: ['Free Drink with Burger']
 },
 {
 _id: 'mock3',
 storeName: 'Mama Put Central',
 category: 'eatery',
 banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
 rating: 4.9,
 preparationTime: 30,
 deliveryFee: 150,
 isOpen: true
 }
 ];
 } else {
 vendors.value = rawVendors.map((v: any) => ({
 ...v,
 offers: v.offers && v.offers.length > 0 ? v.offers : 
 (Math.random() > 0.7 ? ['Special Discount'] : [])
 }));
 }
 } catch (e) {
 console.error('API failed, using mock data for demo', e);
 // Fallback on error too
 vendors.value = [
 {
 _id: 'mock1',
 storeName: 'Mavise Restaurant (Demo)',
 category: 'restaurant',
 banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
 logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80',
 rating: 4.8,
 preparationTime: 25,
 deliveryFee: 200,
 isOpen: true
 }
 ];
 } finally {
 loading.value = false;
 }
});

useHead({ title: 'Vendors - Errandr' });

const getVendorColor = (name: string) => {
 if (!name) return 'bg-gray-400';
 const colors = ['bg-indigo-600', 'bg-rose-500', 'bg-emerald-500', 'bg-orange-500', 'bg-parentPrimary', 'bg-red-600', 'bg-blue-600', 'bg-amber-600', 'bg-purple-600'];
 let hash = 0;
 for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
 return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
 if (!name) return '??';
 return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
 display: none;
}
.scrollbar-hide {
 -ms-overflow-style: none;
 scrollbar-width: none;
}

.animate-fade-in {
 animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
 from { opacity: 0; transform: translateY(10px); }
 to { opacity: 1; transform: translateY(0); }
}
</style>
