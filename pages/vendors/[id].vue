<template>
  <div class="min-h-screen bg-white" v-if="vendor">
    <!-- Standalone Header -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-50">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/vendors')" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all">
            <ArrowLeft class="w-4 h-4 text-gray-900" />
          </button>
          <NuxtLink to="/dashboard" class="text-lg font-bold text-gray-900 tracking-tighter">Errandr</NuxtLink>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/cart" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all relative">
            <ShoppingCart class="w-4 h-4 text-gray-900" />
            <div v-if="cart.itemCount.value > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-parentPrimary border border-white rounded-full flex items-center justify-center">
              <span class="text-[8px] font-bold text-white">{{ cart.itemCount.value > 9 ? '9+' : cart.itemCount.value }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="max-w-[1400px] mx-auto animate-fade-in pb-32 px-4 md:px-6 pt-6">
      <!-- Compact Vendor Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2 border-b border-gray-50 pb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white shrink-0">
            <img :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
          </div>
          <div>
            <h1 class="text-xl font-black text-gray-900 tracking-tight">{{ toTitleCase(vendor.storeName) }}</h1>
            <div class="flex items-center gap-2 text-[10px] font-black text-gray-400 tracking-widest mt-1">
              <div class="flex items-center gap-1">
                <Star class="w-3 h-3 text-amber-400 fill-current" />
                <span class="text-gray-900">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
              </div>
              <div class="w-1 h-1 rounded-full bg-gray-200" />
              <span>{{ vendor.totalRatings || 0 }} reviews</span>
              <div class="w-1 h-1 rounded-full bg-gray-200" />
              <button @click="showStoreInfo = true" class="text-parentPrimary hover:underline">Info</button>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-sans">
          <button 
            @click="showMobileCartDrawer = true" 
            class="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black tracking-widest hover:bg-parentPrimary transition-all whitespace-nowrap shadow-md shrink-0"
          >
            <ShoppingBag class="w-3.5 h-3.5" />
            <span v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="bg-parentPrimary px-1.5 py-0.5 rounded-md text-[8px]">{{ cart.getVendorStats(vendor._id).itemCount }}</span>
            <span v-else>View Packs</span>
          </button>
          <button 
            @click="handleStartGroupOrder"
            class="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black tracking-widest text-gray-900 hover:bg-gray-100 transition-all whitespace-nowrap shrink-0"
          >
            <Users class="w-3.5 h-3.5" />
            {{ activeCode ? `Group: ${activeCode}` : 'Group Order' }}
          </button>
          <button class="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:text-rose-500 transition-all shrink-0">
            <Heart class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Banner (Scaled Down) -->
      <div v-if="activeBanners.length" class="mb-10 px-2 overflow-hidden">
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          <div 
            v-for="(banner, idx) in activeBanners" 
            :key="idx"
            class="flex-shrink-0 w-full md:w-[480px] h-[180px] rounded-2xl overflow-hidden relative shadow-sm border border-gray-50 snap-start group cursor-pointer"
            @click="banner.link ? navigateTo(banner.link, { external: true }) : null"
          >
            <img :src="banner.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-6">
              <span class="absolute top-4 right-4 px-2 py-1 bg-rose-500 text-white rounded-md text-[8px] font-black tracking-widest shadow-sm">OFFER</span>
              <h3 class="text-base font-black text-white tracking-tight">{{ toTitleCase(banner.title) }}</h3>
              <p class="text-[9px] font-bold text-white/80 tracking-widest mt-1">{{ banner.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pre-Order Batch Banner -->
      <div v-if="activeBatch" class="mb-10 px-2">
        <div class="bg-gray-900 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/20 rounded-full blur-[80px] group-hover:bg-parentPrimary/30 transition-all duration-700"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 uppercase tracking-widest">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-parentPrimary text-white flex items-center justify-center shadow-lg">
                  <Calendar class="w-5 h-5" />
                </div>
                <h3 class="text-sm font-black text-white tracking-[0.15em]">{{ activeBatch.windowName }}</h3>
              </div>
              <div class="flex flex-wrap gap-6">
                <div>
                  <p class="text-[10px] text-white/40 font-black mb-1">Accepting orders until</p>
                  <p class="text-xs font-black text-parentPrimary">{{ new Date(activeBatch.deadline).toLocaleString() }}</p>
                </div>
                <div class="w-px h-8 bg-white/10 hidden md:block"></div>
                <div>
                  <p class="text-[10px] text-white/40 font-black mb-1">Delivery on</p>
                  <p class="text-xs font-black text-emerald-400">{{ new Date(activeBatch.deliveryDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
               <div class="text-right hidden sm:block">
                 <p class="text-[8px] text-white/40 font-black mb-1">Campaign Status</p>
                 <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-[8px] font-black border border-emerald-500/20">LIVE & OPEN</span>
               </div>
               <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white text-xl">
                 🎁
               </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Sticky Category Nav -->
        <aside class="lg:w-48 shrink-0 border-b border-gray-50 lg:border-none pb-4 lg:pb-0 mb-6 lg:mb-0">
          <div class="sticky top-24">
            <h4 class="hidden lg:block text-[9px] font-black text-gray-400 tracking-[0.2em] mb-4 px-2">Categories</h4>
            <div class="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
              <button
                v-for="cat in categories"
                :key="cat"
                @click="scrollToCategory(cat)"
                class="whitespace-nowrap lg:w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all relative group shrink-0"
                :class="activeCategory === cat ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-50/50 text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
              >
                {{ toTitleCase(cat) }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Products Grid -->
        <div class="flex-1 space-y-12">
          <section 
            v-for="cat in categories" 
            :key="cat" 
            :id="cat.toLowerCase().replace(/\s+/g, '-')"
            class="scroll-mt-32"
          >
            <div class="flex items-center gap-3 mb-6">
              <h2 class="text-sm font-black text-gray-900 tracking-widest">{{ toTitleCase(cat) }}</h2>
              <div class="h-px bg-gray-50 flex-1" />
            </div>

            <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-5">
              <div 
                v-for="product in groupedProducts[cat]" 
                :key="product._id"
                @click="selectedProduct = product"
                class="group relative bg-white rounded-[1.25rem] md:rounded-3xl border border-gray-100/50 p-2 md:p-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-parentPrimary/20 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col gap-3 md:gap-4"
              >
                <!-- Image Wrapper -->
                <div class="w-full aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 border border-gray-100/50 shrink-0 relative">
                  <img :src="product.image || '/placeholder-food.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <!-- Item Count Overlay -->
                  <div v-if="getProductCount(product._id) > 0" class="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1.5 bg-gray-900/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-[10px] font-black shadow-xl z-10 border border-white/10">
                    <ShoppingBag class="w-3.5 h-3.5" />
                    {{ getProductCount(product._id) }}
                  </div>
                </div>
                
                <!-- Content Area -->
                <div class="flex-1 flex flex-col justify-between px-1 pb-1">
                  <div>
                    <h3 class="text-sm md:text-base font-black text-gray-900 tracking-tight leading-tight mb-1">{{ product.name }}</h3>
                    <p class="hidden md:block text-[11px] font-bold text-gray-400 line-clamp-2 leading-relaxed">{{ product.description || 'Freshly prepared with premium ingredients.' }}</p>
                  </div>
                  
                  <div class="flex items-end justify-between mt-4">
                    <div class="flex flex-col">
                      <span v-if="product.discountPrice" class="text-[9px] text-gray-400 line-through mb-0.5">₦{{ product.price.toLocaleString() }}</span>
                      <span class="text-sm md:text-lg font-black text-gray-900 leading-none">₦{{ (product.discountPrice || product.price).toLocaleString() }}</span>
                    </div>
                    
                    <button 
                      @click.stop="addToCart(product)"
                      class="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-parentPrimary hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-parentPrimary/30 shadow-black/5 shrink-0"
                    >
                      <Plus class="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Compact Right Sidebar / Mobile Drawer (Orders/Participants) -->
        <aside 
          class="shrink-0 transition-opacity z-50 text-sans"
          :class="{
            'fixed inset-0 bg-black/60 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none flex flex-col justify-end lg:block opacity-100 visible': showMobileCartDrawer,
            'hidden lg:block lg:w-[380px] opacity-0 lg:opacity-100 invisible lg:visible': !showMobileCartDrawer
          }"
        >
          <!-- Mobile Close Overlay -->
          <div v-if="showMobileCartDrawer" class="absolute inset-0 lg:hidden" @click="showMobileCartDrawer = false" />
          
          <div 
            class="relative w-full lg:w-[380px] bg-white lg:bg-transparent rounded-t-[2.5rem] lg:rounded-none p-5 md:p-6 lg:p-0 h-[85vh] lg:h-auto overflow-y-auto scrollbar-hide lg:overflow-visible lg:sticky lg:top-24 mt-10 lg:mt-0 shadow-2xl lg:shadow-none transform transition-transform duration-300"
            :class="showMobileCartDrawer ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'"
          >
            <!-- Mobile Drawer Handle -->
            <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2 lg:hidden" />
            <div class="flex items-center justify-between mb-4 lg:hidden" v-if="showMobileCartDrawer">
              <h2 class="text-xl font-black text-gray-900 tracking-tight">Your Order</h2>
              <button @click="showMobileCartDrawer = false" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all">
                <X class="w-4 h-4"/>
              </button>
            </div>
            
            <div class="space-y-8 pb-10 lg:pb-0">
            <!-- Participants -->
            <div v-if="groupOrder" class="space-y-4">
              <div class="flex items-center justify-between px-2">
                <h3 class="text-[9px] font-black text-gray-400 tracking-[0.2em]">Participants ({{ groupOrder.participants.length }})</h3>
                <button v-if="isHost" @click="copyInviteLink" class="text-[8px] font-black text-parentPrimary tracking-widest hover:underline uppercase">Copy Link</button>
              </div>
              <div class="lg:p-4 lg:bg-gray-50/50 lg:rounded-2xl lg:border lg:border-gray-100 space-y-3">
                <div v-for="p in groupOrder.participants" :key="p.user._id || p.user" class="p-3 bg-gray-50 lg:bg-white border border-gray-100 lg:border-gray-50 rounded-xl lg:shadow-sm flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-white lg:bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-500 overflow-hidden shrink-0 border border-white lg:shadow-sm">
                    <img v-if="p.user.avatar" :src="p.user.avatar" class="w-full h-full object-cover" />
                    <span v-else>{{ p.user.firstName?.[0] }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="text-[10px] font-black text-gray-900 truncate">{{ p.user.firstName }} {{ p.user.lastName }}</p>
                      <span v-if="p.user._id === groupOrder.host._id || p.user === groupOrder.host" class="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[7px] font-black uppercase">Host</span>
                    </div>
                    <p class="text-[8px] font-bold text-gray-400 italic">{{ p.items?.length || 0 }} items • ₦{{ (p.total || 0).toLocaleString() }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div :class="p.isReady ? 'bg-emerald-500' : 'bg-gray-200'" class="w-1.5 h-1.5 rounded-full shadow-sm" />
                    <span class="text-[8px] font-black uppercase tracking-tighter" :class="p.isReady ? 'text-emerald-600' : 'text-gray-400'">{{ p.isReady ? 'Ready' : 'Carting' }}</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="pt-2 flex flex-col gap-2">
                  <button 
                    @click="toggleReady(!getMyStatus?.isReady)"
                    class="w-full py-3 rounded-xl text-[9px] font-black tracking-widest transition-all border shadow-sm"
                    :class="getMyStatus?.isReady ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-gray-400 border-gray-100 hover:text-gray-900'"
                  >
                    {{ getMyStatus?.isReady ? 'You are Ready' : 'Mark as Ready' }}
                  </button>
                  
                  <button 
                    v-if="isHost && groupOrder.status === 'open'"
                    @click="handleCheckoutGroupOrder"
                    :disabled="!canCheckout"
                    class="w-full py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black tracking-widest hover:bg-parentPrimary transition-all shadow-xl disabled:opacity-50"
                  >
                    Checkout Everything
                  </button>
                  
                  <button 
                    @click="leaveGroupOrder"
                    class="w-full py-2 text-[8px] font-black text-rose-400 tracking-widest hover:text-rose-600 transition-all uppercase"
                  >
                    Leave Group
                  </button>
                </div>
              </div>
            </div>

            <!-- Detailed Pack Summary (Pack Arrangement) -->
            <div class="lg:p-5 bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:shadow-sm space-y-5">
              <div class="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 class="text-sm font-black text-gray-900 tracking-widest">Your Packs</h3>
                <ShoppingCart class="w-5 h-5 text-parentPrimary" />
              </div>

              <div v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="space-y-5 lg:max-h-[500px] lg:overflow-y-auto lg:pr-1 scrollbar-hide">
                <div v-for="(pack, pIndex) in cart.getVendorStats(vendor._id).packs" :key="pack.id" class="space-y-3">
                  <!-- Pack Header -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-[11px] font-black bg-gray-900 text-white px-3 py-1 rounded-lg tracking-widest">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                    </div>
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
                  <div class="space-y-3 pl-1">
                    <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex items-center gap-3 md:gap-4">
                      <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                        <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs md:text-sm font-black text-gray-900 truncate tracking-tight mb-0.5">{{ toTitleCase(item.name) }}</p>
                        <p class="text-[10px] md:text-xs font-black text-parentPrimary">₦{{ item.price?.toLocaleString() }}</p>
                      </div>
                      <div class="flex items-center gap-1.5 md:gap-2 bg-gray-50 rounded-xl p-1 md:p-1.5 border border-gray-100 shrink-0">
                        <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity - 1)" class="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center hover:text-rose-500 transition-all text-sm font-bold shadow-sm">−</button>
                        <span class="text-xs md:text-sm font-black min-w-[16px] md:min-w-[20px] text-center">{{ item.quantity }}</span>
                        <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity + 1)" class="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center hover:text-parentPrimary transition-all text-sm font-bold shadow-sm">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add New Pack -->
                <button @click="addNewPack(vendor._id)" class="w-full py-3.5 border border-dashed border-gray-200 rounded-xl text-[10px] font-black text-gray-400 tracking-widest hover:border-parentPrimary hover:text-parentPrimary transition-all flex items-center justify-center gap-2">
                  <Plus class="w-3.5 h-3.5" /> New Pack
                </button>

                <div class="pt-6 pb-24 lg:pb-0 border-t border-gray-50 space-y-5">
                  <div class="flex justify-between items-center text-xs font-black text-gray-400 tracking-[0.2em]">
                    <span>Subtotal</span>
                    <span class="text-xl font-black text-gray-900 tracking-tighter">₦{{ cart.getVendorStats(vendor._id).subtotal.toLocaleString() }}</span>
                  </div>
                  <NuxtLink :to="activeCode ? `/cart?group=${activeCode}` : '/cart'" class="block w-full py-5 bg-gray-900 text-white rounded-2xl text-center text-[10px] md:text-xs font-black tracking-[0.2em] hover:bg-parentPrimary transition-all shadow-xl shadow-gray-100 uppercase">
                    {{ activeCode ? 'Finalize Order' : 'Checkout' }}
                  </NuxtLink>
                </div>
              </div>
              <div v-else class="text-center py-6">
                <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-lg">🛒</div>
                <p class="text-[9px] font-bold text-gray-400 tracking-widest">Your cart is empty</p>
              </div>
            </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Store Info Modal -->
    <div v-if="showStoreInfo" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-sans">
      <div class="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
        <div class="relative h-48">
          <img :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          <button @click="showStoreInfo = false" class="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
            <X class="w-5 h-5" />
          </button>
          <div class="absolute bottom-6 left-10">
            <h2 class="text-2xl font-black text-white tracking-tight">{{ toTitleCase(vendor.storeName) }}</h2>
            <p class="text-[10px] font-bold text-white/70 mt-1 tracking-widest">{{ vendor.about || 'Store info available' }}</p>
          </div>
        </div>
        <div class="p-10 space-y-8">
          <div class="space-y-4">
            <h3 class="text-[9px] font-black text-gray-400 tracking-[0.2em] ">About the vendor</h3>
            <p class="text-[11px] text-gray-600 leading-relaxed font-bold">{{ vendor.description || 'No description available for this vendor.' }}</p>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-[9px] font-black text-gray-400 tracking-[0.2em] ">
                <Clock class="w-3 h-3" /> Availability
              </div>
              <div class="space-y-1">
                <p v-for="(hours, day) in vendor.availability" :key="day" class="text-[10px] font-bold text-gray-900">
                  <span class="text-gray-400 w-16 inline-block tracking-tighter">{{ day }}:</span> {{ hours }}
                </p>
                <p v-if="!vendor.availability" class="text-[10px] font-bold text-gray-900">Available 24/7</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-[9px] font-black text-gray-400 tracking-[0.2em] ">
                <MapPin class="w-3 h-3" /> Location
              </div>
              <p class="text-[10px] font-bold text-gray-900 leading-relaxed">{{ vendor.address || 'University Main campus' }}</p>
            </div>
          </div>
          <button @click="showStoreInfo = false" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-parentPrimary transition-all shadow-xl">
            Got it
          </button>
        </div>
      </div>
    </div>

    <!-- Group Naming Modal -->
    <div v-if="showGroupNamingModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-sans">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-fade-in-up">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg text-gray-900">
            <Users class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-xl font-black text-gray-900 tracking-tight">Name your group</h3>
            <p class="text-[10px] font-black text-gray-400 mt-1 tracking-widest">e.g., "Sunday Brunch"</p>
          </div>
        </div>
        <div class="space-y-6">
          <div class="bg-gray-50 p-1 rounded-2xl border border-transparent focus-within:border-parentPrimary transition-all">
            <UiAnimatedInput 
              v-model="groupName" 
              label="Group Name" 
              @keyup.enter="confirmStartGroupOrder"
            />
          </div>
          <div class="flex gap-4">
            <button 
              @click="showGroupNamingModal = false" 
              class="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] tracking-widest hover:bg-gray-100 transition-all font-sans"
            >
              Cancel
            </button>
            <button 
              @click="confirmStartGroupOrder" 
              :disabled="!groupName.trim() || groupLoading"
              class="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-parentPrimary transition-all shadow-xl disabled:opacity-50 font-sans"
            >
              <span v-if="groupLoading">Starting...</span>
              <span v-else>Start Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div v-if="selectedProduct" class="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-md animate-fade-in">
      <div class="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        <div class="md:w-1/2 aspect-square md:aspect-auto relative bg-gray-50 border-r border-gray-100">
          <img :src="selectedProduct.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
          <div class="absolute top-6 left-6">
            <button @click="selectedProduct = null" class="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        <div class="flex-1 p-8 md:p-12 flex flex-col scrollbar-hide overflow-y-auto max-h-[80vh] md:max-h-none">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <p class="text-[10px] font-black text-parentPrimary tracking-[0.2em]">{{ selectedProduct.category }}</p>
              <div class="flex items-center gap-1 text-[10px] font-black text-amber-500">
                <Star class="w-3 h-3 fill-current" /> 4.8
              </div>
            </div>
            <h2 class="text-4xl font-black text-gray-900 tracking-tighter mb-4 ">{{ selectedProduct.name }}</h2>
            <p class="text-sm font-bold text-gray-400 leading-relaxed italic mb-8">
              {{ selectedProduct.description || 'Our signature dish, prepared with the finest ingredients to satisfy your cravings.' }}
            </p>

            <div class="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-[10px] font-black text-gray-400 tracking-widest">Dietary Info</h4>
                <Info class="w-3.5 h-3.5 text-gray-300" />
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[8px] font-bold text-gray-600 tracking-widest">Gluten Free</span>
                <span class="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[8px] font-bold text-gray-600 tracking-widest">Fresh</span>
              </div>
            </div>
          </div>

          <div class="pt-8 border-t border-gray-100 flex items-center justify-between gap-6">
            <div>
              <p class="text-[9px] font-black text-gray-400 tracking-widest mb-1">Total Price</p>
              <p class="text-3xl font-black text-gray-900 tracking-tighter">₦{{ (selectedProduct.discountPrice || selectedProduct.price).toLocaleString() }}</p>
            </div>
            <button 
              @click="addToCart(selectedProduct); selectedProduct = null"
              class="flex-1 bg-gray-900 text-white rounded-[1.5rem] py-5 font-black text-xs tracking-[0.2em] hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
            >
              <Plus class="w-4 h-4" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="w-10 h-10 border-2 border-gray-100 border-t-parentPrimary rounded-full animate-spin" />
  </div>
</template>

<script setup lang="ts">
import { 
  Plus, Minus, X, Copy, Trash2, ShoppingCart, 
  Clock, Star, MapPin, ArrowRight, Heart, ArrowLeft, Search, Info, ChevronRight, Users, ShoppingBag, Calendar
} from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useHead, navigateTo } from '#imports';
import { useCart } from '@/composables/modules/cart';
import { useUser } from '@/composables/modules/auth/user';
import { useGroupOrder } from '@/composables/modules/group-order';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useToast } from '@/composables/useToast';

definePageMeta({
  layout: false
})

const route = useRoute();
const cart = useCart();
const { user } = useUser();
const { 
  groupOrder, activeCode, isLoading: groupLoading, createGroupOrder, 
  joinGroupOrder, fetchGroupOrder, syncWithCart, leaveGroupOrder,
  toggleReady, checkout, isHost, cleanupEventListeners
} = useGroupOrder();
const { showToast } = useToast();

const showMobileCartDrawer = ref(false);
const vendor = ref<any>(null);
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const activeCategory = ref('');
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
  const sections = categories.value.map(cat => ({
    id: cat,
    el: document.getElementById(cat.toLowerCase().replace(/\s+/g, '-'))
  }));
  const scrollPosition = window.scrollY + 150;
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
    const [vendorRes, productsRes] = await Promise.all([
      api.get<any>(`/vendors/${route.params.id}`),
      api.get<any[]>(`/products/vendor/${route.params.id}`),
    ]);
    if (vendorRes.data && !(vendorRes as any).type) {
      vendor.value = vendorRes.data;
      products.value = productsRes.data || [];
    } else {
      throw new Error('Using mock data');
    }
    const uniqueCats = [...new Set(products.value.map((p: any) => p.category).filter(Boolean))];
    categories.value = uniqueCats;
    if (uniqueCats.length > 0) activeCategory.value = uniqueCats[0];
    window.addEventListener('scroll', handleScroll);
    if (route.query.group) {
      handleJoinGroup(route.query.group as string);
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
      banners: [
        { title: 'Fresh Summer Deal', description: 'Get 20% off on all salads and drinks.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200' },
        { title: 'Student Night', description: 'Late night snacks for study sessions.', image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200' }
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

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e5e5e5; }

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
