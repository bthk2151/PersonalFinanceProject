import { Card, Collapse, Grid, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import GridBox from "../utils/GridBox";
import {
  formatCurrency,
  formatPercentage,
  getThemeColors,
} from "../../utils/js-utils";
import { Check, Close } from "@mui/icons-material";
import IncomeExpensesConfirmDeleteEntryDialog from "./IncomeExpensesConfirmDeleteEntryDialog";
import IncomeExpensesSummaryValueCard from "./IncomeExpensesSummaryValueCard";
import IncomeExpensesDataGrid from "./IncomeExpensesDataGrid";
import SavingsGaugeVisual from "./SavingsGaugeVisual";
import IncomeExpensesTypePieVisual from "./IncomeExpensesTypePieVisual";
import useAuthAxios from "../../utils/useAuthAxios";

// ensure income expense entry types' state values are fixed by storing into a obj dict
const INCOME_TYPES = {
  MAIN_INCOME: "Main Income",
  SIDE_INCOME: "Side Income",
};
const EXPENSE_TYPES = {
  NECESSARY_EXPENSE: "Necessary Expense",
  LUXURY_EXPENSE: "Luxury Expense",
};

const IncomeExpensesVisuals = ({ refreshData, incomeExpenseRefreshSignal }) => {
  const authAxios = useAuthAxios();

  const themeColors = getThemeColors();

  const [selectedMonthYear, setSelectedMonthYear] = useState(dayjs(new Date())); // always default visuals to current month

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
    const request1 = authAxios.get(
      `/api/income-expense-list?month=${
        selectedMonthYear.month() + 1
      }&year=${selectedMonthYear.year()}`
    );

    // request2 - for comparison visuals, get previous month total expenses
    const request2 = authAxios.get(
      `/api/income-expense-list?month=${
        selectedMonthYear.month() === 0 ? 12 : selectedMonthYear.month()
      }&year=${
        selectedMonthYear.month() === 0
          ? selectedMonthYear.year() - 1
          : selectedMonthYear.year()
      }`
    );

    // only when both selected and previous month data is retrieved, data for all income expenses visuals are ready
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

        // use both month data to create gauge visual data
        // gauge visual data format is always either 1) [{total expenses}, {total income - total expenses AKA savings}] or just 2) [{total expenses}]
        // savings may use selected month main income, but if none, use previous month main income to calculate (in this case, its an estimation)
        if (totalMainIncome > 0) {
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
          // use previous month main income with selected month side income
          if (totalExpenses > previousTotalMainIncome + totalSideIncome)
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
                value:
                  previousTotalMainIncome + totalSideIncome - totalExpenses,
                fill: themeColors.positive,
              },
            ]);
        } else {
          // insufficient income data, no visual to show
          setGaugeVisualData([]);
        }
      })
      .catch((error) => console.log(error.message));
  }, [selectedMonthYear, incomeExpenseRefreshSignal]);

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
          <Typography variant="h5">Income & Expenses</Typography>
        </Grid>
        <Grid item xs={5}>
          <GridBox justifyContent="flex-end">
            <DatePicker
              views={["year", "month"]}
              disableFuture
              value={selectedMonthYear}
              onChange={(newMonthYear) =>
                dayjs(newMonthYear).isValid()
                  ? setSelectedMonthYear(newMonthYear)
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
            <IncomeExpensesTypePieVisual
              summaryData={summaryData}
              filterType="I"
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack
            direction={{ xs: "row", md: "column" }}
            spacing={1}
            justifyContent="space-between"
            height="100%"
          >
            <IncomeExpensesSummaryValueCard
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
            <IncomeExpensesSummaryValueCard
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
            <IncomeExpensesTypePieVisual
              summaryData={summaryData}
              filterType="E"
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack
            direction={{ xs: "row", md: "column" }}
            spacing={1}
            justifyContent="space-between"
            height="100%"
          >
            <IncomeExpensesSummaryValueCard
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
            <IncomeExpensesSummaryValueCard
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
          <IncomeExpensesSummaryValueCard
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
            <SavingsGaugeVisual
              {...{
                gaugeVisualData,
                selectedMonthTotalExpenses,
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={4}>
            <IncomeExpensesDataGrid
              {...{
                data,
                handleDeleteRow,
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
