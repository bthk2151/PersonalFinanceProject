import { createTheme, ThemeProvider, Box, CssBaseline } from "@mui/material";
import React, { useContext, useState } from "react";
import Topbar from "./components/navigation/Topbar";
import Sidebar from "./components/navigation/Sidebar";
import MainPage from "./components/MainPage";
import AuthContext from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const sidebarMinWidth = 260;
const sidebarWidth = "20%";

const App = () => {
  const { setAuthTokens, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [mode, setMode] = useState(localStorage.getItem("mode") ?? "dark"); // default to dark mode
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Topbar setMobileSidebarOpen={setMobileSidebarOpen} />
      <Box sx={{ display: "flex" }}>
        <Sidebar
          {...{
            mode,
            setMode,
            sidebarWidth,
            sidebarMinWidth,
            mobileSidebarOpen,
            setMobileSidebarOpen,
          }}
        />
        <MainPage />
      </Box>
    </ThemeProvider>
  );
};

export default App;
