<template>
  <div class="max-w-xl mx-auto space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Header -->
    <div class="space-y-4 px-4 mt-8">
      <h1 class="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">Request Errand</h1>
      <p class="text-sm font-bold text-gray-400">Anything you need, delivered on campus.</p>
    </div>

    <div class="bg-white p-10 rounded-3xl md:rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10 relative overflow-hidden group">
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
      
      <div class="space-y-8 relative z-10">
        <!-- Pickup -->
        <div class="space-y-3 relative group/field">
          <label class="text-xs font-bold text-gray-400 ml-4 transition-colors group-focus-within/field:text-parentPrimary">Pickup Location</label>
          <div class="relative">
             <MapPin class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
             <input
               v-model="form.pickupLocation"
               type="text"
               placeholder="e.g. Diamond Hall Room 205"
               class="w-full pl-16 pr-6 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold focus:ring-8 focus:ring-parentPrimary/5 focus:bg-white transition-all shadow-inner outline-none placeholder:text-gray-200"
             />
          </div>
        </div>

        <!-- Dropoff -->
        <div class="space-y-3 relative group/field">
          <label class="text-xs font-bold text-gray-400 ml-4 transition-colors group-focus-within/field:text-parentPrimary">Where to deliver?</label>
          <div class="relative">
             <Navigation class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
             <input
               v-model="form.dropoffLocation"
               type="text"
               placeholder="e.g. Faculty of Science Lecture Room 1"
               class="w-full pl-16 pr-6 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold focus:ring-8 focus:ring-parentPrimary/5 focus:bg-white transition-all shadow-inner outline-none placeholder:text-gray-200"
             />
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-3 relative group/field">
          <label class="text-xs font-bold text-gray-400 ml-4 transition-colors group-focus-within/field:text-parentPrimary">What do you need?</label>
          <textarea
             v-model="form.description"
             placeholder="Describe the errand. What are we picking up? Be as specific as possible!"
             class="w-full p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] text-sm font-bold focus:ring-8 focus:ring-parentPrimary/5 focus:bg-white transition-all h-40 resize-none shadow-inner outline-none placeholder:text-gray-200"
          />
        </div>

        <!-- Price -->
        <div class="bg-gray-900 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
           <div class="absolute inset-0 bg-gradient-to-r from-parentPrimary/10 to-transparent" />
           <div class="flex justify-between items-end relative">
              <div class="space-y-1">
                 <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Delivery Fee</p>
                 <p class="text-4xl font-black text-white tracking-tighter">₦450.00</p>
              </div>
              <div class="text-[9px] font-bold text-parentPrimary uppercase tracking-widest">Fixed Price</div>
           </div>
        </div>

        <button
           @click="submitErrand"
           :disabled="loading || !isFormValid"
           class="w-full py-8 bg-gray-900 text-white rounded-[2.5rem] text-xl font-bold shadow-lg shadow-black/20 hover:bg-parentPrimary hover:-translate-y-1 transition-all flex items-center justify-center gap-6 group disabled:opacity-20 border-b-[8px] border-black active:border-b-0 active:translate-y-2"
        >
          <span v-if="loading">Sending...</span>
          <div v-else class="flex items-center gap-4">
             <Zap class="w-8 h-8 group-hover:rotate-12 transition-transform" />
             Send Request
          </div>
        </button>
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
