// Seeded PSLE Recall Challenge — hand-written service worker (classic worker, NOT an ES module).
//
// The offline promise: after ONE online load, the full generate -> answer -> mark -> share loop
// works with the network disabled. Everything the app needs (shell + question bank) is precached
// and served cache-first.
//
// Versioning: the cache name carries QUESTION_BANK_VERSION. Bumping it (a new bank ships) mints a
// fresh cache on install; `activate` then deletes every stale-version cache and claims open clients,
// so cached players pick up the new bank on next activate WITHOUT breaking the current offline
// session (the old cache keeps serving until the new one is fully installed).

const QUESTION_BANK_VERSION = 1;
const CACHE_NAME = 'psle-v' + QUESTION_BANK_VERSION;

// The app shell — everything required to run fully offline. All same-origin, resolved relative to
// the service-worker scope so it works under a GitHub Pages project subpath.
const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './prng.js',
  './sampler.js',
  './marker.js',
  './checkRules.js',
  './validation.js',
  './render.js',
  './share.js',
  './questions.json',
  './manifest.webmanifest'
];

// Broadcast readiness to every controlled client so app.js can flip #offline-indicator to
// .offline-indicator--ready. Sent both as a postMessage and (defensively) works alongside the
// 'sw:ready' CustomEvent app.js dispatches on receipt.
async function postReady() {
  const clientList = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const client of clientList) {
    client.postMessage({ type: 'SW_READY', version: QUESTION_BANK_VERSION });
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // addAll is atomic: if any asset fails to fetch, install fails and the old cache stays live,
      // preserving the existing offline promise.
      await cache.addAll(PRECACHE_URLS);
      // Take over as soon as this version is installed so a bank bump activates on next load.
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('psle-v') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
      await postReady();
    })()
  );
});

// Cache-first for same-origin GET requests: once precached, the generate -> answer -> mark -> share
// loop never touches the network. Cross-origin (e.g. wa.me / t.me share intents) and non-GET pass
// straight through.
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const cached = await cache.match(request);
      if (cached) return cached;

      // Not precached (or a navigation to a deep path): try the network, fall back to the cached
      // shell so navigations still resolve offline.
      try {
        const response = await fetch(request);
        if (response && response.ok && response.type === 'basic') {
          cache.put(request, response.clone());
        }
        return response;
      } catch (err) {
        if (request.mode === 'navigate') {
          const shell = await cache.match('./index.html');
          if (shell) return shell;
        }
        throw err;
      }
    })()
  );
});

// Let the page ask for readiness (e.g. if it registered after activation already fired) and support
// an explicit skipWaiting nudge for a freshly shipped bank version.
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'CHECK_READY') {
    event.waitUntil(postReady());
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
