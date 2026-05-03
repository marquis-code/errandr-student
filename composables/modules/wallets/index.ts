import { wallets_api } from "@/api_factory/modules/wallets";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useLoader } from "@/composables/core/useLoader";
import { ref } from 'vue';

const balance = ref(0);
const wallet = ref<any>(null);

export const useWallet = () => {
  const { showToast } = useCustomToast();
  const { startLoading, stopLoading } = useLoader();

  const fetchWallet = async () => {
    try {
      const res = await wallets_api.getWallet();
      // res.data is the axios response body
      // The backend returns { status: 'success', data: { balance: ... } } (or just the object depending on factory)
      // Let's be safe and handle both
      const data = res.data?.data || res.data;
      wallet.value = data;
      balance.value = data?.balance || 0;
    } catch (e) { /* Error handled by axios */ }
  };

  const withdrawFunds = async (amount: number) => {
    startLoading('Processing withdrawal...');
    try {
      const res = await wallets_api.withdraw(amount);
      if (res.data) {
        showToast({
          title: "Withdrawal Successful",
          message: `₦${amount} has been queued for payout.`,
          toastType: "success",
        });
        await fetchWallet();
      }
    } finally {
      stopLoading();
    }
  };

  return { balance, wallet, fetchWallet, withdrawFunds };
};
