<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Campus Hall of Fame</h1>
        <p class="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Top Orderers & Riders this Month</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full">
        <Trophy class="w-3.5 h-3.5 text-amber-600" />
        <span class="text-sm font-black text-amber-700 uppercase tracking-[0.2em]">Next Update: Sunday 12PM</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Top 3 Podium -->
      <div class="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div v-for="(leader, idx) in podium" :key="idx" 
          class="relative bg-white border border-gray-100 p-8 rounded-[3rem]  flex flex-col items-center text-center group hover:scale-[1.02] transition-all"
          :class="idx === 0 ? 'border-amber-200 bg-amber-50/20 md:-translate-y-4' : ''"
        >
          <div class="absolute -top-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black " :class="getPodiumBadge(idx)">
            {{ idx + 1 }}
          </div>
          <div class="w-24 h-24 rounded-[2rem] bg-gray-900 mb-6 overflow-hidden border-4 border-white  relative">
             <img v-if="leader.avatar" :src="leader.avatar" class="w-full h-full object-cover" />
             <div v-else class="w-full h-full flex items-center justify-center text-2xl font-black bg-parentPrimary/10 text-parentPrimary uppercase">
                {{ leader.firstName[0] }}{{ leader.lastName[0] }}
             </div>
          </div>
          <h3 class="text-lg font-black text-gray-900 tracking-tight mb-1">{{ leader.firstName }} {{ leader.lastName }}</h3>
          <p class="text-sm font-black text-gray-400 uppercase  mb-4">{{ leader.faculty || 'Unspecified' }}</p>
          <div class="px-4 py-2 bg-white rounded-xl border border-gray-100 text-sm font-black text-parentPrimary tracking-tighter ">
             {{ leader.points }} PTS
          </div>
        </div>
      </div>

      <!-- Main Leaderboard List -->
      <div class="lg:col-span-8">
        <rewards-leaderboard />
      </div>

      <!-- Rewards Info Side -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white  relative overflow-hidden group">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div class="relative z-10">
            <h4 class="text-xl font-black tracking-tighter mb-4 ">Hall of Fame Perks</h4>
            <div class="space-y-4">
               <div v-for="perk in perks" :key="perk.title" class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">{{ perk.icon }}</div>
                  <div>
                     <p class="text-sm font-black tracking-tight text-white mb-0.5">{{ perk.title }}</p>
                     <p class="text-sm font-medium text-gray-400 leading-relaxed uppercase ">{{ perk.desc }}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div class="bg-parentPrimary/5 border border-parentPrimary/10 rounded-[2.5rem] p-8">
           <p class="text-sm font-black text-gray-400 uppercase  leading-relaxed">
             The Hall of Fame resets every 30 days. Top earners within each faculty receive a specialized badge and a digital certificate of accomplishment as an Errandr Top Performer.
           </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy } from 'lucide-vue-next'
import { ref, onMounted } from 'vue';
import { useRewards } from '@/composables/modules/rewards';

definePageMeta({
  layout: 'student'
})

const { leaders, fetchLeaderboard } = useRewards();

onMounted(async () => {
  await fetchLeaderboard('points');
});

const podium = computed(() => {
  return leaders.value.slice(0, 3).map(l => ({
    ...l,
    firstName: l.firstName || 'Student',
    lastName: l.lastName || '',
    faculty: l.faculty || 'Campus',
    points: l.points || 0,
    avatar: l.avatar
  }));
});

const perks = [
  { icon: '🚀', title: 'Priority Dispatch', desc: 'Orders are prioritized by top-tier errands.' },
  { icon: '🏦', title: 'Zero Service Fees', desc: 'No service charges for top-3 performers.' },
  { icon: '🎁', title: 'VIP Merch', desc: 'Exclusive Errandr hoodies and swag kits.' }
]

const getPodiumBadge = (idx: number) => {
  if (idx === 0) return 'bg-amber-400 text-amber-900 shadow-amber-200 shadow-xl'
  if (idx === 1) return 'bg-slate-200 text-slate-800'
  return 'bg-amber-600 text-amber-100'
}

useHead({
  title: 'Hall of Fame - Errandr',
  meta: [{ name: 'description', content: 'See the top performers on your campus hall of fame.' }]
})
</script>
