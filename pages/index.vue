<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300" :class="{'py-4': !scrolled, 'py-3 shadow-sm': scrolled}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-parentPrimary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-parentPrimary/20">
              <ShoppingBag class="w-5 h-5 text-white" />
            </div>
            <span class="text-2xl font-black text-parentPrimary tracking-tighter">Errandr</span>
          </div>
          
          <div class="hidden md:flex items-center gap-8">
            <a href="#how-it-works" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">How it works</a>
            <a href="#featured" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">Featured Venues</a>
            <a href="#categories" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">Categories</a>
          </div>

          <div class="flex items-center gap-4">
            <NuxtLink to="/auth/login" class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-parentPrimary transition-colors">
              <LogIn class="w-4 h-4" /> Log in
            </NuxtLink>
            <NuxtLink to="/auth/register" class="px-6 py-2.5 bg-parentPrimary text-white text-sm font-bold rounded-xl shadow-lg shadow-parentPrimary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Sign up
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-24 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-white">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-1/4 -left-20 w-80 h-80 bg-parentPrimary/10 rounded-full blur-[100px] animate-float" />
        <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-[100px] animate-float" style="animation-delay: 2s" />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black mb-6 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              live on campus
            </div>

            <!-- Carousel Text Content -->
            <div class="relative h-[280px] md:h-[350px]">
              <TransitionGroup name="slide-up">
                <div v-for="(slide, index) in slides" :key="index" v-show="currentSlide === index" class="absolute inset-0">
                  <h1 class="text-5xl lg:text-7xl font-black tracking-tight leading-[1] mb-6 text-gray-900 transition-all duration-700">
                    {{ slide.title }} <br />
                    <span class="text-parentPrimary relative inline-block">
                      {{ slide.highlight }}
                      <svg class="absolute w-full h-4 -bottom-2 left-0 text-amber-400 opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
                    </span>
                  </h1>
                  <p class="text-lg pb-4 text-gray-500 max-w-lg leading-relaxed font-medium transition-all duration-700 delay-100">
                    {{ slide.description }}
                  </p>
                </div>
              </TransitionGroup>
            </div>
            
            <div class="flex flex-wrap items-center gap-6 mt-12">
              <NuxtLink to="/dashboard" class="px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-bold text-sm hover:bg-parentPrimary hover:scale-105 transition-all shadow-xl flex items-center gap-3 group">
                browse vendors 
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
              <button class="px-8 py-5 bg-white text-gray-900 rounded-[1.5rem] font-bold text-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-3">
                <PlayCircle class="w-5 h-5 text-gray-400" />
                how it works
              </button>
            </div>

            <div class="mt-14 flex items-center gap-6">
              <div class="flex -space-x-3">
                <img v-for="i in 4" :key="i" :src="`https://i.pravatar.cc/100?img=${i+10}`" class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                <div class="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">+2k</div>
              </div>
              <p class="text-sm font-bold text-gray-400">Trusted by over 2,000+ students daily</p>
            </div>
          </div>

          <!-- Carousel Image Section -->
          <div class="relative lg:h-[600px] flex items-center justify-center">
            <div class="w-full max-w-[500px] aspect-square relative rounded-[3rem] overflow-hidden shadow-2xl group">
              <Transition name="fade" mode="out-in">
                <img :key="currentSlide" :src="slides[currentSlide].image" class="absolute inset-0 w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-all duration-1000" />
              </Transition>
              <div class="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <!-- Floating Widgets -->
              <div class="absolute top-8 left-8 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 animate-float">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Clock class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">arriving in</p>
                    <p class="text-lg font-black text-gray-900 leading-none tracking-tighter">12 mins</p>
                  </div>
                </div>
              </div>

              <div class="absolute bottom-8 right-8 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 animate-float" style="animation-delay: 1.5s">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-[11px] font-black text-gray-900 tracking-tight leading-none mb-1">spicy pepperoni pizza</p>
                    <div class="flex gap-0.5">
                       <Star v-for="i in 5" :key="i" class="w-2.5 h-2.5 text-amber-500 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Carousel Indicators -->
            <div class="absolute bottom-[-40px] flex gap-2">
              <button 
                v-for="(_, i) in slides" 
                :key="i" 
                @click="currentSlide = i"
                class="w-8 h-1.5 rounded-full transition-all duration-500"
                :class="currentSlide === i ? 'bg-parentPrimary w-12' : 'bg-gray-200'"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vendor Spotlight Marquee -->
    <LandingVendorMarquee />

    <!-- Interactive Carousel: Featured Vendors -->
    <section id="featured" class="py-12 lg:py-16 bg-white overflow-hidden border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div class="flex items-end justify-between">
          <div>
            <div class="inline-flex items-center gap-2 text-parentPrimary font-bold text-sm uppercase mb-2 text-center">
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
          
          <div v-else-if="vendors.length === 0" class="w-full max-w-xl text-center py-16 px-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 animate-fade-in snap-start">

          <div class="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-sm transform -rotate-6">🌙</div>
          <h3 class="text-2xl font-black text-gray-900 mb-3 tracking-tight">The Campus is Resting</h3>
          <p class="text-gray-500 font-medium mb-8 leading-relaxed">Our favorite vendors are currently offline or catching a break. Check back soon for the best meals on campus!</p>
          <div class="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl text-xs font-bold text-gray-400 shadow-sm border border-gray-100 uppercase tracking-widest">
            <Clock class="w-4 h-4" /> Most vendors open at 8:00 AM
          </div>
        </div>
        
        <template v-else>
          <div v-for="vendor in vendors" :key="vendor._id" 
               @click="navigateToVendor(vendor)"
               class="min-w-[280px] sm:min-w-[320px] w-[280px] sm:w-[320px] snap-start shrink-0 group cursor-pointer relative flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div class="relative h-[160px] w-full overflow-hidden">
              <img :src="vendor.banner || vendor.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop'" 
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Vendor Banner" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div class="absolute top-4 left-4">
                 <div :class="`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-xl ${getVendorColor(vendor.storeName)}`">
                    {{ getInitials(vendor.storeName) }}
                 </div>
              </div>

              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/30 truncate">
                  {{ vendor.category }}
                </span>
                <span v-if="vendor.rating" class="flex items-center gap-1 bg-white rounded-full px-2 py-1 text-[10px] font-bold text-gray-900 shadow-lg">
                  <Star class="w-3 h-3 text-amber-400 fill-current" /> {{ vendor.rating.toFixed(1) }}
                </span>
              </div>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xl font-bold text-gray-900 group-hover:text-parentPrimary transition-colors tracking-tight truncate">{{ vendor.storeName }}</h3>
                  <div v-if="vendor.isOpen" class="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span class="text-[9px] font-black">open</span>
                  </div>
                  <div v-else class="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-400 rounded-md">
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span class="text-[9px] font-black">{{ vendor.statusMessage || 'closed' }}</span>
                  </div>
                </div>
                <p class="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed font-medium">{{ vendor.description }}</p>
              </div>
              <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                <div class="flex items-center gap-3 text-[10px] font-bold text-gray-400 tracking-tight">
                  <span class="flex items-center gap-1"><Clock class="w-3 h-3" /> {{ vendor.preparationTime || 20 }} min</span>
                  <span class="flex items-center gap-1"><MapPin class="w-3 h-3" /> {{ vendor.isInsideCampus ? 'On-Campus' : 'Off-Campus' }}</span>
                </div>
                <div class="text-[10px] font-black text-parentPrimary uppercase tracking-widest group-hover:underline">Order &rarr;</div>
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
                                  <p class="text-gray-500 text-[9px] uppercase font-bold">Vendor: Mavise + Tasty Delight</p>
                               </div>
                            </div>
                            <div class="text-right">
                               <p class="text-parentPrimary font-bold text-xs">₦1,250</p>
                               <p class="text-emerald-500 text-[8px] font-bold uppercase">Optimized</p>
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
                <img src="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=800&q=80" class="relative z-10 rounded-3xl lg:rounded-[2.5rem] shadow-xl border-4 border-white object-cover aspect-video w-full" alt="Delivery in progress" />
                <div class="absolute -bottom-6 -left-6 bg-white p-4 lg:p-5 rounded-2xl shadow-xl border border-gray-50 max-w-[220px] z-20 animate-float">
                   <div class="flex items-center gap-4 mb-4">
                      <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                      <p class="text-xs font-bold text-gray-900">Errandr on the way</p>
                   </div>
                   <p class="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">Assigned to: Ade (Student Errandr)</p>
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
                <div class="relative z-10 bg-gray-900 rounded-3xl lg:rounded-[4rem] p-8 lg:p-12 overflow-hidden shadow-xl border-b-[8px] lg:border-b-[16px] border-gray-800">
                   <div class="absolute top-0 right-0 p-8">
                      <Bike class="w-32 h-32 text-parentPrimary opacity-10 -rotate-12" />
                   </div>
                   <div class="space-y-6 relative z-10">
                      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase">
                         Campus Network
                      </div>
                      <h3 class="text-4xl font-bold text-white tracking-tight leading-none">
                         Help Others. <br /><span class="text-parentPrimary">Earn Extra.</span>
                      </h3>
                      <p class="text-gray-400 text-sm font-bold tracking-tight leading-relaxed max-w-sm">
                         Join Errandr. Deliver food, pick up packages, and bring happiness to your fellow students' doorsteps.
                      </p>
                      <div class="pt-4">
                         <a href="http://errandr.localhost:3000/auth/register" class="inline-flex items-center gap-4 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:bg-parentPrimary hover:text-white transition-all shadow-xl">Join to Bring Happiness &rarr;</a>
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
                      <span class="text-xs font-bold text-gray-900 uppercase">{{ benefit }}</span>
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
                   <a href="http://vendor.localhost:3000/auth/register" class="px-10 py-5 bg-white text-parentPrimary rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl">Start Selling Now</a>
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
                <img src="@/assets/img/hero2.jpg" class="relative z-10 rounded-3xl lg:rounded-[3rem] shadow-xl border-4 md:border-8 border-white object-cover h-[400px] w-full" />
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
          <div v-for="cat in categories" :key="cat.name" class="group cursor-pointer">
            <div class="relative h-40 md:h-48 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
              <img :src="cat.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Category Image" />
              <div class="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/50 transition-colors"></div>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                 <component :is="cat.icon" class="w-8 h-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
                 <h4 class="font-bold text-lg"> {{ cat.name }}</h4>
                 <p class="text-xs text-gray-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Browse &rarr;</p>
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
            <div class="flex items-center gap-2 mb-6">
              <div class="w-8 h-8 bg-parentPrimary rounded-lg flex items-center justify-center text-white font-bold shadow-sm">E</div>
              <span class="text-xl font-black text-parentPrimary tracking-tighter">Errandr</span>
            </div>
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
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><NuxtLink to="/about" class="hover:text-parentPrimary transition-colors">About Us</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-parentPrimary transition-colors">Contact Support</NuxtLink></li>
              <li><NuxtLink to="/faq" class="hover:text-parentPrimary transition-colors">FAQ & Help</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Privacy Policy</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Join Us</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="http://vendor.localhost:3000" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Store class="w-4 h-4" /> List Your Business (Free)</a></li>
              <li><a href="http://errandr.localhost:3000" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Bike class="w-4 h-4" /> Become an Errandr</a></li>
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
import { ref, onMounted, onUnmounted } from 'vue'
import hero1 from '@/assets/img/hero1.jpg'
import hero2 from '@/assets/img/hero2.jpg'
import hero12 from "@/assets/img/hero12.jpg"
import hero14 from "@/assets/img/hero14.jpg"
import { 
  ArrowRight, Twitter, Instagram, Facebook,
  LogIn, ShoppingBag, Utensils, PlayCircle,
  Clock, MapPin, Star, Store, Bike, ChevronLeft, ChevronRight,
  ShieldCheck, CreditCard, Rocket,
  Pizza, Flame, Beef, Coffee, Menu, X, Navigation, Repeat
} from 'lucide-vue-next'
import { vendors_api } from '@/api_factory/modules/vendors';

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
const loadingVendors = ref(true)
const vendors = ref<any[]>([])
const selectedVendorForModal = ref<any>(null)
const isClosedModalOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const fetchVendors = async () => {
  loadingVendors.value = true
  try {
    const res = await vendors_api.getOnline()
    vendors.value = res.data?.vendors || res.data?.data?.vendors || res.data || []
  } finally {
    loadingVendors.value = false
  }
}

const currentSlide = ref(0)
const slides = [
  {
    title: "craving something?",
    highlight: "we'll bring it.",
    description: "oppose hunger sharp sharp! no stress yourself, make we carry food come your door.",
    image: hero1
  },
  {
    title: "hungry but lazy?",
    highlight: "we dey for you.",
    description: "school stress too much? order food from mavise, iyachidera or any vendor you like.",
    image: hero14
  },
  {
    title: "wetin you dey wait for?",
    highlight: "make we run am.",
    description: "from cafe to your hostel, we dey your back. just order, make we do the rest.",
    image: hero12
  },
  {
    title: "no more long queues.",
    highlight: "order sharp sharp.",
    description: "save your energy for classes. Errandr go help you pick up anything you need.",
    image: hero2
  }
]

let slideInterval: any
const startCarousel = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 5000)
}

const navigateToVendor = (vendor: any) => {
  if (!vendor.isOpen) {
    selectedVendorForModal.value = vendor
    isClosedModalOpen.value = true
    return
  }
  navigateTo(`/vendors/${vendor._id}`)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchVendors()
  startCarousel()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (slideInterval) clearInterval(slideInterval)
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
  const colors = ['bg-indigo-600', 'bg-rose-500', 'bg-emerald-500', 'bg-orange-500', 'bg-parentPrimary', 'bg-red-600', 'bg-blue-600', 'bg-amber-600', 'bg-purple-600'];
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
  { name: 'Fast Food', icon: Pizza, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=400&fit=crop' },
  { name: 'Healthy & Fresh', icon: Flame, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop' },
  { name: 'Local Soups', icon: Beef, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop' },
  { name: 'Coffee & Drinks', icon: Coffee, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=400&fit=crop' },
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

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
