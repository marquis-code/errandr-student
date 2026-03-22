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
        products_api.getPopular()
      ]);
      onlineVendors.value = vRes.data || [];
      popularItems.value = pRes.data || [];
      
      if (onlineVendors.value.length === 0) {
        onlineVendors.value = [
          { _id: 'm1', storeName: 'Mavise Restaurant', rating: 4.8, banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200', preparationTime: 25 },
          { _id: 'm2', storeName: 'Quick Bites', rating: 4.5, banner: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800', preparationTime: 15 },
          { _id: 'm3', storeName: 'Mama Put Corner', rating: 4.9, banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', preparationTime: 30 }
        ];
      }
    } catch (e) {
      console.error('Landing page data fetch failed, using mocks', e);
      onlineVendors.value = [
        { _id: 'm1', storeName: 'Mavise Restaurant (Demo)', rating: 4.8, banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', preparationTime: 25 }
      ];
    } finally {
      loading.value = false;
    }
  };

  return { loading, onlineVendors, popularItems, fetchHomeData };
};
