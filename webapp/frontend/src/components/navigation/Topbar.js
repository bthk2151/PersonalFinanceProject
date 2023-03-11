import { AppBar, IconButton, Toolbar } from "@mui/material";
import React from "react";
import { Menu } from "@mui/icons-material";

const Topbar = ({ setMobileSidebarOpen }) => {
  return (
    <AppBar position="sticky" color="default">
      <Toolbar>
        <IconButton
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu sx={{ color: "default" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
