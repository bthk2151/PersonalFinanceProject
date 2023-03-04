import { Box, Drawer } from "@mui/material";
import React, { useState } from "react";
import SidebarItems from "./SidebarItems";

const sidebarWidth = 260;

const SidebarMobile = ({ setMode, sidebarOpen, setSidebarOpen }) => {
  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        display: { xs: "block", md: "none" },
      }}
    >
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarWidth,
          },
        }}
      >
        <SidebarItems setMode={setMode} isComprehensive={false} />
      </Drawer>
    </Box>
  );
};

export default SidebarMobile;
