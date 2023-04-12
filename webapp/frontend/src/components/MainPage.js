import React from "react";
import { Route, Routes } from "react-router-dom";
import AssetsLiabilitiesPage from "./AssetsLiabilitiesPage";
import FinancialGoalPage from "./FinancialGoalPage";
import IncomeExpensesPage from "./IncomeExpensesPage";
import { Paper } from "@mui/material";

const MainPage = () => {
  return (
    <Paper
      component="main"
      square
      sx={{
        flexGrow: 1, // makes the main page spread across the rest of the screen space available, regardless of zoom
        p: 3,
      }}
    >
      <Routes>
        <Route path="/" exact element={<p>Login?</p>} />
        <Route path="/financial-goal" element={<FinancialGoalPage />} />
        <Route path="/assets-liabilities" element={<AssetsLiabilitiesPage />} />
        <Route path="/income-expenses" element={<IncomeExpensesPage />} />
        <Route path="*" element={<p>Hmm, nothing here</p>} />
      </Routes>
    </Paper>
  );
};

export default MainPage;
