import { ref } from 'vue';
import { auth_api } from '@/api_factory/modules/auth';
import { useUser } from './user';
import { navigateTo, useRoute } from '#imports';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useAuth = () => {
  const { setUser, setToken, logOut } = useUser();
  const { showToast } = useCustomToast();
  const loading = ref(false);

  const login = async (payload: any, options: { redirect?: boolean } = { redirect: true }) => {
    const route = useRoute();
    loading.value = true;
    try {
      const res = await auth_api.login(payload);
      
      // Handle potential response wrapping (res.data or res.data.data)
      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;
      
      if (!userData || !tokenValue) {
        console.error('Login response format error:', responseData);
        throw { data: { message: 'Login failed: unexpected response format' } };
      }
      
      setUser(userData);
      setToken(tokenValue);
      
      showToast({
        title: "Welcome Back!",
        message: "You've successfully logged in.",
        toastType: "success",
      });
      
      if (options.redirect) {
        try {
          const redirectPath = (route.query.redirect as string) || '/dashboard';
          await navigateTo(redirectPath);
        } catch (navError) {
          // Navigation aborts are expected in Nuxt — ignore them
        }
      }
      
      return responseData;
    } catch (e: any) {
      console.error('Login submission failed:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload: any, options: { redirect?: boolean } = { redirect: true }) => {
    loading.value = true;
    try {
      const res = await auth_api.register(payload);
      showToast({
        title: "Account Created!",
        message: "We've sent a verification code to your email.",
        toastType: "success",
      });
      if (options.redirect) {
        navigateTo(`/auth/verify-email?email=${encodeURIComponent(payload.email)}`);
      }
      return res.data;
    } catch (e: any) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await auth_api.getProfile();
      setUser(res.data);
    } catch (e) {
      logOut();
    }
  };

  const verifyOTP = async (email: string, otp: string, options: { redirect?: boolean } = { redirect: true }) => {
    loading.value = true;
    try {
      const res = await auth_api.verifyOtp({ email, otp });
      const responseData = res.data?.data || res.data;
      
      if (responseData?.token && responseData?.user) {
        setUser(responseData.user);
        setToken(responseData.token);
      }

      showToast({
        title: "Email Verified!",
        message: responseData?.message || "You're officially legit 🎉",
        toastType: "success",
      });
      
      if (options.redirect) {
        // Redirection can be handled by the calling component (e.g. to show a welcome modal)
      }
      return responseData;
    } catch (e: any) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const forgotPassword = async (email: string) => {
    loading.value = true;
    try {
      const res = await auth_api.forgotPassword(email);
      showToast({
        title: "Code Sent!",
        message: res.data?.message || "Check your inbox for the reset code.",
        toastType: "success",
      });
      navigateTo(`/auth/verify-reset-otp?email=${encodeURIComponent(email)}`);
      return res.data;
    } catch (e: any) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const verifyResetOTP = async (email: string, otp: string) => {
    loading.value = true;
    try {
      const res = await auth_api.verifyResetOtp({ email, otp });
      showToast({
        title: "Code Verified!",
        message: res.data?.message || "Perfect! Now set your new password.",
        toastType: "success",
      });
      navigateTo(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      return res.data;
    } catch (e: any) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (payload: any) => {
    loading.value = true;
    try {
      const res = await auth_api.resetPassword(payload);
      showToast({
        title: "Password Changed!",
        message: "You can now log in securely.",
        toastType: "success",
      });
      navigateTo('/auth/login');
      return res.data;
    } catch (e: any) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    login,
    register,
    fetchProfile,
    verifyOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    logOut
  };
};
