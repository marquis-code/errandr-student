import { ref } from 'vue';
import { favorites_api } from '@/api_factory/modules/favorites';

export const useFavorites = () => {
  const loading = ref(false);
  const favorites = ref<any[]>([]);
  const favoriteVendorIds = ref<string[]>([]);

  const fetchFavorites = async () => {
    loading.value = true;
    try {
      const res = await favorites_api.getFavorites();
      favorites.value = res.data || [];
      favoriteVendorIds.value = favorites.value
        .filter((f: any) => f.vendor)
        .map((f: any) => f.vendor._id || f.vendor);
    } catch (e) {
      console.error('Failed to fetch favorites', e);
    } finally {
      loading.value = false;
    }
  };

  const toggleFavorite = async (payload: { vendorId?: string; productId?: string }) => {
    try {
      await favorites_api.toggle(payload);
      // Update local state
      if (payload.vendorId) {
        const idx = favoriteVendorIds.value.indexOf(payload.vendorId);
        if (idx > -1) {
          favoriteVendorIds.value.splice(idx, 1);
        } else {
          favoriteVendorIds.value.push(payload.vendorId);
        }
      }
      if (payload.productId) {
        favorites.value = favorites.value.filter(f => f.product?._id !== payload.productId);
      }
      return true;
    } catch (e) {
      console.error('Failed to toggle favorite', e);
      return false;
    }
  };

  const isVendorFavorited = (vendorId: string) => {
    return favoriteVendorIds.value.includes(vendorId);
  };

  const isFavorited = (vendorId?: string, productId?: string) => {
    if (vendorId) return favoriteVendorIds.value.includes(vendorId);
    if (productId) return favorites.value.some(f => f.product?._id === productId);
    return false;
  };

  return {
    loading,
    favorites,
    favoriteVendorIds,
    fetchFavorites,
    toggleFavorite,
    isVendorFavorited,
    isFavorited,
  };
};
