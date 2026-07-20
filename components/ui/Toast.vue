<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full items-end px-4 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast-base',
            {
              'bg-[#FEF3F2] border-[#FF383013]': toast.type === 'error',
              'bg-green-50 border-primary-200': toast.type === 'success',
              'bg-yellow-50 border-yellow-200': toast.type === 'warning',
              'bg-blue-50 border-blue-200': toast.type === 'info',
              'bg-white border-gray-200 shadow-lg': toast.type === 'notification'
            }
          ]"
          class="w-full rounded-2xl border p-[12px] flex items-center gap-3 cursor-pointer pointer-events-auto"
          @click="toast.action ? toast.action() : null; removeToast(toast.id)"
        >
          <div class="flex-shrink-0">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center',
              {
                'text-white': toast.type === 'error',
                'bg-primary-500 text-white': toast.type === 'success', 
                'bg-yellow-500 text-white': toast.type === 'warning',
                'bg-blue-500 text-white': toast.type === 'info',
                'bg-white border': toast.type === 'notification'
              }
            ]">
              <CheckCircle v-if="toast.type === 'success'" :size="18" />
              <AlertCircle v-else-if="toast.type === 'error'" :size="18" />
              <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" />
              <img v-else-if="toast.type === 'notification'" :src="errandersLogo" alt="Erranders" class="w-5 h-5 object-contain rounded-full" />
              <Info v-else :size="18" />
            </div>
          </div>
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <h4 v-if="toast.title" :class="[
              'font-bold text-sm mb-0.5',
              {
                'text-[#FF3830]': toast.type === 'error',
                'text-primary-800': toast.type === 'success',
                'text-yellow-800': toast.type === 'warning', 
                'text-blue-800': toast.type === 'info',
                'text-gray-900': toast.type === 'notification'
              }
            ]">
              {{ toast.title }}
            </h4>
            <p :class="[
              'font-medium leading-tight',
              toast.title ? 'text-xs opacity-90' : 'text-sm',
              {
                'text-[#FF3830]': toast.type === 'error',
                'text-primary-800': toast.type === 'success',
                'text-yellow-800': toast.type === 'warning', 
                'text-blue-800': toast.type === 'info',
                'text-gray-600': toast.type === 'notification'
              }
            ]">
              {{ toast.message }}
            </p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import errandersLogo from '@/assets/img/erranders.png'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
/* Animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-base {
  transition: all 0.2s ease-in-out;
}

.toast-base:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>