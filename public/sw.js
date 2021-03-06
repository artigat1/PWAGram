var CACHE_STATIC_NAME = 'static-v10.6';
var CACHE_DYNAMIC_NAME = 'dynamic-v7.1';

self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches
            .open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[Service Worker] Pre-caching app shell');
                cache.addAll([
                    '/',
                    '/index.html',
                    '/offline.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    '/src/js/promise.js',
                    '/src/js/material.min.js',
                    '/src/js/fetch.js',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/main-image.jpg',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https:/fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ]);
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('[Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

// Cache with network fallback strategy.
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request)
//             .then(function (response) {
//                 if (response) {
//                     return response;
//                 }
//
//                 return fetch(event.request)
//                     .then(function (res) {
//                         caches
//                             .open(CACHE_DYNAMIC_NAME)
//                             .then(function (cache) {
//                                 cache.put(event.request.url, res.clone());
//                                 return res;
//                             });
//                     })
//                     .catch(function (err) {
//                         return caches
//                             .open(CACHE_STATIC_NAME)
//                             .then(function (cache) {
//                                 return cache.match('/offline.html');
//                             });
//                     });
//             })
//     );
// });

// Cache only strategy
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request)
//     );
// });

// Network only strategy
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         fetch(event.request)
//     );
// });

// Network with cache fallback strategy.
self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
            .then(function(res) {
                return caches
                    .open(CACHE_DYNAMIC_NAME)
                    .then(function (cache) {
                        cache.put(event.request.url, res.clone());
                        return res;
                    });
            })
            .catch(function(err){
                return caches.match(event.request)
            })
    );
});
