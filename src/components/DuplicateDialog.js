import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";

export default function DuplicateDialog({ open, item, onClose, onConfirm }) {
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item?.code) {
      setNewCode(`${item.code}_COPY`);
      setLoading(false);
    }
  }, [item]);

  const handleDuplicate = async () => {
    setLoading(true);

    const result = await onConfirm(newCode); // doit retourner une Promise

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={!loading ? onClose : null} maxWidth="xs" fullWidth>
      <DialogTitle>Dupliquer l’indicateur</DialogTitle>

      <DialogContent>
        <Typography>
          Indicateur source : <b>{item?.code}</b>
        </Typography>

        <TextField
          autoFocus
          margin="dense"
          label="Nouveau code"
          fullWidth
          disabled={loading}
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button disabled={loading} onClick={onClose}>
          Annuler
        </Button>

        <Button
          color="primary"
          variant="contained"
          disabled={!newCode || loading}
          onClick={handleDuplicate}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Dupliquer"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
