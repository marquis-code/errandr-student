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
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
              <div class="relative">
                <!-- Close Button -->
                <button 
                  @click="closeModal"
                  class="absolute -top-2 -right-2 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X class="w-5 h-5" />
                </button>

                <!-- Icon/Illustration -->
                <div class="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto animate-bounce-subtle">
                  🌙
                </div>

                <DialogTitle as="h3" class="text-2xl font-black text-center text-gray-900 leading-tight mb-2 tracking-tight">
                  {{ vendor?.storeName || 'Vendor' }} is Resting
                </DialogTitle>
                
                <p class="text-sm font-medium text-gray-500 text-center mb-8 px-4 leading-relaxed">
                  We're currently closed for the day. Check our schedule below to plan your next delicious meal!
                </p>

                <!-- Business Hours List -->
                <div class="bg-gray-50 rounded-3xl p-6 space-y-3 mb-8">
                  <div v-for="hour in sortedBusinessHours" :key="hour.day" 
                       class="flex items-center justify-between text-xs font-bold"
                       :class="isToday(hour.day) ? 'text-parentPrimary' : 'text-gray-400'">
                    <span class="uppercase tracking-widest">{{ hour.day }}</span>
                    <span v-if="hour.isClosed" class="uppercase opacity-60">Closed</span>
                    <span v-else>{{ formatTime(hour.open) }} - {{ formatTime(hour.close) }}</span>
                  </div>
                </div>

                <!-- Friendly CTA -->
                <button
                  type="button"
                  class="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-parentPrimary transition-all shadow-xl shadow-gray-200/50"
                  @click="closeModal"
                >
                  Got it, thanks!
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  vendor: any
}>()

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const sortedBusinessHours = computed(() => {
  if (!props.vendor?.businessHours) return []
  return [...props.vendor.businessHours].sort((a, b) => {
    return dayOrder.indexOf(a.day.toLowerCase()) - dayOrder.indexOf(b.day.toLowerCase())
  })
})

const isToday = (day: string) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  return day.toLowerCase() === today
}

const formatTime = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const formattedH = h % 12 || 12
  return `${formattedH}:${minutes} ${ampm}`
}
</script>

<style scoped>
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}
</style>
