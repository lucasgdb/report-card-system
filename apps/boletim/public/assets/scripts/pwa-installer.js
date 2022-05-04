/* eslint-disable no-console */

const setUpServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('./serviceWorker.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      registration.onupdatefound = async () => {
        try {
          if (this.update) {
            await this.update();
            console.log('ServiceWorker updating successful with scope:', this.scope);
          }
        } catch (err) {
          console.log('ServiceWorker updating failed:', err);
        }
      };

      console.log('ServiceWorker registration successful with scope:', registration.scope);
    } catch (err) {
      console.log('ServiceWorker registration failed:', err);
    }
  }
};

setUpServiceWorker();
