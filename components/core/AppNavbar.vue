<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-50 flex-shrink-0">
    <div class="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
      <!-- Left Side -->
      <div class="flex items-center gap-3">
        <button v-if="showBack" @click="router.back()" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all">
          <ArrowLeft class="w-4 h-4 text-gray-900" />
        </button>
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-parentPrimary transition-all duration-500">
            <ShoppingBag class="w-4 h-4" />
          </div>
          <span class="text-lg font-bold text-gray-900 tracking-tighter group-hover:text-parentPrimary transition-colors">Errandr</span>
        </NuxtLink>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-2 lg:gap-4">
        <!-- Search (Optional) -->
        <slot name="search" />

        <!-- Static Links for Visitors -->
        <div v-if="!user" class="hidden sm:flex items-center gap-4 mr-2">
          <NuxtLink to="/auth/login" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Log in</NuxtLink>
          <NuxtLink to="/auth/register" class="px-5 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-black/5 hover:bg-parentPrimary transition-all">Join</NuxtLink>
        </div>

        <!-- Notification Bell -->
        <Menu v-if="user" as="div" class="relative">
          <MenuButton class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all relative">
            <Bell class="w-4.5 h-4.5" />
            <div v-if="unreadCount > 0" class="absolute top-2 right-2 w-2 h-2 bg-parentPrimary rounded-full border-2 border-white shadow-sm"></div>
          </MenuButton>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="fixed inset-x-4 md:absolute md:inset-x-auto md:right-0 mt-20 md:mt-4 w-auto md:w-80 origin-top-right divide-y divide-gray-50 rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 focus:outline-none z-[75] overflow-hidden">
              <div class="px-6 py-4 bg-gray-50/50 flex justify-between items-center">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Notifications ({{ unreadCount }})</p>
                <NuxtLink to="/notifications" class="text-[9px] font-bold text-parentPrimary hover:underline">View All</NuxtLink>
              </div>
              <div class="p-4 flex flex-col items-center justify-center text-center space-y-3 py-10">
                <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                   <BellOff class="w-6 h-6 text-gray-200" />
                </div>
                <p class="text-xs font-bold text-gray-900 leading-none">No new alerts</p>
                <p class="text-[9px] font-bold text-gray-400 max-w-[180px]">We'll alert you here for order updates.</p>
              </div>
            </MenuItems>
          </Transition>
        </Menu>

        <!-- Cart (Always visible if relevant) -->
        <NuxtLink v-if="showCart" to="/cart" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all relative">
          <ShoppingCart class="w-4.5 h-4.5 text-gray-900" />
          <div v-if="cart.itemCount.value > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white border-2 border-white rounded-full flex items-center justify-center">
             <span class="text-[8px] font-bold">{{ cart.itemCount.value }}</span>
          </div>
        </NuxtLink>

        <!-- Profile Dropdown -->
        <Menu v-if="user" as="div" class="relative">
          <MenuButton class="flex items-center gap-2.5 p-1 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all p-1.5 px-2 focus:outline-none">
            <div class="w-7.5 h-7.5 lg:w-8 lg:h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-[10px] uppercase shadow-sm">
              {{ user.firstName?.[0] || user.email?.[0] }}
            </div>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 hidden lg:block" />
          </MenuButton>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="fixed inset-x-4 md:absolute md:inset-x-auto md:right-0 mt-20 md:mt-4 w-auto md:w-56 origin-top-right divide-y divide-gray-50 rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 focus:outline-none z-[75] overflow-hidden">
              <div class="px-5 py-4">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                <p class="text-xs font-black text-gray-900 truncate tracking-tight">{{ user.firstName }} {{ user.lastName }}</p>
              </div>
              <div class="p-1.5">
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/dashboard" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-2.5 text-xs font-bold transition-colors']">
                    <Home class="w-4 h-4 mr-3" /> Dashboard
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/dashboard/wallet" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-2.5 text-xs font-bold transition-colors']">
                    <Wallet class="w-4 h-4 mr-3" /> My Wallet
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/dashboard/profile" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-2.5 text-xs font-bold transition-colors']">
                    <User class="w-4 h-4 mr-3" /> My Profile
                  </NuxtLink>
                </MenuItem>
              </div>
              <div class="p-1.5">
                <MenuItem v-slot="{ active }">
                  <button @click="handleLogout" :class="[active ? 'bg-rose-50 text-rose-500' : 'text-rose-500', 'flex w-full items-center rounded-xl px-3 py-2.5 text-xs font-bold transition-colors uppercase tracking-widest']">
                    <LogOut class="w-4 h-4 mr-3" /> Log out
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUser } from '@/composables/modules/auth/user'
import { useCart } from '@/composables/modules/cart'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { 
  ShoppingBag, ShoppingCart, Bell, BellOff, Home, User, LogOut, ChevronDown, ArrowLeft, Wallet
} from 'lucide-vue-next'

defineProps({
  showBack: { type: Boolean, default: false },
  showCart: { type: Boolean, default: true }
})

const router = useRouter()
const { user, logOut } = useUser()
const cart = useCart()
const { unreadCount } = useNotifications()
useRealtimeNotifications()

const handleLogout = async () => {
  await logOut()
  window.location.reload()
}
</script>
