import { GATEWAY_ENDPOINT } from '../axios.config';

export const settings_api = {
  getExamBrethrenSettings: () => {
    return GATEWAY_ENDPOINT.get('/settings/exam-brethren/public');
  },
};
