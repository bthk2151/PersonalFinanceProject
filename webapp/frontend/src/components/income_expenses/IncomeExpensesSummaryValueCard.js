import { Card, Typography } from "@mui/material";
import React from "react";
import CenteredBox from "../utils/CenteredBox";
import { formatCurrency } from "../../js-utils";

const IncomeExpensesSummaryValueCard = ({
  amount,
  color,
  name,
  isLargeCard = false,
  icon = null,
}) => {
  return (
    <Card elevation={4} sx={{ flex: 1, p: 2, height: "100%" }}>
      <CenteredBox>
        <Typography variant={isLargeCard ? "h3" : "h5"} color={color}>
          {formatCurrency(amount)}
          {isLargeCard && icon} {/* only show icons for large cards */}
        </Typography>
        <Typography variant={isLargeCard ? "subtitle1" : "caption"}>
          {name}
        </Typography>
      </CenteredBox>
    </Card>
  );
};

export default IncomeExpensesSummaryValueCard;
