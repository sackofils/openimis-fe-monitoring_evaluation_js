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
  MenuItem,
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
  const lastValue = indicator?.lastValue ?? null;
  const historyValues = indicator?.values?.edges?.map((e) => e.node) ?? [];
  const unit = (indicator?.unit || "").toLowerCase();

  const [value, setValue] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  const computePeriod = () => {
    const today = new Date();
    let start, end;

    switch (indicator?.frequency) {
      case "MENSUEL":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "TRIMESTRIEL": {
        const q = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), q * 3, 1);
        end = new Date(today.getFullYear(), q * 3 + 3, 0);
        break;
      }
      case "SEMESTRIEL": {
        const s = today.getMonth() < 6 ? 0 : 6;
        start = new Date(today.getFullYear(), s, 1);
        end = new Date(today.getFullYear(), s + 6, 0);
        break;
      }
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
        if (unit === "oui_non") {
          setValue(editingValue.qualitativeValue ?? editingValue.value ?? "");
        } else {
          setValue(editingValue.value ?? editingValue.qualitativeValue ?? "");
        }
        setPeriodStart(editingValue.periodStart || "");
        setPeriodEnd(editingValue.periodEnd || "");
      } else {
        setValue(lastValue ?? "");
        computePeriod();
      }
    }
  }, [open, editingValue, unit]);

  const isBooleanUnit = unit === "oui_non";
  const isNumericUnit = unit === "nombre" || unit === "pourcentage" || unit === 'gnf';

  const hasError =
    isNumericUnit &&
    lastValue !== null &&
    !editingValue &&
    value !== "" &&
    parseFloat(value) < parseFloat(lastValue);

  const handleSubmit = () => {
    if (!onSave) return;

    const payload = {
      id: editingValue?.id,
      value: ((value === "") ? null : parseFloat(value)),
      periodStart,
      periodEnd,
      source: "Saisie manuelle",
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingValue ? "Modifier une valeur" : "Ajouter une valeur manuelle"}
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1">
          <b>Dernière valeur enregistrée :</b>{" "}
          {lastValue !== null
          ? unit === "oui_non"
            ? String(lastValue) === "1"
              ? "Oui"
              : "Non"
            : lastValue
          : "Aucune"}
        </Typography>

        <Grid container spacing={2} style={{ marginTop: 15 }}>
          <Grid item xs={12}>
            {isBooleanUnit ? (
              <TextField
                select
                fullWidth
                label="Valeur"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                helperText="Sélectionnez Oui ou Non"
              >
                <MenuItem value="">Sélectionner</MenuItem>
                <MenuItem value="1">Oui</MenuItem>
                <MenuItem value="0">Non</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                type="number"
                label={unit === "pourcentage" ? "Valeur (%)" : "Valeur"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                error={hasError}
                helperText={
                  hasError
                    ? `La valeur doit être >= ${lastValue}`
                    : unit === "pourcentage"
                    ? "Saisissez un pourcentage"
                    : "Saisissez une valeur numérique"
                }
                inputProps={
                  unit === "pourcentage"
                    ? { min: 0, max: 100, step: "any" }
                    : { step: "any" }
                }
              />
            )}
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
                <b>{v.period}</b> :{" "}
                {v.qualitativeValue ?? v.value}
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