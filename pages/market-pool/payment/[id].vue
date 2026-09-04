<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <header class="bg-white px-4 py-3 shadow-sm sticky top-0 z-50 flex items-center gap-3">
      <button @click="$router.push('/market-pool')" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-lg font-bold text-gray-900 leading-tight">Make Payment</h1>
    </header>

    <div class="p-4 space-y-6" v-if="!loading">
      <!-- Amount to Pay -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <p class="text-sm text-gray-500 font-medium mb-1">Total Amount Due</p>
        <h2 class="text-4xl font-black text-primary tracking-tight">₦{{ totalAmount.toLocaleString() }}</h2>
      </div>

      <!-- Bank Transfer Details -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-gray-50/50 px-5 py-4 border-b border-gray-100">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Bank Transfer Details
          </h3>
        </div>
        <div class="p-5 space-y-4">
          <p class="text-sm text-gray-600 mb-2">Please make a transfer to the account below and upload your proof of payment.</p>
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-sm text-gray-500">Bank Name</span>
              <span class="font-bold text-gray-900">{{ bankDetails.bankName }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-sm text-gray-500">Account Number</span>
              <span class="font-bold text-gray-900 text-lg">{{ bankDetails.accountNumber }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-sm text-gray-500">Account Name</span>
              <span class="font-bold text-gray-900">{{ bankDetails.accountName }}</span>
            </div>
          </div>
          
          <div class="flex gap-3 mt-4">
            <button @click="copyDetails" class="flex-1 flex justify-center items-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors border border-gray-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Copy Details
            </button>
            <button @click="shareDetails" class="flex-1 flex justify-center items-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors border border-gray-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              Share
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Proof -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 class="font-bold text-gray-900 mb-4">Upload Proof of Payment</h3>
        <label class="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" :class="{'border-primary bg-primary/5': previewUrl}">
          <input type="file" @change="handleFileUpload" accept="image/*" class="hidden">
          <div v-if="previewUrl">
            <img :src="previewUrl" class="h-32 mx-auto rounded-lg object-contain mb-3" />
            <span class="text-sm font-semibold text-primary">Change Image</span>
          </div>
          <div v-else class="space-y-2">
            <svg class="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm font-semibold text-gray-700">Tap to upload receipt</p>
            <p class="text-xs text-gray-500">JPEG, PNG up to 5MB</p>
          </div>
        </label>
      </div>

      <!-- Submit Action -->
      <button 
        @click="submitProof"
        :disabled="submitting || !proofFile || !previewUrl"
        class="w-full bg-primary text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-50 mt-4"
      >
        <div v-if="submitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span v-else>Submit Payment</span>
      </button>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p class="text-gray-500 font-medium">Loading details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GATEWAY_ENDPOINT_WITH_AUTH as api, GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useCustomToast } from '@/composables/core/useCustomToast'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const { showToast } = useCustomToast()

const orderId = route.params.id
const loading = ref(true)
const submitting = ref(false)
const uploadingImage = ref(false)

const bankDetails = ref({ bankName: '', accountNumber: '', accountName: '' })
const totalAmount = ref(0)
const proofFile = ref(null)
const previewUrl = ref(null)
const uploadedUrl = ref('')
onMounted(async () => {
  await fetchPaymentDetails()
})

const fetchPaymentDetails = async () => {
  try {
    const res = await api.get('/settings/market-pool/bank')
    bankDetails.value = res.data
    
    // We also need to get the order total.
    const ordersRes = await api.get('/market-pool/orders')
    const order = ordersRes.data.find(o => o._id === orderId)
    if (order) {
      totalAmount.value = order.totalItemCost + order.deliveryFee
    } else {
      showToast({ title: 'Error', message: 'Order not found', toastType: 'error' })
      router.push('/market-pool')
    }
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to load details', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    proofFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.url
}

const copyDetails = async () => {
  const text = `Erranders Market Pool Payment\nBank: ${bankDetails.value.bankName}\nAccount Number: ${bankDetails.value.accountNumber}\nAccount Name: ${bankDetails.value.accountName}\nTotal Amount: ₦${totalAmount.value.toLocaleString()}`
  try {
    await navigator.clipboard.writeText(text)
    showToast({ title: 'Copied!', message: 'Transfer details copied to clipboard.', toastType: 'success' })
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to copy text', toastType: 'error' })
  }
}

const shareDetails = async () => {
  const text = `Erranders Market Pool Payment\nBank: ${bankDetails.value.bankName}\nAccount Number: ${bankDetails.value.accountNumber}\nAccount Name: ${bankDetails.value.accountName}\nTotal Amount: ₦${totalAmount.value.toLocaleString()}`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Erranders Transfer Details',
        text: text
      })
      // Optional: show Toast for successful share if the browser doesn't do it
    } catch (err) {
      console.error('Error sharing:', err)
      // Only fallback to copy if it's an actual error (e.g. feature not supported), not if the user just closed the share sheet
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(text)
        showToast({ title: 'Copied', message: 'Share not supported. Details copied to clipboard.', toastType: 'success' })
      }
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    await navigator.clipboard.writeText(text)
    showToast({ title: 'Copied', message: 'Details copied to clipboard.', toastType: 'success' })
  }
}

const submitProof = async () => {
  if (!proofFile.value) return
  
  try {
    submitting.value = true
    const imageUrl = await uploadToCloudinary(proofFile.value)
    
    await api.post(`/market-pool/orders/${orderId}/proof`, {
      paymentProofUrl: imageUrl
    })
    
    showToast({ title: 'Success', message: 'Payment proof submitted! We will verify it shortly.', toastType: 'success' })
    router.push(`/market-pool/payment/success?orderId=${orderId}`)
  } catch (error) {
    console.error(error)
    showToast({ title: 'Error', message: 'Failed to submit payment proof', toastType: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>
