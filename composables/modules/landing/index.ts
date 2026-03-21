import { ref, onMounted } from 'vue';
import { vendors_api } from "@/api_factory/modules/vendors"; // I might need to move getOnline to its own module or common
import { products_api } from "@/api_factory/modules/products";

// Let's assume vendors_api has getOnline now in the common factory
export const useLandingPage = () => {
  const loading = ref(true);
  const onlineVendors = ref<any[]>([]);
  const popularItems = ref<any[]>([]);

  const fetchHomeData = async () => {
    loading.value = true;
    try {
      // For now using the existing endpoint structure
      const [vRes, pRes] = await Promise.all([
        vendors_api.getOnline(),
        products_api.getPopular(10)
      ]);
      onlineVendors.value = vRes.data;
      popularItems.value = pRes.data;
    } catch (e) {
      console.error('Landing page data fetch failed', e);
    } finally {
      loading.value = false;
    }
  };

  return { loading, onlineVendors, popularItems, fetchHomeData };
};
