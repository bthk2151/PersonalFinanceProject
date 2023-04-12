import { Check, Close } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React from "react";

const IncomeExpensesConfirmDeleteEntryDialog = ({
  confirmDeleteEntryDialogOpen,
  setConfirmDeleteEntryDialogOpen,
  deleteEntryRow,
  setDeleteEntryRow,
  refreshData,
}) => {
  const handleClose = () => {
    setDeleteEntryRow({});
    setConfirmDeleteEntryDialogOpen(false);
  };

  const deleteEntry = () => {
    const endpoint = `/api/${
      deleteEntryRow.type === "I" ? "income" : "expense"
    }/${deleteEntryRow.id}/delete`;

    axios
      .delete(endpoint)
      .then((response) => {
        refreshData();
        handleClose();
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <Dialog
      open={confirmDeleteEntryDialogOpen}
      onClose={handleClose}
      transitionDuration={{ enter: 250, exit: 0 }} // entrance take 0.25 seconds, exit is instant
    >
      <DialogTitle>{`Delete ${
        deleteEntryRow.type === "I" ? "income" : "expense"
      } entry: ${deleteEntryRow.name}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>Note: This action is irreversible</DialogContentText>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
        <IconButton onClick={deleteEntry}>
          <Check />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default IncomeExpensesConfirmDeleteEntryDialog;
