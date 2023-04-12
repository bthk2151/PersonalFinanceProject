import { Divider } from "@mui/material";
import React, { useState } from "react";
import IncomeExpensesEntryForm from "./income_expenses/IncomeExpensesEntryForm";
import IncomeExpensesVisuals from "./income_expenses/IncomeExpensesVisuals";

const IncomeExpensesPage = () => {
  const [refreshSignal, setRefreshSignal] = useState(false);
  // whenever this refresh signal is inverted, respective useEffect() will fetch latest income expense data
  const refreshData = () => setRefreshSignal(!refreshSignal);

  return (
    <>
      <IncomeExpensesEntryForm refreshData={refreshData} />
      <Divider sx={{ marginY: 3 }} />
      <IncomeExpensesVisuals
        refreshData={refreshData}
        refreshSignal={refreshSignal}
      />
    </>
  );
};

export default IncomeExpensesPage;
