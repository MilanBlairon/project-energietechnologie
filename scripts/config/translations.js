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
 * Vertalingen voor de SmappeeSim applicatie
 */

export const translations = {
  nl: {
    // Algemeen
    "select": "-- selecteer --",
    "yes": "Ja",
    "no": "Nee",
    "back": "← Terug",
    "next": "Volgende: Metingen →",
    "check": "Controleer",
    
    // Config pagina
    "config_title": "Configuratie",
    "net_type": "Netwerktype",
    "has_solar": "Zonnepanelen",
    "solar_count": "Aantal omvormers",
    "inverter": "Omvormer",
    "solar_type": "type",
    "type": "type",
    "has_ev": "Laadpaal",
    "ev_count": "Aantal laadpalen",
    "charger": "Lader",
    "model": "model",
    "has_loads": "Andere verbruikers",
    "load_count": "Aantal verbruikers",
    "consumer": "Verbruiker",
    "connection": "Aansluiting",
    
    // Meetpagina
    "measure_title": "Voer metingen in",
    "grid": "Net",
    "device": "Apparaat",
    "phase": "Fase",
    "warning": "Waarschuwing",
    
    // berichten
    "select_network": "Selecteer een nettype.",
    "enter_inverter_count": "Geef het aantal omvormers in.",
    "enter_charger_count": "Geef het aantal EV-laders in.",
    "enter_consumer_count": "Geef het aantal verbruikers in.",
    "fill_all": "Vul ALLE meetvelden in.",
    
    // Errors
    "ct_direction": "Foutieve klemrichting",
    "check_ct": "Controleer CT-klem",
    "wrong_phase_assignment": "Foutieve fasetoewijzing",
    "wrong_clamp_direction": "Foutieve klemrichting",
    "solar_grid_less_than_ev": "De som van grid en solar is kleiner dan het verbruik van de laadpaal",
    "impossible_power": "Onmogelijke P > S: controleer metingen",
    "negative_pf": "Negatieve powerfactor",
    "high_current": "Stroom hoger dan 40A",
    "low_voltage": "Spanning te laag (<207V)",
    "high_voltage": "Spanning te hoog (>253V)",
    "high_total_current": "Totale stroom te hoog (>40A)",
    "phase_imbalance": "Onbalans tussen fasen (>16A verschil)",
    "pf_too_low": "Power factor te laag (<0.85)",
    "low_power": "Vermogen te laag (<50W)",
    "reactive_power_high": "Reactief vermogen te hoog (>0.5 kVAr)",
    
    // Verbruikers
    "consumer_types": ["Airco", "Andere", "Boiler", "Droogkast", "Fornuis", "Jacuzzi", "Laadstation", "Lift", "Motor", "Oven", "Pomp", "Sauna", "Vaatwasser", "Ventilator", "Verwarming", "Warmte-element", "Warmtepomp", "Wasmachine", "Waterpomp", "Zonnewering", "Zwembad"],
    "direction": "Richting",
    "flip_clamp": "Klemrichting omdraaien"
  },
  
  en: {
    // General
    "select": "-- select --",
    "yes": "Yes",
    "no": "No",
    "back": "← Back",
    "next": "Next: Measurements →",
    "check": "Check",
    
    // Config page
    "config_title": "Configuration",
    "net_type": "Network type",
    "has_solar": "Solar panels",
    "solar_count": "Number of inverters",
    "inverter": "Inverter",
    "solar_type": "type",
    "type": "type",
    "has_ev": "EV Charger",
    "ev_count": "Number of chargers",
    "charger": "Charger",
    "model": "model",
    "has_loads": "Other consumers",
    "load_count": "Number of consumers",
    "consumer": "Consumer",
    "connection": "Connection",
    
    // Measurement page
    "measure_title": "Enter measurements",
    "grid": "Grid",
    "device": "Device",
    "phase": "Phase",
    "warning": "Warning",
    
    // Validation messages
    "select_network": "Please select a network type.",
    "enter_inverter_count": "Please enter the number of inverters.",
    "enter_charger_count": "Please enter the number of EV chargers.",
    "enter_consumer_count": "Please enter the number of consumers.",
    "fill_all": "Please fill in ALL measurement fields.",
    
    // Error messages
    "ct_direction": "Wrong clamp direction",
    "check_ct": "Check CT clamp",
    "wrong_phase_assignment": "Wrong phase assignment",
    "wrong_clamp_direction": "Wrong clamp direction",
    "solar_grid_less_than_ev": "Solar and grid power sum is less than EV charger consumption",
    "impossible_power": "Impossible P > S: check measurements",
    "negative_pf": "Negative power factor",
    "high_current": "Current above 40A",
    "low_voltage": "Voltage too low (<207V)",
    "high_voltage": "Voltage too high (>253V)",
    "high_total_current": "Total current too high (>40A)",
    "phase_imbalance": "Phase imbalance (>16A difference)",
    "pf_too_low": "Power factor too low (<0.85)",
    "low_power": "Power too low (<50W)",
    "reactive_power_high": "Reactive power too high (>0.5 kVAr)",
    
    // Consumer types
    "consumer_types": ["AC Unit", "Other", "Boiler", "Dryer", "Cooktop", "Jacuzzi", "Charging station", "Elevator", "Motor", "Oven", "Pump", "Sauna", "Dishwasher", "Fan", "Heating", "Heating element", "Heat pump", "Washing machine", "Water pump", "Sun protection", "Swimming pool"],
    "direction": "Direction",
    "flip_clamp": "Flip clamp direction"
  },
  
  fr: {
    // Genéral
    "select": "-- sélectionner --",
    "yes": "Oui",
    "no": "Non",
    "back": "← Retour",
    "next": "Suivant: Mesures →",
    "check": "Vérifier",
    
    // Page de configuration
    "config_title": "Configuration",
    "net_type": "Type de réseau",
    "has_solar": "Panneaux solaires",
    "solar_count": "Nombre d'onduleurs",
    "inverter": "Onduleur",
    "solar_type": "type",
    "type": "type",
    "has_ev": "Borne de recharge",
    "ev_count": "Nombre de bornes",
    "charger": "Chargeur",
    "model": "modèle",
    "has_loads": "Autres consommateurs",
    "load_count": "Nombre de consommateurs",
    "consumer": "Consommateur",
    "connection": "Connexion",
    
    // Page de mesure
    "measure_title": "Saisir les mesures",
    "grid": "Réseau",
    "device": "Appareil",
    "phase": "Phase",
    "warning": "Avertissement",
    
    // Messages de validation
    "select_network": "Veuillez sélectionner un type de réseau.",
    "enter_inverter_count": "Veuillez saisir le nombre d'onduleurs.",
    "enter_charger_count": "Veuillez saisir le nombre de bornes de recharge.",
    "enter_consumer_count": "Veuillez saisir le nombre de consommateurs.",
    "fill_all": "Veuillez remplir TOUS les champs de mesure.",
    
    // Erreurs
    "ct_direction": "Vérifiez la direction de la pince",
    "check_ct": "Vérifiez la pince CT",
    "wrong_phase_assignment": "Attribution de phase incorrecte",
    "wrong_clamp_direction": "Direction de pince incorrecte",
    "solar_grid_less_than_ev": "La somme de la puissance solaire et du réseau est inférieure à la consommation du chargeur EV",
    "impossible_power": "P > S impossible: vérifiez les mesures",
    "negative_pf": "Facteur de puissance négatif",
    "high_current": "Courant supérieur à 40A",
    "low_voltage": "Tension trop basse (<207V)",
    "high_voltage": "Tension trop élevée (>253V)",
    "high_total_current": "Courant total trop élevé (>40A)",
    "phase_imbalance": "Déséquilibre entre phases (>16A différence)",
    "pf_too_low": "Facteur de puissance trop bas (<0.85)",
    "low_power": "Puissance trop faible (<50W)",
    "reactive_power_high": "Puissance réactive trop élevée (>0.5 kVAr)",
    
    // Types de consommateurs
    "consumer_types": ["Climatisation", "Autre", "Chauffe-eau", "Sèche-linge", "Cuisinière", "Jacuzzi", "Borne de recharge", "Ascenseur", "Moteur", "Four", "Pompe", "Sauna", "Lave-vaisselle", "Ventilateur", "Chauffage", "Élément chauffant", "Pompe à chaleur", "Machine à laver", "Pompe à eau", "Protection solaire", "Piscine"],
    "direction": "Direction",
    "flip_clamp": "Inverser la direction"
  }
};