/* eslint-disable no-restricted-globals */
const OFFLINE_CACHE_VERSION = 1;
const ASSETS_CACHE_VERSION = 1;
const URLS_CACHE_VERSION = 1;

const CURRENT_CACHES = {
  offline: `offline-v${OFFLINE_CACHE_VERSION}`,
  assets: `assets-v${ASSETS_CACHE_VERSION}`,
  urls: `urls-v${URLS_CACHE_VERSION}`,
};

const filesToCache = ['/offline.html', '/offline.bundle.js'];

const assetsToCache = [
  '/assets/icons/art.svg',
  '/assets/icons/computing.svg',
  '/assets/icons/english.svg',
  '/assets/icons/geography.svg',
  '/assets/icons/history.svg',
  '/assets/icons/math.svg',
  '/assets/icons/philosophy_and_ethics.svg',
  '/assets/icons/physical_education.svg',
  '/assets/icons/portuguese_language.svg',
  '/assets/icons/science.svg',
  '/assets/icons/clap.svg',

  '/assets/images/usefaz_logo.svg',
  '/assets/images/z_logo.svg',
  '/assets/images/home_icons.svg',
];

const urlsToCache = [
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap',
];

const createCacheBustedRequest = (url) => {
  const request = new Request(url, { cache: 'reload' });

  if ('cache' in request) {
    return request;
  }

  const bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += `${bustedUrl.search ? '&' : ''}cachebust=${Date.now()}`;
  return new Request(bustedUrl);
};

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    filesToCache.map((fileToCache) =>
      fetch(createCacheBustedRequest(fileToCache)).then(async (response) => {
        const cache = await caches.open(CURRENT_CACHES.offline);
        return cache.put(fileToCache, response);
      })
    ),
    assetsToCache.map((assetToCache) =>
      fetch(createCacheBustedRequest(assetToCache)).then(async (response) => {
        const cache = await caches.open(CURRENT_CACHES.assets);
        return cache.put(assetToCache, response);
      })
    ),
    urlsToCache.map((urlToCache) =>
      fetch(createCacheBustedRequest(urlToCache)).then(async (response) => {
        const cache = await caches.open(CURRENT_CACHES.urls);
        return cache.put(urlToCache, response);
      })
    )
  );
});

self.addEventListener('activate', (event) => {
  const expectedCacheNames = Object.values(CURRENT_CACHES);

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => expectedCacheNames.indexOf(cacheName) === -1)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).catch(() => caches.match('/offline.html'));
    })
  );
});
