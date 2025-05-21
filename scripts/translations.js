// Vertalingen voor de app
const translations = {
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
    "measure_title": "Voer Metingen In",
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
    "ct_direction": "CT-richting fout",
    "phase_error": "Fasefout",
    "check_ct": "Controleer CT-klem",
    "wrong_phase_assignment": "Foute fasetoewijzing",
    "wrong_clamp_direction": "Foute klemrichting",
    "solar_grid_less_than_ev": "De som van grid en solar is kleiner dan het verbruik van de laadpaal",
    
    // Verbruikers
    "consumer_types": ["Jacuzzi", "Laadstation", "Lift", "Motor", "Oven", "Pomp", "Sauna", "Warmtepomp", "Zwembad"]
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
    "measure_title": "Enter Measurements",
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
    "ct_direction": "CT direction error",
    "phase_error": "Phase error",
    "check_ct": "Check CT clamp",
    "wrong_phase_assignment": "Wrong phase assignment",
    "wrong_clamp_direction": "Wrong clamp direction",
    "solar_grid_less_than_ev": "Solar and grid power sum is less than EV charger consumption",
    
    // Consumer types
    "consumer_types": ["Jacuzzi", "Charging station", "Elevator", "Motor", "Oven", "Pump", "Sauna", "Heat pump", "Swimming pool"]
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
    "ct_direction": "Erreur de direction CT",
    "phase_error": "Erreur de phase",
    "check_ct": "Vérifiez la pince CT",
    "wrong_phase_assignment": "Attribution de phase incorrecte",
    "wrong_clamp_direction": "Direction de pince incorrecte",
    "solar_grid_less_than_ev": "La somme de la puissance solaire et du réseau est inférieure à la consommation du chargeur EV",
    
    // Types de consommateurs
    "consumer_types": ["Jacuzzi", "Borne de recharge", "Ascenseur", "Moteur", "Four", "Pompe", "Sauna", "Pompe à chaleur", "Piscine"]
  }
};