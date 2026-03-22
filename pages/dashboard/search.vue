<template>
  <div class="space-y-8 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Search Section -->
    <div class="relative group z-30 max-w-2xl px-2">
      <div class="relative">
        <input
          v-model="query"
          type="text"
          placeholder="Search for restaurants, snacks, or groceries..."
          class="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-parentPrimary/5 focus:border-parentPrimary transition-all text-sm font-bold placeholder:text-gray-300"
          autofocus
          @input="debouncedSearch"
        />
        <div class="absolute left-4 top-1/2 -translate-y-1/2">
           <Search class="w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-all" />
        </div>
        
        <!-- Indicators -->
        <div v-if="searching" class="absolute right-4 top-1/2 -translate-y-1/2">
           <div class="w-4 h-4 border-2 border-parentPrimary/10 border-t-parentPrimary rounded-full animate-spin" />
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="query && results.length > 0" class="space-y-8">
      <div class="flex items-center gap-4 px-2">
         <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Results for "{{ query }}"</h2>
         <div class="flex-1 h-px bg-gray-100" />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="item in results"
          :key="item._id"
          class="bg-white rounded-[1.5rem] p-3 border border-gray-50 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 group cursor-pointer relative overflow-hidden"
          @click="router.push(`/vendors/${item.vendor?._id}`)"
        >
          <div class="relative h-40 rounded-2xl overflow-hidden mb-4 shadow-inner">
            <img :src="item.image || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&h=400&fit=crop'" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <!-- Price Badge -->
            <div class="absolute bottom-3 left-3">
               <span class="px-3 py-1 bg-white/95 backdrop-blur-xl rounded-lg text-[10px] font-bold text-gray-900 border border-white/10 shadow-sm">
                 ₦{{ item.price?.toLocaleString() }}
               </span>
            </div>
          </div>
          
          <div class="px-2 space-y-1 pb-2">
            <h4 class="font-bold text-gray-900 text-sm tracking-tight leading-none truncate">{{ item.name }}</h4>
            <div class="flex items-center gap-2">
               <div :class="item.vendor?.isOnline ? 'bg-emerald-500' : 'bg-gray-300'" class="w-1.5 h-1.5 rounded-full" />
               <p class="text-[9px] font-bold text-gray-400 truncate uppercase tracking-wider">
                 {{ item.vendor?.storeName }}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty/Initial States -->
    <div v-else-if="query && !searching && results.length === 0" class="bg-white border border-dashed border-gray-100 rounded-[2.5rem] text-center py-24 animate-fade-in mx-2">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-6 transform rotate-12">
         <span class="text-4xl text-parentPrimary">🔭</span>
      </div>
      <h3 class="text-xl font-bold text-gray-900">No results found</h3>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Try different keywords!</p>
    </div>

    <div v-if="!query" class="bg-white border border-dashed border-gray-100 rounded-[2.5rem] text-center py-24 animate-fade-in mx-2">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-6 transform -rotate-12">
         <span class="text-4xl text-parentPrimary">🔍</span>
      </div>
      <h3 class="text-xl font-bold text-gray-900">Start searching</h3>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Find food, snacks, or groceries</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, ArrowRight } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

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
    const res = await api.get<any>(`/products/search?q=${encodeURIComponent(query.value)}`);
    results.value = res.data.products || [];
  } catch (e) { console.error(e); }
  finally { searching.value = false; }
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
