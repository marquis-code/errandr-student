<template>
  <div class="space-y-8 pb-24 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary px-4 md:px-6">
    
    <!-- Clean Header & Search -->
    <header class="pt-6 pb-2">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <ShieldCheck class="w-3.5 h-3.5 text-parentPrimary" />
            {{ user?.isPro ? 'Pro Member' : 'Campus Member' }}
          </p>
          <h1 class="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight leading-none">
            Welcome back, <span class="text-parentPrimary">{{ user?.firstName || 'Student' }}.</span>
          </h1>
        </div>
        
        <!-- <div class="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
          <div class="flex -space-x-1.5">
             <div v-for="i in Math.min(3, onlineVendors.length || 3)" :key="i" class="w-5 h-5 rounded-full border border-white bg-emerald-50 flex items-center justify-center">
                <Check class="w-3 h-3 text-emerald-600" />
             </div>
          </div>
          <p class="text-[10px] font-bold text-emerald-600 tracking-wide leading-none pl-1">
             {{ onlineVendors.length || 'Loading' }} Active
          </p>
        </div> -->
      </div>

      <!-- Search Bar -->
      <!-- <div class="relative max-w-xl group">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="What are you craving today?" 
          @keyup.enter="handleSearch"
          class="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-parentPrimary/10 focus:border-parentPrimary transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400 shadow-sm outline-none"
        >
        <div class="absolute left-4 top-1/2 -translate-y-1/2">
          <Search class="w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
        </div>
      </div> -->
    </header>

    <!-- Quick Stats -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="stat in quickStats" :key="stat.label" 
        class="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-parentPrimary/30 hover:bg-gray-50/50 transition-all cursor-pointer group"
        @click="router.push(stat.link || '/dashboard')"
      >
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="stat.bgColor">
          <component :is="stat.icon" class="w-4 h-4" :class="stat.iconColor" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{{ stat.label }}</p>
          <div class="flex items-baseline gap-1">
             <p class="text-sm font-medium text-gray-900 tracking-tight">{{ stat.value }}</p>
             <span v-if="stat.suffix" class="text-[9px] font-bold text-gray-400">{{ stat.suffix }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions / Services -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Custom Errand -->
      <NuxtLink to="/errands/custom" class="bg-gray-900 rounded-2xl p-6 flex items-center justify-between group overflow-hidden relative">
        <div class="absolute right-0 top-0 w-32 h-32 bg-parentPrimary/10 rounded-full blur-[40px] -mr-10 -mt-10"></div>
        <div class="relative z-10">
          <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
            <PackageSearch class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-base font-medium text-white tracking-tight mb-1">Send an Errander</h3>
          <p class="text-xs text-gray-400 font-medium">Need something picked up or dropped off?</p>
        </div>
        <div class="w-10 h-10 bg-white text-gray-900 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-parentPrimary group-hover:text-white transition-colors relative z-10 shadow-lg">
          <ArrowRight class="w-4 h-4" />
        </div>
      </NuxtLink>

      <!-- Meal Planner -->
      <NuxtLink to="/meal-planner" class="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between group hover:border-parentPrimary/30 transition-all">
        <div>
          <div class="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-3">
            <UtensilsCrossed class="w-5 h-5 text-gray-600 group-hover:text-parentPrimary transition-colors" />
          </div>
          <h3 class="text-base font-medium text-gray-900 tracking-tight mb-1">Meal Planner</h3>
          <p class="text-xs text-gray-500 font-medium">Plan your week and save up to 25%</p>
        </div>
        <div class="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0 group-hover:text-parentPrimary transition-colors">
          <ArrowRight class="w-4 h-4" />
        </div>
      </NuxtLink>
    </section>

    <!-- Popular Vendors -->
    <section class="space-y-4 pt-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900 tracking-tight">Campus Favorites</h2>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Top picks for you</p>
        </div>
        <NuxtLink to="/vendors" class="text-xs font-medium text-parentPrimary hover:underline px-3 py-1.5 bg-parentPrimary/5 rounded-lg">
          View All
        </NuxtLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-2xl h-32 animate-pulse border border-gray-100" />
      </div>

      <div v-else-if="onlineVendors.length === 0" class="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-16 px-6 text-center group">
        <!-- Abstract glowing background -->
        <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/5 rounded-full blur-[50px] transition-all duration-700 group-hover:bg-parentPrimary/5"></div>

        <!-- Animated Icon Container -->
        <div class="relative z-10 w-20 h-20 bg-indigo-50/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-indigo-100/50 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
          <MoonStar class="w-10 h-10 text-indigo-400 animate-pulse" stroke-width="1.5" />
        </div>

        <!-- Typography -->
        <div class="relative z-10 space-y-3 mb-8 max-w-[280px] mx-auto">
          <h3 class="text-2xl font-medium text-gray-900 tracking-tight">Campus is Asleep</h3>
          <p class="text-[13px] text-gray-500 font-bold leading-relaxed">
            All our partner vendors are currently closed. Catch some rest and we'll be back serving hot meals soon!
          </p>
        </div>

        <!-- Info Pill & Actions -->
        <div class="relative z-10 flex flex-col items-center gap-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200/60 rounded-xl text-[11px] font-medium text-gray-500 uppercase tracking-widest">
            <Clock class="w-3.5 h-3.5 text-gray-400" />
            Opens at 8:00 AM
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-center mt-2">
            <button
              @click="fetchHomeData"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10 active:scale-95"
            >
              <RefreshCw class="w-4 h-4" />
              Refresh
            </button>
            <NuxtLink
              to="/vendors"
              class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
            >
              All Vendors
            </NuxtLink>
          </div>
          
          <!-- Network error notice -->
          <div v-if="fetchError === 'network'" class="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl">
            <WifiOff class="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <p class="text-[11px] font-medium text-rose-600 uppercase tracking-widest">No Connection</p>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink 
          v-for="vendor in onlineVendors.slice(0, 6)" 
          :key="vendor._id" 
          :to="`/vendors/${vendor._id}`" 
          class="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-4 hover:border-parentPrimary/30 transition-all group hover:shadow-sm"
        >
          <div class="relative w-20 h-20 shrink-0">
            <img :src="vendor.logo || vendor.banner || '/placeholder-store.jpg'" class="w-full h-full rounded-xl object-cover bg-gray-50" />
            <div class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Active" />
          </div>
          <div class="flex-1 min-w-0 py-1">
            <h3 class="text-sm font-medium text-gray-900 group-hover:text-parentPrimary truncate tracking-tight mb-1 transition-colors">{{ vendor.storeName }}</h3>
            <p class="text-xs text-gray-500 truncate mb-2">{{ vendor.category || 'Restaurant' }}</p>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span class="text-[10px] font-medium text-gray-900">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
              </div>
              <div class="flex items-center gap-1 text-gray-400">
                <Timer class="w-3.5 h-3.5" />
                <span class="text-[10px] font-bold">{{ vendor.preparationTime || '20' }} min</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';
import { 
  Search, Star, Timer, MapPin, ArrowRight, ShieldCheck, 
  Check, Trophy, Flame, BarChart3, UtensilsCrossed, 
  PackageSearch, Clock, RefreshCw, WifiOff, MoonStar
} from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'student'
})

const router = useRouter();
const { user } = useUser();
const { loading, onlineVendors, fetchError, fetchHomeData } = useLandingPage();
const { showToast } = useCustomToast();

const searchQuery = ref('');

const quickStats = computed(() => [
  { 
    label: 'Rewards', 
    value: `${user.value?.points || 0}`, 
    suffix: 'PTS',
    icon: Trophy, 
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    link: '/dashboard/quests'
  },
  { 
    label: 'Streak', 
    value: `${user.value?.streakCount || 0}`, 
    suffix: 'DAYS',
    icon: Flame, 
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50'
  },
  { 
    label: 'Rank', 
    value: `#${(user.value?.points || 0) > 1000 ? '1' : '42'}`, 
    icon: BarChart3, 
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    link: '/dashboard/leaderboard'
  },
  { 
    label: 'Status', 
    value: user.value?.isPro ? 'Pro' : 'Standard', 
    icon: ShieldCheck, 
    iconColor: user.value?.isPro ? 'text-white' : 'text-gray-400',
    bgColor: user.value?.isPro ? 'bg-parentPrimary' : 'bg-gray-50'
  }
])

const handleSearch = () => {
 if (searchQuery.value.trim()) {
  router.push({ path: '/search', query: { q: searchQuery.value } });
 }
};

onMounted(async () => {
  await fetchHomeData();
});

useHead({
  title: 'Dashboard - Errandr',
  meta: [
    { name: 'description', content: 'Campus life, elevated. Manage your orders, rewards, and meal plans.' },
  ],
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
</style>