import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";
import { useCustomToast } from '@/composables/core/useCustomToast'

// Lazy-init toast to avoid calling composable outside Vue setup context
let _showToast: ReturnType<typeof useCustomToast>['showToast'] | null = null;
const getToast = () => {
  if (!_showToast) {
    try {
      const { showToast } = useCustomToast();
      _showToast = showToast;
    } catch {
      // Fallback: no-op during SSR/build
      _showToast = (() => {}) as any;
    }
  }
  return _showToast!;
};

// Use useRuntimeConfig() for the API base URL so Vercel env vars work correctly.
// import.meta.env.VITE_* won't be populated on Vercel since .env is gitignored.
const getBaseUrl = (): string => {
  try {
    const config = useRuntimeConfig();
    return (config.public.apiBase as string) || 'https://api.erranders.org';
  } catch {
    // Fallback if called outside Nuxt context
    const envApiUrl = import.meta.env?.VITE_API_BASE_URL;
    return envApiUrl || 'https://api.erranders.org';
  }
};

const cleanBaseUrl = getBaseUrl().replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = cleanBaseUrl;
const $GATEWAY_ENDPOINT = `${cleanBaseUrl}/api/v1`;
const $GATEWAY_ENDPOINT_V2 = `${cleanBaseUrl}/v2`;
const $IMAGE_UPLOAD_ENDPOINT = cleanBaseUrl;


export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
];

instanceArray.forEach((instance) => {
  instance.interceptors.request.use((config: any) => {
    const { token } = useUser();
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      const { logOut } = useUser();
      if (typeof err.response === "undefined") {
        getToast()({
          title: "Error",
          message: "kindly check your network connection",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      }
      if (err.response.status === 401) {
        console.log(err.response.data.error)
        
        const publicPaths = ['/dashboard', '/vendors', '/search', '/', '/auth/login', '/auth/register', '/cart', '/errands/custom'];
        const isPublicPath = typeof window !== 'undefined' && 
          (publicPaths.includes(window.location.pathname) || window.location.pathname.startsWith('/vendors/'));
        
        logOut(isPublicPath ? false : true);
        
        if (!isPublicPath) {
          getToast()({
            title: "Session Expired",
            message: "Please login to continue",
            toastType: "error",
            duration: 3000
          });
        }
        
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        const isGroupOrderCheck = err.response.status === 404 && err.config?.url?.includes('/group-orders/');
        if (err.response.data.message && !isGroupOrderCheck) {
          getToast()({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 500) {
        getToast()({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 409) {
        getToast()({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
      }
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};
