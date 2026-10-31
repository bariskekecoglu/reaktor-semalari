import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

// Exercise the generated worker at a deployment subpath without a browser or network.
const scope = 'https://example.invalid/reactor-lab/';
const handlers = new Map();
const stores = new Map([
  [`reactor-app:${scope}:old`, new Map()],
  ['unrelated-app-cache', new Map()],
]);
const cached = [];
const cacheApi = {
  async open(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      async addAll(urls) {
        for (const url of urls) {
          assert.ok(url.startsWith(scope), `Out-of-scope asset: ${url}`);
          const file = url.slice(scope.length);
          assert.ok(existsSync(new URL(`../dist/${file}`, import.meta.url)), `Missing asset: ${file}`);
          store.set(url, { url, ok: true }); cached.push(file);
        }
      },
      async match(request) { return store.get(typeof request === 'string' ? request : request.url); },
    };
  },
  async keys() { return [...stores.keys()]; },
  async delete(name) { return stores.delete(name); },
};
vm.runInNewContext(readFileSync(new URL('../dist/sw.js', import.meta.url), 'utf8'), {
  URL, caches: cacheApi,
  fetch() { throw new Error('Unexpected network request while offline'); },
  self: { registration: { scope }, location: { origin: new URL(scope).origin }, clients: { async claim() {} }, addEventListener(type, handler) { handlers.set(type, handler); } },
});
for (const phase of ['install', 'activate']) {
  let job;
  handlers.get(phase)({ waitUntil(promise) { job = promise; } });
  await job;
}
assert.ok(!stores.has(`reactor-app:${scope}:old`));
assert.ok(stores.has('unrelated-app-cache'));
assert.ok(cached.includes('manifest.webmanifest'));
assert.ok(cached.includes('icon-192.png') && cached.includes('icon-512.png'));
assert.ok(cached.filter(file => file.endsWith('.js')).length >= 3, 'Lazy lessons must be cached');
for (const file of [...cached, 'a-deep-link']) {
  let response;
  handlers.get('fetch')({ request: { url: scope + file, method: 'GET', mode: file === 'a-deep-link' ? 'navigate' : 'cors' }, respondWith(promise) { response = promise; } });
  assert.ok((await response)?.ok, `Offline response missing: ${file}`);
}
for (const url of ['https://external.invalid/source.pdf', 'https://example.invalid/api/private']) {
  handlers.get('fetch')({ request: { url, method: 'GET', mode: 'cors' }, respondWith() { assert.fail('Unrelated request was intercepted'); } });
}
const manifest = JSON.parse(readFileSync(new URL('../dist/manifest.webmanifest', import.meta.url), 'utf8'));
assert.equal(manifest.start_url, './');
assert.equal(manifest.scope, './');
assert.equal(manifest.display, 'standalone');
for (const icon of manifest.icons) {
  const png = readFileSync(new URL(`../dist/${icon.src}`, import.meta.url));
  const [w, h] = icon.sizes.split('x').map(Number);
  assert.equal(png.readUInt32BE(16), w); assert.equal(png.readUInt32BE(20), h);
}
console.log(`Offline worker checks passed: ${cached.length} local assets, subpath navigation, cache isolation and PNG icons.`);
