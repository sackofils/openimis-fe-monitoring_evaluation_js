/* eslint-disable max-len */
import {
  graphql,
  formatMutation,
  formatPageQueryWithCount,
  REQUEST,
  SUCCESS,
  ERROR,
} from "@openimis/fe-core";
import { ACTION_TYPES } from "./reducers/monitoringReducer";

/**
 * === ACTIONS: Monitoring & Evaluation ===
 * Chaque action est associée à un triple d'états Redux (REQUEST / SUCCESS / ERROR)
 * et correspond à une opération du backend GraphQL / REST.
 */

// === 1. Liste des indicateurs ===
export function fetchIndicators(periodStart, periodEnd, modules = []) {
  const filters = [];
  if (periodStart) filters.push(`periodStart: "${periodStart}"`);
  if (periodEnd) filters.push(`periodEnd: "${periodEnd}"`);
  if (modules?.length) filters.push(`modules: [${modules.map((m) => `"${m}"`).join(", ")}]`);

  const projections = [
    "id",
    "uuid",
    "code",
    "label",
    "description",
    "module",
    "method",
    "value",
    "target",
    "unit",
    "formula",
    "lastComputedAt",
    "updatedAt",
    "updatedBy",
  ];

  const query = formatPageQueryWithCount("indicators", filters, projections);
  return graphql(query, "MONITORING_INDICATORS");
}

// === 2. Détail d’un indicateur ===
export function fetchIndicator(idOrUuid) {
  const filters = [idOrUuid.includes("-") ? `uuid: "${idOrUuid}"` : `id: "${idOrUuid}"`];
  const projections = [
    "id",
    "uuid",
    "code",
    "label",
    "description",
    "module",
    "method",
    "value",
    "target",
    "unit",
    "formula",
  ];
  const query = formatPageQueryWithCount("indicators", filters, projections);
  return graphql(query, "MONITORING_INDICATOR_DETAIL");
}

// === 3. Créer un indicateur ===
export function createIndicator(indicator, clientMutationLabel = "create indicator") {
  const input = `
    code: "${indicator.code}"
    label: "${indicator.label}"
    description: "${indicator.description || ""}"
    module: "${indicator.module}"
    method: "${indicator.method}"
    formula: ${indicator.formula ? `"${indicator.formula}"` : null}
    target: ${indicator.target || 0}
    unit: "${indicator.unit || ""}"
  `;
  const mutation = formatMutation("createIndicator", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.CREATE_INDICATOR),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    { clientMutationId: mutation.clientMutationId, clientMutationLabel, requestedDateTime },
  );
}

// === 4. Mettre à jour un indicateur ===
export function updateIndicator(indicator, clientMutationLabel = "update indicator") {
  const input = `
    id: "${indicator.id}"
    code: "${indicator.code}"
    label: "${indicator.label}"
    description: "${indicator.description || ""}"
    module: "${indicator.module}"
    method: "${indicator.method}"
    formula: ${indicator.formula ? `"${indicator.formula}"` : null}
    target: ${indicator.target || 0}
    unit: "${indicator.unit || ""}"
  `;
  const mutation = formatMutation("updateIndicator", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.UPDATE_INDICATOR),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    { clientMutationId: mutation.clientMutationId, clientMutationLabel, requestedDateTime },
  );
}

// === 5. Supprimer un indicateur ===
export function deleteIndicator(id, clientMutationLabel = "delete indicator") {
  const mutation = formatMutation("deleteIndicator", `id: "${id}"`, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.DELETE_INDICATOR),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    { clientMutationId: mutation.clientMutationId, clientMutationLabel, requestedDateTime },
  );
}

// === 6. Dupliquer un indicateur existant ===
export function duplicateIndicator(id, newCode, clientMutationLabel = "duplicate indicator") {
  const input = `
    id: "${id}"
    newCode: "${newCode}"
  `;
  const mutation = formatMutation("duplicateIndicator", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.DUPLICATE_INDICATOR),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    { clientMutationId: mutation.clientMutationId, clientMutationLabel, requestedDateTime },
  );
}

// === 7. Recalcul des indicateurs ===
export function recalculateIndicators(input, clientMutationLabel = "recalculate indicators") {
  const inputStr = `
    periodStart: "${input.periodStart}"
    periodEnd: "${input.periodEnd}"
    modules: [${(input.modules || []).map((m) => `"${m}"`).join(", ")}]
    dryRun: ${!!input.dryRun}
  `;
  const mutation = formatMutation("recalculateIndicators", inputStr, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.RECALC_REQUEST),
      SUCCESS(ACTION_TYPES.RECALC_SUCCESS),
      ERROR(ACTION_TYPES.RECALC_ERROR),
    ],
    { clientMutationId: mutation.clientMutationId, clientMutationLabel, requestedDateTime },
  );
}

// === 8. Historique des recalculs ===
export function fetchIndicatorRuns(periodStart, periodEnd) {
  const filters = [];
  if (periodStart) filters.push(`periodStart: "${periodStart}"`);
  if (periodEnd) filters.push(`periodEnd: "${periodEnd}"`);

  const projections = [
    "id",
    "startedAt",
    "endedAt",
    "status",
    "processedCount",
    "errorsCount",
    "duration",
  ];
  const query = formatPageQueryWithCount("indicatorRuns", filters, projections);
  return graphql(query, "MONITORING_INDICATOR_RUNS");
}

// === 9. Mettre à jour la valeur d’un indicateur manuel ===
export function updateManualIndicatorValue(indicatorId, value, period, clientMutationLabel = "update manual indicator value") {
  const input = `
    id: "${indicatorId}"
    value: ${value}
    period: "${period}"
  `;
  const mutation = formatMutation("updateManualIndicatorValue", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.UPDATE_MANUAL_INDICATOR),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    { clientMutationId: mutation.clientMutationId, clientMutationLabel, requestedDateTime, id: indicatorId },
  );
}

// === 10. Exporter les indicateurs (téléchargement Excel) ===
export async function exportIndicators(periodStart, periodEnd, modules = []) {
  const url = `${window.location.origin}/api/monitoring_evaluation/export/`;
  const payload = { period_start: periodStart, period_end: periodEnd, modules };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Export failed");
  }

  const blob = await response.blob();
  const fileUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = `indicators_${periodStart || "all"}_${periodEnd || "latest"}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}
