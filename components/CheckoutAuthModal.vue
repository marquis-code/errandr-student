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
              <ShieldCheck v-else-if="['verify', 'verify_reset'].includes(view)" class="w-8 h-8" />
              <KeyRound v-else class="w-8 h-8" />
            </div>
            <h2 class="text-3xl font-medium text-gray-900 tracking-tight leading-none mb-3">
              {{ view === 'login' ? 'Welcome Back!' : view === 'register' ? 'Join Errandr' : view === 'forgot' ? 'Reset Password' : view === 'verify_reset' ? 'Enter Code' : view === 'reset' ? 'New Password' : 'Verify Email' }}
            </h2>
            <p class="text-sm font-medium text-gray-400 leading-relaxed px-4">
              {{ view === 'login' ? 'Sign in to continue your checkout and track your order.' : view === 'register' ? 'Create an account to start your campus food journey!' : view === 'forgot' ? 'Enter your email address to receive a password reset code.' : view === 'verify_reset' ? `We've sent a password reset code to ${forgotEmail}.` : view === 'reset' ? 'Choose a strong password to secure your account.' : 'We\'ve sent a code to your email. Please enter it below.' }}
            </p>
          </div>

          <!-- Back Button for Forgot/Reset Flow -->
          <div v-if="['forgot', 'verify_reset', 'reset'].includes(view)" class="mb-6 -mt-4 text-left">
            <button 
              type="button" 
              @click="goBackToLogin" 
              class="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-950 transition-colors"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>

          <!-- Tabs -->
          <div v-if="!['verify', 'forgot', 'verify_reset', 'reset'].includes(view)" class="flex p-1.5 bg-gray-50 rounded-2xl mb-10">
            <button 
              @click="view = 'login'" 
              :class="[
                'flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all',
                view === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              ]"
            >LOGIN</button>
            <button 
              @click="view = 'register'" 
              :class="[
                'flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all',
                view === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              ]"
            >SIGN UP</button>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-shake">
            <AlertCircle class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p class="text-[11px] font-bold text-rose-600 leading-relaxed text-left">{{ error }}</p>
          </div>

          <!-- Forms -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Login View -->
            <template v-if="view === 'login'">
              <div class="space-y-4">
                <div class="group">
                  <p class="text-xs font-medium text-gray-400 mb-2 pl-1 text-left">Email Address</p>
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
                    <p class="text-xs font-medium text-gray-400">Password</p>
                    <button type="button" @click="view = 'forgot'" class="text-xs font-medium text-parentPrimary hover:underline">Forgot Password?</button>
                  </div>
                  <div class="relative flex items-center">
                    <input 
                      v-model="loginForm.password" 
                      :type="showLoginPassword ? 'text' : 'password'" 
                      placeholder="••••••••"
                      required
                      class="w-full pl-6 pr-14 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                    />
                    <button 
                      type="button" 
                      @click="showLoginPassword = !showLoginPassword" 
                      class="absolute right-5 p-1 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Eye v-if="!showLoginPassword" class="w-5 h-5" />
                      <EyeOff v-else class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Register View -->
            <template v-else-if="view === 'register'">
              <div class="grid grid-cols-2 gap-4">
                <div class="group">
                  <p class="text-xs font-medium text-gray-400 mb-2 pl-1 text-left">First Name</p>
                  <input 
                    v-model="registerForm.firstName" 
                    type="text" 
                    placeholder="Ebuka"
                    required
                    class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                  />
                </div>
                <div class="group">
                  <p class="text-xs font-medium text-gray-400 mb-2 pl-1 text-left">Last Name</p>
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
                <p class="text-xs font-medium text-gray-400 mb-2 pl-1 text-left">Email Address</p>
                <input 
                  v-model="registerForm.email" 
                  type="email" 
                  placeholder="student@campus.edu"
                  required
                  class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                />
              </div>
              <div class="group">
                <p class="text-xs font-medium text-gray-400 mb-2 pl-1 text-left">Password</p>
                <div class="relative flex items-center">
                  <input 
                    v-model="registerForm.password" 
                    :type="showRegisterPassword ? 'text' : 'password'" 
                    placeholder="Create a strong password"
                    required
                    class="w-full pl-6 pr-14 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                  />
                  <button 
                    type="button" 
                    @click="showRegisterPassword = !showRegisterPassword" 
                    class="absolute right-5 p-1 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <Eye v-if="!showRegisterPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </template>

            <!-- Forgot Password View -->
            <template v-else-if="view === 'forgot'">
              <div class="space-y-4">
                <div class="group">
                  <p class="text-xs font-medium text-gray-400 mb-2 pl-1 text-left">Email Address</p>
                  <input 
                    v-model="forgotEmail" 
                    type="email" 
                    placeholder="student@campus.edu"
                    required
                    class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                  />
                </div>
              </div>
            </template>

            <!-- Verify Reset OTP View -->
            <template v-else-if="view === 'verify_reset'">
              <div class="space-y-6">
                <div class="flex justify-between items-center gap-2">
                  <input 
                    v-for="i in 6" 
                    :key="i"
                    :id="'reset-otp-input-'+i"
                    v-model="resetOtpDigits[i-1]"
                    type="text"
                    maxlength="1"
                    @input="handleResetOtpInput($event, i)"
                    @keydown.delete="handleResetOtpBackspace($event, i)"
                    class="w-14 h-14 md:w-12 md:h-16 text-center text-xl font-medium bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-xl outline-none transition-all"
                  />
                </div>
                <div class="text-center pt-2">
                  <p class="text-sm font-bold text-gray-400 mb-2">Haven't received it?</p>
                  <button 
                    type="button" 
                    @click="handleResendResetOtp" 
                    :disabled="resendLoading || resendTimer > 0"
                    class="text-sm font-medium text-parentPrimary hover:underline disabled:text-gray-300 transition-all "
                  >
                    {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code' }}
                  </button>
                </div>
              </div>
            </template>

            <!-- Set New Password View -->
            <template v-else-if="view === 'reset'">
              <div class="space-y-4">
                <div class="group">
                  <p class="text-xs font-medium text-gray-400 mb-2 pl-1 text-left">New Password</p>
                  <div class="relative flex items-center">
                    <input 
                      v-model="resetForm.password" 
                      :type="showResetPassword ? 'text' : 'password'" 
                      placeholder="Min. 8 characters"
                      required
                      minlength="8"
                      class="w-full pl-6 pr-14 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                    />
                    <button 
                      type="button" 
                      @click="showResetPassword = !showResetPassword" 
                      class="absolute right-5 p-1 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Eye v-if="!showResetPassword" class="w-5 h-5" />
                      <EyeOff v-else class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div class="group">
                  <p class="text-xs font-medium text-gray-400 mb-2 pl-1 text-left">Confirm Password</p>
                  <div class="relative flex items-center">
                    <input 
                      v-model="resetForm.confirmPassword" 
                      :type="showConfirmPassword ? 'text' : 'password'" 
                      placeholder="Repeat new password"
                      required
                      minlength="8"
                      class="w-full pl-6 pr-14 py-4 bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-200"
                    />
                    <button 
                      type="button" 
                      @click="showConfirmPassword = !showConfirmPassword" 
                      class="absolute right-5 p-1 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                      <EyeOff v-else class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Verify Registration OTP View -->
            <template v-else-if="view === 'verify'">
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
                    class="w-10 h-14 md:w-12 md:h-16 text-center text-xl font-medium bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-xl outline-none transition-all"
                  />
                </div>
                <div class="text-center pt-2">
                  <p class="text-sm font-bold text-gray-400 mb-2">Haven't received it?</p>
                  <button 
                    type="button" 
                    @click="handleResend" 
                    :disabled="resendLoading || resendTimer > 0"
                    class="text-sm font-medium text-parentPrimary hover:underline disabled:text-gray-300 transition-all "
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
                class="w-full py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-medium hover:bg-parentPrimary transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                <template v-if="loading">
                  <Loader2 class="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </template>
                <template v-else>
                  <span>{{ view === 'login' ? 'Sign in now' : view === 'register' ? 'Create Account' : view === 'forgot' ? 'Send Code' : view === 'verify_reset' ? 'Verify Code' : view === 'reset' ? 'Update Password' : 'Verify & Continue' }}</span>
                  <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </template>
              </button>
            </div>
          </form>

          <p v-if="!['verify', 'verify_reset', 'reset'].includes(view)" class="mt-8 text-center text-sm font-bold text-gray-400 leading-relaxed">
            By continuing, you agree to Errandr's <br/>
            <span class="text-gray-900 hover:underline cursor-pointer">Terms of Service</span> & <span class="text-gray-900 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { X, UserCheck, UserPlus, ShieldCheck, ArrowRight, Loader2, AlertCircle, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-vue-next';
import { useAuth } from '@/composables/modules/auth';
import { auth_api } from '@/api_factory/modules/auth';
import { useCustomToast } from '@/composables/core/useCustomToast';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'authenticated']);

const { login, register, verifyOTP } = useAuth();
const { showToast } = useCustomToast();

const view = ref<'login' | 'register' | 'verify' | 'forgot' | 'verify_reset' | 'reset'>('login');
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

// Forgot / Reset Password state variables
const forgotEmail = ref('');
const resetOtpDigits = ref(['', '', '', '', '', '']);
const resetForm = reactive({
  password: '',
  confirmPassword: ''
});

const otpDigits = ref(['', '', '', '', '', '']);
const resendTimer = ref(0);
const resendLoading = ref(false);

// Eye visibility states
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const showResetPassword = ref(false);
const showConfirmPassword = ref(false);

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

const handleResetOtpInput = (e: any, index: number) => {
  const char = e.data;
  if (char && index < 6) {
    document.getElementById(`reset-otp-input-${index + 1}`)?.focus();
  }
};

const handleResetOtpBackspace = (e: any, index: number) => {
  if (!resetOtpDigits.value[index - 1] && index > 1) {
    document.getElementById(`reset-otp-input-${index - 1}`)?.focus();
  }
};

const handleResend = async () => {
  resendLoading.value = true;
  try {
    const email = registerForm.email || loginForm.email;
    if (email) {
      await auth_api.resendOtp(email);
      showToast({
        title: "Code Resent!",
        message: "We've sent a new verification code to your email.",
        toastType: "success",
      });
    }
    startResendTimer();
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to resend code.';
  } finally {
    resendLoading.value = false;
  }
};

const handleResendResetOtp = async () => {
  resendLoading.value = true;
  try {
    const res = await auth_api.forgotPassword(forgotEmail.value);
    showToast({
      title: "Code Resent!",
      message: res.data?.message || "We've resent the reset code to your email.",
      toastType: "success",
    });
    startResendTimer();
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to resend code.';
  } finally {
    resendLoading.value = false;
  }
};

const goBackToLogin = () => {
  view.value = 'login';
  error.value = '';
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
    } else if (view.value === 'forgot') {
      if (!forgotEmail.value.trim()) {
        error.value = 'Please enter your email address.';
        loading.value = false;
        return;
      }
      const res = await auth_api.forgotPassword(forgotEmail.value);
      showToast({
        title: "Code Sent!",
        message: res.data?.message || "Check your inbox for the reset code.",
        toastType: "success",
      });
      view.value = 'verify_reset';
      startResendTimer();
    } else if (view.value === 'verify_reset') {
      const otp = resetOtpDigits.value.join('');
      if (otp.length < 6) {
        error.value = 'Please enter the full 6-digit reset code.';
        loading.value = false;
        return;
      }
      const res = await auth_api.verifyResetOtp({ email: forgotEmail.value, otp });
      showToast({
        title: "Code Verified!",
        message: res.data?.message || "Perfect! Now set your new password.",
        toastType: "success",
      });
      view.value = 'reset';
    } else if (view.value === 'reset') {
      if (resetForm.password !== resetForm.confirmPassword) {
        error.value = 'Passwords do not match. Please try again.';
        loading.value = false;
        return;
      }
      const otp = resetOtpDigits.value.join('');
      await auth_api.resetPassword({
        email: forgotEmail.value,
        otp,
        newPassword: resetForm.password
      });
      showToast({
        title: "Password Changed!",
        message: "You can now log in securely.",
        toastType: "success",
      });
      // Navigate to login view
      view.value = 'login';
      loginForm.email = forgotEmail.value; // Prefill email
      loginForm.password = '';
      // Reset forms
      forgotEmail.value = '';
      resetOtpDigits.value = ['', '', '', '', '', ''];
      resetForm.password = '';
      resetForm.confirmPassword = '';
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
    forgotEmail.value = '';
    resetOtpDigits.value = ['', '', '', '', '', ''];
    resetForm.password = '';
    resetForm.confirmPassword = '';
    // Reset eye visibility toggles
    showLoginPassword.value = false;
    showRegisterPassword.value = false;
    showResetPassword.value = false;
    showConfirmPassword.value = false;
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
