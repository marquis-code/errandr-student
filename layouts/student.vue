<template>
  <div class="min-h-screen bg-white flex selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <FullScreenLoader />
    <Toast ref="toastRef" />
    
    <!-- Premium Desktop Navigation (Floating Sidebar) -->
    <aside class="hidden lg:flex flex-col w-60 h-[calc(100vh-2rem)] fixed left-4 top-4 bottom-4 transition-all duration-700 z-50">
      <div class="h-full bg-white rounded-3xl flex flex-col p-6 overflow-hidden relative group border border-gray-100 shadow-sm">
        <!-- Logo -->
        <div class="mb-10 px-4 pt-4 relative z-10 flex items-center gap-4">
          <div class="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-parentPrimary transition-all duration-500">
            <ShoppingBag class="w-5 h-5" />
          </div>
          <div class="flex flex-col">
             <span class="text-xl font-bold text-gray-900 tracking-tighter leading-none mb-0.5">Errandr</span>
             <span class="text-[8px] font-bold text-gray-400 leading-none">Your campus companion</span>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 space-y-1 relative z-10">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-5 py-3.5 text-[10px] font-bold rounded-2xl transition-all group/nav relative overflow-hidden"
            :class="isActive(item.path) 
              ? 'bg-gray-900 text-white shadow-md' 
              : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'"
          >
            <component :is="item.icon" class="w-4 h-4 mr-4 transition-transform group-hover/nav:scale-110" />
            {{ item.label }}
            <div v-if="isActive(item.path)" class="absolute right-4 w-1 h-1 rounded-full bg-parentPrimary shadow-[0_0_10px_rgba(6,95,219,0.8)]" />
          </NuxtLink>
        </nav>

        <!-- Profile Section -->
        <div class="mt-auto pt-6 border-t border-gray-100 relative z-10">
          <div @click="router.push('/dashboard/profile')" class="flex items-center gap-3 p-3 rounded-[1.5rem] hover:bg-gray-50 transition-all cursor-pointer group/profile">
             <div class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover/profile:scale-105 transition-transform text-center">
               {{ userInitials }}
             </div>
             <div class="flex-1 min-w-0">
                <p class="text-[9px] font-bold text-gray-900 truncate">{{ userDisplayName }}</p>
                <p class="text-[8px] font-bold text-gray-400 truncate">Student member</p>
             </div>
          </div>
          
          <button
            @click="handleLogoutClick"
            class="mt-4 flex items-center w-full px-6 py-4 text-[9px] font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut class="w-4 h-4 mr-4" />
            Log out
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white/90 backdrop-blur-xl border-b border-gray-50 sticky top-0 z-40 w-full animate-fade-in">
      <div class="flex items-center justify-between px-6 py-3">
        <div class="flex items-center gap-3">
          <div v-if="!isDashboard" @click="router.back()" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 mr-1 animate-fade-in-left">
            <ArrowLeft class="w-4 h-4 text-gray-900" />
          </div>
          <div v-else class="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            <ShoppingBag class="w-4 h-4" />
          </div>
          <span class="text-lg font-bold text-gray-900 tracking-tighter">{{ isDashboard ? 'Errandr' : pageTitle }}</span>
        </div>
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-white transition-all"
        >
          <Menu class="w-4 h-4 text-gray-900" />
        </button>
      </div>
    </header>



    <!-- Mobile Panel (Side Menu) -->
    <Transition name="slide">
      <aside
        v-if="showMobileMenu"
        class="lg:hidden w-80 h-full fixed left-0 top-0 z-[100] animate-fade-in px-4 py-4"
      >
        <div class="h-full bg-white rounded-[2.5rem] flex flex-col p-8 overflow-hidden shadow-2xl shadow-black/20 border border-gray-100">
          <div class="flex items-center justify-between mb-12">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white text-lg shadow-xl">
                 <ShoppingBag class="w-5 h-5" />
              </div>
              <span class="font-bold text-gray-900 tracking-tighter">Errandr</span>
            </div>
            <button
              @click="showMobileMenu = false"
              class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100"
            >
              <X class="w-5 h-5 text-gray-900" />
            </button>
          </div>

          <!-- Mobile Nav -->
          <nav class="flex-1 space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-6 py-4 text-[10px] font-bold rounded-2xl transition-all"
              :class="isActive(item.path) 
                ? 'bg-gray-900 text-white shadow-xl' 
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
              class="flex items-center justify-center w-full px-6 py-5 text-[10px] font-bold text-rose-500 bg-rose-50 rounded-2xl"
            >
              <LogOut class="w-4 h-4 mr-3" />
              Log out
            </button>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 lg:ml-64 transition-all duration-700 p-4 lg:p-10 pb-32">
      <!-- Adaptive Header (Desktop Only) -->
      <div v-if="!route.path.startsWith('/vendors')" class="hidden lg:block mb-8 animate-fade-in">
        <div class="flex items-center justify-between bg-white rounded-3xl px-8 py-6 border border-gray-100">
          <div class="flex items-center gap-6">
            <button v-if="!isDashboard" @click="router.back()" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-900 hover:text-white transition-all group">
              <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">{{ pageTitle }}</h1>
              <p class="text-[9px] font-bold text-gray-400 tracking-wider uppercase">{{ pageDescription }}</p>
            </div>
          </div>
          <div class="flex items-center gap-6">
             <div class="flex flex-col items-end">
                <span class="text-[8px] font-bold text-gray-300 mb-1 uppercase tracking-widest leading-none">Status</span>
                <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                   <div class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                   <span class="text-[8px] font-bold text-emerald-600 tracking-widest uppercase">All systems go</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Live Workspace -->
      <div class="rounded-3xl min-h-[calc(100vh-12rem)] relative">
        <slot />
      </div>
    </main>

    <!-- Logout Modal -->
    <Transition name="overlay">
      <div
        v-if="logoutModalOpen"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        @click.self="logoutModalOpen = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center space-y-6">
          <div class="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
            <LogOut class="w-8 h-8 text-rose-500" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold text-gray-900">Sign Out?</h3>
            <p class="text-sm text-gray-500 font-bold leading-relaxed">
              Are you sure you want to leave? Your active orders will still be processed.
            </p>
          </div>
          <div class="flex gap-3 w-full">
            <button @click="logoutModalOpen = false" class="flex-1 py-4 rounded-2xl text-[10px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all uppercase tracking-widest">Stay</button>
            <button @click="confirmLogout" class="flex-1 py-4 rounded-2xl text-[10px] font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all uppercase tracking-widest shadow-lg shadow-rose-200">Log out</button>
          </div>
        </div>
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
const { toasts, removeToast } = useToast()
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/dashboard/search', label: 'Search', icon: Search },
  { path: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { path: '/dashboard/profile', label: 'My Profile', icon: User }
]

const isDashboard = computed(() => route.path === '/dashboard' || route.path === '/')

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Welcome back to Errandr' },
  '/dashboard': { title: 'Dashboard', description: 'Welcome back to Errandr' },
  '/dashboard/search': { title: 'Search', description: 'Find anything on campus' },
  '/dashboard/orders': { title: 'My Errands', description: 'Track your active and past orders' },
  '/dashboard/favorites': { title: 'My Favorites', description: 'Your most loved items and vendors' },
  '/dashboard/profile': { title: 'My Profile', description: 'Manage your Errandr account' },
  '/errands/custom': { title: 'Request Errand', description: 'Anything you need, delivered on campus' },
  '/meal-planner': { title: 'Meal Planner', description: 'Budget and track your meals' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Store')
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

const isActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard' || route.path === '/';
  return route.path.startsWith(path);
}

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
