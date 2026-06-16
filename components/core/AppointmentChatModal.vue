<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="close"></div>
    
    <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col h-[80vh] max-h-[800px] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b-[0.5px] border-gray-100 bg-white">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-[0.5px] border-gray-200">
            <img v-if="vendorAvatar" :src="vendorAvatar" class="w-full h-full object-cover" />
            <span v-else class="text-xl font-bold text-gray-400">{{ vendorInitials }}</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ vendorName }}</h3>
            <p class="text-xs text-gray-500 font-medium">Vendor</p>
          </div>
        </div>
        <button @click="close" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X class="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50" ref="messagesContainer">
        <div v-if="loading" class="flex justify-center py-8">
          <Loader2 class="w-8 h-8 text-gray-400 animate-spin" />
        </div>
        
        <template v-else-if="messages.length > 0">
          <div 
            v-for="msg in messages" 
            :key="msg._id"
            class="flex flex-col max-w-[85%]"
            :class="msg.senderId === currentUserId ? 'ml-auto items-end' : 'mr-auto items-start'"
          >
            <div 
              class="px-5 py-3 rounded-2xl text-sm"
              :class="msg.senderId === currentUserId 
                ? 'bg-gray-900 text-white rounded-br-sm' 
                : 'bg-white text-gray-900 border-[0.5px] border-gray-200 rounded-bl-sm shadow-sm'"
            >
              {{ msg.message }}
            </div>
            <span class="text-[10px] text-gray-400 mt-1.5 font-medium px-1">{{ formatTime(msg.createdAt) }}</span>
          </div>
        </template>

        <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
          <MessageSquare class="w-12 h-12 text-gray-300" />
          <p class="text-sm font-medium">Send a message to start the conversation.</p>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 bg-white border-t-[0.5px] border-gray-100">
        <form @submit.prevent="submitMessage" class="flex items-end gap-3 relative">
          <textarea
            v-model="newMessage"
            rows="1"
            placeholder="Type a message..."
            class="w-full bg-gray-50 border-[0.5px] border-gray-200 rounded-2xl px-5 py-3.5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 resize-none max-h-32"
            @keydown.enter.prevent="handleEnter"
            ref="inputRef"
            @input="adjustHeight"
          ></textarea>
          <button 
            type="submit"
            :disabled="!newMessage.trim() || sending"
            class="absolute right-2 bottom-2 p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { X, Send, Loader2, MessageSquare } from 'lucide-vue-next';
import { useAppointmentChat } from '@/composables/useAppointmentChat';
import { useUser } from '@/composables/modules/auth/user';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  appointmentId: { type: String, required: true },
  vendorId: { type: String, required: true },
  vendorOwnerId: { type: String, required: true },
  vendorName: { type: String, default: 'Vendor' },
  vendorAvatar: { type: String, default: '' },
});

const emit = defineEmits(['close']);

const { user } = useUser();
const currentUserId = computed(() => (user.value as any)?._id || (user.value as any)?.id);

const { messages, loading, fetchMessages, sendMessage, setupListeners } = useAppointmentChat(
  props.appointmentId,
  currentUserId.value,
  props.vendorOwnerId
);

const newMessage = ref('');
const sending = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);

const vendorInitials = computed(() => {
  if (!props.vendorName) return 'V';
  return props.vendorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
});

const formatTime = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const adjustHeight = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 128) + 'px';
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) return;
  submitMessage();
};

const submitMessage = async () => {
  const text = newMessage.value.trim();
  if (!text || sending.value || !currentUserId.value) return;

  sending.value = true;
  try {
    sendMessage(text, props.vendorOwnerId, currentUserId.value);
    newMessage.value = '';
    adjustHeight();
    scrollToBottom();
  } finally {
    sending.value = false;
  }
};

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    await fetchMessages();
    setupListeners();
    scrollToBottom();
  }
});

watch(messages, () => {
  scrollToBottom();
}, { deep: true });

const close = () => {
  emit('close');
};
</script>
