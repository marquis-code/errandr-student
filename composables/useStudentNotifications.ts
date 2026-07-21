import { getToken, onMessage } from 'firebase/messaging';
import { useNuxtApp, useRuntimeConfig } from '#app';
import { users_api } from '@/api_factory/modules/users';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useStudentNotifications = () => {
  const { $messaging } = useNuxtApp();
  const config = useRuntimeConfig();
  const { showToast } = useCustomToast();

  const requestPermissionAndRegister = async () => {
    if (!$messaging) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Try to get existing registration or wait with a timeout
        let registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          try {
            registration = await Promise.race([
              navigator.serviceWorker.ready,
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
            ]) as ServiceWorkerRegistration;
          } catch (err) {
            console.warn('Service worker not ready in time, falling back to default messaging SW');
          }
        }
        
        const currentToken = await getToken($messaging, { 
          vapidKey: config.public.firebaseVapidKey || 'BJJs2JX_V36p-9sfug38GwMMGDWSQMObywAkys73EXlJgLEsiQaF6nRMDzVVjdgDb-MHJyw3Q_atT6KaluQN41I',
          serviceWorkerRegistration: registration || undefined
        });
        
        if (currentToken) {
          console.log('FCM Token:', currentToken);
          // Send to backend
          await users_api.updateFcmToken({ token: currentToken });
        }
      }
    } catch (e) {
      console.error('Error getting notification permission:', e);
    }
  };

  const listenForNotifications = () => {
    if (!$messaging) return;
    
    onMessage($messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      const title = payload.notification?.title || payload.data?.title || 'New Notification';
      const body = payload.notification?.body || payload.data?.body || 'You have a new message';

      showToast({
        title: title,
        message: body,
        toastType: 'notification'
      });

      // Play sound
      try {
        const audio = new Audio('/sounds/order-alert.mp3');
        audio.play().catch(e => console.log('Audio play prevented:', e));
      } catch (e) {}
    });
  };

  return {
    requestPermissionAndRegister,
    listenForNotifications
  };
};
