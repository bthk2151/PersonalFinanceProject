import { Box, Chip, Tooltip, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  gridNumberComparator,
  gridStringOrNumberComparator,
} from "@mui/x-data-grid";
import React, { useMemo } from "react";
import {
  formatCurrency,
  formatDate,
  getThemeColors,
  intDayToShortDay,
  isSmallScreen,
} from "../utils/js-utils";
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
        valueGetter: (params) => ({
          is_main: params.value,
          type: params.row.type,
        }),
        renderCell: (
          params // because of valueGetter above, params.value = { is_main, type }
        ) =>
          params.value.type === "I" ? (
            params.value.is_main ? (
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
          ) : params.value.is_main ? (
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
        sortComparator: (entry1, entry2, sortDirection) => {
          // because of valueGetter above, entry1.value and entry2.value = { is_main, type }
          const typeComparison =
            gridStringOrNumberComparator(
              entry1.type,
              entry2.type,
              sortDirection
            ) * -1; // MUI datagrid in-built sort comparator function, * -1 to have income by default before expense type

          if (typeComparison !== 0) return typeComparison;

          return (
            gridNumberComparator(
              entry1.is_main,
              entry2.is_main,
              sortDirection
            ) * -1 // another MUI datagrid in-built sort comparator function, * -1 to have main (1) by default before main (0) type
          );
        },
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

  const columnVisibilityModel = {
    is_main: !isSmallScreen(), // hide column is_main / is_necessary icon if it's a small screen, no space lol
  };

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
        return params.row.type === "I"
          ? params.row.is_main.is_main // because of valueGetter above, params.row.is_main = { is_main, type }
            ? "main-income-cell"
            : "side-income-cell"
          : params.row.is_main.is_main // because of valueGetter above, params.row.is_main = { is_main, type }
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
      columnVisibilityModel={columnVisibilityModel}
    />
  );
};

export default IncomeExpensesDataGrid;
