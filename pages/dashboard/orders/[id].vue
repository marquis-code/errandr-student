<template>
  <div class="space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary" v-if="order">
    <!-- Header -->
    <div class="bg-gray-900 rounded-3xl md:rounded-[4rem] p-6 lg:p-20 relative overflow-hidden group shadow-lg border-b-[8px] md:border-b-[16px] border-gray-800 mt-8">
      <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div class="space-y-4">
           <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
              Order ID: {{ order._id?.slice(-8).toUpperCase() }}
           </div>
            <h1 class="text-3xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
               Order <br /><span class="text-parentPrimary uppercase">{{ order.status?.replace('_', ' ') }}</span>
            </h1>
            <p class="text-white/60 text-base font-medium leading-relaxed max-w-sm">We're making sure your delivery arrives safely and on time.</p>
         </div>
         
         <div class="flex items-center gap-4 bg-white/5 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/10 group-hover:scale-105 transition-all duration-700">
            <div class="w-14 h-14 md:w-20 md:h-20 bg-parentPrimary rounded-2xl md:rounded-3xl flex items-center justify-center text-white font-bold text-xl md:text-3xl shadow-lg shadow-parentPrimary/30">
               <Clock class="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
               <p class="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Estimated Time</p>
               <p class="text-xl md:text-3xl font-bold text-white tracking-tight leading-none">12-15 Mins</p>
            </div>
         </div>
      </div>
    </div>

    <!-- Order Interaction -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
      <!-- Verification -->
      <div class="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group translate-y-0 hover:-translate-y-2 transition-all duration-500">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl group-hover:bg-parentPrimary/10 transition-colors" />
        <h4 class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-6">Verification Code</h4>
        <div class="flex flex-wrap items-center gap-3">
           <div v-for="(digit, idx) in (order.uniqueCode || '').split('')" :key="idx" class="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold text-gray-900 border border-gray-100 group-hover:bg-white group-hover:border-parentPrimary/30 transition-all shadow-inner">
              {{ digit }}
           </div>
        </div>
        <p class="text-[10px] font-bold text-gray-400 mt-6 leading-relaxed">Show this code to your Errandr when they arrive to confirm delivery.</p>
      </div>

      <!-- Delivery Errandr -->
      <div v-if="order.errander" class="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center group translate-y-0 hover:-translate-y-2 transition-all duration-500">
        <div class="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
          {{ order.errander.firstName?.[0] }}{{ order.errander.lastName?.[0] }}
        </div>
        <div class="space-y-1 mb-8">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Your Errandr</p>
          <h3 class="font-bold text-gray-900 text-2xl tracking-tight leading-none">{{ order.errander.firstName }} {{ order.errander.lastName }}</h3>
          <p class="text-[10px] text-parentPrimary font-bold uppercase tracking-widest mt-2 bg-parentPrimary/5 px-4 py-1.5 rounded-full inline-block">{{ order.errander.phone }}</p>
        </div>
        <div class="flex gap-3 w-full">
          <a :href="`tel:${order.errander.phone}`" class="flex-1 py-4 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-parentPrimary transition-all shadow-lg active:scale-95 text-center">Call</a>
          <NuxtLink :to="`/chat/${order._id}`" class="flex-1 py-4 bg-white border border-gray-100 text-gray-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 text-center">Chat</NuxtLink>
        </div>
      </div>

      <!-- ETA Card -->
      <div class="bg-parentPrimary p-8 md:p-10 rounded-3xl text-white overflow-hidden relative group translate-y-0 hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-parentPrimary/20">
         <div class="absolute top-0 right-0 p-8 transform rotate-12 group-hover:rotate-0 transition-transform duration-700 opacity-20 hidden md:block">
            <Bike class="w-32 h-32" />
         </div>
         <div class="relative z-10 space-y-6">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
               <MapPin class="w-5 h-5" />
            </div>
            <div>
               <p class="text-[9px] font-bold uppercase tracking-widest mb-1.5 opacity-60">Delivering to</p>
               <h3 class="text-xl md:text-2xl font-bold tracking-tight leading-tight line-clamp-2">{{ order.deliveryAddress || 'Campus Residency' }}</h3>
            </div>
            <div class="pt-6 border-t border-white/10">
               <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span class="text-[9px] font-bold uppercase tracking-widest">Tracking Live</span>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Live Map Placeholder -->
    <div class="px-4">
       <div class="bg-gray-50 h-80 rounded-3xl md:rounded-[4rem] border-8 border-white shadow-lg relative overflow-hidden group">
          <div class="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1,0/1200x600?access_token=token')] bg-cover bg-center grayscale opacity-30" />
          <div class="absolute inset-0 flex items-center justify-center">
             <div class="flex flex-col items-center gap-4 text-center p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white/20">
                <Navigation class="w-10 h-10 text-parentPrimary animate-bounce" />
                <p class="text-sm font-bold text-gray-900">Map tracking active on Errandr</p>
             </div>
          </div>
       </div>
    </div>

    <!-- Order Items -->
    <section class="max-w-4xl mx-auto px-4">
       <div class="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <h4 class="text-xl font-bold text-gray-900 tracking-tight mb-10">Order Details</h4>

          <div class="space-y-6">
             <div v-for="item in order.items" :key="item._id" class="flex items-center gap-4 group/item">
                <div class="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 relative overflow-hidden border border-gray-100">
                   <img :src="item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                </div>
                <div class="flex-1 min-w-0">
                   <h5 class="text-sm font-bold text-gray-900 tracking-tight mb-0.5 truncate">{{ item.name }}</h5>
                   <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Qty: {{ item.quantity }} × ₦{{ item.price?.toLocaleString() }}</p>
                </div>
                <div class="text-right">
                   <p class="text-sm font-bold text-gray-900 tracking-tight">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
                </div>
             </div>

             <div class="pt-8 border-t border-gray-50 space-y-3">
                <div class="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   <span>Subtotal</span>
                   <span class="text-gray-900">₦{{ order.subtotal?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   <span>Fees & Delivery</span>
                   <span class="text-gray-900">₦{{ (order.total - order.subtotal)?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between items-center pt-6 border-t border-gray-50">
                   <span class="text-lg font-bold text-gray-900">Total</span>
                   <span class="text-3xl font-black text-parentPrimary tracking-tighter">₦{{ order.total?.toLocaleString() }}</span>
                </div>
             </div>
          </div>
       </div>
    </section>

    <!-- Support -->
    <div class="max-w-4xl mx-auto px-4 pb-40">
       <button class="w-full py-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3 group hover:bg-gray-100 transition-all duration-500">
          <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-300 group-hover:text-parentPrimary transition-colors shadow-sm">
             <ShieldCheck class="w-5 h-5" />
          </div>
          <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-4 text-center">Need help? Contact Errandr Support</span>
       </button>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="space-y-12 px-4 py-12 flex flex-col items-center">
    <div class="w-20 h-20 border-4 border-parentPrimary/20 border-t-parentPrimary rounded-full animate-spin" />
    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Retrieving Order Details...</p>
  </div>
</template>

<script setup lang="ts">
import { 
  Clock, 
  MapPin, 
  Bike, 
  Navigation, 
  ClipboardList, 
  ShieldCheck 
} from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'student'
})

const route = useRoute();
const order = ref<any>(null);

onMounted(async () => {
  try {
    const res = await api.get<any>(`/orders/${route.params.id}`);
    order.value = res.data;
  } catch (e) {
    console.error(e);
  }
});

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
</style>
