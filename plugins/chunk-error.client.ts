export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (error) => {
    // If a chunk fails to load, gracefully reload the page to clear the cache
    if (error && error.message && (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed'))) {
      const isReloaded = sessionStorage.getItem('chunk_reloaded');
      if (!isReloaded) {
        sessionStorage.setItem('chunk_reloaded', 'true');
        window.location.reload();
      } else {
        sessionStorage.removeItem('chunk_reloaded');
        console.error('Failed to load chunk after reload. Cache might be corrupted.');
      }
    }
  });

  nuxtApp.hook('page:start', () => {
    sessionStorage.removeItem('chunk_reloaded');
  });
});
