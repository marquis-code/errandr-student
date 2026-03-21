<template>
  <div class="max-w-xl mx-auto space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Identity Header -->
    <div class="bg-white p-6 md:p-12 rounded-3xl md:rounded-[4rem] border border-gray-100 shadow-sm text-center relative overflow-hidden group mt-8">
      <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div class="relative z-10">
        <div class="w-24 h-24 bg-gray-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-white text-3xl font-bold shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
          {{ user?.firstName?.[0] }}{{ user?.lastName?.[0] }}
        </div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight leading-none">{{ fullName }}</h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">{{ user?.email }}</p>
        <div v-if="user?.matricNumber" class="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-parentPrimary/10 text-parentPrimary rounded-xl border border-parentPrimary/20 text-[9px] font-bold uppercase tracking-widest">
           ID: {{ user?.matricNumber }}
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="space-y-4">
      <div class="flex items-center gap-4 px-6 mb-8 mt-12">
         <div class="w-10 h-px bg-gray-200" />
         <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">My Account</h3>
         <div class="flex-1 h-px bg-gray-200" />
      </div>

      <div class="grid grid-cols-1 gap-4">
        <NuxtLink to="/orders" class="p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-gray-900 hover:text-white transition-all duration-500 shadow-sm border border-gray-100 bg-white">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-inner">
             <ClipboardList class="w-7 h-7 text-gray-400 group-hover:text-parentPrimary transition-colors" />
          </div>
          <div class="flex-1">
             <span class="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-50">History</span>
             <span class="text-xl font-bold tracking-tight">My Orders</span>
          </div>
          <ChevronRight class="w-6 h-6 text-gray-300 group-hover:translate-x-2 transition-transform" />
        </NuxtLink>

        <div class="p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-gray-900 hover:text-white transition-all duration-500 shadow-sm border border-gray-100 bg-white cursor-pointer">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-inner">
             <MapPin class="w-7 h-7 text-gray-400 group-hover:text-parentPrimary transition-colors" />
          </div>
          <div class="flex-1">
             <span class="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-50">Locations</span>
             <span class="text-xl font-bold tracking-tight">Saved Addresses</span>
          </div>
          <ChevronRight class="w-6 h-6 text-gray-300 group-hover:translate-x-2 transition-transform" />
        </div>

        <div class="p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-gray-900 hover:text-white transition-all duration-500 shadow-sm border border-gray-100 bg-white cursor-pointer">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-inner">
             <CreditCard class="w-7 h-7 text-gray-400 group-hover:text-parentPrimary transition-colors" />
          </div>
          <div class="flex-1">
             <span class="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-50">Billing</span>
             <span class="text-xl font-bold tracking-tight">Payment Methods</span>
          </div>
          <ChevronRight class="w-6 h-6 text-gray-300 group-hover:translate-x-2 transition-transform" />
        </div>

        <div class="p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-gray-900 hover:text-white transition-all duration-500 shadow-sm border border-gray-100 bg-white cursor-pointer">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-inner">
             <Settings class="w-7 h-7 text-gray-400 group-hover:text-parentPrimary transition-colors" />
          </div>
          <div class="flex-1">
             <span class="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-50">Preferences</span>
             <span class="text-xl font-bold tracking-tight">Account Settings</span>
          </div>
          <ChevronRight class="w-6 h-6 text-gray-300 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </div>

    <!-- Logout Area -->
    <div class="pt-12 px-4">
      <button @click="logOut()" class="w-full py-6 bg-gray-50 text-rose-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:scale-[1.02] active:scale-95 transition-all shadow-sm border border-gray-100">
        Log Out
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
