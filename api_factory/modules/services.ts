import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const services_api = {
  getVendorServices: (vendorId: string, params?: any) => {
    return GATEWAY_ENDPOINT.get(`/services/vendor/${vendorId}`, { params });
  },
  getServiceById: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/services/${id}`);
  }
};
