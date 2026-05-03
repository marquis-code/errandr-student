<template>
 <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
 <BatchDeliveryBanner />
    <!-- Navbar -->
    <nav 
      class="fixed w-[95%] left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 rounded-[2rem] mt-4"
      :class="[
        scrolled 
          ? 'bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] py-3' 
          : 'bg-transparent py-5'
      ]"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <img src="@/assets/img/logo.webp" alt="Errandr Logo" class="h-10 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
          </NuxtLink>
          
          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-10">
            <a v-for="link in navLinks" :key="link.href" :href="link.href" class="text-[11px] font-black text-gray-400 hover:text-gray-900 tracking-[0.2em] uppercase transition-all relative group">
              {{ link.label }}
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-parentPrimary transition-all group-hover:w-full"></span>
            </a>
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
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Notifications ({{ unreadCount }})</p>
                    </div>
                    <div class="p-4 flex flex-col items-center justify-center text-center space-y-3 py-10">
                      <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                         <BellOff class="w-8 h-8 text-gray-200" />
                      </div>
                      <p class="text-xs font-bold text-gray-900 leading-none">No new alerts</p>
                      <p class="text-[10px] font-bold text-gray-400 max-w-[180px]">We'll let you know when your order status changes.</p>
                    </div>
                    <div class="p-2">
                       <NuxtLink to="/notifications" class="w-full py-3 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors bg-gray-50/50 rounded-2xl">View All Notifications</NuxtLink>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>

              <!-- Profile Dropdown -->
              <Menu as="div" class="relative">
                <MenuButton class="flex items-center gap-3 p-1 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all p-1.5 focus:outline-none">
                  <div class="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm border border-gray-800">
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
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                      <p class="text-xs font-black text-gray-900 truncate tracking-tight">{{ user.firstName }} {{ user.lastName }}</p>
                    </div>
                    <div class="p-2">
                      <MenuItem v-slot="{ active }">
                        <NuxtLink to="/dashboard" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-3 text-xs font-bold transition-colors']">
                          <Home class="w-4 h-4 mr-3" /> Dashboard
                        </NuxtLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <NuxtLink to="/dashboard/profile" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-3 text-xs font-bold transition-colors']">
                          <User class="w-4 h-4 mr-3" /> My Profile
                        </NuxtLink>
                      </MenuItem>
                    </div>
                    <div class="p-2">
                      <MenuItem v-slot="{ active }">
                        <button @click="handleLogout" :class="[active ? 'bg-rose-50 text-rose-500' : 'text-rose-500', 'flex w-full items-center rounded-xl px-3 py-3 text-xs font-bold transition-colors uppercase tracking-widest']">
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
              <NuxtLink to="/auth/login" class="px-6 py-3 text-[11px] font-black text-gray-900 tracking-widest uppercase hover:text-parentPrimary transition-colors">
                Log in
              </NuxtLink>
              <NuxtLink to="/auth/register" class="hidden md:flex px-8 py-3.5 bg-gray-900 text-white text-[11px] font-black tracking-widest uppercase rounded-2xl shadow-2xl shadow-black/10 hover:bg-parentPrimary hover:scale-105 active:scale-95 transition-all">
                Join Now
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
            <a 
              v-for="link in navLinks" 
              :key="link.href" 
              :href="link.href" 
              @click="showMobileMenu = false"
              class="text-4xl font-black text-gray-900 tracking-tighter hover:text-parentPrimary transition-colors"
            >
              {{ link.label }}
            </a>
          </div>
          <div class="h-px bg-gray-50 w-full"></div>
          <NuxtLink v-if="!user" to="/auth/login" class="block text-xl font-bold text-gray-400 hover:text-gray-900 transition-colors">Log into your account</NuxtLink>
          <NuxtLink v-else to="/dashboard" class="block text-xl font-bold text-parentPrimary hover:text-gray-900 transition-colors">Go to Dashboard &rarr;</NuxtLink>
        </div>
        
        <div class="space-y-6">
          <NuxtLink v-if="!user" to="/auth/register" class="block w-full py-5 bg-gray-900 text-white text-center text-sm font-black tracking-widest uppercase rounded-[1.5rem] shadow-xl">
            Join Now
          </NuxtLink>
          <button v-else @click="handleLogout" class="block w-full py-5 bg-rose-50 text-rose-500 text-center text-sm font-black tracking-widest uppercase rounded-[1.5rem] border border-rose-100">
            Log out
          </button>
          <div class="flex gap-4">
            <a href="#" class="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400"><Twitter class="w-5 h-5" /></a>
            <a href="#" class="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400"><Instagram class="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </Transition>

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
      class="relative pt-36 pb-16 lg:pt-40 lg:pb-24 bg-white overflow-visible"
    >
      <!-- Background -->
      <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-0 -left-20 w-[600px] h-[600px] bg-parentPrimary/[0.03] rounded-full blur-[150px] animate-pulse-slow" />
        <div class="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-secondary/[0.08] rounded-full blur-[150px] animate-pulse-slow" style="animation-delay: 3s" />
      </div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative text-center" :class="showSuggestions ? 'z-[9999]' : 'z-10'">
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- Badge -->
          <NuxtLink to="/vendors" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/5 border border-parentPrimary/10 text-parentPrimary text-[10px] font-black tracking-[0.2em] uppercase animate-fade-in-up hover:bg-parentPrimary/10 transition-colors">
            <Zap class="w-3.5 h-3.5 fill-current" /> Campus Delivery, Redefined
          </NuxtLink>
          
          <!-- Rotating Hero Heading (Optimized Size) -->
          <div class="relative h-[120px] md:h-[180px] lg:h-[220px] overflow-hidden flex items-center justify-center">
            <TransitionGroup name="hero-slide" tag="div" class="w-full">
              <h1 
                :key="currentHeadingIndex"
                class="absolute inset-0 flex flex-col items-center justify-center text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] text-gray-900 px-4 font-onest"
              >
                <div class="max-w-max mx-auto text-center" v-html="heroHeadings[currentHeadingIndex].text"></div>
                <!-- <div class="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500">
                  <span class="w-1.5 h-1.5 rounded-full bg-parentPrimary animate-pulse"></span>
                  <span class="text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
                    {{ heroHeadings[currentHeadingIndex].lang }}
                  </span>
                </div> -->
              </h1>
            </TransitionGroup>
          </div>

          <!-- Rotating Slang Subtitle -->
          <div class="h-8 overflow-hidden text-sm md:text-lg font-bold text-gray-400 tracking-tight flex items-center justify-center">
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
                class="flex-1 bg-transparent border-none outline-none text-xs md:text-sm font-bold text-gray-900 placeholder:text-gray-300 px-1 md:px-2 min-w-0"
              />
              <button 
                @click="handleHeroSearch"
                class="px-4 md:px-8 py-3 md:py-4 bg-gray-900 text-white rounded-[2rem] text-[9px] md:text-[10px] font-black tracking-widest uppercase hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all shadow-xl whitespace-nowrap flex-shrink-0 flex items-center gap-2"
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
                    <span class="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
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
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ product.vendor?.storeName || 'Campus Vendor' }}</p>
                      </div>
                      <div class="text-right">
                        <span class="text-xs font-black text-gray-900">₦{{ product.price?.toLocaleString() }}</span>
                      </div>
                    </div>

                    <!-- Empty state -->
                    <div v-if="!isSearching && hasSearched && heroSearchSuggestions.length === 0" class="p-8 text-center bg-gray-50/50 rounded-3xl m-2 border border-dashed border-gray-200">
                      <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                        <span class="text-3xl">🍽️</span>
                      </div>
                      <p class="text-sm font-black text-gray-900 mb-1">No meals match "{{ heroSearchQuery }}"</p>
                      <p class="text-[10px] font-bold text-gray-400 mb-4 max-w-xs mx-auto">Check out these popular picks for {{ suggestionTimeText.toLowerCase() }}!</p>
                      
                      <div v-if="timeOfDaySuggestions.length > 0" class="space-y-2 text-left">
                        <div 
                          v-for="product in timeOfDaySuggestions.slice(0, 4)" 
                          :key="'tod-' + product._id"
                          @click="router.push(`/vendors/${product.vendor?._id || product.vendor}`)"
                          class="flex items-center gap-3 p-3 bg-white hover:bg-parentPrimary/5 rounded-xl border border-gray-100 cursor-pointer transition-all group hover:border-parentPrimary/20"
                        >
                          <div class="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                            <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
                            <Utensils v-else class="w-4 h-4 m-auto text-parentPrimary/30" />
                          </div>
                          <div class="flex-1 min-w-0">
                             <h4 class="text-[11px] font-black text-gray-900 truncate group-hover:text-parentPrimary transition-colors">{{ product.name }}</h4>
                             <p class="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{{ product.vendor?.storeName || 'Campus Vendor' }}</p>
                          </div>
                          <span class="text-[10px] font-black text-gray-900">₦{{ product.price?.toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Time-of-day suggestions -->
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
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ product.vendor?.storeName || 'Campus Vendor' }}</p>
                        </div>
                        <div class="text-right">
                          <span class="text-xs font-black text-gray-900">₦{{ product.price?.toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
          </div>

          <!-- Quick Tags -->
          <!-- <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
             <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest mr-1">E choke:</span>
             <button v-for="tag in quickTags.slice(0,4)" :key="tag.label" 
              class="px-4 py-2 bg-gray-50 hover:bg-white border border-gray-100 hover:border-parentPrimary/30 rounded-xl text-[9px] font-black text-gray-600 hover:text-parentPrimary transition-all shadow-sm hover:shadow-md"
             >
               {{ tag.label }}
             </button>
          </div> -->
        </div>
      </div>
    </section>

    <!-- The Animated Visual Showroom (Former Carousel Images) -->
    <LandingScrollGallery :images="heroVisuals" />


 <!-- Vendor Spotlight Marquee -->
  <LandingVendorMarquee />



  <!-- Spin the Wheel Section -->
  <section class="py-16 lg:py-24 bg-gray-50 border-t border-gray-100 overflow-hidden relative">
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 40px 40px;"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div class="order-2 lg:order-1 flex justify-center">
          <SpinWheel class="w-full max-w-md" />
        </div>
        <div class="order-1 lg:order-2 space-y-8 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/10 border border-parentPrimary/20 text-parentPrimary text-xs font-black uppercase tracking-widest mx-auto lg:mx-0">
            <Sparkles class="w-4 h-4" /> Daily Luck
          </div>
          <h2 class="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
            Spin once. <br /><span class="text-parentPrimary italic">Win every day.</span>
          </h2>
          <p class="text-gray-500 text-lg font-bold leading-relaxed tracking-tight max-w-md mx-auto lg:mx-0">
            Try your luck on the Errandr Wheel of Fortune! Win delivery discounts, free meals, and exclusive campus vouchers. Reset every 24 hours.
          </p>
          <div class="flex items-center justify-center lg:justify-start gap-8 pt-4">
            <div class="flex flex-col">
              <span class="text-3xl font-black text-gray-900">100%</span>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Free to play</span>
            </div>
            <div class="w-px h-12 bg-gray-200"></div>
            <div class="flex flex-col">
              <span class="text-3xl font-black text-gray-900">24h</span>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reset cycle</span>
            </div>
          </div>
        </div>
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
 <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Campus Bonanzas</h2>
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
 <span class="px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-black tracking-widest shadow-sm">
 PROMO
 </span>
 </div>

 <div class="absolute bottom-4 left-4 right-4">
 <h3 class="text-xl font-bold text-white tracking-tight leading-tight mb-1 truncate">{{ promo.title }}</h3>
 <p class="text-xs text-white/80 line-clamp-1 font-medium">{{ promo.description }}</p>
 </div>
 </div>
 <div class="p-5 flex items-center justify-between bg-white">
 <span class="text-xs font-bold text-gray-900 flex items-center gap-2">
 <Store class="w-3.5 h-3.5 text-gray-400" /> {{ promo.vendorName }}
 </span>
 <span class="text-[10px] font-black text-rose-500 tracking-widest uppercase bg-rose-50 px-3 py-1.5 rounded-xl transition-colors group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-md">Claim Offer &rarr;</span>
 </div>
 </div>
 </div>
 </div>
 </section>

 <!-- Interactive Carousel: Featured Vendors -->
 <section id="featured" class="py-12 lg:py-16 bg-white overflow-hidden border-t border-gray-100">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
 <div class="flex items-end justify-between">
 <div>
 <div class="inline-flex items-center gap-2 text-parentPrimary font-bold text-sm mb-2 text-center">
 <Store class="w-4 h-4" /> Top Rated
 </div>
 <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Campus Favorites</h2>
 </div>
 <div class="flex items-center gap-4">
 <NuxtLink to="/vendors" class="text-sm font-bold text-parentPrimary hover:underline underline-offset-4 hidden sm:block">View All Vendors &rarr;</NuxtLink>
 <div class="flex gap-2">
 <button @click="scrollCarousel('left', 'vendor-carousel')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm bg-white z-10">
 <ChevronLeft class="w-5 h-5" />
 </button>
 <button @click="scrollCarousel('right', 'vendor-carousel')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm bg-white z-10">
 <ChevronRight class="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>
 <NuxtLink to="/vendors" class="text-sm font-bold text-parentPrimary hover:underline underline-offset-4 sm:hidden mt-4 inline-block">View All Vendors &rarr;</NuxtLink>
 </div>

 <!-- Carousel Container -->
 <div class="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-0">
 <div id="vendor-carousel" class="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
 <div v-if="loadingVendors" v-for="i in 4" :key="i" class="min-w-[280px] sm:min-w-[320px] h-[280px] bg-gray-50 rounded-3xl animate-pulse shadow-sm border border-gray-100 snap-start shrink-0" />
 
  <div v-else-if="vendors.length === 0" class="w-full py-20 px-10 bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center text-center animate-fade-in snap-start">
  <div class="relative mb-12 transform -rotate-3 hover:rotate-0 transition-transform duration-700">
  <div class="absolute -inset-8 bg-parentPrimary/10 blur-3xl rounded-full animate-pulse-slow"></div>
  <div class="w-32 h-32 bg-white rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] flex items-center justify-center text-6xl relative z-10 border border-gray-50">
  🌙
  </div>
  </div>
  <h3 class="text-3xl font-black text-gray-900 mb-4 tracking-tighter">The Campus is Resting</h3>
  <p class="text-gray-500 font-bold text-lg mb-10 max-w-md leading-relaxed">Our favorite vendors are currently offline or catching a break. Check back soon for the best meals on campus!</p>
  <div class="inline-flex items-center gap-3 px-8 py-4 bg-gray-50 rounded-2xl text-[11px] font-black text-gray-400 border border-gray-100 tracking-[0.2em] uppercase shadow-sm">
  <Clock class="w-4 h-4 text-parentPrimary" />
  Most vendors open at 8:00 AM
  </div>
  </div>
 
 <template v-else>
 <div v-for="vendor in vendors" :key="vendor._id" 
 @click="navigateToVendor(vendor)"
 class="min-w-[280px] sm:min-w-[320px] w-[280px] sm:w-[320px] snap-start shrink-0 group cursor-pointer relative flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
  <div class="relative h-[180px] w-full overflow-hidden">
  <!-- Closed Overlay -->
  <div v-if="!vendor.isOpen" class="absolute inset-0 z-20 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center">
  <div class="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
  <span class="text-white text-[10px] font-black tracking-[0.2em] uppercase">Closed Now</span>
  </div>
  </div>
  
  <img :src="vendor.banner || vendor.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop'" 
  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" :class="{'grayscale opacity-60': !vendor.isOpen}" alt="Vendor Banner" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
  
  <div class="absolute top-5 left-5">
  <div :class="`w-14 h-14 rounded-2xl flex items-center justify-center text-md font-black text-white shadow-2xl border-2 border-white/20 ${getVendorColor(vendor.storeName)}`">
  {{ getInitials(vendor.storeName) }}
  </div>
  </div>

                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 overflow-hidden">
                  <span class="px-3 py-1.5 bg-gray-900/10 backdrop-blur-xl rounded-xl text-gray-900 text-[9px] font-black border border-gray-900/10 truncate transition-all duration-500 group-hover:bg-parentPrimary group-hover:text-white group-hover:border-parentPrimary">
                    {{ vendor.category }}
                  </span>
                  <span v-if="vendor.rating" class="flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-[10px] font-black text-gray-900 shadow-xl border border-gray-50 group-hover:scale-105 transition-transform duration-500">
                    <Star class="w-3 h-3 text-parentPrimary fill-current" /> {{ vendor.rating.toFixed(1) }}
                  </span>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-4 mb-3">
                    <h3 class="text-xl font-black text-gray-900 group-hover:text-parentPrimary transition-colors tracking-tight truncate">{{ vendor.storeName }}</h3>
                    <div v-if="vendor.isOpen" class="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span class="text-[9px] font-black tracking-widest uppercase">open</span>
                    </div>
                    <div v-else class="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-400 rounded-lg border border-gray-100">
                      <div class="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <span class="text-[9px] font-black tracking-widest uppercase">{{ vendor.statusMessage || 'closed' }}</span>
                    </div>
                  </div>
                  <p class="text-[13px] text-gray-500 line-clamp-2 mb-6 leading-relaxed font-medium group-hover:text-gray-600 transition-colors">{{ vendor.description }}</p>
                </div>
                <div class="flex items-center justify-between pt-5 border-t border-gray-50/80">
                  <div class="flex items-center gap-4 text-[10px] font-black text-gray-400 tracking-tight">
                    <span class="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors"><Clock class="w-3.5 h-3.5" /> {{ vendor.preparationTime || 20 }} min</span>
                    <span class="flex items-center gap-1.5 text-parentPrimary/80 group-hover:text-parentPrimary transition-colors"><Bike class="w-3.5 h-3.5" /> From ₦{{ vendor.baseDeliveryFee || 600 }}</span>
                  </div>
                  <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-parentPrimary group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                    <ArrowUpRight class="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
 </template>
 </div>
 </div>
 </section>

 <!-- Vendor Closed Modal -->
 <VendorClosedModal 
 :isOpen="isClosedModalOpen" 
 :vendor="selectedVendorForModal" 
 @close="isClosedModalOpen = false" 
 />



 <!-- UI Feature: Custom Errands -->
 <section class="py-12 lg:py-16 bg-white relative overflow-hidden">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
 <div class="space-y-5 lg:space-y-6">
 <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold">
 Request Any Errand
 </div>
 <h2 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-none">
 Any item. <br />Any <span class="text-parentPrimary">location.</span>
 </h2>
 <p class="text-gray-500 text-base font-medium leading-relaxed tracking-tight">
 Not just food. Send an Errandr to your hostel to pick up items, deliver docs to class, or handle any request from Point A to Point B.
 </p>
 <div class="flex flex-wrap gap-4">
 <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
 <div class="w-2 h-2 rounded-full bg-parentPrimary"></div>
 <span class="text-xs font-bold text-gray-400">Hostel Pickups</span>
 </div>
 <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
 <div class="w-2 h-2 rounded-full bg-parentPrimary"></div>
 <span class="text-xs font-bold text-gray-400">Library Drops</span>
 </div>
 </div>
 <div class="pt-2">
 <NuxtLink to="/errands/custom" class="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-parentPrimary transition-all shadow-md inline-block">Request an Errand &rarr;</NuxtLink>
 </div>
 </div>
 <div class="relative hidden sm:block">
 <div class="absolute -inset-10 bg-blue-100/50 blur-[80px] rounded-full"></div>
 <img src="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=800&q=80" class="relative z-10 rounded-3xl lg:rounded-[2.5rem] shadow-xl border-2 border-white object-cover aspect-video w-full" alt="Delivery in progress" />
 <div class="absolute -bottom-6 -left-6 bg-white p-4 lg:p-5 rounded-2xl shadow-xl border border-gray-50 max-w-[220px] z-20 animate-float">
 <div class="flex items-center gap-4 mb-4">
 <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</div>
 <p class="text-xs font-bold text-gray-900">Errandr on the way</p>
 </div>
 <p class="text-[10px] font-bold text-gray-400 leading-relaxed ">Assigned to: Ade (Student Errandr)</p>
 </div>
 </div>
 </div>
 </div>
 </section>







 <!-- How it works (Redesigned to match Image 2) -->
  <section id="how-it-works" class="py-24 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
        <div class="space-y-4 max-w-2xl">
          <p class="text-[10px] font-black tracking-[0.2em] uppercase text-parentPrimary">How It Works</p>
          <h2 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight italic">
            Getting your <span class="text-parentPrimary">chop</span> with Errandr is simple and sharp-sharp.
          </h2>
        </div>
        <p class="text-gray-400 font-bold text-sm max-w-xs lg:text-right">From choosing your plug to hostel delivery, we guide you every step of the way.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(step, i) in [
          { title: 'Pick your Plug', desc: 'Select the campus restaurant or vendor that fits your current vibes and budget.', icon: '🏪', bg: 'bg-emerald-50' },
          { title: 'Check the Menu', desc: 'Browse through updated menus and pick exactly what you want to eat.', icon: '📜', bg: 'bg-parentPrimary/10' },
          { icon: '📱', title: 'Place Order', desc: 'Securely pay in seconds and get assigned an Errandr immediately.', bg: 'bg-blue-50' },
          { icon: '🏠', title: 'Hostel Drop', desc: 'Your student Errander drops it off sharp-sharp at your door.', bg: 'bg-rose-50' }
        ]" :key="i" class="p-8 pb-32 rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-2 transition-all duration-500" :class="step.bg">
          <div class="relative z-10 space-y-4">
            <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ step.title }}</h3>
            <p class="text-xs text-gray-500 font-bold leading-relaxed">{{ step.desc }}</p>
          </div>
          <div class="absolute bottom-6 right-6 text-6xl opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            {{ step.icon }}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- The Errandr Advantage (Redesigned to match Image 3) -->
  <section id="advantage" class="py-24 bg-gray-50/50">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div class="space-y-8">
        <div class="space-y-4">
          <p class="text-[10px] font-black tracking-[0.2em] uppercase text-parentPrimary">Why Choose Us</p>
          <h2 class="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9] italic">
            Built on <span class="text-parentPrimary italic">trust,</span> <br/> speed, and vibes.
          </h2>
        </div>
        <p class="text-gray-500 text-lg font-bold leading-relaxed tracking-tight max-w-md">
          We combine real-time student dispatchers with quality local vendors to deliver a campus experience you can depend on. No stress, just good chop.
        </p>
        <div class="pt-4">
          <NuxtLink to="/about" class="inline-flex items-center gap-2 text-parentPrimary font-black text-sm hover:gap-4 transition-all group">
            Learn more about Errandr <ArrowUpRight class="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 py-12 px-8 bg-white rounded-[3rem] border border-gray-100 shadow-xl relative">
        <div v-for="feat in [
          { title: 'Independent Riders', desc: 'Student dispatchers who know every corner of your hostel and campus.', icon: Target },
          { title: 'Local Expertise', desc: 'We only partner with the best and cleanest vendors on your campus.', icon: Layers },
          { title: 'Sapa Friendly', desc: 'Transparent pricing and minimal fees for every student pocket.', icon: ShieldCheck },
          { title: 'Real-time Bants', desc: 'Track your order live and chat with your dispatcher instantly.', icon: MessageCircle }
        ]" :key="feat.title" class="space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-parentPrimary/10 flex items-center justify-center text-parentPrimary">
            <component :is="feat.icon" class="w-6 h-6" />
          </div>
          <div class="space-y-2">
            <h4 class="text-lg font-black text-gray-900 tracking-tight">{{ feat.title }}</h4>
            <p class="text-xs text-gray-500 font-bold leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section (New) -->
  <LandingFAQ />

  <!-- Contact Section (New) -->
  <LandingContact />

  <!-- CTA section -->
  <section class="py-24 bg-gray-900 text-center overflow-hidden relative">
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-parentPrimary/10 rounded-full blur-[120px]"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
    
  <div class="max-w-4xl mx-auto px-6 lg:px-10 relative z-10">
  <h2 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 italic">
  Enough bants. <br /><span class="text-parentPrimary">Let's get you fed.</span>
  </h2>
  <p class="text-lg text-gray-400 font-medium mb-8 leading-relaxed max-w-2xl mx-auto">
  Join thousands of students who trust Errandr for their daily meals and hostel runs. Zero stress, 100% vibes.
  </p>
  <NuxtLink to="/auth/register" class="inline-flex items-center justify-center px-10 py-5 bg-parentPrimary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_20px_50px_rgba(240,165,0,0.3)] hover:scale-105 active:scale-95 transition-all">
    Join Errandr now
  </NuxtLink>
  <p class="mt-8 text-xs font-black text-gray-500 uppercase tracking-widest">Already have an account? <NuxtLink to="/auth/login" class="text-white hover:text-parentPrimary transition-colors underline underline-offset-8">Login here</NuxtLink></p>
  </div>
  </section>

  <!-- Student Testimonials -->
  <LandingTestimonials />

  <!-- Footer -->
 <footer class="bg-gray-50 border-t border-gray-200 py-16">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
 <div class="md:col-span-1">
  <NuxtLink to="/" class="flex items-center gap-3 mb-8 group">
  <img src="@/assets/img/logo.webp" alt="Errandr Logo" class="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
  </NuxtLink>
 <p class="text-gray-500 text-sm leading-relaxed mb-6 font-medium">The premium food delivery network built exclusively for the modern student community.</p>
 <div class="flex items-center gap-4">
 <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm">
 <Twitter class="w-4 h-4"/>
 </a>
 <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm">
 <Instagram class="w-4 h-4"/>
 </a>
 <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm">
 <Facebook class="w-4 h-4"/>
 </a>
 </div>
 </div>
 
 <div>
 <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-xs">Platform</h4>
 <ul class="space-y-4 text-sm font-medium text-gray-500">
 <li><NuxtLink to="/about" class="hover:text-parentPrimary transition-colors">About Us</NuxtLink></li>
 <li><NuxtLink to="/contact" class="hover:text-parentPrimary transition-colors">Contact Support</NuxtLink></li>
 <li><NuxtLink to="/faq" class="hover:text-parentPrimary transition-colors">FAQ & Help</NuxtLink></li>
 </ul>
 </div>

 <div>
 <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-xs">Legal</h4>
 <ul class="space-y-4 text-sm font-medium text-gray-500">
 <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Terms of Service</NuxtLink></li>
 <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Privacy Policy</NuxtLink></li>
 </ul>
 </div>
 
 <div>
 <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-xs">Join Us</h4>
 <ul class="space-y-4 text-sm font-medium text-gray-500">
 <li><a href="http://vendor.errandr.shop" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Store class="w-4 h-4" /> List Your Business (Free)</a></li>
 <li><a href="http://dispatch.errandr.shop" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Bike class="w-4 h-4" /> Become an Errandr</a></li>
 </ul>
 </div>
 </div>
 
 <div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
 <p class="text-sm font-medium text-gray-400">
 &copy; {{ new Date().getFullYear() }} Errandr Inc. All rights reserved.
 </p>
 <div class="flex gap-4">
 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" class="h-6 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"/>
 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" class="h-6 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"/>
 </div>
 </div>
 </div>
 </footer>
 </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import BatchDeliveryBanner from '@/components/BatchDeliveryBanner.vue'
import { useUser } from "@/composables/modules/auth/user"
import hero1 from '@/assets/img/hero1.webp'
import hero2 from '@/assets/img/hero2.webp'
import hero12 from "@/assets/img/hero12.webp"
import hero14 from "@/assets/img/hero14.webp"
import LandingScrollGallery from '@/components/Landing/ScrollGallery.vue'
import LandingVendorMarquee from '@/components/Landing/VendorMarquee.vue'
import LandingTestimonials from '@/components/Landing/Testimonials.vue'
import LandingFAQ from '@/components/Landing/FAQ.vue'
import LandingContact from '@/components/Landing/Contact.vue'
import { 
  ArrowRight, Twitter, Instagram, Facebook,
  LogIn, ShoppingBag, Utensils, PlayCircle,
  Clock, MapPin, Star, Store, Bike, ChevronLeft, ChevronRight,
  ShieldCheck, CreditCard, Rocket, Megaphone,
  Pizza, Flame, Beef, Coffee, Menu as MenuIcon, X, Navigation, Repeat, Search, AlertCircle, Zap, ChevronUp, ArrowUpRight, Sparkles,
  Layers, Target, MessageCircle, Home, User, Bell, BellOff, LogOut, ChevronDown
} from 'lucide-vue-next'
import { vendors_api } from '@/api_factory/modules/vendors';
import { products_api } from '@/api_factory/modules/products';

definePageMeta({
 layout: false
})

useHead({
 title: 'Errandr | Premium Campus Delivery',
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
const vendors = ref<any[]>([])
const selectedVendorForModal = ref<any>(null)
const isClosedModalOpen = ref(false)
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
 const res = await vendors_api.getAll({ limit: 12 })
 vendors.value = res.data?.vendors || res.data?.data?.vendors || res.data || []
 } finally {
 loadingVendors.value = false
 }
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
  { text: '<span class="text-parentPrimary italic">Sapa</span> dey finish.<br/>Have you eaten?', lang: '🇳🇬 Pidgin' },
  { text: 'Ebi ń pa mí.<br/><span class="text-parentPrimary italic">Jẹun</span> ti tó!', lang: '🟢 Yoruba' },
  { text: '<span class="text-parentPrimary italic">Agụụ</span> na-agụ m.<br/>Kedu ihe ị ga-eri?', lang: '🔴 Igbo' },
  { text: 'Yunwa ta kashe ni.<br/><span class="text-parentPrimary italic">Abinci</span> ya zo!', lang: '🟡 Hausa' },
  { text: 'Don\'t <span class="text-parentPrimary italic">do over!</span><br/>Order sharp sharp.', lang: '🇳🇬 Pidgin' },
  { text: 'Oúnjẹ campus...<br/><span class="text-parentPrimary italic">zero stress</span> delivery.', lang: '🇳🇬 Pidgin' },
  { text: 'Body go tell you<br/>if you <span class="text-parentPrimary italic">no chop.</span>', lang: '🇳🇬 Pidgin' },
  { text: 'Who no chop,<br/><span class="text-parentPrimary italic">no fit read.</span>', lang: '🇳🇬 Pidgin' },
  { text: 'Ẹ̀wà mà jẹ́ <br/>kó <span class="text-parentPrimary italic">dùn.</span> Chop now!', lang: '🟢 Yoruba' },
  { text: 'Nwanne, <span class="text-parentPrimary italic">agụụ</span> <br/>adịghị mma.', lang: '🔴 Igbo' },
  { text: 'Ciwon <span class="text-parentPrimary italic">ciki</span> <br/>ba wasa bane.', lang: '🟡 Hausa' },
  { text: 'Food is ready.<br/><span class="text-parentPrimary italic">Level up</span> your day!', lang: '🇳🇬 Pidgin' },
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
 if (!vendor.isOpen) {
 selectedVendorForModal.value = vendor
 isClosedModalOpen.value = true
 return
 }
 router.push(`/vendors/${vendor._id}`)
}

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

const steps = [
 { icon: Store, title: 'Check the Menu', description: 'Find your fav school spots and see what is cooking. We plug you to Mavise, Iya Chidera and more.' },
 { icon: CreditCard, title: 'Budget Your Chop', description: 'Use our Meal Planner to manage your cash and ensure you are eating well across the week.' },
 { icon: Bike, title: 'Flash Delivery', description: 'A student Errander handles your run, dropping it off sharp-sharp at your hostel door.' }
]

const categories = [
  { name: 'Fast Food', icon: Pizza, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=400&fit=crop', key: 'snacks' },
  { name: 'Healthy & Fresh', icon: Flame, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', key: 'restaurant' },
  { name: 'Local Soups', icon: Beef, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop', key: 'eatery' },
  { name: 'Coffee & Drinks', icon: Coffee, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=400&fit=crop', key: 'drinks' },
]
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
</style>
