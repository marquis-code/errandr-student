<template>
  <div class="min-h-screen bg-white" v-if="vendor">
    <!-- Standalone Header -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-50">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/vendors')" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all">
            <ArrowLeft class="w-4 h-4 text-gray-900" />
          </button>
          <NuxtLink to="/dashboard" class="text-lg font-bold text-gray-900 tracking-tighter">Errandr</NuxtLink>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/cart" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all relative">
            <ShoppingCart class="w-4 h-4 text-gray-900" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="max-w-[1400px] mx-auto animate-fade-in pb-32 px-6 pt-6">
    <!-- Compact Vendor Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2 border-b border-gray-50 pb-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white shrink-0">
          <img :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
        </div>
        <div>
          <h1 class="text-xl font-black text-gray-900 tracking-tight">{{ toTitleCase(vendor.storeName) }}</h1>
          <div class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            <div class="flex items-center gap-1">
              <Star class="w-3 h-3 text-amber-400 fill-current" />
              <span class="text-gray-900">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
            </div>
            <div class="w-1 h-1 rounded-full bg-gray-200" />
            <span>{{ vendor.totalRatings || 0 }} reviews</span>
            <div class="w-1 h-1 rounded-full bg-gray-200" />
            <button @click="showStoreInfo = true" class="text-parentPrimary hover:underline">Info</button>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-sans">
        <button 
          @click="handleStartGroupOrder"
          class="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-100 transition-all whitespace-nowrap"
        >
          <Users class="w-3.5 h-3.5" />
          {{ activeCode ? `Group: ${activeCode}` : 'Group Order' }}
        </button>
        <button class="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:text-rose-500 transition-all shrink-0">
          <Heart class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Banner (Scaled Down) -->
    <div v-if="vendor.banners?.length" class="mb-10 px-2 overflow-hidden">
      <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        <div 
          v-for="(banner, idx) in vendor.banners" 
          :key="idx"
          class="flex-shrink-0 w-full md:w-[480px] h-[180px] rounded-2xl overflow-hidden relative shadow-sm border border-gray-50 snap-start"
        >
          <img :src="banner.image" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
             <h3 class="text-base font-black text-white tracking-tight">{{ toTitleCase(banner.title) }}</h3>
             <p class="text-[9px] font-bold text-white/80 uppercase tracking-widest mt-1">{{ banner.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Sticky Category Nav -->
      <aside class="lg:w-48 shrink-0">
        <div class="sticky top-24 space-y-1">
          <h4 class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Categories</h4>
          <button
            v-for="cat in categories"
            :key="cat"
            @click="scrollToCategory(cat)"
            class="w-full text-left px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all relative group"
            :class="activeCategory === cat ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
          >
            {{ toTitleCase(cat) }}
          </button>
        </div>
      </aside>

      <!-- Products Grid -->
      <div class="flex-1 space-y-12">
        <section 
          v-for="cat in categories" 
          :key="cat" 
          :id="cat.toLowerCase().replace(/\s+/g, '-')"
          class="scroll-mt-32"
        >
          <div class="flex items-center gap-3 mb-6">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-widest">{{ toTitleCase(cat) }}</h2>
            <div class="h-px bg-gray-50 flex-1" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="product in groupedProducts[cat]" 
              :key="product._id"
              @click="addToCart(product)"
              class="flex bg-white rounded-2xl border border-gray-50 hover:shadow-md hover:border-gray-100 transition-all overflow-hidden cursor-pointer group"
            >
              <div class="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                  <h3 class="text-sm font-bold text-gray-900 truncate tracking-tight uppercase tracking-tighter">{{ toTitleCase(product.name) }}</h3>
                  <p class="text-[10px] font-bold text-gray-400 line-clamp-2 mt-1">{{ product.description || 'Freshly prepared for you.' }}</p>
                </div>
                <div class="flex items-center gap-3 mt-4">
                  <span class="text-sm font-black text-gray-900">₦{{ (product.discountPrice || product.price).toLocaleString() }}</span>
                  <span v-if="product.discountPrice" class="text-[9px] text-gray-400 line-through">₦{{ product.price.toLocaleString() }}</span>
                </div>
              </div>
              <div class="w-24 md:w-32 aspect-square shrink-0 relative bg-gray-50 border-l border-gray-50">
                <img :src="product.image || '/placeholder-food.jpg'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute bottom-2 right-2">
                  <div v-if="getProductCount(product._id) > 0" class="flex items-center gap-1.5 bg-white shadow-lg p-1 rounded-xl border border-gray-100">
                    <button @click.stop="removeFromCart(product)" class="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center hover:text-rose-500 transition-colors"><Minus class="w-3 h-3" /></button>
                    <span class="text-[10px] font-black w-4 text-center">{{ getProductCount(product._id) }}</span>
                    <button @click.stop="addToCart(product)" class="w-6 h-6 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-parentPrimary transition-colors"><Plus class="w-3 h-3" /></button>
                  </div>
                  <button v-else class="w-8 h-8 rounded-xl bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Compact Right Sidebar (Orders/Participants) -->
      <aside class="hidden xl:block w-72 shrink-0 space-y-8">
        <div class="sticky top-24 space-y-8">
           <!-- Participants -->
           <div v-if="groupOrder" class="space-y-4">
              <h3 class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Participants</h3>
              <div class="space-y-2">
                <div v-for="p in groupOrder.participants" :key="p.user._id" class="p-3 bg-white border border-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-black text-[8px] text-gray-500 overflow-hidden shrink-0">
                    <img v-if="p.user.avatar" :src="p.user.avatar" class="w-full h-full object-cover" />
                    <span v-else>{{ p.user.firstName?.[0] }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-black text-gray-900 truncate">{{ p.user.firstName }} {{ p.user.lastName }}</p>
                    <p class="text-[8px] font-bold text-gray-400 italic">{{ p.items.length }} items</p>
                  </div>
                </div>
              </div>
           </div>

           <!-- Detailed Pack Summary (Pack Arrangement) -->
           <div class="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-5">
              <div class="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Your Packs</h3>
                <ShoppingCart class="w-3.5 h-3.5 text-parentPrimary" />
              </div>

              <div v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="space-y-5 max-h-[500px] overflow-y-auto pr-1 scrollbar-hide">
                <div v-for="(pack, pIndex) in cart.getVendorStats(vendor._id).packs" :key="pack.id" class="space-y-2">
                  <!-- Pack Header -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-[8px] font-black bg-gray-900 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <button @click="duplicatePack(vendor._id, pack)" class="p-1 text-gray-300 hover:text-parentPrimary transition-all" title="Duplicate pack">
                        <Copy class="w-3 h-3" />
                      </button>
                      <button @click="cart.removePack(vendor._id, pack.id)" class="p-1 text-gray-300 hover:text-rose-500 transition-all" title="Remove pack">
                        <Trash2 class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Pack Items -->
                  <div class="space-y-2 pl-1">
                    <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-md overflow-hidden shrink-0 border border-gray-50">
                        <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-[9px] font-bold text-gray-900 truncate">{{ toTitleCase(item.name) }}</p>
                        <p class="text-[8px] font-black text-parentPrimary">₦{{ item.price?.toLocaleString() }}</p>
                      </div>
                      <div class="flex items-center gap-0.5 bg-gray-50 rounded-md p-0.5 border border-gray-100">
                        <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity - 1)" class="w-5 h-5 rounded bg-white text-gray-400 flex items-center justify-center hover:text-rose-500 transition-all text-[10px] font-bold shadow-sm">−</button>
                        <span class="text-[9px] font-black w-4 text-center">{{ item.quantity }}</span>
                        <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity + 1)" class="w-5 h-5 rounded bg-white text-gray-400 flex items-center justify-center hover:text-parentPrimary transition-all text-[10px] font-bold shadow-sm">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add New Pack -->
                <button @click="addNewPack(vendor._id)" class="w-full py-2.5 border border-dashed border-gray-200 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:border-parentPrimary hover:text-parentPrimary transition-all flex items-center justify-center gap-1.5">
                  <Plus class="w-3 h-3" /> New Pack
                </button>

                <div class="pt-3 border-t border-gray-50 space-y-3">
                  <div class="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span class="text-gray-900 font-black">₦{{ cart.getVendorStats(vendor._id).subtotal.toLocaleString() }}</span>
                  </div>
                  <NuxtLink :to="activeCode ? `/cart?group=${activeCode}` : '/cart'" class="block w-full py-3.5 bg-gray-900 text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-parentPrimary transition-all shadow-lg shadow-gray-200">
                    {{ activeCode ? 'Finalize Order' : 'Checkout Now' }}
                  </NuxtLink>
                </div>
              </div>
              <div v-else class="text-center py-6">
                <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-lg">🛒</div>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Your cart is empty</p>
              </div>
           </div>
        </div>
      </aside>
    </div>

    <!-- Store Info Modal -->
    <div v-if="showStoreInfo" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-sans">
       <div class="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
          <div class="relative h-48">
             <img :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
             <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
             <button @click="showStoreInfo = false" class="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                <X class="w-5 h-5" />
             </button>
             <div class="absolute bottom-6 left-10">
                <h2 class="text-2xl font-black text-white tracking-tight">{{ toTitleCase(vendor.storeName) }}</h2>
                <p class="text-[10px] font-bold text-white/70 mt-1 uppercase tracking-widest">{{ vendor.about || 'Store info available' }}</p>
             </div>
          </div>
          <div class="p-10 space-y-8">
             <div class="space-y-4">
                <h3 class="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">About the vendor</h3>
                <p class="text-[11px] text-gray-600 leading-relaxed font-bold">{{ vendor.description || 'No description available for this vendor.' }}</p>
             </div>
             <div class="grid grid-cols-2 gap-8">
                <div class="space-y-3">
                   <div class="flex items-center gap-2 text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">
                      <Clock class="w-3 h-3" /> Availability
                   </div>
                   <div class="space-y-1">
                      <p v-for="(hours, day) in vendor.availability" :key="day" class="text-[10px] font-bold text-gray-900">
                        <span class="text-gray-400 w-16 inline-block tracking-tighter">{{ day }}:</span> {{ hours }}
                      </p>
                      <p v-if="!vendor.availability" class="text-[10px] font-bold text-gray-900">Available 24/7</p>
                   </div>
                </div>
                <div class="space-y-3">
                   <div class="flex items-center gap-2 text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">
                      <MapPin class="w-3 h-3" /> Location
                   </div>
                   <p class="text-[10px] font-bold text-gray-900 leading-relaxed">{{ vendor.address || 'University Main campus' }}</p>
                </div>
             </div>
             <button @click="showStoreInfo = false" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-parentPrimary transition-all shadow-xl">
                Got it
             </button>
          </div>
       </div>
    </div>

    <!-- Group Naming Modal -->
    <div v-if="showGroupNamingModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-sans">
       <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-fade-in-up">
          <div class="flex items-center gap-4 mb-8">
             <div class="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg text-gray-900">
                <Users class="w-6 h-6" />
             </div>
             <div>
                <h3 class="text-xl font-black text-gray-900 tracking-tight">Name your group</h3>
                <p class="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">e.g., \"Sunday Brunch\"</p>
             </div>
          </div>
          <div class="space-y-6">
             <div class="bg-gray-50 p-1 rounded-2xl border-2 border-transparent focus-within:border-parentPrimary transition-all">
                <UiAnimatedInput 
                   v-model="groupName" 
                   label="Group Name" 
                   @keyup.enter="confirmStartGroupOrder"
                />
             </div>
             <div class="flex gap-4">
                <button 
                   @click="showGroupNamingModal = false" 
                   class="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all font-sans"
                >
                   Cancel
                </button>
                <button 
                   @click="confirmStartGroupOrder" 
                   :disabled="!groupName.trim() || groupLoading"
                   class="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-parentPrimary transition-all shadow-xl disabled:opacity-50 font-sans"
                >
                   <span v-if="groupLoading">Starting...</span>
                   <span v-else>Start Order</span>
                </button>
             </div>
          </div>
       </div>
    </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
     <div class="w-10 h-10 border-4 border-gray-100 border-t-parentPrimary rounded-full animate-spin" />
  </div>
</template>

<script setup lang="ts">
import { 
  Plus, Minus, X, Copy, Trash2, ShoppingCart, 
  Clock, Star, MapPin, ArrowRight, Heart, ArrowLeft, Search, Info, ChevronRight, Users, ShoppingBag
} from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useHead, navigateTo } from '#imports';
import { useCart } from '@/composables/modules/cart';
import { useUser } from '@/composables/modules/auth/user';
import { useGroupOrder } from '@/composables/modules/group-order';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useToast } from '@/composables/useToast';

definePageMeta({
  layout: false
})

const route = useRoute();
const cart = useCart();
const { user } = useUser();
const { 
  groupOrder, activeCode, isLoading: groupLoading, createGroupOrder, 
  joinGroupOrder, fetchGroupOrder, syncWithCart, leaveGroupOrder 
} = useGroupOrder();
const { showToast } = useToast();

const vendor = ref<any>(null);
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const activeCategory = ref('');
const syncInterval = ref<any>(null);
const showStoreInfo = ref(false);
const showGroupNamingModal = ref(false);
const groupName = ref('');

const getVendorColor = (name: string) => {
  if (!name) return 'bg-gray-400';
  const colors = ['bg-indigo-600', 'bg-rose-500', 'bg-emerald-500', 'bg-orange-500', 'bg-parentPrimary', 'bg-red-600', 'bg-blue-600', 'bg-amber-600', 'bg-purple-600'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const getProductCount = (productId: string) => {
  if (!vendor.value) return 0;
  const vendorCart = cart.carts.value[vendor.value._id];
  if (!vendorCart) return 0;
  const activePack = vendorCart.packs.find(p => p.id === vendorCart.activePackId);
  if (!activePack) return 0;
  const item = activePack.items.find(i => i.productId === productId);
  return item?.quantity || 0;
};

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

const groupedProducts = computed(() => {
  const groups: Record<string, any[]> = {};
  products.value.forEach(p => {
    const cat = p.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(p);
  });
  return groups;
});

const removeFromCart = (product: any) => {
  if (!vendor.value) return;
  const vendorId = vendor.value._id;
  const vendorCart = cart.carts.value[vendorId];
  if (!vendorCart) return;
  const packId = vendorCart.activePackId;
  const pack = vendorCart.packs.find(p => p.id === packId);
  if (!pack) return;
  const itemIndex = pack.items.findIndex(i => i.productId === product._id);
  if (itemIndex > -1) {
    const item = pack.items[itemIndex];
    if (item.quantity > 1) {
      cart.updateItemQuantity(vendorId, packId, itemIndex, item.quantity - 1);
    } else {
      cart.removeItemFromPack(vendorId, packId, itemIndex);
    }
  }
  if (activeCode.value) {
    setTimeout(() => syncWithCart(vendorId), 100);
  }
};

const addToCart = (product: any) => {
  cart.addItem({
    productId: product._id,
    vendorId: vendor.value._id,
    name: product.name,
    price: product.discountPrice || product.price,
    image: product.image,
    quantity: 1,
    customizations: [],
  });
  if (activeCode.value) {
    setTimeout(() => syncWithCart(vendor.value._id), 100);
  }
};

const addNewPack = (vendorId: string) => {
  cart.addPack(vendorId);
  showToast('New pack added', 'success');
};

const duplicatePack = (vendorId: string, pack: any) => {
  cart.duplicatePack(vendorId, pack.id);
  showToast('Pack duplicated', 'success');
};

const scrollToCategory = (cat: string) => {
  activeCategory.value = cat;
  const element = document.getElementById(cat.toLowerCase().replace(/\s+/g, '-'));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleStartGroupOrder = () => {
    groupName.value = '';
    showGroupNamingModal.value = true;
};

const confirmStartGroupOrder = async () => {
  if (!groupName.value.trim() || groupLoading.value) return;
  try {
    await createGroupOrder(vendor.value._id, groupName.value);
    showToast('Group order started! Share the code with friends.', 'success');
    showGroupNamingModal.value = false;
    syncWithCart(vendor.value._id);
  } catch (e) {
    console.error('Failed to start group order', e);
    showToast('Failed to start group order', 'error');
  }
};

const copyInviteLink = () => {
  const link = `${window.location.origin}${window.location.pathname}?group=${activeCode.value}`;
  navigator.clipboard.writeText(link);
  showToast('Invite link copied to clipboard!', 'success');
};

const handleScroll = () => {
  const sections = categories.value.map(cat => ({
    id: cat,
    el: document.getElementById(cat.toLowerCase().replace(/\s+/g, '-'))
  }));
  const scrollPosition = window.scrollY + 150;
  for (const section of sections) {
    if (section.el && section.el.offsetTop <= scrollPosition && (section.el.offsetTop + section.el.offsetHeight) > scrollPosition) {
      activeCategory.value = section.id;
      break;
    }
  }
};

onMounted(async () => {
  cart.initCart();
  try {
    const [vendorRes, productsRes] = await Promise.all([
      api.get<any>(`/vendors/${route.params.id}`),
      api.get<any[]>(`/products/vendor/${route.params.id}`),
    ]);
    if (vendorRes.data && !(vendorRes as any).type) {
        vendor.value = vendorRes.data;
        products.value = productsRes.data || [];
    } else {
        throw new Error('Using mock data');
    }
    const uniqueCats = [...new Set(products.value.map((p: any) => p.category).filter(Boolean))];
    categories.value = uniqueCats;
    if (uniqueCats.length > 0) activeCategory.value = uniqueCats[0];
    window.addEventListener('scroll', handleScroll);
    if (route.query.group) {
      handleJoinGroup(route.query.group as string);
    }
    syncInterval.value = setInterval(() => {
      if (activeCode.value) {
        fetchGroupOrder(activeCode.value);
      }
    }, 5000);
  } catch (e) {
    console.error('API Error in Detail page, using MOCK data', e);
    vendor.value = {
      _id: route.params.id,
      storeName: 'Mavise Restaurant (Demo)',
      rating: 4.8,
      totalRatings: 1250,
      about: 'Authentic flavors, delivered fast.',
      description: 'Mavise brings you the best of local and continental cuisine with a focus on freshness and speed.',
      availability: { Mon: '24/7', Tue: '24/7', Wed: '24/7', Thu: '24/7', Fri: '24/7', Sat: '24/7', Sun: '24/7' },
      logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80',
      banners: [
        { title: 'Fresh Summer Deal', description: 'Get 20% off on all salads and drinks.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200' },
        { title: 'Student Night', description: 'Late night snacks for study sessions.', image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200' }
      ]
    };
    products.value = [
      { _id: 'p1', name: 'Jollof Rice Special', price: 2500, discountPrice: 2000, discountPercentage: 20, category: 'Main Dishes', image: 'https://images.unsplash.com/photo-1567051752256-66a8361e72a1?w=400' },
      { _id: 'p2', name: 'Chicken Suya', price: 1500, category: 'Snacks', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400' },
      { _id: 'p3', name: 'Zobo Drink', price: 500, category: 'Beverages', image: 'https://images.unsplash.com/photo-1544380903-5339f408272a?w=400' }
    ];
    categories.value = ['Main Dishes', 'Snacks', 'Beverages'];
    activeCategory.value = 'Main Dishes';
  }
});

const handleJoinGroup = async (code: string) => {
  try {
    await joinGroupOrder(code);
    syncWithCart(vendor.value._id);
  } catch (e) {
    console.error('Failed to join group order', e);
  }
};

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (syncInterval.value) clearInterval(syncInterval.value);
});

useHead({ 
  title: computed(() => vendor.value?.storeName ? `${vendor.value.storeName} | Errandr` : 'Vendor Store | Errandr') 
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e5e5e5; }

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
