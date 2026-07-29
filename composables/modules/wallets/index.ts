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
      console.log('[Wallet] Raw response:', JSON.stringify(res.data));
      // Handle various response shapes:
      // 1. { data: { balance: N } }  (NestJS wrapper)
      // 2. { balance: N }            (direct document)
      // 3. { data: { data: { balance: N } } }  (double wrapped)
      const raw = res.data;
      const data = raw?.data?.balance !== undefined ? raw.data 
                 : raw?.balance !== undefined ? raw 
                 : raw?.data || raw;
      wallet.value = data;
      balance.value = typeof data?.balance === 'number' ? data.balance : 0;
      console.log('[Wallet] Parsed balance:', balance.value);
    } catch (e) { 
      console.error('[Wallet] Fetch error:', e);
    }
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
