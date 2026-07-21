import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const menu_items_api = {
  getByVendor: (vendorId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/menu/items/vendor/${vendorId}`);
  },
  getById: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/menu/items/${id}`);
  },
  notifyRestock: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/menu/items/${id}/notify-restock`);
  },
  getTopPicks: (vendorId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/menu/items/vendor/${vendorId}/top-picks`);
  },
  getAddOns: (vendorId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/menu/add-ons/vendor/${vendorId}`);
  }
};
