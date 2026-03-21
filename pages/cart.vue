<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-32">
    <div class="flex items-center justify-between px-2">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Your Cart</h1>
      <span v-if="!cartStore.isEmpty" class="px-3 py-1 bg-parentPrimary/10 text-parentPrimary text-[10px] font-bold uppercase tracking-widest rounded-lg border border-parentPrimary/20">
         {{ cartStore.items.value.length }} Items
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="cartStore.isEmpty" class="bg-white rounded-[3rem] text-center p-20 border border-gray-100 shadow-sm border-b-8 border-b-parentPrimary/10">
      <div class="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner border border-white">🛒</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
      <p class="text-gray-500 mb-10 font-medium">Browse vendors and add some campus favorites to get started!</p>
      <NuxtLink to="/vendors" class="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all uppercase tracking-widest">Browse Vendors</NuxtLink>
    </div>

    <!-- Cart Items -->
    <div v-else class="space-y-8">
      <div class="space-y-4">
        <div
          v-for="(item, index) in cartStore.items.value"
          :key="index"
          class="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex gap-5 hover:shadow-md transition-shadow group"
        >
          <img :src="item.image || '/placeholder-food.jpg'" class="w-24 h-24 rounded-2xl object-cover flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform" />
          <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div class="flex items-start justify-between">
               <h3 class="font-bold text-gray-900 truncate tracking-tight text-lg">{{ item.name }}</h3>
               <p class="font-bold text-parentPrimary tracking-tighter text-lg">₦{{ item.price?.toLocaleString() }}</p>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 shadow-inner">
                <button
                  @click="cartStore.updateQuantity(index, item.quantity - 1)"
                  class="w-8 h-8 rounded-lg bg-white text-gray-400 flex items-center justify-center hover:text-parentPrimary transition-colors shadow-sm"
                >
                  <Minus class="w-4 h-4" />
                </button>
                <span class="text-gray-900 font-bold w-10 text-center text-sm">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(index, item.quantity + 1)"
                  class="w-8 h-8 rounded-lg bg-white text-gray-400 flex items-center justify-center hover:text-parentPrimary transition-colors shadow-sm"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₦{{ item.subtotal?.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Address -->
      <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3">
           <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner border border-white">📍</div>
           <h3 class="font-bold text-gray-900 tracking-tight text-xl">Delivery Details</h3>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Precise Location</label>
            <input
              v-model="deliveryAddress"
              type="text"
              placeholder="e.g. Room 205, Diamond Hall"
              class="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-parentPrimary/5 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Errander Notes (optional)</label>
            <textarea
              v-model="deliveryNotes"
              placeholder="Gate instructions, entrance name, or phone preference?"
              class="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-parentPrimary/5 focus:bg-white transition-all h-28 resize-none shadow-inner"
            />
          </div>
        </div>
      </div>

      <!-- Group Ordering -->
      <div class="bg-gray-900 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        <div class="flex items-center justify-between relative z-10 mb-6">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/5 shadow-inner">🤝</div>
             <div>
                <h3 class="font-bold text-white tracking-tight text-lg">Group Subsidy</h3>
                <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Save ₦30 on delivery</p>
             </div>
          </div>
          <button 
            @click="isGroupOrder = !isGroupOrder"
            class="w-14 h-8 rounded-full p-1.5 transition-all duration-500 shadow-inner"
            :class="isGroupOrder ? 'bg-parentPrimary' : 'bg-white/10'"
          >
            <div 
              class="w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-lg"
              :class="isGroupOrder ? 'translate-x-6' : 'translate-x-0'"
            />
          </button>
        </div>
        
        <Transition name="fade">
          <div v-if="isGroupOrder" class="space-y-4 relative z-10 pt-2 border-t border-white/5">
            <p class="text-xs text-gray-300 font-medium italic">Enter your hostel or study group ID to split delivery costs.</p>
            <input
              v-model="groupId"
              type="text"
              placeholder="Enter Group ID (e.g. LAB-ZOK)"
              class="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white text-base font-bold tracking-widest focus:bg-white/10 focus:border-parentPrimary/50 outline-none transition-all placeholder:text-white/10 shadow-inner"
            />
          </div>
        </Transition>
      </div>

      <!-- Order Summary -->
      <div class="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 blur-3xl" />
        <h3 class="font-bold text-gray-900 tracking-tight text-xl relative">Order Summary</h3>
        <div class="space-y-4 relative">
          <div class="flex justify-between items-center text-sm font-medium">
            <span class="text-gray-400 uppercase tracking-widest text-[10px] font-black">Subtotal</span>
            <span class="text-gray-900 font-bold">₦{{ cartStore.subtotal?.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center text-sm font-medium">
            <span class="text-gray-400 uppercase tracking-widest text-[10px] font-black">Delivery Logistics</span>
            <div class="text-right">
              <span v-if="isGroupOrder" class="line-through text-rose-300 text-[10px] font-bold mr-2 uppercase">₦{{ ((cartStore.deliveryFee.value || 0) + 30).toLocaleString() }}</span>
              <span class="text-gray-900 font-bold">₦{{ cartStore.deliveryFee.value?.toLocaleString() }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm font-medium">
            <span class="text-gray-400 uppercase tracking-widest text-[10px] font-black">Platform Service</span>
            <span class="text-gray-900 font-bold">₦{{ cartStore.serviceFee.value?.toLocaleString() }}</span>
          </div>
          
          <div class="pt-6 border-t border-gray-50 flex justify-between items-end">
            <div>
               <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Final Total</p>
               <span class="text-4xl font-black text-gray-900 tracking-tighter">₦{{ cartStore.total.value?.toLocaleString() }}</span>
            </div>
            <div v-if="isGroupOrder" class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
               -₦30 Saved
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4 pt-4">
        <button
          @click="startPayment"
          :disabled="placing || !deliveryAddress"
          class="w-full py-6 bg-parentPrimary text-white rounded-[2rem] text-xl font-bold shadow-2xl shadow-parentPrimary/30 hover:brightness-110 disabled:opacity-20 transition-all flex items-center justify-center gap-4 group uppercase tracking-widest"
        >
          <Loader2 v-if="placing" class="animate-spin w-6 h-6" />
          <span v-else class="group-hover:scale-125 transition-transform">💳</span>
          {{ placing ? 'Verifying Secuirty...' : 'Pay & Place Order' }}
        </button>

        <button @click="cartStore.clearCart()" class="w-full py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors">
          Abort & Empty Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus, Loader2 } from 'lucide-vue-next';
import { useUser } from '@/composables/modules/auth/user';
import { useCart } from '@/composables/modules/cart';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'student'
})

const cartStore = useCart();
const { user } = useUser();

const deliveryAddress = ref('');
const deliveryNotes = ref('');
const groupId = ref('');
const isGroupOrder = ref(false);
const placing = ref(false);

useHead({ 
  title: 'Cart - Errandr',
  script: [
    { src: 'https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js' }
  ]
});

const startPayment = () => {
  if (!user.value?.email) {
    alert('Log in to Errandr to complete your checkout.');
    return;
  }

  placing.value = true;
  
  const korapayConfig = {
    key: 'pk_test_kRgQTfyy99S1FoB1UwzLnH1nc9XCSLeZKx73iLnW', 
    email: user.value.email,
    amount: cartStore.total.value,
    currency: 'NGN',
    reference: `ERR-${Math.floor((Math.random() * 1000000000) + 1)}`,
    customer: {
       name: `${user.value.firstName} ${user.value.lastName}`,
       email: user.value.email
    },
    onClose: () => {
      placing.value = false;
    },
    callback: (response: any) => {
      if (response.reference) {
         placeOrder(response.reference);
      } else {
         placing.value = false;
         alert('Payment failed or was cancelled by user.');
      }
    }
  };

  if ((window as any).Korapay) {
    (window as any).Korapay.initialize(korapayConfig);
  } else {
    placing.value = false;
    alert('Secure payment gateway is loading. Try again in 3 seconds.');
  }
};

const placeOrder = async (reference: string) => {
  try {
    const res = await api.post<any>('/orders', {
      vendorId: cartStore.vendorId.value,
      items: cartStore.items.value.map((item: any) => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations,
        subtotal: item.subtotal,
      })),
      deliveryAddress: deliveryAddress.value,
      deliveryNotes: deliveryNotes.value,
      groupId: isGroupOrder.value ? groupId.value : null,
      paymentReference: reference,
      weight: 1.5,
    });
    cartStore.clearCart();
    navigateTo(`/orders/${res.data._id}`);
  } catch (e: any) {
    alert(e.data?.message || 'Transaction error while finalizing order.');
  } finally {
    placing.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
