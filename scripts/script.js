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

// verbruikerstypes uit Analyse.pdf AA1:AA21
const verbruikerTypes = [
  "Airco", "Boiler", "Droogkast", "Warmtepomp", "Lichten", "Verwarming", "Oven", "Magnetron"
];

// toon/verberg dynamisch de secties
[
  { toggle: "hasSolar", section: "solarSection", details: "solarDetails" },
  { toggle: "hasEV", section: "evSection", details: "evDetails" },
  { toggle: "hasLoads", section: "loadSection", details: "loadDetails" }
].forEach(({ toggle, section, details }) => {
  const t = document.getElementById(toggle);
  t.addEventListener("change", e => {
    document.getElementById(section).hidden = e.target.value === "no";
    // vorige detailregels leegmaken
    document.getElementById(details).innerHTML = "";
  });
});

// genereer detailinvoer bij wijziging van aantal
function bindCount(countId, detailsId, generatorFn) {
  document.getElementById(countId).addEventListener("input", e => {
    const container = document.getElementById(detailsId);
    container.innerHTML = "";
    const n = parseInt(e.target.value) || 0;
    for (let i = 1; i <= n; i++) {
      container.appendChild(generatorFn(i));
    }
  });
}

// omvormer: kies fase-aantal
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

// EV-laders: kies model
bindCount("evCount", "evDetails", i => {
  const div = document.createElement("div");
  div.innerHTML = `
    Laadpaal ${i}:
    <select data-role="evType">
      <option>EV Wall</option>
      <option>EV One</option>
      <option>EV Base</option>
      <option>EV Ultra</option>
    </select>
  `;
  return div;
});

// verbruikers: kies type & aansluiting
bindCount("loadCount", "loadDetails", i => {
  const div = document.createElement("div");
  div.innerHTML = `
    Verbruiker ${i}:
    <select data-role="loadType">
      ${verbruikerTypes.map(t => `<option>${t}</option>`).join("")}
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

// navigatie tussen pagina's
document.getElementById("toMeasurements").onclick = () => {
  if (!document.getElementById("netType").value) {
    return alert("Selecteer een netwerktype.");
  }
  maakMeetTabel();
  toon("measure");
  toon("config", false);
};

document.getElementById("backConfig").onclick = () => {
  toon("config");
  toon("measure", false);
};

// helper voor tonen/verbergen
function toon(id, ja = true) {
  document.getElementById(id).hidden = !ja;
}

// meettabel genereren op basis van configuratie
function maakMeetTabel() {
  const tbody = document.getElementById("measTable");
  tbody.innerHTML = "";
  const netType = document.getElementById("netType").value;

  // hulpfunctie om rijen toe te voegen
  function voegRijToe(naam, fase) {
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

  // Zonnepanelen
  if (document.getElementById("hasSolar").value === "yes") {
    document.querySelectorAll("#solarDetails [data-role=solarType]")
      .forEach((sel, i) => {
        const naam = `Omvormer ${i + 1}`;
        if (sel.value === "1F") voegRijToe(naam, "L1");
        else["L1", "L2", "L3"].forEach(f => voegRijToe(naam, f));
      });
  }

  // EV
  if (document.getElementById("hasEV").value === "yes") {
    document.querySelectorAll("#evDetails [data-role=evType]")
      .forEach((sel, i) => {
        const naam = `Laadpaal ${i + 1}`;
        ["L1", "L2", "L3"].forEach(f => voegRijToe(naam, f));
      });
  }

  // Verbruikers
  if (document.getElementById("hasLoads").value === "yes") {
    const n = parseInt(document.getElementById("loadCount").value) || 0;
    for (let i = 1; i <= n; i++) {
      const type = document.querySelectorAll("#loadDetails [data-role=loadType]")[i - 1].value;
      const conn = document.querySelectorAll("#loadDetails [data-role=loadConn]")[i - 1].value;
      if (conn === "1F") voegRijToe(type, i + " (L1)");
      else["L1", "L2", "L3"].forEach(f => voegRijToe(type, f));
    }
  }
}

// berekeningen en foutcontroles uitvoeren
document.getElementById("runChecks").onclick = () => {
  document.querySelectorAll("#measTable tr").forEach(tr => {
    const I = parseFloat(tr.querySelector(".I").value);
    const U = parseFloat(tr.querySelector(".U").value);
    const P = parseFloat(tr.querySelector(".P").value);

    // S = U × I; PF = P/S; Q = √(S² – P²)
    const S = U * I;
    const PF = S ? P / S : 0;
    const Q = Math.sqrt(Math.max(0, S * S - P * P));

    tr.querySelector(".S").textContent = S.toFixed(0);
    tr.querySelector(".PF").textContent = PF.toFixed(2);
    tr.querySelector(".Q").textContent = Q.toFixed(0);

    // foutmeldingen
    const cel = tr.querySelector(".alert");
    cel.textContent = "";
    if (I < 0 && PF > 0.9) cel.textContent = "Fout stroomrichting (CT)";
    else if (I < 0 && PF < 0.7) cel.textContent = "Fout fase-toewijzing";
    else if (Math.abs(I) > 400) cel.textContent = "Controleer stroomtang (CT)";
  });
};
