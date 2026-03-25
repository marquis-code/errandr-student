<template>
  <Transition name="slide-down">
    <div v-if="status?.isActive" class="fixed top-0 left-0 w-full z-[100] px-4 py-3 sm:px-6 pointer-events-none">
      <div class="max-w-4xl mx-auto bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] pointer-events-auto overflow-hidden group">
        <!-- Animated Background Glow -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-parentPrimary/20 rounded-full blur-[40px] animate-pulse"></div>
        
        <div class="relative z-10 p-1 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-parentPrimary/10 flex items-center justify-center text-parentPrimary shadow-inner border border-parentPrimary/20">
              <Rocket class="w-6 h-6 animate-bounce-slow" />
            </div>
            <div>
              <h4 class="text-sm font-black text-white tracking-tight">
                {{ status.message }}
              </h4>
              <p class="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase mt-0.5 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Window Active until {{ status.end || '10:00' }} • Higher Priority Dispatch
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button @click="scrollToVendors" class="px-6 py-2.5 bg-parentPrimary text-white text-[10px] font-black tracking-widest uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-parentPrimary/20">
              Plan My Day
            </button>
            <button @click="dismiss" class="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white">
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Rocket, X } from 'lucide-vue-next';
import { orders_api } from '@/api_factory/modules/orders';

const status = ref<any>(null);
const isDismissed = ref(false);

const checkStatus = async () => {
  if (isDismissed.value) return;
  try {
    const res = await orders_api.getBatchStatus();
    if (res && res.data) {
      status.value = res.data;
    }
  } catch (e) {
    console.error('Failed to fetch batch status', e);
  }
};

const dismiss = () => {
  if (status.value) status.value.isActive = false;
  isDismissed.value = true;
};

const scrollToVendors = () => {
  const el = document.getElementById('categories') || document.getElementById('featured');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(() => {
  checkStatus();
  // Poll every 5 minutes
  setInterval(checkStatus, 5 * 60 * 1000);
});
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from {
  transform: translateY(-100%) scale(0.9);
  opacity: 0;
}
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>
