<template>
  <div class="space-y-6 animate-fade-in pb-32">
    <div v-if="loading" class="space-y-4 px-2">
      <div v-for="i in 4" :key="i" class="h-20 bg-white border border-gray-50 rounded-2xl animate-pulse" />
    </div>

    <div v-else-if="favorites.length === 0" class="px-2">
       <div class="bg-white rounded-[2rem] text-center p-16 border border-dashed border-gray-100 animate-fade-in">
          <div class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 transform -rotate-12">❤️</div>
          <h2 class="text-xl font-bold text-gray-900 mb-2 tracking-tight">No favorites yet</h2>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 text-center max-w-xs mx-auto">Tap the heart icon on any meal or item to save it here.</p>
          <NuxtLink to="/vendors" class="inline-flex px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-parentPrimary transition-all">Browse Vendors</NuxtLink>
       </div>
    </div>

    <div v-else class="px-2">
      <div class="space-y-3">
        <div 
          v-for="fav in favorites" 
          :key="fav._id" 
          class="group bg-white rounded-2xl p-4 border border-gray-50 shadow-sm hover:shadow-md hover:border-gray-100 transition-all cursor-pointer flex items-center justify-between gap-3"
          @click="selectedFavorite = fav"
        >
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <div class="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 border border-gray-100 bg-gray-50">
              <img
                :src="fav.product?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div v-if="!fav.product?.isAvailable" class="absolute inset-0 bg-gray-900/60 flex items-center justify-center backdrop-blur-[1px]">
                <span class="text-[8px] font-black text-white uppercase tracking-tighter bg-rose-500 px-2 py-0.5 rounded-md">Sold Out</span>
              </div>
            </div>
            <div class="min-w-0">
              <h4 class="font-bold text-gray-900 text-[13px] md:text-sm tracking-tight truncate mb-0.5">{{ fav.product?.name }}</h4>
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full" :class="fav.vendor?.isOnline ? 'bg-emerald-500' : 'bg-gray-300'" />
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{{ fav.vendor?.storeName }}</p>
              </div>
            </div>
          </div>

          <div class="hidden md:block text-right px-4">
            <p class="text-sm font-bold text-gray-900 tracking-tight leading-none">₦{{ fav.product?.price?.toLocaleString() }}</p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
             <button
               @click.stop="quickAddToCart(fav)"
               :disabled="!fav.product?.isAvailable"
               class="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-parentPrimary hover:text-white transition-all disabled:opacity-30 active:scale-90 border border-transparent hover:border-parentPrimary/20"
             >
               <Plus class="w-4 h-4" />
             </button>
             <button
               @click.stop="removeFavorite(fav)"
               class="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-90 border border-rose-100"
             >
               <Heart class="w-4 h-4 fill-current" />
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Drawer -->
    <SideDrawer :isOpen="!!selectedFavorite" @close="selectedFavorite = null">
       <template v-if="selectedFavorite">
         <div class="relative h-48 -mt-10 -mx-6 mb-8">
            <img :src="selectedFavorite.product?.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            <button
               @click="removeFavorite(selectedFavorite); selectedFavorite = null;"
               class="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-rose-500 transition-colors"
             >
               <Heart class="w-5 h-5 fill-current" />
             </button>

            <div class="absolute bottom-6 left-6 right-6">
                <span class="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white font-bold text-[8px] uppercase tracking-[0.2em] mb-2 border border-white/10">
                  {{ selectedFavorite.vendor?.storeName }}
                </span>
                <h3 class="text-xl font-bold text-white tracking-tight leading-tight">{{ selectedFavorite.product?.name }}</h3>
            </div>
         </div>

         <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div>
                  <p class="text-[8px] uppercase font-black tracking-[0.2em] text-gray-400 mb-0.5">Price</p>
                  <p class="text-xl font-black text-gray-900">₦{{ selectedFavorite.product?.price?.toLocaleString() }}</p>
               </div>
               <div :class="selectedFavorite.product?.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" class="px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest">
                  {{ selectedFavorite.product?.isAvailable ? 'Available' : 'Unavailable' }}
               </div>
            </div>

            <p v-if="selectedFavorite.product?.description" class="text-[11px] font-bold text-gray-500 leading-relaxed border-t border-gray-50 pt-6">
               {{ selectedFavorite.product?.description }}
            </p>

            <div class="pt-6 space-y-3">
               <button
                 v-if="selectedFavorite.product?.isAvailable"
                 @click="quickAddToCart(selectedFavorite); selectedFavorite = null;"
                 class="w-full py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-parentPrimary transition-all active:scale-95"
               >
                 Add to Cart
               </button>
               <button 
                 @click="router.push(`/vendors/${selectedFavorite.vendor?._id}`)"
                 class="w-full py-4 flex items-center justify-center bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100 hover:border-parentPrimary transition-all active:scale-95"
               >
                 Visit Restaurant
               </button>
            </div>
         </div>
       </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { Heart, Plus } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCart } from '@/composables/modules/cart';
import { useToast } from '@/composables/useToast';
import SideDrawer from '@/components/ui/SideDrawer.vue';

definePageMeta({
  layout: 'student'
});

const router = useRouter();
const { addItem } = useCart();
const { showToast } = useToast();

const loading = ref(true);
const favorites = ref<any[]>([]);
const selectedFavorite = ref<any>(null);

const removeFavorite = async (fav: any) => {
  try {
    await api.post('/favorites/toggle', { productId: fav.product._id });
    favorites.value = favorites.value.filter((f) => f._id !== fav._id);
    showToast('Removed from favorites', 'success');
  } catch (e) { 
    console.error(e);
    showToast('Failed to remove from favorites', 'error');
  }
};

const quickAddToCart = (fav: any) => {
  addItem({
    productId: fav.product._id,
    vendorId: fav.vendor._id,
    name: fav.product.name,
    price: fav.product.price,
    image: fav.product.image,
    quantity: 1,
    customizations: [],
  });
  showToast('Added to cart', 'success');
};

onMounted(async () => {
  try {
    const res = await api.get<any[]>('/favorites');
    favorites.value = res.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
});

useHead({ title: 'Favorites - Errandr' });
</script>
