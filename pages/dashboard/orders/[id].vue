<template>
  <div class="bg-white min-h-screen w-full pb-32 animate-fade-in font-sans" v-if="order">
    <!-- Header Section -->
    <div class="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
            <span class="w-2 h-2 rounded-full" :class="order.status === 'delivered' ? 'bg-emerald-500' : 'bg-parentPrimary animate-pulse'"></span>
            <span class="text-xs font-medium text-gray-600 tracking-wide">Order #{{ order._id?.slice(-8) }}</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight capitalize">
            {{ order.status?.replace(/_/g, ' ') }}
          </h1>
          <p class="text-gray-500 text-sm max-w-xl font-medium">We're updating your delivery status in real-time.</p>
        </div>

        <!-- ETA Block -->
        <div v-if="order.status !== 'pending' && order.status !== 'delivered'" class="flex items-center gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100/50 transition-all hover:bg-orange-50">
           <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-orange-100 shadow-sm text-parentPrimary">
             <Clock class="w-5 h-5" />
           </div>
           <div>
             <p class="text-xs font-medium text-orange-600/80 mb-0.5 tracking-wide">Estimated arrival</p>
             <p class="text-xl font-bold text-gray-900 tracking-tight">12-15 <span class="text-sm font-medium text-gray-500">mins</span></p>
           </div>
        </div>
      </div>
    </div>

    <!-- Stepper (Full Width, Open) -->
    <div class="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8">
       <div class="flex items-center justify-between min-w-full gap-4 overflow-x-auto hide-scrollbar pb-2">
          <template v-for="(step, idx) in orderSteps" :key="idx">
            <div class="flex flex-col items-center gap-3 relative z-10 flex-1 min-w-[100px] md:min-w-[120px]">
              <div :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border',
                isStepCompleted(step.status) ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 
                isStepCurrent(step.status) ? 'bg-parentPrimary text-white border-parentPrimary shadow-sm scale-105 ring-4 ring-parentPrimary/10' : 'bg-white text-gray-400 border-gray-200'
              ]">
                <Check v-if="isStepCompleted(step.status)" class="w-5 h-5" />
                <Loader2 v-else-if="isStepCurrent(step.status)" class="w-5 h-5 animate-spin" />
                <span v-else class="text-sm font-medium">{{ idx + 1 }}</span>
              </div>
              <span :class="[
                'text-sm font-medium text-center tracking-wide',
                (isStepCompleted(step.status) || isStepCurrent(step.status)) ? 'text-gray-900' : 'text-gray-400'
              ]">{{ step.label }}</span>
            </div>
            
            <div v-if="idx < orderSteps.length - 1" class="flex-1 h-[2px] w-full hidden md:block rounded-full" :class="isStepCompleted(orderSteps[idx + 1].status) || isStepCurrent(orderSteps[idx + 1].status) ? 'bg-gray-900' : 'bg-gray-100'"></div>
          </template>
       </div>
    </div>

    <!-- Main Content Grid -->
    <div class="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
       
       <!-- Dynamic Left Content (7 columns) -->
       <div class="lg:col-span-7 space-y-8">
           
           <!-- Actionable Cards Grid -->
           <div v-if="order.status !== 'pending' && order.status !== 'awaiting_payment'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Verification Code -->
              <div class="group relative p-8 rounded-[1.5rem] bg-emerald-50/30 border border-emerald-100/50 overflow-hidden transition-all hover:bg-emerald-50/50 flex flex-col justify-between">
                 <div class="absolute right-0 top-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                 <div class="relative z-10">
                   <div class="flex items-center justify-between mb-8">
                      <div class="flex items-center gap-3">
                         <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-600 border border-emerald-100">
                           <ShieldCheck class="w-5 h-5" />
                         </div>
                         <h4 class="text-sm font-medium text-emerald-900/60 tracking-wide">Verification code</h4>
                      </div>
                      <button @click="copyVerificationCode" class="p-2 rounded-lg bg-emerald-100/50 hover:bg-emerald-200/50 text-emerald-700 transition-colors border border-emerald-200/50 active:scale-95" title="Copy Code">
                         <Copy class="w-4 h-4" />
                      </button>
                   </div>
                   <div class="flex items-center justify-center gap-2 mb-8">
                      <div v-for="(digit, idx) in (order.uniqueCode || '0000').split('')" :key="idx" class="flex-1 aspect-square max-w-[3rem] sm:max-w-[3.5rem] rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-xl sm:text-2xl font-bold text-emerald-950 shadow-sm">
                        {{ digit }}
                      </div>
                   </div>
                   <p class="text-sm font-medium text-emerald-700">Present this code to your rider upon delivery.</p>
                 </div>
              </div>

              <!-- Rider Details -->
              <div v-if="order.errander" class="group relative p-8 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 overflow-hidden transition-all hover:bg-gray-50 flex flex-col justify-between">
                 <div class="absolute right-0 top-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                 <div class="relative z-10 flex flex-col h-full justify-between gap-6">
                   <div>
                      <div class="flex items-center gap-3 mb-6">
                         <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-500 border border-gray-200">
                           <Bike class="w-5 h-5" />
                         </div>
                         <h4 class="text-sm font-medium text-gray-500 tracking-wide">Your rider</h4>
                      </div>
                      <div class="flex items-center gap-4">
                         <div class="w-12 h-12 rounded-full bg-gray-200 border border-white shadow-sm overflow-hidden flex items-center justify-center text-gray-500 text-lg font-bold">
                            <img v-if="order.errander.avatar" :src="order.errander.avatar" class="w-full h-full object-cover" />
                            <span v-else>{{ order.errander.firstName?.[0] }}{{ order.errander.lastName?.[0] }}</span>
                         </div>
                         <div>
                            <h3 class="text-base font-bold text-gray-900">{{ order.errander.firstName }} {{ order.errander.lastName }}</h3>
                            <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium mt-1 tracking-wide">
                               <Check class="w-3 h-3" /> Background verified
                            </div>
                         </div>
                      </div>
                   </div>
                   <div class="flex gap-3">
                      <a :href="`tel:${order.errander.phone}`" class="flex-1 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium text-center hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">Call</a>
                      <button @click="openChat(String(order.errander?.user?._id || order.errander?.user || order.errander._id), (order.errander?.user?.firstName || order.errander?.firstName) + ' (Rider)', order.errander?.user?.avatar)" class="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium text-center hover:bg-black transition-colors shadow-sm">Message</button>
                   </div>
                 </div>
              </div>

              <!-- Vendor Details -->
              <div v-if="order.type !== 'custom_errand' && order.vendor" class="group relative p-8 rounded-[1.5rem] bg-orange-50/30 border border-orange-100/50 overflow-hidden transition-all hover:bg-orange-50/50 flex flex-col justify-between">
                 <div class="absolute right-0 top-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                 <div class="relative z-10 flex flex-col h-full justify-between gap-6">
                   <div>
                      <div class="flex items-center gap-3 mb-6">
                         <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-parentPrimary border border-orange-200">
                           <Store class="w-5 h-5" />
                         </div>
                         <h4 class="text-sm font-medium text-gray-500 tracking-wide">The vendor</h4>
                      </div>
                      <div class="flex items-center gap-4">
                         <div class="w-12 h-12 rounded-full bg-white border border-orange-100 shadow-sm overflow-hidden flex items-center justify-center text-gray-500 text-lg font-bold">
                            <video v-if="order.vendor?.logo && order.vendor.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="order.vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                            <img v-else-if="order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
                            <Store v-else class="w-6 h-6 text-gray-300" />
                         </div>
                         <div>
                            <h3 class="text-base font-bold text-gray-900">{{ order.vendor?.storeName || 'Vendor' }}</h3>
                            <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 text-parentPrimary text-xs font-medium mt-1 tracking-wide">
                               <ShieldCheck class="w-3 h-3" /> Verified partner
                            </div>
                         </div>
                      </div>
                   </div>
                   <div class="flex gap-3">
                      <button @click="openChat((order.vendor?.owner?._id || order.vendor?.owner || '') + ',' + (order.vendor?._id || ''), order.vendor?.storeName || 'Vendor', order.vendor?.logo)" class="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium text-center hover:bg-black transition-colors shadow-sm">Message Vendor</button>
                   </div>
                 </div>
              </div>

           </div>

           <!-- PENDING IN-DRIVE NEGOTIATION BLOCK -->
           <div v-if="order.type === 'custom_errand' && order.status === 'pending'" class="p-8 md:p-10 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-5">
                 <Bike class="w-6 h-6 text-gray-400" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 tracking-tight mb-2">Looking for a rider</h3>
              <p class="text-gray-500 font-medium text-sm max-w-lg mb-6">Your errand is broadcasted to available riders nearby. Increase the fee to make your request more attractive.</p>
              
              <div class="w-full max-w-sm flex flex-col sm:flex-row gap-3">
                 <input v-model="formattedNewFee" type="text" @input="handleFeeInput" class="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-parentPrimary focus:ring-2 focus:ring-parentPrimary/10 font-medium text-gray-900 bg-white transition-all text-sm" placeholder="New fee amount" />
                 <button @click="increaseFee" :disabled="isIncreasingFee || newFee <= order.deliveryFee" class="bg-gray-900 text-white font-medium px-5 py-3 rounded-lg hover:bg-black transition-colors disabled:opacity-50 flex-shrink-0 text-sm">
                    {{ isIncreasingFee ? 'Updating...' : 'Update fee' }}
                 </button>
              </div>

              <div v-if="viewersCount > 0" class="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-500 shadow-sm">
                 <Eye class="w-3.5 h-3.5 text-parentPrimary animate-pulse" />
                 {{ viewersCount }} rider{{ viewersCount > 1 ? 's' : '' }} viewing right now
              </div>

              <!-- Bids -->
              <div v-if="pendingBids.length > 0" class="w-full mt-10 pt-8 border-t border-gray-200 text-left">
                 <h4 class="text-sm font-medium text-gray-900 tracking-wide mb-4">Received offers</h4>
                 <div class="space-y-3">
                    <div v-for="bid in pendingBids" :key="bid._id" class="p-3 rounded-xl bg-white border border-gray-200 hover:border-parentPrimary/30 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                       <div class="flex items-center gap-3 w-full sm:w-auto">
                          <div class="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                             <img v-if="bid.errander?.avatar" :src="bid.errander.avatar" class="w-full h-full object-cover" />
                             <User v-else class="w-4 h-4 m-auto mt-2.5 text-gray-400" />
                          </div>
                          <div>
                             <p class="text-sm font-medium text-gray-900">{{ bid.errander?.firstName || 'Rider' }} {{ bid.errander?.lastName || '' }}</p>
                             <p class="text-sm font-medium text-gray-500">Offer: <span class="font-bold text-gray-900">₦{{ bid.amount?.toLocaleString() }}</span></p>
                          </div>
                       </div>
                       <button @click="acceptBid(bid._id)" :disabled="isAcceptingBid === bid._id" class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-parentPrimary text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50">
                          {{ isAcceptingBid === bid._id ? 'Accepting...' : 'Accept offer' }}
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           <!-- AWAITING PAYMENT BLOCK -->
           <div v-if="order.type === 'custom_errand' && order.status === 'awaiting_payment'" class="p-8 md:p-10 rounded-[1.5rem] bg-blue-50/30 border border-blue-100/50 flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center mb-5">
                 <Check class="w-6 h-6 text-blue-500" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 tracking-tight mb-2">Rider accepted</h3>
              <p class="text-gray-500 font-medium text-sm max-w-lg mb-6">Secure the rider by paying the escrow fee. This covers their labor and our convenience fee.</p>
              
              <button @click="payForErrand" :disabled="isInitializingPayment" class="bg-gray-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-3 text-sm">
                 <Zap v-if="!isInitializingPayment" class="w-4 h-4 text-parentPrimary" />
                 {{ isInitializingPayment ? 'Processing...' : 'Pay escrow & open chat' }}
              </button>
           </div>

           <!-- Rider Account Details (Custom Errand) -->
           <div v-if="order.type === 'custom_errand' && order.erranderDetails?.accountNumber" class="p-6 md:p-8 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div class="flex items-center gap-4">
                 <div class="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                    <CreditCard class="w-5 h-5" />
                 </div>
                 <div>
                    <h4 class="font-bold text-gray-900 text-base">Transfer item funds</h4>
                    <p class="text-sm font-medium text-gray-500 max-w-xs mt-0.5">Transfer the money for the items directly to your rider. The rider fee is safely in escrow.</p>
                 </div>
              </div>
              <div class="flex items-center justify-between gap-6 p-4 rounded-xl bg-white border border-gray-200 w-full lg:w-auto shadow-sm">
                 <div>
                    <p class="text-xs font-medium text-gray-500 tracking-wide mb-0.5">{{ order.erranderDetails.bankName }}</p>
                    <p class="text-lg font-bold text-gray-900 tracking-tight">{{ order.erranderDetails.accountNumber }}</p>
                    <p class="text-xs font-medium text-gray-400 tracking-wide mt-0.5">{{ order.erranderDetails.accountName }}</p>
                 </div>
                 <button @click="copyAccountDetails" class="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 transition-colors active:scale-95">
                    <Copy class="w-4 h-4" />
                 </button>
              </div>
           </div>

           <!-- Dual Rating Section -->
           <div v-if="order && order.status === 'DELIVERED' && (!order.hasRatedVendor || !order.hasRatedErrander)" class="p-8 md:p-10 rounded-[1.5rem] bg-gray-900 text-white relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/10 to-transparent"></div>
              <div class="relative z-10">
                 <div class="text-center mb-8">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-parentPrimary text-xs font-medium tracking-wide mb-3">
                       <Sparkles class="w-3.5 h-3.5" /> Earn 20 points
                    </div>
                    <h2 class="text-xl font-bold tracking-tight mb-2">How was your experience?</h2>
                    <p class="text-white/60 text-sm font-medium">Your feedback helps us maintain top quality service.</p>
                 </div>

                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Vendor -->
                    <div v-if="order.type !== 'custom_errand' && !order.hasRatedVendor" class="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                       <div class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                          <Utensils class="w-5 h-5 text-white/40" />
                       </div>
                       <h4 class="font-medium text-base mb-0.5">The meal</h4>
                       <p class="text-xs font-medium text-white/40 tracking-wide mb-4">Rate the vendor</p>
                       
                       <div class="flex gap-1.5 mb-4">
                          <button v-for="i in 5" :key="i" @click="ratingForm.vendorRating = i" class="hover:scale-110 transition-transform focus:outline-none">
                             <Star :class="['w-6 h-6 transition-colors', ratingForm.vendorRating >= i ? 'text-yellow-400 fill-yellow-400' : 'text-white/20']" />
                          </button>
                       </div>
                       <textarea v-model="ratingForm.vendorReview" placeholder="Feedback on the food..." class="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs font-medium placeholder-white/30 focus:outline-none focus:border-parentPrimary resize-none h-20"></textarea>
                    </div>

                    <!-- Rider -->
                    <div v-if="!order.hasRatedErrander" class="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center" :class="{ 'md:col-span-2 max-w-lg mx-auto w-full': order.type === 'custom_errand' || order.hasRatedVendor }">
                       <div class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                          <Bike class="w-5 h-5 text-white/40" />
                       </div>
                       <h4 class="font-medium text-base mb-0.5">The delivery</h4>
                       <p class="text-xs font-medium text-white/40 tracking-wide mb-4">Rate your rider</p>
                       
                       <div class="flex gap-1.5 mb-4">
                          <button v-for="i in 5" :key="i" @click="ratingForm.erranderRating = i" class="hover:scale-110 transition-transform focus:outline-none">
                             <Star :class="['w-6 h-6 transition-colors', ratingForm.erranderRating >= i ? 'text-yellow-400 fill-yellow-400' : 'text-white/20']" />
                          </button>
                       </div>
                       <textarea v-model="ratingForm.erranderReview" placeholder="How was the service?" class="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-xs font-medium placeholder-white/30 focus:outline-none focus:border-parentPrimary resize-none h-20"></textarea>
                    </div>
                 </div>

                 <div class="mt-8 max-w-sm mx-auto">
                    <button @click="submitRatings" :disabled="isSubmittingRating || (!ratingForm.vendorRating && !ratingForm.erranderRating)" class="w-full py-3 rounded-lg bg-parentPrimary text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:bg-gray-600 flex items-center justify-center gap-2">
                       <Loader2 v-if="isSubmittingRating" class="w-4 h-4 animate-spin" />
                       {{ isSubmittingRating ? 'Submitting...' : 'Submit ratings' }}
                    </button>
                 </div>
              </div>
           </div>

       </div>

       <!-- Right Sidebar (5 columns, providing ample space for wider cards) -->
       <div class="lg:col-span-5 space-y-8">
          
          <!-- Delivery Address Box -->
          <div class="p-8 md:p-10 rounded-[1.5rem] bg-gray-900 text-white relative overflow-hidden shadow-xl shadow-gray-900/10">
             <div class="absolute right-0 bottom-0 w-48 h-48 bg-parentPrimary/20 rounded-full blur-3xl -mr-10 -mb-10"></div>
             <div class="relative z-10">
                <div class="flex items-center gap-3 mb-6">
                   <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 text-white backdrop-blur-sm">
                     <MapPin class="w-5 h-5" />
                   </div>
                   <h4 class="text-sm font-medium text-white/60 tracking-wide">Delivery address</h4>
                </div>
                <h3 class="text-xl md:text-2xl font-medium leading-relaxed tracking-tight">{{ order.deliveryAddress || 'Campus Residency' }}</h3>
                <div class="mt-8 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 backdrop-blur-sm">
                   <div class="w-2.5 h-2.5 rounded-full bg-parentPrimary animate-pulse shadow-[0_0_10px_rgba(255,92,26,0.8)]"></div>
                   <span class="text-sm font-medium text-white/90 tracking-wide">Live tracking active</span>
                </div>
             </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div v-if="order.type !== 'custom_errand'" class="p-8 md:p-10 rounded-[1.5rem] bg-gray-50/60 border border-gray-100">
             <h4 class="text-sm font-medium text-gray-900 mb-6 tracking-wide">Receipt summary</h4>
             
             <div class="space-y-6">
               <div v-for="item in order.items" :key="item._id" class="flex items-center justify-between gap-4">
                 <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                     <img :src="item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'" class="w-full h-full object-cover" />
                   </div>
                   <div>
                     <h5 class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.name }}</h5>
                     <p class="text-sm text-gray-500 font-medium mt-0.5">Qty: {{ item.quantity }}</p>
                   </div>
                 </div>
                 <p class="text-sm font-bold text-gray-900 shrink-0">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
               </div>
             </div>

             <div class="mt-8 pt-6 border-t border-gray-200 border-dashed space-y-4">
               <div class="flex justify-between text-sm">
                 <span class="text-gray-500 font-medium">Subtotal</span>
                 <span class="text-gray-900 font-bold">₦{{ order.subtotal?.toLocaleString() }}</span>
               </div>
               <div class="flex justify-between text-sm">
                 <span class="text-gray-500 font-medium">Fees & delivery</span>
                 <span class="text-gray-900 font-bold">₦{{ (order.total - order.subtotal)?.toLocaleString() }}</span>
               </div>
             </div>
             
             <div class="mt-6 p-5 rounded-xl bg-gray-900 text-white flex justify-between items-center shadow-md shadow-gray-900/10">
               <span class="text-sm font-medium text-white/80 tracking-wide">Grand total</span>
               <span class="text-2xl font-bold tracking-tight">₦{{ order.total?.toLocaleString() }}</span>
             </div>
          </div>
          
          <!-- Errand Instructions Sidebar -->
          <div v-if="order.type === 'custom_errand'" class="p-8 md:p-10 rounded-[1.5rem] bg-gray-50/60 border border-gray-100">
             <h4 class="text-sm font-medium text-gray-900 mb-6 tracking-wide">Errand details</h4>
             <div class="space-y-6 text-sm">
               <div class="p-5 bg-white rounded-xl border border-gray-200 text-gray-700 leading-relaxed font-medium shadow-sm">
                 {{ order.description || 'No description provided.' }}
               </div>
               <div class="flex justify-between items-center pt-2">
                 <span class="text-gray-500 font-medium">Urgency</span>
                 <span class="text-gray-900 font-bold capitalize">{{ order.urgency || 'standard' }}</span>
               </div>
               <div v-if="order.estimatedItemCost" class="flex justify-between items-center">
                 <span class="text-gray-500 font-medium">Est. item cost</span>
                 <span class="text-gray-900 font-bold">₦{{ order.estimatedItemCost?.toLocaleString() }}</span>
               </div>
               <div class="flex justify-between items-center">
                 <span class="text-gray-500 font-medium">Rider fee</span>
                 <span class="text-gray-900 font-bold">₦{{ order.deliveryFee?.toLocaleString() }}</span>
               </div>
             </div>
             <div class="mt-6 p-5 rounded-xl bg-gray-900 text-white flex justify-between items-center shadow-md shadow-gray-900/10">
               <span class="text-sm font-medium text-white/80 tracking-wide">Total escrow</span>
               <span class="text-2xl font-bold tracking-tight">₦{{ order.total?.toLocaleString() }}</span>
             </div>
          </div>

          <NuxtLink to="/support" class="flex items-center justify-between p-6 rounded-[1.5rem] bg-white border border-gray-200 hover:border-gray-300 transition-colors group shadow-sm">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors group-hover:bg-parentPrimary/5 border border-gray-100">
                  <LifeBuoy class="w-6 h-6" />
                </div>
                <div>
                   <h4 class="text-sm font-medium text-gray-900">Need help?</h4>
                   <p class="text-sm font-medium text-gray-500 mt-0.5">Contact support</p>
                </div>
             </div>
             <ArrowRight class="w-5 h-5 text-gray-300 group-hover:text-parentPrimary transition-colors group-hover:translate-x-1" />
          </NuxtLink>
       </div>
    </div>

  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4">
    <div class="relative">
       <div class="w-16 h-16 border-[3px] border-gray-100 border-t-parentPrimary rounded-full animate-spin"></div>
       <Zap class="w-5 h-5 text-parentPrimary absolute inset-0 m-auto animate-pulse" />
    </div>
    <div class="text-center">
       <h3 class="font-medium text-gray-900 text-base mb-1">Loading order</h3>
       <p class="text-sm font-medium text-gray-500">Syncing live data...</p>
    </div>
  </div>

  <!-- OrderChat Drawer -->
  <OrderChat
    v-if="order"
    :is-open="isChatOpen"
    :receiver-id="chatReceiverId"
    :receiver-name="chatReceiverName"
    :receiver-avatar="chatReceiverAvatar"
    @close="isChatOpen = false"
    :current-user-id="user?._id || ''"
    :order-id="order._id"
  />
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
  Copy,
  Store
} from 'lucide-vue-next';
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
import { useRoute, useRouter, useHead } from '#imports';
import OrderChat from '@/components/core/OrderChat.vue';
import { orders_api } from '@/api_factory/modules/orders';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { usePayments } from '@/composables/modules/payments';
import { useUser } from '@/composables/modules/auth/user';
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'student'
})

// Chat state
const isChatOpen = ref(false);
const chatReceiverId = ref<string>('');
const chatReceiverName = ref('');
const chatReceiverAvatar = ref('');

const openChat = (receiverId: string | undefined, name: string, avatar?: string) => {
   if (!receiverId) return;
   chatReceiverId.value = receiverId;
   chatReceiverName.value = name;
   chatReceiverAvatar.value = avatar || '';
   isChatOpen.value = true;
};

const checkAutoOpenChat = () => {
  if (route.query.openChat && order.value) {
    const targetId = route.query.openChat as string;
    
    // Check if it's the vendor
    if (order.value.vendor && (targetId === order.value.vendor.owner || targetId === order.value.vendor._id || targetId === 'vendor')) {
      openChat((order.value.vendor?.owner?._id || order.value.vendor?.owner || '') + ',' + (order.value.vendor?._id || ''), order.value.vendor.storeName || 'Vendor', order.value.vendor.logo);
    } 
    // Check if it's the rider
    else if (order.value.errander && (targetId === order.value.errander._id || targetId === order.value.errander.user?._id || targetId === 'errander')) {
      openChat(order.value.errander?.user?._id || order.value.errander?.user || order.value.errander._id, order.value.errander.firstName + ' (Rider)', order.value.errander.avatar || order.value.errander.user?.avatar);
    }
    
    // Clean up query param so it doesn't reopen if they refresh
    router.replace({ query: { ...route.query, openChat: undefined } });
  }
};

const route = useRoute();
const router = useRouter();
const order = ref<any>(null);
const { showToast } = useCustomToast();
const { initializePayment } = usePayments();
const { user } = useUser();
const isSubmittingRating = ref(false);
const newFee = ref(0);
const formattedNewFee = ref('');

const handleFeeInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const rawValue = target.value.replace(/[^\d]/g, '');
  const numericValue = parseInt(rawValue, 10);
  
  if (isNaN(numericValue)) {
    newFee.value = 0;
    formattedNewFee.value = '';
  } else {
    newFee.value = numericValue;
    formattedNewFee.value = numericValue.toLocaleString('en-US');
  }
};
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

const fetchOrder = async () => {
    const res = await orders_api.getOrder(route.params.id as string);
    order.value = res.data;
    if (order.value.type === 'custom_errand') {
        if (order.value.deliveryFee) {
            newFee.value = order.value.deliveryFee + 100;
            formattedNewFee.value = newFee.value.toLocaleString('en-US');
        }
    }
}

onMounted(async () => {
  try {
    await fetchOrder();
    checkAutoOpenChat();

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

    // Socket listeners will be handled by watch
  } catch (e) {
    console.error(e);
  }
});

let currentSocket: any = null;

watch(() => socket.value, (newSocket) => {
  if (currentSocket) {
    currentSocket.off('errand:viewers_update');
    currentSocket.off('notification:new');
  }
  
  if (newSocket) {
    currentSocket = newSocket;
    
    newSocket.on('errand:viewers_update', (data: any) => {
      if (data.orderId === route.params.id) {
        viewersCount.value = data.viewersCount;
      }
    });
    
    newSocket.on('notification:new', async (payload: any) => {
      const { type, data, title, body } = payload;
      if (type === 'ORDER_BIDS_UPDATE' || type === 'ORDER_ACCEPTED' || type === 'ORDER_STATUS_UPDATE') {
        if (data?.orderId === route.params.id || data?.order?._id === route.params.id) {
           showToast({ title: title || 'New Update', message: body || 'Your order has been updated.', toastType: 'info' });
           const res = await orders_api.getOrder(route.params.id as string);
           order.value = res.data;
        }
      }
    });

    const refreshOrder = async (payload: any) => {
      const orderId = payload?.orderId || payload?.order?._id || payload?.data?.orderId;
      if (orderId === route.params.id) {
         const res = await orders_api.getOrder(route.params.id as string);
         order.value = res.data;
      }
    };

    newSocket.on('notification:order-status-update', refreshOrder);
    newSocket.on('notification:order-accepted', refreshOrder);
  }
}, { immediate: true });

onUnmounted(() => {
  if (currentSocket) {
    currentSocket.off('errand:viewers_update');
    currentSocket.off('notification:new');
    currentSocket.off('notification:order-status-update');
    currentSocket.off('notification:order-accepted');
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

const copyVerificationCode = () => {
  if (!order.value?.uniqueCode) return;
  navigator.clipboard.writeText(order.value.uniqueCode);
  showToast({ title: 'Copied!', message: 'Verification code copied to clipboard.', toastType: 'success' });
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
