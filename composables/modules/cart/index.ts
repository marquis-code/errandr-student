import { ref, computed } from 'vue';

interface CartItem {
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations: { name: string; selected: string; price: number }[];
  subtotal: number;
}

interface Pack {
  id: string;
  name?: string;
  items: CartItem[];
}

// Global state (Singleton Pattern)
const carts = ref<Record<string, { packs: Pack[]; activePackId: string }>>({});
const deliveryAddress = ref('');
const deliveryNotes = ref('');
const deliveryLocation = ref<{ type: string; coordinates: number[] } | null>(null);
const cartInitialized = ref(false);

let packCounter = 0;

const generatePackId = () => {
  packCounter++;
  return `pack_${Date.now()}_${packCounter}`;
};

export const useCart = () => {
  const initCart = () => {
    if (cartInitialized.value || !import.meta.client) return;
    const stored = localStorage.getItem('errandr_cart_multi_v1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        carts.value = parsed.carts || {};
        packCounter = parsed.packCounter || 0;
      } catch (e) {
        console.error('Failed to parse stored cart', e);
      }
    }
    cartInitialized.value = true;
  };

  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('errandr_cart_multi_v1', JSON.stringify({
        carts: carts.value,
        packCounter,
      }));
    }
  };

  const ensureVendorCart = (vendorId: string) => {
    if (!carts.value[vendorId]) {
      const pId = generatePackId();
      carts.value[vendorId] = {
        packs: [{ id: pId, items: [] }],
        activePackId: pId,
      };
    }
    return carts.value[vendorId];
  };

  const addItem = (item: Omit<CartItem, 'subtotal'>) => {
    const vCart = ensureVendorCart(item.vendorId);
    
    let activePack = vCart.packs.find(p => p.id === vCart.activePackId);
    if (!activePack) {
      activePack = vCart.packs[0];
      vCart.activePackId = activePack.id;
    }

    const existingIndex = activePack.items.findIndex(
      (i) =>
        i.productId === item.productId &&
        JSON.stringify(i.customizations) === JSON.stringify(item.customizations),
    );

    if (existingIndex !== -1) {
      activePack.items[existingIndex].quantity += item.quantity;
      const customTotal = activePack.items[existingIndex].customizations.reduce((s, c) => s + c.price, 0);
      activePack.items[existingIndex].subtotal =
        (activePack.items[existingIndex].price + customTotal) * activePack.items[existingIndex].quantity;
    } else {
      const customTotal = item.customizations.reduce((s, c) => s + c.price, 0);
      activePack.items.push({
        ...item,
        subtotal: (item.price + customTotal) * item.quantity,
      });
    }

    saveToStorage();
  };

  const addPack = (vendorId: string) => {
    const vCart = ensureVendorCart(vendorId);
    const id = generatePackId();
    vCart.packs.push({ id, items: [] });
    vCart.activePackId = id;
    saveToStorage();
  };

  const duplicatePack = (vendorId: string, packId: string) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const sourcePack = vCart.packs.find(p => p.id === packId);
    if (!sourcePack || sourcePack.items.length === 0) return;

    const newId = generatePackId();
    const clonedItems = JSON.parse(JSON.stringify(sourcePack.items));
    vCart.packs.push({ id: newId, items: clonedItems });
    vCart.activePackId = newId;
    saveToStorage();
  };

  const removePack = (vendorId: string, packId: string) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    vCart.packs = vCart.packs.filter(p => p.id !== packId);
    if (vCart.activePackId === packId) {
      vCart.activePackId = vCart.packs[0]?.id || '';
    }
    if (vCart.packs.length === 0) {
      delete carts.value[vendorId];
    }
    saveToStorage();
  };

  const setActivePack = (vendorId: string, packId: string) => {
    if (carts.value[vendorId]) {
      carts.value[vendorId].activePackId = packId;
    }
  };

  const renamePack = (vendorId: string, packId: string, name: string) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const pack = vCart.packs.find(p => p.id === packId);
    if (!pack) return;
    pack.name = name;
    saveToStorage();
  };

  const removeItemFromPack = (vendorId: string, packId: string, itemIndex: number) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const pack = vCart.packs.find(p => p.id === packId);
    if (!pack) return;
    pack.items.splice(itemIndex, 1);
    if (pack.items.length === 0) {
      removePack(vendorId, packId);
    } else {
      saveToStorage();
    }
  };

  const updateItemQuantity = (vendorId: string, packId: string, itemIndex: number, quantity: number) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const pack = vCart.packs.find(p => p.id === packId);
    if (!pack || !pack.items[itemIndex]) return;

    if (quantity <= 0) {
      removeItemFromPack(vendorId, packId, itemIndex);
      return;
    }

    pack.items[itemIndex].quantity = quantity;
    const customTotal = pack.items[itemIndex].customizations.reduce((s, c) => s + c.price, 0);
    pack.items[itemIndex].subtotal = (pack.items[itemIndex].price + customTotal) * quantity;
    saveToStorage();
  };

  const clearCart = (vendorId?: string) => {
    if (vendorId) {
      delete carts.value[vendorId];
    } else {
      carts.value = {};
      deliveryAddress.value = '';
      deliveryNotes.value = '';
      deliveryLocation.value = null;
    }
    saveToStorage();
  };

  // Computed
  const allVendorIds = computed(() => Object.keys(carts.value));
  const allPacks = computed(() => Object.values(carts.value).flatMap(c => c.packs));
  const allItems = computed(() => allPacks.value.flatMap(p => p.items));
  
  const itemCount = computed(() => allItems.value.reduce((sum, item) => sum + item.quantity, 0));
  const subtotal = computed(() => allItems.value.reduce((sum, item) => sum + item.subtotal, 0));
  
  // Fees are per-vendor now. We'll provide a helper to get fees for a specific vendor
  const getVendorStats = (vendorId: string) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return { subtotal: 0, itemCount: 0, packs: [], packagingFee: 0, serviceFee: 0 };
    const items = vCart.packs.flatMap(p => p.items);
    const sub = items.reduce((sum, item) => sum + item.subtotal, 0);
    return {
      subtotal: sub,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      packs: vCart.packs,
      packagingFee: vCart.packs.length > 0 ? 300 : 0 as number,
      serviceFee: Math.round(sub * 0.05) as number,
    };
  };

  const total = computed(() => {
    let t = 0;
    allVendorIds.value.forEach(vId => {
      const stats = getVendorStats(vId);
      t += stats.subtotal + stats.packagingFee + stats.serviceFee;
    });
    return t;
  });

  const isEmpty = computed(() => allVendorIds.value.length === 0);

  // Helper for the vendor detail page (id.vue)
  const getPacksByVendor = (vendorId: string) => computed(() => carts.value[vendorId]?.packs || []);
  const getActivePackByVendor = (vendorId: string) => computed(() => {
    const vCart = carts.value[vendorId];
    return vCart?.packs.find(p => p.id === vCart.activePackId) || null;
  });

  return {
    carts,
    allVendorIds,
    addItem,
    clearCart,
    initCart,
    itemCount,
    subtotal,
    total,
    isEmpty,
    getVendorStats,
    getPacksByVendor,
    getActivePackByVendor,
    addPack,
    duplicatePack,
    removePack,
    renamePack,
    setActivePack,
    removeItemFromPack,
    updateItemQuantity,
    deliveryAddress,
    deliveryNotes,
    deliveryLocation,
  };
};

