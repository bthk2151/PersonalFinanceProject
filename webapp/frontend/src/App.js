import { createTheme, Stack, ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import AssetsLiabilitiesPage from "./components/AssetsLiabilitiesPage";
import FinancialGoalPage from "./components/FinancialGoalPage";
import IncomeExpensesPage from "./components/IncomeExpensesPage";

const App = () => {
  const [mode, setMode] = useState("dark");
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Topbar setMode={setMode} />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar setMode={setMode} />
        <Routes>
          <Route
            path="/"
            exact
            element={<Typography variant="h1">Login?</Typography>}
          />
          <Route path="/financial-goal" element={<FinancialGoalPage />} />
          <Route
            path="/assets-liabilities"
            element={<AssetsLiabilitiesPage />}
          />
          <Route path="/income-expenses" element={<IncomeExpensesPage />} />
          <Route
            path="*"
            exact
            element={<Typography variant="h1">Hmm, nothing here</Typography>}
          />
        </Routes>
      </Stack>
    </ThemeProvider>
  );
};

export default App;
