<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
    <!-- Left Side: Image Panel -->
    <div class="hidden md:block w-1/2 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=1600&fit=crop" alt="African students on campus" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#065fdb]/80 via-[#065fdb]/70 to-black/80"></div>
      <div class="relative z-10 flex flex-col justify-between h-full p-6 md:p-12 lg:p-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
            <ShoppingBag class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-black text-white tracking-tighter">Errandr</span>
        </div>
        <div class="max-w-md">
          <h2 class="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">Join the campus delivery revolution.</h2>
          <p class="text-white/70 text-lg font-medium leading-relaxed">Create your free account and start ordering food from your favorite campus spots today.</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 relative z-10 overflow-y-auto">
      <div class="mb-10">
        <div class="flex items-center gap-2 mb-6 md:hidden">
          <div class="w-8 h-8 rounded-lg bg-[#065fdb] flex items-center justify-center"><ShoppingBag class="w-4 h-4 text-white" /></div>
          <span class="text-xl font-bold text-gray-900 tracking-tight">Errandr</span>
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">create account</h1>
        <p class="text-gray-500 text-lg">Join the campus delivery community</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5 max-w-md">
        <div class="grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.firstName" type="text" label="first name" required placeholder="" />
          <UiAnimatedInput v-model="form.lastName" type="text" label="last name" required placeholder="" />
        </div>
        <UiAnimatedInput v-model="form.email" type="email" label="email address" required placeholder="" />
        <UiAnimatedInput v-model="form.phone" type="tel" label="phone number" placeholder="" />
        <UiAnimatedInput v-model="form.matricNumber" type="text" label="matric number" placeholder="" />
        <UiAnimatedInput v-model="form.password" type="password" label="password" required minlength="6" placeholder="" />

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-3 bg-[#065fdb] hover:bg-[#054ec0] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#065fdb]/20 mt-4">
          <Loader2 v-if="loading" class="animate-spin w-6 h-6" />
          {{ loading ? 'creating account...' : 'create account' }}
        </button>

        <p class="text-center text-gray-600 font-medium">
          Already have an account? <NuxtLink to="/auth/login" class="text-[#065fdb] font-bold hover:underline">Sign in</NuxtLink>
        </p>
      </form>

      <div class="mt-12 pt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 font-medium border-t border-gray-50">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShoppingBag } from 'lucide-vue-next'
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/modules/auth'
definePageMeta({ layout: false })
const { register, loading } = useAuth()
const error = ref('')
const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '', matricNumber: '' })
const handleRegister = async () => {
  error.value = ''
  try { await register(form) }
  catch (e: any) { error.value = e.data?.message || 'Registration failed' }
}
useHead({ title: 'Register - Errandr' })
</script>
