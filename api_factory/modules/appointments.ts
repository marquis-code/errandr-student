import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const appointments_api = {
  createAppointment: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/appointments', payload);
  },
  createGuestAppointment: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/appointments/guest', payload);
  },
  getMyAppointments: (params?: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/appointments/mine', { params });
  },
  trackAppointment: (reference: string, email: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/appointments/track', { params: { reference, email } });
  },
  cancelTrackedAppointment: (reference: string, email: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/appointments/track/cancel', { reference, email });
  },
  cancelAppointment: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/appointments/${id}/client-cancel`);
  },
  rescheduleAppointment: (id: string, payload: { scheduledDate: string, startTime: string, endTime: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/appointments/${id}/client-reschedule`, payload);
  }
};
