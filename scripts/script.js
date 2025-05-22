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

document.addEventListener("DOMContentLoaded", () => {
  init();
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
      // Special handling for config_title if network type is selected
      if (key === 'config_title') {
        const netType = document.getElementById("netType").value;
        if (netType) {
          const selectedOption = document.querySelector(`#netType option[value="${netType}"]`);
          if (selectedOption) {
            element.textContent = `${translations[lang][key]}: ${selectedOption.textContent}`;
            return; // Skip default assignment
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
            return; // Skip default assignment
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
        // Check of de optie bestaat in de nieuwe lijst
        const optionExists = Array.from(element.options).some(opt => opt.value === previousValues[index]);
        if (optionExists) {
          element.value = previousValues[index];
        }
      }
      // Voor hidden inputs doen we niets extra, die hebben al een vaste waarde
    }
  });
}

function rebuildEVDetails() {
  const n = parseInt(document.getElementById("evCount").value, 10) || 0;
  const container = document.getElementById("evDetails");
  const previousValues = [];
  const netType = document.getElementById("netType").value;

  // Bewaar huidige selectiewaarden voor herbouwen (alleen voor EV type, niet voor connection)
  document.querySelectorAll("#evDetails [data-role=evType]").forEach(select => {
    previousValues.push(select.value);
  });

  // Wis en herbouw
  container.innerHTML = "";
  for (let i = 1; i <= n; i++) {
    const div = document.createElement("div");
    const lang = window.currentLanguage || 'nl';

    // Determine the connection type based on network type
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
        // Check of de optie bestaat in de nieuwe lijst
        const optionExists = Array.from(element.options).some(opt => opt.value === previousConnValues[index]);
        if (optionExists) {
          element.value = previousConnValues[index];
        }
      }
      // Voor hidden inputs doen we niets extra, die hebben al een vaste waarde
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

// Verbruikerscategorieën uit vertalingen
let verbruikersTypes = translations.nl.consumer_types; // Standaard Nederlands

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
  return document.createElement("div"); // Dummy return since rebuildConsumerDetails handles the actual creation
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

  // We'll track all amperage values by phase to calculate grid net values
  const phaseAmperages = {
    L1: { solar: 0, load: 0, ev: 0 },
    L2: { solar: 0, load: 0, ev: 0 },
    L3: { solar: 0, load: 0, ev: 0 }
  };

  // Grid rows reference to update later
  const gridRows = {};

  function addRow(naam, fase, isGrid = false) {
    const tr = document.createElement("tr");
    const netType = document.getElementById("netType").value;
    const lang = window.currentLanguage || 'nl';

    // Get default amperage for this device
    const defaultAmperage = isGrid ? null : getDefaultAmperage(naam, netType);

    // Create flip button HTML conditionally based on whether it's a grid row
    const flipButtonHTML = isGrid ?
      '<td class="direction-cell"></td>' :
      `<td class="direction-cell"><button class="flip-clamp" title="${translations[lang].flip_clamp || 'Flip clamp direction'}">⟲</button></td>`;

    // Create the default amperage value attribute
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

    // Add phase dropdown instead of static text
    const phaseCell = tr.querySelector("td:nth-child(2)");
    const phaseSelect = createPhaseSelector(fase, netType);
    phaseCell.appendChild(phaseSelect);

    const voltageCell = tr.querySelector("td:nth-child(5)");
    const voltageField = createVoltageField(netType, fase);
    voltageCell.appendChild(voltageField);

    // If this is a grid row, store reference for later update
    if (isGrid) {
      gridRows[fase] = tr;
    }

    // Add event listener to the flip clamp button only for non-grid rows
    if (!isGrid) {
      const flipButton = tr.querySelector(".flip-clamp");
      flipButton.addEventListener("click", function () {
        const powerInput = tr.querySelector(".P");
        if (powerInput.value) {
          // Flip the sign of the power value
          const newValue = -1 * parseFloat(powerInput.value);

          // Apply a quick visual feedback
          powerInput.classList.add("flipped");

          // Set the new value after a slight delay for better animation visibility
          setTimeout(() => {
            powerInput.value = newValue.toFixed(0);
            // Remove animation class
            setTimeout(() => powerInput.classList.remove("flipped"), 300);
          }, 200);

          // Add/remove the inverted class based on the new value
          if (newValue < 0) {
            flipButton.classList.add("inverted");
          } else {
            flipButton.classList.remove("inverted");
          }

          // Re-run calculations if they were already run
          if (document.querySelector("#measTable .S").textContent !== "–") {
            // Give time for the animation to complete
            setTimeout(() => {
              document.getElementById("runChecks").click();
            }, 600);
          }
        }
      });

      // Remove the connection between defaultAmperage and button state
      // The button should start in non-inverted state by default
      flipButton.classList.remove("inverted");
    }

    // Add min=0 to force positive values for current input
    const currentInput = tr.querySelector(".I");
    if (currentInput) {
      currentInput.setAttribute("min", "0");

      // Prevent negative values on input
      currentInput.addEventListener("input", function () {
        if (parseFloat(this.value) < 0) {
          this.value = Math.abs(parseFloat(this.value));
        }
      });
    }

    tbody.appendChild(tr);
    return tr;
  }

  // Add Grid connection rows at the top of the table
  const gridName = translations[lang].grid || "Grid";

  // Add appropriate phases based on network type
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

  // Add a separator row after the grid section
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

      // For EV chargers, add rows based on network type
      if (netType === "1F") {
        // Single-phase network - always add one row with L1
        addRow(evName, "L1");
      } else if (netType === "split") {
        // Split-phase network - always add two rows (L1 and L2)
        addRow(evName, "L1");
        addRow(evName, "L2");
      } else if (netType === "3F-star" || netType === "3F-delta") {
        // Three-phase network - always add three rows (L1, L2, L3)
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

  // Add event listeners to all input fields to update grid values
  document.querySelectorAll("#measTable tr:not(.separator-row)").forEach(row => {
    if (row.cells[0].textContent !== gridName) { // Skip grid rows
      const amperageInput = row.querySelector(".I");
      // Add event listener to each device amperage input
      amperageInput.addEventListener("input", updateGridValues);
    }
  });

  // After creating all rows, update grid values based on defaults
  updateGridValues();
}

// Move the updateGridValues function outside buildMeasurementTable to make it globally accessible

// Global helper to determine device type from name
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

// Global function to update grid values whenever a device input changes or phase is swapped
function updateGridValues() {
  const lang = window.currentLanguage || 'nl';
  const gridName = translations[lang].grid || "Grid";

  // Reset tracking of amperages by phase and device type
  const phaseAmperages = {
    L1: { solar: 0, load: 0, ev: 0 },
    L2: { solar: 0, load: 0, ev: 0 },
    L3: { solar: 0, load: 0, ev: 0 }
  };

  // Collect all device amperages by phase and type
  document.querySelectorAll("#measTable tr:not(.separator-row)").forEach(row => {
    const deviceName = row.cells[0].textContent;
    if (deviceName !== gridName) {  // Skip grid rows
      const phaseSelect = row.querySelector(".phase-select");
      const phase = phaseSelect ? phaseSelect.value : "L1"; // Get selected phase
      const amperageInput = row.querySelector(".I");
      const amperage = parseFloat(amperageInput.value) || 0;
      const deviceType = getDeviceType(deviceName, lang);

      if (phaseAmperages[phase] && deviceType !== "grid") {
        phaseAmperages[phase][deviceType] += amperage;
      }
    }
  });

  // Find and update grid rows
  document.querySelectorAll("#measTable tr").forEach(row => {
    const deviceName = row.cells[0].textContent;
    if (deviceName === gridName) {
      const phaseSelect = row.querySelector(".phase-select");
      const phase = phaseSelect ? phaseSelect.value : "L1";

      if (phaseAmperages[phase]) {
        // Grid = EV + Load - Solar (negative means excess power going back to grid)
        const gridAmperage = phaseAmperages[phase].ev + phaseAmperages[phase].load - phaseAmperages[phase].solar;
        const gridInput = row.querySelector(".I");
        if (gridInput) {
          gridInput.value = gridAmperage.toFixed(1);
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
    const voltageCell = tr.querySelector("td:nth-child(5)"); // Voltage cell is at position 5
    const PInput = tr.querySelector(".P");

    // Skip this row if it doesn't have the expected inputs
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
      // Skip rows that don't have the required elements
      return tr.querySelector(".I") &&
        tr.querySelector("td:nth-child(5)") &&
        tr.querySelector(".P");
    })
    .map(tr => {
      const name = tr.querySelector("td:nth-child(1)").textContent;
      const phaseSelect = tr.querySelector(".phase-select");
      const phase = phaseSelect ? phaseSelect.value : "L1"; // Get selected phase
      const I = parseFloat(tr.querySelector(".I").value);
      const U = parseFloat(getVoltageValue(tr.querySelector("td:nth-child(5)")));
      const P = parseFloat(tr.querySelector(".P").value);
      const S = Math.abs(U * I); // Schijnbaar vermogen is altijd positief

      // Check if P > S (physically impossible)
      const isPowerInvalid = Math.abs(P) > S;

      let PF, Q;

      if (isPowerInvalid) {
        // Set placeholders for invalid calculations
        PF = "!";
        Q = "!";
      } else {
        // Normal calculation only if P <= S
        PF = S !== 0 ? Math.abs(P / S) : 0;
        Q = Math.sqrt(Math.max(0, S * S - P * P));
      }

      // Opslaan of PF oorspronkelijk negatief zou zijn (voor waarschuwingen)
      const isNegativePF = S !== 0 ? (P / S) < 0 : false;

      return { tr, name, phase, I, U, P, S, PF, Q, isNegativePF, isPowerInvalid };
    });

  // Loop through each row and update with calculations or warnings
  rowData.forEach((data, index) => {
    // Voeg vertraging toe voor cascade-animatie-effect
    setTimeout(() => {
      const { tr, name, phase, I, U, P, S, PF, Q, isNegativePF, isPowerInvalid } = data;

      const sCell = tr.querySelector(".S");
      const pfCell = tr.querySelector(".PF");
      const qCell = tr.querySelector(".Q");
      const alertCell = tr.querySelector(".alert");

      // Display calculations
      sCell.textContent = S.toFixed(0);

      // Display values or error indicator for PF and Q
      pfCell.textContent = isPowerInvalid ? "!" : PF.toFixed(2);
      qCell.textContent = isPowerInvalid ? "!" : Q.toFixed(0);

      // Voeg animatieklasse toe
      [sCell, pfCell, qCell].forEach(cell => {
        cell.classList.add("calculated");
        // Verwijder klasse na animatie om toekomstige animaties mogelijk te maken
        setTimeout(() => cell.classList.remove("calculated"), 1000);
      });

      // Wis bestaande waarschuwingen
      alertCell.textContent = "";

      // 1. Check for physically impossible power values
      if (isPowerInvalid) {
        alertCell.textContent = translations[lang]?.impossible_power ||
          "Onmogelijke P > S: controleer metingen";
      }
      // Alleen andere waarschuwingen tonen als het vermogen fysiek mogelijk is
      else {
        // 2. Controleer CT-richting (CT direction error) - Modified to check P instead of I
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
                alertCell.style.animation = "shake 0.5s";
                setTimeout(() => alertCell.style.animation = "", 500);
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

document.addEventListener('DOMContentLoaded', () => {
  // Verwijder de bestaande taalsetupcode in init() aangezien we het hier afhandelen

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

// Voeg deze functie toe om de zichtbaarheid van configuratiesecties te beheren
function updateConfigVisibility() {
  const netType = document.getElementById("netType").value;
  const configSections = document.querySelectorAll('.config-section');
  const selectedNetTypeElement = document.getElementById("selectedNetType");
  const measureTitle = document.querySelector("h1[data-i18n='measure_title']");
  const lang = window.currentLanguage || 'nl';

  // Update the configuration title but don't show network type after the label
  if (netType) {
    // Get the selected option's text content
    const selectedOption = document.querySelector(`#netType option[value="${netType}"]`);
    if (selectedOption) {
      // Remove the display of selected network type after the label
      selectedNetTypeElement.textContent = "";

      // Update the title to include the network type
      if (measureTitle && translations[lang] && translations[lang].measure_title) {
        measureTitle.textContent = `${translations[lang].measure_title}: ${selectedOption.textContent}`;
      }
    }
  } else {
    selectedNetTypeElement.textContent = ""; // Keep this empty

    // Restore original title
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

// Function to create the appropriate voltage field
function createVoltageField(networkType, phase) {
  // Determine the correct voltage based on network type
  let voltage;

  if (networkType === 'split') {
    // For split phase, always use 120V
    voltage = '120';
  } else {
    // Default for all other cases (1F and 3F configurations)
    voltage = '230';
  }

  // Create a span with the fixed voltage value
  const span = document.createElement('span');
  span.textContent = voltage + 'V';
  span.dataset.voltage = voltage;
  return span;
}

// Function to get the voltage value should also be simplified
function getVoltageValue(cell) {
  const voltageElement = cell.firstChild;
  return voltageElement.dataset.voltage;
}

// Function to create phase dropdown selector
function createPhaseSelector(currentPhase, networkType) {
  const select = document.createElement('select');
  select.className = 'phase-select';
  select.dataset.originalPhase = currentPhase; // Store original phase for reference
  select.dataset.currentPhase = currentPhase; // Also track current phase for swapping

  // Add appropriate phases based on network type
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

  // Add change event listener to handle phase swaps
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

// EV-laders
if (document.getElementById("hasEV").value === "yes") {
  const evCount = parseInt(document.getElementById("evCount").value);
  const evTypes = document.querySelectorAll("#evDetails [data-role=evType]");

  for (let i = 0; i < evCount; i++) {
    // Haal het geselecteerde EV-type op uit de dropdown
    const evType = evTypes[i].value;
    const evName = `${translations[lang].charger} ${i + 1}: ${evType}`;

    // For EV chargers, add rows based on network type
    if (netType === "1F") {
      // Single-phase network - always add one row with L1
      addRow(evName, "L1");
    } else if (netType === "split") {
      // Split-phase network - always add two rows (L1 and L2)
      addRow(evName, "L1");
      addRow(evName, "L2");
    } else if (netType === "3F-star" || netType === "3F-delta") {
      // Three-phase network - always add three rows (L1, L2, L3)
      addRow(evName, "L1");
      addRow(evName, "L2");
      addRow(evName, "L3");
    }
  }
}

// Add after the translations initialization

// Default amperage values for devices by network type
const defaultDeviceAmperages = {
  // For 1F and split-phase networks
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
    "Andere": null // No default value
  },
  // For 3F networks
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
    "Andere": null // No default value
  },
  // EV chargers
  evChargers: {
    "EV Base": 16,
    "EV One": 16,
    "EV Ultra": 16,
    "EV Wall": 16
  },
  // Solar inverters
  inverters: {
    "Omvormer": 6.73
  }
};

// Helper function to get default amperage for a device
function getDefaultAmperage(deviceName, netType) {
  const lang = window.currentLanguage || 'nl';

  // Handle solar inverters - Nu positief
  if (deviceName.includes(translations[lang].inverter) || deviceName.toLowerCase().includes("inverter")) {
    return 6.73; // Positief, zal in berekeningen als opbrengst worden beschouwd
  }

  // Handle EV chargers
  if (deviceName.includes("EV ")) {
    const evModel = deviceName.split(": ")[1]; // Extract model name after colon
    return defaultDeviceAmperages.evChargers[evModel] || null;
  }

  // Handle regular devices
  const deviceType = netType === "1F" || netType === "split" ? "singlePhase" : "threePhase";

  // Try to find the device in the default list
  for (const [defaultName, amperage] of Object.entries(defaultDeviceAmperages[deviceType])) {
    // Check for exact match first
    if (deviceName === defaultName) {
      return amperage;
    }

    // For translated device names, try to find a match in the current language
    for (const translatedName of translations[lang].consumer_types) {
      if (deviceName === translatedName &&
        translations.nl.consumer_types.indexOf(defaultName) === translations[lang].consumer_types.indexOf(translatedName)) {
        return amperage;
      }
    }
  }

  return null; // No default found
}