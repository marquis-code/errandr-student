import { ref } from 'vue';
import { products_api } from '@/api_factory/modules/products';
import { search_api } from '@/api_factory/modules/search';

export const useProducts = () => {
  const loading = ref(false);
  const products = ref<any[]>([]);
  const searchResults = ref<any[]>([]);

  const fetchByVendor = async (vendorId: string) => {
    loading.value = true;
    try {
      const res = await products_api.getByVendor(vendorId);
      products.value = res.data || [];
      return products.value;
    } catch (e) {
      console.error('Failed to fetch products', e);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const search = async (query: string) => {
    loading.value = true;
    try {
      const res = await search_api.globalSearch({ q: query });
      const searchData = (res.data as any)?.data || res.data || {};
      searchResults.value = [
        ...(searchData.products || []),
        ...(searchData.services || [])
      ];
      return searchResults.value;
    } catch (e) {
      console.error('Search failed', e);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchPopular = async () => {
    loading.value = true;
    try {
      const res = await products_api.getPopular();
      products.value = res.data || [];
      return products.value;
    } catch (e) {
      console.error('Failed to fetch popular products', e);
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    products,
    searchResults,
    fetchByVendor,
    search,
    fetchPopular,
  };
};
