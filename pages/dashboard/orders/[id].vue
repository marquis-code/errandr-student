<template>
  <div class="space-y-6 md:space-y-8 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary" v-if="order">
    <!-- Header -->
    <div class="bg-gray-900 rounded-none sm:rounded-[2rem] p-5 sm:p-6 lg:p-10 relative overflow-hidden group border-0 sm:border border-white/5 mx-0 sm:mx-4 mt-0 sm:mt-4 shadow-none sm:shadow-xl">
      <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold mx-auto md:mx-0 tracking-wider">
            order id: {{ order._id?.slice(-8).toUpperCase() }}
          </div>
          <h1 class="text-2xl md:text-3xl font-medium text-white tracking-tight leading-tight">
            order <span class="text-parentPrimary capitalize">{{ order.status?.replace(/_/g, ' ')?.toLowerCase() }}</span>
          </h1>
          <p class="text-white/60 text-sm md:text-sm font-medium leading-relaxed max-w-sm mx-auto md:mx-0">We're making sure your delivery arrives safely and on time.</p>
        </div>
        
        <div class="flex items-center justify-center gap-4 bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/10 group-hover:scale-105 transition-all duration-500 max-w-xs mx-auto md:mx-0">
          <div class="w-12 h-12 md:w-14 md:h-14 bg-parentPrimary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-parentPrimary/30">
            <Clock class="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div class="text-left">
            <p class="text-[10px] font-bold text-white/50 mb-0.5 tracking-wider">estimated time</p>
            <p class="text-lg md:text-xl font-medium text-white tracking-tight leading-none">12-15 mins</p>
          </div>
        </div>
      </div>
    </div>

    <!-- PENDING IN-DRIVE NEGOTIATION BLOCK -->
    <div v-if="order.type === 'custom_errand' && order.status === 'pending'" class="px-0 sm:px-4">
      <div class="bg-orange-50 border border-orange-100 rounded-none sm:rounded-[2rem] p-6 text-center shadow-none sm:shadow-sm">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-orange-100">
           <Bike class="w-8 h-8 text-parentPrimary animate-bounce" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Waiting for a Rider...</h3>
        <p class="text-sm text-gray-600 mb-6">Your errand has been broadcasted. If it takes too long, you can increase the runner fee to attract more riders.</p>
        
        <div class="max-w-xs mx-auto flex gap-3">
          <input v-model.number="newFee" type="number" class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-parentPrimary font-bold text-gray-900" placeholder="New fee" />
          <button @click="increaseFee" :disabled="isIncreasingFee || newFee <= order.deliveryFee" class="bg-parentPrimary text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50">
            {{ isIncreasingFee ? 'Updating...' : 'Update' }}
          </button>
        </div>

        <div v-if="viewersCount > 0" class="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-orange-600 animate-pulse bg-orange-100/50 py-2 rounded-xl">
          <Eye class="w-4 h-4" />
          {{ viewersCount }} rider{{ viewersCount > 1 ? 's are' : ' is' }} currently viewing this request
        </div>

        <!-- INCOMING BIDS (IN-DRIVE) -->
        <div v-if="pendingBids.length > 0" class="mt-8 text-left">
          <h4 class="text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase">Incoming Offers</h4>
          <div class="space-y-3">
            <div v-for="bid in pendingBids" :key="bid._id" class="bg-white border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                  <img v-if="bid.errander?.avatar" :src="bid.errander.avatar" class="w-full h-full object-cover" />
                  <User v-else class="w-full h-full p-2 text-gray-400" />
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">{{ bid.errander?.firstName || 'Rider' }} {{ bid.errander?.lastName || '' }}</p>
                  <p class="text-xs font-medium text-gray-500">Proposes: <span class="font-bold text-parentPrimary">₦{{ bid.amount?.toLocaleString() }}</span></p>
                </div>
              </div>
              <button 
                @click="acceptBid(bid._id)" 
                :disabled="isAcceptingBid === bid._id"
                class="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-parentPrimary transition-colors disabled:opacity-50"
              >
                {{ isAcceptingBid === bid._id ? 'Accepting...' : 'Accept Offer' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- AWAITING PAYMENT BLOCK -->
    <div v-if="order.type === 'custom_errand' && order.status === 'awaiting_payment'" class="px-0 sm:px-4">
      <div class="bg-blue-50 border border-blue-100 rounded-none sm:rounded-[2rem] p-6 text-center shadow-none sm:shadow-sm">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
           <Check class="w-8 h-8 text-blue-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">A Rider Accepted!</h3>
        <p class="text-sm text-gray-600 mb-6">Pay the Escrow Fee (Labor ₦{{order.deliveryFee}} + Convenience ₦50) to lock them in.</p>
        
        <button @click="payForErrand" :disabled="isInitializingPayment" class="bg-gray-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto">
          {{ isInitializingPayment ? 'Redirecting to Payment...' : 'Pay Escrow & Open Chat' }}
        </button>
      </div>
    </div>

    <!-- Tracking Stepper -->
    <div class="px-0 sm:px-4">
      <div class="bg-white p-5 sm:p-8 rounded-none sm:rounded-[2rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm relative overflow-hidden group">
        <h4 class="text-xs font-bold text-gray-400 mb-8 tracking-wider">order status</h4>
        <div class="relative pl-2">
          <!-- Connecting Line -->
          <div class="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
          
          <div class="space-y-8">
            <div v-for="(step, idx) in orderSteps" :key="idx" class="relative flex items-start gap-4">
              <div :class="[
                'w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all mt-0.5 bg-white',
                isStepCompleted(step.status) ? 'border-parentPrimary text-parentPrimary' : 
                (isStepCurrent(step.status) ? 'border-parentPrimary text-parentPrimary' : 'border-gray-200 text-transparent')
              ]">
                <Check v-if="isStepCompleted(step.status)" class="w-3.5 h-3.5" />
                <div v-else-if="isStepCurrent(step.status)" class="w-2 h-2 rounded-full bg-parentPrimary animate-pulse"></div>
              </div>
              <div class="flex-1">
                <p :class="['text-sm font-bold', (isStepCompleted(step.status) || isStepCurrent(step.status)) ? 'text-gray-900' : 'text-gray-400']">{{ step.label }}</p>
                <p class="text-xs font-medium text-gray-400 mt-1">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Map Placeholder -->
    <div v-if="order.status !== 'pending'" class="px-0 sm:px-4">
      <div class="bg-gray-50 h-48 md:h-64 rounded-none sm:rounded-[2rem] border-0 sm:border-8 border-white relative overflow-hidden group shadow-none sm:shadow-sm">
        <div class="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1,0/1200x600?access_token=token')] bg-cover bg-center grayscale opacity-30" />
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-center p-4 md:p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 ">
            <Navigation class="w-6 h-6 md:w-8 md:h-8 text-parentPrimary animate-bounce" />
            <p class="text-sm md:text-sm font-bold text-gray-900">map tracking active</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification, Delivery Errandr, ETA Card -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-0 sm:px-4">
      <!-- Verification -->
      <div v-if="order.status !== 'pending'" class="bg-white p-5 sm:p-8 rounded-none sm:rounded-[2rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm relative overflow-hidden group transition-all duration-300">
        <div class="absolute -right-5 -top-5 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-parentPrimary/10 transition-colors" />
        <h4 class="text-xs font-bold text-gray-400 mb-6 tracking-wider">verification code</h4>
        <div class="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <div v-for="(digit, idx) in (order.uniqueCode || '0000').split('')" :key="idx" class="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl font-medium text-gray-900 border border-gray-100 group-hover:bg-white group-hover:border-parentPrimary/30 transition-all">
            {{ digit }}
          </div>
        </div>
        <p class="text-xs font-bold text-gray-400 mt-6 leading-relaxed text-center sm:text-left">Show this code to your Errandr to confirm delivery.</p>
      </div>

      <!-- Delivery Errandr -->
      <div v-if="order.errander" class="bg-white p-5 sm:p-8 rounded-none sm:rounded-[2rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm flex flex-col items-center text-center group transition-all duration-300">
        <div class="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 text-white text-xl font-medium group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 uppercase">
          {{ order.errander.firstName?.[0] }}{{ order.errander.lastName?.[0] }}
        </div>
        <div class="space-y-1 mb-6 w-full">
          <p class="text-xs font-bold text-gray-400 tracking-wider">your Errandr</p>
          <h3 class="font-medium text-gray-900 text-lg tracking-tight">{{ order.errander.firstName }} {{ order.errander.lastName }}</h3>
          <p class="text-xs text-parentPrimary font-bold mt-2 bg-parentPrimary/5 px-3 py-1.5 rounded-full inline-block">{{ order.errander.phone }}</p>

          <!-- Account Details for Custom Errands -->
          <div v-if="order.type === 'custom_errand' && order.erranderDetails?.accountNumber" class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
            <p class="text-[10px] font-bold text-gray-400 tracking-wider mb-2">RIDER ACCOUNT DETAILS</p>
            <div class="flex items-center justify-between gap-2">
              <div>
                <p class="text-sm font-bold text-gray-900">{{ order.erranderDetails.bankName }}</p>
                <p class="text-lg font-bold text-parentPrimary tracking-tight">{{ order.erranderDetails.accountNumber }}</p>
                <p class="text-xs font-medium text-gray-500 uppercase">{{ order.erranderDetails.accountName }}</p>
              </div>
              <button 
                @click="copyAccountDetails" 
                class="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-parentPrimary hover:border-parentPrimary/30 transition-all active:scale-95 shrink-0"
              >
                <Copy class="w-4 h-4" />
              </button>
            </div>
            <p class="text-[10px] font-medium text-gray-400 mt-3 leading-tight">Transfer funds to your rider to purchase your requested items. The rider fee has already been escrowed.</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <NuxtLink v-if="order.type === 'custom_errand'" :to="`/chat/${order._id}`" class="w-full py-4 bg-parentPrimary text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all active:scale-95 text-center tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-parentPrimary/20">
            <MessageSquare class="w-5 h-5" /> Open Live Chat with Rider
          </NuxtLink>
          <div class="flex gap-2 w-full">
            <a :href="`tel:${order.errander.phone}`" class="flex-1 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-parentPrimary transition-all active:scale-95 text-center tracking-wider">call</a>
            <NuxtLink v-if="order.type !== 'custom_errand'" :to="`/chat/${order._id}`" class="flex-1 py-3 bg-white border border-gray-100 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all active:scale-95 text-center tracking-wider">chat</NuxtLink>
          </div>
        </div>
      </div>

      <!-- ETA Card -->
      <div class="bg-parentPrimary p-5 sm:p-8 rounded-none sm:rounded-[2rem] text-white overflow-hidden relative group transition-all duration-300 shadow-none sm:shadow-sm">
        <div class="absolute -top-4 -right-4 p-8 transform rotate-12 group-hover:rotate-0 transition-transform duration-700 opacity-20 hidden md:block">
          <Bike class="w-24 h-24" />
        </div>
        <div class="relative z-10 space-y-4">
          <div class="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
            <MapPin class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="text-xs font-bold mb-1 text-white/70 tracking-wider">delivering to</p>
            <h3 class="text-lg font-bold tracking-tight leading-tight line-clamp-2">{{ order.deliveryAddress || 'Campus Residency' }}</h3>
          </div>
          <div class="pt-4 border-t border-white/10">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span class="text-xs font-bold tracking-wider">tracking live</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dual Rating Section -->
    <section v-if="order && order.status === 'DELIVERED' && (!order.hasRatedVendor || !order.hasRatedErrander)" class="max-w-4xl mx-auto px-0 sm:px-4 mt-8 slide-up">
      <div class="bg-gray-900 rounded-none sm:rounded-[2.5rem] p-5 sm:p-12 text-white relative overflow-hidden group border-0 sm:border border-white/5 shadow-none sm:shadow-xl">
        <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/20 via-transparent to-transparent opacity-50 transition-opacity duration-1000" />
        
        <div class="relative z-10 text-center mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-parentPrimary text-sm font-medium tracking-wider mb-4">
            <Sparkles class="w-3.5 h-3.5" /> earn 20 points
          </div>
          <h2 class="text-3xl md:text-4xl font-medium tracking-tighter mb-2">how was your errand?</h2>
          <p class="text-white/50 text-sm font-medium">{{ order.type === 'custom_errand' ? 'Rate your Errandr to help us improve.' : 'Rate the meal and your Errandr to help us improve.' }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <!-- Vendor Rating -->
          <div v-if="order.type !== 'custom_errand' && !order.hasRatedVendor" class="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 space-y-6 flex flex-col items-center">
            <div class="text-center">
              <Utensils class="w-8 h-8 text-parentPrimary mx-auto mb-3" />
              <h4 class="font-medium text-lg tracking-tight">the meal</h4>
              <p class="text-xs font-bold text-white/40 tracking-wider">rate the vendor</p>
            </div>
            
            <div class="flex justify-center gap-2">
              <button v-for="i in 5" :key="i" @click="ratingForm.vendorRating = i" class="transition-all duration-300 hover:scale-125">
                <Star :class="['w-8 h-8', ratingForm.vendorRating >= i ? 'text-parentPrimary fill-parentPrimary' : 'text-white/10']" />
              </button>
            </div>
            
            <textarea v-model="ratingForm.vendorReview" placeholder="Any feedback on the food?" class="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-parentPrimary outline-none min-h-[100px] transition-all" />
          </div>

          <!-- Errander Rating -->
          <div v-if="!order.hasRatedErrander" class="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 space-y-6 flex flex-col items-center">
            <div class="text-center">
              <Bike class="w-8 h-8 text-parentPrimary mx-auto mb-3" />
              <h4 class="font-medium text-lg tracking-tight">the delivery</h4>
              <p class="text-xs font-bold text-white/40 tracking-wider">rate your Errandr</p>
            </div>
            
            <div class="flex justify-center gap-2">
              <button v-for="i in 5" :key="i" @click="ratingForm.erranderRating = i" class="transition-all duration-300 hover:scale-125">
                <Star :class="['w-8 h-8', ratingForm.erranderRating >= i ? 'text-parentPrimary fill-parentPrimary' : 'text-white/10']" />
              </button>
            </div>
            
            <textarea v-model="ratingForm.erranderReview" placeholder="How was the service?" class="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-parentPrimary outline-none min-h-[100px] transition-all" />
          </div>
        </div>

        <div class="mt-10 relative z-10 w-full max-w-sm mx-auto">
          <button 
            @click="submitRatings"
            :disabled="isSubmittingRating || (!ratingForm.vendorRating && !ratingForm.erranderRating)"
            class="w-full py-5 bg-parentPrimary text-white rounded-[2rem] font-medium text-sm tracking-wider disabled:opacity-50 disabled:grayscale transition-all active:scale-95 group/btn shadow-lg shadow-parentPrimary/20"
          >
            <span class="flex items-center justify-center gap-2">
              {{ isSubmittingRating ? 'saving feedback...' : 'submit ratings' }}
              <Zap v-if="!isSubmittingRating" class="w-4 h-4 group-hover/btn:animate-pulse" />
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Order Items (Marketplace only) -->
    <section v-if="order.type !== 'custom_errand'" class="max-w-4xl mx-auto px-0 sm:px-4 mt-8">
      <div class="bg-white p-5 sm:p-8 rounded-none sm:rounded-[2rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm relative overflow-hidden">
        <h4 class="text-xs font-bold text-gray-400 mb-8 tracking-wider">order summary</h4>

        <div class="space-y-6">
          <div v-for="item in order.items" :key="item._id" class="flex items-center gap-4 group/item">
            <div class="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-50 flex-shrink-0 relative overflow-hidden border border-gray-100">
              <img :src="item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
            </div>
            <div class="flex-1 min-w-0 pr-2">
              <h5 class="text-sm font-bold text-gray-900 tracking-tight mb-1 truncate">{{ item.name }}</h5>
              <p class="text-xs font-bold text-gray-400">qty: {{ item.quantity }} × ₦{{ item.price?.toLocaleString() }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-medium text-gray-900 tracking-tight">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-50 space-y-4">
            <div class="flex justify-between text-xs font-bold text-gray-400 tracking-wider">
              <span>subtotal</span>
              <span class="text-gray-900 font-medium">₦{{ order.subtotal?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-xs font-bold text-gray-400 tracking-wider">
              <span>fees & delivery</span>
              <span class="text-gray-900 font-medium">₦{{ (order.total - order.subtotal)?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center pt-6 border-t border-gray-50 mt-2">
              <span class="text-xs font-medium text-gray-900 tracking-widest uppercase">grand total</span>
              <span class="text-2xl font-medium text-parentPrimary tracking-tighter">₦{{ order.total?.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Errand Details (Custom Errand only) -->
    <section v-if="order.type === 'custom_errand'" class="max-w-4xl mx-auto px-0 sm:px-4 mt-8">
      <div class="bg-white p-5 sm:p-8 rounded-none sm:rounded-[2rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm relative overflow-hidden">
        <h4 class="text-xs font-bold text-gray-400 mb-8 tracking-wider">errand instructions</h4>

        <div class="space-y-6">
          <div class="p-6 bg-orange-50 rounded-2xl border border-orange-100">
            <h5 class="text-sm font-bold text-gray-900 tracking-tight mb-2">What you requested:</h5>
            <p class="text-sm font-medium text-gray-700 leading-relaxed">{{ order.description || 'No description provided.' }}</p>
          </div>

          <div class="pt-6 border-t border-gray-50 space-y-4">
            <div class="flex justify-between text-xs font-bold text-gray-400 tracking-wider">
              <span>urgency</span>
              <span class="text-gray-900 font-medium capitalize">{{ order.urgency || 'standard' }}</span>
            </div>
            <div v-if="order.estimatedItemCost" class="flex justify-between text-xs font-bold text-gray-400 tracking-wider">
              <span>estimated item cost</span>
              <span class="text-gray-900 font-medium">₦{{ order.estimatedItemCost?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-xs font-bold text-gray-400 tracking-wider">
              <span>agreed rider fee</span>
              <span class="text-gray-900 font-medium">₦{{ order.deliveryFee?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center pt-6 border-t border-gray-50 mt-2">
              <span class="text-xs font-medium text-gray-900 tracking-widest uppercase">total escrow paid</span>
              <span class="text-2xl font-medium text-parentPrimary tracking-tighter">₦{{ order.total?.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support -->
    <div class="max-w-4xl mx-auto px-0 sm:px-4 pb-12">
      <NuxtLink 
        to="/support"
        class="w-full py-5 bg-gray-50 rounded-none sm:rounded-[2rem] border-0 sm:border border-gray-100 flex flex-row items-center justify-center gap-3 group hover:bg-gray-100 transition-all duration-300 active:scale-95 shadow-none sm:shadow-sm block text-center"
      >
        <div class="inline-flex items-center justify-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <span class="text-xs font-medium text-gray-400 tracking-wider group-hover:text-gray-900 transition-colors">need help? support</span>
        </div>
      </NuxtLink>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
    <div class="relative">
      <div class="w-24 h-24 border-4 border-parentPrimary/10 border-t-parentPrimary rounded-full animate-spin" />
      <Zap class="absolute inset-0 m-auto w-8 h-8 text-parentPrimary animate-pulse" />
    </div>
    <div class="text-center">
      <h3 class="text-lg font-medium text-gray-900 tracking-tighter uppercase mb-2">fetching order</h3>
      <p class="text-xs font-medium text-gray-300 tracking-wider animate-pulse">syncing...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ShieldCheck,
  Star,
  Sparkles,
  Utensils,
  Clock, 
  MapPin, 
  Bike, 
  Navigation, 
  Check,
  Zap,
  Eye,
  User,
  MessageSquare,
  Copy
} from 'lucide-vue-next';
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
import { useRoute, useHead } from '#imports';
import { orders_api } from '@/api_factory/modules/orders';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { usePayments } from '@/composables/modules/payments';
import { useUser } from '@/composables/modules/auth/user';
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'student'
})

const route = useRoute();
const order = ref<any>(null);
const { showToast } = useCustomToast();
const { initializePayment } = usePayments();
const { user } = useUser();
const isSubmittingRating = ref(false);
const newFee = ref(0);
const isIncreasingFee = ref(false);
const isInitializingPayment = ref(false);
const viewersCount = ref(0);
const isAcceptingBid = ref<string | null>(null);

const pendingBids = computed(() => {
  if (!order.value?.bids) return [];
  return order.value.bids.filter((b: any) => b.status === 'pending');
});
const { socket } = useRealtimeSocket();

const ratingForm = reactive({
  vendorRating: 0,
  vendorReview: '',
  erranderRating: 0,
  erranderReview: ''
});

onMounted(async () => {
  try {
    const res = await orders_api.getOrder(route.params.id as string);
    order.value = res.data;
    if (order.value.deliveryFee) newFee.value = order.value.deliveryFee + 100;

    if (route.query.reference && order.value.type === 'custom_errand' && order.value.status === 'awaiting_payment') {
       await api.post(`/orders/${order.value._id}/custom/pay`, { paymentReference: route.query.reference });
       showToast({ title: 'Payment Successful', message: 'Chat is now open!', toastType: 'success' });
       // reload
       const res2 = await orders_api.getOrder(route.params.id as string);
       order.value = res2.data;
       const url = new URL(window.location.href);
       url.searchParams.delete('reference');
       window.history.replaceState({}, '', url.toString());
    }

    if (socket.value) {
      socket.value.on('errand:viewers_update', (data: any) => {
        if (data.orderId === route.params.id) {
          viewersCount.value = data.viewersCount;
        }
      });
      socket.value.on('notification:new', async (payload: any) => {
        const { type, data } = payload;
        if (type === 'ORDER_BIDS_UPDATE' || type === 'ORDER_ACCEPTED' || type === 'ORDER_STATUS_UPDATE') {
          if (data?.orderId === route.params.id || data?.order?._id === route.params.id) {
             const res = await orders_api.getOrder(route.params.id as string);
             order.value = res.data;
          }
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('errand:viewers_update');
    socket.value.off('notification:new');
  }
});

const increaseFee = async () => {
  if (newFee.value <= order.value.deliveryFee) return;
  isIncreasingFee.value = true;
  try {
     await api.put(`/orders/${order.value._id}/custom/fee`, { newFee: newFee.value });
     showToast({ title: 'Success', message: 'Fee updated successfully', toastType: 'success' });
     const res = await orders_api.getOrder(route.params.id as string);
     order.value = res.data;
  } catch (e: any) {
     showToast({ title: 'Error', message: e.response?.data?.message || 'Could not update fee', toastType: 'error' });
  } finally {
     isIncreasingFee.value = false;
  }
};

const acceptBid = async (bidId: string) => {
  isAcceptingBid.value = bidId;
  try {
    const res = await api.put(`/orders/${order.value._id}/custom/bid/${bidId}/accept`);
    showToast({ title: 'Success', message: 'Counter-offer accepted! Please complete payment.', toastType: 'success' });
    const freshOrder = await orders_api.getOrder(route.params.id as string);
    order.value = freshOrder.data;
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not accept bid', toastType: 'error' });
  } finally {
    isAcceptingBid.value = null;
  }
};

const payForErrand = async () => {
  isInitializingPayment.value = true;
  try {
     const amount = order.value.deliveryFee + 50;
     const data = await initializePayment({
        amount,
        customer: { name: user.value?.firstName || 'Student', email: user.value?.email || 'student@erranders.com' },
        callback_url: `${window.location.origin}/dashboard/orders/${order.value._id}`,
        metadata: { isCustomErrand: true, orderId: order.value._id }
     });
     const authUrl = data?.data?.authorization_url || data?.authorization_url;
     if (authUrl) window.location.href = authUrl;
     else showToast({ title: 'Error', message: 'Payment gateway unavailable', toastType: 'error' });
  } catch(e) {
     showToast({ title: 'Error', message: 'Could not initialize payment', toastType: 'error' });
  } finally {
     isInitializingPayment.value = false;
  }
};

const submitRatings = async () => {
  isSubmittingRating.value = true;
  try {
    await orders_api.rateOrder(order.value._id, ratingForm);
    showToast({
      title: "Feedback Saved! 🎉",
      message: "You've earned 20 points! Thank you for helping us improve campus deliveries.",
      toastType: "success"
    });
    // Refresh order data
    const res = await orders_api.getOrder(route.params.id as string);
    order.value = res.data;
  } catch (e) {
    showToast({
      title: "Rating Failed",
      message: "We couldn't save your feedback. Please try again later.",
      toastType: "error"
    });
  } finally {
    isSubmittingRating.value = false;
  }
};

const copyAccountDetails = () => {
  if (!order.value?.erranderDetails) return;
  const { bankName, accountNumber, accountName } = order.value.erranderDetails;
  const text = `${bankName}\n${accountNumber}\n${accountName}`;
  navigator.clipboard.writeText(text);
  showToast({ title: 'Copied!', message: 'Account details copied to clipboard.', toastType: 'success' });
};

// Order Tracking Stepper Logic
const ALL_STEPS = [
  { status: 'pending', label: 'Order Placed', description: 'Your order has been placed' },
  { status: 'confirmed', label: 'Confirmed', description: 'Vendor has confirmed your order' },
  { status: 'preparing', label: 'Preparing', description: 'Vendor is preparing your items' },
  { status: 'ready_for_pickup', label: 'Ready for Pickup', description: 'Items are ready for errander' },
  { status: 'picked_up', label: 'Picked Up', description: 'Errander picked up your items' },
  { status: 'in_transit', label: 'In Transit', description: 'Errander is on the way' },
  { status: 'delivered', label: 'Delivered', description: 'Order completed successfully' }
];

const CUSTOM_ERRAND_STEPS = [
  { status: 'pending', label: 'Errand Broadcasted', description: 'Waiting for riders to respond' },
  { status: 'awaiting_payment', label: 'Rider Negotiated', description: 'Waiting for escrow payment' },
  { status: 'confirmed', label: 'In Progress', description: 'Rider is currently running your errand' },
  { status: 'in_transit', label: 'Heading to you', description: 'Rider is on their way with the items' },
  { status: 'delivered', label: 'Delivered', description: 'Errand completed successfully' }
];

const orderSteps = computed(() => {
  if (order.value?.type === 'custom_errand') {
    return CUSTOM_ERRAND_STEPS;
  }
  return ALL_STEPS;
});

const getStatusIndex = (status: string) => orderSteps.value.findIndex(s => s.status === status);

const isStepCompleted = (stepStatus: string) => {
  if (!order.value?.status) return false;
  const currentIdx = getStatusIndex(order.value.status);
  const stepIdx = getStatusIndex(stepStatus);
  return stepIdx < currentIdx;
};

const isStepCurrent = (stepStatus: string) => {
  if (!order.value?.status) return false;
  return stepStatus === order.value.status;
};

useHead({ title: 'Order Details - Errandr' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
