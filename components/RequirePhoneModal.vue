<template>
  <div v-if="showModal" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
    <!-- Backdrop overlay with intense blur -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.stop></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
      <div class="p-8">
        <div class="w-16 h-16 bg-parentPrimary/10 text-parentPrimary rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">We Need Your Number</h2>
        <p class="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          To ensure seamless deliveries and updates, please provide a valid phone number. You won't be able to checkout without one!
        </p>

        <form @submit.prevent="submitPhoneNumber" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-2 tracking-wide uppercase">Phone Number</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+234</span>
              <input
                v-model="phoneNumber"
                type="tel"
                placeholder="801 234 5678"
                class="w-full pl-14 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 focus:bg-white rounded-xl text-lg font-bold text-gray-900 outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting || !phoneNumber"
            class="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-wider hover:bg-parentPrimary transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10 disabled:opacity-50"
          >
            <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span v-else>Save Phone Number</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { users_api } from '@/api_factory/modules/users'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { user, isLoggedIn } = useUser()
const { showToast } = useCustomToast()

const showModal = computed(() => {
  return isLoggedIn.value && user.value && (!user.value.phone || user.value.phone.trim() === '');
});

const phoneNumber = ref('')
const isSubmitting = ref(false)

const submitPhoneNumber = async () => {
  if (!phoneNumber.value) return;
  isSubmitting.value = true;
  
  try {
    let formattedPhone = phoneNumber.value;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = formattedPhone.substring(1);
    }
    const finalPhone = '+234' + formattedPhone.replace(/\s+/g, '');

    await users_api.updateProfile({ phone: finalPhone });
    
    // Update local user state instantly
    if (user.value) {
      user.value.phone = finalPhone;
    }
    
    showToast({
      title: 'Success',
      message: 'Your phone number has been saved successfully!',
      toastType: 'success'
    });
  } catch (err: any) {
    showToast({
      title: 'Error',
      message: err.response?.data?.message || 'Failed to update phone number.',
      toastType: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes scaleUp {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
