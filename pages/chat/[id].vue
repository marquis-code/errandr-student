<template>
  <div class="h-[calc(100vh-80px)] md:h-screen flex flex-col bg-dark-50">
    <!-- Chat Header -->
    <div class="bg-white border-b border-dark-100 shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="p-2 hover:bg-dark-50 rounded-full text-dark-500 hover:text-dark-900 transition-colors">
          <ChevronLeft class="w-6 h-6" />
        </button>
        <div v-if="order">
          <h1 class="text-dark-900 font-bold">{{ order.orderNumber }}</h1>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            <p class="text-[10px] text-dark-500 font-bold">Online</p>
          </div>
        </div>
      </div>
      <div v-if="order?.errander" class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <p class="text-dark-900 text-sm font-semibold">{{ order.errander.firstName }}</p>
          <p class="text-primary-400 text-[10px] font-bold">Your Errandr</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold">
          {{ order.errander.firstName?.[0] }}
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="chatContainer">
      <div v-for="(msg, i) in messages" :key="msg._id || i" 
        class="flex flex-col"
        :class="isMe(msg) ? 'items-end' : 'items-start'"
      >
        <div 
          class="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          :class="isMe(msg) 
            ? 'bg-primary-600 text-white rounded-tr-none shadow-md' 
            : 'bg-white text-dark-900 rounded-tl-none border border-dark-100 shadow-sm'"
        >
          <p>{{ msg.message }}</p>
          <div class="flex items-center justify-end gap-1 mt-1 opacity-60">
            <span class="text-[9px]">{{ formatTime(msg.createdAt) }}</span>
            <Check v-if="isMe(msg)" class="w-3 h-3" :class="msg.read ? 'text-accent-400' : 'text-white'" stroke-width="3" />
          </div>
        </div>
      </div>
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex gap-2 p-2 items-center">
        <div class="flex gap-1">
          <span class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
        <span class="text-[10px] text-dark-500 font-bold">Typing...</span>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-white border-t border-dark-100 shadow-xl sticky bottom-0">
      <div class="flex items-end gap-2 max-w-4xl mx-auto">
        <button class="p-3 text-dark-400 hover:text-primary-400 transition-colors">
          <PlusCircle class="w-6 h-6" />
        </button>
        <div class="flex-1 relative">
          <textarea
            v-model="newMessage"
            rows="1"
            placeholder="Type a message..."
            class="w-full glass-input py-3 pr-12 resize-none max-h-32 text-sm"
            @input="handleInput"
            @keydown.enter.prevent="sendMessage"
          ></textarea>
          <button 
            @click="sendMessage"
            class="absolute right-2 bottom-2 p-2 rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all"
            :disabled="!newMessage.trim()"
          >
            <Send class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Check, PlusCircle, Send } from 'lucide-vue-next';
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useUser } from '@/composables/modules/auth/user';
import { useSocket } from '@/composables/useSocket';

const route = useRoute();
const router = useRouter();

const { user } = useUser();
const { on, emit, connect } = useSocket('chat');

const order = ref<any>(null);
const messages = ref<any[]>([]);
const newMessage = ref('');
const isTyping = ref(false);
const chatContainer = ref<HTMLElement | null>(null);
let typingTimeout: any = null;

const isMe = (msg: any) => msg.sender?._id === user.value?._id || msg.sender === user.value?._id;

const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' });
    }
  });
};

const handleInput = () => {
  if (!order.value?.errander) return;
  emit('typing', { orderId: route.params.id, receiverId: order.value.errander._id });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    emit('stopTyping', { orderId: route.params.id, receiverId: order.value.errander._id });
  }, 2000);
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !order.value?.errander) return;
  
  emit('sendMessage', {
    orderId: route.params.id,
    senderId: user.value?._id,
    receiverId: order.value.errander._id,
    message: newMessage.value,
  });
  
  newMessage.value = '';
  emit('stopTyping', { orderId: route.params.id, receiverId: order.value.errander._id });
};

onMounted(async () => {
  try {
    const orderRes = await api.get<any>(`/orders/${route.params.id}`);
    order.value = orderRes.data;
    const messagesRes = await api.get<any[]>(`/chat/order/${route.params.id}`);
    messages.value = messagesRes.data;
    scrollToBottom();
  } catch (e) {
    console.error(e);
  }

  connect();
  emit('joinOrder', { orderId: route.params.id });

  on('newMessage', (msg: any) => {
    messages.value.push(msg);
    scrollToBottom();
  });

  on('typing', (data: any) => {
    if (data.senderId !== user.value?._id) {
      isTyping.value = true;
      scrollToBottom();
    }
  });

  on('stopTyping', (data: any) => {
    if (data.senderId !== user.value?._id) {
      isTyping.value = false;
    }
  });
});

useHead({ title: 'Chat - Errandr' });
</script>
