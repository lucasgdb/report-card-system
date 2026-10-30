import __DEV__ from '../utils/__DEV__';

type Grecaptcha = {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

let loading: Promise<Grecaptcha> | null = null;

const load = () =>
  new Promise<Grecaptcha>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.recaptcha.net/recaptcha/api.js?render=${process.env.RECAPTCHA_V3_PUBLIC_TOKEN}&hl=pt-BR`;
    script.async = true;
    script.onload = () => window.grecaptcha?.ready(() => resolve(window.grecaptcha!));
    script.onerror = () => {
      script.remove();
      loading = null;
      reject(new Error('reCAPTCHA failed to load'));
    };
    document.head.append(script);
  });

/**
 * Starts loading Google reCAPTCHA v3 (a heavy third-party script) without waiting for it. Call it when
 * the user shows intent — e.g. focusing the login form — so it never delays the page's first paint.
 */
export function preloadRecaptcha() {
  if (!__DEV__) {
    loading ??= load();
    loading.catch(() => {});
  }
}

/** A reCAPTCHA token for `action`. Empty in development, where the server skips the check. */
export async function getRecaptchaToken(action: string) {
  if (__DEV__) {
    return '';
  }
  loading ??= load();
  const grecaptcha = await loading;
  return grecaptcha.execute(process.env.RECAPTCHA_V3_PUBLIC_TOKEN!, { action });
}
