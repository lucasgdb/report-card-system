import { useSyncExternalStore } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

// `beforeinstallprompt` can fire before any component mounts, so it's captured at startup.
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

export function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Whether the browser offers installing the app, and a function that opens its install dialog. */
export function useInstallPrompt() {
  const prompt = useSyncExternalStore(
    subscribe,
    () => deferredPrompt,
    () => null
  );

  const install = async () => {
    if (!prompt) {
      return;
    }

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
      notify();
    }
  };

  return { canInstall: prompt !== null, install };
}
