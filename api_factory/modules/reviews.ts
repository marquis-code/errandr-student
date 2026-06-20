import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const reviews_api = {
  addReview: (vendorId: string, payload: { rating: number; comment?: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/reviews/vendor/${vendorId}`, payload);
  },

  getVendorReviews: (vendorId: string, params?: { page?: number; limit?: number }) => {
    return GATEWAY_ENDPOINT.get(`/reviews/vendor/${vendorId}`, { params });
  },
};
