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
  
  // Bewaar huidige selectiewaarden voor herbouwen
  document.querySelectorAll("#solarDetails [data-role=solarType]").forEach(select => {
    previousValues.push(select.value);
  });
  
  // Wis en herbouw
  container.innerHTML = "";
  for (let i = 1; i <= n; i++) {
    const div = document.createElement("div");
    const lang = window.currentLanguage || 'nl';
    div.innerHTML = `
      ${translations[lang].inverter} ${i} ${translations[lang].type}:
      <select data-role="solarType">
        <option value="1F">1F</option>
        <option value="3F">3F</option>
      </select>
    `;
    container.appendChild(div);
  }
  
  // Herstel vorige selectiewaarden
  document.querySelectorAll("#solarDetails [data-role=solarType]").forEach((select, index) => {
    if (previousValues[index]) {
      select.value = previousValues[index];
    }
  });
}

function rebuildEVDetails() {
  const n = parseInt(document.getElementById("evCount").value, 10) || 0;
  const container = document.getElementById("evDetails");
  const previousValues = [];
  
  // Bewaar huidige selectiewaarden voor herbouwen
  document.querySelectorAll("#evDetails [data-role=evType]").forEach(select => {
    previousValues.push(select.value);
  });
  
  // Wis en herbouw
  container.innerHTML = "";
  for (let i = 1; i <= n; i++) {
    const div = document.createElement("div");
    const lang = window.currentLanguage || 'nl';
    div.innerHTML = `
      ${translations[lang].charger} ${i} ${translations[lang].model}:
      <select data-role="evType">
        <option>EV Wall</option>
        <option>EV One</option>
        <option>EV Base</option>
        <option>EV Ultra</option>
      </select>
    `;
    container.appendChild(div);
  }
  
  // Herstel vorige selectiewaarden
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
    container.appendChild(createConsumerDetail(i));
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
  
  document.querySelectorAll("#loadDetails [data-role=loadConn]").forEach((select, index) => {
    if (previousConnValues[index]) {
      select.value = previousConnValues[index];
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

// Functie om verbruikersdetails aan te maken met juiste taal
function createConsumerDetail(i) {
  const lang = window.currentLanguage || 'nl';
  const div = document.createElement("div");
  
  // Gebruik de verbruikerstypes van de huidige taal
  const consumerTypes = translations[lang].consumer_types;
  
  div.innerHTML = `
      ${translations[lang].consumer} ${i}:
      <select data-role="loadType">
        ${consumerTypes.map(t => `<option>${t}</option>`).join("")}
      </select>
      |
      ${translations[lang].connection}:
      <select data-role="loadConn">
        <option value="1F">1F</option>
        <option value="3F">3F</option>
      </select>
    `;
  return div;
}

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

  function addRow(naam, fase) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${naam}</td>
        <td>${fase}</td>
        <td><input class="I" type="number"/></td>
        <td></td>
        <td><input class="P" type="number"/></td>
        <td class="S">–</td>
        <td class="PF">–</td>
        <td class="Q">–</td>
        <td class="alert"></td>
      `;
    const voltageCell = tr.querySelector("td:nth-child(4)");
    const voltageField = createVoltageField(netType, fase);
    voltageCell.appendChild(voltageField);
    tbody.appendChild(tr);
  }

  // Omvormers
  if (document.getElementById("hasSolar").value === "yes") {
    document.querySelectorAll("#solarDetails [data-role=solarType]")
      .forEach((sel, i) => {
        const naam = `${translations[lang].inverter} ${i + 1}`;
        if (sel.value === "1F") addRow(naam, "L1");
        else["L1", "L2", "L3"].forEach(fase => addRow(naam, fase));
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

      if (netType === "1F") {
        addRow(evName, "L1");
      } else if (netType === "split") {
        addRow(evName, "L1");
        addRow(evName, "L2");
      } else {
        addRow(evName, "L1");
        addRow(evName, "L2");
        addRow(evName, "L3");
      }
    }
  }

  // Verbruikers
  if (document.getElementById("hasLoads").value === "yes") {
    const n = parseInt(document.getElementById("loadCount").value, 10) || 0;
    for (let i = 1; i <= n; i++) {
      const type = document.querySelectorAll("#loadDetails [data-role=loadType]")[i - 1].value;
      const conn = document.querySelectorAll("#loadDetails [data-role=loadConn]")[i - 1].value;
      // Gebruik de typenaam direct omdat deze al vertaald is vanuit de dropdown
      if (conn === "1F") addRow(type, "L1");
      else["L1", "L2", "L3"].forEach(fase => addRow(type, fase));
    }
  }
}

// Berekeningen uitvoeren met validatie
document.getElementById("runChecks").onclick = () => {
  const rows = Array.from(document.querySelectorAll("#measTable tr"));
  const lang = window.currentLanguage || 'nl';

  // Controleer op lege velden
  for (let tr of rows) {
    const Istr = tr.querySelector(".I").value;
    const Ustr = getVoltageValue(tr.querySelector("td:nth-child(4)"));
    const Pstr = tr.querySelector(".P").value;
    if (Istr === "" || Ustr === "" || Pstr === "") {
      return alert(translations[lang].fill_all);
    }
  }

  // Voer berekeningen uit
  rows.forEach((tr, index) => {
    // Voeg vertraging toe voor cascade-animatie-effect
    setTimeout(() => {
      const I = parseFloat(tr.querySelector(".I").value);
      const U = parseFloat(getVoltageValue(tr.querySelector("td:nth-child(4)")));
      const P = parseFloat(tr.querySelector(".P").value);

      // S = U × I; PF = P / S; Q = √(S² – P²)
      const S = U * I;
      const PF = S ? P / S : 0;
      const Q = Math.sqrt(Math.max(0, S * S - P * P));

      const sCell = tr.querySelector(".S");
      const pfCell = tr.querySelector(".PF");
      const qCell = tr.querySelector(".Q");

      // Werk waarden bij met animatie
      sCell.textContent = S.toFixed(0);
      pfCell.textContent = PF.toFixed(2);
      qCell.textContent = Q.toFixed(0);

      // Voeg animatieklasse toe
      [sCell, pfCell, qCell].forEach(cell => {
        cell.classList.add("calculated");
        // Verwijder klasse na animatie om toekomstige animaties mogelijk te maken
        setTimeout(() => cell.classList.remove("calculated"), 1000);
      });

      // Foutmeldingen
      const cel = tr.querySelector(".alert");
      cel.textContent = "";
      if (I < 0 && PF > 0.9) cel.textContent = translations[lang].ct_direction;
      else if (I < 0 && PF < 0.7) cel.textContent = translations[lang].phase_error;
      else if (Math.abs(I) > 400) cel.textContent = translations[lang].check_ct;

      if (cel.textContent) {
        cel.style.animation = "shake 0.5s";
        setTimeout(() => cel.style.animation = "", 500);
      }
    }, index * 50); // Geschakeld effect met 50ms tussen rijen
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
}

// Functie om het juiste voltageveld te maken
function createVoltageField(networkType, phase) {
  if (networkType === 'split') {
    // Voor split phase, maak een dropdown met 120V en 240V opties
    const select = document.createElement('select');
    select.className = 'voltage-select';
    
    const option120 = document.createElement('option');
    option120.value = '120';
    option120.textContent = '120V';
    
    const option240 = document.createElement('option');
    option240.value = '240';
    option240.textContent = '240V';
    
    select.appendChild(option120);
    select.appendChild(option240);
    
    // Selecteer de juiste standaard op basis van fase
    if (phase === 'L1-N' || phase === 'L2-N') {
      option120.selected = true;
    } else if (phase === 'L1-L2') {
      option240.selected = true;
    }
    
    return select;
  } else {
    // Voor andere netwerktypes, toon vaste 230V of 400V zoals passend
    let voltage;
    if (networkType === '3F-star' && (phase === 'L1-L2' || phase === 'L2-L3' || phase === 'L3-L1')) {
      voltage = '400';
    } else {
      voltage = '230';
    }
    
    const span = document.createElement('span');
    span.textContent = voltage + 'V';
    span.dataset.voltage = voltage;
    return span;
  }
}

// Functie om de voltagewaarde te verkrijgen
function getVoltageValue(cell) {
  const voltageElement = cell.firstChild;
  
  if (voltageElement.tagName === 'SELECT') {
    return voltageElement.value;
  } else {
    return voltageElement.dataset.voltage;
  }
}

// Vervang het bestaande stijlblok onderaan je bestand met deze bijgewerkte versie
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  /* Paginaovergangen en positionering - BIJGEWERKT naar alleen vervaging */
  .page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  
  .page[hidden] {
    opacity: 0;
    pointer-events: none;
    display: none;
  }
  
  /* Taalselectiepagina styling - BIJGEWERKT voor donker thema */
  .language-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    background-color: var(--bg-primary);
    z-index: 100;
  }
  
  .language-container {
    text-align: center;
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px var(--shadow-color);
    max-width: 90%;
    width: 500px;
    border: 1px solid var(--border-color);
  }
  
  .language-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }
  
  .language-switcher {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
  }
  
  .lang-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
    padding: 12px 20px;
    border-radius: 8px;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    color: var(--text-primary);
    width: 100%;
  }
  
  .lang-btn:hover {
    background-color: var(--accent-color);
    transform: translateY(-2px);
  }
  
  .lang-btn img {
    width: 24px;
    height: auto;
  }
  
  /* Hoofdinhoudcontainer */
  body {
    position: relative;
    margin: 0;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
  
  /* Extra animatie voor berekeningen */
  .calculated {
    animation: highlight 1s ease;
  }
  
  @keyframes highlight {
    0% { background-color: rgba(52, 152, 219, 0.3); }
    100% { background-color: transparent; }
  }
`;
document.head.appendChild(style);