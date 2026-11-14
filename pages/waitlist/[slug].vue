<template>
  <div class="min-h-screen bg-[#F0EBF8] px-3 py-6 sm:py-10">
    <!-- Mobile: same banner, natural height, above the form. -->
    <div v-if="form?.bannerImage" class="mx-auto mb-4 w-full max-w-[640px] overflow-hidden rounded-xl shadow-lg lg:hidden">
      <img :src="form.bannerImage" class="block h-auto w-full object-contain" />
      <div class="flex items-center gap-2.5 bg-white px-4 py-3">
        <div class="h-8 w-8 overflow-hidden rounded-full bg-[#F1F3F4]">
          <img v-if="store?.logo" :src="store.logo" class="h-full w-full object-cover" />
        </div>
        <p class="text-sm font-bold text-[#202124]">{{ store?.storeName || 'Waitlist' }}</p>
      </div>
    <div class="relative mx-auto grid w-full max-w-[1080px] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
      <div class="min-w-0">
      <!-- Header card -->
      <div class="overflow-hidden rounded-lg border border-[#DADCE0] bg-white shadow-sm">
        <div class="h-2.5 w-full" :style="{ background: accent }" />

        <div class="px-6 py-6">
          <div class="mb-4 flex items-center gap-2.5 lg:hidden">
            <div class="h-8 w-8 overflow-hidden rounded-full bg-[#F1F3F4]">
              <img v-if="store?.logo" :src="store.logo" class="h-full w-full object-cover" />
              <span v-else class="flex h-full w-full items-center justify-center text-[10px] font-black text-[#5F6368]">
                {{ (store?.storeName || 'W').slice(0, 2).toUpperCase() }}
              </span>
            </div>
            <p class="text-xs font-medium text-[#5F6368]">{{ store?.storeName || 'Waitlist' }}</p>
          </div>

          <h1 class="text-[26px] font-normal leading-snug text-[#202124]">{{ form?.title || 'Waitlist' }}</h1>
          <p v-if="form?.description" class="mt-2 whitespace-pre-line text-sm text-[#5F6368]">{{ form.description }}</p>
          <p class="mt-3 text-xs text-[#5F6368]">
            <span class="text-[#D93025]">*</span> Required
          </p>

          <!-- Scarcity, stated honestly: a real count, not a manufactured one. -->
          <div v-if="remaining !== null && remaining > 0" class="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            :style="{ background: accent + '14' }">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" :style="{ background: accent }" />
              <span class="relative inline-flex h-2 w-2 rounded-full" :style="{ background: accent }" />
            </span>
            <span class="text-[11px] font-bold" :style="{ color: accent }">
              {{ remaining }} {{ remaining === 1 ? 'slot' : 'slots' }} remaining
            </span>
          </div>
        </div>
      </div>

      <!-- Loading / closed -->
      <div v-if="loading" class="mt-4 rounded-lg border border-[#DADCE0] bg-white p-8 text-center text-sm text-[#5F6368]">
        Loading…
      </div>
      <div v-else-if="!form && !submitted" class="mt-4 rounded-lg border border-[#DADCE0] bg-white p-8 text-center">
        <p class="text-base font-medium text-[#202124]">This waitlist is not open</p>
        <p class="mt-1 text-sm text-[#5F6368]">
          {{ remaining === 0 ? 'Every slot has been taken. Watch out for the next round.' : 'The store may have closed it, or the link is out of date.' }}
        </p>
      </div>

      <!-- Questions -->
      <form v-else-if="form && !submitted" @submit.prevent="submit">
        <div v-for="f in form.fields" :key="f.key" class="mt-3 rounded-lg border border-[#DADCE0] bg-white px-6 py-5">
          <p class="text-sm text-[#202124]">
            {{ f.label }}<span v-if="f.required" class="ml-0.5 text-[#D93025]">*</span>
          </p>

          <textarea v-if="f.type === 'textarea'" v-model="answers[f.key]" rows="3" :placeholder="f.label"
            class="mt-4 w-full resize-none rounded border border-[#DADCE0] px-3 py-2 text-sm outline-none transition focus:border-[#FF5C1A] focus:ring-1 focus:ring-[#FF5C1A]" />

          <template v-else-if="f.type === 'select'">
            <div class="relative mt-4">
              <button type="button"
                class="flex w-full items-center justify-between gap-2 rounded border bg-white px-3 py-2.5 text-left text-sm transition"
                :class="openSelect === f.key ? 'border-[#FF5C1A] ring-1 ring-[#FF5C1A]' : 'border-[#DADCE0]'"
                @click="openSelect = openSelect === f.key ? '' : f.key">
                <span :class="answers[f.key] ? 'text-[#202124]' : 'text-[#70757A]'">
                  {{ answers[f.key] || 'Choose' }}
                </span>
                <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 transition-transform" :class="openSelect === f.key ? 'rotate-180' : ''"
                  fill="none" stroke="#5F6368" stroke-width="2" stroke-linecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div v-if="openSelect === f.key"
                class="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded border border-[#DADCE0] bg-white py-1 shadow-xl">
                <button v-for="o in selectOptions(f)" :key="o" type="button"
                  class="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-[#F1F3F4]"
                  :class="answers[f.key] === o ? 'bg-[#FFF3EC] font-medium text-[#FF5C1A]' : 'text-[#202124]'"
                  @click="answers[f.key] = o === OTHER ? OTHER : o; openSelect = ''">
                  {{ o === OTHER ? 'Other' : o }}
                  <svg v-if="answers[f.key] === o" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="#FF5C1A" stroke-width="2.5" stroke-linecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </button>
              </div>
            </div>

            <input v-if="f.allowOther && answers[f.key] === OTHER" v-model="answers[f.key + '_other']"
              placeholder="Your answer"
              class="mt-2 w-full rounded border border-[#DADCE0] px-3 py-2.5 text-sm outline-none transition focus:border-[#FF5C1A] focus:ring-1 focus:ring-[#FF5C1A]" />

            <div v-if="followUpFor(f)" class="mt-2">
              <label class="text-xs text-[#5F6368]">{{ followUpFor(f) }}</label>
              <input v-model="answers[f.key + '_follow']" :placeholder="followUpFor(f)"
                class="mt-1 w-full rounded border border-[#DADCE0] px-3 py-2.5 text-sm outline-none transition focus:border-[#FF5C1A] focus:ring-1 focus:ring-[#FF5C1A]" />
            </div>
          </template>

          <template v-else-if="f.type === 'multiselect'">
            <div class="mt-4 space-y-2">
              <label v-for="o in f.options" :key="o" class="flex items-center gap-2.5 text-sm text-[#202124]">
                <input type="checkbox" :value="o" v-model="answers[f.key]" class="h-4 w-4 rounded-sm accent-[#FF5C1A]" /> {{ o }}
              </label>
              <label v-if="f.allowOther" class="flex items-center gap-2.5 text-sm text-[#202124]">
                <input type="checkbox" :value="OTHER" v-model="answers[f.key]" class="h-4 w-4 rounded-sm accent-[#FF5C1A]" /> Other
              </label>
            </div>
            <input v-if="f.allowOther && (answers[f.key] || []).includes(OTHER)" v-model="answers[f.key + '_other']"
              placeholder="Your answer"
              class="mt-2 w-full rounded border border-[#DADCE0] px-3 py-2 text-sm outline-none focus:border-[#FF5C1A]" />
          </template>

          <template v-else-if="f.type === 'image'">
            <label class="mt-4 flex cursor-pointer items-center gap-2 rounded border border-dashed border-[#DADCE0] px-3 py-3 text-xs text-[#5F6368]">
              <span class="rounded bg-[#F1F3F4] px-2 py-1 text-[11px] font-medium text-[#202124]">Add file</span>
              {{ answers[f.key] ? 'Photo attached' : 'Upload a photo' }}
              <input type="file" accept="image/*" class="hidden" @change="onImage(f.key, $event)" />
            </label>
            <img v-if="answers[f.key]" :src="answers[f.key]" class="mt-2 h-24 rounded object-cover" />
          </template>

          <input v-else v-model="answers[f.key]" :type="inputType(f.type)" :placeholder="f.label"
            class="mt-4 w-full rounded border border-[#DADCE0] px-3 py-2 text-sm outline-none transition focus:border-[#FF5C1A] focus:ring-1 focus:ring-[#FF5C1A]" />
        </div>

        <p v-if="error" class="mt-3 rounded border border-[#F6C7C0] bg-[#FCE8E6] px-4 py-2.5 text-sm text-[#C5221F]">
          {{ error }}
        </p>

        <div class="mt-5">
          <button type="submit" :disabled="sending"
            class="w-full rounded bg-[#FF5C1A] py-3 text-sm font-semibold text-white transition hover:bg-[#E54D12] disabled:opacity-60">
            {{ sending ? 'Submitting…' : 'Submit' }}
          </button>
          <p class="mt-2 text-center text-xs text-[#5F6368]">Never submit passwords</p>
        </div>
      </form>

      <p class="mt-6 text-center text-xs text-[#5F6368]">Powered by Erranders</p>
      </div>

      <!-- Desktop: the banner gets the whole right column at full height. -->
      <aside v-if="form?.bannerImage || store?.logo" class="hidden lg:block">
        <div class="sticky top-10 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-[#E6DDF5]">
          <div class="relative">
            <img v-if="form?.bannerImage" :src="form.bannerImage" class="block h-[520px] w-full object-cover" />
            <div v-else class="h-[520px] w-full" :style="{ background: accent }" />

            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-5 pt-16">
              <div class="flex items-center gap-3">
                <div class="h-11 w-11 overflow-hidden rounded-full bg-white ring-2 ring-white/70">
                  <img v-if="store?.logo" :src="store.logo" class="h-full w-full object-cover" />
                  <span v-else class="flex h-full w-full items-center justify-center text-[11px] font-black text-[#5F6368]">
                    {{ (store?.storeName || 'W').slice(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-base font-bold text-white">{{ store?.storeName || 'Waitlist' }}</p>
                  <p class="text-[11px] text-white/80">Now accepting names</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>


    </div>

    <!-- Success modal -->
    <Teleport to="body">
      <div v-if="submitted" class="fixed inset-0 z-[200] flex items-center justify-center bg-[#202124]/50 p-4">
        <div class="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-2xl">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full" :style="{ background: accent + '1A' }">
            <svg viewBox="0 0 24 24" class="h-6 w-6" :style="{ stroke: accent }" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 class="text-lg font-medium text-[#202124]">Your response has been recorded</h2>
          <p class="mt-1.5 text-sm text-[#5F6368]">
            {{ store?.storeName || 'The store' }} will contact you. Nothing else is needed.
          </p>
          <button class="mt-5 w-full rounded bg-[#FF5C1A] py-2.5 text-sm font-medium text-white hover:bg-[#E54D12]" @click="closeSuccess">
            Done
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GATEWAY_ENDPOINT as api } from '@/api_factory/axios.config';

const route = useRoute();
const router = useRouter();

const form = ref<any>(null);
const store = ref<any>(null);
const loading = ref(true);
const sending = ref(false);
const error = ref('');
const submitted = ref(false);
const answers = reactive<Record<string, any>>({});
const openSelect = ref('');
const remaining = ref<number | null>(null);

// The prompt attached to the option the customer picked, if the vendor set one.
const followUpFor = (f: any) => {
  const key = answers[f.key];
  if (typeof key !== 'string') return '';
  return (f.followUps || {})[key] || '';
};

const selectOptions = (f: any) => {
  const opts = [...(f.options || [])];
  if (f.allowOther) opts.push(OTHER);
  return opts;
};

const OTHER = '__other__';

// The store's own accent, so the form still belongs to them.
const BRAND = '#FF5C1A';
const accent = computed(() => BRAND);

const inputType = (t: string) =>
  t === 'email' ? 'email' : t === 'phone' ? 'tel' : t === 'date' ? 'date' : t === 'number' ? 'number' : 'text';

const subdomain = () => {
  if (typeof window === 'undefined') return '';
  const parts = window.location.hostname.split('.');
  return parts.length >= 3 ? parts[0] : (route.query.store as string) || '';
};

const onImage = async (key: string, e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    answers[key] = res?.data?.url || res?.data?.data?.url || res?.data?.secure_url || '';
  } catch {
    answers[key] = '';
  }
};

const load = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/waitlist/public/${subdomain()}/${route.params.slug}`);
    form.value = res.data?.form || null;
    store.value = res.data?.vendor || null;
    remaining.value = typeof res.data?.remaining === 'number' ? res.data.remaining : null;
    for (const f of form.value?.fields || []) {
      answers[f.key] = f.type === 'multiselect' ? [] : '';
    }

    // Count the visit once per browser session. Reloads and back-navigation would otherwise
    // inflate the number until it stopped telling the vendor anything.
    try {
      const seen = `wl-view-${String(route.params.slug)}`;
      if (!sessionStorage.getItem(seen)) {
        sessionStorage.setItem(seen, '1');
        api.post(`/waitlist/public/${subdomain()}/${route.params.slug}/view`).catch(() => {});
      }
    } catch {
      /* private mode, storage blocked — a view is not worth failing the page for */
    }
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
    // Fold "Other" free text into the answer the provider reads.
    const payload: Record<string, any> = { ...answers };
    for (const f of form.value?.fields || []) {
      if (f.allowOther) {
        const other = payload[`${f.key}_other`];
        if (Array.isArray(payload[f.key]) && payload[f.key].includes(OTHER)) {
          payload[f.key] = payload[f.key].filter((v: string) => v !== OTHER).concat(other ? [other] : []);
        } else if (payload[f.key] === OTHER && other) {
          payload[f.key] = other;
        }
      }
      if (f.followUps && f.followUps[payload[f.key]] && payload[`${f.key}_follow`]) {
        payload[f.key] = `${payload[f.key]} — ${payload[`${f.key}_follow`]}`;
      }
      delete payload[`${f.key}_other`];
      delete payload[`${f.key}_follow`];
    }

    const submitRes = await api.post(`/waitlist/public/${subdomain()}/${route.params.slug}`, { answers: payload });
    if (typeof (submitRes as any)?.data?.remaining === 'number') remaining.value = (submitRes as any).data.remaining;
    submitted.value = true;

  } catch (e: any) {
    const m = e?.response?.data?.message;
    error.value = Array.isArray(m) ? m.join(', ') : m || 'Could not submit. Please try again.';
  } finally {
    sending.value = false;
  }
};

const closeSuccess = () => {
  submitted.value = false;
  router.push('/');
};

// Client-side SEO. Social crawlers are served rewritten tags by server/middleware/waitlist-og.ts,
// because this app renders no HTML of its own.
useHead(() => ({
  title: form.value?.title
    ? `${form.value.title}${store.value?.storeName ? ' · ' + store.value.storeName : ''}`
    : 'Waitlist · Erranders',
  meta: [
    { name: 'description', content: form.value?.description || `Join the waitlist for ${store.value?.storeName || 'this store'} on Erranders.` },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: form.value?.title ? `${form.value.title}${store.value?.storeName ? ' · ' + store.value.storeName : ''}` : 'Waitlist' },
    { property: 'og:description', content: form.value?.description || 'Join the waitlist on Erranders.' },
    ...(form.value?.bannerImage ? [{ property: 'og:image', content: form.value.bannerImage }] : []),
    { name: 'twitter:card', content: form.value?.bannerImage ? 'summary_large_image' : 'summary' },
  ],
}));

onMounted(load);
</script>
