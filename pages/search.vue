<template>
  <div class="space-y-6 pb-20 md:pb-0">
    <!-- Search Input -->
    <div class="relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
      <input
        v-model="query"
        type="text"
        placeholder="Search food, drinks, restaurants..."
        class="glass-input w-full pl-12 py-4 text-lg"
        autofocus
        @input="debouncedSearch"
      />
    </div>

    <!-- Results -->
    <div v-if="query && results.length > 0" class="space-y-3">
      <h2 class="section-title">Results for "{{ query }}"</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="item in results"
          :key="item._id"
          class="glass-card group cursor-pointer"
          @click="navigateTo(`/vendors/${item.vendor?._id}`)"
        >
          <div class="relative h-28 rounded-xl overflow-hidden mb-2">
            <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <h4 class="font-medium text-dark-900 text-sm truncate">{{ item.name }}</h4>
          <p class="text-primary-600 font-bold text-sm">₦{{ item.price?.toLocaleString() }}</p>
          <p class="text-xs text-dark-500 truncate flex items-center gap-1">
            <span v-if="item.vendor?.isOnline" class="status-online" />
            <span v-else class="status-offline" />
            {{ item.vendor?.storeName }}
          </p>
        </div>
      </div>
    </div>

    <div v-else-if="query && !searching && results.length === 0" class="glass-card text-center py-12">
      <span class="text-5xl block mb-4">🤷</span>
      <p class="text-dark-400">No results found for "{{ query }}"</p>
    </div>

    <!-- Suggestion when empty -->
    <div v-if="!query" class="glass-card text-center py-12">
      <span class="text-5xl block mb-4">🔍</span>
      <p class="text-dark-400">Start typing to search for food, drinks, and more</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { ref } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';



const query = ref('');
const results = ref<any[]>([]);
const searching = ref(false);

let timeout: any = null;
const debouncedSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    if (!query.value.trim()) {
      results.value = [];
      return;
    }
    searching.value = true;
    try {
      const res = await api.get<any>(`/products/search?q=${encodeURIComponent(query.value)}`);
      results.value = res.data.products || [];
    } catch (e) { console.error(e); }
    finally { searching.value = false; }
  }, 300);
};

useHead({ title: 'Search - Errandr' });
</script>
