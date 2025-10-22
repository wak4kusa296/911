const CACHE_NAME = 'command-system-v1';
const urlsToCache = [
  './',
  './index.html',
  // './scenario.csv',  ← ★★★ これを削除（キャッシュしない）★★★
  './DSEG7ClassicMini-Bold.woff',
  './icon-192.png',
  './icon-512.png'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// リクエスト時の処理
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // ★★★ scenario.csv は常にネットワークから取得 ★★★
  if (url.pathname.endsWith('scenario.csv')) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
    );
    return;
  }
  
  // その他のリソースはキャッシュ優先
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});