<template>
  <div class="space-y-6 pb-20 md:pb-0">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-dark-900">Vendors</h1>
      <div class="flex items-center gap-2">
        <button
          v-for="loc in locationFilters"
          :key="loc.key"
          @click="selectedLocation = loc.key"
          class="text-sm py-1.5 px-3 rounded-lg transition-all"
          :class="selectedLocation === loc.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'"
        >
          {{ loc.label }}
        </button>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        v-for="cat in allCategories"
        :key="cat.key"
        @click="selectedCategory = cat.key"
        class="flex-shrink-0 text-sm py-2 px-4 rounded-xl transition-all whitespace-nowrap"
        :class="selectedCategory === cat.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>

    <!-- Vendor Grid -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="glass-card animate-pulse">
        <div class="h-40 bg-dark-100 rounded-xl mb-3" />
        <div class="h-4 bg-dark-100 rounded w-2/3 mb-2" />
        <div class="h-3 bg-dark-100 rounded w-1/2" />
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="vendor in filteredVendors"
        :key="vendor._id"
        :to="`/vendors/${vendor._id}`"
        class="glass-card group overflow-hidden"
      >
        <div class="relative h-40 rounded-xl overflow-hidden mb-3">
          <img :src="vendor.banner || '/placeholder-vendor.jpg'" :alt="vendor.storeName" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div class="absolute top-3 left-3">
            <span v-if="vendor.isOnline" class="badge-green"><span class="status-online mr-1" /> Open</span>
            <span v-else class="badge-red">Closed</span>
          </div>
          <div v-if="vendor.isInsideCampus" class="absolute top-3 right-3">
            <span class="badge-orange">🏫 Campus</span>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <img :src="vendor.logo || '/placeholder-logo.jpg'" class="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-dark-900 truncate">{{ vendor.storeName }}</h3>
            <p class="text-sm text-dark-500 truncate">{{ vendor.category }}</p>
            <div class="flex items-center gap-3 mt-1 text-xs text-dark-500 font-medium">
              <span>⭐ {{ vendor.rating?.toFixed(1) || 'New' }}</span>
              <span>{{ vendor.preparationTime || '15-25' }} min</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div v-if="!loading && filteredVendors.length === 0" class="glass-card text-center py-12">
      <span class="text-5xl mb-4 block">🔍</span>
      <p class="text-dark-400">No vendors found for this category.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

const loading = ref(true);
const vendors = ref<any[]>([]);
const selectedCategory = ref(route.query.category as string || 'all');
const selectedLocation = ref('all');

const locationFilters = [
  { key: 'all', label: 'All' },
  { key: 'campus', label: '🏫 On Campus' },
  { key: 'outside', label: '🏙️ Off Campus' },
];

const allCategories = [
  { key: 'all', label: 'All', icon: '🏪' },
  { key: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  { key: 'eatery', label: 'Eateries', icon: '🍛' },
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
