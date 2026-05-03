import { ref } from 'vue';
import { payments_api } from "@/api_factory/modules/payments";

export const usePayments = () => {
  const loading = ref(false);
  const banks = ref<any[]>([]);

  const initializePayment = async (payload: any) => {
    loading.value = true;
    try {
      const res = await payments_api.initialize(payload);
      return res.data;
    } finally {
      loading.value = false;
    }
  };

  const verifyPayment = async (reference: string) => {
    loading.value = true;
    try {
      const res = await payments_api.verify(reference);
      return res.data;
    } finally {
      loading.value = false;
    }
  };

  const fetchBanks = async () => {
    loading.value = true;
    try {
      const res = await payments_api.getBanks();
      banks.value = res.data || [];
    } finally {
      loading.value = false;
    }
  };

  const payWithWallet = async (orderId: string) => {
    loading.value = true;
    try {
      const res = await payments_api.payWithWallet(orderId);
      return res.data;
    } finally {
      loading.value = false;
    }
  };

  return { loading, banks, initializePayment, verifyPayment, fetchBanks, payWithWallet };
};
