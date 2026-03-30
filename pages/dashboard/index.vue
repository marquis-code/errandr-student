<template>
 <div class="space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
  <!-- Search & Welcome -->
  <section class="relative px-2">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div class="space-y-1.5 pt-4">
        <h1 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none">
          Welcome, <span class="text-parentPrimary italic">{{ user?.firstName || 'Student' }}.</span>
        </h1>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none">Status: {{ user?.isPro ? 'PRO HUB MEMBER' : 'STANDARD CAMPUS MEMBER' }}</p>
      </div>
      
      <div class="flex items-center gap-4 bg-white border border-gray-100 p-2 rounded-2xl shadow-sm">
         <div class="flex -space-x-2 px-2">
            <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm transition-transform hover:scale-110 cursor-pointer">✓</div>
         </div>
         <div class="h-8 w-px bg-gray-100 mx-1"></div>
         <div class="pr-2 text-right">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Online Now</p>
            <p class="text-[11px] font-black text-emerald-600 tracking-tighter leading-none">42 Vendors Active</p>
         </div>
      </div>
    </div>

    <div class="relative group z-20 max-w-2xl mx-auto md:mx-0">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Where are we ordering from today?" 
        @keyup.enter="handleSearch"
        class="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-50 rounded-[2.5rem] shadow-xl shadow-black/5 focus:ring-8 focus:ring-parentPrimary/10 focus:border-parentPrimary transition-all text-base font-black tracking-tight placeholder:text-gray-300 placeholder:italic"
      >
      <div class="absolute left-5 top-1/2 -translate-y-1/2">
        <Search class="w-6 h-6 text-gray-400 group-focus-within:text-parentPrimary transition-all" />
      </div>
    </div>
  </section>

  <!-- High-Density Stat Bar -->
  <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
    <div v-for="stat in quickStats" :key="stat.label" 
      class="bg-white border-b-[3px] border-gray-100 hover:border-parentPrimary p-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm group transition-all cursor-pointer"
      @click="router.push(stat.link || '/dashboard')"
    >
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 group-hover:bg-gray-50" :class="stat.bgColor">
        {{ stat.icon }}
      </div>
      <div>
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none">{{ stat.label }}</p>
        <p class="text-xl font-black text-gray-900 tracking-tighter leading-none">{{ stat.value }}</p>
      </div>
    </div>
  </section>

  <!-- Primary Services -->
  <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch px-2">
    <!-- Meal Planner Large -->
    <div class="lg:col-span-8 group relative bg-gray-950 rounded-[3rem] p-10 overflow-hidden border-b-8 border-gray-900 shadow-2xl transition-all hover:scale-[1.01]">
       <div class="absolute -right-20 -top-20 w-80 h-80 bg-parentPrimary/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
       <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="space-y-6">
             <div class="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-2xl group-hover:rotate-6 transition-transform italic">🥗</div>
             <div>
                <h4 class="text-3xl font-black text-white tracking-tighter italic leading-none mb-2">My Meal Planner</h4>
                <p class="text-xs font-medium text-gray-500 max-w-[200px]">Save up to <span class="text-parentPrimary">25%</span> by planning your campus meals Weekly.</p>
             </div>
             <NuxtLink to="/meal-planner" class="inline-flex items-center gap-3 px-8 py-4 bg-parentPrimary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-parentPrimary/20 hover:scale-105 active:scale-95 transition-all">
                Plan Meals &rarr;
             </NuxtLink>
          </div>
          <div class="hidden md:block relative">
             <div class="absolute inset-0 bg-parentPrimary/10 blur-3xl animate-pulse"></div>
             <div class="relative bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Current Budget</p>
                <div class="flex items-end gap-2 mb-6">
                   <span class="text-3xl font-black text-white tracking-tighter">₦12,500</span>
                   <span class="text-[10px] font-black text-emerald-500 mb-1.5 uppercase tracking-widest">Left</span>
                </div>
                <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div class="h-full bg-parentPrimary w-[60%]"></div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Custom Errand Side -->
    <NuxtLink to="/errands/custom" class="lg:col-span-4 group relative bg-white border border-gray-100 rounded-[3rem] p-10 overflow-hidden shadow-sm hover:shadow-2xl hover:border-parentPrimary transition-all hover:scale-[1.01] flex flex-col justify-between items-center text-center">
       <div class="absolute -right-12 -top-12 w-32 h-32 bg-parentPrimary/5 rounded-full blur-[40px] group-hover:scale-125 transition-transform"></div>
       <div class="relative z-10 w-24 h-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center text-5xl shadow-inner border border-white group-hover:bg-gray-900 transition-all duration-500 mb-8 transform group-hover:scale-110">📍</div>
       <div class="relative z-10">
          <h4 class="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-2">Request Anything</h4>
          <p class="text-[10px] font-black text-parentPrimary uppercase tracking-[0.3em]">Personal Errandr</p>
       </div>
       <div class="mt-8 text-[11px] font-black text-gray-400 group-hover:text-gray-900 transition-colors">START ORDER &rarr;</div>
    </NuxtLink>
  </section>

  <!-- Discovery & Engagement Section -->
  <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
    <!-- Featured Quest Card (New) -->
    <div class="bg-white border border-gray-50 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
       <div class="absolute right-0 top-0 w-48 h-48 bg-emerald-50 rounded-bl-[8rem] group-hover:scale-110 transition-transform duration-700"></div>
       <div class="relative z-10 space-y-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg">
             <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
             <span class="text-[9px] font-black text-amber-700 uppercase tracking-widest">Featured Quest</span>
          </div>
          <div>
             <h3 class="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-2 italic">The Early Bird</h3>
             <p class="text-sm font-bold text-gray-400 leading-relaxed max-w-[250px]">Order breakfast before 9:30 AM to earn a bonus **150 points** instantly!</p>
          </div>
          <div class="flex items-center justify-between">
             <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg">🍳</div>
                <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div class="h-full bg-amber-500 w-[75%]"></div>
                </div>
             </div>
             <NuxtLink to="/dashboard/quests" class="text-[10px] font-black text-parentPrimary uppercase tracking-widest hover:underline">See All Quests</NuxtLink>
          </div>
       </div>
    </div>

    <!-- Hall of Fame Preview (Simplified) -->
    <div class="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform"></div>
        <div class="relative z-10 flex flex-col justify-between h-full">
           <div>
              <h4 class="text-xs font-black text-parentPrimary uppercase tracking-[0.3em] mb-4">Campus Leaderboard</h4>
              <div class="space-y-4 mb-10">
                 <div v-for="i in 3" :key="i" class="flex items-center gap-4">
                    <span class="text-lg font-black text-gray-600 italic">#{{ i }}</span>
                    <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10"></div>
                    <div class="flex-1 space-y-1">
                       <div class="h-2 w-24 bg-white/10 rounded-full"></div>
                       <div class="h-1.5 w-12 bg-white/5 rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>
           <NuxtLink to="/dashboard/leaderboard" class="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:scale-105 active:scale-95 transition-all">Visit Hall of Fame</NuxtLink>
        </div>
    </div>
  </section>

  <!-- How it Works Guide CTA -->
  <section class="px-2">
     <NuxtLink to="/dashboard/how-it-works" class="block bg-parentPrimary/5 border border-parentPrimary/10 border-dashed rounded-[3rem] p-10 text-center group transition-all hover:bg-parentPrimary/10">
        <div class="w-16 h-16 rounded-3xl bg-white border border-gray-100 flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all">🤔</div>
        <h3 class="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-2 italic">Confused on how Errandr works?</h3>
        <p class="text-xs font-bold text-gray-400 tracking-wider">Tap here to view our visualized guide on campus life optimization.</p>
     </NuxtLink>
  </section>

  <!-- Popular Vendors -->
  <section class="space-y-10">
    <div class="flex items-end justify-between px-2">
      <div class="space-y-1">
        <h2 class="text-2xl font-black text-gray-900 tracking-tighter leading-none italic">Campus Favorites</h2>
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">The most ordered spots right now</p>
      </div>
      <NuxtLink to="/vendors" class="bg-gray-50 px-6 py-2 rounded-xl text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all transform hover:-translate-y-1">View Market &rarr;</NuxtLink>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
      <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-[2.5rem] p-4 animate-pulse h-64 border border-gray-100" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
      <NuxtLink 
        v-for="vendor in onlineVendors.slice(0, 3)" 
        :key="vendor._id" 
        :to="`/vendors/${vendor._id}`" 
        class="bg-white rounded-[2.5rem] p-4 border border-gray-50 shadow-sm hover:shadow-2xl hover:border-gray-200 transition-all duration-500 group relative overflow-hidden"
      >
        <div class="relative h-56 rounded-[1.5rem] overflow-hidden mb-6 shadow-inner">
          <img :src="vendor.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop'" class="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-all duration-1000" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-black text-gray-900 shadow-sm border border-white/50 tracking-widest">
            {{ vendor.preparationTime || '20' }} MINS
          </div>
        </div>
        <div class="flex items-center gap-4 px-2 pb-2">
          <div class="relative">
            <img :src="vendor.logo || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop'" class="w-14 h-14 rounded-2xl object-cover border border-white shadow-md transition-transform duration-700 group-hover:scale-105 bg-white" />
            <div class="absolute -right-1 -bottom-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-black text-gray-900 group-hover:text-parentPrimary truncate tracking-tighter text-xl leading-none mb-1 transition-colors">{{ vendor.storeName }}</h3>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span class="text-xs font-black text-gray-900">{{ vendor.rating?.toFixed(1) || 'NEW' }}</span>
              </div>
              <div class="w-1 h-1 rounded-full bg-gray-200" />
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Partner</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>

  <!-- Community Call (Redesigned) -->
  <section class="relative bg-gray-950 rounded-[4rem] p-12 lg:p-16 overflow-hidden group shadow-2xl mx-2">
    <div class="absolute -right-32 -bottom-32 w-[500px] h-[500px] bg-parentPrimary/20 rounded-full blur-[120px] group-hover:scale-125 transition-transform duration-1000" />
    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <div class="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white text-[9px] font-black uppercase tracking-[0.3em]">
           Hustle Mode <div class="w-1.5 h-1.5 rounded-full bg-parentPrimary animate-pulse"></div>
        </div>
        <h2 class="text-3xl md:text-5xl font-black text-white leading-none tracking-tight italic">
          Turn your walks <br class="hidden sm:block" />
          into <span class="text-parentPrimary underline decoration-wavy decoration-white/20">Bank Checks.</span>
        </h2>
        <p class="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">Join the student providers making over ₦25,000 monthly delivering on their own schedule.</p>
        <a href="http://dispatch.errandr.shop/auth/register" class="inline-flex items-center gap-4 px-10 py-5 bg-parentPrimary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-parentPrimary/20 hover:scale-105 active:scale-95 transition-all">
          Join Dispatchers <ArrowRight class="w-4 h-4" />
        </a>
      </div>
      <div class="hidden lg:grid grid-cols-2 gap-4">
         <div v-for="stat in ['₦2k+', '20Mins', 'Daily', 'Weekly']" :key="stat" class="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
             <span class="text-2xl font-black text-white italic tracking-tighter">{{ stat }}</span>
             <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Goal</span>
         </div>
      </div>
    </div>
  </section>
 </div>
</template>

<script setup lang="ts">
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';
import { Search, Star, Clock, MapPin, Bike, ArrowRight, Copy } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
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
    value: `${user.value?.points || 0} PTS`, 
    icon: '💎', 
    bgColor: 'bg-amber-50',
    link: '/dashboard/quests'
  },
  { 
    label: 'Streak', 
    value: `${user.value?.streakCount || 0} Days`, 
    icon: '🔥', 
    bgColor: 'bg-orange-50'
  },
  { 
    label: 'Rank', 
    value: `#${(user.value?.points || 0) > 1000 ? '1' : '42'}`, 
    icon: '🏅', 
    bgColor: 'bg-blue-50',
    link: '/dashboard/leaderboard'
  },
  { 
    label: 'Status', 
    value: user.value?.isPro ? 'PRO HUB' : 'Standard', 
    icon: user.value?.isPro ? '💎' : '👑', 
    bgColor: user.value?.isPro ? 'bg-parentPrimary animate-pulse' : 'bg-gray-50'
  }
])

const copyReferral = (code: string) => {
  if (!code) return;
  navigator.clipboard.writeText(code);
  showToast({
    title: 'Copied!',
    message: 'Referral code copied to clipboard',
    toastType: 'success'
  });
};

const handleSearch = () => {
 if (searchQuery.value.trim()) {
 router.push({ path: '/search', query: { q: searchQuery.value } });
 }
};

onMounted(async () => {
  await fetchHomeData();
});

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