/**
 * === CONSTANTS: Monitoring & Evaluation ===
 */

// === Types d’indicateur ===
export const CALCULATION_METHODS = ["MANUEL", "AUTOMATIQUE"];
export const INDICATOR_STATUSES = ["BROUILLON", "ACTIVE", "INACTIVE", "ARCHIVE"];
export const INDICATOR_TYPES = ["QUANTITATIVE", "QUALITATIVE", "COMPOSITE"];
// export const FREQUENCY_TYPES = ["Une fois", "Deux fois", "Trois fois", "Mensuel", "Trimestriel", "Semestriel", "Annuel"];
// export const UNIT_TYPES = ["GNF", "Nombre", "Pourcentage", "Oui/Non"];
export const MODULE_TYPES = ["individual", "social_protection", "grievance_social_protection"];

export const FREQUENCY_TYPES = [
  "UNE_FOIS",
  "DEUX_FOIS",
  "TROIS_FOIS",
  "MENSUEL",
  "TRIMESTRIEL",
  "SEMESTRIEL",
  "ANNUEL",
];

export const UNIT_TYPES = [
  "GNF",
  "NOMBRE",
  "POURCENTAGE",
  "OUI_NON",
];


// === Droits d’accès (à aligner avec le backend) ===
export const RIGHT_MONITORING = 128000;
export const RIGHT_MONITORING_VIEW = 128001;
export const RIGHT_MONITORING_ADD = 128002;
export const RIGHT_MONITORING_EDIT = 128003;
export const RIGHT_MONITORING_DELETE = 128004;
export const RIGHT_MONITORING_RECALCULATE = 128005;

// === Identifiants internes ===
export const MODULE_NAME = "monitoringEvaluation";
export const FETCH_INDICATORS_REF = "monitoring.actions.fetchIndicators";

// === Chaînes diverses ===
export const EMPTY_STRING = "";

// === Clé de menu principale pour l’intégration OpenIMIS ===
export const MONITORING_MAIN_MENU_CONTRIBUTION_KEY = "monitoring.MainMenu";
