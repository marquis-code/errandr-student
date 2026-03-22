import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

const toasts = ref<Toast[]>([])
let counter = 0

export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = counter++
    toasts.value.push({ id, message, type })
    
    // Use window.setTimeout for proper typing in Nuxt
    if (process.client) {
      window.setTimeout(() => {
        removeToast(id)
      }, 5000)
    }
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
