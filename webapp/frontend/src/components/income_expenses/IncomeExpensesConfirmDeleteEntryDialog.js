import { Check, Close } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React from "react";
import useAuthAxios from "../../utils/useAuthAxios";

const IncomeExpensesConfirmDeleteEntryDialog = ({
  confirmDeleteEntryDialogOpen,
  setConfirmDeleteEntryDialogOpen,
  deleteEntryRow,
  setDeleteEntryRow,
  refreshData,
}) => {
  const authAxios = useAuthAxios();

  const handleClose = () => {
    setDeleteEntryRow({});
    setConfirmDeleteEntryDialogOpen(false);
  };

  const deleteEntry = () => {
    const endpoint = `/api/${
      deleteEntryRow.type === "I" ? "income" : "expense"
    }/${deleteEntryRow.id}/delete`;

    authAxios
      .delete(endpoint)
      .then((response) => {
        refreshData("INCOME_EXPENSE");
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
