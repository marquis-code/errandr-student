<template>
 <div class="space-y-8 animate-fade-in pb-32 selection:bg-parentPrimary/10 selection:text-parentPrimary">
 <!-- Filters & Search -->
 <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
 <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth">
 <button
 v-for="status in filters" 
 :key="status.key" 
 @click="activeFilter = status.key"
 class="px-5 py-2.5 rounded-xl text-[10px] font-bold transition-all tracking-widest whitespace-nowrap border"
 :class="activeFilter === status.key ? 'bg-parentPrimary text-white border-parentPrimary shadow-md' : 'text-gray-400 bg-white border-gray-100 hover:border-gray-200'"
 >
 {{ status.label }}
 </button>
 </div>

 <div class="relative group z-20 w-full md:w-64">
 <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search errands..." 
 class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-bold focus:ring-4 focus:ring-parentPrimary/5 focus:border-parentPrimary transition-all placeholder:text-gray-300"
 />
 </div>
 </div>

 <!-- Data Grid -->
 <div v-if="loading" class="px-2 space-y-3">
 <div v-for="i in 6" :key="i" class="h-16 bg-white rounded-2xl animate-pulse border border-gray-50" />
 </div>

 <div v-else-if="filteredOrders.length === 0" class="px-2">
 <div class="bg-white rounded-[2rem] text-center p-16 border border-dashed border-gray-100 animate-fade-in">
 <div class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 transform -rotate-12">📋</div>
 <h2 class="text-xl font-bold text-gray-900 mb-2 tracking-tight">No orders yet</h2>
 <p class="text-[10px] font-bold text-gray-400 tracking-widest mb-8">Start your first Errand on campus</p>
 <NuxtLink to="/vendors" class="inline-flex px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-[10px] tracking-widest hover:bg-parentPrimary transition-all">Start Shopping</NuxtLink>
 </div>
 </div>

 <div v-else class="px-2 pb-24">
 <div class="space-y-3">
 <div 
 v-for="order in filteredOrders" 
 :key="order._id" 
 class="group bg-white rounded-2xl p-4 border border-gray-50 shadow-sm hover:shadow-md hover:border-gray-100 transition-all cursor-pointer flex items-center justify-between gap-3"
 @click="selectedOrder = order"
 >
 <div class="flex items-center gap-4 flex-1 min-w-0">
 <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner border border-white group-hover:bg-parentPrimary/10 transition-colors shrink-0">
 {{ statusEmoji(order.status) }}
 </div>
 <div class="min-w-0">
 <div class="flex items-center gap-2 mb-1">
 <h3 class="font-black text-gray-900 text-base tracking-tight truncate flex-1 md:flex-none">#{{ order.orderNumber }}</h3>
 <span :class="getStatusBadge(order.status)" class="sm:hidden text-[8px] font-black tracking-widest px-2.5 py-1 rounded-md border shrink-0">
 {{ formatStatus(order.status) }}
 </span>
 </div>
 <p class="text-[10px] font-bold text-gray-400 tracking-widest truncate">{{ order.vendor?.storeName || 'Custom Errand' }}</p>
 </div>
 </div>

 <div class="text-right px-3 shrink-0">
 <p class="text-sm font-black text-gray-900 leading-none mb-1">₦{{ order.total?.toLocaleString() }}</p>
 <p class="text-[9px] font-bold text-gray-400 tracking-widest">{{ timeAgo(order.createdAt) }}</p>
 </div>

 <div class="shrink-0 flex items-center gap-3">
 <span :class="getStatusBadge(order.status)" class="hidden sm:block text-[8px] font-black tracking-widest px-3 py-1.5 rounded-lg border">
 {{ formatStatus(order.status) }}
 </span>
 <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-parentPrimary group-hover:translate-x-1 transition-all" />
 </div>
 </div>
 </div>
 </div>

 <!-- Order SideDrawer -->
 <SideDrawer :isOpen="!!selectedOrder" @close="selectedOrder = null">
 <template v-if="selectedOrder">
 <div class="flex flex-col items-center justify-center py-10 border-b border-gray-50 text-center px-6">
 <div class="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-6 transform -rotate-6 animate-float">
 {{ statusEmoji(selectedOrder.status) }}
 </div>
 <h3 class="text-xl font-bold text-gray-900 tracking-tight leading-none mb-3">Order #{{ selectedOrder.orderNumber }}</h3>
 <span :class="getStatusBadge(selectedOrder.status)" class="text-[9px] font-black tracking-widest px-4 py-2 rounded-xl border bg-white">
 {{ formatStatus(selectedOrder.status) }}
 </span>
 </div>

 <div class="p-6 space-y-6">
 <div class="bg-white rounded-2xl p-6 space-y-6 border border-gray-100 shadow-sm">
 <div class="flex items-center gap-4">
 <div class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg shadow-md">🏪</div>
 <div class="space-y-0.5">
 <p class="text-[8px] font-bold tracking-widest text-gray-400">Vendor</p>
 <p class="text-sm font-bold text-gray-900">{{ selectedOrder.vendor?.storeName || 'Unknown Vendor' }}</p>
 </div>
 </div>
 
 <div class="pt-6 border-t border-gray-50 flex justify-between items-end">
 <div class="space-y-0.5">
 <p class="text-[8px] font-bold text-parentPrimary tracking-widest">Total Amount</p>
 <p class="text-2xl font-bold text-gray-900 tracking-tight">₦{{ selectedOrder.total?.toLocaleString() }}</p>
 </div>
 <div class="text-[8px] font-bold text-gray-300 tracking-widest">NGN</div>
 </div>
 </div>

 <!-- Actions -->
 <div class="space-y-3">
 <h4 class="text-[8px] font-black tracking-[0.2em] text-gray-300 ml-2 mb-2">Actions</h4>
 
 <button 
 @click="navigateTo(`/dashboard/orders/${selectedOrder._id}`)" 
 class="w-full py-4 bg-gray-900 text-white rounded-xl text-[10px] font-extrabold tracking-widest shadow-lg shadow-gray-900/20 hover:bg-parentPrimary transition-all flex items-center justify-center gap-2 group"
 >
 Track Errand <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>

 <button
 @click="handleReorder(selectedOrder)"
 class="w-full py-4 bg-white text-gray-900 rounded-xl text-[10px] font-extrabold tracking-widest border border-gray-100 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
 >
 Order Again
 </button>
 
 <button
 v-if="['pending', 'confirmed'].includes(selectedOrder.status)"
 @click="cancelOrder(selectedOrder._id); selectedOrder = null;"
 class="w-full py-3.5 bg-rose-50 text-rose-500 rounded-xl text-[9px] font-bold tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all"
 >
 Cancel Errand
 </button>
 </div>
 </div>
 </template>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { ClipboardList, ChevronRight, Search, ListFilter, ArrowRight } from 'lucide-vue-next';
import { useStudentOrders } from '@/composables/modules/orders';
import { ref, computed, onMounted } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';

definePageMeta({
 layout: 'student'
})

const { loading, orders, fetchOrders, cancelOrder } = useStudentOrders();

const searchQuery = ref('');
const activeFilter = ref('all');
const selectedOrder = ref<any>(null);

const filters = [
 { key: 'all', label: 'All' },
 { key: 'active', label: 'Active' },
 { key: 'delivered', label: 'Done' },
];

const filteredOrders = computed(() => {
 let list = orders.value;
 if (activeFilter.value !== 'all') {
 if (activeFilter.value === 'active') {
 list = list.filter(o => !['delivered', 'cancelled'].includes(o.status));
 } else {
 list = list.filter(o => o.status === activeFilter.value);
 }
 }
 
 if (searchQuery.value) {
 const q = searchQuery.value.toLowerCase();
 list = list.filter(o => 
 o.orderNumber?.toLowerCase().includes(q) ||
 o.vendor?.storeName?.toLowerCase().includes(q)
 );
 }
 return list;
});

const statusEmoji = (status: string) => {
 const map: Record<string, string> = {
 pending: '⏳', confirmed: '✅', preparing: '👨‍🍳', ready_for_pickup: '📦',
 picked_up: '🏃', in_transit: '🚀', delivered: '🎉', cancelled: '❌',
 };
 return map[status] || '📋';
};

const formatStatus = (status: string) => status?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

const timeAgo = (date: string) => {
 const diff = Date.now() - new Date(date).getTime();
 const mins = Math.floor(diff / 60000);
 if (mins < 60) return `${mins}m ago`;
 const hrs = Math.floor(mins / 60);
 if (hrs < 24) return `${hrs}h ago`;
 return `${Math.floor(hrs / 24)}d ago`;
};

const getStatusBadge = (s: string) => {
 if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
 if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-600 border-blue-100';
 if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600 border-amber-100';
 return 'bg-gray-50 text-gray-400 border-gray-100';
}

const handleReorder = (order: any) => {
 navigateTo(`/vendors/${order.vendor?._id}`);
};

onMounted(fetchOrders);
useHead({ title: 'My Errands - Errandr' });
</script>

<style scoped>
.animate-fade-in {
 animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
 from { opacity: 0; transform: translateY(30px); }
 to { opacity: 1; transform: translateY(0); }
}
.animate-float {
 animation: float 6s ease-in-out infinite;
}
@keyframes float {
 0%, 100% { transform: translateY(0) rotate(0); }
 50% { transform: translateY(-20px) rotate(5deg); }
}
</style>
