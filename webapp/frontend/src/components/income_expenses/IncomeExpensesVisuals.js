import {
  Box,
  Card,
  Chip,
  Grid,
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
  formatPercentage,
  getThemeColors,
  intDayToShortDay,
  isSmallScreen,
} from "../util/util";
import { Check, Close, Delete } from "@mui/icons-material";
import IncomeExpensesConfirmDeleteEntryDialog from "./IncomeExpensesConfirmDeleteEntryDialog";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { ResponsiveContainer, PieChart, Pie, Sector } from "recharts";
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

  const [selectedMonthTotalExpenses, setSelectedMonthTotalExpenses] =
    useState(0);
  const [previousMonthTotalExpenses, setPreviousMonthTotalExpenses] =
    useState(0);

  const [gaugeVisualData, setGaugeVisualData] = useState([]);

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
  const totalEntryAmountByType = (entries, type, isMain = undefined) =>
    entries.reduce(
      (acc, entry) =>
        entry.type === type &&
        (isMain === undefined || entry.is_main === isMain) // if no isMain param parsed, then reduce by entry.type alone
          ? acc + parseFloat(entry.amount)
          : acc,
      0
    );

  useEffect(() => {
    // request1 - get selected month data
    const request1 = axios.get(
      `/api/income-expense-list?month=${month.month() + 1}&year=${month.year()}`
    );

    // request2 - for comparison visuals, get previous month total expenses
    const request2 = axios.get(
      `/api/income-expense-list?month=${
        month.month() === 0 ? 12 : month.month()
      }&year=${month.month() === 0 ? month.year() - 1 : month.year()}`
    );

    // only when both selected and previous month data is retrieved, data for all visuals are ready
    Promise.all([request1, request2])
      .then(([response1, response2]) => {
        const selectedMonthData = response1.data.map((entry) => ({
          ...entry,
          uniqueId: entry.type + entry.id, // a unique identifier for each row, since entries are pulled from both income and expense table
        }));
        const previousMonthData = response2.data.map((entry) => ({
          ...entry,
          uniqueId: entry.type + entry.id,
        }));

        // deal with selected month data
        const totalMainIncome = totalEntryAmountByType(
          selectedMonthData,
          "I",
          true
        );
        const totalSideIncome = totalEntryAmountByType(
          selectedMonthData,
          "I",
          false
        );
        const totalNecessaryExpense = totalEntryAmountByType(
          selectedMonthData,
          "E",
          true
        );
        const totalLuxuryExpense = totalEntryAmountByType(
          selectedMonthData,
          "E",
          false
        );

        const totalIncome = totalEntryAmountByType(selectedMonthData, "I");
        const totalExpenses = totalEntryAmountByType(selectedMonthData, "E");

        setData(selectedMonthData);
        setSummaryData([
          {
            name: INCOME_TYPES.MAIN_INCOME,
            type: "I",
            value: totalMainIncome,
            fill: themeColors.positiveStrong,
          },
          {
            name: INCOME_TYPES.SIDE_INCOME,
            type: "I",
            value: totalSideIncome,
            fill: themeColors.positive,
          },
          {
            name: EXPENSE_TYPES.NECESSARY_EXPENSE,
            type: "E",
            value: totalNecessaryExpense,
            fill: themeColors.negativeStrong,
          },
          {
            name: EXPENSE_TYPES.LUXURY_EXPENSE,
            type: "E",
            value: totalLuxuryExpense,
            fill: themeColors.negative,
          },
        ]);

        setSelectedMonthTotalExpenses(totalExpenses);

        // deal with previous month data
        const previousTotalExpenses = totalEntryAmountByType(
          previousMonthData,
          "E"
        );
        const previousTotalMainIncome = totalEntryAmountByType(
          previousMonthData,
          "I",
          true
        );

        setPreviousMonthTotalExpenses(previousTotalExpenses);

        // lastly, use both month data to create gauge visual data
        // gauge visual data format is always 1) [{total expenses}, {total income - total expenses AKA savings}] or just 2) [{total expenses}]
        // savings may use selected month income, if none, use previous month main income to calculate (in this case, its an estimation)
        if (totalIncome > 0) {
          // use selected month main income
          if (totalExpenses > totalIncome)
            // total income fully spent, none remaining
            setGaugeVisualData([
              {
                name: "Expenses [EXCEEDED INCOME]",
                value: totalExpenses,
                fill: themeColors.negative,
              },
            ]);
          else
            setGaugeVisualData([
              {
                name: "Expenses",
                value: totalExpenses,
                fill: themeColors.negative,
              },
              {
                name: "Savings",
                value: totalIncome - totalExpenses,
                fill: themeColors.positive,
              },
            ]);
        } else if (previousTotalMainIncome > 0) {
          // use previous month main income
          if (totalExpenses > previousTotalMainIncome)
            // estimated income fully spent, none remaining
            setGaugeVisualData([
              {
                name: "Expenses [EXCEEDED ESTIMATED INCOME]",
                value: totalExpenses,
                fill: themeColors.negative,
              },
            ]);
          else
            setGaugeVisualData([
              {
                name: "Expenses",
                value: totalExpenses,
                fill: themeColors.negative,
              },
              {
                name: "[Estimated] Savings",
                value: previousTotalMainIncome - totalExpenses,
                fill: themeColors.positive,
              },
            ]);
        } else {
          // insufficient income data, no visual to show
          setGaugeVisualData([]);
        }
      })
      .catch((error) => console.log(error.message));
  }, [month, refreshSignal]);

  const renderActiveSector = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      percent,
      name,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 10) * cos;
    const my = cy + (outerRadius + 130) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    const tWidth = isSmallScreen() ? 150 : 300; // for everything to be visible, require the text to breakline if its small screen
    const tHeight = 150;
    const tx = ex + (cos >= 0 ? 1 : -1) * 12 - (cos >= 0 ? 0 : tWidth);
    const ty = ey - 37;
    const tAlign = cos >= 0 ? "left" : "right";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle - 2}
          endAngle={endAngle + 2}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <foreignObject x={tx} y={ty} width={tWidth} height={tHeight}>
          <Box component="div" sx={{ textAlign: tAlign }}>
            <Typography variant="caption">
              <b>{name}</b>
              <br />
              {formatCurrency(value)}
              <br />
              {`(${(percent * 100).toFixed(2)}%)`}
            </Typography>
          </Box>
        </foreignObject>
      </g>
    );
  };

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
                .filter((entry) => entry.type === "I")
                .reduce((acc, entry) => acc + entry.value, 0) === 0 ? (
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
                    data={summaryData.filter((entry) => entry.type === "I")}
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
                  (entry) => entry.name === INCOME_TYPES.MAIN_INCOME
                ).value
              }
              color={themeColors.positiveStrong}
              name={
                summaryData.find(
                  (entry) => entry.name === INCOME_TYPES.MAIN_INCOME
                ).name
              }
            />
            <IncomeExpenseSummaryValueCard
              amount={
                summaryData.find(
                  (entry) => entry.name === INCOME_TYPES.SIDE_INCOME
                ).value
              }
              color={themeColors.positive}
              name={
                summaryData.find(
                  (entry) => entry.name === INCOME_TYPES.SIDE_INCOME
                ).name
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={4} paddingX={{ xs: 0, md: 1 }}>
          <Card elevation={4}>
            <ResponsiveContainer width="100%" height={300}>
              {summaryData
                .filter((entry) => entry.type === "E")
                .reduce((acc, entry) => acc + entry.value, 0) === 0 ? (
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
                    data={summaryData.filter((entry) => entry.type === "E")}
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
                  (entry) => entry.name === EXPENSE_TYPES.NECESSARY_EXPENSE
                ).value
              }
              color={themeColors.negativeStrong}
              name={
                summaryData.find(
                  (entry) => entry.name === EXPENSE_TYPES.NECESSARY_EXPENSE
                ).name
              }
            />
            <IncomeExpenseSummaryValueCard
              amount={
                summaryData.find(
                  (entry) => entry.name === EXPENSE_TYPES.LUXURY_EXPENSE
                ).value
              }
              color={themeColors.negative}
              name={
                summaryData.find(
                  (entry) => entry.name === EXPENSE_TYPES.LUXURY_EXPENSE
                ).name
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <IncomeExpenseSummaryValueCard
            amount={selectedMonthTotalExpenses} // selected month total spending
            color={
              // good if spending is less than previous month
              selectedMonthTotalExpenses > previousMonthTotalExpenses
                ? themeColors.negative
                : themeColors.positive
            }
            // selected month vs previous month total spending
            name={
              `Previous Month: ${formatCurrency(previousMonthTotalExpenses)}` +
              (selectedMonthTotalExpenses > 0 || previousMonthTotalExpenses > 0
                ? ` (${formatPercentage(
                    (previousMonthTotalExpenses - selectedMonthTotalExpenses) /
                      previousMonthTotalExpenses
                  )})`
                : ``)
            }
            isLargeCard
            icon={
              // good if spending is less than previous month
              selectedMonthTotalExpenses > previousMonthTotalExpenses ? (
                <Close />
              ) : (
                <Check />
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6} paddingLeft={{ xs: 0, md: 1 }}>
          <Card elevation={4}>
            <ResponsiveContainer width="100%" height={300}>
              {gaugeVisualData.length === 0 ||
              selectedMonthTotalExpenses === 0 ? (
                <CenteredBox>
                  {selectedMonthTotalExpenses === 0 ? (
                    <Typography sx={{ fontStyle: "italic" }}>
                      No expense data
                    </Typography>
                  ) : (
                    <Tooltip
                      title="Selected month or preceding selected month need to have at least one main income entry to show percentage of main income spent visual"
                      enterTouchDelay={0}
                    >
                      <Typography sx={{ fontStyle: "italic" }}>
                        Insufficient main income data
                      </Typography>
                    </Tooltip>
                  )}
                </CenteredBox>
              ) : (
                <PieChart>
                  <Pie
                    dataKey="value"
                    nameKey="name"
                    data={gaugeVisualData}
                    cx="50%"
                    cy="90%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={70}
                    activeIndex={gaugeVisualData.map((_, index) => index)} // all gauge data are displayed as active to show more data on each sector
                    activeShape={renderActiveSector}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </Card>
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
              localeText={{
                noRowsLabel: (
                  <Typography sx={{ fontStyle: "italic" }}>
                    No income or expense data
                  </Typography>
                ),
              }}
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
