import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const payments_api = {
  initialize: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/payments/initialize', payload);
  },
  
  verify: (reference: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/payments/verify?reference=${reference}`);
  },

  getBanks: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/payments/banks');
  },

  resolveAccount: (payload: { account_number: string; bank_code: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/payments/resolve-account', payload);
  },

  payWithWallet: (orderId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/payments/wallet/pay', { orderId });
  },
};
