<template>
  <div class="min-h-screen bg-white">
    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-[#065fdb] flex items-center justify-center"><ShoppingBag class="w-4 h-4 text-white" /></div>
          <span class="text-lg font-black text-gray-900 tracking-tight">Errandr</span>
        </NuxtLink>
        <div class="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <NuxtLink to="/about" class="hover:text-[#065fdb] transition-colors">About</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-[#065fdb] transition-colors">Contact</NuxtLink>
          <NuxtLink to="/faq" class="hover:text-[#065fdb] transition-colors">FAQ</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-[#065fdb] transition-colors">Terms</NuxtLink>
          <NuxtLink to="/auth/login" class="text-[#065fdb] font-bold">Sign In</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">About Errandr</h1>
      <p class="text-lg text-gray-500 mb-10">The campus delivery platform built for students, by students.</p>

      <div class="prose prose-gray max-w-none">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          Errandr was born out of a simple frustration: getting food delivered on campus shouldn't be this hard. Founded in 2024 by a group of Nigerian university students, we set out to build a delivery platform designed specifically for the unique needs of campus communities across Nigeria.
        </p>
        <p class="text-gray-600 leading-relaxed mb-6">
          Unlike traditional delivery apps that focus on metropolitan areas with long-distance logistics, Errandr operates exclusively within university campuses. This hyper-local focus allows us to offer faster deliveries, lower fees, and a deeply personal experience for both students ordering food and the vendors who serve them.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Mission</h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          To connect every student with their favorite campus meals and essentials through a reliable, affordable, and community-driven delivery network — while creating earning opportunities for student riders.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div class="w-10 h-10 bg-[#065fdb]/10 rounded-xl flex items-center justify-center text-[#065fdb] mb-4"><Search class="w-5 h-5" /></div>
            <h3 class="font-bold text-gray-900 mb-2">Browse & Order</h3>
            <p class="text-sm text-gray-500">Explore menus from restaurants, eateries, and student-run businesses right on your campus.</p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4"><Bike class="w-5 h-5" /></div>
            <h3 class="font-bold text-gray-900 mb-2">Campus Riders Deliver</h3>
            <p class="text-sm text-gray-500">Fellow students pick up your order and walk or ride it directly to your hostel, library, or lecture hall.</p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4"><Star class="w-5 h-5" /></div>
            <h3 class="font-bold text-gray-900 mb-2">Rate & Repeat</h3>
            <p class="text-sm text-gray-500">Leave reviews, save your favorites, and reorder in seconds. Building the campus food community together.</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Values</h2>
        <ul class="space-y-3 text-gray-600">
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-[#065fdb] mt-0.5 shrink-0" /> <span><strong>Community First:</strong> We are students serving students. Every decision we make is to strengthen campus communities.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-[#065fdb] mt-0.5 shrink-0" /> <span><strong>Accessibility:</strong> Low delivery fees and no minimum spend ensures every student can access the platform.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-[#065fdb] mt-0.5 shrink-0" /> <span><strong>Empowerment:</strong> We create real earning opportunities for student riders and small campus vendors.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-[#065fdb] mt-0.5 shrink-0" /> <span><strong>Reliability:</strong> On-time delivery and quality food handling are non-negotiable.</span></li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Campuses We Serve</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          We are currently live on select campuses across Nigeria and expanding rapidly. If your university isn't listed yet, reach out — we'd love to launch there.
        </p>
        <div class="flex flex-wrap gap-2 mb-8">
          <span class="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">University of Lagos</span>
          <span class="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">University of Ibadan</span>
          <span class="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">Covenant University</span>
          <span class="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">Obafemi Awolowo University</span>
          <span class="px-3 py-1.5 bg-[#065fdb]/10 rounded-full text-sm font-bold text-[#065fdb]">+ More coming soon</span>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium">
        <p>&copy; {{ new Date().getFullYear() }} Errandr Inc. All rights reserved.</p>
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
import { ShoppingBag, Search, Bike, Star, CheckCircle } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ title: 'About Us - Errandr', meta: [{ name: 'description', content: 'Learn about Errandr — the campus food and essentials delivery platform for Nigerian university students.' }] })
</script>
