<template>
 <div class="h-screen flex flex-col bg-[#E5DDD5] font-sans selection:bg-[#00A884]/30">
 <!-- WhatsApp Green Header -->
 <div class="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-md">
 <button @click="router.back()" class="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
 <ArrowLeft class="w-6 h-6 text-white" />
 </button>
 <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold overflow-hidden shrink-0 border border-white/10 shadow-sm relative group cursor-pointer">
 {{ order?.errander?.firstName?.[0] || 'E' }}
 </div>
 <div class="flex-1 min-w-0 cursor-pointer" v-if="order">
 <h1 class="text-base font-bold truncate leading-tight tracking-tight">{{ order.errander?.firstName || 'Your Errandr' }}</h1>
 <p class="text-[12px] text-white/80 font-medium truncate mt-0.5">
 {{ isTyping ? 'typing...' : 'online' }}
 </p>
 </div>
 <div class="flex items-center gap-5 ml-2 shrink-0">
 <Video class="w-5 h-5 text-white cursor-pointer hover:opacity-80 transition-opacity" />
 <Phone class="w-4 h-4 text-white cursor-pointer hover:opacity-80 transition-opacity fill-current" />
 <MoreVertical class="w-5 h-5 text-white cursor-pointer hover:opacity-80 transition-opacity" />
 </div>
 </div>

 <!-- Messages Area with WhatsApp Doodle Background -->
 <div 
 class="flex-1 overflow-y-auto px-2 sm:px-4 py-6 space-y-2 scroll-smooth bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95"
 ref="chatContainer"
 >
 <!-- Date Marker -->
 <div class="flex justify-center mb-6 sticky top-2 z-10">
 <span class="px-3 py-1.5 bg-[#D1E9F6] text-[#54656F] text-[11.5px] font-bold rounded-lg shadow-sm tracking-wide backdrop-blur-sm bg-opacity-90">
 Order {{ order?.orderNumber || 'Connecting...' }}
 </span>
 </div>

 <div class="flex flex-col items-center justify-center p-10 text-center space-y-3 mt-4" v-if="messages.length === 0">
 <div class="px-4 py-3 bg-[#FCF4CB] rounded-2xl shadow-sm max-w-sm border border-amber-100/50">
 <p class="text-[12px] text-[#54656F] font-medium leading-relaxed">
 🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even Errandr, can read or listen to them. Tap to learn more.
 </p>
 </div>
 </div>

 <div v-for="(msg, i) in messages" :key="msg._id || i" 
 class="flex flex-col w-full animate-message-in"
 :class="isMe(msg) ? 'items-end' : 'items-start'"
 >
 <div 
 :class="[
 'relative max-w-[85%] px-2.5 py-1.5 rounded-lg text-[15px] shadow-sm mb-0.5 group transition-all',
 isMe(msg) 
 ? 'bg-[#DCF8C6] text-[#111B21] rounded-tr-none ml-10' 
 : 'bg-white text-[#111B21] rounded-tl-none mr-10'
 ]"
 >
 <!-- Speech Bubble Tail -->
 <div v-if="shouldShowTail(msg, i)" 
 :class="[
 'absolute top-0 w-[11px] h-[13px] overflow-hidden',
 isMe(msg) ? 'right-[-11px] text-[#DCF8C6]' : 'left-[-11px] text-white transform -scale-x-100'
 ]">
 <svg viewBox="0 0 11 13" class="fill-current w-full h-full">
 <path d="M0,0 C0,0 8.5,0.5 11,0 C11,6.5 6.5,13 0,13 L0,0 Z"></path>
 </svg>
 </div>

 <div class="flex items-end gap-3 flex-wrap relative">
 <span class="break-words flex-1 min-w-0 font-normal leading-relaxed pb-[10px] pl-1 pr-1">{{ msg.message }}</span>
 <div class="flex items-center gap-1 shrink-0 absolute bottom-[-2px] right-0 bg-transparent">
 <span class="text-[10.5px] text-gray-500 font-medium">
 {{ formatTime(msg.createdAt) }}
 </span>
 <div v-if="isMe(msg)" class="flex items-center">
 <CheckCheck class="w-[15px] h-[15px] text-[#34B7F1]" stroke-width="2.5" />
 </div>
 </div>
 </div>
 </div>
 </div>
 
 <!-- Typing Indicator -->
 <div v-if="isTyping" class="flex items-center ml-2 transition-all mt-2 animate-fade-in relative max-w-[85%] px-3 py-2.5 rounded-lg bg-white rounded-tl-none shadow-sm h-[38px] w-[60px]">
 <div class="absolute top-0 w-[11px] h-[13px] overflow-hidden left-[-11px] text-white transform -scale-x-100">
 <svg viewBox="0 0 11 13" class="fill-current w-full h-full"><path d="M0,0 C0,0 8.5,0.5 11,0 C11,6.5 6.5,13 0,13 L0,0 Z"></path></svg>
 </div>
 <div class="flex gap-[3px] items-center justify-center w-full h-full opacity-60">
 <span class="w-[6px] h-[6px] bg-[#54656F] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
 <span class="w-[6px] h-[6px] bg-[#54656F] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
 <span class="w-[6px] h-[6px] bg-[#54656F] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
 </div>
 </div>
 </div>

 <!-- WhatsApp Input Bar -->
 <div class="px-2 py-2.5 bg-[#F0F2F5] flex flex-col gap-2 sticky bottom-0 border-t border-gray-200">
 <div class="flex items-end gap-2 max-w-4xl mx-auto w-full">
 <!-- Input Container -->
 <div class="flex-1 bg-white rounded-[24px] px-3 py-1 flex items-end shadow-sm border border-transparent focus-within:border-gray-200 transition-all min-h-[44px]">
 <button class="p-2 mb-0.5 shrink-0 text-[#54656F] hover:text-[#00A884] transition-colors rounded-full hover:bg-gray-50">
 <Smile class="w-[26px] h-[26px]" />
 </button>
 
 <textarea
 v-model="newMessage"
 rows="1"
 placeholder="Type a message"
 class="w-full bg-transparent border-none outline-none text-[16px] font-normal text-[#111B21] placeholder:text-gray-400 resize-none overflow-hidden mx-2 py-[11px]"
 @input="handleInput"
 @keydown.enter.prevent="sendMessage"
 style="min-height: 24px; max-height: 120px;"
 ></textarea>

 <button class="p-2 mb-0.5 shrink-0 text-[#54656F] hover:text-[#00A884] transition-colors rounded-full hover:bg-gray-50 transform -rotate-45">
 <Paperclip class="w-[22px] h-[22px]" />
 </button>
 </div>

 <!-- Send Button -->
 <button 
 @click="sendMessage"
 :class="[
 'w-[48px] h-[48px] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 mb-0.5',
 newMessage.trim() ? 'bg-[#00A884] hover:bg-[#008f6f]' : 'bg-[#00A884] hover:bg-[#008f6f]'
 ]"
 >
 <Send v-if="newMessage.trim()" class="w-[20px] h-[20px] ml-1 mt-[2px] stroke-2" />
 <Mic v-else class="w-[22px] h-[22px] fill-current" />
 </button>
 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CheckCheck, Smile, Paperclip, Send, Mic, Video, Phone, MoreVertical } from 'lucide-vue-next';
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

const getSenderId = (msg: any) => msg.sender?._id || msg.sender;
const isMe = (msg: any) => getSenderId(msg) === user.value?._id;

const shouldShowTail = (msg: any, idx: number) => {
 if (idx === 0) return true;
 return getSenderId(messages.value[idx - 1]) !== getSenderId(msg);
};

const formatTime = (date: string) => {
 if (!date) return '';
 return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = () => {
 nextTick(() => {
 if (chatContainer.value) {
 chatContainer.value.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' });
 }
 });
};

const handleInput = (e: Event) => {
 const target = e.target as HTMLTextAreaElement;
 target.style.height = 'auto';
 target.style.height = `${target.scrollHeight}px`;

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
 
 // reset text area height
 nextTick(() => {
 const textareas = document.querySelectorAll('textarea');
 textareas.forEach(t => t.style.height = '44px');
 });

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
 // Also include check for msg order id to protect from leakage
 const msgOrderId = msg.orderId || msg.order;
 if (msgOrderId === route.params.id || msgOrderId?.toString() === route.params.id) {
 messages.value.push(msg);
 scrollToBottom();
 }
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

<style scoped>
.animate-message-in {
 animation: slideUp 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}
@keyframes slideUp {
 from { opacity: 0; transform: translateY(8px) scale(0.98); }
 to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
 animation: fadeIn 0.3s ease-in-out forwards;
}
@keyframes fadeIn {
 from { opacity: 0; }
 to { opacity: 1; }
}
</style>
