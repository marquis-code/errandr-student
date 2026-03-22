<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
    <!-- Left Side: Image Panel -->
    <div class="hidden md:block w-1/2 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=1600&fit=crop" alt="Nigerian university students" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0284c7]/80 via-[#0284c7]/70 to-black/80"></div>
      <div class="relative z-10 flex flex-col justify-between h-full p-6 md:p-12 lg:p-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
            <ShoppingBag class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-black text-white tracking-tighter">Errandr</span>
        </div>
        <div class="max-w-md">
          <h2 class="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">Choose a new password.</h2>
          <p class="text-white/70 text-lg font-medium leading-relaxed">Enter the 6-digit code sent to your email and choose a strong new password to get back to ordering.</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 relative z-10">
      <div class="mb-12">
        <NuxtLink to="/auth/verify-reset-otp" class="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8 group">
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </NuxtLink>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">set new password</h1>
        <p class="text-gray-500 text-lg">Choose a strong password to secure your account for <span class="font-semibold text-gray-900">{{ email }}</span></p>
      </div>

      <form @submit.prevent="handleReset" class="space-y-6 max-w-md">
        <UiAnimatedInput v-model="newPassword" type="password" label="new password" required minlength="8" placeholder="" />
        <UiAnimatedInput v-model="confirmPassword" type="password" label="confirm password" required minlength="8" placeholder="" />

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading || !newPassword || !confirmPassword"
          class="w-full py-4 bg-[#065fdb] hover:bg-[#054ec0] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#065fdb]/20">
          <Loader2 v-if="loading" class="animate-spin w-5 h-5" />
          {{ loading ? 'updating...' : 'set new password' }}
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
import { Loader2, ShoppingBag, ArrowLeft } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })

const route = useRoute()
const { resetPassword, loading } = useAuth()

const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')

onMounted(() => {
  if (route.query.email && route.query.otp) {
    email.value = route.query.email as string
  } else {
    navigateTo('/auth/forgot-password')
  }
})

const handleReset = async () => {
  error.value = ''
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match. Please try again.'
    return
  }
  try {
    await resetPassword({
      email: email.value,
      otp: (route.query.otp as string).trim(),
      newPassword: newPassword.value
    })
  } catch (e: any) {
    error.value = e.data?.message || 'Invalid code or it has expired. Please try requesting a new one.'
  }
}

useHead({ title: 'Reset Password - Errandr' })
</script>
