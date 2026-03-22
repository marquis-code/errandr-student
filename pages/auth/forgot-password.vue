<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
    <!-- Left Side: Image Panel -->
    <div class="hidden md:block w-1/2 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=1600&fit=crop" alt="Nigerian university students" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#065fdb]/80 via-[#065fdb]/70 to-black/80"></div>
      <div class="relative z-10 flex flex-col justify-between h-full p-6 md:p-12 lg:p-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
            <ShoppingBag class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-black text-white tracking-tighter">Errandr</span>
        </div>
        <div class="max-w-md">
          <h2 class="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">Reset your password securely.</h2>
          <p class="text-white/70 text-lg font-medium leading-relaxed">Don't worry, it happens to the best of us. We'll send you a secure 6-digit code to get you back into your account.</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 relative z-10">
      <div class="mb-12">
        <NuxtLink to="/auth/login" class="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8 group">
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </NuxtLink>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">forgot password</h1>
        <p class="text-gray-500 text-lg">Enter your email and we'll send a code to reset your password</p>
      </div>

      <form @submit.prevent="handleForgot" class="space-y-6 max-w-md">
        <UiAnimatedInput v-model="email" type="email" label="email address" required placeholder="" />

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-4 bg-[#065fdb] hover:bg-[#054ec0] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#065fdb]/20">
          <Loader2 v-if="loading" class="animate-spin w-5 h-5" />
          {{ loading ? 'sending code...' : 'send reset code' }}
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
import { ref } from 'vue'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })

const { forgotPassword, loading } = useAuth()
const email = ref('')
const error = ref('')

const handleForgot = async () => {
  error.value = ''
  try {
    await forgotPassword(email.value)
  } catch (e: any) {
    error.value = e.data?.message || 'failed to send reset code'
  }
}

useHead({ title: 'forgot password - Errandr' })
</script>
