<template>
  <div class="space-y-10 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Header & Search -->
    <header class="px-2 pt-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div class="space-y-1">
          <h1 class="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none">
            Welcome, <span class="text-parentPrimary ">{{ user?.firstName || 'Student' }}.</span>
          </h1>
          <p class="text-sm font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck class="w-3 h-3 text-parentPrimary" />
            {{ user?.isPro ? 'PRO HUB MEMBER' : 'STANDARD CAMPUS MEMBER' }}
          </p>
        </div>
        
        <div class="flex items-center gap-4 bg-gray-50 border border-gray-100 p-2.5 rounded-2xl">
          <div class="flex items-center gap-3 px-3">
             <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i" class="w-7 h-7 rounded-full border-2 border-white bg-emerald-50 flex items-center justify-center">
                   <Check class="w-3.5 h-3.5 text-emerald-600" />
                </div>
             </div>
             <p class="text-[11px] font-bold text-emerald-600 tracking-tight leading-none">
                {{ onlineVendors.length || '...' }} Vendors Active
             </p>
          </div>
        </div>
      </div>

      <div class="relative group z-20 max-w-2xl">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Where are we ordering from today?" 
          @keyup.enter="handleSearch"
          class="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-[2.5rem] focus:ring-4 focus:ring-parentPrimary/10 focus:border-parentPrimary transition-all text-base font-bold tracking-tight placeholder:text-gray-300 shadow-none outline-none"
        >
        <div class="absolute left-6 top-1/2 -translate-y-1/2">
          <Search class="w-5 h-5 text-gray-400 group-focus-within:text-parentPrimary transition-all" />
        </div>
      </div>
    </header>

    <!-- Quick Stats Grid -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
      <div v-for="stat in quickStats" :key="stat.label" 
        class="bg-white border-2 border-gray-50 rounded-[2rem] p-6 flex flex-col gap-4 group transition-all cursor-pointer hover:border-parentPrimary hover:bg-gray-50/50"
        @click="router.push(stat.link || '/dashboard')"
      >
        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" :class="stat.bgColor">
          <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
        </div>
        <div>
          <p class="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none">{{ stat.label }}</p>
          <div class="flex items-end gap-1">
             <p class="text-xl font-black text-gray-900 tracking-tighter leading-none">{{ stat.value }}</p>
             <span v-if="stat.suffix" class="text-sm font-bold text-gray-300  mb-0.5">{{ stat.suffix }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Essential Services -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch px-2">
      <!-- Meal Planner Portfolio -->
      <div class="lg:col-span-8 group relative bg-gray-900 rounded-[3rem] p-8 md:p-12 overflow-hidden border-2 border-transparent hover:border-parentPrimary transition-all">
         <div class="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
            <div class="space-y-8 max-w-sm">
               <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-parentPrimary/20 transition-all">
                  <UtensilsCrossed class="w-6 h-6 text-parentPrimary" />
               </div>
               <div>
                  <h4 class="text-4xl font-black text-white tracking-tighter leading-[0.9] mb-4">Meal <br/>Planner.</h4>
                  <p class="text-sm font-medium text-gray-500 leading-relaxed">Save up to <span class="text-parentPrimary font-black">25%</span> by planning your campus nutrition ahead of time.</p>
               </div>
               <NuxtLink to="/meal-planner" class="inline-flex items-center gap-4 px-10 py-5 bg-parentPrimary text-white rounded-2xl font-black text-[11px] uppercase  hover:scale-105 active:scale-95 transition-all">
                  SET WEEKLY PLAN <ArrowRight class="w-4 h-4" />
               </NuxtLink>
            </div>
            
            <div class="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md w-full md:w-auto min-w-[280px]">
               <div class="flex justify-between items-start mb-8">
                  <p class="text-sm font-black text-gray-500 uppercase tracking-[.2em]">Live Budget</p>
                  <div class="px-3 py-1 bg-parentPrimary/10 border border-parentPrimary/20 rounded-full text-sm font-black text-parentPrimary">REPLENISHED</div>
               </div>
               <div class="space-y-2 mb-8">
                  <p class="text-4xl font-black text-white tracking-tighter leading-none">₦12,500</p>
                  <p class="text-sm font-bold text-emerald-500 uppercase ">Available Balance</p>
               </div>
               <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-parentPrimary w-[65%] transition-all duration-1000"></div>
               </div>
            </div>
         </div>
      </div>

      <!-- Quick Errand Action -->
      <NuxtLink to="/errands/custom" class="lg:col-span-4 group relative bg-white border-2 border-gray-100 rounded-[3rem] p-8 flex flex-col justify-between items-center text-center hover:border-parentPrimary transition-all active:scale-[0.98]">
         <div class="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-gray-900 transition-all duration-500 transform group-hover:scale-105">
            <PackageSearch class="w-10 h-10 text-gray-300 group-hover:text-parentPrimary" />
         </div>
         <div class="space-y-2">
            <h4 class="text-2xl font-black text-gray-900 tracking-tighter leading-none">Request Anything</h4>
            <p class="text-sm font-black text-parentPrimary uppercase tracking-[0.3em]">Personal Errand Partner</p>
         </div>
         <div class="text-sm font-black text-gray-300 bg-gray-50 px-6 py-3 rounded-xl group-hover:text-gray-900 transition-colors uppercase ">START ORDER</div>
      </NuxtLink>
    </section>

    <!-- Quest Section -->
    <section class="px-2">
       <div class="bg-white border-2 border-gray-100 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group hover:border-amber-400/50 transition-all">
          <div class="absolute right-0 top-0 w-64 h-full bg-amber-50/50 -skew-x-12 translate-x-12 group-hover:scale-105 transition-transform"></div>
          <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
             <div class="space-y-6">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100/50 border border-amber-200 rounded-xl">
                   <Zap class="w-4 h-4 text-amber-500 fill-current" />
                   <span class="text-sm font-black text-amber-900 uppercase  leading-none">Featured Campus Quest</span>
                </div>
                <div>
                   <h3 class="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3 ">The Early Bird.</h3>
                   <p class="text-sm font-bold text-gray-500 leading-relaxed max-w-sm">Order breakfast before <span class="text-gray-900 font-black">9:30 AM</span> to earn a bonus **150 points** instantly!</p>
                </div>
             </div>
             
             <div class="flex flex-col items-center md:items-end gap-6">
                <div class="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-3xl">
                   <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                      <Coffee class="w-6 h-6 text-amber-600" />
                   </div>
                   <div class="space-y-1.5 min-w-[140px]">
                      <div class="flex justify-between text-sm font-black text-gray-400 uppercase ">
                         <span>Progress</span>
                         <span class="text-amber-600">75%</span>
                      </div>
                      <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div class="h-full bg-amber-500 w-[75%]" />
                      </div>
                   </div>
                </div>
                <NuxtLink to="/dashboard/quests" class="text-[11px] font-black text-parentPrimary uppercase tracking-[.2em] hover:opacity-70 flex items-center gap-2">
                   View All Challenges <ChevronRight class="w-4 h-4" />
                </NuxtLink>
             </div>
          </div>
       </div>
    </section>

    <!-- Popular Vendors -->
    <section class="space-y-10">
      <div class="flex items-end justify-between px-2">
        <div class="space-y-2">
          <h2 class="text-3xl font-black text-gray-900 tracking-tighter leading-none ">Campus Favorites.</h2>
          <p class="text-sm font-black text-gray-400 uppercase tracking-[0.2em] leading-none">The most ordered spots right now</p>
        </div>
        <NuxtLink to="/vendors" class="bg-gray-100 hover:bg-gray-900 hover:text-white px-6 py-3 rounded-2xl text-sm font-black uppercase  transition-all">
          Explore Market
        </NuxtLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-[3rem] p-4 animate-pulse h-64" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        <NuxtLink 
          v-for="vendor in onlineVendors.slice(0, 3)" 
          :key="vendor._id" 
          :to="`/vendors/${vendor._id}`" 
          class="bg-white border-2 border-gray-50 rounded-[3rem] p-5 hover:border-parentPrimary transition-all duration-500 group"
        >
          <div class="relative h-60 rounded-[2.5rem] overflow-hidden mb-6">
            <img :src="vendor.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop'" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div class="absolute top-5 right-5 bg-white px-4 py-2.5 rounded-2xl text-sm font-black text-gray-900 border border-gray-100  flex items-center gap-2">
              <Timer class="w-3.5 h-3.5 text-parentPrimary" />
              {{ vendor.preparationTime || '20' }} MINS
            </div>
          </div>
          <div class="flex items-center gap-4 px-3 pb-2">
            <div class="relative">
              <img :src="vendor.logo || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop'" class="w-16 h-16 rounded-3xl object-cover border-4 border-white overflow-hidden bg-gray-50 transition-colors" />
              <div class="absolute -right-1 -bottom-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white" title="Accepting Orders" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-black text-gray-900 group-hover:text-parentPrimary truncate tracking-tighter text-2xl leading-none mb-1 transition-colors">{{ vendor.storeName }}</h3>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <Star class="w-4 h-4 text-amber-500 fill-current" />
                  <span class="text-sm font-black text-gray-900">{{ vendor.rating?.toFixed(1) || 'NEW' }}</span>
                </div>
                <div class="w-1.5 h-1.5 rounded-full bg-gray-100" />
                <span class="text-sm font-black text-gray-400 uppercase ">Active Vendor</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Community Call -->
    <section class="mx-2">
      <div class="relative bg-gray-900 rounded-[4rem] p-12 lg:p-20 overflow-hidden group">
        <div class="absolute -right-20 -bottom-20 w-[600px] h-[600px] bg-parentPrimary/10 rounded-full blur-[140px]" />
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm font-black uppercase tracking-[0.3em]">
               Hustle Partner <span class="w-2 h-2 rounded-full bg-parentPrimary animate-pulse"></span>
            </div>
            <h2 class="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter ">
              Turn your walks <br/>
              into <span class="text-parentPrimary underline decoration-wavy decoration-white/10">Paydays.</span>
            </h2>
            <p class="text-gray-500 text-base font-medium leading-relaxed max-w-sm">Join hundreds of students earning over ₦25,000 monthly by delivering on their own schedule.</p>
            <a href="http://dispatch.erranders.org/auth/register" class="inline-flex items-center gap-6 px-12 py-6 bg-parentPrimary text-white rounded-[2rem] font-black text-[11px] uppercase  hover:scale-105 active:scale-95 transition-all">
              Apply to Deliver <ArrowRight class="w-5 h-5" />
            </a>
          </div>
          <div class="hidden lg:grid grid-cols-2 gap-6">
             <div v-for="stat in [{val: '₦2k+', lab: 'Orders Starting at'}, {val: '20m', lab: 'Avg Delivery'}, {val: 'Daily', lab: 'Instant Payouts'}, {val: '100+', lab: 'Active Drivers'}]" :key="stat.lab" class="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
                 <span class="text-3xl font-black text-white  tracking-tighter">{{ stat.val }}</span>
                 <span class="text-sm font-black text-gray-500 uppercase  mt-2">{{ stat.lab }}</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';
import { 
  Search, Star, Timer, MapPin, ArrowRight, ShieldCheck, 
  Check, Trophy, Flame, BarChart3, Shield, UtensilsCrossed, 
  PackageSearch, Zap, Coffee, ChevronRight 
} from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'student'
})

const router = useRouter();
const { user } = useUser();
const { loading, onlineVendors, fetchHomeData } = useLandingPage();
const { showToast } = useCustomToast();

const searchQuery = ref('');

const quickStats = computed(() => [
  { 
    label: 'Rewards', 
    value: `${user.value?.points || 0}`, 
    suffix: 'PTS',
    icon: Trophy, 
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    link: '/dashboard/quests'
  },
  { 
    label: 'Streak', 
    value: `${user.value?.streakCount || 0}`, 
    suffix: 'DAYS',
    icon: Flame, 
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  { 
    label: 'Campus Rank', 
    value: `#${(user.value?.points || 0) > 1000 ? '1' : '42'}`, 
    icon: BarChart3, 
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    link: '/dashboard/leaderboard'
  },
  { 
    label: 'Status', 
    value: user.value?.isPro ? 'PRO HUB' : 'Standard', 
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
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>