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
          <h2 class="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">Your campus cravings, delivered fast.</h2>
          <p class="text-white/70 text-lg font-medium leading-relaxed">Order from your favorite campus restaurants and get food delivered right to your hostel room.</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 relative z-10">
      <div class="mb-12">
        <div class="flex items-center gap-2 mb-8 md:hidden">
          <div class="w-8 h-8 rounded-lg bg-[#065fdb] flex items-center justify-center"><ShoppingBag class="w-4 h-4 text-white" /></div>
          <span class="text-xl font-bold text-gray-900 tracking-tight">Errandr</span>
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome back</h1>
        <p class="text-gray-500 text-lg">Sign in to order your favorites and track deliveries</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6 max-w-md">
        <UiAnimatedInput v-model="email" type="email" label="Email" required />
        <UiAnimatedInput v-model="password" type="password" label="Password" required />
        <div class="flex items-center justify-between">
          <NuxtLink to="/auth/forgot-password" class="text-sm font-semibold text-[#065fdb] hover:underline">Forgot your password?</NuxtLink>
        </div>

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-3 bg-[#065fdb] hover:bg-[#054ec0] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#065fdb]/20">
          <Loader2 v-if="loading" class="animate-spin w-6 h-6" />
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-gray-100" />
          <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">OR</span>
          <div class="flex-1 h-px bg-gray-100" />
        </div>

        <button type="button" class="w-full py-3.5 border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p class="text-center text-gray-600 font-medium mt-8">
          Don't have an account? <NuxtLink to="/auth/register" class="text-[#065fdb] font-bold hover:underline">Sign up</NuxtLink>
        </p>
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
import { ref } from 'vue'
import { useAuth } from '@/composables/modules/auth'
definePageMeta({ layout: false })
const { login, loading } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')
const handleLogin = async () => {
  error.value = ''
  try { await login({ email: email.value, password: password.value }) }
  catch (e: any) { error.value = e.data?.message || 'Invalid credentials' }
}
useHead({ title: 'Sign In - Errandr' })
</script>
