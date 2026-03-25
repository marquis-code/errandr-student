<template>
 <div class="space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
 <!-- Search & Welcome -->
 <section class="relative">
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
 <div class="space-y-1">
 <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
 Hello, <span class="text-parentPrimary">{{ user?.firstName || 'Student' }}.</span>
 </h1>
 <p class="text-xs font-bold text-gray-400 tracking-widest leading-none">Your campus companion, delivered fast.</p>
 </div>
 <div class="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
 <span class="relative flex h-1.5 w-1.5">
 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
 </span>
 <span class="text-emerald-700 text-[11px] font-bold tracking-wider">Vendors Online</span>
 </div>
 </div>

 <div class="relative group z-20 max-w-xl">
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search for food, drinks, or errands..." 
 @keyup.enter="handleSearch"
 class="w-full pl-10 pr-5 py-3.5 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-4 focus:ring-parentPrimary/5 focus:border-parentPrimary transition-all text-sm font-bold placeholder:text-gray-300"
 >
 <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
 <Search class="w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-all" />
 </div>
 </div>
 </section>

 <!-- Services & Tools -->
 <section class="space-y-8">
 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <!-- Meal Planner Widget -->
 <NuxtLink to="/meal-planner" class="group relative bg-gray-900 rounded-2xl p-6 overflow-hidden border-b-2 border-gray-800 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98]">
 <div class="absolute -right-12 -top-12 w-32 h-32 bg-parentPrimary/10 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-1000" />
 <div class="relative z-10 flex items-center gap-4">
 <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:bg-white/10 transition-colors">🥗</div>
 <div class="space-y-0.5">
 <h4 class="text-base font-black text-white tracking-tighter">Meal Planner</h4>
 <p class="text-[8px] font-bold text-gray-500 tracking-[0.2em]">Budget & Track</p>
 </div>
 </div>
 </NuxtLink>

 <!-- Custom Errand Widget -->
 <NuxtLink to="/errands/custom" class="group relative bg-white rounded-2xl p-6 overflow-hidden border border-gray-50 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] active:scale-[0.98]">
 <div class="absolute -right-12 -top-12 w-32 h-32 bg-parentPrimary/5 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-1000" />
 <div class="relative z-10 flex items-center gap-4">
 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl shadow-inner border border-white group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">📍</div>
 <div class="space-y-0.5">
 <h4 class="text-base font-black text-gray-900 transition-colors tracking-tighter">Order Anything</h4>
 <p class="text-[8px] font-bold text-parentPrimary tracking-[0.2em]">Custom Errand</p>
 </div>
 </div>
 </NuxtLink>
 </div>

 <div class="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
 <button v-for="cat in categories" :key="cat.name" class="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-parentPrimary hover:scale-105 transition-all group min-w-[120px]">
 <span class="text-lg group-hover:scale-110 transition-transform">{{ cat.emoji }}</span>
 <span class="text-[11px] font-bold tracking-wider text-gray-600 group-hover:text-gray-900">{{ cat.name }}</span>
 </button>
 </div>
 </section>

 <!-- Popular Vendors -->
 <section class="space-y-8">
 <div class="flex items-end justify-between px-2">
 <div class="space-y-1">
 <h2 class="text-xl font-bold text-gray-900 tracking-tight">Popular Vendors</h2>
 <p class="text-[9px] font-bold text-gray-400 tracking-widest">Top rated partners on campus</p>
 </div>
 <NuxtLink to="/vendors" class="text-parentPrimary text-xs font-bold tracking-[0.2em] hover:tracking-[0.3em] transition-all">All Vendors &rarr;</NuxtLink>
 </div>

 <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-[2.5rem] p-4 animate-pulse h-64 border border-gray-100" />
 </div>

 <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 <NuxtLink 
 v-for="vendor in onlineVendors.slice(0, 3)" 
 :key="vendor._id" 
 :to="`/vendors/${vendor._id}`" 
 class="bg-white rounded-[2rem] p-4 border border-gray-50 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 group relative overflow-hidden"
 >
 <div class="relative h-48 rounded-[1.5rem] overflow-hidden mb-6 shadow-inner">
 <img :src="vendor.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop'" class="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-all duration-1000" />
 <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
 <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-xl text-[9px] font-bold text-gray-900 shadow-sm border border-white/50">
 {{ vendor.preparationTime || '20' }} mins
 </div>
 </div>
 <div class="flex items-center gap-4 px-2 pb-2">
 <div class="relative">
 <img :src="vendor.logo || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop'" class="w-12 h-12 rounded-xl object-cover border border-white shadow-md transition-transform duration-700 group-hover:scale-105 bg-white" />
 <div class="absolute -right-0.5 -bottom-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm" />
 </div>
 <div class="flex-1 min-w-0">
 <h3 class="font-bold text-gray-900 truncate tracking-tight text-lg leading-none mb-1">{{ vendor.storeName }}</h3>
 <div class="flex items-center gap-3">
 <div class="flex items-center gap-1">
 <Star class="w-3 h-3 text-amber-500 fill-current" />
 <span class="text-[10px] font-bold text-gray-900">{{ vendor.rating?.toFixed(1) || 'NEW' }}</span>
 </div>
 <div class="w-1 h-1 rounded-full bg-gray-200" />
 <span class="text-xs font-bold text-emerald-600 tracking-widest">Open</span>
 </div>
 </div>
 </div>
 </NuxtLink>
 </div>
 </section>

 <!-- Join Errandr -->
 <section class="relative bg-gray-900 rounded-2xl p-8 lg:p-10 overflow-hidden group border-b-[4px] border-gray-800 shadow-lg">
 <div class="absolute -right-32 -bottom-32 w-[400px] h-[400px] bg-parentPrimary/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
 <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
 <div class="space-y-4">
 <div class="inline-flex items-center gap-2 px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-white text-[7px] font-bold tracking-[0.2em]">
 Student Program
 </div>
 <h2 class="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mt-2">
 Earn as an <br class="hidden sm:block" /><span class="text-parentPrimary">Errandr Provider.</span>
 </h2>
 <p class="text-gray-400 text-[11px] font-bold leading-relaxed max-w-sm">Join the network, deliver essentials, and earn money on your campus schedule.</p>
 <a href="http://dispatch.errandr.shop/auth/register" class="inline-flex items-center gap-3 px-8 py-3.5 bg-parentPrimary text-white rounded-xl font-bold text-[10px] shadow-lg shadow-parentPrimary/20 hover:scale-105 transition-all">
 Get Started <ArrowRight class="w-3.5 h-3.5" />
 </a>
 </div>
 </div>
 </section>

 <!-- New on Errandr -->
 <section v-if="onlineVendors.length > 3" class="space-y-8">
 <div class="flex items-center gap-4 px-2">
 <h2 class="text-[10px] font-black text-gray-400 tracking-widest">Fresh Arrivals</h2>
 <div class="flex-1 h-px bg-gray-100" />
 </div>
 <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
 <NuxtLink v-for="vendor in onlineVendors.slice(3, 8)" :key="vendor._id" :to="`/vendors/${vendor._id}`" class="group">
 <div class="aspect-square rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-gray-100 shadow-sm p-3 sm:p-6 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-parentPrimary transition-all duration-500 relative overflow-hidden">
 <img :src="vendor.logo || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop'" class="w-16 h-16 rounded-2xl object-cover mb-4 border border-gray-50 group-hover:scale-105 transition-all duration-700 relative z-10" />
 <h4 class="font-bold text-gray-900 text-[11px] leading-tight w-full truncate px-2 relative z-10">{{ vendor.storeName }}</h4>
 <p class="text-[9px] font-bold text-parentPrimary tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10">Visit &rarr;</p>
 </div>
 </NuxtLink>
 </div>
 </section>
 </div>
</template>

<script setup lang="ts">
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';
import { Search, Star, Clock, MapPin, Bike, ArrowRight } from 'lucide-vue-next';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
 layout: 'student'
})

const router = useRouter();
const { user } = useUser();
const { loading, onlineVendors, fetchHomeData } = useLandingPage();

const searchQuery = ref('');

const handleSearch = () => {
 if (searchQuery.value.trim()) {
 router.push({ path: '/search', query: { q: searchQuery.value } });
 }
};

onMounted(fetchHomeData);

const categories = [
 { name: 'Food', emoji: '🍱' },
 { name: 'Groceries', emoji: '🛒' },
 { name: 'Drinks', emoji: '🧃' },
 { name: 'Snacks', emoji: '🥨' },
 { name: 'Pharmacy', emoji: '💊' },
];

useHead({
 title: 'Home - Errandr',
 meta: [
 { name: 'description', content: 'Campus delivery made simple. Order food and essentials from student-favorite vendors.' },
 ],
});
</script>

<style scoped>
.animate-float {
 animation: float 6s ease-in-out infinite;
}
@keyframes float {
 0%, 100% { transform: translateY(0) rotate(0); }
 50% { transform: translateY(-20px) rotate(5deg); }
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>