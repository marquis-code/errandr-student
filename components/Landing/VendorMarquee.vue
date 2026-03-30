<template>
  <div class="relative py-16 md:py-24 overflow-hidden bg-gray-950">
    <!-- Sophisticated Background Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,95,219,0.05),transparent_70%)]" />
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <div class="flex flex-col gap-8 md:gap-12 relative z-10">
      <!-- Row 1: Left to Right -->
      <div class="flex overflow-hidden select-none">
        <div class="flex animate-marquee-left whitespace-nowrap gap-8 md:gap-16 items-center">
          <div v-for="(vendor, i) in vendors" :key="vendor" class="flex items-center gap-8 md:gap-16">
            <span 
              :class="[
                'text-5xl md:text-8xl font-black tracking-tighter font-onest transition-colors duration-500',
                i % 2 === 0 ? 'text-white/10 hover:text-white/20' : 'text-transparent stroke-text hover:text-white/5'
              ]"
            >
              {{ vendor }}
            </span>
            <div class="flex flex-col gap-1 opacity-20">
              <div class="w-8 h-1 bg-parentPrimary rounded-full" />
              <div class="w-4 h-1 bg-parentPrimary rounded-full translate-x-4" />
            </div>
          </div>
        </div>
        <!-- Duplicates -->
        <div class="flex animate-marquee-left whitespace-nowrap gap-8 md:gap-16 items-center" aria-hidden="true">
          <div v-for="(vendor, i) in vendors" :key="vendor + '-dup'" class="flex items-center gap-8 md:gap-16">
            <span 
              :class="[
                'text-5xl md:text-8xl font-black tracking-tighter font-onest transition-colors duration-500',
                i % 2 === 0 ? 'text-white/10 hover:text-white/20' : 'text-transparent stroke-text hover:text-white/5'
              ]"
            >
              {{ vendor }}
            </span>
            <div class="flex flex-col gap-1 opacity-20">
              <div class="w-8 h-1 bg-parentPrimary rounded-full" />
              <div class="w-4 h-1 bg-parentPrimary rounded-full translate-x-4" />
            </div>
          </div>
        </div>
      </div>

      <!-- Center Brand Label -->
      <div class="flex items-center justify-center gap-4 py-2">
        <div class="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-parentPrimary/30" />
        <p class="text-[10px] md:text-sm font-black text-parentPrimary tracking-[0.4em] uppercase font-onest">
          Bringing Happiness to Students' Doorsteps
        </p>
        <div class="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-parentPrimary/30" />
      </div>

      <!-- Row 2: Right to Left -->
      <div class="flex overflow-hidden select-none">
        <div class="flex animate-marquee-right whitespace-nowrap gap-8 md:gap-16 items-center">
          <div v-for="(vendor, i) in [...vendors].reverse()" :key="vendor + '-rev'" class="flex items-center gap-8 md:gap-16">
            <span 
              :class="[
                'text-5xl md:text-8xl font-black tracking-tighter font-onest transition-colors duration-500',
                i % 2 !== 0 ? 'text-white/10 hover:text-white/20' : 'text-transparent stroke-text hover:text-white/5'
              ]"
            >
              {{ vendor }}
            </span>
            <Zap class="w-6 h-6 md:w-12 md:h-12 text-parentPrimary/20 fill-current" />
          </div>
        </div>
        <!-- Duplicates -->
        <div class="flex animate-marquee-right whitespace-nowrap gap-8 md:gap-16 items-center" aria-hidden="true">
          <div v-for="(vendor, i) in [...vendors].reverse()" :key="vendor + '-rev-dup'" class="flex items-center gap-8 md:gap-16">
            <span 
              :class="[
                'text-5xl md:text-8xl font-black tracking-tighter font-onest transition-colors duration-500',
                i % 2 !== 0 ? 'text-white/10 hover:text-white/20' : 'text-transparent stroke-text hover:text-white/5'
              ]"
            >
              {{ vendor }}
            </span>
            <Zap class="w-6 h-6 md:w-12 md:h-12 text-parentPrimary/20 fill-current" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Zap } from 'lucide-vue-next';
const vendors = [
  'Mavise', 'Iya Chidera', 'Aunty Iyabo', 
  'Smoothie Daddy', 'Chikoke', 'Tasty Delight', 
  'Iya Warris', 'Just Spices', 'Iya Monisca'
];
</script>

<style scoped>
.font-onest {
  font-family: 'Onest', sans-serif;
}

.stroke-text {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15);
}

@keyframes marquee-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@keyframes marquee-right {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}

.animate-marquee-left {
  animation: marquee-left 60s linear infinite;
}

.animate-marquee-right {
  animation: marquee-right 60s linear infinite;
}

.flex:hover .animate-marquee-left,
.flex:hover .animate-marquee-right {
  animation-play-state: paused;
}
</style>
