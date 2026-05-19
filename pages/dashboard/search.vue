<template>
  <div class="space-y-6 animate-fade-in pb-32 selection:bg-parentPrimary/10 selection:text-parentPrimary px-4 md:px-6">
    <!-- Header -->
    <header class="pt-6 pb-2">
      <h1 class="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">
        Search Catalog
      </h1>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Find food, snacks, and products on campus
      </p>
    </header>

    <!-- Search Section -->
    <div class="relative group z-30 max-w-2xl">
      <div class="relative">
        <input
          v-model="query"
          type="text"
          placeholder="Search for items or vendors..."
          class="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-parentPrimary/10 focus:border-parentPrimary transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none shadow-sm"
          autofocus
          @input="debouncedSearch"
        />
        <div class="absolute left-4 top-1/2 -translate-y-1/2">
          <Search class="w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-all" />
        </div>
        
        <!-- Indicator spinner -->
        <div v-if="searching" class="absolute right-4 top-1/2 -translate-y-1/2">
          <div class="w-4 h-4 border border-parentPrimary/20 border-t-parentPrimary rounded-full animate-spin" />
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="query && results.length > 0" class="space-y-6">
      <div class="flex items-center gap-4">
        <h2 class="text-xs font-black uppercase tracking-wider text-gray-400 shrink-0">Results for "{{ query }}"</h2>
        <div class="flex-1 h-px bg-gray-50" />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="item in results"
          :key="item._id"
          class="bg-white rounded-2xl p-3 border border-gray-100 hover:border-parentPrimary/30 hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full justify-between"
          @click="router.push(`/vendors/${item.vendor?._id}`)"
        >
          <div>
            <div class="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50">
              <img :src="item.image || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&h=400&fit=crop'" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
              
              <!-- Price Badge -->
              <div class="absolute bottom-2.5 left-2.5">
                <span class="px-2 py-1 bg-white/95 backdrop-blur-md rounded-lg text-xs font-black text-gray-900 border border-gray-100 shadow-sm">
                  ₦{{ item.price?.toLocaleString() }}
                </span>
              </div>
            </div>
            
            <div class="space-y-1">
              <h4 class="font-black text-gray-900 text-xs tracking-tight leading-tight line-clamp-2">{{ item.name }}</h4>
            </div>
          </div>

          <div class="flex items-center gap-1.5 pt-3 mt-3 border-t border-gray-50">
            <div :class="item.vendor?.isOnline ? 'bg-emerald-500' : 'bg-gray-300'" class="w-1.5 h-1.5 rounded-full shrink-0" />
            <p class="text-[10px] font-black text-gray-400 truncate">
              {{ item.vendor?.storeName }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty/Initial States -->
    <div v-else-if="query && !searching && results.length === 0" class="bg-white border border-dashed border-gray-200 rounded-2xl text-center py-20 px-4">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 border border-gray-100">
        <span class="text-3xl">🔭</span>
      </div>
      <h3 class="text-lg font-black text-gray-900 mb-1 tracking-tight">No results found</h3>
      <p class="text-xs font-medium text-gray-500 max-w-xs mx-auto">We couldn't find anything matching your keywords. Try again with a different term.</p>
    </div>

    <div v-if="!query" class="bg-white border border-dashed border-gray-200 rounded-2xl text-center py-20 px-4">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 border border-gray-100">
        <span class="text-3xl">🔍</span>
      </div>
      <h3 class="text-lg font-black text-gray-900 mb-1 tracking-tight">Start searching</h3>
      <p class="text-xs font-medium text-gray-500 max-w-xs mx-auto">Type above to find meals, grocery items, snacks, or stationery instantenously.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { products_api } from '@/api_factory/modules/products';

definePageMeta({
  layout: 'student'
});

const router = useRouter();
const route = useRoute();
const query = ref('');
const results = ref<any[]>([]);
const searching = ref(false);

const performSearch = async () => {
  if (!query.value.trim()) {
    results.value = [];
    return;
  }
  searching.value = true;
  try {
    const res = await products_api.search(query.value);
    results.value = (res.data as any)?.products || res.data || [];
  } catch (e) { 
    console.error(e); 
  } finally { 
    searching.value = false; 
  }
};

let timeout: any = null;
const debouncedSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(performSearch, 300);
};

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q as string;
    performSearch();
  }
});

useHead({ title: 'Search - Errandr' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
