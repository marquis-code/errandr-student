<template>
  <div class="min-h-screen w-full bg-white pb-24 font-sans" v-if="order">
    <div class="w-full max-w-7xl mx-auto px-4 md:px-4 pt-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div class="inline-flex items-center gap-1.5 mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A] animate-pulse"></span>
            <span class="text-[11px] font-bold tracking-widest uppercase text-[#FF5C1A]">Order #{{ order._id?.slice(-8) }}</span>
          </div>
          <h1 class="text-xl font-bold text-gray-900 tracking-tight capitalize leading-none">
            {{ order.status?.replace(/_/g, ' ') }}
          </h1>
          <p class="text-gray-400 text-xs mt-1">We're updating your delivery status in real-time.</p>
        </div>

        <div v-if="order.status !== 'pending' && order.status !== 'delivered'" class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FF5C1A] text-white self-start sm:self-auto">
           <Clock class="w-5 h-5 text-white/80" />
           <div>
             <p class="text-[9px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1">Est. Arrival</p>
             <p class="text-base font-bold tracking-tight leading-none">12-15 <span class="text-[10px] font-medium">mins</span></p>
           </div>
        </div>
      </div>

      <!-- Stepper -->
      <div class="border border-gray-100 rounded-2xl p-4 mb-6">
        <div class="flex items-center justify-between min-w-full gap-2 overflow-x-auto hide-scrollbar">
           <template v-for="(step, idx) in orderSteps" :key="idx">
             <div class="flex flex-col items-center gap-2 relative z-10 flex-1 min-w-[86px]">
               <div :class="[
                 'w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0',
                 step._completed ? 'bg-gray-900 text-white' :
                 step._current ? 'bg-[#FF5C1A] text-white' : 'bg-gray-100 text-gray-400'
               ]">
                 <Check v-if="step._completed" class="w-3.5 h-3.5" />
                 <Loader2 v-else-if="step._current" class="w-3.5 h-3.5 animate-spin" />
                 <span v-else class="text-[11px] font-bold">{{ idx + 1 }}</span>
               </div>
               <h4 :class="[
                 'text-[11px] font-bold text-center leading-tight transition-colors',
                 (step._completed || step._current) ? 'text-gray-900' : 'text-gray-300'
               ]">{{ step.label }}</h4>
             </div>

             <div v-if="idx < orderSteps.length - 1" class="flex-1 h-0.5 w-full hidden md:block rounded-full bg-gray-100 -mt-6">
                <div class="h-full transition-all duration-700 bg-[#FF5C1A]" :style="{ width: (orderSteps[idx + 1]._completed || orderSteps[idx + 1]._current) ? '100%' : '0%' }"></div>
             </div>
           </template>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-5">

             <!-- Status Communication Banners -->
             <div v-if="order.type !== 'custom_errand' && order.status !== 'pending' && order.status !== 'delivered' && order.status !== 'cancelled'" class="animate-fade-in">
                <!-- Vendor ready, no errander yet -->
                <div v-if="!order.errander && order.status === 'ready_for_pickup'" class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mb-4">
                  <div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-amber-900">Food is hot and ready! 🍲</h4>
                    <p class="text-[13px] text-amber-800 mt-1 leading-relaxed">
                      The vendor is done preparing your order! We're just matching you with a rider to swing by and pick it up. It won't be long!
                    </p>
                  </div>
                </div>

                <!-- Errander assigned, vendor working or ready -->
                <div v-else-if="order.errander && (order.status === 'preparing' || order.status === 'ready_for_pickup')" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mb-4">
                  <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Bike class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-blue-900">Rider Assigned!</h4>
                    <p class="text-[13px] text-blue-800 mt-1 leading-relaxed">
                      <span v-if="order.status === 'ready_for_pickup'">Your order is ready! We're waiting for your rider, {{ order.errander.firstName || 'your errander' }}, to pick it up from the store.</span>
                      <span v-else>Your rider, {{ order.errander.firstName || 'your errander' }}, has been assigned and is heading to the store while your order is being prepared.</span>
                    </p>
                  </div>
                </div>

                <!-- Errander picked up (in transit) -->
                <div v-else-if="order.status === 'in_transit'" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mb-4">
                  <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Check class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-emerald-900">Order Picked Up!</h4>
                    <p class="text-[13px] text-emerald-800 mt-1 leading-relaxed">
                      Your rider has successfully picked up your order and is currently on their way to deliver it to you. Keep an eye out!
                    </p>
                  </div>
                </div>
             </div>

             <!-- PENDING NEGOTIATION -->
             <div v-if="order.type === 'custom_errand' && order.status === 'pending'" class="p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <div class="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                   <Bike class="w-6 h-6 text-white" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 tracking-tight mb-1">Searching for a Rider</h3>
                <p class="text-gray-400 text-xs max-w-sm mb-5">Your errand is broadcasted to nearby riders. Increase the fee to make your request more attractive.</p>

                <div class="w-full max-w-sm flex gap-2">
                   <div class="relative flex-1">
                     <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                     <input v-model="formattedNewFee" type="text" @input="handleFeeInput" class="w-full pl-7 pr-3 py-2.5 rounded-lg border border-gray-200 outline-none font-bold text-gray-900 text-sm focus:border-[#FF5C1A] transition-colors" placeholder="New fee amount" />
                   </div>
                   <button @click="increaseFee" :disabled="isIncreasingFee || newFee <= order.deliveryFee" class="bg-[#FF5C1A] text-white font-bold px-5 py-2.5 rounded-lg hover:bg-[#e6511a] transition-colors disabled:opacity-40 shrink-0 text-xs">
                      {{ isIncreasingFee ? 'Updating...' : 'Boost Fee' }}
                   </button>
                </div>

                <div v-if="order.viewers && order.viewers.length > 0" class="w-full mt-6 pt-5 border-t border-gray-100 text-left">
                   <h4 class="text-[11px] font-bold text-gray-900 uppercase flex items-center gap-1.5 mb-3">
                     <span class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A] animate-pulse"></span>
                     {{ order.viewers.length }} Rider{{ order.viewers.length > 1 ? 's' : '' }} viewing right now
                   </h4>
                   <div class="flex flex-wrap gap-2">
                      <div v-for="viewer in order.viewers" :key="viewer._id" class="flex items-center gap-2 border border-gray-100 px-2.5 py-1.5 rounded-lg">
                         <div class="w-7 h-7 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-500 font-bold text-[10px] uppercase shrink-0">
                            <img v-if="viewer.errander?.avatar" :src="viewer.errander.avatar" class="w-full h-full object-cover" />
                            <span v-else>{{ viewer.errander?.firstName?.[0] || 'R' }}{{ viewer.errander?.lastName?.[0] || '' }}</span>
                         </div>
                         <p class="text-xs font-bold text-gray-900">{{ viewer.errander?.firstName || 'Rider' }} {{ viewer.errander?.lastName || '' }}</p>
                      </div>
                   </div>
                </div>

                <!-- Bids -->
                <div v-if="pendingBids.length > 0" class="w-full mt-6 pt-5 border-t border-gray-100 text-left">
                   <h4 class="text-[11px] font-bold text-gray-900 mb-3 uppercase flex items-center gap-1.5">
                     <Zap class="w-3.5 h-3.5 text-[#FF5C1A]" /> Received Offers
                   </h4>
                   <div class="space-y-2">
                      <div v-for="bid in pendingBids" :key="bid._id" class="p-3 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                         <div class="flex items-center gap-3 w-full sm:w-auto">
                            <div class="w-9 h-9 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                               <img v-if="bid.errander?.avatar" :src="bid.errander.avatar" class="w-full h-full object-cover" />
                               <User v-else class="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                               <p class="text-sm font-bold text-gray-900">{{ bid.errander?.firstName || 'Rider' }} {{ bid.errander?.lastName || '' }}</p>
                               <p class="text-[#FF5C1A] text-xs font-bold">Offer: ₦{{ bid.amount?.toLocaleString() }}</p>
                            </div>
                         </div>
                         <button @click="acceptBid(bid._id)" :disabled="isAcceptingBid === bid._id" class="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors disabled:opacity-50">
                            {{ isAcceptingBid === bid._id ? 'Accepting...' : 'Accept Offer' }}
                         </button>
                      </div>
                   </div>
                </div>
             </div>

             <!-- AWAITING PAYMENT -->
             <div v-if="order.type === 'custom_errand' && order.status === 'awaiting_payment'" class="p-4 rounded-2xl bg-gray-900 text-white flex flex-col items-center text-center">
                <div class="w-12 h-12 rounded-xl bg-[#FF5C1A] flex items-center justify-center mb-4">
                   <Check class="w-6 h-6 text-white" />
                </div>
                <h3 class="text-lg font-bold tracking-tight mb-1">Rider Accepted</h3>
                <p class="text-gray-400 text-xs max-w-sm mb-5">Secure the rider by paying the escrow fee. This covers their labor and our platform convenience fee.</p>

                <button @click="payForErrand" :disabled="isInitializingPayment" class="bg-[#FF5C1A] text-white font-bold px-4 py-2.5 rounded-lg hover:bg-[#e6511a] transition-colors disabled:opacity-50 flex items-center gap-2 text-xs">
                   <Zap v-if="!isInitializingPayment" class="w-3.5 h-3.5" />
                   {{ isInitializingPayment ? 'Processing...' : 'Pay Escrow & Open Chat' }}
                </button>
             </div>

             <!--
               Bento cluster: every card below is a natural-height block inside a
               CSS multi-column flow. The browser packs each one into whichever
               column is currently shortest, so if a card is missing (e.g. no
               rider assigned yet) nothing is left hollow underneath it — the
               next card simply slots into the gap. This is what closes the
               dead space from the old fixed 7/5 split.
             -->
             <div class="columns-1 sm:columns-2 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">

                <!-- Delivery Address -->
                <div class="p-5 rounded-2xl bg-gray-900 text-white">
                   <div class="flex items-center gap-2 mb-4">
                      <MapPin class="w-4 h-4 text-[#FF5C1A]" />
                      <h4 class="text-[11px] font-bold text-white/50 uppercase tracking-widest">Delivery Address</h4>
                   </div>
                   <h3 class="text-base font-bold leading-snug mb-4">{{ order.deliveryAddress || 'Campus Residency' }}</h3>

                   <div class="inline-flex items-center gap-2">
                      <div class="relative flex h-1.5 w-1.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </div>
                      <span class="text-[10px] font-bold tracking-widest uppercase text-emerald-400">Live Tracking Active</span>
                   </div>
                </div>

                <!-- Verification Code -->
                <div v-if="order.status !== 'pending' && order.status !== 'awaiting_payment'" class="p-5 rounded-2xl border border-gray-100 flex flex-col">
                   <div class="flex items-center justify-between mb-5">
                      <div class="flex items-center gap-2">
                         <ShieldCheck class="w-4 h-4 text-emerald-600" />
                         <h4 class="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Verification Code</h4>
                      </div>
                      <button @click="copyVerificationCode" class="text-gray-400 hover:text-gray-900 transition-colors" title="Copy Code">
                         <Copy class="w-4 h-4" />
                      </button>
                   </div>
                   <div class="flex items-center justify-center gap-2 mb-4">
                      <div v-for="(digit, idx) in (order.deliveryPin || '0000').split('')" :key="idx" class="w-10 h-12 rounded-lg bg-gray-900 flex items-center justify-center text-lg font-bold text-white">
                        {{ digit }}
                      </div>
                   </div>
                   <p class="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wide">Present code upon delivery</p>
                </div>

                <!-- Rider -->
                <div v-if="order.status !== 'pending' && order.status !== 'awaiting_payment' && order.errander" class="p-5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                   <div class="flex items-center justify-between mb-4">
                      <h4 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Your Rider</h4>
                      <div class="inline-flex items-center gap-1 text-blue-600 text-[10px] font-bold">
                         <Check class="w-3 h-3" /> Verified
                      </div>
                   </div>
                   <div class="flex items-center gap-3 mb-4">
                      <div class="w-11 h-11 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                         <img v-if="order.errander.avatar" :src="order.errander.avatar" class="w-full h-full object-cover" />
                         <span v-else>{{ order.errander.firstName?.[0] }}{{ order.errander.lastName?.[0] }}</span>
                      </div>
                      <h3 class="text-base font-bold text-gray-900">{{ order.errander.firstName }} {{ order.errander.lastName }}</h3>
                   </div>
                   <div class="flex flex-col gap-2">
                      <div class="flex gap-2">
                        <a :href="`tel:${order.errander.phone}`" class="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-bold text-center hover:bg-gray-50 transition-colors">
                          Call
                        </a>
                        <a v-if="order.errander.phone" :href="`https://wa.me/${order.errander.phone.replace(/[^0-9]/g, '').replace(/^0/, '234')}?text=${encodeURIComponent('Hi, I am the customer for order #' + order.orderNumber)}`" target="_blank" class="flex-1 py-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-bold text-center hover:bg-[#25D366]/20 transition-colors">
                          WhatsApp
                        </a>
                      </div>
                      <button @click="openChat(String(order.errander?.user?._id || order.errander?.user || order.errander._id), (order.errander?.user?.firstName || order.errander?.firstName) + ' (Rider)', order.errander?.user?.avatar)" class="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-xs font-bold text-center hover:bg-black transition-colors flex items-center justify-center gap-1.5">
                        <MessageSquare class="w-3.5 h-3.5" /> In-App Message
                      </button>
                   </div>
                </div>

                <!-- Vendor -->
                <div v-if="order.status !== 'pending' && order.status !== 'awaiting_payment' && order.type !== 'custom_errand' && order.vendor" class="p-5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                   <div class="flex items-center justify-between mb-4">
                      <h4 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">The Vendor</h4>
                      <div class="inline-flex items-center gap-1 text-[#FF5C1A] text-[10px] font-bold">
                         <ShieldCheck class="w-3 h-3" /> Verified Partner
                      </div>
                   </div>
                   <div class="flex items-center gap-3 mb-4">
                      <div class="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                         <video v-if="order.vendor?.logo && order.vendor.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="order.vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                         <img v-else-if="order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
                         <Store v-else class="w-5 h-5" />
                      </div>
                      <h3 class="text-base font-bold text-gray-900">{{ order.vendor?.storeName || 'Vendor' }}</h3>
                   </div>
                   <div class="flex flex-col gap-2">
                     <div v-if="order.vendor?.phone" class="flex gap-2">
                       <a :href="`tel:${order.vendor.phone}`" class="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-bold text-center hover:bg-gray-50 transition-colors">
                         Call
                       </a>
                       <a :href="`https://wa.me/${order.vendor.phone.replace(/[^0-9]/g, '').replace(/^0/, '234')}?text=${encodeURIComponent('Hi, I am the customer for order #' + order.orderNumber)}`" target="_blank" class="flex-1 py-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-bold text-center hover:bg-[#25D366]/20 transition-colors flex justify-center items-center">
                         WhatsApp
                       </a>
                     </div>
                     <button @click="openChat((order.vendor?.owner?._id || order.vendor?.owner || '') + ',' + (order.vendor?._id || ''), order.vendor?.storeName || 'Vendor', order.vendor?.logo)" class="w-full py-2.5 rounded-lg bg-gray-900 text-white text-xs font-bold text-center hover:bg-black transition-colors flex items-center justify-center gap-1.5">
                       <MessageSquare class="w-3.5 h-3.5" /> In-App Message Store
                     </button>
                   </div>
                </div>

                <!-- Receipt Summary -->
                <div v-if="order.type !== 'custom_errand'" class="p-5 rounded-2xl border border-gray-100">
                   <h4 class="text-[11px] font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-1.5">
                     <Utensils class="w-3.5 h-3.5" /> Receipt Summary
                   </h4>

                   <div class="space-y-3">
                     <div v-for="item in order.items" :key="item._id" class="flex items-center justify-between gap-3">
                       <div class="flex items-center gap-2.5">
                         <div class="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                           <img :src="item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'" class="w-full h-full object-cover" />
                         </div>
                         <div>
                           <h5 class="text-xs font-bold text-gray-900 line-clamp-1">{{ item.name }}</h5>
                           <p class="text-[11px] text-gray-400 mt-0.5">Qty: <span class="text-gray-700 font-bold">{{ item.quantity }}</span></p>
                         </div>
                       </div>
                       <p class="text-xs font-bold text-gray-900 shrink-0">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
                     </div>
                   </div>

                   <div class="mt-4 pt-4 border-t border-gray-100 space-y-2">
                     <div class="flex justify-between text-xs">
                       <span class="text-gray-400">Subtotal</span>
                       <span class="text-gray-900 font-bold">₦{{ order.subtotal?.toLocaleString() }}</span>
                     </div>
                     <div class="flex justify-between text-xs">
                       <span class="text-gray-400">Fees & delivery</span>
                       <span class="text-gray-900 font-bold">₦{{ (order.total - order.subtotal)?.toLocaleString() }}</span>
                     </div>
                   </div>

                   <div class="mt-4 p-3.5 rounded-xl bg-[#FF5C1A] text-white flex justify-between items-center">
                     <span class="text-[10px] font-bold text-white/80 tracking-widest uppercase">Grand Total</span>
                     <span class="text-lg font-bold">₦{{ order.total?.toLocaleString() }}</span>
                   </div>
                </div>

                <!-- Errand Details -->
                <div v-if="order.type === 'custom_errand'" class="p-5 rounded-2xl border border-gray-100">
                   <h4 class="text-[11px] font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-1.5">
                     <ClipboardList class="w-3.5 h-3.5" /> Errand Details
                   </h4>
                   <div class="space-y-3">
                     <div class="p-3 bg-gray-50 rounded-lg text-gray-700 text-xs">
                       {{ order.description || 'No description provided.' }}
                     </div>

                     <div class="flex justify-between items-center pt-1">
                       <span class="text-gray-400 text-xs">Urgency</span>
                       <span class="px-2 py-0.5 rounded border border-gray-200 text-gray-700 font-bold capitalize text-[11px]">{{ order.urgency || 'standard' }}</span>
                     </div>
                     <div v-if="order.estimatedItemCost" class="flex justify-between items-center">
                       <span class="text-gray-400 text-xs">Est. Item Cost</span>
                       <span class="text-gray-900 font-bold text-xs">₦{{ order.estimatedItemCost?.toLocaleString() }}</span>
                     </div>
                     <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                       <span class="text-gray-400 text-xs">Rider Fee</span>
                       <span class="text-gray-900 font-bold text-xs">₦{{ order.deliveryFee?.toLocaleString() }}</span>
                     </div>
                   </div>

                   <div class="mt-4 p-3.5 rounded-xl bg-[#FF5C1A] text-white flex justify-between items-center">
                     <span class="text-[10px] font-bold text-white/80 tracking-widest uppercase">Total Escrow</span>
                     <span class="text-lg font-bold">₦{{ order.total?.toLocaleString() }}</span>
                   </div>
                </div>

                <!-- Rider Account Details -->
                <div v-if="order.type === 'custom_errand' && order.erranderDetails?.accountNumber" class="p-5 rounded-2xl border border-gray-100 relative overflow-hidden">
                   <div class="absolute left-0 top-0 w-1 h-full bg-[#FF5C1A]"></div>
                   <div class="flex items-center gap-3 pl-2 mb-4">
                      <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#FF5C1A] shrink-0">
                         <CreditCard class="w-5 h-5" />
                      </div>
                      <div>
                         <h4 class="font-bold text-gray-900 text-sm">Transfer Item Funds</h4>
                         <p class="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Send item payment directly to your rider.</p>
                      </div>
                   </div>
                   <div class="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-900 text-white pl-2">
                      <div>
                         <p class="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">{{ order.erranderDetails.bankName }}</p>
                         <p class="text-base font-bold tracking-widest font-mono leading-none">{{ order.erranderDetails.accountNumber }}</p>
                         <p class="text-[11px] font-bold text-gray-300 mt-1">{{ order.erranderDetails.accountName }}</p>
                      </div>
                      <button @click="copyAccountDetails" class="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 shrink-0">
                         <Copy class="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <!-- Support -->
                <NuxtLink to="/support" class="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors group">
                   <div class="flex items-center gap-3">
                      <LifeBuoy class="w-4 h-4 text-gray-400 group-hover:text-[#FF5C1A] transition-colors" />
                      <div>
                         <h4 class="text-xs font-bold text-gray-900">Need help?</h4>
                         <p class="text-[11px] text-gray-400 mt-0.5">Contact 24/7 support</p>
                      </div>
                   </div>
                   <ArrowRight class="w-4 h-4 text-gray-300 group-hover:text-[#FF5C1A] group-hover:translate-x-0.5 transition-all" />
                </NuxtLink>

             </div>

             <!-- Rating -->
             <div v-if="order && order.status === 'DELIVERED' && (!order.hasRatedVendor || !order.hasRatedErrander)" class="pt-6 border-t border-gray-100">
                   <div class="text-center mb-5">
                      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-bold tracking-wide mb-3">
                         <Sparkles class="w-3 h-3" /> Earn 20 Reward Points
                      </div>
                      <h2 class="text-lg font-bold tracking-tight text-gray-900 mb-1">How was your experience?</h2>
                      <p class="text-gray-400 text-xs">Your feedback helps us maintain top quality service.</p>
                   </div>

                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-if="order.type !== 'custom_errand' && !order.hasRatedVendor" class="p-5 rounded-2xl border border-gray-100 flex flex-col items-center">
                         <Utensils class="w-4 h-4 text-gray-300 mb-3" />
                         <h4 class="font-bold text-sm text-gray-900 mb-0.5">The Meal</h4>
                         <p class="text-[11px] text-gray-400 mb-4">Rate the vendor</p>

                         <div class="flex gap-1.5 mb-4">
                            <button v-for="i in 5" :key="i" @click="ratingForm.vendorRating = i" class="transition-transform focus:outline-none hover:scale-110">
                               <Star :class="['w-6 h-6 transition-colors', ratingForm.vendorRating >= i ? 'text-[#FF5C1A] fill-[#FF5C1A]' : 'text-gray-200']" />
                            </button>
                         </div>
                         <textarea v-model="ratingForm.vendorReview" placeholder="Feedback on the food..." class="w-full p-3 rounded-lg border border-gray-100 text-xs focus:outline-none focus:border-[#FF5C1A] resize-none h-20 transition-colors"></textarea>
                      </div>

                      <div v-if="!order.hasRatedErrander" class="p-5 rounded-2xl border border-gray-100 flex flex-col items-center" :class="{ 'md:col-span-2 max-w-sm mx-auto w-full': order.type === 'custom_errand' || order.hasRatedVendor }">
                         <Bike class="w-4 h-4 text-gray-300 mb-3" />
                         <h4 class="font-bold text-sm text-gray-900 mb-0.5">The Delivery</h4>
                         <p class="text-[11px] text-gray-400 mb-4">Rate your rider</p>

                         <div class="flex gap-1.5 mb-4">
                            <button v-for="i in 5" :key="i" @click="ratingForm.erranderRating = i" class="transition-transform focus:outline-none hover:scale-110">
                               <Star :class="['w-6 h-6 transition-colors', ratingForm.erranderRating >= i ? 'text-[#FF5C1A] fill-[#FF5C1A]' : 'text-gray-200']" />
                            </button>
                         </div>
                         <textarea v-model="ratingForm.erranderReview" placeholder="How was the service?" class="w-full p-3 rounded-lg border border-gray-100 text-xs focus:outline-none focus:border-[#FF5C1A] resize-none h-20 transition-colors"></textarea>
                      </div>
                   </div>

                   <div class="mt-5 max-w-xs mx-auto">
                      <button @click="submitRatings" :disabled="isSubmittingRating || (!ratingForm.vendorRating && !ratingForm.erranderRating)" class="w-full py-3 rounded-lg bg-[#FF5C1A] text-white text-sm font-bold hover:bg-[#e6511a] transition-colors disabled:opacity-50 disabled:bg-gray-300 flex items-center justify-center gap-2">
                         <Loader2 v-if="isSubmittingRating" class="w-4 h-4 animate-spin" />
                         {{ isSubmittingRating ? 'Submitting...' : 'Submit Feedback' }}
                      </button>
                   </div>
                </div>

      </div>

    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex flex-col items-center justify-center p-4">
    <div class="relative mb-6">
       <div class="w-16 h-16 border-4 border-gray-100 border-t-[#FF5C1A] rounded-full animate-spin"></div>
       <div class="absolute inset-0 m-auto w-7 h-7 flex items-center justify-center">
          <Zap class="w-4 h-4 text-[#FF5C1A]" />
       </div>
    </div>
    <h3 class="font-bold text-gray-900 text-base mb-1">Loading your order</h3>
    <p class="text-sm text-gray-400">Syncing live logistics data...</p>
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
  Store,
  CreditCard,
  LifeBuoy,
  ArrowRight,
  Loader2,
  ClipboardList
} from 'lucide-vue-next';
import { ref, onMounted, onUnmounted, reactive, computed, watch } from 'vue';
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
      if (type === 'ORDER_BIDS_UPDATE' || type === 'ORDER_ACCEPTED' || type === 'ORDER_STATUS_UPDATE' || type === 'ERRAND_VIEWER_ADDED') {
        if (data?.orderId === route.params.id || data?.order?._id === route.params.id) {
           if (type !== 'ERRAND_VIEWER_ADDED') {
             showToast({ title: title || 'New Update', message: body || 'Your order has been updated.', toastType: 'info' });
           }
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

const copyVerificationCode = async () => {
  if (!order.value?.deliveryPin) return;
  try {
    await navigator.clipboard.writeText(order.value.deliveryPin);
    showToast({ title: 'Copied!', message: 'Verification code copied to clipboard.', toastType: 'success' });
  } catch (err) {
    showToast({ title: 'Failed', message: 'Could not copy code.', toastType: 'error' });
  }
};

// Order Tracking Stepper Logic
const CUSTOM_ERRAND_STEPS = [
  { status: 'pending', label: 'Errand Broadcasted', description: 'Waiting for riders to respond' },
  { status: 'awaiting_payment', label: 'Rider Negotiated', description: 'Waiting for escrow payment' },
  { status: 'confirmed', label: 'In Progress', description: 'Rider is currently running your errand' },
  { status: 'in_transit', label: 'Heading to you', description: 'Rider is on their way with the items' },
  { status: 'delivered', label: 'Delivered', description: 'Errand completed successfully' }
];

const getStatusIndex = (status: string, stepsArray: any[]) => stepsArray.findIndex(s => s.status === status);

const isStepCompletedCustom = (stepStatus: string, stepsArray: any[]) => {
  if (!order.value?.status) return false;
  const currentIdx = getStatusIndex(order.value.status, stepsArray);
  const stepIdx = getStatusIndex(stepStatus, stepsArray);
  return stepIdx < currentIdx;
};

const isStepCurrentCustom = (stepStatus: string) => {
  if (!order.value?.status) return false;
  return stepStatus === order.value.status;
};

const orderSteps = computed(() => {
  if (order.value?.type === 'custom_errand') {
    return CUSTOM_ERRAND_STEPS.map(s => ({
      ...s,
      _completed: isStepCompletedCustom(s.status, CUSTOM_ERRAND_STEPS),
      _current: isStepCurrentCustom(s.status)
    }));
  }
  
  const status = order.value?.status;
  return [
    { 
      label: 'Order Placed', 
      _completed: true, 
      _current: false 
    },
    { 
      label: 'Preparing', 
      _completed: ['ready_for_pickup', 'picked_up', 'in_transit', 'delivered'].includes(status),
      _current: ['confirmed', 'preparing'].includes(status)
    },
    {
      label: !order.value?.errander ? 'Finding Rider...' : 'Rider Assigned',
      _completed: !!order.value?.errander,
      _current: !order.value?.errander && ['confirmed', 'preparing', 'ready_for_pickup'].includes(status)
    },
    { 
      label: 'On Way', 
      _completed: ['delivered'].includes(status),
      _current: ['picked_up', 'in_transit'].includes(status)
    },
    { 
      label: 'Delivered', 
      _completed: status === 'delivered',
      _current: status === 'delivered'
    }
  ];
});

useHead({ title: 'Order Details - Errandr' });
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>