<template>
  <div class="space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-8">
      <div class="space-y-2">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-none">Vendors</h1>
        <p class="text-sm font-bold text-gray-400">Discover incredible food and essentials on campus.</p>
      </div>
      
      <div class="flex items-center gap-3 bg-gray-900 p-2 rounded-[1.5rem] shadow-lg self-start md:self-auto border border-white/5">
        <button
          v-for="loc in locationFilters"
          :key="loc.key"
          @click="selectedLocation = loc.key"
          class="text-[10px] font-bold uppercase py-3 px-6 rounded-xl transition-all duration-500"
          :class="selectedLocation === loc.key ? 'bg-parentPrimary text-white shadow-lg shadow-parentPrimary/20' : 'text-gray-400 hover:text-white'"
        >
          {{ loc.label }}
        </button>
      </div>
    </div>

    <!-- Category Grid -->
    <div class="px-4">
      <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        <button
          v-for="cat in allCategories"
          :key="cat.key"
          @click="selectedCategory = cat.key"
          class="flex-shrink-0 flex items-center gap-4 py-4 px-8 rounded-2xl transition-all duration-500 border border-gray-100 shadow-sm whitespace-nowrap group"
          :class="selectedCategory === cat.key ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-50'"
        >
          <span class="text-2xl group-hover:scale-125 transition-transform">{{ cat.icon }}</span>
          <span class="text-xs font-bold">{{ cat.label }}</span>
        </button>
      </div>
    </div>

    <!-- Vendor Grid -->
    <div v-if="loading" class="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="bg-gray-50 rounded-3xl md:rounded-[3rem] h-80 animate-pulse border border-gray-100" />
    </div>

    <div v-else class="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      <NuxtLink
        v-for="vendor in filteredVendors"
        :key="vendor._id"
        :to="`/vendors/${vendor._id}`"
        class="bg-white rounded-3xl md:rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg hover:scale-[1.02] transition-all duration-700 relative"
      >
        <!-- Banner -->
        <div class="relative h-56 overflow-hidden">
          <img :src="vendor.banner || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80'" :alt="vendor.storeName" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-60" />
          
          <div class="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <span v-if="vendor.isOnline" class="px-4 py-2 bg-emerald-500 text-white text-[10px] font-bold rounded-xl shadow-lg flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Open Now
            </span>
            <span v-else class="px-4 py-2 bg-rose-500 text-white text-[10px] font-bold rounded-xl shadow-lg">Closed</span>
          </div>

          <div v-if="vendor.isInsideCampus" class="absolute top-6 right-6 z-10">
            <span class="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-xl border border-white/20">🏫 On Campus</span>
          </div>
        </div>

        <!-- Identity -->
        <div class="p-10 relative">
          <div class="absolute -top-6 md:p-12 left-10 w-24 h-24 p-2 bg-white rounded-[2rem] shadow-lg transform -rotate-3 group-hover:rotate-0 transition-all duration-700">
             <img :src="vendor.logo || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=200&q=80'" class="w-full h-full rounded-[1.5rem] object-cover border border-gray-100" />
          </div>

          <div class="mt-14 space-y-4">
            <div class="space-y-1">
               <h3 class="text-3xl font-bold text-gray-900 tracking-tight leading-none truncate">{{ vendor.storeName }}</h3>
               <p class="text-xs font-bold text-parentPrimary">{{ vendor.category }}</p>
            </div>
            
            <div class="flex items-center gap-6 pt-6 border-t border-gray-50">
              <div class="flex items-center gap-2">
                 <span class="text-xl">⭐</span>
                 <span class="text-lg font-bold text-gray-900 tracking-tight">{{ vendor.rating?.toFixed(1) || 'NEW' }}</span>
              </div>
              <div class="w-px h-6 bg-gray-100" />
              <div class="flex items-center gap-2">
                 <span class="text-xl">⌛</span>
                 <span class="text-lg font-bold text-gray-900 tracking-tight">{{ vendor.preparationTime || '15-25' }} mins</span>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredVendors.length === 0" class="px-4 text-center py-32 bg-gray-50/50 rounded-3xl md:rounded-[4rem] border border-dashed border-gray-200 animate-fade-in mx-4">
      <span class="text-7xl mb-8 block animate-float">🔍</span>
      <h3 class="text-3xl font-bold text-gray-900">No vendors found</h3>
      <p class="text-sm font-bold text-gray-400 mt-4">Try adjusting your filters to find what you're looking for.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'student'
})

const route = useRoute();
const loading = ref(true);
const vendors = ref<any[]>([]);
const selectedCategory = ref(route.query.category as string || 'all');
const selectedLocation = ref('all');

const locationFilters = [
  { key: 'all', label: 'All Locations' },
  { key: 'campus', label: 'On Campus' },
  { key: 'outside', label: 'Outside Campus' },
];

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
];

const filteredVendors = computed(() => {
  let filtered = vendors.value;
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((v) => v.category === selectedCategory.value);
  }
  if (selectedLocation.value === 'campus') {
    filtered = filtered.filter((v) => v.isInsideCampus);
  } else if (selectedLocation.value === 'outside') {
    filtered = filtered.filter((v) => !v.isInsideCampus);
  }
  return filtered;
});

onMounted(async () => {
  try {
    const res = await api.get<any>('/vendors');
    vendors.value = res.data.vendors || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

useHead({ title: 'Vendors - Errandr' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(5deg); }
}
</style>
