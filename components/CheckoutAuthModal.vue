<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" @click="$emit('update:modelValue', false)"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white w-full h-full md:h-auto md:max-w-[480px] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-zoom-in">
        <!-- Close Button -->
        <button 
          @click="$emit('update:modelValue', false)"
          class="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all z-10"
        >
          <X class="w-6 h-6" />
        </button>

        <div class="flex-1 overflow-y-auto px-8 py-12 md:py-16 custom-scrollbar">
          <!-- Header -->
          <div class="text-center mb-10">
            <div class="w-16 h-16 bg-parentPrimary/10 text-parentPrimary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-parentPrimary/5">
              <UserCheck v-if="view === 'login'" class="w-8 h-8" />
              <UserPlus v-else-if="view === 'register'" class="w-8 h-8" />
              <ShieldCheck v-else class="w-8 h-8" />
            </div>
            <h2 class="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">
              {{ view === 'login' ? 'Welcome Back!' : view === 'register' ? 'Join Errandr' : 'Verify Email' }}
            </h2>
            <p class="text-sm font-medium text-gray-400 leading-relaxed px-4">
              {{ view === 'login' ? 'Sign in to continue your checkout and track your order.' : view === 'register' ? 'Create an account to start your campus food journey!' : 'We\'ve sent a code to your email. Please enter it below.' }}
            </p>
          </div>

          <!-- Tabs -->
          <div v-if="view !== 'verify'" class="flex p-1.5 bg-gray-50 rounded-2xl mb-10">
            <button 
              @click="view = 'login'" 
              :class="[
                'flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest transition-all',
                view === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              ]"
            >LOGIN</button>
            <button 
              @click="view = 'register'" 
              :class="[
                'flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest transition-all',
                view === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              ]"
            >SIGN UP</button>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-shake">
            <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p class="text-[11px] font-bold text-rose-600 leading-relaxed">{{ error }}</p>
          </div>

          <!-- Forms -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Login View -->
            <template v-if="view === 'login'">
              <div class="space-y-4">
                <div class="group">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Email Address</p>
                  <input 
                    v-model="loginForm.email" 
                    type="email" 
                    placeholder="student@campus.edu"
                    required
                    class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                  />
                </div>
                <div class="group">
                  <div class="flex items-center justify-between mb-2 px-1">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</p>
                    <button type="button" class="text-[10px] font-black text-parentPrimary hover:underline">Forgot?</button>
                  </div>
                  <input 
                    v-model="loginForm.password" 
                    type="password" 
                    placeholder="••••••••"
                    required
                    class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                  />
                </div>
              </div>
            </template>

            <!-- Register View -->
            <template v-else-if="view === 'register'">
              <div class="grid grid-cols-2 gap-4">
                <div class="group col-span-1">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">First Name</p>
                  <input 
                    v-model="registerForm.firstName" 
                    type="text" 
                    placeholder="Ebuka"
                    required
                    class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                  />
                </div>
                <div class="group col-span-1">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Last Name</p>
                  <input 
                    v-model="registerForm.lastName" 
                    type="text" 
                    placeholder="Chima"
                    required
                    class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                  />
                </div>
              </div>
              <div class="group">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Email Address</p>
                <input 
                  v-model="registerForm.email" 
                  type="email" 
                  placeholder="student@campus.edu"
                  required
                  class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                />
              </div>
              <div class="group">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Password</p>
                <input 
                  v-model="registerForm.password" 
                  type="password" 
                  placeholder="Create a strong password"
                  required
                  class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                />
              </div>
            </template>

            <!-- Verify OTP View -->
            <template v-else>
              <div class="space-y-6">
                <div class="flex justify-between items-center gap-2">
                  <input 
                    v-for="i in 6" 
                    :key="i"
                    :id="'otp-input-'+i"
                    v-model="otpDigits[i-1]"
                    type="text"
                    maxlength="1"
                    @input="handleOtpInput($event, i)"
                    @keydown.delete="handleOtpBackspace($event, i)"
                    class="w-10 h-14 md:w-12 md:h-16 text-center text-xl font-black bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-xl outline-none transition-all"
                  />
                </div>
                <div class="text-center pt-2">
                  <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Haven't received it?</p>
                  <button 
                    type="button" 
                    @click="handleResend" 
                    :disabled="resendLoading || resendTimer > 0"
                    class="text-xs font-black text-parentPrimary hover:underline disabled:text-gray-300 transition-all uppercase"
                  >
                    {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code' }}
                  </button>
                </div>
              </div>
            </template>

            <!-- Submit Button -->
            <div class="pt-4">
              <button 
                type="submit" 
                :disabled="loading"
                class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black tracking-[0.25em] uppercase hover:bg-parentPrimary transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                <template v-if="loading">
                  <Loader2 class="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </template>
                <template v-else>
                  <span>{{ view === 'login' ? 'SIGN IN NOW' : view === 'register' ? 'CREATE ACCOUNT' : 'VERIFY & CONTINUE' }}</span>
                  <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </template>
              </button>
            </div>
          </form>

          <p v-if="view !== 'verify'" class="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            By continuing, you agree to Errandr's <br/>
            <span class="text-gray-900 hover:underline cursor-pointer">Terms of Service</span> & <span class="text-gray-900 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { X, UserCheck, UserPlus, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-vue-next';
import { useAuth } from '@/composables/modules/auth';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'authenticated']);

const { login, register, verifyOTP, loading: authLoading } = useAuth();
const view = ref<'login' | 'register' | 'verify'>('login');
const loading = ref(false);
const error = ref('');

const loginForm = reactive({
  email: '',
  password: ''
});

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

const otpDigits = ref(['', '', '', '', '', '']);
const resendTimer = ref(0);
const resendLoading = ref(false);

const startResendTimer = () => {
  resendTimer.value = 60;
  const interval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) clearInterval(interval);
  }, 1000);
};

const handleOtpInput = (e: any, index: number) => {
  const char = e.data;
  if (char && index < 6) {
    document.getElementById(`otp-input-${index + 1}`)?.focus();
  }
};

const handleOtpBackspace = (e: any, index: number) => {
  if (!otpDigits.value[index - 1] && index > 1) {
    document.getElementById(`otp-input-${index - 1}`)?.focus();
  }
};

const handleResend = async () => {
  // Logic to resend OTP
  resendLoading.value = true;
  try {
    // Call resend API if available or reuse signup
    await startResendTimer();
  } finally {
    resendLoading.value = false;
  }
};

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    if (view.value === 'login') {
      await login(loginForm, { redirect: false });
      emit('authenticated');
      emit('update:modelValue', false);
    } else if (view.value === 'register') {
      await register(registerForm, { redirect: false });
      view.value = 'verify';
      loading.value = false;
    } else if (view.value === 'verify') {
      const otp = otpDigits.value.join('');
      if (otp.length < 6) {
        error.value = 'Please enter the full 6-digit code sent to your email.';
        loading.value = false;
        return;
      }
      await verifyOTP(registerForm.email || loginForm.email, otp, { redirect: false });
      emit('authenticated');
      emit('update:modelValue', false);
    }
  } catch (e: any) {
    console.error('Auth action failed:', e);
    error.value = e.response?.data?.message || e.message || 'Something went wrong. Please check your credentials and try again.';
  } finally {
    loading.value = false;
  }
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    view.value = 'login';
    error.value = '';
    // Clear forms
    loginForm.email = '';
    loginForm.password = '';
    otpDigits.value = ['', '', '', '', '', ''];
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-zoom-in {
  animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes zoomIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
