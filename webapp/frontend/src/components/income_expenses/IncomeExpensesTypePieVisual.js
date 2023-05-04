import React from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import CenteredBox from "../utils/CenteredBox";
import { Typography } from "@mui/material";

const IncomeExpensesTypePieVisual = ({
  summaryData,
  filterType = undefined,
}) => {
  const filterTypeName =
    filterType === undefined
      ? `income / expense`
      : filterType === "I"
      ? `income`
      : `expense`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      {summaryData
        .filter((entry) => !filterType || entry.type === filterType) // filter by filterType only if specified, otherwise take all
        .reduce((acc, entry) => acc + entry.value, 0) === 0 ? (
        <CenteredBox>
          <Typography
            sx={{ fontStyle: "italic" }}
          >{`No ${filterTypeName} data`}</Typography>
        </CenteredBox>
      ) : (
        <PieChart>
          <Pie
            dataKey="value"
            nameKey="name"
            data={summaryData.filter(
              (entry) => !filterType || entry.type === filterType
            )}
            cx="50%"
            cy="50%"
            innerRadius={50}
          />
        </PieChart>
      )}
    </ResponsiveContainer>
  );
};

export default IncomeExpensesTypePieVisual;
