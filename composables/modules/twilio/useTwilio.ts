import { twilio_api } from '@/api_factory/modules/twilio';
import { ref } from 'vue';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useTwilio = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);

  const makeCall = async (to: string, message: string) => {
    loading.value = true;
    try {
      const res = await twilio_api.makeCall(to, message);
      if (res.status === 201 || res.status === 200) {
        showToast({
          title: 'Success',
          message: 'Call initiated successfully via Twilio',
          toastType: 'success',
        });
        return true;
      }
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to initiate call',
        toastType: 'error',
      });
    } finally {
      loading.value = false;
    }
    return false;
  };

  return {
    makeCall,
    loading,
  };
};
