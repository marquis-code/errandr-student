<template>
 <div class="relative py-20 overflow-hidden bg-gray-900 border-y border-white/5">
 <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 z-10 pointer-events-none" />
 
 <div class="flex flex-col gap-12">
 <!-- Marquee Row 1 -->
 <div class="flex overflow-hidden group">
 <div class="flex animate-marquee whitespace-nowrap gap-12 items-center py-4">
 <div v-for="vendor in vendors" :key="vendor" class="flex items-center gap-6 group/item">
 <span class="text-6xl md:text-8xl font-black text-white/5 hover:text-parentPrimary transition-colors duration-700 tracking-tighter font-display cursor-default selection:bg-none">
 {{ vendor }}
 </span>
 <div class="w-3 h-3 rounded-full bg-parentPrimary/20 group-hover/item:scale-150 transition-transform" />
 </div>
 </div>
 <!-- Duplicate for seamless loop -->
 <div class="flex animate-marquee whitespace-nowrap gap-12 items-center py-4" aria-hidden="true">
 <div v-for="vendor in vendors" :key="vendor + '-dup'" class="flex items-center gap-6 group/item">
 <span class="text-6xl md:text-8xl font-black text-white/5 hover:text-parentPrimary transition-colors duration-700 tracking-tighter font-display cursor-default selection:bg-none">
 {{ vendor }}
 </span>
 <div class="w-3 h-3 rounded-full bg-parentPrimary/20 group-hover/item:scale-150 transition-transform" />
 </div>
 </div>
 </div>

 <!-- Campus Favorite Vendors -->
 <div class="text-center relative z-20">
 <p class="text-[10px] font-bold text-parentPrimary tracking-widest">Bringing Happiness to Students' Doorsteps</p>
 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
const vendors = [
 'Mavise', 'Iya Chidera', 'Aunty Iyabo', 
 'Smoothie Daddy', 'Chikoke', 'Tasty Delight', 
 'Iya Warris', 'Just Spices', 'Iya Monisca'
];
</script>

<style scoped>
@keyframes marquee {
 0% { transform: translateX(0); }
 100% { transform: translateX(-100%); }
}
.animate-marquee {
 animation: marquee 40s linear infinite;
}
.group:hover .animate-marquee {
 animation-play-state: paused;
}
</style>
