import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const twilio_api = {
  makeCall: (to: string, message: string) => {
    // Note: This matches the SignalWire manual call endpoint but updated to /twilio
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/twilio/make-call', { to, message });
  },
};
