import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const waitlist_api = {
  join: (data: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/waitlist/join', data);
  }
};
