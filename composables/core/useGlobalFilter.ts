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

  const baseFilters = [
    { label: 'Breakfast', icon: '🍳', keyword: 'Breakfast' },
    { label: 'Lunch', icon: '🍱', keyword: 'Lunch' },
    { label: 'Dinner', icon: '🍽️', keyword: 'Dinner' },
    { label: 'Late Night', icon: '🌙', keyword: 'Late Night' }
  ];

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
        let icon = '📌';
        const lowerCat = cat.toLowerCase();
        if (lowerCat.includes('restaurant') || lowerCat.includes('eatery')) icon = '🍛';
        else if (lowerCat.includes('salon') || lowerCat.includes('barber')) icon = '✂️';
        else if (lowerCat.includes('pharmacy')) icon = '💊';
        else if (lowerCat.includes('grocery') || lowerCat.includes('groceries')) icon = '🛒';
        else if (lowerCat.includes('repair') || lowerCat.includes('tech')) icon = '💻';
        else if (lowerCat.includes('fashion') || lowerCat.includes('boutique')) icon = '👗';
        else if (lowerCat.includes('drinks') || lowerCat.includes('smoothie')) icon = '🥤';
        else if (lowerCat.includes('bakery') || lowerCat.includes('snacks')) icon = '🥐';
        else if (lowerCat.includes('stationery') || lowerCat.includes('printing')) icon = '🖨️';
        
        return { label, icon, keyword };
      });

      dynamicCategories.value = mapped;
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      loadingCategories.value = false;
    }
  };

  const globalFiltersList = computed(() => {
    const keywords = new Set(baseFilters.map(f => f.keyword.toLowerCase()));
    const uniqueDynamic = dynamicCategories.value.filter(d => !keywords.has(d.keyword.toLowerCase()));
    return [...baseFilters, ...uniqueDynamic];
  });

  return {
    globalFilter,
    setFilter,
    clearFilter,
    globalFiltersList,
    fetchCategories
  };
};
