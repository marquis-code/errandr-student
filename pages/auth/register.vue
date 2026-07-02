<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
    <!-- Form Card -->
    <div class="w-full max-w-md flex flex-col justify-center px-0 sm:px-6 py-12 bg-white sm:rounded-[2rem] relative z-10 my-8">
      <div class="mb-10 text-center flex flex-col items-center">
        <NuxtLink to="/" class="flex items-center gap-2 mb-8 inline-block group">
                 <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-10" alt="Errandr" />
          </div>
        </NuxtLink>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">create account</h1>
        <p class="text-gray-500 text-lg">Join the campus delivery community</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5 max-w-md w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.firstName" type="text" label="first name" required placeholder="" />
          <UiAnimatedInput v-model="form.lastName" type="text" label="last name" required placeholder="" />
        </div>
        <UiAnimatedInput v-model="form.email" type="email" label="email address" required placeholder="" />
        <UiAnimatedInput v-model="form.phone" type="tel" label="phone number" placeholder="" />
        <UiAnimatedInput v-model="form.matricNumber" type="text" label="matric number" placeholder="" />
        <UiAnimatedInput v-model="form.password" type="password" label="password" required minlength="6" placeholder="" />
        <BirthdayPicker v-model="form.dateOfBirth" />
        <UiAnimatedInput v-model="form.referredBy" type="text" label="referral code (optional)" placeholder="Who referred you?" @input="formatReferralCode" />

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading || validatingReferral"
          class="w-full py-3 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#FF5C1A]/20 mt-4">
          <Loader2 v-if="loading || validatingReferral" class="animate-spin w-6 h-6" />
          {{ loading || validatingReferral ? 'validating...' : 'create account' }}
        </button>

        <p class="text-center text-gray-600 font-medium">
          Already have an account? <NuxtLink to="/auth/login" class="text-[#FF5C1A] font-bold hover:underline">Sign in</NuxtLink>
        </p>
      </form>

      <div class="mt-12 pt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-medium border-t border-gray-50">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShoppingBag } from 'lucide-vue-next'
import { ref, reactive, watch } from 'vue'
import BirthdayPicker from '@/components/BirthdayPicker.vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useAuth } from '@/composables/modules/auth'
definePageMeta({ layout: false })
const { register, loading } = useAuth()
const error = ref('')
const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '', matricNumber: '', referredBy: '', dateOfBirth: '' })

const validatingReferral = ref(false)

const formatReferralCode = () => {
  if (!form.referredBy) return;
  let val = form.referredBy;
  let formatted = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (formatted.startsWith('ERR-')) {
    formatted = formatted.substring(4);
  } else if (formatted.startsWith('ERR')) {
    formatted = formatted.substring(3);
  } else if (formatted.startsWith('ER')) {
    formatted = formatted.substring(2);
  } else if (formatted.startsWith('E')) {
    formatted = formatted.substring(1);
  }
  
  if (formatted.length > 0) {
    form.referredBy = 'ERR-' + formatted.replace(/-/g, '');
  } else if (val.length > 0 && !['ERR', 'ER', 'E'].includes(val.toUpperCase())) {
     form.referredBy = 'ERR-';
  } else {
    form.referredBy = val.toUpperCase();
  }
}

const handleRegister = async () => {
  error.value = ''
  
  if (form.referredBy) {
    validatingReferral.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get(`/referrals/validate-code/${form.referredBy}`)
      if (res?.data?.type === 'ERROR' || res?.type === 'ERROR') throw res;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.data?.message || 'Invalid referral code.'
      return
    } finally {
      validatingReferral.value = false
    }
  }

  try { await register(form) }
  catch (e: any) { error.value = e.data?.message || 'Registration failed' }
}
useHead({ title: 'Register - Errandr' })
</script>
