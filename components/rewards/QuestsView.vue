<template>
  <div class="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-2xl font-black text-gray-900 tracking-tighter">Campus Quests</h3>
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Earn bonus points for every mission</p>
      </div>
      <div class="w-12 h-12 bg-parentPrimary/10 rounded-2xl flex items-center justify-center text-parentPrimary">
        <Target class="w-6 h-6" />
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-50 rounded-3xl animate-pulse"></div>
    </div>

    <div v-else-if="quests.length === 0" class="py-12 text-center">
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🏆</div>
      <p class="text-sm font-bold text-gray-400">No active quests right now. Check back later!</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="quest in quests" 
        :key="quest._id"
        class="group relative p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-parentPrimary/20 hover:bg-white hover:shadow-xl transition-all duration-500"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {{ quest.icon || '🎯' }}
          </div>
          
          <div class="flex-1">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h4 class="font-black text-gray-900 tracking-tight">{{ quest.title }}</h4>
                <p class="text-[11px] font-medium text-gray-500">{{ quest.description }}</p>
              </div>
              <div class="text-right">
                <span class="text-xs font-black text-emerald-600">+{{ quest.rewardPoints }} pts</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                <span>{{ quest.isCompleted ? 'Completed' : 'In Progress' }}</span>
                <span>{{ quest.progress }} / {{ quest.targetValue }}</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-parentPrimary transition-all duration-1000 ease-out"
                  :style="{ width: `${Math.min((quest.progress / quest.targetValue) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion Overlay -->
        <div v-if="quest.isCompleted" class="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
            ✓ Mission Accomplished
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Target } from 'lucide-vue-next';

const loading = ref(true);
const quests = ref<any[]>([]);

const fetchQuests = async () => {
  try {
    const { data } = await useFetch('/api/rewards/quests');
    if (data.value) {
      quests.value = data.value as any[];
    }
  } catch (e) {
    console.error('Failed to fetch quests:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchQuests);
</script>
