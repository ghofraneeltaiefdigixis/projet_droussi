//--------------------------------------------------------------------------
// You can find dozens of practical, detailed, and working examples of 
// service worker usage on https://github.com/mozilla/serviceworker-cookbook
//--------------------------------------------------------------------------

<<<<<<< Updated upstream
// Cache version
var CACHE_VERSION = '3.0';
=======
// Cache version (incrémenter à chaque déploiement pour invalider le cache)
var CACHE_VERSION = '3.2';
>>>>>>> Stashed changes

// Cache name
var CACHE_NAME = 'Droussi-cache-v' + CACHE_VERSION;

<<<<<<< Updated upstream
=======
// Fichiers critiques : réseau d'abord (pour voir les mises à jour sans Ctrl+F5)
var NETWORK_FIRST_PATTERNS = [
  /\.html(\?|$)/i,
  /app\.js(\?|$)/i,
  /style_app\.css(\?|$)/i
];

function isNetworkFirstRequest(url) {
  var path = url.pathname || url.href;
  return NETWORK_FIRST_PATTERNS.some(function(re) { return re.test(path); });
}

>>>>>>> Stashed changes
// Files to cache on install
var REQUIRED_FILES = [
  './',
  './index.html',
  './Choix_role.html',
  './Connexion.html',
  './Parent.html',
  './Teacher.html',
  './gouvernorat.html',
<<<<<<< Updated upstream
  './classe.html',
  './assets/css/style_app.css',
  './assets/js/app.js',
=======
  './delegation.html',
  './ecole.html',
  './classe.html',
  './abonnement.html',
  './notification.html',
  './CU.html',
  './Politique.html',
  './assets/css/style_app.css',
  './assets/js/app.js',
  './assets/js/utils.js',
  './assets/css/utilities.css',
>>>>>>> Stashed changes
  './__manifest.json'
];

self.addEventListener('install', function (event) {
<<<<<<< Updated upstream
=======
  console.log('[Service Worker] Installation en cours...');
>>>>>>> Stashed changes
  // Perform install step: loading each required file into cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
<<<<<<< Updated upstream
        // Add all offline dependencies to the cache
        return cache.addAll(REQUIRED_FILES).catch(function (error) {
          console.error('Erreur lors de la mise en cache:', error);
          // Continue même si certains fichiers échouent
=======
        console.log('[Service Worker] Ouverture du cache:', CACHE_NAME);
        // Essayer de mettre en cache les fichiers un par un pour éviter l'échec complet
        return Promise.allSettled(REQUIRED_FILES.map(function(url) {
          return fetch(url)
            .then(function(response) {
              if (response.ok) {
                return cache.put(url, response);
              } else {
                console.warn('[Service Worker] Réponse non OK pour:', url, response.status);
                return Promise.resolve();
              }
            })
            .catch(function(err) {
              console.warn('[Service Worker] Impossible de mettre en cache:', url, err.message);
              return Promise.resolve(); // Continuer même en cas d'erreur
            });
        })).then(function(results) {
          var successCount = results.filter(function(r) { return r.status === 'fulfilled'; }).length;
          console.log('[Service Worker] Fichiers mis en cache:', successCount + '/' + REQUIRED_FILES.length);
>>>>>>> Stashed changes
        });
      })
      .then(function () {
        console.log('[Service Worker] Installation terminée, activation...');
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('[Service Worker] Erreur lors de l\'installation:', error);
        // Continuer même en cas d'erreur
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function (event) {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

<<<<<<< Updated upstream
=======
  var url = new URL(event.request.url);
  
  // Ignorer les requêtes vers des domaines externes (sauf CDN)
  if (url.origin !== location.origin && !url.href.includes('cdn.jsdelivr.net')) {
    return;
  }

  // Ignorer les requêtes chrome-extension et autres protocoles spéciaux
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Pour HTML, app.js et style_app.css : réseau d'abord (évite le cache persistant)
  if (url.origin === location.origin && isNetworkFirstRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          if (response && response.status === 200 && response.type !== 'error') {
            var responseToCache = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, responseToCache).catch(function() {});
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match(event.request, { ignoreSearch: true })
            .then(function (cached) {
              if (cached) return cached;
              if (event.request.destination === 'document') {
                return caches.match('./index.html');
              }
              return new Response('Hors ligne', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
    return;
  }

  // Pour le reste : cache d'abord (comportement classique PWA)
>>>>>>> Stashed changes
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true})
      .then(function (response) {
        if (response) {
          return response;
        }
<<<<<<< Updated upstream
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
=======
        return fetch(event.request)
          .then(function (response) {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            if (url.origin === location.origin && response.status === 200) {
              var responseToCache = response.clone();
              caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, responseToCache).catch(function() {});
              });
            }
            return response;
          })
          .catch(function (error) {
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            return new Response('Ressource non disponible hors ligne', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain' })
            });
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  console.log('[Service Worker] Activation en cours...');
>>>>>>> Stashed changes
  event.waitUntil(
    // Supprimer les anciens caches
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
<<<<<<< Updated upstream
            console.log('Suppression de l\'ancien cache:', cacheName);
=======
            console.log('[Service Worker] Suppression de l\'ancien cache:', cacheName);
>>>>>>> Stashed changes
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(function () {
<<<<<<< Updated upstream
      // Prendre le contrôle de toutes les pages
      return self.clients.claim();
    })
=======
      console.log('[Service Worker] Activation terminée');
      // Prendre le contrôle de toutes les pages
      return self.clients.claim();
    })
    .catch(function(error) {
      console.error('[Service Worker] Erreur lors de l\'activation:', error);
    })
>>>>>>> Stashed changes
  );
});