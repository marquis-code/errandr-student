<template>
 <div class="max-w-2xl mx-auto p-6 space-y-8 pb-24">
 <div class="flex items-center gap-4">
 <button @click="router.back()" class="p-2 bg-dark-50 rounded-xl text-dark-500 hover:text-dark-900 hover:bg-dark-100 transition-colors">
 <ChevronLeft class="w-6 h-6" />
 </button>
 <div>
 <h1 class="text-2xl font-bold text-dark-900">Support & Reports</h1>
 <p class="text-dark-400 text-sm">Need help or want to report an issue?</p>
 </div>
 </div>

 <!-- Active Reports -->
 <div v-if="reports.length > 0" class="space-y-4">
 <h2 class="text-xs font-bold text-dark-500 tracking-widest">Active Tickets</h2>
 <div v-for="report in reports" :key="report._id" class="glass-card hover:border-primary-500/30 transition-all">
 <div class="flex justify-between items-start mb-3">
 <div>
 <span class="badge" :class="statusBadge(report.status)">{{ report.status }}</span>
 <h3 class="text-dark-900 font-semibold mt-2">{{ report.subject }}</h3>
 </div>
 <span class="text-[10px] text-dark-500">{{ formatDate(report.createdAt) }}</span>
 </div>
 <p class="text-dark-400 text-sm line-clamp-2">{{ report.description }}</p>
 <div class="mt-4 pt-4 border-t border-dark-100 flex justify-end">
 <button @click="viewReport(report)" class="text-primary-600 text-xs font-bold tracking-wider hover:text-primary-700">
 View Thread
 </button>
 </div>
 </div>
 </div>

 <!-- Create New Report -->
 <div class="bg-white p-6 rounded-2xl border border-dark-100 shadow-sm relative overflow-hidden">
 <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
 <Info class="w-24 h-24" />
 </div>
 
 <h2 class="text-xl font-bold text-dark-900 mb-6">File a New Report</h2>
 <form @submit.prevent="submitReport" class="space-y-4">
 <div>
 <label class="block text-xs font-bold text-dark-400 tracking-widest mb-2">Subject</label>
 <select v-model="form.subject" class="glass-input w-full">
 <option value="" disabled>Select an issue category</option>
 <option value="missing_items">Missing Items</option>
 <option value="poor_quality">Poor Quality</option>
 <option value="delivery_issue">Delivery Issue</option>
 <option value="vendor_unresponsive">Vendor Unresponsive</option>
 <option value="refund_request">Refund Request</option>
 <option value="other">Other</option>
 </select>
 </div>

 <div v-if="orders.length > 0">
 <label class="block text-xs font-bold text-dark-400 tracking-widest mb-2">Related Order (Optional)</label>
 <select v-model="form.orderId" class="glass-input w-full">
 <option :value="null">None</option>
 <option v-for="order in orders" :key="order._id" :value="order._id">
 {{ order.orderNumber }} - {{ formatDate(order.createdAt) }}
 </option>
 </select>
 </div>

 <div>
 <label class="block text-xs font-bold text-dark-400 tracking-widest mb-2">Details</label>
 <textarea 
 v-model="form.description" 
 rows="4" 
 placeholder="Describe the issue in detail..."
 class="glass-input w-full resize-none"
 ></textarea>
 </div>

 <button 
 type="submit" 
 class="btn-primary w-full py-4 text-sm tracking-widest font-bold mt-4"
 :disabled="isSubmitting || !form.subject || !form.description"
 >
 {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
 </button>
 </form>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Info } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';
const router = useRouter();
const { showToast } = useCustomToast();

const reports = ref<any[]>([]);
const orders = ref<any[]>([]);
const isSubmitting = ref(false);

const form = ref({
 subject: '',
 description: '',
 orderId: null
});

const statusBadge = (status: string) => {
 switch (status) {
 case 'pending': return 'badge-orange';
 case 'investigating': return 'badge-blue';
 case 'resolved': return 'badge-green';
 case 'closed': return 'badge-dark';
 default: return 'badge-dark';
 }
};

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const submitReport = async () => {
 isSubmitting.value = true;
 try {
 await api.post('/reports', form.value);
 // Reset form
 form.value = { subject: '', description: '', orderId: null };
 // Reload reports
 await loadReports();
 showToast({
   title: 'Report Submitted',
   message: 'Our team will look into it.',
   toastType: 'success'
 });
 } catch (e) {
 showToast({
   title: 'Submission Failed',
   message: 'Could not send report. Please try again.',
   toastType: 'error'
 });
 } finally {
 isSubmitting.value = false;
 }
};

const loadReports = async () => {
 try {
 const res = await api.get('/reports/mine');
 reports.value = res.data;
 } catch (e) { console.error(e); }
};

const loadOrders = async () => {
 try {
 const res = await api.get<any[]>('/orders');
 orders.value = res.data.slice(0, 5); // Just show last 5 orders
 } catch (e) { console.error(e); }
};

const viewReport = (report: any) => {
 // Logic to view individual report thread
 console.log('Viewing report:', report);
};

onMounted(() => {
 loadReports();
 loadOrders();
});

useHead({ title: 'Support - Errandr' });
</script>
