<template>
  <div class="min-h-screen bg-[#FBFAF8] px-4 py-10">
    <div class="mx-auto w-full max-w-md">
      <div class="mb-5 flex items-center gap-3">
        <div class="h-11 w-11 overflow-hidden rounded-xl bg-white ring-1 ring-[#EDE9E3]">
          <img v-if="store?.logo" :src="store.logo" class="h-full w-full object-cover" />
          <span v-else class="flex h-full w-full items-center justify-center text-xs font-black text-[#9C968E]">
            {{ (store?.storeName || 'W').slice(0, 2).toUpperCase() }}
          </span>
        </div>
        <div>
          <p class="text-sm font-black text-[#171310]">{{ store?.storeName || 'Waitlist' }}</p>
          <p class="text-[11px] text-[#8A8178]">Waitlist</p>
        </div>
      </div>

      <div v-if="loading" class="rounded-2xl border border-[#EDE9E3] bg-white p-8 text-center text-sm text-[#9C968E]">
        Loading…
      </div>

      <div v-else-if="!form" class="rounded-2xl border border-dashed border-[#EDE9E3] bg-white p-8 text-center">
        <p class="text-sm font-bold text-[#171310]">This waitlist is not open</p>
        <p class="mx-auto mt-1 max-w-xs text-xs text-[#8A8178]">
          The store may have closed it, or the link is out of date.
        </p>
      </div>

      <form v-else-if="!submitted" class="space-y-4 rounded-2xl border border-[#EDE9E3] bg-white p-5" @submit.prevent="submit">
        <div>
          <h1 class="text-lg font-black leading-tight tracking-tight text-[#171310]">{{ form.title }}</h1>
          <p v-if="form.description" class="mt-1 whitespace-pre-line text-xs text-[#6B655D]">{{ form.description }}</p>
        </div>

        <div v-for="f in form.fields" :key="f.key" class="space-y-1">
          <label class="text-[11px] font-bold uppercase tracking-wider text-[#9C968E]">
            {{ f.label }}<span v-if="f.required" class="text-rose-500"> *</span>
          </label>

          <textarea v-if="f.type === 'textarea'" v-model="answers[f.key]" rows="3"
            class="w-full resize-none rounded-xl border border-[#EDE9E3] bg-[#FBFAF8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5C1A] focus:bg-white" />

          <select v-else-if="f.type === 'select'" v-model="answers[f.key]"
            class="w-full rounded-xl border border-[#EDE9E3] bg-[#FBFAF8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5C1A]">
            <option value="">Choose…</option>
            <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
          </select>

          <input v-else v-model="answers[f.key]" :type="inputType(f.type)"
            class="w-full rounded-xl border border-[#EDE9E3] bg-[#FBFAF8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5C1A] focus:bg-white" />
        </div>

        <button type="submit" :disabled="sending"
          class="w-full rounded-xl bg-[#FF5C1A] py-3 text-sm font-bold text-white disabled:opacity-50">
          {{ sending ? 'Sending…' : 'Join the waitlist' }}
        </button>

        <p v-if="error" class="text-center text-[11px] font-bold text-rose-600">{{ error }}</p>
      </form>

      <div v-if="submitted" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p class="text-sm font-black text-emerald-900">You're on the list</p>
        <p class="mx-auto mt-1 max-w-xs text-xs text-emerald-800">
          {{ store?.storeName || 'The store' }} will contact you. Nothing else is needed.
        </p>
      </div>

      <p class="mt-6 text-center text-[10px] text-[#9C968E]">Powered by Erranders</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { GATEWAY_ENDPOINT as api } from '@/api_factory/axios.config';

const route = useRoute();
const form = ref<any>(null);
const store = ref<any>(null);
const loading = ref(true);
const sending = ref(false);
const error = ref('');
const submitted = ref(false);
const answers = reactive<Record<string, any>>({});

const inputType = (t: string) => (t === 'email' ? 'email' : t === 'phone' ? 'tel' : t === 'date' ? 'date' : 'text');

const subdomain = () => {
  if (typeof window === 'undefined') return '';
  const parts = window.location.hostname.split('.');
  return parts.length >= 3 ? parts[0] : (route.query.store as string) || '';
};

const load = async () => {
  loading.value = true;
  try {
    const sub = subdomain();
    const res = await api.get(`/waitlist/public/${sub}/${route.params.slug}`);
    form.value = res.data?.form || null;
    store.value = res.data?.vendor || null;
    for (const f of form.value?.fields || []) answers[f.key] = '';
  } catch {
    form.value = null;
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  error.value = '';
  sending.value = true;
  try {
    const sub = subdomain();
    await api.post(`/waitlist/public/${sub}/${route.params.slug}`, { answers: { ...answers } });
    submitted.value = true;
    form.value = null;
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Could not submit. Please try again.';
  } finally {
    sending.value = false;
  }
};

onMounted(load);
</script>
