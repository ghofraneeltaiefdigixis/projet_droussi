//--------------------------------------------------------------------------
// Droussi PWA - Service Worker
// Référence: https://github.com/mozilla/serviceworker-cookbook
//--------------------------------------------------------------------------

var CACHE_VERSION = '3.4';
var CACHE_NAME = 'Droussi-cache-v' + CACHE_VERSION;

var NETWORK_FIRST_PATTERNS = [
  /\.html(\?|$)/i,
  /app\.js(\?|$)/i,
  /style_app\.css(\?|$)/i
];

function isNetworkFirstRequest(url) {
  var path = url.pathname || url.href;
  return NETWORK_FIRST_PATTERNS.some(function(re) { return re.test(path); });
}

var REQUIRED_FILES = [
  './',
  './index.html',
  './Choix_role.html',
  './Connexion.html',
  './Parent.html',
  './Teacher.html',
  './gouvernorat.html',
  './delegation.html',
  './ecole.html',
  './classe.html',
  './abonnement.html',
  './devoir_maison.html',
  './parametres.html',
  './assistantIA.html',
  './chat.html',
  './notification.html',
  './CU.html',
  './Politique.html',
  './assets/css/style_app.css',
  './assets/js/app.js',
  './__manifest.json'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return Promise.allSettled(REQUIRED_FILES.map(function(url) {
          return fetch(url, { cache: 'reload' })
            .then(function(response) {
              if (response && response.ok) return cache.put(url, response);
              return Promise.resolve();
            })
            .catch(function() { return Promise.resolve(); });
        })).then(function() { return self.skipWaiting(); });
      })
      .catch(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('fetch', function (event) {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  var url = new URL(event.request.url);
  
  // Ignorer les requêtes vers des domaines externes (sauf CDN)
  if (url.origin !== location.origin && !url.href.includes('cdn.jsdelivr.net')) {
    return;
  }

  // Ignorer les requêtes chrome-extension et autres protocoles spéciaux
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  if (url.origin === location.origin && isNetworkFirstRequest(url)) {
    event.respondWith(
      fetch(event.request, { cache: 'reload' })
        .then(function (response) {
          if (response && response.status === 200 && response.type !== 'error') {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (c) { c.put(event.request, clone).catch(function() {}); });
          }
          return response;
        })
        .catch(function () {
          return caches.match(event.request, { ignoreSearch: true })
            .then(function (cached) {
              if (cached) return cached;
              if (event.request.destination === 'document') return caches.match('./index.html');
              return new Response('Hors ligne', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
    return;
  }

  var path = (url.pathname || url.href).toLowerCase();
  var isStaticAsset = /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|json)(\?|$)/i.test(path) ||
    path === '/__manifest.json' || path.endsWith('__manifest.json');
  var isDocument = event.request.mode === 'navigate' || event.request.destination === 'document';

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(function (cached) {
        if (cached) return cached;
        return fetch(event.request).then(function (response) {
          if (!response || response.status !== 200 || response.type === 'error') return response;
          if (url.origin === location.origin && (isStaticAsset || isDocument)) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (c) { c.put(event.request, clone).catch(function() {}); });
          }
          return response;
        }).catch(function () {
          if (event.request.destination === 'document') return caches.match('./index.html');
          return new Response('Ressource non disponible hors ligne', { status: 503, statusText: 'Service Unavailable', headers: new Headers({ 'Content-Type': 'text/plain' }) });
        });
      })
  );
});

// Permettre à la page de demander l'activation immédiate (éviter Ctrl+F5)
self.addEventListener('message', function (event) {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.map(function (name) {
        return name !== CACHE_NAME ? caches.delete(name) : Promise.resolve();
      }));
    }).then(function () { return self.clients.claim(); })
  );
});