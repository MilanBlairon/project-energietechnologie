/**
 * Project: SmappeeSim | Webapp by Milan Blairon
 * Doel: Gemaakt als optioneel project voor het vak Webdevelopment 2 
 *       (lector J. Reinenbergh), richting bachelor Elektronica-ICT
 *       aan VIVES Hogeschool Kortrijk.
 *
 * Context: Deze webapp werd ontwikkeld als hulp voor twee studenten Energietechnologie 
 *          die hun bachelorproef uitvoeren bij Smappee. 
 *          Alle logo’s en merkmaterialen werden met toestemming van de studenten gebruikt. 
 *          Milan Blairon is niet aansprakelijk voor gebruik van deze elementen buiten deze context.
 *
 * Auteursrecht: © 2025 Milan Blairon. Alle rechten voorbehouden.
 *               Licentie: MIT. Deze code mag door Smappee en derden gebruikt worden mits duidelijke naamsvermelding.
 *
 * Contact: r0981022@student.vives.be
 */

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
