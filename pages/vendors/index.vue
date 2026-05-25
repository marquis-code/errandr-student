<template>
  <div class="min-h-screen bg-white">
    <CoreAppNavbar />

    <div class="max-w-[1400px] mx-auto px-4 md:px-6 pt-6 pb-32 animate-fade-in">
      
      <!-- Top Header Row -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight leading-none">
            {{ filteredVendors.length }} Campus Stores
          </h2>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Available in your campus area
          </p>
        </div>
        
        <!-- Search & Filter buttons -->
        <div class="flex items-center gap-3">
          <div class="relative group z-20 w-full md:w-64">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search stores, food..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-parentPrimary transition-all outline-none shadow-sm placeholder:text-gray-400"
            />
          </div>
          
          <button 
            @click="showMobileFilters = true" 
            class="flex items-center gap-2 px-4 py-2.5 border border-gray-100 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm shrink-0 active:scale-95"
          >
            <Filter class="w-3.5 h-3.5" /> Filters
          </button>
          
          <button 
            v-if="hasActiveFilters"
            @click="resetAllFilters" 
            class="text-xs font-medium text-parentPrimary hover:underline px-3 py-2.5 bg-parentPrimary/10 rounded-xl shrink-0 active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Horizontal Categories Bar (Sticky scrolling) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth mb-8 border-b border-gray-50">
        <button
          v-for="cat in allCategories"
          :key="cat.key"
          @click="selectedCategory = cat.key"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all whitespace-nowrap active:scale-95 shrink-0"
          :class="selectedCategory === cat.key ? 'bg-parentPrimary text-white border-parentPrimary shadow-md shadow-parentPrimary/20' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'"
        >
          <span class="text-sm shrink-0">{{ cat.icon }}</span>
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <div v-for="i in 8" :key="i" class="space-y-4 animate-pulse">
          <div class="bg-gray-100 aspect-[16/10] rounded-2xl" />
          <div class="space-y-2">
            <div class="h-4 bg-gray-100 rounded-full w-3/4" />
            <div class="h-3 bg-gray-100 rounded-full w-1/2" />
          </div>
        </div>
      </div>

      <!-- Vendors Grid -->
      <div v-else-if="filteredVendors.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="vendor in filteredVendors"
          :key="vendor._id"
          @click="handleVendorClick(vendor)"
          class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-parentPrimary/30 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
          <!-- Thumbnail/Banner -->
          <div class="relative aspect-[16/10] overflow-hidden bg-gray-50 shrink-0">
            <img 
              :src="vendor.banner || vendor.image || vendor.logo || '/placeholder-store.jpg'" 
              :alt="vendor.storeName" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            
            <!-- Badges -->
            <div class="absolute top-3 left-3 z-10 flex gap-2">
              <span v-if="!vendor.isOpen" class="px-2.5 py-1 bg-gray-900/90 backdrop-blur-md rounded-lg text-[9px] font-medium text-white uppercase tracking-wider">
                Closed
              </span>
              <span v-else-if="vendor.offers?.length" class="px-2.5 py-1 bg-rose-500 rounded-lg text-[9px] font-medium text-white uppercase tracking-wider">
                Promo
              </span>
            </div>

            <!-- Actions (Favorite & Share) -->
            <div class="absolute top-3 right-3 z-10 flex flex-col gap-2">
              <button 
                @click.stop="toggleFavoriteVendor(vendor)"
                class="w-8 h-8 rounded-xl bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-rose-500 hover:bg-white transition-all shadow-sm"
              >
                <Heart class="w-4 h-4" :class="{ 'fill-rose-500 text-rose-500': isVendorFavorited(vendor._id) }" />
              </button>
              <button 
                @click.stop="handleShareVendor(vendor)"
                class="w-8 h-8 rounded-xl bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-parentPrimary hover:bg-white transition-all shadow-sm"
              >
                <Share2 class="w-4 h-4" />
              </button>
            </div>

            <!-- Logo overlay overlapping bottom-left edge -->
            <div class="absolute bottom-3 left-3 z-10">
              <div v-if="vendor.logo" class="w-10 h-10 rounded-xl border-2 border-white bg-white overflow-hidden shadow-md">
                <img :src="vendor.logo" class="w-full h-full object-cover" />
              </div>
              <div v-else :class="`w-10 h-10 rounded-xl border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-medium tracking-tighter ${getVendorColor(vendor.storeName)}`">
                {{ getInitials(vendor.storeName) }}
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div class="space-y-1">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-medium text-gray-900 text-xs tracking-tight line-clamp-1 group-hover:text-parentPrimary transition-colors">{{ vendor.storeName }}</h3>
                <div class="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100/50">
                  <Star class="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span class="text-[9px] font-medium text-amber-700">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
                </div>
              </div>
              <p class="text-[10px] font-bold text-gray-400 capitalize">{{ vendor.category }}</p>
            </div>

            <!-- Metadata row -->
            <div class="flex items-center justify-between pt-3 mt-3 border-t border-gray-50 text-[10px] font-medium text-gray-500">
              <div class="flex items-center gap-1 whitespace-nowrap shrink-0">
                <Clock class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{{ vendor.preparationTime || 20 }} min</span>
              </div>
              <div class="flex items-center gap-1 whitespace-nowrap shrink-0">
                <span class="text-gray-400 font-medium">Delivery:</span>
                <span class="text-gray-900">₦{{ vendor.deliveryFee || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State: No filter results -->
      <div v-else class="relative w-full overflow-hidden rounded-2xl border border-dashed border-gray-200 py-20 px-6 text-center">
        <!-- Background layers -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-white pointer-events-none" />
        <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-parentPrimary/5 rounded-full blur-[80px] pointer-events-none" />

        <!-- Emoji icon -->
        <div class="relative z-10 w-16 h-16 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center text-3xl mx-auto mb-5" style="animation: float 3s ease-in-out infinite;">
          🔍
        </div>

        <!-- Copy -->
        <div class="relative z-10 space-y-2 mb-6">
          <h3 class="text-xl font-medium text-gray-900 tracking-tight">Nothing Matches</h3>
          <p class="text-sm text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
            We couldn't find stores for your current filters. Try broadening your search!
          </p>
        </div>

        <!-- Active filter chips (visual hint) -->
        <div class="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-8">
          <span v-if="searchQuery" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
            🔍 "{{ searchQuery }}"
          </span>
          <span v-if="selectedCategory !== 'all'" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
            {{ allCategories.find(c => c.key === selectedCategory)?.icon }} {{ allCategories.find(c => c.key === selectedCategory)?.label }}
          </span>
          <span v-if="showOnlyOffers" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
            🏷️ Offers only
          </span>
          <span v-if="showQuickDelivery" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
            ⚡ Under 30 min
          </span>
        </div>

        <!-- Actions -->
        <div class="relative z-10 flex items-center justify-center gap-3">
          <button
            @click="resetAllFilters"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-parentPrimary text-white rounded-xl text-xs font-medium hover:scale-105 transition-transform shadow-md shadow-parentPrimary/20 active:scale-95"
          >
            Reset Filters
          </button>
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors active:scale-95"
          >
            Go Home
          </NuxtLink>
        </div>
      </div>

    </div>

    <!-- Closed Store Modal -->
    <VendorClosedModal 
      :isOpen="isClosedModalOpen" 
      :vendor="selectedVendorForModal" 
      @close="isClosedModalOpen = false" 
    />

    <!-- Share Modal -->
    <UiShareModal 
      v-model:isOpen="isShareModalOpen" 
      :vendor="selectedVendorForShare" 
    />

    <!-- ============================================ -->
    <!-- FILTERS BOTTOM SHEET                         -->
    <!-- ============================================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showMobileFilters" class="fixed inset-0 z-[110] flex justify-end bg-black/50 backdrop-blur-sm" @click.self="showMobileFilters = false">
          <div class="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl animate-slide-in-right p-6 space-y-6 flex flex-col">
            
            <div class="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 class="text-lg font-medium text-gray-900 tracking-tight">Refine Options</h3>
              <button @click="showMobileFilters = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X class="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <!-- Offers & Quick Delivery toggles -->
            <div class="space-y-3">
              <p class="text-[10px] font-medium uppercase tracking-widest text-gray-400">Quick Filters</p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="showOnlyOffers = !showOnlyOffers"
                  class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-xs font-medium"
                  :class="showOnlyOffers ? 'bg-parentPrimary text-white border-parentPrimary shadow-md' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'"
                >
                  <Tag class="w-3.5 h-3.5" />
                  Special Offers
                </button>

                <button
                  @click="showQuickDelivery = !showQuickDelivery"
                  class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-xs font-medium"
                  :class="showQuickDelivery ? 'bg-parentPrimary text-white border-parentPrimary shadow-md' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'"
                >
                  <Clock class="w-3.5 h-3.5" />
                  Under 30 min
                </button>
              </div>
            </div>

            <!-- Rating Selector -->
            <div class="space-y-2">
              <p class="text-[10px] font-medium uppercase tracking-widest text-gray-400">Minimum Rating</p>
              <UiSelectInput 
                v-model="minRating" 
                :options="ratingOptions"
              />
            </div>

            <!-- Delivery Fee slider -->
            <div class="space-y-3">
              <div class="flex justify-between text-[10px] font-medium uppercase tracking-widest text-gray-400">
                <span>Max Delivery Fee</span>
                <span class="text-parentPrimary">₦{{ maxDeliveryFee }}</span>
              </div>
              <input 
                v-model="maxDeliveryFee" 
                type="range" 
                min="0" 
                max="1000" 
                step="50" 
                class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-parentPrimary"
              />
            </div>

            <!-- Actions -->
            <div class="pt-4 mt-auto border-t border-gray-100 flex gap-3">
              <button 
                @click="resetAllFilters" 
                class="flex-1 py-3.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-medium uppercase tracking-wider hover:bg-gray-50 active:scale-95"
              >
                Reset All
              </button>
              <button 
                @click="showMobileFilters = false" 
                class="flex-1 py-3.5 bg-parentPrimary text-white rounded-xl text-xs font-medium uppercase tracking-wider hover:bg-parentPrimary/90 active:scale-95 shadow-md shadow-parentPrimary/10"
              >
                Apply
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { Search, Tag, Clock, Star, Heart, Filter, X, Share2 } from 'lucide-vue-next';
import { useFavorites } from '@/composables/modules/favorites';
import UiSelectInput from '@/components/ui/SelectInput.vue';
import VendorClosedModal from '@/components/VendorClosedModal.vue';

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
const { favoriteVendorIds, fetchFavorites, toggleFavorite, isVendorFavorited } = useFavorites();

const ratingOptions = [
  { label: 'All ratings', value: '0' },
  { label: '3.0+', value: '3' },
  { label: '3.5+', value: '3.5' },
  { label: '4.0+', value: '4' },
  { label: '4.5+', value: '4.5' },
  { label: '5.0 Only', value: '5' }
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

const isShareModalOpen = ref(false);
const selectedVendorForShare = ref<any>(null);

const handleShareVendor = (vendor: any) => {
  selectedVendorForShare.value = vendor;
  isShareModalOpen.value = true;
};

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

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' ||
    selectedCategory.value !== 'all' ||
    showOnlyOffers.value ||
    showQuickDelivery.value ||
    maxDeliveryFee.value !== 1000 ||
    minRating.value !== '0';
});

const filteredVendors = computed(() => {
  let filtered = vendors.value;

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(v => 
      v.storeName.toLowerCase().includes(q) || 
      v.category.toLowerCase().includes(q)
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

  // Sorting (Popularity default)
  filtered = [...filtered].sort((a, b) => {
    return (b.totalOrders || 0) - (a.totalOrders || 0);
  });

  return filtered;
});

const toggleFavoriteVendor = async (vendor: any) => {
  await toggleFavorite({ vendorId: vendor._id });
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

import { vendors_api } from '@/api_factory/modules/vendors';

onMounted(async () => {
  try {
    const [recRes, trendRes, newRes] = await Promise.all([
      vendors_api.getAll({ sortBy: 'recommended', limit: 100 }),
      vendors_api.getAll({ sortBy: 'trending', limit: 100 }),
      vendors_api.getAll({ sortBy: 'newest', limit: 100 })
    ]);
    
    const recommended = recRes.data?.vendors || recRes.data?.data?.vendors || recRes.data || [];
    const trending = trendRes.data?.vendors || trendRes.data?.data?.vendors || trendRes.data || [];
    const newest = newRes.data?.vendors || newRes.data?.data?.vendors || newRes.data || [];
    
    const combined = [...recommended, ...trending, ...newest];
    const rawVendors = Array.from(new Map(combined.map(v => [v._id, v])).values());
    if (rawVendors.length === 0) {
      vendors.value = [
        { _id: 'mock1', storeName: 'Mavise Restaurant', category: 'restaurant', banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80', rating: 4.8, preparationTime: 25, deliveryFee: 200, isOpen: true, offers: ['20% OFF'] },
        { _id: 'mock2', storeName: 'Quick Bites', category: 'snacks', banner: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80', rating: 4.5, preparationTime: 15, deliveryFee: 100, isOpen: true, offers: ['Free Drink'] },
        { _id: 'mock3', storeName: 'Mama Put Central', category: 'eatery', banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', rating: 4.9, preparationTime: 30, deliveryFee: 150, isOpen: true }
      ];
    } else {
      vendors.value = rawVendors.map((v: any) => ({ 
        ...v, 
        offers: v.offers?.length > 0 ? v.offers : (Math.random() > 0.7 ? ['Special Discount'] : []) 
      }));
    }
  } catch (e) {
    console.error('API failed, using mock data for demo', e);
    vendors.value = [
      { _id: 'mock1', storeName: 'Mavise Restaurant (Demo)', category: 'restaurant', banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80', rating: 4.8, preparationTime: 25, deliveryFee: 200, isOpen: true }
    ];
  } finally {
    loading.value = false;
  }
  fetchFavorites();
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
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up-mobile {
  animation: slideUpMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUpMobile {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-in-right {
  animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
</style>
