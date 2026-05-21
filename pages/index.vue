<template>
 <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
 <BatchDeliveryBanner />
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Search Overlay — Premium Glassmorphism -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="showSuggestions"
          class="fixed inset-0 bg-gray-900/10 backdrop-blur-xl z-[9998]"
          @click="showSuggestions = false"
        ></div>
      </Transition>
    </Teleport>

    <!-- Hero Section -->
    <section 
      class="relative pt-36 pb-16 lg:pt-40 lg:pb-24 overflow-visible bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100"
    >
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative text-center" :class="showSuggestions ? 'z-[9999]' : 'z-10'">
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- Badge -->
          <NuxtLink to="/vendors" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/5 border border-parentPrimary/10 text-parentPrimary text-sm font-black -[0.2em]  animate-fade-in-up hover:bg-parentPrimary/10 transition-colors">
            <Zap class="w-3.5 h-3.5 fill-current" /> Campus Delivery, Redefined
          </NuxtLink>
          
          <!-- Rotating Hero Heading (Optimized Size) -->
          <div class="relative h-[120px] md:h-[180px] lg:h-[220px] overflow-hidden flex items-center justify-center">
            <TransitionGroup name="hero-slide" tag="div" class="w-full">
              <h1 
                :key="currentHeadingIndex"
                class="absolute inset-0 flex flex-col items-center justify-center text-3xl md:text-5xl lg:text-7xl font-extrabold -tighter leading-[1.1] text-gray-900 px-4 font-onest"
              >
                <div class="max-w-max mx-auto text-center" v-html="heroHeadings[currentHeadingIndex].text"></div>
                <!-- <div class="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500">
                  <span class="w-1.5 h-1.5 rounded-full bg-parentPrimary animate-pulse"></span>
                  <span class="text-sm md:text-sm font-black -[0.2em]  text-gray-400">
                    {{ heroHeadings[currentHeadingIndex].lang }}
                  </span>
                </div> -->
              </h1>
            </TransitionGroup>
          </div>

          <!-- Rotating Slang Subtitle -->
          <div class="h-8 overflow-hidden text-sm md:text-lg font-bold text-gray-400 -tight flex items-center justify-center">
             <span :key="currentSlangIndex" class="animate-vertical-marquee">{{ slangSlogans[currentSlangIndex] }}</span>
          </div>

          <!-- Search Bar -->
          <div 
            class="mt-8 max-w-xl mx-auto group relative transition-all duration-700"
            style="isolation: isolate;"
            :class="showSuggestions ? 'z-[200] scale-[1.03]' : 'z-20 scale-100'"
          >
            <div class="absolute -inset-1 bg-parentPrimary opacity-0 group-focus-within:opacity-20 blur-2xl transition-opacity duration-500"></div>
            <div class="relative flex items-center bg-white border-2 border-gray-100 focus-within:border-parentPrimary p-1.5 md:p-2 rounded-[2.5rem] shadow-2xl transition-all duration-500 ring-0 focus-within:ring-8 focus-within:ring-parentPrimary/5">
              <div class="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Search class="w-4 md:w-5 h-4 md:h-5" />
              </div>
              <input 
                type="text" 
                v-model="heroSearchQuery"
                @keyup.enter="handleHeroSearch"
                @focus="showSuggestions = true"
                @blur="handleSearchBlur"
                placeholder="What are you craving?" 
                class="flex-1 bg-transparent border-none outline-none text-sm md:text-sm font-bold text-gray-900 placeholder:text-gray-300 px-1 md:px-2 min-w-0"
              />
              <button 
                @click="handleHeroSearch"
                class="px-4 md:px-8 py-3 md:py-4 bg-gray-900 text-white rounded-[2rem] text-sm md:text-sm font-black   hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all shadow-xl whitespace-nowrap flex-shrink-0 flex items-center gap-2"
              >
                 <span>Find Food</span>
                 <ArrowRight class="w-3 md:w-4 h-3 md:h-4" />
              </button>
            </div>

           <Transition name="fade-up">
  <div
    v-if="showSuggestions && (heroSearchSuggestions.length > 0 || isSearching || hasSearched || timeOfDaySuggestions.length > 0)"
    class="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-100 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden z-[75] p-2"
  >
    <div class="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
      <span class="text-sm font-black text-gray-400 tracking-tight">
        {{ heroSearchQuery ? 'Matching Meals' : `Suggested for ${suggestionTimeText}` }}
      </span>
      <div v-if="isSearching" class="w-4 h-4 border-2 border-parentPrimary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div class="max-h-[350px] overflow-y-auto hide-scrollbar space-y-1 mt-1">

      <!-- Search results -->
      <div
        v-for="product in heroSearchSuggestions"
        :key="product._id"
        @click="router.push(`/vendors/${product.vendor._id || product.vendor}`)"
        class="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group"
      >
        <div class="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-100 flex-shrink-0">
          <img v-if="product.image" :src="product.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          <div v-else class="w-full h-full flex items-center justify-center bg-parentPrimary/10 text-parentPrimary">
            <Utensils class="w-5 h-5" />
          </div>
        </div>
        <div class="flex-1 text-left">
          <h4 class="text-sm font-black text-gray-900 group-hover:text-parentPrimary transition-colors">{{ product.name }}</h4>
          <p class="text-sm font-bold text-gray-400">{{ product.vendor?.storeName || 'Campus Vendor' }}</p>
        </div>
        <div class="text-right">
          <span class="text-sm font-black text-gray-900">₦{{ product.price?.toLocaleString() }}</span>
        </div>
      </div>

      <!-- NO SEARCH RESULTS EMPTY STATE -->
      <div
        v-if="!isSearching && hasSearched && heroSearchSuggestions.length === 0"
        class="m-2"
      >
        <div class="flex items-center gap-4 px-5 py-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <!-- Wiggling bowl -->
          <div class="relative flex-shrink-0 w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
            <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.02)_5px,rgba(0,0,0,0.02)_6px)]"></div>
            <span class="relative z-10 text-2xl animate-[wiggle_3s_ease-in-out_infinite]">🍽️</span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-black text-gray-900 mb-0.5 truncate">
              "{{ heroSearchQuery }}" no dey here sha
            </p>
            <p class="text-xs font-medium text-gray-400 leading-relaxed mb-3">
              Try something close — maybe they get your vibe!
            </p>
            <!-- Suggestion tags -->
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in ['Rice & Stew', 'Sharwama', 'Pepper Soup', 'Amala', 'Fried Rice']"
                :key="tag"
                @click="heroSearchQuery = tag; fetchSuggestions()"
                class="px-3 py-1 text-[11px] font-bold bg-white border border-gray-100 rounded-full text-gray-500 hover:border-parentPrimary/30 hover:text-parentPrimary hover:bg-parentPrimary/5 transition-all active:scale-95"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <!-- Time-of-day fallback suggestions -->
        <div v-if="timeOfDaySuggestions.length > 0" class="mt-3">
          <p class="px-4 pb-2 text-[11px] font-black text-gray-300 tracking-widest uppercase">Popular for {{ suggestionTimeText }}</p>
          <div
            v-for="product in timeOfDaySuggestions.slice(0, 3)"
            :key="'tod-' + product._id"
            @click="router.push(`/vendors/${product.vendor?._id || product.vendor}`)"
            class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-all group"
          >
            <div class="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
              <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
              <Utensils v-else class="w-4 h-4 m-auto text-parentPrimary/30 mt-2.5" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-black text-gray-900 truncate group-hover:text-parentPrimary transition-colors">{{ product.name }}</h4>
              <p class="text-[11px] font-bold text-gray-400">{{ product.vendor?.storeName || 'Campus Vendor' }}</p>
            </div>
            <span class="text-xs font-black text-gray-900 flex-shrink-0">₦{{ product.price?.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Time-of-day suggestions (when no query) -->
      <div v-if="!heroSearchQuery && timeOfDaySuggestions.length > 0">
        <div
          v-for="product in timeOfDaySuggestions"
          :key="'focus-' + product._id"
          @click="router.push(`/vendors/${product.vendor?._id || product.vendor}`)"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group"
        >
          <div class="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-100 flex-shrink-0">
            <img v-if="product.image" :src="product.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            <div v-else class="w-full h-full flex items-center justify-center bg-parentPrimary/10 text-parentPrimary">
              <Utensils class="w-5 h-5" />
            </div>
          </div>
          <div class="flex-1 text-left">
            <h4 class="text-sm font-black text-gray-900 group-hover:text-parentPrimary transition-colors">{{ product.name }}</h4>
            <p class="text-sm font-bold text-gray-400">{{ product.vendor?.storeName || 'Campus Vendor' }}</p>
          </div>
          <div class="text-right">
            <span class="text-sm font-black text-gray-900">₦{{ product.price?.toLocaleString() }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</Transition>
          </div>

          <!-- Quick Tags -->
          <!-- <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
             <span class="text-sm font-black text-gray-300   mr-1">E choke:</span>
             <button v-for="tag in quickTags.slice(0,4)" :key="tag.label" 
              class="px-4 py-2 bg-gray-50 hover:bg-white border border-gray-100 hover:border-parentPrimary/30 rounded-xl text-sm font-black text-gray-600 hover:text-parentPrimary transition-all shadow-sm hover:shadow-md"
             >
               {{ tag.label }}
             </button>
          </div> -->
        </div>
      </div>
    </section>




 <!-- Active Promotions -->
 <section v-if="activePromotions.length > 0" class="py-12 bg-white overflow-hidden border-t border-gray-100">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
 <div class="flex items-end justify-between">
 <div>
 <div class="inline-flex items-center gap-2 text-rose-500 font-bold text-sm mb-2 text-center">
 <Megaphone class="w-4 h-4" /> Live Offers
 </div>
 <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 -tight">Campus Bonanzas</h2>
 </div>
 </div>
 </div>
 
 <div class="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-0">
 <div class="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
        <div v-for="(promo, idx) in activePromotions" :key="idx" 
          @click="handlePromoClick(promo)"
          class="min-w-[300px] sm:min-w-[400px] snap-start shrink-0 group cursor-pointer relative flex flex-col bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
 <div class="relative h-[200px] w-full overflow-hidden bg-gray-100">
 <img :src="promo.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Promo" />
 <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
 
 <div class="absolute top-4 left-4">
 <span class="px-3 py-1 bg-rose-500 text-white rounded-full text-sm font-black  shadow-sm">
 PROMO
 </span>
 </div>

 <div class="absolute bottom-4 left-4 right-4">
 <h3 class="text-xl font-bold text-white -tight leading-tight mb-1 truncate">{{ promo.title }}</h3>
 <p class="text-sm text-white/80 line-clamp-1 font-medium">{{ promo.description }}</p>
 </div>
 </div>
 <div class="p-5 flex items-center justify-between bg-white">
 <span class="text-sm font-bold text-gray-900 flex items-center gap-2">
 <Store class="w-3.5 h-3.5 text-gray-400" /> {{ promo.vendorName }}
 </span>
 <span class="text-sm font-black text-rose-500   bg-rose-50 px-3 py-1.5 rounded-xl transition-colors group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-md">Claim Offer &rarr;</span>
 </div>
 </div>
 </div>
 </div>
 </section>

  <!-- Recommended Vendors -->
  <VendorGroupCarousel
    title="Campus Favorites"
    subtitle="Top Rated"
    :icon="Store"
    :vendors="recommendedVendors"
    :loading="loadingVendors"
    carouselId="carousel-recommended"
    @select-vendor="navigateToVendor"
    @notify="handleNotifyVendor"
    @share-vendor="handleShareVendor"
  />

  <!-- Trending Vendors -->
  <VendorGroupCarousel
    title="Trending on Campus"
    subtitle="Hot Right Now"
    :icon="Flame"
    :vendors="trendingVendors"
    :loading="loadingVendors"
    carouselId="carousel-trending"
    @select-vendor="navigateToVendor"
    @notify="handleNotifyVendor"
    @share-vendor="handleShareVendor"
  />

  <!-- New to Erranders -->
  <VendorGroupCarousel
    title="Fresh Arrivals"
    subtitle="New to Erranders"
    :icon="Sparkles"
    :vendors="newVendors"
    :loading="loadingVendors"
    carouselId="carousel-new"
    @select-vendor="navigateToVendor"
    @notify="handleNotifyVendor"
    @share-vendor="handleShareVendor"
  />

 <!-- Vendor Closed Modal -->
 <VendorClosedModal 
 :isOpen="isClosedModalOpen" 
 :vendor="selectedVendorForModal" 
 @close="isClosedModalOpen = false" 
 />

  <!-- Share Modal -->
  <UiShareModal 
    v-model:isOpen="isShareModalOpen" 
    :vendor="selectedVendorForShare" 
  />

  <!-- How it works (Redesigned & Condensed) -->
  <section id="how-it-works" class="py-20 bg-white overflow-hidden border-t border-slate-100">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <p class="text-sm font-black -[0.2em]  text-parentPrimary">How It Works</p>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 -tighter leading-tight">
          Three steps to <span class="text-parentPrimary">satisfaction.</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
        <div class="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10"></div>
        <div v-for="(step, i) in [
          { title: 'Search & Select', desc: 'Find your favorite campus spot and browse their menu.', icon: '🔍', color: 'bg-emerald-50 text-emerald-600' },
          { title: 'Order & Pay', desc: 'Securely place your order with a few taps.', icon: '💳', color: 'bg-blue-50 text-blue-600' },
          { title: 'Receive', desc: 'Your Errander delivers directly to your hostel door.', icon: '📦', color: 'bg-parentPrimary/10 text-parentPrimary' }
        ]" :key="i" class="text-center space-y-4 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform group">
          <div :class="`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-50 ${step.color} group-hover:scale-110 transition-transform`">
            {{ step.icon }}
          </div>
          <h3 class="text-xl font-black text-slate-900 -tight">{{ i + 1 }}. {{ step.title }}</h3>
          <p class="text-sm text-slate-500 font-bold leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Custom Errands + Why Choose Us (Merged & Condensed) -->
  <section class="py-20 bg-slate-50 overflow-hidden border-t border-slate-100">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <!-- Left: Errands Pitch -->
      <div class="space-y-6 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold">
          <Rocket class="w-4 h-4" /> Anything, anywhere on campus
        </div>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 -tighter leading-tight">
          Need more than <span class="text-parentPrimary">just food?</span>
        </h2>
        <p class="text-slate-500 text-lg font-medium leading-relaxed -tight">
          Send an Errander to your hostel to pick up items, deliver documents to class, or handle any request from Point A to Point B across campus.
        </p>
        <div class="pt-4">
          <NuxtLink to="/errands/custom" class="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm  -wide hover:bg-parentPrimary transition-colors shadow-lg shadow-slate-900/10">
            Request an Errand
          </NuxtLink>
        </div>
      </div>

      <!-- Right: Advantages Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="feat in [
          { title: 'Student Riders', desc: 'Dispatchers who know every corner of your campus.', icon: Target },
          { title: 'Local Expertise', desc: 'Partnered with the best and cleanest vendors.', icon: Layers },
          { title: 'Sapa Friendly', desc: 'Minimal fees for every student pocket.', icon: ShieldCheck },
          { title: 'Real-time Bants', desc: 'Track live and chat with your dispatcher instantly.', icon: MessageCircle }
        ]" :key="feat.title" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-parentPrimary/20 transition-all">
          <div class="w-10 h-10 mb-4 rounded-xl bg-parentPrimary/10 flex items-center justify-center text-parentPrimary">
            <component :is="feat.icon" class="w-5 h-5" />
          </div>
          <h4 class="text-base font-black text-slate-900 -tight mb-2">{{ feat.title }}</h4>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </section>  

  <!-- CTA Section — Light Theme -->
  <section class="relative py-20 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-t border-slate-100">
    <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>
    <div class="max-w-3xl mx-auto px-6 lg:px-10 relative z-10 text-center space-y-6">
      <h2 class="text-4xl md:text-5xl font-black text-slate-900 -tighter leading-tight">
        Ready to <span class="text-parentPrimary">chop?</span>
      </h2>
      <p class="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
        Join thousands of students who trust Errander for their daily meals and hostel runs. Zero stress, 100% vibes.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <NuxtLink to="/auth/register" class="px-8 py-4 bg-parentPrimary text-white rounded-2xl font-black text-sm  -wide shadow-lg shadow-parentPrimary/20 hover:scale-105 active:scale-95 transition-all">
          Join Errander Now
        </NuxtLink>
        <NuxtLink to="/auth/login" class="px-8 py-4 bg-white text-slate-600 rounded-2xl font-black text-sm  -wide border border-slate-200 hover:border-parentPrimary hover:text-parentPrimary transition-all">
          Login
        </NuxtLink>
      </div>
    </div>
  </section>



  <!-- Footer -->
  <LandingFooter />
 </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import BatchDeliveryBanner from '@/components/BatchDeliveryBanner.vue'
import { useUser } from "@/composables/modules/auth/user"
import { 
  ArrowRight, Twitter, Instagram, Facebook,
  Utensils,
  Clock, Star, Store, Bike, ChevronLeft, ChevronRight,
  ShieldCheck, Rocket, Megaphone,
  Menu as MenuIcon, X, Search, ArrowUpRight,
  Layers, Target, MessageCircle, Home, User, Bell, BellOff, LogOut, ChevronDown,
  Sparkles, TrendingUp, Flame
} from 'lucide-vue-next'
import { vendors_api } from '@/api_factory/modules/vendors';
import { products_api } from '@/api_factory/modules/products';

import hero1 from '@/assets/img/hero1.webp'
import hero2 from '@/assets/img/hero2.webp'
import hero12 from '@/assets/img/hero12.webp'
import hero14 from '@/assets/img/hero14.webp'

definePageMeta({
 layout: false
})

useHead({
 title: 'Errander | Premium Campus Delivery',
 meta: [
 { name: 'description', content: 'The fastest food delivery for students. From your favorite campus restaurants straight to your hostel door.' }
 ]
})

import { useCart } from '@/composables/modules/cart';

const scrolled = ref(false)
const router = useRouter()
const showMobileMenu = ref(false)
const heroSearchQuery = ref('')
const loadingVendors = ref(true)
const recommendedVendors = ref<any[]>([])
const trendingVendors = ref<any[]>([])
const newVendors = ref<any[]>([])
const vendors = ref<any[]>([]) // Combined list for active promotions
const selectedVendorForModal = ref(null);
const isClosedModalOpen = ref(false);
const isShareModalOpen = ref(false);
const selectedVendorForShare = ref(null);
const cartStore = useCart()
const { user, logOut } = useUser()
const { unreadCount } = useNotifications()
useRealtimeNotifications() // Listen for real-time updates

const handleLogout = async () => {
  await logOut()
  window.location.reload()
}

// Search Suggestions
const heroSearchSuggestions = ref<any[]>([])
const timeOfDaySuggestions = ref<any[]>([])
const showSuggestions = ref(false)
const isSearching = ref(false)
const hasSearched = ref(false)

const suggestionTimeText = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Breakfast'
  if (hour >= 12 && hour < 17) return 'Lunch'
  if (hour >= 17 && hour < 22) return 'Dinner'
  return 'Late Night'
})

const fetchSuggestions = async () => {
  if (!heroSearchQuery.value.trim()) {
    hasSearched.value = false
    // Fetch popular/recommended if empty
    try {
      const res = await products_api.getPopular()
      const data = res.data?.products || res.data?.data || []
      timeOfDaySuggestions.value = data
      heroSearchSuggestions.value = []
    } catch (e) {
      timeOfDaySuggestions.value = []
    }
    return
  }

  isSearching.value = true
  try {
    const res = await products_api.getProducts({ q: heroSearchQuery.value, limit: 6 })
    heroSearchSuggestions.value = res.data?.products || res.data?.data?.products || []
  } catch (e) {
    heroSearchSuggestions.value = []
  } finally {
    isSearching.value = false
    hasSearched.value = true
  }
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Debounce search
let searchTimeout: any
watch(heroSearchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchSuggestions()
  }, 300)
})

const navLinks = [
  { label: 'Featured', href: '#featured' },
  { label: 'Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' }
]

const handleHeroSearch = () => {
  if (!heroSearchQuery.value.trim()) return
  navigateTo(`/vendors?search=${encodeURIComponent(heroSearchQuery.value.trim())}`)
}

const handleScroll = () => {
 scrolled.value = window.scrollY > 50
}

const fetchVendors = async () => {
  loadingVendors.value = true
  try {
    const [recRes, trendRes, newRes] = await Promise.all([
      vendors_api.getAll({ sortBy: 'recommended', limit: 12 }),
      vendors_api.getAll({ sortBy: 'trending', limit: 12 }),
      vendors_api.getAll({ sortBy: 'newest', limit: 12 })
    ])
    
    recommendedVendors.value = recRes.data?.vendors || recRes.data?.data?.vendors || recRes.data || []
    trendingVendors.value = trendRes.data?.vendors || trendRes.data?.data?.vendors || trendRes.data || []
    newVendors.value = newRes.data?.vendors || newRes.data?.data?.vendors || newRes.data || []
    
    // Combine for promotions fallback
    vendors.value = [...recommendedVendors.value, ...trendingVendors.value, ...newVendors.value]
  } catch (e) {
    console.error('Failed to fetch vendors:', e)
  } finally {
    loadingVendors.value = false
  }
}

const handleNotifyVendor = (vendor: any) => {
  // Hook into your notification system here
  // e.g. toast("We'll ping you when they're back online!")
  console.log('Notify when open:', vendor._id)
}

const activePromotions = computed(() => {
 const promos: any[] = []
 vendors.value.forEach(v => {
 if (v.banners && v.banners.length > 0) {
 v.banners.forEach((b: any) => {
 if (b.isActive) {
 promos.push({
 ...b,
 vendorName: v.storeName,
 vendorId: v._id,
 vendorAvatar: v.owner?.avatar
 })
 }
 })
 }
 })
 // Shuffle items for variety
 return promos.sort(() => Math.random() - 0.5)
})

const currentSlangIndex = ref(0)
const currentHeadingIndex = ref(0)

const heroHeadings = [
  { text: '<span class="text-parentPrimary ">Sapa</span> dey finish.<br/>Have you eaten?', lang: '🇳🇬 Pidgin' },
  { text: 'Ebi ń pa mí.<br/><span class="text-parentPrimary ">Jẹun</span> ti tó!', lang: '🟢 Yoruba' },
  { text: '<span class="text-parentPrimary ">Agụụ</span> na-agụ m.<br/>Kedu ihe ị ga-eri?', lang: '🔴 Igbo' },
  { text: 'Yunwa ta kashe ni.<br/><span class="text-parentPrimary ">Abinci</span> ya zo!', lang: '🟡 Hausa' },
  { text: 'Don\'t <span class="text-parentPrimary ">do over!</span><br/>Order sharp sharp.', lang: '🇳🇬 Pidgin' },
  { text: 'Oúnjẹ campus...<br/><span class="text-parentPrimary ">zero stress</span> delivery.', lang: '🇳🇬 Pidgin' },
  { text: 'Body go tell you<br/>if you <span class="text-parentPrimary ">no chop.</span>', lang: '🇳🇬 Pidgin' },
  { text: 'Who no chop,<br/><span class="text-parentPrimary ">no fit read.</span>', lang: '🇳🇬 Pidgin' },
  { text: 'Ẹ̀wà mà jẹ́ <br/>kó <span class="text-parentPrimary ">dùn.</span> Chop now!', lang: '🟢 Yoruba' },
  { text: 'Nwanne, <span class="text-parentPrimary ">agụụ</span> <br/>adịghị mma.', lang: '🔴 Igbo' },
  { text: 'Ciwon <span class="text-parentPrimary ">ciki</span> <br/>ba wasa bane.', lang: '🟡 Hausa' },
  { text: 'Food is ready.<br/><span class="text-parentPrimary ">Level up</span> your day!', lang: '🇳🇬 Pidgin' },
]

const slangSlogans = [
  "Sapa is real, but hunger is realer. 💸",
  "No leave, no transfer—just chop. 🍽️",
  "Awoof dey run belle, but Errandr dey save life. 🏃‍♂️",
  "Body go tell you if you no chop. 💪",
  "E choke! Best meals on campus. 🔥",
  "Who no chop, no fit read. 📚",
  "Ẹ̀wà mà jẹ́ kó dùn. Errandr got you. 🫡",
  "Nwanne, order nri gị ugbu a! 🍛",
  "Abinci mai kyau — cikin dakika! ⚡",
  "Level up your food game. No capping. 🧢"
]

const floatingSlang = [
  "DON'T DO OVER", "SAPA NICE ONE", "NO CAPPING", "CHOP LIFE", "E CHOKE", "AWOOF"
]

const slangStyle = (i: number) => {
  const positions = [
    { top: '15%', left: '5%' },
    { top: '25%', right: '8%' },
    { bottom: '20%', left: '10%' },
    { bottom: '15%', right: '12%' },
    { top: '60%', left: '2%' },
    { top: '50%', right: '4%' }
  ]
  return positions[i]
}

const quickTags = [
  { label: 'Sapa Friendly', icon: '💸', desc: 'Meals under ₦1,500' },
  { label: 'Awoof Deals', icon: '🎁', desc: 'Buy 1 Get 1 Free' },
  { label: 'Fast Dispatch', icon: '⚡', desc: 'Delivery in < 15 mins' },
  { label: 'Late Night', icon: '🌙', desc: 'Open till 2AM' },
]

const heroVisuals = [hero1, hero14, hero12, hero2]

const startSlangRotation = () => {
  setInterval(() => {
    currentSlangIndex.value = (currentSlangIndex.value + 1) % slangSlogans.length
    currentHeadingIndex.value = (currentHeadingIndex.value + 1) % heroHeadings.length
  }, 4000)
}

const handlePromoClick = async (promo: any) => {
  // If promo has a link to a specific product (format: product:ID)
  if (promo.link && promo.link.startsWith('product:')) {
    const productId = promo.link.split(':')[1];
    try {
      const res = await products_api.getProduct(productId);
      const product = res.data?.data || res.data;
      if (product) {
        // Clear cart for "Special Direct Order"
        cartStore.clearCart();
        cartStore.addItem({
          productId: product._id,
          vendorId: promo.vendorId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          customizations: []
        });
        navigateTo('/cart');
        return;
      }
    } catch (e) {
      console.error('Failed to quick-buy product', e);
    }
  }
  
  // Default: Go to vendor
  navigateTo(`/vendors/${promo.vendorId}`);
}

const navigateToVendor = (vendor: any) => {
  if (!vendor.isOpen && vendor.statusMessage !== 'open') {
    selectedVendorForModal.value = vendor;
    isClosedModalOpen.value = true;
    return;
  }
  router.push(`/vendors/${vendor._id}`);
};

const handleShareVendor = (vendor: any) => {
  selectedVendorForShare.value = vendor;
  isShareModalOpen.value = true;
};

onMounted(() => {
 window.addEventListener('scroll', handleScroll)
 fetchVendors()
 fetchSuggestions()
 startSlangRotation()
})

onUnmounted(() => {
 window.removeEventListener('scroll', handleScroll)
})

const scrollCarousel = (direction: 'left' | 'right', id: string) => {
 const container = document.getElementById(id)
 if (container) {
 const scrollAmount = direction === 'left' ? -340 : 340
 container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
 }
}

// Data
const getVendorColor = (name: string) => {
 if (!name) return 'bg-gray-400';
 const colors = ['bg-parentPrimary', 'bg-accent', 'bg-secondary', 'bg-gray-900', 'bg-parentPrimary', 'bg-emerald-500', 'bg-rose-500', 'bg-blue-800', 'bg-indigo-900'];
 let hash = 0;
 for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
 return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
 if (!name) return '??';
 return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
 display: none;
}
.hide-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
}
.animate-float {
 animation: float 6s ease-in-out infinite;
}
@keyframes float {
 0%, 100% { transform: translateY(0) rotate(0); }
 50% { transform: translateY(-20px) rotate(5deg); }
}
.animate-spin-slow {
 animation: spin 8s linear infinite;
}
@keyframes spin {
 from { transform: rotate(0deg); }
 to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* New Modern Transitions */
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from { opacity: 0; transform: translateY(20px); }
.fade-up-leave-to { opacity: 0; transform: translateY(-20px); }

.scale-fade-enter-active, .scale-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.scale-fade-enter-from { opacity: 0; transform: scale(0.95) rotate(-2deg); }
.scale-fade-leave-to { opacity: 0; transform: scale(1.05) rotate(2deg); }

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from { opacity: 0; transform: translateX(100%); }
.fade-slide-leave-to { opacity: 0; transform: translateX(100%); }

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}
@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
}

.animate-vertical-marquee {
  display: block;
  animation: vertical-marquee 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes vertical-marquee {
  0% { transform: translateY(100%); opacity: 0; }
  10%, 90% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
}

.animate-draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 1.5s ease-out forwards 1s;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.animate-float-various {
  animation: float-various 10s ease-in-out infinite alternate;
}

@keyframes float-various {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, -10px) rotate(2deg); }
  66% { transform: translate(-10px, 20px) rotate(-2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.animate-fade-in-up {
  animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Hero Heading Rotation */
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-slide-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.hero-slide-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(8deg); }
  60% { transform: rotate(-4deg); }
  80% { transform: rotate(4deg); }
}

@keyframes moonPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 8px rgba(30,30,46,0.08); }
  50% { transform: scale(1.04); box-shadow: 0 0 0 16px rgba(30,30,46,0.04); }
}

</style>
