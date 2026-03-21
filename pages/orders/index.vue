<template>
  <div class="space-y-12 animate-fade-in max-w-7xl mx-auto pb-32 selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-8">
      <div class="space-y-2">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-none">My Errands</h1>
        <p class="text-sm font-bold text-gray-400">Keep track of all your orders on campus.</p>
      </div>
      
      <div class="flex-1 relative max-w-md group z-20">
        <div class="absolute inset-x-0 -bottom-1 h-[4px] bg-gray-900/5 rounded-full blur-xl group-focus-within:bg-parentPrimary/20 transition-all duration-500" />
        <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by order ID or vendor..." 
          class="w-full pl-14 pr-14 py-5 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-8 focus:ring-parentPrimary/5 focus:border-parentPrimary/30 transition-all placeholder:text-gray-200"
        />
        <div class="absolute right-5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 opacity-20">
          <kbd class="px-2 py-1 text-[9px] font-bold bg-gray-100 text-gray-900 rounded-lg">⌘</kbd>
          <kbd class="px-2 py-1 text-[9px] font-bold bg-gray-100 text-gray-900 rounded-lg">K</kbd>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-900 p-6 rounded-3xl md:rounded-[3rem] shadow-lg relative overflow-hidden group">
         <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
         
         <div class="flex items-center gap-6 relative z-10">
            <button class="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest transition-all border border-white/10">
              <ListFilter class="w-4 h-4 text-parentPrimary" /> Filters
            </button>
            <div class="w-px h-8 bg-white/10" />
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing: All Orders</span>
         </div>
        
         <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar relative z-10">
           <button
              v-for="status in filters" 
              :key="status.key" 
              @click="activeFilter = status.key"
              class="px-6 py-3 rounded-2xl text-[10px] font-bold transition-all uppercase tracking-widest whitespace-nowrap border"
              :class="activeFilter === status.key ? 'bg-parentPrimary text-white border-parentPrimary shadow-lg shadow-parentPrimary/20' : 'text-gray-400 bg-white/5 border-white/5 hover:bg-white/10'"
           >
             {{ status.label }}
           </button>
         </div>
      </div>
    </div>

    <!-- Data Grid -->
    <div v-if="loading" class="px-4 space-y-4">
       <div v-for="i in 8" :key="i" class="h-24 bg-gray-50 rounded-[2.5rem] animate-pulse border border-gray-100" />
    </div>

    <div v-else-if="filteredOrders.length === 0" class="px-4">
       <div class="bg-gray-50/50 rounded-3xl md:rounded-[4rem] text-center p-8 md:p-24 border border-dashed border-gray-200 animate-fade-in">
          <div class="w-32 h-32 bg-white rounded-3xl md:rounded-[3rem] flex items-center justify-center text-6xl mx-auto mb-10 shadow-lg transform -rotate-12 animate-float">📋</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight leading-none">No orders yet</h2>
          <p class="text-sm font-bold text-gray-400 mb-12">You haven't placed any orders on Errandr yet.</p>
          <NuxtLink to="/vendors" class="px-12 py-6 bg-gray-900 text-white rounded-[2rem] font-bold text-sm shadow-lg hover:bg-parentPrimary transition-all uppercase tracking-widest">Start Shopping</NuxtLink>
       </div>
    </div>

    <div v-else class="px-4">
      <div class="overflow-x-auto hide-scrollbar pb-20">
        <table class="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr class="text-gray-300">
              <th class="pb-2 px-8 font-bold text-[9px] uppercase tracking-widest whitespace-nowrap">Order ID</th>
              <th class="pb-2 px-6 font-bold text-[9px] uppercase tracking-widest whitespace-nowrap">Vendor</th>
              <th class="pb-2 px-6 font-bold text-[9px] uppercase tracking-widest whitespace-nowrap text-right">Items</th>
              <th class="pb-2 px-6 font-bold text-[9px] uppercase tracking-widest whitespace-nowrap text-right">Total Amount</th>
              <th class="pb-2 px-6 font-bold text-[9px] uppercase tracking-widest whitespace-nowrap text-center">Status</th>
              <th class="pb-2 px-8"></th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in filteredOrders" 
              :key="order._id" 
              class="group cursor-pointer hover:-translate-y-1 transition-all duration-500" 
              @click="selectedOrder = order"
            >
              <td class="py-8 px-8 bg-white border-y border-l border-gray-100 rounded-l-[2.5rem] shadow-sm group-hover:shadow-lg group-hover:bg-gray-50 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner border border-white group-hover:bg-parentPrimary/10 transition-colors">
                    {{ statusEmoji(order.status) }}
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-lg tracking-tight leading-none mb-1">#{{ order.orderNumber }}</h3>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{{ timeAgo(order.createdAt) }}</p>
                  </div>
                </div>
              </td>
              <td class="py-8 px-6 bg-white border-y border-gray-100 group-hover:shadow-lg group-hover:bg-gray-50 transition-all">
                <p class="text-[11px] font-bold text-gray-900 uppercase tracking-widest truncate max-w-[200px]">
                  {{ order.vendor?.storeName || 'Unknown Vendor' }}
                </p>
              </td>
              <td class="py-8 px-6 bg-white border-y border-gray-100 group-hover:shadow-lg group-hover:bg-gray-50 transition-all text-right">
                <span class="px-4 py-2 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl text-[9px] font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-parentPrimary transition-all">{{ order.items?.length }} Items</span>
              </td>
              <td class="py-8 px-6 bg-white border-y border-gray-100 group-hover:shadow-lg group-hover:bg-gray-50 transition-all text-right">
                <p class="text-lg font-bold text-gray-900 tracking-tight leading-none">₦{{ order.total?.toLocaleString() }}</p>
              </td>
              <td class="py-8 px-6 bg-white border-y border-gray-100 group-hover:shadow-lg group-hover:bg-gray-50 transition-all text-center">
                <span :class="getStatusBadge(order.status)" class="text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-2xl inline-block border shadow-sm">
                  {{ formatStatus(order.status) }}
                </span>
              </td>
              <td class="py-8 px-8 bg-white border-y border-r border-gray-100 rounded-r-[2.5rem] shadow-sm group-hover:shadow-lg group-hover:bg-gray-50 transition-all text-right">
                <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-parentPrimary group-hover:text-white transition-all shadow-inner group-hover:scale-110">
                   <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Order SideDrawer -->
    <SideDrawer :isOpen="!!selectedOrder" @close="selectedOrder = null">
      <template v-if="selectedOrder">
        <div class="flex flex-col items-center justify-center py-12 border-b border-gray-50 relative overflow-hidden px-8 text-center">
           <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-50 to-transparent" />
           <div class="w-24 h-24 bg-gray-900 text-white rounded-3xl md:rounded-[3rem] flex items-center justify-center text-5xl shadow-lg mb-8 relative z-10 transform -rotate-6 animate-float">
             {{ statusEmoji(selectedOrder.status) }}
           </div>
           <h3 class="text-3xl font-bold text-gray-900 tracking-tight leading-none mb-4 relative z-10">Order Details <br /><span class="text-parentPrimary">#{{ selectedOrder.orderNumber }}</span></h3>
           
           <span :class="getStatusBadge(selectedOrder.status)" class="relative z-10 text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-[1.5rem] border shadow-lg bg-white scale-110 mt-2">
             {{ formatStatus(selectedOrder.status) }}
           </span>
        </div>

        <div class="p-10 space-y-10">
          <div class="bg-white rounded-3xl md:rounded-[3rem] p-8 space-y-8 border border-gray-100 shadow-sm relative overflow-hidden group">
             <div class="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl" />
             <div class="flex items-center gap-6 relative">
                  <div class="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-2xl shadow-lg">🏪</div>
                  <div class="space-y-1">
                     <p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none">Vendor</p>
                     <p class="text-xl font-bold text-gray-900 tracking-tight">{{ selectedOrder.vendor?.storeName || 'Unknown Vendor' }}</p>
                  </div>
                </div>
               
             <div class="pt-8 border-t border-gray-50 flex justify-between items-end relative">
                 <div class="space-y-1">
                    <p class="text-[9px] font-bold text-parentPrimary uppercase tracking-widest">Total Amount</p>
                    <p class="text-4xl font-bold text-gray-900 tracking-tight leading-none">₦{{ selectedOrder.total?.toLocaleString() }}</p>
                 </div>
                 <div class="text-[9px] font-bold text-gray-300 uppercase tracking-widest">NGN</div>
             </div>
          </div>

          <!-- Actions -->
          <div class="space-y-4">
            <h4 class="text-[9px] font-bold uppercase tracking-widest text-gray-300 ml-4 mb-6">Actions</h4>
            
            <NuxtLink 
               :to="`/orders/${selectedOrder._id}`" 
               class="w-full p-8 bg-gray-900 text-white rounded-[2.5rem] text-xs font-bold uppercase tracking-widest shadow-lg shadow-gray-900/40 hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group border-b-[8px] border-black active:border-b-0 active:translate-y-2"
            >
              Track Order <ArrowRight class="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </NuxtLink>

            <button
               @click="handleReorder(selectedOrder)"
               class="w-full p-6 bg-white text-gray-900 rounded-[2.5rem] text-[10px] font-bold uppercase tracking-widest border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
            >
               Order Again
            </button>
            
            <button
               v-if="['pending', 'confirmed'].includes(selectedOrder.status)"
               @click="cancelOrder(selectedOrder._id); selectedOrder = null;"
               class="w-full p-6 bg-rose-50 text-rose-500 rounded-[2.5rem] text-[10px] font-bold uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-4"
            >
               Cancel Order
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
