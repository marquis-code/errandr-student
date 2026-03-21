<template>
  <div class="space-y-6 pb-20 md:pb-0" v-if="vendor">
    <!-- Vendor Header -->
    <div class="relative rounded-3xl overflow-hidden">
      <img :src="vendor.banner || '/placeholder-vendor.jpg'" class="w-full h-56 object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="flex items-end gap-4">
          <img :src="vendor.logo || '/placeholder-logo.jpg'" class="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h1 class="text-2xl font-bold text-white">{{ vendor.storeName }}</h1>
              <span v-if="vendor.isOnline" class="badge-green text-xs"><span class="status-online mr-1" /> Open</span>
              <span v-else class="badge-red text-xs">Closed</span>
              <span v-if="vendor.isStudentBusiness" class="badge bg-accent-500/20 text-accent-400 text-xs flex items-center gap-1">
                🎓 Student Business
              </span>
            </div>
            <p class="text-dark-300 text-sm">{{ vendor.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Vendor Info -->
    <div class="flex items-center gap-6 bg-white border border-dark-100 shadow-sm p-4 rounded-2xl">
      <div class="text-center">
        <p class="text-dark-900 font-bold">⭐ {{ vendor.rating?.toFixed(1) || 'New' }}</p>
        <p class="text-xs text-dark-400">Rating</p>
      </div>
      <div v-if="vendor.preOrderOnly" class="w-px h-8 bg-dark-100" />
      <div v-if="vendor.preOrderOnly" class="text-center">
        <p class="text-accent-400 font-bold">⏰ Pre-order</p>
        <p class="text-xs text-dark-400">{{ vendor.preOrderLeadTime }}h Lead</p>
      </div>
      <div class="w-px h-8 bg-dark-100" />
      <div class="text-center">
        <p class="text-dark-900 font-bold">{{ vendor.preparationTime || '15-25' }}m</p>
        <p class="text-xs text-dark-400">Prep Time</p>
      </div>
      <div class="w-px h-8 bg-dark-100" />
      <div class="text-center">
        <p class="text-dark-900 font-bold">₦{{ vendor.deliveryFee || '150' }}</p>
        <p class="text-xs text-dark-400">Delivery</p>
      </div>
    </div>

    <!-- Products -->
    <section>
      <h2 class="section-title">Menu</h2>
      <div class="space-y-3">
        <div
          v-for="product in products"
          :key="product._id"
          class="glass-card flex gap-4 group p-4"
        >
          <div class="relative w-24 h-24 flex-shrink-0">
            <img :src="product.image || '/placeholder-food.jpg'" class="w-full h-full rounded-xl object-cover" />
            <button
              @click.stop="toggleFavorite(product._id)"
              class="absolute top-1 right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg"
              :class="isFavorited(product._id) ? 'bg-red-500 text-white' : 'bg-dark-950/60 text-white hover:bg-white hover:text-red-500'"
            >
              <Heart class="w-4 h-4" :fill="isFavorited(product._id) ? 'currentColor' : 'none'" />
            </button>
          </div>
          <div class="flex-1 min-w-0" @click="addToCart(product)">
            <h3 class="font-semibold text-dark-900 truncate">{{ product.name }}</h3>
            <p class="text-sm text-dark-500 line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-primary-600 font-bold">₦{{ product.price?.toLocaleString() }}</span>
              <button class="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Floating Cart Button -->
    <div v-if="itemCount > 0" class="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 animate-slide-up">
      <NuxtLink to="/cart" class="btn-primary w-full flex items-center justify-between py-4">
        <span class="flex items-center gap-2">
          <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
            {{ itemCount }}
          </span>
          View Cart
        </span>
        <span class="font-bold">₦{{ total?.toLocaleString() }}</span>
      </NuxtLink>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="space-y-4">
    <div class="bg-white border border-dark-100 shadow-sm animate-pulse h-56 rounded-3xl" />
    <div class="bg-white border border-dark-100 animate-pulse h-20 rounded-2xl" />
    <div v-for="i in 4" :key="i" class="bg-white border border-dark-100 animate-pulse h-28 rounded-2xl" />
  </div>
</template>

<script setup lang="ts">
import { Heart, Plus } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { useCart } from '@/composables/modules/cart';

const route = useRoute();
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
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
