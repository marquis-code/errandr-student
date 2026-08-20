<template>
  <div>
    <VitePwaManifest />
    <UiToast />
    <CoreNetworkStatusBanner />
    <UiGlobalLoader />
    <NuxtLayout class="z-10">
      <NuxtPage class="z-10" />
    </NuxtLayout>
    
    <CoreGlobalAdModal />
    <ChatWidget />
    
    <!-- WhatsApp Floating Button -->
    <a 
      href="https://wa.me/2348123456789" 
      target="_blank" 
      rel="noopener noreferrer"
      class="fixed bottom-6 left-6 z-[999998] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <svg viewBox="0 0 24 24" class="w-8 h-8 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
    </a>

    <CorePushNotificationPrompt />
    <CoreCallOverlay />
    <RequirePhoneModal />
    
    <!-- Background Audio - Bottom Left -->
    <!-- <ClientOnly>
      <div class="fixed bottom-6 left-6 z-[999998]">
        <BackgroundAudio src="/audio/ambient-tranquility-serene-soundscapes-365048.mp3" />
      </div>
    </ClientOnly> -->
  </div>
</template>

<style>
body {
  font-family: 'Roobert PRO', sans-serif;
}
</style>

<script setup lang="ts">
// Global app configuration
import { onMounted, watch } from 'vue'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useCart } from '@/composables/modules/cart'
import { useStudentNotifications } from '@/composables/useStudentNotifications'
import { useUser } from '@/composables/modules/auth/user'
import { useWebRTC } from '@/composables/useWebRTC'

import { useAuth } from '@/composables/modules/auth'

const { initCart } = useCart()
const { isLoggedIn } = useUser()
const { requestPermissionAndRegister, listenForNotifications } = useStudentNotifications()
const { initSocketListeners } = useWebRTC()
const { checkRedirectResult } = useAuth()

initCart()
useRealtimeNotifications()

onMounted(() => {
  checkRedirectResult()
  listenForNotifications()
  initSocketListeners()
  if (isLoggedIn.value && 'Notification' in window && Notification.permission === 'granted') {
    requestPermissionAndRegister()
  }
})

watch(isLoggedIn, (newVal) => {
  if (newVal && 'Notification' in window && Notification.permission === 'granted') {
    requestPermissionAndRegister()
  }
})

useHead({
  title: 'Errandr - Student Portal',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})

useSeoMeta({
  title: 'Errandr — Student Portal',
  ogTitle: 'Errandr — Student Portal',
  description: 'Official Errandr Student Portal. Order food, track deliveries, and manage your student campus services.',
  ogDescription: 'Official Errandr Student Portal. Order food, track deliveries, and manage your student campus services.',
  keywords: 'Errandr student, campus delivery, student services, order food, track orders',
  author: 'Errandr Team',
  ogType: 'website',
  ogUrl: 'https://errandr.com/student',
  ogImage: 'https://errandr.com/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Errandr — Student Portal',
  twitterDescription: 'Official Errandr Student Portal. Order food, track deliveries, and manage your student campus services.',
  twitterImage: 'https://errandr.com/og-image.jpg'
})
</script>
