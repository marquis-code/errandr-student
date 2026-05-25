<template>
  <div class="min-h-screen bg-gray-50/60 pb-36 selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Profile Hero -->
    <div class="relative overflow-hidden bg-white">
      <!-- Decorative gradient blob -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-parentPrimary/8 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-16 -left-16 w-48 h-48 bg-parentPrimary/5 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 px-5 pt-10 pb-8">
        <!-- Avatar + Info -->
        <div class="flex flex-col items-center text-center">
          <div class="relative mb-5">
            <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-parentPrimary to-orange-400 flex items-center justify-center text-white text-3xl font-medium shadow-lg shadow-parentPrimary/20 ring-4 ring-white transform hover:rotate-3 transition-transform duration-500">
              {{ user?.firstName?.[0] }}{{ user?.lastName?.[0] }}
            </div>
            <div class="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-emerald-400 rounded-xl border-[3px] border-white flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            </div>
          </div>

          <h1 class="text-2xl font-medium text-gray-900 tracking-tight leading-none">{{ fullName }}</h1>
          <p class="text-sm text-gray-400 font-semibold mt-1.5">{{ user?.email }}</p>

          <div class="flex items-center gap-2.5 mt-4 flex-wrap justify-center">
            <span v-if="user?.matricNumber" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">
              <Shield class="w-3 h-3 text-gray-400" />
              {{ user?.matricNumber }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-parentPrimary/8 text-parentPrimary rounded-xl text-xs font-bold">
              <Info class="w-3 h-3" />
              Joined 2024
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 pt-5 space-y-5 max-w-lg mx-auto animate-fade-in">
      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white rounded-2xl p-4 border border-gray-100 text-center group hover:border-parentPrimary/20 transition-colors duration-300">
          <div class="w-9 h-9 mx-auto mb-2.5 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ShoppingBag class="w-4.5 h-4.5 text-blue-500" />
          </div>
          <p class="text-xl font-medium text-gray-900 leading-none">{{ user?.ordersCount || 0 }}</p>
          <p class="text-[11px] text-gray-400 font-semibold mt-1">Orders</p>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-gray-100 text-center group hover:border-parentPrimary/20 transition-colors duration-300">
          <div class="w-9 h-9 mx-auto mb-2.5 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Wallet class="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <p class="text-xl font-medium text-gray-900 leading-none">₦{{ balance || 0 }}</p>
          <p class="text-[11px] text-gray-400 font-semibold mt-1">Wallet</p>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-gray-100 text-center group hover:border-parentPrimary/20 transition-colors duration-300">
          <div class="w-9 h-9 mx-auto mb-2.5 rounded-xl bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Heart class="w-4.5 h-4.5 text-rose-500" />
          </div>
          <p class="text-xl font-medium text-gray-900 leading-none">{{ user?.favoritesCount || 0 }}</p>
          <p class="text-[11px] text-gray-400 font-semibold mt-1">Favorites</p>
        </div>
      </div>

      <!-- Account Section -->
      <div>
        <div class="flex items-center gap-3 px-1 mb-2.5">
          <h3 class="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase">Account</h3>
          <div class="flex-1 h-px bg-gray-100" />
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
          <NuxtLink to="/dashboard/orders" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ClipboardList class="w-5 h-5 text-blue-500" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">My orders</span>
              <span class="text-xs text-gray-400 block mt-0.5">Track and manage your deliveries</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>

          <NuxtLink to="/dashboard/wallet" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Wallet class="w-5 h-5 text-emerald-500" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">My wallet</span>
              <span class="text-xs text-gray-400 block mt-0.5">Manage funds and transactions</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>

          <NuxtLink to="/dashboard/profile/addresses" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin class="w-5 h-5 text-amber-500" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">Saved addresses</span>
              <span class="text-xs text-gray-400 block mt-0.5">Your delivery locations</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>

          <NuxtLink to="/dashboard/profile/payments" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard class="w-5 h-5 text-purple-500" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">Payment methods</span>
              <span class="text-xs text-gray-400 block mt-0.5">Cards and billing info</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>
        </div>
      </div>

      <!-- Preferences Section -->
      <div>
        <div class="flex items-center gap-3 px-1 mb-2.5">
          <h3 class="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase">Preferences</h3>
          <div class="flex-1 h-px bg-gray-100" />
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
          <NuxtLink to="/dashboard/profile/notifications" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-parentPrimary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bell class="w-5 h-5 text-parentPrimary" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">Notifications</span>
              <span class="text-xs text-gray-400 block mt-0.5">Alerts and push preferences</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>

          <NuxtLink to="/dashboard/profile/security" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Shield class="w-5 h-5 text-sky-500" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">Security</span>
              <span class="text-xs text-gray-400 block mt-0.5">Password and account safety</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>
        </div>
      </div>

      <!-- Support Section -->
      <div>
        <div class="flex items-center gap-3 px-1 mb-2.5">
          <h3 class="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase">Support</h3>
          <div class="flex-1 h-px bg-gray-100" />
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
          <NuxtLink to="/support" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HelpCircle class="w-5 h-5 text-teal-500" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">Help center</span>
              <span class="text-xs text-gray-400 block mt-0.5">FAQs and customer support</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>

          <NuxtLink to="/terms" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText class="w-5 h-5 text-gray-400" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">Terms & conditions</span>
              <span class="text-xs text-gray-400 block mt-0.5">Legal and usage policies</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>

          <NuxtLink to="/about" class="flex items-center gap-4 px-4 py-4 group active:bg-gray-50 transition-colors duration-200">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Info class="w-5 h-5 text-indigo-400" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-bold text-gray-900 block">About Errandr</span>
              <span class="text-xs text-gray-400 block mt-0.5">Version and app info</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>
        </div>
      </div>

      <!-- Sign Out -->
      <div class="pt-2 pb-4">
        <button
          @click="logOut()"
          class="w-full py-4 bg-white rounded-2xl text-sm font-bold text-rose-500 border border-rose-100 hover:bg-rose-50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5"
        >
          <LogOut class="w-4 h-4" />
          <span>Sign out</span>
        </button>
        <p class="text-center text-[11px] text-gray-300 mt-4 font-medium">Errandr v1.0 · Made with ♥</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Heart,
  ShoppingBag,
  Wallet,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  Info,
  LogOut,
  ChevronRight,
  ClipboardList,
  Settings,
} from 'lucide-vue-next';
import { useUser } from '@/composables/modules/auth/user';
import { useAuth } from '@/composables/modules/auth';
import { useWallet } from '@/composables/modules/wallets';

const { user, fullName } = useUser();
const { logOut } = useAuth();
const { balance } = useWallet();

definePageMeta({
  layout: 'student',
});

useHead({ title: 'Profile - Errandr' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
