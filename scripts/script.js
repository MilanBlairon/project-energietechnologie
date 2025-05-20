document.addEventListener("DOMContentLoaded", () => {
  // Controleer service worker in browser
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("Service Worker geregistreerd!"))
      .catch(error => console.error("Service Worker registratie mislukt!", error));
  } else {
    console.warn("Service Workers worden niet ondersteund in deze browser.");
  }
});

// Verbruikerscategorieën
const verbruikersTypes = [
  "Jacuzzi",
  "Laadstation",
  "Lift",
  "Motor",
  "Oven",
  "Pomp",
  "Sauna",
  "Warmtepomp",
  "Zwembad"
];

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
  const div = document.createElement("div");
  div.innerHTML = `
      Omvormer ${i} type:
      <select data-role="solarType">
        <option value="1F">1F</option>
        <option value="3F">3F</option>
      </select>
    `;
  return div;
});

// EV-laadpunten
bindCount("evCount", "evDetails", i => {
  const div = document.createElement("div");
  div.innerHTML = `
      Lader ${i} model:
      <select data-role="evType">
        <option>EV Wall</option>
        <option>EV One</option>
        <option>EV Base</option>
        <option>EV Ultra</option>
      </select>
    `;
  return div;
});

// Verbruikers
bindCount("loadCount", "loadDetails", i => {
  const div = document.createElement("div");
  div.innerHTML = `
      Verbruiker ${i}:
      <select data-role="loadType">
        ${verbruikersTypes.map(t => `<option>${t}</option>`).join("")}
      </select>
      |
      Aansluiting:
      <select data-role="loadConn">
        <option value="1F">1F</option>
        <option value="3F">3F</option>
      </select>
    `;
  return div;
});

// Navigatie met validatie
document.getElementById("toMeasurements").onclick = () => {
  const netType = document.getElementById("netType").value;
  if (!netType) {
    return alert("Selecteer een nettype.");
  }

  if (
    document.getElementById("hasSolar").value === "yes" &&
    document.getElementById("solarCount").value === ""
  ) {
    return alert("Geef het aantal omvormers in.");
  }
  if (
    document.getElementById("hasEV").value === "yes" &&
    document.getElementById("evCount").value === ""
  ) {
    return alert("Geef het aantal EV-laders in.");
  }
  if (
    document.getElementById("hasLoads").value === "yes" &&
    document.getElementById("loadCount").value === ""
  ) {
    return alert("Geef het aantal verbruikers in.");
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

  // If hiding the page, first set it to hidden, then remove it from flow
  if (!show) {
    page.style.opacity = "0";
    page.style.transform = "translateX(20px)";
    setTimeout(() => {
      page.hidden = true;
    }, 500);
  }
  // If showing, first add to flow, then animate in
  else {
    page.hidden = false;
    // Force reflow to ensure transition happens
    void page.offsetWidth;
    page.style.opacity = "1";
    page.style.transform = "translateX(0)";
  }
}

// Tabellen genereren
function buildMeasurementTable() {
  const tbody = document.getElementById("measTable");
  tbody.innerHTML = "";
  const netType = document.getElementById("netType").value;

  function addRow(naam, fase) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${naam}</td>
        <td>${fase}</td>
        <td><input class="I" type="number"/></td>
        <td><input class="U" type="number"/></td>
        <td><input class="P" type="number"/></td>
        <td class="S">–</td>
        <td class="PF">–</td>
        <td class="Q">–</td>
        <td class="alert"></td>
      `;
    tbody.appendChild(tr);
  }

  // Omvormers
  if (document.getElementById("hasSolar").value === "yes") {
    document.querySelectorAll("#solarDetails [data-role=solarType]")
      .forEach((sel, i) => {
        const naam = `Omvormer ${i + 1}`;
        if (sel.value === "1F") addRow(naam, "L1");
        else["L1", "L2", "L3"].forEach(fase => addRow(naam, fase));
      });
  }

  // EV-laders
  if (document.getElementById("hasEV").value === "yes") {
    const evCount = parseInt(document.getElementById("evCount").value);
    const evTypes = document.querySelectorAll("#evDetails [data-role=evType]");

    for (let i = 0; i < evCount; i++) {
      // Get the selected EV type from the dropdown
      const evType = evTypes[i].value;
      const evName = `Laadpaal ${i + 1}: ${evType}`;

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
      if (conn === "1F") addRow(type, "L1");
      else["L1", "L2", "L3"].forEach(fase => addRow(type, fase));
    }
  }
}

// Berekeningen uitvoeren met validatie
document.getElementById("runChecks").onclick = () => {
  const rows = Array.from(document.querySelectorAll("#measTable tr"));

  // Controleer op lege velden
  for (let tr of rows) {
    const Istr = tr.querySelector(".I").value;
    const Ustr = tr.querySelector(".U").value;
    const Pstr = tr.querySelector(".P").value;
    if (Istr === "" || Ustr === "" || Pstr === "") {
      return alert("Vul ALLE meetvelden in.");
    }
  }

  // Voer berekeningen uit
  rows.forEach((tr, index) => {
    // Add a delay for cascading animation effect
    setTimeout(() => {
      const I = parseFloat(tr.querySelector(".I").value);
      const U = parseFloat(tr.querySelector(".U").value);
      const P = parseFloat(tr.querySelector(".P").value);

      // S = U × I; PF = P / S; Q = √(S² – P²)
      const S = U * I;
      const PF = S ? P / S : 0;
      const Q = Math.sqrt(Math.max(0, S * S - P * P));

      const sCell = tr.querySelector(".S");
      const pfCell = tr.querySelector(".PF");
      const qCell = tr.querySelector(".Q");

      // Update values with animation
      sCell.textContent = S.toFixed(0);
      pfCell.textContent = PF.toFixed(2);
      qCell.textContent = Q.toFixed(0);

      // Add animation class
      [sCell, pfCell, qCell].forEach(cell => {
        cell.classList.add("calculated");
        // Remove class after animation completes to allow for future animations
        setTimeout(() => cell.classList.remove("calculated"), 1000);
      });

      // Foutmeldingen
      const cel = tr.querySelector(".alert");
      cel.textContent = "";
      if (I < 0 && PF > 0.9) cel.textContent = "CT-richting fout";
      else if (I < 0 && PF < 0.7) cel.textContent = "Fasefout";
      else if (Math.abs(I) > 400) cel.textContent = "Controleer CT-klem";

      if (cel.textContent) {
        cel.style.animation = "shake 0.5s";
        setTimeout(() => cel.style.animation = "", 500);
      }
    }, index * 50); // Staggered effect with 50ms between rows
  });
};

// Add this animation for error messages
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);