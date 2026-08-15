<template>
  <div class="p-5">
    <pre>{{ debugData }}</pre>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

const debugData = ref('Loading...');

onMounted(async () => {
  try {
    const res = await api.get('/chat/direct/conversations');
    if (res.data && res.data.length > 0) {
      const vendorId = res.data[0].user._id;
      const msgs = await api.get(`/chat/direct/${vendorId}`);
      debugData.value = JSON.stringify({
        conversations: res.data,
        messages: msgs.data
      }, null, 2);
    } else {
      debugData.value = 'No conversations found.';
    }
  } catch(e) {
    debugData.value = String(e);
  }
});
</script>
