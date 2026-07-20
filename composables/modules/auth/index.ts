import { ref } from 'vue';
import { auth_api } from '@/api_factory/modules/auth';
import { useUser } from './user';
import { navigateTo, useRoute, useRuntimeConfig } from '#imports';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const useAuth = () => {
  const { setUser, setToken, logOut } = useUser();
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const firebaseLoading = ref(false);

  const login = async (payload: any, options: { redirect?: boolean } = { redirect: true }) => {
    const route = useRoute();
    loading.value = true;
    try {
      const res = await auth_api.login(payload);
      
      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;
      
      if (!userData || !tokenValue) {
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
          // Ignore
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

  const firebaseLogin = async (options: { redirect?: boolean } = { redirect: true }) => {
    firebaseLoading.value = true;
    try {
      const config = useRuntimeConfig();
      const firebaseConfig = {
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await auth_api.firebaseLogin({ idToken });
      
      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;
      
      if (!userData || !tokenValue) {
        throw { data: { message: 'Firebase login failed: unexpected response format' } };
      }
      
      setUser(userData);
      setToken(tokenValue);
      
      showToast({
        title: "Welcome Back!",
        message: "You've successfully logged in with Google.",
        toastType: "success",
      });
      
      if (options.redirect) {
        const route = useRoute();
        try {
          const redirectPath = (route.query.redirect as string) || '/dashboard';
          await navigateTo(redirectPath);
        } catch (navError) {
          // Ignore
        }
      }
      
      return responseData;
    } catch (e: any) {
      console.error('Firebase login failed:', e);
      showToast({
        title: "Login Failed",
        message: e.message || "Failed to login with Google.",
        toastType: "error",
      });
      throw e;
    } finally {
      firebaseLoading.value = false;
    }
  };

  const guestCheckout = async (payload: { firstName: string; lastName: string; email: string; phone: string }) => {
    loading.value = true;
    try {
      const res = await auth_api.guestCheckout(payload);
      
      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;
      
      if (!userData || !tokenValue) {
        throw { data: { message: 'Guest checkout failed: unexpected response format' } };
      }
      
      setUser(userData);
      setToken(tokenValue);
      
      showToast({
        title: "Guest Session Created",
        message: "You can now complete your checkout.",
        toastType: "success",
      });
      
      return responseData;
    } catch (e: any) {
      console.error('Guest checkout failed:', e);
      showToast({
        title: "Guest Checkout Failed",
        message: e.data?.message || e.message || "Failed to continue as guest.",
        toastType: "error",
      });
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
    firebaseLoading,
    login,
    firebaseLogin,
    guestCheckout,
    register,
    fetchProfile,
    verifyOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    logOut
  };
};
