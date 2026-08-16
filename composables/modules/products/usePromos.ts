import { ref } from 'vue';
import { products_api } from '@/api_factory/modules/products';
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const usePromos = () => {
  const promos = ref<any[]>([]);
  const loading = ref(false);

  const fetchPromos = async () => {
    loading.value = true;
    try {
      const res = await GATEWAY_ENDPOINT.get('/products/all-promos');
      const data = res.data?.data || res.data || [];
      const combined = Array.isArray(data) ? data : [];
      
      console.log('Fetched promos:', combined);
      
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
