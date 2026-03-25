<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100 py-4">
      <div class="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
        </NuxtLink>
        <div class="flex items-center gap-8 text-[11px] font-black tracking-widest uppercase text-gray-400">
          <NuxtLink to="/about" class="hover:text-parentPrimary transition-colors">About</NuxtLink>
          <NuxtLink to="/contact" class="text-parentPrimary border-b-2 border-parentPrimary pb-1">Contact</NuxtLink>
          <NuxtLink to="/auth/login" class="px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-parentPrimary transition-all shadow-xl shadow-black/5">Sign In</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-parentPrimary/5 rounded-full blur-[100px] -translate-x-1/4"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-8">
          <span class="w-2 h-2 rounded-full bg-parentPrimary"></span>
          Direct Support
        </div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          We're here for <br />
          <span class="text-parentPrimary italic bg-parentPrimary/5 px-6 rounded-3xl">every student.</span>
        </h1>
        <p class="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed tracking-tight">
          Have a question about an order? Want to bring Errandr to your campus? Reach out to our dedicated support team.
        </p>
      </div>
    </section>

    <!-- Contact Cards -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6 sm:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Support Card -->
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-parentPrimary/10 rounded-2xl flex items-center justify-center text-parentPrimary mb-8 group-hover:scale-110 transition-transform">
              <Mail class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-black text-gray-900 tracking-tight mb-3">Email Support</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6">General inquiries and order issues.</p>
            <a href="mailto:support@errandr.shop" class="text-sm font-black text-parentPrimary hover:underline">support@errandr.shop</a>
          </div>

          <!-- Expansion Card -->
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Building class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-black text-gray-900 tracking-tight mb-3">Campus Launch</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6">Bring Errandr to your school environment.</p>
            <a href="mailto:expansion@errandr.shop" class="text-sm font-black text-emerald-600 hover:underline">expansion@errandr.shop</a>
          </div>

          <!-- Phone Card -->
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
              <Phone class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-black text-gray-900 tracking-tight mb-3">Instant Hotline</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6">Mon–Sat, 8AM–9PM local time.</p>
            <a href="tel:+23412345678" class="text-sm font-black text-indigo-600 hover:underline">+234 (0) 123 456 78</a>
          </div>

          <!-- Social Card -->
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-transform">
              <Instagram class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-black text-gray-900 tracking-tight mb-3">Social Pulse</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6">Updates and campus giveaways.</p>
            <div class="flex gap-4">
              <a href="#" class="text-sm font-black text-amber-600 hover:underline uppercase tracking-tight">IG</a>
              <a href="#" class="text-sm font-black text-amber-600 hover:underline uppercase tracking-tight">TW</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Office Section -->
    <section class="py-24 bg-gray-50/30">
      <div class="max-w-7xl mx-auto px-6 sm:px-10">
        <div class="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 flex flex-col md:flex-row items-center gap-16 shadow-sm">
          <div class="flex-1 space-y-8">
            <h2 class="text-4xl font-black text-gray-900 tracking-tight leading-[0.95]">Our Base of <br/><span class="text-parentPrimary">Operations.</span></h2>
            <p class="text-lg text-gray-500 font-bold leading-relaxed">Currently scaling from the CMUL campus to universities across Nigeria. Our core team is based in the heart of Lagos innovation.</p>
            <div class="space-y-4">
              <div class="flex items-center gap-4 text-gray-900 font-black">
                <MapPin class="w-5 h-5 text-parentPrimary" />
                42 Innovation Drive, Yaba, Lagos
              </div>
            </div>
          </div>
          <div class="flex-1 w-full h-[400px] bg-gray-100 rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-inner">
             <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop" class="w-full h-full object-cover" />
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
          <NuxtLink to="/terms" class="hover:text-gray-900 transition-colors">Terms</NuxtLink>
          <NuxtLink to="/faq" class="hover:text-gray-900 transition-colors">FAQ</NuxtLink>
          <NuxtLink to="/contact" class="text-parentPrimary font-black">Contact</NuxtLink>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© {{ new Date().getFullYear() }} Errandr Ltd • CMUL Native</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Mail, Phone, MapPin, Building, Instagram, ArrowRight } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ 
  title: 'Contact Errandr - Student Support',
  meta: [{ name: 'description', content: 'Reach out to Errandr for order support, partnerships, or campus expansion.' }] 
})
</script>
