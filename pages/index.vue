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
            <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-10 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
          </NuxtLink>
          
          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-10">
            <a v-for="link in navLinks" :key="link.href" :href="link.href" class="text-[11px] font-black text-gray-400 hover:text-gray-900 tracking-[0.2em] uppercase transition-all relative group">
              {{ link.label }}
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-parentPrimary transition-all group-hover:w-full"></span>
            </a>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink to="/auth/login" class="hidden sm:flex px-6 py-3 text-[11px] font-black text-gray-900 tracking-widest uppercase hover:text-parentPrimary transition-colors">
              Log in
            </NuxtLink>
            <NuxtLink to="/auth/register" class="px-8 py-3.5 bg-gray-900 text-white text-[11px] font-black tracking-widest uppercase rounded-2xl shadow-2xl shadow-black/10 hover:bg-parentPrimary hover:scale-105 active:scale-95 transition-all">
              Join Now
            </NuxtLink>
            <!-- Mobile Toggle -->
            <button @click="showMobileMenu = !showMobileMenu" class="md:hidden w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-900 hover:bg-gray-100 transition-all">
              <Menu v-if="!showMobileMenu" class="w-5 h-5" />
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
          <NuxtLink to="/auth/login" class="block text-xl font-bold text-gray-400 hover:text-gray-900 transition-colors">Log into your account</NuxtLink>
        </div>
        
        <div class="space-y-6">
          <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">The perfect campus companion</p>
          <div class="flex gap-4">
            <a href="#" class="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400"><Twitter class="w-5 h-5" /></a>
            <a href="#" class="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400"><Instagram class="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Search Overlay — Teleported to body root for guaranteed z-index -->
    <Teleport to="body">
      <div 
        v-if="showSuggestions"
        class="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        @click="showSuggestions = false"
      ></div>
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
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/5 border border-parentPrimary/10 text-parentPrimary text-[10px] font-black tracking-[0.2em] uppercase animate-fade-in-up">
            <Zap class="w-3.5 h-3.5 fill-current" /> Campus Delivery, Redefined
          </div>
          
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
            <div class="relative flex flex-col items-center bg-white border-2 border-gray-100 focus-within:border-parentPrimary p-2 rounded-[2rem] shadow-2xl transition-all duration-500 ring-0 focus-within:ring-8 focus-within:ring-parentPrimary/5">
              <div class="w-full flex items-center">
                <div class="w-12 h-12 flex items-center justify-center text-gray-400">
                  <Search class="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  v-model="heroSearchQuery"
                  @keyup.enter="handleHeroSearch"
                  @focus="showSuggestions = true"
                  @blur="handleSearchBlur"
                  placeholder="What are you craving?" 
                  class="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300 px-2"
                />
                <button 
                  @click="handleHeroSearch"
                  class="px-6 py-3.5 bg-gray-900 text-white rounded-[1.3rem] text-[10px] font-black tracking-widest uppercase hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                   Find Food
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
          </div>

          <!-- Quick Tags -->
          <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
             <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest mr-1">E choke:</span>
             <button v-for="tag in quickTags.slice(0,4)" :key="tag.label" 
              class="px-4 py-2 bg-gray-50 hover:bg-white border border-gray-100 hover:border-parentPrimary/30 rounded-xl text-[9px] font-black text-gray-600 hover:text-parentPrimary transition-all shadow-sm hover:shadow-md"
             >
               {{ tag.label }}
             </button>
          </div>
        </div>
      </div>
    </section>

    <!-- The Animated Visual Showroom (Former Carousel Images) -->
    <ScrollGallery :images="heroVisuals" />


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
 @click="navigateTo(`/vendors/${promo.vendorId}`)"
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

 <!-- UI Feature: Meal Planner -->
 <section class="py-16 lg:py-24 bg-gray-900 relative overflow-hidden">
 <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 30px 30px;"></div>
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
 <div class="order-2 lg:order-1">
 <div class="relative">
 <div class="absolute -inset-4 bg-parentPrimary/20 blur-3xl rounded-full"></div>
 <div class="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl md:rounded-[3rem] p-6 lg:p-8 shadow-xl">
 <div class="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
 <div class="space-y-1">
 <h4 class="text-white font-bold text-xl">Meal Planner</h4>
 <p class="text-parentPrimary text-[10px] font-bold">Plan your budget</p>
 </div>
 <Repeat class="w-6 h-6 text-parentPrimary animate-spin-slow" />
 </div>
 <div class="space-y-4">
 <div v-for="i in 3" :key="i" class="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
 <div class="flex items-center gap-4">
 <div class="w-10 h-10 rounded-xl bg-parentPrimary/10 flex items-center justify-center text-parentPrimary font-bold">M{{i}}</div>
 <div>
 <p class="text-white text-xs font-bold">Breakfast Planned</p>
 <p class="text-gray-500 text-[9px] font-bold">Vendor: Mavise + Tasty Delight</p>
 </div>
 </div>
 <div class="text-right">
 <p class="text-parentPrimary font-bold text-xs">₦1,250</p>
 <p class="text-emerald-500 text-[8px] font-bold ">Optimized</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 <div class="order-1 lg:order-2 space-y-8">
 <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/10 border border-parentPrimary/20 text-parentPrimary text-xs font-bold">
 Free Tool
 </div>
 <h2 class="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
 Plan your meal. <br />Manage your <span class="text-parentPrimary">funds.</span>
 </h2>
 <p class="text-gray-400 text-lg font-bold leading-relaxed tracking-tight">
 The meal planner helps you organize your weekly food around campus vendors while maintaining budget control. It's unique, free, and built for students.
 </p>
 <div class="pt-4">
 <NuxtLink to="/meal-planner" class="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-xs hover:bg-parentPrimary hover:text-white transition-all shadow-xl">start planning now &rarr;</NuxtLink>
 </div>
 </div>
 </div>
 </div>
 </section>

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

 <!-- Join the Errandr Network -->
 <section class="py-16 lg:py-24 bg-white relative overflow-hidden">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
 <div class="relative group">
 <div class="absolute -inset-10 bg-parentPrimary/5 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
 <div class="relative z-10 bg-gray-900 rounded-3xl lg:rounded-[4rem] p-8 lg:p-12 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/5">
 <div class="absolute top-0 right-0 p-8">
 <Bike class="w-32 h-32 text-parentPrimary opacity-10 -rotate-12" />
 </div>
 <div class="space-y-6 relative z-10">
 <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold ">
 Campus Network
 </div>
 <h3 class="text-4xl font-bold text-white tracking-tight leading-none">
 Help Others. <br /><span class="text-parentPrimary">Earn Extra.</span>
 </h3>
 <p class="text-gray-400 text-sm font-bold tracking-tight leading-relaxed max-w-sm">
 Join Errandr. Deliver food, pick up packages, and bring happiness to your fellow students' doorsteps.
 </p>
 <div class="pt-4">
 <a href="http://dispatch.errandr.shop/auth/register" class="inline-flex items-center gap-4 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:bg-parentPrimary hover:text-white transition-all shadow-xl">Join to Bring Happiness &rarr;</a>
 </div>
 </div>
 </div>
 </div>
 <div class="space-y-8">
 <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/10 border border-parentPrimary/20 text-parentPrimary text-xs font-bold">
 Student Program
 </div>
 <h2 class="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none">
 Your Hub. <br />Your <span class="text-parentPrimary">Side Hustle.</span>
 </h2>
 <p class="text-gray-500 text-lg font-bold leading-relaxed tracking-tight">
 Errandr empowers you to manage deliveries for your peers, making extra cash while helping the campus grow.
 </p>
 <ul class="space-y-4">
 <li v-for="benefit in ['Flexible Hours', 'Instant Payouts', 'Campus-Wide Reach', 'Zero Signup Fees']" :key="benefit" class="flex items-center gap-3">
 <div class="w-5 h-5 rounded-full bg-parentPrimary/10 flex items-center justify-center text-parentPrimary">
 <Star class="w-3 h-3 fill-current" />
 </div>
 <span class="text-xs font-bold text-gray-900 ">{{ benefit }}</span>
 </li>
 </ul>
 </div>
 </div>
 </div>
 </section>

 <!-- Student Business Hub -->
 <section class="py-16 lg:py-24 bg-gray-50 relative border-t border-gray-100">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="bg-parentPrimary rounded-3xl lg:rounded-[4rem] p-8 md:p-12 lg:p-20 relative overflow-hidden text-center shadow-lg shadow-parentPrimary/20">
 <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl hidden md:block"></div>
 <div class="relative z-10 max-w-2xl mx-auto space-y-8">
 <h2 class="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
 Student Business? <br /><span class="text-white/60">List it for free.</span>
 </h2>
 <p class="text-white/80 text-lg font-bold tracking-tight leading-relaxed">
 We support students. Whether you sell hair products, gadgets, or custom shirts, listing on Errandr is 100% free. No hidden fees.
 </p>
 <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
 <a href="http://vendor.errandr.shop/auth/register" class="px-10 py-5 bg-white text-parentPrimary rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl">Start Selling Now</a>
 </div>
 </div>
 </div>
 </div>
 </section>

 <!-- Local Favorites (Outside School) -->
 <section class="py-16 lg:py-24 bg-white relative overflow-hidden">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
 <div class="space-y-6 lg:space-y-8">
 <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold">
 City Favorites
 </div>
 <h2 class="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none">
 Craving something <br />from <span class="text-parentPrimary">town?</span>
 </h2>
 <p class="text-gray-500 text-lg font-bold leading-relaxed tracking-tight">
 Get your favorite meals from top restaurants outside the campus gate delivered to your hostel. Same fast delivery, same Errandr quality.
 </p>
 <div class="flex flex-wrap gap-4">
 <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
 <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
 <span class="text-xs font-bold text-gray-400">Town Deliveries</span>
 </div>
 <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
 <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
 <span class="text-xs font-bold text-gray-400">Gate Pickups</span>
 </div>
 </div>
 </div>
 <div class="relative hidden sm:block">
 <div class="absolute -inset-10 bg-emerald-100/30 blur-[100px] rounded-full"></div>
 <img src="@/assets/img/hero2.jpg" class="relative z-10 rounded-3xl lg:rounded-[3rem] shadow-xl border-2 md:border-8 border-white object-cover h-[400px] w-full" />
 </div>
 </div>
 </div>
 </section>

 <!-- How it works -->
 <section id="how-it-works" class="py-24 bg-gray-50">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="text-center max-w-2xl mx-auto mb-16">
 <p class="text-parentPrimary font-bold text-sm mb-3">Simple Process</p>
 <h3 class="text-4xl font-bold text-gray-900 tracking-tight mb-4">Steps to get your meal</h3>
 <p class="text-gray-500 font-medium text-lg">We've made it easy for you to focus on your studies while we handle the errands.</p>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
 <!-- Connecting Line (Desktop) -->
 <div class="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
 
 <div v-for="(step, index) in steps" :key="index" class="relative z-10 flex flex-col items-center text-center">
 <div class="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-center text-parentPrimary mb-6 transform group hover:-translate-y-2 transition-transform">
 <component :is="step.icon" class="w-10 h-10" />
 <div class="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs ring-4 ring-gray-50 shadow-sm">
 {{ index + 1 }}
 </div>
 </div>
 <h4 class="text-xl font-bold text-gray-900 tracking-tight mb-2">{{ step.title }}</h4>
 <p class="text-gray-500 font-medium leading-relaxed px-4">{{ step.description }}</p>
 </div>
 </div>
 </div>
 </section>

 <!-- Categories Grid -->
 <section id="categories" class="py-24 overflow-hidden border-t border-gray-100 bg-white">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="flex items-end justify-between mb-12">
 <div>
 <h2 class="text-4xl font-bold text-gray-900 tracking-tight mb-3">Craving Anything Specific?</h2>
 <p class="text-gray-500 font-medium text-lg max-w-xl">Explore the most ordered categories on campus today.</p>
 </div>
 <NuxtLink to="/vendors" class="hidden sm:flex items-center gap-2 text-parentPrimary font-bold hover:gap-3 transition-all px-6 py-3 rounded-xl bg-parentPrimary/5 border border-parentPrimary/10 hover:bg-parentPrimary/10">
 View full menu <ArrowRight class="w-5 h-5" />
 </NuxtLink>
 </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div 
        v-for="cat in categories" 
        :key="cat.name" 
        @click="router.push(`/vendors?category=${cat.key}`)"
        class="group cursor-pointer"
      >
        <div class="relative h-40 md:h-48 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
          <img :src="cat.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Category Image" />
          <div class="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/50 transition-colors"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
            <component :is="cat.icon" class="w-8 h-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
            <h4 class="font-bold text-lg"> {{ cat.name }}</h4>
            <p class="text-xs text-gray-200 mt-1 opacity-100 transition-opacity">Browse &rarr;</p>
          </div>
        </div>
      </div>
    </div>
 </div>
 </section>

 <!-- Student Testimonials -->
 <LandingTestimonials />

 <!-- CTA Section -->
 <section id="benefits" class="py-12 lg:py-16 bg-white relative">
 <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="bg-gray-900 rounded-3xl lg:rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden flex flex-col items-center text-center shadow-lg">
 <div class="absolute -top-32 -right-32 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-parentPrimary/20 rounded-full blur-[80px]"></div>
 <div class="absolute -bottom-32 -left-32 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]"></div>
 
 <div class="relative z-10 max-w-2xl">
 <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6 backdrop-blur-md border border-white/20 text-white shadow-inner">
 <Rocket class="w-8 h-8" />
 </div>
 <h2 class="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
 Ready to satisfy your cravings?
 </h2>
 <p class="text-lg text-gray-400 font-medium mb-8 leading-relaxed">
 Join thousands of students who trust Errandr for their daily meals and essentials.
 </p>
 <NuxtLink to="/auth/register" class="inline-flex items-center justify-center px-8 py-4 bg-parentPrimary text-white rounded-xl font-bold text-base shadow-lg hover:-translate-y-0.5 transition-all">
 create errandr account
 </NuxtLink>
 <p class="mt-6 text-sm text-gray-500 font-medium">Already have an account? <NuxtLink to="/auth/login" class="text-white hover:underline underline-offset-4 cursor-pointer">login here</NuxtLink></p>
 </div>
 </div>
 </div>
 </section>

 <!-- Footer -->
 <footer class="bg-gray-50 border-t border-gray-200 py-16">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
 <div class="md:col-span-1">
  <NuxtLink to="/" class="flex items-center gap-3 mb-8 group">
  <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
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
import BatchDeliveryBanner from '@/components/BatchDeliveryBanner.vue'
import hero1 from '@/assets/img/hero1.jpg'
import hero2 from '@/assets/img/hero2.jpg'
import hero12 from "@/assets/img/hero12.jpg"
import hero14 from "@/assets/img/hero14.jpg"
import ScrollGallery from '@/components/Landing/ScrollGallery.vue'
import { 
  ArrowRight, Twitter, Instagram, Facebook,
  LogIn, ShoppingBag, Utensils, PlayCircle,
  Clock, MapPin, Star, Store, Bike, ChevronLeft, ChevronRight,
  ShieldCheck, CreditCard, Rocket, Megaphone,
  Pizza, Flame, Beef, Coffee, Menu, X, Navigation, Repeat, Search, AlertCircle, Zap, ChevronUp, ArrowUpRight, Sparkles
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

const scrolled = ref(false)
const router = useRouter()
const showMobileMenu = ref(false)
const heroSearchQuery = ref('')
const loadingVendors = ref(true)
const vendors = ref<any[]>([])
const selectedVendorForModal = ref<any>(null)
const isClosedModalOpen = ref(false)

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
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Campus Favorites', href: '#featured' },
  { label: 'Categories', href: '#categories' }
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
 { icon: Store, title: 'Browse Menus', description: 'Explore local campus restaurants and selection from your familiar vendors like Mavise or Iya Chidera.' },
 { icon: CreditCard, title: 'Plan Meals', description: 'Use our Meal Planner to manage your budget and ensure a balanced diet across campus.' },
 { icon: Bike, title: 'Fast Delivery', description: 'A fellow student handles the errand, dropping it off directly at your location.' }
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
