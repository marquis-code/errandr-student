<template>
  <div class="min-h-screen bg-[#F7F7F5] flex justify-center selection:bg-parentPrimary/10 selection:text-parentPrimary font-sans overflow-y-auto">

    <!-- ===== EMPTY STATE ===== -->
    <div v-if="cartStore.isEmpty.value" class="w-full flex flex-col items-center justify-start p-6 max-w-5xl mx-auto pb-32">
      <div class="bg-white rounded-[2rem] text-center p-12 border border-gray-100 w-full animate-fade-in flex flex-col items-center mb-12">
        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-5xl mb-6 transform -rotate-6 animate-float">🛒</div>
        <h2 class="text-3xl font-black text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
        <p class="text-sm font-medium text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything yet. Discover campus favorites below and start shopping.</p>
        <NuxtLink to="/vendors" class="px-8 py-4 bg-gray-900 text-white rounded-[2rem] font-bold text-sm hover:bg-parentPrimary transition-all active:scale-95 flex items-center gap-2">
          <ShoppingBag class="w-4 h-4" /> Browse All Vendors
        </NuxtLink>
      </div>
      <!-- Campus Favorites (Empty State) -->
      <div class="w-full space-y-6 animate-fade-in" style="animation-delay: 100ms">
        <div class="flex items-center justify-between px-2">
          <h3 class="text-xl font-black text-gray-900 tracking-tight">Campus Favorites 🔥</h3>
          <NuxtLink to="/vendors" class="text-xs font-bold text-parentPrimary hover:underline py-2 px-4 rounded-lg bg-parentPrimary/10">See all</NuxtLink>
        </div>
        <div v-if="loadingVendors" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="h-64 bg-gray-50 rounded-[2rem] border border-gray-100 animate-pulse"></div>
        </div>
        <div v-else-if="popularVendors.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="vendor in popularVendors.slice(0, 6)"
            :key="vendor._id"
            :to="`/vendors/${vendor._id}`"
            class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden transition-all group hover:-translate-y-1 block duration-300"
          >
            <div class="h-32 w-full bg-gray-100 relative overflow-hidden">
              <img :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              <div class="absolute bottom-3 left-4 flex gap-2">
                <span class="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-[9px] font-black text-white tracking-[0.2em] uppercase border border-white/20">
                  {{ vendor.preparationTime || 20 }} MIN
                </span>
              </div>
              <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-lg flex items-center gap-1 border border-white/50">
                <Star class="w-3 h-3 text-amber-500 fill-current" />
                <span class="text-[10px] font-black text-gray-900">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
              </div>
            </div>
            <div class="p-5 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                  <img v-if="vendor.logo" :src="vendor.logo" class="w-full h-full object-cover" />
                  <span v-else class="w-full h-full flex items-center justify-center font-black text-gray-400 text-xs">{{ vendor.storeName?.[0] }}</span>
                </div>
                <div class="min-w-0">
                  <h4 class="text-sm font-black text-gray-900 truncate tracking-tight">{{ vendor.storeName }}</h4>
                  <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5 truncate">{{ vendor.category }}</p>
                </div>
              </div>
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-parentPrimary group-hover:text-white transition-colors shrink-0">
                <ArrowRight class="w-4 h-4" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ===== ACTIVE CART LAYOUT ===== -->
    <div v-else class="w-full max-w-[1400px] flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-10 pb-40 lg:pb-10">

      <!-- Mobile Top Section: Order Header & Breakdown Button -->
      <div class="lg:hidden w-full space-y-4 mb-2">
        <div class="flex items-center justify-between bg-white border border-gray-100 rounded-3xl p-5">
          <div class="flex items-center gap-3">
             <button @click="goBack" class="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center border border-gray-100">
               <ArrowLeft class="w-4 h-4" />
             </button>
             <div>
               <h2 class="text-xl font-black text-gray-900 tracking-tight leading-none">Your Order</h2>
               <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{{ cartStore.itemCount }} items selected</p>
             </div>
          </div>
          <button 
            @click="showOrderBreakdown = true"
            class="px-4 py-2.5 bg-gray-900 text-white rounded-2xl text-[10px] font-black tracking-widest hover:bg-parentPrimary transition-all uppercase"
          >
            Review Items
          </button>
        </div>
      </div>

      <!-- ===== LEFT SIDE: DELIVERY & DETAILS (MOBILE FIRST) ===== -->
      <div class="w-full lg:w-[380px] shrink-0 space-y-4">
        <div class="bg-white rounded-[2.5rem] border border-gray-100 p-6 md:p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
              <MapPin class="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h3 class="text-base font-black text-gray-900 tracking-tight">Delivery Details</h3>
              <p class="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Where should we drop it?</p>
            </div>
          </div>

          <div class="space-y-5">
            <!-- Add-ons -->
            <div class="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-3">
              <label class="flex items-center justify-between cursor-pointer group">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl border border-gray-100 group-hover:scale-105 transition-transform">🎁</div>
                  <div>
                    <p class="text-xs font-black text-gray-900 leading-none mb-1">Mystery Box</p>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Random item for ₦800</p>
                  </div>
                </div>
                <input type="checkbox" v-model="isMysteryBox" class="w-5 h-5 accent-parentPrimary cursor-pointer rounded">
              </label>
              <div class="h-px bg-gray-200/50"></div>
              <label class="flex items-center justify-between cursor-pointer group">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl border border-gray-100 group-hover:scale-105 transition-transform">🏢</div>
                  <div>
                    <p class="text-xs font-black text-gray-900 leading-none mb-1">Dorm Delivery</p>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Split fee with neighbors</p>
                  </div>
                </div>
                <input type="checkbox" v-model="isDormDelivery" class="w-5 h-5 accent-emerald-500 cursor-pointer rounded">
              </label>
            </div>

            <AnimatedInput v-model="recipientName" label="Full Name" placeholder="e.g. Ebuka Chima" />
            <AnimatedInput v-model="recipientPhone" label="Phone Number" placeholder="081 2345 6789" type="tel" />
            <SelectInput v-model="deliveryOption" label="Delivery Policy" :options="[{label: 'Use an Errander (₦150)', value: 'use_an_errander'}, {label: 'I\'ll pick it up myself', value: 'pickup'}]" />

            <div v-if="deliveryOption === 'use_an_errander'" class="animate-fade-in">
              <div class="bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Hostel / Internal Campus Location</p>
                <textarea
                  v-model="specificAddress"
                  rows="3"
                  placeholder="e.g. Moremi Hall, Room 302, Unilag"
                  class="w-full bg-white border-2 border-transparent focus:border-parentPrimary/30 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200 resize-none shadow-sm shadow-gray-50"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-none">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
              <CreditCard class="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h3 class="text-base font-black text-gray-900 tracking-tight">Payment Method</h3>
              <p class="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Choose your chop strategy</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="paymentMethod = 'card'"
              :class="paymentMethod === 'card' ? 'border-parentPrimary bg-parentPrimary/5 ring-1 ring-parentPrimary' : 'border-gray-100 hover:border-gray-200 bg-gray-50/30'"
              class="p-4 rounded-3xl border-2 transition-all text-left flex flex-col h-full justify-between gap-4"
            >
              <div class="w-12 h-6 overflow-hidden">
                <img src="~/assets/img/paystack.png" class="h-full object-contain" alt="Paystack" />
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1">Pay with Card</p>
                <p class="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Instant & Secure</p>
              </div>
            </button>

            <button 
              @click="paymentMethod = 'wallet'"
              :class="paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-100 hover:border-gray-200 bg-gray-50/30'"
              class="p-4 rounded-3xl border-2 transition-all text-left flex flex-col h-full justify-between gap-4"
            >
              <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                <Wallet :class="paymentMethod === 'wallet' ? 'text-emerald-500' : 'text-gray-300'" class="w-5 h-5 transition-colors" />
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">My Wallet</p>
                  <div @click.stop="fetchWallet" class="p-1 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer">
                    <RefreshCw :class="loadingPayment ? 'animate-spin' : ''" class="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
                <p :class="balance < finalTotal ? 'text-rose-500' : 'text-emerald-600'" class="text-[10px] font-black uppercase tracking-tighter">
                  ₦{{ (balance || 0).toLocaleString() }}
                </p>
              </div>
            </button>
          </div>

          <!-- Insufficient Funds / Top-up UI -->
          <div v-if="paymentMethod === 'wallet' && balance < finalTotal" class="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-3xl animate-fade-in text-center">
            <p class="text-[10px] font-bold text-rose-500 mb-4 tracking-tight uppercase">Your balance is too low for this order</p>
            <div class="flex flex-col gap-2">
              <input 
                v-model="topupAmount"
                type="number"
                placeholder="Amount to add"
                class="w-full px-4 py-3 bg-white border border-rose-200 rounded-2xl text-xs font-black text-gray-900 outline-none focus:border-parentPrimary transition-all placeholder:text-gray-300"
              />
              <button 
                @click="startTopup"
                :disabled="loadingPayment || topupAmount <= 0"
                class="w-full py-3 bg-gray-900 text-white rounded-2xl text-[9px] font-black tracking-widest uppercase hover:bg-parentPrimary transition-all disabled:opacity-50"
              >
                {{ loadingPayment ? 'Initializing...' : 'Top-up with Paystack' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== RIGHT SIDE: ORDER ITEMS (DESKTOP) ===== -->
      <div class="flex-1 hidden lg:block overflow-y-auto max-h-[calc(100vh-100px)] lg:pr-4 scrollbar-hide">
        <div class="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-none mb-6">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-black text-gray-900 tracking-tighter">Order Summary</h2>
            <button @click="goBack" class="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center border border-gray-100 group">
              <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          <div class="space-y-10">
            <div v-for="vendorId in cartStore.allVendorIds.value" :key="vendorId" class="space-y-6">
              <!-- Vendor Header -->
              <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                    <ShoppingBag class="w-5 h-5 text-parentPrimary" />
                  </div>
                  <div>
                    <h3 class="text-base font-black text-gray-900 tracking-tight">{{ toTitleCase(vendorsMetadata[vendorId]?.storeName || 'Loading...') }}</h3>
                    <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">{{ cartStore.getVendorStats(vendorId).itemCount }} items</p>
                  </div>
                </div>
                <button @click="cartStore.clearCart(vendorId)" class="p-2 text-gray-300 hover:text-rose-500 transition-all rounded-xl hover:bg-rose-50">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>

              <!-- Vendor Items (Packs) -->
              <div v-for="(pack, pIndex) in cartStore.getVendorStats(vendorId).packs" :key="pack.id" class="pl-14 space-y-4">
                 <div class="flex items-center gap-3">
                   <span class="text-[10px] font-black bg-gray-900 text-white px-2.5 py-1 rounded-lg tracking-widest">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                 </div>
                 <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex items-center gap-5 group">
                   <div class="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                     <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   </div>
                   <div class="flex-1 min-w-0">
                     <h4 class="font-black text-gray-900 text-sm truncate tracking-tight mb-1">{{ toTitleCase(item.name) }}</h4>
                     <p class="text-parentPrimary font-black text-xs">₦{{ item.price?.toLocaleString() }} <span class="text-gray-400 font-bold ml-1">x{{ item.quantity }}</span></p>
                   </div>
                   <div class="text-right">
                     <p class="font-black text-gray-900 text-sm tracking-tight text-sans">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full lg:hidden fixed bottom-6 left-0 right-0 px-4 z-40">
        <div class="bg-gray-900/95 backdrop-blur-xl rounded-[2.5rem] p-5 text-white flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden border border-white/10">
          <div class="absolute -right-4 top-0 w-24 h-24 bg-parentPrimary/10 rounded-full blur-2xl"></div>
          <div class="relative z-10">
            <p class="text-[8px] font-black text-white/40 tracking-[0.2em] uppercase mb-1">Total to Pay</p>
            <h3 class="text-2xl font-black text-white tracking-tighter leading-none">₦{{ finalTotal.toLocaleString() }}</h3>
          </div>
          <button 
            @click="startPayment"
            :disabled="placing || (paymentMethod === 'wallet' && balance < finalTotal)"
            class="relative z-10 px-8 py-4 bg-parentPrimary text-white rounded-2xl text-[10px] font-black tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-3 uppercase shadow-lg shadow-parentPrimary/20"
          >
            <div v-if="placing" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span v-else>{{ placing ? '...' : 'Pay Now' }}</span>
            <ArrowRight v-if="!placing" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Desktop Sidebar Summary -->
      <div class="hidden lg:block w-full lg:w-[320px] shrink-0 mt-8 lg:mt-0">
        <div class="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
          <h3 class="text-sm font-black text-gray-900 tracking-[0.2em] uppercase">Order Summary</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center text-xs font-bold text-gray-500">
               <span>Subtotal</span>
               <span class="text-gray-900">₦{{ (groupOrder ? groupSubtotal : cartStore.subtotal.value)?.toLocaleString() }}</span>
            </div>
            <div v-if="computedTotalDeliveryFee > 0" class="flex justify-between items-center text-xs font-bold text-gray-500">
               <span>Delivery</span>
               <span class="text-gray-900">₦{{ computedTotalDeliveryFee.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-xs font-bold text-gray-500">
               <span>Fees & Packaging</span>
               <span class="text-gray-900">₦{{ (computedTotalPackagingFee + computedTotalServiceFee).toLocaleString() }}</span>
            </div>
             <div v-if="computedPaystackFee > 0" class="flex justify-between items-center text-xs font-bold text-gray-500">
               <span>Processing Fee</span>
               <span class="text-gray-900">₦{{ computedPaystackFee.toLocaleString() }}</span>
            </div>
          </div>
          <div class="pt-6 border-t-2 border-dashed border-gray-100">
             <div class="flex justify-between items-end mb-8">
               <div>
                  <p class="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-1">Total Payable</p>
                  <h3 class="text-3xl font-black text-gray-900 tracking-tighter">₦{{ finalTotal.toLocaleString() }}</h3>
               </div>
               <div class="text-[8px] font-black text-gray-400 uppercase text-right leading-relaxed tracking-widest">
                  Secure Paystack<br/>Gateway Ready
               </div>
             </div>
             
             <button 
                @click="startPayment"
                :disabled="placing || (paymentMethod === 'wallet' && balance < finalTotal)"
                class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[11px] font-black tracking-widest hover:bg-parentPrimary transition-all disabled:opacity-40 flex items-center justify-center gap-3 uppercase shadow-none"
              >
                <Loader2 v-if="placing" class="w-4 h-4 animate-spin" />
                <span>{{ placing ? 'Processing...' : 'Complete Checkout' }}</span>
                <ArrowRight v-if="!placing" class="w-4 h-4" />
              </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer: Order Breakdown (Chowdeck Style) -->
    <Transition name="slide-up">
      <div v-if="showOrderBreakdown" class="fixed inset-0 z-[150] lg:hidden flex flex-col justify-end">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="showOrderBreakdown = false"></div>
        <div class="relative bg-white rounded-t-[3rem] p-6 max-h-[85vh] overflow-hidden flex flex-col pt-8">
          <div class="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6"></div>
          <div class="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 class="text-2xl font-black text-gray-900 tracking-tight">Review Items</h2>
              <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">Check your packs & units</p>
            </div>
            <button @click="showOrderBreakdown = false" class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto px-2 space-y-8 scrollbar-hide pb-10">
            <div v-for="vendorId in cartStore.allVendorIds.value" :key="'mb-' + vendorId" class="space-y-6">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                  <ShoppingBag class="w-4 h-4 text-parentPrimary" />
                </div>
                <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest">{{ toTitleCase(vendorsMetadata[vendorId]?.storeName || '') }}</h4>
              </div>
              
              <div v-for="(pack, pIndex) in cartStore.getVendorStats(vendorId).packs" :key="'mb-pack-' + pack.id" class="pl-4 border-l-2 border-gray-50 space-y-5">
                 <div class="flex items-center justify-between">
                   <p class="text-[10px] font-black text-gray-300 tracking-widest uppercase">Pack {{ pIndex + 1 }}</p>
                   <button @click="cartStore.removePack(vendorId, pack.id)" class="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em] hover:text-rose-500">Remove Pack</button>
                 </div>
                 <div v-for="(item, iIndex) in pack.items" :key="'mb-item-'+iIndex" class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h5 class="text-xs font-black text-gray-900 truncate tracking-tight">{{ toTitleCase(item.name) }}</h5>
                      <p class="text-[10px] font-bold text-parentPrimary">₦{{ item.price?.toLocaleString() }}</p>
                    </div>
                    <div class="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <button @click="cartStore.updateItemQuantity(vendorId, pack.id, iIndex, item.quantity - 1)" class="text-gray-400 font-bold hover:text-rose-500 transition-colors">−</button>
                      <span class="text-xs font-black text-gray-900 min-w-[12px] text-center">{{ item.quantity }}</span>
                      <button @click="cartStore.updateItemQuantity(vendorId, pack.id, iIndex, item.quantity + 1)" class="text-gray-400 font-bold hover:text-parentPrimary transition-colors">+</button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
          
          <button @click="showOrderBreakdown = false" class="w-full py-5 bg-gray-900 text-white rounded-[2rem] text-[10px] font-black tracking-[0.2em] shadow-none uppercase mt-2">
            Done Reviewing
          </button>
        </div>
      </div>
    </Transition>

    <!-- Top-up Wallet Modal -->
    <Transition name="fade">
      <div v-if="showTopupModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-md" @click="showTopupModal = false"></div>
        <div class="relative bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center animate-zoom-in">
          <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <Wallet class="w-8 h-8" />
          </div>
          <h2 class="text-2xl font-black text-gray-900 mb-2 tracking-tight">Populate Wallet</h2>
          <p class="text-sm font-medium text-gray-400 mb-8 px-2">Fill in the amount you'd like to fund your wallet with. You'll be redirected to Paystack.</p>
          
          <div class="space-y-4">
            <div class="relative group text-left">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Amount to Add (NGN)</p>
              <input 
                v-model="topupAmount" 
                type="number"
                placeholder="e.g. 5000"
                class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-sm font-black text-gray-900 outline-none transition-all"
              />
            </div>
            
            <button 
              @click="startTopup" 
              :disabled="loadingPayment || topupAmount <= 0"
              class="w-full py-4 bg-gray-900 text-white rounded-2xl text-xs font-black tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loadingPayment" class="w-4 h-4 animate-spin" />
              <span>FUND WALLET NOW</span>
            </button>
          </div>
          
          <button @click="showTopupModal = false" class="mt-6 text-[10px] font-black text-gray-300 tracking-widest uppercase hover:text-gray-900 transition-colors">
            Maybe Later
          </button>
        </div>
      </div>
    </Transition>

    <!-- Full Screen Placing Order Loader -->
    <Transition name="fade">
      <div v-if="placing" class="fixed inset-0 z-[250] bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 text-white uppercase tracking-widest">
        <div class="w-24 h-24 mb-8 relative">
          <div class="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-t-parentPrimary rounded-full animate-spin"></div>
        </div>
        <h2 class="text-2xl font-black mb-2">Finalizing chop...</h2>
        <p class="text-white/40 font-bold text-[9px]">Redirecting to payment...</p>
      </div>
    </Transition>

    <!-- Auth Modal -->
    <CheckoutAuthModal
      v-model="showAuthModal"
      @authenticated="handleAuthenticated"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  ShoppingBag, Trash2, X, ShoppingCart, ArrowLeft, MapPin,
  ChevronRight, ArrowRight, Users, Pencil, Loader2, Star,
  CreditCard, Wallet, Heart, RefreshCw
} from 'lucide-vue-next';
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import CheckoutAuthModal from '@/components/CheckoutAuthModal.vue';
import { useUser } from '@/composables/modules/auth/user';
import { useCart } from '@/composables/modules/cart';
import { useGroupOrder } from '@/composables/modules/group-order';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useVendors } from '@/composables/modules/vendors';
import { usePayments } from '@/composables/modules/payments';
import { useStudentOrders } from '@/composables/modules/orders';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from '#app';
import { useWallet } from '@/composables/modules/wallets';

definePageMeta({ layout: false });

const cartStore = useCart();
const { user } = useUser();
const { balance, fetchWallet } = useWallet();
const { initializePayment, verifyPayment, loading: loadingPayment, payWithWallet } = usePayments();

const paymentMethod = ref<'card' | 'wallet'>('card');
const { groupOrder, activeCode, fetchGroupOrder } = useGroupOrder();
const { showToast } = useCustomToast();
const { popularVendors, vendorsMetadata, fetchPopularVendors, fetchBulkMetadata, loading: loadingVendors } = useVendors();
const { createOrder } = useStudentOrders();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const recipientName = ref('');
const recipientPhone = ref('');
const specificAddress = ref('');
const deliveryOption = ref('use_an_errander');
const placing = ref(false);
const showAuthModal = ref(false);
const showOrderBreakdown = ref(false);
const showTopupModal = ref(false);
const topupAmount = ref<number>(0);
const paymentError = ref('');
const selectedPacks = ref<Record<string, any>>({});
const isMysteryBox = ref(false);
const isDormDelivery = ref(false);

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
};

const currentSubtotal = computed(() => {
  const base = groupOrder.value ? groupSubtotal.value : cartStore.subtotal.value;
  return isMysteryBox.value ? base + 800 : base;
});

const computedTotalDeliveryFee = computed(() => {
  if (deliveryOption.value === 'pickup') return 0;
  let total = 0;
  cartStore.allVendorIds.value.forEach(vId => {
    total += vendorsMetadata.value[vId]?.deliveryFee ?? 150;
  });
  return isDormDelivery.value ? Math.round(total * 0.5) : total;
});

const computedTotalPackagingFee = computed(() => {
  let total = 0;
  cartStore.allVendorIds.value.forEach(vId => {
    const selected = selectedPacks.value[vId];
    total += selected ? selected.price : (vendorsMetadata.value[vId]?.packagingFee ?? 300);
  });
  return total;
});

const computedTotalServiceFee = computed(() => Math.round(currentSubtotal.value * 0.05));

const groupSubtotal = computed(() => {
  if (!groupOrder.value) return 0;
  return groupOrder.value.participants.reduce((acc: number, p: any) =>
    acc + p.items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0), 0);
});

const subtotalBeforeFee = computed(() =>
  currentSubtotal.value + computedTotalDeliveryFee.value + computedTotalPackagingFee.value + computedTotalServiceFee.value
);

const computedPaystackFee = computed(() => {
  if (paymentMethod.value !== 'card') return 0;
  const amount = subtotalBeforeFee.value;
  if (amount === 0) return 0;
  let fee = amount < 2500 ? (amount / 0.985) - amount : ((amount + 100) / 0.985) - amount;
  if (fee > 2000) fee = 2000;
  return Math.ceil(fee);
});

const finalTotal = computed(() => subtotalBeforeFee.value + computedPaystackFee.value);

const goBack = () => {
  const lastVendorId = cartStore.allVendorIds.value[cartStore.allVendorIds.value.length - 1];
  navigateTo(lastVendorId ? `/vendors/${lastVendorId}` : '/vendors');
};

const handleAuthenticated = async () => {
  if (user.value) {
    recipientName.value = recipientName.value || `${user.value.firstName} ${user.value.lastName}`;
    recipientPhone.value = recipientPhone.value || user.value.phone || '';
  }
  showAuthModal.value = false;
  await startPayment();
};

onMounted(async () => {
  cartStore.initCart();
  if (cartStore.isEmpty.value) fetchPopularVendors();
  if (user.value) fetchWallet();

  if (route.query.group) {
    try { await fetchGroupOrder(route.query.group as string); } catch (e) { console.error(e); }
  }

  // Handle return from payment (Standard Redirect Flow verification)
  if (route.query.reference) {
    // Check if it was a wallet topup
    placing.value = true;
    try {
      const res = await verifyPayment(route.query.reference as string);
      const data = res?.data || res;
      if (data?.metadata?.type === 'wallet_topup' || data?.data?.metadata?.type === 'wallet_topup') {
        showToast({ title: 'Wallet funded!', message: 'Your balance has been updated.', toastType: 'success' });
        await fetchWallet();
        paymentMethod.value = 'wallet';
        placing.value = false;
        // IMPORTANT: Clear the reference from URL without refreshing or clearing cart
        const url = new URL(window.location.href);
        url.searchParams.delete('reference');
        window.history.replaceState({}, '', url.toString());
        return;
      }

      if (data?.status === 'success' || (data as any)?.status === 'success') {
        const orderIds = data?.metadata?.orderIds || [];
        // Clear cart for the vendors involved in these orders
        if (data?.metadata?.vendorIds) {
           data.metadata.vendorIds.forEach((vId: string) => cartStore.clearCart(vId));
        } else {
           cartStore.clearCart(); // Fallback to full clear if metadata is missing vendorIds
        }
        if (orderIds.length > 0) navigateTo(`/orders/${orderIds[0]}`);
      } else {
        paymentError.value = 'Payment failed. Please try again.';
        placing.value = false;
      }
    } catch (e) {
      paymentError.value = 'Could not verify payment.';
      placing.value = false;
    }
  }

  await fetchBulkMetadata(cartStore.allVendorIds.value);

  const cachedData = localStorage.getItem('errandr_checkout_data');
  if (cachedData) {
    const data = JSON.parse(cachedData);
    recipientName.value = data.name || '';
    recipientPhone.value = data.phone || '';
    specificAddress.value = data.address || '';
    deliveryOption.value = data.delivery || 'use_an_errander';
    isMysteryBox.value = data.mystery || false;
    isDormDelivery.value = data.dorm || false;
    paymentMethod.value = data.paymentMethod || 'card';
  } else if (user.value) {
    recipientName.value = `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim();
    recipientPhone.value = user.value.phone || '';
  }
});

watch([recipientName, recipientPhone, specificAddress, deliveryOption, isMysteryBox, isDormDelivery, paymentMethod], ([name, phone, address, delivery, mystery, dorm, method]) => {
  localStorage.setItem('errandr_checkout_data', JSON.stringify({ name, phone, address, delivery, mystery, dorm, paymentMethod: method }));
});

const startPayment = async () => {
  paymentError.value = '';
  if (!recipientName.value.trim() || !recipientPhone.value.trim()) return showToast({ title: 'Missing Info', message: 'Name and phone required', toastType: 'error' });
  if (deliveryOption.value === 'use_an_errander' && !specificAddress.value.trim()) return showToast({ title: 'Missing Info', message: 'Address required', toastType: 'error' });
  if (!user.value?.email) return (showAuthModal.value = true);

  if (paymentMethod.value === 'wallet' && balance.value < finalTotal.value) {
    showTopupModal.value = true;
    topupAmount.value = Math.ceil(finalTotal.value - balance.value);
    return;
  }

  placing.value = true;
  try {
    const orderIds = await preCreateOrders();
    if (!orderIds || orderIds.length === 0) throw new Error('Failed to create order');

    if (paymentMethod.value === 'wallet') {
      for (const orderId of orderIds) await payWithWallet(orderId);
      showToast({ title: 'Success', message: 'Order placed using wallet!', toastType: 'success' });
      // Clear cart ONLY after successful wallet payment
      cartStore.allVendorIds.value.forEach(vId => cartStore.clearCart(vId));
      navigateTo(`/orders/${orderIds[0]}`);
    } else {
      const data = await initializePayment({
        amount: Math.round(finalTotal.value),
        customer: { name: recipientName.value, email: user.value.email },
        callback_url: `${window.location.origin}/cart${route.query.group ? '?group=' + route.query.group : ''}`,
        metadata: { 
          orderIds, 
          vendorIds: cartStore.allVendorIds.value,
          deliveryOption: deliveryOption.value, 
          recipientName: recipientName.value, 
          recipientPhone: recipientPhone.value, 
          specificAddress: specificAddress.value, 
          isMysteryBox: isMysteryBox.value, 
          isDormDelivery: isDormDelivery.value 
        },
      });
      const authUrl = data?.data?.authorization_url || data?.authorization_url;
      if (authUrl) window.location.href = authUrl;
      else {
        placing.value = false;
        paymentError.value = 'Initialization failed.';
        showToast({ title: 'Error', message: 'Payment gateway unavailable', toastType: 'error' });
      }
    }
  } catch (e: any) { 
    placing.value = false; 
    paymentError.value = 'Checkout failed.'; 
    showToast({ title: 'Error', message: e.message || 'Payment initiation failed', toastType: 'error' });
  }
};

const startTopup = async () => {
  console.log('Initiating topup to dashboard...', topupAmount.value);
  if (!topupAmount.value || Number(topupAmount.value) <= 10) {
    showToast({ title: 'Invalid Amount', message: 'Please enter a valid amount', toastType: 'error' });
    return;
  }
  try {
    const target = `/dashboard/wallet?topup=${topupAmount.value}&redirect=/cart`;
    await router.push(target);
    // Fallback if router fails silently (rare in Nuxt but possible in complex states)
    setTimeout(() => {
       if (window.location.pathname !== '/dashboard/wallet') window.location.href = target;
    }, 500);
  } catch (e) {
    console.error('Redirection failed:', e);
    window.location.href = `/dashboard/wallet?topup=${topupAmount.value}&redirect=/cart`;
  }
};

const preCreateOrders = async (): Promise<string[]> => {
  const createdIds: string[] = [];
  if (groupOrder.value) {
    const vendorId = groupOrder.value.vendor._id;
    for (const participant of groupOrder.value.participants) {
      if (!participant.items.length) continue;
      const vendorMeta = vendorsMetadata.value[vendorId];
      const subtotal = participant.items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0);
      const deliveryFee = deliveryOption.value === 'pickup' ? 0 : (vendorMeta?.deliveryFee ?? 150);
      const res = await createOrder({
        vendorId, customer: participant.user._id, items: participant.items.map((i: any) => ({ product: i.productId, name: i.name, price: i.price, image: i.image, quantity: i.quantity, subtotal: i.price * i.quantity })),
        subtotal, deliveryFee, serviceFee: Math.round(subtotal * 0.05), packagingFee: vendorMeta?.packagingFee ?? 300, total: subtotal + Math.round(subtotal * 0.05) + (vendorMeta?.packagingFee ?? 300) + deliveryFee,
        deliveryOption: deliveryOption.value, recipientName: recipientName.value, recipientPhone: recipientPhone.value, specificAddress: specificAddress.value, deliveryAddress: specificAddress.value, isGroupOrder: true, groupId: activeCode.value, isGroupLeader: participant.user._id === groupOrder.value.host._id,
      });
      if (res?._id || res?.data?._id) createdIds.push(res?._id || res?.data?._id);
    }
  } else {
    for (const vId of [...cartStore.allVendorIds.value]) {
      const stats = cartStore.getVendorStats(vId) as any;
      const vendor = vendorsMetadata.value[vId];
      const deliveryFee = deliveryOption.value === 'pickup' ? 0 : (vendor?.deliveryFee ?? 150);
      const res = await createOrder({
        vendorId: vId, packs: stats.packs.map((p: any, i: number) => ({ packId: p.id, name: p.name || `Pack ${i + 1}`, items: p.items.map((item: any) => ({ product: item.productId, name: item.name, price: item.price, image: item.image, quantity: item.quantity, subtotal: item.subtotal })) })),
        subtotal: stats.subtotal, deliveryFee, serviceFee: stats.serviceFee, packagingFee: vendor?.packagingFee ?? 300, selectedPack: selectedPacks.value[vId] || { name: 'Standard', price: vendor?.packagingFee ?? 300 },
        isMysteryBox: isMysteryBox.value, isDormDelivery: isDormDelivery.value, deliveryOption: deliveryOption.value, recipientName: recipientName.value, recipientPhone: recipientPhone.value, specificAddress: specificAddress.value, deliveryAddress: specificAddress.value, weight: 1.0,
      });
      if (res?._id || res?.data?._id) { 
        createdIds.push(res?._id || res?.data?._id); 
        // We DO NOT clear cart here anymore. We clear on final payment success.
      }
    }
  }
  return createdIds;
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-float { animation: float 6s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-15px) rotate(0); } }
.animate-fade-in { animation: fadeIn 0.4s ease-out both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
