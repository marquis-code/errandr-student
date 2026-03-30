<template>
  <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute -right-24 -top-24 w-64 h-64 bg-parentPrimary/20 rounded-full blur-[100px]"></div>
    <div class="absolute -left-24 -bottom-24 w-48 h-48 bg-secondary/10 rounded-full blur-[80px]"></div>

    <div class="relative z-10 flex flex-col h-full">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-2xl font-black tracking-tighter">Campus Hall of Fame</h3>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Top orderers and riders this month</p>
        </div>
        <div class="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            v-for="t in types" 
            :key="t.key"
            @click="activeType = t.key"
            class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            :class="activeType === t.key ? 'bg-parentPrimary text-white shadow-lg' : 'text-gray-400 hover:text-white'"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex-1 space-y-4">
        <div v-for="i in 5" :key="i" class="h-16 bg-white/5 rounded-3xl animate-pulse"></div>
      </div>

      <div v-else-if="leaders.length === 0" class="flex-1 flex flex-col items-center justify-center py-12">
        <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-4">🏆</div>
        <p class="text-sm font-bold text-gray-500">The leaderboard is being initialized...</p>
      </div>

      <div v-else class="flex-1 space-y-3">
        <div 
          v-for="(user, index) in leaders" 
          :key="user._id"
          class="flex items-center gap-4 p-4 rounded-3xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all group"
        >
          <div class="w-8 h-8 flex items-center justify-center font-black text-lg" :class="getRankClass(index)">
            #{{ index + 1 }}
          </div>
          
          <div class="w-10 h-10 rounded-2xl bg-gray-800 flex-shrink-0 overflow-hidden border border-white/10">
            <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center uppercase text-sm font-black text-parentPrimary bg-parentPrimary/10">
              {{ user.firstName[0] }}{{ user.lastName[0] }}
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm truncate uppercase tracking-tighter">{{ user.firstName }} {{ user.lastName }}</h4>
            <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest truncate">{{ user.faculty || 'Unspecified' }}</p>
          </div>

          <div class="text-right">
            <p class="text-sm font-black text-parentPrimary tracking-tighter">{{ getScoreLabel(user) }}</p>
            <p class="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Points: {{ user.points }}</p>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Updated in real-time</p>
        <button class="text-xs font-black text-parentPrimary uppercase tracking-widest hover:underline transition-all">View All Rankings →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const loading = ref(true);
const leaders = ref<any[]>([]);
const activeType = ref<'points' | 'orders' | 'deliveries'>('points');

const types = [
  { key: 'points', label: 'Ranks' },
  { key: 'orders', label: 'Hunger' },
  { key: 'deliveries', label: 'Hustle' }
];

const fetchLeaderboard = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch(`/api/rewards/leaderboard?type=${activeType.value}`);
    if (data.value) {
      leaders.value = data.value as any[];
    }
  } catch (e) {
    console.error('Failed to fetch leaderboard:', e);
  } finally {
    loading.value = false;
  }
};

const getRankClass = (idx: number) => {
  if (idx === 0) return 'text-amber-400';
  if (idx === 1) return 'text-slate-300';
  if (idx === 2) return 'text-amber-600';
  return 'text-gray-600';
};

const getScoreLabel = (user: any) => {
  if (activeType.value === 'orders') return `${user.totalOrders || 0} Orders`;
  if (activeType.value === 'deliveries') return `${user.totalDeliveries || 0} Deliveries`;
  return `${user.points || 0} PTS`;
};

watch(activeType, fetchLeaderboard);
onMounted(fetchLeaderboard);
</script>
