import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const reports_api = {
  create: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/reports', payload);
  },
  
  getMine: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/reports/mine');
  },

  getById: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/reports/${id}`);
  },

  addMessage: (id: string, message: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/reports/${id}/message`, { message });
  },
};
