import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const users_api = {
  getRecentlyViewed: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/users/me/recently-viewed');
  },
  
  addRecentlyViewed: (vendorId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/users/me/recently-viewed', { vendorId });
  },
};
