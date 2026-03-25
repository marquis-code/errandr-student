<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100 py-4">
      <div class="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
        </NuxtLink>
        <div class="flex items-center gap-8 text-[11px] font-black tracking-widest uppercase">
          <NuxtLink to="/about" class="text-gray-400 hover:text-parentPrimary transition-colors">About</NuxtLink>
          <NuxtLink to="/terms" class="text-parentPrimary border-b-2 border-parentPrimary pb-1">Terms</NuxtLink>
          <NuxtLink to="/auth/login" class="px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-parentPrimary transition-all shadow-xl shadow-black/5">Sign In</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden bg-gray-50/30">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-parentPrimary/5 rounded-full blur-[120px] translate-x-1/4"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-100 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-8 shadow-sm">
          <FileText class="w-3.5 h-3.5 text-parentPrimary" />
          Legal Framework
        </div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          Terms of <span class="text-parentPrimary italic">Service.</span>
        </h1>
        <p class="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase">Last updated: January 25, 2026</p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-24 bg-white">
      <div class="max-w-4xl mx-auto px-6 sm:px-10">
        <div class="space-y-16">
          <div v-for="(section, index) in termsSections" :key="index" class="group">
            <div class="flex gap-8">
              <span class="text-4xl font-black text-parentPrimary/10 group-hover:text-parentPrimary/20 transition-colors tabular-nums">
                {{ (index + 1).toString().padStart(2, '0') }}
              </span>
              <div class="space-y-4">
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">{{ section.title }}</h2>
                <div class="text-lg text-gray-500 font-bold leading-relaxed tracking-tight" v-html="section.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-100 py-16 mt-20">
      <div class="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col md:flex-row justify-between items-center gap-10">
        <NuxtLink to="/" class="group">
          <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-10 w-auto object-contain transition-transform group-hover:scale-110" />
        </NuxtLink>
        <div class="flex items-center gap-10 text-[10px] font-black tracking-[0.15em] uppercase text-gray-400">
          <NuxtLink to="/about" class="hover:text-gray-900 transition-colors">About Us</NuxtLink>
          <NuxtLink to="/terms" class="text-parentPrimary font-black">Terms</NuxtLink>
          <NuxtLink to="/faq" class="hover:text-gray-900 transition-colors">FAQ</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-gray-900 transition-colors">Contact</NuxtLink>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© {{ new Date().getFullYear() }} Errandr Ltd • Community Driven</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ 
  title: 'Terms of Service - Errandr',
  meta: [{ name: 'description', content: 'Legal framework and guidelines for using the Errandr campus delivery platform.' }] 
})

const termsSections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using the Errandr platform (\"Service\"), you agree to be bound by these Terms of Service. Disagreement with any part of these terms prevents usage of our Service. These terms apply to all Students, Vendors, and Riders."
  },
  {
    title: "Description of Service",
    content: "Errandr is a technology platform connecting food buyers, sellers, and delivery personnel within university campus environments. We facilitate coordination but do not prepare, sell, or deliver food ourselves."
  },
  {
    title: "User Accounts",
    content: "Accurate information is mandatory. Failure to provide current data constitutes a breach of Terms. You are responsible for safeguarding your password and all activities under your account. Notify us immediately of any security breach."
  },
  {
    title: "Orders and Payments",
    content: "All prices are in Nigerian Naira (₦). Vendors set pricing, which may change without notice. Payments are processed securely via Paystack. Refunds are handled case-by-case within 24 hours of delivery."
  },
  {
    title: "Vendor Responsibilities",
    content: "Vendors are solely responsible for product quality and safety, complying with all health codes. Errandr facilitates the connection but does not guarantee the end-product quality."
  },
  {
    title: "Rider Code of Conduct",
    content: "Riders are independent contractors. Hygiene and care are non-negotiable. Any tampering results in immediate, permanent suspension. Riders must at all times comply with University rules."
  },
  {
    title: "Intellectual Property",
    content: "Errandr Technologies Ltd exclusively owns the Service and its original content. Our trademarks and trade dress are protected by Nigerian law and cannot be used without prior written consent."
  },
  {
    title: "Privacy Policy",
    content: "We collect and use personal data only as described in our Privacy Policy. Data includes name, email, phone, and delivery history — all encrypted and never sold to third parties."
  },
  {
    title: "Limitation of Liability",
    content: "Errandr and its affiliates shall not be liable for any indirect, incidental, or punitive damages resulting from your access to or use of the Service."
  },
  {
    title: "Contact Us",
    content: "Questions regarding these Terms should be directed to <a href='mailto:legal@errandr.shop' class='text-parentPrimary hover:underline'>legal@errandr.shop</a> or via our Contact page."
  }
]
</script>
