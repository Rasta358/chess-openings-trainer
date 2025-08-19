const CACHE_NAME = 'openings-trainer-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icon-512.png',
  './data/openings.json'
];
self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (evt) => {
  evt.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
});
self.addEventListener('fetch', (evt) => {
  evt.respondWith(caches.match(evt.request).then(res => res || fetch(evt.request)));
});
