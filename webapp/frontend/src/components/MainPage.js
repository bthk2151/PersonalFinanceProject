import React from "react";
import { Route, Routes } from "react-router-dom";
import AssetsLiabilitiesPage from "./AssetsLiabilitiesPage";
import FinancialGoalPage from "./FinancialGoalPage";
import IncomeExpensesPage from "./IncomeExpensesPage";
import { Box } from "@mui/material";

const MainPage = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
      }}
    >
      <Routes>
        <Route path="/" exact element={<p>Login?</p>} />
        <Route path="/financial-goal" element={<FinancialGoalPage />} />
        <Route path="/assets-liabilities" element={<AssetsLiabilitiesPage />} />
        <Route path="/income-expenses" element={<IncomeExpensesPage />} />
        <Route path="*" element={<p>Hmm, nothing here</p>} />
      </Routes>
    </Box>
  );
};

export default MainPage;
