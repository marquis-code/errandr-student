<template>
  <div v-if="loading" class="min-h-screen bg-white flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-parentPrimary/20 border-t-parentPrimary rounded-full animate-spin"></div>
      <p class="text-sm font-medium text-gray-500">Loading store...</p>
    </div>
  </div>
  <template v-else-if="vendor">
    <div v-if="vendor.businessType === 'hybrid'" class="bg-white">
      <!-- Hybrid Toggle -->
      <div class="fixed top-0 inset-x-0 z-[60] bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex gap-2 justify-center shadow-sm">
        <button 
          @click="activeHybridView = 'products'" 
          class="px-6 py-2 rounded-full text-sm font-bold transition-all"
          :class="activeHybridView === 'products' ? 'bg-parentPrimary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >Products</button>
        <button 
          @click="activeHybridView = 'services'" 
          class="px-6 py-2 rounded-full text-sm font-bold transition-all"
          :class="activeHybridView === 'services' ? 'bg-parentPrimary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >Services</button>
      </div>
      <div class="pt-14">
        <ProductVendorProfile v-if="activeHybridView === 'products'" :vendor="vendor" />
        <ServiceVendorProfile v-else :vendor="vendor" :is-hybrid="true" />
      </div>
    </div>
    <ServiceVendorProfile v-else-if="vendor.businessType === 'service_provider' || vendor.businessType === 'service'" :vendor="vendor" :is-hybrid="false" />
    <ProductVendorProfile v-else :vendor="vendor" />
  </template>
  <div v-else class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Store not found</h2>
      <p class="text-gray-500 mb-6">The store you're looking for doesn't exist or is offline.</p>
      <button @click="$router.push('/')" class="px-6 py-3 bg-parentPrimary text-white rounded-xl font-bold">Go Home</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { vendors_api } from '@/api_factory/modules/vendors';
import ProductVendorProfile from '@/components/vendors/ProductVendorProfile.vue';
import ServiceVendorProfile from '@/components/vendors/ServiceVendorProfile.vue';

definePageMeta({ layout: 'default' });

const route = useRoute();
const loading = ref(true);
const vendor = ref<any>(null);
const activeHybridView = ref<'products'|'services'>('services');

const fetchVendorData = async () => {
  const paramId = route.params.id as string;
  if (!paramId) return;
  
  loading.value = true;
  try {
    let vendorRes;
    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      vendorRes = await vendors_api.getById(paramId);
    } else {
      vendorRes = await vendors_api.getBySubdomain(paramId);
    }
    
    if (vendorRes?.data) {
      vendor.value = vendorRes.data;
    }
  } catch (e) {
    console.error('Failed to fetch vendor routing logic', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVendorData();
});
</script>
