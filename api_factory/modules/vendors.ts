import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const vendors_api = {
  getOnline: () => {
    return GATEWAY_ENDPOINT.get('/vendors/online');
  },

  getAll: (params?: any) => {
    return GATEWAY_ENDPOINT.get('/vendors', { params });
  },

  getStatistics: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/vendors/statistics');
  },

  getCategories: () => {
    return GATEWAY_ENDPOINT.get('/vendors/categories');
  },

  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/vendors/mine');
  },

  toggleOnline: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/vendors/${id}/toggle-online`);
  },

  updateBusinessHours: (id: string, hours: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/vendors/${id}/business-hours`, { hours });
  },

  getById: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/vendors/${id}`);
  },

  getBySubdomain: (subdomain: string) => {
    return GATEWAY_ENDPOINT.get(`/vendors/subdomain/${subdomain}`);
  },

  getPopular: () => {
    return GATEWAY_ENDPOINT.get('/vendors/popular');
  },

  notifyWhenOnline: (id: string, email: string, pushSubscription?: any) => {
    return GATEWAY_ENDPOINT.post(`/vendors/${id}/notify`, { email, pushSubscription });
  },
};
