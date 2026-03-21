<template>
  <div class="space-y-12 pb-24">
    <!-- Search & Welcome -->
    <section class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 tracking-tight">Craving something, {{ user?.firstName || 'Student' }}?</h1>
          <p class="text-gray-500 mt-2 font-medium">Find your campus favorites delivered in minutes.</p>
        </div>
        <div class="hidden md:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
           <span class="text-emerald-600 text-xs font-bold uppercase tracking-widest">● Available Now</span>
        </div>
      </div>

      <div class="relative group">
        <input 
          type="text" 
          placeholder="Search for restaurants, snacks, or groceries..." 
          class="w-full pl-14 pr-6 py-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/20 focus:ring-4 focus:ring-parentPrimary/10 focus:border-parentPrimary/30 transition-all text-lg font-medium"
        >
        <div class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl filter grayscale opacity-40 group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all">🔍</div>
      </div>
    </section>

    <!-- Categories -->
    <section class="space-y-4">
      <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 italic">Browse by Category</h3>
      <div class="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
        <button v-for="cat in categories" :key="cat.name" class="flex-shrink-0 flex flex-col items-center gap-3 p-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group min-w-[100px]">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-inner border border-white group-hover:bg-parentPrimary/10 transition-colors">
            {{ cat.emoji }}
          </div>
          <span class="text-xs font-bold text-gray-700 tracking-tight">{{ cat.name }}</span>
        </button>
      </div>
    </section>

    <!-- Featured Vendors -->
    <section class="space-y-6">
      <div class="flex items-end justify-between px-2">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Featured Hotspots ⚡</h2>
        <NuxtLink to="/vendors" class="text-[10px] font-bold text-parentPrimary uppercase tracking-widest hover:underline">Explore All</NuxtLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-white rounded-[2.5rem] p-4 border border-gray-100 animate-pulse h-64" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink 
          v-for="vendor in onlineVendors.slice(0, 3)" 
          :key="vendor._id" 
          :to="`/vendors/${vendor._id}`" 
          class="bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
        >
          <div class="relative h-48 rounded-[2rem] overflow-hidden mb-6">
            <img :src="vendor.banner || '/placeholder-vendor.jpg'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-parentPrimary shadow-sm uppercase tracking-widest">
              {{ vendor.preparationTime || '20-30' }} mins
            </div>
          </div>
          <div class="flex items-start gap-4 px-2 pb-2">
             <img :src="vendor.logo || '/placeholder-logo.jpg'" class="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md -mt-10 relative z-10 bg-white" />
             <div class="flex-1 min-w-0">
               <h3 class="font-bold text-gray-900 truncate tracking-tight text-lg">{{ vendor.storeName }}</h3>
               <div class="flex items-center gap-3 mt-1">
                 <span class="text-xs font-bold text-amber-500 flex items-center gap-1 group-hover:scale-110 transition-transform">⭐ {{ vendor.rating?.toFixed(1) || 'New' }}</span>
                 <span class="w-1 h-1 rounded-full bg-gray-200" />
                 <span class="text-xs font-semibold text-gray-400">Low Delivery Fee</span>
               </div>
             </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Marketing CTA -->
    <section class="relative bg-gray-900 rounded-[3rem] p-12 overflow-hidden group">
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
         <div class="space-y-6">
            <h2 class="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tighter">
              Become an <span class="text-parentPrimary italic">Errander.</span> <br />
              Earn while you walk.
            </h2>
            <p class="text-gray-400 text-lg font-medium">Support your fellow students and make some extra cash during your usual campus movements.</p>
            <NuxtLink to="/auth/errander-signup" class="inline-block px-10 py-4 bg-parentPrimary text-white rounded-2xl font-bold text-sm shadow-xl shadow-parentPrimary/20 hover:brightness-110 transition-all uppercase tracking-widest">Apply Now</NuxtLink>
         </div>
         <div class="hidden lg:flex justify-end">
            <div class="w-64 h-64 bg-white/5 rounded-[2.5rem] backdrop-blur-sm border border-white/10 flex items-center justify-center text-7xl animate-float">🚲</div>
         </div>
      </div>
    </section>

    <!-- Recent Favorites -->
    <section v-if="onlineVendors.length > 3" class="space-y-6">
      <div class="flex items-center justify-between px-2">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Latest on Campus</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
         <NuxtLink v-for="vendor in onlineVendors.slice(3, 8)" :key="vendor._id" :to="`/vendors/${vendor._id}`" class="space-y-3 group">
            <div class="aspect-square rounded-[2rem] bg-white border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all">
              <img :src="vendor.logo || '/placeholder-logo.jpg'" class="w-16 h-16 rounded-2xl object-cover mb-3 group-hover:scale-110 transition-transform" />
              <h4 class="font-bold text-gray-900 text-sm truncate w-full">{{ vendor.storeName }}</h4>
              <p class="text-[10px] font-bold text-parentPrimary uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View Menu</p>
            </div>
         </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';

definePageMeta({
  layout: 'student'
})

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