<template>
 <div class="min-h-screen bg-[#FDFDFD] pb-32 font-sans selection:bg-parentPrimary/10">
 <!-- Immersive Header -->
 <div class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
 <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
 <div class="flex items-center gap-4">
 <button 
 @click="router.back()" 
 class="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group active:scale-95"
 >
 <ArrowLeft class="w-4 h-4 text-gray-900 group-hover:-translate-x-1 transition-transform" />
 </button>
 <div class="flex flex-col">
 <h1 class="text-lg font-black text-gray-900 tracking-tight leading-none">Order Status</h1>
 <div v-if="order" class="flex items-center gap-2 mt-1.5">
 <span class="text-[9px] font-black text-gray-400 tracking-wider ">ID: {{ order.orderNumber }}</span>
 <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
 <span class="text-[9px] font-bold text-gray-400 capitalize">{{ formatDate(order.createdAt) }}</span>
 </div>
 </div>
 </div>
 
 <div class="flex items-center gap-2">
 <button 
 @click="reorder" 
 :disabled="reordering"
 class="px-4 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black tracking-wider hover:bg-parentPrimary hover:shadow-lg hover:shadow-parentPrimary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
 >
 <RefreshCw v-if="reordering" class="w-3 h-3 animate-spin" />
 <span>{{ reordering ? 'Processing' : 'Reorder Items' }}</span>
 </button>
 </div>
 </div>
 </div>

 <div v-if="loading" class="max-w-5xl mx-auto px-6 py-12 space-y-8">
 <div class="h-40 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
 <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div class="lg:col-span-2 h-96 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
 <div class="h-80 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
 </div>
 </div>
 <main class="max-w-7xl mx-auto px-4 py-8">
 <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
 <div class="w-10 h-10 border-2 border-gray-100 border-t-parentPrimary rounded-full animate-spin" />
 <p class="text-[10px] font-bold text-gray-400 tracking-widest animate-pulse">Retrieving order details...</p>
 </div>

 <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
 <!-- LEFT COLUMN (8 cols): Journey, Items, Delivery -->
 <div class="md:col-span-12 lg:col-span-8 space-y-8">
 
 <!-- Timeline Card -->
 <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
 <div class="flex items-center justify-between border-b border-gray-50 pb-4">
 <h3 class="text-[10px] font-black text-gray-900 tracking-wider">Journey Progress</h3>
 <Clock class="w-4 h-4 text-gray-300" />
 </div>

 <div class="space-y-10 relative pl-4">
 <!-- Vertical Line -->
 <div class="absolute left-[31px] top-6 bottom-6 w-[2px] bg-gray-100" />

 <div v-for="(step, idx) in trackSteps" :key="step.label" class="flex gap-6 items-start relative z-10">
 <div 
 class="w-8 h-8 rounded-xl flex items-center justify-center border-2 border-white shadow-lg transition-all duration-500"
 :class="step.active ? 'bg-parentPrimary text-white scale-110' : 'bg-gray-100 text-gray-400'"
 >
 <component :is="step.icon" class="w-3.5 h-3.5" />
 </div>
 <div class="flex-1">
 <div class="flex items-center justify-between group">
 <h4 class="text-[11px] font-black tracking-widest transition-colors" :class="step.active ? 'text-gray-900' : 'text-gray-300'">
 {{ step.label }}
 </h4>
 <span v-if="step.timestamp" class="text-[9px] font-bold text-gray-400 italic">{{ formatTime(step.timestamp) }}</span>
 </div>
 <p v-if="step.active" class="text-[9px] font-bold text-parentPrimary/60 mt-0.5 tracking-wide animate-pulse">
 {{ idx === currentStepIndex ? 'Current Status' : 'Completed' }}
 </p>
 </div>
 </div>
 </div>
 </div>

 <!-- Items Breakdown -->
 <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
 <div class="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
 <div>
 <h3 class="text-[10px] font-black text-gray-900 tracking-wider">Order Breakdown</h3>
 <p class="text-[9px] font-bold text-gray-400 mt-0.5">{{ order.items?.length }} Items Ordered</p>
 </div>
 <div class="flex items-center gap-2">
 <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 <span class="text-[9px] font-bold text-emerald-600 tracking-wider">Confirmed Receipt</span>
 </div>
 </div>

 <div class="p-6">
 <!-- If packs exist -->
 <div v-if="order.packs?.length > 0" class="space-y-8">
 <div v-for="(pack, pIdx) in order.packs" :key="pack._id || pIdx" class="space-y-4">
 <div class="flex items-center gap-3">
 <div class="w-6 h-6 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[9px] font-black shadow-md">
 {{ Number(pIdx) + 1 }}
 </div>
 <h4 class="text-xs font-black text-gray-900 tracking-tight">{{ pack.name || `Pack ${Number(pIdx) + 1}` }}</h4>
 <div class="flex-1 h-px bg-gray-100" />
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div v-for="item in pack.items" :key="item.product" class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors">
 <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
 <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
 </div>
 <div class="flex-1 min-w-0">
 <p class="text-xs font-bold text-gray-900 truncate tracking-tight ">{{ item.name }}</p>
 <p class="text-[9px] font-bold text-gray-400 mt-0.5">Qty: {{ item.quantity }}</p>
 </div>
 <div class="text-right">
 <p class="text-xs font-black text-gray-900">₦{{ item.subtotal?.toLocaleString() }}</p>
 <p class="text-[8px] font-medium text-gray-400 italic">₦{{ item.price?.toLocaleString() }}/unit</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Fallback to plain items -->
 <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div v-for="item in order.items" :key="item.product" class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors">
 <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
 <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
 </div>
 <div class="flex-1 min-w-0">
 <p class="text-xs font-bold text-gray-900 truncate tracking-tight ">{{ item.name }}</p>
 <p class="text-[9px] font-bold text-gray-400 mt-0.5">Qty: {{ item.quantity }}</p>
 </div>
 <div class="text-right">
 <p class="text-xs font-black text-gray-900">₦{{ item.subtotal?.toLocaleString() }}</p>
 <p class="text-[8px] font-medium text-gray-400 italic">₦{{ item.price?.toLocaleString() }}/unit</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Delivery Destination -->
 <div class="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
 <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-parentPrimary/20 rounded-full blur-2xl opacity-50 group-hover:bg-parentPrimary/40 transition-all duration-1000" />
 
 <div class="relative z-10 space-y-5">
 <div class="flex items-center justify-between">
 <h3 class="text-[9px] font-black text-white/40 tracking-wider">Shipping To</h3>
 <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
 <MapPin class="w-4 h-4 text-parentPrimary" />
 </div>
 </div>

 <div class="space-y-2">
 <h4 class="text-xl font-bold tracking-tight">{{ order.recipientName || 'Student Resident' }}</h4>
 <p class="text-[11px] text-white/60 font-medium leading-relaxed italic line-clamp-2">
 {{ order.deliveryAddress || order.specificAddress || 'No specific address provided' }}
 </p>
 </div>

 <div class="pt-6 border-t border-white/10 flex items-center gap-4">
 <div class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
 <Truck class="w-5 h-5 text-gray-400" />
 </div>
 <div class="flex-1">
 <p class="text-[9px] font-black text-white/40 tracking-widest">Method</p>
 <p class="text-[11px] font-bold text-white tracking-wider">{{ order.deliveryOption?.replace(/_/g, ' ') || 'Use an Errandr' }}</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- RIGHT COLUMN (4 cols): Status, Provider, Payment, Helpful links -->
 <div class="md:col-span-12 lg:col-span-4 space-y-8">
 
 <!-- Status Overview Card (Compact) -->
 <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden relative group">
 <div class="absolute top-0 right-0 w-24 h-24 bg-parentPrimary/5 rounded-full -translate-y-12 translate-x-12 blur-xl group-hover:bg-parentPrimary/10 transition-all duration-700" />
 
 <div class="flex flex-col items-start gap-4 relative z-10">
 <div class="flex items-center gap-4">
 <div :class="[getStatusTheme(order.status).bg, getStatusTheme(order.status).text]" class="w-12 h-12 rounded-xl flex items-center justify-center border border-white shadow-lg transition-transform hover:scale-105">
 <component :is="getStatusTheme(order.status).icon" class="w-6 h-6" />
 </div>
 <div>
 <p class="text-[9px] font-black text-gray-400 tracking-wider mb-0.5">Live Status</p>
 <h2 class="text-xl font-black text-gray-900 tracking-tight transition-all ">{{ order.status.replace(/_/g, ' ') }}</h2>
 </div>
 </div>
 </div>

 <div class="flex items-center gap-3 mt-6 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 min-w-full relative z-10">
 <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
 <ShieldCheck class="w-4 h-4" />
 </div>
 <div class="flex-1 min-w-0">
 <p class="text-[8px] font-black text-emerald-600 tracking-wider mb-0.5 truncate">Verification Code</p>
 <p class="text-lg font-black text-gray-900 tracking-widest truncate">{{ order.uniqueCode }}</p>
 </div>
 <div class="text-[8px] font-bold text-emerald-600 bg-white px-1.5 py-0.5 rounded border border-emerald-100 shadow-sm flex-shrink-0">Give to Rider</div>
 </div>
 <p class="text-[9px] font-medium text-gray-400 mt-3 relative z-10">Share this code with the rider upon delivery to confirm receipt.</p>
 </div>

 <!-- Service Provider Info -->
 <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
 <div class="p-6">
 <h3 class="text-[9px] font-black text-gray-400 tracking-wider mb-4">Service Provider</h3>
 
 <div class="flex items-center gap-4 mb-8">
 <div class="w-16 h-16 rounded-2xl border border-gray-100 shadow-inner overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
 <img v-if="order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
 <Store v-else class="w-8 h-8 text-gray-300" />
 </div>
 <div class="flex-1 min-w-0">
 <h4 class="text-lg font-black text-gray-900 tracking-tight truncate">{{ order.vendor?.storeName || 'Vendor' }}</h4>
 <p class="text-[10px] font-bold text-parentPrimary flex items-center gap-1 tracking-widest truncate">
 <ShieldCheck class="w-3 h-3 flex-shrink-0" /> Verified Errandr Vendor
 </p>
 </div>
 </div>

 <div class="space-y-3">
 <button 
 @click="openChat(order.vendor?._id, order.vendor?.storeName, order.vendor?.logo)"
 class="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-[9px] font-bold tracking-widest transition-all flex items-center justify-center gap-2 border border-gray-100"
 >
 <MessageSquare class="w-3.5 h-3.5" /> Message Store
 </button>
 <button 
 v-if="order.errander?._id"
 @click="openChat(order.errander._id, order.errander.firstName + ' (Rider)', order.errander.avatar)"
 class="w-full py-4 bg-parentPrimary/5 hover:bg-parentPrimary/10 text-parentPrimary rounded-xl text-[9px] font-bold tracking-widest transition-all flex items-center justify-center gap-2 border border-parentPrimary/10"
 >
 <MessageSquare class="w-3.5 h-3.5" /> Message Rider
 </button>
 <button 
 @click="navigateTo(`/vendors/${order.vendor?._id}`)"
 class="w-full py-4 text-gray-400 hover:text-gray-900 text-[9px] font-bold tracking-widest transition-colors"
 >
 View Store Details
 </button>
 </div>
 </div>
 </div>

 <!-- Payment Summary -->
 <div class="bg-gray-50/50 border border-gray-100 shadow-sm rounded-2xl p-6">
 <h3 class="text-[10px] font-black text-gray-900 tracking-wider mb-4">Payment Summary</h3>
 <div class="space-y-2.5">
 <div class="flex justify-between items-center text-[9px] font-bold text-gray-500 tracking-wider">
 <span>Cart Subtotal</span>
 <span class="text-gray-900">₦{{ order.subtotal?.toLocaleString() }}</span>
 </div>
 <div class="flex justify-between items-center text-[9px] font-bold text-gray-500 tracking-wider">
 <span>Delivery Charge</span>
 <span class="text-gray-900">₦{{ order.deliveryFee?.toLocaleString() || 0 }}</span>
 </div>
 <div class="flex justify-between items-center text-[9px] font-bold text-gray-500 tracking-wider">
 <span>Packaging Fee</span>
 <span class="text-gray-900">₦{{ order.packagingFee?.toLocaleString() || 0 }}</span>
 </div>
 <div class="flex justify-between items-center text-[9px] font-bold text-gray-500 tracking-wider">
 <span>Service Charge (5%)</span>
 <span class="text-gray-900">₦{{ order.serviceFee?.toLocaleString() }}</span>
 </div>
 <div class="h-px bg-gray-200 my-3" />
 <div class="flex justify-between items-center pt-1">
 <div>
 <span class="text-[10px] font-black text-gray-900 tracking-wider">Grand Total</span>
 <p class="text-[8px] font-bold text-emerald-600 border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block tracking-wider">
 <CreditCard class="w-2.5 h-2.5 inline-block -mt-0.5 mr-0.5" /> Paid via Card
 </p>
 </div>
 <span class="text-2xl font-black text-gray-900 tracking-tighter">₦{{ order.total?.toLocaleString() }}</span>
 </div>
 </div>
 </div>

 <!-- Rating Section -->
 <div v-if="order.status === 'delivered' && !order.rating" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 relative">
 <div class="text-center mb-4">
 <h3 class="text-base font-black text-gray-900 tracking-tight">How was your delivery?</h3>
 <p class="text-[9px] font-bold text-gray-400 tracking-wider mt-0.5">Rate your experience</p>
 </div>
 
 <!-- Star Rating -->
 <div class="flex justify-center gap-1.5 mb-5" @mouseleave="hoverRating = 0">
 <button 
 v-for="star in 5" 
 :key="star"
 @click="rating = star"
 @mouseover="hoverRating = star"
 class="p-1.5 transition-transform hover:scale-110 focus:outline-none"
 >
 <Star 
 class="w-8 h-8 transition-colors"
 :class="(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100 fill-gray-100 hover:text-gray-200'"
 />
 </button>
 </div>

 <div v-if="rating > 0" class="space-y-4 animate-fade-in relative z-10">
 <textarea
 v-model="reviewText"
 rows="3"
 placeholder="Tell us what you loved (or what needs improvement)..."
 class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary transition-all outline-none resize-none placeholder:text-gray-400 shadow-inner"
 ></textarea>

 <button 
 @click="submitRating"
 :disabled="submittingRating"
 class="w-full py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black tracking-[0.2em] hover:bg-parentPrimary active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50"
 >
 <div v-if="submittingRating" class="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin" />
 <span v-else>Submit Review</span>
 </button>
 </div>
 </div>
 
 <!-- Already Rated State -->
 <div v-else-if="order.status === 'delivered' && order.rating" class="bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-sm p-8 text-center">
 <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
 <Star class="w-6 h-6 text-yellow-400 fill-yellow-400" />
 </div>
 <p class="text-[11px] font-black text-emerald-600 tracking-widest">You rated this delivery {{ order.rating }} stars</p>
 <p v-if="order.review" class="text-xs font-bold text-gray-400 italic mt-2">"{{ order.review }}"</p>
 </div>

 <!-- Help Section -->
 <div class="bg-parentPrimary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
 <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
 <div class="relative z-10 flex flex-col items-center text-center space-y-3">
 <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg mb-1 transition-transform group-hover:rotate-12">
 <LifeBuoy class="w-5 h-5 text-parentPrimary" />
 </div>
 <h3 class="text-base font-black tracking-tight">Need Assistance?</h3>
 <p class="text-[9px] font-bold text-white/80 tracking-wider">
 Our agents are online 24/7 to resolve issues.
 </p>
 <button 
 @click="showSupportModal = true"
 class="w-full mt-2 py-3 bg-white text-parentPrimary rounded-lg text-[9px] font-black tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
 >
 Join Support Chat
 </button>
 </div>
 </div>
 </div>

 </div>

 <!-- Not Found State -->
 <div v-else class="text-center py-40 animate-fade-in">
 <div class="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner">
 <Inbox class="w-10 h-10 text-gray-300" />
 </div>
 <h2 class="text-4xl font-black text-gray-900 tracking-tighter mb-4">Order Lost in Space</h2>
 <p class="text-sm font-bold text-gray-400 tracking-widest mb-10 italic">We couldn't find the order details you're looking for.</p>
 <button @click="navigateTo('/orders')" class="px-10 py-5 bg-gray-900 text-white rounded-[2rem] text-xs font-black tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
 Back to My Orders
 </button>
 </div>
 </main>

 <!-- Footer Space -->
 <div class="h-20" />

  <OrderChat
  v-if="order"
  :is-open="isChatOpen"
  :order-id="order._id"
  :current-user-id="user?._id || ''"
  :receiver-id="chatReceiverId"
  :receiver-name="chatReceiverName"
  :receiver-avatar="chatReceiverAvatar"
  @close="isChatOpen = false"
  />

  <UiModal :isOpen="showSupportModal" @close="showSupportModal = false" title="Need Help?">
    <div class="space-y-4 pt-4">
      <p class="text-xs text-gray-500 font-medium px-1">Please select who you would like to speak with regarding this order.</p>
      
      <div class="space-y-2">
        <button 
          v-if="order?.vendor"
          @click="triggerSupportChat(order.vendor._id, order.vendor.storeName || 'Vendor', order.vendor.logo)"
          class="w-full p-4 rounded-xl border border-gray-100 hover:border-parentPrimary hover:bg-parentPrimary/5 flex items-center gap-4 transition-all bg-white"
        >
          <div class="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
            <img v-if="order.vendor.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
            <Store v-else class="w-5 h-5 text-gray-400" />
          </div>
          <div class="text-left flex-1 min-w-0">
            <h4 class="text-sm font-bold text-gray-900 truncate">Message the Store</h4>
            <p class="text-[10px] text-gray-400 font-medium mt-0.5 truncate">{{ order.vendor.storeName }}</p>
          </div>
          <MessageSquare class="w-4 h-4 text-parentPrimary shrink-0" />
        </button>

        <button 
          v-if="order?.errander"
          @click="triggerSupportChat(order.errander._id, order.errander.firstName + ' (Rider)', order.errander.avatar)"
          class="w-full p-4 rounded-xl border border-gray-100 hover:border-parentPrimary hover:bg-parentPrimary/5 flex items-center gap-4 transition-all bg-white"
        >
          <div class="w-10 h-10 rounded-full border border-gray-100 bg-indigo-50 flex items-center justify-center overflow-hidden shrink-0">
            <img v-if="order.errander.avatar" :src="order.errander.avatar" class="w-full h-full object-cover" />
            <Truck v-else class="w-5 h-5 text-indigo-400" />
          </div>
          <div class="text-left flex-1 min-w-0">
            <h4 class="text-sm font-bold text-gray-900 truncate">Message your Rider</h4>
            <p class="text-[10px] text-gray-400 font-medium mt-0.5 truncate">{{ order.errander.firstName }} - Dispatch</p>
          </div>
          <MessageSquare class="w-4 h-4 text-parentPrimary shrink-0" />
        </button>

        <button 
          @click="triggerSupportChat('admin_support_channel', 'Errandr Support', '')"
          class="w-full p-4 rounded-xl border border-gray-100 hover:border-rose-500 hover:bg-rose-50 flex items-center gap-4 transition-all group bg-white"
        >
          <div class="w-10 h-10 rounded-full border border-rose-100 bg-rose-50 flex items-center justify-center overflow-hidden text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
            <LifeBuoy class="w-5 h-5" />
          </div>
          <div class="text-left flex-1 min-w-0">
            <h4 class="text-sm font-bold text-gray-900 truncate">Errandr Support</h4>
            <p class="text-[10px] text-gray-400 font-medium mt-0.5 truncate">Chat with an admin</p>
          </div>
          <MessageSquare class="w-4 h-4 text-rose-500 shrink-0" />
        </button>
      </div>
    </div>
  </UiModal>

 </div>
</template>

<script setup lang="ts">
import { 
 ArrowLeft, Phone, MapPin, Truck, ShoppingBag, 
 Package, CheckCircle2, AlertCircle, RefreshCw,
 Search, CreditCard, MessageSquare, Clock, LayoutGrid, Star, Inbox, LifeBuoy, Store, ShieldCheck
} from 'lucide-vue-next';
import { useRoute, useRouter } from '#imports';
import { ref, computed, onMounted } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import OrderChat from '@/components/core/OrderChat.vue';
import UiModal from '@/components/ui/UiModal.vue';
import { useUser } from '@/composables/modules/auth/user';

const route = useRoute();
const router = useRouter();
const order = ref<any>(null);
const loading = ref(true);
const reordering = ref(false);
const isChatOpen = ref(false);
const chatReceiverId = ref<string>('');
const chatReceiverName = ref('');
const chatReceiverAvatar = ref('');
const showSupportModal = ref(false);
const { user } = useUser();

const rating = ref(0);
const hoverRating = ref(0);
const reviewText = ref('');
const submittingRating = ref(false);
const cancelling = ref(false);

const cancelOrder = async () => {
  if (!confirm('Are you sure you want to cancel this order? You will receive a full refund to your wallet.')) return;
  cancelling.value = true;
  try {
    await api.post(`/orders/${route.params.id}/cancel`, {
      reason: 'Cancelled by user'
    });
    fetchOrder();
  } catch (error) {
    console.error('Cancellation failed', error);
    alert('Failed to cancel order. Please try again later.');
  } finally {
    cancelling.value = false;
  }
};

const submitRating = async () => {
 if (rating.value === 0) return;
 submittingRating.value = true;
 try {
 const res = await api.put(`/orders/${route.params.id}/rate`, {
 rating: rating.value,
 review: reviewText.value
 });
 order.value = res.data;
 } catch (error) {
 console.error('Failed to submit rating', error);
 } finally {
 submittingRating.value = false;
 }
};

const openChat = (receiverId: string | undefined, name: string, avatar?: string) => {
 if (!receiverId) return;
 chatReceiverId.value = receiverId;
 chatReceiverName.value = name;
 chatReceiverAvatar.value = avatar || '';
 isChatOpen.value = true;
};

const triggerSupportChat = (id: string, name: string, avatar?: string) => {
  openChat(id, name, avatar);
  showSupportModal.value = false;
};

const fetchOrder = async () => {
 loading.value = true;
 try {
 const res = await api.get(`/orders/${route.params.id}`);
 order.value = res.data;
 } catch (e) {
 console.error('Failed to fetch order', e);
 } finally {
 loading.value = false;
 }
};

import { useSocket } from '@/composables/useSocket';

const { connect, on } = useSocket('notifications');

onMounted(() => {
 fetchOrder();
 connect();
 on('notification', (payload: any) => {
 if (payload.data?.orderId === route.params.id || payload.type === 'ORDER_STATUS_UPDATE') {
 fetchOrder();
 }
 });
});

const formatDate = (dateStr: string) => {
 if (!dateStr) return '';
 const date = new Date(dateStr);
 return date.toLocaleDateString('en-GB', { 
 day: 'numeric', 
 month: 'long', 
 year: 'numeric' 
 });
};

const formatTime = (dateStr: string) => {
 if (!dateStr) return '';
 const date = new Date(dateStr);
 return date.toLocaleTimeString('en-GB', { 
 hour: '2-digit', 
 minute: '2-digit'
 });
};

const reorder = async () => {
 if (!order.value) return;
 reordering.value = true;
 try {
 const res = await api.post(`/orders/${order.value._id}/reorder`);
 navigateTo('/cart');
 } catch (e) {
 console.error('Reorder failed', e);
 } finally {
 reordering.value = false;
 }
};

const getStatusTheme = (status: string) => {
 switch (status?.toLowerCase()) {
 case 'pending': return { icon: Clock, bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' };
 case 'confirmed': return { icon: CheckCircle2, bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' };
 case 'preparing': return { icon: Package, bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600' };
 case 'ready_for_pickup': return { icon: LayoutGrid, bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600' };
 case 'picked_up':
 case 'in_transit': return { icon: Truck, bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600' };
 case 'delivered': return { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' };
 case 'cancelled': return { icon: AlertCircle, bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600' };
 default: return { icon: ShoppingBag, bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-400' };
 }
};

const trackSteps = computed(() => {
 if (!order.value) return [];
 const status = order.value.status;
 const history = order.value.statusHistory || [];
 
 const getTimestamp = (s: string) => {
 return history.find((h: any) => h.status === s)?.timestamp;
 };

 return [
 { label: 'Ordered', icon: ShoppingBag, active: true, timestamp: order.value.createdAt },
 { 
 label: 'Preparing', 
 icon: Package, 
 active: ['confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered'].includes(status),
 timestamp: getTimestamp('preparing') || getTimestamp('confirmed')
 },
 { 
 label: 'On Way', 
 icon: Truck, 
 active: ['picked_up', 'in_transit', 'delivered'].includes(status),
 timestamp: getTimestamp('picked_up') || getTimestamp('in_transit')
 },
 { 
 label: 'Delivered', 
 icon: CheckCircle2, 
 active: status === 'delivered',
 timestamp: getTimestamp('delivered')
 }
 ];
});

const currentStepIndex = computed(() => {
 return trackSteps.value.filter(s => s.active).length - 1;
});
</script>

<style scoped>
@keyframes float {
 0%, 100% { transform: translateY(0); }
 50% { transform: translateY(-10px); }
}

.animate-float {
 animation: float 5s ease-in-out infinite;
}

.selection\:bg-parentPrimary\/10 ::selection {
 background-color: rgba(6, 95, 219, 0.1);
}
</style>
