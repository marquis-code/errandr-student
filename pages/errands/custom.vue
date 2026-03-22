<template>
  <div class="max-w-xl mx-auto space-y-6 pb-20 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary pt-6 px-4">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Request Errand</h1>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Anything you need, delivered on campus.</p>
    </div>

    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 relative overflow-hidden group">
      <div class="absolute -right-20 -top-20 w-48 h-48 bg-parentPrimary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
      
      <div class="space-y-6 relative z-10">
        <!-- Pickup -->
        <div class="space-y-2 relative group/field">
          <label class="text-[10px] font-bold text-gray-400 ml-2 transition-colors group-focus-within/field:text-parentPrimary uppercase tracking-widest">Pickup Location</label>
          <div class="relative">
             <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
             <input
               v-model="form.pickupLocation"
               type="text"
               placeholder=""
               class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-parentPrimary/5 focus:bg-white transition-all outline-none"
             />
          </div>
        </div>

        <!-- Dropoff -->
        <div class="space-y-2 relative group/field">
          <label class="text-[10px] font-bold text-gray-400 ml-2 transition-colors group-focus-within/field:text-parentPrimary uppercase tracking-widest">Where to deliver?</label>
          <div class="relative">
             <Navigation class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
             <input
               v-model="form.dropoffLocation"
               type="text"
               placeholder=""
               class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-parentPrimary/5 focus:bg-white transition-all outline-none"
             />
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2 relative group/field">
          <label class="text-[10px] font-bold text-gray-400 ml-2 transition-colors group-focus-within/field:text-parentPrimary uppercase tracking-widest">What do you need?</label>
          <textarea
             v-model="form.description"
             placeholder=""
             class="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-parentPrimary/5 focus:bg-white transition-all h-28 resize-none outline-none"
          />
        </div>

        <!-- Price & Action -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 bg-gray-900 rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
             <div class="absolute inset-0 bg-gradient-to-r from-parentPrimary/10 to-transparent" />
             <div class="relative">
                <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Delivery Fee</p>
                <p class="text-xl font-black text-white tracking-tighter leading-none mt-1">₦450.00</p>
             </div>
             <div class="text-[8px] font-bold text-parentPrimary uppercase tracking-widest relative">Fixed</div>
          </div>

          <button
             @click="submitErrand"
             :disabled="loading || !isFormValid"
             class="flex-[2] py-4 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-parentPrimary hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-20 active:translate-y-0"
          >
            <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
            <div v-else class="flex items-center gap-2">
               <Zap class="w-4 h-4" />
               <span>Send Request</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Navigation, Zap } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'student'
})

const loading = ref(false);
const form = ref({
  pickupLocation: '',
  dropoffLocation: '',
  description: '',
});

const isFormValid = computed(() => 
  form.value.pickupLocation && 
  form.value.dropoffLocation && 
  form.value.description
);

const submitErrand = async () => {
  loading.value = true;
  try {
    // Custom errands are specialized orders
    await api.post('/orders/custom', {
      type: 'custom_errand',
      ...form.value,
      total: 450,
    });
    alert('Request Sent! An Errandr will be assigned to your request shortly.');
    navigateTo('/orders');
  } catch (e) {
    console.error(e);
    alert('Something went wrong. Please check your connection and try again.');
  } finally {
    loading.value = false;
  }
};

useHead({ title: 'Custom Errand - Errandr' });
</script>
