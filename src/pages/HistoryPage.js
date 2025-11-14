import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Block, FormattedMessage } from "@openimis/fe-core";
import { useHistoryQuery } from "../hooks/useHistoryQuery";
import { recalculateIndicators } from "../actions";
import { useDispatch } from "react-redux";
import { MODULE_NAME } from "../constants";

export default function HistoryPage() {
  const dispatch = useDispatch();
  const { isLoading, error, data, refetch } = useHistoryQuery();
  const [running, setRunning] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const runs = data?.indicatorRuns || [];

  // 🌀 Détecte si un recalcul est en cours
  const hasRunningJob = runs.some((r) => r.status === "RUNNING");

  // 🧭 Rafraîchit la liste automatiquement toutes les 3 secondes si un recalcul est en cours
  useEffect(() => {
    if (hasRunningJob || autoRefresh) {
      const interval = setInterval(() => {
        refetch();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hasRunningJob, autoRefresh, refetch]);

  const handleRecalculate = async () => {
    setRunning(true);
    try {
      await dispatch(
        recalculateIndicators(
          {
            periodStart: "2025-01-01",
            periodEnd: "2025-12-31",
            modules: [],
            dryRun,
          },
          "Recalculate indicators",
        ),
      );
      setAutoRefresh(true); // active le refresh automatique
      setTimeout(() => refetch(), 2000);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Block
          title={
            <FormattedMessage
              module={MODULE_NAME}
              id="monitoring.historyTitle"
              defaultMessage="Recalculation history"
            />
          }
          onLoading={isLoading}
          error={error}
        >
          {/* === Barre d'action === */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.5rem",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <FormattedMessage
                  module={MODULE_NAME}
                  id="monitoring.recalc.dryRun"
                  defaultMessage="Simulation only (no save)"
                />
              }
            />
            <Button
              color="primary"
              variant="contained"
              onClick={handleRecalculate}
              disabled={running}
              startIcon={
                running ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {running ? (
                <FormattedMessage
                  module={MODULE_NAME}
                  id="monitoring.recalc.running"
                  defaultMessage="Recalculating..."
                />
              ) : (
                <FormattedMessage
                  module={MODULE_NAME}
                  id="monitoring.recalc.button"
                  defaultMessage="Recalculate indicators"
                />
              )}
            </Button>
          </div>

          {/* === Tableau === */}
          <table
            className="table table-striped"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead style={{ background: "#f5f5f5" }}>
              <tr>
                <th>ID</th>
                <th>
                  <FormattedMessage
                    module={MODULE_NAME}
                    id="monitoring.history.started"
                    defaultMessage="Started"
                  />
                </th>
                <th>
                  <FormattedMessage
                    module={MODULE_NAME}
                    id="monitoring.history.finished"
                    defaultMessage="Finished"
                  />
                </th>
                <th>
                  <FormattedMessage
                    module={MODULE_NAME}
                    id="monitoring.history.period"
                    defaultMessage="Period"
                  />
                </th>
                <th>
                  <FormattedMessage
                    module={MODULE_NAME}
                    id="monitoring.history.modules"
                    defaultMessage="Modules"
                  />
                </th>
                <th>
                  <FormattedMessage
                    module={MODULE_NAME}
                    id="monitoring.history.status"
                    defaultMessage="Status"
                  />
                </th>
                <th>
                  <FormattedMessage
                    module={MODULE_NAME}
                    id="monitoring.history.error"
                    defaultMessage="Error"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {runs.length ? (
                runs.map((r) => {
                  let color = "#999";
                  if (r.status === "RUNNING") color = "#f57c00";
                  else if (r.status === "SUCCESS") color = "#388e3c";
                  else if (r.status === "FAILED") color = "#d32f2f";

                  return (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{new Date(r.startedAt).toLocaleString()}</td>
                      <td>
                        {r.finishedAt
                          ? new Date(r.finishedAt).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        {r.periodStart} → {r.periodEnd}
                      </td>
                      <td>{(r.modules || []).join(", ")}</td>
                      <td style={{ color, fontWeight: "bold" }}>{r.status}</td>
                      <td style={{ color: "red" }}>{r.error || ""}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", color: "#999" }}
                  >
                    <FormattedMessage
                      module={MODULE_NAME}
                      id="monitoring.history.noData"
                      defaultMessage="No data available"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Block>
      </Grid>
    </Grid>
  );
}
