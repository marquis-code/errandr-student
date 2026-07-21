<template>
  <div v-if="showPrompt" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
      <div class="p-6 pb-0">
        <div class="flex items-start gap-4">
          <div class="bg-orange-100 p-3 rounded-2xl text-[#FF5C1A] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-ring"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
          </div>
          <div>
            <h4 class="text-xl font-black text-gray-900 leading-tight">Enable Push Notifications</h4>
            <p class="text-sm text-gray-500 mt-2 font-medium">Get real-time updates about your orders and exclusive Errander offers!</p>
          </div>
        </div>
      </div>
      <div class="p-6 flex items-center justify-end gap-3 mt-2">
        <button @click="dismiss" class="px-5 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
          Later
        </button>
        <button @click="enable" :disabled="loading" class="px-6 py-3 text-sm font-bold text-white bg-[#FF5C1A] hover:bg-orange-600 rounded-xl transition-colors flex items-center justify-center gap-2 min-w-[120px] shadow-lg shadow-orange-500/30">
          <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>Enable Now</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStudentNotifications } from '@/composables/useStudentNotifications'

const showPrompt = ref(false)
const loading = ref(false)
const { requestPermissionAndRegister } = useStudentNotifications()

onMounted(() => {
  // Only show the prompt if push messaging is supported and permission hasn't been asked yet
  if ('Notification' in window && 'serviceWorker' in navigator) {
    if (Notification.permission === 'default') {
      // Don't show immediately, give them a few seconds to settle in
      setTimeout(() => {
        showPrompt.value = true
      }, 3000)
    }
  }
})

const dismiss = () => {
  showPrompt.value = false
}

const enable = async () => {
  loading.value = true
  try {
    await requestPermissionAndRegister()
  } finally {
    loading.value = false
    showPrompt.value = false
  }
}
</script>
