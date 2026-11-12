<template>
  <div class="min-h-screen bg-[#FBFDF9] pb-32">
    <div class="border-b border-[#E4EFDC] bg-white px-4 py-4">
      <div class="mx-auto flex max-w-2xl items-center gap-3">
        <button class="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F9EE]" @click="router.back()">
          <ArrowLeft class="h-4 w-4 text-[#12300F]" />
        </button>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-[#7C9075]">Pharmacy checkout</p>
          <h1 class="text-lg font-black tracking-tight text-[#12300F]">Review before you pay</h1>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-2xl space-y-4 px-4 pt-4">
      <!-- Items -->
      <section class="rounded-2xl border border-[#E4EFDC] bg-white p-4">
        <h2 class="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#7C9075]">Your medicines</h2>
        <div v-for="it in items" :key="it.productId" class="flex items-center justify-between border-b border-[#F3F9EE] py-2 last:border-0">
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-[#12300F]">{{ it.name }}</p>
            <div class="mt-0.5 flex gap-1.5">
              <span v-if="it.requiresPrescription" class="rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-700">Rx</span>
              <span v-if="it.minimumAge" class="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">{{ it.minimumAge }}+</span>
              <span class="text-[10px] text-[#7C9075]">×{{ it.quantity }}</span>
            </div>
          </div>
          <span class="shrink-0 text-sm font-black text-[#12300F]">₦{{ ((it.price || 0) * (it.quantity || 1)).toLocaleString() }}</span>
        </div>
        <div class="mt-3 flex items-center justify-between border-t border-[#E4EFDC] pt-3">
          <span class="text-xs font-bold text-[#4A6B44]">Items total</span>
          <span class="text-base font-black text-[#12300F]">₦{{ itemsTotal.toLocaleString() }}</span>
        </div>
      </section>

      <!-- Prescription -->
      <section v-if="needsPrescription" class="rounded-2xl border-2 border-dashed border-[#7FBF62] bg-white p-4">
        <div class="flex items-start gap-3">
          <FileText class="mt-0.5 h-5 w-5 shrink-0 text-[#7FBF62]" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-black text-[#12300F]">Prescription required</p>
            <p class="mt-1 text-[11px] text-[#4A6B44]">
              This order contains a prescription-only medicine. A pharmacist checks it before the rider collects.
            </p>
            <label class="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#12300F] px-3 py-2.5 text-xs font-bold text-white">
              <ImagePlus class="h-4 w-4" />
              {{ prescription ? 'Replace photo' : (uploading ? 'Uploading…' : 'Upload prescription') }}
              <input type="file" accept="image/*,application/pdf" class="hidden" @change="onPick" />
            </label>
            <p v-if="prescription" class="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 class="h-3.5 w-3.5" /> Attached
            </p>
            <p v-if="error" class="mt-2 text-[11px] font-bold text-rose-600">{{ error }}</p>
          </div>
        </div>
      </section>

      <!-- Review step -->
      <section class="rounded-2xl bg-[#EAF6E2] p-4">
        <div class="flex items-start gap-3">
          <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-[#2C6B1F]" />
          <div>
            <p class="text-sm font-bold text-[#12300F]">A pharmacist reviews every order</p>
            <p class="mt-1 text-[11px] text-[#3A6B2E]">
              Your payment is held until a pharmacist confirms the medicines. If something needs changing,
              you are contacted instead of being dispatched a wrong item.
            </p>
          </div>
        </div>
      </section>
    </div>

    <div class="fixed bottom-0 left-0 right-0 border-t border-[#E4EFDC] bg-white px-4 py-3">
      <div class="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-[#7C9075]">To pay</p>
          <p class="text-base font-black text-[#12300F]">₦{{ itemsTotal.toLocaleString() }}</p>
        </div>
        <button
          class="flex-1 max-w-[220px] rounded-xl bg-[#12300F] py-3 text-sm font-bold text-white disabled:opacity-50"
          :disabled="blocked"
          @click="continueToPayment"
        >
          {{ blocked ? 'Upload prescription first' : 'Continue to payment' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, CheckCircle2, FileText, ImagePlus, ShieldCheck } from 'lucide-vue-next';
import { useCart } from '@/composables/modules/cart';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';

const router = useRouter();
const cart = useCart();
const { showToast } = useCustomToast();

const items = ref<any[]>([]);
const prescription = ref('');
const uploading = ref(false);
const error = ref('');

const itemsTotal = computed(() => items.value.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0));
const needsPrescription = computed(() => items.value.some((i) => i.requiresPrescription));
const blocked = computed(() => needsPrescription.value && !prescription.value);

const onPick = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  uploading.value = true;
  error.value = '';
  try {
    const form = new FormData();
    form.append('file', file);
    const res = await api.post('/uploads/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    prescription.value = res?.data?.url || res?.data?.secure_url || '';
    if (!prescription.value) throw new Error('no url');
    // Hand it to the shared checkout, which owns payment.
    localStorage.setItem('errandr_prescription_image', prescription.value);
    showToast({ title: 'Attached', message: 'A pharmacist will review it.', toastType: 'success' } as any);
  } catch {
    error.value = 'Upload failed. Try again, or send it to the pharmacist in chat.';
  } finally {
    uploading.value = false;
  }
};

const continueToPayment = () => {
  if (blocked.value) return;
  router.push('/cart');
};

onMounted(() => {
  const collected: any[] = [];
  for (const id of cart.allVendorIds.value) {
    const stats: any = cart.getVendorStats(id);
    for (const pack of stats?.packs || []) {
      for (const it of pack.items || []) collected.push(it);
    }
  }
  items.value = collected;
  prescription.value = localStorage.getItem('errandr_prescription_image') || '';
});
</script>
