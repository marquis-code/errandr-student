<template>
  <!-- Navbar Wrapper -->
  <nav 
    class="fixed w-[95%] left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 rounded-[2rem] mt-4"
    :class="[
      scrolled 
        ? 'bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-3' 
        : 'bg-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img src="@/assets/img/logo-light.png" alt="Errander Logo" class="h-12 lg:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
        </NuxtLink>
        
        <!-- Actions & Menu -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Auth Links (Desktop Only) -->
          <div class="hidden md:flex items-center gap-3">
            <template v-if="!user">
              <!-- Manage Buttons for Guests -->
              <NuxtLink to="/errands/custom" class="px-5 py-2 text-sm font-bold text-white bg-parentPrimary hover:bg-orange-600 transition-colors rounded-full shadow-lg hover:shadow-xl whitespace-nowrap">
                Request Custom Errand
              </NuxtLink>
              <div class="w-px h-4 bg-gray-300 mx-2"></div>
              <NuxtLink to="/auth/login" class="px-5 py-2 text-sm font-medium text-gray-900 hover:text-parentPrimary transition-colors rounded-full hover:bg-gray-50 whitespace-nowrap">
                Log In
              </NuxtLink>
              <NuxtLink to="/auth/register" class="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 transition-all whitespace-nowrap">
                Sign Up
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/errands/custom" class="px-5 py-2 text-sm font-bold text-white bg-parentPrimary hover:bg-orange-600 transition-colors rounded-full shadow-lg hover:shadow-xl whitespace-nowrap">
                Request Custom Errand
              </NuxtLink>
              <div class="w-px h-4 bg-gray-300 mx-2"></div>
              
              <!-- Streak Gamification UI -->
              <div v-if="user.currentStreak > 0" class="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full cursor-help relative group" title="Your Errand Streak!">
                <span class="text-base leading-none">🔥</span>
                <span class="text-xs font-bold text-orange-600">{{ user.currentStreak }} Wk</span>
                <div v-if="user.freeDeliveryTokens > 0" class="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  🎟 {{ user.freeDeliveryTokens }}
                </div>
              </div>
              
              <NuxtLink to="/dashboard" class="px-5 py-2 text-sm font-medium text-gray-900 hover:text-parentPrimary transition-colors rounded-full hover:bg-gray-50 whitespace-nowrap">
                Dashboard
              </NuxtLink>
            </template>
          </div>

          <!-- Fresha-style Menu Dropdown -->
          <Menu as="div" class="relative">
            <MenuButton class="flex items-center gap-2 rounded-full bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all px-4 py-2 focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 ml-2">
              <span class="text-sm font-medium text-gray-900 hidden sm:block">Menu</span>
              <MenuIcon class="w-5 h-5 text-gray-900" />
            </MenuButton>
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems class="absolute right-0 mt-3 w-72 origin-top-right rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 focus:outline-none z-[100] overflow-hidden p-3 space-y-1">
                <!-- User Section -->
                <div v-if="user" class="px-4 py-3 mb-2 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Signed in as</p>
                  <p class="text-sm font-bold text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</p>
                </div>
                
                <!-- Main Nav Links -->
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                    Home
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/about" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                    About us
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/faq" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                    FAQ
                  </NuxtLink>
                </MenuItem>
                
                <div class="h-px bg-gray-100 my-2 mx-2"></div>

                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/errands/custom" :class="[active ? 'bg-orange-50 text-parentPrimary' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-bold transition-colors']">
                    Request Custom Errand
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button @click="isBookingModalOpen = true" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                    Manage Booking
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button @click="isOrderModalOpen = true" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                    Manage Order
                  </button>
                </MenuItem>
                
                <div class="h-px bg-gray-100 my-2 mx-2"></div>
                
                <!-- Action Links (Desktop Fallback + Mobile) -->
                <div>
                  <div class="px-4 py-2">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Partner with us</p>
                    <MenuItem v-slot="{ active }">
                      <a href="https://vendor.erranders.org/auth/register" :class="[active ? 'bg-gray-50 text-gray-900' : 'text-gray-700', 'group flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors']">
                        Join as Vendor
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a href="https://dispatch.erranders.org/auth/register" :class="[active ? 'bg-gray-50 text-gray-900' : 'text-gray-700', 'group flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors']">
                        Join as Rider
                      </a>
                    </MenuItem>
                  </div>
                  <div class="h-px bg-gray-100 my-2 mx-2"></div>
                </div>

                <!-- Auth/User Actions -->
                <template v-if="!user">
                  <div class="md:hidden">
                    <MenuItem v-slot="{ active }">
                      <NuxtLink to="/auth/login" :class="[active ? 'bg-gray-50 text-gray-900' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                        Log in
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <NuxtLink to="/auth/register" :class="[active ? 'bg-gray-50 text-gray-900' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                        Sign up
                      </NuxtLink>
                    </MenuItem>
                  </div>
                </template>
                <template v-else>
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/dashboard" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                      <Home class="w-4 h-4 mr-3 opacity-50" /> Dashboard
                    </NuxtLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/dashboard/profile" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-700', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                      <User class="w-4 h-4 mr-3 opacity-50" /> My Profile
                    </NuxtLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button @click="handleLogout" :class="[active ? 'bg-rose-50 text-rose-600' : 'text-rose-500', 'group flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors']">
                      <LogOut class="w-4 h-4 mr-3 opacity-50" /> Log out
                    </button>
                  </MenuItem>
                </template>

              </MenuItems>
            </Transition>
          </Menu>

        </div>
      </div>



    </div>
    <CoreManageBookingModal :isOpen="isBookingModalOpen" @close="isBookingModalOpen = false" />
    <CoreManageOrderModal :isOpen="isOrderModalOpen" @close="isOrderModalOpen = false" />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUser } from "@/composables/modules/auth/user"
import { Home, User, LogOut, Menu as MenuIcon, Filter, ChevronDown } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useGlobalFilter } from '@/composables/core/useGlobalFilter'

const isBookingModalOpen = ref(false)
const isOrderModalOpen = ref(false)
const scrolled = ref(false)

const $route = useRoute()
const { user, logOut } = useUser()
const { globalFilter, setFilter, globalFiltersList, fetchCategories } = useGlobalFilter()

const activeFilterLabel = computed(() => {
  const list = globalFiltersList.value || globalFiltersList
  const f = list.find((f: any) => f.keyword === globalFilter.value)
  return f ? f.label : ''
})

const activeFilterIcon = computed(() => {
  const list = globalFiltersList.value || globalFiltersList
  const f = list.find((f: any) => f.keyword === globalFilter.value)
  return f ? f.icon : ''
})

const handleLogout = async () => {
  await logOut()
  window.location.reload()
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchCategories()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

