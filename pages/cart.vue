<template>
  <div class="max-w-3xl mx-auto space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
      <div class="space-y-1">
        <h1 class="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-none">Checkout</h1>
        <p class="text-sm font-bold text-gray-400">Review your items and delivery details.</p>
      </div>
      <div v-if="!cartStore.isEmpty" class="px-6 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-lg">
         {{ cartStore.items.value.length }} items
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="cartStore.isEmpty" class="bg-gray-50/50 rounded-3xl md:rounded-[4rem] text-center p-8 md:p-24 border border-dashed border-gray-200 animate-fade-in">
      <div class="w-32 h-32 bg-white rounded-3xl md:rounded-[3rem] flex items-center justify-center text-6xl mx-auto mb-10 shadow-lg transform rotate-12 animate-float">🛒</div>
      <h2 class="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-none">Your cart is empty</h2>
      <p class="text-sm font-bold text-gray-400 mb-12">Looks like you haven't added anything yet!</p>
      <NuxtLink to="/vendors" class="px-12 py-6 bg-gray-900 text-white rounded-[2rem] font-bold text-sm shadow-lg hover:bg-parentPrimary transition-all">Browse Vendors</NuxtLink>
    </div>

    <!-- Active Cart -->
    <div v-else class="space-y-12">
      <div class="space-y-6">
        <div
          v-for="(item, index) in cartStore.items.value"
          :key="index"
          class="bg-white p-6 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-8 hover:shadow-lg hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden"
        >
          <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div class="relative w-full sm:w-32 h-32 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-inner">
             <img :src="item.image || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&h=400&fit=crop'" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
             <div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-40" />
          </div>

          <div class="flex-1 min-w-0 flex flex-col justify-between py-2">
            <div class="flex items-start justify-between gap-4">
               <div class="space-y-1">
                  <h3 class="font-bold text-gray-900 tracking-tight text-2xl leading-none truncate">{{ item.name }}</h3>
                  <p class="text-[10px] font-bold text-parentPrimary">₦{{ item.price?.toLocaleString() }} each</p>
               </div>
               <p class="font-bold text-gray-900 tracking-tight text-2xl leading-none">₦{{ item.subtotal?.toLocaleString() }}</p>
            </div>
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-6">
              <div class="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner self-start">
                <button
                  @click="cartStore.updateQuantity(index, item.quantity - 1)"
                  class="w-10 h-10 rounded-xl bg-white text-gray-400 flex items-center justify-center hover:text-rose-500 transition-all shadow-sm active:scale-90"
                >
                  <Minus class="w-5 h-5" />
                </button>
                <span class="text-gray-900 font-bold w-12 text-center text-base tracking-tight">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(index, item.quantity + 1)"
                  class="w-10 h-10 rounded-xl bg-white text-gray-400 flex items-center justify-center hover:text-parentPrimary transition-all shadow-sm active:scale-90"
                >
                  <Plus class="w-5 h-5" />
                </button>
              </div>
              
              <button @click="cartStore.updateQuantity(index, 0)" class="text-[10px] font-bold text-gray-300 hover:text-rose-500 transition-all flex items-center gap-2 group/del">
                 <X class="w-4 h-4 group-hover/del:rotate-90 transition-transform" /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Details -->
      <div class="glass-effect p-10 rounded-3xl md:rounded-[4rem] space-y-10 relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/5 rounded-full blur-[80px]" />
        
        <div class="flex items-center gap-4">
           <div class="w-14 h-14 rounded-[1.5rem] bg-gray-900 text-white flex items-center justify-center text-2xl shadow-lg">
              <MapPin class="w-7 h-7" />
           </div>
           <div class="space-y-0.5">
              <h3 class="font-black text-gray-900 tracking-tight text-2xl leading-none">Where to deliver?</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Provide your room or hall description</p>
           </div>
        </div>

        <div class="space-y-8">
          <div class="space-y-3 relative group/field">
            <label class="text-xs font-bold text-gray-400 ml-4 transition-colors group-focus-within/field:text-parentPrimary">Delivery Address</label>
            <input
              v-model="deliveryAddress"
              type="text"
              placeholder="e.g. Room 205, Diamond Hall"
              class="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold focus:ring-8 focus:ring-parentPrimary/5 focus:bg-white transition-all shadow-inner outline-none placeholder:text-gray-200"
            />
          </div>
          <div class="space-y-3 relative group/field">
            <label class="text-xs font-bold text-gray-400 ml-4 transition-colors group-focus-within/field:text-parentPrimary">Delivery Instructions</label>
            <textarea
              v-model="deliveryNotes"
              placeholder="Gate instructions, entrance name, or phone preference?"
              class="w-full p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] text-sm font-bold focus:ring-8 focus:ring-parentPrimary/5 focus:bg-white transition-all h-32 resize-none shadow-inner outline-none placeholder:text-gray-200"
            />
          </div>
        </div>
      </div>

      <!-- Group Savings -->
      <div class="bg-gray-900 rounded-3xl md:rounded-[4rem] p-10 shadow-lg relative overflow-hidden group border-b-[8px] md:border-b-[12px] border-gray-800">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        
        <div class="flex items-center justify-between relative z-10 mb-8">
          <div class="flex items-center gap-6">
             <div class="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-3xl border border-white/5 shadow-inner">🤝</div>
             <div class="space-y-1">
                <h3 class="font-bold text-white tracking-tight text-2xl leading-none">Group Order Discount</h3>
                <p class="text-parentPrimary text-[10px] font-bold">Save ₦30 on delivery</p>
             </div>
          </div>
          <button 
            @click="isGroupOrder = !isGroupOrder"
            class="w-16 h-10 rounded-full p-2 transition-all duration-500 shadow-inner group-hover:scale-110"
            :class="isGroupOrder ? 'bg-parentPrimary' : 'bg-white/10'"
          >
            <div 
              class="w-6 h-6 bg-white rounded-lg transition-all duration-500 shadow-lg"
              :class="isGroupOrder ? 'translate-x-6 rotate-90' : 'translate-x-0'"
            />
          </button>
        </div>
        
        <Transition name="fade">
          <div v-if="isGroupOrder" class="space-y-6 relative z-10 pt-4 border-t border-white/5 animate-fade-in">
            <p class="text-xs font-bold text-gray-400 leading-relaxed">Enter your Group ID to save on delivery costs.</p>
            <input
              v-model="groupId"
              type="text"
              placeholder="GROUP ID (e.g. LAB-X)"
              class="w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-white text-xl font-bold tracking-widest focus:bg-white/10 focus:border-parentPrimary/50 outline-none transition-all placeholder:text-white/10 shadow-inner"
            />
          </div>
        </Transition>
      </div>

      <!-- Order Summary -->
      <div class="bg-white p-6 md:p-12 rounded-3xl md:rounded-[4rem] border border-gray-100 shadow-sm space-y-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-48 h-48 bg-gray-50 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
        <div class="space-y-1 relative">
           <h3 class="font-black text-gray-900 tracking-tight text-3xl leading-none">Order Summary</h3>
           <p class="text-xs font-bold text-gray-300">Review your final total and pay securely.</p>
        </div>

        <div class="space-y-6 relative">
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-xs font-bold">Subtotal</span>
            <span class="text-gray-900 font-bold text-xl tracking-tight leading-none">₦{{ cartStore.subtotal?.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-xs font-bold">Delivery Fee</span>
            <div class="text-right">
              <span v-if="isGroupOrder" class="text-rose-500 text-[10px] font-bold mr-4 bg-rose-50 px-3 py-1 rounded-lg">-₦30 Discount</span>
              <span class="text-gray-900 font-bold text-xl tracking-tight leading-none">₦{{ cartStore.deliveryFee.value?.toLocaleString() }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center pb-8">
            <span class="text-gray-400 text-xs font-bold">Service Fee</span>
            <span class="text-gray-900 font-bold text-xl tracking-tight leading-none">₦{{ cartStore.serviceFee.value?.toLocaleString() }}</span>
          </div>
          
          <div class="pt-10 border-t border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div class="space-y-2">
               <p class="text-xs font-bold text-parentPrimary leading-none mb-2">Total Amount</p>
               <div class="flex items-baseline gap-2">
                  <span class="text-7xl font-black text-gray-900 tracking-tight leading-none">₦{{ cartStore.total.value?.toLocaleString() }}</span>
                  <span class="text-[10px] font-bold text-gray-300">NGN</span>
               </div>
            </div>
            <div v-if="isGroupOrder" class="px-6 py-3 bg-emerald-500 text-white rounded-[1.25rem] text-[10px] font-bold shadow-xl shadow-emerald-500/20">
               Discount Applied
            </div>
          </div>
        </div>
      </div>

      <!-- Payment -->
      <div class="space-y-6">
        <button
          @click="startPayment"
          :disabled="placing || !deliveryAddress"
          class="w-full py-8 bg-gray-900 text-white rounded-[2.5rem] text-xl font-bold shadow-lg shadow-black/20 hover:bg-parentPrimary hover:-translate-y-1 hover:scale-[1.02] disabled:opacity-20 transition-all flex items-center justify-center gap-6 group border-b-[8px] border-black active:scale-95 active:border-b-0 active:translate-y-2"
        >
          <div v-if="placing" class="flex gap-1.5">
             <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0s" />
             <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.1s" />
             <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s" />
          </div>
          <div v-else class="flex items-center gap-4">
             <CreditCard class="w-8 h-8 group-hover:rotate-12 transition-transform" />
             Pay Now
          </div>
        </button>

        <button @click="cartStore.clearCart()" class="w-full py-6 text-xs font-bold text-gray-300 hover:text-rose-500 transition-all">
          Clear Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus, Loader2, MapPin, CreditCard, X } from 'lucide-vue-next';
import { useUser } from '@/composables/modules/auth/user';
import { useCart } from '@/composables/modules/cart';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { ref } from 'vue';

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
