<template>
  <div class="space-y-6 pb-20 md:pb-0 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2 mb-8 mt-2">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight font-display mb-1">My Favorites <span class="text-rose-500">❤️</span></h1>
        <p class="text-gray-500 text-sm font-medium">Track your favorite meals and ingredients for quick access.</p>
      </div>
      <div v-if="favorites.length > 0" class="flex items-center gap-2">
         <span class="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-widest">{{ favorites.length }} Saved</span>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white border border-gray-100 rounded-[2.5rem] animate-pulse h-40" />
    </div>

    <div v-else-if="favorites.length === 0">
       <div class="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in w-full max-w-lg mx-auto">
          <div class="w-20 h-20 mb-6 rounded-full bg-rose-50 flex items-center justify-center text-4xl shadow-sm border border-rose-100">
            <span class="text-xl">❤️</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2 font-display tracking-tight">No favorites yet</h3>
          <p class="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed font-medium">
            Tap the heart icon on any meal or item to save it here for quick re-ordering.
          </p>
          <NuxtLink to="/vendors" class="px-8 py-3.5 rounded-full font-bold text-sm shadow-sm transition-all focus:ring-4 focus:ring-parentPrimary/20 bg-parentPrimary text-white hover:brightness-110 active:scale-[0.98]">
            Browse Vendors
          </NuxtLink>
        </div>
    </div>

    <div v-else class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden pb-10">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/30">
              <th class="py-4 px-6 font-medium text-gray-400 text-[11px] whitespace-nowrap">Item Details</th>
              <th class="py-4 px-6 font-medium text-gray-400 text-[11px] whitespace-nowrap">Vendor</th>
              <th class="py-4 px-6 font-medium text-gray-400 text-[11px] whitespace-nowrap text-right">Price</th>
              <th class="py-4 px-6 font-medium text-gray-400 text-[11px] whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50/50">
            <tr 
              v-for="fav in favorites" 
              :key="fav._id" 
              class="hover:bg-gray-50/80 transition-colors group cursor-pointer"
              @click="selectedFavorite = fav"
            >
              <td class="py-4 px-6 min-w-[250px]">
                <div class="flex items-center gap-4">
                  <div class="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-100 bg-gray-50">
                    <img
                      :src="fav.product?.image || '/placeholder-food.jpg'"
                      :alt="fav.product?.name"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div v-if="!fav.product?.isAvailable" class="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                      <span class="text-[8px] font-bold text-rose-400 uppercase tracking-widest bg-white/90 px-1 py-0.5 rounded">Off</span>
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-sm tracking-tight line-clamp-2 max-w-[200px]">{{ fav.product?.name }}</h4>
                    <p v-if="!fav.product?.isAvailable" class="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1">Currently Unavailable</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 min-w-[150px]">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :class="fav.vendor?.isOnline ? 'bg-emerald-500' : 'bg-gray-300'" />
                  <p class="text-xs font-bold text-gray-600 truncate max-w-[120px]">{{ fav.vendor?.storeName }}</p>
                </div>
              </td>
              <td class="py-4 px-6 text-right">
                <p class="text-sm font-black text-gray-900 tracking-tighter">₦{{ fav.product?.price?.toLocaleString() }}</p>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                   <button
                     @click.stop="quickAddToCart(fav)"
                     :disabled="!fav.product?.isAvailable"
                     class="w-8 h-8 rounded-full bg-parentPrimary/10 text-parentPrimary flex items-center justify-center hover:bg-parentPrimary hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-parentPrimary/10 disabled:hover:text-parentPrimary active:scale-95"
                     title="Add to Cart"
                   >
                     <Plus class="w-4 h-4" />
                   </button>
                   <button
                     @click.stop="removeFavorite(fav)"
                     class="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors active:scale-95"
                     title="Remove from favorites"
                   >
                     <Heart class="w-4 h-4 fill-current" />
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal/Drawer inside student side drawer -->
    <SideDrawer :isOpen="!!selectedFavorite" @close="selectedFavorite = null">
       <template v-if="selectedFavorite">
         <div class="relative h-48 -mt-12 -mx-8 mb-8">
            <img :src="selectedFavorite.product?.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            
            <button
               @click="removeFavorite(selectedFavorite); selectedFavorite = null;"
               class="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-rose-500 transition-colors"
             >
               <Heart class="w-5 h-5 fill-current" />
             </button>

            <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between">
               <div>
                 <span class="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white font-bold text-[10px] uppercase tracking-widest mb-2 border border-white/10">
                   {{ selectedFavorite.vendor?.storeName }}
                 </span>
                 <h3 class="text-2xl font-bold text-white tracking-tight leading-tight">{{ selectedFavorite.product?.name }}</h3>
               </div>
            </div>
         </div>

         <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div>
                  <p class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">Price</p>
                  <p class="text-xl font-black text-gray-900 tracking-tighter">₦{{ selectedFavorite.product?.price?.toLocaleString() }}</p>
               </div>
               <div :class="selectedFavorite.product?.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" class="px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest">
                  {{ selectedFavorite.product?.isAvailable ? 'Available' : 'Unavailable' }}
               </div>
            </div>

            <p v-if="selectedFavorite.product?.description" class="text-sm font-medium text-gray-500 leading-relaxed border-t border-gray-100 pt-6">
               {{ selectedFavorite.product?.description }}
            </p>

            <div class="pt-6 border-t border-gray-100 space-y-3">
               <button
                 v-if="selectedFavorite.product?.isAvailable"
                 @click="quickAddToCart(selectedFavorite); selectedFavorite = null;"
                 class="w-full py-4 bg-parentPrimary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-parentPrimary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
               >
                 <Plus class="w-4 h-4" /> Add to Cart
               </button>
               <NuxtLink 
                 :to="`/vendors/${selectedFavorite.vendor?._id}`"
                 class="w-full py-4 flex items-center justify-center bg-gray-50 text-gray-900 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all active:scale-[0.98]"
               >
                 Visit Restaurant
               </NuxtLink>
            </div>
         </div>
       </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { Heart, Plus } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCart } from '@/composables/modules/cart';
import SideDrawer from '@/components/ui/SideDrawer.vue';



const { addItem } = useCart();

const loading = ref(true);
const favorites = ref<any[]>([]);
const selectedFavorite = ref<any>(null);

const removeFavorite = async (fav: any) => {
  try {
    await api.post('/favorites/toggle', { productId: fav.product._id });
    favorites.value = favorites.value.filter((f) => f._id !== fav._id);
  } catch (e) { console.error(e); }
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
