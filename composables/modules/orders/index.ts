import { ref } from 'vue';
import { orders_api } from "@/api_factory/modules/orders";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useStudentOrders = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const orders = ref<any[]>([]);

  const fetchOrders = async () => {
    loading.value = true;
    try {
      const res = await orders_api.getOrders();
      orders.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      await orders_api.cancelOrder(id);
      showToast({
        title: "Order Cancelled",
        message: "Your order has been successfully cancelled.",
        toastType: "info",
      });
      await fetchOrders();
    } catch (e) { /* Error handled by axios */ }
  };

  return { loading, orders, fetchOrders, cancelOrder };
};
