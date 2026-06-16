<template>
  <div class="max-w-3xl animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary px-4 md:px-0">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p class="text-sm text-gray-500">Manage your account preferences and notifications.</p>
    </div>

    <!-- Notification Settings -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-50 flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 shrink-0">
          <Bell class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900">Notifications</h2>
          <p class="text-sm text-gray-500 mt-0.5">Choose how we contact you</p>
        </div>
      </div>
      
      <div class="p-6">
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-gray-900">Email Notifications</h3>
              <p class="text-xs text-gray-500 mt-0.5">Receive booking confirmations and updates</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-gray-900">SMS Notifications</h3>
              <p class="text-xs text-gray-500 mt-0.5">Receive reminders via text message</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-gray-900">Marketing & Promos</h3>
              <p class="text-xs text-gray-500 mt-0.5">Special offers and venue updates</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Security Settings -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-50 flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 shrink-0">
          <Shield class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900">Security</h2>
          <p class="text-sm text-gray-500 mt-0.5">Manage your account security</p>
        </div>
      </div>
      
      <div class="p-6">
        <button class="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-gray-900 hover:bg-gray-50 transition-all group">
          <div class="flex items-center gap-4">
            <Lock class="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
            <div class="text-left">
              <h3 class="text-sm font-bold text-gray-900">Change Password</h3>
              <p class="text-xs text-gray-500 mt-0.5">Update your password to keep your account secure</p>
            </div>
          </div>
          <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
        </button>
      </div>
    </div>
    
    <!-- Danger Zone -->
    <div class="bg-white rounded-3xl border border-red-100 shadow-sm overflow-hidden mb-8">
      <div class="p-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 class="text-lg font-bold text-red-600 mb-1">Delete Account</h3>
            <p class="text-sm text-gray-500 max-w-sm">Permanently remove your account and all associated data. This action cannot be undone.</p>
          </div>
          <button class="px-6 py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white transition-colors border border-red-100 w-full md:w-auto text-center shrink-0">
            Delete Account
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Bell, Shield, Lock, ChevronRight } from 'lucide-vue-next';

definePageMeta({
  layout: 'student'
});

useHead({ title: 'Settings - Errandr' });
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
