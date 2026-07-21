import { ref, onMounted } from 'vue';
import { users_api } from '@/api_factory/modules/users';
import { vendors_api } from '@/api_factory/modules/vendors';

export const useRecentlyViewed = () => {
  const recentlyViewedVendors = ref<any[]>([]);
  const loading = ref(false);

  const getLocalRecentIds = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('errandr_recent_vendors') || '[]');
    } catch {
      return [];
    }
  };

  const setLocalRecentIds = (ids: string[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('errandr_recent_vendors', JSON.stringify(ids));
  };

  const getRecent = async () => {
    try {
      loading.value = true;
      const res = await users_api.getRecentlyViewed();
      if (res.data) {
        recentlyViewedVendors.value = res.data;
        // Sync local storage just in case
        setLocalRecentIds(res.data.map((v: any) => v._id));
      }
    } catch (e: any) {
      if (e.response && e.response.status === 401) {
        // User is not authenticated, fallback to local storage
        const localIds = getLocalRecentIds();
        if (localIds.length > 0) {
          try {
            const batchRes = await vendors_api.getBatch(localIds);
            if (batchRes.data) {
              // Maintain local order
              const mapped = localIds.map(id => batchRes.data.find((v: any) => v._id === id)).filter(Boolean);
              recentlyViewedVendors.value = mapped;
            }
          } catch (batchErr) {
            console.error('Failed to fetch batch recently viewed vendors', batchErr);
          }
        }
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

    // Save to local storage for unauthenticated fallback
    const localIds = list.map(v => v._id);
    setLocalRecentIds(localIds);

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
