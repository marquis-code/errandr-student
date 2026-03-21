import { products_api } from "@/api_factory/modules/products";

export const useFetchProducts = () => {
  const loading = ref(false);
  const products = ref<any[]>([]);

  const fetchProducts = async () => {
    loading.value = true;
    try {
      const res = await products_api.getProducts();
      products.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  return { loading, products, fetchProducts };
};
