const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

/**
 * Registers the service worker, in development too (the dev server builds the offline page for it).
 * It only caches the offline page, so there's no "new version" prompt: online, the app always loads
 * fresh. New workers are still picked up regularly so the offline page doesn't lag behind.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      const checkForUpdate = () => registration.update().catch(() => undefined);
      setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkForUpdate();
        }
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}
