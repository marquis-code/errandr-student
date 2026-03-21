<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8 pb-24">
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-black text-dark-900 tracking-tight">🍱 Meal Budget Planner</h1>
      <p class="text-dark-500 font-medium">Optimize your food spending across Errandr vendors.</p>
    </div>

    <!-- Budget Input -->
    <div class="bg-white p-8 rounded-3xl border border-dark-100 shadow-xl relative overflow-hidden">
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div class="max-w-md mx-auto space-y-6">
        <div>
          <label class="block text-xs font-black text-primary-600 uppercase tracking-widest mb-3">Total Budget (₦)</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-dark-400">₦</span>
            <input 
              v-model="budget" 
              type="number" 
              class="w-full bg-dark-50 border border-dark-200 rounded-2xl pl-12 py-4 text-3xl font-black text-dark-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <button 
          @click="calculatePlan" 
          class="btn-primary w-full py-5 text-lg font-bold shadow-lg shadow-primary-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          :disabled="isCalculating || !budget || budget <= 0"
        >
          {{ isCalculating ? 'Calculating Optimal Plan...' : 'Generate Optimal Plan' }}
        </button>
      </div>
    </div>

    <!-- Results Display -->
    <div v-if="plan" class="space-y-6 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl text-center border border-dark-100 shadow-sm">
          <p class="text-[10px] text-dark-500 uppercase tracking-widest font-black mb-1">Estimated Duration</p>
          <h3 class="text-3xl font-black text-dark-900">{{ plan.cookedMealPlan?.length }} Days</h3>
          <p class="text-[10px] text-primary-600 font-bold mt-1">3 MEALS PER DAY</p>
        </div>
        <div class="bg-white p-5 rounded-2xl text-center border border-accent-100 shadow-sm">
          <p class="text-[10px] text-dark-500 uppercase tracking-widest font-black mb-1">Savings Potential</p>
          <h3 class="text-3xl font-black text-accent-600">₦{{ plan.savings?.toLocaleString() }}</h3>
          <p class="text-[10px] text-accent-600 font-bold mt-1">VS. RESTAURANT PRICES</p>
        </div>
        <div class="bg-white p-5 rounded-2xl text-center border border-dark-100 shadow-sm">
          <p class="text-[10px] text-dark-500 uppercase tracking-widest font-black mb-1">Raw Materials Duration</p>
          <h3 class="text-3xl font-black text-dark-900">{{ plan.rawMaterialsPlan?.daysSupported || 0 }} Days</h3>
          <p class="text-[10px] text-dark-500 font-bold mt-1">MAX SUSTAINABILITY</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Cooked Food Path -->
        <div class="bg-white p-6 rounded-3xl border border-dark-100 shadow-lg space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-black text-dark-900 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm">👨‍🍳</span>
              Vendor Route
            </h3>
            <span class="badge-orange">Cooked Meals</span>
          </div>
          <p class="text-xs text-dark-500 font-medium leading-relaxed">{{ plan.recommendation }}</p>
          
          <div class="space-y-3 mt-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            <div v-for="day in plan.cookedMealPlan" :key="day.day" class="space-y-2 mb-4">
              <h4 class="text-[10px] font-black text-dark-400 uppercase tracking-widest">Day {{ day.day }}</h4>
              <div v-for="meal in day.meals" :key="meal.type" class="flex items-center justify-between p-4 bg-dark-50 rounded-2xl border border-dark-100 hover:border-primary-500/30 transition-colors">
                <div>
                  <p class="text-xs font-black text-dark-900 capitalize">{{ meal.type }}</p>
                  <p class="text-[10px] text-dark-500 font-medium">{{ meal.options.map((o: any) => o.product.name).join(', ') }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-primary-600">₦{{ meal.estimatedCost }}</p>
                  <p class="text-[9px] text-dark-400 font-bold">{{ meal.options[0]?.vendor?.storeName }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Raw Materials Path -->
        <div class="bg-white p-6 rounded-3xl border border-dark-100 shadow-lg space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-black text-dark-900 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm">🛒</span>
              Market Route
            </h3>
            <span class="badge-green">Raw Ingredients</span>
          </div>
          <p class="text-xs text-dark-500 font-medium leading-relaxed">Buy in bulk from market vendors and cook yourself to save more.</p>
          
          <div class="space-y-3 mt-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            <div v-for="item in plan.rawMaterialsPlan?.items" :key="item.name" class="flex items-center justify-between p-4 bg-dark-50 rounded-2xl border border-dark-100 hover:border-accent-500/30 transition-colors">
              <div>
                <p class="text-sm font-black text-dark-900">{{ item.name }}</p>
                <p class="text-[10px] text-dark-500 font-medium">{{ item.vendor?.storeName || 'Market Vendor' }} — {{ item.category }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-accent-600">₦{{ item.price }}</p>
                <p class="text-[9px] text-dark-400 font-bold">Covers {{ item.serves }} meals</p>
              </div>
            </div>
          </div>
          
          <div class="mt-4 p-5 rounded-2xl bg-primary-50 border border-primary-100">
            <p class="text-xs text-primary-700 font-medium italic">"Choosing this route increases your daily duration significantly on the same budget."</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { useHead, useApi } from '#imports';

import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
const budget = ref<number | null>(null);
const plan = ref<any>(null);
const isCalculating = ref(false);

const calculatePlan = async () => {
  if (!budget.value) return;
  isCalculating.value = true;
  try {
    // Artificial delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    const res = await api.get(`/meal-planner/plan?budget=${budget.value}`);
    plan.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    isCalculating.value = false;
  }
};

useHead({ title: 'Meal Budget Planner - Errandr' });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-dark-200 rounded-full;
}
</style>
