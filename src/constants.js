/**
 * === CONSTANTS: Monitoring & Evaluation ===
 */

// === Statuts des indicateurs ===
export const INDICATOR_STATUSES = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
};

export const INDICATOR_STATUS = [
  INDICATOR_STATUSES.DRAFT,
  INDICATOR_STATUSES.ACTIVE,
  INDICATOR_STATUSES.INACTIVE,
  INDICATOR_STATUSES.ARCHIVED,
];

// === Méthodes de calcul des indicateurs ===
export const CALCULATION_METHODS = {
  AUTOMATIC: "AUTOMATIC",
  MANUAL: "MANUAL",
};

export const CALCULATION_METHOD = [
  CALCULATION_METHODS.AUTOMATIC,
  CALCULATION_METHODS.MANUAL,
];

// === Types d’indicateur ===
export const INDICATOR_TYPES = ["Quantitative", "Qualitative", "Composite"];

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
