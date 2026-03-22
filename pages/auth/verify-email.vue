<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
    <!-- Left Side: Image Panel -->
    <div class="hidden md:block w-1/2 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=1600&fit=crop" alt="Nigerian university students" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#22c55e]/80 via-[#22c55e]/70 to-black/80"></div>
      <div class="relative z-10 flex flex-col justify-between h-full p-6 md:p-12 lg:p-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
            <ShoppingBag class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-black text-white tracking-tighter">Errandr</span>
        </div>
        <div class="max-w-md">
          <h2 class="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">Verify your email.</h2>
          <p class="text-white/70 text-lg font-medium leading-relaxed">You're almost there! We've sent a 6-digit code to your inbox to make sure it's really you.</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 relative z-10">
      <div class="mb-12">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Check your inbox</h1>
        <p class="text-gray-500 text-lg">We sent a verification code to <span class="font-semibold text-gray-900">{{ email }}</span></p>
      </div>

      <form @submit.prevent="handleVerify" class="space-y-8 max-w-md">
        <div class="space-y-4">
          <label class="text-sm font-bold text-gray-700 ml-1">Verification code</label>
          <UiOtpInput v-model="otp" @complete="handleVerify" />
        </div>

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading || !otp"
          class="w-full py-4 bg-[#065fdb] hover:bg-[#054ec0] text-white rounded-[1.2rem] font-black text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-[#065fdb]/20 active:scale-95">
          <Loader2 v-if="loading" class="animate-spin w-5 h-5" />
          {{ loading ? 'Verifying...' : 'Verify email' }}
        </button>
      </form>

      <div class="mt-auto pt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShoppingBag } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })

const route = useRoute()
const { verifyOTP, loading } = useAuth()

const email = ref('')
const otp = ref('')
const error = ref('')

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email as string
  } else {
    navigateTo('/auth/login')
  }
})

const handleVerify = async () => {
  error.value = ''
  try {
    await verifyOTP(email.value, otp.value.trim())
  } catch (e: any) {
    error.value = e.data?.message || 'Invalid code or it has expired. Please double-check.'
  }
}

useHead({ title: 'Verify Email - Errandr' })
</script>
