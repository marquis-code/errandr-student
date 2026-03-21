<template>
  <div class="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0 flex flex-col h-[calc(100vh-80px)]">
    <!-- Report Header -->
    <div class="bg-white border border-dark-100 shadow-sm p-4 rounded-2xl flex-shrink-0">
      <div class="flex items-center gap-3 mb-2">
        <button @click="$router.back()" class="p-1.5 rounded-lg bg-dark-50 hover:bg-dark-100">
          <ChevronLeft class="w-5 h-5 text-dark-900" />
        </button>
        <div class="flex-1">
          <h2 class="text-dark-900 font-semibold text-sm">{{ report?.title }}</h2>
          <p class="text-xs text-dark-400 capitalize">{{ report?.category?.replace(/_/g, ' ') }} • {{ report?.vendor?.storeName }}</p>
        </div>
        <span :class="statusBadge(report?.status)" class="text-xs capitalize">{{ report?.status }}</span>
      </div>
      <p class="text-sm text-dark-600 bg-dark-50 p-3 rounded-xl border border-dark-100">{{ report?.description }}</p>
    </div>

    <!-- Chat Thread with Admin -->
    <div ref="threadContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
      <div v-for="msg in report?.thread" :key="msg.timestamp" class="flex" :class="msg.isAdmin ? 'justify-start' : 'justify-end'">
        <div class="max-w-[75%]">
          <div class="rounded-2xl px-4 py-2.5" :class="msg.isAdmin ? 'bg-white border border-dark-100 shadow-sm rounded-bl-sm' : 'bg-primary-600 text-white shadow-md rounded-br-sm'">
            <div v-if="msg.isAdmin" class="flex items-center gap-1 mb-1">
              <span class="text-xs font-semibold text-accent-400">Admin</span>
            </div>
            <p class="text-sm">{{ msg.message }}</p>
          </div>
          <p class="text-[10px] text-dark-500 mt-0.5 px-1" :class="msg.isAdmin ? '' : 'text-right'">
            {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>
      </div>
      <div v-if="!report?.thread?.length" class="text-center py-8">
        <MessageSquare class="w-12 h-12 text-dark-300 mx-auto mb-2" />
        <p class="text-dark-500 text-sm">An admin will respond to your report here</p>
      </div>
    </div>

    <!-- Message Input -->
    <div class="bg-white border border-dark-100 shadow-lg p-3 rounded-2xl flex-shrink-0 flex gap-2">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Message admin..."
        class="glass-input flex-1"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" :disabled="!newMessage.trim()" class="btn-primary py-2 px-4 disabled:opacity-30">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, MessageSquare } from 'lucide-vue-next';
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

const route = useRoute();
const report = ref<any>(null);
const newMessage = ref('');
const threadContainer = ref<HTMLElement | null>(null);

const statusBadge = (s: string) => ({ pending: 'badge-orange', investigating: 'badge bg-blue-500/20 text-blue-400', resolved: 'badge-green', dismissed: 'badge-red' }[s] || 'badge');

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  try {
    const res = await api.post(`/reports/${route.params.id}/message`, { message: newMessage.value.trim() });
    report.value = res.data;
    newMessage.value = '';
    nextTick(() => threadContainer.value?.scrollTo({ top: threadContainer.value.scrollHeight, behavior: 'smooth' }));
  } catch (e) { console.error(e); }
};

onMounted(async () => {
  try { 
    const res = await api.get(`/reports/${route.params.id}`);
    report.value = res.data;
  }
  catch (e) { console.error(e); }
});

useHead({ title: 'Report Detail - Errandr' });
</script>
