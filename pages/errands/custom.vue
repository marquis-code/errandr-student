<template>
  <div class="min-h-screen bg-white flex selection:bg-parentPrimary/10 selection:text-parentPrimary font-sans">
    
    <!-- Left Section: Branding & Visuals (Hidden on small screens) -->
    <div class="hidden lg:flex w-1/2 bg-gray-900 relative flex-col justify-between overflow-hidden">
      <!-- Abstract Background Elements -->
      <div class="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5"></div>
      <div class="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-parentPrimary/20 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[100px]"></div>

      <div class="relative z-10 p-12">
        <NuxtLink to="/" class="inline-block">
          <img src="@/assets/img/erranders.png" alt="Errander Logo" class="h-8" />
        </NuxtLink>
      </div>

      <div class="relative z-10 p-12 max-w-xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-bold mb-6">
          <Rocket class="w-4 h-4 text-parentPrimary" /> Set Your Own Price
        </div>
        <h1 class="text-5xl font-medium text-white tracking-tight leading-tight mb-6">
          Get anything done on campus. <span class="text-parentPrimary">Your way.</span>
        </h1>
        <p class="text-lg text-gray-400 font-medium leading-relaxed">
          Need a document printed? Groceries picked up? A quick run to the market? Set your fee, broadcast to thousands of student riders, and chat instantly.
        </p>

        <!-- Testimonial / Trust Badge -->
        <div class="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-parentPrimary to-orange-400 flex items-center justify-center shrink-0 border-2 border-gray-900">
            <ShieldCheck class="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 class="text-white font-bold mb-1">Escrow Protected</h4>
            <p class="text-sm text-gray-400 font-medium">Your funds are held safely until you confirm the errand is completed.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section: The Flow -->
    <div class="w-full lg:w-1/2 relative flex flex-col min-h-screen">
      
      <!-- Mobile Header -->
      <div class="lg:hidden p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10 sticky top-0">
        <NuxtLink to="/" class="inline-block">
           <img src="@/assets/img/erranders.png" alt="Errander Logo" class="h-6" />
        </NuxtLink>
        <button @click="$router.back()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Close Button Desktop -->
      <div class="hidden lg:flex absolute top-8 right-8 z-10">
        <button @click="$router.back()" class="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-105 transition-all shadow-sm">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 overflow-y-auto px-6 py-8 md:px-16 md:py-12 flex flex-col justify-center">
        <div class="max-w-md w-full mx-auto">
          
          <!-- Progress Indicator -->
          <div class="flex items-center gap-2 mb-10">
            <div class="flex-1 h-1.5 rounded-full transition-colors duration-300" :class="step >= 1 ? 'bg-parentPrimary' : 'bg-gray-100'"></div>
            <div class="flex-1 h-1.5 rounded-full transition-colors duration-300" :class="step >= 2 ? 'bg-parentPrimary' : 'bg-gray-100'"></div>
            <div class="flex-1 h-1.5 rounded-full transition-colors duration-300" :class="step >= 3 ? 'bg-parentPrimary' : 'bg-gray-100'"></div>
          </div>

          <!-- Step 1: Details -->
          <div v-if="step === 1" class="animate-fade-in space-y-8">
            <div>
              <h2 class="text-3xl font-medium text-gray-900 tracking-tight mb-2">Errand Details</h2>
              <p class="text-gray-500 font-medium text-sm">Tell us exactly what you need and where it's happening.</p>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700">What do you need done?</label>
                <textarea 
                  v-model="form.description" 
                  rows="4" 
                  placeholder="e.g. Go to Yaba market and buy me 3 yards of black velvet material."
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary transition-all outline-none resize-none placeholder:text-gray-400 shadow-inner"
                ></textarea>
              </div>
              
              <div class="space-y-2 relative group/field">
                <label class="text-sm font-bold text-gray-700">Market / Task Location (Optional)</label>
                <div class="relative">
                  <MapPin class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/field:text-parentPrimary transition-colors" />
                  <input 
                    v-model="form.pickupLocation" 
                    type="text" 
                    placeholder="e.g. Yaba Market (Leave blank if not applicable)"
                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-5 py-4 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary transition-all outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div class="space-y-2 relative group/field">
                <label class="text-sm font-bold text-gray-700">Drop-off Location</label>
                <div class="relative">
                  <Navigation class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/field:text-parentPrimary transition-colors" />
                  <input 
                    v-model="form.dropoffLocation" 
                    type="text" 
                    placeholder="e.g. Moremi Hall"
                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-5 py-4 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary transition-all outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div class="pt-6">
              <button 
                @click="step = 2" 
                :disabled="!isStep1Valid"
                class="w-full bg-gray-900 text-white font-bold py-4 px-8 rounded-2xl hover:bg-parentPrimary transition-all duration-300 disabled:opacity-30 disabled:hover:bg-gray-900 shadow-xl shadow-gray-900/10 flex justify-between items-center group"
              >
                <span>Continue to Pricing</span>
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <!-- Step 2: Financials -->
          <div v-if="step === 2" class="animate-fade-in space-y-8">
            <div>
              <h2 class="text-3xl font-medium text-gray-900 tracking-tight mb-2">Set Your Price</h2>
              <p class="text-gray-500 font-medium text-sm">You are in control. Offer a fair fee to get it accepted faster.</p>
            </div>
            
            <div class="bg-parentPrimary/5 border border-parentPrimary/10 rounded-2xl p-5 flex gap-4">
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-parentPrimary/10">
                <CircleDollarSign class="w-5 h-5 text-parentPrimary" />
              </div>
              <p class="text-sm text-gray-700 font-medium leading-relaxed">
                <span class="text-gray-900 font-bold">How it works:</span> 
                Set the item cost (if you are asking the rider to buy something) and the labor fee. The labor fee goes to escrow and is paid out only when the job is done.
              </p>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700">Estimated Item Cost</label>
                <p class="text-xs text-gray-500 font-medium mb-2">How much will the actual items cost? (Leave as 0 if just picking up/delivering).</p>
                <div class="relative group/field">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within/field:text-parentPrimary transition-colors">₦</span>
                  <input 
                    v-model.number="form.estimatedItemCost" 
                    type="number" 
                    placeholder="0"
                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-gray-900 font-medium text-lg focus:bg-white focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary transition-all outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div class="space-y-2 pt-2">
                <label class="text-sm font-bold text-gray-700">Runner Fee (Labor)</label>
                <p class="text-xs text-gray-500 font-medium mb-2">How much are you offering the rider for their effort?</p>
                <div class="relative group/field">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within/field:text-parentPrimary transition-colors">₦</span>
                  <input 
                    v-model.number="form.runnerFee" 
                    type="number" 
                    placeholder="1000"
                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-gray-900 font-medium text-lg focus:bg-white focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary transition-all outline-none placeholder:text-gray-400"
                  />
                </div>
                <!-- Quick Price Pills -->
                <div class="flex flex-wrap gap-2 mt-3">
                  <button @click="form.runnerFee = 500" class="px-4 py-2 text-sm font-bold border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition-all bg-white shadow-sm">₦500</button>
                  <button @click="form.runnerFee = 1000" class="px-4 py-2 text-sm font-bold border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition-all bg-white shadow-sm">₦1,000</button>
                  <button @click="form.runnerFee = 2000" class="px-4 py-2 text-sm font-bold border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition-all bg-white shadow-sm">₦2,000</button>
                  <button @click="form.runnerFee = 3500" class="px-4 py-2 text-sm font-bold border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition-all bg-white shadow-sm">₦3,500</button>
                </div>
              </div>
            </div>

            <div class="pt-6 flex gap-3">
              <button @click="step = 1" class="px-6 py-4 rounded-2xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 shrink-0">
                Back
              </button>
              <button 
                @click="step = 3" 
                :disabled="!isStep2Valid"
                class="flex-1 bg-gray-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-parentPrimary transition-all duration-300 disabled:opacity-30 disabled:hover:bg-gray-900 shadow-xl shadow-gray-900/10 flex justify-between items-center group"
              >
                <span>Review Request</span>
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <!-- Step 3: Summary -->
          <div v-if="step === 3" class="animate-fade-in space-y-8">
            <div>
              <h2 class="text-3xl font-medium text-gray-900 tracking-tight mb-2">Review Request</h2>
              <p class="text-gray-500 font-medium text-sm">Please review the financials before broadcasting to riders.</p>
            </div>
            
            <div class="bg-gray-50 rounded-[2rem] p-6 sm:p-8 border border-gray-100">
              
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <Package class="w-4 h-4 text-gray-500" />
                    </div>
                    <span class="text-sm font-bold text-gray-600">Est. Item Cost</span>
                  </div>
                  <span class="font-extrabold text-gray-900">₦{{ formatMoney(form.estimatedItemCost) }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <Target class="w-4 h-4 text-gray-500" />
                    </div>
                    <span class="text-sm font-bold text-gray-600">Runner Fee</span>
                  </div>
                  <span class="font-extrabold text-gray-900">₦{{ formatMoney(form.runnerFee) }}</span>
                </div>

                <div class="flex justify-between items-center border-b border-gray-200 pb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <Layers class="w-4 h-4 text-gray-500" />
                    </div>
                    <span class="text-sm font-bold text-gray-600">Platform Escrow Fee</span>
                  </div>
                  <span class="font-extrabold text-gray-900">₦50</span>
                </div>

                <div class="pt-2">
                  <div class="flex justify-between items-end">
                    <div>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Due on Acceptance</p>
                      <p class="text-sm text-gray-500 font-medium leading-tight max-w-[200px]">You only pay the Runner + Escrow fee once accepted.</p>
                    </div>
                    <span class="text-3xl font-extrabold text-parentPrimary tracking-tighter">₦{{ formatMoney(form.runnerFee + 50) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50/50 text-blue-800 text-sm p-5 rounded-2xl border border-blue-100 font-medium leading-relaxed flex gap-3">
              <Info class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p>Your request will be broadcasted to all available riders immediately. No payment is required until a rider accepts your fee.</p>
            </div>

            <div class="pt-4 flex flex-col gap-3">
              <div v-if="justAuthenticated" class="bg-green-50 text-green-800 text-sm p-4 rounded-xl border border-green-200 flex items-start gap-3 mb-2 animate-pulse-once">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="font-bold">Authentication Successful!</p>
                  <p class="font-medium opacity-90 mt-0.5">Thank you for logging in. Your errand details are perfectly saved! Please review them and click "Broadcast to Riders" when you're ready.</p>
                </div>
              </div>
              <button 
                @click="submitErrand" 
                :disabled="isSubmitting"
                class="w-full bg-parentPrimary text-white font-bold py-5 px-8 rounded-2xl hover:bg-orange-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-xl shadow-parentPrimary/20 hover:shadow-2xl hover:shadow-parentPrimary/30"
              >
                <Loader2 v-if="isSubmitting" class="animate-spin w-5 h-5 text-white" />
                <Rocket v-else class="w-5 h-5" />
                <span class="text-base">{{ isSubmitting ? 'Broadcasting...' : 'Broadcast to Riders' }}</span>
              </button>
              <button @click="step = 2" :disabled="isSubmitting" class="w-full font-bold text-gray-500 hover:text-gray-800 py-3 transition-colors">
                Go back to edit
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <CoreAuthModal :is-open="isAuthModalOpen" @update:is-open="isAuthModalOpen = $event" @success="handleAuthSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRouter } from '#imports'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useUser } from '@/composables/modules/auth/user'
import { 
  Rocket, ShieldCheck, MapPin, Navigation, 
  ArrowRight, X, CircleDollarSign, Package, Target, Layers, Info, Loader2 
} from 'lucide-vue-next'

definePageMeta({ layout: false }) // Use empty layout since this is a fullscreen takeover
useHead({ title: 'Request Custom Errand | Errander' })

const router = useRouter()
const { showToast } = useCustomToast()
const { isLoggedIn } = useUser()

const step = ref(1)
const isSubmitting = ref(false)
const isAuthModalOpen = ref(false)
const justAuthenticated = ref(false)

const form = ref({
  description: '',
  pickupLocation: '',
  dropoffLocation: '',
  estimatedItemCost: 0,
  runnerFee: 0,
})

const isStep1Valid = computed(() => {
  return form.value.description.trim().length > 5 && 
         form.value.dropoffLocation.trim().length > 2
})

const isStep2Valid = computed(() => {
  return form.value.runnerFee >= 200 // Minimum 200 NGN runner fee
})

const formatMoney = (amount: number) => {
  return (amount || 0).toLocaleString('en-NG')
}

const submitErrand = async () => {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
    return
  }

  isSubmitting.value = true
  
  try {
    const response = await api.post('/orders', {
      type: 'custom_errand',
      pickupLocation: form.value.pickupLocation,
      dropoffLocation: form.value.dropoffLocation,
      description: form.value.description,
      estimatedItemCost: form.value.estimatedItemCost || 0,
      runnerFee: form.value.runnerFee,
      urgency: 'standard'
    })

    if (response.data) {
      showToast({ title: 'Success!', message: 'Your custom errand is now live and waiting for a rider.', toastType: 'success' })
      router.push(`/dashboard/orders/${response.data._id}`)
    }
  } catch (error: any) {
    console.error(error)
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to submit errand request.', toastType: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleAuthSuccess = () => {
  justAuthenticated.value = true
}
</script>

<style scoped>
.animate-fade-in {
  animation: slideFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hide number input spinners for clean UI */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
