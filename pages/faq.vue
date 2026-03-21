<template>
  <div class="min-h-screen bg-white">
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-[#065fdb] flex items-center justify-center"><ShoppingBag class="w-4 h-4 text-white" /></div>
          <span class="text-lg font-black text-gray-900 tracking-tight">Errandr</span>
        </NuxtLink>
        <div class="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <NuxtLink to="/about" class="hover:text-[#065fdb]">About</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-[#065fdb]">Contact</NuxtLink>
          <NuxtLink to="/faq" class="hover:text-[#065fdb]">FAQ</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-[#065fdb]">Terms</NuxtLink>
        </div>
      </div>
    </nav>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Frequently Asked Questions</h1>
      <p class="text-lg text-gray-500 mb-10">Everything you need to know about ordering on Errandr.</p>

      <div class="space-y-6">
        <div v-for="(faq, i) in faqs" :key="i" class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
          <button @click="openIndex = openIndex === i ? -1 : i" class="w-full flex items-center justify-between p-6 text-left">
            <span class="font-bold text-gray-900">{{ faq.q }}</span>
            <ChevronDown class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': openIndex === i }" />
          </button>
          <div v-show="openIndex === i" class="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
            {{ faq.a }}
          </div>
        </div>
      </div>

      <div class="mt-12 bg-[#065fdb]/5 rounded-2xl p-8 border border-[#065fdb]/10 text-center">
        <h3 class="font-bold text-gray-900 text-lg mb-2">Still have questions?</h3>
        <p class="text-gray-500 text-sm mb-4">Our support team is available Monday through Saturday, 8AM to 9PM.</p>
        <NuxtLink to="/contact" class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#065fdb] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#054ec0] transition-colors">Contact Support</NuxtLink>
      </div>
    </main>

    <footer class="bg-gray-50 border-t border-gray-200 py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium">
        <p>&copy; {{ new Date().getFullYear() }} Errandr Inc.</p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/about" class="hover:text-gray-600">About</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-gray-600">Contact</NuxtLink>
          <NuxtLink to="/faq" class="hover:text-gray-600">FAQ</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { ShoppingBag, ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'
definePageMeta({ layout: false })
useHead({ title: 'FAQ - Errandr', meta: [{ name: 'description', content: 'Frequently asked questions about ordering food and essentials on Errandr.' }] })
const openIndex = ref(0)
const faqs = [
  { q: 'How does Errandr work?', a: 'Browse menus from campus restaurants and vendors, add items to your cart, and place an order. A nearby student rider picks up your food and delivers it directly to your location on campus — hostel, library, or lecture hall.' },
  { q: 'Is Errandr available on my campus?', a: 'We are currently live at the University of Lagos, University of Ibadan, Covenant University, and Obafemi Awolowo University. We are expanding rapidly — email campuses@errandr.com if you want us at your school.' },
  { q: 'How much does delivery cost?', a: 'Delivery fees are set by each vendor and typically range from ₦100 to ₦500 depending on distance within campus. Many vendors offer free delivery for orders above a certain amount.' },
  { q: 'How do I pay for my order?', a: 'We support bank transfers, card payments via Paystack, and your Errandr wallet balance. You can top up your wallet at any time for faster checkouts.' },
  { q: 'How long does delivery take?', a: 'Since all deliveries are within campus, most orders arrive within 15–30 minutes. Estimated delivery time is shown before you place your order.' },
  { q: 'Can I track my order in real-time?', a: 'Yes! Once a rider accepts your order, you can track their location live on the map until delivery is complete.' },
  { q: 'What if there is a problem with my order?', a: 'You can report any issue directly from your order history page. Our support team reviews complaints within 1 hour during operating hours and will offer a refund or replacement as appropriate.' },
  { q: 'Can I schedule an order for later?', a: 'Some vendors support pre-ordering. Look for the "Pre-order" badge on vendor profiles to order in advance for a specific time.' },
  { q: 'How do I become a rider?', a: 'Visit the Errandr for Riders portal, create an account, and verify your student ID. Once approved, you can start accepting deliveries immediately.' },
]
</script>
