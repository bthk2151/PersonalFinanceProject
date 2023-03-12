import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import React from "react";
import { Menu } from "@mui/icons-material";

const Topbar = ({ setMobileSidebarOpen }) => {
  return (
    <AppBar position="sticky" color="default">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={() => setMobileSidebarOpen(true)}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <Menu sx={{ color: "default" }} />
        </IconButton>
        <Box p={2} sx={{ display: { xs: "flex", md: "none" }, gap: 2 }}>
          <Typography variant="subtitle1">Bryan</Typography>
          <Avatar
            sx={{ height: 30, width: 30 }}
            src="https://avatars.githubusercontent.com/u/89057437?v=4"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
