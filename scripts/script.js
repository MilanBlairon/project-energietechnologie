/**
 * Project: SmappeeSim | Webapp by Milan Blairon
 * Doel: Gemaakt als optioneel project voor het vak Webdevelopment 2 
 *       (lector R. Reinenbergh), richting bachelor Elektronica-ICT
 *       aan VIVES Hogeschool Kortrijk.
 *
 * Context: Deze webapp werd ontwikkeld als hulp voor twee studenten Energietechnologie 
 *          die hun bachelorproef uitvoeren bij Smappee. 
 *          Alle logo's en merkmaterialen werden met toestemming van de studenten gebruikt. 
 *          Milan Blairon is niet aansprakelijk voor gebruik van deze elementen buiten deze context.
 *
 * Auteursrecht: © 2025 Milan Blairon. Alle rechten voorbehouden.
 *               Licentie: MIT. Deze code mag door Smappee en derden gebruikt worden mits duidelijke naamsvermelding.
 *
 * Contact: r0981022@student.vives.be
 */
// Importeer configuratie constanten
import {
  Pf_rounding,
  Q_rounding,
  S_rounding,
  P_rounding,
  I_rounding,
  defaultDeviceAmperages
} from './config/config.js';

import {
  translations
} from './config/translations.js';

document.addEventListener('DOMContentLoaded', () => {
  init();

  // Stel taalkeuzeknoppen in
  const langButtons = document.querySelectorAll('.lang-btn');
  const languageSwitch = document.getElementById('languageSwitch');

  // Functie om taal te wijzigen en naar configuratiepagina te navigeren
  const changeLanguage = (lang) => {
    // Pas vertalingen toe op basis van de geselecteerde taal
    setLanguage(lang);

    // Verberg taalselectiepagina en toon configuratiepagina
    togglePage("languageSelector", false);
    setTimeout(() => {
      togglePage("config", true);
    }, 500);
  };

  // Voeg klikgebeurtenisluisteraars toe aan taalknoppen
  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang');
      changeLanguage(lang);
    });
  });

  // Verwerk ook taalwijzigingen van de dropdown in de configuratiepagina
  if (languageSwitch) {
    languageSwitch.addEventListener('change', () => {
      setLanguage(languageSwitch.value);
    });
  }

  // Begin altijd met de taalselectiepagina zichtbaar en de configuratiepagina verborgen
  document.getElementById('config').hidden = true;
  document.getElementById('languageSelector').hidden = false;

  // Verberg initieel alle configuratiesecties tot het netwerktype is geselecteerd
  const configSections = document.querySelectorAll('.config-section');
  configSections.forEach(section => {
    section.hidden = true;
  });

  // Voeg gebeurtenisluisteraar toe voor netwerktypeselectie
  document.getElementById("netType").addEventListener("change", updateConfigVisibility);
});

// Initialisatiefunctie
function init() {
  // Stel standaardtaal in
  const defaultLanguage = 'nl'; // of je voorkeurstaal
  setLanguage(defaultLanguage);

  // Configuratiepagina is standaard zichtbaar (geen hidden attribuut nodig in HTML)

  // Zorg dat de taalwissel nog steeds werkt
  document.getElementById('languageSwitch').addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });

}

// Taalimplementatie
function setLanguage(lang) {
  // Werk HTML lang attribuut bij
  document.documentElement.lang = lang;

  // Werk dropdown selector bij
  document.getElementById('languageSwitch').value = lang;

  // Werk alle tekstelelementen bij met vertalingen
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      // Speciale behandeling voor config_title als netwerktype is geselecteerd
      if (key === 'config_title') {
        const netType = document.getElementById("netType").value;
        if (netType) {
          const selectedOption = document.querySelector(`#netType option[value="${netType}"]`);
          if (selectedOption) {
            element.textContent = `${translations[lang][key]}: ${selectedOption.textContent}`;
            return; // Sla standaardtoewijzing over
          }
        }
      }

      // Meting titel aanpassen indien taal verandert
      if (key === 'measure_title') {
        const netType = document.getElementById("netType").value;
        if (netType) {
          const selectedOption = document.querySelector(`#netType option[value="${netType}"]`);
          if (selectedOption) {
            element.textContent = `${translations[lang][key]}: ${selectedOption.textContent}`;
            return; // Sla standaardtoewijzing over
          }
        }
      }

      element.textContent = translations[lang][key];
    }
  });

  // Werk optie-elementen bij
  document.querySelectorAll('option[data-i18n]').forEach(option => {
    const key = option.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      option.textContent = translations[lang][key];
    }
  });

  // Bewaar huidige taal voor referentie
  window.currentLanguage = lang;

  // Werk verbruikerscategorieën bij
  window.verbruikersTypes = translations[lang].consumer_types;

  // Herbouw ALLE dynamische inhoud wanneer de taal verandert
  updateDynamicContent();
}

// Nieuwe functie om alle dynamische inhoud bij te werken bij taalwijziging
function updateDynamicContent() {
  // Werk zonnepaneeldetails bij indien aanwezig
  if (document.getElementById("hasSolar").value === "yes" &&
    document.getElementById("solarCount").value) {
    rebuildSolarDetails();
  }

  // Werk EV-laderdetails bij indien aanwezig
  if (document.getElementById("hasEV").value === "yes" &&
    document.getElementById("evCount").value) {
    rebuildEVDetails();
  }

  // Werk verbruikersdetails bij indien aanwezig
  if (document.getElementById("hasLoads").value === "yes" &&
    document.getElementById("loadCount").value) {
    rebuildConsumerDetails();
  }
}

// Werk elk type dynamische inhoud bij
function rebuildSolarDetails() {
  const n = parseInt(document.getElementById("solarCount").value, 10) || 0;
  const container = document.getElementById("solarDetails");
  const previousValues = [];
  const netType = document.getElementById("netType").value;

  // Bewaar huidige selectiewaarden voor herbouwen
  document.querySelectorAll("#solarDetails [data-role=solarType]").forEach(select => {
    previousValues.push(select.value);
  });

  // Wis en herbouw
  container.innerHTML = "";
  for (let i = 1; i <= n; i++) {
    const div = document.createElement("div");
    const lang = window.currentLanguage || 'nl';

    // Bepaal beschikbare opties op basis van nettype
    let typeOptions = '';

    if (netType === "1F") {
      // Bij 1F net is er maar 1 optie
      typeOptions = '<input type="hidden" data-role="solarType" value="1F"><span>1F</span>';
    } else if (netType === "split") {
      // Bij split phase kunnen alleen 1F of 2F worden gekozen
      typeOptions = `
        <select data-role="solarType">
          <option value="1F">1F</option>
          <option value="2F">2F</option>
        </select>
      `;
    } else {
      // Bij 3F (ster of driehoek) kunnen zowel 1F als 3F worden gekozen
      typeOptions = `
        <select data-role="solarType">
          <option value="1F">1F</option>
          <option value="3F">3F</option>
        </select>
      `;
    }

    div.innerHTML = `
      ${translations[lang].inverter} ${i} ${translations[lang].type}:
      ${typeOptions}
    `;
    container.appendChild(div);
  }

  // Herstel vorige selectiewaarden waar mogelijk
  document.querySelectorAll("#solarDetails [data-role=solarType]").forEach((element, index) => {
    if (previousValues[index]) {
      if (element.tagName === "SELECT") {
        // Controleer of de optie bestaat in de nieuwe lijst
        const optionExists = Array.from(element.options).some(opt => opt.value === previousValues[index]);
        if (optionExists) {
          element.value = previousValues[index];
        }
      }
    }
  });
}

function rebuildEVDetails() {
  const n = parseInt(document.getElementById("evCount").value, 10) || 0;
  const container = document.getElementById("evDetails");
  const previousValues = [];
  const netType = document.getElementById("netType").value;

  // Bewaar huidige selectiewaarden voor herbouwen (alleen voor EV type, niet voor verbinding)
  document.querySelectorAll("#evDetails [data-role=evType]").forEach(select => {
    previousValues.push(select.value);
  });

  // Wis en herbouw
  container.innerHTML = "";
  for (let i = 1; i <= n; i++) {
    const div = document.createElement("div");
    const lang = window.currentLanguage || 'nl';

    // Bepaal het verbindingstype op basis van netwerktype
    let connectionDisplay = '';

    if (netType === "1F") {
      connectionDisplay = '<span>1F</span>';
    } else if (netType === "split") {
      connectionDisplay = '<span>2F</span>';
    } else {
      connectionDisplay = '<span>3F</span>';
    }

    div.innerHTML = `
      ${translations[lang].charger} ${i} ${translations[lang].model}:
      <select data-role="evType">
        <option>EV Wall</option>
        <option>EV One</option>
        <option>EV Base</option>
        <option>EV Ultra</option>
      </select>
      |
      ${translations[lang].connection}:
      ${connectionDisplay}
    `;
    container.appendChild(div);
  }

  // Herstel vorige selectiewaarden voor EV type
  document.querySelectorAll("#evDetails [data-role=evType]").forEach((select, index) => {
    if (previousValues[index]) {
      select.value = previousValues[index];
    }
  });
}

function rebuildConsumerDetails() {
  const n = parseInt(document.getElementById("loadCount").value, 10) || 0;
  const container = document.getElementById("loadDetails");
  const previousTypeValues = [];
  const previousConnValues = [];
  const netType = document.getElementById("netType").value;

  // Bewaar huidige selectiewaarden voor herbouwen
  document.querySelectorAll("#loadDetails [data-role=loadType]").forEach(select => {
    previousTypeValues.push(select.value);
  });
  document.querySelectorAll("#loadDetails [data-role=loadConn]").forEach(select => {
    previousConnValues.push(select.value);
  });

  // Wis en herbouw
  container.innerHTML = "";
  for (let i = 1; i <= n; i++) {
    const div = document.createElement("div");
    const lang = window.currentLanguage || 'nl';

    // Gebruik de verbruikerstypes van de huidige taal
    const consumerTypes = translations[lang].consumer_types;

    // Bepaal beschikbare verbindingsopties op basis van nettype
    let connectionOptions = '';

    if (netType === "1F") {
      // Bij 1F net is er maar 1 optie
      connectionOptions = '<input type="hidden" data-role="loadConn" value="1F"><span>1F</span>';
    } else if (netType === "split") {
      // Bij split phase kunnen alleen 1F of 2F worden gekozen
      connectionOptions = `
        <select data-role="loadConn">
          <option value="1F">1F</option>
          <option value="2F">2F</option>
        </select>
      `;
    } else {
      // Bij 3F (ster of driehoek) kunnen zowel 1F als 3F worden gekozen
      connectionOptions = `
        <select data-role="loadConn">
          <option value="1F">1F</option>
          <option value="3F">3F</option>
        </select>
      `;
    }

    div.innerHTML = `
      ${translations[lang].consumer} ${i}:
      <select data-role="loadType">
        ${consumerTypes.map(t => `<option>${t}</option>`).join("")}
      </select>
      |
      ${translations[lang].connection}:
      ${connectionOptions}
    `;
    container.appendChild(div);
  }

  // Herstel vorige selectiewaarden
  document.querySelectorAll("#loadDetails [data-role=loadType]").forEach((select, index) => {
    // Zoek de beste match in nieuwe taalopties
    if (previousTypeValues[index]) {
      // Probeer een overeenkomende index te vinden in de nieuwe verbruikerstypes lijst
      const allOptions = Array.from(select.options).map(opt => opt.text);
      const bestMatch = findClosestMatch(previousTypeValues[index], allOptions);
      if (bestMatch !== -1) {
        select.selectedIndex = bestMatch;
      }
    }
  });

  document.querySelectorAll("#loadDetails [data-role=loadConn]").forEach((element, index) => {
    if (previousConnValues[index]) {
      if (element.tagName === "SELECT") {
        // Controleer of de optie bestaat in de nieuwe lijst
        const optionExists = Array.from(element.options).some(opt => opt.value === previousConnValues[index]);
        if (optionExists) {
          element.value = previousConnValues[index];
        }
      }
    }
  });
}

// Hulpfunctie om de beste match voor verbruikerstype te vinden bij het wisselen van taal
function findClosestMatch(previousValue, newOptions) {
  // Als exacte match bestaat, gebruik die
  const exactMatch = newOptions.findIndex(opt => opt === previousValue);
  if (exactMatch !== -1) return exactMatch;

  // Anders gebruik de eerste optie als fallback
  return 0;
}

// Toon/verberg configuratie-secties
[
  { toggle: "hasSolar", section: "solarSection", details: "solarDetails" },
  { toggle: "hasEV", section: "evSection", details: "evDetails" },
  { toggle: "hasLoads", section: "loadSection", details: "loadDetails" }
].forEach(({ toggle, section, details }) => {
  document.getElementById(toggle).addEventListener("change", e => {
    const tonen = e.target.value === "yes";
    document.getElementById(section).hidden = !tonen;
    if (!tonen) document.getElementById(details).innerHTML = "";
  });
});

// bindCount generator
function bindCount(countId, detailsId, generatorFn) {
  document.getElementById(countId).addEventListener("input", e => {
    const container = document.getElementById(detailsId);
    container.innerHTML = "";
    const n = parseInt(e.target.value, 10) || 0;
    for (let i = 1; i <= n; i++) {
      container.appendChild(generatorFn(i));
    }
  });
}

// Zonnepanelen-invoerdetails
bindCount("solarCount", "solarDetails", i => {
  rebuildSolarDetails();
  return document.createElement("div"); // Dummy return aangezien rebuildSolarDetails de eigenlijke aanmaak afhandelt
});

// EV-laadpunten
bindCount("evCount", "evDetails", i => {
  rebuildEVDetails();
  return document.createElement("div"); // Dummy return aangezien rebuildEVDetails de eigenlijke aanmaak afhandelt
});

// Verbruikers
bindCount("loadCount", "loadDetails", i => {
  rebuildConsumerDetails();
  return document.createElement("div"); // Dummy return aangezien rebuildConsumerDetails de eigenlijke aanmaak afhandelt
});

// Navigatie met validatie
document.getElementById("toMeasurements").onclick = () => {
  const lang = window.currentLanguage || 'nl';
  const netType = document.getElementById("netType").value;
  if (!netType) {
    return alert(translations[lang].select_network);
  }

  if (
    document.getElementById("hasSolar").value === "yes" &&
    document.getElementById("solarCount").value === ""
  ) {
    return alert(translations[lang].enter_inverter_count);
  }
  if (
    document.getElementById("hasEV").value === "yes" &&
    document.getElementById("evCount").value === ""
  ) {
    return alert(translations[lang].enter_charger_count);
  }
  if (
    document.getElementById("hasLoads").value === "yes" &&
    document.getElementById("loadCount").value === ""
  ) {
    return alert(translations[lang].enter_consumer_count);
  }

  buildMeasurementTable();
  togglePage("measure", true);
  togglePage("config", false);
};

document.getElementById("backConfig").onclick = () => {
  togglePage("config", true);
  togglePage("measure", false);
};

function togglePage(id, show) {
  const page = document.getElementById(id);

  if (!page) {
    console.error(`Pagina met id ${id} niet gevonden`);
    return;
  }

  // Als de pagina verborgen wordt
  if (!show) {
    page.style.opacity = "0";

    // Wacht tot animatie klaar is voor verbergen
    setTimeout(() => {
      page.hidden = true;
    }, 500);
  }
  // Als de pagina getoond wordt
  else {
    // Zorg eerst dat alle pagina's correct gepositioneerd zijn
    document.querySelectorAll('.page').forEach(p => {
      if (p.id !== id) {
        p.hidden = true;
      }
    });

    page.hidden = false;

    // Forceer reflow om transitie te garanderen
    void page.offsetWidth;

    // Maak zichtbaar met animatie
    page.style.opacity = "1";
  }
}

// Tabellen genereren
function buildMeasurementTable() {
  const tbody = document.getElementById("measTable");
  tbody.innerHTML = "";
  const netType = document.getElementById("netType").value;
  const lang = window.currentLanguage || 'nl';

  // Grid rijen referentie om later bij te werken
  const gridRows = {};

  function addRow(naam, fase, isGrid = false) {
    const tr = document.createElement("tr");
    const netType = document.getElementById("netType").value;
    const lang = window.currentLanguage || 'nl';

    // Haal standaard stroomsterkte op voor dit apparaat
    const defaultAmperage = isGrid ? null : getDefaultAmperage(naam, netType);

    // Maak flip knop HTML voorwaardelijk gebaseerd op of het een grid rij is
    const flipButtonHTML = isGrid ?
      '<td class="direction-cell"></td>' :
      `<td class="direction-cell"><button class="flip-clamp" title="${translations[lang].flip_clamp || 'Flip clamp direction'}">⟲</button></td>`;

    // Maak het standaard stroomsterkte waarde attribuut
    const defaultAmperageAttr = defaultAmperage !== null ?
      `value="${defaultAmperage}"` : '';

    tr.innerHTML = `
        <td>${naam}</td>
        <td></td>
        ${flipButtonHTML}
        <td class="amperage-cell"><input class="I" type="number" ${defaultAmperageAttr}/></td>
        <td></td>
        <td><input class="P" type="number"/></td>
        <td class="S">–</td>
        <td class="PF">–</td>
        <td class="Q">–</td>
        <td class="alert"></td>
      `;

    // Voeg fase dropdown toe in plaats van statische tekst
    const phaseCell = tr.querySelector("td:nth-child(2)");
    const phaseSelect = createPhaseSelector(fase, netType);
    phaseCell.appendChild(phaseSelect);

    const voltageCell = tr.querySelector("td:nth-child(5)");
    const voltageField = createVoltageField(netType, fase);
    voltageCell.appendChild(voltageField);

    // Als dit een grid rij is, sla referentie op voor latere update
    if (isGrid) {
      gridRows[fase] = tr;
    }

    // Voeg event listener toe aan de flip clamp knop alleen voor niet-grid rijen
    if (!isGrid) {
      const flipButton = tr.querySelector(".flip-clamp");
      flipButton.addEventListener("click", function () {
        const powerInput = tr.querySelector(".P");
        if (powerInput.value) {
          // Keer het teken van de vermogenswaarde om
          const newValue = -1 * parseFloat(powerInput.value);

          // Pas een snelle visuele feedback toe
          powerInput.classList.add("flipped");

          // Stel de nieuwe waarde in na een kleine vertraging voor betere zichtbaarheid van animatie
          setTimeout(() => {
            powerInput.value = newValue.toFixed(P_rounding);
            // Verwijder animatieklasse
            setTimeout(() => powerInput.classList.remove("flipped"), 300);
          }, 200);

          // Voeg/verwijder de inverted klasse toe op basis van de nieuwe waarde
          if (newValue < 0) {
            flipButton.classList.add("inverted");
          } else {
            flipButton.classList.remove("inverted");
          }

          // Voer berekeningen opnieuw uit als ze al zijn uitgevoerd
          if (document.querySelector("#measTable .S").textContent !== "–") {
            // Geef tijd voor de animatie om te voltooien
            setTimeout(() => {
              document.getElementById("runChecks").click();
            }, 600);
          }
        }
      });

      // Verwijder de verbinding tussen defaultAmperage en knopstatus
      // De knop moet standaard in niet-omgekeerde toestand beginnen
      flipButton.classList.remove("inverted");
    }

    // Voeg min=0 toe om positieve waarden af te dwingen voor stroom invoer
    const currentInput = tr.querySelector(".I");
    if (currentInput) {
      currentInput.setAttribute("min", "0");

      // Voorkom negatieve waarden bij invoer
      currentInput.addEventListener("input", function () {
        if (parseFloat(this.value) < 0) {
          this.value = Math.abs(parseFloat(this.value));
        }
      });
    }

    tbody.appendChild(tr);
    return tr;
  }

  // Voeg Grid verbindingsrijen toe bovenaan de tabel
  const gridName = translations[lang].grid || "Grid";

  // Voeg juiste fasen toe op basis van netwerktype
  if (netType === "1F") {
    addRow(gridName, "L1", true);
  } else if (netType === "split") {
    addRow(gridName, "L1", true);
    addRow(gridName, "L2", true);
  } else if (netType === "3F-star" || netType === "3F-delta") {
    addRow(gridName, "L1", true);
    addRow(gridName, "L2", true);
    addRow(gridName, "L3", true);
  }

  // Voeg een scheidingsrij toe na de grid sectie
  const separatorRow = document.createElement("tr");
  separatorRow.classList.add("separator-row");
  separatorRow.innerHTML = `
    <td colspan="10" class="separator"></td>
  `;
  tbody.appendChild(separatorRow);

  // Omvormers (Solar)
  if (document.getElementById("hasSolar").value === "yes") {
    document.querySelectorAll("#solarDetails [data-role=solarType]").forEach((element, i) => {
      const naam = `${translations[lang].inverter} ${i + 1}`;
      const connType = element.tagName === "SELECT" ? element.value : element.value || "1F";

      if (connType === "1F") {
        addRow(naam, "L1");
      } else if (connType === "2F" && netType === "split") {
        addRow(naam, "L1");
        addRow(naam, "L2");
      } else if (connType === "3F") {
        ["L1", "L2", "L3"].forEach(fase => addRow(naam, fase));
      }
    });
  }

  // EV-laders
  if (document.getElementById("hasEV").value === "yes") {
    const evCount = parseInt(document.getElementById("evCount").value);
    const evTypes = document.querySelectorAll("#evDetails [data-role=evType]");

    for (let i = 0; i < evCount; i++) {
      // Haal het geselecteerde EV-type op uit de dropdown
      const evType = evTypes[i].value;
      const evName = `${translations[lang].charger} ${i + 1}: ${evType}`;

      // Voor EV-laders, voeg rijen toe op basis van netwerktype
      if (netType === "1F") {
        // Eenfasig netwerk - voeg altijd één rij toe met L1
        addRow(evName, "L1");
      } else if (netType === "split") {
        // Split-phase netwerk - voeg altijd twee rijen toe (L1 en L2)
        addRow(evName, "L1");
        addRow(evName, "L2");
      } else if (netType === "3F-star" || netType === "3F-delta") {
        // Driefasig netwerk - voeg altijd drie rijen toe (L1, L2, L3)
        addRow(evName, "L1");
        addRow(evName, "L2");
        addRow(evName, "L3");
      }
    }
  }

  // Verbruikers
  if (document.getElementById("hasLoads").value === "yes") {
    const n = parseInt(document.getElementById("loadCount").value, 10) || 0;
    for (let i = 0; i < n; i++) {
      const type = document.querySelectorAll("#loadDetails [data-role=loadType]")[i].value;
      const connElement = document.querySelectorAll("#loadDetails [data-role=loadConn]")[i];
      const connType = connElement.tagName === "SELECT" ? connElement.value : connElement.value || "1F";

      // Gebruik de typenaam direct omdat deze al vertaald is vanuit de dropdown
      if (connType === "1F") {
        addRow(type, "L1");
      } else if (connType === "2F" && netType === "split") {
        addRow(type, "L1");
        addRow(type, "L2");
      } else if (connType === "3F") {
        ["L1", "L2", "L3"].forEach(fase => addRow(type, fase));
      }
    }
  }

  // Voeg event listeners toe aan alle invoervelden om grid waarden bij te werken
  document.querySelectorAll("#measTable tr:not(.separator-row)").forEach(row => {
    if (row.cells[0].textContent !== gridName) { // Sla grid rijen over
      const amperageInput = row.querySelector(".I");
      // Voeg event listener toe aan elke apparaat stroomsterkte invoer
      amperageInput.addEventListener("input", updateGridValues);
    }
  });

  // Na het maken van alle rijen, werk grid waarden bij op basis van standaardwaarden
  updateGridValues();
}

// Globale helper om apparaattype te bepalen uit naam
function getDeviceType(name, lang) {
  if (name.includes(translations[lang].inverter) || name.toLowerCase().includes("inverter")) {
    return "solar";
  } else if (name.includes(translations[lang].charger) || name.toLowerCase().includes("charger") || name.includes("EV ")) {
    return "ev";
  } else if (name === translations[lang].grid || name.toLowerCase() === "grid") {
    return "grid";
  } else {
    return "load";
  }
}

// Globale functie om grid waarden bij te werken wanneer een apparaat invoer verandert of fase wordt gewisseld
function updateGridValues() {
  const lang = window.currentLanguage || 'nl';
  const gridName = translations[lang].grid || "Grid";

  // Reset volgen van stroomsterktes per fase en apparaattype
  const phaseAmperages = {
    L1: { solar: 0, load: 0, ev: 0 },
    L2: { solar: 0, load: 0, ev: 0 },
    L3: { solar: 0, load: 0, ev: 0 }
  };

  // Verzamel alle apparaat stroomsterktes per fase en type
  document.querySelectorAll("#measTable tr:not(.separator-row)").forEach(row => {
    const deviceName = row.cells[0].textContent;
    if (deviceName !== gridName) {  // Sla grid rijen over
      const phaseSelect = row.querySelector(".phase-select");
      const phase = phaseSelect ? phaseSelect.value : "L1"; // Haal geselecteerde fase op
      const amperageInput = row.querySelector(".I");
      const amperage = parseFloat(amperageInput.value) || 0;
      const deviceType = getDeviceType(deviceName, lang);

      if (phaseAmperages[phase] && deviceType !== "grid") {
        phaseAmperages[phase][deviceType] += amperage;
      }
    }
  });

  // Zoek en werk grid rijen bij
  document.querySelectorAll("#measTable tr").forEach(row => {
    const deviceName = row.cells[0].textContent;
    if (deviceName === gridName) {
      const phaseSelect = row.querySelector(".phase-select");
      const phase = phaseSelect ? phaseSelect.value : "L1";

      if (phaseAmperages[phase]) {
        // Grid = EV + Load - Solar (negatief betekent overtollig vermogen dat teruggaat naar grid)
        const gridAmperage = phaseAmperages[phase].ev + phaseAmperages[phase].load - phaseAmperages[phase].solar;
        const gridInput = row.querySelector(".I");
        if (gridInput) {
          gridInput.value = gridAmperage.toFixed(I_rounding);
        }
      }
    }
  });
}

// Berekeningen uitvoeren met validatie
document.getElementById("runChecks").onclick = () => {

  const rows = Array.from(document.querySelectorAll("#measTable tr:not(.separator-row)"));
  const lang = window.currentLanguage || 'nl';

  // Controleer op lege velden
  for (let tr of rows) {
    const IInput = tr.querySelector(".I");
    const voltageCell = tr.querySelector("td:nth-child(5)"); // Voltage cel is op positie 5
    const PInput = tr.querySelector(".P");

    // Sla deze rij over als het niet de verwachte invoeren heeft
    if (!IInput || !voltageCell || !PInput) continue;

    const Istr = IInput.value;
    const Ustr = getVoltageValue(voltageCell);
    const Pstr = PInput.value;
    if (Istr === "" || Ustr === "" || Pstr === "") {
      return alert(translations[lang].fill_all);
    }
  }

  // Verzamel gegevens voor specifieke controles
  const rowData = rows
    .filter(tr => {
      // Sla rijen over die niet de vereiste elementen hebben
      return tr.querySelector(".I") &&
        tr.querySelector("td:nth-child(5)") &&
        tr.querySelector(".P");
    })
    .map(tr => {
      const name = tr.querySelector("td:nth-child(1)").textContent;
      const phaseSelect = tr.querySelector(".phase-select");
      const phase = phaseSelect ? phaseSelect.value : "L1"; // Haal geselecteerde fase op
      const I = parseFloat(tr.querySelector(".I").value);
      const U = parseFloat(getVoltageValue(tr.querySelector("td:nth-child(5)")));
      const P = parseFloat(tr.querySelector(".P").value);
      const S = Math.abs(U * I); // Schijnbaar vermogen is altijd positief

      // Controleer of P > S (fysiek onmogelijk)
      const isPowerInvalid = Math.abs(P) > S;

      let PF, Q;

      if (isPowerInvalid) {
        // Stel placeholders in voor ongeldige berekeningen
        PF = "!";
        Q = "!";
      } else {
        // Normale berekening alleen als P <= S
        PF = S !== 0 ? Math.abs(P / S) : 0;
        Q = Math.sqrt(Math.max(0, S * S - P * P));
      }

      // Opslaan of PF oorspronkelijk negatief zou zijn (voor waarschuwingen)
      const isNegativePF = S !== 0 ? (P / S) < 0 : false;

      return { tr, name, phase, I, U, P, S, PF, Q, isNegativePF, isPowerInvalid };
    });

  // Loop door elke rij en update bij met berekeningen of waarschuwingen
  rowData.forEach((data, index) => {
    // Voeg vertraging toe voor cascade-animatie-effect
    setTimeout(() => {
      const { tr, name, phase, I, U, P, S, PF, Q, isNegativePF, isPowerInvalid } = data;

      const sCell = tr.querySelector(".S");
      const pfCell = tr.querySelector(".PF");
      const qCell = tr.querySelector(".Q");
      const alertCell = tr.querySelector(".alert");

      // Toon berekeningen
      sCell.textContent = S.toFixed(S_rounding);

      // Toon waarden of foutindicator voor PF en Q
      pfCell.textContent = isPowerInvalid ? "!" : PF.toFixed(Pf_rounding);
      qCell.textContent = isPowerInvalid ? "!" : Q.toFixed(Q_rounding);

      // Voeg animatieklasse toe
      [sCell, pfCell, qCell].forEach(cell => {
        cell.classList.add("calculated");
        // Verwijder klasse na animatie om toekomstige animaties mogelijk te maken
        setTimeout(() => cell.classList.remove("calculated"), 1000);
      });

      // Wis bestaande waarschuwingen
      alertCell.textContent = "";

      // 1. Controleer op fysiek onmogelijke vermogenswaarden
      if (isPowerInvalid) {
        alertCell.textContent = translations[lang]?.impossible_power ||
          "Onmogelijke P > S: controleer metingen";
      }
      // Alleen andere waarschuwingen tonen als het vermogen fysiek mogelijk is
      else {
        // 2. Controleer CT-richting (CT direction error) - Aangepast om P te controleren in plaats van I
        // Als vermogen negatief is maar powerfactor hoog (>0.9), wijst dit op onjuiste CT-richting
        if (P < 0 && PF > 0.9) {
          alertCell.textContent = translations[lang].ct_direction;
        }
        // 3. Controleer foutieve fasetoewijzing
        // Gecombineerde controle voor foutieve fasetoewijzing
        else if ((I < 0 && PF < 0.7) || (PF < 0.7 && I > 2)) {
          alertCell.textContent = translations[lang].wrong_phase_assignment;
        }
        // 4. Controleer CT-klem (Check CT clamp)
        // Als de absolute stroom heel hoog is (>400A), controleer de klem
        else if (Math.abs(I) > 400) {
          alertCell.textContent = translations[lang].check_ct;
        }
        // 5. Foute klemrichting (Wrong clamp direction)
        // Als powerfactor hoog is (>0.7) maar vermogen negatief, wijst dit op foute klemrichting
        else if (PF > 0.7 && P < 0) {
          alertCell.textContent = translations[lang].wrong_clamp_direction;
        }
        // 6. Negatieve powerfactor waarschuwing
        else if (isNegativePF && translations[lang]?.negative_pf) {
          alertCell.textContent = translations[lang].negative_pf;
        }
        // 7. Controleer per fase of solar + grid < laadpaal (EV)
        // Dit geeft aan dat er niet genoeg vermogen is voor de EV-lader
        ['L1', 'L2', 'L3'].forEach(phase => {
          if (evPowerByPhase[phase] > 0 &&
            (solarPowerByPhase[phase] + powerByPhase[phase] < evPowerByPhase[phase])) {

            // Zoek de EV-rijen voor deze fase om waarschuwingen toe te voegen
            rowData.forEach(data => {
              const { tr, name, phase: dataPhase } = data;
              if (dataPhase === phase && getDeviceType(name, lang) === "ev") {
                const alertCell = tr.querySelector(".alert");
                alertCell.textContent = translations[lang].solar_grid_less_than_ev;
              }
            });
          }
        });
      }

      // Animeer waarschuwingen
      if (alertCell.textContent) {
        alertCell.style.animation = "shake 0.5s";
        setTimeout(() => alertCell.style.animation = "", 500);
      }
    }, index * 50); // Geschakeld effect met 50ms tussen rijen
  });

  // Groepeer vermogen per fase
  const powerByPhase = { L1: 0, L2: 0, L3: 0 };
  const solarPowerByPhase = { L1: 0, L2: 0, L3: 0 };
  const evPowerByPhase = { L1: 0, L2: 0, L3: 0 };

  rowData.forEach(data => {
    const { name, phase, P } = data;
    const deviceType = getDeviceType(name, lang);

    // Categoriseer vermogen op basis van apparaattype
    if (deviceType === "solar") {
      solarPowerByPhase[phase] += P;
    }
    else if (deviceType === "ev") {
      evPowerByPhase[phase] += P;
    }
    // Grid en andere verbruikers worden samengenomen voor deze check
    else if (deviceType === "load" || deviceType === "grid") {
      powerByPhase[phase] += P;
    }
  });
};

// Voeg deze functie toe om de zichtbaarheid van configuratiesecties te beheren
function updateConfigVisibility() {
  const netType = document.getElementById("netType").value;
  const configSections = document.querySelectorAll('.config-section');
  const selectedNetTypeElement = document.getElementById("selectedNetType");
  const measureTitle = document.querySelector("h1[data-i18n='measure_title']");
  const lang = window.currentLanguage || 'nl';

  // Werk de configuratietitel bij maar toon geen netwerktype na het label
  if (netType) {
    // Haal de tekstinhoud van de geselecteerde optie op
    const selectedOption = document.querySelector(`#netType option[value="${netType}"]`);
    if (selectedOption) {
      // Verwijder de weergave van geselecteerd netwerktype na het label
      selectedNetTypeElement.textContent = "";

      // Werk de titel bij om het netwerktype toe te voegen
      if (measureTitle && translations[lang] && translations[lang].measure_title) {
        measureTitle.textContent = `${translations[lang].measure_title}: ${selectedOption.textContent}`;
      }
    }
  } else {
    selectedNetTypeElement.textContent = ""; // Houd dit leeg

    // Herstel originele titel
    if (measureTitle && translations[lang] && translations[lang].measure_title) {
      measureTitle.textContent = translations[lang].measure_title;
    }
  }

  // Toon configuratiesecties alleen als netwerktype is geselecteerd
  configSections.forEach(section => {
    section.hidden = !netType;
  });

  // Als netwerktype is gewist, reset en verberg ook alle afhankelijke secties
  if (!netType) {
    ["hasSolar", "hasEV", "hasLoads"].forEach(id => {
      document.getElementById(id).value = "no";
    });

    ["solarSection", "evSection", "loadSection"].forEach(id => {
      document.getElementById(id).hidden = true;
    });

    ["solarDetails", "evDetails", "loadDetails"].forEach(id => {
      document.getElementById(id).innerHTML = "";
    });
  }

  // Herbouw alle details om de juiste connectieopties te tonen
  if (document.getElementById("hasSolar").value === "yes" &&
    document.getElementById("solarCount").value) {
    rebuildSolarDetails();
  }

  if (document.getElementById("hasEV").value === "yes" &&
    document.getElementById("evCount").value) {
    rebuildEVDetails();
  }

  if (document.getElementById("hasLoads").value === "yes" &&
    document.getElementById("loadCount").value) {
    rebuildConsumerDetails();
  }
}

// Functie om het juiste spanningsveld te maken
function createVoltageField(networkType, phase) {
  // Bepaal de juiste spanning op basis van netwerktype
  let voltage;

  if (networkType === 'split') {
    // Voor split phase, gebruik altijd 120V
    voltage = '120';
  } else {
    // Standaard voor alle andere gevallen (1F en 3F configuraties)
    voltage = '230';
  }

  // Maak een span met de vaste spanningswaarde
  const span = document.createElement('span');
  span.textContent = voltage + 'V';
  span.dataset.voltage = voltage;
  return span;
}

// Functie om de spanningswaarde te verkrijgen moet ook worden vereenvoudigd
function getVoltageValue(cell) {
  const voltageElement = cell.firstChild;
  return voltageElement.dataset.voltage;
}

// Functie om fase dropdown selector te maken
function createPhaseSelector(currentPhase, networkType) {
  const select = document.createElement('select');
  select.className = 'phase-select';
  select.dataset.originalPhase = currentPhase; // Bewaar originele fase voor referentie
  select.dataset.currentPhase = currentPhase; // Volg ook huidige fase voor wisseling

  // Voeg juiste fasen toe op basis van netwerktype
  let availablePhases = [];

  if (networkType === "1F") {
    availablePhases = ["L1"];
  } else if (networkType === "split") {
    availablePhases = ["L1", "L2"];
  } else if (networkType === "3F-star" || networkType === "3F-delta") {
    availablePhases = ["L1", "L2", "L3"];
  }

  availablePhases.forEach(phase => {
    const option = document.createElement('option');
    option.value = phase;
    option.textContent = phase;
    if (phase === currentPhase) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  // Voeg change event listener toe om fasewisselingen af te handelen
  select.addEventListener('change', handlePhaseChange);

  return select;
}

// Functie om fasewisselingen af te handelen
function handlePhaseChange(event) {
  const select = event.target;
  const newPhase = select.value;
  const oldPhase = select.dataset.currentPhase || select.dataset.originalPhase;
  const row = select.closest('tr');
  const deviceName = row.cells[0].textContent;
  const lang = window.currentLanguage || 'nl';
  const gridName = translations[lang].grid || "Grid";
  const netType = document.getElementById("netType").value;

  // Sla de huidige waarde op om wijzigingen bij te houden
  select.dataset.currentPhase = newPhase;

  // Zoek andere rijen met dezelfde apparaatnaam (voor meerfasige apparaten)
  const sameDeviceRows = Array.from(document.querySelectorAll("#measTable tr")).filter(r =>
    r !== row && r.cells[0].textContent === deviceName
  );

  // Zoek de rij die de fase heeft waarnaar we willen wisselen
  const rowWithTargetPhase = sameDeviceRows.find(r => {
    const phaseSelect = r.querySelector(".phase-select");
    return phaseSelect && phaseSelect.value === newPhase;
  });

  // Als we een rij vonden met de doelfase, wissel dan de fasen tussen hen
  if (rowWithTargetPhase) {
    const otherPhaseSelect = rowWithTargetPhase.querySelector(".phase-select");

    // Verwijder tijdelijk event listeners om recursie te voorkomen
    otherPhaseSelect.removeEventListener('change', handlePhaseChange);
    otherPhaseSelect.value = oldPhase;
    otherPhaseSelect.dataset.currentPhase = oldPhase;

    // Update spanningsveld voor de andere rij - gecorrigeerde index
    const otherVoltageCell = rowWithTargetPhase.querySelector("td:nth-child(5)");
    otherVoltageCell.innerHTML = '';
    const otherVoltageField = createVoltageField(netType, oldPhase);
    otherVoltageCell.appendChild(otherVoltageField);

    // Voeg event listener weer toe
    otherPhaseSelect.addEventListener('change', handlePhaseChange);
  }

  // Update spanningsveld voor de huidige rij - gecorrigeerde index
  const voltageCell = row.querySelector("td:nth-child(5)");
  voltageCell.innerHTML = '';
  const newVoltageField = createVoltageField(netType, newPhase);
  voltageCell.appendChild(newVoltageField);

  // Update gridwaarden om faseveranderingen weer te geven
  updateGridValues();

  // Voer berekeningen uit (ongeacht of ze eerder zijn uitgevoerd)
  document.getElementById("runChecks").click();
}

// Hulpfunctie om standaard stroomsterkte voor een apparaat te krijgen
function getDefaultAmperage(deviceName, netType) {
  const lang = window.currentLanguage || 'nl';

  // Behandel zonnepaneel omvormers - Nu positief
  if (deviceName.includes(translations[lang].inverter) || deviceName.toLowerCase().includes("inverter")) {
    return 6.73; // Positief, zal in berekeningen als opbrengst worden beschouwd
  }

  // Behandel EV-laders
  if (deviceName.includes("EV ")) {
    const evModel = deviceName.split(": ")[1]; // Haal modelnaam op na dubbele punt
    return defaultDeviceAmperages.evChargers[evModel] || null;
  }

  // Behandel reguliere apparaten
  const deviceType = netType === "1F" || netType === "split" ? "singlePhase" : "threePhase";

  // Probeer het apparaat te vinden in de standaardlijst
  for (const [defaultName, amperage] of Object.entries(defaultDeviceAmperages[deviceType])) {
    // Controleer eerst op exacte match
    if (deviceName === defaultName) {
      return amperage;
    }

    // Voor vertaalde apparaatnamen, probeer een match te vinden in de huidige taal
    for (const translatedName of translations[lang].consumer_types) {
      if (deviceName === translatedName &&
        translations.nl.consumer_types.indexOf(defaultName) === translations[lang].consumer_types.indexOf(translatedName)) {
        return amperage;
      }
    }
  }

  return null; // Geen standaard gevonden
}