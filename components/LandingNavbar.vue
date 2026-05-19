<template>
  <!-- Navbar Wrapper -->
  <nav 
    class="fixed w-[95%] left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 rounded-[2rem] mt-4"
    :class="[
      scrolled 
        ? 'bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] py-3' 
        : 'bg-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img src="@/assets/img/logo-light.png" alt="Errander Logo" class="h-10 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
        </NuxtLink>
        
        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-10">
          <NuxtLink v-for="link in navLinks" :key="link.href" :to="link.href" class="text-sm font-black text-gray-400 hover:text-parentPrimary -wide transition-all relative group">
            {{ link.label }}
            <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-parentPrimary rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2 lg:gap-4">
          <!-- User is Logged In -->
          <template v-if="user">
            <!-- Notifications -->
            <Menu as="div" class="relative">
              <MenuButton class="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all relative">
                <Bell class="w-5 h-5" />
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
                  <div class="px-6 py-4 bg-gray-50/50">
                    <p class="text-sm font-black text-gray-400 leading-none">Notifications ({{ unreadCount }})</p>
                  </div>
                  <div class="p-4 flex flex-col items-center justify-center text-center space-y-3 py-10">
                    <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                       <BellOff class="w-8 h-8 text-gray-200" />
                    </div>
                    <p class="text-sm font-bold text-gray-900 leading-none">No new alerts</p>
                    <p class="text-sm font-bold text-gray-400 max-w-[180px]">We'll let you know when your order status changes.</p>
                  </div>
                  <div class="p-2">
                     <NuxtLink to="/notifications" class="w-full py-3 flex items-center justify-center text-sm font-black text-gray-400 hover:text-gray-900 transition-colors bg-gray-50/50 rounded-2xl">View All Notifications</NuxtLink>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            <!-- Profile Dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all p-1.5 focus:outline-none">
                <div class="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-sm border border-gray-800 uppercase">
                  {{ user.firstName?.[0] || user.email?.[0] }}
                </div>
                <ChevronDown class="w-4 h-4 text-gray-400 mr-2" />
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
                    <p class="text-sm font-black text-gray-400 leading-none mb-1">Signed in as</p>
                    <p class="text-sm font-black text-gray-900 truncate -tight">{{ user.firstName }} {{ user.lastName }}</p>
                  </div>
                  <div class="p-2">
                    <MenuItem v-slot="{ active }">
                      <NuxtLink to="/dashboard" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-3 text-sm font-bold transition-colors']">
                        <Home class="w-4 h-4 mr-3" /> Dashboard
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <NuxtLink to="/dashboard/profile" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-3 text-sm font-bold transition-colors']">
                        <User class="w-4 h-4 mr-3" /> My Profile
                      </NuxtLink>
                    </MenuItem>
                  </div>
                  <div class="p-2">
                    <MenuItem v-slot="{ active }">
                      <button @click="handleLogout" :class="[active ? 'bg-rose-50 text-rose-500' : 'text-rose-500', 'flex w-full items-center rounded-xl px-3 py-3 text-sm font-bold transition-colors']">
                        <LogOut class="w-4 h-4 mr-3" /> Log out
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </template>

          <!-- Visitor state -->
          <template v-else>
            <NuxtLink to="/auth/login" class="px-6 py-3 text-sm font-black text-gray-900 hover:text-parentPrimary transition-colors">
              Log In
            </NuxtLink>
            <NuxtLink to="/auth/register" class="hidden md:flex px-8 py-3.5 bg-parentPrimary text-white text-sm font-black rounded-2xl shadow-[0_10px_30px_rgba(255,92,26,0.3)] hover:scale-105 active:scale-95 transition-all">
              Join Errander
            </NuxtLink>
          </template>

          <!-- Mobile Toggle -->
          <button @click="showMobileMenu = !showMobileMenu" class="md:hidden w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-900 hover:bg-gray-100 transition-all">
            <MenuIcon v-if="!showMobileMenu" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu Overlay -->
  <Transition name="fade-slide">
    <div v-if="showMobileMenu" class="fixed inset-0 z-[55] bg-white pt-32 px-10 pb-10 md:hidden flex flex-col justify-between">
      <div class="space-y-8">
        <div class="flex flex-col gap-6">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.href" 
            :to="link.href" 
            @click="showMobileMenu = false"
            class="text-4xl font-black text-gray-900 -tighter hover:text-parentPrimary transition-colors"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="h-px bg-gray-50 w-full"></div>
        <NuxtLink v-if="!user" to="/auth/login" class="block text-xl font-bold text-gray-400 hover:text-gray-900 transition-colors">Log into your account</NuxtLink>
        <NuxtLink v-else to="/dashboard" class="block text-xl font-bold text-parentPrimary hover:text-gray-900 transition-colors">Go to Dashboard &rarr;</NuxtLink>
      </div>
      
      <div class="space-y-6">
        <NuxtLink v-if="!user" to="/auth/register" class="block w-full py-5 bg-parentPrimary text-white text-center text-sm font-black rounded-[1.5rem] shadow-xl">
          Join Errander
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useUser } from "@/composables/modules/auth/user"
import { Bell, BellOff, ChevronDown, Home, User, LogOut, Menu as MenuIcon, X } from 'lucide-vue-next'

const scrolled = ref(false)
const showMobileMenu = ref(false)

const { user, logOut } = useUser()
const { unreadCount } = useNotifications()

const handleLogout = async () => {
  await logOut()
  window.location.reload()
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' }
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0; 
  transform: translateY(-100%); 
}
</style>
