// src/composables/core/useCustomToast.ts
import { useToast } from '@/composables/useToast'

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'notification'

interface ToastOptions {
  title: string
  message: string
  toastType: ToastType
  duration?: number
  action?: () => void
}

export const useCustomToast = () => {
  const { showToast: _showToast } = useToast()
  
  const showToast = (options: ToastOptions) => {
    const { title, message, toastType, action } = options
    
    // Pass title to the new _showToast signature
    return _showToast(message, toastType, action, title)
  }
  
  return {
    showToast
  }
}