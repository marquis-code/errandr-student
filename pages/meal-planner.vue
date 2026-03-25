```
<template>
  <div class="min-h-screen bg-[#FDFDFD] pb-32 font-sans selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <!-- Compact Glassmorphic Header -->
    <header class="sticky top-0 z-30 pt-6 px-4 mb-8">
      <div class="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <div class="flex items-center gap-4">
          <button @click="router.back()" class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-lg font-black text-gray-900 leading-tight">Meal Planner</h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Budget & Nutrition Optimizer</p>
          </div>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-parentPrimary/5 rounded-2xl border border-parentPrimary/10">
          <div class="w-2 h-2 rounded-full bg-parentPrimary animate-pulse"></div>
          <span class="text-[10px] font-black text-parentPrimary uppercase tracking-widest">All systems go</span>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Sidebar Configuration -->
      <aside class="lg:col-span-4 space-y-6">
        <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden group">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-parentPrimary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div class="relative z-10 space-y-8">
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1 flex items-center gap-2 font-black">
                <Wallet class="w-4 h-4 text-parentPrimary" /> Weekly Budget
              </label>
              <div class="relative group/field">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-900 group-focus-within/field:text-parentPrimary transition-colors">₦</span>
                <input 
                  v-model="budget"
                  type="number"
                  placeholder="0.00"
                  class="w-full pl-14 pr-6 py-6 bg-gray-50 border border-gray-100 rounded-[1.8rem] text-2xl font-black tracking-tighter focus:bg-white focus:ring-[12px] focus:ring-parentPrimary/5 outline-none transition-all"
                />
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1 flex items-center gap-2">
                <ChefHat class="w-4 h-4 text-parentPrimary" /> Meals Per Day
              </label>
              <div class="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                <button 
                  v-for="i in 3" 
                  :key="i"
                  @click="mealsPerDay = i"
                  class="flex-1 py-3 rounded-xl text-[10px] font-black tracking-[0.1em] uppercase transition-all"
                  :class="mealsPerDay === i ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'"
                >
                  {{ i }} Meal{{ i > 1 ? 's' : '' }}
                </button>
              </div>
            </div>

            <button 
              @click="generatePlan"
              :disabled="loading"
              class="w-full py-6 bg-gray-900 text-white rounded-[1.8rem] text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl shadow-black/10 hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Zap v-if="!loading" class="w-4 h-4 inline-block mr-2 group-hover:rotate-12 transition-transform" />
              <div v-else class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block mr-2" />
              <span v-if="!loading">Optimize My Plan</span>
              <span v-else>Processing...</span>
            </button>
          </div>
        </div>

        <!-- Budget Health Stats -->
        <div v-if="plan" class="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden group">
          <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div class="relative z-10 space-y-4">
            <h4 class="text-[10px] font-black text-parentPrimary tracking-[0.2em] uppercase">Intelligence Report</h4>
            <p class="text-lg font-bold leading-snug tracking-tight">{{ plan.recommendation }}</p>
            <div class="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">potential savings</p>
                <p class="text-3xl font-black text-emerald-400 leading-none">₦{{ plan.savings.toLocaleString() }}</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Target class="w-6 h-6 text-parentPrimary" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Plan Content -->
      <section class="lg:col-span-8 space-y-8">
        <!-- Empty State -->
        <div v-if="!plan && !loading" class="bg-white rounded-[3rem] border border-gray-100 p-12 lg:p-24 text-center shadow-sm relative overflow-hidden group">
          <div class="relative z-10 max-w-sm mx-auto">
            <div class="w-32 h-32 lg:w-40 lg:h-40 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-6xl lg:text-7xl mx-auto mb-10 shadow-inner transform group-hover:rotate-3 transition-transform duration-700">🍛</div>
            <h3 class="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Your table is set.</h3>
            <p class="text-sm font-bold text-gray-400 leading-relaxed mb-10">Generate a personalized meal plan tailored to your budget and favorite campus vendors.</p>
            <div class="flex items-center gap-4 justify-center">
              <div v-for="i in 3" :key="i" class="w-3 h-3 rounded-full bg-parentPrimary/20"></div>
            </div>
          </div>
        </div>

        <!-- Better Loading State -->
        <div v-if="loading" class="space-y-6">
           <div v-for="i in 3" :key="i" class="bg-white p-10 rounded-[3rem] border border-gray-50 space-y-6">
             <div class="flex justify-between items-center">
               <div class="w-24 h-8 bg-gray-50 rounded-full animate-pulse"></div>
               <div class="w-16 h-8 bg-gray-50 rounded-full animate-pulse"></div>
             </div>
             <div class="space-y-4">
               <div v-for="j in 2" :key="j" class="w-full h-16 bg-gray-50 rounded-2xl animate-pulse"></div>
             </div>
           </div>
        </div>

        <!-- Compact Daily Plan Grid -->
        <div v-if="plan" class="space-y-12 animate-fade-in">
          <div class="flex items-center justify-between px-2">
            <div>
              <h3 class="text-2xl font-black text-gray-900 tracking-tight">Weekly Roadmap</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Optimized for market & campus dining</p>
            </div>
            <div class="flex items-center gap-2">
               <button class="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Download PDF</button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              v-for="dayPlan in plan.cookedMealPlan" 
              :key="dayPlan.day"
              class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between"
            >
              <div class="space-y-6">
                <div class="flex justify-between items-center pb-6 border-b border-gray-50">
                  <div class="px-4 py-1.5 bg-gray-900 text-white rounded-xl">
                    <span class="text-[9px] font-black uppercase tracking-widest">Day {{ dayPlan.day }}</span>
                  </div>
                  <span class="text-xl font-black text-gray-900 tracking-tighter">₦{{ dayPlan.dailyCost.toLocaleString() }}</span>
                </div>

                <div class="space-y-3">
                  <div 
                    v-for="meal in dayPlan.meals" 
                    :key="meal.type"
                    @click="handleMealClick(meal)"
                    class="group/item cursor-pointer flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-parentPrimary/20 hover:bg-parentPrimary/[0.02] transition-all"
                  >
                    <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-500">
                      <span v-if="meal.type === 'breakfast'">🍳</span>
                      <span v-else-if="meal.type === 'lunch'">🍛</span>
                      <span v-else>🍗</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 group-hover/item:text-parentPrimary">{{ meal.type }}</p>
                      <p class="text-xs font-bold text-gray-900 truncate tracking-tight">{{ meal.options.map((o: any) => o.product.name).join(' + ') }}</p>
                    </div>
                    <ArrowUpRight class="w-4 h-4 text-gray-300 group-hover/item:text-parentPrimary opacity-0 group-hover/item:opacity-100 transition-all" />
                  </div>
                </div>
              </div>

              <div class="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total value & nutrition</p>
                <div class="flex -space-x-3">
                   <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm">
                     <img :src="`https://i.pravatar.cc/100?u=${dayPlan.day}${i}`" class="w-full h-full object-cover" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Market Efficiency CTA -->
          <div class="bg-parentPrimary rounded-[3.5rem] p-10 lg:p-16 text-white text-center relative overflow-hidden group shadow-2xl shadow-parentPrimary/40">
            <div class="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent"></div>
            <div class="relative z-10 max-w-lg mx-auto space-y-6">
              <h3 class="text-4xl font-black tracking-tighter leading-none">Market vs Mama-Put</h3>
              <p class="text-white/80 font-bold text-base leading-relaxed">Save up to 40% of your budget by sourcing raw materials for your cooked meals. We've mapped out the best spots for you.</p>
              <div class="flex justify-center flex-wrap gap-4 pt-4">
                <div class="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <p class="text-[9px] font-black uppercase tracking-widest opacity-60">shopping days</p>
                  <p class="text-xl font-black">Weekends</p>
                </div>
                <div class="px-6 py-3 bg-white text-parentPrimary rounded-2xl shadow-xl">
                  <p class="text-[9px] font-black uppercase tracking-widest opacity-60 text-parentPrimary/60">Estimated savings</p>
                  <p class="text-xl font-black">40% Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Wallet, UtensilsCrossed, Zap, Lightbulb, ChefHat, ChevronLeft, Target, ArrowUpRight } from 'lucide-vue-next';
import { ref } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
 layout: 'student'
})

const { showToast } = useCustomToast();
const budget = ref(5000);
const mealsPerDay = ref(3);
const loading = ref(false);
const plan = ref<any>(null);
const router = useRouter();

const handleMealClick = (meal: any) => {
  // Extract vendor ID from the first option's product
  const vendorId = meal.options?.[0]?.product?.vendor?._id || meal.options?.[0]?.product?.vendor;
  if (vendorId) {
    router.push(`/vendors/${vendorId}`);
  }
};

const generatePlan = async () => {
 if (budget.value < 500) {
 showToast({
   title: 'Insufficient Budget',
   message: 'Please enter a budget of at least ₦500',
   toastType: 'warning'
 });
 return;
 }
 
 loading.value = true;
 try {
 const res = await api.get<any>(`/meal-planner?budget=${budget.value}&mealsPerDay=${mealsPerDay.value}`);
 plan.value = res.data;
 } catch (e) {
 console.error(e);
 showToast({
    title: 'Optimization Failed',
    message: 'Could not generate plan. Please try again.',
    toastType: 'error'
  });
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
