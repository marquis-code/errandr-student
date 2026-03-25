<template>
  <div class="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0">
    <h1 class="text-2xl font-bold text-dark-900">Report a Vendor</h1>
    <p class="text-dark-400">Have an issue with an order or vendor? Let us know and we'll handle it.</p>

    <!-- My Reports -->
    <div v-if="reports.length > 0" class="space-y-3">
      <h2 class="section-title text-base">My Reports</h2>
      <NuxtLink
        v-for="report in reports"
        :key="report._id"
        :to="`/support/${report._id}`"
        class="bg-white border border-dark-100 shadow-sm p-4 rounded-xl flex items-center gap-3 transition-all hover:border-primary-500"
      >
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" :class="statusBg(report.status)">
          {{ statusIcon(report.status) }}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-dark-900 text-sm truncate">{{ report.title }}</h3>
          <p class="text-xs text-dark-400">{{ report.vendor?.storeName }} • {{ timeAgo(report.createdAt) }}</p>
        </div>
        <span :class="statusBadge(report.status)" class="text-xs capitalize">{{ report.status }}</span>
      </NuxtLink>
    </div>

    <!-- New Report Form -->
    <div class="bg-white border border-dark-100 shadow-sm p-6 rounded-2xl">
      <h2 class="font-semibold text-dark-900 mb-4">Submit New Report</h2>
      <form @submit.prevent="submitReport" class="space-y-3">
        <div>
          <label class="block text-sm text-dark-500 font-medium mb-1.5">Category</label>
          <select v-model="form.category" class="glass-input w-full" required>
            <option value="" disabled>Select a category</option>
            <option value="food_quality">🍽️ Food Quality Issue</option>
            <option value="late_delivery">⏰ Late Delivery</option>
            <option value="wrong_order">❌ Wrong Order</option>
            <option value="rude_behavior">😤 Rude Behavior</option>
            <option value="overcharging">💰 Overcharging</option>
            <option value="hygiene">🧹 Hygiene Concern</option>
            <option value="other">📋 Other</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-dark-500 font-medium mb-1.5">Vendor</label>
          <input v-model="form.vendorName" placeholder="Vendor or store name" class="glass-input w-full" />
        </div>
        <div>
          <label class="block text-sm text-dark-500 font-medium mb-1.5">Title</label>
          <input v-model="form.title" placeholder="Brief summary of the issue" class="glass-input w-full" required />
        </div>
        <div>
          <label class="block text-sm text-dark-500 font-medium mb-1.5">Description</label>
          <textarea v-model="form.description" placeholder="Describe your issue in detail..." class="glass-input w-full h-28 resize-none" required />
        </div>
        <button type="submit" :disabled="submitting" class="btn-primary w-full">
          {{ submitting ? 'Submitting...' : '📩 Submit Report' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();
const reports = ref<any[]>([]);
const submitting = ref(false);

const form = reactive({
  category: '',
  vendorName: '',
  title: '',
  description: '',
});

const statusIcon = (s: string) => ({ pending: '⏳', investigating: '🔍', resolved: '✅', dismissed: '❌' }[s] || '📋');
const statusBg = (s: string) => ({ pending: 'bg-accent-500/20', investigating: 'bg-blue-500/20', resolved: 'bg-primary-500/20', dismissed: 'bg-red-500/20' }[s] || 'bg-white/5');
const statusBadge = (s: string) => ({ pending: 'badge-orange', investigating: 'badge bg-blue-500/20 text-blue-400', resolved: 'badge-green', dismissed: 'badge-red' }[s] || 'badge');

const timeAgo = (date: string) => {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const submitReport = async () => {
  submitting.value = true;
  try {
    await api.post('/reports', form);
    Object.assign(form, { category: '', vendorName: '', title: '', description: '' });
    const res = await api.get<any[]>('/reports/mine');
    reports.value = res.data || [];
    showToast({
      title: 'Report Submitted',
      message: 'We will review your report shortly.',
      toastType: 'success'
    });
  } catch (e: any) {
    showToast({
      title: 'Submission Failed',
      message: e.data?.message || 'Failed to submit report',
      toastType: 'error'
    });
  } finally { submitting.value = false; }
};

onMounted(async () => {
  try { 
    const res = await api.get<any[]>('/reports/mine');
    reports.value = res.data;
  }
  catch (e) { /* not yet logged in */ }
});

useHead({ title: 'Support - Errandr' });
</script>
