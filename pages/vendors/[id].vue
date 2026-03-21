<template>
  <div class="space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary" v-if="vendor">
    <!-- Vendor Hero Header -->
    <div class="relative rounded-3xl md:rounded-[4rem] overflow-hidden group shadow-lg border-b-[8px] md:border-b-[12px] border-gray-900 mt-8">
      <img :src="vendor.banner || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&q=80'" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-1000" />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
      
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <div class="flex flex-col md:flex-row items-end gap-10">
          <div class="relative w-32 h-32 p-3 bg-white rounded-[2.5rem] shadow-lg transform -rotate-3 group-hover:rotate-0 transition-all duration-700">
             <img :src="vendor.logo || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=200&q=80'" class="w-full h-full rounded-[2rem] object-cover" />
          </div>
          
          <div class="flex-1 space-y-3">
            <div class="flex flex-wrap items-center gap-4">
              <h1 class="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">{{ vendor.storeName }}</h1>
              <div class="flex gap-2">
                <span v-if="vendor.isOnline" class="px-4 py-1.5 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Open Now
                </span>
                <span v-else class="px-4 py-1.5 bg-rose-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg">Closed</span>
                <span v-if="vendor.isStudentBusiness" class="px-4 py-1.5 bg-parentPrimary text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                  🎓 Student Business
                </span>
              </div>
            </div>
            <p class="text-gray-300 text-sm font-bold tracking-tight max-w-2xl leading-relaxed">{{ vendor.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Area -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
      <div class="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] text-center group hover:-translate-y-1 transition-all">
        <p class="text-4xl font-bold text-gray-900 tracking-tighter mb-1 group-hover:text-parentPrimary transition-colors">⭐ {{ vendor.rating?.toFixed(1) || 'NEW' }}</p>
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
      </div>
      
      <div v-if="vendor.preOrderOnly" class="bg-gray-900 p-8 rounded-[2.5rem] text-center border-b-8 border-gray-800">
        <p class="text-4xl font-bold text-parentPrimary tracking-tighter mb-1">⏰ {{ vendor.preOrderLeadTime }}H</p>
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pre-Order Time</p>
      </div>
      
      <div class="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] text-center group hover:-translate-y-1 transition-all">
        <p class="text-4xl font-bold text-gray-900 tracking-tighter mb-1 group-hover:text-parentPrimary transition-colors">{{ vendor.preparationTime || '15-25' }}m</p>
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Prep Time</p>
      </div>
      
      <div class="bg-white border border-gray-100 shadow-sm p-8 rounded-[2.5rem] text-center group hover:-translate-y-1 transition-all">
        <p class="text-4xl font-bold text-gray-900 tracking-tighter mb-1 group-hover:text-parentPrimary transition-colors">₦{{ vendor.deliveryFee || '150' }}</p>
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Delivery Fee</p>
      </div>
    </div>

    <!-- Product Menu -->
    <section class="px-4 pb-40">
      <div class="flex items-center justify-between mb-12">
        <div class="space-y-1">
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight leading-none">Menu</h2>
          <p class="text-sm font-bold text-gray-400">Choose from {{ products.length }} items available today.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="product in products"
          :key="product._id"
          class="bg-white rounded-3xl md:rounded-[3.5rem] border border-gray-100 shadow-sm group hover:shadow-lg transition-all duration-700 p-6 flex gap-8 items-center relative overflow-hidden active:scale-95 cursor-pointer"
          @click="addToCart(product)"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-parentPrimary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div class="relative w-32 h-32 flex-shrink-0">
            <img :src="product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'" class="w-full h-full rounded-[2.5rem] object-cover shadow-lg border-4 border-white transform group-hover:rotate-6 transition-all duration-700" />
            <button
              @click.stop="toggleFavorite(product._id)"
              class="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md z-10"
              :class="isFavorited(product._id) ? 'bg-rose-500 text-white' : 'bg-white/90 text-gray-400 hover:text-rose-500'"
            >
              <Heart class="w-4 h-4" :fill="isFavorited(product._id) ? 'currentColor' : 'none'" />
            </button>
          </div>

          <div class="flex-1 min-w-0 space-y-2 relative z-10">
            <div class="space-y-1">
               <h3 class="text-2xl font-bold text-gray-900 tracking-tight leading-none truncate group-hover:text-parentPrimary transition-colors">{{ product.name }}</h3>
               <p class="text-xs font-bold text-gray-400 line-clamp-1 italic">{{ product.description }}</p>
            </div>
            
            <div class="flex items-center justify-between pt-4">
              <span class="text-3xl font-bold text-gray-900 tracking-tight leading-none">₦{{ product.price?.toLocaleString() }}</span>
              <div class="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center group-hover:bg-parentPrimary group-hover:scale-110 transition-all shadow-lg">
                <Plus class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sticky Cart Bar -->
    <div v-if="itemCount > 0" class="fixed bottom-12 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-50 animate-fade-in">
      <NuxtLink to="/cart" class="bg-gray-900 p-4 rounded-[2.5rem] flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-b-8 border-gray-800 group hover:scale-[1.02] transition-all">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-parentPrimary rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
            <span class="text-2xl font-bold text-white">{{ itemCount }}</span>
          </div>
          <div class="text-left">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Order</p>
            <p class="text-white font-bold uppercase tracking-widest text-xs">View My Cart</p>
          </div>
        </div>
        <div class="text-right pr-6">
           <p class="text-[9px] font-bold text-parentPrimary uppercase tracking-widest mb-1">Total</p>
           <p class="text-2xl font-bold text-white tracking-tight leading-none">₦{{ total?.toLocaleString() }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="space-y-12 px-4 py-12">
    <div class="bg-gray-50 border border-gray-100 shadow-sm animate-pulse h-80 rounded-3xl md:rounded-[4rem]" />
    <div class="grid grid-cols-4 gap-6">
       <div v-for="i in 4" :key="i" class="bg-gray-50 border border-gray-100 animate-pulse h-32 rounded-[2.5rem]" />
    </div>
    <div class="grid grid-cols-2 gap-8">
       <div v-for="i in 4" :key="i" class="bg-gray-50 border border-gray-100 animate-pulse h-40 rounded-3xl md:rounded-[3.5rem]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart, Plus } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { useCart } from '@/composables/modules/cart';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'student'
})

const route = useRoute();
const { addItem, itemCount, total } = useCart();

const vendor = ref<any>(null);
const products = ref<any[]>([]);
const favorites = ref<Set<string>>(new Set());

const isFavorited = (productId: string) => favorites.value.has(productId);

const toggleFavorite = async (productId: string) => {
  try {
    await api.post('/favorites/toggle', { productId });
    if (favorites.value.has(productId)) {
      favorites.value.delete(productId);
    } else {
      favorites.value.add(productId);
    }
  } catch (e) {
    console.error('Failed to toggle favorite', e);
  }
};

const addToCart = (product: any) => {
  addItem({
    productId: product._id,
    vendorId: vendor.value._id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1,
    customizations: [],
  });
};

onMounted(async () => {
  try {
    const [vendorRes, productsRes, favoritesRes] = await Promise.all([
      api.get<any>(`/vendors/${route.params.id}`),
      api.get<any[]>(`/products/vendor/${route.params.id}`),
      api.get<any[]>('/favorites'),
    ]);
    vendor.value = vendorRes.data;
    products.value = productsRes.data || [];
    favorites.value = new Set(favoritesRes.data.map((f: any) => f.product?._id));
  } catch (e) {
    console.error(e);
  }
});

useHead({ title: computed(() => vendor.value?.storeName ? `${vendor.value.storeName} - Errandr` : 'Vendor - Errandr') });
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
