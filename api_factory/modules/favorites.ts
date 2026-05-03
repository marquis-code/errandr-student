import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const favorites_api = {
  toggle: (payload: { vendorId?: string; productId?: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/favorites/toggle', payload);
  },
  
  getFavorites: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/favorites');
  },
};
