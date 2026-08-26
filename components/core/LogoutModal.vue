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
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
          >
            <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-xl transition-all border border-slate-100">
              
              <div class="relative">
                <!-- Close Button -->
                <button 
                  @click="closeModal"
                  class="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <XIcon class="w-4 h-4" />
                </button>

                <!-- Icon/Illustration -->
                <div class="flex justify-center mb-5 mt-2">
                  <div class="w-20 h-20 rounded-full bg-orange-50 border-8 border-orange-100/50 flex items-center justify-center text-parentPrimary">
                    <FrownIcon class="w-8 h-8" />
                  </div>
                </div>

                <!-- Text Content -->
                <div class="text-center mb-8">
                  <h3 class="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    Leaving so soon? 🥺
                  </h3>
                  <p class="text-sm font-medium text-slate-500 leading-relaxed px-2">
                    Who will order food now? Your cart and favorite vendors will be waiting for you.
                  </p>
                </div>

                <!-- Actions -->
                <div class="space-y-3">
                  <button 
                    @click="closeModal" 
                    class="w-full py-3.5 px-4 bg-parentPrimary hover:bg-parentPrimary/90 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-parentPrimary/20 hover:-translate-y-0.5"
                  >
                    Stay on Errander
                  </button>
                  <button 
                    @click="confirmLogout" 
                    :disabled="loading"
                    class="w-full py-3.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold rounded-xl transition-all border border-rose-100 flex items-center justify-center disabled:opacity-50"
                  >
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                    <span>Yes, log me out</span>
                  </button>
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
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { X as XIcon, Frown as FrownIcon, Loader2 } from 'lucide-vue-next'
import { useUser } from "@/composables/modules/auth/user"

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const { logOut } = useUser()
const loading = ref(false)

const closeModal = () => {
  if (loading.value) return
  emit('close')
}

const confirmLogout = async () => {
  loading.value = true
  try {
    await logOut()
    window.location.href = '/'
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    closeModal()
  }
}
</script>
