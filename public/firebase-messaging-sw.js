importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Try query string params first (from PWA workbox import), fall back to hardcoded values
const urlParams = new URL(location).searchParams;
const firebaseConfig = {
  apiKey: urlParams.get('apiKey') || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
  projectId: urlParams.get('projectId') || 'erranders-493fe',
  messagingSenderId: urlParams.get('messagingSenderId') || '1022790982621',
  appId: urlParams.get('appId') || '1:1022790982621:web:771af2aab7a6e7a200b434',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    requireInteraction: true // This ensures the notification stays until the vendor clicks it
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let urlToOpen = '/dashboard';

  // If it's a chat message, open the chat page
  if (data.type === 'NEW_CHAT_MESSAGE' && data.orderId) {
    urlToOpen = `/chat/${data.orderId}?target=vendor`;
  } else if (data.orderId) {
    urlToOpen = `/dashboard/orders/${data.orderId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
