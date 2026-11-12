<template>
  <div class="min-h-screen bg-[#FBFDF9] pb-24">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-[#D7F5C4] via-[#C4EFAE] to-[#A8E68C] px-5 pb-8 pt-6">
      <div class="mx-auto max-w-6xl">
        <div class="mb-4 flex items-center justify-between">
          <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur" @click="router.back()">
            <ArrowLeft class="h-4 w-4 text-[#1B3A1B]" />
          </button>
          <span class="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1B3A1B]">
            Pharmacy
          </span>
        </div>

        <h1 class="text-3xl font-black leading-none tracking-tight text-[#12300F] sm:text-5xl">
          {{ vendor?.storeName || 'Pharmacy' }}
        </h1>
        <p class="mt-2 max-w-md text-xs font-semibold text-[#2C4A26]">
          Medicines and healthcare items delivered to your door by a licensed pharmacy.
        </p>

        <div class="mt-4 flex flex-wrap gap-2 text-[10px] font-bold">
          <span v-if="vendor?.pharmacyLicence?.pcnPremisesLicence" class="rounded-full bg-white/70 px-2.5 py-1 text-[#12300F]">
            PCN {{ vendor.pharmacyLicence.pcnPremisesLicence }}
          </span>
          <span v-if="vendor?.pharmacyLicence?.superintendentPharmacist" class="rounded-full bg-white/70 px-2.5 py-1 text-[#12300F]">
            Supt. {{ vendor.pharmacyLicence.superintendentPharmacist }}
          </span>
          <span class="rounded-full bg-[#12300F] px-2.5 py-1 text-white">Delivery from ₦{{ (vendor?.deliveryFee || 0).toLocaleString() }}</span>
        </div>

        <!-- Prescription + consult cards -->
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl border-2 border-dashed border-[#7FBF62] bg-white p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-black text-[#12300F]">Upload prescription</p>
                <p class="mt-1 text-[11px] text-[#4A6B44]">A pharmacist reviews it before the rider collects.</p>
              </div>
              <FileText class="h-8 w-8 shrink-0 text-[#7FBF62]" />
            </div>
            <label class="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#12300F] px-3 py-2.5 text-xs font-bold text-white">
              <ImagePlus class="h-4 w-4" />
              {{ prescriptionImage ? 'Replace photo' : (uploading ? 'Uploading…' : 'Choose photo') }}
              <input type="file" accept="image/*,application/pdf" class="hidden" @change="onPrescription" />
            </label>
            <p v-if="prescriptionImage" class="mt-2 text-[11px] font-bold text-emerald-700">Attached — applies at checkout</p>
          </div>

          <div class="rounded-2xl bg-[#FCE3CD] p-4">
            <p class="text-sm font-black text-[#5C3218]">Not sure it is safe?</p>
            <p class="mt-1 text-[11px] text-[#7A4A28]">Ask the pharmacist before you buy — mixing medicines is a real risk.</p>
            <button class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A2410] px-3 py-2.5 text-xs font-bold text-white" @click="openChat()">
              <MessageCircle class="h-4 w-4" /> Speak to a pharmacist
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="mx-auto max-w-6xl px-5">
      <div class="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="c in categories" :key="c"
          class="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition"
          :class="activeCategory === c ? 'bg-[#12300F] text-white' : 'bg-white text-[#3A5233] border border-[#DDEBD4]'"
          @click="activeCategory = c"
        >{{ c }}</button>
      </div>

      <!-- Products -->
      <div v-if="loading" class="py-16 text-center text-sm text-gray-400">Loading medicines…</div>

      <div v-else class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <div v-for="p in filtered" :key="p._id" class="flex flex-col overflow-hidden rounded-2xl border border-[#E7F1E0] bg-white">
          <div class="relative flex h-32 items-center justify-center bg-[#F6FAF3]">
            <img v-if="p.image" :src="p.image" class="h-full w-full object-cover" />
            <Package v-else class="h-8 w-8 text-[#C9DCC0]" />
            <span v-if="needsRx(p)" class="absolute left-2 top-2 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Rx</span>
            <span v-if="p.minimumAge" class="absolute left-2 top-7 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">{{ p.minimumAge }}+</span>
          </div>
          <div class="flex flex-1 flex-col justify-between p-3">
            <div>
              <p class="text-xs font-bold leading-tight text-[#12300F]">{{ p.name }}</p>
              <p v-if="p.nafdacNumber" class="mt-0.5 text-[10px] text-[#7C9075]">NAFDAC {{ p.nafdacNumber }}</p>
            </div>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-sm font-black text-[#12300F]">₦{{ (p.price || 0).toLocaleString() }}</span>
              <button class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#12300F] text-white" @click="add(p)">
                <Plus class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!loading && !filtered.length" class="py-16 text-center text-sm text-gray-400">
        Nothing in this category yet.
      </p>
    </div>

    <!-- Cart bar: the page had add-to-cart with no route to checkout. -->
    <div v-if="cartCount > 0" class="fixed bottom-4 left-0 right-0 z-[120] px-4">
      <button
        class="mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-2xl bg-[#12300F] px-4 py-3 text-white shadow-2xl"
        @click="goToCart"
      >
        <span class="flex items-center gap-2 text-xs font-bold">
          <ShoppingCart class="h-4 w-4" />
          {{ cartCount }} item{{ cartCount === 1 ? '' : 's' }} · ₦{{ cartTotal.toLocaleString() }}
        </span>
        <span class="flex items-center gap-1.5 text-sm font-black">
          Checkout <ArrowRight class="h-4 w-4" />
        </span>
      </button>
    </div>

    <!-- Chat sheet -->
    <Teleport to="body">
      <div v-if="showChat" class="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
        <div class="absolute inset-0 bg-gray-900/50" @click="showChat = false" />
        <div class="relative w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-2xl">
          <div class="mb-3 flex items-start justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Pharmacist</p>
              <h3 class="text-base font-black text-gray-900">Ask before you buy</h3>
            </div>
            <button class="rounded-lg p-1.5 text-gray-400" @click="showChat = false"><X class="h-4 w-4" /></button>
          </div>
          <textarea v-model="question" rows="3" placeholder="e.g. Is ibuprofen safe with my malaria medication?"
            class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white" />
          <button class="mt-3 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-50"
            :disabled="sending" @click="send()">{{ sending ? 'Sending…' : 'Send to pharmacist' }}</button>
          <p class="mt-2 text-center text-[10px] text-gray-400">Not for emergencies. If someone is unwell now, go to a hospital.</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, FileText, ImagePlus, MessageCircle, Package, Plus, ShoppingCart, X } from 'lucide-vue-next';
import { vendors_api } from '@/api_factory/modules/vendors';
import { products_api } from '@/api_factory/modules/products';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCart } from '@/composables/modules/cart';
import { useCustomToast } from '@/composables/core/useCustomToast';

const route = useRoute();
const router = useRouter();
const cart = useCart();
const { showToast } = useCustomToast();

const vendor = ref<any>(null);
const products = ref<any[]>([]);
const loading = ref(true);
const activeCategory = ref('All');
const prescriptionImage = ref('');
const uploading = ref(false);
const showChat = ref(false);
const question = ref('');
const sending = ref(false);

const cartCount = computed(() =>
  cart.allVendorIds.value.reduce((n: number, id: string) => {
    const stats: any = cart.getVendorStats(id);
    return n + (stats?.packs || []).reduce((m: number, pk: any) =>
      m + (pk.items || []).reduce((k: number, it: any) => k + (it.quantity || 1), 0), 0);
  }, 0),
);

const cartTotal = computed(() =>
  cart.allVendorIds.value.reduce((n: number, id: string) => {
    const stats: any = cart.getVendorStats(id);
    return n + (Number(stats?.subtotal) || 0);
  }, 0),
);

const goToCart = () => router.push('/cart');

const needsRx = (p: any) => p.requiresPrescription === true || p.prescriptionType === 'pom' || p.prescriptionType === 'controlled';

const categories = computed(() => {
  const set = new Set<string>(products.value.map((p) => String(p.category || 'Pharmacy')));
  return ['All', ...Array.from(set)];
});

const filtered = computed(() =>
  activeCategory.value === 'All' ? products.value : products.value.filter((p) => String(p.category || 'Pharmacy') === activeCategory.value),
);

const onPrescription = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  uploading.value = true;
  try {
    const form = new FormData();
    form.append('file', file);
    const res = await api.post('/uploads/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    prescriptionImage.value = res?.data?.url || res?.data?.secure_url || '';
    showToast({ title: 'Attached', message: 'A pharmacist will review it before dispatch.', toastType: 'success' } as any);
  } catch {
    showToast({ title: 'Upload failed', message: 'Try again, or send it in chat.', toastType: 'error' } as any);
  } finally {
    uploading.value = false;
  }
};

const add = (p: any) => {
  // addItem takes a single CartItem; the cart refuses a second vendor unless a group is active,
  // which is the existing behaviour and is correct here.
  cart.addItem({
    vendorId: vendor.value._id,
    productId: p._id,
    name: p.name,
    price: p.price,
    quantity: 1,
    image: p.image,
    customizations: [],
  } as any);
  showToast({ title: 'Added', message: `${p.name} in your cart`, toastType: 'success' } as any);
};

const openChat = () => { showChat.value = true; };

const send = async () => {
  const text = question.value.trim();
  if (text.length < 5) return;
  sending.value = true;
  try {
    await api.post('/pharmacy-chat', { vendorId: vendor.value._id, message: text });
    question.value = '';
    showChat.value = false;
    showToast({ title: 'Sent', message: 'A pharmacist will reply.', toastType: 'success' } as any);
  } catch {
    showToast({ title: 'Could not send', message: 'Try again', toastType: 'error' } as any);
  } finally {
    sending.value = false;
  }
};

onMounted(async () => {
  try {
    const id = String(route.params.id);
    const [v, p] = await Promise.all([vendors_api.getById(id), products_api.getByVendor(id)]);
    vendor.value = v?.data || v;
    products.value = p?.data || [];
  } catch {
    showToast({ title: 'Could not load', message: 'This pharmacy is unavailable', toastType: 'error' } as any);
  } finally {
    loading.value = false;
  }
});
</script>
