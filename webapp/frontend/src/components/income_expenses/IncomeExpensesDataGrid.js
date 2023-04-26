import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import {
  formatCurrency,
  formatDate,
  intDayToShortDay,
  isSmallScreen,
} from "../util/util";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";

const IncomeExpensesDataGrid = ({ data, handleDeleteRow }) => {
  const columns = useMemo(
    () => [
      {
        field: "day_of_week",
        headerName: "Day",
        valueFormatter: (params) => intDayToShortDay(params.value),
        flex: 0.4,
        sortable: false,
      },
      {
        field: "date",
        headerName: "Date",
        type: "date",
        valueGetter: (params) => dayjs(params.value), // raw column data
        valueFormatter: (params) => formatDate(params.value, isSmallScreen()), // formatted column data, if small screen, use short form DD/MM display
        flex: 0.6,
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        renderCell: (params) => (
          <Tooltip title={params.value} enterTouchDelay={0}>
            <Box component="span">{params.value}</Box>
          </Tooltip>
        ),
      },
      {
        field: "amount",
        headerName: "Amount",
        type: "number",
        renderCell: (params) => (
          <Chip
            label={formatCurrency(params.value)}
            color={params.row.type === "I" ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        ),
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        getActions: (params) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="Delete">
                <Delete />
              </Tooltip>
            }
            onClick={() => handleDeleteRow(params.row)}
            label="Delete"
          />,
        ],
        flex: 0.1,
        sortable: false,
      },
    ],
    []
  );

  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row.uniqueId} // MUI datagrid mandates that all rows need a unique id
      hideScrollbar
      disableColumnMenu
      disableRowSelectionOnClick
      autoHeight
      sx={{ px: { xs: 0, md: 1 }, borderStyle: "none" }}
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },
      }}
      pageSizeOptions={[5, 10, 20]}
      localeText={{
        noRowsLabel: (
          <Typography sx={{ fontStyle: "italic" }}>
            No income / expense data
          </Typography>
        ),
      }}
    />
  );
};

export default IncomeExpensesDataGrid;
