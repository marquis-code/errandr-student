import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const products_api = {
  getProducts: (params?: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/products', { params });
  },

  getProduct: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/products/${id}`);
  },

  getCategories: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/products/categories');
  },

  getOnline: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/vendors/online');
  },

  getPopular: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/vendors/popular');
  },
};
