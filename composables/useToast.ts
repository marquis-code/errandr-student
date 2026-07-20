import { ref } from 'vue'

interface Toast {
  id: number
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info' | 'notification'
  action?: () => void
}

const toasts = ref<Toast[]>([])
let counter = 0

export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' | 'notification' = 'success', action?: () => void, title?: string) => {
    const id = counter++
    toasts.value.push({ id, title, message, type, action })
    
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
