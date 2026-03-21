<template>
  <div class="space-y-16 pb-20">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10rem] -left-[10rem] w-[40rem] h-[40rem] bg-white/5 rounded-full blur-[120px]" />
        <div class="absolute -bottom-[10rem] -right-[10rem] w-[40rem] h-[40rem] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white mb-4 animate-fade-in-slow">
          🚀 Solving Campus Hunger, One Errand at a Time
        </div>
        
        <h1 class="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
          The <span class="text-primary-100">Wait</span> for <br/>
          Good Food <span class="italic text-primary-200">is Over.</span>
        </h1>

        <p class="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Tired of long cafeteria queues or those 10 PM study hunger pangs? Errandr brings your favorite treats right to your door.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <NuxtLink to="/vendors" class="bg-white text-primary-700 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform w-full sm:w-auto shadow-lg group">
            Get Started
            <span class="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
          </NuxtLink>
          <NuxtLink to="/search" class="bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors w-full sm:w-auto border border-white/20">
            Search Menu
          </NuxtLink>
        </div>

        <!-- Problem Point Chips -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-8 text-white/60">
          <span class="text-xs font-bold uppercase tracking-widest">❌ No more queues</span>
          <span class="w-1.5 h-1.5 rounded-full bg-white/30"></span>
          <span class="text-xs font-bold uppercase tracking-widest">❌ No late-night hunger</span>
          <span class="w-1.5 h-1.5 rounded-full bg-white/30"></span>
          <span class="text-xs font-bold uppercase tracking-widest">✅ 100% Student-to-Student</span>
        </div>
      </div>
    </section>

    <!-- Why Errandr? Features -->
    <section class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-card p-8 group hover:scale-[1.02] transition-all duration-500 cursor-default">
        <div class="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">⚡</div>
        <h3 class="text-xl font-bold text-dark-900 mb-3">Insanely Fast</h3>
        <p class="text-dark-500 leading-relaxed text-sm">Fellow students are already on campus. They know the shortcuts and the fastest ways to get your food to your hostel before it gets cold.</p>
      </div>

      <div class="glass-card p-8 group hover:scale-[1.02] transition-all duration-500 cursor-default">
        <div class="w-14 h-14 rounded-2xl bg-accent-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-accent-600 group-hover:text-white transition-colors">🍛</div>
        <h3 class="text-xl font-bold text-dark-900 mb-3">Local Favorites</h3>
        <p class="text-dark-500 leading-relaxed text-sm">From the best Jollof on campus to that hidden snack spot outside the gate. We've got all your campus favorites listed and ready to go.</p>
      </div>

      <div class="glass-card p-8 group hover:scale-[1.02] transition-all duration-500 cursor-default">
        <div class="w-14 h-14 rounded-2xl bg-success-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-success-600 group-hover:text-white transition-colors">✨</div>
        <h3 class="text-xl font-bold text-dark-900 mb-3">Real-time Tracking</h3>
        <p class="text-dark-500 leading-relaxed text-sm">Watch your errand in real-time from the moment it's picked up until it arrives at your doorstep. No more guessing games.</p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="max-w-7xl mx-auto px-6 py-16 bg-dark-50 rounded-3xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-6">
          <h2 class="text-3xl md:text-5xl font-black text-dark-900 leading-tight">
            Stop sacrificing study <br/>
            time for <span class="text-primary-600">food runs.</span>
          </h2>
          <p class="text-dark-500 text-lg leading-relaxed">
            We understand the struggle. You have exams to prep for, projects to finish, and 8 AMs to catch. Errandr was built by students, for students, to ensure you stay nourished without losing your flow.
          </p>
          <ul class="space-y-3">
            <li class="flex items-center gap-3 text-dark-800 font-semibold">
              <span class="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-[10px]">✓</span> 
              Supporting Student Entrepreneurs
            </li>
            <li class="flex items-center gap-3 text-dark-800 font-semibold">
              <span class="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-[10px]">✓</span> 
              Safe & Secure In-App Payments
            </li>
            <li class="flex items-center gap-3 text-dark-800 font-semibold">
              <span class="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-[10px]">✓</span> 
              Reliable Errander Network
            </li>
          </ul>
        </div>
        <div class="relative">
          <div class="aspect-square bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1526367790999-015078648c7a?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
          </div>
          <!-- Floating stats -->
          <div class="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-lg border border-dark-100 animate-bounce-slow">
            <p class="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-1">Average Delivery</p>
            <p class="text-2xl font-black text-dark-900">12-18 MINS</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Vendors -->
    <section class="max-w-7xl mx-auto px-6 space-y-8">
      <div class="flex items-end justify-between">
        <div class="space-y-1">
          <h2 class="text-3xl font-bold text-dark-900">Top Campus Spots</h2>
          <p class="text-dark-500">The most loved vendors in your community.</p>
        </div>
        <NuxtLink to="/vendors" class="text-xs font-bold text-primary-600 uppercase tracking-widest hover:text-primary-700">View All →</NuxtLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CorePulseLoader variant="card" :count="3" />
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <NuxtLink v-for="vendor in onlineVendors.slice(0, 3)" :key="vendor._id" :to="`/vendors/${vendor._id}`" class="glass-card group p-3 rounded-2xl">
          <div class="relative h-48 rounded-xl overflow-hidden mb-4">
            <img :src="vendor.banner || '/placeholder-vendor.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-dark-900/50 via-transparent to-transparent opacity-40"></div>
          </div>
          <div class="px-2 pb-2 flex items-start gap-3">
             <img :src="vendor.logo || '/placeholder-logo.jpg'" class="w-12 h-12 rounded-xl object-cover border border-dark-100" />
             <div class="flex-1 min-w-0">
               <h3 class="text-lg font-bold text-dark-900 truncate">{{ vendor.storeName }}</h3>
               <div class="flex items-center gap-3 mt-1 text-xs font-medium text-dark-500">
                <span class="text-primary-600">⭐ {{ vendor.rating?.toFixed(1) || 'New' }}</span>
                <span>{{ vendor.preparationTime || '20' }} mins</span>
              </div>
             </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Call to action -->
    <section class="max-w-7xl mx-auto px-6">
      <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 md:p-20 text-center space-y-6 relative overflow-hidden">
        <h2 class="text-3xl md:text-5xl font-black text-white leading-tight relative z-10">
          Ready to erase <br class="hidden md:block" /> the hunger?
        </h2>
        <p class="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto relative z-10">
          Join thousands of students who trust Errandr for their daily campus needs.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
          <NuxtLink to="/auth/register" class="bg-white text-primary-700 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform w-full sm:w-auto shadow-lg">Create Account</NuxtLink>
          <NuxtLink to="/auth/login" class="bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors w-full sm:w-auto border border-white/20">Sign In</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useLandingPage } from '@/composables/modules/landing';
import { onMounted } from 'vue';
// import { useHead } from '#imports';

const { loading, onlineVendors, fetchHomeData } = useLandingPage();

onMounted(fetchHomeData);

useHead({
  title: 'Errandr | Your Campus, Delivered',
  meta: [
    { name: 'description', content: 'The #1 delivery app for students. Order food, groceries, and pharmacy items from campus vendors with fast delivery by fellow students.' },
  ],
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in-slow {
  animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-bounce-slow {
  animation: bounceSlow 4s ease-in-out infinite;
}
@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
