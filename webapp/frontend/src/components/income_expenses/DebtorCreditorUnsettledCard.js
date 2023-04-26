import React from "react";
import { formatCurrency } from "../util/util";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";

const DebtorCreditorUnsettledCard = ({ entry, refreshData }) => {
  const deleteEntry = (e) => {
    axios
      .delete(
        `/api/${entry.type === "D" ? "debtor" : "creditor"}/${entry.id}/delete`
      )
      .then((_) => refreshData("DEBTOR_CREDITOR"))
      .catch((error) => console.log(error.message));
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="subtitle1"
          color={entry.type === "D" ? "success.main" : "error"} // not sure why success.main for theme but error for theme error, mui is weird like that
        >
          {entry.type === "D" ? "Debtor" : "Creditor"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{entry.name}</Typography>
          <Typography variant="h6">{formatCurrency(entry.amount)}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" color="inherit" onClick={deleteEntry}>
          {entry.type === "D" ? "Received" : "Settled"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default DebtorCreditorUnsettledCard;
