```
<template>
  <div class="min-h-screen bg-[#FAFAFA] pb-32 font-sans selection:bg-parentPrimary/10 selection:text-parentPrimary">

    <main class="max-w-7xl mx-auto px-0 sm:px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Sidebar Configuration -->
      <aside class="lg:col-span-4 space-y-6 print:hidden">
        <div class="bg-white p-5 sm:p-8 rounded-none sm:rounded-[2.5rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm space-y-8 relative overflow-hidden group">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-parentPrimary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div class="relative z-10 space-y-8">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2 lowercase">
                <Wallet class="w-4 h-4 text-parentPrimary" /> weekly budget
              </label>
              <div class="relative group/field">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 group-focus-within/field:text-parentPrimary transition-colors">₦</span>
                <input 
                  v-model="formattedBudget"
                  type="text"
                  placeholder="0.00"
                  class="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-parentPrimary/30 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2 lowercase">
                <ChefHat class="w-4 h-4 text-parentPrimary" /> meals per day
              </label>
              <div class="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                <button 
                  v-for="i in 3" 
                  :key="i"
                  @click="mealsPerDay = i"
                  class="flex-1 py-3 rounded-xl text-sm font-medium transition-all lowercase"
                  :class="mealsPerDay === i ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'"
                >
                  {{ i }} meal{{ i > 1 ? 's' : '' }}
                </button>
              </div>
            </div>

            <button 
              @click="generatePlan"
              :disabled="loading"
              class="w-full py-3.5 bg-gray-900 text-white rounded-[1.8rem] text-base font-medium lowercase shadow-lg hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Zap v-if="!loading" class="w-4 h-4 inline-block mr-2 group-hover:rotate-12 transition-transform" />
              <div v-else class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block mr-2" />
              <span v-if="!loading">optimize my plan</span>
              <span v-else>processing...</span>
            </button>
          </div>
        </div>

        <!-- Budget Health Stats -->
        <div v-if="plan" class="bg-gray-900 rounded-none sm:rounded-[2.5rem] p-5 sm:p-8 text-white space-y-6 shadow-none sm:shadow-xl relative overflow-hidden group">
          <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div class="relative z-10 space-y-4">
            <h4 class="text-sm font-medium text-parentPrimary lowercase">intelligence report</h4>
            <p class="text-lg font-bold leading-snug tracking-tight lowercase">{{ plan.recommendation }}</p>
            <div class="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <p class="text-sm font-medium text-gray-500 lowercase leading-none mb-1">potential savings</p>
                <p class="text-3xl font-medium text-emerald-400 leading-none">₦{{ plan.savings.toLocaleString() }}</p>
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
        <div v-if="!plan && !loading" class="bg-white rounded-none sm:rounded-[3rem] border-0 sm:border border-gray-100 p-6 sm:p-12 lg:p-24 text-center shadow-none sm:shadow-sm relative overflow-hidden group">
          <div class="relative z-10 max-w-sm mx-auto">
            <div class="w-32 h-32 lg:w-40 lg:h-40 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-6xl lg:text-7xl mx-auto mb-10 shadow-inner transform group-hover:rotate-3 transition-transform duration-700">🍛</div>
            <h3 class="text-3xl font-medium text-gray-900 mb-4 tracking-tighter lowercase">your table is set.</h3>
            <p class="text-sm font-bold text-gray-400 leading-relaxed mb-10 lowercase">generate a personalized meal plan tailored to your budget and favorite campus vendors.</p>
            <div class="flex items-center gap-4 justify-center">
              <div v-for="i in 3" :key="i" class="w-3 h-3 rounded-full bg-parentPrimary/20"></div>
            </div>
          </div>
        </div>

        <!-- Better Loading State -->
        <div v-if="loading" class="space-y-6">
           <div v-for="i in 3" :key="i" class="bg-white p-5 sm:p-10 rounded-none sm:rounded-[3rem] border-0 sm:border border-gray-50 space-y-6">
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
          <div class="flex items-center justify-between px-4 sm:px-2">
            <div>
              <h3 class="text-xl sm:text-2xl font-medium text-gray-900 tracking-tight lowercase">weekly roadmap</h3>
              <p class="text-sm font-medium text-gray-400 lowercase">optimized for market & campus dining</p>
            </div>
            <div class="flex items-center gap-2 print:hidden">
               <button @click="downloadPdf" class="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium lowercase shadow-sm hover:shadow-md transition-all">download pdf</button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              v-for="dayPlan in plan.cookedMealPlan" 
              :key="dayPlan.day"
              class="bg-white p-5 sm:p-8 rounded-none sm:rounded-[2.5rem] border-0 sm:border border-gray-100 shadow-none sm:shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between"
            >
              <div class="space-y-6">
                <div class="flex justify-between items-center pb-6 border-b border-gray-50">
                  <div class="px-4 py-1.5 bg-gray-900 text-white rounded-xl">
                    <span class="text-sm font-medium lowercase">day {{ dayPlan.day }}</span>
                  </div>
                  <span class="text-xl font-medium text-gray-900 tracking-tighter">₦{{ dayPlan.dailyCost.toLocaleString() }}</span>
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
                      <p class="text-sm font-medium text-gray-400 lowercase mb-0.5 group-hover/item:text-parentPrimary">{{ meal.type }}</p>
                      <p class="text-sm font-bold text-gray-900 truncate tracking-tight">{{ meal.options.map((o: any) => o.product.name).join(' + ') }}</p>
                    </div>
                    <ArrowUpRight class="w-4 h-4 text-gray-300 group-hover/item:text-parentPrimary opacity-0 group-hover/item:opacity-100 transition-all" />
                  </div>
                </div>
              </div>

              <div class="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p class="text-sm font-medium text-gray-400 lowercase">total value & nutrition</p>
                <div class="flex flex-wrap gap-1.5">
                   <span 
                     v-for="nutrient in getDayNutrients(dayPlan)" 
                     :key="nutrient"
                     :class="getNutrientClass(nutrient)"
                     class="px-2.5 py-1 rounded-lg text-xs font-medium border"
                   >
                     {{ nutrient }}
                   </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Market Efficiency CTA -->
          <div class="bg-parentPrimary rounded-none sm:rounded-[3.5rem] p-6 sm:p-10 lg:p-16 text-white text-center relative overflow-hidden group shadow-none sm:shadow-2xl shadow-parentPrimary/40">
            <div class="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent"></div>
            <div class="relative z-10 max-w-lg mx-auto space-y-6">
              <h3 class="text-2xl sm:text-4xl font-medium tracking-tighter leading-none lowercase">market vs mama-put</h3>
              <p class="text-white/80 font-medium text-sm sm:text-base leading-relaxed lowercase">save up to 40% of your budget by sourcing raw materials for your cooked meals. we've mapped out the best spots for you.</p>
              <div class="flex justify-center flex-wrap gap-4 pt-4">
                <div class="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <p class="text-xs font-medium lowercase opacity-60">shopping days</p>
                  <p class="text-lg font-medium lowercase">weekends</p>
                </div>
                <div class="px-6 py-3 bg-white text-parentPrimary rounded-2xl shadow-xl">
                  <p class="text-xs font-medium lowercase opacity-60 text-parentPrimary/60">estimated savings</p>
                  <p class="text-lg font-medium lowercase">40% total</p>
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
import { Wallet, UtensilsCrossed, Zap, Lightbulb, ChefHat, Target, ArrowUpRight } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { meal_planner_api } from '@/api_factory/modules/meal-planner';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
 layout: 'student'
})

const { showToast } = useCustomToast();
const budget = ref(5000);
const formattedBudget = computed({
  get() {
    if (budget.value === 0 || budget.value === null || budget.value === undefined) return '';
    return budget.value.toLocaleString('en-US');
  },
  set(val) {
    const clean = val.replace(/[^0-9.]/g, '');
    budget.value = clean ? Number(clean) : 0;
  }
});
const mealsPerDay = ref(3);
const loading = ref(false);
const plan = ref<any>(null);
const router = useRouter();

const handleMealClick = (meal: any) => {
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
  const res = await meal_planner_api.generatePlan({ budget: budget.value, mealsPerDay: mealsPerDay.value });
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

const downloadPdf = () => {
  window.print();
};

const getDayNutrients = (dayPlan: any) => {
  const categories = new Set<string>();
  dayPlan.meals.forEach((meal: any) => {
    meal.options.forEach((opt: any) => {
      if (opt.nutritionalCategory) {
        categories.add(opt.nutritionalCategory);
      } else {
        categories.add('others');
      }
    });
  });
  return Array.from(categories);
};

const getNutrientClass = (nutrient: string) => {
  switch (nutrient) {
    case 'carbs': return 'bg-amber-50/80 text-amber-700 border-amber-100/50';
    case 'protein': return 'bg-rose-50/80 text-rose-700 border-rose-100/50';
    case 'vegetables': return 'bg-emerald-50/80 text-emerald-700 border-emerald-100/50';
    case 'drinks': return 'bg-blue-50/80 text-blue-700 border-blue-100/50';
    case 'snacks': return 'bg-purple-50/80 text-purple-700 border-purple-100/50';
    default: return 'bg-gray-50/80 text-gray-700 border-gray-100/50';
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

@media print {
  /* Hide navigation sidebar, mobile/desktop headers, page configs, and buttons */
  aside,
  header,
  .print\:hidden,
  button {
    display: none !important;
  }

  /* Reset main layout margins to fit full printable page width */
  .lg\:ml-60 {
    margin-left: 0 !important;
  }
  
  main {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    display: block !important;
  }

  /* Expand main content column to span full page width */
  section {
    width: 100% !important;
    display: block !important;
  }

  /* Retain high-contrast border definition for card grid items during print */
  .bg-white {
    border: 1px solid #e5e7eb !important;
    box-shadow: none !important;
    border-radius: 1.5rem !important;
    padding: 1.5rem !important;
  }
}
</style>
