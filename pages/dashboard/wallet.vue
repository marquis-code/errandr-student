<template>
  <main class="min-h-screen pb-20">
    <div class="max-w-7xl mx-auto px-4 pt-8 space-y-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tighter">My Wallet</h1>
          <p class="text-sm text-gray-500 font-medium">Manage your funds and transactions</p>
        </div>
        <button 
          @click="goBack"
          class="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <!-- Wallet Card -->
      <div class="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-200">
        <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-parentPrimary/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div class="space-y-2">
            <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Available Balance</p>
            <div class="flex items-baseline gap-2">
              <span class="text-5xl font-black tracking-tighter">₦{{ (balance || 0).toLocaleString() }}</span>
              <button @click="handleFetchWallet" class="p-2 hover:bg-white/10 rounded-full transition-colors">
                <RefreshCw :class="loading ? 'animate-spin' : ''" class="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>

          <div class="flex gap-3">
            <button 
              @click="showTopup = true"
              class="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[11px] font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Plus class="w-4 h-4" />
              Add Money
            </button>
          </div>
        </div>
      </div>

      <!-- Verification State (If returning from Paystack) -->
      <div v-if="verifying" class="bg-white rounded-[2rem] p-12 text-center border border-emerald-100 shadow-sm animate-pulse">
        <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 class="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
        <h3 class="text-xl font-black text-gray-900 tracking-tight">Verifying Transaction...</h3>
        <p class="text-gray-500 mt-2">Please wait while we confirm your top-up.</p>
      </div>

      <!-- Recent Transactions -->
      <div class="space-y-6">
        <div class="flex items-center justify-between px-2">
          <h2 class="text-xl font-black text-gray-900 tracking-tight">Recent Activity</h2>
          <div class="flex items-center gap-4">
            <button class="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">View All</button>
          </div>
        </div>

        <div v-if="loadingTransactions" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 rounded-3xl animate-pulse"></div>
        </div>

        <div v-else-if="transactions.length" class="space-y-3">
          <div 
            v-for="tx in transactions" 
            :key="tx._id"
            @click="openDetails(tx)"
            class="bg-white p-5 rounded-[2rem] border border-gray-50 flex items-center justify-between hover:shadow-lg hover:border-emerald-100 transition-all group cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div 
                :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'"
                class="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <ArrowUpRight v-if="tx.type === 'debit'" class="w-5 h-5" />
                <ArrowDownLeft v-else class="w-5 h-5" />
              </div>
              <div>
                <p class="font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">{{ tx.description }}</p>
                <p class="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                  {{ new Date(tx.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                </p>
              </div>
            </div>
            <div class="text-right flex items-center gap-4">
              <div>
                <p :class="tx.type === 'credit' ? 'text-emerald-500' : 'text-gray-900'" class="font-black text-lg tracking-tighter">
                  {{ tx.type === 'credit' ? '+' : '-' }}₦{{ tx.amount.toLocaleString() }}
                </p>
                <div class="flex items-center justify-end gap-1 font-bold text-[8px] uppercase tracking-widest mt-0.5" :class="tx.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'">
                  <div class="w-1 h-1 rounded-full bg-current"></div>
                  {{ tx.status }}
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>

        <div v-else class="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-200">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <WalletIcon class="w-8 h-8 text-gray-300" />
          </div>
          <p class="text-gray-400 font-bold uppercase text-xs tracking-widest">No transactions yet</p>
        </div>
      </div>
    </div>

    <!-- Topup Modal -->
    <Transition name="fade">
      <div v-if="showTopup" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
        <div 
          v-click-outside="() => showTopup = false"
          class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-zoom-in"
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-gray-900 tracking-tight">Add Funds</h3>
            <button @click="showTopup = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X class="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div class="space-y-6">
            <div>
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Enter Amount</label>
              <div class="relative">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">₦</span>
                <input 
                  v-model="amount"
                  type="number"
                  placeholder="0"
                  class="w-full bg-gray-50 border-none rounded-2xl py-6 pl-12 pr-6 text-2xl font-black text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
              </div>
            </div>

            <!-- Quick Amounts -->
            <div class="grid grid-cols-3 gap-3">
              <button 
                v-for="a in [1000, 2000, 5000]" 
                :key="a"
                @click="amount = a"
                class="py-3 bg-gray-50 rounded-xl text-xs font-black text-gray-600 hover:bg-emerald-500 hover:text-white transition-all border border-gray-100"
              >
                +₦{{ a.toLocaleString() }}
              </button>
            </div>

            <button 
              @click="initiateTopup"
              :disabled="loadingPayment || amount < 50"
              class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[11px] font-black tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 transition-all shadow-xl flex items-center justify-center gap-3 mt-4"
            >
              <Loader2 v-if="loadingPayment" class="w-4 h-4 animate-spin" />
              <span v-else>Continue with Paystack</span>
              <ArrowRight v-if="!loadingPayment" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Transaction Details Modal -->
    <Transition name="fade">
      <div v-if="selectedTx" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
        <div 
          v-click-outside="() => selectedTx = null"
          class="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-zoom-in receipt-content"
          id="receipt-print"
        >
          <!-- Modal Header -->
          <div class="bg-gray-900 p-8 text-center relative overflow-hidden">
            <div class="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full translate-y-12"></div>
            <button @click="selectedTx = null" class="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors print:hidden">
              <X class="w-5 h-5 text-white/50" />
            </button>
            
            <div 
              :class="selectedTx.type === 'credit' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-parentPrimary shadow-parentPrimary/20'"
              class="w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl mb-6 relative z-10"
            >
              <WalletIcon v-if="selectedTx.type === 'credit'" class="w-10 h-10" />
              <ShoppingBag v-else class="w-10 h-10" />
            </div>
            
            <h3 class="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-2 relative z-10">Transaction Details</h3>
            <p class="text-4xl font-black text-white tracking-tighter relative z-10">
              {{ selectedTx.type === 'credit' ? '+' : '-' }}₦{{ selectedTx.amount.toLocaleString() }}
            </p>
          </div>

          <!-- Modal Body -->
          <div class="p-8 space-y-8">
            <div class="space-y-6 bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
              <div class="flex justify-between items-center group">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</span>
                <span :class="selectedTx.status === 'completed' ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'" class="text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-100/50 tracking-widest">
                  {{ selectedTx.status }}
                </span>
              </div>
              
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 leading-none">Description</span>
                <span class="text-sm font-black text-gray-900 text-right max-w-[200px] tracking-tight">{{ selectedTx.description }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Reference</span>
                <span class="text-xs font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">{{ selectedTx.reference || 'N/A' }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Date</span>
                <span class="text-xs font-black text-gray-600">{{ new Date(selectedTx.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }) }}</span>
              </div>
            </div>

            <!-- Footer / Actions -->
            <div class="flex gap-4 print:hidden">
              <button 
                @click="printReceipt"
                class="flex-1 py-5 bg-gray-900 text-white rounded-[1.5rem] text-[11px] font-black tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
              >
                <Printer class="w-4 h-4" />
                Print Receipt
              </button>
              <button 
                @click="selectedTx = null"
                class="flex-1 py-5 bg-gray-50 text-gray-500 rounded-[1.5rem] text-[11px] font-black tracking-widest uppercase hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
            
            <div class="pt-4 border-t border-gray-100 text-center">
               <p class="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Errandr Campus Finance Hub</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, RefreshCw, Plus, ArrowUpRight, ArrowDownLeft, 
  Wallet as WalletIcon, X, Loader2, ArrowRight, ChevronRight,
  Printer, ShoppingBag
} from 'lucide-vue-next';
import { useWallet } from '@/composables/modules/wallets';
import { usePayments } from '@/composables/modules/payments';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useUser } from '@/composables/modules/auth/user';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from '#app';

definePageMeta({
  layout: 'student'
});

const route = useRoute();
const router = useRouter();
const { user } = useUser();
const { balance, fetchWallet } = useWallet();
const { loading: loadingPayment, initializePayment, verifyPayment } = usePayments();
const { showToast } = useCustomToast();

const showTopup = ref(false);
const amount = ref(0);
const verifying = ref(false);
const loadingTransactions = ref(false);
const transactions = ref<any[]>([]);
const selectedTx = ref<any>(null);

const handleFetchWallet = async () => {
  await fetchWallet();
  fetchTransactions();
};

const fetchTransactions = async () => {
  loadingTransactions.value = true;
  try {
    const { wallets_api } = await import('@/api_factory/modules/wallets');
    const res = await wallets_api.getTransactions();
    transactions.value = (res.data?.data || res.data || []).slice(0, 10);
  } finally {
    loadingTransactions.value = false;
  }
};

const openDetails = (tx: any) => {
  selectedTx.value = tx;
};

const printReceipt = () => {
  window.print();
};

const initiateTopup = async () => {
  if (amount.value <= 10) {
    showToast({ title: 'Invalid Amount', message: 'Minimum funding amount is ₦10', toastType: 'error' });
    return;
  }
  try {
    const data = await initializePayment({
      amount: amount.value,
      email: user.value?.email,
      callback_url: window.location.origin + '/dashboard/wallet', 
      metadata: { 
        type: 'wallet_topup', 
        userId: user.value?._id,
        redirect: route.query.redirect 
      },
    });
    
    const authUrl = data?.data?.authorization_url || data?.authorization_url;
    if (authUrl) {
      // Save topup intent
      localStorage.setItem('recent_topup_ref', data?.data?.reference || '');
      window.location.href = authUrl;
    }
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Failed to initialize payment', toastType: 'error' });
  }
};

const verifyReturn = async () => {
  const reference = route.query.reference as string;
  if (!reference) return;

  verifying.value = true;
  try {
    const res = await verifyPayment(reference);
    const data = res?.data || res;
    
    // Check if the verification is successful
    const success = data?.status === 'success' || data?.data?.status === 'success';
    
    if (success) {
      showToast({ 
        title: 'Funding Successful!', 
        message: 'Your wallet has been credited and is ready for use.', 
        toastType: 'success' 
      });
      await handleFetchWallet();
      
      // Auto-redirect if returning to checkout
      const redirectPath = route.query.redirect;
      if (redirectPath) {
        setTimeout(() => {
          router.push(redirectPath as string);
        }, 3000);
      }
    }
  } catch (e) {
    showToast({ title: 'Verification Error', message: 'Was not able to verify this topup yet. Please refresh in a moment.', toastType: 'error' });
  } finally {
    verifying.value = false;
    // Clean URL
    const url = new URL(window.location.href);
    url.searchParams.delete('reference');
    url.searchParams.delete('trs_id'); // Some webhooks pass extra params
    window.history.replaceState({}, '', url.toString());
  }
};

const goBack = () => {
  if (route.query.redirect) {
    router.push(route.query.redirect as string);
  } else {
    router.push('/dashboard');
  }
};

onMounted(async () => {
  handleFetchWallet();
  if (route.query.topup) {
    amount.value = Number(route.query.topup);
    showTopup.value = true;
  }
  if (route.query.reference) {
    await verifyReturn();
  }
});
</script>

<style scoped>
.animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media print {
  body * { visibility: hidden; }
  .receipt-content, .receipt-content * { visibility: visible; }
  .receipt-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none !important;
    border: none !important;
  }
  .print\:hidden { display: none !important; }
}
</style>
