<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] bg-[#fafafa] flex flex-col overflow-hidden animate-slide-up">
      <!-- Header -->
      <header class="bg-white border-b border-gray-100/60 shrink-0">
        <div class="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <button @click="handleBack" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ArrowLeft class="w-5 h-5 text-gray-700" />
          </button>
          
          <div class="flex items-center gap-2 md:gap-4 text-xs font-bold text-gray-400">
            <span :class="{'text-gray-900': step === 'services'}">Services</span>
            <ChevronRight class="w-3 h-3" />
            <span :class="{'text-gray-900': step === 'time'}">Time</span>
            <ChevronRight class="w-3 h-3" />
            <span :class="{'text-gray-900': step === 'confirm'}">Confirm</span>
          </div>

          <button @click="$emit('close')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <X class="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1400px] mx-auto px-4 md:px-6 py-5 lg:py-8 flex flex-col lg:flex-row gap-6 lg:gap-16 pb-44 lg:pb-8">
          
          <!-- LEFT COLUMN (Dynamic steps) -->
          <div class="flex-1 max-w-3xl">
            
            <!-- STEP 1: SERVICES -->
            <div v-show="step === 'services'" class="space-y-5">
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Select services</h1>
              
              <!-- Category Pills -->
              <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                  v-for="cat in categories" 
                  :key="cat"
                  @click="activeCategory = cat"
                  class="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border-[0.5px] transition-all"
                  :class="activeCategory === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200/80 hover:border-gray-300'"
                >
                  {{ cat }}
                </button>
              </div>

              <!-- Services List -->
              <div class="space-y-2.5">
                <div 
                  v-for="service in filteredServices" 
                  :key="service._id"
                  class="bg-white p-4 rounded-xl border border-gray-100/80 transition-all flex justify-between gap-4"
                >
                  <div>
                    <h3 class="font-bold text-gray-900 text-sm">{{ service.name }}</h3>
                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ service.variants?.length ? `${service.durationInMinutes} – ${Math.max(...service.variants.map((v:any)=>v.durationInMinutes))} mins` : `${service.durationInMinutes} mins` }}
                    </p>
                    <p class="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed max-w-xl">{{ service.description }}</p>
                    <p class="text-sm font-bold text-gray-900 mt-3">
                      {{ service.variants?.length ? 'from ' : '' }}NGN {{ service.price.toLocaleString() }}
                    </p>
                  </div>
                  <button 
                    @click="handleAddClick(service)"
                    class="w-9 h-9 rounded-full border border-gray-200/80 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0 self-center"
                  >
                    <Plus class="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <!-- Mobile: Cart preview on services step -->
              <div v-if="cart.length" class="lg:hidden bg-white rounded-xl border border-gray-100/80 overflow-hidden mt-4">
                <div class="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                  <span class="text-xs font-bold text-gray-500">Cart ({{ cart.length }})</span>
                  <span class="text-xs font-bold text-gray-900">NGN {{ cartTotal.toLocaleString() }}</span>
                </div>
                <div class="px-4 py-2.5 space-y-2">
                  <div v-for="(item, idx) in cart" :key="idx" class="flex justify-between items-center text-xs">
                    <div class="flex-1">
                      <span class="font-semibold text-gray-900">{{ item.variantName || item.service.name }}</span>
                      <span class="text-gray-400 ml-1">· {{ item.durationInMinutes }}m</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-gray-900">NGN {{ getItemTotal(item).toLocaleString() }}</span>
                      <button @click="removeFromCart(idx)" class="text-rose-400 hover:text-rose-600 font-bold text-[10px]">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 2: TIME -->
            <div v-show="step === 'time'" class="space-y-5 animate-fade-in">
              <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Select date & time</h1>
                <div class="relative">
                  <button @click="showCalendar = !showCalendar" class="w-9 h-9 rounded-full border-[0.5px] border-gray-200/80 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                    <Calendar class="w-4 h-4 text-gray-500"/>
                  </button>
                  
                  <!-- Custom Calendar Dropdown -->
                  <div v-if="showCalendar" class="absolute right-0 top-12 w-[280px] bg-white rounded-xl border-[0.5px] border-gray-100/80 p-4 z-50" style="box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                    <div class="flex justify-between items-center mb-3">
                      <h3 class="font-bold text-gray-900 text-sm">{{ formatMonthYear(calendarDate) }}</h3>
                      <div class="flex gap-1">
                        <button @click="prevMonth" class="p-1.5 hover:bg-gray-50 rounded-full transition-colors"><ChevronLeft class="w-4 h-4"/></button>
                        <button @click="nextMonth" class="p-1.5 hover:bg-gray-50 rounded-full transition-colors"><ChevronRight class="w-4 h-4"/></button>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-1 mb-2">
                      <span v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="text-[10px] font-bold text-gray-400 text-center uppercase">{{d}}</span>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-1">
                      <div v-for="blank in blankDays" :key="'blank-'+blank" class="h-8"></div>
                      <button 
                        v-for="day in daysInMonth" :key="day"
                        @click="selectDateFromCalendar(day)"
                        class="h-8 w-full rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        :class="getCalendarDayClass(day)"
                      >
                        {{ day }}
                      </button>
                    </div>
                    
                    <div class="mt-3 flex justify-between border-t border-gray-50 pt-3">
                      <button @click="selectedDate = ''; showCalendar = false" class="text-xs font-bold text-gray-400 hover:text-gray-600">Clear</button>
                      <button @click="goToToday" class="text-xs font-bold text-parentPrimary hover:brightness-110">Today</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <h3 class="font-semibold text-gray-900 text-sm">Select a date</h3>
                <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button 
                    v-for="date in availableDates" 
                    :key="date.iso"
                    @click="selectedDate = date.iso"
                    class="min-w-[60px] h-[70px] rounded-full flex flex-col items-center justify-center border-[0.5px] transition-all shrink-0"
                    :class="selectedDate === date.iso ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200/60 hover:border-gray-300'"
                  >
                    <span class="text-[10px] font-medium opacity-70">{{ date.dayStr }}</span>
                    <span class="text-lg font-bold mt-0.5">{{ date.dayNum }}</span>
                    <span class="text-[9px] font-medium opacity-70">{{ date.monthStr }}</span>
                  </button>
                </div>
              </div>

              <div class="space-y-3">
                <h3 class="font-semibold text-gray-900 text-sm">Pick a time</h3>
                <div v-if="availableTimes.length" class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto pr-1">
                  <button 
                    v-for="time in availableTimes" 
                    :key="time"
                    @click="selectedTime = time"
                    class="text-center px-3 py-2.5 rounded-full border-[0.5px] transition-all text-sm font-semibold"
                    :class="selectedTime === time ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200/60 text-gray-700 hover:border-gray-300'"
                  >
                    {{ time }}
                  </button>
                </div>
                <div v-else class="text-sm text-gray-400 py-6 text-center bg-white rounded-full border-[0.5px] border-gray-100/80">
                  No availability on this date.
                </div>
              </div>
            </div>

            <!-- STEP 3: CONFIRM -->
            <div v-show="step === 'confirm'" class="space-y-4 animate-fade-in max-w-xl mx-auto lg:mx-0">
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Confirm & Pay</h1>
              
              <!-- Mobile Cart Summary -->
              <div class="lg:hidden bg-white rounded-xl border-[0.5px] border-gray-100 overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <video v-if="vendor.logo && vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                    <img v-else :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-900 text-xs">{{ vendor.storeName }}</h3>
                    <p class="text-[11px] text-gray-400 mt-0.5">{{ formatDate(selectedDate) }} · {{ selectedTime }}</p>
                  </div>
                </div>
                <div class="px-4 py-2.5 space-y-2">
                  <div v-for="(item, idx) in cart" :key="idx" class="flex justify-between items-center">
                    <div class="flex-1">
                      <p class="text-xs font-semibold text-gray-900">{{ item.variantName || item.service.name }}</p>
                      <p class="text-[10px] text-gray-400">{{ item.durationInMinutes }}m{{ item.variantName ? ` · ${item.service.name}` : '' }}</p>
                      <div v-if="item.extras?.length" class="mt-1 space-y-0.5">
                        <div v-for="ext in item.extras" :key="ext.name" class="flex justify-between text-[10px] text-gray-400">
                          <span>+ {{ ext.name }}</span>
                          <span>₦{{ ext.price.toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                    <span class="text-xs font-bold text-gray-900 ml-3">₦{{ getItemTotal(item).toLocaleString() }}</span>
                  </div>
                </div>
                <div class="px-4 py-3 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
                  <span class="text-sm font-bold text-gray-900">Total</span>
                  <span class="text-sm font-bold text-parentPrimary">NGN {{ cartTotal.toLocaleString() }}</span>
                </div>
              </div>

              <div class="bg-white p-4 rounded-xl border-[0.5px] border-gray-100 space-y-3">
                <h3 class="font-semibold text-gray-900 text-sm">Booking Notes</h3>
                <textarea 
                  v-model="bookingNotes" 
                  rows="2" 
                  placeholder="Any special requests?"
                  class="w-full bg-gray-50 border border-gray-100/80 rounded-lg p-3 text-base outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary/20 transition-all resize-none"
                ></textarea>
              </div>

              <!-- Payment Method -->
              <div class="bg-white p-4 rounded-xl border border-gray-100/80">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <CreditCard class="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 text-xs">Payment via Paystack</h3>
                    <p class="text-[11px] text-gray-400 mt-0.5">Secure redirect to Paystack checkout.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN (Cart Summary) -->
          <div class="hidden lg:block w-[400px] shrink-0">
            <div class="sticky top-8 bg-white rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-8rem)] border border-gray-100/80">
              
              <!-- Vendor Info -->
              <div class="p-6 border-b border-gray-50 flex gap-4 items-center shrink-0">
                <div class="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  <video v-if="vendor.logo && vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                  <img v-else :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 truncate">{{ vendor.storeName }}</h3>
                  <div class="flex items-center gap-1 text-xs font-bold text-gray-900 mt-1">
                    {{ vendor.rating?.toFixed(1) || '5.0' }} <Star class="w-3 h-3 text-amber-400 fill-amber-400" /> 
                    <span class="text-gray-400 font-normal">({{ vendor.totalRatings || 0 }})</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5 truncate">{{ vendor.address }}</p>
                </div>
              </div>

              <!-- Selected Time (if Time step passed) -->
              <div v-if="selectedDate && selectedTime && step !== 'services'" class="p-6 border-b border-gray-50 bg-gray-50/50 shrink-0 space-y-2">
                <div class="flex items-center gap-3 text-sm text-gray-900 font-medium">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  {{ formatDate(selectedDate) }}
                </div>
                <div class="flex items-center gap-3 text-sm text-gray-900 font-medium">
                  <Clock class="w-4 h-4 text-gray-400" />
                  {{ selectedTime }} ({{ totalDurationMins }} mins duration)
                </div>
              </div>

              <!-- Cart Items -->
              <div class="flex-1 overflow-y-auto p-6 space-y-4">
                <template v-if="cart.length">
                  <div v-for="(item, idx) in cart" :key="idx" class="flex justify-between items-start gap-4">
                    <div class="flex-1">
                      <p class="text-sm font-bold text-gray-900">{{ item.variantName ? item.variantName : item.service.name }}</p>
                      <p class="text-xs text-gray-500 font-medium mt-0.5">{{ item.durationInMinutes }} mins {{ item.variantName ? `with ${item.service.name}` : '' }}</p>
                      
                      <!-- Extras -->
                      <div v-if="item.extras?.length" class="mt-2 space-y-1">
                        <div v-for="ext in item.extras" :key="ext.name" class="flex justify-between text-xs text-gray-500">
                          <span>+ {{ ext.name }}</span>
                          <span class="font-medium">NGN {{ ext.price.toLocaleString() }}</span>
                        </div>
                      </div>
                      
                      <button @click="removeFromCart(idx)" class="text-[10px] font-bold text-rose-500 hover:underline mt-2">Remove</button>
                    </div>
                    <span class="text-sm font-bold text-gray-900">NGN {{ getItemTotal(item).toLocaleString() }}</span>
                  </div>
                </template>
                <div v-else class="text-sm text-gray-500 py-4">No services selected</div>
              </div>

              <!-- Footer -->
              <div class="p-4 border-t border-gray-100 bg-white shrink-0">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold text-gray-900">Total</span>
                  <span class="font-bold text-gray-900 text-lg">{{ cart.length ? `NGN ${cartTotal.toLocaleString()}` : 'free' }}</span>
                </div>
                <button 
                  @click="handleContinue"
                  :disabled="!canContinue"
                  class="w-full py-3 bg-[#1a1a1a] text-white rounded-xl font-bold text-sm shadow-md hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
                  <template v-else>Continue <ArrowRight class="w-4 h-4" /></template>
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      <!-- Mobile Footer (Always visible on mobile) -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100/60 px-4 py-3 z-50 flex flex-col gap-1.5">
        <div v-if="cart.length && step !== 'confirm'" class="flex justify-between items-center px-1 pb-0.5">
          <span class="text-[11px] font-semibold text-gray-400">{{ cart.length }} service(s)</span>
          <span class="text-sm font-bold text-gray-900">NGN {{ cartTotal.toLocaleString() }}</span>
        </div>
        <button 
          @click="handleContinue"
          :disabled="!canContinue"
          class="w-full py-3 bg-[#1a1a1a] text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <template v-else-if="step === 'confirm'">Pay NGN {{ cartTotal.toLocaleString() }} <ArrowRight class="w-4 h-4" /></template>
          <template v-else>Continue <ArrowRight class="w-4 h-4" /></template>
        </button>
      </div>

      <!-- Full Screen Loading Overlay -->
      <div v-if="showFullLoadingOverlay" class="fixed inset-0 z-[200] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
        <div class="relative w-24 h-24 flex items-center justify-center">
          <div class="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div class="absolute inset-0 border-[3px] border-parentPrimary rounded-full border-t-transparent animate-spin"></div>
          <div class="w-12 h-12 bg-parentPrimary/10 rounded-full flex items-center justify-center animate-pulse">
            <CreditCard class="w-6 h-6 text-parentPrimary" />
          </div>
        </div>
        <h2 class="mt-8 text-2xl font-bold text-gray-900 tracking-tight animate-pulse">Securing your booking</h2>
        <p class="text-sm text-gray-500 mt-2 font-medium">Preparing secure checkout via Paystack...</p>
      </div>

      <!-- Modals -->
      <VariantSelectionModal 
        v-if="showVariantModal" 
        :service="selectedServiceToAdd" 
        @close="showVariantModal = false"
        @add="handleAddServiceToCart"
      />

      <ExtraServiceModal 
        v-if="showExtraModal" 
        :service="cart[cart.length - 1]?.service" 
        @close="handleExtraModalClose"
        @add="handleAddExtraToLastItem"
      />

      <CheckoutAuthModal
        v-model="showAuthModal"
        @authenticated="processBooking"
        @guest-checkout="processGuestBooking"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Calendar, Plus, Clock, MapPin, Star, ArrowRight, Loader2, CreditCard } from 'lucide-vue-next';
import { appointments_api } from '@/api_factory/modules/appointments';
import VariantSelectionModal from './VariantSelectionModal.vue';
import ExtraServiceModal from './ExtraServiceModal.vue';
import CheckoutAuthModal from '@/components/CheckoutAuthModal.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useUser } from '@/composables/modules/auth/user';

const props = defineProps<{
  vendor: any;
  services: any[];
  initialService?: any;
}>();

const emit = defineEmits(['close']);
const { showToast } = useCustomToast();
const { user } = useUser();

const step = ref<'services'|'time'|'confirm'>('services');
const loading = ref(false);
const showFullLoadingOverlay = ref(false);
const activeCategory = ref('Featured');
const bookingNotes = ref('');

// Cart State
const cart = ref<any[]>([]);

// Modals State
const showVariantModal = ref(false);
const selectedServiceToAdd = ref<any>(null);
const showExtraModal = ref(false);
const showAuthModal = ref(false);

// Date/Time State
const selectedDate = ref('');
const selectedTime = ref('');

// Guest State
const guestData = ref<any>(null);

// Computed
const categories = computed(() => {
  const cats = ['Featured'];
  props.services.forEach(s => {
    if (s.category && !cats.includes(s.category)) cats.push(s.category);
  });
  return cats;
});

const filteredServices = computed(() => {
  if (activeCategory.value === 'Featured') return props.services.slice(0, 5);
  return props.services.filter(s => s.category === activeCategory.value);
});

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + getItemTotal(item), 0);
});

const totalDurationMins = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.durationInMinutes + (item.extras?.reduce((s:number, e:any)=>s+e.durationInMinutes,0)||0), 0);
});

const canContinue = computed(() => {
  if (step.value === 'services') return cart.value.length > 0;
  if (step.value === 'time') return !!selectedDate.value && !!selectedTime.value;
  if (step.value === 'confirm') return true;
  return false;
});

// Methods
const handleBack = () => {
  if (step.value === 'confirm') step.value = 'time';
  else if (step.value === 'time') step.value = 'services';
  else emit('close');
};

const handleAddClick = (service: any) => {
  if (service.variants && service.variants.length > 0) {
    selectedServiceToAdd.value = service;
    showVariantModal.value = true;
  } else {
    // Add base service
    cart.value.push({
      service,
      variantName: '',
      price: service.price,
      durationInMinutes: service.durationInMinutes,
      extras: []
    });
    checkExtrasAndPrompt(service);
  }
};

const handleAddServiceToCart = (payload: any) => {
  cart.value.push(payload);
  showVariantModal.value = false;
  checkExtrasAndPrompt(payload.service);
};

const checkExtrasAndPrompt = (service: any) => {
  if (service.extras && service.extras.length > 0) {
    showExtraModal.value = true;
  }
};

const handleExtraModalClose = () => {
  showExtraModal.value = false;
};

const handleAddExtraToLastItem = (extra: any) => {
  const lastItem = cart.value[cart.value.length - 1];
  if (lastItem) {
    lastItem.extras.push(extra);
  }
  showExtraModal.value = false;
};

const removeFromCart = (idx: number) => {
  cart.value.splice(idx, 1);
};

const getItemTotal = (item: any) => {
  let total = item.price;
  if (item.extras) {
    total += item.extras.reduce((sum: number, ext: any) => sum + ext.price, 0);
  }
  return total;
};

// Date Generation
const availableDates = computed(() => {
  const dates = [];
  let baseDate = new Date();
  
  if (selectedDate.value) {
    const [y, m, d] = selectedDate.value.split('-');
    baseDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }

  for(let i=0; i<14; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    dates.push({
      iso: `${year}-${month}-${day}`,
      dayStr: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthStr: d.toLocaleDateString('en-US', { month: 'short' })
    });
  }
  return dates;
});

// Custom Calendar Logic
const showCalendar = ref(false);
const calendarDate = ref(new Date());

const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const prevMonth = () => {
  calendarDate.value = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  calendarDate.value = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() + 1, 1);
};

const goToToday = () => {
  calendarDate.value = new Date();
  selectDateFromCalendar(calendarDate.value.getDate(), calendarDate.value.getMonth(), calendarDate.value.getFullYear());
};

const blankDays = computed(() => {
  const firstDay = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth(), 1).getDay();
  return firstDay;
});

const daysInMonth = computed(() => {
  return new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() + 1, 0).getDate();
});

const selectDateFromCalendar = (day: number, month?: number, year?: number) => {
  const y = year ?? calendarDate.value.getFullYear();
  const m = month ?? calendarDate.value.getMonth();
  const d = new Date(y, m, day);
  
  const isoYear = d.getFullYear();
  const isoMonth = String(d.getMonth() + 1).padStart(2, '0');
  const isoDay = String(d.getDate()).padStart(2, '0');
  
  selectedDate.value = `${isoYear}-${isoMonth}-${isoDay}`;
  showCalendar.value = false;
};

const getCalendarDayClass = (day: number) => {
  const d = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth(), day);
  const isoYear = d.getFullYear();
  const isoMonth = String(d.getMonth() + 1).padStart(2, '0');
  const isoDay = String(d.getDate()).padStart(2, '0');
  const iso = `${isoYear}-${isoMonth}-${isoDay}`;
  
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  if (selectedDate.value === iso) return 'bg-parentPrimary text-white shadow-md font-bold';
  if (todayIso === iso) return 'bg-gray-100 text-gray-900 font-bold border border-gray-200';
  return 'text-gray-600 hover:bg-gray-50 border border-transparent';
};

const availableTimes = computed(() => {
  // Mock times between 9am and 5pm
  const times = [];
  for(let i=9; i<=17; i++) {
    times.push(`${i > 12 ? i-12 : i}:00 ${i >= 12 ? 'pm' : 'am'}`);
    if (i !== 17) {
      times.push(`${i > 12 ? i-12 : i}:30 ${i >= 12 ? 'pm' : 'am'}`);
    }
  }
  return times;
});

const formatDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
};

// Submission
const handleContinue = async () => {
  if (step.value === 'services') {
    step.value = 'time';
  } else if (step.value === 'time') {
    step.value = 'confirm';
  } else if (step.value === 'confirm') {
    if (!user.value) {
      showAuthModal.value = true;
      return;
    }
    await processBooking();
  }
};

const processBooking = async () => {
  loading.value = true;
  showFullLoadingOverlay.value = true;
  try {
    // Calculate end time
    const [timeStr, modifier] = selectedTime.value.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    
    const endD = new Date(selectedDate.value);
    endD.setHours(hours, minutes + totalDurationMins.value);
    const endTime = `${endD.getHours().toString().padStart(2, '0')}:${endD.getMinutes().toString().padStart(2, '0')}`;
    
    const startTime24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const payload = {
      vendor: props.vendor._id,
      scheduledDate: selectedDate.value,
      startTime: startTime24,
      endTime: endTime,
      notes: bookingNotes.value,
      items: cart.value.map(item => ({
        service: item.service._id,
        variantName: item.variantName,
        price: item.price,
        durationInMinutes: item.durationInMinutes,
        extras: item.extras?.map((e:any) => ({ name: e.name, price: e.price, durationInMinutes: e.durationInMinutes }))
      }))
    };

    const res = await appointments_api.createAppointment(payload);
    if (res.data?.authorization_url) {
      window.location.href = res.data.authorization_url;
    } else {
      showToast({ title: 'Success', message: 'Appointment submitted successfully.', toastType: 'success' });
      emit('close');
    }
  } catch (e: any) {
    showFullLoadingOverlay.value = false;
    showToast({ title: 'Error', message: e.response?.data?.message || 'Payment initialization failed', toastType: 'error' });
  } finally {
    loading.value = false;
  }
};

const processGuestBooking = async (guestDetails: any) => {
  guestData.value = guestDetails;
  loading.value = true;
  showFullLoadingOverlay.value = true;
  showAuthModal.value = false;
  try {
    // Calculate end time
    const [timeStr, modifier] = selectedTime.value.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    
    const endD = new Date(selectedDate.value);
    endD.setHours(hours, minutes + totalDurationMins.value);
    const endTime = `${endD.getHours().toString().padStart(2, '0')}:${endD.getMinutes().toString().padStart(2, '0')}`;
    
    const startTime24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const payload = {
      vendor: props.vendor._id,
      scheduledDate: selectedDate.value,
      startTime: startTime24,
      endTime: endTime,
      notes: bookingNotes.value,
      guestInfo: guestData.value,
      items: cart.value.map(item => ({
        service: item.service._id,
        variantName: item.variantName,
        price: item.price,
        durationInMinutes: item.durationInMinutes,
        extras: item.extras?.map((e:any) => ({ name: e.name, price: e.price, durationInMinutes: e.durationInMinutes }))
      }))
    };

    const res = await appointments_api.createGuestAppointment(payload);
    if (res.data?.authorization_url) {
      window.location.href = res.data.authorization_url;
    } else {
      showToast({ title: 'Success', message: 'Appointment submitted successfully.', toastType: 'success' });
      emit('close');
    }
  } catch (e: any) {
    showFullLoadingOverlay.value = false;
    showToast({ title: 'Error', message: e.response?.data?.message || 'Payment initialization failed', toastType: 'error' });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.initialService) {
    handleAddClick(props.initialService);
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
