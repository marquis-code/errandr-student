import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const exam_mode_api = {
  getCustomerRescheduleRequests: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/exam-mode/customer/reschedule-requests');
  },

  resolveRescheduleRequest: (id: string, action: 'accept' | 'reject') => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/exam-mode/reschedule-requests/${id}/resolve`, { action });
  }
};
