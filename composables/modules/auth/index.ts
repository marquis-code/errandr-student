import { ref } from 'vue';
import { auth_api } from '@/api_factory/modules/auth';
import { useUser } from './user';
import { navigateTo, useRoute, useRuntimeConfig } from '#imports';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult, signInWithRedirect } from 'firebase/auth';

export const useAuth = () => {
  const { setUser, setToken, setRefreshToken, logOut } = useUser();
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const firebaseLoading = ref(false);

  const checkRedirectResult = async () => {
    try {
      const config = useRuntimeConfig();
      const firebaseConfig = {
        apiKey: config.public.firebaseApiKey || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
        authDomain: config.public.firebaseAuthDomain || 'erranders-493fe.firebaseapp.com',
        projectId: config.public.firebaseProjectId || 'erranders-493fe',
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      
      const result = await getRedirectResult(auth);
      if (result) {
        firebaseLoading.value = true;
        const idToken = await result.user.getIdToken();
        const res = await auth_api.firebaseLogin({ idToken, isSignUp: false });
        
        if (res.type === 'ERROR') throw { data: res.data || { message: 'Firebase login failed' } };
        
        const responseData = res.data?.data || res.data;
        const userData = responseData?.user;
        const tokenValue = responseData?.token;
        
        if (userData && tokenValue) {
          setUser(userData);
          setToken(tokenValue);
          if (responseData?.refreshToken) setRefreshToken(responseData.refreshToken);
          
          if (!userData.phone) {
            showToast({
              title: "Action Required",
              message: "Please add your phone number and complete your profile setup.",
              toastType: "info",
            });
            navigateTo('/dashboard/profile');
          } else {
            showToast({
              title: "Welcome Back!",
              message: "You've successfully logged in with Google.",
              toastType: "success",
            });
            navigateTo('/dashboard');
          }
        }
      }
    } catch (e: any) {
      // Swallowing this was why a failed redirect looked like nothing happened at all: the
      // student landed back on the page, still logged out, with no message.
      const code = String(e?.code || '');
      console.error('[auth] Redirect login failed:', code, e?.message, e);
      if (code && code !== 'auth/no-auth-event') {
        showToast({
          title: 'Google sign-in failed',
          message:
            code === 'auth/web-storage-unsupported'
              ? 'Your browser blocks the storage Google needs. Allow cookies for this site, or sign in with your email and password.'
              : `Please sign in with your email and password instead. (${code})`,
          toastType: 'error',
        });
      }
    } finally {
      firebaseLoading.value = false;
    }
  };

  const login = async (payload: any, options: { redirect?: boolean } = { redirect: true }) => {
    const route = useRoute();
    loading.value = true;
    try {
      payload.role = 'student';
      const res = await auth_api.login(payload);
      
      if (res.type === 'ERROR') {
        throw { data: res.data || { message: 'Login failed' } };
      }
      
      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;
      
      if (!userData || !tokenValue) {
        throw { data: { message: 'Login failed: unexpected response format' } };
      }
      
      setUser(userData);
      setToken(tokenValue);
      if (responseData?.refreshToken) setRefreshToken(responseData.refreshToken);
      
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

  const firebaseLogin = async (options: { redirect?: boolean; isSignUp?: boolean } = { redirect: true, isSignUp: false }) => {
    firebaseLoading.value = true;
    try {
      const config = useRuntimeConfig();
      const firebaseConfig = {
        apiKey: config.public.firebaseApiKey || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
        authDomain: config.public.firebaseAuthDomain || 'erranders-493fe.firebaseapp.com',
        projectId: config.public.firebaseProjectId || 'erranders-493fe',
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (err: any) {
        // A popup cannot work inside an in-app browser (Instagram, Facebook, WhatsApp) or a
        // webview, and the redirect flow needs storage those browsers withhold. Detecting it
        // up front is better than a generic failure the student cannot act on.
        const code = String(err?.code || '');
        const canFallBackToRedirect =
          code === 'auth/popup-blocked' ||
          code === 'auth/operation-not-supported-in-this-environment' ||
          code === 'auth/cancelled-popup-request';

        if (canFallBackToRedirect) {
          console.warn(`[auth] popup unavailable (${code}) — using redirect`);
          await signInWithRedirect(auth, provider);
          // The browser is navigating away; never resolve, so no error toast flashes.
          return new Promise(() => {});
        }

        // Everything else is a real error and gets a message the student can act on.
        console.error('[auth] Google sign-in failed:', code, err?.message);
        const friendly: Record<string, string> = {
          'auth/unauthorized-domain':
            'Google sign-in is not enabled for this address yet. Please sign in with your email and password.',
          'auth/operation-not-allowed':
            'Google sign-in is switched off. Please use your email and password.',
          'auth/invalid-api-key':
            'Sign-in is misconfigured. Please use your email and password and tell support.',
          'auth/api-key-not-valid':
            'Sign-in is misconfigured. Please use your email and password and tell support.',
          'auth/network-request-failed':
            'Your connection dropped during sign-in. Check your network and try again.',
          'auth/popup-closed-by-user':
            'You closed the Google window before finishing. Try again.',
          'auth/account-exists-with-different-credential':
            'This email already has a password account. Sign in with your password instead.',
        };
        throw {
          code,
          message: friendly[code] || `Google sign-in failed (${code || 'unknown'}). Please sign in with your email and password.`,
        };
      }
      const idToken = await result.user.getIdToken();

      const res = await auth_api.firebaseLogin({ idToken, isSignUp: options?.isSignUp });
      
      if (res.type === 'ERROR') {
        throw { data: res.data || { message: 'Firebase login failed' } };
      }
      
      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;
      
      if (!userData || !tokenValue) {
        throw { data: { message: 'Firebase login failed: unexpected response format' } };
      }
      
      setUser(userData);
      setToken(tokenValue);
      if (responseData?.refreshToken) setRefreshToken(responseData.refreshToken);
      
      showToast({
        title: "Welcome Back!",
        message: "You've successfully logged in with Google.",
        toastType: "success",
      });
      
      if (options.redirect) {
        const route = useRoute();
        try {
          let redirectPath = (route.query.redirect as string) || '/dashboard';
          if (!userData.phone) {
            redirectPath = '/dashboard/profile';
            showToast({
              title: "Action Required",
              message: "Please add your phone number and complete your profile setup.",
              toastType: "info",
            });
          }
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
        message: e?.data?.message || e?.message || "Failed to login with Google.",
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
      
      if (res.type === 'ERROR') {
        throw { data: res.data || { message: 'Guest checkout failed' } };
      }
      
      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;
      
      if (!userData || !tokenValue) {
        throw { data: { message: 'Guest checkout failed: unexpected response format' } };
      }
      
      setUser(userData);
      setToken(tokenValue);
      if (responseData?.refreshToken) setRefreshToken(responseData.refreshToken);
      
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
      payload.role = 'student';
      const res = await auth_api.register(payload);
      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;
      
      if (userData && tokenValue) {
        setUser(userData);
        setToken(tokenValue);
        if (responseData?.refreshToken) setRefreshToken(responseData.refreshToken);
      }

      showToast({
        title: "Account Created!",
        message: responseData?.message || "Welcome to Erranders! 🎉",
        toastType: "success",
      });
      if (options.redirect) {
        navigateTo('/dashboard');
      }
      return responseData;
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
      console.warn('Could not fetch user profile:', e);
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
        if (responseData?.refreshToken) setRefreshToken(responseData.refreshToken);
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
    logOut,
    checkRedirectResult
  };
};
