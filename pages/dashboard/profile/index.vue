<template>
  <div class="max-w-xl mx-auto space-y-6 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary pt-8 px-4">
    <!-- Compact Identity Header -->
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div class="relative z-10 flex items-center gap-6">
        <div class="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md transform group-hover:rotate-3 transition-transform duration-500">
          {{ user?.firstName?.[0] }}{{ user?.lastName?.[0] }}
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-black text-gray-900 leading-none truncate uppercase tracking-tighter">{{ fullName }}</h1>
          <p class="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{{ user?.email }}</p>
          <div v-if="user?.matricNumber" class="inline-flex items-center gap-2 mt-3 px-2 py-1 bg-gray-50 text-gray-500 rounded-lg border border-gray-100 text-[9px] font-black uppercase tracking-widest">
            ID: {{ user?.matricNumber }}
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="space-y-4">
      <div class="flex items-center gap-4 px-2">
         <h3 class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Account settings</h3>
         <div class="flex-1 h-px bg-gray-50" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- My Orders -->
        <NuxtLink to="/dashboard/orders" class="p-4 rounded-2xl flex items-center gap-4 group hover:bg-gray-50 transition-all duration-300 border border-gray-50 bg-white">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
             <ClipboardList class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
             <span class="text-[11px] font-black text-gray-900 block truncate uppercase tracking-widest">My orders</span>
             <span class="text-[9px] text-gray-400 block mt-0.5 font-bold uppercase tracking-tighter">History</span>
          </div>
          <ChevronRight class="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>

        <!-- Saved Addresses -->
        <NuxtLink to="/dashboard/profile/addresses" class="p-4 rounded-2xl flex items-center gap-4 group hover:bg-gray-50 transition-all duration-300 border border-gray-50 bg-white cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
             <MapPin class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
             <span class="text-[11px] font-black text-gray-900 block truncate uppercase tracking-widest">Addresses</span>
             <span class="text-[9px] text-gray-400 block mt-0.5 font-bold uppercase tracking-tighter">Locations</span>
          </div>
          <ChevronRight class="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>

        <!-- Payment Methods -->
        <NuxtLink to="/dashboard/profile/payments" class="p-4 rounded-2xl flex items-center gap-4 group hover:bg-gray-50 transition-all duration-300 border border-gray-50 bg-white cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
             <CreditCard class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
             <span class="text-[11px] font-black text-gray-900 block truncate uppercase tracking-widest">Payments</span>
             <span class="text-[9px] text-gray-400 block mt-0.5 font-bold uppercase tracking-tighter">Cards</span>
          </div>
          <ChevronRight class="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>

        <!-- Account Settings -->
        <NuxtLink to="/dashboard/profile/security" class="p-4 rounded-2xl flex items-center gap-4 group hover:bg-gray-50 transition-all duration-300 border border-gray-50 bg-white cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
             <Settings class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
             <span class="text-[11px] font-black text-gray-900 block truncate uppercase tracking-widest">Security</span>
             <span class="text-[9px] text-gray-400 block mt-0.5 font-bold uppercase tracking-tighter">Password</span>
          </div>
          <ChevronRight class="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>
    </div>

    <!-- Help & Support Section -->
    <div class="space-y-4">
      <div class="flex items-center gap-4 px-2">
         <h3 class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Support</h3>
         <div class="flex-1 h-px bg-gray-50" />
      </div>
      
      <div class="bg-gray-50/50 rounded-2xl p-2 space-y-1">
        <NuxtLink to="/support" class="w-full p-3 rounded-xl flex items-center justify-between hover:bg-white transition-all duration-300 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
          <span>Get help</span>
          <ChevronRight class="w-3.5 h-3.5 text-gray-300" />
        </NuxtLink>
        <NuxtLink to="/terms" class="w-full p-3 rounded-xl flex items-center justify-between hover:bg-white transition-all duration-300 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
          <span>Terms</span>
          <ChevronRight class="w-3.5 h-3.5 text-gray-300" />
        </NuxtLink>
      </div>
    </div>

    <!-- Logout Area -->
    <div class="pt-6">
      <button 
        @click="logOut()" 
        class="w-full py-4 bg-white text-rose-500 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-rose-50 transition-all border border-rose-50 active:scale-95 flex items-center justify-center gap-2"
      >
        <span>Sign out</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ClipboardList, 
  MapPin, 
  CreditCard, 
  Settings, 
  ChevronRight 
} from 'lucide-vue-next';
import { useUser } from '@/composables/modules/auth/user';
import { useAuth } from '@/composables/modules/auth';

const { user, fullName } = useUser();
const { logOut } = useAuth();

definePageMeta({
  layout: 'student'
})

useHead({ title: 'Profile - Errandr' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
