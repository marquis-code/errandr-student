<template>
  <div class="max-w-2xl mx-auto pb-20 md:pb-0 flex flex-col h-[calc(100vh-80px)]">
    <!-- Chat Header -->
    <div class="bg-white border-b border-dark-100 p-4 rounded-t-2xl flex items-center gap-3 flex-shrink-0 shadow-sm">
      <button @click="router.back()" class="p-1.5 rounded-lg bg-dark-50 hover:bg-dark-100 transition-colors">
        <ChevronLeft class="w-5 h-5 text-dark-900" />
      </button>
      <div v-if="otherUser" class="flex items-center gap-3 flex-1">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {{ otherUser.firstName?.[0] }}{{ otherUser.lastName?.[0] }}
        </div>
        <div>
          <p class="text-dark-900 font-semibold text-sm">{{ otherUser.firstName }} {{ otherUser.lastName }}</p>
          <div class="flex items-center gap-1">
            <span :class="isOnline ? 'status-online' : 'status-offline'" />
            <span class="text-xs text-dark-400">{{ isOnline ? 'Online' : 'Offline' }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <a v-if="otherUser?.phone" :href="`tel:${otherUser.phone}`" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-dark-400 hover:text-white">
          <Phone class="w-5 h-5" />
        </a>
      </div>
    </div>

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-dark-50">
      <div v-if="loadingMessages" class="flex items-center justify-center py-8">
        <div class="animate-spin w-6 h-6 border border-primary-500 border-t-transparent rounded-full" />
      </div>

      <div v-for="msg in messages" :key="msg._id" class="flex animate-fade-in" :class="isMyMessage(msg) ? 'justify-end' : 'justify-start'">
        <div class="max-w-[75%] group">
          <div
            class="rounded-2xl px-4 py-2.5 shadow-lg"
            :class="isMyMessage(msg)
              ? 'bg-primary-600 text-white rounded-br-sm shadow-md'
              : 'bg-white text-dark-900 rounded-bl-sm border border-dark-100 shadow-sm'"
          >
            <!-- Image message -->
            <img v-if="msg.type === 'image'" :src="msg.image" class="rounded-xl max-w-full max-h-48 mb-1" />

            <!-- Location message -->
            <div v-else-if="msg.type === 'location'" class="flex items-center gap-2">
              <span class="text-xl">📍</span>
              <span class="text-sm">Shared a location</span>
            </div>

            <!-- Text message -->
            <p v-else class="text-sm leading-relaxed">{{ msg.message }}</p>
          </div>
          <div class="flex items-center gap-1 mt-0.5 px-1" :class="isMyMessage(msg) ? 'justify-end' : 'justify-start'">
            <span class="text-[10px] text-dark-500">{{ formatTime(msg.createdAt) }}</span>
            <span v-if="isMyMessage(msg) && msg.isRead" class="text-[10px] text-primary-400">✓✓</span>
            <span v-else-if="isMyMessage(msg)" class="text-[10px] text-dark-500">✓</span>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="othserTyping" class="flex justify-start animate-fade-in">
        <div class="glass rounded-2xl px-4 py-3 rounded-bl-sm">
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
            <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
            <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="bg-white border-t border-dark-100 p-3 rounded-b-2xl flex-shrink-0 shadow-lg">
      <div class="flex items-end gap-2">
        <div class="flex-1 relative">
          <textarea
            v-model="newMessage"
            placeholder="Type a message..."
            class="glass-input w-full resize-none py-3 pr-12 max-h-24"
            rows="1"
            @keydown.enter.exact.prevent="sendMessage"
            @input="handleTyping"
          />
          <!-- Emoji shortcut -->
          <button class="absolute right-3 bottom-3 text-dark-400 hover:text-white">
            <Smile class="w-5 h-5" />
          </button>
        </div>
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="w-11 h-11 rounded-xl bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0 transform active:scale-90"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Phone, Smile, Send } from 'lucide-vue-next';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useUser } from '@/composables/modules/auth/user';
import { useSocket } from '@/composables/useSocket';

const route = useRoute();
const router = useRouter();

const { user } = useUser();

const messagesContainer = ref<HTMLElement | null>(null);
const messages = ref<any[]>([]);
const newMessage = ref('');
const loadingMessages = ref(true);
const otherUser = ref<any>(null);
const isOnline = ref(false);
const othserTyping = ref(false);

const orderId = computed(() => route.params.orderId as string);

const isMyMessage = (msg: any) => msg.sender?._id === user.value?._id || msg.sender === user.value?._id;
const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const { connect, emit, on, off } = useSocket('chat');

let typingTimeout: any = null;
const handleTyping = () => {
  emit('typing', { orderId: orderId.value, userId: user.value?._id });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    emit('stopTyping', { orderId: orderId.value, userId: user.value?._id });
  }, 2000);
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  emit('sendMessage', {
    orderId: orderId.value,
    senderId: user.value?._id,
    message: newMessage.value.trim(),
    type: 'text',
  });
  // Optimistic update
  messages.value.push({
    _id: Date.now(),
    sender: user.value?._id,
    message: newMessage.value.trim(),
    type: 'text',
    createdAt: new Date().toISOString(),
    isRead: false,
  });
  newMessage.value = '';
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    messagesContainer.value?.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth',
    });
  });
};

onMounted(async () => {
  try {
    // Load message history
    const [messagesRes, orderRes] = await Promise.all([
      api.get<any[]>(`/chat/order/${orderId.value}`),
      api.get<any>(`/orders/${orderId.value}`),
    ]);
    messages.value = messagesRes.data || [];
    otherUser.value = orderRes.data.errander || orderRes.data.customer;
    scrollToBottom();
  } catch (e) { console.error(e); }
  finally { loadingMessages.value = false; }

  // Connect WebSocket
  connect();
  emit('joinOrder', { orderId: orderId.value, userId: user.value?._id });

  on('newMessage', (msg: any) => {
    // Avoid duplicate from optimistic update
    if (!messages.value.find((m: any) => m._id === msg._id)) {
      messages.value.push(msg);
      scrollToBottom();
    }
    // Mark as read
    emit('markRead', { orderId: orderId.value, userId: user.value?._id });
  });

  on('userTyping', (data: any) => {
    if (data.userId !== user.value?._id) {
      othserTyping.value = true;
      setTimeout(() => { othserTyping.value = false; }, 3000);
    }
  });

  on('userOnline', () => { isOnline.value = true; });
  on('userOffline', () => { isOnline.value = false; });
});

useHead({ title: 'Chat - Errandr' });
</script>
