import { useState } from '#imports';
import { computed } from 'vue';
import { vendors_api } from '@/api_factory/modules/vendors';

export const useGlobalFilter = () => {
  const globalFilter = useState<string>('global-filter', () => '');

  const setFilter = (filter: string) => {
    globalFilter.value = globalFilter.value === filter ? '' : filter;
  };

  const clearFilter = () => {
    globalFilter.value = '';
  };

  const dynamicCategories = useState<any[]>('dynamic-categories', () => []);
  const loadingCategories = useState<boolean>('loading-categories', () => false);

  const fetchCategories = async () => {
    if (dynamicCategories.value.length > 0 || loadingCategories.value) return;
    
    loadingCategories.value = true;
    try {
      const res = await vendors_api.getCategories();
      const categories = res?.data?.data || res?.data || [];
      
      const mapped = categories.map((cat: string) => {
        const keyword = cat;
        const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ');
        return { label, icon: '📌', keyword };
      });

      dynamicCategories.value = mapped;
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      loadingCategories.value = false;
    }
  };

  const globalFiltersList = computed(() => {
    return dynamicCategories.value;
  });

  return {
    globalFilter,
    setFilter,
    clearFilter,
    globalFiltersList,
    fetchCategories
  };
};
