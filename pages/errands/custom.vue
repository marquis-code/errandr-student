<template>
  <div class="min-h-screen bg-[#FAFAFA] pb-32 font-sans selection:bg-parentPrimary/10 selection:text-parentPrimary">


    <main class="max-w-5xl mx-auto px-0 sm:px-4">
      <div v-if="!placing" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Form Fields (7 columns) -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Description Banner -->
          <div class="bg-gray-950 rounded-[2rem] p-4 sm:p-6 text-white relative overflow-hidden group shadow-lg border border-gray-900">
            <div class="absolute -right-10 -top-10 w-48 h-48 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div class="relative z-10 space-y-2">
              <h2 class="text-base sm:text-lg font-medium tracking-tight lowercase">need something specific?</h2>
              <p class="text-gray-400 text-sm font-medium leading-relaxed max-w-md lowercase">
                from picking up laundry to buying unique items off-campus, our errandrs have you covered.
              </p>
            </div>
          </div>

          <!-- Main Form Card -->
          <div class="bg-white p-4 sm:p-8 rounded-[2rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm space-y-6">
            <!-- Pickup and Dropoff Fields -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2 relative group/field">
                <label class="text-sm font-medium text-gray-400 ml-1 lowercase">pickup from</label>
                <div class="relative">
                  <MapPin class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    v-model="form.pickupLocation"
                    type="text"
                    placeholder="e.g. oau gate, faculty of law"
                    class="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-parentPrimary/30 outline-none transition-all placeholder:text-gray-300 lowercase"
                  />
                </div>
              </div>

              <div class="space-y-2 relative group/field">
                <label class="text-sm font-medium text-gray-400 ml-1 lowercase">deliver to</label>
                <div class="relative">
                  <Navigation class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    v-model="form.dropoffLocation"
                    type="text"
                    placeholder="e.g. moremi hall, room 402"
                    class="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-parentPrimary/30 outline-none transition-all placeholder:text-gray-300 lowercase"
                  />
                </div>
              </div>
            </div>

            <!-- Description Textarea -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">what exactly do you need?</label>
              <textarea 
                v-model="form.description"
                placeholder="please provide clear instructions for the errandr..."
                class="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-parentPrimary/30 outline-none transition-all h-28 resize-none placeholder:text-gray-300 lowercase"
              ></textarea>
            </div>

            <!-- Item Cost & Urgency Toggle -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-400 ml-1 lowercase">estimated item cost (₦)</label>
                <input 
                  v-model="formattedEstimatedItemCost"
                  type="text"
                  placeholder="0.00"
                  class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-parentPrimary/30 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-400 ml-1 lowercase">delivery urgency</label>
                <div class="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                  <button 
                    v-for="opt in ['standard', 'express']" 
                    :key="opt"
                    @click="form.urgency = opt"
                    class="flex-1 py-3 rounded-xl text-sm font-medium transition-all lowercase"
                    :class="form.urgency === opt ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'"
                  >
                    {{ opt }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Order Summary (5 columns) -->
        <div class="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div class="bg-white p-4 sm:p-8 rounded-[2rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm space-y-6">
            <h3 class="text-sm font-medium text-gray-900 border-b border-gray-50 pb-4 lowercase">errand summary</h3>

            <div class="space-y-4">
              <div class="flex justify-between items-center text-sm font-bold text-gray-400 lowercase">
                <span>base delivery ({{ form.urgency }})</span>
                <span class="text-gray-900 font-medium">₦{{ baseFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-sm font-bold text-gray-400 lowercase">
                <span>item reimbursement</span>
                <span class="text-gray-900 font-medium">₦{{ Number(form.estimatedItemCost || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-sm font-bold text-gray-400 lowercase">
                <span>service & gateway fees</span>
                <span class="text-gray-900 font-medium">₦{{ (serviceFee + paystackFee).toLocaleString() }}</span>
              </div>

              <div class="pt-6 mt-4 border-t border-dashed border-gray-100 flex justify-between items-end">
                <div>
                  <p class="text-sm font-medium text-gray-400 mb-1 lowercase">total amount</p>
                  <span class="text-2xl font-medium text-gray-900 tracking-tighter">₦{{ finalTotal.toLocaleString() }}</span>
                </div>
                <button 
                  @click="startPayment"
                  :disabled="!isFormValid"
                  class="px-6 py-4 bg-gray-900 text-white rounded-2xl text-sm font-medium lowercase hover:bg-parentPrimary transition-all shadow-xl shadow-gray-100 disabled:opacity-20 active:scale-[0.98]"
                >
                  secure checkout
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Processing State -->
      <div v-else class="bg-white p-12 lg:p-24 rounded-[3rem] border border-gray-100 text-center space-y-8 animate-pulse">
        <div class="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
          <Loader2 class="w-8 h-8 text-parentPrimary animate-spin" />
        </div>
        <div>
          <h3 class="text-xl font-medium text-gray-900 tracking-tighter lowercase">verifying transaction...</h3>
          <p class="text-sm font-medium text-gray-400 mt-2 lowercase">please wait while we confirm your payment reference.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Navigation, Zap, Loader2 } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useUser } from '@/composables/modules/auth/user';
import { usePayments } from '@/composables/modules/payments';
import { useStudentOrders } from '@/composables/modules/orders';
import { orders_api } from '@/api_factory/modules/orders';
import { useRoute, useRouter, navigateTo } from '#imports';

definePageMeta({ layout: 'student' });

const showToast = useCustomToast().showToast;
const { user } = useUser();
const { initializePayment, verifyPayment } = usePayments();
const { createOrder } = useStudentOrders();
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

const formattedEstimatedItemCost = computed({
  get() {
    if (form.value.estimatedItemCost === 0 || form.value.estimatedItemCost === null || form.value.estimatedItemCost === undefined) return '';
    return form.value.estimatedItemCost.toLocaleString('en-US');
  },
  set(val) {
    const clean = val.replace(/[^0-9.]/g, '');
    form.value.estimatedItemCost = clean ? Number(clean) : 0;
  }
});

const pricing = ref({
  baseFee: 450,
  expressFee: 850
});

const fetchPricing = async () => {
  try {
    const res = await orders_api.getCustomErrandSettings();
    if (res.data) {
      pricing.value.baseFee = Number(res.data.baseFee || 450);
      pricing.value.expressFee = Number(res.data.expressFee || 850);
    }
  } catch (e) {
    console.error('failed to fetch dynamic pricing:', e);
  }
};

const baseFee = computed(() => form.value.urgency === 'express' ? pricing.value.expressFee : pricing.value.baseFee);
const serviceFee = computed(() => Math.round((baseFee.value + Number(form.value.estimatedItemCost || 0)) * 0.05));

const subtotalBeforeFee = computed(() => baseFee.value + Number(form.value.estimatedItemCost || 0) + serviceFee.value);

const paystackFee = computed(() => {
  const amount = subtotalBeforeFee.value;
  if (amount === 0) return 0;
  let fee = amount < 2500 ? (amount / 0.985) - amount : ((amount + 100) / 0.985) - amount;
  if (fee > 2000) fee = 2000;
  return Math.ceil(fee);
});

const finalTotal = computed(() => subtotalBeforeFee.value + paystackFee.value);

const isFormValid = computed(() => 
  form.value.pickupLocation && form.value.dropoffLocation && form.value.description && finalTotal.value > 0
);

const startPayment = async () => {
  if (!user.value?.email) return showToast({ title: 'auth required', message: 'please sign in.', toastType: 'warning' });
  placing.value = true;
  try {
    const res = await initializePayment({
      amount: Math.round(finalTotal.value),
      customer: { name: `${user.value.firstName} ${user.value.lastName}`, email: user.value.email },
      callback_url: `${window.location.origin}/errands/custom`,
      metadata: { type: 'custom_errand', ...form.value },
    });
    const authUrl = res?.data?.authorization_url || res?.authorization_url;
    if (authUrl) {
      localStorage.setItem('pending_errand', JSON.stringify(form.value));
      window.location.href = authUrl;
    }
  } catch (e: any) {
    placing.value = false;
  }
};

onMounted(async () => {
  await fetchPricing();

  if (route.query.reference) {
    placing.value = true;
    const savedForm = localStorage.getItem('pending_errand');
    if (savedForm) form.value = JSON.parse(savedForm);

    try {
      const paymentData = await verifyPayment(route.query.reference as string);
      if (paymentData?.status === 'success' || (paymentData as any)?.data?.status === 'success') {
        await createOrder({ type: 'custom_errand', ...form.value, paymentReference: route.query.reference });
        showToast({ title: 'success!', message: 'request placed.', toastType: 'success' });
        localStorage.removeItem('pending_errand');
        navigateTo('/orders');
      } else {
        placing.value = false;
      }
    } catch (e) {
      placing.value = false;
    }
  }
});

useHead({ title: 'special request - errandr' });
</script>
