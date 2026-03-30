<template>
  <div class="space-y-6 md:space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary" v-if="order">
    <!-- Header -->
    <div class="bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] p-6 lg:p-10 relative overflow-hidden group shadow-2xl border border-white/5 mt-4 mx-4">
      <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-bold tracking-widest mx-auto md:mx-0 uppercase">
            Order ID: {{ order._id?.slice(-8).toUpperCase() }}
          </div>
          <h1 class="text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight uppercase">
            Order <span class="text-parentPrimary">{{ order.status?.replace(/_/g, ' ') }}</span>
          </h1>
          <p class="text-white/60 text-xs md:text-sm font-medium leading-relaxed max-w-sm mx-auto md:mx-0">We're making sure your delivery arrives safely and on time.</p>
        </div>
        
        <div class="flex items-center justify-center gap-4 bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/10 group-hover:scale-105 transition-all duration-500 max-w-xs mx-auto md:mx-0">
          <div class="w-12 h-12 md:w-14 md:h-14 bg-parentPrimary rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-parentPrimary/30">
            <Clock class="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div class="text-left">
            <p class="text-[8px] font-bold text-white/50 tracking-widest mb-0.5">Estimated Time</p>
            <p class="text-lg md:text-xl font-bold text-white tracking-tight leading-none">12-15 Mins</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Interaction -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
      <!-- Verification -->
      <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group translate-y-0 hover:-translate-y-1 transition-all duration-300">
        <div class="absolute -right-5 -top-5 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-parentPrimary/10 transition-colors" />
        <h4 class="text-[10px] font-bold text-gray-400 tracking-widest mb-4 uppercase">Verification Code</h4>
        <div class="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
          <div v-for="(digit, idx) in (order.uniqueCode || '').split('')" :key="idx" class="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold text-gray-900 border border-gray-100 group-hover:bg-white group-hover:border-parentPrimary/30 transition-all shadow-inner">
            {{ digit }}
          </div>
        </div>
        <p class="text-[10px] font-bold text-gray-400 mt-4 leading-relaxed text-center lg:text-left">Show this code to your Errandr to confirm delivery.</p>
      </div>

      <!-- Delivery Errandr -->
      <div v-if="order.errander" class="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group translate-y-0 hover:-translate-y-1 transition-all duration-300">
        <div class="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-4 text-white text-xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 uppercase">
          {{ order.errander.firstName?.[0] }}{{ order.errander.lastName?.[0] }}
        </div>
        <div class="space-y-1 mb-6">
          <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Your Errandr</p>
          <h3 class="font-bold text-gray-900 text-xl tracking-tight leading-tight">{{ order.errander.firstName }} {{ order.errander.lastName }}</h3>
          <p class="text-[10px] text-parentPrimary font-bold tracking-widest mt-1 bg-parentPrimary/5 px-3 py-1.5 rounded-full inline-block">{{ order.errander.phone }}</p>
        </div>
        <div class="flex gap-2 w-full">
          <a :href="`tel:${order.errander.phone}`" class="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-bold tracking-widest hover:bg-parentPrimary transition-all shadow-md active:scale-95 text-center uppercase">Call</a>
          <NuxtLink :to="`/chat/${order._id}`" class="flex-1 py-3 bg-white border border-gray-100 text-gray-900 rounded-xl text-[10px] font-bold tracking-widest hover:bg-gray-50 transition-all active:scale-95 text-center uppercase">Chat</NuxtLink>
        </div>
      </div>

      <!-- ETA Card -->
      <div class="bg-parentPrimary p-6 md:p-8 rounded-[2rem] text-white overflow-hidden relative group translate-y-0 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-parentPrimary/20">
        <div class="absolute -top-4 -right-4 p-8 transform rotate-12 group-hover:rotate-0 transition-transform duration-700 opacity-20 hidden md:block">
          <Bike class="w-24 h-24" />
        </div>
        <div class="relative z-10 space-y-4">
          <div class="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
            <MapPin class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="text-[9px] font-bold tracking-widest mb-1 text-white/70 uppercase">Delivering to</p>
            <h3 class="text-lg md:text-xl font-bold tracking-tight leading-tight line-clamp-2">{{ order.deliveryAddress || 'Campus Residency' }}</h3>
          </div>
          <div class="pt-4 border-t border-white/10">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span class="text-[10px] font-bold tracking-widest uppercase">Tracking Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Map Placeholder -->
    <div class="px-4">
      <div class="bg-gray-50 h-48 md:h-64 rounded-[2rem] border-2 md:border-8 border-white shadow-md relative overflow-hidden group">
        <div class="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1,0/1200x600?access_token=token')] bg-cover bg-center grayscale opacity-30" />
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-center p-4 md:p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm">
            <Navigation class="w-6 h-6 md:w-8 md:h-8 text-parentPrimary animate-bounce" />
            <p class="text-[10px] md:text-xs font-bold text-gray-900 tracking-widest uppercase">Map tracking active</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dual Rating Section -->
    <section v-if="order && order.status === 'DELIVERED' && (!order.hasRatedVendor || !order.hasRatedErrander)" class="max-w-4xl mx-auto px-4 mt-8 slide-up">
      <div class="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group shadow-2xl border border-white/5">
        <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/20 via-transparent to-transparent opacity-50 transition-opacity duration-1000" />
        
        <div class="relative z-10 text-center mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-parentPrimary text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles class="w-3.5 h-3.5" /> earn 20 points
          </div>
          <h2 class="text-3xl md:text-4xl font-black tracking-tighter mb-2">How was your Errand?</h2>
          <p class="text-white/50 text-sm font-medium">Rate the meal and your Errandr to help us improve.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <!-- Vendor Rating -->
          <div v-if="!order.hasRatedVendor" class="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 space-y-6 flex flex-col items-center">
            <div class="text-center">
              <Utensils class="w-8 h-8 text-parentPrimary mx-auto mb-3" />
              <h4 class="font-black text-lg tracking-tight uppercase">The Meal</h4>
              <p class="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rate the Vendor</p>
            </div>
            
            <div class="flex justify-center gap-2">
              <button v-for="i in 5" :key="i" @click="ratingForm.vendorRating = i" class="transition-all duration-300 hover:scale-125">
                <Star :class="['w-8 h-8', ratingForm.vendorRating >= i ? 'text-parentPrimary fill-parentPrimary' : 'text-white/10']" />
              </button>
            </div>
            
            <textarea v-model="ratingForm.vendorReview" placeholder="Any feedback on the food?" class="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-parentPrimary outline-none min-h-[100px] transition-all" />
          </div>

          <!-- Errander Rating -->
          <div v-if="!order.hasRatedErrander" class="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 space-y-6 flex flex-col items-center">
            <div class="text-center">
              <Bike class="w-8 h-8 text-parentPrimary mx-auto mb-3" />
              <h4 class="font-black text-lg tracking-tight uppercase">The Delivery</h4>
              <p class="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rate your Errandr</p>
            </div>
            
            <div class="flex justify-center gap-2">
              <button v-for="i in 5" :key="i" @click="ratingForm.erranderRating = i" class="transition-all duration-300 hover:scale-125">
                <Star :class="['w-8 h-8', ratingForm.erranderRating >= i ? 'text-parentPrimary fill-parentPrimary' : 'text-white/10']" />
              </button>
            </div>
            
            <textarea v-model="ratingForm.erranderReview" placeholder="How was the service?" class="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-parentPrimary outline-none min-h-[100px] transition-all" />
          </div>
        </div>

        <div class="mt-10 relative z-10 w-full max-w-sm mx-auto">
          <button 
            @click="submitRatings"
            :disabled="isSubmittingRating || (!ratingForm.vendorRating && !ratingForm.erranderRating)"
            class="w-full py-5 bg-parentPrimary text-white rounded-[2rem] font-black text-sm tracking-[0.1em] uppercase shadow-2xl shadow-parentPrimary/30 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 group/btn"
          >
            <span class="flex items-center justify-center gap-2">
              {{ isSubmittingRating ? 'Saving Feedback...' : 'Submit Ratings' }}
              <Zap v-if="!isSubmittingRating" class="w-4 h-4 group-hover/btn:animate-pulse" />
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Order Items -->
    <section class="max-w-4xl mx-auto px-4">
      <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <h4 class="text-lg font-bold text-gray-900 tracking-tight mb-6 uppercase">Order Summary</h4>

        <div class="space-y-4">
          <div v-for="item in order.items" :key="item._id" class="flex items-center gap-4 group/item">
            <div class="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-50 flex-shrink-0 relative overflow-hidden border border-gray-100">
              <img :src="item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
            </div>
            <div class="flex-1 min-w-0 pr-2">
              <h5 class="text-xs md:text-sm font-bold text-gray-900 tracking-tight mb-0.5 truncate uppercase">{{ item.name }}</h5>
              <p class="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Qty: {{ item.quantity }} × ₦{{ item.price?.toLocaleString() }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs md:text-sm font-bold text-gray-900 tracking-tight">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-50 space-y-3">
            <div class="flex justify-between text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              <span>Subtotal</span>
              <span class="text-gray-900 font-black">₦{{ order.subtotal?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              <span>Fees & Delivery</span>
              <span class="text-gray-900 font-black">₦{{ (order.total - order.subtotal)?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center pt-5 border-t border-gray-50 mt-2">
              <span class="text-xs md:text-sm font-black text-gray-900 tracking-[0.2em] uppercase">Grand Total</span>
              <span class="text-xl md:text-3xl font-black text-parentPrimary tracking-tighter">₦{{ order.total?.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support -->
    <div class="max-w-4xl mx-auto px-4 pb-40">
      <button class="w-full py-5 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-row items-center justify-center gap-3 group hover:bg-gray-100 transition-all duration-300 active:scale-95 shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors shadow-sm">
          <ShieldCheck class="w-5 h-5" />
        </div>
        <span class="text-[10px] font-black text-gray-400 tracking-widest uppercase group-hover:text-gray-900 transition-colors">Need help? Errandr Support</span>
      </button>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
    <div class="relative">
      <div class="w-24 h-24 border-4 border-parentPrimary/10 border-t-parentPrimary rounded-full animate-spin" />
      <Zap class="absolute inset-0 m-auto w-8 h-8 text-parentPrimary animate-pulse" />
    </div>
    <div class="text-center">
      <h3 class="text-lg font-black text-gray-900 tracking-tighter uppercase mb-2">Fetching Order</h3>
      <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] animate-pulse">Syncing with satellite...</p>
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
  Zap
} from 'lucide-vue-next';
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'student'
})

const route = useRoute();
const order = ref<any>(null);
const { showToast } = useCustomToast();
const isSubmittingRating = ref(false);

const ratingForm = reactive({
  vendorRating: 0,
  vendorReview: '',
  erranderRating: 0,
  erranderReview: ''
});

onMounted(async () => {
  try {
    const res = await api.get<any>(`/orders/${route.params.id}`);
    order.value = res.data;
  } catch (e) {
    console.error(e);
  }
});

const submitRatings = async () => {
  isSubmittingRating.value = true;
  try {
    await api.put(`/orders/${order.value._id}/rate`, ratingForm);
    showToast({
      title: "Feedback Saved! 🎉",
      message: "You've earned 20 points! Thank you for helping us improve campus deliveries.",
      toastType: "success"
    });
    // Refresh order data
    const res = await api.get<any>(`/orders/${route.params.id}`);
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
