/**
 * Project: SmappeeSim | Webapp by Milan Blairon
 * Doel: Gemaakt als optioneel project voor het vak Webdevelopment 2 
 *       (lector R. Reinenbergh), richting bachelor Elektronica-ICT
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

/**
 * Configuratie constanten voor de SmappeeSim applicatie
 */

// Afrondingsconstanten
export const Pf_rounding = 2;   // Aantal decimalen voor PF
export const Q_rounding = 0;    // Aantal decimalen voor Q
export const S_rounding = 0;    // Aantal decimalen voor S
export const P_rounding = 0;    // Aantal decimalen voor P
export const I_rounding = 2;    // Aantal decimalen voor I

// Standaard stroomsterkte waarden voor apparaten per netwerktype
export const defaultDeviceAmperages = {
  // Voor 1F en split-phase netwerken
  singlePhase: {
    "Oven": 14,
    "Vaatwasser": 9,
    "Wasmachine": 7,
    "Droogkast": 8,
    "Ventilator": 2,
    "Boiler": 7,
    "Airco": 5,
    "Fornuis": 12,
    "Jacuzzi": 8,
    "Lift": 18,
    "Motor": 3,
    "Pomp": 5,
    "Sauna": 13,
    "Verwarming": 13,
    "Warmte-element": 5,
    "Warmtepomp": 7,
    "Waterpomp": 4,
    "Zonnewering": 2,
    "Zwembad": 15,
    "Andere": null
  },
  // Voor 3F netwerken
  threePhase: {
    "Laadstation": 16,
    "Jacuzzi": 3,
    "Lift": 6,
    "Motor": 3,
    "Oven": 5,
    "Pomp": 2,
    "Sauna": 9,
    "Warmtepomp": 7,
    "Zwembad": 8,
    "Andere": null
  },
  // EV laders
  evChargers: {
    "EV Base": 16,
    "EV One": 16,
    "EV Ultra": 16,
    "EV Wall": 16
  },
  // Zonnepaneel omvormers
  inverters: {
    "Omvormer": 6.73
  }
};