import { ref, onMounted } from 'vue';

const VIEWED_KEY = 'errander_recently_viewed';

export const useRecentlyViewed = () => {
  const recentlyViewedVendors = ref<any[]>([]);

  const getRecent = () => {
    try {
      const stored = localStorage.getItem(VIEWED_KEY);
      if (stored) {
        recentlyViewedVendors.value = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse recently viewed vendors', e);
    }
  };

  const addRecent = (vendor: any) => {
    if (!vendor || !vendor._id) return;
    
    // Keep lightweight to not bloat localStorage
    const lightweight = {
      _id: vendor._id,
      storeName: vendor.storeName,
      image: vendor.image,
      banner: vendor.banner,
      logo: vendor.logo,
      rating: vendor.rating,
      category: vendor.category,
      businessType: vendor.businessType,
      isOpen: vendor.isOpen,
      preparationTime: vendor.preparationTime,
      deliveryFee: vendor.deliveryFee,
      description: vendor.description,
      preOrderOnly: vendor.preOrderOnly
    };

    getRecent();
    let list = [...recentlyViewedVendors.value];
    list = list.filter(v => v._id !== vendor._id);
    list.unshift(lightweight);
    
    if (list.length > 10) list = list.slice(0, 10);
    
    recentlyViewedVendors.value = list;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(list));
  };

  onMounted(() => {
    getRecent();
  });

  return { recentlyViewedVendors, addRecent, getRecent };
};
