import { createTheme, ThemeProvider, Box } from "@mui/material";
import React, { useState } from "react";
import Topbar from "./components/navigation/Topbar";
import Sidebar from "./components/navigation/Sidebar";
import MainPage from "./components/MainPage";

const sidebarMinWidth = 260;
const sidebarWidth = "20%";

const App = () => {
  const [mode, setMode] = useState("dark");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Topbar setMobileSidebarOpen={setMobileSidebarOpen} />
      <Box sx={{ display: "flex" }}>
        <Sidebar
          setMode={setMode}
          sidebarWidth={sidebarWidth}
          sidebarMinWidth={sidebarMinWidth}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        <MainPage />
      </Box>
    </ThemeProvider>
  );
};

export default App;
