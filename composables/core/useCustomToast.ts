// src/composables/core/useCustomToast.ts
import { useToast } from '@/composables/useToast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  title: string
  message: string
  toastType: ToastType
  duration?: number
}

export const useCustomToast = () => {
  const { showToast: _showToast } = useToast()
  
  const showToast = (options: ToastOptions) => {
    const { title, message, toastType } = options
    
    // Format message to include title for standard toast component
    const fullMessage = title ? `${title}: ${message}` : message
    
    return _showToast(fullMessage, toastType)
  }
  
  return {
    showToast
  }
}