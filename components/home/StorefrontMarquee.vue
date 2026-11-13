<template>
  <div class="relative overflow-hidden border-t border-[#EFEAE3] bg-[#FBFAF8] py-10">
    <div class="marquee-track mb-4">
      <div v-for="copy in 2" :key="'a' + copy" class="marquee-row">
        <NuxtLink
          v-for="v in rowA"
          :key="v._id + '-' + copy"
          :to="`/vendors/${v._id}`"
          class="mr-4 w-[240px] shrink-0 overflow-hidden rounded-2xl border border-[#EFEAE3] bg-white transition-shadow hover:shadow-lg"
        >
          <div class="flex h-32 items-center justify-center overflow-hidden bg-[#F4F1EC]">
            <img v-if="v.coverImage || v.banner" :src="v.coverImage || v.banner" class="h-full w-full object-cover" />
            <img v-else-if="v.logo" :src="v.logo" class="h-14 w-14 object-contain" />
            <span v-else class="text-lg font-bold text-[#B9AFA3]">{{ (v.storeName || 'S').slice(0, 2) }}</span>
          </div>
          <div class="p-3">
            <p class="truncate text-sm font-bold text-[#171310]">{{ v.storeName }}</p>
            <p class="mt-0.5 truncate text-[11px] text-[#8A8178]">
              {{ v.category || 'Campus store' }}
              <span v-if="v.deliveryFee"> · ₦{{ Number(v.deliveryFee).toLocaleString() }}</span>
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div class="marquee-track marquee-reverse">
      <div v-for="copy in 2" :key="'b' + copy" class="marquee-row">
        <NuxtLink
          v-for="v in rowB"
          :key="v._id + '-b-' + copy"
          :to="`/vendors/${v._id}`"
          class="mr-4 w-[240px] shrink-0 overflow-hidden rounded-2xl border border-[#EFEAE3] bg-white transition-shadow hover:shadow-lg"
        >
          <div class="flex h-32 items-center justify-center overflow-hidden bg-[#F4F1EC]">
            <img v-if="v.coverImage || v.banner" :src="v.coverImage || v.banner" class="h-full w-full object-cover" />
            <img v-else-if="v.logo" :src="v.logo" class="h-14 w-14 object-contain" />
            <span v-else class="text-lg font-bold text-[#B9AFA3]">{{ (v.storeName || 'S').slice(0, 2) }}</span>
          </div>
          <div class="p-3">
            <p class="truncate text-sm font-bold text-[#171310]">{{ v.storeName }}</p>
            <p class="mt-0.5 truncate text-[11px] text-[#8A8178]">
              {{ v.category || 'Campus store' }}
              <span v-if="v.deliveryFee"> · ₦{{ Number(v.deliveryFee).toLocaleString() }}</span>
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ vendors?: any[] }>();

const all = computed(() => (props.vendors || []).filter((v: any) => v?.storeName));
const mid = computed(() => Math.max(1, Math.ceil(all.value.length / 2)));
const rowA = computed(() => all.value.slice(0, mid.value));
const rowB = computed(() => all.value.slice(mid.value));
</script>

<style scoped>
.marquee-track {
  display: flex;
  width: max-content;
  animation: scroll-left 48s linear infinite;
}
.marquee-reverse {
  animation-name: scroll-right;
  animation-duration: 56s;
}
.marquee-row {
  display: flex;
}
.marquee-track:hover {
  animation-play-state: paused;
}
@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes scroll-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
</style>
