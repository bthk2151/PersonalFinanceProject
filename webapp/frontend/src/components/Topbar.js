import { AppBar, IconButton, Toolbar } from "@mui/material";
import React, { useState } from "react";
import { Menu } from "@mui/icons-material";
import SidebarMobile from "./SidebarMobile";

const Topbar = ({ setMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky" color="default">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            sx={{ display: { xs: "block", sm: "none" } }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu sx={{ color: "default" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SidebarMobile
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setMode={setMode}
      />
    </>
  );
};

export default Topbar;
