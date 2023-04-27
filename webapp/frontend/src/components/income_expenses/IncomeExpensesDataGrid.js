import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import {
  formatCurrency,
  formatDate,
  getThemeColors,
  intDayToShortDay,
  isSmallScreen,
} from "../util/util";
import dayjs from "dayjs";
import {
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";

const IncomeExpensesDataGrid = ({ data, handleDeleteRow }) => {
  const themeColors = getThemeColors();

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
        field: "is_main",
        headerName: "",
        renderCell: (params) =>
          params.row.type === "I" ? (
            params.value ? (
              <KeyboardDoubleArrowUp
                fontSize="large"
                sx={{
                  color: themeColors.positiveStrong,
                }}
              />
            ) : (
              <KeyboardArrowUp
                fontSize="large"
                sx={{
                  color: themeColors.positive,
                }}
              />
            )
          ) : params.value ? (
            <KeyboardDoubleArrowDown
              fontSize="large"
              sx={{
                color: themeColors.negativeStrong,
              }}
            />
          ) : (
            <KeyboardArrowDown
              fontSize="large"
              sx={{
                color: themeColors.negative,
              }}
            />
          ),
        flex: 0.1,
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
      getCellClassName={(params) => {
        console.log(params);
        return params.row.type === "I"
          ? params.row.is_main
            ? "main-income-cell"
            : "side-income-cell"
          : params.row.is_main
          ? "necessary-expense-cell"
          : "luxury-expense-cell";
      }}
      sx={{
        px: { xs: 0, md: 1 },
        border: "none",
        "& .main-income-cell:hover": {
          color: themeColors.positiveStrong,
        },
        "& .side-income-cell:hover": {
          color: themeColors.positive,
        },
        "& .necessary-expense-cell:hover": {
          color: themeColors.negativeStrong,
        },
        "& .luxury-expense-cell:hover": {
          color: themeColors.negative,
        },
      }}
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
      columnVisibilityModel={{
        is_main: !isSmallScreen(), // hide column is_main / is_necessary icon if it's a small screen, no space lol
      }}
    />
  );
};

export default IncomeExpensesDataGrid;
