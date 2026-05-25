<template>
  <Transition name="slam-in">
    <div
      v-if="status?.isActive"
      class="batch-banner"
      :class="{ dismissed: isDismissing }"
    >
      <!-- Animated border glow -->
      <div class="border-beam" />

      <div class="banner-inner">
        <!-- LEFT: Icon + Status pill -->
        <div class="banner-left">
          <div class="icon-pod">
            <Rocket class="rocket-icon" />
            <span class="icon-ring" />
          </div>

          <div class="status-text">
            <div class="live-chip">
              <span class="live-dot" />
              LIVE
            </div>
            <p class="headline">{{ status.message }}</p>
            <p class="subline">
              Until <strong>{{ status.end || '10:00' }}</strong>
              &nbsp;·&nbsp; Priority Dispatch
            </p>
          </div>
        </div>

        <!-- RIGHT: CTA + Dismiss -->
        <div class="banner-right">
          <button class="cta-btn" @click="scrollToVendors">
            <span>Plan My Day</span>
            <ArrowRight class="btn-arrow" />
          </button>
          <button class="dismiss-btn" @click="dismiss" aria-label="Dismiss">
            <X class="x-icon" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Rocket, X, ArrowRight } from 'lucide-vue-next';
import { orders_api } from '@/api_factory/modules/orders';

const status = ref<any>(null);
const isDismissed = ref(false);
const isDismissing = ref(false);

const checkStatus = async () => {
  if (isDismissed.value) return;
  try {
    const res = await orders_api.getBatchStatus();
    if (res?.data) status.value = res.data;
  } catch (e) {
    console.error('Failed to fetch batch status', e);
  }
};

const dismiss = () => {
  isDismissing.value = true;
  setTimeout(() => {
    if (status.value) status.value.isActive = false;
    isDismissed.value = true;
    isDismissing.value = false;
  }, 400);
};

const scrollToVendors = () => navigateTo('/vendors');

onMounted(() => {
  checkStatus();
  setInterval(checkStatus, 5 * 60 * 1000);
});
</script>

<style scoped>
/* ─── Layout ─────────────────────────────────────────────── */
.batch-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 10px 12px;
  pointer-events: none;
}

.banner-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 860px;
  margin: 0 auto;
  padding: 10px 12px 10px 10px;
  border-radius: 20px;
  background: #0a0a0f;
  border: 1px solid rgba(255,255,255,0.08);
  pointer-events: auto;
  overflow: hidden;

  /* subtle inner light */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    0 24px 48px -8px rgba(0,0,0,0.5);
}

/* ─── Animated border beam ───────────────────────────────── */
.border-beam {
  position: absolute;
  inset: -1px;
  border-radius: 21px;
  background: conic-gradient(
    from var(--beam-angle, 0deg),
    transparent 0deg,
    #f97316 60deg,
    #fb923c 90deg,
    transparent 120deg
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1px;
  animation: beam-spin 4s linear infinite;
  opacity: 0.6;
  pointer-events: none;
}

@property --beam-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes beam-spin {
  to { --beam-angle: 360deg; }
}

/* ─── Left section ───────────────────────────────────────── */
.banner-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

/* Icon pod */
.icon-pod {
  position: relative;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 1px rgba(249,115,22,0.3), 0 8px 16px -4px rgba(249,115,22,0.4);
}

.rocket-icon {
  width: 20px;
  height: 20px;
  color: #fff;
  animation: float 2.5s ease-in-out infinite;
}

.icon-ring {
  position: absolute;
  inset: -4px;
  border-radius: 18px;
  border: 1px solid rgba(249,115,22,0.25);
  animation: ring-pulse 2.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(-8deg); }
}

@keyframes ring-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.15); }
}

/* Status text */
.status-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.live-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(16,185,129,0.12);
  border: 1px solid rgba(16,185,129,0.25);
  border-radius: 100px;
  padding: 2px 8px 2px 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #10b981;
  width: fit-content;
  margin-bottom: 2px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: dot-blink 1.4s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes dot-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.headline {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.subline {
  margin: 0;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.subline strong {
  color: rgba(255,255,255,0.7);
  font-weight: 600;
}

/* ─── Right section ──────────────────────────────────────── */
.banner-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* CTA */
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border: none;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px -2px rgba(249,115,22,0.5);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.cta-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 6px 20px -2px rgba(249,115,22,0.65);
}

.cta-btn:active {
  transform: scale(0.97);
}

.btn-arrow {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

/* Dismiss */
.dismiss-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.08);
  background: transparent;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}

.dismiss-btn:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
}

.x-icon {
  width: 13px;
  height: 13px;
}

/* ─── Transitions ────────────────────────────────────────── */
.slam-in-enter-active {
  transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.slam-in-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 1, 1);
}
.slam-in-enter-from {
  transform: translateY(-110%) scale(0.92);
  opacity: 0;
  filter: blur(4px);
}
.slam-in-leave-to {
  transform: translateY(-24px) scale(0.96);
  opacity: 0;
  filter: blur(2px);
}

.batch-banner.dismissed .banner-inner {
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.35s ease;
}

/* ─── Mobile ─────────────────────────────────────────────── */
@media (max-width: 520px) {
  .batch-banner {
    padding: 8px;
  }

  .banner-inner {
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 10px 10px 10px;
    border-radius: 16px;
  }

  .banner-left {
    /* takes full width on mobile, right section goes below */
    flex: 1 1 100%;
  }

  .banner-right {
    flex: 1 1 100%;
    /* CTA stretches, dismiss floats right */
    justify-content: space-between;
  }

  .cta-btn {
    flex: 1;
    justify-content: center;
    padding: 10px 14px;
    font-size: 13px;
  }

  .dismiss-btn {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }

  .x-icon {
    width: 15px;
    height: 15px;
  }

  .headline {
    font-size: 13px;
  }

  .icon-pod {
    width: 40px;
    height: 40px;
    border-radius: 13px;
  }
}

@media (max-width: 360px) {
  .subline {
    display: none;
  }
}
</style>