import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

export default function NotificationSnackbar({ open, message, severity = "success", onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <MuiAlert elevation={6} variant="filled" severity={severity} onClose={onClose}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}
