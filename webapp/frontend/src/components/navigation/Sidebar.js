import React from "react";
import { Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";

const Sidebar = ({
  mode,
  setMode,
  sidebarWidth,
  sidebarMinWidth,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) => {
  return (
    <Box
      component="nav"
      sx={{
        width: { md: sidebarWidth },
        minWidth: { md: sidebarMinWidth },
        flexShrink: { md: 0 },
      }}
    >
      {/* mobile sidebar */}
      <Drawer
        container={
          window !== undefined ? () => window.document.body : undefined
        }
        variant="temporary"
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarWidth,
            minWidth: sidebarMinWidth,
          },
        }}
      >
        <SidebarItems mode={mode} setMode={setMode} isComprehensive={false} />
      </Drawer>
      {/* desktop sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarWidth,
            minWidth: sidebarMinWidth,
          },
        }}
      >
        <SidebarItems mode={mode} setMode={setMode} isComprehensive={true} />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
