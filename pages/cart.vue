<template>
 <div class="min-h-screen bg-white flex justify-center selection:bg-parentPrimary/10 selection:text-parentPrimary font-sans overflow-y-auto">
 
 <!-- Empty State -->
 <div v-if="cartStore.isEmpty.value" class="w-full flex flex-col items-center justify-start p-6 max-w-5xl mx-auto pb-32">
 <div class="bg-white rounded-[3rem] text-center p-12 border border-gray-100 shadow-sm w-full animate-fade-in flex flex-col items-center mb-12">
 <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm transform -rotate-6 animate-float">🛒</div>
 <h2 class="text-3xl font-black text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
 <p class="text-sm font-medium text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything yet. Discover campus favorites below and start shopping.</p>
 <NuxtLink to="/vendors" class="px-8 py-4 bg-gray-900 text-white rounded-[2rem] font-bold text-sm shadow-xl hover:bg-parentPrimary hover:shadow-parentPrimary/30 transition-all active:scale-95 flex items-center gap-2">
 <ShoppingBag class="w-4 h-4" /> Browse All Vendors
 </NuxtLink>
 </div>

 <!-- Recommendations -->
 <div class="w-full space-y-6 animate-fade-in" style="animation-delay: 100ms">
 <div class="flex items-center justify-between px-2">
 <h3 class="text-xl font-black text-gray-900 tracking-tight">Campus Favorites 🔥</h3>
 <NuxtLink to="/vendors" class="text-xs font-bold text-parentPrimary hover:underline py-2 px-4 rounded-lg bg-parentPrimary/10">See all</NuxtLink>
 </div>
 
 <div v-if="loadingVendors" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <div v-for="i in 3" :key="i" class="h-64 bg-gray-50 rounded-[2rem] border border-gray-100 animate-pulse"></div>
 </div>
 
 <div v-else-if="popularVendors.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <NuxtLink 
 v-for="vendor in popularVendors.slice(0, 6)" 
 :key="vendor._id"
 :to="`/vendors/${vendor._id}`" 
 class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group hover:-translate-y-1 block duration-300"
 >
 <div class="h-32 w-full bg-gray-100 relative overflow-hidden">
 <img :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
 <div class="absolute bottom-3 left-4 flex gap-2">
 <span class="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-[9px] font-black text-white tracking-[0.2em] shadow-sm uppercase border border-white/20">
 {{ vendor.preparationTime || 20 }} MIN
 </span>
 </div>
 <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-sm flex items-center gap-1 border border-white/50">
 <Star class="w-3 h-3 text-amber-500 fill-current" />
 <span class="text-[10px] font-black text-gray-900">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
 </div>
 </div>
 <div class="p-5 flex items-center justify-between gap-4">
 <div class="flex items-center gap-3 min-w-0">
 <div class="w-10 h-10 rounded-xl border border-gray-100 overflow-hidden shrink-0 shadow-sm bg-gray-50">
 <img v-if="vendor.logo" :src="vendor.logo" class="w-full h-full object-cover" />
 <span v-else class="w-full h-full flex items-center justify-center font-black text-gray-400 text-xs">{{ vendor.storeName?.[0] }}</span>
 </div>
 <div class="min-w-0">
 <h4 class="text-sm font-black text-gray-900 truncate tracking-tight">{{ vendor.storeName }}</h4>
 <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5 truncate">{{ vendor.category }}</p>
 </div>
 </div>
 <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-parentPrimary group-hover:text-white transition-colors shrink-0">
 <ArrowRight class="w-4 h-4" />
 </div>
 </div>
 </NuxtLink>
 </div>
 </div>
 </div>

 <!-- Active Cart Layout -->
 <div v-else class="w-full max-w-[1400px] lg:h-full flex flex-col lg:flex-row gap-4 p-2 md:p-4 lg:p-6 overflow-x-hidden">
 
 <!-- Left (Review Order) -->
 <div class="flex-1 lg:h-full lg:overflow-y-auto scrollbar-hide pb-20">
 <!-- Compact Header Pill -->
 <div class="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm mb-6 max-w-3xl mx-auto">
 <div>
 <h2 class="text-xl font-black text-gray-900 tracking-tight whitespace-nowrap">Review Order</h2>
 <p class="text-gray-400 text-xs font-bold tracking-widest mt-1">Check your items before checkout</p>
 </div>
 <button @click="goBack" class="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center border border-gray-100 group">
 <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 </button>
 </div>

 <!-- Vendor Orders Container -->
 <div class="max-w-2xl mx-auto space-y-6">
 <div v-for="vendorId in cartStore.allVendorIds.value" :key="vendorId">
 
 <!-- Vendor Header -->
 <div class="flex items-center justify-between px-3 mb-4">
 <div class="flex items-center gap-3">
 <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
 <ShoppingBag class="w-4 h-4 text-parentPrimary" />
 </div>
 <div>
 <h3 class="text-sm font-black text-gray-900 tracking-tight truncate">{{ toTitleCase(vendorsMetadata[vendorId]?.storeName || 'Loading...') }}</h3>
 <div v-if="activeCode && groupOrder?.vendor?._id === vendorId" class="flex items-center gap-2 mt-1">
 <Users class="w-3 h-3 text-emerald-500" />
 <span class="text-[9px] font-bold text-emerald-600 tracking-widest">Group order active: {{ activeCode }}</span>
 </div>
 <p v-else class="text-[9px] font-bold text-gray-400 tracking-widest mt-0.5">{{ cartStore.getVendorStats(vendorId).itemCount }} items</p>
 </div>
 </div>
 <button v-if="!activeCode" @click="cartStore.clearCart(vendorId)" class="p-2 text-gray-300 hover:text-rose-500 transition-all">
 <Trash2 class="w-4 h-4" />
 </button>
 </div>

 <!-- Group Order Participants View -->
 <div v-if="activeCode && groupOrder?.vendor?._id === vendorId" class="space-y-3">
 <div v-for="participant in groupOrder.participants" :key="participant.user._id" class="bg-white rounded-xl border border-gray-50 p-4 transition-all">
 <div class="flex items-center gap-2 mb-3 pt-1">
 <div class="w-6 h-6 rounded-md bg-gray-100 text-gray-900 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
 <img v-if="participant.user.avatar" :src="participant.user.avatar" class="w-full h-full object-cover" />
 <span v-else class="font-black text-[9px]">{{ participant.user.firstName?.[0] || 'U' }}</span>
 </div>
 <div>
 <h4 class="font-black text-gray-900 text-[10px] tracking-tighter">
 {{ toTitleCase(participant.user.firstName + ' ' + participant.user.lastName) }}
 <span v-if="participant.user._id === user?._id" class="text-[7px] text-parentPrimary font-black bg-parentPrimary/10 px-1 py-0.5 rounded ml-1">YOU</span>
 </h4>
 </div>
 </div>

 <div class="space-y-3">
 <div v-for="(item, idx) in participant.items" :key="idx" class="flex items-center gap-3">
 <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-50">
 <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover text-sans text-[8px]" alt="Image uploaded" />
 </div>
 <div class="flex-1 min-w-0 pr-2">
 <h4 class="font-bold text-gray-900 text-[10px] truncate tracking-tighter">{{ toTitleCase(item.name) }}</h4>
 <p class="text-parentPrimary font-black text-[9px]">₦{{ item.price?.toLocaleString() }}</p>
 </div>
 <div class="text-right">
 <p class="font-black text-gray-900 text-[10px]">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
 <span class="text-[8px] font-black text-gray-400 tracking-widest">Qty {{ item.quantity }}</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Standard View -->
 <div v-else class="space-y-4">
 <div v-for="(pack, pIndex) in cartStore.getVendorStats(vendorId).packs" :key="pack.id" class="bg-white rounded-2xl p-6 border border-gray-100 group shadow-sm transition-all hover:shadow-md">
 <div class="flex items-center justify-between mb-6 pb-3 border-b border-gray-50">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-lg bg-gray-50 text-gray-900 flex items-center justify-center text-xs font-black border border-gray-100">
 {{ pIndex + 1 }}
 </div>
 <div class="flex flex-col">
 <div class="flex items-center gap-2 group/label bg-gray-50/50 hover:bg-gray-100 rounded-xl px-3 py-1 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
 <input 
 type="text" 
 :value="pack.name || `Pack ${pIndex + 1}`"
 placeholder=""
 @blur="e => cartStore.renamePack(vendorId, pack.id, (e.target as HTMLInputElement).value)"
 @keyup.enter="e => (e.target as HTMLInputElement).blur()"
 class="font-black text-gray-900 text-xs bg-transparent border-none p-0 focus:ring-0 outline-none tracking-widest w-full max-w-[150px]"
 />
 <Pencil class="w-3 h-3 text-gray-300 group-hover/label:text-gray-900 transition-colors" />
 </div>
 <p class="text-[9px] font-bold text-gray-400 tracking-widest mt-1 px-1">{{ pack.items.length }} items in this pack</p>
 </div>
 </div>
 <button @click="cartStore.removePack(vendorId, pack.id)" class="p-1.5 text-gray-200 hover:text-rose-500 transition-colors">
 <X class="w-4 h-4" />
 </button>
 </div>

 <div class="space-y-5">
 <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex items-center gap-4">
 <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm">
 <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover text-sans text-[10px]" alt="Product thumbnail" />
 </div>
 <div class="flex-1 min-w-0 pr-2">
 <h4 class="font-black text-gray-900 text-sm truncate tracking-tighter">{{ toTitleCase(item.name) }}</h4>
 <p class="text-parentPrimary font-black text-xs mt-0.5">₦{{ item.price?.toLocaleString() }}</p>
 </div>
 <div class="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-100">
 <button
 @click="cartStore.updateItemQuantity(vendorId, pack.id, iIndex, item.quantity - 1)"
 class="w-8 h-8 rounded-lg bg-white text-gray-400 flex items-center justify-center hover:text-rose-500 transition-all font-bold shadow-sm border border-gray-50 text-lg"
 >−</button>
 <span class="text-gray-900 font-bold min-w-[24px] text-center text-sm px-1">{{ item.quantity }}</span>
 <button
 @click="cartStore.updateItemQuantity(vendorId, pack.id, iIndex, item.quantity + 1)"
 class="w-8 h-8 rounded-lg bg-white text-gray-400 flex items-center justify-center hover:text-parentPrimary transition-all font-bold shadow-sm border border-gray-50 text-lg"
 >+</button>
 </div>
 <div class="text-right min-w-[80px]">
 <p class="font-black text-gray-900 text-sm">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
 </div>
 </div>
 </div>
 </div>
 </div>



 </div>
 </div>
 </div>

 <!-- Right Summary -->
 <div class="w-full lg:w-[380px] shrink-0 lg:h-[calc(100vh-100px)] lg:overflow-y-auto scrollbar-hide pb-32">
 <div class="bg-white rounded-xl border border-gray-50 p-6 md:p-8">
 <div class="flex items-center gap-3 mb-6">
 <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-50">
 <MapPin class="w-4 h-4 text-gray-900" />
 </div>
 <div>
 <h3 class="text-sm font-black text-gray-900 tracking-tight">Delivery Details</h3>
 <p class="text-[8px] font-bold text-gray-400 tracking-widest mt-0.5">Where should we go?</p>
 </div>
 </div>

 <div class="space-y-4">
  <div class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-4 mb-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-parentPrimary/10 flex items-center justify-center text-lg">🎁</div>
        <div class="min-w-0">
          <p class="text-[10px] font-black text-gray-900 tracking-tight">Mystery Box</p>
          <p class="text-[8px] font-bold text-gray-500 uppercase tracking-widest truncate">Random item for ₦800</p>
        </div>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="isMysteryBox" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-parentPrimary"></div>
      </label>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-lg">🏢</div>
        <div class="min-w-0">
          <p class="text-[10px] font-black text-gray-900 tracking-tight">Dorm Delivery</p>
          <p class="text-[8px] font-bold text-gray-500 uppercase tracking-widest truncate">Split fee with hostel neighbors</p>
        </div>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="isDormDelivery" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
      </label>
    </div>
  </div>
 <AnimatedInput 
 v-model="recipientName" 
 label="Recipient name" 
 placeholder=""
 />

 <SelectInput 
 v-model="deliveryOption" 
 label="Delivery option" 
 :options="[{label: 'Use an Errander (₦150)', value: 'use_an_errander'}, {label: 'I\'ll pick it up myself', value: 'pickup'}]"
 />

 <Transition name="fade-slide">
 <AnimatedInput 
 v-if="deliveryOption === 'use_an_errander'"
 v-model="specificAddress" 
 label="Specific address" 
 placeholder=""
 />
 </Transition>

 <AnimatedInput 
 v-model="recipientPhone" 
 type="tel"
 label="Phone number" 
 placeholder=""
 />

 <div v-for="vId in cartStore.allVendorIds.value" :key="'pack-dropdown-'+vId">
 <SelectInput
 v-if="vendorsMetadata[vId]?.packs?.length"
 :modelValue="selectedPacks[vId]?.name || ''"
 @update:modelValue="(val: any) => updateSelectedPack(vId, val as string)"
 :label="cartStore.allVendorIds.value.length > 1 ? `Packaging Type (${toTitleCase(vendorsMetadata[vId]?.storeName || '')})` : 'Select Packaging Type'"
 :options="vendorsMetadata[vId].packs.filter((p: any) => p.isActive).map((p: any) => ({ label: `${p.name} (+₦${p.price})`, value: p.name }))"
 position="standalone"
 />
 </div>
 </div>

 <!-- Order Summary -->
 <div class="mt-8 pt-6 border-t border-gray-100 space-y-4">
 <div class="flex justify-between items-center text-[11px] font-bold text-gray-500 tracking-widest">
 <span>Items total</span>
 <span class="text-gray-900">₦{{ (groupOrder ? groupSubtotal : cartStore.subtotal.value)?.toLocaleString() }}</span>
 </div>
 <div class="flex justify-between items-center text-[11px] font-bold text-gray-500 tracking-widest">
 <span>Delivery total</span>
 <span class="text-gray-900">₦{{ computedTotalDeliveryFee.toLocaleString() }}</span>
 </div>
 <div class="flex justify-between items-center text-[11px] font-bold text-gray-500 tracking-widest">
 <span>Service fee</span>
 <span class="text-gray-900">₦{{ (computedTotalServiceFee + computedPaystackFee).toLocaleString() }}</span>
 </div>

 <!-- Total Box -->
 <div class="pt-6 mt-4 border-t-2 border-gray-100">
 <div class="flex justify-between items-end">
 <div>
 <p class="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">Total Payable</p>
 <span class="text-3xl font-black text-gray-900 tracking-tighter">₦{{ finalTotal.toLocaleString() }}</span>
 </div>
 <div class="pb-1">
 <span class="text-[10px] font-black text-emerald-500 tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">READY</span>
 </div>
 </div>
 </div>
 </div>

 <!-- Actions -->
 <div class="flex flex-col gap-2 mt-8">
 <button
 @click="startPayment"
 :disabled="placing"
 class="w-full py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black tracking-[0.2em] hover:bg-parentPrimary transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-gray-100"
 >
 <div v-if="placing" class="flex items-center gap-2">
 <Loader2 class="w-4 h-4 animate-spin" />
 <span class="text-[8px] font-black tracking-widest">PROCESSING...</span>
 </div>
 <template v-else>
 <span>Checkout Now</span>
 <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
 </template>
 </button>
 <button @click="cartStore.clearCart()" class="w-full py-3 rounded-xl border border-gray-50 text-gray-400 text-[8px] font-black tracking-widest hover:text-rose-500 hover:bg-rose-50/10 transition-all border-none">
 Clear entire cart
 </button>
 </div>
 </div>
 </div>

 </div>

 <!-- Auth Required Modal -->
 <Transition name="fade-slide">
 <div v-if="showAuthModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="showAuthModal = false"></div>
 <div class="relative bg-white rounded-[2rem] shadow-xl w-full max-w-sm p-8 text-center flex flex-col items-center">
 <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-blue-100">
 <User class="w-8 h-8" />
 </div>
 <h2 class="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Almost there!</h2>
 <p class="text-sm text-gray-500 font-medium mb-8 leading-relaxed">To complete your order and track it in real-time, please sign in or create a quick account. It only takes a minute!</p>
 
 <div class="w-full space-y-3">
 <button @click="goToLogin" class="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-parentPrimary transition-all shadow-lg hover:-translate-y-0.5 outline-none">
 Sign in
 </button>
 <button @click="goToRegister" class="w-full py-4 bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl text-sm font-bold hover:bg-gray-100 hover:border-gray-200 transition-all outline-none">
 Create an account
 </button>
 </div>
 
 <button @click="showAuthModal = false" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all outline-none">
 <X class="w-5 h-5" />
 </button>
 </div>
 </div>
 </Transition>
 </div>
</template>

<script setup lang="ts">
import { 
 ShoppingBag, Trash2, X, ShoppingCart, ArrowLeft, MapPin, 
 User, Phone, Home, ChevronDown, Check, ArrowRight, Users, Pencil, Loader2, Star 
} from 'lucide-vue-next';
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import { useUser } from '@/composables/modules/auth/user';
import { useCart } from '@/composables/modules/cart';
import { useGroupOrder } from '@/composables/modules/group-order';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { vendors_api } from '@/api_factory/modules/vendors';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from '#imports';

definePageMeta({
 layout: false // Immersive checkout without dashboard sidebar
})

const cartStore = useCart();
const { user } = useUser();
const { groupOrder, activeCode, fetchGroupOrder } = useGroupOrder();
const { showToast } = useCustomToast();
const route = useRoute();

const recipientName = ref('');
const recipientPhone = ref('');
const specificAddress = ref('');
const deliveryOption = ref('use_an_errander');
const saveAsFavorite = ref(false);
const placing = ref(false);
const showAuthModal = ref(false);
const paymentError = ref('');
const vendorsMetadata = ref<Record<string, any>>({});
const selectedPacks = ref<Record<string, any>>({}); // vendorId -> { name, price }
const popularVendors = ref<any[]>([]);
const loadingVendors = ref(false);
const isMysteryBox = ref(false);
const isDormDelivery = ref(false);

const updateSelectedPack = (vendorId: string, packName: string) => {
 const pack = vendorsMetadata.value[vendorId]?.packs?.find((p: any) => p.name === packName);
 if (pack) {
 selectedPacks.value[vendorId] = pack;
 }
};

const getPopularVendors = async () => {
 if (!cartStore.isEmpty.value) return;
 loadingVendors.value = true;
 try {
 const res = await vendors_api.getPopular();
 popularVendors.value = res.data?.vendors || res.data?.data?.vendors || res.data || [];
 } catch (e) {
 console.error('Failed to fetch popular vendors', e);
 } finally {
 loadingVendors.value = false;
 }
};

const fetchVendorsMetadata = async () => {
 const ids = cartStore.allVendorIds.value;
 for (const id of ids) {
 if (!vendorsMetadata.value[id]) {
 try {
 const res = await api.get(`/vendors/${id}`);
 vendorsMetadata.value[id] = res.data;
 } catch (e) {
 console.error(`Failed to fetch metadata for vendor ${id}`, e);
 }
 }
 }
};

const toTitleCase = (str: string) => {
 if (!str) return '';
 return str.split(' ').map(word => {
 if (!word) return '';
 return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
 }).join(' ');
};

onMounted(async () => {
 cartStore.initCart();

 if (cartStore.isEmpty.value) {
 getPopularVendors();
 }

 // Check for group order
 if (route.query.group) {
 try {
 await fetchGroupOrder(route.query.group as string);
 } catch (e) {
 console.error('Failed to load group order for checkout', e);
 }
 }

 // Check if returning from payment
 if (route.query.reference) {
 placing.value = true;
 try {
 const verifyRes = await api.get(`/payments/verify?reference=${route.query.reference}`);
 const paymentData = (verifyRes.data as any)?.data;
 if (paymentData?.status === 'success') {
 if (groupOrder.value) {
 await placeGroupOrders(route.query.reference as string);
 } else {
 await placeAllOrders(route.query.reference as string);
 }
 } else {
 paymentError.value = 'Payment was not completed. Please try again.';
 placing.value = false;
 }
 } catch (e) {
 console.error('Payment verification error', e);
 paymentError.value = 'Could not verify payment. Please contact support.';
 placing.value = false;
 }
 }

 await fetchVendorsMetadata();
 // Pre-fill from user
 if (user.value) {
 recipientName.value = `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim();
 recipientPhone.value = user.value.phone || '';
 }
});

// Watch for cart changes to fetch new metadata if needed
watch(() => cartStore.allVendorIds.value, () => {
 fetchVendorsMetadata();
}, { deep: true });

const computedTotalDeliveryFee = computed(() => {
 if (deliveryOption.value === 'pickup') return 0;
 
 // Use vendor-specific delivery fees if available, otherwise fallback to 150
 let totalDelivery = 0;
 cartStore.allVendorIds.value.forEach(vId => {
 const vendor = vendorsMetadata.value[vId];
 totalDelivery += vendor?.deliveryFee ?? 150;
 });

 if (isDormDelivery.value) {
  totalDelivery = Math.round(totalDelivery * 0.5);
 }
 return totalDelivery;
});

const computedTotalPackagingFee = computed(() => {
 let totalPackaging = 0;
 cartStore.allVendorIds.value.forEach(vId => {
 const vendor = vendorsMetadata.value[vId];
 const selected = selectedPacks.value[vId];
 
 if (selected) {
 totalPackaging += selected.price;
 } else {
 totalPackaging += vendor?.packagingFee ?? 300;
 }
 });
 return totalPackaging;
});

const computedTotalServiceFee = computed(() => {
 const subtotal = groupOrder.value 
 ? groupOrder.value.participants.reduce((acc: number, p: any) => acc + p.items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0), 0)
 : (isMysteryBox.value ? 800 : cartStore.subtotal.value);
 return Math.round(subtotal * 0.05);
});

const groupSubtotal = computed(() => {
 if (!groupOrder.value) return 0;
 return groupOrder.value.participants.reduce((acc: number, p: any) => acc + p.items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0), 0);
});

const subtotalBeforeFee = computed(() => {
 const subtotal = groupOrder.value ? groupSubtotal.value : (isMysteryBox.value ? 800 : cartStore.subtotal.value);
 const delivery = computedTotalDeliveryFee.value;
 const packaging = computedTotalPackagingFee.value;
 const service = computedTotalServiceFee.value;
 return subtotal + delivery + packaging + service;
});

const computedPaystackFee = computed(() => {
 const amount = subtotalBeforeFee.value;
 if (amount === 0) return 0;
 
 // Paystack Local Transactions: 1.5% + 100 NGN (100 NGN waived if under 2500)
 // Max fee is 2000 NGN
 let fee = 0;
 if (amount < 2500) {
 fee = (amount / 0.985) - amount;
 } else {
 fee = ((amount + 100) / 0.985) - amount;
 }
 
 if (fee > 2000) fee = 2000;
 return Math.ceil(fee);
});

const finalTotal = computed(() => {
 return subtotalBeforeFee.value + computedPaystackFee.value;
});

// Note: cartStore.total.value already includes subtotal + packaging (300 per v) + service (5%)
// We just need to add delivery fee here or update useCart to include it.
// I'll update useCart's total to include delivery if needed, but for now I'll use a local total if it differs.
// Actually, I'll rely on useCart's total and just ensure it matches.

const isFormValid = computed(() => {
 if (!recipientName.value.trim()) return false;
 if (!recipientPhone.value.trim()) return false;
 if (!deliveryOption.value) return false;
 if (deliveryOption.value === 'use_an_errander' && !specificAddress.value.trim()) return false;
 if (cartStore.isEmpty.value && !groupOrder.value) return false;
 return true;
});

const goBack = () => {
 const lastVendorId = cartStore.allVendorIds.value[cartStore.allVendorIds.value.length - 1];
 if (lastVendorId) {
 navigateTo(`/vendors/${lastVendorId}`);
 } else {
 navigateTo('/vendors');
 }
};

useHead({
 title: 'Checkout - Errandr'
});

const goToLogin = () => {
 navigateTo('/auth/login?redirect=/cart');
};

const goToRegister = () => {
 navigateTo('/auth/register?redirect=/cart');
};

const startPayment = async () => {
 if (!user.value?.email) {
 showAuthModal.value = true;
 return;
 }

 placing.value = true;
 paymentError.value = '';

 try {
 const res = await api.post('/payments/initialize', {
 amount: Math.round(finalTotal.value),
 customer: {
 name: recipientName.value || `${user.value.firstName} ${user.value.lastName}`,
 email: user.value.email,
 },
 callback_url: `${window.location.origin}/cart${route.query.group ? '?group=' + route.query.group : ''}`,
 metadata: {
 deliveryOption: deliveryOption.value,
 recipientName: recipientName.value,
 recipientPhone: recipientPhone.value,
 specificAddress: specificAddress.value,
 },
 });

 const authUrl = (res.data as any)?.data?.authorization_url;
 if (authUrl) {
 window.location.href = authUrl;
 } else {
 placing.value = false;
 paymentError.value = 'Could not initialize payment. Please try again.';
 }
 } catch (e: any) {
 const errorMessage = e.response?.data?.message || e.message;
 console.error(`Paystack Initialize Error: ${errorMessage}`, {
 payload: {
 amount: Math.round(finalTotal.value),
 customer: {
 name: recipientName.value || `${user.value.firstName} ${user.value.lastName}`,
 email: user.value.email,
 },
 callback_url: `${window.location.origin}/cart${route.query.group ? '?group=' + route.query.group : ''}`,
 metadata: {
 deliveryOption: deliveryOption.value,
 recipientName: recipientName.value,
 recipientPhone: recipientPhone.value,
 specificAddress: specificAddress.value,
 },
 },
 response: e.response?.data
 });
 placing.value = false;
 paymentError.value = errorMessage || 'Payment initialization failed. Please try again.';
 }
};

const placeGroupOrders = async (reference: string) => {
 let firstOrderId = null;
 if (!groupOrder.value) return;

 const vendorId = groupOrder.value.vendor._id;
 
 for (const participant of groupOrder.value.participants) {
 if (participant.items.length === 0) continue;

 try {
 const vendorMeta = vendorsMetadata.value[vendorId];
 const participantSubtotal = participant.items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
 const deliveryFee = deliveryOption.value === 'pickup' ? 0 : (vendorMeta?.deliveryFee ?? 150);
 const packagingFee = vendorMeta?.packagingFee ?? 300;
 
 const res = await api.post<any>('/orders', {
 vendorId,
 customer: participant.user._id, // The order belongs to the participant
 items: participant.items.map((item: any) => ({
 product: item.productId,
 name: item.name,
 price: item.price,
 image: item.image,
 quantity: item.quantity,
 subtotal: item.price * item.quantity,
 })),
 subtotal: participantSubtotal,
 deliveryFee,
 serviceFee: Math.round(participantSubtotal * 0.05),
 packagingFee,
 total: participantSubtotal + Math.round(participantSubtotal * 0.05) + packagingFee + deliveryFee,
 deliveryOption: deliveryOption.value,
 recipientName: recipientName.value,
 recipientPhone: recipientPhone.value,
 specificAddress: specificAddress.value,
 deliveryAddress: specificAddress.value,
 paymentReference: reference,
 isGroupOrder: true,
 groupId: activeCode.value,
 isGroupLeader: participant.user._id === groupOrder.value.host._id
 });
 
 if (!firstOrderId) firstOrderId = res.data._id;
 } catch (e: any) {
 console.error(`Failed to place group order for participant ${participant.user._id}`, e);
 }
 }

 if (firstOrderId) {
 // Notify participants or update group status? 
 // For now just redirect
 navigateTo(`/orders/${firstOrderId}`);
 } else {
 showToast({
 title: 'Order Error',
 message: 'Failed to place group orders.',
 toastType: 'error'
 });
 navigateTo('/orders');
 }
 placing.value = false;
};

const placeAllOrders = async (reference: string) => {
 let firstOrderId = null;
 const vendorIds = [...cartStore.allVendorIds.value];
 
 for (const vId of vendorIds) {
 try {
 const stats = cartStore.getVendorStats(vId) as any;
 const vendor = vendorsMetadata.value[vId];
 const packagingFee = vendor?.packagingFee ?? 300;
 const deliveryFee = deliveryOption.value === 'pickup' ? 0 : (vendor?.deliveryFee ?? 150);
 
 const res = await api.post<any>('/orders', {
 vendorId: vId,
 packs: stats.packs.map((pack: any, index: number) => ({
 packId: pack.id,
 name: pack.name || `Pack ${index + 1}`,
 items: pack.items.map((item: any) => ({
 product: item.productId,
 name: item.name,
 price: item.price,
 image: item.image,
 quantity: item.quantity,
 subtotal: item.subtotal,
 })),
 })),
 subtotal: stats.subtotal,
 deliveryFee,
 serviceFee: stats.serviceFee,
 selectedPack: selectedPacks.value[vId] || { 
 name: 'Standard Packaging', 
 price: vendor?.packagingFee ?? 300 
 },
  isMysteryBox: isMysteryBox.value,
  isDormDelivery: isDormDelivery.value, weight: 1.0,
 });
 
 if (!firstOrderId) firstOrderId = res.data._id;
 cartStore.clearCart(vId);
 } catch (e: any) {
 console.error(`Failed to place order for vendor ${vId}`, e);
 }
 }
 
 if (firstOrderId) {
 navigateTo(`/orders/${firstOrderId}`);
 } else {
 showToast({
 title: 'Order Error',
 message: 'Failed to place some orders. Please check your history.',
 toastType: 'error'
 });
 navigateTo('/orders');
 }
 placing.value = false;
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
 display: none;
}
.no-scrollbar {
 -ms-overflow-style: none; /* IE and Edge */
 scrollbar-width: none; /* Firefox */
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

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
.fade-slide-enter-active, .fade-slide-leave-active {
 transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
 opacity: 0;
 transform: translateY(-10px);
}
</style>
