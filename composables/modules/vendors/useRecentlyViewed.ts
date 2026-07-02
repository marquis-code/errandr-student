import { ref, onMounted } from 'vue';
import { users_api } from '@/api_factory/modules/users';

export const useRecentlyViewed = () => {
  const recentlyViewedVendors = ref<any[]>([]);
  const loading = ref(false);

  const getRecent = async () => {
    try {
      loading.value = true;
      const res = await users_api.getRecentlyViewed();
      if (res.data) {
        recentlyViewedVendors.value = res.data;
      }
    } catch (e: any) {
      if (e.response && e.response.status === 401) {
        // User is not authenticated, ignore
      } else {
        console.error('Failed to fetch recently viewed vendors', e);
      }
    } finally {
      loading.value = false;
    }
  };

  const addRecent = async (vendor: any) => {
    if (!vendor || !vendor._id) return;
    
    // Optimistically update the UI if the vendor is not already at the front
    let list = [...recentlyViewedVendors.value];
    list = list.filter(v => v._id !== vendor._id);
    list.unshift(vendor);
    if (list.length > 10) list = list.slice(0, 10);
    recentlyViewedVendors.value = list;

    try {
      await users_api.addRecentlyViewed(vendor._id);
    } catch (e: any) {
      if (e.response && e.response.status === 401) {
        // Ignore for unauthenticated users
      } else {
        console.error('Failed to add recently viewed vendor', e);
      }
    }
  };

  onMounted(() => {
    getRecent();
  });

  return { recentlyViewedVendors, addRecent, getRecent, loading };
};
