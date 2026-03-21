<template>
  <div class="space-y-16 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Search & Welcome -->
    <section class="relative">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
        <div class="space-y-2">
          <h1 class="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
            Hello, <span class="text-transparent bg-clip-text bg-gradient-to-r from-parentPrimary to-indigo-600">{{ user?.firstName || 'Student' }}.</span>
          </h1>
          <p class="text-sm font-bold text-gray-400">Everything you need on campus, delivered fast.</p>
        </div>
        <div class="hidden md:flex items-center gap-3 px-5 py-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl shadow-sm">
           <span class="relative flex h-2 w-2">
             <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           <span class="text-emerald-700 text-xs font-bold uppercase tracking-wider">Vendors Online</span>
        </div>
      </div>

      <div class="relative group z-20">
        <div class="absolute inset-x-0 -bottom-1 h-[6px] bg-gray-900/5 rounded-full blur-xl group-focus-within:bg-parentPrimary/20 transition-all duration-500" />
        <input 
          type="text" 
          placeholder="Search for food, snacks, or errands..." 
          class="w-full pl-16 pr-8 py-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-lg shadow-gray-200/20 focus:ring-8 focus:ring-parentPrimary/5 focus:border-parentPrimary/30 transition-all text-xl font-bold placeholder:text-gray-300"
        >
        <div class="absolute left-8 top-1/2 -translate-y-1/2">
           <Search class="w-6 h-6 text-gray-400 group-focus-within:text-parentPrimary group-focus-within:scale-110 transition-all" />
        </div>
      </div>
    </section>

    <!-- Services & Tools -->
    <section class="space-y-10">
      <div class="flex items-center gap-4 px-2">
         <div class="w-10 h-px bg-gray-200" />
         <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Featured Services</h3>
         <div class="flex-1 h-px bg-gray-200" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <!-- Meal Planner Widget -->
        <NuxtLink to="/meal-planner" class="group relative bg-gray-900 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 overflow-hidden border-b-[8px] md:border-b-[12px] border-gray-800 shadow-lg transition-all hover:-translate-y-2">
           <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
           <div class="relative z-10 flex items-center gap-8">
              <div class="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-inner animate-float">🥗</div>
              <div class="space-y-1">
                 <h4 class="text-2xl font-bold text-white tracking-tight">Meal Planner</h4>
                 <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan your budget</p>
              </div>
           </div>
        </NuxtLink>

        <!-- Custom Errand Widget -->
        <NuxtLink to="/errands/custom" class="group relative bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-2">
           <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
           <div class="relative z-10 flex items-center gap-8">
              <div class="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-4xl shadow-inner border border-white group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">📍</div>
              <div class="space-y-1">
                 <h4 class="text-2xl font-bold text-gray-900 tracking-tight transition-colors">Request Errand</h4>
                 <p class="text-[10px] font-bold text-parentPrimary uppercase tracking-widest">Anything, anywhere</p>
              </div>
           </div>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4 lg:gap-6 overflow-x-auto pb-8 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <button v-for="cat in categories" :key="cat.name" class="flex-shrink-0 flex flex-col items-center gap-4 p-5 md:p-6 bg-white rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-2 hover:bg-gray-900 hover:text-white transition-all duration-500 group min-w-[110px] md:min-w-[130px] relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-inner border border-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 relative z-10">
            {{ cat.emoji }}
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider relative z-10">{{ cat.name }}</span>
        </button>
      </div>
    </section>

    <!-- Popular Vendors -->
    <section class="space-y-10">
      <div class="flex items-end justify-between px-4">
        <div class="space-y-1">
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight leading-none">Popular Vendors</h2>
          <p class="text-sm font-bold text-gray-400">Top rated vendors near you</p>
        </div>
        <NuxtLink to="/vendors" class="px-6 py-3 bg-gray-50 text-gray-900 text-xs font-bold rounded-xl border border-gray-100 hover:bg-gray-900 hover:text-white transition-all">View All &rarr;</NuxtLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div v-for="i in 3" :key="i" class="bg-gray-100/50 rounded-3xl md:rounded-[3.5rem] p-4 animate-pulse h-[400px] border border-gray-100" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <NuxtLink 
          v-for="vendor in onlineVendors.slice(0, 3)" 
          :key="vendor._id" 
          :to="`/vendors/${vendor._id}`" 
          class="bg-white rounded-3xl md:rounded-[3.5rem] p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-700 group relative overflow-hidden"
        >
          <div class="relative h-56 md:h-64 rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-6 md:mb-8 shadow-inner">
            <img :src="vendor.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop'" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-60" />
            <div class="absolute top-6 right-6 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-bold text-gray-900 shadow-lg border border-white/50">
               Arrive in {{ vendor.preparationTime || '20' }} mins
            </div>
          </div>
          <div class="flex items-center gap-6 px-4 pb-4">
             <div class="relative">
                <img :src="vendor.logo || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop'" class="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg transition-transform duration-700 group-hover:scale-110 bg-white" />
                <div class="absolute -right-1 -bottom-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
             </div>
             <div class="flex-1 min-w-0">
               <h3 class="font-bold text-gray-900 truncate tracking-tight text-2xl leading-none mb-2">{{ vendor.storeName }}</h3>
               <div class="flex items-center gap-4">
                 <div class="flex items-center gap-1.5">
                    <Star class="w-3 h-3 text-amber-500 fill-current" />
                    <span class="text-[11px] font-bold text-gray-900 uppercase tracking-wider">{{ vendor.rating?.toFixed(1) || 'NEW' }}</span>
                 </div>
                 <div class="w-1 h-1 rounded-full bg-gray-300" />
                 <span class="text-[10px] font-bold text-parentPrimary uppercase tracking-wider">Fast Delivery</span>
               </div>
             </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Join Errandr -->
    <section class="relative bg-gray-900 rounded-3xl lg:rounded-[5rem] p-8 lg:p-16 overflow-hidden group border-b-[8px] lg:border-b-[16px] border-gray-800 shadow-lg shadow-parentPrimary/10">
      <div class="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-parentPrimary/10 rounded-full blur-[150px] group-hover:scale-125 transition-transform duration-1000" />
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <div class="space-y-8">
            <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-wider">
               Student Program
            </div>
            <h2 class="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tight">
               Earn as an <br /><span class="text-parentPrimary">Errandr.</span>
            </h2>
            <p class="text-gray-400 text-lg font-bold leading-relaxed max-w-md">Join the network, deliver essentials, and earn money on your own schedule.</p>
            <a href="http://errandr.localhost:3000/auth/register" class="inline-flex items-center gap-4 px-12 py-6 bg-parentPrimary text-white rounded-2xl font-bold text-sm shadow-lg shadow-parentPrimary/30 hover:scale-105 active:scale-95 transition-all">
               Join Now <ArrowRight class="w-5 h-5" />
            </a>
         </div>
         <div class="hidden lg:flex justify-end pr-10">
            <div class="w-72 h-72 bg-white/5 rounded-3xl md:rounded-[4rem] backdrop-blur-3xl border border-white/10 flex items-center justify-center text-9xl animate-float shadow-lg">
               <Bike class="w-40 h-40 text-parentPrimary opacity-20" />
            </div>
         </div>
      </div>
    </section>

    <!-- New on Errandr -->
    <section v-if="onlineVendors.length > 3" class="space-y-10">
      <div class="flex items-center gap-4 px-2">
         <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">New on Errandr</h2>
         <div class="flex-1 h-px bg-gray-100" />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
         <NuxtLink v-for="vendor in onlineVendors.slice(3, 8)" :key="vendor._id" :to="`/vendors/${vendor._id}`" class="group">
            <div class="aspect-square rounded-3xl md:rounded-[3.5rem] bg-white border border-gray-100 shadow-sm p-4 md:p-8 flex flex-col items-center justify-center text-center hover:shadow-lg hover:scale-105 hover:bg-gray-900 transition-all duration-500 relative overflow-hidden">
              <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-50 to-transparent group-hover:from-white/5 transition-all" />
              <img :src="vendor.logo || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop'" class="w-20 h-20 rounded-[1.5rem] object-cover mb-6 border-2 border-gray-50 group-hover:scale-110 group-hover:border-white/10 transition-all duration-700 relative z-10" />
              <h4 class="font-bold text-gray-900 group-hover:text-white text-xs leading-none w-full truncate px-2 relative z-10">{{ vendor.storeName }}</h4>
              <p class="text-[10px] font-bold text-parentPrimary uppercase tracking-wider mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10">Order &rarr;</p>
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