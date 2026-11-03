import type { Plugin } from 'vite';

/** Folders under public/ served as their own pages (not precached, not answered with the app shell). */
export const STANDALONE_PAGES = ['tanitim/'];

/** Precache the complete local build, including lazy lessons, under the deployed subpath. */
export function offlineApp(): Plugin {
  return {
    name: 'reactor-offline-app', apply: 'build',
    generateBundle(_options, bundle) {
      const files = ['index.html', ...Object.keys(bundle).filter(name => /\.(js|css)$/.test(name)), 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
      // Content-hashed JS/CSS names give every changed build a distinct cache.
      const version = Object.keys(bundle).sort().map(name => {
        const item = bundle[name];
        return name + (item.type === 'chunk' ? item.code : String(item.source));
      }).join('|');
      let hash = 2166136261;
      for (const char of version) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: `
const PREFIX = 'reactor-app:' + self.registration.scope;
const CACHE = PREFIX + ':${hash >>> 0}';
const FILES = ${JSON.stringify(files)}.map(path => new URL(path, self.registration.scope).href);
// Standalone pages (e.g. the intro video) are plain network pages, never the app shell.
const STANDALONE = ${JSON.stringify(STANDALONE_PAGES)}.map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX + ':') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (STANDALONE.some(prefix => url.href.startsWith(prefix))) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(new URL('index.html', self.registration.scope).href)).then(page => page || fetch(event.request)));
  } else if (FILES.includes(url.href)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request)).then(hit => hit || fetch(event.request)));
  }
});
` });
    },
  };
}
