<template>
  <div class="space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Header -->
    <div class="space-y-4 mb-10">
      <h1 class="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-none">Search</h1>
      <p class="text-sm font-bold text-gray-400">Find anything you need on campus.</p>
    </div>

    <!-- Search Section -->
    <div class="relative group z-30">
      <div class="absolute inset-x-0 -bottom-2 h-2 bg-gray-900/5 rounded-full blur-2xl group-focus-within:bg-parentPrimary/20 transition-all duration-500" />
      <Search class="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400 group-focus-within:text-parentPrimary group-focus-within:scale-110 transition-all duration-500" />
      <input
        v-model="query"
        type="text"
        placeholder="Search for restaurants, snacks, or groceries..."
        class="w-full pl-20 pr-8 py-10 bg-white border border-gray-100 rounded-3xl md:rounded-[3rem] shadow-lg shadow-gray-200/20 focus:ring-8 focus:ring-parentPrimary/5 focus:border-parentPrimary/30 transition-all text-2xl font-bold tracking-tight placeholder:text-gray-200"
        autofocus
        @input="debouncedSearch"
      />
      
      <!-- Indicators -->
      <div v-if="searching" class="absolute right-10 top-1/2 -translate-y-1/2">
         <div class="w-8 h-8 border-4 border-parentPrimary/10 border-t-parentPrimary rounded-full animate-spin" />
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="query && results.length > 0" class="space-y-10">
      <div class="flex items-center gap-4 px-4">
         <div class="w-10 h-px bg-gray-200" />
         <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Results for "{{ query }}"</h2>
         <div class="flex-1 h-px bg-gray-200" />
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="item in results"
          :key="item._id"
          class="bg-white rounded-3xl md:rounded-[3rem] p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-700 group cursor-pointer relative overflow-hidden"
          @click="navigateTo(`/vendors/${item.vendor?._id}`)"
        >
          <div class="relative h-44 rounded-[2.5rem] overflow-hidden mb-6 shadow-inner">
            <img :src="item.image || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&h=400&fit=crop'" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-40" />
            
            <!-- Price Badge -->
            <div class="absolute bottom-4 left-4">
               <span class="px-5 py-2 bg-gray-900/90 backdrop-blur-xl rounded-2xl text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 shadow-lg">
                 ₦{{ item.price?.toLocaleString() }}
               </span>
            </div>
          </div>
          
          <div class="px-4 space-y-3 pb-2">
            <h4 class="font-bold text-gray-900 text-lg tracking-tight leading-none truncate">{{ item.name }}</h4>
            <div class="flex items-center gap-3">
               <div :class="item.vendor?.isOnline ? 'bg-emerald-500' : 'bg-rose-500'" class="w-2 h-2 rounded-full animate-pulse shadow-sm" />
               <p class="text-[10px] font-bold text-gray-400 truncate">
                 {{ item.vendor?.storeName }}
               </p>
            </div>
          </div>
          
          <!-- View Button -->
          <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
             <div class="w-10 h-10 bg-parentPrimary rounded-xl flex items-center justify-center text-white shadow-lg">
                <ArrowRight class="w-5 h-5" />
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty/Initial States -->
    <div v-else-if="query && !searching && results.length === 0" class="bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl md:rounded-[4rem] text-center py-32 animate-fade-in mx-4">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2.5rem] shadow-lg mb-8 transform rotate-12 animate-float">
         <span class="text-5xl">🔭</span>
      </div>
      <h3 class="text-2xl font-black text-gray-900">No results found</h3>
      <p class="text-sm font-bold text-gray-400 mt-4">We couldn't find anything matching "{{ query }}". Try different keywords!</p>
    </div>

    <div v-if="!query" class="bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl md:rounded-[4rem] text-center py-32 animate-fade-in mx-4">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2.5rem] shadow-lg mb-8 transform -rotate-12 animate-float">
         <span class="text-5xl">🔍</span>
      </div>
      <h3 class="text-2xl font-black text-gray-900">Start searching</h3>
      <p class="text-sm font-bold text-gray-400 mt-4">Type something above to find food, snacks, or groceries.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, ArrowRight } from 'lucide-vue-next';
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
