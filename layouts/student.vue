<template>
  <div class="min-h-screen bg-white flex flex-col lg:flex-row selection:bg-parentPrimary/10 selection:text-parentPrimary w-full overflow-x-hidden pt-safe">
    <FullScreenLoader></FullScreenLoader>
    <Toast ref="toastRef"></Toast>
    
    <!-- Premium Desktop Navigation (Floating Sidebar) -->
    <aside class="hidden lg:flex flex-col w-60 h-[calc(100vh-2rem)] fixed left-4 top-4 bottom-4 transition-all duration-700 z-50">
      <div class="h-full bg-white rounded-3xl flex flex-col p-6 overflow-hidden relative group border border-gray-100 shadow-sm">
        <!-- Logo -->
        <NuxtLink to="/" class="mb-10 px-4 pt-4 relative z-10 flex items-center gap-4 group cursor-pointer block hover:opacity-80 transition-opacity">
          <div class="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-parentPrimary transition-all duration-500">
            <ShoppingBag class="w-5 h-5"></ShoppingBag>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-bold text-gray-900 tracking-tighter leading-none mb-0.5">Errandr</span>
            <span class="text-[8px] font-bold text-gray-400 leading-none">Your campus companion</span>
          </div>
        </NuxtLink>
        
        <!-- Desktop Navigation -->
        <nav class="flex-1 space-y-8 relative z-10 overflow-y-auto hide-scrollbar pb-10">
          <div v-for="group in navGroups" :key="group.label" class="space-y-1">
            <p class="px-5 text-xs font-black text-gray-400 uppercase mb-3 opacity-50">{{ group.label }}</p>
            
            <NuxtLink
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-5 py-3 text-[11px] font-black uppercase rounded-2xl transition-all group/nav relative overflow-hidden"
              :class="isActive(item.path) 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'"
            >
              <component :is="item.icon" class="w-4 h-4 mr-4 transition-transform group-hover/nav:scale-110" :class="isActive(item.path) ? 'text-parentPrimary' : ''"></component>
              {{ item.label }}
              <div v-if="isActive(item.path)" class="absolute right-4 w-1.5 h-1.5 rounded-full bg-parentPrimary"></div>
            </NuxtLink>
          </div>
        </nav>

        <!-- Profile Section -->
        <div class="mt-auto pt-6 border-t border-gray-100 relative z-10">
          <div @click="router.push('/dashboard/profile')" class="flex items-center gap-3 p-3 rounded-[1.5rem] hover:bg-gray-50 transition-all cursor-pointer group/profile">
            <div class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover/profile:scale-105 transition-transform text-center">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">{{ userDisplayName }}</p>
              <p class="text-sm font-bold text-gray-400 truncate">Student member</p>
            </div>
          </div>
          
          <button
            @click="handleLogoutClick"
            class="mt-4 flex items-center w-full px-6 py-4 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut class="w-4 h-4 mr-4"></LogOut>
            Log out
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white/90 backdrop-blur-xl border-b border-gray-50 sticky top-0 z-40 w-full shrink-0 animate-fade-in">
      <div class="flex items-center justify-between px-6 py-3">
        <div class="flex items-center gap-3">
          <div v-if="!isDashboard" @click="router.back()" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 mr-1 animate-fade-in-left">
            <ArrowLeft class="w-4 h-4 text-gray-900"></ArrowLeft>
          </div>
          <div v-else class="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            <ShoppingBag class="w-4 h-4"></ShoppingBag>
          </div>
          <span class="text-lg font-bold text-gray-900 tracking-tighter">{{ isDashboard ? 'Errandr' : pageTitle }}</span>
        </div>
        
        <div class="flex items-center gap-2">
          <NuxtLink to="/notifications" class="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-white transition-all">
            <Bell class="w-4 h-4 text-gray-900"></Bell>
            <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-parentPrimary border border-white rounded-full flex items-center justify-center">
              <span class="text-[8px] font-bold text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Mobile Bottom Tab Bar -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center py-2 px-2 shadow-[0_-4px_25px_rgba(0,0,0,0.03)] pb-safe-bottom">
      <NuxtLink
        v-for="item in tabItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all group/tab shrink-0"
        :class="isActive(item.path) ? 'text-parentPrimary' : 'text-gray-400'"
      >
        <component :is="item.icon" class="w-4.5 h-4.5 transition-transform group-hover/tab:scale-105" />
        <span class="text-[8px] font-black uppercase tracking-wider mt-1.5">{{ item.label }}</span>
      </NuxtLink>

      <button
        @click="showMobileMenu = true"
        class="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all group/tab shrink-0 text-gray-400"
        :class="showMobileMenu ? 'text-parentPrimary' : ''"
      >
        <Menu class="w-4.5 h-4.5 transition-transform group-hover/tab:scale-105" />
        <span class="text-[8px] font-black uppercase tracking-wider mt-1.5">More</span>
      </button>
    </nav>

    <!-- Mobile More Menu (Bottom Sheet modal) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showMobileMenu" class="lg:hidden fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm" @click.self="showMobileMenu = false">
          <div class="bg-white w-full max-w-md rounded-t-[2rem] overflow-hidden shadow-2xl animate-slide-up-mobile p-6 space-y-6 pb-safe-bottom">
            <!-- Handle -->
            <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2"></div>
            
            <div class="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 class="text-sm font-black text-gray-950 uppercase tracking-widest">More Actions</h3>
              <button @click="showMobileMenu = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X class="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <!-- Grid of Items -->
            <div class="grid grid-cols-3 gap-3">
              <button 
                v-for="item in moreItems" 
                :key="item.path" 
                @click="navigateToMoreItem(item.path)"
                class="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-parentPrimary/5 border border-transparent hover:border-parentPrimary/10 transition-all group"
              >
                <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors shadow-sm">
                  <component :is="item.icon" class="w-5 h-5" />
                </div>
                <span class="text-[9px] font-black text-gray-500 uppercase tracking-wider text-center mt-2 group-hover:text-gray-900 leading-tight">
                  {{ item.label }}
                </span>
              </button>
            </div>

            <!-- User profile & Sign Out -->
            <div class="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                  {{ userInitials }}
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black text-gray-900 truncate leading-none mb-1">{{ userDisplayName }}</p>
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Student Member</p>
                </div>
              </div>
              <button 
                @click="handleLogoutClick(); showMobileMenu = false" 
                class="px-4 py-2 border border-rose-100 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <main class="flex-1 w-full lg:w-auto lg:ml-60 transition-all duration-700 p-4 lg:p-10 pb-32 overflow-x-hidden">
      <!-- Adaptive Header (Desktop Only) -->
      <div v-if="!route.path.startsWith('/vendors')" class="hidden lg:block mb-8 animate-fade-in">
        <div class="flex items-center justify-between bg-white rounded-3xl px-8 py-6 border border-gray-100">
          <div class="flex items-center gap-6">
            <button v-if="!isDashboard" @click="router.back()" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-900 hover:text-white transition-all group">
              <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform"></ArrowLeft>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">{{ pageTitle }}</h1>
              <p class="text-sm font-bold text-gray-400">{{ pageDescription }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink to="/notifications" class="relative w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all group overflow-hidden border border-gray-100">
              <Bell class="w-5 h-5 group-hover:scale-110 transition-transform"></Bell>
              <div v-if="unreadCount > 0" class="absolute top-3 right-3 w-2.5 h-2.5 bg-parentPrimary border border-white rounded-full shadow-sm"></div>
            </NuxtLink>
            
            <div class="w-px h-8 bg-gray-100 mx-2"></div>
            
            <div class="flex flex-col items-end">
              <span class="text-xs font-bold text-gray-300 mb-1 leading-none uppercase tracking-wider">Status</span>
              <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                <div class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-sm font-bold text-emerald-600">All systems go</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Workspace -->
      <div class="rounded-3xl min-h-[calc(100vh-12rem)] relative">
        <slot></slot>
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
            <LogOut class="w-8 h-8 text-rose-500"></LogOut>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold text-gray-900">Sign Out?</h3>
            <p class="text-sm text-gray-500 font-bold leading-relaxed">
              Are you sure you want to leave? Your active orders will still be processed.
            </p>
          </div>
          <div class="flex gap-3 w-full">
            <button @click="logoutModalOpen = false" class="flex-1 py-4 rounded-2xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all">Stay</button>
            <button @click="confirmLogout" class="flex-1 py-4 rounded-2xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">Log out</button>
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
  X,
  Bell,
  ArrowLeft,
  Target,
  Trophy,
  HelpCircle,
  Wallet
} from 'lucide-vue-next'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'

const { unreadCount } = useNotifications()
useRealtimeNotifications() // Initialize listener

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)

const navGroups = [
  {
    label: 'Menu',
    items: [
      { path: '/dashboard', label: 'Home', icon: Home },
      { path: '/dashboard/search', label: 'Search', icon: Search },
      { path: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
      { path: '/dashboard/favorites', label: 'Favorites', icon: Heart }
    ]
  },
  {
    label: 'Rewards & Social',
    items: [
      { path: '/dashboard/quests', label: 'Campus Quests', icon: Target },
      { path: '/dashboard/leaderboard', label: 'Hall of Fame', icon: Trophy }
    ]
  },
  {
    label: 'Finances',
    items: [
      { path: '/dashboard/wallet', label: 'My Wallet', icon: Wallet }
    ]
  },
  {
    label: 'Support',
    items: [
      { path: '/dashboard/how-it-works', label: 'How it Works', icon: HelpCircle },
      { path: '/dashboard/profile', label: 'My Profile', icon: User }
    ]
  }
]

const tabItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/dashboard/search', label: 'Search', icon: Search },
  { path: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet }
]

const moreItems = [
  { path: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { path: '/dashboard/quests', label: 'Quests', icon: Target },
  { path: '/dashboard/leaderboard', label: 'Hall of Fame', icon: Trophy },
  { path: '/dashboard/profile', label: 'Profile', icon: User },
  { path: '/dashboard/how-it-works', label: 'Help', icon: HelpCircle },
  { path: '/notifications', label: 'Alerts', icon: Bell }
]

const navigateToMoreItem = (path: string) => {
  showMobileMenu.value = false
  navigateTo(path)
}

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

const confirmLogout = async () => {
  await logOut()
  logoutModalOpen.value = false
  window.location.href = '/'
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

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up-mobile {
  animation: slideUpMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUpMobile {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

.pb-safe-bottom {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
</style>
