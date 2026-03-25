<template>
<div class="min-h-screen bg-[#FDFDFD] pb-32 font-sans selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Compact Header -->
    <header class="sticky top-0 z-30 pt-6 px-4 mb-8">
      <div class="max-w-xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <div class="flex items-center gap-4">
          <button @click="router.back()" class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-lg font-black text-gray-900 leading-tight">Custom Errand</h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Logistics & Delivery</p>
          </div>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-parentPrimary/5 rounded-2xl border border-parentPrimary/10">
          <Zap class="w-3 h-3 text-parentPrimary animate-pulse" />
          <span class="text-[10px] font-black text-parentPrimary uppercase tracking-widest">Active</span>
        </div>
      </div>
    </header>

    <main class="max-w-xl mx-auto px-4 space-y-6">
      <!-- Description Banner -->
      <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl">
        <div class="absolute -right-10 -top-10 w-48 h-48 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div class="relative z-10 space-y-2">
          <h2 class="text-2xl font-black tracking-tighter">Need something specific?</h2>
          <p class="text-gray-400 text-xs font-bold leading-relaxed max-w-[280px]">From picking up laundry to buying unique items off-campus, our Errandrs have you covered.</p>
        </div>
      </div>

      <!-- Main Form -->
      <div v-if="!placing" class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative group">
        <div class="space-y-6">
          <!-- Locations -->
          <div class="grid grid-cols-1 gap-4">
            <div class="space-y-2 relative group/field">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup From</label>
              <div class="relative">
                <MapPin class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  v-model="form.pickupLocation"
                  type="text"
                  placeholder="e.g. OAU Gate, Faculty of Law"
                  class="w-full pl-12 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white focus:ring-[8px] focus:ring-parentPrimary/5 outline-none transition-all"
                />
              </div>
            </div>

            <div class="space-y-2 relative group/field">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Deliver To</label>
              <div class="relative">
                <Navigation class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  v-model="form.dropoffLocation"
                  type="text"
                  placeholder="e.g. Moremi Hall, Room 402"
                  class="w-full pl-12 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white focus:ring-[8px] focus:ring-parentPrimary/5 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">What exactly do you need?</label>
            <textarea 
              v-model="form.description"
              placeholder="Please provide clear instructions for the Errandr..."
              class="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white focus:ring-[8px] focus:ring-parentPrimary/5 outline-none transition-all h-32 resize-none"
            ></textarea>
          </div>

          <!-- Costs & Delivery -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Est. Item Cost (₦)</label>
              <input 
                v-model="form.estimatedItemCost"
                type="number"
                placeholder="0.00"
                class="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black focus:bg-white outline-none transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Urgency</label>
              <div class="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                <button 
                  v-for="opt in ['standard', 'express']" 
                  :key="opt"
                  @click="form.urgency = opt"
                  class="flex-1 py-4 rounded-[0.9rem] text-[9px] font-black uppercase tracking-widest transition-all"
                  :class="form.urgency === opt ? 'bg-white text-gray-900 shadow-sm border border-gray-50' : 'text-gray-400 hover:text-gray-600'"
                >
                  {{ opt }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="pt-8 border-t border-gray-100 space-y-4">
          <div class="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Base Delivery ({{ form.urgency }})</span>
            <span class="text-gray-900">₦{{ baseFee.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Item Reimbursement</span>
            <span class="text-gray-900 text-xs">₦{{ Number(form.estimatedItemCost || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Service & Paystack Fees</span>
            <span class="text-gray-900">₦{{ (serviceFee + paystackFee).toLocaleString() }}</span>
          </div>

          <div class="pt-6 mt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
            <div>
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
              <span class="text-3xl font-black text-gray-900 tracking-tighter">₦{{ finalTotal.toLocaleString() }}</span>
            </div>
            <button 
              @click="startPayment"
              :disabled="!isFormValid"
              class="px-8 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-parentPrimary hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-gray-200 disabled:opacity-20"
            >
              Secure Checkout
            </button>
          </div>
        </div>
      </div>

      <!-- Processing State -->
      <div v-else class="bg-white p-12 lg:p-24 rounded-[3rem] border border-gray-100 text-center space-y-8 animate-pulse">
        <div class="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
          <Loader2 class="w-10 h-10 text-parentPrimary animate-spin" />
        </div>
        <div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tighter">Verifying Transaction...</h3>
          <p class="text-sm font-bold text-gray-400 mt-2">Please wait while we confirm your payment reference.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Navigation, Zap, ChevronLeft, Loader2 } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useUser } from '@/composables/modules/auth/user';
import { useRoute, useRouter, navigateTo } from '#imports';

definePageMeta({
  layout: 'student'
})

const { showToast } = useCustomToast();
const { user } = useUser();
const router = useRouter();
const route = useRoute();

const placing = ref(false);
const form = ref({
  pickupLocation: '',
  dropoffLocation: '',
  description: '',
  estimatedItemCost: 0,
  urgency: 'standard',
});

const baseFee = computed(() => form.value.urgency === 'express' ? 850 : 450);
const serviceFee = computed(() => Math.round((baseFee.value + Number(form.value.estimatedItemCost || 0)) * 0.05));

const subtotalBeforeFee = computed(() => {
  return baseFee.value + Number(form.value.estimatedItemCost || 0) + serviceFee.value;
});

const paystackFee = computed(() => {
  const amount = subtotalBeforeFee.value;
  if (amount === 0) return 0;
  let fee = amount < 2500 ? (amount / 0.985) - amount : ((amount + 100) / 0.985) - amount;
  if (fee > 2000) fee = 2000;
  return Math.ceil(fee);
});

const finalTotal = computed(() => subtotalBeforeFee.value + paystackFee.value);

const isFormValid = computed(() => 
  form.value.pickupLocation && 
  form.value.dropoffLocation && 
  form.value.description &&
  finalTotal.value > 0
);

const startPayment = async () => {
  if (!user.value?.email) {
    showToast({
      title: 'Auth Required',
      message: 'Please sign in to place a request.',
      toastType: 'warning'
    });
    return;
  }

  placing.value = true;
  try {
    const res = await api.post('/payments/initialize', {
      amount: Math.round(finalTotal.value),
      customer: {
        name: `${user.value.firstName} ${user.value.lastName}`,
        email: user.value.email,
      },
      callback_url: `${window.location.origin}/errands/custom`,
      metadata: {
        type: 'custom_errand',
        ...form.value,
      },
    });

    const authUrl = (res.data as any)?.data?.authorization_url;
    if (authUrl) {
      // Store form data temporarily to re-populate on callback if needed
      localStorage.setItem('pending_errand', JSON.stringify(form.value));
      window.location.href = authUrl;
    }
  } catch (e: any) {
    placing.value = false;
    showToast({
      title: 'Error',
      message: e.response?.data?.message || 'Payment initialization failed.',
      toastType: 'error'
    });
  }
};

onMounted(async () => {
  // Check for payment callback
  if (route.query.reference) {
    placing.value = true;
    const savedForm = localStorage.getItem('pending_errand');
    if (savedForm) {
       form.value = JSON.parse(savedForm);
    }

    try {
      const verifyRes = await api.get(`/payments/verify?reference=${route.query.reference}`);
      const paymentData = (verifyRes.data as any)?.data;
      
      if (paymentData?.status === 'success') {
        // Create the actual order
        await api.post('/orders', {
          type: 'custom_errand',
          ...form.value,
          paymentReference: route.query.reference,
        });
        
        showToast({
          title: 'Success!',
          message: 'Your request has been placed and paid.',
          toastType: 'success'
        });
        localStorage.removeItem('pending_errand');
        navigateTo('/orders');
      } else {
        placing.value = false;
        showToast({
          title: 'Payment Failed',
          message: 'The transaction was not successful.',
          toastType: 'error'
        });
      }
    } catch (e) {
      console.error(e);
      placing.value = false;
      showToast({
        title: 'Error',
        message: 'Could not verify payment callback.',
        toastType: 'error'
      });
    }
  }
});

useHead({ title: 'Special Request - Errandr' });
</script>
