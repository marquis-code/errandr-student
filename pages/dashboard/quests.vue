<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Campus Quests</h1>
        <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Missions & Rewards Program</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-parentPrimary/5 border border-parentPrimary/10 rounded-xl">
        <span class="text-[10px] font-black text-parentPrimary uppercase tracking-widest">Active Season: Semester 1</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Quest List -->
      <div class="lg:col-span-2 space-y-8">
        <rewards-quests-view />
        
        <div class="bg-gray-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
          <div class="relative z-10">
            <h3 class="text-2xl font-black tracking-tighter mb-4 italic">The Errandr Legend</h3>
            <p class="text-gray-400 text-sm font-medium leading-relaxed mb-8 max-w-md">Complete all seasonal quests to unlock the **Legendary Errandr** badge and get exclusive 50% delivery discounts for an entire month!</p>
            <div class="flex items-center gap-6">
              <div class="flex -space-x-3">
                <div v-for="i in 4" :key="i" class="w-10 h-10 rounded-full border-2 border-gray-950 bg-gray-800 flex items-center justify-center text-xs font-black text-gray-400">?</div>
              </div>
              <p class="text-[10px] font-black text-parentPrimary uppercase tracking-widest">4 Badges Remaining</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-6">
        <div class="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
          <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">How Quests Work</h4>
          <ul class="space-y-6">
             <li v-for="(step, i) in steps" :key="i" class="flex gap-4">
                <div class="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-black text-gray-900 flex-shrink-0">{{ i + 1 }}</div>
                <div>
                   <p class="text-xs font-black text-gray-900 tracking-tight mb-0.5">{{ step.title }}</p>
                   <p class="text-[10px] font-medium text-gray-400 leading-relaxed">{{ step.desc }}</p>
                </div>
             </li>
          </ul>
        </div>

        <div class="bg-parentPrimary rounded-[2.5rem] p-8 text-white shadow-lg shadow-parentPrimary/20">
          <Trophy class="w-10 h-10 mb-4 opacity-50" />
          <h4 class="text-lg font-black tracking-tighter mb-2 leading-tight">Climb the Hall of Fame</h4>
          <p class="text-[10px] font-bold text-white/70 mb-6 leading-relaxed">Top erranders and customers get special perks every weekend.</p>
          <NuxtLink to="/dashboard/leaderboard" class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-parentPrimary px-4 py-2 rounded-xl hover:scale-105 transition-transform">
            View Rankings <ArrowRight class="w-3 h-3" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy, ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'student'
})

const steps = [
  { title: 'Pick a Quest', desc: 'Browse active missions tailored to your campus journey.' },
  { title: 'Complete Tasks', desc: 'Order from specific vendors or hit delivery milestones.' },
  { title: 'Earn Points', desc: 'Points are added instantly to your balance upon completion.' },
  { title: 'Redeem Prizes', desc: 'Use points for airtime, discounts, or exclusive merch.' }
]

useHead({
  title: 'Campus Quests - Errandr',
  meta: [{ name: 'description', content: 'Complete missions and earn rewards on campus.' }]
})
</script>
