/* eslint-disable max-len */
import {
  graphql,
  decodeId,
  formatMutation,
  formatPageQueryWithCount
} from "@openimis/fe-core";
import { ACTION_TYPES } from "./reducer";

import { isBase64Encoded } from "./utils/utils";
import { CLEAR, ERROR, REQUEST, SUCCESS } from "./utils/action-type";

/**
 * === ACTIONS: Monitoring & Evaluation ===
 * Chaque action est associée à un triple d'états Redux (REQUEST / SUCCESS / ERROR)
 * et correspond à une opération du backend GraphQL / REST.
 */

// === 1. Liste des indicateurs ===
export function fetchIndicators(modulesManager, params = []) {
  const projections = [
    "id",
    "code",
    "name",
    "description",
    "calculationMethod",
    "category",
    "type",
    "module",
    "method",
    "unit",
    "frequency",
    "lastValue",
    "lastUpdatedDate",
    `value {
      id
      period
      value
      periodStart
      periodEnd
      validated
      source
      displayValue
    }`,
    `values {
      id
      period
      value
      periodStart
      periodEnd
      regionCode
      gender
      validated
      source
      displayValue
    }
    `,
    "target",
    "status",
    "dateUpdated",
  ];

  const query = formatPageQueryWithCount("indicators", params, projections);

  return graphql(query, "FETCH_INDICATORS", {
    actionType: ACTION_TYPES.FETCH_INDICATORS,
  });
}


// === 2. Détail d’un indicateur ===
export function fetchIndicator(idOrUuid) {
  const filters = [idOrUuid.includes("-") ? `id: "${idOrUuid}"` : `id: "${idOrUuid}"`];
  const projections = [
    "id",
    // "uuid",
    "code",
    "name",
    "description",
    "calculationMethod",
    "module",
    "method",
    "category",
    "status",
    "type",
    "frequency",
    "lastValue",
    "lastUpdatedDate",
    `value {
      id
      period
      value
      periodStart
      periodEnd
      validated
      source
      displayValue
    }`,
    `values {
      id
      period
      value
      periodStart
      periodEnd
      regionCode
      gender
      validated
      source
      displayValue
    }
    `,
    "target",
    "unit",
    "formula",
    "dateUpdated"
  ];
  const query = formatPageQueryWithCount("indicators", filters, projections);
  return graphql(query, "FETCH_INDICATOR", {
    actionType: ACTION_TYPES.FETCH_INDICATOR,
  });
}

// === 3. Créer un indicateur ===
export function createIndicator(indicator, clientMutationLabel = "create indicator") {
  const fields = [];

  // --- Champs obligatoires ---
  fields.push(`code: "${indicator.code}"`);
  fields.push(`name: "${indicator.name}"`);
  fields.push(`description: "${indicator.description || ""}"`);
  fields.push(`type: "${indicator.type}"`);
  fields.push(`unit: "${indicator.unit}"`);
  fields.push(`frequency: "${indicator.frequency}"`);
  fields.push(`status: "${indicator.status}"`);
  fields.push(`method: "${indicator.method}"`);
  fields.push(`category: "${indicator.category}"`);
  fields.push(`target: ${indicator.target || 0}`);

  // --- Champs optionnels ---
  if (indicator.calculationMethod) {
    fields.push(`calculationMethod: "${indicator.calculationMethod}"`);
  }

  if (indicator.formula) {
    fields.push(`formula: "${indicator.formula}"`);
  }

  // --- Module uniquement si renseigné ---
  if (indicator.module && indicator.module !== "") {
    fields.push(`module: "${indicator.module.toLowerCase()}"`);
  }

  // --- Nouveaux champs demandés ---
  // Valeurs par défaut = false & true si empty
  fields.push(`isAutomatic: ${indicator.isAutomatic ? "true" : "false"}`);
  fields.push(`isActive: ${indicator.isActive !== false ? "true" : "false"}`);

  const input = fields.join("\n");

  const mutation = formatMutation("createIndicator", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.CREATE_INDICATOR),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    }
  );
}

// === 4. Mettre à jour un indicateur ===
export function updateIndicator(indicator, clientMutationLabel = "update indicator") {
  const fields = [];

  // --- Identifiant ---
  fields.push(`id: "${decodeId(indicator.id)}"`);

  // --- Champs obligatoires ---
  fields.push(`code: "${indicator.code}"`);
  fields.push(`name: "${indicator.name}"`);
  fields.push(`description: "${indicator.description || ""}"`);
  fields.push(`type: "${indicator.type}"`);
  fields.push(`unit: "${indicator.unit}"`);
  fields.push(`frequency: "${indicator.frequency}"`);
  fields.push(`status: "${indicator.status}"`);
  fields.push(`method: "${indicator.method}"`);
  fields.push(`category: "${indicator.category}"`);
  fields.push(`target: ${indicator.target || 0}`);

  // --- Champs optionnels ---
  if (indicator.calculationMethod) {
    fields.push(`calculationMethod: "${indicator.calculationMethod}"`);
  }

  if (indicator.formula) {
    fields.push(`formula: "${indicator.formula}"`);
  }

  // module uniquement si non vide
  if (indicator.module && indicator.module !== "") {
    fields.push(`module: "${indicator.module.toLowerCase()}"`);
  }

  // --- Nouveaux champs demandés ---
  fields.push(`isAutomatic: ${indicator.isAutomatic ? "true" : "false"}`);
  fields.push(`isActive: ${indicator.isActive !== false ? "true" : "false"}`);

  const input = fields.join("\n");

  const mutation = formatMutation("updateIndicator", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.UPDATE_INDICATOR),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    }
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
    {
        clientMutationId: mutation.clientMutationId,
        clientMutationLabel,
        requestedDateTime
    },
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

// === CREATE MANUAL INDICATOR VALUE ===
export function createManualIndicatorValue(obj, clientMutationLabel = "create manual indicator value") {
  const input = `
    indicatorId: "${decodeId(obj.indicatorId)}",
    value: ${obj.value},
    periodStart: "${obj.periodStart}",
    periodEnd: "${obj.periodEnd}",
    source: "${obj.source}"
  `;

  const mutation = formatMutation("createManualIndicatorValue", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.CREATE_MANUAL_INDICATOR_VALUE),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
      // indicatorId: obj.indicatorId,
    }
  );
}

// === UPDATE MANUAL INDICATOR VALUE ===
export function updateManualIndicatorValue(obj, clientMutationLabel = "update manual indicator value") {
  const input = `
    id: "${decodeId(obj.id)}",
    value: ${obj.value},
    periodStart: "${obj.periodStart}",
    periodEnd: "${obj.periodEnd}",
    source: "${obj.source}"
  `;

  const mutation = formatMutation("updateManualIndicatorValue", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.UPDATE_MANUAL_INDICATOR_VALUE),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
      // id: obj.id,
    }
  );
}

// === DELETE MANUAL INDICATOR VALUE ===
export function deleteManualIndicatorValue(obj, clientMutationLabel = "delete manual indicator value") {
  const input = `
    id: "${decodeId(obj.id)}"
  `;

  const mutation = formatMutation("deleteManualIndicatorValue", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.DELETE_MANUAL_INDICATOR_VALUE),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      id: obj.id,
    }
  );
}

// === VALIDATE MANUAL INDICATOR VALUE ===
export function validateManualIndicatorValue(obj, clientMutationLabel = "validate manual indicator value") {
  const input = `
    id: "${decodeId(obj.id)}"
  `;

  const mutation = formatMutation("validateManualIndicatorValue", input, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      REQUEST(ACTION_TYPES.MUTATION),
      SUCCESS(ACTION_TYPES.VALIDATE_MANUAL_INDICATOR_VALUE),
      ERROR(ACTION_TYPES.MUTATION),
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      id: obj.id,
    }
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
