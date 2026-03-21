<template>
  <div class="space-y-4 animate-fade-in max-w-7xl mx-auto pb-10">
    <!-- Header with Search -->
    <div class="flex items-center justify-between gap-4 mb-4 mt-2">
      <div class="flex-1 relative max-w-2xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search errands by ID or vendor" 
          class="w-full pl-11 pr-14 py-2.5 bg-gray-50/70 hover:bg-gray-100 transition-colors border-none rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-parentPrimary/20"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">⌘</kbd>
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">K</kbd>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-500 hidden md:block">Total Errands: <strong class="text-gray-900">{{ orders.length }}</strong></span>
      </div>
    </div>

    <!-- Title & Filters -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight font-display mb-1">Activity & Orders</h1>
          <p class="text-gray-500 text-sm font-medium">Track your active errands and review your campus favorites.</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors border border-gray-200">
          <ListFilter class="w-4 h-4" />
          Filters
        </button>
        <span class="text-sm font-medium text-gray-400">All activities</span>
        
        <div class="ml-auto flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button
             v-for="status in filters" 
             :key="status.key" 
             @click="activeFilter = status.key"
             class="px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap"
             :class="activeFilter === status.key ? 'bg-parentPrimary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 bg-gray-50 border border-transparent'"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="p-10 text-center">
       <div class="space-y-4">
         <div v-for="i in 8" :key="i" class="h-12 bg-gray-100 rounded-2xl animate-pulse"></div>
       </div>
    </div>

    <div v-else-if="filteredOrders.length === 0">
       <EmptyState 
         :title="activeFilter === 'all' && !searchQuery ? 'No orders yet' : 'No match found'" 
         :description="activeFilter === 'all' && !searchQuery ? 'Your errand history is empty. Ready to find something delicious?' : 'Try adjusting your search or filters.'"
         :actionLabel="activeFilter === 'all' && !searchQuery ? 'Browse Vendors' : undefined"
         @action="activeFilter === 'all' && !searchQuery ? $router.push('/vendors') : null"
       >
         <template #icon>
           <ClipboardList class="w-10 h-10 text-gray-400" />
         </template>
       </EmptyState>
    </div>

    <div v-else class="bg-white">
      <div class="overflow-x-auto pb-20">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Order Info</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Vendor</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Items</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap text-right">Total</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap text-right">Status</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50/50">
            <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-gray-50/80 transition-colors group cursor-pointer" @click="selectedOrder = order">
              <td class="py-4 px-2 min-w-[150px]">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[12px] shadow-sm flex-shrink-0 border border-white">
                    {{ statusEmoji(order.status) }}
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-[13px] tracking-tight truncate max-w-[100px]">#{{ order.orderNumber }}</h3>
                    <p class="text-[10px] text-gray-500 font-medium">{{ timeAgo(order.createdAt) }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-2 min-w-[150px]">
                <p class="text-[13px] font-medium text-gray-900 leading-tight truncate max-w-[150px]">
                  {{ order.vendor?.storeName || 'Unknown Vendor' }}
                </p>
              </td>
              <td class="py-4 px-2">
                <span class="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-widest border border-gray-200/50">{{ order.items?.length }} Items</span>
              </td>
              <td class="py-4 px-2 text-right">
                <p class="text-[13px] font-bold text-gray-900 tracking-tighter">₦{{ order.total?.toLocaleString() }}</p>
              </td>
              <td class="py-4 px-2 text-right w-24">
                <span :class="getStatusBadge(order.status)" class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md inline-block text-center w-full">
                  {{ formatStatus(order.status) }}
                </span>
              </td>
              <td class="py-4 px-2 text-right w-10">
                <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors inline-block" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SideDrawer for Order Details -->
    <SideDrawer :isOpen="!!selectedOrder" @close="selectedOrder = null">
      <template v-if="selectedOrder">
        <div class="flex flex-col items-center justify-center py-6 border-b border-gray-100">
           <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl shadow-sm mb-3 border border-white">
             {{ statusEmoji(selectedOrder.status) }}
           </div>
           <h3 class="text-xl font-bold text-gray-900 tracking-tight">Order #{{ selectedOrder.orderNumber }}</h3>
           
           <span :class="getStatusBadge(selectedOrder.status)" class="mt-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm">
             {{ formatStatus(selectedOrder.status) }}
           </span>
        </div>

        <div class="py-6 space-y-6">
          <div class="bg-gray-50/80 rounded-2xl p-6 space-y-4 shadow-inner border border-gray-100/50">
             <div class="flex items-start gap-4">
                 <div class="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] shadow-sm flex-shrink-0">🏪</div>
                 <div>
                    <p class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">Vendor</p>
                    <p class="text-sm font-bold text-gray-900">{{ selectedOrder.vendor?.storeName || 'Store' }}</p>
                 </div>
               </div>
               
             <div class="pt-4 mt-4 border-t border-gray-200/50 flex justify-between items-center">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Cost</span>
                <span class="text-xl font-black text-gray-900 tracking-tight">₦{{ selectedOrder.total?.toLocaleString() }}</span>
             </div>
          </div>

          <div class="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Actions</h4>
            
            <NuxtLink 
               :to="`/orders/${selectedOrder._id}`" 
               class="w-full px-5 py-4 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-gray-900/10 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              Order Details & Tracking <span class="group-hover:translate-x-1 inline-block transition-transform">→</span>
            </NuxtLink>

            <button
               @click="handleReorder(selectedOrder)"
               class="w-full px-5 py-3.5 bg-gray-50 text-gray-900 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-gray-200 shadow-sm hover:border-gray-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
               🔄 Rapid Re-order
            </button>
            <button
               v-if="['pending', 'confirmed'].includes(selectedOrder.status)"
               @click="cancelOrder(selectedOrder._id); selectedOrder = null;"
               class="w-full px-5 py-3.5 bg-rose-50 text-rose-500 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-rose-100 hover:bg-rose-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
               ❌ Abort Errand
            </button>
          </div>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { ClipboardList, ChevronRight, Search, ListFilter } from 'lucide-vue-next';
import { useStudentOrders } from '@/composables/modules/orders';
import { ref, computed, onMounted } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';

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
  if (mins < 60) return `${mins}M AGO`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}H AGO`;
  return `${Math.floor(hrs / 24)}D AGO`;
};

const getStatusBg = (s: string) => {
  if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600';
  if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-600';
  if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600';
  return 'bg-gray-50 text-gray-400';
}

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
</style>
