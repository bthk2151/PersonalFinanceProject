import { Card, Typography } from "@mui/material";
import React from "react";
import CenteredBox from "../util/CenteredBox";
import { formatCurrency } from "../util/util";

const IncomeExpenseSummaryValueCard = ({ amount, color, name }) => {
  return (
    <Card elevation={4} sx={{ flex: 1, py: 2 }}>
      <CenteredBox>
        <Typography variant="h5" color={color}>
          {formatCurrency(amount)}
        </Typography>
        <Typography variant="caption">{name}</Typography>
      </CenteredBox>
    </Card>
  );
};

export default IncomeExpenseSummaryValueCard;
