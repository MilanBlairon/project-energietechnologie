self.addEventListener("install", event => {
    console.log("Service Worker geïnstalleerd.");
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    console.log("Service Worker geactiveerd.");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    event.respondWith(fetch(event.request));
});
