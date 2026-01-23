//--------------------------------------------------------------------------
// You can find dozens of practical, detailed, and working examples of 
// service worker usage on https://github.com/mozilla/serviceworker-cookbook
//--------------------------------------------------------------------------

// Cache version
var CACHE_VERSION = '3.0';

// Cache name
var CACHE_NAME = 'Droussi-cache-v' + CACHE_VERSION;

// Files to cache on install
var REQUIRED_FILES = [
  './',
  './index.html',
  './Choix_role.html',
  './Connexion.html',
  './Parent.html',
  './Teacher.html',
  './gouvernorat.html',
  './classe.html',
  './assets/css/style_app.css',
  './assets/js/app.js',
  './__manifest.json'
];

self.addEventListener('install', function (event) {
  // Perform install step: loading each required file into cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        // Add all offline dependencies to the cache
        return cache.addAll(REQUIRED_FILES).catch(function (error) {
          console.error('Erreur lors de la mise en cache:', error);
          // Continue même si certains fichiers échouent
        });
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function (event) {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request)
          .then(function (response) {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse pour la mettre en cache
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(function (error) {
            console.error('Erreur lors du fetch:', error);
            // Retourner une réponse de fallback si disponible
            return caches.match('./index.html');
          });
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    // Supprimer les anciens caches
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(function () {
      // Prendre le contrôle de toutes les pages
      return self.clients.claim();
    })
  );
});