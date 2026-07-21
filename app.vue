<template>
  <div>
    <VitePwaManifest />
    <UiToast class="z-[9999999]" />
    <CoreNetworkStatusBanner />
    <UiGlobalLoader />
    <NuxtLayout class="z-10">
      <NuxtPage class="z-10" />
    </NuxtLayout>
    
    <CoreGlobalAdModal />
    <ChatWidget />
    <CorePushNotificationPrompt />
    
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

const { initCart } = useCart()
const { isLoggedIn } = useUser()
const { requestPermissionAndRegister, listenForNotifications } = useStudentNotifications()

initCart()
useRealtimeNotifications()

onMounted(() => {
  listenForNotifications()
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
