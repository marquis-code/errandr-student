<template>
  <div class="min-h-screen bg-white selection:bg-parentPrimary/10 selection:text-parentPrimary font-sans">

    <!-- ===== EMPTY STATE ===== -->
    <div v-if="cartStore.isEmpty.value" class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-50">
        <div class="max-w-5xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
          <NuxtLink to="/" class="flex items-center gap-2.5 group">
            <!-- <div class="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-parentPrimary transition-all">
              <ShoppingBag class="w-4 h-4" />
            </div>
            <span class="text-lg font-bold text-gray-900 tracking-tighter">Errandr</span> -->
            <img src="@/assets/img/logo-light.png" class="w-32" />
          </NuxtLink>
        </div>
      </header>

      <div class="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto text-center">
        <div class="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-5xl mb-8 animate-float">🛒</div>
        <h2 class="text-3xl font-medium text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
        <p class="text-sm font-medium text-gray-400 mb-8 leading-relaxed">Discover your favorite campus meals and start building your order.</p>
        <NuxtLink to="/vendors" class="px-8 py-4 bg-gray-900 text-white rounded-2xl font-medium text-xs tracking-wider hover:bg-parentPrimary transition-all active:scale-95 flex items-center gap-2 shadow-lg">
          <ShoppingBag class="w-4 h-4" /> Browse Vendors
        </NuxtLink>
      </div>

      <!-- Campus Favorites -->
      <div class="max-w-5xl mx-auto w-full px-4 md:px-6 pb-12">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900 tracking-tight">Campus Favorites 🔥</h3>
          <NuxtLink to="/vendors" class="text-xs font-medium text-parentPrimary hover:underline px-3 py-1.5 rounded-lg bg-parentPrimary/5">See all</NuxtLink>
        </div>
        <div v-if="loadingVendors" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="h-48 bg-gray-50 rounded-2xl animate-pulse"></div>
        </div>
        <div v-else-if="popularVendors.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="vendor in popularVendors.slice(0, 6)"
            :key="vendor._id"
            :to="`/vendors/${vendor._id}`"
            class="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all group hover:-translate-y-0.5 hover:shadow-md block"
          >
            <div class="h-28 w-full bg-gray-50 relative overflow-hidden">
              <img :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                <Star class="w-3 h-3 text-amber-500 fill-current" />
                <span class="text-[10px] font-medium text-gray-900">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
              </div>
            </div>
            <div class="p-4 flex items-center justify-between gap-3">
              <div class="min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate tracking-tight">{{ vendor.storeName }}</h4>
                <p class="text-[10px] font-bold text-gray-400 mt-0.5">{{ vendor.preparationTime || 20 }} min · {{ vendor.category }}</p>
              </div>
              <div class="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-parentPrimary group-hover:text-white transition-colors shrink-0">
                <ArrowRight class="w-3.5 h-3.5" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ===== ACTIVE CART + CHECKOUT ===== -->
    <div v-else class="min-h-screen flex flex-col">
      
      <!-- Sticky Header -->
      <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-50">
        <div class="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          <div class="flex items-center gap-3">
            <button @click="goBack" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">
              <ArrowLeft class="w-4 h-4 text-gray-900" />
            </button>
            <div>
              <h1 class="text-base font-medium text-gray-900 tracking-tight leading-none">Checkout</h1>
              <p class="text-[10px] font-bold text-gray-400 mt-0.5">{{ cartStore.itemCount }} items</p>
            </div>
          </div>
          <button 
            @click="showOrderBreakdown = true"
            class="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 hover:bg-gray-100 transition-all lg:hidden active:scale-95"
          >
            <ShoppingCart class="w-3.5 h-3.5" />
            Review
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <div class="flex-1 max-w-[1200px] mx-auto w-full px-4 md:px-6 py-6 pb-40 lg:pb-10">
        <div class="flex flex-col lg:flex-row gap-6">

          <!-- LEFT: Delivery + Payment -->
          <div class="flex-1 space-y-5">
            
            <!-- Split Bill Payment Progress -->
            <div v-if="groupOrder && groupOrder.status === 'locked' && groupOrder.splitType === 'split_bill'" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div class="flex items-center gap-3 px-5 py-4 bg-indigo-50/50 border-b border-indigo-100">
                <div class="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Users class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900 tracking-tight">Payment Progress</h3>
                  <p class="text-[10px] font-bold text-gray-400">Waiting for everyone to pay their share</p>
                </div>
              </div>
              <div class="p-4 space-y-2">
                <div v-for="p in groupOrder.participants" :key="p.user?._id || p.user" class="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      <img v-if="p.user?.avatar" :src="p.user.avatar" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">{{ p.user?.firstName?.[0] || 'G' }}</div>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-900 leading-none mb-1">{{ p.user?.firstName || 'Guest' }} {{ p.user?.lastName || '' }}</p>
                      <p class="text-[10px] font-bold text-gray-400">₦{{ p.total?.toLocaleString() }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div v-if="p.hasPaid" class="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
                      <CheckCircle class="w-3.5 h-3.5" />
                      <span class="text-[10px] font-bold">Paid</span>
                    </div>
                    <div v-else class="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                      <Loader2 class="w-3.5 h-3.5 animate-spin" />
                      <span class="text-[10px] font-bold">Waiting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 1: Delivery Details -->
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div class="flex items-center gap-3 px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                <div class="w-8 h-8 bg-parentPrimary/10 rounded-xl flex items-center justify-center text-parentPrimary">
                  <MapPin class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900 tracking-tight">Delivery Details</h3>
                  <p class="text-[10px] font-bold text-gray-400">Where should we drop it?</p>
                </div>
              </div>
              <div class="p-5 space-y-4">
                <AnimatedInput v-model="recipientName" label="Full Name" placeholder="e.g. Ebuka Chima" />
                <AnimatedInput v-model="recipientPhone" label="Phone Number" placeholder="081 2345 6789" type="tel" />
                <SelectInput v-model="deliveryOption" label="Delivery Policy" :options="[{label: 'Use an Errander (₦150)', value: 'use_an_errander'}, {label: 'I\'ll pick it up myself', value: 'pickup'}]" />
                
                <div v-if="deliveryOption === 'use_an_errander'" class="animate-fade-in">
                  <label class="text-[10px] font-medium text-gray-400 tracking-wider block mb-2 pl-1">Hostel / Campus Location</label>
                  <textarea
                    v-model="specificAddress"
                    rows="2"
                    placeholder="e.g. Moremi Hall, Room 302, Unilag"
                    class="w-full bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Step 1.5: Pre-order Schedule -->
            <div v-if="isPreOrderCart" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in">
              <div class="flex items-center gap-3 px-5 py-4 bg-purple-50/50 border-b border-purple-100">
                <div class="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <Calendar class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900 tracking-tight">Delivery Schedule</h3>
                  <p class="text-[10px] font-bold text-gray-400">When do you want this pre-order?</p>
                </div>
              </div>
              <div class="p-5">
                <label class="text-[10px] font-medium text-gray-400 tracking-wider block mb-2 pl-1">Select Delivery Date</label>
                <input 
                  v-model="scheduledDate"
                  type="date"
                  :min="minPreOrderDate"
                  class="w-full bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all"
                />
                <div class="mt-3 text-[10px] font-bold text-gray-400 space-y-1">
                  <p>• Requires a minimum of {{ maxLeadTime }} hours notice.</p>
                  <p v-if="allowedDays && allowedDays.length > 0">• Deliveries available only on: {{ allowedDays.join(', ') }}</p>
                </div>
              </div>
            </div>

            <!-- Add-ons -->
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div class="flex items-center gap-3 px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                <div class="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                  <span class="text-base">✨</span>
                </div>
                <h3 class="text-sm font-medium text-gray-900 tracking-tight">Extras</h3>
              </div>
              <div class="p-4 space-y-1">
                <label class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">🎁</span>
                    <div>
                      <p class="text-xs font-medium text-gray-900 leading-none mb-0.5">Mystery Box</p>
                      <p class="text-[10px] font-bold text-gray-400">Random item for ₦800</p>
                    </div>
                  </div>
                  <input type="checkbox" v-model="isMysteryBox" class="w-5 h-5 accent-parentPrimary cursor-pointer rounded">
                </label>
                <label class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">🏢</span>
                    <div>
                      <p class="text-xs font-medium text-gray-900 leading-none mb-0.5">Dorm Delivery</p>
                      <p class="text-[10px] font-bold text-gray-400">Split fee with neighbors</p>
                    </div>
                  </div>
                  <input type="checkbox" v-model="isDormDelivery" class="w-5 h-5 accent-emerald-500 cursor-pointer rounded">
                </label>
              </div>
            </div>

            <!-- Step 2: Payment -->
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div class="flex items-center gap-3 px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                <div class="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <CreditCard class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900 tracking-tight">Payment Method</h3>
                  <p class="text-[10px] font-bold text-gray-400">Choose how to pay</p>
                </div>
              </div>
              <div class="p-4">
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="paymentMethod = 'card'"
                    :class="paymentMethod === 'card' ? 'border-parentPrimary bg-parentPrimary/5 ring-1 ring-parentPrimary/30' : 'border-gray-100 hover:border-gray-200 bg-white'"
                    class="p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-full active:scale-[0.98]"
                  >
                    <div class="w-10 h-8 flex items-center overflow-hidden">
                      <img src="~/assets/img/paystack.png" class="h-5 object-contain" alt="Paystack" />
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-900 leading-none mb-0.5">Pay with Card</p>
                      <p class="text-[9px] font-bold text-gray-400">Instant & Secure</p>
                    </div>
                  </button>

                  <button 
                    @click="paymentMethod = 'wallet'"
                    :class="paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/30' : 'border-gray-100 hover:border-gray-200 bg-white'"
                    class="p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-full active:scale-[0.98]"
                  >
                    <div class="flex items-center justify-between w-full mb-2">
                      <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                        <Wallet :class="paymentMethod === 'wallet' ? 'text-emerald-500' : 'text-gray-300'" class="w-4 h-4 transition-colors" />
                      </div>
                      <button @click.stop="fetchWallet" class="p-1 hover:bg-emerald-100 rounded-md transition-colors">
                        <RefreshCw :class="loadingPayment ? 'animate-spin' : ''" class="w-3 h-3 text-emerald-500" />
                      </button>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-900 leading-none mb-0.5">My Wallet</p>
                      <p :class="balance < finalTotal ? 'text-rose-500' : 'text-emerald-600'" class="text-xs font-medium">
                        ₦{{ (balance || 0).toLocaleString() }}
                      </p>
                    </div>
                  </button>
                </div>

                <!-- Insufficient Funds -->
                <div v-if="paymentMethod === 'wallet' && balance < finalTotal" class="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-fade-in text-center">
                  <p class="text-xs font-bold text-rose-500 mb-3">Your balance is too low for this order</p>
                  <div class="flex flex-col gap-2">
                    <input 
                      v-model="topupAmount"
                      type="number"
                      placeholder="Amount to add"
                      class="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-sm font-medium text-gray-900 outline-none focus:border-parentPrimary transition-all placeholder:text-gray-300"
                    />
                    <button 
                      @click="startTopup"
                      :disabled="loadingPayment || topupAmount <= 0"
                      class="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-parentPrimary transition-all disabled:opacity-50"
                    >
                      {{ loadingPayment ? 'Initializing...' : 'Top-up with Paystack' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop: Order Items -->
            <div class="hidden lg:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                    <ShoppingCart class="w-4 h-4" />
                  </div>
                  <h3 class="text-sm font-medium text-gray-900 tracking-tight">Order Items</h3>
                </div>
                <button @click="goBack" class="text-[10px] font-medium text-parentPrimary hover:underline">Edit Items</button>
              </div>
              <div class="p-5 space-y-6">
                <div v-for="vendorId in cartStore.allVendorIds.value" :key="vendorId" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 bg-parentPrimary/10 rounded-xl flex items-center justify-center">
                        <ShoppingBag class="w-4 h-4 text-parentPrimary" />
                      </div>
                      <div>
                        <h4 class="text-xs font-medium text-gray-900 tracking-tight">{{ toTitleCase(vendorsMetadata[vendorId]?.storeName || 'Loading...') }}</h4>
                        <p class="text-[10px] font-bold text-gray-400">{{ cartStore.getVendorStats(vendorId).itemCount }} items</p>
                      </div>
                    </div>
                    <button @click="cartStore.clearCart(vendorId)" class="p-1.5 text-gray-300 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                  <div v-for="(pack, pIndex) in cartStore.getVendorStats(vendorId).packs" :key="pack.id" class="pl-4 border-l-2 border-gray-50 space-y-3">
                    <span class="text-[9px] font-medium bg-gray-900 text-white px-2.5 py-1 rounded-md">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                    <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                        <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h5 class="text-xs font-medium text-gray-900 truncate">{{ toTitleCase(item.name) }}</h5>
                        <p class="text-xs font-bold text-parentPrimary">₦{{ item.price?.toLocaleString() }} <span class="text-gray-400">×{{ item.quantity }}</span></p>
                      </div>
                      <span class="text-xs font-medium text-gray-900">₦{{ (item.price * item.quantity).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Order Summary Sidebar -->
          <div class="hidden lg:block w-[340px] shrink-0">
            <div class="sticky top-[65px] space-y-5">
              <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div class="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                  <h3 class="text-xs font-medium text-gray-900 tracking-tight">Order Summary</h3>
                </div>
                <div class="p-5 space-y-3">
                  <div class="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span class="text-gray-900 font-medium">₦{{ (groupOrder ? groupSubtotal : cartStore.subtotal.value)?.toLocaleString() }}</span>
                  </div>
                  <div v-if="computedTotalDeliveryFee > 0" class="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>Delivery</span>
                    <span class="text-gray-900 font-medium">₦{{ computedTotalDeliveryFee.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>Fees & Packaging</span>
                    <span class="text-gray-900 font-medium">₦{{ (computedTotalPackagingFee + computedTotalServiceFee).toLocaleString() }}</span>
                  </div>
                  <div v-if="computedPaystackFee > 0" class="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>Processing Fee</span>
                    <span class="text-gray-900 font-medium">₦{{ computedPaystackFee.toLocaleString() }}</span>
                  </div>
                </div>
                <div class="px-5 pb-5 pt-3 border-t border-dashed border-gray-100 space-y-5">
                  <div class="flex justify-between items-end">
                    <div>
                      <p class="text-[10px] font-medium text-gray-400 tracking-wider mb-1">Total</p>
                      <h3 class="text-2xl font-medium text-gray-900 tracking-tighter">₦{{ finalTotal.toLocaleString() }}</h3>
                    </div>
                    <span class="text-[9px] font-bold text-gray-300 text-right leading-relaxed">Secure Gateway<br/>Ready</span>
                  </div>
                  <button 
                    v-if="canCheckout"
                    @click="startPayment"
                    :disabled="placing || (paymentMethod === 'wallet' && balance < finalTotal)"
                    class="w-full py-4 bg-parentPrimary text-white rounded-2xl text-xs font-medium tracking-wider hover:bg-parentPrimary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-xl shadow-parentPrimary/20 active:scale-[0.98]"
                  >
                    <Loader2 v-if="placing" class="w-4 h-4 animate-spin" />
                    <span>{{ placing ? 'Processing...' : 'Complete Checkout' }}</span>
                    <ArrowRight v-if="!placing" class="w-4 h-4" />
                  </button>
                  <div v-else class="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl text-xs font-medium tracking-wider text-center">
                    {{ groupOrder?.status === 'open' ? 'Waiting for host to checkout' : (getMyStatus?.hasPaid ? 'You have paid' : 'Waiting for Sponsor to pay') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MOBILE FLOATING CHECKOUT BAR ===== -->
      <div class="fixed bottom-6 left-4 right-4 z-40 lg:hidden">
        <div class="bg-gray-900 rounded-2xl px-5 py-4 text-white flex items-center justify-between shadow-2xl shadow-black/30">
          <div>
            <p class="text-[9px] font-bold text-white/40 tracking-wider mb-0.5">Total</p>
            <h3 class="text-xl font-medium text-white tracking-tighter leading-none">₦{{ finalTotal.toLocaleString() }}</h3>
          </div>
          <button 
            v-if="canCheckout"
            @click="startPayment"
            :disabled="placing || (paymentMethod === 'wallet' && balance < finalTotal)"
            class="px-6 py-3.5 bg-parentPrimary text-white rounded-xl text-xs font-medium tracking-wider hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2 shadow-lg shadow-parentPrimary/30"
          >
            <div v-if="placing" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span v-else>Pay Now</span>
            <ArrowRight v-if="!placing" class="w-3.5 h-3.5" />
          </button>
          <div v-else class="px-6 py-3.5 bg-gray-100 text-gray-500 rounded-xl text-xs font-medium tracking-wider text-center flex items-center justify-center">
            {{ groupOrder?.status === 'open' ? 'Waiting for Host' : (getMyStatus?.hasPaid ? 'Paid' : 'Waiting for Sponsor') }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MOBILE DRAWER: Review Items ===== -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showOrderBreakdown" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden" @click="showOrderBreakdown = false"></div>
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="showOrderBreakdown" class="fixed inset-x-0 bottom-0 z-[101] bg-white rounded-t-[2rem] max-h-[85vh] overflow-hidden flex flex-col lg:hidden shadow-2xl">
          <div class="sticky top-0 bg-white pt-3 pb-2 px-5 border-b border-gray-50 z-10 rounded-t-[2rem]">
            <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-gray-900 tracking-tight">Review Items</h2>
                <p class="text-[10px] font-bold text-gray-400">Check your packs & quantities</p>
              </div>
              <button @click="showOrderBreakdown = false" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-8 scrollbar-hide">
            <div v-for="vendorId in cartStore.allVendorIds.value" :key="'mb-' + vendorId" class="space-y-4">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 bg-parentPrimary/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag class="w-3.5 h-3.5 text-parentPrimary" />
                </div>
                <h4 class="text-xs font-medium text-gray-900">{{ toTitleCase(vendorsMetadata[vendorId]?.storeName || '') }}</h4>
              </div>
              
              <div v-for="(pack, pIndex) in cartStore.getVendorStats(vendorId).packs" :key="'mb-pack-' + pack.id" class="pl-3 border-l-2 border-gray-50 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-medium bg-gray-900 text-white px-2.5 py-1 rounded-md">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                  <button @click="cartStore.removePack(vendorId, pack.id)" class="text-[10px] font-medium text-rose-400 hover:text-rose-500">Remove</button>
                </div>
                <div v-for="(item, iIndex) in pack.items" :key="'mb-item-'+iIndex" class="flex items-center gap-3">
                  <div class="w-11 h-11 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                    <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="text-xs font-medium text-gray-900 truncate">{{ toTitleCase(item.name) }}</h5>
                    <p class="text-xs font-bold text-parentPrimary">₦{{ item.price?.toLocaleString() }}</p>
                  </div>
                  <div class="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0">
                    <button @click="cartStore.updateItemQuantity(vendorId, pack.id, iIndex, item.quantity - 1)" class="w-7 h-7 rounded-md bg-white text-gray-500 flex items-center justify-center text-sm font-bold shadow-sm hover:text-rose-500">−</button>
                    <span class="text-xs font-medium min-w-[16px] text-center">{{ item.quantity }}</span>
                    <button @click="cartStore.updateItemQuantity(vendorId, pack.id, iIndex, item.quantity + 1)" class="w-7 h-7 rounded-md bg-white text-gray-500 flex items-center justify-center text-sm font-bold shadow-sm hover:text-parentPrimary">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-5 py-4 border-t border-gray-100 bg-white">
            <button @click="showOrderBreakdown = false" class="w-full py-3.5 bg-gray-900 text-white rounded-2xl text-xs font-medium tracking-wider active:scale-[0.98] transition-transform">
              Done Reviewing
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Top-up Wallet Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showTopupModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showTopupModal = false">
          <div class="bg-white rounded-[2rem] w-full max-w-sm p-8 text-center animate-zoom-in">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <Wallet class="w-7 h-7" />
            </div>
            <h2 class="text-xl font-medium text-gray-900 mb-2 tracking-tight">Fund Wallet</h2>
            <p class="text-xs font-medium text-gray-400 mb-6">Enter the amount to add. You'll be redirected to Paystack.</p>
            <div class="space-y-4">
              <div class="text-left">
                <p class="text-[10px] font-medium text-gray-400 tracking-wider mb-2 pl-1">Amount (NGN)</p>
                <input 
                  v-model="topupAmount" 
                  type="number"
                  placeholder="e.g. 5000"
                  class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/20 rounded-xl text-sm font-medium text-gray-900 outline-none transition-all"
                />
              </div>
              <button 
                @click="startTopup" 
                :disabled="loadingPayment || topupAmount <= 0"
                class="w-full py-4 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Loader2 v-if="loadingPayment" class="w-4 h-4 animate-spin" />
                <span>Fund Wallet Now</span>
              </button>
            </div>
            <button @click="showTopupModal = false" class="mt-5 text-xs font-medium text-gray-300 hover:text-gray-900 transition-colors">Maybe Later</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Split Mode Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSplitModeModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showSplitModeModal = false">
          <div class="bg-white rounded-[2rem] w-full max-w-md p-8 animate-zoom-in">
            <h2 class="text-xl font-medium text-gray-900 mb-2 tracking-tight text-center">How would you like to pay?</h2>
            <p class="text-xs font-medium text-gray-400 mb-6 text-center">Decide who is paying for the group order.</p>
            <div class="space-y-4">
              <label 
                class="flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer"
                :class="splitGroupType === 'split_bill' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 hover:border-gray-200'"
              >
                <input type="radio" v-model="splitGroupType" value="split_bill" class="hidden" />
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-gray-900 mb-1">Split the Bill</h4>
                  <p class="text-xs text-gray-500 font-medium">Everyone pays for their own items. The order completes when all participants pay.</p>
                </div>
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4" :class="splitGroupType === 'split_bill' ? 'border-parentPrimary' : 'border-gray-200'">
                  <div v-if="splitGroupType === 'split_bill'" class="w-3 h-3 bg-parentPrimary rounded-full"></div>
                </div>
              </label>

              <label 
                class="flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer"
                :class="splitGroupType === 'sponsor' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 hover:border-gray-200'"
              >
                <input type="radio" v-model="splitGroupType" value="sponsor" class="hidden" />
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-gray-900 mb-1">I'm Sponsoring</h4>
                  <p class="text-xs text-gray-500 font-medium">You will pay the full amount for everyone in the group order.</p>
                </div>
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4" :class="splitGroupType === 'sponsor' ? 'border-parentPrimary' : 'border-gray-200'">
                  <div v-if="splitGroupType === 'sponsor'" class="w-3 h-3 bg-parentPrimary rounded-full"></div>
                </div>
              </label>
            </div>
            
            <button 
              @click="submitSplitMode"
              :disabled="placing"
              class="w-full py-4 mt-6 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-parentPrimary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="placing" class="w-4 h-4 animate-spin" />
              <span>Confirm & Lock Order</span>
            </button>
            <button @click="showSplitModeModal = false" class="w-full mt-4 text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors text-center">Cancel</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Placing Order Loader -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="placing" class="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 text-white">
          <div class="w-20 h-20 mb-8 relative">
            <div class="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-t-parentPrimary rounded-full animate-spin"></div>
          </div>
          <h2 class="text-2xl font-medium mb-2 tracking-tight">Finalizing order...</h2>
          <p class="text-white/40 font-bold text-xs">Redirecting to payment...</p>
        </div>
      </Transition>
    </Teleport>

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
  CreditCard, Wallet, Heart, RefreshCw, Calendar, CheckCircle
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
const { groupOrder, activeCode, fetchGroupOrder, isHost, isSponsor, getMyStatus, initiateCheckout, checkout: submitGroupCheckout } = useGroupOrder();
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
const showSplitModeModal = ref(false);
const splitGroupType = ref('split_bill');
const selectedPacks = ref<Record<string, any>>({});
const isMysteryBox = ref(false);
const isDormDelivery = ref(false);
const scheduledDate = ref('');

const isPreOrderCart = computed(() => {
  return cartStore.allVendorIds.value.some(id => vendorsMetadata.value[id]?.preOrderOnly);
});

const maxLeadTime = computed(() => {
  let max = 0;
  cartStore.allVendorIds.value.forEach(id => {
    const time = vendorsMetadata.value[id]?.preOrderLeadTime || 0;
    if (time > max) max = time;
  });
  return max;
});

const minPreOrderDate = computed(() => {
  const date = new Date();
  date.setHours(date.getHours() + maxLeadTime.value);
  return date.toISOString().split('T')[0];
});

const allowedDays = computed(() => {
  let days: string[] | null = null;
  cartStore.allVendorIds.value.forEach(id => {
    const vDays = vendorsMetadata.value[id]?.preOrderDays || [];
    if (vDays.length > 0) {
      if (days === null) days = [...vDays];
      else days = days.filter(d => vDays.includes(d));
    }
  });
  return days;
});

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
};

const currentSubtotal = computed(() => {
  if (groupOrder.value && groupOrder.value.status === 'locked' && groupOrder.value.splitType === 'split_bill') {
    const base = getMyStatus.value?.items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0) || 0;
    return isMysteryBox.value ? base + 800 : base;
  }
  const base = groupOrder.value ? groupSubtotal.value : cartStore.subtotal.value;
  return isMysteryBox.value ? base + 800 : base;
});

const canCheckout = computed(() => {
  if (!groupOrder.value) return true;
  if (groupOrder.value.status === 'open') return isHost.value;
  if (groupOrder.value.status === 'locked') {
    if (groupOrder.value.splitType === 'sponsor') return isSponsor.value;
    if (groupOrder.value.splitType === 'split_bill') {
      const myStatus = getMyStatus.value;
      if (!myStatus) return false;
      return !myStatus.hasPaid;
    }
  }
  return false;
});


const computedTotalDeliveryFee = computed(() => {
  if (deliveryOption.value === 'pickup') return 0;
  let total = 0;
  cartStore.allVendorIds.value.forEach(vId => {
    total += vendorsMetadata.value[vId]?.deliveryFee ?? 150;
  });
  if (groupOrder.value && groupOrder.value.status === 'locked' && groupOrder.value.splitType === 'split_bill') {
     const activeParticipants = groupOrder.value.participants.filter((p: any) => p.items.length > 0).length || 1;
     total = total / activeParticipants;
  }
  return isDormDelivery.value ? Math.round(total * 0.5) : Math.round(total);
});

const computedTotalPackagingFee = computed(() => {
  let total = 0;
  cartStore.allVendorIds.value.forEach(vId => {
    const selected = selectedPacks.value[vId];
    total += selected ? selected.price : (vendorsMetadata.value[vId]?.packagingFee ?? 300);
  });
  if (groupOrder.value && groupOrder.value.status === 'locked' && groupOrder.value.splitType === 'split_bill') {
     const activeParticipants = groupOrder.value.participants.filter((p: any) => p.items.length > 0).length || 1;
     total = total / activeParticipants;
  }
  return Math.round(total);
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
    placing.value = true;
    try {
      const res = await verifyPayment(route.query.reference as string);
      const data = res?.data || res;
      if (data?.metadata?.type === 'wallet_topup' || data?.data?.metadata?.type === 'wallet_topup') {
        showToast({ title: 'Wallet funded!', message: 'Your balance has been updated.', toastType: 'success' });
        await fetchWallet();
        paymentMethod.value = 'wallet';
        placing.value = false;
        const url = new URL(window.location.href);
        url.searchParams.delete('reference');
        window.history.replaceState({}, '', url.toString());
        return;
      }

      if (data?.status === 'success' || (data as any)?.status === 'success') {
        if (data?.metadata?.isGroupCheckout || data?.data?.metadata?.isGroupCheckout) {
           await submitGroupCheckout(route.query.reference as string);
           showToast({ title: 'Payment Successful', message: 'Group Order updated!', toastType: 'success' });
           placing.value = false;
           // If the order becomes completed, the socket will push us to the final screen, 
           // but we can also just clear the query param.
           const url = new URL(window.location.href);
           url.searchParams.delete('reference');
           window.history.replaceState({}, '', url.toString());
           return;
        }

        const orderIds = data?.metadata?.orderIds || [];
        if (data?.metadata?.vendorIds) {
           data.metadata.vendorIds.forEach((vId: string) => cartStore.clearCart(vId));
        } else {
           cartStore.clearCart();
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
    scheduledDate.value = data.scheduledDate || '';
  } else if (user.value) {
    recipientName.value = `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim();
    recipientPhone.value = user.value.phone || '';
  }
});

watch([recipientName, recipientPhone, specificAddress, deliveryOption, isMysteryBox, isDormDelivery, paymentMethod, scheduledDate], ([name, phone, address, delivery, mystery, dorm, method, date]) => {
  localStorage.setItem('errandr_checkout_data', JSON.stringify({ name, phone, address, delivery, mystery, dorm, paymentMethod: method, scheduledDate: date }));
});

const submitSplitMode = async () => {
  showSplitModeModal.value = false;
  try {
    placing.value = true;
    await initiateCheckout(splitGroupType.value);
    showToast({ title: 'Order Locked!', message: 'Group order is now ready for payment.', toastType: 'success' });
    // If sponsor, they can just pay now. Otherwise everyone gets notified.
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Failed to lock group order', toastType: 'error' });
  } finally {
    placing.value = false;
  }
};

const startPayment = async () => {
  paymentError.value = '';
  if (!recipientName.value.trim() || !recipientPhone.value.trim()) return showToast({ title: 'Missing Info', message: 'Name and phone required', toastType: 'error' });
  if (deliveryOption.value === 'use_an_errander' && !specificAddress.value.trim()) return showToast({ title: 'Missing Info', message: 'Address required', toastType: 'error' });
  if (!user.value?.email) return (showAuthModal.value = true);

  if (isPreOrderCart.value) {
    if (!scheduledDate.value) {
      return showToast({ title: 'Schedule Required', message: 'Please select a delivery date for your pre-order.', toastType: 'error' });
    }
    if (allowedDays.value && allowedDays.value.length > 0) {
      const dayOfWeek = new Date(scheduledDate.value).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (!allowedDays.value.includes(dayOfWeek)) {
        return showToast({ title: 'Invalid Schedule', message: `Delivery is only available on: ${allowedDays.value.join(', ')}`, toastType: 'error' });
      }
    }
  }

  if (groupOrder.value) {
     if (groupOrder.value.status === 'open') {
        if (!isHost.value) return showToast({ title: 'Error', message: 'Only the host can checkout.', toastType: 'error' });
        showSplitModeModal.value = true;
        return;
     }
     if (groupOrder.value.status === 'locked') {
        if (groupOrder.value.splitType === 'sponsor' && !isSponsor.value) {
           return showToast({ title: 'Wait', message: 'The sponsor is paying for this order.', toastType: 'info' });
        }
        if (groupOrder.value.splitType === 'split_bill' && getMyStatus.value?.hasPaid) {
           return showToast({ title: 'Already Paid', message: 'You have already paid your share.', toastType: 'info' });
        }
     }
  }

  if (paymentMethod.value === 'wallet' && balance.value < finalTotal.value) {
    showTopupModal.value = true;
    topupAmount.value = Math.ceil(finalTotal.value - balance.value);
    return;
  }

  placing.value = true;
  try {
    let orderIds: string[] = [];
    if (!groupOrder.value) {
       orderIds = await preCreateOrders();
       if (!orderIds || orderIds.length === 0) throw new Error('Failed to create order');
    }

    if (paymentMethod.value === 'wallet') {
      if (groupOrder.value) {
         await submitGroupCheckout('WALLET_PAYMENT');
         showToast({ title: 'Success', message: 'Group Order payment successful!', toastType: 'success' });
      } else {
         for (const orderId of orderIds) await payWithWallet(orderId);
         showToast({ title: 'Success', message: 'Order placed using wallet!', toastType: 'success' });
         cartStore.allVendorIds.value.forEach(vId => cartStore.clearCart(vId));
         navigateTo(`/orders/${orderIds[0]}`);
      }
    } else {
      const amount = Math.round(finalTotal.value);
      const metadata = groupOrder.value 
         ? { isGroupCheckout: true, activeCode: activeCode.value, deliveryOption: deliveryOption.value, recipientName: recipientName.value, recipientPhone: recipientPhone.value, specificAddress: specificAddress.value }
         : { orderIds, vendorIds: cartStore.allVendorIds.value, deliveryOption: deliveryOption.value, recipientName: recipientName.value, recipientPhone: recipientPhone.value, specificAddress: specificAddress.value, isMysteryBox: isMysteryBox.value, isDormDelivery: isDormDelivery.value, isPreOrder: isPreOrderCart.value, scheduledDate: scheduledDate.value };
         
      const data = await initializePayment({
        amount,
        customer: { name: recipientName.value, email: user.value.email },
        callback_url: `${window.location.origin}/cart${route.query.group ? '?group=' + route.query.group : ''}`,
        metadata,
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
        isPreOrder: isPreOrderCart.value, scheduledDate: scheduledDate.value
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
        isPreOrder: isPreOrderCart.value, scheduledDate: scheduledDate.value
      });
      if (res?._id || res?.data?._id) { 
        createdIds.push(res?._id || res?.data?._id); 
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
.animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
