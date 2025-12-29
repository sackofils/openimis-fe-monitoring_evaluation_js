import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  errorText: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  historyBox: {
    padding: theme.spacing(2),
    background: "#fafafa",
    borderRadius: 12,
    marginTop: theme.spacing(2),
  },
  historyItem: {
    padding: "4px 0",
    fontSize: "0.9rem",
  },
});

function ManualValueModal({
  open,
  onClose,
  indicator,
  editingValue,
  onSave,
  classes,
}) {
  const lastValue = indicator?.last_value ?? null;
  const historyValues = indicator?.values?.edges?.map((e) => e.node) ?? [];

  const [value, setValue] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  const computePeriod = () => {
    const today = new Date();
    let start, end;

    switch (indicator.frequency) {
      case "MENSUEL":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "TRIMESTRIEL":
        const q = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), q * 3, 1);
        end = new Date(today.getFullYear(), q * 3 + 3, 0);
        break;
      case "SEMESTRIEL":
        const s = today.getMonth() < 6 ? 0 : 6;
        start = new Date(today.getFullYear(), s, 1);
        end = new Date(today.getFullYear(), s + 6, 0);
        break;
      case "ANNUEL":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        start = "";
        end = "";
    }

    if (start && end) {
      setPeriodStart(start.toISOString().slice(0, 10));
      setPeriodEnd(end.toISOString().slice(0, 10));
    }
  };

  useEffect(() => {
    if (open) {
      if (editingValue) {
        setValue(editingValue.value ?? editingValue.qualitativeValue ?? "");
        setPeriodStart(editingValue.periodStart || "");
        setPeriodEnd(editingValue.periodEnd || "");
      } else {
        setValue("");
        computePeriod();
      }
    }
  }, [open, editingValue]);

  const hasError =
    lastValue !== null &&
    !editingValue && // règle de cumul seulement pour création
    value !== "" &&
    parseFloat(value) < parseFloat(lastValue);

  const handleSubmit = () => {
    onSave &&
      onSave({
        id: editingValue?.id,
        value: parseFloat(value),
        periodStart,
        periodEnd,
        source: "Saisie manuelle",
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingValue ? "Modifier une valeur" : "Ajouter une valeur manuelle"}
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1">
          <b>Dernière valeur enregistrée :</b>{" "}
          {lastValue !== null ? lastValue : "Aucune"}
        </Typography>

        <Grid container spacing={2} style={{ marginTop: 15 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Valeur"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              error={hasError}
              helperText={
                hasError
                  ? `La valeur doit être >= ${lastValue}`
                  : "Saisissez une valeur numérique"
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Début de période"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Fin de période"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </Grid>
        </Grid>

        {!!historyValues.length && (
          <Paper elevation={0} className={classes.historyBox}>
            <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
              Historique des valeurs
            </Typography>
            <Divider style={{ margin: "8px 0 12px 0" }} />
            {historyValues.map((v, i) => (
              <Typography key={i} className={classes.historyItem}>
                <b>{v.period}</b> : {v.value}
              </Typography>
            ))}
          </Paper>
        )}

        {hasError && !editingValue && (
          <Typography className={classes.errorText}>
            La nouvelle valeur doit respecter la règle de cumul.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={hasError || !value || !periodStart || !periodEnd}
          onClick={handleSubmit}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withTheme(withStyles(styles)(ManualValueModal));
