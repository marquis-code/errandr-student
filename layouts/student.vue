<template>
  <div class="min-h-screen bg-gray-50 flex selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <FullScreenLoader />
    
    <!-- Premium Desktop Navigation (Floating Sidebar) -->
    <aside class="hidden lg:flex flex-col w-72 h-[calc(100vh-2rem)] fixed left-4 top-4 bottom-4 transition-all duration-700 z-50">
      <div class="h-full bg-white/80 backdrop-blur-2xl rounded-3xl flex flex-col p-6 overflow-hidden relative group border border-white shadow-xl shadow-black/5">
        <!-- Ambient Glow -->
        <div class="absolute -right-20 -top-20 w-40 h-40 bg-parentPrimary/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
        
        <!-- Logo -->
        <div class="mb-10 px-4 pt-4 relative z-10 flex items-center gap-4">
          <div class="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-parentPrimary transition-colors duration-500 transform group-hover:rotate-6">
            <ShoppingBag class="w-6 h-6" />
          </div>
          <div class="flex flex-col">
             <span class="text-2xl font-bold text-gray-900 tracking-tighter leading-none mb-0.5">Errandr</span>
             <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Your Campus Companion</span>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 space-y-2 relative z-10">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-6 py-4 text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all group/nav relative overflow-hidden"
            :class="isActive(item.path) 
              ? 'bg-gray-900 text-white shadow-md shadow-black/10' 
              : 'text-gray-400 hover:text-gray-900 hover:bg-white/50'"
          >
            <component :is="item.icon" class="w-5 h-5 mr-4 transition-transform group-hover/nav:scale-110" />
            {{ item.label }}
            <div v-if="isActive(item.path)" class="absolute right-4 w-1.5 h-1.5 rounded-full bg-parentPrimary shadow-[0_0_10px_rgba(6,95,219,0.8)]" />
          </NuxtLink>
        </nav>

        <!-- Profile Section -->
        <div class="mt-auto pt-6 border-t border-gray-100 relative z-10">
          <div @click="router.push('/profile')" class="flex items-center gap-4 p-4 rounded-3xl hover:bg-white/50 transition-all cursor-pointer group/profile">
             <div class="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-xl group-hover/profile:scale-110 transition-transform text-center">
               {{ userInitials }}
             </div>
             <div class="flex-1 min-w-0">
                <p class="text-[10px] font-bold text-gray-900 uppercase tracking-tight truncate">{{ userDisplayName }}</p>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">Student Member</p>
             </div>
          </div>
          
          <button
            @click="handleLogoutClick"
            class="mt-4 flex items-center w-full px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50/50 rounded-2xl transition-all"
          >
            <LogOut class="w-4 h-4 mr-4" />
            Log Out
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 w-full animate-fade-in shadow-sm">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
            <ShoppingBag class="w-5 h-5" />
          </div>
          <span class="text-xl font-bold text-gray-900 tracking-tighter uppercase">Errandr</span>
        </div>
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-white transition-all"
        >
          <Menu class="w-5 h-5 text-gray-900" />
        </button>
      </div>
    </header>

    <!-- Mobile Panel -->
    <Transition name="slide">
      <aside
        v-if="showMobileMenu"
        class="lg:hidden w-80 h-full fixed left-0 top-0 z-50 animate-fade-in px-4 py-4"
      >
        <div class="h-full bg-white rounded-3xl flex flex-col p-8 overflow-hidden shadow-2xl shadow-black/20">
          <!-- Mobile Header -->
          <div class="flex items-center justify-between mb-12">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white text-lg shadow-xl">
                 <ShoppingBag class="w-5 h-5" />
              </div>
              <span class="font-bold text-gray-900 uppercase tracking-tighter">Errandr</span>
            </div>
            <button
              @click="showMobileMenu = false"
              class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100"
            >
              <X class="w-5 h-5 text-gray-900" />
            </button>
          </div>

          <!-- Mobile Nav -->
          <nav class="flex-1 space-y-3 pb-20">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-6 py-5 text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all"
              :class="isActive(item.path) 
                ? 'bg-gray-900 text-white shadow-2xl' 
                : 'text-gray-400 hover:bg-gray-50'"
              @click="showMobileMenu = false"
            >
              <component :is="item.icon" class="w-5 h-5 mr-4" />
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- Mobile Exit -->
          <div class="mt-auto space-y-4">
             <button
              @click="handleLogoutClick"
              class="flex items-center justify-center w-full px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-50/50 rounded-2xl"
            >
              <LogOut class="w-4 h-4 mr-3" />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 lg:ml-80 transition-all duration-700 p-4 lg:p-6 pb-24">
      <!-- Adaptive Header -->
      <div class="hidden lg:block mb-8 animate-fade-in">
        <div class="flex items-center justify-between bg-white/50 backdrop-blur-xl rounded-3xl px-10 py-6 border border-white/50 shadow-sm">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tighter uppercase leading-none mb-1 font-display text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-parentPrimary to-indigo-600">{{ pageTitle }}</h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ pageDescription }}</p>
          </div>
          <div class="flex items-center gap-6">
             <div class="flex flex-col items-end">
                <span class="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">Errandr Status</span>
                <div class="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                   <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span class="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">All Systems Go</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Live Workspace -->
      <div class="rounded-3xl overflow-hidden min-h-[calc(100vh-12rem)] relative">
        <slot />
      </div>
    </main>

     <Transition
  enter-active-class="transition ease-out duration-300"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"
  leave-active-class="transition ease-in duration-200"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
  <div
    v-if="logoutModalOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    @click.self="logoutModalOpen = false"
  >
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="logoutModalOpen"
        class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 flex flex-col items-center text-center space-y-5"
      >
        <!-- Icon -->
        <div class="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <LogOut class="w-7 h-7 text-rose-500" />
        </div>

        <!-- Content -->
        <div class="space-y-1">
          <h3 class="text-xl font-bold text-gray-900">
            Leaving already?
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed font-bold">
            You’ll be signed out of your account.  
            Don’t worry — your Errandr data will be waiting for you ✨
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 w-full pt-2">
          <button
            @click="logoutModalOpen = false"
            class="w-full px-4 py-3 rounded-full text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Stay logged in
          </button>

          <button
            @click="confirmLogout"
            class="w-full px-4 py-3 rounded-full text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </Transition>
  </div>
</Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useRouter, useRoute } from 'vue-router'
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { user } = useUser()
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/profile', label: 'My Profile', icon: User }
]

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Welcome to Errandr', description: 'Find what you need, delivered fast' },
  '/search': { title: 'Search Errandr', description: 'Explore items and vendors' },
  '/orders': { title: 'Your Orders', description: 'Track your active and past orders' },
  '/favorites': { title: 'Favorites', description: 'Your most loved items and vendors' },
  '/profile': { title: 'My Profile', description: 'Manage your Errandr account' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Errandr Companion')

const userDisplayName = computed(() => {
  if (!user.value) return 'Student'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'Student'
})

const userInitials = computed(() => {
  if (!user.value) return 'S'
  const first = user.value.firstName || ''
  const last = user.value.lastName || ''
  return (first[0] || last[0] || user.value.email?.[0] || 'S').toUpperCase()
})

const handleLogoutClick = () => {
  logoutModalOpen.value = true
}

const isActive = (path: string) => route.path === path

const confirmLogout = () => {
  if (process.client) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    logoutModalOpen.value = false
    window.location.reload()
  }
}

watch(() => route.path, () => showMobileMenu.value = false)
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
