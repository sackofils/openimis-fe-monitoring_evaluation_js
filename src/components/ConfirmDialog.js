import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";

export default function ConfirmDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = false,
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!onConfirm) return;

    setLoading(true);
    const maybePromise = onConfirm();

    // Si onConfirm retourne une Promise, on attend
    if (maybePromise && typeof maybePromise.then === "function") {
      maybePromise.finally(() => setLoading(false));
    } else {
      // Sinon, on arrête le loading immédiatement
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" style={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Typography>{message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button disabled={loading} onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          onClick={handleConfirm}
          color={danger ? "secondary" : "primary"}
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            confirmLabel
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
