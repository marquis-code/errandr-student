import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const orders_api = {
  getOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/mine');
  },

  getAllOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders');
  },
  
  getOrder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/orders/${id}`);
  },

  createOrder: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/orders', payload);
  },

  updateOrderStatus: (id: string, status: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/status`, { status });
  },

  cancelOrder: (id: string, reason: string = 'User cancelled') => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/orders/${id}/cancel`, { reason });
  },

  trackOrder: (orderNumber: string, email: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/track/guest', { params: { orderNumber, email } });
  },

  cancelTrackedOrder: (orderNumber: string, email: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/orders/track/cancel', { orderNumber, email });
  },

  getErrandrOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/available');
  },

  assignOrder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/accept`);
  },

  getBatchStatus: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/batch/status');
  },

  rateOrder: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/rate`, payload);
  },

  reorder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/orders/${id}/reorder`);
  },

  getOrderChat: (orderId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/chat/order/${orderId}`);
  },

  getCustomErrandSettings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/settings/errands/custom');
  },
};
