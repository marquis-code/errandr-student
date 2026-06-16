<template>
  <div class="max-w-3xl animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary px-4 md:px-0">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
      <p class="text-sm text-gray-500">Manage your personal information and preferences.</p>
    </div>

    <!-- Main Profile Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <!-- Header / Avatar Area -->
      <div class="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center gap-8">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-lg">
            {{ userInitials }}
          </div>
          <button class="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-parentPrimary transition-colors">
            <Camera class="w-4 h-4" />
          </button>
        </div>
        <div class="text-center md:text-left flex-1">
          <h2 class="text-xl font-bold text-gray-900">{{ fullName }}</h2>
          <p class="text-gray-500 mt-1">{{ user?.email }}</p>
        </div>
        <div>
          <button class="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>

      <!-- Form Area -->
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">First name</label>
            <input 
              type="text" 
              :value="user?.firstName"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-sm outline-none"
            >
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Last name</label>
            <input 
              type="text" 
              :value="user?.lastName"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-sm outline-none"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Mobile number</label>
            <input 
              type="tel" 
              :value="user?.phoneNumber"
              placeholder="+234"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-sm outline-none"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Email</label>
            <input 
              type="email" 
              :value="user?.email"
              readonly
              class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm outline-none cursor-not-allowed"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Date of birth</label>
            <input 
              type="date" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-sm outline-none"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Gender</label>
            <select class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-sm outline-none appearance-none">
              <option value="" disabled selected>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Addresses Section -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-900">My addresses</h2>
          <p class="text-sm text-gray-500 mt-0.5">Manage your saved locations</p>
        </div>
        <button class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
          <Plus class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6">
        <!-- Empty State / Placeholder -->
        <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-parentPrimary/30 cursor-pointer transition-colors group">
          <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors">
            <Home class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-bold text-gray-900">Home</h3>
            <p class="text-xs text-gray-500 mt-0.5">Add a home address</p>
          </div>
          <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-parentPrimary transition-colors" />
        </div>

        <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl mt-3 hover:border-parentPrimary/30 cursor-pointer transition-colors group">
          <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors">
            <Briefcase class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-bold text-gray-900">Work</h3>
            <p class="text-xs text-gray-500 mt-0.5">Add a work address</p>
          </div>
          <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-parentPrimary transition-colors" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUser } from '@/composables/modules/auth/user';
import { Camera, Plus, Home, Briefcase, ChevronRight } from 'lucide-vue-next';

const { user, fullName } = useUser();

definePageMeta({
  layout: 'student',
});

useHead({ title: 'My Profile - Errandr' });

const userInitials = computed(() => {
  if (!user.value) return 'S';
  const first = user.value.firstName || '';
  const last = user.value.lastName || '';
  return (first[0] || last[0] || user.value.email?.[0] || 'S').toUpperCase();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
