import { ref } from 'vue';
import { vendors_api } from "@/api_factory/modules/vendors";

const loading = ref(false);
const popularVendors = ref<any[]>([]);
const vendorsMetadata = ref<Record<string, any>>({});

export const useVendors = () => {

  const fetchPopularVendors = async () => {
    loading.value = true;
    try {
      const res = await vendors_api.getPopular();
      popularVendors.value = res.data?.vendors || res.data?.data?.vendors || res.data || [];
    } catch (e) {
      console.error('Failed to fetch popular vendors', e);
    } finally {
      loading.value = false;
    }
  };

  const fetchVendorMetadata = async (id: string) => {
    if (vendorsMetadata.value[id]) return vendorsMetadata.value[id];
    try {
      const res = await vendors_api.getById(id);
      vendorsMetadata.value[id] = res.data;
      return res.data;
    } catch (e) {
      console.error(`Failed to fetch metadata for vendor ${id}`, e);
      return null;
    }
  };

  const fetchBulkMetadata = async (ids: string[]) => {
    for (const id of ids) {
      await fetchVendorMetadata(id);
    }
  };

  return { 
    loading, 
    popularVendors, 
    vendorsMetadata, 
    fetchPopularVendors, 
    fetchVendorMetadata, 
    fetchBulkMetadata 
  };
};
