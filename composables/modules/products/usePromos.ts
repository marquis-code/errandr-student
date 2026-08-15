import { ref } from 'vue';
import { products_api } from '@/api_factory/modules/products';
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const usePromos = () => {
  const promos = ref<any[]>([]);
  const loading = ref(false);

  const fetchPromos = async () => {
    loading.value = true;
    try {
      const [packsRes, itemsRes, productsRes, productPacksRes] = await Promise.all([
        GATEWAY_ENDPOINT.get('/menu/packs/promos').catch(() => ({ data: [] })),
        GATEWAY_ENDPOINT.get('/menu/items/promos').catch(() => ({ data: [] })),
        GATEWAY_ENDPOINT.get('/products/promos').catch(() => ({ data: [] })),
        GATEWAY_ENDPOINT.get('/products/packs/promos').catch(() => ({ data: [] }))
      ]);
      
      const combined = [
        ...(Array.isArray(packsRes.data) ? packsRes.data : packsRes.data?.data || []), 
        ...(Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data?.data || []),
        ...(Array.isArray(productsRes.data) ? productsRes.data : productsRes.data?.data || []),
        ...(Array.isArray(productPacksRes.data) ? productPacksRes.data : productPacksRes.data?.data || [])
      ];
      
      console.log('Fetched promos combined:', combined);
      
      combined.sort((a, b) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());
      promos.value = combined;
    } catch (error) {
      console.error('Failed to fetch promos:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    promos,
    loading,
    fetchPromos
  };
};
