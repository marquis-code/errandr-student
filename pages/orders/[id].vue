<template>
  <div class="max-w-3xl mx-auto space-y-8 pb-32" v-if="order">
    <!-- Order Header -->
    <div class="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/5 rounded-full blur-3xl" />
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Errand</p>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ order.orderNumber }}</h1>
        </div>
        <div :class="getStatusBadge(order.status)" class="px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border backdrop-blur-sm self-start">
          {{ statusEmoji(order.status) }} {{ formatStatus(order.status) }}
        </div>
      </div>

      <div class="mt-10 space-y-4 relative z-10">
        <div class="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
           <span>Logistics Progress</span>
           <span>{{ deliveryProgress }}%</span>
        </div>
        <div class="flex items-center gap-2">
          <div
            v-for="(step, i) in statusSteps"
            :key="step"
            class="flex-1 h-2 rounded-full transition-all duration-700"
            :class="(currentStepIndex as number) >= i ? 'bg-parentPrimary shadow-sm shadow-parentPrimary/20' : 'bg-gray-100'"
          />
        </div>
      </div>

      <!-- Verification Code -->
      <div v-if="order.status !== 'delivered' && order.status !== 'cancelled'" class="bg-gray-900 rounded-[2rem] p-6 mt-10 relative overflow-hidden group">
        <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-parentPrimary/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div class="text-center md:text-left">
            <p class="text-[10px] font-bold text-parentPrimary uppercase tracking-widest mb-1">Delivery Verification Code</p>
            <p class="text-gray-400 text-xs font-medium max-w-[200px]">Only provide this to your errander once they arrive with your items.</p>
          </div>
          <div class="text-4xl font-black text-white tracking-[0.2em] bg-white/5 px-8 py-4 rounded-2xl border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
            {{ order.uniqueCode }}
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Errander Info -->
      <div v-if="order.errander" class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group">
        <div class="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-bold shadow-xl mb-6 group-hover:-translate-y-1 transition-transform">
          {{ order.errander.firstName?.[0] }}{{ order.errander.lastName?.[0] }}
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic mb-1">Your Errander</p>
          <h3 class="font-bold text-gray-900 text-lg tracking-tight">{{ order.errander.firstName }} {{ order.errander.lastName }}</h3>
          <p class="text-xs text-gray-500 font-medium mt-1">{{ order.errander.phone }}</p>
        </div>
        <div class="flex gap-2 w-full mt-8">
          <a :href="`tel:${order.errander.phone}`" class="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100">Call</a>
          <button @click="router.push(`/chat/${route.params.id}`)" class="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100">Live Chat</button>
        </div>
      </div>

      <!-- ETA & Progress -->
      <div v-if="isActiveOrder || order.status === 'ready_for_pickup'" class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between group h-full">
        <div class="flex items-center gap-5">
          <div class="w-16 h-16 rounded-[1.5rem] bg-parentPrimary/10 text-parentPrimary flex items-center justify-center text-3xl shadow-inner border border-white animate-pulse">
            🚀
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Arrival</p>
            <h2 class="text-4xl font-black text-gray-900 tracking-tighter">{{ etaMinutes }} Mins</h2>
          </div>
        </div>

        <div class="mt-auto pt-8">
           <div class="flex justify-between items-end">
              <div class="space-y-1">
                 <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Status</p>
                 <p class="text-sm font-bold text-gray-900">{{ formatStatus(order.status) }}</p>
              </div>
              <div class="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                 <div class="h-full bg-parentPrimary transition-all duration-1000" :style="{ width: `${deliveryProgress}%` }" />
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Live Map Placeholder -->
    <div v-if="isActiveOrder" class="bg-gray-100 rounded-[3rem] border border-gray-200/50 shadow-inner h-72 overflow-hidden relative group">
       <div class="absolute inset-0 bg-[url('/img/map-pattern.png')] opacity-5" />
       <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-xl mb-4 animate-float border border-gray-50">🏃</div>
          <h4 class="font-bold text-gray-900 tracking-tight">Real-time GPS Shield</h4>
          <p class="text-xs text-gray-500 font-medium mt-1">Live tracking and location privacy enabled</p>
          <div class="flex items-center gap-2 mt-6 bg-emerald-50 px-4 py-2 rounded-xl text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live Sync: Active
          </div>
       </div>
    </div>

    <!-- Items & Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
       <!-- Items -->
       <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <h3 class="font-bold text-gray-900 tracking-tight text-xl mb-6 relative">Order Items</h3>
          <div class="space-y-4 relative">
            <div v-for="item in order.items" :key="item._id" class="flex justify-between items-center text-sm">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-100">{{ item.quantity }}x</span>
                <span class="text-gray-900 font-bold tracking-tight">{{ item.name }}</span>
              </div>
              <span class="text-gray-400 font-medium">₦{{ item.subtotal?.toLocaleString() }}</span>
            </div>
            
            <div class="pt-6 mt-6 border-t border-gray-50 space-y-3">
              <div class="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                <span>Subtotal</span><span>₦{{ order.subtotal?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                <span>Logistic Fees</span><span>₦{{ (order.deliveryFee + order.serviceFee)?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-900 font-black pt-4 border-t border-gray-100 mt-4 text-xl tracking-tighter">
                <span>Total Pay</span><span>₦{{ order.total?.toLocaleString() }}</span>
              </div>
            </div>
          </div>
       </div>

       <!-- Timeline -->
       <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 class="font-bold text-gray-900 tracking-tight text-xl mb-6">Order Life-cycle</h3>
          <div class="space-y-6">
            <div v-for="(history, i) in order.statusHistory" :key="i" class="flex gap-4 relative group">
              <div v-if="(i as number) < (order.statusHistory?.length || 0) - 1" class="absolute left-1.5 top-3 w-px h-full bg-gray-100 -ml-[0.5px]" />
              <div class="relative z-10 w-3 h-3 rounded-full mt-1.5 transition-all group-hover:scale-150" :class="i === 0 ? 'bg-parentPrimary shadow-lg shadow-parentPrimary/30' : 'bg-gray-200'" />
              <div class="pb-2">
                <p class="text-gray-900 text-sm font-bold tracking-tight">{{ formatStatus(history.status) }}</p>
                <div class="flex items-center gap-2 mt-1">
                   <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ new Date(history.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                   <span class="w-1 h-1 rounded-full bg-gray-200" />
                   <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ new Date(history.timestamp).toLocaleDateString() }}</p>
                </div>
              </div>
            </div>
          </div>
       </div>
    </div>

    <!-- Need Help Section -->
    <div class="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
      <div class="absolute -left-20 -bottom-20 w-60 h-60 bg-white rounded-full blur-3xl opacity-50" />
      <div class="relative z-10 text-center md:text-left">
        <h4 class="text-gray-900 font-bold text-xl tracking-tight">Need assistance?</h4>
        <p class="text-gray-500 text-sm font-medium mt-1">Our resolution team is always on standby for you.</p>
      </div>
      <button @click="router.push('/support')" class="relative z-10 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">Report Order Issue</button>
    </div>
  </div>

  <div v-else class="max-w-2xl mx-auto space-y-6">
    <div v-for="i in 5" :key="i" class="bg-white border border-gray-100 animate-pulse h-32 rounded-[2rem]" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, useHead } from '#imports';
import { useUser } from '@/composables/modules/auth/user';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useSocket } from '@/composables/useSocket';

definePageMeta({
  layout: 'student'
})

const route = useRoute();
const router = useRouter();

const { user } = useUser();
const { on, emit, connect } = useSocket('tracking');

const order = ref<any>(null);

const statusSteps = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered'];

const currentStepIndex = computed(() =>
  order.value ? statusSteps.indexOf(order.value.status) : -1,
);

const isActiveOrder = computed(() => {
  if (!order.value) return false;
  return ['picked_up', 'in_transit'].includes(order.value.status);
});

const etaMinutes = computed(() => {
  if (!order.value) return 0;
  if (order.value.status === 'delivered') return 0;
  if (order.value.status === 'in_transit') return 5;
  if (order.value.status === 'picked_up') return 10;
  if (order.value.status === 'preparing') return 15;
  return 20;
});

const deliveryProgress = computed(() => {
  if (!order.value) return 0;
  const index = statusSteps.indexOf(order.value.status);
  if (index === -1) return 0;
  return Math.round((index / (statusSteps.length - 1)) * 100);
});

const formatStatus = (status: string) =>
  status?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

const statusEmoji = (status: string) => {
  const map: Record<string, string> = {
    pending: '⏳', confirmed: '✅', preparing: '👨‍🍳', ready_for_pickup: '📦',
    picked_up: '🏃', in_transit: '🚀', delivered: '🎉', cancelled: '❌',
  };
  return map[status] || '📋';
};

const getStatusBadge = (s: string) => {
  if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-600 border-blue-100';
  if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600 border-amber-100';
  return 'bg-gray-50 text-gray-400 border-gray-100';
}

onMounted(async () => {
  try {
    const res = await api.get<any>(`/orders/${route.params.id}`);
    order.value = res.data;
  } catch (e) { console.error(e); }

  connect();
  emit('trackOrder', { orderId: route.params.id, userId: user.value?._id });

  on('statusUpdate', (data: any) => {
    if (data.orderId === route.params.id && order.value) {
      order.value.status = data.status;
    }
  });
});

useHead({ title: computed(() => order.value ? `Order ${order.value.orderNumber} - Errandr` : 'Order - Errandr') });
</script>

<style scoped>
.animate-float {
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
