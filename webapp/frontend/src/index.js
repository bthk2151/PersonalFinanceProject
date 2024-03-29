import React from "react";

import App from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthProvider } from "./context/AuthContext";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ActionProvider } from "./context/ActionContext";

const app = $("#app")[0];
const root = createRoot(app);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <ActionProvider>
            <App />
          </ActionProvider>
        </AuthProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
