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
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/products/popular');
  },

  search: (query: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/products/search?q=${encodeURIComponent(query)}`);
  },

  getByVendor: (vendorId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/products/vendor/${vendorId}`);
  },

  getTopPicks: (vendorId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/products/vendor/${vendorId}/top-picks`);
  },

  getPacks: (vendorId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/products/vendor/${vendorId}/packs`);
  },

};
