<template>
  <div class="min-h-screen bg-white flex flex-col lg:flex-row selection:bg-parentPrimary/10 selection:text-parentPrimary w-full overflow-x-hidden pt-safe">
    <FullScreenLoader></FullScreenLoader>
    <Toast ref="toastRef"></Toast>
    
    <!-- Premium Desktop Navigation (Floating Sidebar) -->
    <aside class="hidden lg:flex flex-col w-64 h-[calc(100vh-2rem)] fixed left-4 top-4 bottom-4 transition-all duration-700 z-50">
      <div class="h-full bg-white rounded-3xl flex flex-col overflow-hidden relative group border border-gray-100 shadow-sm">
        
        <!-- User Profile Header -->
        <div class="p-6 pb-4 border-b border-gray-50 flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-md uppercase">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-base font-bold text-gray-900 truncate">{{ userDisplayName }}</p>
            <p class="text-xs font-bold text-gray-400 truncate">Student Member</p>
          </div>
        </div>

        <!-- Mode Switcher -->
        <div class="p-4 border-b border-gray-50">
          <div class="bg-gray-50/80 p-1.5 rounded-2xl flex relative overflow-hidden">
             <!-- Animated active background -->
             <div 
                class="absolute inset-y-1.5 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ease-out z-0"
                :class="mode === 'errands' ? 'left-1.5 right-[50%]' : 'left-[50%] right-1.5'"
             ></div>
             
             <!-- Buttons -->
             <button 
               @click="setMode('errands')"
               class="flex-1 relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
               :class="mode === 'errands' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'"
             >
               <Package class="w-4 h-4" />
               Errands
             </button>
             <button 
               @click="setMode('services')"
               class="flex-1 relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
               :class="mode === 'services' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'"
             >
               <Scissors class="w-4 h-4" />
               Services
             </button>
          </div>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="flex-1 relative z-10 overflow-y-auto hide-scrollbar px-3 py-4 space-y-1">
          <TransitionGroup name="nav-list" tag="div" class="space-y-1 relative">
            <NuxtLink
              v-for="item in activeNavItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-4 py-3.5 text-[14px] font-medium rounded-2xl transition-all group/nav relative overflow-hidden"
              :class="isActive(item.path) 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
            >
              <component :is="item.icon" class="w-5 h-5 mr-4 transition-transform group-hover/nav:scale-110" :class="isActive(item.path) ? 'text-parentPrimary' : ''"></component>
              {{ item.label }}
              <div v-if="isActive(item.path)" class="absolute right-4 w-1.5 h-1.5 rounded-full bg-parentPrimary"></div>
            </NuxtLink>
          </TransitionGroup>
        </nav>

        <!-- Shared Bottom Navigation (Profile, Wallet, Settings) -->
        <div class="mt-auto p-3 border-t border-gray-50 space-y-1 bg-gray-50/30">
          <NuxtLink
            v-for="item in sharedNavItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3.5 text-[14px] font-medium rounded-2xl transition-all group/nav relative overflow-hidden"
            :class="isActive(item.path) 
              ? 'bg-gray-900 text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-white'"
          >
            <component :is="item.icon" class="w-5 h-5 mr-4 transition-transform group-hover/nav:scale-110" :class="isActive(item.path) ? 'text-parentPrimary' : ''"></component>
            {{ item.label }}
            <div v-if="isActive(item.path)" class="absolute right-4 w-1.5 h-1.5 rounded-full bg-parentPrimary"></div>
          </NuxtLink>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white/90 backdrop-blur-xl border-b border-gray-50 sticky top-0 z-40 w-full shrink-0 animate-fade-in">
      <div class="flex items-center justify-between px-6 py-3">
        <div class="flex items-center gap-3">
          <button 
            @click="isMobileSidebarOpen = true"
            class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors mr-1"
          >
            <Menu class="w-4.5 h-4.5 text-gray-900" />
          </button>
          <div v-if="!isDashboard" @click="router.back()" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 mr-1 animate-fade-in-left cursor-pointer">
            <ArrowLeft class="w-4 h-4 text-gray-900"></ArrowLeft>
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

    <!-- Mobile Sidebar Drawer (Off-Canvas Menu) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isMobileSidebarOpen" class="lg:hidden fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" @click="isMobileSidebarOpen = false"></div>
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div v-if="isMobileSidebarOpen" class="lg:hidden fixed inset-y-0 left-0 w-80 z-[101] bg-white shadow-2xl flex flex-col overflow-hidden rounded-r-[2rem]">
          
          <!-- User Profile & Close -->
          <div class="p-6 pb-4 border-b border-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm uppercase">
                {{ userInitials }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-gray-900 truncate leading-none mb-1">{{ userDisplayName }}</p>
                <p class="text-xs font-bold text-gray-400 tracking-wider">Student Member</p>
              </div>
            </div>
            <button @click="isMobileSidebarOpen = false" class="p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <!-- Mobile Mode Switcher -->
          <div class="p-4 border-b border-gray-50">
            <div class="bg-gray-50/80 p-1.5 rounded-2xl flex relative overflow-hidden">
               <div 
                  class="absolute inset-y-1.5 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ease-out z-0"
                  :class="mode === 'errands' ? 'left-1.5 right-[50%]' : 'left-[50%] right-1.5'"
               ></div>
               
               <button 
                 @click="setMode('errands')"
                 class="flex-1 relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
                 :class="mode === 'errands' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'"
               >
                 <Package class="w-4 h-4" />
                 Errands
               </button>
               <button 
                 @click="setMode('services')"
                 class="flex-1 relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
                 :class="mode === 'services' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'"
               >
                 <Scissors class="w-4 h-4" />
                 Services
               </button>
            </div>
          </div>

          <!-- Mobile Sidebar Nav links -->
          <nav class="flex-1 space-y-1 overflow-y-auto hide-scrollbar px-3 py-4">
            <TransitionGroup name="nav-list" tag="div" class="space-y-1 relative">
              <NuxtLink
                v-for="item in activeNavItems"
                :key="item.path"
                :to="item.path"
                @click="isMobileSidebarOpen = false"
                class="flex items-center px-4 py-3.5 text-[14px] font-medium rounded-2xl transition-all group/nav relative overflow-hidden"
                :class="isActive(item.path) 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
              >
                <component :is="item.icon" class="w-5 h-5 mr-4 transition-transform group-hover/nav:scale-110" :class="isActive(item.path) ? 'text-parentPrimary' : ''"></component>
                {{ item.label }}
                <div v-if="isActive(item.path)" class="absolute right-4 w-1.5 h-1.5 rounded-full bg-parentPrimary"></div>
              </NuxtLink>
            </TransitionGroup>
          </nav>

          <!-- Shared Mobile Bottom Nav -->
          <div class="mt-auto p-3 border-t border-gray-50 space-y-1 bg-gray-50/30">
            <NuxtLink
              v-for="item in sharedNavItems"
              :key="item.path"
              :to="item.path"
              @click="isMobileSidebarOpen = false"
              class="flex items-center px-4 py-3.5 text-[14px] font-medium rounded-2xl transition-all group/nav relative overflow-hidden"
              :class="isActive(item.path) 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white'"
            >
              <component :is="item.icon" class="w-5 h-5 mr-4 transition-transform group-hover/nav:scale-110" :class="isActive(item.path) ? 'text-parentPrimary' : ''"></component>
              {{ item.label }}
              <div v-if="isActive(item.path)" class="absolute right-4 w-1.5 h-1.5 rounded-full bg-parentPrimary"></div>
            </NuxtLink>
            
            <button 
              @click="handleLogoutClick(); isMobileSidebarOpen = false" 
              class="w-full py-3.5 mt-2 border border-rose-100 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut class="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <main class="flex-1 w-full lg:w-auto lg:ml-64 transition-all duration-700 p-2.5 sm:p-4 lg:p-10 pb-16 lg:pb-32 overflow-x-hidden">
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
            
            <button @click="handleLogoutClick" class="flex items-center gap-2 text-rose-500 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
              <LogOut class="w-4 h-4"></LogOut>
              Sign out
            </button>
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
import { ref, computed, watch, onMounted } from 'vue'
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
  Wallet,
  Users,
  Calendar,
  MessageSquare,
  ClipboardList,
  Settings,
  Package,
  Scissors
} from 'lucide-vue-next'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useDashboardMode } from '@/composables/useDashboardMode'

const { unreadCount } = useNotifications()
useRealtimeNotifications() // Initialize listener

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()
const isMobileSidebarOpen = ref(false)
const logoutModalOpen = ref(false)

const { mode, setMode } = useDashboardMode()

const errandsNavItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/dashboard/search', label: 'Search', icon: Search },
  { path: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/dashboard/group-orders', label: 'Group Orders', icon: Users },
  { path: '/dashboard/quests', label: 'Campus Quests', icon: Target },
]

const servicesNavItems = [
  { path: '/dashboard/activity', label: 'Activity', icon: Calendar },
  { path: '/dashboard/chat', label: 'Messages', icon: MessageSquare },
  { path: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { path: '/dashboard/forms', label: 'Forms', icon: ClipboardList },
]

const sharedNavItems = [
  { path: '/dashboard/profile', label: 'Profile', icon: User },
  { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const activeNavItems = computed(() => {
  return mode.value === 'errands' ? errandsNavItems : servicesNavItems
})

const isDashboard = computed(() => route.path === '/dashboard' || route.path === '/')

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Welcome back to Errandr' },
  '/dashboard': { title: 'Dashboard', description: 'Welcome back to Errandr' },
  '/dashboard/search': { title: 'Search', description: 'Find anything on campus' },
  '/dashboard/orders': { title: 'My Errands', description: 'Track your active and past orders' },
  '/dashboard/group-orders': { title: 'Group Orders', description: 'Manage your multiplayer carts and order history' },
  '/dashboard/favorites': { title: 'My Favorites', description: 'Your most loved items and venues' },
  '/dashboard/profile': { title: 'My Profile', description: 'Manage your Errandr account' },
  '/dashboard/activity': { title: 'My Activity', description: 'Manage your appointments and bookings' },
  '/dashboard/chat': { title: 'Messages', description: 'Your conversations with venues' },
  '/dashboard/forms': { title: 'Forms', description: 'Consultation forms and waivers' },
  '/dashboard/settings': { title: 'Settings', description: 'App preferences and security' },
  '/dashboard/wallet': { title: 'My Wallet', description: 'Manage payment methods and gift cards' },
}

const pageTitle = computed(() => {
  if (route.path.startsWith('/dashboard/orders/')) return 'Order Tracker'
  return pageTitles[route.path]?.title || 'Store'
})
const pageDescription = computed(() => {
  if (route.path.startsWith('/dashboard/orders/')) return 'Live tracking & updates'
  return pageTitles[route.path]?.description || 'Errandr Companion'
})

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

watch(() => route.path, () => {
  isMobileSidebarOpen.value = false
})

// Add redirection logic
watch(mode, (newMode) => {
  // When switching modes, if on a mode-specific page, redirect to the root of that mode
  if (newMode === 'errands' && route.path.startsWith('/dashboard/activity')) {
    router.push('/dashboard')
  } else if (newMode === 'services' && (route.path === '/dashboard' || route.path.startsWith('/dashboard/orders'))) {
    router.push('/dashboard/activity')
  }
})
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

/* Nav list transitions */
.nav-list-enter-active,
.nav-list-leave-active {
  transition: all 0.3s ease;
}
.nav-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.nav-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.nav-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
