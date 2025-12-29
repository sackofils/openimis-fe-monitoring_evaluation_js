/* eslint-disable default-param-last */
import {
  parseData,
  pageInfo,
  formatGraphQLError,
  formatServerError,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
} from "@openimis/fe-core";

import { CLEAR, ERROR, REQUEST, SUCCESS } from "./utils/action-type";

/**
 * === CONSTANTES D’ACTION ===
 * (partagées entre actions et reducer)
 */
export const ACTION_TYPES = {
  FETCH_INDICATORS: "FETCH_INDICATORS",
  FETCH_INDICATOR: "FETCH_INDICATOR",
  CREATE_INDICATOR: "CREATE_INDICATOR",
  UPDATE_INDICATOR: "UPDATE_INDICATOR",
  DELETE_INDICATOR: "DELETE_INDICATOR",
  DUPLICATE_INDICATOR: "DUPLICATE_INDICATOR",
  UPDATE_MANUAL_INDICATOR: "UPDATE_MANUAL_INDICATOR",
  RECALC_REQUEST: "RECALC_REQUEST",
  RECALC_SUCCESS: "RECALC_SUCCESS",
  RECALC_ERROR: "RECALC_ERROR",
  EXPORT_INDICATORS: "EXPORT_INDICATORS",
  MUTATION: "MONITORING_MUTATION",

  CREATE_MANUAL_INDICATOR_VALUE: "CREATE_MANUAL_INDICATOR_VALUE",
  UPDATE_MANUAL_INDICATOR_VALUE: "UPDATE_MANUAL_INDICATOR_VALUE",
  DELETE_MANUAL_INDICATOR_VALUE: "DELETE_MANUAL_INDICATOR_VALUE",
  VALIDATE_MANUAL_INDICATOR_VALUE: "VALIDATE_MANUAL_INDICATOR_VALUE",
};

// === ÉTAT INITIAL ===
const initialState = {
  // === Liste ===
  fetchingIndicators: false,
  fetchedIndicators: false,
  indicators: [],
  indicatorsPageInfo: { totalCount: 0 },
  errorIndicators: null,

  // === Détail ===
  fetchingIndicator: false,
  fetchedIndicator: false,
  indicator: null,
  errorIndicator: null,

  // === Historique de recalculs ===
  fetchingRuns: false,
  fetchedRuns: false,
  indicatorRuns: [],
  errorRuns: null,

  // === Mutations ===
  submittingMutation: false,
  mutation: {},

  // === Export ===
  exportingIndicators: false,
  exportedIndicators: false,
  errorExport: null,
};

// === REDUCER PRINCIPAL ===
export function reducer(state = initialState, action) {
  switch (action.type) {
    // === LISTE DES INDICATEURS ==========================================
    case REQUEST(ACTION_TYPES.FETCH_INDICATORS):
      return {
        ...state,
        fetchingIndicators: true,
        fetchedIndicators: false,
        errorIndicators: null,
      };

    case SUCCESS(ACTION_TYPES.FETCH_INDICATORS):
      return {
        ...state,
        fetchingIndicators: false,
        fetchedIndicators: true,
        indicators: parseData(action.payload.data.indicators),
        indicatorsPageInfo: pageInfo(action.payload.data.indicators),
        errorIndicators: formatGraphQLError(action.payload),
      };

    case ERROR(ACTION_TYPES.FETCH_INDICATORS):
      return {
        ...state,
        fetchingIndicators: false,
        fetchedIndicators: false,
        errorIndicators: formatServerError(action.payload),
      };

    // === INDICATEUR UNIQUE ===============================================
    case REQUEST(ACTION_TYPES.FETCH_INDICATOR):
      return {
        ...state,
        fetchingIndicator: true,
        fetchedIndicator: false,
        indicator: null,
        errorIndicator: null,
      };

    case SUCCESS(ACTION_TYPES.FETCH_INDICATOR):
      console.log('action', parseData(action.payload.data.indicators)?.[0]);
      return {
        ...state,
        fetchingIndicator: false,
        fetchedIndicator: true,
        indicator: parseData(action.payload.data.indicators)?.[0] || null,
        errorIndicator: formatGraphQLError(action.payload),
      };

    case ERROR(ACTION_TYPES.FETCH_INDICATOR):
      return {
        ...state,
        fetchingIndicator: false,
        fetchedIndicator: false,
        errorIndicator: formatServerError(action.payload),
      };

    // === MUTATIONS (CREATE / UPDATE / DELETE / DUPLICATE) ================
    case REQUEST(ACTION_TYPES.MUTATION):
      return dispatchMutationReq(state, action);

    case ERROR(ACTION_TYPES.MUTATION):
      return dispatchMutationErr(state, action);

    case SUCCESS(ACTION_TYPES.CREATE_INDICATOR):
      return dispatchMutationResp(state, "createIndicator", action);

    case SUCCESS(ACTION_TYPES.UPDATE_INDICATOR):
      return dispatchMutationResp(state, "updateIndicator", action);

    case SUCCESS(ACTION_TYPES.DELETE_INDICATOR):
      return dispatchMutationResp(state, "deleteIndicator", action);

    case SUCCESS(ACTION_TYPES.DUPLICATE_INDICATOR):
      return dispatchMutationResp(state, "duplicateIndicator", action);

    // === MISE À JOUR VALEUR MANUELLE =====================================
    case SUCCESS(ACTION_TYPES.CREATE_MANUAL_INDICATOR_VALUE):
      return dispatchMutationResp(state, "createManualIndicatorValue", action);

    case SUCCESS(ACTION_TYPES.UPDATE_MANUAL_INDICATOR_VALUE):
      return dispatchMutationResp(state, "updateManualIndicatorValue", action);

    case SUCCESS(ACTION_TYPES.DELETE_MANUAL_INDICATOR_VALUE):
      const result = dispatchMutationResp(state, "deleteManualIndicatorValue", action);
      console.log('result', result);
      return result;

    case SUCCESS(ACTION_TYPES.VALIDATE_MANUAL_INDICATOR_VALUE):
      return dispatchMutationResp(state, "validateManualIndicatorValue", action);

    // === RECALCUL DES INDICATEURS =======================================
    case REQUEST(ACTION_TYPES.RECALC_REQUEST):
      return {
        ...state,
        recalculating: true,
        recalcResult: null,
        errorRecalc: null,
      };

    case SUCCESS(ACTION_TYPES.RECALC_SUCCESS):
      return {
        ...state,
        recalculating: false,
        recalcResult: action.payload?.data?.recalculateIndicators || null,
      };

    case ERROR(ACTION_TYPES.RECALC_ERROR):
      return {
        ...state,
        recalculating: false,
        recalcResult: null,
        errorRecalc: formatGraphQLError(action.payload),
      };

    // === EXPORT ==========================================================
    case REQUEST(ACTION_TYPES.EXPORT_INDICATORS):
      return {
        ...state,
        exportingIndicators: true,
        exportedIndicators: false,
        errorExport: null,
      };

    case SUCCESS(ACTION_TYPES.EXPORT_INDICATORS):
      return {
        ...state,
        exportingIndicators: false,
        exportedIndicators: true,
        errorExport: null,
      };

    case ERROR(ACTION_TYPES.EXPORT_INDICATORS):
      return {
        ...state,
        exportingIndicators: false,
        exportedIndicators: false,
        errorExport: formatServerError(action.payload),
      };

    // === HISTORIQUE DES RUNS ============================================
    case REQUEST("MONITORING_INDICATOR_RUNS"):
      return { ...state, fetchingRuns: true, fetchedRuns: false, errorRuns: null };

    case SUCCESS("MONITORING_INDICATOR_RUNS"):
      return {
        ...state,
        fetchingRuns: false,
        fetchedRuns: true,
        indicatorRuns: parseData(action.payload.data.indicatorRuns),
        errorRuns: formatGraphQLError(action.payload),
      };

    case ERROR("MONITORING_INDICATOR_RUNS"):
      return { ...state, fetchingRuns: false, fetchedRuns: false, errorRuns: formatServerError(action.payload) };

    // === PAR DÉFAUT =====================================================
    default:
      return state;
  }
}

export default reducer;
