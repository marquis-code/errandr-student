import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const orders_api = {
  getOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/mine');
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

  getErrandrOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/available');
  },

  assignOrder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/accept`);
  },

  getBatchStatus: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/batch/status');
  },
};
