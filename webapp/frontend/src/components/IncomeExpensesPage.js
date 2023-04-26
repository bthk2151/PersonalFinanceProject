import { Divider } from "@mui/material";
import React, { useState } from "react";
import IncomeExpensesEntryForm from "./income_expenses/IncomeExpensesEntryForm";
import IncomeExpensesVisuals from "./income_expenses/IncomeExpensesVisuals";
import DebtorCreditorCards from "./income_expenses/DebtorCreditorCards";

const IncomeExpensesPage = () => {
  const [incomeExpenseRefreshSignal, setIncomeExpenseRefreshSignal] =
    useState(false);
  const [debtorCreditorRefreshSignal, setDebtorCreditorRefreshSignal] =
    useState(false);

  // whenever this refresh signal is inverted, respective useEffect() will fetch latest data for specified arg tye
  const refreshData = (type = null) =>
    type === "INCOME_EXPENSE"
      ? setIncomeExpenseRefreshSignal(!incomeExpenseRefreshSignal)
      : type === "DEBTOR_CREDITOR"
      ? setDebtorCreditorRefreshSignal(!debtorCreditorRefreshSignal)
      : null;

  return (
    <>
      <IncomeExpensesEntryForm refreshData={refreshData} />
      <Divider sx={{ marginY: 3 }} />
      <DebtorCreditorCards
        refreshData={refreshData}
        debtorCreditorRefreshSignal={debtorCreditorRefreshSignal}
      />
      <IncomeExpensesVisuals
        refreshData={refreshData}
        incomeExpenseRefreshSignal={incomeExpenseRefreshSignal}
      />
    </>
  );
};

export default IncomeExpensesPage;
