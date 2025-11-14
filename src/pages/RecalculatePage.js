import React, { useState, useCallback } from "react";
import { Grid, TextField, MenuItem, Button, CircularProgress } from "@material-ui/core";
import { Block, useSnackbar, useModulesManager } from "@openimis/fe-core";
import { useRecalculateMutation } from "../hooks/useRecalculateMutation";

const MODULES = [
  { value: "payroll", label: "Payroll" },
  { value: "individual", label: "Beneficiaries" },
  { value: "social_protection", label: "Social Protection" },
  { value: "grievance", label: "Grievances" },
];

export default function RecalculatePage({ intl }) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const [periodStart, setPeriodStart] = useState(`${yyyy}-01-01`);
  const [periodEnd, setPeriodEnd] = useState(`${yyyy}-12-31`);
  const [modules, setModules] = useState([]);
  const [dryRun, setDryRun] = useState(false);
  const { showSnack } = useSnackbar();

  const onCompleted = useCallback((res) => {
    const payload = res?.data?.recalculateIndicators;
    if (payload?.status === "STARTED" || payload?.startedAt) {
      showSnack("Recalculation started", { variant: "success" });
    } else if (payload?.error) {
      showSnack(payload.error, { variant: "error" });
    } else {
      showSnack("Recalculation triggered", { variant: "info" });
    }
  }, [showSnack]);

  const onError = useCallback((err) => {
    showSnack(err?.message || "Error", { variant: "error" });
  }, [showSnack]);

  const { mutate, isLoading } = useRecalculateMutation(onCompleted, onError);

  const submit = () => {
    mutate({
      variables: {
        input: {
          periodStart,
          periodEnd,
          modules,
          dryRun,
          clientMutationId: "ui-recalculate-" + Date.now(),
        },
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Block title={intl?.formatMessage ? intl.formatMessage({ id: "monitoring.recalculateTitle" }) : "Recalculate indicators"}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                label="Period start"
                variant="outlined"
                fullWidth
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                label="Period end"
                variant="outlined"
                fullWidth
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Modules (optional)"
                variant="outlined"
                fullWidth
                SelectProps={{ multiple: true, renderValue: (s) => s.join(", ") }}
                value={modules}
                onChange={(e) => setModules(e.target.value)}
              >
                {MODULES.map((m) => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Dry run"
                variant="outlined"
                fullWidth
                value={dryRun ? "true" : "false"}
                onChange={(e) => setDryRun(e.target.value === "true")}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={submit} variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? <CircularProgress size={20} /> : "Start recalculation"}
              </Button>
            </Grid>
          </Grid>
        </Block>
      </Grid>
    </Grid>
  );
}
