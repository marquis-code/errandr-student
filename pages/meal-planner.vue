<template>
  <div class="max-w-7xl mx-auto space-y-12 pb-32 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Hero Header -->
    <div class="relative mx-4 md:mx-0 rounded-3xl lg:rounded-[4rem] bg-gray-900 p-8 lg:p-20 overflow-hidden group shadow-xl border-b-[8px] lg:border-b-[16px] border-gray-800 mt-4 md:mt-8">
      <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/20 via-transparent to-transparent opacity-50" />
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-parentPrimary/10 rounded-full blur-[120px] animate-pulse" />
      
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
           <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-parentPrimary text-[10px] font-bold uppercase tracking-widest">
              Smart Budgeting
           </div>
           <h1 class="text-4xl md:text-7xl font-bold text-white tracking-tight leading-[0.9]">
              Your Weekly <br /><span class="text-parentPrimary">Meal Plan.</span>
           </h1>
           <p class="text-gray-400 text-lg font-bold leading-relaxed max-w-sm">Plan your meals, manage your allowance, and eat like a king on campus.</p>
        </div>
        
        <div class="hidden lg:block">
           <div class="relative group/image">
              <div class="absolute -inset-4 bg-parentPrimary/20 blur-3xl rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-1000" />
              <img src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800&h=600&fit=crop" class="relative z-10 rounded-2xl md:rounded-[3rem] shadow-xl border-4 md:border-8 border-white/5 transform rotate-2 group-hover/image:rotate-0 transition-transform duration-700 object-cover w-full h-48 md:h-64" />
           </div>
        </div>
      </div>
    </div>

    <!-- Configuration Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 px-4 mt-6 lg:mt-0">
      <div class="lg:col-span-4 space-y-6 lg:space-y-8">
        <div class="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8 group relative overflow-hidden transition-all hover:shadow-lg">
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl group-hover:bg-parentPrimary/5 transition-colors" />
          
          <div class="space-y-8 relative z-10">
            <div class="space-y-4">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                 <Wallet class="w-4 h-4 text-parentPrimary" /> Weekly Budget
              </label>
              <div class="relative group/field">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-900 group-focus-within/field:text-parentPrimary transition-colors">₦</span>
                <input 
                  v-model="budget"
                  type="number"
                  placeholder="Enter Amount"
                  class="w-full pl-14 pr-6 py-7 bg-gray-50 border border-gray-100 rounded-[2.5rem] text-2xl font-bold tracking-tight focus:bg-white focus:ring-[12px] focus:ring-parentPrimary/5 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                 <UtensilsCrossed class="w-4 h-4 text-parentPrimary" /> Daily Meals
              </label>
              <div class="flex gap-3 bg-gray-50 p-2 rounded-[2rem] border border-gray-100">
                <button 
                  v-for="i in 3" 
                  :key="i"
                  @click="mealsPerDay = i"
                  class="flex-1 py-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all"
                  :class="mealsPerDay === i ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'"
                >
                  {{ i }} Meal{{ i > 1 ? 's' : '' }}
                </button>
              </div>
            </div>

            <button 
              @click="generatePlan"
              :disabled="loading"
              class="w-full py-7 bg-parentPrimary text-white rounded-[2rem] text-xs font-bold uppercase tracking-widest shadow-lg shadow-parentPrimary/30 hover:scale-[1.02] active:scale-95 transition-all group mt-4 overflow-hidden relative"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Zap v-if="!loading" class="w-5 h-5 inline-block mr-2 group-hover:rotate-12 transition-transform" />
              <div v-else class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block mr-2" />
              <span v-if="!loading">Generate My Plan</span>
              <span v-else>Thinking...</span>
            </button>
          </div>
        </div>

        <div v-if="plan" class="bg-indigo-600 rounded-3xl lg:rounded-[3.5rem] p-6 lg:p-10 text-white space-y-6 shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
           <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
           <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                 <Lightbulb class="w-6 h-6 text-white" />
              </div>
              <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Success Tip</p>
           </div>
           <p class="text-xl font-bold leading-relaxed tracking-tight relative z-10">{{ plan.recommendation }}</p>
        </div>
      </div>

      <!-- Results Visualization -->
      <div class="lg:col-span-8 space-y-8 lg:space-y-12">
        <!-- Empty State -->
        <div v-if="!plan && !loading" class="bg-white rounded-3xl lg:rounded-[4rem] border border-gray-100 p-10 lg:p-20 text-center animate-fade-in shadow-sm relative overflow-hidden group">
           <div class="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
           <div class="relative z-10">
              <div class="w-24 h-24 lg:w-40 lg:h-40 bg-gray-50 rounded-3xl lg:rounded-[4rem] flex items-center justify-center text-6xl lg:text-8xl mx-auto mb-8 lg:mb-10 shadow-inner transform group-hover:rotate-12 transition-transform duration-700">🍜</div>
              <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Ready when you are!</h3>
              <p class="text-sm font-bold text-gray-400 max-w-xs mx-auto">Set your budget and meal frequency on the left to generate your personalized campus meal plan.</p>
           </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="loading" class="space-y-6 lg:space-y-8">
           <div v-for="i in 3" :key="i" class="h-40 lg:h-48 bg-gray-50 rounded-3xl lg:rounded-[4rem] border border-gray-100 animate-pulse" />
        </div>

        <!-- Generated Plan -->
        <div v-if="plan" class="space-y-12 lg:space-y-16 animate-fade-in pb-20">
           <div class="space-y-6 lg:space-y-8">
              <div class="flex items-center gap-6 px-4">
                 <h3 class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Recommended Menu</h3>
                 <div class="flex-1 h-px bg-gray-100" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div 
                  v-for="dayPlan in plan.cookedMealPlan" 
                  :key="dayPlan.day"
                  class="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3.5rem] border border-gray-100 shadow-sm space-y-6 lg:space-y-8 group hover:shadow-lg transition-all duration-500 border-b-[8px] lg:border-b-[12px] border-b-gray-50"
                >
                  <div class="flex justify-between items-center">
                     <div class="px-5 py-2 bg-parentPrimary/5 rounded-full">
                        <span class="text-[11px] font-bold text-parentPrimary uppercase tracking-widest">Day {{ dayPlan.day }}</span>
                     </div>
                     <span class="text-2xl font-bold text-gray-900 tracking-tight">₦{{ dayPlan.dailyCost }}</span>
                  </div>

                  <div class="space-y-4">
                    <div v-for="meal in dayPlan.meals" :key="meal.type" class="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl group/item hover:bg-gray-900 transition-colors duration-500">
                       <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover/item:bg-white/10 group-hover/item:text-white transition-all transform group-hover/item:rotate-12">
                         <span v-if="meal.type === 'breakfast'" class="text-2xl">☀️</span>
                         <span v-else-if="meal.type === 'lunch'" class="text-2xl">🍛</span>
                         <span v-else class="text-2xl">🌙</span>
                       </div>
                       <div class="flex-1 min-w-0">
                          <p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover/item:text-white/50 mb-1">{{ meal.type }}</p>
                          <p class="text-sm font-bold truncate tracking-tight text-gray-900 group-hover/item:text-white">{{ meal.options.map((o: any) => o.product.name).join(' + ') }}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>

           <!-- Savings Module -->
           <div class="bg-gray-900 rounded-3xl lg:rounded-[5rem] p-8 lg:p-16 text-white relative overflow-hidden group shadow-xl border-b-[8px] lg:border-b-[20px] border-gray-800">
              <div class="absolute -right-40 -top-40 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-parentPrimary/10 rounded-full blur-[100px] lg:blur-[150px] group-hover:scale-125 transition-transform duration-1000 hidden md:block" />
              <div class="relative z-10 flex flex-col md:flex-row items-center gap-10 lg:gap-16">
                 <div class="flex-1 space-y-6 lg:space-y-8 text-center md:text-left">
                    <div class="inline-flex px-4 py-2 bg-emerald-500 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-md">Market Savings</div>
                    <h3 class="text-4xl lg:text-5xl font-bold tracking-tight leading-[1]">Grocery <br class="hidden sm:block" /><span class="text-parentPrimary">Efficiency.</span></h3>
                    <p class="text-gray-400 font-bold tracking-tight text-lg lg:text-xl max-w-sm mx-auto md:mx-0">Save up to ₦{{ plan.savings.toLocaleString() }} by shopping at the local market.</p>
                 </div>
                 <div class="flex flex-col items-center">
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Plan Duration</p>
                    <div class="w-32 h-32 lg:w-48 lg:h-48 rounded-3xl lg:rounded-[3.5rem] bg-white bg-opacity-5 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center p-6 lg:p-8 group-hover:scale-110 transition-transform duration-700">
                       <p class="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-none mb-1 lg:mb-2">{{ plan.rawMaterialsPlan.daysSupported }}</p>
                       <p class="text-[10px] lg:text-xs font-bold text-parentPrimary uppercase tracking-widest">Days</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wallet, UtensilsCrossed, Zap, Lightbulb, ChefHat } from 'lucide-vue-next';
import { ref } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'student'
})

const budget = ref(5000);
const mealsPerDay = ref(3);
const loading = ref(false);
const plan = ref<any>(null);

const generatePlan = async () => {
  if (budget.value < 500) {
    alert('Please enter a budget of at least ₦500');
    return;
  }
  
  loading.value = true;
  try {
    const res = await api.get<any>(`/meal-planner?budget=${budget.value}&mealsPerDay=${mealsPerDay.value}`);
    plan.value = res.data;
  } catch (e) {
    console.error(e);
    alert('Failed to generate plan. Please check your budget and try again.');
  } finally {
    loading.value = false;
  }
};

useHead({ 
  title: 'Meal Planner - Errandr',
  meta: [
    { name: 'description', content: 'Generate a personalized student meal plan based on your campus budget.' }
  ]
});
</script>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(5deg); }
}
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
