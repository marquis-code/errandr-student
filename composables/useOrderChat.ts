import { ref, onUnmounted, toValue, type MaybeRefOrGetter } from 'vue';
import { useSocket } from '@/composables/useSocket';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

interface Message {
  _id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType?: 'text' | 'image' | 'voice';
  attachment?: string;
  sender?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
}

export const useOrderChat = (
  orderIdArg: MaybeRefOrGetter<string>,
  currentUserIdArg?: MaybeRefOrGetter<string | undefined>,
  targetUserIdArg?: MaybeRefOrGetter<string | undefined>
) => {
  const { connect, emit, on, off } = useSocket('chat');
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const isTyping = ref(false);
  const typingTimeout = ref<any>(null);

  const fetchMessages = async () => {
    loading.value = true;
    const orderId = toValue(orderIdArg);
    const currentUserId = toValue(currentUserIdArg);
    const targetUserId = toValue(targetUserIdArg);
    try {
      const res = await api.get(`/chat/order/${orderId}`);
      if (currentUserId && targetUserId) {
        messages.value = (res.data || []).filter((m: any) => {
          const sId = String(m.senderId || m.sender?._id || m.sender || '');
          const rId = String(m.receiverId || m.receiver?._id || m.receiver || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());
          const tIds = String(targetUserId).split(',').map(id => id.trim());
          const isGeneric = !rId || rId === 'undefined';
          const isRelevant = isGeneric || (cIds.includes(sId) && tIds.includes(rId)) || (tIds.includes(sId) && cIds.includes(rId));
          console.log(`[Student fetchMessages] msgId=${m._id}, sId=${sId}, rId=${rId}, cIds=${cIds.join(',')}, tIds=${tIds.join(',')}, isGeneric=${isGeneric}, isRelevant=${isRelevant}`);
          return isRelevant;
        });
      } else {
        messages.value = res.data || [];
      }
    } catch (e) {
      console.error('Failed to fetch messages', e);
    } finally {
      loading.value = false;
    }
  };

  const extractObjectId = (str: string) => {
    if (!str) return '';
    const parts = String(str).split(',');
    for (const p of parts) {
      const t = p.trim();
      if (/^[0-9a-fA-F]{24}$/.test(t)) return t;
    }
    return String(str).split(',')[0]?.trim() || '';
  };

  const sendMessage = (text: string, receiverId: string, senderId: string, type: 'text' | 'image' | 'voice' = 'text', attachment?: string) => {
    const orderId = toValue(orderIdArg);
    const cleanSenderId = extractObjectId(senderId);
    const cleanReceiverId = extractObjectId(receiverId);
    emit('sendMessage', {
      orderId,
      senderId: cleanSenderId,
      receiverId: cleanReceiverId,
      message: text,
      messageType: type,
      attachment
    });
  };

  const sendTyping = (userId: string) => {
    const orderId = toValue(orderIdArg);
    emit('typing', { orderId, userId });
    if (typingTimeout.value) clearTimeout(typingTimeout.value);
    typingTimeout.value = setTimeout(() => {
      emit('stopTyping', { orderId, userId });
    }, 2000);
  };

  const setupListeners = () => {
    connect();
    
    off('newMessage');
    off('userTyping');
    
    const orderId = toValue(orderIdArg);
    
    emit('joinOrder', { orderId });

    on('newMessage', (message: any) => {
      const currentUserId = toValue(currentUserIdArg);
      const targetUserId = toValue(targetUserIdArg);
      const msgOrderId = message.orderId || message.order;
      if (msgOrderId === toValue(orderIdArg)) {
        if (currentUserId && targetUserId) {
          const sId = String(message.senderId || message.sender?._id || message.sender || '');
          const rId = String(message.receiverId || message.receiver?._id || message.receiver || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());
          const tIds = String(targetUserId).split(',').map(id => id.trim());
          const isGeneric = !rId || rId === 'undefined';
          const isRelevant = isGeneric || (cIds.includes(sId) && tIds.includes(rId)) || (tIds.includes(sId) && cIds.includes(rId));
          console.log(`[Student newMessage] msgId=${message._id}, sId=${sId}, rId=${rId}, cIds=${cIds.join(',')}, tIds=${tIds.join(',')}, isGeneric=${isGeneric}, isRelevant=${isRelevant}`);
          if (!isRelevant) return;
        }

        if (!message._id || !messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        }
      }
    });

    on('userTyping', (data: { userId: string, isTyping: boolean }) => {
      isTyping.value = data.isTyping;
    });
  };

  onUnmounted(() => {
    emit('leaveOrder', { orderId: toValue(orderIdArg) });
  });

  return {
    messages,
    loading,
    isTyping,
    fetchMessages,
    sendMessage,
    sendTyping,
    setupListeners
  };
};
