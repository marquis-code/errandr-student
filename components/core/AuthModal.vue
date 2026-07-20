<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[100]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95 translate-y-4"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all">
              
              <!-- Header -->
              <div class="bg-gradient-to-r from-orange-50 to-white px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                <div>
                  <DialogTitle as="h3" class="text-xl font-bold text-gray-900 leading-tight">
                    Sign in to continue
                  </DialogTitle>
                  <p class="text-sm text-orange-600 font-medium mt-1">Join to track your errands and deliveries</p>
                </div>
                <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
                
                <div class="space-y-6">
                  <!-- Social Auth Prioritized -->
                  <button type="button" @click="handleFirebaseLogin" :disabled="firebaseLoading" class="w-full py-3.5 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Loader2 v-if="firebaseLoading" class="animate-spin w-6 h-6" />
                    <svg v-else class="w-6 h-6" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {{ firebaseLoading ? 'Connecting...' : 'Continue with Google' }}
                  </button>

                  <!-- Divider -->
                  <div class="flex items-center gap-3 my-4">
                    <div class="flex-1 h-px bg-gray-100" />
                    <span class="text-sm text-gray-400 font-bold">or use email</span>
                    <div class="flex-1 h-px bg-gray-100" />
                  </div>

                  <!-- Email/Password Auth -->
                  <form @submit.prevent="handleLogin" class="space-y-4">
                    <UiAnimatedInput v-model="email" type="email" label="Email" required />
                    <UiAnimatedInput v-model="password" type="password" label="Password" required />
                    
                    <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

                    <button type="submit" :disabled="loading"
                      class="w-full py-3.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#FF5C1A]/20">
                      <Loader2 v-if="loading" class="animate-spin w-5 h-5" />
                      {{ loading ? 'signing in...' : 'Sign in' }}
                    </button>
                  </form>
                  
                  <p class="text-center text-gray-500 font-medium text-sm mt-4">
                    Don't have an account? <NuxtLink @click="closeModal" to="/auth/register" class="text-[#FF5C1A] font-bold hover:underline">Sign up</NuxtLink>
                  </p>
                </div>

              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { Loader2 } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['update:isOpen', 'success'])

const { login, firebaseLogin, loading, firebaseLoading } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')

const closeModal = () => {
  if (loading.value) return
  emit('update:isOpen', false)
  error.value = ''
}

const handleFirebaseLogin = async () => {
  error.value = ''
  try {
    await firebaseLogin({ redirect: false })
    emit('success')
    closeModal()
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Google login failed'
  }
}

const handleLogin = async () => {
  error.value = ''
  try {
    await login({ email: email.value, password: password.value }, { redirect: false })
    emit('success')
    closeModal()
  } catch (e: any) {
    error.value = e.data?.message || 'Invalid credentials'
  }
}
</script>
