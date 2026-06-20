import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const search_api = {
  globalSearch: (params: { q?: string; location?: string; time?: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/search', { params });
  },
};
