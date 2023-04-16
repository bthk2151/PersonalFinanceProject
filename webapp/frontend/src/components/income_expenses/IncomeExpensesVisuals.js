import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import GridBox from "../util/GridBox";
import CenteredBox from "../util/CenteredBox";
import axios from "axios";
import {
  formatCurrency,
  formatDate,
  getThemeColors,
  intDayToShortDay,
  isSmallScreen,
} from "../util/util";
import { Delete } from "@mui/icons-material";
import IncomeExpensesConfirmDeleteEntryDialog from "./IncomeExpensesConfirmDeleteEntryDialog";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import IncomeExpenseSummaryValueCard from "./IncomeExpenseSummaryValueCard";

// ensure income expense entry types' state values are fixed by storing into a obj dict
const INCOME_TYPES = {
  MAIN_INCOME: "Main Income",
  SIDE_INCOME: "Side Income",
};
const EXPENSE_TYPES = {
  NECESSARY_EXPENSE: "Necessary Expense",
  LUXURY_EXPENSE: "Luxury Expense",
};

const IncomeExpensesVisuals = ({ refreshData, refreshSignal }) => {
  const themeColors = getThemeColors();

  const [month, setMonth] = useState(dayjs(new Date())); // always default visuals to current month

  const commonColumnProps = { sortable: false }; // common column props to be applied on each datagrid column
  const columns = useMemo(
    () => [
      {
        field: "day_of_week",
        headerName: "Day",
        valueFormatter: (params) => intDayToShortDay(params.value),
        flex: 0.4,
        ...commonColumnProps,
      },
      {
        field: "date",
        headerName: "Date",
        type: "date",
        valueGetter: (params) => dayjs(params.value), // raw column data
        valueFormatter: (params) => formatDate(params.value, isSmallScreen()), // formatted column data, if small screen, use short form DD/MM display
        flex: 0.6,
        ...commonColumnProps,
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
        ...commonColumnProps,
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
        ...commonColumnProps,
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
        ...commonColumnProps,
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([
    {
      name: INCOME_TYPES.MAIN_INCOME,
      type: "I",
      value: 0,
      fill: themeColors.positiveStrong,
    },
    {
      name: INCOME_TYPES.SIDE_INCOME,
      type: "I",
      value: 0,
      fill: themeColors.positive,
    },
    {
      name: EXPENSE_TYPES.NECESSARY_EXPENSE,
      type: "E",
      value: 0,
      fill: themeColors.negativeStrong,
    },
    {
      name: EXPENSE_TYPES.LUXURY_EXPENSE,
      type: "E",
      value: 0,
      fill: themeColors.negative,
    },
  ]);

  // helper function to sum entry amount by type
  const totalEntryAmountByType = (entries, type, isMain) =>
    entries.reduce(
      (acc, entry) =>
        entry.type === type && entry.is_main === isMain
          ? acc + parseFloat(entry.amount)
          : acc,
      0
    );

  useEffect(() => {
    axios
      .get(
        `/api/income-expense-list?month=${
          month.month() + 1
        }&year=${month.year()}`
      )
      .then((response) => {
        const processedData = response.data.map((entry) => ({
          ...entry,
          uniqueId: entry.type + entry.id, // a unique identifier for each row, since entries are pulled from both income and expense table
        }));

        setData(processedData);
        setSummaryData([
          {
            name: INCOME_TYPES.MAIN_INCOME,
            type: "I",
            value: totalEntryAmountByType(processedData, "I", true),
            fill: themeColors.positiveStrong,
          },
          {
            name: INCOME_TYPES.SIDE_INCOME,
            type: "I",
            value: totalEntryAmountByType(processedData, "I", false),
            fill: themeColors.positive,
          },
          {
            name: EXPENSE_TYPES.NECESSARY_EXPENSE,
            type: "E",
            value: totalEntryAmountByType(processedData, "E", true),
            fill: themeColors.negativeStrong,
          },
          {
            name: EXPENSE_TYPES.LUXURY_EXPENSE,
            type: "E",
            value: totalEntryAmountByType(processedData, "E", false),
            fill: themeColors.negative,
          },
        ]);
      })
      .catch((error) => console.log(error.message));
  }, [month, refreshSignal]);

  const [confirmDeleteEntryDialogOpen, setConfirmDeleteEntryDialogOpen] =
    useState(false);
  const [deleteEntryRow, setDeleteEntryRow] = useState({});
  const handleDeleteRow = (row) => {
    setDeleteEntryRow(row); // save to state all data of delete row, this will be used in the delete entry dialog
    setConfirmDeleteEntryDialogOpen(true);
  };

  return (
    <>
      <Grid container rowSpacing={2}>
        <Grid item xs={7}>
          <Typography variant="h6">Income & Expenses</Typography>
        </Grid>
        <Grid item xs={5}>
          <GridBox justifyContent="flex-end">
            <DatePicker
              views={["year", "month"]}
              disableFuture
              value={month}
              onChange={(newMonth) =>
                dayjs(newMonth).isValid()
                  ? setMonth(newMonth)
                  : dayjs(new Date())
              }
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </GridBox>
        </Grid>
        <Grid item xs={12} md={4} paddingRight={{ xs: 0, md: 1 }}>
          <Card elevation={4}>
            <ResponsiveContainer width="100%" height={300}>
              {summaryData
                .filter((summaryValue) => summaryValue.type === "I")
                .reduce((acc, summaryValue) => acc + summaryValue.value, 0) ===
              0 ? (
                <CenteredBox>
                  <Typography sx={{ fontStyle: "italic" }}>
                    No income data
                  </Typography>
                </CenteredBox>
              ) : (
                <PieChart>
                  <Pie
                    dataKey="value"
                    nameKey="name"
                    data={summaryData.filter(
                      (summaryValue) => summaryValue.type === "I"
                    )}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack
            direction={{ xs: "row", md: "column" }}
            spacing={1}
            justifyContent="space-between"
            height="100%"
          >
            <IncomeExpenseSummaryValueCard
              amount={
                summaryData.find(
                  (summaryValue) =>
                    summaryValue.name === INCOME_TYPES.MAIN_INCOME
                ).value
              }
              color={themeColors.positiveStrong}
              name={
                summaryData.find(
                  (summaryValue) =>
                    summaryValue.name === INCOME_TYPES.MAIN_INCOME
                ).name
              }
            />
            <IncomeExpenseSummaryValueCard
              amount={
                summaryData.find(
                  (summaryValue) =>
                    summaryValue.name === INCOME_TYPES.SIDE_INCOME
                ).value
              }
              color={themeColors.positive}
              name={
                summaryData.find(
                  (summaryValue) =>
                    summaryValue.name === INCOME_TYPES.SIDE_INCOME
                ).name
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={4} paddingX={{ xs: 0, md: 1 }}>
          <Card elevation={4}>
            <ResponsiveContainer width="100%" height={300}>
              {summaryData
                .filter((summaryValue) => summaryValue.type === "E")
                .reduce((acc, summaryValue) => acc + summaryValue.value, 0) ===
              0 ? (
                <CenteredBox>
                  <Typography sx={{ fontStyle: "italic" }}>
                    No expense data
                  </Typography>
                </CenteredBox>
              ) : (
                <PieChart>
                  <Pie
                    dataKey="value"
                    nameKey="name"
                    data={summaryData.filter(
                      (summaryValue) => summaryValue.type === "E"
                    )}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack
            direction={{ xs: "row", md: "column" }}
            spacing={1}
            justifyContent="space-between"
            height="100%"
          >
            <IncomeExpenseSummaryValueCard
              amount={
                summaryData.find(
                  (summaryValue) =>
                    summaryValue.name === EXPENSE_TYPES.NECESSARY_EXPENSE
                ).value
              }
              color={themeColors.negativeStrong}
              name={
                summaryData.find(
                  (summaryValue) =>
                    summaryValue.name === EXPENSE_TYPES.NECESSARY_EXPENSE
                ).name
              }
            />
            <IncomeExpenseSummaryValueCard
              amount={
                summaryData.find(
                  (summaryValue) =>
                    summaryValue.name === EXPENSE_TYPES.LUXURY_EXPENSE
                ).value
              }
              color={themeColors.negative}
              name={
                summaryData.find(
                  (summaryValue) =>
                    summaryValue.name === EXPENSE_TYPES.LUXURY_EXPENSE
                ).name
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={4}>
            <DataGrid
              rows={data}
              columns={columns}
              getRowId={(row) => row.uniqueId} // MUI datagrid mandates that all rows need a unique id
              hideScrollbar
              disableColumnMenu
              autoHeight
              sx={{ px: { xs: 0, md: 1 }, borderStyle: "none" }}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 20]}
            />
          </Card>
        </Grid>
      </Grid>
      <IncomeExpensesConfirmDeleteEntryDialog
        {...{
          confirmDeleteEntryDialogOpen,
          setConfirmDeleteEntryDialogOpen,
          deleteEntryRow,
          setDeleteEntryRow,
          refreshData,
        }}
      />
    </>
  );
};

export default IncomeExpensesVisuals;
