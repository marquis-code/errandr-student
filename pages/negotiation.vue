<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-parentPrimary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-parentPrimary">
          <svg class="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900">Negotiating Delivery Fee</h2>
        <p class="text-sm text-gray-500 mt-2">
          Waiting for riders to bid. <br/>
          Riders viewing your request: <span class="font-bold text-parentPrimary">{{ viewerCount }}</span>
        </p>
      </div>

      <div class="space-y-4 max-h-[60vh] overflow-y-auto">
        <div v-if="bids.length === 0" class="text-center py-10">
          <p class="text-gray-400 text-sm">No bids yet. Hold tight!</p>
        </div>
        <div 
          v-for="bid in bids" 
          :key="bid._id"
          class="p-4 border border-gray-100 rounded-xl hover:border-parentPrimary/30 transition-all flex justify-between items-center bg-gray-50/50"
        >
          <div class="flex items-center gap-3">
            <img :src="bid.rider?.avatar || 'https://ui-avatars.com/api/?name=Rider'" class="w-10 h-10 rounded-full object-cover" />
            <div>
              <p class="text-sm font-bold text-gray-900">{{ bid.rider?.firstName }} {{ bid.rider?.lastName }}</p>
              <p class="text-xs text-gray-500">Offered <span class="font-bold text-parentPrimary">₦{{ bid.bidAmount }}</span></p>
            </div>
          </div>
          <button 
            @click="acceptBid(bid)"
            :disabled="accepting"
            class="px-4 py-2 bg-parentPrimary text-white text-xs font-bold rounded-lg hover:bg-parentPrimary/90 transition-all disabled:opacity-50"
          >
            Accept
          </button>
        </div>
      </div>
      
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-400">If no rider accepts within 5 minutes, your order will be cancelled.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { io, Socket } from 'socket.io-client';
import { orders_api } from '~/api_factory/modules/orders';
import { useCustomToast } from '~/composables/core/useCustomToast';

const route = useRoute();
const router = useRouter();
const { showToast } = useCustomToast();
const config = useRuntimeConfig();

const orderIds = (route.query.orderIds as string)?.split(',') || [];
const primaryOrderId = orderIds[0];

const viewerCount = ref(0);
const bids = ref<any[]>([]);
const accepting = ref(false);
let socket: Socket | null = null;

onMounted(() => {
  if (!primaryOrderId) {
    showToast({ title: 'Error', message: 'No active negotiation.', toastType: 'error' });
    router.replace('/');
    return;
  }

  // Connect to negotiation namespace
  socket = io(`${config.public.API_BASE_URL.replace('/v1', '')}/negotiation`, {
    withCredentials: true,
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    socket?.emit('joinNegotiation', { orderId: primaryOrderId, role: 'student' });
  });

  socket.on('viewerCountUpdate', (data: { count: number }) => {
    viewerCount.value = data.count;
  });

  socket.on('newBid', (bid: any) => {
    // Check if bid from this rider already exists, if so update it
    const index = bids.value.findIndex(b => b.rider._id === bid.rider._id);
    if (index !== -1) {
      bids.value[index] = bid;
    } else {
      bids.value.unshift(bid);
    }
  });

  socket.on('bidAccepted', (data: any) => {
    if (!accepting.value) {
      // Someone else accepted? or we just got the broadcast
    }
  });
});

onUnmounted(() => {
  if (socket) {
    socket.emit('leaveNegotiation', { orderId: primaryOrderId, role: 'student' });
    socket.disconnect();
  }
});

const acceptBid = async (bid: any) => {
  if (accepting.value) return;
  accepting.value = true;
  
  try {
    const res = await orders_api.acceptBid(primaryOrderId, bid._id);
    if (res?.data || res) {
      showToast({ title: 'Bid Accepted', message: 'Proceeding to payment...', toastType: 'success' });
      // To keep it simple, we redirect to orders page, and the orders page has a "Pay Now" button if AWAITING_PAYMENT
      // Since it's multi-vendor, they might have to pay for each order from the orders list,
      // But we can trigger payment right here for the primary order, or redirect to a payment page.
      // Redirect to the order details page where they can pay.
      setTimeout(() => {
        router.replace(`/orders/${primaryOrderId}`);
      }, 1000);
    }
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Failed to accept bid.', toastType: 'error' });
  } finally {
    accepting.value = false;
  }
};
</script>
