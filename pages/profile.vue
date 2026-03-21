<template>
  <div class="max-w-md mx-auto space-y-6 pb-20 md:pb-0">
    <div class="bg-white p-6 rounded-2xl border border-dark-100 shadow-sm text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
        {{ user?.firstName?.[0] }}{{ user?.lastName?.[0] }}
      </div>
      <h1 class="text-xl font-bold text-dark-900">{{ fullName }}</h1>
      <p class="text-dark-400 text-sm">{{ user?.email }}</p>
      <p v-if="user?.matricNumber" class="text-dark-500 text-xs mt-1">{{ user?.matricNumber }}</p>
    </div>

    <div class="space-y-2">
      <NuxtLink to="/orders" class="glass-card flex items-center gap-3">
        <ClipboardList class="w-5 h-5 text-dark-500" />
        <span class="text-dark-900 font-medium flex-1">My Orders</span>
        <ChevronRight class="w-5 h-5 text-dark-500" />
      </NuxtLink>
      <div class="glass-card flex items-center gap-3">
        <MapPin class="w-5 h-5 text-dark-500" />
        <span class="text-dark-900 font-medium flex-1">Delivery Address</span>
        <ChevronRight class="w-5 h-5 text-dark-500" />
      </div>
      <div class="glass-card flex items-center gap-3">
        <CreditCard class="w-5 h-5 text-dark-500" />
        <span class="text-dark-900 font-medium flex-1">Payment Methods</span>
        <ChevronRight class="w-5 h-5 text-dark-500" />
      </div>
      <div class="glass-card flex items-center gap-3">
        <Settings class="w-5 h-5 text-dark-500" />
        <span class="text-dark-900 font-medium flex-1">Settings</span>
        <ChevronRight class="w-5 h-5 text-dark-500" />
      </div>
    </div>

    <button @click="logOut()" class="btn-ghost w-full text-error-500 hover:text-error-600">
      Sign Out
    </button>
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
// import { navigateTo, useHead } from '#imports';

const { user, fullName, token } = useUser();
const { logOut } = useAuth();

definePageMeta({
  middleware: () => {
    const { token } = useUser();
    if (!token.value) return navigateTo('/auth/login');
  },
});

useHead({ title: 'Profile - Errandr' });
</script>
