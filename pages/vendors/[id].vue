<template>
  <div class="min-h-screen bg-white" v-if="vendor">
    <!-- Collapsed Sticky Header (appears on scroll) -->
    <header 
      class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-all duration-500"
      :class="scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'"
    >
      <div class="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all">
            <ArrowLeft class="w-4 h-4 text-gray-900" />
          </button>
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 bg-white shrink-0">
              <img :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
            </div>
            <h2 class="text-sm font-black text-gray-900 tracking-tight truncate max-w-[160px] md:max-w-none">{{ toTitleCase(vendor.storeName) }}</h2>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="toggleFavoriteVendor"
            class="w-9 h-9 rounded-xl flex items-center justify-center transition-all border"
            :class="isFavorited ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-gray-50 border-gray-100 text-gray-400'"
          >
            <Heart class="w-4 h-4" :class="{ 'fill-rose-500': isFavorited }" />
          </button>
          <button 
            v-if="cart.getVendorStats(vendor._id).itemCount > 0"
            @click="showMobileCartDrawer = true" 
            class="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black transition-all shadow-md"
          >
            <ShoppingBag class="w-3.5 h-3.5" />
            <span class="bg-parentPrimary px-1.5 py-0.5 rounded-md text-[10px]">{{ cart.getVendorStats(vendor._id).itemCount }}</span>
          </button>
          <NuxtLink to="/cart" class="hidden lg:flex w-9 h-9 rounded-xl bg-gray-50 items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all relative">
            <ShoppingCart class="w-4 h-4 text-gray-900" />
            <div v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-parentPrimary text-white border-2 border-white rounded-full flex items-center justify-center">
              <span class="text-[8px] font-bold">{{ cart.getVendorStats(vendor._id).itemCount }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="animate-fade-in pb-32 lg:pb-8">
      <!-- ============================================ -->
      <!-- IMMERSIVE BANNER HERO                        -->
      <!-- ============================================ -->
      <section class="relative w-full h-[280px] md:h-[340px] overflow-hidden">
        <!-- Banner Image -->
        <img 
          :src="vendor.banner || vendor.image || vendor.logo || '/placeholder-store.jpg'" 
          class="absolute inset-0 w-full h-full object-cover"
          alt="Store Banner"
        />
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-gray-900/20"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-transparent"></div>
        
        <!-- Top Navigation -->
        <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
          <button @click="router.back()" class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95">
            <ArrowLeft class="w-4 h-4" />
          </button>
          <div class="flex items-center gap-2">
            <button 
              @click="isShareModalOpen = true"
              class="w-10 h-10 rounded-2xl backdrop-blur-xl flex items-center justify-center border transition-all active:scale-95 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 class="w-4 h-4" />
            </button>
            <button 
              @click="toggleFavoriteVendor"
              class="w-10 h-10 rounded-2xl backdrop-blur-xl flex items-center justify-center border transition-all active:scale-95"
              :class="isFavorited ? 'bg-rose-500/20 border-rose-400/30 text-rose-400' : 'bg-white/10 border-white/20 text-white'"
            >
              <Heart class="w-4 h-4" :class="{ 'fill-rose-400': isFavorited }" />
            </button>
            <button @click="showStoreInfo = true" class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95">
              <Info class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Hero Content -->
        <div class="absolute bottom-0 left-0 right-0 z-10 px-4 md:px-8 pb-6 md:pb-8">
          <div class="max-w-[1400px] mx-auto flex items-end gap-4">
            <!-- Vendor Logo -->
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-white/30 shadow-2xl overflow-hidden bg-white shrink-0">
              <img :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
            </div>
            <!-- Vendor Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span 
                  class="px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5"
                  :class="vendor.isOpen !== false ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/20' : 'bg-red-400/20 text-red-300 border border-red-400/20'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="vendor.isOpen !== false ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'"></span>
                  {{ vendor.isOpen !== false ? 'Open Now' : 'Closed' }}
                </span>
                <span v-if="vendor.isInsideCampus" class="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white/70 text-[10px] font-black shrink-0">
                  On Campus
                </span>
                <span v-if="vendor.preOrderOnly" class="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-black shrink-0">
                  📅 PRE-ORDER ONLY
                </span>
              </div>
              <h1 class="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight truncate">{{ toTitleCase(vendor.storeName) }}</h1>
              <!-- Stats Row -->
              <div class="flex items-center gap-3 mt-2 text-white/70 text-xs font-bold flex-wrap">
                <span class="flex items-center gap-1">
                  <Star class="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span class="text-white font-black">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
                  <span>({{ vendor.totalRatings || 0 }})</span>
                </span>
                <span class="w-1 h-1 rounded-full bg-white/30"></span>
                <span class="flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  {{ vendor.preparationTime || 20 }} min
                </span>
                <span class="w-1 h-1 rounded-full bg-white/30"></span>
                <span class="flex items-center gap-1">
                  <Bike class="w-3 h-3" />
                  From ₦{{ vendor.baseDeliveryFee || 600 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- ACTION CHIPS BAR                             -->
      <!-- ============================================ -->
      <div class="max-w-[1400px] mx-auto px-4 md:px-6 -mt-4 relative z-20">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            @click="handleStartGroupOrder"
            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap shrink-0 shadow-lg active:scale-95"
            :class="activeCode ? 'bg-emerald-500 text-white' : 'bg-white text-gray-900 border border-gray-100 shadow-md'"
          >
            <Users class="w-3.5 h-3.5" />
            {{ activeCode ? `Group: ${activeCode}` : 'Group Order' }}
          </button>
          
          <button 
            @click="showMobileCartDrawer = true" 
            class="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-2xl text-xs font-black transition-all whitespace-nowrap shadow-md border border-gray-100 shrink-0 active:scale-95"
          >
            <ShoppingBag class="w-3.5 h-3.5" />
            <span v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="bg-parentPrimary text-white px-1.5 py-0.5 rounded-md text-[10px]">{{ cart.getVendorStats(vendor._id).itemCount }}</span>
            <span v-else>My Cart</span>
          </button>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- PROMO BANNERS (Horizontal Scroll)            -->
      <!-- ============================================ -->
      <div v-if="activeBanners.length" class="max-w-[1400px] mx-auto px-4 md:px-6 mt-6">
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          <div 
            v-for="(banner, idx) in activeBanners" 
            :key="idx"
            class="flex-shrink-0 w-[85%] md:w-[400px] h-[140px] rounded-2xl overflow-hidden relative snap-start group cursor-pointer active:scale-[0.98] transition-transform"
            @click="handleBannerClick(banner)"
          >
            <img :src="banner.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-4">
              <span class="absolute top-3 right-3 px-2 py-0.5 bg-parentPrimary text-white rounded-md text-[9px] font-black shadow-sm">Offer</span>
              <h3 class="text-sm font-black text-white tracking-tight leading-tight">{{ toTitleCase(banner.title) }}</h3>
              <p class="text-xs font-bold text-white/70 mt-0.5 truncate">{{ banner.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pre-Order Batch Banner -->
      <div v-if="activeBatch" class="max-w-[1400px] mx-auto px-4 md:px-6 mt-6">
        <div class="bg-gray-900 rounded-2xl p-5 md:p-6 relative overflow-hidden group shadow-xl">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/20 rounded-full blur-[80px]"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-parentPrimary text-white flex items-center justify-center shadow-lg">
                  <Calendar class="w-4 h-4" />
                </div>
                <h3 class="text-xs font-black text-white tracking-wider">{{ activeBatch.windowName }}</h3>
              </div>
              <div class="flex flex-wrap gap-4 text-xs">
                <div>
                  <p class="text-white/40 font-black mb-0.5">Accepting until</p>
                  <p class="font-black text-parentPrimary">{{ new Date(activeBatch.deadline).toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-white/40 font-black mb-0.5">Delivery on</p>
                  <p class="font-black text-emerald-400">{{ new Date(activeBatch.deliveryDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) }}</p>
                </div>
              </div>
            </div>
            <span class="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black border border-emerald-500/20 self-start md:self-center">Live &amp; Open</span>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- STICKY CATEGORY PILLS                        -->
      <!-- ============================================ -->
      <div 
        class="sticky z-30 bg-white/95 backdrop-blur-xl border-b border-gray-50 transition-all duration-300"
        :class="scrolled ? 'top-[57px]' : 'top-0'"
      >
        <div class="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
          <div class="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="scrollToCategory(cat)"
              class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 active:scale-95"
              :class="activeCategory === cat 
                ? 'bg-parentPrimary text-white shadow-md shadow-parentPrimary/20 scale-[1.02]' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
            >
              {{ toTitleCase(cat) }}
              <span 
                class="ml-1 text-[10px] px-1.5 py-0.5 rounded-md"
                :class="activeCategory === cat ? 'bg-white/20' : 'bg-gray-100 text-gray-400'"
              >{{ groupedProducts[cat]?.length || 0 }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- MAIN CONTENT AREA                            -->
      <!-- ============================================ -->
      <div class="max-w-[1400px] mx-auto px-4 md:px-6 mt-6">
        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Products Column -->
          <div class="flex-1 space-y-10">
            <section 
              v-for="cat in categories" 
              :key="cat" 
              :id="cat.toLowerCase().replace(/\s+/g, '-')"
              class="scroll-mt-32"
            >
              <!-- Category Header -->
              <div class="flex items-center gap-3 mb-5">
                <h2 class="text-lg font-black text-gray-900 tracking-tight">{{ toTitleCase(cat) }}</h2>
                <div class="h-px bg-gray-100 flex-1"></div>
                <span class="text-xs font-bold text-gray-400">{{ groupedProducts[cat]?.length || 0 }} items</span>
              </div>

              <!-- MOBILE: Horizontal List Cards -->
              <div class="md:hidden space-y-3">
                <div 
                  v-for="product in groupedProducts[cat]" 
                  :key="product._id"
                  @click="selectedProduct = product"
                  class="group flex items-center gap-3 p-2.5 bg-white rounded-2xl border border-gray-100 hover:border-parentPrimary/20 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <!-- Square Image -->
                  <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 relative">
                    <img :src="product.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
                    <div v-if="getProductCount(product._id) > 0" class="absolute top-1 right-1 bg-parentPrimary text-white w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black shadow-sm">
                      {{ getProductCount(product._id) }}
                    </div>
                  </div>
                  <!-- Info -->
                  <div class="flex-1 min-w-0 py-0.5">
                    <h3 class="text-sm font-black text-gray-900 tracking-tight leading-tight truncate">{{ product.name }}</h3>
                    <p class="text-[11px] text-gray-400 font-medium line-clamp-1 mt-0.5 leading-relaxed">{{ product.description || 'Freshly prepared with care.' }}</p>
                    <div class="flex items-center justify-between mt-2">
                      <div>
                        <span v-if="product.discountPrice" class="text-[10px] text-gray-300 line-through mr-1">₦{{ product.price.toLocaleString() }}</span>
                        <span class="text-sm font-black text-gray-900">₦{{ (product.discountPrice || product.price).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- Add Button -->
                  <button 
                    @click.stop="addToCart(product)"
                    class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-parentPrimary active:scale-90 transition-all shadow-md shrink-0"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- DESKTOP: Grid Cards -->
              <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="product in groupedProducts[cat]" 
                  :key="product._id"
                  @click="selectedProduct = product"
                  class="group relative bg-white rounded-2xl border border-gray-100 hover:border-parentPrimary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                >
                  <!-- Image -->
                  <div class="w-full aspect-[4/3] overflow-hidden bg-gray-50 relative">
                    <img :src="product.image || '/placeholder-food.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <!-- Item Count -->
                    <div v-if="getProductCount(product._id) > 0" class="absolute top-3 right-3 flex items-center gap-1.5 bg-parentPrimary text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-lg z-10">
                      <ShoppingBag class="w-3 h-3" />
                      {{ getProductCount(product._id) }}
                    </div>
                  </div>
                  
                  <!-- Content -->
                  <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 class="text-sm font-black text-gray-900 tracking-tight leading-tight mb-1 group-hover:text-parentPrimary transition-colors">{{ product.name }}</h3>
                      <p class="text-[11px] font-medium text-gray-400 line-clamp-2 leading-relaxed">{{ product.description || 'Freshly prepared with premium ingredients.' }}</p>
                    </div>
                    
                    <div class="flex items-end justify-between mt-4 pt-3 border-t border-gray-50">
                      <div>
                        <span v-if="product.discountPrice" class="text-xs text-gray-300 line-through block mb-0.5">₦{{ product.price.toLocaleString() }}</span>
                        <span class="text-base font-black text-gray-900">₦{{ (product.discountPrice || product.price).toLocaleString() }}</span>
                      </div>
                      <button 
                        @click.stop="addToCart(product)"
                        class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-parentPrimary hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-parentPrimary/30 shadow-black/5 shrink-0"
                      >
                        <Plus class="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- ============================================ -->
          <!-- DESKTOP CART SIDEBAR                         -->
          <!-- ============================================ -->
          <aside class="hidden lg:block lg:w-[360px] shrink-0">
            <div class="sticky top-24 space-y-6">
              
              <!-- Group Participants -->
              <div v-if="groupOrder" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="flex items-center justify-between px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                  <h3 class="text-xs font-black text-gray-400 tracking-widest">Participants ({{ groupOrder.participants.length }})</h3>
                  <button v-if="isHost" @click="copyInviteLink" class="text-[10px] font-black text-parentPrimary hover:underline">Copy Link</button>
                </div>
                <div class="p-3 space-y-2">
                  <div v-for="p in groupOrder.participants" :key="p.user._id || p.user" class="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-black text-xs text-gray-500 overflow-hidden shrink-0">
                      <img v-if="p.user.avatar" :src="p.user.avatar" class="w-full h-full object-cover" />
                      <span v-else>{{ p.user.firstName?.[0] }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-xs font-black text-gray-900 truncate">{{ p.user.firstName }} {{ p.user.lastName }}</p>
                        <span v-if="p.user._id === groupOrder.host._id || p.user === groupOrder.host" class="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-black">Host</span>
                      </div>
                      <p class="text-[10px] font-bold text-gray-400">{{ p.items?.length || 0 }} items · ₦{{ (p.total || 0).toLocaleString() }}</p>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div :class="p.isReady ? 'bg-emerald-500' : 'bg-gray-200'" class="w-1.5 h-1.5 rounded-full"></div>
                      <span class="text-[9px] font-black" :class="p.isReady ? 'text-emerald-600' : 'text-gray-400'">{{ p.isReady ? 'Ready' : 'Carting' }}</span>
                    </div>
                  </div>
                  <!-- Group Actions -->
                  <div class="pt-2 flex flex-col gap-2">
                    <button 
                      @click="toggleReady(!getMyStatus?.isReady)"
                      class="w-full py-2.5 rounded-xl text-xs font-black transition-all border"
                      :class="getMyStatus?.isReady ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-gray-400 border-gray-100 hover:text-gray-900'"
                    >
                      {{ getMyStatus?.isReady ? 'You are Ready' : 'Mark as Ready' }}
                    </button>
                    <button 
                      v-if="isHost && groupOrder.status === 'open'"
                      @click="handleCheckoutGroupOrder"
                      :disabled="!canCheckout"
                      class="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-parentPrimary transition-all shadow-lg disabled:opacity-50"
                    >
                      Checkout Everything
                    </button>
                    <button @click="leaveGroupOrder" class="w-full py-2 text-[10px] font-black text-rose-400 hover:text-rose-600 transition-all">
                      Leave Group
                    </button>
                  </div>
                </div>
              </div>

              <!-- Cart Summary Card -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="flex items-center justify-between px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                  <h3 class="text-xs font-black text-gray-900 tracking-tight">Your Packs</h3>
                  <ShoppingCart class="w-4 h-4 text-parentPrimary" />
                </div>

                <div v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="p-4 space-y-4">
                  <div v-for="(pack, pIndex) in cart.getVendorStats(vendor._id).packs" :key="pack.id" class="space-y-3">
                    <!-- Pack Header -->
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-black bg-gray-900 text-white px-3 py-1 rounded-lg">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                      <div class="flex items-center gap-1">
                        <button @click="duplicatePack(vendor._id, pack)" class="p-1.5 text-gray-400 hover:text-parentPrimary transition-all" title="Duplicate pack">
                          <Copy class="w-3.5 h-3.5" />
                        </button>
                        <button @click="cart.removePack(vendor._id, pack.id)" class="p-1.5 text-gray-400 hover:text-rose-500 transition-all" title="Remove pack">
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <!-- Pack Items -->
                    <div class="space-y-2">
                      <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-black text-gray-900 truncate">{{ toTitleCase(item.name) }}</p>
                          <p class="text-xs font-black text-parentPrimary">₦{{ item.price?.toLocaleString() }}</p>
                        </div>
                        <div class="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0">
                          <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity - 1)" class="w-6 h-6 rounded-md bg-white text-gray-500 flex items-center justify-center hover:text-rose-500 transition-all text-xs font-bold shadow-sm">−</button>
                          <span class="text-xs font-black min-w-[16px] text-center">{{ item.quantity }}</span>
                          <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity + 1)" class="w-6 h-6 rounded-md bg-white text-gray-500 flex items-center justify-center hover:text-parentPrimary transition-all text-xs font-bold shadow-sm">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Add Pack -->
                  <button @click="addNewPack(vendor._id)" class="w-full py-3 border border-dashed border-gray-200 rounded-xl text-xs font-black text-gray-400 hover:border-parentPrimary hover:text-parentPrimary transition-all flex items-center justify-center gap-2">
                    <Plus class="w-3.5 h-3.5" /> New Pack
                  </button>

                  <!-- Checkout -->
                  <div class="pt-4 border-t border-gray-100 space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-xs font-black text-gray-400 tracking-wider">Subtotal</span>
                      <span class="text-xl font-black text-gray-900 tracking-tighter">₦{{ cart.getVendorStats(vendor._id).subtotal.toLocaleString() }}</span>
                    </div>
                    <NuxtLink 
                      :to="activeCode ? `/cart?group=${activeCode}` : '/cart'" 
                      class="block w-full py-4 bg-parentPrimary text-white rounded-2xl text-center text-xs font-black tracking-wider hover:bg-parentPrimary/90 transition-all shadow-xl shadow-parentPrimary/20 active:scale-[0.98]"
                    >
                      {{ activeCode ? 'Finalize Order' : 'Proceed to Checkout' }}
                    </NuxtLink>
                  </div>
                </div>
                
                <!-- Empty Cart -->
                <div v-else class="p-8 text-center">
                  <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🛒</div>
                  <p class="text-sm font-black text-gray-900 mb-1">Your cart is empty</p>
                  <p class="text-xs font-medium text-gray-400">Tap + on any item to start your order</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- MOBILE CART DRAWER (Bottom Sheet)            -->
    <!-- ============================================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showMobileCartDrawer" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden" @click="showMobileCartDrawer = false"></div>
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="showMobileCartDrawer" class="fixed inset-x-0 bottom-0 z-[101] bg-white rounded-t-[2rem] max-h-[85vh] overflow-y-auto lg:hidden shadow-2xl">
          <!-- Handle -->
          <div class="sticky top-0 bg-white pt-3 pb-2 px-5 border-b border-gray-50 z-10 rounded-t-[2rem]">
            <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-black text-gray-900 tracking-tight">Your Order</h2>
              <button @click="showMobileCartDrawer = false" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                <X class="w-4 h-4"/>
              </button>
            </div>
          </div>
          
          <div class="p-5 space-y-6 pb-10">
            <!-- Group Participants (if in group) -->
            <div v-if="groupOrder" class="space-y-3">
              <h3 class="text-xs font-black text-gray-400 tracking-widest">Participants ({{ groupOrder.participants.length }})</h3>
              <div v-for="p in groupOrder.participants" :key="p.user._id || p.user" class="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-black text-xs text-gray-500 overflow-hidden shrink-0">
                  <img v-if="p.user.avatar" :src="p.user.avatar" class="w-full h-full object-cover" />
                  <span v-else>{{ p.user.firstName?.[0] }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-gray-900 truncate">{{ p.user.firstName }} {{ p.user.lastName }}</p>
                  <p class="text-[10px] font-bold text-gray-400">{{ p.items?.length || 0 }} items · ₦{{ (p.total || 0).toLocaleString() }}</p>
                </div>
                <div :class="p.isReady ? 'bg-emerald-500' : 'bg-gray-200'" class="w-2 h-2 rounded-full"></div>
              </div>
              <div class="flex flex-col gap-2 pt-1">
                <button 
                  @click="toggleReady(!getMyStatus?.isReady)"
                  class="w-full py-2.5 rounded-xl text-xs font-black transition-all border"
                  :class="getMyStatus?.isReady ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-gray-400 border-gray-100'"
                >
                  {{ getMyStatus?.isReady ? 'You are Ready' : 'Mark as Ready' }}
                </button>
                <button v-if="isHost && groupOrder.status === 'open'" @click="handleCheckoutGroupOrder" :disabled="!canCheckout" class="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-parentPrimary transition-all shadow-lg disabled:opacity-50">
                  Checkout Everything
                </button>
                <button @click="leaveGroupOrder" class="w-full py-2 text-[10px] font-black text-rose-400">Leave Group</button>
              </div>
            </div>

            <!-- Pack Items -->
            <div v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="space-y-5">
              <div v-for="(pack, pIndex) in cart.getVendorStats(vendor._id).packs" :key="pack.id" class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black bg-gray-900 text-white px-3 py-1 rounded-lg">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                  <div class="flex items-center gap-1">
                    <button @click="duplicatePack(vendor._id, pack)" class="p-1.5 text-gray-400 hover:text-parentPrimary"><Copy class="w-3.5 h-3.5" /></button>
                    <button @click="cart.removePack(vendor._id, pack.id)" class="p-1.5 text-gray-400 hover:text-rose-500"><Trash2 class="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div class="space-y-2">
                  <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-black text-gray-900 truncate">{{ toTitleCase(item.name) }}</p>
                      <p class="text-xs font-black text-parentPrimary">₦{{ item.price?.toLocaleString() }}</p>
                    </div>
                    <div class="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0">
                      <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity - 1)" class="w-7 h-7 rounded-md bg-white text-gray-500 flex items-center justify-center text-sm font-bold shadow-sm">−</button>
                      <span class="text-xs font-black min-w-[18px] text-center">{{ item.quantity }}</span>
                      <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity + 1)" class="w-7 h-7 rounded-md bg-white text-gray-500 flex items-center justify-center text-sm font-bold shadow-sm">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button @click="addNewPack(vendor._id)" class="py-3 border border-dashed border-gray-200 rounded-xl text-xs font-black text-gray-400 hover:border-parentPrimary hover:text-parentPrimary transition-all flex items-center justify-center gap-2">
                  <Plus class="w-3.5 h-3.5" /> New Pack
                </button>
                <button @click="showMobileCartDrawer = false" class="py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-black text-center">
                  Keep Shopping
                </button>
              </div>

              <div class="pt-4 border-t border-gray-100 space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-black text-gray-400 tracking-wider">Subtotal</span>
                  <span class="text-xl font-black text-gray-900 tracking-tighter">₦{{ cart.getVendorStats(vendor._id).subtotal.toLocaleString() }}</span>
                </div>
                <NuxtLink 
                  :to="activeCode ? `/cart?group=${activeCode}` : '/cart'" 
                  class="block w-full py-4 bg-parentPrimary text-white rounded-2xl text-center text-xs font-black tracking-wider shadow-xl shadow-parentPrimary/20 active:scale-[0.98] transition-transform"
                >
                  {{ activeCode ? 'Finalize Order' : 'Proceed to Checkout' }}
                </NuxtLink>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🛒</div>
              <p class="text-sm font-black text-gray-900 mb-1">Your cart is empty</p>
              <p class="text-xs font-medium text-gray-400">Tap + on any item to start</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================ -->
    <!-- FLOATING CART BAR (Mobile)                   -->
    <!-- ============================================ -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div 
        v-if="cart.getVendorStats(vendor._id).itemCount > 0 && !showMobileCartDrawer"
        class="fixed bottom-6 left-4 right-4 z-[50] lg:hidden"
      >
        <button 
          @click="showMobileCartDrawer = true"
          class="w-full flex items-center justify-between bg-parentPrimary text-white rounded-2xl px-5 py-4 shadow-2xl shadow-parentPrimary/30 active:scale-[0.97] transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-sm font-black">
              {{ cart.getVendorStats(vendor._id).itemCount }}
            </div>
            <div class="text-left">
              <p class="text-sm font-black tracking-tight">View Cart</p>
              <p class="text-[10px] font-bold text-white/70">{{ cart.getVendorStats(vendor._id).packs.length }} pack{{ cart.getVendorStats(vendor._id).packs.length > 1 ? 's' : '' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-black tracking-tighter">₦{{ cart.getVendorStats(vendor._id).subtotal.toLocaleString() }}</p>
          </div>
        </button>
      </div>
    </Transition>

    <!-- ============================================ -->
    <!-- STORE INFO MODAL                             -->
    <!-- ============================================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showStoreInfo" class="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" @click.self="showStoreInfo = false">
          <div class="bg-white w-full md:max-w-lg rounded-t-[2rem] md:rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up-mobile md:animate-zoom-in">
            <!-- Banner -->
            <div class="relative h-44">
              <img :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <button @click="showStoreInfo = false" class="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                <X class="w-5 h-5" />
              </button>
              <div class="absolute bottom-4 left-6 right-6">
                <h2 class="text-xl font-black text-white tracking-tight">{{ toTitleCase(vendor.storeName) }}</h2>
                <p class="text-xs font-bold text-white/70 mt-1">{{ vendor.category || 'Restaurant' }}</p>
              </div>
            </div>
            <!-- Info -->
            <div class="p-6 md:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
              <div>
                <h3 class="text-[10px] font-black text-gray-400 tracking-widest mb-2">About</h3>
                <p class="text-sm text-gray-600 leading-relaxed font-medium">{{ vendor.description || 'No description available.' }}</p>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <div class="flex items-center gap-2 text-[10px] font-black text-gray-400 tracking-widest mb-2">
                    <Clock class="w-3 h-3" /> Hours
                  </div>
                  <div class="space-y-0.5">
                    <p v-for="(hours, day) in vendor.availability" :key="day" class="text-xs font-bold text-gray-900">
                      <span class="text-gray-400 w-14 inline-block">{{ day }}:</span> {{ hours }}
                    </p>
                    <p v-if="!vendor.availability" class="text-xs font-bold text-gray-900">Open 24/7</p>
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2 text-[10px] font-black text-gray-400 tracking-widest mb-2">
                    <MapPin class="w-3 h-3" /> Location
                  </div>
                  <p class="text-xs font-bold text-gray-900 leading-relaxed">{{ vendor.address || 'University Main Campus' }}</p>
                </div>
              </div>
              <button @click="showStoreInfo = false" class="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black text-xs hover:bg-parentPrimary transition-all shadow-lg active:scale-[0.98]">
                Got it
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================ -->
    <!-- GROUP NAMING MODAL                           -->
    <!-- ============================================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showGroupNamingModal" class="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" @click.self="showGroupNamingModal = false">
          <div class="bg-white w-full max-w-xs rounded-[2rem] shadow-2xl p-8 flex flex-col items-center text-center animate-zoom-in">
            <div class="w-14 h-14 bg-parentPrimary/10 rounded-2xl flex items-center justify-center mb-6 text-parentPrimary">
              <Users class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-black text-gray-900 tracking-tight mb-1">Name your group</h3>
            <p class="text-xs font-bold text-gray-400 mb-6">e.g., "Sunday Brunch with the boys"</p>
            
            <div class="w-full space-y-4">
              <input 
                v-model="groupName" 
                placeholder="Type group name here..."
                @keyup.enter="confirmStartGroupOrder"
                class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/30 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
              />
              <div class="flex gap-2 pt-2">
                <button @click="showGroupNamingModal = false" class="flex-1 py-3.5 bg-gray-50 text-gray-400 rounded-xl font-black text-xs hover:text-gray-900 transition-all">
                  Cancel
                </button>
                <button 
                  @click="confirmStartGroupOrder" 
                  :disabled="!groupName.trim() || groupLoading"
                  class="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-black text-xs hover:bg-parentPrimary transition-all shadow-lg disabled:opacity-50"
                >
                  <span v-if="groupLoading">Creating...</span>
                  <span v-else>Let's Go!</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================ -->
    <!-- SHARE MODAL                                  -->
    <!-- ============================================ -->
    <UiShareModal v-model:isOpen="isShareModalOpen" :vendor="vendor" />

    <!-- ============================================ -->
    <!-- PRODUCT DETAIL MODAL                         -->
    <!-- ============================================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="selectedProduct" class="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" @click.self="selectedProduct = null">
          <div class="bg-white rounded-t-[2rem] md:rounded-[2rem] w-full md:max-w-sm overflow-hidden shadow-2xl animate-slide-up-mobile md:animate-zoom-in">
            <!-- Product Image -->
            <div class="h-56 md:h-64 relative">
              <img :src="selectedProduct.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <button @click="selectedProduct = null" class="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-black/50 transition-all border border-white/10 shadow-lg">
                <X class="w-5 h-5" />
              </button>
              <div class="absolute bottom-4 left-5 right-5">
                <span class="px-2 py-0.5 bg-parentPrimary text-white rounded-md text-[9px] font-black mb-2 inline-block shadow-sm">{{ selectedProduct.category }}</span>
                <h2 class="text-xl font-black text-white tracking-tight leading-tight">{{ selectedProduct.name }}</h2>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-5 pb-8">
              <p class="text-gray-500 font-medium text-sm leading-relaxed">
                {{ selectedProduct.description || 'Freshly prepared with premium ingredients. Perfect for any time of day.' }}
              </p>

              <!-- Quantity & Add -->
              <div class="flex items-center justify-between pt-2">
                <div>
                  <p class="text-[10px] font-black text-gray-400 tracking-wider mb-1">Price</p>
                  <div class="flex items-center gap-2">
                    <span v-if="selectedProduct.discountPrice" class="text-sm text-gray-300 line-through">₦{{ selectedProduct.price.toLocaleString() }}</span>
                    <span class="text-2xl font-black text-gray-900 tracking-tighter">₦{{ (selectedProduct.discountPrice || selectedProduct.price).toLocaleString() }}</span>
                  </div>
                </div>
                <button 
                  @click="addToCart(selectedProduct); selectedProduct = null"
                  class="bg-parentPrimary text-white px-7 py-4 rounded-2xl text-xs font-black hover:bg-parentPrimary/90 transition-all shadow-xl shadow-parentPrimary/20 active:scale-95 flex items-center gap-2"
                >
                  <Plus class="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-2 border-gray-100 border-t-parentPrimary rounded-full animate-spin"></div>
      <p class="text-xs font-bold text-gray-400">Loading store...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Share2, Heart, ShoppingCart, ShoppingBag, ArrowLeft, ArrowRight, Clock, Star, MapPin, Search, Info, ChevronRight, Users, Calendar, Copy, Trash2, X, Bike, Plus, Minus
} from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useHead, navigateTo } from '#imports';
import { useCart } from '@/composables/modules/cart';
import { useUser } from '@/composables/modules/auth/user';
import { useGroupOrder } from '@/composables/modules/group-order';
import { useFavorites } from '@/composables/modules/favorites';
import { vendors_api } from '@/api_factory/modules/vendors';
import { products_api } from '@/api_factory/modules/products';

const isShareModalOpen = ref(false);
import { useToast } from '@/composables/useToast';

definePageMeta({
  layout: false
})

const route = useRoute();
const router = useRouter();
const cart = useCart();
const { user } = useUser();
const { 
  groupOrder, activeCode, isLoading: groupLoading, createGroupOrder, 
  joinGroupOrder, fetchGroupOrder, syncWithCart, leaveGroupOrder,
  toggleReady, checkout, isHost, cleanupEventListeners
} = useGroupOrder();
const { showToast } = useToast();

const scrolled = ref(false);
const showMobileCartDrawer = ref(false);
const vendor = ref<any>(null);
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const activeCategory = ref('');
const isFavorited = ref(false);
const activeBatch = computed(() => {
  if (!vendor.value?.batchSchedule) return null;
  return vendor.value.batchSchedule.find((b: any) => b.isActive && new Date(b.deadline) > new Date());
});
const showStoreInfo = ref(false);
const showGroupNamingModal = ref(false);
const groupName = ref('');
const selectedProduct = ref<any>(null);

const getMyStatus = computed(() => {
  if (!groupOrder.value || !user.value) return null;
  return groupOrder.value.participants.find((p: any) => p.user._id === user.value?._id || p.user === user.value?._id);
});

const canCheckout = computed(() => {
  if (!groupOrder.value) return false;
  return groupOrder.value.participants.some((p: any) => p.items.length > 0);
});

const getVendorColor = (name: string) => {
  if (!name) return 'bg-gray-400';
  const colors = ['bg-indigo-600', 'bg-rose-500', 'bg-emerald-500', 'bg-orange-500', 'bg-parentPrimary', 'bg-red-600', 'bg-blue-600', 'bg-amber-600', 'bg-purple-600'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const activeBanners = computed(() => {
  if (!vendor.value?.banners) return [];
  return vendor.value.banners.filter((b: any) => {
    if (b.isActive === false) return false;
    const now = new Date();
    if (b.startAt && new Date(b.startAt) > now) return false;
    if (b.endAt && new Date(b.endAt) < now) return false;
    return true;
  });
});

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const getProductCount = (productId: string) => {
  if (!vendor.value) return 0;
  const vendorCart = cart.carts.value[vendor.value._id];
  if (!vendorCart) return 0;
  const activePack = vendorCart.packs.find(p => p.id === vendorCart.activePackId);
  if (!activePack) return 0;
  const item = activePack.items.find(i => i.productId === productId);
  return item?.quantity || 0;
};

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

const groupedProducts = computed(() => {
  const groups: Record<string, any[]> = {};
  products.value.forEach(p => {
    const cat = p.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(p);
  });
  return groups;
});

const removeFromCart = (product: any) => {
  if (!vendor.value) return;
  const vendorId = vendor.value._id;
  const vendorCart = cart.carts.value[vendorId];
  if (!vendorCart) return;
  const packId = vendorCart.activePackId;
  const pack = vendorCart.packs.find(p => p.id === packId);
  if (!pack) return;
  const itemIndex = pack.items.findIndex(i => i.productId === product._id);
  if (itemIndex > -1) {
    const item = pack.items[itemIndex];
    if (item.quantity > 1) {
      cart.updateItemQuantity(vendorId, packId, itemIndex, item.quantity - 1);
    } else {
      cart.removeItemFromPack(vendorId, packId, itemIndex);
    }
  }
  if (activeCode.value) {
    setTimeout(() => syncWithCart(vendorId), 100);
  }
};

const addToCart = (product: any) => {
  cart.addItem({
    productId: product._id,
    vendorId: vendor.value._id,
    name: product.name,
    price: product.discountPrice || product.price,
    image: product.image,
    quantity: 1,
    customizations: [],
  });
  if (activeCode.value) {
    setTimeout(() => syncWithCart(vendor.value._id), 100);
  }
};

const { toggleFavorite, fetchFavorites: checkFavs, isFavorited: checkIsFav } = useFavorites();

const toggleFavoriteVendor = async () => {
  if (!user.value) {
    showToast('Please log in to save favorites', 'error');
    return;
  }
  const success = await toggleFavorite({ vendorId: vendor.value._id });
  if (success) {
    isFavorited.value = !isFavorited.value;
    showToast(isFavorited.value ? 'Saved to favorites ❤️' : 'Removed from favorites', 'success');
  } else {
    showToast('Could not update favorites', 'error');
  }
};

const checkIfFavorited = async () => {
  if (!user.value) return;
  await checkFavs();
  isFavorited.value = checkIsFav(vendor.value?._id);
};

const handleBannerClick = (banner: any) => {
  if (banner.products && banner.products.length > 0) {
    banner.products.forEach((p: any) => {
      addToCart(p);
    });
    navigateTo('/cart');
  } else if (banner.link) {
    navigateTo(banner.link, { external: true });
  } else {
    showToast(`${banner.title} — ${banner.description}`, 'success');
  }
};

const addNewPack = (vendorId: string) => {
  cart.addPack(vendorId);
  showToast('New pack added', 'success');
};

const duplicatePack = (vendorId: string, pack: any) => {
  cart.duplicatePack(vendorId, pack.id);
  showToast('Pack duplicated', 'success');
};

const scrollToCategory = (cat: string) => {
  activeCategory.value = cat;
  const element = document.getElementById(cat.toLowerCase().replace(/\s+/g, '-'));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleStartGroupOrder = () => {
  groupName.value = '';
  showGroupNamingModal.value = true;
};

const confirmStartGroupOrder = async () => {
  if (!groupName.value.trim() || groupLoading.value) return;
  try {
    await createGroupOrder(vendor.value._id, groupName.value);
    showToast('Group order started! Share the code with friends.', 'success');
    showGroupNamingModal.value = false;
    syncWithCart(vendor.value._id);
  } catch (e) {
    console.error('Failed to start group order', e);
    showToast('Failed to start group order', 'error');
  }
};

const copyInviteLink = () => {
  const link = `${window.location.origin}${window.location.pathname}?group=${activeCode.value}`;
  navigator.clipboard.writeText(link);
  showToast('Invite link copied to clipboard!', 'success');
};

const handleScroll = () => {
  scrolled.value = window.scrollY > 200;
  
  const sections = categories.value.map(cat => ({
    id: cat,
    el: document.getElementById(cat.toLowerCase().replace(/\s+/g, '-'))
  }));
  const scrollPosition = window.scrollY + 180;
  for (const section of sections) {
    if (section.el && section.el.offsetTop <= scrollPosition && (section.el.offsetTop + section.el.offsetHeight) > scrollPosition) {
      activeCategory.value = section.id;
      break;
    }
  }
};

onMounted(async () => {
  cart.initCart();
  try {
    const paramId = route.params.id as string;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(paramId);

    let vendorRes;
    if (isObjectId) {
      vendorRes = await vendors_api.getById(paramId);
    } else {
      vendorRes = await vendors_api.getBySubdomain(paramId);
    }

    if (vendorRes.data && !(vendorRes as any).type) {
      vendor.value = vendorRes.data;
      
      const productsRes = await products_api.getByVendor(vendor.value._id);
      products.value = productsRes.data || [];
    } else {
      throw new Error('Using mock data');
    }
    const uniqueCats = [...new Set(products.value.map((p: any) => p.category).filter(Boolean))];
    categories.value = uniqueCats;
    if (uniqueCats.length > 0) activeCategory.value = uniqueCats[0];
    window.addEventListener('scroll', handleScroll);
    checkIfFavorited();
    if (route.query.group) {
      handleJoinGroup(route.query.group as string);
    }

    // Clean up the URL visually if loaded via subdomain
    if (process.client && paramId) {
      const host = window.location.hostname;
      const parts = host.split('.');
      if (parts.length >= 3 && parts[0] === paramId) {
        window.history.replaceState(window.history.state, '', '/');
      }
    }
  } catch (e) {
    console.error('API Error in Detail page, using MOCK data', e);
    vendor.value = {
      _id: route.params.id,
      storeName: 'Mavise Restaurant (Demo)',
      rating: 4.8,
      totalRatings: 1250,
      about: 'Authentic flavors, delivered fast.',
      description: 'Mavise brings you the best of local and continental cuisine with a focus on freshness and speed.',
      availability: { Mon: '24/7', Tue: '24/7', Wed: '24/7', Thu: '24/7', Fri: '24/7', Sat: '24/7', Sun: '24/7' },
      logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80',
      banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      banners: [
        { title: 'Fresh Summer Deal', description: 'Get 20% off on all salads and drinks.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200', isActive: true },
        { title: 'Student Night', description: 'Late night snacks for study sessions.', image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200', isActive: true }
      ]
    };
    products.value = [
      { _id: 'p1', name: 'Jollof Rice Special', price: 2500, discountPrice: 2000, discountPercentage: 20, category: 'Main Dishes', image: 'https://images.unsplash.com/photo-1567051752256-66a8361e72a1?w=400' },
      { _id: 'p2', name: 'Chicken Suya', price: 1500, category: 'Snacks', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400' },
      { _id: 'p3', name: 'Zobo Drink', price: 500, category: 'Beverages', image: 'https://images.unsplash.com/photo-1544380903-5339f408272a?w=400' }
    ];
    categories.value = ['Main Dishes', 'Snacks', 'Beverages'];
    activeCategory.value = 'Main Dishes';
  }
});

const handleJoinGroup = async (code: string) => {
  try {
    await joinGroupOrder(code);
    syncWithCart(vendor.value._id);
  } catch (e) {
    console.error('Failed to join group order', e);
    showToast('Failed to join group order. Invalid or expired code.', 'error');
  }
};

const handleCheckoutGroupOrder = async () => {
  if (!isHost.value || groupLoading.value) return;
  try {
    await checkout();
    showToast('Group order placed successfully!', 'success');
  } catch (e) {
    console.error('Checkout failed', e);
    showToast('Failed to checkout. Ensure payment is settled.', 'error');
  }
};

// shareStore has been replaced by the ShareModal

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  cleanupEventListeners();
});

useHead({ 
  title: computed(() => vendor.value?.storeName ? `${vendor.value.storeName} | Errandr` : 'Vendor Store | Errandr') 
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-slide-up-mobile {
  animation: slideUpMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUpMobile {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-zoom-in {
  animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
