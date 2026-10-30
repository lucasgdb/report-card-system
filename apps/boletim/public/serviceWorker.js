/*
 * Usefaz Boletim service worker.
 *
 * The app itself is never cached: pages, scripts and API calls always come from the network, so a
 * student online always sees the latest version. Only the offline kit is cached — the offline page
 * (which shows the last report card saved in localStorage) and what it needs — plus font files.
 *
 * Keep this file at /serviceWorker.js: installed clients are registered with this URL.
 */

const VERSION = 'v12';
const OFFLINE_CACHE = `usefaz-offline-${VERSION}`;
const FONT_CACHE = 'usefaz-fonts-v2';
const OFFLINE_URL = '/offline.html';
const FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&family=Lexend:wght@500..700&display=swap';

const OFFLINE_KIT = [
  OFFLINE_URL,
  '/offline.bundle.js',
  '/manifest.webmanifest',
  '/assets/icons/usefaz_mark.svg',
  '/assets/icons/logo.png',
  '/assets/icons/clap.svg',
  '/assets/images/usefaz_logo.svg',
  '/assets/images/z_logo.svg',
  '/assets/images/home_icons.svg',
  FONTS_CSS_URL,
];

const isOfflineKitRequest = (url) =>
  OFFLINE_KIT.includes(url.origin === self.location.origin ? url.pathname : url.href);

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      // `reload` skips the HTTP cache so the kit matches the deployed version.
      await cache.addAll(OFFLINE_KIT.map((url) => new Request(url, { cache: 'reload' })));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = [OFFLINE_CACHE, FONT_CACHE];
      const names = await caches.keys();
      await Promise.all(names.filter((name) => !keep.includes(name)).map((name) => caches.delete(name)));

      // Starts navigation requests in parallel with the worker boot, so network-first costs nothing.
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      await self.clients.claim();
    })()
  );
});

const networkFirst = async (request, cacheName) => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    // ignoreVary: module scripts are requested with an Origin header the install request didn't have.
    return (await caches.match(request, { ignoreVary: true })) ?? Response.error();
  }
};

const cacheFirst = async (request, cacheName) => {
  const cached = await caches.match(request, { ignoreVary: true });
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Pages: always the network (with navigation preload); the offline page only when it fails.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return (await event.preloadResponse) ?? (await fetch(request));
        } catch {
          return (await caches.match(OFFLINE_URL, { ignoreVary: true })) ?? Response.error();
        }
      })()
    );
    return;
  }

  // Font files never change for a given URL.
  if (url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // The offline kit stays fresh while online and is served from the cache when offline.
  if (isOfflineKitRequest(url)) {
    event.respondWith(networkFirst(request, OFFLINE_CACHE));
  }

  // Everything else (the app, the API) is left to the browser: network only.
});
