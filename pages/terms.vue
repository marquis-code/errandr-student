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
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Terms of Service</h1>
      <p class="text-sm text-gray-400 mb-10">Last updated: January 15, 2026</p>

      <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-8">
        <section>
          <h2 class="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p>By accessing or using the Errandr platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the Terms, you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">2. Description of Service</h2>
          <p>Errandr is a technology platform that connects food buyers ("Students"), food sellers ("Vendors"), and delivery personnel ("Riders") within university campus environments across Nigeria. Errandr facilitates ordering, payment processing, and delivery coordination but does not itself prepare, sell, or deliver food.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">3. User Accounts</h2>
          <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use and for any activities or actions under your password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">4. Orders and Payments</h2>
          <p>All prices are displayed in Nigerian Naira (₦). Prices are set by Vendors and may change without notice. Delivery fees are determined by distance and vendor policies. Payment is processed securely through third-party payment processors (Paystack). By placing an order, you authorize the charge to your selected payment method. Refunds are handled on a case-by-case basis and must be requested within 24 hours of order delivery.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">5. Vendor Responsibilities</h2>
          <p>Vendors are solely responsible for the quality, safety, and accuracy of the food and products they list on the platform. Vendors must comply with all applicable food safety regulations and local health codes. Errandr does not guarantee the quality of any Vendor's products. Vendors must provide accurate menu descriptions, pricing, and availability information.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">6. Rider Code of Conduct</h2>
          <p>Riders are independent contractors, not employees of Errandr. Riders must handle all food deliveries with care and hygiene. Tampering with any order is strictly prohibited and will result in immediate, permanent suspension from the platform. Riders agree to comply with all campus rules and regulations while making deliveries.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">7. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Errandr Technologies Ltd. The Service is protected by copyright, trademark, and other laws of Nigeria. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">8. Privacy Policy</h2>
          <p>Your privacy is important to us. We collect and use personal data only as described in our Privacy Policy. By using the Service, you consent to the collection and use of information in accordance with our Privacy Policy. We do not sell your personal information to third parties. Data collected includes name, email, phone number, delivery address, order history, and payment information, all of which are stored securely and encrypted at rest.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">9. Limitation of Liability</h2>
          <p>In no event shall Errandr, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900">10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@errandr.com" class="text-[#065fdb] font-bold hover:underline">legal@errandr.com</a> or visit our <NuxtLink to="/contact" class="text-[#065fdb] font-bold hover:underline">Contact page</NuxtLink>.</p>
        </section>
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
import { ShoppingBag } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ title: 'Terms of Service - Errandr', meta: [{ name: 'description', content: 'Terms of Service for using the Errandr campus delivery platform.' }] })
</script>
